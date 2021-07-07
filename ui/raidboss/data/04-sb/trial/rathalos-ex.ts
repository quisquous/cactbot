import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// Note: no warnings for Sweeping Flames, Tail Sweep, or Roar.

// Rathalos Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheGreatHuntExtreme,
  triggers: [
    {
      id: 'RathEx Mangle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'リオレウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2853', '2863'], source: '火龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2853', '2863'], source: '리오레우스', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mangle',
          de: 'Biss und Schweifhieb',
          fr: 'Broyage',
          ja: 'アギト',
          cn: '去侧面',
          ko: '으깨기',
        },
      },
    },
    {
      id: 'RathEx Rush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'リオレウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2856', '2861'], source: '火龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2856', '2861'], source: '리오레우스', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rush',
          de: 'Stürmen',
          fr: 'Ruée',
          ja: '突進',
          cn: '龙车',
          ko: '돌진',
        },
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'リオレウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2859', '285B'], source: '火龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2859', '285B'], source: '리오레우스', capture: false }),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Flaming Recoil',
          de: 'Flammenschlag vorne',
          fr: 'Bond enflammé',
          ja: 'フレイムリコイル',
          cn: '去背面',
          ko: '반동 화염',
        },
      },
    },
    {
      id: 'RathEx Fire Breath',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0081' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire Breath on YOU',
          de: 'Feueratem auf DIR',
          fr: 'Souffle enflammé sur VOUS',
          ja: '自分にファイアブレス',
          cn: '火点名',
          ko: '화염 숨결 대상자',
        },
      },
    },
    {
      id: 'RathEx Fireball',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['0084', '005D'] }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'RathEx Adds',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Steppe Sheep', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Steppenschaf', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Mouton De La Steppe', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ステップ・シープ', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '草原绵羊', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '초원 양', capture: false }),
      condition: (data) => data.role === 'tank',
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Rathalos': 'Rathalos',
        'Steppe Sheep': 'Steppenschaf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Rathalos': 'Rathalos',
        'Steppe Sheep': 'mouton de la steppe',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Rathalos': 'リオレウス',
        'Steppe Sheep': 'ステップ・シープ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Rathalos': '火龙',
        'Steppe Sheep': '草原绵羊',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Rathalos': '리오레우스',
        'Steppe Sheep': '초원 양',
      },
    },
  ],
};

export default triggerSet;
