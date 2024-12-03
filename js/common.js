const container = d3.select('.svg-container');

const svgWidth = 1600;
const svgHeight = 1200;
const cittaSvg = container.select('#container1').append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

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
    .attr('height', svgHeight);


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
    const ry = params.valign === 'top' ? y : (params.wrap ? y + h / 4 : y + h / 2);
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
        const len = Math.floor(w / px);
        const n = Math.max(Math.ceil(text.length / len), 1);
        for (let j = 0; j < n; ++j) {
            const ly = y + h / n / 2 + j * h / n;
            const part = text.substring(j * len, Math.min((j + 1) * len, text.length));
            textElement.append('tspan')
                .attr('x', rx)
                .attr('y', ly)
                .text(part);
        }
    } else {
        textElement.text(text);
        return textElement;
    }
    return textElement;
}

function renderTextBox(parent, x, y, w, h, bgColor, text, params = {}) {
    params = updateParams(params);
    let item = parent.append('g');
    let cell = renderCell(item, x, y, w, h, bgColor);
    let textElement = renderText(item, x, y, w, h, text, params);
    item.setText = function(newText) {
        item.select("text").remove();
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