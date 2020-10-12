'use strict';

const { assert } = require('chai');

// Quite bogus.
let bogusLine = 'using act is cheating';

// An automated way to test standard regex functions that take a dictionary of fields.
let regexCaptureTest = (func, lines) => {
  // regex should not match the bogus line.
  assert.isNull(bogusLine.match(func({})));

  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i];

    // Undefined params (default capture).
    let undefinedParamsMatch = line.match(func());
    assert.isNotNull(undefinedParamsMatch, '' + func() + ' did not match ' + line);
    assert.notPropertyVal(undefinedParamsMatch, 'groups', undefined, func().source);

    // Empty params (default capture).
    let emptyParamsMatch = line.match(func({}));
    assert.isNotNull(emptyParamsMatch, '' + func({}) + ' did not match ' + line);
    assert.notPropertyVal(emptyParamsMatch, 'groups', undefined);

    // No capture match.
    let noCaptureMatch = line.match(func({ capture: false }));
    assert.isNotNull(noCaptureMatch);
    assert.propertyVal(noCaptureMatch, 'groups', undefined);

    // Capture match.
    let captureMatch = line.match(func({ capture: true }));
    assert.isNotNull(captureMatch);
    assert.notPropertyVal(captureMatch, 'groups', undefined);
    assert.isObject(captureMatch.groups);

    // Capture always needs at least one thing.
    let keys = Object.keys(captureMatch.groups);
    assert.isAbove(keys.length, 0);

    let explicitFields = {};
    explicitFields.capture = true;
    for (let j = 0; j < keys.length; ++j) {
      let key = keys[j];

      // Because matched values may have special regex
      // characters in it, escape these when specifying.
      let value = captureMatch.groups[key];
      let escaped = value;
      if (typeof value !== 'undefined')
        escaped = escaped.replace(/[.*+?^${}()]/g, '\\$&');
      explicitFields[key] = escaped;
    }

    // Specifying all the fields explicitly and capturing should
    // both match, and return the same thing.
    // This verifies that input parameters to the regex fields and
    // named matching groups are equivalent.
    let explicitCaptureMatch = line.match(func(explicitFields));
    assert.isNotNull(explicitCaptureMatch);
    assert.notPropertyVal(explicitCaptureMatch, 'groups', undefined);
    assert.isObject(explicitCaptureMatch.groups);
    assert.deepEqual(explicitCaptureMatch.groups, captureMatch.groups);

    // Not capturing with explicit fields should also work.
    explicitFields.capture = false;
    let explicitNoCaptureMatch = line.match(func(explicitFields));
    assert.isNotNull(explicitNoCaptureMatch);
    assert.propertyVal(explicitNoCaptureMatch, 'groups', undefined);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    regexCaptureTest: regexCaptureTest,
  };
}
