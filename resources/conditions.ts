// For consistency with Responses, Conditions
// are also functions.


import { Data } from '../types/data';
import { Matches } from '../types/trigger';

import {
  StartsUsingParams,
  AbilityParams,
  AbilityFullParams,
  HeadMarkerParams,
  GainsEffectParams,
  StatusEffectExplicitParams,
  LosesEffectParams,
  TetherParams,
  WasDefeatedParams,
  Regex,
} from '../resources/regexes';

type TargetableMatches = Matches<Regex<
  StartsUsingParams |
  AbilityParams |
  AbilityFullParams |
  HeadMarkerParams |
  GainsEffectParams |
  StatusEffectExplicitParams |
  LosesEffectParams |
  TetherParams |
  WasDefeatedParams
>>;

export default {
  targetIsYou(): (data: Data, matches: TargetableMatches) => boolean {
    return (data: Data, matches: TargetableMatches) => data.me === matches.target;
  },
  targetIsNotYou(): (data: Data, matches: TargetableMatches) => boolean {
    return (data: Data, matches: TargetableMatches) => data.me !== matches.target;
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
