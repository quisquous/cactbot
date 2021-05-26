import EmulatorCommon from '../EmulatorCommon';
import EventBus from '../EventBus';
import LineEvent from './network_log_converter/LineEvent';
import { LineEvent0x01 } from './network_log_converter/LineEvent0x01';

export default class LogEventHandler extends EventBus {
  public currentFight: LineEvent[] = [];
  public currentZoneName = 'Unknown';
  public currentZoneId = '-1';

  parseLogs(logs: LineEvent[]): void {
    for (const lineObj of logs) {
      this.currentFight.push(lineObj);

      lineObj.offset = lineObj.timestamp - this.currentFightStart;

      const res = EmulatorCommon.matchEnd(lineObj.networkLine);
      if (res) {
        this.endFight();
      } else if (lineObj instanceof LineEvent0x01) {
        this.currentZoneId = lineObj.zoneId;
        this.currentZoneName = lineObj.zoneName;
        this.endFight();
      }
    }
  }

  private get currentFightStart(): number {
    return this.currentFight[0]?.timestamp ?? 0;
  }

  private get currentFightEnd(): number {
    return this.currentFight.slice(-1)[0]?.timestamp ?? 0;
  }

  endFight(): void {
    if (this.currentFight.length < 2)
      return;

    const start = new Date(this.currentFightStart).toISOString();
    const end = new Date(this.currentFightEnd).toISOString();

    console.debug(`Dispatching new fight
Start: ${start}
End: ${end}
Zone: ${this.currentZoneName}
Line Count: ${this.currentFight.length}
`);
    void this.dispatch('fight', start.substr(0, 10), this.currentZoneId, this.currentZoneName, this.currentFight);

    this.currentFight = [];
  }
}
