function renderCauseCondition(parent) {
    const flowGroup = parent.append('g');
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
        const w = 200;
        const w1 = 160
        const headerW = 20;
        const h = 15;
        const header = renderTextBox(parent, x, y, headerW, h, 'lightcyan', '组', {size: 12, wrap: true});
        const conditionHeader = renderTextBox(parent, header.endX, y, w, h, 'lightcyan', '缘', {size: 12, wrap: true});
        const causeHeader = renderTextBox(parent, conditionHeader.endX, y, w, h, 'lightcyan', '缘法', {size: 12, wrap: true});
        const effectHeader = renderTextBox(parent, causeHeader.endX, y, w1, h, 'lightcyan', `缘所生法(${nama?'名聚':'色聚'})`, {size: 12, wrap: true});
        y = header.endY;
        Object.keys(groups).forEach((key, index) => {
            let rows = 0;
            const group = groups[key];
            let y0 = y;
            Object.keys(group).forEach((ck, index) => {
                let y1 = y;
                const condition = group[ck];
                const subGroups = condition.subGroups;
                const h0 = 15;
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
                            wrap: false
                        });
                        const tb2 = renderTextBox(parent, effectHeader.X, y, w1, h0, 'white', '', {
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
        return {X: header.X, Y: header.Y, endX: header.endX, endY: header.endY + h * 13};
    }

    function renderCounter(parent, x, y, text) {
        const tb1 = renderTextBox(parent, x, y, 60, 15, 'lightcyan', text, {size: 12, wrap: true});
        const tb2 = renderTextBox(parent, x, tb1.endY, 60, 15, 'white', '', {size: 12, wrap: true});
        return {
            X: x,
            Y: y,
            endX: tb2.endX,
            endY: tb2.endY,
            setText: function (text) {
                tb2.setText(text);
            }
        };
    }

    const senseFlowData = {
        name: '五门心路',
        obj: '现在色所缘',
        rupa_obj: '现在色所缘',
        legend: false,
        cittas: [
            {
                name: '五门转向',
                funct: '五门转向',
                prev_funct: '有分断',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                instances: [
                    {
                        id: 1,
                        alias: '五门转向',
                        citta: 52,
                    }
                ],
            },
            {
                name: '眼识',
                funct: '五识',
                prev_funct: '五门转向',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                instances: [
                    {
                        id: 2,
                        alias: '不善果报',
                        citta: 29,
                    },
                    {
                        id: 3,
                        alias: '善果报',
                        citta: 36,
                    }
                ],
            },
            {
                name: '领受',
                funct: '领受',
                prev_funct: '五识',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                instances: [
                    {
                        id: 4,
                        alias: '善果报',
                        citta: 34,
                    },
                    {
                        id: 5,
                        alias: '不善果报',
                        citta: 41,
                    }
                ],
            },
            {
                name: '推度',
                funct: '推度',
                prev_funct: '领受',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                instances: [
                    {
                        id: 6,
                        alias: '不善舍俱',
                        citta: 35,
                    },
                    {
                        id: 7,
                        alias: '善舍俱',
                        citta: 42,
                    },
                    {
                        id: 8,
                        alias: '善悦俱',
                        citta: 43,
                    },
                ],
            },
            {
                name: '确定',
                funct: '确定',
                prev_funct: '推度',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                instances: [
                    {
                        id: 9,
                        alias: '意门转向',
                        citta: 53,
                    }
                ]
            },
            {
                name: '第1速行',
                funct: '速行',
                prev_funct: '确定',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                wide: true,
                instances: []
            },
            {
                name: '2-7速行',
                funct: '速行',
                prev_funct: '速行',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                wide: true,
                instances: []
            },
            {
                name: '第1彼所缘',
                funct: '彼所缘',
                prev_funct: '速行',
                objs: {
                    '所缘前生组': '现在完成色',
                },
                wide: true,
                instances: []
            },
            {
                name: '第2彼所缘',
                funct: '彼所缘',
                prev_funct: '彼所缘',
                objs: {
                    '所缘前生组': '现在完成色',
                },
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
            citta: citta
        });
    });
    senseFlowData.cittas[5].instances = impulseCittas1st;
    const impulseCittas2nd = [];
    Builder.getVariable('欲界速行心').forEach((citta, index) => {
        impulseCittas2nd.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
        });
    });
    senseFlowData.cittas[6].instances = impulseCittas2nd;
    const recallCittas1st = [];
    Builder.getVariable('彼所缘心').forEach((citta, index) => {
        recallCittas1st.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
        });
    });
    senseFlowData.cittas[7].instances = recallCittas1st;
    const recallCittas2nd = [];
    Builder.getVariable('彼所缘心').forEach((citta, index) => {
        recallCittas2nd.push({
            id: id++,
            alias: idIndex[citta].name,
            citta: citta,
        });
    });
    senseFlowData.cittas[8].instances = recallCittas2nd;

    // 普通所缘: (名色涅槃-现在完成色) 所缘缘
    // 所缘前生组: (现在完成色) 所缘缘+所缘前生有缘+所缘前生有缘+所缘前生不离去缘
    // 依处所缘前生组: (心色) 所缘缘+依处所缘前生缘+依处所缘前生依止缘+依处所缘前生不相应缘+依处所缘前生有缘+依处所缘前生不离去缘
    // 所缘增上（贪速): (执取的普通所缘) 所缘缘+所缘增上缘+所缘亲依止缘
    // 所缘前生增上: (执取的现在完成色) 所缘缘+所缘增上缘+所缘亲依止缘+所缘前生有缘+所缘前生有缘+所缘前生不离去缘 (6)
    // 依处所缘前生增上: (执取的心色) 所缘缘+依处所缘前生缘+依处所缘前生依止缘+依处所缘前生不相应缘+依处所缘前生有缘+依处所缘前生不离去缘+所缘增上缘+所缘亲依止缘 (8)
    const objMapping = {
        '普通所缘': {
            name: '普通所缘',
            color: 'red',
            conditions: ['所缘缘']
        },
        '所缘前生组': {
            name: '所缘前生组',
            color: 'orange',
            conditions: ['所缘缘', '所缘前生缘', '所缘前生有缘', '所缘前生不离去缘']
        },
        '依处所缘前生组': {
            name: '依处所缘前生组',
            color: 'yellow',
            conditions: ['所缘缘', '依处所缘前生缘', '依处所缘前生依止缘', '依处所缘前生不相应缘', '依处所缘前生有缘', '依处所缘前生不离去缘']
        },
        '所缘增上组': {
            name: '所缘增上组',
            color: 'green',
            conditions: ['所缘缘', '所缘增上缘', '所缘亲依止缘']
        },
        '所缘前生增上组': {
            name: '所缘前生增上组',
            color: 'blue',
            conditions: ['所缘缘', '所缘增上缘', '所缘亲依止缘', '所缘前生缘', '所缘前生有缘', '所缘前生不离去缘']
        },
        '依处所缘前生增上组': {
            name: '依处所缘前生增上组',
            color: 'purple',
            conditions: ['所缘缘', '依处所缘前生缘', '依处所缘前生依止缘', '依处所缘前生不相应缘', '依处所缘前生有缘', '依处所缘前生不离去缘', '所缘增上缘', '所缘亲依止缘']
        }
    };
    senseFlowData.cittas.forEach((citta, index) => {
        citta.objConditionIndex = {};
        Object.keys(citta.objs).forEach((objKey, index) => {
            const obj = objMapping[objKey];
            obj.conditions.forEach((condition, index) => {
                if (!citta.objConditionIndex[condition]) {
                    citta.objConditionIndex[condition] = {};
                }
                citta.objConditionIndex[condition][objKey] = true;
            });
        });
    });

    const mindFlowData = {
        name: '意门心路',
        obj: '所缘',
        rupa_obj: '所缘',
        legend: true,
        cittas: [
            {
                name: '意门转向',
                funct: '意门转向',
                prev_funct: '有分断',
                wide: true,
                objs: {
                    '普通所缘': '名色概涅-现在完成色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                    {
                        id: 1001,
                        alias: '意门转向',
                        citta: 53,
                    }
                ],
            },
            {
                name: '第1贪速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                    '所缘前生增上组': '非常执取的现在完成色',
                    '依处所缘前生增上组': '非常执取的心色',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '第1嗔速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '第1痴速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '第1二因善速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '第1三因善速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '第1二因唯作速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '第1三因唯作速行',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '阿罗汉道心,果心,涅槃',
                },
                great_obj: '阿罗汉道心,果心,涅槃',
                instances: [
                ],
            },
            {
                name: '第1生笑心',
                funct: '速行',
                prev_funct: '意门转向',
                wide: true,
                objs: {
                    '普通所缘': '欲界三时-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '2-7贪速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                    '所缘前生增上组': '非常执取的现在完成色',
                    '依处所缘前生增上组': '非常执取的心色',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '2-7嗔速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '2-7痴速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '2-7二因善速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '2-7三因善速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '2-7二因唯作速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色-出世间',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '非常执取的普通所缘',
                },
                great_obj: '非常执取的现在完成色',
                instances: [
                ],
            },
            {
                name: '2-7三因唯作速行',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '名色概-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                    '所缘增上组': '阿罗汉道心,果心,涅槃',
                },
                great_obj: '阿罗汉道心,果心,涅槃',
                instances: [
                ],
            },
            {
                name: '2-7生笑心',
                funct: '速行',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '欲界三时-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '二因彼所缘',
                funct: '彼所缘',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '欲界三时-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '三因彼所缘',
                funct: '彼所缘',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '欲界三时-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            },
            {
                name: '无因彼所缘',
                funct: '彼所缘',
                prev_funct: '速行',
                wide: true,
                objs: {
                    '普通所缘': '欲界三时-现色',
                    '所缘前生组': '现在完成色',
                    '依处所缘前生组': '心色',
                },
                instances: [
                ],
            }
        ]
    };
    mindFlowData.cittas.forEach((citta, index) => {
        citta.objConditionIndex = {};
        Object.keys(citta.objs).forEach((objKey, index) => {
            const obj = objMapping[objKey];
            obj.conditions.forEach((condition, index) => {
                if (!citta.objConditionIndex[condition]) {
                    citta.objConditionIndex[condition] = {};
                }
                citta.objConditionIndex[condition][objKey] = true;
            });
        });
    });
    id = 1002;
    let cittaIdx = 1;
    function addInstances(cittaIdx, variableName) {
        let instances = mindFlowData.cittas[cittaIdx].instances;
        Builder.getVariable(variableName).forEach((citta, index) => {
            instances.push({
                id: id++,
                alias: idIndex[citta].name,
                citta: citta,
            });
        });
    }
    for (let i = 0; i < 2; ++i) {
        addInstances(cittaIdx++, '贪根心');
        addInstances(cittaIdx++, '嗔根心');
        addInstances(cittaIdx++, '痴根心');
        addInstances(cittaIdx++, '2因善心');
        addInstances(cittaIdx++, '3因善心');
        addInstances(cittaIdx++, '智相应8大唯作心');
        addInstances(cittaIdx++, '智不相应8大唯作心');
        addInstances(cittaIdx++, '生笑心');
    }
    addInstances(cittaIdx++, '二因彼所缘心');
    addInstances(cittaIdx++, '三因彼所缘心');
    addInstances(cittaIdx++, '无因彼所缘心');



    const state = {
        type: 'sense',
    };
    let locked = null;
    let highlighted = [];
    let textSet = [];
    let markSet = [];
    function clearLegend(parent) {
        parent.selectAll('.obj-legend').remove();
    }
    function clear(counterCell, conditionCntCell) {
        highlighted.forEach((tb, index) => {
            tb.clear();
        });
        textSet.forEach((tb, index) => {
            tb.setText('');
        });
        markSet.forEach((tb, index) => {
            tb.clearMarks();
        });
        counterCell.setText('');
        conditionCntCell.setText('');
        highlighted = [];
        textSet = [];
        clearLegend(flowGroup); // TODO: well it's quite a hack
    }
    function renderLegend(parent, x, y, objs, baseCnt, countsMap) {
        parent.selectAll('.obj-legend').remove();
        const legend = parent.append('g')
            .attr('class', 'obj-legend')
            .attr('transform', `translate(${x}, ${y})`);
        const w = 15;
        const h = 15;
        const conditionW = 120;
        const groupW = 85;
        const cntW = 40;
        renderCell(legend, 0, 0, w, h, 'lightcyan');
        renderTextBox(legend, w, 0, conditionW, h, 'lightcyan', '所缘缘法', {size: 12, wrap: false});
        renderTextBox(legend, w + conditionW, 0, groupW, h, 'lightcyan', '所缘组', {size: 12, wrap: false});
        renderTextBox(legend, w + conditionW + groupW, 0, cntW, h, 'lightcyan', '总数', {size: 12, wrap: false});
        Object.keys(objs).forEach((obj, index) => {
            const i = index + 1;
            const color = objMapping[obj].color;
            renderCell(legend, 0, i * h, w, h, 'white');
            renderCircle(legend, h / 2, i * h + h / 2, h / 2 - 2, color);
            renderTextBox(legend, w, i * h, conditionW, h, 'white', objs[obj], {size: 12, wrap: false});
            renderTextBox(legend, w + conditionW, i * h, groupW, h, 'white', obj, {size: 12, wrap: false});
            renderTextBox(legend, w + conditionW + groupW, i * h, cntW, h, 'white', baseCnt + countsMap[obj], {size: 12, wrap: false});
        });
    }
    function renderFlow(parent, x, y, counterCell, conditionCntCell, state) {
        parent.selectAll('*').remove();
        const flowData = state.type === 'sense' ? senseFlowData : mindFlowData;
        const flow = parent.append('g')
            .attr('transform', `translate(${x}, ${y})`);
        const w = 60;
        const h = 20;
        let x0 = 0;
        let y0 = 0;
        let x1 = 0;
        const rowLimit = 35;
        let rowCount = 0;
        flowData.cittas.forEach((node, index, arr) => {
            if (!node.instances) {
                return;
            }
            if (index === 0 || rowCount === 0 || rowCount + (node.instances.length + 1) <= rowLimit) {
                x0 = x1;
            } else {
                rowCount = 0;
                x1 = x0;
                y0 = y;
            }
            rowCount += node.instances.length + 1;
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
                        obj_condition_index: node.objConditionIndex || {},
                        citta: data.citta,
                        cetasikas: cetasikas,
                        great_obj: node.great_obj,
                        funct: node.funct,
                        rupa_obj: flowData.rupa_obj,
                        prev_funct: node.prev_funct
                    });
                    let count = 0;
                    let baseCount = 0;
                    let countsMap = {};
                    Object.keys(causeConditions).forEach((groupKey, index) => {
                        const group = causeConditions[groupKey];
                        Object.keys(group).forEach((conditionKey, index) => {
                            const condition = group[conditionKey];
                            const tbs = namaCauseConditionIndex[groupKey][conditionKey];
                            tbs[0].setText(condition.causeSummary);
                            tbs[1].setText(condition.effectSummary);
                            textSet.push(tbs[0]);
                            textSet.push(tbs[1]);
                            if (flowData.legend) {
                                if (node.objConditionIndex[conditionKey]) {
                                    Object.keys(node.objConditionIndex[conditionKey]).forEach((obj, index) => {
                                        const color = objMapping[obj].color;
                                        tbs[0].mark(color);
                                        countsMap[obj] = countsMap[obj] || 0;
                                        countsMap[obj]++;
                                    });
                                    markSet.push(tbs[0]);
                                } else if (condition.causeSummary !== '-') {
                                    baseCount++;
                                }
                            }
                            if (condition.causeSummary !== '-') {
                                count++;
                            }
                        });
                    });
                    counterCell.setText((cetasikas.length+1).toString());
                    conditionCntCell.setText(count.toString());
                    if (flowData.legend) {
                        renderLegend(parent, counterCell.X, counterCell.endY + 20, node.objs, baseCount, countsMap);
                    }
                }

                tb.on('mouseover', function (event, d) {
                    if (locked) return;
                    highlight();
                })
                .on('mousemove', function (event) {
                })
                .on('mouseout', function () {
                    if (locked) return;
                    clear(counterCell, conditionCntCell);
                })
                .on('click', function () {
                    clear(counterCell, conditionCntCell);
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
    const counterCell = renderCounter(parent, cg.X, cg.endY + 20, '名法数量');
    const conditionCntCell = renderCounter(parent, counterCell.endX + 20, counterCell.Y, '缘力数量');
    const controlsContainer = d3.select('#causeconditioncontrols')
        .style('display', 'flex')
        .style('gap', '20px') // Add space between the groups
        .style('align-items', 'flex-start, stretch'); // Align items to the top

    function renderFlowSelectButtonGroup() {
        renderButtonGroup(controlsContainer, [{ 'id': 1, 'name': '五门心路' }, { 'id': 2, 'name': '意门心路' }], '心路类型', state, (state, data) => {
            state.type = data.id === 1 ? 'sense' : 'mind';
            clear(counterCell, conditionCntCell);
            locked = null;
        }, (function () {
            return function (state) {
                return renderFlow(flowGroup, cg.endX + 20, 0, counterCell, conditionCntCell, state);
            }
        })());
    }
    renderFlowSelectButtonGroup();
    renderFlow(flowGroup, cg.endX + 20, 0, counterCell, conditionCntCell, state);
}
