import EffectId from '../../../resources/effect_id.js';

export function setup(bars) {
  bars.onYouGainEffect(EffectId.Shifu, () => bars.shifu = 1);
  bars.onYouLoseEffect(EffectId.Shifu, () => bars.shifu = 0);
}
