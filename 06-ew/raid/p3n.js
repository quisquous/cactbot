Options.Triggers.push({
    zoneId: ZoneId.AsphodelosTheThirdCircle,
    triggers: [
        {
            id: 'P3N Experimental Fireplume 1',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6698', source: 'Phoinix', capture: false }),
            response: Responses.getInThenOut(),
        },
        {
            id: 'P3N Experimental Fireplume 2',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6696', source: 'Phoinix', capture: false }),
            alertText: (_data, _matches, output) => {
                return output.outOfMiddle();
            },
            outputStrings: {
                outOfMiddle: {
                    en: 'Out Of Middle',
                    de: 'Raus aus der Mitte',
                    ja: '横へ',
                    cn: '远离中间',
                    ko: '가운데 피하기',
                },
            },
        },
        {
            id: 'P3N Scorched Exaltation',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66B8', source: 'Phoinix', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'P3N Heat of Condemnation',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66B2', source: 'Phoinix' }),
            suppressSeconds: 1,
            response: Responses.tankCleave('alert'),
        },
        {
            id: 'P3N Darkened Fire Aoe',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '010[C-F]' }),
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, output) => {
                return output.text();
            },
            outputStrings: {
                text: {
                    en: 'Stand on Darkened Fire',
                },
            },
        },
        {
            id: 'P3N Right Cinderwing',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66B4', source: 'Phoinix', capture: false }),
            response: Responses.goLeft(),
        },
        {
            id: 'P3N Left Cinderwing',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66B5', source: 'Phoinix', capture: false }),
            response: Responses.goRight(),
        },
        {
            // Could check the log line's x y coordinate to determine from where to where it charges, npc at charge target casts 66AF?
            id: 'P3N Trail of Condemnation',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66AD', source: 'Phoinix', capture: false }),
            alertText: (_data, _matches, output) => {
                return output.avoidCharge();
            },
            outputStrings: {
                avoidCharge: {
                    en: 'Avoid Charge',
                    de: 'Charge ausweichen',
                    fr: 'Évitez les charges',
                    ja: '突進避けて',
                    cn: '躲避冲锋',
                    ko: '돌진을 피하세요',
                },
            },
        },
        {
            id: 'P3N Sunbird Spawn',
            type: 'AddedCombatant',
            netRegex: NetRegexes.addedCombatant({ name: 'Sunbird', capture: false }),
            suppressSeconds: 1,
            alertText: (data, _matches, output) => {
                if (data.role === 'tank')
                    return output.tank();
                return output.text();
            },
            outputStrings: {
                tank: {
                    en: 'Pull add circles apart',
                },
                text: Outputs.killAdds,
            },
        },
        {
            id: 'P3N Dead Rebirth',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66A9', source: 'Phoinix', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'P3N Ashen Eye',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66AB', source: 'Sparkfledged' }),
            alertText: (data, matches, output) => {
                if (!data.ashenEyeDirections)
                    data.ashenEyeDirections = [];
                // Convert radians into 4 quarters N = 0, E = 1, S = 2, W = 3
                const heading = Math.round(2 - 2 * parseFloat(matches.heading) / Math.PI) % 4;
                data.ashenEyeDirections.push(heading);
                if (data.ashenEyeDirections.length === 2) {
                    let safeSpot = '';
                    let first = '';
                    const dir1 = data.ashenEyeDirections[0];
                    const dir2 = data.ashenEyeDirections[1];
                    switch (dir1) {
                        case 0:
                            safeSpot = output.n();
                            break;
                        case 1:
                            safeSpot = output.e();
                            break;
                        case 2:
                            safeSpot = output.s();
                            break;
                        case 3:
                            safeSpot = output.w();
                            break;
                    }
                    switch (dir2) {
                        case 0:
                            first = output.s();
                            break;
                        case 1:
                            first = output.w();
                            break;
                        case 2:
                            first = output.n();
                            break;
                        case 3:
                            first = output.e();
                            break;
                    }
                    return output.combo({ first: first, second: safeSpot });
                } else if (data.ashenEyeDirections.length > 3) {
                    data.ashenEyeDirections = [];
                }
            },
            outputStrings: {
                n: Outputs.north,
                e: Outputs.east,
                w: Outputs.west,
                s: Outputs.south,
                combo: {
                    en: '${first} => ${second}',
                    de: '${first} => ${second}',
                    fr: '${first} => ${second}',
                    ja: '${first} => ${second}',
                    cn: '${first} => ${second}',
                    ko: '${first} => ${second}',
                },
            },
        },
        {
            id: 'P3N Devouring Brand',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '669E', source: 'Phoinix', capture: false }),
            alertText: (_data, _matches, output) => {
                return output.text();
            },
            outputStrings: {
                text: {
                    en: 'Split Intercardinals',
                },
            },
        },
        {
            id: 'P3N Searing Breeze',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '66B6', source: 'Phoinix', capture: false }),
            response: Responses.stackThenSpread(),
        },
        {
            id: 'P3N Spread Marker',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '008B' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
    ],
});
