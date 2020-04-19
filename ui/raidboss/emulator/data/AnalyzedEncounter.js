class AnalyzedEncounter extends EventBus {
  Perspectives = {};

  /** @type Encounter */
  encounter;

  constructor(encounter) {
    super();
    this.encounter = encounter;
    this.Analyze();
  }

  Analyze() {
    // @TODO: Make this run in parallel sometime in the future, since it could be really slow
    this.encounter.combatantTracker.partyMembers.forEach((ID) => {
      this.AnalyzeFor(ID);
    });
    this.dispatch('analyzed');
  }

  AnalyzeFor(ID) {

  }

  Playback(player, start = 0) {

  }
};
