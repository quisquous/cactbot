import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// Hades Ex
export default {
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
      netRegex: NetRegexes.tether({ source: 'Shadow of the Ancients', id: '0011' }),
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
        return e.type !== '15' && data.me in data.hasDark;
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'HadesEx Boss Tether',
      netRegex: NetRegexes.tether({ source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'], id: '000E', capture: false }),
      mistake: {
        type: 'warn',
        text: {
          en: 'Bosses Too Close',
          de: 'Bosses zu Nahe',
          fr: 'Boss trop proches',
          ja: 'ボス近すぎる',
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
      id: 'HadesEx Beyond Death Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      run: function(e, data, matches) {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = true;
      },
    },
    {
      id: 'HadesEx Beyond Death Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '566' }),
      run: function(e, data, matches) {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = false;
      },
    },
    {
      id: 'HadesEx Beyond Death',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      delaySeconds: function(e, data, matches) {
        return parseFloat(matches.duration) - 0.5;
      },
      deathReason: function(e, data, matches) {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      id: 'HadesEx Doom Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '6E9' }),
      run: function(e, data, matches) {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = true;
      },
    },
    {
      id: 'HadesEx Doom Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '6E9' }),
      run: function(e, data, matches) {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = false;
      },
    },
    {
      id: 'HadesEx Doom',
      netRegex: NetRegexes.gainsEffect({ effectId: '6E9' }),
      delaySeconds: function(e, data, matches) {
        return parseFloat(matches.duration) - 0.5;
      },
      deathReason: function(e, data, matches) {
        if (!data.hasDoom)
          return;
        if (!data.hasDoom[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
  ],
};
