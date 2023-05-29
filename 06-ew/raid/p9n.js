Options.Triggers.push({
  id: 'AnabaseiosTheNinthCircle',
  zoneId: ZoneId.AnabaseiosTheNinthCircle,
  timelineFile: 'p9n.txt',
  triggers: [
    {
      id: 'P9N Gluttony\'s Augur',
      type: 'StartsUsing',
      netRegex: { id: '8116', source: 'Kokytos', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P9N Global Spell',
      type: 'StartsUsing',
      netRegex: { id: '8141', source: 'Kokytos', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + saignement',
          ja: 'AoE + DoT',
          cn: 'AOE + 流血',
          ko: '전체 공격 + 도트',
        },
      },
    },
    {
      id: 'P9N Ascendant Fist',
      type: 'StartsUsing',
      netRegex: { id: '8131', source: 'Kokytos', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'P9N Pulverizing Pounce',
      type: 'HeadMarker',
      netRegex: { id: '00A1' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P9N Fire III',
      type: 'HeadMarker',
      netRegex: { id: '01C5' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P9N Charybdis',
      type: 'StartsUsing',
      netRegex: { id: '8133', source: 'Kokytos', capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop Puddles Outside',
          de: 'Flächen drausen ablegen',
          fr: 'Déposez les zones au sol à l\'extérieur',
          ja: '散開',
          cn: '散开',
          ko: '산개',
        },
      },
    },
    {
      id: 'P9N Archaic Rockbreaker',
      type: 'StartsUsing',
      netRegex: { id: '8128', source: 'Kokytos', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'P9N Beastly Roar',
      type: 'StartsUsing',
      netRegex: { id: '8138', source: 'Kokytos', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'P9N Archaic Demolish',
      type: 'StartsUsing',
      netRegex: { id: '812F', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P9N Front Combination + Inside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8148', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind and Under',
        },
      },
    },
    {
      id: 'P9N Rear Combination + Inside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '814A', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Front and Under',
        },
      },
    },
    {
      id: 'P9N Front Combination + Outside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8147', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind and Out',
          de: 'Geh nach Hinten und Raus',
          fr: 'Passez derrière et extérieur',
          ja: '後ろの外側へ',
          cn: '去背后远离',
          ko: '보스 뒤 바깥쪽으로',
        },
      },
    },
    {
      id: 'P9N Rear Combination + Outside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8149', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Front and Out',
        },
      },
    },
    {
      id: 'P9N Ecliptic Meteor',
      type: 'StartsUsing',
      netRegex: { id: '813B', source: 'Kokytos', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide behind unbroken meteor',
          de: 'Hinter einem nicht zerbrochenen Meteor verstecken',
          fr: 'Cachez-vous derrière le météore intact',
          ja: '壊れていないメテオの後ろへ',
          cn: '躲在未破碎的陨石后',
          ko: '금이 안 간 돌 뒤에 숨기',
        },
      },
    },
    {
      id: 'P9N Burst',
      type: 'StartsUsing',
      netRegex: { id: '8136', source: 'Comet', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'P9N Gluttonous Rampage',
      type: 'HeadMarker',
      netRegex: { id: '013A', capture: true },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.tankbusterOnYouStretchTethers();
        if (data.role === 'healer' || data.job === 'BLU')
          return output.tankbusterOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        tankbusterOnYouStretchTethers: {
          en: 'Tankbuster on YOU -- stretch tether',
        },
        tankbusterOn: {
          en: 'Tankbuster on ${player}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'en',
      replaceText: {
        'Front Combination/Rear Combination': 'Front/Rear Combination',
        'Inside Roundhouse/Outside Roundhouse': 'Inside/Outside Roundhouse',
      },
    },
  ],
});
