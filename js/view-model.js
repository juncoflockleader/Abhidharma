function buildPageViewModel(pageState) {
    const lang = pageState.lang || getLang();
    return {
        lang,
        citta: {
            raw: { data, cittas, cetasika },
        },
        layout: {
            tab1: getTab1Layout(lang),
            rupaNotesOffset: lang.wide ? 100 : 240,
        },
    };
}
