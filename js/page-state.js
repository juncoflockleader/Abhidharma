function createPageState() {
    return {
        lang: getLang(),
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
    return pageState;
}
