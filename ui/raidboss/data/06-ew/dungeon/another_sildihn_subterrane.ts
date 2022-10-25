import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Silkie specify which puff to get behind in first Slipper Soap
// TODO: Silkie specify where to point puff's tether
// TODO: Silkie call puff to go to for safety
// TODO: Silkie call when to go to boss for safety
// TODO: Better duster handling for Silkie timeline?
// TODO: Additional Gladiator triggers and adjustments to timeline
// TODO: Additional Shadowcaster triggers and adjustments to timeline

export interface Data extends RaidbossData {
  suds?: string;
  soapCounter: number;
  beaterCounter: number;
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
    };
  },
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'ASS Atropine Spore',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7960', source: 'Aqueduct Belladonna', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'ASS Frond Affront',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7961', source: 'Aqueduct Belladonna', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'ASS Deracinator',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7962', source: 'Aqueduct Belladonna' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'ASS Left Sweep',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7964', source: 'Aqueduct Kaluk', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'ASS Right Sweep',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7963', source: 'Aqueduct Kaluk', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'ASS Creeping Ivy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7965', source: 'Aqueduct Kaluk', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'ASS Honeyed Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '795B', source: 'Aqueduct Udumbara', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'ASS Honeyed Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '795C', source: 'Aqueduct Udumbara', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'ASS Honeyed Front',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '795D', source: 'Aqueduct Udumbara', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'ASS Arboreal Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7957', source: 'Aqueduct Dryad', capture: false }),
      response: Responses.getOut(),
    },
    // ---------------- Silkie ----------------
    {
      id: 'ASS Soap\'s Up',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '775A', source: 'Silkie', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cardinals',
        },
      },
    },
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
            return output.getBehindPartyKnockback!();
          return output.getInFrontOfPlayerKnockback!({ player: data.ShortName(matches.target) });
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
    // ---------------- second trash ----------------
    {
      id: 'ASS Infernal Pain',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7969', source: 'Sil\'dihn Dullahan', capture: false }),
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
    {
      id: 'ASS Blighted Gloom',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7966', source: 'Sil\'dihn Dullahan', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'ASS Infernal Weight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '796B', source: 'Aqueduct Armor', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + In',
        },
      },
    },
    {
      id: 'ASS Dominion Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '796A', source: 'Aqueduct Armor', capture: false }),
      response: Responses.getBehind(),
    },
    // ---------------- Gladiator of Sil'dih ----------------
    {
      id: 'ASS Flash of Steel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7671', source: 'Gladiator of Sil\'dih', capture: false }),
      response: Responses.aoe(),
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
        if (matches.id === '7660')
          return output.outsideInner!();
        if (matches.id === '7661')
          return output.outsideMiddle!();
        return output.outsideOuter!();
      },
      outputStrings: {
        outsideInner: {
          en: 'Outside Inner Ring',
        },
        outsideMiddle: {
          en: 'Outside Middle Ring',
        },
        outsideOuter: {
          en: 'Outside Outer Ring',
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
      // CDD Thunderous Echo (Stack)
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
    {
      id: 'ASS Sundered Remainds',
      // Using 7666 Curse of the Monument
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7666', source: 'Gladiator of Sil\'dih', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle, Shiva Circles',
          de: 'In die Mitte, Shiva Kreise',
          fr: 'Allez au milieu, cercles de Shiva',
          ja: 'シヴァの輪っか',
          cn: '中间集合, 九连环',
          ko: '시바 얼음 장판',
        },
      },
    },
    {
      id: 'ASS Curse of the Monument',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7666', source: 'Gladiator of Sil\'dih', capture: false }),
      response: Responses.breakChains(),
    },
    // ---------------- Shadowcaster Zeless Gah ----------------
    {
      id: 'ASS Show of Strength',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '74AF', source: 'Shadowcaster Zeless Gah', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'ASS Firesteel Fracture',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '74AD', source: 'Shadowcaster Zeless Gah' }),
      response: Responses.tankCleave(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Bracing Suds / Fizzling Suds': 'Bracing/Fizzling Suds',
        'Bracing Duster / Fizzling Duster': 'Bracing/Fizzling Duster',
        'Bracing Duster / Chilling Duster / Fizzling Duster': 'Duster',
        'Bracing Suds / Chilling Suds / Fizzling Suds': 'Suds',
      },
    },
  ],
};

export default triggerSet;