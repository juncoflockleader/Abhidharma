// Set up SVG container
const rowHeaderWidth = 120;
const columnWidths = [120, 120, 120, 220, 120, 120];
const columnHeaderHeight = 105;
const rowHeights = [210, 105, 105, 105];
const cittaTableColumns = 6;
const cittaTableRows = 4;
const tableWidth = rowHeaderWidth + columnWidths.reduce((accumulator, v) => accumulator + v, 0);
const tableHeight = columnHeaderHeight + rowHeights.reduce((accumulator, v) => accumulator + v, 0);
const svgWidth = 1600;
const svgHeight = 1200;

let itemIndex = {};
let noteIndex = {};
let itemConnections = {};

let locked = false;
let lockedItem = null;
let clearFunc = null;

const tooltip = d3.select("#tooltip");

const svg = d3.select('body').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

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
    const rx = (params.align == 'middle' ? x + w / 2 : x) + (params.padding ? params.padding : 0);
    const ry = params.valign == 'top' ? y : y + h / 2;
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

/** Render the Citta Table Headers **/
function renderFirstCell() {
    const columnWidth = rowHeaderWidth;
    const rowHeight = columnHeaderHeight;
  renderCell(svg, 0, 0, columnWidth, rowHeight, 'lightblue');
  svg.append('line')
      .attr('x1', 0) // Start of line (x-coordinate)
      .attr('y1', 0) // Start of line (y-coordinate)
      .attr('x2', columnWidth) // End of line (x-coordinate)
      .attr('y2', rowHeight) // End of line (y-coordinate)
      .attr('stroke', 'grey') // Line color
      .attr('stroke-width', 1); // Line width

    // Add text to the first triangle
    renderText(svg, 0, rowHeight * 1/3, columnWidth * 2/3, rowHeight, data.header.row_header);
    renderText(svg, columnWidth * 1/3, 0, columnWidth, rowHeight * 2 / 3, data.header.column_header);
}

function subArraySum(array, start, end) {
    let result = 0;
    for (let i = start; i < end; ++i) {
        result += array[i];
    }
    return result;
}

function renderColumnHeaders() {
    const rowHeight = columnHeaderHeight;
    let x = rowHeaderWidth;
    for (let i = 0; i < cittaTableColumns; ++i) {
        let y = i >= 2 ? rowHeight / 3 * 2 : 0;
        let height = i >= 2 ? rowHeight / 3 : rowHeight;
        let name = i >= 2 ? data.columns_header[2].children[i < 4 ? 0 : 1].children[i % 2].name : data.columns_header[i].name;
        renderTextBox(svg, x, y, columnWidths[i], height, 'lightcyan', name);
        x += columnWidths[i];
    }

    renderTextBox(svg, rowHeaderWidth + subArraySum(columnWidths, 0, 2), rowHeight / 3, subArraySum(columnWidths, 2, 4), rowHeight/3, 'lightcyan', data.columns_header[2].children[0].name);
    renderTextBox(svg, rowHeaderWidth + subArraySum(columnWidths, 0, 4), rowHeight / 3, subArraySum(columnWidths, 4, 6), rowHeight/3, 'lightcyan', data.columns_header[2].children[1].name);
    renderTextBox(svg, rowHeaderWidth + subArraySum(columnWidths, 0, 2), 0, subArraySum(columnWidths, 2, 6), rowHeight / 3, 'lightcyan', data.columns_header[2].name);
}


function renderRowHeaders() {
    const columnWidth = rowHeaderWidth;
    for (let i = 0; i < cittaTableRows; i++) {
        const rowHeight = rowHeights[i];
        renderTextBox(svg, 0, columnHeaderHeight + subArraySum(rowHeights, 0, i), columnWidth, rowHeight, 'lightcyan', data.rows_header[i]);
    }
}

/** Fill in the Citta Table **/
function renderGridCells() {
    let y = columnHeaderHeight;
    for (let rowIndex = 0; rowIndex < cittaTableRows; rowIndex++) {
        let x = rowHeaderWidth;
        const rowHeight = rowHeights[rowIndex];
        for (let colIndex = 0; colIndex < cittaTableColumns; colIndex++) {
            const columnWidth = columnWidths[colIndex];
            renderCell(svg, x, y, columnWidth, rowHeight, 'white');

            let cittasIndexes = data.cells_citta_group[rowIndex][colIndex];
            cittasIndexes.forEach((cittaIndex, index) => {
                const offsetX = cittasIndexes.length === 1 ? x : x + index * columnWidth / 2;
                const width = cittasIndexes.length === 1 ? columnWidth : columnWidth / 2;
                createTableInCell(offsetX, y, width, rowHeight, cittas, cittaIndex);
            });
            x += columnWidth;
        }
        y += rowHeight;
    }
}

