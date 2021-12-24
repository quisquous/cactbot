import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Mousse Princess Banish tankbuster
// TODO: Mousse Princess Flail centered aoe

export interface Data extends RaidbossData {
  wickedWhim?: boolean;
}

const underThenOut = {
  en: 'Under => Out',
};
const outStayOut = {
  en: 'Out => Stay Out',
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MareLamentorum,
  triggers: [
    {
      id: 'Hunt Lunatender Queen Away With You',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender Queen', capture: false }),
      alertText: (data, _matches, output) => data.wickedWhim ? output.under!() : output.out!(),
      run: (data) => delete data.wickedWhim,
      outputStrings: {
        under: underThenOut,
        out: outStayOut,
      },
    },
    {
      id: 'Hunt Lunatender Queen You May Approach',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender Queen', capture: false }),
      alertText: (data, _matches, output) => data.wickedWhim ? output.out!() : output.under!(),
      run: (data) => delete data.wickedWhim,
      outputStrings: {
        under: underThenOut,
        out: outStayOut,
      },
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender Queen', capture: false }),
      alertText: (data, _matches, output) => data.wickedWhim ? output.lookTowards!() : output.lookAway!(),
      run: (data) => delete data.wickedWhim,
      outputStrings: {
        lookTowards: Outputs.lookTowardsBoss,
        lookAway: Outputs.lookAway,
      },
    },
    {
      id: 'Hunt Lunatender Queen Wicked Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE7', source: 'Lunatender Queen', capture: false }),
      run: (data) => data.wickedWhim = true,
    },
    {
      id: 'Hunt Lunatender Queen 999,000 Needles',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender Queen', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Mousse Princess Rightward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Right Flank',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Backward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Back',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Leftward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Left Flank',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Forward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Front',
        },
      },
    },
  ],
};

export default triggerSet;
