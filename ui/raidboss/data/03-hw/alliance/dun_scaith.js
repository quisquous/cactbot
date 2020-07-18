'use strict';

[{
  zoneRegex: {
    en: /^Dun Scaith$/,
    cn: /^影之国$/,
  },
  zoneId: ZoneId.DunScaith,
  timelineNeedsFixing: true,
  timelineFile: 'dun_scaith.txt',
  triggers: [
    // Basic stack occurs across all encounters except Deathgaze.
    {
      id: 'Dun Scaith Generic Stack-up',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    // DEATHGAZE
    {
      id: 'Dun Scaith Void Death Circle',
      netRegex: NetRegexes.startsUsing({ id: ['1C7F', '1C90'], source: 'Deathgaze Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C7F', '1C90'], source: 'Nihil-Thanatos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C7F', '1C90'], source: 'Mortalis Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C7F', '1C90'], source: 'デスゲイズ・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C7F', '1C90'], source: '虚空死亡凝视', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1C7F', '1C90'], source: '공허의 저승파수꾼', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1C8[45]', source: 'Deathgaze Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C8[45]', source: 'Nihil-Thanatos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C8[45]', source: 'Mortalis Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C8[45]', source: 'デスゲイズ・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C8[45]', source: '虚空死亡凝视', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C8[45]', source: '공허의 저승파수꾼', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1C8B', source: 'Deathgaze Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C8B', source: 'Nihil-Thanatos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C8B', source: 'Mortalis Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C8B', source: 'デスゲイズ・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C8B', source: '虚空死亡凝视', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C8B', source: '공허의 저승파수꾼', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'Dun Scaith Void Sprite',
      netRegex: NetRegexes.addedCombatant({ name: 'Void Sprite', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Nichts-Exergon', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Élémentaire Du Vide', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ヴォイド・スプライト', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '虚无元精', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '보이드 정령', capture: false }),
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
      netRegex: NetRegexes.headMarker({ id: '0046' }),
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
      netRegex: NetRegexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'Deathgaze Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'Nihil-Thanatos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'Mortalis Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C7B', '1C8D'], source: 'デスゲイズ・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C7B', '1C8D'], source: '虚空死亡凝视', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1C7B', '1C8D'], source: '공허의 저승파수꾼', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'Dun Scaith Void Death Squares',
      netRegex: NetRegexes.startsUsing({ id: '1C82', source: 'Deathgaze Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C82', source: 'Nihil-Thanatos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C82', source: 'Mortalis Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C82', source: 'デスゲイズ・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C82', source: '虚空死亡凝视', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C82', source: '공허의 저승파수꾼', capture: false }),
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
      netRegex: NetRegexes.headMarker({ id: '0017' }),
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
      netRegex: NetRegexes.startsUsing({ id: '1C98', source: 'Ferdiad Hollow' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C98', source: 'Nihil-Ferdiad' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C98', source: 'Ferdiad Nihil' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C98', source: 'フェルディア・ホロー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C98', source: '虚空弗迪亚' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C98', source: '공허의 페르디아' }),
      response: Responses.tankBuster(),
    },
    {
      // Wailing Atomos is blue, Cursed Atomos is yellow.
      // 1C9F:Aether is the circle AoE, 1CA0:Aetherial Chakram is the donut AoE
      id: 'Dun Scaith Blue Atomos',
      netRegex: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Wailing Atomos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Heul-Atomos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Gueule Gémissante' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: '虚声のアトモス' }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: '虚声的阿托莫斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: '허성의 아토모스' }),
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
      netRegex: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Cursing Atomos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Fluch-Atomos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: 'Gueule Maudissante' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: '怨声のアトモス' }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: '怨声的阿托莫斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1C9F', '1CA0'], target: '원성의 아토모스' }),
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
      netRegex: NetRegexes.startsUsing({ id: '1CAA', source: 'Ferdiad Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1CAA', source: 'Nihil-Ferdiad', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1CAA', source: 'Ferdiad Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1CAA', source: 'フェルディア・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CAA', source: '虚空弗迪亚', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1CAA', source: '공허의 페르디아', capture: false }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '471', capture: false }),
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
      netRegex: NetRegexes.gainsEffect({ effectId: '485', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1D96', source: 'Proto Ultima', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1D96', source: 'Proto-Ultima', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1D96', source: 'Proto-Ultima', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1D96', source: 'プロトアルテマ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1D96', source: '究极神兵原型', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1D96', source: '프로토 알테마', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: ['1E52', '1D9D'], source: 'Proto Ultima', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1E52', '1D9D'], source: 'Proto-Ultima', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1E52', '1D9D'], source: 'Proto-Ultima', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1E52', '1D9D'], source: 'プロトアルテマ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1E52', '1D9D'], source: '究极神兵原型', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1E52', '1D9D'], source: '프로토 알테마', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Dun Scaith Prey Markers',
      netRegex: NetRegexes.gainsEffect({ effectId: '232' }),
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
      netRegex: NetRegexes.startsUsing({ id: '1DA4', source: 'Proto Ultima', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1DA4', source: 'Proto-Ultima', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1DA4', source: 'Proto-Ultima', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1DA4', source: 'プロトアルテマ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1DA4', source: '究极神兵原型', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1DA4', source: '프로토 알테마', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1DAB', source: 'Proto Ultima', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1DAB', source: 'Proto-Ultima', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1DAB', source: 'Proto-Ultima', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1DAB', source: 'プロトアルテマ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1DAB', source: '究极神兵原型', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1DAB', source: '프로토 알테마', capture: false }),
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
      netRegex: NetRegexes.addedCombatant({ name: 'Proto Bit', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Proto-Drohne', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Proto-Foret', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'プロトビット', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '原型浮游炮', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '프로토 비트', capture: false }),
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
      netRegex: NetRegexes.addedCombatant({ name: 'Aether Collector', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Ätherakkumulator', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Accumulateur D\'Éther', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'エーテル集積器', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '以太收集器', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '에테르 집적기', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1D1[EF]', source: 'Scathach', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1D1[EF]', source: 'Scathach', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1D1[EF]', source: 'Scáthach', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1D1[EF]', source: 'スカアハ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1D1[EF]', source: '斯卡哈', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1D1[EF]', source: '스카하크', capture: false }),
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
      netRegex: NetRegexes.ability({ id: '1D[12]B', source: 'Scathach', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1D[12]B', source: 'Scathach', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1D[12]B', source: 'Scáthach', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1D[12]B', source: 'スカアハ', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1D[12]B', source: '斯卡哈', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '1D[12]B', source: '스카하크', capture: false }),
      suppressSeconds: 5,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Dun Scaith Thirty Arrows',
      netRegex: NetRegexes.startsUsing({ id: '1D2F', source: 'Scathach', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1D2F', source: 'Scathach', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1D2F', source: 'Scáthach', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1D2F', source: 'スカアハ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1D2F', source: '斯卡哈', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1D2F', source: '스카하크', capture: false }),
      infoText: {
        en: 'Avoid line AoEs',
        de: 'Weiche den Linien AoEs aus',
        fr: 'Evitez les AoE en ligne',
        cn: '躲开boss正面路线',
      },
    },
    {
      id: 'Dun Scaith Thirty Souls',
      netRegex: NetRegexes.startsUsing({ id: '1D32', source: 'Scathach', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1D32', source: 'Scathach', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1D32', source: 'Scáthach', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1D32', source: 'スカアハ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1D32', source: '斯卡哈', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1D32', source: '스카하크', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      // Ordinarily we wouldn't use a game log line for this.
      // However, the RP text seems to be the only indicator.
      id: 'Dun Scaith Shadow Links',
      netRegex: NetRegexes.message({ line: 'Shadows gather on the floor.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: 'Schatten sammeln sich auf dem Boden.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: 'Le pouvoir des ombres se concentre sur le sol.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '床に影の力が集束していく.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '影之力正在向地面聚集.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '바닥에 그림자의 힘이 모여듭니다.*?', capture: false }),
      suppressSeconds: 5,
      response: Responses.stopMoving(),
    },
    {
      id: 'Dun Scaith Shadow Limb Spawn',
      netRegex: NetRegexes.addedCombatant({ name: 'Shadow Limb', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Schattenhand', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Main Ombrale', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '影の手', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '影之手', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '그림자 손', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1CD1', source: 'Connla', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1CD1', source: 'Connla', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1CD1', source: 'Connla', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1CD1', source: 'コンラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CD1', source: '康拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1CD1', source: '콘라', capture: false }),
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
      netRegex: NetRegexes.headMarker({ id: '005C' }),
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
      netRegex: NetRegexes.startsUsing({ id: ['1D23', '1C1A'], source: ['Scathach', 'Diabolos Hollow'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1D23', '1C1A'], source: ['Scathach', 'Nihil-Diabolos'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1D23', '1C1A'], source: ['Scáthach', 'Diabolos Nihil'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1D23', '1C1A'], source: ['スカアハ', 'ディアボロス・ホロー'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1D23', '1C1A'], source: ['斯卡哈', '虚空迪亚波罗斯'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1D23', '1C1A'], source: ['스카하크', '공허의 디아볼로스'], capture: false }),
      response: Responses.awayFromFront(),
    },
    // DIABOLOS
    {
      id: 'Dun Scaith Ultimate Terror',
      netRegex: NetRegexes.startsUsing({ id: '1C12', source: 'Diabolos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C12', source: 'Diabolos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C12', source: 'Diabolos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C12', source: 'ディアボロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C12', source: '迪亚波罗斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C12', source: '디아볼로스', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Dun Scaith Nightmare',
      netRegex: NetRegexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1C0E', '1C20'], capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Dun Scaith Noctoshield',
      netRegex: NetRegexes.gainsEffect({ target: 'Diabolos', effectId: '1AA', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1C1[01]', source: 'Diabolos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C1[01]', source: 'Diabolos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C1[01]', source: 'Diabolos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C1[01]', source: 'ディアボロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C1[01]', source: '迪亚波罗斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C1[01]', source: '디아볼로스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Dun Scaith Deathgates',
      netRegex: NetRegexes.addedCombatant({ name: 'Deathgate', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Tor Des Todes', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Porte De Mort', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '召喚の扉', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '召唤之门', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '소환의 문', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '1C19', source: 'Diabolos Hollow' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C19', source: 'Nihil-Diabolos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C19', source: 'Diabolos Nihil' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C19', source: 'ディアボロス・ホロー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C19', source: '虚空迪亚波罗斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C19', source: '공허의 디아볼로스' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Dun Scaith Hollow Night',
      netRegex: NetRegexes.headMarker({ id: '005B' }),
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
      netRegex: NetRegexes.startsUsing({ id: '1C2[23]', source: 'Diabolos Hollow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C2[23]', source: 'Nihil-Diabolos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C2[23]', source: 'Diabolos Nihil', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C2[23]', source: 'ディアボロス・ホロー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C2[23]', source: '虚空迪亚波罗斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C2[23]', source: '공허의 디아볼로스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      // This is the tank version of the stack marker. It has minimal circular bordering
      id: 'Dun Scaith Blindside',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Dun Scaith Earth Shaker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      response: Responses.earthshaker(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aether Collector': 'Ätherakkumulator',
        'Connla': 'Connla',
        'Cursing Atomos': 'Fluch-Atomos',
        'Deathgate': 'Tor des Todes',
        'Deathgaze Hollow': 'Nihil-Thanatos',
        'Diabolos(?! )': 'Diabolos',
        'Diabolos Hollow': 'Nihil-Diabolos',
        'Ferdiad Hollow': 'Nihil-Ferdiad',
        'Proto Bit': 'Proto-Drohne',
        'Proto Ultima': 'Proto-Ultima',
        'Scathach': 'Scathach',
        'Shadow Limb': 'Schattenhand',
        'Shadows gather on the floor': 'Schatten sammeln sich auf dem Boden',
        'Void Sprite': 'Nichts-Exergon',
        'Wailing Atomos': 'Heul-Atomos',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aether Collector': 'accumulateur d\'éther',
        'Connla': 'Connla',
        'Cursing Atomos': 'gueule maudissante',
        'Deathgate': 'porte de mort',
        'Deathgaze Hollow': 'mortalis nihil',
        'Diabolos(?! )': 'Diabolos',
        'Diabolos Hollow': 'Diabolos nihil',
        'Ferdiad Hollow': 'Ferdiad nihil',
        'Proto Bit': 'proto-foret',
        'Proto Ultima': 'Proto-Ultima',
        'Scathach': 'Scáthach',
        'Shadow Limb': 'Main ombrale',
        'Shadows gather on the floor': 'Le pouvoir des ombres se concentre sur le sol',
        'Void Sprite': 'élémentaire du vide',
        'Wailing Atomos': 'gueule gémissante',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aether Collector': 'エーテル集積器',
        'Connla': 'コンラ',
        'Cursing Atomos': '怨声のアトモス',
        'Deathgate': '召喚の扉',
        'Deathgaze Hollow': 'デスゲイズ・ホロー',
        'Diabolos(?! )': 'ディアボロス',
        'Diabolos Hollow': 'ディアボロス・ホロー',
        'Ferdiad Hollow': 'フェルディア・ホロー',
        'Proto Bit': 'プロトビット',
        'Proto Ultima': 'プロトアルテマ',
        'Scathach': 'スカアハ',
        'Shadow Limb': '影の手',
        'Shadows gather on the floor': '床に影の力が集束していく',
        'Void Sprite': 'ヴォイド・スプライト',
        'Wailing Atomos': '虚声のアトモス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aether Collector': '以太收集器',
        'Connla': '康拉',
        'Cursing Atomos': '怨声的阿托莫斯',
        'Deathgate': '召唤之门',
        'Deathgaze Hollow': '虚空死亡凝视',
        'Diabolos(?! )': '迪亚波罗斯',
        'Diabolos Hollow': '虚空迪亚波罗斯',
        'Ferdiad Hollow': '虚空弗迪亚',
        'Proto Bit': '原型浮游炮',
        'Proto Ultima': '究极神兵原型',
        'Scathach': '斯卡哈',
        'Shadow Limb': '影之手',
        'Shadows gather on the floor': '影之力正在向地面聚集',
        'Void Sprite': '虚无元精',
        'Wailing Atomos': '虚声的阿托莫斯',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aether Collector': '에테르 집적기',
        'Connla': '콘라',
        'Cursing Atomos': '원성의 아토모스',
        'Deathgate': '소환의 문',
        'Deathgaze Hollow': '공허의 저승파수꾼',
        'Diabolos(?! )': '디아볼로스',
        'Diabolos Hollow': '공허의 디아볼로스',
        'Ferdiad Hollow': '공허의 페르디아',
        'Proto Bit': '프로토 비트',
        'Proto Ultima': '프로토 알테마',
        'Scathach': '스카하크',
        'Shadow Limb': '그림자 손',
        'Shadows gather on the floor': '바닥에 그림자의 힘이 모여듭니다',
        'Void Sprite': '보이드 정령',
        'Wailing Atomos': '허성의 아토모스',
      },
    },
  ],
},
];
