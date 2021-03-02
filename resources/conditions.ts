// For consistency with Responses, Conditions
// are also functions.

import { Matches } from '../types/trigger';

interface SlimData {
  me: string;
  job: string;
  role: string;
  CanFeint: () => boolean;
  CanAddle: () => boolean;
}

export default {
  targetIsYou(): (data: SlimData, matches: Matches) => boolean {
    return (data: SlimData, matches: Matches) => data.me === matches.target;
  },
  targetIsNotYou(): (data: SlimData, matches: Matches) => boolean {
    return (data: SlimData, matches: Matches) => data.me !== matches.target;
  },
  caresAboutAOE(): (data: SlimData) => boolean {
    return (data: SlimData) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  },
  caresAboutMagical(): (data: SlimData) => boolean {
    return (data: SlimData) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  },
  caresAboutPhysical(): (data: SlimData) => boolean {
    return (data: SlimData) => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
  },
};
