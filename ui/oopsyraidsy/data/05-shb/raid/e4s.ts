import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export interface Data extends OopsyData {
  faultLineTarget?: string;
}

// TODO: could track people get hitting by markers they shouldn't
// TODO: could track non-tanks getting hit by tankbusters, megaliths
// TODO: could track non-target getting hit by tankbuster

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.EdensGateSepultureSavage,
  damageWarn: {
    'E4S Weight of the Land': '4108',
    'E4S Evil Earth': '410C',
    'E4S Aftershock 1': '41B5',
    'E4S Aftershock 2': '410D',
    'E4S Explosion': '410A',
    'E4S Landslide': '411B',
    'E4S Rightward Landslide': '411D',
    'E4S Leftward Landslide': '411C',
    'E4S Massive Landslide 1': '4118',
    'E4S Massive Landslide 2': '4119',
    'E4S Seismic Wave': '4110',
  },
  damageFail: {
    'E4S Dual Earthen Fists 1': '4135',
    'E4S Dual Earthen Fists 2': '4687',
    'E4S Plate Fracture': '43EA',
    'E4S Earthen Fist 1': '43CA',
    'E4S Earthen Fist 2': '43C9',
  },
  triggers: [
    {
      id: 'E4S Fault Line Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '411E', source: 'Titan' }),
      netRegexDe: NetRegexes.startsUsing({ id: '411E', source: 'Titan' }),
      netRegexFr: NetRegexes.startsUsing({ id: '411E', source: 'Titan' }),
      netRegexJa: NetRegexes.startsUsing({ id: '411E', source: 'タイタン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '411E', source: '泰坦' }),
      netRegexKo: NetRegexes.startsUsing({ id: '411E', source: '타이탄' }),
      run: (data, matches) => {
        data.faultLineTarget = matches.target;
      },
    },
    {
      id: 'E4S Fault Line',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '411E', ...playerDamageFields }),
      condition: (data, matches) => data.faultLineTarget !== matches.target,
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: 'Run Over',
            de: 'Wurde überfahren',
            fr: 'A été écrasé(e)',
            ja: matches.ability, // FIXME
            cn: matches.ability, // FIXME
            ko: matches.ability, // FIXME
          },
        };
      },
    },
  ],
};

export default triggerSet;
