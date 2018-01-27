// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Thing',
      regex: /:1EDD:Alte Roite starts using/,
      infoText: function(data, matches) {
      },
      tts: function(data, matches) {
      },
    },
    {
      id: 'ByaEx Headmarker',
      regex: /1B:........:(\y{Name}):....:....:00XX:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
      },
      tts: function(data, matches) {
      },
    },
  ]
}]
