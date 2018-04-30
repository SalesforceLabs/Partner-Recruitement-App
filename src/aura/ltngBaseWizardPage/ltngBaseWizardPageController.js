({
	goBack : function(component, event, helper) {
        helper.gotoPrevPage(component);
	},
    goForward: function(component, event, helper) {
        helper.gotoNextPage(component);
    },
    handleSaveForLater : function(component, event, helper){
        helper.handleSaveOrComplete(component, false);
    },
    handleComplete : function(component, event, helper){
        helper.handleSaveOrComplete(component, true);
    }
})