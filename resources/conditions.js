// For consistency with Responses, Conditions
// are also functions.

/**
 * @typedef { import("../typing/data.d.ts").Data } Data
 */

export default class Conditions {
  static targetIsYou() {
    return (/** Data */data, matches) => data.me === matches.target;
  }

  static targetIsNotYou() {
    return (/** Data */data, matches) => data.me !== matches.target;
  }

  static caresAboutAOE() {
    return (/** Data */data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  }

  static caresAboutMagical() {
    return (/** Data */data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  }

  static caresAboutPhysical() {
    return (/** Data */data) => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
  }
}
