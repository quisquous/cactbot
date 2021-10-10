Options.Triggers.push({
    zoneId: ZoneId.BaelsarsWall,
    timelineFile: 'baelsars_wall.txt',
    timelineTriggers: [
        {
            id: 'Baelsar Magitek Cannon',
            regex: /Magitek Cannon/,
            beforeSeconds: 4,
            response: Responses.tankBuster(),
        },
        {
            id: 'Baelsar Dull Blade',
            regex: /Dull Blade/,
            beforeSeconds: 4,
            response: Responses.miniBuster(),
        },
    ],
    triggers: [
        {
            id: 'Baelsar Magitek Claw',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CB2', source: 'Magitek Predator' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Baelsar Magitek Ray',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CB3', source: 'Magitek Predator', capture: false }),
            response: Responses.awayFromFront(),
        },
        {
            id: 'Baelsar Needle Burst',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1DC8', source: 'Magitek Vanguard D-1' }),
            condition: (data) => data.CanStun(),
            response: Responses.stun(),
        },
        {
            id: 'Baelsar Launcher',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CBC', source: 'Magitek Predator', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Baelsar Dynamic Sensory Jammer',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '46C' }),
            condition: Conditions.targetIsYou(),
            response: Responses.stopEverything(),
        },
        {
            id: 'Baelsar Griffin Beak',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CC3', source: 'The Griffin', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Baelsar Flash Powder',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CC4', source: 'The Griffin' }),
            response: Responses.lookAwayFromSource(),
        },
        {
            id: 'Baelsar Griffin Claw',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CC2', source: 'The Griffin' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Baelsar Big Boot',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '1CC4' }),
            condition: Conditions.targetIsYou(),
            response: Responses.knockbackOn(),
        },
        {
            id: 'Baelsar Restraint Collar',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '1CC8', source: 'The Griffin' }),
            condition: Conditions.targetIsNotYou(),
            alertText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
            outputStrings: {
                text: {
                    en: 'Break chain on ${player}',
                    de: 'Kette von ${player} brechen',
                    fr: 'Cassez les chaînes de ${player}',
                    ja: '${player}の線を取る',
                    cn: '截断${player}的线',
                    ko: '${player}의 사슬 부수기',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'en',
            'replaceText': {
                'Cross Of Chaos/Circle Of Chaos': 'Circle/Cross',
                'Ring Of Chaos/Cross Of Chaos': 'Cross/Ring',
                'Ring Of Chaos/Circle Of Chaos': 'Circle/Ring',
                'Hydro Pull/Hydro Push': 'Hydro Pull/Push',
                'Order To Detonate \\(cast\\)': 'Order To Detonate',
            },
        },
    ],
});
