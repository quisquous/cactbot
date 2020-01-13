'use strict';

[{
  zoneRegex: /Ala Mhigo/,
  timelineFile: 'ala_mhigo.txt',
  timelineTriggers: [
    {
      id: 'Ala Mhigo Umoving Troika',
      regex: /Unmoving Troika/,
      beforeSeconds: 5,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave on YOU',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
  ],
  triggers: [
    {
      id: 'Ala Mhigo Electromagnetic Field',
      regex: Regexes.startsUsing({ id: '204D', source: 'Magitek Scorpion', capture: false }),
      regexDe: Regexes.startsUsing({ id: '204D', source: 'Wachskorpion', capture: false }),
      regexFr: Regexes.startsUsing({ id: '204D', source: 'Scorpion Magitek', capture: false }),
      regexJa: Regexes.startsUsing({ id: '204D', source: 'ガードスコーピオン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '204D', source: '守卫机蝎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '204D', source: '경비 전갈', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Ala Mhigo Mana Burst',
      regex: Regexes.startsUsing({ id: '204F', source: 'Aulus Mal Asina', capture: false }),
      regexDe: Regexes.startsUsing({ id: '204F', source: 'Aulus Mal Asina', capture: false }),
      regexFr: Regexes.startsUsing({ id: '204F', source: 'Aulus Mal Asina', capture: false }),
      regexJa: Regexes.startsUsing({ id: '204F', source: 'アウルス・マル・アシナ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '204F', source: '奥卢斯·玛尔·亚希纳', capture: false }),
      regexKo: Regexes.startsUsing({ id: '204F', source: '아울루스 말 아시나', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Ala Mhigo Demimagicks',
      regex: Regexes.startsUsing({ id: '205D', source: 'Aulus Mal Asina', capture: false }),
      regexDe: Regexes.startsUsing({ id: '205D', source: 'Aulus Mal Asina', capture: false }),
      regexFr: Regexes.startsUsing({ id: '205D', source: 'Aulus Mal Asina', capture: false }),
      regexJa: Regexes.startsUsing({ id: '205D', source: 'アウルス・マル・アシナ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '205D', source: '奥卢斯·玛尔·亚希纳', capture: false }),
      regexKo: Regexes.startsUsing({ id: '205D', source: '아울루스 말 아시나', capture: false }),
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'Ala Mhigo Storm',
      regex: Regexes.startsUsing({ id: ['2066', '2587'], source: 'Zenos Yae Galvus', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2066', '2587'], source: 'Zenos Yae Galvus', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2066', '2587'], source: 'Zenos Yae Galvus', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2066', '2587'], source: 'ゼノス・イェー・ガルヴァス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2066', '2587'], source: '芝诺斯·耶·加尔乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2066', '2587'], source: '제노스 예 갈부스', capture: false }),
      infoText: {
        en: 'Out of blue circle',
      },
    },
    {
      id: 'Ala Mhigo Swell',
      regex: Regexes.startsUsing({ id: ['2065', '2586'], source: 'Zenos Yae Galvus', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2065', '2586'], source: 'Zenos Yae Galvus', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2065', '2586'], source: 'Zenos Yae Galvus', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2065', '2586'], source: 'ゼノス・イェー・ガルヴァス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2065', '2586'], source: '芝诺斯·耶·加尔乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2065', '2586'], source: '제노스 예 갈부스', capture: false }),
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'Ala Mhigo Sword',
      regex: Regexes.startsUsing({ id: ['2068', '2588'], source: 'Zenos Yae Galvus', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2068', '2588'], source: 'Zenos Yae Galvus', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2068', '2588'], source: 'Zenos Yae Galvus', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2068', '2588'], source: 'ゼノス・イェー・ガルヴァス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2068', '2588'], source: '芝诺斯·耶·加尔乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2068', '2588'], source: '제노스 예 갈부스', capture: false }),
      alertText: {
        en: 'Protean',
      },
    },
    {
      id: 'Ala Mhigo Lightless Spark',
      regex: Regexes.tether({ id: '0029', source: 'Zenos Yae Galvus' }),
      regexDe: Regexes.tether({ id: '0029', source: 'Zenos Yae Galvus' }),
      regexFr: Regexes.tether({ id: '0029', source: 'Zenos Yae Galvus' }),
      regexJa: Regexes.tether({ id: '0029', source: 'ゼノス・イェー・ガルヴァス' }),
      regexCn: Regexes.tether({ id: '0029', source: '芝诺斯·耶·加尔乌斯' }),
      regexKo: Regexes.tether({ id: '0029', source: '제노스 예 갈부스' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Face tether out',
      },
    },
    {
      id: 'Ala Mhigo Concentrativity',
      regex: Regexes.startsUsing({ id: '206D', source: 'Zenos Yae Galvus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '206D', source: 'Zenos Yae Galvus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '206D', source: 'Zenos Yae Galvus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '206D', source: 'ゼノス・イェー・ガルヴァス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '206D', source: '芝诺斯·耶·加尔乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '206D', source: '제노스 예 갈부스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Magitek Scorpion': 'Wachskorpion',
        'Aulus Mal Asina': 'Aulus Mal Asina',
        'Zenos Yae Galvus': 'Zenos Yae Galvus',

        'Rhalgr\'s Gate': 'Rhalgrs Tor',
        'The Chamber of Knowledge': 'Wiege des Wissens',
        'The Hall of the Griffin': 'Halle des Greifen',
      },
      'replaceText': {
        'Electromagnetic Field': 'Elektromagnetisches Feld',
        'Target Search': 'Zielsucher',
        'Lock On': 'Feststellen',
        'Tail Laser': 'Schweiflaser',

        'Mana Burst': 'Mana-Knall',
        'Order To Charge': 'Angriffsbefehl',
        'Order To Fire': 'Feuerbefehl',
        'Aetherochemical Grenado': 'Magitek-Granate',
        'Integrated Aetheromodulator': 'Linearbeschleuniger',
        'Magitek Disruptor': 'Magitek-Disruptor',
        'Mindjack': 'Gehirnwäsche',
        'Magitek Ray': 'Magitek-Laser',
        'Demimagicks': 'Demimagie',

        'Art Of The Swell': 'Kunst des Windes',
        'Art Of The Storm': 'Kunst des Sturmes',
        'Art Of the Sword': 'Kunst des Schwertes',
        'Unmoving Troika': 'Unbewegte Troika',
        'Vein Splitter': 'Erdader-Spalter',
        'Lightless Spark': 'Lichtloser Funke',
        'Concentrativity': 'Konzentriertheit',
        'Storm, Swell, Sword': 'Wind, Sturm, Schwert',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Magitek Scorpion': 'scorpion magitek',
        'Aulus Mal Asina': 'Aulus Mal Asina',
        'Zenos Yae Galvus': 'Zenos Yae Galvus',

        'Rhalgr\'s Gate': 'Porte de Rhalgr',
        'The Chamber of Knowledge': 'Chambre du Savoir',
        'The Hall of the Griffin': 'Salle du Griffon',
      },
      'replaceText': {
        'Electromagnetic Field': 'Champ électromagnétique',
        'Target Search': 'Recherche de cible',
        'Lock On': 'Verrouillage',
        'Tail Laser': 'Laser caudal',

        'Mana Burst': 'Explosion de mana',
        'Order To Charge': 'Ordre d\'attaquer',
        'Order To Fire': 'Ordre de tirer',
        'Aetherochemical Grenado': 'Grenade magitek',
        'Integrated Aetheromodulator': 'Rayon accélérateur',
        'Magitek Disruptor': 'Disrupteur magitek',
        'Mindjack': 'Détournement cérébral',
        'Magitek Ray': 'Rayon magitek',
        'Demimagicks': 'Demimagie',

        'Art Of The Swell': 'Art de la tempête',
        'Art Of The Storm': 'Art de l\'orage',
        'Art Of the Sword': 'Art de l\'épée',
        'Unmoving Troika': 'Troïka immobile',
        'Vein Splitter': 'Fendeur du sol',
        'Lightless Spark': 'Étincelle sans lueur',
        'Concentrativity': 'Kenki concentré',
        'Storm, Swell, Sword': 'Tempête, orage, épée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Magitek Scorpion': 'ガードスコーピオン',
        'Aulus Mal Asina': 'アウルス・マル・アシナ',
        'Zenos Yae Galvus': 'ゼノス・イェー・ガルヴァス',

        'Rhalgr\'s Gate': '壊神門前',
        'The Chamber of Knowledge': 'アシナ仮設実験場',
        'The Hall of the Griffin': '鷲獅子の間',
      },
      'replaceText': {
        'Electromagnetic Field': '電磁フィールド',
        'Target Search': 'ターゲット・サーチ',
        'Lock On': 'ロックオン',
        'Tail Laser': 'テイルレーザー',

        'Mana Burst': 'マナバースト',
        'Order To Charge': '出撃命令',
        'Order To Fire': '攻撃命令',
        'Aetherochemical Grenado': '魔導榴弾',
        'Integrated Aetheromodulator': '加速レーザー',
        'Magitek Disruptor': '魔導ジャマー',
        'Mindjack': 'ブレインジャック',
        'Magitek Ray': '魔導レーザー',
        'Demimagicks': 'デミマジック',

        'Art Of The Swell': '風断一閃',
        'Art Of The Storm': '雷切一閃',
        'Art Of the Sword': '妖刀一閃',
        'Unmoving Troika': '不動三段',
        'Vein Splitter': '地脈断ち',
        'Lightless Spark': '無明閃',
        'Concentrativity': '圧縮剣気',
        'Storm, Swell, Sword': '秘剣風雷妖',
      },
    },
  ],
}];
