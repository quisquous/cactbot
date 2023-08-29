Options.Triggers.push({
  id: 'EurekaOrthosFloors61_70',
  zoneId: ZoneId.EurekaOrthosFloors61_70,
  triggers: [
    // ---------------- Floor 61-69 Mobs ----------------
    {
      id: 'EO 61-70 Orthos Cobra Whip Back',
      type: 'StartsUsing',
      netRegex: { id: '80BA', source: 'Orthos Cobra', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'EO 61-70 Orthos Palleon Body Press',
      type: 'StartsUsing',
      netRegex: { id: '80CF', source: 'Orthos Palleon', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 61-70 Orthos Gowrow Ripper Claw',
      type: 'StartsUsing',
      netRegex: { id: '80D7', source: 'Orthos Gowrow', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 61-70 Orthos Gowrow Tail Smash',
      type: 'StartsUsing',
      netRegex: { id: '80DA', source: 'Orthos Gowrow', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'EO 61-70 Orthos Drake Smoldering Scales',
      // gains Blaze Spikes (C5), lethal counterattack when hit with physical damage
      type: 'StartsUsing',
      netRegex: { id: '80B8', source: 'Orthos Drake' },
      response: Responses.stunIfPossible(),
    },
    {
      id: 'EO 61-70 Orthos Drake Blaze Spikes Gain',
      // C5 = Blaze Spikes, lethal counterattack damage when hit with physical damage
      type: 'GainsEffect',
      netRegex: { effectId: 'C5', target: 'Orthos Drake' },
      alertText: (_data, matches, output) => output.text({ target: matches.target }),
      outputStrings: {
        text: {
          en: 'Stop attacking ${target}',
          de: 'Stoppe Angriffe auf ${target}',
          ja: '攻撃禁止: ${target}',
          cn: '停止攻击 ${target}',
          ko: '${target} 공격 중지',
        },
      },
    },
    {
      id: 'EO 61-70 Orthos Falak Electric Cachexia',
      type: 'StartsUsing',
      netRegex: { id: '80D3', source: 'Orthos Falak', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'EO 61-70 Orthos Basilisk Stone Gaze',
      type: 'StartsUsing',
      netRegex: { id: '80C7', source: 'Orthos Basilisk', capture: false },
      response: Responses.awayFromFront(),
    },
    // ---------------- Floor 70 Boss: Aeturna ----------------
    {
      id: 'EO 61-70 Aeturna Steel Claw',
      type: 'StartsUsing',
      netRegex: { id: '7AD5', source: 'Aeturna' },
      response: Responses.tankBuster(),
    },
    {
      id: 'EO 61-70 Aeturna Ferocity',
      type: 'Tether',
      netRegex: { id: '0039', source: 'Aeturna' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Run Away From Boss',
          de: 'Renn weg vom Boss',
          fr: 'Courez loin du boss',
          ja: 'ボスから離れる',
          cn: '远离Boss',
          ko: '보스와 거리 벌리기',
        },
      },
    },
    {
      id: 'EO 61-70 Aeturna Preternatural Turn In',
      type: 'StartsUsing',
      netRegex: { id: '7ACD', source: 'Aeturna', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'EO 61-70 Aeturna Preternatural Turn Out',
      type: 'StartsUsing',
      netRegex: { id: '7ACC', source: 'Aeturna', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 61-70 Aeturna Roar',
      type: 'StartsUsing',
      netRegex: { id: '7ACB', source: 'Aeturna', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aeturna': 'Aeturna',
        'Orthos Basilisk': 'Orthos-Basilisk',
        'Orthos Cobra': 'Orthos-Kobra',
        'Orthos Drake': 'Orthos-Drakon',
        'Orthos Falak': 'Orthos-Falak',
        'Orthos Gowrow': 'Orthos-Gowrow',
        'Orthos Palleon': 'Orthos-Palleon',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aeturna': 'Aeturna',
        'Orthos Basilisk': 'basilic Orthos',
        'Orthos Cobra': 'cobra Orthos',
        'Orthos Drake': 'draconide Orthos',
        'Orthos Falak': 'falak Orthos',
        'Orthos Gowrow': 'gowrow Orthos',
        'Orthos Palleon': 'palléon Orthos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aeturna': 'アエテルナエ',
        'Orthos Basilisk': 'オルト・バジリスク',
        'Orthos Cobra': 'オルト・コブラ',
        'Orthos Drake': 'オルト・ドレイク',
        'Orthos Falak': 'オルト・ファラク',
        'Orthos Gowrow': 'オルト・ガウロウ',
        'Orthos Palleon': 'オルト・パレオン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aeturna': '永恒',
        'Orthos Basilisk': '正统石蜥蜴',
        'Orthos Cobra': '正统眼镜蛇',
        'Orthos Drake': '正统烈阳火蛟',
        'Orthos Falak': '正统法拉克',
        'Orthos Gowrow': '正统高牢怪龙',
        'Orthos Palleon': '正统侏儒避役',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aeturna': '아이테르나',
        'Orthos Basilisk': '오르토스 바실리스크',
        'Orthos Cobra': '오르토스 코브라',
        'Orthos Drake': '오르토스 도마뱀',
        'Orthos Falak': '오르토스 팔라크',
        'Orthos Gowrow': '오르토스 가우로우',
        'Orthos Palleon': '오르토스 팔레온',
      },
    },
  ],
});
