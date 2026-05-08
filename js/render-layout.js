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

const TAB1_LAYOUT = {
    cittaTable: {
        rowHeaderWidth: 120,
        columnWidths: [120, 120, 120, 220, 120, 120],
        columnHeaderHeight: 105,
        rowHeights: [210, 105, 90, 90],
    },
    sectionSpacing: {
        subPadding: 6,
    },
};

function getCittaSidePanelLayout(lang) {
    const normalizedLang = typeof lang === 'string' ? (langCfg[lang] || langCfg.cn) : (lang || langCfg.cn);
    return normalizedLang.fixed ? CITTA_SIDE_PANEL_LAYOUTS.cn : CITTA_SIDE_PANEL_LAYOUTS.en;
}

function getTab1Layout(lang) {
    return {
        cittaTable: { ...TAB1_LAYOUT.cittaTable },
        sectionSpacing: { ...TAB1_LAYOUT.sectionSpacing },
        cittaSidePanel: getCittaSidePanelLayout(lang),
    };
}
