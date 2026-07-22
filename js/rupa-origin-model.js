const RUPA_ORIGIN_UI_TEXT = {
    cn: {
        title: '色法如何生起，又如何延续？',
        intro: '先选择一个直接起因，再沿着色聚中的火界与食素，观察后续世代如何展开。',
        fourOrigins: '种直接起因',
        clusters: '种色聚',
        inseparables: '不离色',
        chooseOrigin: '选择直接起因',
        selectedOrigin: '当前起因',
        rupaTypes: '种色法',
        sourceCause: '第 1 步 · 直接起因',
        directResult: '第 2 步 · 直接结果',
        propagation: '第 3 步 · 聚内继续生起',
        produces: '产生',
        contains: '每一色聚都包含',
        fireRoute: '火界路线',
        foodRoute: '食素路线',
        becomes: '继续产生',
        needsSupport: '获得食素支助后',
        generations: '后续世代',
        clusterCatalogue: '这一因所生的色聚',
        clusterHint: '悬停可预览组成；点击或按 Enter/空格可锁定详情，按 Esc 返回起因概览。',
        overview: '起因概览',
        why: '为什么归于这一因',
        producedRupa: '可产生的色法',
        commonRupa: '所有色聚共有',
        distinctiveRupa: '这一因可额外产生',
        clusterComposition: '色聚组成',
        routeDetail: '代际路线',
        routeFrom: '从何处开始',
        routeTo: '产生什么',
        routeCondition: '发生条件',
        unlock: '返回起因概览',
        noExtraRupa: '仅含八不离色',
        total: '合计',
        items: '项',
        kammaCause: '过去所造的善业或不善业',
        mindCause: '现在生起并能产生色法的心',
        temperatureCause: '色聚中的火界，即冷或热',
        nutrimentCause: '获得支助并发挥作用的食素',
        kammaWhy: '业直接产生净色、性根、心所依处与命根等，只能由业产生的色法也集中在这里。',
        mindWhy: '心能产生表达、声音与变化性等色法，使身体动作和语言表达成为可能。',
        temperatureWhy: '每一色聚都有火界；火界达到住时后，可继续产生时节生色聚。',
        nutrimentWhy: '食素获得外来营养支助后，可继续产生食生色聚并维持色身。',
        fireExplanation: '色聚内的火界成熟后，以温度为直接因，继续产生时节生色聚。',
        foodExplanation: '色聚内的食素须获得外来食素支助，随后以营养为直接因产生食生色聚。',
        originAria: '色法直接起因',
        mapAria: '色法起源与代际传播图',
        inspectorAria: '色法起源详情',
    },
    en: {
        title: 'How does rūpa arise and continue?',
        intro: 'Choose a direct cause, then follow fire and nutritive essence within a cluster into later generations.',
        fourOrigins: 'direct causes',
        clusters: 'cluster types',
        inseparables: 'inseparable rūpa',
        chooseOrigin: 'Choose a direct cause',
        selectedOrigin: 'Current cause',
        rupaTypes: 'types of rūpa',
        sourceCause: 'Step 1 · Direct cause',
        directResult: 'Step 2 · Direct result',
        propagation: 'Step 3 · Continuation within clusters',
        produces: 'Produces',
        contains: 'Every cluster contains',
        fireRoute: 'Fire route',
        foodRoute: 'Nutriment route',
        becomes: 'Continues as',
        needsSupport: 'After receiving nutritive support',
        generations: 'later generations',
        clusterCatalogue: 'Clusters produced by this cause',
        clusterHint: 'Hover to preview composition; click or press Enter/Space to lock details. Press Esc to return.',
        overview: 'Cause overview',
        why: 'Why this is the direct cause',
        producedRupa: 'Rūpa it can produce',
        commonRupa: 'Shared by every cluster',
        distinctiveRupa: 'Additional rūpa from this cause',
        clusterComposition: 'Cluster composition',
        routeDetail: 'Generational route',
        routeFrom: 'Starting point',
        routeTo: 'What it produces',
        routeCondition: 'Condition',
        unlock: 'Back to cause overview',
        noExtraRupa: 'Eight inseparables only',
        total: 'Total',
        items: 'items',
        kammaCause: 'Past wholesome or unwholesome kamma',
        mindCause: 'A present citta capable of producing rūpa',
        temperatureCause: 'The fire element in a cluster—heat or cold',
        nutrimentCause: 'Nutritive essence that has received support',
        kammaWhy: 'Kamma directly produces the sensitive bases, sex, heart-base, life faculty, and other rūpa unique to kamma.',
        mindWhy: 'Mind produces expression, sound, and changeability, enabling bodily and verbal activity.',
        temperatureWhy: 'Every cluster contains fire; once it reaches the static phase, it can produce temperature-born clusters.',
        nutrimentWhy: 'Nutritive essence, once supported by external nutrition, produces food-born clusters that sustain the body.',
        fireExplanation: 'When the fire element within a cluster matures, temperature becomes the direct cause of a new temperature-born cluster.',
        foodExplanation: 'Nutritive essence within a cluster first receives external support, then nutrition becomes the direct cause of a food-born cluster.',
        originAria: 'Direct causes of rūpa',
        mapAria: 'Rūpa origination and propagation map',
        inspectorAria: 'Rūpa origination details',
    },
};

