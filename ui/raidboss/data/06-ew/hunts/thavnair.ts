import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Sugriva Butcher tankbuster conal cleave
// TODO: Sugriva Rip conal with Concussion dot
// TODO: Sugriva Rock Throw (away front front circles)
// TODO: Yilan Brackish Rain (?) frontal untelegraphed(?) cleave
// TODO: Yilan Bog Bomb untelegraphed circle on a random target (can this be called?)

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
      // Is this "in" or "under"?
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Hunt Sugriva Scythe Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A56', source: 'スグリーヴァ', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Sugriva Twister',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A53', source: 'スグリーヴァ', capture: false }),
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
      id: 'Hunt Sugriva Crosswind',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A5B', source: 'スグリーヴァ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Yilan Forward March',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Sugriva' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Sugriva' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Sugriva' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A6', source: 'スグリーヴァ' }),
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
          fr: 'Marche forcée avant',
        },
      },
    },
    {
      id: 'Hunt Yilan About Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Sugriva' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Sugriva' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Sugriva' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A7', source: 'スグリーヴァ' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Backwards March Away',
          de: 'Geistlenkung rückwärts',
          fr: 'Marche forcée arrière',
        },
      },
    },
    {
      id: 'Hunt Yilan Left Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Sugriva' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Sugriva' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Sugriva' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A8', source: 'スグリーヴァ' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Left March Away',
          de: 'Geistlenkung links',
          fr: 'Marche forcée gauche',
        },
      },
    },
    {
      id: 'Hunt Yilan Right Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Sugriva' }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Sugriva' }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Sugriva' }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '7A9', source: 'スグリーヴァ' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right March Away',
          de: 'Geistlenkung rechts',
          fr: 'Marche forcée droite',
        },
      },
    },
  ],
};

export default triggerSet;
