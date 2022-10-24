import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Silkie specify which puff to get behind in first Slipper Soap
// TODO: Silkie specify where to point puff's tether
// TODO: Silkie call puff to go to for safety
// TODO: Silkie call when to go to boss for safety
// TODO: Silkie cleanup timeline
// TODO: Gladiator triggers and timeline to enrage
// TODO: Shadowcaster triggers and timeline to enrage

export interface Data extends RaidbossData {
  suds?: string;
  soapCounter: number;
  beaterCounter: number;
  mightCasts: (NetMatches['StartsUsing'])[];
  mightDir?: string;
  hasLingering?: boolean;
  thunderousEchoPlayer?: string;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AnotherSildihnSubterrane,
  timelineFile: 'another_sildihn_subterrane.txt',
  initData: () => {
    return {
      soapCounter: 0,
      beaterCounter: 0,
      mightCasts: [],
    };
  },
  triggers: [
    // ---------------- Silkie ----------------
    {
      id: 'ASS Dust Bluster',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '776C', source: 'Silkie', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'ASS Squeaky Clean Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7755', source: 'Silkie', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'ASS Squeaky Clean Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7756', source: 'Silkie', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'ASS Suds Collect',
      // 7757 Bracing Suds (Wind / Donut)
      // 7758 Chilling Suds (Ice / Cardinal)
      // 7759 Fizzling Suds (Lightning / Intercardinal)
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['7757', '7758', '7759'], source: 'Silkie' }),
      run: (data, matches) => data.suds = matches.id,
    },
    {
      id: 'ASS Slippery Soap',
      // Happens 5 times in the encounter
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79FB', source: 'Silkie' }),
      preRun: (data) => data.soapCounter++,
      alertText: (data, matches, output) => {
        if (data.suds === '7757') {
          // Does not happen on first or third Slippery Soap
          if (matches.target === data.me)
            return output.getInFrontOfPlayerKnockback!({ player: data.ShortName(matches.target) });
          return output.getBehindPartyKnockback!();
        }
        if (matches.target === data.me) {
          if (data.soapCounter === 1)
            return output.getBehindPuff!();
          if (data.soapCounter === 3)
            return output.getBehindPuffs!();
          return output.getBehindParty!();
        }
        return output.getInFrontOfPlayer!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        getBehindPuff: {
          en: 'Behind puff and party',
        },
        getBehindPuffs: {
          en: 'Behind puffs and party (East/West)',
        },
        getBehindParty: {
          en: 'Behind party',
        },
        getBehindPartyKnockback: {
          en: 'Behind party (Knockback)',
        },
        getInFrontOfPlayer: {
          en: 'In front of ${player}',
        },
        getInFrontOfPlayerKnockback: {
          en: 'In front of ${player} (Knockback)',
        },
      },
    },
    {
      id: 'ASS Slippery Soap with Chilling Suds',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '775E', source: 'Silkie' }),
      condition: (data) => data.suds === '7758',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 1,
      response: Responses.moveAround(),
    },
    {
      id: 'ASS Slippery Soap After',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '775E', source: 'Silkie', capture: false }),
      infoText: (data, _matches, output) => {
        switch (data.suds) {
          case '7757':
            return output.getUnder!();
          case '7758':
            return output.intercards!();
          case '7759':
            return output.spreadCardinals!();
        }
      },
      outputStrings: {
        getUnder: Outputs.getUnder,
        spreadCardinals: {
          en: 'Spread Cardinals',
        },
        intercards: {
          en: 'Intercards',
          de: 'Interkardinal',
          fr: 'Intercardinal',
          ja: '斜めへ',
          cn: '四角',
          ko: '대각선 쪽으로',
        },
      },
    },
    {
      id: 'ASS Carpet Beater',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '774F', source: 'Silkie' }),
      preRun: (data) => data.beaterCounter++,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          busterOnYou: Outputs.tankBusterOnYou,
          busterOnTarget: Outputs.tankBusterOnPlayer,
          busterOnYouPuffs: {
            en: 'Tank Buster on YOU, East/West Between Puffs ',
          },
        };

        if (matches.target === data.me) {
          if (data.beaterCounter === 2)
            return { alertText: output.busterOnYouPuffs!() };
          return { infoText: output.busterOnYou!() };
        }

        if (data.role !== 'tank' && data.role !== 'healer')
          return;

        return { infoText: output.busterOnTarget!({ player: data.ShortName(matches.target) }) };
      },
    },
    {
      id: 'ASS Total Wash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7750', source: 'Silkie', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + Saignement',
          ja: 'AOE + 出血',
          ko: '전체 공격 + 도트',
        },
      },
    },
    // ---------------- Gladiator of Sil'dih ----------------
    {
      id: 'ASS Flash of Steel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7671', source: 'Gladiator of Sil\'dih', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'ASS Rush of Might Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['765C', '765B'], source: 'Gladiator of Sil\'dih' }),
      preRun: (data, matches) => data.mightCasts.push(matches),
    },
    {
      id: 'ASS Rush of Might 1',
      // Boss casts 765C (12.2s) and 765B (10.2s), twice
      // Gladiator of Mirage casts 7659, 7658, 765A, these target the environment but are not reliable
      // North
      //                East               West
      //   Line 1: (-34.14, -270.14) (-35.86, -270.14)
      //   Line 2: (-39.45, -275.45) (-30.55, -275.45)
      //   Line 3: (-44.75, -280.75) (-25.25, -280.75)
      // South
      //                East               West
      //   Line 1: (-34.14, -271.86) (-35.86, -271.86)
      //   Line 2: (-39.45, -266.55) (-30.55, -266.55)
      //   Line 3: (-44.75, -261.25) (-25.25, -261.25)
      // Center is at (-35, -271)
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['765C', '765B'], source: 'Gladiator of Sil\'dih', capture: false }),
      delaySeconds: 0.1,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.mightCasts.length !== 4)
          return;

        const mirage1 = data.mightCasts[0];
        const unfilteredMirage2 = data.mightCasts[1];
        const unfilteredMirage3 = data.mightCasts[2];

        if (mirage1 === undefined || unfilteredMirage2 === undefined || unfilteredMirage3 === undefined)
          throw new UnreachableCode();

        // Filter for unique
        const mirage2 = (mirage1.x === unfilteredMirage2.x && mirage1.y === unfilteredMirage2.y) ? unfilteredMirage3 : unfilteredMirage2;

        const x1 = parseFloat(mirage1.x);
        const y1 = parseFloat(mirage1.y);
        const x2 = parseFloat(mirage2.x);
        const y2 = parseFloat(mirage2.y);

        const getLine = (x: number) => {
          if ((x > -46 && x < -43) || (x > -27 && x < -24))
            return 3;
          else if ((x > -41 && x < -38) || (x > -32 && x < -29))
            return 2;
          else if (x > -37 && x < -33)
            return 1;
          return x;
        };

        const line1 = getLine(x1);
        const line2 = getLine(x2);
        const line = line1 > line2 ? line1 : line2;

        // Get Intercard and greatest relative x value
        let intercard;
        if (y1 < -271) {
          // Get the x value of farthest north mirage
          const x = y1 < y2 ? x1 : x2;
          intercard = x < -35 ? 'northwest' : 'northeast';
          data.mightDir = 'north';
        } else {
          // Get the x value of farthest south mirage
          const x = y1 > y2 ? x1 : x2;
          intercard = x < -35 ? 'southwest' : 'southeast';
          data.mightDir = 'south';
        }

        let side;
        if ((line1 === 2 && line2 === 3) || line1 === 3 && line2 === 2) {
          // Get side of line for case when one is 2 and one is 3
          if (intercard === 'northwest' || intercard === 'southwest')
            side = 'east';
          else
            side = 'west';
        } else {
          if (intercard === 'northwest' || intercard === 'southwest')
            side = 'west';
          else
            side = 'east';
        }
        return output.text!({ intercard: output[intercard]!(), side: output[side]!(), line: line });
      },
      run: (data) => data.mightCasts = [],
      outputStrings: {
        text: {
          en: '${intercard}, ${side} of line #${line}',
        },
        east: Outputs.east,
        west: Outputs.west,
        northwest: Outputs.northwest,
        northeast: Outputs.northeast,
        southeast: Outputs.southeast,
        southwest: Outputs.southwest,
      },
    },
    {
      id: 'ASS Rush of Might 2',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '765B', source: 'Gladiator of Sil\'dih', capture: false }),
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.mightDir === undefined)
          return output.move!();
        return output.text!({ dir: output[data.mightDir]!() });
      },
      outputStrings: {
        text: {
          en: 'Move ${dir}',
        },
        north: Outputs.north,
        south: Outputs.south,
        move: Outputs.moveAway,
      },
    },
    {
      id: 'ASS Sculptor\'s Passion',
      // This is a wild charge, player in front takes most damage
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6854', source: 'Gladiator of Sil\'dih' }),
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.chargeOnYou!();
        return output.chargeOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        chargeOn: {
          en: 'Charge on ${player}',
          de: 'Ansturm auf ${player}',
          fr: 'Charge sur ${player}',
          ja: '${player}にワイルドチャージ',
          cn: '蓝球点${player}',
          ko: '"${player}" 야성의 돌진 대상',
        },
        chargeOnYou: {
          en: 'Charge on YOU',
          de: 'Ansturm auf DIR',
          fr: 'Charge sur VOUS',
          ja: '自分にワイルドチャージ',
          cn: '蓝球点名',
          ko: '야성의 돌진 대상자',
        },
      },
    },
    {
      id: 'ASS Mighty Smite',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7672', source: 'Gladiator of Sil\'dih' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'ASS Lingering Echoes',
      // CDC Lingering Echoes (Spread + Move)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CDC' }),
      condition: Conditions.targetIsYou(),
      preRun: (data) => data.hasLingering = true,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      response: Responses.moveAway(),
    },
    {
      id: 'ASS Thunderous Echo Collect',
      // CDD Thunderous Echo (Stack)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CDD' }),
      preRun: (data, matches) => data.thunderousEchoPlayer = matches.target,
    },
    {
      id: 'ASS Curse of the Fallen',
      // CDA Echoes of the Fallen (Spread)
      // Two players will not have a second debuff, so check CDA
      // 14s = first
      // 17s = second
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CDA' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.1,
      durationSeconds: 10,
      infoText: (data, matches, output) => {
        if (data.hasLingering)
          return output.spreadThenSpread!();

        const duration = parseFloat(matches.duration);

        // Check if spread first
        if (duration < 16) {
          if (data.me === data.thunderousEchoPlayer)
            return output.spreadThenStackOnYou!();
          if (data.thunderousEchoPlayer === undefined)
            return output.spreadThenStack!();
          return output.spreadThenStackOn!({ player: data.ShortName(data.thunderousEchoPlayer) });
        }

        if (data.me === data.thunderousEchoPlayer)
          return output.stackOnYouThenSpread!();
        if (data.thunderousEchoPlayer === undefined)
          return output.stackThenSpread!();
        return output.stackOnThenSpread!({ player: data.ShortName(data.thunderousEchoPlayer) });
      },
      outputStrings: {
        stackThenSpread: Outputs.stackThenSpread,
        stackOnThenSpread: {
          en: 'Stack on ${player} => Spread',
        },
        stackOnYouThenSpread: {
          en: 'Stack on YOU => Spread',
        },
        spreadThenStack: Outputs.spreadThenStack,
        spreadThenStackOn: {
          en: 'Spread => Stack on ${player}',
        },
        spreadThenStackOnYou: {
          en: 'Spread => Stack on YOU',
        },
        spreadThenSpread: {
          en: 'Spread => Spread',
        },
      },
    },
    {
      id: 'ASS Ring of Might',
      // There are 6 spells:
      //   Ring 1: 765D (9.7s) / 7660 (11.7s)
      //   Ring 2: 765E (9.7s) / 7661 (11.7s)
      //   Ring 3: 765F (9.7s) / 7662 (11.7s)
      // Only tracking the 11.7s spell
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['7660', '7661', '7662'], source: 'Gladiator of Sil\'dih' }),
      infoText: (_data, matches, output) => {
        let ring = 3;
        if (matches.id === '7660')
          ring = 1;
        if (matches.id === '7661')
          ring = 2;
        return output.text!({ ring: ring });
      },
      outputStrings: {
        text: {
          en: 'Outside Ring #${ring}',
        },
      },
    },
    {
      id: 'ASS Echoes of the Fallen Reminder',
      // CDA Echoes of the Fallen (Spread)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CDA' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      response: Responses.spread(),
    },
    {
      id: 'ASS Thunderous Echo Reminder',
      // CDA Thunderous Echo (Stack)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CDD' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      infoText: (data, matches, output) => {
        if (data.hasLingering)
          return output.spread!();
        if (matches.target === data.me)
          return output.stackOnYou!();
        return output.stackOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        spread: Outputs.spread,
        stackOnYou: Outputs.stackOnYou,
        stackOn: Outputs.stackOnPlayer,
      },
    },
    // ---------------- Shadowcaster Zeless Gah ----------------
    {
      id: 'ASS Show of Strength',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '74AF', source: 'Shadowcaster Zeless Gah', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'ASildihn Firesteel Fracture',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '74AD', source: 'Shadowcaster Zeless Gah', capture: false }),
      response: Responses.tankCleave(),
    },
  ],
  timelineReplace: [],
};

export default triggerSet;
