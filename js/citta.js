let itemIndex = {};
let noteIndex = {};

function renderCittaTable(parent) {
    const rowHeaderWidth = 120;
    const columnWidths = [120, 120, 120, 220, 120, 120];
    const columnHeaderHeight = 105;
    const rowHeights = [210, 105, 90, 90];
    function renderFirstCell(parent, x, y, w, h) {
        renderCell(parent, x, y, w, h, 'lightblue');
        parent.append('line')
            .attr('x1', x) // Start of line (x-coordinate)
            .attr('y1', y) // Start of line (y-coordinate)
            .attr('x2', w) // End of line (x-coordinate)
            .attr('y2', h) // End of line (y-coordinate)
            .attr('stroke', 'grey') // Line color
            .attr('stroke-width', 1); // Line width

        // Add text to the first triangle
        renderText(parent, x, y + h/3, w * 2/3, h, data.header.row_header);
        renderText(parent, x + w/3, y, w, h * 2 / 3, data.header.column_header);
        return {
            endX: w,
            endY: h
        }
    }

    function renderColumnHeaders(parent, x, y, ws, h, color) {
        let x0 = x;
        for (let i = 0; i < 2; ++i) {
            renderTextBox(parent, x0, y, ws[i], h, color, data.columns_header[i].name);
            x0 += ws[i];
        }
        let h0 = h/3;
        for (let i = 2; i < ws.length; ++i) {
            let name = data.columns_header[2].children[Math.floor(i/4)].children[i%2].name;
            renderTextBox(parent, x0, y + h0 * 2, ws[i], h0, color, name);
            x0 += ws[i];
        }

        renderTextBox(parent, x + subArraySum(ws, 0, 2), y + h / 3, subArraySum(ws, 2, 4), h/3, color, data.columns_header[2].children[0].name);
        renderTextBox(parent, x + subArraySum(ws, 0, 4), y + h / 3, subArraySum(ws, 4, 6), h/3, color, data.columns_header[2].children[1].name);
        renderTextBox(parent, x + subArraySum(ws, 0, 2), y, subArraySum(ws, 2, 6), h / 3, color, data.columns_header[2].name);
    }

    function renderRowHeaders(parent, x, y, w, hs) {
        let y0 = y;
        for (let i = 0; i < hs.length; i++) {
            renderTextBox(parent, x, y0, w, hs[i], 'lightcyan', data.rows_header[i]);
            y0 += hs[i];
        }
    }

    function renderGridCells(parent, x, y, ws, hs) {
        let y0 = y;
        let x0;
        for (let rowIndex = 0; rowIndex < hs.length; rowIndex++) {
            x0 = x;
            const rowHeight = hs[rowIndex];
            for (let colIndex = 0; colIndex < ws.length; colIndex++) {
                const columnWidth = ws[colIndex];
                renderCell(parent, x0, y0, columnWidth, rowHeight, 'white');

                let cittasIndexes = data.cells_citta_group[rowIndex][colIndex];
                cittasIndexes.forEach((cittaIndex, index) => {
                    const offsetX = cittasIndexes.length === 1 ? x0 : x0 + index * columnWidth / 2;
                    const width = cittasIndexes.length === 1 ? columnWidth : columnWidth / 2;
                    renderVerticalTable(parent, offsetX, y0, width, rowHeight, cittas.children[cittaIndex].name, cittas.children[cittaIndex].children, 5, itemIndex);
                });
                x0 += columnWidth;
            }
            y0 += rowHeight;
        }
        return {
            endX: x0,
            endY: y0,
        }
    }

    const fs = renderFirstCell(parent, 0, 0, rowHeaderWidth, columnHeaderHeight);
    renderColumnHeaders(parent, fs.endX, 0, columnWidths, columnHeaderHeight, 'lightcyan');
    renderRowHeaders(parent, 0, fs.endY, rowHeaderWidth, rowHeights);
    const gc = renderGridCells(parent, fs.endX, fs.endY, columnWidths, rowHeights);

    return {
        endX: gc.endX,
        endY: gc.endY
    };
}

