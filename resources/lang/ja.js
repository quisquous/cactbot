'use strict';

class CactbotLanguageJa extends CactbotLanguage {
  constructor() {
    super('ja');
  }
}

UserConfig.registerLanguage('ja', function() {
  gLang = new CactbotLanguageJa();
});
