({
    showToast: function(component, title, message, type, mode) {
        var toastEvent = $A.get("e.force:showToast");
        if (type == null) {
            type = 'info';
        }
        if (mode == null) {
            mode = 'dismissible';
        }
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": mode
        });
        toastEvent.fire();
    },
    log: function(component, message) {
        if (component.get("v.debugMode")) {
            console.log(message);
        }
    },
    // Helper method to show success message.Check 'ClearMessages' method as well.
    success: function(component, title, message) {
        //   component.set('v.message', { 'title': title, 'text': message, 'severity': 'confirm', 'closable': true });
        this.showToast(component, title, message, 'success');
    },

    // Helper method to show error message.Check 'ClearMessages' method as well.
    error: function(component, title, message) {
        //     component.set('v.message', { 'title': title, 'text': message, 'severity': 'error', 'closable': true });
        this.showToast(component, title, message, 'error');
    },

    // Helper method to navigate to SObject
    navigateToSObject: function(component, recordId) {
        $A.get("e.force:navigateToSObject").setParams({
            "recordId": recordId
        }).fire();
    },
    // Helper method to show warning message. Check 'ClearMessages' method as well.
    warn: function(component, title, message) {
        //       component.set('v.message', { 'title': title, 'text': message, 'severity': 'warn', 'closable': true });
        this.showToast(component, title, message, 'warning');
    },

    // Helper method to navigate to a any URL.
    navigateToURL: function(component, url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
    },

    createComponents: function(component, componentDefList, callback) {
        var self = this;
        if (componentDefList == null) {
            this.error(component, "Error creating component list, no data passed");
            return;
        }

        $A.createComponents(componentDefList,
            function(components, status, errorMessage) {
                if (status === "SUCCESS") {
                    if (callback) {
                        callback(components);
                    }
                } else {
                    self.error(component, "Error Creating components!");
                }
            });
    },
    createComponent: function(component, componentDef, attributes, callback) {


        if (componentDef == null) {
            this.error(component, "Error creating component list, no data passed");
            return;
        }
        var self = this;
        $A.createComponent(componentDef, attributes,
            function(newComponent, status, errorMessage) {
                if (status === "SUCCESS") {
                    if (callback) {
                        callback(newComponent);
                    }
                } else {
                    self.error(component, "Error Creating component: " + errorMessage);
                }
            });
    },
    executeApex: function(component, actionName, params, onsuccess, onerror) {
        var action = component.get(actionName);
        if (params != null) {
            action.setParams(params);
        }
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if (onsuccess) {
                    onsuccess(response);
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.log(errors);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        self.error(component, 'ActionError', 'Error executing ' + actionName + ': ' + errors[0].message);
                    } else {

                    }
                } else {
                    self.error(component, 'ActionError', 'Error executing ' + actionName);
                }
                if (onerror) {
                    onerror();
                }
            }
        });
        $A.enqueueAction(action);
    },

})