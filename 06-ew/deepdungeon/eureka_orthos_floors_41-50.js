Options.Triggers.push({
  id: 'EurekaOrthosFloors41_50',
  zoneId: ZoneId.EurekaOrthosFloors41_50,
  triggers: [
    // ---------------- Floor 41-49 Mobs ----------------
    {
      id: 'EO 41-50 Orthos Bergthurs Elbow Drop',
      type: 'StartsUsing',
      netRegex: { id: '8198', source: 'Orthos Bergthurs', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'EO 41-50 Orthos Acheron Quake',
      type: 'StartsUsing',
      netRegex: { id: '7ED6', source: 'Orthos Acheron' },
      alertText: (data, matches, output) => {
        if (data.CanSilence())
          return output.interruptOrOut({ name: matches.source });
        return output.out();
      },
      outputStrings: {
        out: Outputs.out,
        interruptOrOut: {
          en: 'Out or interrupt ${name}',
          de: 'Raus oder unterbreche ${name}',
          ja: '沈黙: ${name}',
          cn: '出去或打断 ${name}',
          ko: '밖으로 또는 ${name} 시전 끊기',
        },
      },
    },
    {
      id: 'EO 41-50 Orthos Kelpie Bloody Puddle',
      type: 'StartsUsing',
      netRegex: { id: '7ECC', source: 'Orthos Kelpie', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 41-50 Orthos Goobbue Sickly Sneeze',
      // Inhale (819A) draws in, Sickly Sneeze (7ED9) is quick front cone after
      type: 'StartsUsing',
      netRegex: { id: '7ED9', source: 'Orthos Goobbue', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 41-50 Orthos Gelato Explosion',
      type: 'StartsUsing',
      netRegex: { id: '7EC4', source: 'Orthos Gelato', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 41-50 Orthos Hoarhound Abyssal Cry',
      // roomwide stun AoE with follow-up one-shot attack on stunned players; can break line-of-sight to avoid
      type: 'StartsUsing',
      netRegex: { id: '7ED3', source: 'Orthos Hoarhound' },
      alertText: (_data, matches, output) => output.text({ name: matches.source }),
      outputStrings: {
        text: {
          en: 'Break line-of-sight to ${name}',
          de: 'Unterbreche Sichtlinie zu ${name}',
          ja: '${name}の視線から隠れる',
          cn: '利用掩体卡 ${name} 的视线',
          ko: '${name}의 시야 밖으로 숨기',
        },
      },
    },
    // ---------------- Floor 50 Boss: Servomechanical Chimera 14X ----------------
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Leftbreathed Thunder',
      type: 'StartsUsing',
      netRegex: { id: '7C75', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Rightbreathed Cold',
      type: 'StartsUsing',
      netRegex: { id: '7C77', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Songs of Ice and Thunder',
      type: 'StartsUsing',
      netRegex: { id: '7C6B', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.getOutThenIn('alert'),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Songs of Thunder and Ice',
      type: 'StartsUsing',
      netRegex: { id: '7C6C', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.getInThenOut('alert'),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Tether',
      type: 'Tether',
      netRegex: { id: '0039', source: 'Servomechanical Chimera 14X' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Run Away From Boss',
          de: 'Renn weg vom Boss',
          fr: 'Courez loin du boss',
          ja: 'ボスから離れる',
          cn: '远离Boss',
          ko: '보스와 거리 벌리기',
        },
      },
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Cold Thunder',
      type: 'StartsUsing',
      netRegex: { id: '7C6F', source: 'Servomechanical Chimera 14X', capture: false },
      delaySeconds: 2,
      response: Responses.getOutThenIn('alert'),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Thunderous Cold',
      type: 'StartsUsing',
      netRegex: { id: '7C70', source: 'Servomechanical Chimera 14X', capture: false },
      delaySeconds: 2,
      response: Responses.getInThenOut('alert'),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Cacophony',
      type: 'Tether',
      netRegex: { source: 'Cacophony', id: '0011' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orb on YOU',
          de: 'Orb auf DIR',
          fr: 'Orbe sur VOUS',
          ja: '自分に玉',
          cn: '球点名',
          ko: '구슬 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Cacophony': 'Kakophonie',
        'Orthos Acheron': 'Orthos-Acheron',
        'Orthos Bergthurs': 'Orthos-Jötunn',
        'Orthos Gelato': 'Orthos-Gelato',
        'Orthos Goobbue': 'Orthos-Goobbue',
        'Orthos Hoarhound': 'Orthos-Höllenhund',
        'Orthos Kelpie': 'Orthos-Kelpie',
        'Servomechanical Chimera 14X': 'servomechanisch(?:e|er|es|en) Chimäre 14X',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Cacophony': 'cacophonie',
        'Orthos Acheron': 'achéron Orthos',
        'Orthos Bergthurs': 'bergthurs Orthos',
        'Orthos Gelato': 'gelato Orthos',
        'Orthos Goobbue': 'goobbue Orthos',
        'Orthos Hoarhound': 'ballote Orthos',
        'Orthos Kelpie': 'kelpie Orthos',
        'Servomechanical Chimera 14X': 'chimère servomécanique 14X',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Cacophony': 'カカフォニー',
        'Orthos Acheron': 'オルト・アケローン',
        'Orthos Bergthurs': 'オルト・ベルグスルス',
        'Orthos Gelato': 'オルト・ジェラート',
        'Orthos Goobbue': 'オルト・グゥーブー',
        'Orthos Hoarhound': 'オルト・ホアハウンド',
        'Orthos Kelpie': 'オルト・ケルピー',
        'Servomechanical Chimera 14X': 'サーヴォ・キマイラ14X',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Cacophony': '嘈杂的噪音',
        'Orthos Acheron': '正统阿刻戎',
        'Orthos Bergthurs': '正统山巨魔',
        'Orthos Gelato': '正统明胶怪',
        'Orthos Goobbue': '正统古菩猩猩',
        'Orthos Hoarhound': '正统霜狼',
        'Orthos Kelpie': '正统凯尔派',
        'Servomechanical Chimera 14X': '自控化奇美拉14X',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Cacophony': '불협화음',
        'Orthos Acheron': '오르토스 아케론',
        'Orthos Bergthurs': '오르토스 베르그투르스',
        'Orthos Gelato': '오르토스 젤라토',
        'Orthos Goobbue': '오르토스 구부',
        'Orthos Hoarhound': '오르토스 호어하운드',
        'Orthos Kelpie': '오르토스 켈피',
        'Servomechanical Chimera 14X': '자동제어 키마이라 14X',
      },
    },
  ],
});
