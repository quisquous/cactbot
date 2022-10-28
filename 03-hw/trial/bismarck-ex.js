Options.Triggers.push({
    zoneId: ZoneId.TheLimitlessBlueExtreme,
    triggers: [
        {
            id: 'Bismarck Sharp Gust',
            type: 'StartsUsing',
            netRegex: { id: 'FAF', source: 'Bismarck', capture: false },
            response: Responses.knockback(),
        },
    ],
});
