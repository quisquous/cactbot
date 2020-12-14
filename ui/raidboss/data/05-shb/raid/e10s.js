import { Util } from '../../../../../resources/common.js';
import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: could use giga slash "get in" here for four slashes
// TODO: Fix headmarkers for groups running multiple of the same job ?

// Note: there's no headmarker ability line for cleaving shadows.

export default {
  zoneId: ZoneId.EdensPromiseLitanySavage,
  timelineFile: 'e10s.txt',
  triggers: [
    {
      id: 'E10S Deepshadow Nova',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '573E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '573E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '573E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '573E', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E10S Implosion Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F0', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shadow Side',
          de: 'Schatten Seite',
          ko: '그림자 방향',
          cn: '影子同侧',
        },
      },
    },
    {
      id: 'E10S Implosion Tail',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F3', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Opposite Shadow',
          de: 'Gegenüber des Schattens',
          ko: '그림자 반대쪽',
          cn: '影子异侧',
        },
      },
    },
    {
      id: 'E10S Throne Of Shadow',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5717', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5717', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5717', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5717', capture: false }),
      response: Responses.getOut('alert'),
    },
    {
      id: 'E10S Giga Slash Shadow Single Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56EA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56EA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56EA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56EA', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Left of Shadow',
          de: 'Geh links vom Schatten',
          ko: '그림자 왼쪽',
          cn: '影子左侧',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Single Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56ED', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56ED', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56ED', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56ED', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Right of Shadow',
          de: 'Geh rechts vom Schatten',
          ko: '그림자 오른쪽',
          cn: '影子右侧',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Quadruple Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F4', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Left of Shadows',
          de: 'Geh links vom Schatten',
          ko: '그림자 왼쪽',
          cn: '影子左侧',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Quadruple Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F8', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Right of Shadows',
          de: 'Geh rechts vom Schatten',
          ko: '그림자 오른쪽',
          cn: '影子右侧',
        },
      },
    },
    {
      id: 'E10S Umbra Smash',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BAA' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5BAA' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5BAA' }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5BAA' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
      run: (data, matches) => {
        data.umbraTarget = matches.target;
      },
    },
    {
      id: 'E10S Darkness Unleashed',
      // Cast on self, with no player target.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B0E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B0E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B0E', capture: false }),
      alertText: (data, _, output) => {
        if (data.me === data.umbraTarget)
          return output.avoidStack();
        return output.stack();
      },
      outputStrings: {
        avoidStack: {
          en: 'Avoid Stack!',
          de: 'Nicht Sammeln!',
          fr: 'Ne vous packez pas !',
          ko: '공격 피하기',
          cn: '不要重合!',
        },
        stack: {
          en: 'Stack',
          de: 'Sammeln',
          fr: 'Packez-vous',
          ja: '頭割り',
          cn: '分摊',
          ko: '쉐어뎀',
        },
      },
    },
    {
      id: 'E10S Shadow\'s Edge',
      // Cast on self, with no player target.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0C' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B0C' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B0C' }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B0C' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'E10S Giga Slash Shadow Drop Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B2D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B2D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B2D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B2D', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Left Cleave',
          de: 'Linker Cleave',
          ko: '왼쪽 장판',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Drop Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B2C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B2C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B2C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B2C', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Right Cleave',
          de: 'Rechter Cleave',
          ko: '오른쪽 장판',
        },
      },
    },
    {
      id: 'E10S Shadow Cleave',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5718', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5718', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5718', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5718', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop Shadow Out',
          de: 'Schatten draußen ablegen',
          fr: 'Déposez l\'ombre à l\'extérieur',
          ko: '그림자 바깥에 떨어뜨리기',
          cn: '影子放到外圈',
        },
      },
      run: (data) => data.clones = true,
    },
    {
      // This checks your shadow's job against your job, since your shadow has
      // the same job as you. If there's multiple of one job, or a shadow has
      // a job of 0 (player died), then return '?' for the affected players.
      id: 'E10S Shadow Of A Hero',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Shadow Of A Hero' }),
      condition: (data) => data.clones,
      run: (data, matches) => {
        data.myClone = data.myClone || [];
        const clonesJob = parseInt(matches.job, 16).toString();
        if (clonesJob === Util.jobToJobEnum(data.job))
          data.myClone.push(matches.id.toUpperCase());
      },
    },
    {
      id: 'E10S Shadow Of A Hero Head Marker Map',
      netRegex: NetRegexes.headMarker({ target: 'Shadow Of A Hero' }),
      condition: (data) => !data.shadowMarkerMap,
      suppressSeconds: 1,
      run: (data, matches) => {
        data.shadowMarkerMap = {};
        const idPivot = parseInt(matches.id, 16);
        for (let i = 0; i < 3; ++i) {
          const hexPivot = (idPivot + i).toString(16).toUpperCase().padStart(4, '0');
          data.shadowMarkerMap[hexPivot] = i + 1;
        }
      },
    },
    {
      id: 'E10S Shadow Of A Hero Head Marker',
      netRegex: NetRegexes.headMarker({ target: 'Shadow Of A Hero' }),
      condition: (data) => !data.headMarkerTriggered,
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        if (!data.myClone || data.myClone.length !== 1) {
          data.headMarkerTriggered = true;
          return output.unknown();
        }
        if (matches.targetId === data.myClone[0]) {
          data.headMarkerTriggered = true;
          return output[data.shadowMarkerMap[matches.id]]();
        }
      },
      outputStrings: {
        '1': {
          en: '1',
          de: '1',
          fr: '1',
          cn: '1',
          ko: '1',
        },
        '2': {
          en: '2',
          de: '2',
          fr: '2',
          cn: '2',
          ko: '2',
        },
        '3': {
          en: '3',
          de: '3',
          fr: '3',
          cn: '3',
          ko: '3',
        },
        'unknown': {
          en: '?',
          de: '?',
          fr: '?',
          ja: '?',
          cn: '?',
          ko: '?',
        },
      },
    },
    {
      id: 'E10S Dualspell 1',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '573A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '573A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '573A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '573A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '1 out, 2+3 in',
          de: '1 raus, 2+3 rein',
          fr: '1 extérieur, 2+3 intérieur',
          ko: '1 바깥, 2+3 안쪽',
          cn: '麻将1出，2+3进',
        },
      },
    },
    {
      id: 'E10S Dualspell 2',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '573A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schattenkönig', id: '573A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Roi De L\'Ombre', id: '573A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '影の王', id: '573A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '2 out, 1+3 in',
          de: '2 raus, 1+3 rein',
          fr: '2 extérieur, 1+3 intérieur',
          ko: '2 바깥, 1+3 안쪽',
          cn: '麻将2出，1+3进',
        },
      },
    },
    {
      id: 'E10S Dualspell 3',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '573A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schattenkönig', id: '573A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Roi De L\'Ombre', id: '573A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '影の王', id: '573A', capture: false }),
      delaySeconds: 3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '3 out, 1+2 in',
          de: '3 raus, 1+2 rein',
          fr: '3 extérieur, 1+2 intérieur',
          ko: '3 바깥, 1+2 안쪽',
          cn: '麻将3出，1+3进',
        },
      },
    },
    {
      id: 'E10S Shadowkeeper 1',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5720', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5720', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5720', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5720', capture: false }),
      suppressSeconds: 99999,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop Shadow Max Melee',
          de: 'Lege den Schatten im max Melee Bereich ab',
          fr: 'Déposez l\'ombre au max de la portée',
          ko: '그림자 칼끝딜 위치에 떨어뜨리기',
          cn: '近战把影子放到最远',
        },
      },
      run: (data) => delete data.clones,
    },
    {
      id: 'E10S Swath of Silence',
      netRegex: NetRegexes.startsUsing({ source: 'Shadow Of A Hero', id: '5BBF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schatten Eines Helden', id: '5BBF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ombre De Héros', id: '5BBF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '英雄の影', id: '5BBF', capture: false }),
      suppressSeconds: 3,
      response: Responses.getUnder(),
    },
    {
      id: 'E10S Distant Scream',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5716', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5716', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5716', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5716', capture: false }),
      response: Responses.knockback('alert'),
    },
    {
      id: 'E10S Umbral Orbs',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5731', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5731', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5731', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5731', capture: false }),
      // TODO: maybe 4?
      delaySeconds: 3.5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orbs',
          de: 'Orbs',
          fr: 'Orbes',
          ko: '구슬',
          cn: '球',
        },
      },
    },
    {
      id: 'E10S Shadow Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5739', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5739', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5739', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5739', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Watch Tethered Dog',
          de: 'Achte auf den verbundenen Hund',
          fr: 'Regardez le chien lié',
          ko: '연결된 쫄 지켜보기',
          cn: '找连线的狗',
        },
      },
    },
    {
      id: 'E10S Fade To Shadow',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '572B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '572B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '572B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '572B', capture: false }),
      delaySeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this could be better if we knew where the shadow was
          // TODO: this also happens twice, with tethers
          en: 'Be On Squiggles',
          de: 'Sei auf dem Kringel',
          ko: '구불구불한 선 쪽으로',
          cn: '站到连线为曲线的一侧',
        },
      },
    },
    {
      id: 'E10S Cloak of Shadows 1',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '5B13', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schattenkönig', id: '5B13', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Roi De L\'Ombre', id: '5B13', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '影の王', id: '5B13', capture: false }),
      delaySeconds: 4,
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this could be better if we knew where the shadow was
          en: 'Away From Squiggles',
          de: 'Weg vom Kringel',
          ko: '곧은 선 쪽으로',
          cn: '远离连线为曲线的一侧',
        },
      },
    },
    {
      // TODO: I saw once a 5700 then 5702 for the second implosion at 452.7
      // TODO: are the double implosions always the same??
      id: 'E10S Quadruple Implosion Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56FC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56FC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56FC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56FC', capture: false }),
      durationSeconds: 6,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shadow Side',
          de: 'Schatten Seite',
          ko: '그림자 방향',
          cn: '影子同侧',
        },
      },
    },
    {
      id: 'E10S Quadruple Implosion Tail',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5700', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5700', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5700', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5700', capture: false }),
      durationSeconds: 6,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Opposite Shadow',
          de: 'Gegenüber des Schattens',
          ko: '그림자 반대쪽',
          cn: '影子异侧',
        },
      },
    },
    {
      id: 'E10S Voidgate',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5734', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5734', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5734', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5734', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleaves with towers',
          de: 'Cleaves mit Türmen',
          ko: '기둥이랑 그림자 유도 동시에',
          cn: '影子+塔',
        },
      },
    },
    {
      id: 'E10S Voidgate Second Tower',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5734', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5734', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5734', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5734', capture: false }),
      delaySeconds: 23.3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Towers first, then cleaves',
          de: 'Zuerst Türme, dann cleaves',
          fr: 'Tours en premier puis cleaves',
          ko: '기둥 먼저, 그다음 그림자 유도',
          cn: '先塔后影子',
        },
      },
    },
    {
      id: 'E10S Pitch Bog',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5721', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5721', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5721', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5721', capture: false }),
      infoText: (data, _, output) => {
        if (data.seenPitchBog)
          return output.secondPitchBog();
        return output.firstPitchBog();
      },
      run: (data) => data.seenPitchBog = true,
      outputStrings: {
        firstPitchBog: {
          en: 'Puddles outside',
          de: 'Flächen nach draußen',
          fr: 'Zones au sol à l\'extérieur',
          ko: '장판 바깥쪽에 깔기',
          cn: '点名放到外圈',
        },
        secondPitchBog: {
          en: 'Final Puddle Positions',
          de: 'Flächen interkardinal ablegen',
          fr: 'Zones au sol en intercardinal',
          ko: '각자 장판 위치로',
          cn: '最后一次点名放到外圈',
        },
      },
    },
    {
      id: 'E10S Shackled Apart',
      netRegex: NetRegexes.tether({ id: '0082' }),
      condition: function(data, matches) {
        return matches.source === data.me || matches.target === data.me;
      },
      alertText: function(data, matches, output) {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.text({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Far Tethers (${player})',
          de: 'Entfernte Verbindungen (${player})',
          fr: 'Liens éloignés (${player})',
          ja: ' (${player})に離れ',
          cn: '远离连线 (${player})',
          ko: '상대와 떨어지기 (${player})',
        },
      },
    },
    {
      id: 'E10S Shackled Together',
      netRegex: NetRegexes.tether({ id: '0081' }),
      condition: function(data, matches) {
        return matches.source === data.me || matches.target === data.me;
      },
      alertText: function(data, matches, output) {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.text({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Close Tethers (${player})',
          de: 'Nahe Verbindungen (${player})',
          fr: 'Liens proches (${player})',
          ja: '(${player})に近づく',
          cn: '靠近连线 (${player})',
          ko: '상대와 가까이 붙기 (${player})',
        },
      },
    },
    {
      // TODO: this mechanic needs a lot more love
      id: 'E10S Voidgate Amplifier',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BCF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5BCF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5BCF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5BCF', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pick up Puddles',
          de: 'Fläche nehmen',
          fr: 'Prenez les zones au sol',
          ko: '장판 밟아서 그림자 선 가져오기',
          cn: '踩放下的沼泽',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Shadowkeeper': 'Schattenkönig',
        'Shadow Of A Hero': 'Schatten eines Helden',
        'Shadefire': 'Schattenfeuer',
      },
      'replaceText': {
        'Deepshadow Nova': 'Dunkelschatten-Nova',
        'Implosion': 'Implosion',
        'Throne Of Shadow': 'Schattenthron',
        'Giga Slash': 'Giga-Schlag',
        'Umbra Smash': 'Schattenschlag',
        'Darkness Unleashed': 'Schattenentfesselung',
        'Shadow\'s Edge': 'Schattenhieb',
        'Shadow Cleave': 'Schattenpein',
        'Dualspell': 'Doppelzauber',
        'Blighting Blitz': 'Vernichtungsaktion',
        'Shadowkeeper': 'Schattenkönig',
        'Swath Of Silence': 'Schwade der Stille',
        'Shadow Servant': 'Schattendiener',
        'Distant Scream': 'Ferner Schrei',
        'Umbral Orbs': 'Schattenkugel',
        'Flameshadow': 'Schattenflamme',
        'Spawn Shadow': 'Schattenerscheinung',
        'Shadow Warrior': 'Schattenkrieger',
        'Fade To Shadow': 'Schattenimmersion',
        'Cloak Of Shadows': 'Mantel des Schattens',
        'Voidgate(?! Amplifier)': 'Nichtsportal',
        'Void Pulse': 'Nichtspulsieren',
        'Pitch Bog': 'Schattensumpf',
        'Shackled Apart': 'Kettenbruch',
        'Voidgate Amplifier': 'Verstärktes Nichtsportal',
        'Shadowy Eruption': 'Schatteneruption',
        'Shackled Together': 'Schattenfesseln',
        'Doom Arc': 'Verhängnisvoller Bogen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Shadowkeeper': 'Ordre royal',
        'Shadow Of A Hero': 'ombre de héros',
        'Shadefire': 'Feu ombral',
      },
      'replaceText': {
        'Deepshadow Nova': 'Nova de la pleine-ombre',
        'Implosion': 'Implosion',
        'Throne Of Shadow': 'Trône de l\'Ombre',
        'Giga Slash': 'Taillade tournoyante',
        'Umbra Smash': 'Fracas ombral',
        'Darkness Unleashed': 'Déchaînement ombral',
        'Shadow\'s Edge': 'Taillade ombrale',
        'Shadow Cleave': 'Fendoir ombral',
        'Dualspell': 'Double sort',
        'Blighting Blitz': 'Frappe putréfiante',
        'Shadowkeeper': 'Ordre royal',
        'Swath Of Silence': 'Fauchage silencieux',
        'Shadow Servant': 'Serviteur de l\'Ombre',
        'Distant Scream': 'Hurlement de l\'Ombre',
        'Umbral Orbs': 'Orbe ombrale',
        'Flameshadow': 'Flamme ombrale',
        'Spawn Shadow': 'Ombres croissantes',
        'Shadow Warrior': 'Ombre du roi',
        'Fade To Shadow': 'Immersion abyssale',
        'Cloak Of Shadows': 'Cape de l\'Ombre',
        'Voidgate(?! Amplifier)': 'Porte du néant',
        'Void Pulse': 'Pulsation du néant',
        'Pitch Bog': 'Marais ombral',
        'Shackled Apart': 'Chaînes de rupture',
        'Voidgate Amplifier': 'Porte du néant amplifiée',
        'Shadowy Eruption': 'Éruption ombrale',
        'Shackled Together': 'Chaînes d\'union',
        'Doom Arc': 'Arc fatal',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Shadowkeeper': '影の王命',
        'Shadow Of A Hero': '英雄の影',
        'Shadefire': 'シャドウファイア',
      },
      'replaceText': {
        'Deepshadow Nova': 'ディープシャドウノヴァ',
        'Implosion': 'インプロージョン',
        'Throne Of Shadow': '影の王権',
        'Giga Slash': 'ギガスラッシュ',
        'Umbra Smash': 'アンブラスマッシュ',
        'Darkness Unleashed': 'シャドウアンリーシュ',
        'Shadow\'s Edge': 'シャドウスラッシュ',
        'Shadow Cleave': 'シャドウクリーヴ',
        'Dualspell': 'ダブルスペル',
        'Blighting Blitz': 'ブライティングブリッツ',
        'Shadowkeeper': '影の王命',
        'Swath Of Silence': 'サイレントスアス',
        'Shadow Servant': '影の従僕',
        'Distant Scream': '影の遠吠え',
        'Umbral Orbs': 'アンブラルオーブ',
        'Flameshadow': 'シャドウフレイム',
        'Spawn Shadow': 'スポーンシャドウ',
        'Shadow Warrior': '影武者',
        'Fade To Shadow': '影潜り',
        'Cloak Of Shadows': 'クローク・オブ・シャドウ',
        'Voidgate(?! Amplifier)': 'ヴォイドゲート',
        'Void Pulse': 'ヴォイドパルセーション',
        'Pitch Bog': 'シャドウスワンプ',
        'Shackled Apart': '離別の鎖',
        'Voidgate Amplifier': 'ヴォイドゲート・アンプリファイア',
        'Shadowy Eruption': 'シャドウエラプション',
        'Shackled Together': '束縛の鎖',
        'Doom Arc': 'ドゥームアーク',
      },
    },
  ],
};
