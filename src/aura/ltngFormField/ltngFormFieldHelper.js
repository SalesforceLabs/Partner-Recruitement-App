({
	doInit : function(component, event, helper){
	    component._hasValidation = true;
		var pattern, placeholder;
        var formData = component.get("v.fd");
        var control = component.get("v.fc");
        var controlId = control.Id;
        var readOnly = component.getReference('v.isReadOnly');
        var fieldVal = component.getReference('v.fieldVal');
        var isChecked = component.getReference('v.checked');
        var validity = component.getReference('v.validity');

        component._handledValidity = false;

        if(control.Type__c == 'Phone'){
        	pattern = '^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$';
        	placeholder = '123-456-7890';
		} else if(control.Type__c == 'Email'){
			placeholder = 'example@example.com'
		}

        if(formData && formData.hasOwnProperty(controlId)){
            component.set("v.fieldVal", formData[controlId]);
            if(control.Type__c == 'Toggle'){
            	component.set('v.checked', formData[controlId]);
			}
			else if(control.Type__c == 'Toggle Multiple'){
                fieldVal = formData[controlId];

            }
        }

        var typeMap = {
        	'Email' : 'email',
			'Phone' : 'tel',
        	'Date' : 'date',
			'DateTime' : 'datetime-local',
			'Toggle' : 'toggle',
			'Toggle Multiple' : 'togglemultiple',
			'Picklist' : 'picklist',
            'TextArea' : 'textarea',
            'Static Text' : 'statictext'
		};

        var mappedType = typeMap[control.Type__c];

        var vals = [];
        if(control.Values__c){
        	vals = control.Values__c.split(',');
        }

        var thisLabel = control.Label__c;

        //Label Configuration
        if(control.Custom_Label__c){
            var labelReference = $A.getReference("$Label.c." + control.Custom_Label__c);
            component.set("v.tempLabelAttr", labelReference);
            thisLabel = component.getReference("v.tempLabelAttr");
        }

        var attributes = {
            'name' : control.Name,
            'label' : thisLabel,
			'value' : fieldVal,
			'validity' : validity,
			'required' : control.Required__c,
			'readonly' : readOnly,
			'disabled' : readOnly
        };
        if(placeholder){
        	attributes['placeholder'] = placeholder;
		}
		if(pattern){
        	attributes['pattern'] = pattern;
		}
        if(mappedType){
        	attributes['type'] = mappedType;
        	if(mappedType == 'toggle'){
        		//attributes['messageToggleActive'] = vals[0];
        		//attributes['messageToggleInactive'] = vals[1];
        		attributes['onclick'] = '{!c.handleValueChange}';
        		attributes['value'] = true;
        		attributes['checked'] = isChecked;
			}
		}
        var self = this;
        if(mappedType == 'togglemultiple'){
            this.handleCreateToggleMultiple(component, event, helper, attributes, vals);
            component._hasValidation = false;
        }
        else if(mappedType == 'picklist'){
			this.handleCreatePicklist(component, event, helper, attributes, vals);
		} else if(mappedType == 'textarea') {
            $A.createComponent(
                "lightning:textarea",attributes,
                function(inputCmp, status, errorMessage){
                    component.set('v.inputCmp',inputCmp);
                }
            );
        } else if(mappedType == 'statictext'){
		    attributes = {
		        'value' : control.Static_Text__c,
                'class' : 'uiOutputRichText'
            };

            $A.createComponent(
                "ui:outputRichText",attributes,
                function(inputCmp, status, errorMessage){
                    component.set('v.inputCmp',inputCmp);
                }
            );

            helper.handleNoValidation(component);
        } else {
            $A.createComponent(
                "lightning:input",attributes,
                function(inputCmp, status, errorMessage){
                    component.set('v.inputCmp',inputCmp);
                }
            );
		}
	},
    handleCreateToggleMultiple : function(component, event, helper, attributes, vals){
        var self = this;
        var fieldVals = [];
        var readOnly = component.getReference('v.isReadOnly');
        var findVal = function(thisVal){
            return fieldVals.indexOf(thisVal) > -1;
        }
	    if(attributes.value.length){
	        fieldVals = attributes['value'].split(',');
        }
        $A.createComponent('aura:html', {'tag' : 'div'}, function(inputCmp, status, errorMessage) {
            var inputCmpBody = inputCmp.get('v.body');
            $A.createComponent('ui:outputText', {'value' : attributes['label'], 'class' : 'slds-form-element__label'}, function(thisLabel, status, errorMessage) {
                inputCmpBody.push(thisLabel);
                inputCmp.set('v.body', inputCmpBody);
            });
            for(var i = 0; i < vals.length; i++){
                $A.createComponent('ui:inputCheckbox', {'disabled' : readOnly, 'class' : 'multibox', 'labelClass' : 'multibox slds-checkbox__label', 'label' : vals[i], 'value' : findVal(vals[i])}, function(thisChk, status, errorMessage) {
                    thisChk.addHandler("click", component, "c.handleToggleMultiple");
                    inputCmpBody.push(thisChk);
                    inputCmp.set('v.body', inputCmpBody);
                });
            }
            component.set('v.inputCmp', [inputCmp]);
            helper.handleNoValidationWithValue(component);
        });
    },
	handleCreatePicklist : function(component, event, helper, attributes, vals){
        var self = this;
        var optionComponentDef = [];
        optionComponentDef.push(["aura:html", {
            "tag": "option",
            "HTMLAttributes": {
                "value": 'Select a Value',
                "text": 'Select a Value'
            }
        }]);
        if (vals != null && vals.length > 0) {
            for (var i = 0; i < vals.length; i++) {
                optionComponentDef.push(["aura:html", {
                    "tag": "option",
                    "HTMLAttributes": {
                        "value": vals[i],
                        "text": vals[i]
                    }
                }]);
            }
        } else {
            optionComponentDef.push(["aura:html", {
                "tag": "option",
                "HTMLAttributes": {
                    "value": '--NO_OPTIONS--',
                    "text": 'No Options'
                }
            }]);
        }

        // Create Select Component
        $A.createComponent('lightning:select', attributes, function(inputCmp, status, errorMessage) {
            var inputCmpBody = inputCmp.get("v.body");
            $A.createComponents(optionComponentDef,
				function(optionComponents, status, errorMessage) {
					if (optionComponents != null) {
						for (var i = 0; i < optionComponents.length; i++) {
							inputCmpBody.push(optionComponents[i]);
							inputCmp.set("v.body", inputCmpBody);
						}
					}
					var body = component.get("v.body");
					component.set("v.inputCmp", [inputCmp]);
            	}
            );
        });
	},
	handleValidityInit : function(component, event, helper){
        if(!component._handledValidity){
            helper.handleValueChangeInit(component, event, helper);
            component._handledValidity = true;
        }
	},
	handleValueChangeInit : function(component, event, helper){
        var dataRespEvent = component.getEvent("FormDataResponse");
        dataRespEvent.setParams({"isDirty" : false, "val": component.get("v.fieldVal"), "controlId": component.get("v.fc.Id"), "isValid" : component.get("v.validity.valid")});
        dataRespEvent.fire();
	},
	handleValueChange : function(component, event, helper){
        var dataRespEvent = component.getEvent("FormDataResponse");
        var validity = true;
        if(component._hasValidation){
            validity = component.get("v.validity.valid");
        }
        dataRespEvent.setParams({"isDirty" : true, "val": component.get("v.fieldVal"), "controlId": component.get("v.fc.Id"), "isValid" : validity});
        dataRespEvent.fire();
	},
	handleToggleChange : function(component, event, helper){
		var checkState = component.get('v.checked');
		component.set('v.fieldVal', checkState);
	},
	handleShowErrors : function(component, event, helper){
		var showErrors = component.get('v.showErrors');
		var validity = component.get('v.validity.valid');
		if(showErrors && !validity){
			//Note : This only worked properly when 'finding' the component, vs getting it directly from attribute.
            var formControls = component.find('form-controls').find({ instancesOf : "lightning:input" }) ;
            for(var i = 0; i < formControls.length; i++){
                var ctrl = formControls[i];
				ctrl.showHelpMessageIfInvalid();
            }
		}
	},
    handleToggleMultiple : function(component){
	    var fieldVal = component.get('v.fieldVal');
	    var finalValue = '';

        var thisBody = component.get('v.body');

        var checks = component.find('form-controls').find({ instancesOf : 'ui:inputCheckbox' });

        checks.forEach(function(item, index){

            var isChecked = item.get('v.value');
            if(isChecked){
                finalValue += item.get('v.label') + ',';
            }
        })
        
        finalValue = finalValue.replace(/,\s*$/, '');
        component.set('v.fieldVal', finalValue);

    },
    handleNoValidationWithValue : function(component){
        var dataRespEvent = component.getEvent("FormDataResponse");
        dataRespEvent.setParams({"isDirty" : false, "val": component.get('v.fieldVal'), "controlId": component.get("v.fc.Id"), "isValid" : true});
        dataRespEvent.fire();
    },
    handleNoValidation : function(component){
        //Tarren TODO : Find better way to validate fields that don't require validation.
        var dataRespEvent = component.getEvent("FormDataResponse");
        dataRespEvent.setParams({"isDirty" : false, "val": null, "controlId": component.get("v.fc.Id"), "isValid" : true});
        dataRespEvent.fire();
    }
})