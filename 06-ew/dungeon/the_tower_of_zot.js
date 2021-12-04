Options.Triggers.push({
    zoneId: ZoneId.TheTowerOfZot,
    triggers: [
        {
            id: 'ToZ Cinduruva Isitva Siddhi',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '62A9', source: 'Cinduruva', capture: true }),
            response: Responses.tankBuster(),
        },
        {
            id: 'ToZ Sanduruva Isitva Siddhi',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '62C0', source: 'Sanduruva', capture: true }),
            response: Responses.tankBuster(),
        },
    ],
});
