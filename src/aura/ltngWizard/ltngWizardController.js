({
    doInit: function(component, event, helper) {
        //       helper.log(component, component.get('v.startPage'));
        if (component.get('v.startPage') != null) {
            var pageMap = component.get("v.pageMap");
            var pageList = [];
            for (var attrib in pageMap) {
                pageList.push(pageMap[attrib]);
            }
            var wizardMetaData = {
                'wizardId': component.get("v.wizardId"),
                'pageMap': pageMap
            };
            component.set('v.pageListInternal', pageList);
            component.set('v.wizardMetaData', wizardMetaData);
            component.set("v.currentPage", component.get('v.startPage'));
            helper.navigateToPage(component, component.get('v.startPage'));
        }
    },
    handleWizardNavEvent: function(component, event, helper) {
        component = component.getConcreteComponent();
        var currentPageData = component.get('v.pageMap')[component.get('v.currentPage')];
        var eventType = event.getParam('type');
        switch (eventType) {
            case 'next':
            case 'prev':
            case 'goto':
                var navPage = event.getParam('page');
                var persistState = event.getParam('persistState');
                if (persistState) {
                    helper.persistWizardState(component);
                }
                if (!$A.util.isEmpty(navPage)) {
                    helper.log(component, 'Navigating to ' + navPage + ' for event type: ' + eventType);
                    helper.navigateToPage(component, navPage);
                }
                break;
        }

    }
})