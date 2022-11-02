import { assert } from 'chai';

import contentList from '../../resources/content_list';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';
import { ZoneIdType } from '../../types/trigger';

const zoneIdToName = (() => {
  const zoneIdToName: { [zoneid: number]: string } = {};
  for (const [key, zoneId] of Object.entries(ZoneId)) {
    if (zoneId === ZoneId.MatchAll)
      continue;
    zoneIdToName[zoneId] = key;
  }
  return zoneIdToName;
})();

describe('resource tests', () => {
  it('content list has valid zone ids', () => {
    // Print the previous value because that's easier to find than the index.
    let prevValue = '';
    contentList.forEach((_zoneId, idx) => {
      for (const zoneId of contentList) {
        if (zoneId === ZoneId.MatchAll)
          return;
        assert.isTrue(
          zoneId in zoneIdToName,
          `Bad ZoneId in content_list.ts, idx: ${idx}, prev: ${prevValue}`,
        );
        prevValue = zoneIdToName[zoneId] ?? '';
      }
    });
  });
  it('content list has corresponding zone info', () => {
    contentList.forEach((zoneId, idx) => {
      // MatchAll is the one synthetic zone id, so does not count here.
      if (zoneId === ZoneId.MatchAll)
        return;
      assert.isTrue(
        zoneId in ZoneInfo,
        `Missing ZoneInfo for content_list.ts, idx: ${idx}, id: ${zoneIdToName[zoneId] ?? ''}`,
      );
    });
  });
  it('content list is unique', () => {
    const seenZoneIds = new Set<ZoneIdType>();
    contentList.forEach((zoneId, idx) => {
      if (zoneId === ZoneId.MatchAll)
        return;
      assert.isTrue(
        !seenZoneIds.has(zoneId),
        `Duplicate ZoneId in content_list.ts, idx: ${idx}, id: ${zoneIdToName[zoneId] ?? ''}`,
      );
      seenZoneIds.add(zoneId);
    });
  });
});
