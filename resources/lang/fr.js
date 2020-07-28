'use strict';

class CactbotLanguageFr extends CactbotLanguage {
  constructor() {
    super('fr');
  }
}

UserConfig.registerLanguage('fr', function() {
  gLang = new CactbotLanguageFr();
});
