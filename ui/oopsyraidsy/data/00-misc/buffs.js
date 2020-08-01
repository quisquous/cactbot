'use strict';

// Abilities seem instant.
let abilityCollectSeconds = 0.5;
// Observation: up to ~1.2 seconds for a buff to roll through the party.
let effectCollectSeconds = 2.0;

// args: triggerId, netRegex, field, type, ignoreSelf
let missedFunc = (args) => {
  return {
    // Sure, not all of these are "buffs" per se, but they're all in the buffs file.
    id: 'Buff ' + args.triggerId,
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
            ko: thingName + ' 적용되지 않음 : ' + missed.map((x) => data.ShortName(x)).join(', '),
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
          ko: thingName + ' 적용되지 않음 : ' + missed.length + ' 명',
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

[{
  zoneRegex: /.*/,
  zoneId: ZoneId.MatchAll,
  triggers: [

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

    missedMitigationAbility({ id: 'Mantra', abilityId: '41' }),

    // TODO: need a person->pet mapping for blame
    missedDamageAbility({ id: 'Devotion', abilityId: '1D1A' }),

    // Maybe using a healer LB1/LB2 should be an error for the healer. O:)
    // missedHeal({ id: 'Healing Wind', abilityId: 'CE' }),
    // missedHeal({ id: 'Breath of the Earth', abilityId: 'CF' }),

    missedHeal({ id: 'Medica', abilityId: '7C' }),
    missedHeal({ id: 'Medica II', abilityId: '85' }),
    missedHeal({ id: 'Afflatus Rapture', abilityId: '4096' }),
    missedHeal({ id: 'Temperance', abilityId: '751' }),
    missedHeal({ id: 'Plenary Indulgence', abilityId: '1D09' }),
    missedHeal({ id: 'Pulse of Life', abilityId: 'D0' }),

    missedHeal({ id: 'Succor', abilityId: 'BA' }),
    missedHeal({ id: 'Indomitability', abilityId: 'DFF' }),
    missedHeal({ id: 'Deployment Tactics', abilityId: 'E01' }),
    missedHeal({ id: 'Whispering Dawn', abilityId: '323' }),
    // TODO: need a person->pet mapping for these as well
    // because otherwise the fairy is not a party member.
    missedHeal({ id: 'Fey Blessing', abilityId: '40A0' }),
    missedHeal({ id: 'Consolation', abilityId: '40A3' }),
    missedHeal({ id: 'Angel\'s Whisper', abilityId: '40A6' }),
    missedMitigationAbility({ id: 'Fey Illumination', abilityId: '325' }),
    missedMitigationAbility({ id: 'Seraphic Illumination', abilityId: '40A7' }),
    missedHeal({ id: 'Angel Feathers', abilityId: '1097' }),

    missedHeal({ id: 'Helios', abilityId: 'E10' }),
    missedHeal({ id: 'Aspected Helios', abilityId: 'E11' }),
    missedHeal({ id: 'Aspected Helios', abilityId: '3200' }),
    missedHeal({ id: 'Celestial Opposition', abilityId: '40A9' }),
    missedHeal({ id: 'Astral Stasis', abilityId: '1098' }),

    missedHeal({ id: 'White Wind', abilityId: '2C8E' }),
    missedHeal({ id: 'Gobskin', abilityId: '4780' }),
  ],
}];
