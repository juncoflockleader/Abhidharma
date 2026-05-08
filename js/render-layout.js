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
    return lang.fixed ? CITTA_SIDE_PANEL_LAYOUTS.cn : CITTA_SIDE_PANEL_LAYOUTS.en;
}
