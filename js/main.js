

// On page load, check the URL
window.addEventListener('DOMContentLoaded', () => {
    const subPadding = 6;
    const ctt = renderCittaTable(cittaSvg);
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
    const cntt = renderCounterTable(rx, ft.endY + subPadding);
    const ntt = renderNoteTable(rx, cntt.endY + subPadding);
    renderCetasikaTable(ctt.endY + 20);
    setupHighlightsBehavior(cntt, ntt);


    renderFlow(senseFlowState);
    renderControls(senseFlowState, 1, 15);

    renderFlow(mindFlowState);
    renderControls(mindFlowState, 1, 6);

    renderRupaAttrTable(rpSvg);
    const hash = window.location.hash.substring(1); // Get the hash without the '#'
    if (hash) {
        showTab(hash);
    }
});
