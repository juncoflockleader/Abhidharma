const DEPENDENT_ORIGIN_UI_TEXT = {
    cn: {
        title: '从过去因，到现在果，再造未来',
        intro: '十二支不是十二个孤立名词，而是十一段条件关系。沿四个阶段阅读，再切换三世与三轮视角。',
        factors: '支',
        relations: '段缘',
        phases: '个阶段',
        currentLens: '当前观察方式',
        chooseLens: '观察方式',
        chooseFilter: '聚焦范围',
        all: '全部',
        chainLens: '因果链',
        timeLens: '三世',
        wheelLens: '三轮',
        chainLensHint: '区分能造后果的因，与已经成熟的果。',
        timeLensHint: '观察过去、现在、未来如何接续。',
        wheelLensHint: '观察烦恼推动业，业成熟为果报，果报又成为烦恼的所依。',
        cause: '因',
        result: '果',
        past: '过去',
        present: '现在',
        future: '未来',
        defilement: '烦恼',
        kamma: '业',
        resultWheel: '果报',
        pastCause: '过去因',
        presentResult: '现在果',
        presentCause: '现在因',
        futureResult: '未来果',
        pastCauseHint: '过去的无明推动造业。',
        presentResultHint: '过去业在现在成熟为身心经验。',
        presentCauseHint: '对现在经验的反应，又成为新的因。',
        futureResultHint: '现在的业有引生未来的生与老死。',
        conditions: '缘',
        junction: '阶段转折',
        pastToPresent: '过去因结成现在果',
        resultToCause: '现在果成为现在因的所缘',
        presentToFuture: '现在因引生未来果',
        overview: '阅读指南',
        overviewHint: '悬停可预览一支或一段缘；点击或按 Enter/空格可锁定，按 Esc 返回总览。',
        keyJunctions: '三个关键转折',
        factorDetail: '缘起支详情',
        relationDetail: '条件关系详情',
        classification: '结构位置',
        mental: '名法内容',
        material: '色法内容',
        sourceNote: '说明',
        nextCondition: '如何缘生下一支',
        previous: '上一支',
        next: '下一支',
        start: '链条开端',
        end: '链条末端',
        from: '从',
        to: '到',
        unlock: '返回结构总览',
        cycleTitle: '三轮如何相续',
        cycleHint: '点击任一轮，聚焦它在十二支中的位置。',
        cycleDefilement: '无明、爱、取',
        cycleKamma: '诸行、业有',
        cycleResult: '识至受、生有、生、老死',
        splitBecoming: '“有”同时包含业有与生有，因此跨越业与果报。',
        mapAria: '十二缘起四阶段因果链',
        inspectorAria: '十二缘起详情',
    },
    en: {
        title: 'From past causes to present results—and onward',
        intro: 'The twelve links form eleven conditional relations. Read them in four phases, then switch to the three-life and three-round lenses.',
        factors: 'links',
        relations: 'relations',
        phases: 'phases',
        currentLens: 'Current lens',
        chooseLens: 'View by',
        chooseFilter: 'Focus',
        all: 'All',
        chainLens: 'Cause and result',
        timeLens: 'Three lives',
        wheelLens: 'Three rounds',
        chainLensHint: 'Distinguish causes that generate results from results that have matured.',
        timeLensHint: 'Follow the continuity of past, present, and future.',
        wheelLensHint: 'See defilement drive kamma, kamma mature as result, and result support renewed defilement.',
        cause: 'Cause',
        result: 'Result',
        past: 'Past',
        present: 'Present',
        future: 'Future',
        defilement: 'Defilement',
        kamma: 'Kamma',
        resultWheel: 'Result',
        pastCause: 'Past causes',
        presentResult: 'Present results',
        presentCause: 'Present causes',
        futureResult: 'Future results',
        pastCauseHint: 'Past ignorance drives the making of kamma.',
        presentResultHint: 'Past kamma matures as present mind-and-body experience.',
        presentCauseHint: 'Reactions to present experience become fresh causes.',
        futureResultHint: 'Present kammic becoming conditions future birth and aging-and-death.',
        conditions: 'Conditions',
        junction: 'Phase junction',
        pastToPresent: 'Past causes mature as present results',
        resultToCause: 'Present result becomes the basis for a present cause',
        presentToFuture: 'Present causes generate future results',
        overview: 'Reading guide',
        overviewHint: 'Hover to preview a link or relation; click or press Enter/Space to lock it. Press Esc to return.',
        keyJunctions: 'Three key junctions',
        factorDetail: 'Dependent-arising link',
        relationDetail: 'Conditional relation',
        classification: 'Structural position',
        mental: 'Mental phenomena',
        material: 'Material phenomena',
        sourceNote: 'Explanation',
        nextCondition: 'How it conditions the next link',
        previous: 'Previous',
        next: 'Next',
        start: 'Start of chain',
        end: 'End of chain',
        from: 'From',
        to: 'To',
        unlock: 'Back to structural overview',
        cycleTitle: 'How the three rounds continue',
        cycleHint: 'Choose a round to focus its position among the twelve links.',
        cycleDefilement: 'Ignorance, craving, clinging',
        cycleKamma: 'Formations and kammic becoming',
        cycleResult: 'Consciousness through feeling, birth-becoming, birth, aging-and-death',
        splitBecoming: 'Becoming contains both kammic becoming and birth-becoming, so it spans kamma and result.',
        mapAria: 'Dependent arising in four causal phases',
        inspectorAria: 'Dependent arising details',
    },
};

