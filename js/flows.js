const flowCittas = [
    {
        'id': 1,
        'name': t('string_id_460'),
        'color': 'dimgrey',
    },
    {
        'id': 2,
        'name': t('string_id_461'),
        'color': 'grey',
    },
    {
        'id': 3,
        'name': t('string_id_462'),
        'color': 'darkgrey',
    },
    {
        'id': 4,
        'name': t('string_id_463'),
        'color': 'lightgrey',
    },
    {
        'id': 5,
        'name': t('string_id_464'),
        'color': 'palevioletred',
        'cittas': [{'class': t('string_id_465'), 'cittas': [t('string_id_163')]}]
    },
    {
        'id': 6,
        'name': t('string_id_135'),
        'color': 'tomato',
        'cittas': [{'class': t('string_id_466'), 'cittas': [t('string_id_132'), t('string_id_136'), t('string_id_139'), t('string_id_142'), t('string_id_145')], 'matcher': {'likable': 3}},
            {'class': t('string_id_467'), 'cittas': [t('string_id_132'), t('string_id_136'), t('string_id_139'), t('string_id_142'), t('string_id_145')]}]
    },
    {
        'id': 7,
        'name': t('string_id_150'),
        'color': 'gold',
        'cittas': [{'class': t('string_id_466'), 'cittas': [t('string_id_148')], 'matcher': {'likable': 3}},
            {'class': t('string_id_467'), 'cittas': [t('string_id_148')]}]
    },
    {
        'id': 8,
        'name': t('string_id_153'),
        'color': 'darkseagreen',
        'cittas': [{'class': t('string_id_466'), 'cittas': [t('string_id_148')], 'matcher': {'likable': 3}},
            {'class': t('string_id_467'), 'cittas': [t('string_id_148')], 'matcher': {'likable': 2}},
            {'class': t('string_id_467'), 'cittas': [t('string_id_157')]}]
    },
    {
        'id': 9,
        'name': t('string_id_166'),
        'color': 'cyan',
        'cittas': [{'class': t('string_id_465'), 'cittas': [t('string_id_165')]}]
    },
    {
        'id': 10,
        'name': t('string_id_25'),
        'color': 'lightblue',
        'cittas': [{'class': t('string_id_468'), 'cittas': [t('string_id_47'), t('string_id_59'), t('string_id_63'), t('string_id_66'),
            t('string_id_67'), t('string_id_69'), t('string_id_70'), t('string_id_71'), t('string_id_72'), t('string_id_80'),
            t('string_id_81'), t('string_id_83')], 'matcher': {'arahant': false, 'goodIntention': false}},
            {'class': t('string_id_469'), 'cittas': [t('string_id_110'), t('string_id_116'), t('string_id_117'),
                t('string_id_118'), t('string_id_119'), t('string_id_120'), t('string_id_121'),
                t('string_id_122')], 'matcher': {'arahant': false, 'goodIntention': true}},
            {'class': t('string_id_470'), 'cittas': [t('string_id_110'), t('string_id_116'), t('string_id_117'),
                    t('string_id_118'), t('string_id_119'), t('string_id_120'), t('string_id_121'),
                    t('string_id_122'), t('string_id_167')], 'matcher': {'arahant': true}}]
    },
    {
        'id': 11,
        'name': t('string_id_128'),
        'color': 'mediumslateblue',
        'cittas': [{'class': t('string_id_471'), 'cittas': [t('string_id_119'), t('string_id_120'), t('string_id_121'),t('string_id_122'), t('string_id_152')], 'matcher': {'likable': 3}},
            {'class': t('string_id_472'), 'cittas': [t('string_id_110'), t('string_id_116'), t('string_id_117'), t('string_id_118'), t('string_id_152')], 'matcher': {'likable': 2}},
            {'class': t('string_id_472'), 'cittas': [t('string_id_110'), t('string_id_116'), t('string_id_117'), t('string_id_118'), t('string_id_157')]}]
    },
    {
        'id': 12,
        'name': t('string_id_473'),
        'color': 'cornflowerblue',
        'cittas': [{'class': t('string_id_465'), 'cittas': [t('string_id_165')]}]
    }
];

