/**
 * Created by tarren.anderson on 5/23/17.
 */
({
    doInit: function (component, event, helper) {
        var formData = component.get("v.fd");
        var controlId = component.get("v.fc.Id");
        if(formData[controlId]){
            component.set("v.fieldVal", formData[controlId]);
        }
    },
    handleValueChange : function(component){
        var myEvent = component.getEvent("FormDataResponse");

        myEvent.setParams({"val": component.get("v.fieldVal"), "controlId": component.get("v.fc.Id")});
        myEvent.fire();
    }
})