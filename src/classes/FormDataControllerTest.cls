@IsTest
private with sharing class FormDataControllerTest {

    private static Flow__c thisFlow;
    private static Form__c thisForm;
    private static Flow_Data__c thisFlowData;
    private static Form_Data__c thisFormData;
    private static Form_Control__c thisControl;

    static{

        thisFlow = new Flow__c();
        thisFlow.Community_URL__c = 'testurl';
        insert thisFlow;

        thisForm = new Form__c();
        thisForm.Version__c = 1;
        insert thisForm;

        FlowPage__c thisFlowPage = new FlowPage__c();
        thisFlowPage.Flow__c = thisFlow.Id;
        thisFlowPage.Form__c = thisForm.Id;
        thisFlowPage.Flow_Page_Key__c = 'this-flow-page';
        insert thisFlowPage;

        Form_Section__c thisSection = new Form_Section__c();
        thisSection.Name = 'Test Section';
        thisSection.Form__c = thisForm.Id;
        insert thisSection;

        thisControl = new Form_Control__c();
        thisControl.Form__c = thisForm.Id;
        thisControl.Form_Section__c = thisSection.Id;
        thisControl.Label__c = 'My Label';
        thisControl.Type__c = 'Text';
        insert thisControl;

        thisFlowData = new Flow_Data__c();
        thisFlowData.Flow__c = thisFlow.Id;
        insert thisFlowData;

        thisFormData = new Form_Data__c();
        thisFormData.Form__c = thisForm.Id;
        insert thisFormData;
    }

    static testMethod void testSaveFormApex(){
        String formData = '{"' + thisControl.Id + '" : "My Test Value"}';
        FormDataController.SaveResponse resp = FormDataController.saveFormApex(thisForm.Id, thisFormData.Id, thisFlowData.Id, formData);

        //Assert call completed successfully.
        System.assertEquals('success', resp.status);
        System.assertEquals(thisFormData.Id, resp.formDataId);

        //Assert data was saved.
        List<Form_Data__c> queriedFormData = [SELECT Data__c FROM Form_Data__c WHERE Id = : thisFormData.Id LIMIT 1];
        System.assertEquals(true, queriedFormData[0].Data__c.contains('My Test Value'));
    }

    static testMethod void testSaveFormApexException(){
        String formData = '{"' + thisControl.Id + '" : "My Test Value"}';
        //Pass an invalid Id for the flowData to generate exception (thisFlow vs thisFlowData).
        FormDataController.SaveResponse resp = FormDataController.saveFormApex(thisForm.Id, thisFormData.Id, thisFlow.Id, formData);

        //Assert call failed.
        System.assertEquals('error', resp.status);
    }

    static testMethod void testGetFormApex(){
        FormDataController.FormObject resp = FormDataController.getFormApex(thisForm.Id, thisFormData.Id);

        //Assert formdata and sections are returned.
        System.assertEquals(thisFormData.Id, resp.FormData.Id);
        System.assertEquals(1, resp.formSections.size());
    }
    static testMethod void testGetFormApexWithoutFormId(){
        FormDataController.FormObject resp = FormDataController.getFormApex(null, thisFormData.Id);

        //Assert formdata and sections are returned.
        System.assertEquals(thisFormData.Id, resp.FormData.Id);
        System.assertEquals(1, resp.formSections.size());
    }
    static testMethod void testGetFormApexWithNoIds(){
        FormDataController.FormObject resp = FormDataController.getFormApex(null, null);

        //Assert null response
        System.assertEquals(null, resp);
    }
}