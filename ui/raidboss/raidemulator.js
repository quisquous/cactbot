'use strict';

let gLogCollector;
let gEmulatorView;

// Responsible for handling importing the fights.
// When a fight is imported, it will call the addFightCallback.
class LogCollector {
  constructor(addFightCallback) {
    this.currentZone = null;
    // { key:, zoneName:, startDate:, endDate:, durationMs:, logs: }
    this.fights = [];
    this.currentFight = null;
    this.addFightCallback = addFightCallback;
    this.wait;
    this.sealRegexes = {
      ja: Regexes.Parse(/ 00:0839:(.*)の封鎖まであと\y{Float}秒/),
      en: / 00:0839:(.*) will be sealed off in /,
      de: Regexes.Parse(/ 00:0839:Noch \y{Float} Sekunden, bis sich (.*) schließt/),
      fr: / 00:0839:Fermeture (.*) dans /,
    };
    this.unsealRegexes = {
      ja: / 00:0839:(.*)の封鎖が解かれた……/,
      en: / 00:0839:(.*) is no longer sealed/,
      de: / 00:0839:(?:Der Zugang zu\w* |)(.*) öffnet sich (?:erneut|wieder)/,
      fr: / 00:0839:Ouverture (.*)/,
    };
    this.countdownEngageRegexes = {
      ja: / 00:0039:戦闘開始！/,
      en: / 00:0039:Engage!/,
      de: / 00:0039:Start!/,
      fr: / 00:0039:À l'attaque !/,
    };
  }

  MatchStart(log) {
    for (let i in this.countdownEngageRegexes) {
      if (log.match(this.countdownEngageRegexes[i]))
        return i;
    }
    for (let i in this.sealRegexes) {
      if (log.match(this.sealRegexes[i]))
        return i;
    }
  }

  MatchEnd(log) {
    if (this.IsWipe(log))
      return true;
    for (let i in this.unsealRegexes) {
      if (log.match(this.unsealRegexes[i]))
        return { matches: log.match(this.unsealRegexes[i]) };
    }
  }

  AppendImportLogs(logs) {
    // Define now to save time later
    let playerRegex = Regexes.Parse(/ 15:(\y{ObjectId}):(\y{Name}):(\y{AbilityCode}):/);

    for (let i = 0; i < logs.length; ++i) {
      let log = logs[i];
      let logZoneChange = this.ParseZoneChange(log);

      if (logZoneChange && logZoneChange != this.currentZone) {
        if (this.currentFight) {
          this.currentFight.fightName = this.currentFight.zoneName;
          this.EndFight(log);
        }
        this.currentZone = logZoneChange;
      }

      if (this.currentFight) {
        this.currentFight.logs.push(log);
        let matches = log.match(playerRegex);

        if (matches)
          this.SearchPlayers(matches);

        if (this.MatchEnd(log)) {
          let unseal = this.MatchEnd(log);
          if (typeof unseal == 'object')
            this.currentFight.fightName = unseal.matches[1];
          else
            this.currentFight.fightName = this.currentFight.zoneName;
          this.EndFight(log);
        }
      } else if (this.MatchStart(log)) {
        // For consistency, only start fights on a countdown.  This
        // makes it easy to know where to start all fights (vs
        // reading timeline files or some such).
        if (!this.currentZone)
          console.error('Network log file specifies no zone?');

        this.currentFight = {
          zoneName: this.currentZone,
          fightName: null,
          startDate: dateFromLogLine(log),
          logs: [log],
          durationMs: null,
          key: this.fights.length,
          players: {},
          lang: this.MatchStart(log),
        };
      }
    }
  }