function createTableInCell(cellX, cellY, cellWidth, cellHeight, cittas, index) {
  // Define the table's header and item height
  const headerHeight = 20;
  const rowHeight = 15;

  // Create a group for the table
  const tableGroup = svg.append('g')
      .attr('transform', `translate(${cellX}, ${cellY})`);

  const cittaGroup = cittas.children[index];
  let padding = 5;
  // Draw the header row
  renderTextBox(tableGroup, padding, padding, cellWidth - padding * 2, headerHeight, 'lightgrey', cittaGroup.name, {size: '12px', 'padding': padding, align: 'left'});
  // Loop through the data items and draw each row
  cittaGroup.children.forEach((item, index) => {
    const yPosition = padding + headerHeight + index * rowHeight;
    const itemGroup = renderTextBox(tableGroup, padding, yPosition, cellWidth - padding * 2, rowHeight, 'white', item.name, {size: '10px', 'padding': padding, align: 'left'});
    itemIndex[item.id] = itemGroup;
  });
}

function updateTooltipContent(tooltip, data) {
  tooltip.selectAll("*").remove(); // Clear previous content

  let yPos = 20; // Base y position for the first line; adjust as needed
  const lineHeight = 20; // Height of each line; adjust as needed

  const textGroup = tooltip.append("text")
      .attr("x", 10); // Horizontal position; adjust as needed

  const lines = [
  ];

  lines.forEach((line, index) => {
    textGroup.append("tspan")
        .attr("x", 10) // Align all tspans to the same x position
        .attr("y", yPos + index * lineHeight) // Set fixed y position for each line
        .text(line + '\n');
  });
}

const cetasikaIdIndex = {};
function renderCetasikaCell(x, y, w, h, text, counterTable) {
  const itemGroup = renderTextBox(svg, x, y, w, h, 'white', '', {size: '12px', align: 'middle', valign: 'top'});

  // Split the text into characters and create a tspan for each
  text.split('').forEach((char, index) => {
    itemGroup.select('text').append('tspan')
        .attr('x', x + w / 2) // Align all tspans to the center of the cell
        .attr('dy', '1em') // Move each character to a new line; adjust as needed
        .text(char);
  });

  return itemGroup;
}

let cetasikaTableBottom = 0;
function renderCetasikaTable(counterTable) {
  let yoffset = 20;
  let columnWidth = 25;
  let rowHeight = 30;
  renderTextBox(svg, 0, tableHeight + yoffset, columnWidth * 52, rowHeight, 'lightcyan', cetasika.name, {size: '12px', align: 'middle'});
  renderTextBox(svg, 0, tableHeight + yoffset + rowHeight, columnWidth * 13, rowHeight, 'lightcyan', cetasika.children[0].name, {size: '12px', align: 'middle'});
  renderTextBox(svg, columnWidth * 13, tableHeight + yoffset + rowHeight, columnWidth * 14, rowHeight, 'lightcyan', cetasika.children[1].name, {size: '12px', align: 'middle'});
  renderTextBox(svg, columnWidth * 27, tableHeight + yoffset + rowHeight, columnWidth * 25, rowHeight, 'lightcyan', cetasika.children[2].name, {size: '12px', align: 'middle'});

  let x = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < cetasika.children[i].children.length; j++) {
      let n = cetasika.children[i].children[j].children.length;
      renderTextBox(svg, x, tableHeight + yoffset + rowHeight * 2, columnWidth * n, rowHeight, 'lightcyan', cetasika.children[i].children[j].name, {size: '12px', align: 'middle'});
      x += columnWidth * n;
    }
  }

  x = 0;
  cetasika.children.forEach(group => {
    group.children.forEach(subGroup => {
      subGroup.children.forEach(child => {
        let name = child.name;
        cetasikaIdIndex[name] = child.id;
        let item = renderCetasikaCell(x, tableHeight + yoffset + rowHeight * 3, columnWidth, rowHeight * 2.5, name, counterTable);
        itemIndex[child.id] = item;
        noteIndex[child.id] = {
            "char_mark": child.char_mark,
            "function": child.function,
            "appearance": child.appearance,
            "proximate_cause": child.proximate_cause,
        };
        x += columnWidth;
      });
    });
  });
  cetasikaTableBottom = tableHeight + yoffset + rowHeight * 5.5;
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

