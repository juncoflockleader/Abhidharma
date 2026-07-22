function escapeConditionsHtml(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createConditionsWorkspaceState(model, host) {
    const layers = ['cause', 'effect', 'implied', 'suppressed'];
    return {
        model,
        host,
        filters: {
            query: '',
            group: 'all',
            conditionId: 'all',
            causeType: 'all',
            effectType: 'all',
            timing: 'all',
        },
        selectedRuleId: model.rules[0] ? model.rules[0].id : null,
        previewRuleId: null,
        hoverEntityId: null,
        lockedEntityId: null,
        expandedDomains: Object.fromEntries(layers.map(layer => [layer, new Set()])),
        expandedSubgroups: Object.fromEntries(layers.map(layer => [layer, new Set()])),
        filteredRules: model.rules.slice(),
    };
}

let conditionsWorkspaceState = null;

function getFocusedConditionRule(state) {
    return state.model.ruleById[state.previewRuleId]
        || state.model.ruleById[state.selectedRuleId]
        || state.filteredRules[0]
        || null;
}

function conditionFilterWithout(filters, keys) {
    const next = {...filters};
    keys.forEach(key => {
        next[key] = 'all';
    });
    return next;
}

function renderConditionsSummary(state) {
    const {stats} = state.model;
    const container = state.host.querySelector('#conditions-summary');
    container.innerHTML = `
        <div>
            <span class="conditions-eyebrow">PACCAYA RELATION LAB</span>
            <h2>五十二缘关系工作台</h2>
            <p>先选缘，再看关系。页面默认只展开集合与数量；需要时才逐层查看具体的心、心所、色法与色聚。</p>
        </div>
        <div class="conditions-summary__stats" aria-label="五十二缘数据规模">
            <span><strong>${stats.conditionCount}</strong>缘</span>
            <span><strong>${stats.ruleCount}</strong>具体规则</span>
            <span><strong>${stats.familyCount}</strong>关系族</span>
        </div>
    `;
}

function conditionsSelectOptions(values, selectedValue) {
    return values.map(item => `
        <option value="${escapeConditionsHtml(item.value)}"${String(item.value) === String(selectedValue) ? ' selected' : ''}>
            ${escapeConditionsHtml(item.label)}
        </option>
    `).join('');
}

function renderConditionsControls(state) {
    const container = state.host.querySelector('#conditions-controls');
    container.innerHTML = `
        <div class="conditions-controls__grid">
            <label class="conditions-search">
                <span>搜索缘、名色法或说明</span>
                <input id="conditions-search-input" type="search" value="${escapeConditionsHtml(state.filters.query)}" placeholder="例如：无间、慧、心所依处色" autocomplete="off">
            </label>
            <label>
                <span>缘法</span>
                <select id="conditions-cause-filter">
                    ${conditionsSelectOptions([
                        {value: 'all', label: '全部缘法'},
                        {value: '名', label: '名'},
                        {value: '色', label: '色'},
                        {value: '概念', label: '概念'},
                        {value: '涅槃', label: '涅槃'},
                    ], state.filters.causeType)}
                </select>
            </label>
            <label>
                <span>缘生法</span>
                <select id="conditions-effect-filter">
                    ${conditionsSelectOptions([
                        {value: 'all', label: '全部缘生法'},
                        {value: '名', label: '名'},
                        {value: '色', label: '色'},
                    ], state.filters.effectType)}
                </select>
            </label>
            <label>
                <span>发生时段</span>
                <select id="conditions-timing-filter">
                    ${conditionsSelectOptions([
                        {value: 'all', label: '全部时段'},
                        {value: 'life', label: '生命中'},
                        {value: 'rebirth', label: '结生'},
                    ], state.filters.timing)}
                </select>
            </label>
            <button class="conditions-reset" type="button" data-action="reset-filters">重置</button>
        </div>
        <div class="conditions-controls__status" id="conditions-filter-status" aria-live="polite"></div>
    `;
    bindConditionsControlInteractions(state);
}

function renderConditionsNavigator(state) {
    const container = state.host.querySelector('#conditions-navigator');
    const rulesWithoutGroupOrCondition = filterConditionRules(
        state.model,
        conditionFilterWithout(state.filters, ['group', 'conditionId'])
    );
    const rulesWithoutCondition = filterConditionRules(
        state.model,
        conditionFilterWithout(state.filters, ['conditionId'])
    );
    const groupCount = name => rulesWithoutGroupOrCondition.filter(rule => rule.group === name).length;
    const conditionRows = state.model.conditions
        .map(condition => ({
            ...condition,
            count: rulesWithoutCondition.filter(rule => rule.conditionId === condition.id).length,
        }))
        .filter(condition => condition.count > 0);

    container.innerHTML = `
        <div class="conditions-navigator__heading">
            <span>关系目录</span>
            <small>${state.model.groups.length} 组 · ${state.model.conditions.length} 缘</small>
        </div>
        <div class="conditions-group-list" role="list" aria-label="缘的关系组">
            <button type="button" data-action="select-group" data-group="all" class="conditions-group-button${state.filters.group === 'all' ? ' is-active' : ''}">
                <span>全部关系组</span><strong>${rulesWithoutGroupOrCondition.length}</strong>
            </button>
            ${state.model.groups.map(group => `
                <button type="button" data-action="select-group" data-group="${escapeConditionsHtml(group.name)}" class="conditions-group-button${state.filters.group === group.name ? ' is-active' : ''}"${groupCount(group.name) ? '' : ' disabled'}>
                    <span>${escapeConditionsHtml(group.name)}</span><strong>${groupCount(group.name)}</strong>
                </button>
            `).join('')}
        </div>
        <div class="conditions-navigator__subheading">
            <span>具体缘</span>
            <button type="button" data-action="select-condition" data-condition-id="all" class="${state.filters.conditionId === 'all' ? 'is-active' : ''}">全部</button>
        </div>
        <div class="conditions-condition-list" role="list" aria-label="五十二缘">
            ${conditionRows.length ? conditionRows.map(condition => `
                <button type="button" data-action="select-condition" data-condition-id="${condition.id}" class="conditions-condition-button${Number(state.filters.conditionId) === condition.id ? ' is-active' : ''}">
                    <span class="conditions-condition-button__id">${condition.id}</span>
                    <span>${escapeConditionsHtml(condition.name)}</span>
                    <strong>${condition.count}</strong>
                </button>
            `).join('') : '<p class="conditions-empty conditions-empty--compact">当前筛选下没有可显示的缘。</p>'}
        </div>
    `;
    bindConditionsNavigatorInteractions(state);
}

function renderConditionsResults(state) {
    const container = state.host.querySelector('#conditions-results');
    container.innerHTML = `
        <div class="conditions-section-heading">
            <div>
                <span class="conditions-eyebrow">RULE INDEX</span>
                <h3>具体规则</h3>
            </div>
            <small>悬停预览，点击锁定</small>
        </div>
        <div class="conditions-rule-list">
            ${state.filteredRules.length ? state.filteredRules.map(rule => `
                <button type="button" class="conditions-rule-card${state.selectedRuleId === rule.id ? ' is-selected' : ''}" data-rule-id="${rule.id}">
                    <span class="conditions-rule-card__meta">
                        <span>${escapeConditionsHtml(rule.group)}</span>
                        <span>${rule.timingLabel}</span>
                    </span>
                    <strong>${rule.conditionId}. ${escapeConditionsHtml(rule.conditionName)}</strong>
                    <span class="conditions-rule-card__relation">
                        <span>${escapeConditionsHtml(rule.causeSummary)}</span>
                        <b aria-hidden="true">→</b>
                        <span>${escapeConditionsHtml(rule.effectSummary)}</span>
                    </span>
                    <span class="conditions-rule-card__counts">
                        ${rule.causeType} ${rule.causeIds.length} · ${rule.effectType} ${rule.effectIds.length}
                        ${rule.impliedEffectIds.length ? ` · 展开 +${rule.impliedEffectIds.length}` : ''}
                    </span>
                </button>
            `).join('') : `
                <div class="conditions-empty">
                    <strong>没有符合条件的规则</strong>
                    <span>可以清除具体缘或减少筛选条件后再试。</span>
                </div>
            `}
        </div>
    `;
    bindConditionsResultInteractions(state);
}

function conditionLayerTitle(layer) {
    return {
        cause: '缘法',
        effect: '直接缘生法',
        implied: '随名聚／色聚展开',
        suppressed: '排除项',
    }[layer] || layer;
}

function renderConditionEntityCollection(state, rule, layer, ids) {
    const domains = summarizeConditionEntities(state.model, ids);
    const expandedDomains = state.expandedDomains[layer];
    const expandedSubgroups = state.expandedSubgroups[layer];
    const toneClass = layer === 'cause'
        ? 'conditions-entities--cause'
        : layer === 'suppressed'
            ? 'conditions-entities--suppressed'
            : 'conditions-entities--effect';

    return `
        <section class="conditions-entities ${toneClass}" data-layer="${layer}">
            <header>
                <span>${conditionLayerTitle(layer)}</span>
                <strong>${ids.length}</strong>
            </header>
            <div class="conditions-domain-list">
                ${domains.map(domain => {
                    const domainOpen = expandedDomains.has(domain.key);
                    return `
                        <article class="conditions-domain${domainOpen ? ' is-open' : ''}">
                            <button type="button" class="conditions-domain__toggle" data-action="toggle-domain" data-layer="${layer}" data-domain="${escapeConditionsHtml(domain.key)}" aria-expanded="${domainOpen}">
                                <span><b>${escapeConditionsHtml(domain.label)}</b><small>${escapeConditionsHtml(domain.entities.slice(0, 3).map(entity => entity.name).join('、'))}${domain.count > 3 ? '…' : ''}</small></span>
                                <strong>${domain.count}</strong>
                            </button>
                            ${domainOpen ? `
                                <div class="conditions-subgroup-list">
                                    ${domain.subgroups.map(subgroup => {
                                        const subgroupOpen = expandedSubgroups.has(subgroup.key);
                                        return `
                                            <div class="conditions-subgroup${subgroupOpen ? ' is-open' : ''}">
                                                <button type="button" data-action="toggle-subgroup" data-layer="${layer}" data-subgroup="${escapeConditionsHtml(subgroup.key)}" aria-expanded="${subgroupOpen}">
                                                    <span>${escapeConditionsHtml(subgroup.label)}</span><strong>${subgroup.count}</strong>
                                                </button>
                                                ${subgroupOpen ? `
                                                    <div class="conditions-entity-chips">
                                                        ${subgroup.entities.map(entity => `
                                                            <button type="button" class="conditions-entity-chip${state.lockedEntityId === entity.id ? ' is-locked' : ''}" data-entity-id="${entity.id}" data-entity-layer="${layer}" title="${escapeConditionsHtml(entity.group)}">
                                                                ${escapeConditionsHtml(entity.name)}
                                                            </button>
                                                        `).join('')}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </article>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

function renderConditionRelation(state, rule) {
    if (!rule) {
        return `
            <div class="conditions-empty conditions-empty--relation">
                <strong>请选择一条规则</strong>
                <span>关系图会在这里显示。</span>
            </div>
        `;
    }
    return `
        <div class="conditions-relation__heading">
            <div>
                <span class="conditions-eyebrow">FOCUSED RELATION</span>
                <h3>${rule.conditionId}. ${escapeConditionsHtml(rule.conditionName)}</h3>
            </div>
            <div class="conditions-relation__badges">
                <span>${escapeConditionsHtml(rule.group)}</span>
                <span>${rule.timingLabel}</span>
                <span>${rule.causeType} → ${rule.effectType}</span>
            </div>
        </div>
        <div class="conditions-relation-flow">
            ${renderConditionEntityCollection(state, rule, 'cause', rule.causeIds)}
            <div class="conditions-flow-arrow" aria-hidden="true"><span></span><b>→</b></div>
            <article class="conditions-force-node">
                <span>缘力</span>
                <strong>${escapeConditionsHtml(rule.conditionName)}</strong>
                <small>${escapeConditionsHtml(rule.conditionKeywords.join(' · ') || '缘')}</small>
            </article>
            <div class="conditions-flow-arrow" aria-hidden="true"><span></span><b>→</b></div>
            ${renderConditionEntityCollection(state, rule, 'effect', rule.effectIds)}
        </div>
        ${(rule.impliedEffectIds.length || rule.suppressedIds.length) ? `
            <div class="conditions-relation-details">
                ${rule.impliedEffectIds.length ? renderConditionEntityCollection(state, rule, 'implied', rule.impliedEffectIds) : ''}
                ${rule.suppressedIds.length ? renderConditionEntityCollection(state, rule, 'suppressed', rule.suppressedIds) : ''}
            </div>
        ` : ''}
    `;
}

function conditionEntityRoleLabels(rule, entityId) {
    const labels = [];
    if (rule.causeIds.includes(entityId)) labels.push('直接缘法');
    if (rule.effectIds.includes(entityId)) labels.push('直接缘生法');
    if (rule.impliedEffectIds.includes(entityId)) labels.push('随名聚／色聚展开');
    if (rule.suppressedIds.includes(entityId)) labels.push('排除项');
    return labels;
}

function renderConditionsInspectorEntity(state, rule) {
    const entityId = state.lockedEntityId !== null ? state.lockedEntityId : state.hoverEntityId;
    if (entityId === null || !rule) {
        return '<span class="conditions-inspector__entity-placeholder">展开集合后，悬停具体法可查看它在当前规则中的位置。</span>';
    }
    const entity = resolveConditionEntity(state.model.entityById, entityId);
    const roles = conditionEntityRoleLabels(rule, entityId);
    return `
        <span class="conditions-eyebrow">ENTITY</span>
        <strong>${escapeConditionsHtml(entity.name)}</strong>
        <small>${escapeConditionsHtml(entity.domainLabel)} · ${escapeConditionsHtml(entity.group)}</small>
        <p>${roles.length ? escapeConditionsHtml(roles.join('、')) : '不属于当前规则'}</p>
        ${state.lockedEntityId === entityId ? '<button type="button" data-action="unlock-entity">取消实体锁定</button>' : ''}
    `;
}

function renderConditionsInspector(state, rule) {
    if (!rule) {
        return '<div class="conditions-empty"><strong>尚无规则</strong><span>调整筛选条件后再试。</span></div>';
    }
    const parallel = rule.parallelConditionNames.length
        ? rule.parallelConditionNames.map(name => `<span>${escapeConditionsHtml(name)}</span>`).join('')
        : '<small>当前实体关系没有其他缘力共用。</small>';
    return `
        <span class="conditions-eyebrow">RULE INSPECTOR</span>
        <h2>${rule.conditionId}. ${escapeConditionsHtml(rule.conditionName)}</h2>
        <p class="conditions-inspector__lead">${escapeConditionsHtml(rule.causeSummary)} <b>→</b> ${escapeConditionsHtml(rule.effectSummary)}</p>
        <dl class="conditions-inspector__facts">
            <div><dt>关系组</dt><dd>${escapeConditionsHtml(rule.group)}</dd></div>
            <div><dt>时段</dt><dd>${rule.timingLabel}</dd></div>
            <div><dt>缘法</dt><dd>${rule.causeIds.length} 个直接实体</dd></div>
            <div><dt>缘生法</dt><dd>${rule.effectIds.length} 个直接实体${rule.impliedEffectIds.length ? `，展开 +${rule.impliedEffectIds.length}` : ''}</dd></div>
        </dl>
        <section class="conditions-inspector__section">
            <h3>这条规则说明什么</h3>
            <p>${escapeConditionsHtml(rule.note)}</p>
        </section>
        <section class="conditions-inspector__section">
            <h3>缘力关键词</h3>
            <div class="conditions-keyword-list">
                ${rule.keywordDescriptions.map(item => `
                    <article><strong>${escapeConditionsHtml(item.keyword)}</strong><span>${escapeConditionsHtml(item.description)}</span></article>
                `).join('')}
            </div>
        </section>
        <section class="conditions-inspector__section">
            <h3>共享同一实体关系的缘</h3>
            <div class="conditions-parallel-list">${parallel}</div>
        </section>
        ${rule.suppressedIds.length ? `
            <section class="conditions-inspector__section conditions-inspector__warning">
                <h3>排除项</h3>
                <p>展开名聚或色聚时，需要排除 ${rule.suppressedIds.length} 个实体；关系图已单独列出。</p>
            </section>
        ` : ''}
        <section class="conditions-inspector__entity" id="conditions-inspector-entity">
            ${renderConditionsInspectorEntity(state, rule)}
        </section>
    `;
}

function updateConditionsFilterStatus(state) {
    const status = state.host.querySelector('#conditions-filter-status');
    if (!status) return;
    const conditionLabel = state.filters.conditionId === 'all'
        ? '全部缘'
        : (state.model.conditionById[state.filters.conditionId] || {}).name;
    status.textContent = `当前显示 ${state.filteredRules.length} / ${state.model.rules.length} 条规则 · ${conditionLabel || '全部缘'}`;
}

function updateConditionsFocus(state) {
    const rule = getFocusedConditionRule(state);
    const relation = state.host.querySelector('#conditions-relation');
    const inspector = state.host.querySelector('#conditions-inspector');
    relation.innerHTML = renderConditionRelation(state, rule);
    inspector.innerHTML = renderConditionsInspector(state, rule);

    state.host.querySelectorAll('.conditions-rule-card').forEach(card => {
        card.classList.toggle('is-selected', card.dataset.ruleId === state.selectedRuleId);
        card.classList.toggle('is-preview', card.dataset.ruleId === state.previewRuleId);
    });
    bindConditionsRelationInteractions(state);
    updateConditionsEntityHighlight(state);
}

function updateConditionsEntityHighlight(state) {
    const entityId = state.lockedEntityId !== null ? state.lockedEntityId : state.hoverEntityId;
    state.host.querySelectorAll('[data-entity-id]').forEach(chip => {
        chip.classList.toggle('is-related', entityId !== null && Number(chip.dataset.entityId) === entityId);
        chip.classList.toggle('is-locked', state.lockedEntityId !== null && Number(chip.dataset.entityId) === state.lockedEntityId);
    });
    state.host.querySelectorAll('.conditions-rule-card').forEach(card => {
        const rule = state.model.ruleById[card.dataset.ruleId];
        card.classList.toggle('has-entity', entityId !== null && conditionRuleContainsEntity(rule, entityId));
    });
    const entityPanel = state.host.querySelector('#conditions-inspector-entity');
    if (entityPanel) {
        entityPanel.innerHTML = renderConditionsInspectorEntity(state, getFocusedConditionRule(state));
        const unlock = entityPanel.querySelector('[data-action="unlock-entity"]');
        if (unlock) {
            unlock.addEventListener('click', () => {
                state.lockedEntityId = null;
                state.hoverEntityId = null;
                updateConditionsEntityHighlight(state);
            });
        }
    }
}

function bindConditionsControlInteractions(state) {
    const search = state.host.querySelector('#conditions-search-input');
    const cause = state.host.querySelector('#conditions-cause-filter');
    const effect = state.host.querySelector('#conditions-effect-filter');
    const timing = state.host.querySelector('#conditions-timing-filter');
    search.addEventListener('input', () => {
        state.filters.query = search.value;
        renderConditionsWorkspaceView(state, {renderControls: false});
    });
    cause.addEventListener('change', () => {
        state.filters.causeType = cause.value;
        renderConditionsWorkspaceView(state, {renderControls: false});
    });
    effect.addEventListener('change', () => {
        state.filters.effectType = effect.value;
        renderConditionsWorkspaceView(state, {renderControls: false});
    });
    timing.addEventListener('change', () => {
        state.filters.timing = timing.value;
        renderConditionsWorkspaceView(state, {renderControls: false});
    });
    state.host.querySelector('[data-action="reset-filters"]').addEventListener('click', () => {
        state.filters = {
            query: '', group: 'all', conditionId: 'all', causeType: 'all', effectType: 'all', timing: 'all',
        };
        state.previewRuleId = null;
        state.hoverEntityId = null;
        state.lockedEntityId = null;
        Object.values(state.expandedDomains).forEach(set => set.clear());
        Object.values(state.expandedSubgroups).forEach(set => set.clear());
        renderConditionsWorkspaceView(state);
    });
}

function bindConditionsNavigatorInteractions(state) {
    state.host.querySelectorAll('[data-action="select-group"]').forEach(button => {
        button.addEventListener('click', () => {
            state.filters.group = button.dataset.group;
            state.filters.conditionId = 'all';
            state.previewRuleId = null;
            renderConditionsWorkspaceView(state, {renderControls: false});
        });
    });
    state.host.querySelectorAll('[data-action="select-condition"]').forEach(button => {
        button.addEventListener('click', () => {
            state.filters.conditionId = button.dataset.conditionId === 'all' ? 'all' : Number(button.dataset.conditionId);
            state.previewRuleId = null;
            renderConditionsWorkspaceView(state, {renderControls: false});
        });
    });
}

function bindConditionsResultInteractions(state) {
    state.host.querySelectorAll('.conditions-rule-card').forEach(card => {
        const preview = () => {
            state.previewRuleId = card.dataset.ruleId;
            updateConditionsFocus(state);
        };
        const clearPreview = () => {
            if (state.previewRuleId === card.dataset.ruleId) {
                state.previewRuleId = null;
                updateConditionsFocus(state);
            }
        };
        card.addEventListener('mouseenter', preview);
        card.addEventListener('mouseleave', clearPreview);
        card.addEventListener('focus', preview);
        card.addEventListener('blur', clearPreview);
        card.addEventListener('click', () => {
            state.selectedRuleId = card.dataset.ruleId;
            state.previewRuleId = null;
            state.hoverEntityId = null;
            state.lockedEntityId = null;
            updateConditionsFocus(state);
        });
    });
}

function bindConditionsRelationInteractions(state) {
    state.host.querySelectorAll('[data-action="toggle-domain"]').forEach(button => {
        button.addEventListener('click', () => {
            const set = state.expandedDomains[button.dataset.layer];
            if (set.has(button.dataset.domain)) set.delete(button.dataset.domain);
            else set.add(button.dataset.domain);
            updateConditionsFocus(state);
        });
    });
    state.host.querySelectorAll('[data-action="toggle-subgroup"]').forEach(button => {
        button.addEventListener('click', () => {
            const set = state.expandedSubgroups[button.dataset.layer];
            if (set.has(button.dataset.subgroup)) set.delete(button.dataset.subgroup);
            else set.add(button.dataset.subgroup);
            updateConditionsFocus(state);
        });
    });
    state.host.querySelectorAll('.conditions-entity-chip').forEach(chip => {
        const entityId = Number(chip.dataset.entityId);
        chip.addEventListener('mouseenter', () => {
            state.hoverEntityId = entityId;
            updateConditionsEntityHighlight(state);
        });
        chip.addEventListener('mouseleave', () => {
            if (state.hoverEntityId === entityId) state.hoverEntityId = null;
            updateConditionsEntityHighlight(state);
        });
        chip.addEventListener('focus', () => {
            state.hoverEntityId = entityId;
            updateConditionsEntityHighlight(state);
        });
        chip.addEventListener('blur', () => {
            if (state.hoverEntityId === entityId) state.hoverEntityId = null;
            updateConditionsEntityHighlight(state);
        });
        chip.addEventListener('click', () => {
            state.lockedEntityId = state.lockedEntityId === entityId ? null : entityId;
            state.hoverEntityId = null;
            updateConditionsEntityHighlight(state);
        });
    });
}

function renderConditionsWorkspaceView(state, options = {}) {
    const {renderControls = true} = options;
    state.filteredRules = filterConditionRules(state.model, state.filters);
    if (!state.filteredRules.some(rule => rule.id === state.selectedRuleId)) {
        state.selectedRuleId = state.filteredRules[0] ? state.filteredRules[0].id : null;
        state.previewRuleId = null;
        state.hoverEntityId = null;
        state.lockedEntityId = null;
    }
    renderConditionsSummary(state);
    if (renderControls) renderConditionsControls(state);
    renderConditionsNavigator(state);
    renderConditionsResults(state);
    updateConditionsFilterStatus(state);
    updateConditionsFocus(state);
}

function renderConditionsWorkspace(host, model = buildConditionsModel()) {
    const root = typeof host === 'string' ? document.querySelector(host) : host;
    if (!root) {
        throw new Error('找不到五十二缘关系工作台容器。');
    }
    if (!model.validation.valid) {
        throw new Error(`五十二缘数据校验失败：${model.validation.errors.join('；')}`);
    }
    conditionsWorkspaceState = createConditionsWorkspaceState(model, root);
    root.dataset.ready = 'true';
    if (typeof root.addEventListener === 'function' && root.dataset.keyboardBound !== 'true') {
        root.dataset.keyboardBound = 'true';
        root.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            conditionsWorkspaceState.previewRuleId = null;
            conditionsWorkspaceState.hoverEntityId = null;
            conditionsWorkspaceState.lockedEntityId = null;
            updateConditionsFocus(conditionsWorkspaceState);
        });
    }
    renderConditionsWorkspaceView(conditionsWorkspaceState);
    return conditionsWorkspaceState;
}

window.conditionsWorkspaceApi = {
    render: renderConditionsWorkspace,
    getState: () => conditionsWorkspaceState,
};
