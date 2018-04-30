public with sharing class DynamicFlowController {

    public DynamicFlowController() {}

    @AuraEnabled
    public static Boolean validateEmailAddress(Id flowDataId, String emailAddr){
        if(flowDataId == null || emailAddr == null){
            return false;
        }

        // Check FLS for the fields being queried.
        Map<String, Schema.SObjectField> m = Schema.SObjectType.Flow_Data__c.fields.getMap();

        if(!hasFieldAccess('Flow_Data__c', new List<String>{'Email__c'}, false)){
            throw new System.NoAccessException();
            return false;
        }

        List<Flow_Data__c> flowDataList = [SELECT Email__c FROM Flow_Data__c WHERE Id = : flowDataId LIMIT 1];
        if(flowDataList.isEmpty()){
            return false;
        }
        return flowDataList[0].Email__c == emailAddr;
    }

    @AuraEnabled
    public static DynamicFlowInstance getFlowInstance(String instanceId, String flowDataCode){
        List<Flow_Data__c> flowDataList;
        List<String> flowDataFields = new List<String>{
            'Name',
            'Code__c',
            'Flow__c',
            'PageData__c',
            'Status__c',
            'Validate_Email__c'
        };

        List<String> flowPageFields = new List<String>{
            'Flow_Page_Key__c',
            'Form__c',
            'RecordType.Name',
            'NextPage__c',
            'PrevPage__c'
        };

        if(!hasFieldAccess('Flow_Data__c', flowDataFields, false) || !hasFieldAccess('FlowPage__c', flowPageFields, false)){
            //throw new System.NoAccessException();
            throw new AuraHandledException('Insufficient Profile Access');
            System.debug('No Access Exception @ DynamicFlowController.getFlowInstance');
            return null;
        }


        if(flowDataCode != null){
            flowDataList = [SELECT Name, Code__c, Flow__c, Flow__r.Start_Page__r.Flow_Page_Key__c, PageData__c, Status__c, Validate_Email__c From Flow_Data__c Where Code__c= :flowDataCode];
        } else{
            flowDataList = [SELECT Name, Code__c, Flow__c, Flow__r.Start_Page__r.Flow_Page_Key__c, PageData__c, Status__c, Validate_Email__c From Flow_Data__c Where Id = :instanceId];
        }
        if(flowDataList ==null || flowDataList.size() <=0){
            return null;
        }
        Flow_Data__c flowData = flowDataList[0];

        List<FlowPage__c> flowPages = [SELECT Flow_Page_Key__c, Form__c, RecordType.Name, NextPage__r.Flow_Page_Key__c, PrevPage__r.Flow_Page_Key__c From FlowPage__c Where Flow__c = : flowData.Flow__c];
        DynamicFlowMetadata flowMeta = new DynamicFlowMetadata(flowData.Flow__r, flowPages);
        return new DynamicFlowInstance(flowMeta, flowData);
    }

    @AuraEnabled
    public static void saveFlowInstance(String instanceId, Boolean isComplete){
        saveFlowInstance(instanceId, null, isComplete);
    }

    @AuraEnabled
    public static void saveFlowInstance(String instanceId, String pageData, Boolean isComplete){
        System.debug(instanceId);
        System.debug(pageData);

        List<String> flowDataFields = new List<String>{'Status__c', 'PageData__c'};
        List<String> formDataFields = new List<String>{'Read_Only__c'};

        if(!hasFieldAccess('Flow_Data__c', flowDataFields, true) || !hasFieldAccess('Form_Data__c', formDataFields, true)){
            throw new AuraHandledException('Insufficient Profile Access');
        } else {
            List<Flow_Data__c> flowDataList =  [SELECT Name, PageData__c From Flow_Data__c Where Id = :instanceId];

            if(flowDataList !=null && flowDataList.size()>0){
                if(pageData != null){
                    flowDataList[0].PageData__c = pageData;
                }
                flowDataList[0].Status__c = isComplete ? 'Complete' : 'In-Progress';
                update flowDataList[0];
            }

            //If the flow is complete, we lock all the corresponding form data objects as read only.
            if(isComplete){
                List<Form_Data__c> dataToUpdate = new List<Form_Data__c>();
                for(Form_Data__c fd : [SELECT Read_Only__c FROM Form_Data__c WHERE Flow_Data__c = : instanceId AND Read_Only__c != true]){
                    fd.Read_Only__c = true;
                    dataToUpdate.add(fd);
                }
                if(!dataToUpdate.isEmpty()){
                    update dataToUpdate;
                }
            }
        }
    }

    private static Boolean hasFieldAccess(String objectName, List<String> fields, Boolean isUpdate){
        Map<String,Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Schema.SObjectType sobjType = gd.get(objectName);
        Schema.DescribeSObjectResult r = sobjType.getDescribe();
        Map<String,Schema.SObjectField> m = r.fields.getMap();
        
        for(String s : fields){
            if(isUpdate){
                if (m.get(s) != null && !m.get(s).getDescribe().isUpdateable()) {
                    return false;
                }
            }
            else{
                if (m.get(s) != null && !m.get(s).getDescribe().isAccessible()) {
                    return false;
                }
            }
        }
        return true;
    }
}