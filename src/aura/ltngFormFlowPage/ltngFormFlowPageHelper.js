({
    initForm: function(component) {
        var wizardData = component.get('v.wizardData');
        var pageKey = component.get("v.pageKey");
        component.set('v.isComplete', wizardData.isComplete);
        var isComplete = component.getReference('v.isComplete');
        var formDataAttributes = {'isReadOnly' : isComplete, 'flowDataId' : wizardData.flowDataId, 'formId': component.get("v.formId") };
        var pageData = this.getPageDataFromSession(component);

        for (var attr in pageData) {
            formDataAttributes[attr] = pageData[attr];
        }
        this.createComponent(component, 'c:ltngForm', formDataAttributes, function(formCmp) {
            component.set("v.formCmp", formCmp);
        })

    },
    handleSaveAndNext: function(component) {
        var formCmp = component.get("v.formCmp");
        var self = this;
        if (formCmp != null) {
            formCmp = formCmp[0]; // We support currently one form per page..
            var isFormComplete = formCmp.get("v.isComplete");
            if (!isFormComplete) {
                formCmp.validate();
                self.setNextError(component, 'Please fix errors in form above.');
                //TODO - Show user to fix errors..
            } else {
                formCmp.saveForm(function(form) {
                    if(form.status == 'success'){
                        var pageKey = component.get("v.pageKey");
                        var formData = form.formData.formData;
                        self.setPageState(component, {'formDataId': formData.Id}, {'formDataId': formData.Id,'formData': formData});
                        self.gotoNextPage(component, true);
                    } else {
                        self.setNextError(component, form.statusMessage);
                    }
                });
            }
        } else {
            self.gotoNextPage(component);
        }
        return isFormComplete;
    }
})