Options.Triggers.push({
  id: 'AnabaseiosTheEleventhCircle',
  zoneId: ZoneId.AnabaseiosTheEleventhCircle,
  timelineFile: 'p11n.txt',
  triggers: [
    {
      id: 'P11N Eunomia',
      type: 'StartsUsing',
      netRegex: { id: '81E2', source: 'Themis', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P11N Divisive Ruling In',
      type: 'StartsUsing',
      netRegex: { id: '81B4', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> In',
          de: 'Linien AoE -> Rein',
        },
      },
    },
    {
      id: 'P11N Divisive Ruling Out',
      type: 'StartsUsing',
      netRegex: { id: '81B3', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Out',
          de: 'Linien AoE -> Raus',
          fr: 'AoE en ligne -> Extérieur',
          ja: '直線AoE -> 離れる',
          cn: '直线AoE -> 远离',
          ko: '직선 장판 -> 바깥으로',
        },
      },
    },
    {
      id: 'P11N Dark Discord',
      type: 'GainsEffect',
      netRegex: { effectId: 'DE4' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get in light puddle',
          de: 'Geh in die Licht-Fläche',
        },
      },
    },
    {
      id: 'P11N Light Discord',
      type: 'GainsEffect',
      netRegex: { effectId: 'DE3' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get in dark puddle',
          de: 'Geh in die Dunkel-Fläche',
        },
      },
    },
    {
      id: 'P11N Dineis',
      type: 'StartsUsing',
      netRegex: { id: '8725', source: 'Themis', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait puddles x2',
          de: 'Köder Fläche x2',
        },
      },
    },
    {
      id: 'P11N Dismissal Ruling Dynamo',
      type: 'StartsUsing',
      netRegex: { id: '81FB', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback -> get in',
          de: 'Rückstoß -> geh rein',
        },
      },
    },
    {
      id: 'P11N Dismissal Ruling Chariot',
      type: 'StartsUsing',
      netRegex: { id: '81FA', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback -> stay out',
          de: 'Rückstoß -> bleib außen',
        },
      },
    },
    {
      id: 'P11N Dike Collect',
      type: 'HeadMarker',
      netRegex: { id: '00DA' },
      run: (data, matches) => {
        data.busterTargets ??= [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'P11N Dike Call',
      type: 'HeadMarker',
      netRegex: { id: '00DA', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 10,
      infoText: (data, _matches, output) => {
        if (data.busterTargets?.includes(data.me))
          return output.busterOnYou();
        return output.busterOthers();
      },
      run: (data) => delete data.busterTargets,
      outputStrings: {
        busterOnYou: Outputs.tankBusterOnYou,
        busterOthers: Outputs.tankBusters,
      },
    },
    {
      id: 'P11N Upheld Ruling Dynamo',
      type: 'HeadMarker',
      netRegex: { id: '01CF' },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.avoidCleave({ target: data.ShortName(matches.target) });
        return output.cleaveOnYou();
      },
      outputStrings: {
        avoidCleave: {
          en: 'Cleaving ${target} -> get in',
          de: 'Cleave auf ${target} -> geh Rein',
        },
        cleaveOnYou: {
          en: 'Cleave on YOU -> stay in',
          de: 'Cleave auf DIR -> bleib drin',
        },
      },
    },
    {
      id: 'P11N Upheld Ruling Chariot',
      type: 'HeadMarker',
      netRegex: { id: '013E' },
      infoText: (data, matches, output) => output.text({ target: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Stack on ${target} -> get out',
          de: 'Auf ${target} Sammeln -> geh raus',
        },
      },
    },
    {
      id: 'P11N Styx',
      type: 'HeadMarker',
      netRegex: { id: '0131' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P11N Blinding Light',
      type: 'HeadMarker',
      netRegex: { id: '01D2' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P11N Divisive Ruling Double',
      type: 'StartsUsing',
      netRegex: { id: '81D7', source: 'Illusory Themis', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> In on dark adds',
          de: 'Linien AoE -> Rein auf dunkle Adds',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Illusory Themis': 'Phantom-Themis',
        '(?<!(-| ))Themis': 'Themis',
      },
      'replaceText': {
        '\\(random\\)': '(Zufall)',
        '\\(cast\\)': '(Ausführen)',
        '\\(puddle': '(Fläche',
        '\\(in/out\\)': '(rein/raus)',
        'dynamo\\)': 'Donut)',
        'chariot\\)': 'AoE-Fläche)',
        '\\(cleave': '(Cleave',
        '\\(stack': '(Sammeln',
        'Blinding Light': 'Blendendes Licht',
        'Dark Perimeter': 'Dunkler Kreis',
        'Dark and Light': 'Licht-Dunkel-Schlichtung',
        'Dike': 'Dike',
        'Dineis': 'Dine',
        'Dismissal Ruling': 'Verweisungsbeschluss',
        'Divine Ruination': 'Lichtbombe',
        'Divisive Ruling': 'Auflösungsbeschluss',
        'Emissary\'s Will': 'Schlichtung',
        'Eunomia': 'Eunomia',
        'Inner Light': 'Gleißendes Inneres',
        'Lightburst': 'Lichtstoß',
        'Outer Dark': 'Dunkles Äußeres',
        'Ripples of Gloom': 'Wellen der Betrübung',
        'Shadowed Messengers': 'Boten des Schattens',
        'Sigils of Discord': 'Siegel der Uneinigkeit',
        'Styx': 'Styx',
        'Upheld Ruling': 'Erhebungsbeschluss',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Illusory Themis': 'spectre de Thémis',
        '(?<! )Themis': 'Thémis',
      },
      'replaceText': {
        'Blinding Light': 'Lumière aveuglante',
        'Dark Perimeter': 'Cercle ténébreux',
        'Dark and Light': 'Médiation Lumière-Ténèbres',
        'Dike': 'Diké',
        'Dineis': 'Diné',
        'Dismissal Ruling': 'Rejet et décision',
        'Divine Ruination': 'Explosion sacrée',
        'Divisive Ruling': 'Partage et décision',
        'Emissary\'s Will': 'Médiation',
        'Eunomia': 'Eunomia',
        'Inner Light': 'Chatoiement interne',
        'Lightburst': 'Éclat de lumière',
        'Outer Dark': 'Obscurité externe',
        'Ripples of Gloom': 'Onde des ténèbres',
        'Shadowed Messengers': 'Fantasmagorie des préceptes',
        'Sigils of Discord': 'Pentacles de dissonance',
        'Styx': 'Styx',
        'Upheld Ruling': 'Maintien et décision',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Illusory Themis': 'テミスの幻影',
        '(?<! )Themis': 'テミス',
      },
      'replaceText': {
        'Blinding Light': '光弾',
        'Dark Perimeter': 'ダークサークル',
        'Dark and Light': '光と闇の調停',
        'Dike': 'ディケー',
        'Dineis': 'ディーネ',
        'Dismissal Ruling': 'ディスミサル＆ルーリング',
        'Divine Ruination': '光爆',
        'Divisive Ruling': 'ディバイド＆ルーリング',
        'Emissary\'s Will': '調停',
        'Eunomia': 'エウノミアー',
        'Inner Light': 'インナーグレア',
        'Lightburst': 'ライトバースト',
        'Outer Dark': 'アウターダーク',
        'Ripples of Gloom': '闇の衝撃',
        'Shadowed Messengers': '戒律の幻奏',
        'Sigils of Discord': '不和の判紋',
        'Styx': 'ステュクス',
        'Upheld Ruling': 'アップヘルド＆ルーリング',
      },
    },
  ],
});
