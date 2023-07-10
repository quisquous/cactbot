Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors51_60',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors51_60,
  triggers: [
    // ---------------- Floor 051-059 Mobs ----------------
    {
      id: 'PotD 051-060 Palace Deepeye Hypnotize',
      // gaze, inflicts Sleep
      type: 'StartsUsing',
      netRegex: { id: '1B1B', source: 'Palace Deepeye', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'PotD 051-060 Palace Pot Mysterious Light',
      // gaze, inflicts Blind
      type: 'StartsUsing',
      netRegex: { id: '1B29', source: 'Palace Pot', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'PotD 051-060 Palace Imp Ice Spikes Cast',
      // gains Ice Spikes (C6), high counterattack damage when hit
      type: 'StartsUsing',
      netRegex: { id: '1B1F', source: 'Palace Imp' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 051-060 Palace Imp Ice Spikes Gain',
      // C6 = Ice Spikes, high counterattack damage when hit
      type: 'GainsEffect',
      netRegex: { effectId: 'C6', target: 'Palace Imp' },
      alertText: (_data, matches, output) => output.text({ target: matches.target }),
      outputStrings: {
        text: {
          en: 'Stop attacking ${target}',
          de: 'Stoppe Angriffe auf ${target}',
          fr: 'N\'attaquez plus ${target}',
          cn: '停止攻击 ${target}',
          ko: '${target} 공격 중지',
        },
      },
    },
    // ---------------- Floor 060 Boss: The Black Rider ----------------
    {
      id: 'PotD 051-060 The Black Rider Valfodr',
      // charge with knockback
      type: 'StartsUsing',
      netRegex: { id: '1BB1', source: 'The Black Rider' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback into Safe Spot',
          de: 'Rückstoß zur sicheren Stelle',
          fr: 'Faites-vous pousser dans une zone sûre',
          cn: '击退到安全区',
          ko: '안전지대로 넉백되기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Palace Deepeye': 'Palast-Glotzauge',
        'Palace Imp': 'Palast-Imp',
        'Palace Pot': 'Palast-Manatopf',
        'The Black Rider': '(?:der|die|das) Schwarz(?:e|er|es|en) Reiter',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Palace Deepeye': 'oculus du palais',
        'Palace Imp': 'imp du palais',
        'Palace Pot': 'pot de mana du palais',
        'The Black Rider': 'cavalier noir',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Palace Deepeye': 'パレス・ディープアイ',
        'Palace Imp': 'パレス・インプ',
        'Palace Pot': 'パレス・マナポット',
        'The Black Rider': 'ブラックライダー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Palace Deepeye': '地宫深瞳',
        'Palace Imp': '地宫小魔精',
        'Palace Pot': '地宫魔力罐',
        'The Black Rider': '深黑骑士',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Palace Deepeye': '궁전 볼록눈',
        'Palace Imp': '궁전 임프',
        'Palace Pot': '궁전 마나 항아리',
        'The Black Rider': '검은 기수',
      },
    },
  ],
});
