const studyState = {
    activePage: 'citta',
    citta: {
        selectedId: null,
        searchTerm: '',
        activeFilter: null,
        searchIndex: [],
        compareIds: [],
    },
    rupa: {
        selectedId: null,
        searchTerm: '',
        activeFilter: null,
        searchIndex: [],
        cache: null,
    },
};

const STUDY_GUIDE_TEXT = {
    cn: {
        searchCitta: '搜索心、心所、受、因、门、所缘、依处、作用',
        searchRupa: '搜索色法或色聚',
        clear: '清除',
        common: '常用入口',
        noSelection: '悬停可临时查看关系；点击会锁定高亮。再次点击、按 Esc 或取消锁定即可还原。',
        noResults: '没有匹配结果',
        why: '导览路径',
        connected: '相关项目',
        notes: '四项注释',
        counts: '数量',
        required: '相应',
        optional: '可选',
        selectedFilter: '当前筛选',
        matched: '匹配',
        items: '项',
        citta: '心',
        cetasika: '心所',
        dimension: '属性',
        rupa: '色法',
        rupaAgg: '色聚',
        category: '分类维度',
        clusters: '所属色聚',
        composition: '包含色法',
        special: '特殊归类',
        path: '路径',
        colorLegend: '颜色图例',
        selected: '已锁定',
        rootTime: '因 / 所缘之时',
        functionRelation: '作用',
        gateRelation: '门',
        objectRelation: '五所缘',
        mentalBasisRelation: '法所缘 / 依处',
        realmRelation: '界',
        feelingRelation: '受',
        locate: '定位选中项',
        clearSelection: '取消锁定',
        addCompare: '加入比较',
        compare: '比较模式',
        compareHint: '先选中一个心并加入比较，再选第二个。',
        commonRelations: '共有关系',
        onlyLeft: '仅左侧',
        onlyRight: '仅右侧',
        remove: '移除',
        browseMobile: '快速浏览心与心所',
        chooseItem: '选择一项查看详情',
        more: '展开',
        positive: '肯定/相应',
        negative: '否定/不相应',
        neutral: '皆可/中性',
        inseparable: '八不离色',
        change: '变化色',
        cittaWhy: '从选中项目出发，反查它在心、心所和属性维度中的连接。',
        rupaWhy: '从选中项目出发，反查它在属性表、注释表和色聚组合中的位置。',
        filterWisdom: '含慧心所的心',
        filterHatred: '含嗔心所的心',
        filterRooted: '有因心',
        filterJavana: '速行心',
        filterEye: '眼净色相关',
        filterChangeCluster: '含变化色的色聚',
        filterFourOrigins: '四因皆可生',
        filterEightBasics: '八不离色',
        filterSoundCluster: '含声的色聚',
    },
    en: {
        searchCitta: 'Search consciousness, factors, feeling, roots, doors, objects, bases, functions',
        searchRupa: 'Search rupa or clusters',
        clear: 'Clear',
        common: 'Common paths',
        noSelection: 'Hover for a temporary trace; click to lock it. Click again, press Esc, or unlock to reset.',
        noResults: 'No results',
        why: 'Guide path',
        connected: 'Related items',
        notes: 'Fourfold note',
        counts: 'Counts',
        required: 'Required',
        optional: 'Optional',
        selectedFilter: 'Active filter',
        matched: 'Matched',
        items: 'items',
        citta: 'Consciousness',
        cetasika: 'Mental factor',
        dimension: 'Attribute',
        rupa: 'Rupa',
        rupaAgg: 'Cluster',
        category: 'Categories',
        clusters: 'Clusters',
        composition: 'Composition',
        special: 'Special groups',
        path: 'Path',
        colorLegend: 'Color legend',
        selected: 'locked selection',
        rootTime: 'root / object time',
        functionRelation: 'function',
        gateRelation: 'door',
        objectRelation: 'five objects',
        mentalBasisRelation: 'mental object / base',
        realmRelation: 'realm',
        feelingRelation: 'feeling',
        locate: 'Locate selection',
        clearSelection: 'Unlock selection',
        addCompare: 'Add to compare',
        compare: 'Compare mode',
        compareHint: 'Select one consciousness and add it, then select a second one.',
        commonRelations: 'Shared relations',
        onlyLeft: 'Left only',
        onlyRight: 'Right only',
        remove: 'Remove',
        browseMobile: 'Quick browse consciousness and factors',
        chooseItem: 'Choose an item to view details',
        more: 'more',
        positive: 'positive/linked',
        negative: 'negative/not linked',
        neutral: 'both/neutral',
        inseparable: 'eight inseparables',
        change: 'changeable rupa',
        cittaWhy: 'Start from the selected item and trace its links across consciousness, mental factors, and attributes.',
        rupaWhy: 'Start from the selected item and trace where it appears in attributes, notes, and cluster composition.',
        filterWisdom: 'With wisdom factor',
        filterHatred: 'With hatred factor',
        filterRooted: 'Rooted consciousness',
        filterJavana: 'Javana consciousness',
        filterEye: 'Eye-base related',
        filterChangeCluster: 'Clusters with changeable rupa',
        filterFourOrigins: 'Produced by all four causes',
        filterEightBasics: 'Eight inseparables',
        filterSoundCluster: 'Clusters with sound',
    },
};

function sgLangKey() {
    return getLang().fixed ? 'cn' : 'en';
}

function sgT(key) {
    const lang = sgLangKey();
    return (STUDY_GUIDE_TEXT[lang] && STUDY_GUIDE_TEXT[lang][key]) || STUDY_GUIDE_TEXT.cn[key] || key;
}

