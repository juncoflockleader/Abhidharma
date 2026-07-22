function flowHasOwn(object, key) {
    return Boolean(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function resolveFlowCandidate(candidates, scenario) {
    if (!Array.isArray(candidates) || !candidates.length) {
        return null;
    }

    let bestMatch = null;
    let bestScore = -1;
    candidates.forEach((candidate) => {
        const matcher = candidate.matcher || {};
        const keys = Object.keys(matcher);
        const matches = keys.every((key) => scenario[key] === matcher[key]);
        if (!matches) {
            return;
        }
        if (keys.length >= bestScore) {
            bestMatch = candidate;
            bestScore = keys.length;
        }
    });

    return bestMatch || candidates.find((candidate) => !candidate.matcher) || candidates[candidates.length - 1];
}

function expandFlowPattern(pattern, scenario) {
    const nodes = [];
    (pattern.sequence || []).forEach((item) => {
        const phaseId = typeof item === 'object' ? item.id : item;
        const count = typeof item === 'object' ? item.count : 1;
        const definition = FLOW_CITTA_BY_ID[phaseId];
        if (!definition) {
            throw new Error(`[flow-engine] Unknown phase id: ${phaseId}`);
        }
        for (let occurrence = 0; occurrence < count; occurrence += 1) {
            nodes.push({
                id: nodes.length,
                moment: nodes.length,
                phaseId,
                occurrence,
                definition,
                family: definition.family,
                candidate: resolveFlowCandidate(definition.candidates, scenario),
            });
        }
    });
    return nodes;
}

function groupFlowNodes(nodes) {
    const groups = [];
    nodes.forEach((node, index) => {
        const previous = groups[groups.length - 1];
        if (previous && previous.family === node.family) {
            previous.endIndex = index;
            previous.count += 1;
            previous.phaseIds.add(node.phaseId);
            return;
        }
        groups.push({
            family: node.family,
            startIndex: index,
            endIndex: index,
            count: 1,
            phaseIds: new Set([node.phaseId]),
        });
    });
    return groups;
}

function getFlowStrengthBand(type, sliderValue) {
    const value = Number(sliderValue);
    return (FLOW_STRENGTH_BANDS[type] || []).find((band) => value >= band.start && value <= band.end) || null;
}

function resolveFlowScenario(state) {
    const type = state.type === 'mind' ? 'mind' : 'sense';
    const patterns = FLOW_PATTERN_DEFINITIONS[type] || [];
    const requestedIndex = Number(state.sliderValue) - 1;
    const safeIndex = Math.max(0, Math.min(patterns.length - 1, Number.isFinite(requestedIndex) ? requestedIndex : 0));
    const pattern = patterns[safeIndex];
    const scenario = {
        likable: Number(state.likable),
        arahant: Boolean(state.arahant),
        goodIntention: Boolean(state.goodIntention),
    };
    const nodes = expandFlowPattern(pattern, scenario);
    const phaseCounts = {};
    nodes.forEach((node) => {
        phaseCounts[node.phaseId] = (phaseCounts[node.phaseId] || 0) + 1;
    });

    return {
        type,
        scenario,
        pattern,
        nodes,
        groups: groupFlowNodes(nodes),
        phaseCounts,
        hasJavana: Boolean(phaseCounts[10]),
        hasRegistration: Boolean(phaseCounts[11]),
        strengthBand: getFlowStrengthBand(type, safeIndex + 1),
    };
}

function validateFlowDefinitions() {
    const issues = [];
    Object.entries(FLOW_PATTERN_DEFINITIONS).forEach(([type, patterns]) => {
        const expectedMoments = type === 'sense' ? 19 : 15;
        patterns.forEach((pattern) => {
            const nodes = expandFlowPattern(pattern, {likable: 1, arahant: false, goodIntention: true});
            if (nodes.length !== expectedMoments) {
                issues.push(`${type}:${pattern.id} expected ${expectedMoments} moments, got ${nodes.length}`);
            }
        });
    });
    return issues;
}

window.resolveFlowCandidate = resolveFlowCandidate;
window.resolveFlowScenario = resolveFlowScenario;
window.validateFlowDefinitions = validateFlowDefinitions;
