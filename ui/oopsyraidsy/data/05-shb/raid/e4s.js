'use strict';

// TODO: could track people get hitting by markers they shouldn't
// TODO: could track non-tanks getting hit by tankbusters, megaliths
// TODO: could track non-target getting hit by tankbuster
[{
  zoneRegex: {
    en: /^Eden's Gate: Sepulture \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章4\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(4\)$/,
  },
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
      regex: Regexes.startsUsing({ id: '411E', source: 'Titan' }),
      regexDe: Regexes.startsUsing({ id: '411E', source: 'Titan' }),
      regexFr: Regexes.startsUsing({ id: '411E', source: 'Titan' }),
      regexJa: Regexes.startsUsing({ id: '411E', source: 'タイタン' }),
      regexCn: Regexes.startsUsing({ id: '411E', source: '泰坦' }),
      regexKo: Regexes.startsUsing({ id: '411E', source: '타이탄' }),
      run: function(e, data, matches) {
        data.faultLineTarget = matches.target;
      },
    },
    {
      id: 'E4S Fault Line',
      damageRegex: '411E',
      condition: function(e, data, matches) {
        return data.faultLineTarget != e.targetName;
      },
      mistake: function(e, data) {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Run Over',
            de: e.abilityName,
            fr: 'Écrasé',
            ja: e.abilityName,
            cn: e.abilityName,
            ko: e.abilityName,
          },
        };
      },
    },
  ],
}];
