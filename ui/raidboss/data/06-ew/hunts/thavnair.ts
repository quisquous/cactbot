import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Yilan Bog Bomb (6A61) untelegraphed circle on a random target (can this be called?)

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Thavnair,
  triggers: [
    {
      id: 'Hunt Sugriva Spark',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A55', source: 'スグリーヴァ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A55', source: '须羯里婆', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Sugriva Scythe Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A56', source: 'スグリーヴァ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A56', source: '须羯里婆', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Sugriva Twister',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A53', source: 'スグリーヴァ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A53', source: '须羯里婆', capture: false }),
      infoText: (_data, _matches, output) => output.knockbackStack!(),
      outputStrings: {
        knockbackStack: {
          en: 'Knockback Stack',
          de: 'Rückstoß sammeln',
          fr: 'Package + Poussée',
        },
      },
    },
    {
      id: 'Hunt Sugriva Butcher',
      type: 'StartsUsing',
      // This is followed up with Rip (6A58) which is also a tank cleave.
      // We could call out 2x tank cleave, but maybe that's overkill.
      netRegex: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A59', source: 'スグリーヴァ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A59', source: '须羯里婆' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Hunt Sugriva Rock Throw',
      type: 'StartsUsing',
      // One telegraphed circle in front, then some untelegraphed ones.
      netRegex: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A59', source: 'スグリーヴァ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A59', source: '须羯里婆', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugriva Crosswind',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A5B', source: 'スグリーヴァ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A5B', source: '须羯里婆', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Yilan Forward March',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Yilan' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Yilan' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Yilan' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A6', source: 'ユラン' }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '7A6', source: '尤兰' }),
      condition: Conditions.targetIsYou(),
      // t=0.0 gain effect (this line)
      // t=6.3 Mini Light starts casting
      // t=9.0 lose effect (forced march)
      // t=12.3 Mini Light ability
      // Full duration is 9s, but have seen this apply late for ~7 to some people.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Forward March Away',
          de: 'Geistlenkung vorwärts',
          fr: 'Marche forcée en avant',
        },
      },
    },
    {
      id: 'Hunt Yilan About Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Yilan' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Yilan' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Yilan' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A7', source: 'ユラン' }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '7A7', source: '尤兰' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Backwards March Away',
          de: 'Geistlenkung rückwärts',
          fr: 'Marche forcée en arrière',
        },
      },
    },
    {
      id: 'Hunt Yilan Left Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Yilan' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Yilan' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Yilan' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A8', source: 'ユラン' }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '7A8', source: '尤兰' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Left March Away',
          de: 'Geistlenkung links',
          fr: 'Marche forcée à gauche',
        },
      },
    },
    {
      id: 'Hunt Yilan Right Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Yilan' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Yilan' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Yilan' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A9', source: 'ユラン' }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '7A9', source: '尤兰' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right March Away',
          de: 'Geistlenkung rechts',
          fr: 'Marche forcée à droite',
        },
      },
    },
    {
      id: 'Hunt Yilan Brackish Rain',
      type: 'StartsUsing',
      // Untelegraphed conal attack.
      netRegex: NetRegexes.startsUsing({ id: '6A62', source: 'Yilan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A62', source: 'Yilan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A62', source: 'Yilan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A62', source: 'ユラン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6A62', source: '尤兰', capture: false }),
      response: Responses.getBehind(),
    },
  ],
};

export default triggerSet;
