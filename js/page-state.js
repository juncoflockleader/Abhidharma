function createPageState() {
    return {
        lang: getLang(),
        tab: typeof getActiveTab === 'function' ? getActiveTab() : null,
        citta: {
            layout: null,
            counters: null,
            notes: null,
        },
        flows: {
            sense: senseFlowState,
            mind: mindFlowState,
        },
        rupa: {
            attrTable: null,
        },
    };
}

function refreshPageState(pageState) {
    pageState.lang = getLang();
    pageState.tab = typeof getActiveTab === 'function' ? getActiveTab() : null;
    return pageState;
}
