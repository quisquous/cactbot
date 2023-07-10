Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors151_160',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors151_160,
  triggers: [
    // ---------------- Floor 151-159 Mobs ----------------
    {
      id: 'PotD 151-160 Deep Palace Deepeye Hypnotize',
      // gaze, inflicts Sleep
      type: 'StartsUsing',
      netRegex: { id: '1B1B', source: 'Deep Palace Deepeye', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'PotD 151-160 Deep Palace Pot Mysterious Light',
      // gaze, inflicts Blind
      type: 'StartsUsing',
      netRegex: { id: '1B29', source: 'Deep Palace Pot', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'PotD 151-160 Deep Palace Devilet Ice Spikes Cast',
      // gains Ice Spikes (C6), high counterattack damage when hit
      type: 'StartsUsing',
      netRegex: { id: '1B1F', source: 'Deep Palace Devilet' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 151-160 Deep Palace Devilet Ice Spikes Gain',
      // C6 = Ice Spikes, high counterattack damage when hit
      type: 'GainsEffect',
      netRegex: { effectId: 'C6', target: 'Deep Palace Devilet' },
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
    // ---------------- Floor 160 Boss: Todesritter ----------------
    {
      id: 'PotD 151-160 Todesritter Valfodr',
      // charge with knockback
      type: 'StartsUsing',
      netRegex: { id: '1BF4', source: 'Todesritter' },
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
        'Deep Palace Deepeye': 'Katakomben-Glotzauge',
        'Deep Palace Devilet': 'Katakomben-Eufel',
        'Deep Palace Pot': 'Katakomben-Manatopf',
        'Todesritter': 'Todesritter',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Deepeye': 'oculus des profondeurs',
        'Deep Palace Devilet': 'diablotin des profondeurs',
        'Deep Palace Pot': 'pot de mana des profondeurs',
        'Todesritter': 'Todesritter',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Deepeye': 'ディープパレス・ディープアイ',
        'Deep Palace Devilet': 'ディープパレス・デビレット',
        'Deep Palace Pot': 'ディープパレス・マナポット',
        'Todesritter': 'トーリスリッター',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Deepeye': '深宫深瞳',
        'Deep Palace Devilet': '深宫小恶魔',
        'Deep Palace Pot': '深宫魔力罐',
        'Todesritter': '非生骑士',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Deepeye': '깊은 궁전 볼록눈',
        'Deep Palace Devilet': '깊은 궁전 꼬마악마',
        'Deep Palace Pot': '깊은 궁전 마나 항아리',
        'Todesritter': '죽음의 기사',
      },
    },
  ],
});
