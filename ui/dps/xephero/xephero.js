'use strict';

let Options = {
  Language: 'en',
  IgnoreZones: [
    'PvpSeize',
    'PvpSecure',
    'PvpShatter',
    'EurekaAnemos',
  ],
};

let gCurrentZone = null;
let gIgnoreCurrentZone = false;
let gIgnoreZones = [];
let rows = 10;
let rdpsMax = 0;

let tracker = new DpsPhaseTracker;

function hideOverlay() {
  $('#overlay').addClass('hide');
}

function showOverlay() {
  $('#overlay').removeClass('hide');
}

function update(dps) {
  showOverlay();

  let encounter = dps.Encounter;
  let combatants = dps.Combatant;
  let template = $('#overlaysource li');
  let overlay = $('#overlay');
  let container = overlay.clone();
  // Reserve one row for the phase titles.
  let rows = Math.floor($(window).height() / template.height()) - 1;

  // todo: animate changes while combat is active?
  // for now, always just fully replace the content

  container.html('');

  let rdps = parseFloat(encounter.encdps);

  // sanity check
  if (!isNaN(rdps) && rdps != Infinity)
    rdpsMax = Math.max(rdpsMax, rdps);


  let header = template.clone();
  if (encounter.encdps.length <= 7)
    header.find('.dps').text(encounter.encdps);
  else
    header.find('.dps').text(encounter.ENCDPS);


  header.find('.name').text(tracker.title || '');
  header.find('.number').text(encounter.duration);
  header.find('.bar').css('width', ((rdps / rdpsMax) * 100) + '%');

  container.append(header);

  let limit = Math.max(combatants.length, rows);
  let names = Object.keys(combatants).slice(0, rows-1);
  let maxdps = false;

  let dpsOrder = {};
  for (let i = 0; i < names.length; i++) {
    let combatant = combatants[names[i]];
    let row = template.clone();

    if (!maxdps)
      maxdps = parseFloat(combatant.encdps);


    if (combatant.name == 'YOU')
      row.addClass('you');

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
    if (tracker.phases[0].start && tracker.phases[0].start.Encounter.DURATION > 1 ||
        tracker.phases.length >= 2) {
      for (let i = 0; i < tracker.phases.length; ++i)
        updatePhase(tracker.phases[i], dpsOrder);
    }
  }
}

function updatePhase(phase, dpsOrder) {
  if (!phase.diff)
    return;


  if (!phase.element) {
    let container = $('#phasesource ol').clone();
    phase.element = container;
    $('#topcontainer').append(container);
    // Map of combatants => elements
    phase.rowMap = {};
  }

  let phasename = phase.element.find('.phasename');
  phasename.text(phase.name);
  let phasetotal = phase.element.find('.phasetotal');
  phasetotal.text(phase.diff.Encounter.ENCDPS);

  let maxPhaseDPS = null;
  for (let name in dpsOrder) {
    let combatant = phase.diff.Combatant[name];
    if (!combatant) {
      phase.diff.Combatant[name] = combatant = {
        ENCDPS: '',
      };
    }
    let row = phase.rowMap[name];
    if (!row) {
      row = $('#phasenumbersource li').clone();
      if (name == 'YOU')
        row.addClass('you');

      phase.element.append(row);
      phase.rowMap[name] = row;
    }
    row.find('.number').text(combatant.ENCDPS);

    let order = dpsOrder[name];
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
  for (let name in phase.rowMap) {
    let order = dpsOrder[name];
    if (order === undefined)
      phase.rowMap[name].addClass('hide');
  }

  if (maxPhaseDPS)
    maxPhaseDPS.row.addClass('highestdps');
}

$(document).on('onOverlayDataUpdate', function(e) {
  // DPS numbers in large pvp is not useful and hella noisy.
  if (gIgnoreCurrentZone)
    return;

  tracker.onOverlayDataUpdate(e.originalEvent.detail);
  update(e.originalEvent.detail);
});
$(document).on('onZoneChangedEvent', function(e) {
  gCurrentZone = e.originalEvent.detail.zoneName;
  gIgnoreCurrentZone = false;
  for (let i = 0; i < gIgnoreZones.length; ++i) {
    if (gCurrentZone.match(gIgnoreZones[i]))
      gIgnoreCurrentZone = true;
  }
  tracker.onZoneChange(gCurrentZone);
  hideOverlay();
});
$(document).on('onLogEvent', function(e) {
  tracker.onLogEvent(e.originalEvent.detail.logs);
});
$(document).on('onInCombatChangedEvent', function(e) {
  // Only clear phases when ACT starts a new encounter for consistency.
  tracker.inCombatChanged(e.originalEvent.detail.inACTCombat);
});

UserConfig.getUserConfigLocation('xephero', function(e) {
  gIgnoreZones = Options.IgnoreZones.map(function(z) {
    return gLang.kZone[z];
  });
});
