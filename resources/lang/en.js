'use strict';

class CactbotLanguageEn extends CactbotLanguage {
  constructor() {
    super('en');
  }
}

UserConfig.registerLanguage('en', function() {
  gLang = new CactbotLanguageEn();
});
