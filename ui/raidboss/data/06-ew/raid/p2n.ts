import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  bodyActor?: PluginCombatantState;
}

const triggerSet: TriggerSet<Data> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  zoneId: ZoneId.AsphodelosTheSecondCircle,
  timelineFile: 'p2n.txt',
  triggers: [
    {
      id: 'P2N Murky Depths',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680F', source: 'Hippokampos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P2N Doubled Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P2N Spoken Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'Hippokampos' }),
      delaySeconds: 1,
      promise: async (data) => {
        const callData = await callOverlayHandler({
          call: 'getCombatants',
        });
        if (!callData || !callData.combatants || !callData.combatants.length) {
          console.error('SpokenCataract: failed to get combatants: ${JSON.stringify(callData)}');
          return;
        }
        // This is the real hippo, according to hp.
        const hippos = callData.combatants.filter((c) => c.BNpcID === 13721);
        if (hippos.length !== 1) {
          console.error('SpokenCataract: There is not exactly one Hippo?!?: ${JSON.stringify(hippos)}');
          data.bodyActor = undefined;
          return;
        }
        data.bodyActor = hippos[0];
      },
      alertText: (data, matches, output) => {
        if (!data.bodyActor) {
          console.error('SpokenCataract: No boss actor found. Did the promise fail?');
          return;
        }
        const heading = data.bodyActor?.Heading;
        let bodyHeading = null;

        if (heading < -3.0 || heading > 3.0)
          bodyHeading = 'north';
        if (heading < -1.56 && heading > -1.58)
          bodyHeading = 'west';
        if (heading > -0.1 && heading < 0.1)
          bodyHeading = 'south';
        if (heading > 1.56 && heading < 1.58)
          bodyHeading = 'east';

        if (matches.id === '67F8') {
          if (bodyHeading === 'north')
            return output.nw!() + '/' + output.ne!();
          if (bodyHeading === 'west')
            return output.nw!() + '/' + output.sw!();
          if (bodyHeading === 'south')
            return output.sw!() + '/' + output.se!();
          if (bodyHeading === 'east')
            return output.ne!() + '/' + output.se!();
        }
        if (matches.id === '67F7') {
          if (bodyHeading === 'north')
            return output.w!();
          if (bodyHeading === 'west')
            return output.s!();
          if (bodyHeading === 'south')
            return output.e!();
          if (bodyHeading === 'east')
            return output.n!();
        }
        if (matches.id === '67F9') {
          if (bodyHeading === 'north')
            return output.e!();
          if (bodyHeading === 'west')
            return output.n!();
          if (bodyHeading === 'south')
            return output.w!();
          if (bodyHeading === 'east')
            return output.s!();
        }
      },
      outputStrings: {
        n: Outputs.north,
        e: Outputs.east,
        w: Outputs.west,
        s: Outputs.south,
        ne: Outputs.northeast,
        nw: Outputs.northwest,
        se: Outputs.southeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'P2N Sewage Deluge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F6', source: 'Hippokampos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Aoe--Get on grid',
        },
      },
    },
    {
      // Spread aoe marker on some players, not all
      id: 'P2N Tainted Flood',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6809', source: 'Hippokampos' }),
      condition: (data, matches) => matches.target === data.me,
      response: Responses.spread(),
    },
    {
      // Drops aoe zones beneath you -> run to dodge (on everyone)
      id: 'P2N Sewage Erruption',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680D', source: 'Hippokampos', capture: false }),
      suppressSeconds: 5,
      response: Responses.spread(),
    },
    {
      id: 'P2N Predatory Sight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680A', source: 'Hippokampos', capture: false }),
      delaySeconds: 3,
      response: Responses.doritoStack(),
    },
    {
      // Raidwide knockback -> dont get knocked into slurry
      id: 'P2N Shockwave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6807', source: 'Hippokampos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback--Stay on grid',
        },
      },
    },
    {
      // Aoe from head outside the arena
      id: 'P2N Dissociation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6806', source: 'Hippokampos' }),
      alertText: (_data, matches, output) => {
        const xcord = parseFloat(matches.x);
        if (xcord === 110)
          return output.w!();
        if (xcord === 90)
          return output.e!();
      },
      outputStrings: {
        e: Outputs.east,
        w: Outputs.west,
      },
    },
  ],
};

export default triggerSet;
