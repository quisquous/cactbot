Options.Triggers.push({
    zoneId: ZoneId.ContainmentBayS1T7,
    triggers: [
        {
            id: 'Sephirot Fiendish Rage',
            type: 'HeadMarker',
            netRegex: { id: '0048' },
            response: Responses.stackMarkerOn(),
        },
        {
            id: 'Sephirot Ratzon',
            type: 'HeadMarker',
            netRegex: { id: '0046' },
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'Sephirot Ain',
            type: 'StartsUsing',
            netRegex: { id: '16DD', source: 'Sephirot', capture: false },
            response: Responses.getBehind(),
        },
        {
            id: 'Sephirot Earth Shaker',
            type: 'HeadMarker',
            netRegex: { id: '0028' },
            condition: Conditions.targetIsYou(),
            response: Responses.earthshaker(),
        },
        {
            // The coordinates for skill are inconsistent and can't be used to
            // reliably determine the position of the knockback.
            id: 'Sephirot Pillar of Mercy',
            type: 'StartsUsing',
            netRegex: { id: '16EA', source: 'Sephirot', capture: false },
            response: Responses.knockback(),
        },
        {
            id: 'Sephirot Storm of Words Revelation',
            type: 'StartsUsing',
            netRegex: { id: '16EC', source: 'Storm of Words', capture: false },
            alarmText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Kill Storm of Words or die',
                    de: 'Wörtersturm besiegen',
                    fr: 'Tuez Tempête de mots ou mourrez',
                    cn: '击杀言语风暴!',
                    ko: '신언의 폭풍 제거',
                },
            },
        },
        {
            id: 'Sephirot Malkuth',
            type: 'StartsUsing',
            netRegex: { id: '16EB', source: 'Sephirot', capture: false },
            response: Responses.knockback(),
        },
    ],
});
