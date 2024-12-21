const terms = {
    '六因': ['贪', '瞋', '痴', '无贪', '无嗔', '慧'], // 慧 - 无痴
    '四增上': ['心', '欲', '精进', '慧'], // 欲 - 欲心所; 精进 - 精进心所; 观 - 慧心所
    '四因所生色聚': ['心生色聚', '业生色聚', '时节生色聚', '食生色聚'],
    '七禅支': ['寻', '伺', {'受': ['悦', '忧', '舍']}, '一境性', '喜'],
    '十五无色根': [{'心': '意根'}, {'受': ['乐', '苦', '悦', '忧', '舍']}, {'命根': '名命根'}, '信', '精进', '念', {'一境性': '定'}, {'慧': ['世间慧根', '未知当知根', '已知根', '具知根']}],
    '三杂心所': ['正语', '正业', '正命'],
    '十二道': [{'慧': '正见'}, {'寻': ['正思维', '邪思维']}, '正语', '正业', '正命', {'精进': ['正精进', '邪精进']}, {'念': '正念'}, {'一境性': ['正定', '邪定']}, {'见': '邪见'}],
};

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false; // Different lengths, not equal
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

const keywords = {
    '因': '缘法如树根般稳固地支持缘所生法',
    '所缘': '缘所生法取缘法为目标',
    '增上': '缘法支配缘所生法',
    '无间': '缘法与缘所生法不间断',
    '等无间': '缘法与缘所生法不间断',
    '俱生': '缘法与缘所生法同时生起',
    '相互': '缘法与缘所生法彼此相互缘助',
    '依止': '缘法作为缘所生法的依靠与生起之地',
    '亲依止': '缘所生法极度依靠缘法为所缘而生起',
    '前生': '以生起且未灭去的缘法缘助缘所生法生起',
    '后生': '后生的缘法缘助与增强缘所生法',
    '重复': '刚灭尽的缘法缘助同种类的缘所生法生起',
    '业': '业(缘法)缘助缘所生法生起',
    '果报': '果报(缘法)缘助缘所生法与它同时生起',
    '食': '食(缘法)维持缘所生法',
    '相应': '缘法与缘所生法彼此缘助对方与之同生、同灭、同所依、同所缘',
    '根': '缘法控制缘所生法',
    '禅那': '缘法缘助缘所生法紧密地观察目标',
    '道': '缘法缘助缘所生法达到目标(正或邪)',
    '不相应': '缘法与缘所生法属于两种不同类型，名色同时存在',
    '有': '缘法与缘所生法时间上重叠同时存在',
    '无有': '缘法缘助缘所生法在缘法灭去后立即升起',
    '离去': '缘法缘助缘所生法在缘法灭去后立即升起',
    '不离去': '缘法与缘所生法中一个生起时，另一个尚未灭去',
};

