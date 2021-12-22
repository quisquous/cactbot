// import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  bodyHeading?: string;
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
      alertText: (data, matches, _output) => {
        const deg = parseFloat(matches.heading) * 180 / Math.PI;
        if (matches.id === '67FD') {
          if (deg < -150 || deg > 150)
            data.bodyHeading = 'north';
          if (deg < -60 && deg > -120)
            data.bodyHeading = 'west';
          if (deg > -30 && deg < 30)
            data.bodyHeading = 'south';
          if (deg > 60 && deg < 120)
            data.bodyHeading = 'east';
        }
        if (matches.id === '67F8') {
          if (data.bodyHeading === 'north')
            return 'body north, head south';
          if (data.bodyHeading === 'west')
            return 'body west, head east';
          if (data.bodyHeading === 'south')
            return 'body south, head north';
          if (data.bodyHeading === 'east')
            return 'body east, head west';
        }
        if (matches.id === '67F7') {
          if (data.bodyHeading === 'north')
            return 'body north, head east';
          if (data.bodyHeading === 'west')
            return 'body west, head north';
          if (data.bodyHeading === 'south')
            return 'body south, head west';
          if (data.bodyHeading === 'east')
            return 'body east, head south';
        }
        if (matches.id === '67F9') {
          if (data.bodyHeading === 'north')
            return 'body north, head west';
          if (data.bodyHeading === 'west')
            return 'body west, head south';
          if (data.bodyHeading === 'south')
            return 'body south, head east';
          if (data.bodyHeading === 'east')
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
