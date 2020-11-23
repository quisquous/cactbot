import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.TheBindingCoilOfBahamutTurn2,
  triggers: [
    {
      id: 'T2 High Voltage',
      netRegex: NetRegexes.startsUsing({ id: '4C0' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'T2 Ballast',
      netRegex: NetRegexes.startsUsing({ id: '4C5', capture: false }),
      suppressSeconds: 3,
      response: Responses.getBehind(),
    },
    {
      // Allagan Rot
      id: 'T2 Rot',
      netRegex: NetRegexes.gainsEffect({ effectId: '14D' }),
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.rotOnYou();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.rotOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        rotOn: {
          en: 'Rot on ${player}',
          de: 'Fäulnis auf ${player}',
          fr: 'Pourriture sur ${player}',
          ja: '自分に${player}',
          cn: '毒点 ${player}',
        },
        rotOnYou: {
          en: 'Rot on YOU',
          de: 'Fäulnis auf DIR',
          fr: 'Pourriture sur VOUS',
          ja: '自分にアラガンロット',
          cn: '毒点名',
        },
      },
    },
    {
      id: 'T2 Pass Rot',
      netRegex: NetRegexes.gainsEffect({ effectId: '14D' }),
      condition: Conditions.targetIsYou(),
      preRun: (data) => data.rot = true,
      delaySeconds: 11,
      alertText: (data, _, output) => {
        if (!data.rot)
          return;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'Pass Rot',
          de: 'Fäulnis abgeben',
          fr: 'Passez la pourriture',
          ja: 'ロットを移す',
          cn: '传毒',
        },
      },
    },
    {
      id: 'T2 Lost Rot',
      netRegex: NetRegexes.losesEffect({ effectId: '14D' }),
      condition: Conditions.targetIsYou(),
      run: (data) => delete data.rot,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Allagan Rot': 'Allagische Fäulnis',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Allagan Rot': 'Pourriture Allagoise',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Allagan Rot': 'アラガンロット',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Allagan Rot': '亚拉戈古病毒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Allagan Rot': '알라그 부패',
      },
    },
  ],
};
