import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// Part Two
// TODO: Better Dark Design/tether break callouts
// TODO: Wreath of Thorns 3 strategy (1 = melee, 2 = ranged) or
//       something more intelligent such as tracking the vulnerabilities?
// TODO: Heart Stake is tankbuster with DoT, does it need to be output differrently?
// TODO: Curtain Call tank swap

export interface Data extends RaidbossData {
  actingRole?: string;
  decOffset?: number;
  tetherRole?: string[];
  debuffRole?: string[];
  hasRoleCall?: boolean;
  ignoreChlamys?: boolean;
  pinaxCount?: number;
  wellShiftKnockback?: boolean;
  beloneCoilsTwo?: boolean;
  bloodrakeCounter?: number;
  act?: string;
  actHeadmarkers: { [name: string]: string };
  actFourThorn?: PluginCombatantState;
  thornIds?: number[];
  jumpDir1?: string;
  kickTwo?: boolean;
  fleetingImpulseCounter?: number;
  curtainCallGroup?: number;
  curtainCallTracker?: number;
}

const roleOutputStrings = {
  tankHealer: {
    en: 'Tank/Healer',
    de: 'Tank/Heiler',
    fr: 'Tank/Healer',
    ja: 'タンク＆ヒーラ',
    cn: '坦克/治疗',
    ko: '탱/힐',
  },
  dps: {
    en: 'DPS',
    de: 'DPS',
    fr: 'DPS',
    ja: 'DPS',
    cn: 'DPS',
    ko: '딜러',
  },
  roleTethers: {
    en: '${role} Tethers',
    de: '${role} Verbindung',
    fr: 'Liens ${role}',
    ja: '線もらう: ${role}',
    cn: '${role} 截线',
    ko: '줄 받기: ${role}',
  },
  roleDebuffs: {
    en: '${role} Role Calls',
    de: '${role} Dreifäulenoper',
    fr: 'Debuffs ${role}',
    ja: 'デバフもらう: ${role}',
    cn: '${role} 拿毒',
    ko: '디버프 받기: ${role}',
  },
  roleEverything: {
    en: '${role} Everything',
    de: '${role} Alles',
    fr: 'Tout ${role}',
    ja: '${role} 全てもらう',
    cn: '${role} 处理全部',
    ko: '${role} 전부 받기',
  },
  roleTowers: {
    en: '${role} Towers',
    de: '${role} Türme',
    fr: 'Tours ${role}',
    ja: '塔: ${role}',
    cn: '${role} 踩塔',
    ko: '타워: ${role}',
  },
  unknown: Outputs.unknown,
};

