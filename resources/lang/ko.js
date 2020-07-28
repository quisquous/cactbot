'use strict';

class CactbotLanguageKo extends CactbotLanguage {
  constructor() {
    super('ko');
  }
}

UserConfig.registerLanguage('ko', function() {
  gLang = new CactbotLanguageKo();
});
