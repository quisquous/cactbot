Options.Triggers.push({
  zoneId: ZoneId.ContainmentBayS1T7Extreme,
  timelineFile: 'sephirot-ex.txt',
  initData: () => {
    return {
      phase: 1,
      pillarActive: false,
    };
  },
  timelineTriggers: [
    {
      id: 'SephirotEx Tiferet',
      regex: /Tiferet/,
      beforeSeconds: 4,
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'SephirotEx Triple Trial',
      regex: /Triple Trial/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      id: 'SephirotEx Ein Sof Rage',
      regex: /Ein Sof \(4 puddles\)/,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to safe quadrant',
          de: 'Beweg dich in den sicheren Quadranten',
          cn: '移动到安全区域',
          ko: '안전한 지역으로 이동',
        },
      },
    },
    {
      id: 'SephirotEx Ein Sof Ratzon',
      regex: /Ein Sof \(1 puddle\)/,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait toward puddle',
          de: 'In Richtung Fläche ködern',
          cn: '靠近圈圈集合诱导AOE',
          ko: '장판 쪽으로 아인 유도',
        },
      },
    },
    {
      id: 'SephirotEx Yesod Bait',
      regex: /Yesod/,
      beforeSeconds: 6,
      alertText: (data, _matches, output) => {
        if (data.pillarActive)
          return output.withPillar();
        return output.noPillar();
      },
      outputStrings: {
        noPillar: {
          en: 'Bait Yesod',
          de: 'Yesod ködern',
          cn: '集合诱导基盘碎击',
          ko: '예소드 붕괴 유도',
        },
        withPillar: {
          en: 'Bait Yesod inside puddle',
          de: 'Yesod in die Fläche ködern',
          cn: '圈圈内集合诱导基盘碎击',
          ko: '장판 안에 예소드 유도하기',
        },
      },
    },
    {
      id: 'SephirotEx Pillar Activate',
      regex: /Pillar of Mercy 1/,
      beforeSeconds: 10,
      run: (data) => data.pillarActive = true,
    },
    {
      id: 'SephirotEx Pillar Deactivate',
      regex: /Pillar of Mercy 3/,
      run: (data) => data.pillarActive = false,
    },
  ],
  triggers: [
    {
      id: 'SephirotEx Main Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '368', source: 'Sephirot' }),
      // We make this conditional to avoid constant noise in the raid emulator.
      condition: (data, matches) => data.mainTank !== matches.target,
      run: (data, matches) => data.mainTank = matches.target,
    },
    {
      id: 'SephirotEx Chesed Buster',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1567', source: 'Sephirot' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'SephirotEx Ain',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1569', source: 'Sephirot', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'SephirotEx Ratzon Spread',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['0046', '0047'] }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'SephirotEx Fiendish Rage',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0048', capture: false }),
      condition: (data) => data.phase === 1,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.me === data.mainTank)
          return output.noStack();
        return output.stack();
      },
      outputStrings: {
        noStack: {
          en: 'Don\'t Stack!',
          de: 'Nicht sammeln!',
          cn: '不要重合！',
          ko: '겹치면 안됨!',
        },
        stack: {
          en: 'Group Stacks',
          de: 'In der Gruppe sammeln',
          cn: '分组集合',
          ko: '그룹 쉐어',
        },
      },
    },
    {
      id: 'SephirotEx Da\'at Spread',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1572', source: 'Sephirot', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'SephirotEx Malkuth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1582', source: 'Sephirot', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'SephirotEx Yesod Move',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '157E', source: 'Sephirot', capture: false }),
      response: Responses.moveAway('alarm'), // This *will* kill if a non-tank takes 2+.
    },
    {
      id: 'SephirotEx Force Against Might',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3ED' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => output.text({ force: matches.effect }),
      run: (data, matches) => data.force = matches.effectId,
      outputStrings: {
        text: {
          en: 'Orange (${force})',
          de: '${force} auf dir',
          fr: '${force} sur vous',
          ja: '自分に${force}',
          cn: '${force}点名',
          ko: '노랑 (${force})',
        },
      },
    },
    {
      id: 'SephirotEx Force Against Magic',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3EE' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => output.text({ force: matches.effect }),
      run: (data, matches) => data.force = matches.effectId,
      outputStrings: {
        text: {
          en: 'Green (${force})',
          de: '${force} auf dir',
          fr: '${force} sur vous',
          ja: '自分に${force}',
          cn: '${force}点名',
          ko: '초록 (${force})',
        },
      },
    },
    {
      // Orange left, Green right. Match color to Force debuff.
      id: 'SephirotEx Gevurah Chesed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1578', capture: false }),
      alertText: (data, _matches, output) => {
        // Here and for Chesed Gevurah, if the player doesn't have a color debuff,
        // they just take moderate AoE damage.
        // Unlike Flood of Naught (colors) in O4s,
        // standing center is safe if the user has no debuff.
        if (data.force)
          return data.force === '3ED' ? output.left() : output.right();
        return output.aoe();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        aoe: Outputs.aoe,
      },
    },
    {
      // Green left, Orange right. Match color to Force debuff.
      id: 'SephirotEx Chesed Gevurah',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1579', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.force)
          return data.force === '3EE' ? output.left() : output.right();
        return output.aoe();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        aoe: Outputs.aoe,
      },
    },
    {
      id: 'SephirotEx Fiendish Wail',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1575', source: 'Sephirot', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.force === '3ED' || (!data.force && data.role === 'tank'))
          return output.getTower();
        return output.avoidTower();
      },
      outputStrings: {
        getTower: {
          en: 'Get a tower',
          de: 'Nimm einen Turm',
          cn: '踩塔',
          ko: '기둥 밟기',
        },
        avoidTower: {
          en: 'Avoid towers',
          de: 'Turm meiden',
          cn: '躲塔',
          ko: '기둥 피하기',
        },
      },
    },
    {
      id: 'SephirotEx Da\'at Tethers',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0030', capture: false }),
      suppressSeconds: 30,
      alertText: (data, _matches, output) => {
        if (data.force === '3EE')
          return output.magic();
        return output.might();
      },
      outputStrings: {
        might: {
          en: 'Get Away, Avoid Puddles + Tethers',
          de: 'Geh weg, weiche Flächen und Verbindungen aus',
          cn: '远离, 躲避圈圈 + 连线',
          ko: '멀리 떨어지고, 장판 + 선 피하기',
        },
        magic: {
          en: 'Go Front; Get Tether',
          de: 'Geh nach Vorne; Nimm eine Verbindung',
          cn: '去前面; 接线',
          ko: '앞으로 가서 선 가로채기',
        },
      },
    },
    {
      id: 'SephirotEx Force Against Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: ['3ED', '3EE'], capture: false }),
      run: (data) => delete data.force,
    },
    {
      id: 'SephirotEx Earth Shaker Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      run: (data, matches) => {
        data.shakerTargets = data.shakerTargets ?? (data.shakerTargets = []);
        data.shakerTargets.push(matches.target);
      },
    },
    {
      id: 'SephirotEx Earth Shaker Call',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.shakerTargets?.includes(data.me))
          return output.shakerTarget();
        return output.shakerAvoid();
      },
      outputStrings: {
        shakerTarget: {
          en: 'Earth Shaker (Max Melee)',
          de: 'Erdstoß (Max Nahkampf)',
          cn: '大地摇动 (最远近战距离)',
          ko: '어스징 (칼끝딜 거리)',
        },
        shakerAvoid: {
          en: 'Avoid Earth Shakers',
          de: 'Weiche Erdstoß aus',
          cn: '躲避大地摇动',
          ko: '어스징 피하기',
        },
      },
    },
    {
      id: 'SephirotEx Earth Shaker Cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028', capture: false }),
      delaySeconds: 5,
      run: (data) => delete data.shakerTargets,
    },
    {
      id: 'SephirotEx Storm of Words Revelation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1583', source: 'Storm of Words', capture: false }),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Storm of Words',
          de: 'Wörtersturm besiegen',
          fr: 'Tuez Tempête de mots ou mourrez',
          cn: '击杀言语风暴!',
          ko: '신언의 폭풍 제거',
        },
      },
    },
    {
      id: 'SephirotEx Ascension',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stackMarker(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Coronal Wind': 'Koronalwind',
        'Sephirot': 'Sephirot',
        'Storm Of Words': 'Wörtersturm',
      },
      'replaceText': {
        'Tethers': 'Verbindungen',
        'spread': 'verteilen',
        'puddles': 'Flächen',
        'puddle(?!s)': 'Fläche',
        'Adds Spawn': 'Adds erscheinen',
        'Ascension': 'Himmelfahrt',
        'Chesed': 'Chesed',
        'Da\'at': 'Da\'at',
        'Earth Shaker': 'Erdstoß',
        'Ein Sof': 'En Sof',
        'Fiendish Rage': 'Dämonischer Zorn',
        'Fiendish Wail': 'Dämonische Klage',
        'Force Field': 'Kraftfeld',
        'Impact of Hod': 'Macht von Hod',
        'Life Force': 'Lebenskraft',
        'Malkuth': 'Malkuth',
        'Pillar of Mercy': 'Pfeiler der Gnade',
        'Pillar of Severity': 'Pfeiler der Strenge',
        'Ratzon': 'Ratzon',
        'Spirit': 'Geist',
        'Tiferet': 'Tiferet',
        'Triple Trial': 'Tripel-Triade',
        'Yesod': 'Yesod',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Coronal Wind': 'vent coronaire',
        'Sephirot': 'Sephirot',
        'Storm Of Words': 'tempête de mots',
      },
      'replaceText': {
        'Adds Spawn': 'Apparition d\'adds',
        'Ascension': 'Ascension',
        'Chesed': 'Chesed',
        'Chesed Gevurah': 'Chesed Gevurah',
        'Da\'at Tethers': 'Liens Da\'at',
        'Da\'at spread': 'Dispersion Da\'at',
        'Earth Shaker': 'Secousse',
        'Ein Sof': 'Ein Sof',
        'Fiendish Rage': 'Colère de Sephirot',
        'Fiendish Wail': 'Plainte de Sephirot',
        'Force Field': 'Champ de force',
        'Impact of Hod': 'Impact Hod',
        'Life Force': 'Force vitale',
        'Malkuth': 'Malkuth',
        'Pillar of Mercy': 'Pilier de la miséricorde',
        'Pillar of Severity': 'Pilier de la rigueur',
        'Ratzon': 'Ratzon',
        'Spirit': 'Esprit',
        'Tiferet': 'Tiferet',
        'Triple Trial': 'Triple coup',
        'Yesod': 'Yesod',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Coronal Wind': 'コロナルウィンド',
        'Sephirot': 'セフィロト',
        'Storm Of Words': 'ストーム・オブ・ワード',
      },
      'replaceText': {
        'Adds Spawn': '雑魚',
        'Ascension': 'アセンション',
        '(?! )Chesed(?! )': 'ケセド',
        'Chesed Gevurah': 'ケセド・ゲブラー',
        'Da\'at': 'ダアト',
        'Earth Shaker': 'アースシェイカー',
        'Ein Sof(?! )': 'アイン・ソフ',
        'Ein Sof Ohr': 'アイン・ソフ・オウル',
        'Fiendish Rage': '魔神の怒り',
        'Fiendish Wail': '魔神の嘆き',
        'Force Field': 'フォースフィールド',
        'Impact of Hod': 'ホドインパクト',
        'Life Force': 'ライフフォース',
        'Malkuth': 'マルクト',
        'Pillar of Mercy': 'ピラー・オブ・メルシー',
        'Pillar of Severity': 'ピラー・オブ・セベリティ',
        'Ratzon': 'ラツォン',
        '(?<= )spread': '散開',
        'Spirit': 'スピリット',
        '(?<= )Tethers': '線',
        'Tiferet': 'ティファレト',
        'Triple Trial': 'トリプルブロー',
        'Yesod': 'イェソドクラッシュ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Coronal Wind': '冠状气流',
        'Sephirot': '萨菲洛特',
        'Storm Of Words': '言语风暴',
      },
      'replaceText': {
        'puddle(?:s)?': '圈圈',
        'spread': '散开',
        'Tethers': '连线',
        'Adds Spawn': '小怪出现',
        'Ascension': '上升气流',
        'Chesed(?! Gevurah)': '仁慈',
        'Chesed Gevurah': '仁慈之严酷',
        'Da\'at': '知识',
        'Earth Shaker': '大地摇动',
        'Ein Sof': '无限',
        'Fiendish Rage': '魔神之怒',
        'Fiendish Wail': '魔神之叹',
        'Force Field': '力场',
        'Impact of Hod': '荣光撞击',
        'Life Force': '生命领域',
        'Malkuth': '王国',
        'Pillar of Mercy': '慈悲之柱',
        'Pillar of Severity': '严厉之柱',
        'Ratzon': '意志',
        'Spirit': '圣灵领域',
        'Tiferet': '美丽',
        'Triple Trial': '三重强击',
        'Yesod': '基盘碎击',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Coronal Wind': '관상기류',
        'Sephirot': '세피로트',
        'Storm Of Words': '신언의 폭풍',
      },
      'replaceText': {
        'puddle(?:s)?': '장판',
        'Adds Spawn': '쫄 등장',
        'Ascension': '승천',
        'Chesed(?! Gevurah)': '헤세드',
        'Chesed Gevurah': '헤세드 게부라',
        'Da\'at spread': '다아트 산개',
        'Da\'at Tethers': '다아트 선',
        'Earth Shaker': '요동치는 대지',
        'Ein Sof(?! Ohr)': '아인 소프',
        'Ein Sof Ohr': '아인 소프 오르',
        'Fiendish Rage': '마신의 분노',
        'Fiendish Wail': '마신의 탄식',
        'Force Field': '역장',
        'Impact of Hod': '호드 대충격',
        'Life Force': '생명의 권능',
        'Malkuth': '말쿠트',
        'Pillar of Mercy': '자비의 기둥',
        'Pillar of Severity': '준엄의 기둥',
        'Ratzon': '라촌',
        'Spirit': '성령의 은사',
        'Tiferet': '티페레트',
        'Triple Trial': '삼중 강타',
        'Yesod': '예소드 붕괴',
      },
    },
  ],
});
