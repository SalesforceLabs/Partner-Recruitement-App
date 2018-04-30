({
    loadDynamicFlowFromDB: function(component) {
        var flowId = component.get("v.flowId");
        var flowCode;
        var sPageURL = decodeURIComponent(window.location.search.substring(1));
        var sURLVariables = sPageURL.split('&');
        var urlParams = {};

        for (var i = 0; i < sURLVariables.length; i++) {
            var thisParam = sURLVariables[i].split('=');
            urlParams[thisParam[0]] = thisParam[1];
        }

        if(urlParams.hasOwnProperty('fid')){
            flowCode = urlParams['fid'];
        }

        var self = this;
        var onSuccess = function(response) {
            var isInternal = component.get('v.isInternalDetail');
            var flowInstance = response.getReturnValue();
            var validateEmail = flowInstance.flowMetadata.validateEmail;
            component.set('v.flowId', flowInstance.flowMetadata.flowId);
            component.set('v.isComplete', flowInstance.flowMetadata.isComplete);
            if ($A.util.isEmpty(flowInstance)) {
                self.error(component, 'Unable to find Flow Instance');
                return;
            }
            var flowData = {
                'flowDataId': flowInstance.flowMetadata.flowId,
                'isComplete': component.getReference('v.isComplete')
            }
            if (flowInstance.hasOwnProperty('pageData')) {
                flowData['pageData'] = JSON.parse(flowInstance.pageData);
            }
            component.set("v.flowData",flowData);

            var flowMetadata = flowInstance.flowMetadata;
            var validateEmail = validateEmail && !isInternal;

            if (flowMetadata != null && flowMetadata.flowPages != null && flowMetadata.flowPages.length > 0) {

                if(validateEmail){
                    var emailStep = {
                        'key': 'email_step',
                        'component': 'c:ltngFlowEmailValidator',
                        'componentAttributes': {'flowDataId' : flowInstance.flowMetadata.flowId},
                        'nextPageKey': flowMetadata.startPageKey
                    }
                    flowMetadata.flowPages.unshift(emailStep);
                }

                var wizardMetadata = {};
                for (var i = 0; i < flowMetadata.flowPages.length; i++) {
                    var pageKey = flowMetadata.flowPages[i].key;
                    var page = {
                        'key': pageKey,
                        'component': flowMetadata.flowPages[i].component,
                        'componentAttributes': flowMetadata.flowPages[i].componentAttributes,
                        'next': flowMetadata.flowPages[i].nextPageKey,
                        'prev': flowMetadata.flowPages[i].prevPageKey
                    }
                    wizardMetadata[pageKey] = page;
                }
                if(validateEmail){
                    component.set("v.startPageKey", emailStep.key);
                } else {
                    component.set("v.startPageKey", flowMetadata.startPageKey);
                }

                component.set("v.metadata", wizardMetadata);

            }


        };

        if(flowCode || flowId){
            this.executeApex(component, 'c.getFlowInstance', { 'instanceId': flowId, 'flowDataCode': flowCode }, onSuccess);
        }
    },
    saveFlowInstanceComplete: function(component) {
        var flowId = component.get("v.flowId");
        var isComplete = component.get('v.isComplete');
        var onSuccess = function(response) {
            //Success msg
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": 'Success',
                "message": 'Form has been saved',
                "type": 'success',
                "mode": 'dismissible',
                "duration" : 2000
            });
            toastEvent.fire();
        }
        this.executeApex(component, 'c.saveFlowInstance', { 'instanceId': flowId, 'isComplete' : isComplete }, onSuccess);
    },
    saveFlowInstanceToDB: function(component, flowData) {
        var flowId = component.get("v.flowId");
        var isComplete = component.get('v.isComplete');
        var onSuccess = function(response) {
            //Success msg
            if(!isComplete){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": 'Success',
                    "message": 'Form has been saved',
                    "type": 'success',
                    "mode": 'dismissible',
                    "duration" : 2000
                });
                toastEvent.fire();
            }
        }
        this.executeApex(component, 'c.saveFlowInstance', { 'instanceId': flowId, 'pageData': JSON.stringify(flowData.pageData), 'isComplete' : isComplete }, onSuccess);
    }
})