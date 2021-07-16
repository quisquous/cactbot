import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields, kFlagInstantDeath } from '../../../oopsy_common';

export interface Data extends OopsyData {
  hasDoom?: { [name: string]: boolean };
}

// UCU - The Unending Coil Of Bahamut (Ultimate)
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  damageFail: {
    'UCU Lunar Dynamo': '26BC',
    'UCU Iron Chariot': '26BB',
    'UCU Exaflare': '26EF',
    'UCU Wings Of Salvation': '26CA',
  },
  triggers: [
    {
      id: 'UCU Twister Death',
      type: 'Ability',
      // Instant death has a special flag value, differentiating
      // from the explosion damage you take when somebody else
      // pops one.
      netRegex: NetRegexes.abilityFull({ id: '26AB', ...playerDamageFields, flags: kFlagInstantDeath }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: 'Twister Pop',
            de: 'Wirbelsturm berührt',
            fr: 'Apparition des tornades',
            ja: 'ツイスター',
            cn: '旋风',
            ko: '회오리 밟음',
          },
        };
      },
    },
    {
      id: 'UCU Thermionic Burst',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '26B9', ...playerDamageFields }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: 'Pizza Slice',
            de: 'Pizzastück',
            fr: 'Parts de pizza',
            ja: 'サーミオニックバースト',
            cn: '天崩地裂',
            ko: '장판에 맞음',
          },
        };
      },
    },
    {
      id: 'UCU Chain Lightning',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '26C8', ...playerDamageFields }),
      mistake: (_data, matches) => {
        // It's hard to assign blame for lightning.  The debuffs
        // go out and then explode in order, but the attacker is
        // the dragon and not the player.
        return {
          type: 'warn',
          name: matches.target,
          text: {
            en: 'hit by lightning',
            de: 'vom Blitz getroffen',
            fr: 'frappé(e) par la foudre',
            ja: 'チェインライトニング',
            cn: '雷光链',
            ko: '번개 맞음',
          },
        };
      },
    },
    {
      id: 'UCU Burns',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'FA' }),
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'UCU Sludge',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '11F' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'UCU Doom Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      run: (data, matches) => {
        data.hasDoom ??= {};
        data.hasDoom[matches.target] = true;
      },
    },
    {
      id: 'UCU Doom Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'D2' }),
      run: (data, matches) => {
        data.hasDoom ??= {};
        data.hasDoom[matches.target] = false;
      },
    },
    {
      // There is no callout for "you forgot to clear doom".  The logs look
      // something like this:
      //   [20:02:30.564] 1A:Okonomi Yaki gains the effect of Doom from  for 6.00 Seconds.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Protect from Tako Yaki.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Doom from .
      //   [20:02:38.525] 19:Okonomi Yaki was defeated by Firehorn.
      // In other words, doom effect is removed +/- network latency, but can't
      // tell until later that it was a death.  Arguably, this could have been a
      // close-but-successful clearing of doom as well.  It looks the same.
      // Strategy: if you haven't cleared doom with 1 second to go then you probably
      // died to doom.  You can get non-fatally iceballed or auto'd in between,
      // but what can you do.
      id: 'UCU Doom Death',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
      deathReason: (data, matches) => {
        if (!data.hasDoom || !data.hasDoom[matches.target])
          return;
        let text;
        const duration = parseFloat(matches.duration);
        if (duration < 9)
          text = matches.effect + ' #1';
        else if (duration < 14)
          text = matches.effect + ' #2';
        else
          text = matches.effect + ' #3';
        return { name: matches.target, text: text };
      },
    },
  ],
};

export default triggerSet;
