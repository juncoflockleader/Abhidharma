function clearAll() {
    cittaSvg.selectAll('*').remove();
    d3.select('#senseflow').selectAll('*').remove();
    d3.select('#senseflowcontrols').selectAll('*').remove();
    d3.select('#mindflow').selectAll('*').remove();
    d3.select('#mindflowcontrols').selectAll('*').remove();
    rpSvg.selectAll('*').remove();
    rpgSvg.selectAll('*').remove();
    rpnSvg.selectAll('*').remove();
    rpnlSvg.selectAll('*').remove();
}

const pageState = createPageState();

function logRenderStage(stageName, marker, context = {}) {
    const { tabId = 'unknown', lang = 'unknown', endX = '-', endY = '-' } = context;
    console.log(`[render:${stageName}] ${marker}`, { tabId, lang, endX, endY });
}

function updateRenderDebugPanel(errors) {
    if (!testDiv || testDiv.empty()) {
        return;
    }

    if (!errors.length) {
        testDiv.style('display', 'none').text('');
        return;
    }

    const summary = errors
        .map(({ stage, error }, index) => `${index + 1}. ${stage}: ${error && error.message ? error.message : String(error)}`)
        .join('\n');

    testDiv
        .style('display', 'block')
        .style('position', 'fixed')
        .style('left', '8px')
        .style('bottom', '8px')
        .style('z-index', '9999')
        .style('max-width', '40vw')
        .style('max-height', '28vh')
        .style('overflow', 'auto')
        .style('padding', '8px 10px')
        .style('background', 'rgba(180, 20, 20, 0.9)')
        .style('color', '#fff')
        .style('font-size', '12px')
        .style('line-height', '1.4')
        .style('white-space', 'pre-wrap')
        .text(`Render errors:\n${summary}`);
}

function renderCittaSection(viewModel, context) {
    resetCittaState();
    const model = rebuildCittaModel();
    const tab1Layout = viewModel.layout.tab1;
    const subPadding = tab1Layout.sectionSpacing.subPadding;
    const ctt = renderCittaTable(cittaSvg, model, cittaState, tab1Layout.cittaTable);
    let cntt = null;
    let ntt = null;
    const sidePanelLayout = tab1Layout.cittaSidePanel;
    const rx = ctt.endX + subPadding;
    const fet = renderFeelingTable(rx, 0);
    const ct = renderCauseTable(fet.endX + subPadding, 0);
    const tt = sidePanelLayout.stacked
        ? renderTimeTable(rx, subPadding + ct.endY)
        : renderTimeTable(ct.endX + subPadding, 0);
    renderFiveObjectsTable(tt.endX + subPadding, sidePanelLayout.stacked ? subPadding + ct.endY : 0);
    const mot = renderMentalObjectsTable(rx, sidePanelLayout.stacked ? tt.endY + subPadding : ct.endY + subPadding);
    const rt = renderRealmTable(sidePanelLayout.stacked ? rx : mot.endX + subPadding, sidePanelLayout.stacked ? mot.endY + subPadding : ct.endY + subPadding);
    const gt = renderGateTable(rt.endX + subPadding, sidePanelLayout.stacked ? mot.endY + subPadding : ct.endY + subPadding);
    const bt = renderBasisTable(sidePanelLayout.stacked ? rx : gt.endX + subPadding, gt.endY + subPadding);
    const ft = renderFunctionTable(rx, bt.endY + subPadding);
    if (sidePanelLayout.stacked) {
        cntt = renderCounterTable(rx, ft.endY + subPadding);
        ntt = renderNoteTable(rx, cntt.endY + subPadding);
    } else {
        ntt = renderNoteTable(ft.endX + subPadding, bt.endY + subPadding, sidePanelLayout.notesWidth, sidePanelLayout.notesFontSize);
        cntt = renderCounterTable(ft.endX + subPadding, ntt.endY + subPadding, sidePanelLayout.notesWidth, sidePanelLayout.notesFontSize);
    }
    pageState.citta.layout = ctt;
    pageState.citta.counters = cntt;
    pageState.citta.notes = ntt;
    renderCetasikaTableByLayout(
        getLang().fixed ? CETASIKA_TABLE_LAYOUT_CN : CETASIKA_TABLE_LAYOUT_EN,
        ctt.endY + 15,
        model,
        cittaState
    );
    setupHighlightsBehavior(cntt, ntt, cittaState);

    const keyRegions = {
        cittaTable: ctt,
        feelingTable: fet,
        causeTable: ct,
        timeTable: tt,
        mentalObjectTable: mot,
        realmTable: rt,
        gateTable: gt,
        basisTable: bt,
        functionTable: ft,
        notesTable: ntt,
        counterTable: cntt,
    };
    validateLayoutBounds('#citta', keyRegions);

    const regionValues = Object.values(keyRegions).filter(Boolean);
    context.endX = Math.max(...regionValues.map((r) => r.endX));
    context.endY = Math.max(...regionValues.map((r) => r.endY));
}

