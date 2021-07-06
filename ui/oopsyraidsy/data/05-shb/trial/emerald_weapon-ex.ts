import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: SimpleOopsyTriggerSet = {
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
    'EmeraldEx Aire Tam Storm': '55D0', // expanding red and black ground aoe
  },
  shareWarn: {
    'EmeraldEx Divide Et Impera': '55D9', // non-tank protean spread
    'EmeraldEx Primus Terminus Est 1': '55C4', // knockback arrow
    'EmeraldEx Primus Terminus Est 2': '55C5', // knockback arrow
    'EmeraldEx Primus Terminus Est 3': '55C6', // knockback arrow
    'EmeraldEx Primus Terminus Est 4': '55C7', // knockback arrow
  },
};

export default triggerSet;
