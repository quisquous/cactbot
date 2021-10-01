import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  redRush?: string[];
}

// Seiryu Normal
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheWreathOfSnakes,
  timelineFile: 'seiryu.txt',
  timelineTriggers: [
    {
      id: 'Seiryu Line Stack',
      regex: /Forbidden Arts/,
      beforeSeconds: 1,
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'line stack',
          de: 'Linien-Stack',
          fr: 'Packez-vous en ligne',
          ja: 'スタック',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Seiryu Fifth Element',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Seiryu', id: '37FE', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Seiryu Serpent-Eye Sigil',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Seiryu', id: '3A08', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Seiryu Onmyo Sigil',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Seiryu', id: '3A07', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Seiryu Infirm Soul',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Seiryu', id: '37FD' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Seiryu Serpent Ascending Towers',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Seiryu', id: '3C25', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Seiryu Serpent Descending',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Seiryu Blue Bolt',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Ao-No-Shiki', id: '0011' }),
      delaySeconds: 0.5,
      infoText: (data, matches, output) => {
        if (data.redRush?.includes(data.me))
          return;
        if (matches.target === data.me)
          return output.stackOnYou!();
        return output.stackOnPlayer!({ player: data.ShortName(matches.target) });
      },
      run: (data) => delete data.redRush,
      outputStrings: {
        stackOnPlayer: Outputs.stackOnPlayer,
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'Seiryu Red Rush',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Aka-No-Shiki', id: '0011' }),
      alertText: (data, matches, output) => {
        // If targeted by two, skip.
        if (data.redRush?.includes(data.me))
          return;
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => (data.redRush ??= []).push(matches.target),
      outputStrings: {
        text: {
          en: 'Point Knockback Tether Outside',
        },
      },
    },
    {
      id: 'Seiryu Kanabo',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Iwa-No-Shiki', id: '0011' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Point Cleave Tether Outside',
        },
      },
    },
    {
      id: 'Seiryu Handprint East',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Yama-No-Shiki', id: '37E5', capture: false }),
      response: Responses.goEast(),
    },
    {
      id: 'Seiryu Handprint West',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Yama-No-Shiki', id: '37E6', capture: false }),
      response: Responses.goWest(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Onmyo Sigil / Serpent-Eye Sigil': 'Onmyo / Serpent-Eye Sigil',
        'Serpent-Eye Sigil / Onmyo Sigil': 'Serpent-Eye / Onmyo Sigil',
      },
    },
  ],
};

export default triggerSet;
