'use strict';

const { Responses, severityMap, triggerFunctions } = require('../../resources/responses.js');

const { assert } = require('chai');

// test_trigger.js will validate the field names, so no need to do that here.

let tests = {
  defaultSeverity: () => {
    for (let response in Responses) {
      let result = Responses[response]();
      assert.isObject(result);

      // Must only include valid keys.
      assert.includeMembers(triggerFunctions, Object.keys(result));
      // Must have at least one valid field.
      assert.isNotEmpty(result);
    }
  },
  singleSeverity: () => {
    for (let response in Responses) {
      let result = Responses[response]();

      // Every function accepts as a single arg one of the keys from severityMap.
      // If passed, it then that text must appear.  e.g. 'info' must create 'infoText'.
      for (let sev in severityMap) {
        let result = Responses[response](sev);
        assert.isObject(result);

        let keys = Object.keys(result);
        // Must only include valid keys.
        assert.includeMembers(triggerFunctions, keys);

        // Must include the request severity text.
        // TODO: If we ever have something that is like tts only,
        // then this will need some sort of allow/deny list.
        assert.property(result, severityMap[sev]);
      }
    }
  },
  doubleSeverity: () => {
    // TODO: we could figure out which has multiple parameters programatically.
    let doubleFuncs = [
      'tankBuster',
      'tankBusterSwap',
      'knockbackOn',
      'preyOn',
    ];

    for (let i = 0; i < doubleFuncs.length; ++i) {
      for (let sev1 in severityMap) {
        for (let sev2 in severityMap) {
          let result = Responses[doubleFuncs[i]](sev1, sev2);
          assert.isObject(result);

          // Must only include valid keys.
          assert.includeMembers(triggerFunctions, Object.keys(result));

          // Must include the requested severity texts.
          assert.property(result, severityMap[sev1]);
          assert.property(result, severityMap[sev2]);
        }
      }
    }
  },
};

let keys = Object.keys(tests);
let exitCode = 0;
for (let i = 0; i < keys.length; ++i) {
  try {
    tests[keys[i]]();
  } catch (e) {
    console.log(e);
    exitCode = 1;
  }
}
process.exit(exitCode);
