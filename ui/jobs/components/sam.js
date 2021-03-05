import EffectId from '../../../resources/effect_id';

export function setup(bars) {
  bars.onYouGainEffect(EffectId.Shifu, () => bars.speedBuffs.shifu = 1);
  bars.onYouLoseEffect(EffectId.Shifu, () => bars.speedBuffs.shifu = 0);
}
