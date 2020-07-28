'use strict';

class CactbotLanguageFr extends CactbotLanguage {
  constructor() {
    super('fr');
  }

  InitStrings() {
    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.kPetNames = Object.freeze([
      // Pulled from https://xivapi.com/Pet?pretty=true&language=fr
      'Carbuncle émeraude',
      'Carbuncle topaze',
      'Ifrit-Egi',
      'Titan-Egi',
      'Garuda-Egi',
      'Eos',
      'Selene',
      'Auto-tourelle Tour',
      'Auto-tourelle Fou',
      'Demi-Bahamut',
      'Demi-Phénix',
      'Séraphin',
      'Carbuncle hécatolite',
      'Estime',
      'Automate Reine',
      'Ombre',
    ]);

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
