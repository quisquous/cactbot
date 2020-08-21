'use strict';

class StubbedPopupText extends PopupText {
  constructor(options) {
    // We don't want the super constructor registering event listeners so we use
    // a little known piece of es6 syntax to avoid having to call it
    let ret = Object.create(new.target.prototype);

    ret.options = options;
    ret.triggers = [];
    ret.netTriggers = [];
    ret.timers = {};
    ret.inCombat = false;
    ret.resetWhenOutOfCombat = true;
    
    ret.parserLang = ret.options.ParserLanguage || 'en';
    ret.displayLang = ret.options.AlertsLanguage || ret.options.DisplayLanguage || ret.options.ParserLanguage || 'en';

    ret.partyTracker = new PartyTracker();
    ret.Reset();

    ret.infoText = ret.alertText = ret.alarmText = {
      getElementsByClassName: () => [null],
    };

    return ret;
  }

  OnDataFilesRead(e) {
    // Work around Options.Triggers getting modified by the global scope here
    let triggers = Options.Triggers;
    Options.Triggers = EmulatorCommon.cloneData(triggers, []);
    super.OnDataFilesRead(e);
    Options.Triggers = triggers;
  }
}
