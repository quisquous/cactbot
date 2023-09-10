import { PluginCombatantState } from '../types/event';
import { NetFieldsReverse } from '../types/net_fields';

export type LogDefinition = {
  // The log id, as a decimal string, minimum two characters.
  type: string;
  // The informal name of this log (must match the key that the LogDefinition is a value for).
  name: string;
  // The plugin that generates this log.
  source: 'FFXIV_ACT_Plugin' | 'OverlayPlugin';
  // Parsed ACT log line type.  OverlayPlugin lines use the `type` as a string.
  messageType: string;
  // If true, always include this line when splitting logs (e.g. FFXIV plugin version).
  globalInclude?: boolean;
  // If true, always include the last instance of this line when splitting logs (e.g. ChangeZone).
  lastInclude?: boolean;
  // True if the line can be anonymized (i.e. removing player ids and names).
  canAnonymize?: boolean;
  // If true, this log has not been seen before and needs more information.
  isUnknown?: boolean;
  // Fields at this index and beyond are cleared, when anonymizing.
  firstUnknownField?: number;
  // A map of all of the fields, unique field name to field index.
  fields?: { [fieldName: string]: number };
  // A list of field ids that *may* contain RSV keys (for decoding)
  possibleRsvFields?: readonly number[];
  subFields?: {
    [fieldName: string]: {
      [fieldValue: string]: {
        name: string;
        canAnonymize: boolean;
      };
    };
  };
  // Map of indexes from a player id to the index of that player name.
  playerIds?: { [fieldIdx: number]: number | null };
  // A list of fields that are ok to be blank (or have invalid ids).
  blankFields?: readonly number[];
  // This field and any field after will be treated as optional when creating capturing regexes.
  firstOptionalField: number | undefined;
  // These fields are treated as repeatable fields
  repeatingFields?: {
    startingIndex: number;
    label: string;
    names: readonly string[];
    sortKeys?: boolean;
    primaryKey: string;
    possibleKeys: readonly string[];
  };
};
export type LogDefinitionMap = { [name: string]: LogDefinition };
type LogDefinitionVersionMap = { [version: string]: LogDefinitionMap };

// TODO: Maybe bring in a helper library that can compile-time extract these keys instead?
const combatantMemoryKeys: readonly (Extract<keyof PluginCombatantState, string>)[] = [
  'CurrentWorldID',
  'WorldID',
  'WorldName',
  'BNpcID',
  'BNpcNameID',
  'PartyType',
  'ID',
  'OwnerID',
  'WeaponId',
  'Type',
  'Job',
  'Level',
  'Name',
  'CurrentHP',
  'MaxHP',
  'CurrentMP',
  'MaxMP',
  'PosX',
  'PosY',
  'PosZ',
  'Heading',
  'MonsterType',
  'Status',
  'ModelStatus',
  'AggressionStatus',
  'TargetID',
  'IsTargetable',
  'Radius',
  'Distance',
  'EffectiveDistance',
  'NPCTargetID',
  'CurrentGP',
  'MaxGP',
  'CurrentCP',
  'MaxCP',
  'PCTargetID',
  'IsCasting1',
  'IsCasting2',
  'CastBuffID',
  'CastTargetID',
  'CastDurationCurrent',
  'CastDurationMax',
  'TransformationId',
] as const;

