/**
 * Created by tarren.anderson on 5/23/17.
 */
({
    handleInit : function(component, event, helper){
        console.log('Form Component Initialized');
        component.set("v.formData", {});
        var formDataId = component.get('v.formId');
        if(formDataId){
            $A.createComponent(
                "c:FormDataProvider",{},
                function(dataProvider, status, errorMessage){
                    if (status === "SUCCESS") {
                        component.set('v.dataProvider', dataProvider);
                        console.log('Requesting Data from Form Component');
                        dataProvider.requestData(formDataId);
                    }
                }
            );
        }
    },
    handleFormDataResponse : function(component, event, helper){
        var formData = component.get("v.formData");
        var val = event.getParam("val");
        var controlId = event.getParam("controlId");

        formData[controlId] = val;
        component.set("v.formData", formData);
        console.log(formData);
    },
    handleDataDispatch : function(component, event, helper){
        console.log('recieved data from provider');
        var thisFormId = component.get('v.fid');
        var passedFormId = event.getParam('formId');
        var formMetaData = event.getParam('formData');

        console.log(formMetaData);

        if(formMetaData && formMetaData.formData){
            if(formMetaData.formData.Data__c){
                formMetaData.formData.Data__c  = JSON.parse(formMetaData.formData.Data__c);
            } else {
                formMetaData.formData.Data__c = {};
            }
        }

        component.set('v.fc', formMetaData);
        console.log(formMetaData);
    },
    getFormData: function(component, formId) {
        var action = component.get("c.getFormApex");
        action.setParams({
            "formId": formId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log(response.getState());
            console.log(component.isValid());
            if (component.isValid() && state === "SUCCESS") {
                var thisResult = response.getReturnValue();
                if(thisResult.formData.Data__c) {
                    thisResult.formData.Data__c = JSON.parse(thisResult.formData.Data__c);
                }
                component.set("v.fc", response.getReturnValue());
                console.log(response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    setFormData: function(component) {
        console.log('Returned Event');
        var action = component.get("c.saveFormApex");
        var formData = JSON.stringify(component.get("v.formData"));
        var formId = component.get("v.fc.formData.Id");
        console.log(formData);
        action.setParams({
            "formId": formId,
            "formJSON" : formData
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                console.log('Saved Data');
            }
        });
        $A.enqueueAction(action);
    },
    handleRequestFormData : function(component, event, helper){
        console.log('Requesting Form Data from Controller');
        var requestEvent = component.getEvent('formRequestDataEvent');
        var formId = component.get('v.fid');
        console.log(formId);
        requestEvent.setParams({
            'formId' : formId
        });
        console.log(requestEvent);
        requestEvent.fire();
    },
    handleSaveData : function(component, event, helper){
        console.log('Attempting Save');
        var dataProvider = component.get('v.dataProvider');
        var formId = component.get('v.formId');
        var formData = component.get('v.formData');
        dataProvider.saveData(formId, formData);
    },
    handleFormIsValid : function(component, event, helper){
        console.log('Checking form validity');
    }
})