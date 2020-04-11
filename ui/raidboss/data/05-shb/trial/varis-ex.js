'use strict';
[{
  zoneRegex: {
    en: /^Memoria Misera \(Extreme\)$/,
  },
  timelineFile: 'varis-ex.txt',
  triggers: [
    {
      id: 'VarisEx Phase 2',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CCC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CCC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CCC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CCC', capture: false }),
      run: function(data) {
        data.phase = 'phase2';
      },
    },
    {
      id: 'VarisEx Clones',
      regex: Regexes.ability({ source: 'Phantom Varis', id: '4CB3', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis-Doppelgänger', id: '4CB3', capture: false }),
      regexFr: Regexes.ability({ source: 'double de Varis', id: '4CB3', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリスの幻影', id: '4CB3', capture: false }),
      run: function(data) {
        data.clones = 'active';
      },
    },
    {
      id: 'VarisEx Ignis Est',
      regex: Regexes.startsUsing({ source: 'Ignis Est', id: '4CB6', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Ignis Est', id: '4CB6', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Ignis Est', id: '4CB6', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'イグニス・エスト', id: '4CB6', capture: false }),
      delaySeconds: 2,
      response: Responses.getOut(),
    },
    {
      id: 'VarisEx Ventus Est',
      regex: Regexes.startsUsing({ source: 'Ventus Est', id: '4CC7', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Ventus Est', id: '4CC7', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Ventus Est', id: '4CC7', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ウェントゥス・エスト', id: '4CC7', capture: false }),
      delaySeconds: 2,
      response: Responses.getIn('info'),
    },
    {
      id: 'VarisEx Altius',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CCA', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CCA', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CCA', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CCA', capture: false }),
      infoText: {
        en: 'Bait Slashes',
        de: 'Schnitte ködern',
        ja: '縦へ、アルティウスを誘導',
        cn: 'Boss身后诱导剑气方向',
      },
    },
    {
      id: 'VarisEx Citius',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CF0' }),
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CF0' }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CF0' }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CF0' }),
      alertText: function(data, matches) {
        const target = matches.target;
        if (data.me == target) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          };
        }
        if (data.role == 'dps') {
          return {
            en: 'Avoid tank cleave',
            de: 'Tank Cleave ausweichen',
            fr: 'Evitez le cleave sur le tank',
            ja: '前方範囲攻撃を避け',
            ko: '광역 탱버 피하기',
            cn: '远离顺劈',
          };
        }
        return {
          en: 'Buster on ' + data.ShortName(target),
          de: 'Tankbuster auf ' + data.ShortName(target),
          fr: 'Tankbuster sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'にタンクバスター',
          cn: '死刑 -> ' + data.ShortName(target),
          ko: '탱버 → ' + data.ShortName(target),
        };
      },
    },
    {
      id: 'VarisEx Alea Iacta Est',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CD2', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CD2', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CD2', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD2', capture: false }),
      response: Responses.getBehind('alert'),
    },
    {
      // this trigger match the fourth Alea Iacta Est that Varis used
      // norice player should go front to avoid the fifth one, which hits back.
      id: 'VarisEx Alea Iacta Est Front',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD5', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD5', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD5', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD5', capture: false }),
      infoText: {
        en: 'Go Front',
        de: 'Nach Vorne gehen',
        ja: '前へ',
        cn: '到正面',
      },
    },
    {
      id: 'VarisEx Electrified Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD7', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD7', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD7', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD7', capture: false }),
      delaySeconds: 21,
      response: Responses.knockback(),
    },
    {
      id: 'VarisEx Reinforced Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD9', capture: false }),
      delaySeconds: function(data) {
        if (data.phase == 'phase2')
          return 20;
        return 10;
      },
      alertText: {
        en: 'Stop attacking',
        de: 'Angriffe stoppen',
        ja: 'ブロックしない側に攻撃',
        cn: '攻击未格挡的方向',
      },
    },
    {
      id: 'VarisEx Loaded Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD8', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD8', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD8', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD8', capture: false }),
      delaySeconds: function(data) {
        if (data.phase == 'phase2')
          return 13;
        if (data.phase == 'phase3')
          return 21;
        return 16;
      },
      response: Responses.spread(),
    },
    {
      id: 'VarisEx Reinforcements',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CEA', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CEA', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CEA', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CEA', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Grab Tethers',
            de: 'Verbindung nehmen',
            ja: '線を取る',
            cn: '接线',
          };
        }
        return {
          en: 'Kill adds',
          de: 'Adds besiegen',
          fr: 'Tuez les adds',
          ja: '雑魚を処理',
          ko: '쫄 잡기',
          cn: '击杀小怪',
        };
      },
    },
    {
      id: 'VarisEx Terminus Est Clones',
      regex: Regexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ターミナス・エスト', id: '4CB4', capture: false }),
      condition: (data) => data.clones == 'active',
      infoText: {
        en: 'Dodge Clones',
        de: 'Klonen ausweichen',
        ja: 'ターミナス・エストを避け',
        cn: '躲避剑气',
      },
      run: function(data) {
        delete data.clones;
      },
    },
    {
      id: 'VarisEx Magitek Spark',
      regex: Regexes.startsUsing({ source: 'Gunshield', id: '4E50', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Gewehrschild', id: '4E50', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'bouclier-canon', id: '4E50', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ガンシールド', id: '4E50', capture: false }),
      response: Responses.spread(),
      run: function(data) {
        data.phase = 'phase3';
      },
    },
    {
      id: 'VarisEx Magitek Torch',
      regex: Regexes.startsUsing({ source: 'Gunshield', id: '4E4F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Gewehrschild', id: '4E4F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'bouclier-canon', id: '4E4F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ガンシールド', id: '4E4F', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'VarisEx Fortius',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CE[56]', capture: false }),
      infoText: {
        en: 'Bait Puddles Out',
        de: 'Flächen nach draußen ködern',
        ja: '外周に安置',
        cn: '外圈放黑泥',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bladesblood': 'Bastardramme',
        'Gunshield': 'Gewehrschild',
        'I shall not yield!': 'Keine Kraft der Welt kann diesen Schild durchdringen!',
        'Ignis Est': 'Ignis Est',
        'Magitek Turret II': 'Magitek-Geschütz II',
        'Phantom Varis': 'Varis-Doppelgänger',
        'Terminus Est': 'Terminus Est',
        'Varis Yae Galvus': 'Varis yae Galvus',
        'Ventus Est': 'Ventus Est',
      },
      'replaceText': {
        '(?!< )Action': 'Aktion',
        '(?!< )Ready': 'Fertig',
        '--clones appear--': '--Klone erscheinen--',
        '--clones appear\\?--': '--Klone erscheinen?--',
        'Aetherochemical Grenado': 'Magitek-Granate',
        'Alea Iacta Est': 'Alea Iacta Est',
        'Altius': 'Altius',
        'Blade\'s Pulse': 'Klingenpuls',
        'Citius': 'Citius',
        'Electrified Gunshield': 'Gewehrschild: Magitek-Schock',
        'Festina Lente': 'Festina Lente',
        'Fortius': 'Fortius',
        '(?<! )Gunshield(?! )': 'Gewehrschild',
        'Gunshield Actions': 'Gewehrschild Aktionen',
        'Ignis Est': 'Ignis Est',
        'Loaded Gunshield': 'Gewehrschild: Magitek-Knall',
        'Magitek Burst': 'Magitek-Knall',
        'Magitek Shielding': 'Magitek-Knall',
        'Magitek Shock': 'Magitek-Schock',
        'Magitek Spark/Torch': 'Magitek-Funke/Flamme ',
        'Magitek Torch/Spark': 'Magitek Flamme/Funke',
        'Reinforced Gunshield': 'Gewehrschild: Magitek-Konter',
        'Reinforcements': 'Unterstützungsbefehl',
        'Shockwave': 'Schockwelle',
        'Terminus Est': 'Terminus Est',
        'Ventus Est': 'Ventus Est',
        'Vivere Militare Est': 'Vivere Militare Est',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Bladesblood': 'onde de choc',
        'Gunshield': 'bouclier-canon',
        'I shall not yield!': 'Mon pavois est infrangible!',
        'Ignis Est': 'Ignis Est',
        'Magitek Turret II': 'tourelle magitek TM-II',
        'Phantom Varis': 'double de Varis',
        'Terminus Est': 'Terminus Est',
        'Varis Yae Galvus': 'Varis yae Galvus',
        'Ventus Est': 'Ventus Est',
      },
      'replaceText': {
        'Aetherochemical Grenado': 'Grenade magitek',
        'Alea Iacta Est': 'Alea Jacta Est',
        'Altius': 'Altius',
        'Citius': 'Citius',
        'Electrified Gunshield': 'Bouclier-canon : Choc magitek',
        'Festina Lente': 'Festina Lente',
        'Fortius': 'Fortius',
        '(?<! )Gunshield(?! )': 'bouclier-canon',
        'Ignis Est': 'Ignis Est',
        'Loaded Gunshield': 'Bouclier-canon : Explosion magitek',
        'Magitek Burst': 'Explosion magitek',
        'Magitek Shielding': 'Contre magitek',
        'Magitek Shock': 'Choc magitek',
        'Magitek Spark/Torch': 'Étincelle/Flammes magitek',
        'Magitek Torch/Spark': 'Flammes/Étincelle magitek',
        'Reinforced Gunshield': 'Bouclier-canon : Contre magitek',
        'Reinforcements': 'Demande de renforts',
        'Shockwave': 'Onde de choc',
        'Terminus Est': 'Terminus Est',
        'Ventus Est': 'Ventus Est',
        'Vivere Militare Est': 'Vivere Militare Est',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bladesblood': '剣気',
        'Gunshield': 'ガンシールド',
        'I shall not yield!': '我が大盾に、防げぬものなし',
        'Ignis Est': 'イグニス・エスト',
        'Magitek Turret II': '魔導タレットII',
        'Phantom Varis': 'ヴァリスの幻影',
        'Terminus Est': 'ターミナス・エスト',
        'Varis Yae Galvus': 'ヴァリス・イェー・ガルヴァス',
        'Ventus Est': 'ウェントゥス・エスト',
      },
      'replaceText': {
        'Aetherochemical Grenado': '魔導榴弾',
        'Alea Iacta Est': 'アーレア・ヤクタ・エスト',
        'Altius': 'アルティウス',
        'Citius': 'キティウス',
        'Electrified Gunshield': 'ガンシールド：魔導ショック',
        'Festina Lente': 'フェスティナ・レンテ',
        'Fortius': 'フォルティウス',
        '(?<! )Gunshield(?! )': 'ガンシールド',
        'Gunshield Actions': 'ガンシールド技',
        'Ignis Est': 'イグニス・エスト',
        'Loaded Gunshield': 'ガンシールド：魔導バースト',
        'Magitek Burst': '魔導バースト',
        'Magitek Shielding': '魔導カウンター',
        'Magitek Shock': '魔導ショック',
        'Magitek Spark/Torch': '魔導スパーク／魔導フレーム',
        'Magitek Torch/Spark': '魔導フレーム／魔導スパーク',
        'Reinforced Gunshield': 'ガンシールド：魔導カウンター',
        'Reinforcements': '支援命令',
        'Shockwave': '衝撃波',
        'Terminus Est': 'ターミナス・エスト',
        'Ventus Est': 'ウェントゥス・エスト',
        'Vivere Militare Est': 'ウィーウェレ・ミーリターレ・エスト',
      },
    },
  ],
}];
