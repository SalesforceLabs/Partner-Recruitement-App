({
    doInit: function(component, event, helper) {
        helper.loadDynamicFlowFromDB(component);
        return;

        var flowMetadata = component.get("v.metadata");
        /*
        component.set("v.startPageKey", "page1");
        component.set("v.flowData", {
        	'pageData': {
        		'page1': {'formDataId': 'a0F46000000OKfT'}
        	}
        });
        component.set("v.metadata", {
            'page1': { 'key': 'page1', 'name': 'c:ltngFormFlowPage', 'attributes': {'formId' : 'a0C460000011LNu'}, 'next': 'page2' ,'title': 'Form Page'},
            'page2': { 'key': 'page2', 'name': 'c:ltngFormFlowPage', 'next': 'page3', 'prev' : 'page1'},
            'page3': { 'key': 'page3', 'name': 'c:ltngFormFlowPage', 'prev': 'page2' }
        });
        */
    },
    saveFlowState: function(component, event, helper){
    	var flowData = event.getParam("wizardData");
    	helper.saveFlowInstanceToDB(component, flowData);

    },
    handleWizardComplete : function(component, event, helper){
        component.set('v.isComplete', true);
        helper.saveFlowInstanceComplete(component);
    }
})