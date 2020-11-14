'use strict';

[{
  zoneId: ZoneId.TheGhimlytDark,
  timelineFile: 'ghimlyt_dark.txt',
  timelineTriggers: [
    {
      id: 'Ghimlyt Dark Prometheus Laser',
      regex: /Heat/,
      beforeSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid laser from wall',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Ghimlyt Dark Jarring Blow',
      netRegex: NetRegexes.startsUsing({ id: '376E', source: 'Mark III-B Magitek Colossus' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Wild Fire Beam',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Ghimlyt Dark Ceruleum Vent',
      netRegex: NetRegexes.startsUsing({ id: '3773', source: 'Mark III-B Magitek Colossus', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Ghimlyt Dark Magitek Ray',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Ghimlyt Dark Magitek Slash',
      netRegex: NetRegexes.startsUsing({ id: '3774', source: 'Mark III-B Magitek Colossus', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid spinning laser',
        },
      },
    },
    {
      id: 'Ghimlyt Dark Nitrospin',
      netRegex: NetRegexes.startsUsing({ id: '3455', source: 'Prometheus', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Ghimlyt Dark Cermet Drill',
      netRegex: NetRegexes.startsUsing({ id: '3459', source: 'Prometheus' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Freezing Missile',
      netRegex: NetRegexes.startsUsing({ id: '345C', source: 'Prometheus', capture: false }),
      suppressSeconds: 5,
      response: Responses.goMiddle(),
    },
    {
      id: 'Ghimlyt Dark Artifical Plasma',
      netRegex: NetRegexes.startsUsing({ id: '3727', source: 'Julia Quo Soranus', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Ghimlyt Dark Innocence',
      netRegex: NetRegexes.startsUsing({ id: '3729', source: 'Julia Quo Soranus' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Delta Trance',
      netRegex: NetRegexes.startsUsing({ id: '372A', source: 'Annia Quo Soranus' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      // This head marker is used on players and NPCs, so we have to exclude NPCs explicitly.
      id: 'Ghimlyt Dark Heirsbane',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: (data, matches) => matches.targetId[0] !== '4' && data.role === 'healer',
      infoText: (data, matches, output) => {
        return output.text({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Incoming damage on ${player}',
        },
      },
    },
    {
      id: 'Ghimlyt Dark Order To Bombard',
      netRegex: NetRegexes.ability({ id: '3710', source: 'Annia Quo Soranus', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Ghimlyt Dark Covering Fire',
      netRegex: NetRegexes.headMarker({ id: '0078' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
}];
