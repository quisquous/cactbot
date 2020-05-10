'use strict';

// In your cactbot/user/raidboss.js file, add the line:
//   Options.cactbote8sUptimeKnockbackStrat = true;
// .. if you want cactbot to callout Mirror Mirror 4's double knockback
// Callout happens during/after boss turns and requires <1.4s reaction time
// to avoid both Green and Read Mirror knockbacks.
// Example: https://clips.twitch.tv/CreativeDreamyAsparagusKlappa
// Group splits into two groups behind boss after the jump.
// Tanks adjust to where the Red and Green Mirror are located.
// One tank must be inbetween the party, the other closest to Greem Mirror.
// Once Green Mirror goes off, the tanks adjust for Red Mirror.

// TODO: figure out *anything* with mirrors and mirror colors
// TODO: yell at you to take the last tower for Light Rampant if needed
// TODO: yell at you to take the last tower for Icelit Dragonsong if needed
// TODO: House of light clock position callout
// TODO: Light Rampant early callouts (who has prox marker, who gets aoes)
// TODO: reflected scythe kick callout (stand by mirror)
// TODO: reflected axe kick callout (get under)
// TODO: callouts for initial Hallowed Wings mirrors?
// TODO: callouts for the stack group mirrors?
// TODO: icelit dragonsong callouts?

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(4\)$/,
  },
  timelineFile: 'e8s.txt',
  timelineTriggers: [
    {
      id: 'E8S Shining Armor',
      regex: /(?<!Reflected )Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'E8S Reflected Armor',
      regex: /Reflected Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'E8S Frost Armor',
      // Not the reflected one, as we want the "move" call there
      // which will happen naturally from `Reflected Drachen Armor`.
      regex: /^Frost Armor$/,
      beforeSeconds: 2,
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'E8S Rush',
      regex: /Rush \d/,
      beforeSeconds: 5,
      infoText: function(data) {
        data.rushCount = data.rushCount || 0;
        data.rushCount++;
        return {
          en: 'Tether ' + data.rushCount,
          de: 'Verbindung ' + data.rushCount,
          fr: 'Lien ' + data.rushCount,
          cn: '和' + data.rushCount + '连线',
          ko: '선: ' + data.rushCount,
        };
      },
    },
  ],
  triggers: [
    {
      id: 'E8S Absolute Zero',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DCC', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DCC', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DCC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Biting Frost First Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      condition: function(data) {
        // Have not seen any frost yet.
        return !data.firstFrost;
      },
      // This cast is 5 seconds, so don't muddy the back/front call.
      // But also don't wait too long to give directions?
      delaySeconds: 2,
      infoText: {
        // Sorry, there are no mirror colors in the logs (YET),
        // and so this is the best that can be done.
        en: 'Go Back, Red Mirror Side',
        de: 'Nach Hinten gehen, Seite des roten Spiegels',
        fr: 'Allez derrière, côté miroir rouge',
        ko: '빨간 거울 방향 구석으로 이동',
      },
    },
    {
      id: 'E8S Driving Frost First Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      condition: function(data) {
        return !data.firstFrost;
      },
      // See comments on Biting Frost First Mirror above.
      delaySeconds: 2,
      infoText: {
        en: 'Go Front, Green Mirror Side',
        de: 'Nach Vorne gehen, Seite des grünen Spiegels',
        fr: 'Allez devant, côté miroir vert',
        ko: '초록 거울 방향 구석으로 이동',
      },
    },
    {
      id: 'E8S Reflected Frost 1',
      regex: Regexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
      regexDe: Regexes.ability({ source: 'Eisspiegel', id: '4DB[78]', capture: false }),
      regexFr: Regexes.ability({ source: 'miroir de glace', id: '4DB[78]', capture: false }),
      regexJa: Regexes.ability({ source: '氷面鏡', id: '4DB[78]', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Swap Sides',
        de: 'Seiten wechseln',
        fr: 'Changez de côté',
        ko: '반대로 이동',
      },
    },
    {
      id: 'E8S Biting Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      response: Responses.getBehind(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'biting';
      },
    },
    {
      id: 'E8S Driving Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      response: Responses.goFrontOrSides(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'driving';
      },
    },
    {
      id: 'E8S Forgetful Tank Second Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6[67]', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6[67]', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6[67]', capture: false }),
      condition: (data) => data.role == 'tank',
      delaySeconds: 43,
      suppressSeconds: 80,
      infoText: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            de: 'Frosthieb als nächstes',
            fr: 'Taillade de givre bientôt',
            cn: '下次攻击前侧方',
            ko: '다음: Biting/スラッシュ',
          };
        }
        return {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          cn: '下次攻击后方',
          ko: '다음: Driving/スラスト',
        };
      },
      tts: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            de: 'Frosthieb als nächstes',
            fr: 'Taillade de givre bientôt',
            cn: '下次攻击前侧方',
            ko: '다음: 바이팅 스라슈',
          };
        }
        return {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          cn: '下次攻击后方',
          ko: '다음: 드라이빙 스라스토',
        };
      },
    },
    {
      id: 'E8S Diamond Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Icicle Impact',
      regex: Regexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      regexDe: Regexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      regexFr: Regexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      regexJa: Regexes.abilityFull({ source: 'シヴァ', id: '4DA0' }),
      regexCn: Regexes.abilityFull({ source: '希瓦', id: '4DA0' }),
      regexKo: Regexes.abilityFull({ source: '시바', id: '4DA0' }),
      suppressSeconds: 20,
      infoText: function(data, matches) {
        let x = parseFloat(matches.x);
        if (x >= 99 && x <= 101) {
          return {
            en: 'North / South',
            de: 'Norden / Süden',
            fr: 'Nord / Sud',
            cn: '南北站位',
            ko: '남 / 북',
          };
        }
        return {
          en: 'East / West',
          de: 'Osten / Westen',
          fr: 'Est / Ouest',
          cn: '东西站位',
          ko: '동 / 서',
        };
      },
    },
    {
      id: 'E8S Diamond Frost Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4D6C', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4D6C', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4D6C', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse',
        de: 'Reinigen',
        fr: 'Guérison',
        cn: '驱散',
        ko: '에스나',
      },
    },
    {
      id: 'E8S Double Slap',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D65' }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D65' }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D65' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E8S Axe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6D', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6D', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6D', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Scythe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6E', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8S Light Rampant',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D73', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D73', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D73', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Refulgent Chain',
      regex: Regexes.gainsEffect({ effect: 'Refulgent Chain' }),
      regexDe: Regexes.gainsEffect({ effect: 'Lichtfessel' }),
      regexFr: Regexes.gainsEffect({ effect: 'Chaînes de Lumière' }),
      regexJa: Regexes.gainsEffect({ effect: '光の鎖' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: {
        en: 'Chain on YOU',
        de: 'Kette auf DIR',
        fr: 'Chaîne sur VOUS',
        cn: '连线',
        ko: '사슬 대상자',
      },
    },
    {
      id: 'E8S Holy Light',
      regex: Regexes.tether({ id: '0002' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Orb on YOU',
        de: 'Orb auf DIR',
        fr: 'Orbe sur VOUS',
        cn: '拉球',
        ko: '구슬 대상자',
      },
    },
    {
      id: 'E8S Banish III',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D80', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D80', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D80', capture: false }),
      response: Responses.stack('info'),
    },
    {
      id: 'E8S Banish III Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D81', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D81', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D81', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'E8S Akh Morn',
      regex: Regexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'] }),
      regexDe: Regexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'] }),
      regexFr: Regexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'] }),
      regexJa: Regexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'] }),
      preRun: function(data, matches) {
        data.akhMornTargets = data.akhMornTargets || [];
        data.akhMornTargets.push(matches.target);
      },
      response: function(data, matches) {
        if (data.me == matches.target) {
          let onYou = {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
            fr: 'Akh Morn sur VOUS',
            ko: '아크몬 대상자',
          };
          // It'd be nice to have this be an alert, but it mixes with a lot of
          // other alerts (akh rhai "move" and worm's lament numbers).
          if (data.role == 'tank')
            return { infoText: onYou };
          return { alarmText: onYou };
        }
        if (data.akhMornTargets.length != 2)
          return;
        if (data.akhMornTargets.includes(data.me))
          return;
        return {
          infoText: {
            en: 'Akh Morn: ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            de: 'Akh Morn: ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            fr: 'Akh Morn : ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
          },
        };
      },
    },
    {
      id: 'E8S Akh Morn Cleanup',
      regex: Regexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'], capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'], capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'], capture: false }),
      regexJa: Regexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'], capture: false }),
      delaySeconds: 15,
      run: function(data) {
        delete data.akhMornTargets;
      },
    },
    {
      id: 'E8S Morn Afah',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7B' }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7B' }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7B' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Morn Afah on YOU',
            de: 'Morn Afah auf DIR',
            fr: 'Morn Afah sur VOUS',
            cn: '无尽顿悟点名',
            ko: '몬아파 대상자',
          };
        }
        if (data.role == 'tank' || data.role == 'healer' || data.CanAddle()) {
          return {
            en: 'Morn Afah on ' + data.ShortName(matches.target),
            de: 'Morn Afah auf ' + data.ShortName(matches.target),
            fr: 'Morn Afah sur ' + data.ShortName(matches.target),
            cn: '无尽顿悟点名' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 몬 아파',
          };
        }
      },
    },
    {
      id: 'E8S Hallowed Wings Left',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D75', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D75', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D75', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E8S Hallowed Wings Right',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D76', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D76', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D76', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'E8S Hallowed Wings Knockback',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D77', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D77', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D77', capture: false }),
      condition: function(data) {
        return data.options.cactbote8sUptimeKnockbackStrat;
      },
      // This gives a warning within 1.4 seconds, so you can hit arm's length.
      delaySeconds: 8.6,
      durationSeconds: 1.4,
      response: Responses.knockback(),
    },
    {
      id: 'E8S Wyrm\'s Lament',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Wyrm\'s Lament Counter',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrmclaw',
      regex: Regexes.gainsEffect({ effect: 'Wyrmclaw' }),
      regexDe: Regexes.gainsEffect({ effect: 'Krallen Des Heiligen Drachen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Griffes du Dragon divin' }),
      regexJa: Regexes.gainsEffect({ effect: '聖竜の爪' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmclawNumber = {
            '14': 1,
            '22': 2,
            '30': 3,
            '38': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmclawNumber = {
            '22': 1,
            '38': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Red #' + data.wyrmclawNumber,
          de: 'Rot #' + data.wyrmclawNumber,
          fr: 'Rouge #' + data.wyrmclawNumber,
          cn: '红色 #' + data.wyrmclawNumber,
          ko: '빨강 ' + data.wyrmclawNumber + '번',
        };
      },
    },
    {
      id: 'E8S Wyrmfang',
      regex: Regexes.gainsEffect({ effect: 'Wyrmfang' }),
      regexDe: Regexes.gainsEffect({ effect: 'Reißzähne Des Heiligen Drachen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Crocs du Dragon divin' }),
      regexJa: Regexes.gainsEffect({ effect: '聖竜の牙' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmfangNumber = {
            '20': 1,
            '28': 2,
            '36': 3,
            '44': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmfangNumber = {
            '28': 1,
            '44': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Blue #' + data.wyrmfangNumber,
          de: 'Blau #' + data.wyrmfangNumber,
          fr: 'Bleu #' + data.wyrmfangNumber,
          cn: '蓝色 #' + data.wyrmfangNumber,
          ko: '파랑 ' + data.wyrmfangNumber + '번',
        };
      },
    },
    {
      id: 'E8S Drachen Armor',
      regex: Regexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4DD2', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4DD2', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4DD2', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'E8S Reflected Drachen Armor',
      regex: Regexes.ability({ source: 'Frozen Mirror', id: '4DC2', capture: false }),
      regexDe: Regexes.ability({ source: 'Eisspiegel', id: '4DC2', capture: false }),
      regexFr: Regexes.ability({ source: 'Miroir De Glace', id: '4DC2', capture: false }),
      regexJa: Regexes.ability({ source: '氷面鏡', id: '4DC2', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'E8S Holy',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D82', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D82', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D82', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Holy Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D83', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D83', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D83', capture: false }),
      response: Responses.getIn('alert'),
    },
    {
      id: 'E8S Twin Stillness',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D68', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D68', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D68', capture: false }),
      response: Responses.getBackThenFront('alert'),
    },
    {
      id: 'E8S Twin Silence',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D69', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D69', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D69', capture: false }),
      response: Responses.getFrontThenBack('alert'),
    },
    {
      id: 'E8S Spiteful Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D6F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D6F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D6F', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8S Embittered Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D70', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D70', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D70', capture: false }),
      response: Responses.getInThenOut(),
    },
    {
      id: 'E8S Icelit Dragonsong Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4D7D', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4D7D', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4D7D', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse DPS Only',
        de: 'Nur DPS reinigen',
        fr: 'Guérison sur les DPS seulement',
        cn: '驱散DPS',
        ko: '딜러만 에스나',
      },
    },
    {
      id: 'E8S Banish',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7E', capture: false }),
      condition: (data) => data.role == 'tank',
      alertText: {
        en: 'Tank Stack in Tower',
        de: 'Auf Tank im Turm sammeln',
        fr: 'Package tanks dans les tours',
        cn: '坦克塔内分摊',
        ko: '탱커 집합',
      },
    },
    {
      id: 'E8S Banish Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4D7F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4D7F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4D7F', capture: false }),
      condition: (data) => data.role == 'tank',
      alertText: {
        en: 'Tank Spread in Tower',
        de: 'Tank im Turm verteilen',
        fr: 'Dispersion tanks dans les tours',
        cn: '坦克塔内分散',
        ko: '탱커 산개',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Aqueous Aether': 'Wasseräther',
        'Earthen Aether': 'Erdäther',
        'Electric Aether': 'Blitzäther',
        'Frozen Mirror': 'Eisspiegel',
        'great wyrm': 'Körper des heiligen Drachen',
        'holy light': 'heilig(?:e|er|es|en) Licht',
        'Luminous Aether': 'Lichtäther',
        'Mothercrystal': 'Urkristall',
        'Shiva': 'Shiva',
      },
      'replaceText': {
        'Absolute Zero': 'Absoluter Nullpunkt',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Axe/Scythe Kick': 'Axttritt/Abwehrtritt',
        'Banish(?! )': 'Verbannen',
        'Banish Divided': 'Geteiltes Verbannen',
        'Banish III': 'Verbannga',
        'Banish III Divided': 'Geteiltes Verbannga',
        'Biting/Driving Frost': 'Frostshieb/Froststoß',
        'Bright Hunger': 'Erosionslicht',
        'Bright Pulse': 'Glühen',
        'Diamond Frost': 'Diamantstaub',
        'Double Slap': 'Doppelschlag',
        'Drachen Armor': 'Drachenrüstung',
        'Draconic Strike': 'Drakonischer Schlag',
        'Driving/Biting Frost': 'Froststoß/Frostshieb',
        'Embittered/Spiteful Dance': 'Strenger/Kalter Tanz',
        'Frigid Eruption': 'Eiseruption',
        'Frigid Needle': 'Eisnadel',
        'Frigid Stone': 'Eisstein',
        'Frigid Water': 'Eisfrost',
        'Frost Armor(?! )': 'Frostrüstung',
        'Hallowed Wings': 'Heilige Schwingen',
        'Heart Asunder': 'Herzensbrecher',
        'Heavenly Strike': 'Elysischer Schlag',
        'Holy': 'Sanctus',
        'Icelit Dragonsong': 'Lied von Eis und Licht',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Inescapable Illumination': 'Expositionslicht',
        'Light Rampant': 'Überflutendes Licht',
        'Longing of the Lost': 'Heiliger Drache',
        'Mirror, Mirror': 'Spiegelland',
        'Morn Afah': 'Morn Afah',
        'Reflected Armor \\(B\\)': 'Spiegelung Rüstung (B)',
        'Reflected Armor \\(G\\)': 'Spiegelung Rüstung (G)',
        'Reflected Armor \\(R\\)': 'Spiegelung Rüstung (R)',
        'Reflected Drachen': 'Spiegelung Drachen',
        'Reflected Drachen Armor': 'Spiegelung: Drachenrüstung',
        'Reflected Frost \\(G\\)': 'Spiegelung Frost (G)',
        'Reflected Frost \\(R\\)': 'Spiegelung Frost (R)',
        'Reflected Frost Armor': 'Spiegelung: Frostrüstung',
        'Reflected Hallowed Wings': 'Spiegelung: Heilige Schwingen',
        'Reflected Kick \\(G\\)': 'Spiegelung Tritt (G)',
        'Reflected Scythe Kick': 'Spiegelung: Abwehrtritt',
        'Reflected Shining Armor': 'Spiegelung: Funkelnde Rüstung',
        'Reflected Wings \\(B\\)': 'Spiegelung Schwingen (B)',
        'Reflected Wings \\(G\\)': 'Spiegelung Schwingen (G)',
        'Reflected Wings \\(R\\)': 'Spiegelung Schwingen (R)',
        'Rush': 'Sturm',
        'Scythe/Axe Kick': 'Abwehrtritt/Axttritt',
        'Shattered World': 'Zersplitterte Welt',
        'Shining Armor': 'Funkelnde Rüstung',
        'Shock Spikes': 'Schockstachel',
        'Skyfall': 'Vernichtung der Welt',
        'Spiteful/Embittered Dance': 'Kalter/Strenger Tanz',
        'Stoneskin': 'Steinhaut',
        'The Path Of Light': 'Pfad des Lichts',
        'The House Of Light': 'Tsunami des Lichts',
        'Twin Silence/Stillness': 'Zwillingsschwerter der Ruhe/Stille',
        'Twin Stillness/Silence': 'Zwillingsschwerter der Stille/Ruhe',
        'Wyrm\'s Lament': 'Brüllen des heiligen Drachen',
      },
      '~effectNames': {
        'Damage Down': 'Schaden -',
        'Deep Freeze': 'Tiefkühlung',
        'Down for the Count': 'Am Boden',
        'Freezing': 'Allmähliche Kühlung',
        'Hated of Frost': 'Verfluchung der Eisgöttin',
        'Hated of the Wyrm': 'Verfluchung des Drachen',
        'Heavy': 'Gewicht',
        'Light Resistance Down': 'Lichtresistenz -',
        'Lightsteeped': 'Exzessives Licht',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Refulgent Chain': 'Lichtfessel',
        'Refulgent Fate': 'Bann des Lichts',
        'Thin Ice': 'Glatteis',
        'Wyrmclaw': 'Krallen des heiligen Drachen',
        'Wyrmfang': 'Reißzähne des heiligen Drachen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'aqueous Aether': 'Éther d\'eau',
        'earthen Aether': 'Éther de terre',
        'electric Aether': 'Éther de foudre',
        'frozen mirror': 'Miroir de glace',
        'great wyrm': 'Dragon divin',
        'holy light': 'Lumière sacrée',
        'luminous Aether': 'Éther de lumière',
        'Mothercrystal': 'Cristal-mère',
        'Shiva': 'Shiva',
      },
      'replaceText': {
        '\\?': ' ?',
        'Absolute Zero': 'Zéro absolu',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Axe/Scythe Kick': 'Jambe pourfendeuse/faucheuse',
        'Banish(?! )': 'Bannissement',
        'Banish Divided': 'Bannissement fractionné',
        'Banish III': 'Méga Bannissement',
        'Banish III Divided': 'Méga Bannissement fractionné',
        'Biting/Driving Frost': 'Taillade/Percée de givre',
        'Bright Hunger': 'Lumière dévorante',
        'Bright Pulse': 'Éclat',
        'Diamond Frost': 'Poussière de diamant',
        'Double Slap': 'Gifle redoublée',
        'Drachen Armor': 'Armure des dragons',
        'Draconic Strike': 'Frappe draconique',
        'Driving/Biting Frost': 'Percée/taillade de givre',
        'Embittered/Spiteful Dance': 'Danse de la sévérité/froideur',
        'Frigid Eruption': 'Éruption de glace',
        'Frigid Needle': 'Dards de glace',
        'Frigid Stone': 'Rocher de glace',
        'Frigid Water': 'Cataracte gelée',
        'Frost Armor(?! )': 'Armure de givre',
        'Hallowed Wings': 'Aile sacrée',
        'Heart Asunder': 'Cœur déchiré',
        'Icelit Dragonsong': 'Chant de Glace et de Lumière',
        'Icicle Impact': 'Impact de stalactite',
        'Inescapable Illumination': 'Lumière révélatrice',
        'Heavenly Strike': 'Frappe céleste',
        'Holy': 'Miracle',
        'Light Rampant': 'Débordement de Lumière',
        'Longing of the Lost': 'Esprit du Dragon divin',
        'Mirror, Mirror': 'Monde des miroirs',
        'Morn Afah': 'Morn Afah',
        'Reflected Armor \\(B\\)': 'Armure réverbérée (B)',
        'Reflected Armor \\(G\\)': 'Armure réverbérée (V)',
        'Reflected Armor \\(R\\)': 'Armure réverbérée (R)',
        'Reflected Drachen': 'Dragon réverbéré',
        'Reflected Drachen Armor': 'Réverbération : Armure des dragons',
        'Reflected Frost \\(G\\)': 'Givre réverbéré (V)',
        'Reflected Frost \\(R\\)': 'Givre réverbéré (R)',
        'Reflected Frost Armor': 'Réverbération : Armure de givre',
        'Reflected Hallowed Wings': 'Réverbération : Aile sacrée',
        'Reflected Kick \\(G\\)': 'Jambe réverbérée (V)',
        'Reflected Scythe Kick': 'Réverbération : Jambe faucheuse',
        'Reflected Shining Armor': 'Réverbération : Armure scintillante',
        'Reflected Wings \\(B\\)': 'Aile réverbérée (B)',
        'Reflected Wings \\(G\\)': 'Aile réverbérée (V)',
        'Reflected Wings \\(R\\)': 'Aile réverbérée (R)',
        'Rush': 'Jaillissement',
        'Scythe/Axe Kick': 'Jambe faucheuse/pourfendeuse',
        'Shattered World': 'Monde fracassé',
        'Shining Armor': 'Armure scintillante',
        'Shock Spikes': 'Pointes de foudre',
        'Skyfall': 'Anéantissement',
        'Spiteful/Embittered Dance': 'Danse de la froideur/sévérité',
        'Stoneskin': 'Cuirasse',
        'the Path of Light': 'Voie de lumière',
        'the House of Light': 'Raz-de-lumière',
        'Twin Silence/Stillness': 'Entaille de la tranquilité/quiétude',
        'Twin Stillness/Silence': 'Entaille de la quiétude/tranquilité',
        'Wyrm\'s Lament': 'Rugissement du Dragon divin',
      },
      '~effectNames': {
        'Damage Down': 'Malus de dégâts',
        'Deep Freeze': 'Congélation',
        'Down for the Count': 'Au tapis',
        'Freezing': 'Congélation graduelle',
        'Hated of Frost': 'Malédiction de la Furie des neiges',
        'Hated of the Wyrm': 'Malédiction du Dragon divin',
        'Heavy': 'Pesanteur',
        'Light Resistance Down': 'Résistance à la Lumière réduite',
        'Lightsteeped': 'Lumière excédentaire',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Refulgent Chain': 'Chaînes de Lumière',
        'Refulgent Fate': 'Lien de Lumière',
        'Thin Ice': 'Verglas',
        'Wyrmclaw': 'Griffes du Dragon divin',
        'Wyrmfang': 'Crocs du Dragon divin',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'aqueous Aether': 'ウォーター・エーテル',
        'earthen Aether': 'アース・エーテル',
        'electric Aether': 'ライトニング・エーテル',
        'frozen mirror': '氷面鏡',
        'great wyrm': '聖竜',
        'holy light': '聖なる光',
        'luminous Aether': 'ライト・エーテル',
        'Mothercrystal': 'マザークリスタル',
        'Shiva': 'シヴァ',
      },
      'replaceText': {
        'attack': '攻撃',
        'Absolute Zero': '絶対零度',
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Axe/Scythe Kick': 'アクスキック/サイスキック',
        'Banish(?! )': 'バニシュ',
        'Banish Divided': 'ディバイデッド・バニシュ',
        'Banish III': 'バニシュガ',
        'Banish III Divided': 'ディバイデッド・バニシュガ',
        'Biting/Driving Frost': 'フロストスラッシュ/フロストスラスト',
        'Bright Hunger': '浸食光',
        'Bright Pulse': '閃光',
        'Diamond Frost': 'ダイヤモンドダスト',
        'Double Slap': 'ダブルスラップ',
        'Drachen Armor': 'ドラゴンアーマー',
        'Draconic Strike': 'ドラコニックストライク',
        'Driving/Biting Frost': 'フロストスラスト/フロストスラッシュ',
        'Embittered/Spiteful Dance': '峻厳の舞踏技 / 冷厳の舞踏技',
        'Frigid Eruption': 'アイスエラプション',
        'Frigid Needle': 'アイスニードル',
        'Frigid Stone': 'アイスストーン',
        'Frigid Water': 'アイスフロスト',
        'Frost Armor(?! )': 'フロストアーマー',
        'Hallowed Wings': 'ホーリーウィング',
        'Heart Asunder': 'ハートアサンダー',
        'Heavenly Strike': 'ヘヴンリーストライク',
        'Holy': 'ホーリー',
        'Icelit Dragonsong': '氷と光の竜詩',
        'Icicle Impact': 'アイシクルインパクト',
        'Inescapable Illumination': '曝露光',
        'Light Rampant': '光の暴走',
        'Longing of the Lost': '聖竜気',
        'Mirror, Mirror': '鏡の国',
        'Morn Afah': 'モーン・アファー',
        'Reflected Armor \\(B\\)': '反射アーマー（青）',
        'Reflected Armor \\(G\\)': '反射アーマー（緑）',
        'Reflected Armor \\(R\\)': '反射アーマー（赤）',
        'Reflected Drachen': '反射ドラゴンアーマー',
        'Reflected Drachen Armor': 'ミラーリング・ドラゴンアーマー',
        'Reflected Frost \\(G\\)': '反射フロスト（緑）',
        'Reflected Frost \\(R\\)': '反射フロスト（赤）',
        'Reflected Frost Armor': 'ミラーリング・フロストアーマー',
        'Reflected Hallowed Wings': 'ミラーリング・ホーリーウィング',
        'Reflected Kick \\(G\\)': '反射キック',
        'Reflected Scythe Kick': 'ミラーリング・サイスキック',
        'Reflected Shining Armor': 'ミラーリング・ブライトアーマー',
        'Reflected Wings \\(B\\)': '反射ホーリーウィング（青)',
        'Reflected Wings \\(G\\)': '反射ホーリーウィング（緑）',
        'Reflected Wings \\(R\\)': '反射ホーリーウィング（赤）',
        'Rush': 'ラッシュ',
        'Scythe/Axe Kick': 'サイスキック/アクスキック',
        'Shattered World': 'シャッタード・ワールド',
        'Shining Armor': 'ブライトアーマー',
        'Shock Spikes': 'ショックスパイク',
        'Skyfall': '世界消滅',
        'Stoneskin': 'ストンスキン',
        'Spiteful/Embittered Dance': '冷厳の舞踏技 / 峻厳の舞踏技',
        'the Path of Light': '光の波動',
        'the House of Light': '光の津波',
        'Twin Silence/Stillness': '閑寂の双剣技／静寂の双剣技',
        'Twin Stillness/Silence': '静寂の双剣技／閑寂の双剣技',
        'Wyrm\'s Lament': '聖竜の咆哮',
      },
      '~effectNames': {
        'Damage Down': 'ダメージ低下',
        'Deep Freeze': '氷結',
        'Down for the Count': 'ノックダウン',
        'Freezing': '徐々に氷結',
        'Hated of Frost': '氷神の呪い',
        'Hated of the Wyrm': '聖竜の呪い',
        'Heavy': 'ヘヴィ',
        'Light Resistance Down': '光属性耐性低下',
        'Lightsteeped': '過剰光',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Refulgent Chain': '光の鎖',
        'Refulgent Fate': '光の呪縛',
        'Thin Ice': '氷床',
        'Wyrmclaw': '聖竜の爪',
        'Wyrmfang': '聖竜の牙',
      },
    },
  ],
}];
