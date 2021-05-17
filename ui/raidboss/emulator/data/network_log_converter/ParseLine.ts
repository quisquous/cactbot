import LineEvent from './LineEvent';
import { LineEvent0x00, LineEvent0x00Parts } from './LineEvent0x00';
import { LineEvent0x01, LineEvent0x01Parts } from './LineEvent0x01';
import { LineEvent0x02, LineEvent0x02Parts } from './LineEvent0x02';
import { LineEvent0x03, LineEvent0x03Parts } from './LineEvent0x03';
import { LineEvent0x04, LineEvent0x04Parts } from './LineEvent0x04';
import { LineEvent0x0C, LineEvent0x0CParts } from './LineEvent0x0C';
import { LineEvent0x14, LineEvent0x14Parts } from './LineEvent0x14';
import { LineEvent0x15, LineEvent0x15Parts } from './LineEvent0x15';
import { LineEvent0x16, LineEvent0x16Parts } from './LineEvent0x16';
import { LineEvent0x17, LineEvent0x17Parts } from './LineEvent0x17';
import { LineEvent0x18, LineEvent0x18Parts } from './LineEvent0x18';
import { LineEvent0x19, LineEvent0x19Parts } from './LineEvent0x19';
import { LineEvent0x1A, LineEvent0x1AParts } from './LineEvent0x1A';
import { LineEvent0x1B, LineEvent0x1BParts } from './LineEvent0x1B';
import { LineEvent0x1C, LineEvent0x1CParts } from './LineEvent0x1C';
import { LineEvent0x1D, LineEvent0x1DParts } from './LineEvent0x1D';
import { LineEvent0x1E, LineEvent0x1EParts } from './LineEvent0x1E';
import { LineEvent0x1F, LineEvent0x1FParts } from './LineEvent0x1F';
import { LineEvent0x22, LineEvent0x22Parts } from './LineEvent0x22';
import { LineEvent0x23, LineEvent0x23Parts } from './LineEvent0x23';
import { LineEvent0x24, LineEvent0x24Parts } from './LineEvent0x24';
import { LineEvent0x25, LineEvent0x25Parts } from './LineEvent0x25';
import { LineEvent0x26, LineEvent0x26Parts } from './LineEvent0x26';
import { LineEvent0x27, LineEvent0x27Parts } from './LineEvent0x27';
import { LogRepository } from './LogRepository';

export default class ParseLine {
  static parse(repo: LogRepository, line: string): LineEvent | false {
    let ret;

    const parts = line.split('|');
    const event = parts[0] as string;

    // Don't parse raw network packet lines
    if (event === '252')
      return false;

    // This is ugly, but Webpack prefers being explicit
    switch ('LineEvent' + event) {
    case 'LineEvent00':
      ret = new LineEvent0x00(repo, line, parts as LineEvent0x00Parts);
      break;
    case 'LineEvent01':
      ret = new LineEvent0x01(repo, line, parts as LineEvent0x01Parts);
      break;
    case 'LineEvent02':
      ret = new LineEvent0x02(repo, line, parts as LineEvent0x02Parts);
      break;
    case 'LineEvent03':
      ret = new LineEvent0x03(repo, line, parts as LineEvent0x03Parts);
      break;
    case 'LineEvent04':
      ret = new LineEvent0x04(repo, line, parts as LineEvent0x04Parts);
      break;
    case 'LineEvent12':
      ret = new LineEvent0x0C(repo, line, parts as LineEvent0x0CParts);
      break;
    case 'LineEvent20':
      ret = new LineEvent0x14(repo, line, parts as LineEvent0x14Parts);
      break;
    case 'LineEvent21':
      ret = new LineEvent0x15(repo, line, parts as LineEvent0x15Parts);
      break;
    case 'LineEvent22':
      ret = new LineEvent0x16(repo, line, parts as LineEvent0x16Parts);
      break;
    case 'LineEvent23':
      ret = new LineEvent0x17(repo, line, parts as LineEvent0x17Parts);
      break;
    case 'LineEvent24':
      ret = new LineEvent0x18(repo, line, parts as LineEvent0x18Parts);
      break;
    case 'LineEvent25':
      ret = new LineEvent0x19(repo, line, parts as LineEvent0x19Parts);
      break;
    case 'LineEvent26':
      ret = new LineEvent0x1A(repo, line, parts as LineEvent0x1AParts);
      break;
    case 'LineEvent27':
      ret = new LineEvent0x1B(repo, line, parts as LineEvent0x1BParts);
      break;
    case 'LineEvent28':
      ret = new LineEvent0x1C(repo, line, parts as LineEvent0x1CParts);
      break;
    case 'LineEvent29':
      ret = new LineEvent0x1D(repo, line, parts as LineEvent0x1DParts);
      break;
    case 'LineEvent30':
      ret = new LineEvent0x1E(repo, line, parts as LineEvent0x1EParts);
      break;
    case 'LineEvent31':
      ret = new LineEvent0x1F(repo, line, parts as LineEvent0x1FParts);
      break;
    case 'LineEvent34':
      ret = new LineEvent0x22(repo, line, parts as LineEvent0x22Parts);
      break;
    case 'LineEvent35':
      ret = new LineEvent0x23(repo, line, parts as LineEvent0x23Parts);
      break;
    case 'LineEvent36':
      ret = new LineEvent0x24(repo, line, parts as LineEvent0x24Parts);
      break;
    case 'LineEvent37':
      ret = new LineEvent0x25(repo, line, parts as LineEvent0x25Parts);
      break;
    case 'LineEvent38':
      ret = new LineEvent0x26(repo, line, parts as LineEvent0x26Parts);
      break;
    case 'LineEvent39':
      ret = new LineEvent0x27(repo, line, parts as LineEvent0x27Parts);
      break;
    default:
      ret = new LineEvent(repo, line, parts);
    }

    // Also don't parse lines with a non-sane date. This is 2000-01-01 00:00:00
    if (ret && ret.timestamp < 946684800)
      return false;

    // Finally, if the object marks itself as invalid, skip it
    if (ret && ret.invalid)
      return false;

    return ret;
  }
}
