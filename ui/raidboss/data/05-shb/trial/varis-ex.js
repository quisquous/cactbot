'use strict';
[{
  zoneRegex: {
    en: /^Memoria Misera \(Extreme\)$/,
  },
  timelineFile: 'varis-ex.txt',
  timelineTriggers: [
    {
      id: 'VarisEx Ignis Est',
      // 4CB5: Varis starts using
      // 4CB6, 4CC5: Ignis Est starts using
      regex: /^Ignis Est$/,
      // Many alerts are 5 seconds ahead (stack, knockback), so differentiate.
      beforeSeconds: 7,
      durationSeconds: 7,
      // In and Out both use severity info here so that it doesn't conflict with the
      // spread/knockback/stack alert callouts.  These are always static, so it isn't
      // as important to differentiate with noise.
      //
      // Also, these are timeline triggers because there is a varying time between when
      // the initial cast (by Varis) happens and when other things happen.
      // Making them timeline triggers interleaves callouts a little bit more nicely
      // without having to hardcode a lot of delays.
      //
      // Also, 7 seconds interleaves properly where the order of callouts is the order
      // of things happening, i.e. "out => knockback", in first phase.
      response: Responses.getOut('info'),
    },
    {
      id: 'VarisEx Ventus Est',
      // 4CC6: Varis starts using
      // 4CC7, 4CC8: Ventus Est starts using
      regex: /^Ventus Est$/,
      beforeSeconds: 7,
      durationSeconds: 7,
      response: Responses.getIn('info'),
    },
    {
      id: 'VarisEx Festina Lente',
      // This is headMarker({id: '00A1'}), but is a timeline trigger both
      // for more warning, and to space around other triggers (dodge clones).
      regex: /^Festina Lente$/,
      beforeSeconds: 6,
      durationSeconds: 6,
      response: Responses.stack('alert'),
    },
    {
      id: 'VarisEx Magitek Burst',
      regex: /^Magitek Burst$/,
      beforeSeconds: 15,
      durationSeconds: 5,
      infoText: {
        en: 'Spread Soon',
      },
    },
  ],
  triggers: [
    {
      id: 'VarisEx Phase 2',
      // 4CCC: Vivere Militare Est
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CCC', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CCC', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CCC', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CCC', capture: false }),
      run: function(data) {
        data.phase = 2;
      },
    },
    {
      id: 'VarisEx Phase 5',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CE2', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CE2', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CE2', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CE2', capture: false }),
      run: function(data) {
        data.phase = 5;
      },
    },
    {
      id: 'VarisEx Clones',
      regex: Regexes.ability({ source: 'Phantom Varis', id: '4CB3', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis-Doppelgänger', id: '4CB3', capture: false }),
      regexFr: Regexes.ability({ source: 'double de Varis', id: '4CB3', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリスの幻影', id: '4CB3', capture: false }),
      run: function(data) {
        data.clonesActive = true;
      },
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
      // This trigger match the fourth Alea Iacta Est that Varis used.
      // The player should go front to avoid the fifth one, which hits back.
      id: 'VarisEx Alea Iacta Est Front',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD5', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD5', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CD5', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD5', capture: false }),
      // Multiple people getting hit by this can cause double triggers.
      suppressSeconds: 1,
      infoText: {
        en: 'Go Front',
        de: 'Nach Vorne gehen',
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
      delaySeconds: 21.5,
      response: Responses.knockback('alert'),
    },
    {
      id: 'VarisEx Reinforced Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD9', capture: false }),
      delaySeconds: function(data) {
        return data.phase == 2 ? 20 : 10;
      },
      alertText: {
        en: 'Stop attacking',
        de: 'Angriffe stoppen',
        fr: 'Arrêtez d\'attaquer',
        ja: 'ブロックしない側に攻撃',
        cn: '攻击未格挡的方向',
      },
    },
    {
      id: 'VarisEx Reinforced Gunshield Sides',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CDC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CDC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CDC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CDC', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'VarisEx Reinforced Gunshield Front',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CDB', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CDB', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Varis yae Galvus', id: '4CDB', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CDB', capture: false }),
      response: Responses.goSides('info'),
    },
    {
      id: 'VarisEx Loaded Gunshield Final Warning',
      // This ability id occurs ~3 seconds before the Magitek Burst spread damage.
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CDE', capture: false }),
      regexDe: Regexes.ability({ source: 'Varis yae Galvus', id: '4CDE', capture: false }),
      regexFr: Regexes.ability({ source: 'Varis yae Galvus', id: '4CDE', capture: false }),
      regexJa: Regexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CDE', capture: false }),
      response: function(data) {
        // This is easily forgetable after dodging and seems to get people killed.
        // This also differentiates spread from the spread => stack in the last phase.
        return Responses.spread(data.phase == 5 ? 'alarm' : 'alert');
      },
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
      condition: (data) => data.clonesActive,
      infoText: {
        en: 'Dodge Clones',
        de: 'Klonen ausweichen',
        fr: 'Esquivez les clones',
        ja: 'ターミナス・エストを避け',
        cn: '躲避剑气',
      },
      run: function(data) {
        delete data.clonesActive;
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
      alertText: {
        en: 'Bait Puddles Out',
        de: 'Flächen nach draußen ködern',
        fr: 'Attirez les taillades en dehors',
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
      'replaceSync': {
        'Bladesblood': 'Onde De Choc',
        'Gunshield': 'bouclier-canon',
        'I shall not yield!': 'Mon pavois est infrangible!',
        'Ignis Est': 'Ignis Est',
        'Magitek Turret II': 'tourelle magitek TM-II',
        'Phantom Varis': 'Double De Varis',
        'Terminus Est': 'Terminus Est',
        'Varis Yae Galvus': 'Varis yae Galvus',
        'Ventus Est': 'Ventus Est',
      },
      'replaceText': {
        '\\?': ' ?',
        '--clones appear--': '--Apparition des clones--',
        'Aetherochemical Grenado': 'Grenade Magitek',
        'Alea Iacta Est': 'Alea Jacta Est',
        'Altius': 'Altius',
        'Blade\'s Pulse': 'Duel d\'armes',
        'Citius': 'Citius',
        'Electrified Gunshield': 'Bouclier-canon : Choc magitek',
        'Ignis Est': 'Ignis Est',
        'Festina Lente': 'Festina Lente',
        'Fortius': 'Fortius',
        '(?<! )Gunshield(?! )': 'bouclier-canon',
        'Loaded Gunshield': 'Bouclier-canon : Explosion magitek',
        'Magitek Burst': 'Explosion magitek',
        'Magitek Shielding': 'Contre magitek',
        'Magitek Shock': 'Choc magitek',
        'Magitek Spark/Torch': 'Étincelle/Flammes magitek',
        'Magitek Torch/Spark': 'Flammes/Étincelle magitek',
        'Reinforcements': 'Demande de renforts',
        'Reinforced Gunshield': 'Bouclier-canon : Contre magitek',
        'Shockwave': 'Onde de choc',
        'Terminus Est': 'Terminus Est',
        'Ventus Est': 'Ventus Est',
        'Vivere Militare Est': 'Vivere Militare Est',
      },
    },
    {
      'locale': 'ja',
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
        '\\?': ' ?',
        '--clones appear--': '--幻影が現れる--',
        'Aetherochemical Grenado': '魔導榴弾',
        'Alea Iacta Est': 'アーレア・ヤクタ・エスト',
        'Altius': 'アルティウス',
        'Blade\'s Pulse': '攻撃を受け止める',
        'Citius': 'キティウス',
        'Electrified Gunshield': 'ガンシールド：魔導ショック',
        'Festina Lente': 'フェスティナ・レンテ',
        'Fortius': 'フォルティウス',
        '(?<! )Gunshield(?! )': 'ガンシールド',
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
