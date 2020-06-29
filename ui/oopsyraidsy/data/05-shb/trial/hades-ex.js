'use strict';

// Hades Ex
[{
  zoneRegex: {
    en: /^The Minstrel's Ballad: Hades's Elegy$/,
    cn: /^哈迪斯孤念歼灭战$/,
    ko: /^극 하데스 토벌전$/,
  },
  zoneId: ZoneId.TheMinstrelsBalladHadessElegy,
  damageWarn: {
    'HadesEx Shadow Spread 2': '47AA',
    'HadesEx Shadow Spread 3': '47E4',
    'HadesEx Shadow Spread 4': '47E5',
    // Everybody stacks in good faith for Bad Faith, so don't call it a mistake.
    // 'HadesEx Bad Faith 1': '47AD',
    // 'HadesEx Bad Faith 2': '47B0',
    // 'HadesEx Bad Faith 3': '47AE',
    // 'HadesEx Bad Faith 4': '47AF',
    'HadesEx Broken Faith': '47B2',
    'HadesEx Magic Spear': '47B6',
    'HadesEx Magic Chakram': '47B5',
    'HadesEx Forked Lightning': '47C9',
    'HadesEx Dark Current 1': '47F1',
    'HadesEx Dark Current 2': '47F2',
  },
  damageFail: {
    'HadesEx Comet': '47B9', // missed tower
    'HadesEx Ancient Eruption': '47D3',
    'HadesEx Purgation 1': '47EC',
    'HadesEx Purgation 2': '47ED',
    'HadesEx Shadow Stream': '47EA',
    'HadesEx Dead Space': '47EE',
  },
  shareWarn: {
    'HadesEx Shadow Spread Initial': '47A9',
    'HadesEx Ravenous Assault': '(?:47A6|47A7)',
    'HadesEx Dark Flame 1': '47C6',
    'HadesEx Dark Freeze 1': '47C4',
    'HadesEx Dark Freeze 2': '47DF',
  },
  triggers: [
    {
      id: 'HadesEx Dark II Tether',
      regex: Regexes.tether({ source: 'Shadow of the Ancients', id: '0011' }),
      run: function(e, data, matches) {
        data.hasDark = data.hasDark || [];
        data.hasDark.push(matches.target);
      },
    },
    {
      id: 'HadesEx Dark II',
      damageRegex: '47BA',
      condition: function(e, data) {
        // Don't blame people who don't have tethers.
        return e.type != '15' && data.me in data.hasDark;
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'HadesEx Boss Tether',
      regex: Regexes.tether({ source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'], id: '000E', capture: false }),
      mistake: {
        type: 'warn',
        text: {
          en: 'Bosses Too Close',
          de: 'Bosses zu Nahe',
          fr: 'Boss trop proches',
          cn: 'BOSS靠太近了',
          ko: '쫄들이 너무 가까움',
        },
      },
    },
    {
      id: 'HadesEx Death Shriek',
      damageRegex: '47CB',
      condition: function(e, data) {
        return e.damage > 0;
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'HadesEx Beyond Death Track',
      gainsEffectRegex: gLang.kEffect.BeyondDeath,
      losesEffectRegex: gLang.kEffect.BeyondDeath,
      run: function(e, data) {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[e.targetName] = e.gains;
      },
    },
    {
      id: 'HadesEx Beyond Death',
      gainsEffectRegex: gLang.kEffect.BeyondDeath,
      delaySeconds: function(e) {
        return e.durationSeconds - 0.5;
      },
      deathReason: function(e, data) {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[e.targetName])
          return;
        return {
          name: e.targetName,
          reason: e.effectName,
        };
      },
    },
    {
      id: 'HadesEx Doom Track',
      gainsEffectRegex: gLang.kEffect.Doom,
      losesEffectRegex: gLang.kEffect.Doom,
      run: function(e, data) {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[e.targetName] = e.gains;
      },
    },
    {
      id: 'HadesEx Doom',
      gainsEffectRegex: gLang.kEffect.Doom,
      delaySeconds: function(e) {
        return e.durationSeconds - 0.5;
      },
      deathReason: function(e, data) {
        if (!data.hasDoom)
          return;
        if (!data.hasDoom[e.targetName])
          return;
        return {
          name: e.targetName,
          reason: e.effectName,
        };
      },
    },
  ],
}];
