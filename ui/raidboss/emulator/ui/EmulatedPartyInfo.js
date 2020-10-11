'use strict';

class EmulatedPartyInfo extends EventBus {
  constructor(emulator) {
    super();
    this.tooltips = [];
    this.emulator = emulator;
    this.$partyInfo = document.querySelector('.partyInfoColumn .party');
    this.$triggerInfo = document.querySelector('.triggerInfoColumn');
    this.$triggerHideCheckbox = document.querySelector('.triggerHideSkipped');
    this.$triggerBar = document.querySelector('.playerTriggers');
    this.triggerBars = [];
    this.latestDisplayedState = 0;
    this.displayedParty = {};
    this.currentPerspective = null;
    for (let i = 0; i < 8; ++i)
      this.triggerBars[i] = this.$triggerBar.querySelector('.player' + i);

    emulator.on('tick', (timestampOffset, lastLogTimestamp) => {
      if (lastLogTimestamp) {
        this.updatePartyInfo(emulator, lastLogTimestamp);
        this.latestDisplayedState = Math.max(this.latestDisplayedState, lastLogTimestamp);
      }
    });
    emulator.on('currentEncounterChanged', (encounter) => {
      this.resetPartyInfo(encounter);
    });

    emulator.on('preSeek', (time) => {
      this.latestDisplayedState = 0;
    });
    emulator.on('postSeek', (time) => {
      this.updatePartyInfo(emulator, time);
      this.latestDisplayedState = Math.max(this.latestDisplayedState, time);
    });
    this.updateTriggerState = () => {
      if (this.$triggerHideCheckbox.checked)
        this.hideNonExecutedTriggers();
      else
        this.showNonExecutedTriggers();
    };
    this.$triggerHideCheckbox.addEventListener('change', this.updateTriggerState);

    this.$triggerItemTemplate = document.querySelector('template.triggerItem').content.firstElementChild;
    this.$playerInfoRowTemplate = document.querySelector('template.playerInfoRow').content.firstElementChild;
    this.$playerTriggerInfoTemplate = document.querySelector('template.playerTriggerInfo').content.firstElementChild;
    this.$jsonViewerTemplate = document.querySelector('template.jsonViewer').content.firstElementChild;
    this.$triggerLabelTemplate = document.querySelector('template.triggerLabel').content.firstElementChild;
    this.$wrapCollapseTemplate = document.querySelector('template.wrapCollapse').content.firstElementChild;
  }

  hideNonExecutedTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-not-executed').forEach((n) => {
      n.classList.add('d-none');
    });
  }

  showNonExecutedTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-not-executed').forEach((n) => {
      n.classList.remove('d-none');
    });
  }

  /**
   * @param {RaidEmulator} emulator
   * @param {string} timestamp
   */
  updatePartyInfo(emulator, timestamp) {
    for (let id in this.displayedParty)
      this.updateCombatantInfo(emulator.currentEncounter, id, timestamp);
  }

  /**
   * @param {AnalyzedEncounter} encounter
   */
  resetPartyInfo(encounter) {
    this.tooltips.map((tt) => {
      tt.tooltip.remove();
      return null;
    });
    this.tooltips = [];
    this.currentPerspective = null;
    this.displayedParty = {};
    this.latestDisplayedState = 0;
    this.$partyInfo.innerHTML = '';
    this.$triggerBar.querySelectorAll('.triggerItem').forEach((n) => {
      n.remove();
    });
    let membersToDisplay = encounter.encounter.combatantTracker.partyMembers.sort((l, r) => {
      let a = encounter.encounter.combatantTracker.combatants[l];
      let b = encounter.encounter.combatantTracker.combatants[r];
      return EmulatedPartyInfo.jobOrder.indexOf(a.job) - EmulatedPartyInfo.jobOrder.indexOf(b.job);
    }).slice(0, 8);
    document.querySelectorAll('.playerTriggerInfo').forEach((n) => {
      n.remove();
    });

    for (let i = 0; i < membersToDisplay.length; ++i) {
      let id = membersToDisplay[i];
      let obj = this.getPartyInfoObjectFor(encounter, id);
      this.displayedParty[id] = obj;
      this.updateCombatantInfo(encounter, id);
      this.$partyInfo.append(obj.$rootElem);
      this.$triggerInfo.append(obj.$triggerElem);
      this.triggerBars[i].classList.remove('tank');
      this.triggerBars[i].classList.remove('healer');
      this.triggerBars[i].classList.remove('dps');
      if (encounter.encounter.combatantTracker.combatants[id].job) {
        this.triggerBars[i].classList.add(
            Util.jobToRole(encounter.encounter.combatantTracker.combatants[id].job),
        );
      }

      for (let triggerIndex in encounter.perspectives[id].triggers) {
        let trigger = encounter.perspectives[id].triggers[triggerIndex];
        if (!trigger.status.executed || trigger.resolvedOffset > encounter.encounter.duration)
          continue;

        let $e = this.$triggerItemTemplate.cloneNode(true);
        $e.style.left = ((trigger.resolvedOffset / encounter.encounter.duration) * 100) + '%';
        this.tooltips.push(new Tooltip($e, 'bottom', trigger.triggerHelper.trigger.id));
        this.triggerBars[i].append($e);
      }
    }

    this.updateTriggerState();

    this.selectPerspective(membersToDisplay[0]);
  }

  selectPerspective(id) {
    if (id === this.currentPerspective)
      return;

    if (!this.emulator.currentEncounter.encounter.combatantTracker.combatants[id].job)
      return;

    this.currentPerspective = id;
    this.$triggerInfo.querySelectorAll('.playerTriggerInfo').forEach((r) => r.classList.add('d-none'));
    this.displayedParty[id].$triggerElem.classList.remove('d-none');
    this.$partyInfo.querySelectorAll('.playerInfoRow').forEach((r) => {
      r.classList.remove('border');
      r.classList.remove('border-success');
    });
    this.displayedParty[id].$rootElem.classList.add('border');
    this.displayedParty[id].$rootElem.classList.add('border-success');
    this.dispatch('selectPerspective', id);
  }

  updateCombatantInfo(encounter, id, stateID = null) {
    if (stateID <= this.latestDisplayedState)
      return;

    let combatant = encounter.encounter.combatantTracker.combatants[id];
    if (!combatant)
      return;
    stateID = stateID || combatant.getState(0);

    let State = combatant.getState(stateID);
    if (State === undefined)
      return;

    let hpProg = (State.HP / State.maxHP) * 100;
    let hpLabel = State.HP + '/' + State.maxHP;
    hpLabel = EmulatorCommon.spacePadLeft(hpLabel, (State.maxHP.toString().length * 2) + 1);
    this.displayedParty[id].$hpProgElem.ariaValueNow = State.HP;
    this.displayedParty[id].$hpProgElem.ariaValueMax = State.maxHP;
    this.displayedParty[id].$hpProgElem.style.width = hpProg + '%';
    this.displayedParty[id].$hpLabelElem.textContent = hpLabel;

    let mpProg = (State.MP / State.maxMP) * 100;
    let mpLabel = State.MP + '/' + State.maxMP;
    mpLabel = EmulatorCommon.spacePadLeft(mpLabel, (State.maxMP.toString().length * 2) + 1);
    this.displayedParty[id].$mpProgElem.ariaValueNow = State.MP;
    this.displayedParty[id].$mpProgElem.ariaValueMax = State.maxMP;
    this.displayedParty[id].$mpProgElem.style.width = mpProg + '%';
    this.displayedParty[id].$mpLabelElem.textContent = mpLabel;
  }

  getPartyInfoObjectFor(encounter, id) {
    let $e = this.$playerInfoRowTemplate.cloneNode(true);
    let $hp = $e.querySelector('.hp');
    let $mp = $e.querySelector('.mp');
    let $name = $e.querySelector('.playerName');
    let ret = {
      $rootElem: $e,
      $iconElem: $e.querySelector('jobicon'),
      $hpElem: $hp,
      $hpLabelElem: $hp.querySelector('.label'),
      $hpProgElem: $hp.querySelector('.progress-bar'),
      $mpElem: $mp,
      $mpLabelElem: $mp.querySelector('.label'),
      $mpProgElem: $mp.querySelector('.progress-bar'),
      $nameElem: $name,
      id: id,
      $triggerElem: this.getTriggerInfoObjectFor(encounter, id),
    };

    let combatant = encounter.encounter.combatantTracker.combatants[id];
    ret.$rootElem.classList.add((combatant.job || '').toUpperCase());
    this.tooltips.push(new Tooltip(ret.$rootElem, 'left', combatant.name));
    $name.innerHTML = combatant.name;
    ret.$rootElem.addEventListener('click', (e) => {
      this.selectPerspective(id);
    });
    ret.$triggerElem.setAttribute('data-id', id);
    return ret;
  }

  getTriggerInfoObjectFor(encounter, id) {
    let $ret = this.$playerTriggerInfoTemplate.cloneNode(true);
    let $container = $ret.querySelector('.d-flex.flex-column');

    let per = encounter.perspectives[id];

    let $initDataViewer = this.$jsonViewerTemplate.cloneNode(true);
    $initDataViewer.textContent = JSON.stringify(per.initialData, null, 2);

    $container.append(this._wrapCollapse('Initial Data', $initDataViewer, () => {
      $initDataViewer.textContent = JSON.stringify(per.initialData, null, 2);
    }));

    let $triggerContainer = $container.querySelector('.d-flex.flex-column');

    for (let i in per.triggers.sort((l, r) => l.resolvedOffset - r.resolvedOffset)) {
      let $triggerDataViewer = this.$jsonViewerTemplate.cloneNode(true);
      let buttonName = this.getTriggerFiredLabelTime(per.triggers[i]) +
        ' - ' + per.triggers[i].triggerHelper.trigger.id;
      let $trigger = this._wrapCollapse(buttonName, $triggerDataViewer, () => {
        $triggerDataViewer.textContent = JSON.stringify(per.triggers[i], null, 2);
      });
      let $buttonWrapper = $trigger.querySelector('.wrap-collapse-button');
      let $label = this.$triggerLabelTemplate.cloneNode(true);
      let $labelText = $label.querySelector('.trigger-label-text');
      let $labelTime = $label.querySelector('.trigger-label-time');
      $labelText.textContent = this.getTriggerLabelText(per.triggers[i]);
      $labelTime.textContent = this.getTriggerResolvedLabelTime(per.triggers[i]);
      $buttonWrapper.append($label);
      if (per.triggers[i].status.executed)
        $trigger.classList.add('trigger-executed');
      else
        $trigger.classList.add('trigger-not-executed');

      $triggerContainer.append($trigger);
    }

    $container.append($triggerContainer);

    let $finalDataViewer = this.$jsonViewerTemplate.cloneNode(true);
    $finalDataViewer.textContent = JSON.stringify(per.finalData, null, 2);

    $container.append(this._wrapCollapse('Final Data', $finalDataViewer, () => {
      $finalDataViewer.textContent = JSON.stringify(per.finalData, null, 2);
    }));

    return $ret;
  }

  getTriggerLabelText(trigger) {
    let ret = trigger.status.result || trigger.status.response;

    if (typeof (ret) === 'object')
      ret = trigger.triggerHelper.valueOrFunction(ret);
    else if (typeof (ret) === 'boolean')
      ret = '';
    else if (typeof (ret) === 'undefined')
      ret = '';
    else if (typeof (ret) !== 'string')
      ret = 'Invalid Result?';

    return ret;
  }

  getTriggerFiredLabelTime(Trigger) {
    return EmulatorCommon.timeToString(
        Trigger.logLine.offset - this.emulator.currentEncounter.encounter.initialOffset,
        false);
  }

  getTriggerResolvedLabelTime(Trigger) {
    return EmulatorCommon.timeToString(
        Trigger.resolvedOffset - this.emulator.currentEncounter.encounter.initialOffset,
        false);
  }

  _wrapCollapse(label, $obj, onclick) {
    let $ret = this.$wrapCollapseTemplate.cloneNode(true);
    let $button = $ret.querySelector('.btn');
    $button.textContent = label;
    let $wrapper = $ret.querySelector('.wrap-collapse-wrapper');
    $button.addEventListener('click', () => {
      if ($wrapper.classList.contains('d-none'))
        $wrapper.classList.remove('d-none');
      else
        $wrapper.classList.add('d-none');
      onclick && onclick();
    });
    $wrapper.append($obj);
    return $ret;
  }
}

EmulatedPartyInfo.jobOrder = [
  'PLD', 'WAR', 'DRK', 'GNB',
  'WHM', 'SCH', 'AST',
  'MNK', 'DRG', 'NIN', 'SAM',
  'BRD', 'MCH', 'DNC',
  'BLM', 'SMN', 'RDM',
  'BLU'];

if (typeof module !== 'undefined' && module.exports)
  module.exports = EmulatedPartyInfo;
