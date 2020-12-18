import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.EdensPromiseLitany,
  timelineFile: 'e10n.txt',
  timelineTriggers: [
    {
      id: 'E10N Umbra Smash',
      regex: /Umbra Smash/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'E10N Deepshadow Nova',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56E5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56E5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56E5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56E5', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E10N Forward Implosion',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56B4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56B4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56B4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56B4', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'E10N Backward Implosion',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56B7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56B7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56B7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56B7', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Front',
        },
      },
    },
    {
      id: 'E10N Forward Shadow Implosion',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56B5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56B5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56B5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56B5', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shadow Side',
          de: 'Schatten Seite',
          fr: 'Ombre à côté',
          ja: '影同じ側へ',
          cn: '影子同侧',
          ko: '그림자 쪽으로',
        },
      },
    },
    {
      id: 'E10N Backward Shadow Implosion',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56B8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56B8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56B8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56B8', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Opposite Shadow',
          de: 'Gegenüber des Schattens',
          fr: 'Ombre opposée',
          ja: '影の反対側へ',
          cn: '影子异侧',
          ko: '그림자 반대쪽으로',
        },
      },
    },
    {
      id: 'E10N Left Giga Slash',
      netRegex: NetRegexes.startsUsing({ id: '56B1', source: 'Shadowkeeper', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E10N Right Giga Slash',
      netRegex: NetRegexes.startsUsing({ id: '56AE', source: 'Shadowkeeper', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'E10N Left Right Shadow Slash',
      netRegex: NetRegexes.startsUsing({ id: ['56AF', '56B2'], source: 'Shadowkeeper' }),
      alertText: (data, matches, output) => matches.id === '56AF' ? output.left() : output.right(),
      outputStrings: {
        left: {
          en: 'Go Left of Shadows',
          de: 'Geh links vom Schatten',
          fr: 'Allez à gauche des ombres',
          ja: '影の左へ',
          cn: '影子左侧',
          ko: '그림자 왼쪽',
        },
        right: {
          en: 'Go Right of Shadows',
          de: 'Geh rechts vom Schatten',
          fr: 'Allez à droite des ombres',
          ja: '影の右へ',
          cn: '影子右侧',
          ko: '그림자 오른쪽',
        },
      },
    },
    {
      id: 'E10N Shadow\'s Edge',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0B' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B0B' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B0B' }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B0B' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'E10N Voidgate',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56DD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56DD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56DD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56DD', capture: false }),
      delaySeconds: 10, // It's 17 seconds from the time Voidgate starts casting until towers.
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Puddles',
          de: 'Flächen nehmen',
          fr: 'Allez dans les zones au sol',
          ja: '踏む',
          cn: '踩圈',
          ko: '바닥 징 밟기',
        },
      },
    },
    {
      id: 'E10N Shadow Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56E2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56E2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56E2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56E2', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Watch Tethered Dog',
          de: 'Achte auf den verbundenen Hund',
          fr: 'Regardez le chien lié',
          ja: '線で繋がった分身を注視',
          cn: '找连线的狗',
          ko: '연결된 쫄 지켜보기',
        },
      },
    },
    {
      id: 'E10N Cloak of Shadows ',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B11', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B11', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B11', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B11', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this could be better if we knew where the shadow was
          en: 'Away From Black Lines',
        },
      },
    },
    {
      // There is technically an AoE marker, but by the time it shows,
      // it's too late to get out if the player is inside the boss's hitbox.
      id: 'E10N Throne Of Shadow',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56C7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56C7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56C7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56C7', capture: false }),
      response: Responses.getOut('alert'),
    },
    {
      // There is technically a visual, but it comes up at precisely the same time as puddles.
      // Best to make sure the user is reminded.
      id: 'E10N Distant Scream',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56C6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56C6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56C6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56C6', capture: false }),
      response: Responses.knockback('alert'),
    },
  ],
};
