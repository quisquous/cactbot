import { UnreachableCode } from '../../resources/not_reached';

const fakePlayerNames = [
  'Tini Poutini',
  'Potato Chippy',
  'Papas Fritas',
  'Tater Tot',
  'Hash Brown',
  'French Fry',
];

const randomFromArray = <T>(array: T[]): T => {
  const value = array[Math.floor(Math.random() * array.length)];
  if (value === undefined)
    throw new UnreachableCode();
  return value;
};

export default class FakeNameGenerator {
  private fakePlayerNames = [...fakePlayerNames];
  private maxIterations = 1000;
  // playerId (decimal) -> name
  private idMap: { [name: number]: string } = {};
  // name -> playerId (decimal)
  private nameMap: { [name: string]: number } = {};

  public makeName(playerId: string | number): string {
    // Support decimal ids and hex strings.
    if (typeof playerId === 'string')
      playerId = parseInt(playerId, 16);

    const lookup = this.idMap[playerId];
    if (lookup !== undefined)
      return lookup;

    let name = this.makeNameInternal(playerId);
    // Just in case this ends up being not unique, make it unique.
    if (name in this.nameMap)
      name = this.makeUniqueMiqoteName(playerId);

    this.idMap[playerId] = name;
    this.nameMap[name] = playerId;
    return name;
  }

  private makeNameInternal(playerId: number): string {
    const preBuilt = this.fakePlayerNames.shift();
    if (preBuilt !== undefined)
      return preBuilt;

    for (let i = 0; i < this.maxIterations; ++i) {
      const name = this.makeRandomLalafellName();
      if (name in this.nameMap)
        continue;
      return name;
    }
    return this.makeUniqueMiqoteName(playerId);
  }

  private makeLalaSyl1(): string {
    // Skip v, x?
    const consonants = [
      'b',
      'ch',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'm',
      'n',
      'p',
      'q',
      'r',
      's',
      't',
      'w',
      'z',
    ];
    const vowels = ['a', 'e', 'i', 'o', 'u'];

    return randomFromArray(consonants) + randomFromArray(vowels);
  }

  private makeLalaSyl2(): string {
    return this.makeLalaSyl1() + this.makeLalaSyl1();
  }

  private makeLalaSyl1Or2(): string {
    return randomFromArray([this.makeLalaSyl1(), this.makeLalaSyl2()]);
  }

  private makeRandomLalafellName(): string {
    // https://forum.square-enix.com/ffxiv/threads/61151
    // Plainsfolk:
    // * AB CB (1-2 syllables)
    // * ABB AB (always 1 syllable)
    // Dunesfolk:
    // * AAB CCB (A, C 1 syllable; B is 2)
    // * AAB AB (always 1 syllable)

    const makeName = () =>
      randomFromArray([
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
          return a + a + b + ' ' + a + b;
        },
      ])();

    return makeName().split(' ').map((str: string) => {
      return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    }).join(' ');
  }

  private makeUniqueMiqoteName(id: number): string {
    // Turn id into a lowercase string of letters.
    const randomStr = id.toString(26).split('').map((c) => {
      // shift [0-9] to [a-j]
      if (c.match(/\d/) !== null)
        return String.fromCharCode(parseInt(c) + 'a'.charCodeAt(0));
      // shift [a-p] to [k-z]
      return String.fromCharCode(c.charCodeAt(0) + 10);
    }).join('');
    return 'X\'' + randomStr + ' Tia';
  }
}
