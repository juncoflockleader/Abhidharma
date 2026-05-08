const cittaPageApi = getCittaPageApi();
const cittaSvg = cittaPageApi.svg;

function createCittaState() {
    return {
        itemIndex: {},
        noteIndex: {},
        subEffectIndex: {},
        idIndex: {},
        allCetasika: [],
        allCittas: [],
        cetasikaIdIndex: {},
        cetasikaTableBottom: 0,
        highlight: { locked: false, lockedItem: null, clearFunc: null },
        filters: {},
        registerItem(id, node) {
            this.itemIndex[id] = node;
            return node;
        },
        registerNote(id, note) {
            this.noteIndex[id] = note;
            return note;
        },
        registerId(id, entity) {
            this.idIndex[id] = entity;
            return entity;
        },
        registerCetasika(name, id) {
            this.cetasikaIdIndex[name] = id;
            return id;
        }
    };
}

let cittaState = createCittaState();
let cittaModel = null;

function resetCittaState() {
    cittaState = createCittaState();
    return cittaState;
}

function rebuildCittaModel() {
    cittaModel = buildCittaModel({ data, cittas, cetasika });
    return cittaModel;
}

function getCittaModel() {
    return cittaModel || rebuildCittaModel();
}

function renderCittaTable(parent, state = cittaState) {
    const model = rebuildCittaModel();
    const rowHeaderWidth = 120;
    const columnWidths = [120, 120, 120, 220, 120, 120];
    const columnHeaderHeight = 105;
    const rowHeights = [210, 105, 90, 90];
    function renderFirstCell(parent, x, y, w, h) {
        renderCell(parent, x, y, w, h, 'lightblue');
        parent.append('line')
            .attr('x1', x) // Start of line (x-coordinate)
            .attr('y1', y) // Start of line (y-coordinate)
            .attr('x2', w) // End of line (x-coordinate)
            .attr('y2', h) // End of line (y-coordinate)
            .attr('stroke', 'grey') // Line color
            .attr('stroke-width', 1); // Line width

        // Add text to the first triangle
        renderText(parent, x, y + h/3, w * 2/3, h, model.header.rowHeader);
        renderText(parent, x + w/4, y, w, h * 2 / 3, model.header.columnHeader);
        return {
            endX: w,
            endY: h
        }
    }

    function renderColumnHeaders(parent, x, y, ws, h, color) {
        let x0 = x;
        for (let i = 0; i < 2; ++i) {
            renderTextBox(parent, x0, y, ws[i], h, color, model.columnDefinitions[i].displayName);
            x0 += ws[i];
        }
        let h0 = h/3;
        for (let i = 2; i < ws.length; ++i) {
            renderTextBox(parent, x0, y + h0 * 2, ws[i], h0, color, model.columnDefinitions[i].displayName);
            x0 += ws[i];
        }

        renderTextBox(parent, x + subArraySum(ws, 0, 2), y + h / 3, subArraySum(ws, 2, 4), h/3, color, model.columnDefinitions[2].groupDisplayName);
        renderTextBox(parent, x + subArraySum(ws, 0, 4), y + h / 3, subArraySum(ws, 4, 6), h/3, color, model.columnDefinitions[4].groupDisplayName);
        renderTextBox(parent, x + subArraySum(ws, 0, 2), y, subArraySum(ws, 2, 6), h / 3, color, model.columnDefinitions[2].topGroupDisplayName);
    }

    function renderRowHeaders(parent, x, y, w, hs) {
        let y0 = y;
        for (let i = 0; i < hs.length; i++) {
            renderTextBox(parent, x, y0, w, hs[i], 'lightcyan', model.rowDefinitions[i].displayName);
            y0 += hs[i];
        }
    }

    function renderGridCells(parent, x, y, ws, hs) {
        let y0 = y;
        let x0;
        for (let rowIndex = 0; rowIndex < hs.length; rowIndex++) {
            x0 = x;
            const rowHeight = hs[rowIndex];
            for (let colIndex = 0; colIndex < ws.length; colIndex++) {
                const columnWidth = ws[colIndex];
                renderCell(parent, x0, y0, columnWidth, rowHeight, 'white');

                let cittaGroupIds = model.rowDefinitions[rowIndex].cittaGroupIds[colIndex];
                cittaGroupIds.forEach((groupId, index) => {
                    const cittaGroup = model.cittaGroupIndex[groupId];
                    const offsetX = cittaGroupIds.length === 1 ? x0 : x0 + index * columnWidth / 2;
                    const width = cittaGroupIds.length === 1 ? columnWidth : columnWidth / 2;
                    renderVerticalTable(parent, offsetX, y0, width, rowHeight, cittaGroup.displayName, cittaGroup.raw.children, 5, state.itemIndex);
                });
                x0 += columnWidth;
            }
            y0 += rowHeight;
        }
        return {
            endX: x0,
            endY: y0,
        }
    }

    const fs = renderFirstCell(parent, 0, 0, rowHeaderWidth, columnHeaderHeight);
    renderColumnHeaders(parent, fs.endX, 0, columnWidths, columnHeaderHeight, 'lightcyan');
    renderRowHeaders(parent, 0, fs.endY, rowHeaderWidth, rowHeights);
    const gc = renderGridCells(parent, fs.endX, fs.endY, columnWidths, rowHeights);

    return {
        endX: gc.endX,
        endY: gc.endY
    };
}

