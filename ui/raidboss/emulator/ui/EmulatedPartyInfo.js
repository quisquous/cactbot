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

  /**
   * @param {RaidEmulator} emulator 
   */
  constructor(emulator) {
    super();
    this.emulator = emulator;
    this.$partyInfo = $('.partyInfoColumn .party');
    this.$triggerInfo = $('.triggerInfoColumn');
    this.$triggerHideCheckbox = $('.triggerHideSkipped');
    emulator.on('Tick', (timestampOffset, lastLogTimestamp) => {
      if (lastLogTimestamp) {
        this.UpdatePartyInfo(emulator, lastLogTimestamp);
      }
    });
    emulator.on('CurrentEncounterChanged', (encounter) => {
      this.ResetPartyInfo(encounter);
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
    this.$partyInfo.empty();
    let membersToDisplay = encounter.encounter.combatantTracker.partyMembers.sort((l, r) => {
      let a = encounter.encounter.combatantTracker.combatants[l];
      let b = encounter.encounter.combatantTracker.combatants[r];
      return EmulatedPartyInfo.JobOrder.indexOf(a.Job) - EmulatedPartyInfo.JobOrder.indexOf(b.Job);
    }).slice(0, 8);

    for (let i = 0; i < membersToDisplay.length; ++i) {
      let ID = membersToDisplay[i];
      let obj = this.GetPartyInfoObjectFor(encounter, ID);
      this.displayedParty[ID] = obj;
      this.UpdateCombatantInfo(encounter, ID);
      this.$partyInfo.append(obj.$rootElem);
      this.$triggerInfo.append(obj.$triggerElem);
    }

    this.UpdateTriggerState();

    this.SelectPerspective(membersToDisplay[0]);
  }

  CurrentPerspective = null;

  SelectPerspective(ID) {
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
    let combatant = encounter.encounter.combatantTracker.combatants[ID];
    StateID = StateID || combatant.SignificantStates[0];
    /**
     * @type {CombatantState}
     */
    let State = combatant.States[StateID];
    if (State === undefined) {
      return;
    }
    let hpProg = (State.HP / State.MaxHP) * 100;
    let hpLabel = State.HP + "/" + State.MaxHP;
    hpLabel = hpLabel.padStart((('' + State.MaxHP).length * 2) + 1, ' '); // unicode nbsp (U+00A0)
    this.displayedParty[ID].$hpProgElem.attr('aria-valuenow', State.HP);
    this.displayedParty[ID].$hpProgElem.attr('aria-valuemax', State.MaxHP);
    this.displayedParty[ID].$hpProgElem.css('width', hpProg + '%');
    this.displayedParty[ID].$hpLabelElem.text(hpLabel);

    let mpProg = (State.MP / State.MaxMP) * 100;
    let mpLabel = State.MP + "/" + State.MaxMP;
    mpLabel = mpLabel.padStart((('' + State.MaxMP).length * 2) + 1, ' '); // unicode nbsp (U+00A0)
    this.displayedParty[ID].$mpProgElem.attr('aria-valuenow', State.MP);
    this.displayedParty[ID].$mpProgElem.attr('aria-valuemax', State.MaxMP);
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
    ret.$rootElem.addClass(combatant.Job.toUpperCase());
    ret.$rootElem.append(ret.$iconElem);
    ret.$hpElem.children('.progress').append(ret.$hpProgElem, ret.$hpLabelElem);
    ret.$mpElem.children('.progress').append(ret.$mpProgElem, ret.$mpLabelElem);
    ret.$rootElem.append(ret.$hpElem);
    ret.$rootElem.append(ret.$mpElem);
    ret.$rootElem.tooltip({
      animation: false,
      placement: 'left',
      title: combatant.Name,
    });
    let me = this;
    ret.$rootElem.on('click', (e) => {
      me.SelectPerspective(ID);
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

    for (let i in per.Triggers) {
      let $triggerDataViewer = $('<pre class="json-viewer"></pre>');
      let $trigger = this._WrapCollapse(per.Triggers[i].Trigger.id, $triggerDataViewer, () => {
        $triggerDataViewer.text(JSON.stringify(per.Triggers[i], null, 2));
      });
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

  _WrapCollapse(label, $obj, onclick) {
    let ID = this.UniqueCollapseID++;
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