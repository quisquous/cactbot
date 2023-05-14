// TODO: promote something like this to Conditions?
const tankBusterOnParty = (data, matches) => {
  if (matches.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(matches.target);
};
Options.Triggers.push({
  id: 'Thavnair',
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
        return output.text({
          dir1: output[dir1](),
          dir2: output[dir2](),
          dir3: output[dir3](),
          dir4: output[dir4](),
        });
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
          ja: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
          cn: '${dir1} => ${dir2} => ${dir3} => ${dir4}',
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
    // ---------------- Daivadipa Boss FATE ----------------
    {
      id: 'Hunt Daivadipa Drumbeat',
      type: 'StartsUsing',
      netRegex: { id: '678E', source: 'Daivadipa' },
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Hunt Daivadipa Cosmic Weave',
      type: 'StartsUsing',
      netRegex: { id: '6791', source: 'Daivadipa', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Daivadipa Infernal Redemption',
      type: 'StartsUsing',
      netRegex: { id: '6795', source: 'Daivadipa', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Daivadipa Leftward Trisula',
      type: 'StartsUsing',
      netRegex: { id: '678C', source: 'Daivadipa', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
    {
      id: 'Hunt Daivadipa Rightward Parasu',
      type: 'StartsUsing',
      netRegex: { id: '678D', source: 'Daivadipa', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goLeft(),
    },
    {
      id: 'Hunt Daivadipa Divine Call',
      type: 'GainsEffect',
      // combos with other mechanics
      // limit to how many players are affected per cast
      // 7A6 = Forward March
      // 7A7 = About Face
      // 7A8 = Left Face
      // 7A9 = Right Face
      netRegex: { effectId: '7A[6-9]' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
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
          en: 'Forward March',
          de: 'Geistlenkung vorwärts',
          ja: '強制移動: 前',
          cn: '强制移动: 前',
          ko: '강제이동: 앞',
        },
        backward: {
          en: 'Backward March',
          de: 'Geistlenkung rückwärts',
          ja: '強制移動: 後ろ',
          cn: '强制移动: 后',
          ko: '강제이동: 뒤',
        },
        left: {
          en: 'Left March',
          de: 'Geistlenkung links',
          ja: '強制移動: 左',
          cn: '强制移动: 左',
          ko: '강제이동: 왼쪽',
        },
        right: {
          en: 'Right March',
          de: 'Geistlenkung rechts',
          ja: '強制移動: 右',
          cn: '强制移动: 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
    {
      id: 'Hunt Daivadipa Loyal Flame',
      type: 'StartsUsing',
      // 6782 = Red flames go first
      // 6783 = Blue flames go first
      netRegex: { id: '678[23]', source: 'Daivadipa' },
      condition: (data) => data.inCombat,
      alertText: (_data, matches, output) => {
        const id = matches.id.toUpperCase();
        if (id === '6782')
          return output.red();
        if (id === '6783')
          return output.blue();
      },
      outputStrings: {
        red: {
          en: 'Blue => Red',
          de: 'Blau => Rot',
          ja: '青 => 赤',
          cn: '蓝 => 红',
          ko: '파랑 => 빨강',
        },
        blue: {
          en: 'Red => Blue',
          de: 'Rot => Blau',
          ja: '赤 => 青',
          cn: '红 => 蓝',
          ko: '빨강 => 파랑',
        },
      },
    },
    {
      id: 'Hunt Daivadipa Karmic Flames',
      type: 'StartsUsing',
      // proximity AoE from center of arena
      netRegex: { id: '6793', source: 'Daivadipa', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Daivadipa Errant Akasa',
      type: 'StartsUsing',
      netRegex: { id: '6792', source: 'Daivadipa', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Daivadipa': 'Daivadipa',
        'Sphatika': 'Sphatika',
        'Sugriva': 'Sugriva',
        'Yilan': 'Yilan',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Daivadipa': 'Daivadipa',
        'Sphatika': 'Sphatika',
        'Sugriva': 'Sugriva',
        'Yilan': 'yilan',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Daivadipa': 'ダイヴァディーパ',
        'Sphatika': 'スパティカ',
        'Sugriva': 'スグリーヴァ',
        'Yilan': 'ユラン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Daivadipa': '明灯天王',
        'Sphatika': '颇胝迦',
        'Sugriva': '须羯里婆',
        'Yilan': '尤兰',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Daivadipa': '다이바디파',
        'Sphatika': '스파티카',
        'Sugriva': '수그리바',
        'Yilan': '윌란',
      },
    },
  ],
});
