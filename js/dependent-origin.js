const dependentOriginData = {
    "name": "十二缘起",
    factors: [
        {
            id: 1,
            name: "无明",
            note: "无知，属于痴心所，覆盖对诸法实相的觉知能力。无知四圣谛、过去、未来、过去未来、此缘性、缘起诸法。",
            wheel: "烦恼",
            nama: [{
                type: "心所",
                name: "痴心所"
            }],
            rupa: [],
            class: "因",
            time: "过去",
            conditioning: {
                id: 2,
                note: "当有情受到无明影响时，「行」即会制造能产生未来世的业。因此无明被称为产生行的主要缘。无明在不善业中很明显，而在世间善业里则是潜伏性的存在。所以世间善与不善行两者皆被说缘于无明。",
            }
        },
        {
            id: 2,
            name: "诸行",
            wheel: "业",
            note: "是29种世间善与不善心（速行）相应的思心所",
            class: "因",
            time: "过去",
            connection: "行识",
            nama: [
                {
                    type: "心所",
                    name: "12不善心思心所",
                    note: "称为非福行"
                },
                {
                    type: "心所",
                    name: "8大+5色界善心思心所",
                    note: "称为福行"
                },
                {
                    type: "心所",
                    name: "4无色界善心思心所",
                    note: "称不动行(无色之报)"
                }],
            rupa: [],
            conditioning: {
                id: 3,
                note: "源于「诸行」而「识」升起。在上一世死时，最后一个速行会在下一世与该业相符之地产生19种结生心之一。在随后的生命期间，过往所积累的业也能产生果报心。",
            }
        },
        {
            id: 3,
            name: "识",
            note: "32种世间果报心（结生及路心）",
            class: "果",
            time: "现在",
            wheel: "果报",
            connection: "受爱",
            nama: [
                {
                    "type": "心",
                    "name": "7不善无因心",
                },
                {
                    "type": "心",
                    "name": "8善无因心",
                },
                {
                    "type": "心",
                    "name": "8大善果报心",
                },
                {
                    "type": "心",
                    "name": "5色界果报心",
                },
                {
                    "type": "心",
                    "name": "4无色界果报心",
                }
            ],
            rupa: [],
            conditioning: {
                id: 4,
                note: "具有「五蕴有」的众生，「识」缘生名色两者；无色界天属于「四蕴有」，识只能缘生名法；无想有情天是属于「一蕴有」,前世的识只缘生无想天的色法，不能缘生名法。",
            }
        },
        {
            id: 4,
            name: "名色",
            class: "果",
            time: "现在",
            wheel: "果报",
            nama: [
                {
                    type: "心",
                    name: "果报心"
                },
                {
                    type: "心所",
                    name: "诸心",
                    note: "人类为受想行三名蕴"
                }
            ],
            rupa: [{
                name: "业生色",
                note: "人类为三个十法聚"
            }],
            note: "名是果报心及其相应的诸心所。色是业生色。",
            conditioning: {
                id: 5,
                note: "当业生色生起时，它们缘助也是属于业生色的五净色生起。当诸相应心所生起时，它们缘助于此称为意处的果报心升起。亦即果报心缘生名，而名缘生果报心，它们是相互缘。在欲界，缘生所有六处；在色界，名色只缘生眼耳意三处；无色界只有意处。",
            }
        },
        {
            id: 5,
            name: "六处",
            note: "五净色和32种世间果报心。",
            class: "果",
            time: "现在",
            wheel: "果报",
            nama: [
                {
                    type: "心",
                    name: "7不善无因心"
                },
                {
                    type: "心",
                    name: "8善无因心"
                },
                {
                    type: "心",
                    name: "8大善果报心"
                },
                {
                    type: "心",
                    name: "5色界果报心"
                },
                {
                    type: "心",
                    name: "4无色界果报心"
                }
            ],
            rupa: [{
                name: "五净色",
                note: "眼、耳、鼻、舌、身"
            }],
            conditioning: {
                id: 6,
                note: "触必须有处才能生起，所以说缘于六处而触生起。",
            }
        },
        {
            id: 6,
            name: "触",
            note: "触是心、心所、目标聚集六处之一处的触击。起于眼处的称为「眼触」，它是眼净色、色所缘、及眼识聚集于一处；其余四处以此类推。「意触」是与双五识之外的22果报心相应的'触'。",
            class: "果",
            time: "现在",
            wheel: "果报",
            nama: [
                {
                    type: "心所",
                    name: "眼触",
                    note: "与眼识相应的触心所"
                },
                {
                    type: "心所",
                    name: "耳触",
                    note: "与耳识相应的触心所"
                },
                {
                    type: "心所",
                    name: "鼻触",
                    note: "与鼻识相应的触心所"
                },
                {
                    type: "心所",
                    name: "舌触",
                    note: "与舌识相应的触心所"
                },
                {
                    type: "心所",
                    name: "身触",
                    note: "与身识相应的触心所"
                },
                {
                    type: "心所",
                    name: "意触",
                    note: "其他果报心的触心所"
                }],
            rupa: [],
            conditioning: {
                id: 7,
                note: "缘于六触生六种受，如眼触生受、耳触生受等。新造的忧受、悦受、舍受是伴随'爱'或'业有'生起，不归属于此「受」",
            }
        },
        {
            id: 7,
            name: "受",
            class: "果",
            time: "现在",
            wheel: "果报",
            connection: "受爱",
            nama: [{
                type: "心所",
                name: "受",
                note: "32种世间果报心之受"
            }],
            rupa: [],
            note: "在此「受」特指32种世间果报心之受。",
            conditioning: {
                id: 8,
                note: "爱是贪心所，缘于受。",
            }
        },
        {
            id: 8,
            name: "爱",
            wheel: "烦恼",
            nama: [{
                type: "心所",
                name: "贪"
            }],
            rupa: [],
            note: "有六种：色爱声爱香爱味爱触爱法爱。也可以分为三种：渴爱欲乐；渴爱生存，含有常见的渴爱；渴爱断灭，即含有断见的渴爱。",
            class: "因",
            time: "现在",
            connection: "受爱",
            conditioning: {
                id: 9,
                note: "四种取都是缘于爱——若无爱、取二支则直至'业有'",
            }
        },
        {
            id: 9,
            name: "取",
            time: "现在",
            wheel: "烦恼",
            nama: [{
                type: "心所",
                name: "贪",
                note: "欲取是贪爱的强化"
            }, {
                type: "心所",
                name: "邪见",
                note: "邪见取、戒禁取、我语取"
            }],
            rupa: [],
            note: "有四种：欲取、邪见取、戒禁取、我语取。",
            class: "因",
            conditioning: {
                id: 10,
                note: "「取」是「业有」的缘，因为「取」人们才会「造业」；「取」亦是「生有」的缘，因为「取」，才会导致人们依照自己所造的业一再地生死轮回。",
            }
        },
        {
            id: 10,
            name: "有",
            note: "（存在）有两种：「业有」与「生有」。「业有」是29种善与不善思（福行、非福行、不动行）。「生有」包括32种果报心、它们的相应心所及业生色。业有属于五因、三转轮中的业。",
            class: "因",
            time: "现在",
            connection: "受爱",
            wheel: "业/果",
            nama: [{
                type: "心所",
                name: "思",
                note: "思心所造业，属于业有"
            }, {
                type: "心",
                name: "32果报心",
                note: "生有的一部分"
            }, {
                type: "心所",
                name: "32果报心对应心所",
                note: "生有的一部分"
            }],
            rupa: [{
                name: "业生色",
                note: "生有的一部分"
            }],
            conditioning: {
                id: 11,
                note: "未来世产生是缘于「业有」",
            }
        },
        {
            id: 11,
            name: "生",
            connection: "有生",
            time: "未来",
            nama: [],
            rupa: [],
            note: "生于下一世投生所在地的世间果报心、相应心所、业生色（诸蕴显现、诸蕴获得）",
            conditioning: {
                id: 12,
                note: "生一旦产生，老、死势必无法避免。在生与死之间也可能会生起其他苦，如愁、悲、苦、忧、恼。这些苦的根源是生，所以把生列为它们的主要缘。",
            }
        },
        {
            id: 12,
            name: "老死",
            time: "未来",
            note: "诸根日坏、诸蕴崩裂、命根全断。",
            nama: [],
            rupa: [],
            conditioning: {
            }
        },
    ],
};