function renderCetasikaTable(y, state = cittaState) {
    renderCetasikaTableByLayout(getLang().fixed ? CETASIKA_TABLE_LAYOUT_CN : CETASIKA_TABLE_LAYOUT_EN, y, state);
}

const CETASIKA_TABLE_LAYOUT_CN = {
    headerRowHeight: 30,
    itemColumnWidth: 25,
    itemRowHeight: 75,
    totalColumns: 52,
    groupColumns: [13, 14, 25],
    maxRowCount: Infinity,
    verticalText: true,
    autoWrap: false,
    subgroupHeaderBg: 'lightcyan',
    subgroupLabelKey: 'displayName',
    subgroupColumnSpanFn: (subGroup) => subGroup.children.length,
    nextItemPosition: ({x, y0, rowCount, itemColumnWidth}) => ({x: x + itemColumnWidth, y0, rowCount}),
    shouldBreakColumn: () => false,
    resetBreakPoint: () => ({breakPoint: 0, groupIndexOffset: 0}),
    tableBottomMultiplier: 5.5,
};

const CETASIKA_TABLE_LAYOUT_EN = {
    headerRowHeight: 14,
    itemColumnWidth: 140,
    itemRowHeight: 14,
    totalColumns: 7,
    groupColumns: [2, 2, 3],
    maxRowCount: 10,
    verticalText: false,
    autoWrap: false,
    subgroupHeaderBg: 'lavender',
    subgroupLabelKey: 'name',
    subgroupColumnSpanFn: () => 1,
    nextItemPosition: ({x, y0, rowCount, itemRowHeight}) => ({x, y0: y0 + itemRowHeight, rowCount: rowCount + 1}),
    shouldBreakColumn: ({breakPoint, subGroup, group, groupIndex, rowCount, maxRowCount}) =>
        breakPoint < subGroup.children.length - 1 || groupIndex === group.length - 1 || rowCount + group[groupIndex + 1].children.length >= maxRowCount,
    resetBreakPoint: ({breakPoint, subGroup}) =>
        breakPoint >= subGroup.children.length - 1 ? {breakPoint: 0, groupIndexOffset: 0} : {breakPoint: breakPoint + 1, groupIndexOffset: -1},
    tableBottomMultiplier: 5.5,
};

