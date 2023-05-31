import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Determine deaths from being pushed into the wall.
// Unfortunately all the knockbacks deal damage

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheEleventhCircle,
  damageWarn: {
    'P11N Divisive Ruling Main': '81B5', // Line cleave AoE initial hit
    'P11N Divine Ruination Main': '81B6', // Inner expanding cleave follow-up after Divisive Ruling
    'P11N Ripples Of Gloom Main 1': '81B7', // Outer cleave follow-up after Divisive Ruling
    'P11N Ripples Of Gloom Main 2': '81B8', // Outer cleave follow-up after Divisive Ruling
    'P11N Katakrisis Light': '81C5', // Being outside safety circle with light
    'P11N Katakrisis Dark': '81C6', // Being outside safety circle with dark
    'P11N Dineis': '8726', // Baited puddles
    'P11N Inner Light': '86F3', // Chariot after Dismissal Ruling
    'P11N Outer Dark': '86F4', // Dynamo after Dismissal Ruling
    'P11N Lightburst': '81BD', // Chariot after Upheld Ruling
    'P11N Dark Perimeter': '81BE', // Dynamo after Upheld Ruling
    'P11N Divisive Ruling Illusion': '81D7', // Line cleave AoE initial hit
    'P11N Divine Ruination Illusion': '81D8', // Inner expanding cleave follow-up after Divisive Ruling
    'P11N Ripples Of Gloom Illusion 1': '81D9', // Outer cleave follow-up after Divisive Ruling
    'P11N Ripples Of Gloom Illusion 2': '81DA', // Outer cleave follow-up after Divisive Ruling
  },
  shareWarn: {
    'P11N Upheld Ruling Cleave': '81BA', // Giant cleave marker
    'P11N Blinding Light': '81E1', // Standard spread circles
  },
  soloWarn: {
    'P11N Upheld Ruling Stack': '81B9',
    'P11N Styx': '81DC',
  },
  triggers: [
    {
      id: 'P11N Emissarys Will',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '81C7', source: 'Themis' }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
  ],
};

export default triggerSet;
