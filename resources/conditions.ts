// For consistency with Responses, Conditions
// are also functions.

import { RaidbossData as Data } from '../types/data';
import { TargetedMatches } from '../types/trigger';

type ConditionCannedFunction = (data: Data, matches?: TargetedMatches) => boolean;

export const targetIsYou = (): ConditionCannedFunction => {
  return (data, matches) => data.me === matches?.target;
};
export const targetIsNotYou = (): ConditionCannedFunction => {
  return (data, matches) => data.me !== matches?.target;
};
export const caresAboutAOE = (): ConditionCannedFunction => {
  return (data) =>
    data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
};
export const caresAboutMagical = (): ConditionCannedFunction => {
  return (data) =>
    data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
};
export const caresAboutPhysical = (): ConditionCannedFunction => {
  return (data) =>
    data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
};
