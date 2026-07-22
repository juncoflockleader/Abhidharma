const dependentOriginState = {
    lensId: 'chain',
    filterId: 'all',
    lockedDetail: null,
    previewDetail: null,
};

function dependentOriginEscape(value) {
    return String(value === undefined || value === null ? '' : value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function dependentOriginResolveDetail(model, reference) {
    if (!reference) {
        return {kind: 'overview', item: model.lensById[dependentOriginState.lensId]};
    }
    if (reference.kind === 'factor') {
        const factor = model.factorById[Number(reference.id)];
        return factor ? {kind: 'factor', item: factor} : {kind: 'overview', item: model.lensById[dependentOriginState.lensId]};
    }
    if (reference.kind === 'edge') {
        const edge = model.edgeById[reference.id];
        return edge ? {kind: 'edge', item: edge} : {kind: 'overview', item: model.lensById[dependentOriginState.lensId]};
    }
    return {kind: 'overview', item: model.lensById[dependentOriginState.lensId]};
}

function dependentOriginFactorLensLabels(factor, lensId) {
    if (lensId === 'time') {
        return [dependentOriginText(factor.time)];
    }
    if (lensId === 'wheel') {
        return factor.wheels.map((wheel) => dependentOriginText(wheel === 'result' ? 'resultWheel' : wheel));
    }
    return factor.roles.map((role) => dependentOriginText(role));
}

function renderDependentOriginSummary(model) {
    const host = document.getElementById('dependent-origin-summary');
    if (!host) {
        return;
    }
    const lens = model.lensById[dependentOriginState.lensId];
    host.innerHTML = `
        <div class="dependent-origin-summary__copy">
            <span class="dependent-origin-eyebrow">${dependentOriginEscape(dependentOriginText('currentLens'))} · ${dependentOriginEscape(lens.label)}</span>
            <h2>${dependentOriginEscape(dependentOriginText('title'))}</h2>
            <p>${dependentOriginEscape(dependentOriginText('intro'))}</p>
        </div>
        <div class="dependent-origin-summary__stats" aria-label="${dependentOriginEscape(dependentOriginText('overview'))}">
            <span><strong>${model.factors.length}</strong> ${dependentOriginEscape(dependentOriginText('factors'))}</span>
            <span><strong>${model.edges.length}</strong> ${dependentOriginEscape(dependentOriginText('relations'))}</span>
            <span><strong>${model.phases.length}</strong> ${dependentOriginEscape(dependentOriginText('phases'))}</span>
        </div>
    `;
}

function renderDependentOriginControls(model, parent) {
    const host = document.getElementById('dependent-origin-controls');
    if (!host) {
        return;
    }
    const lens = model.lensById[dependentOriginState.lensId];
    host.innerHTML = `
        <div class="dependent-origin-control-block">
            <span class="dependent-origin-control-label">${dependentOriginEscape(dependentOriginText('chooseLens'))}</span>
            <div class="dependent-origin-segments">
                ${model.lenses.map((item) => `
                    <button type="button" class="dependent-origin-segment${item.id === lens.id ? ' is-selected' : ''}"
                            data-dependent-lens="${dependentOriginEscape(item.id)}" aria-pressed="${String(item.id === lens.id)}">
                        <strong>${dependentOriginEscape(item.label)}</strong>
                        <small>${dependentOriginEscape(item.hint)}</small>
                    </button>
                `).join('')}
            </div>
        </div>
        <div class="dependent-origin-control-block dependent-origin-control-block--filter">
            <span class="dependent-origin-control-label">${dependentOriginEscape(dependentOriginText('chooseFilter'))}</span>
            <div class="dependent-origin-filters">
                ${lens.filterOptions.map((filter) => `
                    <button type="button" class="dependent-origin-filter${filter.id === dependentOriginState.filterId ? ' is-selected' : ''}"
                            data-dependent-filter="${dependentOriginEscape(filter.id)}" aria-pressed="${String(filter.id === dependentOriginState.filterId)}">
                        ${dependentOriginEscape(filter.label)} <span>${filter.count}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    host.querySelectorAll('[data-dependent-lens]').forEach((button) => {
        button.addEventListener('click', () => {
            dependentOriginState.lensId = button.dataset.dependentLens;
            dependentOriginState.filterId = 'all';
            dependentOriginState.previewDetail = null;
            dependentOrigination(parent, dependentOriginData);
        });
    });
    host.querySelectorAll('[data-dependent-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            dependentOriginState.filterId = button.dataset.dependentFilter;
            dependentOriginState.previewDetail = null;
            dependentOrigination(parent, dependentOriginData);
        });
    });
}

