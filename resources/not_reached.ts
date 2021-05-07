// Helper Error for TypeScript situations where the programmer thinks they
// know better than TypeScript that some situation will never occur.

// The intention here is that the programmer does not expect a particular
// bit of code to happen, and so has not written careful error handling.
// If it does occur, at least there will be an error and we can figure out why.
// This is preferable to casting or disabling TypeScript altogether in order to
// avoid syntax errors.

// One common example is a regex, where if the regex matches then all of the
// (non-optional) regex groups will also be valid, but TypeScript doesn't know.
export class UnreachableCode extends Error {
  constructor() {
    super('This code shouldn\'t be reached');
  }
}
