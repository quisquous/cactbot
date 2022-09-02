import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  decOffset?: number;
  pathogenicCellsNumber?: number;
  pathogenicCellsDelay?: number;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Exocleaver (013E).
const firstHeadmarker = parseInt('013E', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 013E.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSixthCircleSavage,
  timelineFile: 'p6s.txt',
  triggers: [
    {
      id: 'P6S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'P6S Hemitheos\'s Dark IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7860', source: 'Hegemone', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P6S Chelic Synergy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '788A', source: 'Hegemone' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P6S Synergy',
      type: 'StartsUsing',
      // There are 7889 individual starts using casts on the two tanks as well,
      // if this trigger wanted to be more complicated.
      netRegex: NetRegexes.startsUsing({ id: '7887', source: 'Hegemone', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
          de: 'Geteilter Tankbuster',
          fr: 'Séparez les Tankbusters',
        },
      },
    },
    {
      id: 'P6S Unholy Darkness Healer Groups',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) => {
        return (/013E/).test(getHeadmarkerId(data, matches));
      },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => {
        return output.healerGroups!();
      },
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P6S Exocleaver',
      // Unholy Darkness stack headmarkers are same time as first Exocleaver
      // Exchange of Agonies headmarkers are 7s before second Exocleavers
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['7869', '786B'], source: 'Hegemone', capture: false }),
      alertText: (_data, _matches, output) => output.protean!(),
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Positions',
          ja: '8方向散開',
          cn: '八方位站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
    {
      id: 'P6S Choros Ixou Front Back',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7883', source: 'Hegemone', capture: false }),
      response: Responses.goFrontBack(),
    },
    {
      id: 'P6S Choros Ixou Sides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7881', source: 'Hegemone', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'P6S Pathogenic Cells Numbers',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) => {
        return data.me === matches.target && (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      preRun: (data, matches) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        const pathogenicCellsNumberMap: { [id: string]: number } = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        };
        data.pathogenicCellsNumber = pathogenicCellsNumberMap[correctedMatch];

        const pathogenicCellsDelayMap: { [id: string]: number } = {
          '004F': 8.6,
          '0050': 10.6,
          '0051': 12.5,
          '0052': 14.4,
          '0053': 16.4,
          '0054': 18.3,
          '0055': 20.2,
          '0056': 22.2,
        };
        data.pathogenicCellsDelay = pathogenicCellsDelayMap[correctedMatch];
      },
      durationSeconds: (data) => {
        // Because people are very forgetful,
        // show the number until you are done.
        return data.pathogenicCellsDelay;
      },
      infoText: (data, _matches, output) => output.text!({ num: data.pathogenicCellsNumber }),
      outputStrings: {
        text: {
          en: '#${num}',
          de: '#${num}',
          fr: '#${num}',
          ja: '${num}番',
          cn: '#${num}',
          ko: '${num}번째',
        },
      },
    },
    {
      id: 'P6S Exchange of Agonies Markers',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) => {
        return data.me === matches.target;
      },
      infoText: (data, matches, output) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        switch (correctedMatch) {
          case '0163':
          case '0167':
          case '0169':
            return output.stackOnYou!();
          case '0164':
          case '0165':
          case '016A':
            return output.spreadCorner!();
          case '0166':
          case '0168':
          case '016E':
            return output.donut!();
        }
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        donut: {
          en: 'Stack Donut',
          de: 'Sammeln Donut',
          fr: 'Packez-vous, donut',
          ja: '頭割り',
          cn: '集合放月环',
          ko: '도넛 장판, 쉐어',
        },
        spreadCorner: {
          en: 'Spread Corner',
          fr: 'Écartez-vous dans le coin',
        },
      },
    },
    {
      id: 'P6S Dark Dome Bait',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '788B', source: 'Hegemone', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Circles',
          de: 'Kreise ködern',
          fr: 'Attirez les cercles',
        },
      },
    },
    {
      id: 'P6S Dark Dome Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '788B', source: 'Hegemone', capture: false }),
      response: Responses.moveAway(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'Hegemone',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'Hégémone',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'ヘーゲモネー',
      },
    },
  ],
};

export default triggerSet;
