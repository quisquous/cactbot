import { LooseOopsyTrigger } from '../../types/oopsy';

export type MissableBuffType = 'heal' | 'damage' | 'mitigation';

export type MissableEffect = {
  id: string;
  type: MissableBuffType;
  effectId: string | readonly string[];
  collectSeconds: number;
  ignoreSelf?: boolean;
};

export type MissableAbility = {
  id: string;
  type: MissableBuffType;
  abilityId: string | readonly string[];
  collectSeconds?: number;
  ignoreSelf?: boolean;
};

export type MissableBuff = MissableAbility | MissableEffect;

export const missedEffectBuffMap: readonly MissableEffect[] = [
  {
    id: 'Collective Unconscious',
    type: 'mitigation',
    effectId: '351',
    collectSeconds: 20,
  },
  {
    id: 'Passage of Arms',
    type: 'mitigation',
    // Arms Up = 498 (others), Passage Of Arms = 497 (you).  Use both in case everybody is missed.
    effectId: ['497', '498'],
    ignoreSelf: true,
    collectSeconds: 15,
  },
  {
    id: 'Divine Veil',
    type: 'mitigation',
    effectId: '2D7',
    ignoreSelf: true,
    collectSeconds: 2,
  },
] as const;

export const missedAbilityBuffMap: readonly MissableAbility[] = [
  {
    id: 'Heart Of Light',
    type: 'mitigation',
    abilityId: '3F20',
  },
  {
    id: 'Dark Missionary',
    type: 'mitigation',
    abilityId: '4057',
  },
  {
    id: 'Shake It Off',
    type: 'mitigation',
    abilityId: '1CDC',
  },
  {
    id: 'Technical Finish',
    type: 'damage',
    // 3F44 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
    abilityId: ['3F41', '3F42', '3F43', '3F44'],
  },
  {
    id: 'Divination',
    type: 'damage',
    abilityId: '40A8',
  },
  {
    id: 'Brotherhood',
    type: 'damage',
    abilityId: '1CE4',
  },
  {
    id: 'Battle Litany',
    type: 'damage',
    abilityId: 'DE5',
  },
  {
    id: 'Embolden',
    type: 'damage',
    abilityId: '1D60',
  },
  {
    id: 'Battle Voice',
    type: 'damage',
    abilityId: '76',
    ignoreSelf: true,
  },
  {
    id: 'Devotion',
    type: 'damage',
    abilityId: '1D1A',
  },
  {
    id: 'Troubadour',
    type: 'mitigation',
    abilityId: '1CED',
  },
  {
    id: 'Tactician',
    type: 'mitigation',
    abilityId: '41F9',
  },
  {
    id: 'Shield Samba',
    type: 'mitigation',
    abilityId: '3E8C',
  },
  {
    id: 'Mantra',
    type: 'mitigation',
    abilityId: '41',
  },
  {
    // LB1
    id: 'Healing Wind',
    type: 'heal',
    abilityId: 'CE',
  },
  {
    // LB2
    id: 'Breath of the Earth',
    type: 'heal',
    abilityId: 'CF',
  },
  {
    // LB 3
    id: 'Pulse of Life',
    type: 'heal',
    abilityId: 'D0',
  },
  {
    id: 'Medica',
    type: 'heal',
    abilityId: '7C',
  },
  {
    id: 'Medica II',
    type: 'heal',
    abilityId: '85',
  },
  {
    id: 'Afflatus Rapture',
    type: 'heal',
    abilityId: '4096',
  },
  {
    id: 'Temperance',
    type: 'heal',
    abilityId: '751',
  },
  {
    id: 'Plenary Indulgence',
    type: 'heal',
    abilityId: '1D09',
  },
  {
    id: 'Succor',
    type: 'heal',
    abilityId: 'BA',
  },
  {
    id: 'Indomitability',
    type: 'heal',
    abilityId: 'DFF',
  },
  {
    id: 'Deployment Tactics',
    type: 'heal',
    abilityId: 'E01',
  },
  {
    id: 'Whispering Dawn',
    type: 'heal',
    abilityId: '323',
  },
  {
    id: 'Fey Blessing',
    type: 'heal',
    abilityId: '40A0',
  },
  {
    id: 'Consolation',
    type: 'heal',
    abilityId: '40A3',
  },
  {
    id: 'Angel\'s Whisper',
    type: 'heal',
    abilityId: '40A6',
  },
  {
    id: 'Fey Illumination',
    type: 'mitigation',
    abilityId: '325',
  },
  {
    id: 'Seraphic Illumination',
    type: 'mitigation',
    abilityId: '40A7',
  },
  {
    id: 'Angel Feathers',
    type: 'heal',
    abilityId: '1097',
  },
  {
    id: 'Helios',
    type: 'heal',
    abilityId: 'E10',
  },
  {
    id: 'Aspected Helios',
    type: 'heal',
    abilityId: ['E11', '3200'],
  },
  {
    id: 'Celestial Opposition',
    type: 'heal',
    abilityId: '40A9',
  },
  {
    id: 'Astral Stasis',
    type: 'heal',
    abilityId: '1098',
  },
  {
    id: 'White Wind',
    type: 'heal',
    abilityId: '2C8E',
  },
  {
    id: 'Gobskin',
    type: 'heal',
    abilityId: '4780',
  },
  {
    id: 'Lost Aethershield',
    type: 'mitigation',
    abilityId: '5753',
  },
] as const;

export const generateBuffTriggers = (): LooseOopsyTrigger[] => {
  const buffs: MissableBuff[] = [...missedEffectBuffMap, ...missedAbilityBuffMap];
  buffs.sort((a, b) => a.id.localeCompare(b.id));
  return buffs.map((buff) => {
    return {
      id: `Buff ${buff.id}`,
    };
  });
};
