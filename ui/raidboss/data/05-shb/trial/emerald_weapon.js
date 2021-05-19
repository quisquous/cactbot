import ZoneId from '../../../../../resources/zone_id';
import NetRegexes from '../../../../../resources/netregexes';
import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';

export default {
  zoneId: ZoneId.CastrumMarinum,
  timelineFile: 'emerald_weapon.txt',
  triggers: [
    {
      id: 'Emerald Emerald Shot',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5554' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5554' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5554' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5554' }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5554' }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '5554' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Emerald Optimized Ultima',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['5555', '5556', '5B0F'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['5555', '5556', '5B0F'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['5555', '5556', '5B0F'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['5555', '5556', '5B0F'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['5555', '5556', '5B0F'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: ['5555', '5556', '5B0F'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Emerald Magitek Magnetism',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5B0[56]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5594', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5594', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5594', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5594', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '5594', capture: false }),
      condition: (data) => data.seenMines || data.role !== 'tank',
      delaySeconds: 9,
      durationSeconds: 6,
      alertText: (data, _, output) => output.text(),
      run: (data) => data.seenMines = true,
      outputStrings: {
        text: {
          en: 'Get Near Tethered Mines',
          de: 'Nahe den Bomben mit gleicher Polarisierung',
          fr: 'Allez vers les mines de même polarité',
          ja: '同じ極性の爆雷に近づく',
          cn: '靠近同级地雷',
          ko: '같은 극성 폭탄쪽으로',
        },
      },
    },
    {
      id: 'Emerald Sidescathe Left',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['553F', '5540'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['553F', '5540'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['553F', '5540'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['553F', '5540'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['553F', '5540'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: ['553F', '5540'], capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Emerald Sidescathe Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['5541', '5542'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['5541', '5542'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['5541', '5542'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['5541', '5542'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['5541', '5542'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: ['5541', '5542'], capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Emerald Emerald Crusher',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['553C', '553D'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['553C', '553D'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['553C', '553D'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['553C', '553D'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['553C', '553D'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: ['553C', '553D'], capture: false }),
      // ~7s cast time.
      delaySeconds: 2,
      response: Responses.knockback(),
    },
    {
      id: 'Emerald Divide Et Impera Tankbuster',
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Emerald Primus Terminus Est',
      netRegex: NetRegexes.headMarker({ id: '00F5' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback Arrow on YOU',
          ko: '넉백 화살표 대상자',
        },
      },
    },
    {
      id: 'Emerald Secundus Terminus Est X',
      netRegex: NetRegexes.headMarker({ id: '00FE' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Cardinal With Sword',
          ko: '동서남북으로 이동',
        },
      },
    },
    {
      id: 'Emerald Secundus Terminus Est Plus',
      netRegex: NetRegexes.headMarker({ id: '00FD' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Intercardinal With Sword',
          ko: '대각위치로 이동',
        },
      },
    },
  ],
};
