
var gBossFightTriggers = [
  {
    id: 'test',
    zoneRegex: /^Middle La Noscea$/,
    startRegex: /:You bow courteously to the striking dummy/,
    endRegex: /:You bid farewell to the striking dummy/,
    countdownStarts: true,
  },
  {
    id: 'o1s',
    zoneRegex: /^Deltascape V1.0 \(Savage\)$/,
    startRegex: /:Alte Roite uses Wyrm Tail/,
    endRegex: /:Alte Roite was defeated by/,
    countdownStarts: true,
  },
  {
    id: 'o2s',
    zoneRegex: /^Deltascape V2.0 \(Savage\)$/,
    startRegex: /:Catastrophe uses Earthquake/,
    endRegex: /:Catastrophe was defeated by/,
    countdownStarts: true,
  },
  {
    id: 'o3s',
    zoneRegex: /^Deltascape V3.0 \(Savage\)$/,
    startRegex: /:Halicarnassus uses Critical Hit/,
    endRegex: /:Halicarnassus was defeated by/,
    countdownStarts: true,
  },
  {
    id: 'o4s-exdeath',
    zoneRegex: /^Deltascape V4.0 \(Savage\)$/,
    startRegex: /:Exdeath uses Dualcast/,
    endRegex: /:The limit gauge resets!/,
    countdownStarts: false,
  },
  {
    id: 'o4s-neo',
    zoneRegex: /^Deltascape V4.0 \(Savage\)$/,
    startRegex: /:Neo Exdeath uses Almagest/,
    endRegex: /:Neo Exdeath is defeated/,
    countdownStarts: false,
  },
  {
    id: 'Unending Coil',
    zoneRegex: /^The Unending Coil Of Bahamut \(Ultimate\)$/,
    startRegex: /:Twintania:26A7:/,
    endRegex: /Removing combatant Bahamut Prime\.  Max HP: 13751450\./,
    countdownStarts: true,
  },
  {
    id: 'Shinryu Ex',
    zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
    startRegex: /:Shinryu starts using Earthen Fury/,
    endRegex: /Removing combatant Shinryu\.  Max HP: 17167557\./,
    countdownStarts: true,
  },
];
