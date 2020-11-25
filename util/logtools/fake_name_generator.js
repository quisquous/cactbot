const fakePlayerNames = [
  'Tini Poutini',
  'Potato Chippy',
  'Papas Fritas',
  'Tater Tot',
  'Hash Brown',
  'French Fry',
];

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default class FakeNameGenerator {
  constructor() {
    this.fakePlayerNames = [...fakePlayerNames];
    // playerId -> name
    this.idMap = {};
    this.nameMap = {};

    this.maxIterations = 1000;
  }

  makeName(playerId) {
    // Support decimal ids and hex strings.
    if (typeof playerId === 'string')
      playerId = parseInt(playerId, 16);

    if (playerId in this.idMap)
      return this.idMap[playerId];

    let name = this.makeNameInternal(playerId);
    // Just in case this ends up being not unique, make it unique.
    if (name in this.nameMap)
      name = makeUniqueMiqoteName(playerId);

    this.idMap[playerId] = name;
    this.nameMap[name] = playerId;
    return name;
  }

  makeNameInternal(playerId) {
    if (this.fakePlayerNames.length > 0)
      return this.fakePlayerNames.shift();

    for (let i = 0; i < this.maxIterations; ++i) {
      const name = this.makeRandomLalafellName();
      if (name in this.nameMap)
        continue;
      return name;
    }
    return this.makeUniqueMiqoteName(playerId);
  }

  makeLalaSyl1() {
    // Skip v, x?
    const consonants = [
      'b', 'ch', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'w', 'z',
    ];
    const vowels = ['a', 'e', 'i', 'o', 'u'];

    return randomFromArray(consonants) + randomFromArray(vowels);
  }

  makeLalaSyl2() {
    return this.makeLalaSyl1() + this.makeLalaSyl1();
  }

  makeLalaSyl1Or2() {
    return randomFromArray([this.makeLalaSyl1(), this.makeLalaSyl2()]);
  }

  makeRandomLalafellName() {
    // https://forum.square-enix.com/ffxiv/threads/61151
    // Plainsfolk:
    // * AB CB (1-2 syllables)
    // * ABB AB (always 1 syllable)
    // Dunesfolk:
    // * AAB CCB (A, C 1 syllable; B is 2)
    // * AAB AB (always 1 syllable)

    const makeName = () => randomFromArray([
      () => {
        const a = this.makeLalaSyl1Or2();
        const b = this.makeLalaSyl1Or2();
        const c = this.makeLalaSyl1Or2();
        return a + b + ' ' + c + b;
      },
      () => {
        const a = this.makeLalaSyl1();
        const b = this.makeLalaSyl1();
        return a + b + b + ' ' + a + b;
      },
      () => {
        const a = this.makeLalaSyl1();
        const b = this.makeLalaSyl2();
        const c = this.makeLalaSyl1();
        return a + a + b + ' ' + c + c + b;
      },
      () => {
        const a = this.makeLalaSyl1();
        const b = this.makeLalaSyl1();
        const c = this.makeLalaSyl1();
        return a + a + b + ' ' + a + b;
      },
    ])();

    return makeName().split(' ').map((str) => {
      return str[0].toUpperCase() + str.slice(1);
    }).join(' ');
  }

  makeUniqueMiqoteName(id) {
    // Turn id into a lowercase string of letters.
    const randomStr = id.toString(26).split('').map((c) => {
      // shift [0-9] to [a-j]
      if (c.match(/\d/) !== null)
        return String.fromCharCode(parseInt(c) + 'a'.charCodeAt());
      // shift [a-p] to [k-z]
      return String.fromCharCode(c.charCodeAt() + 10);
    }).join('');
    return 'X\'' + randomStr + ' Tia';
  }
}
