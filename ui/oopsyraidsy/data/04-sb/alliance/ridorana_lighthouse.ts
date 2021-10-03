import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Note: Ignoring Famfrit Jet (2C54) which is the water jug hit.  It's low damage and frequent.
// Note: Ignoring the Famfrit Dark Rain Explosion (2C55), since adds are often not killed.
// Note: Ignoring Famfrit Dropsy (121) as those puddles can appear on you, and it drops when out.
// Note: Ignoring Belias tethers, because not sure what should be considered an error there.
// Note: Ignoring Yiazmat Turbulence (2C30), which is like Jet and very noisy.

// TODO: Dark Cannonade (2C44) is a dorito stack, but you take damage on success and failure.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheRidoranaLighthouse,
  damageWarn: {
    'Ridorana Famfrit Tsunami 1': '2C51', // untelegraphed 90 degree conal from jug
    'Ridorana Famfrit Tsunami 2': '2C52', // untelegraphed 90 degree conal from jug
    'Ridorana Famfrit Dark Rain': '2C46', // targeted medium size circles
    'Ridorana Famfrit Darkening Deluge': '2C54', // rain puddles after Darkening Rainfull
    'Ridorana Bune Tri-Attack': '2CED', // conal
    'Ridorana Bune Pulsar Wave': '2CEE', // targeted circle
    'Ridorana Belias Time Eruption': '2CDF', // exploding clock
    'Ridorana Belias Crimson Cyclone 1': '2CE2', // clone dash
    'Ridorana Belias Crimson Cyclone 2': '2CE3', // clone dash
    'Ridorana Belias Crimson Cyclone 3': '2CE4', // clone dash
    'Ridorana Belias Crimson Cyclone 4': '2D5F', // clone dash
    'Ridorana Belias Eruption': '2CDD', // series of targeted circles
    'Ridorana Belias Time Bomb': '2CE7', // stoppable clock with time conal attack
    'Ridorana Construct Pulverize Close': '2C61', // untelegraphed centered circle close
    'Ridorana Construct Pulverize Far': '2C62', // targeted telegraphed circles far away
    'Ridorana Construct Compress': '2C5C', // long skinny line
    'Ridorana Construct Loose Cog Triboelectricity': '2C6D', // blue circle from cogs in air
    'Ridorana Construct Dispose': '2C60', // rotating fire conal
    'Ridorana Construct Dispose Annihilation': '2CEA', // rotating fire conal, Annihilation Mode
    'Ridorana Construct Acceleration Bomb': '2D27', // failing acceleration bomb in midphase
    'Ridorana Construct Ultramagnetism': '2CD6', // failing magnetic tethers in midphase
    'Ridorana Construct Missile Explosion': '2C6F', // running into a missile in midphase
    'Ridorana Yiazmat Gust Front': '2C24', // targeted black/yellow circles
    'Ridorana Yiazmat White Breath': '2C31', // get under donut
    'Ridorana Yiazmat Rake Charge 1': '2C3C', // like a knife through butter
    'Ridorana Yiazmat Rake Charge 2': '2E32',
    'Ridorana Yiazmat Rake Charge 3': '2C28',
    'Ridorana Yiazmat Rake Charge 4': '2D4F',
    'Ridorana Yiazmat Rake Charge 5': '2C27',
    'Ridorana Yiazmat Archaeodemon Unholy Darkness': '2673', // targeted circle
    'Ridorana Yiazmat Archaeodemon Karma': '2672', // conal
  },
  damageFail: {
    'Ridorana Yiazmat Stone Breath': '2C29', // petrifying conal breath
  },
  shareWarn: {
    'Ridorana Famfrit Briny Cannonade': '2C45', // spread marker
    'Ridorana Construct Ignite': '2C67', // spread marker
    'Ridorana Iron Golem Ovation': '2CF3', // untelegraphed instant line attack (for tank, ideally)
    'Ridorana Yiazmat Wind Azer Ancient Aero': '2C38', // targeted tether line aoe from Azer adds
  },
  shareFail: {
    'Ridorana Yiazmat Rake Buster 1': '2C26', // untelegraphed tankbuster cleave
    'Ridorana Yiazmat Rake Buster 2': '2DE4', // untelegraphed tankbuster cleave
  },
  soloFail: {
    'Ridorana Construct Accelerate': '2C65', // stack marker
    'Ridorana Yiazmat Death Strike': '2C33', // stack marker
  },
  triggers: [
    {
      // Computation Mode errors.
      id: 'Ridorana Construct Maths',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0089' }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: `Maths`,
          },
        };
      },
    },
  ],
};

export default triggerSet;
