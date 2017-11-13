// TODO: This tests the dragon marking algorithm.  This should
// probably be in some more general unit testing framework, but
// for now is just a "manual" test, with the code here being
// copied into the ultimate triggers.

// Begin copy and paste
var modDistance = function(mark, dragon) {
  var oneWay = (dragon - mark + 8) % 8;
  var otherWay = (mark - dragon + 8) % 8;
  var distance = Math.min(oneWay, otherWay);
  console.assert(distance >= 0);
  return distance;
};

var badSpots = function(mark, dragon) {
  // All spots between mark and dragon are bad.  If distance == 1,
  // then the dragon hits the spot behind the mark too.  e.g. N
  // mark, NE dragon will also hit NW.
  var bad = [];
  var distance = modDistance(mark, dragon);
  console.assert(distance > 0);
  console.assert(distance <= 2);
  if ((mark + distance + 8) % 8 == dragon) {
    // Clockwise.
    for (var i = 0; i <= distance; ++i)
      bad.push((mark + i) % 8);
    if (distance == 1)
      bad.push((mark - 1 + 8) % 8);
  } else {
    // Widdershins.
    for (var i = 0; i <= distance; ++i)
      bad.push((mark - i + 8) % 8);
    if (distance == 1)
      bad.push((mark + 1) % 8);
  }
  return bad;
};

var findDragonMarks = function(array) {
  var marks = [-1, -1, -1];
  var ret = {
    // Third drive is on a dragon three squares away and will cover
    // more of the middle than usual, e.g. SE dragon, SW dragon,
    // mark W (because S is unsafe from 2nd dive).
    wideThirdDive:  false,
    // Third mark spot is covered by the first dive so needs to be
    // patient.  Third mark should always be patient, but you never
    // know.
    unsafeThirdMark: false,
    marks: ['error', 'error', 'error'],
  };

  var dragons = [];
  for (var i = 0; i < 8; ++i) {
    if (array[i])
      dragons.push(i);
  }

  if (dragons.length != 5)
    return ret;

  // MARK 1: counterclockwise of #1 if adjacent, clockwise if not.
  if (dragons[0] + 1 == dragons[1]) {
    // If the first two dragons are adjacent, they *must* go CCW.
    // In the scenario of N, NE, SE, S, W dragons, the first marker
    // could be E, but that forces the second mark to be S (instead
    // of E), making SW unsafe for putting the mark between S and W.
    // Arguably, NW could be used here for the third mark, but then
    // the S dragon would cut off more of the middle of the arena
    // than desired.  This still could happen anyway in the
    // "tricksy" edge case below, but should be avoided if possible.
    marks[0] = (dragons[0] - 1 + 8) % 8;
  } else {
    // Split dragons.  Bias towards first dragon.
    marks[0] = Math.floor((dragons[0] + dragons[1]) / 2);
  }

  // MARK 2: go counterclockwise, unless dragon 2 is adjacent to 3.
  if (dragons[1] == dragons[2] - 1) {
    // Go clockwise.
    marks[1] = dragons[2] + 1;
  } else {
    // Go counterclockwise.
    marks[1] = dragons[2] - 1;
  }

  // MARK 3: if split, between 4 & 5.  If adjacent, clockwise of 5.
  if (dragons[3] + 1 == dragons[4]) {
    // Adjacent dragons.
    // Clockwise is always ok.
    marks[2] = (dragons[4] + 1) % 8;

    // Minor optimization:
    // See if counterclockwise is an option to avoid having mark 3
    // in a place that the first pair covers.
    //
    // If dragon 3 is going counterclockwise, then only need one
    // hole between #3 and #4, otherwise need all three holes.
    // e.g. N, NE, E, W, NW dragon pattern should prefer third
    // mark SW instead of N.
    var distance = marks[1] == dragons[2] - 1 ? 2 : 4;
    if (dragons[3] >= dragons[2] + distance) {
      marks[2] = dragons[3] - 1;
    }
  } else {
    // Split dragons.  Common case: bias towards last dragon, in
    // case 2nd charge is going towards this pair.
    marks[2] = Math.ceil((dragons[3] + dragons[4]) / 2);
    if (marks[1] == dragons[3] && marks[2] == marks[1] + 1) {
      // Tricksy edge case, e.g. N, NE, E, SE, SW.  S not safe for
      // third mark because second mark is at SE, and E dragon will
      // clip S.  Send all dragons CW even if this means eating more
      // arena space.
      marks[2] = (dragons[4] + 1) % 8;
      ret.wideThirdDive = true;
    }
  }

  var bad = badSpots(marks[0], dragons[0]);
  bad.concat(badSpots(marks[0], dragons[1]));
  ret.unsafeThirdMark = bad.indexOf(marks[2]) != -1;

  var dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  ret.marks = marks.map(function(i) { return dir_names[i]; });
  return ret;
};

