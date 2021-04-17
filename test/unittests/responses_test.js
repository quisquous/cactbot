import { Responses, severityMap, triggerFunctions, builtInResponseStr } from '../../resources/responses';
import chai from 'chai';
const { assert } = chai;
// test_trigger.js will validate the field names, so no need to do that here.

const outputStringSetterStr = 'output.responseOutputStrings = ';

describe('response tests', () => {
  it('responses with default severity are valid', () => {
    for (const response in Responses) {
      let result = Responses[response]();
      if (typeof result === 'function') {
        assert.include(result.toString(), outputStringSetterStr);
        assert.include(result.toString(), builtInResponseStr);
        result = result({}, {}, {});
      }

      assert.isObject(result);

      // Must only include valid keys.
      assert.includeMembers(triggerFunctions, Object.keys(result));
      // Must have at least one valid field.
      assert.isNotEmpty(result);
    }
  });
  it('responses with a single explicit severity are valid', () => {
    for (const response in Responses) {
      const result = Responses[response]();

      // Every function accepts as a single arg one of the keys from severityMap.
      // If passed, it then that text must appear.  e.g. 'info' must create 'infoText'.
      for (const sev in severityMap) {
        let result = Responses[response](sev);
        if (typeof result === 'function') {
          assert.include(result.toString(), outputStringSetterStr);
          assert.include(result.toString(), builtInResponseStr);
          result = result({}, {}, {});
        }
        assert.isObject(result);

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
    const doubleFuncs = [
      'tankBuster',
      'tankBusterSwap',
      'knockbackOn',
      'preyOn',
    ];

    for (let i = 0; i < doubleFuncs.length; ++i) {
      for (const sev1 in severityMap) {
        for (const sev2 in severityMap) {
          let result = Responses[doubleFuncs[i]](sev1, sev2);
          if (typeof result === 'function') {
            assert.include(result.toString(), outputStringSetterStr);
            assert.include(result.toString(), builtInResponseStr);
            result = result({}, {}, {});
          }
          assert.isObject(result);

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
