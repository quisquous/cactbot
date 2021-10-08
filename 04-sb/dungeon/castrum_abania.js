Options.Triggers.push({
    zoneId: ZoneId.CastrumAbania,
    timelineFile: 'castrum_abania.txt',
    triggers: [
        {
            id: 'CastrumAbania Magna Roader Fire III',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Magna Roader', id: '1F16', capture: false }),
            response: Responses.aoe(),
            run: (data) => data.calledWildSpeed = data.calledUseCannon = false,
        },
        {
            id: 'CastrumAbania Magna Roader Wild Speed',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Magna Roader', id: '207E', capture: false }),
            // This repeats indefinitely, so only call the first one per Wild Speed phase.
            condition: (data) => !data.calledWildSpeed,
            delaySeconds: 6,
            response: Responses.killAdds(),
            run: (data) => data.calledWildSpeed = true,
        },
        {
            id: 'CastrumAbania Magna Roader Mark XLIII Mini Cannon',
            type: 'NameToggle',
            netRegex: NetRegexes.nameToggle({ name: 'Mark XLIII Mini Cannon', toggle: '01', capture: false }),
            // There's two cannons, so only say something when the first one is targetable.
            condition: (data) => !data.calledUseCannon,
            delaySeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            run: (data) => data.calledUseCannon = true,
            outputStrings: {
                text: {
                    en: 'Fire cannon at boss',
                },
            },
        },
        {
            id: 'CastrumAbania Number XXIV Stab',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Number XXIV', id: '1F1B' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'CastrumAbania Number XXIV Barrier Shift Fire',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Number XXIV', id: '1F21', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Get Fire Buff',
                },
            },
        },
        {
            id: 'CastrumAbania Number XXIV Barrier Shift Ice',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Number XXIV', id: '1F22', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Get Ice Buff',
                },
            },
        },
        {
            id: 'CastrumAbania Number XXIV Barrier Shift Lightning',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Number XXIV', id: '1F23', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Get Lightning Buff',
                },
            },
        },
        {
            id: 'CastrumAbania Inferno Ketu Slash',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Inferno', id: ['1F26', '208B', '208C'] }),
            response: Responses.tankBuster(),
        },
        {
            id: 'CastrumAbania Inferno Adds',
            type: 'AddedCombatant',
            netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6270', capture: false }),
            response: Responses.killAdds(),
        },
        {
            id: 'CastrumAbania Inferno Rahu Ray',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '004A' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'CastrumAbania Inferno Rahu Comet',
            type: 'StartsUsing',
            // Rahu Comet (1F2B) does not do knockback until it has been empowered at least once.
            netRegex: NetRegexes.startsUsing({ source: 'Inferno', id: ['2088', '2089'], capture: false }),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    // Knockback comes from the proximity marker, not the boss.
                    en: 'Small comet knockback',
                },
            },
        },
    ],
});
