'use strict';

class EmulatedPartyInfo extends EventBus {
  constructor(emulator) {
    super();
    this.emulator = emulator;
    this.$partyInfo = $('.partyInfoColumn .party');
    this.$triggerInfo = $('.triggerInfoColumn');
    this.$triggerHideCheckbox = $('.triggerHideSkipped');
    this.$triggerBar = $('.playerTriggers');
    this.triggerBars = [];
    this.latestDisplayedState = 0;
    this.displayedParty = {};
    this.currentPerspective = null;
    for (let i = 0; i < 8; ++i)
      this.triggerBars[i] = this.$triggerBar.find('.player' + i);

    emulator.on('tick', (timestampOffset, lastLogTimestamp) => {
      if (lastLogTimestamp) {
        this.UpdatePartyInfo(emulator, lastLogTimestamp);
        this.latestDisplayedState = Math.max(this.latestDisplayedState, lastLogTimestamp);
      }
    });
    emulator.on('currentEncounterChanged', (encounter) => {
      this.ResetPartyInfo(encounter);
    });

    emulator.on('preSeek', (time) => {
      this.latestDisplayedState = 0;
    });
    emulator.on('midSeek', (time) => {
      this.UpdatePartyInfo(emulator, time);
      this.latestDisplayedState = Math.max(this.latestDisplayedState, time);
    });
    let me = this;
    this.UpdateTriggerState = () => {
      if (me.$triggerHideCheckbox[0].checked)
        me.hideNonExecutedTriggers();
      else
        me.showNonExecutedTriggers();
    };
    this.$triggerHideCheckbox.on('change', this.UpdateTriggerState);
  }

  hideNonExecutedTriggers() {
    this.$triggerInfo.find('.trigger-not-executed').addClass('d-none');
  }

  showNonExecutedTriggers() {
    this.$triggerInfo.find('.trigger-not-executed').removeClass('d-none');
  }

  /**
   * @param {RaidEmulator} emulator
   * @param {string} timestamp
   */
  UpdatePartyInfo(emulator, timestamp) {
    for (let id in this.displayedParty)
      this.UpdateCombatantInfo(emulator.currentEncounter, id, timestamp);
  }

  /**
   * @param {AnalyzedEncounter} encounter
   */
  ResetPartyInfo(encounter) {
    this.displayedParty = {};
    this.latestDisplayedState = 0;
    this.$partyInfo.empty();
    this.$triggerBar.find('.triggerItem').remove();
    let membersToDisplay = encounter.encounter.combatantTracker.partyMembers.sort((l, r) => {
      let a = encounter.encounter.combatantTracker.combatants[l];
      let b = encounter.encounter.combatantTracker.combatants[r];
      return EmulatedPartyInfo.JobOrder.indexOf(a.job) - EmulatedPartyInfo.JobOrder.indexOf(b.job);
    }).slice(0, 8);
    $('.playerTriggerInfo').remove();

    for (let i = 0; i < membersToDisplay.length; ++i) {
      let id = membersToDisplay[i];
      let obj = this.GetPartyInfoObjectFor(encounter, id);
      this.displayedParty[id] = obj;
      this.UpdateCombatantInfo(encounter, id);
      this.$partyInfo.append(obj.$rootElem);
      this.$triggerInfo.append(obj.$triggerElem);
      this.triggerBars[i]
        .removeClass('tank healer dps')
        .addClass(Util.jobToRole(encounter.encounter.combatantTracker.combatants[id].job));

      for (let triggerIndex in encounter.perspectives[id].triggers) {
        let trigger = encounter.perspectives[id].triggers[triggerIndex];
        if (!trigger.status.Executed || trigger.resolvedOffset > encounter.encounter.duration)
          continue;

        let $e = $('<div class="triggerItem"></div>');
        $e.css('left', ((trigger.resolvedOffset / encounter.encounter.duration) * 100) + '%');
        $e.tooltip({
          title: trigger.trigger.id,
          placement: 'bottom',
        });
        this.triggerBars[i].append($e);
      }
    }

    this.UpdateTriggerState();

    this.selectPerspective(membersToDisplay[0]);
  }

