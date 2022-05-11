const storedMechanicsOutputStrings = {
  spread: Outputs.spread,
  stack: {
    en: 'Party Stack',
    de: 'Mit der Party sammeln',
    fr: 'Package en groupe',
    ja: '全員集合',
    cn: '全体分摊',
    ko: '파티 전체 쉐어',
  },
};
const crystallizeOutputStrings = {
  ...storedMechanicsOutputStrings,
  crystallize: {
    en: 'Crystallize: ${name}',
    de: 'Kristalisieren: ${name}',
    fr: 'Cristallisation : ${name}',
    ja: 'クリスタライズ: ${name}',
    cn: '水晶化: ${name}',
    ko: '크리스탈화: ${name}',
  },
};
const comboOutputStrings = {
  ...storedMechanicsOutputStrings,
  combo: {
    en: '${first} => ${second}',
    de: '${first} => ${second}',
    fr: '${first} => ${second}',
    ja: '${first} => ${second}',
    cn: '${first} => ${second}',
    ko: '${first} => ${second}',
  },
};
// Hydaelyn Normal Mode
Options.Triggers.push({
  zoneId: ZoneId.TheMothercrystal,
  timelineFile: 'hydaelyn.txt',
  triggers: [
    {
      id: 'Hydaelyn Heros\'s Radiance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65D7', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65D7', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65D7', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65D7', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65D7', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65D7', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hydaelyn Magos\'s Raidance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65D8', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65D8', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65D8', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65D8', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65D8', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65D8', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hydaelyn Crystallize Ice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '659C', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '659C', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '659C', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '659C', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '659C', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '659C', source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.crystallize({ name: output.spread() }),
      run: (data) => data.crystallize = 'spread',
      outputStrings: crystallizeOutputStrings,
    },
    {
      id: 'Hydaelyn Crystallize Stone',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '659E', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '659E', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '659E', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '659E', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '659E', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '659E', source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.crystallize({ name: output.stack() }),
      run: (data) => data.crystallize = 'stack',
      outputStrings: crystallizeOutputStrings,
    },
    {
      id: 'Hydaelyn Dawn Mantle Equinox',
      type: 'StartsUsing',
      // Equinox is more complicated in normal mode than extreme.
      // There is no 8E1 effect for Equinox (a parser bug?), and there are some places where
      // it is used randomly and not in fixed places, and so it can't just be a timeline trigger.
      // However, in normal mode, Dawn Mantle is always cast prior to the marker appearing,
      // so assume any Dawn Mantle is Equinox unless we figure out otherwise.
      netRegex: NetRegexes.startsUsing({ id: '6C0C', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6C0C', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6C0C', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6C0C', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6C0C', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6C0C', source: '하이델린', capture: false }),
      preRun: (data) => data.isEquinox = true,
      // Dawn Mantle is a 4.9s cast, plus the normal 2.5s delay.  (See Anthelion comment below.)
      delaySeconds: 2.5 + 4.9,
      durationSeconds: (data) => data.crystallize ? 6.5 : 3.5,
      alertText: (data, _matches, output) => {
        // If we've gotten some 8E1 effect, ignore this.
        if (!data.isEquinox)
          return;
        if (data.crystallize)
          return output.combo({ first: output.intercards(), second: output[data.crystallize]() });
        return output.intercards();
      },
      run: (data) => {
        // Don't clear the crystallize if it's going to be used for Anthelion or Highest Holy.
        if (data.isEquinox)
          delete data.crystallize;
      },
      outputStrings: {
        ...comboOutputStrings,
        intercards: {
          en: 'Intercards',
          de: 'Interkardinal',
          fr: 'Intercardinal',
          ja: '斜めへ',
          cn: '四角',
          ko: '대각선 쪽으로',
        },
      },
    },
    {
      id: 'Hydaelyn Marker Anthelion',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B5', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B5', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B5', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '8E1', source: 'ハイデリン', count: '1B5', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '8E1', source: '海德林', count: '1B5', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: '8E1', source: '하이델린', count: '1B5', capture: false }),
      // Example timeline:
      //     t=0 StartsCasting Crystallize
      //     t=4 ActionEffect Crystalize
      //     t=7 StatusAdd 81E (this regex)
      //     t=9.5 marker appears
      //     t=13 ActionEffect Anthelion
      //     t=17 ActionEffect Crystalline Blizzard
      //
      // We could call this out immediately, but then it's very close to the Crystallize call.
      // Additionally, if we call this out immediately then players have to remember something
      // for 10 seconds.  A delay of 2.5 feels more natural in terms of time to react and
      // handle this, rather than calling it out extremely early.  Also, add a duration so that
      // this stays on screen until closer to the Crystalline action.  This also puts this call
      // closer to when the marker appears on screen, and so feels a little bit more natural.
      preRun: (data) => data.isEquinox = false,
      delaySeconds: 2.5,
      durationSeconds: (data) => data.crystallize ? 6.5 : 3.5,
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo({ first: output.in(), second: output[data.crystallize]() });
        return output.in();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        in: Outputs.in,
      },
    },
    {
      id: 'Hydaelyn Marker Highest Holy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B4', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B4', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B4', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '8E1', source: 'ハイデリン', count: '1B4', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '8E1', source: '海德林', count: '1B4', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: '8E1', source: '하이델린', count: '1B4', capture: false }),
      preRun: (data) => data.isEquinox = false,
      delaySeconds: 2.5,
      durationSeconds: (data) => data.crystallize ? 6.5 : 3.5,
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo({ first: output.out(), second: output[data.crystallize]() });
        return output.out();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        out: Outputs.out,
      },
    },
    {
      id: 'Hydaelyn Mousa\'s Scorn',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65D6', source: 'Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65D6', source: 'Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65D6', source: 'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65D6', source: 'ハイデリン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65D6', source: '海德林' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65D6', source: '하이델린' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'Hydaelyn Exodus',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '65BB', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '65BB', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '65BB', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '65BB', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '65BB', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '65BB', source: '하이델린', capture: false }),
      // 14.8 seconds from this ability (no cast) to 662B raidwide.
      delaySeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Hydaelyn Radiant Halo',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65D0', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65D0', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65D0', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65D0', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65D0', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65D0', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hydaelyn Heros\'s Sundering',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65D5', source: 'Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65D5', source: 'Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65D5', source: 'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65D5', source: 'ハイデリン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65D5', source: '海德林' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65D5', source: '하이델린' }),
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'Hydaelyn Echo Crystaline Stone III',
      type: 'StartsUsing',
      // Midphase stack.
      netRegex: NetRegexes.startsUsing({ id: '6C59', source: 'Echo of Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6C59', source: 'Echo Der Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6C59', source: 'Écho D\'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6C59', source: 'ハイデリン・エコー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6C59', source: '海德林的回声', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6C59', source: '하이델린 투영체', capture: false }),
      alertText: (_data, _matches, output) => output.stack(),
      outputStrings: {
        stack: crystallizeOutputStrings.stack,
      },
    },
    {
      id: 'Hydaelyn Echo Crystaline Blizzard III',
      type: 'StartsUsing',
      // Midphase spread.
      netRegex: NetRegexes.startsUsing({ id: '6C5A', source: 'Echo of Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6C5A', source: 'Echo Der Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6C5A', source: 'Écho D\'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6C5A', source: 'ハイデリン・エコー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6C5A', source: '海德林的回声' }),
      netRegexKo: NetRegexes.startsUsing({ id: '6C5A', source: '하이델린 투영체' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.spread(),
      outputStrings: {
        spread: crystallizeOutputStrings.spread,
      },
    },
    {
      id: 'Hydaelyn Parhelic Circle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65AC', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65AC', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65AC', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65AC', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65AC', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65AC', source: '하이델린', capture: false }),
      durationSeconds: 9,
      alertText: (_data, _matches, output) => output.avoid(),
      run: (data) => delete data.crystallize,
      outputStrings: {
        avoid: {
          en: 'Avoid Line Ends',
          de: 'Weiche den Enden der Linien aus',
          fr: 'Évitez les fins de lignes',
          ja: '線の端から離れる',
          cn: '远离线',
          ko: '선의 끝부분 피하기',
        },
      },
    },
    {
      id: 'Hydaelyn Echoes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65B[567]', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65B[567]', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65B[567]', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65B[567]', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65B[567]', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65B[567]', source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack 5x',
          de: '5x Sammeln',
          fr: '5x Packages',
          ja: '頭割り５回',
          cn: '5连分摊',
          ko: '쉐어 5번',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Crystalline Blizzard III/Crystalline Stone III': 'Crystalline Blizzard/Stone III',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Echo of Hydaelyn': 'Echo der Hydaelyn',
        '(?<!of )Hydaelyn': 'Hydaelyn',
        'Mystic Refulgence': 'Truglicht',
      },
      'replaceText': {
        'Anthelion': 'Anthelion',
        'Beacon': 'Lichtschein',
        'Crystalline Blizzard III': 'Kristall-Eisga',
        'Crystalline Stone III': 'Kristall-Steinga',
        'Crystallize': 'Kristallisieren',
        'Dawn Mantle': 'Neuer Mantel',
        'Echoes': 'Echos',
        'Equinox': 'Äquinoktium',
        'Exodus': 'Exodus',
        'Heros\'s Radiance': 'Glanz des Heros',
        'Heros\'s Sundering': 'Schlag des Heros',
        'Highest Holy': 'Höchstes Sanctus',
        'Hydaelyn\'s Ray': 'Strahl der Hydaelyn',
        'Incandescence': 'Inkandeszenz',
        'Lightwave': 'Lichtwoge',
        'Magos\'s Radiance': 'Glanz des Magos',
        'Mousa\'s Scorn': 'Zorn der Mousa',
        'Parhelic Circle': 'Horizontalkreis',
        '(?<!Sub)Parhelion': 'Parhelion',
        'Radiant Halo': 'Strahlender Halo',
        'Subparhelion': 'Subparhelion',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Echo of Hydaelyn': 'écho d\'Hydaelyn',
        '(?<!of )Hydaelyn': 'Hydaelyn',
        'Mystic Refulgence': 'illusion de Lumière',
      },
      'replaceText': {
        '\\?': ' ?',
        'Anthelion': 'Anthélie',
        'Beacon': 'Rayon de Lumière',
        'Crystalline Blizzard III': 'Méga Glace cristallisée',
        'Crystalline Stone III': 'Méga Terre cristallisée',
        'Crystallize': 'Cristallisation',
        'Dawn Mantle': 'Changement de cape',
        'Echoes': 'Échos',
        'Equinox': 'Équinoxe',
        'Exodus': 'Exode',
        'Heros\'s Radiance': 'Radiance du héros',
        'Heros\'s Sundering': 'Fragmentation du héros',
        'Highest Holy': 'Miracle suprême',
        'Hydaelyn\'s Ray': 'Rayon d\'Hydaelyn',
        'Incandescence': 'Incandescence',
        'Lightwave': 'Vague de Lumière',
        'Magos\'s Radiance': 'Radiance du mage',
        'Mousa\'s Scorn': 'Mépris de la muse',
        'Parhelic Circle': 'Cercle parhélique',
        '(?<!Sub)Parhelion': 'Parhélie',
        'Radiant Halo': 'Halo radiant',
        'Subparhelion': 'Subparhélie',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Echo of Hydaelyn': 'ハイデリン・エコー',
        '(?<!of )Hydaelyn': 'ハイデリン',
        'Mystic Refulgence': '幻想光',
      },
      'replaceText': {
        'Anthelion': 'アントゥヘリオン',
        'Beacon': '光芒',
        'Crystalline Blizzard III': 'クリスタル・ブリザガ',
        'Crystalline Stone III': 'クリスタル・ストンガ',
        'Crystallize': 'クリスタライズ',
        'Dawn Mantle': 'マントチェンジ',
        'Echoes': 'エコーズ',
        'Equinox': 'エクイノックス',
        'Exodus': 'エクソダス',
        'Heros\'s Radiance': 'ヘロイスラジエンス',
        'Heros\'s Sundering': 'ヘロイスサンダリング',
        'Highest Holy': 'ハイエストホーリー',
        'Hydaelyn\'s Ray': 'ハイデリンレイ',
        'Incandescence': '幻閃光',
        'Lightwave': 'ライトウェーブ',
        'Magos\'s Radiance': 'マゴスラジエンス',
        'Mousa\'s Scorn': 'ムーサスコーン',
        'Parhelic Circle': 'パーヘリックサークル',
        '(?<!Sub)Parhelion': 'パルヘリオン',
        'Radiant Halo': 'レディアントヘイロー',
        'Subparhelion': 'サブパルヘリオン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Echo of Hydaelyn': '海德林的回声',
        '(?<!of )Hydaelyn': '海德林',
        'Mystic Refulgence': '幻想光',
      },
      'replaceText': {
        'Anthelion': '反假日',
        'Beacon': '光芒',
        'Crystalline Blizzard III': '水晶冰封',
        'Crystalline Stone III': '水晶垒石',
        'Crystallize': '结晶',
        'Dawn Mantle': '职责更换',
        'Echoes': '回声',
        'Equinox': '昼夜二分',
        'Exodus': '众生离绝',
        'Heros\'s Radiance': '守护者的光辉',
        'Heros\'s Sundering': '守护者的斩断',
        'Highest Holy': '至高神圣',
        'Hydaelyn\'s Ray': '海德林光线',
        'Incandescence': '幻闪光',
        'Lightwave': '光波',
        'Magos\'s Radiance': '魔法师的光辉',
        'Mousa\'s Scorn': '演艺家的蔑视',
        'Parhelic Circle': '幻日环',
        '(?<!Sub)Parhelion': '幻日',
        'Radiant Halo': '明辉光环',
        'Subparhelion': '映幻日',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Echo of Hydaelyn': '하이델린 투영체',
        'Mystic Refulgence': '환상빛',
        '(?<!of )Hydaelyn': '하이델린',
      },
      'replaceText': {
        'Anthelion': '맞무리해',
        'Beacon': '광망',
        'Crystalline Blizzard III': '크리스탈 블리자가',
        'Crystalline Stone III': '크리스탈 스톤가',
        'Crystallize': '크리스탈화',
        'Dawn Mantle': '망토 변경',
        'Echoes': '되울림',
        'Equinox': '이분점',
        'Exodus': '엑소더스',
        'Heros\'s Radiance': '헤로이스의 광휘',
        'Heros\'s Sundering': '헤로이스의 절단',
        'Highest Holy': '지고의 홀리',
        'Hydaelyn\'s Ray': '하이델린 광선',
        'Incandescence': '환섬광',
        'Lightwave': '빛의 파도',
        'Magos\'s Radiance': '마고스의 광휘',
        'Mousa\'s Scorn': '무사의 경멸',
        'Parhelic Circle': '무리해고리',
        'Radiant Halo': '눈부신 빛무리',
        'Subparhelion': '무리햇빛',
        '(?<!Sub)Parhelion': '무리해',
      },
    },
  ],
});
