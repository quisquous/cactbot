Options.Triggers.push({
    zoneId: ZoneId.TheTowerOfZot,
    timelineFile: 'the_tower_of_zot.txt',
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
