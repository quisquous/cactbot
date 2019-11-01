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
      regex: / 14:204D:Magitek Scorpion starts using Electromagnetic Field/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Ala Mhigo Mana Burst',
      regex: / 14:204F:Aulus [mM]al Asina starts using Mana Burst/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Ala Mhigo Demimagicks',
      regex: / 14:205D:Aulus [mM]al Asina starts using Demimagicks/,
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'Ala Mhigo Storm',
      regex: / 14:(?:2066|2587):Zenos [yY]ae Galvus starts using Art Of The Storm/,
      infoText: {
        en: 'Out of blue circle',
      },
    },
    {
      id: 'Ala Mhigo Swell',
      regex: / 14:(?:2065|2586):Zenos [yY]ae Galvus starts using Art Of The Swell/,
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'Ala Mhigo Sword',
      regex: / 14:(?:2068|2588):Zenos [yY]ae Galvus starts using Art Of The Sword/,
      alertText: {
        en: 'Protean',
      },
    },
    {
      id: 'Ala Mhigo Lightless Spark',
      regex: / 23:\y{ObjectId}:Zenos [yY]ae Galvus:\y{ObjectId}:(\y{Name}):....:....:0029:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Face tether out',
      },
    },
    {
      id: 'Ala Mhigo Concentrativity',
      regex: / 14:206D:Zenos [yY]ae Galvus starts using Concentrativity/,
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
