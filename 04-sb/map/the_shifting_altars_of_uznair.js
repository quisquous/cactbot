// TODO: Altar Manticore (alternate final summon)
// TODO: Altar Diresaur (alternate final summon)
const uznairOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '已生成 ${name}!',
    ko: '${name} 등장!',
  },
  adds: {
    en: 'Adds soon',
    de: 'Bald Adds',
    cn: '小怪即将出现',
    ko: '곧 쫄 나옴',
  },
};
Options.Triggers.push({
  id: 'TheShiftingAltarsOfUznair',
  zoneId: ZoneId.TheShiftingAltarsOfUznair,
  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Shifting Altars of Uznair Gold Whisker Spawn',
      // 7602 = Gold Whisker
      type: 'AddedCombatant',
      netRegex: { npcNameId: '7602' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Matanga Spawn',
      // 7603 = Altar Matanga
      type: 'AddedCombatant',
      netRegex: { npcNameId: '7603' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Assembly Spawn',
      // 7604 = Altar Onion
      // 7605 = Altar Egg
      // 7606 = Altar Garlic
      // 7607 = Altar Tomato
      // 7608 = Altar Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: '760[4-8]', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Altar Assembly spawned, kill in order!',
          de: 'Altar-Mandragora erscheinen, in Reihenfolge besiegen!',
          cn: '已生成 神殿蔓德拉战队, 依次击杀!',
          ko: '만드라즈 등장, 순서대로 잡기!',
        },
      },
    },
    // ---------------- lesser summons ----------------
    {
      id: 'Shifting Altars of Uznair Altar Chimera Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '3452', source: 'Altar Chimera', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Chimera Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '3453', source: 'Altar Chimera', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Shifting Altars of Uznair Altar Skatene Reckless Abandon',
      type: 'StartsUsing',
      netRegex: { id: '33FF', source: 'Altar Skatene' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Skatene Void Call',
      type: 'StartsUsing',
      netRegex: { id: '3400', source: 'Altar Skatene', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: uznairOutputStrings.adds,
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Totem Flames of Fury Collect',
      // triggers off of the first autoattack from Altar Totem
      type: 'Ability',
      netRegex: { id: '366', source: 'Altar Totem', capture: false },
      preRun: (data) => data.altarTotem = true,
      suppressSeconds: 999999,
    },
    {
      id: 'Shifting Altars of Uznair Altar Totem Flames of Fury',
      // 3 baited AoEs that leave persistent flame puddles
      // same headmarker is used by multiple summons for different attacks
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        if (data.altarTotem)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Bait three puddles',
          de: '3 Flächen ködern',
          cn: '诱导三个圈圈',
          ko: '장판 3개 유도',
        },
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Totem Flames of Fury Cleanup',
      type: 'WasDefeated',
      netRegex: { target: 'Altar Totem', capture: false },
      preRun: (data) => delete data.altarTotem,
    },
    {
      id: 'Shifting Altars of Uznair Altar Beast Words of Woe',
      type: 'StartsUsing',
      netRegex: { id: '33CC', source: 'Altar Beast', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Beast Eye of the Fire',
      type: 'StartsUsing',
      netRegex: { id: '33CF', source: 'Altar Beast', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Shifting Altars of Uznair Altar Beast The Spin',
      // proximity AoE from boss
      type: 'StartsUsing',
      netRegex: { id: '33CE', source: 'Altar Beast', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Altars of Uznair Hati Polar Roar',
      type: 'StartsUsing',
      netRegex: { id: '3430', source: 'Hati', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Shifting Altars of Uznair Hati Brain Freeze',
      type: 'StartsUsing',
      netRegex: { id: '3431', source: 'Hati', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Dullahan Stygian Release',
      type: 'StartsUsing',
      netRegex: { id: '3402', source: 'Altar Dullahan', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Dullahan Villainous Rebuke',
      type: 'StartsUsing',
      netRegex: { id: '3403', source: 'Altar Dullahan' },
      response: Responses.stackMarkerOn(),
    },
    // ---------------- greater summons ----------------
    {
      id: 'Shifting Altars of Uznair The Winged Sideslip',
      // summons Feather of the Winged orbs (cast Pinion, hatch-pattern line AoEs)
      type: 'StartsUsing',
      netRegex: { id: '3444', source: 'The Winged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Shifting Altars of Uznair The Older One Mystic Flash',
      type: 'StartsUsing',
      netRegex: { id: '3449', source: 'The Older One' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair The Older One Mystic Levin',
      // summons Altar Idol adds (cast Msytic Heat line AoE and Self Detonate PBAoE)
      type: 'StartsUsing',
      netRegex: { id: '344D', source: 'The Older One', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Kelpie Torpedo',
      type: 'StartsUsing',
      netRegex: { id: '347E', source: 'Altar Kelpie' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Kelpie Rising Seas',
      // also a roomwide AoE
      type: 'StartsUsing',
      netRegex: { id: '3480', source: 'Altar Kelpie', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Kelpie Hydro Push',
      type: 'StartsUsing',
      netRegex: { id: '3482', source: 'Altar Kelpie', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Arachne Dark Spike',
      type: 'StartsUsing',
      netRegex: { id: '341E', source: 'Altar Arachne' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Arachne Frond Affeared',
      type: 'StartsUsing',
      netRegex: { id: '35D8', source: 'Altar Arachne', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Arachne Implosion',
      type: 'StartsUsing',
      netRegex: { id: '341F', source: 'Altar Arachne', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- elder summons ----------------
    {
      id: 'Shifting Altars of Uznair Altar Mandragora Optical Intrusion',
      type: 'StartsUsing',
      netRegex: { id: '3437', source: 'Altar Mandragora' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Mandragora Saibai Mandragora',
      type: 'StartsUsing',
      netRegex: { id: '343A', source: 'Altar Mandragora', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: uznairOutputStrings.adds,
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Airavata Huff',
      type: 'StartsUsing',
      netRegex: { id: '343B', source: 'Altar Airavata' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Airavata Buffet',
      // uses Spin immediately after (large front cone in direction of Buffet target)
      type: 'StartsUsing',
      netRegex: { id: '343E', source: 'Altar Airavata' },
      response: Responses.knockbackOn(),
    },
    {
      id: 'Shifting Altars of Uznair The Great Gold Whisker Triple Trident',
      type: 'StartsUsing',
      netRegex: { id: '3434', source: 'The Great Gold Whisker' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair The Great Gold Whisker Fish out of Water',
      type: 'StartsUsing',
      netRegex: { id: '3436', source: 'The Great Gold Whisker', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: uznairOutputStrings.adds,
      },
    },
    // ---------------- final summon: Altar Apanda ----------------
    {
      id: 'Shifting Altars of Uznair Altar Apanda Deadly Hold',
      type: 'StartsUsing',
      netRegex: { id: '3484', source: 'Altar Apanda' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Apanda Tail Swing',
      // proximity AoE from boss
      type: 'StartsUsing',
      netRegex: { id: '3495', source: 'Altar Apanda', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Apanda Bone Shaker',
      // summons Profane Cane adds (cast cast Arcane Tide hatch-pattern line AoEs)
      type: 'StartsUsing',
      netRegex: { id: '3496', source: 'Altar Apanda', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- alternate final summon: Altar Manticore ----------------
    // Altar Manticore: Deadly Hold - tankbuster*
    // Altar Manticore: Fireball - stack*
    // Altar Manticore: Volcanic Howl - roomwide AoE*
    // Altar Manticore: Wild Charge - line AoE + knockback on marked player (marked player can aim)*
    // Altar Manticore: Tail Smash - large rear cone AoE, follows Wild Charge?
    // Altar Manticore: Ripper Claw - front cone AoE
    // ---------------- alternate final summon: Altar Diresaur ----------------
    // Altar Diresaur: Deadly Hold - tankbuster*
    // Altar Diresaur: Raging Inferno - roomwide AoE + several dodgable AoEs*
    // Altar Diresaur: Heat Breath - front cone AoE
    // Altar Diresaur: Tail Smash - large rear cone AoE
  ],
});
