
// Set up SVG container
const columnWidth = 210;
const rowHeight = 110;
const exHeight = 100; // extra height for the first row
const columns = 6;
const rows = 4;
const tableWidth = columnWidth * columns + columnWidth;
const tableHeight = rowHeight * rows + rowHeight + exHeight;
const svgWidth = tableWidth;
const svgHeight = tableHeight * 2;

const tooltip = d3.select("#tooltip");

const svg = d3.select('body').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

function renderCell(x, y, w, h, color) {
    return svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('fill', color);
}

function renderFirstCell() {
  renderCell(0, 0, columnWidth, rowHeight, 'lightblue');
  svg.append('line')
      .attr('x1', 0) // Start of line (x-coordinate)
      .attr('y1', 0) // Start of line (y-coordinate)
      .attr('x2', columnWidth) // End of line (x-coordinate)
      .attr('y2', rowHeight) // End of line (y-coordinate)
      .attr('stroke', 'grey') // Line color
      .attr('stroke-width', 1); // Line width

    // Calculate approximate centers of the two triangles
    const centerX1 = columnWidth / 3;
    const centerY1 = rowHeight / 3;
    const centerX2 = columnWidth * 2 / 3;
    const centerY2 = rowHeight * 2 / 3;

    // Add text to the first triangle
      svg.append('text')
          .attr('x', centerX1)
          .attr('y', centerY2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .text(data.header.row_header);

    // Add text to the second triangle
      svg.append('text')
          .attr('x', centerX2)
          .attr('y', centerY1)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .text(data.header.column_header);
}

function renderHeader(x, y, w, h, text) {
  renderCell(x, y, w, h, 'lightcyan');

    svg.append('text')
        .attr('x', x + w / 2) // Position the text in the middle of the rectangle's width
        .attr('y', y + h / 2) // Position the text in the middle of the rectangle's height
        .attr('text-anchor', 'middle') // Center the text at the specified (x, y) position
        .text(text);

}

function renderColumnHeaders() {
    for (let i = 0; i < 2; i++) {
      renderHeader(columnWidth * (i + 1), 0, columnWidth, rowHeight, data.columns_header[i].name);
    }
    renderHeader(columnWidth * 3, 0, columnWidth*4, rowHeight / 3, data.columns_header[2].name);
    for (let i = 0; i < 2; i++) {
      renderHeader(columnWidth * (3 + i * 2), rowHeight / 3, columnWidth*2, rowHeight/3, data.columns_header[2].children[i].name);
    }
    for (let i = 0; i < 4; i++) {
      renderHeader(columnWidth * (3 + i), rowHeight / 3 * 2, columnWidth, rowHeight / 3, data.columns_header[2].children[Math.floor(i / 2)].children[Math.floor(i % 2)].name);
    }
}


function renderRowHeaders() {
    for (let i = 0; i < rows; i++) {
      renderHeader(0, rowHeight * (i + 1) + (i > 0 ? exHeight : 0), columnWidth, rowHeight + (i === 0 ? exHeight : 0), data.rows_header[i]);
    }
}

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
  tableGroup.append('rect')
      .attr('x', padding)
      .attr('y', padding)
      .attr('width', cellWidth - padding * 2)
      .attr('height', headerHeight)
      .attr('stroke', 'grey') // Line color
      .attr('stroke-width', 1) // Line width
      .attr('fill', 'lightgrey');
  tableGroup.append('text')
      .attr('x', 10) // Small padding from the left
      .attr('y', padding + headerHeight / 2)
      .attr('dominant-baseline', 'middle')
      .text(cittaGroup.name)
      .attr('font-size', '12px');

  // Loop through the data items and draw each row
  cittaGroup.children.forEach((item, index) => {
    const itemGroup = tableGroup.append('g')
        .classed('table-cell', true)
        .datum({
          category: item.category || attrs.category ||  null,
          cetasika: attrs.cetasika.concat(item.cetasika || []),
          roots: attrs.roots.concat(item.roots || []),
          functions: attrs.functions.concat(item.functions || []),
          gates: attrs.gates.concat(item.gates || []),
          objects: attrs.objects.concat(item.objects || []),
          mental_objects: attrs.mental_objects.concat(item.mental_objects || []),
          object_time: attrs.object_time.concat(item.object_time || []),
          basis: item.basis || attrs.basis || null,
          realms: attrs.realms.concat(item.realms || []),
          cetasika_opt_ext: attrs.cetasika_opt_ext.concat(item.cetasika_opt_ext || []),
          feeling: item.feeling || attrs.feeling || null
        });

    const yPosition = padding + headerHeight + index * rowHeight;
    itemGroup.append('rect')
        .attr('x', padding)
        .attr('y', yPosition)
        .attr('width', cellWidth - padding * 2)
        .attr('height', rowHeight)
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('fill', 'white');

    itemGroup.append('text')
        .attr('x', 5)
        .attr('y', yPosition + rowHeight / 2)
        .attr('dominant-baseline', 'middle')
        .text(item.name)
        .attr('font-size', '10px');
  });
}

