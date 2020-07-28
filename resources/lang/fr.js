'use strict';

class CactbotLanguageFr extends CactbotLanguage {
  constructor() {
    super('fr');
  }

  InitStrings() {
    this.countdownStartRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Début du combat dans (?<time>\\y{Float}) secondes[ ]?!',
      });
    };
    this.countdownEngageRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'À l\'attaque[ ]?!',
      });
    };
    this.countdownCancelRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Le compte à rebours a été interrompu par (?<name>\\y{Name})[ ]?\\.',
      });
    };
    this.areaSealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Fermeture (?<name>\\y{Name}) dans (?<time>\\y{Float}) secondes[ ]?\\.',
      });
    };
    this.areaUnsealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Ouverture (?<name>\\y{Name})[ ]?!',
      });
    };
  }
}

UserConfig.registerLanguage('fr', function() {
  gLang = new CactbotLanguageFr();
});