function dependentOriginFilterState(factor) {
    if (dependentOriginState.filterId === 'all') {
        return 'active';
    }
    return dependentOriginFactorMatches(factor, dependentOriginState.lensId, dependentOriginState.filterId)
        ? 'active'
        : 'muted';
}

function renderDependentOriginFactor(factor) {
    const selected = dependentOriginState.lockedDetail
        && dependentOriginState.lockedDetail.kind === 'factor'
        && Number(dependentOriginState.lockedDetail.id) === factor.id;
    const labels = dependentOriginFactorLensLabels(factor, dependentOriginState.lensId);
    const stateClass = dependentOriginFilterState(factor) === 'muted' ? ' is-muted' : '';
    return `
        <button type="button" class="dependent-origin-factor${factor.wheels.length > 1 ? ' is-split' : ''}${selected ? ' is-selected' : ''}${stateClass}"
                data-detail-kind="factor" data-detail-id="${factor.id}"
                data-time="${dependentOriginEscape(factor.time)}"
                data-role="${dependentOriginEscape(factor.roles[0])}"
                data-wheel="${dependentOriginEscape(factor.wheels[0])}">
            <span class="dependent-origin-factor__number">${String(factor.id).padStart(2, '0')}</span>
            <span class="dependent-origin-factor__meta">${dependentOriginEscape(labels.join(' / '))}</span>
            <strong>${dependentOriginEscape(factor.displayName)}</strong>
            <small>${dependentOriginEscape(factor.summary)}</small>
        </button>
    `;
}

function dependentOriginEdgeState(edge) {
    if (dependentOriginState.filterId === 'all') {
        return 'active';
    }
    const sourceActive = dependentOriginFactorMatches(edge.source, dependentOriginState.lensId, dependentOriginState.filterId);
    const targetActive = dependentOriginFactorMatches(edge.target, dependentOriginState.lensId, dependentOriginState.filterId);
    if (sourceActive && targetActive) {
        return 'active';
    }
    return sourceActive || targetActive ? 'related' : 'muted';
}

function renderDependentOriginEdge(edge, junction = false) {
    const selected = dependentOriginState.lockedDetail
        && dependentOriginState.lockedDetail.kind === 'edge'
        && dependentOriginState.lockedDetail.id === edge.id;
    const edgeState = dependentOriginEdgeState(edge);
    const stateClass = edgeState === 'muted' ? ' is-muted' : edgeState === 'related' ? ' is-filter-related' : '';
    if (junction) {
        return `
            <button type="button" class="dependent-origin-junction${selected ? ' is-selected' : ''}${stateClass}"
                    data-detail-kind="edge" data-detail-id="${dependentOriginEscape(edge.id)}"
                    data-source-id="${edge.sourceId}" data-target-id="${edge.targetId}">
                <span>${dependentOriginEscape(dependentOriginText('junction'))}</span>
                <strong>${dependentOriginEscape(edge.source.displayName)} <b>→</b> ${dependentOriginEscape(edge.target.displayName)}</strong>
                <small>${dependentOriginEscape(dependentOriginText(edge.junctionKey))}</small>
            </button>
        `;
    }
    return `
        <button type="button" class="dependent-origin-edge${selected ? ' is-selected' : ''}${stateClass}"
                data-detail-kind="edge" data-detail-id="${dependentOriginEscape(edge.id)}"
                data-source-id="${edge.sourceId}" data-target-id="${edge.targetId}"
                aria-label="${dependentOriginEscape(edge.source.displayName)} ${dependentOriginEscape(dependentOriginText('conditions'))} ${dependentOriginEscape(edge.target.displayName)}">
            <span>${dependentOriginEscape(dependentOriginText('conditions'))}</span>
            <b aria-hidden="true">→</b>
        </button>
    `;
}

