Options.Triggers.push({
    zoneId: ZoneId.ShisuiOfTheVioletTides,
    timelineFile: 'shisui_of_the_violet_tides.txt',
    triggers: [
        {
            id: 'Shisui Amikiri Kamikiri Add',
            type: 'AddedCombatant',
            netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6238' }),
            alertText: (_data, matches, output) => output.kill({ name: matches.name }),
            outputStrings: {
                kill: {
                    en: 'Kill ${name}',
                },
            },
        },
        {
            id: 'Shisui Amikiri Digestive Fluid',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '000E' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'Shisui Ruby Princess Seduce',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Ruby Princess', id: '1F7A', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Get In Box',
                },
            },
        },
        {
            // This is what it's called!
            id: 'Shisui Ruby Princess Geothermal Flatulence',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '0001' }),
            condition: Conditions.targetIsYou(),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Chasing AOE on YOU',
                },
            },
        },
        {
            id: 'Shisui Shisui Yohi Naishi-No-Kami',
            type: 'AddedCombatant',
            netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6244', capture: false }),
            response: Responses.killAdds(),
        },
        {
            id: 'Shisui Shisui Yohi Mad Stare',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Shisui Yohi', id: '1F82', capture: false }),
            response: Responses.lookAway(),
        },
    ],
});