const DEPENDENT_ORIGIN_FACTOR_CONFIG = [
    {id: 1, enName: 'Ignorance', phase: 'past-cause', time: 'past', roles: ['cause'], wheels: ['defilement'], enSummary: 'Not knowing the Four Noble Truths and the conditional nature of phenomena.'},
    {id: 2, enName: 'Volitional formations', phase: 'past-cause', time: 'past', roles: ['cause'], wheels: ['kamma'], enSummary: 'Kammic volition associated with twenty-nine mundane wholesome and unwholesome cittas.'},
    {id: 3, enName: 'Consciousness', phase: 'present-result', time: 'present', roles: ['result'], wheels: ['result'], enSummary: 'Thirty-two mundane resultant cittas, including rebirth-linking and process consciousness.'},
    {id: 4, enName: 'Mind and matter', phase: 'present-result', time: 'present', roles: ['result'], wheels: ['result'], enSummary: 'Resultant consciousness and mental factors together with kamma-produced materiality.'},
    {id: 5, enName: 'Six sense bases', phase: 'present-result', time: 'present', roles: ['result'], wheels: ['result'], enSummary: 'The five sensitive material bases and the mind base.'},
    {id: 6, enName: 'Contact', phase: 'present-result', time: 'present', roles: ['result'], wheels: ['result'], enSummary: 'The meeting of consciousness, a base, and an object at one of six doors.'},
    {id: 7, enName: 'Feeling', phase: 'present-result', time: 'present', roles: ['result'], wheels: ['result'], enSummary: 'Feeling associated with the thirty-two mundane resultant cittas.'},
    {id: 8, enName: 'Craving', phase: 'present-cause', time: 'present', roles: ['cause'], wheels: ['defilement'], enSummary: 'Craving for sights, sounds, smells, tastes, touches, and mental objects.'},
    {id: 9, enName: 'Clinging', phase: 'present-cause', time: 'present', roles: ['cause'], wheels: ['defilement'], enSummary: 'Intensified craving as sensual, view, rite-and-ritual, or self-doctrine clinging.'},
    {id: 10, enName: 'Becoming', phase: 'present-cause', time: 'present', roles: ['cause'], wheels: ['kamma', 'result'], enSummary: 'Kammic becoming that produces rebirth, together with the resultant process of existence.'},
    {id: 11, enName: 'Birth', phase: 'future-result', time: 'future', roles: ['result'], wheels: ['result'], enSummary: 'The manifestation and acquisition of aggregates at rebirth in a future existence.'},
    {id: 12, enName: 'Aging and death', phase: 'future-result', time: 'future', roles: ['result'], wheels: ['result'], enSummary: 'The decline of faculties, dissolution of aggregates, and ending of the life faculty.'},
];

const DEPENDENT_ORIGIN_PHASE_CONFIG = [
    {id: 'past-cause', labelKey: 'pastCause', hintKey: 'pastCauseHint', factorIds: [1, 2]},
    {id: 'present-result', labelKey: 'presentResult', hintKey: 'presentResultHint', factorIds: [3, 4, 5, 6, 7]},
    {id: 'present-cause', labelKey: 'presentCause', hintKey: 'presentCauseHint', factorIds: [8, 9, 10]},
    {id: 'future-result', labelKey: 'futureResult', hintKey: 'futureResultHint', factorIds: [11, 12]},
];

const DEPENDENT_ORIGIN_LENS_CONFIG = {
    chain: {id: 'chain', labelKey: 'chainLens', hintKey: 'chainLensHint', filters: ['cause', 'result']},
    time: {id: 'time', labelKey: 'timeLens', hintKey: 'timeLensHint', filters: ['past', 'present', 'future']},
    wheel: {id: 'wheel', labelKey: 'wheelLens', hintKey: 'wheelLensHint', filters: ['defilement', 'kamma', 'result']},
};

const DEPENDENT_ORIGIN_JUNCTIONS = {
    2: 'pastToPresent',
    7: 'resultToCause',
    10: 'presentToFuture',
};

function dependentOriginLanguageKey() {
    return getLang().fixed ? 'cn' : 'en';
}

function dependentOriginText(key) {
    const language = dependentOriginLanguageKey();
    return (DEPENDENT_ORIGIN_UI_TEXT[language] && DEPENDENT_ORIGIN_UI_TEXT[language][key])
        || DEPENDENT_ORIGIN_UI_TEXT.cn[key]
        || key;
}

