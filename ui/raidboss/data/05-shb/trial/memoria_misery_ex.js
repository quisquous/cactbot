'use strict';

[{
    zoneRegex: /Memoria Misera \(Extreme\)/,
    timelineFile: 'memoria_misery_ex.txt',
    triggers: [
        {
            id: 'Varis Citius (Tankbuster)',
            regex: Regexes.startsUsing({ id: '4CF0', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CF0', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CF0', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CF0', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Varis Alea Iacta Est',
            regex: Regexes.startsUsing({ id: '4CD2', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CD2', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CD2', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CD2', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            response: Responses.awayFromFront(),
        },
        {
            // Match the first time Varis used Alea Iacta Est, then wait for 3 second before annouce
            id: 'Varis Alea Iacta Est (Back Cleave)',
            regex: Regexes.ability({ id: '4CD2', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.ability({ id: '4CD2', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.ability({ id: '4CD2', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.ability({ id: '4CD2', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            delaySeconds: 3,
            infoText: {
                en: "Go Front",
                ja: "前へ",
                cn: "到正面",
            }
        },
        {
            id: 'Varis Ignis Est',
            regex: Regexes.startsUsing({ id: '4CB5', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CB5', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CB5', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CB5', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            delaySeconds: 6,
            response: Responses.getOut(),
        },
        {
            id: 'Varis Ventus Est',
            regex: Regexes.startsUsing({ id: '4CC6', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CC6', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CC6', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CC6', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            delaySeconds: 6,
            response: Responses.getIn(),
        },
        {
            id: 'Varis Loaded Gunshield (Spread)',
            regex: Regexes.startsUsing({ id: '4CD8', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CD8', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CD8', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CD8', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            delaySeconds: 6,
            response: Responses.spread(),
        },
        {
            id: 'Varis Reinforced Gunshield (Block)',
            regex: Regexes.startsUsing({ id: '4CD9', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CD9', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CD9', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CD9', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            delaySeconds: 18,
            infoText: {
                en: "Watch out Blocking",
                ja: "ブロックしない側に攻撃",
                cn: "攻击未格挡的方向"
            }
        },
        {
            id: 'Varis Electrified Gunshield (Knockback)',
            regex: Regexes.startsUsing({ id: '4CD7', source: 'Varis Yae Galvus', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4CD7', source: 'Varis yae Galvus', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4CD7', source: 'Varis yae Galvus', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4CD7', source: 'ヴァリス・イェー・ガルヴァス', capture: false }),
            delaySeconds: 20,
            response: Responses.knockback(),
        },
        {
            id: 'Gunshield Magitek Spark (Spread)',
            regex: Regexes.startsUsing({ id: '4E50', source: 'Gunshield', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4E50', source: 'Gewehrschild', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4E50', source: 'bouclier-canon', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4E50', source: 'ガンシールド', capture: false }),
            response: Responses.spread(),
        },
        {
            id: 'Gunshield Magitek Torch (Stack)',
            regex: Regexes.startsUsing({ id: '4E4F', source: 'Gunshield', capture: false }),
            regexDe: Regexes.startsUsing({ id: '4E4F', source: 'Gewehrschild', capture: false }),
            regexFr: Regexes.startsUsing({ id: '4E4F', source: 'bouclier-canon', capture: false }),
            regexJa: Regexes.startsUsing({ id: '4E4F', source: 'ガンシールド', capture: false }),
            response: Responses.stack(),
        },
    ],
    timelineReplace: [
        {
            'locale': 'ja',
            'replaceSync': {
                'I shall not yield!': '我が大盾に、防げぬものなし',
            },
            'replaceText': {
                'Altius': 'アルティウス',
                'Citius': 'キティウス',
                'Alea Iacta Est': 'アーレア・ヤクタ・エスト',
                'Terminus Est': 'ターミナス・エスト',
                'Ignis Est': 'イグニス・エスト',
                'Ventus Est': 'ウェントゥス・エスト',
                'Ignis Est Action': 'イグニス・エスト発動',
                'Ventus Est Action': 'ウェントゥス・エスト発動',
                'Festina Lente': 'フェスティナ・レンテ',
                'Loaded Gunshield': 'ガンシールド：魔導バースト',
                'Reinforced Gunshield': 'ガンシールド：魔導カウンター',
                'Electrified Gunshield': 'ガンシールド：魔導ショック',
                'Magitek Shock': '魔導ショック',
                'Magitek Burst': '魔導バースト',
                'Magitek Shielding': '魔導カウンター',
                'Vivere Militare Est': 'ウィーウェレ・ミーリターレ・エスト',
                'Gunshield Actions': 'ガンシールド技',
                'Magitek Spark/Torch': '魔導スパーク／魔導フレーム',
                'Fortius': 'フォルティウス',
            }
        },
    ],
}];