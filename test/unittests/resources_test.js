import contentList from '../../resources/content_list';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';

import chai from 'chai';
const { assert } = chai;

const zoneValueToId = (() => {
  const zoneValueToId = {};
  for (const key in ZoneId)
    zoneValueToId[ZoneId[key]] = key;
  return zoneValueToId;
})();

describe('resource tests', () => {
  it('content list has valid zone ids', () => {
    // Print the previous value because that's easier to find than the index.
    let prevValue = '';
    for (let idx = 0; idx < contentList.length; ++idx) {
      const zoneValue = contentList[idx];
      assert(zoneValue in zoneValueToId,
        `Bad ZoneId in content_list.ts, idx: ${idx}, prev: ${prevValue}`);
      prevValue = zoneValue in zoneValueToId ? zoneValueToId[zoneValue] : '';
    }
  });
  it('content list has corresponding zone info', () => {
    for (let idx = 0; idx < contentList.length; ++idx) {
      const zoneValue = contentList[idx];
      // MatchAll is the one synthetic zone id, so does not count here.
      if (zoneValue === ZoneId.MatchAll)
        continue;
      assert(zoneValue in ZoneInfo,
        `Missing ZoneInfo for content_list.ts, idx: ${idx}, id: ${zoneValueToId[zoneValue]}`);
    }
  });
  it('content list is unique', () => {
    const seenZoneValues = new Set();
    for (let idx = 0; idx < contentList.length; ++idx) {
      const zoneValue = contentList[idx];
      assert(!seenZoneValues.has(zoneValue),
        `Duplicate ZoneId in content_list.ts, idx: ${idx}, id: ${zoneValueToId[zoneValue]}`);
      seenZoneValues.add(zoneValue);
    }
  });
});
