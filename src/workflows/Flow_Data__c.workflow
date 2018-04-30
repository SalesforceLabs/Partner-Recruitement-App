<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>Email_Lead_Owner_on_Flow_Data_Complete</fullName>
        <description>Email Lead Owner on Flow Data Complete</description>
        <protected>false</protected>
        <recipients>
            <type>campaignMemberDerivedOwner</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>SmartForms/Lead_Flow_Notification</template>
    </alerts>
    <alerts>
        <fullName>Lead_Assignment</fullName>
        <description>Lead Assignment</description>
        <protected>false</protected>
        <recipients>
            <field>Email__c</field>
            <type>email</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>SmartForms/Lead_Assignment</template>
    </alerts>
    <fieldUpdates>
        <fullName>Flow_Data_Code</fullName>
        <field>Code__c</field>
        <formula>Right(Name, 4) + Text(Day(Today()))+ Id + Text(Year(Today())) + Text(Month(Today()))</formula>
        <name>Flow Data Code</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Flow_Data_email_update</fullName>
        <field>Email__c</field>
        <formula>Lead__r.Email</formula>
        <name>Flow Data email update</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Flow Data Complete</fullName>
        <actions>
            <name>Email_Lead_Owner_on_Flow_Data_Complete</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Flow_Data__c.Status__c</field>
            <operation>equals</operation>
            <value>Complete</value>
        </criteriaItems>
        <description>Runs when flow data status set to Complete</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Flow Data Created</fullName>
        <actions>
            <name>Flow_Data_Code</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <formula>true</formula>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Lead Assignment</fullName>
        <actions>
            <name>Lead_Assignment</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Flow_Data__c.Status__c</field>
            <operation>equals</operation>
            <value>Ready</value>
        </criteriaItems>
        <description>Email lead when questionnaire is assigned to them.</description>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Update email on Flow Data</fullName>
        <actions>
            <name>Flow_Data_email_update</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Flow_Data__c.Has_Lead__c</field>
            <operation>equals</operation>
            <value>True</value>
        </criteriaItems>
        <description>Update email on Flow Data for lead</description>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
