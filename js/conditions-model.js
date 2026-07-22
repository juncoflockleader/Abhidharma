const CONDITION_DOMAIN_ORDER = ['citta', 'cetasika', 'rupa', 'rupa-aggregate', 'concept', 'nibbana', 'unknown'];

const CONDITION_DOMAIN_LABELS = {
    citta: '心',
    cetasika: '心所',
    rupa: '色法',
    'rupa-aggregate': '色聚',
    concept: '概念',
    nibbana: '涅槃',
    unknown: '未识别',
};

function uniqueConditionValues(values) {
    return Array.from(new Set((values || []).filter(value => value !== undefined && value !== null)));
}

function sortConditionIds(ids) {
    return uniqueConditionValues(ids).sort((a, b) => Number(a) - Number(b));
}

function buildConditionEntityRegistry() {
    const entityById = {};

    function register(entity) {
        if (!entity || entity.id === undefined || entity.id === null) {
            return;
        }
        entityById[entity.id] = {
            id: entity.id,
            name: entity.name || `未命名法 ${entity.id}`,
            domain: entity.domain || 'unknown',
            domainLabel: CONDITION_DOMAIN_LABELS[entity.domain] || CONDITION_DOMAIN_LABELS.unknown,
            group: entity.group || CONDITION_DOMAIN_LABELS[entity.domain] || CONDITION_DOMAIN_LABELS.unknown,
        };
    }

    (cittas.children || []).forEach(group => {
        (group.children || []).forEach(item => register({
            id: item.id,
            name: item.name,
            domain: 'citta',
            group: group.name,
        }));
    });

    (cetasika.children || []).forEach(majorGroup => {
        (majorGroup.children || []).forEach(group => {
            (group.children || []).forEach(item => register({
                id: item.id,
                name: item.name,
                domain: 'cetasika',
                group: group.name || majorGroup.name,
            }));
        });
    });

    function registerRupa(node, ancestors = []) {
        const nextAncestors = node.name ? ancestors.concat(node.name) : ancestors;
        if (node.id > 0) {
            register({
                id: node.id,
                name: node.alias || node.name,
                domain: 'rupa',
                group: ancestors[ancestors.length - 1] || rupa.name,
            });
        }
        (node.children || []).forEach(child => registerRupa(child, nextAncestors));
    }
    registerRupa(rupa);

    (rupaAgg.children || []).forEach(group => {
        (group.children || []).forEach(item => register({
            id: item.id,
            name: item.name,
            domain: 'rupa-aggregate',
            group: group.name,
        }));
    });

    register({id: -1, name: '概念', domain: 'concept', group: '概念'});
    register({id: 0, name: '涅槃', domain: 'nibbana', group: '涅槃'});

    return entityById;
}

function buildConditionRupaAggregateIndex(entityById) {
    const nameToId = Object.values(entityById)
        .filter(entity => entity.domain === 'rupa')
        .reduce((index, entity) => {
            index[entity.name] = entity.id;
            return index;
        }, {});

    function indexRupaSourceNames(node) {
        if (node.id > 0) {
            if (node.name) nameToId[node.name] = node.id;
            if (node.alias) nameToId[node.alias] = node.id;
        }
        (node.children || []).forEach(indexRupaSourceNames);
    }
    indexRupaSourceNames(rupa);

    const result = {};
    const baseNames = rupaAgg.rupa || [];

    function visit(node, inheritedNames) {
        const currentNames = uniqueConditionValues(inheritedNames.concat(node.rupa || []));
        if (node.id >= 9301 && node.id <= 9323) {
            result[node.id] = sortConditionIds(
                uniqueConditionValues(baseNames.concat(currentNames))
                    .map(name => nameToId[name])
                    .filter(id => id !== undefined)
            );
        }
        (node.children || []).forEach(child => visit(child, currentNames));
    }

    (rupaAgg.children || []).forEach(group => visit(group, []));
    return result;
}

function conditionRuleSignature(rule) {
    return JSON.stringify([
        rule.group,
        rule.causeType,
        rule.effectType,
        rule.causeIds,
        rule.effectIds,
        rule.suppressedIds,
        rule.timing,
    ]);
}

