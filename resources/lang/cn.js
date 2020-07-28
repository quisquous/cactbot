'use strict';

class CactbotLanguageCn extends CactbotLanguage {
  constructor() {
    super('cn');
  }
}

UserConfig.registerLanguage('cn', function() {
  gLang = new CactbotLanguageCn();
});
