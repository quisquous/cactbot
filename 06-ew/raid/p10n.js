const bossNameUnicode = 'Pand\u00e6monium';
Options.Triggers.push({
  id: 'AnabaseiosTheTenthCircle',
  zoneId: ZoneId.AnabaseiosTheTenthCircle,
  timelineFile: 'p10n.txt',
  initData: () => {
    return {
      silkspitPlayers: [],
    };
  },
  triggers: [
    {
      id: 'P10N Silkspit Collect',
      type: 'HeadMarker',
      netRegex: { id: '01CE' },
      run: (data, matches) => data.silkspitPlayers.push(matches.target),
    },
    {
      id: 'P10N Silkspit',
      type: 'HeadMarker',
      netRegex: { id: '01CE', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 0.5,
      alertText: (data, _matches, output) => {
        if (data.silkspitPlayers.includes(data.me))
          return output.onYou();
      },
      infoText: (data, _matches, output) => {
        if (!data.silkspitPlayers.includes(data.me))
          return output.onOthers();
      },
      run: (data) => data.silkspitPlayers = [],
      outputStrings: {
        onYou: {
          en: 'Spread (avoid posts)',
          de: 'Verteilen (vermeide Stäbe)',
        },
        onOthers: {
          en: 'Avoid marked players',
          de: 'Vermeide markierte Spieler',
        },
      },
    },
    {
      id: 'P10N Pandaemonic Pillars',
      type: 'StartsUsing',
      netRegex: { id: '825D', source: bossNameUnicode, capture: false },
      durationSeconds: 5,
      response: Responses.getTowers(),
    },
    {
      id: 'P10N Imprisonment',
      type: 'StartsUsing',
      netRegex: { id: '8262', source: bossNameUnicode, capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid jails',
          de: 'Gefängnisen vermeiden',
        },
      },
    },
    {
      id: 'P10N Cannonspawn',
      type: 'StartsUsing',
      netRegex: { id: '8264', source: bossNameUnicode, capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Under jails',
          de: 'Geh unter ein Gefängnis',
        },
      },
    },
    {
      id: 'P10N Ultima',
      type: 'StartsUsing',
      netRegex: { id: '827B', source: bossNameUnicode, capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P10N Pandaemoniac Meltdown',
      type: 'Ability',
      netRegex: { id: '87A2', source: bossNameUnicode },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P10N Soul Grasp',
      type: 'StartsUsing',
      netRegex: { id: '8278', source: bossNameUnicode },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P10N Pandaemoniac Ray',
      type: 'StartsUsing',
      netRegex: { id: '826[57]', source: bossNameUnicode },
      infoText: (_data, matches, output) => {
        // Half-room cleave west (8265) or east (8267)
        const safeOutput = matches.id === '8265' ? 'east' : 'west';
        return output[safeOutput]();
      },
      outputStrings: {
        east: Outputs.getRightAndEast,
        west: Outputs.getLeftAndWest,
      },
    },
    {
      id: 'P10N Touchdown',
      type: 'StartsUsing',
      netRegex: { id: '8268', source: bossNameUnicode, capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Side platform(s)',
          de: 'Seite-Platform(en)',
        },
      },
    },
    {
      id: 'P10N Harrowing Hell x8',
      type: 'StartsUsing',
      netRegex: { id: '826A', source: bossNameUnicode, capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'P10N Harrowing Hell Knockback',
      type: 'StartsUsing',
      netRegex: { id: '826F', source: bossNameUnicode, capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'P10N Wicked Step',
      type: 'StartsUsing',
      netRegex: { id: '8272', source: bossNameUnicode, capture: false },
      alertText: (data, _matches, output) => {
        if (data.party.isTank(data.me))
          return output.soak();
      },
      infoText: (data, _matches, output) => {
        if (!data.party.isTank(data.me))
          return output.avoid();
      },
      outputStrings: {
        soak: {
          en: 'Soak tower',
          de: 'Türme nehmen',
        },
        avoid: {
          en: 'Avoid towers',
          de: 'Türme vermeiden',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Pand\\\\u00e6monium': 'Pand\\u00e6monium',
      },
      'replaceText': {
        '\\(marked\\)': '(Markiert)',
        '\\(resolves\\)': '(Effekt)',
        '\\(knockback\\)': '(Rückstoß)',
        'Cannonspawn': 'Kanonenbrut',
        'Entangling Web': 'Großnetz',
        'Harrowing Hell': 'Höllenpein der Tiefe',
        'Imprisonment': 'Einkerkerung',
        'Pandaemoniac Meltdown': 'Pandaemonischer Kollaps',
        'Pandaemoniac Pillars': 'Pandaemonische Säule',
        'Pandaemoniac Ray': 'Pandaemonischer Strahl',
        'Parted Plumes': 'Teilungsstrahl',
        'Silkspit': 'Spucknetz',
        'Soul Grasp': 'Seelengreifer',
        'Touchdown': 'Himmelssturz',
        'Ultima': 'Ultima',
        'Wicked Step': 'Übler Schritt',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Pand\\\\u00e6monium': 'Pand\\u00e6monium',
      },
      'replaceText': {
        'Cannonspawn': 'Croissance de canon',
        'Entangling Web': 'Grande toile',
        'Harrowing Hell': 'Assaut sismique',
        'Imprisonment': 'Emprisonnement',
        'Pandaemoniac Meltdown': 'Fusion pandaemoniaque',
        'Pandaemoniac Pillars': 'Piliers pandaemoniaques',
        'Pandaemoniac Ray': 'Rayon pandaemoniaque',
        'Parted Plumes': 'Plumes fendantes',
        'Silkspit': 'Crachat de toile',
        'Soul Grasp': 'Saisie d\'âme',
        'Touchdown': 'Atterrissage',
        'Ultima': 'Ultima',
        'Wicked Step': 'Pattes effilées',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Pand\\\\u00e6monium': 'パンデモニウム',
      },
      'replaceText': {
        'Cannonspawn': 'キャノンスポーン',
        'Entangling Web': 'グランドウェブ',
        'Harrowing Hell': '魔殿の震撃',
        'Imprisonment': 'インプリズメント',
        'Pandaemoniac Meltdown': 'パンデモニックメルトン',
        'Pandaemoniac Pillars': 'パンデモニックピラー',
        'Pandaemoniac Ray': 'パンデモニックレイ',
        'Parted Plumes': 'ディバイドプルーム',
        'Silkspit': 'スピットウェブ',
        'Soul Grasp': 'ソウルグラスプ',
        'Touchdown': 'タッチダウン',
        'Ultima': 'アルテマ',
        'Wicked Step': '尖脚',
      },
    },
  ],
});
