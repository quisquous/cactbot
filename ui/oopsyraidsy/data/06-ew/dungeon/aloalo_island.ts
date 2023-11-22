import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyMistakeType, OopsyTrigger, OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

const nonzeroDamageMistake = (
  triggerId: string,
  abilityId: string | string[],
  type: OopsyMistakeType,
): OopsyTrigger<OopsyData> => {
  return {
    id: triggerId,
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: abilityId, ...playerDamageFields }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: type,
        blame: matches.target,
        reportId: matches.targetId,
        text: matches.ability,
      };
    },
  };
};

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AloaloIsland,
  damageWarn: {
    // Trash
    'Aloalo Uragnite Palsynyxis': '8853', // small front conal
    'Aloalo Anala Flame Dance': '8CF1', // targeted circle
    'Aloalo Snipper Bubble Shower': '8856', // front conal
    'Aloalo Kiwakin Tail Screw': '8CF0', // targeted circle (not a 1 hp mechanic)
    'Aloalo Ray Hydrocannon': '885B', // line
    'Aloalo Biast Electrify': '8CF2', // targeted circle
    'Aloalo Ogrebon Flouder': '885A', // line
    'Aloalo Zaratan Sewer Water': '8859', // front 180 cleave

    // Quaqua (left)
    'Aloalo Quaqua Ravaging Axe': '8B8A', // circle damage from Arcane Armaments axe
    'Aloalo Quaqua Ringing Quoits': '8B8B', // donut damage from Arcane Armaments ring
    'Aloalo Quaqua Violet Storm': '8B95', // large late telegraph front conal
    'Aloalo Quaqua Scalding Waves 1': '8B97', // initial fire lines
    'Aloalo Quaqua Scalding Waves 2': '8B98', // bouncing fire lines
    'Aloalo Quaqua Rout 1': '8B91', // initial charge
    'Aloalo Quaqua Rout 2': '8B92', // followup 3 charges
    'Aloalo Quaqua Cloud to Ground 1': '8B9C', // initial hit of Drake exaflares
    'Aloalo Quaqua Cloud to Ground 2': '8B9D', // followup hits of Drake exaflares

    // Ketuduke
    'Aloalo Ketuduke Saturate Orb 1': '8A7C', // Spring Crystal orb circle (no bubbles)
    'Aloalo Ketuduke Saturate Orb 2': '8A7D', // Spring Crystal orb circle (w/Bubble Net)
    'Aloalo Ketuduke Saturate Orb 3': '8A7E', // Spring Crystal rupee line laser (no bubbles)
    'Aloalo Ketuduke Saturate Orb 4': '8A7F', // Spring Crystal rupee line laser (w/Bubble Net)
    'Aloalo Ketuduke Sphere Shatter': '8A87', // damage from moving arches
    'Aloalo Ketuduke Riptide': '8A89', // stepping in Airy Bubble
    'Aloalo Ketuduke Receding Twintides': '8A9D', // initial out during out->in
    'Aloalo Ketuduke Near Tide': '8A9E', // second out during in->out
    'Aloalo Ketuduke Encroaching Twintides': '8A9F', // initial in during in->out
    'Aloalo Ketuduke Far Tide': '8AA0', // second in during out->in
    'Aloalo Ketuduke Hydrobomb': '8AA2', // 3x puddles
    'Aloalo Ketuduke Hundred Lashing': '8A97', // 180 cleave from Zaratan add
  },
  gainsEffectWarn: {
    // C05 = 9999 duration, C06 = 15s duration
    'Aloalo Bleed': 'C05', // standing outside Quaqua
    // C03 = 9999 duration, C04 = 15s duration
    'Aloalo Dropsy': 'C03', // standing outside Ketuduke
  },
  triggers: [
    // Path 04: not being in bubble for Ogrebon
    nonzeroDamageMistake('Aloalo Quaqua Shock', '8A9A', 'warn'),
  ],
};

export default triggerSet;
