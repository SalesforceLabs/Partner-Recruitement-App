({

    initPageSession: function(component, page) {

        // Initialize core Wizard Data
        var wizardData = component.get("v.wizardData");
        if (wizardData == null) {
            wizardData = {};
        }
        if (!wizardData.hasOwnProperty('pageData')) {
            wizardData['pageData'] = {};
        }
        // Initialize PageData for WizardData if it isn't available
        if (!wizardData['pageData'].hasOwnProperty(page)) {
            wizardData['pageData'][page] = {};
        }
        component.set("v.wizardData", wizardData);

        // Initialize Wizard Session Store
        var wizardSessionData = component.get("v.wizardSessionData");
        if (wizardSessionData == null) {
            wizardSessionData = JSON.parse(JSON.stringify(wizardData));
        }
        if (!wizardSessionData.hasOwnProperty('pageData')) {
            wizardSessionData['pageData'] = {};
        }
        // Initialize PageData for WizardData if it isn't available
        if (!wizardSessionData['pageData'].hasOwnProperty(page)) {
            wizardSessionData['pageData'][page] = {};
        }
        component.set("v.wizardSessionData", wizardSessionData);

    },
    navigateToPage: function(component, page) {
        var self = this;
        var pages = component.get('v.pageMap');
        var pageData = pages[page];

        if (pageData == null) {
            self.error(component, 'Wizard Error', 'Unable to find Page for key: ' + page);
            return;
        }

        this.initPageSession(component, page);
        var compAttributes = {
            "wizardMetadata": component.getReference('v.wizardMetaData'),
            "wizardData": component.getReference('v.wizardData'),
            "wizardSessionData": component.getReference('v.wizardSessionData'),
            "wizardNavEvent": component.getReference("c.handleWizardNavEvent"),
            "nextPage": pageData['next'],
            "prevPage": pageData['prev'],
            'pageKey': page
        };

        var pageAttributes = pageData['componentAttributes'];
        if (!$A.util.isEmpty(pageAttributes)) {
            for (var attr in pageAttributes) {
                compAttributes[attr] = pageAttributes[attr];
            }
        }

        console.log(pageData['component']);
        console.log(compAttributes);

        $A.createComponent(
            pageData['component'],
            compAttributes,
            function(pageCmp, status, errorMessage) {
                if (status == 'SUCCESS') {
                    var body = component.get("v.body");
                    component.set("v.body", [pageCmp]);
                    component.set("v.currentPage", pageData);
                } else {
                    self.error(component, 'Wizard Error', status + ' ' + errorMessage);
                }
            }
        );

    },
    persistWizardState: function(component) {
        var wizardSaveStateEvent = component.getEvent("wizardSaveState");
        wizardSaveStateEvent.setParam("wizardData", component.get("v.wizardData"));
        wizardSaveStateEvent.fire();
    }
})