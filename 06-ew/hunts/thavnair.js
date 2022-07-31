Options.Triggers.push({
  zoneId: ZoneId.Thavnair,
  triggers: [
    {
      id: 'Hunt Sugriva Spark',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Sugriva Scythe Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Sugriva Twister',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.knockbackStack(),
      outputStrings: {
        knockbackStack: {
          en: 'Knockback Stack',
          de: 'Rückstoß sammeln',
          fr: 'Package + Poussée',
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
      netRegex: NetRegexes.startsUsing({ id: '6A57', source: 'Sugriva' }),
      condition: (data) => data.inCombat,
      response: Responses.tankCleave(),
    },
    {
      id: 'Hunt Sugriva Rock Throw',
      type: 'StartsUsing',
      // One telegraphed circle in front, then some untelegraphed ones.
      netRegex: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugriva Crosswind',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Yilan Forward March',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Yilan' }),
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
          cn: '强制移动: 前',
          ko: '강제이동: 앞',
        },
      },
    },
    {
      id: 'Hunt Yilan About Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Yilan' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Backwards March Away',
          de: 'Geistlenkung rückwärts',
          fr: 'Marche forcée en arrière',
          cn: '强制移动: 后',
          ko: '강제이동: 뒤',
        },
      },
    },
    {
      id: 'Hunt Yilan Left Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Yilan' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Left March Away',
          de: 'Geistlenkung links',
          fr: 'Marche forcée à gauche',
          cn: '强制移动: 左',
          ko: '강제이동: 왼쪽',
        },
      },
    },
    {
      id: 'Hunt Yilan Right Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Yilan' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Right March Away',
          de: 'Geistlenkung rechts',
          fr: 'Marche forcée à droite',
          cn: '强制移动: 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
    {
      id: 'Hunt Yilan Brackish Rain',
      type: 'StartsUsing',
      // Untelegraphed conal attack.
      netRegex: NetRegexes.startsUsing({ id: '6A62', source: 'Yilan', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Yilan Mini Light',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A5F', source: 'Yilan', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Sugriva': 'Sugriva',
        'Yilan': 'Yilan',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Sugriva': 'Sugriva',
        'Yilan': 'yilan',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Sugriva': 'スグリーヴァ',
        'Yilan': 'ユラン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Sugriva': '须羯里婆',
        'Yilan': '尤兰',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Sugriva': '수그리바',
        'Yilan': '윌란',
      },
    },
  ],
});
