import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// TODO: Add In=>Spread or Wall (+cardinal?)=>Spread callout to Hair Spray (note this is cast at other phases)
// TODO: Add In=>Healer Groups, or Wall (+cardinal?)=>Healer Groups to Deadly Twist

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.StormsCrownExtreme,
  timelineFile: 'barbariccia-ex.txt',
  timelineTriggers: [
    {
      id: 'BarbaricciaEx Knuckle Drum',
      regex: /Knuckle Drum/,
      beforeSeconds: 5,
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      id: 'BarbaricciaEx Void Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7570', source: 'Barbariccia', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'BarbaricciaEx Hair Spray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A6', source: 'Barbariccia' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'BarbaricciaEx Deadly Twist',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A7', source: 'Barbariccia', capture: false }),
      suppressSeconds: 2,
      alertText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '与治疗分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'BarbaricciaEx Void Aero III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7571', source: 'Barbariccia' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'BarbaricciaEx Secret Breeze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7580', source: 'Barbariccia', capture: false }),
      infoText: (_data, _matches, output) => output.protean!(),
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Positions',
          ja: '8方向散開',
          cn: '分散站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
  ],
};

export default triggerSet;
