import PartyTracker from '../../../../resources/party';
import { RaidbossData } from '../../../../types/data';
import { RaidbossFileData } from '../../data/raidboss_manifest.txt';
import { PopupText } from '../../popup-text';
import { RaidbossOptions } from '../../raidboss_options';
import { TimelineLoader } from '../../timeline';

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

  getData(): RaidbossData {
    return this.data;
  }

  getPartyTracker(): PartyTracker {
    return this.partyTracker;
  }
}
