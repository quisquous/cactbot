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

    this.bait = null;
    this.fishing = false;
    this.mooching = false;
    this.snagging = false;
    this.chum = false;
    this.lastBait = null;
    this.hole = null;

    this.holeFish = null;
    this.hookTimes = null;
    this.tugTypes = null;

    this.lastCatch = null;

    this.castStart = null;
    this.castEnd = null;
    this.castGet = null;

    this.raf = null;

    this.regex = {
      'bait': /00:0039:You apply a ....([\w\s]+) to your line\./,
      'cast': /00:08c3:You cast your line (?:on|in|at) (?:the )?([\w\s]+)\./,
      'bite': /00:08c3:Something bites!/,
      'catch': /00:0843:You land (?:a|an|[\d]+ )?.+?([\w\s-']{3,})(?: | [^\w] |[^\w\s].+ )measuring/,
      'nocatch': /00:08c3:(Nothing bites\.|You reel in your line|You lose your bait|The fish gets away)/,
      'mooch': /00:08c3:You recast your line/,
      'chumgain': /00:08ae:You gain the effect of Chum/,
      'chumfade': /00:08b0:You lose the effect of Chum/,
      'snaggain': /00:08ae:⇒ You gain the effect of Snagging/,
      'snagfade': /00:08b0:You lose the effect of Snagging/,
      'quit': /00:08c3:You put away your rod\./,
    };

    this.ui = new FisherUI(element);
    this.seaBase = new SeaBase();
  }

  updateFishData(hole, bait) {
    // We can only know data for both of these
    if (!hole || !bait) {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }


    let _this = this;
    this.hookTimes = {};
    this.tugTypes = {};

    // Get the list of fish available at this particular hole
    this.holeFish = this.seaBase.getFishForHole(this.hole);

    // We should update twice for each fish, one for hook times and one for tugs
    let queue = this.holeFish.length * 2;

    return new Promise(function(resolve, reject) {
      for (let index in _this.holeFish) {
        let fish = _this.holeFish[index];

        // Get the hook min and max times for the fish/bait/chum combo
        _this.seaBase.getHookTimes(fish, _this.bait, _this.chum).then(function(hookTimes) {
          _this.hookTimes[fish] = hookTimes;
          queue -= 1;
          if (!queue) {
            _this.ui.redrawFish(_this.hookTimes, _this.tugTypes);
            resolve();
          }
        });

        // Get the tug type for the fish
        _this.seaBase.getTug(fish).then(function(tug) {
          _this.tugTypes[fish] = tug;
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
    // Bait is swapped
    this.bait = bait;
    this.ui.setBait(bait);
  }

  handleCast(hole) {
    this.element.style.opacity = 1;
    this.castStart = new Date();
    this.castEnd = null;
    this.castGet = null;
    this.fishing = true;

    // Set hole, if it's unset
    if (!this.hole) {
      this.hole = hole;
      this.ui.setHole(hole);
    }

    let _this = this;

    this.updateFishData(this.hole, this.bait).then(function() {
      _this.ui.startFishing();
    });
  }

  handleBite() {
    this.fishing = false;
    this.castEnd = new Date();
    this.ui.stopFishing();
  }

  handleCatch(fish) {
    this.castGet = new Date();
    this.lastCatch = fish;
    this.fishing = false;

    this.seaBase.addCatch({
      'fish': fish,
      'bait': this.bait,
      'hole': this.hole,
      'castTimestamp': +this.castStart,
      'hookTime': (this.castEnd - this.castStart),
      'reelTime': (this.castGet - this.castEnd),
      'chum': this.chum?1:0,
      'snagging': this.snagging,
    });

    if (this.mooching) {
      this.handleBait(this.lastBait);
      this.mooching = false;
    }

    this.chum = false;
  }

  handleNoCatch() {
    this.fishing = false;
    this.castStart = null;
    this.castEnd = null;
    this.castGet = null;
    this.lastCatch = null;

    if (this.mooching) {
      this.handleBait(this.lastBait);
      this.mooching = false;
    }

    this.ui.stopFishing();
  }

  handleMooch() {
    this.mooching = true;
    this.lastBait = this.bait;

    this.handleBait(this.lastCatch);
    this.handleCast(this.hole);
  }

  handleSnagGain() {
    this.snagging = true;
  }

  handleSnagFade() {
    this.snagging = false;
  }

  handleChumGain() {
    this.chum = true;
    this.updateFishData(this.hole, this.bait);
  }

  handleChumFade() {
    // Chum fades just before the catch appears, so we need to
    // delay it to record the catch with chum active
    setTimeout(function() {
      this.chum = false;
    }, 1000);
  }

  handleQuit() {
    this.lastCatch = null;
    this.hole = null;
    this.ui.setHole(null);
    this.element.style.opacity = 0.5;
  }

  parseLine(log) {
    let result = null;

    for (let type in this.regex) {
      result = this.regex[type].exec(log);
      if (result != null) {
        switch (type) {
        case 'bait': this.handleBait(result[1]); break;
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
    e.detail.logs.forEach(this.parseLine, this);
  }

  OnZoneChange(e) {
    this.zone = e.detail.zoneName;
    this.hole = null;
    this.ui.setHole(null);
  }

  OnPlayerChange(e) {
    if (e.detail.job == 'FSH')
      this.element.style.opacity = 1;
    else
      this.element.style.opacity = 0;
  }
}

function initialize() {
  if (gFisher) {
    document.addEventListener('onLogEvent', function(e) {
      gFisher.OnLogEvent(e);
    });

    document.addEventListener('onZoneChangedEvent', function(e) {
      gFisher.OnZoneChange(e);
    });

    document.addEventListener('onPlayerChangedEvent', function(e) {
      gFisher.OnPlayerChange(e);
    });
  } else {
    setTimeout(initialize, 250);
  }
}

initialize();

UserConfig.getUserConfigLocation('fisher', function() {
  gFisher = new Fisher(document.getElementById('fisher'));
  window.gFisher = gFisher;
});
