Options.Triggers.push({
    zoneId: ZoneId.TheMinstrelsBalladHydaelynsCall,
    timelineFile: 'hydaelyn-ex.txt',
    triggers: [
        {
            id: 'HydaelenEx Shining Saber',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '68C8', source: 'Hydaelyn', capture: false }),
            response: Responses.getTogether(),
        },
    ],
});
