'use strict';

let kTestPhaseStart = 'cactbot phase start';
let kTestPhaseEnd = 'cactbot phase end';

class DpsPhaseTracker {
  constructor() {
    // Ordered list of phases.  Each phase is:
    // {
    //   name: display name string
    //   start: {
    //     Encounter: {...}, // initial encounter info
    //     Combatant: {...}, // initial combatant info
    //   },
    //   diff : {
    //     Encounter: {...}, // diff with latest encounter info
    //     Combatant: {...}, // diff with latest combatant info
    //   },
    //   complete: bool
    //   element: optional externally set html element associated with this phase
    // }
    //
    this.phases = [];
    this.title = null;
    this.lastData = null;
    this.zone = null;
    this.rebuildBossList();
    this.currentBoss = null;
    this.inCombat = false;

    this.defaultPhase = null;
    this.defaultPhaseIdx = 0;
  }

  onLogEvent(logs) {
    if (!gLang)
      return;

    // Zones without boss info get default phases.
    if (this.bosses.length == 0) {
      if (!this.defaultPhase) {
        for (let i = 0; i < logs.length; ++i) {
          let log = logs[i];
          if (log.match(gLang.areaSealRegex()) || log.indexOf(kTestPhaseStart) >=0) {
            this.defaultPhaseIdx++;
            this.defaultPhase = 'B' + this.defaultPhaseIdx;
            this.onFightPhaseStart(this.defaultPhase, this.lastData);
            return;
          }
        }
      } else {
        for (let i = 0; i < logs.length; ++i) {
          let log = logs[i];
          if (log.match(gLang.areaUnsealRegex()) || log.indexOf(kTestPhaseEnd) >=0) {
            this.onFightPhaseEnd(this.defaultPhase, this.lastData);
            this.defaultPhase = 0;
            return;
          }
        }
      }
      return;
    }
    if (!this.currentBoss) {
      for (let i = 0; i < logs.length; ++i) {
        let log = logs[i];
        if (this.countdownBoss && log.match(gLang.countdownStartRegex())) {
          this.onFightStart(this.countdownBoss);
          return;
        }
        for (let b = 0; b < this.bosses.length; ++b) {
          let boss = this.bosses[b];
          if (log.match(boss.startRegex)) {
            this.onFightStart(boss);
            return;
          }
        }
      }
    } else {
      // TODO: phases??
      for (let i = 0; i < logs.length; ++i) {
        let log = logs[i];
        if (log.match(this.currentBoss.endRegex)) {
          this.onFightEnd();
          return;
        }
      }
    }
  }

  onZoneChange(zone) {
    this.clearPhases();
    this.zone = zone;
    this.rebuildBossList();
    this.title = null;
  }

  rebuildBossList() {
    this.bosses = [];
    this.countdownBoss = null;
    if (!this.zone)
      return;

    for (let i = 0; i < gBossFightTriggers.length; ++i) {
      let boss = gBossFightTriggers[i];
      if (!this.zone.match(boss.zoneRegex))
        continue;
      this.bosses.push(boss);
      if (boss.countdownStarts) {
        // Only one boss can be started with countdown in a zone.
        if (this.countdownBoss)
          console.error('Countdown boss conflict: ' + boss.id + ', ' + this.countdownBoss.id);
        this.countdownBoss = boss;
      }
    }
  }

  onOverlayDataUpdate(dps) {
    this.lastData = dps;

    // Update each open phase with new diffs.
    for (let i = 0; i < this.phases.length; ++i) {
      let phase = this.phases[i];
      if (phase.complete)
        continue;

      let diff = this.diffUpdateInfo(phase.start, dps);
      if (!diff)
        continue;

      phase.diff = diff;
    }
  }

  onFightStart(boss) {
    this.currentBoss = boss;
    this.clearPhases();
    this.title = boss.id;
  }

  onFightEnd() {
    // *sparkles*
    this.currentBoss = null;
  }

  inCombatChanged(inCombat) {
    if (this.inCombat == inCombat)
      return;
    this.inCombat = inCombat;
    if (inCombat)
      this.clearPhases();
    else if (!inCombat)
      this.onFightEnd();
  }

