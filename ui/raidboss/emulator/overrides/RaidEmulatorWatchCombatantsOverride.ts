import Util, { WatchCombatantParams } from '../../../../resources/util';
import { OverlayHandlerRequests, OverlayHandlerResponseTypes } from '../../../../types/event';
import AnalyzedEncounter from '../data/AnalyzedEncounter';
import CombatantTracker from '../data/CombatantTracker';
import RaidEmulator from '../data/RaidEmulator';

import RaidEmulatorOverlayApiHook from './RaidEmulatorOverlayApiHook';

type Watch = {
  lastCheck: number;
  params: WatchCombatantParams;
  msg: OverlayHandlerRequests['getCombatants'];
  cancel: boolean;
  start: number;
  promise: Promise<void>;
  res: () => void;
  rej: () => void;
  func: (ret: OverlayHandlerResponseTypes['getCombatants']) => boolean;
};

export default class RaidEmulatorWatchCombatantsOverride {
  private watches: Watch[] = [];

  constructor(private emulator: RaidEmulator, private overlayHook: RaidEmulatorOverlayApiHook) {
    Util.setWatchCombatantOverride((params, func) => {
      // To avoid having to undefined-check the params declare watch as partial here and just cast
      // to non-partial when pushing to array since all props are set here properly but can't be
      // set in the initializer
      const watch: Partial<Watch> = {
        lastCheck: 0,
        params: params,
        cancel: false,
        start: 0,
        func: func,
        msg: {
          call: 'getCombatants',
          ...params,
        },
      };

      watch.promise = new Promise<void>((res, rej) => {
        watch.res = res;
        watch.rej = rej;
      });
      this.watches.push(watch as Watch);
      return watch.promise;
    }, this.clear.bind(this));

    this.emulator.on('tick', () => {
      const curEnc = this.emulator.currentEncounter;
      const tracker = curEnc?.encounter.combatantTracker;
      const timestamp = this.emulator.currentLogTime;

      if (!curEnc || !tracker || !timestamp)
        return;

      this.tick(curEnc, tracker, timestamp);
    });
  }

  public tick(
      curEnc: AnalyzedEncounter,
      tracker: CombatantTracker,
      timestamp: number,
  ): void {
    for (const watch of this.watches) {
      if (watch.cancel)
        continue;
      if (watch.lastCheck + 1000 > timestamp)
        continue;
      watch.lastCheck = timestamp;
      this.overlayHook.getCombatantsFor((e) => {
        if (watch.func(e)) {
          watch.res();
          watch.cancel = true;
        }
      }, watch.msg, curEnc, tracker, timestamp);
    }
    this.watches = this.watches.filter((w) => !w.cancel);
  }

  public clear(): void {
    for (const watch of this.watches) {
      watch.rej();
      watch.cancel = true;
    }
    this.watches = [];
  }
}
