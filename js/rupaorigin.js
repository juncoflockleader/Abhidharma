const rupaAggs = [
    {
        id: 0,
        name: "食生色聚",
        fire: "食生火界",
        food: "食生食素"
    },
    {
        id: 1,
        name: "心生色聚",
        fire: "心生火界",
        food: "心生食素"
    },
    {
        id: 2,
        name: "业生色聚",
        fire: "业生火界",
        food: "业生食素"
    },
    {
        id: 3,
        name: "时节生色聚",
        fire: "时节生火界",
        food: "时节生食素"
    }
];

function renderAgg(parent, x, y, data) {
    const group = parent.append('g');
    const rx = 90;
    const ry = 60;
    const colors = ['lightblue', 'lightcyan', 'lavender', 'skyblue'];
    const main = group.append("ellipse")
        .attr("cx", x)  // Center x
        .attr("cy", y)  // Center y
        .attr("rx", rx)  // Horizontal radius
        .attr("ry", ry)   // Vertical radius
        .style("fill", colors[data.id])
        .style("stroke", "black");

    group.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "16px")
        .text(data.name);

    const fireX = x - ry/1.75;
    const fireY = y - ry/2;
    group.append("ellipse")
        .attr("cx", fireX) // Center x
        .attr("cy", fireY) // Center y
        .attr("rx", rx/3)  // Horizontal radius
        .attr("ry", ry/3)   // Vertical radius
        .style("fill", "pink")
        .style("stroke", "black");

    group.append("text")
        .attr("x", fireX)
        .attr("y", fireY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .text(data.fire);

    const foodX = x + ry/1.75;
    const foodY = y + ry/2;
    group.append("ellipse")
        .attr("cx", foodX) // Center x
        .attr("cy", foodY) // Center y
        .attr("rx", rx/3)  // Horizontal radius
        .attr("ry", ry/3)   // Vertical radius
        .style("fill", "lightgreen")
        .style("stroke", "black");

    group.append("text")
        .attr("x", foodX)
        .attr("y", foodY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .text(data.food);

    return {
        fireX: fireX,
        fireY: fireY,
        foodX: foodX,
        foodY: foodY,
        x: x,
        y: y,
        rx: rx,
        ry: ry,
        highlight: function () {
            main.style("stroke-width", 2);
        },
        clear: function () {
            main.style("stroke-width", 1);
        }
    };
}

function renderCurve(parent, x1, y1, x2, y2, d, label, labelColor) {
    let dx = 0;
    let dy = 0;
    if (Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
        dx = d;
    } else {
        dy = d;
    }
    const midX = (x1 + x2) / 2 - dx;
    const midY = (y1 + y2) / 2 - dy; // Adjust according to the curve

    const pathData = `M ${x1} ${y1} 
                      Q ${midX} ${midY} 
                      ${x2} ${y2}`;

    const curve = parent.append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#rupa-arrowhead)");

    const px = 12;
    const padding = 3;
    renderTextBox(parent, (x1 + x2) / 2 - px * 2, (y1 + y2) / 2 - px * 2, px * label.length + padding * 2, px + padding * 2, labelColor, label,{size: px});

    return {
        highlight: function () {
            curve.attr("stroke-width", 2);
        },
        clear: function () {
            curve.attr("stroke-width", 1);
        }
    }
}

function renderRupaOrigins(parent) {
    parent.append("defs")
        .append("marker")
        .attr("id", "rupa-arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "black");

    const x0 = 400;
    const y0 = 100;
    const d = 20;
    const karma = renderAgg(parent, x0, y0, rupaAggs[2]);
    const food = renderAgg(parent, x0, y0 + 200, rupaAggs[0]);
    const fk1 = renderCurve(parent, food.foodX, food.foodY - food.ry/3, karma.foodX, karma.foodY + karma.ry/3, d, '支助', 'orange');
    const karmaFood = renderAgg(parent, x0 + 300, y0, rupaAggs[0]);
    const kg1 = renderCurve(parent, karma.foodX + karma.rx / 3, karma.foodY, karmaFood.x - karmaFood.rx, karmaFood.y, d, '产生4-5代', 'orange');
    const karmaFire = renderAgg(parent, x0 - 300, y0, rupaAggs[3]);
    const kg2 = renderCurve(parent, karma.fireX, karma.fireY - karma.ry / 3, karmaFire.x, karmaFire.y - karmaFire.ry, d, '产生4-5代', 'yellow');
    const citta = renderAgg(parent, x0, y0 + 400, rupaAggs[1]);
    const cf1 = renderCurve(parent, food.foodX, food.foodY + food.ry/3, citta.foodX, citta.foodY - karma.ry/3, d, '支助', 'cyan');
    const cittaFood = renderAgg(parent, x0, y0 + 600, rupaAggs[0]);
    const ccf1 = renderCurve(parent, citta.foodX - citta.rx /3, citta.foodY, cittaFood.x, cittaFood.y - cittaFood.ry, d, '产生2-3代', 'cyan');
    const cittaFire = renderAgg(parent, x0 - 300, y0 + 400, rupaAggs[3]);
    const ccf2 = renderCurve(parent, citta.fireX, citta.fireY - citta.ry / 3, cittaFire.x, cittaFire.y - cittaFire.ry, d * 2, '产生2-3代', 'burlywood');
    const fire = renderAgg(parent, x0 + 300, y0 + 200, rupaAggs[3]);
    const ff = renderCurve(parent, food.foodX + food.rx / 3, food.foodY, fire.foodX - fire.rx / 3, fire.foodY, d, '支助', 'Tomato');
    const foodFireFood = renderAgg(parent, x0 + 700, y0 + 200, rupaAggs[0]);
    const ffff = renderCurve(parent, fire.foodX + fire.rx / 3, fire.foodY, foodFireFood.x - foodFireFood.rx, foodFireFood.y, d * 2, '产生10-12代', 'Tomato');
    const foodFire = renderAgg(parent, x0 - 300, y0 + 200, rupaAggs[3]);
    const fff2 = renderCurve(parent, food.fireX, food.fireY - food.ry / 3, foodFire.x, foodFire.y - foodFire.ry, d, '产生10-12代', 'mistyrose');
    const foodFood = renderAgg(parent, x0 + 300, y0 + 400, rupaAggs[0]);
    const fff3 = renderCurve(parent, food.foodX + food.rx / 3, food.foodY, foodFood.x - foodFood.rx, foodFood.y, d, '产生10-12代', 'violet');
}