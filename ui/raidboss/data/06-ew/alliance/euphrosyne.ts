import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Nophica Blueblossoms/Giltblossoms; they get 018E/018F/0190/0191/0192/0193 markers, but how to know colors?
// TODO: handling Nymeia & Althyk Time and Tide variations if Nymeia dies and Time and Tide doesn't happen.
// TODO: Nymeia & Althyk Hydrostasis have inconsistent positions? should this be getCombatants??
// TODO: handle proper Nymeia Spinner's Wheel speedup, via 00DF Tether to Altyhk
// TODO: Halone Lochos positions
// TODO: Menphina could use map effects for Love's Light + Full Bright 4x moon locations

// TODO: Menphina Midnight Frost + Waxing Claw + Playful Orbit
// 7BCB Midnight Frost = front cleave (7BCD damage) [first phase only]
// 7BCC Midnight Frost = back cleave (7BCE damage) [first phase only]
// 7BCF Midnight Frost = ??? (7BD1 damage)
// 7BD0 Midnight Frost = ??? (7BD2 damage)
// 7BD7 Midnight Frost = front cleave (7BDD damage) [dog attached, facing southeast]
// 7BD8 Midnight Frost = front cleave (7BDD damage) [dog attached, facing south]
// 7BD9 Midnight Frost = ??? (7BDE damage)
// 7BDA Midnight Frost = ??? (7BDE damage)
// 7BE4 Midnight Frost = ??? (7BDA damage)
// 7BE5 Midnight Frost = ??? (7BDA damage)
// 7BE6 Midnight Frost = back cleave (7BDB damage) [dog unattached, facing north]
// 7BE7 Midnight Frost = back cleave (7BDB damage) [dog unattached, facing north]
// 7F0A Midnight Frost = ??? (7BDA damage)
// 7F0B Midnight Frost = ??? (7BDA damage)
// 7F0C Midnight Frost = ??? (7BDB damage)
// 7F0D Midnight Frost = ??? (7BDB damage)
// 7BE0 Waxing Claw = right claw [both attached and unattached]
// 7BE1 Waxing Claw = left claw [both attached and unattached]
// 7BE2 Playful Orbit = jump NE
// 7BE3 Playful Orbit = jump NW

export type NophicaMarch = 'front' | 'back' | 'left' | 'right';
export type HaloneTetra = 'out' | 'in' | 'left' | 'right' | 'unknown';

export interface Data extends RaidbossData {
  nophicaMarch?: NophicaMarch;
  nophicaHeavensEarthTargets: string[];
  nymeiaHydrostasis: NetMatches['StartsUsing'][];
  haloneTetrapagos: HaloneTetra[];
  haloneSpearsThreeTargets: string[];
  haloneIceDartTargets: string[];
  menphinaLunarKissTargets: string[];
}

