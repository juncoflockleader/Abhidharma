const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const storage = {};
const context = {
    console,
    window: {},
    localStorage: {
        getItem: key => storage[key] || null,
        setItem: (key, value) => {
            storage[key] = value;
        },
    },
};
vm.createContext(context);

function loadScript(relativePath) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'), context, {filename: relativePath});
}

['js/translations.js', 'js/common-lang.js', 'js/data.js', 'js/rupa.js'].forEach(loadScript);
vm.runInContext('globalThis.__raw = {cittas, cetasika}', context);

const {cittas, cetasika} = context.__raw;
const allCetasikas = cetasika.children.flatMap(group => group.children.flatMap(subgroup => subgroup.children));
context.cetasikaIdIndex = Object.fromEntries(allCetasikas.map(item => [item.name, item.id]));
context.allCittas = [];
context.subEffectIndex = {};
context.cittaState = {idIndex: {}};

allCetasikas.forEach(item => {
    context.cittaState.idIndex[item.id] = item;
});
cittas.children.forEach(group => {
    const required = (cittas.cetasika || []).concat(group.cetasika || []);
    const optional = (cittas.cetasika_opt || []).concat(group.cetasika_opt || []);
    const functions = group.functions || [];
    group.children.forEach(item => {
        const itemRequired = required.concat(item.cetasika || []);
        const itemOptional = optional.concat(item.cetasika_opt || []);
        const citta = {
            id: item.id,
            name: item.name,
            group: group.name,
            cetasika: itemRequired,
            cetasika_opt: itemOptional,
            functions: functions.concat(item.functions || []),
        };
        context.allCittas.push(citta);
        context.cittaState.idIndex[item.id] = citta;
        context.subEffectIndex[item.id] = itemRequired
            .concat(itemOptional)
            .map(name => context.cetasikaIdIndex[name])
            .filter(Boolean);
    });
});

[
    'js/conditions.js',
    'js/conditions-model.js',
    'js/cause-condition-data.js',
    'js/cause-condition-model.js',
    'js/cause-condition-workspace.js',
].forEach(loadScript);
vm.runInContext(`globalThis.__traceApi = {
    buildConditionsModel,
    buildCauseConditionTraceModel,
    buildNamaCauseTrace,
    buildRupaCauseTrace,
    createCauseConditionWorkspaceState,
    computeCauseConditionTrace,
    renderCauseConditionWorkspace,
    renderCauseConditionWorkspaceView,
}`, context);

const {
    buildConditionsModel,
    buildCauseConditionTraceModel,
    buildNamaCauseTrace,
    buildRupaCauseTrace,
    createCauseConditionWorkspaceState,
    computeCauseConditionTrace,
    renderCauseConditionWorkspace,
    renderCauseConditionWorkspaceView,
} = context.__traceApi;

const conditionModel = buildConditionsModel();
conditionModel.entities.forEach(entity => {
    if (!context.cittaState.idIndex[entity.id]) {
        context.cittaState.idIndex[entity.id] = entity;
    }
});
const model = buildCauseConditionTraceModel(conditionModel);

assert.equal(model.validation.valid, true, model.validation.errors.join('\n'));
assert.equal(Object.keys(model.senseFlows).length, 5);
Object.values(model.senseFlows).forEach(flow => assert.equal(flow.stages.length, 9));
assert.equal(model.mindFlow.stages.length, 20);
assert.equal(model.rupaTargets.filter(entity => entity.domain === 'rupa').length, 28);
assert.equal(model.rupaTargets.filter(entity => entity.domain === 'rupa-aggregate').length, 23);

const flows = Object.values(model.senseFlows).concat(model.mindFlow);
let namaScenarioCount = 0;
flows.forEach(flow => {
    flow.stages.forEach(stage => {
        stage.instances.forEach(instance => {
            stage.objectOptions.forEach(objectOption => {
                const trace = buildNamaCauseTrace(model, {
                    flowType: flow.id,
                    senseDoor: flow.door ? flow.door.id : 'eye',
                    stageId: stage.id,
                    instanceId: instance.id,
                    objectId: objectOption.id,
                });
                assert.ok(trace.entries.length > 0, `${flow.name}/${stage.name}/${instance.name}/${objectOption.name} should have conditions`);
                assert.ok(trace.cetasikas.length > 0, `${instance.name} should have cetasikas`);
                assert.doesNotMatch(JSON.stringify(trace), /undefined/);
                namaScenarioCount += 1;
            });
        });
    });
});