function renderGridCells() {
    // Loop through each row
    for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
        // Loop through each column
        for (let colIndex = 1; colIndex <= columns; colIndex++) {
            // Calculate x and y position for the cell
            const x = colIndex * columnWidth;
            let y = rowIndex * rowHeight;
            if (rowIndex > 1) {
              y += exHeight;
            }

            let rh = rowIndex === 1 ? rowHeight + exHeight : rowHeight;
            // Render the cell with a default color
            renderCell(x, y, columnWidth, rh, 'white');

            let cittasIndexes = data.cells_citta_group[rowIndex - 1][colIndex - 1];
            if (cittasIndexes.length === 1) {
              createTableInCell(x, y, columnWidth, rh, cittas, cittasIndexes[0]);
            } else {
                cittasIndexes.forEach((cittaIndex, index) => {
                    createTableInCell(x  + index * columnWidth / 2, y, columnWidth / 2, rh, cittas, cittaIndex);
                });
            }

        }
    }
}

function updateTooltipContent(tooltip, data) {
  tooltip.selectAll("*").remove(); // Clear previous content

  let yPos = 20; // Base y position for the first line; adjust as needed
  const lineHeight = 20; // Height of each line; adjust as needed

  const textGroup = tooltip.append("text")
      .attr("x", 10); // Horizontal position; adjust as needed

  const lines = [
    "分类: " + data.category,
    "受: " + data.feeling,
    "心所: " + data.cetasika.join(', '),
    "可能心所:" + data.cetasika_opt_ext.join(', '),
    "因: " + data.roots.join(', '),
    "作用: " + data.functions.join(', '),
    "门: " + data.gates.join(', '),
    "所缘: " + data.objects.join(', '),
    "法所缘: " + data.mental_objects.join(', '),
    "所缘之时: " + data.object_time.join(', '),
    "依处: " + data.basis,
    "升起之地: " + data.realms.join(', ')
  ];

  lines.forEach((line, index) => {
    textGroup.append("tspan")
        .attr("x", 10) // Align all tspans to the same x position
        .attr("y", yPos + index * lineHeight) // Set fixed y position for each line
        .text(line + '\n');
  });
}

function renderCetasikaHeader(x, y, w, h, text) {
  renderCell(x, y, w, h, 'lightcyan');

  svg.append('text')
      .attr('x', x + w / 2) // Position the text in the middle of the rectangle's width
      .attr('y', y + h / 2) // Position the text in the middle of the rectangle's height
      .attr('text-anchor', 'middle') // Center the text at the specified (x, y) position
      .attr('font-size', '12px')
      .text(text);

}

function renderCetasikaCell(x, y, w, h, text) {
  let cell = renderCell(x, y, w, h, 'white');
  cell.attr('class', 'cetasika-cell');

  const textElement = svg.append('text')
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
        let cell = renderCetasikaCell(x, tableHeight + yoffset + rowHeight * 3, columnWidth, rowHeight * 3, name);
        cetasikaLookup[name] = cell;
        x += columnWidth;
      }
    }
  }

}

renderFirstCell();
renderColumnHeaders();
renderRowHeaders();
renderGridCells();
renderCetasikaTable();

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

svg.selectAll(".table-cell") // Select all rectangles in your SVG; adjust the selector as needed
    .on("mouseover", function(event, d) {
      d3.select(this).select('rect').attr('fill', 'yellow');
      const data = d3.select(this).datum();
      tooltip.style("visibility", "visible")
          .style("left", (event.pageX + 10) + "px") // Position the tooltip
          .style("top", (event.pageY - 10) + "px");
      updateTooltipContent(tooltip, data);
      highlightCetasika(data);
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.pageX + 10) + "px") // Update position on mouse move
          .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
      tooltip.selectAll("text").remove();
      d3.select(this).select('rect').attr('fill', 'white');
      clearCetasika();
    });
