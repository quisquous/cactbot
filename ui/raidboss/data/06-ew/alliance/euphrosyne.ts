import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Nophica Blueblossoms/Giltblossoms; they get 018E/018F/0190/0191/0192/0193 markers, but how to know colors?
// TODO: handling Nymeia & Althyk Time and Tide variations if Nymeia dies and Time and Tide doesn't happen.
// TODO: Halone Thousandfold Thrust / Tetrapagos Thrust directions (including rotation)
// TODO: Halone Lochos positions
// TODO: Menphina could use map effects for Love's Light + Full Bright 4x moons
// TODO: Menphina Playful Orbit 7BE2 vs 7BE3 (is this west vs east?)
// TODO: Menphina Waxing Claw 7BE0 vs 7BE1 (surely left vs right)
// TODO: Menphina Midnight Frost (why are there 24 ability ids)

export type NophicaFacing = 'front' | 'back' | 'left' | 'right';
export type HaloneTetra = 'out' | 'in' | 'left' | 'right' | 'unknown';

export interface Data extends RaidbossData {
  nophicaFacing?: NophicaFacing;
  nymeiaHydrostasis: NetMatches['StartsUsing'][];
  haloneTetrapagos: HaloneTetra[];
  haloneSpearsThreeTargets: string[];
  haloneIceDartTargets: string[];
  menphinaLunarKissTargets: string[];
}

const tetraMap: { [id: string]: HaloneTetra } = {
  '7D46': 'in',
  '7D47': 'out',
  '7D48': 'left',
  '7D49': 'right',
} as const;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Euphrosyne,
  timelineFile: 'euphrosyne.txt',
  initData: () => {
    return {
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
        if (data.nophicaFacing === undefined)
          return output.out!();
        return {
          'front': output.outWithForwards!(),
          'back': output.outWithBackwards!(),
          'left': output.outWithLeft!(),
          'right': output.outWithRight!(),
        }[data.nophicaFacing];
      },
      run: (data) => delete data.nophicaFacing,
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
        if (data.nophicaFacing === undefined)
          return output.in!();
        return {
          'front': output.inWithForwards!(),
          'back': output.inWithBackwards!(),
          'left': output.inWithLeft!(),
          'right': output.inWithRight!(),
        }[data.nophicaFacing];
      },
      run: (data) => delete data.nophicaFacing,
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
      netRegex: { effectId: 'DD[2-5]', source: 'Nophica' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const faceMap: { [effectId: string]: NophicaFacing } = {
          DD2: 'front',
          DD3: 'back',
          DD4: 'left',
          DD5: 'right',
        } as const;
        data.nophicaFacing = faceMap[matches.effectId];
      },
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
      netRegex: { id: '7D36', source: 'Euphrosynos Behemoth', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Euphrosyne Nymeia Spinner\'s Wheel',
      type: 'GainsEffect',
      netRegex: { effectId: ['D3B', 'D3C'] },
      condition: Conditions.targetIsYou(),
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
      id: 'Euphrosyne Nymeia Arcane Fever',
      type: 'GainsEffect',
      netRegex: { effectId: 'D3B' },
      delaySeconds: (_data, matches) => {
        // 10 seconds = normal, 20 seconds = sped up (for ~13.4 s)
        const warningTime = 2;
        const initialDuration = parseFloat(matches.duration);
        const realDuration = initialDuration < 15 ? initialDuration : 13.4;
        return realDuration - warningTime;
      },
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
      durationSeconds: 10,
      sound: '',
      infoText: (data, _matches, output) => {
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
      alertText: (_data, matches, output) => output[tetraMap[matches.id] ?? 'unknown']!(),
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
        left: Outputs.left,
        right: Outputs.right,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'Euphrosyne Halone Tetrapagos Followup',
      type: 'StartsUsing',
      // self-targeted abilities
      // 7D4B = circle
      // 7D4E = donut
      // 7D50 = right cleave
      // 7D51 = left cleave
      netRegex: { id: ['7D4B', '7D4E', '7D50', '7D51'], source: 'Halone', capture: false },
      durationSeconds: 1.5,
      alertText: (data, _matches, output) => {
        if (data.haloneTetrapagos.length === 4)
          data.haloneTetrapagos.shift();
        const dir = data.haloneTetrapagos.shift();
        if (dir === undefined)
          return;
        return output[dir]!();
      },
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
        left: Outputs.left,
        right: Outputs.right,
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
      id: 'Euphrosyne Menphina Full Bright',
      type: 'StartsUsing',
      netRegex: { id: '7BBB', source: 'Menphina', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sides of Moon',
        },
      },
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
      netRegex: { id: ['7BC6', '7BE8', '7BE9', '7F0E', '7F0F', '7BDB'], source: 'Menphina', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Euphrosyne Menphina Keen Moonbeam',
      type: 'StartsUsing',
      netRegex: { id: '7BF4', source: 'Halone' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Euphrosyne Menphina Moonset Rays',
      type: 'StartsUsing',
      netRegex: { id: '7BFA', source: 'Nophica' },
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
