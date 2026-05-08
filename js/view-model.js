function buildPageViewModel(pageState) {
    const lang = pageState.lang || getLang();
    return {
        lang,
        citta: {
            raw: { data, cittas, cetasika },
        },
        layout: {
            cittaSidePanel: getCittaSidePanelLayout(lang),
            rupaNotesOffset: lang.wide ? 100 : 240,
        },
    };
}
