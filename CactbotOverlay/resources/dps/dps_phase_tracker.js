var DpsPhaseTracker = function() {
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
  // TODO: maybe remove element and give it a removal callback or something
  this.phases = [];
};

DpsPhaseTracker.prototype.onOverlayDataUpdate = function(dps) {
  // Update each open phase with new diffs.
  for (var i = 0; i < this.phases.length; ++i) {
    var phase = this.phases[i];
    if (phase.complete) {
      continue;
    }
    var diff = this.diffUpdateInfo(phase.start, dps);
    if (!diff) {
      continue;
    }
    phase.diff = diff;
  }
};

DpsPhaseTracker.prototype.onFightStart = function() {
  this.clearPhases();
};

DpsPhaseTracker.prototype.onFightEnd = function() {
  // *sparkles*
};

DpsPhaseTracker.prototype.onFightPhaseStart = function(name, dps) {
  console.log("Starting phase: " + name);
  this.onOverlayDataUpdate(dps);

  // Make sure there's no phase name collision.
  for (var i = 0; i < this.phases.length; ++i) {
    if (this.phases[i].name == name && !this.phases[i].complete) {
      console.error("Duplicate phase: " + name);
      return;
    }
  }

  this.phases.push({
    "name": name,
    "start": dps,
    "diff": null,
    "element": null,
    "complete": false,
  });
};

DpsPhaseTracker.prototype.onFightPhaseEnd = function(name, dps) {
  console.log("Ending phase: " + name);
  this.onOverlayDataUpdate(dps);
  for (var i = 0; i < this.phases.length; ++i) {
    if (this.phases[i].name == name && !this.phases[i].complete) {
      this.phases[i].complete = true;
      return;
    }
  }
  console.error("Can't find phase: " + name);
};

DpsPhaseTracker.prototype.clearPhases = function() {
  for (var i = 0; i < this.phases.length; ++i) {
    var element = this.phases[i].element;
    if (element) {
      element.remove();
    }
  }
  this.phases = [];
};

// Takes two {Encounter: {}, Combatant: {}} objects and returns the
// difference between the two as an {Encounter: {}, Combatant: {}} object.
// It drops some of the fields to make the diff.
//
// phase_start is optional, if it doesn't exist, it assumes default values
// from the start of the fight.
//
// This may return null (used as a hint not to bother displaying the diff).
DpsPhaseTracker.prototype.diffUpdateInfo = function(phase_start, phase_end) {
  if (!phase_end) {
    console.error(['diffError: no phase end', phase]);
    return;
  }

  // Sometimes a phase will get entered during a slow wipe when nobody
  // attacks, causing a total duration of zero.  Just ignore these.
  // This happens where ACT stops providing new updates but log entries
  // or other triggers indicate that phases have started.
  if (phase_start) {
    if (phase_start.Encounter.DURATION == phase_end.Encounter.DURATION) {
      return;
    }
  }

  var diffProps = function(start, end, props, out) {
    for (var i = 0; i < props.length; ++i) {
      var prop = props[i];
      out[prop] = end[prop] - start[prop];
    }
  };
  var copyProps = function(start, props, out) {
    for (var i = 0; i < props.length; ++i) {
      out[props[i]] = start[props[i]];
    }
  };
  var setDPS = function(duration, encDuration, out) {
    out.dps = (out.damage / duration).toFixed(2);
    out.encdps = (out.damage / encDuration).toFixed(2);

    out.DPS = Math.floor(out.dps);
    out.ENCDPS = Math.floor(out.encdps);
  };

  var encounterDiffProps = [
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
  var combatantCopyProps = [
    'name',
    'Job',
  ];
  var combatantDiffProps = [
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

  var encounter = {};
  if (phase_start) {
    diffProps(phase_start.Encounter, phase_end.Encounter, encounterDiffProps, encounter);
    setDPS(encounter.DURATION, encounter.DURATION, encounter);
  } else {
    copyProps(phase_end.Encounter, encounterDiffProps, encounter);
    setDPS(encounter.DURATION, encounter.DURATION, encounter);
  }

  // Deliberately use end, as combatants aren't initally listed before
  // they've done any damage right when the fight starts.
  var combatant = {};
  for (var name in phase_end.Combatant) {
    var start = phase_start ? phase_start.Combatant[name] : null;
    var end = phase_end.Combatant[name];
    if (!end) {
      continue;
    }
    var c = {};
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
};
