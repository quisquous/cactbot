import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: doing Dike without a tank swap or invulns
// TODO: people missing from Styx 8218 share
// TODO: taking two Jury Overruling 81E8/81E9 proteans
// TODO: people missing from Inevitable Law 81FC healer stacks
// TODO: people taking two Inevitable Law 81FC healer stacks
// TODO: people missing Inevitable Sentence 81FD partner stacks
// TODO: people missing from Upheld Overruling 81F2/8220 party stack
// TODO: handle multiple people being hit by Upheld Overruling 81F3/8221 damage better (tank warn, other person fail)

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheEleventhCircleSavage,
  damageWarn: {
    'P11S Illusory Glare': '81EA', // small targeted circles during Jury Overruling light
    'P11S Illusory Gloom': '81EB', // small targeted donuts during Jury Overruling dark
    'P11S Lightburst 1': '81F6', // large centered circle during Upheld Overruling light
    'P11S Lightburst 2': '8224', // large centered circle during Upheld Overruling light from clone
    'P11S Dark Perimeter 1': '81F7', // large dark donut during Upheld Overruling dark
    'P11S Dark Perimeter 2': '8225', // large dark donut during Upheld Overruling dark from clone
    'P11S Divisive Overruling 1': '81EE', // line during dark/light Divisive Overruling
    'P11S Divisive Overruling 2': '87B5', // line during dark/light Divisive Overruling in Messengers
    'P11S Divisive Ruling': '821C', // line during dark/light clone Divisive Ruling in Messengers/Letter
    'P11S Divine Ruination 1': '81EF', // expanding light Divisive Overruling Line
    'P11S Divine Ruination 2': '87B6', // expanding light Divisive Overruling Line in Messengers
    'P11S Divine Ruination 3': '821D', // expanding light clone Divisive Ruling Line in Messengers/Letter
    'P11S Ripples of Gloom 1': '81F0', // rippling dark Divisive Overruling Line
    'P11S Ripples of Gloom 2': '81F1', // rippling dark Divisive Overruling Line
    'P11S Ripples of Gloom 3': '87B7', // rippling dark Divisive Overruling Line in Messengers
    'P11S Ripples of Gloom 4': '87B8', // rippling dark Divisive Overruling Line in Messengers
    'P11S Ripples of Gloom 5': '821E', // rippling dark clone Divisive Overruling Line in Messengers/Letter
    'P11S Ripples of Gloom 6': '821F', // rippling dark clone Divisive Overruling Line in Messengers/Letter
    'P11S Inner Light': '8788', // large circle during Dismissal Overruling light
    'P11S Outer Dark': '8789', // large donut during Dismissal Overruling dark
    'P11S Arcane Sphere Arche 1': '8213', // light portal lasers
    'P11S Arcane Sphere Arche 2': '8214', // dark portal lasers
    'P11S Arcane Sphere Unlucky Lot 1': '8215', // light sphere explosion
    'P11S Arcane Sphere Unlucky Lot 2': '8216', // dark sphere explosion
    'P11S Arcane Cylinder Lightstream 1': '8207', // initial laser line
    'P11S Arcane Cylinder Lightstream 2': '8208', // rotating laser line
    'P11S Dark Current 1': '8209', // initial circles
    'P11S Dark Current 2': '820A', // rotating circles
    'P11S Katakiris Light': '81FF', // light tether failure
    'P11S Katakiris Dark': '8200', // dark tether failure
  },
  shareWarn: {
    'P11S Jury Overruling Light': '81E8', // protean
    'P11S Jury Overruling Dark': '81E9', // protean
    'P11S Upheld Overruling Dark 1': '81F3', // tank knockback
    'P11S Upheld Overruling Dark 2': '8221', // tank knockback
    'P11S Blinding Light': '822A', // spreads during Dark Current
  },
  soloFail: {
    'P11S Inevitable Sentence': '81FD', // partner stacks
  },
  triggers: [
    {
      id: 'P11S Knockback',
      type: 'Ability',
      // 8786 Dismissal Overruling light
      // 8787 Dismissal Overruling dark
      netRegex: NetRegexes.ability({ id: ['8786', '8787'], ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked into wall',
            de: 'Rückstoß in die Wand',
            fr: 'Frappé(e) dans le mur',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
