// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  // TODO: Zone name is empty string for now lol?
  zoneRegex: /(The Unending Coil Of Bahamut \(Ultimate\)|Unknown Zone \(.*?\))|^$/,
  triggers: [
    { id: 'UCU Twisters',
      regex: /:26AA:Twintania starts using/,
      alertText: function(data) {
        return 'Twisters';
      },
    },
    /*
    { id: 'UCU Generate',
      regex: /:26AE:Twintania starts using/,
      infoText: function(data) {
        return 'Generate';
      },
    },
    */
    
    { id: 'UCU Generate',
      regex: /1B:........:(\y{Name}):....:....:0076:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Generate on YOU';
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me)
          return 'Generate on ' + matches[1];
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
