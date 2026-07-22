function createFlowWorkspaceState(type, options) {
    return {
        type,
        likable: 1,
        arahant: false,
        goodIntention: true,
        sliderValue: 1,
        selectedPhaseId: null,
        container: options.container,
        controls: options.controls,
        summary: options.summary,
        inspector: options.inspector,
        markerName: options.markerName,
        viewModel: null,
    };
}

const senseFlowState = createFlowWorkspaceState('sense', {
    container: '#senseflow',
    controls: '#senseflowcontrols',
    summary: '#senseflowsummary',
    inspector: '#senseflowinspector',
    markerName: 'sense-flow-arrow',
});

const mindFlowState = createFlowWorkspaceState('mind', {
    container: '#mindflow',
    controls: '#mindflowcontrols',
    summary: '#mindflowsummary',
    inspector: '#mindflowinspector',
    markerName: 'mind-flow-arrow',
});

function flowEscapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function flowLabelLines(label, limit = 11, maxLines = 3) {
    const value = String(label || '');
    const words = /\s/.test(value) ? value.split(/\s+/).filter(Boolean) : [...value];
    const joiner = /\s/.test(value) ? ' ' : '';
    const lines = [];
    let current = '';

    words.forEach((word) => {
        const candidate = current ? `${current}${joiner}${word}` : word;
        if (candidate.length <= limit || !current) {
            current = candidate;
            return;
        }
        lines.push(current);
        current = word;
    });
    if (current) {
        lines.push(current);
    }
    if (lines.length > maxLines) {
        const visible = lines.slice(0, maxLines);
        visible[maxLines - 1] = `${visible[maxLines - 1].slice(0, Math.max(1, limit - 1))}…`;
        return visible;
    }
    return lines;
}

function appendFlowNodeLabel(group, label) {
    const lines = flowLabelLines(label);
    const text = group.append('text')
        .attr('class', 'flow-node__label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');
    const lineHeight = 12;
    const startY = -((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
        text.append('tspan')
            .attr('x', 0)
            .attr('y', startY + index * lineHeight)
            .text(line);
    });
}

function flowCandidateTags(values, limit = 8) {
    if (!values || !values.length) {
        return '';
    }
    const visible = values.slice(0, limit)
        .map((value) => `<span class="flow-tag">${flowEscapeHtml(value)}</span>`)
        .join('');
    const hidden = values.slice(limit);
    const more = hidden.length
        ? `<details class="flow-inspector__more"><summary>+${hidden.length}</summary><div class="flow-tags">${hidden.map((value) => `<span class="flow-tag">${flowEscapeHtml(value)}</span>`).join('')}</div></details>`
        : '';
    return `<div class="flow-tags">${visible}${more}</div>`;
}

function renderFlowSummary(state, viewModel) {
    const host = document.querySelector(state.summary);
    if (!host) {
        return;
    }
    host.innerHTML = `
        <div class="flow-summary__copy">
            <div class="flow-summary__eyebrow">${flowEscapeHtml(flowUiText('currentConclusion'))}</div>
            <h2>${flowEscapeHtml(viewModel.title)}</h2>
            <p>${flowEscapeHtml(viewModel.intro)}</p>
        </div>
        <div class="flow-summary__result">
            <strong>${flowEscapeHtml(viewModel.patternLabel)}</strong>
            <div class="flow-summary__badges">
                ${viewModel.badges.map((badge) => `<span>${flowEscapeHtml(badge)}</span>`).join('')}
            </div>
        </div>
    `;
}