function buildConditionSearchText(rule, entityById) {
    const entityNames = uniqueConditionValues(rule.causeIds.concat(rule.effectIds, rule.impliedEffectIds))
        .map(id => entityById[id] && entityById[id].name)
        .filter(Boolean);
    return [
        rule.conditionName,
        rule.group,
        rule.causeType,
        rule.effectType,
        rule.causeSummary,
        rule.effectSummary,
        rule.note,
        rule.timingLabel,
        ...(rule.conditionKeywords || []),
        ...(rule.keywordDescriptions || []).map(item => item.description),
        ...entityNames,
    ].join(' ').toLocaleLowerCase();
}

function resolveConditionEntity(entityById, id) {
    return entityById[id] || {
        id,
        name: `未识别法 ${id}`,
        domain: 'unknown',
        domainLabel: CONDITION_DOMAIN_LABELS.unknown,
        group: CONDITION_DOMAIN_LABELS.unknown,
    };
}

function buildConditionsModel() {
    if (!Array.isArray(allCittas) || allCittas.length !== 89) {
        throw new Error('五十二缘模型需要先完成 89 心与心所索引的初始化。');
    }

    Builder.initializeVariables();
    const source = getConditions();
    const entityById = buildConditionEntityRegistry();
    const rupaAggregateComponents = buildConditionRupaAggregateIndex(entityById);
    const rules = [];

    (source.children || []).forEach(condition => {
        (condition.children || []).forEach((child, ruleIndex) => {
            const causeIds = sortConditionIds(child.expand());
            const effectIds = sortConditionIds(child.effects());
            const suppressedIds = sortConditionIds(child.suppressed || []);
            const impliedEffects = new Set();

            effectIds.forEach(effectId => {
                if (effectId > 0 && effectId < 100) {
                    (subEffectIndex[effectId] || []).forEach(id => impliedEffects.add(id));
                }
                if (effectId >= 9301 && effectId <= 9323) {
                    (rupaAggregateComponents[effectId] || []).forEach(id => impliedEffects.add(id));
                }
            });
            suppressedIds.forEach(id => impliedEffects.delete(id));
            effectIds.forEach(id => impliedEffects.delete(id));

            const rule = {
                id: `condition-${String(condition.id).padStart(2, '0')}-rule-${String(ruleIndex + 1).padStart(2, '0')}`,
                conditionId: condition.id,
                conditionName: condition.name,
                conditionKeywords: condition.keywords || [],
                keywordDescriptions: (condition.keywords || []).map(keyword => ({
                    keyword,
                    description: keywords[keyword] || '',
                })),
                ruleIndex,
                group: child.group,
                causeType: child.cause,
                effectType: child.effect,
                causeSummary: child.causeSummary,
                effectSummary: child.effectSummary,
                note: child.note,
                timing: child.rebirth ? 'rebirth' : 'life',
                timingLabel: child.rebirth ? '结生' : '生命中',
                causeIds,
                effectIds,
                impliedEffectIds: sortConditionIds(Array.from(impliedEffects)),
                suppressedIds,
            };
            rule.signature = conditionRuleSignature(rule);
            rule.searchText = buildConditionSearchText(rule, entityById);
            rules.push(rule);
        });
    });

    const familyBySignature = new Map();
    rules.forEach(rule => {
        if (!familyBySignature.has(rule.signature)) {
            familyBySignature.set(rule.signature, []);
        }
        familyBySignature.get(rule.signature).push(rule);
    });
    Array.from(familyBySignature.values()).forEach((familyRules, familyIndex) => {
        const familyId = `condition-family-${String(familyIndex + 1).padStart(3, '0')}`;
        const conditionNames = uniqueConditionValues(familyRules.map(rule => rule.conditionName));
        familyRules.forEach(rule => {
            rule.familyId = familyId;
            rule.familySize = familyRules.length;
            rule.parallelConditionNames = conditionNames.filter(name => name !== rule.conditionName);
        });
    });

    const conditions = (source.children || []).map(condition => ({
        id: condition.id,
        name: condition.name,
        keywords: condition.keywords || [],
        ruleIds: rules.filter(rule => rule.conditionId === condition.id).map(rule => rule.id),
    }));
    const groups = uniqueConditionValues(rules.map(rule => rule.group)).map((name, index) => ({
        id: `condition-group-${index + 1}`,
        name,
        ruleIds: rules.filter(rule => rule.group === name).map(rule => rule.id),
    }));
    const ruleById = Object.fromEntries(rules.map(rule => [rule.id, rule]));
    const conditionById = Object.fromEntries(conditions.map(condition => [condition.id, condition]));
    const model = {
        source,
        conditions,
        conditionById,
        groups,
        rules,
        ruleById,
        entityById,
        entities: Object.values(entityById).sort((a, b) => {
            const domainDiff = CONDITION_DOMAIN_ORDER.indexOf(a.domain) - CONDITION_DOMAIN_ORDER.indexOf(b.domain);
            return domainDiff || Number(a.id) - Number(b.id);
        }),
        rupaAggregateComponents,
        families: Array.from(familyBySignature.values()),
        keywordDefinitions: {...keywords},
        stats: {
            conditionCount: conditions.length,
            ruleCount: rules.length,
            groupCount: groups.length,
            familyCount: familyBySignature.size,
            entityCount: Object.keys(entityById).length,
        },
    };
    model.validation = validateConditionsModel(model);
    return model;
}

