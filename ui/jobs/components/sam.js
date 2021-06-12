import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';

let resetFunc = null;

export function setup(bars) {
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

  const senContainer = document.createElement('div');
  senContainer.id = 'sam-stacks';
  bars.addJobBarContainer().appendChild(senContainer);
  const sen = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
  ];
  sen[0].id = 'sam-stacks-setsu';
  sen[1].id = 'sam-stacks-getsu';
  sen[2].id = 'sam-stacks-ka';
  sen.forEach((e) => senContainer.appendChild(e));

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

    if (jobDetail.setsu)
      sen[0].classList.add('active');
    else
      sen[0].classList.remove('active');
    if (jobDetail.getsu)
      sen[1].classList.add('active');
    else
      sen[1].classList.remove('active');
    if (jobDetail.ka)
      sen[2].classList.add('active');
    else
      sen[2].classList.remove('active');
  });

  const shifu = bars.addProcBox({
    id: 'sam-procs-shifu',
    fgColor: 'sam-color-shifu',
    notifyWhenExpired: true,
  });
  bars.onYouGainEffect(EffectId.Shifu, (id, matches) => {
    shifu.duration = 0;
    shifu.duration = matches.duration - 0.5; // -0.5s for log line delay
    bars.speedBuffs.shifu = 1;
  });
  bars.onYouLoseEffect(EffectId.Shifu, () => {
    shifu.duration = 0;
    bars.speedBuffs.shifu = 0;
  });

  const jinpu = bars.addProcBox({
    id: 'sam-procs-jinpu',
    fgColor: 'sam-color-jinpu',
    notifyWhenExpired: true,
  });
  bars.onYouGainEffect(EffectId.Jinpu, (id, matches) => {
    jinpu.duration = 0;
    jinpu.duration = matches.duration - 0.5; // -0.5s for log line delay
  });
  bars.onYouLoseEffect(EffectId.Jinpu, () => {
    jinpu.duration = 0;
  });

  const tsubameGaeshi = bars.addProcBox({
    id: 'sam-procs-tsubamegaeshi',
    fgColor: 'sam-color-tsubamegaeshi',
  });
  bars.onUseAbility([
    kAbility.KaeshiHiganbana,
    kAbility.KaeshiGoken,
    kAbility.KaeshiSetsugekka,
  ], () => {
    tsubameGaeshi.duration = 0;
    tsubameGaeshi.duration = 60;
  });

  const higanbana = bars.addProcBox({
    id: 'sam-procs-higanbana',
    fgColor: 'sam-color-higanbana',
    notifyWhenExpired: true,
  });
  bars.onMobGainsEffectFromYou(EffectId.Higanbana, () => {
    higanbana.duration = 0;
    higanbana.duration = 60 - 0.5; // -0.5s for log line delay
  });

  bars.onStatChange('SAM', () => {
    shifu.valuescale = bars.gcdSkill;
    shifu.threshold = bars.gcdSkill * 6;
    jinpu.valuescale = bars.gcdSkill;
    jinpu.threshold = bars.gcdSkill * 6;
    tsubameGaeshi.valuescale = bars.gcdSkill;
    tsubameGaeshi.threshold = bars.gcdSkill * 4;
    higanbana.valuescale = bars.gcdSkill;
    higanbana.threshold = bars.gcdSkill * 4;
  });

  resetFunc = (bars) => {
    comboTimer.duration = 0;
    shifu.duration = 0;
    jinpu.duration = 0;
    tsubameGaeshi.duration = 0;
    higanbana.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