const feelingTableX = tableWidth + 20;

const subW = 20;
const subH = 30;
const subPadding = 12;
function renderSubTableV2(x, y, def) {
    const names = def.names;
    let widths = [];
    for (let i = 0; i < names.length; ++i) {
        widths = widths.concat([getWordLength(names[i], 12)]);
    }
    let total = subArraySum(widths, 0, widths.length);

    const h = subH;
    renderTextBox(svg, x, y, total, h, 'lightcyan', def.title, {size: '14px', align: 'middle'});
    let x0 = x;
    for (let i = 0; i < names.length; ++i) {
        let item = renderTextBox(svg, x0, y + h, widths[i], h, 'white', names[i], {size: '12px', align: 'middle'});
        itemIndex[def['index_base'] + i + 1] = item;
        x0 += widths[i];
    }
    return {
        endX: x + total,
        endY: y + 2 * subH
    };
}

function renderFeelingTable(x, y) {
    return renderSubTableV2(x, y, feelings);
}

function renderCauseTable(x, y) {
    return renderSubTableV2(x, y, causes);
}

function renderTimeTable(x, y) {
    return renderSubTableV2(x, y, times);
}

function renderFiveObjectsTable(x, y) {
    return renderSubTableV2(x, y, objects);
}

function renderMentalObjectsTable(x, y) {
    return renderSubTableV2(x, y, mental_objects);
}

function renderRealmTable(x, y) {
    return renderSubTableV2(x, y, realms);
}

function renderGateTable(x, y) {
    return renderSubTableV2(x, y, gates);
}

function renderBasisTable(x, y) {
    return renderSubTableV2(x, y, basis);
}

function renderFunctionTable(x, y) {
    return renderSubTableV2(x, y, functions);
}

function renderCounterTable(x, y) {
    let w = 60;
    let h = 30;
    renderTextBox(svg, x, y, w, h, 'lightcyan', '相应法', {size: '14px', align: 'middle'});
    renderTextBox(svg, x + w, y, w, h, 'lightcyan', '可选', {size: '14px', align: 'middle'});
    let counterTextBox = renderTextBox(svg, x, y + h, w, h, 'white', '', {size: '12px', align: 'middle'});
    let optCounterTextBox = renderTextBox(svg, x + w, y + h, w, h, 'white', '', {size: '12px', align: 'middle'});
    return {
        update: function (counter, optCounter) {
            counterTextBox.setText(counter.toString());
            optCounterTextBox.setText(optCounter.toString());
        },
        clear: function () {
            counterTextBox.setText('');
            optCounterTextBox.setText('');
        },
        endX: x + w * 2,
        endY: y + h * 2
    }
}

function renderNoteTable(x, y) {
    let h0 = 20;

    let w = 30;
    let h = 30;
    renderTextBox(svg, x, y + h0, w, h, 'lightcyan', '特相', {size: '14px', align: 'middle'});
    renderTextBox(svg, x, y + h0 + h, w, h, 'lightcyan', '作用', {size: '14px', align: 'middle'});
    renderTextBox(svg, x, y + h0 + 2 * h, w, h, 'lightcyan', '现起', {size: '14px', align: 'middle'});
    renderTextBox(svg, x, y + h0 + 3 * h, w, h, 'lightcyan', '近因', {size: '14px', align: 'middle'});
    let w0 = 320;
    let charTextBox = renderTextBox(svg, x + w, y + h0, w0, h, 'white', '', {size: '12px', align: 'middle'});
    let functionTextBox = renderTextBox(svg, x + w, y + h0 + h, w0, h, 'white', '', {size: '12px', align: 'middle'});
    let appearanceTextBox = renderTextBox(svg, x + w, y + h0 + 2 * h, w0, h, 'white', '', {size: '12px', align: 'middle'});
    let proximateCauseTextBox = renderTextBox(svg, x + w, y + h0 + 3 * h, w0, h, 'white', '', {size: '12px', align: 'middle'});
    renderTextBox(svg, x, y, w + w0, h0, 'lightcyan', '心所注释', {size: '14px', align: 'middle'});
    return {
        update: function (itemId) {
            if (noteIndex[itemId]) {
                charTextBox.setText(noteIndex[itemId].char_mark);
                functionTextBox.setText(noteIndex[itemId].function);
                appearanceTextBox.setText(noteIndex[itemId].appearance);
                proximateCauseTextBox.setText(noteIndex[itemId].proximate_cause);
            }
        },
        clear: function () {
            charTextBox.setText('');
            functionTextBox.setText('');
            appearanceTextBox.setText('');
            proximateCauseTextBox.setText('');
        },
        endX: x + w,
        endY: y + h
    };
}

