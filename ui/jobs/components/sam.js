import EffectId from '../../../resources/effect_id.js';
import { kAbility } from '../constants.js';

export function setup(bars) {
  bars.onYouGainEffect(EffectId.Shifu, () => bars.speedBuffs.shifu = 1);
  bars.onYouLoseEffect(EffectId.Shifu, () => bars.speedBuffs.shifu = 0);

  const comboTimer = bars.addTimerBar({
    id: 'sam-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill) => {
    comboTimer.duration = 0;
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const kenkiGauge = bars.addResourceBox({
    classList: ['sam-color-kenki'],
  });
  const meditationGauge = bars.addResourceBox({
    classList: ['sam-color-meditation'],
  });
  bars.onJobDetailUpdate((jobDetail) => {
    kenkiGauge.innerText = jobDetail.kenki;
    meditationGauge.innerText = jobDetail.meditationStacks;
    if (jobDetail.kenki >= 70)
      kenkiGauge.parentNode.classList.add('high');
    else
      kenkiGauge.parentNode.classList.remove('high');
    if (jobDetail.meditationStacks >= 2)
      meditationGauge.parentNode.classList.add('high');
    else
      meditationGauge.parentNode.classList.remove('high');
  });

  const shifu = bars.addProcBox({
    id: 'sam-procs-shifu',
    fgColor: 'sam-color-shifu',
  });
  bars.onCombo((skill) => {
    if (skill === kAbility.Shifu) {
      shifu.duration = 0;
      shifu.duration = 40;
    }
  });

  const jinpu = bars.addProcBox({
    id: 'sam-procs-jinpu',
    fgColor: 'sam-color-jinpu',
  });
  bars.onCombo((skill) => {
    if (skill === kAbility.Jinpu) {
      jinpu.duration = 0;
      jinpu.duration = 40;
    }
  });

  const tsubameGaeshi = bars.addProcBox({
    id: 'sam-procs-tsubamegaeshi',
    fgColor: 'sam-color-tsubamegaeshi',
  });
  bars.onUseAbility([
    kAbility.KaeshiHiganbana,
    kAbility.KaeshiGoken,
    kAbility.KaeshiSetsugekka
  ], () => {
    tsubameGaeshi.duration = 0;
    tsubameGaeshi.duration = 60;
  });

  const gurenSenei = bars.addProcBox({
    id: 'sam-procs-gurensenei',
    fgColor: 'sam-color-gurensenei',
  });
  bars.onUseAbility([
    kAbility.HissatsuGuren,
    kAbility.HissatsuSenei,
  ], () => {
    gurenSenei.duration = 0;
    gurenSenei.duration = 120;
  });

  bars.onStatChange('SAM', () => {
    shifu.valuescale = bars.gcdSkill;
    shifu.threshold = bars.gcdSkill * 6;
    jinpu.valuescale = bars.gcdSkill;
    jinpu.threshold = bars.gcdSkill * 6;
    tsubameGaeshi.valuescale = bars.gcdSkill;
    tsubameGaeshi.threshold = bars.gcdSkill * 4;
    gurenSenei.valuescale = bars.gcdSkill;
    gurenSenei.threshold = bars.gcdSkill * 4;
  });
}
