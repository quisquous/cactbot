import RaidEmulatorTimelineUI from './RaidEmulatorTimelineUI';

export default class RaidEmulatorAnalysisTimelineUI extends RaidEmulatorTimelineUI {
  constructor(options) {
    super(options);
    this.$barContainer = document.createElement('div');
    this.$progressTemplate = document.querySelector('template.progress').content.firstElementChild;
  }

  // Stub out these methods for performance
  updateBar(bar, currentLogTime) {}
  OnAddTimer(fightNow, e, channeling) {}

  // Override
  OnRemoveTimer(e, expired) {}
}
