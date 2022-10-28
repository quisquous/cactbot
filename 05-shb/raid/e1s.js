Options.Triggers.push({
  zoneId: ZoneId.EdensGateResurrectionSavage,
  timelineFile: 'e1s.txt',
  timeline: [
    (data) => {
      const chance = 0.4;
      const time = '275';
      if (Math.random() >= chance)
        return;
      const goofsByLang = {
        en: [
          'brb',
          ':zzz:',
          'LA HEE',
          'Quick Powernap',
          'brb making coffee',
          'Eden\'s Snoozefest',
          'rip enochian',
        ],
        de: [
          'brb',
          ':zzz:',
          'LA HEE',
          'Kurzer Powernap',
          'brb Kafee machen',
          'Eden\'s Schlaffest',
          'tschüss Henochisch',
        ],
        fr: [
          'Brb',
          ':zzz:',
          'LA HEE',
          'Courte sieste',
          'brb faire du café',
          'Eden\'s Dormez bien',
          'Rip énochien',
        ],
        ja: [
          'ちょっと待ってください',
          '眠い :zzz:',
          'LAHEE~',
          '居眠りでもしましょうか',
          'コーヒー飲むにいこう',
          'ほらエデンも眠った',
          'エノキアンにRIP',
        ],
        cn: [
          '马上回来',
          '困了睡会儿',
          'LAHEE~',
          '冲杯咖啡',
          '圣诞快乐',
          '我柜子动了等下再玩',
          'CG',
        ],
      };
      const goofs = goofsByLang[data.displayLang];
      if (!goofs)
        return;
      const goof = goofs[Math.floor(Math.random() * goofs.length)];
      if (goof)
        return `${time} "${goof}"`;
    },
  ],
  triggers: [
    {
      id: 'E1S Initial',
      type: 'StartsUsing',
      netRegex: { id: '3D70', source: 'Eden Prime', capture: false },
      run: (data) => {
        if (!data.viceCount) {
          data.viceCount = 1;
          data.vice = 'dps';
        }
      },
    },
    {
      id: 'E1S Paradise Regained',
      type: 'GainsEffect',
      netRegex: { target: 'Eden Prime', effectId: '7B6', capture: false },
      run: (data) => data.paradise = true,
    },
    {
      id: 'E1S Paradise Regained But Lost',
      type: 'LosesEffect',
      netRegex: { target: 'Eden Prime', effectId: '7B6', capture: false },
      run: (data) => data.paradise = false,
    },
    {
      id: 'E1S Eden\'s Gravity',
      type: 'StartsUsing',
      netRegex: { id: '3D70', source: 'Eden Prime', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Fragor Maximus',
      type: 'StartsUsing',
      netRegex: { id: '3D8B', source: 'Eden Prime', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Dimensional Shift',
      type: 'StartsUsing',
      netRegex: { id: '3D7F', source: 'Eden Prime', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E1S Spear Of Paradise',
      type: 'StartsUsing',
      netRegex: { id: '3D88', source: 'Eden Prime' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E1S Eden\'s Flare',
      type: 'StartsUsing',
      netRegex: { id: '3D73', source: 'Eden Prime', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'E1S Delta Attack 1',
      type: 'StartsUsing',
      netRegex: { id: '44F4', source: 'Eden Prime', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cross Spread',
          de: 'Verteilen',
          fr: 'Dispersez-vous en croix',
          ja: '散開',
          cn: '四角躲避',
          ko: '산개',
        },
      },
    },
    {
      id: 'E1S Delta Attack 2',
      type: 'StartsUsing',
      netRegex: { id: '44F8', source: 'Eden Prime', capture: false },
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.getInSpread();
        return output.inStackBehind();
      },
      outputStrings: {
        getInSpread: {
          en: 'Get In, Spread',
          de: 'Rein gehen, verteilen',
          fr: 'À l\'intérieur, dispersez-vous',
          ja: '中で散開',
          cn: '中间散开',
          ko: '보스 가까이 탱 약산개',
        },
        inStackBehind: {
          en: 'In, Stack Behind',
          de: 'Rein, hinten stacken',
          fr: 'À l\'intérieur, packez derrière',
          ja: '背面集合',
          cn: '背面集合',
          ko: '보스 가까이, 뒤에서 쉐어',
        },
      },
    },
    {
      // 44EF: dps1
      // 3D7A: dps2
      // 44EE: tank1
      // 3D78: tank2
      // 44F0: healer1
      // 3D7D: healer2
      id: 'E1S Vice and Virtue Tracker',
      type: 'StartsUsing',
      netRegex: {
        id: ['44EF', '3D7A', '44EE', '3D78', '44F0', '3D7D'],
        source: 'Eden Prime',
        capture: false,
      },
      run: (data) => {
        // Note: this happens *after* the marks, so is setting up vice for the next marks.
        data.viceCount = (data.viceCount ?? 0) + 1;
        const viceMap = {
          1: 'dps',
          2: 'tank',
          3: 'healer',
          4: 'tank',
          5: 'dps',
          6: 'healer',
          7: 'tank',
          8: 'dps',
          9: 'healer',
          // theoretically??
          10: 'tank',
          11: 'dps',
          12: 'healer',
        };
        data.vice = viceMap[data.viceCount];
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2 Tracker',
      type: 'StartsUsing',
      netRegex: { id: '3D7A', source: 'Eden Prime', capture: false },
      run: (data) => data.vice = 'dps',
    },
    {
      id: 'E1S Vice and Virtue Tank 1',
      type: 'StartsUsing',
      netRegex: { id: '44EE', source: 'Eden Prime', capture: false },
      run: (data) => data.vice = 'healer',
    },
    {
      id: 'E1S Vice and Virtue Tank 2',
      type: 'StartsUsing',
      netRegex: { id: '3D78', source: 'Eden Prime', capture: false },
      run: (data) => data.vice = 'dps',
    },
    {
      id: 'E1S Vice and Virtue Healer 1',
      type: 'StartsUsing',
      netRegex: { id: '44F0', source: 'Eden Prime', capture: false },
      run: (data) => data.vice = 'tank',
    },
    {
      id: 'E1S Vice and Virtue Healer 2',
      type: 'StartsUsing',
      netRegex: { id: '3D7D', source: 'Eden Prime', capture: false },
      run: (data) => data.vice = 'tank',
    },
    {
      id: 'E1S Vice and Virtue DPS 1',
      type: 'HeadMarker',
      netRegex: { id: '00AE' },
      condition: (data, matches) =>
        !data.paradise && data.vice === 'dps' && data.me === matches.target,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Puddle Spread',
          de: 'Flächen verteilen',
          fr: 'Dispersez les zones au sol',
          ja: '離れて散開',
          cn: '分散放圈',
          ko: '장판 유도 산개',
        },
      },
    },
    {
      id: 'E1S Vice and Virtue DPS 2',
      type: 'StartsUsing',
      netRegex: { id: '3D7A', source: 'Eden Prime', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack With Partner',
          de: 'Mit Partner stacken',
          fr: 'Packez-vous avec votre partenaire',
          ja: '相方とスタック',
          cn: '与搭档集合',
          ko: '쉐어뎀 파트너랑 모이기',
        },
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Mark',
      type: 'HeadMarker',
      netRegex: { id: '00AE' },
      condition: (data, matches) => data.vice === 'tank' && data.me === matches.target,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank Laser on YOU',
          de: 'Tank Laser auf DIR',
          fr: 'Tank laser sur VOUS',
          ja: '自分にレーザー',
          cn: '坦克射线',
          ko: '탱 레이저 대상자',
        },
      },
    },
    {
      id: 'E1S Vice and Virtue Tank Stack',
      type: 'StartsUsing',
      netRegex: { id: '3D78', source: 'Eden Prime', capture: false },
      condition: (data) => data.role !== 'tank',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack in front of tank',
          de: 'Vorne mit dem Tank stacken',
          fr: 'Packez-vous devant le tank',
          ja: '左右に分かれて内側へ',
          cn: 'T前集合',
          ko: '좌우 탱커 앞 산개',
        },
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark YOU',
      type: 'GainsEffect',
      netRegex: { effectId: '840' },
      condition: Conditions.targetIsYou(),
      infoText: (data, _matches, output) => {
        if (data.paradise)
          return output.passPreyToDps();
        return output.passPreyToTank();
      },
      outputStrings: {
        passPreyToDps: {
          en: 'Pass Prey to DPS',
          de: 'Marker einem DPS geben',
          fr: 'Passez la marque à un DPS',
          ja: 'DPSに移して',
          cn: '传毒DPS',
          ko: '딜러한테 표식 넘기기',
        },
        passPreyToTank: {
          en: 'Pass Prey to Tank',
          de: 'Marker einem Tank geben',
          fr: 'Passez la marque à un Tank',
          ja: 'タンクに移して',
          cn: '传毒坦克',
          ko: '탱커한테 표식 넘기기',
        },
      },
    },
    {
      id: 'E1S Vice and Virtue Healer Mark Not You',
      type: 'GainsEffect',
      netRegex: { effectId: '840', capture: false },
      condition: (data) => {
        if (data.role === 'dps')
          return data.paradise;
        if (data.role === 'tank')
          return !data.paradise;
        return false;
      },
      suppressSeconds: 20,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Take prey from healer',
          de: 'Marker vom Heiler nehmen',
          fr: 'Prenez la marque du healer',
          ja: 'ヒーラーからマーカー取って',
          cn: '从奶妈拿毒',
          ko: '힐러한테서 표식 받기',
        },
      },
    },
    {
      id: 'E1S Mana Boost',
      type: 'StartsUsing',
      netRegex: { id: '3D8D', source: 'Guardian Of Paradise' },
      condition: (data) => data.CanSilence(),
      suppressSeconds: 1,
      response: Responses.interrupt(),
    },
    {
      id: 'E1S Pure Light',
      type: 'StartsUsing',
      netRegex: { id: '3D8A', source: 'Eden Prime', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'E1S Pure Beam 1',
      type: 'StartsUsing',
      netRegex: { id: '3D80', source: 'Eden Prime', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Outside Your Orb',
          de: 'Geh zu deinem Orb',
          fr: 'À l\'extérieur de votre orbe',
          ja: 'ピュアレイを外へ誘導',
          cn: '球外站位',
          ko: '본인 레이저 바깥으로 유도',
        },
      },
    },
    {
      id: 'E1S Pure Beam 2',
      type: 'StartsUsing',
      netRegex: { id: '3D82', source: 'Eden Prime', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Orb Lasers Outside',
          de: 'Laser nach drausen ködern',
          fr: 'Orientez les lasers vers l\'extérieur',
          ja: 'レーザーを外に誘導',
          cn: '外侧吃激光',
          ko: '원/힐 레이저 바깥으로 유도',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Eden Prime': 'Prim-Eden',
        'Guardian of Paradise': 'Hüter von Eden',
      },
      'replaceText': {
        'Delta Attack': 'Delta-Attacke',
        'Dimensional Shift': 'Dimensionsverschiebung',
        'Eden\'s Flare': 'Eden-Flare',
        'Eden\'s Gravity': 'Eden-Gravitas',
        'Eternal Breath': 'Ewiger Atem',
        'Fragor Maximus': 'Fragor Maximus',
        'Heavensunder': 'Himmelsdonner',
        'Mana Burst': 'Mana-Knall',
        'Mana Slice': 'Mana-Hieb',
        'Paradisal Dive': 'Paradiessturz',
        'Paradise Lost': 'Verlorenes Paradies',
        'Paradise Regained': 'Wiedergewonnenes Paradies',
        'Pure Beam': 'Läuternder Strahl',
        'Pure Light': 'Läuterndes Licht',
        'Spear Of Paradise': 'Paradiesspeer',
        'Vice And Virtue': 'Laster und Tugend',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Eden Prime': 'Primo-Éden',
        'Guardian of Paradise': 'Gardien du jardin',
      },
      'replaceText': {
        '\\!': ' !',
        'Delta Attack': 'Attaque Delta',
        'Dimensional Shift': 'Translation dimensionnelle',
        'Eden\'s Flare': 'Brasier édénique',
        'Eden\'s Gravity': 'Gravité édénique',
        'Eternal Breath': 'Souffle de l\'éternel',
        'Fragor Maximus': 'Fragor Maximus',
        'Heavensunder': 'Ravageur de paradis',
        'Mana Burst': 'Explosion de mana',
        'Mana Slice': 'Taillade de mana',
        'Paradisal Dive': 'Piqué du paradis',
        'Paradise Lost': 'Paradis perdu',
        'Paradise Regained': 'Paradis retrouvé',
        'Pure Beam': 'Rayon purificateur',
        'Pure Light': 'Lumière purificatrice',
        'Spear of Paradise': 'Lance du paradis',
        'Vice And Virtue': 'Vice et vertu',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Eden Prime': 'エデン・プライム',
        'Guardian of Paradise': 'エデン・ガーデナー',
      },
      'replaceText': {
        'Delta Attack': 'デルタアタック',
        'Dimensional Shift': 'ディメンションシフト',
        'Eden\'s Flare': 'エデン・フレア',
        'Eden\'s Gravity': 'エデン・グラビデ',
        'Eternal Breath': 'エターナル・ブレス',
        'Fragor Maximus': 'フラゴルマクシマス',
        'Heavensunder': 'ヘヴンサンダー',
        'Mana Burst': 'マナバースト',
        'Mana Slice': 'マナスラッシュ',
        'Paradisal Dive': 'パラダイスダイブ',
        'Paradise Lost': 'パラダイスロスト',
        'Paradise Regained': 'パラダイスリゲイン',
        'Pure Beam': 'ピュアレイ',
        'Pure Light': 'ピュアライト',
        'Spear of Paradise': 'スピア・オブ・パラダイス',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Eden Prime': '至尊伊甸',
        'Guardian of Paradise': '伊甸守护者',
      },
      'replaceText': {
        'Delta Attack': '三角攻击',
        'Dimensional Shift': '空间转换',
        'Eden\'s Flare': '伊甸核爆',
        'Eden\'s Gravity': '伊甸重力',
        'Eternal Breath': '永恒吐息',
        'Fragor Maximus': '极大爆炸',
        'Heavensunder': '天国分断',
        'Mana Burst': '魔力爆发',
        'Mana Slice': '魔力斩击',
        'Paradisal Dive': '乐园冲',
        'Paradise Lost': '失乐园',
        'Paradise Regained': '复乐园',
        'Pure Beam': '净土射线',
        'Pure Light': '净土之光',
        'Spear of Paradise': '乐园之枪',
        'Vice and Virtue': '恶习与美德',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Eden Prime': '에덴 프라임',
        'Guardian of Paradise': '에덴의 수호자',
      },
      'replaceText': {
        'Cross': '십자',
        'Delta Attack': '델타 공격',
        'Dimensional Shift': '차원 전환',
        'Donut': '중앙',
        'Eden\'s Flare': '에덴 플레어',
        'Eden\'s Gravity': '에덴 그라비데',
        'Eternal Breath': '영원의 숨결',
        'Fragor Maximus': '우주 탄생',
        'Heavensunder': '천국의 낙뢰',
        'Mana Burst': '마나 폭발',
        'Mana Slice': '마나 베기',
        'Paradisal Dive': '낙원 강하',
        'Paradise Lost': '실낙원',
        'Paradise Regained': '복낙원',
        'Pure Beam': '완전한 광선',
        'Pure Light': '완전한 빛',
        'Spear of Paradise': '낙원의 창',
        'Vice and Virtue': '선과 악',
      },
    },
  ],
});
