// Byakko Normal
Options.Triggers.push({
    zoneId: ZoneId.TheJadeStoa,
    timelineFile: 'byakko.txt',
    triggers: [
        {
            id: 'Byakko Storm Pulse',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Byakko', id: '2A2F', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Byakko Heavenly Strike',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Byakko', id: '2A2D' }),
            response: Responses.tankBuster(),
        },
        {
            // TODO: we could not call this out for the person who was caught by Clutch (27E1).
            id: 'Byakko Highest Stakes',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Byakko', id: '27E2', capture: false }),
            response: Responses.stackMarker(),
        },
        {
            id: 'Byakko White Herald',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '0057' }),
            response: Responses.awayFrom(),
        },
        {
            id: 'Byakko Bombogenesis',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '0065' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
    ],
});
