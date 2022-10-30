import { assert } from 'chai';

import { UnreachableCode } from '../../resources/not_reached';

// Quite bogus.
const bogusLine = 'using act is cheating';

export type RegexUtilParams = { [key: string]: string | boolean };

// An automated way to test standard regex functions that take a dictionary of fields.
export default (func: (params?: RegexUtilParams) => RegExp, lines: readonly string[]): void => {
  // regex should not match the bogus line.
  assert.isNull(func({}).exec(bogusLine));

  for (const line of lines) {
    // Undefined params (default capture).
    const undefinedParamsMatch = func().exec(line);
    assert.isNotNull(undefinedParamsMatch, `${func().toString()} did not match ${line}`);
    assert.notPropertyVal(undefinedParamsMatch, 'groups', undefined, func().source);

    // Empty params (default capture).
    const emptyParamsMatch = func({}).exec(line);
    assert.isNotNull(emptyParamsMatch, `${func({}).toString()} did not match ${line}`);
    assert.notPropertyVal(emptyParamsMatch, 'groups', undefined);

    // No capture match.
    const noCaptureMatch = func({ capture: false }).exec(line);
    assert.isNotNull(noCaptureMatch);
    assert.propertyVal(noCaptureMatch, 'groups', undefined);

    // Capture match.
    const captureMatch = func({ capture: true }).exec(line);
    assert.isNotNull(captureMatch);
    assert.notPropertyVal(captureMatch, 'groups', undefined);
    const captureGroups = captureMatch?.groups;
    assert.isObject(captureGroups);

    if (typeof captureGroups !== 'object')
      throw new UnreachableCode();

    // Capture always needs at least one thing.
    const keys = Object.keys(captureGroups);
    assert.isAbove(keys.length, 0);

    const explicitFields: RegexUtilParams = { capture: true };
    for (const key of keys) {
      // Because matched values may have special regex
      // characters in it, escape these when specifying.
      const value = captureGroups[key];
      let escaped = value;
      if (escaped !== undefined) {
        escaped = escaped.replace(/[.*+?^${}()]/g, '\\$&');
        explicitFields[key] = escaped;
      }
    }

    // Specifying all the fields explicitly and capturing should
    // both match, and return the same thing.
    // This verifies that input parameters to the regex fields and
    // named matching groups are equivalent.
    const explicitCaptureMatch = func(explicitFields).exec(line);
    assert.isNotNull(explicitCaptureMatch);
    assert.notPropertyVal(explicitCaptureMatch, 'groups', undefined);
    assert.isObject(explicitCaptureMatch?.groups);
    assert.deepEqual(explicitCaptureMatch?.groups, captureMatch?.groups);

    // Not capturing with explicit fields should also work.
    explicitFields.capture = false;
    const explicitNoCaptureMatch = func(explicitFields).exec(line);
    assert.isNotNull(explicitNoCaptureMatch);
    assert.propertyVal(explicitNoCaptureMatch, 'groups', undefined);
  }
};
