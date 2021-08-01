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

// TODO: build NetRegexes out of this, or somehow deduplicate.
const logDefinitions = {
  gameLog: {
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
  changeZone: {
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
  changePrimaryPlayer: {
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
  addCombatant: {
    type: '03',
    name: 'AddCombatant',
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
  removeCombatant: {
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
    isUnknown: true,
  },
  removeBuff: {
    type: '06',
    name: 'RemoveBuff',
    isUnknown: true,
  },
  flyingText: {
    type: '07',
    name: 'FlyingText',
    isUnknown: true,
  },
  outgoingAbility: {
    type: '08',
    name: 'OutgoingAbility',
    isUnknown: true,
  },
  incomingAbility: {
    type: '09',
    name: 'IncomingAbility',
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
  playerStats: {
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
    isUnknown: true,
  },
  networkStartsCasting: {
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
  networkAbility: {
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
      id: 2,
      name: 3,
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
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
  },
  networkDeath: {
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
  networkBuff: {
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
    },
    playerIds: {
      5: 6,
      7: 8,
    },
    canAnonymize: true,
  },
  networkTargetIcon: {
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
    isUnknown: true,
  },
  networkTargetMarker: {
    type: '29',
    name: 'NetworkTargetMarker',
    fields: {
      type: 0,
      timestamp: 1,
      targetType: 2, // Add, Update, Delete
      data: 3,
      sourceId: 4, // ?
      targetId: 5, // ?
    },
    playerIds: {
      4: null,
      5: null,
    },
  },
  networkBuffRemove: {
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
    isUnknown: true,
  },
  network6d: {
    type: '33',
    name: 'Network6D',
    fields: {
      type: 0,
      timestamp: 1,
      data0: 2,
      data1: 3,
      data2: 4,
      data3: 5,
      data4: 6,
      data5: 7,
    },
    canAnonymize: true,
  },
  networkNameToggle: {
    type: '34',
    name: 'NetworkNameToggle',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      id2: 4,
      name2: 5,
    },
    playerIds: {
      2: 3,
      4: 5,
    },
    canAnonymize: true,
  },
  networkTether: {
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
      data0: 2,
      data1: 3,
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
    },
    playerIds: {
      2: 3,
    },
    firstUnknownField: 22,
    canAnonymize: true,
  },
  networkStatusEffects: {
    type: '38',
    name: 'NetworkStatusEffects',
    fields: {
      type: 0,
      timestamp: 1,
      targetId: 2,
      target: 3,
      hp: 5,
      maxHp: 6,
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
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
  },
  map: {
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
    globalInclude: true,
    canAnonymize: true,
  },
  processInfo: {
    type: '250',
    name: 'ProcessInfo',
    globalInclude: true,
    canAnonymize: true,
  },
  debug: {
    type: '251',
    name: 'Debug',
    globalInclude: true,
    canAnonymize: false,
  },
  packetDump: {
    type: '252',
    name: 'PacketDump',
    canAnonymize: false,
  },
  version: {
    type: '253',
    name: 'Version',
    globalInclude: true,
    canAnonymize: true,
  },
  error: {
    type: '254',
    name: 'Error',
    canAnonymize: false,
  },
  timer: {
    type: '255',
    name: 'Timer',
    isUnknown: true,
  },
} as const;

// Verify that this has the right type, but export `as const`.
const assertLogDefinitions: LogDefinitionMap = logDefinitions;
console.assert(assertLogDefinitions);

export default logDefinitions;
