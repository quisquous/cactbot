import Util, { WatchCombatantFunc, WatchCombatantParams } from '../../../../resources/util';
import { OverlayHandlerRequests, OverlayHandlerResponseTypes } from '../../../../types/event';
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
    const func: WatchCombatantFunc = (params, callback) => {
      let watch: Watch;

      // `watch` must be defined before the object creation, otherwise browser JS will throw the
      // following error:
      // Uncaught (in promise) ReferenceError: can't access lexical declaration 'watch'
      // before initialization
      // eslint-disable-next-line prefer-const
      watch = {
        lastCheck: 0,
        params: params,
        cancel: false,
        start: 0,
        func: callback,
        msg: {
          call: 'getCombatants',
          ...params,
        },
        res: () => {/* empty */},
        rej: () => {/* empty */},
        promise: new Promise<void>((res, rej) => {
          watch.res = res;
          watch.rej = rej;
        }),
      };

      this.watches.push(watch);
      return watch.promise;
    };

    Util.setWatchCombatantOverride(func, this.clear.bind(this));

    this.emulator.on('tick', () => {
      const timestamp = this.emulator.currentLogTime;

      if (timestamp === undefined)
        return;

      this.tick(timestamp);
    });
  }

  public tick(
    timestamp: number,
  ): void {
    for (const watch of this.watches) {
      if (watch.cancel)
        continue;
      if (watch.lastCheck + 1000 > timestamp)
        continue;
      watch.lastCheck = timestamp;
      void this.overlayHook._getCombatantsOverride(watch.msg).then((e) => {
        if (watch.func(e)) {
          watch.res();
          watch.cancel = true;
        }
      });
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
