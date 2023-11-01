Options.Triggers.push({
  id: 'TheAetherfont',
  zoneId: ZoneId.TheAetherfont,
  timelineFile: 'aetherfont.txt',
  triggers: [
    {
      id: 'Aetherfont Lyngbakr Upsweep',
      type: 'StartsUsing',
      netRegex: { id: '823A', source: 'Lyngbakr', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aetherfont Lyngbakr Bodyslam',
      type: 'StartsUsing',
      netRegex: { id: '8237', source: 'Lyngbakr', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aetherfont Lyngbakr Tidal Breath',
      type: 'StartsUsing',
      netRegex: { id: '8240', source: 'Lyngbakr', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aetherfont Lyngbakr Floodstide',
      type: 'StartsUsing',
      netRegex: { id: '823D', source: 'Lyngbakr', capture: false },
      // 00600 spread headmarkers come out after cast ends
      durationSeconds: 8,
      response: Responses.spread(),
    },
    {
      id: 'Aetherfont Lyngbakr Tidalspout',
      type: 'StartsUsing',
      netRegex: { id: '823F', source: 'Lyngbakr' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Aetherfont Lyngbakr Sonic Bloop',
      type: 'StartsUsing',
      netRegex: { id: '8241', source: 'Lyngbakr' },
      response: Responses.tankBuster(),
    },
    {
      // Initial battle cry is just aoe, the later ones create a ring.
      id: 'Aetherfont Arkas Battle Cry Initial',
      type: 'StartsUsing',
      netRegex: { id: '872D', source: 'Arkas', capture: false },
      response: Responses.aoe(),
    },
    {
      // aoe + ring
      id: 'Aetherfont Arkas Battle Cry',
      type: 'StartsUsing',
      netRegex: { id: '8254', source: 'Arkas', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + Get Middle',
          de: 'AoE + Geh in die Mitte',
          fr: 'AoE + Allez au milieu',
          ja: '全体攻撃 + 真ん中',
          cn: 'AoE + 去场中',
          ko: '전체공격 + 중앙으로',
        },
      },
    },
    {
      id: 'Aetherfont Arkas Ripper Claw',
      type: 'StartsUsing',
      netRegex: { id: '8258', source: 'Arkas' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aetherfont Arkas Lightning Claw',
      type: 'StartsUsing',
      netRegex: { id: '8798', source: 'Arkas' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Aetherfont Arkas Electrify',
      type: 'Ability',
      // 8256 is the damage ability for Lightning Claw, which is followed by a centered aoe.
      netRegex: { id: '8256', source: 'Arkas', capture: false },
      suppressSeconds: 5,
      response: Responses.getOut(),
    },
    {
      id: 'Aetherfont Octomammoth Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '824C', source: 'Octomammoth', capture: false },
      response: Responses.aoe(),
    },
    {
      // aoe + ring
      id: 'Aetherfont Octomammoth Saline Spit',
      type: 'StartsUsing',
      netRegex: { id: '8248', source: 'Octomammoth', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand Between Platforms',
          de: 'Steh zwischen den Platformen',
          fr: 'Restez entre les plateformes',
          ja: '通路へ',
          cn: '站在平台间',
          ko: '플랫폼 사이로',
        },
      },
    },
    {
      id: 'Aetherfont Octomamoth Water Drop',
      type: 'StartsUsing',
      netRegex: { id: '8684', source: 'Octomammoth' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Aetherfont Octomammoth Tidal Breath',
      type: 'StartsUsing',
      netRegex: { id: '824A', source: 'Octomammoth', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aetherfont Octomammoth Breathstroke',
      type: 'StartsUsing',
      netRegex: { id: '86F7', source: 'Octomammoth', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind (Avoid Tentacles)',
          de: 'Geh nach Hinten (Vermeide Tentakel)',
          fr: 'Allez derrière (évitez les tentacules)',
          ja: 'ボスの後ろへ (テンタクル回避)',
          cn: '去背后（躲避触手）',
          ko: '보스 뒤로 (촉수 피하기)',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Arkas': 'Arkas',
        'Cyancap Cavern': 'Zyanspitze',
        'Lyngbakr': 'Lyngbakr',
        'Mammoth Tentacle': 'Oktomammut-Tentakel',
        'Octomammoth': 'Oktomammut',
        'The Deep Below': 'Ätherpfuhl',
        'The Landfast Floe': 'Raureif-Rondell',
      },
      'replaceText': {
        '\\(big\\)': '(groß)',
        '\\(small\\)': '(klein)',
        '\\(explosion\\)': '(Explosion)',
        '\\(tether\\)': '(Verbindung)',
        'Battle Cry': 'Kampfesschrei',
        'Body Slam': 'Bodenwelle',
        'Breathstroke': 'Hauchiger Hieb',
        'Clearout': 'Kreisfeger',
        'Electric Eruption': 'Blitzeruption',
        'Electrify': 'Elektrisieren',
        'Explosive Frequency': 'Explosivfrequenz',
        'Floodstide': 'Flutzeit',
        'Forked Fissures': 'Funkenstrom',
        'Lightning Claw': 'Funkenklaue',
        'Lightning Leap': 'Funkensprung',
        'Lightning Rampage': 'Funkensturm',
        'Octostroke': 'Oktoschlag',
        'Resonant Frequency': 'Resonanzfrequenz',
        'Ripper Claw': 'Fetzklaue',
        'Saline Spit': 'Spuckstrahl',
        'Shock': 'Entladung',
        'Sonic Bloop': 'Ruf aus der Tiefe',
        'Spinning Claw': 'Wirbelklaue',
        'Spun Lightning': 'Blitzgespinst',
        'Tidal Breath': 'Hauch der Gezeiten',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidalspout': 'Wassersturm',
        'Upsweep': 'Aufbrecher',
        'Vivid Eyes': 'Wilde Augen',
        'Water Drop': 'Rauschendes Wasser',
        'Waterspout': 'Wasserhose',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Arkas': 'Arkas',
        'Cyancap Cavern': 'Caverne de Cap-cyan',
        'Lyngbakr': 'Lyngbakr',
        'Mammoth Tentacle': 'bras d\'octomammouth',
        'Octomammoth': 'octomammouth',
        'The Deep Below': 'Bassin éthéré',
        'The Landfast Floe': 'Cirque glacé',
      },
      'replaceText': {
        'Battle Cry': 'Cri de guerre',
        'Body Slam': 'Charge physique',
        'Breathstroke': 'Souffle et fauche',
        'Clearout': 'Fauchage',
        'Electric Eruption': 'Éruption d\'éclairs',
        'Electrify': 'Électrisation',
        'Explosive Frequency': 'Grande explosion résonante',
        'Floodstide': 'Marée montante',
        'Forked Fissures': 'Flux foudroyant',
        'Lightning Claw': 'Griffe survoltée',
        'Lightning Leap': 'Bond électrique',
        'Lightning Rampage': 'Ravage tonitruant',
        'Octostroke': 'Octofauche',
        'Resonant Frequency': 'Explosion résonante',
        'Ripper Claw': 'Griffe éventreuse',
        'Saline Spit': 'Crachat aqueux',
        'Shock': 'Décharge électrostatique',
        'Sonic Bloop': 'Bloup sonique',
        'Spinning Claw': 'Griffe tournoyante',
        'Spun Lightning': 'Rayon fulgurant',
        'Tidal Breath': 'Souffle supratidal',
        'Tidal Roar': 'Vague rugissante',
        'Tidalspout': 'Déferlement soudain',
        'Upsweep': 'Écho sinistre',
        'Vivid Eyes': 'Regard transperçant',
        'Water Drop': 'Boule d\'eau',
        'Waterspout': 'Inondation',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Arkas': 'アルカス',
        'Cyancap Cavern': 'シアンキャップ中継地',
        'Lyngbakr': 'リングバーク',
        'Mammoth Tentacle': 'オクトマンモスの腕',
        'Octomammoth': 'オクトマンモス',
        'The Deep Below': 'エーテリックポンド',
        'The Landfast Floe': '流氷の円庭',
      },
      'replaceText': {
        'Battle Cry': 'バトルクライ',
        'Body Slam': 'ボディスラム',
        'Breathstroke': 'ブレス&スワイプ',
        'Clearout': 'なぎ払い',
        'Electric Eruption': 'ライトニングエラプション',
        'Electrify': '大放電',
        'Explosive Frequency': '共振大炸裂',
        'Floodstide': 'フラッドタイド',
        'Forked Fissures': 'ライトニングカレント',
        'Lightning Claw': 'ライトニングクロウ',
        'Lightning Leap': 'ライトニングリープ',
        'Lightning Rampage': 'ライトニングランページ',
        'Octostroke': 'オクトスワイプ',
        'Resonant Frequency': '共振炸裂',
        'Ripper Claw': 'リッパークロウ',
        'Saline Spit': 'スピットウォーター',
        'Shock': '放電',
        'Sonic Bloop': 'ソニックブループ',
        'Spinning Claw': 'スピニングクロウ',
        'Spun Lightning': 'スパンライトニング',
        'Tidal Breath': 'タイダルブレス',
        'Tidal Roar': 'タイダルロア',
        'Tidalspout': 'バーストフラッド',
        'Upsweep': 'アプスウィープ',
        'Vivid Eyes': 'ビビッドアイズ',
        'Water Drop': '水塊',
        'Waterspout': 'オーバーフラッド',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Arkas': '阿尔卡斯',
        'Cyancap Cavern': '蓝檐洞中转点',
        'Lyngbakr': '林巴克尔',
        'Mammoth Tentacle': '八足巨妖的触手',
        'Octomammoth': '八足巨妖',
        'The Deep Below': '以太池',
        'The Landfast Floe': '流冰圆庭',
      },
      'replaceText': {
        '\\(big\\)': '(大)',
        '\\(small\\)': '(小)',
        '\\(explosion\\)': '(爆炸)',
        '\\(tether\\)': '(连线)',
        'Battle Cry': '战斗怒嚎',
        'Body Slam': '躯体震击',
        'Breathstroke': '吐息重击',
        'Clearout': '横扫',
        'Electric Eruption': '惊电喷发',
        'Electrify': '大放电',
        'Explosive Frequency': '共振大炸裂',
        'Floodstide': '潮水涌动',
        'Forked Fissures': '惊电裂隙',
        'Lightning Claw': '惊电爪',
        'Lightning Leap': '惊电跳跃',
        'Lightning Rampage': '惊电狂怒',
        'Octostroke': '八足重击',
        'Resonant Frequency': '共振炸裂',
        'Ripper Claw': '撕裂利爪',
        'Saline Spit': '吐水',
        'Shock': '放电',
        'Sonic Bloop': '杂音波',
        'Spinning Claw': '回旋雷爪',
        'Spun Lightning': '旋转闪电',
        'Telekinesis': '念力',
        'Tidal Breath': '怒潮吐息',
        'Tidal Roar': '怒潮咆哮',
        'Tidalspout': '潮水喷涌',
        'Upsweep': '海洋怪声',
        'Vivid Eyes': '灵动之眼',
        'Water Drop': '水块',
        'Waterspout': '海龙卷',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Arkas': '아르카스',
        'Cyancap Cavern': '푸른챙 중계지',
        'Lyngbakr': '링기바크',
        'Mammoth Tentacle': '옥토매머드 촉수',
        'Octomammoth': '옥토매머드',
        'The Deep Below': '에테르 연못',
        'The Landfast Floe': '둥근 유빙',
      },
      'replaceText': {
        '\\(big\\)': '(큰)',
        '\\(small\\)': '(작은)',
        '\\(explosion\\)': '(폭발)',
        '\\(tether\\)': '(선)',
        'Battle Cry': '호전적 포효',
        'Body Slam': '몸통 박기',
        'Breathstroke': '해일 숨결 후려치기',
        'Clearout': '휩쓸기',
        'Electric Eruption': '번개 분출',
        'Electrify': '대방전',
        'Explosive Frequency': '공진 대작렬',
        'Floodstide': '큰물의 흐름',
        'Forked Fissures': '번개 전류',
        'Lightning Claw': '번개 발톱',
        'Lightning Leap': '번개 도약',
        'Lightning Rampage': '번개 난동',
        'Octostroke': '촉수 후려치기',
        'Resonant Frequency': '공진 작렬',
        'Ripper Claw': '발톱 난도질',
        'Saline Spit': '물 뱉기',
        'Shock': '방전',
        'Sonic Bloop': '잡음파',
        'Spinning Claw': '회전 발톱',
        'Spun Lightning': '방사된 번개',
        'Telekinesis': '염동력',
        'Tidal Breath': '해일 숨결',
        'Tidal Roar': '바다의 포효',
        'Tidalspout': '큰물 폭탄',
        'Upsweep': '심해음',
        'Vivid Eyes': '또렷한 눈동자',
        'Water Drop': '물덩어리',
        'Waterspout': '용오름',
      },
    },
  ],
});
