const CAUSE_TRACE_OBJECT_TYPES = {
    ordinary: {
        id: 'ordinary',
        name: '普通所缘',
        summary: '名、色、概念或涅槃',
        conditions: ['所缘缘'],
    },
    rupaPresent: {
        id: 'rupa-present',
        name: '所缘前生组',
        summary: '现在完成色',
        conditions: ['所缘缘', '所缘前生缘', '所缘前生有缘', '所缘前生不离去缘'],
    },
    heartBasisObject: {
        id: 'heart-basis-object',
        name: '依处所缘前生组',
        summary: '现在心所依处色',
        conditions: ['所缘缘', '依处所缘前生缘', '依处所缘前生依止缘', '依处所缘前生不相应缘', '依处所缘前生有缘', '依处所缘前生不离去缘'],
    },
    objectDominance: {
        id: 'object-dominance',
        name: '所缘增上组',
        summary: '极可喜或强力执取的普通所缘',
        conditions: ['所缘缘', '所缘增上缘', '所缘亲依止缘'],
    },
    rupaDominance: {
        id: 'rupa-dominance',
        name: '所缘前生增上组',
        summary: '极可喜或强力执取的现在完成色',
        conditions: ['所缘缘', '所缘增上缘', '所缘亲依止缘', '所缘前生缘', '所缘前生有缘', '所缘前生不离去缘'],
    },
    heartBasisDominance: {
        id: 'heart-basis-dominance',
        name: '依处所缘前生增上组',
        summary: '极可喜或强力执取的心所依处色',
        conditions: ['所缘缘', '依处所缘前生缘', '依处所缘前生依止缘', '依处所缘前生不相应缘', '依处所缘前生有缘', '依处所缘前生不离去缘', '所缘增上缘', '所缘亲依止缘'],
    },
};

const CAUSE_TRACE_SENSE_DOORS = [
    {id: 'eye', name: '眼门', consciousnessIds: [29, 36], basisId: 9005, objectSummary: '现在颜色所缘'},
    {id: 'ear', name: '耳门', consciousnessIds: [30, 37], basisId: 9006, objectSummary: '现在声音所缘'},
    {id: 'nose', name: '鼻门', consciousnessIds: [31, 38], basisId: 9007, objectSummary: '现在香所缘'},
    {id: 'tongue', name: '舌门', consciousnessIds: [32, 39], basisId: 9008, objectSummary: '现在味所缘'},
    {id: 'body', name: '身门', consciousnessIds: [33, 40], basisId: 9009, objectSummary: '现在触所缘（地、火、风）'},
];

function causeTraceUnique(values) {
    return Array.from(new Set((values || []).filter(value => value !== undefined && value !== null)));
}

function causeTraceEntityName(model, id) {
    return resolveConditionEntity(model.entityById, id).name;
}

function makeCauseTraceInstances(model, ids, prefix) {
    return causeTraceUnique(ids).map(id => ({
        id: `${prefix}-citta-${id}`,
        cittaId: id,
        name: causeTraceEntityName(model, id),
    }));
}

function buildSenseTraceFlow(model, doorId = 'eye') {
    const door = CAUSE_TRACE_SENSE_DOORS.find(item => item.id === doorId) || CAUSE_TRACE_SENSE_DOORS[0];
    const presentObject = {
        ...CAUSE_TRACE_OBJECT_TYPES.rupaPresent,
        summary: door.objectSummary,
        rupaSummary: door.objectSummary,
    };
    const objectOptions = [presentObject];
    const stages = [
        {id: 'five-door-adverting', name: '五门转向', functionName: '五门转向', previousFunction: '有分断', cittaIds: [52]},
        {id: 'sense-consciousness', name: `${door.name.substring(0, 1)}识`, functionName: '五识', previousFunction: '五门转向', cittaIds: door.consciousnessIds},
        {id: 'receiving', name: '领受', functionName: '领受', previousFunction: '五识', cittaIds: [34, 41]},
        {id: 'investigating', name: '推度', functionName: '推度', previousFunction: '领受', cittaIds: [35, 42, 43]},
        {id: 'determining', name: '确定', functionName: '确定', previousFunction: '推度', cittaIds: [53]},
        {id: 'first-javana', name: '第 1 速行', functionName: '速行', previousFunction: '确定', cittaIds: Builder.getVariable('欲界速行心')},
        {id: 'later-javana', name: '第 2–7 速行', functionName: '速行', previousFunction: '速行', cittaIds: Builder.getVariable('欲界速行心')},
        {id: 'first-registration', name: '第 1 彼所缘', functionName: '彼所缘', previousFunction: '速行', cittaIds: Builder.getVariable('彼所缘心')},
        {id: 'second-registration', name: '第 2 彼所缘', functionName: '彼所缘', previousFunction: '彼所缘', cittaIds: Builder.getVariable('彼所缘心')},
    ].map(stage => ({
        ...stage,
        basisIds: stage.functionName === '五识' ? [door.basisId] : [9016],
        basisSummary: stage.functionName === '五识' ? `前生${causeTraceEntityName(model, door.basisId)}` : '前生心所依处色',
        objectOptions,
        instances: makeCauseTraceInstances(model, stage.cittaIds, `sense-${door.id}-${stage.id}`),
    }));

    return {
        id: 'sense',
        name: '五门心路',
        door,
        stages,
    };
}

