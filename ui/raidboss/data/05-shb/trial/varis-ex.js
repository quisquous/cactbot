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
        fr: 'Attirez les taillades',
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
            fr: 'Évitez le cleave sur le tank',
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
        en: 'Go Front Boss',
        fr: 'Allez devant le boss',
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
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CD9', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CD9', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD9', capture: false }),
      delaySeconds: function(data) {
        if (data.phase == 'phase2')
          return 20;
        return 10;
      },
      alertText: {
        en: 'Stop attacking',
        fr: 'Arrêtez d\'attaquer',
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
            fr: 'Prenez un lien',
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
        fr: 'Esquivez les clones',
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
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CE[56]', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CE[56]', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CE[56]', capture: false }),
      infoText: {
        en: 'Bait Puddles Out',
        fr: 'Attirez les taillades en dehors',
        ja: '外周に安置',
        cn: '外圈放黑泥',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'fr',
      'replaceSync': {
        'Bladesblood': 'Onde De Choc',
        'Gunshield': 'Bouclier-canon',
        'Ignis Est': 'Ignis Est',
        'Magitek Turret II': 'Tourelle Magitek TM-II',
        'Phantom Varis': 'Double De Varis',
        'Terminus Est': 'terminus Est',
        'Varis Yae Galvus': 'Varis yae Galvus',
        'Ventus Est': 'Ventus Est',
      },
      'replaceText': {
        '--clones appear--': '--Apparition des clones--',
        '--clones appear?--': '--Apparition des clones ?--',
        'Aetherochemical Grenado': 'Grenade Magitek',
        'Aetherochemical Grenado?': 'Grenade Magitek ?',
        'Alea Iacta Est': 'Alea Jacta Est',
        'Alea Iacta Est?': 'Alea Jacta Est ?',
        'Altius': 'Altius',
        'Altius?': 'Altius ?',
        'Citius': 'Citius',
        'Citius?': 'Citius ?',
        'Electrified Gunshield': 'Bouclier-canon : Choc magitek',
        'Electrified Gunshield?': 'Bouclier-canon : Choc magitek ?',
        'Ignis Est': 'Ignis Est',
        'Ignis Est,': 'Ignis Est ?',
        'Festina Lente': 'Festina Lente',
        'Festina Lente?': 'Festina Lente ?',
        'Fortius': 'Fortius',
        'Loaded Gunshield': 'Bouclier-canon : Explosion magitek',
        'Loaded Gunshield?': 'Bouclier-canon : Explosion magitek ?',
        'Magitek Burst': 'Explosion magitek',
        'Magitek Burst?': 'Explosion magitek ?',
        'Magitek Shielding': 'Contre magitek',
        'Magitek Shock': 'Choc magitek',
        'Magitek Shock?': 'Choc magitek ?',
        'Magitek Spark/Torch': 'Étincelle magitek/Flammes',
        'Magitek Torch/Spark': 'Flammes magitek/Étincelle',
        'Reinforcements': 'Contre magitek',
        'Reinforcements?': 'Contre magitek ?',
        'Reinforced Gunshield': 'Bouclier-canon : Contre magitek',
        'Reinforced Gunshield?': 'Bouclier-canon : Contre magitek ?',
        'Shockwave': 'Onde de choc',
        'Terminus Est': 'Terminus Est',
        'Terminus Est?': 'Terminus Est ?',
        'Ventus Est': 'Ventus Est',
        'Vivere Militare Est': 'Vivere Militare Est',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Varis Yae Galvus': 'ヴァリス・イェー・ガルヴァス',
        'Ventus Est': 'ウェントゥス・エスト',
        'Bladesblood': '剣気',
        'Gunshield': 'ガンシールド',
        'Magitek Turret II': '魔導タレットII',
        'I shall not yield!': '我が大盾に、防げぬものなし',
      },
      'replaceText': {
        'Altius': 'アルティウス',
        'Citius': 'キティウス',
        'Alea Iacta Est': 'アーレア・ヤクタ・エスト',
        'Terminus Est': 'ターミナス・エスト',
        'Ignis Est Ready': 'イグニス・エスト',
        'Ventus Est Ready': 'ウェントゥス・エスト',
        'Ignis Est Action': 'イグニス・エスト発動',
        'Ventus Est Action': 'ウェントゥス・エスト発動',
        'Festina Lente': 'フェスティナ・レンテ',
        'Reinforcements': '支援命令',
        'Aetherochemical Grenado': '魔導榴弾',
        'Loaded Gunshield': 'ガンシールド：魔導バースト',
        'Reinforced Gunshield': 'ガンシールド：魔導カウンター',
        'Electrified Gunshield': 'ガンシールド：魔導ショック',
        'Magitek Shock': '魔導ショック',
        'Magitek Burst': '魔導バースト',
        'Magitek Shielding': '魔導カウンター',
        'Vivere Militare Est': 'ウィーウェレ・ミーリターレ・エスト',
        'Gunshield Actions': 'ガンシールド技',
        'Magitek Spark/Torch': '魔導スパーク／魔導フレーム',
        'Magitek Torch/Spark': '魔導フレーム／魔導スパーク',
        'Fortius': 'フォルティウス',
      },
    },
  ],
}];
