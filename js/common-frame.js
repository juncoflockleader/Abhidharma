const tabs = d3.selectAll('.tabs [role="tab"]');

const tabEntries = tabs.nodes().map((tab, index) => {
    const panelId = tab.getAttribute('aria-controls');
    return {
        id: tab.dataset.tabId,
        index,
        tab,
        panel: panelId ? document.getElementById(panelId) : null,
    };
});

const tabEntryById = Object.fromEntries(tabEntries.map((entry) => [entry.id, entry]));

function isVisibleTab(entry) {
    return entry && !entry.tab.hidden && entry.tab.offsetParent !== null;
}

function getKeyboardTabEntries() {
    return tabEntries.filter(isVisibleTab);
}

function resolveTabEntry(tabIdOrLegacyIndex) {
    if (tabIdOrLegacyIndex === undefined || tabIdOrLegacyIndex === null || tabIdOrLegacyIndex === '') {
        return null;
    }

    const rawValue = String(tabIdOrLegacyIndex);
    const decodedValue = decodeURIComponent(rawValue.replace(/^#/, ''));
    if (tabEntryById[decodedValue]) {
        return tabEntryById[decodedValue];
    }

    if (/^\d+$/.test(decodedValue)) {
        return tabEntries[parseInt(decodedValue, 10)] || null;
    }

    return null;
}

function getDefaultTabEntry() {
    return tabEntries.find((entry) => entry.tab.classList.contains('active')) || tabEntries[0] || null;
}

function setTabHash(entry, replaceHash) {
    if (!entry || !window.history) {
        return;
    }

    const nextHash = `#${entry.id}`;
    if (window.location.hash === nextHash) {
        return;
    }

    if (replaceHash) {
        history.replaceState(null, '', nextHash);
    } else {
        history.pushState(null, '', nextHash);
    }
}

function activateTab(tabIdOrLegacyIndex, options = {}) {
    const {
        updateHash = false,
        focus = false,
        replaceHash = false,
    } = options;
    const entry = resolveTabEntry(tabIdOrLegacyIndex) || getDefaultTabEntry();
    if (!entry) {
        return null;
    }

    tabEntries.forEach((candidate) => {
        const isActive = candidate === entry;
        candidate.tab.classList.toggle('active', isActive);
        candidate.tab.setAttribute('aria-selected', String(isActive));
        candidate.tab.setAttribute('tabindex', isActive && isVisibleTab(candidate) ? '0' : '-1');

        if (candidate.panel) {
            candidate.panel.classList.toggle('active', isActive);
            candidate.panel.hidden = !isActive;
            candidate.panel.setAttribute('aria-hidden', String(!isActive));
        }
    });

    if (updateHash) {
        setTabHash(entry, replaceHash);
    }

    if (focus && isVisibleTab(entry)) {
        entry.tab.focus();
    }

    return getActiveTab();
}

function getActiveTab() {
    const activeEntry = tabEntries.find((entry) => entry.tab.getAttribute('aria-selected') === 'true') || getDefaultTabEntry();
    if (!activeEntry) {
        return null;
    }

    return {
        id: activeEntry.id,
        index: activeEntry.index,
        label: activeEntry.tab.textContent.trim(),
        panelId: activeEntry.panel ? activeEntry.panel.id : null,
    };
}

function syncTabWithHash() {
    const rawHash = window.location.hash.substring(1);
    const entry = resolveTabEntry(rawHash) || getDefaultTabEntry();
    const isLegacyHash = /^\d+$/.test(rawHash);
    activateTab(entry ? entry.id : null, {
        updateHash: isLegacyHash,
        replaceHash: isLegacyHash,
    });
}

function getNextKeyboardTab(currentTab, direction) {
    const visibleEntries = getKeyboardTabEntries();
    if (visibleEntries.length === 0) {
        return null;
    }

    const currentIndex = visibleEntries.findIndex((entry) => entry.tab === currentTab);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    if (direction === 'first') {
        return visibleEntries[0];
    }
    if (direction === 'last') {
        return visibleEntries[visibleEntries.length - 1];
    }

    const nextIndex = (safeIndex + direction + visibleEntries.length) % visibleEntries.length;
    return visibleEntries[nextIndex];
}

tabs.on('click', function () {
    activateTab(this.dataset.tabId, { updateHash: true });
});

tabs.on('keydown', function (event) {
    const keyActions = {
        ArrowUp: -1,
        ArrowLeft: -1,
        ArrowDown: 1,
        ArrowRight: 1,
        Home: 'first',
        End: 'last',
    };

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateTab(this.dataset.tabId, { updateHash: true, focus: true });
        return;
    }

    if (keyActions[event.key] === undefined) {
        return;
    }

    event.preventDefault();
    const nextEntry = getNextKeyboardTab(this, keyActions[event.key]);
    if (nextEntry) {
        activateTab(nextEntry.id, { updateHash: true, focus: true });
    }
});

window.addEventListener('hashchange', syncTabWithHash);
syncTabWithHash();

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