function validateConditionsModel(model) {
    const errors = [];
    const warnings = [];
    const ids = new Set();

    if (model.conditions.length !== 52) {
        errors.push(`应有 52 个缘，当前为 ${model.conditions.length} 个。`);
    }
    if (model.rules.length !== 130) {
        errors.push(`应有 130 条具体规则，当前为 ${model.rules.length} 条。`);
    }
    if (model.groups.length !== 10) {
        errors.push(`应有 10 个关系组，当前为 ${model.groups.length} 个。`);
    }

    model.rules.forEach(rule => {
        if (ids.has(rule.id)) {
            errors.push(`规则 ID 重复：${rule.id}`);
        }
        ids.add(rule.id);
        if (!rule.causeSummary || !rule.effectSummary || !rule.note) {
            errors.push(`规则 ${rule.id} 缺少摘要或注释。`);
        }
        if (!rule.causeIds.length || !rule.effectIds.length) {
            errors.push(`规则 ${rule.id} 的缘法或缘生法为空。`);
        }
        rule.causeIds.concat(rule.effectIds, rule.impliedEffectIds, rule.suppressedIds).forEach(id => {
            if (!model.entityById[id]) {
                errors.push(`规则 ${rule.id} 引用了未识别实体 ${id}。`);
            }
        });
        if (rule.familySize > 1 && !rule.parallelConditionNames.length) {
            warnings.push(`规则 ${rule.id} 与同名规则共享相同实体关系。`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

function filterConditionRules(model, filters = {}) {
    const query = String(filters.query || '').trim().toLocaleLowerCase();
    return model.rules.filter(rule => {
        if (filters.group && filters.group !== 'all' && rule.group !== filters.group) {
            return false;
        }
        if (filters.conditionId && filters.conditionId !== 'all' && rule.conditionId !== Number(filters.conditionId)) {
            return false;
        }
        if (filters.causeType && filters.causeType !== 'all' && rule.causeType !== filters.causeType) {
            return false;
        }
        if (filters.effectType && filters.effectType !== 'all' && rule.effectType !== filters.effectType) {
            return false;
        }
        if (filters.timing && filters.timing !== 'all' && rule.timing !== filters.timing) {
            return false;
        }
        return !query || rule.searchText.includes(query);
    });
}

function summarizeConditionEntities(model, ids) {
    const byDomain = new Map();
    sortConditionIds(ids).forEach(id => {
        const entity = resolveConditionEntity(model.entityById, id);
        if (!byDomain.has(entity.domain)) {
            byDomain.set(entity.domain, {
                key: entity.domain,
                label: entity.domainLabel,
                entities: [],
                subgroups: new Map(),
            });
        }
        const domain = byDomain.get(entity.domain);
        domain.entities.push(entity);
        if (!domain.subgroups.has(entity.group)) {
            domain.subgroups.set(entity.group, []);
        }
        domain.subgroups.get(entity.group).push(entity);
    });

    return Array.from(byDomain.values())
        .sort((a, b) => CONDITION_DOMAIN_ORDER.indexOf(a.key) - CONDITION_DOMAIN_ORDER.indexOf(b.key))
        .map(domain => ({
            key: domain.key,
            label: domain.label,
            count: domain.entities.length,
            entities: domain.entities,
            subgroups: Array.from(domain.subgroups.entries()).map(([label, entities]) => ({
                key: `${domain.key}:${label}`,
                label,
                count: entities.length,
                entities,
            })),
        }));
}

function conditionRuleContainsEntity(rule, entityId) {
    const id = Number(entityId);
    return rule.causeIds.includes(id)
        || rule.effectIds.includes(id)
        || rule.impliedEffectIds.includes(id)
        || rule.suppressedIds.includes(id);
}
