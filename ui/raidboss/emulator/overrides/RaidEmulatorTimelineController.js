'use strict';

class RaidEmulatorTimelineController extends TimelineController {
  bindTo(emulator) {
    this.emulator = emulator;
    if (this.activeTimeline)
      this.activeTimeline.bindTo(emulator);
  }

  // Override
  SetActiveTimeline(timelineFiles, timelines, replacements, triggers, styles) {
    this.activeTimeline = null;

    let text = '';

    // Get the text from each file in |timelineFiles|.
    for (let i = 0; i < timelineFiles.length; ++i) {
      let name = timelineFiles[i];
      if (name in this.timelines)
        text = text + '\n' + this.timelines[name];
      else
        console.log('Timeline file not found: ' + name);
    }
    // Append text from each block in |timelines|.
    for (let i = 0; i < timelines.length; ++i)
      text = text + '\n' + timelines[i];

    if (text) {
      this.activeTimeline =
        new RaidEmulatorTimeline(text, replacements, triggers, styles, this.options);
      if (this.emulator)
        this.activeTimeline.bindTo(this.emulator);
    }
    this.ui.SetTimeline(this.activeTimeline);
  }

  // Override
  OnLogEvent(e) {
    if (!this.activeTimeline)
      return;
    for (let i = 0; i < e.detail.logs.length; ++i) {
      this.activeTimeline.emulatedTimeOffset = e.detail.offsets[i];
      this.ui.emulatedTimeOffset = e.detail.offsets[i];
      this.activeTimeline.OnLogLine(e.detail.logs[i]);
    }
  }
}
