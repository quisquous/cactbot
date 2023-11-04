// ALEXANDER - THE ARM OF THE FATHER NORMAL
// A3N
Options.Triggers.push({
  id: 'AlexanderTheArmOfTheFather',
  zoneId: ZoneId.AlexanderTheArmOfTheFather,
  timelineFile: 'a3n.txt',
  timelineTriggers: [
    {
      id: 'A3N Splash',
      regex: /Splash/,
      beforeSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'A3N Fluid Swing',
      regex: /Fluid Swing/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    // The Liquid Limb section includes rapid repeated Fluid Strike cleaves during the second half.
    // It's very complex to handle this without being spammy,
    // so we cue some of the callouts off of Wash Away instead.
    {
      id: 'A3N Fluid Strike 1',
      regex: /Wash Away/,
      beforeSeconds: 12,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'A3N Wash Away',
      type: 'StartsUsing',
      netRegex: { id: '12FF', source: 'Living Liquid', capture: false },
      response: Responses.goMiddle(),
    },
    {
      id: 'A3N Cascade',
      type: 'StartsUsing',
      netRegex: { id: '12F7', source: 'Living Liquid', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'A3N Sluice',
      type: 'HeadMarker',
      netRegex: { id: '001A' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sluice on YOU',
          de: 'Schleusenöffnung auf DIR',
          fr: 'Éclusage sur Vous',
          ja: '自分にスルース',
          cn: '蓝点名',
          ko: '봇물 대상자',
        },
      },
    },
    {
      // To avoid spam, we cue this off Wash Away instead.
      id: 'A3N Fluid Strike 2',
      type: 'Ability',
      netRegex: { id: '12FF', source: 'Living Liquid', capture: false },
      delaySeconds: 5,
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '3x Tank Cleave',
          de: '3x Tank Cleave',
          fr: 'Tank Cleave x3',
          cn: '3x 顺劈',
          ko: '광역 탱버 3번',
        },
      },
    },
    {
      id: 'A3N Fluid Strike 3',
      type: 'AddedCombatant',
      netRegex: { name: 'Liquid Limb', capture: false },
      suppressSeconds: 60,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Repeated tank cleaves',
          de: 'Wiederholte Tank Cleaves',
          fr: 'Répétition de Tank cleaves',
          cn: '多重顺劈',
          ko: '광역 탱버 반복',
        },
      },
    },
    {
      id: 'A3N Drainage You',
      type: 'Tether',
      netRegex: { id: '0005', target: 'Living Liquid' },
      condition: (data, matches) => matches.source === data.me,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drainage on YOU',
          de: 'Entwässerung auf DIR',
          fr: 'Drainage sur VOUS',
          ja: '自分にドレナージ',
          cn: '连线点名',
          ko: '하수로 대상자',
        },
      },
    },
    {
      id: 'A3N Drainage Tank',
      type: 'Tether',
      netRegex: { id: '0005', target: 'Living Liquid', capture: false },
      condition: (data) => data.role === 'tank',
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get drainage tether',
          de: 'Hole die Entwässerungs-Verbindung',
          fr: 'Prenez un lien de drainage',
          ja: '線を取る',
          cn: '接线',
          ko: '하수로 선 가져오기',
        },
      },
    },
    {
      id: 'A3N Ferrofluid Tether',
      type: 'Tether',
      netRegex: { id: '0026' },
      run: (data, matches) => {
        data.ferroTether ??= {};
        data.ferroTether[matches.source] = matches.target;
        data.ferroTether[matches.target] = matches.source;
      },
    },
    {
      id: 'A3N Ferrofluid Signs',
      type: 'HeadMarker',
      netRegex: { id: ['0030', '0031'] },
      run: (data, matches) => {
        data.ferroMarker ??= {};
        data.ferroMarker[matches.target] = matches.id;
      },
    },
    {
      id: 'A3N Ferrofluid Call',
      type: 'StartsUsing',
      netRegex: { id: '1306', source: 'Living Liquid' },
      alertText: (data, matches, output) => {
        data.ferroTether ??= {};
        data.ferroMarker ??= {};
        const partner = data.ferroTether[data.me];
        const marker1 = data.ferroMarker[data.me];
        const marker2 = data.ferroMarker[partner ?? ''];
        if (partner === undefined || marker1 === undefined || marker2 === undefined)
          return `${matches.ability} (???)`;
        if (marker1 === marker2)
          return output.repel({ player: data.party.member(partner) });
        return output.attract({ player: data.party.member(partner) });
      },
      outputStrings: {
        repel: {
          en: 'Repel: close to ${player}',
          de: 'Abstoß: nahe bei ${player}',
          fr: 'Répulsion : Rapprochez-vous de ${player}',
          ja: '同じ極: ${player}に近づく',
          cn: '同极：靠近${player}',
          ko: '반발: ${player}와 가까이 붙기',
        },
        attract: {
          en: 'Attract: away from ${player}',
          de: 'Anziehung: weg von ${player}',
          fr: 'Attraction : Éloignez-vous de ${player}',
          ja: '異なる極: ${player}から離れる',
          cn: '异极：远离${player}',
          ko: '자력: ${player}와 떨어지기',
        },
      },
    },
    {
      id: 'A3N FerrofluidCleanup',
      type: 'Ability',
      netRegex: { id: '1306', source: 'Living Liquid', capture: false },
      delaySeconds: 5,
      run: (data) => {
        delete data.ferroMarker;
        delete data.ferroTether;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Condensate Demineralizer .9': 'Kondensatoranlage 9',
        'Hydrate Core': 'Hydratkern',
        'Liquid Limb': 'belebt(?:e|er|es|en) Hand',
        'Living Liquid': 'belebt(?:e|er|es|en) Wasser',
      },
      'replaceText': {
        '--Liquid Limb spawns--': '--Belebte Hand erscheint--',
        'Cascade': 'Cascade',
        'Drainage': 'Entwässerung',
        'Fluid Strike': 'Flüssiger Schlag',
        'Fluid Swing': 'Flüssiger Schwung',
        'Hydromorph': 'Hydromorphose',
        'Magnetism': 'Magnetismus',
        'Protean Wave': 'Proteische Welle',
        'Repel': 'Abstoßung',
        'Sluice': 'Schleusenöffnung',
        'Splash': 'Schwall',
        'Valve': 'Ventil',
        'Wash Away': 'Wegspülen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Condensate Demineralizer .9': 'Grand condensateur GC-9',
        'Hydrate Core': 'noyau d\'hydrate',
        'Liquid Limb': 'membre liquide',
        'Living Liquid': 'liquide vivant',
      },
      'replaceText': {
        '--Liquid Limb spawns--': '--Apparition du membre liquide--',
        'Cascade': 'Cascade',
        'Drainage': 'Drainage',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Hydromorph': 'Hydromorphe',
        'Magnetism': 'Magnétisme',
        'Protean Wave': 'Vague inconstante',
        'Repel': 'Répulsion',
        'Sluice': 'Éclusage',
        'Splash': 'Éclaboussement',
        'Valve': 'Ouverture de valve',
        'Wash Away': 'Lessivage',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Condensate Demineralizer .9': '第9大型復水器',
        'Hydrate Core': 'ハイドレードコア',
        'Liquid Limb': 'リキッドハンド',
        'Living Liquid': 'リビングリキッド',
      },
      'replaceText': {
        'Cascade': 'カスケード',
        'Drainage': 'ドレナージ',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Hydromorph': 'ハイドロモーフ',
        'Magnetism': '磁力',
        'Protean Wave': 'プロティアンウェイブ',
        'Repel': '反発',
        'Sluice': 'スルース',
        'Splash': 'スプラッシュ',
        'Valve': 'バルブオープン',
        'Wash Away': 'ウォッシュアウェイ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Condensate Demineralizer .9': '第9大型冷凝器',
        'Hydrate Core': '水合核心',
        'Liquid Limb': '活水之手',
        'Living Liquid': '有生命活水',
      },
      'replaceText': {
        '--Liquid Limb spawns--': '--活水之手出现--',
        'Cascade': '瀑泻',
        'Drainage': '排水',
        'Fluid Strike': '流体强袭',
        'Fluid Swing': '流体摆动',
        'Hydromorph': '水态转换',
        'Magnetism': '磁力',
        'Protean Wave': '万变水波',
        'Repel': '相斥',
        'Sluice': '冲洗',
        'Splash': '溅开',
        'Valve': '水阀',
        'Wash Away': '冲净',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Condensate Demineralizer .9': '제9대형복수기',
        'Hydrate Core': '액화 핵',
        'Liquid Limb': '액체 손',
        'Living Liquid': '살아있는 액체',
      },
      'replaceText': {
        '--Liquid Limb spawns--': '--액체 손 등장--',
        'Cascade': '캐스케이드',
        'Drainage': '하수로',
        'Fluid Strike': '유체 강타',
        'Fluid Swing': '유체 타격',
        'Hydromorph': '액상 변이',
        'Magnetism': '자력',
        'Protean Wave': '변화의 물결',
        'Repel': '반발',
        'Sluice': '봇물',
        'Splash': '물장구',
        'Valve': '밸브 개방',
        'Wash Away': '싹쓸이',
      },
    },
  ],
});
