Options.Triggers.push({
  zoneId: ZoneId.TheFellCourtOfTroia,
  timelineFile: 'the_fell_court_of_troia.txt',
  triggers: [
    {
      id: 'Troia Evil Dreamer Dark Vision',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Evil Dreamer', id: ['73BB', '73B8'], capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Eye Lasers',
        },
      },
    },
    {
      id: 'Troia Beatrice Void Gravity',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Evil Dreamer', id: '73BA' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Troia Evil Dreamer Unite Mare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Evil Dreamer', id: '73BC', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill One Eye',
        },
      },
    },
    {
      id: 'Troia Beatrice Death Forseen Self',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '747D' }),
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'Troia Beatrice Death Forseen Other',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '7484', capture: false }),
      // TODO: calling out twice seems noisy, but not sure what else to say
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look Away from Rings',
        },
      },
    },
    {
      id: 'Troia Beatrice Beatific Scorn',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '7475', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Exploding Lines',
        },
      },
    },
    {
      id: 'Troia Beatrice Hush',
      type: 'StartsUsing',
      // Does not cleave.
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '7480' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Troia Beatrice Void Nail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '747F' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Troia Beatrice Eye of Troia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '747A', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Troia Beatrice Antipressure',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '79E8' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Troia Scarmiglione Cursed Echo',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7631', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + saignement',
          ja: 'AoE + DoT',
          cn: 'AOE + 流血',
          ko: '전체 공격 + 출혈',
        },
      },
    },
    {
      id: 'Troia Scarmiglione Rotten Rampage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7619' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Troia Scarmiglione Vacuum Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '761C', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback Into Wall',
        },
      },
    },
    {
      id: 'Troia Scarmiglione Blighted Bladework',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7633', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind and Out',
        },
      },
    },
    {
      id: 'Troia Scarmiglione Blighted Sweep',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7635', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Troia Scarmiglione Void Vortex',
      type: 'StartsUsing',
      // 7623 during add phase, 762E after
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: ['7623', '762E'] }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Troia Scarmiglione Void Gravity',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7622' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
});
