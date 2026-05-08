const CITTA_SIDE_PANEL_LAYOUTS = {
    cn: {
        timeXBy: 'feeling',
        notesWidth: 80,
        notesFontSize: 12,
        stacked: true,
    },
    en: {
        timeXBy: 'cause',
        notesWidth: 80,
        notesFontSize: 12,
        stacked: false,
    },
};

function getCittaSidePanelLayout(lang) {
    const normalizedLang = typeof lang === 'string' ? (langCfg[lang] || langCfg.cn) : (lang || langCfg.cn);
    return normalizedLang.fixed ? CITTA_SIDE_PANEL_LAYOUTS.cn : CITTA_SIDE_PANEL_LAYOUTS.en;
}
