Options.Triggers.push({
    zoneId: ZoneId.CuttersCry,
    triggers: [
        {
            id: 'Chimera Ram Voice',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '450', source: 'Chimera', capture: false }),
            response: Responses.outOfMelee(),
        },
        {
            id: 'Chimera Dragon Voice',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '5A2', source: 'Chimera', capture: false }),
            response: Responses.getIn(),
        },
    ],
});
