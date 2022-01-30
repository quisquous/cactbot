Options.Triggers.push({
    zoneId: ZoneId.Thavnair,
    triggers: [
        {
            id: 'Hunt Sugriva Spark',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6A55', source: 'Sugriva', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6A55', source: 'スグリーヴァ', capture: false }),
            response: Responses.getIn(),
        },
        {
            id: 'Hunt Sugriva Scythe Tail',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6A56', source: 'Sugriva', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6A56', source: 'スグリーヴァ', capture: false }),
            response: Responses.getOut(),
        },
        {
            id: 'Hunt Sugriva Twister',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6A53', source: 'Sugriva', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6A53', source: 'スグリーヴァ', capture: false }),
            infoText: (_data, _matches, output) => output.knockbackStack(),
            outputStrings: {
                knockbackStack: {
                    en: 'Knockback Stack',
                    de: 'Rückstoß sammeln',
                    fr: 'Package + Poussée',
                },
            },
        },
        {
            id: 'Hunt Sugriva Butcher',
            type: 'StartsUsing',
            // This is followed up with Rip (6A58) which is also a tank cleave.
            // We could call out 2x tank cleave, but maybe that's overkill.
            netRegex: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva' }),
            netRegexDe: NetRegexes.startsUsing({ id: '6A57', source: 'Sugriva' }),
            netRegexFr: NetRegexes.startsUsing({ id: '6A57', source: 'Sugriva' }),
            netRegexJa: NetRegexes.startsUsing({ id: '6A57', source: 'スグリーヴァ' }),
            response: Responses.tankCleave(),
        },
        {
            id: 'Hunt Sugriva Rock Throw',
            type: 'StartsUsing',
            // One telegraphed circle in front, then some untelegraphed ones.
            netRegex: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6A59', source: 'Sugriva', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6A59', source: 'スグリーヴァ', capture: false }),
            response: Responses.getBehind(),
        },
        {
            id: 'Hunt Sugriva Crosswind',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
            netRegexDe: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
            netRegexFr: NetRegexes.startsUsing({ id: '6A5B', source: 'Sugriva', capture: false }),
            netRegexJa: NetRegexes.startsUsing({ id: '6A5B', source: 'スグリーヴァ', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Hunt Yilan Forward March',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '7A6', source: 'Yilan' }),
            condition: Conditions.targetIsYou(),
            // t=0.0 gain effect (this line)
            // t=6.3 Mini Light starts casting
            // t=9.0 lose effect (forced march)
            // t=12.3 Mini Light ability
            // Full duration is 9s, but have seen this apply late for ~7 to some people.
            delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Forward March Away',
                    de: 'Geistlenkung vorwärts',
                    fr: 'Marche forcée avant',
                },
            },
        },
        {
            id: 'Hunt Yilan About Face',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '7A7', source: 'Yilan' }),
            condition: Conditions.targetIsYou(),
            delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Backwards March Away',
                    de: 'Geistlenkung rückwärts',
                    fr: 'Marche forcée arrière',
                },
            },
        },
        {
            id: 'Hunt Yilan Left Face',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '7A8', source: 'Yilan' }),
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Left March Away',
                    de: 'Geistlenkung links',
                    fr: 'Marche forcée gauche',
                },
            },
        },
        {
            id: 'Hunt Yilan Right Face',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '7A9', source: 'Yilan' }),
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Right March Away',
                    de: 'Geistlenkung rechts',
                    fr: 'Marche forcée droite',
                },
            },
        },
        {
            id: 'Hunt Yilan Brackish Rain',
            type: 'StartsUsing',
            // Untelegraphed conal attack.
            netRegex: NetRegexes.startsUsing({ id: '6A62', source: 'Yilan', capture: false }),
            response: Responses.getBehind(),
        },
    ],
});
