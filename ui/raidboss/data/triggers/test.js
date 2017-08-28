[{
  zoneRegex: /./,
  triggers: [
    {
      regex: /:test:trigger:/,
      infoText: 'This in info',
      alertText: 'Alert is like this',
      alarmText: 'Alarm is here',
      run: function(data) { console.log('me: ' + data.me + ' / job: ' + data.job + ' / role :' + data.role); }
    },
  ]
}]