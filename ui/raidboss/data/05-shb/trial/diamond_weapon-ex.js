import ZoneId from '../../../../../resources/zone_id';
import NetRegexes from '../../../../../resources/netregexes';
import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';

export default {
  zoneId: ZoneId.TheCloudDeckExtreme,
  timelineFile: 'diamond_weapon-ex.txt',
  triggers: [
    // Phase 1&3
    {
      id: 'DiamondEx Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA7', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
      run: (data) => data.phase = data.phase || 1,
    },
    // @TODO: There's probably a better callout for these mechanics, e.g.
    // `jump -> stay -> aoe`
    // `stay -> jump -> aoe`
    // `jump -> stack -> stay`
    // `stay -> stack -> jump`
    // `jump -> spread -> stay`
    // `stay -> spread -> jump`
    // but need to figure out what side player is on
    {
      id: 'DiamondEx Adamant Purge West Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5F9B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5F9B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5F9B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5F9B', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go east -> aoe',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge East Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5F9A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5F9A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5F9A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5F9A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go west -> aoe',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge West Diamond Flash',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA5', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go east -> stack',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge East Diamond Flash',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA4', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go west -> stack',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge West Homing Laser',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA3', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go east -> spread',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge East Homing Laser',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA2', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go west -> spread',
        },
      },
    },
    // @TODO: Make this a collector with with flare/away from flare
    {
      id: 'DiamondEx Photon Burst',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA8', capture: false }),
      condition: Conditions.caresAboutMagical(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare',
          de: 'Flare',
          fr: 'Brasier',
          ja: 'フレア',
          cn: '核爆',
          ko: '플레어',
        },
      },
    },
    // @TODO: Phase transition tethers and KB
    {
      id: 'DiamondEx Code Chi-Xi-Stigma',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAD', capture: false }),
      run: (data) => data.phase = 2,
    },
    // Phase 2
    {
      id: 'DiamondEx Outrage',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FBC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FBC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FBC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FBC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'DiamondEx Auri Doomstead',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FBD' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FBD' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FBD' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FBD' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    // @TODO: Get boss facing and bits position, call out adjust?
    {
      id: 'DiamondEx P2 Zig-Zag',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAF', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Zig-Zag',
        },
      },
    },
    // @TODO: Get boss facing and orb position, call out safe side?
    {
      id: 'DiamondEx P2 Zig-Zag Jump',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FB2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FB2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FB2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FB2', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge East/West',
        },
      },
    },
    // @TODO: Get boss facing and orb count, call out towards/away?
    {
      id: 'DiamondEx P2 North/South Jump',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FB5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FB5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FB5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FB5', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Towards/Away',
        },
      },
    },
    // @TODO: Get bit locations, call out north/south diagonal KB?
    {
      id: 'DiamondEx P2 Vertical Cleave',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FB7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FB7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FB7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FB7', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Diagonal Knockback',
        },
      },
    },
    {
      id: 'DiamondEx P2 Articulated Bits',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FC1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FC1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FC1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FC1', capture: false }),
      durationSeconds: 15,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Bits',
        },
      },
    },
    // @TODO: phase transition cleave headmarkers, Flood Ray
    // Phase 3
    {
      id: 'DiamondEx P3 Articulated Bits',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA9', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA9', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA9', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA9', capture: false }),
      durationSeconds: 20,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Bits',
        },
      },
    },
    {
      id: 'DiamondEx Diamond Shrapnel',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAC', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Puddles',
        },
      },
    },
    {
      id: 'DiamondEx Burst',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAC', capture: false }),
      delaySeconds: 15,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Towers',
        },
      },
    },
  ],
};
