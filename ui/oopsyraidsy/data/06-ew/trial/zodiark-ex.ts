import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  damageWarn: {
    'ZodiarkEx Quetzalcoatl Keraunos Eidolon': '67E1', // bird donut
    'ZodiarkEx Behemoth Meteoros Eidolon': '67E2', // behemoth circle
    'ZodiarkEx Python Opheos Eidolon': '67E3', // python line
    'ZodiarkEx Infernal Stream 1': '52D1', // initial fire wall
    'ZodiarkEx Infernal Stream 2': '67E0', // rotating fire wall
    'ZodiarkEx Esoteric Ray': '67E4', // laser wall summon
    'ZodiarkEx Esoteric Dyad': '67E5', // half arena wall summon
    'ZodiarkEx Esoteric Sect': '67E6', // conal wall summon
    'ZodiarkEx Algedon': '67EE', // untelegraphed diagonal knockback
    'ZodiarkEx Adikia 1': '63A9', // two hit east west circles
    'ZodiarkEx Adikia 2': '67F2', // two hit east west circles
  },
  damageFail: {
    'ZodiarkEx Explosion': '67E7', // Astral Eclipse explosions
  },
  shareFail: {
    'ZodiarkEx Ania': '6B63', // tank buster splash with headmarker
  },
  triggers: [
    {
      id: 'ZodiarkEx Algedon Push',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '67EE', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
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
