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

    this.partyNames_ = [];
    this.partyIds_ = [];
    this.allianceNames_ = [];
    this.allianceIds_ = [];
    this.nameToRole_ = {};
    this.idToName_ = {};

    // role -> [names] but only for party
    this.roleToPartyNames_ = {};
    for (const role of Util.getAllRoles())
      this.roleToPartyNames_[role] = [];

    for (const p of e.party) {
      this.allianceIds_.push(p.id);
      this.allianceNames_.push(p.name);
      const jobName = Util.jobEnumToJob(p.job);
      const role = Util.jobToRole(jobName);
      this.idToName_[p.id] = p.name;
      this.nameToRole_[p.name] = role;
      if (p.inParty) {
        this.partyIds_.push(p.id);
        this.partyNames_.push(p.name);
        this.roleToPartyNames_[role].push(p.name);
      }
    }
  }

  // returns an array of the names of players in your immediate party
  get partyNames() {
    return this.partyNames_;
  }

  get partyIds() {
    return this.partyIds_;
  }

  // returns an array of the names of players in your alliance
  get allianceNames() {
    return this.allianceNames_;
  }

  // returns an array of the names of tanks in your immediate party
  get tankNames() {
    return this.roleToPartyNames_['tank'];
  }

  // returns an array of the names of healers in your immediate party
  get healerNames() {
    return this.roleToPartyNames_['healer'];
  }

  // returns an array of the names of dps players in your immediate party
  get dpsNames() {
    return this.roleToPartyNames_['dps'];
  }

  // returns true iff the named player in your alliance is a particular role
  isRole(name, role) {
    return this.nameToRole_[name] === role;
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
    return this.partyNames.includes(name);
  }

  // returns true iff the named player is in your alliance
  inAlliance(name) {
    return this.allianceNames.includes(name);
  }

  // for a named player, returns the other tank in your immediate party
  // if named player is not a tank, or there's not exactly two tanks
  // in your immediate party, returns null.
  otherTank(name) {
    let names = this.tankNames;
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

  nameFromId(id) {
    return this.idToName_[id];
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = PartyTracker;
