// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  'hyperdimensionalSlash': '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  'firechainCircle': '0119',
  'firechainTriangle': '011A',
  'firechainSquare': '011B',
  'firechainX': '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  'skywardLeap': '014A',
};
const firstMarker = {
  'doorboss': headmarkers.hyperdimensionalSlash,
  'thordan': headmarkers.skywardLeap,
};
const getHeadmarkerId = (data, matches, firstDecimalMarker) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined)
      throw new UnreachableCode();
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  initData: () => {
    return {
      phase: 'doorboss',
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            data.phase = 'thordan';
            break;
        }
      },
    },
    {
      id: 'DSR Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker = parseInt(firstMarker[data.phase], 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4', source: 'Ser Adelphel', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62D4', source: 'Adelphel', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62D4', source: 'Sire Adelphel', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62D4', source: '聖騎士アデルフェル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62D4', source: '圣骑士阿代尔斐尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62D4', source: '성기사 아델펠', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0', source: 'Ser Adelphel' }),
      netRegexDe: NetRegexes.startsUsing({ id: '62D0', source: 'Adelphel' }),
      netRegexFr: NetRegexes.startsUsing({ id: '62D0', source: 'Sire Adelphel' }),
      netRegexJa: NetRegexes.startsUsing({ id: '62D0', source: '聖騎士アデルフェル' }),
      netRegexCn: NetRegexes.startsUsing({ id: '62D0', source: '圣骑士阿代尔斐尔' }),
      netRegexKo: NetRegexes.startsUsing({ id: '62D0', source: '성기사 아델펠' }),
      response: Responses.interrupt(),
    },
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DA', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DA', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DA', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DA', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DA', source: '성기사 그리노', capture: false }),
      alertText: (data, _matches, output) => {
        return data.seenEmptyDimension ? output.in() : output.inAndTether();
      },
      run: (data) => data.seenEmptyDimension = true,
      outputStrings: {
        inAndTether: {
          en: 'In + Tank Tether',
          de: 'Rein + Tank-Verbindung',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DB', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DB', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DB', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DB', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DB', source: '성기사 그리노', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DC', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DC', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DC', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DC', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DC', source: '성기사 그리노', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.hyperdimensionalSlash)
          return output.slashOnYou();
      },
      outputStrings: {
        slashOnYou: {
          en: 'Slash on YOU',
          de: 'Schlag auf DIR',
        },
      },
    },
    {
      id: 'DSR Playstation Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle)
          return output.circle();
        if (id === headmarkers.firechainTriangle)
          return output.triangle();
        if (id === headmarkers.firechainSquare)
          return output.square();
        if (id === headmarkers.firechainX)
          return output.x();
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          de: 'Roter Kreis',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
        },
        x: {
          en: 'Blue X',
          de: 'Blaues X',
        },
      },
    },
    {
      id: 'DSR Ascalon\'s Mercy Concealed',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C8', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63C8', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63C8', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63C8', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63C8', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63C8', source: '기사신 토르당', capture: false }),
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Skyward Leap',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.skywardLeap)
          return output.leapOnYou();
      },
      outputStrings: {
        leapOnYou: {
          en: 'Leap on YOU',
          de: 'Sprung auf DIR',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'King Thordan': 'Thordan',
        'Ser Adelphel': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Guerrique': 'Guerrique',
        'Ser Hermenost': 'Hermenost',
        'Ser Ignasse': 'Ignasse',
        'Ser Janlenoux': 'Janlenoux',
        'Ser Zephirin': 'Zephirin',
      },
      'replaceText': {
        'Ancient Quaga': 'Seisga Antiqua',
        'Ascalon\'s Mercy Concealed': 'Askalons geheime Gnade',
        'Ascalon\'s Might': 'Macht von Askalon',
        'Brightblade\'s Steel': 'Schimmernder Stahl',
        'Brightwing(?!ed)': 'Lichtschwinge',
        'Brightwinged Flight': 'Flug der Lichtschwingen',
        'Conviction': 'Konviktion',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Empty Dimension': 'Dimension der Leere',
        'Execution': 'Exekution',
        'Faith Unmoving': 'Fester Glaube',
        'Full Dimension': 'Dimension der Weite',
        'Heavenly Heel': 'Himmelsschritt',
        'Heavensblaze': 'Himmlisches Lodern',
        'Heavensflame': 'Himmlische Flamme',
        'Heavy Impact': 'Heftiger Einschlag',
        'Holiest of Holy': 'Quell der Heiligkeit',
        'Holy Bladedance': 'Geweihter Schwerttanz',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Knights of the Round': 'Ritter der Runde',
        'Lightning Storm': 'Blitzsturm',
        'Planar Prison': 'Dimensionsfalle',
        'Pure of Heart': 'Reines Herz',
        'Skyblind': 'Lichtblind',
        'Skyward Leap': 'Luftsprung',
        'Spear of the Fury': 'Speer der Furie',
        'Spiral Thrust': 'Spiralstoß',
        'Strength of the Ward': 'Übermacht der Königsschar',
        'The Bull\'s Steel': 'Unbändiger Stahl',
        'The Dragon\'s Rage': 'Zorn des Drachen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'King Thordan': 'roi Thordan',
        'Ser Adelphel': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Guerrique': 'sire Guerrique',
        'Ser Hermenost': 'sire Hermenoist',
        'Ser Ignasse': 'sire Ignassel',
        'Ser Janlenoux': 'sire Janlenoux',
        'Ser Zephirin': 'sire Zéphirin',
      },
      'replaceText': {
        'Ancient Quaga': 'Méga Séisme ancien',
        'Ascalon\'s Mercy Concealed': 'Grâce d\'Ascalon dissimulée',
        'Ascalon\'s Might': 'Puissance d\'Ascalon',
        'Brightblade\'s Steel': 'Résolution radiante',
        'Brightwing(?!ed)': 'Aile lumineuse',
        'Brightwinged Flight': 'Vol céleste',
        'Conviction': 'Conviction',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Empty Dimension': 'Vide dimensionnel',
        'Execution': 'Exécution',
        'Faith Unmoving': 'Foi immuable',
        'Full Dimension': 'Plénitude dimensionnelle',
        'Heavenly Heel': 'Estoc céleste',
        'Heavensblaze': 'Embrasement céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavy Impact': 'Impact violent',
        'Holiest of Holy': 'Saint des saints',
        'Holy Bladedance': 'Danse de la lame céleste',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Knights of the Round': 'Chevaliers de la Table ronde',
        'Lightning Storm': 'Pluie d\'éclairs',
        'Planar Prison': 'Prison dimensionnelle',
        'Pure of Heart': 'Pureté du cœur',
        'Skyblind': 'Sceau céleste',
        'Skyward Leap': 'Bond céleste',
        'Spear of the Fury': 'Lance de la Conquérante',
        'Spiral Thrust': 'Transpercement tournoyant',
        'Strength of the Ward': 'Force du Saint-Siège',
        'The Bull\'s Steel': 'Résolution rueuse',
        'The Dragon\'s Rage': 'Colère du dragon',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'King Thordan': '騎神トールダン',
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Guerrique': '聖騎士ゲリック',
        'Ser Hermenost': '聖騎士エルムノスト',
        'Ser Ignasse': '聖騎士イニアセル',
        'Ser Janlenoux': '聖騎士ジャンルヌ',
        'Ser Zephirin': '聖騎士ゼフィラン',
      },
      'replaceText': {
        'Ancient Quaga': 'エンシェントクエイガ',
        'Ascalon\'s Mercy Concealed': 'インビジブル・アスカロンメルシー',
        'Ascalon\'s Might': 'アスカロンマイト',
        'Brightblade\'s Steel': '美剣の覚悟',
        'Brightwing(?!ed)': '光翼閃',
        'Brightwinged Flight': '蒼天の光翼',
        'Conviction': 'コンヴィクション',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Empty Dimension': 'エンプティディメンション',
        'Execution': 'エクスキューション',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Full Dimension': 'フルディメンション',
        'Heavenly Heel': 'ヘヴンリーヒール',
        'Heavensblaze': 'ヘヴンブレイズ',
        'Heavensflame': 'ヘヴンフレイム',
        'Heavy Impact': 'ヘヴィインパクト',
        'Holiest of Holy': 'ホリエストホーリー',
        'Holy Bladedance': 'ホーリーブレードダンス',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Knights of the Round': 'ナイツ・オブ・ラウンド',
        'Lightning Storm': '百雷',
        'Planar Prison': 'ディメンションジェイル',
        'Pure of Heart': 'ピュア・オブ・ハート',
        'Skyblind': '蒼天の刻印',
        'Skyward Leap': 'スカイワードリープ',
        'Spear of the Fury': 'スピア・オブ・ハルオーネ',
        'Spiral Thrust': 'スパイラルスラスト',
        'Strength of the Ward': '蒼天の陣：雷槍',
        'The Bull\'s Steel': '戦狂の覚悟',
        'The Dragon\'s Rage': '邪竜の魔炎',
      },
    },
  ],
});
