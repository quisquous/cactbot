'use strict';

[{
  zoneRegex: {
    en: /^Cinder Drift \(Extreme\)$/,
  },
  timelineFile: 'ruby-weapon-ex.txt',
  triggers: [
    {
      id: 'RubyEx Optimized Ultima',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4ABE', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'RubyEx Stamp',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B03' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'RubyEx Undermine',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD0', capture: false }),
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
      infoText: {
        en: 'Away from Lines',
      },
    },
    {
      id: 'RubyEx Liquefaction',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEC', capture: false }),
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
      // Ignore Liquefaction casts during dashes
      condition: function(data) {
        return data.rubyCounter % 2;
      },
      alertText: {
        en: 'Get On Lines',
      },
    },
    {
      id: 'RubyEx Ruby Ray',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B02', capture: false }),
      response: Responses.outOfFront()
    },
    {
      id: 'RubyEx Cut And Run',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B05', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8' }),
      condition: Conditions.targetIsYou(),
      response: Responses.stackOn(),
    },
    {
      // Enrage can start casting before Ruby Weapon has finished their rotation
      // Give a friendly reminder to pop LB3 if you haven't already
      id: 'RubyEx Optimized Ultima Enrage',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B2D', capture: false }),
      infoText: {
        en: 'Enrage!',
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      regex: Regexes.gainsEffect({ effect: 'Pall of Rage' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data) {
        data.color = 'blue';
      },
      infoText: {
        en: 'Attack Blue (East)',
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      regex: Regexes.gainsEffect({ effect: 'Pall of Grief' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data) {
        data.color = 'red';
      },
      infoText: {
        en: 'Attack Red (West)',
      },
    },
    {
      id: 'RubyEx Meteor Stream',
      regex: Regexes.headMarker({ id: '00E0' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubyEx Ruby Claw',
      regex: Regexes.startsUsing({ source: 'Raven\'s Image', id: '4AFF', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'RubyEx Change of Heart',
      regex: Regexes.ability({ source: 'The Ruby Weapon', id: '4AFC', capture: false }),
      preRun: function(data) {
        if (data.color == 'red')
          data.color = 'blue';
        else
          data.color = 'red';
      },
      infoText: function(data) {
        if (data.color == 'red') {
          return {
            en: 'Attack Red (West)',
          };
        }
        return {
          en: 'Attack Blue (East)',
        };
      },
    },
    {
      id: 'RubyEx Negative Aura',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AFE', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'RubyEx Screech',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEE', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'RubyEx Outrage',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B04', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
  ],
}];
