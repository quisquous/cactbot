'use strict';

// For consistency with Responses, Conditions
// are also functions.

let Conditions = {
  targetIsYou: () => (data, matches) => {
    return data.me == matches.target;
  },
  caresAboutAOE: () => (data) => {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
  },
  caresAboutMagical: () => (data) => {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
  },
  caresAboutPhysical: () => (data) => {
    return data.role == 'tank' || data.role == 'healer' || data.CanFeint();
  },
};

if (typeof module !== 'undefined' && module.exports)
  module.exports = Conditions;
