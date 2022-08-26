import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Better Topaz Stones guidance
// TODO: Better Topaz Cluster guidance
// TODO: Better Starving Stampede guidance

export interface Data extends RaidbossData {
  seenStones?: boolean;
  numStones?: number;
  acid?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheFifthCircle,
  timelineFile: 'p5n.txt',
  triggers: [
    {
      id: 'P5N Searing Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76D7', source: 'Proto-Carbuncle', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'P5N Searing Ray Reflected',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76D8', source: 'Proto-Carbuncle', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.acid && data.numStones)
          return output.goFrontAvoid!();
        return output.goFront!();
      },
      outputStrings: {
        goFront: Outputs.goFront,
        goFrontAvoid: {
          en: 'Go Front (avoid puddle)',
        },
      },
    },
    {
      id: 'P5N Ruby Glow',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76D[45]', source: 'Proto-Carbuncle', capture: false }),
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'P5N Crunch',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76F0', source: 'Proto-Carbuncle' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'P5N Topaz Stones Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76DF', source: 'Proto-Carbuncle', capture: false }),
      preRun: (data) => data.numStones = (data.numStones || 0) + 1,
    },
    {
      id: 'P5N Topaz Stones',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76DE', source: 'Proto-Carbuncle', capture: false }),
      infoText: (data, _matches, output) => {
        if (!data.seenStones || !data.numStones)
          return; // First time is just floor AoEs
        if (data.numStones === 2) {
          if (data.acid)
            return; // Handled in Searing Ray Reflected
          return output.getInEmptyTile!();
        }
        if (data.numStones < 4)
          return output.getInEmptyTile!();
        return output.moveAway!();
      },
      run: (data) => data.seenStones = true,
      outputStrings: {
        getInEmptyTile: {
          en: 'Get in empty tile (no stones)',
        },
        moveAway: {
          en: 'Move away from puddles',
        },
      },
    },
    {
      // Delay cleanup for a while for Topaz Stone + Searing Ray combo
      id: 'P5N Topaz Stones Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76DE', source: 'Proto-Carbuncle', capture: false }),
      delaySeconds: 9,
      run: (data) => data.numStones = 0,
    },
    {
      id: 'P5N Sonic Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76F2', source: 'Proto-Carbuncle', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P5N Acidic Slaver',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78EB', source: 'Proto-Carbuncle', capture: false }),
      run: (data) => data.acid = true,
    },
    {
      id: 'P5N Toxic Crunch',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76F1', source: 'Proto-Carbuncle' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'P5N Venom Rain',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0178' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P5N Venom Pool',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0064' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P5N Topaz Cluster',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76E6', source: 'Proto-Carbuncle', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Start in empty tile -> move to first tile',
        },
      },
    },
    {
      id: 'P5N Starving Stampede',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79E9', source: 'Proto-Carbuncle', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Start in middle -> move to first jump',
        },
      },
    },
  ],
};

export default triggerSet;