function renderCetasikaTableByLayout(layoutConfig, y, state = cittaState) {
    const model = getCittaModel();
    const {
        headerRowHeight,
        itemColumnWidth,
        itemRowHeight,
        totalColumns,
        groupColumns,
        maxRowCount,
        verticalText,
        autoWrap,
        subgroupHeaderBg,
        subgroupLabelKey,
        subgroupColumnSpanFn,
        nextItemPosition,
        shouldBreakColumn,
        resetBreakPoint,
        tableBottomMultiplier,
    } = layoutConfig;
    state.allCetasika = [];
    renderTextBox(cittaSvg, 0, y, itemColumnWidth * totalColumns, headerRowHeight, 'lightcyan', model.cetasika.name, {size: '12px', align: 'middle'});
    let groupHeaderX = 0;
    for (let i = 0; i < model.cetasika.groups.length; i++) {
        renderTextBox(cittaSvg, groupHeaderX, y + headerRowHeight, itemColumnWidth * groupColumns[i], headerRowHeight, 'lightcyan', model.cetasika.groups[i].displayName, {size: '12px', align: 'middle'});
        groupHeaderX += itemColumnWidth * groupColumns[i];
    }

    let x = 0;
    for (let i = 0; i < model.cetasika.groups.length; i++) {
        const group = model.cetasika.groups[i].children;
        let y0 = y + headerRowHeight * 2;
        let rowCount = 0;
        let breakPoint = 0;
        for (let j = 0; j < group.length; j++) {
            const subGroup = group[j];
            const subgroupColumnSpan = subgroupColumnSpanFn(subGroup);
            renderTextBox(cittaSvg, x, y0, itemColumnWidth * subgroupColumnSpan, headerRowHeight, subgroupHeaderBg, subGroup[subgroupLabelKey], {size: '12px', wrap: autoWrap, align: 'middle'});
            rowCount++;
            y0 += headerRowHeight;
            for (; breakPoint < subGroup.children.length; breakPoint++) {
                const child = subGroup.children[breakPoint];
                state.allCetasika.push(child);
                state.registerCetasika(child.name, child.id);
                state.registerId(child.id, child);
                state.registerItem(child.id, renderTextBox(cittaSvg, x, y0, itemColumnWidth, itemRowHeight, 'white', child.name, {size: '12px', wrap: autoWrap, vertical: verticalText}));
                state.registerNote(child.id, {
                    'char_mark': child.char_mark,
                    'function': child.function,
                    'appearance': child.appearance,
                    'proximate_cause': child.proximate_cause,
                });
                const nextPos = nextItemPosition({x, y0, rowCount, itemColumnWidth, itemRowHeight});
                x = nextPos.x;
                y0 = nextPos.y0;
                rowCount = nextPos.rowCount;
                if (rowCount > maxRowCount) {
                    break;
                }
            }
            if (shouldBreakColumn({breakPoint, subGroup, group, groupIndex: j, rowCount, maxRowCount})) {
                y0 = y + headerRowHeight * 2;
                x += itemColumnWidth;
                rowCount = 0;
            }
            const breakState = resetBreakPoint({breakPoint, subGroup});
            breakPoint = breakState.breakPoint;
            j += breakState.groupIndexOffset;
        }
    }
    state.cetasikaTableBottom = y + headerRowHeight * tableBottomMultiplier;
}

function renderCetasikaTableCn(y, state = cittaState) {
    renderCetasikaTableByLayout(CETASIKA_TABLE_LAYOUT_CN, y, state);
}

function renderAbbrev(x, y, columnWidth, rowHeight, abbreviations, state) {
    renderTextBox(cittaSvg, x, y, columnWidth, rowHeight, 'lightcyan', 'glossary', {size: '12px', wrap: false, align: 'middle'});
    renderTextBox(cittaSvg, x + columnWidth, y, columnWidth / 3, rowHeight, 'lightcyan', 'abbrev.', {size: '12px', wrap: false, align: 'middle'});
    let r = 0;
    for (const key in abbreviations) {
        const color = r % 2 === 0 ? 'white' : 'lightgrey';
        y += rowHeight;
        state.registerItem(key, renderTextBox(cittaSvg, x, y, columnWidth, rowHeight, color, abbreviations[key], {
            size: '12px',
            wrap: false,
            align: 'middle'
        }));
        renderTextBox(cittaSvg, x + columnWidth, y, columnWidth / 3, rowHeight, color, key, {size: '12px', wrap: false, align: 'middle'});
        r++;
    }
}

function renderCetasikaTableEn(y, state = cittaState) {
    const columnWidth = CETASIKA_TABLE_LAYOUT_EN.itemColumnWidth;
    const rowHeight = CETASIKA_TABLE_LAYOUT_EN.headerRowHeight;
    renderCetasikaTableByLayout(CETASIKA_TABLE_LAYOUT_EN, y, state);

    const abbreviations = {
        "MFact": "Mental Factor",
        "Consc": "Consciousness",
        "AccW": "Accompanied With",
        "NAccW": "Not Accompanied With",
        "Whsm": "Wholesome",
        "Uwhsm": "Unwholesome",
        "Joy": "Joyful",
        "Eq": "Equanimity",
        "Wis": "Wisdom",
        "Pr": "Prompted",
        "UnPr": "Unprompted",
        "WrVw": "Wrong View",
    };
    renderAbbrev(columnWidth * 7 + 5, y, columnWidth*0.9, rowHeight, abbreviations, state);
    const abbreviations2 = {
        "BsOf":"Base of",
        "Investg": "Investigation",
        "Recv": "Receiving",
        "Restlss": "Restlessness",
        "NPNNP": "Neither-perception-nor-no-perception",
        "SupraM": "Supramundane",
        "Immat": "Immaterial",
        "Funct": "Functional",
        "Rootlss": "Rootless",
        "Hate": "Hatred",
        "Distr": "Distress",
        "MattPhenm": "Matter Phenomena",
    }

    renderAbbrev(columnWidth * 8.3, y, columnWidth*1.4, rowHeight, abbreviations2, state);
    state.cetasikaTableBottom = y + rowHeight * 5.5;
}

