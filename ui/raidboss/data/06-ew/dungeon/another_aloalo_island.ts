import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: add callout for Monk Hydroshot target
// TODO: sc3 should say which bubble to take to the other side (for everyone)
// TODO: figure out directions for Lala for Radiance orbs
// TODO: map effects for Lala
// TODO: Lala Planar Tactics could add config strats and tell you who to stack with
// TODO: Statice colors could add config strats for role-based colors + melee flex

export interface Data extends RaidbossData {
  combatantData: PluginCombatantState[];
  ketuSpringCrystalCount: number;
  ketuCrystalAdd: NetMatches['AddedCombatant'][];
  ketuHydroBuffCount: number;
  ketuHydroBuffIsSpreadFirst?: boolean;
  ketuHydroBuffIsRoleStacks?: boolean;
  ketuBuff?: 'bubble' | 'fetters';
  ketuBuffPartner?: string;
  ketuBuffCollect: NetMatches['GainsEffect'][];
  ketuStackTargets: string[];
  ketuTwintidesNext?: 'out' | 'in';
  lalaBossRotation?: 'clock' | 'counter';
  lalaBossTimes?: 3 | 5;
  lalaBossInitialSafe?: 'north' | 'east' | 'south' | 'west';
  lalaUnseen?: 'front' | 'left' | 'right' | 'back';
  lalaPlayerTimes?: 3 | 5;
  lalaPlayerRotation?: 'clock' | 'counter';
  lalaSubAlpha: NetMatches['GainsEffect'][];
  staticeBullet: NetMatches['Ability'][];
  staticeTriggerHappy?: number;
  staticePopTriggerHappyNum?: number;
  staticeTrapshooting: ('stack' | 'spread' | undefined)[];
  staticeDart: NetMatches['GainsEffect'][];
  staticeBombRotateCount: number;
  staticeBomb: NetMatches['AddedCombatant'][];
  staticeBombTether: NetMatches['SpawnNpcExtra'][];
  staticeSafeBombIds: string[];
  staticePresentBoxCount: number;
  staticePresentBox1StackSpot?: number;
  staticePresentBox1TopOfTriangleDir?: number;
  staticeMissileCollect: NetMatches['AddedCombatant'][];
  staticeMissileIdToDir: { [id: string]: number };
  staticeMissileTether: NetMatches['Tether'][];
  staticeClawTether: NetMatches['Tether'][];
  staticeIsPinwheelingDartboard?: boolean;
  staticeHomingColor?: 'blue' | 'yellow' | 'red';
  staticeDartboardTether: NetMatches['HeadMarker'][];
}

// Horizontal crystals have a heading of 0, vertical crystals are -pi/2.
const isHorizontalCrystal = (line: NetMatches['AddedCombatant']) => {
  const epsilon = 0.1;
  return Math.abs(parseFloat(line.heading)) < epsilon;
};

const headmarkerIds = {
  tethers: '0061',
  enumeration: '015B',
} as const;

const xyTo5DirBombNum = (x: number, y: number): number => {
  // Six bombs are in a pentagram with one in the middle.
  // N = 0, NE = 1, SE = 2, SW = 3, NW = 4, Center = 5
  const centerX = -200;
  const centerY = 0;
  x = x - centerX;
  y = y - centerY;
  if (Math.abs(x) < 1 && Math.abs(y) < 1)
    return 5;
  // Find the closest spoke of the pentagram.
  return Math.round(2.5 - 2.5 * Math.atan2(x, y) / Math.PI) % 5;
};

