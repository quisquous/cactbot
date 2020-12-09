import LineEvent from './LineEvent.js';
import { LineEvent00 } from './LineEvent0x00.js';
import { LineEvent01 } from './LineEvent0x01.js';
import { LineEvent02 } from './LineEvent0x02.js';
import { LineEvent03 } from './LineEvent0x03.js';
import { LineEvent04 } from './LineEvent0x04.js';
import { LineEvent12 } from './LineEvent0x0C.js';
import { LineEvent20 } from './LineEvent0x14.js';
import { LineEvent21 } from './LineEvent0x15.js';
import { LineEvent22 } from './LineEvent0x16.js';
import { LineEvent23 } from './LineEvent0x17.js';
import { LineEvent24 } from './LineEvent0x18.js';
import { LineEvent25 } from './LineEvent0x19.js';
import { LineEvent26 } from './LineEvent0x1A.js';
import { LineEvent27 } from './LineEvent0x1B.js';
import { LineEvent28 } from './LineEvent0x1C.js';
import { LineEvent29 } from './LineEvent0x1D.js';
import { LineEvent30 } from './LineEvent0x1E.js';
import { LineEvent31 } from './LineEvent0x1F.js';
import { LineEvent34 } from './LineEvent0x22.js';
import { LineEvent35 } from './LineEvent0x23.js';
import { LineEvent36 } from './LineEvent0x24.js';
import { LineEvent37 } from './LineEvent0x25.js';
import { LineEvent38 } from './LineEvent0x26.js';
import { LineEvent39 } from './LineEvent0x27.js';

export default class ParseLine {
  static parse(repo, line) {
    let ret;

    const parts = line.split('|');
    const event = parts[0];

    // Don't parse raw network packet lines
    if (event === '252')
      return false;

    // This is ugly, but Webpack prefers being explicit
    switch ('LineEvent' + event) {
    case 'LineEvent00':
      ret = new LineEvent00(repo, line, parts);
      break;
    case 'LineEvent01':
      ret = new LineEvent01(repo, line, parts);
      break;
    case 'LineEvent02':
      ret = new LineEvent02(repo, line, parts);
      break;
    case 'LineEvent03':
      ret = new LineEvent03(repo, line, parts);
      break;
    case 'LineEvent04':
      ret = new LineEvent04(repo, line, parts);
      break;
    case 'LineEvent12':
      ret = new LineEvent12(repo, line, parts);
      break;
    case 'LineEvent20':
      ret = new LineEvent20(repo, line, parts);
      break;
    case 'LineEvent21':
      ret = new LineEvent21(repo, line, parts);
      break;
    case 'LineEvent22':
      ret = new LineEvent22(repo, line, parts);
      break;
    case 'LineEvent23':
      ret = new LineEvent23(repo, line, parts);
      break;
    case 'LineEvent24':
      ret = new LineEvent24(repo, line, parts);
      break;
    case 'LineEvent25':
      ret = new LineEvent25(repo, line, parts);
      break;
    case 'LineEvent26':
      ret = new LineEvent26(repo, line, parts);
      break;
    case 'LineEvent27':
      ret = new LineEvent27(repo, line, parts);
      break;
    case 'LineEvent28':
      ret = new LineEvent28(repo, line, parts);
      break;
    case 'LineEvent29':
      ret = new LineEvent29(repo, line, parts);
      break;
    case 'LineEvent30':
      ret = new LineEvent30(repo, line, parts);
      break;
    case 'LineEvent31':
      ret = new LineEvent31(repo, line, parts);
      break;
    case 'LineEvent34':
      ret = new LineEvent34(repo, line, parts);
      break;
    case 'LineEvent35':
      ret = new LineEvent35(repo, line, parts);
      break;
    case 'LineEvent36':
      ret = new LineEvent36(repo, line, parts);
      break;
    case 'LineEvent37':
      ret = new LineEvent37(repo, line, parts);
      break;
    case 'LineEvent38':
      ret = new LineEvent38(repo, line, parts);
      break;
    case 'LineEvent39':
      ret = new LineEvent39(repo, line, parts);
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