function renderFlowInspector(state, viewModel, phaseId, options = {}) {
    const host = document.querySelector(state.inspector);
    if (!host) {
        return;
    }
    const detail = phaseId === null || phaseId === undefined
        ? null
        : buildFlowPhaseDetail(viewModel, phaseId);

    if (!detail) {
        const conditionLabels = [
            `${flowUiText('currentLevel')}: ${viewModel.pattern.id} · ${viewModel.patternLabel}`,
            `${flowUiText('objectNature')}: ${flowUiText(viewModel.scenario.likable === 1 ? 'veryPleasant' : (viewModel.scenario.likable === 2 ? 'pleasant' : 'unpleasant'))}`,
            `${flowUiText('person')}: ${flowUiText(viewModel.scenario.arahant ? 'arahant' : 'learner')}`,
        ];
        if (!viewModel.scenario.arahant) {
            conditionLabels.push(`${flowUiText('attention')}: ${flowUiText(viewModel.scenario.goodIntention ? 'properAttention' : 'improperAttention')}`);
        }
        host.innerHTML = `
            <div class="flow-inspector__breadcrumb">${flowEscapeHtml(viewModel.title)} › ${flowEscapeHtml(flowUiText('overview'))}</div>
            <h3>${flowEscapeHtml(viewModel.patternLabel)}</h3>
            <p class="flow-inspector__lead">${flowEscapeHtml(flowUiText('selectPhase'))}</p>
            <section>
                <strong>${flowEscapeHtml(flowUiText('whyThisFlow'))}</strong>
                <ul>${viewModel.overviewReasons.map((reason) => `<li>${flowEscapeHtml(reason)}</li>`).join('')}</ul>
            </section>
            <section>
                <strong>${flowEscapeHtml(flowUiText('currentConditions'))}</strong>
                ${flowCandidateTags(conditionLabels, 10)}
            </section>
            <p class="flow-inspector__hint">${flowEscapeHtml(flowUiText('overviewHint'))}</p>
        `;
        return;
    }

    const lockButton = options.transient
        ? ''
        : `<button class="flow-button flow-button--quiet" type="button" data-flow-unlock>${flowEscapeHtml(flowUiText('unlock'))}</button>`;
    host.innerHTML = `
        <div class="flow-inspector__breadcrumb">${flowEscapeHtml(viewModel.title)} › ${flowEscapeHtml(detail.familyLabel)}</div>
        <div class="flow-inspector__heading-row">
            <div>
                <h3>${flowEscapeHtml(detail.title)}</h3>
                <div class="flow-inspector__meta">${flowEscapeHtml(detail.occurrences)} ${flowEscapeHtml(flowUiText('occurrences'))} · ${flowEscapeHtml(flowUiText('moment'))} ${detail.moments.join(', ')}</div>
            </div>
            ${lockButton}
        </div>
        <p class="flow-inspector__lead">${flowEscapeHtml(detail.description)}</p>
        <section>
            <strong>${flowEscapeHtml(flowUiText('whyThisFlow'))}</strong>
            <p>${flowEscapeHtml(detail.reason)}</p>
        </section>
        ${detail.candidateClass ? `<section><strong>${flowEscapeHtml(flowUiText('candidateClass'))}</strong><p>${flowEscapeHtml(detail.candidateClass)}</p></section>` : ''}
        ${detail.candidateCittas.length ? `<section><strong>${flowEscapeHtml(flowUiText('candidateCittas'))}</strong>${flowCandidateTags(detail.candidateCittas)}</section>` : ''}
        <section>
            <strong>${flowEscapeHtml(flowUiText('relation'))}</strong>
            <div class="flow-relation"><span>${flowEscapeHtml(flowUiText('before'))}: ${flowEscapeHtml(detail.previous)}</span><span>${flowEscapeHtml(flowUiText('after'))}: ${flowEscapeHtml(detail.next)}</span></div>
        </section>
    `;

    const unlock = host.querySelector('[data-flow-unlock]');
    if (unlock) {
        unlock.addEventListener('click', () => {
            state.selectedPhaseId = null;
            renderFlow(state);
        });
    }
}

function renderRupaLifeOverlay(svg, xForMoment, cardTop, markerName) {
    const startX = xForMoment(1);
    const endX = xForMoment(17);
    const lineY = 78;

    svg.append('line')
        .attr('class', 'flow-rupa-life')
        .attr('x1', startX)
        .attr('y1', lineY)
        .attr('x2', endX)
        .attr('y2', lineY);
    svg.append('circle')
        .attr('class', 'flow-rupa-object')
        .attr('cx', startX)
        .attr('cy', lineY)
        .attr('r', 10);
    svg.append('text')
        .attr('class', 'flow-rupa-life__label')
        .attr('x', (startX + endX) / 2)
        .attr('y', lineY - 10)
        .attr('text-anchor', 'middle')
        .text(flowUiText('rupaLife'));
    svg.append('text')
        .attr('class', 'flow-rupa-life__impact')
        .attr('x', startX + 14)
        .attr('y', lineY + 18)
        .text(flowUiText('impact'));
    [startX, endX].forEach((x) => {
        svg.append('line')
            .attr('class', 'flow-rupa-drop')
            .attr('x1', x)
            .attr('y1', lineY + 11)
            .attr('x2', x)
            .attr('y2', cardTop - 10)
            .attr('marker-end', `url(#${markerName})`);
    });
}

