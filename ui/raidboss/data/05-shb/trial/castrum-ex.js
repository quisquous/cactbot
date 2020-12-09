import ZoneId from '../../../../../resources/zone_id.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Conditions from '../../../../../resources/conditions.js';
import { Responses } from '../../../../../resources/responses.js';

export default {
  zoneId: ZoneId.CastrumMarinumExtreme,
  triggers: [
    {
      id: 'CastrumEx Optimized Ultima',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5B10', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'CastrumEx Aetheroplasm Production',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55AA', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get orbs',
          cn: '撞球',
        },
      },
    },
    {
      id: 'CastrumEx Divide Et Impera P1',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '555B', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.spread(),
    },
    {
      id: 'CastrumEx Divide Et Impera P2',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5537', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '八方位',
        },
      },
    },
    {
      id: 'CastrumEx Primus Terminus Est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55C3', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '靠边',
        },
      },
    },
    {
      id: 'CastrumEx Tertius Terminus est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55CC', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '注意落剑顺序',
        },
      },
    },
    {
      id: 'CastrumEx Sidescathe Left',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D5', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '左(看翅膀)',
        },
      },
    },
    {
      id: 'Full-Power Optimized Ultima',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5B17', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '凉凉',
        },
      },
    },
    {
      id: 'CastrumEx Sidescathe Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D4', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '右（看翅膀）',
        },
      },
    },
    {
      id: 'CastrumEx Secundus Terminus est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55C8', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '靠边放剑(十字四角)',
        },
      },
    },
    {
      id: 'CastrumEx Legio Phantasmatis',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55B4', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '注意士兵顺序，结束返回中央',
        },
      },
    },
    {
      id: 'CastrumEx Magitek Magnetism',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '555B', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '注意地雷正负极(正正扩散，正负融合)',
        },
      },
    },
  ],
};
