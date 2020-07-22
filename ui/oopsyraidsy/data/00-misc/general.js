'use strict';

// Abilities seem instant.
let abilityCollectSeconds = 0.5;
// Observation: up to ~1.2 seconds for a buff to roll through the party.
let effectCollectSeconds = 2.0;

// args: triggerId, netRegex, field, type, ignoreSelf
let missedFunc = (args) => {
  return {
    id: args.triggerId,
    netRegex: args.netRegex,
    condition: function(evt, data, matches) {
      return data.party.partyNames.includes(matches.source);
    },
    collectSeconds: args.collectSeconds,
    mistake: function(allEvents, data, allMatches) {
      let partyNames = data.party.partyNames;

      // TODO: consider dead people somehow
      let gotBuffMap = {};
      for (let name of partyNames)
        gotBuffMap[name] = false;

      const sourceName = allMatches[0].source;
      if (args.ignoreSelf)
        gotBuffMap[sourceName] = true;

      const thingName = allMatches[0][args.field];
      for (let matches of allMatches) {
        // In case you have multiple party members who hit the same cooldown at the same
        // time (lol?), then ignore anybody who wasn't the first.
        if (matches.source !== sourceName)
          continue;

        gotBuffMap[matches.target] = true;
      }

      let missed = Object.keys(gotBuffMap).filter((x) => !gotBuffMap[x]);
      if (missed.length === 0)
        return;

      // TODO: oopsy could really use mouseover popups for details.
      // TODO: alternatively, if we have a death report, it'd be good to
      // explicitly call out that other people got a heal this person didn't.
      if (missed.length < 4) {
        return {
          type: args.type,
          blame: sourceName,
          text: {
            en: thingName + ' missed ' + missed.map((x) => data.ShortName(x)).join(', '),
            de: thingName + ' verfehlt ' + missed.map((x) => data.ShortName(x)).join(', '),
            fr: thingName + ' manqué(e) sur ' + missed.map((x) => data.ShortName(x)).join(', '),
            cn: thingName + ' 没奶到 ' + missed.map((x) => data.ShortName(x)).join(', '),
          },
        };
      }
      // If there's too many people, just list the number of people missed.
      // TODO: we could also list everybody on separate lines?
      return {
        type: args.type,
        blame: sourceName,
        text: {
          en: thingName + ' missed ' + missed.length + ' people',
          de: thingName + ' verfehlte ' + missed.length + ' Personen',
          fr: thingName + ' manqué(e) sur ' + missed.length + ' personnes',
          cn: thingName + ' 没奶到 ' + missed.length + ' 人',
        },
      };
    },
  };
};

let missedMitigationBuff = (args) => {
  if (!args.effectId)
    console.error('Missing effectId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.gainsEffect({ effectId: args.effectId }),
    field: 'effect',
    type: 'heal',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : effectCollectSeconds,
  });
};

let missedDamageBuff = (args) => {
  if (!args.effectId)
    console.error('Missing effectId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.gainsEffect({ effectId: args.effectId }),
    field: 'effect',
    type: 'damage',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : effectCollectSeconds,
  });
};

let missedDamageAbility = (args) => {
  if (!args.abilityId)
    console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.ability({ id: args.abilityId }),
    field: 'ability',
    type: 'damage',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds,
  });
};

let missedHeal = (args) => {
  if (!args.abilityId)
    console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.ability({ id: args.abilityId }),
    field: 'ability',
    type: 'heal',
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds,
  });
};

let missedMitigationAbility = missedHeal;

