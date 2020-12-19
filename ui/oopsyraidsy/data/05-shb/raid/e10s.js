import ZoneId from '../../../../../resources/zone_id.js';

// TODO: hitting shadow of the hero with abilities can cause you to take damage, list those?
//       e.g. picking up your first pitch bog puddle will cause you to die to the damage
//       your shadow takes from Deepshadow Nova or Distant Scream.
// TODO: 573B Blighting Blitz issues during limit cut numbers
// TODO: shackle apart/together failures
// TODO: tower (void pulse) failures

export default {
  zoneId: ZoneId.EdensPromiseLitanySavage,
  damageWarn: {
    'E10S Implosion Single 1': '56F2', // single tail up shadow implosion
    'E10S Implosion Single 2': '56EF', // single howl shadow implosion
    'E10S Implosion Quadruple 1': '56EF', // quadruple set of shadow implosions
    'E10S Implosion Quadruple 2': '56F2', // quadruple set of shadow implosions
    'E10S Giga Slash Single 1': '56EC', // Giga slash single from shadow
    'E10S Giga Slash Single 2': '56ED', // Giga slash single from shadow
    'E10S Giga Slash Box 1': '5709', // Giga slash box from four ground shadows
    'E10S Giga Slash Box 2': '570D', // Giga slash box from four ground shadows
    'E10S Giga Slash Quadruple 1': '56EC', // quadruple set of giga slash cleaves
    'E10S Giga Slash Quadruple 2': '56E9', // quadruple set of giga slash cleaves
    'E10S Barbs Of Agony 1': '572A', // Shadow Warrior 4 dog room cleave
    'E10S Barbs Of Agony 2': '5B27', // Shadow Warrior 4 dog room cleave
    'E10S Cloak Of Shadows 1': '5B13', // initial non-squiggly line explosions
    'E10S Cloak Of Shadows 2': '5B14', // second squiggly line explosions
    'E10S Throne Of Shadow': '5717', // standing up get out
    'E10S Shadowy Eruption': '5738', // baited ground aoe during amplifier
  },
  damageFail: {
    'E10S Swath Of Silence 1': '571A', // Shadow clone cleave (too close)
    'E10S Swath Of Silence 2': '5BBF', // Shadow clone cleave (timed)
  },
  shareWarn: {
    'E10S Shadefire': '5732', // purple tank umbral orbs
    'E10S Pitch Bog': '5722', // marker spread that drops a shadow puddle
  },
  shareFail: {
    'E10S Shadow\'s Edge': '5725', // Tankbuster single target followup
  },
};
