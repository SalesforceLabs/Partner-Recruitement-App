/**
 * Created by tarren.anderson on 6/15/17.
 */
({
    doInit : function(component, event, helper){
        var customLabelKey = component.get('v.customLabelKey');
        var staticLabel = component.get('v.staticLabel');
        component.set('v.labelValue', staticLabel);
        if(customLabelKey && customLabelKey.length){
            var labelReference = $A.getReference('$Label.c.' + customLabelKey);
            component.set('v.labelValue', labelReference);
        } else if(staticLabel && staticLabel.length) {
            component.set('v.labelValue', staticLabel);
        }
    }
})