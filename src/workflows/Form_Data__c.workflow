<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>Form_Data_Code</fullName>
        <description>Sets the form data code when a new form data object is created.</description>
        <field>Code__c</field>
        <formula>Right(Name, 4) + Text(Day(Today()))+ Id + Text(Year(Today())) + Text(Month(Today()))</formula>
        <name>Form Data Code</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Form Data Created</fullName>
        <actions>
            <name>Form_Data_Code</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <formula>true</formula>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
