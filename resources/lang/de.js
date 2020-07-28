'use strict';

class CactbotLanguageDe extends CactbotLanguage {
  constructor() {
    super('de');
  }
}

UserConfig.registerLanguage('de', function() {
  gLang = new CactbotLanguageDe();
});
