public with sharing class DynamicFlowMetadata {

public class FlowPage {
	public FlowPage(FlowPage__c flowPage, Map<String, Dynamic_Flow_Type__mdt> flowTypeMap){
		this.key = flowPage.Flow_Page_Key__c;
		this.type = flowPage.RecordType.Name;
		this.component = flowTypeMap.get(flowPage.RecordType.Name).Lightning_Bundle__c;
		this.componentAttributes = new Map<String, String>();
		this.nextPageKey = flowPage.NextPage__r.Flow_Page_Key__c;
		this.prevPageKey = flowPage.PrevPage__r.Flow_Page_Key__c;
		if(this.type == 'Form'){
			componentAttributes.put('formId', flowPage.Form__c);
		}
	}

	@AuraEnabled
	public String key;

	@AuraEnabled
	public String component;

	@AuraEnabled
	public String type;
	@AuraEnabled
	public String nextPageKey;
	@AuraEnabled
	public String prevPageKey;

	@AuraEnabled
	public Map<String, String> componentAttributes;

}

private Map<String, Dynamic_Flow_Type__mdt> getFlowPageTypes(){
	Dynamic_Flow_Type__mdt[] flowTypeList = [SELECT MasterLabel, DeveloperName, QualifiedApiName, Lightning_Bundle__c FROM Dynamic_Flow_Type__mdt LIMIT 500];
	Map<String, Dynamic_Flow_Type__mdt> flowMap = new Map<String, Dynamic_Flow_Type__mdt>();
	for(Dynamic_Flow_Type__mdt flowType : flowTypeList){
		flowMap.put(flowType.DeveloperName, flowType);
	}
	return  flowMap;
}

public DynamicFlowMetadata(Flow__c flow, List<FlowPage__c> xFlowPages){
	this.startPageKey = flow.Start_Page__r.Flow_Page_Key__c;
	this.flowPages = new List<FlowPage>();
	Map<String, Dynamic_Flow_Type__mdt> flowTypeMap = getFlowPageTypes();
	for(FlowPage__c flowPage : xFlowPages){
		flowPages.add(new FlowPage(flowPage, flowTypeMap));
	}

}

@AuraEnabled
public String flowId;

@AuraEnabled
public Boolean isComplete;

@AuraEnabled
public String startPageKey;

@AuraEnabled
public Boolean validateEmail;

@AuraEnabled
public List<FlowPage> flowPages;
	
}