const fet = renderFeelingTable(feelingTableX, 0);
const ct = renderCauseTable(fet.endX + subPadding, 0);
const tt = renderTimeTable(feelingTableX, subPadding + ct.endY);
const fot = renderFiveObjectsTable(tt.endX + subPadding, subPadding + ct.endY);
const mot = renderMentalObjectsTable(feelingTableX, tt.endY + subPadding);
const rt = renderRealmTable(feelingTableX, mot.endY + subPadding);
const gt = renderGateTable(rt.endX + subPadding, mot.endY + subPadding);
const bt = renderBasisTable(feelingTableX, gt.endY + subPadding);
const ft = renderFunctionTable(feelingTableX, bt.endY + subPadding);
const cntt = renderCounterTable(feelingTableX, ft.endY + subPadding);
const ntt = renderNoteTable(feelingTableX, cntt.endY + subPadding);
renderCetasikaTable(cntt);
renderFirstCell();
renderColumnHeaders();
renderRowHeaders();
renderGridCells();

/** itemIndex is populated by now **/
function calculateConnections() {
    cittas.children.forEach((cittaGroup, index) => {
        let groupAttrs = {
            cetasika: (cittas.cetasika || []).concat(cittaGroup.cetasika || []),
            category: cittaGroup.category || null,
            roots: cittaGroup.roots || [],
            functions: cittaGroup.functions || [],
            gates: cittaGroup.gates || [],
            objects: cittaGroup.objects || [],
            mental_objects: cittaGroup.mental_objects || [],
            object_time: cittaGroup.object_time || [],
            basis: cittaGroup.basis || null,
            realms: cittaGroup.realms || [],
            feeling: cittaGroup.feeling || null,
            cetasika_opt: (cittas.cetasika_opt || []).concat(cittaGroup.cetasika_opt || [])
        };

        // Loop through the data items and draw each row
        cittaGroup.children.forEach((item, index) => {
            function getIndex(def) {
                let idIndex = {};
                def.names.forEach((name, index) => {
                    idIndex[name] = def.index_base + index + 1;
                });
                return idIndex;
            }

            function addConnection(id, item_names, from_color, to_color, idIndex, params={reverse_color:false, opt:false}) {
                let reverse_color = params.reverse_color;
                if (!itemConnections[id]) {
                    itemConnections[id] = {'from_color': from_color, 'connection_groups': [], counter: 0, opt_counter: 0};
                }
                let ids = [];
                item_names.forEach(name => {
                    let fc = reverse_color ?  to_color : from_color;
                    let tc = reverse_color ?  from_color : to_color;
                    let to_id = idIndex[name];
                    ids.push(to_id);
                    if (!itemConnections[to_id]) {
                        itemConnections[to_id] = {'from_color': tc, 'connection_groups': [], counter: 0, opt_counter: 0};
                    }
                    let connectionGroup = itemConnections[to_id].connection_groups.find(group => group.to_color === fc);
                    if (connectionGroup) {
                        connectionGroup.ids.push(id);
                    } else {
                        itemConnections[to_id].connection_groups.push({'to_color': fc, 'ids': [id]});
                    }
                    if (params.opt) {
                        itemConnections[to_id].opt_counter++;
                    } else {
                        itemConnections[to_id].counter++;
                    }
                });
                itemConnections[id].connection_groups.push({'to_color':to_color, 'ids': ids});
                if (params.opt) {
                    itemConnections[id].opt_counter += ids.length;
                } else {
                    itemConnections[id].counter += ids.length;
                }
            }

            const item_cetasika = groupAttrs.cetasika.concat(item.cetasika || []);
            addConnection(item.id, item_cetasika, 'yellow', 'yellow', cetasikaIdIndex);
            const item_cetasika_opt = groupAttrs.cetasika_opt.concat(item.cetasika_opt || []);
            addConnection(item.id, item_cetasika_opt, 'yellow', 'lightyellow', cetasikaIdIndex, {reverse_color: true, opt: true});
            const item_category = item.category || groupAttrs.category || [];
            const item_roots = groupAttrs.roots.concat(item.roots || []);
            addConnection(item.id, item_roots, 'yellow', 'lavender', getIndex(causes));

            const item_functions = groupAttrs.functions.concat(item.functions || []);
            addConnection(item.id, item_functions, 'yellow', 'orange', getIndex(functions));

            const item_gates = groupAttrs.gates.concat(item.gates || []);
            addConnection(item.id, item_gates, 'yellow', 'pink', getIndex(gates));

            const item_objects = groupAttrs.objects.concat(item.objects || []);
            addConnection(item.id, item_objects, 'yellow', 'lightgreen', getIndex(objects));

            const item_mental_objects = groupAttrs.mental_objects.concat(item.mental_objects || []);
            addConnection(item.id, item_mental_objects, 'yellow', 'lightblue', getIndex(mental_objects));

            const item_object_time = groupAttrs.object_time.concat(item.object_time || []);
            addConnection(item.id, item_object_time, 'yellow', 'lavender', getIndex(times));

            const item_basis = item.basis || groupAttrs.basis ? [item.basis || groupAttrs.basis] : [];
            addConnection(item.id, item_basis, 'yellow', 'lightblue', getIndex(basis));

            const item_realms = groupAttrs.realms.concat(item.realms || []);
            addConnection(item.id, item_realms, 'yellow', 'violet', getIndex(realms));

            const item_feeling = item.feeling || groupAttrs.feeling ? [item.feeling || groupAttrs.feeling] : [];
            addConnection(item.id, item_feeling, 'yellow', 'tomato', getIndex(feelings));
        });
    });
}