function renderDependentOriginPhase(phase) {
    const sequence = [];
    phase.factors.forEach((factor, index) => {
        sequence.push(renderDependentOriginFactor(factor));
        if (index < phase.internalEdges.length) {
            sequence.push(renderDependentOriginEdge(phase.internalEdges[index]));
        }
    });
    return `
        <section class="dependent-origin-phase" data-phase="${dependentOriginEscape(phase.id)}">
            <header class="dependent-origin-phase__header">
                <span>${dependentOriginEscape(phase.label)}</span>
                <p>${dependentOriginEscape(phase.hint)}</p>
            </header>
            <div class="dependent-origin-phase__scroll" tabindex="0">
                <div class="dependent-origin-phase__chain">${sequence.join('')}</div>
            </div>
        </section>
        ${phase.junction ? renderDependentOriginEdge(phase.junction, true) : ''}
    `;
}

function renderDependentOriginCycle(model, parent) {
    return `
        <section class="dependent-origin-cycle" aria-labelledby="dependent-origin-cycle-title">
            <div class="dependent-origin-cycle__heading">
                <div>
                    <span>${dependentOriginEscape(dependentOriginText('wheelLens'))}</span>
                    <h3 id="dependent-origin-cycle-title">${dependentOriginEscape(dependentOriginText('cycleTitle'))}</h3>
                </div>
                <small>${dependentOriginEscape(dependentOriginText('cycleHint'))}</small>
            </div>
            <div class="dependent-origin-cycle__track">
                ${model.wheelGroups.map((group, index) => `
                    <button type="button" class="dependent-origin-cycle-card${dependentOriginState.lensId === 'wheel' && dependentOriginState.filterId === group.id ? ' is-selected' : ''}"
                            data-dependent-wheel="${dependentOriginEscape(group.id)}" data-wheel="${dependentOriginEscape(group.id)}">
                        <strong>${dependentOriginEscape(group.label)}</strong>
                        <span>${dependentOriginEscape(group.description)}</span>
                    </button>
                    ${index < model.wheelGroups.length - 1 ? '<b class="dependent-origin-cycle__arrow" aria-hidden="true">→</b>' : ''}
                `).join('')}
                <b class="dependent-origin-cycle__return" aria-hidden="true">↺</b>
            </div>
            <p class="dependent-origin-cycle__note">${dependentOriginEscape(dependentOriginText('splitBecoming'))}</p>
        </section>
    `;
}

function renderDependentOriginMap(model, parent) {
    const host = parent && typeof parent.node === 'function' ? parent.node() : document.getElementById('dependent-origin-map');
    if (!host) {
        return;
    }
    host.setAttribute('aria-label', dependentOriginText('mapAria'));
    host.innerHTML = `
        <div class="dependent-origin-phases">
            ${model.phases.map(renderDependentOriginPhase).join('')}
        </div>
        ${renderDependentOriginCycle(model, parent)}
    `;
    host.querySelectorAll('[data-dependent-wheel]').forEach((button) => {
        button.addEventListener('click', () => {
            dependentOriginState.lensId = 'wheel';
            dependentOriginState.filterId = button.dataset.dependentWheel;
            dependentOriginState.previewDetail = null;
            dependentOrigination(parent, dependentOriginData);
        });
    });
    bindDependentOriginDetailInteractions(model, parent, host);
}

function dependentOriginList(items) {
    if (!items || !items.length) {
        return '';
    }
    return `<ul>${items.map((item) => `
        <li><strong>${dependentOriginEscape(item.name)}</strong>${item.note ? `<span>${dependentOriginEscape(item.note)}</span>` : ''}</li>
    `).join('')}</ul>`;
}