function validateLayoutBounds(containerSelector, keyRegions) {
    const container = d3.select(containerSelector);
    if (container.empty()) {
        return;
    }
    const containerNode = container.node();
    const containerWidth = containerNode.clientWidth || Number(container.style('width').replace('px', '')) || 0;
    const containerHeight = containerNode.clientHeight || Number(container.style('height').replace('px', '')) || 0;
    Object.entries(keyRegions).forEach(([name, region]) => {
        if (!region) {
            return;
        }
        const widthOverflow = region.endX > containerWidth;
        const heightOverflow = region.endY > containerHeight;
        if (!widthOverflow && !heightOverflow) {
            return;
        }

        const suggestedWidth = Math.ceil(Math.max(region.endX, containerWidth));
        const suggestedHeight = Math.ceil(Math.max(region.endY, containerHeight));
        console.warn(
            `[layout-check] ${name} 超出 ${containerSelector} 边界：endX=${region.endX}, endY=${region.endY}, ` +
            `containerWidth=${containerWidth}, containerHeight=${containerHeight}. 建议将 ${containerSelector} ` +
            `至少调整为 width=${suggestedWidth}px, height=${suggestedHeight}px。`
        );
    });
}

function renderFlowSection(context) {
    renderFlow(senseFlowState);
    renderControls(senseFlowState, 1, 15);
    renderFlow(mindFlowState);
    renderControls(mindFlowState, 1, 6);
    context.endX = 1;
    context.endY = 15;
}

function renderRupaSection(viewModel, context) {
    const subPadding = 6;
    const rat = renderRupaAttrTable(rpSvg);
    const offset = viewModel.layout.rupaNotesOffset;
    renderNotesTable(rpSvg, rat.endX + offset, 0);
    renderRupaAggTable(rpSvg, 0, rat.endY + subPadding);
    setupRupaHighlightBehavior();
    renderRupaOrigins(rpgSvg);
    context.endX = rat.endX + offset;
    context.endY = rat.endY + subPadding;
}

function renderConditionSection(context) {
    createLegend();
    createProgressUpdater();
    dependentOrigination(doSvg, dependentOriginData);
    renderConditionsMapping(cdSvg, ceSvg);
    renderCauseCondition(ccSvg);
    renderMyWords(mwSvg);
    context.endX = '-';
    context.endY = '-';
}

function executeRenderStage(stageName, context, errors, callback) {
    logRenderStage(stageName, 'start', context);
    try {
        callback();
        logRenderStage(stageName, 'done', context);
    } catch (error) {
        console.error(`[render:${stageName}] failed`, error);
        errors.push({ stage: stageName, error });
    }
}

