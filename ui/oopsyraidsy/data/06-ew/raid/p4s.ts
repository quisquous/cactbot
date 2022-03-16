import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Cursed Casting (pox) when you shouldn't (it hits but does no damage if correct)
// TODO: Vengeful Belone (orbs) incorrect debuff
// TODO: Director's Belone (towers) missed tower / incorrect tower?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFourthCircleSavage,
  damageWarn: {
    'P4S Acid Pinax': '69D4', // standing on acid square
    'P4S Lava Pinax': '69D5', // standing on fire square
    'P4S Well Pinax': '69D6', // standing on water square
    'P4S Levinstrike Pinax': '69D7', // standing on lightning square
    'P4S Acid Pinax Elemental Belone': '69F5', // unsafe square during Elemental Belone
    'P4S Lava Pinax Elemental Belone': '69F6', // unsafe square during Elemental Belone
    'P4S Well Pinax Elemental Belone': '69F7', // unsafe square during Elemental Belone
    'P4S Levinstrike Pinax Elemental Belone': '69F8', // unsafe square during Elemental Belone
    'P4S Levinstrike Mekhane': '69D3', // lightning pinax ability
    'P4S Shifting Strike': '6A06', // jump to cardinal + cleave
  },
  shareWarn: {
    'P4S Inversive Chlamys': '69EE', // tethers
    'P4S Acid Mekhane': '69D0', // acid pinax spread
  },
  shareFail: {
    'P4S Elegant Evisceration': '6A08', // tank buster
  },
  soloFail: {
    'P4S Lava Mekhane': '69D1', // lava pinax stack
  },
  triggers: [
    {
      id: 'P4S Knockback',
      type: 'Ability',
      // 69D2 = Well Mekhane
      // 6A01 = Shifting Strike (knockback)
      netRegex: NetRegexes.ability({ id: ['69D2', '6A01'] }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            fr: 'Poussé(e) dans le mur',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '벽으로 넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
