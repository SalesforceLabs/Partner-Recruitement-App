({
    gotoNextPage: function(component, persistState) {
        component = component.getConcreteComponent();
        //var dataVal = component.get('v.wizardData')
        //this.log(component, 'TEST wizardData : '+ JSON.stringify(dataVal));
        //        var subHelper = component.getConcreteComponent().getDef().getHelper();
        var nextPage = component.get('v.nextPage');
        this.log(component, 'Calling gotoNext Page: ' + nextPage);
        var wizardEvent = component.getEvent("wizardNavEvent");
        wizardEvent.setParams({ "type": "next" });
        if (nextPage != null) {
            wizardEvent.setParam("page", nextPage);
        }
        if (persistState) {
            wizardEvent.setParam("persistState", true);
        }
        wizardEvent.fire();
    },
    gotoPage: function(component, gotoPage, persistState) {
        this.log(component, 'Calling goto Page');
        var wizardEvent = component.getEvent("wizardNavEvent");
        wizardEvent.setParams({ "type": "goto" });
        if (gotoPage != null) {
            wizardEvent.setParam("page", gotoPage);
        }
        if (persistState) {
            wizardEvent.setParam("persistState", true);
        }
        wizardEvent.fire();
    },
    gotoPrevPage: function(component, persistState) {
        component = component.getConcreteComponent();
        var prevPage = component.get('v.prevPage');
        this.log(component, 'Calling gotoPrev Page: ' + prevPage);
        var wizardEvent = component.getEvent("wizardNavEvent");
        wizardEvent.setParams({ "type": "prev" });
        if (prevPage != null) {
            wizardEvent.setParam("page", prevPage);
        }
        if (persistState) {
            wizardEvent.setParam("persistState", true);
        }
        this.log(component, 'Firing Prev Page Event');
        wizardEvent.fire();
    },

    clearErrors: function(component) {
        component.set("v.nextError", '');
    },

    setNextError: function(component, message) {
        component.set("v.nextError", message);
    },

    setPageState: function(component, persistInfo, sessionData) {
        var pageKey = component.get("v.pageKey");
        // Set data for persistence
        var wizardData = component.get("v.wizardData");
        wizardData.pageData[pageKey] = persistInfo;
        component.set("v.wizardData", wizardData);
        // Set data for session.
        var wizardSessionData = component.get("v.wizardSessionData");
        wizardSessionData.pageData[pageKey] = sessionData;
        component.set("v.wizardSessionData", wizardSessionData);
    },
    getPageDataFromSession: function(component) {
        component = component.getConcreteComponent();
        var pageKey = component.get("v.pageKey");
        var wizardSessionData = component.get("v.wizardSessionData");
        if (wizardSessionData != null && wizardSessionData.pageData != null && wizardSessionData.pageData[pageKey]) {
            return wizardSessionData.pageData[pageKey];
        }
        return {};
    },
    handleSaveOrComplete : function(component, isComplete){
        var action = component.get('v.nextButtonAction');
        if(action){
            action.setCallback(component,
                function(response) {
                    var state = response.getState();
                    var nextActionResult = response.getReturnValue();
                    console.log('STATE : ' + state);
                    console.log('RESULT : ' + nextActionResult);
                    if(nextActionResult !== false){
                        if(isComplete){
                            var wizardEvent = component.getEvent("wizardCompleteEvent");
                            wizardEvent.fire();
                            component.set('v.isComplete', true);
                        } else {
                            component.set('v.successMessage', ' Saved Flow Successfully');
                            helper.persistWizardState(component);
                        }
                    }
                }
            );
            $A.enqueueAction(action);
        } else if(isComplete) {
            var wizardEvent = component.getEvent("wizardCompleteEvent");
            wizardEvent.fire();
            component.set('v.isComplete', true);
        }
    }
})