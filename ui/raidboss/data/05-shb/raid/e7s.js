'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(3\)$/,
  },
  timelineFile: 'e7s.txt',
  triggers: [
    {
      id: 'E7S Empty Wave',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C8A', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'E7S Unshadowed Stake',
      regex: Regexes.tether({ source: 'The Idol Of Darkness', id: '0025' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E7S Betwixt Worlds',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4CFD', capture: false }),
      run: function(data) {
        data.phase = 'betwixtWorlds';
      },
    },
    {
      id: 'E7S Betwixt Worlds Tether',
      regex: Regexes.tether({ source: 'The Idol Of Darkness', id: '0011' }),
      preRun: function(data, matches) {
        data.betwixtWorldsTethers = data.betwixtWorldsTethers || [];
        data.betwixtWorldsTethers.push(matches.target);
      },
      condition: function(data, matches) {
        return data.phase == 'betwixtWorlds' && data.me == matches.target;
      },
      infoText: {
        en: 'Tether on YOU',
      },
    },
    {
      id: 'E7S Betwixt Worlds Stack',
      regex: Regexes.headMarker({ id: '0064' }),
      preRun: function(data, matches) {
        data.betwixtWorldsStack = data.betwixtWorldsStack || [];
        data.betwixtWorldsStack.push(matches.target);
      },
      condition: function(data) {
        return data.phase == 'betwixtWorlds';
      },
      alertText: function(data, matches) {
        if (data.betwixtWorldsTethers.indexOf(data.me))
          return;
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Stack sur VOUS',
            ko: '나에게 모이기',
          };
        }
        if (data.betwixtWorldsStack.length == 1)
          return;
        let names = data.betwixtWorldsStack.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Stack (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'E7S Left With Thee',
      regex: Regexes.gainsEffect({ effect: 'Left With Thee' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Left',
      },
    },
    {
      id: 'E7S Left With Right',
      regex: Regexes.gainsEffect({ effect: 'Right With Thee' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Right',
      },
    },
    {
      id: 'E7S Forward With Thee',
      regex: Regexes.gainsEffect({ effect: 'Forward With Thee' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Forward',
      },
    },
    {
      id: 'E7S Back With Thee',
      regex: Regexes.gainsEffect({ effect: 'Back With Thee' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Back',
      },
    },
    {
      id: 'E7S False Midnight',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C99', capture: false }),
      run: function(data) {
        data.phase = 'falseMidnight';
      },
    },
    {
      id: 'E7S Silver Shot',
      regex: Regexes.headMarker({ id: '0065' }),
      preRun: function(data, matches) {
        data.falseMidnightSpread = data.falseMidnightSpread || [];
        data.falseMidnightSpread.push(matches.target);
      },
      condition: function(data, matches) {
        return data.phase == 'falseMidnight' && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'E7S Silver Sledge',
      regex: Regexes.headMarker({ id: '0064' }),
      condition: function(data) {
        return data.phase == 'falseMidnight';
      },
      alertText: function(data, matches) {
        if (data.falseMidnightSpread.indexOf(data.me))
          return;
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Stack sur VOUS',
            ko: '나에게 모이기',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(target),
          de: 'Auf ' + data.ShortName(target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'にスタック',
          cn: '靠近 ' + data.ShortName(target) + '集合',
          ko: '쉐어 → ' + data.ShortName(target),
        };
      },
    },
    {
      id: 'E7S Adds',
      regex: Regexes.addedCombatant({ name: 'Blasphemy', capture: false }),
      suppressSeconds: 1,
      run: function(data) {
        data.phase = 'adds';
      },
    },
    {
      id: 'E7S Insatiable Light Stack',
      regex: Regexes.headMarker({ id: '0064' }),
      preRun: function(data, matches) {
        data.insatiableLightStack = data.insatiableLightStack || [];
        data.insatiableLightStack.push(matches.target);
      },
      condition: function(data) {
        return data.phase == 'adds';
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Stack sur VOUS',
            ko: '나에게 모이기',
          };
        }
        if (data.insatiableLightStack.length == 1)
          return;
        let names = data.insatiableLightStack.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Stack (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'E7S Insatiable Light',
      regex: Regexes.ability({ source: 'Idolatry', id: '4C6D', capture: false }),
      run: function(data) {
        data.insatiableLightStack = [];
      },
    },
    {
      id: 'E7S Strength in Numbers',
      regex: Regexes.startsUsing({ source: 'Idolatry', id: '4C70', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Get under vertical add',
      },
    },
    {
      id: 'E7S Unearned Envy',
      regex: Regexes.ability({ source: 'Blasphemy', id: '4C74', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      durationSeconds: 7,
      response: Responses.aoe(),
    },
    {
      id: 'E7S Empty Flood',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '(?:4C8[BC]|4E5[56])', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'E7S Unjoined Aspect',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C3B', capture: false }),
      run: function(data) {
        data.colorMap = {};
        data.colorMap['light'] = {
          en: 'Dark',
        };
        data.colorMap['dark'] = {
          en: 'Light',
        };
      },
    },
    {
      id: 'E7S Astral Effect',
      regex: Regexes.gainsEffect({ effect: 'Astral Effect' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.color = 'light';
      },
    },
    {
      id: 'E7S Umbral Effect',
      regex: Regexes.gainsEffect({ effect: 'Umbral Effect' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.color = 'dark';
      },
    },
    {
      id: 'E7S Boundless Light',
      regex: Regexes.startsUsing({ source: 'Unforgiven Idolatry', id: '4C5C' }),
      condition: function(data) {
        return data.color == 'dark';
      },
      response: Responses.stackOn(),
    },
    {
      id: 'E7S Boundless Dark',
      regex: Regexes.startsUsing({ source: 'Unforgiven Idolatry', id: '4C5D' }),
      condition: function(data) {
        return data.color == 'light';
      },
      response: Responses.stackOn(),
    },
    {
      id: 'E7S Words of Night',
      regex: Regexes.startsUsing({ source: 'Unforgiven Idolatry', id: '(?:4C2C|4C65)', capture: false }),
      alertText: function(data) {
        return {
          en: 'Get hit by ' + data.colorMap[data.color][data.lang],
        };
      },
    },
    {
      id: 'E7S False Dawn',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C9A', capture: false }),
      suppressSeconds: 1,
      alertText: {
        en: 'Bait Puddles',
      },
    },
    {
      id: 'E7S Crusade',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C76', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E7S Threefold Grace',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C7E', capture: false }),
      alertText: function(data) {
        return {
          en: 'Stand in ' + data.colorMap[data.color][data.lang],
        };
      },
    },
  ],
  timelineReplace: [
  ],
}];
