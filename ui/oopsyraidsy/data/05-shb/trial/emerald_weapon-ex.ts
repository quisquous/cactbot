import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  sphereNitro?: { [name: string]: boolean };
  sphereCeruleum?: { [name: string]: boolean };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.CastrumMarinumExtreme,
  damageWarn: {
    'EmeraldEx Heat Ray': '5BD3', // Emerald Beam initial conal
    'EmeraldEx Photon Laser 1': '557B', // Emerald Beam inside circle
    'EmeraldEx Photon Laser 2': '557D', // Emerald Beam outside circle
    'EmeraldEx Heat Ray 1': '557A', // Emerald Beam rotating pulsing laser
    'EmeraldEx Heat Ray 2': '5579', // Emerald Beam rotating pulsing laser
    'EmeraldEx Explosion': '5596', // Magitek Mine explosion
    'EmeraldEx Tertius Terminus Est Initial': '55CD', // sword initial puddles
    'EmeraldEx Tertius Terminus Est Explosion': '55CE', // sword explosions
    'EmeraldEx Airborne Explosion': '55BD', // exaflare
    'EmeraldEx Sidescathe 1': '55D4', // left/right cleave
    'EmeraldEx Sidescathe 2': '55D5', // left/right cleave
    'EmeraldEx Shots Fired': '55B7', // rank and file soldiers
    'EmeraldEx Secundus Terminus Est': '55CB', // dropped + and x headmarkers
    'EmeraldEx Expire': '55D1', // ground aoe on boss "get out"
    'EmeraldEx Photon Ring': '55A9', // untelegraphed "get out"
    'EmeraldEx Aire Tam Storm': '55D0', // expanding red and black ground aoe
  },
  shareWarn: {
    'EmeraldEx Divide Et Impera': '55D9', // non-tank protean spread
    'EmeraldEx Primus Terminus Est 1': '55C4', // knockback arrow
    'EmeraldEx Primus Terminus Est 2': '55C5', // knockback arrow
    'EmeraldEx Primus Terminus Est 3': '55C6', // knockback arrow
    'EmeraldEx Primus Terminus Est 4': '55C7', // knockback arrow
  },
  soloWarn: {
    'EmeraldEx Nitrosphere Aetheroplasm': '55AE',
    'EmeraldEx Ceruleum Sphere Aetheroplasm': '55AF',
  },
  triggers: [
    {
      id: 'EmeraldEx Nitrosphere Physical Vulnerability Up Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '82A' }),
      run: (data, matches) => {
        data.sphereNitro = data.sphereNitro ?? {};
        data.sphereNitro[matches.target] = true;
      },
    },
    {
      id: 'EmeraldEx Nitrosphere Physical Vulnerability Up Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '82A' }),
      run: (data, matches) => {
        // Need to track loss here for the 4/4 strategy.
        data.sphereNitro = data.sphereNitro ?? {};
        data.sphereNitro[matches.target] = false;
      },
    },
    {
      id: 'EmeraldEx Ceruleum Sphere Magic Vulnerability Up Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '82B' }),
      type: 'GainsEffect',
      run: (data, matches) => {
        data.sphereCeruleum = data.sphereCeruleum ?? {};
        data.sphereCeruleum[matches.target] = true;
      },
    },
    {
      id: 'EmeraldEx Ceruleum Sphere Magic Vulnerability Up Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '82B' }),
      run: (data, matches) => {
        data.sphereCeruleum = data.sphereCeruleum ?? {};
        data.sphereCeruleum[matches.target] = false;
      },
    },
    {
      id: 'EmeraldEx Nitrosphere Twice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '55AE' }),
      condition: (data, matches) => data.sphereNitro?.[matches.target],
      mistake: (data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: `${matches.ability} (wrong color)`,
            de: `${matches.ability} (falsche Farbe)`,
            fr: `${matches.ability} (mauvaise couleur)`,
            ja: `${matches.ability} (色違う)`,
            cn: `${matches.ability} (颜色错了)`,
            ko: `${matches.ability} (색 틀림)`,
          },
        };
      },
    },
    {
      id: 'EmeraldEx Ceruleum Sphere Twice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '55AF' }),
      condition: (data, matches) => data.sphereCeruleum?.[matches.target],
      mistake: (data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: `${matches.ability} (wrong color)`,
            de: `${matches.ability} (falsche Farbe)`,
            fr: `${matches.ability} (mauvaise couleur)`,
            ja: `${matches.ability} (色違う)`,
            cn: `${matches.ability} (颜色错了)`,
            ko: `${matches.ability} (색 틀림)`,
          },
        };
      },
    },
  ],
};

export default triggerSet;
