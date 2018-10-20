'use strict';

// O2S - Deltascape 2.0 Savage
[{
  zoneRegex: /(Deltascape V2.0 \(Savage\)|Unknown Zone \(2B8\))/,
  timelineFile: 'o2s.txt',
  timelineTriggers: [
    {
      id: 'O2S Double Stack',
      regex: /Double Stack/,
      beforeSeconds: 6,
      alertText: {
        en: 'DPS: Levitate',
        de: 'DDs hoch',
      },
    },
  ],
  triggers: [
    { // Phase Tracker: Maniacal Probe.
      regex: /:235A:Catastrophe starts using/,
      regexDe: /:235A:Katastroph starts using/,
      run: function(data) {
        data.probeCount = (data.probeCount || 0) + 1;
        data.dpsProbe = data.probeCount == 2 || data.probeCount == 4;
        data.myProbe = data.dpsProbe == data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation',
      regex: /:(\y{Name}) gains the effect of Levitation from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.levitating = true;
      },
    },
    {
      id: 'O2S Levitation',
      regex: /:(\y{Name}) loses the effect of Levitation/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.levitating = false;
      },
    },
    {
      id: 'O2S -100Gs',
      regex: /:235E:Catastrophe starts using/,
      regexDe: /:235E:Katastroph starts using/,
      infoText: {
        en: '-100 Gs: Go north/south and look away',
        de: '-100G: Nach Norden/Süden und wegschauen',
      },
      tts: {
        en: '100 gs',
        de: '-100 G',
      },
    },
    {
      id: 'O2S Death\'s Gaze',
      regex: /:236F:Catastrophe starts using/,
      regexDe: /:236F:Katastroph starts using/,
      alarmText: {
        en: 'Death\'s Gaze: Look away',
        de: 'Todesblick: Wegschauen',
      },
      tts: {
        en: 'look away',
        de: 'weckschauen',
      },
    },
    {
      id: 'O2S Earthquake',
      regex: /:2374:Catastrophe starts using/,
      regexDe: /:2374:Katastroph starts using/,
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: 'Earthquake',
            de: 'Erdbeben',
          };
        }
      },
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: 'Earthquake: Levitate',
            de: 'Erdbeben: Schweben',
          };
        }
      },
      tts: function(data) {
        if (!data.levitating) {
          return {
            en: 'levitate',
            de: 'schweben',
          };
        }
      },
    },
    {
      id: 'O2S Elevated',
      regex: /:(\y{Name}) gains the effect of Elevated from/,
      regexDe: /:(\y{Name}) gains the effect of Erhöht from/,
      infoText: function(data) {
        if (!data.role.startsWith('dps')) {
          return {
            en: 'DPS up, T/H down',
            de: 'DDs hoch, T/H runter',
          };
        }
      },
      alarmText: function(data) {
        if (data.role.startsWith('dps') && !data.levitating) {
          return {
            en: 'DPS: Levitate',
            de: 'DDs: Schweben',
          };
        }
      },
      tts: {
        en: 'dps up',
        de: 'dee dees hoch',
      },
    },
    {
      id: 'O2S Gravitational Wave',
      regex: /:2372:Catastrophe starts using/,
      regexDe: /:2372:Katastroph starts using/,
      infoText: 'Gravitational Wave: AOE damage',
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'wave',
        de: 'welle',
      },
    },
    {
      id: 'O2S Maniacal Probe',
      regex: /:235A:Catastrophe starts using/,
      regexDe: /:235A:Katastroph starts using/,
      infoText: function(data) {
        if (!data.myProbe) {
          if (!data.dpsProbe) {
            return {
              en: 'Maniacal Probe: Tanks & Healers',
              de: 'Tentakeltanz: Tanks & Heiler',
            };
          }
          return {
            en: 'Maniacal Probe: DPS',
            de: 'Tentakeltanz: DDs',
          };
        }
      },
      alertText: function(data) {
        if (data.myProbe) {
          if (!data.dpsProbe) {
            return {
              en: 'Maniacal Probe: Tanks & Healers',
              de: 'Tentakeltanz: Tanks & Heiler',
            };
          }
          return {
            en: 'Maniacal Probe: DPS',
            de: 'Tentakeltanz: DDs',
          };
        }
      },
      tts: function(data) {
        if (data.dpsProbe) {
          return {
            en: 'dps probe',
            de: 'dee dees tentakel',
          };
        }
        return {
          en: 'tank heal probe',
          de: 'tenks heiler tentakel',
        };
      },
    },
    {
      id: 'O2S Unstable Gravity',
      regex: /:(\y{Name}) gains the effect of Unstable Gravity from/,
      regexDe: /:(\y{Name}) gains the effect of Schwerkraftschwankung from/,
      delaySeconds: 9,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'Unstable Gravity: Elevate and outside stack',
        de: 'Schwerkraftschwankung: Schweben und außen stacken',
      },
      tts: {
        en: 'float for bomb',
        de: 'schweben für bombe',
      },
    },
    {
      id: 'O2S 6 Fulms Under',
      regex: /:(\y{Name}) gains the effect of 6 Fulms Under from/,
      regexDe: /:(\y{Name}) gains the effect of Versinkend from/,
      delaySeconds: 5,
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: '6 Fulms Under',
            de: 'Versinkend',
          };
        }
      },
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: '6 Fulms Under: Levitate',
            de: 'Versinkend: Schweben',
          };
        }
      },
      condition: function(data, matches) {
        return !data.under && matches[1] == data.me;
      },
      tts: {
        en: 'float',
        de: 'schweben',
      },
      run: function(data) {
        data.under = true;
      },
    },
    {
      id: 'O2S 6 Fulms Under',
      regex: /:(\y{Name}) loses the effect of 6 Fulms Under from/,
      regexDe: /:(\y{Name}) loses the effect of Versinkend from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.under = false;
      },
    },
  ],
}];
