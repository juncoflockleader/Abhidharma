const rupaOriginState = {
    originId: 'kamma',
    lockedDetail: null,
    previewDetail: null,
};

function rupaOriginEscape(value) {
    return String(value === undefined || value === null ? '' : value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function rupaOriginTags(values, modifier = '') {
    return (values || []).map((value) => (
        `<span class="rupa-origin-tag${modifier ? ` rupa-origin-tag--${modifier}` : ''}">${rupaOriginEscape(value)}</span>`
    )).join('');
}

function rupaOriginDetail(model, detail) {
    const origin = model.originById[rupaOriginState.originId] || model.origins[0];
    if (!detail || detail.kind === 'origin') {
        return {kind: 'origin', item: origin, origin};
    }
    if (detail.kind === 'cluster') {
        const cluster = origin.clusters.find((item) => String(item.id) === String(detail.id));
        return cluster ? {kind: 'cluster', item: cluster, origin} : {kind: 'origin', item: origin, origin};
    }
    if (detail.kind === 'route') {
        const route = origin.routes.find((item) => item.id === detail.id);
        return route ? {kind: 'route', item: route, origin} : {kind: 'origin', item: origin, origin};
    }
    return {kind: 'origin', item: origin, origin};
}

function renderRupaOriginSummary(model) {
    const host = document.getElementById('rupa-origin-summary');
    if (!host) {
        return;
    }
    const origin = model.originById[rupaOriginState.originId] || model.origins[0];
    host.innerHTML = `
        <div class="rupa-origin-summary__copy">
            <span class="rupa-origin-eyebrow">${rupaOriginEscape(rupaOriginText('selectedOrigin'))} · ${rupaOriginEscape(origin.name)}</span>
            <h2>${rupaOriginEscape(rupaOriginText('title'))}</h2>
            <p>${rupaOriginEscape(rupaOriginText('intro'))}</p>
        </div>
        <div class="rupa-origin-summary__stats" aria-label="${rupaOriginEscape(rupaOriginText('overview'))}">
            <span><strong>${model.totals.origins}</strong> ${rupaOriginEscape(rupaOriginText('fourOrigins'))}</span>
            <span><strong>${model.totals.clusters}</strong> ${rupaOriginEscape(rupaOriginText('clusters'))}</span>
            <span><strong>${model.totals.commonRupa}</strong> ${rupaOriginEscape(rupaOriginText('inseparables'))}</span>
        </div>
    `;
}

function renderRupaOriginControls(model, parent) {
    const host = document.getElementById('rupa-origin-controls');
    if (!host) {
        return;
    }
    const locked = rupaOriginDetail(model, rupaOriginState.lockedDetail);
    host.setAttribute('aria-label', rupaOriginText('originAria'));
    host.innerHTML = `
        <div class="rupa-origin-controls__heading">
            <span>${rupaOriginEscape(rupaOriginText('chooseOrigin'))}</span>
            <small>${rupaOriginEscape(rupaOriginText('clusterHint'))}</small>
        </div>
        <div class="rupa-origin-selector-list">
            ${model.origins.map((origin) => {
                const selected = origin.id === rupaOriginState.originId;
                const related = locked.kind === 'route' && locked.item.targetId === origin.id;
                return `
                    <button class="rupa-origin-selector${selected ? ' is-selected' : ''}${related ? ' is-related' : ''}"
                            type="button" data-origin-id="${rupaOriginEscape(origin.id)}"
                            data-origin="${rupaOriginEscape(origin.id)}" aria-pressed="${String(selected)}">
                        <span class="rupa-origin-selector__name">${rupaOriginEscape(origin.name)}</span>
                        <span class="rupa-origin-selector__cause">${rupaOriginEscape(origin.cause)}</span>
                        <span class="rupa-origin-selector__meta">${origin.producedRupa.length} ${rupaOriginEscape(rupaOriginText('rupaTypes'))} · ${origin.clusters.length} ${rupaOriginEscape(rupaOriginText('clusters'))}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;

    host.querySelectorAll('[data-origin-id]').forEach((button) => {
        button.addEventListener('click', () => {
            rupaOriginState.originId = button.dataset.originId;
            rupaOriginState.lockedDetail = null;
            rupaOriginState.previewDetail = null;
            renderRupaOrigins(parent);
        });
    });
}

function rupaOriginStageCard(label, value, body, originId, className = '') {
    return `
        <section class="rupa-origin-stage-card ${className}" data-origin="${rupaOriginEscape(originId)}">
            <span class="rupa-origin-stage-card__label">${rupaOriginEscape(label)}</span>
            <strong>${rupaOriginEscape(value)}</strong>
            <div class="rupa-origin-stage-card__body">${body}</div>
        </section>
    `;
}

function renderRupaOriginMap(model, parent) {
    const host = parent && typeof parent.node === 'function' ? parent.node() : document.getElementById('rupa-origin-map');
    if (!host) {
        return;
    }
    const origin = model.originById[rupaOriginState.originId] || model.origins[0];
    const selectedDetail = rupaOriginState.lockedDetail;
    const commonPreview = origin.commonRupa.slice(0, 4);
    const distinctivePreview = origin.distinctiveRupa.slice(0, 5);

    host.setAttribute('aria-label', rupaOriginText('mapAria'));
    host.dataset.origin = origin.id;
    host.innerHTML = `
        <div class="rupa-origin-path" role="group" aria-label="${rupaOriginEscape(origin.name)}">
            ${rupaOriginStageCard(
                rupaOriginText('sourceCause'),
                origin.name,
                `<p>${rupaOriginEscape(origin.cause)}</p>`,
                origin.id,
                'rupa-origin-stage-card--source'
            )}
            <span class="rupa-origin-path__arrow" aria-hidden="true">→</span>
            ${rupaOriginStageCard(
                rupaOriginText('directResult'),
                `${origin.producedRupa.length} ${rupaOriginText('rupaTypes')} · ${origin.clusters.length} ${rupaOriginText('clusters')}`,
                `<p>${rupaOriginEscape(rupaOriginText('contains'))} ${origin.commonRupa.length} ${rupaOriginEscape(rupaOriginText('inseparables'))}</p>
                 <div class="rupa-origin-tag-list">${rupaOriginTags([...commonPreview, ...distinctivePreview])}</div>`,
                origin.id,
                'rupa-origin-stage-card--result'
            )}
            <span class="rupa-origin-path__arrow" aria-hidden="true">→</span>
            <section class="rupa-origin-propagation" aria-label="${rupaOriginEscape(rupaOriginText('propagation'))}">
                <span class="rupa-origin-stage-card__label">${rupaOriginEscape(rupaOriginText('propagation'))}</span>
                ${origin.routes.map((route) => {
                    const isSelected = selectedDetail && selectedDetail.kind === 'route' && selectedDetail.id === route.id;
                    return `
                        <button type="button" class="rupa-origin-route${isSelected ? ' is-selected' : ''}"
                                data-detail-kind="route" data-detail-id="${rupaOriginEscape(route.id)}"
                                data-target-origin="${rupaOriginEscape(route.targetId)}">
                            <span class="rupa-origin-route__seed rupa-origin-route__seed--${rupaOriginEscape(route.seed)}">${rupaOriginEscape(route.seedName)}</span>
                            <span class="rupa-origin-route__arrow" aria-hidden="true">→</span>
                            <span class="rupa-origin-route__result">
                                <strong>${rupaOriginEscape(route.targetName)}</strong>
                                <small>${route.requiresSupport ? `${rupaOriginEscape(rupaOriginText('needsSupport'))} · ` : ''}${rupaOriginEscape(route.generationLabel)}</small>
                            </span>
                        </button>
                    `;
                }).join('')}
            </section>
        </div>
        <section class="rupa-origin-clusters" aria-labelledby="rupa-origin-cluster-title">
            <div class="rupa-origin-section-heading">
                <div>
                    <span>${rupaOriginEscape(origin.name)}</span>
                    <h3 id="rupa-origin-cluster-title">${rupaOriginEscape(rupaOriginText('clusterCatalogue'))}</h3>
                </div>
                <span class="rupa-origin-count">${origin.clusters.length} ${rupaOriginEscape(rupaOriginText('clusters'))}</span>
            </div>
            <div class="rupa-origin-cluster-grid">
                ${origin.clusters.map((cluster) => {
                    const isSelected = selectedDetail && selectedDetail.kind === 'cluster' && String(selectedDetail.id) === String(cluster.id);
                    const additions = cluster.additions.length ? cluster.additions : [rupaOriginText('noExtraRupa')];
                    return `
                        <button type="button" class="rupa-origin-cluster${isSelected ? ' is-selected' : ''}"
                                data-detail-kind="cluster" data-detail-id="${cluster.id}">
                            <span class="rupa-origin-cluster__index">${cluster.composition.length}</span>
                            <strong>${rupaOriginEscape(cluster.name)}</strong>
                            <span>${rupaOriginEscape(additions.join(' · '))}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </section>
    `;

    bindRupaOriginDetailInteractions(model, parent, host);
}

function renderRupaOriginInspector(model, detailReference) {
    const host = document.getElementById('rupa-origin-inspector');
    if (!host) {
        return;
    }
    host.setAttribute('aria-label', rupaOriginText('inspectorAria'));
    const detail = rupaOriginDetail(model, detailReference);
    const showUnlock = detail.kind !== 'origin' && Boolean(rupaOriginState.lockedDetail);

    if (detail.kind === 'cluster') {
        const cluster = detail.item;
        host.innerHTML = `
            <div class="rupa-origin-inspector__eyebrow">${rupaOriginEscape(detail.origin.name)} · ${rupaOriginEscape(rupaOriginText('clusterComposition'))}</div>
            <h3>${rupaOriginEscape(cluster.name)}</h3>
            <p>${rupaOriginEscape(rupaOriginText('total'))} ${cluster.composition.length} ${rupaOriginEscape(rupaOriginText('items'))}</p>
            <div class="rupa-origin-inspector__section">
                <strong>${rupaOriginEscape(rupaOriginText('commonRupa'))}</strong>
                <div class="rupa-origin-tag-list">${rupaOriginTags(detail.origin.commonRupa, 'common')}</div>
            </div>
            <div class="rupa-origin-inspector__section">
                <strong>${rupaOriginEscape(rupaOriginText('distinctiveRupa'))}</strong>
                <div class="rupa-origin-tag-list">${rupaOriginTags(cluster.additions.length ? cluster.additions : [rupaOriginText('noExtraRupa')], 'specific')}</div>
            </div>
            ${showUnlock ? `<button type="button" class="rupa-origin-unlock" data-rupa-origin-unlock>${rupaOriginEscape(rupaOriginText('unlock'))}</button>` : ''}
        `;
    } else if (detail.kind === 'route') {
        const route = detail.item;
        host.innerHTML = `
            <div class="rupa-origin-inspector__eyebrow">${rupaOriginEscape(detail.origin.name)} · ${rupaOriginEscape(rupaOriginText('routeDetail'))}</div>
            <h3>${rupaOriginEscape(route.name)}</h3>
            <dl class="rupa-origin-facts">
                <div><dt>${rupaOriginEscape(rupaOriginText('routeFrom'))}</dt><dd>${rupaOriginEscape(detail.origin.name)} · ${rupaOriginEscape(route.seedName)}</dd></div>
                <div><dt>${rupaOriginEscape(rupaOriginText('routeTo'))}</dt><dd>${rupaOriginEscape(route.targetName)}</dd></div>
                <div><dt>${rupaOriginEscape(rupaOriginText('generations'))}</dt><dd>${rupaOriginEscape(route.generationLabel)}</dd></div>
            </dl>
            <div class="rupa-origin-inspector__section">
                <strong>${rupaOriginEscape(rupaOriginText('routeCondition'))}</strong>
                <p>${rupaOriginEscape(route.condition)}</p>
            </div>
            ${showUnlock ? `<button type="button" class="rupa-origin-unlock" data-rupa-origin-unlock>${rupaOriginEscape(rupaOriginText('unlock'))}</button>` : ''}
        `;
    } else {
        const origin = detail.origin;
        host.innerHTML = `
            <div class="rupa-origin-inspector__eyebrow">${rupaOriginEscape(rupaOriginText('overview'))}</div>
            <h3>${rupaOriginEscape(origin.name)}</h3>
            <p class="rupa-origin-inspector__lead">${rupaOriginEscape(origin.cause)}</p>
            <dl class="rupa-origin-facts">
                <div><dt>${rupaOriginEscape(rupaOriginText('producedRupa'))}</dt><dd>${origin.producedRupa.length} ${rupaOriginEscape(rupaOriginText('rupaTypes'))}</dd></div>
                <div><dt>${rupaOriginEscape(rupaOriginText('clusterCatalogue'))}</dt><dd>${origin.clusters.length} ${rupaOriginEscape(rupaOriginText('clusters'))}</dd></div>
                <div><dt>${rupaOriginEscape(rupaOriginText('generations'))}</dt><dd>${rupaOriginEscape(origin.generationLabel)}</dd></div>
            </dl>
            <div class="rupa-origin-inspector__section">
                <strong>${rupaOriginEscape(rupaOriginText('why'))}</strong>
                <p>${rupaOriginEscape(origin.why)}</p>
            </div>
            <div class="rupa-origin-inspector__section">
                <strong>${rupaOriginEscape(rupaOriginText('distinctiveRupa'))}</strong>
                <div class="rupa-origin-tag-list">${rupaOriginTags(origin.distinctiveRupa, 'specific')}</div>
            </div>
        `;
    }

    const unlock = host.querySelector('[data-rupa-origin-unlock]');
    if (unlock) {
        unlock.addEventListener('click', () => {
            rupaOriginState.lockedDetail = null;
            rupaOriginState.previewDetail = null;
            renderRupaOrigins(rpgSvg);
        });
    }
}

function syncRupaOriginHighlight(detailReference) {
    const workspace = document.querySelector('.rupa-origin-workspace');
    if (!workspace) {
        return;
    }
    workspace.querySelectorAll('.is-preview, .is-related-preview').forEach((element) => {
        element.classList.remove('is-preview', 'is-related-preview');
    });
    if (!detailReference) {
        return;
    }
    const detailElement = workspace.querySelector(`[data-detail-kind="${detailReference.kind}"][data-detail-id="${detailReference.id}"]`);
    if (detailElement) {
        detailElement.classList.add('is-preview');
    }
    if (detailReference.kind === 'route') {
        const targetId = detailElement && detailElement.dataset.targetOrigin;
        const target = targetId ? workspace.querySelector(`[data-origin-id="${targetId}"]`) : null;
        if (target) {
            target.classList.add('is-related-preview');
        }
    }
}

function bindRupaOriginDetailInteractions(model, parent, host) {
    host.querySelectorAll('[data-detail-kind]').forEach((element) => {
        const detail = {kind: element.dataset.detailKind, id: element.dataset.detailId};
        const preview = () => {
            rupaOriginState.previewDetail = detail;
            syncRupaOriginHighlight(detail);
            renderRupaOriginInspector(model, detail);
        };
        const clearPreview = () => {
            rupaOriginState.previewDetail = null;
            syncRupaOriginHighlight(rupaOriginState.lockedDetail);
            renderRupaOriginInspector(model, rupaOriginState.lockedDetail);
        };
        element.addEventListener('pointerenter', preview);
        element.addEventListener('pointerleave', clearPreview);
        element.addEventListener('focus', preview);
        element.addEventListener('blur', clearPreview);
        element.addEventListener('click', () => {
            rupaOriginState.lockedDetail = detail;
            rupaOriginState.previewDetail = null;
            renderRupaOrigins(parent);
        });
    });
}

function renderRupaOrigins(parent) {
    const model = buildRupaOriginModel();
    if (!model.originById[rupaOriginState.originId]) {
        rupaOriginState.originId = model.origins[0].id;
    }
    renderRupaOriginSummary(model);
    renderRupaOriginControls(model, parent);
    renderRupaOriginMap(model, parent);
    renderRupaOriginInspector(model, rupaOriginState.previewDetail || rupaOriginState.lockedDetail);

    const workspace = document.querySelector('.rupa-origin-workspace');
    if (workspace && !workspace.dataset.keyboardBound) {
        workspace.dataset.keyboardBound = 'true';
        workspace.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && rupaOriginState.lockedDetail) {
                rupaOriginState.lockedDetail = null;
                rupaOriginState.previewDetail = null;
                renderRupaOrigins(rpgSvg);
            }
        });
    }
}

window.renderRupaOrigins = renderRupaOrigins;
