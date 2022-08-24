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
// TODO: Stack callout for the healer that gets stackmarker in phase 2?
// TODO: Call out a move for the player with Brutal Rush tether to avoid the Gust?

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
    {
      id: 'BarbaricciaEx Impact',
      regex: /Impact/,
      beforeSeconds: 5,
      response: Responses.knockback(),
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
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'In/Wall => Spread',
        },
      },
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
      id: 'BarbaricciaEx Boulder Break',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7383', source: 'Barbariccia' }),
      response: Responses.sharedTankBuster(),
    },
    {
      // Is it possible to get the order the player's gust goes off to call out a move?
      // These also favor a certain order of Tank/Healer for first set then DPS second set
      id: 'BarbaricciaEx Brutal Rush',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: (data, matches) => matches.source === data.me,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Brutal Rush tether on You',
        },
      },
    },
    {
      id: 'BarbaricciaEx Bold Boulder',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '015A' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
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
          case '0170':
            return output.triangle!();
          case '0171':
            return output.square!();
          case '0172':
            return output.cross!();
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
