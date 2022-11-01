class StringFuncs {
  static zeroPad(str: string, len = 2): string {
    return ('' + str).padStart(len, '0');
  }

  static toProperCase(str: string): string {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  }

  static leftExtendStr(str?: string, length?: number, padChar = ' '): string {
    if (str === undefined)
      return '';
    if (length === undefined)
      return str;
    return str.padStart(length, padChar);
  }

  static rightExtendStr(str?: string, length?: number, padChar = ' '): string {
    if (str === undefined)
      return '';
    if (length === undefined)
      return str;
    return str.padEnd(length, padChar);
  }
}

export default StringFuncs;
