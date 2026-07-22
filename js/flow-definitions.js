const FLOW_FAMILY_DEFINITIONS = {
    background: {labelKey: 'familyBackground', color: '#64748b'},
    adverting: {labelKey: 'familyAdverting', color: '#d97706'},
    senseResult: {labelKey: 'familySenseResult', color: '#0f766e'},
    determining: {labelKey: 'familyDetermining', color: '#2563eb'},
    javana: {labelKey: 'familyJavana', color: '#7c3aed'},
    registration: {labelKey: 'familyRegistration', color: '#15803d'},
};

const FLOW_CITTA_DEFINITIONS = [
    {
        id: 1,
        key: 'bhavanga',
        labelKey: 'string_id_460',
        family: 'background',
    },
    {
        id: 2,
        key: 'pastBhavanga',
        labelKey: 'string_id_461',
        family: 'background',
    },
    {
        id: 3,
        key: 'vibratingBhavanga',
        labelKey: 'string_id_462',
        family: 'background',
    },
    {
        id: 4,
        key: 'arrestingBhavanga',
        labelKey: 'string_id_463',
        family: 'background',
    },
    {
        id: 5,
        key: 'fiveDoorAdverting',
        labelKey: 'string_id_464',
        family: 'adverting',
        candidates: [
            {classKey: 'string_id_465', cittaKeys: ['string_id_163']},
        ],
    },
    {
        id: 6,
        key: 'senseConsciousness',
        labelKey: 'string_id_135',
        family: 'senseResult',
        candidates: [
            {
                classKey: 'string_id_466',
                cittaKeys: ['string_id_132', 'string_id_136', 'string_id_139', 'string_id_142', 'string_id_145'],
                matcher: {likable: 3},
            },
            {
                classKey: 'string_id_467',
                cittaKeys: ['string_id_132', 'string_id_136', 'string_id_139', 'string_id_142', 'string_id_145'],
            },
        ],
    },
    {
        id: 7,
        key: 'receiving',
        labelKey: 'string_id_150',
        family: 'senseResult',
        candidates: [
            {classKey: 'string_id_466', cittaKeys: ['string_id_148'], matcher: {likable: 3}},
            {classKey: 'string_id_467', cittaKeys: ['string_id_148']},
        ],
    },
    {
        id: 8,
        key: 'investigation',
        labelKey: 'string_id_153',
        family: 'senseResult',
        candidates: [
            {classKey: 'string_id_466', cittaKeys: ['string_id_148'], matcher: {likable: 3}},
            {classKey: 'string_id_467', cittaKeys: ['string_id_148'], matcher: {likable: 2}},
            {classKey: 'string_id_467', cittaKeys: ['string_id_157']},
        ],
    },
    {
        id: 9,
        key: 'determining',
        labelKey: 'string_id_166',
        family: 'determining',
        candidates: [
            {classKey: 'string_id_465', cittaKeys: ['string_id_165']},
        ],
    },
    {
        id: 10,
        key: 'javana',
        labelKey: 'string_id_25',
        family: 'javana',
        candidates: [
            {
                classKey: 'string_id_468',
                cittaKeys: [
                    'string_id_47', 'string_id_59', 'string_id_63', 'string_id_66',
                    'string_id_67', 'string_id_69', 'string_id_70', 'string_id_71',
                    'string_id_72', 'string_id_80', 'string_id_81', 'string_id_83',
                ],
                matcher: {arahant: false, goodIntention: false},
            },
            {
                classKey: 'string_id_469',
                cittaKeys: [
                    'string_id_110', 'string_id_116', 'string_id_117', 'string_id_118',
                    'string_id_119', 'string_id_120', 'string_id_121', 'string_id_122',
                ],
                matcher: {arahant: false, goodIntention: true},
            },
            {
                classKey: 'string_id_470',
                cittaKeys: [
                    'string_id_110', 'string_id_116', 'string_id_117', 'string_id_118',
                    'string_id_119', 'string_id_120', 'string_id_121', 'string_id_122', 'string_id_167',
                ],
                matcher: {arahant: true},
            },
        ],
    },
    {
        id: 11,
        key: 'registration',
        labelKey: 'string_id_128',
        family: 'registration',
        candidates: [
            {
                classKey: 'string_id_471',
                cittaKeys: ['string_id_119', 'string_id_120', 'string_id_121', 'string_id_122', 'string_id_152'],
                matcher: {likable: 3},
            },
            {
                classKey: 'string_id_472',
                cittaKeys: ['string_id_110', 'string_id_116', 'string_id_117', 'string_id_118', 'string_id_152'],
                matcher: {likable: 2},
            },
            {
                classKey: 'string_id_472',
                cittaKeys: ['string_id_110', 'string_id_116', 'string_id_117', 'string_id_118', 'string_id_157'],
            },
        ],
    },
    {
        id: 12,
        key: 'mindDoorAdverting',
        labelKey: 'string_id_473',
        family: 'adverting',
        candidates: [
            {classKey: 'string_id_465', cittaKeys: ['string_id_165']},
        ],
    },
];

