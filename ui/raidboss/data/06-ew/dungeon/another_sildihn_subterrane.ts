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
// TODO: Silkie cleanup timeline
// TODO: Gladiator triggers and timeline to enrage
// TODO: Shadowcaster triggers and timeline to enrage

export interface Data extends RaidbossData {
  suds?: string;
  soapCounter: number;
  beaterCounter: number;
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
    // ---------------- Silkie ----------------
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
      // Only first,
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
      id: 'ASS Dust Bluster',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '776C', source: 'Silkie', capture: false }),
      response: Responses.knockback(),
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
    // ---------------- Shadowcaster Zeless Gah ----------------
    {
      id: 'ASS Show of Strength',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '74AF', source: 'Shadowcaster Zeless Gah', capture: false }),
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [],
};

export default triggerSet;
