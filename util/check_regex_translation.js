'use strict';

// The goal of these scripts is to make it possible to remove manually created/
// automatically generated locale regexes (e.g. regexDe/regexKo/etc) and instead
// use the timelineReplace section to also translate the regex.  This will make
// trigger files easier to read, make everything much less redundant, will
// reduce conflicts when translating new files, etc etc etc.
// The only problem is that due to the billion trigger files that exist, there
// are a lot of locale regexes that don't match what the replacements in
// timelineReplace would create for it.  Sometimes the timelineReplace section
// doesn't even exist even though the locale regexes do.
//
// BIG OOF
//
// So, if you have time, run this script for a particular locale.
// For anything that shows up in the output, add replacements to the
// "replaceSync" or "~effectNames" sections until it doesn't show up.
//
// At some point in the too far future, when everything has been replaced,
// then these scripts can be deleted, we can switch to using the timelineReplace
// section for trigger regex, and then we can delete all locale regex.

let triggersFile = process.argv[2];
let locale = process.argv[3];

let fs = require('fs');
let Regexes = require('../resources/regexes.js');
let Conditions = require('../resources/conditions.js');
let responseModule = require('../resources/responses.js');
let Responses = responseModule.responses;

let triggerSetList = eval(String(fs.readFileSync(triggersFile)));
let triggerSet = triggerSetList[0];
if (!triggerSet)
  process.exit(-1);
let triggers = triggerSet.triggers;
if (!triggers)
  process.exit(-1);

let localeReg = 'regex' + locale[0].toUpperCase() + locale[1];

let translations = triggerSet.timelineReplace;
if (!translations)
  process.exit(-1);

let kEffectNames = '~effectNames';

let trans = {
  'replaceSync': {},
  'replaceText': {},
  'kEffectNames': {},
};

for (let transBlock of translations) {
  if (!transBlock.locale || transBlock.locale !== locale)
    continue;
  trans = transBlock;
  break;
}

for (let trigger of triggers) {
  let origRegex = trigger.regex;
  let locRegex = trigger[localeReg];

  if (!origRegex || !locRegex)
    continue;

  origRegex = origRegex.source.toLowerCase();
  locRegex = locRegex.source.toLowerCase();

  let transRegex = origRegex;
  for (let regex in trans.replaceSync)
    transRegex = transRegex.replace(Regexes.parse(regex), trans.replaceSync[regex]);

  for (let regex in trans[kEffectNames])
    transRegex = transRegex.replace(Regexes.parse(regex), trans[kEffectNames][regex]);

  transRegex = transRegex.toLowerCase();
  if (transRegex === locRegex)
    continue;
  console.log({ id: trigger.id, orig: origRegex, tran: locRegex, auto: transRegex });
}
