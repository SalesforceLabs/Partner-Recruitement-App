{
    doInit: function(component, event, helper) {
        helper.handleInit(component, event, helper);
    },
    handleFormDataResponse: function(component, event, helper) {
        helper.handleFormDataResponse(component, event, helper);
    },
    handleSaveData : function(component, event, helper){
        var params = event.getParam('arguments');
        var callback= null;
        if(params.hasOwnProperty('callback')){
            callback = params['callback'];
        }
        component._saveCallback = callback;
        helper.handleSaveData(component, event, helper);
    },
    handleDataDispatch : function(component, event, helper){
        helper.handleDataDispatch(component, event, helper);
    },
    handleSaveDispatch : function(component, event, helper){
        helper.handleSaveDispatch(component, event, helper);
    },
    handleFormIsValid : function(component, event, helper){
        helper.handleFormIsValid(component, event, helper);
    },
    handleIncomingNestedFormDataEvent : function(component, event, helper){
        helper.handleIncomingNestedFormDataEvent(component, event, helper);
    }
}