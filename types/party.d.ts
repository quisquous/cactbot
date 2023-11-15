import { BaseOptions } from './data';
import { OutputStringsParamObject } from './trigger';

export type BasePartyMemberParamObject = {
  role?: string;
  job?: string;
  jobFull?: string;
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
export interface PartyTrackerOptions extends BaseOptions {
  DefaultPlayerLabel: PartyMemberParamObjectKeys;
  PlayerNicks: { [gameName: string]: string };
}