svg.append('a')
    .attr('xlink:href', 'https://github.com/juncoflockleader/Abhidharma') // Use xlink:href for SVG links
    .append('text')
    .attr('x', 0) // Set x position
    .attr('y', cetasikaTableBottom + 20) // Set y position
    .text('Repo: https://github.com/juncoflockleader/Abhidharma')
    .style('font-size', '16px') // Set font size
    .style('fill', 'blue'); // Set text color

svg.append('a')
    .attr('xlink:href', 'https://juncoflockleader.github.io/Abhidharma/') // Use xlink:href for SVG links
    .append('text')
    .attr('x', 0) // Set x position
    .attr('y', cetasikaTableBottom + 40) // Set y position
    .text('This page: https://juncoflockleader.github.io/Abhidharma/')
    .style('font-size', '16px') // Set font size
    .style('fill', 'blue'); // Set text color0px');

function setupHighlightsBehavior() {
    calculateConnections();
    for (let itemId in itemConnections) {
        function highlightsConnections(connections) {
            function setHighlights(connections, clear=false) {
                let color = clear ? 'white' : connections.from_color
                highlightsTextBox(itemIndex[itemId], color);
                if (!clear) {
                    cntt.update(connections.counter, connections.opt_counter);
                    ntt.update(itemId);
                }
                else {
                    cntt.clear();
                    ntt.clear();
                }
                connections.connection_groups.forEach(connection => {
                    connection.ids.forEach(id => {
                        let color = clear ? 'white' : connection.to_color;
                        highlightsTextBox(itemIndex[id], color);
                    });
                });
            }
            setHighlights(connections);
            clearFunc = function() {
                setHighlights(connections, true);
            }
        }

        let connections = itemConnections[itemId];
        let item = itemIndex[itemId];
        item.on("mouseover", function(event, d) {
            if (locked) return;
            highlightsConnections(connections);
        })
        .on("mousemove", function(event) {
        })
        .on("mouseout", function() {
            if (locked) return;
            if (clearFunc) clearFunc();
        })
        .on("click", function() {
            if (locked && lockedItem === this) {
                locked = false;
                lockedItem = null;
                if (clearFunc) clearFunc();
            } else {
                if (locked && clearFunc) {
                    clearFunc();
                }
                locked = true;
                lockedItem = this;
                highlightsConnections(connections);
            }
        });
    }
}

setupHighlightsBehavior();
