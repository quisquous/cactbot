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
      ja: Regexes.parse(/ 00:0839:(.*)の封鎖まであと\y{Float}秒/),
      en: / 00:0839:(.*) will be sealed off in /,
      de: Regexes.parse(/ 00:0839:Noch \y{Float} Sekunden, bis sich (.*) schließt/),
      fr: / 00:0839:Fermeture (.*) dans /,
      cn: Regexes.parse(/ 00:0839:距(.*)被封锁还有\y{Float}秒/),
    };
    this.unsealRegexes = {
      ja: / 00:0839:(.*)の封鎖が解かれた……/,
      en: / 00:0839:(.*) is no longer sealed/,
      de: / 00:0839:(?:Der Zugang zu\w* |)(.*) öffnet sich (?:erneut|wieder)/,
      fr: / 00:0839:Ouverture (.*)/,
      cn: / 00:0839:(.*)的封锁解除了/,
    };
    this.countdownEngageRegexes = {
      ja: / 00:0039:戦闘開始！/,
      en: / 00:0039:Engage!/,
      de: / 00:0039:Start!/,
      fr: / 00:0039:À l'attaque !/,
      cn: / 00:0039:战斗开始！/,
      ko: / 00:0039:전투 시작!/,
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
    if (this.IsWipe(log) || this.IsWin(log))
      return true;
    for (let i in this.unsealRegexes) {
      if (log.match(this.unsealRegexes[i]))
        return { matches: log.match(this.unsealRegexes[i]) };
    }
  }

  AppendImportLogs(logs) {
    // Define now to save time later
    let playerRegex = Regexes.parse(/ 15:(\y{ObjectId}):(\y{Name}):(\y{AbilityCode}):/);

    for (let i = 0; i < logs.length; ++i) {
      let log = logs[i];
      let logZoneChange = this.ParseZoneChange(log);

      if (logZoneChange && logZoneChange != this.currentZone) {
        if (this.currentFight) {
          this.currentFight.fightName = this.currentFight.zoneName;

          // If the current fight started from a countdown, then it is always
          // real.  If we started from an ability because some jerk pulled
          // without a countdown, then only treat this as a real fight if we
          // saw a wipe message.
          if (this.currentFight.fromCountdown)
            this.EndFight(log);
          else
            this.CancelFight();
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
      } else {
        let startLang = this.MatchStart(log);
        let isAbility = log.match(Regexes.ability());

        // For consistency, only start fights on a countdown.  This
        // makes it easy to know where to start all fights (vs
        // reading timeline files or some such).
        if (!this.currentZone)
          console.error('Network log file specifies no zone?');

        if (startLang || isAbility) {
          this.currentFight = {
            zoneName: this.currentZone,
            fightName: null,
            startDate: dateFromLogLine(log),
            logs: [log],
            durationMs: null,
            key: this.fights.length,
            players: {},
            lang: startLang,
            fromCountdown: !isAbility,
          };
        }
      }
    }
  }

  CancelFight() {
    this.currentFight = null;
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
      return / (?:1[456ABE]):| 0[134]:| 00:(?:003[89]|0839|0044|332e):| 2[1236]:/.test(line);
    }).sort();

    this.fights.push(fight);
    if (this.addFightCallback)
      this.addFightCallback(fight);
  }

  IsWipe(log) {
    // Actor control line list: https://gist.github.com/quisquous/250001cbce232a48e6a9ce772a56675a
    return log.match(/ 21:........:40000010:/) || log.indexOf('00:0038:cactbot wipe') != -1;
  }

  IsWin(log) {
    return log.match(/ 21:........:40000003:/);
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
    if (matches[1] in this.currentFight.players || /^4/.test(matches[1]))
      return;
    let moves = {
      PLD: [
        12959, 12961, 12964, 12967, 12968, 12969, 12970, 12971, 12972, 12973, 12974, 12975,
        12976, 12978, 12980, 12981, 12982, 12983, 12984, 12985, 12986, 12987, 12988, 12989,
        12991, 12992, 12993, 12994, 12996, 13000, 13001, 13006, 14480, 16457, 16458, 16459,
        16460, 16461, 17669, 17671, 17672, 17691, 17692, 17693, 17694, 17866, 18050, 27, 29,
        30, 3538, 3539, 3540, 3541, 3542, 4284, 4285, 4286, 50207, 50209, 50246, 50260, 50261,
        50262, 50263, 50264, 7382, 7383, 7384, 7385, 8746, 8749, 8750, 8751, 8752, 8754, 8755,
        8756,
      ],
      WAR: [
        16462, 16463, 16464, 16465, 17695, 17696, 17697, 17698, 17889, 3549, 3550, 3551, 3552,
        4289, 4290, 4291, 49, 50157, 50218, 50249, 50265, 50266, 50267, 50268, 50269, 51, 52,
        7386, 7387, 7388, 7389, 8758, 8761, 8762, 8763, 8764, 8765, 8767, 8768,
      ],
      DRK: [
        16466, 16467, 16468, 16469, 16470, 16471, 16472, 17700, 17701, 17702, 3617, 3621, 3623,
        3624, 3625, 3629, 3632, 3634, 3636, 3638, 3639, 3640, 3641, 3643, 4303, 4304, 4305, 4306,
        4307, 4308, 4309, 4310, 4311, 4312, 4680, 50158, 50159, 50271, 50272, 50319, 7390, 7391,
        7392, 7393, 8769, 8772, 8773, 8775, 8776, 8777, 8778, 8779,
      ],
      GNB: [
        17703, 17704, 17705, 17706, 17707, 17708, 17709, 17710, 17711, 17712, 17713, 17714,
        17716, 17717, 17890, 17891, 16137, 50320, 16138, 16139, 16140, 16141, 16142, 16143,
        16144, 16145, 16162, 50257, 16148, 16149, 16151, 16152, 50258, 16153, 16154, 16146,
        16147, 16150, 16159, 16160, 16161, 16155, 16156, 16157, 16158, 16163, 16164, 16165,
        50259,
      ],
      WHM: [
        12958, 12962, 12965, 12997, 13002, 13003, 13004, 13005, 131, 136, 137, 139, 140, 14481,
        1584, 16531, 16532, 16533, 16534, 16535, 16536, 17688, 17689, 17690, 17789, 17790, 17791,
        17793, 17794, 17832, 3568, 3569, 3570, 3571, 4296, 4297, 50181, 50182, 50196, 50307,
        50308, 50309, 50310, 7430, 7431, 7432, 7433, 8895, 8896, 8900, 9621,
      ],
      SCH: [
        16537, 16538, 16539, 16540, 16541, 16542, 16543, 16544, 16545, 16546, 16547, 16548, 16550,
        16551, 166, 167, 17215, 17216, 17795, 17796, 17797, 17798, 17802, 17864, 17865, 17869,
        17870, 17990, 185, 186, 188, 189, 190, 3583, 3584, 3585, 3586, 3587, 4300, 50184, 50214,
        50311, 50312, 50313, 50324, 7434, 7435, 7436, 7437, 7438, 7869, 802, 803, 805, 8904, 8905,
        8909, 9622,
      ],
      AST: [
        10027, 10028, 10029, 16552, 16553, 16554, 16555, 16556, 16557, 16558, 16559, 17055, 17151,
        17152, 17804, 17805, 17806, 17807, 17809, 17991, 3590, 3593, 3594, 3595, 3596, 3598, 3599,
        3600, 3601, 3603, 3604, 3605, 3606, 3608, 3610, 3612, 3613, 3614, 3615, 4301, 4302, 4401,
        4402, 4403, 4404, 4405, 4406, 4677, 4678, 4679, 50122, 50124, 50125, 50186, 50187, 50188,
        50189, 50314, 50315, 50316, 7439, 7440, 7441, 7442, 7443, 7444, 7445, 7448, 8324, 8913,
        8914, 8916, 9629,
      ],
      MNK: [
        12960, 12963, 12966, 12977, 12979, 12990, 12995, 12998, 12999, 14476, 14478, 16473, 16474,
        16475, 16476, 17674, 17675, 17676, 17677, 17719, 17720, 17721, 17722, 17723, 17724, 17725,
        17726, 3543, 3545, 3546, 3547, 4262, 4287, 4288, 50160, 50161, 50245, 50273, 50274, 63, 70,
        71, 7394, 7395, 7396, 74, 8780, 8781, 8782, 8783, 8784, 8785, 8787, 8789, 8925,
      ],
      DRG: [
        16477, 16478, 16479, 16480, 17728, 17729, 3553, 3554, 3555, 3556, 3557, 4292, 4293, 50162,
        50163, 50247, 50275, 50276, 7397, 7398, 7399, 7400, 86, 8791, 8792, 8793, 8794, 8795,
        8796, 8797, 8798, 8799, 8802, 8803, 8804, 8805, 8806, 92, 94, 95, 96, 9640,
      ],
      NIN: [
        16488, 16489, 16491, 16492, 16493, 17413, 17414, 17415, 17416, 17417, 17418, 17419, 17420,
        17732, 17733, 17734, 17735, 17736, 17737, 17738, 17739, 2246, 2259, 2260, 2261, 2262,
        2263, 2264, 2265, 2266, 2267, 2268, 2269, 2270, 2271, 2272, 3563, 3566, 4295, 50165,
        50166, 50167, 50250, 50279, 50280, 7401, 7402, 7403, 8807, 8808, 8809, 8810, 8812, 8814,
        8815, 8816, 8820, 9461,
      ],
      SAM: [
        16481, 16482, 16483, 16484, 16485, 16486, 16487, 17740, 17741, 17742, 17743, 17744, 50208,
        50215, 50277, 50278, 7477, 7478, 7479, 7480, 7481, 7482, 7483, 7484, 7485, 7486, 7487,
        7488, 7489, 7490, 7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7501, 7502, 7855,
        7857, 7867, 8821, 8822, 8823, 8824, 8825, 8826, 8828, 8829, 8830, 8831, 8833,
      ],
      BRD: [
        10023, 114, 116, 117, 118, 13007, 14479, 16494, 16495, 16496, 17678, 17679, 17680, 17681,
        17682, 17745, 17747, 3558, 3559, 3560, 3561, 3562, 4294, 50168, 50169, 50282, 50283, 50284,
        50285, 50286, 50287, 7404, 7405, 7406, 7407, 7408, 7409, 8836, 8837, 8838, 8839, 8841,
        8842, 8843, 8844, 9625,
      ],
      MCH: [
        16497, 16498, 16499, 16500, 16501, 16502, 16503, 16504, 16766, 16889, 17206, 17209, 17749,
        17750, 17751, 17752, 17753, 17754, 2864, 2866, 2868, 2870, 2872, 2873, 2874, 2876, 2878,
        2890, 4276, 4675, 4676, 50117, 50119, 50288, 50289, 50290, 50291, 50292, 50293, 50294,
        7410, 7411, 7412, 7413, 7414, 7415, 7416, 7418, 8848, 8849, 8850, 8851, 8853, 8855,
      ],
      DNC: [
        17756, 17757, 17758, 17759, 17760, 17761, 17762, 17763, 17764, 17765, 17766, 17767,
        17768, 17769, 17770, 17771, 17772, 17773, 17824, 17825, 17826, 17827, 17828, 17829,
        18076, 15989, 15990, 15993, 15997, 15999, 16000, 16001, 16002, 16003, 16191, 16192,
        15991, 15994, 16007, 50252, 15995, 15992, 15996, 16008, 16010, 50251, 16015, 16012,
        16006, 18073, 50253, 16011, 16009, 50254, 15998, 16004, 16193, 16194, 16195, 16196,
        16013, 16005, 50255, 50256, 16014,
      ],
      BLM: [
        14477, 153, 154, 158, 159, 162, 16505, 16506, 16507, 17683, 17684, 17685, 17686, 17687,
        17774, 17775, 3573, 3574, 3575, 3576, 3577, 4298, 50171, 50172, 50173, 50174, 50295,
        50296, 50297, 50321, 50322, 7419, 7420, 7421, 7422, 8858, 8859, 8860, 8861, 8862, 8863,
        8864, 8865, 8866, 8867, 8869, 9637,
      ],
      SMN: [
        16510, 16511, 16513, 16514, 16515, 16516, 16517, 16518, 16519, 16522, 16523, 16549,
        16795, 16796, 16797, 16798, 16799, 16800, 16801, 16802, 16803, 17777, 17778, 17779,
        17780, 17781, 17782, 17783, 17784, 17785, 180, 184, 3578, 3579, 3580, 3581, 3582, 4299,
        50176, 50177, 50178, 50213, 50217, 50298, 50299, 50300, 50301, 50302, 7423, 7424, 7425,
        7426, 7427, 7428, 7429, 7449, 7450, 787, 788, 791, 792, 794, 796, 797, 798, 800, 801,
        8872, 8873, 8874, 8877, 8878, 8879, 8880, 8881, 9014, 9432,
      ],
      RDM: [
        10025, 16524, 16525, 16526, 16527, 16528, 16529, 16530, 17786, 17787, 17788, 50195,
        50200, 50201, 50216, 50303, 50304, 50305, 50306, 7503, 7504, 7505, 7506, 7507, 7509,
        7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7520, 7521, 7523, 7524,
        7525, 7526, 7527, 7528, 7529, 7530, 8882, 8883, 8884, 8885, 8887, 8888, 8889, 8890,
        8891, 8892, 9433, 9434,
      ],
      BLU: [
        11715, 11383, 11384, 11385, 11386, 11387, 11388, 11389, 11390, 11391, 11392, 11393,
        11394, 11395, 11396, 11397, 11398, 11399, 11400, 11401, 11402, 11403, 11404, 11405,
        11406, 11407, 11408, 11409, 11410, 11411, 11412, 11413, 11414, 11415, 11416, 11417,
        11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 11428, 11429,
        11430, 11431, 50219, 50220, 50221, 50222, 50223, 50224,
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
    if (['PLD', 'WAR', 'DRK', 'GNB'].indexOf(player.job) > -1)
      player.role = 'tank';
    if (['WHM', 'SCH', 'AST'].indexOf(player.job) > -1)
      player.role = 'healer';
    if (['MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'BLU'].indexOf(player.job) > -1)
      player.role = 'dps';

    if (player.role && player.job)
      this.currentFight.players[player.id] = player;
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
    dispatchOverlayEvent({
      type: 'onLogEvent',
      detail: { logs },
    });
  }

  SendZoneEvent(zoneName) {
    dispatchOverlayEvent({
      type: 'onZoneChangedEvent',
      detail: { zoneName },
    });
  }

  SendPlayerEvent(name, job, id) {
    dispatchOverlayEvent({
      type: 'onPlayerChangedEvent',
      detail: {
        id: id,
        name: name,
        job: job,
      },
    });
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
    for (;;) {
      let date = dateFromLogLine(this.fight.logs[this.logIdx]);
      if (date) {
        if (date.getTime() > cutOffTimeMs)
          break;
        logs.push(this.fight.logs[this.logIdx]);
      }
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
}

class EmulatorView {
  constructor(
      fightListElement, timerElements, elapsedElement, infoElement,
      partyElement, currentPlayerElement, triggerInfoElement,
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
        let jobOrder = [
          'PLD', 'WAR', 'DRK', 'GNB',
          'WHM', 'SCH', 'AST',
          'MNK', 'DRG', 'NIN', 'SAM',
          'BRD', 'MCH', 'DNC',
          'BLM', 'SMN', 'RDM',
          'BLU'];
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
    // This needs to match the data construction from popup.
    let data = {
      lang: gPopupText.data.lang,
      displayLang: gPopupText.data.displayLang,
      parserLang: gPopupText.data.parserLang,
      currentHP: 0,
      options: gPopupText.options,
      party: new PartyTracker(),
      StopCombat: () => {},
      ParseLocaleFloat: parseFloat,
      CanStun: () => Util.canStun(this.job),
      CanSilence: () => Util.canSilence(this.job),
      CanSleep: () => Util.canSleep(this.job),
      CanCleanse: () => Util.canCleanse(this.job),
      CanFeint: () => Util.canFeint(this.job),
      CanAddle: () => Util.canAddle(this.job),
    };
    let logs = this.selectedFight.logs;
    data.ShortName = function(name) {
      if (!name)
        return '(undefined)';
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
        if (matches) {
          if (matches.groups)
            matches = matches.groups;
          this.RunTriggers(log, trigger, players, role, data, matches);
        }
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


      let response = {};
      if (trigger.response) {
        let r = trigger.response;
        response = (typeof r === 'function') ? r(data, matches) : r;

        // Turn falsy values into a default no-op response.
        if (!response)
          response = {};
      }

      // popup text
      if (typeof trigger.alarmText === 'function' && trigger.alarmText(data, matches))
        result = trigger.alarmText(data, matches);
      else if (typeof trigger.alarmText === 'object')
        result = trigger.alarmText;
      else if (response.alarmText)
        result = response.alarmText;

      if (typeof trigger.alertText === 'function' && trigger.alertText(data, matches))
        result = trigger.alertText(data, matches);
      else if (typeof trigger.alertText === 'object')
        result = trigger.alertText;
      else if (response.alertText)
        result = response.alertText;

      if (typeof trigger.infoText === 'function' && trigger.infoText(data, matches))
        result = trigger.infoText(data, matches);
      else if (typeof trigger.infoText === 'object')
        result = trigger.infoText;
      else if (response.infoText)
        result = response.infoText;

      // execute run function after text!
      if (typeof trigger.run === 'function') {
        run = true;
        trigger.run(data, matches);
      }

      if (result || run)
        break; // trigger is already handled for this role so break loop
    }

    // checking for suppression, first local then global
    if (typeof suppressed[trigger.id] !== 'undefined') {
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
}

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
addOverlayListener('onImportLogEvent', function(e) {
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
      partyElement, currentPlayerElement, triggerInfoElement,
  );
  gLogCollector = new LogCollector(gEmulatorView.AddFight.bind(gEmulatorView));

  addOverlayListener('onPlayerChangedEvent', function(e) {
    document.getElementById('player').textContent = e.detail.name;
  });

  callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' });

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
  dispatchOverlayEvent({
    type: 'onGameExistsEvent',
    detail: { exists: true },
  });
  dispatchOverlayEvent({
    type: 'onGameActiveChangedEvent',
    detail: { active: true },
  });

  if (arg)
    gEmulatorView.logPlayer.SendLogEvent(['00:0038:Engage!']);
}
