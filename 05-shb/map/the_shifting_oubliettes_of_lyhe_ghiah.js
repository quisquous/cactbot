// TODO: Secret Pegasus (greater summon)
// TODO: Greedy Pixie (greater summon)
// TODO: Daen Ose The Avaricious (final summon)
// TODO: Daen Ose The Avaricious (Ultros form, alternate final summon)
const lyheGhiahOutputStrings = {
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
  zoneId: ZoneId.TheShiftingOubliettesOfLyheGhiah,
  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Fuath Trickster Spawn',
      // 9774 = Fuath Trickster
      type: 'AddedCombatant',
      netRegex: { npcNameId: '9774' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: lyheGhiahOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah The Keeper of the Keys Spawn',
      // 9773 = The Keeper of the Keys
      type: 'AddedCombatant',
      netRegex: { npcNameId: '9773' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: lyheGhiahOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Dungeon Crew Spawn',
      // 9801 = Secret Onion
      // 9802 = Secret Egg
      // 9803 = Secret Garlic
      // 9804 = Secret Tomato
      // 9805 = Secret Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: '980[1-5]', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dungeon Crew spawned, kill in order!',
          de: 'Verlies-Mandragora erscheinen, in Reihenfolge besiegen!',
          cn: '已生成 宝库蔓德拉战队, 依次击杀!',
          ko: '만드라즈 등장, 순서대로 잡기!',
        },
      },
    },
    // ---------------- lesser summons ----------------
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Swallow Electric Whorl',
      type: 'StartsUsing',
      netRegex: { id: '54D8', source: 'Secret Swallow', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Swallow Seventh Wave',
      type: 'StartsUsing',
      netRegex: { id: '54D7', source: 'Secret Swallow', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Swallow Ceras',
      type: 'StartsUsing',
      netRegex: { id: '54D4', source: 'Secret Swallow' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Djinn Whirling Gaol',
      type: 'StartsUsing',
      netRegex: { id: '5496', source: 'Secret Djinn', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Djinn Whipwind',
      type: 'StartsUsing',
      netRegex: { id: '5498', source: 'Secret Djinn', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Undine Hydrotaph',
      // summons Flawless Bubble orbs (cast Hydrofan, large cone AoE)
      type: 'StartsUsing',
      netRegex: { id: '549D', source: 'Secret Undine', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Cladoselache Protolithic Puncture',
      type: 'StartsUsing',
      netRegex: { id: '54C7', source: 'Secret Cladoselache' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Worm Brine Breath',
      type: 'StartsUsing',
      netRegex: { id: '54CE', source: 'Secret Worm' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Serpent Fang\'s End',
      type: 'StartsUsing',
      netRegex: { id: '54C3', source: 'Secret Serpent' },
      response: Responses.tankBuster(),
    },
    // ---------------- greater summons ----------------
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Basket Pollen Corona',
      type: 'StartsUsing',
      netRegex: { id: '54DA', source: 'Secret Basket', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Basket Earth Crusher',
      type: 'StartsUsing',
      netRegex: { id: '54DF', source: 'Secret Basket', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Basket Earthquake',
      type: 'StartsUsing',
      netRegex: { id: '54E1', source: 'Secret Basket', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Basket Straight Punch',
      type: 'StartsUsing',
      netRegex: { id: '54D9', source: 'Secret Basket' },
      response: Responses.tankBuster(),
    },
    // Secret Pegasus: Burning Bright - front line AoE
    // Secret Pegasus: Nicker - PBAoE
    // Secret Pegasus: Cloud Call - summon Thunderhead adds (move around, cast Lightning Bolt PBAoE)*
    // Greedy Pixie: Wind Rune - front line AoE
    // Greedy Pixie: Song Rune - AoE on random player
    // Greedy Pixie: Storm Rune - roomwide AoE, summons adds? (Pixie Double, Secret Morpho)*
    // Greedy Pixie: Bush Bash - PBAoE?
    // Greedy Pixie: Nature Call - large front cone AoE
    // ---------------- elder summons ----------------
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Fuath Troublemaker Toy Hammer',
      type: 'StartsUsing',
      netRegex: { id: '54E6', source: 'Fuath Troublemaker' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Fuath Troublemaker Hydrocannon',
      type: 'StartsUsing',
      netRegex: { id: '54E9', source: 'Fuath Troublemaker' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Fuath Troublemaker Croaking Chorus',
      type: 'StartsUsing',
      netRegex: { id: '54EA', source: 'Fuath Troublemaker', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: lyheGhiahOutputStrings.adds,
      },
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Korrigan Ram',
      type: 'StartsUsing',
      netRegex: { id: '54A9', source: 'Secret Korrigan' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Korrigan Hypnotize',
      type: 'StartsUsing',
      netRegex: { id: '54AA', source: 'Secret Korrigan', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Korrigan Saibai Mandragora',
      type: 'StartsUsing',
      netRegex: { id: '54AC', source: 'Secret Korrigan', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: lyheGhiahOutputStrings.adds,
      },
    },
    {
      id: 'Shifting Oubliettes of Lyhe Ghiah Secret Keeper Heavy Scrapline',
      type: 'StartsUsing',
      netRegex: { id: '54B1', source: 'Secret Keeper', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- final summon: Daen Ose The Avaricious ----------------
    // Daen Ose The Avaricious: Petrifaction - gaze*
    // Daen Ose The Avaricious: Abyssal Reaper - large PBAoE
    // Daen Ose The Avaricious: Petriburst - stack + look away from target?*
    // Daen Ose The Avaricious: Void Stream - alternating proteans (Hades Shadow Spread)?
    // Daen Ose The Avaricious: Sickle Strike - tankbuster*
    // Daen Ose The Avaricious: Petrifaction (variation) - gaze on random target*
    // ---------------- alternate final summon: Daen Ose The Avaricious (Ultros form) ----------------
    // Daen Ose The Avaricious (Ultros form): Megavolt - PBAoE
    // Daen Ose The Avaricious (Ultros form): Waterspout - AoE on random players
    // Daen Ose The Avaricious (Ultros form): Aqua Breath - front cone AoE
    // Daen Ose The Avaricious (Ultros form): Thunder III - tankbuster?*
    // Daen Ose The Avaricious (Ultros form): Wave of Turmoil - knockback from center with AoEs on outside*
    // Daen Ose The Avaricious (Ultros form): Falling Water - baited AoE on marked player
  ],
});
