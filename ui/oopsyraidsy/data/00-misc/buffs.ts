import NetRegexes from '../../../../resources/netregexes';
import ZoneId from '../../../../resources/zone_id';
import { OopsyData } from '../../../../types/data';
import { NetMatches } from '../../../../types/net_matches';
import { CactbotBaseRegExp } from '../../../../types/net_trigger';
import { OopsyMistakeType, OopsyTriggerGeneric, OopsyTriggerSet } from '../../../../types/oopsy';

type BuffMatches = NetMatches['Ability'] | NetMatches['GainsEffect'];

export interface Data extends OopsyData {
  generalBuffCollection?: { [triggerId: string]: BuffMatches[] };
  petIdToOwnerId?: { [petId: string]: string };
}

// Abilities seem instant.
const abilityCollectSeconds = 0.5;
// Observation: up to ~1.2 seconds for a buff to roll through the party.
const effectCollectSeconds = 2.0;

const isInPartyConditionFunc = (data: Data, matches: BuffMatches) => {
  const sourceId = matches.sourceId.toUpperCase();
  if (data.party.partyIds.includes(sourceId))
    return true;

  if (data.petIdToOwnerId) {
    const ownerId = data.petIdToOwnerId[sourceId];
    if (ownerId && data.party.partyIds.includes(ownerId))
      return true;
  }

  return false;
};

const missedFunc = <T extends 'Ability' | 'GainsEffect'>(args: {
  triggerId: string;
  regexType: T;
  netRegex: CactbotBaseRegExp<T>;
  field: string;
  type: OopsyMistakeType;
  ignoreSelf?: boolean;
  collectSeconds: number;
}): OopsyTriggerGeneric<Data, T>[] => [
  {
    // Sure, not all of these are "buffs" per se, but they're all in the buffs file.
    id: `Buff ${args.triggerId} Collect`,
    type: args.regexType,
    netRegex: args.netRegex,
    condition: isInPartyConditionFunc,
    run: (data, matches) => {
      data.generalBuffCollection ??= {};
      const arr = data.generalBuffCollection[args.triggerId] ??= [];
      arr.push(matches);
    },
  },
  {
    id: `Buff ${args.triggerId}`,
    type: args.regexType,
    netRegex: args.netRegex,
    condition: isInPartyConditionFunc,
    delaySeconds: args.collectSeconds,
    suppressSeconds: args.collectSeconds,
    mistake: (data) => {
      const allMatches = data.generalBuffCollection?.[args.triggerId];
      const firstMatch = allMatches?.[0];
      const thingName = firstMatch?.[args.field];
      if (!allMatches || !firstMatch || !thingName)
        return;

      const partyNames = data.party.partyNames;

      // TODO: consider dead people somehow
      const gotBuffMap: { [name: string]: boolean } = {};
      for (const name of partyNames)
        gotBuffMap[name] = false;

      let sourceName = firstMatch.source;
      // Blame pet mistakes on owners.
      if (data.petIdToOwnerId) {
        const petId = firstMatch.sourceId.toUpperCase();
        const ownerId = data.petIdToOwnerId[petId];
        if (ownerId) {
          const ownerName = data.party.nameFromId(ownerId);
          if (ownerName)
            sourceName = ownerName;
          else
            console.error(`Couldn't find name for ${ownerId} from pet ${petId}`);
        }
      }

      if (args.ignoreSelf)
        gotBuffMap[sourceName] = true;

      for (const matches of allMatches) {
        // In case you have multiple party members who hit the same cooldown at the same
        // time (lol?), then ignore anybody who wasn't the first.
        if (matches.source !== firstMatch.source)
          continue;

        gotBuffMap[matches.target] = true;
      }

      const missed = Object.keys(gotBuffMap).filter((x) => !gotBuffMap[x]);
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
            en: `${thingName} missed ${missed.map((x) => data.ShortName(x)).join(', ')}`,
            de: `${thingName} verfehlt ${missed.map((x) => data.ShortName(x)).join(', ')}`,
            fr: `${thingName} manqué(e) sur ${missed.map((x) => data.ShortName(x)).join(', ')}`,
            ja: `(${missed.map((x) => data.ShortName(x)).join(', ')}) が${thingName}を受けなかった`,
            cn: `${missed.map((x) => data.ShortName(x)).join(', ')} 没受到 ${thingName}`,
            ko: `${thingName} ${missed.map((x) => data.ShortName(x)).join(', ')}에게 적용안됨`,
          },
        };
      }
      // If there's too many people, just list the number of people missed.
      // TODO: we could also list everybody on separate lines?
      return {
        type: args.type,
        blame: sourceName,
        text: {
          en: `${thingName} missed ${missed.length} people`,
          de: `${thingName} verfehlte ${missed.length} Personen`,
          fr: `${thingName} manqué(e) sur ${missed.length} personnes`,
          ja: `${missed.length}人が${thingName}を受けなかった`,
          cn: `有${missed.length}人没受到 ${thingName}`,
          ko: `${thingName} ${missed.length}명에게 적용안됨`,
        },
      };
    },
    run: (data) => {
      if (data.generalBuffCollection)
        delete data.generalBuffCollection[args.triggerId];
    },
  },
];

