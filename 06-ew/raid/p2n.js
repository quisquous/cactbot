Options.Triggers.push({
    zoneId: ZoneId.AsphodelosTheSecondCircle,
    triggers: [
        {
            id: 'P2N Murky Depths',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '680F', source: 'Hippokampos', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '680F', source: 'Hippokampos', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '680F', source: 'Hippokampos', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '680F', source: 'ヒッポカムポス', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'P2N Doubled Impact',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos' }),
            netRegexDe: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos' }),
            netRegexFr: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos' }),
            netRegexJa: NetRegexes.startsUsing({ id: '680E', source: 'ヒッポカムポス' }),
            response: Responses.sharedTankBuster(),
        },
        {
            id: 'P2N Spoken Cataract',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'Hippokampos' }),
            netRegexDe: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'Hippokampos' }),
            netRegexFr: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'Hippokampos' }),
            netRegexJa: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'ヒッポカムポス' }),
            delaySeconds: 1,
            promise: async (data) => {
                const callData = await callOverlayHandler({
                    call: 'getCombatants',
                });
                if (!callData || !callData.combatants || !callData.combatants.length) {
                    console.error('SpokenCataract: failed to get combatants: ${JSON.stringify(callData)}');
                    return;
                }
                // This is the real hippo, according to hp.
                const hippos = callData.combatants.filter((c) => c.BNpcID === 13721);
                if (hippos.length !== 1) {
                    console.error('SpokenCataract: There is not exactly one Hippo?!?: ${JSON.stringify(hippos)}');
                    data.bodyActor = undefined;
                    return;
                }
                data.bodyActor = hippos[0];
            },
            alertText: (data, matches, output) => {
                if (!data.bodyActor) {
                    console.error('SpokenCataract: No boss actor found. Did the promise fail?');
                    return;
                }
                // Convert radians into 4 quarters N = 0, E = 1, S = 2, W = 3
                const heading = Math.round(2 - 2 * data.bodyActor.Heading / Math.PI) % 4;
                if (matches.id === '67F8') {
                    switch (heading) {
                        case 0:
                            return output.nc();
                        case 1:
                            return output.ec();
                        case 2:
                            return output.sc();
                        case 3:
                            return output.wc();
                    }
                }
                if (matches.id === '67F7') {
                    switch (heading) {
                        case 0:
                            return output.w();
                        case 1:
                            return output.n();
                        case 2:
                            return output.e();
                        case 3:
                            return output.s();
                    }
                }
                if (matches.id === '67F9') {
                    switch (heading) {
                        case 0:
                            return output.e();
                        case 1:
                            return output.s();
                        case 2:
                            return output.w();
                        case 3:
                            return output.n();
                    }
                }
            },
            outputStrings: {
                n: Outputs.north,
                e: Outputs.east,
                w: Outputs.west,
                s: Outputs.south,
                nc: {
                    en: 'North Corners',
                    de: 'nördliche Ecken',
                },
                ec: {
                    en: 'East Corners',
                    de: 'östliche Ecken',
                },
                sc: {
                    en: 'South Corners',
                    de: 'südliche Ecken',
                },
                wc: {
                    en: 'West Corners',
                    de: 'westliche Ecken',
                },
            },
        },
        {
            id: 'P2N Sewage Deluge',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '67F6', source: 'Hippokampos', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '67F6', source: 'Hippokampos', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '67F6', source: 'Hippokampos', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '67F6', source: 'ヒッポカムポス', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Aoe--Get on grid',
                    de: 'AoE--Geh auf die Gitter',
                },
            },
        },
        {
            // Spread aoe marker on some players, not all
            id: 'P2N Tainted Flood',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6809', source: 'Hippokampos' }),
            netRegexDe: NetRegexes.startsUsing({ id: '6809', source: 'Hippokampos' }),
            netRegexFr: NetRegexes.startsUsing({ id: '6809', source: 'Hippokampos' }),
            netRegexJa: NetRegexes.startsUsing({ id: '6809', source: 'ヒッポカムポス' }),
            condition: (data, matches) => matches.target === data.me,
            response: Responses.spread(),
        },
        {
            // Drops aoe zones beneath you -> run to dodge (on everyone)
            id: 'P2N Sewage Erruption',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '680D', source: 'Hippokampos', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '680D', source: 'Hippokampos', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '680D', source: 'Hippokampos', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '680D', source: 'ヒッポカムポス', capture: false }),
            suppressSeconds: 5,
            response: Responses.spread(),
        },
        {
            id: 'P2N Predatory Sight',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '680A', source: 'Hippokampos', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '680A', source: 'Hippokampos', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '680A', source: 'Hippokampos', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '680A', source: 'ヒッポカムポス', capture: false }),
            delaySeconds: 3,
            response: Responses.doritoStack(),
        },
        {
            // Raidwide knockback -> dont get knocked into slurry
            id: 'P2N Shockwave',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6807', source: 'Hippokampos', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6807', source: 'Hippokampos', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6807', source: 'Hippokampos', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6807', source: 'ヒッポカムポス', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Knockback--Stay on grid',
                    de: 'Rückstoß--Bleib auf den Gittern stehen',
                },
            },
        },
        {
            // Aoe from head outside the arena
            id: 'P2N Dissociation',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6806', source: 'Hippokampos' }),
            netRegexDe: NetRegexes.startsUsing({ id: '6806', source: 'Hippokampos' }),
            netRegexFr: NetRegexes.startsUsing({ id: '6806', source: 'Hippokampos' }),
            netRegexJa: NetRegexes.startsUsing({ id: '6806', source: 'ヒッポカムポス' }),
            alertText: (_data, matches, output) => {
                const xCoord = parseFloat(matches.x);
                if (xCoord > 100)
                    return output.w();
                if (xCoord < 100)
                    return output.e();
            },
            outputStrings: {
                e: Outputs.east,
                w: Outputs.west,
            },
        },
    ],
});
