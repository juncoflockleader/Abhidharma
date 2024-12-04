// Constants and configurations
const width = 800;
const height = 600;
const rupaRadius = 16;
const supportRadius = 100;
const initialFoodRupasCount = 30;
const initialFireRupasCount = 30;
const initialKammaRupasCount = 30;
const initialSpeed = 2; // Adjust for desired starting speed
const framesPerTick = 200;
const udfBatch = 2;
const finalFrameCount = 3000;
// Event listeners for buttons
const startStopBtn = document.getElementById('startStopBtn');
const pauseResumeBtn = document.getElementById('pauseResumeBtn');

let id = 0;
let frameCount = 0;

// Rupa types
const RUPA_TYPES = {
    KAMMA: 'kamma',
    CITTA: 'citta',
    FOOD: 'food',
    FIRE: 'fire',
};

const RUPA_STATE = {
    NEW: 'new',
    PEAKED: 'peaked',
    AGED: 'old',
    VANISHED: 'vanish'
};

// Utility function to get a random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Functions to generate random positions within the SVG canvas
function randomX() {
    return Math.random() * (width - 2 * rupaRadius) + rupaRadius;
}

function randomY() {
    return Math.random() * (height - 2 * rupaRadius) + rupaRadius;
}

let progressUpdater = {
    update: function (progress) {
    },
    reset: function () {
    }
};
let rupaCounter = {
    update: function (count) {
    },
    reset: function () {
    }
};

// Base Rupa class
class Rupa {
    constructor(type, x, y, parent = null) {
        this.type = type;
        this.state = RUPA_STATE.NEW;
        this.x = x;
        this.y = y;
        // Inside the Rupa constructor
        this.vx = (Math.random() - 0.5) * initialSpeed;
        this.vy = (Math.random() - 0.5) * initialSpeed;
        this.parent = parent; // For fire rupa, to know its origin
        this.lifeTime = this.setInitialLifeTime();
        this.id = id++; // Unique ID for D3 data binding
    }

    tick() {
        switch (this.state) {
            case RUPA_STATE.NEW:
                this.state = RUPA_STATE.PEAKED;
                break;
            case RUPA_STATE.PEAKED:
                this.state = RUPA_STATE.AGED;
                break;
            case RUPA_STATE.AGED:
                this.state = RUPA_STATE.VANISHED;
                break;
        }
    }

    getRadius() {
        let r = 10;
        if (this.lifeTime > 10) r = 16;
        if (this.lifeTime > 6) r = 14;
        if (this.lifeTime > 2) r = 12;
        if (this.state === RUPA_STATE.NEW) r += 1;
        if (this.state === RUPA_STATE.AGED) r -= 1;
        if (this.state === RUPA_STATE.VANISHED) r -= 2;
        return r;
    }

    setInitialLifeTime() {
        switch (this.type) {
            case RUPA_TYPES.FOOD:
                if (this.parent?.type === RUPA_TYPES.FOOD) return this.parent.lifeTime - 1;
                if (this.parent?.type === RUPA_TYPES.KAMMA) return randomInt(4, 5);
                if (this.parent?.type === RUPA_TYPES.CITTA) return randomInt(2, 3);
                if (this.parent?.type === RUPA_TYPES.CITTA) return randomInt(10, 12);
                break;
            case RUPA_TYPES.FIRE:
                if (this.parent?.type === RUPA_TYPES.KAMMA) return randomInt(4, 5);
                if (this.parent?.type === RUPA_TYPES.CITTA) return randomInt(2, 3);
                if (this.parent?.type === RUPA_TYPES.FOOD) return randomInt(10, 12);
                if (this.parent?.type === RUPA_TYPES.FIRE) return this.parent.lifeTime - 1;
                if (!this.parent) return randomInt(10, 12);
                break;
            case RUPA_TYPES.KAMMA:
                return 1;
            case RUPA_TYPES.CITTA:
                return 1;
            default:
                return 1;
        }
    }
}

// Initialize the simulation with Food rupas at random positions
let rupas = [];
function initializeSimulation() {
    id = 0;
    frameCount = 0;
    rupas = [];
    rpnSvg.select('*').remove();
    for (let i = 0; i < initialFoodRupasCount; i++) {
        rupas.push(new Rupa(RUPA_TYPES.FOOD, randomX(), randomY()));
    }
    for (let i = 0; i < initialFireRupasCount; i++) {
        rupas.push(new Rupa(RUPA_TYPES.FIRE, randomX(), randomY()));
    }
    for (let i = 0; i < initialKammaRupasCount; i++) {
        rupas.push(new Rupa(RUPA_TYPES.KAMMA, randomX(), randomY()));
    }
    progressUpdater.reset();
    rupaCounter.reset();
}

