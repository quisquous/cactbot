'use strict';

[{
  zoneId: ZoneId.TheFractalContinuumHard,
  timelineFile: 'fractal_continuum_hard.txt',
  timelineTriggers: [
    {
      // Technically this one has a cast time, but it's less than a GCD.
      // Safer to warn via timeline.
      id: 'Fractal Hard Diffractive Laser',
      regex: /Diffractive Laser/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'Fractal Hard Swipe Servo',
      netRegex: NetRegexes.startsUsing({ id: '2AE5', source: 'Servomechanical Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2AE5', source: 'Servomechanisch(?:e|er|es|en) Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2AE5', source: 'Minotaure Servomécanique', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2AE5', source: 'サーヴォ・ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2AE5', source: '自控化弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2AE5', source: '자동제어 미노타우로스', capture: false }),
      infoText: {
        en: 'swipe',
        de: 'Hieb',
        fr: 'Fauche',
        ja: 'スワイプ',
        cn: '去目标背后',
        ko: '전방 피하기',
      },
    },
    {
      id: 'Fractal Hard Swipe Bio',
      netRegex: NetRegexes.startsUsing({ id: '29A2', source: 'Biomanufactured Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '29A2', source: 'Biotech-Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '29A2', source: 'Minotaure Biologique', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '29A2', source: 'バイオ・ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '29A2', source: '生化弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '29A2', source: '양산체 미노타우로스', capture: false }),
      infoText: {
        en: 'swipe',
        de: 'Hieb',
        fr: 'Fauche',
        ja: 'スワイプ',
        cn: '去目标背后',
        ko: '전방 피하기',
      },
    },
    {
      id: 'Fractal Hard Swing Servo',
      netRegex: NetRegexes.startsUsing({ id: '2AE4', source: 'Servomechanical Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2AE4', source: 'Servomechanisch(?:e|er|es|en) Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2AE4', source: 'Minotaure Servomécanique', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2AE4', source: 'サーヴォ・ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2AE4', source: '自控化弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2AE4', source: '자동제어 미노타우로스', capture: false }),
      alertText: {
        en: 'Swing',
        de: 'Schwung',
        fr: 'Swing',
        ja: 'スウィング',
        cn: '远离目标',
        ko: '밖으로',
      },
    },
    {
      id: 'Fractal Hard Swing Bio',
      netRegex: NetRegexes.startsUsing({ id: '29A1', source: 'Biomanufactured Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '29A1', source: 'Biotech-Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '29A1', source: 'Minotaure Biologique', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '29A1', source: 'バイオ・ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '29A1', source: '生化弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '29A1', source: '양산체 미노타우로스', capture: false }),
      alertText: {
        en: 'Swing',
        de: 'Schwung',
        fr: 'Swing',
        ja: 'スウィング',
        cn: '远离目标',
        ko: '밖으로',
      },
    },
    {
      id: 'Fractal Hard Dragon Voice',
      netRegex: NetRegexes.startsUsing({ id: '861', source: 'Servomechanical Chimera', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '861', source: 'Servomechanisch(?:e|er|es|en) Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '861', source: 'Chimère Servomécanique', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '861', source: 'サーヴォ・キマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '861', source: '自控化奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '861', source: '자동제어 키마이라', capture: false }),
      alertText: {
        en: 'Dragon\'s Voice',
        de: 'Stimme Des Drachen',
        fr: 'Voix Du Dragon',
        ja: '雷電の咆哮',
        cn: '靠近奇美拉',
        ko: '뇌전의 포효',
      },
    },
    {
      id: 'Fractal Hard Ram Voice Servo',
      netRegex: NetRegexes.startsUsing({ id: '860', source: 'Servomechanical Chimera', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '860', source: 'Servomechanisch(?:e|er|es|en) Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '860', source: 'Chimère Servomécanique', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '860', source: 'サーヴォ・キマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '860', source: '自控化奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '860', source: '자동제어 키마이라', capture: false }),
      alertText: {
        en: 'Ram\'s Voice',
        de: 'Stimme Des Widders',
        fr: 'Voix Du Bélier',
        ja: '氷結の咆哮',
        cn: '远离奇美拉',
        ko: '빙결의 포효',
      },
    },
    {
      id: 'Fractal Hard Ram Voice Proto',
      netRegex: NetRegexes.startsUsing({ id: '860', source: 'Proto-Chimera', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '860', source: 'Proto-Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '860', source: 'protochimère', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '860', source: 'プロトキマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '860', source: '原型奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '860', source: '프로토 키마이라', capture: false }),
      alertText: {
        en: 'Ram\'s Voice',
        de: 'Stimme Des Widders',
        fr: 'Voix Du Bélier',
        ja: '氷結の咆哮',
        cn: '远离奇美拉',
        ko: '빙결의 포효',
      },
    },
    {
      id: 'Fractal Hard Citadel Buster Motherbit',
      regex: Regexes.startsUsing({ id: '27A5', source: 'Motherbit', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Fractal Hard Aetheroplasm',
      regex: Regexes.startsUsing({ id: '2793', source: 'The Ultima Warrior' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Fractal Hard Citadel Buster Warrior',
      regex: Regexes.startsUsing({ id: '2792', source: 'The Ultima Warrior', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Fractal Hard Ceruleum Vent',
      regex: Regexes.startsUsing({ id: '2794', source: 'The Ultima Warrior', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Fractal Hard Ratzon',
      netRegex: NetRegexes.headMarker({ id: '0046' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Puddle on YOU',
        cn: '圈圈点名',

      },
    },
    {
      id: 'Fractal Hard Dischord Collect',
      netRegex: NetRegexes.headMarker({ id: ['004D', '004E'] }),
      run: function(data, matches) {
        data[matches.id] = matches.target;
      },
    },
    {
      id: 'Fractal Hard Dischord Resolve',
      netRegex: NetRegexes.headMarker({ id: ['004D', '004E'] }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      infoText: function(data, matches) {
        const partner = matches.id === '004D' ? '004E' : '004D';
        // If for some reason there is no partner, we get a vulnerability or bleed and are sad.
        if (!data[partner])
          return;
        return {
          en: 'Stack with ' + data.shortName(data[partner]),
          cn: '靠近' + data.shortName(data[partner]) + '集合',
        };
      },
    },
    {
      id: 'Fractal Hard Dischord Cleanup',
      netRegex: NetRegexes.headMarker({ id: ['004D', '004F'], capture: false }),
      delaySeconds: 2,
      suppressSeconds: 2,
      run: function(data) {
        for (const el of ['004D', '004F'])
          delete data[el];
      },
    },
    {
      id: 'Fractal Hard Mass Aetheroplasm',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      // 477 is Infinite Fire, 478 is Infinite Ice
      id: 'Fractal Hard Infinite Elements',
      netRegex: NetRegexes.gainsEffect({ effectId: ['477', '478'] }),
      condition: Conditions.targetIsYou(),
      // The circles don't come up until the Ceruleum Vent cast.
      // Rather than doing collection nonsense to be used on the Ceruleum cast,
      // it's better to just delay, since it's always a consistent 8 seconds
      // from the time effects are applied until the circles come up.
      delaySeconds: 8,
      infoText: function(data, matches) {
        if (matches.effectId === '477') {
          return {
            en: 'Stand on red circle',
            cn: '站在红圈',
          };
        }
        return {
          en: 'Stand on blue circle',
          cn: '站在蓝圈',
        };
      },
    },
    {
      id: 'Fractal Hard Death Spin',
      netRegex: NetRegexes.startsUsing({ id: ['27AD', '27AE'], source: 'The Ultima Beast', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['27AD', '27AE'], source: 'Ultimativ(?:e|er|es|en) Bestie', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['27AD', '27AE'], source: 'Ultima-Monstre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['27AD', '27AE'], source: 'アルテマビースト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['27AD', '27AE'], source: '究极神兽', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['27AD', '27AE'], source: '알테마 비스트', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Fractal Hard Aether Bend',
      netRegex: NetRegexes.startsUsing({ id: ['27AF', '27B0'], source: 'The Ultima Beast', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['27AF', '27B0'], source: 'Ultimativ(?:e|er|es|en) Bestie', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['27AF', '27B0'], source: 'Ultima-Monstre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['27AF', '27B0'], source: 'アルテマビースト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['27AF', '27B0'], source: '究极神兽', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['27AF', '27B0'], source: '알테마 비스트', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Fractal Hard Allagan Gravity',
      netRegex: NetRegexes.startsUsing({ id: '27B5', source: 'The Ultima Beast', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27B5', source: 'Ultimativ(?:e|er|es|en) Bestie', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27B5', source: 'Ultima-Monstre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27B5', source: 'アルテマビースト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27B5', source: '究极神兽', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27B5', source: '알테마 비스트', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'Fractal Hard Demi Ultima',
      netRegex: NetRegexes.startsUsing({ id: '27B2', source: 'The Ultima Beast', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27B2', source: 'Ultimativ(?:e|er|es|en) Bestie', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27B2', source: 'Ultima-Monstre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27B2', source: 'アルテマビースト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27B2', source: '究极神兽', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27B2', source: '알테마 비스트', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Fractal Hard Allagan Flare',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      response: Responses.awayFrom(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'Motherbit': '浮游炮主板',
        'Prototype Bit': '原型浮游炮',
        'The Ultima Warrior': '究极战士',
        'Vocal Guidance System': '语音向导',
        'The Ultima Beast': '究极神兽',
        'This humanoid prototype can perfectly replicate': '我们研究出了如何利用斗神力量的方法！',
        'Utilizing our data on Sophia': '利用斗神的力量去征服斗神！',
        'Successfully mimicking the Demon Zurvan': '随着对鬼神祖尔宛力量的应用，',
        'The reality augmentation bay': '现实增强室',
        'Exhibit level VIII': '第八展示区',
        'Genesis Engine': '启动试验室',
      },
      'replaceText': {
        'Electrochemical Transfer': '雷力供给',
        'Aetherochemical Laser': '魔科学激光',
        'Diffractive Laser': '扩散射线',
        'Allagan Gravity': '亚拉戈重力',
        'Citadel Buster': '攻城炮',
        '(?<! )Aetheroplasm': '以太爆雷',
        'Ceruleum Vent': '青磷放射',
        'Primordial Aether': '荒蛮以太',
        'Infinite Fire/Infinite Ice': '炎之刻印/冰之刻印',
        'Ratzon': '意志',
        'Mass Aetheroplasm': '大型以太爆雷',
        'Dischordant Cleansing': '不平衡之罚',
        'Northern Star/Southern Star': '北极星/南极星',
        'Death Spin': '死亡回旋',
        'Aether Bend': '以太曲折',
        'Flare Star': '耀星',
        'Light Pillar': '光柱',
        'Forborn Beast': '后天野兽',
        'Demi Ultima': '亚究极',
        'Allagan Flare': '亚拉戈核爆',
      },
    },
  ],
}];