  EndFight(log) {
    let endDate = dateFromLogLine(log);
    let fight = this.currentFight;
    fight.durationMs = endDate.getTime() - fight.startDate.getTime();
    fight.endDate = endDate;

    // Only add the fight if it hasn't been seen before.  The key
    // generated internally by the collector is always unique so
    // can't be used in this comparison.
    this.currentFight = null;
    for (let i = 0; i < this.fights.length; ++i) {
      let f = this.fights[i];
      if (f.logs[0] == fight.logs[0] && f.currentZone == fight.currentZone)
        return;
    }

    // Trim log before pushing
    // 00:0038 = echo | 00:0039 = countdown | 14, 15, 16 = attack related stuff
    // 1A = gaining effects -> 1E losing effects | 1B = head Markers | 01 = zone change
    // 03,04 = adding/removing combatant | 21 = wipe? | 00:0839: = sealed.
    // 23 = tethers
    // 00:332e: = Relative Virtue
    // Add more to regex only if needed
    fight.logs = fight.logs.filter(function(line) {
      return / (?:1[456AB]|23):| 0[134]:| 00:(?:003[89]|0839|0044|332e):| 21:.{8}:/.test(line);
    }).sort();

    this.fights.push(fight);
    if (this.addFightCallback)
      this.addFightCallback(fight);
  }

  IsWipe(log) {
    // Actor control line list: https://gist.github.com/quisquous/250001cbce232a48e6a9ce772a56675a
    return log.match(/ 21:........:40000010:/) || log.indexOf('00:0038:cactbot wipe') != -1;
  }

  ParseZoneChange(log) {
    let m = log.match(/ 01:Changed Zone to (.*)\./);
    if (!m)
      return;
    return m[1];
  }

