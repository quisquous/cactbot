'use strict';

// TODO: allow for different playback rates.  The main trickiness
// here is that (1) timeline playback needs to be adjusted and
// (2) delaySeconds/suppressSeconds also need to be fixed.

// TODO: make it possible to scrub around forwards and backwards
// in time in the player.  Forwards is easiest, because the
// player could just play all the logs (silently).  Backwards
// is much harder because it would need to start from the
// beginning again (or some data checkpoint).

// TODO: allow the emulator to suppress events from the game
// such as zone changing or player data changing in raidboss.
// Currently, switching zones will stop the emulator.

// TODO: it would be nice to let the user select their name
// and role to pretend to be somebody else in the log.  The user
// could input this manually, or maybe select from the actors
// detected in the fight.  Although this would require detecting what
// jobs they were, probably by matching on particular skills that
// they likely would use, e.g. / 15:........:name:1F:/ for heavy swing.

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
  }

  StoreFights(fights) {
    localStorage.clear();
    localStorage.setItem('fights', JSON.stringify(fights));
  }

  RestoreOldFights() {
    if (localStorage.fights)
      this.fights = JSON.parse(localStorage.getItem('fights'));
    for (let i = 0; i < this.fights.length; i++) {
      let fight = this.fights[i];
      fight.startDate = new Date(Date.parse(fight.startDate));
      fight.endDate = new Date(Date.parse(fight.endDate));
      if (this.addFightCallback)
        this.addFightCallback(fight);
    }

    if (localStorage.fightKey) {
      let fightKey = localStorage.fightKey;
      document.getElementById(fightKey).checked = true;
      gEmulatorView.SelectFight(fightKey);
    }
  }

  WaitForRaidboss() {
    let wait = this.wait;
    if (typeof gPopupText !== 'undefined') {
      console.log('success');
      clearTimeout(wait);
    } else {
      console.log('repeat');
      wait = setTimeout(this.WaitForRaidboss, 500);
    }
  }

  AppendImportLogs(logs) {
    for (let i = 0; i < logs.length; ++i) {
      let log = logs[i];
      let logZoneChange = this.ParseZoneChange(log);
      if (logZoneChange && logZoneChange != this.currentZone) {
        if (this.currentFight)
          this.EndFight(log);
        this.currentZone = logZoneChange;
      }

      if (this.currentFight) {
        this.currentFight.logs.push(log);
        if (this.IsWipe(log))
          this.EndFight(log);
      } else if (log.match(gLang.countdownEngageRegex())) {
        // For consistency, only start fights on a countdown.  This
        // makes it easy to know where to start all fights (vs
        // reading timeline files or some such).
        if (!this.currentZone)
          console.error('Network log file specifies no zone?');
        this.currentFight = {
          zoneName: this.currentZone,
          startDate: dateFromLogLine(log),
          logs: [log],
          durationMs: null,
          key: this.fights.length,
        };
      }
    }
    this.StoreFights(this.fights);
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
    // 03,04 = adding/removing combatant | 21 = wipe?
    // Add more to regex only if needed
    fight.logs = fight.logs.filter(function(line) {
      return / 1[456AB]:| 0[134]:| 00:003[89]:| 21:.{8}:/.test(line);
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
}

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
    let jobDetail = {
      oath: 100,
      beast: 100,
      blood: 100,
      lillies: 3,
      aetherflowStacks: 3,
      fairyGauge: 100,
      drawMilliseconds: 15000,
      drawnCard: 'Speer',
      spreadCard: 'Baum',
      roadCard: 'Waage',
      arcanumCard: 'König der Kronen',
      lightningStacks: 3,
      lightningMilliseconds: 12000,
      chakraStacks: 5,
      bloodMilliseconds: 10000,
      lifeMilliseconds: 10000,
      eyesAmount: 3,
      hutonMilliseconds: 10000,
      ninkiAmount: 3,
      samuraiGauge: 100,
      songName: 'Mages Ballad',
      songProcs: 3,
      overheatMilliseconds: 10000,
      heat: 100,
      ammunition: 3,
      gauss: 'gauss',
      umbralStacks: 3,
      umbralMilliseconds: 10000,
      umbralHearts: 3,
      enochian: 'enochian',
      polygot: 'polygot',
      nextPolygotMilliseconds: 10000,
      dreadwyrmStacks: 3,
      bahamutStacks: 2,
      dreadwyrmMilliseconds: 10000,
      bahamutMilliseconds: 10000,
      whiteMana: 100,
      blackMana: 100,
    };
    let evt = new CustomEvent('onPlayerChangedEvent', { detail: {
      id: id,
      name: name,
      job: job,
      currentHP: 1000,
      maxHP: 1000,
      currentMP: 1000,
      maxMP: 1000,
      currentTP: 1000,
      maxTP: 1000,
      currentCP: 1000,
      maxCP: 1000,
      currentGP: 1000,
      maxGP: 1000,
      level: 100,
      debugJob: 'debug',
      jobDetail: jobDetail,
      pos: { x: 0, y: 0, z: 0 },
    } });
    document.dispatchEvent(evt);
    document.getElementById('player').textContent = name;
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

// Responsible for manipulating any UI on screen, and starting and stopping
// the log player when needed.
class EmulatorView {
  constructor(
      fightListElement, timerElement, elapsedElement, infoElement,
      partyElement, currentPlayerElement, triggerInfoElement
  ) {
    this.fightListElement = fightListElement;
    this.timerElement = timerElement;
    this.elapsedElement = elapsedElement;
    this.infoElement = infoElement;

    this.logPlayer = new LogPlayer();
    this.fightMap = {};
    this.selectedFight = null;
    this.startTimeLocalMs = null;

    this.partyElement = partyElement;
    this.currentPlayerElement = currentPlayerElement;
    this.triggerInfoElement = triggerInfoElement;

    this.players = {};
    this.sortedPlayers = [];
    this.logs = [];
    this.duration = 0;
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

    let dateStr = this.DateToTimeStr(fight.startDate);
    let durTotalSeconds = Math.ceil(fight.durationMs / 1000);
    let durMinutes = Math.floor(durTotalSeconds / 60);
    let durStr = '';
    if (durMinutes > 0)
      durStr += durMinutes + 'm';
    durStr += (durTotalSeconds % 60) + 's';
    labelElement.innerText = fight.zoneName + ', ' + dateStr + ', ' + durStr;

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
    localStorage.setItem('fightKey', fightKey);

    if (!this.playingFight) {
      this.logPlayer.SendZoneEvent(fight.zoneName);
      this.ShowFightInfo(this.selectedFight);

      // Simply push first Player
      let name = this.sortedPlayers[0].name;
      let job = this.sortedPlayers[0].job;
      let id = this.sortedPlayers[0].id;
      this.logPlayer.SendPlayerEvent(name, job, id);

      this.Analyze();
    }
  }

  Start() {
    if (!this.selectedFight)
      return;
    let fight = this.selectedFight;

    let durTotalSeconds = Math.ceil(fight.durationMs / 1000);
    this.timerElement.style.transition = '0s';
    this.timerElement.style.width = '0%';
    this.timerElement.style.transition = durTotalSeconds + 's linear';
    this.timerElement.style.width = '100%';

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

    this.elapsedElement.innerText =
        msToTimeStr(elapsedMs) + ' / ' + msToTimeStr(totalTimeMs);

    window.requestAnimationFrame(this.Tick.bind(this));
  }

  Stop() {
    this.logPlayer.Stop();
    this.localStartMs = null;
    this.playingFight = null;

    this.timerElement.style.transition = '0s';
    this.timerElement.style.width = '0%';

    this.ShowFightInfo(this.selectedFight);
  }

  ShowFightInfo(fight) {
    if (!fight) {
      this.infoElement.innerText = '';
      return;
    }

    // Search Players
    this.SearchPlayers(fight.logs);

    // Use cached fight info, if available.
    if (!fight.info) {
      // Walk through all the logs and figure out info from the pull.
      let isClear = false;
      for (let i = 0; i < fight.logs.length; ++i) {
        let log = fight.logs[i];
        if (log.indexOf(' 21:') != -1 && log.match(/ 21:........:40000003:/))
          isClear = true;
      }

      let info = '';
      let actors = [];
      for (let i = 0; i < this.sortedPlayers.length; i++)
        actors.push(this.sortedPlayers[i].name);

      info += '<div class="nowrap">' + fight.zoneName + '</div><div class="subtitle">Applied Zone</div>';
      info += '<div class="nowrap">' + this.DateToTimeStr(fight.startDate) + ' - ' + this.DateToTimeStr(fight.endDate) + (isClear ? ' (Clear)' : ' (Wipe?)') + '</div><div class="subtitle">Time</div>';
      info += '<div class="actors">' + actors.join(', ') + '</div><div class="subtitle">Actors</div>';

      fight.info = info;
    }
    this.infoElement.innerHTML = fight.info;
  }

  // Lippe functions
  SearchPlayers(logs) {
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
    };
    let players = this.players = {};
    let regex = Regexes.Parse(/ 15:(\y{ObjectId}):(\y{Name}):(\y{AbilityCode}):/);

    for (let i = 0; i < logs.length; i++) {
      let matches = logs[i].match(regex);
      if (matches != null) {
        let ObjId = new RegExp(matches[1]);
        if (!ObjId.test(Object.keys(players))) {
          let playerId = matches[1];
          let job;
          let role;
          let ability = parseInt(matches[3], 16);
          for (let m in moves) {
            for (let a = 0; a < moves[m].length; a++) {
              if (ability == moves[m][a]) {
                job = m;
                break;
              }
            }
            if (job)
              break;
          }
          if (job == 'PLD' || job == 'WAR' || job == 'DRK')
            role = 'tank';
          if (job == 'WHM' || job == 'SCH' || job == 'AST')
            role = 'healer';
          if (job == 'MNK' || job == 'DRG' || job == 'NIN' || job == 'SAM' || job == 'BRD' || job == 'MCH' || job == 'BLM' || job == 'SMN' || job == 'RDM')
            role = 'dps';
          if (role && job) {
            Object.assign(players, {
              [playerId]: {
                name: matches[2],
                role: role,
                job: job,
                id: playerId,
              },
            });
          }
        }
      }

      // This can speed up this function a lot!
      // Add logic to differ between 4 and 8 player dungeons
      // TODO: Find a better Way of doing this
      let partySize = 8;
      let zoneRegex = new RegExp(this.selectedFight.zoneName);
      let full = [
        'Upper Aetheroacoustic Exploratory Site', 'Lower Aetheroacoustic Exploratory Site', 'The Ragnarok', 'Ragnarok Drive Cylinder', 'Ragnarok Central Core',
        'Alphascape V1.0 (Savage)', 'Alphascape V2.0 (Savage)', 'Alphascape V3.0 (Savage)', 'Alphascape V4.0 (Savage)',
        'Alphascape V1.0', 'Alphascape V2.0', 'Alphascape V3.0', 'Alphascape V4.0',
        'Sigmascape V1.0 (Savage)', 'Sigmascape V2.0 (Savage)', 'Sigmascape V3.0 (Savage)', 'Sigmascape V4.0 (Savage),
        'Sigmascape V1.0', 'Sigmascape V2.0', 'Sigmascape V3.0', 'Sigmascape V4.0',
        'Deltascape', 'The Unending Coil Of Bahamut',
      ];
      let raid = [
        'The Labyrinth Of The Ancients', 'Syrcus Tower', 'The World Of Darkness',
        'Void Ark', 'The Weeping City of Mhach', 'Dun Scaith',
        'The Royal City Of Rabanastre', 'The Ridorana Lighthouse', 'The Orbonne Monastery',
        'Eureka Anemos', 'Eureka Pagos', 'Eureka Pyros',
      ];
      if (zoneRegex.test(full))
        partySize = 8;
      if (zoneRegex.test(raid))
        partySize = 24;
      if (Object.keys(players).length == partySize)
        break;
    }

    // workaround for Object.values
    let party = this.sortedPlayers = [];
    for (let p in players)
      party.push(players[p]);
    party = party.sort(function(a, b) {
      if (Object.keys(moves).indexOf(a.job) < Object.keys(moves).indexOf(b.job))
        return -1;
      if (Object.keys(moves).indexOf(a.job) > Object.keys(moves).indexOf(b.job))
        return 1;
      return 0;
    });

    // Clear party
    while (this.partyElement.firstChild)
      this.partyElement.firstChild.remove();

    for (let i = 0; i < party.length; i++) {
      let playerElement = document.createElement('div');
      playerElement.className = 'jobicon ' + party[i].job;
      playerElement.id = party[i].id;
      playerElement.setAttribute('name', party[i].name);
      playerElement.setAttribute('job', party[i].job);
      playerElement.addEventListener('click', function(e) {
        let id = e.target.id;
        let name = e.target.getAttribute('name');
        let job = e.target.getAttribute('job');
        gEmulatorView.logPlayer.SendPlayerEvent(name, job, id);
      });
      this.partyElement.appendChild(playerElement);
    }
  }

  Analyze() {
    // Clear all triggerlines
    let triggerlines = document.getElementsByClassName('triggerline');
    for (let i = 0; i < triggerlines.length; i++) {
      while (triggerlines[i].firstChild)
        triggerlines[i].firstChild.remove();
    }

    this.AnalyzeFight('all');
    this.AnalyzeFight('tank');
    this.AnalyzeFight('healer');
    this.AnalyzeFight('dps');
  }

  AnalyzeFight(role) {
    let triggers = gPopupText.triggers;
    let data = {};
    let logs = this.selectedFight.logs;

    data.ShortName = function(name) {
      return name.split(/\s/)[0];
    };
    // Reset local Suppression
    this.suppressedTriggersLocal = {};

    for (let i = 0; i < logs.length; i++) {
      let log = logs[i];
      for (let t = 0; t < triggers.length; t++) {
        let trigger = triggers[t];
        if (trigger.disabled)
          continue;

        let matches = log.match(trigger.localRegex);
        if (matches != null)
          this.RunTriggers(logs, log, trigger, role, data, matches);
      }
    }
  }

  RunTriggers(logs, log, trigger, role, data, matches) {
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

    let startTime = dateFromLogLine(logs[0]).getTime();
    let endTime = dateFromLogLine(logs[logs.length - 1]).getTime();
    let pos = (timestamp + delay - startTime) / (endTime - startTime) * 100;
    let players = {};
    for (let p in this.players) {
      if (this.players[p].role == role) {
        Object.assign(players, {
          [p]: {
            name: this.players[p].name,
            job: this.players[p].job,
            role: this.players[p].role,
          },
        });
      }
    }
    if (role == 'all')
      players = { '00000000': { name: 'Generic Player', job: 'none', role: 'none' } };

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
        result = trigger.alarmText(data, matches).en || trigger.alarmText(data, matches);
      else if (typeof trigger.alarmText === 'object')
        result = trigger.alarmText.en || trigger.alarmText;

      if (typeof trigger.alertText === 'function' && trigger.alertText(data, matches))
        result = trigger.alertText(data, matches).en || trigger.alertText(data, matches);
      else if (typeof trigger.alertText === 'object')
        result = trigger.alertText.en || trigger.alertText;

      if (typeof trigger.infoText === 'function' && trigger.infoText(data, matches))
        result = trigger.infoText(data, matches).en || trigger.infoText(data, matches);
      else if (typeof trigger.infoText === 'object')
        result = trigger.infoText.en || trigger.infoText;

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
    triggerElement.addEventListener('mouseenter', function(e) {
      document.getElementById('tInfo').innerHTML = e.target.getAttribute('trigger');
      document.getElementById('tInfo').style.display = 'block';
    });
    triggerElement.addEventListener('mouseleave', function() {
      document.getElementById('tInfo').style.display = 'none';
    });
    // debug:
    triggerElement.setAttribute('from', data.me);
    triggerElement.setAttribute('time', timestamp);
    document.getElementById('triggerline-' + role).appendChild(triggerElement);

    return;
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
  let timerElement = document.getElementById('emulator-log-timer');
  let elapsedElement = document.getElementById('elapsed-time');
  let infoElement = document.getElementById('info-panel');

  let partyElement = document.getElementById('party');
  let currentPlayerElement = document.getElementById('player');
  let triggerInfoElement = document.getElementById('tInfo');

  gEmulatorView = new EmulatorView(
      fightListElement, timerElement, elapsedElement, infoElement,
      partyElement, currentPlayerElement, triggerInfoElement
  );
  gLogCollector = new LogCollector(gEmulatorView.AddFight.bind(gEmulatorView));
});

document.addEventListener('onDataFilesRead', function() {
  gLogCollector.RestoreOldFights();
});

// Share user config for raidboss, in terms of options and css styling, etc.
UserConfig.getUserConfigLocation('raidboss');

function playLogFile() {
  gEmulatorView.Start();
}

function stopLogFile() {
  gEmulatorView.Stop();
}
