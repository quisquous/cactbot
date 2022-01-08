import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// Part One
// TODO: Bloodrake Handle tether Role Call (AF2 effectId) mechanic
// TODO: Touch up timing of callouts of knockback/cleave and Pinax?
// TODO: Begone Coils could potentially call dps or tank/healers and which gets tether.

// Part Two
// TODO: Wreath of Thorns 1 callout safe spot order (N/S or E/W)
// TODO: Verify Nearsight/Farsight ids
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
  fleetingImpulseCounter?: number;
  meFleetingImpulse?: number;
}

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
      netRegex: NetRegexes.startsUsing({ id: '6A40', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A40', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A40', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A40', source: 'ヘスペロス', capture: false }),
      response: Responses.aoe(),
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
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Thunder',
          de: 'Blitz',
          fr: 'Tempête',
          ja, 'サンダー',
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
      delaySeconds: 5,
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
    {
      id: 'P4S Acid Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D4', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D4', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D4', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D4', source: 'ヘスペロス', capture: false }),
      response: Responses.spread(),
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
          en: 'Go North Edge',
          de: 'Geh zur nördlichen Kante',
          fr: 'Allez au bord nord',
          cn: '去上 /北边',
          ko: '북쪽 구석으로',
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
          en: 'Go East Edge',
          de: 'Geh zur östlichen Kante',
          fr: 'Allez au bord est',
          cn: '去右 /东边',
          ko: '동쪽 구석으로',
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
          en: 'Go South Edge',
          de: 'Geh zur südlichen Kante',
          fr: 'Allez au bord sud',
          cn: '去下 /南边',
          ko: '남쪽 구석으로',
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
          en: 'Go West Edge',
          de: 'Geh zur westlichen Kante',
          fr: 'Allez au bord ouest',
          cn: '去左 /西边',
          ko: '서쪽 구석으로',
        },
      },
    },
    {
      id: 'P4S Northerly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69FD', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69FD', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69FD', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69FD', source: 'ヘスペロス', capture: false }),
      delaySeconds: 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'North Knockback',
          de: 'Rückstoß vom Norden',
          fr: 'Poussée au nord',
          cn: '上/北 击退',
          ko: '북쪽 넉백',
        },
      },
    },
    {
      id: 'P4S Easterly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69FF', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69FF', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69FF', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69FF', source: 'ヘスペロス', capture: false }),
      delaySeconds: 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'East Knockback',
          de: 'Rückstoß vom Osten',
          fr: 'Poussée à l\'est',
          cn: '右/东 击退',
          ko: '동쪽 넉백',
        },
      },
    },
    {
      id: 'P4S Southerly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69FE', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69FE', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69FE', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69FE', source: 'ヘスペロス', capture: false }),
      delaySeconds: 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'South Knockback',
          de: 'Rückstoß vom Süden',
          fr: 'Poussée au sud',
          cn: '下/南 击退',
          ko: '남쪽 넉백',
        },
      },
    },
    {
      id: 'P4S Westerly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A00', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A00', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A00', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A00', source: 'ヘスペロス', capture: false }),
      delaySeconds: 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'West Knockback',
          de: 'Rückstoß vom Westen',
          fr: 'Poussée à l\'ouest',
          cn: '左/西 击退',
          ko: '서쪽 넉백',
        },
      },
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
        },
        dps: {
          en: 'DPS',
        },
        healer: {
          en: 'Healer',
        },
        tank: {
          en: 'Tank',
        },
      },
    },
    {
      id: 'P4S Belone Bursts Position',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D9', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D9', source: 'ヘスペロス', capture: false }),
      infoText: (_data, _matches, output) => output.rolePositions!(),
      outputStrings: {
        rolePositions: {
          en: 'Role positions',
          de: 'Rollenposition',
          fr: 'Positions par rôle',
          ja: 'ロール特定位置へ',
          cn: '去指定位置',
          ko: '직업별 산개위치로',
        },
      },
    },
    {
      id: 'P4S Belone Bursts Orbs',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D9', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D9', source: 'ヘスペロス' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 1,
      infoText: (data, _matches, output) => output.text!({ role: data.actingRole }),
      outputStrings: {
        text: {
          en: 'Share two ${role} orbs',
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
          '69F5': 'Acid',
          '69F6': 'Lava',
          '69F7': 'Well',
          '69F8': 'Levinstrike',
        };
        return output.text!({ pinax: pinax[matches.id] });
      },
      outputStrings: {
        text: {
          en: '${pinax} safe',
        },
      },
    },
    {
      id: 'P4S Belone Coils',
      // This is either DPS towers or tank/healer towers
      // The roles maked by tower grab tethers
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69DD', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69DD', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69DD', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69DD', source: 'ヘスペロス', capture: false }),
      delaySeconds: 2,
      infoText: (data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get other role Tower',
          de: 'Geh in einen Turm einer anderen Rolle',
          fr: 'Prenez la tour d\'un autre rôle',
          cn: '踩其他职能的塔',
          ko: '내 직업군이 아닌쪽 장판 밟기',
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
        },
      },
    },
    {
      id: 'P4S Fleeting Impulse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A1C', source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6A1C', source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6A1C', source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6A1C', source: 'ヘスペロス' }),
      preRun: (data, _matches) => {
        if (typeof data.fleetingImpulseCounter === 'undefined')
          data.fleetingImpulseCounter = 0;
        return data.fleetingImpulseCounter++;
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.text!({ num: data.meFleetingImpulse = data.fleetingImpulseCounter });
      },
      outputStrings: {
        text: {
          en: '${num}',
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
        '\\(cleave\\)': '(Cleave)',
        '\\(knockback\\)': '(Rückstoß)',
        'Acid Pinax': 'Säure-Pinax',
        'Belone Bursts': 'Berstendes Belone',
        'Belone Coils': 'Gewundenes Belone',
        'Bloodrake': 'Blutharke',
        'Burst(?!s)': 'Einschlag',
        'Decollation': 'Enthauptung',
        'Directional Shift': 'Himmelsrichtung-Schwingen',
        'Elegant Evisceration': 'Adrette Ausweidung',
        'Hell Skewer': 'Höllenspieß',
        'Levinstrike Pinax': 'Donner-Pinax',
        '(?<!\\w )Pinax': 'Pinax',
        'Setting the Scene': 'Vorhang auf',
        'Shifting Strike': 'Schwingenschlag',
        'Well Pinax': 'Brunnen-Pinax',
        'Westerly Shift': 'Schwingen gen Westen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hesperos': 'Hespéros',
      },
      'replaceText': {
        '\\(cleave\\)': '(cleave)',
        '\\(knockback\\)': '(poussée)',
        'Acid Pinax': 'Pinax de poison',
        'Belone Bursts': 'Bélos enchanté : explosion',
        'Belone Coils': 'Bélos enchanté : rotation',
        'Bloodrake': 'Racle de sang',
        'Burst(?!s)': 'Explosion',
        'Decollation': 'Décollation',
        'Directional Shift': 'Frappe mouvante vers un cardinal',
        'Elegant Evisceration': 'Éviscération élégante',
        'Hell Skewer': 'Embrochement infernal',
        '(?<!/)Levinstrike Pinax(?!/)': 'Pinax de foudre',
        'Levinstrike Pinax/Well Pinax': 'Pinax de foudre/eau',
        '(?<!\\w )Pinax': 'Pinax',
        'Setting the Scene': 'Lever de rideau',
        'Shifting Strike': 'Frappe mouvante',
        '(?<!/)Well Pinax(?!/)': 'Pinax d\'eau',
        'Well Pinax/Levinstrike Pinax': 'Pinax d\'eau/foudre',
        'Westerly Shift': 'Frappe mouvante vers l\'ouest',
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
        'Belone Bursts': 'エンチャンテッドペロネー：エクスプロージョン',
        'Belone Coils': 'エンチャンテッドペロネー：ラウンド',
        'Bloodrake': 'ブラッドレイク',
        'Burst(?!s)': '大爆発',
        'Decollation': 'デコレーション',
        'Elegant Evisceration': 'エレガントイヴィセレーション',
        'Hell Skewer': 'ヘルスキュアー',
        'Levinstrike Pinax': 'ピナクスサンダー',
        '(?<!\\w )Pinax': 'ピナクス',
        'Setting the Scene': '劇場創造',
        'Shifting Strike': 'シフティングストライク',
        'Well Pinax': 'ピナクススプラッシュ',
        'Westerly Shift': 'シフティングストライクW',
      },
    },
  ],
};

export default triggerSet;
