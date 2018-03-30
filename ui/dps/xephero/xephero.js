"use strict";

var Options = {
  Language: 'en',
  IgnoreZones: [
    'PvpSeize',
    'PvpSecure',
    'PvpShatter',
    'EurekaAnemos',
  ],
};

var gCurrentZone = null;
var gIgnoreCurrentZone = false;
var gIgnoreZones = [];
var rows = 10;
var rdpsMax = 0;

var tracker = new DpsPhaseTracker;

function hideOverlay() {
  $('#overlay').addClass('hide');
}

function showOverlay() {
  $('#overlay').removeClass('hide');
}

function update(dps) {
  showOverlay();

  var encounter = dps.Encounter;
  var combatants = dps.Combatant;
  var template = $('#overlaysource li');
  var overlay = $('#overlay');
  var container = overlay.clone();
  // Reserve one row for the phase titles.
  var rows = Math.floor($(window).height() / template.height()) - 1;

  // todo: animate changes while combat is active?
  // for now, always just fully replace the content

  container.html('');

  var rdps = parseFloat(encounter.encdps);

  // sanity check
  if (!isNaN(rdps) && rdps != Infinity) {
    rdpsMax = Math.max(rdpsMax, rdps);
  }

  var header = template.clone();
  if (encounter.encdps.length <= 7) {
    header.find('.dps').text(encounter.encdps);
  } else {
    header.find('.dps').text(encounter.ENCDPS);
  }

  header.find('.name').text(tracker.title || '');
  header.find('.number').text(encounter.duration);
  header.find('.bar').css('width', ((rdps / rdpsMax) * 100) + '%');

  container.append(header);

  var limit = Math.max(combatants.length, rows);
  var names = Object.keys(combatants).slice(0,rows-1);
  var maxdps = false;

  var dpsOrder = {};
  for (var i = 0; i < names.length; i++) {
    var combatant = combatants[names[i]];
    var row = template.clone();

    if (!maxdps) {
      maxdps = parseFloat(combatant.encdps);
    }

    if (combatant.name == 'YOU') {
      row.addClass('you');
    }
    dpsOrder[combatant.name] = i;

    row.find('.dps').text(combatant.encdps);
    row.find('.name').text(combatant.Job.toUpperCase() + ' ' + combatant.name);
    row.find('.number').text(combatant.damage);
    row.find('.misses').text(combatant.misses > 0 ? '(' + combatant.misses + ')' : '');
    row.find('.bar').css('width', ((parseFloat(combatant.encdps) / maxdps) * 100) + '%');

    container.append(row);
  }

  overlay.replaceWith(container);

  if (tracker.phases.length >= 1) {
    // Don't show the first phase if it starts immediately with the encounter.
    if (tracker.phases[0].start && tracker.phases[0].start.Encounter.DURATION > 1 || tracker.phases.length >= 2) {
      for (var i = 0; i < tracker.phases.length; ++i) {
        updatePhase(tracker.phases[i], dpsOrder);
      }
    }
  }
}

function updatePhase(phase, dpsOrder) {
  if (!phase.diff) {
    return;
  }

  if (!phase.element) {
    var container = $('#phasesource ol').clone();
    phase.element = container;
    $('#topcontainer').append(container);
    // Map of combatants => elements
    phase.rowMap = {};
  }

  var phasename = phase.element.find('.phasename');
  phasename.text(phase.name);
  var phasetotal = phase.element.find('.phasetotal');
  phasetotal.text(phase.diff.Encounter.ENCDPS);

  var maxPhaseDPS = null;
  for (var name in dpsOrder) {
    var combatant = phase.diff.Combatant[name];
    if (!combatant) {
      phase.diff.Combatant[name] = combatant = {
        ENCDPS: '',
      };
    }
    var row = phase.rowMap[name];
    if (!row) {
      row = $('#phasenumbersource li').clone();
      if (name == 'YOU') {
        row.addClass('you');
      }
      phase.element.append(row);
      phase.rowMap[name] = row;
    }
    row.find('.number').text(combatant.ENCDPS);

    var order = dpsOrder[name];
    row.removeClass('hide');
    row.removeClass('highestdps');
    row.css('order', dpsOrder[name]);

    if (!maxPhaseDPS || combatant.ENCDPS > maxPhaseDPS.dps) {
      maxPhaseDPS = {
        dps: combatant.ENCDPS,
        row: row,
      };
    }
  }

  // Rows that used to be in dpsOrder but now aren't should be
  // hidden.
  for (var name in phase.rowMap) {
    var order = dpsOrder[name];
    if (order === undefined) {
      phase.rowMap[name].addClass('hide');
    }
  }

  if (maxPhaseDPS) {
    maxPhaseDPS.row.addClass('highestdps');
  }
}

$(document).on('onOverlayDataUpdate', function(e) {
  // DPS numbers in large pvp is not useful and hella noisy.
  if (gIgnoreCurrentZone)
    return;

  tracker.onOverlayDataUpdate(e.originalEvent.detail);
  update(e.originalEvent.detail);
});
$(document).on('onZoneChangedEvent', function (e) {
  gCurrentZone = e.originalEvent.detail.zoneName;
  gIgnoreCurrentZone = false;
  for (var i = 0; i < gIgnoreZones.length; ++i) {
    if (gCurrentZone.match(gIgnoreZones[i]))
      gIgnoreCurrentZone = true;
  }
  tracker.onZoneChange(gCurrentZone);
  hideOverlay();
});
$(document).on('onLogEvent', function (e) {
  tracker.onLogEvent(e.originalEvent.detail.logs);
});
$(document).on('onInCombatChangedEvent', function (e) {
  // Only clear phases when ACT starts a new encounter for consistency.
  tracker.inCombatChanged(e.originalEvent.detail.inACTCombat);
});

UserConfig.getUserConfigLocation('xephero', function(e) {
  gIgnoreZones = Options.IgnoreZones.map(function(z) { return gLang.kZone[z]; });
});