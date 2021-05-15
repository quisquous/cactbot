import EmulatorCommon from '../EmulatorCommon';
import EventBus from '../EventBus';
import Tooltip from './Tooltip';
import Util from '../../../../resources/util';

export default class EmulatedPartyInfo extends EventBus {
  constructor(emulator) {
    super();
    this.tooltips = [];
    this.emulator = emulator;
    this.$partyInfo = document.querySelector('.partyInfoColumn .party');
    this.$triggerInfo = document.querySelector('.triggerInfoColumn');
    this.$triggerHideSkippedCheckbox = document.querySelector('.triggerHideSkipped');
    this.$triggerHideCollectCheckbox = document.querySelector('.triggerHideCollector');
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
      if (this.$triggerHideSkippedCheckbox.checked)
        this.hideNonExecutedTriggers();
      else
        this.showNonExecutedTriggers();
      if (this.$triggerHideCollectCheckbox.checked)
        this.hideCollectorTriggers();
      else
        this.showCollectorTriggers();
    };
    this.$triggerHideSkippedCheckbox.addEventListener('change', this.updateTriggerState);
    this.$triggerHideCollectCheckbox.addEventListener('change', this.updateTriggerState);

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

  hideCollectorTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-no-output').forEach((n) => {
      n.classList.add('d-none');
    });
  }

  showCollectorTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-no-output').forEach((n) => {
      n.classList.remove('d-none');
    });
  }


  /**
   * @param {RaidEmulator} emulator
   * @param {string} timestamp
   */
  updatePartyInfo(emulator, timestamp) {
    for (const id in this.displayedParty)
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
    const membersToDisplay = encounter.encounter.combatantTracker.partyMembers.sort((l, r) => {
      const a = encounter.encounter.combatantTracker.combatants[l];
      const b = encounter.encounter.combatantTracker.combatants[r];
      return EmulatedPartyInfo.jobOrder.indexOf(a.job) - EmulatedPartyInfo.jobOrder.indexOf(b.job);
    }).slice(0, 8);
    document.querySelectorAll('.playerTriggerInfo').forEach((n) => {
      n.remove();
    });

    for (let i = 0; i < membersToDisplay.length; ++i) {
      const id = membersToDisplay[i];
      const obj = this.getPartyInfoObjectFor(encounter, id);
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

      for (const triggerIndex in encounter.perspectives[id].triggers) {
        const trigger = encounter.perspectives[id].triggers[triggerIndex];
        if (!trigger.status.executed || trigger.resolvedOffset > encounter.encounter.duration)
          continue;

        const $e = this.$triggerItemTemplate.cloneNode(true);
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

    const combatant = encounter.encounter.combatantTracker.combatants[id];
    if (!combatant)
      return;
    stateID = stateID || combatant.getState(0);

    const State = combatant.getState(stateID);
    if (State === undefined)
      return;

    const hpProg = (State.HP / State.maxHP) * 100;
    let hpLabel = State.HP + '/' + State.maxHP;
    hpLabel = EmulatorCommon.spacePadLeft(hpLabel, (State.maxHP.toString().length * 2) + 1);
    this.displayedParty[id].$hpProgElem.ariaValueNow = State.HP;
    this.displayedParty[id].$hpProgElem.ariaValueMax = State.maxHP;
    this.displayedParty[id].$hpProgElem.style.width = hpProg + '%';
    this.displayedParty[id].$hpLabelElem.textContent = hpLabel;

    const mpProg = (State.MP / State.maxMP) * 100;
    let mpLabel = State.MP + '/' + State.maxMP;
    mpLabel = EmulatorCommon.spacePadLeft(mpLabel, (State.maxMP.toString().length * 2) + 1);
    this.displayedParty[id].$mpProgElem.ariaValueNow = State.MP;
    this.displayedParty[id].$mpProgElem.ariaValueMax = State.maxMP;
    this.displayedParty[id].$mpProgElem.style.width = mpProg + '%';
    this.displayedParty[id].$mpLabelElem.textContent = mpLabel;
  }

  getPartyInfoObjectFor(encounter, id) {
    const $e = this.$playerInfoRowTemplate.cloneNode(true);
    const $hp = $e.querySelector('.hp');
    const $mp = $e.querySelector('.mp');
    const $name = $e.querySelector('.playerName');
    const ret = {
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

    const combatant = encounter.encounter.combatantTracker.combatants[id];
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
    const $ret = this.$playerTriggerInfoTemplate.cloneNode(true);
    const $container = $ret.querySelector('.d-flex.flex-column');

    const per = encounter.perspectives[id];

    const $initDataViewer = this.$jsonViewerTemplate.cloneNode(true);
    $initDataViewer.textContent = JSON.stringify(per.initialData, null, 2);

    $container.append(this._wrapCollapse({
      time: '00:00',
      name: 'Initial Data',
      classes: ['data'],
      $obj: $initDataViewer,
    }));

    const $triggerContainer = $container.querySelector('.d-flex.flex-column');

    for (const i in per.triggers.sort((l, r) => l.resolvedOffset - r.resolvedOffset)) {
      const $triggerDataViewer = this.$jsonViewerTemplate.cloneNode(true);
      $triggerDataViewer.textContent = JSON.stringify(per.triggers[i], null, 2);
      const triggerText = this.getTriggerLabelText(per.triggers[i]);
      const $trigger = this._wrapCollapse({
        time: this.getTriggerResolvedLabelTime(per.triggers[i]),
        name: per.triggers[i].triggerHelper.trigger.id,
        icon: this.getTriggerLabelIcon(per.triggers[i]),
        text: triggerText,
        classes: [per.triggers[i].status.responseType],
        $obj: $triggerDataViewer,
      });
      if (per.triggers[i].status.executed)
        $trigger.classList.add('trigger-executed');
      else
        $trigger.classList.add('trigger-not-executed');

      if (triggerText === undefined)
        $trigger.classList.add('trigger-no-output');
      else
        $trigger.classList.add('trigger-output');

      $triggerContainer.append($trigger);
    }

    $container.append($triggerContainer);

    const $finalDataViewer = this.$jsonViewerTemplate.cloneNode(true);
    $finalDataViewer.textContent = JSON.stringify(per.finalData, null, 2);

    $container.append(this._wrapCollapse({
      time: EmulatorCommon.timeToString(
          encounter.encounter.duration - encounter.encounter.initialOffset,
          false),
      name: 'Final Data',
      classes: ['data'],
      $obj: $finalDataViewer,
    }));

    return $ret;
  }

  getTriggerLabelText(trigger) {
    let ret = trigger.status.responseLabel;

    if (typeof (ret) === 'object')
      ret = trigger.triggerHelper.valueOrFunction(ret);

    if (typeof (ret) === 'boolean')
      ret = undefined;
    else if (typeof (ret) === 'undefined')
      ret = undefined;
    else if (typeof (ret) !== 'string')
      ret = 'Invalid Result?';

    if (ret === '')
      ret = undefined;

    return ret;
  }

  getTriggerLabelIcon(trigger) {
    const type = trigger.status.responseType;

    switch (type) {
    case 'info':
      return 'info';
    case 'alert':
      return 'bell';
    case 'alarm':
      return 'exclamation';
    case 'tts':
      return 'bullhorn';
    case 'audiofile':
      return 'volume-up';
    }

    return undefined;
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

  /**
   * @param {object} params Parameters to use for the wrapper.
   * @param {Element} params.$obj Object to wrap in a collapseable button
   * @param {string} [params.time] Time to display
   * @param {string} [params.name] Name/label of the button
   * @param {string} [params.icon] FontAwesome icon to display
   * @param {[string]} [params.classes] Array of classes to add to the button
   * @param {CallableFunction} [params.onclick] Callback to trigger when clicking the button
   */
  _wrapCollapse(params) {
    const $ret = this.$wrapCollapseTemplate.cloneNode(true);
    const $button = $ret.querySelector('.btn');
    const $time = $ret.querySelector('.trigger-label-time');
    const $name = $ret.querySelector('.trigger-label-name');
    const $icon = $ret.querySelector('.trigger-label-icon');
    const $text = $ret.querySelector('.trigger-label-text');

    if (params.name === undefined)
      $name.parentNode.removeChild($name);
    else
      $name.textContent = params.name;

    if (params.time === undefined)
      $time.parentNode.removeChild($time);
    else
      $time.textContent = params.time;

    if (params.text === undefined)
      $text.parentNode.removeChild($text);
    else
      $text.textContent = params.text;

    if (params.icon === undefined)
      $icon.parentNode.removeChild($icon);
    else
      $icon.innerHTML = `<i class="fa fa-${params.icon}" aria-hidden="true"></i>`;

    if (Array.isArray(params.classes))
      params.classes.forEach((c) => $button.classList.add('triggertype-' + c));

    const $wrapper = $ret.querySelector('.wrap-collapse-wrapper');
    $button.addEventListener('click', () => {
      if ($wrapper.classList.contains('d-none'))
        $wrapper.classList.remove('d-none');
      else
        $wrapper.classList.add('d-none');
      typeof (params.onclick) === 'function' && params.onclick();
    });
    $wrapper.append(params.$obj);
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