const fiveDoorFlows = [
    {'id': 1, 'class': t('string_id_474'), 'flowCittas': [1, 2, 3, 4, 5, 6, 7, 8, 9, {'id': 10, 'count': 7}, {'id': 11, 'count': 2}, 1]},
    {'id': 2, 'class': t('string_id_475'), 'flowCittas': [1, {'id': 2, 'count': 2}, 3, 4, 5, 6, 7, 8, 9, {'id': 10, 'count': 7}, {'id': 1, 'count': 2}]},
    {'id': 3, 'class': t('string_id_475'), 'flowCittas': [1, {'id': 2, 'count': 3}, 3, 4, 5, 6, 7, 8, 9, {'id': 10, 'count': 7}, 1]},
    {'id': 4, 'class': t('string_id_476'), 'flowCittas': [1, {'id': 2, 'count': 4}, 3, 4, 5, 6, 7, 8, {'id': 9, 'count': 3}, {'id': 1, 'count': 5}]},
    {'id': 5, 'class': t('string_id_476'), 'flowCittas': [1, {'id': 2, 'count': 5}, 3, 4, 5, 6, 7, 8, {'id': 9, 'count': 3}, {'id': 1, 'count': 4}]},
    {'id': 6, 'class': t('string_id_476'), 'flowCittas': [1, {'id': 2, 'count': 6}, 3, 4, 5, 6, 7, 8, {'id': 9, 'count': 3}, {'id': 1, 'count': 3}]},
    {'id': 7, 'class': t('string_id_476'), 'flowCittas': [1, {'id': 2, 'count': 7}, 3, 4, 5, 6, 7, 8, {'id': 9, 'count': 3}, {'id': 1, 'count': 2}]},
    {'id': 8, 'class': t('string_id_476'), 'flowCittas': [1, {'id': 2, 'count': 8}, 3, 4, 5, 6, 7, 8, {'id': 9, 'count': 3}, {'id': 1, 'count': 1}]},
    {'id': 9, 'class': t('string_id_476'), 'flowCittas': [1, {'id': 2, 'count': 9}, 3, 4, 5, 6, 7, 8, {'id': 9, 'count': 2}, {'id': 1, 'count': 1}]},
    {'id': 10, 'class': t('string_id_477'), 'flowCittas': [1, {'id': 2, 'count': 10}, {'id': 3, 'count': 2}, {'id': 1, 'count': 6}]},
    {'id': 11, 'class': t('string_id_477'), 'flowCittas': [1, {'id': 2, 'count': 11}, {'id': 3, 'count': 2}, {'id': 1, 'count': 5}]},
    {'id': 12, 'class': t('string_id_477'), 'flowCittas': [1, {'id': 2, 'count': 12}, {'id': 3, 'count': 2}, {'id': 1, 'count': 4}]},
    {'id': 13, 'class': t('string_id_477'), 'flowCittas': [1, {'id': 2, 'count': 13}, {'id': 3, 'count': 2}, {'id': 1, 'count': 3}]},
    {'id': 14, 'class': t('string_id_477'), 'flowCittas': [1, {'id': 2, 'count': 14}, {'id': 3, 'count': 2}, {'id': 1, 'count': 2}]},
    {'id': 15, 'class': t('string_id_477'), 'flowCittas': [1, {'id': 2, 'count': 15}, {'id': 3, 'count': 2}, {'id': 1, 'count': 1}]},
];

const mindDoorFlows = [
    {'id': 1, 'class': t('string_id_478'), 'flowCittas': [1, 2, 3, 4, 12, {'id': 10, 'count': 7}, {'id': 11, 'count': 2}, 1]},
    {'id': 2, 'class': t('string_id_479'), 'flowCittas': [1, 2, 3, 4, 12, {'id': 10, 'count': 7},  {'id': 1, 'count': 3}]},
    {'id': 3, 'class': t('string_id_480'), 'flowCittas': [1, 2, {'id': 12, 'count': 3}, {'id': 1, 'count': 10}]},
    {'id': 4, 'class': t('string_id_480'), 'flowCittas': [1, 2, {'id': 12, 'count': 2}, {'id': 1, 'count': 11}]},
    {'id': 5, 'class': t('string_id_481'), 'flowCittas': [1, 2, {'id': 3, 'count': 3},  {'id': 1, 'count': 10}]},
    {'id': 6, 'class': t('string_id_481'), 'flowCittas': [1, 2, {'id': 3, 'count': 2},  {'id': 1, 'count': 11}]},
];

const senseFlowState = {
    likable: 1, // 1 == very likable 2 == likable 3 == not likable
    arahant: false,
    goodIntention: true,
    sliderValue: 1,
    // actually configs, but
    container: '#senseflow',
    controls: '#senseflowcontrols',
    doorFlow: fiveDoorFlows,
    renderEntity: true,
    markerName: '#sensearraw',

};