function dependentOriginGroupLabel(key, lensId) {
    return dependentOriginText(key === 'result' && lensId === 'wheel' ? 'resultWheel' : key);
}

function buildDependentOriginModel(data = dependentOriginData) {
    const configById = Object.fromEntries(DEPENDENT_ORIGIN_FACTOR_CONFIG.map((config) => [config.id, config]));
    const language = dependentOriginLanguageKey();
    const factors = data.factors.map((raw) => {
        const config = configById[raw.id];
        return {
            ...raw,
            ...config,
            displayName: language === 'cn' ? raw.name : config.enName,
            summary: language === 'cn' ? raw.note : config.enSummary,
        };
    });
    const factorById = Object.fromEntries(factors.map((factor) => [factor.id, factor]));
    const edges = factors.slice(0, -1).map((source) => {
        const targetId = source.conditioning && source.conditioning.id;
        return {
            id: `${source.id}-${targetId}`,
            sourceId: source.id,
            targetId,
            source: source,
            target: factorById[targetId],
            note: source.conditioning.note,
            junctionKey: DEPENDENT_ORIGIN_JUNCTIONS[source.id] || null,
        };
    });
    const edgeBySourceId = Object.fromEntries(edges.map((edge) => [edge.sourceId, edge]));
    const phases = DEPENDENT_ORIGIN_PHASE_CONFIG.map((phase) => ({
        ...phase,
        label: dependentOriginText(phase.labelKey),
        hint: dependentOriginText(phase.hintKey),
        factors: phase.factorIds.map((id) => factorById[id]),
        internalEdges: phase.factorIds.slice(0, -1).map((id) => edgeBySourceId[id]),
        junction: edgeBySourceId[phase.factorIds[phase.factorIds.length - 1]] || null,
    }));
    const lenses = Object.values(DEPENDENT_ORIGIN_LENS_CONFIG).map((lens) => ({
        ...lens,
        label: dependentOriginText(lens.labelKey),
        hint: dependentOriginText(lens.hintKey),
        filterOptions: [
            {id: 'all', label: dependentOriginText('all'), count: factors.length},
            ...lens.filters.map((filter) => ({
                id: filter,
                label: dependentOriginGroupLabel(filter, lens.id),
                count: factors.filter((factor) => dependentOriginFactorMatches(factor, lens.id, filter)).length,
            })),
        ],
    }));

    return {
        factors,
        factorById,
        edges,
        edgeById: Object.fromEntries(edges.map((edge) => [edge.id, edge])),
        phases,
        lenses,
        lensById: Object.fromEntries(lenses.map((lens) => [lens.id, lens])),
        wheelGroups: [
            {id: 'defilement', label: dependentOriginText('defilement'), description: dependentOriginText('cycleDefilement'), factorIds: [1, 8, 9]},
            {id: 'kamma', label: dependentOriginText('kamma'), description: dependentOriginText('cycleKamma'), factorIds: [2, 10]},
            {id: 'result', label: dependentOriginText('resultWheel'), description: dependentOriginText('cycleResult'), factorIds: [3, 4, 5, 6, 7, 10, 11, 12]},
        ],
        junctions: edges.filter((edge) => edge.junctionKey),
    };
}

function dependentOriginFactorMatches(factor, lensId, filterId) {
    if (!filterId || filterId === 'all') {
        return true;
    }
    if (lensId === 'time') {
        return factor.time === filterId;
    }
    if (lensId === 'wheel') {
        return factor.wheels.includes(filterId);
    }
    return factor.roles.includes(filterId);
}

function validateDependentOriginModel(model = buildDependentOriginModel()) {
    const issues = [];
    if (model.factors.length !== 12) {
        issues.push(`expected 12 factors, got ${model.factors.length}`);
    }
    if (model.edges.length !== 11) {
        issues.push(`expected 11 relations, got ${model.edges.length}`);
    }
    model.factors.forEach((factor, index) => {
        if (factor.id !== index + 1) {
            issues.push(`factor order mismatch at ${index + 1}`);
        }
        if (!factor.phase || !factor.time || !factor.roles.length || !factor.wheels.length) {
            issues.push(`factor ${factor.id} is missing semantic classification`);
        }
    });
    model.edges.forEach((edge, index) => {
        if (edge.sourceId !== index + 1 || edge.targetId !== index + 2) {
            issues.push(`relation ${edge.id} does not continue sequentially`);
        }
    });
    const phaseCounts = model.phases.map((phase) => phase.factors.length).join(',');
    if (phaseCounts !== '2,5,3,2') {
        issues.push(`expected phase counts 2,5,3,2; got ${phaseCounts}`);
    }
    if (model.junctions.map((edge) => edge.sourceId).join(',') !== '2,7,10') {
        issues.push('expected junctions after factors 2, 7, and 10');
    }
    return issues;
}

window.dependentOriginText = dependentOriginText;
window.buildDependentOriginModel = buildDependentOriginModel;
window.dependentOriginFactorMatches = dependentOriginFactorMatches;
window.validateDependentOriginModel = validateDependentOriginModel;
