import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';
import { BaseComponent } from './base';

export default class SamComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.comboTimer = this.addTimerBar({
      id: 'sam-timers-combo',
      fgColor: 'combo-color',
    });

    this.kenkiGauge = this.addResourceBox({
      classList: ['sam-color-kenki'],
    });
    this.meditationGauge = this.addResourceBox({
      classList: ['sam-color-meditation'],
    });

    this.shifu = this.addProcBox({
      id: 'sam-procs-shifu',
      fgColor: 'sam-color-shifu',
      notifyWhenExpired: true,
    });
    this.jinpu = this.addProcBox({
      id: 'sam-procs-jinpu',
      fgColor: 'sam-color-jinpu',
      notifyWhenExpired: true,
    });

    this.tsubameGaeshi = this.addProcBox({
      id: 'sam-procs-tsubamegaeshi',
      fgColor: 'sam-color-tsubamegaeshi',
    });

    this.higanbana = this.addProcBox({
      id: 'sam-procs-higanbana',
      fgColor: 'sam-color-higanbana',
      notifyWhenExpired: true,
    });

    const senContainer = document.createElement('div');
    senContainer.id = 'sam-stacks';
    this.addCustomBar(senContainer);
    this.sen = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];
    this.sen[0].id = 'sam-stacks-setsu';
    this.sen[1].id = 'sam-stacks-getsu';
    this.sen[2].id = 'sam-stacks-ka';
    this.sen.forEach((e) => senContainer.appendChild(e));
  }

  onCombo(skill) {
    this.comboTimer.duration = 0;
    if (this.bars.combo.isFinalSkill)
      return;
    if (skill)
      this.comboTimer.duration = 15;
  }

  onGainEffect(effectId, matches) {
    switch (effectId) {
      case EffectId.Shifu:
        this.shifu.duration = matches.duration - 0.5; // -0.5s for log line delay
        this.player.speedBuffs.shifu = true;
        break;

      case EffectId.Jinpu:
        this.jinpu.duration = matches.duration - 0.5; // -0.5s for log line delay
        break;

      default:
        break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
      case EffectId.Shifu:
        this.shifu.duration = 0;
        this.player.speedBuffs.shifu = false;
        break;

      case EffectId.Jinpu:
        this.jinpu.duration = 0;
        break;

      default:
        break;
    }
  }

  onMobGainsEffectFromYou(effectId) {
    if (effectId === EffectId.Higanbana)
      this.higanbana.duration = 60 - 0.5; // -0.5s for log line delay
  }

  onUseAbility(abilityId) {
    switch (abilityId) {
      case kAbility.KaeshiHiganbana:
      case kAbility.KaeshiGoken:
      case kAbility.KaeshiSetsugekka:
        this.tsubameGaeshi.duration = 60;
        break;

      default:
        break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    this.kenkiGauge.innerText = jobDetail.kenki;
    this.meditationGauge.innerText = jobDetail.meditationStacks;
    if (jobDetail.kenki >= 70)
      this.kenkiGauge.parentNode.classList.add('high');
    else
      this.kenkiGauge.parentNode.classList.remove('high');
    if (jobDetail.meditationStacks >= 2)
      this.meditationGauge.parentNode.classList.add('high');
    else
      this.meditationGauge.parentNode.classList.remove('high');

    if (jobDetail.setsu)
      this.sen[0].classList.add('active');
    else
      this.sen[0].classList.remove('active');
    if (jobDetail.getsu)
      this.sen[1].classList.add('active');
    else
      this.sen[1].classList.remove('active');
    if (jobDetail.ka)
      this.sen[2].classList.add('active');
    else
      this.sen[2].classList.remove('active');
  }

  onStatChange(stats) {
    this.shifu.valuescale = stats.gcdSkill;
    this.shifu.threshold = stats.gcdSkill * 6;
    this.jinpu.valuescale = stats.gcdSkill;
    this.jinpu.threshold = stats.gcdSkill * 6;
    this.tsubameGaeshi.valuescale = stats.gcdSkill;
    this.tsubameGaeshi.threshold = stats.gcdSkill * 4;
    this.higanbana.valuescale = stats.gcdSkill;
    this.higanbana.threshold = stats.gcdSkill * 4;
  }

  resetFunc() {
    this.comboTimer.duration = 0;
    this.shifu.duration = 0;
    this.jinpu.duration = 0;
    this.tsubameGaeshi.duration = 0;
    this.higanbana.duration = 0;
  }
}
