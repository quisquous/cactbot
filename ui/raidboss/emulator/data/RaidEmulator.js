class RaidEmulator extends EventBus {
  constructor() {
    super();
    this.encounters = [];
    this.currentEncounter = null;
  }
  AddEncounter(encounter) {
    this.encounters.push(encounter);
  }
  SetCurrent(index) {
    this.currentEncounter = new AnalyzedEncounter(this.encounters[index]);
    this.dispatch('CurrentEncounterChanged', this.currentEncounter);
  }
  SetCurrentByID(ID) {
    let index = this.encounters.findIndex((v) => {
      return v.ID === ID;
    });
    if(index === -1) {
      return false;
    }
    this.SetCurrent(index);
  }
};
