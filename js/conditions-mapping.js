function renderConditionsMapping(leftSvg, rightSvg) {
    function render89Cittas(parent, x, y, itemIndex) {
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

    function render52Cetasikas(parent, x, y, itemIndex) {
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

    function render28Rupas(parent, x, y, itemIndex) {
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

    function render23RupaAggs(parent, x, y, itemIndex) {
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

    function renderExtras(parent, x, y, itemIndex) {
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
        const timeSummary = renderTextBox(parent, x + 10, y - 30, 100, 18, 'white', '', {size: 14, wrap: true});
        const causeSummary = renderTextBox(parent, x, y, 120, 18, 'white', '', {size: 14, wrap: true});
        const conditionSummary = renderTextBox(parent, x, y + 30, 120, 18, 'white', '', {size: 13, wrap: true});
        const effectSummary = renderTextBox(parent, x, y + 60, 120, 18, 'white', '', {size: 14, wrap: true});
        const noteSummary = renderTextBox(parent, x - 10, y + 90, 140, 52, 'white', '', {size: 12, wrap: true});
        connect(parent, causeSummary.endX - 60, causeSummary.endY, conditionSummary.endX - 60, conditionSummary.endY - 18, markerName);
        connect(parent, conditionSummary.endX - 60, conditionSummary.endY, effectSummary.endX - 60, effectSummary.endY - 18, markerName);
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
    function renderConditions(leftSvg, rightSvg, x, y, hub, causeIndex, effectIndex, keywordsIndex) {
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
        const headerW = 20;
        const header = renderTextBox(leftSvg, x, y, headerW, 15, 'lightcyan', '组', {size: 12, wrap: true});
        const t = renderTextBox(leftSvg, x + headerW, y, w, 15, 'lightcyan', '缘', {size: 12, wrap: true});
        renderTextBox(leftSvg, t.endX, y, w, 15, 'lightcyan', '缘法→缘生法', {size: 12, wrap: true});
        renderTextBox(leftSvg, x + w + headerW + w, y, w, 15, 'lightcyan', '缘法', {size: 12, wrap: true});
        y = t.endY;
        let counter = 0;
        Object.keys(groups).forEach((key, index) => {
            const group = groups[key];
            let y0 = y;
            Object.keys(group).forEach((ck, index) => {
                let y1 = y;
                const condition = group[ck];
                const subGroups = {}; // group by cause-effect. for example: 名→色, 名→名, etc
                condition.children.forEach((child, index) => {
                    const causeEffect = child.cause + '→' + child.effect;
                    if (!subGroups[causeEffect]) {
                        subGroups[causeEffect] = [child];
                    } else {
                        subGroups[causeEffect].push(child);
                    }
                });
                Object.keys(subGroups).map((key, index) => {
                    const subGroup = subGroups[key];
                    subGroup.forEach((child, index) => {
                        const tb = renderTextBox(leftSvg, x + w + headerW + w, y, w, 15, 'white', child.causeSummary, {size: 12, wrap: true});
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
                            hub.setSummary(child.causeSummary, condition.name, child.effectSummary, child.note, child.rebirth ? '结生' : '生命中');
                            const expandedCauses = child.expand();

                            // Connect causes to the hub
                            expandedCauses.forEach((expandedCause, index) => {
                                causeIndex[expandedCause].highlight();
                                highlighted.push(causeIndex[expandedCause]);
                                createElbowConnector(rightSvg, causeIndex[expandedCause].endX, causeIndex[expandedCause].endY - 5, hub.X, hub.Y + 9, 10);
                            });

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
                            const itemGroup = rightSvg.append('g')
                                .attr('class', 'expanded-effect-group');
                            const expandedEffects = child.effects();
                            expandedEffects.forEach((expandedEffect, index) => {
                                effectIndex[expandedEffect].highlight();
                                addSubEffects(expandedEffect, subEffects);
                                highlighted.push(effectIndex[expandedEffect]);
                                createElbowConnector(itemGroup, effectIndex[expandedEffect].X, effectIndex[expandedEffect].Y + 5, hub.endX, hub.endY - 9, -10);
                            });
                            subEffects.forEach((effect, index) => {
                                effectIndex[effect].highlight();
                                highlighted.push(effectIndex[effect]);
                            });

                        }
                        function clear() {
                            hub.clear();
                            removeAllConnectors(rightSvg);
                            highlighted.forEach((c, index) => {
                                c.clear();
                            });
                            highlighted = [];
                            rightSvg.selectAll('.expanded-cause-group').remove();
                            rightSvg.selectAll('.expanded-effect-group').remove();
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
                        y = tb.endY;
                    });
                    const t = renderTextBox(leftSvg, x + w + headerW, y - 15 * subGroup.length, w, 15 * subGroup.length, counter % 2 === 0 ? 'lavender' : 'lightpink', key, {size: 12, wrap: true});
                });

                const t1 = renderTextBox(leftSvg, x + headerW, y1, w, y - y1, 'lightcyan', condition.name, {size: 12, wrap: true});
                counter++;
            });
            if (key === '自然亲依止组') { // text box is too small
                renderTextBox(leftSvg, x, y0, 30, y - y0, 'lightcyan', key, {size: 12, wrap: true});
            } else if (key === '色命根组') {
                renderTextBox(leftSvg, x, y0, 30, y - y0, 'lightcyan', key, {size: 12, wrap: true});
            } else {
                const header = renderTextBox(leftSvg, x, y0, headerW, y - y0, 'lightcyan', key, {size: 12, wrap: true});
            }
        });
    }

    function renderKeywords(parent, x, y0, y1, keywordsIndex) {
        const w = 140;
        const headerW = 30;
        const keys = Object.keys(keywords);
        let y = y0;
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length / 2) {
                y = y1;
            }
            let h = 34;
            if (keywords[keys[i]].length > 22) {
                h = 44;
            } else if (keywords[keys[i]].length > 11 || keys[i].length > 2) {
                h = 34;
            } else {
                h = 17;
            }
            renderTextBox(parent, x, y, headerW, h, 'lightcyan', keys[i], {size: 12, wrap: true});
            keywordsIndex[keys[i]] = renderTextBox(parent, x + headerW, y, w, h, 'white', keywords[keys[i]], {size: 12, wrap: true});
            y += h;
        }
    }

    const x = 0;
    const causeIndex = {};
    render52Cetasikas(rightSvg, x, 0, causeIndex);
    render89Cittas(rightSvg, x + 130, 0, causeIndex);
    render28Rupas(rightSvg, x + 400, 0, causeIndex);
    const t = renderExtras(rightSvg, x + 480, 250, causeIndex)
    render23RupaAggs(rightSvg, x + 400, svgHeight / 2, causeIndex);

    const hub = renderHub(rightSvg,  t.endX + 40, svgHeight / 2 - 110);
    const keywordsIndex = {};
    renderKeywords(rightSvg,  t.endX + 26, 0, 550, keywordsIndex);

    const effectIndex = {};
    render28Rupas(rightSvg, x + svgWidth / 2 - 160, 0, effectIndex);
    render23RupaAggs(rightSvg, x + svgWidth / 2 - 160, svgHeight / 2, effectIndex);
    render89Cittas(rightSvg, x + svgWidth / 2, 0, effectIndex);
    render52Cetasikas(rightSvg, x + svgWidth / 2 + 260, 0, effectIndex);

    renderConditions(leftSvg, rightSvg, 0, 0, hub, causeIndex, effectIndex, keywordsIndex);
}
