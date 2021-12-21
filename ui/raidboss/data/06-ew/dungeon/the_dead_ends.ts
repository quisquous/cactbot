import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: cleanse Necrosis from standing in bubbles on Caustic Grebuloff.
// TODO: does Pox Flail cleave?

export interface Data extends RaidbossData {
  seenLovingEmbrace?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheDeadEnds,
  timelineFile: 'the_dead_ends.txt',
  triggers: [
    {
      id: 'DeadEnds Grebuloff Miasmata',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '653C', source: 'Caustic Grebuloff', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DeadEnds Grebuloff Certain Solitude',
      type: 'Ability',
      // Corresponds with 0037 headmarker that comes out ~0.5s later.
      netRegex: NetRegexes.ability({ id: '6EBD', source: 'Caustic Grebuloff' }),
      condition: Conditions.targetIsYou(),
      response: Responses.doritoStack(),
    },
    {
      id: 'DeadEnds Grebuloff Blighted Water',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6542', source: 'Caustic Grebuloff' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'DeadEnds Grebuloff Befoulment',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6544', source: 'Caustic Grebuloff' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Pox Flail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6540', source: 'Caustic Grebuloff' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'DeadEnds Peacekeeper Decimation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6550', source: 'Peacekeeper', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DeadEnds Peacekeeper Infantry Deterrent',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6EC7', source: 'Peacekeeper' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Peacekeeper No Future Spread',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6548', source: 'Peacekeeper' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Peacekeeper Order To Fire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6EBF', source: 'Peacekeeper', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Lasers',
        },
      },
    },
    {
      id: 'DeadEnds Peacekeeper Eclipsing Exhaust',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '654B', source: 'Peacekeeper', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'DeadEnds Peacekeeper Elimination',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '654F', source: 'Peacekeeper' }),
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'DeadEnds Ra-La Warm Glow',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '655E', source: 'Ra-la', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DeadEnds Ra-La Pity',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '655D', source: 'Ra-la' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'DeadEnds Ra-la Benevolence',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '655A', source: 'Ra-la' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'DeadEnds Ra-la Loving Embrace Right',
      type: 'StartsUsing',
      // The first Loving Embrace is a left/right cleave while the boss is in the middle of the room,
      // so give a left/right call to the safe side.  The remaining Loving Embrace casts are when
      // the boss has jumped all the way to an edge and the players are (probably) facing it and so
      // reverse the calls here.
      netRegex: NetRegexes.startsUsing({ id: '6557', source: 'Ra-la', capture: false }),
      alertText: (data, _matches, output) => data.seenLovingEmbrace ? output.right!() : output.left!(),
      run: (data) => data.seenLovingEmbrace = true,
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'DeadEnds Ra-la Loving Embrace Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6558', source: 'Ra-la', capture: false }),
      alertText: (data, _matches, output) => data.seenLovingEmbrace ? output.left!() : output.right!(),
      run: (data) => data.seenLovingEmbrace = true,
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'DeadEnds Ra-la Still Embrace',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '655C', source: 'Ra-la' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Ra-la Doom Cleanse',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '6E9' }),
      condition: (data) => data.CanCleanse(),
      alertText: (data, matches, output) => output.cleanse!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        cleanse: {
          en: 'Heal ${player} to Full',
        },
      },
    },
  ],
};

export default triggerSet;
