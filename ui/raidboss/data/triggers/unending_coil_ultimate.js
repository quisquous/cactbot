// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: /(The Unending Coil Of Bahamut \(Ultimate\)|Unknown Zone \(.*?\))/,
  triggers: [
    { id: 'UCU Twisters',
      regex: /:Twintania starts using Twisters/,
      alertText: function(data) {
        return 'Twisters';
      },
    },
  ]
}]