function render() {
    refreshPageState(pageState);
    const viewModel = buildPageViewModel(pageState);
    const context = {
        tabId: pageState.tab && pageState.tab.id ? pageState.tab.id : 'unknown',
        lang: viewModel.lang,
        endX: '-',
        endY: '-',
    };
    const renderErrors = [];

    executeRenderStage('citta', context, renderErrors, () => renderCittaSection(viewModel, context));
    executeRenderStage('flow', context, renderErrors, () => renderFlowSection(context));
    executeRenderStage('rupa', context, renderErrors, () => renderRupaSection(viewModel, context));
    executeRenderStage('condition', context, renderErrors, () => renderConditionSection(context));

    syncTabWithHash();

    syncLanguageButtons();
    updateRenderDebugPanel(renderErrors);
}

function buildPreflightCheckSpec() {
    return [
        {
            module: 'Data Layer',
            checks: [
                { name: 'data', validate: () => typeof data !== 'undefined', script: 'js/data.js' },
                { name: 'cittas', validate: () => typeof cittas !== 'undefined', script: 'js/citta-data.js' },
                { name: 'cetasika', validate: () => typeof cetasika !== 'undefined', script: 'js/cetasika-data.js' },
            ],
        },
        {
            module: 'Citta Rendering',
            checks: [
                { name: 'buildCittaModel', validate: () => typeof buildCittaModel === 'function', script: 'js/citta-model.js' },
                { name: 'renderCittaTable', validate: () => typeof renderCittaTable === 'function', script: 'js/citta.js' },
            ],
        },
        {
            module: 'Flow Rendering',
            checks: [
                { name: 'renderFlow', validate: () => typeof renderFlow === 'function', script: 'js/flow.js' },
            ],
        },
        {
            module: 'Rupa Rendering',
            checks: [
                { name: 'renderRupaAttrTable', validate: () => typeof renderRupaAttrTable === 'function', script: 'js/rupa.js' },
            ],
        },
        {
            module: 'I18n/Runtime',
            checks: [
                { name: 'getLang', validate: () => typeof getLang === 'function', script: 'js/lang.js' },
            ],
        },
    ];
}

function renderPreflightError(missingByModule) {
    const lines = [
        '缺失依赖：页面已停止渲染。',
        '建议检查以下脚本文件是否存在且按顺序加载：',
    ];

    const orderedScripts = [];
    missingByModule.forEach(({ checks }) => {
        checks.forEach(({ script }) => {
            if (!orderedScripts.includes(script)) {
                orderedScripts.push(script);
            }
        });
    });

    orderedScripts.forEach((script, index) => {
        lines.push(`${index + 1}. ${script}`);
    });

    lines.push('', '按模块分组缺失项：');
    missingByModule.forEach(({ module, checks }) => {
        lines.push(`- ${module}: ${checks.map((check) => check.name).join('、')}`);
    });

    const message = lines.join('\n');
    console.error('[preflight] dependency check failed', missingByModule);

    const root = document.getElementById('root') || document.body;
    if (root) {
        root.innerHTML = '';
        const panel = document.createElement('pre');
        panel.textContent = message;
        panel.style.whiteSpace = 'pre-wrap';
        panel.style.padding = '12px';
        panel.style.margin = '8px';
        panel.style.border = '1px solid #d32f2f';
        panel.style.background = '#fff7f7';
        panel.style.color = '#b71c1c';
        panel.style.fontSize = '14px';
        panel.style.lineHeight = '1.5';
        root.appendChild(panel);
    }
}

function preflightCheck() {
    const spec = buildPreflightCheckSpec();
    const missingByModule = spec
        .map(({ module, checks }) => ({
            module,
            checks: checks.filter((check) => !check.validate()),
        }))
        .filter(({ checks }) => checks.length > 0);

    if (!missingByModule.length) {
        return true;
    }

    renderPreflightError(missingByModule);
    return false;
}

// On page load, check the URL
window.addEventListener('DOMContentLoaded', () => {
    if (!preflightCheck()) {
        return;
    }
    render();
});