  onFightPhaseStart(name, dps) {
    this.onOverlayDataUpdate(dps);

    // Make sure there's no phase name collision.
    for (let i = 0; i < this.phases.length; ++i) {
      if (this.phases[i].name == name && !this.phases[i].complete) {
        console.error('Duplicate phase: ' + name);
        return;
      }
    }

    this.phases.push({
      'name': name,
      'start': dps,
      'diff': null,
      'element': null,
      'complete': false,
    });
  }

  onFightPhaseEnd(name, dps) {
    this.onOverlayDataUpdate(dps);
    for (let i = 0; i < this.phases.length; ++i) {
      if (this.phases[i].name == name && !this.phases[i].complete) {
        this.phases[i].complete = true;
        return;
      }
    }
    console.error('Can\'t find phase: ' + name);
  }

  clearPhases() {
    this.defaultPhase = null;
    this.defaultPhaseIdx = 0;
    for (let i = 0; i < this.phases.length; ++i) {
      let element = this.phases[i].element;
      if (element)
        element.remove();
    }
    this.phases = [];
  }

  // Takes two {Encounter: {}, Combatant: {}} objects and returns the
  // difference between the two as an {Encounter: {}, Combatant: {}} object.
  // It drops some of the fields to make the diff.
  //
  // phase_start is optional, if it doesn't exist, it assumes default values
  // from the start of the fight.
  //
  // This may return null (used as a hint not to bother displaying the diff).
  diffUpdateInfo(phase_start, phase_end) {
    if (!phase_end) {
      console.error(['diffError: no phase end', phase]);
      return;
    }

    // Sometimes a phase will get entered during a slow wipe when nobody
    // attacks, causing a total duration of zero.  Just ignore these.
    // This happens where ACT stops providing new updates but log entries
    // or other triggers indicate that phases have started.
    if (phase_start) {
      if (phase_start.Encounter.DURATION == phase_end.Encounter.DURATION)
        return;
    }

    let diffProps = function(start, end, props, out) {
      for (let i = 0; i < props.length; ++i) {
        let prop = props[i];
        out[prop] = end[prop] - start[prop];
      }
    };
    let copyProps = function(start, props, out) {
      for (let i = 0; i < props.length; ++i)
        out[props[i]] = start[props[i]];
    };
    let setDPS = function(duration, encDuration, out) {
      out.dps = (out.damage / duration).toFixed(2);
      out.encdps = (out.damage / encDuration).toFixed(2);

      out.DPS = Math.floor(out.dps);
      out.ENCDPS = Math.floor(out.encdps);
    };

    let encounterDiffProps = [
      'DURATION',
      'damage',
      'hits',
      'misses',
      'crithits',
      'swings',
      'healed',
      'critheals',
      'cures',
      'damagetaken',
      'healstaken',
      'deaths',
    ];
    let combatantCopyProps = [
      'name',
      'Job',
    ];
    let combatantDiffProps = [
      'DURATION',
      'damage',
      'hits',
      'crithits',
      'misses',
      'swings',
      'healed',
      'critheals',
      'heals',
      'cures',
      'damagetaken',
      'healstaken',
      'kills',
      'deaths',
    ];

    let encounter = {};
    if (phase_start) {
      diffProps(phase_start.Encounter, phase_end.Encounter, encounterDiffProps, encounter);
      setDPS(encounter.DURATION, encounter.DURATION, encounter);
    } else {
      copyProps(phase_end.Encounter, encounterDiffProps, encounter);
      setDPS(encounter.DURATION, encounter.DURATION, encounter);
    }

    // Deliberately use end, as combatants aren't initally listed before
    // they've done any damage right when the fight starts.
    let combatant = {};
    for (let name in phase_end.Combatant) {
      let start = phase_start ? phase_start.Combatant[name] : null;
      let end = phase_end.Combatant[name];
      if (!end)
        continue;

      let c = {};
      copyProps(end, combatantCopyProps, c);
      if (start) {
        diffProps(start, end, combatantDiffProps, c);
      } else {
        // If combatant doesn't exist, assume they start at zero.
        copyProps(end, combatantDiffProps, c);
      }
      setDPS(c.DURATION, encounter.DURATION, c);
      combatant[name] = c;
    }

    return {
      Encounter: encounter,
      Combatant: combatant,
    };
  }
}