  selectPerspective(id) {
    if (id === this.currentPerspective)
      return;

    this.currentPerspective = id;
    this.$triggerInfo.find('.playerTriggerInfo').addClass('d-none');
    this.displayedParty[id].$triggerElem.removeClass('d-none');
    this.$partyInfo.find('.playerInfoRow').removeClass('border border-success');
    this.displayedParty[id].$rootElem.addClass('border border-success');
    this.dispatch('SelectPerspective', id);
  }

  UpdateCombatantInfo(encounter, id, stateID = null) {
    if (stateID <= this.latestDisplayedState)
      return;

    let combatant = encounter.encounter.combatantTracker.combatants[id];
    stateID = stateID || combatant.getState(0);

    let State = combatant.getState(stateID);
    if (State === undefined)
      return;

    let hpProg = (State.HP / State.maxHP) * 100;
    let hpLabel = State.HP + '/' + State.maxHP;
    hpLabel = spacePadLeft(hpLabel, (State.maxHP.toString().length * 2) + 1);
    this.displayedParty[id].$hpProgElem.attr('aria-valuenow', State.HP);
    this.displayedParty[id].$hpProgElem.attr('aria-valuemax', State.maxHP);
    this.displayedParty[id].$hpProgElem.css('width', hpProg + '%');
    this.displayedParty[id].$hpLabelElem.text(hpLabel);

    let mpProg = (State.MP / State.maxMP) * 100;
    let mpLabel = State.MP + '/' + State.maxMP;
    mpLabel = spacePadLeft(mpLabel, (State.maxMP.toString().length * 2) + 1);
    this.displayedParty[id].$mpProgElem.attr('aria-valuenow', State.MP);
    this.displayedParty[id].$mpProgElem.attr('aria-valuemax', State.maxMP);
    this.displayedParty[id].$mpProgElem.css('width', mpProg + '%');
    this.displayedParty[id].$mpLabelElem.text(mpLabel);
  }

  GetPartyInfoObjectFor(encounter, id) {
    let ret = {
      $rootElem: $('<div class="playerInfoRow"></div>'),
      $iconElem: $('<div class="jobicon"></div>'),
      $hpElem: $('<div class="hp"><div class="progress"></div></div>'),
      $hpLabelElem: $('<div class="label text-monospace"></div>'),
      $hpProgElem: $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax=""></div>'),
      $mpElem: $('<div class="mp"><div class="progress"><div class="label"></div></div></div>'),
      $mpLabelElem: $('<div class="label text-monospace"></div>'),
      $mpProgElem: $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax=""></div>'),
      id: id,
      $triggerElem: this.GetTriggerInfoObjectFor(encounter, id),
    };

    let combatant = encounter.encounter.combatantTracker.combatants[id];
    ret.$rootElem.addClass(combatant.job.toUpperCase());
    ret.$rootElem.append(ret.$iconElem);
    ret.$hpElem.children('.progress').append(ret.$hpProgElem, ret.$hpLabelElem);
    ret.$mpElem.children('.progress').append(ret.$mpProgElem, ret.$mpLabelElem);
    ret.$rootElem.append(ret.$hpElem);
    ret.$rootElem.append(ret.$mpElem);
    ret.$rootElem.tooltip({
      animation: false,
      placement: 'left',
      title: combatant.name,
    });
    let me = this;
    ret.$rootElem.on('click', (e) => {
      me.selectPerspective(id);
    });
    ret.$triggerElem.data('id', id);
    return ret;
  }

