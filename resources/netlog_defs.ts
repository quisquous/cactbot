// canAnonymize: boolean whether this line can be anonymized
// playerIds: map of indexes from a player id to the index of that player name
// isUnknown: needs more information, never seen this log
// optionalFields: a list of fields that are ok to not appear (or have invalid ids)
// firstUnknownField: fields at this index and beyond are cleared, when anonymizing
// globalInclude: include all of these lines in any split
// lastInclude: include the last line of this type in any split

export type LogDefinition = {
  type: string;
  name: string;
  globalInclude?: boolean;
  lastInclude?: boolean;
  canAnonymize?: boolean;
  isUnknown?: boolean;
  fields?: { [fieldName: string]: number };
  subFields?: {
    [fieldName: string]: {
      [fieldValue: string]: {
        name: string;
        canAnonymize: boolean;
      };
    };
  };
  playerIds?: { [fieldIdx: number]: number | null };
};
export type LogDefinitionMap = { [name: string]: LogDefinition };

const logDefinitions = {
  GameLog: {
    type: '00',
    name: 'GameLog',
    fields: {
      type: 0,
      timestamp: 1,
      code: 2,
      name: 3,
      line: 4,
    },
    subFields: {
      code: {
        '0039': {
          name: 'message',
          canAnonymize: true,
        },
        '0038': {
          name: 'echo',
          canAnonymize: true,
        },
        '0044': {
          name: 'dialog',
          canAnonymize: true,
        },
        '0839': {
          name: 'message',
          canAnonymize: true,
        },
      },
    },
  },
  ChangeZone: {
    type: '01',
    name: 'ChangeZone',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
    },
    lastInclude: true,
    canAnonymize: true,
  },
  ChangedPlayer: {
    type: '02',
    name: 'ChangePrimaryPlayer',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
    },
    playerIds: {
      2: 3,
    },
    lastInclude: true,
    canAnonymize: true,
  },
  AddedCombatant: {
    type: '03',
    name: 'AddCombatant',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      job: 4,
      level: 5,
      ownerId: 6,
      worldId: 7,
      world: 8,
      npcNameId: 9,
      npcBaseId: 10,
      currentHp: 11,
      hp: 12,
      currentMp: 13,
      mp: 14,
      // maxTp: 15,
      // tp: 16,
      x: 17,
      y: 18,
      z: 19,
      heading: 20,
    },
    playerIds: {
      2: 3,
      6: null,
    },
    canAnonymize: true,
  },
  RemovedCombatant: {
    type: '04',
    name: 'RemoveCombatant',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      job: 4,
      level: 5,
      owner: 6,
      world: 8,
      npcNameId: 9,
      npcBaseId: 10,
      hp: 12,
      x: 17,
      y: 18,
      z: 19,
      heading: 20,
    },
    playerIds: {
      2: 3,
      6: null,
    },
    canAnonymize: true,
  },
  addBuff: {
    type: '05',
    name: 'AddBuff',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  removeBuff: {
    type: '06',
    name: 'RemoveBuff',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  flyingText: {
    type: '07',
    name: 'FlyingText',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  outgoingAbility: {
    type: '08',
    name: 'OutgoingAbility',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  incomingAbility: {
    type: '09',
    name: 'IncomingAbility',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  partyList: {
    type: '11',
    name: 'PartyList',
    fields: {
      type: 0,
      timestamp: 1,
      partyCount: 2,
      id0: 3,
      id1: 4,
      id2: 5,
      id3: 6,
      id4: 7,
      id5: 8,
      id6: 9,
      id7: 10,
      id8: 11,
      id9: 12,
      id10: 13,
      id11: 14,
      id12: 15,
      id13: 16,
      id14: 17,
      id15: 18,
      id16: 19,
      id17: 20,
      id18: 21,
      id19: 22,
      id20: 23,
      id21: 24,
      id22: 25,
      id23: 26,
    },
    playerIds: {
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
      11: null,
      12: null,
      13: null,
      14: null,
      15: null,
      16: null,
      17: null,
      18: null,
      19: null,
      20: null,
      21: null,
      22: null,
      23: null,
      24: null,
      25: null,
      26: null,
    },
    optionalFields: [
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
    ],
    canAnonymize: true,
    lastInclude: true,
  },
  PlayerStats: {
    type: '12',
    name: 'PlayerStats',
    fields: {
      type: 0,
      timestamp: 1,
      job: 2,
      strength: 3,
      dexterity: 4,
      vitality: 5,
      intelligence: 6,
      mind: 7,
      piety: 8,
      attackPower: 9,
      directHit: 10,
      criticalHit: 11,
      attackMagicPotency: 12,
      healMagicPotency: 13,
      determination: 14,
      skillSpeed: 15,
      spellSpeed: 16,
      tenacity: 18,
    },
    canAnonymize: true,
    lastInclude: true,
  },
  combatantHP: {
    type: '13',
    name: 'CombatantHP',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  StartsUsing: {
    type: '20',
    name: 'NetworkStartsCasting',
    fields: {
      type: 0,
      timestamp: 1,
      sourceId: 2,
      source: 3,
      id: 4,
      ability: 5,
      targetId: 6,
      target: 7,
      castTime: 8,
      x: 9,
      y: 10,
      z: 11,
      heading: 12,
    },
    optionalFields: [6],
    playerIds: {
      2: 3,
      6: 7,
    },
    canAnonymize: true,
  },
  Ability: {
    type: '21',
    name: 'NetworkAbility',
    fields: {
      type: 0,
      timestamp: 1,
      sourceId: 2,
      source: 3,
      id: 4,
      ability: 5,
      targetId: 6,
      target: 7,
      flags: 8,
      damage: 9,
      targetCurrentHp: 24,
      targetMaxHp: 25,
      targetCurrentMp: 26,
      targetMaxMp: 27,
      // targetCurrentTp: 28,
      // targetMaxTp: 29,
      targetX: 30,
      targetY: 31,
      targetZ: 32,
      targetHeading: 33,
      currentHp: 34,
      maxHp: 35,
      currentMp: 36,
      maxMp: 37,
      // currentTp: 38;
      // maxTp: 39;
      x: 40,
      y: 41,
      z: 42,
      heading: 43,
    },
    playerIds: {
      2: 3,
      6: 7,
    },
    optionalFields: [6],
    firstUnknownField: 44,
    canAnonymize: true,
  },
  networkAOEAbility: {
    type: '22',
    name: 'NetworkAOEAbility',
    fields: {
      type: 0,
      timestamp: 1,
      sourceId: 2,
      source: 3,
      id: 4,
      ability: 5,
      targetId: 6,
      target: 7,
      flags: 8,
      x: 40,
      y: 41,
      z: 42,
      heading: 43,
    },
    playerIds: {
      2: 3,
      6: 7,
    },
    optionalFields: [6],
    firstUnknownField: 44,
    canAnonymize: true,
  },
  networkCancelAbility: {
    type: '23',
    name: 'NetworkCancelAbility',
    fields: {
      type: 0,
      timestamp: 1,
      sourceId: 2,
      source: 3,
      id: 4,
      name: 5,
      reason: 6,
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
  },
  networkDoT: {
    type: '24',
    name: 'NetworkDoT',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      which: 4,
      effectId: 5,
      damage: 6,
      currentHp: 7,
      maxHp: 8,
      currentMp: 9,
      maxMp: 10,
      // currentTp: 11,
      // maxTp: 12,
      x: 13,
      y: 14,
      z: 15,
      heading: 16,
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
  },
  WasDefeated: {
    type: '25',
    name: 'NetworkDeath',
    fields: {
      type: 0,
      timestamp: 1,
      targetId: 2,
      target: 3,
      sourceId: 4,
      source: 5,
    },
    playerIds: {
      2: 3,
      4: 5,
    },
    canAnonymize: true,
  },
  GainsEffect: {
    type: '26',
    name: 'NetworkBuff',
    fields: {
      type: 0,
      timestamp: 1,
      effectId: 2,
      effect: 3,
      duration: 4,
      sourceId: 5,
      source: 6,
      targetId: 7,
      target: 8,
      count: 9,
      targetHp: 10,
      hp: 11,
    },
    playerIds: {
      5: 6,
      7: 8,
    },
    canAnonymize: true,
  },
  HeadMarker: {
    type: '27',
    name: 'NetworkTargetIcon',
    fields: {
      type: 0,
      timestamp: 1,
      targetId: 2,
      target: 3,
      id: 6,
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
  },
  networkRaidMarker: {
    type: '28',
    name: 'NetworkRaidMarker',
    fields: {
      type: 0,
      timestamp: 1,
      operation: 2,
      waymark: 3,
      id: 4,
      name: 5,
      x: 6,
      y: 7,
      z: 8,
    },
    canAnonymize: true,
  },
  networkTargetMarker: {
    type: '29',
    name: 'NetworkTargetMarker',
    fields: {
      type: 0,
      timestamp: 1,
      operation: 2, // Add, Update, Delete
      waymark: 3,
      id: 4,
      name: 5,
      targetId: 6,
      targetName: 7,
    },
    playerIds: {
      4: null,
      5: null,
    },
  },
  LosesEffect: {
    type: '30',
    name: 'NetworkBuffRemove',
    fields: {
      type: 0,
      timestamp: 1,
      effectId: 2,
      effect: 3,
      sourceId: 5,
      source: 6,
      targetId: 7,
      target: 8,
      count: 9,
    },
    playerIds: {
      5: 6,
      7: 8,
    },
    canAnonymize: true,
  },
  networkGauge: {
    type: '31',
    name: 'NetworkGauge',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      data0: 3,
      data1: 4,
      data2: 5,
      data3: 6,
    },
    playerIds: {
      2: null,
    },
    // Sometimes this last field looks like a player id.
    // For safety, anonymize all of the gauge data.
    firstUnknownField: 3,
    canAnonymize: true,
  },
  networkWorld: {
    type: '32',
    name: 'NetworkWorld',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
  ActorControl: {
    type: '33',
    name: 'Network6D',
    fields: {
      type: 0,
      timestamp: 1,
      instance: 2,
      command: 3,
      data0: 4,
      data1: 5,
      data2: 6,
      data3: 7,
    },
    canAnonymize: true,
  },
  NameToggle: {
    type: '34',
    name: 'NetworkNameToggle',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      targetId: 4,
      targetName: 5,
      toggle: 6,
    },
    playerIds: {
      2: 3,
      4: 5,
    },
    canAnonymize: true,
  },
  Tether: {
    type: '35',
    name: 'NetworkTether',
    fields: {
      type: 0,
      timestamp: 1,
      sourceId: 2,
      source: 3,
      targetId: 4,
      target: 5,
      id: 8,
    },
    playerIds: {
      2: 3,
      4: 5,
    },
    canAnonymize: true,
    firstUnknownField: 9,
  },
  limitBreak: {
    type: '36',
    name: 'LimitBreak',
    fields: {
      type: 0,
      timestamp: 1,
      valueHex: 2,
      bars: 3,
    },
    canAnonymize: true,
  },
  networkEffectResult: {
    type: '37',
    name: 'NetworkEffectResult',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      sequenceId: 4,
      currentHp: 5,
      maxHp: 6,
      currentMp: 7,
      maxMp: 8,
      // currentTp: 9,
      // maxTp: 10,
      x: 11,
      y: 12,
      z: 13,
      heading: 14,
    },
    playerIds: {
      2: 3,
    },
    firstUnknownField: 22,
    canAnonymize: true,
  },
  StatusEffect: {
    type: '38',
    name: 'NetworkStatusEffects',
    fields: {
      type: 0,
      timestamp: 1,
      targetId: 2,
      target: 3,
      jobLevelData: 4,
      hp: 5,
      maxHp: 6,
      mp: 7,
      maxMp: 8,
      x: 11,
      y: 12,
      z: 13,
      heading: 14,
      data0: 15,
      data1: 16,
      data2: 17,
      data3: 18,
      data4: 19,
    },
    playerIds: {
      2: 3,
    },
    firstUnknownField: 20,
    canAnonymize: true,
  },
  networkUpdateHP: {
    type: '39',
    name: 'NetworkUpdateHP',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      currentHp: 4,
      maxHp: 5,
      currentMp: 6,
      maxMp: 7,
      // currentTp: 8,
      // maxTp: 9,
      x: 10,
      y: 11,
      z: 12,
      heading: 13,
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
  },
  Map: {
    type: '40',
    name: 'Map',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      regionName: 3,
      placeName: 4,
      placeNameSub: 5,
    },
    canAnonymize: true,
  },
  parserInfo: {
    type: '249',
    name: 'ParserInfo',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: true,
  },
  processInfo: {
    type: '250',
    name: 'ProcessInfo',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: true,
  },
  debug: {
    type: '251',
    name: 'Debug',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: false,
  },
  packetDump: {
    type: '252',
    name: 'PacketDump',
    fields: {
      type: 0,
      timestamp: 1,
    },
    canAnonymize: false,
  },
  version: {
    type: '253',
    name: 'Version',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: true,
  },
  error: {
    type: '254',
    name: 'Error',
    fields: {
      type: 0,
      timestamp: 1,
    },
    canAnonymize: false,
  },
  timer: {
    type: '255',
    name: 'Timer',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
  },
} as const;

// Verify that this has the right type, but export `as const`.
const assertLogDefinitions: LogDefinitionMap = logDefinitions;
console.assert(assertLogDefinitions);

export type LogDefinitions = typeof logDefinitions;
export type LogDefinitionTypes = keyof LogDefinitions;

// This type helper reverses the keys and values of a given type, e.g this:
// {1: 'a'}
// becomes this:
// {a: 1}
type Reverse<T extends { [f: string]: number }> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

export type LogDefinitionsReverse = {
  [type in keyof LogDefinitions]: Reverse<LogDefinitions[type]['fields']>;
};

export default logDefinitions;
