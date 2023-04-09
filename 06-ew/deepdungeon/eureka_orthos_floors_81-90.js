Options.Triggers.push({
  zoneId: ZoneId.EurekaOrthosFloors81_90,
  triggers: [
    // ---------------- Floor 81-89 Mobs ----------------
    {
      id: 'EO 81-90 Orthoiron Corse Glass Punch',
      type: 'StartsUsing',
      netRegex: { id: '7FF7', source: 'Orthoiron Corse', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 81-90 Orthos Gourmand Moldy Sneeze',
      type: 'StartsUsing',
      netRegex: { id: '7FED', source: 'Orthos Gourmand', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 81-90 Orthos Catoblepas Demon Eye',
      // roomwide AoE, gives 20s stun
      // 7FFA is the same attack, used out-of-combat
      type: 'StartsUsing',
      netRegex: { id: '7FF9', source: 'Orthos Catoblepas', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 81-90 Orthos Hecteyes Hex Eye',
      type: 'StartsUsing',
      netRegex: { id: '7FDB', source: 'Orthos Hecteyes', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 81-90 Orthos Deepeye Hypnotize',
      type: 'StartsUsing',
      netRegex: { id: '7FE1', source: 'Orthos Deepeye', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 81-90 Orthos Spartoi Triple Trial',
      type: 'StartsUsing',
      netRegex: { id: '7FE4', source: 'Orthos Spartoi', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 81-90 Orthos Specter Left Sweep',
      type: 'StartsUsing',
      netRegex: { id: '8008', source: 'Orthos Specter', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 81-90 Orthos Specter Right Sweep',
      type: 'StartsUsing',
      netRegex: { id: '8009', source: 'Orthos Specter', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'EO 81-90 Orthos Specter Ringing Burst',
      type: 'StartsUsing',
      netRegex: { id: '8007', source: 'Orthos Specter', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'EO 81-90 Orthos Specter Surrounding Burst',
      type: 'StartsUsing',
      netRegex: { id: '8006', source: 'Orthos Specter', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 81-90 Orthos Wraith Scream',
      type: 'StartsUsing',
      netRegex: { id: '8004', source: 'Orthos Wraith', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 81-90 Orthos Ahriman Blustering Blink',
      type: 'StartsUsing',
      netRegex: { id: '7FF4', source: 'Orthos Ahriman', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 81-90 Orthos Pegasus Nicker',
      type: 'StartsUsing',
      netRegex: { id: '8000', source: 'Orthos Pegasus', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- Floor 90 Boss: Administrator ----------------
    {
      id: 'EO 81-90 Administrator Peripheral Lasers',
      type: 'StartsUsing',
      netRegex: { id: '7AD7', source: 'Administrator', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'EO 81-90 Administrator Cross Lasers',
      type: 'StartsUsing',
      netRegex: { id: '7AD8', source: 'Administrator', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // "Intercardinals" may confuse people between absolute and relative,
          // so add in the "of boss" just to be extra clear.
          en: 'Go Intercardinal of Boss',
          de: 'Geh in eine Intercardinale Himmelsrichtung vom Boss',
          fr: 'Allez en intercardinal du boss',
          ja: 'ボスの斜めへ',
          cn: '去Boss的对角线方向',
          ko: '보스의 대각선 방향으로 피하기',
        },
      },
    },
    {
      id: 'EO 81-90 Administrator Laserstream',
      type: 'StartsUsing',
      netRegex: { id: '7AE0', source: 'Administrator', capture: false },
      response: Responses.bigAoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Administrator': 'Administrator',
        'Orthoiron Corse': 'Orthos-Eisenleichnam',
        'Orthos Ahriman': 'Orthos-Ahriman',
        'Orthos Catoblepas': 'Orthos-Catblepus',
        'Orthos Deepeye': 'Orthos-Glotzauge',
        'Orthos Gourmand': 'Orthos-Gourmet',
        'Orthos Hecteyes': 'Orthos-Hektokulus',
        'Orthos Pegasus': 'schwarz(?:e|er|es|en) Orthos-Pegasus',
        'Orthos Spartoi': 'Orthos-Spartoi',
        'Orthos Specter': 'Orthos-Schemen',
        'Orthos Wraith': 'Orthos-Geist',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Administrator': 'Administrateur',
        'Orthoiron Corse': 'cors de fer Orthos',
        'Orthos Ahriman': 'ahriman Orthos',
        'Orthos Catoblepas': 'catoblépas Orthos',
        'Orthos Deepeye': 'oculus Orthos',
        'Orthos Gourmand': 'gourmand Orthos',
        'Orthos Hecteyes': 'hectoculus Orthos',
        'Orthos Pegasus': 'pégase sombre Orthos',
        'Orthos Spartoi': 'spartoi Orthos',
        'Orthos Specter': 'spector Orthos',
        'Orthos Wraith': 'spectre Orthos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Administrator': 'アドミニストレーター',
        'Orthoiron Corse': 'オルト・アイアンコース',
        'Orthos Ahriman': 'オルト・アーリマン',
        'Orthos Catoblepas': 'オルト・カトブレパス',
        'Orthos Deepeye': 'オルト・ディープアイ',
        'Orthos Gourmand': 'オルト・グルマン',
        'Orthos Hecteyes': 'オルト・ヘクトアイズ',
        'Orthos Pegasus': 'オルト・ブラックペガサス',
        'Orthos Spartoi': 'オルト・スパルトイ',
        'Orthos Specter': 'オルト・スペクター',
        'Orthos Wraith': 'オルト・レイス',
      },
    },
  ],
});
