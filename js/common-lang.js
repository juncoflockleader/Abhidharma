const langCfg = {
    'en': {
        name: 'en',
        fixed: false,
        px: 10,
        vertical: false,
        wrap: true,
        wide: false,
        index: 0
    },
    'cn': {
        name: 'cn',
        px: 14,
        fixed: true,
        vertical: true,
        wrap: false,
        wide: true,
        index: 1
    }
};

function getLangByIndex(index) {
    for (let key in langCfg) {
        if (langCfg[key].index === index) {
            return langCfg[key];
        }
    }
    return langCfg['cn'];
}

function getLang() {
    if (localStorage) {
        const lang = localStorage.getItem('lang');
        if (langCfg[lang]) {
            return langCfg[lang];
        }
        localStorage.setItem('lang', 'cn');
    }
    return langCfg['cn'];
}

function t(id) {
    const lang = getLang();
    if (!id || !tr[id]) {
        return '';
    }
    return tr[id][lang.name] || tr[id]['cn'];
}
