import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { GetShareMistakeText } from '../../../oopsy_common';

// TODO: differentiate whose Searing Radiance 82F1 / Shadowsear 82F2 tether it was
// TODO: differentiate who had the Astral/Umbral glow tower debuff
// TODO: taking Umbral Advance 830E / Astral Advance 830F with wrong/no debuff
// TODO: not taking a tower when you should
// TODO: taking both Umbral Impact 8308 and Astral Impact 8309
// TODO: taking the wrong Umbral/Astral Impact with your debuff
// TODO: not being hit by Astral/Umbral Impact when you should
// TODO: taking two Superchain Radiation 82DF or two Superchain Emission 82DE
// TODO: non-tanks in Apodialogos 8300 / Peridialogos 8301
// TODO: missing Shock 8312 when you should be in that tower?
// TODO: something with Palladion 82F6 / Shockwave 82F7?
// TODO: standing in the hexagon during add phase?

// TODO: not breaking chains (before Missing Link??)
// TODO: >2 people in Pyre Pulse 833A or Superchain Emission 82DE
// TODO: taking wrong Pangenesis towers
// TODO: not merging with the right people in Pangenesis
// TODO: people still having unstable factor and causing Ex-Factor failure
// TODO: which people were missing from Pangenesis towers that should have been there?
// TODO: taking Factor In 8347 slime damage with the wrong debuff
// TODO: taking too many Factor In 8347 slime tethers
// TODO: not having a buddy block the Ultima Blow 8348 laser
// TODO: moving too far before final Caloric 1 stacks
// TODO: exploding due to too many Caloric stacks

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
  damageWarn: {
    'P12S Trinity of Souls 1': '82E1', // top right first wing
    'P12S Trinity of Souls 2': '82E2', // top left first wing
    'P12S Trinity of Souls 3': '82E3', // middle right second wing (top down)
    'P12S Trinity of Souls 4': '82E4', // middle left second wing (top down)
    'P12S Trinity of Souls 5': '82E5', // bottom right third wing
    'P12S Trinity of Souls 6': '82E6', // bottom right third wing
    'P12S Trinity of Souls 7': '82E7', // bottom right first wing
    'P12S Trinity of Souls 8': '82E8', // bottom left first wing
    'P12S Trinity of Souls 9': '82E9', // middle right second wing (bottom up)
    'P12S Trinity of Souls 10': '82EA', // middle left second wing (bottom up)
    'P12S Trinity of Souls 11': '82EB', // top right third wing
    'P12S Trinity of Souls 12': '82EC', // top left third wing
    'P12S Ray of Light': '82EE', // Antropos beam
    'P12S Superchain Burst': '82DB', // "get out" sphere
    'P12S Superchain Coil': '82DC', // "get in" donut
    'P12S Theos\'s Cross': '830A', // cross ground explosion
    'P12S Theos\'s Saltire': '830B', // rotated cross ground explosion
    'P12S Clear Cut': '82FB', // 3/4 pizza ground aoe instead of White Flame
    'P12S Palladion Floor Drop': '82F9', // floor drop after "add phase"
    'P12S Parthenos': '8303', // forward line aoe during Superchain Theory IIB

    'P12S Ultima Ray': '8330', // laser during Gaiaochos
    'P12S Demi Parhelion': '832C', // fire damage during Geocentrism
    'P12S Implode': '8333', // ground circles during Classical Concepts
    'P12S Palladian Ray Ongoing': '8325', // avoidable followup proteans
    'P12S Ekpyrosis Exaflare': '8320', // exaflares
    'P12S Entropic Excess': '833C', // ground circles during Caloric Theory 2
  },
  damageFail: {
    'P12S Sample': '82E0', // platform being eaten by Unnatural Enchainment

    'P12S Tilted Balance': '8335', // failing tether distance during Classical Concepts
  },
  gainsEffectWarn: {
    'P12S Bleeding': 'B87', // standing in a Palladion puddle
  },
  shareWarn: {
    'P12S Searing Radiance': '82F1', // light tether
    'P12S Shadowsear': '82F2', // dark tether
    'P12S Theos\'s Holy': '8306', // spread damage in Superchain I

    'P12S Divine Excoriation': '832E', // spread damage during Geocentrism
    'P12S Palladian Ray Initial': '8324', // initial protean
    'P12S Ekpyrosis Spread': '8322', // spread during exaflares
  },
  shareFail: {
    'P12S Superchain Radiation': '82DF', // protean spread
    'P12S Umbral Glow': '830C', // placing a light tower
    'P12S Astral Glow': '830D', // placing a dark tower
    'P12S Shock': '8312', // unaspected towers

    'P12S Palladian Grasp 1': '831C', // west half cleave
    'P12S Palladian Grasp 2': '831D', // east half cleave
    'P12S Dynamic Atmosphere': '833B', // wind explosion
    'P12S Caloric Theory 2': '8792', // initial Caloric Theory 2 wind spread
  },
  soloFail: {
    'P12S Superchain Emission': '82DE', // partner 2x stack
    'P12S Pyre Pulse': '833A', // partner 2x stack
  },
  triggers: [
    {
      id: 'P12S White Flame Share',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '82F0' }),
      condition: (data, matches) => !data.IsImmune(matches.targetId),
      mistake: (_data, matches) => {
        const numTargets = parseInt(matches.targetCount);
        if (numTargets === 1 || isNaN(numTargets))
          return;
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: GetShareMistakeText(matches.ability, numTargets),
        };
      },
    },
    {
      id: 'P12S Close Caloric Count',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'E05', count: '05' }),
      suppressSeconds: 10,
      mistake: (_data, matches) => {
        return {
          type: 'wipe',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
