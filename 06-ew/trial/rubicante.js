Options.Triggers.push({
  zoneId: ZoneId.MountOrdeals,
  timelineFile: 'rubicante.txt',
  initData: () => {
    return {
      dualfireTarget: false,
    };
  },
  triggers: [
    {
      id: 'Rubicante Inferno Raidwide',
      type: 'StartsUsing',
      netRegex: { id: '7CEA', source: 'Rubicante', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rubicante Ordeal of Purgation',
      type: 'StartsUsing',
      netRegex: { id: ['7CC4', '80E8'], source: 'Rubicante', capture: false },
      durationSeconds: 8,
      alertText: (_data, _matches, output) => output.avoid(),
      outputStrings: {
        avoid: {
          en: 'Avoid cone',
        },
      },
    },
    {
      id: 'Rubicante Shattering Heat',
      type: 'StartsUsing',
      netRegex: { id: '7CEB', source: 'Rubicante' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rubicante Blazing Rapture',
      type: 'StartsUsing',
      netRegex: { id: '7CD2', source: 'Rubicante', capture: false },
      // This is a ~14 second cast.
      delaySeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      id: 'Rubicante Inferno Spread',
      type: 'StartsUsing',
      netRegex: { id: '7CDA', source: 'Rubicante' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Rubicante Flamerake',
      type: 'StartsUsing',
      netRegex: { id: '7CDD', source: 'Rubicante', capture: false },
      // Spinning compass animation is 6 seconds; damage goes out 2.6 seconds later
      delaySeconds: 3,
      alertText: (_data, _matches, output) => output.avoid(),
      outputStrings: {
        avoid: {
          en: 'Avoid line cleave, then in',
        },
      },
    },
    {
      id: 'Rubicante Soulscald',
      type: 'Ability',
      netRegex: { id: '7CE8', source: 'Rubicante Mirage', capture: false },
      suppressSeconds: 0.5,
      response: Responses.moveAway('alert'),
    },
    {
      id: 'Rubicante Dualfire Target',
      // These headmarkers come out just before the 7D95 self-targeted cast.
      type: 'HeadMarker',
      netRegex: { id: '00E6' },
      alertText: (data, matches, output) => {
        if (data.me === matches.target) {
          data.dualfireTarget = true;
          return output.tankCleaveOnYou();
        }
      },
      outputStrings: {
        tankCleaveOnYou: Outputs.tankCleaveOnYou,
      },
    },
    {
      id: 'Rubicante Dualfire Not Target',
      type: 'StartsUsing',
      netRegex: { id: '7D95', source: 'Rubicante', capture: false },
      delaySeconds: 0.5,
      infoText: (data, _matches, output) => {
        if (!data.dualfireTarget) {
          if (data.role === 'healer')
            return output.tankBusterCleaves();
          return output.avoidTankCleaves();
        }
        return;
      },
      run: (data) => data.dualfireTarget = false,
      outputStrings: {
        tankBusterCleaves: Outputs.tankCleave,
        avoidTankCleaves: Outputs.avoidTankCleave,
      },
    },
    {
      id: 'Rubicante Sweeping Immolation Stack',
      type: 'StartsUsing',
      netRegex: { id: '7CE3', source: 'Rubicante', capture: false },
      infoText: (_data, _matches, output) => output.stackBehind(),
      outputStrings: {
        stackBehind: {
          en: 'Stack behind Boss',
          de: 'Hinter dem Boss sammeln',
          ja: 'ボスの後ろで頭割り',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Circle of Purgatory': 'Kreis der Läuterung',
        '(?<!Greater )Flamesent': 'Flammengesandt(?:e|er|es|en)',
        'Greater Flamesent': 'Infernogesandt(?:e|er|es|en)',
        'Rubicante': 'Rubicante',
        'Rubicante Mirage': 'Phantom-Rubicante',
      },
      'replaceText': {
        '\\(aoe\\)': '(AoE)',
        '\\(spread\\)': '(verteilen)',
        'Arcane Revelation': 'Arkane Enthüllung',
        'Arch Inferno': 'Erzinferno',
        'Blazing Rapture': 'Lodernde Entrückung',
        'Conflagration': 'Feuersnot',
        'Dualfire': 'Zwieflamme',
        'Explosive Pyre': 'Brausender Scheiterhaufen',
        'Fiery Expiation': 'Feurige Sühne',
        'Flamerake': 'Brennender Nagel',
        'Ghastly Flame': 'Finstere Flamme',
        'Ghastly Torch': 'Finstere Fackel',
        'Ghastly Wind': 'Finstere Winde',
        'Hope Abandon Ye': 'Lasset alle Hoffnung fahren',
        'Infernal Slaughter': 'Infernales Schlachten',
        '(?<!(Arch |Erz))Inferno(?! Devil)': 'Höllenfahrt',
        'Inferno Devil': 'Höllenteufel',
        'Ordeal of Purgation': 'Probe der Läuterung',
        'Radial Flagration': 'Schwelender Reigen',
        'Scalding Fleet': 'Äschernder Schwarm',
        'Shattering Heat': 'Klirrende Hitze',
        'Sweeping Immolation': 'Breite Verbrennung',
        'Total Immolation': 'Totalverbrennung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Circle of Purgatory': 'cercle arcanique du Purgatoire',
        '(?<!Greater )Flamesent': 'flamme démoniaque',
        'Greater Flamesent': 'flamme démoniaque inexorable',
        'Rubicante': 'Rubicante',
        'Rubicante Mirage': 'spectre de Rubicante',
      },
      'replaceText': {
        'Arcane Revelation': 'Déploiement arcanique',
        'Arch Inferno': 'Enfer tourbillonnant',
        'Blazing Rapture': 'Flammes folles',
        'Conflagration': 'Jets enflammés',
        'Dualfire': 'Jets enflammés jumeaux',
        'Explosive Pyre': 'Attaque de feu explosive',
        'Fiery Expiation': 'Flamme expiatoire',
        'Flamerake': 'Griffes écarlates',
        'Ghastly Flame': 'Feu spectral',
        'Ghastly Torch': 'Flamme spectrale',
        'Ghastly Wind': 'Vent enflammé spectral',
        'Hope Abandon Ye': 'Ouverture du Purgatoire',
        'Infernal Slaughter': 'Déchaînement infernal',
        '(?<!Arch )Inferno(?! Devil)': 'Flambée',
        'Inferno Devil': 'Enfer tournoyant',
        'Ordeal of Purgation': 'Purgatoire vermillon',
        'Radial Flagration': 'Jets enflammés radiaux',
        'Scalding Fleet': 'Calcination terrestre brutale',
        'Shattering Heat': 'Attaque de feu',
        'Sweeping Immolation': 'Vague écarlate',
        'Total Immolation': 'Vague écarlate concentrée',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Circle of Purgatory': '煉獄魔陣',
        '(?<!Greater )Flamesent': '炎妖',
        'Greater Flamesent': '業炎妖',
        'Rubicante(?! )': 'ルビカンテ',
        'Rubicante Mirage': 'ルビカンテの幻影',
      },
      'replaceText': {
        'Arcane Revelation': '魔法陣展開',
        'Arch Inferno': '烈風火燕流',
        'Blazing Rapture': '狂える炎',
        'Conflagration': '劫火流',
        'Dualfire': '双炎流',
        'Explosive Pyre': '爆炎撃',
        'Fiery Expiation': '獄炎',
        'Flamerake': '烈火赤滅爪',
        'Ghastly Flame': '妖火',
        'Ghastly Torch': '妖火炎',
        'Ghastly Wind': '妖火風',
        'Hope Abandon Ye': '煉獄招来',
        'Infernal Slaughter': '火燕乱撃',
        '(?<!Arch )Inferno(?! Devil)': '火燕流',
        'Inferno Devil': '火燕旋風',
        'Ordeal of Purgation': '煉獄の朱炎',
        'Radial Flagration': '放散火流',
        'Scalding Fleet': '滅土焼尽：迅火',
        'Shattering Heat': '炎撃',
        'Sweeping Immolation': '赤滅熱波',
        'Total Immolation': '赤滅熱波：重炎',
      },
    },
  ],
});
