Options.Triggers.push({
  zoneId: ZoneId.HaukkeManorHard,
  triggers: [
    {
      id: 'Haukke Manor Hard Stoneskin',
      type: 'StartsUsing',
      netRegex: { id: '3F0', source: 'Manor Sentry' },
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Haukke Manor Hard Beguiling Mist',
      type: 'StartsUsing',
      netRegex: { id: '6B7', source: 'Halicarnassus' },
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
  ],
});
