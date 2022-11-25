Options.Triggers.push({
  zoneId: ZoneId.Lakeland,
  triggers: [
    {
      id: 'Hunt Nariphon Piercing Resistance Down II Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '59B' },
      condition: (data, matches) => matches.target === data.me,
      run: (data) => data.allergen = true,
    },
    {
      id: 'Hunt Nariphon Piercing Resistance Down II Lose',
      type: 'LosesEffect',
      netRegex: { effectId: '59B' },
      condition: (data, matches) => matches.target === data.me,
      run: (data) => data.allergen = false,
    },
    {
      id: 'Hunt Nariphon Roots of Atopy',
      type: 'StartsUsing',
      netRegex: { id: '424B', source: 'Nariphon' },
      condition: (data) => data.inCombat,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          stackOnPlayer: Outputs.stackOnPlayer,
          stackOnYou: Outputs.stackOnYou,
          avoidStack: {
            en: 'Avoid Stack',
          },
        };
        if (matches.target === data.me)
          return { alertText: output.stackOnYou() };
        if (data.allergen)
          return { alarmText: output.avoidStack() };
        return { infoText: output.stackOnPlayer({ player: data.ShortName(matches.target) }) };
      },
    },
    {
      id: 'Hunt Nariphon Odious Miasma',
      type: 'StartsUsing',
      netRegex: { id: '424A', source: 'Nariphon', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Nuckelavee Torpedo',
      type: 'StartsUsing',
      netRegex: { id: '4244', source: 'Nuckelavee' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster(),
    },
    {
      id: 'Hunt Nuckelavee Bog Body',
      type: 'StartsUsing',
      netRegex: { id: '4245', source: 'Nuckelavee' },
      condition: (data, matches) => matches.target === data.me,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'GTFO with marker',
          de: 'Geh raus mit dem Marker',
          fr: 'Partez avec le marquage',
          ja: 'ボスから離れる',
          cn: '快躲开标记',
          ko: '나에게 징 멀리 빠지기',
        },
      },
    },
    {
      id: 'Hunt Nuckelavee Gallop',
      type: 'StartsUsing',
      netRegex: { id: '4247', source: 'Nuckelavee', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Dash',
        },
      },
    },
    {
      id: 'Hunt Tyger Dragon\'s Breath',
      type: 'StartsUsing',
      netRegex: { id: '423F', source: 'Tyger', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Back/Right',
        },
      },
    },
    {
      id: 'Hunt Tyger Lion\'s Breath',
      type: 'StartsUsing',
      netRegex: { id: '423D', source: 'Tyger', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind('info'),
    },
    {
      id: 'Hunt Tyger Ram\'s Breath',
      type: 'StartsUsing',
      netRegex: { id: '423E', source: 'Tyger', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Back/Left',
        },
      },
    },
    {
      id: 'Hunt Tyger Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '4243', source: 'Tyger' },
      condition: (data) => data.inCombat,
      response: Responses.interruptIfPossible('info'),
    },
    {
      id: 'Hunt Tyger Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '4242', source: 'Tyger' },
      condition: (data) => data.inCombat,
      response: Responses.interruptIfPossible('info'),
    },
    {
      id: 'Hunt Tyger Scorpion\'s Sting',
      type: 'StartsUsing',
      netRegex: { id: ['4242', '4243'], source: 'Tyger', capture: false },
      condition: (data) => data.inCombat,
      // Roughly 6.3s after Dragon's Voice or Ram's Voice is uncasted Scorpion's Sting.
      // Mention this slightly after.
      delaySeconds: 1.5,
      response: Responses.goFront(),
    },
  ],
});
