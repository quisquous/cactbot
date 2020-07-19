'use strict';

// TODO: some sort of warning about extra tank damage during bow phase?
// TODO: should the post-staff "spread" happen unconditionally prior to marker?

[{
  zoneRegex: {
    en: /^Akh Afah Amphitheatre \(Extreme\)$/,
  },
  zoneId: ZoneId.AkhAfahAmphitheatreExtreme,
  timelineFile: 'shiva-ex.txt',
  timelineTriggers: [
    {
      id: 'ShivaEx Absolute Zero',
      regex: /Absolute Zero/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      // These are usually doubled, so avoid spamming.
      suppressSeconds: 10,
      response: Responses.aoe(),
    },
    {
      id: 'ShivaEx Icebrand',
      regex: /Icebrand/,
      beforeSeconds: 5,
      alertText: {
        en: 'Party Share Tankbuster',
      },
    },
  ],
  triggers: [
    {
      id: 'ShivaEx Staff Phase',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '995', capture: false }),
      response: function(data) {
        if (data.role === 'tank') {
          if (data.currentTank && data.blunt && data.blunt[data.currentTank]) {
            return {
              alertText: {
                en: 'Staff (Tank Swap)',
              },
            };
          }
        }

        return {
          infoText: {
            en: 'Staff',
          },
        };
      },
      run: function(data) {
        data.soonAfterWeaponChange = true;
      },
    },
    {
      id: 'ShivaEx Sword Phase',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '993', capture: false }),
      response: function(data) {
        if (data.role === 'tank') {
          if (data.currentTank && data.slashing && data.slashing[data.currentTank]) {
            return {
              alertText: {
                en: 'Sword (Tank Swap)',
              },
            };
          }
        }

        return {
          infoText: {
            en: 'Sword',
          },
        };
      },
      run: function(data) {
        data.soonAfterWeaponChange = true;
      },
    },
    {
      id: 'ShivaEx Weapon Change Delayed',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: ['993', '995'], capture: false }),
      delaySeconds: 30,
      run: function(data) {
        data.soonAfterWeaponChange = false;
      },
    },
    {
      id: 'ShivaEx Slashing Resistance Down Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '23C' }),
      run: function(data, matches) {
        data.slashing = data.slashing || {};
        data.slashing[matches.target] = true;
      },
    },
    {
      id: 'ShivaEx Slashing Resistance Down Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '23C' }),
      run: function(data, matches) {
        data.slashing = data.slashing || {};
        data.slashing[matches.target] = false;
      },
    },
    {
      id: 'ShivaEx Blunt Resistance Down Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '23D' }),
      run: function(data, matches) {
        data.blunt = data.blunt || {};
        data.blunt[matches.target] = true;
      },
    },
    {
      id: 'ShivaEx Blunt Resistance Down Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '23D' }),
      run: function(data, matches) {
        data.blunt = data.blunt || {};
        data.blunt[matches.target] = false;
      },
    },
    {
      id: 'ShivaEx Current Tank',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: 'BE5' }),
      run: function(data, matches) {
        data.currentTank = matches.target;
      },
    },
    {
      id: 'ShivaEx Hailstorm Marker',
      netRegex: NetRegexes.headMarker({ id: '001D' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread('alert'),
    },
    {
      id: 'ShivaEx Glacier Bash',
      netRegex: NetRegexes.startsUsing({ id: 'BE9', capture: false }),
      response: Responses.getBehind('info'),
    },
    {
      id: 'ShivaEx Whiteout',
      netRegex: NetRegexes.startsUsing({ id: 'BEC', capture: false }),
      response: Responses.getIn('alert'),
    },
    {
      id: 'ShivaEx Diamond Dust',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '98A', capture: false }),
      run: function(data) {
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaEx Frost Bow',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: 'BDD', capture: false }),
      response: Responses.getBehind('alarm'),
      run: function(data) {
        // Just in case ACT has crashed or something, make sure this state is correct.
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaEx Avalanche Marker Me',
      netRegex: NetRegexes.headMarker({ id: '001A' }),
      condition: Conditions.targetIsYou(),
      // Responses.knockback does not quite give the 'laser cleave' aspect here.
      alarmText: {
        en: 'Knockback Laser on YOU',
      },
    },
    {
      id: 'ShivaEx Avalanche Marker Other',
      netRegex: NetRegexes.headMarker({ id: '001A' }),
      condition: Conditions.targetIsNotYou(),
      infoText: {
        en: 'Avoid Laser',
      },
    },
    {
      id: 'ShivaEx Shiva Circles',
      netRegex: NetRegexes.abilityFull({ source: 'Shiva', id: 'BEB' }),
      condition: function(data, matches) {
        // Ignore other middle circles and try to only target the Icicle Impact x9.
        if (!data.seenDiamondDust || data.soonAfterWeaponChange)
          return false;

        let x = parseFloat(matches.x);
        let y = parseFloat(matches.y);
        return Math.abs(x) < 0.1 && Math.abs(y) < 0.1;
      },
      response: Responses.goMiddle('info'),
    },
    {
      id: 'ShivaEx Permafrost',
      netRegex: NetRegexes.startsUsing({ id: 'BE3', capture: false }),
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'ShivaEx Ice Boulder',
      netRegex: NetRegexes.ability({ id: 'C8A' }),
      condition: Conditions.targetIsNotYou(),
      infoText: function(data, matches) {
        return {
          en: 'Free ' + data.ShortName(matches.target),
        };
      },
    },
  ],
}];
