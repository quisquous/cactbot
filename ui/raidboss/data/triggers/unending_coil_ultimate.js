// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: /(The Unending Coil Of Bahamut \(Ultimate\)|Unknown Zone \(.*?\))|/,
  triggers: [
    { id: 'UCU Twisters',
      regex: /:26AA:Twintania starts using/,
      //regex: /:Twintania readies Twister/,
      alertText: function(data) {
        return 'Twisters';
      },
    },
    { id: 'UCU Death Sentence',
      regex: /:Twintania starts using Death Sentence on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Death Sentence on YOU';
        if (data.role == 'healer')
          return 'Death Sentence on ' + matches[1];
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank')
          return 'Death Sentence on ' + matches[1];
      },
    },
  ]
}]
