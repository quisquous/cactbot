import EffectId from '../../../resources/effect_id.js';

export function setupSam(bars) {
  bars.gainEffectFuncMap[EffectId.Shifu] = () => {
    bars.shifu = 1;
  };
  bars.loseEffectFuncMap[EffectId.Shifu] = () => {
    bars.shifu = 0;
  };
}
