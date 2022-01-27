import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheDarkInside,
  damageWarn: {
    'Zodiark Esoteric Sect': '67CC', // conal wall summon
    'Zodiark Esoteric Dyad': '67CB', // half arena wall summon
    'Zodiark Behemoth Meteoros Eidolon': '67C6', // large circles from Behemoth summons
    'Zodiark Python Opheos Eidolon': '67C7', // lines from Python summons
    'Zodiark Phlegothon': '67CE', // targeted circles
    'Zodiark Esoteric Ray': '67CA', // 1+2 lasers
    'Zodiark Adikia 1': '63A8', // very large circles that create N/S safe zones
    'Zodiark Adikia 2': '67D9', // very large circles that create N/S safe zones
    'Zodiark Algedon': '67D3', // move to corner large knockback attack
    'Zodiark Explosion': '67CD', // Astral Eclipse explosions
  },
  shareFail: {
    'Zodiark Ania': '6B62', // tank buster splash with headmarker
  },
  soloWarn: {
    'Zodiark Styx': '67DC', // multi-hit stack marker
  },
  triggers: [
    {
      id: 'Zodiark Algedon Push',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '67D3', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'Repoussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
            ko: '넉백됨',
          },
        };
      },
    },
  ],
};

export default triggerSet;
