// O5S - Sigmascape 1.0 Savage
[{
  zoneRegex: /Sigmascape V1\.0 \(Savage\)/,
  timelineFile: 'o5s.txt',
  triggers: [
    {
      id: 'O5S Thing',
      regex: /:1EDD:Alte Roite starts using/,
      infoText: function(data, matches) {
      },
      tts: function(data, matches) {
      },
    },
    {
      id: 'O5S Headmarker',
      regex: /1B:........:(\y{Name}):....:....:00XX:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
      },
      tts: function(data, matches) {
      },
    },
  ]
}]