// General mistakes; these apply everywhere.
[{
  zoneRegex: /.*/,
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      // Trigger id for internally generated early pull warning.
      id: 'General Early Pull',
    },
    {
      id: 'General Food Buff',
      losesEffectRegex: gLang.kEffect.WellFed,
      condition: function(e, data) {
        // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
        return e.targetName == e.attackerName;
      },
      mistake: function(e, data) {
        data.lostFood = data.lostFood || {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || data.lostFood[e.targetName])
          return;
        data.lostFood[e.targetName] = true;
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'lost food buff',
            de: 'Nahrungsbuff verloren',
            fr: 'Buff nourriture terminée',
            cn: '失去食物BUFF',
            ko: '음식 버프 해제',
          },
        };
      },
    },
    {
      id: 'General Well Fed',
      gainsEffectRegex: gLang.kEffect.WellFed,
      run: function(e, data) {
        if (!data.lostFood)
          return;
        delete data.lostFood[e.targetName];
      },
    },
    {
      id: 'General Rabbit Medium',
      abilityRegex: '8E0',
      condition: function(e, data) {
        return data.IsPlayerId(e.attackerId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.attackerName,
          text: {
            en: 'bunny',
            de: 'Hase',
            fr: 'lapin',
            ja: 'うさぎ',
            cn: '兔子',
            ko: '토끼',
          },
        };
      },
    },

    // Prefer abilities to effects, as effects take longer to roll through the party.
    // However, some things are only effects and so there is no choice.

    // For things you can step in or out of, give a longer timer?  This isn't perfect.
    // TODO: include soil here??
    missedMitigationBuff({ id: 'Collective Unconscious', effectId: '351', collectSeconds: 10 }),
    missedMitigationBuff({ id: 'Passage of Arms', effectId: '498', ignoreSelf: true, collectSeconds: 10 }),

    missedMitigationBuff({ id: 'Divine Veil', effectId: '2D7', ignoreSelf: true }),

    missedMitigationAbility({ id: 'Heart Of Light', abilityId: '3F20' }),
    missedMitigationAbility({ id: 'Dark Missionary', abilityId: '4057' }),
    missedMitigationAbility({ id: 'Shake It Off', abilityId: '1CDC' }),

    // 3F44 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
    missedDamageAbility({ id: 'Technical Finish', abilityId: '3F4[1-4]' }),
    missedDamageAbility({ id: 'Divination', abilityId: '40A8' }),
    missedDamageAbility({ id: 'Brotherhood', abilityId: '1CE4' }),
    missedDamageAbility({ id: 'Battle Litany', abilityId: 'DE5' }),
    missedDamageAbility({ id: 'Embolden', abilityId: '1D60' }),
    missedDamageAbility({ id: 'Battle Voice', abilityId: '76', ignoreSelf: true }),

    // Too noisy (procs every three seconds, and bards often off doing mechanics).
    // missedDamageBuff({ id: 'Wanderer\'s Minuet', effectId: '8A8', ignoreSelf: true }),
    // missedDamageBuff({ id: 'Mage\'s Ballad', effectId: '8A9', ignoreSelf: true }),
    // missedDamageBuff({ id: 'Army\'s Paeon', effectId: '8AA', ignoreSelf: true }),

    missedMitigationAbility({ id: 'Troubadour', abilityId: '1CED' }),
    missedMitigationAbility({ id: 'Tactician', abilityId: '41F9' }),
    missedMitigationAbility({ id: 'Shield Samba', abilityId: '3E8C' }),

    // TODO: need a person->pet mapping for blame
    missedDamageAbility({ id: 'Devotion', abilityId: '1D1A' }),

    missedHeal({ id: 'Medica', abilityId: '7C' }),
    missedHeal({ id: 'Medica II', abilityId: '85' }),
    missedHeal({ id: 'Afflatus Rapture', abilityId: '4096' }),
    missedHeal({ id: 'Temperance', abilityId: '751' }),
    missedHeal({ id: 'Plenary Indulgence', abilityId: '1D09' }),

    missedHeal({ id: 'Succor', abilityId: 'BA' }),
    missedHeal({ id: 'Indomitability', abilityId: 'DFF' }),
    missedHeal({ id: 'Deployment Tactics', abilityId: 'E01' }),
    missedHeal({ id: 'Whispering Dawn', abilityId: '323' }),
    missedHeal({ id: 'Fey Blessing', abilityId: '409F' }),
    missedHeal({ id: 'Consolation', abilityId: '40A3' }),
    missedHeal({ id: 'Angel\'s Whisper', abilityId: '40A6' }),

    missedHeal({ id: 'Helios', abilityId: 'E10' }),
    missedHeal({ id: 'Aspected Helios', abilityId: 'E11' }),
    missedHeal({ id: 'Aspected Helios', abilityId: '3200' }),
    missedHeal({ id: 'Celestial Opposition', abilityId: '40A9' }),
  ],
}];
