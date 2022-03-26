import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Cursed Casting (pox) when you shouldn't (it hits but does no damage if correct)
// TODO: Vengeful Belone (orbs) incorrect debuff
// TODO: Director's Belone (towers) missed tower / incorrect tower?
// TODO: Hemitheos's Fire III (6A18) can be solo'd in some Act 2 uptime strats, not a mistake?
// TODO: Act 2 purple tether not breaking soon enough
// TODO: Act 2 aero tether breaking too soon
// TODO: track who took a 6A0E tower and add a mistake for others if 6A0F happens

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFourthCircleSavage,
  damageWarn: {
    'P4S Acid Pinax': '69D4', // standing on acid square
    'P4S Lava Pinax': '69D5', // standing on fire square
    'P4S Well Pinax': '69D6', // standing on water square
    'P4S Levinstrike Pinax': '69D7', // standing on lightning square
    // The safe squares during Elemental Belone are 69F5 through 69F8.
    'P4S Elemental Belone Acid Pinax': '69F9', // acid square during Elemental Belone
    'P4S Elemental Belone Lava Pinax': '69FA', // fire square during Elemental Belone
    'P4S Elemental Belone Well Pinax': '69FB', // water square during Elemental Belone
    'P4S Elemental Belone Levinstrike Pinax': '69FC', // lightning square during Elemental Belone
    'P4S Shifting Strike': '6A06', // jump to cardinal + cleave
    'P4S Dark Design': '6A2A', // Act 2 baited puddles
    'P4S Hemitheos\'s Fire IV': '6A0D', // Act 1, Act 2, Act 4 boss tether fire explosion
    'P4S Hell\'s Sting 1': '6A20', // curtain call protean
    'P4S Hell\'s Sting 2': '6A21', // curtain call protean
  },
  damageFail: {
    'P4S Hemitheos\'s Thunder III': '6A0F', // missing a 6A0E tower
  },
  shareWarn: {
    'P4S Inversive Chlamys': '69EE', // tethers
    'P4S Acid Mekhane': '69D0', // acid pinax spread
    'P4S Hemitheos\'s Thunder III': '6A0E', // Act 1, Act 2, Act 3, Act 4, Finale towers
    'P4S Hemitheos\'s Water III': '6A14', // Act 4 water tether explosion
  },
  shareFail: {
    'P4S Elegant Evisceration': '6A08', // tank buster
    'P4S Farsight': '6A27', // tank buster
    'P4S Nearsight': '6A28', // tank buster
    // TODO: https://github.com/quisquous/cactbot/pull/4161
    // 'P4S Kothornos Kick': '6A23', // Act 3 jump
    'P4S Kothornos Quake': '6A24', // Act 3 earthshaker
    'P4S Fleeting Impulse': '6A1C', // Finale counted vulns
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
      // 6A10 = Hemitheos's Water IV (Act 3 knockback)
      netRegex: NetRegexes.ability({ id: ['69D2', '6A01', '6A10'] }),
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