function renderFlowTimeline(state, viewModel) {
    const host = d3.select(state.container);
    host.selectAll('*').remove();

    const nodeWidth = 66;
    const nodeHeight = 62;
    const step = 82;
    const paddingX = 48;
    const cardTop = viewModel.type === 'sense' ? 142 : 94;
    const cardCenterY = cardTop + nodeHeight / 2;
    const width = Math.max(920, paddingX * 2 + (viewModel.nodes.length - 1) * step + nodeWidth);
    const height = cardTop + nodeHeight + 72;
    const xForMoment = (moment) => paddingX + nodeWidth / 2 + moment * step;

    const svg = host.append('svg')
        .attr('class', 'flow-timeline')
        .attr('width', width)
        .attr('height', height)
        .attr('role', 'group')
        .attr('aria-label', `${viewModel.title}: ${viewModel.patternLabel}`);

    setupArrowHead(svg, state.markerName);

    const bands = svg.append('g').attr('class', 'flow-phase-bands');
    const bandGroups = bands.selectAll('g')
        .data(viewModel.groups)
        .join('g')
        .attr('class', 'flow-phase-band');
    bandGroups.append('rect')
        .attr('x', (group) => xForMoment(group.startIndex) - nodeWidth / 2 - 5)
        .attr('y', 8)
        .attr('width', (group) => xForMoment(group.endIndex) - xForMoment(group.startIndex) + nodeWidth + 10)
        .attr('height', 30)
        .attr('rx', 7)
        .attr('fill', (group) => group.color)
        .attr('opacity', 0.13);
    bandGroups.append('text')
        .attr('x', (group) => (xForMoment(group.startIndex) + xForMoment(group.endIndex)) / 2)
        .attr('y', 27)
        .attr('text-anchor', 'middle')
        .attr('fill', (group) => group.color)
        .text((group) => `${group.label}${group.count > 1 ? ` ×${group.count}` : ''}`);

    if (viewModel.type === 'sense') {
        renderRupaLifeOverlay(svg, xForMoment, cardTop, state.markerName);
    }

    svg.append('g')
        .attr('class', 'flow-connectors')
        .selectAll('line')
        .data(viewModel.nodes.slice(0, -1))
        .join('line')
        .attr('x1', (node) => xForMoment(node.id) + nodeWidth / 2 + 3)
        .attr('y1', cardCenterY)
        .attr('x2', (node) => xForMoment(node.id + 1) - nodeWidth / 2 - 7)
        .attr('y2', cardCenterY)
        .attr('marker-end', `url(#${state.markerName})`);

    svg.append('g')
        .attr('class', 'flow-moment-labels')
        .selectAll('text')
        .data(viewModel.nodes)
        .join('text')
        .attr('x', (node) => xForMoment(node.id))
        .attr('y', cardTop - 9)
        .attr('text-anchor', 'middle')
        .text((node) => node.moment);

    const nodeGroups = svg.append('g')
        .attr('class', 'flow-nodes')
        .selectAll('g')
        .data(viewModel.nodes)
        .join('g')
        .attr('class', 'flow-node')
        .attr('transform', (node) => `translate(${xForMoment(node.id)}, ${cardCenterY})`)
        .attr('data-flow-phase-id', (node) => node.phaseId)
        .attr('role', 'button')
        .attr('tabindex', 0)
        .attr('aria-pressed', (node) => String(Number(state.selectedPhaseId) === node.phaseId))
        .attr('aria-label', (node) => `${flowUiText('moment')} ${node.moment}: ${flowTranslatedKey(node.definition.labelKey)}`);

    nodeGroups.append('rect')
        .attr('x', -nodeWidth / 2)
        .attr('y', -nodeHeight / 2)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 10)
        .attr('fill', (node) => FLOW_FAMILY_DEFINITIONS[node.family].color);

    nodeGroups.each(function(node) {
        appendFlowNodeLabel(d3.select(this), flowTranslatedKey(node.definition.labelKey));
    });

    function applyLockedSelection() {
        const selectedId = Number(state.selectedPhaseId);
        nodeGroups
            .classed('is-selected', (node) => Number.isFinite(selectedId) && node.phaseId === selectedId)
            .attr('aria-pressed', (node) => String(Number.isFinite(selectedId) && node.phaseId === selectedId));
    }

    function previewPhase(source, node) {
        nodeGroups
            .classed('is-related', (candidate) => candidate.phaseId === node.phaseId)
            .classed('is-hover-source', false);
        d3.select(source).classed('is-hover-source', true);
        renderFlowInspector(state, viewModel, node.phaseId, {transient: true});
    }

    function clearPreview() {
        nodeGroups.classed('is-related', false).classed('is-hover-source', false);
        renderFlowInspector(state, viewModel, state.selectedPhaseId);
    }

    function togglePhase(node) {
        state.selectedPhaseId = Number(state.selectedPhaseId) === node.phaseId ? null : node.phaseId;
        applyLockedSelection();
        clearPreview();
    }

    nodeGroups
        .on('mouseenter', function(event, node) {
            if (state.selectedPhaseId !== null) {
                return;
            }
            previewPhase(this, node);
        })
        .on('mouseleave', function() {
            if (state.selectedPhaseId !== null) {
                return;
            }
            clearPreview();
        })
        .on('focus', function(event, node) {
            if (state.selectedPhaseId !== null) {
                return;
            }
            previewPhase(this, node);
        })
        .on('blur', function() {
            if (state.selectedPhaseId !== null) {
                return;
            }
            clearPreview();
        })
        .on('click', function(event, node) {
            togglePhase(node);
        })
        .on('keydown', function(event, node) {
            if (event.key === 'Escape') {
                event.preventDefault();
                state.selectedPhaseId = null;
                applyLockedSelection();
                clearPreview();
                return;
            }
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }
            event.preventDefault();
            togglePhase(node);
        });

    applyLockedSelection();
}

