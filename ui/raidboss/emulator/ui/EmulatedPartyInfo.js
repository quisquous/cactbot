class EmulatedPartyInfo {
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
    this.$partyInfo = $('.partyInfoColumn .party');
    emulator.on('LineEmitted', (timestamp, line) => {
      this.UpdatePartyInfo(emulator, timestamp);
    });
    emulator.on('CurrentEncounterChanged', (encounter) => {
      this.ResetPartyInfo(encounter);
    });
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
    let firstTimestamp = Object.keys(encounter.encounter.combatantTracker.combatants[encounter.encounter.combatantTracker.mainCombatantID].States)[0];
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
    }
  }

  UpdateCombatantInfo(encounter, ID, StateID = null) {
    let combatant = encounter.encounter.combatantTracker.combatants[ID];
    StateID = StateID || combatant.SignificantStates[0];
    /**
     * @type {CombatantState}
     */
    let State = combatant.States[StateID];
    let hpProg = (State.HP / State.MaxHP) * 100;
    this.displayedParty[ID].$hpProgElem.attr('aria-valuenow', State.HP);
    this.displayedParty[ID].$hpProgElem.attr('aria-valuemax', State.MaxHP);
    this.displayedParty[ID].$hpProgElem.css('width', hpProg + '%');
    this.displayedParty[ID].$hpProgElem.text(State.HP +"/"+ State.MaxHP);

    let mpProg = (State.MP / State.MaxMP) * 100;
    this.displayedParty[ID].$mpProgElem.attr('aria-valuenow', State.MP);
    this.displayedParty[ID].$mpProgElem.attr('aria-valuemax', State.MaxMP);
    this.displayedParty[ID].$mpProgElem.css('width', mpProg + '%');
    this.displayedParty[ID].$mpProgElem.text(State.MP +"/"+ State.MaxMP);
  }

  /**
   * @param {AnalyzedEncounter} encounter
   */
  GetPartyInfoObjectFor(encounter, ID) {
    let ret = {
      $rootElem: $('<div class="playerInfoRow"></div>'),
      $iconElem: $('<div class="jobicon"></div>'),
      $hpElem: $('<div class="hp"><div class="progress"></div></div>'),
      $hpProgElem: $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax=""></div>'),
      $mpElem: $('<div class="mp"><div class="progress"></div></div>'),
      $mpProgElem: $('<div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax=""></div>'),
      ID: ID,
    };
    /**
     * @type {Combatant}
     */
    let combatant = encounter.encounter.combatantTracker.combatants[ID];
    ret.$rootElem.addClass(combatant.Job.toUpperCase());
    ret.$rootElem.append(ret.$iconElem);
    ret.$hpElem.children('.progress').append(ret.$hpProgElem);
    ret.$mpElem.children('.progress').append(ret.$mpProgElem);
    ret.$rootElem.append(ret.$hpElem);
    ret.$rootElem.append(ret.$mpElem);
    return ret;
  }
}