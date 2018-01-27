// O6S - Sigmascape 2.0 Savage
[{
  zoneRegex: /Sigmascape V2\.0 \(Savage\)/,
  timelineFile: 'o6s.txt',
  triggers: [
    {
      id: 'O6S Thing',
      regex: /:1EDD:Alte Roite starts using/,
      infoText: function(data, matches) {
      },
      tts: function(data, matches) {
      },
    },
    {
      id: 'O6S Headmarker',
      regex: /1B:........:(\y{Name}):....:....:00XX:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
      },
      tts: function(data, matches) {
      },
    },
  ]
}]
