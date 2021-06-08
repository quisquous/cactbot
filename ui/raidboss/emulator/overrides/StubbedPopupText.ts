import { RaidbossOptions } from 'ui/raidboss/raidboss_options';
import { TimelineLoader } from 'ui/raidboss/timeline';
import { PopupText } from '../../popup-text';
import { RaidbossFileData } from '../../data/raidboss_manifest.txt';

export default class StubbedPopupText extends PopupText {
  constructor(
      options: RaidbossOptions,
      timelineLoader: TimelineLoader,
      raidbossFileData: RaidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
  }

  HookOverlays(): void {
    // Stubbed, we don't want overlay hooks
  }
}
