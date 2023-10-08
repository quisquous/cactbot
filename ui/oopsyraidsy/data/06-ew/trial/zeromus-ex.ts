import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: people not in 8B3B Sable Thread line stack
// TODO: people not in 8B60 Flare tower
// TODO: people not taking 8B58 and failing meteors(???)
// TODO: instant death on enumerations / meteor tethers not stretched
// TODO: try to assign blame for Forked Lightning
// TODO: having a Forked Lightning/tank debuff and being in The Dark Beckons stack
// TODO: not being in The Dark Beckons stack when you don't have a tank/lightning debuff
// TODO: black hole death
// TODO: people missing from Umbral Rays stack
// TODO: people missing / extra people in Umbral Prism enumerations

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheAbyssalFractureExtreme,
  damageWarn: {
    'ZeromusEx Abyssal Echoes': '8B42', // big lit up glowing circles from lines on floor
    'ZeromusEx Nox 1': '8D2A', // initial orb circle damage
    'ZeromusEx Nox 2': '8D24', // chasing orb damage
    'ZeromusEx Scald': '8BB6', // standing too long in flare tower before Flare/Prominence Spine
    'ZeromusEx Flare': '8B62', // standing in post-tower meteor circle
    'ZeromusEx Prominence Spine': '8B63', // line aoes from post-tower meteor circle
    'ZeromusEx Visceral Whirl 1': '8B44', // claw swipe damage from NE/SW safe
    'ZeromusEx Visceral Whirl 2': '8B45', // claw swipe damage from NE/SW safe
    'ZeromusEx Visceral Whirl 3': '8B47', // claw swipe damage from NW/SE safe
    'ZeromusEx Visceral Whirl 4': '8B48', // claw swipe damage from NW/SE safe
    'ZeromusEx Big Bang': '8B4E', // ground circles during Big Bang cast
    'ZeromusEx Fractured Eventide 1': '8B3E', // initial damage from Eventide line
    'ZeromusEx Fractured Eventide 2': '8BB2', // ongoing damage from Eventide line
    'ZeromusEx Big Crunch': '8D31', // ground circles during Big Crunch cast
    'ZeromusEx Dimension Surge': '8B7E', // ground circle damage after Rend the Rift
    'ZeromusEx Dimension Surge Line': '8B82', // large white line cleave from wall
    'ZeromusEx Akh Rhai': '8B75', // ongoing Akh Rhai damage
    'ZeromusEx Chasmic Nails 1': '8B79', // first damage
    'ZeromusEx Chasmic Nails 2': '8B7A', // second damage
    'ZeromusEx Chasmic Nails 3': '8B7B', // third damage
    'ZeromusEx Chasmic Nails 4': '8B7C', // fourth damage
    'ZeromusEx Chasmic Nails 5': '8B7D', // fifth damage
  },
  damageFail: {
    'ZeromusEx The Dark Binds': '8B55', // tether damage
    'ZeromusEx Toxic Bubble Burst': '8B67', // hitting a Void Bio bubble
    'ZeromusEx Forked Lightning': '8B54', // forked lightning debuff, TODO: try to determine source
  },
  shareWarn: {
    'ZeromusEx Big Bang Spread': '8BDE', // spread during Big Bang
    'ZeromusEx The Dark Divides': '8B52', // spread debuff after Big Bang
    'ZeromusEx Big Crunch Spread': '8D32', // spread during Big Crunch
  },
  shareFail: {
    'ZeromusEx Dark Matter': '8B84', // tankbuster
  },
  soloFail: {
    'ZeromusEx The Dark Beckons': '8D3A', // stack debuff after Big Bang
    'ZeromusEx Umbral Prism': '8B77', // enumerations
  },
  triggers: [
    {
      id: 'ZeromusEx Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '6E9' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
