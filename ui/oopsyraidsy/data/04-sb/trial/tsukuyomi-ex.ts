import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Taking multiple role-based Steel of the Underworld (2BBF) hits.

export type Data = OopsyData;

// Tsukuyomi Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladTsukuyomisPain,
  damageWarn: {
    'TsukuyomiEx Moonlight Lunar Halo': '2BD6', // donut from orbs in final phase
    'TsukuyomiEx Moonfall': '2BD1', // meteor drop big circles
    'TsukuyomiEx Moondust Crater': '2CD7', // meteor explosions later
    'TsukuyomiEx Dancing Fan Tsukui-No-Maiogi': '2BC6', // fan circle aoe
    'TsukuyomiEx Waxing Grudge': '2BDE', // melee range circle from Full Moon buff
    'TsukuyomiEx Waning Grudge': '2BDF', // donut from New Moon Buff
    'TsukuyomiEx Dark Blade': '2BDA', // right-side cleave
    'TsukuyomiEx Bright Blade': '2BDB', // left side cleave
  },
  shareFail: {
    'TsukuyomiEx Torment Unto Death': '2BBB', // tank buster conal cleave
  },
  soloWarn: {
    'TsukuyomiEx Lead Of The Underworld': '2BBE', // "Beg for Mercy!" stack
    'TsukuyomiEx Lunacy': '2BDD', // 4x stack marker
  },
  triggers: [
    {
      id: 'TsukuyomiEx Moonlit',
      type: 'GainsEffect',
      // Five stacks of Moonlit or Moonshadowed is instant death.
      netRegex: NetRegexes.gainsEffect({ effectId: '602', count: '05' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      id: 'TsukuyomiEx Moonshadowed',
      type: 'GainsEffect',
      // Five stacks of Moonlit or Moonshadowed is instant death.
      netRegex: NetRegexes.gainsEffect({ effectId: '603', count: '05' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
