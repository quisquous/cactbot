// For consistency with Responses, Conditions
// are also functions.

import { Data } from '../types/data';


export default class Conditions {
  static targetIsYou() {
    return (data: Data, matches: any): boolean => data.me === matches.target;
  }
  static targetIsNotYou() {
    return (data: Data, matches: any): boolean => data.me !== matches.target;
  }
  static caresAboutAOE() {
    return (data: Data): boolean => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  }
  static caresAboutMagical() {
    return (data: Data): boolean => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  }
  static caresAboutPhysical() {
    return (data: Data): boolean => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
  }
}
