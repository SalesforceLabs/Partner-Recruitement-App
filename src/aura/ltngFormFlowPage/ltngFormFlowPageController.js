({
	doInit : function(component, event, helper) {
		//helper.log(component, 'In Init of Form Flow Page!');
		helper.initForm(component);
	},
	goForward : function(component, event, helper) {
		//helper.log(component, 'In go Forward of Form Flow Page');
		helper.clearErrors(component);
		return helper.handleSaveAndNext(component);
	}
})