function renderSubTableV2(x, y, def) {
    if (getLang().fixed) { // fixed width fonts
        return renderSubTableV2CN(x, y, def);
    } else {
        return renderSubTableV2En(x, y, def);
    }
}

function renderSubTableV2CN(x, y, def) {
    const state = cittaState;
    const names = def.names;
    let widths = [];
    for (let i = 0; i < names.length; ++i) {
        widths = widths.concat([getWordLength(names[i], 12)]);
    }
    let total = subArraySum(widths, 0, widths.length);

    const h = 30;
    renderTextBox(cittaSvg, x, y, total, h, 'lightcyan', def.title, {size: '14px', wrap: false, align: 'middle'});
    let x0 = x;
    for (let i = 0; i < names.length; ++i) {
        state.registerItem(def['index_base'] + i + 1, renderTextBox(cittaSvg, x0, y + h, widths[i], h, 'white', names[i], {
            size: '12px',
            align: 'middle'
        }));
        x0 += widths[i];
    }
    return {
        endX: x + total,
        endY: y + 2 * 30
    };
}

function renderSubTableV2En(x, y, def) {
    const state = cittaState;
    const names = def.names;
    let width = 0;
    const padding = 5;
    for (let i = 0; i < names.length; ++i) {
        width = Math.max(width, getWordLength(names[i], 12));
    }
    width += padding;
    width = Math.max(width, getWordLength(def.title, 14));
    let height = 12 + padding;

    renderTextBox(cittaSvg, x, y, width, height, 'lightcyan', def.title, {size: '14px', wrap: false, align: 'middle'});
    for (let i = 0; i < names.length; ++i) {
        state.registerItem(def['index_base'] + i + 1, renderTextBox(cittaSvg, x, y + height * (i + 1), width, height, 'white', names[i], {
            size: '12px',
            align: 'middle',
            wrap: false
        }));
    }
    return {
        endX: x + width,
        endY: y + height * (names.length + 1)
    };
}

function renderFeelingTable(x, y) {
    return renderSubTableV2(x, y, feelings);
}

function renderCauseTable(x, y) {
    return renderSubTableV2(x, y, causes);
}

function renderTimeTable(x, y) {
    return renderSubTableV2(x, y, times);
}

function renderFiveObjectsTable(x, y) {
    return renderSubTableV2(x, y, objects);
}

function renderMentalObjectsTable(x, y) {
    return renderSubTableV2(x, y, mental_objects);
}

function renderRealmTable(x, y) {
    return renderSubTableV2(x, y, realms);
}

function renderGateTable(x, y) {
    return renderSubTableV2(x, y, gates);
}

function renderBasisTable(x, y) {
    return renderSubTableV2(x, y, basis);
}

function renderFunctionTable(x, y) {
    return renderSubTableV2(x, y, functions);
}

function renderCounterTable(x, y, w, titlepx=14) {
    if (!w) {
        w = 60;
    }
    let h = 30;
    renderTextBox(cittaSvg, x, y, w, h, 'lightcyan', t('string_id_1'), {size: titlepx, align: 'middle'});
    renderTextBox(cittaSvg, x + w, y, w, h, 'lightcyan', t('string_id_2'), {size: titlepx, align: 'middle'});
    let counterTextBox = renderTextBox(cittaSvg, x, y + h, w, h, 'white', '', {size: '12px', align: 'middle'});
    let optCounterTextBox = renderTextBox(cittaSvg, x + w, y + h, w, h, 'white', '', {size: '12px', align: 'middle'});
    return {
        update: function (counter, optCounter) {
            counterTextBox.setText(counter.toString());
            optCounterTextBox.setText(optCounter.toString());
        },
        clear: function () {
            counterTextBox.setText('');
            optCounterTextBox.setText('');
        },
        endX: x + w * 2,
        endY: y + h * 2
    }
}

