/**
 * Created by tarren.anderson on 5/25/17.
 */
({
    handleDoInit : function(component, event, helper){
        helper.initDataProvider(component, event, helper);
    },
    initDataProvider : function(component, event, helper){
        $A.createComponent(
            "c:FlowDataProvider",{},
            function(dataProvider, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set('v.dataProvider', dataProvider);
                    helper.getFlowCode(component, event, helper);
                }
            }
        );
    },
    getFlowCode : function(component, event, helper){
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'), sParameterName, i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };
        var flowCode = getUrlParameter('fid');
        component.set('v.flowCode', flowCode);
        console.log('Flow Code : ' + flowCode);
        var dataProvider = component.get('v.dataProvider');
        dataProvider.requestData(flowCode);
    },
    handleDataDispatch : function(component, event, helper){
        var flowData = event.getParam('flowData');

        console.log(flowData);

        component.set('v.flowMeta', flowData);

    }
})