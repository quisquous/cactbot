// For consistency with Responses, Conditions
// are also functions.

import { RaidbossData as Data } from '../types/data';
import { TargetedMatches } from '../types/trigger';

export default {
  targetIsYou(): (data: Data, matches: TargetedMatches) => boolean {
    return (data: Data, matches: TargetedMatches) => data.me === matches?.target;
  },
  targetIsNotYou(): (data: Data, matches: TargetedMatches) => boolean {
    return (data: Data, matches: TargetedMatches) => data.me !== matches?.target;
  },
  caresAboutAOE(): (data: Data) => boolean {
    return (data: Data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  },
  caresAboutMagical(): (data: Data) => boolean {
    return (data: Data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  },
  caresAboutPhysical(): (data: Data) => boolean {
    return (data: Data) => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
  },
};
