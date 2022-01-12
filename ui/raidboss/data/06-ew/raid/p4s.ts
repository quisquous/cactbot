import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// Part Two
// TODO: Wreath of Thorns 1 callout safe spot order (N/S or E/W)
// TODO: Wreath of Thorns 2 headmarkers and tethers
// TODO: Safe spot callouts for Wreath of Thorns 2?
// TODO: Better Dark Design/tether break callouts
// TODO: Wreath of Thorns 3 strategy (1 = melee, 2 = ranged) or
//       something more intelligent such as tracking the vulnerabilities?
// TODO: Call out thorns soaks for Wreath of Thorns 3 (E/W?)
// TODO: Heart Stake is tankbuster with DoT, does it need to be output differrently?
// TODO: Wreath of Thorns 4 headmarkers and tethers

export interface Data extends RaidbossData {
  actingRole?: string;
  decOffset?: number;
  tetherRole?: string[];
  debuffRole?: string[];
  hasRoleCall?: boolean;
  pinaxCount?: number;
  wellShiftKnockback?: boolean;
  beloneCoilsTwo?: boolean;
  bloodrakeCounter?: number;
  fleetingImpulseCounter?: number;
  meFleetingImpulse?: number;
}

const roleOutputStrings = {
  tankHealer: {
    en: 'Tank/Healer',
  },
  dps: {
    en: 'DPS',
  },
  roleTethers: {
    en: '${role} Tethers',
  },
  roleDebuffs: {
    en: '${role} Role Calls',
  },
  roleEverything: {
    en: '${role} Everything',
  },
  roleTowers: {
    en: '${role} Towers',
  },
  unknown: Outputs.unknown,
};

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Elegant Evisceration? (00DA?).
const firstHeadmarker = parseInt('00DA', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFourthCircleSavage,
  timelineFile: 'p4s.txt',
  timelineTriggers: [
    {
      id: 'P4S Dark Design',
      regex: /Dark Design/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack for Puddle AOEs',
          de: 'Stacken (Pfützen)',
          fr: 'Packez-vous pour l\'AoE',
          ja: 'スタック',
          cn: '集合放置AOE',
          ko: '중앙에 모이기',
        },
      },
    },
    {
      id: 'P4S Kothornos Kick',
      regex: /Kothornos Kick/,
      beforeSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.role === 'tank' || data.role === 'healer')
          return;
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Bait Jump?',
          de: 'Sprung ködern?',
        },
      },
    },
    {
      id: 'P4S Kothornos Quake',
      regex: /Kothornos Quake/,
      beforeSeconds: 5,
      infoText: (data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Earthshakers?',
          de: 'Erdstoß ködern?',
        },
      },
    },
    {
      id: 'P4S Hemitheos\'s Water IV',
      regex: /Hemitheos's Water IV/,
      beforeSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Middle Knockback',
          de: 'Rückstoß von der Mitte',
          fr: 'Poussée au milieu',
          cn: '中间击退',
          ko: '중앙에서 넉백',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P4S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P4S Decollation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A09', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A09', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A09', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A09', source: 'ヘスペロス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P4S Bloodrake',
      // AoE hits tethered players in first one, the non-tethered in second
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D8', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D8', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D8', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D8', source: 'ヘスペロス', capture: false }),
      preRun: (data) => data.bloodrakeCounter = (data.bloodrakeCounter ?? 0) + 1,
      response: Responses.aoe(),
    },
    {
      id: 'P4S Bloodrake Store',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '69D8', source: 'Hesperos' }),
      netRegexDe: NetRegexes.ability({ id: '69D8', source: 'Hesperos' }),
      netRegexFr: NetRegexes.ability({ id: '69D8', source: 'Hespéros' }),
      netRegexJa: NetRegexes.ability({ id: '69D8', source: 'ヘスペロス' }),
      condition: (data) => (data.bloodrakeCounter ?? 0) < 3,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const roles: { [role: string]: string } = {
          'dps': output.dps!(),
          'tank/healer': output.tankHealer!(),
        };

        const roleRaked = data.party.isDPS(matches.target) ? 'dps' : 'tank/healer';
        const roleOther = data.party.isDPS(matches.target) ? 'tank/healer' : 'dps';

        // Second bloodrake = Debuffs later
        if ((data.bloodrakeCounter ?? 0) === 2) {
          if (roleRaked === 'dps') {
            (data.debuffRole ??= []).push('healer');
            data.debuffRole.push('tank');
          } else {
            (data.debuffRole ??= []).push(roleOther);
          }

          // May end up needing both tether and debuff
          const tetherRole = data.tetherRole ??= [];
          const debuffRole = data.debuffRole ??= [];
          if (tetherRole[0] === debuffRole[0])
            return output.roleEverything!({ role: roles[roleOther] });
          return output.roleDebuffs!({ role: roles[roleOther] });
        }

        // First bloodrake = Tethers later
        if (roleRaked === 'dps') {
          (data.tetherRole ??= []).push('healer');
          data.tetherRole.push('tank');
        } else {
          (data.tetherRole ??= []).push(roleOther);
        }
        return output.roleTethers!({ role: roles[roleOther] });
      },
      outputStrings: roleOutputStrings,
    },
    {
      id: 'P4S Belone Coils',
      // 69DE is No Tank/Healer Belone Coils
      // 69DF is No DPS Belone Coils
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['69DE', '69DF'], source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['69DE', '69DF'], source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['69DE', '69DF'], source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['69DE', '69DF'], source: 'ヘスペロス' }),
      preRun: (data) => {
        if (!data.beloneCoilsTwo) {
          delete data.debuffRole;
          delete data.tetherRole;
          data.hasRoleCall = false;
        }
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = roleOutputStrings;

        const roles: { [role: string]: string } = {
          'dps': output.dps!(),
          'tank/healer': output.tankHealer!(),
        };

        const roleTowers = matches.id === '69DE' ? 'dps' : 'tank/healer';
        const roleOther = matches.id === '69DE' ? 'tank/healer' : 'dps';

        // Second Coils = Debuffs later
        if (data.beloneCoilsTwo) {
          if (roleTowers === 'dps') {
            (data.debuffRole ??= []).push('healer');
            data.debuffRole.push('tank');
          } else {
            (data.debuffRole ??= []).push(roleTowers);
          }

          // For second coils, if you are not in the debuff list here you are tower
          if (!data.debuffRole.includes(data.role))
            return { ['alertText']: output.roleTowers!({ role: roles[roleTowers] }) };

          // If you have tethers and debuff, you need everything
          const tetherRole = data.tetherRole ??= [];
          const debuffRole = data.tetherRole ??= [];
          if (debuffRole[0] === tetherRole[0])
            return { ['infoText']: output.roleEverything!({ role: roles[roleOther] }) };
          return { ['infoText']: output.roleDebuffs!({ role: roles[roleOther] }) };
        }

        // First Coils = Tethers later
        if (roleTowers === 'dps') {
          (data.tetherRole ??= []).push('healer');
          data.tetherRole.push('tank');
        } else {
          (data.tetherRole ??= []).push(roleTowers);
        }

        // For first coils, there are tower and tethers
        if (data.tetherRole.includes(data.role))
          return { ['alertText']: output.roleTethers!({ role: roles[roleOther] }) };
        return { ['alertText']: output.roleTowers!({ role: roles[roleTowers] }) };
      },
      run: (data) => data.beloneCoilsTwo = true,
    },
    {
      id: 'P4S Role Call',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AF2', 'AF3'], capture: true }),
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
        const debuffRole = (data.debuffRole ??= []).includes(data.role);
        if (debuffRole && matches.effectId === 'AF2')
          return output.passRoleCall!();
        // AF3 is obtained after passing Role Call (AF2)
        data.hasRoleCall = false;
      },
      outputStrings: {
        passRoleCall: {
          en: 'Pass Role Call',
        },
      },
    },
    {
      id: 'P4S Director\'s Belone',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '69E6', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '69E6', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '69E6', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '69E6', source: 'ヘスペロス', capture: false }),
      // Delay callout until debuffs are out
      delaySeconds: 1.4,
      alertText: (data, _matches, output) => {
        const debuffRole = (data.debuffRole ??= []).includes(data.role);
        if (!data.hasRoleCall && !debuffRole)
          return output.text!();
      },
      run: (data) => {
        delete data.debuffRole;
      },
      outputStrings: {
        text: {
          en: 'Get Role Call',
        },
      },
    },
    {
      id: 'P4S Inversive Chlamys',
      // Possible a player still has not yet passed debuff
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69ED', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69ED', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69ED', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69ED', source: 'ヘスペロス', capture: false }),
      alertText: (data, _matches, output) => {
        const roles: { [role: string]: string } = {
          'dps': output.dps!(),
          'tank/healer': output.tankHealer!(),
          '???': output.unknown!(),
        };

        const dps = (data.tetherRole ??= []).includes('dps');
        if (dps)
          return output.roleTethers!({ role: roles['dps'] });
        if (data.tetherRole.length)
          return output.roleTethers!({ role: roles['tank/healer'] });
        return output.roleTethers!({ role: roles['???'] });
      },
      run: (data) => {
        delete data.tetherRole;
        data.hasRoleCall = false;
      },
      outputStrings: roleOutputStrings,
    },
    {
      id: 'P4S Elegant Evisceration',
      // This one does an aoe around the tank
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A08', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A08', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A08', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A08', source: 'ヘスペロス' }),
      response: Responses.tankBusterSwap('alert'),
    },
    {
      id: 'P4S Levinstrike Pinax',
      // Strong proximity Aoe
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D7', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D7', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D7', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D7', source: 'ヘスペロス', capture: false }),
      preRun: (data) => data.pinaxCount = (data.pinaxCount ?? 0) + 1,
      durationSeconds: 6,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Thunder',
          de: 'Blitz',
          fr: 'Tempête',
          ja: 'サンダー',
          cn: '闪雷风暴',
          ko: '번개',
        },
      },
    },
    {
      id: 'P4S Well Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D6', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D6', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D6', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D6', source: 'ヘスペロス', capture: false }),
      preRun: (data) => data.pinaxCount = (data.pinaxCount ?? 0) + 1,
      infoText: (data, _matches, output) => {
        if ((data.pinaxCount ?? 0) % 2)
          return output.text!();
        data.wellShiftKnockback = true;
        return output.wellShift!();
      },
      outputStrings: {
        text: {
          en: 'Well',
          de: 'Brunnen',
        },
        wellShift: {
          en: 'Well and Shift',
        },
      },
    },
    {
      id: 'P4S Well Pinax Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D6', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D6', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D6', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D6', source: 'ヘスペロス' }),
      delaySeconds: (data, matches) => {
        // Delay for for Directional Shift on Even Well/Levinstrike Pinax Count
        if ((data.pinaxCount ?? 0) % 2)
          return parseFloat(matches.castTime) - 5;
        return parseFloat(matches.castTime) - 2.4;
      },
      durationSeconds: (data) => data.wellShiftKnockback ? 2.4 : 5,
      response: Responses.knockback(),
    },
    {
      id: 'P4S Acid Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D4', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D4', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D4', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D4', source: 'ヘスペロス', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'P4S Lava Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D5', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D5', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D5', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D5', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Healers en groupes',
          ja: 'ヒラに頭割り',
          cn: '治疗分摊组',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'P4S Northerly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A02', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A02', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A02', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A02', source: 'ヘスペロス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'North Cleave',
          de: 'Cleave in den Norden',
        },
      },
    },
    {
      id: 'P4S Easterly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A04', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A04', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A04', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A04', source: 'ヘスペロス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'East Cleave',
          de: 'Cleave in den Osten',
        },
      },
    },
    {
      id: 'P4S Southerly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A03', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A03', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A03', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A03', source: 'ヘスペロス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'South Cleave',
          de: 'Cleave in den Süden',
        },
      },
    },
    {
      id: 'P4S Westerly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A05', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A05', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A05', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A05', source: 'ヘスペロス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'West Cleave',
          de: 'Cleave in den Westen',
        },
      },
    },
    {
      id: 'P4S Northerly Shift Cape',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69FD', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69FD', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69FD', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69FD', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'North Cape',
          de: 'Umhang im Norden',
        },
      },
    },
    {
      id: 'P4S Easterly Shift Cape',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69FF', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69FF', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69FF', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69FF', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'East Cape',
          de: 'Umhang im Osten',
        },
      },
    },
    {
      id: 'P4S Southerly Shift Cape',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69FE', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69FE', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69FE', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69FE', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'South Cape',
          de: 'Umhang im Süden',
        },
      },
    },
    {
      id: 'P4S Westerly Shift Cape',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A00', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A00', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A00', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A00', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'West Cape',
          de: 'Umhang im Westen',
        },
      },
    },
    {
      id: 'P4S Directional Shift Knockback',
      // Callout Knockback during Levinstrike + Shift
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['69FD', '69FE', '69FF', '6A00'], source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['69FD', '69FE', '69FF', '6A00'], source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['69FD', '69FE', '69FF', '6A00'], source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['69FD', '69FE', '69FF', '6A00'], source: 'ヘスペロス' }),
      condition: (data) => !data.wellShiftKnockback,
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
      run: (data) => data.wellShiftKnockback = false,
    },
    {
      id: 'P4S Acting Role',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['B6D', 'B6E', 'B6F'], capture: true }),
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => {
        const actingRoles: { [effectId: string]: string } = {
          'B6D': output.dps!(),
          'B6E': output.healer!(),
          'B6F': output.tank!(),
        };
        return output.text!({ actingRole: data.actingRole = actingRoles[matches.effectId] });
      },
      outputStrings: {
        text: {
          en: 'Acting ${actingRole}',
          de: 'Handel ale ${actingRole}',
        },
        dps: {
          en: 'DPS',
          de: 'DPS',
        },
        healer: {
          en: 'Healer',
          de: 'Heiler',
        },
        tank: {
          en: 'Tank',
          de: 'Tank',
        },
      },
    },
    {
      id: 'P4S Belone Bursts',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D9', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D9', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.rolePositions!(),
      outputStrings: {
        rolePositions: {
          en: 'Orb role positions',
          de: 'Orb Rollenposition',
        },
      },
    },
    {
      id: 'P4S Periaktoi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['69F5', '69F6', '69F7', '69F8'], source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['69F5', '69F6', '69F7', '69F8'], source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['69F5', '69F6', '69F7', '69F8'], source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['69F5', '69F6', '69F7', '69F8'], source: 'ヘスペロス' }),
      alertText: (_data, matches, output) => {
        const pinax: { [id: string]: string } = {
          '69F5': output.acid!(),
          '69F6': output.lava!(),
          '69F7': output.well!(),
          '69F8': output.thunder!(),
        };
        return output.text!({ pinax: pinax[matches.id] });
      },
      outputStrings: {
        text: {
          en: '${pinax} safe',
          de: '${pinax} sicher',
        },
        acid: {
          en: 'Acid',
          de: 'Gift',
        },
        lava: {
          en: 'Lava',
          de: 'Lava',
          fr: 'Lave',
          ja: 'ラーヴァ',
          cn: '岩浆',
          ko: '용암',
        },
        well: {
          en: 'Well',
          de: 'Brunnen',
        },
        thunder: {
          en: 'Thunder',
          de: 'Blitz',
          fr: 'Tempête',
          ja: 'サンダー',
          cn: '闪雷风暴',
          ko: '번개',
        },
      },
    },
    {
      id: 'P4S Searing Stream',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A2D', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A2D', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A2D', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A2D', source: 'ヘスペロス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P4S Nearsight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A26', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A26', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A26', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A26', source: 'ヘスペロス', capture: false }),
      alertText: (data, _matches, output) => data.role === 'tank' ? output.tankbustersIn!() : output.getOut!(),
      outputStrings: {
        tankbustersIn: {
          en: 'In (Tankbusters)',
          de: 'Rein (Tankbusters)',
        },
        getOut: Outputs.out,
      },
    },
    {
      id: 'P4S Farsight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A27', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A27', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A27', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A27', source: 'ヘスペロス', capture: false }),
      alertText: (data, _matches, output) => data.role === 'tank' ? output.tankbustersOut!() : output.getIn!(),
      outputStrings: {
        tankbustersOut: {
          en: 'Get out, tankbuster',
          de: 'Raus, tankbuster',
        },
        getIn: Outputs.in,
      },
    },
    {
      id: 'P4S Demigod Double',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6E78', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6E78', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6E78', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6E78', source: 'ヘスペロス' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P4S Ultimate Impulse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A2C', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A2C', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A2C', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A2C', source: 'ヘスペロス', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P4S Heart Stake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A2B', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A2B', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A2B', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A2B', source: 'ヘスペロス' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'P4S Wreath of Thorns 5',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A34', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A34', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A34', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A34', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread at tethered thorn',
          de: 'Verteilen bei der Dornenhecke',
        },
      },
    },
    {
      id: 'P4S Fleeting Impulse',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6A1C', source: 'Hesperos' }),
      netRegexDe: NetRegexes.ability({ id: '6A1C', source: 'Hesperos' }),
      netRegexFr: NetRegexes.ability({ id: '6A1C', source: 'Hespéros' }),
      netRegexJa: NetRegexes.ability({ id: '6A1C', source: 'ヘスペロス' }),
      preRun: (data, _matches) => {
        data.fleetingImpulseCounter = (data.fleetingImpulseCounter ?? 0) + 1;
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me) {
          data.meFleetingImpulse = data.fleetingImpulseCounter;
          return output.text!({ num: data.fleetingImpulseCounter });
        }
      },
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
        },
      },
    },
    {
      id: 'P4S Wreath of Thorns 6',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A35', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A35', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A35', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A35', source: 'ヘスペロス' }),
      // Take castTime and add to duration between cast and first soak - 1
      // Multiply our number by the seconds between each soak.
      // This leaves up the info until expected hit from start of tethers going out.
      durationSeconds: (data, matches) => {
        const myDuration = typeof data.meFleetingImpulse === 'undefined' ? 8 : data.meFleetingImpulse;
        return parseFloat(matches.castTime) + 2.1 + myDuration * 1.2;
      },
      infoText: (data, _matches, output) => output.text!({ num: data.meFleetingImpulse }),
      outputStrings: {
        text: {
          en: 'Thorn ${num}',
          de: 'Dornen ${num}',
        },
      },
    },
    {
      id: 'P4S Hell\'s Sting',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A1E', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A1E', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A1E', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A1E', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.protean!(),
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Position',
          ja: '8方向散開',
          cn: '分散站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Well Pinax/Levinstrike Pinax': 'Well/Levinstrike Pinax',
        'Levinstrike Pinax/Well Pinax': 'Levinstrike/Well Pinax',
        'Acid Pinax/Lava Pinax': 'Acid/Lava Pinax',
        'Lava Pinax/Acid Pinax': 'Lava/Acid Pinax',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Hesperos': 'Hesperos',
      },
      'replaceText': {
        '--debuffs--': '--Debuffs--',
        '--element debuffs--': '--Elementar-Debuffs--',
        '--role debuffs--': '--Rollen-Debuffs--',
        'Acid Pinax': 'Säure-Pinax',
        'Aetheric Chlamys': 'Ätherische Chlamys',
        'Akanthai: Act 1': 'Akanthai: Erster Akt',
        'Akanthai: Act 2': 'Akanthai: Zweiter Akt',
        'Akanthai: Act 3': 'Akanthai: Dritter Akt',
        'Akanthai: Act 4': 'Akanthai: Vierter Akt',
        'Akanthai: Curtain Call': 'Akanthai: Vorhang',
        'Akanthai: Finale': 'Akanthai: Finale',
        'Belone Bursts': 'Berstendes Belone',
        'Belone Coils': 'Gewundenes Belone',
        'Bloodrake': 'Blutharke',
        '(?<!Belone )Burst': 'Explosion',
        'Cursed Casting': 'Fluches Frucht',
        'Dark Design': 'Finsteres Formen',
        'Decollation': 'Enthauptung',
        'Director\'s Belone': 'Maskiertes Belone',
        'Elegant Evisceration': 'Adrette Ausweidung',
        'Elemental Belone': 'Elementares Belone',
        'Fleeting Impulse': 'Flüchtiger Impuls',
        'Heart Stake': 'Herzenspfahl',
        'Hell\'s Sting': 'Höllenstich',
        'Hemitheos\'s Aero III': 'Hemitheisches Windga',
        'Hemitheos\'s Dark IV': 'Hemitheisches Nachtka',
        'Hemitheos\'s Fire III': 'Hemitheisches Feuga',
        'Hemitheos\'s Fire IV': 'Hemitheisches Feuka',
        'Hemitheos\'s Thunder III': 'Hemitheisches Blitzga',
        'Hemitheos\'s Water IV': 'Hemitheisches Aquaka',
        'Inversive Chlamys': 'Invertierte Chlamys',
        'Kothornos Kick': 'Kothornoi-Tritt',
        'Kothornos Quake': 'Kothornoi-Beben',
        'Lava Pinax': 'Lava-Pinax',
        'Levinstrike Pinax': 'Donner-Pinax',
        'Periaktoi': 'Periaktoi',
        '(?<!\\w )Pinax': 'Pinax',
        'Searing Stream': 'Sengender Strom',
        'Setting the Scene': 'Vorhang auf',
        'Shifting Strike': 'Schwingenschlag',
        'Ultimate Impulse': 'Ultimativer Impuls',
        'Vengeful Belone': 'Rachsüchtiges Belone',
        'Well Pinax': 'Brunnen-Pinax',
        'Wreath of Thorns': 'Dornenhecke',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hesperos': 'Hespéros',
      },
      'replaceText': {
        'Acid Pinax': 'Pinax de poison',
        'Aetheric Chlamys': 'Chlamyde d\'éther',
        'Akanthai: Act 1': 'La Tragédie des épines : acte I',
        'Akanthai: Act 2': 'La Tragédie des épines : acte II',
        'Akanthai: Act 3': 'La Tragédie des épines : acte III',
        'Akanthai: Act 4': 'La Tragédie des épines : acte IV',
        'Akanthai: Curtain Call': 'La Tragédie des épines : rappel',
        'Akanthai: Finale': 'La Tragédie des épines : acte final',
        'Belone Bursts': 'Bélos enchanté : explosion',
        'Belone Coils': 'Bélos enchanté : rotation',
        'Bloodrake': 'Racle de sang',
        '(?<!Belone )Burst': 'Explosion',
        'Cursed Casting': 'Malédiction immortelle',
        'Dark Design': 'Dessein noir',
        'Decollation': 'Décollation',
        'Director\'s Belone': 'Bélos enchanté : persona',
        'Elegant Evisceration': 'Éviscération élégante',
        'Elemental Belone': 'Bélos enchanté : élémentaire',
        'Fleeting Impulse': 'Impulsion fugace',
        'Heart Stake': 'Pieu dans le cœur',
        'Hell\'s Sting': 'Pointe infernale',
        'Hemitheos\'s Aero III': 'Méga Vent de l\'hémithéos',
        'Hemitheos\'s Dark IV': 'Giga Ténèbres de l\'hémithéos',
        'Hemitheos\'s Fire III': 'Méga Feu de l\'hémithéos',
        'Hemitheos\'s Fire IV': 'Giga Feu de l\'hémithéos',
        'Hemitheos\'s Thunder III': 'Méga Foudre de l\'hémithéos',
        'Hemitheos\'s Water IV': 'Giga Eau de l\'hémithéos',
        'Inversive Chlamys': 'Chlamyde retournée',
        'Kothornos Kick': 'Coup de cothurne',
        'Kothornos Quake': 'Piétinement de cothurne',
        'Lava Pinax': 'Pinax de feu',
        'Levinstrike Pinax': 'Pinax de foudre',
        'Periaktoi': 'Périacte',
        '(?<!\\w )Pinax': 'Pinax',
        'Searing Stream': 'Flux ardent',
        'Setting the Scene': 'Lever de rideau',
        'Shifting Strike': 'Frappe mouvante',
        'Ultimate Impulse': 'Impulsion ultime',
        'Vengeful Belone': 'Bélos enchanté : vengeance',
        'Well Pinax': 'Pinax d\'eau',
        'Wreath of Thorns': 'Haie d\'épines',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hesperos': 'ヘスペロス',
      },
      'replaceText': {
        'Acid Pinax': 'ピナクスポイズン',
        'Aetheric Chlamys': 'エーテルクラミュス',
        'Akanthai: Act 1': '茨の悲劇：序幕',
        'Akanthai: Act 2': '茨の悲劇：第ニ幕',
        'Akanthai: Act 3': '茨の悲劇：第三幕',
        'Akanthai: Act 4': '茨の悲劇：第四幕',
        'Akanthai: Curtain Call': '茨の悲劇：カーテンコール',
        'Akanthai: Finale': '茨の悲劇：終幕',
        'Belone Bursts': 'エンチャンテッドペロネー：エクスプロージョン',
        'Belone Coils': 'エンチャンテッドペロネー：ラウンド',
        'Bloodrake': 'ブラッドレイク',
        '(?<!Belone )Burst': '爆発',
        'Cursed Casting': '呪詛発動',
        'Dark Design': 'ダークデザイン',
        'Decollation': 'デコレーション',
        'Director\'s Belone': 'エンチャンテッドペロネー：ペルソナ',
        'Elegant Evisceration': 'エレガントイヴィセレーション',
        'Elemental Belone': 'エンチャンテッドペロネー：エレメンタル',
        'Fleeting Impulse': 'フリーティングインパルス',
        'Heart Stake': 'ハートステイク',
        'Hell\'s Sting': 'ヘルスティング',
        'Hemitheos\'s Aero III': 'ヘーミテオス・エアロガ',
        'Hemitheos\'s Dark IV': 'ヘーミテオス・ダージャ',
        'Hemitheos\'s Fire III': 'ヘーミテオス・ファイガ',
        'Hemitheos\'s Fire IV': 'ヘーミテオス・ファイジャ',
        'Hemitheos\'s Thunder III': 'ヘーミテオス・サンダガ',
        'Hemitheos\'s Water IV': 'ヘーミテオス・ウォタジャ',
        'Inversive Chlamys': 'インヴァースクラミュス',
        'Kothornos Kick': 'コトルヌスキック',
        'Kothornos Quake': 'コトルヌスクエイク',
        'Lava Pinax': 'ピナクスラーヴァ',
        'Levinstrike Pinax': 'ピナクスサンダー',
        'Periaktoi': 'ペリアクトイ',
        '(?<!\\w )Pinax': 'ピナクス',
        'Searing Stream': 'シアリングストリーム',
        'Setting the Scene': '劇場創造',
        'Shifting Strike': 'シフティングストライク',
        'Ultimate Impulse': 'アルティメットインパルス',
        'Vengeful Belone': 'エンチャンテッドペロネー：リベンジ',
        'Well Pinax': 'ピナクススプラッシュ',
        'Wreath of Thorns': 'ソーンヘッジ',
      },
    },
  ],
};

export default triggerSet;
