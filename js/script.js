
// Set up SVG container
const rowHeaderWidth = 120;
const columnWidths = [120, 120, 120, 220, 120, 120];
const columnHeaderHeight = 105;
const rowHeights = [210, 105, 105, 105];
const columns = 6;
const rows = 4;
const tableWidth = rowHeaderWidth + columnWidths.reduce((accumulator, v) => accumulator + v, 0);
const tableHeight = columnHeaderHeight + rowHeights.reduce((accumulator, v) => accumulator + v, 0);
const svgWidth = 1600;
const svgHeight = 1200;

const tooltip = d3.select("#tooltip");

const svg = d3.select('body').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

function renderCell(obj, x, y, w, h, color) {
    return obj.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('fill', color);
}

function renderText(obj, x, y, w, h, text, params={size: '16px', align:'middle'}) {
    const rx = params.align == 'middle' ? x + w / 2 : x;
    const ry = y + h / 2;
    return obj.append('text')
        .attr('x', rx)
        .attr('y', ry)
        .attr('text-anchor', params.align)
        .attr('dominant-baseline', 'central')
        .text(text)
        .attr('font-size', params.size);
}

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

function renderHeader(x, y, w, h, text) {
  renderCell(svg, x, y, w, h, 'lightcyan');
  renderText(svg, x, y, w, h, text);
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
    for (let i = 0; i < columns; ++i) {
        let y = i >= 2 ? rowHeight / 3 * 2 : 0;
        let height = i >= 2 ? rowHeight / 3 : rowHeight;
        let name = i >= 2 ? data.columns_header[2].children[i < 4 ? 0 : 1].children[i % 2].name : data.columns_header[i].name;
        renderHeader(x, y, columnWidths[i], height, name);
        x += columnWidths[i];
    }

    renderHeader(rowHeaderWidth + subArraySum(columnWidths, 0, 2), rowHeight / 3, subArraySum(columnWidths, 2, 4), rowHeight/3, data.columns_header[2].children[0].name);
    renderHeader(rowHeaderWidth + subArraySum(columnWidths, 0, 4), rowHeight / 3, subArraySum(columnWidths, 4, 6), rowHeight/3, data.columns_header[2].children[1].name);
    renderHeader(rowHeaderWidth + subArraySum(columnWidths, 0, 2), 0, subArraySum(columnWidths, 2, 6), rowHeight / 3, data.columns_header[2].name);
}


function renderRowHeaders() {
    const columnWidth = rowHeaderWidth;
    for (let i = 0; i < rows; i++) {
        const rowHeight = rowHeights[i];
      renderHeader(0, columnHeaderHeight + subArraySum(rowHeights, 0, i), columnWidth, rowHeight, data.rows_header[i]);
    }
}

