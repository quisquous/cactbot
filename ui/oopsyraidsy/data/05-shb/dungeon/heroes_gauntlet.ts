import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// TODO: Berserker 2nd/3rd wild anguish should be shared with just a rock

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheHeroesGauntlet,
  damageWarn: {
    'THG Blade\'s Benison': '5228', // pld conal
    'THG Absolute Holy': '524B', // whm very large aoe
    'THG Hissatsu: Goka': '523D', // sam line aoe
    'THG Whole Self': '522D', // mnk wide line aoe
    'THG Randgrith': '5232', // drg very big line aoe
    'THG Vacuum Blade 1': '5061', // Spectral Thief circular ground aoe from marker
    'THG Vacuum Blade 2': '5062', // Spectral Thief circular ground aoe from marker
    'THG Coward\'s Cunning': '4FD7', // Spectral Thief Chicken Knife laser
    'THG Papercutter 1': '4FD1', // Spectral Thief line aoe from marker
    'THG Papercutter 2': '4FD2', // Spectral Thief line aoe from marker
    'THG Ring of Death': '5236', // drg circular aoe
    'THG Lunar Eclipse': '5227', // pld circular aoe
    'THG Absolute Gravity': '5248', // ink mage circular
    'THG Rain of Light': '5242', // bard large circule aoe
    'THG Dooming Force': '5239', // drg line aoe
    'THG Absolute Dark II': '4F61', // Necromancer 120 degree conal
    'THG Burst': '53B7', // Necromancer necroburst small zombie explosion
    'THG Pain Mire': '4FA4', // Necromancer very large green bleed puddle
    'THG Dark Deluge': '4F5D', // Necromancer ground aoe
    'THG Tekka Gojin': '523E', // sam 90 degree conal
    'THG Raging Slice 1': '520A', // Berserker line cleave
    'THG Raging Slice 2': '520B', // Berserker line cleave
    'THG Wild Rage': '5203', // Berserker blue knockback puck
  },
  gainsEffectWarn: {
    'THG Bleeding': '828', // Standing in the Necromancer puddle or outside the Berserker arena
  },
  gainsEffectFail: {
    'THG Truly Berserk': '906', // Standing in the crater too long
  },
  shareWarn: {
    'THG Absolute Thunder IV': '5245', // headmarker aoe from blm
    'THG Moondiver': '5233', // headmarker aoe from drg
    'THG Spectral Gust': '53CF', // Spectral Thief headmarker aoe
  },
  shareFail: {
    'THG Falling Rock': '5205', // Berserker headmarker aoe that creates rubble
  },
  soloWarn: {
    // This should always be shared.  On all times but the 2nd and 3rd, it's a party share.
    // TODO: on the 2nd and 3rd time this should only be shared with a rock.
    // TODO: alternatively warn on taking one of these with a 472 Magic Vulnerability Up effect
    'THG Wild Anguish': '5209',
  },
  triggers: [
    {
      id: 'THG Wild Rampage',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '5207', ...playerDamageFields }),
      // This is zero damage if you are in the crater.
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
