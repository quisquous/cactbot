import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: use code from AMR to handle cases of "role stacks" when somebody is dead
// TODO: sc3 should say which bubble to take to the other side (for everyone)
// TODO: figure out directions for Lala for Radiance orbs
// TODO: map effects for Lala

/*
map effects
// initial edges after raidwide
[21:58:06.929] 257 101:8003908D:00020001:26:00:0000

*/

export interface Data extends RaidbossData {
  readonly triggerSetConfig: {
    stackOrder: 'meleeRolesPartners' | 'rolesPartners';
  };
  combatantData: PluginCombatantState[];
  ketuSpringCrystalCount: number;
  ketuCrystalAdd: NetMatches['AddedCombatant'][];
  ketuHydroBuffCount: number;
  ketuBuff?: 'bubble' | 'fetters';
  ketuBuffCollect: NetMatches['GainsEffect'][];
  lalaBossRotation?: 'clock' | 'counter';
  lalaBossTimes?: 3 | 5;
  lalaBossInitialSafe?: 'north' | 'east' | 'south' | 'west';
  lalaUnseen?: 'front' | 'left' | 'right' | 'back';
  lalaPlayerTimes?: 3 | 5;
  lalaPlayerRotation?: 'clock' | 'counter';
  lalaSubAlpha: NetMatches['GainsEffect'][];
  staticeBullet: NetMatches['Ability'][];
  staticeTriggerHappy?: number;
  staticeTrapshooting: ('stack' | 'spread')[];
  staticeDart: NetMatches['GainsEffect'][];
}

// Horizontal crystals have a heading of 0, vertical crystals are -pi/2.
const isHorizontalCrystal = (line: NetMatches['AddedCombatant']) => {
  const epsilon = 0.1;
  return Math.abs(parseFloat(line.heading)) < epsilon;
};

