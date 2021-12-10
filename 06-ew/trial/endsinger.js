const orbOutputStrings = {
    ne: Outputs.northeast,
    nw: Outputs.northwest,
    se: Outputs.southeast,
    sw: Outputs.southwest,
};
const getOrbSafeDir = (data, id, output) => {
    const starCombatant = data.storedStars[id];
    if (!starCombatant) {
        console.error(`Doomed Stars AoE: null data`);
        return;
    }
    if (starCombatant.PosX < 100) {
        if (starCombatant.PosY < 100)
            return output.se();
        return output.ne();
    }
    if (starCombatant.PosY < 100)
        return output.sw();
    return output.nw();
};
Options.Triggers.push({
    zoneId: ZoneId.TheFinalDay,
    timelineFile: 'endsinger.txt',
    initData: () => {
        return {
            storedStars: {},
            phase: 1,
        };
    },
    triggers: [
        {
            id: 'Endsinger Doomed Stars AoE',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['662E', '6634'], source: 'Doomed Stars', capture: true }),
            delaySeconds: 0.5,
            promise: async (data, matches) => {
                const starData = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                const starCombatant = starData.combatants[0];
                if (!starCombatant) {
                    console.error(`Doomed Stars AoE: null data`);
                    return;
                }
                data.storedStars[matches.sourceId] = starCombatant;
            },
            alertText: (data, matches, output) => {
                return getOrbSafeDir(data, matches.sourceId, output);
            },
            outputStrings: orbOutputStrings,
        },
        {
            id: 'Endsinger Elegeia',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['662C', '6682'], source: 'The Endsinger', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Endsinger Doomed Stars Fatalism Tether',
            type: 'Tether',
            netRegex: NetRegexes.tether({ source: 'The Endsinger', id: '00A6' }),
            delaySeconds: 10,
            alertText: (data, matches, output) => {
                return getOrbSafeDir(data, matches.targetId, output);
            },
            outputStrings: orbOutputStrings,
        },
        {
            id: 'Endsinger Galaxias',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6C69', source: 'The Endsinger', capture: false }),
            response: Responses.knockback(),
        },
        {
            id: 'Endsinger Elenchos Middle',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6644', source: 'The Endsinger', capture: false }),
            response: Responses.goSides(),
        },
        {
            id: 'Endsinger Elenchos Outsides',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6642', source: 'The Endsinger', capture: false }),
            response: Responses.goMiddle(),
        },
        {
            id: 'Endsinger Death\'s Embrace',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6649', source: 'The Endsinger', capture: false }),
            response: Responses.spread(),
        },
        {
            id: 'Endsinger Death\'s Embrace Feathers',
            type: 'Ability',
            netRegex: NetRegexes.ability({ id: '6649', source: 'The Endsinger', capture: false }),
            response: Responses.moveAway(),
        },
        {
            id: 'Endsinger Death\'s Aporrhoia',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '663D', source: 'The Endsinger', capture: false }),
            infoText: (_data, _matches, output) => {
                return output.avoidLasers();
            },
            outputStrings: {
                avoidLasers: {
                    en: 'Avoid Head Lasers',
                },
            },
        },
        {
            id: 'Endsinger Hubris',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6652', source: 'The Endsinger', capture: true }),
            response: Responses.tankCleave(),
        },
        {
            id: 'Endsinger Epigonoi',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6646', source: 'The Endsinger', capture: true }),
            condition: (_data, matches) => {
                // Find one head that's not dead center
                return parseFloat(matches.x) !== 100 || parseFloat(matches.y) !== 100;
            },
            suppressSeconds: 3,
            infoText: (_data, matches, output) => {
                // If it's cardinal, then intercardinal is safe
                if (parseFloat(matches.x) === 100 || parseFloat(matches.y) === 100)
                    return output.intercardinal();
                return output.cardinal();
            },
            outputStrings: {
                cardinal: {
                    en: 'Cardinal edge',
                },
                intercardinal: {
                    en: 'Intercardinal edge',
                },
            },
        },
        {
            id: 'Endsinger Interstellar Toggle',
            type: 'NameToggle',
            netRegex: NetRegexes.nameToggle({ toggle: '00', name: 'The Endsinger', capture: true }),
            condition: (data) => data.phase === 1,
            delaySeconds: 4,
            promise: async (data, matches) => {
                const bossData = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.id, 16)],
                });
                const bossCombatant = bossData.combatants[0];
                if (!bossCombatant) {
                    console.error(`Interstellar: null data`);
                    return;
                }
                data.storedBoss = bossCombatant;
            },
            alertText: (data, matches, output) => {
                const boss = data.storedBoss;
                if (!boss)
                    return undefined;
                const x = boss.PosX;
                const y = boss.PosY;
                // Handle cardinals the easy way
                if (x === 100) {
                    return output.direction({
                        dir1: output.east(),
                        dir2: output.west(),
                    });
                }
                if (y === 100) {
                    return output.direction({
                        dir1: output.north(),
                        dir2: output.south(),
                    });
                }
                if (x < 100) {
                    if (y < 100) {
                        return output.direction({
                            dir1: output.northeast(),
                            dir2: output.southwest(),
                        });
                    }
                    return output.direction({
                        dir1: output.northwest(),
                        dir2: output.southeast(),
                    });
                }
                if (y < 100) {
                    return output.direction({
                        dir1: output.northwest(),
                        dir2: output.southeast(),
                    });
                }
                return output.direction({
                    dir1: output.northeast(),
                    dir2: output.southwest(),
                });
            },
            outputStrings: {
                north: Outputs.north,
                northeast: Outputs.northeast,
                east: Outputs.east,
                southeast: Outputs.southeast,
                south: Outputs.south,
                southwest: Outputs.southwest,
                west: Outputs.west,
                northwest: Outputs.northwest,
                direction: {
                    en: '${dir1} / ${dir2}',
                },
            },
        },
        {
            id: 'Endsinger Planetes',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6B58', source: 'The Endsinger', capture: false }),
            run: (data) => data.phase = 2,
        },
        {
            id: 'Endsinger Nemesis',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '664E', source: 'The Endsinger', capture: true }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'Endsinger Ultimate Fate',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6B59', source: 'The Endsinger', capture: false }),
            alarmText: (data, _matches, output) => {
                if (data.role === 'tank')
                    return output.text();
            },
            outputStrings: {
                text: {
                    en: 'Tank LB NOW',
                    de: 'JETZT Tank LB',
                    fr: 'Transcendance Tank maintenant !',
                    ja: '今タンクLB',
                    cn: '坦克LB',
                    ko: '탱리밋',
                },
            },
        },
    ],
});
