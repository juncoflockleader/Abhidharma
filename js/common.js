const langCfg = {
    'en': {
        name: 'en',
        fixed: false, // variable width fonts
        px: 10,
        vertical: false,
        wrap: true,
        wide: false,
        index: 0
    },
    'cn': {
        name: 'cn',
        px: 14,
        fixed: true, // fixed width fonts
        vertical: true,
        wrap: false,
        wide: true,
        index: 1
    }
};

function getLangByIndex(index) {
    for (let key in langCfg) {
        if (langCfg[key].index === index) {
            return langCfg[key];
        }
    }
    return langCfg['cn'];
}

function getLang() {
    if (localStorage) {
        const lang = localStorage.getItem('lang');
        if (langCfg[lang]) {
            return langCfg[lang];
        }
        localStorage.setItem('lang', 'cn');
    }
    return langCfg['cn'];
}

function t(id) {
    const lang = getLang();
    if (!id || !tr[id]) {
        return '';
    }
    return tr[id][lang.name] || tr[id]['cn'];
}

const container = d3.select('.svg-container');

const svgWidth = 1800;
const svgHeight = 1000;
const cittaSvg = container.select('#citta');

const msSvg = container.select('#container2').append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', 1);

const mmSvg = container.select('#container3').append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', 1);

const rpSvg = container.select('#container4').append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', 1200);

const rpgSvg = container.select('#container5').append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

const rpnSvg = container.select('#simulation');

const rpnlSvg = container.select('#simulation-notes');

const rpnsSvg = container.select('#container6').append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', 1);

const testSvg = d3.select('#test-svg');
const testDiv = d3.select('#test-div');

// Tab switching logic
const tabs = d3.selectAll('.tabs button');
const svgs = d3.selectAll('.svg-sub-container');

function showTab(tabIndex) {
    // Update tab styles
    tabs.classed('active', (d, i) => i === parseInt(tabIndex));

    // Show/hide SVGs
    svgs.classed('active', (d, i) => i === parseInt(tabIndex));
}

tabs.on('click', function () {
    const tabIndex = tabs.nodes().indexOf(this);

    history.pushState(null, '', `#${tabIndex}`);

    showTab(tabIndex);
});


const langs = d3.selectAll('.lang button');
function setLang(langIndex) {
    langs.classed('active', (d, i) => i === langIndex);
    if (localStorage) {
        localStorage.setItem('lang', getLangByIndex(langIndex).name);
    }
}

langs.on('click', function () {
    const langIndex = langs.nodes().indexOf(this);
    const oldLang = getLang().name;
    setLang(langIndex);
    const newLang = getLang().name;
    if (oldLang !== newLang) {
        window.location.reload();
    }
});

/** Helper functions **/
function renderCell(parent, x, y, w, h, color) {
    return parent.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('fill', color);
}

function updateParams(params={}) {
    if (params.size === undefined) params.size = '16px';
    if (params.padding === undefined) params.padding = 0;
    if (params.align === undefined) params.align = 'middle';
    if (params.valign === undefined) params.valign = 'middle';
    if (params.vertical === undefined) params.vertical = false;
    if (params.wrap === undefined) params.wrap = true;
    return params;
}

