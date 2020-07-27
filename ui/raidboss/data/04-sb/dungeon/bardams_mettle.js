'use strict';

// Bardam's Mettle

[{
  zoneRegex: {
    en: /^Bardam's Mettle$/,
    cn: /^巴儿达木霸道$/,
    ko: /^바르담 패도$/,
  },
  zoneId: ZoneId.BardamsMettle,
  timelineFile: 'bardams_mettle.txt',
  timelineTriggers: [
    {
      id: 'Bardam\'s Mettle Feathercut',
      regex: /Feathercut/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'Bardam\'s Mettle Rush',
      netRegex: NetRegexes.tether({ id: '0039' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Run Away From Boss',
        de: 'Renn weg vom Boss',
        fr: 'Courez loin du boss',
        cn: '远离Boss',
        ko: '보스와 거리 벌리기',
      },
    },
    {
      id: 'Bardam\'s Mettle War Cry',
      netRegex: NetRegexes.startsUsing({ id: '1EFA', source: 'Garula', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1EFA', source: 'Garula', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1EFA', source: 'Garula', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1EFA', source: 'ガルラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1EFA', source: '加鲁拉', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Both Bardam and Yol use the 0017 head marker.
      // If we're in the Yol encounter, we're obviously not fighting Bardam.
      id: 'Bardam\'s Mettle Dead Bardam',
      netRegex: NetRegexes.message({ line: '.*Voiceless Muse will be sealed off.*?', capture: false }),
      run: function(data) {
        data.deadBardam = true;
      },
    },
    {
      id: 'Bardam\'s Mettle Empty Gaze',
      netRegex: NetRegexes.startsUsing({ id: '1F04', source: 'Hunter Of Bardam', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1F04', source: 'Bardams Jäger', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1F04', source: 'chasseur de Bardam', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1F04', source: 'バルダムズ・ハンター', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1F04', source: '巴儿达木的猎人', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Bardam\'s Mettle Sacrifice',
      netRegex: NetRegexes.startsUsing({ id: '1F01', source: 'Bardam', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1F01', source: 'Bardams Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1F01', source: 'Bardam', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1F01', source: 'バルダムの巨像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1F01', source: '巴儿达木巨像', capture: false }),
      infoText: {
        en: 'Stand in a tower',
        de: 'Im Turm stehen',
        fr: 'Tenez-vous dans une tour',
        cn: '踩塔',
        ko: '장판 들어가기',
      },
    },
    {
      // Bardam casts Comet repeatedly during this phase,
      // but 257D is used only once. The others are 257E.
      id: 'Bardam\'s Mettle Comet',
      netRegex: NetRegexes.startsUsing({ id: '257D', source: 'Bardam', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '257D', source: 'Bardams Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '257D', source: 'Bardam', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '257D', source: 'バルダムの巨像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '257D', source: '巴儿达木巨像', capture: false }),
      alertText: {
        en: '8x puddles on YOU',
        de: '8x Fläche auf DIR',
        fr: '8x Zones au sol sur VOUS',
        cn: '躲避8连追踪AOE',

      },
    },
    {
      id: 'Bardam\'s Mettle Meteor Impact',
      netRegex: NetRegexes.startsUsing({ id: '2582', source: 'Looming Shadow' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2582', source: 'Lauernd[a] Schatten' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2582', source: 'ombre grandissante' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2582', source: '落下地点' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2582', source: '坠落地点' }),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.castTime) - 7;
      },
      alertText: {
        en: 'Hide behind boulder',
        de: 'Hinter dem Brocken verstecken',
        fr: 'Cachez-vous derrière le rocher',
        cn: '站在陨石后',
      },
    },
    {
      id: 'Bardam\'s Mettle Wind Unbound',
      netRegex: NetRegexes.startsUsing({ id: '1F0A', source: 'Yol', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1F0A', source: 'Yol', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1F0A', source: 'Yol', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1F0A', source: 'ヨル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1F0A', source: '胡鹰', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Bardam\'s Mettle Flutterfall',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.deadBardam;
      },
      response: Responses.spread(),
    },
    {
      id: 'Bardam\'s Mettle Eye Of The Fierce',
      netRegex: NetRegexes.startsUsing({ id: '1F0D', source: 'Yol', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1F0D', source: 'Yol', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1F0D', source: 'Yol', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1F0D', source: 'ヨル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1F0D', source: '胡鹰', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Bardam\'s Mettle Wingbeat You',
      netRegex: NetRegexes.headMarker({ id: '0010' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Knockback Laser on YOU',
        de: 'Rückstoß-Laser auf DIR',
        fr: 'Poussée-laser sur VOUS',
        cn: '击退点名',
      },
    },
    {
      id: 'Bardam\'s Mettle Wingbeat Others',
      netRegex: NetRegexes.headMarker({ id: '0010' }),
      condition: Conditions.targetIsNotYou(),
      infoText: {
        en: 'Avoid Laser',
        de: 'Laser ausweichen',
        fr: 'Évitez le laser',
        cn: '躲避击退点名',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Yol': 'Yol',
        'Warrior Of Bardam': 'Bardams Krieger',
        'Throwing Spear': 'Wurfspeer',
        'Star Shard': 'Sternensplitter',
        'Looming Shadow': 'Lauernd[a] Schatten',
        'Hunter Of Bardam': 'Bardams Jäger',
        'Corpsecleaner Eagle': 'Leichenputzer',
        'Garula': 'Garula',
        '(?<! )Bardam(?!( |s))': 'Bardams Statue',
      },
      'replaceText': {
        'Wingbeat': 'Flügelschlag',
        'Wind Unbound': 'Entfesselter Wind',
        'War Cry': 'Kampfgebrüll',
        'Tremblor': 'Erdbeben',
        'Travail': 'Probe',
        'Sacrifice': 'Opfer',
        'Rush': 'Stürmen',
        'Reconstruct': 'Rekonstruieren',
        'Pinion': 'Flotter Fittich',
        'Meteor Impact': 'Meteoreinschlag',
        'Magnetism': 'Magnetismus',
        'Heavy Strike': 'Schwerer Schlag',
        'Heave': 'Hochhieven',
        'Flutterfall': 'Federsturm',
        'Feathercut': 'Federschnitt',
        'Eye of the Fierce': 'Grimmiger Blick',
        'Empty Gaze': 'Stierer Blick',
        'Earthquake': 'Erdbeben',
        'Crumbling Crust': 'Zerberstende Erde',
        'Comet Impact': 'Kometeneinschlag',
        'Comet(?! Impact)': 'Komet',
        'Charge': 'Sturm',
        'Bardam\'s Ring': 'Bardams Ring',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Yol(?! )': 'Yol',
        'Yol Feather': 'plume de Yol',
        'Warrior Of Bardam': 'guerrier de Bardam',
        'Voiceless Muse': 'la Muse sans voix',
        'Throwing Spear': 'lance de jet',
        'Star Shard': 'éclat d\'étoile',
        'Rebirth of Bardam the Brave': 'la Renaissance de Bardam le Brave',
        'Looming Shadow': 'ombre grandissante',
        'Hunter Of Bardam': 'chasseur de Bardam',
        'Corpsecleaner Eagle': 'aigle charognard',
        'Garula': 'Garula',
        '(?<! )Bardam(?!( |s))': 'Bardam',
        'Bardam\'s Hunt': 'la Chasse de Bardam',
      },
      'replaceText': {
        'Wingbeat': 'Battement d\'ailes',
        'Wind Unbound': 'Relâche de vent',
        'War Cry': 'Cri désorientant',
        'Tremblor': 'Tremblement de terre',
        'Travail': 'Labeur',
        'Sacrifice': 'Sacrifice',
        'Rush': 'Ruée',
        'Reconstruct': 'Reconstruction',
        'Pinion': 'Rémiges',
        'Meteor Impact': 'Impact de météore',
        'Magnetism': 'Magnétisme',
        'Heavy Strike': 'Frappe lourde',
        'Heave': 'Soulèvement',
        'Flutterfall': 'Tempête de plumes',
        'Feathercut': 'Coupe de plumes',
        'Eye of the Fierce': 'Œil de rapace',
        'Empty Gaze': 'Œil terne',
        'Earthquake': 'Tremblement de terre',
        'Crumbling Crust': 'Croûte croulante',
        'Comet Impact': 'Impact de comète',
        'Comet(?! Impact)': 'Comète',
        'Charge': 'Charge',
        'Bardam\'s Ring': 'Anneau de Bardam',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Yol': 'ヨル',
        'Warrior Of Bardam': 'バルダムズ・ウォーリアー',
        'Throwing Spear': '投げ槍',
        'Star Shard': '星片',
        'Looming Shadow': '落下地点',
        'Hunter Of Bardam': 'バルダムズ・ハンター',
        'Corpsecleaner Eagle': 'スカヴェンジング・イーグル',
        'Garula': 'ガルラ',
        '(?<! )Bardam(?!( |s))': 'バルダムの巨像',
      },
      'replaceText': {
        'Wingbeat': 'ウィングガスト',
        'Wind Unbound': 'ウィンドアンバウンド',
        'War Cry': '雄叫び',
        'Tremblor': '地震',
        'Travail': '試練',
        'Sacrifice': '犠牲',
        'Rush': '突進',
        'Reconstruct': '破壊再生',
        'Pinion': 'フェザーダーツ',
        'Meteor Impact': 'メテオインパクト',
        'Magnetism': '磁力',
        'Heavy Strike': 'ヘヴィストライク',
        'Heave': 'しゃくり上げ',
        'Flutterfall': 'フェザーストーム',
        'Feathercut': 'フェザーカッター',
        'Eye of the Fierce': '猛禽の眼',
        'Empty Gaze': '虚無の瞳',
        'Earthquake': '地震',
        'Crumbling Crust': '地盤崩し',
        'Comet Impact': 'コメットインパクト',
        'Comet(?! Impact)': 'コメット',
        'Charge': 'チャージ',
        'Bardam\'s Ring': 'バルダムリング',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Yol': '胡鹰',
        'Warrior Of Bardam': '巴儿达木的战士',
        'Throwing Spear': '投枪',
        'Star Shard': '星体碎片',
        'Looming Shadow': '坠落地点',
        'Hunter Of Bardam': '巴儿达木的猎人',
        'Corpsecleaner Eagle': '清道雄鹰',
        'Garula': '加鲁拉',
        '(?<! )Bardam(?!( |s))': '巴儿达木巨像',
      },
      'replaceText': {
        'Wingbeat': '翼唤狂风',
        'Wind Unbound': '无拘之风',
        'War Cry': '吼叫',
        'Tremblor': '地震',
        'Travail': '试炼',
        'Sacrifice': '牺牲',
        'Rush': '突进',
        'Reconstruct': '破坏再生',
        'Pinion': '飞羽镖',
        'Meteor Impact': '陨石冲击',
        'Magnetism': '磁力',
        'Heavy Strike': '灵极重击',
        'Heave': '掀地',
        'Flutterfall': '羽落如雨',
        'Feathercut': '飞羽斩',
        'Eye of the Fierce': '猛禽之眼',
        'Empty Gaze': '空洞之瞳',
        'Earthquake': '地震',
        'Crumbling Crust': '地面崩裂',
        'Comet Impact': '星屑冲击',
        'Comet(?! Impact)': '彗星',
        'Charge': '刺冲',
        'Bardam\'s Ring': '巴儿达木之环',
      },
    },
  ],
}];
