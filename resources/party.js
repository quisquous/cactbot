'use strict';

class PartyTracker {
  constructor() {
    this.onPartyChanged({ party: [] });
  }

  // Bind this to PartyChanged events.
  onPartyChanged(e) {
    if (!e || !e.party)
      return;

    // original event data
    this.details = e.party;
    // array of names in party
    this.party = [];
    // array of names in alliance
    this.alliance = [];
    // name -> role
    this.nameToRole = {};
    // role -> [names] but only for party
    this.roleToPartyNames = kAllRoles.reduce((obj, role) => {
      obj[role] = [];
      return obj;
    }, {});

    for (let i = 0; i < e.party.length; ++i) {
      let p = e.party[i];
      this.allianceNames.push(p.name);
      let jobName = Util.jobEnumToJob(p.job);
      let role = Util.jobToRole(jobName);
      this.nameToRole[p.name] = role;
      if (p.inParty) {
        this.partyNames.push(p.name);
        this.roleToPartyNames[role].push(p.name);
      }
    }
  }

  // returns an array of the names of players in your immediate party
  get partyNames() {
    return this.party;
  }

  // returns an array of the names of players in your alliance
  get allianceNames() {
    return this.alliance;
  }

  // returns an array of the names of tanks in your immediate party
  get tankNames() {
    return this.roleToPartyNames['tank'];
  }

  // returns an array of the names of healers in your immediate party
  get healerNames() {
    return this.roleToPartyNames['healer'];
  }

  // returns an array of the names of dps players in your immediate party
  get dpsNames() {
    return this.roleToPartyNames['dps'];
  }

  // returns true iff the named player in your alliance is a particular role
  isRole(name, role) {
    return this.nameToRole[name] === role;
  }

  // returns true iff the named player in your alliance is a tank
  isTank(name) {
    return this.isRole(name, 'tank');
  }

  // returns true iff the named player in your alliance is a healer
  isHealer(name) {
    return this.isRole(name, 'healer');
  }

  // returns true iff the named player in your alliance is a dps
  isDPS(name) {
    return this.isRole(name, 'dps');
  }

  // returns true iff the named player is in your immediate party
  inParty(name) {
    return this.partyNames.indexOf(name) >= 0;
  }

  // returns true iff the named player is in your alliance
  inAlliance(name) {
    return this.allianceNames.indexOf(name) >= 0;
  }

  // for a named player, returns the other tank in your immediate party
  // if named player is not a tank, or there's not exactly two tanks
  // in your immediate party, returns null.
  otherTank(name) {
    let names = this.roleToPartyNames['tank'];
    if (names.length != 2)
      return null;
    if (names[0] == name)
      return names[1];
    if (names[1] == name)
      return names[0];
    return null;
  }

  // see: otherTank, but for healers.
  otherHealer(name) {
    let names = this.roleToPartyNames['healer'];
    if (names.length != 2)
      return null;
    if (names[0] == name)
      return names[1];
    if (names[1] == name)
      return names[0];
    return null;
  }

  // returns the job name of the specified party member
  jobName(name) {
    let partyIndex = this.partyNames.indexOf(name);
    if (partyIndex >= 0)
      return Util.jobEnumToJob(this.details[partyIndex].job);
    return null;
  }
}
