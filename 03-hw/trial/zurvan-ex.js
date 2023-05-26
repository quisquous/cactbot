Options.Triggers.push({
  id: 'ContainmentBayZ1T9Extreme,',
  zoneId: ZoneId.ContainmentBayZ1T9Extreme,
  timelineFile: 'zurvan-ex.txt',
  initData: () => {
    return { isPhaseOne: true };
  },
  timelineTriggers: [
    {
      id: 'ZurvanEX Metal Cutter',
      regex: /Metal Cutter/,
      beforeSeconds: 4,
      suppressSeconds: (data) => data.isPhaseOne === true ? 10 : 16,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'ZurvanEX Phase Tracker',
      type: 'Ability',
      netRegex: { id: '1C50', source: 'Zurvan', capture: false },
      run: (data) => data.isPhaseOne = false,
    },
    {
      id: 'ZurvanEX Wave Cannon Avoid',
      type: 'HeadMarker',
      netRegex: { id: '000E' },
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.waveCannonTarget();
      },
      alertText: (data, matches, output) => {
        if (!(data.me === matches.target))
          return output.avoidWaveCannon({ target: data.ShortName(matches.target) });
      },
      outputStrings: {
        waveCannonTarget: {
          en: 'Wave Cannon on YOU',
          de: 'Wellenkanone auf DIR',
        },
        avoidWaveCannon: {
          en: 'Away from ${target} -- Wave Cannon',
          de: 'Weg von ${target} -- Wellenkanone',
        },
      },
    },
    {
      id: 'ZurvanEX Wave Cannon Stack',
      type: 'StartsUsing',
      netRegex: { id: '1C72', source: 'Zurvan' },
      condition: Conditions.targetIsNotYou(),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'ZurvanEX Demon Claw',
      type: 'StartsUsing',
      netRegex: { id: '1C71', source: 'Zurvan' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.demonClawYou(),
      outputStrings: {
        demonClawYou: {
          en: 'Knockback from boss on YOU',
          de: 'Rückstoß vom Boss auf DIR',
        },
      },
    },
    {
      id: 'ZurvanEX Flaming Halberd',
      type: 'HeadMarker',
      netRegex: { id: '002C' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'ZurvanEX Demonic Dive',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      delaySeconds: 0.5,
      alertText: (data, matches, output) => {
        if (data?.flameTarget === data.me)
          return;
        if (data.flameTarget === undefined)
          return output.unknownStackTarget();
        return output.stackOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        unknownStackTarget: Outputs.stackMarker,
        stackOn: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'ZurvanEX Cool Flame Call',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.demonicSpread(),
      run: (data, matches) => data.flameTarget ??= matches.target,
      outputStrings: {
        demonicSpread: {
          en: 'Spread -- Don\'t stack!',
          de: 'Verteilen -- Nicht aufeinander!',
        },
      },
    },
    {
      id: 'ZurvanEX Cool Flame Cleanup',
      type: 'HeadMarker',
      netRegex: { id: '0017', capture: false },
      delaySeconds: 10,
      run: (data) => delete data.flameTarget,
    },
    {
      id: 'ZurvanEX Biting Halberd',
      type: 'StartsUsing',
      netRegex: { id: '1C59', source: 'Zurvan', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'ZurvanEX Tail End',
      type: 'StartsUsing',
      netRegex: { id: '1C5A', source: 'Zurvan', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'ZurvanEX Ciclicle',
      type: 'StartsUsing',
      netRegex: { id: '1C5B', source: 'Zurvan', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'ZurvanEX Ice And Fire',
      type: 'Ability',
      netRegex: { id: '1C58', source: 'Zurvan', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stay outside hitbox',
          de: 'Auserhalb der Hitbox stehen',
        },
      },
    },
    {
      id: 'ZurvanEX Meracydian Fear',
      type: 'StartsUsing',
      netRegex: { id: '1E36', source: 'Execrated Wile' },
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'ZurvanEX Tyrfing',
      type: 'StartsUsing',
      netRegex: { id: '1C6D', source: 'Zurvan' },
      response: Responses.tankCleave(), // Tyrfing doesn't cleave, but the Fire III follow-up does
    },
    {
      id: 'ZurvanEX Southern Cross Stack',
      type: 'StartsUsing',
      netRegex: { id: '1C5C', source: 'Zurvan', capture: false },
      suppressSeconds: 1,
      alarmText: (_data, _matches, output) => output.baitSouthernCross(),
      outputStrings: {
        baitSouthernCross: {
          en: 'Bait Ice Puddles',
          de: 'Eisflächen ködern',
        },
      },
    },
    {
      id: 'ZurvanEX Southern Cross Move',
      type: 'StartsUsing',
      netRegex: { id: '1C5D', source: 'Zurvan', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'ZurvanEX Infinite Tethers',
      type: 'Tether',
      netRegex: { id: ['0005', '0008'] },
      condition: (data, matches) => [matches.source, matches.target].includes(data.me),
      preRun: (data, matches) => {
        const buddy = data.me === matches.source ? matches.target : matches.source;
        data.tetherBuddy ??= buddy;
      },
      alertText: (data, _matches, output) => output.tetherBuddy({ buddy: data.tetherBuddy }),
      outputStrings: {
        tetherBuddy: {
          en: 'Tethered with ${buddy}',
          de: 'Mit ${buddy} verbunden',
        },
      },
    },
    {
      // 477 is Infinite Fire, 478 is Infinite Ice
      id: 'ZurvanEX Infinite Debuffs',
      type: 'GainsEffect',
      netRegex: { effectId: ['477', '478'] },
      condition: Conditions.targetIsYou(),
      preRun: (data, matches) => {
        const element = matches.effectId === '477' ? 'fire' : 'ice';
        data.infiniteElement ??= element;
      },
      delaySeconds: 2,
      infoText: (data, _matches, output) =>
        output.infiniteDebuff({ element: data.infiniteElement }),
      outputStrings: {
        infiniteDebuff: {
          en: '${element} on you',
          de: '${element} auf dir',
        },
      },
    },
    {
      id: 'ZurvanEX Broken Seal',
      type: 'StartsUsing',
      netRegex: { id: '1DC7', source: 'Zurvan', capture: false },
      alertText: (data, _matches, output) => {
        const element = data.infiniteElement;
        const buddy = data.tetherBuddy;
        return output.sealTowers({ element: element, buddy: buddy });
      },
      outputStrings: {
        sealTowers: {
          en: '${element} towers with ${buddy}',
          de: '${element} Türme mit ${buddy}',
        },
      },
    },
    {
      id: 'ZurvanEX Seal Cleanup',
      type: 'Ability',
      netRegex: { id: '1DC7', source: 'Zurvan', capture: false },
      run: (data) => {
        delete data.tetherBuddy;
        delete data.infiniteElement;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Execrated Wile': 'verflucht(?:e|er|es|en) List',
        'Zurvan': 'Zurvan',
      },
      'replaceText': {
        '\\(circles\\)': '(Kreise)',
        '\\(explosion\\)': '(Explosion)',
        '\\(puddle\\)': '(Fläche)',
        '\\(snapshot\\)': '(Speichern)',
        '\\(avoid\\)': '(Vermeiden)',
        '\\(stack\\)': '(Sammeln)',
        'Ahura Mazda': 'Ahura Mazda',
        'Biting Halberd': 'Beißende Hellebarde',
        'Broken Seal': 'Endloses Siegel',
        'Ciclicle': 'Cyclotit',
        'Cool Flame': 'Kühle Flamme',
        'Demonic Dive': 'Dämonenschwung',
        'Fire III': 'Feuga',
        'Flaming Halberd': 'Flammenhellebarde',
        'Flare Star': 'Flare-Stern',
        'Ice and Fire': 'Eis und Feuer',
        'Infinite Fire': 'Endloses Feuer',
        'Infinite Ice': 'Endloses Eis',
        'Metal Cutter': 'Metallschneider',
        'Sarva': 'Sarva',
        'Soar': 'Auffliegen',
        'Southern Cross': 'Kreuz des Südens',
        'Tail End': 'Schweifspitze',
        'The Demon\'s Claw': 'Klaue des Dämonen',
        'Twin Spirit': 'Zwiegeist',
        'Tyrfing': 'Tyrfing',
        'Wave Cannon': 'Wellenkanone',
        'the Purge': 'Läuterung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Execrated Wile': 'ruse honnie',
        'Zurvan': 'Zurvan',
      },
      'replaceText': {
        'Ahura Mazda': 'Ahura Mazda',
        'Biting Halberd': 'Hallebarde mordante',
        'Broken Seal': 'Marque brisée',
        'Ciclicle': 'Cyclictite',
        'Cool Flame': 'Flamme froide',
        'Demonic Dive': 'Plongeon du démon',
        'Fire III': 'Méga Feu',
        'Flaming Halberd': 'Hallebarde de flammes',
        'Flare Star': 'Astre flamboyant',
        'Ice and Fire': 'Glace et feu',
        'Infinite Fire': 'Feu infini',
        'Infinite Ice': 'Glace infinie',
        'Metal Cutter': 'Métaillade',
        'Sarva': 'Sarva',
        'Soar': 'Ascension',
        'Southern Cross': 'Croix du sud',
        'Tail End': 'Pointe de queue',
        'The Demon\'s Claw': 'Griffe du démon',
        'Twin Spirit': 'Double spirituel',
        'Tyrfing': 'Tyrfing',
        'Wave Cannon': 'Canon plasma',
        'the Purge': 'Purge',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Execrated Wile': 'テンパード・ワイル',
        'Zurvan': 'ズルワーン',
      },
      'replaceText': {
        'Ahura Mazda': 'アフラ・マズダー',
        'Biting Halberd': 'バイティングハルバード',
        'Broken Seal': '氷炎の紋',
        'Ciclicle': 'シクリクル',
        'Cool Flame': 'クールフレイム',
        'Demonic Dive': 'デモンダイブ',
        'Fire III': 'ファイガ',
        'Flaming Halberd': 'フレイムハルバード',
        'Flare Star': 'フレアスター',
        'Ice and Fire': 'アイス・アンド・ファイア',
        'Infinite Fire': '炎の刻印',
        'Infinite Ice': '氷の刻印',
        'Metal Cutter': 'メタルカッター',
        'Sarva': '変異',
        'Soar': '飛翔',
        'Southern Cross': 'サザンクロス',
        'Tail End': 'テイルエンド',
        'The Demon\'s Claw': 'デモンクロー',
        'Twin Spirit': 'ツインスピリット',
        'Tyrfing': 'ティルフィング',
        'Wave Cannon': '波動砲',
        'the Purge': 'パージ',
      },
    },
  ],
});
