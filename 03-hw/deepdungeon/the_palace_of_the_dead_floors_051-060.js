Options.Triggers.push({
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
          cn: '击退到安全区',
          ko: '안전지대로 넉백되기',
        },
      },
    },
  ],
});