function flowSettingButtons(key, options) {
    return options.map((option) => (
        `<button class="flow-segment" type="button" data-flow-setting="${flowEscapeHtml(key)}" data-flow-value="${flowEscapeHtml(option.value)}">${flowEscapeHtml(option.label)}</button>`
    )).join('');
}

function renderControls(state, min, max) {
    const host = d3.select(state.controls);
    host.selectAll('*').remove();
    const type = state.type;
    const bands = FLOW_STRENGTH_BANDS[type];
    const presets = FLOW_PRESETS[type];
    const strengthTitle = flowUiText(type === 'sense' ? 'intensity' : 'clarity');

    host.html(`
        <div class="flow-presets">
            <span>${flowEscapeHtml(flowUiText('presets'))}</span>
            ${presets.map((preset) => `<button class="flow-preset" type="button" data-flow-preset="${flowEscapeHtml(preset.id)}">${flowEscapeHtml(flowUiText(preset.labelKey))}</button>`).join('')}
        </div>
        <div class="flow-control-card flow-control-card--strength">
            <div class="flow-control-card__title"><span>${flowEscapeHtml(strengthTitle)}</span><output data-flow-strength-output></output></div>
            <div class="flow-range-wrap">
                <span>${flowEscapeHtml(flowUiText('strongest'))}</span>
                <input type="range" min="${min}" max="${max}" step="1" value="${state.sliderValue}" data-flow-strength aria-label="${flowEscapeHtml(strengthTitle)}">
                <span>${flowEscapeHtml(flowUiText('weakest'))}</span>
            </div>
            <div class="flow-strength-bands">
                ${bands.map((band) => `<button type="button" data-flow-band="${flowEscapeHtml(band.id)}" data-flow-start="${band.start}" data-flow-end="${band.end}">${flowEscapeHtml(flowTranslatedKey(band.classKey))}<small>${band.start === band.end ? band.start : `${band.start}–${band.end}`}</small></button>`).join('')}
            </div>
        </div>
        <div class="flow-control-card">
            <div class="flow-control-card__title">${flowEscapeHtml(flowUiText('objectNature'))}</div>
            <div class="flow-segments">
                ${flowSettingButtons('likable', [
                    {value: 1, label: flowUiText('veryPleasant')},
                    {value: 2, label: flowUiText('pleasant')},
                    {value: 3, label: flowUiText('unpleasant')},
                ])}
            </div>
        </div>
        <div class="flow-control-card">
            <div class="flow-control-card__title">${flowEscapeHtml(flowUiText('attention'))}</div>
            <div class="flow-segments">
                ${flowSettingButtons('goodIntention', [
                    {value: true, label: flowUiText('properAttention')},
                    {value: false, label: flowUiText('improperAttention')},
                ])}
            </div>
        </div>
        <div class="flow-control-card">
            <div class="flow-control-card__title">${flowEscapeHtml(flowUiText('person'))}</div>
            <div class="flow-segments">
                ${flowSettingButtons('arahant', [
                    {value: false, label: flowUiText('learner')},
                    {value: true, label: flowUiText('arahant')},
                ])}
            </div>
        </div>
        <p class="flow-control-note" data-flow-control-note></p>
    `);

    host.select('[data-flow-strength]').on('input', function() {
        state.sliderValue = Number(this.value);
        state.selectedPhaseId = null;
        renderFlow(state);
    });

    host.selectAll('[data-flow-band]').on('click', function() {
        state.sliderValue = Number(this.dataset.flowStart);
        state.selectedPhaseId = null;
        renderFlow(state);
    });

    host.selectAll('[data-flow-setting]').on('click', function() {
        const key = this.dataset.flowSetting;
        const rawValue = this.dataset.flowValue;
        state[key] = key === 'likable' ? Number(rawValue) : rawValue === 'true';
        state.selectedPhaseId = null;
        renderFlow(state);
    });

    host.selectAll('[data-flow-preset]').on('click', function() {
        const preset = presets.find((candidate) => candidate.id === this.dataset.flowPreset);
        if (!preset) {
            return;
        }
        Object.assign(state, preset.values, {selectedPhaseId: null});
        renderFlow(state);
    });

    bindFlowGlobalEvents();
    syncFlowControls(state, buildFlowViewModel(state));
}

