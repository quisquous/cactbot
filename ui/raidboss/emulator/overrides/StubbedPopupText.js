import { PopupText } from '../../popup-text.js';

export default class StubbedPopupText extends PopupText {
  constructor(options) {
    super(options);
  }

  // Stubbed, we don't want overlay hooks
  HookOverlays() { }

  // Override, only parse the trigger sets once
  OnDataFilesRead(files) {
    if (StubbedPopupText.globalTriggerSets !== null) {
      this.triggerSets = StubbedPopupText.globalTriggerSets;
      return;
    }
    super.OnDataFilesRead(files);
    StubbedPopupText.globalTriggerSets = this.triggerSets;
  }
}

StubbedPopupText.globalTriggerSets = null;