const curtainCallOutputStrings = {
  group: {
    en: 'Group ${num}',
    de: 'Group ${num}',
    fr: 'Groupe ${num}',
    ja: '${num} 組',
    cn: '${num} 组',
    ko: '그룹: ${num}',
  },
};

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Elegant Evisceration (00DA).
// The first 1B marker in the phase 2 encounter is the Act 2 fire headmarker (012F).
const eviscerationMarker = parseInt('00DA', 16);
const orangeMarker = parseInt('012F', 16);

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

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFourthCircleSavage,
  timelineFile: 'p4s.txt',
  initData: () => {
    return {
      actHeadmarkers: {},
    };
  },
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
          fr: 'Packez les zones au sol d\'AoEs',
          ja: 'AoEを誘導',
          cn: '集合放置AOE',
          ko: '중앙에 모여 장판 한곳에 깔기',
        },
      },
    },
    {
      id: 'P4S Kothornos Kick',
      regex: /Kothornos Kick/,
      beforeSeconds: 5.3,
      infoText: (data, _matches, output) => {
        let jumpDir = '';
        if (data.jumpDir1 === 'east')
          jumpDir = !data.kickTwo ? output.west!() : output.east!();
        else if (data.jumpDir1 === 'west')
          jumpDir = !data.kickTwo ? output.east!() : output.west!();
        else
          return output.baitJump!();

        return output.baitJumpDir!({ dir: jumpDir });
      },
      run: (data) => data.kickTwo = true,
      outputStrings: {
        baitJumpDir: {
          en: 'Bait Jump ${dir}?',
          de: 'Sprung ködern ${dir}?',
          fr: 'Attirez le saut à l\'${dir}?',
          ja: 'ジャンプ誘導?: ${dir}',
          cn: '引导跳跃 ${dir}?',
          ko: '점프 유도?: ${dir}',
        },
        baitJump: {
          en: 'Bait Jump?',
          de: 'Sprung ködern?',
          fr: 'Attirez le saut ?',
          ja: 'ジャンプ誘導?',
          cn: '引导跳跃?',
          ko: '점프 유도?',
        },
        east: Outputs.east,
        west: Outputs.west,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P4S Kothornos Quake',
      regex: /Kothornos Quake/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Earthshakers?',
          de: 'Erdstoß ködern?',
          fr: 'Orientez les secousses ?',
          ja: 'アスシェイカー誘導?',
          cn: '引导地震?',
          ko: '어스세이커 유도?',
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
          ja: '真ん中でノックバック',
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
      run: (data, matches) => {
        const isDoorBoss = data.act === undefined;
        const first = isDoorBoss ? eviscerationMarker : orangeMarker;
        getHeadmarkerId(data, matches, first);
      },
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
      netRegex: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'ヘスペロス' }),
      preRun: (data) => {
        if (!data.beloneCoilsTwo) {
          delete data.debuffRole;
          delete data.tetherRole;
          data.hasRoleCall = false;
          data.ignoreChlamys = true;
        } else {
          data.ignoreChlamys = false;
        }
      },
      suppressSeconds: 1,
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
            (data.debuffRole ??= []).push('dps');
          }

          // For second coils, if you are not in the debuff list here you are tower
          if (!data.debuffRole.includes(data.role))
            return { ['alertText']: output.roleTowers!({ role: roles[roleTowers] }) };

          // If you have tethers and debuff, you need everything
          const tetherRole = data.tetherRole ??= [];
          const debuffRole = data.debuffRole ??= [];
          if (debuffRole[0] === tetherRole[0])
            return { ['infoText']: output.roleEverything!({ role: roles[roleOther] }) };
          return { ['infoText']: output.roleDebuffs!({ role: roles[roleOther] }) };
        }

        // First Coils = Tethers later
        if (roleTowers === 'dps') {
          (data.tetherRole ??= []).push('healer');
          data.tetherRole.push('tank');
        } else {
          (data.tetherRole ??= []).push('dps');
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
      infoText: (data, matches, output) => {
        const debuffRole = (data.debuffRole ??= []).includes(data.role);
        if (matches.effectId === 'AF2') {
          // Call Pass Role Call if not in the debuff role
          if (!debuffRole)
            return output.passRoleCall!();
          data.hasRoleCall = true;
        }

        // AF3 is obtained after passing Role Call (AF2)
        if (matches.effectId === 'AF3')
          data.hasRoleCall = false;
      },
      outputStrings: {
        passRoleCall: {
          en: 'Pass Role Call',
          de: 'Dreifäulenoper weitergeben',
          fr: 'Passez votre debuff',
          ja: 'デバフ渡す',
          cn: '传毒',
          ko: '디버프 건네기',
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
        if (!data.hasRoleCall && debuffRole)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Get Role Call',
          de: 'Nimm Dreifäulenoper',
          fr: 'Prenez un debuff',
          ja: 'デバフもらう',
          cn: '拿毒',
          ko: '디버프 받기',
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
      condition: (data) => !data.ignoreChlamys,
      alertText: (data, _matches, output) => {
        const dps = (data.tetherRole ??= []).includes('dps');
        if (dps)
          return output.roleTethers!({ role: output.dps!() });
        if (data.tetherRole.length)
          return output.roleTethers!({ role: output.tankHealer!() });
        return output.roleTethers!({ role: output.unknown!() });
      },
      run: (data) => {
        if (!data.beloneCoilsTwo) {
          delete data.tetherRole;
          data.hasRoleCall = false;
        }
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
          fr: 'Foudre',
          ja: '雷',
          cn: '雷',
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
        return output.shiftWell!();
      },
      outputStrings: {
        text: {
          en: 'Well Pinax',
          de: 'Brunnen-Pinax',
          fr: 'Pinax d\'eau',
          ja: '水',
          cn: '水',
          ko: '물',
        },
        shiftWell: {
          en: 'Well => Shift',
          de: 'Brunnen => Schwingen',
          fr: 'Eau => Frappe mouvante',
          ja: '水 => シフティング',
          cn: '水 => 位移',
          ko: '물 => 동서남북 기믹',
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
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          knockback: Outputs.knockback,
          middleKnockback: {
            en: 'Middle Knockback',
            de: 'Rückstoß von der Mitte',
            fr: 'Poussée au milieu',
            ja: '真ん中でノックバック',
            cn: '中间击退',
            ko: '중앙에서 넉백',
          },
        };

        if (data.wellShiftKnockback)
          return { ['alertText']: output.knockback!() };
        return { ['infoText']: output.middleKnockback!() };
      },
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
          fr: 'Groupes sur les heals',
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
          de: 'Cleave -> Geh in den Norden',
          fr: 'Cleave au nord',
          ja: '北の横',
          cn: '北 两侧',
          ko: '북쪽 칼 휘두르기',
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
          de: 'Cleave -> Geh in den Osten',
          fr: 'Cleave à l\'est',
          ja: '東の横',
          cn: '东 两侧',
          ko: '동쪽 칼 휘두르기',
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
          de: 'Cleave -> Geh in den Süden',
          fr: 'Cleave au sud',
          ja: '南の横',
          cn: '南 两侧',
          ko: '남쪽 칼 휘두르기',
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
          de: 'Cleave -> Geh in den Westen',
          fr: 'Cleave à l\'ouest',
          ja: '西の横',
          cn: '西 两侧',
          ko: '서쪽 칼 휘두르기',
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
          de: 'Rückstoß -> Geh in den Norden',
          fr: 'Cape au nord',
          ja: '北でノックバック',
          cn: '北 击退',
          ko: '북쪽 망토',
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
          de: 'Rückstoß -> Geh in den Osten',
          fr: 'Cape à l\'est',
          ja: '東でノックバック',
          cn: '东 击退',
          ko: '동쪽 망토',
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
          de: 'Rückstoß -> Geh in den Süden',
          fr: 'Cape au sud',
          ja: '南でノックバック',
          cn: '南 击退',
          ko: '남쪽 망토',
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
          de: 'Rückstoß -> Geh in den Westen',
          fr: 'Cape à l\'ouest',
          ja: '西でノックバック',
          cn: '西 击退',
          ko: '서쪽 망토',
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
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
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
          fr: 'Rôle ${actingRole}',
          ja: 'ロール: ${actingRole}',
          cn: '扮演 ${actingRole}',
          ko: '역할: ${actingRole}',
        },
        dps: roleOutputStrings.dps,
        healer: {
          en: 'Healer',
          de: 'Heiler',
          fr: 'Healer',
          ja: 'ヒーラ',
          cn: '治疗',
          ko: '힐러',
        },
        tank: {
          en: 'Tank',
          de: 'Tank',
          fr: 'Tank',
          ja: 'タンク',
          cn: '坦克',
          ko: '탱커',
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
          fr: 'Positions pour les orbes de rôles',
          ja: '玉、ロール散開',
          cn: '职能撞球站位',
          ko: '구슬, 역할별 위치로',
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
          fr: '${pinax} safe',
          ja: '安置: ${pinax}',
          cn: '${pinax} 安全',
          ko: '안전한 곳: ${pinax}',
        },
        acid: {
          en: 'Acid',
          de: 'Gift',
          fr: 'Poison',
          ja: '毒/緑',
          cn: '毒',
          ko: '독/녹색',
        },
        lava: {
          en: 'Lava',
          de: 'Lava',
          fr: 'Feu',
          ja: '炎/赤',
          cn: '火',
          ko: '불/빨강',
        },
        well: {
          en: 'Well',
          de: 'Brunnen',
          fr: 'Eau',
          ja: '水/白',
          cn: '水',
          ko: '물/하양',
        },
        thunder: {
          en: 'Thunder',
          de: 'Blitz',
          fr: 'Foudre',
          ja: '雷/青',
          cn: '雷',
          ko: '번개/파랑',
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
      id: 'P4S Act Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6A0C', '6EB[4-7]', '6A36'], source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6A0C', '6EB[4-7]', '6A36'], source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6A0C', '6EB[4-7]', '6A36'], source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6A0C', '6EB[4-7]', '6A36'], source: 'ヘスペロス' }),
      run: (data, matches) => {
        const actMap: { [id: string]: string } = {
          '6A0C': '1',
          '6EB4': '2',
          '6EB5': '3',
          '6EB6': '4',
          '6EB7': 'finale',
          '6A36': 'curtain',
        };
        data.act = actMap[matches.id];
        data.actHeadmarkers = {};
      },
    },
    {
      id: 'P4S Thorns Collector',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A0C', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A0C', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A0C', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A0C', source: 'ヘスペロス' }),
      promise: async (data, matches, _output) => {
        // Collect all Hesperos entities up front
        let combatantName = null;
        combatantName = matches.source;

        let combatantData = null;
        if (combatantName) {
          combatantData = await callOverlayHandler({
            call: 'getCombatants',
            names: [combatantName],
          });
        }

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (combatantData === null) {
          console.error(`Hesperos: null data`);
          return;
        }
        if (!combatantData.combatants) {
          console.error(`Hesperos: null combatants`);
          return;
        }
        const combatantDataLength = combatantData.combatants.length;
        if (combatantDataLength < 8) {
          console.error(`Hesperos: expected at least 8 combatants got ${combatantDataLength}`);
          return;
        }

        // the lowest eight Hesperos IDs are the thorns that tether the boss
        const sortCombatants = (a: PluginCombatantState, b: PluginCombatantState) => (a.ID ?? 0) - (b.ID ?? 0);
        const sortedCombatantData = combatantData.combatants.sort(sortCombatants).splice(combatantDataLength - 8, combatantDataLength);

        if (!sortedCombatantData)
          throw new UnreachableCode();

        sortedCombatantData.forEach((combatant: PluginCombatantState) => {
          (data.thornIds ??= []).push(combatant.ID ?? 0);
        });
      },
    },
    {
      id: 'P4S Act One Safe Spots',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AD', source: 'Hesperos' }),
      netRegexDe: NetRegexes.tether({ id: '00AD', source: 'Hesperos' }),
      netRegexFr: NetRegexes.tether({ id: '00AD', source: 'Hespéros' }),
      netRegexJa: NetRegexes.tether({ id: '00AD', source: 'ヘスペロス' }),
      condition: (data) => data.act === '1',
      // Tethers come out Cardinals (0 seconds), (3s) Towers, (6s) Other Cardinals
      suppressSeconds: 7,
      infoText: (data, matches, output) => {
        const thorn = (data.thornIds ??= []).indexOf(parseInt(matches.sourceId, 16));
        const thornMap: { [thorn: number]: string } = {
          4: output.text!({ dir1: output.north!(), dir2: output.south!() }),
          5: output.text!({ dir1: output.north!(), dir2: output.south!() }),
          6: output.text!({ dir1: output.east!(), dir2: output.west!() }),
          7: output.text!({ dir1: output.east!(), dir2: output.west!() }),
        };
        return thornMap[thorn];
      },
      outputStrings: {
        text: {
          en: '${dir1}/${dir2} first',
          de: '${dir1}/${dir2} zuerst',
          fr: '${dir1}/${dir2} en premier',
          ja: '${dir1}/${dir2}から',
          cn: '先去 ${dir1}/${dir2}',
          ko: '${dir1}/${dir2}부터',
        },
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
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
          fr: 'À l\'intérieur (Tank busters)',
          ja: 'タンク近づく',
          cn: '靠近 (坦克死刑)',
          ko: '탱커 안쪽으로',
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
          en: 'Out (Tankbusters)',
          de: 'Raus, Tankbuster',
          fr: 'À l\'extérieur (Tank busters)',
          ja: 'タンク離れる',
          cn: '远离 (坦克死刑)',
          ko: '탱커 바깥쪽으로',
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
      id: 'P4S Act Two Safe Spots',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AD', source: 'Hesperos' }),
      netRegexDe: NetRegexes.tether({ id: '00AD', source: 'Hesperos' }),
      netRegexFr: NetRegexes.tether({ id: '00AD', source: 'Hespéros' }),
      netRegexJa: NetRegexes.tether({ id: '00AD', source: 'ヘスペロス' }),
      condition: (data) => data.act === '2',
      // Tethers come out Cardinals (0 seconds), (3s) Other Cardinals
      suppressSeconds: 4,
      infoText: (data, matches, output) => {
        const thorn = (data.thornIds ??= []).indexOf(parseInt(matches.sourceId, 16));
        const thornMap: { [thorn: number]: string } = {
          0: output.text!({ dir1: output.north!(), dir2: output.south!() }),
          1: output.text!({ dir1: output.north!(), dir2: output.south!() }),
          2: output.text!({ dir1: output.north!(), dir2: output.south!() }),
          3: output.text!({ dir1: output.north!(), dir2: output.south!() }),
          4: output.text!({ dir1: output.east!(), dir2: output.west!() }),
          5: output.text!({ dir1: output.east!(), dir2: output.west!() }),
          6: output.text!({ dir1: output.east!(), dir2: output.west!() }),
          7: output.text!({ dir1: output.east!(), dir2: output.west!() }),
        };
        return thornMap[thorn];
      },
      outputStrings: {
        text: {
          en: '${dir1}/${dir2} first',
          de: '${dir1}/${dir2} zuerst',
          fr: '${dir1}/${dir2} en premier',
          ja: '${dir1}/${dir2}から',
          cn: '先去 ${dir1}/${dir2}',
          ko: '${dir1}/${dir2}부터',
        },
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
    },
    {
      id: 'P4S Act Headmarker Collector',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.act !== undefined,
      run: (data, matches) => {
        data.actHeadmarkers[matches.target] = getHeadmarkerId(data, matches, orangeMarker);
      },
    },
    {
      id: 'P4S Act 2 Color Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AC' }),
      condition: (data) => data.act === '2',
      alertText: (data, matches, output) => {
        if (matches.target !== data.me && matches.source !== data.me)
          return;

        // Only the healer gets a purple headmarker, and the tethered tank does not.
        const id = data.actHeadmarkers[matches.source] ?? data.actHeadmarkers[matches.target];

        if (id === undefined) {
          console.error(`Act 2 Tether: missing headmarker: ${JSON.stringify(data.actHeadmarkers)}`);
          return;
        }

        const other = data.ShortName(matches.target === data.me ? matches.source : matches.target);
        return {
          '012D': output.purpleTether!({ player: other }),
          '012E': output.greenTether!({ player: other }),
          '012F': output.orangeTether!({ player: other }),
        }[id];
      },
      outputStrings: {
        purpleTether: {
          en: 'Purple (with ${player})',
          de: 'Lila (mit ${player})',
          fr: 'Violet (avec ${player})',
          ja: 'ダージャ (${player})',
          ko: '다쟈 (${player})',
        },
        orangeTether: {
          en: 'Fire (with ${player})',
          de: 'Feuer (mit ${player})',
          fr: 'Feu (avec ${player})',
          ja: 'ファイガ (${player})',
          ko: '파이가 (${player})',
        },
        greenTether: {
          en: 'Air (with ${player})',
          de: 'Luft (mit ${player})',
          fr: 'Air (avec ${player})',
          ja: 'エアロガ (${player})',
          ko: '에어로가 (${player})',
        },
      },
    },
    {
      id: 'P4S Act 4 Color Tether',
      type: 'Tether',
      // Tether comes after the headmarker color.
      netRegex: NetRegexes.tether({ id: '00A[CD]', source: 'Hesperos' }),
      netRegexDe: NetRegexes.tether({ id: '00A[CD]', source: 'Hesperos' }),
      netRegexFr: NetRegexes.tether({ id: '00A[CD]', source: 'Hespéros' }),
      netRegexJa: NetRegexes.tether({ id: '00A[CD]', source: 'ヘスペロス' }),
      condition: (data, matches) => data.act === '4' && matches.target === data.me,
      durationSeconds: (data, matches) => data.actHeadmarkers[matches.target] === '012D' ? 12 : 9,
      suppressSeconds: 9999,
      promise: async (data, matches) => {
        const result = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        const myThorn = result.combatants[0];
        if (!myThorn) {
          console.error(`Act 4 Tether: null data`);
          return;
        }

        data.actFourThorn = myThorn;
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          blueTether: {
            en: 'Blue Tether',
            de: 'Blaue Verbindung',
            fr: 'Lien bleu',
            ja: 'ワタガ (青)',
            cn: '蓝标连线',
            ko: '워터가 (파랑)',
          },
          purpleTether: {
            en: 'Purple Tether',
            de: 'Lila Verbindung',
            fr: 'lien violet',
            ja: 'ダージャ(紫)',
            cn: '紫标连线',
            ko: '다쟈 (자주색)',
          },
          blueTetherDir: {
            en: 'Blue Tether (${dir})',
            de: 'Blaue Verbindung (${dir})',
            fr: 'Lien bleu direction (${dir})',
            ko: '워터가 (파랑) (${dir})',
          },
          purpleTetherDir: {
            en: 'Purple Tether (${dir})',
            de: 'Lilane Verbindung (${dir})',
            fr: 'lien violet direction (${dir})',
            ko: '다쟈 (자주색) (${dir})',
          },
          dirN: Outputs.dirN,
          dirNE: Outputs.dirNE,
          dirE: Outputs.dirE,
          dirSE: Outputs.dirSE,
          dirS: Outputs.dirS,
          dirSW: Outputs.dirSW,
          dirW: Outputs.dirW,
          dirNW: Outputs.dirNW,
          unknown: Outputs.unknown,
        };

        const id = data.actHeadmarkers[matches.target];
        if (id === undefined)
          return;

        if (data.actFourThorn === undefined) {
          if (id === '012C')
            return { infoText: output.blueTether!() };
          if (id === '012D')
            return { alertText: output.purpleTether!() };
          return;
        }

        const centerX = 100;
        const centerY = 100;
        const x = data.actFourThorn.PosX - centerX;
        const y = data.actFourThorn.PosY - centerY;
        // Dirs: N = 0, NE = 1, ..., NW = 7
        const thornDir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        const dirStr: string = {
          0: output.dirN!(),
          1: output.dirNE!(),
          2: output.dirE!(),
          3: output.dirSE!(),
          4: output.dirS!(),
          5: output.dirSW!(),
          6: output.dirW!(),
          7: output.dirNW!(),
        }[thornDir] ?? output.unknown!();

        if (id === '012C')
          return { infoText: output.blueTetherDir!({ dir: dirStr }) };
        if (id === '012D')
          return { alertText: output.purpleTetherDir!({ dir: dirStr }) };
      },
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
      id: 'P4S Act Three Bait Order',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AD', source: 'Hesperos' }),
      netRegexDe: NetRegexes.tether({ id: '00AD', source: 'Hesperos' }),
      netRegexFr: NetRegexes.tether({ id: '00AD', source: 'Hespéros' }),
      netRegexJa: NetRegexes.tether({ id: '00AD', source: 'ヘスペロス' }),
      condition: (data) => data.act === '3',
      // Tethers come out East or West (0 seconds), (3s) Middle knockack, (6) Opposite Cardinal
      suppressSeconds: 7,
      infoText: (data, matches, output) => {
        const thorn = (data.thornIds ??= []).indexOf(parseInt(matches.sourceId, 16));

        const thornMapDirs: { [thorn: number]: string } = {
          0: 'east',
          1: 'east',
          2: 'east',
          3: 'east',
          4: 'west',
          5: 'west',
          6: 'west',
          7: 'west',
        };

        data.jumpDir1 = thornMapDirs[thorn];
        return output[thornMapDirs[thorn] ??= 'unknown']!();
      },
      outputStrings: {
        text: {
          en: 'Bait Jump ${dir1} first',
          de: 'Köder Sprung ${dir1} zuerst',
          fr: 'Attirez le saut à l\'${dir1} en premier',
          ja: 'ジャンプ誘導: ${dir1}',
          cn: '引导跳跃 先去 ${dir1}',
          ko: '점프 유도: ${dir1} 먼저',
        },
        east: Outputs.east,
        west: Outputs.west,
        unknown: Outputs.unknown,
      },
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
          fr: 'Dispersez-vous vers une épine liée',
          ja: '結ばれた羽の方で散開',
          cn: '在连线荆棘处散开',
          ko: '연결된 가시 덤불 주위 산개',
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
      // ~22.3 seconds between #1 Fleeting Impulse (6A1C) to #1 Hemitheos's Thunder III (6A0E)
      // ~21.2 seconds between #8 Fleeting Impulse (6A1C) to #8 Hemitheos's Thunder III (6A0E).
      // Split the difference with 22 seconds.
      durationSeconds: 22,
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.text!({ num: data.fleetingImpulseCounter });
      },
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '羽: ${num}番目',
          cn: '${num}',
          ko: '가시: ${num}번째',
        },
      },
    },
    {
      id: 'P4S Curtain Call Debuffs',
      // Durations could be 12s, 22s, 32s, and 42s
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AF4', capture: true }),
      condition: (data, matches) => {
        return (data.me === matches.target && data.act === 'curtain');
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = curtainCallOutputStrings;

        data.curtainCallGroup = Math.ceil(((parseFloat(matches.duration)) - 2) / 10);

        if (data.curtainCallGroup === 1)
          return { alarmText: output.group!({ num: data.curtainCallGroup }) };
        return { infoText: output.group!({ num: data.curtainCallGroup }) };
      },
    },
    {
      id: 'P4S Curtain Call Reminders',
      // Alarms for the other groups
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B7D', capture: true }),
      condition: (data) => data.act === 'curtain',
      preRun: (data) => data.curtainCallTracker = (data.curtainCallTracker ?? 0) + 1,
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (
          (data.curtainCallGroup === 2 && data.curtainCallTracker === 2) ||
          (data.curtainCallGroup === 3 && data.curtainCallTracker === 4) ||
          (data.curtainCallGroup === 4 && data.curtainCallTracker === 6)
        )
          return output.group!({ num: data.curtainCallGroup });
      },
      run: (data) => {
        // Clear once 8 tethers have been broken
        if (data.curtainCallTracker === 8) {
          data.curtainCallTracker = 0;
          data.curtainCallGroup = 0;
        }
      },
      outputStrings: curtainCallOutputStrings,
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
          fr: 'Positions',
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
        'Demigod Double': 'Hemitheischer Hieb',
        'Director\'s Belone': 'Maskiertes Belone',
        'Directional Shift': 'Himmelsrichtung-Schwingen',
        'Elegant Evisceration': 'Adrette Ausweidung',
        'Elemental Belone': 'Elementares Belone',
        'Farsight': 'Blick in die Ferne',
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
        'Nearsight': 'Blick nach innen',
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
      'replaceSync': {
        'Hesperos': 'Hespéros',
      },
      'replaceText': {
        '--debuffs--': '--debuffs--',
        '--element debuffs--': '--debuffs d\'éléments--',
        '--role debuffs--': '--debuffs de rôles--',
        '(?<!/)Acid Pinax(?!/)': 'Pinax de poison',
        'Acid Pinax/Lava Pinax': 'Pinax de poison/feu',
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
        'Demigod Double': 'Gémellité du demi-dieu',
        'Directional Shift': 'Frappe mouvante vers un cardinal',
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
        '(?<!/)Lava Pinax(?!/)': 'Pinax de feu',
        'Lava Pinax/Acid Pinax': 'Pinax de feu/poison',
        '(?<!/)Levinstrike Pinax(?!/)': 'Pinax de foudre',
        'Levinstrike Pinax/Well Pinax': 'Pinax de foudre/eau',
        'Nearsight/Farsight': 'Frappe introspéctive/visionnaire',
        'Periaktoi': 'Périacte',
        '(?<!\\w )Pinax': 'Pinax',
        'Searing Stream': 'Flux ardent',
        'Setting the Scene': 'Lever de rideau',
        'Shifting Strike': 'Frappe mouvante',
        'Ultimate Impulse': 'Impulsion ultime',
        'Vengeful Belone': 'Bélos enchanté : vengeance',
        '(?<!/)Well Pinax(?!/)': 'Pinax d\'eau',
        'Well Pinax/Levinstrike Pinax': 'Pinax d\'eau/foudre',
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
