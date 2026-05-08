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

function render() {
    refreshPageState(pageState);
    const viewModel = buildPageViewModel(pageState);
    const lang = viewModel.lang;

    const subPadding = 6;
    const ctt = renderCittaTable(cittaSvg);
    let cntt = null;
    let ntt = null;
    const sidePanelLayout = viewModel.layout.cittaSidePanel;
    const rx = ctt.endX + subPadding;
    const fet = renderFeelingTable(rx, 0);
    const ct = renderCauseTable(fet.endX + subPadding, 0);
    const tt = sidePanelLayout.stacked
        ? renderTimeTable(rx, subPadding + ct.endY)
        : renderTimeTable(ct.endX + subPadding, 0);
    const fot = renderFiveObjectsTable(tt.endX + subPadding, sidePanelLayout.stacked ? subPadding + ct.endY : 0);
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

    renderCetasikaTable(ctt.endY + 15);
    setupHighlightsBehavior(cntt, ntt);


    renderFlow(senseFlowState);
    renderControls(senseFlowState, 1, 15);

    renderFlow(mindFlowState);
    renderControls(mindFlowState, 1, 6);

    const rat = renderRupaAttrTable(rpSvg);
    const offset = viewModel.layout.rupaNotesOffset;
    renderNotesTable(rpSvg, rat.endX + offset, 0);
    renderRupaAggTable(rpSvg, 0, rat.endY + subPadding);
    setupRupaHighlightBehavior();
    renderRupaOrigins(rpgSvg);

    createLegend();
    createProgressUpdater();

    dependentOrigination(doSvg, dependentOriginData);

    renderConditionsMapping(cdSvg, ceSvg);

    renderCauseCondition(ccSvg);
    renderMyWords(mwSvg);
    syncTabWithHash();

    syncLanguageButtons();
    testDiv.style('display', 'none');
}

// On page load, check the URL
window.addEventListener('DOMContentLoaded', () => {
    render();
});
