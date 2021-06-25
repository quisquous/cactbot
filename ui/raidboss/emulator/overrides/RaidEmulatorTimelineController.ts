import { UnreachableCode } from '../../../../resources/not_reached';
import { LogEvent } from '../../../../types/event';
import { LooseTimelineTrigger } from '../../../../types/trigger';
import { TimelineController, TimelineReplacement, TimelineStyle } from '../../timeline';
import LineEvent from '../data/network_log_converter/LineEvent';
import RaidEmulator from '../data/RaidEmulator';

import RaidEmulatorTimeline from './RaidEmulatorTimeline';

export default class RaidEmulatorTimelineController extends TimelineController {
  public emulator?: RaidEmulator;
  public activeTimeline: RaidEmulatorTimeline | null = null;

  bindTo(emulator: RaidEmulator): void {
    this.emulator = emulator;
    if (this.activeTimeline)
      this.activeTimeline.bindTo(emulator);
  }

  // Override
  public SetActiveTimeline(timelineFiles: string[], timelines: string[],
      replacements: TimelineReplacement[], triggers: LooseTimelineTrigger[],
      styles: TimelineStyle[]): void {
    this.activeTimeline = null;

    let text = '';

    // Get the text from each file in |timelineFiles|.
    for (const timelineFile of timelineFiles) {
      const name = this.timelines[timelineFile];
      if (name)
        text = `${text}\n${name}`;
      else
        console.log(`Timeline file not found: ${timelineFile}`);
    }
    // Append text from each block in |timelines|.
    for (const timeline of timelines)
      text = `${text}\n${timeline}`;

    if (text) {
      this.activeTimeline =
        new RaidEmulatorTimeline(text, replacements, triggers, styles, this.options);
      if (this.emulator)
        this.activeTimeline.bindTo(this.emulator);
    }
    this.ui.SetTimeline(this.activeTimeline);
  }

  // Override
  public OnLogEvent(_e: LogEvent): void {
    throw new UnreachableCode();
  }

  public onEmulatorLogEvent(logs: LineEvent[]): void {
    if (!this.activeTimeline)
      return;

    for (const line of logs) {
      this.activeTimeline.OnLogLine(
          line.properCaseConvertedLine || line.convertedLine,
          line.timestamp);
      // Only call _OnUpdateTimer if we have a timebase from the previous call to OnLogLine
      // This avoids spamming the console with a ton of messages
      if (this.activeTimeline.timebase)
        this.activeTimeline._OnUpdateTimer(line.timestamp);
    }
  }
}