function renderDependentOriginInspector(model, reference) {
    const host = document.getElementById('dependent-origin-inspector');
    if (!host) {
        return;
    }
    host.setAttribute('aria-label', dependentOriginText('inspectorAria'));
    const detail = dependentOriginResolveDetail(model, reference);
    const showUnlock = detail.kind !== 'overview' && Boolean(dependentOriginState.lockedDetail);

    if (detail.kind === 'factor') {
        const factor = detail.item;
        const previous = model.factorById[factor.id - 1];
        const next = model.factorById[factor.id + 1];
        const edge = model.edges.find((item) => item.sourceId === factor.id);
        const phase = model.phases.find((item) => item.id === factor.phase);
        host.innerHTML = `
            <span class="dependent-origin-inspector__eyebrow">${dependentOriginEscape(dependentOriginText('factorDetail'))} · ${String(factor.id).padStart(2, '0')}</span>
            <h3>${dependentOriginEscape(factor.displayName)}</h3>
            <p class="dependent-origin-inspector__lead">${dependentOriginEscape(factor.summary)}</p>
            <dl class="dependent-origin-facts">
                <div><dt>${dependentOriginEscape(dependentOriginText('classification'))}</dt><dd>${dependentOriginEscape(phase.label)} · ${dependentOriginEscape(dependentOriginFactorLensLabels(factor, 'wheel').join(' / '))}</dd></div>
                <div><dt>${dependentOriginEscape(dependentOriginText('previous'))}</dt><dd>${dependentOriginEscape(previous ? previous.displayName : dependentOriginText('start'))}</dd></div>
                <div><dt>${dependentOriginEscape(dependentOriginText('next'))}</dt><dd>${dependentOriginEscape(next ? next.displayName : dependentOriginText('end'))}</dd></div>
            </dl>
            ${factor.nama.length ? `<section><strong>${dependentOriginEscape(dependentOriginText('mental'))}</strong>${dependentOriginList(factor.nama)}</section>` : ''}
            ${factor.rupa.length ? `<section><strong>${dependentOriginEscape(dependentOriginText('material'))}</strong>${dependentOriginList(factor.rupa)}</section>` : ''}
            ${edge ? `<section><strong>${dependentOriginEscape(dependentOriginText('nextCondition'))}</strong><p>${dependentOriginEscape(edge.note)}</p></section>` : ''}
            ${showUnlock ? `<button type="button" class="dependent-origin-unlock" data-dependent-origin-unlock>${dependentOriginEscape(dependentOriginText('unlock'))}</button>` : ''}
        `;
    } else if (detail.kind === 'edge') {
        const edge = detail.item;
        host.innerHTML = `
            <span class="dependent-origin-inspector__eyebrow">${dependentOriginEscape(dependentOriginText('relationDetail'))}</span>
            <h3>${dependentOriginEscape(edge.source.displayName)} → ${dependentOriginEscape(edge.target.displayName)}</h3>
            <dl class="dependent-origin-facts">
                <div><dt>${dependentOriginEscape(dependentOriginText('from'))}</dt><dd>${dependentOriginEscape(edge.source.displayName)}</dd></div>
                <div><dt>${dependentOriginEscape(dependentOriginText('to'))}</dt><dd>${dependentOriginEscape(edge.target.displayName)}</dd></div>
                ${edge.junctionKey ? `<div><dt>${dependentOriginEscape(dependentOriginText('junction'))}</dt><dd>${dependentOriginEscape(dependentOriginText(edge.junctionKey))}</dd></div>` : ''}
            </dl>
            <section><strong>${dependentOriginEscape(dependentOriginText('conditions'))}</strong><p>${dependentOriginEscape(edge.note)}</p></section>
            ${showUnlock ? `<button type="button" class="dependent-origin-unlock" data-dependent-origin-unlock>${dependentOriginEscape(dependentOriginText('unlock'))}</button>` : ''}
        `;
    } else {
        const lens = detail.item;
        host.innerHTML = `
            <span class="dependent-origin-inspector__eyebrow">${dependentOriginEscape(dependentOriginText('overview'))}</span>
            <h3>${dependentOriginEscape(lens.label)}</h3>
            <p class="dependent-origin-inspector__lead">${dependentOriginEscape(lens.hint)}</p>
            <section>
                <strong>${dependentOriginEscape(dependentOriginText('keyJunctions'))}</strong>
                <div class="dependent-origin-junction-list">
                    ${model.junctions.map((edge) => `
                        <button type="button" data-dependent-inspector-edge="${dependentOriginEscape(edge.id)}">
                            <span>${dependentOriginEscape(edge.source.displayName)} → ${dependentOriginEscape(edge.target.displayName)}</span>
                            <small>${dependentOriginEscape(dependentOriginText(edge.junctionKey))}</small>
                        </button>
                    `).join('')}
                </div>
            </section>
            <p class="dependent-origin-inspector__hint">${dependentOriginEscape(dependentOriginText('overviewHint'))}</p>
        `;
    }

    const unlock = host.querySelector('[data-dependent-origin-unlock]');
    if (unlock) {
        unlock.addEventListener('click', () => {
            dependentOriginState.lockedDetail = null;
            dependentOriginState.previewDetail = null;
            dependentOrigination(doSvg, dependentOriginData);
        });
    }
    host.querySelectorAll('[data-dependent-inspector-edge]').forEach((button) => {
        button.addEventListener('click', () => {
            dependentOriginState.lockedDetail = {kind: 'edge', id: button.dataset.dependentInspectorEdge};
            dependentOriginState.previewDetail = null;
            dependentOrigination(doSvg, dependentOriginData);
        });
    });
}

