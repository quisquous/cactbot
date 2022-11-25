Options.Triggers.push({
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
          cn: '击退到安全区',
          ko: '안전지대로 넉백되기',
        },
      },
    },
  ],
});
