import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import ComboTracker from '../combo_tracker';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class SAMComponent extends BaseComponent {
  comboTimer: TimerBar;
  setsu: HTMLDivElement;
  getsu: HTMLDivElement;
  ka: HTMLDivElement;
  kenkiGauge: ResourceBox;
  meditationGauge: ResourceBox;
  fuka: TimerBox;
  fugetsu: TimerBox;
  tsubameGaeshi: TimerBox;
  higanbana: TimerBox;

  constructor(o: ComponentInterface) {
    super(o);
  this.comboTimer = this.bars.addTimerBar({
    id: 'sam-timers-combo',
    fgColor: 'combo-color',
  });

  const senContainer = document.createElement('div');
  senContainer.id = 'sam-stacks';
  this.bars.addJobBarContainer().appendChild(senContainer);

  this.setsu = document.createElement('div');
  this.getsu = document.createElement('div');
  this.ka = document.createElement('div');

  this.setsu.id = 'sam-stacks-setsu';
  this.getsu.id = 'sam-stacks-getsu';
  this.ka.id = 'sam-stacks-ka';
  [this.setsu, this.getsu, this.ka].forEach((e) => senContainer.appendChild(e));

  this.kenkiGauge = this.bars.addResourceBox({
    classList: ['sam-color-kenki'],
  });
  this.meditationGauge = this.bars.addResourceBox({
    classList: ['sam-color-meditation'],
  });
  this.fuka = this.bars.addProcBox({
    id: 'sam-procs-fuka',
    fgColor: 'sam-color-fuka',
    notifyWhenExpired: true,
  });

  this.fugetsu = this.bars.addProcBox({
    id: 'sam-procs-fugetsu',
    fgColor: 'sam-color-fugetsu',
    notifyWhenExpired: true,
  });
  this.tsubameGaeshi = this.bars.addProcBox({
    id: 'sam-procs-tsubamegaeshi',
    fgColor: 'sam-color-tsubamegaeshi',
  });
  this.higanbana = this.bars.addProcBox({
    id: 'sam-procs-higanbana',
    fgColor: 'sam-color-higanbana',
    notifyWhenExpired: true,
  });
}

  override onCombo(skill: string, combo: ComboTracker): void {
    this.comboTimer.duration = 0;
    if (combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = this.comboDuration;
  }
  override onJobDetailUpdate(jobDetail: JobDetail['SAM']): void {
    this.kenkiGauge.innerText = jobDetail.kenki.toString();
    this.meditationGauge.innerText = jobDetail.meditationStacks.toString();
    if (jobDetail.kenki >= 70)
      this.kenkiGauge.parentNode.classList.add('high');
    else
      this.kenkiGauge.parentNode.classList.remove('high');
    if (jobDetail.meditationStacks >= 2)
      this.meditationGauge.parentNode.classList.add('high');
    else
      this.meditationGauge.parentNode.classList.remove('high');

    if (jobDetail.setsu)
      this.setsu.classList.add('active');
    else
      this.setsu.classList.remove('active');
    if (jobDetail.getsu)
      this.getsu.classList.add('active');
    else
      this.getsu.classList.remove('active');
    if (jobDetail.ka)
      this.ka.classList.add('active');
    else
      this.ka.classList.remove('active');
  }

  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>):void {
    if (id === EffectId.Fugetsu) {
      this.fuka.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
      this.player.speedBuffs.fuka = true;
    }
    if (id === EffectId.Fuka)
      this.fugetsu.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
  }
  override onYouLoseEffect(id: string):void {
    if (id === EffectId.Fugetsu) {
      this.fuka.duration = 0;
      this.player.speedBuffs.fuka = false;
    }
    if (id === EffectId.Fuka)
      this.fugetsu.duration = 0;
  }

  override onUseAbility(id: string) :void {
    switch (id) {
      case kAbility.KaeshiHiganbana:
      case kAbility.KaeshiGoken:
      case kAbility.KaeshiSetsugekka:
        this.tsubameGaeshi.duration = 60;
        break;
    }
  }

  override onMobGainsEffectFromYou(id:string) :void {
    if (id === EffectId.Higanbana)
      this.higanbana.duration = 60 - 0.5; // -0.5s for log line delay
  }

  override onStatChange({ gcdSkill }:{ gcdSkill: number }): void {
    this.fuka.valuescale = gcdSkill;
    this.fuka.threshold = gcdSkill * 6;
    this.fugetsu.valuescale = gcdSkill;
    this.fugetsu.threshold = gcdSkill * 6;
    this.tsubameGaeshi.valuescale = gcdSkill;
    this.tsubameGaeshi.threshold = gcdSkill * 4;
    this.higanbana.valuescale = gcdSkill;
    this.higanbana.threshold = gcdSkill * 4;
  }

  override reset(): void {
    this.comboTimer.duration = 0;
    this.fuka.duration = 0;
    this.fugetsu.duration = 0;
    this.tsubameGaeshi.duration = 0;
    this.higanbana.duration = 0;
  }
}

