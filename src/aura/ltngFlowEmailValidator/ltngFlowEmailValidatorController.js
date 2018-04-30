/**
 * Created by tarren.anderson on 6/16/17.
 */
({
    goForward: function(component, event, helper){
        var flowDataId = component.get('v.flowDataId');
        var emailInput = component.get('v.emailInput');
        var action = component.get('c.validateEmailAddress');

        action.setParams({
            'flowDataId' : flowDataId,
            'emailAddr' : emailInput
        });

        action.setCallback(this, function(response){
            var returnValue = response.getReturnValue();
            var state = response.getState();
            if(!returnValue){
                component.set('v.nextError', 'Email validation failed');
            } else{
                helper.gotoNextPage(component);
            }
        });
        $A.enqueueAction(action);
    }
})