function syncDependentOriginHighlight(reference) {
    const workspace = document.querySelector('.dependent-origin-workspace');
    if (!workspace) {
        return;
    }
    workspace.querySelectorAll('.is-preview, .is-related-preview').forEach((element) => {
        element.classList.remove('is-preview', 'is-related-preview');
    });
    if (!reference) {
        return;
    }
    const element = workspace.querySelector(`[data-detail-kind="${reference.kind}"][data-detail-id="${reference.id}"]`);
    if (element) {
        element.classList.add('is-preview');
    }
    if (reference.kind === 'edge' && element) {
        ['sourceId', 'targetId'].forEach((key) => {
            const factor = workspace.querySelector(`[data-detail-kind="factor"][data-detail-id="${element.dataset[key]}"]`);
            if (factor) {
                factor.classList.add('is-related-preview');
            }
        });
    }
    if (reference.kind === 'factor') {
        workspace.querySelectorAll(`[data-source-id="${reference.id}"], [data-target-id="${reference.id}"]`).forEach((edge) => {
            edge.classList.add('is-related-preview');
        });
    }
}

function bindDependentOriginDetailInteractions(model, parent, host) {
    host.querySelectorAll('[data-detail-kind]').forEach((element) => {
        const reference = {kind: element.dataset.detailKind, id: element.dataset.detailId};
        const preview = () => {
            dependentOriginState.previewDetail = reference;
            syncDependentOriginHighlight(reference);
            renderDependentOriginInspector(model, reference);
        };
        const clearPreview = () => {
            dependentOriginState.previewDetail = null;
            syncDependentOriginHighlight(dependentOriginState.lockedDetail);
            renderDependentOriginInspector(model, dependentOriginState.lockedDetail);
        };
        element.addEventListener('pointerenter', preview);
        element.addEventListener('pointerleave', clearPreview);
        element.addEventListener('focus', preview);
        element.addEventListener('blur', clearPreview);
        element.addEventListener('click', () => {
            dependentOriginState.lockedDetail = reference;
            dependentOriginState.previewDetail = null;
            dependentOrigination(parent, dependentOriginData);
        });
    });
}

function dependentOrigination(parent, data) {
    const model = buildDependentOriginModel(data);
    if (!model.lensById[dependentOriginState.lensId]) {
        dependentOriginState.lensId = 'chain';
        dependentOriginState.filterId = 'all';
    }
    const lens = model.lensById[dependentOriginState.lensId];
    if (!lens.filterOptions.some((filter) => filter.id === dependentOriginState.filterId)) {
        dependentOriginState.filterId = 'all';
    }
    const workspace = document.querySelector('.dependent-origin-workspace');
    if (workspace) {
        workspace.dataset.lens = dependentOriginState.lensId;
    }
    renderDependentOriginSummary(model);
    renderDependentOriginControls(model, parent);
    renderDependentOriginMap(model, parent);
    renderDependentOriginInspector(model, dependentOriginState.previewDetail || dependentOriginState.lockedDetail);

    if (workspace && !workspace.dataset.keyboardBound) {
        workspace.dataset.keyboardBound = 'true';
        workspace.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && dependentOriginState.lockedDetail) {
                dependentOriginState.lockedDetail = null;
                dependentOriginState.previewDetail = null;
                dependentOrigination(doSvg, dependentOriginData);
            }
        });
    }
}

window.dependentOrigination = dependentOrigination;
