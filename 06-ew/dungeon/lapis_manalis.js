Options.Triggers.push({
  zoneId: ZoneId.LapisManalis,
  timelineFile: 'lapis_manalis.txt',
  timelineTriggers: [
    {
      id: 'Lapis Manalis Cagnazzo Tsunami',
      regex: /Tsunami/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'Lapis Manalis Albus Griffin Winds of Winter',
      type: 'StartsUsing',
      netRegex: { id: '8011', source: 'Albus Griffin', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- Albion ----------------
    {
      id: 'Lapis Manalis Albion Call of the Mountain',
      type: 'Ability',
      netRegex: { id: '7A7C', source: 'Albion', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid stampeding animals',
        },
      },
    },
    {
      id: 'Lapis Manalis Albion Albion\'s Embrace',
      type: 'StartsUsing',
      netRegex: { id: '7A85', source: 'Albion' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Lapis Manalis Albion Right Slam',
      type: 'StartsUsing',
      netRegex: { id: '802D', source: 'Albion', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Lapis Manalis Albion Left Slam',
      type: 'StartsUsing',
      netRegex: { id: '802E', source: 'Albion', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Lapis Manalis Albion Icy Throes',
      type: 'StartsUsing',
      netRegex: { id: '7A83', source: 'Albion' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Lapis Manalis Albion Roar of Albion',
      type: 'StartsUsing',
      netRegex: { id: '7A84', source: 'Albion', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Boulder',
          de: 'Hinter Felsen verstecken',
          fr: 'Cachez-vous derrière le rocher',
          ja: 'ボルダーの後ろに',
          cn: '躲在石头后',
          ko: '돌 뒤에 숨기',
        },
      },
    },
    // ---------------- Galatea Magna ----------------
    {
      id: 'Lapis Manalis Galatea Magna Waxing Cycle',
      type: 'StartsUsing',
      netRegex: { id: '7A91', source: 'Galatea Magna', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Waning Cycle',
      type: 'StartsUsing',
      netRegex: { id: '7F6E', source: 'Galatea Magna', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Soul Nebula',
      type: 'StartsUsing',
      netRegex: { id: '7A9E', source: 'Galatea Magna', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Doom',
      // D24 = Doom
      type: 'GainsEffect',
      netRegex: { effectId: 'D24', source: 'Galatea Magna' },
      condition: (data) => data.CanCleanse(),
      alertText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ja: '${player} にエスナ',
          cn: '驱散: ${player}',
          ko: '"${player}" 에스나',
        },
      },
    },
    {
      id: 'Lapis Manalis Galatea Magna Glassy-eyed',
      // DB7 = Glassy-eyed
      type: 'GainsEffect',
      netRegex: { effectId: 'DB7', source: 'Galatea Magna' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      response: Responses.lookAway(),
    },
    {
      id: 'Lapis Manalis Galatea Magna Tenebrism',
      type: 'Ability',
      netRegex: { id: '7A96', source: 'Galatea Magna', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔へ',
          cn: '踩塔',
          ko: '기둥 들어가기',
        },
      },
    },
    {
      id: 'Lapis Manalis Galatea Magna Dark Harvest',
      type: 'StartsUsing',
      netRegex: { id: '7A9F', source: 'Galatea Magna' },
      response: Responses.tankBuster(),
    },
    // ---------------- Cagnazzo ----------------
    {
      id: 'Lapis Manalis Cagnazzo Stygian Deluge',
      type: 'StartsUsing',
      netRegex: { id: '79A3', source: 'Cagnazzo', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Body Slam',
      // immune to knockback resist
      type: 'StartsUsing',
      netRegex: { id: '7992', source: 'Cagnazzo' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Hydrofall',
      type: 'StartsUsing',
      netRegex: { id: '7A90', source: 'Cagnazzo' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Neap Tide',
      // D01 = Neap Tide, source from environment
      type: 'GainsEffect',
      netRegex: { effectId: 'D01' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      response: Responses.spread(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Spring Tide',
      // D00 = Spring Tide, source from environment
      type: 'GainsEffect',
      netRegex: { effectId: 'D00' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Voidcleaver',
      type: 'StartsUsing',
      netRegex: { id: '7986', source: 'Cagnazzo', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lapis Manalis Cagnazzo Void Torrent',
      type: 'StartsUsing',
      netRegex: { id: '798E', source: 'Cagnazzo' },
      response: Responses.tankCleave(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Left Slam/Right Slam': 'Left/Right Slam',
        'Waxing Cycle/Waning Cycle': 'Waxing/Waning Cycle',
      },
    },
  ],
});
