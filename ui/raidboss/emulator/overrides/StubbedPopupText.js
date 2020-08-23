'use strict';

class StubbedPopupText extends PopupText {
  constructor(options) {
    super(options);
  }

  // Stubbed, we don't want overlay hooks
  HookOverlays() { }

  // Override, only parse the trigger sets once
  OnDataFilesRead(e) {
    if (StubbedPopupText.globalTriggerSets !== null) {
      this.triggerSets = StubbedPopupText.globalTriggerSets;
      return;
    }
    super.OnDataFilesRead(e);
    StubbedPopupText.globalTriggerSets = this.triggerSets;
  }
}

StubbedPopupText.globalTriggerSets = null;