const cetasikaIdIndex = {};
function renderCetasikaCell(x, y, w, h, text) {
  const itemGroup = renderTextBox(cittaSvg, x, y, w, h, 'white', '', {size: '12px', align: 'middle', valign: 'top'});

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
function renderCetasikaTable(y) {
  let columnWidth = 25;
  let rowHeight = 30;
  renderTextBox(cittaSvg, 0, y, columnWidth * 52, rowHeight, 'lightcyan', cetasika.name, {size: '12px', align: 'middle'});
  renderTextBox(cittaSvg, 0, y + rowHeight, columnWidth * 13, rowHeight, 'lightcyan', cetasika.children[0].name, {size: '12px', align: 'middle'});
  renderTextBox(cittaSvg, columnWidth * 13, y + rowHeight, columnWidth * 14, rowHeight, 'lightcyan', cetasika.children[1].name, {size: '12px', align: 'middle'});
  renderTextBox(cittaSvg, columnWidth * 27, y + rowHeight, columnWidth * 25, rowHeight, 'lightcyan', cetasika.children[2].name, {size: '12px', align: 'middle'});

  let x = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < cetasika.children[i].children.length; j++) {
      let n = cetasika.children[i].children[j].children.length;
      renderTextBox(cittaSvg, x, y + rowHeight * 2, columnWidth * n, rowHeight, 'lightcyan', cetasika.children[i].children[j].name, {size: '12px', align: 'middle'});
      x += columnWidth * n;
    }
  }

  x = 0;
  cetasika.children.forEach(group => {
    group.children.forEach(subGroup => {
      subGroup.children.forEach(child => {
        let name = child.name;
        cetasikaIdIndex[name] = child.id;
        itemIndex[child.id] = renderCetasikaCell(x, y + rowHeight * 3, columnWidth, rowHeight * 2.5, name);
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
  cetasikaTableBottom = y + rowHeight * 5.5;
}

const subH = 30;
const subPadding = 6;
function renderSubTableV2(x, y, def) {
    const names = def.names;
    let widths = [];
    for (let i = 0; i < names.length; ++i) {
        widths = widths.concat([getWordLength(names[i], 12)]);
    }
    let total = subArraySum(widths, 0, widths.length);

    const h = subH;
    renderTextBox(cittaSvg, x, y, total, h, 'lightcyan', def.title, {size: '14px', align: 'middle'});
    let x0 = x;
    for (let i = 0; i < names.length; ++i) {
        let item = renderTextBox(cittaSvg, x0, y + h, widths[i], h, 'white', names[i], {size: '12px', align: 'middle'});
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
    renderTextBox(cittaSvg, x, y, w, h, 'lightcyan', '相应法', {size: '14px', align: 'middle'});
    renderTextBox(cittaSvg, x + w, y, w, h, 'lightcyan', '可选', {size: '14px', align: 'middle'});
    let counterTextBox = renderTextBox(cittaSvg, x, y + h, w, h, 'white', '', {size: '12px', align: 'middle'});
    let optCounterTextBox = renderTextBox(cittaSvg, x + w, y + h, w, h, 'white', '', {size: '12px', align: 'middle'});
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
    renderTextBox(cittaSvg, x, y + h0, w, h, 'lightcyan', '特相', {size: '14px', align: 'middle'});
    renderTextBox(cittaSvg, x, y + h0 + h, w, h, 'lightcyan', '作用', {size: '14px', align: 'middle'});
    renderTextBox(cittaSvg, x, y + h0 + 2 * h, w, h, 'lightcyan', '现起', {size: '14px', align: 'middle'});
    renderTextBox(cittaSvg, x, y + h0 + 3 * h, w, h, 'lightcyan', '近因', {size: '14px', align: 'middle'});
    let w0 = 320;
    let charTextBox = renderTextBox(cittaSvg, x + w, y + h0, w0, h, 'white', '', {size: '12px', align: 'middle'});
    let functionTextBox = renderTextBox(cittaSvg, x + w, y + h0 + h, w0, h, 'white', '', {size: '12px', align: 'middle'});
    let appearanceTextBox = renderTextBox(cittaSvg, x + w, y + h0 + 2 * h, w0, h, 'white', '', {size: '12px', align: 'middle'});
    let proximateCauseTextBox = renderTextBox(cittaSvg, x + w, y + h0 + 3 * h, w0, h, 'white', '', {size: '12px', align: 'middle'});
    renderTextBox(cittaSvg, x, y, w + w0, h0, 'lightcyan', '心所注释', {size: '14px', align: 'middle'});
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

/** itemIndex is populated by now **/
function calculateConnections() {
    let itemConnections = {};
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
    return itemConnections;
}

cittaSvg.append('a')
    .attr('xlink:href', 'https://github.com/juncoflockleader/Abhidharma') // Use xlink:href for SVG links
    .append('text')
    .attr('x', 0) // Set x position
    .attr('y', cetasikaTableBottom + 20) // Set y position
    .text('Repo: https://github.com/juncoflockleader/Abhidharma')
    .style('font-size', '16px') // Set font size
    .style('fill', 'blue'); // Set text color

cittaSvg.append('a')
    .attr('xlink:href', 'https://juncoflockleader.github.io/Abhidharma/') // Use xlink:href for SVG links
    .append('text')
    .attr('x', 0) // Set x position
    .attr('y', cetasikaTableBottom + 40) // Set y position
    .text('This page: https://juncoflockleader.github.io/Abhidharma/')
    .style('font-size', '16px') // Set font size
    .style('fill', 'blue'); // Set text color0px');

function setupHighlightsBehavior(cntt, ntt) {
    let locked = false;
    let lockedItem = null;
    let clearFunc = null;
    const itemGraph = calculateConnections();
    for (let itemId in itemGraph) {
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

        let connections = itemGraph[itemId];
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