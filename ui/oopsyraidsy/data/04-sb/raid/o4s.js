import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// O4S - Deltascape 4.0 Savage
export default {
  zoneId: ZoneId.DeltascapeV40Savage,
  damageWarn: {
    'O4S2 Neo Vacuum Wave': '241D',
    'O4S2 Acceleration Bomb': '2431',
    'O4S2 Emptiness': '2422',
  },
  damageFail: {
    'O4S2 Double Laser': '2415',
  },
  triggers: [
    {
      id: 'O4S2 Decisive Battle',
      netRegex: NetRegexes.ability({ id: '2408', capture: false }),
      run: (_e, data) => {
        data.isDecisiveBattleElement = true;
      },
    },
    {
      id: 'O4S1 Vacuum Wave',
      netRegex: NetRegexes.ability({ id: '23FE', capture: false }),
      run: (_e, data) => {
        data.isDecisiveBattleElement = false;
      },
    },
    {
      id: 'O4S2 Almagest',
      netRegex: NetRegexes.ability({ id: '2417', capture: false }),
      run: (_e, data) => {
        data.isNeoExdeath = true;
      },
    },
    {
      id: 'O4S2 Blizzard III',
      damageRegex: '23F8',
      condition: (e, data) => {
        // Ignore unavoidable raid aoe Blizzard III.
        return data.IsPlayerId(e.targetId) && !data.isDecisiveBattleElement;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Thunder III',
      damageRegex: '23FD',
      condition: (e, data) => {
        // Only consider this during random mechanic after decisive battle.
        return data.IsPlayerId(e.targetId) && data.isDecisiveBattleElement;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Petrified',
      netRegex: NetRegexes.gainsEffect({ effectId: '262' }),
      mistake: (_e, data, matches) => {
        // On Neo, being petrified is because you looked at Shriek, so your fault.
        if (data.isNeoExdeath)
          return { type: 'fail', blame: matches.target, text: matches.effect };
        // On normal ExDeath, this is due to White Hole.
        return { type: 'warn', name: matches.target, text: matches.effect };
      },
    },
    {
      id: 'O4S2 Forked Lightning',
      damageRegex: '242E',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      mistake: (e, data) => {
        const text = e.abilityName + ' => ' + data.ShortName(e.targetName);
        return { type: 'fail', blame: e.attackerName, text: text };
      },
    },
    {
      id: 'O4S2 Double Attack',
      damageRegex: '241C',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      collectSeconds: 0.5,
      mistake: (e) => {
        if (e.length <= 2)
          return;
        // Hard to know who should be in this and who shouldn't, but
        // it should never hit 3 people.
        return { type: 'fail', fullText: e[0].abilityName + ' x ' + e.length };
      },
    },
    {
      id: 'O4S2 Beyond Death Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      run: (_e, data, matches) => {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = true;
      },
    },
    {
      id: 'O4S2 Beyond Death Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '566' }),
      run: (_e, data, matches) => {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = false;
      },
    },
    {
      id: 'O4S2 Beyond Death',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_e, data, matches) => {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
  ],
};