  GetTriggerInfoObjectFor(encounter, id) {
    let $ret = $('<div class="playerTriggerInfo d-none"></div>');
    let $container = $('<div class="d-flex flex-column"></div>');
    $ret.append($container);

    let per = encounter.perspectives[id];

    let $initDataViewer = $('<pre class="json-viewer"></pre>');
    $initDataViewer.text(JSON.stringify(per.initialData, null, 2));

    $container.append(this._WrapCollapse('Initial Data', $initDataViewer, () => {
      $initDataViewer.text(JSON.stringify(per.initialData, null, 2));
    }));

    let $triggerContainer = $('<div class="d-flex flex-column"></div>');

    for (let i in per.triggers.sort((l, r) => l.resolvedOffset - r.resolvedOffset)) {
      let $triggerDataViewer = $('<pre class="json-viewer"></pre>');
      let buttonName = this.GetTriggerFiredLabelTime(per.triggers[i]) +
        ' - ' + per.triggers[i].trigger.id;
      let $trigger = this._WrapCollapse(buttonName, $triggerDataViewer, () => {
        $triggerDataViewer.text(JSON.stringify(per.triggers[i], null, 2));
      });
      let $buttonWrapper = $trigger.children('.wrap-collapse-button');
      let $label = $('<div class="trigger-label"></div>');
      let $labelText = $('<div class="trigger-label-text"></div>');
      let $labelTime = $('<div class="trigger-label-time"></div>');
      $labelText.text(this.GetTriggerLabelText(per.triggers[i]));
      $labelTime.text(this.GetTriggerResolvedLabelTime(per.triggers[i]));
      $label.append($labelTime, $labelText);
      $buttonWrapper.append($label);
      if (per.triggers[i].status.Executed)
        $trigger.addClass('trigger-executed');
      else
        $trigger.addClass('trigger-not-executed');

      $triggerContainer.append($trigger);
    }

    $container.append($triggerContainer);

    let $finalDataViewer = $('<pre class="json-viewer"></pre>');
    $finalDataViewer.text(JSON.stringify(per.finalData, null, 2));

    $container.append(this._WrapCollapse('Final Data', $finalDataViewer, () => {
      $finalDataViewer.text(JSON.stringify(per.finalData, null, 2));
    }));

    return $ret;
  }

  GetTriggerLabelText(trigger) {
    let ret = trigger.status.Result;
    if (typeof (ret) === 'function')
      ret = ret(AnalyzedEncounter.cloneData(trigger.postData, true), trigger.matches);

    if (typeof (ret) === 'object') {
      let lang = trigger.postData.lang;
      if (ret[lang])
        ret = ret[lang];
      else
        ret = JSON.stringify(ret); // Panic!
    } else if (typeof (ret) === 'boolean') {
      ret = '';
    } else if (typeof (ret) === 'undefined') {
      ret = '';
    } else if (typeof (ret) !== 'string') {
      ret = 'Invalid Result?';
    }
    return ret;
  }

  GetTriggerFiredLabelTime(Trigger) {
    return timeToString(Trigger.offset, false);
  }

  GetTriggerResolvedLabelTime(Trigger) {
    return timeToString(Trigger.resolvedOffset, false);
  }

  _WrapCollapse(label, $obj, onclick) {
    let $ret = $('<div class="wrap-collapse"></div>');
    let $button = $('<button class="btn btn-outline-light btn-sm text-white" type="button">' + label + '</button>');
    let $buttonContainer = $('<div class="wrap-collapse-button"></div>');
    $buttonContainer.append($button);
    let $wrapper = $('<div class="wrap-collapse-wrapper d-none"></div>');
    $button.on('click', () => {
      $wrapper.toggleClass('d-none');
      onclick && onclick();
    });
    $wrapper.append($obj);
    $ret.append($buttonContainer, $wrapper);
    return $ret;
  }
}

EmulatedPartyInfo.JobOrder = [
  'PLD', 'WAR', 'DRK', 'GNB',
  'WHM', 'SCH', 'AST',
  'MNK', 'DRG', 'NIN', 'SAM',
  'BRD', 'MCH', 'DNC',
  'BLM', 'SMN', 'RDM',
  'BLU'];
