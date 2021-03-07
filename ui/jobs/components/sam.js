import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';

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

  const stacksContainer = document.createElement('div');
  stacksContainer.id = 'sam-stacks';
  bars.addJobBarContainer().appendChild(stacksContainer);

  const setsuContainer = document.createElement('div');
  setsuContainer.id = 'sam-stacks-setsu';
  stacksContainer.appendChild(setsuContainer);
  const setsu = [];
  for (let i = 0; i < 1; ++i) {
    const d = document.createElement('div');
    setsuContainer.appendChild(d);
    setsu.push(d);
  }

  const getsuContainer = document.createElement('div');
  getsuContainer.id = 'sam-stacks-getsu';
  stacksContainer.appendChild(getsuContainer);
  const getsu = [];
  for (let i = 0; i < 1; ++i) {
    const d = document.createElement('div');
    getsuContainer.appendChild(d);
    getsu.push(d);
  }

  const kaContainer = document.createElement('div');
  kaContainer.id = 'sam-stacks-ka';
  stacksContainer.appendChild(kaContainer);
  const ka = [];
  for (let i = 0; i < 1; ++i) {
    const d = document.createElement('div');
    kaContainer.appendChild(d);
    ka.push(d);
  }
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
    for (let i = 0; i < 1; ++i) {
      if (jobDetail.setsu > i)
        setsu[i].classList.add('active');
      else
        setsu[i].classList.remove('active');
    }
    for (let i = 0; i < 1; ++i) {
      if (jobDetail.getsu > i)
        getsu[i].classList.add('active');
      else
        getsu[i].classList.remove('active');
    }
    for (let i = 0; i < 1; ++i) {
      if (jobDetail.ka > i)
        ka[i].classList.add('active');
      else
        ka[i].classList.remove('active');
    }
  });

  const shifu = bars.addProcBox({
    id: 'sam-procs-shifu',
    fgColor: 'sam-color-shifu',
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
}
