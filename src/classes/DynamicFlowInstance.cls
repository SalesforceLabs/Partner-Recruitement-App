public with sharing class DynamicFlowInstance {
	public DynamicFlowInstance(DynamicFlowMetadata flowMetadata, Flow_Data__c flowData) {
		this.flowMetadata = flowMetadata;
		this.flowMetadata.flowId = flowData.Id;
		this.flowMetadata.isComplete = flowData.Status__c == 'Complete';
		this.flowMetadata.validateEmail = flowData.Validate_Email__c;
		this.pageData = flowData.PageData__c;
	}

	@AuraEnabled
	public DynamicFlowMetadata flowMetadata;


	@AuraEnabled
	public String pageData;
	
}