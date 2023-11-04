import { Party } from '../types/event';
import { Job, Role } from '../types/job';
import { PartyMemberParamObject, PartyTrackerOptions } from '../types/party';

import Util from './util';

const emptyRoleToPartyNames = () => {
  return {
    tank: [],
    healer: [],
    dps: [],
    crafter: [],
    gatherer: [],
    none: [],
  };
};

export default class PartyTracker {
  details: Party[] = [];
  partyNames_: string[] = [];
  partyIds_: string[] = [];
  allianceNames_: string[] = [];
  allianceIds_: string[] = [];
  nameToRole_: { [name: string]: Role } = {};
  idToName_: { [id: string]: string } = {};
  roleToPartyNames_: Record<Role, string[]> = emptyRoleToPartyNames();

  constructor(private options: PartyTrackerOptions) {}

  // Bind this to PartyChanged events.
  onPartyChanged(e: { party: Party[] }): void {
    this.reset();
    this.details = e.party;

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

  reset(): void {
    // original event data
    this.details = [];
    this.partyNames_ = [];
    this.partyIds_ = [];
    this.allianceNames_ = [];
    this.allianceIds_ = [];
    this.nameToRole_ = {};
    this.idToName_ = {};

    // role -> [names] but only for party
    this.roleToPartyNames_ = emptyRoleToPartyNames();
  }

  // returns an array of the names of players in your immediate party
  get partyNames(): readonly string[] {
    return this.partyNames_;
  }

  get partyIds(): readonly string[] {
    return this.partyIds_;
  }

  // returns an array of the names of players in your alliance
  get allianceNames(): readonly string[] {
    return this.allianceNames_;
  }

  // returns an array of the names of tanks in your immediate party
  get tankNames(): readonly string[] {
    return this.roleToPartyNames_['tank'];
  }

  // returns an array of the names of healers in your immediate party
  get healerNames(): readonly string[] {
    return this.roleToPartyNames_['healer'];
  }

  // returns an array of the names of dps players in your immediate party
  get dpsNames(): readonly string[] {
    return this.roleToPartyNames_['dps'];
  }

  // returns true if the named player in your alliance is a particular role
  isRole(name: string, role: string): boolean {
    return this.nameToRole_[name] === role;
  }

  // returns true if the named player in your alliance is a tank
  isTank(name: string): boolean {
    return this.isRole(name, 'tank');
  }

  // returns true if the named player in your alliance is a healer
  isHealer(name: string): boolean {
    return this.isRole(name, 'healer');
  }

  // returns true if the named player in your alliance is a dps
  isDPS(name: string): boolean {
    return this.isRole(name, 'dps');
  }

  // returns true if the named player is in your immediate party
  inParty(name: string): boolean {
    return this.partyNames.includes(name);
  }

  // returns true if the named player is in your alliance
  inAlliance(name: string): boolean {
    return this.allianceNames.includes(name);
  }

  // for a named player, returns the other tank in your immediate party
  // if named player is not a tank, or there's not exactly two tanks
  // in your immediate party, returns null.
  otherTank(name: string): string | undefined {
    const names = this.tankNames;
    if (names.length !== 2)
      return;
    if (names[0] === name)
      return names[1];
    if (names[1] === name)
      return names[0];
  }

  // see: otherTank, but for healers.
  otherHealer(name: string): string | undefined {
    const names = this.healerNames;
    if (names.length !== 2)
      return;
    if (names[0] === name)
      return names[1];
    if (names[1] === name)
      return names[0];
  }

  // returns the job name of the specified party member
  jobName(name: string): Job | undefined {
    const partyIndex = this.partyNames.indexOf(name);
    if (partyIndex < 0)
      return;
    const job = this.details[partyIndex]?.job;
    if (job === undefined)
      return;
    return Util.jobEnumToJob(job);
  }

  nameFromId(id: string): string | undefined {
    return this.idToName_[id];
  }

  member(name?: string): PartyMemberParamObject {
    // For boilerplate convenience in triggers, handle undefined names.
    if (name === undefined) {
      const unknown = '???';
      return {
        name: unknown,
        nick: unknown,
        toString: () => unknown,
      };
    }

    const partyMember = this.details.find((member) => member.name === name);
    let ret: PartyMemberParamObject;
    const nick = Util.shortName(name, this.options.PlayerNicks);

    if (!partyMember) {
      // If we can't find this party member for some reason, use some sort of default.
      ret = {
        name: name,
        nick: nick,
      };
    } else {
      const jobName = Util.jobEnumToJob(partyMember.job);
      const role = Util.jobToRole(jobName);
      ret = {
        id: partyMember.id,
        job: jobName,
        role: role,
        name: name,
        nick: nick,
      };
    }

    // Need to assign this afterwards so it can reference `ret`.
    ret.toString = () => {
      const retVal = ret[this.options.DefaultPlayerLabel];
      if (typeof retVal === 'string')
        return retVal;
      return ret.nick;
    };

    return ret;
  }
}