const FLOW_CITTA_BY_ID = Object.fromEntries(FLOW_CITTA_DEFINITIONS.map((definition) => [definition.id, definition]));

const FIVE_DOOR_FLOW_PATTERNS = [
    {id: 1, classKey: 'string_id_474', sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, {id: 10, count: 7}, {id: 11, count: 2}, 1]},
    {id: 2, classKey: 'string_id_475', sequence: [1, {id: 2, count: 2}, 3, 4, 5, 6, 7, 8, 9, {id: 10, count: 7}, {id: 1, count: 2}]},
    {id: 3, classKey: 'string_id_475', sequence: [1, {id: 2, count: 3}, 3, 4, 5, 6, 7, 8, 9, {id: 10, count: 7}, 1]},
    {id: 4, classKey: 'string_id_476', sequence: [1, {id: 2, count: 4}, 3, 4, 5, 6, 7, 8, {id: 9, count: 3}, {id: 1, count: 5}]},
    {id: 5, classKey: 'string_id_476', sequence: [1, {id: 2, count: 5}, 3, 4, 5, 6, 7, 8, {id: 9, count: 3}, {id: 1, count: 4}]},
    {id: 6, classKey: 'string_id_476', sequence: [1, {id: 2, count: 6}, 3, 4, 5, 6, 7, 8, {id: 9, count: 3}, {id: 1, count: 3}]},
    {id: 7, classKey: 'string_id_476', sequence: [1, {id: 2, count: 7}, 3, 4, 5, 6, 7, 8, {id: 9, count: 3}, {id: 1, count: 2}]},
    {id: 8, classKey: 'string_id_476', sequence: [1, {id: 2, count: 8}, 3, 4, 5, 6, 7, 8, {id: 9, count: 3}, 1]},
    {id: 9, classKey: 'string_id_476', sequence: [1, {id: 2, count: 9}, 3, 4, 5, 6, 7, 8, {id: 9, count: 2}, 1]},
    {id: 10, classKey: 'string_id_477', sequence: [1, {id: 2, count: 10}, {id: 3, count: 2}, {id: 1, count: 6}]},
    {id: 11, classKey: 'string_id_477', sequence: [1, {id: 2, count: 11}, {id: 3, count: 2}, {id: 1, count: 5}]},
    {id: 12, classKey: 'string_id_477', sequence: [1, {id: 2, count: 12}, {id: 3, count: 2}, {id: 1, count: 4}]},
    {id: 13, classKey: 'string_id_477', sequence: [1, {id: 2, count: 13}, {id: 3, count: 2}, {id: 1, count: 3}]},
    {id: 14, classKey: 'string_id_477', sequence: [1, {id: 2, count: 14}, {id: 3, count: 2}, {id: 1, count: 2}]},
    {id: 15, classKey: 'string_id_477', sequence: [1, {id: 2, count: 15}, {id: 3, count: 2}, 1]},
];

const MIND_DOOR_FLOW_PATTERNS = [
    {id: 1, classKey: 'string_id_478', sequence: [1, 2, 3, 4, 12, {id: 10, count: 7}, {id: 11, count: 2}, 1]},
    {id: 2, classKey: 'string_id_479', sequence: [1, 2, 3, 4, 12, {id: 10, count: 7}, {id: 1, count: 3}]},
    {id: 3, classKey: 'string_id_480', sequence: [1, 2, {id: 12, count: 3}, {id: 1, count: 10}]},
    {id: 4, classKey: 'string_id_480', sequence: [1, 2, {id: 12, count: 2}, {id: 1, count: 11}]},
    {id: 5, classKey: 'string_id_481', sequence: [1, 2, {id: 3, count: 3}, {id: 1, count: 10}]},
    {id: 6, classKey: 'string_id_481', sequence: [1, 2, {id: 3, count: 2}, {id: 1, count: 11}]},
];

const FLOW_PATTERN_DEFINITIONS = {
    sense: FIVE_DOOR_FLOW_PATTERNS,
    mind: MIND_DOOR_FLOW_PATTERNS,
};

const FLOW_STRENGTH_BANDS = {
    sense: [
        {id: 'registration', start: 1, end: 1, classKey: 'string_id_474'},
        {id: 'javana', start: 2, end: 3, classKey: 'string_id_475'},
        {id: 'determining', start: 4, end: 9, classKey: 'string_id_476'},
        {id: 'ineffective', start: 10, end: 15, classKey: 'string_id_477'},
    ],
    mind: [
        {id: 'veryClear', start: 1, end: 1, classKey: 'string_id_478'},
        {id: 'clear', start: 2, end: 2, classKey: 'string_id_479'},
        {id: 'unclear', start: 3, end: 4, classKey: 'string_id_480'},
        {id: 'veryUnclear', start: 5, end: 6, classKey: 'string_id_481'},
    ],
};

// Compatibility aliases for older modules and console exploration.
const flowCittas = FLOW_CITTA_DEFINITIONS;
const fiveDoorFlows = FIVE_DOOR_FLOW_PATTERNS;
const mindDoorFlows = MIND_DOOR_FLOW_PATTERNS;
