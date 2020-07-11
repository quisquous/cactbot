'use strict';

[{
  zoneRegex: {
    en: /^Sohm Al \(Hard\)$/,
  },
  zoneId: ZoneId.SohmAlHard,
  damageWarn: {
    'Deadly Vapor': '1DC9', // Environmental circle AoEs
    'Deeproot': '1CDA', // Targeted circle AoE, Blooming Chichu trash
    'Odious Air': '1CDB', // Conal AoE, Blooming Chichu trash
    'Glorious Blaze': '1C33', // Circle AoE, Small Spore Sac, boss 1
    'Foul Waters': '118A', // Conal AoE, Mountaintop Opken trash
    'Plain Pound': '1187', // Targeted circle AoE, Mountaintop Hropken trash
    'Palsynyxis': '1161', // Conal AoE, Overgrown Difflugia trash
    'Surface Breach': '1E80', // Circle AoE, Giant Netherworm trash
    'Freshwater Cannon': '119F', // Line AoE, Giant Netherworm trash
    'Tail Smash': '1C35', // Untelegraphed rear conal AoE, Gowrow, boss 2
    'Tail Swing': '1C36', // Untelegraphed circle AoE, Gowrow, boss 2
    'Ripper Claw': '1C37', // Untelegraphed frontal AoE, Gowrow, boss 2
    'Wind Slash': '1C38', // Circle AoE, Gowrow, boss 2
    'Wild Charge': '1C39', // Dash attack, Gowrow, boss 2
    'Hot Charge': '1C3A', // Dash attack, Gowrow, boss 2
    'Fireball': '1C3B', // Untelegraphed targeted circle AoE, Gowrow, boss 2
    'Lava Flow': '1C3C', // Untelegraphed conal AoE, Gowrow, boss 2
    'Wild Horn': '1507', // Conal AoE, Abalathian Clay Golem trash
    'Lava Breath': '1C4D', // Conal AoE, Lava Crab trash
    'Ring of Fire': '1C4C', // Targeted circle AoE, Volcano Anala trash
    'Molten Silk 1': '1C43', // 270-degree frontal AoE, Lava Scorpion, boss 3
    'Molten Silk 2': '1C44', // 270-degree rear AoE, Lava Scorpion, boss 3
    'Molten Silk 3': '1C42', // Ring AoE, Lava Scorpion, boss 3
    'Realm Shaker': '1C41', // Circle AoE, Lava Scorpion, boss 3
  },
  triggers: [
    {
      // Warns if players step into the lava puddles. There is unfortunately no direct damage event.
      id: 'Sohm Al Hard Burns',
      netRegex: NetRegexes.gainsEffect({ effectId: '11C' }),
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
  ],
}];
