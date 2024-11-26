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
function renderCell(parent, x, y, w, h, color, params = {}) {
    if (params.vertical === undefined) params.vertical = false;
    if (params.vertical) {
        return parent.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', h) // Swap width and height for vertical
            .attr('height', w)
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', color);
    } else {
        return parent.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', w)
            .attr('height', h)
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', color);
    }
}

function renderText(parent, x, y, w, h, text, params={}) {
    if (params.size === undefined) params.size = '16px';
    if (params.padding === undefined) params.padding = 0;
    if (params.align === undefined) params.align = 'middle';
    if (params.valign === undefined) params.valign = 'middle';
    if (params.vertical === undefined) params.vertical = false;
    const rx = (params.align === 'middle' ? x + w / 2 : x) + params.padding;
    const ry = params.valign === 'top' ? y : y + h / 2;
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
                .attr('y', y + ((i +1)* parseInt(params.size)) + (params.padding * (i + 1)))
                .text(text[i]);
        }
    } else {
        textElement.text(text);
    }
    return textElement;
}

function renderTextBox(parent, x, y, w, h, bgColor, text, params = {}) {
    if (params.size === undefined) params.size = '16px';
    if (params.padding === undefined) params.padding = 0;
    if (params.align === undefined) params.align = 'middle';
    if (params.valign === undefined) params.valign = 'middle';
    if (params.vertical === undefined) params.vertical = false;
    let item = parent.append('g');
    let cell = renderCell(item, x, y, w, h, bgColor, params);
    let textElement = renderText(item, x, y, w, h, text, params);
    item.setText = function(newText, px=12) {
        if (!params.vertical) {
            let wordWidth = getWordLength(newText, px);
            if (wordWidth < w) {
                textElement.text(newText);
                return;
            }
            const padding = 2;
            let i = newText.length / 2;
            const firstPart = newText.substring(0, i);
            const secondPart = newText.substring(i);

            textElement.selectAll('tspan').remove();
            textElement.append('tspan')
                .attr('x', x + w / 2) // Align all tspans to the center of the cell
                .attr('y', y + padding + px / 2) // Move each character to a new line; adjust as needed
                .text(firstPart);
            textElement.append('tspan')
                .attr('x', x + w / 2) // Align all tspans to the center of the cell
                .attr('y', y + padding * 2 + px + px / 2) // Move each character to a new line; adjust as needed
                .text(secondPart);
        }
    };
    item.setColor = function(newColor) {
        cell.attr('fill', newColor);
    };
    return item;
}


function highlightsTextBox(item, color='yellow') {
    item.select('rect').attr('fill', color);
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
    renderTextBox(tableGroup, padding, padding, w - padding * 2, headerHeight, 'lightgrey', title, {size: '12px', 'padding': padding, align: 'left'});
    const boxes = [];
    // Loop through the data items and draw each row
    items.forEach((item, index) => {
        const yPosition = padding + headerHeight + index * rowHeight;
        const textbox = renderTextBox(tableGroup, padding, yPosition, w - padding * 2, rowHeight, 'white', item.name, {
            size: '10px',
            'padding': padding,
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