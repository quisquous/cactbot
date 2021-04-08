import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import Util from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';

// TODO: we could consider a timeline trigger for the Tidal Roar raidwide,
// but it barely does 25% health, has no startsUsing, and the timeline for
// this fight is not reliable enough to use.

// TODO: we could consider doing some getCombatants shenanigans to call
// out which side to run to for all of the dives.

export default {
  zoneId: ZoneId.TheWhorleaterExtreme,
  timelineFile: 'levi-ex.txt',
  triggers: [
    {
      id: 'LeviEx Veil of the Whorl',
      netRegex: NetRegexes.ability({ source: 'Leviathan', id: '875', capture: false }),
      condition: (data) => Util.isCasterDpsJob(data.job) || Util.isHealerJob(data.job),
      suppressSeconds: 9999,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Tail Only',
        },
      },
    },
    {
      id: 'LeviEx Mantle of the Whorl',
      netRegex: NetRegexes.ability({ source: 'Leviathan\'s Tail', id: '874', capture: false }),
      condition: (data) => Util.isRangedDpsJob(data.job),
      suppressSeconds: 9999,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Head Only',
        },
      },
    },
    {
      id: 'LeviEx Dreadwash',
      netRegex: NetRegexes.startsUsing({ source: 'Wavetooth Sahagin', id: '749' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun('alarm'),
    },
    {
      id: 'LeviEx Elemental Converter',
      netRegex: NetRegexes.nameToggle({ name: 'Elemental Converter' }),
      run: (data, matches) => data.converter = !!parseInt(matches.toggle),
    },
    {
      id: 'LeviEx Hit The Button',
      netRegex: NetRegexes.nameToggle({ name: 'Leviathan', toggle: '00', capture: false }),
      // The best way to know if it's time to hit the button is if the converter is ready.
      // I think this is not true for hard mode, but is true (fingers crossed) for extreme.
      condition: (data) => data.converter,
      // Some delay for safety, as the button can be hit too early.
      delaySeconds: 3.5,
      suppressSeconds: 30,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hit The Button!',
        },
      },
    },
  ],
};
