import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

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

export default {
  zoneId: ZoneId.EdensVerseRefulgenceSavage,
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
      regex: /Reflected Armor/,
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
      infoText: function(data, _, output) {
        data.rushCount = data.rushCount || 0;
        data.rushCount++;
        return output.text({ num: data.rushCount });
      },
      outputStrings: {
        text: {
          en: 'Tether ${num}',
          de: 'Verbindung ${num}',
          fr: 'Lien ${num}',
          cn: '和${num}连线',
          ko: '선: ${num}',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'E8S Absolute Zero',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4DCC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4DCC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4DCC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Biting Frost First Mirror',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      condition: function(data) {
        // Have not seen any frost yet.
        return !data.firstFrost;
      },
      // This cast is 5 seconds, so don't muddy the back/front call.
      // But also don't wait too long to give directions?
      delaySeconds: 2,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // Sorry, there are no mirror colors in the logs (YET),
          // and so this is the best that can be done.
          en: 'Go Back, Red Mirror Side',
          de: 'Nach Hinten gehen, Seite des roten Spiegels',
          fr: 'Allez derrière, côté miroir rouge',
          cn: '去后面，红镜子侧',
          ko: '빨간 거울 방향 구석으로 이동',
        },
      },
    },
    {
      id: 'E8S Driving Frost First Mirror',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      condition: function(data) {
        return !data.firstFrost;
      },
      // See comments on Biting Frost First Mirror above.
      delaySeconds: 2,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Front, Green Mirror Side',
          de: 'Nach Vorne gehen, Seite des grünen Spiegels',
          fr: 'Allez devant, côté miroir vert',
          cn: '去前面，绿镜子侧',
          ko: '초록 거울 방향 구석으로 이동',
        },
      },
    },
    {
      id: 'E8S Reflected Frost 1',
      netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Eisspiegel', id: '4DB[78]', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'miroir de glace', id: '4DB[78]', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '氷面鏡', id: '4DB[78]', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '冰面镜', id: '4DB[78]', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '얼음 거울', id: '4DB[78]', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Swap Sides',
          de: 'Seiten wechseln',
          fr: 'Changez de côté',
          cn: '换边',
          ko: '반대로 이동',
        },
      },
    },
    {
      id: 'E8S Biting Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      response: Responses.getBehind(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'biting';
      },
    },
    {
      id: 'E8S Driving Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      response: Responses.goFrontOrSides(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'driving';
      },
    },
    {
      id: 'E8S Forgetful Tank Second Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6[67]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6[67]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6[67]', capture: false }),
      condition: (data) => data.role === 'tank',
      delaySeconds: 43,
      suppressSeconds: 80,
      infoText: function(data, _, output) {
        if (data.firstFrost === 'driving')
          return output.bitingFrostNext();

        return output.drivingFrostNext();
      },
      outputStrings: {
        bitingFrostNext: {
          en: 'Biting Frost Next',
          de: 'Frosthieb als nächstes',
          fr: 'Taillade de givre bientôt',
          cn: '下次攻击前侧面',
          ko: '다음: 서리 참격',
        },
        drivingFrostNext: {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          cn: '下次攻击后面',
          ko: '다음: 서리 일격',
        },
      },
    },
    {
      id: 'E8S Diamond Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Icicle Impact',
      netRegex: NetRegexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'シヴァ', id: '4DA0' }),
      netRegexCn: NetRegexes.abilityFull({ source: '希瓦', id: '4DA0' }),
      netRegexKo: NetRegexes.abilityFull({ source: '시바', id: '4DA0' }),
      suppressSeconds: 20,
      infoText: function(data, matches, output) {
        const x = parseFloat(matches.x);
        if (x >= 99 && x <= 101)
          return output.northSouth();

        return output.eastWest();
      },
      outputStrings: {
        northSouth: {
          en: 'North / South',
          de: 'Norden / Süden',
          fr: 'Nord / Sud',
          cn: '南北站位',
          ko: '남 / 북',
        },
        eastWest: {
          en: 'East / West',
          de: 'Osten / Westen',
          fr: 'Est / Ouest',
          cn: '东西站位',
          ko: '동 / 서',
        },
      },
    },
    {
      id: 'E8S Diamond Frost Cleanse',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '4D6C', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '4D6C', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '4D6C', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleanse',
          de: 'Reinigen',
          fr: 'Guérison',
          cn: '驱散',
          ko: '에스나',
        },
      },
    },
    {
      id: 'E8S Double Slap',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D65' }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D65' }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D65' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E8S Axe Kick',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6D', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Scythe Kick',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6E', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8S Light Rampant',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D73', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D73', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D73', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Refulgent Chain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8CD' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Chain on YOU',
          de: 'Kette auf DIR',
          fr: 'Chaîne sur VOUS',
          cn: '连线点名',
          ko: '사슬 대상자',
        },
      },
    },
    {
      id: 'E8S Holy Light',
      netRegex: NetRegexes.tether({ id: '0002' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orb on YOU',
          de: 'Orb auf DIR',
          fr: 'Orbe sur VOUS',
          cn: '拉球点名',
          ko: '구슬 대상자',
        },
      },
    },
    {
      id: 'E8S Banish III',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D80', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D80', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D80', capture: false }),
      response: Responses.stackMarker('info'),
    },
    {
      id: 'E8S Banish III Divided',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D81', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D81', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D81', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'E8S Akh Morn',
      netRegex: NetRegexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'] }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'] }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'] }),
      netRegexJa: NetRegexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'] }),
      netRegexCn: NetRegexes.startsUsing({ source: ['希瓦', '圣龙'], id: ['4D98', '4D79'] }),
      netRegexKo: NetRegexes.startsUsing({ source: ['시바', '성룡'], id: ['4D98', '4D79'] }),
      preRun: function(data, matches) {
        data.akhMornTargets = data.akhMornTargets || [];
        data.akhMornTargets.push(matches.target);
      },
      response: function(data, matches, output) {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          akhMornOnYou: {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
            fr: 'Akh Morn sur VOUS',
            cn: '死亡轮回点名',
            ko: '아크몬 대상자',
          },
          akhMornOn: {
            en: 'Akh Morn: ${players}',
            de: 'Akh Morn: ${players}',
            fr: 'Akh Morn : ${players}',
            ko: '아크몬 : ${players}',
            cn: '死亡轮回: ${players}',
          },
        };
        if (data.me === matches.target) {
          // It'd be nice to have this be an alert, but it mixes with a lot of
          // other alerts (akh rhai "move" and worm's lament numbers).
          return { [data.role === 'tank' ? 'infoText' : 'alarmText']: output.akhMornOnYou() };
        }
        if (data.akhMornTargets.length !== 2)
          return;
        if (data.akhMornTargets.includes(data.me))
          return;
        const players = data.akhMornTargets.map((x) => data.ShortName(x)).join(', ');
        return { infoText: akhMornOn({ players: players }) };
      },
    },
    {
      id: 'E8S Akh Morn Cleanup',
      netRegex: NetRegexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['希瓦', '圣龙'], id: ['4D98', '4D79'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['시바', '성룡'], id: ['4D98', '4D79'], capture: false }),
      delaySeconds: 15,
      run: function(data) {
        delete data.akhMornTargets;
      },
    },
    {
      id: 'E8S Morn Afah',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7B' }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7B' }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7B' }),
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.mornAfahOnYou();

        if (data.role === 'tank' || data.role === 'healer' || data.CanAddle())
          return output.mornAfahOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        mornAfahOnYou: {
          en: 'Morn Afah on YOU',
          de: 'Morn Afah auf DIR',
          fr: 'Morn Afah sur VOUS',
          cn: '无尽顿悟点名',
          ko: '몬아파 대상자',
        },
        mornAfahOn: {
          en: 'Morn Afah on ${player}',
          de: 'Morn Afah auf ${player}',
          fr: 'Morn Afah sur ${player}',
          cn: '无尽顿悟点 ${player}',
          ko: '"${player}" 몬 아파',
        },
      },
    },
    {
      id: 'E8S Hallowed Wings Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D75', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D75', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D75', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E8S Hallowed Wings Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D76', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D76', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D76', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'E8S Hallowed Wings Knockback',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D77', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D77', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D77', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Wyrm\'s Lament Counter',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrmclaw',
      netRegex: NetRegexes.gainsEffect({ effectId: '8D2' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament === 1) {
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
      alertText: function(data, _, output) {
        return output.text({ num: data.wyrmclawNumber });
      },
      outputStrings: {
        text: {
          en: 'Red #${num}',
          de: 'Rot #${num}',
          fr: 'Rouge #${num}',
          cn: '红色 #${num}',
          ko: '빨강 ${num}번',
        },
      },
    },
    {
      id: 'E8S Wyrmfang',
      netRegex: NetRegexes.gainsEffect({ effectId: '8D3' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament === 1) {
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
      alertText: function(data, _, output) {
        return output.text({ num: data.wyrmfangNumber });
      },
      outputStrings: {
        text: {
          en: 'Blue #${num}',
          de: 'Blau #${num}',
          fr: 'Bleu #${num}',
          cn: '蓝色 #${num}',
          ko: '파랑 ${num}번',
        },
      },
    },
    {
      id: 'E8S Drachen Armor',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '4DD2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '4DD2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '4DD2', capture: false }),
      response: Responses.moveAway('alert'),
    },
    {
      id: 'E8S Reflected Drachen Armor',
      netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DC2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Eisspiegel', id: '4DC2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Miroir De Glace', id: '4DC2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '氷面鏡', id: '4DC2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '冰面镜', id: '4DC2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '얼음 거울', id: '4DC2', capture: false }),
      response: Responses.moveAway('alert'),
    },
    {
      id: 'E8S Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D82', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D82', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D82', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Holy Divided',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D83', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D83', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D83', capture: false }),
      response: Responses.getIn('alert'),
    },
    {
      id: 'E8S Twin Stillness',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D68', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D68', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D68', capture: false }),
      response: Responses.getBackThenFront('alert'),
    },
    {
      id: 'E8S Twin Silence',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D69', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D69', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D69', capture: false }),
      response: Responses.getFrontThenBack('alert'),
    },
    {
      id: 'E8S Spiteful Dance',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6F', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8S Embittered Dance',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D70', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D70', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D70', capture: false }),
      response: Responses.getInThenOut(),
    },
    {
      id: 'E8S Icelit Dragonsong Cleanse',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '4D7D', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '4D7D', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '4D7D', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleanse DPS Only',
          de: 'Nur DPS reinigen',
          fr: 'Guérison => DPS seulement',
          cn: '驱散DPS',
          ko: '딜러만 에스나',
        },
      },
    },
    {
      id: 'E8S Banish',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7E', capture: false }),
      condition: (data) => data.role === 'tank',
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank Stack in Tower',
          de: 'Auf Tank im Turm sammeln',
          fr: 'Package tanks dans les tours',
          cn: '坦克塔内分摊',
          ko: '탱커 쉐어',
        },
      },
    },
    {
      id: 'E8S Banish Divided',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7F', capture: false }),
      condition: (data) => data.role === 'tank',
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank Spread in Tower',
          de: 'Tank im Turm verteilen',
          fr: 'Dispersion tanks dans les tours',
          cn: '坦克塔内分散',
          ko: '탱커 산개',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Frozen Mirror': 'Eisspiegel',
        'great wyrm': 'Körper des heiligen Drachen',
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
        'Banish III': 'Verbannga',
        'Biting/Driving Frost': 'Frostshieb/Froststoß',
        'Bright Hunger': 'Erosionslicht',
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
        'Mirror, Mirror': 'Spiegelland',
        'Morn Afah': 'Morn Afah',
        'Reflected Armor \\(B\\)': 'Spiegelung Rüstung (B)',
        'Reflected Armor \\(G\\)': 'Spiegelung Rüstung (G)',
        'Reflected Armor \\(R\\)': 'Spiegelung Rüstung (R)',
        'Reflected Drachen': 'Spiegelung Drachen',
        'Reflected Frost \\(G\\)': 'Spiegelung Frost (G)',
        'Reflected Frost \\(R\\)': 'Spiegelung Frost (R)',
        'Reflected Frost Armor': 'Spiegelung: Frostrüstung',
        'Reflected Kick \\(G\\)': 'Spiegelung Tritt (G)',
        'Reflected Shining Armor': 'Spiegelung: Funkelnde Rüstung',
        'Reflected Wings \\(B\\)': 'Spiegelung Schwingen (B)',
        'Reflected Wings \\(G\\)': 'Spiegelung Schwingen (G)',
        'Reflected Wings \\(R\\)': 'Spiegelung Schwingen (R)',
        'Rush': 'Sturm',
        'Scythe/Axe Kick': 'Abwehrtritt/Axttritt',
        'Shattered World': 'Zersplitterte Welt',
        'Shining Armor': 'Funkelnde Rüstung',
        'Skyfall': 'Vernichtung der Welt',
        'Spiteful/Embittered Dance': 'Kalter/Strenger Tanz',
        'The Path Of Light': 'Pfad des Lichts',
        'The House Of Light': 'Tsunami des Lichts',
        'Twin Silence/Stillness': 'Zwillingsschwerter der Ruhe/Stille',
        'Twin Stillness/Silence': 'Zwillingsschwerter der Stille/Ruhe',
        'Wyrm\'s Lament': 'Brüllen des heiligen Drachen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'frozen mirror': 'Miroir de glace',
        'great wyrm': 'Dragon divin',
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
        'Banish III': 'Méga Bannissement',
        'Biting/Driving Frost': 'Taillade/Percée de givre',
        'Bright Hunger': 'Lumière dévorante',
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
        'Mirror, Mirror': 'Monde des miroirs',
        'Morn Afah': 'Morn Afah',
        'Reflected Armor \\(B\\)': 'Armure réverbérée (B)',
        'Reflected Armor \\(G\\)': 'Armure réverbérée (V)',
        'Reflected Armor \\(R\\)': 'Armure réverbérée (R)',
        'Reflected Drachen': 'Dragon réverbéré',
        'Reflected Frost \\(G\\)': 'Givre réverbéré (V)',
        'Reflected Frost \\(R\\)': 'Givre réverbéré (R)',
        'Reflected Frost Armor': 'Réverbération : Armure de givre',
        'Reflected Kick \\(G\\)': 'Jambe réverbérée (V)',
        'Reflected Shining Armor': 'Réverbération : Armure scintillante',
        'Reflected Wings \\(B\\)': 'Aile réverbérée (B)',
        'Reflected Wings \\(G\\)': 'Aile réverbérée (V)',
        'Reflected Wings \\(R\\)': 'Aile réverbérée (R)',
        'Rush': 'Jaillissement',
        'Scythe/Axe Kick': 'Jambe faucheuse/pourfendeuse',
        'Shattered World': 'Monde fracassé',
        'Shining Armor': 'Armure scintillante',
        'Skyfall': 'Anéantissement',
        'Spiteful/Embittered Dance': 'Danse de la froideur/sévérité',
        'The Path Of Light': 'Voie de lumière',
        'The House Of Light': 'Raz-de-lumière',
        'Twin Silence/Stillness': 'Entaille de la tranquilité/quiétude',
        'Twin Stillness/Silence': 'Entaille de la quiétude/tranquilité',
        'Wyrm\'s Lament': 'Rugissement du Dragon divin',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'frozen mirror': '氷面鏡',
        'great wyrm': '聖竜',
        'luminous Aether': 'ライト・エーテル',
        'Mothercrystal': 'マザークリスタル',
        'Shiva': 'シヴァ',
      },
      'replaceText': {
        'Absolute Zero': '絶対零度',
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Axe/Scythe Kick': 'アクスキック/サイスキック',
        'Banish(?! )': 'バニシュ',
        'Banish III': 'バニシュガ',
        'Biting/Driving Frost': 'フロストスラッシュ/フロストスラスト',
        'Bright Hunger': '浸食光',
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
        'Mirror, Mirror': '鏡の国',
        'Morn Afah': 'モーン・アファー',
        'Reflected Armor \\(B\\)': '反射アーマー（青）',
        'Reflected Armor \\(G\\)': '反射アーマー（緑）',
        'Reflected Armor \\(R\\)': '反射アーマー（赤）',
        'Reflected Drachen': '反射ドラゴンアーマー',
        'Reflected Frost \\(G\\)': '反射フロスト（緑）',
        'Reflected Frost \\(R\\)': '反射フロスト（赤）',
        'Reflected Frost Armor': 'ミラーリング・フロストアーマー',
        'Reflected Kick \\(G\\)': '反射キック',
        'Reflected Shining Armor': 'ミラーリング・ブライトアーマー',
        'Reflected Wings \\(B\\)': '反射ホーリーウィング（青)',
        'Reflected Wings \\(G\\)': '反射ホーリーウィング（緑）',
        'Reflected Wings \\(R\\)': '反射ホーリーウィング（赤）',
        'Rush': 'ラッシュ',
        'Scythe/Axe Kick': 'サイスキック/アクスキック',
        'Shattered World': 'シャッタード・ワールド',
        'Shining Armor': 'ブライトアーマー',
        'Skyfall': '世界消滅',
        'Spiteful/Embittered Dance': '冷厳の舞踏技 / 峻厳の舞踏技',
        'the Path of Light': '光の波動',
        'the House of Light': '光の津波',
        'Twin Silence/Stillness': '閑寂の双剣技／静寂の双剣技',
        'Twin Stillness/Silence': '静寂の双剣技／閑寂の双剣技',
        'Wyrm\'s Lament': '聖竜の咆哮',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Shiva': '希瓦',
        'Frozen Mirror': '冰面镜',
        'Mothercrystal': '母水晶',
        'Luminous Aether': '光以太',
        'great wyrm': '圣龙',
      },
      'replaceText': {
        'Absolute Zero': '绝对零度',
        'Mirror, Mirror': '镜中奇遇',
        'Biting/Driving Frost': '冰霜斩/刺',
        'Reflected Frost \\(G\\)': '连锁反斩(绿)',
        'Reflected Frost \\(R\\)': '连锁反斩(红)',
        'Diamond Frost': '钻石星尘',
        'Frigid Stone': '冰石',
        'Icicle Impact': '冰柱冲击',
        'Heavenly Strike': '天降一击',
        'Frigid Needle': '冰针',
        'Frigid Water': '冰霜',
        'Frigid Eruption': '极冰喷发',
        'Driving/Biting Frost': '冰霜刺/斩',
        'Double Slap': '双剑斩',
        'Shining Armor': '闪光护甲',
        'Axe/Scythe Kick': '阔斧/镰形回旋踢',
        'Light Rampant': '光之失控',
        'Bright Hunger': '侵蚀光',
        'The Path Of Light': '光之波动',
        'Scythe/Axe Kick': '镰形/阔斧回旋踢',
        'Reflected Kick \\(G\\)': '连锁反踢(绿)',
        'Banish III': '强放逐',
        'Shattered World': '世界分断',
        'Heart Asunder': '心碎',
        'Rush': '蓄势冲撞',
        'Skyfall': '世界消亡',
        'Akh Morn': '死亡轮回',
        'Morn Afah': '无尽顿悟',
        'Hallowed Wings': '神圣之翼',
        'Reflected Wings \\(B\\)': '连锁反翼(蓝)',
        'Reflected Wings \\(G\\)': '连锁反翼(绿)',
        'Reflected Wings \\(R\\)': '连锁反翼(红)',
        'Wyrm\'s Lament': '圣龙咆哮',
        '(?<! )Frost Armor': '冰霜护甲',
        'Twin Silence/Stillness': '闲寂/静寂的双剑技',
        'Twin Stillness/Silence': '静寂/闲寂的双剑技',
        'Drachen Armor': '圣龙护甲',
        'Akh Rhai': '天光轮回',
        'Reflected Armor \\(B\\)': '连锁反甲(蓝)',
        'Reflected Armor \\(G\\)': '连锁反甲(绿)',
        'Reflected Armor \\(R\\)': '连锁反甲(红)',
        'Holy': '神圣',
        'Embittered/Spiteful Dance': '严峻/冷峻之舞',
        'Spiteful/Embittered Dance': '冷峻/严峻之舞',
        'Reflected Drachen': '连锁反射：圣龙护甲',
        'Icelit Dragonsong': '冰与光的龙诗',
        'Draconic Strike': '圣龙一击',
        'Banish(?! )': '放逐',
        'Inescapable Illumination': '曝露光',
        'The House Of Light': '光之海啸',
        'Reflected Frost Armor \\(R\\)': '连锁反冰甲(红)',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Shiva': '시바',
        'Frozen Mirror': '얼음 거울',
        'Mothercrystal': '어머니 크리스탈',
        'Luminous Aether': '빛 에테르',
        'great wyrm': '성룡',
      },
      'replaceText': {
        'Absolute Zero': '절대영도',
        'Mirror, Mirror': '거울 나라',
        'Biting/Driving Frost': '서리 참격/일격',
        'Reflected Frost \\(G\\)': '반사된 참격/일격 (초록)',
        'Reflected Frost \\(R\\)': '반사된 참격/일격 (빨강)',
        'Diamond Frost': '다이아몬드 더스트',
        'Frigid Stone': '얼음돌',
        'Icicle Impact': '고드름 낙하',
        'Heavenly Strike': '천상의 일격',
        'Frigid Needle': '얼음바늘',
        'Frigid Water': '얼음서리',
        'Frigid Eruption': '얼음 분출',
        'Driving/Biting Frost': '서리 일격/참격',
        'Double Slap': '이중 타격',
        'Shining Armor': '빛의 갑옷',
        'Axe/Scythe Kick': '도끼차기/낫차기',
        'Light Rampant': '빛의 폭주',
        'Bright Hunger': '침식광',
        'The Path Of Light': '빛의 파동',
        'Scythe/Axe Kick': '낫차기/도끼차기',
        'Reflected Kick \\(G\\)': '반사된 낫/도끼차기 (초록)',
        'Banish III': '배니시가',
        'Shattered World': '분단된 세계',
        'Heart Asunder': '조각난 마음',
        'Rush': '부딪기',
        'Skyfall': '세계 소멸',
        'Akh Morn': '아크 몬',
        'Morn Afah': '몬 아파',
        'Hallowed Wings': '신성한 날개',
        'Reflected Wings \\(B\\)': '반사된 신성한 날개 (파랑)',
        'Reflected Wings \\(G\\)': '반사된 신성한 날개 (초록)',
        'Reflected Wings \\(R\\)': '반사된 신성한 날개 (빨강)',
        'Wyrm\'s Lament': '성룡의 포효',
        '(?<! )Frost Armor': '서리 갑옷',
        'Twin Silence/Stillness': '고요/정적의 쌍검기',
        'Twin Stillness/Silence': '정적/고요의 쌍검기',
        'Drachen Armor': '용의 갑옷',
        'Akh Rhai': '아크 라이',
        'Reflected Armor \\(B\\)': '반사된 빛의 갑옷 (파랑)',
        'Reflected Armor \\(G\\)': '반사된 빛의 갑옷 (초록)',
        'Reflected Armor \\(R\\)': '반사된 빛의 갑옷 (빨강)',
        'Holy': '홀리',
        'Embittered/Spiteful Dance': '준엄/냉엄의 무도기',
        'Spiteful/Embittered Dance': '냉엄/준엄의 무도기',
        'Reflected Drachen': '반사된 용의 갑옷',
        'Icelit Dragonsong': '얼음과 빛의 용시',
        'Draconic Strike': '용의 일격',
        'Banish(?! )': '배니시',
        'Inescapable Illumination': '폭로광',
        'The House Of Light': '빛의 해일',
        'Reflected Frost Armor \\(R\\)': '반사된 서리 갑옷 (빨강)',
      },
    },
  ],
};