const eyeConsciousness = model.senseFlows.eye.stages.find(stage => stage.id === 'sense-consciousness');
const eyeTrace = buildNamaCauseTrace(model, {
    flowType: 'sense',
    senseDoor: 'eye',
    stageId: eyeConsciousness.id,
    instanceId: eyeConsciousness.instances[0].id,
    objectId: eyeConsciousness.objectOptions[0].id,
});
assert.equal(eyeTrace.stage.basisIds[0], 9005);
assert.ok(eyeTrace.entries.some(entry => entry.group === '依处组' && entry.causeSummary.includes('眼净色')));
assert.ok(eyeTrace.entries.some(entry => entry.objectRelated));

let rupaTargetCount = 0;
model.rupaTargets.forEach(target => {
    const trace = buildRupaCauseTrace(model, target.id, 'all');
    assert.ok(trace.entries.length > 0, `${target.name} should have reverse condition rules`);
    assert.doesNotMatch(JSON.stringify(trace), /undefined/);
    rupaTargetCount += 1;
});

const earthTrace = buildRupaCauseTrace(model, 9001, 'all');
assert.ok(earthTrace.stats.directCount > 0);
assert.ok(earthTrace.stats.aggregateCount > 0);
assert.equal(earthTrace.containingAggregates.length, 23);
const earthDirectTrace = buildRupaCauseTrace(model, 9001, 'direct');
const earthAggregateTrace = buildRupaCauseTrace(model, 9001, 'aggregate');
assert.ok(earthDirectTrace.entries.every(entry => entry.direct));
assert.ok(earthAggregateTrace.entries.every(entry => entry.throughAggregate));
const pureOctadTrace = buildRupaCauseTrace(model, 9301, 'all');
assert.equal(pureOctadTrace.components.length, 8);
assert.ok(pureOctadTrace.stats.directCount > 0);

const state = createCauseConditionWorkspaceState(model, null);
computeCauseConditionTrace(state);
assert.equal(state.trace.mode, 'nama');
state.mode = 'rupa';
state.rupaTargetId = 9001;
computeCauseConditionTrace(state);
assert.equal(state.trace.mode, 'rupa');
assert.ok(state.trace.entries.length > 0);

vm.runInContext(`
    bindCauseTraceSelectorInteractions = () => {};
    bindCauseTraceResultInteractions = () => {};
`, context);
function fakeElement() {
    return {
        innerHTML: '',
        querySelector: () => null,
        querySelectorAll: () => [],
    };
}
const fakeElements = Object.fromEntries([
    '#cause-trace-summary',
    '#cause-trace-controls',
    '#cause-trace-selector',
    '#cause-trace-results',
    '#cause-trace-inspector',
].map(selector => [selector, fakeElement()]));
const fakeHost = {
    dataset: {},
    addEventListener: () => {},
    querySelector: selector => fakeElements[selector] || null,
    querySelectorAll: () => [],
};
const renderedState = renderCauseConditionWorkspace(fakeHost, model);
assert.equal(fakeHost.dataset.ready, 'true');
assert.match(fakeElements['#cause-trace-summary'].innerHTML, /五门心路/);
assert.match(fakeElements['#cause-trace-controls'].innerHTML, /名法溯源/);
assert.match(fakeElements['#cause-trace-controls'].innerHTML, /色法溯源/);
assert.match(fakeElements['#cause-trace-results'].innerHTML, /缘力清单/);
assert.match(fakeElements['#cause-trace-inspector'].innerHTML, /CONDITION INSPECTOR/);

renderedState.mode = 'rupa';
renderedState.rupaTargetId = 9001;
renderCauseConditionWorkspaceView(renderedState);
assert.match(fakeElements['#cause-trace-summary'].innerHTML, /色法/);
assert.match(fakeElements['#cause-trace-selector'].innerHTML, /28 色法/);
assert.match(fakeElements['#cause-trace-selector'].innerHTML, /23 色聚/);
assert.match(fakeElements['#cause-trace-results'].innerHTML, /直接缘生/);

console.log(`cause-condition-model: ${namaScenarioCount} nama scenarios and ${rupaTargetCount} rupa targets verified`);
