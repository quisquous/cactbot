'use strict';

// NOTE: do not add more fights to this data structure.
// These exist for testing pullcounter and for backwards compatibility
// with pullcounter keys.  None of these were translated in the past,
// and so it's also not worth going back and adding these as there is
// no backwards compatibility issue for other languages.

const gBossFightTriggers = [
  {
    id: 'test',
    zoneId: ZoneId.MiddleLaNoscea,
    startRegex: /:You bow courteously to the striking dummy/,
    countdownStarts: true,
    preventAutoStart: true,
  },
  {
    id: 'o1s',
    zoneId: ZoneId.DeltascapeV10Savage,
  },
  {
    id: 'o2s',
    zoneId: ZoneId.DeltascapeV20Savage,
  },
  {
    id: 'o3s',
    zoneId: ZoneId.DeltascapeV30Savage,
  },
  {
    id: 'o4s-exdeath',
    zoneId: ZoneId.DeltascapeV40Savage,
    startRegex: /:Exdeath uses Dualcast/,
    preventAutoStart: true,
  },
  {
    id: 'o4s-neo',
    zoneId: ZoneId.DeltascapeV40Savage,
    startRegex: /:Neo Exdeath uses Almagest/,
    preventAutoStart: true,
  },
  {
    id: 'Unending Coil',
    zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  },
  {
    id: 'Shinryu Ex',
    zoneId: ZoneId.TheMinstrelsBalladShinryusDomain,
  },
  {
    id: 'o5s',
    zoneId: ZoneId.SigmascapeV10Savage,
  },
  {
    id: 'o6s',
    zoneId: ZoneId.SigmascapeV20Savage,
  },
  {
    id: 'o7s',
    zoneId: ZoneId.SigmascapeV30Savage,
  },
  {
    id: 'o8s-kefka',
    zoneId: ZoneId.SigmascapeV40Savage,
    startRegex: / 15:........:Kefka:28C2:/,
    preventAutoStart: true,
  },
  {
    id: 'o8s-god kefka',
    zoneId: ZoneId.SigmascapeV40Savage,
    startRegex: / 15:........:Kefka:28EC:/,
    preventAutoStart: true,
  },
  {
    id: 'Byakko Ex',
    zoneId: ZoneId.TheJadeStoaExtreme,
  },
  {
    id: 'Tsukuyomi Ex',
    zoneId: ZoneId.TheMinstrelsBalladTsukuyomisPain,
  },
  {
    id: 'UwU',
    zoneId: ZoneId.TheWeaponsRefrainUltimate,
  },
  {
    id: 'Suzaku Ex',
    zoneId: ZoneId.HellsKierExtreme,
  },
  {
    id: 'Seiryu Ex',
    zoneId: ZoneId.TheWreathOfSnakesExtreme,
  },
  {
    id: 'o9s',
    zoneId: ZoneId.AlphascapeV10Savage,
  },
  {
    id: 'o10s',
    zoneId: ZoneId.AlphascapeV20Savage,
  },
  {
    id: 'o11s',
    zoneId: ZoneId.AlphascapeV30Savage,
  },
  {
    id: 'o12s-door',
    zoneId: ZoneId.AlphascapeV40Savage,
    startRegex: /:Omega-M:337D:/,
    preventAutoStart: true,
  },
  {
    id: 'o12s-final',
    zoneId: ZoneId.AlphascapeV40Savage,
    startRegex: /:Omega:336C:/,
    preventAutoStart: true,
  },
];
