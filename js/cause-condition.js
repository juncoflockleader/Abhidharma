function renderCauseCondition(parent) {
    const cetasikaGridIndex = {};
    const namaCauseConditionIndex = {
        '名俱生组': {},
        '所缘组': {},
        '无间组': {},
        '色俱生组': {},
        '依处组': {},
        '自然亲依止组': {},
        '异业组': {}
    };
    const conditions = getConditions();
    function renderConditions(parent, x, y, nama=true) {
        const groups = {};
        conditions.children.forEach((condition, index) => {
            condition.children.forEach((child, index) => {
                if (!groups[child.group]) {
                    groups[child.group] = {};
                }
                if (!groups[child.group][condition.name]) {
                    groups[child.group][condition.name] = {
                        id: condition.id,
                        name: condition.name,
                        keywords: condition.keywords,
                        subGroups: {}
                    };
                }
                const causeEffect = child.cause + '→' + child.effect;
                if (!groups[child.group][condition.name].subGroups[causeEffect]) {
                    groups[child.group][condition.name].subGroups[causeEffect] = [child];
                } else {
                    groups[child.group][condition.name].subGroups[causeEffect].push(child);
                }
            });
        });
        const w = 160;
        const headerW = 20;
        const h = 15;
        const header = renderTextBox(parent, x, y, headerW, h, 'lightcyan', '组', {size: 12, wrap: true});
        const conditionHeader = renderTextBox(parent, header.endX, y, w, h, 'lightcyan', '缘', {size: 12, wrap: true});
        const causeHeader = renderTextBox(parent, conditionHeader.endX, y, w, h, 'lightcyan', '缘法', {size: 12, wrap: true});
        const effectHeader = renderTextBox(parent, causeHeader.endX, y, w, h, 'lightcyan', `缘所生法(${nama?'名聚':'色聚'})`, {size: 12, wrap: true});
        y = header.endY;
        Object.keys(groups).forEach((key, index) => {
            let rows = 0;
            const group = groups[key];
            let y0 = y;
            Object.keys(group).forEach((ck, index) => {
                let y1 = y;
                const condition = group[ck];
                const subGroups = condition.subGroups;
                const tall = nama && (condition.name === '俱生根缘' || condition.name === '道缘');
                const h0 = tall ? 36 : 15;
                // for each subgroup we only need to render one blank textbox to be filled dynamically
                // one observation is that, for each condition in each group, they only get picked once.
                Object.keys(subGroups).map((sk, index) => {
                    const subGroup = subGroups[sk];
                    subGroup.forEach((child, index) => {
                        if (nama !== (child.effect === '名')) {
                            return;
                        }
                        if (y > y1) {
                            return;
                        }
                        if (nama && child.rebirth) {
                            return;
                        }
                        const tb = renderTextBox(parent, causeHeader.X, y, w, h0, 'white', '', {
                            size: 12,
                            wrap: tall
                        });
                        const tb2 = renderTextBox(parent, effectHeader.X, y, w, h0, 'white', '', {
                            size: 12,
                            wrap: false
                        });
                        if (nama) {
                            namaCauseConditionIndex[key][ck] = [tb, tb2];
                        }
                        rows++;
                        y = tb.endY;
                    });
                });

                if (y > y1) {
                    const t1 = renderTextBox(parent, conditionHeader.X, y1, w, y - y1, 'lightcyan', condition.name, {
                        size: 12,
                        wrap: true
                    });
                }
            });

            if (y > y0) {
                let hw = headerW + (Math.ceil(key.length / rows) - 1) * 12;
                let text = key;
                let wrap = true;
                if (rows === 1 && hw * 2 > (headerW + w)) {
                    text = key.substring(0, 2) + '..';
                    hw = headerW + 12*2;
                    wrap = false;
                }
                const header = renderTextBox(parent, x, y0, hw, y - y0, 'lightcyan', text, {
                    size: 12,
                    wrap: wrap
                });
            }
        });
        return {X: x, Y: y, endX: effectHeader.endX, endY: y};

    }

    function renderCetasikaGrid(parent, x, y) {
        let x0 = x;
        let y0 = y;
        const h = 23;
        const w = 65;
        const header = renderTextBox(parent, x0, y0, w * 4, h, 'lightcyan', '心所', {size: 12, wrap: true});
        y0 = header.endY;
        let col = 0;
        allCetasika.forEach((cetasika, index) => {
            const tb = renderTextBox(parent, x0, y0, w, h, 'white', cetasika.name, {
                size: 12,
                wrap: true
            });
            cetasikaGridIndex[cetasika.id] = tb;
            y0 += h;
            if (index % 13 === 12) {
                x0 = tb.endX;
                y0 = header.endY;
                col++;
            }
        });
        return {X: x, Y: y, endX: x0, endY: y0};
    }

    function renderCounter(parent, x, y, text) {
        const tb = renderTextBox(parent, x, y, 60, 15, 'lightcyan', text, {size: 12, wrap: true});
        return renderTextBox(parent, x, tb.endY, 60, 15, 'white', '', {size: 12, wrap: true});
    }

    const senseFlowData = {
        name: '五门心路',
        obj: '现在色所缘',
        rupa_obj: '现在色所缘',
        great_obj: null,
        cittas: [
            {
                name: '五门转向',
                instances: [
                    {
                        id: 1,
                        alias: '五门转向',
                        citta: 52,
                        funct: '五门转向',
                        prev_funct: '有分断'
                    }
                ],
            },
            {
                name: '眼识',
                instances: [
                    {
                        id: 2,
                        alias: '不善果报',
                        citta: 29,
                        funct: '五识',
                        prev_funct: '五门转向'
                    },
                    {
                        id: 3,
                        alias: '善果报',
                        citta: 36,
                        funct: '五识',
                        prev_funct: '五门转向'
                    }
                ],
            },
            {
                name: '领受',
                instances: [
                    {
                        id: 4,
                        alias: '善果报',
                        citta: 34,
                        funct: '领受',
                        prev_funct: '五识'
                    },
                    {
                        id: 5,
                        alias: '不善果报',
                        citta: 41,
                        funct: '领受',
                        prev_funct: '五识'
                    }
                ],
            },
            {
                name: '推度',
                instances: [
                    {
                        id: 6,
                        alias: '不善舍俱',
                        citta: 35,
                        funct: '推度',
                        prev_funct: '领受'
                    },
                    {
                        id: 7,
                        alias: '善舍俱',
                        citta: 42,
                        funct: '推度',
                        prev_funct: '领受'
                    },
                    {
                        id: 8,
                        alias: '善悦俱',
                        citta: 43,
                        funct: '推度',
                        prev_funct: '领受'
                    },
                ],
            },
            {
                name: '确定',
                instances: [
                    {
                        id: 9,
                        alias: '意门转向',
                        citta: 53,
                        funct: '推度',
                        prev_funct: '推度'
                    }
                ]
            },
            {
                name: '第1速行',
                wide: true,
                instances: []
            },
            {
                name: '2-7速行',
                wide: true,
                instances: []
            },
            {
                name: '第1彼所缘',
                wide: true,
                instances: []
            },
            {
                name: '第2彼所缘',
                wide: true,
                instances: []
            },
        ],
    };
    let id = 10;
    const impulseCittas1st = [];
    Builder.getVariable('欲界速行心').forEach((citta, index) => {
        impulseCittas1st.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
            funct: '速行',
            prev_funct: '确定'
        });
    });
    senseFlowData.cittas[5].instances = impulseCittas1st;
    const impulseCittas2nd = [];
    Builder.getVariable('欲界速行心').forEach((citta, index) => {
        impulseCittas2nd.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
            funct: '速行',
            prev_funct: '速行'
        });
    });
    senseFlowData.cittas[6].instances = impulseCittas2nd;
    const recallCittas1st = [];
    Builder.getVariable('彼所缘心').forEach((citta, index) => {
        recallCittas1st.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
            funct: '彼所缘',
            prev_funct: '速行'
        });
    });
    senseFlowData.cittas[7].instances = recallCittas1st;
    const recallCittas2nd = [];
    Builder.getVariable('彼所缘心').forEach((citta, index) => {
        recallCittas2nd.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
            funct: '彼所缘',
            prev_funct: '彼所缘'
        });
    });
    senseFlowData.cittas[8].instances = recallCittas2nd;


    const mindFlowData = {

    };

    let locked = null;
    let highlighted = [];
    let textSet = [];
    function renderFlow(parent, x, y, flowData, counterCell, conditionCntCell) {
        const flow = parent.append('g')
            .attr('transform', `translate(${x}, ${y})`);
        const w = 60;
        const h = 20;
        let x0 = 0;
        let y0 = 0;
        let x1 = 0;
        const rowLimit = 23;
        let rowCount = 0;
        //const header = renderTextBox(flow, x0, y0, w, h, 'lightcyan', flowData.name, {size: 12, wrap: true});
        //x0 = header.endX;
        flowData.cittas.forEach((node, index, arr) => {
            if (!node.instances) {
                return;
            }
            if (index === 0 || rowCount === 0 || rowCount + node.instances.length <= rowLimit) {
                x0 = x1;
            } else {
                rowCount = 0;
                x1 = x0;
                y0 = y;
            }
            rowCount += node.instances.length;
            const w0 = node.wide ? w * 2 : w;
            const colHeader = renderTextBox(flow, x0, y0, w0, h, 'lightcyan', node.name, {size: 12, wrap: true});
            y0 = colHeader.endY;
            node.instances.forEach((data, index) => {
                const tb = renderTextBox(flow, x0, y0, w0, h, 'white', data.alias, {
                    size: 12,
                    wrap: true
                });

                function highlight() {
                    tb.highlight();
                    highlighted.push(tb);
                    const cetasikas = subEffectIndex[data.citta]
                    cetasikas.forEach((cetasika, index) => {
                        cetasikaGridIndex[cetasika].highlight();
                        highlighted.push(cetasikaGridIndex[cetasika]);
                    });
                    const causeConditions = causeConditionWithNamaEffect({
                        id: data.id,
                        name: data.alias,
                        obj: flowData.obj,
                        citta: data.citta,
                        cetasikas: cetasikas,
                        funct: data.funct,
                        rupa_obj: flowData.rupa_obj,
                        prev_funct: data.prev_funct
                    });
                    let count = 0;
                    Object.keys(causeConditions).forEach((groupKey, index) => {
                        const group = causeConditions[groupKey];
                        Object.keys(group).forEach((conditionKey, index) => {
                            const condition = group[conditionKey];
                            const tbs = namaCauseConditionIndex[groupKey][conditionKey];
                            tbs[0].setText(condition.causeSummary);
                            tbs[1].setText(condition.effectSummary);
                            textSet.push(tbs[0]);
                            textSet.push(tbs[1]);
                            if (condition.causeSummary !== '-') {
                                count++;
                            }
                        });
                    });
                    counterCell.setText((cetasikas.length+1).toString());
                    conditionCntCell.setText(count.toString());
                }

                function clear() {
                    highlighted.forEach((tb, index) => {
                        tb.clear();
                    });
                    textSet.forEach((tb, index) => {
                        tb.setText('');
                    });
                    counterCell.setText('');
                    conditionCntCell.setText('');
                    highlighted = [];
                    textSet = [];
                }

                tb.on('mouseover', function (event, d) {
                    if (locked) return;
                    highlight();
                })
                .on('mousemove', function (event) {
                })
                .on('mouseout', function () {
                    if (locked) return;
                    clear();
                })
                .on('click', function () {
                    if (locked) {
                        clear();
                    }
                    if (locked === tb) {
                        locked = null;
                    } else {
                        locked = tb;
                        highlight();
                    }
                });
                y0 = tb.endY;
            });
            x0 = colHeader.endX;
        });
    }

    const namaConditons = renderConditions(parent, 0, 0, true);
    //const rupaConditions = renderConditions(parent, namaConditons.endX + 20, 0, false);
    const rupaConditions = renderTextBox(parent, namaConditons.endX + 20, 0, 160, 15, 'lavender', '色法部分请参考《表解》', {size: 12, wrap: true});
    const cg = renderCetasikaGrid(parent, namaConditons.endX + 20, rupaConditions.endY + 20);
    const counterCell = renderCounter(parent, cg.endX + 20, cg.Y, '名法数量');
    const conditionCntCell = renderCounter(parent, cg.endX + 20, counterCell.endY, '缘力数量');
    const flowGroup = parent.append('g');
    renderFlow(flowGroup, conditionCntCell.endX + 20, 0, senseFlowData, counterCell, conditionCntCell);
}