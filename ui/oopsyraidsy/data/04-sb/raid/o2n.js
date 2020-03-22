'use strict';

// O2N - Deltascape 2.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V2\.0\)$/,
  },
  damageWarn: {
    'O2N Lower Explosion': '2513', // Large purple AoE circles on the floor
    'O2N Upper Explosion': '2503', // Large orange AoE circles in the air
    'O2N Main Quake': '24A5', // Non-telegraphed circle AoE, Fleshy Member
  },
  triggers: [
    {
      id: 'O2N Petrification Collect',
      gainsEffectRegex: gLang.kEffect.Petrification,
      run: function(e, data) {
        data.petrified = data.petrified || [];
        data.petrified.push(e.target);
      },
    },
    {
      id: 'O2N Demon Eye',
      abilityRegex: '250D',
      delaySeconds: 2,
      // Anyone who was petrified before Demon Eye hit them
      // should be covered in the Petrosphere warnings.
      // The delay should ensure that people who looked
      // are caught by this one.
      condition: function(e, data) {
        return !(data.petrified.includes(e.target));
      },
      mistake: function(e, data) {
        if (data.petrified.includes(e.target))
          return { type: 'warn', name: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O2N Petrification Collect',
      gainsEffectRegex: gLang.kEffect.Petrification,
      delaySeconds: 10,
      suppressSeconds: 15,
      run: function(e, data) {
        delete data.petrified;
      },
    },
    {
      // Instant tank cleave
      id: 'O2N Paranormal Wave',
      damageRegex: '250E',
      condition: function(e) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', name: e.targetName, text: e.abilityName };
      },
    },
    {

    },
  ],
}];
