const SIDEBAR_STORAGE_KEYS = {
    left: 'abhidharma.sidebar.leftCollapsed',
    right: 'abhidharma.sidebar.rightCollapsed',
};

function readSidebarPreference(side) {
    try {
        return window.localStorage.getItem(SIDEBAR_STORAGE_KEYS[side]) === 'true';
    } catch (error) {
        return false;
    }
}

function writeSidebarPreference(side, collapsed) {
    try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEYS[side], String(collapsed));
    } catch (error) {
        // The layout still works when browser storage is unavailable.
    }
}

function sidebarText(side, collapsed) {
    const isChinese = typeof getLang === 'function' ? getLang().fixed : true;
    if (side === 'left') {
        return collapsed
            ? (isChinese ? '展开左侧导航' : 'Show left navigation')
            : (isChinese ? '收起左侧导航' : 'Hide left navigation');
    }
    return collapsed
        ? (isChinese ? '展开右侧详情' : 'Show right details')
        : (isChinese ? '收起右侧详情' : 'Hide right details');
}

function setSidebarCollapsed(side, collapsed, options = {}) {
    const button = document.getElementById(`${side}-sidebar-toggle`);
    const className = `sidebar-${side}-collapsed`;
    document.body.classList.toggle(className, collapsed);

    if (button) {
        const label = sidebarText(side, collapsed);
        button.textContent = side === 'left'
            ? (collapsed ? '›' : '‹')
            : (collapsed ? '‹' : '›');
        button.setAttribute('aria-expanded', String(!collapsed));
        button.setAttribute('aria-label', label);
        button.title = label;
    }

    if (options.persist !== false) {
        writeSidebarPreference(side, collapsed);
    }
}

function isSidebarCollapsed(side) {
    return document.body.classList.contains(`sidebar-${side}-collapsed`);
}

function initializeSidebarLayout() {
    ['left', 'right'].forEach((side) => {
        const button = document.getElementById(`${side}-sidebar-toggle`);
        setSidebarCollapsed(side, readSidebarPreference(side), {persist: false});
        if (!button) {
            return;
        }
        button.addEventListener('click', () => {
            setSidebarCollapsed(side, !isSidebarCollapsed(side));
        });
    });
}

initializeSidebarLayout();

window.sidebarLayoutApi = {
    isCollapsed: isSidebarCollapsed,
    setCollapsed: setSidebarCollapsed,
};
