'use strict';

// TODO: missing an orb during tornado phase
// TODO: jumping in the tornado damage??
// TODO: taking sungrace(4C80) or moongrace(4C82) with wrong debuff
// TODO: stygian spear/silver spear with the wrong debuff
// TODO: taking explosion from the wrong Chiaro/Scuro orb
// TODO: handle 4C89 Silver Stake tankbuster 2nd hit, as it's ok to have two in.

let wrongBuff = (str) => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
  };
};

let noBuff = (str) => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
  };
};

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(3\)$/,
  },
  zoneId: ZoneId.EdensVerseIconoclasmSavage,
  damageWarn: {
    'Silver Sword': '4C8E', // ground aoe
    'Overwhelming Force': '4C73', // add phase ground aoe
    'Strength in Numbers 1': '4C70', // add get under
    'Strength in Numbers 2': '4C71', // add get out
    'Paper Cut': '4C7D', // tornado ground aoes
    'Buffet': '4C77', // tornado ground aoes also??
  },
  damageFail: {
    'Betwixt Worlds': '4C6B', // purple ground line aoes
    'Crusade': '4C58', // blue knockback circle (standing in it)
    'Explosion': '4C6F', // didn't kill an add
  },
  triggers: [
    {
      // Laser tank buster 1
      id: 'E7S Stygian Stake',
      damageRegex: '4C34',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Spread markers
      id: 'E7S Silver Shot',
      damageRegex: '4C92',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Ice markers
      id: 'E7S Silver Scourge',
      damageRegex: '4C93',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Orb Explosion
      id: 'E7S Chiaro Scuro Explosion',
      damageRegex: '4D1[45]',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Interrupt
      id: 'E7S Advent Of Light',
      abilityRegex: '4C6E',
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E7S Astral Tracking',
      gainsEffectRegex: gLang.kEffect.AstralEffect,
      losesEffectRegex: gLang.kEffect.AstralEffect,
      run: function(e, data) {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[e.targetName] = e.gains;
      },
    },
    {
      id: 'E7S Umbral Tracking',
      gainsEffectRegex: gLang.kEffect.UmbralEffect,
      losesEffectRegex: gLang.kEffect.UmbralEffect,
      run: function(e, data) {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[e.targetName] = e.gains;
      },
    },
    {
      id: 'E7S Light\'s Course',
      damageRegex: ['4C62', '4C63', '4C64', '4C5B', '4C5F'],
      condition: function(e, data) {
        return !data.hasUmbral || !data.hasUmbral[e.targetName];
      },
      mistake: function(e, data) {
        if (data.hasAstral && data.hasAstral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7S Darks\'s Course',
      damageRegex: ['4C65', '4C66', '4C67', '4C5A', '4C60'],
      condition: function(e, data) {
        return !data.hasAstral || !data.hasAstral[e.targetName];
      },
      mistake: function(e) {
        if (data.hasUmbral && data.hasUmbral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        // This case is probably impossible, as the debuff ticks after death,
        // but leaving it here in case there's some rez or disconnect timing
        // that could lead to this.
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7S Crusade Knockback',
      // 4C76 is the knockback damage, 4C58 is the damage for standing on the puck.
      damageRegex: '4C76',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Knocked off' } };
      },
    },
  ],
}];
