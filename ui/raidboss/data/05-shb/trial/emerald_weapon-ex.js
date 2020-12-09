import ZoneId from '../../../../../resources/zone_id.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Conditions from '../../../../../resources/conditions.js';
import { Responses } from '../../../../../resources/responses.js';

export default {
  zoneId: ZoneId.CastrumMarinumExtreme,
  triggers: [
    {
      id: 'EmeraldEx Optimized Ultima',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5B10', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'EmeraldEx Aetheroplasm Production',
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
      id: 'EmeraldEx Divide Et Impera P1',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '555B', capture: false }),
      alertText: (data, _, output) => {
        if (data.role === 'tank')
          return output.sharedTankStack();
        return output.spread();
      },
      outputStrings: {
        spread: {
          en: 'Spread',
          de: 'Verteilen',
          fr: 'Ecartez-vous',
          ja: '散開',
          cn: '分散',
          ko: '산개',
        },
        sharedTankStack: {
          en: 'Tank stack',
          cn: '坦克分摊',
        },
      },
    },
    {
      id: 'EmeraldEx Divide Et Impera P2',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5537', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Position',
          ja: '散開',
          cn: '分散站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
    {
      id: 'EmeraldEx Primus Terminus Est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55C3', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go sides, aim across',
          cn: '靠边，注意箭头朝向',
        },
      },
    },
    {
      id: 'EmeraldEx Tertius Terminus est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55CC', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '注意落剑顺序',
        },
      },
    },
    {
      id: 'EmeraldEx Sidescathe Left',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D5', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'EmeraldEx Sidescathe Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D4', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'EmeraldEx Secundus Terminus est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55C8', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          cn: '靠边放剑(十字四角)',
        },
      },
    },
    {
      id: 'EmeraldEx Legio Phantasmatis',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55B4', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Numbered Divebombs',
          cn: '注意士兵顺序，结束返回中央',
        },
      },
    },
  ],
};