const mindFlowState = {
    likable: 1, // 1 == very likable 2 == likable 3 == not likable
    arahant: false,
    goodIntention: true,
    sliderValue: 1,
    // actually configs, but
    container: '#mindflow',
    controls: '#mindflowcontrols',
    doorFlow: mindDoorFlows,
    markerName: '#mindarrow',
};


function createNode(flowCitta, i) {
    return {
        id: i,
        'fcid': flowCitta.id,
        'name': flowCitta.name,
        'color': flowCitta.color,
        'cittas': flowCitta.cittas
    }
}

function getRenderData(state) {
    const i = state.sliderValue - 1;
    const flow = state.doorFlow[i];
    const data = {};
    data['name'] = flow['class'];
    const nodes = [];
    flow['flowCittas'].forEach((item, i) => {
        if (typeof item === 'object') {
            for (let i = 0; i < item.count; ++i) {
                const node = createNode(flowCittas[item.id - 1], nodes.length);
                nodes.push(node);
            }
        } else {
            const node = createNode(flowCittas[item - 1], nodes.length);
            nodes.push(node);
        }
    });

    const ids = {};
    nodes.forEach((item, i) => {
        ids[item.cid] = item.id;
    });

    data['nodes'] = nodes;
    return data;
}

function findMatch(cittas, state) {
    let score = 0;
    let match = {};
    cittas.forEach((def, i) => {
        let s = 0;
        if (def.matcher) {
            if (def.matcher.likable) {
                if (def.matcher.likable === state.likable) s++;
                else s = -1;
            }
            if (s >= 0 && def.matcher.arahant) {
                if (def.matcher.arahant === state.arahant) s++;
                else s = -1;
            }
            if (s >= 0 && def.matcher.goodIntention) {
                if (def.matcher.goodIntention === state.goodIntention) s++;
                else s = -1;
            }
        }
        if (s >= 0 && s >= score) {
            score = s;
            match = def;
        }
    });
    return match;
}

function renderEntity(svg, x, y, radius, state) {
    const cfg = getLang();
    // material
    svg.append('circle')
        .attr('cx', x(1))
        .attr('cy', 0)
        .attr('r', radius)
        .style('fill', 'red')
        .style('stroke', 'black')
        .style('stroke-width', 1);
    if (cfg.wide) { // should add a field like concise or something
        svg.append('text')
            .attr('x', x(1))
            .attr('y', 0)
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(t('string_id_482'));
    } else {
        renderTextBox(svg, x(1) - radius - 80, 0 - radius, 60, 20, 'red', t('string_id_482'));
    }



    svg.append('line')
        .attr('x1', x(1))
        .attr('y1', radius)
        .attr('x2', x(1))
        .attr('y2', y - radius)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#'+ state.markerName+ ')');
    const h = cfg.wide ? 20 : 42;
    renderTextBox(svg, x(1) + 3, y / 2 - 20, 120, h, 'red', t('string_id_483'))

    svg.append('line')
        .attr('x1', x(1) + radius)
        .attr('y1', 0)
        .attr('x2', x(17))
        .attr('y2', 0)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    renderTextBox(svg, (x(1) + radius + x(17)) / 2 - 50, -h - 5, 100, h, 'red', t('string_id_484'));

    svg.append('line')
        .attr('x1', x(17))
        .attr('y1', 0)
        .attr('x2', x(17))
        .attr('y2', y - radius)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#'+ state.markerName+ ')');
}