function dependentOrigination(svg, data){
    const r = 30;
    const cr = 20;
    const ccr = 10;
    const x = 100;
    const y = 220;
    let cx = x;
    let by = 0;
    const padding = 15;
    const markerName = 'dependent-origin-arrowhead';
    setupArrowHead(svg, markerName);
    let lock = null;

    function renderOrigins() {
        const timeIndex = {};
        const highlightGroups = [];
        data.factors.forEach((factor, i) => {
            const cy = y;
            const fc = renderTextCircle(svg, cx, cy, r, 'lightcyan', factor.name);
            const fcHG = {name: factor.name, item: fc, subItems: []};
            if (factor.class) {
                const fcc = renderTextCircle(svg, cx + r - ccr, cy + r - ccr, ccr, 'orange', factor.class, {size: 12});
                fcHG.subItems.push(fcc);
            }
            if (factor.wheel) {
                const fwc = renderTextBox(svg, cx + 10, cy - r + 6, 34, 12,'lightblue', factor.wheel, {size: 11});
                fcHG.subItems.push(fwc);
            }
            const w = 120;
            const h = 130;
            const yoffset = 20;
            const padding = 15;
            const textBgColor = 'lightyellow';
            const fn = renderTextBox(svg, cx - w/2, cy + r + yoffset,w, h,textBgColor, factor.note, {size: 12, padding: 3});
            fcHG.subItems.push(fn);
            connect(svg, cx, cy + r, cx, cy + r + yoffset, markerName);
            let sy = cy + r + h + yoffset * 2;
            by = sy;
            if (factor.nama && factor.nama.length > 0) {
                const fcM = renderTextBox(svg, cx - w / 2, by, w, 15, 'lightgrey', '名法', {size: 11, padding: 3});
                fcHG.subItems.push(fcM);
                by += 15;
                factor.nama.forEach((n, i) => {
                    const fcMN = renderTextBox(svg, cx - w / 2, by, w, 12, 'white', n.name, {size: 10, padding: 3});
                    fcHG.subItems.push(fcMN);
                    by += 12;
                    if (n.note) {
                        const fcMNN = renderTextBox(svg, cx - w / 2, by, w, 12, textBgColor, n.note, {size: 10, padding: 3});
                        fcHG.subItems.push(fcMNN);
                        by += 12;
                    }
                });

            }
            if (factor.rupa && factor.rupa.length > 0) {
                const frT = renderTextBox(svg, cx - w / 2, by, w, 15, 'lightgrey', '色法', {size: 11, padding: 3});
                fcHG.subItems.push(frT);
                by += 15;
                factor.rupa.forEach((n, i) => {
                    const frTI = renderTextBox(svg, cx - w / 2, by, w, 12, 'white', n.name, {size: 10, padding: 3});
                    fcHG.subItems.push(frTI);
                    by += 12;
                    if (n.note) {
                        const frTIN = renderTextBox(svg, cx - w / 2, by, w, 12, textBgColor, n.note, {size: 10, padding: 3});
                        fcHG.subItems.push(frTIN);
                        by += 12;
                    }
                });
            }

            if (sy !== by) {
                connect(svg, cx, sy - yoffset, cx, sy, markerName);
            } else {
                by = sy - yoffset;
            }

            timeIndex[factor.time] = timeIndex[factor.time] || [];
            timeIndex[factor.time].push({x: cx, y: by, group: fcHG});

            if (factor.conditioning && factor.conditioning.id) {
                connect(svg, cx + r, cy, cx + r + padding, cy, markerName);
                cx += r + cr + padding;
                const fcn = renderTextCircle(svg, cx, cy, cr, 'lavender', '缘');
                fcHG.subItems.push(fcn);
                const fccHG = {name: factor.name + "_缘", item: fcn, subItems: []};
                const h2 = h + 35;
                const fcnn = renderTextBox(svg, cx - w/2, cy - cr - yoffset - h2,w, h2,textBgColor, factor.conditioning.note, {size: 12, padding: 3});
                fcHG.subItems.push(fcnn);
                fccHG.subItems.push(fcnn);
                highlightGroups.push(fccHG);
                connect(svg, cx, cy - cr, cx, cy - cr - yoffset, markerName);
                connect(svg, cx + cr, cy, cx + cr + padding, cy, markerName);
                cx += r + cr + padding;
            }
            highlightGroups.push(fcHG);
        });

        Object.keys(timeIndex).forEach((key) => {
            let maxY = 0;
            let minX = 10000;
            let maxX = 0;
            timeIndex[key].forEach((v) => {
                minX = Math.min(minX, v.x);
                maxX = Math.max(maxX, v.x);
                maxY = Math.max(maxY, v.y);
            });
            const connectY = maxY + padding;
            const midX = (minX + maxX) / 2;
            const radius = r * 2 / 3;
            const cy = maxY + padding * 2 + radius;
            const tc = renderTextCircle(svg, midX, cy, radius, 'lightpink', key, {size: 12});
            timeIndex[key].forEach((v) => {
                line(svg, v.x, v.y, v.x, connectY, 'black');
            });
            line(svg, minX, connectY, maxX, connectY, 'black');
            connect(svg, midX, connectY, midX, cy - radius, markerName);
            by = Math.max(by, cy + radius);
            timeIndex[key].forEach((v) => {
                v.group.subItems.push(tc);
            });
        });

        function setupHighlight(hg) {
            const exHighlight = hg.item.highlight;
            hg.item.highlight = function () {
                exHighlight();
                hg.subItems.forEach((si) => {
                    si.highlight();
                });
            }
            const exClear = hg.item.clear;
            hg.item.clear = function () {
                exClear();
                hg.subItems.forEach((si) => {
                    si.clear();
                });
            }
            hg.item.on('mouseover', () => {
                if (lock) return;
                hg.item.highlight();
            })
                .on('mouseout', () => {
                    if (lock) return;
                    hg.item.clear();
                })
                .on('click', () => {
                    if (lock === hg) {
                        hg.item.clear();
                        lock = null;
                    }
                    else {
                        if (lock) {
                            lock.item.clear();
                        }
                        hg.item.highlight();
                        lock = hg;
                    }
                });
        }

        highlightGroups.forEach(setupHighlight);

        function findGroup(name) {
            return highlightGroups.find((hg) => hg.name === name);
        }

        const wr = 60;
        let wx = x + wr;
        let wy = by + wr;
        const wwr = 20;
        const dx = wr + 160;
        const tC = renderTextCircle(svg, wx, wy, wr, 'tomato', '烦恼', {size: 14});
        const tC1 = renderTextCircle(svg, wx, wy - wr + wwr, wwr, 'lightgrey', '无明', {size: 12});
        const tC2 = renderTextCircle(svg, wx + (wr - wwr) / 1.414, wy + (wr - wwr)  / 1.414, wwr, 'lightgrey', '爱', {size: 12});
        const tC3 = renderTextCircle(svg, wx - (wr - wwr)  / 1.414, wy + (wr - wwr)  / 1.414, wwr, 'lightgrey', '取', {size: 12});
        setupHighlight({name: '烦恼', item: tC, subItems: [tC1, tC2, tC3, findGroup('无明').item, findGroup('爱').item, findGroup('取').item]});

        connect(svg, wx + wr, wy, wx + dx - wr, wy, markerName);

        wx = wx + dx;
        const kC = renderTextCircle(svg, wx, wy, wr, 'tomato', '业', {size: 14});
        const kC1 = renderTextCircle(svg, wx, wy - wr + wwr, wwr, 'lightgrey', '诸行', {size: 12});
        const kC2 = renderTextCircle(svg, wx, wy + wr - wwr, wwr, 'lightgrey', '业有', {size: 12});
        setupHighlight({name: '业', item: kC, subItems: [kC1, kC2, findGroup('诸行').item, findGroup('有').item]});

        connect(svg, wx + wr, wy, wx + dx - wr, wy, markerName);

        wx = wx + dx;
        const fC = renderTextCircle(svg, wx, wy, wr, 'tomato', '果报', {size: 14});
        const fC1 = renderTextCircle(svg, wx, wy - wr + wwr, wwr, 'lightgrey', '识', {size: 12});
        const fC2 = renderTextCircle(svg, wx, wy + wr - wwr, wwr, 'lightgrey', '触', {size: 12});
        const fC3 = renderTextCircle(svg, wx + 1.732*(wr - wwr)/2, wy - (wr -wwr) /2, wwr, 'lightgrey', '名色', {size: 12});
        const fC4 = renderTextCircle(svg, wx + 1.732*(wr - wwr)/2, wy + (wr -wwr) /2, wwr, 'lightgrey', '六处', {size: 12});
        const fC5 = renderTextCircle(svg, wx - 1.732*(wr - wwr)/2, wy - (wr -wwr) /2, wwr, 'lightgrey', '受', {size: 12});
        const fC6 = renderTextCircle(svg, wx - 1.732*(wr - wwr)/2, wy + (wr -wwr) /2, wwr, 'lightgrey', '生有', {size: 12});
        setupHighlight({name: '果报', item: fC, subItems: [fC1, fC2, fC3, fC4, fC5, fC6, findGroup('识').item, findGroup('触').item, findGroup('名色').item, findGroup('六处').item, findGroup('受').item, findGroup('有').item]});

        const len = 10;
        line(svg, wx, wy + wr, wx, wy + wr + len, 'black');
        line(svg, wx, wy + wr + len, wx - 2 * dx, wy + wr + len, 'black');
        connect(svg, wx - 2 * dx, wy + wr + len, wx - 2 * dx, wy + wr, markerName);
    }

    renderOrigins();
}