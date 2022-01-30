import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  wickedWhim?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MareLamentorum,
  triggers: [
    {
      id: 'Hunt Lunatender Queen Away With You',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE5', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE5', source: 'ルナテンダー・クイーン', capture: false }),
      alertText: (data, _matches, output) => data.wickedWhim ? output.under!() : output.out!(),
      run: (data) => delete data.wickedWhim,
      outputStrings: {
        under: Outputs.getUnder,
        out: Outputs.out,
      },
    },
    {
      id: 'Hunt Lunatender Queen You May Approach',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE4', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE4', source: 'ルナテンダー・クイーン', capture: false }),
      alertText: (data, _matches, output) => data.wickedWhim ? output.out!() : output.under!(),
      run: (data) => delete data.wickedWhim,
      outputStrings: {
        under: Outputs.getUnder,
        out: Outputs.out,
      },
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes',
      type: 'StartsUsing',
      // 6AE3 is normal, 6AE9 is with whim.  Just handle them both here.
      netRegex: NetRegexes.startsUsing({ id: ['6AE3', '6AE9'], source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6AE3', '6AE9'], source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6AE3', '6AE9'], source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6AE3', '6AE9'], source: 'ルナテンダー・クイーン', capture: false }),
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
      netRegexDe: NetRegexes.startsUsing({ id: '6AE7', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE7', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE7', source: 'ルナテンダー・クイーン', capture: false }),
      run: (data) => data.wickedWhim = true,
    },
    {
      id: 'Hunt Lunatender Queen 999,000 Needles',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE6', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE6', source: 'ルナテンダー・クイーン', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Mousse Princess Rightward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B18', source: 'ムースプリンセス', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Right Flank',
          de: 'Weg von der rechten Flanke',
          fr: 'Éloignez-vous du flanc droit',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Backward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'ムースプリンセス', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Back',
          de: 'Weg von hinter ihr',
          fr: 'Éloignez-vous de l\'arrière',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Leftward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B19', source: 'ムースプリンセス', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Left Flank',
          de: 'Weg von der linker Flanke',
          fr: 'Éloignez-vous du flanc gauche',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Forward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'ムースプリンセス', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Front',
          de: 'Weg von Vorne',
          fr: 'Éloignez-vous du devant',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Banish',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6ABB', source: 'Mousse Princess' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6ABB', source: 'Mousse-Prinzessin' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6ABB', source: 'Princesse Mousse' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6ABB', source: 'ムースプリンセス' }),
      // Doesn't cleave (I think?).
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Mousse Princess Amorphic Flail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AB9', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AB9', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AB9', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AB9', source: 'ムースプリンセス', capture: false }),
      response: Responses.outOfMelee(),
    },
  ],
};

export default triggerSet;
