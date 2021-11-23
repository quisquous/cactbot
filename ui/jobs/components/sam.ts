import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const comboTimer = bars.addTimerBar({
    id: 'sam-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill, combo) => {
    comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });

  const senContainer = document.createElement('div');
  senContainer.id = 'sam-stacks';
  bars.addJobBarContainer().appendChild(senContainer);
  const [setsu, getsu, ka] = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
  ];
  setsu.id = 'sam-stacks-setsu';
  getsu.id = 'sam-stacks-getsu';
  ka.id = 'sam-stacks-ka';
  [setsu, getsu, ka].forEach((e) => senContainer.appendChild(e));

  const kenkiGauge = bars.addResourceBox({
    classList: ['sam-color-kenki'],
  });
  const meditationGauge = bars.addResourceBox({
    classList: ['sam-color-meditation'],
  });

  bars.onJobDetailUpdate('SAM', (jobDetail: JobDetail['SAM']) => {
    kenkiGauge.innerText = jobDetail.kenki.toString();
    meditationGauge.innerText = jobDetail.meditationStacks.toString();
    if (jobDetail.kenki >= 70)
      kenkiGauge.parentNode.classList.add('high');
    else
      kenkiGauge.parentNode.classList.remove('high');
    if (jobDetail.meditationStacks >= 2)
      meditationGauge.parentNode.classList.add('high');
    else
      meditationGauge.parentNode.classList.remove('high');

    if (jobDetail.setsu)
      setsu.classList.add('active');
    else
      setsu.classList.remove('active');
    if (jobDetail.getsu)
      getsu.classList.add('active');
    else
      getsu.classList.remove('active');
    if (jobDetail.ka)
      ka.classList.add('active');
    else
      ka.classList.remove('active');
  });

  const shifu = bars.addProcBox({
    id: 'sam-procs-shifu',
    fgColor: 'sam-color-shifu',
    notifyWhenExpired: true,
  });

  const jinpu = bars.addProcBox({
    id: 'sam-procs-jinpu',
    fgColor: 'sam-color-jinpu',
    notifyWhenExpired: true,
  });
  bars.onYouGainEffect((id, matches) => {
    if (id === EffectId.Shifu) {
      shifu.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
      bars.speedBuffs.shifu = true;
    }
    if (id === EffectId.Jinpu)
      jinpu.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
  });
  bars.onYouLoseEffect((id) => {
    if (id === EffectId.Shifu) {
      shifu.duration = 0;
      bars.speedBuffs.shifu = false;
    }
    if (id === EffectId.Jinpu)
      jinpu.duration = 0;
  });

  const tsubameGaeshi = bars.addProcBox({
    id: 'sam-procs-tsubamegaeshi',
    fgColor: 'sam-color-tsubamegaeshi',
  });
  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.KaeshiHiganbana:
      case kAbility.KaeshiGoken:
      case kAbility.KaeshiSetsugekka:
        tsubameGaeshi.duration = 60;
        break;
    }
  });

  const higanbana = bars.addProcBox({
    id: 'sam-procs-higanbana',
    fgColor: 'sam-color-higanbana',
    notifyWhenExpired: true,
  });
  bars.onMobGainsEffectFromYou((id) => {
    if (id === EffectId.Higanbana)
      higanbana.duration = 60 - 0.5; // -0.5s for log line delay
  });

  bars.onStatChange('SAM', ({ gcdSkill }) => {
    shifu.valuescale = gcdSkill;
    shifu.threshold = gcdSkill * 6;
    jinpu.valuescale = gcdSkill;
    jinpu.threshold = gcdSkill * 6;
    tsubameGaeshi.valuescale = gcdSkill;
    tsubameGaeshi.threshold = gcdSkill * 4;
    higanbana.valuescale = gcdSkill;
    higanbana.threshold = gcdSkill * 4;
  });

  resetFunc = (_bars: Bars): void => {
    comboTimer.duration = 0;
    shifu.duration = 0;
    jinpu.duration = 0;
    tsubameGaeshi.duration = 0;
    higanbana.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
