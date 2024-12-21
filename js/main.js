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

function render() {
    const lang = getLang();

    const subPadding = 6;
    const ctt = renderCittaTable(cittaSvg);
    let cntt = null;
    let ntt = null;
    if (lang.fixed) {
        const rx = ctt.endX + subPadding;
        const fet = renderFeelingTable(rx, 0);
        const ct = renderCauseTable(fet.endX + subPadding, 0);
        const tt = renderTimeTable(rx, subPadding + ct.endY);
        const fot = renderFiveObjectsTable(tt.endX + subPadding, subPadding + ct.endY);
        const mot = renderMentalObjectsTable(rx, tt.endY + subPadding);
        const rt = renderRealmTable(rx, mot.endY + subPadding);
        const gt = renderGateTable(rt.endX + subPadding, mot.endY + subPadding);
        const bt = renderBasisTable(rx, gt.endY + subPadding);
        const ft = renderFunctionTable(rx, bt.endY + subPadding);
        cntt = renderCounterTable(rx, ft.endY + subPadding);
        ntt = renderNoteTable(rx, cntt.endY + subPadding);
    } else {
        const rx = ctt.endX + subPadding;
        const fet = renderFeelingTable(rx, 0);
        const ct = renderCauseTable(fet.endX + subPadding, 0);
        const tt = renderTimeTable(ct.endX + subPadding, 0);
        const fot = renderFiveObjectsTable(tt.endX + subPadding, 0);
        const mot = renderMentalObjectsTable(rx, ct.endY + subPadding);
        const rt = renderRealmTable(mot.endX + subPadding, ct.endY + subPadding);
        const gt = renderGateTable(rt.endX  + subPadding, ct.endY + subPadding);
        const bt = renderBasisTable(gt.endX + subPadding, ct.endY + subPadding);
        const ft = renderFunctionTable(rx, bt.endY + subPadding);
        ntt = renderNoteTable(ft.endX + subPadding, bt.endY + subPadding, 80, 12);
        cntt = renderCounterTable(ft.endX + subPadding, ntt.endY + subPadding, 80, 12);
    }

    renderCetasikaTable(ctt.endY + 15);
    setupHighlightsBehavior(cntt, ntt);


    renderFlow(senseFlowState);
    renderControls(senseFlowState, 1, 15);

    renderFlow(mindFlowState);
    renderControls(mindFlowState, 1, 6);

    const rat = renderRupaAttrTable(rpSvg);
    const offset = lang.wide ? 100 : 240;
    renderNotesTable(rpSvg, rat.endX + offset, 0);
    renderRupaAggTable(rpSvg, 0, rat.endY + subPadding);
    setupRupaHighlightBehavior();
    renderRupaOrigins(rpgSvg);

    createLegend();
    createProgressUpdater();

    dependentOrigination(doSvg, dependentOriginData);

    renderConditionsMapping(cmSvg);
    const hash = window.location.hash.substring(1); // Get the hash without the '#'
    if (hash) {
        showTab(hash);
    }

    langs.classed('active', (d, i) => i === lang.index);
    testDiv.style('display', 'none;');
}

// On page load, check the URL
window.addEventListener('DOMContentLoaded', () => {
    render();
});