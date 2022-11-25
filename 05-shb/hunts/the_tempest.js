Options.Triggers.push({
  zoneId: ZoneId.TheTempest,
  triggers: [
    {
      id: 'Hunt Baal Sewer Water Front',
      type: 'StartsUsing',
      netRegex: { id: '4624', source: 'Baal', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Baal Sewer Water Back',
      type: 'StartsUsing',
      netRegex: { id: '4625', source: 'Baal', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Baal Sewage Wave Front',
      type: 'StartsUsing',
      netRegex: { id: '440F', source: 'Baal', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBackThenFront(),
    },
    {
      id: 'Hunt Baal Sewage Wave Back',
      type: 'StartsUsing',
      netRegex: { id: '4410', source: 'Baal', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'Hunt Rusalka Aetherial Pull',
      type: 'StartsUsing',
      netRegex: { id: '43D6', source: 'Rusalka', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.drawIn(),
    },
    {
      id: 'Hunt Rusalka Flood',
      type: 'Ability',
      // Happens immediately after Aetherial Pull
      netRegex: { id: '43D6', source: 'Rusalka', capture: false },
      condition: (data) => data.inCombat,
      suppressSeconds: 1,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Gunitt The Deep Seeks',
      type: 'StartsUsing',
      netRegex: { id: '43CC', source: 'Gunitt' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster(),
    },
    {
      id: 'Hunt Gunitt The Deep Reaches',
      type: 'StartsUsing',
      // Untelegraphed line aoe x3
      netRegex: { id: '43CD', source: 'Gunitt', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Gunitt The Deep Beckons',
      type: 'StartsUsing',
      netRegex: { id: '43CE', source: 'Gunitt', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Gunitt Swivel Gun',
      type: 'StartsUsing',
      netRegex: { id: '43D1', source: 'Gunitt' },
      condition: (data) => data.inCombat,
      alertText: (data, matches, output) => {
        if (data.swivelGunVuln)
          return output.avoidStack();
        if (data.me === matches.target)
          return output.stackOnYou();
        return output.stackMarker();
      },
      outputStrings: {
        stackMarker: Outputs.stackMarker,
        stackOnYou: Outputs.stackOnYou,
        avoidStack: {
          en: 'Avoid Stack',
        },
      },
    },
    {
      id: 'Hunt Gunitt Swivel Gun Vuln Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '472' },
      condition: (data, matches) => data.me === matches.target,
      run: (data) => data.swivelGunVuln = true,
    },
    {
      id: 'Hunt Gunitt Swivel Gun Vuln Lose',
      type: 'LosesEffect',
      netRegex: { effectId: '472' },
      condition: (data, matches) => data.me === matches.target,
      run: (data) => data.swivelGunVuln = false,
    },
    {
      id: 'Hunt Gunitt Coin Toss',
      type: 'StartsUsing',
      netRegex: { id: '43D0', source: 'Gunitt', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.lookAway(),
    },
  ],
});
