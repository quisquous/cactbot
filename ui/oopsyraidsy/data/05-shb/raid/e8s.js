'use strict';

// TODO: rush hitting the crystal
// TODO: adds not being killed
// TODO: taking the rush twice (when you have debuff)
// TODO: not hitting the dragon four times during wyrm's lament
// TODO: death reasons for not picking up puddle
// TODO: not being in the tower when you should
// TODO: picking up too many stacks

// Note: Banish III (4DA8) and Banish Iii Divided (4DA9) both are type=0x16 lines.
// The same is true for Banish (4DA6) and Banish Divided (4DA7).
// I'm not sure this makes any sense? But can't tell if the spread was a mistake or not.
// Maybe we could check for "Magic Vulnerability Up"?

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(4\)$/,
  },
  zoneId: ZoneId.EdensVerseRefulgenceSavage,
  damageWarn: {
    'Biting Frost': '4D66', // 270-degree frontal AoE, Shiva
    'Driving Frost': '4D67', // Rear cone AoE, Shiva
    'Axe Kick': '4D6D', // Large circle AoE, Shiva
    'Scythe Kick': '4D6E', // Donut AoE, Shiva
    'Reflected Axe Kick': '4DB9', // Large circle AoE, Frozen Mirror
    'Reflected Scythe Kick': '4DBA', // Donut AoE, Frozen Mirror
    'Frigid Eruption': '4D9F', // Small circle AoE puddles, phase 1
    'Frigid Needle': '4D9D', // 8-way "flower" explosion
    'Icicle Impact': '4DA0', // Large circle AoE puddles, phase 1
    'Reflected Biting Frost 1': '4DB7', // 270-degree frontal AoE, Frozen Mirror
    'Reflected Biting Frost 2': '4DC3', // 270-degree frontal AoE, Frozen Mirror
    'Reflected Driving Frost 1': '4DB8', // Cone AoE, Frozen Mirror
    'Reflected Driving Frost 2': '4DC4', // Cone AoE, Frozen Mirror

    'Hallowed Wings 1': '4D75', // Left cleave
    'Hallowed Wings 2': '4D76', // Right cleave
    'Hallowed Wings 3': '4D77', // Knockback frontal cleave
    'Reflected Hallowed Wings 1': '4D90', // Reflected left 2
    'Reflected Hallowed Wings 2': '4DBB', // Reflected left 1
    'Reflected Hallowed Wings 3': '4DC7', // Reflected right 2
    'Reflected Hallowed Wings 4': '4D91', // Reflected right 1
    'Twin Stillness 1': '4D68',
    'Twin Stillness 2': '4D6B',
    'Twin Silence 1': '4D69',
    'Twin Silence 2': '4D6A',
    'Akh Rhai': '4D99',
    'Embittered Dance 1': '4D70',
    'Embittered Dance 2': '4D71',
    'Spiteful Dance 1': '4D6F',
    'Spiteful Dance 2': '4D72',
  },
  damageFail: {
    // Broken tether.
    // TODO: add suppressSeconds to oopsy.
    'Refulgent Fate': '4DA4',
    // Shared orb, correct is Bright Pulse (4D95)
    'Blinding Pulse': '4D96',
  },
  triggers: [
    {
      id: 'E8S Shining Armor',
      gainsEffectRegex: gLang.kEffect.Stun,
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, reason: gLang.kEffect.Stun };
      },
    },
    {
      // Interrupt
      id: 'E8S Stoneskin',
      abilityRegex: '4D85',
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Protean
      id: 'E8S Path of Light',
      damageRegex: '4DA1',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
