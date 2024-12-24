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

function rangeInclusive(start, end) {
    return Array.from({length: end - start + 1}, (_, i) => i + start);
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

class Builder {
    constructor(initialSetName) {
        this.resultSet = new Set();
        if (initialSetName && Builder.variables[initialSetName]) {
            Builder.variables[initialSetName].forEach(item => this.resultSet.add(item));
        }
    }

    add(setName) {
        if (Builder.variables[setName]) {
            Builder.variables[setName].forEach(item => this.resultSet.add(item));
        }
        return this;
    }

    sub(setName) {
        if (Builder.variables[setName]) {
            Builder.variables[setName].forEach(item => this.resultSet.delete(item));
        }
        return this;
    }

    intersect(setName) {
        if (Builder.variables[setName]) {
            const intersection = new Set();
            Builder.variables[setName].forEach(item => {
                if (this.resultSet.has(item)) {
                    intersection.add(item);
                }
            });
            this.resultSet = intersection;
        }
        return this;
    }

    build() {
        return Array.from(this.resultSet);
    }

    static variables = {};
    static initialized = false;
    static setVariable(name, value) {
        Builder.variables[name] = value;
    }
    static getVariable(name) {
        return Builder.variables[name];
    }

    static initializeVariables() {
        if (!Builder.initialized) {
            Builder.setVariable('89心', rangeInclusive(1, 89));
            Builder.setVariable('18完成色', rangeInclusive(9001, 9018));
            Builder.setVariable('四大', rangeInclusive(9001, 9004));
            Builder.setVariable('52心所', rangeInclusive(101, 152));
            Builder.setVariable('因', [114, 118, 121, 132, 133, 152]);
            Builder.setVariable('一因心所', [114]);
            Builder.setVariable('贪根心所', [118, 114]);
            Builder.setVariable('嗔根心所', [121, 114]);
            Builder.setVariable('无贪无嗔心所', [132, 133]);
            Builder.setVariable('二因心所', [[118, 114], [121, 114], [132, 133]]);
            Builder.setVariable('三因心所', [132, 133, 152]);
            Builder.setVariable('一因心', [11, 12]);
            Builder.setVariable('二因心', allCittas.filter(citta => {
                const cetasikas = new Set(subEffectIndex[citta.id]);
                if (cetasikas.has(cetasikaIdIndex['贪']) && cetasikas.has(cetasikaIdIndex['痴']) ||
                    cetasikas.has(cetasikaIdIndex['嗔']) && cetasikas.has(cetasikaIdIndex['痴']) ||
                    cetasikas.has(cetasikaIdIndex['无贪']) && cetasikas.has(cetasikaIdIndex['无嗔'])) {
                    return !cetasikas.has(cetasikaIdIndex['慧']);
                }
                return false;
            }).map(citta => citta.id));
            Builder.setVariable('三因心', allCittas.filter(citta => {
                const cetasikas = new Set(subEffectIndex[citta.id]);
                return cetasikas.has(cetasikaIdIndex['无贪']) && cetasikas.has(cetasikaIdIndex['无嗔']) && cetasikas.has(cetasikaIdIndex['慧']);
            }).map(citta => citta.id));
            Builder.setVariable('贪根心', rangeInclusive(1, 8));
            Builder.setVariable('嗔根心', rangeInclusive(9, 10));
            Builder.setVariable('痴根心', Builder.getVariable('一因心'));
            Builder.setVariable('无贪无嗔心',  allCittas.filter(citta => {
                const cetasikas = new Set(subEffectIndex[citta.id]);
                if (cetasikas.has(cetasikaIdIndex['无贪']) && cetasikas.has(cetasikaIdIndex['无嗔'])) {
                    return !cetasikas.has(cetasikaIdIndex['慧']);
                }
                return false;
            }).map(citta => citta.id));
            Builder.setVariable('名法', new Builder('89心').add('52心所').build());
            Builder.setVariable('结生色聚', rangeInclusive(9320, 9323));
            Builder.setVariable('心生色聚', rangeInclusive(9301, 9308));
            Builder.setVariable('心所依处色', [16]);
            Builder.setVariable('色法', rangeInclusive(9001, 9028));
            Builder.setVariable('概念', [-1]);
            Builder.setVariable('涅槃', [0]);
            Builder.setVariable('速行心', allCittas.filter(citta => citta.functions.includes('速行')).map(citta => citta.id));
            Builder.setVariable('二因速行心', new Builder('速行心').intersect('二因心').build());
            Builder.setVariable('三因速行心', new Builder('速行心').intersect('三因心').build());
            Builder.setVariable('二因及三因速行心', new Builder('二因速行心').add('三因速行心').build());
            Builder.setVariable('欲心所对应心', allCittas.filter(citta => citta.cetasika.includes('欲')).map(citta => citta.id));
            Builder.setVariable('精进心所对应心', allCittas.filter(citta => citta.cetasika.includes('精进')).map(citta => citta.id));
            Builder.setVariable('慧心所对应心', allCittas.filter(citta => citta.cetasika.includes('慧')).map(citta => citta.id));
            Builder.setVariable('苦俱身识', [33]);
            Builder.setVariable('8大善心', rangeInclusive(13, 20));
            Builder.setVariable('8大唯作心', rangeInclusive(44, 51));
            Builder.setVariable('8大果报心', rangeInclusive(21, 28));
            Builder.setVariable('色界果报心', rangeInclusive(60, 64));
            Builder.setVariable('无色界果报心', rangeInclusive(74, 77));
            Builder.setVariable('12不善心', rangeInclusive(1, 12));
            Builder.setVariable('8出世间心', rangeInclusive(82, 89));
            Builder.setVariable('智相应8大唯作心', new Builder('8大唯作心').intersect('慧心所对应心').build());
            Builder.setVariable('2无量心所', [150, 151]);
            Builder.setVariable('心所依处色', [9016]);
            Builder.setVariable('结生心', new Builder('8大果报心').add('色界果报心').add('无色界果报心').build().concat(34, 42));
            Builder.setVariable('二因结生心', new Builder('二因心').intersect('结生心').build());
            Builder.setVariable('三因结生心', new Builder('三因心').intersect('结生心').build());
            Builder.setVariable('15结生果报心', new Builder('结生心').sub('无色界果报心').build()); // 此处为心所依处色的俱生缘，故不包括无色界果报心
            Builder.setVariable('35结生心所', new Builder('52心所').sub('14不善心所').sub('3离心所').build());
            Builder.setVariable('15结生名聚', new Builder('15结生果报心').add('35结生心所').build());
            Builder.setVariable('14不善心所', rangeInclusive(114, 127));
            Builder.setVariable('3离心所', rangeInclusive(147, 149));
            Builder.setVariable('心色十法聚', [9322]);
            Builder.setVariable('双五识', rangeInclusive(29, 33).concat(...rangeInclusive(36, 40)));
            Builder.setVariable('四大所造色', new Builder('色法').sub('四大').build());
            Builder.setVariable('五净色', rangeInclusive(9005, 9009));
            Builder.setVariable('六依处色', new Builder('五净色').add('心所依处色').build());
            Builder.setVariable('意门转向心', [53]);
            Builder.setVariable('生笑心', [54]);
            Builder.setVariable('彼所缘心', allCittas.filter(citta => citta.functions.includes('彼所缘')).map(citta => citta.id));
            Builder.setVariable('欲界速行心', new Builder('12不善心').add('8大善心').add('8大唯作心').add('生笑心').build());
            Builder.setVariable('神通心', [59, 69]);
            Builder.setVariable('2嗔心2痴心1苦俱身识', new Builder('嗔根心').add('痴根心').add('苦俱身识').build());
            Builder.setVariable('嗔嫉悭恶作疑', rangeInclusive(120, 125));
            Builder.setVariable('54欲界心', rangeInclusive(1, 54));
            Builder.setVariable('后生心', new Builder('89心').sub('无色界果报心').build());
            Builder.setVariable('23色聚', rangeInclusive(9301, 9325));
            Builder.setVariable('4出世间道心', rangeInclusive(82, 85));
            Builder.setVariable('4出世间果心', rangeInclusive(86, 89));
            Builder.setVariable('思心所', [104]);
            Builder.setVariable('5色界善心', rangeInclusive(55, 59));
            Builder.setVariable('4无色界善心', rangeInclusive(70, 73));
            Builder.setVariable('4出世间善心', rangeInclusive(82, 85));
            Builder.setVariable('21善心', new Builder('8大善心').add('5色界善心').add('4无色界善心').add('4出世间善心').build());
            Builder.setVariable('36果报心', new Builder('8大果报心').add('色界果报心').add('无色界果报心').add('4出世间果心').build());
            Builder.setVariable('13遍一切心所', rangeInclusive(101, 113));
            Builder.setVariable('25美心所', rangeInclusive(128, 152));
            Builder.setVariable('果报名聚', new Builder('36果报心').add('25美心所').add('13遍一切心所').build());
            Builder.setVariable('3无色食', Builder.getVariable('89心').concat(101, 104));
            Builder.initialized = true;
        }
    }
}

function getConditions() {
    // '触:101', '受:102', '想:103', '思:104', '一境性:105', '命根:106', '作意:107', '寻:108',
    // '伺:109', '胜解:110', '精进:111', '喜:112', '欲:113', '痴:114', '无惭:115', '无愧:116',
    // '掉举:117', '贪:118', '邪见:119', '慢:120', '嗔:121', '嫉:122', '悭:123', '恶作:124', '疑:125',
    // '昏沉:126', '睡眠:127', '信:128', '念:129', '惭:130', '愧:131', '无贪:132', '无嗔:133', '中舍性:134',
    // '心所轻安:135', '心轻安:136', '心所轻快性:137', '心轻快性:138', '心所柔软性:139', '心柔软性:140', '
    // 心所适应性:141', '心适应性:142', '心所练达性:143', '心练达性:144', '心所正直性:145', '心正直性:146',
    // '正语:147', '正业:148', '正命:149', '悲悯:150', '随喜:151', '慧:152'

    // '悦俱邪见相应无行心:1', '悦俱邪见相应有行心:2', '悦俱邪见不相应无行心:3', '悦俱邪见不相应有行心:4',
    // '舍俱邪见相应无行心:5', '舍俱邪见相应有行心:6', '舍俱邪见不相应无行心:7', '舍俱邪见不相应有行心:8',
    // '忧俱嗔恚相应无行心:9', '忧俱嗔恚相应有行心:10', '舍俱疑相应心:11', '舍俱掉举相应心:12',
    // '悦俱智相应无行心:13', '悦俱智相应有行心:14', '悦俱智不相应无行心:15', '悦俱智不相应有行心:16',
    // '舍俱智相应无行心:17', '舍俱智相应有行心:18', '舍俱智不相应无行心:19', '舍俱智不相应有行心:20',
    // '悦俱智相应无行心:21', '悦俱智相应有行心:22', '悦俱智不相应无行心:23', '悦俱智不相应有行心:24',
    // '舍俱智相应无行心:25', '舍俱智相应有行心:26', '舍俱智不相应无行心:27', '舍俱智不相应有行心:28',
    // '眼识:29', '耳识:30', '鼻识:31', '舌识:32', '身识:33', '舍俱领受心:34', '舍俱推度心:35', '眼识:36',
    // '耳识:37', '鼻识:38', '舌识:39', '身识:40', '舍俱领受心:41', '舍俱推度心:42', '悦俱推度心:43',
    // '悦俱智相应无行心:44', '悦俱智相应有行心:45', '悦俱智不相应无行心:46', '悦俱智不相应有行心:47',
    // '舍俱智相应无行心:48', '舍俱智相应有行心:49', '舍俱智不相应无行心:50', '舍俱智不相应有行心:51',
    // '五门转向心:52', '意门转向心:53', '生笑心:54', '初禅心:55', '第二禅心:56', '第三禅心:57', '第四禅心:58',
    // '第五禅心:59', '初禅心:60', '第二禅心:61', '第三禅心:62', '第四禅心:63', '第五禅心:64', '初禅心:65',
    // '第二禅心:66', '第三禅心:67', '第四禅心:68', '第五禅心:69', '空无边处心:70', '识无边处心:71',
    // '无所有处心:72', '非想非非想处心:73', '空无边处心:74', '识无边处心:75', '无所有处心:76',
    // '非想非非想处心:77', '空无边处心:78', '识无边处心:79', '无所有处心:80', '非想非非想处心:81',
    // '须陀洹道心:82', '斯陀含道心:83', '阿那含道心:84', '阿罗汉道心:85', '须陀洹果心:86', '斯陀含果心:87',
    // '阿那含果心:88', '阿罗汉果心:89'

    // '眼十法聚:9315', '耳十法聚:9316', '鼻十法聚:9317', '舌十法聚:9318', '身十法聚:9319', '女根色十法聚:9320',
    // '男根色十法聚:9321', '心色十法聚:9322', '命九法聚:9323', '纯八法聚:9301', '身表九法聚:9302',
    // '语表十法聚:9303', '轻快性十一法聚:9304', '身表轻快性十二法聚:9305', '语表声轻快性十三法聚:9306',
    // '非语言的声九法聚:9307', '非语言的声轻快性十二法聚:9308', '纯八法聚:9309', '声九法聚:9310',
    // '轻快性十一法聚:9311', '声轻快性十一法聚:9312', '纯八法聚:9313', '轻快性十一法聚:9314'

    // '地:9001', '水:9002', '火:9003', '风:9004', '眼净色:9005', '耳净色:9006', '鼻净色:9007',
    // '舌净色:9008', '身净色:9009', '色:9010', '声:9011', '香:9012', '味:9013', '女根色:9014',
    // '男根色:9015', '心色:9016', '命根色:9017', '食色:9018', '限界色:9019', '身表色:9020', '语表色:9021',
    // '色轻快性:9022', '色柔软性:9023', '色适业性:9024', '色积集:9025', '色相续:9026', '色老性:9027',
    // '色无常:9028'
    Builder.initializeVariables();
    return {
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
                        effect: '名',
                        causes: ['一因', '二因', '三因'],
                        effectSummary: '其余名法',
                        group: '名俱生组',
                        expand: function (cause) {
                            if (cause === '一因') {
                                return [Builder.getVariable('一因心所')];
                            } else if (cause === '二因') {
                                return Builder.getVariable('二因心所');
                            } else if (cause === '三因') {
                                return [Builder.getVariable('三因心所')];
                            }
                        },
                        effects: function (causes) {
                            if (arraysEqual(causes, Builder.getVariable('一因心所'))) {
                                return Builder.getVariable('一因心');
                            } else if (arraysEqual(causes, Builder.getVariable('贪根心所'))) {
                                return Builder.getVariable('贪根心');
                            } else if (arraysEqual(causes, Builder.getVariable('嗔根心所'))) {
                                return Builder.getVariable('嗔根心');
                            } else if (arraysEqual(causes, Builder.getVariable('无贪无嗔心所'))) {
                                return Builder.getVariable('无贪无嗔心');
                            } else {
                                return Builder.getVariable('三因心');
                            }
                        },
                        note: '六因（一、二、三因）作为同一有因名聚里其余名法的因缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['结生二因', '结生三因'],
                        group: '名俱生组',
                        effectSummary: '业生色聚',
                        expand: function (cause) {
                            if (cause === '结生二因') {
                                return [Builder.getVariable('无贪无嗔心所')];
                            } else if (cause === '结生三因') {
                                return [Builder.getVariable('三因心所')];
                            }
                        },
                        effects: function (causes) {
                            return Builder.getVariable('结生色聚');
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
                                return [Builder.getVariable('一因心所')];
                            } else if (cause === '二因') {
                                return Builder.getVariable('二因心所');
                            } else if (cause === '三因') {
                                return [Builder.getVariable('三因心所')];
                            }
                        },
                        effects: function (causes) {
                            return Builder.getVariable('心生色聚');
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
                                return [Builder.getVariable('名法')];
                            } else if (cause === '色') {
                                return [Builder.getVariable('色法')];
                            } else if (cause === '概念') {
                                return [Builder.getVariable('概念')];
                            } else {
                                return [Builder.getVariable('涅槃')];
                            }
                        },
                        effectSummary: '名聚',
                        effects: function (causes) {
                            return Builder.getVariable('89心');
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
                                return [Builder.getVariable('二因及三因速行心')];
                            } else {
                                return [[cetasikaIdIndex[cause]]];
                            }
                        },
                        effectSummary: '名聚',
                        effects: (function() {
                            const resultCache = {};
                            return function (causes) {
                                let result = {};
                                if (causes.length === 1) {
                                    if (resultCache[causes[0]]) {
                                        return resultCache[causes[0]];
                                    }
                                    if (causes[0] === cetasikaIdIndex['欲']) {
                                        result = new Builder('欲心所对应心').intersect('二因及三因速行心').build();
                                    } else if (causes[0] === cetasikaIdIndex['精进']) {
                                        result = new Builder('精进心所对应心').intersect('二因及三因速行心').build();
                                    } else {
                                        result = new Builder('慧心所对应心').intersect('二因及三因速行心').build();
                                    }
                                    resultCache[causes[0]] = result;
                                    return result;
                                }
                                return Builder.getVariable('二因及三因速行心');
                            };
                        })(),
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
                            return rangeInclusive(9301, 9308);
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
                        causes: ['名', '色', '涅槃'],
                        expand: (function() {
                            const resultCache = {};
                            return function (cause) {
                                if (resultCache[cause]) {
                                    return resultCache[cause];
                                }
                                let result = [];
                                if (cause === '名') {
                                    result = [new Builder('名法').sub('2嗔心2痴心1苦俱身识').sub('嗔嫉悭恶作疑').build()];
                                } else if (cause === '色') {
                                    result = [Builder.getVariable('18完成色')];
                                } else {
                                    result =  [Builder.getVariable('涅槃')];
                                }
                                resultCache[cause] = result;
                                return result;
                            };
                        })(),
                        effectSummary: '名聚',
                        effects: (function () {
                            let resultCache = [];
                            return function (causes) {
                                if (resultCache.length) {
                                    return resultCache;
                                }
                                resultCache = new Builder('贪根心').add('8大善心').add('智相应8大唯作心').add('8出世间心').build();
                                return resultCache;
                            };
                        })(),
                        suppressed: Builder.getVariable('2无量心所'),
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
                        causes: ['名'],
                        expand: function (cause) {
                            return [Builder.getVariable('名法')];
                        },
                        effectSummary: '名聚',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
                        group: '无间组',
                        note: '刚灭尽的前一名聚作为现在名聚的无间缘(除阿罗汉死心)'
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
                        causes: ['名'],
                        expand: function (cause) {
                            return [Builder.getVariable('名法')];
                        },
                        effectSummary: '名聚',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
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
                        causes: ['名'],
                        expand: function (cause) {
                            return [Builder.getVariable('名法')];
                        },
                        effectSummary: '名聚其余名法',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
                        group: '名俱生组',
                        note: '同一名聚里的任何名法与其余名法相互地作为俱生缘'
                    },
                    {
                        cause: ['色'],
                        effect: '色',
                        causes: ['四大'],
                        expand: function (cause) {
                            return [Builder.getVariable('四大')];
                        },
                        effectSummary: '色聚其余色法',
                        effects: function (causes) {
                            return Builder.getVariable('色法');
                        },
                        group: '色俱生组',
                        note: '同一色聚里的任何四大与其余色法相互地作为俱生缘'
                    },
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['心所依处色'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '结生果报心',
                        effects: function (causes) {
                            return Builder.getVariable('15结生果报心');
                        },
                        rebirth: true,
                        group: '色俱生组',
                        note: '结生时，心所依处1色与结生名聚相互地作为俱生缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['结生果报心'],
                        expand: function (cause) {
                            return [Builder.getVariable('15结生名聚')];
                        },
                        effectSummary: '心所依处色',
                        effects: function (causes) {
                            return Builder.getVariable('心所依处色');
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，结生名聚与心所依处1色相互地作为俱生缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['结生果报心'],
                        expand: function (cause) {
                            return [Builder.getVariable('15结生名聚')];
                        },
                        effectSummary: '其他结生色聚',
                        effects: function (causes) {
                            return new Builder('结生色聚').sub('心色十法聚').build();
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，结生名聚作为业生29色(不含心色1色)的俱生缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['75心'],
                        expand: (function() {
                            let cachedResult = [];
                            return function (cause) {
                                if (cachedResult.length) {
                                    return cachedResult;
                                }
                                cachedResult = [new Builder('89心').sub('双五识').sub('无色界果报心').build()];
                                return cachedResult;
                            }
                        })(),
                        effectSummary: '俱生心生色',
                        effects: function (causes) {
                            return Builder.getVariable('心生色聚');
                        },
                        group: '名俱生组',
                        note: '现在名聚作为俱生心生色聚的俱生缘'
                    },
                    {
                        cause: ['色'],
                        effect: '色',
                        causes: ['四大'],
                        expand: function (cause) {
                            return [Builder.getVariable('四大')];
                        },
                        effectSummary: '色聚其余色法',
                        effects: function (causes) {
                            return Builder.getVariable('四大所造色');
                        },
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
                        causes: ['名法'],
                        expand: function (cause) {
                            return [Builder.getVariable('名法')];
                        },
                        effectSummary: '名聚其余名法',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
                        group: '名俱生组',
                        note: '同一名聚里的任何名法与其余名法相互地作为相互缘'
                    },
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['心所依处色'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '结生果报心',
                        effects: function (causes) {
                            return Builder.getVariable('15结生果报心');
                        },
                        rebirth: true,
                        group: '色俱生组',
                        note: '结生时，心所依处1色与结生名聚相互地作为相互缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['结生果报心'],
                        expand: function (cause) {
                            return [Builder.getVariable('15结生名聚')];
                        },
                        effectSummary: '心所依处色',
                        effects: function (causes) {
                            return Builder.getVariable('心所依处色');
                        },
                        group: '名俱生组',
                        note: '结生时，结生名聚与心所依处1色相互地作为相互缘'
                    },
                    {
                        cause: ['色'],
                        effect: '色',
                        causes: ['四大'],
                        expand: function (cause) {
                            return [Builder.getVariable('四大')];
                        },
                        effectSummary: '四大',
                        effects: function (causes) {
                            return Builder.getVariable('四大');
                        },
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
                        causes: ['名'],
                        expand: function (cause) {
                            return [Builder.getVariable('名法')];
                        },
                        effectSummary: '名聚其余名法',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
                        group: '名俱生组',
                        note: '同一名聚里的任何名法与其余名法相互地作为依止缘'
                    },
                    {
                        cause: ['色'],
                        effect: '色',
                        causes: ['四大'],
                        expand: function (cause) {
                            return [Builder.getVariable('四大')];
                        },
                        effectSummary: '色聚其余色法',
                        effects: function (causes) {
                            return Builder.getVariable('色法');
                        },
                        group: '色俱生组',
                        note: '同一色聚里的任何四大与其余四大相互地作为依止缘'
                    },
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['心所依处色'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '结生果报心',
                        effects: function (causes) {
                            return Builder.getVariable('15结生果报心');
                        },
                        rebirth: true,
                        group: '色俱生组',
                        note: '结生时，心所依处1色与结生名聚相互地作为依止缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['结生果报心'],
                        expand: function (cause) {
                            return [Builder.getVariable('15结生名聚')];
                        },
                        effectSummary: '心所依处色',
                        effects: function (causes) {
                            return Builder.getVariable('心所依处色');
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，结生名聚与心所依处1色相互地作为依止缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['结生果报心'],
                        expand: function (cause) {
                            return [Builder.getVariable('15结生名聚')];
                        },
                        effectSummary: '其他结生色聚',
                        effects: function (causes) {
                            return new Builder('结生色聚').sub('心色十法聚').build();
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，结生名聚作为业生29色(不含心色1色)的依止缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['75心'],
                        expand: (function() {
                            let cachedResult = [];
                            return function (cause) {
                                if (cachedResult.length) {
                                    return cachedResult;
                                }
                                cachedResult = [new Builder('89心').sub('双五识').sub('无色界果报心').build()];
                                return cachedResult;
                            }
                        })(),
                        effectSummary: '俱生心生色',
                        effects: function (causes) {
                            return Builder.getVariable('心生色聚');
                        },
                        group: '名俱生组',
                        note: '现在名聚作为俱生心生色聚的依止缘'
                    },
                    {
                        cause: ['色'],
                        effect: '色',
                        causes: ['四大'],
                        expand: function (cause) {
                            return [Builder.getVariable('四大')];
                        },
                        effectSummary: '色聚其余色法',
                        effects: function (causes) {
                            return Builder.getVariable('四大所造色');
                        },
                        group: '色俱生组',
                        note: '四大作为同一色聚里所造色的依止缘'
                    },
                ]
            },
            {
                name: '依处前生依止缘',
                id: 10,
                keywords: ['前生', '依止'],
                children: [
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['心所依处'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '75名聚',
                        effects: (function () {
                            let resultCache = [];
                            return function (causes) {
                                if (resultCache.length) {
                                    return resultCache;
                                }
                                resultCache = new Builder('89心').sub('双五识').sub('无色界果报心').build();
                                return resultCache;
                            }
                        })(),
                        group: '依处组',
                        note: '由于前一心生起且是住时的心所依处，作为75名聚的依止缘'
                    },
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['五净色'],
                        expand: function (cause) {
                            return [Builder.getVariable('五净色')];
                        },
                        effectSummary: '双五识',
                        effects: function (causes) {
                            return Builder.getVariable('双五识');
                        },
                        group: '依处组',
                        note: '由于过去有分生起且达到住时的五净色，作为双五识的依止缘'
                    },
                ]
            },
            {
                name: '依处所缘前生依止缘',
                id: 11,
                keywords: ['所缘', '前生', '依止'],
                children: [
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['心所依处'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '43名聚',
                        effects: (function () {
                            let resultCache = [];
                            return function (causes) {
                                if (resultCache.length) {
                                    return resultCache;
                                }
                                resultCache = new Builder('意门转向心').add('欲界速行心').add('彼所缘心').add('神通心').build();
                                return resultCache;
                            }
                        })(),
                        suppressed: new Builder('2无量心所').add('3离心所').build().concat(122, 123, 124),
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
                        causes: ['名'],
                        expand: function (cause) {
                            return [Builder.getVariable('名法')];
                        },
                        effectSummary: '名聚',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
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
                        causes: ['名', '色', '涅槃'],
                        expand: (function() {
                            const resultCache = {};
                            return function (cause) {
                                if (resultCache[cause]) {
                                    return resultCache[cause];
                                }
                                let result = [];
                                if (cause === '名') {
                                    result = [new Builder('名法').sub('2嗔心2痴心1苦俱身识').sub('嗔嫉悭恶作疑').build()];
                                } else if (cause === '色') {
                                    result = [Builder.getVariable('18完成色')];
                                } else {
                                    result =  [Builder.getVariable('涅槃')];
                                }
                                resultCache[cause] = result;
                                return result;
                            };
                        })(),
                        effectSummary: '名聚',
                        effects: (function () {
                            let resultCache = [];
                            return function (causes) {
                                if (resultCache.length) {
                                    return resultCache;
                                }
                                resultCache = new Builder('贪根心').add('8大善心').add('智相应8大唯作心').add('8出世间心').build();
                                return resultCache;
                            };
                        })(),
                        suppressed: Builder.getVariable('2无量心所'),
                        group: '所缘组',
                        note: '强有力的可意所缘作为名聚的所缘亲依止缘'
                    },
                ]
            },
            {
                name: '自然亲依止缘',
                id: 14,
                keywords: ['亲依止'],
                children: [
                    {
                        cause: ['名', '色', '概念'],
                        effect: '名',
                        causes: ['名', '色', '概念'], // 緣法包括：過去的任何名色及與時間無關的概念，及過去所造的業
                        expand: function (cause) {
                            if (cause === '名') {
                                return [Builder.getVariable('名法')];
                            }
                            if (cause === '色') {
                                return [Builder.getVariable('色法')];
                            }
                            return [Builder.getVariable('概念')];
                        },
                        effectSummary: '名聚',
                        effects: function (causes) {
                            return Builder.getVariable('名法');
                        },
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
                        causes: ['心所依处'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '75名聚',
                        effects: (function () {
                            let resultCache = [];
                            return function (causes) {
                                if (resultCache.length) {
                                    return resultCache;
                                }
                                resultCache = new Builder('89心').sub('双五识').sub('无色界果报心').build();
                                return resultCache;
                            }
                        })(),
                        group: '依处组',
                        note: '于前一心生起且是住时的心所依处，作为75名聚的前生缘'
                    },
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['五净色'],
                        expand: function (cause) {
                            return [Builder.getVariable('五净色')];
                        },
                        effectSummary: '双五识',
                        effects: function (causes) {
                            return Builder.getVariable('双五识');
                        },
                        group: '依处组',
                        note: '于过去有分生起且达到住时的五净色，作为双五识的前生缘'
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
                        causes: ['18完成色'],
                        expand: function (cause) {
                            return [Builder.getVariable('18完成色')];
                        },
                        effectSummary: '现在名聚',
                        effects: function (causes) {
                            return new Builder('54欲界心').add('神通心').build();
                        },
                        suppressed: Builder.getVariable('2无量心所'),
                        group: '所缘组',
                        note: '于过去有分生起的现在18完成色之一，作为现在名聚的前生缘'
                    },
                ]
            },
            {
                name: '依处所缘前生缘',
                id: 17,
                keywords: ['所缘', '前生'],
                children: [
                    {
                        cause: ['色'],
                        effect: '名',
                        causes: ['心所依处'],
                        expand: function (cause) {
                            return [Builder.getVariable('心所依处色')];
                        },
                        effectSummary: '43名聚',
                        effects: (function () {
                            let resultCache = [];
                            return function (causes) {
                                if (resultCache.length) {
                                    return resultCache;
                                }
                                resultCache = new Builder('意门转向心').add('欲界速行心').add('彼所缘心').add('神通心').build();
                                return resultCache;
                            }
                        })(),
                        suppressed: new Builder('2无量心所').add('3离心所').build().concat(122, 123, 124),
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
                        causes: ['后生心'],
                        expand: function (cause) {
                            return [Builder.getVariable('后生心')];
                        },
                        effectSummary: '四因所生色聚',
                        effects: function (causes) {
                            return new Builder('23色聚').build();
                        },
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
                        causes: ['前一速行名聚'],
                        expand: (function() {
                            let result = [];
                            return function (cause) {
                                if (result.length) {
                                    return result;
                                }
                                result = [new Builder('速行心').sub('8出世间心').add('52心所').build()];
                                return result;
                            }
                        })(),
                        effectSummary: '后一速行名聚',
                        effects: (function() {
                            let result = [];
                            return function (cause) {
                                if (result.length) {
                                    return result;
                                }
                                result = new Builder('速行心').sub('4出世间果心').add('52心所').build();
                                return result;
                            }
                        })(),
                        group: '无间组',
                        note: '一至倒数第二速行作为第二至最后速行的重复缘; 果心没有重复缘'
                    },
                ]
            },
            {
                name: '俱生业缘',
                id: 20,
                keywords: ['俱生', '业'],
                note: '思心所作为同一名聚里其余名法的俱生业缘',
                children: [
                    {
                        cause: ['名'],
                        effect: '名',
                        causes: ['思心所'],
                        expand: function (cause) {
                            return [Builder.getVariable('思心所')];
                        },
                        effectSummary: '其余名法',
                        effects: function (causes) {
                            return new Builder('89心').build();
                        },
                        suppressed: Builder.getVariable('思心所'),
                        group: '名俱生组',
                        note: '思心所作为同一名聚里其余名法的俱生业缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['思心所'],
                        expand: function (cause) {
                            return [Builder.getVariable('思心所')];
                        },
                        effectSummary: '业生色聚',
                        effects: function (causes) {
                            return new Builder('结生色聚').build();
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，思心所作为俱生业生色聚的俱生业缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['思心所'],
                        expand: function (cause) {
                            return [Builder.getVariable('思心所')];
                        },
                        effectSummary: '心生色聚',
                        effects: function (causes) {
                            return new Builder('心生色聚').build();
                        },
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
                        causes: ['四道心思心所'],
                        expand: function (cause) {
                            return [new Builder('4出世间道心').add('思心所').build()];
                        },
                        effectSummary: '四果心',
                        effects: function (causes) {
                            return new Builder('4出世间果心').build();
                        },
                        group: '无间组',
                        note: '刚灭尽的道心作为紧接着生起的道无间果心的无间业缘'
                    },
                ]
            },
            {
                name: '异刹那业缘',
                id: 22,
                keywords: ['业'],
                note: '思心所食未来果报名聚的异刹那业缘',
                children: [
                    {
                        cause: ['名'],
                        effect: '名',
                        causes: ['33心思心所'],
                        expand: function (cause) {
                            return [new Builder('21善心').add('12不善心').add('思心所').build()];
                        },
                        effectSummary: '果报名聚',
                        effects: function (causes) {
                            return new Builder('36果报心').build();
                        },
                        group: '异业组',
                        note: '过去造业的善或不善思心所作为现在果报名聚的异刹那业缘，包括道心对果心'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['33心思心所'],
                        expand: function (cause) {
                            return [new Builder('99921善心').add('12不善心').add('思心所').build()];
                        },
                        effectSummary: '业生色聚',
                        effects: function (causes) {
                            return new Builder('业生色聚').build();
                        },
                        group: '异业组',
                        note: '过去造业的善或不善思心所作为业生色聚的异刹那业缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['33心思心所'],
                        expand: function (cause) {
                            return [new Builder('21善心').add('12不善心').add('思心所').build()];
                        },
                        effectSummary: '业生色聚',
                        effects: function (causes) {
                            return new Builder('结生色聚').build();
                        },
                        rebirth: true,
                        group: '异业组',
                        note: '过去造业的善或不善思心所作为业生色聚的异刹那业缘'
                    },
                ]
            },
            {
                name: '自然亲依止业缘',
                id: 23,
                keywords: ['亲依止', '业'],
                children: [
                    {
                        cause: ['名'],
                        effect: '名',
                        causes: ['33心思心所'],
                        expand: function (cause) {
                            return [new Builder('21善心').add('12不善心').add('思心所').build()];
                        },
                        effectSummary: '36果报心',
                        effects: function (causes) {
                            return new Builder('36果报心').build();
                        },
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
                        causes: ['果报名聚中名法'],
                        expand: function (cause) {
                            return [new Builder('果报名聚').build()];
                        },
                        effectSummary: '名聚中其他名法',
                        effects: function (causes) {
                            return new Builder('果报名聚').build();
                        },
                        group: '名俱生组',
                        note: '同一果报名聚里的任何名法与其余名法相互地作为果报缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['果报名聚'],
                        expand: function (cause) {
                            return [new Builder('果报名聚').build()];
                        },
                        effectSummary: '业生色聚',
                        effects: function (causes) {
                            return new Builder('结生色聚').build();
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，果报名聚作为俱生业生色聚（含心色）的果报缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['果报名聚'],
                        expand: function (cause) {
                            return [new Builder('果报名聚').build()];
                        },
                        effectSummary: '心生色聚',
                        effects: function (causes) {
                            return new Builder('心生色聚').build();
                        },
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
                        causes: ['3无色食'],
                        expand: function (cause) {
                            return [new Builder('3无色食').build()];
                        },
                        effectSummary: '名聚中其他名法',
                        effects: function (causes) {
                            return new Builder('名法').build();
                        },
                        group: '名俱生组',
                        note: '触、思、心作为同一名聚里其余名法的俱生食缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['3无色食'],
                        expand: function (cause) {
                            return [new Builder('3无色食').build()];
                        },
                        effectSummary: '业生色聚',
                        effects: function (causes) {
                            return new Builder('结生色聚').build();
                        },
                        rebirth: true,
                        group: '名俱生组',
                        note: '结生时，触、思、心作为俱生业生色聚（含心色）的俱生食缘'
                    },
                    {
                        cause: ['名'],
                        effect: '色',
                        causes: ['3无色食'],
                        expand: function (cause) {
                            return [new Builder('3无色食').build()];
                        },
                        effectSummary: '心生色聚',
                        effects: function (causes) {
                            return new Builder('心生色聚').build();
                        },
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
}
