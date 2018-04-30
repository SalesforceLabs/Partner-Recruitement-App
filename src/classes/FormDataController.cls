public with sharing class FormDataController {

    @AuraEnabled
    public static SaveResponse saveFormApex(Id formId, Id formDataId, Id flowDataId, String formData){
        SaveResponse resp = new SaveResponse();

        List<String> formDataFields = new List<String>{'Form__c', 'Data__c', 'Flow_Data__c'};

        if(!hasFieldAccess('Form_Data__c', formDataFields, true)){
            throw new AuraHandledException('Insufficient Profile Access');
            resp.status = 'error';
            resp.statusMessage = 'Insufficient Profile Access';
            return resp;
        }

        try{
            resp.status = 'success';
            Form_Data__c fd = new Form_Data__c();
            fd.Data__c = formData;
            if(formDataId != null){
                fd.Id = formDataId;
            }
            if(formId != null){
                fd.Form__c = formId;
            }
            if(flowDataId != null){
                fd.Flow_Data__c = flowDataId;
            }
            upsert fd;
            resp.formDataId = fd.Id;

        } catch(Exception e){
            resp.status = 'error';
            resp.statusMessage = e.getMessage();
            System.debug(LoggingLevel.ERROR, e);
        }
        return resp;
    }

    @AuraEnabled
    public static FormObject getFormApex(Id formId, Id formDataId){

        System.debug('FormId ' + formId);
        System.debug('Form Data Id ' + formDataId);
        FormObject fo = new FormObject();
        if(formDataId == null && formId == null){
            System.debug('Returned Null');
            return null;
        }

        //Check field access

        List<String> formDataFields = new List<String>{'Form__c', 'Data__c', 'Flow_Data__c', 'Form__c', 'Read_Only__c'};
        List<String> formSectionFields = new List<String>{'Name', 'Custom_Label__c'};
        List<String> formControlFields = new List<String>{'Name', 'Label__c', 'Required__c', 'Type__c', 'Form__c', 'Form_Lookup__c', 'Values__c', 'Static_Text__c', 'Custom_Label__c', 'Weight__c'};

        if (!hasFieldAccess('Form_Data__c', formDataFields, false) ||
            !hasFieldAccess('Form_Control__c', formControlFields, false) ||
            !hasFieldAccess('Form_Section__c', formSectionFields, false)){
            throw new AuraHandledException('Insufficient Profile Access');
            return null;
        }
        if(formDataId != null){
            for(Form_Data__c fd : [SELECT Data__c, Form__c, Form__r.Name, Email__c, Read_Only__c FROM Form_Data__c WHERE Id = : formDataId]){
                if(formId == null){
                    System.debug('Set form id to : ' + fd.Form__c);
                    formId = fd.Form__c;
                }
                if(fd.Data__c == null){
                    fd.Data__c = '{}';
                }
                fo.formData = fd;
            }
        }
        for(Form_Section__c fs : [SELECT Name, Custom_Label__c, (SELECT Id, Name, Label__c, Required__c, Type__c, Form__c, Form_Lookup__c, Values__c, Static_Text__c, Custom_Label__c  FROM Form_Control__r Order By Weight__c) from Form_Section__c WHERE Form__c = : formId Order By Weight__c]){
            fo.formSections.add(fs);
        }
        system.debug(fo);
        return fo;
    }

    private static Boolean hasFieldAccess(String objectName, List<String> fields, Boolean isUpsert){
        Map<String,Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Schema.SObjectType sobjType = gd.get(objectName);
        Schema.DescribeSObjectResult r = sobjType.getDescribe();
        Map<String,Schema.SObjectField> m = r.fields.getMap();

        Set<String> nonPrefixFields = new Set<String>{'Name', 'RecordType.Name'};

        for(String s : fields){
            if(isUpsert){
                if (m.get(s) != null && (!m.get(s).getDescribe().isUpdateable() || !m.get(s).getDescribe().isCreateable())) {
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

    @TestVisible
    private Class SaveResponse{
        @AuraEnabled
        public Id formDataId;
        @AuraEnabled
        public String status;
        @AuraEnabled
        public String statusMessage;
    }

    @TestVisible
    private Class FormObject{
        @AuraEnabled
        public Form_Data__c formData = new Form_Data__c();
        @AuraEnabled
        public List<Form_Section__c> formSections = new List<Form_Section__c>();
    }
}