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
    const subPadding = 6;
    const ctt = renderCittaTable(cittaSvg, model, cittaState);
    let cntt = null;
    let ntt = null;
    const sidePanelLayout = viewModel.layout.cittaSidePanel;
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

    context.endX = ctt.endX;
    context.endY = Math.max(ntt ? ntt.endY : 0, cntt ? cntt.endY : 0);
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

// On page load, check the URL
window.addEventListener('DOMContentLoaded', () => {
    render();
});