function mindTraceCategoryDefinitions() {
    return [
        {id: 'lobha', label: '贪根速行', variable: '贪根心', dominant: true},
        {id: 'dosa', label: '嗔根速行', variable: '嗔根心'},
        {id: 'moha', label: '痴根速行', variable: '痴根心'},
        {id: 'two-root-wholesome', label: '二因善速行', variable: '2因善心', dominant: true},
        {id: 'three-root-wholesome', label: '三因善速行', variable: '3因善心', dominant: true},
        {id: 'two-root-functional', label: '二因唯作速行', variable: '智不相应8大唯作心', dominant: true},
        {id: 'three-root-functional', label: '三因唯作速行', variable: '智相应8大唯作心', dominant: true},
        {id: 'smile', label: '生笑心', variable: '生笑心'},
    ];
}

function mindTraceObjectOptions(category) {
    const base = [
        CAUSE_TRACE_OBJECT_TYPES.ordinary,
        CAUSE_TRACE_OBJECT_TYPES.rupaPresent,
        CAUSE_TRACE_OBJECT_TYPES.heartBasisObject,
    ];
    if (!category || !category.dominant) return base;
    const dominant = [CAUSE_TRACE_OBJECT_TYPES.objectDominance];
    if (category.id === 'lobha') {
        dominant.push(CAUSE_TRACE_OBJECT_TYPES.rupaDominance, CAUSE_TRACE_OBJECT_TYPES.heartBasisDominance);
    }
    return base.concat(dominant);
}

function buildMindTraceFlow(model) {
    const stages = [{
        id: 'mind-door-adverting',
        name: '意门转向',
        functionName: '意门转向',
        previousFunction: '有分断',
        cittaIds: [53],
        objectOptions: [CAUSE_TRACE_OBJECT_TYPES.ordinary, CAUSE_TRACE_OBJECT_TYPES.rupaPresent, CAUSE_TRACE_OBJECT_TYPES.heartBasisObject],
    }];

    ['first', 'later'].forEach(phase => {
        mindTraceCategoryDefinitions().forEach(category => {
            stages.push({
                id: `${phase}-${category.id}`,
                name: `${phase === 'first' ? '第 1' : '第 2–7'}${category.label}`,
                functionName: '速行',
                previousFunction: phase === 'first' ? '意门转向' : '速行',
                cittaIds: Builder.getVariable(category.variable),
                objectOptions: mindTraceObjectOptions(category),
            });
        });
    });

    [
        {id: 'two-root-registration', name: '二因彼所缘', variable: '二因彼所缘心'},
        {id: 'three-root-registration', name: '三因彼所缘', variable: '三因彼所缘心'},
        {id: 'rootless-registration', name: '无因彼所缘', variable: '无因彼所缘心'},
    ].forEach(category => {
        stages.push({
            id: category.id,
            name: category.name,
            functionName: '彼所缘',
            previousFunction: '速行',
            cittaIds: Builder.getVariable(category.variable),
            objectOptions: [CAUSE_TRACE_OBJECT_TYPES.ordinary, CAUSE_TRACE_OBJECT_TYPES.rupaPresent, CAUSE_TRACE_OBJECT_TYPES.heartBasisObject],
        });
    });

    return {
        id: 'mind',
        name: '意门心路',
        stages: stages.map(stage => ({
            ...stage,
            basisIds: [9016],
            basisSummary: '前生心所依处色',
            instances: makeCauseTraceInstances(model, stage.cittaIds, `mind-${stage.id}`),
        })),
    };
}

