Options.Triggers.push({
  zoneId: ZoneId.Thavnair,
  resetWhenOutOfCombat: false,
  initData: () => {
    return {
      sphatikaBearing: [],
    };
  },
  triggers: [
    {
      id: 'Hunt Sugriva Spark',
      type: 'StartsUsing',
      netRegex: { id: '6A55', source: 'Sugriva', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Sugriva Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '6A56', source: 'Sugriva', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Sugriva Twister',
      type: 'StartsUsing',
      netRegex: { id: '6A53', source: 'Sugriva', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.knockbackStack(),
      outputStrings: {
        knockbackStack: {
          en: 'Knockback Stack',
          de: 'Rückstoß sammeln',
          fr: 'Package + Poussée',
          ja: 'ノックバック＋頭割り',
          cn: '集合击退',
          ko: '넉백 + 쉐어',
        },
      },
    },
    {
      id: 'Hunt Sugriva Butcher',
      type: 'StartsUsing',
      // This is followed up with Rip (6A58) which is also a tank cleave.
      // We could call out 2x tank cleave, but maybe that's overkill.
      netRegex: { id: '6A57', source: 'Sugriva' },
      condition: (data) => data.inCombat,
      response: Responses.tankCleave(),
    },
    {
      id: 'Hunt Sugriva Rock Throw',
      type: 'StartsUsing',
      // One telegraphed circle in front, then some untelegraphed ones.
      netRegex: { id: '6A59', source: 'Sugriva', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugriva Crosswind',
      type: 'StartsUsing',
      netRegex: { id: '6A5B', source: 'Sugriva', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Yilan Forward March',
      type: 'GainsEffect',
      netRegex: { effectId: '7A6', source: 'Yilan' },
      condition: Conditions.targetIsYou(),
      // t=0.0 gain effect (this line)
      // t=6.3 Mini Light starts casting
      // t=9.0 lose effect (forced march)
      // t=12.3 Mini Light ability
      // Full duration is 9s, but have seen this apply late for ~7 to some people.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Forward March Away',
          de: 'Geistlenkung vorwärts',
          fr: 'Marche forcée en avant',
          ja: '強制移動：前',
          cn: '强制移动: 前',
          ko: '강제이동: 앞',
        },
      },
    },
    {
      id: 'Hunt Yilan About Face',
      type: 'GainsEffect',
      netRegex: { effectId: '7A7', source: 'Yilan' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Backwards March Away',
          de: 'Geistlenkung rückwärts',
          fr: 'Marche forcée en arrière',
          ja: '強制移動：後ろ',
          cn: '强制移动: 后',
          ko: '강제이동: 뒤',
        },
      },
    },
    {
      id: 'Hunt Yilan Left Face',
      type: 'GainsEffect',
      netRegex: { effectId: '7A8', source: 'Yilan' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Left March Away',
          de: 'Geistlenkung links',
          fr: 'Marche forcée à gauche',
          ja: '強制移動：左',
          cn: '强制移动: 左',
          ko: '강제이동: 왼쪽',
        },
      },
    },
    {
      id: 'Hunt Yilan Right Face',
      type: 'GainsEffect',
      netRegex: { effectId: '7A9', source: 'Yilan' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Right March Away',
          de: 'Geistlenkung rechts',
          fr: 'Marche forcée à droite',
          ja: '強制移動：右',
          cn: '强制移动: 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
    {
      id: 'Hunt Yilan Brackish Rain',
      type: 'StartsUsing',
      // Untelegraphed conal attack.
      netRegex: { id: '6A62', source: 'Yilan', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Yilan Mini Light',
      type: 'StartsUsing',
      netRegex: { id: '6A5F', source: 'Yilan', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Sphatika Gnaw',
      type: 'StartsUsing',
      netRegex: { id: '6BE1', source: 'Sphatika' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster(),
    },
    {
      id: 'Hunt Sphatika Caterwaul',
      type: 'StartsUsing',
      netRegex: { id: '6BE3', source: 'Sphatika', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Sphatika Brace Init',
      type: 'StartsUsing',
      // brace ability ids:
      //   6BE4 = Forward Bearing => Backward Bearing
      //   6BE5 = Forward Bearing => Leftward Bearing
      //   6BE6 = Backward Bearing => Rightward Bearing
      //   6BE7 = Leftward Bearing => Rightward Bearing
      //
      // effect ids:
      //   B13 = Forward Bearing (down arrow)
      //   B14 = Backward Bearing (up arrow)
      //   B15 = Leftward Bearing (right arrow)
      //   B16 = Rightward Bearing (left arrow)
      //
      // The order of effect id lines in the log is not the same as the order of them applying.
      // It is somewhat non-deterministic and could be in either ordering.
      // However, it seems that the effect ids are sorted lowest->highest on the buff bar,
      // so that the lowest id will always go off first.
      //
      // The strategy is to read arrow images (not bearing names) left to right on the buff bar.
      // First arrow dir, then first arrow opposite, then second arrow dir, then second arrow opposite.
      // If it is Whiplick, then you do the reverse of the directions of the arrow images.
      // See: https://www.twitch.tv/asinametra/clip/ExquisiteNurturingPeanutBIRB-i4NMmHjZNjai5xP-
      netRegex: { id: ['6BE4', '6BE5', '6BE6', '6BE7'], source: 'Sphatika' },
      run: (data, matches) => {
        const bearingMap = {
          '6BE4': ['back', 'front', 'front', 'back'],
          '6BE5': ['back', 'front', 'right', 'left'],
          '6BE6': ['front', 'back', 'left', 'right'],
          '6BE7': ['right', 'left', 'left', 'right'],
        };
        data.sphatikaBearing = bearingMap[matches.id] ?? [];
      },
    },
    {
      id: 'Hunt Sphatika Whiplick Reverse',
      type: 'StartsUsing',
      netRegex: { id: '6BE9', source: 'Sphatika', capture: false },
      run: (data) => {
        // Whiplick does the directions in reverse, so reverse here so we can have a single logic path.
        data.sphatikaBearing = data.sphatikaBearing.map((x) => {
          if (x === 'front')
            return 'back';
          if (x === 'back')
            return 'front';
          if (x === 'left')
            return 'right';
          return 'left';
        });
      },
    },
    {
      id: 'Hunt Sphatika Stance All Dirs',
      type: 'StartsUsing',
      // 6BE8 = Lickwhip Stance
      // 6BE9 = Whiplick Stance
      netRegex: { id: ['6BE8', '6BE9'], source: 'Sphatika', capture: false },
      durationSeconds: 10,
      sound: '',
      infoText: (data, _matches, output) => {
        const [dir1, dir2, dir3, dir4] = data.sphatikaBearing;
        if (dir1 === undefined || dir2 === undefined || dir3 === undefined || dir4 === undefined)
          return;
        if (!data.inCombat)
          return;
        return output.text({ dir1: dir1, dir2: dir2, dir3: dir3, dir4: dir4 });
      },
      tts: null,
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
        text: {
          en: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          de: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          ko: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
        },
      },
    },
    {
      id: 'Hunt Sphatika Stance Initial',
      type: 'StartsUsing',
      // 6BE8 = Lickwhip Stance
      // 6BE9 = Whiplick Stance
      netRegex: { id: ['6BE8', '6BE9'], source: 'Sphatika', capture: false },
      alertText: (data, _matches, output) => {
        const key = data.sphatikaBearing.shift();
        if (key === undefined)
          return;
        if (!data.inCombat)
          return;
        return output[key]();
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Hunt Sphatika Stance Step',
      type: 'StartsUsing',
      // 6BEE, 6BEF, 6BF0, 6BF1, 6C43 = Hind Whip
      // 6BEA, 6BEB, 6BEC, 6BED, 6C42 = Long Lick
      netRegex: { id: ['6BE[A-F]', '6BF[01]', '6C4[23]'], source: 'Sphatika', capture: false },
      alertText: (data, _matches, output) => {
        const key = data.sphatikaBearing.shift();
        if (key === undefined)
          return;
        if (!data.inCombat)
          return;
        return output[key]();
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Sphatika': 'Sphatika',
        'Sugriva': 'Sugriva',
        'Yilan': 'Yilan',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Sphatika': 'Sphatika',
        'Sugriva': 'Sugriva',
        'Yilan': 'yilan',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Sphatika': 'スパティカ',
        'Sugriva': 'スグリーヴァ',
        'Yilan': 'ユラン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Sphatika': '颇胝迦',
        'Sugriva': '须羯里婆',
        'Yilan': '尤兰',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Sphatika': '스파티카',
        'Sugriva': '수그리바',
        'Yilan': '윌란',
      },
    },
  ],
});