function renderNoteTable(x, y, w, titlepx=14) {
    const state = cittaState;
    let h0 = 20;

    if (!w) {
        w = 30;
    }
    let h = 30;
    renderTextBox(cittaSvg, x, y + h0, w, h, 'lightcyan', t('string_id_3'), {size: titlepx});
    renderTextBox(cittaSvg, x, y + h0 + h, w, h, 'lightcyan', t('string_id_4'), {size: titlepx});
    renderTextBox(cittaSvg, x, y + h0 + 2 * h, w, h, 'lightcyan', t('string_id_5'), {size: titlepx});
    renderTextBox(cittaSvg, x, y + h0 + 3 * h, w, h, 'lightcyan', t('string_id_6'), {size: titlepx});
    let w0 = 350 - w;
    let charTextBox = renderTextBox(cittaSvg, x + w, y + h0, w0, h, 'white', '', {size: '12px', wrap: true});
    let functionTextBox = renderTextBox(cittaSvg, x + w, y + h0 + h, w0, h, 'white', '', {size: '12px', wrap: true});
    let appearanceTextBox = renderTextBox(cittaSvg, x + w, y + h0 + 2 * h, w0, h, 'white', '', {size: '12px', wrap: true});
    let proximateCauseTextBox = renderTextBox(cittaSvg, x + w, y + h0 + 3 * h, w0, h, 'white', '', {size: '12px', wrap: true});
    renderTextBox(cittaSvg, x, y, w + w0, h0, 'lightcyan', t('string_id_7'), {size: '14px'});
    return {
        update: function (itemId) {
            if (state.noteIndex[itemId]) {
                charTextBox.setText(state.noteIndex[itemId].char_mark);
                functionTextBox.setText(state.noteIndex[itemId].function);
                appearanceTextBox.setText(state.noteIndex[itemId].appearance);
                proximateCauseTextBox.setText(state.noteIndex[itemId].proximate_cause);
            }
        },
        clear: function () {
            charTextBox.setText('');
            functionTextBox.setText('');
            appearanceTextBox.setText('');
            proximateCauseTextBox.setText('');
        },
        endX: x + w + w0,
        endY: y + h * 4 + h0
    };
}

