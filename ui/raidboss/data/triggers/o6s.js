// O6S - Sigmascape 2.0 Savage
[{
  zoneRegex: /Sigmascape V2\.0 \(Savage\)/,
  timelineFile: 'o6s.txt',
  triggers: [
    {
      id: 'O6S Demonic Stone',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      alarmText: function(data,matches) {
        if (data.me == matches[1])
	  return 'Demonic Stone on YOU';
      },
    },
    {
      id: 'O6S Last Kiss',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      infoText: function(data,matches) {
        if (data.me == matches[1])
	  return 'Last Kiss on YOU';
	return 'Last Kiss on ' +data.ShortName(matches[1]);
      },
      tts: 'last kiss',
    },
  ]
}]
