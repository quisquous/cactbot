'use strict';

// For consistency with Responses, Conditions
// are also functions.

let Conditions = {
  targetIsYou: () => (data, matches) => {
    return data.me == matches.target;
  },
  targetIsNotYou: () => (data, matches) => {
    return data.me !== matches.target;
  },
  caresAboutAOE: () => (data) => {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle() || data.job == 'BLU';
  },
  caresAboutMagical: () => (data) => {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle() || data.job == 'BLU';
  },
  caresAboutPhysical: () => (data) => {
    return data.role == 'tank' || data.role == 'healer' || data.CanFeint() || data.job == 'BLU';
  },
};

if (typeof module !== 'undefined' && module.exports)
  module.exports = Conditions;