const RUPA_ORIGIN_CONFIG = [
    {id: 'kamma', index: 0, causeKey: 'kammaCause', whyKey: 'kammaWhy', generationKey: 'string_id_723'},
    {id: 'mind', index: 1, causeKey: 'mindCause', whyKey: 'mindWhy', generationKey: 'string_id_724'},
    {id: 'temperature', index: 2, causeKey: 'temperatureCause', whyKey: 'temperatureWhy', generationKey: 'string_id_725'},
    {id: 'nutriment', index: 3, causeKey: 'nutrimentCause', whyKey: 'nutrimentWhy', generationKey: 'string_id_725'},
];

function rupaOriginLanguageKey() {
    return getLang().fixed ? 'cn' : 'en';
}

function rupaOriginText(key) {
    const language = rupaOriginLanguageKey();
    return (RUPA_ORIGIN_UI_TEXT[language] && RUPA_ORIGIN_UI_TEXT[language][key])
        || RUPA_ORIGIN_UI_TEXT.cn[key]
        || key;
}

function rupaOriginUnique(values) {
    return [...new Set((values || []).filter(Boolean))];
}

function buildRupaOriginModel() {
    const commonRupa = rupaOriginUnique(rupaAgg.rupa);
    const originNames = rupaCause.children.map((origin) => origin.name);
    const origins = RUPA_ORIGIN_CONFIG.map((config) => {
        const cause = rupaCause.children[config.index];
        const clusterGroup = rupaAgg.children[config.index];
        const distinctiveRupa = rupaOriginUnique(cause.rupa).filter((name) => !commonRupa.includes(name));
        const producedRupa = rupaOriginUnique([...commonRupa, ...cause.rupa]);
        const clusters = clusterGroup.children.map((cluster) => ({
            id: cluster.id,
            name: cluster.name,
            originId: config.id,
            additions: rupaOriginUnique([...clusterGroup.rupa, ...cluster.rupa]),
            composition: rupaOriginUnique([...commonRupa, ...clusterGroup.rupa, ...cluster.rupa]),
        }));
        const generationLabel = t(config.generationKey);

        return {
            ...config,
            name: cause.name,
            cause: rupaOriginText(config.causeKey),
            why: rupaOriginText(config.whyKey),
            commonRupa,
            distinctiveRupa,
            producedRupa,
            clusters,
            generationLabel,
            routes: [
                {
                    id: `${config.id}-fire`,
                    originId: config.id,
                    kind: 'route',
                    seed: 'fire',
                    name: rupaOriginText('fireRoute'),
                    seedName: t('string_id_511'),
                    targetId: 'temperature',
                    targetName: originNames[2],
                    generationLabel,
                    condition: rupaOriginText('fireExplanation'),
                },
                {
                    id: `${config.id}-food`,
                    originId: config.id,
                    kind: 'route',
                    seed: 'food',
                    name: rupaOriginText('foodRoute'),
                    seedName: t('string_id_581'),
                    targetId: 'nutriment',
                    targetName: originNames[3],
                    generationLabel,
                    condition: rupaOriginText('foodExplanation'),
                    requiresSupport: true,
                },
            ],
        };
    });

    return {
        commonRupa,
        origins,
        originById: Object.fromEntries(origins.map((origin) => [origin.id, origin])),
        totals: {
            origins: origins.length,
            clusters: origins.reduce((sum, origin) => sum + origin.clusters.length, 0),
            commonRupa: commonRupa.length,
        },
    };
}

function validateRupaOriginModel(model = buildRupaOriginModel()) {
    const expectedRupaCounts = [18, 15, 13, 12];
    const expectedClusterCounts = [9, 8, 4, 2];
    const issues = [];
    model.origins.forEach((origin, index) => {
        if (origin.producedRupa.length !== expectedRupaCounts[index]) {
            issues.push(`${origin.id}: expected ${expectedRupaCounts[index]} rūpa, got ${origin.producedRupa.length}`);
        }
        if (origin.clusters.length !== expectedClusterCounts[index]) {
            issues.push(`${origin.id}: expected ${expectedClusterCounts[index]} clusters, got ${origin.clusters.length}`);
        }
        origin.clusters.forEach((cluster) => {
            if (!model.commonRupa.every((name) => cluster.composition.includes(name))) {
                issues.push(`${origin.id}:${cluster.id} is missing an inseparable rūpa`);
            }
        });
    });
    if (model.totals.clusters !== 23 || model.totals.commonRupa !== 8) {
        issues.push(`totals: expected 23 clusters and 8 inseparables`);
    }
    return issues;
}

window.rupaOriginText = rupaOriginText;
window.buildRupaOriginModel = buildRupaOriginModel;
window.validateRupaOriginModel = validateRupaOriginModel;
