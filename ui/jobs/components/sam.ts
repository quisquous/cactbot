import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { ComboTracker } from '../combo_tracker';
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
  lastTsubameGaeshiTimestamp?: string;

  constructor(o: ComponentInterface) {
    super(o);
    this.comboTimer = this.bars.addTimerBar({
      id: 'sam-timers-combo',
      fgColor: 'combo-color',
    });

    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'sam-stacks';
    stacksContainer.classList.add('stacks');
    const senContainer = document.createElement('div');
    senContainer.id = 'sam-stacks-sen';
    stacksContainer.appendChild(senContainer);
    this.bars.addJobBarContainer().appendChild(stacksContainer);

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

    this.fugetsu = this.bars.addProcBox({
      id: 'sam-procs-fugetsu',
      fgColor: 'sam-color-fugetsu',
      notifyWhenExpired: true,
    });
    this.fuka = this.bars.addProcBox({
      id: 'sam-procs-fuka',
      fgColor: 'sam-color-fuka',
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

    this.reset();
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
    this.kenkiGauge.parentNode.classList.toggle('high', jobDetail.kenki >= 70);
    this.meditationGauge.parentNode.classList.toggle('high', jobDetail.meditationStacks >= 2);

    this.setsu.classList.toggle('active', jobDetail.setsu);
    this.getsu.classList.toggle('active', jobDetail.getsu);
    this.ka.classList.toggle('active', jobDetail.ka);
  }

  override onYouGainEffect(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    if (id === EffectId.Fuka) {
      this.fuka.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
      this.player.speedBuffs.fuka = true;
    }
    if (id === EffectId.Fugetsu)
      this.fugetsu.duration = parseFloat(matches.duration ?? '0') - 0.5; // -0.5s for log line delay
  }
  override onYouLoseEffect(id: string): void {
    if (id === EffectId.Fuka) {
      this.fuka.duration = 0;
      this.player.speedBuffs.fuka = false;
    }
    if (id === EffectId.Fugetsu)
      this.fugetsu.duration = 0;
  }

  override onUseAbility(id: string, matches: PartialFieldMatches<'Ability'>): void {
    switch (id) {
      case kAbility.KaeshiHiganbana:
      case kAbility.KaeshiGoken:
      case kAbility.KaeshiSetsugekka:
        if (this.player.level >= 84) {
          if (matches.timestamp !== this.lastTsubameGaeshiTimestamp) {
            // TODO: use targetIndex instead.
            // Avoid multiple call in AOE
            this.tsubameGaeshi.duration = 60 + this.tsubameGaeshi.value;
            this.lastTsubameGaeshiTimestamp = matches.timestamp;
          }
        } else {
          this.tsubameGaeshi.duration = 60;
        }
        break;
    }
  }

  override onMobGainsEffectFromYou(id: string): void {
    if (id === EffectId.Higanbana)
      this.higanbana.duration = 60 - 0.5; // -0.5s for log line delay
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
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
