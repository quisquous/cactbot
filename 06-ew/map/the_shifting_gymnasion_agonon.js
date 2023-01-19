// TODO: ::lesser summons::
// TODO: Gymnasiou Leon: Roar - large PBAoE
// TODO: Gymnasiou Leon: Pounce - tankbuster
// TODO: Gymnasiou Megakantha: all abilities
// TODO: Gymnasiou Pithekos: all abilities
// TODO: ::greater summons::
// TODO: Gymnasiou Acheloios: Volcanic Howl - ???
// TODO: Gymnasiou Styphnolobion: all abilities
// TODO: ::elder summons::
// TODO: ::final summons::
// TODO: Narkissos: Rock Hard - ???
// TODO: Narkissos: Putrid Breath - ???
// TODO: Hippomenes: all abilities
// TODO: Phaethon: all abilities
const agononOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    ja: '${name} 現れる！',
    cn: '已生成 ${name}!',
    ko: '${name} 등장!',
  },
  adds: {
    en: 'Adds soon',
    de: 'Bald Adds',
    ja: 'まもなくザコ出ます',
    cn: '小怪即将出现',
    ko: '곧 쫄 나옴',
  },
};
Options.Triggers.push({
  zoneId: ZoneId.TheShiftingGymnasionAgonon,
  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Lampas/Lyssa Spawn',
      // 12034 = Gymnasiou Lampas
      // 12035 = Gymnasiou Lyssa
      // these two sometimes spawn at the same time, so only trigger on one to keep from being too noisy
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1203[45]' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: agononOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Mandragorai Spawn',
      // 12036 = Gymnastic Onion
      // 12037 = Gymnastic Eggplant
      // 12038 = Gymnastic Garlic
      // 12039 = Gymnastic Tomato
      // 12040 = Gymnastic Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: ['1203[6-9]', '12040'], capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Gymnasiou Mandragorai spawned, kill in order!',
          de: 'Gymnasiou-Mandragorai erscheinen, in Reihenfolge besiegen!',
          ja: 'マンドラゴラ！順番に倒して！',
          ko: '만드라즈 등장, 순서대로 잡기',
        },
      },
    },
    // ---------------- lesser summons ----------------
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Leon Inferno Blast',
      type: 'StartsUsing',
      netRegex: { id: '7DCC', source: 'Gymnasiou Leon', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Leon Flare Star',
      // 802F - places proximity marker
      // 8030 - proximity aoe cast
      type: 'StartsUsing',
      netRegex: { id: '8030', source: 'Gymnasiou Leon', capture: false },
      response: Responses.aoe(),
    },
    // TODO: Gymnasiou Leon: Roar - large PBAoE
    // TODO: Gymnasiou Leon: Pounce - tankbuster
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Satyros Storm Wing',
      type: 'StartsUsing',
      netRegex: { id: '7DD[BD]', source: 'Gymnasiou Satyros', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid green nails',
          de: 'Weiche den grünen Nägeln aus',
          fr: 'Évitez les griffes',
          ja: '緑の杭に避け',
          cn: '躲避风刃',
          ko: '초록 발톱 피하기',
        },
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Satyros Dread Dive',
      type: 'StartsUsing',
      netRegex: { id: '7DDA', source: 'Gymnasiou Satyros' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Satyros Wingblow',
      type: 'StartsUsing',
      netRegex: { id: '7DE[01]', source: 'Gymnasiou Satyros', capture: false },
      suppressSeconds: 1,
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Triton Pelagic Cleaver',
      type: 'StartsUsing',
      netRegex: { id: '7DE6', source: 'Gymnasiou Triton', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Triton Aquatic Lance',
      type: 'StartsUsing',
      netRegex: { id: '7DE7', source: 'Gymnasiou Triton', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Triton Protolithic Puncture',
      type: 'StartsUsing',
      netRegex: { id: '7DE4', source: 'Gymnasiou Triton' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Tigris Absolute Zero',
      type: 'StartsUsing',
      netRegex: { id: '7DD0', source: 'Gymnasiou Tigris', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Tigris Eyeshine',
      type: 'StartsUsing',
      netRegex: { id: '7DCF', source: 'Gymnasiou Tigris', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Tigris Frumious Jaws',
      type: 'StartsUsing',
      netRegex: { id: '7DCE', source: 'Gymnasiou Tigris' },
      response: Responses.tankBuster(),
    },
    // Gymnasiou Megakantha: Odious Atmosphere - persistent front 180 channeled cleave
    // Gymnasiou Megakantha: Vine Whip - tankbuster
    // Gymnasiou Megakantha: Sludge Bomb - aoe under random player?
    // Gymnasiou Megakantha: Odious Air - front cone
    // Gymnasiou Pithekos: Thundercall - summon adds (Ball of Levin: cast Thunder IV)
    // Gymnasiou Pithekos:: Ball of Levin: Thunder IV - large PBAoE
    // Gymnasiou Pithekos: Spark - donut aoe
    // Gymnasiou Pithekos: Sweeping Gouge - tankbuster
    // Gymnasiou Pithekos: Lightning Bolt - aoe under random player?
    // Gymnasiou Pithekos: ??? - headmarker, determines where Ball of Levin will spawn? (bait to edge so Spark and Thunder IV don't overlap?)
    // ---------------- greater summons ----------------
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Acheloios Tail Swing',
      type: 'StartsUsing',
      netRegex: { id: '7E17', source: 'Gymnasiou Acheloios', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Acheloios Double Hammer',
      // TODO: same pattern every time?
      type: 'StartsUsing',
      netRegex: { id: '7E19', source: 'Gymnasiou Acheloios', capture: false },
      alertText: (_data, _matches, output) => {
        return output.text({ dir1: output.left(), dir2: output.right() });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        text: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          fr: '${dir1} => ${dir2}',
          ja: '${dir1} => ${dir2}',
          cn: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Acheloios Quadruple Hammer',
      // rotates counterclockwise after each cleave
      // TODO: same rotation/pattern every time?
      type: 'StartsUsing',
      netRegex: { id: '7E18', source: 'Gymnasiou Acheloios', capture: false },
      alertText: (_data, _matches, output) => {
        return output.text({
          dir1: output.left(),
          dir2: output.right(),
          dir3: output.left(),
          dir4: output.right(),
        });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        text: {
          en: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          de: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          fr: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          ja: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          cn: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          ko: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
        },
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Acheloios Deadly Hold',
      type: 'StartsUsing',
      netRegex: { id: '7E13', source: 'Gymnasiou Acheloios' },
      response: Responses.tankBuster(),
    },
    // TODO: Gymnasiou Acheloios: Volcanic Howl - ???
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Meganereis Wave of Turmoil',
      type: 'StartsUsing',
      netRegex: { id: '7E0[12]', source: 'Gymnasiou Meganereis', capture: false },
      suppressSeconds: 1,
      response: Responses.knockback(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Meganereis Falling Water',
      type: 'StartsUsing',
      netRegex: { id: '7E04', source: 'Gymnasiou Meganereis' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Meganereis Ceras',
      // inflicts Poison (829) for 15s
      type: 'StartsUsing',
      netRegex: { id: '7DFF', source: 'Gymnasiou Meganereis' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Meganereis Hydrocannon',
      type: 'StartsUsing',
      netRegex: { id: '7E00', source: 'Gymnasiou Meganereis', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Sphinx Explosion',
      // donut aoe centered on adds
      type: 'StartsUsing',
      netRegex: { id: '7E11', source: 'Verdant Plume', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Under Verdant Plume',
          de: 'Geh unter die blaue Feder',
          ja: '濃緑の羽根の下へ',
          ko: '진녹색 날개 밑으로',
        },
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Sphinx Fervid Pulse',
      type: 'StartsUsing',
      netRegex: { id: '7E10', source: 'Gymnasiou Sphinx', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Intercards',
          de: 'Interkardinal',
          fr: 'Intercardinal',
          ja: '斜め',
          ko: '대각선 쪽으로',
        },
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Sphinx Frigid Pulse',
      type: 'StartsUsing',
      netRegex: { id: '7E0E', source: 'Gymnasiou Sphinx', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Sphinx Feather Rain',
      // can overlap with Frigid Pulse, possibly too noisy?
      type: 'StartsUsing',
      netRegex: { id: '7E0F', source: 'Gymnasiou Sphinx' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Sphinx Scratch',
      type: 'StartsUsing',
      netRegex: { id: '7E09', source: 'Gymnasiou Sphinx' },
      response: Responses.tankBuster(),
    },
    // Gymnasiou Styphnolobion: Earth Quaker - PBAoE followed by donut aoe; later does earthshakers simultaneously
    // Gymnasiou Styphnolobion: Rake - tankbuster
    // Gymnasiou Styphnolobion: Stone III - aoe under random players?
    // Gymnasiou Styphnolobion: Earth Shaker - earth shakers on random players
    // Gymnasiou Styphnolobion: Tiiimbeeer (yes, it has 3 i's and 3 e's) - raidwide
    // ---------------- elder summons ----------------
    {
      id: 'Shifting Gymnasion Agonon Lyssa Chrysine Heavy Smash',
      type: 'StartsUsing',
      netRegex: { id: '7E3A', source: 'Lyssa Chrysine' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Shifting Gymnasion Agonon Lyssa Chrysine Frigid Needle',
      type: 'StartsUsing',
      netRegex: { id: '7E36', source: 'Lyssa Chrysine', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Shifting Gymnasion Agonon Lyssa Chrysine Circle of Ice',
      type: 'StartsUsing',
      netRegex: { id: '7E38', source: 'Lyssa Chrysine', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'Shifting Gymnasion Agonon Lyssa Chrysine Howl',
      type: 'StartsUsing',
      netRegex: { id: '7E28', source: 'Lyssa Chrysine', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: agononOutputStrings.adds,
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Lyssa Chrysine Skull Dasher',
      type: 'StartsUsing',
      netRegex: { id: '7E32', source: 'Lyssa Chrysine' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Lampas Chrysine Lightburst',
      type: 'StartsUsing',
      netRegex: { id: '7E22', source: 'Lampas Chrysine' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Lampas Chrysine Summon',
      type: 'StartsUsing',
      netRegex: { id: '7E20', source: 'Lampas Chrysine', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: agononOutputStrings.adds,
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Mandragoras Ram',
      type: 'StartsUsing',
      netRegex: { id: '7E29', source: 'Gymnasiou Mandragoras' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Mandragoras Saibai Mandragora',
      type: 'StartsUsing',
      netRegex: { id: '7E2C', source: 'Gymnasiou Mandragoras', capture: false },
      infoText: (_data, _matches, output) => output.adds(),
      outputStrings: {
        adds: agononOutputStrings.adds,
      },
    },
    // ---------------- final summon: Narkissos ----------------
    {
      id: 'Shifting Gymnasion Agonon Narkissos Fetching Fulgence',
      type: 'StartsUsing',
      netRegex: { id: '7E4C', source: 'Narkissos', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Shifting Gymnasion Agonon Narkissos Lash',
      type: 'StartsUsing',
      netRegex: { id: '7E4A', source: 'Narkissos' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Narkissos Extensible Tendrils',
      type: 'StartsUsing',
      netRegex: { id: '7E53', source: 'Narkissos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cardinals',
          de: 'Kardinal',
          fr: 'Cardinaux',
          ja: '十字回避',
          ko: '십자방향으로',
        },
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Narkissos Brainstorm',
      type: 'GainsEffect',
      // 7A6 = Forward March
      // 7A7 = About Face
      // 7A8 = Left Face
      // 7A9 = Right Face
      netRegex: { effectId: '7A[6-9]', source: 'Narkissos' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        const effectId = matches.effectId.toUpperCase();
        if (effectId === '7A6')
          return output.forward();
        if (effectId === '7A7')
          return output.backward();
        if (effectId === '7A8')
          return output.left();
        if (effectId === '7A9')
          return output.right();
      },
      outputStrings: {
        forward: {
          en: 'March Forward into Safe Spot',
          de: 'marschiere Vorwärts in die sichere Stelle',
          ja: '強制移動: 前',
          cn: '向前强制移动到安全区',
          ko: '강제 이동 앞',
        },
        backward: {
          en: 'March Backward into Safe Spot',
          de: 'marschiere Rückwärts in die sichere Stelle',
          ja: '強制移動: 後ろ',
          cn: '向后强制移动到安全区',
          ko: '강제 이동 뒤',
        },
        left: {
          en: 'March Left into Safe Spot',
          de: 'marschiere Links in die sichere Stelle',
          ja: '強制移動: 左',
          cn: '向左强制移动到安全区',
          ko: '강제 이동 왼쪽',
        },
        right: {
          en: 'March Right into Safe Spot',
          de: 'marschiere Rechts in die sichere Stelle',
          ja: '強制移動: 右',
          cn: '向右强制移动到安全区',
          ko: '강제 이동 오른쪽',
        },
      },
    },
    // Narkissos: Rock Hard - ???
    // Narkissos: Putrid Breath - ???
    // ---------------- alternate final summon: Hippomenes ----------------
    // Hippomenes: Charge Blaster - applies 270 cone buffs to boss
    // Hippomenes: Dibrid Blaster - fires two 270 cones back-to-back, direction indicated by boss buffs from Charge Blaster
    // Hippomenes: Gouge - tankbuster
    // Hippomenes: Rumbling Thunder - aoe under random players?
    // Hippomenes: Electric Whisker - cardinal cones plus spread aoes on players?
    // Hippomenes: Tetrabrid Blaster - fires four 270 cones back-to-back, direction indicated by boss buffs from Charge Blaster
    // Hippomenes: Electric Burst - raidwide, summons adds (Ball of Levin: cast Shock - large PBAoE)
    // ---------------- alternate final summon: Phaethon ----------------
    // Phaethon: Illusive Fire - summons adds (Phantasmal Phaethon: cast Gallop - line aoe across arena)
    // Phaethon: Heat Blast - raidwide
    // Phaethon: Shining Sun - summons adds (Ball of Fire: cast Flame Blast - cross aoe)
    // Phaethon: Flare - two? flare markers on random? players
    // Phaethon: Flame Burst - tankbuster
    // Phaethon: Eruption - aoe under random players?
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Gymnasiou Acheloios': 'Gymnasiou-Acheloios',
        'Gymnasiou Leon': 'Gymnasiou-Leon',
        'Gymnasiou Mandragoras': 'Gymnasiou-Mandragora',
        'Gymnasiou Meganereis': 'Gymnasiou-Meganereis',
        'Gymnasiou Satyros': 'Gymnasiou-Satyros',
        'Gymnasiou Sphinx': 'Gymnasiou-Sphinx',
        'Gymnasiou Tigris': 'Gymnasiou-Tigris',
        'Gymnasiou Triton': 'Gymnasiou-Triton',
        'Lampas Chrysine': 'Lampas Chrysine',
        'Lyssa Chrysine': 'Lyssa Chrysine',
        'Narkissos': 'Narkissos',
        'Verdant Plume': 'blau(?:e|er|es|en) Feder',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Gymnasiou Acheloios': 'gymnasiou achéloios',
        'Gymnasiou Leon': 'gymnasiou léon',
        'Gymnasiou Mandragoras': 'gymnasiou mandragoras',
        'Gymnasiou Meganereis': 'gymnasiou méganéréis',
        'Gymnasiou Satyros': 'gymnasiou satyros',
        'Gymnasiou Sphinx': 'gymnasiou sphinx',
        'Gymnasiou Tigris': 'gymnasiou tigris',
        'Gymnasiou Triton': 'gymnasiou triton',
        'Lampas Chrysine': 'lampas chrysine',
        'Lyssa Chrysine': 'lyssa chrysine',
        'Narkissos': 'Narcisse',
        'Verdant Plume': 'plume vert foncé',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Gymnasiou Acheloios': 'ギュムナシオー・アケローオス',
        'Gymnasiou Leon': 'ギュムナシオー・レオン',
        'Gymnasiou Mandragoras': 'ギュムナシオー・マンドラゴラ',
        'Gymnasiou Meganereis': 'ギュムナシオー・メガネレイス',
        'Gymnasiou Satyros': 'ギュムナシオー・サテュロス',
        'Gymnasiou Sphinx': 'ギュムナシオー・スフィンクス',
        'Gymnasiou Tigris': 'ギュムナシオー・ティグリス',
        'Gymnasiou Triton': 'ギュムナシオー・トリトン',
        'Lampas Chrysine': 'クリュシネ・ランパス',
        'Lyssa Chrysine': 'クリュシネ・リッサ',
        'Narkissos': 'ナルキッソス',
        'Verdant Plume': '濃緑の羽根',
      },
    },
  ],
});
