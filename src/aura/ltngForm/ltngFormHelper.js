/**
 * Created by tarren.anderson on 5/23/17.
 */
({
    handleInit : function(component, event, helper){
        var formData = component.get('v.formData');

        //Clean Data
        if(formData && formData.hasOwnProperty('Data__c')){
            formData = formData.Data__c;
            component.set('v.formData', formData);
        }

        var formMetaData = component.get('v.fc');
        var queryData = false;
        if(formData == null || typeof formData != 'object'){
            formData = {};
            component.set('v.formData', formData);
        }
        //Find out what conditions are necessary to query data.
        if(formMetaData === null){
            queryData = true;
        }

        var formId = component.get('v.formId');
        var formDataId = component.get('v.formDataId');
        var recordId = component.get('v.recordId');
        if(recordId){
            formDataId = recordId;
            component.set('v.formDataId', recordId);
        }
        if(formDataId || formId){
            $A.createComponent(
                "c:FormDataProvider",{},
                function(dataProvider, status, errorMessage){
                    if (status === "SUCCESS") {
                        component.set('v.dataProvider', dataProvider);
                        dataProvider.requestData(formId, formDataId);
                    }
                }
            );
        }
    },
    handleFormDataResponse : function(component, event, helper){
        var formData = component.get("v.formData");
        var val = event.getParam("val");
        var controlId = event.getParam("controlId");
        var isValid = event.getParam("isValid");
        var isDirty = event.getParam("isDirty");
        var errors = component.get('v.errors');
        if(!errors) {
            errors = {};
        }
        errors[controlId] = isValid;
        formData[controlId] = val;
        component.set("v.formData", formData);
        component.set('v.errors', errors);
        component.set('v.isDirty', isDirty);
        helper.handleUpdateValidity(component, event, helper, errors);
        helper.handleOutgoingNestedFormDataEvent(component, event, helper);
    },
    handleUpdateValidity : function(component, event, helper, errors) {
        var isComplete = true;
        for(var p in errors) {
            if (errors.hasOwnProperty(p)) {
                if(!errors[p]) {
                    isComplete = false;
                }
            }
        }
        component.set('v.isComplete', isComplete);
    },
    handleSaveDispatch : function(component, event, helper){
        component.set('v.isDirty', false); //Form is no longer dirty after save
        var saveResponse = event.getParam('saveResponse');
        var formDataId = saveResponse.formDataId;
        component.set('v.formDataId', formDataId);
        if(typeof component._saveCallback === 'function'){
            var formData = component.get('v.formData');
            var formMetaData = component.get('v.fc');
            formMetaData.formData.Data__c = formData; //Set the metadata object with current form-state.
            formMetaData.formData.Id = formDataId;
            component._saveCallback({'status' : saveResponse.status, 'statusMessage' : saveResponse.statusMessage, 'formData' : formMetaData});
        }
    },
    handleDataDispatch : function(component, event, helper){
        var thisFormId = component.get('v.formId');
        var passedFormId = event.getParam('formId');
        var formMetaData = event.getParam('formData');
        //component.set('v.isReadOnly', formMetaData.formData.Read_Only__c);

        if(formMetaData && formMetaData.formData){
            if(formMetaData.formData.Data__c){
                if(typeof formMetaData.formData.Data__c !== 'object'){
                    formMetaData.formData.Data__c  = JSON.parse(formMetaData.formData.Data__c);
                }
            } else {
                formMetaData.formData.Data__c = {};
            }
        }

        component.set('v.fc', formMetaData);
        this.handleCustomLabels(component);
        event.stopPropagation();
    },
    handleRequestFormData : function(component, event, helper){
        var requestEvent = component.getEvent('formRequestDataEvent');
        var formId = component.get('v.formId');
        requestEvent.setParams({
            'formId' : formId
        });
        requestEvent.fire();
    },
    handleSaveData : function(component, event, helper){
        var isComplete = component.get('v.isComplete');
        if(isComplete){
            var dataProvider = component.get('v.dataProvider');
            var formDataId = component.get('v.formDataId');
            var formData = component.get('v.formData');
            var formId = component.get('v.formId');
            var flowId = component.get('v.flowDataId');
            dataProvider.saveData(formId, formDataId, flowId, formData);
        } else {
            console.log('Save denied, form is not complete');
        }
    },
    handleFormIsValid : function(component, event, helper){
        component.set('v.showErrors', true);
    },
    handleOutgoingNestedFormDataEvent : function(component, event, helper){
        var formData = component.get('v.formData');
        var formId = component.get('v.formId');
        var formDataEvent = component.getEvent("nestedFormDataEvent");

        formDataEvent.setParams({'formId' : formId, 'formData' : formData});
        formDataEvent.fire();
    },
    handleIncomingNestedFormDataEvent : function(component, event, helper){
        var formId = component.get('v.formId');
        var nestedFormId = event.getParam('formId');
        if(nestedFormId != formId){
            var formData = component.get('v.formData');
            var nestedFormData = event.getParam('formData');
            var mergedFormData = {};
            for(var key in formData) mergedFormData[key] = formData[key];
            for(var key in nestedFormData) mergedFormData[key] = nestedFormData[key];

            component.set('v.formData', mergedFormData);
        }
    },
    handleCustomLabels : function(component) {
        var sectionLabels = {};
        var formSections = component.get('v.fc.formSections');
        formSections.forEach(function (value, index) {
            if(value.Custom_Label__c){
                var labelReference = $A.getReference("$Label.c." + value.Custom_Label__c);
                sectionLabels[value.Id] = labelReference;
            } else {
                sectionLabels[value.Id] = value.Name;
            }
        });
        component.set('v.sectionLabels', sectionLabels);
    }
})