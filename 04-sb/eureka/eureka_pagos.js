Options.Triggers.push({
    zoneId: ZoneId.TheForbiddenLandEurekaPagos,
    resetWhenOutOfCombat: false,
    triggers: [
        {
            id: 'Eureka Pagos Falling Asleep',
            type: 'GameLog',
            netRegex: { line: '7 minutes have elapsed since your last activity..*?', capture: false },
            response: Responses.wakeUp(),
        },
    ],
});
