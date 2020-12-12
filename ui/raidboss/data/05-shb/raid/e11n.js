import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// EDEN'S PROMISE: ANAMORPHOSIS
// E11 NORMAL

// TODO: Handle Bound of Faith
// TODO: Callouts for the intermission Burnt Strike
// TODO: See whether it's possible to math out the spawn locations for Blasting Zone

export default {
  zoneId: ZoneId.EdensPromiseAnamorphosis,
  timelineFile: 'e11n.txt',
  triggers: [
    {
      id: 'E11N Burnished Glory',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5650', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5650', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5650', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5650', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E11N Powder Mark',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '564E' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '564E' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '564E' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '564E' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E11N Powder Mark Explosion',
      netRegex: NetRegexes.gainsEffect({ source: 'Fatebreaker', effectId: '993' }),
      netRegexDe: NetRegexes.gainsEffect({ source: 'Fusioniert(?:e|er|es|en) Ascian', effectId: '993' }),
      netRegexFr: NetRegexes.gainsEffect({ source: 'Sabreur De Destins', effectId: '993' }),
      netRegexJa: NetRegexes.gainsEffect({ source: 'フェイトブレイカー', effectId: '993' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 4,
      alertText: (data, _, output) => output.awayFromGroup(),
      outputStrings: {
        awayFromGroup: {
          en: 'Away from Group',
          de: 'Weg von der Gruppe',
          fr: 'Éloignez-vous du groupe',
          ja: '外へ',
          cn: '远离人群',
          ko: '다른 사람들이랑 떨어지기',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '562C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '562C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '562C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '562C', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Knockback',
          de: 'Linien AoE -> Rückstoß',
          ko: '직선 장판 -> 넉백',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '562E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '562E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '562E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '562E', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Out',
          de: 'Linien AoE -> Raus',
          ko: '직선 장판 -> 바깥으로',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5630', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5630', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5630', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5630', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave + Bait',
          de: 'Linien AoE -> Ködern',
          ko: '직선 장판 + 장판 유도',
        },
      },
    },
    {
      id: 'E11N Turn of the Heavens Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5639', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5639', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5639', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5639', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
          de: 'Feuer: Geh zu Blau',
          ko: '화염: 파랑으로',
        },
      },
    },
    {
      id: 'E11N Turn of the Heavens Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '563A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '563A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '563A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '563A', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          ko: '번개: 빨강으로',
        },
      },
    },
  ],
};
