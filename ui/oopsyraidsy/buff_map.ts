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
    // AST
    id: 'Collective Unconscious',
    type: 'mitigation',
    effectId: '351',
    collectSeconds: 20,
  },
  {
    // PLD
    id: 'Passage of Arms',
    type: 'mitigation',
    // Arms Up = 498 (others), Passage Of Arms = 497 (you).  Use both in case everybody is missed.
    effectId: ['497', '498'],
    ignoreSelf: true,
    collectSeconds: 15,
  },
  {
    // PLD
    id: 'Divine Veil',
    type: 'mitigation',
    // TODO: 552 is 6.4, remove 2D7 once everything is on 6.4
    // TODO: veil now applies to the paladin in ... 6.3?
    effectId: ['2D7', '552'],
    ignoreSelf: true,
    collectSeconds: 2,
  },
  {
    // RPR heal
    id: 'Crest of Time Returned',
    type: 'heal',
    effectId: 'A26',
    collectSeconds: 2,
  },
  {
    // DNC channeled heal
    id: 'Improvisation',
    type: 'heal',
    effectId: 'A87',
    collectSeconds: 15,
  },
] as const;

export const missedAbilityBuffMap: readonly MissableAbility[] = [
  {
    // tank LB1
    id: 'Shield Wall',
    type: 'mitigation',
    abilityId: 'C5',
  },
  {
    // tank LB2
    id: 'Stronghold',
    type: 'mitigation',
    abilityId: 'C6',
  },
  {
    // PLD LB3
    id: 'Last Bastion',
    type: 'mitigation',
    abilityId: 'C7',
  },
  {
    // WAR LB3
    id: 'Land Waker',
    type: 'mitigation',
    abilityId: '1090',
  },
  {
    // DRK LB3
    id: 'Dark Force',
    type: 'mitigation',
    abilityId: '1091',
  },
  {
    // GNB LB3
    id: 'Gunmetal Soul',
    type: 'mitigation',
    abilityId: '42D1',
  },
  {
    // GNB
    id: 'Heart Of Light',
    type: 'mitigation',
    abilityId: '3F20',
  },
  {
    // DRK
    id: 'Dark Missionary',
    type: 'mitigation',
    abilityId: '4057',
  },
  {
    // WAR
    id: 'Shake It Off',
    type: 'mitigation',
    abilityId: '1CDC',
  },
  {
    // DNC
    id: 'Technical Finish',
    type: 'damage',
    // 81C2 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
    // TODO: pre-6.4, these were the abilityIds, but there's no backwards compat support here
    // See: https://github.com/quisquous/cactbot/issues/5415
    // abilityId: ['3F41', '3F42', '3F43', '3F44'],
    abilityId: ['81BF', '81C0', '81C1', '81C2'],
  },
  {
    // DNC channeled shield
    id: 'Improvised Finish',
    type: 'mitigation',
    abilityId: '64BD',
  },
  {
    // DNC AoE heal (same ID from DNC and partner)
    id: 'Curing Waltz',
    type: 'heal',
    abilityId: '3E8F',
  },
  {
    // AST
    id: 'Divination',
    type: 'damage',
    abilityId: '40A8',
  },
  {
    // MNK
    id: 'Brotherhood',
    type: 'damage',
    abilityId: '1CE4',
  },
  {
    // DRG
    id: 'Battle Litany',
    type: 'damage',
    abilityId: 'DE5',
  },
  {
    // RDM
    id: 'Embolden',
    type: 'damage',
    abilityId: '1D60',
  },
  {
    // BRD
    id: 'Battle Voice',
    type: 'damage',
    abilityId: '76',
    // TODO: remove this line after 5.x is not supported anymore.
    // Technically Battle Voice can't miss the bard itself, so this is a noop in 6.x.
    ignoreSelf: true,
  },
  {
    // BRD
    id: 'Radiant Finale',
    type: 'damage',
    abilityId: '64B9',
  },
  {
    // BRD
    id: 'Nature\'s Minne',
    type: 'heal',
    abilityId: '1CF0',
  },
  {
    // SMN (5.x ability, removed in Endwalker)
    id: 'Devotion',
    type: 'damage',
    abilityId: '1D1A',
  },
  {
    // SMN
    id: 'Searing Light',
    type: 'damage',
    // TODO: 64C9 is 6.4, remove 64F2 once everything is on 6.4
    abilityId: ['64F2', '64C9'],
  },
  {
    // RPR
    id: 'Arcane Circle',
    type: 'damage',
    abilityId: '5F55',
  },
  {
    // BRD
    id: 'Troubadour',
    type: 'mitigation',
    abilityId: '1CED',
  },
  {
    // MCH
    id: 'Tactician',
    type: 'mitigation',
    abilityId: '41F9',
  },
  {
    // DNC
    id: 'Shield Samba',
    type: 'mitigation',
    abilityId: '3E8C',
  },
  {
    // RDM
    id: 'Magick Barrier',
    type: 'mitigation',
    abilityId: '6501',
  },
  {
    // MNK
    id: 'Mantra',
    type: 'heal',
    abilityId: '41',
  },
  {
    // heal LB1
    id: 'Healing Wind',
    type: 'heal',
    abilityId: 'CE',
  },
  {
    // heal LB2
    id: 'Breath of the Earth',
    type: 'heal',
    abilityId: 'CF',
  },
  {
    // WHM LB3
    id: 'Pulse of Life',
    type: 'heal',
    abilityId: 'D0',
  },
  {
    // SGE LB3
    id: 'Techne Makre',
    type: 'heal',
    abilityId: '611B',
  },
  {
    // SMN phoenix heal
    id: 'Everlasting Flight',
    type: 'heal',
    abilityId: '4085',
  },
  {
    // WHM
    id: 'Medica',
    type: 'heal',
    abilityId: '7C',
  },
  {
    // WHM
    id: 'Medica II',
    type: 'heal',
    abilityId: '85',
  },
  {
    // WHM
    id: 'Cure III',
    type: 'heal',
    abilityId: '83',
  },
  {
    // WHM (same ID for damage component)
    id: 'Assize',
    type: 'heal',
    abilityId: 'DF3',
  },
  {
    // WHM
    id: 'Afflatus Rapture',
    type: 'heal',
    abilityId: '4096',
  },
  {
    // WHM
    id: 'Temperance',
    type: 'mitigation',
    abilityId: '751',
  },
  {
    // WHM
    id: 'Plenary Indulgence',
    type: 'heal',
    abilityId: '1D09',
  },
  {
    // WHM
    // 6507 heal on tick
    // 6508 heal on expire
    id: 'Liturgy of the Bell',
    type: 'heal',
    abilityId: ['6507', '6508'],
  },
  {
    // SCH
    id: 'Succor',
    type: 'mitigation',
    abilityId: 'BA',
  },
  {
    // SCH
    id: 'Indomitability',
    type: 'heal',
    abilityId: 'DFF',
  },
  {
    // SCH
    id: 'Deployment Tactics',
    type: 'mitigation',
    abilityId: 'E01',
  },
  {
    // SCH
    id: 'Whispering Dawn',
    type: 'heal',
    abilityId: '323',
  },
  {
    // SCH
    id: 'Fey Blessing',
    type: 'heal',
    abilityId: '40A0',
  },
  {
    // SCH
    id: 'Consolation',
    type: 'mitigation',
    abilityId: '40A3',
  },
  {
    // SCH
    id: 'Angel\'s Whisper',
    type: 'heal',
    abilityId: '40A6',
  },
  {
    // SCH
    id: 'Fey Illumination',
    type: 'mitigation',
    abilityId: '325',
  },
  {
    // SCH
    id: 'Seraphic Illumination',
    type: 'mitigation',
    abilityId: '40A7',
  },
  {
    // SCH
    // Technically the mitigation is "Desperate Measures", but it comes from
    // the Expedient ability on each player and "Expedience" is the haste buff.
    id: 'Expedient',
    type: 'mitigation',
    abilityId: '650C',
  },
  {
    // SGE
    id: 'Kerachole',
    type: 'mitigation',
    abilityId: '5EEA',
  },
  {
    // SGE
    id: 'Panhaima',
    type: 'mitigation',
    abilityId: '5EF7',
  },
  {
    // SCH LB3
    id: 'Angel Feathers',
    type: 'heal',
    abilityId: '1097',
  },
  {
    // AST
    id: 'Helios',
    type: 'heal',
    abilityId: 'E10',
  },
  {
    // AST
    id: 'Aspected Helios',
    type: 'heal',
    abilityId: ['E11', '3200'],
  },
  {
    // AST
    id: 'Celestial Opposition',
    type: 'heal',
    abilityId: '40A9',
  },
  {
    // AST
    id: 'Stellar Burst',
    type: 'heal',
    abilityId: '1D10',
  },
  {
    // AST
    id: 'Stellar Explosion',
    type: 'heal',
    abilityId: '1D11',
  },
  {
    // AST
    // 40AD initial application
    // 40AE cure on manual trigger
    // same IDs for Horoscope Helios
    id: 'Horoscope',
    type: 'heal',
    abilityId: ['40AD', '40AE'],
  },
  {
    // AST
    id: 'Macrocosmos',
    type: 'heal',
    abilityId: '6512',
  },
  {
    // AST
    id: 'Microcosmos',
    type: 'heal',
    abilityId: '6513',
  },
  {
    // AST
    id: 'Lady of Crowns',
    type: 'heal',
    abilityId: '1D15',
  },
  {
    // AST LB3
    id: 'Astral Stasis',
    type: 'heal',
    abilityId: '1098',
  },
  {
    // SGE
    id: 'Prognosis',
    type: 'heal',
    abilityId: '5EDE',
  },
  {
    // SGE
    id: 'Physis',
    type: 'heal',
    abilityId: '5EE0',
  },
  {
    // SGE
    id: 'Eukrasian Prognosis',
    type: 'mitigation',
    abilityId: '5EE4',
  },
  {
    // SGE
    id: 'Ixochole',
    type: 'heal',
    abilityId: '5EEB',
  },
  {
    // SGE
    id: 'Pepsis',
    type: 'heal',
    abilityId: '5EED',
  },
  {
    // SGE
    id: 'Physis II',
    type: 'heal',
    abilityId: '5EEE',
  },
  {
    // SGE
    id: 'Holos',
    type: 'mitigation',
    abilityId: '5EF6',
  },
  {
    // SGE
    id: 'Pneuma',
    type: 'heal',
    // 5EFE on enemies, and 6CB6 on friendlies.
    abilityId: '6CB6',
  },
  {
    // BLU
    id: 'White Wind',
    type: 'heal',
    abilityId: '2C8E',
  },
  {
    // BLU
    id: 'Gobskin',
    type: 'mitigation',
    abilityId: '4780',
  },
  {
    // BLU
    id: 'Exuviation',
    type: 'heal',
    abilityId: '478E',
  },
  {
    // BLU (only heals in heal mimic)
    id: 'Stotram',
    type: 'heal',
    abilityId: '5B78',
  },
  {
    // BLU
    id: 'Angel\'s Snack',
    type: 'heal',
    abilityId: '5AE8',
  },
  {
    // Bozja
    id: 'Lost Aethershield',
    type: 'mitigation',
    abilityId: '5753',
  },
] as const;

export const generateBuffTriggerIds = (): string[] => {
  const buffs: MissableBuff[] = [...missedEffectBuffMap, ...missedAbilityBuffMap];
  buffs.sort((a, b) => a.id.localeCompare(b.id));
  return buffs.map((buff) => `Buff ${buff.id}`);
};