const conditions = {
    name: '五十二缘',
    children: [
        {
            name: '因缘',
            id: 1,
            keywords: ['因'],
            children: [
                // 连结名色法的缘法结生时较为特别，因为前一世的色法已不复存在，今生的色法将作为同时生起的色法来支助名法的生起。
                {
                    cause: ['名'],
                    effect: '色',
                    causes: ['一因', '二因', '三因'],
                    effectSummary: '其余名法',
                    group: '名俱生组',
                    expand: function (cause) {
                        if (cause === '一因') {
                            // ['痴']
                            return [[114]];
                        } else if (cause === '二因') {
                            // [['贪', '痴'], ['嗔', '痴'], ['无贪', '无嗔']]
                            return [[118, 114], [121, 114], [132, 133]];
                        } else if (cause === '三因') {
                            return [[132, 133, 152]];
                        }
                    },
                    effects: function (causes) {
                        if (arraysEqual(causes, [114])) {
                            return [11, 12];
                        } else if (arraysEqual(causes, [118, 114])) {
                            return [1, 2, 3, 4, 5, 6, 7, 8];
                        } else if (arraysEqual(causes, [121, 114])) {
                            return [9, 10];
                        } else if (arraysEqual(causes, [132, 133])) {
                            return [9, 10, 15, 16, 19, 20, 23, 24, 27, 28, 46, 47, 50, 51];
                        } else {
                            return [13, 14, 17, 18, 21, 22, 25, 26, 44, 45, 48, 49, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
                        }
                    },
                    note: '六因（一、二、三因）作为同一有因名聚里其余名法的因缘'
                },
                {
                    cause: ['名'],
                    effect: '名',
                    causes: ['结生二因', '结生三因'],
                    group: '名俱生组',
                    effectSummary: '业生色聚',
                    expand: function (cause) {
                        if (cause === '结生二因') {
                            return [[132, 133]];
                        } else if (cause === '结生三因') {
                            return [[132, 133, 152]];
                        }
                    },
                    effects: function (causes) {
                        return [9320, 9321, 9322, 9323];
                    },
                    rebirth: true,
                    note: '结生时，二因、三因作为俱生有因业生色聚的因缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: ['一因', '二因', '三因'],
                    group: '名俱生组',
                    effectSummary: '心生色聚',
                    expand: function (cause) {
                        if (cause === '一因') {
                            // ['痴']
                            return [[114]];
                        } else if (cause === '二因') {
                            // [['贪', '痴'], ['嗔', '痴'], ['无贪', '无嗔']]
                            return [[118, 114], [121, 114], [132, 133]];
                        } else if (cause === '三因') {
                            return [[132, 133, 152]];
                        }
                    },
                    effects: function (causes) {
                        return [9301, 9302, 9303, 9304, 9305, 9306, 9307, 9308];
                    },
                    note: '六因（一、二、三因）作为俱生有因心生色聚的因缘'
                }
            ],
        },
        {
            name: '所缘缘',
            id: 2,
            keywords: ['所缘'],
            children: [
                {
                    cause: ['名', '色', '概念', '涅槃'],
                    effect: '名',
                    causes: ['名', '色', '概念', '涅槃'],
                    group: '所缘组',
                    expand: function (cause) {
                        if (cause === '名') {
                            return [allCittas.map(citta => citta.id).concat(allCetasika.map(cetasika => cetasika.id))];
                        } else if (cause === '色') {
                            return [Object.keys(rupaIndex).map(key => rupaIndex[key].id)];
                        } else if (cause === '概念') {
                            return [[-1]];
                        } else {
                            return [[0]]
                        }
                    },
                    effectSummary: '名聚',
                    effects: function (causes) {
                        return allCittas.map(citta => citta.id);
                    },
                    note: '目标或对象作为名聚的所缘'
                },
            ]
        },
        {
            name: '俱生增上缘',
            id: 3,
            keywords: ['俱生', '增上'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: ['心', '欲', '精进', '慧'],
                    expand: function (cause) {
                        if (cause === '心') {
                            return [allCittas.map(citta => citta.id)];
                        } else {
                            return [[cetasikaIdIndex[cause]]];
                        }
                    },
                    effectSummary: '名聚',
                    effects: function (causes) {
                        const filteredCittas = allCittas.filter(citta => {
                            const cetasikas = new Set(subEffectIndex[citta.id]);
                            if (cetasikas.has(118) && cetasikas.has(114) ||
                                cetasikas.has(121) && cetasikas.has(114) ||
                                cetasikas.has(132) && cetasikas.has(133)) {
                                if (causes.length === 1 && !cetasikas.has(causes[0])) {
                                    return false;
                                }
                                return citta.functions.includes('速行');
                            }
                            return false;
                        })
                        return filteredCittas.map(citta => citta.id);
                    },
                    group: '名俱生组',
                    note: '四增上之一作为2因或3因同一速行名聚里其余名法的增上缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: ['心', '欲', '精进', '慧'],
                    expand: function (cause) {
                        if (cause === '心') {
                            return [allCittas.map(citta => citta.id)];
                        } else {
                            return [[cetasikaIdIndex[cause]]];
                        }
                    },
                    effectSummary: '心生色聚',
                    effects: function (causes) {
                        // TODO: implement
                        return [9301, 9302, 9303, 9304, 9305, 9306, 9307, 9308];
                    },
                    group: '名俱生组',
                    note: '四增上之一作为俱生心生色聚的增上缘'
                },
            ]
        },
        {
            name: '所缘增上缘',
            id: 4,
            keywords: ['所缘', '增上'],
            children: [
                {
                    cause: ['名', '色', '涅槃'],
                    effect: '名',
                    causes: [],
                    effects: [], // 名+18 完成色→8 貪；名→8 大善+4 三因唯作；涅槃→8 出世間心+4 三因大善+三因唯作
                    group: '所缘组',
                    note: '极重视、尊重、执着的可意所缘作为名聚的增上缘'
                },
            ]
        },
        {
            name: '无间缘',
            id: 5,
            keywords: ['无间'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '刚灭尽的前一名聚作为现在名聚的无间缘'
                },
            ]
        },
        {
            name: '等无间缘',
            id: 6,
            keywords: ['等无间'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '前一名聚灭尽，现在名聚立即依心的定律生起'
                },
            ]
        },
        {
            name: '俱生缘',
            id: 7,
            keywords: ['俱生'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一名聚里的任何名法与其余名法相互地作为俱生缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '同一色聚里的任何四大与其余四大相互地作为俱生缘'
                },
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '色俱生组',
                    note: '结生时，心所依处1色与结生名聚相互地作为俱生缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚与心所依处1色相互地作为俱生缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚作为业生29色(不含心色1色)的俱生缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '现在名聚作为俱生心生色聚的俱生缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '四大作为同一色聚里所造色的俱生缘'
                },
            ]
        },
        {
            name: '相互缘',
            id: 8,
            keywords: ['相互'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一名聚里的任何名法与其余名法相互地作为相互缘'
                },
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '色俱生组',
                    note: '结生时，心所依处1色与结生名聚相互地作为相互缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '结生时，结生名聚与心所依处1色相互地作为相互缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '同一色聚里的任何四大与其余四大相互地作为相互缘'
                },
            ]
        },
        {
            name: '俱生依止缘',
            id: 9,
            keywords: ['俱生', '依止'],
            note: '缘法与缘所生法同俱生缘，但是强调缘法作为缘所生法的依止与生起地',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一名聚里的任何名法与其余名法相互地作为依止缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '同一色聚里的任何四大与其余四大相互地作为依止缘'
                },
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '结生时，心所依处1色与结生名聚相互地作为依止缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '结生时，结生名聚与心所依处1色相互地作为依止缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '结生时，结生名聚作为业生29色(不含心色1色)的依止缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '现在名聚作为俱生心生色聚的依止缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '四大作为同一色聚里所造色的依止缘'
                },
            ]
        },
        {
            name: '依处前生依止缘',
            id: 10,
            keywords: ['依处', '前生', '依止'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '由于前一心生起且是住时的心所依处，作为75名聚的依止缘; 由于过去有分生起且达到住时的五净色，作为双五识的依止缘'
                },
            ]
        },
        {
            name: '依处所缘前生依止缘',
            id: 11,
            keywords: ['依处', '所缘', '前生', '依止'],
            
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '心所依处同时作为现在名聚的依处与所缘'
                },
            ]
        },
        {
            name: '无间亲依止缘',
            id: 12,
            keywords: ['无间', '亲依止'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '刚灭尽的前一名聚作为后一名聚的无间亲依止缘'
                },
            ]
        },
        {
            name: '所缘亲依止缘',
            id: 13,
            keywords: ['所缘', '亲依止'],
            children: [
                {
                    cause: ['名', '色', '涅槃'],
                    effect: '名',
                    causes: [], // 名+18 完成色→8 貪，名→8 大善+4 三因唯作，涅槃→8 出世間心+4 三因大善+三因唯作
                    effects: [],
                    group: '所缘组',
                    note: '强有力的可意所缘作为名聚的所缘亲依止缘'
                },
            ]
        },
        {
            name: '自然亲依止缘',
            id: 14,
            keywords: ['自然', '亲依止'],
            children: [
                {
                    cause: ['名', '色', '概念'],
                    effect: '名',
                    causes: [], // 緣法包括：過去的任何名色及與時間無關的概念，及過去所造的業
                    effects: [],
                    group: '自然亲依止组',
                    note: '任何强力的法作为现在名聚的自然亲依止缘'
                },
            ]
        },
        {
            name: '依处前生缘',
            id: 15,
            keywords: ['依处', '前生'],
            note: '前生缘的缘法一定是色法，缘所生法一定是名法',
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '于前一心生起且是住时的心所依处，作为75名聚的前生缘; 于过去有分生起且达到住时的五净色，作为双五识的前生缘'
                },
            ]
        },
        {
            name: '所缘前生缘',
            id: 16,
            keywords: ['所缘', '前生'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '于过去有分生起的现在18完成色之一，作为现在名聚的前生缘'
                },
            ]
        },
        {
            name: '依处所缘前生缘',
            id: 17,
            keywords: ['依处', '所缘', '前生'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '前生的心所依处同时作为现在名聚的依处与所缘'
                },
            ]
        },
        {
            name: '后生缘',
            id: 18,
            keywords: ['后生'],
            note: '后生缘的缘法一定是名法，缘所生法一定是色法',
            children: [
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '后生组',
                    note: '后生名聚作为色身里前生的四因所生色聚的后生缘'
                },
            ]
        },
        {
            name: '重复缘',
            id: 19,
            keywords: ['重复'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '一至倒数第二速行作为第二至最后速行的重复缘; 果心没有重复缘'
                },
            ]
        },
        {
            name: '俱生业缘',
            id: 20,
            keywords: [],
            note: '思心所作为同一名聚里其余名法的俱生业缘',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '思心所作为同一名聚里其余名法的俱生业缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，思心所作为俱生业生色聚的俱生业缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '思心所作为俱生心生色聚的俱生业缘'
                },
            ]
        },
        {
            name: '无间业缘',
            id: 21,
            keywords: ['无间', '业'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '刚灭尽的道心作为紧接着生起的道无间果心的无间业缘'
                },
            ]
        },
        {
            name: '异刹那业缘',
            id: 22,
            keywords: ['异刹那', '业'],
            note: '思心所食未来果报名聚的异刹那业缘',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '异业组',
                    note: '过去造业的善或不善思心所作为现在果报名聚的异刹那业缘，包括道心对果心'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '异业组',
                    note: '过去造业的善或不善思心所作为业生色聚的异刹那业缘'
                },
            ]
        },
        {
            name: '自然亲依止业缘',
            id: 23,
            keywords: ['自然', '亲依止', '业'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '异业组',
                    note: '过去造业的强力思心所作为现在果报名聚的自然亲依止业缘'
                },
            ]
        },
        {
            name: '果报缘',
            id: 24,
            keywords: ['果报'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一果报名聚里的任何名法与其余名法相互地作为果报缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，果报名聚作为俱生业生色聚（含心色）的果报缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '果报名聚作为心生色聚的果报缘'
                },
            ]
        },
        {
            name: '俱生食缘',
            id: 25,
            keywords: ['俱生', '食'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '触、思、心作为同一名聚里其余名法的俱生食缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，触、思、心作为俱生业生色聚（含心色）的俱生食缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '触、思、心作为俱生心生色聚的俱生食缘'
                },
            ]
        },
        {
            name: '色食缘',
            id: 26,
            keywords: ['色', '食'],
            children: [
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色食组',
                    note: '食物里的食素作为食生色聚的色食缘; 四因所生色聚里的食素作为同一色聚里其他可色假发的色食缘，也作为新生代食生色聚的色食缘'
                },
            ]
        },
        {
            name: '俱生根缘',
            id: 27,
            keywords: ['俱生', '根'],
            note: '疑心的根缘没有一境性',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '名根作为同一名聚里其余名法的俱生根缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚作为俱生业生色聚（含心色）的俱生根缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '根作为俱生心生色聚的俱生根缘'
                },
            ]
        },
        {
            name: '依处前生根缘',
            id: 28,
            keywords: ['依处', '前生', '根'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '于过去有分生起且住时的五净色作为双五识的依处前生根缘'
                },
            ]
        },
        {
            name: '色命根缘',
            id: 29,
            keywords: ['色', '命根'],
            children: [
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色命根组',
                    note: '色命根作为同一业生色聚里其他俱生业生色法的色命根缘'
                },
            ]
        },
        {
            name: '禅那缘',
            id: 30,
            keywords: ['禅那'],
            note: '禅那缘不缘住双五识',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '禅支作为同一名聚里其余名法的禅那缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，禅支作为俱生业生色聚（含心色）的禅那缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '禅支作为俱生心生色聚的禅那缘'
                },
            ]
        },
        {
            name: '道缘',
            id: 31,
            keywords: ['道'],
            note: '道缘不缘助18无因心，疑心的道缘没有一境性',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '道分作为同一名聚里其余名法的道缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，道分作为俱生业生色聚（含心色）的道缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '道分作为俱生心生色聚的道缘'
                },
            ]
        },
        {
            name: '相应缘',
            id: 32,
            keywords: ['相应'],
            note: '同一名里的名法才有相应缘，色法及不同名聚的名法没有相应缘',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一名聚里的任何名法作为其余名法的相应缘（同时生、同时灭、同一所缘、同一依处）'
                },
            ]
        },
        {
            name: '俱生不相应缘',
            id: 33,
            keywords: ['俱生', '不相应'],
            note: '缘法与缘所生法一个是名，一个是色', // move to keyword section (不相应)
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '结生时，心色（1色）作为结生名聚的不相应缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '结生时，结生名聚作为心色（1色）的不相应缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '结生时，结生名聚作为业生29色(不含心色1色)的不相应缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '名聚作为俱生心生色聚的不相应缘'
                },
            ]
        },
        {
            name: '依处前生不相应缘',
            id: 34,
            keywords: ['依处', '前生', '不相应'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '前生的六依处，作为现在名聚的不相应缘'
                },
            ]
        },
        {
            name: '依处所缘前生不相应缘',
            id: 35,
            keywords: ['依处', '所缘', '前生', '不相应'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '前生的心所依处，作为现在名聚的不相应缘（同时为依处与所缘）'
                },
            ]
        },
        {
            name: '后生不相应缘',
            id: 36,
            keywords: ['后生', '不相应'],
            children: [
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '后生组',
                    note: '后生名聚作为色身里前生的四因所生色聚的后生不相应缘'
                },
            ]
        },
        {
            name: '俱生有缘',
            id: 37,
            keywords: ['俱生', '有'],
            note: '缘法与缘所生法同时存在，故有缘',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一名聚里的任何名法与其余名法相互地作为有缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '同一色聚里的任何四大与其余四大相互地作为有缘'
                },
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '色俱生组',
                    note: '结生时, 心所依处1色与俱生的结生名聚相互地作为有缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚与俱生的心所依处1色相互地作为有缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚作为俱生的业生29色(不含心色1色)的有缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '现在名聚作为俱生的心生色聚的有缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '四大作为同一色聚里所造色的有缘'
                },
            ]
        },
        {
            name: '依处前生有缘',
            id: 38,
            keywords: ['依处', '前生', '有'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '于前一心生起且是住时的心所依处，作为75名聚的前生有缘; 于过去有分生起且达到住时的五净色，作为双五识的有缘'
                },
            ]
        },
        {
            name: '所缘前生有缘',
            id: 39,
            keywords: ['所缘', '前生', '有'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '于过去有分生起的18完成色，作为现在名聚的有缘'
                },
            ]
        },
        {
            name: '依处所缘前生有缘',
            id: 40,
            keywords: ['依处', '所缘', '前生', '有'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '前生的心所依处作为现在名聚的有缘'
                },
            ]
        },
        {
            name: '后生有缘',
            id: 41,
            keywords: ['后生', '有'],
            children: [
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '后生组',
                    note: '后生名聚作为身体前生且是住时的四因所生色聚的有缘'
                },
            ]
        },
        {
            name: '色食有缘',
            id: 42,
            keywords: ['色', '食', '有'],
            children: [
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色食组',
                    note: '食素作为同色聚里其余色法及不同色聚的有缘'
                },
            ]
        },
        {
            name: '命根有缘',
            id: 43,
            keywords: ['命根', '有'],
            children: [
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色命根组',
                    note: '色命根作为同一业生色聚里其他色法的有缘'
                },
            ]
        },
        {
            name: '无有缘',
            id: 44,
            keywords: ['无有'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '刚灭尽的前一名聚作为现在名聚的无有缘'
                },
            ]
        },
        {
            name: '离去缘',
            id: 45,
            keywords: ['离去'],
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '无间组',
                    note: '刚灭尽的前一名聚作为现在名聚的离去缘'
                },
            ]
        },
        {
            name: '俱生不离去缘',
            id: 46,
            keywords: ['俱生', '不离去'],
            note: '尚未灭去的缘法或缘所生法其中之一与另一者重叠存在',
            children: [
                {
                    cause: ['名'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '同一名聚里的任何名法与其余名法相互地作为不离去缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '同一色聚里的任何四大与其余四大相互地作为不离去缘'
                },
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '色俱生组',
                    note: '结生时, 心所依处1色与俱生的结生名聚相互地作为不离去缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚与俱生的心所依处1色相互地作为不离去缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    rebirth: true,
                    group: '名俱生组',
                    note: '结生时，结生名聚作为俱生的业生29色(不含心色1色)的不离去缘'
                },
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '名俱生组',
                    note: '现在名聚作为俱生的心生色聚的不离去缘'
                },
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色俱生组',
                    note: '四大作为同一色聚里所造色的不离去缘'
                },
            ]
        },
        {
            name: '依处前生不离去缘',
            id: 47,
            keywords: ['依处', '前生', '不离去'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '依处组',
                    note: '于前一心生起且尚未灭去的心所依处，作为现在名聚的前生不离去缘; 于过去有分生起且尚未灭去的五净色，作为五识的不离去缘'
                },
            ]
        },
        {
            name: '所缘前生不离去缘',
            id: 48,
            keywords: ['所缘', '前生', '不离去'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '于过去有分生起的18完成色，作为现在名聚的不离去缘'
                },
            ]
        },
        {
            name: '依处所缘前生不离去缘',
            id: 49,
            keywords: ['依处', '所缘', '前生', '不离去'],
            children: [
                {
                    cause: ['色'],
                    effect: '名',
                    causes: [],
                    effects: [],
                    group: '所缘组',
                    note: '前生的心所依处作为现在名聚的不离去缘'
                },
            ]
        },
        {
            name: '后生不离去缘',
            id: 50,
            keywords: ['后生', '不离去'],
            children: [
                {
                    cause: ['名'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '后生组',
                    note: '后生名聚作为身体前生且是住时的四因所生色聚的不离去缘'
                },
            ]
        },
        {
            name: '色食不离去缘',
            id: 51,
            keywords: ['色', '食', '不离去'],
            children: [
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色食组',
                    note: '尚未灭去的食素作为同色聚里其余色法及不同色聚的不离去缘'
                },
            ]
        },
        {
            name: '命根不离去缘',
            id: 52,
            keywords: ['命根', '不离去'],
            children: [
                {
                    cause: ['色'],
                    effect: '色',
                    causes: [],
                    effects: [],
                    group: '色命根组',
                    note: '色命根作为同一业生色聚里其他色法的不离去缘'
                },
            ]
        },
    ],
};
