"use strict";

var kShowTargetCastbar = false;
var kShowFocusCastbar = false;

var kTargetCastbarColor = "rgba(250, 70, 100, 0.8)";
var kFocusCastbarColor = "rgba(250, 70, 100, 0.8)";

class CastBars {
  constructor() {
    this.casting = {};
  }

  Init() {
    if (this.didInit)
      return;
    this.didInit = true;

    if (kShowTargetCastbar) {
      this.targetCastbarContainer = document.getElementById('target-castbar-container');
      this.targetCastbar = document.createElement("timer-bar");
      this.targetCastbarContainer.appendChild(this.targetCastbar);

      this.targetCastbar.classList.add("hide");
      this.targetCastbar.fg = kTargetCastbarColor;
    }
    if (kShowFocusCastbar) {
      this.focusCastbarContainer = document.getElementById('focus-castbar-container');
      this.focusCastbar = document.createElement("timer-bar");
      this.focusCastbarContainer.appendChild(this.focusCastbar);

      this.focusCastbar.classList.add("hide");
      this.focusCastbar.fg = kFocusCastbarColor;
    }
  }

  OnTargetCasting(cast_id, progress, length) {
    this.Init();

    if (cast_id == 0 || length == 0) {
      this.targetCastbar.classList.add("hide");
      delete this.casting['target'];
      return;
    }
    this.casting['target'] = {
      code: cast_id,
      progress: progress,
      length: length,
    };
    this.targetCastbar.classList.remove("hide");
    if (cast_id in gDbSpellNames)
      this.targetCastbar.lefttext = gDbSpellNames[cast_id];
    else
      this.targetCastbar.lefttext = cast_id.toString();
    this.targetCastbar.duration = length;
    this.targetCastbar.value = progress;

    this.targetCastbar.righttext = (length - progress).toFixed(1);
  }

  OnFocusCasting(cast_id, progress, length) {
    this.Init();

    if (cast_id == 0 || length == 0) {
      this.focusCastbar.classList.add("hide");
      delete this.casting['focus'];
      return;
    }
    this.casting['focus'] = {
      code: cast_id,
      progress: progress,
      length: length,
    };
    this.focusCastbar.classList.remove("hide");
    if (cast_id in gDbSpellNames)
      this.focusCastbar.lefttext = gDbSpellNames[cast_id];
    else
      this.focusCastbar.lefttext = cast_id.toString();
    this.focusCastbar.duration = length;
    this.focusCastbar.value = progress;

    this.focusCastbar.righttext = (length - progress).toFixed(1);
  }
};

var gCastbars = new CastBars();

if (kShowTargetCastbar) {
  document.addEventListener("onTargetCastingEvent", function (e) {
    gCastbars.OnTargetCasting(e.detail.castId, e.detail.timeProgress, e.detail.castLength);
  });
}
if (kShowFocusCastbar) {
  document.addEventListener("onFocusCastingEvent", function (e) {
    gCastbars.OnFocusCasting(e.detail.castId, e.detail.timeProgress, e.detail.castLength);
  });
}