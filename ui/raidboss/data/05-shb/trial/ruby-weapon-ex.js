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
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4ABE', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'RubyEx Stamp',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B03' }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B03' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'RubyEx Undermine',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD0', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AD0', capture: false }),
      preRun: function(data) {
        data.rubyCounter = data.rubyCounter || 0;
        data.rubyCounter++;
      },
      infoText: {
        en: 'Away from Lines',
        fr: 'En dehors des sillons',
      },
    },
    {
      id: 'RubyEx Liquefaction',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AEC', capture: false }),
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
        fr: 'Sur les sillons',
      },
    },
    {
      id: 'RubyEx Ruby Ray',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B02', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B02', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'RubyEx Cut And Run',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B05', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B05', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'RubyEx High-Powered Homing Lasers',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AD8' }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AD8' }),
      condition: Conditions.targetIsYou(),
      response: Responses.stackOn(),
    },
    {
      // Enrage can start casting before Ruby Weapon has finished their rotation
      // Give a friendly reminder to pop LB3 if you haven't already
      id: 'RubyEx Optimized Ultima Enrage',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B2D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B2D', capture: false }),
      infoText: {
        en: 'Enrage!',
        fr: 'Enrage !',
      },
    },
    {
      id: 'RubyEx Pall of Rage',
      regex: Regexes.gainsEffect({ effect: 'Pall of Rage' }),
      regexFr: Regexes.gainsEffect({ effect: 'Fureur' }),
      preRun: function(data) {
        data.colors = data.colors || [];
        data.colors[matches.target] = 'blue';
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Attack Blue (East)',
            fr: 'Attaquez le bleu (Est)',
          };
        }
      },
    },
    {
      id: 'RubyEx Pall of Grief',
      regex: Regexes.gainsEffect({ effect: 'Pall of Grief' }),
      regexFr: Regexes.gainsEffect({ effect: 'Angoisse' }),
      preRun: function(data) {
        data.colors = data.colors || [];
        data.colors[matches.target] = 'red';
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Attack Red (West)',
            fr: 'Attaquez le rouge (Ouest)',
          };
        }
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
      regex: Regexes.startsUsing({ source: 'Raven\'s Image', id: '4AFF' }),
      regexFr: Regexes.startsUsing({ source: 'Griffe Rubis', id: '4AFF' }),
      condition: function(data) {
        if (data.role != 'healer' || data.role != 'tank')
          return false;
        if (data.colors[data.me] == data.colors[matches.target])
          return true;
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'RubyEx Change of Heart',
      regex: Regexes.ability({ source: 'The Ruby Weapon', id: '4AFC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AFC', capture: false }),
      preRun: function(data) {
        for (color of data.colors) {
          if (color == 'blue')
            color = 'red';
          else
            color = 'blue';
        }
      },
      infoText: function(data) {
        if (data.colors[data.me] == 'red') {
          return {
            en: 'Attack Red (East)',
            fr: 'Attaquez le rouge (Est)',
          };
        }
        return {
          en: 'Attack Blue (West)',
          fr: 'Attaquez le bleu (Ouest)',
        };
      },
    },
    {
      id: 'RubyEx Negative Aura',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AFE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AFE', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'RubyEx Screech',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4AEE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4AEE', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'RubyEx Outrage',
      regex: Regexes.startsUsing({ source: 'The Ruby Weapon', id: '4B04', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arme Rubis', id: '4B04', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
  ],
}];
