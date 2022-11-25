Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors21_30,
  triggers: [
    // ---------------- Floor 21-29 Mobs ----------------
    {
      id: 'HoH 21-30 Heavenly Onibi Blinding Burst',
      type: 'StartsUsing',
      netRegex: { id: '2F8E', source: 'Heavenly Onibi', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'HoH 21-30 Heavenly Hatamoto Tenka Goken',
      type: 'StartsUsing',
      netRegex: { id: '2F47', source: 'Heavenly Hatamoto', capture: false },
      response: Responses.getBehind(),
    },
    // ---------------- Floor 30 Boss: Hiruko ----------------
    {
      id: 'HoH 21-30 Hiruko Shiko',
      // boss does a proximity damage stomp that knocks players into the air
      // getting knocked up into a cloud kills the cloud
      // remaining clouds do an untelegraphed AoE (Lightning Bolt, 2C1E) that inflict Vulnerability Up stacks (63D)
      type: 'StartsUsing',
      netRegex: { id: '2C1B', source: 'Hiruko', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand under a cloud',
        },
      },
    },
  ],
});
