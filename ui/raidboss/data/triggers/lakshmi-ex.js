// Lakshmi Extreme
[{
  zoneRegex: /^Emanation \(Extreme\)$/,
  timelineFile: 'lakshmi-ex.txt',
  timeline: [
    function(data) {
      if (data.role == 'tank')
        return 'infotext "Path of Light" before 5 "Cleave Soon"';
    },
  ],
  triggers: [
    {
      regex: /:Lakshmi starts using Chanchala/,
      run: function(data) { data.chanchala = true; },
    },
    {
      regex: /:Lakshmi loses the effect of Chanchala/,
      run: function(data) { data.chanchala = false; },
    },
    {
      id: 'Lakshmi Pull of Light',
      regex: /:215E:Lakshmi starts using The Pull Of Light on (\y{Name})/,
      alarmText: function(data, matches) {
        if (data.role != 'tank' && matches[1] == data.me)
          return 'Buster on YOU';
      },
      alertText: function(data, matches) {
        if (data.role == 'tank' && matches[1] == data.me)
          return 'Buster on YOU';
        if (data.role == 'healer' && matches[1] != data.me)
          return 'Buster on ' + matches[1];
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer')
          return 'buster';
      },
    },
    {
      id: 'Lakshmi Divine Denial',
      regex: /:2149:Lakshmi starts using Divine Denial/,
      alertText: 'Vrill + Knockback',
      tts: 'vrill and knockback',
    },
    {
      id: 'Lakshmi Divine Desire',
      regex: /:214B:Lakshmi starts using Divine Desire/,
      alertText: 'Vrill + Be Outside',
      tts: 'vrill and outside',
    },
    {
      id: 'Lakshmi Divine Doubt',
      regex: /:214A:Lakshmi starts using Divine Doubt/,
      alertText: 'Vrill + Pair Up',
      tts: 'vrill and buddy',
    },
    { // Stack marker
      id: 'Lakshmi Pall of Light',
      regex: /1B:........:(\y{Name}):....:....:003E:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (!data.chanchala)
          return;
        if (data.me == matches[1])
          return 'Vrill + Stack on YOU';
        return 'Vrill + Stack';
      },
      infoText: function(data, matches) {
        if (data.chanchala)
          return;
        if (data.me == matches[1])
          return 'Stack on YOU';
        return 'Stack';
      },
      tts: function(data) {
        if (data.chanchala)
          return 'vrill and stack';
        return 'stack';
      },
    },
    {
      id: 'Lakshmi Stotram',
      regex: /:2147:Lakshmi starts using Stotram/,
      alertText: function(data) {
        if (data.chanchala)
          return 'Vrill for AOE';
      },
      tts: function(data) {
        if (data.chanchala)
          return 'vrill for aoe';
      },
    },
    { // Offtank cleave
      id: 'Lakshmi Path of Light',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data) {
        return (data.chanchala ? 'Vrill + ' : '') + 'Cleave on YOU';
      },
      tts: function(data) {
        return (data.chanchala ? 'Vrill + ' : '') + 'Cleave';
      },
    },
    { // Cross aoe
      id: 'Lakshmi Hand of Grace',
      regex: /1B:........:(\y{Name}):....:....:006B:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        return (data.chanchala ? 'Vrill + ' : '') + 'Cross Marker';
      },
      tts: function(data) {
        return (data.chanchala ? 'Vrill + ' : '') + 'Cross Marker';
      },
    },
    { // Flower marker (healers)
      id: 'Lakshmi Hand of Beauty',
      regex: /1B:........:(\y{Name}):....:....:006D:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        return (data.chanchala ? 'Vrill + ' : '') + 'Flower Marker';
      },
      tts: function(data) {
        return (data.chanchala ? 'Vrill + ' : '') + 'Flower Marker';
      },
    },
    { // Red marker during add phase
      id: 'Lakshmi Water III',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Move Away',
      tts: 'Move Away',
    },
  ]
}]