function buildCauseConditionTraceModel(conditionModel = buildConditionsModel()) {
    Builder.initializeVariables();
    const model = {
        conditionModel,
        modes: [
            {id: 'nama', name: '名法溯源', description: '在具体五门或意门心路刹那中，查看支持当前名聚的缘力。'},
            {id: 'rupa', name: '色法溯源', description: '选择色法或色聚，反查可能支持它的缘法与缘力。'},
        ],
        senseDoors: CAUSE_TRACE_SENSE_DOORS,
        senseFlows: Object.fromEntries(CAUSE_TRACE_SENSE_DOORS.map(door => [door.id, buildSenseTraceFlow(conditionModel, door.id)])),
        mindFlow: buildMindTraceFlow(conditionModel),
        rupaTargets: conditionModel.entities.filter(entity => entity.domain === 'rupa' || entity.domain === 'rupa-aggregate'),
    };
    model.stats = {
        senseDoorCount: model.senseDoors.length,
        senseStageCount: model.senseFlows.eye.stages.length,
        mindStageCount: model.mindFlow.stages.length,
        rupaCount: model.rupaTargets.filter(entity => entity.domain === 'rupa').length,
        rupaAggregateCount: model.rupaTargets.filter(entity => entity.domain === 'rupa-aggregate').length,
    };
    model.validation = validateCauseConditionTraceModel(model);
    return model;
}

function causeTraceObjectIndex(option) {
    return Object.fromEntries((option.conditions || []).map(conditionName => [conditionName, {[option.id]: true}]));
}

function causeTraceSummary(value) {
    if (Array.isArray(value)) return value.join('、');
    if (value === undefined || value === null || value === '') return '-';
    return String(value);
}

function causeTraceNumericIds(value) {
    if (typeof value === 'number') return [value];
    if (!Array.isArray(value)) return [];
    return causeTraceUnique(value.filter(item => typeof item === 'number'));
}

function buildNamaCauseTrace(traceModel, selection) {
    const flow = selection.flowType === 'mind'
        ? traceModel.mindFlow
        : traceModel.senseFlows[selection.senseDoor || 'eye'];
    const stage = flow.stages.find(item => item.id === selection.stageId) || flow.stages[0];
    const instance = stage.instances.find(item => item.id === selection.instanceId) || stage.instances[0];
    const objectOption = stage.objectOptions.find(item => item.id === selection.objectId) || stage.objectOptions[0];
    if (!instance) {
        throw new Error(`心路阶段“${stage.name}”没有可供溯源的心。`);
    }
    const cetasikaIds = causeTraceUnique(subEffectIndex[instance.cittaId] || []);
    const rawTrace = causeConditionWithNamaEffect({
        id: `${flow.id}:${flow.door ? flow.door.id : 'mind'}:${stage.id}:${instance.cittaId}:${objectOption.id}`,
        name: instance.name,
        obj: objectOption.summary,
        rupa_obj: objectOption.rupaSummary || objectOption.summary,
        great_obj: objectOption.summary,
        funct: stage.functionName,
        prev_funct: stage.previousFunction,
        obj_condition_index: causeTraceObjectIndex(objectOption),
        citta: instance.cittaId,
        cetasikas: cetasikaIds,
        basisIds: stage.basisIds,
        basisSummary: stage.basisSummary,
    });
    const entries = [];
    Object.entries(rawTrace).forEach(([group, groupConditions]) => {
        Object.entries(groupConditions).forEach(([conditionName, item]) => {
            const causeSummary = causeTraceSummary(item.causeSummary);
            if (causeSummary === '-' || !causeSummary.trim()) return;
            const condition = traceModel.conditionModel.conditions.find(candidate => candidate.name === conditionName);
            const canonicalRules = traceModel.conditionModel.rules.filter(rule => rule.conditionName === conditionName && rule.group === group);
            entries.push({
                id: `nama-trace-${stage.id}-${instance.cittaId}-${condition ? condition.id : conditionName}-${entries.length + 1}`,
                source: 'nama',
                group,
                conditionId: condition ? condition.id : null,
                conditionName,
                keywords: condition ? condition.keywords : [],
                keywordDescriptions: condition
                    ? condition.keywords.map(keyword => ({keyword, description: traceModel.conditionModel.keywordDefinitions[keyword] || ''}))
                    : [],
                causeSummary,
                effectSummary: causeTraceSummary(item.effectSummary),
                causeIds: causeTraceNumericIds(item.cause),
                effectIds: causeTraceNumericIds(item.effect),
                notes: causeTraceUnique(canonicalRules.map(rule => rule.note)),
                objectRelated: (objectOption.conditions || []).includes(conditionName),
            });
        });
    });
    return {
        mode: 'nama',
        flow,
        stage,
        instance,
        objectOption,
        target: resolveConditionEntity(traceModel.conditionModel.entityById, instance.cittaId),
        cetasikas: cetasikaIds.map(id => resolveConditionEntity(traceModel.conditionModel.entityById, id)),
        entries,
        stats: {
            namaCount: cetasikaIds.length + 1,
            conditionCount: entries.length,
            groupCount: causeTraceUnique(entries.map(entry => entry.group)).length,
            objectConditionCount: entries.filter(entry => entry.objectRelated).length,
        },
    };
}