/** itemIndex is populated by now **/
function calculateConnections(state) {
    const model = getCittaModel();
    state.allCittas = [];
    let itemConnections = {};
    model.cittaGroups.forEach((modelGroup) => {
        const cittaGroup = modelGroup.raw;
        let groupAttrs = {
            cetasika: (cittas.cetasika || []).concat(cittaGroup.cetasika || []),
            category: cittaGroup.category || null,
            roots: cittaGroup.roots || [],
            functions: cittaGroup.functions || [],
            gates: cittaGroup.gates || [],
            objects: cittaGroup.objects || [],
            mental_objects: cittaGroup.mental_objects || [],
            object_time: cittaGroup.object_time || [],
            basis: cittaGroup.basis || null,
            realms: cittaGroup.realms || [],
            feeling: cittaGroup.feeling || null,
            cetasika_opt: (cittas.cetasika_opt || []).concat(cittaGroup.cetasika_opt || [])
        };

        // Loop through the data items and draw each row
        cittaGroup.children.forEach((item, index) => {
            function getIndex(def) {
                let idIndex = {};
                def.names.forEach((name, index) => {
                    idIndex[name] = def.index_base + index + 1;
                });
                return idIndex;
            }

            function addConnection(id, item_names, from_color, to_color, idIndex, params={reverse_color:false, opt:false}) {
                let reverse_color = params.reverse_color;
                if (!itemConnections[id]) {
                    itemConnections[id] = {'from_color': from_color, 'connection_groups': [], counter: 0, opt_counter: 0};
                }
                let ids = [];
                item_names.forEach(name => {
                    let fc = reverse_color ?  to_color : from_color;
                    let tc = reverse_color ?  from_color : to_color;
                    let to_id = idIndex[name];
                    ids.push(to_id);
                    if (!itemConnections[to_id]) {
                        itemConnections[to_id] = {'from_color': tc, 'connection_groups': [], counter: 0, opt_counter: 0};
                    }
                    let connectionGroup = itemConnections[to_id].connection_groups.find(group => group.to_color === fc);
                    if (connectionGroup) {
                        connectionGroup.ids.push(id);
                    } else {
                        itemConnections[to_id].connection_groups.push({'to_color': fc, 'ids': [id]});
                    }
                    if (params.opt) {
                        itemConnections[to_id].opt_counter++;
                    } else {
                        itemConnections[to_id].counter++;
                    }
                });
                itemConnections[id].connection_groups.push({'to_color':to_color, 'ids': ids});
                if (params.opt) {
                    itemConnections[id].opt_counter += ids.length;
                } else {
                    itemConnections[id].counter += ids.length;
                }
            }

            const item_cetasika = groupAttrs.cetasika.concat(item.cetasika || []);
            addConnection(item.id, item_cetasika, 'yellow', 'yellow', state.cetasikaIdIndex);
            const item_cetasika_opt = groupAttrs.cetasika_opt.concat(item.cetasika_opt || []);
            addConnection(item.id, item_cetasika_opt, 'yellow', 'lightyellow', state.cetasikaIdIndex, {reverse_color: true, opt: true});
            const item_category = item.category || groupAttrs.category || [];
            const item_roots = groupAttrs.roots.concat(item.roots || []);
            addConnection(item.id, item_roots, 'yellow', 'lavender', getIndex(causes));

            const item_functions = groupAttrs.functions.concat(item.functions || []);
            addConnection(item.id, item_functions, 'yellow', 'orange', getIndex(functions));

            const item_gates = groupAttrs.gates.concat(item.gates || []);
            addConnection(item.id, item_gates, 'yellow', 'pink', getIndex(gates));

            const item_objects = groupAttrs.objects.concat(item.objects || []);
            addConnection(item.id, item_objects, 'yellow', 'lightgreen', getIndex(objects));

            const item_mental_objects = groupAttrs.mental_objects.concat(item.mental_objects || []);
            addConnection(item.id, item_mental_objects, 'yellow', 'lightblue', getIndex(mental_objects));

            const item_object_time = groupAttrs.object_time.concat(item.object_time || []);
            addConnection(item.id, item_object_time, 'yellow', 'lavender', getIndex(times));

            const item_basis = item.basis || groupAttrs.basis ? [item.basis || groupAttrs.basis] : [];
            addConnection(item.id, item_basis, 'yellow', 'lightblue', getIndex(basis));

            const item_realms = groupAttrs.realms.concat(item.realms || []);
            addConnection(item.id, item_realms, 'yellow', 'violet', getIndex(realms));

            const item_feeling = item.feeling || groupAttrs.feeling ? [item.feeling || groupAttrs.feeling] : [];
            addConnection(item.id, item_feeling, 'yellow', 'tomato', getIndex(feelings));

            // overwrite.
            itemConnections[item.id].counter = item_cetasika.length;
            itemConnections[item.id].opt_counter = item_cetasika_opt.length;
            const item_name = item.name;
            const words = item_name.replace(/[,\\-]/g, ' ').split(' ');
            words.forEach(word => {
                if (state.itemIndex[word]) {
                    let idIndex = {};
                    idIndex[word] = word;
                    addConnection(item.id, [word], 'yellow', 'yellow', idIndex);
                }
            });
            state.registerId(item.id, item);
            state.subEffectIndex[item.id] = [...item_cetasika, ...item_cetasika_opt].map(e => state.cetasikaIdIndex[e]);
            state.allCittas.push({id: item.id, name: item.name, cetasika: item_cetasika, cetasika_opt: item_cetasika_opt, functions: item_functions});
        });
    });
    return itemConnections;
}

function setupHighlightsBehavior(cntt, ntt, state) {
    let locked = false;
    let lockedItem = null;
    let clearFunc = null;
    const itemGraph = calculateConnections(state);
    for (let itemId in itemGraph) {
        function highlightsConnections(connections) {
            function setHighlights(connections, clear=false) {
                let color = clear ? 'white' : connections.from_color
                state.itemIndex[itemId].setColor(color);
                if (!clear) {
                    cntt.update(connections.counter, connections.opt_counter);
                    ntt.update(itemId);
                }
                else {
                    cntt.clear();
                    ntt.clear();
                }
                connections.connection_groups.forEach(connection => {
                    connection.ids.forEach(id => {
                        let color = clear ? 'white' : connection.to_color;
                        state.itemIndex[id].setColor(color);
                    });
                });
            }
            setHighlights(connections);
            clearFunc = function() {
                setHighlights(connections, true);
            }
        }

        let connections = itemGraph[itemId];
        let item = state.itemIndex[itemId];
        item.on('mouseover', function(event, d) {
            if (locked) return;
            highlightsConnections(connections);
        })
        .on('mousemove', function(event) {
        })
        .on('mouseout', function() {
            if (locked) return;
            if (clearFunc) clearFunc();
        })
        .on('click', function() {
            if (locked && lockedItem === this) {
                locked = false;
                lockedItem = null;
                if (clearFunc) clearFunc();
            } else {
                if (locked && clearFunc) {
                    clearFunc();
                }
                locked = true;
                lockedItem = this;
                highlightsConnections(connections);
            }
        });
    }
}