// End copy and paste


// Test functions

function testModDistance() {
  for (var i = 0; i < 8; ++i) {
    for (var j = -4; j <= 4; ++j) {
      console.assert(modDistance(i, (i + j + 8) % 8) == Math.abs(j));
      console.assert(modDistance(i, (i + j + 8) % 8) == Math.abs(j));
    }
  }
}
testModDistance();

function testBadSpots() {
  var equals = function(a, b) {
    a.sort();
    b.sort();
    if (a.length != b.length)
      return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] != b[i])
        return false;
    }
    return true;
  };

  // 1 away dragons
  for (var i = 0; i < 8; ++i) {
    var before = (i - 1 + 8) % 8;
    var after = (i + 1) % 8;
    console.assert(equals([before, i, after], badSpots(i, before)));
    console.assert(equals([before, i, after], badSpots(i, after)));
  }

  // 2 away dragons
  for (var i = 0; i < 8; ++i) {
    var before2 = (i - 2 + 8) % 8;
    var before1 = (i - 1 + 8) % 8;
    var after1 = (i + 1) % 8;
    var after2 = (i + 2) % 8;
    console.assert(equals([before2, before1, i], badSpots(i, before2)));
    console.assert(equals([after2, after1, i], badSpots(i, after2)));
  }
}
testBadSpots();

function testFindDragonMarks(array, output) {
  var mark_dirs = output.marks;
  var dragons = [];
  for (var i = 0; i < 8; ++i) {
    if (array[i])
      dragons.push(i);
  }
  console.assert(dragons.length == 5);

  var dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var marks = mark_dirs.map(function(i) { return dir_names.indexOf(i); });
  console.assert(marks.length == 3);
  for (var i = 0; i < marks.length; ++i) {
    console.assert(marks[i] >= 0);
    console.assert(marks[i] < 8);
  }

  // Marks can't be in front of their dragons.
  console.assert(marks[0] != dragons[0]);
  console.assert(marks[0] != dragons[1]);
  console.assert(marks[1] != dragons[2]);
  console.assert(marks[2] != dragons[3]);
  console.assert(marks[2] != dragons[4]);

  // Marks can also be at most two away from a dragon except for one
  // tricksy edge case on dragon 3 where it can be three away.
  console.assert(modDistance(marks[0], dragons[0]) <= 2);
  console.assert(modDistance(marks[0], dragons[1]) <= 2);
  console.assert(modDistance(marks[1], dragons[2]) <= 2);
  if (output.wideThirdDive) {
    console.assert(modDistance(marks[2], dragons[3]) == 3);
  } else {
    console.assert(modDistance(marks[2], dragons[3]) <= 2);
  }
  console.assert(modDistance(marks[2], dragons[4]) <= 2);

  var bad = [
    badSpots(marks[0], dragons[0]).concat(badSpots(marks[0], dragons[1])),
    badSpots(marks[1], dragons[2]),
  ];

  // First set of dragons should not cover second mark.
  console.assert(bad[0].indexOf(marks[1]) == -1);
  // Second set of dragons should not cover third mark.
  console.assert(bad[1].indexOf(marks[2]) == -1);

  // Verify unsafe third mark.
  if (output.unsafeThirdMark) {
    console.assert(bad[0].indexOf(marks[2]) != -1);
  } else {
    console.assert(bad[0].indexOf(marks[2]) == -1);
  }
}

var total = 0;
for (var i = 0; i < 256; ++i) {
  var array = [
    i & 0x80 ? 1 : 0,
    i & 0x40 ? 1 : 0,
    i & 0x20 ? 1 : 0,
    i & 0x10 ? 1 : 0,
    i & 0x08 ? 1 : 0,
    i & 0x04 ? 1 : 0,
    i & 0x02 ? 1 : 0,
    i & 0x01 ? 1 : 0,
  ];
  var count = 0;
  for (var j = 0; j < array.length; ++j) {
    count += array[j];
  }
  if (count != 5)
    continue;

  console.log(array);
  var output = findDragonMarks(array);
  console.log(output);
  testFindDragonMarks(array, output);
  ++total;
}

// 8 choose 5 == 56
console.assert(total == 56);