function sgEscape(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sgNormalizeTag(value) {
    if (value && typeof value === 'object') {
        return {
            id: value.id === undefined || value.id === null ? null : String(value.id),
            label: value.label || value.name || String(value.id || ''),
            type: value.type || '',
        };
    }
    return {id: null, label: String(value || ''), type: ''};
}

function sgUniqueTags(values) {
    const seen = new Set();
    return (values || []).filter(Boolean).map(sgNormalizeTag).filter((tag) => {
        const key = tag.id === null ? `label:${tag.label}` : `id:${tag.id}`;
        if (!tag.label || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function sgRenderTag(tag, page) {
    const title = tag.type ? ` title="${sgEscape(tag.type)}"` : '';
    if (tag.id !== null) {
        return `<button class="study-guide__tag-button" type="button" data-study-jump="${sgEscape(tag.id)}" data-study-jump-page="${sgEscape(page)}"${title}>${sgEscape(tag.label)}</button>`;
    }
    return `<span class="study-guide__tag"${title}>${sgEscape(tag.label)}</span>`;
}

function sgTags(values, limit = 18, page = 'citta') {
    const tags = sgUniqueTags(values);
    if (!tags.length) {
        return '';
    }
    const visible = tags.slice(0, limit).map((tag) => sgRenderTag(tag, page)).join('');
    const hidden = tags.slice(limit);
    const more = hidden.length
        ? `<details class="study-guide__more"><summary>+${hidden.length} ${sgEscape(sgT('more'))}</summary><div class="study-guide__tags">${hidden.map((tag) => sgRenderTag(tag, page)).join('')}</div></details>`
        : '';
    return `<div class="study-guide__tags">${visible}${more}</div>`;
}

function sgSetNodesOpacity(nodes, opacity) {
    const seen = new Set();
    (nodes || []).forEach((node) => {
        if (!node || !node.node) {
            return;
        }
        const domNode = node.node();
        if (!domNode || seen.has(domNode)) {
            return;
        }
        seen.add(domNode);
        node.style('opacity', opacity);
    });
}

function sgFlattenConnectionIds(connections) {
    if (!connections || !Array.isArray(connections.connection_groups)) {
        return [];
    }
    return connections.connection_groups.flatMap((group) => group.ids || []);
}

function sgGetSideDefinitions() {
    return [feelings, causes, times, objects, mental_objects, realms, gates, basis, functions];
}

function sgCittaTagByName(name, preferredDefinition) {
    if (!name) {
        return null;
    }
    const cetasikaId = cittaState.cetasikaIdIndex[name];
    if (cetasikaId !== undefined) {
        return {id: String(cetasikaId), label: name, type: sgT('cetasika')};
    }
    const definitions = preferredDefinition ? [preferredDefinition] : sgGetSideDefinitions();
    for (const def of definitions) {
        const index = (def.names || []).indexOf(name);
        if (index >= 0) {
            return {
                id: String(def.index_base + index + 1),
                label: name,
                type: def.title || sgT('dimension'),
            };
        }
    }
    return {id: null, label: name, type: ''};
}

function sgGetCittaEntity(itemId) {
    const id = String(itemId);
    const citta = (cittaState.allCittas || []).find((item) => String(item.id) === id);
    if (citta) {
        return {id, name: citta.name, type: sgT('citta'), kind: 'citta', raw: citta};
    }

    const cetasikaItem = (cittaState.allCetasika || []).find((item) => String(item.id) === id);
    if (cetasikaItem) {
        return {id, name: cetasikaItem.name, type: sgT('cetasika'), kind: 'cetasika', raw: cetasikaItem};
    }

    for (const def of sgGetSideDefinitions()) {
        const index = Number(itemId) - def.index_base - 1;
        if (index >= 0 && index < def.names.length) {
            return {
                id,
                name: def.names[index],
                type: def.title || sgT('dimension'),
                kind: 'dimension',
                raw: {name: def.names[index], title: def.title},
            };
        }
    }

    if (cittaState.idIndex && cittaState.idIndex[id]) {
        const raw = cittaState.idIndex[id];
        return {id, name: raw.name || id, type: sgT('dimension'), kind: 'unknown', raw};
    }

    return {id, name: id, type: sgT('dimension'), kind: 'unknown', raw: {}};
}

function sgBuildCittaSearchIndex() {
    const entries = [];
    (cittaState.allCittas || []).forEach((item) => {
        entries.push({
            page: 'citta',
            id: String(item.id),
            label: item.name,
            type: item.group ? `${sgT('citta')} · ${item.group}` : sgT('citta'),
            kind: 'citta',
            keywords: (item.cetasika || []).concat(item.cetasika_opt || [], item.functions || []),
        });
    });
    (cittaState.allCetasika || []).forEach((item) => {
        entries.push({
            page: 'citta',
            id: String(item.id),
            label: item.name,
            type: sgT('cetasika'),
            kind: 'cetasika',
            keywords: [item.char_mark, item.function, item.appearance, item.proximate_cause],
        });
    });
    sgGetSideDefinitions().forEach((def) => {
        (def.names || []).forEach((name, index) => {
            entries.push({
                page: 'citta',
                id: String(def.index_base + index + 1),
                label: name,
                type: def.title || sgT('dimension'),
                kind: 'dimension',
                keywords: [def.title],
            });
        });
    });
    studyState.citta.searchIndex = entries.map((entry) => ({
        ...entry,
        searchText: [entry.label, entry.type].concat(entry.keywords || []).join(' ').toLowerCase(),
    }));
    return studyState.citta.searchIndex;
}

function sgBuildCittaSummary(itemId) {
    const entity = sgGetCittaEntity(itemId);
    const graph = cittaState.highlight && cittaState.highlight.itemGraph ? cittaState.highlight.itemGraph : {};
    const connections = graph[String(itemId)];
    const connectedTags = sgFlattenConnectionIds(connections).map((id) => {
        const connected = sgGetCittaEntity(id);
        return {id: connected.id, label: connected.name, type: connected.type};
    });
    const sections = [];

    if (connections) {
        sections.push({
            title: sgT('counts'),
            text: `${sgT('required')}: ${connections.counter || 0} / ${sgT('optional')}: ${connections.opt_counter || 0}`,
        });
    }

    if (entity.kind === 'citta') {
        sections.push({title: sgT('required'), tags: (entity.raw.cetasika || []).map((name) => sgCittaTagByName(name))});
        sections.push({title: sgT('optional'), tags: (entity.raw.cetasika_opt || []).map((name) => sgCittaTagByName(name))});
        if (entity.raw.functions && entity.raw.functions.length) {
            sections.push({title: functions.title, tags: entity.raw.functions.map((name) => sgCittaTagByName(name, functions))});
        }
    }

    const note = cittaState.noteIndex[String(itemId)];
    if (note) {
        sections.push({
            title: sgT('notes'),
            text: [note.char_mark, note.function, note.appearance, note.proximate_cause].filter(Boolean).join(' / '),
        });
    }

    if (connectedTags.length) {
        sections.push({title: sgT('connected'), tags: connectedTags});
    }

    return {
        page: 'citta',
        id: String(itemId),
        title: entity.name,
        type: entity.kind === 'citta' && entity.raw.group ? `${entity.type} · ${entity.raw.group}` : entity.type,
        kind: entity.kind,
        why: sgT('cittaWhy'),
        sections,
    };
}

function sgBuildCittaComparison(compareIds) {
    const ids = (compareIds || []).slice(0, 2).map(String);
    if (ids.length !== 2) {
        return null;
    }
    const left = sgGetCittaEntity(ids[0]);
    const right = sgGetCittaEntity(ids[1]);
    const leftSet = sgGetCittaConnectionSet(ids[0]);
    const rightSet = sgGetCittaConnectionSet(ids[1]);
    const common = [...leftSet].filter((id) => rightSet.has(id));
    const leftOnly = [...leftSet].filter((id) => !rightSet.has(id));
    const rightOnly = [...rightSet].filter((id) => !leftSet.has(id));
    const toTags = (values) => values.map((id) => {
        const entity = sgGetCittaEntity(id);
        return {id: entity.id, label: entity.name, type: entity.type};
    });
    return {
        left,
        right,
        common: toTags(common),
        leftOnly: toTags(leftOnly),
        rightOnly: toTags(rightOnly),
    };
}

function sgRenderCittaComparison() {
    const compareIds = studyState.citta.compareIds || [];
    const slotHtml = [0, 1].map((index) => {
        const id = compareIds[index];
        if (!id) {
            return `<div class="study-guide__compare-slot">${sgEscape(index === 0 ? 'A' : 'B')} · ${sgEscape(sgT('chooseItem'))}</div>`;
        }
        const entity = sgGetCittaEntity(id);
        return `<div class="study-guide__compare-slot">
            <strong>${index === 0 ? 'A' : 'B'} · ${sgEscape(entity.name)}</strong>
            ${entity.raw && entity.raw.group ? `<span class="study-guide__meta">${sgEscape(entity.raw.group)}</span>` : ''}
            <button class="study-guide__compare-remove" type="button" data-study-compare-remove="${sgEscape(id)}">${sgEscape(sgT('remove'))}</button>
        </div>`;
    }).join('');
    const comparison = sgBuildCittaComparison(compareIds);
    const resultHtml = comparison ? `
        <div class="study-guide__compare-grid">
            <div class="study-guide__compare-column"><strong>${sgEscape(sgT('commonRelations'))}</strong>${sgTags(comparison.common, 12, 'citta')}</div>
            <div class="study-guide__compare-column"><strong>${sgEscape(sgT('onlyLeft'))} · ${sgEscape(comparison.left.name)}</strong>${sgTags(comparison.leftOnly, 12, 'citta')}</div>
            <div class="study-guide__compare-column"><strong>${sgEscape(sgT('onlyRight'))} · ${sgEscape(comparison.right.name)}</strong>${sgTags(comparison.rightOnly, 12, 'citta')}</div>
        </div>` : `<p class="study-guide__empty">${sgEscape(sgT('compareHint'))}</p>`;
    return `<details class="study-guide__compare" ${compareIds.length ? 'open' : ''}>
        <summary>${sgEscape(sgT('compare'))}</summary>
        <div class="study-guide__compare-slots">${slotHtml}</div>
        ${resultHtml}
    </details>`;
}

function sgGetCittaConnectionSet(itemId) {
    const graph = cittaState.highlight && cittaState.highlight.itemGraph ? cittaState.highlight.itemGraph : {};
    return new Set(sgFlattenConnectionIds(graph[String(itemId)]).map((id) => String(id)));
}

function sgCittaFilterDefinition(filterId) {
    const wisdomName = t('string_id_114');
    const hatredName = t('string_id_79');
    const javanaName = t('string_id_128');
    const wisdomId = cittaState.cetasikaIdIndex[wisdomName];
    const hatredId = cittaState.cetasikaIdIndex[hatredName];
    const functionId = functions.index_base + functions.names.indexOf(javanaName) + 1;
    const matchedIds = new Set();
    let label = filterId;

    function addCitta(item) {
        if (item && item.id !== undefined) {
            matchedIds.add(String(item.id));
        }
    }

    if (filterId === 'wisdom') {
        label = sgT('filterWisdom');
        (cittaState.allCittas || [])
            .filter((item) => (item.cetasika || []).concat(item.cetasika_opt || []).includes(wisdomName))
            .forEach(addCitta);
        if (wisdomId !== undefined) {
            matchedIds.add(String(wisdomId));
        }
    } else if (filterId === 'hatred') {
        label = sgT('filterHatred');
        (cittaState.allCittas || [])
            .filter((item) => (item.cetasika || []).concat(item.cetasika_opt || []).includes(hatredName))
            .forEach(addCitta);
        if (hatredId !== undefined) {
            matchedIds.add(String(hatredId));
        }
    } else if (filterId === 'rooted') {
        label = sgT('filterRooted');
        const rootedCauseIds = new Set(causes.names.slice(0, 6).map((_, index) => String(causes.index_base + index + 1)));
        (cittaState.allCittas || []).forEach((item) => {
            const connectionIds = sgGetCittaConnectionSet(item.id);
            if ([...rootedCauseIds].some((id) => connectionIds.has(id))) {
                addCitta(item);
            }
        });
        rootedCauseIds.forEach((id) => matchedIds.add(id));
    } else if (filterId === 'javana') {
        label = sgT('filterJavana');
        (cittaState.allCittas || [])
            .filter((item) => (item.functions || []).includes(javanaName))
            .forEach(addCitta);
        if (functionId > functions.index_base) {
            matchedIds.add(String(functionId));
        }
    }

    return {label, matchedIds};
}

function sgApplyCittaFilter(filterId) {
    const itemIndex = cittaState.itemIndex || {};
    const nodes = Object.values(itemIndex);
    if (!filterId) {
        sgSetNodesOpacity(nodes, 1);
        return null;
    }

    const definition = sgCittaFilterDefinition(filterId);
    sgSetNodesOpacity(nodes, 0.18);
    const matchedNodes = [...definition.matchedIds].map((id) => itemIndex[id]).filter(Boolean);
    sgSetNodesOpacity(matchedNodes, 1);
    return definition;
}

function sgTraverseRupa(data, path = [], leaves = []) {
    if (!data) {
        return leaves;
    }
    const nextPath = data.name ? path.concat(data.name) : path;
    if (!data.children) {
        leaves.push({...data, path});
        return leaves;
    }
    data.children.forEach((child) => sgTraverseRupa(child, nextPath, leaves));
    return leaves;
}

function sgBuildRupaCache() {
    const leaves = sgTraverseRupa(rupa);
    const leafById = {};
    const leafByName = {};
    leaves.forEach((item) => {
        leafById[item.id] = item;
        leafByName[item.name] = item;
        if (item.alias) {
            leafByName[item.alias] = item;
        }
    });

    const aggLeaves = sgTraverseRupa(rupaAgg).filter((item) => item.id !== undefined);
    const aggById = {};
    aggLeaves.forEach((item) => {
        aggById[item.id] = item;
    });

    studyState.rupa.cache = {
        leaves,
        leafById,
        leafByName,
        aggLeaves,
        aggById,
        eightNames: [t('string_id_502'), t('string_id_507'), t('string_id_511'), t('string_id_515'), t('string_id_729'), t('string_id_550'), t('string_id_554'), t('string_id_581')],
        changeNames: [t('string_id_607'), t('string_id_612'), t('string_id_617')],
    };
    return studyState.rupa.cache;
}

function sgGetRupaCache() {
    return studyState.rupa.cache || sgBuildRupaCache();
}

function sgRupaNameById(itemId) {
    const cache = sgGetRupaCache();
    const item = cache.leafById[itemId];
    return item ? (item.alias || item.name) : String(itemId);
}

function sgBuildRupaSearchIndex() {
    const cache = sgBuildRupaCache();
    const entries = [];
    cache.leaves.forEach((item) => {
        entries.push({
            page: 'rupa',
            id: String(item.id),
            label: item.alias || item.name,
            type: sgT('rupa'),
            keywords: [item.name, item.character, item.functions, item.manifestation, item.cause].concat(item.path || []),
        });
    });
    cache.aggLeaves.forEach((item) => {
        const composition = (rupasSubEffects[item.id] || []).map(sgRupaNameById);
        entries.push({
            page: 'rupa',
            id: String(item.id),
            label: item.name,
            type: sgT('rupaAgg'),
            keywords: composition.concat(item.path || []),
        });
    });
    studyState.rupa.searchIndex = entries.map((entry) => ({
        ...entry,
        searchText: [entry.label, entry.type].concat(entry.keywords || []).join(' ').toLowerCase(),
    }));
    return studyState.rupa.searchIndex;
}

function sgGetRupaEntity(itemId) {
    const id = Number(itemId);
    const cache = sgGetRupaCache();
    if (cache.leafById[id]) {
        return {id, kind: 'rupa', type: sgT('rupa'), raw: cache.leafById[id], name: cache.leafById[id].alias || cache.leafById[id].name};
    }
    if (cache.aggById[id]) {
        return {id, kind: 'rupaAgg', type: sgT('rupaAgg'), raw: cache.aggById[id], name: cache.aggById[id].name};
    }
    return null;
}

function sgRupaClassifications(raw) {
    return (rupaClass || []).map((cls) => {
        let value = cls.values[1];
        if ((cls.rupa || []).includes(raw.name)) {
            value = cls.values[0];
        } else if (cls.extra && cls.extra.includes(raw.name)) {
            value = cls.values[2];
        }
        return `${cls.name}: ${value}`;
    });
}

function sgBuildRupaSummary(itemId) {
    const entity = sgGetRupaEntity(itemId);
    if (!entity) {
        return null;
    }
    const cache = sgGetRupaCache();
    const sections = [];

    if (entity.kind === 'rupa') {
        const raw = entity.raw;
        const clusterNames = cache.aggLeaves
            .filter((cluster) => (rupasSubEffects[cluster.id] || []).includes(entity.id))
            .map((cluster) => cluster.name);
        const special = [];
        if (cache.eightNames.includes(raw.name)) {
            special.push(sgT('inseparable'));
        }
        if (cache.changeNames.includes(raw.name)) {
            special.push(sgT('change'));
        }
        sections.push({title: sgT('category'), tags: sgRupaClassifications(raw)});
        sections.push({
            title: sgT('notes'),
            text: [raw.character, raw.functions, raw.manifestation, raw.cause].filter(Boolean).join(' / '),
        });
        sections.push({title: sgT('clusters'), tags: clusterNames});
        if (special.length) {
            sections.push({title: sgT('special'), tags: special});
        }
    } else {
        const compositionIds = rupasSubEffects[entity.id] || [];
        const composition = compositionIds.map(sgRupaNameById);
        const special = [];
        const eightIds = cache.eightNames.map((name) => cache.leafByName[name] && cache.leafByName[name].id).filter(Boolean);
        const changeIds = cache.changeNames.map((name) => cache.leafByName[name] && cache.leafByName[name].id).filter(Boolean);
        if (eightIds.every((id) => compositionIds.includes(id))) {
            special.push(sgT('inseparable'));
        }
        if (changeIds.every((id) => compositionIds.includes(id))) {
            special.push(sgT('change'));
        }
        sections.push({title: sgT('path'), text: (entity.raw.path || []).join(' / ')});
        sections.push({title: sgT('composition'), tags: composition});
        if (special.length) {
            sections.push({title: sgT('special'), tags: special});
        }
    }

    return {
        page: 'rupa',
        id: String(itemId),
        title: entity.name,
        type: entity.type,
        why: sgT('rupaWhy'),
        sections,
    };
}

function sgCollectRupaNodes() {
    const nodes = [];
    Object.values(highlightableItems || {}).forEach((items) => {
        nodes.push(...(items || []));
    });
    (interactiveItems || []).forEach((entry) => {
        if (entry && entry.item) {
            nodes.push(entry.item);
        }
    });
    return nodes;
}

function sgRupaFilterDefinition(filterId) {
    const cache = sgGetRupaCache();
    const matchedIds = new Set();
    let label = filterId;

    function addLeafByName(name) {
        const item = cache.leafByName[name];
        if (item) {
            matchedIds.add(Number(item.id));
        }
        return item ? item.id : null;
    }

    function addClustersContaining(ids) {
        cache.aggLeaves.forEach((cluster) => {
            const composition = rupasSubEffects[cluster.id] || [];
            if (ids.every((id) => composition.includes(id))) {
                matchedIds.add(Number(cluster.id));
            }
        });
    }

    if (filterId === 'eye') {
        label = sgT('filterEye');
        const eyeId = addLeafByName(t('string_id_133'));
        if (eyeId) {
            addClustersContaining([eyeId]);
        }
    } else if (filterId === 'change-cluster') {
        label = sgT('filterChangeCluster');
        const changeIds = cache.changeNames.map(addLeafByName).filter(Boolean);
        addClustersContaining(changeIds);
    } else if (filterId === 'four-origins') {
        label = sgT('filterFourOrigins');
        cache.eightNames.forEach(addLeafByName);
    } else if (filterId === 'eight-basics') {
        label = sgT('filterEightBasics');
        cache.eightNames.forEach(addLeafByName);
    } else if (filterId === 'sound-cluster') {
        label = sgT('filterSoundCluster');
        const soundId = addLeafByName(t('string_id_546'));
        if (soundId) {
            addClustersContaining([soundId]);
        }
    }

    return {label, matchedIds};
}

function sgApplyRupaFilter(filterId) {
    const nodes = sgCollectRupaNodes();
    if (!filterId) {
        sgSetNodesOpacity(nodes, 1);
        return null;
    }

    const definition = sgRupaFilterDefinition(filterId);
    sgSetNodesOpacity(nodes, 0.16);
    const matchedNodes = [];
    [...definition.matchedIds].forEach((id) => {
        matchedNodes.push(...(highlightableItems[id] || []));
        if (window.rupaGuideApi && window.rupaGuideApi.itemById && window.rupaGuideApi.itemById[id]) {
            matchedNodes.push(window.rupaGuideApi.itemById[id].item);
        }
    });
    sgSetNodesOpacity(matchedNodes, 1);
    return definition;
}

function sgScoreSearch(entry, term) {
    const label = String(entry.label || '').toLowerCase();
    if (label === term) {
        return 0;
    }
    if (label.startsWith(term)) {
        return 1;
    }
    if (label.includes(term)) {
        return 2;
    }
    if (entry.searchText.includes(term)) {
        return 3;
    }
    return 99;
}

function sgSearch(page, term) {
    const state = studyState[page];
    const index = state.searchIndex && state.searchIndex.length
        ? state.searchIndex
        : (page === 'citta' ? sgBuildCittaSearchIndex() : sgBuildRupaSearchIndex());
    const normalizedTerm = String(term || '').trim().toLowerCase();
    if (!normalizedTerm) {
        return [];
    }
    return index
        .map((entry) => ({...entry, score: sgScoreSearch(entry, normalizedTerm)}))
        .filter((entry) => entry.score < 99)
        .sort((a, b) => a.score - b.score || String(a.label).length - String(b.label).length)
        .slice(0, 8);
}

function sgFilterButtons(page) {
    const filters = page === 'citta'
        ? [
            ['wisdom', sgT('filterWisdom')],
            ['hatred', sgT('filterHatred')],
            ['rooted', sgT('filterRooted')],
            ['javana', sgT('filterJavana')],
        ]
        : [
            ['eye', sgT('filterEye')],
            ['change-cluster', sgT('filterChangeCluster')],
            ['four-origins', sgT('filterFourOrigins')],
            ['eight-basics', sgT('filterEightBasics')],
            ['sound-cluster', sgT('filterSoundCluster')],
        ];
    return filters.map(([id, label]) => `<button class="study-guide__chip" type="button" data-study-filter="${sgEscape(id)}">${sgEscape(label)}</button>`).join('');
}

function sgLegend(page) {
    const items = page === 'citta'
        ? [
            ['selected', sgT('selected')],
            ['required', sgT('positive')],
            ['optional', sgT('optional')],
            ['root-time', sgT('rootTime')],
            ['function', sgT('functionRelation')],
            ['gate', sgT('gateRelation')],
            ['object', sgT('objectRelation')],
            ['mental-basis', sgT('mentalBasisRelation')],
            ['realm', sgT('realmRelation')],
            ['feeling', sgT('feelingRelation')],
        ]
        : [
            ['object', sgT('positive')],
            ['optional', sgT('negative')],
            ['mental-basis', sgT('neutral')],
            ['root-time', sgT('inseparable')],
        ];
    return items.map(([token, label]) => (
        `<span class="study-guide__legend-item"><span class="study-guide__swatch study-guide__swatch--${sgEscape(token)}"></span>${sgEscape(label)}</span>`
    )).join('');
}

function sgMobileBrowser(page) {
    if (page !== 'citta') {
        return '';
    }
    const entries = studyState.citta.searchIndex || [];
    const cittaEntries = entries.filter((entry) => entry.kind === 'citta');
    const cetasikaEntries = entries.filter((entry) => entry.kind === 'cetasika');
    const optionGroup = (label, values) => `<optgroup label="${sgEscape(label)}">${values.map((entry) => (
        `<option value="${sgEscape(entry.id)}">${sgEscape(entry.label)}${entry.kind === 'citta' && entry.type.includes('·') ? ` · ${sgEscape(entry.type.split('·').slice(1).join('·').trim())}` : ''}</option>`
    )).join('')}</optgroup>`;
    return `<details class="study-guide__mobile-browser">
        <summary>${sgEscape(sgT('browseMobile'))}</summary>
        <select class="study-guide__mobile-select" data-study-mobile-select aria-label="${sgEscape(sgT('browseMobile'))}">
            <option value="">${sgEscape(sgT('chooseItem'))}</option>
            ${optionGroup(sgT('citta'), cittaEntries)}
            ${optionGroup(sgT('cetasika'), cetasikaEntries)}
        </select>
    </details>`;
}

function sgRenderGuideShell(page) {
    const root = document.getElementById(`${page}-guide`);
    if (!root) {
        return null;
    }
    const searchPlaceholder = page === 'citta' ? sgT('searchCitta') : sgT('searchRupa');
    const hasExternalPanel = Boolean(document.querySelector(`[data-study-panel="${page}"]`));
    root.innerHTML = `
        <div class="study-guide__controls">
            <div class="study-guide__search-row">
                <input class="study-guide__search" type="search" data-study-search placeholder="${sgEscape(searchPlaceholder)}">
                <button class="study-guide__button" type="button" data-study-clear>${sgEscape(sgT('clear'))}</button>
            </div>
            <div class="study-guide__chips" aria-label="${sgEscape(sgT('common'))}">
                ${sgFilterButtons(page)}
            </div>
            <div class="study-guide__results" data-study-results></div>
            <div class="study-guide__legend" aria-label="${sgEscape(sgT('colorLegend'))}">
                ${sgLegend(page)}
            </div>
            ${sgMobileBrowser(page)}
        </div>
        ${hasExternalPanel ? '' : `<div class="study-guide__panel" data-study-panel="${sgEscape(page)}"></div>`}
    `;
    return root;
}

function sgRenderSearchResults(page, results) {
    const root = document.getElementById(`${page}-guide`);
    if (!root) {
        return;
    }
    const container = root.querySelector('[data-study-results]');
    if (!container) {
        return;
    }
    if (!studyState[page].searchTerm) {
        container.innerHTML = '';
        return;
    }
    if (!results.length) {
        container.innerHTML = `<span class="study-guide__empty">${sgEscape(sgT('noResults'))}</span>`;
        return;
    }
    container.innerHTML = results.map((entry) => (
        `<button class="study-guide__result" type="button" data-study-result="${sgEscape(entry.id)}">
            ${sgEscape(entry.label)} <small>${sgEscape(entry.type)}</small>
        </button>`
    )).join('');
}

function sgRenderFilterSummary(page, definition) {
    if (!definition) {
        return null;
    }
    return {
        page,
        title: definition.label,
        type: sgT('selectedFilter'),
        why: page === 'citta' ? sgT('cittaWhy') : sgT('rupaWhy'),
        sections: [{
            title: sgT('matched'),
            text: `${definition.matchedIds.size} ${sgT('items')}`,
        }],
    };
}

function sgGetStudyPanel(page) {
    return document.querySelector(`[data-study-panel="${page}"]`);
}

function renderStudyPanel(summary, pageOverride) {
    const page = pageOverride || (summary && summary.page ? summary.page : studyState.activePage);
    const panel = sgGetStudyPanel(page);
    if (!panel) {
        return;
    }
    const compareHtml = page === 'citta' ? sgRenderCittaComparison() : '';
    if (!summary) {
        panel.innerHTML = `<p class="study-guide__empty">${sgEscape(sgT('noSelection'))}</p>${compareHtml}`;
        return;
    }

    const sections = (summary.sections || []).map((section) => {
        const text = section.text ? `<div>${sgEscape(section.text)}</div>` : '';
        const tags = section.tags ? sgTags(section.tags, 18, page) : '';
        return `<div class="study-guide__section"><strong>${sgEscape(section.title)}</strong>${text}${tags}</div>`;
    }).join('');
    const compareAction = page === 'citta' && summary.kind === 'citta'
        ? `<button class="study-guide__button study-guide__button--primary" type="button" data-study-compare-add="${sgEscape(summary.id)}">${sgEscape(sgT('addCompare'))}</button>`
        : '';

    panel.innerHTML = `
        <div class="study-guide__breadcrumb">${sgEscape(page === 'citta' ? '心与心所' : sgT('rupa'))} › ${sgEscape(summary.type || '')} › ${sgEscape(summary.title)}</div>
        <h3 class="study-guide__title">${sgEscape(summary.title)}</h3>
        <div class="study-guide__meta">${sgEscape(summary.type || '')}</div>
        <div class="study-guide__panel-actions">
            <button class="study-guide__button study-guide__button--quiet" type="button" data-study-locate="${sgEscape(summary.id)}">${sgEscape(sgT('locate'))}</button>
            ${compareAction}
            <button class="study-guide__button study-guide__button--quiet" type="button" data-study-clear-selection>${sgEscape(sgT('clearSelection'))}</button>
        </div>
        <div class="study-guide__section"><strong>${sgEscape(sgT('why'))}</strong><div>${sgEscape(summary.why || '')}</div></div>
        ${sections}
        ${compareHtml}
    `;
}

function sgRevealStudyItem(page, itemId, options = {}) {
    if (page !== 'citta' || !cittaState.itemIndex || !cittaState.itemIndex[String(itemId)]) {
        return false;
    }
    const item = cittaState.itemIndex[String(itemId)];
    const node = item.node();
    const scroller = document.getElementById('citta-scroll');
    if (!node || !scroller || typeof node.getBBox !== 'function') {
        return false;
    }
    const box = node.getBBox();
    const left = Math.max(0, box.x + box.width / 2 - scroller.clientWidth / 2);
    const top = Math.max(0, box.y + box.height / 2 - scroller.clientHeight / 2);
    scroller.scrollTo({left, top, behavior: options.behavior || 'smooth'});
    if (options.focusCanvas) {
        scroller.scrollIntoView({behavior: options.behavior || 'smooth', block: 'start'});
    }
    if (options.focus && typeof node.focus === 'function') {
        node.focus({preventScroll: true});
    }
    return true;
}

function sgSyncCittaUrl() {
    const url = new URL(window.location.href);
    if (studyState.citta.selectedId) {
        url.searchParams.set('item', studyState.citta.selectedId);
    } else {
        url.searchParams.delete('item');
    }
    const compareIds = studyState.citta.compareIds || [];
    if (compareIds.length) {
        url.searchParams.set('compare', compareIds.join(','));
    } else {
        url.searchParams.delete('compare');
    }
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function sgRenderCurrentCittaPanel() {
    const selectedId = studyState.citta.selectedId;
    renderStudyPanel(selectedId ? sgBuildCittaSummary(selectedId) : null, 'citta');
}

function sgAddComparisonItem(itemId) {
    const id = String(itemId);
    const entity = sgGetCittaEntity(id);
    if (entity.kind !== 'citta') {
        return;
    }
    const compareIds = studyState.citta.compareIds;
    if (!compareIds.includes(id)) {
        if (compareIds.length >= 2) {
            compareIds.shift();
        }
        compareIds.push(id);
    }
    sgRenderCurrentCittaPanel();
    sgSyncCittaUrl();
}

function sgRemoveComparisonItem(itemId) {
    const id = String(itemId);
    studyState.citta.compareIds = studyState.citta.compareIds.filter((candidate) => candidate !== id);
    sgRenderCurrentCittaPanel();
    sgSyncCittaUrl();
}

function sgUpdateChipState(page) {
    const root = document.getElementById(`${page}-guide`);
    if (!root) {
        return;
    }
    root.querySelectorAll('[data-study-filter]').forEach((button) => {
        button.classList.toggle('active', button.dataset.studyFilter === studyState[page].activeFilter);
    });
}

function selectStudyItem(page, itemId, options = {}) {
    studyState.activePage = page;
    let summary = null;
    if (page === 'citta') {
        if (cittaState.highlight && cittaState.highlight.selectItem) {
            cittaState.highlight.selectItem(itemId, {notify: false});
        }
        studyState.citta.selectedId = String(itemId);
        summary = sgBuildCittaSummary(itemId);
    } else if (page === 'rupa') {
        if (window.rupaGuideApi && window.rupaGuideApi.selectItem) {
            window.rupaGuideApi.selectItem(itemId, {notify: false});
        }
        studyState.rupa.selectedId = String(itemId);
        summary = sgBuildRupaSummary(itemId);
    }
    renderStudyPanel(summary);
    if (page === 'citta') {
        const mobileSelect = document.querySelector('[data-study-mobile-select]');
        if (mobileSelect && [...mobileSelect.options].some((option) => option.value === String(itemId))) {
            mobileSelect.value = String(itemId);
        }
        if (options.updateUrl !== false) {
            sgSyncCittaUrl();
        }
        if (options.reveal !== false) {
            sgRevealStudyItem(page, itemId, {
                behavior: options.behavior || 'smooth',
                focus: Boolean(options.focus),
                focusCanvas: Boolean(options.focusCanvas),
            });
        }
    }
    return summary;
}

function clearStudySelection(page) {
    studyState.activePage = page;
    if (page === 'citta') {
        if (cittaState.highlight && cittaState.highlight.clear) {
            cittaState.highlight.clear({notify: false});
        }
        studyState.citta.selectedId = null;
        const mobileSelect = document.querySelector('[data-study-mobile-select]');
        if (mobileSelect) {
            mobileSelect.value = '';
        }
    } else if (page === 'rupa') {
        if (window.rupaGuideApi && window.rupaGuideApi.clear) {
            window.rupaGuideApi.clear({notify: false});
        }
        studyState.rupa.selectedId = null;
    }

    const activeFilter = studyState[page].activeFilter;
    const definition = activeFilter
        ? (page === 'citta' ? sgCittaFilterDefinition(activeFilter) : sgRupaFilterDefinition(activeFilter))
        : null;
    renderStudyPanel(sgRenderFilterSummary(page, definition));
    if (page === 'citta') {
        sgSyncCittaUrl();
    }
}

function applyStudyFilter(page, filterId) {
    studyState.activePage = page;
    const nextFilter = studyState[page].activeFilter === filterId ? null : filterId;
    studyState[page].activeFilter = nextFilter;
    const definition = page === 'citta' ? sgApplyCittaFilter(nextFilter) : sgApplyRupaFilter(nextFilter);
    sgUpdateChipState(page);
    if (!studyState[page].selectedId) {
        renderStudyPanel(sgRenderFilterSummary(page, definition));
    }
    return definition;
}

function studyGuideHandleSelection(page, itemId, options = {}) {
    studyState.activePage = page;
    if (options.clear || itemId === null || itemId === undefined) {
        studyState[page].selectedId = null;
        const activeFilter = studyState[page].activeFilter;
        const definition = activeFilter
            ? (page === 'citta' ? sgCittaFilterDefinition(activeFilter) : sgRupaFilterDefinition(activeFilter))
            : null;
        renderStudyPanel(sgRenderFilterSummary(page, definition), page);
        if (page === 'citta') {
            sgSyncCittaUrl();
        }
        return;
    }
    studyState[page].selectedId = String(itemId);
    const summary = page === 'citta' ? sgBuildCittaSummary(itemId) : sgBuildRupaSummary(itemId);
    renderStudyPanel(summary);
    if (page === 'citta') {
        sgSyncCittaUrl();
    }
}

function sgBindGuideEvents(page) {
    const root = document.getElementById(`${page}-guide`);
    if (!root) {
        return;
    }
    const input = root.querySelector('[data-study-search]');
    if (input) {
        input.addEventListener('input', () => {
            studyState[page].searchTerm = input.value;
            sgRenderSearchResults(page, sgSearch(page, input.value));
        });
        input.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            const result = sgSearch(page, input.value)[0];
            if (result) {
                selectStudyItem(page, result.id);
            }
        });
    }

    const mobileSelect = root.querySelector('[data-study-mobile-select]');
    if (mobileSelect) {
        mobileSelect.addEventListener('change', () => {
            if (mobileSelect.value) {
                selectStudyItem(page, mobileSelect.value, {reveal: true});
            }
        });
    }

    root.querySelector('[data-study-clear]').addEventListener('click', () => {
        if (input) {
            input.value = '';
        }
        studyState[page].searchTerm = '';
        sgRenderSearchResults(page, []);
        studyState[page].activeFilter = null;
        page === 'citta' ? sgApplyCittaFilter(null) : sgApplyRupaFilter(null);
        sgUpdateChipState(page);
        clearStudySelection(page);
    });

    root.addEventListener('click', (event) => {
        const resultButton = event.target.closest('[data-study-result]');
        if (resultButton) {
            selectStudyItem(page, resultButton.dataset.studyResult);
            return;
        }
        const filterButton = event.target.closest('[data-study-filter]');
        if (filterButton) {
            applyStudyFilter(page, filterButton.dataset.studyFilter);
        }
    });

    const panel = sgGetStudyPanel(page);
    if (panel) {
        panel.addEventListener('click', (event) => {
            const jumpButton = event.target.closest('[data-study-jump]');
            if (jumpButton) {
                selectStudyItem(jumpButton.dataset.studyJumpPage || page, jumpButton.dataset.studyJump, {reveal: true});
                return;
            }
            const locateButton = event.target.closest('[data-study-locate]');
            if (locateButton) {
                sgRevealStudyItem(page, locateButton.dataset.studyLocate, {behavior: 'smooth', focus: true, focusCanvas: true});
                return;
            }
            const compareAddButton = event.target.closest('[data-study-compare-add]');
            if (compareAddButton) {
                sgAddComparisonItem(compareAddButton.dataset.studyCompareAdd);
                return;
            }
            const compareRemoveButton = event.target.closest('[data-study-compare-remove]');
            if (compareRemoveButton) {
                sgRemoveComparisonItem(compareRemoveButton.dataset.studyCompareRemove);
                return;
            }
            if (event.target.closest('[data-study-clear-selection]')) {
                clearStudySelection(page);
            }
        });
    }
}

function sgRestoreCittaUrlState() {
    const params = new URLSearchParams(window.location.search);
    const compareIds = String(params.get('compare') || '')
        .split(',')
        .filter(Boolean)
        .filter((id) => sgGetCittaEntity(id).kind === 'citta')
        .slice(0, 2);
    studyState.citta.compareIds = [...new Set(compareIds)];
    const itemId = params.get('item');
    if (itemId && cittaState.itemIndex && cittaState.itemIndex[String(itemId)]) {
        selectStudyItem('citta', itemId, {behavior: 'auto', reveal: true, updateUrl: false});
    } else {
        sgRenderCurrentCittaPanel();
    }
    sgSyncCittaUrl();
}

function initializeStudyGuide(pageState) {
    studyState.activePage = pageState && pageState.tab ? pageState.tab.id : 'citta';
    if (typeof cittaState !== 'undefined') {
        sgBuildCittaSearchIndex();
    }
    if (typeof rupa !== 'undefined') {
        sgBuildRupaSearchIndex();
    }

    ['citta', 'rupa'].forEach((page) => {
        const root = sgRenderGuideShell(page);
        if (!root) {
            return;
        }
        sgBindGuideEvents(page);
        sgUpdateChipState(page);
        renderStudyPanel(null, page);
    });
    sgRestoreCittaUrlState();
    if (!studyState.globalEventsBound) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && studyState.citta.selectedId) {
                clearStudySelection('citta');
            }
        });
        studyState.globalEventsBound = true;
    }
}

window.studyState = studyState;
window.initializeStudyGuide = initializeStudyGuide;
window.selectStudyItem = selectStudyItem;
window.clearStudySelection = clearStudySelection;
window.applyStudyFilter = applyStudyFilter;
window.renderStudyPanel = renderStudyPanel;
window.studyGuideHandleSelection = studyGuideHandleSelection;
