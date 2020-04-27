class EmulatedPartyInfo extends EventBus {
  static JobOrder = [
    'PLD', 'WAR', 'DRK', 'GNB',
    'WHM', 'SCH', 'AST',
    'MNK', 'DRG', 'NIN', 'SAM',
    'BRD', 'MCH', 'DNC',
    'BLM', 'SMN', 'RDM',
    'BLU'];

  /**
   * @type {jQuery}
   */
  $partyInfo;

  displayedParty = {};

  triggerBars;

  latestDisplayedState = 0;
  latestDisplayedState
  /**
   * @param {RaidEmulator} emulator 
   */
  constructor(emulator) {
    super();
    this.emulator = emulator;
    this.$partyInfo = $('.partyInfoColumn .party');
    this.$triggerInfo = $('.triggerInfoColumn');
    this.$triggerHideCheckbox = $('.triggerHideSkipped');
    this.$triggerBar = $('.playerTriggers');
    this.triggerBars = [];
    this.latestDisplayedState = 0;
    for (let i = 0; i < 8; ++i) {
      this.triggerBars[i] = this.$triggerBar.find('.player' + i);
    }
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
      if (me.$triggerHideCheckbox[0].checked) {
        me.HideNonExecutedTriggers();
      } else {
        me.ShowNonExecutedTriggers();
      }
    };
    this.$triggerHideCheckbox.on('change', this.UpdateTriggerState);
  }

  HideNonExecutedTriggers() {
    this.$triggerInfo.find('.trigger-not-executed').addClass('d-none');
  }

  ShowNonExecutedTriggers() {
    this.$triggerInfo.find('.trigger-not-executed').removeClass('d-none');
  }

  /**
   * @param {RaidEmulator} emulator 
   * @param {string} timestamp 
   */
  UpdatePartyInfo(emulator, timestamp) {
    for (let ID in this.displayedParty) {
      this.UpdateCombatantInfo(emulator.currentEncounter, ID, timestamp);
    }
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
      let ID = membersToDisplay[i];
      let obj = this.GetPartyInfoObjectFor(encounter, ID);
      this.displayedParty[ID] = obj;
      this.UpdateCombatantInfo(encounter, ID);
      this.$partyInfo.append(obj.$rootElem);
      this.$triggerInfo.append(obj.$triggerElem);
      this.triggerBars[i].removeClass('tank healer dps').addClass(Util.jobToRole(encounter.encounter.combatantTracker.combatants[ID].job));
      for (let triggerIndex in encounter.Perspectives[ID].Triggers) {
        let trigger = encounter.Perspectives[ID].Triggers[triggerIndex];
        if(!trigger.Status.Executed || trigger.resolvedOffset > encounter.encounter.duration) {
          continue;
        }
        let $e = $('<div class="triggerItem"></div>');
        $e.css('left', ((trigger.resolvedOffset / encounter.encounter.duration) * 100) + '%');
        $e.tooltip({
          title: trigger.Trigger.id,
          placement: 'bottom',
        });
        this.triggerBars[i].append($e);
      }
    }

    this.UpdateTriggerState();

    this.selectPerspective(membersToDisplay[0]);
  }

  CurrentPerspective = null;

  selectPerspective(ID) {
    if (ID === this.CurrentPerspective) {
      return;
    }
    this.CurrentPerspective = ID;
    this.$triggerInfo.find('.playerTriggerInfo').addClass('d-none');
    this.displayedParty[ID].$triggerElem.removeClass('d-none');
    this.$partyInfo.find('.playerInfoRow').removeClass('border border-success');
    this.displayedParty[ID].$rootElem.addClass('border border-success');
    this.dispatch('SelectPerspective', ID);
  }

  UpdateCombatantInfo(encounter, ID, StateID = null) {
    if (StateID <= this.latestDisplayedState) {
      return;
    }
    let combatant = encounter.encounter.combatantTracker.combatants[ID];
    StateID = StateID || combatant.getState(0);
    /**
     * @type {CombatantState}
     */
    let State = combatant.getState(StateID);
    if (State === undefined) {
      return;
    }
    let hpProg = (State.HP / State.maxHP) * 100;
    let hpLabel = State.HP + "/" + State.maxHP;
    hpLabel = spacePadLeft(hpLabel, (State.maxHP.toString().length * 2) + 1);
    this.displayedParty[ID].$hpProgElem.attr('aria-valuenow', State.HP);
    this.displayedParty[ID].$hpProgElem.attr('aria-valuemax', State.maxHP);
    this.displayedParty[ID].$hpProgElem.css('width', hpProg + '%');
    this.displayedParty[ID].$hpLabelElem.text(hpLabel);

    let mpProg = (State.MP / State.maxMP) * 100;
    let mpLabel = State.MP + "/" + State.maxMP;
    mpLabel = spacePadLeft(mpLabel, (State.maxMP.toString().length * 2) + 1);
    this.displayedParty[ID].$mpProgElem.attr('aria-valuenow', State.MP);
    this.displayedParty[ID].$mpProgElem.attr('aria-valuemax', State.maxMP);
    this.displayedParty[ID].$mpProgElem.css('width', mpProg + '%');
    this.displayedParty[ID].$mpLabelElem.text(mpLabel);
  }

  /**
   * @param {AnalyzedEncounter} encounter
   */
  GetPartyInfoObjectFor(encounter, ID) {
    let ret = {
      $rootElem: $('<div class="playerInfoRow"></div>'),
      $iconElem: $('<div class="jobicon"></div>'),
      $hpElem: $('<div class="hp"><div class="progress"></div></div>'),
      $hpLabelElem: $('<div class="label text-monospace"></div>'),
      $hpProgElem: $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax=""></div>'),
      $mpElem: $('<div class="mp"><div class="progress"><div class="label"></div></div></div>'),
      $mpLabelElem: $('<div class="label text-monospace"></div>'),
      $mpProgElem: $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax=""></div>'),
      ID: ID,
      $triggerElem: this.GetTriggerInfoObjectFor(encounter, ID),
    };
    /**
     * @type {Combatant}
     */
    let combatant = encounter.encounter.combatantTracker.combatants[ID];
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
      me.selectPerspective(ID);
    });
    ret.$triggerElem.data('ID', ID);
    return ret;
  }

  GetTriggerInfoObjectFor(encounter, ID) {
    let $ret = $('<div class="playerTriggerInfo d-none"></div>');
    let $container = $('<div class="d-flex flex-column"></div>');
    $ret.append($container);

    let per = encounter.Perspectives[ID];

    let $initDataViewer = $('<pre class="json-viewer"></pre>');
    $initDataViewer.text(JSON.stringify(per.InitialData, null, 2));

    $container.append(this._WrapCollapse('Initial Data', $initDataViewer, () => {
      $initDataViewer.text(JSON.stringify(per.InitialData, null, 2));
    }));

    let $triggerContainer = $('<div class="d-flex flex-column"></div>');

    for (let i in per.Triggers.sort((l,r) => l.resolvedOffset - r.resolvedOffset)) {
      let $triggerDataViewer = $('<pre class="json-viewer"></pre>');
      let $trigger = this._WrapCollapse(this.GetTriggerFiredLabelTime(per.Triggers[i]) + ' - ' + per.Triggers[i].Trigger.id, $triggerDataViewer, () => {
        $triggerDataViewer.text(JSON.stringify(per.Triggers[i], null, 2));
      });
      let $buttonWrapper = $trigger.children('.wrap-collapse-button');
      let $label = $('<div class="trigger-label"></div>');
      let $labelText = $('<div class="trigger-label-text"></div>');
      let $labelTime = $('<div class="trigger-label-time"></div>');
      $labelText.text(this.GetTriggerLabelText(per.Triggers[i]));
      $labelTime.text(this.GetTriggerResolvedLabelTime(per.Triggers[i]));
      $label.append($labelTime, $labelText);
      $buttonWrapper.append($label);
      if (per.Triggers[i].Status.Executed) {
        $trigger.addClass('trigger-executed');
      } else {
        $trigger.addClass('trigger-not-executed');
      }
      $triggerContainer.append($trigger);
    }

    $container.append($triggerContainer);

    let $finalDataViewer = $('<pre class="json-viewer"></pre>');
    $finalDataViewer.text(JSON.stringify(per.FinalData, null, 2));

    $container.append(this._WrapCollapse('Final Data', $finalDataViewer, () => {
      $finalDataViewer.text(JSON.stringify(per.FinalData, null, 2));
    }));

    return $ret;
  }

  GetTriggerLabelText(Trigger) {
    let ret = Trigger.Status.Result;
    if(typeof (ret) === 'function') {
      ret = ret(AnalyzedEncounter.CloneData(Trigger.PostData, true), Trigger.Matches);
    }
    if (typeof (ret) === 'object') {
      let lang = Trigger.PostData.lang;
      if (ret[lang]) {
        ret = ret[lang];
      } else {
        // Panic!
        ret = JSON.stringify(ret);
      }
    } else if(typeof (ret) === 'boolean') {
      ret = '';
    } else if(typeof (ret) === 'undefined') {
      ret = '';
    } else if(typeof (ret) !== 'string') {
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