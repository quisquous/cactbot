import Conditions from '../../../../../resources/conditions';
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
  aetheronecrosisDuration: number;
  predationCount: number;
  predationDebuff?: string;
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
  initData: () => {
    return {
      aetheronecrosisDuration: 0,
      predationCount: 0,
    };
  },
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
    {
      id: 'P6S Predation Debuff Collect',
      // CF7 Glossal Resistance Down (Snake Icon)
      // CF8 Chelic Resistance Down (Wing Icon)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CF7', 'CF8'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => data.predationDebuff = matches.effectId,
    },
    {
      id: 'P6S Predation Bait Order',
      // Using Aetheronecrosis (CF9)
      // These come out as 20s, 16s, 12s, or 8s
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CF9' }),
      condition: Conditions.targetIsYou(),
      preRun: (data, matches) => data.aetheronecrosisDuration = parseFloat(matches.duration),
      delaySeconds: 0.1,
      durationSeconds: (_data, matches) => {
        const duration = parseFloat(matches.duration);
        // First Dual Predation is 3.7s before expiration
        // Remaining Dual Predations are 12.3s (second), 12.4s (third/fourth)
        return duration === 20 ? duration - 3.8 : duration + 12.3;
      },
      infoText: (data, matches, output) => {
        const AetheronecrosisMap: { [duration: number]: string } = {
          20.00: output.firstBait!(),
          8.00: output.secondBait!(),
          12.00: output.thirdBait!(),
          16.00: output.fourthBait!(),
        };
        const dir = data.predationDebuff === 'CF7' ? output.left!() : output.right!();
        return output.text!({ dir: dir, bait: AetheronecrosisMap[parseFloat(matches.duration)] });
      },
      outputStrings: {
        text: {
          en: '${dir}, ${bait}',
        },
        left: {
          en: 'Left (Wing Side)',
        },
        right: {
          en: 'Right (Snake Side)',
        },
        firstBait: {
          en: 'First Bait (20s)',
        },
        secondBait: {
          en: 'Second Bait (8s)',
        },
        thirdBait: {
          en: 'Third Bait (12s)',
        },
        fourthBait: {
          en: 'Fourth Bait (16s)',
        },
      },
    },
    {
      id: 'P6S Predation In First Bait Reminder',
      // Using Dual Predation (7878)
      // Delayed to give roughly same notice interval as other bait reminders
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7878', source: 'Hegemone' }),
      condition: (data) => data.aetheronecrosisDuration === 20.00,
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      infoText: (_data, _matches, output) => output.inFirstBait!(),
      outputStrings: {
        inFirstBait: {
          en: 'In (First Bait)',
        },
      },
    },
    {
      id: 'P6S Predation In Bait Reminder',
      // Using Chelic Predation (787B) and Glossal Predation (787A)
      // Player could get hit at wrong time and still get this trigger
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['787A', '787B'], source: 'Hegemone', capture: false }),
      durationSeconds: 4,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        data.predationCount = data.predationCount + 1;

        // Map duration to the predation count
        const AetheronecrosisMap: { [duration: number]: number } = {
          8.00: 1,
          12.00: 2,
          16.00: 3,
        };

        // Output for in players
        if (AetheronecrosisMap[data.aetheronecrosisDuration] === data.predationCount) {
          const inBaitMap: { [duration: number]: string } = {
            1: output.inSecondBait!(),
            2: output.inThirdBait!(),
            3: output.inFourthBait!(),
          };
          return inBaitMap[data.predationCount];
        }
      },
      outputStrings: {
        inSecondBait: {
          en: 'In (Second Bait)',
        },
        inThirdBait: {
          en: 'In (Third Bait)',
        },
        inFourthBait: {
          en: 'In (Fourth Bait)',
        },
      },
    },
    {
      id: 'P6S Predation Out',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['787A', '787B'], source: 'Hegemone' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.out!(),
      outputStrings: {
        out: Outputs.out,
      },
    },
    {
      id: 'P6S Ptera Ixou',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '787C', source: 'Hegemone', capture: false }),
      infoText: (data, _matches, output) => data.predationDebuff === 'CF7' ? output.left!() : output.right!(),
      outputStrings: {
        left: {
          en: 'Left (Wing Side)',
        },
        right: {
          en: 'Right (Snake Side)',
        },
      },
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
