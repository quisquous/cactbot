'use strict';

class CactbotLanguageFr extends CactbotLanguage {
  constructor(playerName) {
    super('fr', playerName);
  }

  InitStrings(playerName) {
    this.kEffect = Object.freeze({
      BluntResistDown: 'Résistance au contondant réduite', // 0x23d, 0x335, 0x3a3
      VerstoneReady: 'VerTerre préparée', // 0x4d3
      VerfireReady: 'VerFeu préparé', // 0x4d2
      Impactful: 'Impact préparé', // 0x557
      FurtherRuin: 'Extra Ruine renforcée', // 0x4bc
      Aetherflow: 'Flux d\'éther', // 0x130
      WellFed: 'Repu', // 0x30
      OpoOpoForm: 'Posture de l\'opo-opo', // 0x6b
      RaptorForm: 'Posture du raptor', // 0x6c
      CoeurlForm: 'Posture du coeurl', // 0x6d
      PerfectBalance: 'Équilibre parfait', // 0x6e
      Medicated: 'Médicamenté', // tbc
      BattleLitany: 'Litanie combattante', // 0x312
      Embolden: 'Enhardissement', // 0x4d7
      Arrow: 'La Flèche', // 0x75c
      Balance: 'La Balance', // 0x75a
      Bole: 'Le Tronc', // 0x75b
      Ewer: 'L\'aiguière', // 0x75e
      Spear: 'L\'épieu', // 0x75d
      Spire: 'La Tour', // 0x75f
      LadyOfCrowns: 'Reine Des Couronnes', // 0x755
      LordOfCrowns: 'Roi Des Couronnes', // 0x754
      Hypercharge: 'Hypercharge', // 0x2b0
      LeftEye: 'Œil gauche', // 0x4a0
      RightEye: 'Œil droit', // 0x49f
      Brotherhood: 'Fraternité', // 0x49e
      Devotion: 'Dévouement', // 0x4bd
      FoeRequiem: 'Requiem ennemi', // up 0x8b, down 0x8c
      LeadenFist: 'Poings de plomb',
      Devilment: 'Tango endiablé',
      TechnicalFinish: 'Final technique',
      StandardFinish: 'Final classique',
      Thundercloud: 'Nuage d\'orage',
      Firestarter: 'Pyromane',
      BattleVoice: 'Voix de combat',

      Petrification: 'Pétrification',
      BeyondDeath: 'Outre-mort',
      Burns: 'Brûlure',
      Sludge: 'Emboué',
      Doom: 'Glas',
      StoneCurse: 'Piège de pierre',
      Imp: 'Kappa',
      Toad: 'Crapaud',
      FoolsTumble: 'Acrophobie illusoire', // 0x183
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.countdownStartRegex = function() {
      return Regexes.parse(/Début du combat dans (\y{Float}) secondes !/);
    };
    this.countdownEngageRegex = function() {
      return /:À l'attaque !/;
    };
    this.countdownCancelRegex = function() {
      return /Le compte à rebours a été interrompu par /;
    };
    this.areaSealRegex = function() {
      return /:Fermeture (.*) dans /;
    };
    this.areaUnsealRegex = function() {
      return /:Ouverture (.*)/;
    };
  }
}

UserConfig.registerLanguage('fr', function() {
  gLang = new CactbotLanguageFr();
});
