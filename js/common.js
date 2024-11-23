const container = d3.select('.svg-container');

const svgWidth = 1600;
const svgHeight = 1200;
const cittaSvg = container.append('svg')
    .attr('class', 'svg-content active')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

const materialSenseFlowSvg = container.append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

const materialMindFlowSvg = container.append('svg')
    .attr('class', 'svg-content')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


// Tab switching logic
const tabs = d3.selectAll('.tabs button');
const svgs = d3.selectAll('.svg-content');

tabs.on('click', function () {
    const tabIndex = tabs.nodes().indexOf(this);

    // Update tab styles
    tabs.classed('active', (d, i) => i === tabIndex);

    // Show/hide SVGs
    svgs.classed('active', (d, i) => i === tabIndex);
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

function renderText(parent, x, y, w, h, text, params={size: '16px', padding: 0, align:'middle', valign: 'middle'}) {
    const rx = (params.align === 'middle' ? x + w / 2 : x) + (params.padding ? params.padding : 0);
    const ry = params.valign === 'top' ? y : y + h / 2;
    return parent.append('text')
        .attr('x', rx)
        .attr('y', ry)
        .attr('text-anchor', params.align)
        .attr('dominant-baseline', 'central')
        .text(text)
        .attr('font-size', params.size);
}

function renderTextBox(parent, x, y, w, h, bgColor, text, params={size: '16px', padding: 0, align:'middle', valign: 'middle'}) {
    let item = parent.append('g');
    let cell = renderCell(item, x, y, w, h, bgColor);
    let textElement = renderText(item, x, y, w, h, text, params);
    item.setText = function(newText, px=12) {
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
