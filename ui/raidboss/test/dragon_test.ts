import { UnreachableCode } from '../../../resources/not_reached';
import { badSpots, findDragonMarks, modDistance } from '../data/04-sb/ultimate/unending_coil_ultimate';

// TODO: move this into test, use mocha and chai instead of console.assert.

const testModDistance = () => {
  for (let i = 0; i < 8; ++i) {
    for (let j = -4; j <= 4; ++j) {
      console.assert(modDistance(i, (i + j + 8) % 8) === Math.abs(j));
      console.assert(modDistance(i, (i + j + 8) % 8) === Math.abs(j));
    }
  }
};
testModDistance();

const testBadSpots = () => {
  const equals = function(a: [number, number, number], b: number[]) {
    a.sort();
    b.sort();
    if (a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i])
        return false;
    }
    return true;
  };

  // 1 away dragons
  for (let i = 0; i < 8; ++i) {
    const before = (i - 1 + 8) % 8;
    const after = (i + 1) % 8;
    console.assert(equals([before, i, after], badSpots(i, before)));
    console.assert(equals([before, i, after], badSpots(i, after)));
  }

  // 2 away dragons
  for (let i = 0; i < 8; ++i) {
    const before2 = (i - 2 + 8) % 8;
    const before1 = (i - 1 + 8) % 8;
    const after1 = (i + 1) % 8;
    const after2 = (i + 2) % 8;
    console.assert(equals([before2, before1, i], badSpots(i, before2)));
    console.assert(equals([after2, after1, i], badSpots(i, after2)));
  }
};
testBadSpots();

const testFindDragonMarks = (array: number[], output: ReturnType<typeof findDragonMarks>) => {
  if (!output) {
    console.assert('missing output');
    return;
  }
  const marks = output.marks;
  const dragons = [];
  for (let i = 0; i < 8; ++i) {
    if (array[i])
      dragons.push(i);
  }
  console.assert(dragons.length === 5);

  console.assert(marks.length === 3);
  for (const mark of marks) {
    console.assert(mark >= 0);
    console.assert(mark < 8);
  }

  const [mark0, mark1, mark2] = marks;
  if (mark0 === undefined || mark1 === undefined || mark2 === undefined)
    throw new UnreachableCode();

  const [dragon0, dragon1, dragon2, dragon3, dragon4] = dragons;
  if (
    dragon0 === undefined || dragon1 === undefined || dragon2 === undefined ||
    dragon3 === undefined || dragon4 === undefined
  )
    throw new UnreachableCode();

  // Marks can't be in front of their dragons.
  console.assert(mark0 !== dragon0);
  console.assert(mark0 !== dragon1);
  console.assert(mark1 !== dragon2);
  console.assert(mark2 !== dragon3);
  console.assert(mark2 !== dragon4);

  // Marks can also be at most two away from a dragon except for one
  // tricksy edge case on dragon 3 where it can be three away.
  console.assert(modDistance(mark0, dragon0) <= 2);
  console.assert(modDistance(mark0, dragon1) <= 2);
  console.assert(modDistance(mark1, dragon2) <= 2);
  if (output.wideThirdDive)
    console.assert(modDistance(mark2, dragon3) === 3);
  else
    console.assert(modDistance(mark2, dragon3) <= 2);

  console.assert(modDistance(mark2, dragon4) <= 2);

  const bad0 = badSpots(mark0, dragon0).concat(badSpots(mark0, dragon1));
  const bad1 = badSpots(mark1, dragon2);

  // First set of dragons should not cover second mark.
  console.assert(!bad0.includes(mark1));
  // Second set of dragons should not cover third mark.
  console.assert(!bad1.includes(mark2));

  // Verify unsafe third mark.
  if (output.unsafeThirdMark)
    console.assert(bad0.includes(mark2));
  else
    console.assert(!bad0.includes(mark2));
};

let total = 0;
for (let i = 0; i < 256; ++i) {
  const array = [
    i & 0x80 ? 1 : 0,
    i & 0x40 ? 1 : 0,
    i & 0x20 ? 1 : 0,
    i & 0x10 ? 1 : 0,
    i & 0x08 ? 1 : 0,
    i & 0x04 ? 1 : 0,
    i & 0x02 ? 1 : 0,
    i & 0x01 ? 1 : 0,
  ];
  let count = 0;
  for (const arrValue of array)
    count += arrValue;

  if (count !== 5)
    continue;

  console.log(array);
  const output = findDragonMarks(array);
  console.log(output);
  testFindDragonMarks(array, output);
  ++total;
}

// 8 choose 5 == 56
console.assert(total === 56);
