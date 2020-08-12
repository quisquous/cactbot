'use strict';

[{
  zoneId: ZoneId.TheHeroesGauntlet,
  timelineFile: 'heroes_gauntlet.txt',
  triggers: [
    {
      id: 'Heroes Gauntlet Spectral Dream',
      netRegex: NetRegexes.startsUsing({ id: '4FCB', source: 'Spectral Thief' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Heroes Gauntlet Spectral Gust',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Heroes Gauntlet Spectral Whirlwind',
      netRegex: NetRegexes.startsUsing({ id: '4FCC', source: 'Spectral Thief', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Spectral Thief tethers to the locations where it will attack.
      id: 'Heroes Gauntlet Spectral Tether',
      netRegex: NetRegexes.tether({ id: '000C', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Away from tether marker',
      },
    },
    {
      id: 'Heroes Gauntlet Large Zombie Tether',
      netRegex: NetRegexes.tether({ id: '004F' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Heroes Gauntlet Twisted Touch',
      netRegex: NetRegexes.startsUsing({ id: '4F5E', source: 'Spectral Necromancer' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Heroes Gauntlet Chaos Storm',
      netRegex: NetRegexes.startsUsing({ id: '4F60', source: 'Spectral Necromancer', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'Heroes Gauntlet Beastly Fury',
      netRegex: NetRegexes.startsUsing({ id: '520C', source: 'Spectral Berserker', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Both two and three uses of Slice can happen.
      id: 'Heroes Gauntlet Raging Slice',
      netRegex: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Spectral Berserker', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Heroes Gauntlet Wild Rampage',
      netRegex: NetRegexes.startsUsing({ id: '5206', source: 'Spectral Berserker', capture: false }),
      alertText: {
        en: 'Get in a crater',
      },
    },
    {
      id: 'Heroes Gauntlet Wild Rage',
      netRegex: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Spectral Berserker', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      // The same head marker is used for the initial player stack and the rock stacks.
      // If there's one stack marker, the players stack.
      // Otherwise they stack on the rock they drop.
      id: 'Heroes Gauntlet Wild Anguish Collect',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      run: function(data, matches) {
        data.anguish = data.anguish || [];
        data.anguish.push(matches.target);
      },
    },
    {
      id: 'Heroes Gauntlet Wild Anguish Resolve',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      delaySeconds: 1,
      suppressSeconds: 5,
      alertText: function(data, matches) {
        if (data.anguish.length > 1) {
          return {
            en: 'Stack on your rock',
          };
        }
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Packez-vous sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にスタック',
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
          ko: '쉐어징 → ' + data.ShortName(matches.target),
        };
      },
      run: function(data) {
        delete data.anguish;
      },
    },
    {
      id: 'Heroes Gauntlet Wild Anguish Spread',
      netRegex: NetRegexes.headMarker({ id: '005E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
}];
