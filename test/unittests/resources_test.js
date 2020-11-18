import contentList from '../../resources/content_list.js';
import ZoneId from '../../resources/zone_id.js';

import chai from 'chai';
const { assert } = chai;

const zoneValueToId = (() => {
  const zoneValueToId = {};
  for (const key in ZoneId)
    zoneValueToId[ZoneId[key]] = key;
  return zoneValueToId;
})();

const tests = {
  contentListHasValidZoneId: () => {
    // Print the previous value because that's easier to find than the index.
    let prevValue = '';
    for (let idx = 0; idx < contentList.length; ++idx) {
      const zoneValue = contentList[idx];
      assert(zoneValue in zoneValueToId,
          `Bad ZoneId in content_list.js, idx: ${idx}, prev: ${prevValue}`);
      prevValue = zoneValue in zoneValueToId ? zoneValueToId[zoneValue] : '';
    }
  },
  contentListIsUnique: () => {
    const seenZoneValues = new Set();
    for (let idx = 0; idx < contentList.length; ++idx) {
      const zoneValue = contentList[idx];
      assert(!seenZoneValues.has(zoneValue),
          `Duplicate ZoneId in content_list.js, idx: ${idx}, id: ${zoneValueToId[zoneValue]}`);
      seenZoneValues.add(zoneValue);
    }
  },
};

let keys = Object.keys(tests);
let exitCode = 0;
for (const key of keys) {
  try {
    tests[key]();
  } catch (e) {
    console.log(e);
    exitCode = 1;
  }
}
process.exit(exitCode);
