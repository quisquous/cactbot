import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Mousse Princess Banish tankbuster
// TODO: Mousse Princess Amorphic Flail centered aoe

export interface Data extends RaidbossData {
  wickedWhim?: boolean;
}

const underThenOut = {
  en: 'Under => Out',
  de: 'Drunter => Raus',
  fr: 'En dessous => À l\'extérieur',
};
const outStayOut = {
  en: 'Out => Stay Out',
  de: 'Raus => Drausen bleiben',
  fr: 'À l\'extérieur => Restez-y',
};

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
        under: underThenOut,
        out: outStayOut,
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
        under: underThenOut,
        out: outStayOut,
      },
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE9', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE9', source: 'ルナテンダー・クイーン', capture: false }),
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
  ],
};

export default triggerSet;
