'use strict';

[{
  zoneId: ZoneId.TheSeatOfSacrifice,
  timelineFile: 'wol.txt',
  timelineTriggers: [
    {
      id: 'WOL Ultimate Crossover',
      regex: /Ultimate Crossover/,
      beforeSeconds: 8,
      condition: function(data) {
        return data.role === 'tank';
      },
      alarmText: {
        en: 'Limit break now!',
        cn: '坦克LB！',
      },
    },
    {
      id: 'WOL Twincast Towers',
      regex: /Meteor Impact 1/,
      beforeSeconds: 10,
      durationSeconds: 8,
      infoText: {
        en: 'Get Towers',
      },
    },
  ],
  triggers: [
    {
      id: 'WOL Terror Unleashed',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4F27', capture: false }),
      condition: function(data) {
        return data.role === 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Full Heal Everyone',
      },
    },
    {
      id: 'WOL Coruscant Saber In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F11', capture: false }),
      response: Responses.getUnder('info'),
    },
    {
      id: 'WOL Coruscant Saber Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F10', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'WOL Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2D', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'WOL Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2E', capture: false }),
      // I mean, stop if you want, I guess?
      response: Responses.stopEverything('info'),
    },
    {
      id: 'WOL Imbued Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F13', capture: false }),
      run: function(data) {
        data.imbued = 'blizzard';
      },
    },
    {
      id: 'WOL Imbued Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F12', capture: false }),
      run: function(data) {
        data.imbued = 'fire';
      },
    },
    {
      id: 'WOL Imbued Coruscance Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4B', capture: false }),
      alertText: function(data) {
        if (data.imbued === 'blizzard') {
          return {
            en: 'Out => Move',
          };
        } else if (data.imbued === 'fire') {
          return {
            en: 'Out => Stop',
          };
        }
        return {
          en: 'Out => ???',
        };
      },
    },
    {
      id: 'WOL Imbued Coruscance In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4C', capture: false }),
      alertText: function(data) {
        if (data.imbued === 'blizzard') {
          return {
            en: 'Under => Move',
          };
        } else if (data.imbued === 'fire') {
          return {
            en: 'Under => Stop',
          };
        }
        return {
          en: 'Under => ???',
        };
      },
    },
    {
      id: 'WOL Sword Of Light',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F42', capture: false }),
      infoText: {
        en: 'Out of Triangle',
      },
    },
    {
      id: 'WOL Summon Wyrm',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F41', capture: false }),
      delaySeconds: 6,
      // This applies to both phases.  We could say something like "go side without wyrm" and
      // "go to corner without wyrm", but "avoid wyrm dash" covers both.  Hopefully it's obvious
      // not to stand in the giant black circle.
      infoText: {
        en: 'Avoid Wyrm Dash',
      },
    },
    {
      id: 'WOL Bitter End',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F28' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'WOL Elddragon Dive',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F29', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'WOL Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'GTFO',
      },
      run: function(data, matches) {
        data.deluge = matches.target;
      },
    },
    {
      id: 'WOL Deluge of Death Cleanup',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      delaySeconds: 10,
      run: function(data, matches) {
        // Clean this up so it doesn't apply during Katon San.
        delete data.deluge;
      },
    },
    {
      // Both for Absolute Holy and Katon San
      id: 'WOL Absolute Holy Katon San',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      delaySeconds: 0.5,
      response: function(data, matches) {
        if (data.deluge === data.me)
          return;
        return Responses.stackOn();
      },
    },
    {
      id: 'WOL Radiant Braver',
      netRegex: NetRegexes.headMarker({ id: '00EA' }),
      response: Responses.earthshaker(),
    },
    {
      id: 'WOL Radiant Desperado',
      // There are two single target 4F46 lines to indicate who the stacks
      // are on, that come slightly after this starts casting.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '515D', capture: false }),
      alertText: {
        en: 'Stack Groups',
      },
    },
    {
      id: 'WOL Radiant Meteor',
      netRegex: NetRegexes.headMarker({ id: '00E9' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Go to Corner',
      },
    },
    {
      id: 'WOL Suiton San',
      netRegex: NetRegexes.ability({ source: 'Spectral Ninja', id: '4F38', capture: false }),
      delaySeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'WOL Spectral Egi Flare Breath',
      netRegex: NetRegexes.tether({ source: 'Spectral Egi', id: '0011' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Point tether outside',
      },
    },
  ],
}];
