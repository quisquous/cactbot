import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HaukkeManor,
  triggers: [
    {
      id: 'Haukke Normal Dark Mist Stun',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: ['Manor Maidservant', 'Manor Claviger', 'Lady Amandine'] }),
      netRegexDe: NetRegexes.startsUsing({ id: '2C1', source: ['Hausmädchen', 'Herrenhaus-Schlüsselträgerin', 'Lady Amandine'] }),
      netRegexFr: NetRegexes.startsUsing({ id: '2C1', source: ['Soubrette Du Manoir', 'Clavière Du Manoir', 'Dame Amandine'] }),
      netRegexJa: NetRegexes.startsUsing({ id: '2C1', source: ['御用邸のメイド', '夫人付きクラヴィジャー', 'レディ・アマンディヌ'] }),
      netRegexCn: NetRegexes.startsUsing({ id: '2C1', source: ['庄园的女仆', '随从女工', '阿芒迪娜女士'] }),
      netRegexKo: NetRegexes.startsUsing({ id: '2C1', source: ['별궁의 하녀', '부인의 청지기', '레이디 아망딘'] }),
      condition: (data) => data.CanStun(),
      suppressSeconds: 2,
      response: Responses.stun('info'),
    },
    {
      id: 'Haukke Normal Steward Soul Drain Stun',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '35C', source: 'Manor Steward' }),
      netRegexDe: NetRegexes.startsUsing({ id: '35C', source: 'Seneschall' }),
      netRegexFr: NetRegexes.startsUsing({ id: '35C', source: 'Intendant Du Manoir' }),
      netRegexJa: NetRegexes.startsUsing({ id: '35C', source: '御用邸の執事長' }),
      netRegexCn: NetRegexes.startsUsing({ id: '35C', source: '庄园的总管' }),
      netRegexKo: NetRegexes.startsUsing({ id: '35C', source: '별궁의 집사장' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun('info'),
    },
    {
      // Particle and spell effects make this particular Dark Mist hard to see.
      id: 'Haukke Normal Amandine Dark Mist Dodge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2C1', source: 'Lady Amandine', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2C1', source: 'Lady Amandine', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2C1', source: 'Dame Amandine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2C1', source: 'レディ・アマンディヌ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2C1', source: '阿芒迪娜女士', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2C1', source: '레이디 아망딘', capture: false }),
      condition: (data) => !data.CanStun(),
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'Haukke Normal Amandine Void Fire III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '356', source: 'Lady Amandine' }),
      netRegexDe: NetRegexes.startsUsing({ id: '356', source: 'Lady Amandine' }),
      netRegexFr: NetRegexes.startsUsing({ id: '356', source: 'Dame Amandine' }),
      netRegexJa: NetRegexes.startsUsing({ id: '356', source: 'レディ・アマンディヌ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '356', source: '阿芒迪娜女士' }),
      netRegexKo: NetRegexes.startsUsing({ id: '356', source: '레이디 아망딘' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt('info'),
    },
    {
      id: 'Haukke Normal Amandine Void Thunder III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '358', source: 'Lady Amandine' }),
      netRegexDe: NetRegexes.startsUsing({ id: '358', source: 'Lady Amandine' }),
      netRegexFr: NetRegexes.startsUsing({ id: '358', source: 'Dame Amandine' }),
      netRegexJa: NetRegexes.startsUsing({ id: '358', source: 'レディ・アマンディヌ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '358', source: '阿芒迪娜女士' }),
      netRegexKo: NetRegexes.startsUsing({ id: '358', source: '레이디 아망딘' }),
      condition: Conditions.targetIsYou(),
      response: Responses.getBehind('info'),
    },
    {
      // Void Lamp Spawn
      id: 'Haukke Normal Void Lamps',
      type: 'GameLog',
      netRegex: NetRegexes.message({ line: 'The void lamps have begun emitting an eerie glow.', capture: false }),
      netRegexDe: NetRegexes.message({ line: 'Die düsteren Lampen flackern unheilvoll auf.', capture: false }),
      netRegexFr: NetRegexes.message({ line: 'La lanterne sinistre luit d\'un éclat lugubre!', capture: false }),
      netRegexJa: NetRegexes.message({ line: '不気味なランプが妖しく輝き始めた！', capture: false }),
      netRegexCn: NetRegexes.message({ line: '怪异的灯开始发出令人不安的光芒。', capture: false }),
      netRegexKo: NetRegexes.message({ line: '불길한 등불이 요사스러운 빛을 발합니다!', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Turn off Lamps',
          de: 'Schalte die Lampen aus',
          fr: 'Éteignez les lampes',
          ja: '消灯する',
          cn: '关灯',
          ko: '등불 끄기',
        },
      },
    },
    {
      // Lady's Candle Spawn
      id: 'Haukke Normal Ladys Candle',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '425', capture: false }),
      response: Responses.killAdds(),
    },
    {
      // 2 Lady's Handmaiden and 1 Manor Sentry Spawn
      // The sentry outside the bosses room loads when you enter the zone.
      // This causes the trigger to go off early, parsing for the Handmaiden fixes the problem.
      // Suppression included since 2 Handmaiden's spawn at the same time
      id: 'Haukke Normal Ladys Handmaiden',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '424', capture: false }),
      suppressSeconds: 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Sentry',
          de: 'Wachposten besiegen',
          fr: 'Tuez la sentinelle',
          ja: '守衛を倒す',
          cn: '击杀守卫',
          ko: '경비원 죽이기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Manor Maidservant': 'Hausmädchen',
        'Manor Claviger': 'Schlüsselträgerin',
        'Lady Amandine': 'Lady Amandine',
        'Manor Steward': 'Seneschall',
        'The void lamps have begun emitting an eerie glow': 'Die düsteren Lampen flackern unheilvoll auf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Manor Maidservant': 'soubrette du manoir',
        'Manor Claviger': 'clavière du manoir',
        'Lady Amandine': 'dame Amandine',
        'Manor Steward': 'intendant du manoir',
        'The void lamps have begun emitting an eerie glow': 'La lanterne sinistre luit d\'un éclat lugubre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Manor Maidservant': '御用邸のメイド',
        'Manor Claviger': '御用邸のクラヴィジャー',
        'Lady Amandine': 'レディ・アマンディヌ',
        'Manor Steward': '御用邸の執事長',
        'The void lamps have begun emitting an eerie glow': '不気味なランプが妖しく輝き始めた',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Manor Maidservant': '庄园的女仆',
        'Manor Claviger': '庄园的女工',
        'Lady Amandine': '阿芒迪娜女士',
        'Manor Steward': '庄园的总管',
        'The void lamps have begun emitting an eerie glow': '怪异的灯开始发出令人不安的光芒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Manor Maidservant': '별궁의 하녀',
        'Manor Claviger': '별궁 청지기',
        'Lady Amandine': '레이디 아망딘',
        'Manor Steward': '별궁의 집사장',
        'The void lamps have begun emitting an eerie glow': '불길한 등불이 요사스러운 빛을 발합니다',
      },
    },
  ],
};

export default triggerSet;
