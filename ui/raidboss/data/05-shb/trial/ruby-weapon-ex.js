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
      response: Responses.tankBuster(),
    },
    {
      id: 'RubyEx Undermine',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD0', capture: false }),
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
      alertText: {
        en: 'Away From Lines',
      },
    },
    {
      id: 'RubyEx Liquefaction',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEC', capture: false }),
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
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
      alertText: {
        en: 'Away From Front',
      },
    },
    {
      id: 'RubyEx Cut And Run',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B05', capture: false }),
      infoText: {
        en: 'Go Sides',
      },
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Stack on YOU',
      },
    },
    {
      id: 'RubyEx Optimized Ultima',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B2D', capture: false }),
      alertText: {
        en: 'Enrage!',
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      regex: Regexes.gainsEffect({ effect: 'Pall of Rage' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Blue',
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      regex: Regexes.gainsEffect({ effect: 'Pall of Grief' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Red',
      },
    },
    {
      id: 'RubyEx Meteor Stream',
      regex: Regexes.headMarker({ id: '00E0' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Spread on YOU',
      },
    },
    {
      id: 'RubyEx Ruby Claw',
      regex: Regexes.startsUsing({ source: 'Raven\'s Image', id: '4AFF', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Tankbusters',
      },
    },
    {
      id: 'RubyEx Screech',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEE', capture: false }),
      infoText: {
        en: 'Knockback',
      },
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
