import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export interface Data extends OopsyData {
  hasThrottle?: { [name: string]: boolean };
  jagdTether?: { [sourceId: string]: string };
}

// TODO: FIX luminous aetheroplasm warning not working
// TODO: FIX doll death not working
// TODO: failing hand of pain/parting (check for high damage?)
// TODO: make sure everybody takes exactly one protean (rather than watching double hits)
// TODO: thunder not hitting exactly 2?
// TODO: person with water/thunder debuff dying
// TODO: bad nisi pass
// TODO: failed gavel mechanic
// TODO: double rocket punch not hitting exactly 2? (or tanks)
// TODO: standing in sludge puddles before hidden mine?
// TODO: hidden mine failure?
// TODO: failures of ordained motion / stillness
// TODO: failures of plaint of severity (tethers)
// TODO: failures of plaint of solidarity (shared sentence)
// TODO: ordained capital punishment hitting non-tanks

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
  damageWarn: {
    'TEA Sluice': '49B1',
    'TEA Protean Wave 1': '4824',
    'TEA Protean Wave 2': '49B5',
    'TEA Spin Crusher': '4A72',
    'TEA Sacrament': '485F',
    'TEA Radiant Sacrament': '4886',
    'TEA Almighty Judgment': '4890',
  },
  damageFail: {
    'TEA Hawk Blaster': '4830',
    'TEA Chakram': '4855',
    'TEA Enumeration': '4850',
    'TEA Apocalyptic Ray': '484C',
    'TEA Propeller Wind': '4832',
  },
  shareWarn: {
    'TEA Protean Wave Double 1': '49B6',
    'TEA Protean Wave Double 2': '4825',
    'TEA Fluid Swing': '49B0',
    'TEA Fluid Strike': '49B7',
    'TEA Hidden Mine': '4852',
    'TEA Alpha Sword': '486B',
    'TEA Flarethrower': '486B',
    'TEA Chastening Heat': '4A80',
    'TEA Divine Spear': '4A82',
    'TEA Ordained Punishment': '4891',
    // Optical Spread
    'TEA Individual Reprobation': '488C',
  },
  soloFail: {
    // Optical Stack
    'TEA Collective Reprobation': '488D',
  },
  triggers: [
    {
      // "too much luminous aetheroplasm"
      // When this happens, the target explodes, hitting nearby people
      // but also themselves.
      id: 'TEA Exhaust',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '481F', ...playerDamageFields }),
      condition: (_data, matches) => matches.target === matches.source,
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: 'luminous aetheroplasm',
            de: 'Luminiszentes Ätheroplasma',
            fr: 'Éthéroplasma lumineux',
            ja: '光性爆雷',
            cn: '光性爆雷',
          },
        };
      },
    },
    {
      id: 'TEA Dropsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '121' }),
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'TEA Tether Tracking',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Jagd Doll', id: '0011' }),
      run: (data, matches) => {
        data.jagdTether ??= {};
        data.jagdTether[matches.sourceId] = matches.target;
      },
    },
    {
      id: 'TEA Reducible Complexity',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '4821', ...playerDamageFields }),
      mistake: (data, matches) => {
        return {
          type: 'fail',
          // This may be undefined, which is fine.
          name: data.jagdTether ? data.jagdTether[matches.sourceId] : undefined,
          text: {
            en: 'Doll Death',
            de: 'Puppe Tot',
            fr: 'Poupée morte',
            ja: 'ドールが死んだ',
            cn: '浮士德死亡',
          },
        };
      },
    },
    {
      id: 'TEA Drainage',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '4827', ...playerDamageFields }),
      condition: (data, matches) => !data.party.isTank(matches.target),
      mistake: (_data, matches) => {
        return { type: 'fail', name: matches.target, text: matches.ability };
      },
    },
    {
      id: 'TEA Throttle Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '2BC' }),
      run: (data, matches) => {
        data.hasThrottle ??= {};
        data.hasThrottle[matches.target] = true;
      },
    },
    {
      id: 'TEA Throttle Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '2BC' }),
      run: (data, matches) => {
        data.hasThrottle ??= {};
        data.hasThrottle[matches.target] = false;
      },
    },
    {
      id: 'TEA Throttle',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '2BC' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (data, matches) => {
        if (!data.hasThrottle)
          return;
        if (!data.hasThrottle[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      // Balloon Popping.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'TEA Outburst',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '482A', ...playerDamageFields }),
      suppressSeconds: 5,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.source };
      },
    },
  ],
};

export default triggerSet;