// TODO: this maybe should be a method on party?
const isStandardLightParty = (data: Data): boolean => {
  const supports = [...data.party.healerNames, ...data.party.tankNames];
  const dps = data.party.dpsNames;
  return supports.length === 2 && dps.length === 2;
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
      ketuStackTargets: [],
      lalaSubAlpha: [],
      staticeBullet: [],
      staticeTrapshooting: [],
      staticeDart: [],
      staticeBombRotateCount: 0,
      staticeBomb: [],
      staticeBombTether: [],
      staticeSafeBombIds: [],
      staticePresentBoxCount: 0,
      staticeMissileCollect: [],
      staticeMissileIdToDir: {},
      staticeMissileTether: [],
      staticeClawTether: [],
      staticeDartboardTether: [],
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
          de: 'Den Orb anschauen',
        },
        orbDirBack: {
          en: 'Face Away from Orb',
          de: 'Weg vom Orb schauen',
        },
        orbDirLeft: {
          en: 'Point Left at Orb',
          de: 'Zeige links auf den Orb',
        },
        orbDirRight: {
          en: 'Point Right at Orb',
          de: 'Zeige Rechts auf den Orb',
        },
        orbGeneral: {
          en: 'Point opening at Orb',
          de: 'Zeige die Öffnung auf den Orb',
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
            de: '3x Tankbuster auf DIR',
          },
          tankBusterOnPlayer: {
            en: '3x Tankbuster on ${player}',
            de: '3x Tankbuster auf ${player}',
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
      netRegex: { id: '8C65', source: 'Aloalo Monk' },
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
        // Note: cannot clear `data.ketuCrystalAdd` here as there has been at least one case
        // where AddCombatant (coming from memory, so racy) is partially before this cast.
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystals Saturate Cleanup',
      type: 'StartsUsing',
      netRegex: { id: ['8AAB', '8AAC'], capture: false },
      run: (data) => data.ketuCrystalAdd = [],
    },
    {
      id: 'AAI Ketuduke Spring Crystal Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607' },
      run: (data, matches) => data.ketuCrystalAdd.push(matches),
    },
    {
      id: 'AAI Ketuduke Bubble Net',
      type: 'StartsUsing',
      netRegex: { id: ['8AC5', '8AAD'], source: 'Ketuduke', capture: false },
      response: Responses.aoe(),
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
        data.ketuBuffPartner = data.ketuBuffCollect.find((x) => {
          return x.target !== data.me && x.effectId === myBuff;
        })?.target;
        const player = data.party.member(data.ketuBuffPartner);

        // To avoid too many calls, we'll call this out later for the Fluke Gale
        // versions of this.
        if (data.ketuSpringCrystalCount === 1 || data.ketuSpringCrystalCount === 4)
          return;

        if (data.ketuBuff === 'fetters')
          return output.fetters!({ player: player });
        return output.bubble!({ player: player });
      },
      run: (data) => data.ketuBuffCollect = [],
      outputStrings: {
        fetters: {
          en: 'Fetters (w/${player})',
          de: 'Fesseln (mit ${player})',
        },
        bubble: {
          en: 'Bubble (w/${player})',
          de: 'Blase (mit ${player})',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Counter',
      type: 'StartsUsing',
      // 8AB8 = Hydrobullet (spread)
      // 8AB4 = Hydrofall (stack)
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke', capture: false },
      run: (data) => {
        data.ketuHydroBuffCount++;
        delete data.ketuHydroBuffIsSpreadFirst;
        delete data.ketuHydroBuffIsRoleStacks;
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff 1',
      comment: {
        en: `These directions assume that you always pick a square in the same
             quadrant as the crystal specified.
             For brevity, "next to" always means horizontal east/west of something.
             See trigger source for diagrams in comments.`,
        de: `Diese Anweisungen gehen davon aus, dass Sie immer ein Quadrat im gleichen
             Quadranten wie der angegebene Kristall liegt.
             Der Einfachheit halber bedeutet "neben" immer horizontal östlich/westlich von etwas.
             Siehe Triggerquelle für Diagramme in den Kommentaren.`,
      },
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data.ketuHydroBuffCount === 1 || data.ketuHydroBuffCount === 6,
      durationSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.ketuBuff === undefined)
          return;

        const isPlayerDPS = data.party.isDPS(data.me);
        const isPartnerDPS = data.ketuBuffPartner !== undefined
          ? data.party.isDPS(data.ketuBuffPartner)
          : undefined;
        const isBubbleNetPartnerSameRole = isPlayerDPS === isPartnerDPS &&
          isStandardLightParty(data);

        // Simplify callout in vast majority of cases where there's a normal light party setup
        // and you and the two dps and two supports get the same debuff, so no need to list
        // your partner.
        //
        // Otherwise, if you're doing this nonstandard for some reason or somebody is dead
        // you can know if you need to flex.
        const isSpread = matches.id === '8AB8';
        const bubbleStr = data.ketuBuff === 'bubble' ? output.bubbleBuff!() : output.fettersBuff!();
        // We don't know about role stacks at this point, as this is just the initial cast bar.
        const stackStr = isSpread ? output.spread!() : output.stacks!();
        if (isBubbleNetPartnerSameRole || data.ketuBuffPartner === undefined)
          return output.bubbleNetMech!({ fettersBubble: bubbleStr, spreadStack: stackStr });
        return output.bubbleNetMechPartner!({
          fettersBubble: bubbleStr,
          spreadStack: stackStr,
          player: data.party.member(data.ketuBuffPartner),
        });
      },
      infoText: (data, matches, output) => {
        // If somebody died and missed a debuff, good luck.
        if (data.ketuBuff === undefined)
          return;

        // Bubble always does the same thing.
        if (data.ketuBuff === 'bubble')
          return output.bubbleAnything!();

        // Two layouts, one with each crystal in its own column ("split")
        // and one with two columns that have an H and a V in that same column ("columns").
        // Wind doesn't matter, as "1" will always be on the horizontal crystals.
        // These can be flipped somewhat, but the solution is always the same.
        // Horizontal crystals are always in lc1 wind, and vertical crystals are always
        // in lc2 wind. Players with bubbles always go either (1) adjacent to a horizontal
        // crystal OR (2) diagonal of a vertical crystal. Either one works, but it
        // depends on how you split your priorities / wind which one you'd take.
        //
        // Legend: V = vertical crystal, H = horizontal crystal
        //         1 = limit cut wind 1, 2 = limit cut wind 2
        //         f = fetters, b = bubble (if placed in lc1)
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
      outputStrings: {
        bubbleNetMech: {
          en: '${fettersBubble} + ${spreadStack}',
          de: '${fettersBubble} + ${spreadStack}',
        },
        bubbleNetMechPartner: {
          en: '${fettersBubble} + ${spreadStack} (w/${player})',
          de: '${fettersBubble} + ${spreadStack} (mit ${player})',
        },
        bubbleBuff: {
          en: 'Bubble',
          de: 'Blase',
        },
        fettersBuff: {
          en: 'Fetters',
          de: 'Ketten',
        },
        spread: Outputs.spread,
        stacks: {
          en: 'Stacks',
          de: 'Sammeln',
        },
        bubbleAnything: {
          en: 'Diagonal of Vertical / Next to Horizontal ',
          de: 'Diagonale der Vertikalen / Neben Horizontal',
        },
        fettersSpreadSplit: {
          en: 'Diagonal of Vertical',
          de: 'Diagonale der Vertikalen',
        },
        fettersSpreadColumn: {
          en: 'Next to Vertical',
          de: 'Neben Vertikal',
        },
        fettersStackSplit: {
          en: 'On Horizontal',
          de: 'Auf Horizontal',
        },
        fettersStackColumn: {
          en: 'Diagonal of Horizontal',
          de: 'Diagonale der Horizontalen',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Double',
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data.ketuHydroBuffCount === 2 || data.ketuHydroBuffCount === 5,
      alertText: (data, matches, output) => {
        data.ketuHydroBuffIsSpreadFirst = matches.id === '8AB8';
        return data.ketuHydroBuffIsSpreadFirst ? output.spread!() : output.stacks!();
      },
      outputStrings: {
        spread: {
          en: 'Spread => Stacks',
          de: 'Verteilen => Sammeln',
        },
        stacks: {
          en: 'Stacks => Spread',
          de: 'Sammeln => Verteilen',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Double Followup',
      type: 'Ability',
      netRegex: { id: ['8ABA', '8AB7'], source: 'Ketuduke' },
      suppressSeconds: 10,
      infoText: (data, matches, output) => {
        const wasSpread = matches.id === '8ABA';
        if (wasSpread && data.ketuHydroBuffIsSpreadFirst === true) {
          if (data.ketuHydroBuffIsRoleStacks)
            return output.roleStacks!();
          return output.stacks!();
        } else if (!wasSpread && data.ketuHydroBuffIsSpreadFirst === false) {
          return output.spread!();
        }
      },
      outputStrings: {
        spread: Outputs.spread,
        stacks: {
          en: 'Stacks',
          de: 'Sammeln',
        },
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydrofall Role Stack Warning',
      type: 'GainsEffect',
      netRegex: { effectId: 'EA3' },
      delaySeconds: (data, matches) => {
        data.ketuStackTargets.push(matches.target);
        return data.ketuStackTargets.length === 2 ? 0 : 0.5;
      },
      alarmText: (data, _matches, output) => {
        const [stack1, stack2] = data.ketuStackTargets;
        if (data.ketuStackTargets.length !== 2 || stack1 === undefined || stack2 === undefined)
          return;

        // Sorry, non-standard light party comps.
        if (!isStandardLightParty(data))
          return;

        const isStack1DPS = data.party.isDPS(stack1);
        const isStack2DPS = data.party.isDPS(stack2);

        // If both stacks are on dps or neither stack is on a dps, then you have
        // standard "partner" stacks of one support and one dps. If one is on a dps
        // and one is on a support (which can happen if somebody dies), then
        // you (probably) need to have role stacks.
        if (isStack1DPS === isStack2DPS)
          return;

        data.ketuHydroBuffIsRoleStacks = true;

        // Handle Blowing Bubbles/Angry Seas spread+stack combo.
        if (data.ketuHydroBuffIsSpreadFirst === true)
          return output.spreadThenRoleStacks!();
        else if (data.ketuHydroBuffIsSpreadFirst === false)
          return output.roleStacksThenSpread!();
        return output.roleStacks!();
      },
      run: (data) => data.ketuStackTargets = [],
      outputStrings: {
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
        },
        spreadThenRoleStacks: {
          en: 'Spread => Role Stacks',
          de: 'Verteilen => Rollengruppe sammeln',
        },
        roleStacksThenSpread: {
          en: 'Role Stacks => Spread',
          de: 'Rollengruppe sammeln => Verteilen',
        },
      },
    },
    {
      id: 'AAI Ketuduke Receding Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACC', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data.ketuHydroBuffIsRoleStacks)
          return output.outInRoleStacks!();
        return output.outInStacks!();
      },
      run: (data) => data.ketuTwintidesNext = 'in',
      outputStrings: {
        outInStacks: {
          en: 'Out => In + Stacks',
          de: 'Raus => Rein + sammeln',
        },
        outInRoleStacks: {
          en: 'Out => In + Role Stacks',
          de: 'Raus => Rein + Rollengruppe sammeln',
        },
      },
    },
    {
      id: 'AAI Ketuduke Encroaching Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACE', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data.ketuHydroBuffIsRoleStacks)
          return output.inOutRoleStacks!();
        return output.inOutStacks!();
      },
      run: (data) => data.ketuTwintidesNext = 'out',
      outputStrings: {
        inOutStacks: {
          en: 'In => Out + Stacks',
          de: 'Rein => Raus + sammeln',
        },
        inOutRoleStacks: {
          en: 'In => Out + Role Stacks',
          de: 'Rein => Raus + Rollengruppe sammeln',
        },
      },
    },
    {
      id: 'AAI Ketuduke Twintides Followup',
      type: 'Ability',
      // 8ABC = Sphere Shatter, which happens slightly after the Twintides hit.
      // You can technically start moving along the safe Sphere Shatter side 0.5s earlier
      // after the initial out/in, but this is hard to explain.
      netRegex: { id: '8ABC', source: 'Ketuduke', capture: false },
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        const mech = data.ketuTwintidesNext;
        if (mech === undefined)
          return;
        const mechStr = output[mech]!();
        const stackStr = data.ketuHydroBuffIsRoleStacks ? output.roleStacks!() : output.stack!();
        return output.text!({ inOut: mechStr, stack: stackStr });
      },
      run: (data) => delete data.ketuTwintidesNext,
      outputStrings: {
        text: {
          en: '${inOut} + ${stack}',
          de: '${inOut} + ${stack}',
        },
        in: Outputs.in,
        out: Outputs.out,
        stack: {
          en: 'Stacks',
          de: 'Sammeln',
        },
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
        },
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystals 2',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607', capture: false },
      condition: (data) => data.ketuSpringCrystalCount === 2 && data.ketuCrystalAdd.length === 4,
      // We could call this absurdly early, but knowing this doesn't help with anything
      // until you know what your debuff is, so move it later both so it is less absurd
      // futuresight and so you don't have to remember it as long.
      delaySeconds: 5,
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
          de: 'Norden/Süden',
        },
        eastWestSafe: {
          en: 'East/West',
          de: 'Osten/Westen',
        },
        cornersSafe: {
          en: 'Corners',
          de: 'Ecken',
        },
      },
    },
    {
      id: 'AAI Ketuduke Angry Seas',
      type: 'StartsUsing',
      netRegex: { id: '8AC1', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data.ketuHydroBuffIsSpreadFirst)
          return output.knockbackSpread!();
        if (data.ketuHydroBuffIsRoleStacks)
          return output.knockbackRoleStacks!();
        return output.knockbackStacks!();
      },
      outputStrings: {
        knockbackSpread: {
          en: 'Knockback => Spread',
          de: 'Rückstoß => verteilen',
        },
        knockbackStacks: {
          en: 'Knockback => Stacks',
          de: 'Rückstoß => sammeln',
        },
        knockbackRoleStacks: {
          en: 'Knockback => Role Stacks',
          de: 'Rückstoß => Rollengruppe sammeln',
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
            de: 'Weg von ${player}',
          },
          tornadoOnYou: {
            en: 'Tornado on YOU',
            de: 'Tornado auf DIR',
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
          en: 'Cleanse ${player}',
          de: 'Reinige ${player}',
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
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Behind + Out',
          de: 'Geh nach Hinten + Raus',
        },
      },
    },
    {
      id: 'AAI Islekeeper Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '8C4E', source: 'Aloalo Islekeeper', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AAI Islekeeper Ancient Quaga Enrage',
      type: 'StartsUsing',
      netRegex: { id: '8C2F', source: 'Aloalo Islekeeper', capture: false },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Islekeeper!',
          de: 'Wächter besiegen!',
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
        return {
          0: output.front!(),
          1: output.right!(),
          2: output.back!(),
          3: output.left!(),
        }[finalDir];
      },
      run: (data) => {
        delete data.lalaBossTimes;
        delete data.lalaBossRotation;
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
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
          de: 'Lala anschauen',
        },
        back: {
          en: 'Look Away from Lala',
          de: 'Von Lala weg schauen',
        },
        left: {
          en: 'Left Flank towards Lala',
          de: 'Linke Seite zu Lala zeigen',
        },
        right: {
          en: 'Right Flank towards Lala',
          de: 'Rechte Seite zu Lala zeigen',
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
            de: 'Eins',
          },
          bigTwo: {
            en: 'Two (stack with three)',
            de: 'Zwei (sammeln mit Drei)',
          },
          smallTwo: {
            en: 'Two (stack with one)',
            de: 'Zwei (sammeln mit Eins)',
          },
          eitherTwo: {
            en: 'Either Two (w/${player})',
            de: 'Eine Zwei (mit ${player})',
          },
          three: {
            en: 'Three',
            de: 'Drei',
          },
          // This is just a raidcall so you can direct your friends.
          smallTwoOn: {
            en: '(Two with one: ${players})',
            de: '(Zwei mit Eins: ${players})',
          },
          unknownNum: {
            en: '${num}',
            de: '${num}',
          },
          num1: Outputs.num1,
          num2: Outputs.num2,
          num3: Outputs.num3,
          num4: Outputs.num4,
        };

        // For brevity, this code calls "small two" the two that stacks with one
        // and the "big two" the two that stacks with three.
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

        const smallTwos: string[] = [];
        for (const thisTwo of twos) {
          // can this two stack with the one?
          const isThisTwoStack = stacks.includes(thisTwo);
          if (isThisTwoStack && !isOneStack || !isThisTwoStack && isOneStack)
            smallTwos.push(thisTwo);
        }

        const [smallTwo1, smallTwo2] = smallTwos;
        if (smallTwos.length === 0 || smallTwo1 === undefined)
          return defaultOutput;

        const isPlayerSmallTwo = smallTwos.includes(data.me);

        // Worst case adjust
        if (isPlayerSmallTwo && smallTwo2 !== undefined) {
          const otherPlayer = smallTwo1 === data.me ? smallTwo2 : smallTwo1;
          return { alarmText: output.eitherTwo!({ player: data.party.member(otherPlayer) }) };
        }

        let playerRole: string;
        if (one === data.me) {
          playerRole = output.one!();
        } else if (twos.includes(data.me)) {
          playerRole = isPlayerSmallTwo ? output.smallTwo!() : output.bigTwo!();
        } else {
          playerRole = output.three!();
        }

        if (isPlayerSmallTwo)
          return { alertText: playerRole };

        return {
          alertText: playerRole,
          infoText: output.smallTwoOn!({ players: smallTwos.map((x) => data.party.member(x)) }),
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
          return output.left!();
        if (finalDir === 3)
          return output.right!();
      },
      run: (data) => {
        delete data.lalaPlayerRotation;
        delete data.lalaPlayerTimes;
      },
      outputStrings: {
        left: {
          en: 'Leftward March',
          de: 'Linker March',
        },
        right: {
          en: 'Rightward March',
          de: 'Rechter March',
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
          de: 'Eins (alles ausweichen)',
        },
        num2: {
          en: 'Two (stay middle)',
          de: 'Zwei (steh in der Mitte)',
        },
        num3: {
          en: 'Three (adjacent to middle)',
          de: 'Drei (steh neben der Mitte)',
        },
        num4: {
          en: 'Four',
          de: 'Vier',
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
          de: '(${num} später sicher)',
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
      id: 'AAI Statice Ring a Ring o\' Explosions Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '895C', source: 'Statice', capture: false },
      run: (data) => {
        data.staticeBomb = [];
        data.staticeBombTether = [];
        data.staticeSafeBombIds = [];
      },
    },
    {
      id: 'AAI Statice Bomb Add',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12520' },
      run: (data, matches) => data.staticeBomb.push(matches),
    },
    {
      id: 'AAI Statice Bomb Tether',
      type: 'SpawnNpcExtra',
      netRegex: {},
      run: (data, matches) => data.staticeBombTether.push(matches),
    },
    {
      id: 'AAI Statice Bomb Activate',
      type: 'ActorControlExtra',
      netRegex: { param2: '00000001' },
      run: (data, matches) => {
        const activeBombIds: string[] = [];

        const idToNpcSpawnExtra: { [id: string]: NetMatches['SpawnNpcExtra'] } = {};
        for (const npcSpawnExtra of data.staticeBombTether)
          idToNpcSpawnExtra[npcSpawnExtra.sourceId] = npcSpawnExtra;

        let currentBomb = matches.sourceId;
        for (let i = 0; i < 3; ++i) {
          const npcSpawnExtra = idToNpcSpawnExtra[currentBomb];
          if (npcSpawnExtra === undefined)
            break;
          currentBomb = npcSpawnExtra?.parentActorId;
          activeBombIds.push(currentBomb);
        }

        // TODO: validate all bombs are in the add lines too.
        if (activeBombIds.length !== 3 || !activeBombIds.includes(matches.sourceId)) {
          console.error('Failed to find active bombs');
          console.error(JSON.stringify(data.staticeBomb));
          console.error(JSON.stringify(data.staticeBombTether));
          console.error(JSON.stringify(activeBombIds));
        } else {
          const validBombIds = data.staticeBomb.map((x) => x.id);
          data.staticeSafeBombIds = validBombIds.filter((id) => !activeBombIds.includes(id));
        }
      },
    },
    {
      id: 'AAI Statice Bomb Count',
      type: 'Ability',
      netRegex: { id: '8A6A' },
      run: (data, matches) => {
        const firstBomb = data.staticeSafeBombIds[0];
        if (matches.targetId === firstBomb)
          data.staticeBombRotateCount++;
      },
    },
    {
      id: 'AAI Statice Bomb Rotate Final',
      type: 'Ability',
      netRegex: { id: '8A6A', capture: false },
      delaySeconds: 4,
      durationSeconds: 6,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.staticeSafeBombIds.length !== 3)
          return;

        const bombToDir: { [id: string]: number } = {};
        for (const id of data.staticeSafeBombIds) {
          const addLine = data.staticeBomb.find((x) => x.id === id);
          if (addLine === undefined)
            break;
          const x = parseFloat(addLine.x);
          const y = parseFloat(addLine.y);
          bombToDir[id] = xyTo5DirBombNum(x, y);
        }

        // Sort bomb ids from original north and clockwise to be consistent in callout.
        // This makes it possible to consistently go to the same place as a group.
        const sortedIds = [...data.staticeSafeBombIds].sort((a, b) => {
          return (bombToDir[a] ?? 0) - (bombToDir[b] ?? 0);
        });

        const safeSpots = sortedIds.map((id) => {
          const dir = bombToDir[id];
          if (dir === undefined)
            return output.unknown!();
          if (dir === 5)
            return output.center!();
          return {
            0: output.dirN!(),
            1: output.dirNE!(),
            2: output.dirSE!(),
            3: output.dirSW!(),
            4: output.dirNW!(),
          }[(dir + data.staticeBombRotateCount) % 5] ?? output.unknown!();
        });

        const mech = output[data.staticeTrapshooting.shift() ?? 'unknown']!();
        // This is kinda hacky, but in order to suppress the next trapshooting call,
        // replace the mech we just shifted off with an undefined.
        data.staticeTrapshooting.unshift(undefined);

        if (sortedIds.find((id) => bombToDir[id] === 5) !== undefined)
          return output.middleSafe!({ spots: safeSpots, mech: mech });
        return output.middleUnsafe!({ spots: safeSpots, mech: mech });
      },
      outputStrings: {
        middleSafe: {
          en: '${spots} => ${mech}',
        },
        middleUnsafe: {
          en: '${spots} (middle unsafe) => ${mech}',
        },
        dirN: Outputs.dirN,
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
        center: {
          en: 'Center',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AAI Statice Bull\'s-eye',
      type: 'GainsEffect',
      netRegex: { effectId: 'E9E' },
      delaySeconds: (data, matches) => {
        // Note: this collects for the pinwheeling dartboard version too.
        data.staticeDart.push(matches);
        return data.staticeDart.length === 3 ? 0 : 0.5;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart on YOU',
            de: 'Dart auf DIR',
          },
          noDartOnYou: {
            en: 'No Dart',
            de: 'Kein Dart',
          },
          flexCall: {
            en: '(${player} unmarked)',
            de: '(${player} unmarkiert)',
          },
        };

        if (data.staticeIsPinwheelingDartboard)
          return;

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
      id: 'AAI Statice Surprise Balloon Reminder',
      // This is an early reminder for the following Trigger Happy with knockback.
      // However, because there's a tight window to immuune both knockbacks,
      // call this ~15s early (in case anybody forgot).
      type: 'StartsUsing',
      netRegex: { id: '894D', source: 'Statice', capture: false },
      infoText: (data, _matches, output) => {
        const num = data.staticeTriggerHappy;
        if (num === undefined)
          return;
        // We'll re-call this out with the knockback warning.
        // However, also clear `data.staticeTriggerHappy` to avoid double callouts.
        data.staticePopTriggerHappyNum = num;
        return output.numSafeSoon!({ num: output[`num${num}`]!() });
      },
      run: (data) => delete data.staticeTriggerHappy,
      outputStrings: {
        numSafeSoon: {
          en: '(${num} safe soon)',
          de: '(${num} gleich sicher)',
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
      id: 'AAI Statice Pop',
      type: 'StartsUsing',
      // TODO: this might need a slight delay
      netRegex: { id: '894E', source: 'Statice', capture: false },
      suppressSeconds: 20,
      alertText: (data, _matches, output) => {
        const num = data.staticePopTriggerHappyNum;
        if (num === undefined)
          return output.knockback!();

        const numStr = output[`num${num}`]!();
        return output.knockbackToNum!({ num: numStr });
      },
      run: (data) => delete data.staticePopTriggerHappyNum,
      outputStrings: {
        knockbackToNum: {
          en: 'Knockback => ${num}',
          de: 'Rückstoß => ${num}',
        },
        knockback: Outputs.knockback,
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
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
        let mech = output.unknown!();

        const num = data.staticeTriggerHappy;
        if (num !== undefined) {
          mech = output[`num${num}`]!();
          delete data.staticeTriggerHappy;
        } else {
          const mechName = data.staticeTrapshooting.shift();
          mech = mechName === undefined ? output.unknown!() : output[mechName]!();
        }

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
          de: 'Vorwärtsmarsch => ${mech}',
        },
        backward: {
          en: 'Backward March => ${mech}',
          de: 'Rückwärtsmarsch => ${mech}',
        },
        left: {
          en: 'Left March => ${mech}',
          de: 'Marsch Links => ${mech}',
        },
        right: {
          en: 'Right March => ${mech}',
          de: 'Marsch Rechts => ${mech}',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AAI Statice Present Box Counter',
      // This happens ~1s prior to ActorControlExtra on bomb.
      type: 'StartsUsing',
      netRegex: { id: '8955', source: 'Statice', capture: false },
      run: (data) => data.staticePresentBoxCount++,
    },
    {
      id: 'AAI Statice Present Box One Triangle',
      type: 'ActorControlExtra',
      // TODO: we could do this call even before the glow with the tethers by treating
      // the middle bomb as glowing, but that'd be extra work for little benefit.
      netRegex: { param2: '00000001', capture: false },
      condition: (data) => data.staticePresentBoxCount === 1,
      infoText: (data, _matches, output) => {
        if (data.staticeSafeBombIds.length !== 3)
          return;

        const bombToDir: { [id: string]: number } = {};
        for (const id of data.staticeSafeBombIds) {
          const addLine = data.staticeBomb.find((x) => x.id === id);
          if (addLine === undefined)
            break;
          const x = parseFloat(addLine.x);
          const y = parseFloat(addLine.y);
          bombToDir[id] = xyTo5DirBombNum(x, y);
        }

        const sortedBombDirs = data.staticeSafeBombIds.map((x) => bombToDir[x]).sort();

        for (const start of [0, 1, 2]) {
          const dir1 = sortedBombDirs[start];
          const dir2 = sortedBombDirs[(start + 1) % 3];
          const dir3 = sortedBombDirs[(start + 2) % 3];
          if (dir1 === undefined || dir2 === undefined || dir3 === undefined)
            return;

          if ((dir1 + 1) % 5 !== dir2)
            continue;
          if ((dir2 + 1) % 5 !== dir3) {
            // If we get here, then dir1 and dir2 are adjacent to each other, but not dir3.
            // Save this work off for the missiles later.
            data.staticePresentBox1TopOfTriangleDir = (dir2 + 2) % 5;
            continue;
          }

          data.staticePresentBox1TopOfTriangleDir = dir2;
          data.staticePresentBox1StackSpot = dir2;

          // dir2 is in the middle
          const outputDir = {
            0: output.dirN!(),
            1: output.dirNE!(),
            2: output.dirSE!(),
            3: output.dirSW!(),
            4: output.dirNW!(),
          }[dir2];
          return output.text!({ dir: outputDir });
        }
      },
      outputStrings: {
        text: {
          en: '(stack is at ${dir})',
        },
        dirN: Outputs.dirN,
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
      },
    },
    {
      id: 'AAI Statice Surprising Missile Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12517' },
      run: (data, matches) => {
        data.staticeMissileCollect.push(matches);
        if (data.staticeMissileCollect.length !== 2)
          return;

        // TODO: this is maybe duplicated too much, but it does extra work here?
        const bombToDir: { [id: string]: number } = {};
        const bombToPos: { [id: string]: { x: number; y: number } } = {};
        let topBombPos: { x: number; y: number } | undefined;
        for (const id of data.staticeSafeBombIds) {
          const addLine = data.staticeBomb.find((x) => x.id === id);
          if (addLine === undefined)
            break;
          const x = parseFloat(addLine.x);
          const y = parseFloat(addLine.y);
          const dir = xyTo5DirBombNum(x, y);
          bombToDir[id] = dir;
          bombToPos[id] = { x, y };
          if (dir === data.staticePresentBox1TopOfTriangleDir)
            topBombPos = { x, y };
        }

        const topBombDir = data.staticePresentBox1TopOfTriangleDir;
        if (topBombPos === undefined || topBombDir === undefined)
          return;

        // If we already know the stack spot, eliminate it from the valid safe dirs to avoid any logic errors later.
        const stackDir = data.staticePresentBox1StackSpot;
        const nonStackBombIds = data.staticeSafeBombIds.filter((id) => bombToDir[id] !== stackDir);

        // For the intersecting triangle case, find the missile furthest from the top of the triangle
        // and tell them to go there. It sure seems like missiles need to run north/south along
        // the long direction of this safe triangle of bombs to break the tether, so even if the
        // missiles are lateral (relatively) and the furthest two spots are the bottom of the triangle
        // they need to still go N/S (relative).
        const missileDirs: number[] = [];
        if (stackDir === undefined) {
          let furthestMissileId: string | undefined;
          let furthestDistanceSqr: number | undefined;
          for (const missile of data.staticeMissileCollect) {
            const xDiff = parseFloat(missile.x) - topBombPos.x;
            const yDiff = parseFloat(missile.y) - topBombPos.y;
            const distSqr = xDiff * xDiff + yDiff * yDiff;
            if (furthestDistanceSqr === undefined || distSqr > furthestDistanceSqr) {
              furthestDistanceSqr = distSqr;
              furthestMissileId = missile.id;
            }
          }
          if (furthestMissileId === undefined)
            return;
          missileDirs.push(topBombDir);
          data.staticeMissileIdToDir[furthestMissileId] = topBombDir;
        }

        // Solve for remaining missiles.
        // For the "disconnected triangle" case, this will solve for both, ignoring the middle stack spot.
        // For the "intersecting triangle" case, this will solve the remaining missile ignoring the top of the triangle.
        for (const missile of data.staticeMissileCollect) {
          // if we already solved this one above, ignore it.
          if (data.staticeMissileIdToDir[missile.id] !== undefined)
            continue;
          let furthestDir: number | undefined;
          let furthestDistanceSqr: number | undefined;
          for (const id of nonStackBombIds) {
            const pos = bombToPos[id];
            if (pos === undefined)
              return;
            const xDiff = parseFloat(missile.x) - pos.x;
            const yDiff = parseFloat(missile.y) - pos.y;
            const distSqr = xDiff * xDiff + yDiff * yDiff;
            if (furthestDistanceSqr === undefined || distSqr > furthestDistanceSqr) {
              furthestDistanceSqr = distSqr;
              furthestDir = bombToDir[id];
            }
          }

          if (furthestDir !== undefined) {
            data.staticeMissileIdToDir[missile.id] = furthestDir;
            missileDirs.push(furthestDir);
          }
        }

        if (stackDir !== undefined)
          return;

        const safeDirs = data.staticeSafeBombIds.map((id) => bombToDir[id]);
        const maybeStackDirs = safeDirs.filter((dir) =>
          dir !== undefined && !missileDirs.includes(dir)
        );
        const [finalStackDir] = maybeStackDirs;

        if (maybeStackDirs.length === 1 && finalStackDir !== undefined)
          data.staticePresentBox1StackSpot = finalStackDir;
      },
    },
    {
      id: 'AAI Statice Present Box Missile',
      type: 'Tether',
      netRegex: { source: 'Surprising Missile', id: '0011' },
      delaySeconds: (data, matches) => {
        data.staticeMissileTether.push(matches);
        return data.staticeMissileTether.length === 2 ? 0 : 0.5;
      },
      durationSeconds: 7,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missileOnYou: {
            en: 'Bait Tethers => Missile Spread',
            de: 'Verbindungen ködern => Verteilen mit Raketen',
          },
          missileOnYouDir: {
            en: 'Bait Tethers => Missile Spread ${dir}',
          },
          stackAt: {
            en: '(stack is at ${dir})',
          },
          dirN: Outputs.dirN,
          dirNE: Outputs.dirNE,
          dirSE: Outputs.dirSE,
          dirSW: Outputs.dirSW,
          dirNW: Outputs.dirNW,
        };

        if (data.staticeMissileTether.length !== 2)
          return;

        const missileTether = data.staticeMissileTether.find((x) => x.target === data.me);
        if (missileTether === undefined)
          return;

        const dirToStr: { [dir: number]: string } = {
          0: output.dirN!(),
          1: output.dirNE!(),
          2: output.dirSE!(),
          3: output.dirSW!(),
          4: output.dirNW!(),
        } as const;

        let infoText: string | undefined;
        const stackDir = data.staticePresentBox1StackSpot;
        if (stackDir !== undefined)
          infoText = output.stackAt!({ dir: dirToStr[stackDir] });

        const missileDir = data.staticeMissileIdToDir[missileTether.sourceId];
        if (missileDir === undefined)
          return { alertText: output.missileOnYou!(), infoText: infoText };
        return {
          alertText: output.missileOnYouDir!({ dir: dirToStr[missileDir] }),
          infoText: infoText,
        };
      },
      run: (data) => data.staticeMissileTether = [],
    },
    {
      id: 'AAI Statice Present Box Claw',
      type: 'Tether',
      netRegex: { source: 'Surprising Claw', id: '0011' },
      delaySeconds: (data, matches) => {
        data.staticeClawTether.push(matches);
        return data.staticeClawTether.length === 2 ? 0 : 0.5;
      },
      durationSeconds: 7,
      alertText: (data, _matches, output) => {
        if (data.staticeClawTether.length !== 2)
          return;
        if (!data.staticeClawTether.map((x) => x.target).includes(data.me))
          return;

        const dirToStr: { [dir: number]: string } = {
          0: output.dirN!(),
          1: output.dirNE!(),
          2: output.dirSE!(),
          3: output.dirSW!(),
          4: output.dirNW!(),
        } as const;

        const stackDir = data.staticePresentBox1StackSpot;
        if (stackDir !== undefined)
          return output.stackAt!({ dir: dirToStr[stackDir] });
        return output.stack!();
      },
      run: (data) => data.staticeClawTether = [],
      outputStrings: {
        stack: {
          en: 'Juke Claw => Stack',
          de: 'Zieh Klaue => Sammeln',
        },
        stackAt: {
          en: 'Juke Claw => Stack ${dir}',
        },
        dirN: Outputs.dirN,
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
      },
    },
    {
      id: 'AAI Statice Burning Chains',
      type: 'GainsEffect',
      netRegex: { effectId: '301' },
      condition: Conditions.targetIsYou(),
      // TODO: add a strategy for dart colors and say where to go here
      // for the Pinwheeling Dartboard if you have a dart.
      response: Responses.breakChains(),
    },
    {
      id: 'AAI Statice Shocking Abandon',
      type: 'StartsUsing',
      netRegex: { id: '8948', source: 'Statice' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Tracker',
      type: 'StartsUsing',
      netRegex: { id: '8CBC', source: 'Statice', capture: false },
      run: (data) => data.staticeIsPinwheelingDartboard = true,
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Color',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12507' },
      durationSeconds: 6,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart (w/${player})',
            de: 'Dart (mit ${player})',
          },
          noDartOnYou: {
            en: 'No Dart',
            de: 'Kein Dart',
          },
          blue: {
            en: 'Avoid Blue',
            de: 'Vermeide Blau',
          },
          red: {
            en: 'Avoid Red',
            de: 'Vermeide Rot',
          },
          yellow: {
            en: 'Avoid Yellow',
            de: 'Vermeide Gelb',
          },
        };

        let infoText: string | undefined;

        const centerX = -200;
        const centerY = 0;
        const x = parseFloat(matches.x) - centerX;
        const y = parseFloat(matches.y) - centerY;

        // 12 pie slices, the edge of the first one is directly north.
        // It goes in B R Y order repeating 4 times.
        // The 0.5 subtraction (12 - 0.5 = 11.5) is because the Homing Pattern
        // lands directly in the middle of a slice.
        const dir12 = Math.round(6 - 6 * Math.atan2(x, y) / Math.PI + 11.5) % 12;

        const colorOffset = dir12 % 3;
        const colorMap: { [offset: number]: typeof data.staticeHomingColor } = {
          0: 'blue',
          1: 'red',
          2: 'yellow',
        } as const;

        data.staticeHomingColor = colorMap[colorOffset];
        if (data.staticeHomingColor !== undefined)
          infoText = output[data.staticeHomingColor]!();

        if (data.staticeDart.length !== 2)
          return { infoText };

        const dartTargets = data.staticeDart.map((x) => x.target);
        if (!dartTargets.includes(data.me))
          return { alertText: output.noDartOnYou!(), infoText: infoText };

        const [target1, target2] = dartTargets;
        if (target1 === undefined || target2 === undefined)
          return { infoText };
        const otherTarget = data.party.member(target1 === data.me ? target2 : target1);
        return { alertText: output.dartOnYou!({ player: otherTarget }), infoText: infoText };
      },
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Mech',
      type: 'HeadMarker',
      netRegex: { id: headmarkerIds.tethers },
      condition: (data) => data.staticeIsPinwheelingDartboard,
      delaySeconds: (data, matches) => {
        data.staticeDartboardTether.push(matches);
        return data.staticeDartboardTether.length === 2 ? 0 : 0.5;
      },
      alertText: (data, _matches, output) => {
        if (data.staticeDartboardTether.length !== 2)
          return;

        const tethers = data.staticeDartboardTether.map((x) => x.target);

        if (tethers.includes(data.me)) {
          const [tether1, tether2] = tethers;
          const other = data.party.member(tether1 === data.me ? tether2 : tether1);
          return output.tether!({ player: other });
        }

        const partyNames = data.party.partyNames;
        const nonTethers = partyNames.filter((x) => !tethers.includes(x));
        const [stack1, stack2] = nonTethers;
        const other = data.party.member(stack1 === data.me ? stack2 : stack1);
        return output.stack!({ player: other });
      },
      run: (data) => data.staticeDartboardTether = [],
      outputStrings: {
        // TODO: maybe this should remind you of dart color
        tether: {
          en: 'Tether w/${player}',
          de: 'Verbindung mit ${player}',
        },
        stack: {
          en: 'Stack w/${player}',
          de: 'Sammeln mit ${player}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Far Tide/Near Tide': 'Far/Near Tide',
        'Hydrobullet/Hydrofall': 'Hydrobullet/fall',
        'Hydrofall/Hydrobullet': 'Hydrofall/bullet',
        'Receding Twintides/Encroaching Twintides': 'Receding/Encroaching Twintides',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aloalo Golem': 'Aloalo-Holzgolem',
        'Aloalo Islekeeper': 'Aloalo-Wächter',
        'Aloalo Kiwakin': 'Aloalo-Kiwakin',
        'Aloalo Monk': 'Aloalo-Mönch',
        'Aloalo Ray': 'Aloalo-Rochen',
        'Aloalo Snipper': 'Aloalo-Schnippler',
        'Aloalo Wood Golem': 'Aloalo-Holzgolem',
        'Aloalo Zaratan': 'Aloalo-Zaratan',
        'Arcane Font': 'arkan(?:e|er|es|en) Körper',
        'Arcane Globe': 'arkan(?:e|er|es|en) Kugel',
        'Ball of Fire': 'Feuerkugel',
        'Bomb': 'Bombe',
        'Ketuduke': 'Ketuduke',
        'Lala': 'Lala',
        'Needle': 'Nadel',
        'Spring Crystal': 'Wasserquell-Kristall',
        'Statice': 'Statice',
        'Surprising Claw': 'Überraschungsklaue',
        'Surprising Missile': 'Überraschungsrakete',
        'Surprising Staff': 'Überraschungsstab',
        'The Dawn Trial': 'Morgenrot-Probe',
        'The Dusk Trial': 'Abendrot-Probe',
        'The Midnight Trial': 'Vollmond-Probe',
      },
      'replaceText': {
        '\\(buff\\)': '(Statusveränderung)',
        '\\(cast\\)': '(wirken)',
        'Aero II': 'Windra',
        'Aero IV': 'Windka',
        'Analysis': 'Analyse',
        'Angry Seas': 'Zornige Fluten',
        'Angular Addition': 'Winkeladdition',
        'Arcane Array': 'Arkanes Spektrum',
        'Arcane Blight': 'Arkane Fäule',
        'Arcane Mine': 'Arkane Mine',
        'Arcane Plot': 'Arkane Flur',
        'Arcane Point': 'Arkane Stätte',
        'Beguiling Glitter': 'Irrleuchten',
        'Blowing Bubbles': 'Pusteblasen',
        'Bright Pulse': 'Glühen',
        'Bubble Net': 'Blasennetz',
        'Burning Chains': 'Brennende Ketten',
        'Burst': 'Explosion',
        'Constructive Figure': 'Ruf der Schöpfer',
        'Dartboard of Dancing Explosives': 'Darts und Drehung',
        'Encroaching Twintides': 'Ring der Zwiegezeiten',
        'Explosive Theorem': 'Arkane Fäule',
        'Faerie Ring': 'Feenring',
        'Far Tide': 'Ring der Gezeiten',
        'Fire Spread': 'Brandstiftung',
        'Fireworks': 'Feuerwerk',
        'Fluke Gale': 'Flossensturm',
        'Fluke Typhoon': 'Flossentaifun',
        'Hundred Lashings': 'Auspeitschung',
        'Hydrobomb': 'Hydro-Bombe',
        'Hydrobullet': 'Hydro-Kugel',
        'Hydrofall': 'Hydro-Sturz',
        'Inferno Divide': 'Infernale Teilung',
        'Inferno Theorem': 'Infernales Theorem',
        'Locked and Loaded': 'Geladen und entsichert',
        'Misload': 'Fehlladung',
        'Near Tide': 'Kreis der Gezeiten',
        'Pinwheeling Dartboard': 'Darts und Rad',
        'Planar Tactics': 'Flächentaktiken',
        'Pop': 'Platzen',
        'Powerful Light': 'Entladenes Licht',
        'Present Box': 'Geschenkschachtel',
        'Radiance': 'Radiation',
        'Receding Twintides': 'Kreis der Zwiegezeiten',
        'Ring a Ring o\' Explosions': 'Ringel-Ringel-Bombe',
        '(?<! )Roar': 'Brüllen',
        'Saturate': 'Wasserfontäne',
        'Shocking Abandon': 'Schockende Hingabe',
        'Spatial Tactics': 'Raumtaktiken',
        'Sphere Shatter': 'Sphärensplitterung',
        'Spring Crystals': 'Quellkristalle',
        'Strategic Strike': 'Schwere Attacke',
        'Strewn Bubbles': 'Streublasen',
        'Surprise Balloon': 'Überraschungsballon',
        'Surprise Needle': 'Überraschungsnadel',
        'Symmetric Surge': 'Symmetrischer Schub',
        'Targeted Light': 'Gezieltes Licht',
        'Telluric Theorem': 'Tellurisches Theorem',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Trapshooting': 'Tontaubenschuss',
        'Trick Reload': 'Trickladung',
        'Trigger Happy': 'Schießwut',
        'Uncommon Ground': 'Voll ins Schwarze',
        'Updraft': 'Aufwind',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Aloalo Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Islekeeper': 'gardien d\'Aloalo',
        'Aloalo Kiwakin': 'kiwakin d\'Aloalo',
        'Aloalo Monk': 'moine d\'Aloalo',
        'Aloalo Ray': 'raie rayée d\'Aloalo',
        'Aloalo Snipper': 'cisailleur d\'Aloalo',
        'Aloalo Wood Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Zaratan': 'zaratan d\'Aloalo',
        'Arcane Font': 'sphère arcanique',
        'Arcane Globe': 'globe arcanique',
        'Ball of Fire': 'orbe de feu',
        'Bomb': 'bombe',
        'Ketuduke': 'Ketuduke',
        'Lala': 'Lala',
        'Needle': 'aiguille',
        'Spring Crystal': 'cristal de source',
        'Statice': 'Statice',
        'Surprising Claw': 'griffe surprise',
        'Surprising Missile': 'missile surprise',
        'Surprising Staff': 'sceptre surprise',
        'The Dawn Trial': 'Épreuve de Dilumu',
        'The Dusk Trial': 'Épreuve de Qurupe',
        'The Midnight Trial': 'Épreuve de Nokosero',
      },
      'replaceText': {
        'Aero II': 'Extra Vent',
        'Aero IV': 'Giga Vent',
        'Analysis': 'Analyse',
        'Angry Seas': 'Mer agitée',
        'Angular Addition': 'Calcul angulaire',
        'Arcane Array': 'Assemblement arcanique',
        'Arcane Blight': 'Canon arcanique',
        'Arcane Mine': 'Mine arcanique',
        'Arcane Plot': 'Modulateur arcanique',
        'Arcane Point': 'Pointe arcanique',
        'Beguiling Glitter': 'Paillettes aveuglantes',
        'Blowing Bubbles': 'Bulles soufflées',
        'Bright Pulse': 'Éclat',
        'Bubble Net': 'Filet de bulles',
        'Burning Chains': 'Chaînes brûlantes',
        'Burst': 'Explosion',
        'Constructive Figure': 'Icône articulée',
        'Dartboard of Dancing Explosives': 'Duo fléchettes-tourbillon',
        'Encroaching Twintides': 'Double marée débordante',
        'Explosive Theorem': 'Théorème explosif',
        'Faerie Ring': 'Cercle féérique',
        'Far Tide': 'Marée lointaine',
        'Fire Spread': 'Nappe de feu',
        'Fireworks': 'Feu d\'artifice',
        'Fluke Gale': 'Bourrasque hasardeuse',
        'Fluke Typhoon': 'Typhon hasardeux',
        'Hundred Lashings': 'Cent coups de fouet',
        'Hydrobomb': 'Hydrobombe',
        'Hydrobullet': 'Barillet hydrique',
        'Hydrofall': 'Pilonnage hydrique',
        'Inferno Divide': 'Division infernale',
        'Inferno Theorem': 'Théorème infernal',
        'Locked and Loaded': 'Rechargement réussi',
        'Misload': 'Rechargement raté',
        'Near Tide': 'Marée proche',
        'Pinwheeling Dartboard': 'Duo fléchettes-moulinette',
        'Planar Tactics': 'Tactique planaire',
        'Pop': 'Rupture',
        'Powerful Light': 'Explosion sacrée',
        'Present Box': 'Boîtes cadeaux',
        'Radiance': 'Irradiation',
        'Receding Twintides': 'Double marée fuyante',
        'Ring a Ring o\' Explosions': 'Tempérament explosif',
        '(?<! )Roar': 'Rugissement',
        'Saturate': 'Jet d\'eau',
        'Shocking Abandon': 'Choc renonciateur',
        'Spatial Tactics': 'Tactique spatiale',
        'Sphere Shatter': 'Rupture glacée',
        'Spring Crystals': 'Cristaux de source',
        'Strategic Strike': 'Coup violent',
        'Strewn Bubbles': 'Bulles éparpillées',
        'Surprise Balloon': 'Ballons surprises',
        'Surprise Needle': 'Aiguille surprise',
        'Symmetric Surge': 'Déferlement symétrique',
        'Targeted Light': 'Rayon ciblé',
        'Telluric Theorem': 'Théorème tellurique',
        'Tidal Roar': 'Vague rugissante',
        'Trapshooting': 'Tir au pigeon',
        'Trick Reload': 'Rechargement habile',
        'Trigger Happy': 'Gâchette impulsive',
        'Uncommon Ground': 'Terrain de mésentente',
        'Updraft': 'Courants ascendants',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Aloalo Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Islekeeper': 'アロアロ・キーパー',
        'Aloalo Kiwakin': 'アロアロ・キワキン',
        'Aloalo Monk': 'アロアロ・モンク',
        'Aloalo Ray': 'アロアロ・ストライプレイ',
        'Aloalo Snipper': 'アロアロ・スニッパー',
        'Aloalo Wood Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Zaratan': 'アロアロ・ザラタン',
        'Arcane Font': '立体魔法陣',
        'Arcane Globe': '球体魔法陣',
        'Ball of Fire': '火球',
        'Bomb': '爆弾',
        'Ketuduke': 'ケトゥドゥケ',
        'Lala': 'ララ',
        'Needle': 'ニードル',
        'Spring Crystal': '湧水のクリスタル',
        'Statice': 'スターチス',
        'Surprising Claw': 'サプライズ・クロー',
        'Surprising Missile': 'サプライズ・ミサイル',
        'Surprising Staff': 'サプライズ・ロッド',
        'The Dawn Trial': 'ディルムの試練',
        'The Dusk Trial': 'クルペの試練',
        'The Midnight Trial': 'ノコセロの試練',
      },
      'replaceText': {
        'Aero II': 'エアロラ',
        'Aero IV': 'エアロジャ',
        'Analysis': 'アナライズ',
        'Angry Seas': 'アングリーシーズ',
        'Angular Addition': '回転角乗算',
        'Arcane Array': '複合魔紋',
        'Arcane Blight': '魔紋砲',
        'Arcane Mine': '地雷魔紋',
        'Arcane Plot': '変光魔紋',
        'Arcane Point': '変光起爆',
        'Beguiling Glitter': '惑わしの光',
        'Blowing Bubbles': 'バブルブロワー',
        'Bright Pulse': '閃光',
        'Bubble Net': 'バブルネットフィーディング',
        'Burning Chains': '炎の鎖',
        'Burst': '爆発',
        'Constructive Figure': '人形召喚',
        'Dartboard of Dancing Explosives': 'ダーツ＆ローテーション',
        'Encroaching Twintides': 'リング・ダブルタイド',
        'Explosive Theorem': '魔爆法',
        'Faerie Ring': 'フェアリーリング',
        'Far Tide': 'リングタイド',
        'Fire Spread': '放火',
        'Fireworks': 'ファイアワークフェスティバル',
        'Fluke Gale': 'フリッパーゲイル',
        'Fluke Typhoon': 'フリッパータイフーン',
        'Hundred Lashings': 'めった打ち',
        'Hydrobomb': 'ハイドロボム',
        'Hydrobullet': 'ハイドロバレット',
        'Hydrofall': 'ハイドロフォール',
        'Inferno Divide': '十火法',
        'Inferno Theorem': '散火法',
        'Locked and Loaded': 'リロード成功',
        'Misload': 'リロード失敗',
        'Near Tide': 'ラウンドタイド',
        'Pinwheeling Dartboard': 'ダーツ＆ウィール',
        'Planar Tactics': '爆雷戦術：面',
        'Pop': '破裂',
        'Powerful Light': '光爆',
        'Present Box': 'プレゼントボックス',
        'Radiance': '光球爆散',
        'Receding Twintides': 'ラウンド・ダブルタイド',
        'Ring a Ring o\' Explosions': 'リンクリンクボム',
        '(?<! )Roar': '咆哮',
        'Saturate': '放水',
        'Shocking Abandon': 'アバンドンショック',
        'Spatial Tactics': '爆雷戦術：立体',
        'Sphere Shatter': '破裂',
        'Spring Crystals': '湧水のクリスタル',
        'Strategic Strike': '強撃',
        'Strewn Bubbles': 'バブルストゥルー',
        'Surprise Balloon': 'サプライズバルーン',
        'Surprise Needle': 'サプライズニードル',
        'Symmetric Surge': '双数爆撃',
        'Targeted Light': '高精度光弾',
        'Telluric Theorem': '地隆法',
        'Tidal Roar': 'タイダルロア',
        'Trapshooting': 'トラップシューティング',
        'Trick Reload': 'トリックリロード',
        'Trigger Happy': 'トリガーハッピー',
        'Uncommon Ground': 'グラウンドシアー',
        'Updraft': '上昇気流',
      },
    },
  ],
};

export default triggerSet;
