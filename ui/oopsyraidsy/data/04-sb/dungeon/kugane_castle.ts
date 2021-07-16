import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.KuganeCastle,
  damageWarn: {
    'Kugane Castle Tenka Gokken': '2329', // Frontal cone AoE,  Joi Blade trash, before boss 1
    'Kugane Castle Kenki Release Trash': '2330', // Chariot AoE, Joi Kiyofusa trash, before boss 1

    'Kugane Castle Clearout': '1E92', // Frontal cone AoE, Zuiko-Maru, boss 1
    'Kugane Castle Hara-Kiri 1': '1E96', // Giant circle AoE, Harakiri Kosho, boss 1
    'Kugane Castle Hara-Kiri 2': '24F9', // Giant circle AoE, Harakiri Kosho, boss 1

    'Kugane Castle Juji Shuriken 1': '232D', // Line AoE, Karakuri Onmitsu trash, before boss 2
    'Kugane Castle 1000 Barbs': '2198', // Line AoE, Joi Koja trash, before boss 2

    'Kugane Castle Juji Shuriken 2': '1E98', // Line AoE, Dojun Maru, boss 2
    'Kugane Castle Tatami-Gaeshi': '1E9D', // Floor tile line attack, Elkite Onmitsu, boss 2
    'Kugane Castle Juji Shuriken 3': '1EA0', // Line AoE, Elite Onmitsu, boss 2

    'Kugane Castle Auto Crossbow': '2333', // Frontal cone AoE, Karakuri Hanya trash, after boss 2
    'Kugane Castle Harakiri 3': '23C9', // Giant Circle AoE, Harakiri  Hanya trash, after boss 2

    'Kugane Castle Iai-Giri': '1EA2', // Chariot AoE, Yojimbo, boss 3
    'Kugane Castle Fragility': '1EAA', // Chariot AoE, Inoshikacho, boss 3
    'Kugane Castle Dragonfire': '1EAB', // Line AoE, Dragon Head, boss 3
  },

  shareWarn: {
    'Kugane Castle Issen': '1E97', // Instant frontal cleave, Dojun Maru, boss 2
    'Kugane Castle Clockwork Raiton': '1E9B', // Large lightning spread circles, Dojun Maru, boss 2
  },
  triggers: [
    {
      // Stack marker, Zuiko Maru, boss 1
      id: 'Kugane Castle Helm Crack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1E94' }),
      condition: (_data, matches) => matches.type === '21', // Taking the stack solo is *probably* a mistake.
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
  ],
};

export default triggerSet;