const missedMitigationBuff = (args: { id: string; effectId: string;
  ignoreSelf?: boolean; collectSeconds?: number; }) => {
  if (!args.effectId)
    console.error('Missing effectId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.gainsEffect({ effectId: args.effectId }),
    regexType: 'GainsEffect',
    field: 'effect',
    type: 'heal',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : effectCollectSeconds,
  });
};

const missedDamageAbility = (args: { id: string; abilityId: string;
  ignoreSelf?: boolean; collectSeconds?: number; }) => {
  if (!args.abilityId)
    console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.ability({ id: args.abilityId }),
    regexType: 'Ability',
    field: 'ability',
    type: 'damage',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds,
  });
};

const missedHeal = (args: { id: string; abilityId: string;
  ignoreSelf?: boolean; collectSeconds?: number; }) => {
  if (!args.abilityId)
    console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: NetRegexes.ability({ id: args.abilityId }),
    regexType: 'Ability',
    field: 'ability',
    type: 'heal',
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds,
  });
};

const missedMitigationAbility = missedHeal;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'Buff Pet To Owner Mapper',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull(),
      run: (data, matches) => {
        if (matches.ownerId === '0')
          return;

        data.petIdToOwnerId ??= {};
        // Fix any lowercase ids.
        data.petIdToOwnerId[matches.id.toUpperCase()] = matches.ownerId.toUpperCase();
      },
    },
    {
      id: 'Buff Pet To Owner Clearer',
      type: 'ChangeZone',
      netRegex: NetRegexes.changeZone(),
      run: (data) => {
        // Clear this hash periodically so it doesn't have false positives.
        data.petIdToOwnerId = {};
      },
    },

    // Prefer abilities to effects, as effects take longer to roll through the party.
    // However, some things are only effects and so there is no choice.

    // For things you can step in or out of, give a longer timer?  This isn't perfect.
    // TODO: include soil here??
    ...missedMitigationBuff({ id: 'Collective Unconscious', effectId: '351', collectSeconds: 10 }),
    // Arms Up = 498 (others), Passage Of Arms = 497 (you).  Use both in case everybody is missed.
    ...missedMitigationBuff({ id: 'Passage of Arms', effectId: '49[78]', ignoreSelf: true, collectSeconds: 10 }),

    ...missedMitigationBuff({ id: 'Divine Veil', effectId: '2D7', ignoreSelf: true }),

    ...missedMitigationAbility({ id: 'Heart Of Light', abilityId: '3F20' }),
    ...missedMitigationAbility({ id: 'Dark Missionary', abilityId: '4057' }),
    ...missedMitigationAbility({ id: 'Shake It Off', abilityId: '1CDC' }),

    // 3F44 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
    ...missedDamageAbility({ id: 'Technical Finish', abilityId: '3F4[1-4]' }),
    ...missedDamageAbility({ id: 'Divination', abilityId: '40A8' }),
    ...missedDamageAbility({ id: 'Brotherhood', abilityId: '1CE4' }),
    ...missedDamageAbility({ id: 'Battle Litany', abilityId: 'DE5' }),
    ...missedDamageAbility({ id: 'Embolden', abilityId: '1D60' }),
    ...missedDamageAbility({ id: 'Battle Voice', abilityId: '76', ignoreSelf: true }),

    // Too noisy (procs every three seconds, and bards often off doing mechanics).
    // missedDamageBuff({ id: 'Wanderer\'s Minuet', effectId: '8A8', ignoreSelf: true }),
    // missedDamageBuff({ id: 'Mage\'s Ballad', effectId: '8A9', ignoreSelf: true }),
    // missedDamageBuff({ id: 'Army\'s Paeon', effectId: '8AA', ignoreSelf: true }),

    ...missedMitigationAbility({ id: 'Troubadour', abilityId: '1CED' }),
    ...missedMitigationAbility({ id: 'Tactician', abilityId: '41F9' }),
    ...missedMitigationAbility({ id: 'Shield Samba', abilityId: '3E8C' }),

    ...missedMitigationAbility({ id: 'Mantra', abilityId: '41' }),

    ...missedDamageAbility({ id: 'Devotion', abilityId: '1D1A' }),

    // Maybe using a healer LB1/LB2 should be an error for the healer. O:)
    // ...missedHeal({ id: 'Healing Wind', abilityId: 'CE' }),
    // ...missedHeal({ id: 'Breath of the Earth', abilityId: 'CF' }),

    ...missedHeal({ id: 'Medica', abilityId: '7C' }),
    ...missedHeal({ id: 'Medica II', abilityId: '85' }),
    ...missedHeal({ id: 'Afflatus Rapture', abilityId: '4096' }),
    ...missedHeal({ id: 'Temperance', abilityId: '751' }),
    ...missedHeal({ id: 'Plenary Indulgence', abilityId: '1D09' }),
    ...missedHeal({ id: 'Pulse of Life', abilityId: 'D0' }),

    ...missedHeal({ id: 'Succor', abilityId: 'BA' }),
    ...missedHeal({ id: 'Indomitability', abilityId: 'DFF' }),
    ...missedHeal({ id: 'Deployment Tactics', abilityId: 'E01' }),
    ...missedHeal({ id: 'Whispering Dawn', abilityId: '323' }),
    ...missedHeal({ id: 'Fey Blessing', abilityId: '40A0' }),
    ...missedHeal({ id: 'Consolation', abilityId: '40A3' }),
    ...missedHeal({ id: 'Angel\'s Whisper', abilityId: '40A6' }),
    ...missedMitigationAbility({ id: 'Fey Illumination', abilityId: '325' }),
    ...missedMitigationAbility({ id: 'Seraphic Illumination', abilityId: '40A7' }),
    ...missedHeal({ id: 'Angel Feathers', abilityId: '1097' }),

    ...missedHeal({ id: 'Helios', abilityId: 'E10' }),
    ...missedHeal({ id: 'Aspected Helios', abilityId: 'E11' }),
    ...missedHeal({ id: 'Aspected Helios', abilityId: '3200' }),
    ...missedHeal({ id: 'Celestial Opposition', abilityId: '40A9' }),
    ...missedHeal({ id: 'Astral Stasis', abilityId: '1098' }),

    ...missedHeal({ id: 'White Wind', abilityId: '2C8E' }),
    ...missedHeal({ id: 'Gobskin', abilityId: '4780' }),

    // TODO: export all of these missed functions into their own helper
    // and then add this to the Delubrum Reginae files directly.
    ...missedMitigationAbility({ id: 'Lost Aethershield', abilityId: '5753' }),
  ],
};

export default triggerSet;
