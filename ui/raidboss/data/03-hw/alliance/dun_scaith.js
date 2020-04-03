'use strict';

[{
  zoneRegex: {
    en: /^Dun Scaith$/,
    cn: /^影之国$/,
  },
  timelineFile: 'dun_scaith.txt',
  triggers: [
    // Basic stack occurs across all encounters except Deathgaze.
    {
      id: 'Dun Scaith Generic Stack-up',
      regex: Regexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    // DEATHGAZE
    {
      id: 'Dun Scaith Void Death Circle',
      regex: Regexes.startsUsing({ id: ['1C7F', '1C90'], source: 'Deathgaze Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['1C7F', '1C90'], source: 'Nihil-Thanatos', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['1C7F', '1C90'], source: 'Mortalis Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['1C7F', '1C90'], source: 'デスゲイズ・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['1C7F', '1C90'], source: '虚空死亡凝视', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['1C7F', '1C90'], source: '공허의 저승파수꾼', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Out of death circle',
        de: 'Raus aus den Todeskreisen',
        fr: 'Sortez du cercle de mort',
        cn: '离开圈内并扯断连线',
      },
    },
    {
      // Currently set up to just notify the healers/Bard to cleanse.
      // Or use / 16:\y{ObjectId}:Deathgaze Hollow:1C85:Doomsay:\y{ObjectId}:(\y{Name})
      // This would allow for notifying who needs cleansing directly, but might be spammy
      id: 'Dun Scaith Doom',
      regex: Regexes.startsUsing({ id: '1C8[45]', source: 'Deathgaze Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1C8[45]', source: 'Nihil-Thanatos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1C8[45]', source: 'Mortalis Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1C8[45]', source: 'デスゲイズ・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1C8[45]', source: '虚空死亡凝视', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1C8[45]', source: '공허의 저승파수꾼', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: {
        en: 'Cleanse Doom soon!',
        de: 'Verhängnis bald reinigen!',
        fr: 'Guerrissez Glas bientot',
        cn: '尽快驱散死亡宣告！',
      },
    },
    {
      // There's another Void Blizzard IV with ID 1C77, but it's not the timing we want
      // The actual knockback cast is Void Aero IV, but it gives only 2-3s warning.
      id: 'Dun Scaith Blizzard Pillars',
      regex: Regexes.startsUsing({ id: '1C8B', source: 'Deathgaze Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1C8B', source: 'Nihil-Thanatos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1C8B', source: 'Mortalis Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1C8B', source: 'デスゲイズ・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1C8B', source: '虚空死亡凝视', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1C8B', source: '공허의 저승파수꾼', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'Dun Scaith Void Sprite',
      regex: Regexes.addedCombatant({ name: 'Void Sprite', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Nichts-Exergon', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Élémentaire Du Vide', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ヴォイド・スプライト', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '虚无元精', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '보이드 정령', capture: false }),
      suppressSeconds: 10,
      infoText: {
        en: 'Kill sprites',
        de: 'Exergone töten',
        fr: 'Tuez les adds',
        cn: '击杀虚无元精',
      },
    },
    {
      id: 'Dun Scaith Aero 2',
      regex: Regexes.headMarker({ id: '0046' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Drop Tornado outside',
        de: 'Wirbel draußen ablegen',
        fr: 'Déposez les tornades à l\'extérieur',
        cn: '场地边缘放风圈',
      },
    },
    {
      // Deathgaze has two separate casts for this
      // Which one appears to depend on whether it's used alongside Bolt of Darkness
      // Mechanically the handling is the same
      id: 'Dun Scaith Aero 3',
      regex: Regexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'Deathgaze Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'Nihil-Thanatos', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'Mortalis Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'デスゲイズ・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['1C7B', '1C8D'], source: '虚空死亡凝视', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['1C7B', '1C8D'], source: '공허의 저승파수꾼', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'Dun Scaith Void Death Squares',
      regex: Regexes.startsUsing({ id: '1C82', source: 'Deathgaze Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1C82', source: 'Nihil-Thanatos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1C82', source: 'Mortalis Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1C82', source: 'デスゲイズ・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1C82', source: '虚空死亡凝视', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1C82', source: '공허의 저승파수꾼', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Avoid death squares',
        de: 'Weiche den Todes-Feldern aus',
        fr: 'Evitez les carrés mortels',
        cn: '离开即死区域',
      },
    },
    // FERDIAD
    {
      id: 'Dun Scaith Scythe Drop',
      regex: Regexes.headMarker({ id: '0017' }),
      suppressSeconds: 5,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Drop scythe outside',
            de: 'Sense draußen ablegen',
            fr: 'Posez à l\'extérieur',
            cn: '场地边缘放镰刀',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Jongleur\'s X',
      regex: Regexes.startsUsing({ id: '1C98', source: 'Ferdiad Hollow' }),
      regexDe: Regexes.startsUsing({ id: '1C98', source: 'Nihil-Ferdiad' }),
      regexFr: Regexes.startsUsing({ id: '1C98', source: 'Ferdiad Nihil' }),
      regexJa: Regexes.startsUsing({ id: '1C98', source: 'フェルディア・ホロー' }),
      regexCn: Regexes.startsUsing({ id: '1C98', source: '虚空弗迪亚' }),
      regexKo: Regexes.startsUsing({ id: '1C98', source: '공허의 페르디아' }),
      response: Responses.tankBuster(),
    },
    {
      // Wailing Atomos is blue, Cursed Atomos is yellow.
      // 1C9F:Aether is the circle AoE, 1CA0:Aetherial Chakram is the donut AoE
      id: 'Dun Scaith Blue Atomos',
      regex: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Wailing Atomos' }),
      regexDe: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Heul-Atomos' }),
      regexFr: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Gueule Gémissante' }),
      regexJa: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: '虚声のアトモス' }),
      regexCn: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: '虚声的阿托莫斯' }),
      regexKo: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: '허성의 아토모스' }),
      alertText: function(data, matches) {
        if (matches.id == '1C9F') {
          return {
            en: 'Avoid Untethered Blue',
            de: 'Weiche dem nicht verbundenen blauem Atomos aus',
            fr: 'Evitez Gueule bleue non-liée',
            cn: '远离蓝色小怪',
          };
        }
        if (matches.id == '1CA0') {
          return {
            en: 'Go to Untethered Blue',
            de: 'Gehe zu dem nicht verbundenen blauem Atomos',
            fr: 'Allez vers la Gueule bleue non-liée',
            cn: '靠近蓝色小怪',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Yellow Atomos',
      regex: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Cursing Atomos' }),
      regexDe: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Fluch-Atomos' }),
      regexFr: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Gueule Maudissante' }),
      regexJa: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: '怨声のアトモス' }),
      regexCn: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: '怨声的阿托莫斯' }),
      regexKo: Regexes.startsUsing({ id: ['1C9F', '1CA0'], target: '원성의 아토모스' }),
      alertText: function(data, matches) {
        if (matches.id == '1C9F') {
          return {
            en: 'Avoid Untethered Yellow',
            de: 'Weiche dem nicht verbundenen gelben Atomos aus',
            fr: 'Evitez Gueule jaune non-liée',
            cn: '远离黄色小怪',
          };
        }
        if (matches.id == '1CA0') {
          return {
            en: 'Go to Untethered Yellow',
            de: 'Gehe zu dem nicht verbundenen gelben Atomos',
            fr: 'Allez vers la Gueule jaune non-liée',
            cn: '靠近黄色小怪',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Blackfire',
      regex: Regexes.startsUsing({ id: '1CAA', source: 'Ferdiad Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1CAA', source: 'Nihil-Ferdiad', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1CAA', source: 'Ferdiad Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1CAA', source: 'フェルディア・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1CAA', source: '虚空弗迪亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1CAA', source: '공허의 페르디아', capture: false }),
      infoText: {
        en: 'Avoid puddles',
        de: 'Flächen ausweichen',
        fr: 'Evitez les zones au sol',
        cn: '离开圈圈',
      },
    },
    {
      // https://xivapi.com/Status/1137
      id: 'Dun Scaith Debilitator Fire',
      regex: Regexes.gainsEffect({ effect: 'Fire Resistance Down Ii', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Feuerresistenz - \\(Stark\\)', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Résistance Au Feu Réduite\\+', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '火属性耐性低下\\[強\\]', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '火属性耐性大幅降低', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '불속성 저항 감소\\[강\\]', capture: false }),
      suppressSeconds: 10,
      alertText: {
        en: 'Change puddles to water',
        de: 'Ändere Flächen zu Wasser',
        fr: 'Changez en eau',
        cn: '将地上的圈踩成蓝色',
      },
    },
    {
      // https://xivapi.com/Status/1157
      id: 'Dun Scaith Debilitator Water',
      regex: Regexes.gainsEffect({ effect: 'Water Resistance Down Ii', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserresistenz - \\(Stark\\)', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Résistance À L\'Eau Réduite\\+', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '水属性耐性低下［強］', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '水属性耐性大幅降低', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 저항 감소\\[강\\]', capture: false }),
      suppressSeconds: 10,
      alertText: {
        en: 'Change puddles to fire',
        de: 'Ändere Flächen zu Feuer',
        fr: 'Changez en feu',
        cn: '将地上的圈踩成红色',
      },
    },
    // PROTO-ULTIMA
    {
      // The trident laser is a series of three separate casts
      // Each has an incremental ID: 1D96, 1D97, 1D98
      id: 'Dun Scaith Aetherochemical Laser',
      regex: Regexes.startsUsing({ id: '1D96', source: 'Proto Ultima', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1D96', source: 'Proto-Ultima', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1D96', source: 'Proto-Ultima', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1D96', source: 'プロトアルテマ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1D96', source: '究极神兵原型', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1D96', source: '프로토 알테마', capture: false }),
      infoText: {
        en: 'Dodge trident laser',
        de: 'Weiche dem Laser aus',
        fr: 'Evitez le laser',
        cn: '躲避三向激光',
      },
    },
    {
      // Handles both 1E52 Aetherochemical Flare and 1D9D Supernova
      id: 'Dun Scaith Proto-Ultima Raid Damage',
      regex: Regexes.startsUsing({ id: ['1E52', '1D9D'], source: 'Proto Ultima', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['1E52', '1D9D'], source: 'Proto-Ultima', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['1E52', '1D9D'], source: 'Proto-Ultima', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['1E52', '1D9D'], source: 'プロトアルテマ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['1E52', '1D9D'], source: '究极神兵原型', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['1E52', '1D9D'], source: '프로토 알테마', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Dun Scaith Prey Markers',
      regex: Regexes.gainsEffect({ effect: 'Prey' }),
      regexDe: Regexes.gainsEffect({ effect: 'Markiert' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marquage' }),
      regexJa: Regexes.gainsEffect({ effect: 'マーキング' }),
      regexCn: Regexes.gainsEffect({ effect: '猎物' }),
      regexKo: Regexes.gainsEffect({ effect: '표식' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Prey--Avoid party and keep moving',
            de: 'Markiert - Weg von der Gruppe und bleib in Bewegung',
            fr: 'Marquage - Evitez les autres et bougez',
            cn: '离开人群并保持移动',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Flare Star',
      regex: Regexes.startsUsing({ id: '1DA4', source: 'Proto Ultima', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1DA4', source: 'Proto-Ultima', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1DA4', source: 'Proto-Ultima', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1DA4', source: 'プロトアルテマ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1DA4', source: '究极神兵原型', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1DA4', source: '프로토 알테마', capture: false }),
      preRun: function(data) {
        data.flareStarCount = (data.flareStarCount || 0) + 1;
      },
      suppressSeconds: 1,
      alertText: function(data) {
        if (data.flareStarCount == 1) {
          return {
            en: 'Out of center--Wait for outer ring then keep going',
            de: 'Raus aus der Mitte - Warte auf den äuseren Ring',
            fr: 'Loin du centre - Attendez l\'anneau extérieur et continuez',
            cn: '远离中心--在外圈内等待再进行移动',
          };
        }
        return {
          en: 'Avoid flares--Wait for outer ring then keep going',
          de: 'Flares ausweichen - Warte auf den äuseren Ring',
          fr: 'Evitez les explosions - Attendez l\'anneau extérieur et continuez',
          cn: '避免爆炸--在外圈内等待再进行移动',
        };
      },
    },
    {
      id: 'Dun Scaith Citadel Buster',
      regex: Regexes.startsUsing({ id: '1DAB', source: 'Proto Ultima', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1DAB', source: 'Proto-Ultima', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1DAB', source: 'Proto-Ultima', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1DAB', source: 'プロトアルテマ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1DAB', source: '究极神兵原型', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1DAB', source: '프로토 알테마', capture: false }),
      alertText: {
        en: 'Avoid line AoE',
        de: 'Weiche der Linien AoE aus',
        fr: 'Evitez l\'AoE en ligne',
        cn: '躲避直线AOE',
      },
    },
    {
      // Triggering off the Bit appearance
      // The cast time on Aetheromodulator is under 3 seconds
      id: 'Dun Scaith Bit Circles',
      regex: Regexes.addedCombatant({ name: 'Proto Bit', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Proto-Drohne', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Proto-Foret', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'プロトビット', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '原型浮游炮', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '프로토 비트', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid Bit AoEs',
        de: 'Weiche den Bit AoEs aus',
        fr: 'Evitez les AoE des forets',
        cn: '躲避小型AOE',
      },
    },
    {
      id: 'Dun Scaith Aether Collectors',
      regex: Regexes.addedCombatant({ name: 'Aether Collector', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Ätherakkumulator', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Accumulateur D\'Éther', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'エーテル集積器', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '以太收集器', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '에테르 집적기', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Kill collectors',
        de: 'Ätherakkumulator besiegen',
        fr: 'Détruisez les accumulateurs',
        cn: '击杀以太收集器',
      },
    },
    // SCATHACH
    {
      // The actual attack is 1D20, but the castbar windup is 1D1F
      id: 'Dun Scaith Shadespin',
      regex: Regexes.startsUsing({ id: '1D1[EF]', source: 'Scathach', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1D1[EF]', source: 'Scathach', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1D1[EF]', source: 'Scáthach', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1D1[EF]', source: 'スカアハ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1D1[EF]', source: '斯卡哈', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1D1[EF]', source: '스카하크', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid arm slaps',
        de: 'Weiche den Armschlägen aus',
        fr: 'Evitez les bras',
        cn: '站在boss背后方向',
      },
    },
    {
      id: 'Dun Scaith Thirty Thorns',
      regex: Regexes.ability({ id: '1D[12]B', source: 'Scathach', capture: false }),
      regexDe: Regexes.ability({ id: '1D[12]B', source: 'Scathach', capture: false }),
      regexFr: Regexes.ability({ id: '1D[12]B', source: 'Scáthach', capture: false }),
      regexJa: Regexes.ability({ id: '1D[12]B', source: 'スカアハ', capture: false }),
      regexCn: Regexes.ability({ id: '1D[12]B', source: '斯卡哈', capture: false }),
      regexKo: Regexes.ability({ id: '1D[12]B', source: '스카하크', capture: false }),
      suppressSeconds: 5,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Dun Scaith Thirty Arrows',
      regex: Regexes.startsUsing({ id: '1D2F', source: 'Scathach', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1D2F', source: 'Scathach', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1D2F', source: 'Scáthach', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1D2F', source: 'スカアハ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1D2F', source: '斯卡哈', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1D2F', source: '스카하크', capture: false }),
      infoText: {
        en: 'Avoid line AoEs',
        de: 'Weiche den Linien AoEs aus',
        fr: 'Evitez les AoE en ligne',
        cn: '躲开boss正面路线',
      },
    },
    {
      id: 'Dun Scaith Thirty Souls',
      regex: Regexes.startsUsing({ id: '1D32', source: 'Scathach', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1D32', source: 'Scathach', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1D32', source: 'Scáthach', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1D32', source: 'スカアハ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1D32', source: '斯卡哈', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1D32', source: '스카하크', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      // Ordinarily we wouldn't use a game log line for this.
      // However, the RP text seems to be the only indicator.
      id: 'Dun Scaith Shadow Links',
      regex: Regexes.message({ line: 'Shadows gather on the floor', capture: false }),
      regexDe: Regexes.message({ line: 'Schatten sammeln sich auf dem Boden', capture: false }),
      regexFr: Regexes.message({ line: 'Le pouvoir des ombres se concentre sur le sol', capture: false }),
      regexJa: Regexes.message({ line: '床に影の力が集束していく', capture: false }),
      regexCn: Regexes.message({ line: '影之力正在向地面聚集', capture: false }),
      regexKo: Regexes.message({ line: '바닥에 그림자의 힘이 모여듭니다', capture: false }),
      suppressSeconds: 5,
      response: Responses.stopMoving(),
    },
    {
      id: 'Dun Scaith Shadow Limb Spawn',
      regex: Regexes.addedCombatant({ name: 'Shadow Limb', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Schattenhand', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Main Ombrale', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '影の手', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '影之手', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '그림자 손', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Kill the hands',
        de: 'Besiege die Hand',
        fr: 'Tuez les mains',
        cn: '击杀影之手',
      },
    },
    {
      id: 'Dun Scaith Connla Spawn',
      regex: Regexes.startsUsing({ id: '1CD1', source: 'Connla', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1CD1', source: 'Connla', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1CD1', source: 'Connla', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1CD1', source: 'コンラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1CD1', source: '康拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1CD1', source: '콘라', capture: false }),
      alertText: {
        en: 'Avoid AoE, Kill Connla',
        de: 'Weiche AoE aus, besiege Connla',
        fr: 'Evitez les AoE, tuez Connla',
        cn: '躲避AOE后击杀康拉',
      },
    },
    // These triggers are common to both Scathach and Diabolos
    {
      id: 'Dun Scaith Nox Orbs',
      regex: Regexes.headMarker({ id: '005C' }),
      suppressSeconds: 5,
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Take orb outside',
            de: 'Orb nach außen bringen',
            fr: 'Prenez l\'orb à l\'extérieur',
            cn: '把球带出人群，移动到球不再出现为止',
          };
        }
      },
    },
    {
      id: 'Dun Scaith Shadethrust',
      regex: Regexes.startsUsing({ id: ['1D23', '1C1A'], source: ['Scathach', 'Diabolos Hollow'], capture: false }),
      regexDe: Regexes.startsUsing({ id: ['1D23', '1C1A'], source: ['Scathach', 'Nihil-Diabolos'], capture: false }),
      regexFr: Regexes.startsUsing({ id: ['1D23', '1C1A'], source: ['Scáthach', 'Diabolos Nihil'], capture: false }),
      regexJa: Regexes.startsUsing({ id: ['1D23', '1C1A'], source: ['スカアハ', 'ディアボロス・ホロー'], capture: false }),
      regexCn: Regexes.startsUsing({ id: ['1D23', '1C1A'], source: ['斯卡哈', '虚空迪亚波罗斯'], capture: false }),
      regexKo: Regexes.startsUsing({ id: ['1D23', '1C1A'], source: ['스카하크', '공허의 디아볼로스'], capture: false }),
      response: Responses.awayFromFront(),
    },
    // DIABOLOS
    {
      id: 'Dun Scaith Ultimate Terror',
      regex: Regexes.startsUsing({ id: '1C12', source: 'Diabolos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1C12', source: 'Diabolos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1C12', source: 'Diabolos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1C12', source: 'ディアボロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1C12', source: '迪亚波罗斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1C12', source: '디아볼로스', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Dun Scaith Nightmare',
      regex: Regexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      regexDe: Regexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      regexFr: Regexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      regexJa: Regexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      regexCn: Regexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      regexKo: Regexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Dun Scaith Noctoshield',
      regex: Regexes.gainsEffect({ target: 'Diabolos', effect: 'Noctoshield', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Diabolos', effect: 'Nachtschild', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Diabolos', effect: 'Nocto-Bouclier', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ディアボロス', effect: 'ノクトシールド', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '迪亚波罗斯', effect: '夜障', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '디아볼로스', effect: '밤의 방패', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Boss hitting hard--Shield/Mitigate',
        de: 'Harter Hit vom Boss - Schild/Milderung',
        fr: 'Le boss frappe fort - Bouclier/Mitigation',
        cn: 'MT大伤害物理死刑—注意减伤/治疗盾',
      },
    },
    {
      id: 'Dun Scaith Ruinous Omen',
      regex: Regexes.startsUsing({ id: '1C1[01]', source: 'Diabolos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1C1[01]', source: 'Diabolos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1C1[01]', source: 'Diabolos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1C1[01]', source: 'ディアボロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1C1[01]', source: '迪亚波罗斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1C1[01]', source: '디아볼로스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Dun Scaith Deathgates',
      regex: Regexes.addedCombatant({ name: 'Deathgate', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Tor Des Todes', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Porte De Mort', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '召喚の扉', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '召唤之门', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '소환의 문', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Kill the deathgates',
        de: 'Besiege die Tore des Todes',
        fr: 'Détruisez les portes de mort',
        cn: '击杀召唤之门',
      },
    },
    {
      id: 'Dun Scaith Camisado',
      regex: Regexes.startsUsing({ id: '1C19', source: 'Diabolos Hollow' }),
      regexDe: Regexes.startsUsing({ id: '1C19', source: 'Nihil-Diabolos' }),
      regexFr: Regexes.startsUsing({ id: '1C19', source: 'Diabolos Nihil' }),
      regexJa: Regexes.startsUsing({ id: '1C19', source: 'ディアボロス・ホロー' }),
      regexCn: Regexes.startsUsing({ id: '1C19', source: '虚空迪亚波罗斯' }),
      regexKo: Regexes.startsUsing({ id: '1C19', source: '공허의 디아볼로스' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Dun Scaith Hollow Night',
      regex: Regexes.headMarker({ id: '005B' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Gaze stack on YOU',
            de: 'Blick-Sammeln auf DIR',
            fr: 'Package sur VOUS',
            cn: '点名分摊',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target) + ' and look away',
          de: 'Sammeln bei ' + data.ShortName(matches.target) + ' und wewg schauen',
          fr: 'Package sur ' + data.ShortName(matches.target) + ' et regardez ailleurs',
          cn: '靠近并背对' + data.ShortName(matches.target) + '分摊',
        };
      },
    },
    {
      id: 'Dun Scaith Hollow Omen',
      regex: Regexes.startsUsing({ id: '1C2[23]', source: 'Diabolos Hollow', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1C2[23]', source: 'Nihil-Diabolos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1C2[23]', source: 'Diabolos Nihil', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1C2[23]', source: 'ディアボロス・ホロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1C2[23]', source: '虚空迪亚波罗斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1C2[23]', source: '공허의 디아볼로스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      // This is the tank version of the stack marker. It has minimal circular bordering
      id: 'Dun Scaith Blindside',
      regex: Regexes.headMarker({ id: '005D' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Dun Scaith Earth Shaker',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      response: Responses.earthshaker(),
    },
  ],
},
];
