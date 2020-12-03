import chai from 'chai';

const { assert } = chai;
// Quite bogus.
const bogusLine = 'using act is cheating';

// An automated way to test standard regex functions that take a dictionary of fields.
export default (func, lines) => {
  // regex should not match the bogus line.
  assert.isNull(bogusLine.match(func({})));

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];

    // Undefined params (default capture).
    const undefinedParamsMatch = line.match(func());
    assert.isNotNull(undefinedParamsMatch, '' + func() + ' did not match ' + line);
    assert.notPropertyVal(undefinedParamsMatch, 'groups', undefined, func().source);

    // Empty params (default capture).
    const emptyParamsMatch = line.match(func({}));
    assert.isNotNull(emptyParamsMatch, '' + func({}) + ' did not match ' + line);
    assert.notPropertyVal(emptyParamsMatch, 'groups', undefined);

    // No capture match.
    const noCaptureMatch = line.match(func({ capture: false }));
    assert.isNotNull(noCaptureMatch);
    assert.propertyVal(noCaptureMatch, 'groups', undefined);

    // Capture match.
    const captureMatch = line.match(func({ capture: true }));
    assert.isNotNull(captureMatch);
    assert.notPropertyVal(captureMatch, 'groups', undefined);
    assert.isObject(captureMatch.groups);

    // Capture always needs at least one thing.
    const keys = Object.keys(captureMatch.groups);
    assert.isAbove(keys.length, 0);

    const explicitFields = {};
    explicitFields.capture = true;
    for (let j = 0; j < keys.length; ++j) {
      const key = keys[j];

      // Because matched values may have special regex
      // characters in it, escape these when specifying.
      const value = captureMatch.groups[key];
      let escaped = value;
      if (typeof value !== 'undefined')
        escaped = escaped.replace(/[.*+?^${}()]/g, '\\$&');
      explicitFields[key] = escaped;
    }

    // Specifying all the fields explicitly and capturing should
    // both match, and return the same thing.
    // This verifies that input parameters to the regex fields and
    // named matching groups are equivalent.
    const explicitCaptureMatch = line.match(func(explicitFields));
    assert.isNotNull(explicitCaptureMatch);
    assert.notPropertyVal(explicitCaptureMatch, 'groups', undefined);
    assert.isObject(explicitCaptureMatch.groups);
    assert.deepEqual(explicitCaptureMatch.groups, captureMatch.groups);

    // Not capturing with explicit fields should also work.
    explicitFields.capture = false;
    const explicitNoCaptureMatch = line.match(func(explicitFields));
    assert.isNotNull(explicitNoCaptureMatch);
    assert.propertyVal(explicitNoCaptureMatch, 'groups', undefined);
  }
};
