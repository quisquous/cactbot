import NetRegexes from '../../../../resources/netregexes';
import ZoneId from '../../../../resources/zone_id';
import { OopsyData } from '../../../../types/data';
import { OopsyTriggerSet } from '../../../../types/oopsy';

type MitTracker = {
  [abilityId: string]: {
    time: number;
    source: string;
  };
};

export interface Data extends OopsyData {
  lostFood?: { [name: string]: boolean };
  raiseTracker?: { [targetId: string]: string };
  targetMitTracker?: {
    [targetId: string]: MitTracker;
  };
  partyMitTracker?: MitTracker;
}

const targetMitAbilityIdToDuration: { [id: string]: number } = {
  '1D6F': 10, // reprisal
  '1D7D': 10, // feint
  'B47': 10, // dismantle
  '1D88': 10, // addle
};
const targetMitAbilityIds = Object.keys(targetMitAbilityIdToDuration);

const partyMitAbilityIdToDuration: { [id: string]: number } = {
  // tanks
  '1CDC': 30, // shake it off
  'DD4': 30, // divine veil
  '4057': 15, // dark missionary
  '3F20': 15, // heart of light
  // healers
  '4098': 20, // temperance
  'BC': 15, // sacred soil
  '650C': 20, // expedient
  '409A': 20, // fey/seraphic illumination (order)
  '5EEA': 15, // kerachole
  '5EF6': 20, // holos
  '5EF7': 15, // panhaima
  // melee
  '41': 15, // mantra
  // ranged
  '1CED': 15, // troubadour
  '1CF0': 15, // nature's minne
  '3E8C': 15, // shield samba
  '41F9': 15, // tactician
  // casters
  '6501': 10, // magick barrier
};
const partyMitAbilityIds = Object.keys(partyMitAbilityIdToDuration);

const shieldEffectIdToAbilityId: { [id: string]: string } = {
  '5B1': '1CDC', // shake it off
  '552': 'DD4', // divine veil
  'D25': '5EF6', // holosakos -> holos
  'A53': '5EF7', // panhaimatinon -> panhaima
};

// General mistakes; these apply everywhere.
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      // Trigger id for internally generated early pull warning.
      id: 'General Early Pull',
      comment: { cn: '抢开' },
    },
    {
      id: 'General Food Buff',
      comment: { cn: '食物消失' },
      type: 'LosesEffect',
      // Well Fed
      netRegex: NetRegexes.losesEffect({ effectId: '30' }),
      condition: (_data, matches) => {
        // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
        return matches.target === matches.source;
      },
      mistake: (data, matches) => {
        data.lostFood ??= {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || data.lostFood[matches.target])
          return;
        data.lostFood[matches.target] = true;
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: 'lost food buff',
            de: 'Nahrungsbuff verloren',
            fr: 'Buff nourriture perdue',
            ja: '飯効果が失った',
            cn: '失去食物BUFF',
            ko: '음식 버프 해제',
          },
        };
      },
    },
    {
      id: 'General Well Fed',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '30' }),
      run: (data, matches) => {
        if (!data.lostFood)
          return;
        delete data.lostFood[matches.target];
      },
    },
    {
      id: 'General Rabbit Medium',
      comment: { cn: '兔印' },
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8E0' }),
      condition: (data, matches) => data.IsPlayerId(matches.sourceId),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.source,
          reportId: matches.sourceId,
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
    {
      id: 'General Double Raise',
      type: 'Ability',
      netRegex: NetRegexes.ability({
        id: ['7D', 'AD', 'E13', '1D63', '5EDF', '478D', '7423', '7426'],
      }),
      // 7D = Raise; AD = Resurrection; E13 = Ascend; 1D63 = Verraise; 5EDF = Egeiro; 478D = BLU; 7423, 7426 = Variant
      mistake: (data, matches) => {
        data.raiseTracker ??= {};
        const lastRaiser = data.raiseTracker[matches.targetId];
        if (lastRaiser !== undefined) {
          return {
            type: 'warn',
            blame: matches.source,
            reportId: matches.sourceId,
            text: {
              en: 'overwrote ' + lastRaiser + '\'s raise',
              de: 'überschrieb ' + lastRaiser + '\'s Wiederbeleben',
              ko: lastRaiser + '의 부활과 겹침',
            },
          };
        }
        data.raiseTracker[matches.targetId] ??= data.ShortName(matches.source);
      },
    },
    {
      id: 'General Raise Cleanup',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '94' }),
      run: (data, matches) => {
        if (data.raiseTracker)
          delete data.raiseTracker[matches.targetId];
      },
    },
    {
      id: 'General Overwritten Mit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: targetMitAbilityIds.concat(partyMitAbilityIds) }),
      mistake: (data, matches) => {
        const isTargetMit = targetMitAbilityIds.includes(matches.id);
        const isPartyMit = partyMitAbilityIds.includes(matches.id);
        if (isTargetMit && matches.targetId === 'E0000000') // missed
          return;
        if (isPartyMit && !data.party.partyIds_.includes(matches.sourceId))
          return;
        if (isPartyMit && matches.targetId !== matches.sourceId)
          return;

        const mitTracker = isTargetMit
          ? ((data.targetMitTracker ??= {})[matches.targetId] ??= {})
          : (data.partyMitTracker ??= {});
        const newTime = new Date(matches.timestamp).getTime();
        const newSource = data.ShortName(matches.source);
        const lastTime = mitTracker[matches.id]?.time;
        const lastSource = mitTracker[matches.id]?.source;

        mitTracker[matches.id] = {
          time: newTime,
          source: newSource,
        };

        const duration = isTargetMit
          ? targetMitAbilityIdToDuration[matches.id]
          : partyMitAbilityIdToDuration[matches.id];
        if (lastTime !== undefined && lastSource !== undefined && duration !== undefined) {
          const diff = newTime - lastTime;
          const leeway =
            (duration * 1000 - diff) > data.options.MinimumTimeForOverwrittenMit * 1000;
          if (diff < duration * 1000 && leeway) {
            return {
              type: 'heal',
              blame: matches.source,
              reportId: matches.sourceId,
              text: {
                en: 'overwrote ' + lastSource + '\'s ' + matches.ability,
              },
            };
          }
        }
      },
    },
    {
      id: 'General Shield Removal',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: Object.keys(shieldEffectIdToAbilityId) }),
      run: (data, matches) => {
        const abilityId = shieldEffectIdToAbilityId[matches.effectId];
        if (abilityId !== undefined)
          delete (data.partyMitTracker ??= {})?.[abilityId];
      },
    },
  ],
};

export default triggerSet;
