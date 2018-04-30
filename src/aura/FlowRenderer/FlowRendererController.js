/**
 * Created by tarren.anderson on 5/25/17.
 */
({
    doInit : function(component, event, helper){
        console.log('Flow Initialized');
        helper.handleDoInit(component, event, helper);
    },
    handleDataDispatch : function(component, event, helper) {
        console.log('Dispatch Receieved From Provider');
        helper.handleDataDispatch(component, event, helper);
    }
})