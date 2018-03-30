// O2S - Deltascape 2.0 Savage
[{
  zoneRegex: /(Deltascape V2.0 \(Savage\)|Unknown Zone \(2B8\))/,
  timelineFile: 'o2s.txt',
  timeline: `
    alerttext "Double Stack" before 6 "DPS: Levitate"
    `,
  triggers: [
    { // Phase Tracker: Maniacal Probe.
      regex: /:235A:Catastrophe starts using/,
      run: function(data) {
        data.probeCount = (data.probeCount || 0) + 1;
        data.dpsProbe = data.probeCount == 2 || data.probeCount == 4;
        data.myProbe = data.dpsProbe == data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_556|Levitation) from/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data) { data.levitating = true; },
    },
    {
      id: 'O2S Levitation',
      regex: /:(\y{Name}) loses the effect of (?:Unknown_556|Levitation)/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data) { data.levitating = false; },
    },
    {
      id: 'O2S -100Gs',
      regex: /:235E:Catastrophe starts using/,
      infoText: '-100 Gs: Go north/south and look away',
      tts: '100 gs',
    },
    {
      id: 'O2S Death\'s Gaze',
      regex: /:236F:Catastrophe starts using/,
      alarmText: 'Death\'s Gaze: Look away',
      tts: 'look away',
    },
    {
      id: 'O2S Earthquake',
      regex: /:2374:Catastrophe starts using/,
      infoText: function(data) { if (data.levitating) return 'Earthquake'; },
      alertText: function(data) { if (!data.levitating) return 'Earthquake: Levitate'; },
      tts: function(data) {
        if (!data.levitating)
          return 'levitate';
      },
    },
    {
      id: 'O2S Elevated',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_54E|Elevated) from/,
      infoText: function(data) { if (!data.role.startsWith('dps')) return 'DPS up, T/H down' },
      alarmText: function(data) { if (data.role.startsWith('dps') && !data.levitating) return 'DPS: Levitate' },
      tts: 'dps up',
    },
    {
      id: 'O2S Gravitational Wave',
      regex: /:2372:Catastrophe starts using/,
      infoText: 'Gravitational Wave: AOE damage',
      condition: function(data) { return data.role == 'healer'; },
      tts: 'wave',
    },
    {
      id: 'O2S Maniacal Probe',
      regex: /:235A:Catastrophe starts using/,
      infoText: function(data) {
        if (!data.myProbe) {
          if (!data.dpsProbe) return 'Maniacal Probe: Tanks & Healers';
          else return 'Maniacal Probe: DPS';
        }
      },
      alertText: function(data) {
        if (data.myProbe) {
          if (!data.dpsProbe) return 'Maniacal Probe: Tanks & Healers';
          else return 'Maniacal Probe: DPS';
        }
      },
      tts: function(data) {
        if (data.dpsProbe) return 'dps probe';
        else return 'tank heal probe';
      },
    },
    {
      id: 'O2S Unstable Gravity',
      regex: /:(\y{Name}) gains the effect of Unstable Gravity from/,
      delaySeconds: 9,
      condition: function(data, matches) { return matches[1] == data.me; },
      alarmText: 'Unstable Gravity: Elevate and outside stack',
      tts: 'float for bomb',
    },
    {
      id: 'O2S 6 Fulms Under',
      regex: /:(\y{Name}) gains the effect of 6 Fulms Under from/,
      delaySeconds: 5,
      infoText: function(data) { if (data.levitating) return '6 Fulms Under'; },
      alertText: function(data) { if (!data.levitating) return '6 Fulms Under: Levitate'; },
      condition: function(data, matches) { return !data.under && matches[1] == data.me; },
      tts: 'float',
      run: function(data) { data.under = true; },
    },
    {
      id: 'O2S 6 Fulms Under',
      regex: /:(\y{Name}) loses the effect of 6 Fulms Under from/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data) { data.under = false; }
    },
  ]
}]