const tetraMap: { [id: string]: HaloneTetra } = {
  '7D46': 'out',
  '7D47': 'in',
  '7D48': 'left',
  '7D49': 'right',
} as const;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Euphrosyne,
  timelineFile: 'euphrosyne.txt',
  initData: () => {
    return {
      nophicaHeavensEarthTargets: [],
      nymeiaHydrostasis: [],
      haloneTetrapagos: [],
      haloneSpearsThreeTargets: [],
      haloneIceDartTargets: [],
      menphinaLunarKissTargets: [],
    };
  },
  triggers: [
    {
      id: 'Euphrosyne Nophica Abundance',
      type: 'StartsUsing',
      netRegex: { id: '7C24', source: 'Nophica', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Nophica The Giving Land Spring Flowers',
      type: 'StartsUsing',
      netRegex: { id: '801A', source: 'Nophica', capture: false },
      alertText: (data, _matches, output) => {
        if (data.nophicaMarch === undefined)
          return output.out!();
        return {
          'front': output.outWithForwards!(),
          'back': output.outWithBackwards!(),
          'left': output.outWithLeft!(),
          'right': output.outWithRight!(),
        }[data.nophicaMarch];
      },
      outputStrings: {
        out: Outputs.out,
        outWithForwards: {
          en: 'Forwards March Out',
        },
        outWithBackwards: {
          en: 'Backwards March Out',
        },
        outWithLeft: {
          en: 'Left March Out',
        },
        outWithRight: {
          en: 'Right March Out',
        },
      },
    },
    {
      id: 'Euphrosyne Nophica The Giving Land Summer Shade',
      type: 'StartsUsing',
      netRegex: { id: '8018', source: 'Nophica', capture: false },
      alertText: (data, _matches, output) => {
        if (data.nophicaMarch === undefined)
          return output.in!();
        return {
          'front': output.inWithForwards!(),
          'back': output.inWithBackwards!(),
          'left': output.inWithLeft!(),
          'right': output.inWithRight!(),
        }[data.nophicaMarch];
      },
      outputStrings: {
        in: Outputs.in,
        inWithForwards: {
          en: 'Forwards March In',
        },
        inWithBackwards: {
          en: 'Backwards March In',
        },
        inWithLeft: {
          en: 'Left March In',
        },
        inWithRight: {
          en: 'Right March In',
        },
      },
    },
    {
      id: 'Euphrosyne Nophica Matron\'s Harvest',
      type: 'StartsUsing',
      netRegex: { id: '7C1D', source: 'Nophica', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Nophica Floral Haze Debuffs',
      type: 'GainsEffect',
      netRegex: { effectId: 'DD[2-5]' },
      condition: Conditions.targetIsYou(),
      // Initial Floral Haze is 16s.  The next Floral Haze is 18 or 35s.
      // Add a delay so that this only applies when it is "close" so that
      // it will only add to the Giving Land callout it needs to.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 10,
      run: (data, matches) => {
        const faceMap: { [effectId: string]: NophicaMarch } = {
          DD2: 'front',
          DD3: 'back',
          DD4: 'left',
          DD5: 'right',
        } as const;
        data.nophicaMarch = faceMap[matches.effectId];
      },
    },
    {
      id: 'Euphrosyne Nophica Floral Haze Cleanup',
      type: 'LosesEffect',
      netRegex: { effectId: 'DD[2-5]', capture: false },
      suppressSeconds: 5,
      run: (data) => delete data.nophicaMarch,
    },
    {
      id: 'Euphrosyne Nophica Landwaker',
      type: 'StartsUsing',
      netRegex: { id: '7C19', source: 'Nophica', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Nophica Furrow',
      type: 'StartsUsing',
      netRegex: { id: '7C16', source: 'Nophica' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Euphrosyne Nophica Heavens\' Earth',
      type: 'StartsUsing',
      netRegex: { id: '7C23', source: 'Nophica' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankBusterOnYou!();
      },
      run: (data, matches) => data.nophicaHeavensEarthTargets.push(matches.target),
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
      },
    },
    {
      id: 'Euphrosyne Nophica Heavens\' Earth Not You',
      type: 'StartsUsing',
      netRegex: { id: '7C23', source: 'Nophica', capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.nophicaHeavensEarthTargets.includes(data.me))
          return;
        return output.tankBusters!();
      },
      run: (data) => data.nophicaHeavensEarthTargets = [],
      outputStrings: {
        tankBusters: Outputs.tankBusters,
      },
    },
    {
      id: 'Euphrosyne Ktenos Roaring Rumble',
      type: 'StartsUsing',
      netRegex: { id: '7D3B', source: 'Euphrosynos Ktenos', capture: false },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Ktenos Sweeping Gouge',
      type: 'StartsUsing',
      netRegex: { id: '7D39', source: 'Euphrosynos Ktenos' },
      // This is trash and so three tankbuster callouts might be noisy here?
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Euphrosyne Behemoth Localized Maelstrom',
      type: 'StartsUsing',
      netRegex: { id: '7D37', source: 'Euphrosynos Behemoth' },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'Euphrosyne Behemoth Trounce',
      type: 'StartsUsing',
      netRegex: { id: '7D38', source: 'Euphrosynos Behemoth', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Euphrosyne Nymeia Spinner\'s Wheel Initial',
      type: 'GainsEffect',
      netRegex: { effectId: ['D39', 'D3A', 'D3B', 'D3C'] },
      condition: Conditions.targetIsYou(),
      // Reapplied with Time and Tide.
      suppressSeconds: 5,
      sound: '',
      infoText: (_data, matches, output) => {
        return {
          // Arcane Attraction
          'D39': output.lookAway!(),
          // Attraction Reversed
          'D3A': output.lookTowards!(),
          // Arcane Fever
          'D3B': output.pyretic!(),
          // Fever Reversed
          'D3C': output.freeze!(),
        }[matches.effectId];
      },
      outputStrings: {
        lookAway: {
          en: '(look away soon)',
        },
        lookTowards: {
          en: '(look towards soon)',
        },
        pyretic: {
          en: '(pyretic soon)',
        },
        freeze: {
          en: '(freeze soon)',
        },
      },
    },
    {
      id: 'Euphrosyne Nymeia Spinner\'s Wheel',
      type: 'GainsEffect',
      netRegex: { effectId: ['D39', 'D3A', 'D3B', 'D3C'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => {
        // 10 seconds = normal, 20 seconds = sped up (for ~13.4 s)
        // TODO: the speed up only happens with an 00DF tether, so collect that and check.
        const warningTime = 2;
        const initialDuration = parseFloat(matches.duration);
        const realDuration = initialDuration < 15 ? initialDuration : 13.4;
        return realDuration - warningTime;
      },
      // Reapplied with Time and Tide.
      suppressSeconds: 5,
      alertText: (_data, matches, output) => {
        return {
          // Arcane Attraction
          'D39': output.lookAway!(),
          // Attraction Reversed
          'D3A': output.lookTowards!(),
          // Arcane Fever
          'D3B': output.stopEverything!(),
          // Fever Reversed
          'D3C': output.keepMoving!(),
        }[matches.effectId];
      },
      outputStrings: {
        lookAway: {
          en: 'Look Away from Nymeia',
        },
        lookTowards: {
          en: 'Look Towards Nymeia',
        },
        stopEverything: Outputs.stopEverything,
        keepMoving: Outputs.moveAround,
      },
    },
    {
      id: 'Euphrosyne Althyk Axioma',
      type: 'StartsUsing',
      netRegex: { id: '7A47', source: 'Althyk', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Nymeia Hydroptosis',
      type: 'StartsUsing',
      // Technically there's a 7A45 cast on everybody, and 7A44 is self-casted.
      netRegex: { id: '7A44', source: 'Nymeia', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread (avoid purple)',
        },
      },
    },
    {
      id: 'Euphrosyne Althyk Inexorable Pull',
      type: 'StartsUsing',
      netRegex: { id: '7A42', source: 'Althyk', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand in purple fissure',
        },
      },
    },
    {
      id: 'Euphrosyne Althyk Petrai',
      type: 'StartsUsing',
      // With 7A49 damage
      netRegex: { id: '7A48', source: 'Althyk' },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'Euphrosyne Nymeia Hydrostasis Collect',
      type: 'StartsUsing',
      netRegex: { id: ['7A3B', '7A3C', '7A3D', '7A3E'], source: 'Nymeia' },
      run: (data, matches) => data.nymeiaHydrostasis.push(matches),
    },
    {
      id: 'Euphrosyne Nymeia Hydrostasis',
      type: 'StartsUsing',
      // TODO: this only appears to have valid positions the first time around (sometimes).
      // TODO: try using getCombatantants.
      netRegex: { id: ['7A3B', '7A3C', '7A3D', '7A3E'], source: 'Nymeia', capture: false },
      // First time around is BCD all simultaneous, with 16,19,22s cast times.
      // Other times are BC instantly and then E ~11s later with a 2s cast time.
      delaySeconds: 0.5,
      durationSeconds: 18,
      suppressSeconds: 20,
      infoText: (data, _matches, output) => {
        type HydrostasisDir = 'N' | 'SW' | 'SE';

        const lines = data.nymeiaHydrostasis.sort((a, b) => a.id.localeCompare(b.id));
        const dirs: HydrostasisDir[] = lines.map((line) => {
          const centerX = 50;
          const centerY = -741;

          const x = parseFloat(line.x);
          const y = parseFloat(line.y);
          if (y < centerY)
            return 'N';
          return x < centerX ? 'SW' : 'SE';
        });

        const [first, second, third] = dirs;
        if (first === undefined || second === undefined)
          return;

        if (third === undefined) {
          const dirSet = new Set<HydrostasisDir>(['N', 'SW', 'SE']);
          dirSet.delete(first);
          dirSet.delete(second);
          if (dirSet.size !== 1)
            return;
          for (const dir of dirSet.keys())
            dirs.unshift(dir);
        }

        const [dir1, dir2, dir3] = dirs.map((x) => {
          return {
            N: output.dirN!(),
            SW: output.dirSW!(),
            SE: output.dirSE!(),
          }[x] ?? output.unknown!();
        });
        return output.knockback!({ dir1: dir1, dir2: dir2, dir3: dir3 });
      },
      run: (data) => data.nymeiaHydrostasis = [],
      outputStrings: {
        knockback: {
          en: 'Knockback ${dir1} => ${dir2} => ${dir3}',
        },
        dirSW: Outputs.dirSW,
        dirSE: Outputs.dirSE,
        dirN: Outputs.dirN,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'Euphrosyne Colossus Rapid Sever',
      type: 'StartsUsing',
      netRegex: { id: '7D3C', source: 'Euphrosynos Ktenos' },
      // This is trash and so three tankbuster callouts might be noisy here?
      condition: Conditions.targetIsYou(),
      // These three also tend to cast at the same time, so could be on one person.
      suppressSeconds: 5,
      response: Responses.tankBuster(),
    },
    {
      id: 'Euphrosyne Halone Rain of Spears',
      type: 'StartsUsing',
      netRegex: { id: '7D79', source: 'Halone', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Halone Tetrapagos Summary',
      type: 'StartsUsing',
      netRegex: { id: ['7D46', '7D47', '7D48', '7D49'], source: 'Halone' },
      preRun: (data, matches) => {
        const tetra: HaloneTetra | undefined = tetraMap[matches.id];
        data.haloneTetrapagos.push(tetra ?? 'unknown');
      },
      durationSeconds: 7.5,
      sound: '',
      alertText: (data, _matches, output) => {
        if (data.haloneTetrapagos.length !== 4)
          return;

        const [dir1, dir2, dir3, dir4] = data.haloneTetrapagos.map((x) =>
          output[x ?? 'unknown']!()
        );
        return output.text!({ dir1: dir1, dir2: dir2, dir3: dir3, dir4: dir4 });
      },
      outputStrings: {
        text: {
          en: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
        },
        out: Outputs.out,
        in: Outputs.in,
        left: Outputs.left,
        right: Outputs.right,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'Euphrosyne Halone Tetrapagos Initial',
      type: 'StartsUsing',
      netRegex: { id: ['7D46', '7D47', '7D48', '7D49'], source: 'Halone' },
      durationSeconds: 7,
      suppressSeconds: 20,
      infoText: (_data, matches, output) => output[tetraMap[matches.id] ?? 'unknown']!(),
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
        left: Outputs.left,
        right: Outputs.right,
        unknown: Outputs.unknown,
      },
    },

    {
      id: 'Euphrosyne Halone Doom Spear',
      type: 'StartsUsing',
      netRegex: { id: '80AD', source: 'Halone', capture: false },
      infoText: (_data, _matches, output) => output.getTowers!(),
      outputStrings: {
        getTowers: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Euphrosyne Halone Spears Three',
      type: 'StartsUsing',
      netRegex: { id: '7D78', source: 'Halone' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankBusterOnYou!();
      },
      run: (data, matches) => data.haloneSpearsThreeTargets.push(matches.target),
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
      },
    },
    {
      id: 'Euphrosyne Halone Spears Three Not You',
      type: 'StartsUsing',
      netRegex: { id: '7D78', source: 'Halone', capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.haloneSpearsThreeTargets.includes(data.me))
          return;
        return output.tankBusters!();
      },
      run: (data) => data.haloneSpearsThreeTargets = [],
      outputStrings: {
        tankBusters: Outputs.tankBusters,
      },
    },
    {
      id: 'Euphrosyne Halone Thousandfold Thruust',
      type: 'HeadMarker',
      netRegex: { id: ['0182', '0183', '0184', '0185'], target: 'Halone' },
      alertText: (_data, matches, output) => {
        return {
          '0182': output.back!(),
          '0183': output.front!(),
          '0184': output.left!(),
          '0185': output.right!(),
        }[matches.id];
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Euphrosyne Halone Wrath of Halone',
      type: 'StartsUsing',
      netRegex: { id: '7D63', source: 'Halone', capture: false },
      alertText: (_data, _matches, output) => output.out!(),
      outputStrings: {
        out: {
          en: 'Get Out (avoid ring)',
        },
      },
    },
    {
      id: 'Euphrosyne Halone Ice Dart',
      type: 'StartsUsing',
      netRegex: { id: '7D66', source: 'Halone' },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.spread!();
      },
      run: (data, matches) => data.haloneIceDartTargets.push(matches.target),
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'Euphrosyne Halone Ice Dart Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '7D66', source: 'Halone', capture: false },
      delaySeconds: 10,
      suppressSeconds: 5,
      run: (data) => data.haloneIceDartTargets = [],
    },
    {
      id: 'Euphrosyne Halone Ice Rondel',
      type: 'StartsUsing',
      netRegex: { id: '7D67', source: 'Halone' },
      condition: (data) => !data.haloneIceDartTargets.includes(data.me),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Euphrosyne Menphina Blue Moon',
      type: 'StartsUsing',
      netRegex: { id: '7BFA', source: 'Menphina', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Euphrosyne Menphina Love\'s Light Single Moon',
      type: 'Ability',
      netRegex: { id: ['7BB8', '7BC2'], source: 'Menphina', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sides of Moon',
        },
      },
    },
    {
      id: 'Euphrosyne Menphina Love\'s Light Quadruple Moon',
      type: 'Ability',
      netRegex: { id: ['7BB9', '7BC3'], source: 'Menphina', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to dark moon',
        },
      },
    },
    {
      id: 'Euphrosyne Menphina Midnight Frost Front Initial',
      type: 'StartsUsing',
      netRegex: { id: '7BCC', source: 'Menphina', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'Euphrosyne Menphina Midnight Frost Back Initial',
      type: 'StartsUsing',
      netRegex: { id: '7BCB', source: 'Menphina', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Euphrosyne Menphina Lunar Kiss',
      type: 'HeadMarker',
      netRegex: { id: '019C' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankLaserOnYou!();
      },
      run: (data, matches) => data.menphinaLunarKissTargets.push(matches.target),
      outputStrings: {
        tankLaserOnYou: {
          en: 'Tank Laser on YOU',
          de: 'Tank Laser auf DIR',
          fr: 'Tank laser sur VOUS',
          ja: '自分にタンクレーザー',
          cn: '坦克激光点名',
          ko: '탱 레이저 대상자',
        },
      },
    },
    {
      id: 'Euphrosyne Menphina Lunar Kiss Not You',
      type: 'HeadMarker',
      netRegex: { id: '019C', capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.menphinaLunarKissTargets.includes(data.me))
          return;
        return output.avoidTankLaser!();
      },
      run: (data) => data.menphinaLunarKissTargets = [],
      outputStrings: {
        avoidTankLaser: {
          en: 'Avoid Tank Laser',
          de: 'Weiche dem Tanklaser aus',
          fr: 'Évitez le tank laser',
          cn: '躲避坦克激光',
          ko: '탱 레이저 피하기',
        },
      },
    },
    {
      id: 'Euphrosyne Menphina Winter Halo',
      type: 'StartsUsing',
      netRegex: {
        id: ['7BC6', '7BE8', '7BE9', '7F0E', '7F0F', '7BDB', '7BDC'],
        source: 'Menphina',
        capture: false,
      },
      response: Responses.getIn(),
    },
    {
      id: 'Euphrosyne Menphina Keen Moonbeam',
      type: 'StartsUsing',
      netRegex: { id: '7BF4', source: 'Menphina' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Euphrosyne Menphina Moonset Rays',
      type: 'StartsUsing',
      netRegex: { id: '80FA', source: 'Menphina' },
      response: Responses.stackMarkerOn(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Blueblossoms/Giltblossoms': 'Blossoms',
      },
    },
  ],
};

export default triggerSet;