const latestLogDefinitions = {
  GameLog: {
    type: '00',
    name: 'GameLog',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'ChatLog',
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
    firstOptionalField: undefined,
  },
  ChangeZone: {
    type: '01',
    name: 'ChangeZone',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Territory',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
    },
    lastInclude: true,
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  ChangedPlayer: {
    type: '02',
    name: 'ChangedPlayer',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'ChangePrimaryPlayer',
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
    firstOptionalField: undefined,
  },
  AddedCombatant: {
    type: '03',
    name: 'AddedCombatant',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'AddCombatant',
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
    firstOptionalField: undefined,
  },
  RemovedCombatant: {
    type: '04',
    name: 'RemovedCombatant',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'RemoveCombatant',
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
    firstOptionalField: undefined,
  },
  PartyList: {
    type: '11',
    name: 'PartyList',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'PartyList',
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
    firstOptionalField: 3,
    canAnonymize: true,
    lastInclude: true,
  },
  PlayerStats: {
    type: '12',
    name: 'PlayerStats',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'PlayerStats',
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
      localContentId: 19,
    },
    canAnonymize: true,
    lastInclude: true,
    firstOptionalField: undefined,
  },
  StartsUsing: {
    type: '20',
    name: 'StartsUsing',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'StartsCasting',
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
    possibleRsvFields: [5],
    blankFields: [6],
    playerIds: {
      2: 3,
      6: 7,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  Ability: {
    type: '21',
    name: 'Ability',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'ActionEffect',
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
      sequence: 44,
      targetIndex: 45,
      targetCount: 46,
    },
    possibleRsvFields: [5],
    playerIds: {
      2: 3,
      6: 7,
    },
    blankFields: [6],
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  NetworkAOEAbility: {
    type: '22',
    name: 'NetworkAOEAbility',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'AOEActionEffect',
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
      sequence: 44,
      targetIndex: 45,
      targetCount: 46,
    },
    possibleRsvFields: [5],
    playerIds: {
      2: 3,
      6: 7,
    },
    blankFields: [6],
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  NetworkCancelAbility: {
    type: '23',
    name: 'NetworkCancelAbility',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'CancelAction',
    fields: {
      type: 0,
      timestamp: 1,
      sourceId: 2,
      source: 3,
      id: 4,
      name: 5,
      reason: 6,
    },
    possibleRsvFields: [5],
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  NetworkDoT: {
    type: '24',
    name: 'NetworkDoT',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'DoTHoT',
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
      sourceId: 17,
      source: 18,
      // An id number lookup into the AttackType table
      damageType: 19,
      sourceCurrentHp: 20,
      sourceMaxHp: 21,
      sourceCurrentMp: 22,
      sourceMaxMp: 23,
      // sourceCurrentTp: 24,
      // sourceMaxTp: 25,
      sourceX: 26,
      sourceY: 27,
      sourceZ: 28,
      sourceHeading: 29,
    },
    playerIds: {
      2: 3,
      17: 18,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  WasDefeated: {
    type: '25',
    name: 'WasDefeated',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Death',
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
    firstOptionalField: undefined,
  },
  GainsEffect: {
    type: '26',
    name: 'GainsEffect',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'StatusAdd',
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
      targetMaxHp: 10,
      sourceMaxHp: 11,
    },
    possibleRsvFields: [3],
    playerIds: {
      5: 6,
      7: 8,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  HeadMarker: {
    type: '27',
    name: 'HeadMarker',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'TargetIcon',
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
    firstOptionalField: undefined,
  },
  NetworkRaidMarker: {
    type: '28',
    name: 'NetworkRaidMarker',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'WaymarkMarker',
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
    firstOptionalField: undefined,
  },
  NetworkTargetMarker: {
    type: '29',
    name: 'NetworkTargetMarker',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'SignMarker',
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
    firstOptionalField: undefined,
  },
  LosesEffect: {
    type: '30',
    name: 'LosesEffect',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'StatusRemove',
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
    possibleRsvFields: [3],
    playerIds: {
      5: 6,
      7: 8,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  NetworkGauge: {
    type: '31',
    name: 'NetworkGauge',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Gauge',
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
    firstOptionalField: undefined,
  },
  NetworkWorld: {
    type: '32',
    name: 'NetworkWorld',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'World',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
    firstOptionalField: undefined,
  },
  ActorControl: {
    type: '33',
    name: 'ActorControl',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Director',
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
    firstOptionalField: undefined,
  },
  NameToggle: {
    type: '34',
    name: 'NameToggle',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'NameToggle',
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
    firstOptionalField: undefined,
  },
  Tether: {
    type: '35',
    name: 'Tether',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Tether',
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
    firstOptionalField: undefined,
  },
  LimitBreak: {
    type: '36',
    name: 'LimitBreak',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'LimitBreak',
    fields: {
      type: 0,
      timestamp: 1,
      valueHex: 2,
      bars: 3,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  NetworkEffectResult: {
    type: '37',
    name: 'NetworkEffectResult',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'EffectResult',
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
    firstOptionalField: undefined,
  },
  StatusEffect: {
    type: '38',
    name: 'StatusEffect',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'StatusList',
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
      data5: 20,
      // Variable number of triplets here, but at least one.
    },
    playerIds: {
      2: 3,
    },
    firstUnknownField: 20,
    canAnonymize: true,
    firstOptionalField: 18,
  },
  NetworkUpdateHP: {
    type: '39',
    name: 'NetworkUpdateHP',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'UpdateHp',
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
    firstOptionalField: undefined,
  },
  Map: {
    type: '40',
    name: 'Map',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'ChangeMap',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      regionName: 3,
      placeName: 4,
      placeNameSub: 5,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
    lastInclude: true,
  },
  SystemLogMessage: {
    type: '41',
    name: 'SystemLogMessage',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'SystemLogMessage',
    fields: {
      type: 0,
      timestamp: 1,
      instance: 2,
      id: 3,
      param0: 4,
      param1: 5,
      param2: 6,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  StatusList3: {
    type: '42',
    name: 'StatusList3',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'StatusList3',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      name: 3,
      // triplets of fields from here (effectId, data, playerId)?
    },
    playerIds: {
      2: 3,
    },
    canAnonymize: true,
    firstOptionalField: 4,
    firstUnknownField: 4,
  },
  ParserInfo: {
    type: '249',
    name: 'ParserInfo',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Settings',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  ProcessInfo: {
    type: '250',
    name: 'ProcessInfo',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Process',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  Debug: {
    type: '251',
    name: 'Debug',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Debug',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: false,
    firstOptionalField: undefined,
  },
  PacketDump: {
    type: '252',
    name: 'PacketDump',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'PacketDump',
    fields: {
      type: 0,
      timestamp: 1,
    },
    canAnonymize: false,
    firstOptionalField: undefined,
  },
  Version: {
    type: '253',
    name: 'Version',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Version',
    fields: {
      type: 0,
      timestamp: 1,
    },
    globalInclude: true,
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  Error: {
    type: '254',
    name: 'Error',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'Error',
    fields: {
      type: 0,
      timestamp: 1,
    },
    canAnonymize: false,
    firstOptionalField: undefined,
  },
  None: {
    type: '[0-9]+',
    name: 'None',
    source: 'FFXIV_ACT_Plugin',
    messageType: 'None',
    fields: {
      type: 0,
      timestamp: 1,
    },
    isUnknown: true,
    firstOptionalField: undefined,
  },
  // OverlayPlugin log lines
  LineRegistration: {
    type: '256',
    name: 'LineRegistration',
    source: 'OverlayPlugin',
    messageType: '256',
    fields: {
      type: 0,
      timestamp: 1,
      id: 2,
      source: 3,
      version: 4,
    },
    globalInclude: true,
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  MapEffect: {
    type: '257',
    name: 'MapEffect',
    source: 'OverlayPlugin',
    messageType: '257',
    fields: {
      type: 0,
      timestamp: 1,
      instance: 2,
      flags: 3,
      // values for the location field seem to vary between instances
      // (e.g. a location of '08' in P5S does not appear to be the same location in P5S as in P6S)
      // but this field does appear to consistently contain position info for the effect rendering
      location: 4,
      data0: 5,
      data1: 6,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  FateDirector: {
    type: '258',
    name: 'FateDirector',
    source: 'OverlayPlugin',
    messageType: '258',
    // fateId and progress are in hex.
    fields: {
      type: 0,
      timestamp: 1,
      category: 2,
      // padding0: 3,
      fateId: 4,
      progress: 5,
      // param3: 6,
      // param4: 7,
      // param5: 8,
      // param6: 9,
      // padding1: 10,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  CEDirector: {
    type: '259',
    name: 'CEDirector',
    source: 'OverlayPlugin',
    messageType: '259',
    // all fields are in hex
    fields: {
      type: 0,
      timestamp: 1,
      popTime: 2,
      timeRemaining: 3,
      // unknown0: 4,
      ceKey: 5,
      numPlayers: 6,
      status: 7,
      // unknown1: 8,
      progress: 9,
      // unknown2: 10,
      // unknown3: 11,
      // unknown4: 12,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  InCombat: {
    type: '260',
    name: 'InCombat',
    source: 'OverlayPlugin',
    messageType: '260',
    fields: {
      type: 0,
      timestamp: 1,
      inACTCombat: 2,
      inGameCombat: 3,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
  CombatantMemory: {
    type: '261',
    name: 'CombatantMemory',
    source: 'OverlayPlugin',
    messageType: '261',
    fields: {
      type: 0,
      timestamp: 1,
      change: 2,
      id: 3,
      // from here, pairs of field name/values
    },
    canAnonymize: true,
    firstOptionalField: 5,
    // TODO: fix this data structure and anonymizer to be able to handle repeatingFields.
    // At the very least, Name and PCTargetID need to be anonymized as well.
    firstUnknownField: 4,
    playerIds: {
      3: null,
    },
    repeatingFields: {
      startingIndex: 4,
      label: 'pair',
      names: ['key', 'value'],
      sortKeys: true,
      primaryKey: 'key',
      possibleKeys: combatantMemoryKeys,
    },
  },
  RSVData: {
    type: '262',
    name: 'RSVData',
    source: 'OverlayPlugin',
    messageType: '262',
    fields: {
      type: 0,
      timestamp: 1,
      locale: 2,
      // unknown0: 3,
      key: 4,
      value: 5,
    },
    canAnonymize: true,
    firstOptionalField: undefined,
  },
} as const;

export const logDefinitionsVersions = {
  'latest': latestLogDefinitions,
} as const;

// Verify that this has the right type, but export `as const`.
const assertLogDefinitions: LogDefinitionVersionMap = logDefinitionsVersions;
console.assert(assertLogDefinitions);

export type LogDefinitions = typeof logDefinitionsVersions['latest'];
export type LogDefinitionTypes = keyof LogDefinitions;
export type LogDefinitionVersions = keyof typeof logDefinitionsVersions;

type RepeatingFieldsNarrowingType = { readonly repeatingFields: unknown };

export type RepeatingFieldsTypes = keyof {
  [
    type in LogDefinitionTypes as LogDefinitions[type] extends RepeatingFieldsNarrowingType ? type
      : never
  ]: null;
};

export type RepeatingFieldsDefinitions = {
  [type in RepeatingFieldsTypes]: LogDefinitions[type] & {
    readonly repeatingFields: Exclude<LogDefinitions[type]['repeatingFields'], undefined>;
  };
};

export type ParseHelperField<
  Type extends LogDefinitionTypes,
  Fields extends NetFieldsReverse[Type],
  Field extends keyof Fields,
> = {
  field: Fields[Field] extends string ? Fields[Field] : never;
  value?: string;
  optional?: boolean;
  repeating?: boolean;
  repeatingKeys?: string[];
  sortKeys?: boolean;
  primaryKey?: string;
  possibleKeys?: string[];
};

export type ParseHelperFields<T extends LogDefinitionTypes> = {
  [field in keyof NetFieldsReverse[T]]: ParseHelperField<T, NetFieldsReverse[T], field>;
};

export default logDefinitionsVersions['latest'];
