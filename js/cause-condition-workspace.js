function escapeCauseTraceHtml(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createCauseConditionWorkspaceState(model, host) {
    const initialFlow = model.senseFlows.eye;
    const initialStage = initialFlow.stages[0];
    return {
        model,
        host,
        mode: 'nama',
        flowType: 'sense',
        senseDoor: 'eye',
        stageId: initialStage.id,
        instanceId: initialStage.instances[0].id,
        objectId: initialStage.objectOptions[0].id,
        namaSearch: '',
        rupaTargetType: 'rupa',
        rupaTargetGroup: 'all',
        rupaTargetId: model.rupaTargets.find(entity => entity.domain === 'rupa').id,
        rupaSearch: '',
        rupaMatchMode: 'all',
        conditionGroup: 'all',
        selectedEntryId: null,
        previewEntryId: null,
        showTargetMembers: false,
        trace: null,
    };
}

let causeConditionWorkspaceState = null;

function currentCauseTraceFlow(state) {
    return state.flowType === 'mind'
        ? state.model.mindFlow
        : state.model.senseFlows[state.senseDoor];
}

function syncNamaCauseTraceSelection(state) {
    const flow = currentCauseTraceFlow(state);
    let stage = flow.stages.find(item => item.id === state.stageId);
    if (!stage) {
        stage = flow.stages[0];
        state.stageId = stage.id;
    }
    if (!stage.instances.some(item => item.id === state.instanceId)) {
        state.instanceId = stage.instances[0] ? stage.instances[0].id : null;
    }
    if (!stage.objectOptions.some(item => item.id === state.objectId)) {
        state.objectId = stage.objectOptions[0] ? stage.objectOptions[0].id : null;
    }
}

function filteredRupaTraceTargets(state) {
    return state.model.rupaTargets.filter(entity => {
        if (entity.domain !== state.rupaTargetType) return false;
        return state.rupaTargetGroup === 'all' || entity.group === state.rupaTargetGroup;
    });
}

function syncRupaCauseTraceSelection(state) {
    const targets = filteredRupaTraceTargets(state);
    if (!targets.some(entity => entity.id === Number(state.rupaTargetId))) {
        state.rupaTargetId = targets[0] ? targets[0].id : null;
    }
}

function computeCauseConditionTrace(state) {
    if (state.mode === 'nama') {
        syncNamaCauseTraceSelection(state);
        state.trace = buildNamaCauseTrace(state.model, {
            flowType: state.flowType,
            senseDoor: state.senseDoor,
            stageId: state.stageId,
            instanceId: state.instanceId,
            objectId: state.objectId,
        });
    } else {
        syncRupaCauseTraceSelection(state);
        state.trace = buildRupaCauseTrace(state.model, state.rupaTargetId, state.rupaMatchMode);
    }
    const visibleEntries = visibleCauseTraceEntries(state);
    if (!visibleEntries.some(entry => entry.id === state.selectedEntryId)) {
        state.selectedEntryId = visibleEntries[0] ? visibleEntries[0].id : null;
    }
    state.previewEntryId = null;
    return state.trace;
}

function visibleCauseTraceEntries(state) {
    if (!state.trace) return [];
    return state.conditionGroup === 'all'
        ? state.trace.entries
        : state.trace.entries.filter(entry => entry.group === state.conditionGroup);
}

function focusedCauseTraceEntry(state) {
    const entries = state.trace ? state.trace.entries : [];
    return entries.find(entry => entry.id === state.previewEntryId)
        || entries.find(entry => entry.id === state.selectedEntryId)
        || entries[0]
        || null;
}

function renderCauseTraceSummary(state) {
    const trace = state.trace;
    const container = state.host.querySelector('#cause-trace-summary');
    const nama = state.mode === 'nama';
    const title = nama
        ? `${trace.flow.name} · ${trace.stage.name}`
        : `${trace.target.domainLabel} · ${trace.target.name}`;
    const description = nama
        ? '选中一个具体心路刹那，查看当前心与相应心所受到哪些缘力支持。'
        : '从具体色法或色聚反向查找缘法；同时区分直接缘生与经由色聚包含。';
    const stats = nama
        ? [
            {value: trace.stats.namaCount, label: '当前名法'},
            {value: trace.stats.conditionCount, label: '有效缘力'},
            {value: trace.stats.objectConditionCount, label: '所缘相关'},
        ]
        : [
            {value: trace.stats.conditionCount, label: '匹配规则'},
            {value: trace.stats.directCount, label: '直接缘生'},
            {value: trace.stats.aggregateCount, label: '经由色聚'},
        ];
    container.innerHTML = `
        <div>
            <span class="cause-trace-eyebrow">CONDITION TRACE</span>
            <h2>${escapeCauseTraceHtml(title)}</h2>
            <p>${description}</p>
        </div>
        <div class="cause-trace-summary__stats">
            ${stats.map(item => `<span><strong>${item.value}</strong>${item.label}</span>`).join('')}
        </div>
    `;
}

function renderCauseTraceModeControls(state) {
    const container = state.host.querySelector('#cause-trace-controls');
    container.innerHTML = `
        <div class="cause-trace-mode-list" role="group" aria-label="溯源对象">
            ${state.model.modes.map(mode => `
                <button type="button" data-action="trace-mode" data-mode="${mode.id}" class="${state.mode === mode.id ? 'is-active' : ''}">
                    <strong>${mode.name}</strong><span>${mode.description}</span>
                </button>
            `).join('')}
        </div>
    `;
    container.querySelectorAll('[data-action="trace-mode"]').forEach(button => {
        button.addEventListener('click', () => {
            state.mode = button.dataset.mode;
            state.conditionGroup = 'all';
            state.selectedEntryId = null;
            state.showTargetMembers = false;
            renderCauseConditionWorkspaceView(state);
        });
    });
}

function renderNamaTraceSelector(state) {
    const flow = currentCauseTraceFlow(state);
    const stage = flow.stages.find(item => item.id === state.stageId) || flow.stages[0];
    return `
        <div class="cause-trace-selector__section">
            <span class="cause-trace-selector__label">心路类型</span>
            <div class="cause-trace-segmented">
                <button type="button" data-action="flow-type" data-flow="sense" class="${state.flowType === 'sense' ? 'is-active' : ''}">五门心路</button>
                <button type="button" data-action="flow-type" data-flow="mind" class="${state.flowType === 'mind' ? 'is-active' : ''}">意门心路</button>
            </div>
        </div>
        ${state.flowType === 'sense' ? `
            <div class="cause-trace-selector__section">
                <span class="cause-trace-selector__label">门</span>
                <div class="cause-trace-door-list">
                    ${state.model.senseDoors.map(door => `
                        <button type="button" data-action="sense-door" data-door="${door.id}" class="${state.senseDoor === door.id ? 'is-active' : ''}">${door.name}</button>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        <div class="cause-trace-selector__section cause-trace-selector__section--grow">
            <span class="cause-trace-selector__label">心路阶段</span>
            <div class="cause-trace-stage-list">
                ${flow.stages.map((item, index) => `
                    <button type="button" data-action="trace-stage" data-stage-id="${item.id}" class="${stage.id === item.id ? 'is-active' : ''}">
                        <span>${index + 1}</span><b>${escapeCauseTraceHtml(item.name)}</b><strong>${item.instances.length}</strong>
                    </button>
                `).join('')}
            </div>
        </div>
        <div class="cause-trace-selector__section">
            <label class="cause-trace-selector__label" for="cause-trace-object-select">所缘情境</label>
            <select id="cause-trace-object-select">
                ${stage.objectOptions.map(option => `<option value="${option.id}"${state.objectId === option.id ? ' selected' : ''}>${escapeCauseTraceHtml(option.name)} · ${escapeCauseTraceHtml(option.summary)}</option>`).join('')}
            </select>
        </div>
        <div class="cause-trace-selector__section cause-trace-selector__section--grow">
            <label class="cause-trace-selector__label" for="cause-trace-nama-search">选择心</label>
            <input id="cause-trace-nama-search" type="search" value="${escapeCauseTraceHtml(state.namaSearch)}" placeholder="筛选当前阶段的心" autocomplete="off">
            <div class="cause-trace-target-list" id="cause-trace-nama-targets">
                ${stage.instances.map(instance => `
                    <button type="button" data-action="nama-instance" data-instance-id="${instance.id}" data-search="${escapeCauseTraceHtml(instance.name.toLocaleLowerCase())}" class="${state.instanceId === instance.id ? 'is-active' : ''}">
                        <span>${escapeCauseTraceHtml(instance.name)}</span><small>心 ${instance.cittaId}</small>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRupaTraceSelector(state) {
    const targets = filteredRupaTraceTargets(state);
    const groups = causeTraceUnique(state.model.rupaTargets
        .filter(entity => entity.domain === state.rupaTargetType)
        .map(entity => entity.group));
    return `
        <div class="cause-trace-selector__section">
            <span class="cause-trace-selector__label">目标类型</span>
            <div class="cause-trace-segmented">
                <button type="button" data-action="rupa-target-type" data-target-type="rupa" class="${state.rupaTargetType === 'rupa' ? 'is-active' : ''}">28 色法</button>
                <button type="button" data-action="rupa-target-type" data-target-type="rupa-aggregate" class="${state.rupaTargetType === 'rupa-aggregate' ? 'is-active' : ''}">23 色聚</button>
            </div>
        </div>
        <div class="cause-trace-selector__section">
            <label class="cause-trace-selector__label" for="cause-trace-rupa-group">色法分类</label>
            <select id="cause-trace-rupa-group">
                <option value="all">全部分类</option>
                ${groups.map(group => `<option value="${escapeCauseTraceHtml(group)}"${state.rupaTargetGroup === group ? ' selected' : ''}>${escapeCauseTraceHtml(group)}</option>`).join('')}
            </select>
        </div>
        <div class="cause-trace-selector__section">
            <label class="cause-trace-selector__label" for="cause-trace-rupa-match">匹配范围</label>
            <select id="cause-trace-rupa-match">
                <option value="all"${state.rupaMatchMode === 'all' ? ' selected' : ''}>全部关系</option>
                <option value="direct"${state.rupaMatchMode === 'direct' ? ' selected' : ''}>仅直接缘生</option>
                ${state.rupaTargetType === 'rupa' ? `<option value="aggregate"${state.rupaMatchMode === 'aggregate' ? ' selected' : ''}>仅经由色聚</option>` : ''}
            </select>
        </div>
        <div class="cause-trace-selector__section cause-trace-selector__section--grow">
            <label class="cause-trace-selector__label" for="cause-trace-rupa-search">选择${state.rupaTargetType === 'rupa' ? '色法' : '色聚'}</label>
            <input id="cause-trace-rupa-search" type="search" value="${escapeCauseTraceHtml(state.rupaSearch)}" placeholder="输入名称筛选" autocomplete="off">
            <div class="cause-trace-target-list" id="cause-trace-rupa-targets">
                ${targets.map(entity => `
                    <button type="button" data-action="rupa-target" data-target-id="${entity.id}" data-search="${escapeCauseTraceHtml(`${entity.name} ${entity.group}`.toLocaleLowerCase())}" class="${Number(state.rupaTargetId) === entity.id ? 'is-active' : ''}">
                        <span>${escapeCauseTraceHtml(entity.name)}</span><small>${escapeCauseTraceHtml(entity.group)}</small>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCauseTraceSelector(state) {
    const container = state.host.querySelector('#cause-trace-selector');
    container.innerHTML = `
        <div class="cause-trace-selector__heading">
            <span>${state.mode === 'nama' ? '定位心路刹那' : '选择色法目标'}</span>
            <small>${state.mode === 'nama' ? '阶段 → 所缘 → 心' : '类型 → 分类 → 色法'}</small>
        </div>
        ${state.mode === 'nama' ? renderNamaTraceSelector(state) : renderRupaTraceSelector(state)}
    `;
    bindCauseTraceSelectorInteractions(state);
}

function renderCauseTraceMemberChips(entities) {
    return `<div class="cause-trace-member-chips">${entities.map(entity => `<span>${escapeCauseTraceHtml(entity.name)}</span>`).join('')}</div>`;
}

function renderCauseTraceTarget(state) {
    const trace = state.trace;
    if (trace.mode === 'nama') {
        return `
            <section class="cause-trace-target-card">
                <div class="cause-trace-target-route">
                    <span>${escapeCauseTraceHtml(trace.stage.previousFunction)}</span><b>→</b><span>${escapeCauseTraceHtml(trace.stage.name)}</span><b>→</b><strong>${escapeCauseTraceHtml(trace.instance.name)}</strong>
                </div>
                <div class="cause-trace-target-meta">
                    <span>所缘：${escapeCauseTraceHtml(trace.objectOption.summary)}</span>
                    <span>所依：${escapeCauseTraceHtml(trace.stage.basisSummary)}</span>
                </div>
                <button type="button" class="cause-trace-members-toggle" data-action="toggle-target-members" aria-expanded="${state.showTargetMembers}">
                    当前名聚：1 心 + ${trace.cetasikas.length} 心所
                </button>
                ${state.showTargetMembers ? renderCauseTraceMemberChips([trace.target].concat(trace.cetasikas)) : ''}
            </section>
        `;
    }
    const contextEntities = trace.target.domain === 'rupa-aggregate' ? trace.components : trace.containingAggregates;
    const contextLabel = trace.target.domain === 'rupa-aggregate' ? '色聚包含的色法' : '包含此色法的色聚';
    return `
        <section class="cause-trace-target-card cause-trace-target-card--rupa">
            <div>
                <span class="cause-trace-eyebrow">RUPA TARGET</span>
                <h3>${escapeCauseTraceHtml(trace.target.name)}</h3>
                <p>${escapeCauseTraceHtml(trace.target.domainLabel)} · ${escapeCauseTraceHtml(trace.target.group)}</p>
            </div>
            <button type="button" class="cause-trace-members-toggle" data-action="toggle-target-members" aria-expanded="${state.showTargetMembers}"${contextEntities.length ? '' : ' disabled'}>
                ${contextLabel}：${contextEntities.length}
            </button>
            ${state.showTargetMembers && contextEntities.length ? renderCauseTraceMemberChips(contextEntities) : ''}
        </section>
    `;
}

function renderCauseTraceResults(state) {
    const container = state.host.querySelector('#cause-trace-results');
    const entries = visibleCauseTraceEntries(state);
    const groups = causeTraceUnique(state.trace.entries.map(entry => entry.group));
    container.innerHTML = `
        ${renderCauseTraceTarget(state)}
        <div class="cause-trace-results__heading">
            <div><span class="cause-trace-eyebrow">ACTIVE CONDITIONS</span><h3>缘力清单</h3></div>
            <span>${entries.length} 条</span>
        </div>
        <div class="cause-trace-group-filters" role="group" aria-label="关系组筛选">
            <button type="button" data-action="condition-group" data-group="all" class="${state.conditionGroup === 'all' ? 'is-active' : ''}">全部 <strong>${state.trace.entries.length}</strong></button>
            ${groups.map(group => `
                <button type="button" data-action="condition-group" data-group="${escapeCauseTraceHtml(group)}" class="${state.conditionGroup === group ? 'is-active' : ''}">
                    ${escapeCauseTraceHtml(group)} <strong>${state.trace.entries.filter(entry => entry.group === group).length}</strong>
                </button>
            `).join('')}
        </div>
        <div class="cause-trace-entry-list">
            ${entries.length ? entries.map(entry => `
                <button type="button" class="cause-trace-entry${state.selectedEntryId === entry.id ? ' is-selected' : ''}" data-entry-id="${escapeCauseTraceHtml(entry.id)}">
                    <span class="cause-trace-entry__meta"><span>${escapeCauseTraceHtml(entry.group)}</span><span>${entry.source === 'rupa' ? escapeCauseTraceHtml(entry.matchLabel) : (entry.objectRelated ? '所缘相关' : '当前名聚')}</span></span>
                    <strong>${entry.conditionId ? `${entry.conditionId}. ` : ''}${escapeCauseTraceHtml(entry.conditionName)}</strong>
                    <span class="cause-trace-entry__relation"><span>${escapeCauseTraceHtml(entry.causeSummary)}</span><b>→</b><span>${escapeCauseTraceHtml(entry.effectSummary)}</span></span>
                </button>
            `).join('') : '<div class="cause-trace-empty"><strong>当前筛选没有缘力</strong><span>尝试切换关系组或匹配范围。</span></div>'}
        </div>
    `;
    bindCauseTraceResultInteractions(state);
}

function causeTraceEntryEntityRows(state, entry, role) {
    const ids = role === 'cause' ? entry.causeIds : entry.effectIds;
    if (!ids || !ids.length) return '';
    const entities = ids.slice(0, 24).map(id => resolveConditionEntity(state.model.conditionModel.entityById, id));
    return `
        <div class="cause-trace-inspector__entities">
            <span>${role === 'cause' ? '具体缘法' : '具体缘生法'}</span>
            ${renderCauseTraceMemberChips(entities)}
            ${ids.length > entities.length ? `<small>另有 ${ids.length - entities.length} 个实体，完整集合可在“五十二缘对应”中查看。</small>` : ''}
        </div>
    `;
}

function renderCauseTraceInspectorMarkup(state, entry) {
    if (!entry) {
        return '<div class="cause-trace-empty"><strong>请选择一条缘力</strong><span>详细解释会显示在这里。</span></div>';
    }
    const descriptions = entry.keywordDescriptions || [];
    const notes = causeTraceUnique(entry.notes || []).slice(0, 3);
    return `
        <span class="cause-trace-eyebrow">CONDITION INSPECTOR</span>
        <h2>${entry.conditionId ? `${entry.conditionId}. ` : ''}${escapeCauseTraceHtml(entry.conditionName)}</h2>
        <div class="cause-trace-inspector__badges">
            <span>${escapeCauseTraceHtml(entry.group)}</span>
            ${entry.source === 'rupa' ? `<span>${escapeCauseTraceHtml(entry.matchLabel)}</span>` : ''}
            ${entry.objectRelated ? '<span>所缘情境触发</span>' : ''}
        </div>
        <section class="cause-trace-inspector__relation">
            <div><small>缘法</small><strong>${escapeCauseTraceHtml(entry.causeSummary)}</strong></div>
            <b>↓</b>
            <div><small>缘力</small><strong>${escapeCauseTraceHtml(entry.conditionName)}</strong></div>
            <b>↓</b>
            <div><small>缘生法</small><strong>${escapeCauseTraceHtml(entry.effectSummary)}</strong></div>
        </section>
        ${causeTraceEntryEntityRows(state, entry, 'cause')}
        ${causeTraceEntryEntityRows(state, entry, 'effect')}
        ${descriptions.length ? `
            <section class="cause-trace-inspector__section">
                <h3>缘力关键词</h3>
                ${descriptions.map(item => `<article><strong>${escapeCauseTraceHtml(item.keyword)}</strong><span>${escapeCauseTraceHtml(item.description)}</span></article>`).join('')}
            </section>
        ` : ''}
        ${notes.length ? `
            <section class="cause-trace-inspector__section">
                <h3>规则说明</h3>
                ${notes.map(note => `<p>${escapeCauseTraceHtml(note)}</p>`).join('')}
            </section>
        ` : ''}
    `;
}

function updateCauseTraceInspector(state) {
    const entry = focusedCauseTraceEntry(state);
    state.host.querySelector('#cause-trace-inspector').innerHTML = renderCauseTraceInspectorMarkup(state, entry);
    state.host.querySelectorAll('.cause-trace-entry').forEach(card => {
        card.classList.toggle('is-selected', card.dataset.entryId === state.selectedEntryId);
        card.classList.toggle('is-preview', card.dataset.entryId === state.previewEntryId);
    });
}

function filterCauseTraceTargetButtons(input, container) {
    const query = input.value.trim().toLocaleLowerCase();
    container.querySelectorAll('[data-search]').forEach(button => {
        button.hidden = Boolean(query) && !button.dataset.search.includes(query);
    });
}

function bindCauseTraceSelectorInteractions(state) {
    state.host.querySelectorAll('[data-action="flow-type"]').forEach(button => {
        button.addEventListener('click', () => {
            state.flowType = button.dataset.flow;
            state.stageId = currentCauseTraceFlow(state).stages[0].id;
            state.instanceId = null;
            state.objectId = null;
            state.conditionGroup = 'all';
            renderCauseConditionWorkspaceView(state);
        });
    });
    state.host.querySelectorAll('[data-action="sense-door"]').forEach(button => {
        button.addEventListener('click', () => {
            state.senseDoor = button.dataset.door;
            state.stageId = state.model.senseFlows[state.senseDoor].stages[0].id;
            state.instanceId = null;
            state.objectId = null;
            renderCauseConditionWorkspaceView(state);
        });
    });
    state.host.querySelectorAll('[data-action="trace-stage"]').forEach(button => {
        button.addEventListener('click', () => {
            state.stageId = button.dataset.stageId;
            state.instanceId = null;
            state.objectId = null;
            state.namaSearch = '';
            renderCauseConditionWorkspaceView(state);
        });
    });
    state.host.querySelectorAll('[data-action="nama-instance"]').forEach(button => {
        button.addEventListener('click', () => {
            state.instanceId = button.dataset.instanceId;
            state.conditionGroup = 'all';
            renderCauseConditionWorkspaceView(state);
        });
    });
    const objectSelect = state.host.querySelector('#cause-trace-object-select');
    if (objectSelect) {
        objectSelect.addEventListener('change', () => {
            state.objectId = objectSelect.value;
            state.conditionGroup = 'all';
            renderCauseConditionWorkspaceView(state);
        });
    }
    const namaSearch = state.host.querySelector('#cause-trace-nama-search');
    if (namaSearch) {
        const targets = state.host.querySelector('#cause-trace-nama-targets');
        namaSearch.addEventListener('input', () => {
            state.namaSearch = namaSearch.value;
            filterCauseTraceTargetButtons(namaSearch, targets);
        });
        filterCauseTraceTargetButtons(namaSearch, targets);
    }

    state.host.querySelectorAll('[data-action="rupa-target-type"]').forEach(button => {
        button.addEventListener('click', () => {
            state.rupaTargetType = button.dataset.targetType;
            state.rupaTargetGroup = 'all';
            state.rupaMatchMode = 'all';
            state.rupaTargetId = null;
            state.conditionGroup = 'all';
            renderCauseConditionWorkspaceView(state);
        });
    });
    const rupaGroup = state.host.querySelector('#cause-trace-rupa-group');
    if (rupaGroup) {
        rupaGroup.addEventListener('change', () => {
            state.rupaTargetGroup = rupaGroup.value;
            state.rupaTargetId = null;
            renderCauseConditionWorkspaceView(state);
        });
    }
    const rupaMatch = state.host.querySelector('#cause-trace-rupa-match');
    if (rupaMatch) {
        rupaMatch.addEventListener('change', () => {
            state.rupaMatchMode = rupaMatch.value;
            state.conditionGroup = 'all';
            renderCauseConditionWorkspaceView(state);
        });
    }
    state.host.querySelectorAll('[data-action="rupa-target"]').forEach(button => {
        button.addEventListener('click', () => {
            state.rupaTargetId = Number(button.dataset.targetId);
            state.conditionGroup = 'all';
            state.showTargetMembers = false;
            renderCauseConditionWorkspaceView(state);
        });
    });
    const rupaSearch = state.host.querySelector('#cause-trace-rupa-search');
    if (rupaSearch) {
        const targets = state.host.querySelector('#cause-trace-rupa-targets');
        rupaSearch.addEventListener('input', () => {
            state.rupaSearch = rupaSearch.value;
            filterCauseTraceTargetButtons(rupaSearch, targets);
        });
        filterCauseTraceTargetButtons(rupaSearch, targets);
    }
}

function bindCauseTraceResultInteractions(state) {
    const memberToggle = state.host.querySelector('[data-action="toggle-target-members"]');
    if (memberToggle) {
        memberToggle.addEventListener('click', () => {
            state.showTargetMembers = !state.showTargetMembers;
            renderCauseTraceResults(state);
        });
    }
    state.host.querySelectorAll('[data-action="condition-group"]').forEach(button => {
        button.addEventListener('click', () => {
            state.conditionGroup = button.dataset.group;
            const entries = visibleCauseTraceEntries(state);
            state.selectedEntryId = entries[0] ? entries[0].id : null;
            renderCauseTraceResults(state);
            updateCauseTraceInspector(state);
        });
    });
    state.host.querySelectorAll('.cause-trace-entry').forEach(card => {
        const preview = () => {
            state.previewEntryId = card.dataset.entryId;
            updateCauseTraceInspector(state);
        };
        const clear = () => {
            if (state.previewEntryId !== card.dataset.entryId) return;
            state.previewEntryId = null;
            updateCauseTraceInspector(state);
        };
        card.addEventListener('mouseenter', preview);
        card.addEventListener('mouseleave', clear);
        card.addEventListener('focus', preview);
        card.addEventListener('blur', clear);
        card.addEventListener('click', () => {
            state.selectedEntryId = card.dataset.entryId;
            state.previewEntryId = null;
            updateCauseTraceInspector(state);
        });
    });
}

function renderCauseConditionWorkspaceView(state) {
    computeCauseConditionTrace(state);
    renderCauseTraceSummary(state);
    renderCauseTraceModeControls(state);
    renderCauseTraceSelector(state);
    renderCauseTraceResults(state);
    updateCauseTraceInspector(state);
}

function renderCauseConditionWorkspace(host, model = buildCauseConditionTraceModel()) {
    const root = typeof host === 'string' ? document.querySelector(host) : host;
    if (!root) throw new Error('找不到五十二缘溯源工作台容器。');
    if (!model.validation.valid) {
        throw new Error(`五十二缘溯源数据校验失败：${model.validation.errors.join('；')}`);
    }
    causeConditionWorkspaceState = createCauseConditionWorkspaceState(model, root);
    root.dataset.ready = 'true';
    if (typeof root.addEventListener === 'function' && root.dataset.keyboardBound !== 'true') {
        root.dataset.keyboardBound = 'true';
        root.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            causeConditionWorkspaceState.previewEntryId = null;
            updateCauseTraceInspector(causeConditionWorkspaceState);
        });
    }
    renderCauseConditionWorkspaceView(causeConditionWorkspaceState);
    return causeConditionWorkspaceState;
}

window.causeConditionWorkspaceApi = {
    render: renderCauseConditionWorkspace,
    getState: () => causeConditionWorkspaceState,
};
