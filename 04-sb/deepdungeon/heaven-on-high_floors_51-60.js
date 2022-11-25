Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors51_60,
  triggers: [
    // ---------------- Floor 51-59 Mobs ----------------
    {
      id: 'HoH 51-60 Heavenly Naga Calcifying Mist',
      // front cone gaze AoE
      type: 'StartsUsing',
      netRegex: { id: '306D', source: 'Heavenly Naga', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind or Look Away',
        },
      },
    },
    {
      id: 'HoH 51-60 Heavenly Gowan Electromagnetism',
      type: 'StartsUsing',
      netRegex: { id: '3068', source: 'Heavenly Gowan' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 60 Boss: Suikazura ----------------
    {
      id: 'HoH 51-60 Suikazura Ancient Flare',
      type: 'StartsUsing',
      netRegex: { id: '2E98', source: 'Suikazura', capture: false },
      response: Responses.aoe(),
    },
  ],
});
