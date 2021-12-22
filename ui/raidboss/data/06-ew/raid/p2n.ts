// import Conditions from '../../../../../resources/conditions';
// import data from '../../../../../resources/content_type';
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
  dissociationHippo?: PluginCombatantState;
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
      netRegex: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos', capture: true }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P2N Spoken Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'Hippokampos', capture: true }),
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
      alertText: (data, matches, _output) => {
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
            return 'body north, head south';
          if (bodyHeading === 'west')
            return 'body west, head east';
          if (bodyHeading === 'south')
            return 'body south, head north';
          if (bodyHeading === 'east')
            return 'body east, head west';
        }
        if (matches.id === '67F7') {
          if (bodyHeading === 'north')
            return 'body north, head east';
          if (bodyHeading === 'west')
            return 'body west, head north';
          if (bodyHeading === 'south')
            return 'body south, head west';
          if (bodyHeading === 'east')
            return 'body east, head south';
        }
        if (matches.id === '67F9') {
          if (bodyHeading === 'north')
            return 'body north, head west';
          if (bodyHeading === 'west')
            return 'body west, head south';
          if (bodyHeading === 'south')
            return 'body south, head east';
          if (bodyHeading === 'east')
            return 'body east, head north';
        }
      },
      outputStrings: {
        text: {
          en: 'Tank Laser on YOU',
          de: 'Tank Laser auf DIR',
          fr: 'Tank laser sur VOUS',
          ja: '自分にタンクレーザー',
          cn: '坦克射线点名',
          ko: '탱 레이저 대상자',
        },
      },
    },
    {
      id: 'P2N Sewage Deluge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F6', source: 'Hippokampos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Aoe get on grid',
        },
      },
    },
    {
      // Spread aoe marker on some players, not all
      id: 'P2N Tainted Flood',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6809', source: 'Hippokampos', capture: true }),
      condition: (data, matches) => matches.target === data.me,
      response: Responses.spread(),
    },
    {
      // Drops aoe zones beneath you -> run to dodge (on everyone)
      // Not working currently properly -> On you not working.
      id: 'P2N Sewage Erruption',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680D', source: 'Hippokampos', capture: false }),
      suppressSeconds: 5,
      response: Responses.spread(),
    },
    {
      // Shortly After Sewage Erruption, not every Sewage Erruption but every Predatory Sight, maybe one trigger for both
      id: 'P2N Predatory Sight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680A', source: 'Hippokampos', capture: false }),
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
          en: 'Knockback stay on grid',
        },
      },
    },
    {
      // Aoe from outside the arena
      id: 'P2N Dissociation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6806', source: 'Hippokampos', capture: true }),
      delaySeconds: 1,
      alertText: (data, matches, output) => {
        const xcord = parseFloat(matches.x);
        if (xcord === 110)
          return output.e!();
        if (xcord === 90)
          return output.w!();
      },
      outputStrings: {
        e: Outputs.east,
        w: Outputs.west,
      },
    },
  ],
};

export default triggerSet;
