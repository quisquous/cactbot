import chai from 'chai';

import { builtInResponseStr, Responses, severityList, severityMap, triggerFunctions } from '../../resources/responses';
import { RaidbossData } from '../../types/data';
import { Matches } from '../../types/net_matches';
import { Output, ResponseFunc, ResponseOutput } from '../../types/trigger';

const { assert } = chai;
// test_trigger.js will validate the field names, so no need to do that here.

const outputStringSetterStr = 'output.responseOutputStrings = ';

type ResponseFuncOutput =
  | ResponseOutput<RaidbossData, Matches>
  | ResponseFunc<RaidbossData, Matches>;

const runResponseFunc = (
  func: (data: RaidbossData, matches: Matches, output: Output) => ResponseFuncOutput,
): ResponseFuncOutput => {
  // Built-in responses must be callable with empty parameters.
  const empty = {};
  return func(empty as RaidbossData, empty as Matches, empty as Output);
};

describe('response tests', () => {
  it('responses with default severity are valid', () => {
    for (const responseFunc of Object.values(Responses)) {
      let result: ResponseFuncOutput = responseFunc();
      if (typeof result === 'function') {
        assert.include(result.toString(), outputStringSetterStr);
        assert.include(result.toString(), builtInResponseStr);
        result = runResponseFunc(result);
      }

      assert.isObject(result);
      if (typeof result !== 'object')
        return;

      // Must only include valid keys.
      assert.includeMembers(triggerFunctions, Object.keys(result));
      // Must have at least one valid field.
      assert.isNotEmpty(result);
    }
  });
  it('responses with a single explicit severity are valid', () => {
    for (const responseFunc of Object.values(Responses)) {
      // Every function accepts as a single arg one of the keys from severityMap.
      // If passed, it then that text must appear.  e.g. 'info' must create 'infoText'.
      for (const sev of severityList) {
        let result: ResponseFuncOutput = responseFunc(sev);
        if (typeof result === 'function') {
          assert.include(result.toString(), outputStringSetterStr);
          assert.include(result.toString(), builtInResponseStr);
          result = runResponseFunc(result);
        }
        assert.isObject(result);
        if (typeof result !== 'object')
          return;

        const keys = Object.keys(result);
        // Must only include valid keys.
        assert.includeMembers(triggerFunctions, keys);

        // Must include the request severity text.
        // TODO: If we ever have something that is like tts only,
        // then this will need some sort of allow/deny list.
        assert.property(result, severityMap[sev]);
      }
    }
  });
  it('responses with a double explicit severities are valid', () => {
    // TODO: we could figure out which has multiple parameters programmatically.
    const doubleFuncs: (keyof typeof Responses)[] = [
      'sharedTankBuster',
      'tankBuster',
      'tankBusterSwap',
      'knockbackOn',
      'preyOn',
    ];

    for (const doubleFunc of doubleFuncs) {
      for (const sev1 of severityList) {
        for (const sev2 of severityList) {
          let result: ResponseFuncOutput = Responses[doubleFunc](sev1, sev2);
          if (typeof result === 'function') {
            assert.include(result.toString(), outputStringSetterStr);
            assert.include(result.toString(), builtInResponseStr);
            result = runResponseFunc(result);
          }
          assert.isObject(result);
          if (typeof result !== 'object')
            return;

          // Must only include valid keys.
          assert.includeMembers(triggerFunctions, Object.keys(result));

          // Must include the requested severity texts.
          assert.property(result, severityMap[sev1]);
          assert.property(result, severityMap[sev2]);
        }
      }
    }
  });
});
