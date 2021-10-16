import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { kAbility } from '../constants';
import { Bars } from '../jobs';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const comboTimer = bars.addTimerBar({
    id: 'sam-timers-combo',
    fgColor: 'combo-color',
  });
  bars.onCombo((skill) => {
    comboTimer.duration = 0;
    if (bars.combo?.isFinalSkill)
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
  bars.onYouGainEffect(EffectId.Shifu, (_id, matches) => {
    shifu.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
    bars.speedBuffs.shifu = true;
  });
  bars.onYouLoseEffect(EffectId.Shifu, () => {
    shifu.duration = 0;
    bars.speedBuffs.shifu = false;
  });

  const jinpu = bars.addProcBox({
    id: 'sam-procs-jinpu',
    fgColor: 'sam-color-jinpu',
    notifyWhenExpired: true,
  });
  bars.onYouGainEffect(EffectId.Jinpu, (_id, matches) => {
    jinpu.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
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
    tsubameGaeshi.duration = 60;
  });

  const higanbana = bars.addProcBox({
    id: 'sam-procs-higanbana',
    fgColor: 'sam-color-higanbana',
    notifyWhenExpired: true,
  });
  bars.onMobGainsEffectFromYou(EffectId.Higanbana, () => {
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