let cetasikaIndex = {};
function createTableInCell(cellX, cellY, cellWidth, cellHeight, cittas, index) {
  // Define the table's header and item height
  const headerHeight = 20;
  const rowHeight = 15;

  // Create a group for the table
  const tableGroup = svg.append('g')
      .attr('transform', `translate(${cellX}, ${cellY})`);

  let attrs = {
    cetasika: cittas.cetasika || [],
  };

  const cittaGroup = cittas.children[index];
  attrs.cetasika = attrs.cetasika.concat(cittaGroup.cetasika || []);
  attrs.category = cittaGroup.category || null;
  attrs.roots = cittaGroup.roots || [];
  attrs.functions = cittaGroup.functions || [];
  attrs.gates = cittaGroup.gates || [];
  attrs.objects = cittaGroup.objects || [];
  attrs.mental_objects = cittaGroup.mental_objects || [];
  attrs.object_time = cittaGroup.object_time || [];
  attrs.basis = cittaGroup.basis || null;
  attrs.realms = cittaGroup.realms || [];
  attrs.feeling = cittaGroup.feeling || null;
  attrs.cetasika_opt_ext = cittaGroup.cetasika_opt_ext || [];
  let padding = 5;
  // Draw the header row
  renderCell(tableGroup, padding, padding, cellWidth - padding * 2, headerHeight, 'lightgrey');
  renderText(tableGroup, padding * 2, padding, cellWidth - padding * 2, headerHeight, cittaGroup.name, {size: '12px', align: 'left'});

  // Loop through the data items and draw each row
  cittaGroup.children.forEach((item, index) => {
    const cetasika = attrs.cetasika.concat(item.cetasika || []);
    const cetasika_opt_ext = attrs.cetasika_opt_ext.concat(item.cetasika_opt_ext || []);
    const itemGroup = tableGroup.append('g')
        .classed('table-cell', true)
        .datum({
          category: item.category || attrs.category ||  null,
          cetasika: cetasika,
          roots: attrs.roots.concat(item.roots || []),
          functions: attrs.functions.concat(item.functions || []),
          gates: attrs.gates.concat(item.gates || []),
          objects: attrs.objects.concat(item.objects || []),
          mental_objects: attrs.mental_objects.concat(item.mental_objects || []),
          object_time: attrs.object_time.concat(item.object_time || []),
          basis: item.basis || attrs.basis || null,
          realms: attrs.realms.concat(item.realms || []),
          cetasika_opt_ext: cetasika_opt_ext,
          feeling: item.feeling || attrs.feeling || null
        });

    const yPosition = padding + headerHeight + index * rowHeight;
    const cell = renderCell(itemGroup, padding, yPosition, cellWidth - padding * 2, rowHeight, 'white');
    cetasika.forEach(
        c => {
            if(!cetasikaIndex[c]) cetasikaIndex[c] = {
                cittas: [],
                cittas_opt: []
            };
            cetasikaIndex[c].cittas.push(cell);
        }
    );
    cetasika_opt_ext.forEach(
        c => {
            if(!cetasikaIndex[c]) cetasikaIndex[c] = {
                cittas: [],
                cittas_opt: []
            };
            cetasikaIndex[c].cittas_opt.push(cell);
        }
    );
      
    renderText(itemGroup, padding * 2, yPosition, cellWidth - padding * 2, rowHeight, item.name, {size: '10px', align: 'left'});
  });
}

function renderGridCells() {
    let y = columnHeaderHeight;
    // Loop through each row
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let x = rowHeaderWidth;
        const rowHeight = rowHeights[rowIndex];
        // Loop through each column
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            // Calculate x and y position for the cell
            const columnWidth = columnWidths[colIndex];
            // Render the cell with a default color
            renderCell(svg, x, y, columnWidth, rowHeight, 'white');

            let cittasIndexes = data.cells_citta_group[rowIndex][colIndex];
            if (cittasIndexes.length === 1) {
              createTableInCell(x, y, columnWidth, rowHeight, cittas, cittasIndexes[0]);
            } else {
                cittasIndexes.forEach((cittaIndex, index) => {
                    createTableInCell(x  + index * columnWidth / 2, y, columnWidth / 2, rowHeight, cittas, cittaIndex);
                });
            }
            x += columnWidth;
        }
        y += rowHeight;
    }
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

function renderCetasikaHeader(x, y, w, h, text) {
  renderCell(svg, x, y, w, h, 'lightcyan');
  renderText(svg, x, y, w, h, text, {size: '12px', align: 'middle'});
}

