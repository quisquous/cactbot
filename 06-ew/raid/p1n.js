Options.Triggers.push({
    zoneId: ZoneId.AsphodelosTheFirstCircle,
    timelineFile: 'p1n.txt',
    triggers: [
        {
            // Also happens during Aetherflail Right (65DF)
            id: 'P1N Gaoler\'s Flail Right',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6DA2', source: 'Erichthonios', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6DA2', source: 'Erichthonios', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6DA2', source: 'Érichthonios', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6DA2', source: 'エリクトニオス', capture: false }),
            response: Responses.goLeft(),
        },
        {
            // Also happens during Aetherflail Left (65E0)
            id: 'P1N Gaoler\'s Flail Left',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6DA3', source: 'Erichthonios', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6DA3', source: 'Erichthonios', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6DA3', source: 'Érichthonios', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6DA3', source: 'エリクトニオス', capture: false }),
            response: Responses.goRight(),
        },
        {
            id: 'P1N Warder\'s Wrath',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '65F4', source: 'Erichthonios', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '65F4', source: 'Erichthonios', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '65F4', source: 'Érichthonios', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '65F4', source: 'エリクトニオス', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'P1N Shining Cells',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '65E9', source: 'Erichthonios', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '65E9', source: 'Erichthonios', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '65E9', source: 'Érichthonios', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '65E9', source: 'エリクトニオス', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'P1N Slam Shut',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '65EA', source: 'Erichthonios', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '65EA', source: 'Erichthonios', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '65EA', source: 'Érichthonios', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '65EA', source: 'エリクトニオス', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'P1N Pitiless Flail KB',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '0001' }),
            condition: Conditions.targetIsYou(),
            response: Responses.knockback(),
        },
        {
            id: 'P1N Pitiless Flail Stack',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
            response: Responses.stackMarker(),
        },
        {
            id: 'P1N Intemperance',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['AB3', 'AB4'], capture: true }),
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, _output) => {
                return _matches.effectId === 'AB3' ? _output.red() : _output.blue();
            },
            outputStrings: {
                red: {
                    en: 'Get hit by red',
                    de: 'Von Rot treffen lassen',
                    fr: 'Faites-vous toucher par le rouge',
                    ko: '빨간색 맞기',
                },
                blue: {
                    en: 'Get hit by blue',
                    de: 'Von Blau treffen lassen',
                    fr: 'Faites-vous toucher par le bleu',
                    ko: '파란색 맞기',
                },
            },
        },
        {
            id: 'P1N Heavy Hand',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '65F3', source: 'Erichthonios' }),
            netRegexDe: NetRegexes.startsUsing({ id: '65F3', source: 'Erichthonios' }),
            netRegexFr: NetRegexes.startsUsing({ id: '65F3', source: 'Érichthonios' }),
            netRegexJa: NetRegexes.startsUsing({ id: '65F3', source: 'エリクトニオス' }),
            condition: Conditions.caresAboutPhysical(),
            response: Responses.tankBuster(),
        },
        {
            id: 'P1N Powerful Light',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '893', capture: true }),
            alertText: (_data, matches, _output) => {
                if (matches.count === '14C')
                    return _output.light();
                return _output.fire();
            },
            outputStrings: {
                fire: {
                    en: 'Stand on fire',
                    de: 'Auf der Feuerfläche stehen',
                    fr: 'Placez-vous sur le feu',
                    ko: '빨간색 바닥 위에 서기',
                },
                light: {
                    en: 'Stand on light',
                    de: 'Auf der Lichtfläche stehen',
                    fr: 'Placez-vous sur la lumière',
                    ko: '흰색 바닥 위에 서기',
                },
            },
        },
    ],
});
