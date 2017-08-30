[{
  zoneRegex: /./,
  triggers: [
    {
      regex: /:test:trigger:/,
      infoText: function(data) { data.i = (data.i || 0) + 1; return 'This is an info ' + data.i },
      alertText: function(data) { data.t = (data.t || 0) + 1; return 'This is an alert ' + data.t },
      alarmText: function(data) { data.m = (data.m || 0) + 1; return 'This is an alarm ' + data.m },
      //sound: 'Long',
      //run: function(data) { console.log('me: ' + data.me + ' / job: ' + data.job + ' / role :' + data.role); }
    },
  ]
}]