function syncFlowControls(state, viewModel) {
    const host = d3.select(state.controls);
    if (host.empty()) {
        return;
    }
    host.select('[data-flow-strength]').property('value', state.sliderValue);
    host.select('[data-flow-strength-output]').text(viewModel.strengthLabel);
    host.selectAll('[data-flow-band]')
        .classed('active', function() {
            const start = Number(this.dataset.flowStart);
            const end = Number(this.dataset.flowEnd);
            return state.sliderValue >= start && state.sliderValue <= end;
        });
    host.selectAll('[data-flow-setting]').each(function() {
        const key = this.dataset.flowSetting;
        const rawValue = this.dataset.flowValue;
        const target = key === 'likable' ? Number(rawValue) : rawValue === 'true';
        const disabled = key === 'goodIntention' && state.arahant;
        const active = !disabled && state[key] === target;
        d3.select(this)
            .classed('active', active)
            .attr('aria-pressed', String(active))
            .attr('disabled', disabled ? true : null);
    });
    host.select('[data-flow-control-note]').text(
        !viewModel.hasJavana
            ? flowUiText('noJavanaControls')
            : (state.arahant ? flowUiText('attentionNotApplicable') : '')
    );
}

function renderFlow(state) {
    const viewModel = buildFlowViewModel(state);
    state.viewModel = viewModel;
    if (state.selectedPhaseId !== null && !viewModel.phaseCounts[state.selectedPhaseId]) {
        state.selectedPhaseId = null;
    }
    renderFlowSummary(state, viewModel);
    renderFlowTimeline(state, viewModel);
    renderFlowInspector(state, viewModel, state.selectedPhaseId);
    syncFlowControls(state, viewModel);
    return viewModel;
}

function bindFlowGlobalEvents() {
    if (window.flowGlobalEventsBound) {
        return;
    }
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
            return;
        }
        const activeTab = typeof getActiveTab === 'function' ? getActiveTab() : null;
        const state = activeTab && activeTab.id === 'sense-flow'
            ? senseFlowState
            : (activeTab && activeTab.id === 'mind-flow' ? mindFlowState : null);
        if (!state || state.selectedPhaseId === null) {
            return;
        }
        state.selectedPhaseId = null;
        renderFlow(state);
    });
    window.flowGlobalEventsBound = true;
}

// Kept as a small generic helper for the cause-condition page.
function renderButtonGroup(controlsContainer, buttonData, title, state, stateUpdater, renderer) {
    const group = controlsContainer.append('div').attr('class', 'button-group');
    group.append('div').attr('class', 'group-label').text(title);
    const buttons = group.selectAll('button')
        .data(buttonData)
        .enter()
        .append('button')
        .attr('type', 'button')
        .text((data) => data.name)
        .attr('class', (data, index) => index === 0 ? 'radio-button active' : 'radio-button')
        .attr('aria-pressed', (data, index) => String(index === 0))
        .on('click', function(event, data) {
            buttons.classed('active', false).attr('aria-pressed', 'false');
            d3.select(this).classed('active', true).attr('aria-pressed', 'true');
            stateUpdater(state, data);
            return renderer(state);
        });
    return group;
}

window.renderFlow = renderFlow;
window.renderControls = renderControls;