function renderCetasikaCell(x, y, w, h, text) {
  let cell = renderCell(svg, x, y, w, h, 'white');
  cell.attr('class', 'cetasika-cell');

  // Start text at the top of the cell
  const textElement = renderText(svg, x, y, w, 0, "", {size: '12px', align: 'middle'});
  svg.append('text')
      .attr('x', x + w / 2) // Center the text horizontally in the cell
      .attr('y', y) // Start text at the top of the cell
      .attr('text-anchor', 'middle') // Center the text at the specified (x, y) position
      .attr('font-size', '12px');

  // Split the text into characters and create a tspan for each
  text.split('').forEach((char, index) => {
    textElement.append('tspan')
        .attr('x', x + w / 2) // Align all tspans to the center of the cell
        .attr('dy', '1em') // Move each character to a new line; adjust as needed
        .text(char);
  });

  cell.on("mouseover", function(event, d) {
      cell.attr('fill', 'yellow');
      cetasikaIndex[text].cittas.forEach(c => {
          c.attr('fill', 'yellow');
      });
      cetasikaIndex[text].cittas_opt.forEach(c => {
          c.attr('fill', 'lightyellow');
      });
    })
    .on("mousemove", function(event) {
    })
    .on("mouseout", function() {
      cell.attr('fill', 'white');
      cetasikaIndex[text].cittas.forEach(c => {
          c.attr('fill', 'white');
      });
      cetasikaIndex[text].cittas_opt.forEach(c => {
          c.attr('fill', 'white');
      });
    });

  return cell;
}

let cetasikaLookup = {};
function renderCetasikaTable() {
  let yoffset = 20
  let columnWidth = 25;
  let rowHeight = 30;
  renderCetasikaHeader(0, tableHeight + yoffset, columnWidth * 52, rowHeight, cetasika.name);
  renderCetasikaHeader(0, tableHeight + yoffset + rowHeight, columnWidth * 13, rowHeight, cetasika.children[0].name);
  renderCetasikaHeader(columnWidth * 13, tableHeight + yoffset + rowHeight, columnWidth * 14, rowHeight, cetasika.children[1].name);
  renderCetasikaHeader(columnWidth * 27, tableHeight + yoffset + rowHeight, columnWidth * 25, rowHeight, cetasika.children[2].name);


  let x = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < cetasika.children[i].children.length; j++) {
      let n = cetasika.children[i].children[j].children.length;
      renderCetasikaHeader(x, tableHeight + yoffset + rowHeight * 2, columnWidth * n, rowHeight, cetasika.children[i].children[j].name);
      x += columnWidth * n;
    }
  }


  x = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < cetasika.children[i].children.length; j++) {
      for (let k = 0; k < cetasika.children[i].children[j].children.length; k++) {
        let name = cetasika.children[i].children[j].children[k].name;
        let cell = renderCetasikaCell(x, tableHeight + yoffset + rowHeight * 3, columnWidth, rowHeight * 2.5, name);
        cetasikaLookup[name] = cell;
        x += columnWidth;
      }
    }
  }
}

const feelingTableX = tableWidth + 20;
const feelingWidth = 100;
const feelingHeight = 30;
let feelingText = null;
let feelingColor = null;
function renderFeelingBase() {
    let x = feelingTableX;
    let y = 0;
    let w = feelingWidth;
    let h = feelingHeight;
    renderCell(svg, x, y, w, h, 'lightcyan');
    renderText(svg, x, y, w, h, '受');
    feelingColor = renderCell(svg, x, y + h, w, h, 'white');
    feelingText = renderText(svg, x, y + h, w, h, '');
}

const subW = 20;
const subH = 30;
const subPadding = 12;
function renderSubTable(x, y, keys, title, color, specialUpdate, specialClear) {
    let rectLookup = {};
    let textLookup = {};
    let widths = [];
    for (let i = 0; i < keys.length; ++i) {
        let count = 0;
        for (let char of keys[i]) {
            if (/[\x00-\x7F]/.test(char)) {
                count++;
            } else {
                count += 2;
            }
        }
        widths = widths.concat([count * 6 + 3]);
    }
    let total = subArraySum(widths, 0, widths.length);

    const h = subH;
    renderCell(svg, x, y, total, h, 'lightcyan');
    renderText(svg, x, y, total, h, title, {size: '14px', align: 'middle'});
    let x0 = x;
    for (let i = 0; i < keys.length; ++i) {
        rectLookup[keys[i]] = renderCell(svg, x0, y + h, widths[i], h, 'white');
        textLookup[keys[i]] = renderText(svg, x0, y + h, widths[i], h, keys[i], {size: '12px', align: 'middle'});
        x0 += widths[i];
    }
    return {
        update: function (arr) {
            for (let i = 0; i < arr.length; ++i) {
                if (!specialUpdate || !specialUpdate(arr[i], textLookup, rectLookup)) {
                    let cell = rectLookup[arr[i]];
                    cell.attr('fill', color);
                }
            }
        },
        clear: function () {
            for (let i = 0; i < keys.length; ++i) {
                let cell = rectLookup[keys[i]];
                cell.attr('fill', 'white');
                if (specialClear) {
                    specialClear(keys[i], textLookup, rectLookup);
                }
            }
        },
        endX: x + total,
        endY: y + 2 * subH
    };
}

