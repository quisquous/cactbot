'use strict';

let Options = {
  Language: 'en',
  IQRHookQuantity: 100,
  IQRTugQuantity: 10,
  Colors: {
    'unknown': 'rgba(0, 0, 0, 0.5)',
    'light': 'rgba(99, 212, 152, 0.5)',
    'medium': 'rgba(245, 241, 32, 0.5)',
    'heavy': 'rgba(250, 15, 19, 0.5)',
  },
};

let gFisher;

class Fisher {
  constructor(element) {
    this.element = element;

    this.zone = null;
    this.job = null;

    this.baseBait = { id: null, name: null };
    this.moochBait = { id: null, name: null };
    this.lastCatch = { id: null, name: null };
    this.place = { id: null, name: null };
    this.fishing = false;
    this.mooching = false;
    this.snagging = false;
    this.chum = false;

    this.placeFish = null;
    this.hookTimes = null;
    this.tugTypes = null;

    this.castStart = null;
    this.castEnd = null;
    this.castGet = null;

    this.regex = {
      // Localized strings from: https://xivapi.com/LogMessage?pretty=1&columns=ID,Text_de,Text_en,Text_fr,Text_ja&ids=1110,1111,1112,1113,1116,1117,1118,1119,1120,1121,1127,1129,3511,3512,3515,3516,3525
      // 1110: cast
      // 1111: quit (stop)
      // 1112: quit (death)
      // 1113: quit (combat)
      // 1116: bite
      // 1117: nocatch (lose bait)
      // 1118: nocatch (lose lure)
      // 1119: nocatch (gets away)
      // 1120: nocatch (break)
      // 1121: mooch
      // 1127: nocatch (wrong bait)
      // 1128: nocatch (early hook)
      // 3511: nocatch (moving)
      // 3512: catch
      // 3515: nocatch (lose lure)
      // 3516: nocatch (anti-bot)
      // 3525: nocatch (inventory full)

      'de': {
        // Note, the preposition in German is stored in the cast string, so is ignored here.
        // We could attempt to trim prepositions in the fishing data and then include all
        // potential prepositions here, but I don't know German that well.
        'cast': /00:08c3:Du hast mit dem Fischen (.+) begonnen\./,
        'bite': /00:08c3:Etwas hat angebissen!/,
        'catch': /00:0843:Du hast (?:einen |eine )?.+?\s?([\w\s\-\'\.\d\u00c4-\u00fc]{3,})(?: | [^\w] |[^\w\s\-\'\u00c4-\u00fc].+ )\(\d/,
        'nocatch': /00:08c3:(?:Der Fisch hat den K\u00f6der vom Haken gefressen|.+ ist davongeschwommen|Der Fisch konnte sich vom Haken rei\u00dfen|Die Leine ist gerissen|Nichts bei\u00dft an|Du hast nichts gefangen|Du hast das Fischen abgebrochen|Deine Beute hat sich aus dem Staub gemacht und du hast|Die Fische sind misstrauisch und kommen keinen Ilm n\u00e4her|Du hast .+ geangelt, musst deinen Fang aber wieder freilassen, weil du nicht mehr davon besitzen kannst)/,
        'mooch': /00:08c3:Du hast die Leine mit/,
        'chumgain': /00:08ae:You gain the effect of Streuköder/,
        'chumfade': /00:08b0:You lose the effect of Streuköder/,
        'snaggain': /00:08ae:⇒ You gain the effect of Reißen/,
        'snagfade': /00:08b0:You lose the effect of Reßien/,
        'quit': /00:08c3:(?:Du hast das Fischen beendet\.|Das Fischen wurde abgebrochen)/,
      },
      'en': {
        'cast': /00:08c3:(?:[\w']\.?)(?:[\w'\s]+\.?)? cast(?:s?) (?:your|his|her) line (?:on|in|at) (?:the )?([\w\s'&()]+)\./,
        'bite': /00:08c3:Something bites!/,
        'catch': /00:0843:(?:[\w']\.?)(?:[\w'\s]+\.?)? land(?:s?) (?:a|an|[\d]+ )?.+?([\w\s\-\'\#\d]{3,})(?: | [^\w] |[^\w\s].+ )measuring \d/,
        'nocatch': /00:08c3:(Nothing bites\.|You reel in your line|You lose your bait|The fish gets away|You lose your |Your line breaks|The fish sense something amiss|You cannot carry any more)/,
        'mooch': /00:08c3:(?:[\w']\.?)(?:[\w'\s]+\.?)? recast(?:s?) (?:your|his|her)? line with the fish still hooked./,
        'chumgain': /00:08ae:You gain the effect of Chum/,
        'chumfade': /00:08b0:You lose the effect of Chum/,
        'snaggain': /00:08ae:⇒ You gain the effect of Snagging/,
        'snagfade': /00:08b0:You lose the effect of Snagging/,
        'quit': /00:08c3:(?:(?:[\w']\.?)(?:[\w'\s]+\.?)? put(?:s?) away (?:your|his|her) rod\.|Fishing canceled)/,
      },
      'fr': {
        'cast': /00:08c3:Vous commencez \u00e0 p\u00eacher. Point de p\u00eache: ([\w\s\'\(\)\u00c0-\u017f]+)/,
        'bite': /00:08c3:Vous avez une touche!/,
        'catch': /00:0843:Vous avez p\u00each\u00e9 (?:un |une )?.+?\s?([\w\s\-\'\u00b0\u00c0-\u017f]{3,})\ue03c?.+de \d/,
        'nocatch': /00:08c3:(?:L'app\u00e2t a disparu|Vous avez perdu votre|L'app\u00e2t a disparu|Le poisson a r\u00e9ussi \u00e0 se d\u00e9faire de l'hame\u00e7on|Le fil s'est cass\u00e9|Vous n'avez pas eu de touche|Vous n'avez pas r\u00e9ussi \u00e0 ferrer le poisson|Vous arr\u00eatez de p\u00eacher|Le poisson s'est enfui et a emport\u00e9 avec lui votre|Les poissons sont devenus m\u00e9fiants|Vous avez p\u00each\u00e9 .+, mais ne pouvez en poss\u00e9der davantage et l'avez donc rel\u00e2ch\u00e9)/,
        'mooch': /00:08c3:Vous essayez de p\u00eacher au vif avec/,
        'quit': /00:08c3:(?:Vous arr\u00eatez de p\u00eacher\.|P\u00eache interrompue)/,
      },
      'ja': {
        'cast': /00:08c3:(?:[\w\s-']+)\u306f([\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf]+)\u3067\u91e3\u308a\u3092\u958b\u59cb\u3057\u305f\u3002/,
        'bite': /00:08c3:\u9b5a\u3092\u30d5\u30c3\u30ad\u30f3\u30b0\u3057\u305f\uff01/,
        'catch': /00:0843:(?:[\w\s-']+)\u306f.+?([\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf]+)(?:[^\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf]+)?\uff08\d+\.\d\u30a4\u30eb\u30e0\uff09\u3092\u91e3\u308a\u4e0a\u3052\u305f\u3002/,
        'nocatch': /00:08c3:([\w\s-']+)?(?:\u3044\u3064\u306e\u9593\u306b\u304b\u91e3\u308a\u990c\u3092\u3068\u3089\u308c\u3066\u3057\u307e\u3063\u305f\u2026\u2026\u3002|\u3044\u3064\u306e\u9593\u306b\u304b.+\u3092\u30ed\u30b9\u30c8\u3057\u3066\u3057\u307e\u3063\u305f\uff01|\u3044\u3064\u306e\u9593\u306b\u304b\u91e3\u308a\u990c\u3092\u3068\u3089\u308c\u3066\u3057\u307e\u3063\u305f\u2026\u2026\u3002|\u91e3\u308a\u91dd\u306b\u304b\u304b\u3063\u305f\u9b5a\u306b\u9003\u3052\u3089\u308c\u3066\u3057\u307e\u3063\u305f\u2026\u2026\u3002|\u30e9\u30a4\u30f3\u30d6\u30ec\u30a4\u30af\uff01\uff01|\u4f55\u3082\u304b\u304b\u3089\u306a\u304b\u3063\u305f\u2026\u2026\u3002\n\n\u91e3\u308a\u990c\u304c\u91e3\u308a\u5834\u306b\u3042\u3063\u3066\u306a\u3044\u3088\u3046\u3060\u3002|\u4f55\u3082\u304b\u304b\u3089\u306a\u304b\u3063\u305f\u2026\u2026\u3002|.+\u306f\u91e3\u308a\u3092\u4e2d\u65ad\u3057\u305f\u3002|\u9b5a\u306b\u9003\u3052\u3089\u308c\u3001.+\u3092\u30ed\u30b9\u30c8\u3057\u3066\u3057\u307e\u3063\u305f\u2026\u2026\u3002|\u9b5a\u305f\u3061\u306b\u8b66\u6212\u3055\u308c\u3066\u3057\u307e\u3063\u305f\u3088\u3046\u3060\u2026\u2026|.+\u3092\u91e3\u308a\u4e0a\u3052\u305f\u304c\u3001\u3053\u308c\u4ee5\u4e0a\u6301\u3066\u306a\u3044\u305f\u3081\u30ea\u30ea\u30fc\u30b9\u3057\u305f\u3002)/,
        'mooch': /00:08c3:(?:[\w\s-']+)\u306f\u91e3\u308a\u4e0a\u3052\u305f.+\u3092\u614e\u91cd\u306b\u6295\u3052\u8fbc\u307f\u3001\u6cf3\u304c\u305b\u91e3\u308a\u3092\u8a66\u307f\u305f\u3002/,
        'quit': /00:08c3:(?:[\w\s-']+)?(?:\u306f\u91e3\u308a\u3092\u7d42\u3048\u305f\u3002|\u6226\u95d8\u4e0d\u80fd\u306b\u306a\u3063\u305f\u305f\u3081\u3001\u91e3\u308a\u304c\u4e2d\u65ad\u3055\u308c\u307e\u3057\u305f\u3002|\u306f\u91e3\u308a\u3092\u7d42\u3048\u305f\u3002|\u6575\u304b\u3089\u653b\u6483\u3092\u53d7\u3051\u305f\u305f\u3081\u3001\u91e3\u308a\u304c\u4e2d\u65ad\u3055\u308c\u307e\u3057\u305f\u3002)/,
      },
    };

    this.ui = new FisherUI(element);
    this.seaBase = new SeaBase();
  }

  getActiveBait() {
    if (this.mooching)
      return this.moochBait;

    return this.baseBait;
  }

  updateFishData() {
    // We can only know data for both of these
    if (!this.place || !this.getActiveBait()) {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }

    let _this = this;
    this.hookTimes = {};
    this.tugTypes = {};

    // Get the list of fish available at this particular place
    this.placeFish = this.seaBase.getFishForPlace(this.place);

    // We should update twice for each fish, one for hook times and one for tugs
    let queue = this.placeFish.length * 2;

    return new Promise(function(resolve, reject) {
      for (let index in _this.placeFish) {
        let fish = _this.placeFish[index];

        // Get the hook min and max times for the fish/bait/chum combo
        _this.seaBase.getHookTimes(fish, _this.getActiveBait(), _this.chum)
          .then(function(hookTimes) {
            _this.hookTimes[fish.name] = hookTimes;
            queue -= 1;
            if (!queue) {
              _this.ui.redrawFish(_this.hookTimes, _this.tugTypes);
              resolve();
            }
          });

        // Get the tug type for the fish
        _this.seaBase.getTug(fish).then(function(tug) {
          _this.tugTypes[fish.name] = tug;
          queue -= 1;
          if (!queue) {
            _this.ui.redrawFish(_this.hookTimes, _this.tugTypes);
            resolve();
          }
        });
      }
    });
  }

  handleBait(bait) {
    let name = '';
    // Mooching: bait is the last fish
    if (this.mooching) {
      this.moochBait = bait;
      name = bait.name;
    } else {
      this.baseBait = this.seaBase.getBait(bait);
      name = this.baseBait.name;
    }
    this.ui.setBait(name);
  }

  handleCast(place) {
    this.element.style.opacity = 1;
    this.castStart = new Date();
    this.castEnd = null;
    this.castGet = null;
    this.fishing = true;

    // Set place, if it's unset
    if (!this.place || !this.place.id) {
      this.place = this.seaBase.getPlace(place);
      // This lookup could fail and, for German,
      // this.place.name may differ from place
      // due to differing cast vs location names.
      if (this.place.id)
        this.ui.setPlace(this.place.name);
    }

    let _this = this;

    this.updateFishData().then(function() {
      _this.ui.startFishing();
    });
  }

  handleBite() {
    this.castEnd = new Date();
    this.ui.stopFishing();
  }

  handleCatch(fish) {
    this.castGet = new Date();
    this.lastCatch = this.seaBase.getFish(fish);
    this.fishing = false;

    if (this.place) {
      this.seaBase.addCatch({
        'fish': this.lastCatch.id,
        'bait': this.getActiveBait().id,
        'place': this.place.id,
        'castTimestamp': +this.castStart,
        'hookTime': (this.castEnd - this.castStart),
        'reelTime': (this.castGet - this.castEnd),
        'chum': this.chum?1:0,
        'snagging': this.snagging,
      });
    }

    if (this.mooching) {
      this.handleBait(this.baseBait);
      this.mooching = false;
    }
  }

  handleNoCatch() {
    this.fishing = false;
    this.castStart = null;
    this.castEnd = null;
    this.castGet = null;
    this.lastCatch = null;

    if (this.mooching) {
      this.handleBait(this.baseBait);
      this.mooching = false;
    }

    this.ui.stopFishing();
  }

  handleMooch() {
    this.mooching = true;

    this.handleBait(this.lastCatch);
    this.handleCast(this.place);
  }

  handleSnagGain() {
    this.snagging = true;
  }

  handleSnagFade() {
    this.snagging = false;
  }

  handleChumGain() {
    this.chum = true;
    this.updateFishData();
  }

  handleChumFade() {
    // Chum fades just before the catch appears, so we need to
    // delay it to record the catch with chum active
    let _this = this;
    setTimeout(function() {
      _this.chum = false;
    }, 1000);
  }

  handleQuit() {
    this.lastCatch = null;
    this.place = null;
    this.ui.setPlace(null);
    this.element.style.opacity = 0;
  }

  parseLine(log) {
    let result = null;

    for (let type in this.regex[Options.Language]) {
      result = this.regex[Options.Language][type].exec(log);
      if (result != null) {
        switch (type) {
        // case 'bait': this.handleBait(result[1]); break;
        case 'cast': this.handleCast(result[1]); break;
        case 'bite': this.handleBite(); break;
        case 'catch': this.handleCatch(result[1]); break;
        case 'nocatch': this.handleNoCatch(); break;
        case 'mooch': this.handleMooch(); break;
        case 'snaggain': this.handleSnagGain(); break;
        case 'snagfade': this.handleSnagFade(); break;
        case 'chumgain': this.handleChumGain(); break;
        case 'chumfade': this.handleChumFade(); break;
        case 'quit': this.handleQuit(); break;
        }
      }
    }
  }

  OnLogEvent(e) {
    if (this.job == 'FSH')
      e.detail.logs.forEach(this.parseLine, this);
  }

  OnZoneChange(e) {
    this.zone = e.detail.zoneName;
    this.place = null;
    this.ui.setPlace(null);
  }

  OnPlayerChange(e) {
    this.job = e.detail.job;
    if (this.job == 'FSH') {
      this.element.style.display = 'block';
      if (!this.fishing)
        this.handleBait(e.detail.bait);
    } else {
      this.element.style.display = 'none';
    }
  }
}

UserConfig.getUserConfigLocation('fisher', function() {
  gFisher = new Fisher(document.getElementById('fisher'));

  addOverlayListener('onLogEvent', function(e) {
    gFisher.OnLogEvent(e);
  });

  addOverlayListener('onZoneChangedEvent', function(e) {
    gFisher.OnZoneChange(e);
  });

  addOverlayListener('onPlayerChangedEvent', function(e) {
    gFisher.OnPlayerChange(e);
  });
});
