import DpsPhaseTracker from './dps_phase_tracker.js';
import { InitDpsModule, Options } from '../dps_common.js';
import UserConfig from '../../../resources/user_config.js';

const rows = 10;
let rdpsMax = 0;

function hideOverlay() {
  $('#overlay').addClass('hide');
}

function showOverlay() {
  $('#overlay').removeClass('hide');
}

function update(dps, tracker) {
  const encounter = dps.Encounter;
  const rdps = parseFloat(encounter.encdps);
  if (isNaN(rdps) || rdps === Infinity)
    return;

  showOverlay();

  const combatants = dps.Combatant;
  const template = $('#overlaysource li');
  const overlay = $('#overlay');
  const container = overlay.clone();
  // Reserve one row for the phase titles.
  const rows = Math.floor($(window).height() / template.height()) - 1;

  // todo: animate changes while combat is active?
  // for now, always just fully replace the content

  container.html('');

  // sanity check
  if (!isNaN(rdps) && rdps !== Infinity)
    rdpsMax = Math.max(rdpsMax, rdps);


  const header = template.clone();
  if (encounter.encdps.length <= 7)
    header.find('.dps').text(encounter.encdps);
  else
    header.find('.dps').text(encounter.ENCDPS);


  header.find('.name').text(tracker.title || '');
  header.find('.number').text(encounter.duration);
  header.find('.bar').css('width', ((rdps / rdpsMax) * 100) + '%');

  container.append(header);

  const limit = Math.max(combatants.length, rows);
  const names = Object.keys(combatants).slice(0, rows - 1);
  let maxdps = false;

  const dpsOrder = {};
  for (let i = 0; i < names.length; i++) {
    const combatant = combatants[names[i]];
    const row = template.clone();

    if (!maxdps)
      maxdps = parseFloat(combatant.encdps);


    if (combatant.name === 'YOU')
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
    const container = $('#phasesource ol').clone();
    phase.element = container;
    $('#topcontainer').append(container);
    // Map of combatants => elements
    phase.rowMap = {};
  }

  const phasename = phase.element.find('.phasename');
  phasename.text(phase.name);
  const phasetotal = phase.element.find('.phasetotal');
  phasetotal.text(phase.diff.Encounter.ENCDPS);

  let maxPhaseDPS = null;
  for (const name in dpsOrder) {
    let combatant = phase.diff.Combatant[name];
    if (!combatant) {
      phase.diff.Combatant[name] = combatant = {
        ENCDPS: '',
      };
    }
    let row = phase.rowMap[name];
    if (!row) {
      row = $('#phasenumbersource li').clone();
      if (name === 'YOU')
        row.addClass('you');

      phase.element.append(row);
      phase.rowMap[name] = row;
    }
    row.find('.number').text(combatant.ENCDPS);

    const order = dpsOrder[name];
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
  for (const name in phase.rowMap) {
    const order = dpsOrder[name];
    if (order === undefined)
      phase.rowMap[name].addClass('hide');
  }

  if (maxPhaseDPS)
    maxPhaseDPS.row.addClass('highestdps');
}

UserConfig.getUserConfigLocation('xephero', Options, (e) => {
  const tracker = new DpsPhaseTracker(Options);
  const onOverlayDataUpdateEvent = (e) => {
    tracker.onOverlayDataUpdate(e.detail);
    update(e.detail, tracker);
  };

  InitDpsModule(onOverlayDataUpdateEvent, hideOverlay);

  addOverlayListener('ChangeZone', (e) => {
    const currentZone = e.zoneName;
    tracker.onChangeZone(currentZone);
  });
  addOverlayListener('onLogEvent', (e) => {
    tracker.onLogEvent(e.detail.logs);
  });
  addOverlayListener('onInCombatChangedEvent', (e) => {
    // Only clear phases when ACT starts a new encounter for consistency.
    tracker.inCombatChanged(e.detail.inACTCombat);
  });
});
