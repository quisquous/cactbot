import { PopupText } from '../../popup-text';

export default class StubbedPopupText extends PopupText {
  constructor(options, timelineLoader, raidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
  }

  // Stubbed, we don't want overlay hooks
  HookOverlays() { }
}

StubbedPopupText.globalTriggerSets = null;
