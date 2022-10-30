import { assert } from 'chai';

import { cleanName } from '../../util/csv_util';

describe('util/csv_util tests', () => {
  it('cleanName', () => {
    const arr: [string, string, string][] = [
      ['', '', 'should return empty string'],
      ['Sastasha', 'Sastasha', 'should return the same'],
      ['The Tam-Tara Deepcroft', 'TheTamTaraDeepcroft', 'should remove space and dash'],
      ['Brayflox\'s Longstop', 'BrayfloxsLongstop', 'should remove quotes'],
      [
        'The Sunken Temple of Qarn (Hard)',
        'TheSunkenTempleOfQarnHard',
        'should remove parenthesis',
      ],
      [
        'The Binding Coil of Bahamut - Turn 1',
        'TheBindingCoilOfBahamutTurn1',
        'should remove space and dash',
      ],
      [
        'The Palace of the Dead (Floors 1-10)',
        'ThePalaceOfTheDeadFloors1_10',
        'should add underline between numbers',
      ],
    ];
    arr.forEach(([actual, expected, message]) => {
      assert.equal(cleanName(actual), expected, message);
    });
  });
});
