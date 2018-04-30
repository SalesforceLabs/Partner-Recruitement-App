@IsTest
private with sharing class DynamicFlowControllerTest {
    private static Flow__c thisFlow;
    private static Form__c thisForm;
    private static FlowPage__c thisFlowPage;
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

        thisFlowPage = new FlowPage__c();
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
        thisFlowData.Email__c = 'test@example.com';
        insert thisFlowData;

        thisFormData = new Form_Data__c();
        thisFormData.Form__c = thisForm.Id;
        thisFormData.Flow_Data__c = thisFlowData.Id;
        insert thisFormData;
    }

    private static testMethod void initController(){
        DynamicFlowController c = new DynamicFlowController();
        System.assertNotEquals(null, c);
    }

    private static testMethod void testGetFlowInstanceWithBadFlowId(){
        DynamicFlowInstance resp = DynamicFlowController.getFlowInstance('thisBadId', null);

        //Assert null was returned with bad id.
        System.assertEquals(null, resp);
    }

    private static testMethod void testGetFlowInstanceWithFlowId(){
        DynamicFlowInstance resp = DynamicFlowController.getFlowInstance(thisFlowData.Id, null);

        //Assert correct flow instance returned.
        System.assertEquals(thisFlowData.Id, resp.flowMetadata.flowId);
    }

    private static testMethod void testGetFlowInstanceWithFlowCode(){
        String thisCode = [SELECT Code__c FROM Flow_Data__c WHERE Id = : thisFlowData.Id LIMIT 1].Code__c;
        DynamicFlowInstance resp = DynamicFlowController.getFlowInstance(null, thisCode);

        //Assert correct flow instance returned.
        System.assertEquals(thisFlowData.Id, resp.flowMetadata.flowId);
    }

    private static testMethod void testSaveFlowInstanceAsComplete(){
        DynamicFlowController.saveFlowInstance(thisFlowData.Id, true);
        String flowStatus = [SELECT Status__c FROM Flow_Data__c WHERE Id = : thisFlowData.Id LIMIT 1].Status__c;

        //Assert that the flow was saved as complete.
        System.assertEquals('Complete', flowStatus);
    }

    private static testMethod void testSaveFlowInstanceWithPageData(){
        String pageData = '{"' + thisFlowPage.Flow_Page_Key__c + ':{"formDataId" : "' + thisFormData.Id + '"}}';
        DynamicFlowController.saveFlowInstance(thisFlowData.Id, pageData, true);
        String flowStatus = [SELECT Status__c FROM Flow_Data__c WHERE Id = : thisFlowData.Id LIMIT 1].Status__c;

        //Assert that the flow was saved as complete.
        System.assertEquals('Complete', flowStatus);
    }

    private static testMethod void testValidateEmailAddress(){
        //Test valid email
        Boolean isValid = DynamicFlowController.validateEmailAddress(thisFlowData.Id, 'test@example.com');
        System.assertEquals(true, isValid);

        //Test invalid email
        isValid = DynamicFlowController.validAteEmailAddress(thisFlowData.Id, 'test@salesforce.com');
        System.assertEquals(false, isValid);

        //Test null email
        isValid = DynamicFlowController.validAteEmailAddress(thisFlowData.Id, null);
        System.assertEquals(false, isValid);

        //Test Bad Id
        isValid = DynamicFlowController.validAteEmailAddress(thisFlow.Id, 'test@salesforce.com');
        System.assertEquals(false, isValid);
    }
}