function renderFlow(state) {
    const cfg = getLang();
    const vertical = cfg.vertical;
    const px = cfg.px;
    const wrap = cfg.wrap;
    const wide = cfg.wide;
    const data = getRenderData(state);
    d3.select(state.container).selectAll('*').remove();
    const margin = vertical ? {top: 30, right: 30, bottom: 20, left: 30} : {top: 60, right: 30, bottom: 20, left: 30},
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const svg = d3.select(state.container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);

    // List of node names
    const allNodes = data.nodes.map(d=>d.id)

    // A linear scale to position the nodes on the X axis
    const x = d3.scalePoint()
        .range([0, width])
        .domain(allNodes)

    const y = margin.top + 80;

    const radius = 20;

    const idToNode = {};
    data.nodes.forEach(function (n) {
        idToNode[n.id] = n;
    });

    // Define the arrowhead marker
    setupArrowHead(svg, state.markerName);

    svg.selectAll('nextarrow')
        .data(data.nodes.slice(0, -1))
        .join('line')
        .attr('x1', d => x(d.id) + radius)
        .attr('y1', y)
        .attr('x2', d => x(d.id + 1) -radius)
        .attr('y2', y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#'+ state.markerName+ ')');

    // Add the circle for the nodes
    const nodes = svg
        .selectAll('mynodes')
        .data(data.nodes)
        .join('circle')
        .attr('cx', d => x(d.id))
        .attr('cy', y)
        .attr('r', radius)
        .style('fill', d => d.color)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .each(function(d) {
            d['circle'] = d3.select(this);
        });

    const numbers = svg
        .selectAll('numbers')
        .data(data.nodes)
        .join('text')
        .attr('x', d => x(d.id))
        .attr('y', y)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .each(function(d) {
            const textElement = d3.select(this);
            textElement.text(d.id);
        });

    const padding = 6;
    let w = vertical ? 24 : 60;
    let h = vertical ? 80 : 34;
    let labelBottom = y + radius + padding + h;
    const labels = svg.selectAll('labels')
        .data(data.nodes)
        .join('g')
        .attr('x', d => x(d.id))
        .attr('y', y + radius * 2)
        .each(function(d) {
            d['label'] = renderTextBox(svg, x(d.id) - w / 2, y + radius + padding, w, h, 'transparent', d.name, {vertical: vertical, size: px, wrap: wrap});
        });

    // Add the highlighting functionality
    function handleMouseOver(event, d) {
        data.nodes.forEach((node, i) => {
            if (node.fcid !== d.fcid) return;
            node.circle.transition()
                .duration(200)
                .attr('r', radius * 1.2)             // increase the radius to make it look larger
                .style('stroke', 'black')  // add a black border
                .style('stroke-width', 2); // set border thickness
            node.label.setColor('lightblue');
            if (node.ct) node.ct.setColor('lightblue');
        });
    }

    function handleMouseOut(event, d) {
        data.nodes.forEach((node, i) => {
            if (node.fcid !== d.fcid) return;
            node.label.setColor('transparent');
            node.circle.transition()
                .duration(200)
                .attr('r', radius)             // increase the radius to make it look larger
                .style('stroke', 'black')  // add a black border
                .style('stroke-width', 1); // set border thickness\
            if (node.ct) node.ct.setColor('white');
        });
    }

    nodes
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

    numbers
        .on('mouseover', function(event, d) {
            d3.select(nodes.filter(node => node.id === d.id).node())
                .each(function() { handleMouseOver.call(this, event, d); });
        })
        .on('mouseout', function(event, d) {
            d3.select(nodes.filter(node => node.id === d.id).node())
                .each(function() { handleMouseOut.call(this, event, d); });
        });

    {
        const w = vertical ? 20 : 120;
        const h = vertical ? 105 : 34;
        const yOffset = vertical ? 0 : 40
        renderTextBox(svg, -10, -radius - yOffset, w, h, 'orange', data.name, {vertical: vertical, size: px + 2});

    }

    if (state.renderEntity) {
        renderEntity(svg, x, y, radius, state);
    }


    const rendered = {};
    let first = -1;
    // Render the vertical tables
    data.nodes.forEach((node, i) => {
        if (node.fcid < 5 || node.fcid > 12) {
            return;
        }
        if (rendered[node.fcid]) return;
        rendered[node.fcid] = true;
        if (first === -1) {
            first = node.id;
        }

        const def = findMatch(node.cittas, state);
        const w = 110;
        const ty = 240 + ((node.id - first) % 2) * 110;
        svg.append('line')
            .attr('x1', x(node.id))
            .attr('y1', labelBottom)
            .attr('x2', x(node.id))
            .attr('y2', ty)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#'+ state.markerName+ ')');
        node['ct'] = renderVerticalTable(svg, x(node.id) - w / 2, ty, w, 10, def.class, def.cittas.map(c => ({'name': c})), 3);
    });

    let left = -1;
    let right = -1;
    data.nodes.forEach((node, i) => {
        if (node.fcid === 10) { // 速行
            if (left === -1) left = node.id;
            right = Math.max(right, node.id);
        }
    });
    if (left !== -1) {
        svg.append('line')
            .attr('x1', x(left))
            .attr('y1', y - radius)
            .attr('x2', x(left))
            .attr('y2', y - 4 * radius)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        svg.append('line')
            .attr('x1', x(right))
            .attr('y1', y - radius)
            .attr('x2', x(right))
            .attr('y2', y - 4 * radius)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        svg.append('line')
            .attr('x1', x(left))
            .attr('y1', y - 2 * radius)
            .attr('x2', x(right))
            .attr('y2', y - 2 * radius)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#'+ state.markerName+ ')');

        svg.append('line')
            .attr('x1', x(right))
            .attr('y1', y - 2 * radius)
            .attr('x2', x(left))
            .attr('y2', y - 2 * radius)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#'+ state.markerName+ ')');


        const w = 120;
        const h = wide ? 20 : 42;
        renderTextBox(svg, (x(left) + x(right)) / 2 - w / 2, y - 2 * radius - h- 5, w, h, 'yellow', t('string_id_486'));
    }
}

function renderButtonGroup(controlsContainer, buttonData, title, state, stateUpdater, renderer) {
    const bg = controlsContainer.append('div')
        .attr('class', 'button-group')
        .style('border', '1px solid #ccc') // Add border for separation
        .style('padding', '15px') // Add padding inside the box
        .style('border-radius', '5px') // Rounded corners
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('position', 'relative')
        .style('padding-top', '35px')
        .style('background', '#f9f9f9'); // Light background for differentiation


    bg.append('div')
        .attr('class', 'group-label')
        .text(title)
        .style('position', 'absolute')
        .style('top', '5px')
        .style('left', '10px')
        .style('font-weight', 'bold');

    bg.selectAll('button')
        .data(buttonData)
        .enter()
        .append('button')
        .text(d => d.name)
        .attr('class', d => d.id === 1 ? 'radio-button active' : 'radio-button')
        .on('click', function (event, d) {
            bg.selectAll('.radio-button').classed('active', false);
            d3.select(this).classed('active', true);
            stateUpdater(state, d);
            return renderer(state);
        });

    return bg;
}

function renderControls(state, min, max) {
    const width = 90*3;

    var slider = d3
        .sliderHorizontal()
        .min(min)
        .max(max)
        .step(1)
        .default(min)
        .tickValues(Array.from({ length: max }, (_, i) => i + 1))
        .width(width)
        .handle(d3.symbol().type(d3.symbolCircle).size(100)())
        .fill('orange')
        .on('onchange', (selection) => {
            state.sliderValue = selection;
            return renderFlow(state);
        });


    // Set up the controls container as a flexbox
    const controlsContainer = d3.select(state.controls)
        .style('display', 'flex')
        .style('gap', '20px') // Add space between the groups
        .style('align-items', 'flex-start, stretch'); // Align items to the top

    // Create a container for the slider group
    const sliderGroup = controlsContainer.append('div')
        .attr('class', 'slider-group')
        .style('border', '1px solid #ccc') // Add border for separation
        .style('padding', '15px') // Add padding inside the box
        .style('border-radius', '5px') // Rounded corners
        .style('position', 'relative')
        .style('background', '#f9f9f9'); // Light background for differentiation

    sliderGroup.append('div')
        .attr('class', 'group-label')
        .text(t('string_id_487'))
        .style('position', 'absolute')
        .style('top', '5px')
        .style('left', '10px')
        .style('font-weight', 'bold');

    // Append SVG for the slider and other graphical elements
    const svg = sliderGroup.append('svg')
        .attr('width', 400)
        .attr('height', 150);


    const lang = getLang();
    const w = lang.vertical ? 22 : 120;
    const h = lang.vertical ? 120 : 22;
    const xOffset = lang.vertical ? 0 : 120;
    renderTextBox(svg, 0, 30, w, h, 'cyan', t('string_id_488'), {vertical: lang.vertical, size: lang.px + 2});
    svg.append('g')
        .attr('transform', 'translate(60,70)')
        .call(slider);
    renderTextBox(svg, 100+width-xOffset, 30, w, h, 'cyan', t('string_id_489'), {vertical: lang.vertical, size: lang.px + 2});

    // Create a container for the button group
    renderButtonGroup(controlsContainer, [{ 'id': 1, 'name': t('string_id_490') }, { 'id': 2, 'name': t('string_id_491') }, { 'id': 3, 'name': t('string_id_492') }], t('string_id_493'), state, (state, data) => {state.likable = data.id;}, renderFlow);
    const intentButtonGroup = renderButtonGroup(controlsContainer, [{ 'id': 1, 'name': t('string_id_494') }, { 'id': 2, 'name': t('string_id_495') }], t('string_id_15'), state, (state, data) => {state.goodIntention = data.id === 1;}, renderFlow);
    renderButtonGroup(controlsContainer, [{ 'id': 1, 'name': t('string_id_496') }, { 'id': 2, 'name': t('string_id_497') }], t('string_id_498'), state, (state, data) => {
        state.arahant = data.id === 2;
        if (state.arahant) {
            intentButtonGroup.selectAll('.radio-button').attr('disabled', true);
        } else {
            intentButtonGroup.selectAll('.radio-button').attr('disabled', null);
        }
    }, renderFlow);
}
