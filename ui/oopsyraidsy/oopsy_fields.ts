// This is the set of fields that will create mistakes.
export const oopsyTriggerSetOutputFields = [
  'damageWarn',
  'damageFail',
  'shareWarn',
  'shareFail',
  'gainsEffectWarn',
  'gainsEffectFail',
  'triggers',
];

// TODO: use this for testing validity of oopsy trigger sets in the event
// that we eventually get oopsy unit tests.  /o\
export const oopsyTriggerSetFields = [
  'zoneId',
  'zoneRegex',
  ...oopsyTriggerSetOutputFields,
];