function movementLogic(rupa) {
    // Random acceleration
    const maxAcceleration = 0.5; // Adjust for speed control
    const ax = (Math.random() - 0.5) * maxAcceleration;
    const ay = (Math.random() - 0.5) * maxAcceleration;

    // Update velocities
    rupa.vx += ax;
    rupa.vy += ay;

    // Limit the maximum speed
    const maxSpeed = 2;
    const speed = Math.sqrt(rupa.vx * rupa.vx + rupa.vy * rupa.vy);
    if (speed > maxSpeed) {
        rupa.vx = (rupa.vx / speed) * maxSpeed;
        rupa.vy = (rupa.vy / speed) * maxSpeed;
    }

    // Update positions
    rupa.x += rupa.vx;
    rupa.y += rupa.vy;

    // Collision with walls
    if (rupa.x - rupa.getRadius() <= 0 || rupa.x + rupa.getRadius() >= width) {
        rupa.vx = -rupa.vx;
    }

    if (rupa.y - rupa.getRadius() <= 0 || rupa.y + rupa.getRadius() >= height) {
        rupa.vy = -rupa.vy;
    }
}

let simulationRunning = false;
let simulationStarted = false;
// Main simulation loop
function updateSimulation() {
    if (!simulationStarted || !simulationRunning) return;
    // Increment frame count
    frameCount++;
    if (frameCount % framesPerTick === 0 && frameCount <= finalFrameCount) {
        rupas.push(new Rupa(RUPA_TYPES.KAMMA, randomX(), randomY()));
        rupas.push(new Rupa(RUPA_TYPES.CITTA, randomX(), randomY()));
        for (let i = 0; i < udfBatch; ++i) {
            rupas.push(new Rupa(RUPA_TYPES.FIRE, randomX(), randomY()));
        }
    }

    const nextGen = [];
    rupas.forEach((rupa, index) => {
        // Skip if the rupa has been removed
        if (!rupa) return;
        // Update positions
        movementLogic(rupa);
        if (frameCount % framesPerTick !== 0) {
            return;
        }
        progressUpdater.update(frameCount/finalFrameCount);
        rupa.tick();
        if (rupa.state === RUPA_STATE.VANISHED) {
            return;
        }
        if (rupa.state !== RUPA_STATE.PEAKED) {
            return;
        }

        // only peaked rupas
        if (rupa.type === RUPA_TYPES.FOOD) {
            nextGen.push(new Rupa(RUPA_TYPES.FOOD, rupa.x, rupa.y, rupa));
            nextGen.push(new Rupa(RUPA_TYPES.FIRE, rupa.x, rupa.y, rupa));
        } else if (rupa.type === RUPA_TYPES.FIRE && rupa.parent === null) {
            let nearbyKarma = rupas.find(
                (otherRupa) =>
                    otherRupa.type === RUPA_TYPES.KAMMA &&
                    distance(rupa, otherRupa) < supportRadius
            );
            if (nearbyKarma) {
                nextGen.push(new Rupa(RUPA_TYPES.FOOD, rupa.x, rupa.y, rupa));
            }
            nextGen.push(new Rupa(RUPA_TYPES.FIRE, rupa.x, rupa.y, rupa));
        } else {
            let nearbyFood = rupas.find(
                (otherRupa) =>
                    otherRupa.type === RUPA_TYPES.FOOD &&
                    distance(rupa, otherRupa) < supportRadius
            );
            if (nearbyFood) {
                nextGen.push(new Rupa(RUPA_TYPES.FOOD, rupa.x, rupa.y, rupa));
            }
            nextGen.push(new Rupa(RUPA_TYPES.FIRE, rupa.x, rupa.y, rupa));
        }
    });
    rupas = rupas.filter((rupa) => rupa.state !== RUPA_STATE.VANISHED);
    updateVisualization(rupas);

    const filteredNextGen = nextGen.filter((v) => v.lifeTime > 0)
    rupas.push(...filteredNextGen);

    rupaCounter.update(rupas.length);
    // Loop
    if (rupas.length > 0) {
        requestAnimationFrame(updateSimulation);
    } else {
        simulationStarted = false;
        simulationRunning = false;
        startStopBtn.textContent = '开始';
        pauseResumeBtn.disabled = true; // Disable the Pause/Resume button
        pauseResumeBtn.textContent = '暂停'; // Reset the Pause/Resume button text
    }
}

