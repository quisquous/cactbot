import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Tsukuyomi Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.CastrumFluminis,
  damageWarn: {
    'Tsukuyomi Steel Of The Underworld': '2BE7', // large targeted telegraph cleave during fans
    'Tsukuyomi Midnight Haze To Ashes': '2BEA', // not killing clouds in time
    'Tsukuyomi Dancing Fan Tsuki-No-Maiogi': '2BED', // fan circle aoe
    'Tsukuyomi Moonlight Lunar Halo': '2BE4', // donut from orbs during selenomancy
    'Tsukuyomi Dark Blade': '2BF9', // right-side cleave
    'Tsukuyomi Bright Blade': '2BFA', // left side cleave
  },
  shareFail: {
    'Tsukuyomi Torment Unto Death': '2BE3', // tank buster conal cleave
  },
  soloWarn: {
    'Tsukuyomi Lead Of The Underworld': '2BE6', // line stack marker
    'Tsukuyomi Lunacy 1': '2BFB', // 3-4x stack marker
    'Tsukuyomi Lunacy 2': '2BFC', // 3-4x stack marker
  },
  triggers: [
    {
      id: 'Tsukuyomi Moonlit',
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
      id: 'Tsukuyomi Moonshadowed',
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
