'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(3\)$/,
  },
  timelineFile: 'e7s.txt',
  triggers: [
    {
      id: 'E7S Empty Wave',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C8A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '44C8A', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'E7S Unshadowed Stake',
      regex: Regexes.tether({ source: 'The Idol Of Darkness', id: '0025' }),
      regexFr: Regexes.tether({ source: 'Idole Des Ténèbres', id: '0025' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E7S Betwixt Worlds',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4CFD', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4CFD', capture: false }),
      run: function(data) {
        data.phase = 'betwixtWorlds';
      },
    },
    {
      id: 'E7S Betwixt Worlds Tether',
      regex: Regexes.tether({ source: 'The Idol Of Darkness', id: '0011' }),
      regexFr: Regexes.tether({ source: 'Idole Des Ténèbres', id: '0011' }),
      preRun: function(data, matches) {
        data.betwixtWorldsTethers = data.betwixtWorldsTethers || [];
        data.betwixtWorldsTethers.push(matches.target);
      },
      condition: function(data, matches) {
        return data.phase == 'betwixtWorlds' && data.me == matches.target;
      },
      infoText: {
        en: 'Tether on YOU',
        fr: 'Lien sur VOUS',
        ko: '선 대상자',
      },
    },
    {
      id: 'E7S Betwixt Worlds Stack',
      regex: Regexes.headMarker({ id: '0064' }),
      preRun: function(data, matches) {
        data.betwixtWorldsStack = data.betwixtWorldsStack || [];
        data.betwixtWorldsStack.push(matches.target);
      },
      condition: function(data) {
        return data.phase == 'betwixtWorlds';
      },
      alertText: function(data, matches) {
        if (data.betwixtWorldsTethers.indexOf(data.me))
          return;
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            ko: '나에게 모이기',
          };
        }
        if (data.betwixtWorldsStack.length == 1)
          return;
        let names = data.betwixtWorldsStack.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Stack (' + names.join(', ') + ')',
          ko: '모이기 (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'E7S Left With Thee',
      regex: Regexes.gainsEffect({ effect: 'Left With Thee' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Gauche' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Left',
        fr: 'Téléportation à gauche',
        ko: '왼쪽으로 순간이동',
      },
    },
    {
      id: 'E7S Left With Right',
      regex: Regexes.gainsEffect({ effect: 'Right With Thee' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Droite' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Right',
        fr: 'Téléportation à droite',
        ko: '오른쪽으로 순간이동',
      },
    },
    {
      id: 'E7S Forward With Thee',
      regex: Regexes.gainsEffect({ effect: 'Forward With Thee' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Avant' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Forward',
        fr: 'Téléportation devant',
        ko: '앞으로 순간이동',
      },
    },
    {
      id: 'E7S Back With Thee',
      regex: Regexes.gainsEffect({ effect: 'Back With Thee' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Arrière' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Back',
        fr: 'Téléportation derrière',
        ko: '뒤로 순간이동',
      },
    },
    {
      id: 'E7S False Midnight',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C99', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C99', capture: false }),
      run: function(data) {
        data.phase = 'falseMidnight';
      },
    },
    {
      id: 'E7S Silver Shot',
      regex: Regexes.headMarker({ id: '0065' }),
      preRun: function(data, matches) {
        data.falseMidnightSpread = data.falseMidnightSpread || [];
        data.falseMidnightSpread.push(matches.target);
      },
      condition: function(data, matches) {
        return data.phase == 'falseMidnight' && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'E7S Silver Sledge',
      regex: Regexes.headMarker({ id: '0064' }),
      condition: function(data) {
        return data.phase == 'falseMidnight';
      },
      alertText: function(data, matches) {
        if (data.falseMidnightSpread.indexOf(data.me))
          return;
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            ko: '나에게 모이기',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(target),
          de: 'Auf ' + data.ShortName(target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'にスタック',
          cn: '靠近 ' + data.ShortName(target) + '集合',
          ko: '쉐어징 → ' + data.ShortName(target),
        };
      },
    },
    {
      id: 'E7S Adds',
      regex: Regexes.addedCombatant({ name: 'Blasphemy', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Vol D\'idolâtries Impardonnables', capture: false }),
      suppressSeconds: 1,
      run: function(data) {
        data.phase = 'adds';
      },
    },
    {
      id: 'E7S Insatiable Light Stack',
      regex: Regexes.headMarker({ id: '0064' }),
      preRun: function(data, matches) {
        data.insatiableLightStack = data.insatiableLightStack || [];
        data.insatiableLightStack.push(matches.target);
      },
      condition: function(data) {
        return data.phase == 'adds';
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            ko: '나에게 쉐어징',
          };
        }
        if (data.insatiableLightStack.length == 1)
          return;
        let names = data.insatiableLightStack.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Stack (' + names.join(', ') + ')',
          fr: 'Package (' + names.join(', ') + ')',
          ko: '모이기 (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'E7S Insatiable Light',
      regex: Regexes.ability({ source: 'Idolatry', id: '4C6D', capture: false }),
      regexFr: Regexes.ability({ source: 'Vol D\'idolâtries Impardonnables', id: '4C6D', capture: false }),
      run: function(data) {
        data.insatiableLightStack = [];
      },
    },
    {
      id: 'E7S Strength in Numbers',
      regex: Regexes.startsUsing({ source: 'Idolatry', id: '4C70', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Vol D\'idolâtries Impardonnables', id: '4C70', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Get under vertical add',
        fr: 'Allez sous l\'add vertical',
        ko: '똑바로 서 있는 쫄 아래로',
      },
    },
    {
      id: 'E7S Unearned Envy',
      regex: Regexes.ability({ source: 'Blasphemy', id: '4C74', capture: false }),
      regexFr: Regexes.ability({ source: 'Vol D\'idolâtries Impardonnables', id: '4C74', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      suppressSeconds: 15,
      durationSeconds: 7,
      response: Responses.aoe(),
    },
    {
      id: 'E7S Empty Flood',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '(?:4C8[BC]|4E5[56])', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '(?:4C8[BC]|4E5[56])', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'E7S Unjoined Aspect',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C3B', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C3B', capture: false }),
      run: function(data) {
        data.colorMap = {};
        data.colorMap['light'] = {
          en: 'Dark',
          fr: 'Noir',
          ko: '어둠',
        };
        data.colorMap['dark'] = {
          en: 'Light',
          fr: 'Blanc',
          ko: '빛',
        };
      },
    },
    {
      id: 'E7S Astral Effect',
      regex: Regexes.gainsEffect({ effect: 'Astral Effect' }),
      regexFr: Regexes.gainsEffect({ effect: 'Corruption De Lumière' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.color = 'light';
      },
    },
    {
      id: 'E7S Umbral Effect',
      regex: Regexes.gainsEffect({ effect: 'Umbral Effect' }),
      regexFr: Regexes.gainsEffect({ effect: 'Corruption De Ténèbres' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.color = 'dark';
      },
    },
    {
      id: 'E7S Boundless Light',
      regex: Regexes.startsUsing({ source: 'Unforgiven Idolatry', id: '4C5C' }),
      condition: function(data) {
        return data.color == 'dark';
      },
      response: Responses.stackOn(),
    },
    {
      id: 'E7S Boundless Dark',
      regex: Regexes.startsUsing({ source: 'Unforgiven Idolatry', id: '4C5D' }),
      regexFr: Regexes.startsUsing({ source: 'Nuée D\'idolâtries Impardonnables', id: '4C5D' }),
      condition: function(data) {
        return data.color == 'light';
      },
      response: Responses.stackOn(),
    },
    {
      id: 'E7S Words of Night',
      regex: Regexes.startsUsing({ source: 'Unforgiven Idolatry', id: '(?:4C2C|4C65)', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Nuée D\'idolâtries Impardonnables', id: '(?:4C2C|4C65)', capture: false }),
      alertText: function(data) {
        return {
          en: 'Get hit by ' + data.colorMap[data.color][data.lang],
          ko: data.colorMap[data.color][data.lang] + ' 맞기',
        };
      },
    },
    {
      id: 'E7S False Dawn',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C9A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C9A', capture: false }),
      suppressSeconds: 1,
      alertText: {
        en: 'Bait Puddles',
        fr: 'Placez les flaques',
      },
    },
    {
      id: 'E7S Crusade',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C76', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C76', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E7S Threefold Grace',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C7E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C7E', capture: false }),
      alertText: function(data) {
        return {
          en: 'Stand in ' + data.colorMap[data.color][data.lang],
          fr: 'Restez sur ' + data.colorMap[data.color][data.lang],
          ko: data.colorMap[data.color][data.lang] + '에 서기',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'unforgiven idolatry': 'ungeläutert[a] Götzenverehrung',
        'the Idol of Darkness': 'Götzenbild[p] der Dunkelheit',
        'scuro': 'verdichtet[a] Licht',
        '(?<! )idolatry': 'Idolatrie',
        'chiaro': 'verdichtet[a] Dunkel',
        'blasphemy': 'Blasphemie',
      },
      'replaceText': {
        'Words of Unity': 'Kommando: Stürmischer Angriff',
        'Words of Spite': 'Kommando: Anvisieren',
        'Words of Night': 'Kommando: Nächtlicher Angriff',
        'Words of Motion': 'Kommando: Wellen',
        'Words of Fervor': 'Kommando: Wilder Tanz',
        'Words of Entrapment': 'Kommando: Einkesselung',
        'White Smoke': 'Weißes Feuer',
        'Unshadowed Stake': 'Dunkler Nagel',
        'Unjoined Aspect': 'Attributswechsel',
        'Unearned Envy': 'Verteidigungsinstinkt',
        'Threefold Grace': 'Dreifache Korona',
        'Sungrace': 'Solare Korona',
        'Stygian Sword': 'Schwarzes Schwert',
        'Stygian Stake': 'Schwarzer Nagel',
        'Stygian Spear': 'Schwarzer Speer',
        'Strength in Numbers': 'Angriffsmanöver',
        'Silver Sword': 'Weißes Lichtschwert',
        'Silver Stake': 'Heller Nagel',
        'Silver Spear': 'Weißer Lichtspeer',
        'Silver Sledge': 'Weißer Lichthammer',
        'Silver Shot': 'Weißer Lichtpfeil',
        'Silver Scourge': 'Peitschendes Licht',
        'Shockwave': 'Schockwelle',
        'Paper Cut': 'Leichter Sturmangriff',
        'Overwhelming Force': 'Vernichtende Schlammflut',
        'Moongrace': 'Lunare Korona',
        'Light\'s Course': 'Weißer Strom des Lichts',
        'Insatiable Light': 'Licht des Verderbens',
        'Fate\'s Course': 'Reißender Strom',
        'False Moonlight': 'Manöver der Nacht',
        'False Midnight': 'Manöver der Polarnacht',
        'False Dawn': 'Manöver des Morgengrauens',
        'Explosion': 'Explosion',
        'Empty Wave': 'Welle der Leere',
        'Empty Flood': 'Flut der Leere',
        'Dark\'s Course': 'Weißer Strom des Lichts',
        'Crusade': 'Ansturm',
        'Buffet': 'Bö',
        'Boundless Light': 'Weißer Lichtstrom',
        'Boundless Dark': 'Schwarzer Finsterstrom',
        'Black Smoke': 'Schwarzes Feuer',
        'Betwixt Worlds': 'Dimensionsloch',
        'Away with Thee': 'Zwangsumwandlung',
        'Advent of Light': 'Lichtsaturation',
      },
      '~effectNames': {
        'Waymark': 'Ziel des Ansturms',
        'Umbral Effect': 'Denaturation Dunkelheit',
        'Stun': 'Betäubung',
        'Right with Thee': 'Deportation: rechts',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Left with Thee': 'Deportation: links',
        'Forward with Thee': 'Deportation: vorne',
        'Back with Thee': 'Deportation: hinten',
        'Astral Effect': 'Denaturation Licht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'unforgiven idolatry': 'Nuée d\'idolâtries impardonnables',
        'the Idol of Darkness': 'Idole des Ténèbres',
        'scuro': 'Amas de clarté',
        '(?<! )idolatry': 'Vol d\'idolâtries impardonnables',
        'chiaro': 'Amas de noirceur',
        'blasphemy': 'Vol d\'idolâtries impardonnables',
      },
      'replaceText': {
        'Words of Unity': 'Ordre d\'assaut',
        'Words of Spite': 'Ordre de visée',
        'Words of Night': 'Ordre d\'attaque-surprise',
        'Words of Motion': 'Ordre de déferlement',
        'Words of Fervor': 'Ordre de virevolte',
        'Words of Entrapment': 'Ordre d\'encerclement',
        'White Smoke': 'Brûlure immaculée',
        'Unshadowed Stake': 'Poinçon clair-obscur',
        'Unjoined Aspect': 'Transition élémentaire',
        'Unearned Envy': 'Mécanisme de défense',
        'Threefold Grace': 'Couronne triple',
        'Sungrace': 'Couronne solaire',
        'Stygian Sword': 'Épée ténébreuse',
        'Stygian Stake': 'Poinçon ténébreux',
        'Stygian Spear': 'Lance ténébreuse',
        'Strength in Numbers': 'Murmuration offensive',
        'Silver Sword': 'Épée immaculée',
        'Silver Stake': 'Poinçon immaculé',
        'Silver Spear': 'Lance immaculée',
        'Silver Sledge': 'Pilon immaculé',
        'Silver Shot': 'Trait immaculé',
        'Silver Scourge': 'Lumière fustigeante',
        'Shockwave': 'Onde de choc',
        'Paper Cut': 'Légère collision',
        'Overwhelming Force': 'Remous destructeurs',
        'Moongrace': 'Couronne lunaire',
        'Light\'s Course': 'Déferlement immaculé',
        'Insatiable Light': 'Lumière destructrice',
        'Fate\'s Course': 'Flot d\'énergie',
        'False Moonlight': 'Murmuration du jour polaire',
        'False Midnight': 'Murmuration de la nuit polaire',
        'False Dawn': 'Murmuration de l\'aube',
        'Explosion': 'Explosion',
        'Empty Wave': 'Onde de néant',
        'Empty Flood': 'Déluge de néant',
        'Dark\'s Course': 'Déferlement immaculé',
        'Crusade': 'Plongeon de la nuée',
        'Buffet': 'Rafale',
        'Boundless Light': 'Flot immaculé',
        'Boundless Dark': 'Flot ténébreux',
        'Black Smoke': 'Brûlure ténébreuse',
        'Betwixt Worlds': 'Brèche dimensionnelle',
        'Away with Thee': 'Translation forcée',
        'Advent of Light': 'Plénitude lumineuse',
      },
      '~effectNames': {
        'Waymark': 'Cible d\'une ruée',
        'Umbral Effect': 'Corruption de Ténèbres',
        'Stun': 'Étourdissement',
        'Right with Thee': 'Translation droite',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Left with Thee': 'Translation gauche',
        'Forward with Thee': 'Translation avant',
        'Back with Thee': 'Translation arrière',
        'Astral Effect': 'Corruption de Lumière',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'unforgiven idolatry': 'アンフォーギヴン・アイドラトリー',
        'the Idol of Darkness': 'ダークアイドル',
        'scuro': '清光塊',
        '(?<! )idolatry': 'アイドラトリー',
        'chiaro': '闇影塊',
        'blasphemy': 'ブラスヒーム',
      },
      'replaceText': {
        'Words of Unity': '強襲の号令',
        'Words of Spite': '照準の号令',
        'Words of Night': '夜襲の号令',
        'Words of Motion': '波状の号令',
        'Words of Fervor': '乱舞の号令',
        'Words of Entrapment': '包囲の号令',
        'White Smoke': '白光の火',
        'Unshadowed Stake': '闇光の釘',
        'Unknown Ability': 'Unknown Ability',
        'Unjoined Aspect': '属性変動',
        'Unearned Envy': '防衛本能',
        'Threefold Grace': '三重光環',
        'Sungrace': '日光環',
        'Stygian Sword': '黒闇の剣',
        'Stygian Stake': '黒闇の釘',
        'Stygian Spear': '黒闇の槍',
        'Strength in Numbers': '攻撃機動',
        'Silver Sword': '白光の剣',
        'Silver Stake': '白光の釘',
        'Silver Spear': '白光の槍',
        'Silver Sledge': '白光の槌',
        'Silver Shot': '白光の矢',
        'Silver Scourge': '白光の鞭',
        'Shockwave': '衝撃波',
        'Paper Cut': '小突撃',
        'Overwhelming Force': '破滅の濁流',
        'Moongrace': '月光環',
        'Light\'s Course': '白光の奔流',
        'Insatiable Light': '破滅の光',
        'Fate\'s Course': '奔流',
        'False Moonlight': '白夜の機動',
        'False Midnight': '極夜の機動',
        'False Dawn': '黎明の機動',
        'Explosion': '爆散',
        'Empty Wave': '虚無の波動',
        'Empty Flood': '虚無の氾濫',
        'Dark\'s Course': '白光の奔流',
        'Crusade': '群体突進',
        'Buffet': '突風',
        'Boundless Light': '白光の激流',
        'Boundless Dark': '黒闇の激流',
        'Black Smoke': '黒闇の火',
        'Betwixt Worlds': '次元孔',
        'Away with Thee': '強制転移',
        'Advent of Light': '光の飽和',
      },
      '~effectNames': {
        'Waymark': '突進標的',
        'Umbral Effect': '偏属性：闇',
        'Stun': 'スタン',
        'Right with Thee': '強制転移：右',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Left with Thee': '強制転移：左',
        'Forward with Thee': '強制転移：前',
        'Back with Thee': '強制転移：後',
        'Astral Effect': '偏属性：光',
      },
    },
  ],
}];