function buildRupaCauseTrace(traceModel, targetId, matchMode = 'all') {
    const id = Number(targetId);
    const target = resolveConditionEntity(traceModel.conditionModel.entityById, id);
    if (target.domain !== 'rupa' && target.domain !== 'rupa-aggregate') {
        throw new Error(`实体“${target.name}”不是色法或色聚。`);
    }
    const entries = traceModel.conditionModel.rules
        .map(rule => {
            const direct = rule.effectIds.includes(id);
            const throughAggregate = rule.impliedEffectIds.includes(id);
            if (!direct && !throughAggregate) return null;
            if (matchMode === 'direct' && !direct) return null;
            if (matchMode === 'aggregate' && !throughAggregate) return null;
            const matchLabel = matchMode === 'direct'
                ? '直接缘生法'
                : matchMode === 'aggregate'
                    ? '经由色聚包含'
                    : direct && throughAggregate
                        ? '直接缘生，也经由色聚'
                        : direct ? '直接缘生法' : '经由色聚包含';
            return {
                ...rule,
                id: `rupa-trace-${id}-${rule.id}`,
                source: 'rupa',
                direct,
                throughAggregate,
                matchMode: direct && throughAggregate ? 'both' : direct ? 'direct' : 'aggregate',
                matchLabel,
                notes: [rule.note],
            };
        })
        .filter(Boolean);
    const components = target.domain === 'rupa-aggregate'
        ? (traceModel.conditionModel.rupaAggregateComponents[id] || []).map(componentId => resolveConditionEntity(traceModel.conditionModel.entityById, componentId))
        : [];
    const containingAggregates = target.domain === 'rupa'
        ? traceModel.rupaTargets.filter(entity => entity.domain === 'rupa-aggregate' && (traceModel.conditionModel.rupaAggregateComponents[entity.id] || []).includes(id))
        : [];
    return {
        mode: 'rupa',
        target,
        entries,
        components,
        containingAggregates,
        stats: {
            conditionCount: entries.length,
            groupCount: causeTraceUnique(entries.map(entry => entry.group)).length,
            directCount: entries.filter(entry => entry.direct).length,
            aggregateCount: entries.filter(entry => entry.throughAggregate).length,
        },
    };
}

function validateCauseConditionTraceModel(model) {
    const errors = [];
    const flows = Object.values(model.senseFlows).concat(model.mindFlow);
    flows.forEach(flow => {
        if (!flow.stages.length) errors.push(`${flow.name}没有阶段。`);
        flow.stages.forEach(stage => {
            if (!stage.instances.length) errors.push(`${flow.name}的“${stage.name}”没有心实例。`);
            stage.instances.forEach(instance => {
                if (!model.conditionModel.entityById[instance.cittaId]) {
                    errors.push(`${flow.name}的“${stage.name}”引用了未知心 ${instance.cittaId}。`);
                }
            });
        });
    });
    if (model.rupaTargets.length !== 51) {
        errors.push(`色法溯源应有 51 个目标，当前为 ${model.rupaTargets.length} 个。`);
    }
    return {valid: errors.length === 0, errors};
}
