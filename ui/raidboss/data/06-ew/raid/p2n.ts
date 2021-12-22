// import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
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
      netRegex: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos', capture: true }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P2N Spoken Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67FD', '67F8', '67F7', '67F9'], source: 'Hippokampos', capture: true }),
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
          console.error('SpokenCataract: There are more than one Hippo?!?: ${JSON.stringify(hippos)}');
          return;
        }
        data.bodyActor = hippos[0];
      },
      alertText: (data, matches, _output) => {
        // return 'body' + data.bodyActor?.Heading;
        if (!data.bodyActor?.Heading) {
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
  ],
};

export default triggerSet;
