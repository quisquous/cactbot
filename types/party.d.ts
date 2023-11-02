import { Job, Role } from './job';
import { OutputStringsParamObject } from './trigger';

export type BasePartyMemberParamObject = {
  role?: Role;
  job?: Job;
  id?: string;
  name: string;
  nick: string;
};

export type PartyMemberParamObjectKeys = keyof BasePartyMemberParamObject;

export interface PartyMemberParamObject
  extends OutputStringsParamObject, BasePartyMemberParamObject {
  toString: () => string;
}

// This is a partial interface of both RaidbossOptions and OopsyOptions.
export interface PartyTrackerOptions {
  DefaultPlayerLabel: PartyMemberParamObjectKeys;
  PlayerNicks: { [gameName: string]: string };
}