const triggerSet: TriggerSet<Data> = {
  id: 'AnotherAloaloIsland',
  zoneId: ZoneId.AnotherAloaloIsland,
  timelineFile: 'another_aloalo_island.txt',
  initData: () => {
    return {
      combatantData: [],
      ketuSpringCrystalCount: 0,
      ketuCrystalAdd: [],
      ketuHydroBuffCount: 0,
      ketuBuffCollect: [],
      lalaSubAlpha: [],
      staticeBullet: [],
      staticeTrapshooting: [],
      staticeDart: [],
    };
  },
  timelineTriggers: [
    {
      id: 'AAI Lala Radiance',
      regex: /^Radiance \d/,
      beforeSeconds: 4,
      alertText: (data, _matches, output) => {
        // TODO: could figure out directions here and say "Point left at NW Orb"
        const dir = data.lalaUnseen;
        if (dir === undefined)
          return output.orbGeneral!();
        return {
          front: output.orbDirFront!(),
          back: output.orbDirBack!(),
          left: output.orbDirLeft!(),
          right: output.orbDirRight!(),
        }[dir];
      },
      outputStrings: {
        orbDirFront: {
          en: 'Face Towards Orb',
        },
        orbDirBack: {
          en: 'Face Away from Orb',
        },
        orbDirLeft: {
          en: 'Point Left at Orb',
        },
        orbDirRight: {
          en: 'Point Right at Orb',
        },
        orbGeneral: {
          en: 'Point opening at Orb',
        },
      },
    },
  ],
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'AAI Kiwakin Lead Hook',
      type: 'StartsUsing',
      netRegex: { id: '8C6E', source: 'Aloalo Kiwakin' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankBusterOnYou: {
            en: '3x Tankbuster on YOU',
          },
          tankBusterOnPlayer: {
            en: '3x Tankbuster on ${player}',
          },
        };

        if (matches.target === data.me)
          return { alertText: output.tankBusterOnYou!() };
        const target = data.party.member(matches.target);
        return { infoText: output.tankBusterOnPlayer!({ player: target }) };
      },
    },
    {
      id: 'AAI Kiwakin Sharp Strike',
      type: 'StartsUsing',
      netRegex: { id: '8C63', source: 'Aloalo Kiwakin' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Kiwakin Tail Screw',
      type: 'StartsUsing',
      // This is a baited targeted circle.
      netRegex: { id: '8BB8', source: 'Aloalo Kiwakin', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'AAI Snipper Water III',
      type: 'StartsUsing',
      netRegex: { id: '8C64', source: 'Aloalo Snipper' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AAI Snipper Bubble Shower',
      type: 'StartsUsing',
      netRegex: { id: '8BB9', source: 'Aloalo Snipper', capture: false },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'AAI Snipper Crab Dribble',
      type: 'Ability',
      // Crab Dribble 8BBA has a fast cast, so trigger on Bubble Shower ability
      netRegex: { id: '8BB9', source: 'Aloalo Snipper', capture: false },
      suppressSeconds: 5,
      response: Responses.goFront('info'),
    },
    {
      id: 'AAI Ray Hydrocannon',
      type: 'StartsUsing',
      netRegex: { id: '8BBD', source: 'Aloalo Ray', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AAI Ray Expulsion',
      type: 'StartsUsing',
      netRegex: { id: '8BBF', source: 'Aloalo Ray', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AAI Ray Electric Whorl',
      type: 'StartsUsing',
      netRegex: { id: '8BBE', source: 'Aloalo Ray', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AAI Monk Hydroshot',
      type: 'StartsUsing',
      netRegex: { id: '8BBE', source: 'Aloalo Monk' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockbackOn(),
    },
    {
      id: 'AAI Monk Cross Attack',
      type: 'StartsUsing',
      netRegex: { id: '8BBB', source: 'Aloalo Monk' },
      response: Responses.tankBuster(),
    },
    // ---------------- Ketuduke ----------------
    {
      id: 'AAI Ketuduke Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '8AD4', source: 'Ketuduke', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AAI Ketuduke Spring Crystals',
      type: 'StartsUsing',
      netRegex: { id: '8AA8', source: 'Ketuduke', capture: false },
      run: (data) => {
        data.ketuSpringCrystalCount++;
        data.ketuCrystalAdd = [];
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystal Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607' },
      run: (data, matches) => data.ketuCrystalAdd.push(matches),
    },
    {
      id: 'AAI Ketuduke Foamy Fetters Bubble Weave',
      type: 'GainsEffect',
      // ECC = Foamy Fetters
      // E9F = Bubble Weave
      netRegex: { effectId: ['ECC', 'E9F'] },
      delaySeconds: (data, matches) => {
        data.ketuBuffCollect.push(matches);
        return data.ketuBuffCollect.length === 4 ? 0 : 0.5;
      },
      alertText: (data, _matches, output) => {
        if (data.ketuBuffCollect.length === 0)
          return;

        const myBuff = data.ketuBuffCollect.find((x) => x.target === data.me)?.effectId;
        if (myBuff === undefined)
          return;
        data.ketuBuff = myBuff === 'ECC' ? 'fetters' : 'bubble';

        const player = data.party.member(
          data.ketuBuffCollect.find((x) => {
            return x.target !== data.me && x.effectId === myBuff;
          })?.target,
        );
        if (data.ketuBuff === 'fetters')
          return output.fetters!({ player: player });
        return output.bubble!({ player: player });
      },
      run: (data) => data.ketuBuffCollect = [],
      outputStrings: {
        fetters: {
          en: 'Fetters (w/${player})',
        },
        bubble: {
          en: 'Bubble (w/${player})',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Counter',
      type: 'StartsUsing',
      // 8AB8 = Hydrobullet (spread)
      // 8AB4 = Hydrofall (stack)
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke', capture: false },
      run: (data) => data.ketuHydroBuffCount++,
    },
    {
      id: 'AAI Ketuduke Hydro Buff 1',
      comment: {
        en: `These directions assume that you always pick a square in the same
             quadrant as the crystal specified.
             For brevity, "next to" always means horizontal east/west of something.
             The number in parentheses is the limit cut wind you should be on.`,
      },
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data.ketuHydroBuffCount === 1 || data.ketuHydroBuffCount === 6,
      durationSeconds: 8,
      alertText: (data, matches, output) => {
        // If somebody died and missed a debuff, good luck.
        if (data.ketuBuff === undefined)
          return;

        // Bubble always does the same thing.
        if (data.ketuBuff === 'bubble')
          return output.bubble!();

        // Two layouts, one with each crystal in its own column ("split")
        // and one with two columns that have an H and a V in that same column ("columns").
        // Wind doesn't matter, as "1" will always be on the horizontal crystals.
        //
        // STACK FETTERS COLUMNS (kitty to horizontal)
        //     2                   2
        //   + - - - - +         + - - - - +
        //   | V     f | 1       |     H f | 1
        //   |     H b |    =>   |     V   |
        //   | H b     |         | V       |
        // 1 |   f V   |       1 | H f     |
        //   + - - - - +         + - - - - +
        //           2                   2
        //
        // STACK FETTERS SPLIT (on horizontal)
        //           2                   2
        //   + - - - - +         + - - - - +
        // 1 |     V   |       1 |   V     |
        //   | H b     |    =>   | f H     |
        //   |   V     |         |     V   |
        //   |     b H | 1       |     H f | 1
        //   + - - - - +         + - - - - +
        //     2                   2
        //
        // SPREAD FETTERS COLUMNS (adjacent to vertical)
        //     2                   2
        //   + - - - - +         + - - - - +
        //   | V f     | 1       |   f H b | 1
        //   |     H b |    =>   |     V   |
        //   | H b     |         | V       |
        // 1 |     V f |       1 | H b   f |
        //   + - - - - +         + - - - - +
        //           2                   2
        //
        // SPREAD FETTERS SPLIT (kitty to vertical)
        //     2                   2
        //   + - - - - +         + - - - - +
        //   |   V     | 1       |     V   | 1
        //   | f   b H |    =>   | f   H b |
        //   |     V   |         |   V     |
        // 1 | H b   f |       1 | b H   f |
        //   + - - - - +         + - - - - +
        //           2                   2

        const isSpread = matches.id === '8AB8';
        const horizontal = data.ketuCrystalAdd.filter((x) => isHorizontalCrystal(x));
        const vertical = data.ketuCrystalAdd.filter((x) => !isHorizontalCrystal(x));

        const [firstHorizontal] = horizontal;
        if (horizontal.length !== 2 || vertical.length !== 2 || firstHorizontal === undefined)
          return;
        const firstHorizX = parseFloat(firstHorizontal.x);
        // It's split if no vertical is in the same column as either horizontal.
        const isSplitLayout =
          vertical.find((line) => Math.abs(parseFloat(line.x) - firstHorizX) < 1) === undefined;

        if (isSpread)
          return isSplitLayout ? output.fettersSpreadSplit!() : output.fettersSpreadColumn!();
        return isSplitLayout ? output.fettersStackSplit!() : output.fettersStackColumn!();
      },
      infoText: (_data, matches, output) => {
        return matches.id === '8AB8' ? output.spread!() : output.stacks!();
      },
      outputStrings: {
        spread: Outputs.spread,
        stacks: {
          en: 'Stacks',
        },
        bubble: {
          en: 'Next to Horizontal (1)',
        },
        fettersSpreadSplit: {
          en: 'Diagonal of Vertical (2)',
        },
        fettersSpreadColumn: {
          en: 'Next to Vertical (2)',
        },
        fettersStackSplit: {
          en: 'On Horizontal (1)',
        },
        fettersStackColumn: {
          en: 'Diagonal of Horizontal (1)',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff 2',
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data.ketuHydroBuffCount === 2,
      alertText: (_data, matches, output) => {
        return matches.id === '8AB8' ? output.spread!() : output.stacks!();
      },
      outputStrings: {
        spread: {
          en: 'Spread => Stacks',
        },
        stacks: {
          en: 'Stacks => Spread',
        },
      },
    },
    {
      id: 'AAI Ketuduke Receding Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACC', source: 'Ketuduke', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'AAI Ketuduke Encroaching Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACE', source: 'Ketuduke', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'AAI Ketuduke Spring Crystals 2',
      type: 'AddedCombatant',
      // This calls absurdly early. <_<
      netRegex: { npcNameId: '12607', capture: false },
      condition: (data) => data.ketuSpringCrystalCount === 2 && data.ketuCrystalAdd.length === 4,
      alertText: (data, _matches, output) => {
        const horizontal = data.ketuCrystalAdd.filter((x) => isHorizontalCrystal(x));
        const vertical = data.ketuCrystalAdd.filter((x) => !isHorizontalCrystal(x));
        if (horizontal.length !== 2 || vertical.length !== 2)
          return;

        // Crystal positions are always -15, -5, 5, 15.

        // Check if any verticals are on the outer vertical edges.
        for (const line of vertical) {
          const y = parseFloat(line.y);
          if (y < -10 || y > 10)
            return output.eastWestSafe!();
        }

        // Check if any horizontals are on the outer horizontal edges.
        for (const line of horizontal) {
          const x = parseFloat(line.x);
          if (x < -10 || x > 10)
            return output.northSouthSafe!();
        }

        return output.cornersSafe!();
      },
      outputStrings: {
        northSouthSafe: {
          en: 'North/South',
        },
        eastWestSafe: {
          en: 'East/West',
        },
        cornersSafe: {
          en: 'Corners',
        },
      },
    },
    // ---------------- second trash ----------------
    {
      id: 'AAI Wood Golem Ancient Aero III',
      type: 'StartsUsing',
      netRegex: { id: '8C4C', source: 'Aloalo Wood Golem' },
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'AAI Wood Golem Tornado',
      type: 'StartsUsing',
      netRegex: { id: '8C4D', source: 'Aloalo Wood Golem' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tornadoOn: {
            en: 'Away from ${player}',
          },
          tornadoOnYou: {
            en: 'Tornado on YOU',
          },
        };

        if (data.me === matches.target)
          return { alertText: output.tornadoOnYou!() };
        return { infoText: output.tornadoOn!({ player: data.party.member(matches.target) }) };
      },
    },
    {
      id: 'AAI Wood Golem Tornado Bind',
      type: 'GainsEffect',
      netRegex: { effectId: 'EC0' },
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ja: 'エスナ: ${player}',
          cn: '解除死亡宣告: ${player}',
          ko: '${player} 에스나',
        },
      },
    },
    {
      id: 'AAI Wood Golem Ovation',
      type: 'StartsUsing',
      netRegex: { id: '8BC1', source: 'Aloalo Wood Golem', capture: false },
      response: Responses.getBehind('info'),
    },
    {
      id: 'AAI Islekeeper Gravity Force',
      type: 'StartsUsing',
      netRegex: { id: '8BC5', source: 'Aloalo Islekeeper' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AAI Islekeeper Isle Drop',
      type: 'StartsUsing',
      netRegex: { id: '8C6F', source: 'Aloalo Islekeeper', capture: false },
      response: Responses.getBehind('info'),
    },
    {
      id: 'AAI Islekeeper Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '8C4E', source: 'Aloalo Islekeeper', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Islekeeper Ancient Quaga Enrage',
      type: 'StartsUsing',
      netRegex: { id: '8C2F', source: 'Aloalo Islekeeper', capture: false },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Islekeeper!',
        },
      },
    },
    // ---------------- Lala ----------------
    {
      id: 'AAI Lala Inferno Theorem',
      type: 'StartsUsing',
      netRegex: { id: '88AE', source: 'Lala', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Lala Rotation Tracker',
      type: 'HeadMarker',
      netRegex: { id: ['01E4', '01E5'], target: 'Lala' },
      run: (data, matches) => data.lalaBossRotation = matches.id === '01E4' ? 'clock' : 'counter',
    },
    {
      id: 'AAI Lala Angular Addition Tracker',
      type: 'Ability',
      netRegex: { id: ['8889', '8D2E'], source: 'Lala' },
      run: (data, matches) => data.lalaBossTimes = matches.id === '8889' ? 3 : 5,
    },
    {
      id: 'AAI Lala Arcane Blight',
      type: 'StartsUsing',
      netRegex: { id: ['888B', '888C', '888D', '888E'], source: 'Lala' },
      alertText: (data, matches, output) => {
        const initialDir = {
          '888B': 2, // initial back safe
          '888C': 0, // initial front safe
          '888D': 1, // initial right safe
          '888E': 3, // initial left safe
        }[matches.id];
        if (initialDir === undefined)
          return;
        if (data.lalaBossTimes === undefined)
          return;
        if (data.lalaBossRotation === undefined)
          return;
        const rotationFactor = data.lalaBossRotation === 'clock' ? 1 : -1;
        const finalDir = (initialDir + rotationFactor * data.lalaBossTimes + 8) % 4;

        const diff = (finalDir - initialDir + 4) % 4;
        if (diff !== 1 && diff !== 3)
          return;
        const rotateStr = diff === 1 ? output.dirClock!() : output.dirCounter!();
        const dirStr = {
          0: output.front!(),
          1: output.right!(),
          2: output.back!(),
          3: output.left!(),
        }[finalDir];

        return output.text!({ rotate: rotateStr, dir: dirStr });
      },
      run: (data) => {
        delete data.lalaBossTimes;
        delete data.lalaBossRotation;
      },
      outputStrings: {
        text: {
          en: '${rotate} (${dir})',
        },
        front: {
          en: 'in front',
        },
        back: {
          en: 'get behind',
        },
        left: {
          en: 'on left flank',
        },
        right: {
          en: 'on right flank',
        },
        dirClock: {
          en: 'Rotate Left',
        },
        dirCounter: {
          en: 'Rotate Right',
        },
      },
    },
    {
      id: 'AAI Lala Analysis Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E8E', 'E8F', 'E90', 'E91'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const effectMap: { [effectId: string]: typeof data.lalaUnseen } = {
          'E8E': 'front',
          'E8F': 'back',
          'E90': 'right',
          'E91': 'left',
        } as const;
        data.lalaUnseen = effectMap[matches.effectId];
      },
    },
    {
      id: 'AAI Lala Times Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E89', 'ECE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const effectMap: { [effectId: string]: typeof data.lalaPlayerTimes } = {
          'E89': 3,
          'ECE': 5,
        } as const;
        data.lalaPlayerTimes = effectMap[matches.effectId];
      },
    },
    {
      id: 'AAI Lala Player Rotation Collect',
      type: 'HeadMarker',
      netRegex: { id: ['01ED', '01EE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const idMap: { [id: string]: typeof data.lalaPlayerRotation } = {
          '01ED': 'counter',
          '01EE': 'clock',
        } as const;
        data.lalaPlayerRotation = idMap[matches.id];
      },
    },
    {
      id: 'AAI Lala Targeted Light',
      type: 'StartsUsing',
      netRegex: { id: '8CDE', source: 'Lala', capture: false },
      alertText: (data, _matches, output) => {
        const initialUnseen = data.lalaUnseen;
        if (initialUnseen === undefined)
          return;

        const initialDir = {
          front: 0,
          right: 1,
          back: 2,
          left: 3,
        }[initialUnseen];

        const rotation = data.lalaPlayerRotation;
        if (rotation === undefined)
          return;
        const times = data.lalaPlayerTimes;
        if (times === undefined)
          return;

        // The safe spot rotates, so the player counter-rotates.
        const rotationFactor = rotation === 'clock' ? -1 : 1;
        const finalDir = (initialDir + rotationFactor * times + 8) % 4;

        return {
          0: output.front!(),
          1: output.right!(),
          2: output.back!(),
          3: output.left!(),
        }[finalDir];
      },
      run: (data) => {
        delete data.lalaUnseen;
        delete data.lalaPlayerTimes;
      },
      outputStrings: {
        front: {
          en: 'Face Towards Lala',
        },
        back: {
          en: 'Look Away from Lala',
        },
        left: {
          en: 'Left Flank towards Lala',
        },
        right: {
          en: 'Right Flank towards Lala',
        },
      },
    },
    {
      id: 'AAI Lala Strategic Strike',
      type: 'StartsUsing',
      netRegex: { id: '88AD', source: 'Lala' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Lala Planar Tactics',
      type: 'GainsEffect',
      // E8B = Surge Vector
      // E8C = Subtractive Suppressor Alpha
      netRegex: { effectId: ['E8C', 'E8B'] },
      condition: (data, matches) => {
        data.lalaSubAlpha.push(matches);
        return data.lalaSubAlpha.length === 6;
      },
      durationSeconds: 7,
      // Only run once, as Surge Vector is used again.
      suppressSeconds: 9999999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          one: {
            en: 'One',
          },
          closeTwo: {
            en: 'Close Two',
          },
          farTwo: {
            en: 'Far Two',
          },
          eitherTwo: {
            en: 'Either Two (w/${player})',
          },
          three: {
            en: 'Three',
          },
          farTwoOn: {
            en: '(far two on ${players})',
          },

          unknownNum: {
            en: '${num}',
          },
          num1: Outputs.num1,
          num2: Outputs.num2,
          num3: Outputs.num3,
          num4: Outputs.num4,
        };

        // Assumptions: "close two" and "three" stack+run together, while "far two" and "one"
        // run towards each other and meet for the stack. Stacks COULD be on both/neither twos,
        // which makes which two you are ambiguous.
        const stacks = data.lalaSubAlpha.filter((x) => x.effectId === 'E8B').map((x) => x.target);
        const nums = data.lalaSubAlpha.filter((x) => x.effectId === 'E8C');
        const myNumberStr = nums.find((x) => x.target === data.me)?.count;
        if (myNumberStr === undefined)
          return;
        const myNumber = parseInt(myNumberStr);
        if (myNumber < 1 || myNumber > 4)
          return;

        const defaultOutput = {
          alertText: output.unknownNum!({ num: output[`num${myNumber}`]!() }),
        } as const;

        if (stacks.length !== 2 || nums.length !== 4)
          return defaultOutput;

        const one = nums.find((x) => parseInt(x.count) === 1)?.target;
        if (one === undefined)
          return defaultOutput;
        const isOneStack = stacks.includes(one);
        const twos = nums.filter((x) => parseInt(x.count) === 2).map((x) => x.target);

        const farTwos: string[] = [];
        for (const thisTwo of twos) {
          // can this two stack with the one?
          const isThisTwoStack = stacks.includes(thisTwo);
          if (isThisTwoStack && !isOneStack || !isThisTwoStack && isOneStack)
            farTwos.push(thisTwo);
        }

        const [farTwo1, farTwo2] = farTwos;
        if (farTwos.length === 0 || farTwo1 === undefined)
          return defaultOutput;

        const isPlayerFarTwo = farTwos.includes(data.me);

        // Worst case adjust
        if (isPlayerFarTwo && farTwo2 !== undefined) {
          const otherPlayer = farTwo1 === data.me ? farTwo2 : farTwo1;
          return { alarmText: output.eitherTwo!({ player: data.party.member(otherPlayer) }) };
        }

        let playerRole: string;
        if (one === data.me) {
          playerRole = output.one!();
        } else if (twos.includes(data.me)) {
          playerRole = isPlayerFarTwo ? output.farTwo!() : output.closeTwo!();
        } else {
          playerRole = output.three!();
        }

        if (isPlayerFarTwo)
          return { alertText: playerRole };

        return {
          alertText: playerRole,
          infoText: output.farTwoOn!({ players: farTwos.map((x) => data.party.member(x)) }),
        };
      },
    },
    {
      id: 'AAI Lala Forward March',
      type: 'GainsEffect',
      // E83 = Forward March
      netRegex: { effectId: 'E83' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 8,
      durationSeconds: 4,
      alertText: (data, _matches, output) => {
        const rotation = data.lalaPlayerRotation;
        if (rotation === undefined)
          return;
        const times = data.lalaPlayerTimes;
        if (times === undefined)
          return;

        const rotationFactor = rotation === 'clock' ? 1 : -1;
        const finalDir = (rotationFactor * times + 8) % 4;
        if (finalDir === 1)
          return output.right!();
        if (finalDir === 3)
          return output.left!();
      },
      run: (data) => {
        delete data.lalaPlayerRotation;
        delete data.lalaPlayerTimes;
      },
      outputStrings: {
        // This isn't confusing at all.
        left: {
          en: 'Rotate Left (your right is forward)',
        },
        right: {
          en: 'Rotate Right (your left is forward)',
        },
      },
    },
    {
      id: 'AAI Lala Spatial Tactics',
      type: 'GainsEffect',
      // E8D = Subtractive Suppressor Beta
      netRegex: { effectId: 'E8D' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 999999,
      alertText: (_data, matches, output) => {
        const num = parseInt(matches.count);
        if (num < 1 || num > 4)
          return;
        return output[`num${num}`]!();
      },
      outputStrings: {
        num1: {
          en: 'One (avoid all)',
        },
        num2: {
          en: 'Two (stay middle)',
        },
        num3: {
          en: 'Three (adjacent to middle)',
        },
        num4: {
          en: 'Four',
        },
      },
    },
    // ---------------- Statice ----------------
    {
      id: 'AAI Statice Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '8949', source: 'Statice', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Statice Trick Reload',
      type: 'Ability',
      // 8925 = Locked and Loaded
      // 8926 = Misload
      netRegex: { id: ['8925', '8926'], source: 'Statice' },
      preRun: (data, matches) => data.staticeBullet.push(matches),
      alertText: (data, _matches, output) => {
        // Statice loads 8 bullets, two are duds.
        // The first and the last are always opposite, and one of them is a dud.
        // The first/ last bullets are for Trapshooting and the middle six are for Trigger Happy.
        const [bullet] = data.staticeBullet;
        if (data.staticeBullet.length !== 1 || bullet === undefined)
          return;
        const isStack = bullet.id === '8926';
        data.staticeTrapshooting = isStack ? ['stack', 'spread'] : ['spread', 'stack'];
        return isStack ? output.stackThenSpread!() : output.spreadThenStack!();
      },
      infoText: (data, _matches, output) => {
        const lastBullet = data.staticeBullet[data.staticeBullet.length - 1];
        if (data.staticeBullet.length < 2 || data.staticeBullet.length > 7)
          return;
        if (lastBullet?.id !== '8926')
          return;
        data.staticeTriggerHappy = data.staticeBullet.length - 1;
        return output.numSafeLater!({ num: output[`num${data.staticeTriggerHappy}`]!() });
      },
      run: (data) => {
        if (data.staticeBullet.length === 8)
          data.staticeBullet = [];
      },
      outputStrings: {
        stackThenSpread: Outputs.stackThenSpread,
        spreadThenStack: Outputs.spreadThenStack,
        numSafeLater: {
          en: '(${num} safe later)',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Trapshooting',
      type: 'StartsUsing',
      netRegex: { id: ['8D1A', '8959'], source: 'Statice', capture: false },
      alertText: (data, _matches, output) => {
        const mech = data.staticeTrapshooting.shift();
        if (mech === undefined)
          return;
        return output[mech]!();
      },
      outputStrings: {
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'AAI Statice Trigger Happy',
      type: 'StartsUsing',
      netRegex: { id: '894B', source: 'Statice', capture: false },
      alertText: (data, _matches, output) => {
        const num = data.staticeTriggerHappy;
        if (num === undefined)
          return;
        return output[`num${num}`]!();
      },
      run: (data) => delete data.staticeTriggerHappy,
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Bull\'s-eye',
      type: 'GainsEffect',
      netRegex: { effectId: 'E9E' },
      delaySeconds: (data, matches) => {
        data.staticeDart.push(matches);
        return data.staticeDart.length === 3 ? 0 : 0.5;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart on YOU',
          },
          noDartOnYou: {
            en: 'Flex',
          },
          flexCall: {
            en: '(${player} flex)',
          },
        };

        if (data.staticeDart.length === 0)
          return;

        const dartTargets = data.staticeDart.map((x) => x.target);

        if (!dartTargets.includes(data.me))
          return { alertText: output.noDartOnYou!() };

        const partyNames = data.party.partyNames;

        const flexers = partyNames.filter((x) => !dartTargets.includes(x));
        const [flex] = flexers;
        const flexPlayer = flexers.length === 1 ? data.party.member(flex) : undefined;

        return {
          alertText: output.dartOnYou!(),
          infoText: output.flexCall!({ player: flexPlayer }),
        };
      },
      run: (data) => data.staticeDart = [],
    },
    {
      id: 'AAI Statice Pop',
      type: 'StartsUsing',
      // TODO: this might need a slight delay
      netRegex: { id: '894E', source: 'Statice', capture: false },
      suppressSeconds: 20,
      response: Responses.knockback(),
    },
    {
      id: 'AAI Statice Face',
      type: 'GainsEffect',
      // DD2 = Forward March
      // DD3 = About Face
      // DD4 = Left Face
      // DD5 = Right Face
      netRegex: { effectId: ['DD2', 'DD3', 'DD4', 'DD5'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 7,
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        const mechName = data.staticeTrapshooting.shift();
        const mech = mechName === undefined ? output.unknown!() : output[mechName]!();
        return {
          'DD2': output.forward!({ mech: mech }),
          'DD3': output.backward!({ mech: mech }),
          'DD4': output.left!({ mech: mech }),
          'DD5': output.right!({ mech: mech }),
        }[matches.effectId];
      },
      outputStrings: {
        forward: {
          en: 'Forward March => ${mech}',
        },
        backward: {
          en: 'Backward March => ${mech}',
        },
        left: {
          en: 'Left March => ${mech}',
        },
        right: {
          en: 'Right March => ${mech}',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
        unknown: Outputs.unknown,
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'en',
      replaceText: {
        'Hydrobullet/Hydrofall': 'Hydrobullet/fall',
        'Hydrofall/Hydrobullet': 'Hydrofall/bullet',
        'Receding Twintides/Encroaching Twintides': 'Receding/Encroaching Twintides',
        'Far Tide/Near Tide': 'Far/Near Tide',
      },
    },
  ],
};

export default triggerSet;
