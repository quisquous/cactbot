import { RaidbossOptions } from '../../raidboss_options';
import { Event } from '../../timeline';

import RaidEmulatorTimelineUI, { EmulatorTimerBar } from './RaidEmulatorTimelineUI';

export default class RaidEmulatorAnalysisTimelineUI extends RaidEmulatorTimelineUI {
  constructor(options: RaidbossOptions) {
    super(options);
    // Use orphaned child div to prevent DOM updates
    this.$barContainer = document.createElement('div');
  }

  updateBar(_bar: EmulatorTimerBar, _currentLogTime: number): void {
    // Stubbed out for performance
  }
  OnAddTimer(_fightNow: number, _e: Event, _channeling: boolean): void {
    // Stubbed out for performance
  }

  OnRemoveTimer(_e: Event, _expired: boolean): void {
    // Stubbed out for performance
  }
}
