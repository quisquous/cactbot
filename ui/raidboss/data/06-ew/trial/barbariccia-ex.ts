import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// TODO: Add In=>Spread or Wall (+cardinal?)=>Spread callout to Hair Spray (note this is cast at other phases)
// TODO: Add In=>Healer Groups, or Wall (+cardinal?)=>Healer Groups to Deadly Twist
// TODO: Verify Playstation Marker Ids match: 016F (circle), 0170 (triangle), 0171 (square), 0172 (cross)

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
    {
      id: 'BarbaricciaEx Playstation Hair Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        switch (matches.id) {
          case '016F':
            return output.circle!();
            break;
          case '0170':
            return output.triangle!();
            break;
          case '0171':
            return output.square!();
            break;
          case '0172':
            return output.cross!();
            break;
        }
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          de: 'Roter Kreis',
          fr: 'Cercle rouge',
          ja: '赤まる',
          ko: '빨강 동그라미',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
          fr: 'Triangle vert',
          ja: '緑さんかく',
          ko: '초록 삼각',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
          fr: 'Carré violet',
          ja: '紫しかく',
          ko: '보라 사각',
        },
        cross: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ja: '青バツ',
          ko: '파랑 X',
        },
      },
    },
  ],
};

export default triggerSet;
