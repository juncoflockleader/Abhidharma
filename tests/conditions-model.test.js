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

cittas.children.forEach(group => {
    const required = (cittas.cetasika || []).concat(group.cetasika || []);
    const optional = (cittas.cetasika_opt || []).concat(group.cetasika_opt || []);
    const functions = group.functions || [];
    group.children.forEach(item => {
        const itemRequired = required.concat(item.cetasika || []);
        const itemOptional = optional.concat(item.cetasika_opt || []);
        context.allCittas.push({
            id: item.id,
            name: item.name,
            group: group.name,
            cetasika: itemRequired,
            cetasika_opt: itemOptional,
            functions: functions.concat(item.functions || []),
        });
        context.subEffectIndex[item.id] = itemRequired
            .concat(itemOptional)
            .map(name => context.cetasikaIdIndex[name])
            .filter(Boolean);
    });
});

['js/conditions.js', 'js/conditions-model.js', 'js/conditions-workspace.js'].forEach(loadScript);
vm.runInContext(`globalThis.__conditionsApi = {
    buildConditionsModel,
    filterConditionRules,
    summarizeConditionEntities,
    createConditionsWorkspaceState,
    renderConditionRelation,
    renderConditionsInspector,
    renderConditionsWorkspace,
    conditionRuleContainsEntity,
}`, context);

const {
    buildConditionsModel,
    filterConditionRules,
    summarizeConditionEntities,
    createConditionsWorkspaceState,
    renderConditionRelation,
    renderConditionsInspector,
    renderConditionsWorkspace,
    conditionRuleContainsEntity,
} = context.__conditionsApi;
const model = buildConditionsModel();
const toLocalObject = value => JSON.parse(JSON.stringify(value));

assert.equal(model.validation.valid, true, model.validation.errors.join('\n'));
assert.deepEqual(toLocalObject(model.stats), {
    conditionCount: 52,
    ruleCount: 130,
    groupCount: 10,
    familyCount: 73,
    entityCount: 194,
});
assert.deepEqual(
    toLocalObject(Object.fromEntries(model.groups.map(group => [group.name, group.ruleIds.length]))),
    {
        名俱生组: 60,
        所缘组: 17,
        无间组: 7,
        色俱生组: 15,
        依处组: 11,
        自然亲依止组: 3,
        后生组: 4,
        异业组: 4,
        色食组: 6,
        色命根组: 3,
    }
);
assert.equal(filterConditionRules(model, {conditionId: 52}).length, 1);
assert.equal(filterConditionRules(model, {timing: 'rebirth'}).length, 23);
assert.equal(filterConditionRules(model, {group: '名俱生组'}).length, 60);
assert.ok(filterConditionRules(model, {query: '涅槃'}).length > 0);
assert.equal(Object.keys(model.rupaAggregateComponents).length, 23);
assert.ok(model.rules.some(rule => rule.impliedEffectIds.length > 0));
assert.ok(model.families.some(family => family.length >= 6));

const firstRule = model.rules[0];
const causeSummary = summarizeConditionEntities(model, firstRule.causeIds);
assert.ok(causeSummary.length > 0);
assert.equal(causeSummary.reduce((total, group) => total + group.count, 0), firstRule.causeIds.length);

const workspaceState = createConditionsWorkspaceState(model, null);
const richRule = model.rules.find(rule => rule.impliedEffectIds.length && rule.suppressedIds.length) || firstRule;
const relationMarkup = renderConditionRelation(workspaceState, richRule);
const inspectorMarkup = renderConditionsInspector(workspaceState, richRule);
assert.match(relationMarkup, /FOCUSED RELATION/);
assert.match(relationMarkup, /缘法/);
assert.match(relationMarkup, /直接缘生法/);
assert.match(inspectorMarkup, /RULE INSPECTOR/);
assert.doesNotMatch(relationMarkup + inspectorMarkup, /undefined/);
assert.equal(conditionRuleContainsEntity(richRule, richRule.causeIds[0]), true);

const effectDomains = summarizeConditionEntities(model, richRule.effectIds);
workspaceState.expandedDomains.effect.add(effectDomains[0].key);
const subgroupMarkup = renderConditionRelation(workspaceState, richRule);
assert.match(subgroupMarkup, /toggle-subgroup/);
workspaceState.expandedSubgroups.effect.add(effectDomains[0].subgroups[0].key);
const entityMarkup = renderConditionRelation(workspaceState, richRule);
assert.match(entityMarkup, /conditions-entity-chip/);

vm.runInContext(`
    bindConditionsControlInteractions = () => {};
    bindConditionsNavigatorInteractions = () => {};
    bindConditionsResultInteractions = () => {};
    bindConditionsRelationInteractions = () => {};
    updateConditionsEntityHighlight = () => {};
`, context);
const fakeElements = Object.fromEntries([
    '#conditions-summary',
    '#conditions-controls',
    '#conditions-navigator',
    '#conditions-results',
    '#conditions-relation',
    '#conditions-inspector',
    '#conditions-filter-status',
].map(selector => [selector, {innerHTML: '', textContent: ''}]));
const fakeHost = {
    dataset: {},
    querySelector: selector => fakeElements[selector] || null,
    querySelectorAll: () => [],
};
renderConditionsWorkspace(fakeHost, model);
assert.equal(fakeHost.dataset.ready, 'true');
assert.match(fakeElements['#conditions-summary'].innerHTML, /五十二缘关系工作台/);
assert.match(fakeElements['#conditions-navigator'].innerHTML, /52/);
assert.match(fakeElements['#conditions-results'].innerHTML, /具体规则/);
assert.match(fakeElements['#conditions-relation'].innerHTML, /FOCUSED RELATION/);
assert.match(fakeElements['#conditions-inspector'].innerHTML, /RULE INSPECTOR/);

console.log('conditions-model: 52 conditions, 130 rules, 73 relation families verified');