function renderCauseTable(x, y) {
    return renderSubTable(x, y, ['贪','嗔','痴','无贪','无嗔','无痴','无因'], '因', 'indianred');
}

function renderTimeTable(x, y) {
    return renderSubTable(x, y, ['过去','现在','未来','离时'], '所缘之时', 'lavender');
}

function renderFiveObjectsTable(x, y) {
    return renderSubTable(x, y, ['色所缘','声所缘','香所缘','味所缘','触所缘'], '五所缘', 'lightskyblue');
}

function renderMentalObjectsTable(x, y) {
    let specialUpdate = function (key, textLookup, rectLookup) {
        if (key == '6出世间心') {
            let key0 = '8出世间心';
            let cell = rectLookup[key0];
            cell.attr('fill', 'mediumpurple');
            let text = textLookup[key0];
            text.text(key);
            return true;
        }
        return false;
    }
    let specialClear = function (key, textLookup, rectLookup) {
        if (key == '8出世间心') {
            let text = textLookup[key];
            text.text(key);
        }
    }
    var mot = renderSubTable(x, y, ['54欲界心','15色界心','12无色界心','8出世间心','52心所21色','涅槃','概念'], '法所缘', 'lightskyblue', specialUpdate, specialClear);
    return mot;
}

function renderRealmTable(x, y) {
    return renderSubTable(x, y, ['欲', '色', '无色'], '升起之地', 'violet');
}

function renderGateTable(x, y) {
    let gates = ['眼门','耳门','鼻门','舌门','身门','意门','离门'];
    let specialUpdate = function (key, textLookup, rectLookup) {
        let ret = false;
        if (key == '五门' || key == '六门') {
            ret = true;
            for (let i = 0; i < 5; ++i) {
                let cell = rectLookup[gates[i]];
                cell.attr('fill', 'tomato');
            }
        }
        if (key == '六门') {
            let cell = rectLookup[gates[5]];
            cell.attr('fill', 'tomato');
        }
        return ret;
    }
    return renderSubTable(x, y, gates, '门', 'tomato', specialUpdate);
}

function renderBasisTable(x, y) {
    let w = 60;
    let h = 30;
    renderCell(svg, x, y, w, h, 'lightcyan');
    renderText(svg, x, y, w, h, '五净色', {size: '14px', align: 'middle'});
    renderCell(svg, x + w, y, w, h, 'lightcyan');
    renderText(svg, x + w, y, w, h, '心所依处', {size: '14px', align: 'middle'});
    let basisCell = renderCell(svg, x, y + h, w, h, 'white');
    let basisText = renderText(svg, x, y + h, w, h, '', {size: '12px', align: 'middle'});
    let mentalBasisCell = renderCell(svg, x + w, y + h, w, h, 'white');
    let mentalBasisText = renderText(svg, x + w, y + h, w, h, '', {size: '12px', align: 'middle'});
    return {
        update: function (basis) {
            if (['眼净色','耳净色','鼻净色','舌净色','身净色'].includes(basis)) {
                basisText.text(basis);
                basisCell.attr('fill', 'olive');
            } else {
                mentalBasisText.text(basis);
                mentalBasisCell.attr('fill', 'olive');
            }
        },
        clear: function () {
            basisCell.attr('fill', 'white');
            mentalBasisCell.attr('fill', 'white');
            basisText.text('');
            mentalBasisText.text('');
        },
        endX: x + w * 2,
        endY: y + h * 2
    }
}

