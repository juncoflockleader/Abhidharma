const causeConditionWithNamaEffect = (function () {
    function idsToNames(ids, cittaAbbr = true) {
        return ids.map(id => {
            if (cittaAbbr && id < 100) {
                return '心';
            }
            return idIndex[id].name
        });
    }

    const resultCache = {};
    return function (vars) {
        if (resultCache[vars.id]) {
            return resultCache[vars.id];
        }

        const citta = vars.citta; // id
        const cetasikas = vars.cetasikas; //ids
        const name = vars.name;
        const obj = vars.obj;
        const rupa_obj = vars.rupa_obj;
        const funct = vars.funct;
        const great_obj = vars.great_obj;
        const prev_funct = vars.prev_funct;

        const roots = [];
        for (let cetasika of cetasikas) {
            if (Builder.getVariable('因').includes(cetasika)) {
                roots.push(cetasika);
            }
        }

        const namas = cetasikas.concat(citta); // 所有名法

        function getNames(ids) {
            return ids.map(id => Builder.getVariable(id).name);
        }

        const result = {
            '名俱生组': {},
            '所缘组': {},
            '无间组': {},
            '色俱生组': {},
            '依处组': {},
            '自然亲依止组': {},
            '异业组': {}
        }

        let x = {};
        const noop = {
            'cause': [],
            'causeSummary': '-',
            'effect': [],
            'effectSummary': '-'
        }

        result['名俱生组']['因缘'] = noop;
        if (roots.length > 0) {
            result['名俱生组']['因缘'] = {
                'cause': roots,
                'causeSummary': `${roots.length}因(${idsToNames(roots)})`,
                'effect': name, // NOTE: effects may not be accurate - sometimes we need to remove some namas. applies to all following effects
                'effectSummary': `${name}名聚-${roots.length}`,
            };
        }

        result['名俱生组']['俱生增上缘'] = noop;
        if (funct === '速行' && roots.length > 1) {
            const cause = roots.length === 2 ? Builder.getVariable('2因增上心所') : Builder.getVariable('3因增上心所');
            result['名俱生组']['俱生增上缘'] = {
                'cause': cause,
                'causeSummary': `1名(${idsToNames(cause)}之一)`,
                'effect': namas,
                'effectSummary': `${name}名聚-1`
            };
        }
        result['名俱生组']['俱生缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['相互缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['俱生依止缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['俱生依止缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['俱生业缘'] = {
            'cause': Builder.getVariable('思心所'),
            'causeSummary': '俱生思',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['果报缘'] = noop;
        if (Builder.getVariable('36果报心').includes(citta)) {
            result['名俱生组']['果报缘'] = {
                'cause': Builder.getVariable('思心所'),
                'causeSummary': '俱生思',
                'effect': namas,
                'effectSummary': '其他名法'
            };
        }
        const namaFood = new Builder('名食心所').add([citta]).build();
        result['名俱生组']['俱生食缘'] = {
            'cause': namaFood,
            'causeSummary': idsToNames(namaFood),
            'effect': namas,
            'effectSummary': `${name}名聚-3`
        };
        const bases = new Builder('7根心所').intersect(cetasikas).add([citta]).build();
        result['名俱生组']['俱生根缘'] = {
            'cause': bases,
            'causeSummary': idsToNames(bases),
            'effect': namas,
            'effectSummary': `${name}名聚-${bases.length}`
        };
        result['名俱生组']['禅那缘'] = noop;
        if (!Builder.getVariable('双五识').includes(citta)) {
            const jhana = new Builder('五禅那心所').intersect(cetasikas).build();
            result['名俱生组']['禅那缘'] = {
                'cause': jhana,
                'causeSummary': idsToNames(jhana),
                'effect': namas,
                'effectSummary': `${name}名聚-${jhana.length}`
            };
        }
        result['名俱生组']['道缘'] = noop;
        if (roots.length > 0) {
            const path = new Builder('道心所').intersect(cetasikas).build();
            result['名俱生组']['道缘'] = {
                'cause': path,
                'causeSummary': idsToNames(path),
                'effect': namas,
                'effectSummary': `${name}名聚-${path.length}`
            };
        }
        result['名俱生组']['相应缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['俱生有缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['名俱生组']['俱生不离去缘'] = {
            'cause': namas,
            'causeSummary': '任一名法',
            'effect': namas,
            'effectSummary': '其他名法'
        };
        result['所缘组']['所缘缘'] = {
            'cause': obj,
            'causeSummary': obj,
            'effect': namas,
            'effectSummary': `${name}名聚`
        };

        result['所缘组']['所缘增上缘'] = noop;
        if (funct === '速行' && roots.length > 1 && great_obj) {
            // 意门心路 (速行 - 贪、善、唯作)
            result['所缘组']['所缘增上缘'] = {
                'cause': great_obj,
                'causeSummary': `(${great_obj}之一)`,
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }
        result['所缘组']['所缘亲依止缘'] = result['所缘组']['所缘增上缘'];

        result['所缘组']['依处所缘前生依止缘'] = noop;
        if (obj === '心所依处') { // FIXME: not because of obj. it's because of type of flow
            // TODO: 意门心路 (转向、速行、彼所缘)
            result['所缘组']['依处所缘前生依止缘'] = {
                'cause': obj,
                'causeSummary': obj,
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }
        result['所缘组']['依处所缘前生缘'] = result['所缘组']['依处所缘前生依止缘'];
        result['所缘组']['依处所缘前生有缘'] = result['所缘组']['依处所缘前生依止缘'];
        result['所缘组']['依处所缘前生不离去缘'] = result['所缘组']['依处所缘前生依止缘'];
        result['依处组']['依处所缘前生不相应缘'] = result['所缘组']['依处所缘前生依止缘'];

        result['所缘组']['所缘前生缘'] = {
            'cause': rupa_obj,
            'causeSummary': rupa_obj,
            'effect': namas,
            'effectSummary': `${name}名聚`
        };
        result['所缘组']['所缘前生有缘'] = result['所缘组']['所缘前生缘'];
        result['所缘组']['所缘前生不离去缘'] = result['所缘组']['所缘前生缘'];


        result['无间组']['无间缘'] = {
            'cause': prev_funct,
            'causeSummary': `前一名聚(${prev_funct})`,
            'effect': namas,
            'effectSummary': `${name}名聚`
        };
        result['无间组']['等无间缘'] = result['无间组']['无间缘'];
        result['无间组']['无间亲依止缘'] = result['无间组']['无间缘'];
        result['无间组']['无有缘'] = result['无间组']['无间缘'];
        result['无间组']['离去缘'] = result['无间组']['无间缘'];

        result['无间组']['无间业缘'] = noop;
        if (funct === '速行' && Builder.getVariable('4出世间果心').includes(citta)) {
            result['无间组']['无间业缘'] = {
                'cause': Builder.getVariable('思心所'),
                'causeSummary': '4道心思心所',
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }

        result['无间组']['重复缘'] = noop;
        if (funct === '速行' && prev_funct==='速行') {
            result['无间组']['重复缘'] = {
                'cause': namas,
                'causeSummary': `前一名聚(${prev_funct})`,
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }

        result['依处组']['依处前生依止缘'] = noop;
        if (!Builder.getVariable('无色界果报心').includes(citta)) {
            let rupa = Builder.getVariable('心所依处色');
            if (prev_funct === '五识') {
                rupa = Builder.getVariable('五净色');
            }
            result['依处组']['依处前生依止缘'] = {
                'cause': rupa,
                'causeSummary': `前一名聚(${prev_funct})${prev_funct === '五识' ? '净色' : '心色'}`,
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }
        result['依处组']['依处前生缘'] = result['依处组']['依处前生依止缘'];
        result['依处组']['依处前生不相应缘'] = result['依处组']['依处前生依止缘'];
        result['依处组']['依处前生有缘'] = result['依处组']['依处前生依止缘'];
        result['依处组']['依处前生不离去缘'] = result['依处组']['依处前生依止缘'];

        result['依处组']['依处前生根缘'] = noop;
        if (Builder.getVariable('双五识').includes(citta)) {
            let base = null; // 心色
            let c = citta;
            // 心: 29-33, 36-40 双五识 - 眼耳鼻舌身
            // 色: 9005-9010 眼耳鼻舌身
            if (citta >= 36 && citta <= 40) {
                c -= 7;
            }
            base = 9005 + c - 29;
            result['依处组']['依处前生根缘'] = {
                'cause': base,
                'causeSummary': `前生${idIndex[base].name}`,
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }

        /*
        result['依处组']['依处前生根缘'] = noop;
        if (!Builder.getVariable('无色界果报心').includes(citta)) {
            let base = 9016; // 心色
            let c = citta;
            // 心: 29-33, 36-40 双五识 - 眼耳鼻舌身
            // 色: 9005-9010 眼耳鼻舌身
            if (citta >= 36 && citta <= 40) {
                c -= 7;
            }
            if (c >= 29 && c <= 33) {
                base = 9005 + c - 29;
            }
            result['依处组']['依处前生根缘'] = {
                'cause': base,
                'causeSummary': '前一名聚心色',
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
        }

         */

        result['自然亲依止组']['自然亲依止缘'] = {
            'cause': new Builder('名法').add('色法').add('概念').build(),
            'causeSummary': '名色概念',
            'effect': namas,
            'effectSummary': `${name}名聚`
        };

        result['异业组']['异刹那业缘'] = noop;
        if (Builder.getVariable('36果报心').includes(citta)) {
            result['异业组']['异刹那业缘'] = {
                'cause': Builder.getVariable('思心所'),
                'causeSummary': '过去善不善思心所',
                'effect': namas,
                'effectSummary': `${name}名聚`
            };
            result['异业组']['自然亲依止业缘'] = structuredClone(result['异业组']['异刹那业缘']);
            result['异业组']['自然亲依止业缘'].causeSummary = '过去强力善不善思心所';
        } else {
            result['异业组']['自然亲依止业缘'] = result['异业组']['异刹那业缘'];
        }

        resultCache[vars.id] = result;
        return result;
    };
})();

const causeConditionWithRupaEffect = {
    '名俱生组': {
        '因缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生增上缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '相互缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生依止缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生业缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '果报缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生食缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生根缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '禅那缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '道缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生不相应缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生有缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生不离去缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        }
    },
    '色俱生组': {
        '俱生缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '相互缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生依止缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生有缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '俱生不离去缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        }
    },
    '后生组': {
        '后生缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '后生不相应缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '后生有缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '后生不离去缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        }
    },
    '异业组': {
        '异刹那业缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        }
    },
    '色食组': {
        '色食缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '色食有缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '色食不离去缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        }
    },
    '色命根组': {
        '色命根缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '命根有缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        },
        '命根不离去缘': {
            'cause': '',
            'causeSummary': '',
            'effect': '',
            'effectSummary': ''
        }
    }
};