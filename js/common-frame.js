const tabs = d3.selectAll('.tabs button');
const svgs = d3.selectAll('.svg-sub-container');

function showTab(tabIndex) {
    tabs.classed('active', (d, i) => i === parseInt(tabIndex));
    svgs.classed('active', (d, i) => i === parseInt(tabIndex));
}

function syncTabWithHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showTab(hash);
    }
}

tabs.on('click', function () {
    const tabIndex = tabs.nodes().indexOf(this);
    history.pushState(null, '', `#${tabIndex}`);
    showTab(tabIndex);
});

window.addEventListener('hashchange', syncTabWithHash);

const langs = d3.selectAll('.lang button');
function setLang(langIndex) {
    langs.classed('active', (d, i) => i === langIndex);
    if (localStorage) {
        localStorage.setItem('lang', getLangByIndex(langIndex).name);
    }
}

function syncLanguageButtons() {
    const lang = getLang();
    langs.classed('active', (d, i) => i === lang.index);
}

langs.on('click', function () {
    const langIndex = langs.nodes().indexOf(this);
    const oldLang = getLang().name;
    setLang(langIndex);
    const newLang = getLang().name;
    if (oldLang !== newLang) {
        window.location.reload();
    }
});
