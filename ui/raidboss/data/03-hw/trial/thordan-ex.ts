import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';


export interface Data extends RaidbossData {
  phase: number;
  swordKnight?: string;
  swordTarget?: string;
  shieldKnight?: string;
  shieldTarget?: string;
  pierceTargets: string[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheMinstrelsBalladThordansReign',
  zoneId: ZoneId.TheMinstrelsBalladThordansReign,
  timelineFile: 'thordan-ex.txt',
  initData: () => {
    return {
      phase: 1,
      pierceTargets: [],
    };
  },
  timelineTriggers: [
    {
      id: 'ThordanEX Ascalons Might',
      regex: /Ascalon's Might/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      // This is timed off the towers appearing,
      // so having no beforeSeconds parameter is correct.
      id: 'ThordanEX Conviction',
      regex: /--towers spawn--/,
      response: Responses.getTowers(),
    },
    {
      id: 'ThordanEX Heavenly Slash',
      regex: /Heavenly Slash/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      id: 'ThordanEX Faith Unmoving',
      regex: /Faith Unmoving/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'ThordanEX Dimensional Collapse',
      regex: /Dimensional Collapse/,
      beforeSeconds: 10,
      alertText: (_data, _matches, output) => output.baitPuddles!(),
      outputStrings: {
        baitPuddles: {
          en: 'Bait gravity puddles',
        },
      },
    },
    {
      id: 'ThordanEX Light Of Ascalon',
      regex: /The Light of Ascalon 1/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.knockbackAoe!(),
      outputStrings: {
        knockbackAoe: {
          en: 'AOE + knockback x7',
        },
      },
    },
    {
      id: 'ThordanEX Ultimate End',
      regex: /Ultimate End/,
      beforeSeconds: 6,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    // Phase tracking
    {
      // Cue off Thordan's movement ability alongside him going untargetable
      id: 'ThordanEX Intermission Phase',
      type: 'Ability',
      netRegex: { id: '105A', source: 'King Thordan', capture: false },
      run: (data) => data.phase = 2,
    },
    {
      // Cue off Knights of the Round
      id: 'ThordanEX Post-Intermission Phase Tracker',
      type: 'Ability',
      netRegex: { id: '148C', source: 'King Thordan', capture: false },
      run: (data) => data.phase += 1,
    },
    {
      id: 'ThordanEX Lightning Storm',
      type: 'HeadMarker',
      netRegex: { id: '0018' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'ThordanEX Dragons Rage',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      condition: Conditions.targetIsYou(),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'ThordanEX Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '1485', source: 'King Thordan', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Heavenly Heel',
      type: 'StartsUsing',
      netRegex: { id: '1487', source: 'King Thordan' },
      response: Responses.tankBuster(),
    },
    {
      id: 'ThordanEX Dragons Gaze',
      type: 'StartsUsing',
      netRegex: { id: '1489', source: 'King Thordan', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 1)
          return output.singleGaze!();
        return output.doubleGaze!();
      },
      outputStrings: {
        // We could do some composition magic to make this more "elegant",
        // but for ease of translation it's best to just define fixed output strings.
        singleGaze: {
          en: 'Look away from Thordan',
        },
        doubleGaze: {
          en: 'Look away from Thordan and Eye',
        }
      }
    },
    {
      id: 'ThordanEX Conviction Towers',
      type: 'StartsUsing',
      netRegex: { id: '149D', source: 'Ser Hermenost', capture: false },
      suppressSeconds: 5,
      response: Responses.getTowers(),
    },
    {
      id: 'ThordanEX Sword Of The Heavens',
      type: 'GainsEffect',
      netRegex: { effectId: '3B0' },
      infoText: (_data, matches, output) => output.attackSword!({ swordKnight: matches.target }),
      run: (data, matches) => data.swordKnight = matches.target,
      outputStrings: {
        attackSword: {
          en: 'Attack ${swordKnight}',
        }
      },
    },
    {
      id: 'ThordanEX Shield Of The Heavens',
      type: 'GainsEffect',
      netRegex: { effectId: '3B1' },
      run: (data, matches) => data.shieldKnight = matches.target,
    },
    {
      id: 'ThordanEX Holiest Of Holy',
      type: 'StartsUsing',
      netRegex: { id: '1495', source: ['Ser Adelphel', 'Ser Janlenoux'], capture: false },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Holy Bladedance Collect',
      type: 'StartsUsing',
      netRegex: { id: '1496', source: ['Ser Adelphel', 'Ser Janlenoux'], },
      run: (data, matches) => {
        if (data.swordKnight === matches.source)
          data.swordTarget = matches.target;
        if (data.shieldKnight === matches.source)
          data.shieldTarget = matches.target;
      }
    },
    {
      id: 'ThordanEX Holy Bladedance Call',
      type: 'StartsUsing',
      netRegex: { id: '1496', source: ['Ser Adelphel', 'Ser Janlenoux'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.swordTarget === undefined || data.shieldTarget === undefined)
          return output.unknownDance!();
        if (data.swordTarget === data.shieldTarget)
          return output.singleDance!({ target: data.swordTarget });
        return output.doubleDance!({ sword: data.swordTarget, shield: data.shieldTarget });
      },
      outputStrings: {
        unknownDance: {
          en: 'Heavy busters'
        },
        singleDance: {
          en: '2x buster on ${target}',
        },
        doubleDance: {
          en: 'Sword buster on ${sword} (shield on ${shield})',
        },
      }
    },
    {
      id: 'ThordanEX Skyward Leap',
      type: 'HeadMarker',
      netRegex: { id: '000E' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.defamationYou!(),
      outputStrings: {
        defamationYou: {
          en: 'Defamation on YOU',
        },
      },
    },
    {
      id: 'ThordanEX Spiral Pierce Collect',
      type: 'Tether',
      netRegex: { id: '0005' },
      run: (data, matches) => data.pierceTargets.push(matches.target),
    },
    {
      id: 'ThordanEX Spiral Pierce',
      type: 'Tether',
      netRegex: { id: '0005', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alarmText: (data, _matches, output) => {
        if (data.pierceTargets.includes(data.me))
          return output.pierceYou!();
        return output.pierceOthers!();
      },
      run: (data) => data.pierceTargets = [],
      outputStrings: {
        pierceYou: {
          en: 'Line AoE on YOU',
        },
        pierceOthers: {
          en: 'Avoid tether line AoEs',
        }
      },
    },
    {
      id: 'ThordanEX Hiemal Storm',
      type: 'HeadMarker',
      netRegex: { id: '001D' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.icePuddleYou!(),
      outputStrings: {
        icePuddleYou: {
          en: 'Ice puddle on YOU',
        },
      },
    },
    {
      id: 'ThordanEX Comet Puddles',
      type: 'HeadMarker',
      netRegex: { id: '000B' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.meteorYou!(),
      outputStrings: {
        meteorYou: {
          en: '4x meteor puddles on YOU',
        },
      },
    },
    {
      id: 'ThordanEX Fury Spear',
      type: 'HeadMarker',
      netRegex: { id: '0010' },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.spearYou!();
        return output.spearOther!({ spearTarget: matches.target });
      },
      outputStrings: {
        spearYou: {
          en: 'Wild Charge on YOU',
        },
        spearOther: {
          en: 'Wild Charge: Intercept ${spearTarget}'
        }
      },
    },
  ],

  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'The Dragon\'s Gaze/The Dragon\'s Glory': 'The Dragon\'s Gaze/Glory',
      },
    },
  ],
};

export default triggerSet;
