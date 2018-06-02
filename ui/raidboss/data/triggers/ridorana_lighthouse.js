[{
  zoneRegex: /^The Ridorana Lighthouse$/,
  timelineFile: 'ridorana_lighthouse.txt',
  timeline: [
    function(data) {
      return 'alerttext "Stone Breath" before 7 "Get Behind"';
    },
  ],
  triggers: [
    {
      id: 'Ridorana Famfrit Tide Pode',
      regex: / 14:2C3E:Famfrit, The Darkening Cloud starts using Tide Pod on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      delaySeconds: 4.5,
      alertText: {
        en: 'Look for Tsunami',
      },
      tts: {
        en: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      delaySeconds: 16.5,
      alertText: {
        en: 'Look for Tsunami',
      },
      tts: {
        en: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      delaySeconds: 28.5,
      alertText: {
        en: 'Look for Tsunami',
      },
      tts: {
        en: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Dark Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:0037:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: {
        en: 'Dorito Stack',
      },
      tts: {
        en: 'Stack',
      },
    },
    {
      id: 'Ridorana Famfrit Briny Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:008B:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: {
        en: 'Spread',
      },
      tts: {
        en: 'Spread',
      },
    },
    {
      id: 'Ridorana Famfrit Dark Rain',
      regex: / 03:Added new combatant Dark Rain\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
      },
      tts: {
        en: 'Adds',
      },
    },
    {
      id: 'Ridorana Belias Fire',
      regex: / 14:2CDB:Belias, The Gigas starts using Fire on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Belias Time Eruption',
      regex: / 14:2CDE:Belias, The Gigas starts using Time Eruption/,
      infoText: {
        en: 'Stand on Slow Clock',
      },
      tts: {
        en: 'Stand on Slow Clock',
      },
    },
    {
      id: 'Ridorana Belias Hand of Time',
      regex: / 1A:(\y{Name}) gains the effect of Burns from/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: {
        en: 'Stretch Tether Outside',
      },
      tts: {
        en: 'Stretch Tether Outside',
      },
    },
    {
      id: 'Ridorana Belias Time Bomb',
      regex: / 14:2CE6:Belias, The Gigas starts using Time Bomb/,
      infoText: {
        en: 'Stop Clocks',
      },
      tts: {
        en: 'Stop Clocks',
      },
    },
    {
      id: 'Ridorana Belias Gigas',
      regex: / 03:Added new combatant Gigas\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
      },
      tts: {
        en: 'Adds',
      },
    },
    {
      id: 'Ridorana Construct Destroy',
      regex: / 14:(?:2C5A|2C71):Construct 7 starts using Destroy on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Construct Accelerate Spread',
      regex: / 1B:........:(\y{Name}):....:....:008A:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      preRun: function(data) {
        data.accelerateSpreadOnMe = true;
      },
      alertText: {
        en: 'Spread',
      },
      tts: {
        en: 'Spread',
      },
    },
    {
      id: 'Ridorana Construct Accelerate Stack',
      regex: / 1B:........:(\y{Name}):....:....:0064:0000:0000:0000:/,
      condition: function(data) { return !data.accelerateSpreadOnMe; },
      infoText: function(data, matches) {
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
      tts: {
        en: 'Stack',
      },
    },
    {
      // Accelerate cleanup
      regex: / 14:2C65:Construct 7 starts using Accelerate/,
      run: function(data) {
        delete data.accelerateSpreadOnMe;
      },
    },
    {
      // TODO: need an "always run this trigger when starting zone" option
      regex: / 14:2C6C:Construct 7 starts using Subtract/,
      run: function(data) {
        data.mathDirection = function() {
          if (!this.correctMath)
            return;
          console.log('Subtract: hp: ' + this.currentHP + ', boost: ' + (this.hpBoost || 0));
          var number = this.currentHP - (this.hpBoost || 0);
          if (number < 1 || number > 9) {
            console.error('Bad math: ' + number)
            return;
          }
          return [
            {
              en: 'Stay out',
            },
            {
              en: 'Stand in 1',
            },
            {
              en: 'Stand in 2',
            },
            {
              en: 'Stand in 3',
            },
            {
              en: 'Stand in 4',
            },
          ][this.correctMath[number]];
        };
      },
    },
    {
      id: 'Ridorana HP Boost Gain',
      regex: / 1A:(\y{Name}) gains the effect of Hp Boost \+(\d)/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      preRun: function(data, matches) {
        data.hpBoost = matches[2];
      },
    },
    {
      id: 'Ridorana HP Boost Loss',
      regex: / 1A:(\y{Name}) loses the effect of Hp Boost \+(\d)/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      preRun: function(data, matches) {
        data.hpBoost = 0;
      },
    },
    {
      id: 'Ridorana Construct Divide By Five',
      regex: / 14:2CCD:Construct 7 starts using Divide By Five/,
      preRun: function(data) {
        data.correctMath = [-1, 4, 3, 2, 1, 0, 4, 3, 2, 1];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Divide By Four',
      regex: / 14:2CCC:Construct 7 starts using Divide By Four/,
      preRun: function(data) {
        data.correctMath = [-1, 3, 2, 1, 0, 3, 2, 1, 0, 3];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Divide By Three',
      regex: / 14:2CCA:Construct 7 starts using Divide By Three/,
      preRun: function(data) {
        data.correctMath = [-1, 2, 1, 0, 2, 1, 0, 2, 1, 0];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Indivisible',
      regex: / 14:2CCE:Construct 7 starts using Indivisible/,
      preRun: function(data) {
        data.correctMath = [-1, 1, 0, 0, 1, 0, 1, 0, 3, 2];
      },
      alertText: function(data) { return data.mathDirection(); },
      tts: function(data) { return data.mathDirection(); },
    },
    {
      id: 'Ridorana Construct Pulverize',
      regex: / 14:2C61:Construct 7 starts using Pulverize/,
      // 16 yalms
      alertText: {
        en: 'Get Out',
      },
      tts: {
        en: 'Get Out',
      },
    },
    {
      id: 'Ridorana Construct Dispose',
      regex: / 14:(?:2C5F|2CE9):Construct 7 starts using Dispose/,
      alertText: {
        en: 'Get Behind',
      },
      tts: {
        en: 'Get Behind',
      },
    },
    {
      id: 'Ridorana Construct Acceleration Bomb',
      regex: /1A:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return matches[1] == data.me; },
      delaySeconds: 2,
      alarmText: {
        en: 'Stop',
      },
      tts: {
        en: 'stop',
      },
    },
    {
      id: 'Ridorana Yiazmat Rake Buster',
      regex: / 14:2D4E:Yiazmat starts using Rake on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer') {
          return;
        }
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      id: 'Ridorana Yiazmat Rake Charge',
      regex: / 14:2E32:Yiazmat starts using Rake/,
      condition: function(data) { return data.role == 'tank' },
      infoText: {
        en: 'Out of Front',
      },
      tts: {
        en: 'Out of Front',
      },
    },
    {
      id: 'Ridorana Yiazmat White Breath',
      regex: / 14:2C31:Yiazmat starts using White Breath/,
      alertText: {
        en: 'Get Under',
      },
      tts: {
        en: 'Get Under',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Negative',
      regex: / 1A:(\y{Name}) gains the effect of Magnetic Lysis - from/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      infoText: {
        en: 'Move to Postive',
      },
      tts: {
        en: 'Move Postive',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Positive',
      regex: / 1A:(\y{Name}) gains the effect of Magnetic Lysis \+ from/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      infoText: {
        en: 'Move to Negative',
      },
      tts: {
        en: 'Move Negative',
      },
    },
    {
      id: 'Ridorana Yiazmat Archaeodemon',
      regex: / 03:Added new combatant Archaeodemon\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
      },
      tts: {
        en: 'Adds',
      },
    },
    {
      id: 'Ridorana Yiazmat Heart',
      regex: / 03:Added new combatant Heart Of The Dragon\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Heart',
      },
      tts: {
        en: 'Heart',
      },
    },
  ],
}]