// Function to calculate distance between two rupas
function distance(rupa1, rupa2) {
    return Math.sqrt((rupa1.x - rupa2.x) ** 2 + (rupa1.y - rupa2.y) ** 2);
}

// Visualization using D3.js
function updateVisualization(data) {
    let circles = rpnSvg.selectAll('circle').data(data, (d) => d.id);

    circles
        .enter()
        .append('circle')
        .attr('r', 0)
        .merge(circles)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', (d) => getColorByType(d.type))
        .transition()
        .duration(50)
        .attr('r', (d) => d.getRadius());

    circles.exit()
        .transition()
        .duration(50)
        .attr('r', 0)
        .on('end', function() {
            d3.select(this).remove();
        });
}

// Legend data
const legendData = [
    { type: RUPA_TYPES.KAMMA, color: getColorByType(RUPA_TYPES.KAMMA), label: '业生色' },
    { type: RUPA_TYPES.CITTA, color: getColorByType(RUPA_TYPES.CITTA), label: '心生色' },
    { type: RUPA_TYPES.FOOD, color: getColorByType(RUPA_TYPES.FOOD), label: '食生色' },
    { type: RUPA_TYPES.FIRE, color: getColorByType(RUPA_TYPES.FIRE), label: '时节生色' },
];


function createLegend() {
    // Define the size and spacing of the legend items
    const circleRadius = 10;
    const itemSpacing = 30; // Vertical spacing between legend items

    // Create legend items as groups
    const legendItems = rpnlSvg.selectAll('.legend-item')
        .data(legendData)
        .enter()
        .append('g')
        .attr('x', 0)
        .attr('y', 100)
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(20, ${i * itemSpacing + 100})`);

    // Append circles to the legend items
    legendItems.append('ellipse')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('rx', circleRadius)
        .attr('ry', circleRadius)
        .attr('fill', (d) => d.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    // Append text labels next to the circles
    legendItems.append('text')
        .attr('x', circleRadius + 10)
        .attr('y', 5) // Adjust to align text vertically with the circle
        .text((d) => d.label)
        .style('font-size', '14px')
        .style('alignment-baseline', 'middle');
}

function createProgressUpdater() {
    renderTextBox(rpnlSvg, 10, 0, 80, 20, 'lightcyan', '进度', {size: 12});
    const text = renderTextBox(rpnlSvg, 10, 20, 80, 20, 'white', '0.00%', {size: 12});
    progressUpdater = {
        update: function (progress) {
            text.setText((progress * 100).toFixed(2).toString() + '%');
        },
        reset: function () {
            text.setText('0.0%')
        }
    };
    renderTextBox(rpnlSvg, 10, 45, 80, 20, 'lightcyan', '色聚数目', {size: 12});
    const rupaCount = renderTextBox(rpnlSvg, 10, 65, 80, 20, 'white', '0', {size: 12});
    rupaCounter = {
        update: function (count) {
            rupaCount.setText(count.toString());
        },
        reset: function () {
            rupaCount.setText('0')
        }
    };
}


// Function to get color based on rupa type
function getColorByType(type) {
    switch (type) {
        case RUPA_TYPES.KAMMA:
            return 'blue';
        case RUPA_TYPES.CITTA:
            return 'green';
        case RUPA_TYPES.FOOD:
            return 'orange';
        case RUPA_TYPES.FIRE:
            return 'red';
        default:
            return 'gray';
    }
}

startStopBtn.addEventListener('click', () => {
    if (!simulationStarted) {
        // Start the simulation
        initializeSimulation();
        simulationStarted = true;
        simulationRunning = true;
        startStopBtn.textContent = '停止';
        pauseResumeBtn.disabled = false; // Enable the Pause/Resume button
        updateSimulation(); // Start the simulation loop
    } else {
        // Stop the simulation
        simulationStarted = false;
        simulationRunning = false;
        startStopBtn.textContent = '开始';
        pauseResumeBtn.disabled = true; // Disable the Pause/Resume button
        pauseResumeBtn.textContent = '暂停'; // Reset the Pause/Resume button text
        // Clear existing data and visualization
        rupas = []; // Clear the rupas array
        rpnSvg.selectAll('circle').remove(); // Remove all circles from the SVG
        // Optionally reset other variables if necessary
    }
});

pauseResumeBtn.addEventListener('click', () => {
    if (!simulationStarted) return; // Do nothing if simulation is not running

    simulationRunning = !simulationRunning; // Toggle the running state

    if (simulationRunning) {
        pauseResumeBtn.textContent = '暂停';
        updateSimulation(); // Resume the simulation
    } else {
        pauseResumeBtn.textContent = '继续';
    }
});