import StringFuncs from './stringhandlers';

// For performance reasons to prevent re-calculating this every single line,
// store already calculated values
const tzOffsetMap: { [key: string]: number } = {};

export default class DateTimeFuncs {
  static getTimezoneOffsetMillis(timeString: string): number {
    const timezoneOffsetString = timeString.substr(-6);
    const mappedValue = tzOffsetMap[timezoneOffsetString];
    if (mappedValue)
      return mappedValue;
    const defaultOffset = new Date().getTimezoneOffset() * 1000;
    if (timezoneOffsetString === undefined)
      return defaultOffset;
    const operator = timezoneOffsetString.substr(0, 1);
    if (operator !== '+' && operator !== '-')
      return defaultOffset;
    const timezoneOffsetParts = timezoneOffsetString.substr(1).split(':');
    const hoursString = timezoneOffsetParts[0];
    const minutesString = timezoneOffsetParts[1];
    if (hoursString === undefined || minutesString === undefined)
      return defaultOffset;
    const hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);
    const tzOffset = (((hours * 60) + minutes) * 60 * 1000) * (operator === '-' ? -1 : 1);
    tzOffsetMap[timezoneOffsetString] = tzOffset;
    return tzOffset;
  }

  static timeToString(time: number, includeMillis = true): string {
    const negative = time < 0 ? '-' : '';
    time = Math.abs(time);
    const millisNum = time % 1000;
    const secsNum = ((time % (60 * 1000)) - millisNum) / 1000;
    // Milliseconds
    const millis = `00${millisNum}`.substr(-3);
    const secs = `0${secsNum}`.substr(-2);
    const mins = `0${((((time % (60 * 60 * 1000)) - millisNum) / 1000) - secsNum) / 60}`.substr(-2);
    return negative + mins + ':' + secs + (includeMillis ? '.' + millis : '');
  }

  static timeToTimeString(time: number, tzOffsetMillis: number, includeMillis = false): string {
    return this.dateObjectToTimeString(new Date(time), tzOffsetMillis, includeMillis);
  }

  static timeStringToDateString(time: number, tzOffsetMillis: number): string {
    return this.dateObjectToDateString(new Date(time), tzOffsetMillis);
  }

  static dateObjectToDateString(date: Date, tzOffsetMillis: number): string {
    const convDate = new Date(date.getTime() + tzOffsetMillis);
    const year = convDate.getUTCFullYear();
    const month = StringFuncs.leftExtendStr((convDate.getUTCMonth() + 1).toString(), 2, '0');
    const day = StringFuncs.leftExtendStr(convDate.getUTCDate().toString(), 2, '0');
    return `${year}-${month}-${day}`;
  }

  static dateObjectToTimeString(date: Date, tzOffsetMillis: number, includeMillis = true): string {
    const convDate = new Date(date.getTime() + tzOffsetMillis);
    const hour = StringFuncs.leftExtendStr(convDate.getUTCHours().toString(), 2, '0');
    const minute = StringFuncs.leftExtendStr(convDate.getUTCMinutes().toString(), 2, '0');
    const second = StringFuncs.leftExtendStr(convDate.getUTCSeconds().toString(), 2, '0');
    let ret = `${hour}:${minute}:${second}`;
    if (includeMillis)
      ret = ret + `.${StringFuncs.leftExtendStr(convDate.getUTCMilliseconds().toString(), 3, '0')}`;

    return ret;
  }

  static msToDuration(ms: number): string {
    const tmp = DateTimeFuncs.timeToString(ms, false);
    return tmp.replace(':', 'm') + 's';
  }

  static dateTimeToString(time: number, tzOffsetMillis: number, includeMillis = false): string {
    const date = new Date(time);
    const dateString = this.dateObjectToDateString(date, tzOffsetMillis);
    const timeString = this.dateObjectToTimeString(date, tzOffsetMillis, includeMillis);
    return dateString + ' ' + timeString;
  }
}