  ClearStorage() {
    localStorage.clear();
    let labels = document.querySelectorAll('label[for]');
    if (!labels.length)
      return;

    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent.indexOf(' (stored)') > -1)
        labels[i].textContent = labels[i].textContent.replace(' (stored)', '');
    }
  }

  StoreFights() {
    let fight = gEmulatorView.selectedFight;
    if (!fight)
      return;

    let fightKey = 'fight' + fight.key;
    let label = document.querySelector('label[for="' + fightKey + '"]');

    if (label.textContent.indexOf(' (stored)') > -1) {
      let stored = JSON.parse(localStorage.getItem('fights'));
      for (let i = 0; i < stored.length; i++) {
        if (fight.key == stored[i].key)
          stored.splice(i, 1);
      }
      localStorage.setItem('fights', JSON.stringify(stored));
      label.textContent = label.textContent.replace(' (stored)', '');
      return;
    }

    let fights = [];
    if (localStorage.fights)
      fights = JSON.parse(localStorage.getItem('fights'));

    let preserveOld = fights;
    fights.push(fight);

    try {
      localStorage.setItem('fights', JSON.stringify(fights));
      label.textContent += ' (stored)';
    } catch (err) {
      console.error('Exceeded localStorage capacity!');
      localStorage.setItem('fights', preserveOld);
    }
  }

  RestoreFights() {
    if (!localStorage.fights)
      return;

    let oldSelection = null;
    if (localStorage.fightKey)
      oldSelection = localStorage.fightKey;

    this.fights = JSON.parse(localStorage.getItem('fights'));
    for (let i = 0; i < this.fights.length; i++) {
      let fight = this.fights[i];
      fight.startDate = new Date(Date.parse(fight.startDate));
      fight.endDate = new Date(Date.parse(fight.endDate));
      let oldKey = 'fight' + fight.key;
      fight.key = i;
      if (this.addFightCallback)
        this.addFightCallback(fight);
      let fightKey = 'fight' + fight.key;
      document.querySelector('label[for="' + fightKey + '"]').textContent += ' (stored)';

      if (oldSelection == oldKey) {
        let fightKey = 'fight' + fight.key;
        document.getElementById(fightKey).checked = true;
        gEmulatorView.SelectFight(fightKey);
      }
    }
    // Store fights in new order
    localStorage.setItem('fights', JSON.stringify(this.fights));
  }

  SearchPlayers(matches) {
    if (matches[1] in this.currentFight.players)
      return;
    let moves = {
      PLD: [
        9, 20, 11, 14, 15, 24, 16, 21, 25, 28, 26, 17, 27, 19, 29, 22, 23, 30,
        3542, 3538, 3540, 3541, 3539, 7381, 7382, 7383, 7384, 7385,
      ],
      WAR: [
        31, 35, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
        3548, 3549, 3550, 3551, 3552, 7386, 7387, 7388, 7389,
      ],
      DRK: [
        3617, 3619, 3621, 3623, 3624, 3625, 3627, 3628, 2629, 3631, 3632, 3633, 3634, 3635,
        3636, 3638, 3639, 3640, 3641, 3642, 3643, 7390, 7391, 7392, 7393,
      ],
      WHM: [
        119, 120, 121, 124, 125, 127, 128, 131, 132, 133, 134, 135, 136, 137, 139, 140,
        3568, 3569, 3570, 3571, 3572, 7430, 7431, 7432, 7433,
      ],
      SCH: [
        117, 185, 186, 188, 189, 3583, 3584, 3585, 3586, 3587, 7434, 7435, 7436, 7437, 7869,
      ],
      AST: [
        3590, 3591, 3592, 3593, 3594, 3595, 3596, 3598, 3599, 3600, 3601, 3603, 3604, 3605,
        3606, 3608, 3610, 3611, 3612, 3613, 3614, 3615, 3616, 4645, 4646, 7439, 7442, 7443,
        7444, 7445, 7448,
      ],
      MNK: [
        53, 54, 56, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 70, 71, 72, 73, 74,
        3543, 3544, 3545, 3546, 3547, 4262, 7394, 7395, 7396, 7864, 7865, 7866, 7868,
      ],
      DRG: [
        75, 78, 79, 81, 83, 84, 85, 86, 87, 88, 90, 92, 94, 95, 96,
        3553, 3554, 3555, 3556, 3557, 7397, 7398, 7399, 7400,
      ],
      NIN: [
        2240, 2241, 2242, 2245, 2246, 2247, 2248, 2253, 2254, 2255, 2256, 2257, 2258, 2259,
        2260, 2261, 2262, 2263, 2264, 2265, 2266, 2267, 2268, 2269, 2270, 2271, 2272, 3563,
        3564, 3565, 3566, 3567, 7401, 7402, 7403,
      ],
      SAM: [
        7477, 7478, 7479, 7480, 7481, 7482, 7483, 7484, 7485, 7486, 7487, 7488, 7489, 7490,
        7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7500, 7501, 7502, 7867,
      ],
      BRD: [
        97, 98, 100, 101, 103, 106, 107, 110, 112, 113, 114, 115, 116, 117, 118, 3558, 3559,
        3560, 3561, 3562, 7404, 7405, 7406, 7407, 7408, 7409,
      ],
      MCH: [
        2864, 2865, 2866, 2867, 2868, 2870, 2872, 2873, 2874, 2875, 2876, 2878, 2879, 2880,
        2881, 2885, 2887, 2888, 2890, 3487, 7410, 7411, 7412, 7413, 7414, 7415, 7418, 9015, 9372,
      ],
      BLM: [
        141, 142, 144, 145, 146, 147, 149, 152, 153, 154, 155, 156, 157, 158, 159, 162,
        3573, 3574, 3575, 3576, 3577, 7419, 7420, 7421, 7422, 7447,
      ],
      SMN: [
        180, 181, 182, 184, 3578, 3579, 3580, 3581, 3582, 7423, 7424, 7425, 7426, 7427, 7429,
      ],
      RDM: [
        7503, 7504, 7505, 7506, 7507, 7508, 7509, 7510, 7411, 7512, 7513, 7514, 7515, 7516,
        7517, 7518, 7519, 7520, 7521, 7522, 7523, 7524, 7525, 7526, 7527, 7528, 7529, 7530,
      ],
      BLU: [
        0x2C8E, 0x2CA0, 0x2C8C, 0x2C92, 0x2CA3, 0x2CA6,
      ],
    };
    let player = {
      id: matches[1], name: matches[2],
    };
    let ability = parseInt(matches[3], 16);
    for (let m in moves) {
      for (let a = 0; a < moves[m].length; a++) {
        if (ability == moves[m][a]) {
          player.job = m;
          break;
        }
      }
      if (player.job)
        break;
    }
    if (['PLD', 'WAR', 'DRK'].indexOf(player.job) > -1)
      player.role = 'tank';
    if (['WHM', 'SCH', 'AST'].indexOf(player.job) > -1)
      player.role = 'healer';
    if (['MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'BLM', 'SMN', 'RDM', 'BLU'].indexOf(player.job) > -1)
      player.role = 'dps';

    if (player.role && player.job)
      this.currentFight.players[player.id] = player;
  }
};

// Responsible for playing back a fight and emitting events as needed.
class LogPlayer {
  LogPlayer() {
    this.Reset();
  }

  Reset() {
    this.fight = null;
    this.localStartTime = null;
    this.logIdx = null;
  }

  SendLogEvent(logs) {
    let evt = new CustomEvent('onLogEvent', { detail: { logs: logs } });
    document.dispatchEvent(evt);
  }

  SendZoneEvent(zoneName) {
    let evt = new CustomEvent('onZoneChangedEvent', { detail: { zoneName: zoneName } });
    document.dispatchEvent(evt);
  }

  SendPlayerEvent(name, job, id) {
    let evt = new CustomEvent('onPlayerChangedEvent', { detail: {
      id: id,
      name: name,
      job: job,
    } });
    document.dispatchEvent(evt);
  }

  Start(fight) {
    this.localStartMs = +new Date();
    this.logStartMs = fight.startDate.getTime();
    this.fight = fight;
    this.logIdx = 0;

    this.SendZoneEvent(fight.zoneName);
    this.Tick();
  }

  IsPlaying() {
    return !!this.fight;
  }

  Tick() {
    // The last raf doesn't get cancelled, so just silently ignore.
    if (!this.fight)
      return;

    let timeMs = +new Date();
    let elapsedMs = timeMs - this.localStartMs;
    let cutOffTimeMs = this.logStartMs + elapsedMs;

    // Walk through all logs that should be emitted since the last tick.
    let logs = [];
    while (dateFromLogLine(this.fight.logs[this.logIdx]).getTime() <= cutOffTimeMs) {
      logs.push(this.fight.logs[this.logIdx]);
      this.logIdx++;

      if (this.logIdx >= this.fight.logs.length) {
        this.SendLogEvent(logs);
        this.Stop();
        return;
      }
    }
    this.SendLogEvent(logs);
  }

  Stop() {
    // FIXME: there's surely some better way to stop things.
    this.SendLogEvent(['00:0038:cactbot wipe']);
    this.Reset();
  }
};

class EmulatorView {
  constructor(
      fightListElement, timerElements, elapsedElement, infoElement,
      partyElement, currentPlayerElement, triggerInfoElement
  ) {
    this.fightListElement = fightListElement;
    this.timerElements = timerElements;
    this.elapsedElement = elapsedElement;
    this.infoElement = infoElement;

    this.logPlayer = new LogPlayer();
    this.fightMap = {};
    this.selectedFight = null;
    this.startTimeLocalMs = null;
    this.fightInfo = {};

    this.partyElement = partyElement;
    this.currentPlayerElement = currentPlayerElement;
    this.triggerInfoElement = triggerInfoElement;

    this.suppressedTriggers = {};
  }

  DateToTimeStr(date) {
    let pad2 = function(num) {
      return ('0' + num).slice(-2);
    };
    return pad2(date.getHours()) + ':' + pad2(date.getMinutes());
  }

  AddFight(fight) {
    // Note: this uses radio inputs to allow the user to select from a list of
    // fights that were imported.  It might seem like a <select> would be
    // more natural, but the native UI for a <select> behaves very badly inside
    // of CEF, sometimes causing the overlay to be resized (?!).
    let parentDiv = document.createElement('div');
    parentDiv.classList.add('fight-option');
    let radioElement = document.createElement('input');
    let fightKey = 'fight' + fight.key;
    this.fightMap[fightKey] = fight;

    radioElement.id = fightKey;
    radioElement.name = 'fight';
    radioElement.type = 'radio';
    let labelElement = document.createElement('label');
    labelElement.setAttribute('for', radioElement.id);
    labelElement.className = 'nowrap';

    let dateStr = this.DateToTimeStr(fight.startDate);
    let durTotalSeconds = Math.ceil(fight.durationMs / 1000);
    let durMinutes = Math.floor(durTotalSeconds / 60);
    let durStr = '';
    if (durMinutes > 0)
      durStr += durMinutes + 'm';
    durStr += (durTotalSeconds % 60) + 's';
    labelElement.innerText = fight.fightName + ', ' + dateStr + ', ' + durStr;

    parentDiv.appendChild(radioElement);
    parentDiv.appendChild(labelElement);
    this.fightListElement.appendChild(parentDiv);

    radioElement.addEventListener('change', (function() {
      this.SelectFight(radioElement.id);
    }).bind(this));
  }

  SelectFight(fightKey) {
    let fight = this.fightMap[fightKey];
    this.selectedFight = fight;

    if (!this.playingFight) {
      this.logPlayer.SendZoneEvent(fight.zoneName);
      this.ShowFightInfo(this.selectedFight);

      // Simply push first Player
      let name = this.fightInfo[fight.key].party[0].name;
      let job = this.fightInfo[fight.key].party[0].job;
      let id = this.fightInfo[fight.key].party[0].id;
      this.logPlayer.SendPlayerEvent(name, job, id);

      // change Language
      gPopupText.options.Language = fight.lang;
      gPopupText.ReloadTimelines();

      document.getElementById('triggerline-playAs').style.display = 'none';

      window.setTimeout(function() {
        this.AsyncAnalyzer();
      }.bind(this), 0);
    }

    try {
      localStorage.setItem('fightKey', fightKey);
    } catch (err) {
      console.error('Exceeded localStorage capacity!');
    }
  }

  Start() {
    if (!this.selectedFight)
      return;
    let fight = this.selectedFight;

    // Reset progress bars
    for (let i = 0; i < this.timerElements.length; i++)
      this.timerElements[i].style.width = '0%';

    this.logPlayer.Start(fight);
    this.localStartMs = +new Date();
    this.playingFight = fight;
    this.ShowFightInfo(this.playingFight);
    this.Tick();
  }

  Tick() {
    this.logPlayer.Tick();
    if (!this.logPlayer.IsPlaying())
      return;

    let localTimeMs = +new Date();
    let elapsedMs = localTimeMs - this.localStartMs;
    let totalTimeMs = this.playingFight.durationMs;

    let msToTimeStr = function(ms) {
      let pad = function(num, pad) {
        return ('00' + num).slice(-pad);
      };
      let minStr = pad(Math.floor(ms / 60000), 2);
      let secStr = pad(Math.ceil(ms / 1000) % 60, 2);
      return minStr + ':' + secStr;
    };

    // Update progress bars
    for (let i = 0; i < this.timerElements.length; i++)
      this.timerElements[i].style.width = (elapsedMs / totalTimeMs * 100) + '%';

    this.elapsedElement.innerText =
        msToTimeStr(elapsedMs) + ' / ' + msToTimeStr(totalTimeMs);

    window.requestAnimationFrame(this.Tick.bind(this));
  }

  Stop() {
    this.logPlayer.Stop();
    this.localStartMs = null;
    this.playingFight = null;

    for (let i = 0; i < this.timerElements.length; i++)
      this.timerElements[i].style.width = '0%';

    this.ShowFightInfo(this.selectedFight);
  }

  ShowFightInfo(fight) {
    if (!fight) {
      this.infoElement.innerText = '';
      return;
    }
    let info;
    let party;

    // Use cached fight info, if available
    if (!this.fightInfo[fight.key]) {
      // Save info in a seperate object to save space for localStorage
      this.fightInfo[fight.key] = { info: '', party: [] };
      party = this.fightInfo[fight.key].party;
      info = this.fightInfo[fight.key].info;

      // Walk through all the logs and figure out info from the pull.
      let isClear = false;
      for (let i = 0; i < fight.logs.length; ++i) {
        let log = fight.logs[i];
        if (log.indexOf(' 21:') != -1 && log.match(/ 21:........:40000003:/))
          isClear = true;
      }

      // List actors and sort players by role
      let actors = [];
      for (let p in fight.players) {
        party.push(fight.players[p]);
        actors.push(fight.players[p].name);
      }

      party = party.sort(function(a, b) {
        let jobOrder = ['PLD', 'WAR', 'DKR', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'BLM', 'SMN', 'RDM', 'BLU'];
        if (jobOrder.indexOf(a.job) < jobOrder.indexOf(b.job))
          return -1;
        if (jobOrder.indexOf(a.job) > jobOrder.indexOf(b.job))
          return 1;
        return 0;
      });

      info += '<div class="nowrap">' + fight.zoneName + '</div><div class="subtitle">Applied Zone</div>';
      info += '<div class="nowrap">' + this.DateToTimeStr(fight.startDate) + ' - ' + this.DateToTimeStr(fight.endDate);
      info += (isClear ? ' (Clear)' : ' (Wipe?)') + '</div><div class="subtitle">Time</div>';
      info += '<div class="actors">' + actors.join(', ') + '</div><div class="subtitle">Actors</div>';

      this.fightInfo[fight.key].info = info;
      this.fightInfo[fight.key].party = party;
    } else {
      info = this.fightInfo[fight.key].info;
      party = this.fightInfo[fight.key].party;
    }

    this.infoElement.innerHTML = info;

    // Add playerIcon to list
    while (this.partyElement.firstChild)
      this.partyElement.firstChild.remove();

    for (let i = 0; i < party.length; i++) {
      let playerElement = document.createElement('div');
      playerElement.className = 'jobicon ' + party[i].job;
      playerElement.id = party[i].id;
      playerElement.setAttribute('name', party[i].name);
      playerElement.setAttribute('job', party[i].job);
      playerElement.setAttribute('role', party[i].role);
      playerElement.addEventListener('click', function(e) {
        // PlayAs Event
        let id = e.target.id;
        let name = e.target.getAttribute('name');
        let job = e.target.getAttribute('job');
        let role = e.target.getAttribute('role');
        gEmulatorView.logPlayer.SendPlayerEvent(name, job, id);

        // Clear playAs Triggerline
        while (document.getElementById('triggerline-playAs').firstChild)
          document.getElementById('triggerline-playAs').firstChild.remove();
        // Add timerbar
        let timerbar = document.createElement('div');
        timerbar.className = 'triggerline-timer';
        document.getElementById('triggerline-playAs').appendChild(timerbar);

        gEmulatorView.AnalyzeFight({ id: { name: name, job: job, role: role } });
        document.getElementById('triggerline-playAs').style.display = 'block';
      });
      this.partyElement.appendChild(playerElement);
    }
  }

  AsyncAnalyzer() {
    // Clear all triggerlines
    let triggerlines = document.getElementsByClassName('triggerline');
    for (let i = 0; i < triggerlines.length; i++) {
      while (triggerlines[i].firstChild)
        triggerlines[i].firstChild.remove();
      // Add timerbar
      let timerbar = document.createElement('div');
      timerbar.className = 'triggerline-timer';
      triggerlines[i].appendChild(timerbar);
    }

    // reset global trigger suppressions
    this.suppressedTriggers = {};

    this.AnalyzeFight('all');
    this.AnalyzeFight('tank');
    this.AnalyzeFight('healer');
    this.AnalyzeFight('dps');
  }

  AnalyzeFight(role) {
    let triggers = gPopupText.triggers;
    let data = {
      lang: gPopupText.data.lang,
    };
    let logs = this.selectedFight.logs;
    data.ShortName = function(name) {
      return name.split(/\s/)[0];
    };
    // Reset local Suppression
    this.suppressedTriggersLocal = {};

    // Get all players of said role
    let players = {};
    if (typeof role === 'object') {
      // Convert playerObject to role and players
      players = role;
      players.mode = 'playAs';
      role = players[Object.keys(role)[0]].role;
    } else if (role == 'all') {
      players = { '00000000': { name: 'Generic Player', job: 'none', role: 'none' } };
    } else {
      for (let p in this.selectedFight.players) {
        if (this.selectedFight.players[p].role == role) {
          Object.assign(players, {
            [p]: {
              name: this.selectedFight.players[p].name,
              job: this.selectedFight.players[p].job,
              role: this.selectedFight.players[p].role,
            },
          });
        }
      }
    }

    for (let i = 0; i < logs.length; i++) {
      let log = logs[i];
      for (let t = 0; t < triggers.length; t++) {
        let trigger = triggers[t];
        if (trigger.disabled)
          continue;

        let matches = log.match(trigger.localRegex);
        if (matches)
          this.RunTriggers(log, trigger, players, role, data, matches);
      }
    }
  }

  RunTriggers(log, trigger, players, role, data, matches) {
    let run;
    let result;
    let timestamp = dateFromLogLine(log).getTime();
    let delay = 0;
    let suppress = 1;
    let suppressed = this.suppressedTriggersLocal;

    if (role == 'all')
      suppressed = this.suppressedTriggers;

    if (typeof trigger.delaySeconds === 'function')
      delay = trigger.delaySeconds(data, matches) * 1000 || delay * 1000;
    if (typeof trigger.delaySeconds === 'number')
      delay = trigger.delaySeconds * 1000 || delay * 1000;

    let startTime = this.selectedFight.startDate.getTime();
    let endTime = this.selectedFight.endDate.getTime();
    let pos = (timestamp + delay - startTime) / (endTime - startTime) * 100;

    // Checking for any trigger output
    for (let p in players) {
      data.me = players[p].name, data.role = players[p].role, data.job = players[p].job;

      // first check condition
      if (typeof trigger.condition === 'function' && !trigger.condition(data, matches))
        continue; // check next player

      // preRun
      if (typeof trigger.preRun === 'function') {
        run = true;
        trigger.preRun(data, matches);
      }

      // popup text
      if (typeof trigger.alarmText === 'function' && trigger.alarmText(data, matches))
        result = trigger.alarmText(data, matches);
      else if (typeof trigger.alarmText === 'object')
        result = trigger.alarmText;

      if (typeof trigger.alertText === 'function' && trigger.alertText(data, matches))
        result = trigger.alertText(data, matches);
      else if (typeof trigger.alertText === 'object')
        result = trigger.alertText;

      if (typeof trigger.infoText === 'function' && trigger.infoText(data, matches))
        result = trigger.infoText(data, matches);
      else if (typeof trigger.infoText === 'object')
        result = trigger.infoText;

      // execute run function after text!
      if (typeof trigger.run === 'function') {
        run = true;
        trigger.run(data, matches);
      }

      if (result || run)
        break; // trigger is already handled for this role so break loop
    }

    // checking for suppression, first local then global
    if (typeof suppressed[trigger.id]) {
      let timestamps = suppressed[trigger.id];
      for (let i in timestamps) {
        if (timestamps[i] > timestamp)
          return;
      }
    }
    if (role != 'all' && this.suppressedTriggers[trigger.id]) {
      let timestamps = this.suppressedTriggers[trigger.id];
      for (let i in timestamps) {
        if (timestamps[i] > timestamp)
          return;
      }
    }

    if (!result && !run)
      return;

    if (!suppressed[trigger.id])
      suppressed[trigger.id] = [];

    if (trigger.suppressSeconds) {
      if (typeof trigger.suppressSeconds === 'function')
        timestamp = timestamp + trigger.suppressSeconds(data, matches) * 1000;
      else
        timestamp = timestamp + trigger.suppressSeconds * 1000;
      suppressed[trigger.id].push(timestamp);
    } else {
      timestamp = timestamp + suppress * 1000;
      suppressed[trigger.id].push(timestamp);
    }

    let triggerElement = document.createElement('div');
    triggerElement.setAttribute('trigger', trigger.id);
    triggerElement.className = 'trigger';
    triggerElement.style.left = pos + '%';
    if (result) {
      triggerElement.setAttribute('outputText', result[data.lang] || result['en'] || result);
    } else {
      triggerElement.style.height = '50%';
      triggerElement.style.top = '25%';
      triggerElement.setAttribute('runTrigger', 'true');
    }
    triggerElement.addEventListener('mouseenter', function(e) {
      document.getElementById('tInfo').textContent = e.target.getAttribute('outputText');
      document.getElementById('tInfoSub').textContent = 'Selected Trigger ID: ' + e.target.getAttribute('trigger');
    });
    triggerElement.addEventListener('mouseleave', function() {
      document.getElementById('tInfo').textContent = '';
      document.getElementById('tInfoSub').textContent = 'Selected Trigger ID';
    });
    // DEBUG:
    // triggerElement.setAttribute('from', data.me);
    // triggerElement.setAttribute('time', timestamp);
    if (players.mode) {
      document.getElementById('triggerline-' + players.mode).appendChild(triggerElement);
      return;
    }
    document.getElementById('triggerline-' + role).appendChild(triggerElement);
    return;
  }

  ToggleRunTriggers() {
    let triggers = document.querySelectorAll('.trigger[runTrigger]');
    let change;
    if (triggers[0].style.display == 'none')
      change = 'block';
    else
      change = 'none';
    for (let i = 0; i < triggers.length; i++)
      triggers[i].style.display = change;
  }
};

function dateFromLogLine(log) {
  let m = log.match(/\[(\d\d):(\d\d):(\d\d).(\d\d\d)\]/);
  if (!m)
    return;
  let date = new Date();
  date.setHours(m[1]);
  date.setMinutes(m[2]);
  date.setSeconds(m[3]);
  date.setMilliseconds(m[4]);
  return date;
}

// Only listen to the import log event here and *not* the zone changed event.
// The log collector figures out the zone from the logs itself, and not through
// what ACT sends while importing (which races with sending logs).
document.addEventListener('onImportLogEvent', function(e) {
  gLogCollector.AppendImportLogs(e.detail.logs);
});

document.addEventListener('DOMContentLoaded', function() {
  let fightListElement = document.getElementById('fight-picker');
  let timerElements = document.getElementsByClassName('triggerline-timer');
  let elapsedElement = document.getElementById('elapsed-time');
  let infoElement = document.getElementById('info-panel');

  let partyElement = document.getElementById('party');
  let currentPlayerElement = document.getElementById('player');
  let triggerInfoElement = document.getElementById('tInfo');

  gEmulatorView = new EmulatorView(
      fightListElement, timerElements, elapsedElement, infoElement,
      partyElement, currentPlayerElement, triggerInfoElement
  );
  gLogCollector = new LogCollector(gEmulatorView.AddFight.bind(gEmulatorView));

  document.addEventListener('onPlayerChangedEvent', function(e) {
    document.getElementById('player').textContent = e.detail.name;
  });

  // Timeout is required because the overlay is slower and will break the Zone
  setTimeout(function() {
    gLogCollector.RestoreFights();
  }, 1000);
});

// Share user config for raidboss, in terms of options and css styling, etc.
UserConfig.getUserConfigLocation('raidboss');

function playLogFile() {
  gEmulatorView.Start();
}

function stopLogFile() {
  gEmulatorView.Stop();
}

function toggleStoreFight() {
  gLogCollector.StoreFights();
}

function clearStorage() {
  gLogCollector.ClearStorage();
}

function toggleRunTriggers() {
  gEmulatorView.ToggleRunTriggers();
}

function debug(arg) {
  gEmulatorView.logPlayer.SendPlayerEvent('Godbert Manderville', 'GSM', '12345678');
  gEmulatorView.logPlayer.SendZoneEvent('Middle La Noscea');
  let evt = new CustomEvent('onGameExistsEvent', { detail: { exists: true } });
  document.dispatchEvent(evt);
  let evt2 = new CustomEvent('onGameActiveChangedEvent', { detail: { active: true } });
  dispatchEvent(evt2);

  if (arg)
    gEmulatorView.logPlayer.SendLogEvent(['00:0038:Engage!']);
}