function renderText(parent, x, y, w, h, text, params={}) {
    params = updateParams(params);
    const rx = (params.align === 'middle' ? x + w / 2 : x) + params.padding;
    const ry = params.valign === 'top' ? y : y + h / 2;
    const px = parseInt(params.size);
    const textElement = parent.append('text')
        .attr('x', rx)
        .attr('y', ry)
        .attr('text-anchor', params.align)
        .attr('dominant-baseline', 'central')
        .attr('font-size', params.size);

    if (params.vertical) {
        for (let i = 0; i < text.length; i++) {
            textElement.append('tspan')
                .attr('x', rx)
                .attr('y', y + (i +1)* px)
                .text(text[i]);
        }
    } else if (params.wrap) {
        textElement.selectAll('tspan').remove();
        const lang = getLang();
        if (lang.fixed) {
            const len = Math.floor(w / px);
            const n = len === 0 ? 1 : Math.max(Math.ceil(text.length / len), 1);
            for (let j = 0; j < n; ++j) {
                const part = text.substring(j * len, Math.min((j + 1) * len, text.length));
                textElement.append('tspan')
                    .attr('x', rx)
                    .attr('y', y + (j + 1) * px)
                    .text(part);
            }
        } else {
            const testTE = testSvg.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', params.align)
                .attr('dominant-baseline', 'central')
                .attr('font-size', params.size);
            testTE.text(text);
            const len = testTE.node().getComputedTextLength();
            if (len <= w) {
                textElement.text(text);
            } else {
                testTE.text('');
                const words = text.split(' ');
                let line = '';
                let j = 0;
                let k = 1;
                for (let i = 0; i < words.length; i++) {
                    const maybeLine = line + (line === '' ? '' : ' ') + words[i];
                    const testTS = testTE.append('tspan')
                        .text(maybeLine);
                    const testLen = testTS.node().getComputedTextLength();
                    testTS.remove();

                    if (testLen > w) {
                        let cur = line;
                        let next = words[i];
                        if (i === 0) {
                            cur = maybeLine.substring(0, Math.floor(maybeLine.length *0.7)) + '-';
                            next = '-' + maybeLine.substring(Math.floor(maybeLine.length * 0.7));
                        }
                        textElement.append('tspan')
                            .attr('x', rx)
                            .attr('y', y + (j + 1) * px)
                            .text(cur);
                        line = next;
                        k = 1;
                        j++;
                        const testTS = testTE.append('tspan')
                            .text(line);
                        const testLen = testTS.node().getComputedTextLength();
                        testTS.remove();
                        if (testLen > w) {
                            cur = line.substring(0, Math.floor(line.length *0.7)) + '-';
                            next = '-' + line.substring(Math.floor(line.length * 0.7));
                            textElement.append('tspan')
                                .attr('x', rx)
                                .attr('y', y + (j + 1) * px)
                                .text(cur);
                            line = next;
                            k = 1;
                            j++;
                        }
                    } else {
                        line += (line === '' ? '' : ' ') + words[i];
                        k++;
                    }
                    if (i === words.length - 1) {
                        const ly = y + (j + 1) * px;
                        textElement.append('tspan')
                            .attr('x', rx)
                            .attr('y', ly)
                            .text(line);
                    }
                }
            }
            testTE.remove();
        }
    } else {
        textElement.text(text);
    }
    return textElement;
}

function renderTextBox(parent, x, y, w, h, bgColor, text, params = {}) {
    params = updateParams(params);
    let item = parent.append('g');
    let cell = renderCell(item, x, y, w, h, bgColor);
    let textElement = renderText(item, x, y, w, h, text, params);
    item.setText = function(newText) {
        item.select('text').remove();
        textElement = renderText(item, x, y, w, h, newText, params);
    };
    item.setColor = function(newColor) {
        cell.attr('fill', newColor);
    };
    item.highlight = function () {
        if (bgColor === 'white') {
            cell.attr('fill', 'yellow');
        } else {
            cell.attr('fill', d3.color(bgColor).darker(0.5));
        }
    }
    item.clear = function () {
        cell.attr('fill', bgColor);
    }
    return item;
}

function subArraySum(array, start, end) {
    let result = 0;
    for (let i = start; i < end; ++i) {
        result += array[i];
    }
    return result;
}

function getWordLength(text, px) {
    const lang = getLang();
    if (lang.fixed) {
        let count = 0;
        for (let char of text) {
            if (/[\x00-\x7F]/.test(char)) {
                count++;
            } else {
                count += 2;
            }
        }
        return count * px / 2 + 3;
    }
    const testTE = testSvg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', px)
        .text(text);
    const len = testTE.node().getComputedTextLength();
    testTE.remove();
    return len;
}

function renderVerticalTable(parent, x, y, w, h, title, items, padding, itemIndex) {
    // Define the table's header and item height
    const headerHeight = 20;
    const rowHeight = 15;

    // Create a group for the table
    const tableGroup = parent.append('g')
        .attr('transform', `translate(${x}, ${y})`);

    // Draw the header row
    renderTextBox(tableGroup, padding, padding, w - padding * 2, headerHeight, 'lightgrey', title, {size: '12px', padding: 2, align: 'left'});
    const boxes = [];
    // Loop through the data items and draw each row
    items.forEach((item, index) => {
        const yPosition = padding + headerHeight + index * rowHeight;
        const textbox = renderTextBox(tableGroup, padding, yPosition, w - padding * 2, rowHeight, 'white', item.name, {
            size: '10px',
            padding: 2,
            align: 'left'
        });
        if (itemIndex) {
            itemIndex[item.id] = textbox;
        }
        boxes.push(textbox);
    });
    tableGroup.setColor = function (color) {
        boxes.forEach((box, i) => {
            box.setColor(color);
        })
    }
    return tableGroup;
}