function renderFunctionTable(x, y) {
    return renderSubTable(x, y, ['离路心', '速行', '转向', '见', '听', '嗅', '尝', '触觉', '领受', '推度', '彼所缘', '确定'], '作用', 'gold');
}

renderFirstCell();
renderColumnHeaders();
renderRowHeaders();
renderGridCells();
renderCetasikaTable();
renderFeelingBase();
const ct = renderCauseTable(feelingTableX + feelingWidth + subPadding, 0);
const tt = renderTimeTable(feelingTableX, subPadding + ct.endY);
const fot = renderFiveObjectsTable(tt.endX + subPadding, subPadding + ct.endY);
const mot = renderMentalObjectsTable(feelingTableX, tt.endY + subPadding);
const rt = renderRealmTable(feelingTableX, mot.endY + subPadding);
const gt = renderGateTable(rt.endX + subPadding, mot.endY + subPadding);
const bt = renderBasisTable(feelingTableX, gt.endY + subPadding);
const ft = renderFunctionTable(feelingTableX, bt.endY + subPadding);

function highlightCetasika(data) {
  for (let i = 0; i < data.cetasika.length; i++) {
    cetasikaLookup[data.cetasika[i]].attr('fill', 'yellow');
  }
  for (let i = 0; i < data.cetasika_opt_ext.length; i++) {
    cetasikaLookup[data.cetasika_opt_ext[i]].attr('fill', 'lightyellow');
  }
}

function clearCetasika() {
  for (let key in cetasikaLookup) {
    cetasikaLookup[key].attr('fill', 'white');
  }
}

function updateFeelingText(data) {
    let text = data.feeling;
    feelingText.text(text);
    if (text == '悦' || text == '乐') {
        feelingColor.attr('fill', 'lightgreen');
    } else if (text == '苦' || text == '忧') {
        feelingColor.attr('fill', 'red');
    } else {
        feelingColor.attr('fill', 'white');
    }
}

function updateCells(table, arr, color) {
    for (let i = 0; i < arr.length; ++i) {
        let cell = table[arr[i]];
        cell.attr('fill', color);
    }
}

function clearFeelingText(data) {
    feelingText.text('');
    feelingColor.attr('fill', 'white');
}

svg.selectAll(".table-cell") // Select all rectangles in your SVG; adjust the selector as needed
    .on("mouseover", function(event, d) {
      d3.select(this).select('rect').attr('fill', 'yellow');
      const data = d3.select(this).datum();
      /*
      tooltip.style("visibility", "visible")
          .style("left", (event.pageX + 10) + "px") // Position the tooltip
          .style("top", (event.pageY - 10) + "px");
       */
      updateTooltipContent(tooltip, data);
      highlightCetasika(data);
      updateFeelingText(data);
      ct.update((data.roots && data.roots.length) ? data.roots : ['无因']);
      tt.update(data.object_time);
      fot.update(data.objects == '五所缘' ? ['色所缘','香所缘','声所缘','味所缘','触所缘'] : data.objects);
      mot.update(data.mental_objects);
      rt.update(data.realms);
      gt.update(data.gates);
      bt.update(data.basis);
      ft.update(data.functions);
    })
    .on("mousemove", function(event) {
        /*
      tooltip.style("left", (event.pageX + 10) + "px") // Update position on mouse move
          .style("top", (event.pageY - 10) + "px");

         */
    })
    .on("mouseout", function() {
        /*
      tooltip.style("visibility", "hidden");
      tooltip.selectAll("text").remove();
      */
      d3.select(this).select('rect').attr('fill', 'white');
      clearCetasika();
      clearFeelingText();
      ct.clear();
      tt.clear();
      fot.clear();
      mot.clear();
      rt.clear();
      gt.clear();
      bt.clear();
      ft.clear();
    });
