Options.Triggers.push({
  id: 'TheVoidcastDais',
  zoneId: ZoneId.TheVoidcastDais,
  timelineFile: 'golbez.txt',
  initData: () => {
    return {
      galeSphereShadows: [],
    };
  },
  triggers: [
    {
      id: 'Golbez Terrastorm',
      type: 'Ability',
      netRegex: { id: '8463', source: 'Golbez', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid meteor',
          de: 'Vermeide Meteor',
          fr: 'Évitez le météore',
          ja: 'メテオ回避',
          cn: '远离陨石',
          ko: '메테오 피하기',
        },
      },
    },
    {
      id: 'Golbez Crescent Blade',
      type: 'StartsUsing',
      netRegex: { id: '846B', source: 'Golbez', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Golbez Void Meteor',
      type: 'StartsUsing',
      netRegex: { id: '84AC', source: 'Golbez', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'Golbez Binding Cold',
      type: 'StartsUsing',
      netRegex: { id: '84B2', source: 'Golbez', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Golbez Black Fang',
      type: 'StartsUsing',
      netRegex: { id: '8471', source: 'Golbez', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Golbez Shadow Crescent',
      type: 'StartsUsing',
      netRegex: { id: '8487', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get behind, then out',
          de: 'Geh hinter, dann raus',
          fr: 'Derrière puis extérieur',
          ja: '後ろ => 外へ',
          cn: '去背后 => 远离',
          ko: '보스 뒤로 => 밖으로',
        },
      },
    },
    {
      id: 'Golbez Gale Sphere Directions',
      type: 'Ability',
      netRegex: { id: '84(?:4F|50|51|52)', source: 'Golbez\'s Shadow', capture: true },
      infoText: (data, matches, output) => {
        switch (matches.id) {
          case '844F':
            data.galeSphereShadows.push('dirN');
            break;
          case '8450':
            data.galeSphereShadows.push('dirE');
            break;
          case '8451':
            data.galeSphereShadows.push('dirW');
            break;
          case '8452':
            data.galeSphereShadows.push('dirS');
            break;
        }
        if (data.galeSphereShadows.length < 4)
          return;
        const [dir1, dir2, dir3, dir4] = data.galeSphereShadows;
        if (dir1 === undefined || dir2 === undefined || dir3 === undefined || dir4 === undefined)
          return;
        data.galeSphereShadows = [];
        return output.clones({
          dir1: output[dir1]() ?? output.unknown(),
          dir2: output[dir2]() ?? output.unknown(),
          dir3: output[dir3]() ?? output.unknown(),
          dir4: output[dir4]() ?? output.unknown(),
        });
      },
      outputStrings: {
        clones: {
          en: 'Clones: ${dir1}->${dir2}->${dir3}->${dir4}',
          de: 'Klone: ${dir1}->${dir2}->${dir3}->${dir4}',
          fr: 'Clones : ${dir1}->${dir2}->${dir3}->${dir4}',
          ja: '${dir1}->${dir2}->${dir3}->${dir4}',
          cn: '分身：${dir1}->${dir2}->${dir3}->${dir4}',
          ko: '분신: ${dir1}->${dir2}->${dir3}->${dir4}',
        },
        unknown: Outputs.unknown,
        ...Directions.outputStringsCardinalDir,
      },
    },
    {
      id: 'Golbez Eventide Fall',
      type: 'StartsUsing',
      netRegex: { id: '8482', source: 'Golbez', capture: false },
      response: Responses.stackMarker(),
    },
    {
      id: 'Golbez Immolating Shade',
      type: 'StartsUsing',
      netRegex: { id: '8495', source: 'Golbez' },
      alertText: (data, matches, output) => {
        const target = data.party.member(matches.target);
        return output.text({ player: target });
      },
      outputStrings: {
        text: {
          en: 'Out first => stack w/ ${player}',
          de: 'Zuerst Raus => Sammeln mit ${player}',
          fr: 'Extérieur d\'abord => package avec ${player}',
          ja: '外へ => あたまわり (${player})',
          cn: '远离 => 与 ${player} 分摊',
          ko: '밖으로 => ${player} 쉐어',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Golbez': 'Golbez',
        'Golbez\'s Shadow': 'Phantom-Golbez',
      },
      'replaceText': {
        '\\(preview\\)': '(Vorschau)',
        'Arctic Assault': 'Frostschuss',
        'Azdaja\'s Shadow': 'Azdajas Schatten',
        'Binding Cold': 'Eisfessel',
        'Black Fang': 'Schwarze Fänge',
        'Burning Shade': 'Brennender Schatten',
        'Crescent Blade': 'Sichelstreich',
        'Double Meteor': 'Doppel-Meteo',
        'Eventide Fall': 'Gebündelte Abendglut',
        'Explosion': 'Explosion',
        'Gale Sphere': 'Windsphäre',
        'Immolating Shade': 'Äschernder Schatten',
        'Lingering Spark': 'Lauernder Funke',
        'Rising Beacon': 'Hohes Fanal',
        'Shadow Crescent': 'Schwarzer Sichelstreich',
        'Terrastorm': 'Irdene Breitseite',
        'Void Meteor': 'Nichts-Meteo',
        'Void Stardust': 'Nichts-Sternenstaub',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Golbez': 'Golbez',
        'Golbez\'s Shadow': 'spectre de Golbez',
      },
      'replaceText': {
        'Arctic Assault': 'Assaut arctique',
        'Azdaja\'s Shadow': 'Ombre d\'Azdaja',
        'Binding Cold': 'Geôle glaciale',
        'Black Fang': 'Croc obscur',
        'Burning Shade': 'Ombre brûlante',
        'Crescent Blade': 'Lame demi-lune',
        'Double Meteor': 'Météore double',
        'Eventide Fall': 'Éclat crépusculaire concentré',
        'Explosion': 'Explosion',
        'Gale Sphere': 'Sphères de vent ténébreux',
        'Immolating Shade': 'Ombre incandescente',
        'Lingering Spark': 'Étincelle persistante',
        'Rising Beacon': 'Flambeau ascendant',
        'Shadow Crescent': 'Lame demi-lune obscure',
        'Terrastorm': 'Aérolithe flottant',
        'Void Meteor': 'Météore du néant',
        'Void Stardust': 'Pluie de comètes du néant',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Golbez': 'ゴルベーザ',
        'Golbez\'s Shadow': 'ゴルベーザの幻影',
      },
      'replaceText': {
        'Arctic Assault': 'コールドブラスト',
        'Azdaja\'s Shadow': '黒竜剣アジュダヤ',
        'Binding Cold': '呪縛の冷気',
        'Black Fang': '黒い牙',
        'Burning Shade': '黒炎',
        'Crescent Blade': '弦月剣',
        'Double Meteor': 'ダブルメテオ',
        'Eventide Fall': '集束黒竜閃',
        'Explosion': '爆発',
        'Gale Sphere': 'ウィンドスフィア',
        'Immolating Shade': '重黒炎',
        'Lingering Spark': 'ディレイスパーク',
        'Rising Beacon': '昇竜烽火',
        'Shadow Crescent': '弦月黒竜剣',
        'Terrastorm': 'ディレイアース',
        'Void Meteor': 'ヴォイド・メテオ',
        'Void Stardust': 'ヴォイド・コメットレイン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Golbez': '高贝扎',
        'Golbez\'s Shadow': '高贝扎的幻影',
      },
      'replaceText': {
        '\\(preview\\)': '(预览)',
        'Arctic Assault': '极寒突袭',
        'Azdaja\'s Shadow': '黑龙剑阿珠达雅',
        'Binding Cold': '咒缚寒气',
        'Black Fang': '黑牙',
        'Burning Shade': '黑炎',
        'Crescent Blade': '弦月剑',
        'Double Meteor': '双重陨石',
        'Eventide Fall': '集束黑龙闪',
        'Explosion': '爆炸',
        'Gale Sphere': '风晶球',
        'Immolating Shade': '重黑炎',
        'Lingering Spark': '迟缓电火花',
        'Rising Beacon': '升龙烽火',
        'Shadow Crescent': '弦月黑龙剑',
        'Terrastorm': '迟缓地暴',
        'Void Meteor': '虚空陨石',
        'Void Stardust': '虚空彗星雨',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Golbez': '골베자',
        'Golbez\'s Shadow': '골베자의 환영',
      },
      'replaceText': {
        '\\(preview\\)': '(예고)',
        'Arctic Assault': '냉기 작렬',
        'Azdaja\'s Shadow': '흑룡검 아주다야',
        'Binding Cold': '주박의 냉기',
        'Black Fang': '검은 이빨',
        'Burning Shade': '흑염',
        'Crescent Blade': '현월검',
        'Double Meteor': '더블 메테오',
        'Eventide Fall': '집속 흑룡섬',
        'Explosion': '폭발',
        'Gale Sphere': '바람 구체',
        'Immolating Shade': '중흑염',
        'Lingering Spark': '잔존 벼락',
        'Rising Beacon': '승룡봉화',
        'Shadow Crescent': '현월 흑룡검',
        'Terrastorm': '잔존 암석',
        'Void Meteor': '보이드 메테오',
        'Void Stardust': '보이드 혜성우',
      },
    },
  ],
});
