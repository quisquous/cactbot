import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: 3+ people in Abyssal Quasar 84AB or Void Aero III 84BC
// TODO: somebody not taking Eventide Fall 86B4
// TODO: somebody taking two Eventide Fall 86B4 or Eventide Triad 86B2
// TODO: somebody taking two Immolating Shade 8496
// TODO: somebody taking two Void Tornado 845D
// TODO: figuring out who missed a tower
// TODO: being in a tower with a flare marker

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheVoidcastDaisExtreme,
  damageWarn: {
    'GolbezEx Terrastorm': '8466', // pair of purple summoned meteors that leave big circles
    'GolbezEx Lingering Spark': '846A', // baited puddles
    'GolbezEx Phases of the Blade 1': '86DB', // forward 180 cleave
    'GolbezEx Phases of the Blade 2': '86F2', // backwards 180 cleave
    'GolbezEx Arctic Assault': '8461', // ice walls hitting quadrants
    'GolbezEx Gale Sphere 1': '8458', // wind orb line aoes
    'GolbezEx Gale Sphere 2': '8459', // wind orb line aoes
    'GolbezEx Gale Sphere 3': '845A', // wind orb line aoes
    'GolbezEx Gale Sphere 4': '845B', // wind orb line aoes
    'GolbezEx Phases of the Shadow 1': '86E7', // forward 180 cleave
    'GolbezEx Phases of the Shadow 2': '86EF', // backwards 180 cleave
    'GolbezEx Rising Beacon': '86EC', // "get out" during Phases of the Shadow
    'GolbezEx Rising Ring': '86ED', // "get in" during Phases of the Shadow
  },
  damageFail: {
    'GolbezEx Void Stardust': '84AA', // exaflares (will kill somebody during Abyssal Quasar after)
    'GolbezEx Massive Explosion': '84A0', // failing towers
  },
  shareWarn: {
    'GolbezEx Void Comet': '84B0', // mini tank busters
    'GolbezEx Cauterize': '84A2', // wide line aoe on healer with knockback during Double Meteor
  },
  shareFail: {
    'GolbezEx Void Meteor': '84B1', // large tank busters
    'GolbezEx Burning Shade': '8494', // spread during Phases of the Shadow
  },
  soloFail: {
    'GolbezEx Abyssal Quasar': '84AB', // partner circles
    'GolbezEx Void Aero III': '845C', // partner circles
    'GolbezEx Eventide Fall': '86B4', // healer line stacks
    'GolbezEx Void Tornado': '845D', // healer circle stacks
  },
  triggers: [
    {
      id: 'GolbezEx Flames of Eventide Fatal',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'DF5', count: '03' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      id: 'GolbezEx Dragon\'s Descent',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8498' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
