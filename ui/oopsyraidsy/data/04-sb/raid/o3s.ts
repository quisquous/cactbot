import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// TODO: handle Ribbit (22F7), Oink (22F9, if damage), Squelch (22F8, if damage)
//       which is an error except during the second game

// O3S - Deltascape 3.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV30Savage,
  damageWarn: {
    'O3S Spellblade Fire III': '22EC', // donut
    'O3S Spellblade Thunder III': '22EE', // line
    'O3S Spellblade Blizzard III': '22ED', // circle
    'O3S Uplift': '230D', // not standing on blue square
    'O3S Soul Reaper Gusting Gouge': '22FF', // reaper line aoe during cave phase
    'O3S Soul Reaper Cross Reaper': '22FD', // middle reaper circle
    'O3S Soul Reaper Stench of Death': '22FE', // outside reapers (during final phase)
    'O3S Apanda Magic Hammer': '2315', // books phase magic hammer circle
    'O3S Briar Thorn': '2309', // not breaking tethers fast enough
  },
  shareWarn: {
    'O3S Holy Edge': '22F0', // Spellblade Holy spread
    'O3S Sword Dance': '2307', // protean wave
    'O3S Great Dragon Frost Breath': '2312', // tank cleave from Great Dragon
    'O3S Iron Giant Grand Sword': '2316', // tank cleave from Iron Giant
  },
  shareFail: {
    'O3S Folio': '230F', // books books books
  },
  soloWarn: {
    'O3S Holy Blur': '22F1', // Spellblade Holy stack
  },
  triggers: [
    {
      // Everybody gets hits by this, but it's only a failure if it does damage.
      id: 'O3S The Game',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '2301', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
