/**
 * Created by tarren.anderson on 5/24/17.
 */
({
    handleSaveFormData : function(component, event, helper) {
       //save Data
        var params = event.getParam('arguments');
        var formId = (params.formId === undefined ? null : params.formId);
        var formDataId = (params.formDataId === undefined ? null : params.formDataId);
        var flowDataId = (params.flowDataId === undefined ? null : params.flowDataId);
        var formData = JSON.stringify(params.formData);
        var action = component.get('c.saveFormApex');

        action.setParams({
            'formId' : formId,
            'formDataId' : formDataId,
            'flowDataId' : flowDataId,
            'formData' : formData
        });

        action.setCallback(this, function(response){
            var returnValue = response.getReturnValue();
            var state = response.getState();
            if (state === 'SUCCESS') {
                helper.dispatchSaveData(component, event, helper, returnValue);
            }
            else {
                //Fire Error Event Here.
            }
        });
        $A.enqueueAction(action);
    },
    handleRequestFormData : function(component, event, helper) {
        //Get Data Here
        var params = event.getParam('arguments');
        var formId  = (params.formId === undefined ? null : params.formId);
        var formDataId = (params.formDataId === undefined ? null : params.formDataId);
        var action = component.get('c.getFormApex');

        action.setParams({
            'formId' : formId,
            'formDataId' : formDataId
        });

        action.setCallback(this, function(response){
            var returnValue = response.getReturnValue();
            var state = response.getState();

            if (state === 'SUCCESS') {
                helper.dispatchFormData(component, event, helper, formDataId, returnValue);
            }
            else {
                //Fire Error Event Here.
            }
        });

        $A.enqueueAction(action);
    },
    dispatchSaveData : function(component, event, helper, saveResponse){
        var dispatchEvent = component.getEvent('formDispatchSaveEvent');
        dispatchEvent.setParams({
            'saveResponse' : saveResponse
        });
        //console.log(dispatchEvent);
        dispatchEvent.fire();
    },
    dispatchFormData : function(component, event, helper, formId, formData) {
        //Fire event with data here.
        var dispatchEvent = component.getEvent('formDispatchDataEvent');

        dispatchEvent.setParams({
            'formId' : formId,
            'formData' : formData
        });

        dispatchEvent.fire();
    }

})