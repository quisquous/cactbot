import CsvUtil, { cleanName } from '../../util/csv_util';
import chai from 'chai';

const { assert } = chai;

describe('util/csv_util tests', () => {
  it('cleanName', () => {
    [
      ['', '', 'should return empty string'],
      [undefined, undefined, 'should return undefined'],
      [null, null, 'should return null'],
      ['Sastasha', 'Sastasha', 'should return the same'],
      ['The Tam-Tara Deepcroft', 'TheTamTaraDeepcroft', 'should remove space and dash'],
      ['Brayflox\'s Longstop', 'BrayfloxsLongstop', 'should remove quotes'],
      ['The Sunken Temple of Qarn (Hard)', 'TheSunkenTempleOfQarnHard', 'should remove parenthesis'],
      ['The Binding Coil of Bahamut - Turn 1', 'TheBindingCoilOfBahamutTurn1', 'should remove space and dash'],
      ['The Palace of the Dead (Floors 1-10)', 'ThePalaceOfTheDeadFloors1_10', 'should add underline between numbers'],
    ].forEach(([actual, expected, message]) => assert.equal(cleanName(actual), expected, message));
  });
});
