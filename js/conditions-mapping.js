function renderConditionsMapping(parent) {
    function render89Cittas(x, y, itemIndex) {
        const indexes = [[0, 1, 2, 5, 3, 12], [7, 10, 13, 9, 8, 11, 14, 6, 4]];
        indexes.forEach((col, colIndex) => {
            const w = colIndex === 0 ? 110 : 80;
            col.forEach((index, rowIndex) => {
                const data = cittas.children[index].children;
                const h = data.length * 15 + 20;
                const t = renderVerticalTable(parent, x, y, w, h, cittas.children[index].name, data, 1, itemIndex, true, 'lightcyan');
                if (rowIndex + 1 === Math.ceil(col.length / 2)) {
                    y = svgHeight / 2;
                } else {
                    y = t.endY;
                }
            });
            x += w * 1.3;
            y = 0;
        });
        return {
            endX: x,
            endY: y
        }
    }

    function render52Cetasikas(x, y, itemIndex) {
        cetasika.children.forEach((groups, index) => {
            groups.children.forEach((group, groupIndex) => {
               const t = renderVerticalTable(parent, x, y, 100, group.length * 15 + 20, group.name, group.children, 1, itemIndex, true, 'orange');
               y = t.endY;
            });
        });

        return {
            endX: x,
            endY: y
        }
    }

    function render28Rupas(x, y, itemIndex) {
        rupa.children.forEach((groups, index) => {
            groups.children.forEach((group, groupIndex) => {
                if (index === 1 && groupIndex === 5) {
                    x += 80;
                    y = 0;
                }
                const t = renderVerticalTable(parent, x, y, 50, group.length * 15 + 20, group.name, group.children.filter(c => c.id > 0), 1, itemIndex, true, 'lightblue');
                y = t.endY;
            });
        });
        return {
            endX: x + 50,
            endY: y
        }
    }

    function render23RupaAggs(x, y, itemIndex) {
        rupaAgg.children.forEach((groups, index) => {
            if (index === 5) {
                x += 80;
                y = 0;
            }
            const t = renderVerticalTable(parent, x, y, 130, groups.length * 15 + 20, groups.name, groups.children, 1, itemIndex, true, 'lightgreen');
            y = t.endY;
        });
        return {
            endX: x + 130,
            endY: y
        }
    }

    function renderExtras(x, y, itemIndex) {
        const nibana = renderTextBox(parent, x, y, 50, 15, 'white', '涅槃', {size: 10, wrap: true});
        const concept = renderTextBox(parent, x, nibana.endY + 10, 50, 15, 'white', '概念', {size: 10, wrap: true});
        itemIndex[0] = nibana;
        itemIndex[-1] = concept;
        return {
            endX: concept.endX,
            endY: concept.endY
        }
    }

    function renderHub(parent, x, y) {
        const markerName = 'conditions-mapping-arrowhead';
        setupArrowHead(parent, markerName);
        const timeSummary = renderTextBox(parent, x, y - 120, 100, 18, 'white', '', {size: 15, wrap: true});
        const causeSummary = renderTextBox(parent, x, y, 100, 18, 'white', '', {size: 15, wrap: true});
        const conditionSummary = renderTextBox(parent, x, y + 30, 100, 18, 'white', '', {size: 15, wrap: true});
        const effectSummary = renderTextBox(parent, x, y + 60, 100, 18, 'white', '', {size: 15, wrap: true});
        const noteSummary = renderTextBox(parent, x- 20, y + 120, 140, 52, 'white', '', {size: 12, wrap: true});
        connect(parent, causeSummary.endX - 50, causeSummary.endY, conditionSummary.endX - 50, conditionSummary.endY - 18, markerName);
        connect(parent, conditionSummary.endX - 50, conditionSummary.endY, effectSummary.endX - 50, effectSummary.endY - 18, markerName);
        return {
            setSummary: function (cause, condition, effect, note, time) {
                causeSummary.setText(cause);
                conditionSummary.setText(condition);
                effectSummary.setText(effect);
                noteSummary.setText(note);
                timeSummary.setText(time);
            },
            clear: function () {
                causeSummary.setText('');
                conditionSummary.setText('');
                effectSummary.setText('');
                noteSummary.setText('');
                timeSummary.setText('');
            },
            X: x,
            Y: y,
            endX: effectSummary.endX,
            endY: effectSummary.endY
        }
    }

    let locked = null;
    let highlighted = [];
    let conditions = null;
    function renderConditions(parent, x, y, hub, causeIndex, effectIndex, keywordsIndex) {
        const groups = {};
        if (!conditions) {
            conditions = getConditions();
        }
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
                        children: []
                    };
                }
                groups[child.group][condition.name].children.push(child);
            });
        });
        const w = 120;
        const headerW = 20
        const header = renderTextBox(parent, x, y, headerW, 15, 'lightcyan', '组', {size: 12, wrap: true});
        const t = renderTextBox(parent, x + headerW, y, w, 15, 'lightcyan', '缘', {size: 12, wrap: true});
        renderTextBox(parent, t.endX, y, w + 20, 15, 'lightcyan', '缘法→缘生法', {size: 12, wrap: true});
        renderTextBox(parent, x + w + headerW + w + 20, y, 160, 15, 'lightcyan', '缘法', {size: 12, wrap: true});
        y = t.endY;
        let counter = 0;
        Object.keys(groups).forEach((key, index) => {
            const group = groups[key];
            let y0 = y;
            Object.keys(group).forEach((ck, index) => {
                let y1 = y;
                const condition = group[ck];
                condition.children.forEach((child, subIndex) => {
                    if (!child.causes) {
                        return;
                    }
                    const t = renderTextBox(parent, x + w + headerW, y, w + 20, 15, counter % 2 === 0 ? 'lavender' : 'lightpink', child.cause + '→' + child.effect, {size: 12, wrap: true});
                    let x0 = x + w + headerW + 20 + w;
                    child.causes.forEach((cause, index) => {
                        const tb = renderTextBox(parent, x0, y, 160 / child.causes.length, 15, 'white', cause, {size: 12, wrap: true});
                        x0 = tb.endX;
                        function highlight() {
                            tb.highlight();
                            highlighted.push(tb);
                            if (condition.keywords) {
                                condition.keywords.forEach(
                                    (keyword, index) => {
                                        keywordsIndex[keyword].highlight();
                                        highlighted.push(keywordsIndex[keyword]);
                                    }
                                );
                            }
                            hub.setSummary(cause, condition.name, child.effectSummary, child.note, child.rebirth ? '结生' : '生命中');
                            const expandedCauses = child.expand(cause);

                            // Connect causes to the hub
                            if (expandedCauses.length === 1) {
                                expandedCauses[0].forEach((expandedCause, index) => {
                                    causeIndex[expandedCause].highlight();
                                    highlighted.push(causeIndex[expandedCause]);
                                    createElbowConnector(parent, causeIndex[expandedCause].endX, causeIndex[expandedCause].endY - 5, hub.X, hub.Y + 9, 10);
                                });
                            } else if (expandedCauses.length > 1) {
                                const itemGroup = parent.append('g')
                                    .attr('class', 'expanded-cause-group');
                                const colors = ['red', 'orange', 'brown', 'green', 'cyan', 'blue', 'purple'];
                                expandedCauses.forEach((expandedCause, i) => {
                                    const color = colors[i % colors.length];
                                    const cw = 10;
                                    const ch = 10;
                                    const cell = renderCell(itemGroup, hub.X - cw - 5, hub.Y + ch * i, cw, ch, color);
                                    createElbowConnector(parent, cell.endX, cell.endY - ch / 2, hub.X, hub.Y + 9, 2);
                                    expandedCause.forEach((c, j) => {
                                        causeIndex[c].highlight();
                                        highlighted.push(causeIndex[c]);
                                        createElbowConnector(parent, causeIndex[c].endX, causeIndex[c].endY - 5, cell.X, cell.Y + ch / 2, i*5+5, color);
                                    });
                                });
                            }

                            function addSubEffects(effect, set) {
                                function addToSet(arr, s) {
                                    arr.forEach((c, index) => {
                                        s.add(c);
                                    });
                                }
                                function removeFromSet(arr, s) {
                                    arr.forEach((c, index) => {
                                        s.delete(c);
                                    });
                                }
                                if (effect > 0 && effect < 100) {
                                    addToSet(subEffectIndex[effect], set);
                                }
                                if (effect > 9300 && effect < 9400) {
                                    addToSet(rupasSubEffects[effect], set);
                                }
                                if (child.suppressed) {
                                    removeFromSet(child.suppressed, set);
                                }
                            }

                            const subEffects = new Set();
                            const itemGroup = parent.append('g')
                                .attr('class', 'expanded-effect-group');
                            expandedCauses.forEach((expandedCause, index) => {
                                const expandedEffects = child.effects(expandedCause);
                                expandedEffects.forEach((expandedEffect, index) => {
                                    effectIndex[expandedEffect].highlight();
                                    addSubEffects(expandedEffect, subEffects);
                                    highlighted.push(effectIndex[expandedEffect]);
                                    createElbowConnector(itemGroup, effectIndex[expandedEffect].X, effectIndex[expandedEffect].Y + 5, hub.endX, hub.endY - 9, -10);
                                });
                            });
                            subEffects.forEach((effect, index) => {
                                effectIndex[effect].highlight();
                                highlighted.push(effectIndex[effect]);
                            });

                        }
                        function clear() {
                            hub.clear();
                            removeAllConnectors(parent);
                            highlighted.forEach((c, index) => {
                                c.clear();
                            });
                            highlighted = [];
                            parent.selectAll('.expanded-cause-group').remove();
                            parent.selectAll('.expanded-effect-group').remove();
                        }
                        tb.on('mouseover', function(event, d) {
                            if (locked) return;
                            highlight();
                        })
                        .on('mousemove', function(event) {
                        })
                        .on('mouseout', function() {
                            if (locked) return;
                            clear();
                        })
                        .on('click', function() {
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
                    });
                    y = t.endY;
                });
                const t1 = renderTextBox(parent, x + headerW, y1, w, y - y1, 'lightcyan', condition.name, {size: 12, wrap: true});
                counter++;
            });
            if (key === '自然亲依止组') { // text box is too small
                renderTextBox(parent, x - 80 + headerW, y0, 80, y - y0, 'lightcyan', key, {size: 12, wrap: true});
            } else if (key === '色命根组') {
                renderTextBox(parent, x - 80 + headerW, y0, 80, y - y0, 'lightcyan', key, {size: 12, wrap: true});
            } else {
                const header = renderTextBox(parent, x, y0, headerW, y - y0, 'lightcyan', key, {size: 12, wrap: true});
            }
        });
    }

    function renderKeywords(parent, x, y, keywordsIndex) {
        const w = 140;
        const h = 34;
        const headerW = 30;
        Object.keys(keywords).forEach((key, index) => {
            renderTextBox(parent, x, y + h * index, headerW, h, 'lightcyan', key, {size: 12, wrap: true});
            keywordsIndex[key] = renderTextBox(parent, x + headerW, y + h * index, w, h, 'white', keywords[key], {size: 12, wrap: true});
        });
    }

    const x = 520;
    const causeIndex = {};
    render52Cetasikas(x, 0, causeIndex);
    render89Cittas(x + 130, 0, causeIndex);
    render28Rupas(x + 400, 0, causeIndex);
    const t = renderExtras(x + 480, 250, causeIndex)
    render23RupaAggs(x + 400, svgHeight / 2, causeIndex);

    const hub = renderHub(parent, t.endX + 50, svgHeight / 2 - 110);
    const keywordsIndex = {};
    renderKeywords(parent, t.endX + 26, 600, keywordsIndex);

    const effectIndex = {};
    render28Rupas(x + svgWidth / 2 - 160, 0, effectIndex);
    render23RupaAggs(x + svgWidth / 2 - 160, svgHeight / 2, effectIndex);
    render89Cittas(x + svgWidth / 2, 0, effectIndex);
    render52Cetasikas(x + svgWidth / 2 + 260, 0, effectIndex);


    renderConditions(parent, 60, 0, hub, causeIndex, effectIndex, keywordsIndex);
}
