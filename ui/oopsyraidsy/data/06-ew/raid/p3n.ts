import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Note: ignoring Brightened Fire (6EDC) that hit the Darkened Fire,
// since often everybody gets hit by 0-1.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheThirdCircle,
  damageWarn: {
    'P3N Fireplume Out': '6697', // get out Experimental Fireplume short telegraph
    'P3N Fireplume Circles': '6699', // optical sight Experimental Fireplume circles
    'P3N Left Cinderwing': '66B5', // left 180 cleave
    'P3N Right Cinderwing': '66B4', // right 180 cleave
    'P3N Trail of Condemnation': '66AF', // arena charge
    'P3N Sunbird Fore Carve': '66A7', // front 180 add cleave
    'P3N Sunbird Rear Carve': '66A*', // back 180 add cleave
    'P3N Sparkfledged Ashen Eye': '66AB', // 4x cardinal conal cleaves
    'P3N Sparkfledged Devouring Brand 1': '669F', // fire cross
    'P3N Sparkfledged Devouring Brand 2': '66A0', // fire cross
    'P3N Sparkfledged Devouring Brand 3': '66A1', // fire cross
    'P3N Sparkfledged Devouring Brand 4': '6D82', // fire cross
    'P3N Searing Breeze': '66B7', // circles during Devouring Brand fire cross
  },
  damageFail: {
    'P3N Darkened Blaze': '6EDB', // not killing Darkened Fire
  },
  shareWarn: {
    'P3N Charplume': '669D', // Experimental Fireplume spread markers
    'P3N Flare of Condemnation': '66B0', // spread markers after Ashen Eye
  },
  shareFail: {
    'P3N Heat of Condemnation': '66B3', // 2x tankbuster cleaves
  },
  triggers: [
    {
      id: 'P3N Bird Tether',
      type: 'Ability',
      // If the birds hit each other with Joint Pyre, it's a mistake.
      netRegex: NetRegexes.ability({ id: '66A5', source: 'Sparkfledged', target: 'Sparkfledged' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: 'Sparkfledged tethered',
            de: 'Saat des Phoinix verbunden',
            fr: 'Oiselet de feu lié',
            cn: '火灵鸟连线',
            ko: '화령조 선 연결됨',
          },
        };
      },
    },
  ],
};

export default triggerSet;
