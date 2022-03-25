// TODO:
//  Angra Mainyu
//    Add Level 100 Flare
//    Add Level 150 Doom
//    Add Roulette?
//    Add info text for add spawns?
//  Five-Headed Dragon
//  Howling Atomos
//  Cerberus
//  Cloud of Darkness
Options.Triggers.push({
  zoneId: ZoneId.TheWorldOfDarkness,
  triggers: [
    {
      id: 'Angra Mainyu Gain Sullen',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '27c' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.sullenDebuff = true,
    },
    {
      id: 'Angra Mainyu Lose Sullen',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '27c' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.sullenDebuff = false,
    },
    {
      id: 'Angra Mainyu Gain Ireful',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '27d' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.irefulDebuff = true,
    },
    {
      id: 'Angra Mainyu Lose Ireful',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '27d' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.irefulDebuff = false,
    },
    {
      id: 'Angra Mainyu Double Vision',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'CC8', source: 'Angra Mainyu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'CC8', source: 'Angra Mainyu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'CC8', source: 'Angra Mainyu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'CC8', source: 'アンラ・マンユ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'CC8', source: '安哥拉·曼纽', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'CC8', source: '앙그라 마이뉴', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.sullenDebuff) {
          // Stand behind boss in the red half to switch to Ireful
          return output.red();
        } else if (data.irefulDebuff) {
          // Stand in front of boss in the white half to switch to Sullen
          return output.white();
        }
      },
      outputStrings: {
        red: {
          en: 'Get Behind (Red)',
          de: 'Geh nach Hinten (Rot)',
          fr: 'Passez derrière (Rouge)',
          cn: '去背后 (红色)',
          ko: '뒤쪽으로 (빨강)',
        },
        white: {
          en: 'Get in Front (White)',
          de: 'Geh nach Vorne (Weiß)',
          fr: 'Allez devant (Blanc)',
          cn: '去正面 (白色)',
          ko: '앞쪽으로 (흰색)',
        },
      },
    },
    {
      id: 'Angra Mainyu Mortal Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: 'Angra Mainyu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: 'Angra Mainyu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: 'Angra Mainyu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: 'アンラ・マンユ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: '安哥拉·曼纽', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: '앙그라 마이뉴', capture: false }),
      suppressSeconds: 0.1,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Angra Mainyu Gain Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'd2' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.cleanse(),
      outputStrings: {
        cleanse: {
          en: 'Run to Cleanse Circle',
          de: 'Geh in die Kreise zum reinigen',
          fr: 'Allez dans un cercle de purification',
          cn: '快踩净化圈',
          ko: '흰색 원 밟아서 선고 해제하기',
        },
      },
    },
    {
      id: 'Angra Mainyu Level 100 Flare Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '002C' }),
      condition: Conditions.targetIsNotYou(),
      response: Responses.awayFrom(),
    },
    {
      id: 'Angra Mainyu Level 150 Death Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '002D' }),
      condition: Conditions.targetIsNotYou(),
      response: Responses.awayFrom(),
    },
  ],
});
