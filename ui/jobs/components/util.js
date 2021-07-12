// import ResourceBar from '../../../resources/resourcebar';
// import TimerBar from '../../../resources/timerbar';
// import TimerBox from '../../../resources/timerbox';
// import { JobDetail } from '../../../types/event';
// import { CactbotBaseRegExp } from '../../../types/net_trigger';
// import { Bars } from '../jobs';

// interface ElementOptions {
//   id: string;
//   fgColor?: string;
//   threshold?: number;
//   scale?: number;
//   notifyWhenExpired?: boolean;
// }

export class Component {
  // bars: Bars;
  constructor(bars) {
    this.bars = bars;
  }

  addCustomBar(element) {
    const container = this.bars.addJobBarContainer();
    container.appendChild(element);
    return container;
  }

  addProcBox(options) {
    return this.bars.addProcBox(options);
  }

  addResourceBar(options) {
    return this.bars.addResourceBar(options);
  }

  addResourceBox(options) {
    return this.bars.addResourceBox(options);
  }

  addTimerBar(options) {
    return this.bars.addTimerBar(options);
  }

  /**
   * (override) called on combo state changed
   * @param {string} skill used
   */
  onCombo(skill) {}

  /**
   * (override) called on player gains any effect
   * @param {string} effectId
   * @param matches groups
   */
  onGainEffect(effectId, matches) {}

  /**
   * (override) called on player loses any effect
   * @param {string} effectId
   * @param matches groups
   */
  onLoseEffect(effectId, matches) {}

  /**
   * (override) called on JobDetails data changed
   * @param {JobDetails} jobDetail
   */
  onJobDetailUpdate(jobDetail) {}

  /**
   * (override) called on Stat data changed
   * @param {Stat} stat
   */
  onStatChange(stat) {}

  /**
   * (override) called on player used any actions
   * @param {string} action id
   */
  onUseAbility(action, matches) {}

  /**
   * (override) called on job changed,
   * to setup variables that the current job component using.
   */
  setup() {}

  /**
   * (override) called on job changed,
   * to clear variables that the previous job component used.
   */
  reset() {}
}
