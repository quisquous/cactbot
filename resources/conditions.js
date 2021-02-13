// For consistency with Responses, Conditions
// are also functions.


export default class Conditions {
  static targetIsYou() {
    return (data, matches) => data.me === matches.target;
  }
  static targetIsNotYou() {
    return (data, matches) => data.me !== matches.target;
  }
  static caresAboutAOE() {
    return (data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  }
  static caresAboutMagical() {
    return (data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
  }
  static caresAboutPhysical() {
    return (data) => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
  }
}
