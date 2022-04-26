import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

type Phases = 'doorboss' | 'thordan';

export interface Data extends RaidbossData {
  phase: Phases;
  decOffset?: number;
  headmarkers: { [name: string]: string };
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  'hyperdimensionalSlash': parseInt('0115', 16),
} as const;
const firstMarker: { [phase in Phases]: number } = {
  'doorboss': headmarkers.hyperdimensionalSlash,
  'thordan': -1,
} as const;

const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker'], firstDecimalMarker: number) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
// TODO remove this when used.
console.assert(getHeadmarkerId);

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  initData: () => {
    return {
      headmarkers: {},
      phase: 'doorboss',
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            data.phase = 'thordan';
            break;
        }
      },
    },
    {
      id: 'DSR Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker = firstMarker[data.phase];
        data.headmarkers[matches.target] = getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4', capture: false }),
      infoText: (_data, _matches, output) => output.aoe!(),
      outputStrings: {
        aoe: Outputs.aoe,
      },
    },
    // 0x62D1 = Holy Shield Bash, single target damage on tethered player
    // 0x63EB = Holy Shield Bash, line charge aoe at tethered player
    // Charge applies 0xC5D Down for the Count
    // Followup is 0x62D2 (single target) and 0x62D3 (aoe) Holy Bladedance tank busters
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA', capture: false }),
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Tether',
          de: 'Tank Verbindung',
          fr: 'Lien tank',
          ja: 'タンク 線を取る',
          cn: '坦克接线远离人群',
          ko: '탱 블래스터 징',
        },
      },
    },
    {
      id: 'DSR Heavensblaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DD', capture: true }),
      response: Responses.stackMarkerOn(),
    },
    // This covers doorboss Hyperdimensional Slash
    // 62D6 = cast
    // 62D7 = lines on headmarker'd players
    // 63EE = baited cone
    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ capture: false }),
      condition: (data) => data.phase === 'doorboss',
      delaySeconds: 0.1,
      infoText: (data, _matches, output) => {
        if (data.headmarkers[data.me])
          return output.spread!();

        return output.stack!();
      },
      outputStrings: {
        stack: Outputs.stackMarker,
        spread: Outputs.spread,
      },
    },
    // #region Unknown Triggers
    // This ability seems to fire just before doorboss headmarkers?
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 62E9 ',
      type: 'Ability',
      disabled: true,
      netRegex: NetRegexes.ability({ id: '62E9', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    // #endregion
    // #region Placeholder/Test Triggers
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 62CC Brightblade\'s Steel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62CC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 62CD The Bull\'s Steel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62CD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 62D0 Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 62DE Heavensflame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63C0 Broad Swing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63C1 Broad Swing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63C7 Heavenly Heel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C7', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63C8 Ascalon\'s Mercy Concealed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C8', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63CA Ascalon\'s Mercy Revealed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63CA', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63CC Lightning Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63CC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63CE the Dragon\'s Rage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63CE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63D0 the Dragon\'s Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63D3 Strength of the Ward',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63D5 Heavy Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63DB Dimensional Collapse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63DB', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63DE Conviction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63DE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63E1 Sanctity of the Ward',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63E1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63E4 Altar Flare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63E4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63E6 Hiemal Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63E6', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63E8 Holy Comet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63E8', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63F0 ',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63F0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 63F1 ',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63F1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 670B Drachenlance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '670B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6712 Gnash and Lash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6712', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6713 Lash and Gnash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6713', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 68BE Hatebound',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68BE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 68C3 Mirage Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68C3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 695B Pierce',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '695B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6B86 Incarnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B86', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6B87 the Dragon\'s Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B87', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6B89 Wrath of the Heavens',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B89', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6B92 Death of the Heavens',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B92', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6B95 Wings of Salvation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B95', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6B97 Holy Meteor',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B97', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D23 Hallowed Wings',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D23', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D24 Hallowed Wings',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D24', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D26 Hallowed Wings',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D26', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D27 Hallowed Wings',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D27', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D2B Hot Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D2B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D2D Hot Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D2D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D32 Dread Wyrmsbreath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D32', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D33 Dread Wyrmsbreath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D33', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D34 Great Wyrmsbreath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D35 Great Wyrmsbreath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D35', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D41 Akh Afah',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D41', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D43 Akh Afah',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D43', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D45 Wroth Flames',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D45', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D93 _rsv_28051_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D93', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D99 _rsv_28057_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D99', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6D9B _rsv_28059_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6E2E _rsv_28206_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6E2E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6FAE Heavens\' Stake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FAE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 6FEA Conviction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FEA', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 737B Conviction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '737B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED NONAOE 7437 Blizzard',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7437', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 62CF Bright Flare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62CF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 62DB Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 62DC Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 62E2 Spear of the Fury',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62E2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 62E4 Pure of Heart',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62E4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 631A Skyblind',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '631A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63C3 Aetheric Burst',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63C6 Ancient Quaga',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C6', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63C9 Ascalon\'s Mercy Concealed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C9', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63D4 Spiral Thrust',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63D6 Heavy Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D6', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63DC Dimensional Collapse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63DC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63DF Conviction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63DF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 63E5 Altar Flare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63E5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 670A Geirskogul',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '670A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 670C Drachenlance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '670C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 670D Dive from Grace',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '670D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6711 Darkdragon Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6711', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6717 Darkdragon Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6717', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6718 Darkdragon Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6718', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6719 Darkdragon Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6719', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 671A Darkdragon Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '671A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6722 Revenge of the Horde',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6722', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6729 Flame Blast',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6729', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 68BD Steep in Rage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68BD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6B88 Aetheric Burst',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B88', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6B8B Twisting Dive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B8B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6B8D Cauterize',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B8D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6B8E Cauterize',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B8E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6B93 Spear of the Fury',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B93', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6B96 Wings of Salvation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B96', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D21 Revenge of the Horde',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D21', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D2C Hot Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D2C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D2E Hot Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D2E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D38 Swirling Blizzard',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D38', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D3E Cauterize',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D3E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D3F Cauterize',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D3F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D46 Akh Morn',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D46', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D9A _rsv_28058_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6D9C _rsv_28060_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6DD2 _rsv_28114_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DD2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6DD3 _rsv_28115_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DD3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6FAF Heavens\' Stake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FAF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6FB0 Heavens\' Stake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FB0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 6FEB Conviction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FEB', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 730C _rsv_29452_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '730C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 730D _rsv_29453_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '730D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 730E _rsv_29454_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '730E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 730F _rsv_29455_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '730F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 7310 _rsv_29456_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7310', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 7311 _rsv_29457_-1_1_C0_0Action',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7311', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 737C Conviction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '737C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER CASTED AOE 7436 Revenge of the Horde',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7436', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },

    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 62CE Shining Blade',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62CE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 62D8 Dimensional Torsion',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D8', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6315 Hyperdimensional Slash',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6315', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6317 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6317', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63BC ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63BC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63BD Ultimate End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63BD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63BF ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63BF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63C4 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63E2 Shining Blade',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63ED Knights of the Round',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63ED', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63F2 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63F2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63F3 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63F3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 63F4 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63F4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6667 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6667', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6708 Final Chorus',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6708', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 68BB attack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68BB', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 68C7 Creeping Shadows',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C7', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6B85 Spiral Pierce',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B85', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6B8A Spiral Pierce',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D22 Wyrmclaw',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D22', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D2A Wyrmclaw',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D2A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D2F ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D2F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D40 Touchdown',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D40', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D94 _rsv_28052_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D94', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D95 _rsv_28053_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D95', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6D9E Trinity',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D9E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 6E2F _rsv_28207_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6E2F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 717A ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '717A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT NONAOE 72B5 ',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72B5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 62D5 Execution',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 62D9 Dimensional Purgation',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D9', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 62DF Heavensflame',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62DF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 62E0 Holy Chain',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62E0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 62E1 Planar Prison',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62E1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 62E3 Shockwave',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62E3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6316 Brightwinged Flight',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6316', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6318 Shockwave',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6318', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6319 Brightwing',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6319', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63BB attack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63BB', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63BE Ultimate End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63BE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63C2 Broad Swing',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63C5 Ascalon\'s Might',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63CB Ascalon\'s Mercy Revealed',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63CB', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63CD Lightning Storm',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63CD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63CF the Dragon\'s Rage',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63CF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63D1 the Dragon\'s Gaze',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63D2 the Dragon\'s Glory',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63D7 Heavy Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D7', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63D8 Heavy Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D8', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63D9 Heavy Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D9', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63DA Heavy Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63DA', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63DD Skyward Leap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63DD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63E0 Eternal Conviction',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63E3 Sacred Sever',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63E7 Hiemal Storm',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E7', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63E9 Holy Comet',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E9', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63EA Holy Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63EA', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 63EC Planar Prison',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63EC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6709 Final Chorus',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6709', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 670E Dark High Jump',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '670E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 670F Dark Spineshatter Dive',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '670F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6710 Dark Elusive Jump',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6710', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6714 Eye of the Tyrant',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6714', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6715 Gnashing Wheel',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6715', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6716 Lashing Wheel',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6716', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 671B Darkdragon Dive',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '671B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 671C Soul Tether',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '671C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6730 attack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6730', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68BA Resentment',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68BA', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68BF Flare Star',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68BF', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68C0 Flare Star',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68C1 Flare Nova',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68C2 Flare Nova',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68C4 Mirage Dive',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68C5 Soul of Friendship',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 68C6 Soul of Devotion',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C6', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6B8C Twister',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6B8F Chain Lightning',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6B90 Chain Lightning',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B90', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6B91 Liquid Heaven',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B91', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6B94 Deathstorm',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B94', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6B98 Meteor Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B98', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D25 Hallowed Wings',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D25', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D28 Hallowed Wings',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D28', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D29 Hallowed Plume',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D29', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D30 Mortal Vow',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D30', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D31 Mortal Vow',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D31', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D36 Flame Breath',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D36', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D37 Ice Breath',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D37', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D39 Dark Orb',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D39', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D3A Holy Orb',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D3A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D3B Dark Breath',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D3B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D3C Holy Breath',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D3C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D3D Staggering Breath',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D3D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D42 Akh Afah',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D42', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D44 Akh Afah',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D44', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D47 Akh Morn',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D47', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D91 _rsv_28049_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D91', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D92 _rsv_28050_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D92', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D96 _rsv_28054_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D96', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D97 _rsv_28055_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D97', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D98 _rsv_28056_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D98', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D9D _rsv_28061_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D9D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6D9F Trinity',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D9F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6DA0 Trinity',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6DA0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6DA1 Trinity',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6DA1', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6E30 _rsv_28208_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6E30', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 6E31 _rsv_28209_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6E31', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 70E7 Touchdown',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '70E7', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 71E4 Shockwave',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '71E4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 72A2 Skyward Leap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72A2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 742B Spreading Flames',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '742B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 742C Entangled Flames',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '742C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 742D Entangled Pyre',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '742D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },
    {
      id: 'DSR TESTTRIGGER INSTANT AOE 7438 _rsv_29752_-1_1_C0_0Action',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7438', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.id} - ${matches.source}`);
      },
    },

    {
      // Brightwings are reducing damage taken.
      id: 'DSR TESTTRIGGER GAINSEFFECT A64 Brightwinged Fortitude',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A64', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Emblazoned with a mark that will cause you to explode when the effect expires.
      id: 'DSR TESTTRIGGER GAINSEFFECT A65 Skyblind',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A65', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Shackled, reducing movement speed. Leaving the planar prison will result in instant KO.
      id: 'DSR TESTTRIGGER GAINSEFFECT A66 Planar Imprisonment',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A66', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Brightwings are spurring automatic attacks against nearby enemies.
      id: 'DSR TESTTRIGGER GAINSEFFECT A68 Brightwinged Fury',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A68', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Unable to maintain composure. Damage taken is increased.
      id: 'DSR TESTTRIGGER GAINSEFFECT AAD Discomposed',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AAD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Nidhogg has taken the form of a man.
      id: 'DSR TESTTRIGGER GAINSEFFECT ABA Heart of Man',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'ABA', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Soon to be on the receiving end of a Dark High Jump.
      id: 'DSR TESTTRIGGER GAINSEFFECT AC3 High Jump Target',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AC3', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Soon to be on the receiving end of a Dark Spineshatter Dive.
      id: 'DSR TESTTRIGGER GAINSEFFECT AC4 Spineshatter Dive Target',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AC4', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Soon to be on the receiving end of a Dark Elusive Jump.
      id: 'DSR TESTTRIGGER GAINSEFFECT AC5 Elusive Jump Target',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AC5', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Bound in suffering to Nidhogg's left eye. Damage taken will result in damage to the left eye.
      id: 'DSR TESTTRIGGER GAINSEFFECT AD7 Clawbound',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD7', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Slaking the suffering of Nidhogg's right eye. Damage taken will result in healing to the right eye.
      id: 'DSR TESTTRIGGER GAINSEFFECT AD8 Fangbound',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AD8', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Body is accumulating charge. Will inflict lightning damage to those nearby when this effect expires.
      id: 'DSR TESTTRIGGER GAINSEFFECT B11 Thunderstruck',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B11', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Under the control of an Allagan shackling device.
      id: 'DSR TESTTRIGGER GAINSEFFECT B12 Neurolink',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B12', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Body is slowly heating up. Will become Pyretic when this effect expires.
      id: 'DSR TESTTRIGGER GAINSEFFECT B52 Boiling',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B52', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Body is slowly turning to ice. Will experience a Deep Freeze when this effect expires.
      id: 'DSR TESTTRIGGER GAINSEFFECT B53 Freezing',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B53', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Darkness is causing damage over time.
      id: 'DSR TESTTRIGGER GAINSEFFECT B54 Sustained Dark Damage',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B54', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Light is causing damage over time.
      id: 'DSR TESTTRIGGER GAINSEFFECT B55 Sustained Light Damage',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B55', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Fire resistance is significantly reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT B56 Fire Resistance Down II',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B56', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Ice resistance is significantly reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT B57 Ice Resistance Down II',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B57', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Certain death when counter reaches zero.
      id: 'DSR TESTTRIGGER GAINSEFFECT BA0 Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Lightning resistance is significantly reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT BB6 Lightning Resistance Down II',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BB6', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Marked as target #1.
      id: 'DSR TESTTRIGGER GAINSEFFECT BBC First in Line',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BBC', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Marked as target #2.
      id: 'DSR TESTTRIGGER GAINSEFFECT BBD Second in Line',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BBD', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Marked as target #3.
      id: 'DSR TESTTRIGGER GAINSEFFECT BBE Third in Line',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BBE', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Damage dealt and potency of HP restoration actions are increased. Movement speed is also increased.
      id: 'DSR TESTTRIGGER GAINSEFFECT BE2 No Mercy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BE2', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // An area of land has been purified, nullifying damage taken for party members within and afflicting enemies who enter with damage over time.
      id: 'DSR TESTTRIGGER GAINSEFFECT C2E Mesotes',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C2E', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Damage dealt is increased.
      id: 'DSR TESTTRIGGER GAINSEFFECT C39 Damage Up',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C39', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Slashing resistance is reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT C3A Slashing Resistance Down',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C3A', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Piercing resistance is reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT C3B Piercing Resistance Down',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C3B', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Blunt resistance is reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT C3C Blunt Resistance Down',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C3C', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Maximum HP is reduced and damage taken is increased.
      id: 'DSR TESTTRIGGER GAINSEFFECT C3D Suppuration',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C3D', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Light resistance is reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT C3F Light Resistance Down',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C3F', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    {
      // Dark resistance is reduced.
      id: 'DSR TESTTRIGGER GAINSEFFECT C40 Dark Resistance Down',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'C40', capture: true }),
      run: (_data, matches) => {
        console.log(`${matches.timestamp} - ${matches.effectId} - ${matches.source} - ${matches.target}`);
      },
    },
    // #endregion
  ],
};

export default triggerSet;
