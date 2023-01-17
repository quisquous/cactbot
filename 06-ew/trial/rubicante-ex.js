const bloomingWeltFlare = 'D9B';
const furiousWeltStack = 'D9C';
const stingingWeltSpread = 'D9D';
// First headmarker is tankbuster on MT
const firstHeadmarker = parseInt('0156', 16);
const getHeadmarkerId = (data, matches) => {
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  zoneId: ZoneId.MountOrdealsExtreme,
  timelineFile: 'rubicante-ex.txt',
  initData: () => {
    return {
      dualfireTargets: [],
      flamespireClawCounter: 0,
    };
  },
  triggers: [
    {
      id: 'RubicanteEx Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'RubicanteEx Inferno Raidwide',
      type: 'StartsUsing',
      netRegex: { id: '7D2C', source: 'Rubicante', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'RubicanteEx Inferno Spread',
      type: 'StartsUsing',
      netRegex: { id: '7D0F', source: 'Rubicante', capture: false },
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Shattering Heat',
      type: 'StartsUsing',
      netRegex: { id: '7D2D', source: 'Rubicante' },
      response: Responses.tankBuster(),
    },
    {
      id: 'RubicanteEx Spike of Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D02', source: 'Rubicante' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Fourfold Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D03', source: 'Rubicante', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.group(),
      outputStrings: {
        group: Outputs.healerGroups,
      },
    },
    {
      id: 'RubicanteEx Twinfold Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D04', source: 'Rubicante', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.stack(),
      outputStrings: {
        stack: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          fr: 'Package avec votre partenaire',
          ja: '2人頭割り',
          cn: '2人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'RubicanteEx Radial Flagration',
      type: 'StartsUsing',
      netRegex: { id: '7CFE', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.spread(),
      outputStrings: {
        spread: {
          en: 'Protean',
          de: 'Himmelsrichtung',
          fr: 'Positions',
          ja: '基本散会',
          cn: '分散引导',
          ko: '기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Flamesent Ghastly Wind Tether',
      type: 'Tether',
      netRegex: { id: '00C0' },
      condition: (data, matches) => matches.target === data.me,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Face tether out',
          de: 'Verbindung nach draußen richten',
          fr: 'Lien vers l\'extérieur',
          ja: '線を外へ向ける',
          cn: '离开人群背对连线',
          ko: '본진 바깥으로 유도하기',
        },
      },
    },
    {
      id: 'RubicanteEx Flamesent Shattering Heat Tether',
      type: 'Tether',
      netRegex: { id: '0054', capture: false },
      suppressSeconds: 15,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank Tethers',
        },
      },
    },
    {
      id: 'RubicanteEx Blazing Rapture',
      type: 'StartsUsing',
      netRegex: { id: '7D07', source: 'Rubicante', capture: false },
      // This is a 14 second cast.
      delaySeconds: 4,
      response: Responses.bigAoe(),
    },
    {
      id: 'RubicanteEx Flamespire Brand Debuff Collect',
      type: 'GainsEffect',
      netRegex: { effectId: [bloomingWeltFlare, furiousWeltStack] },
      run: (data, matches) => {
        if (matches.effectId === furiousWeltStack)
          data.flamespireBrandStack = matches.target;
        if (matches.effectId === bloomingWeltFlare && data.me === matches.target)
          data.flamespireBrandHasFlare = true;
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Debuff Call',
      type: 'GainsEffect',
      netRegex: { effectId: [bloomingWeltFlare, furiousWeltStack], capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 2,
      infoText: (data, _matches, output) => {
        // TODO: this could call "support out / dps in" kinda thing.
        if (data.flamespireBrandHasFlare)
          return output.outFlareThenSpread();
        return output.inStackThenSpread();
      },
      outputStrings: {
        outFlareThenSpread: {
          en: 'Out+Flare => Spread',
        },
        inStackThenSpread: {
          en: 'In+Stack => Spread',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Blooming Welt',
      type: 'GainsEffect',
      netRegex: { effectId: bloomingWeltFlare },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      alertText: (_data, _matches, output) => output.out(),
      outputStrings: {
        out: Outputs.out,
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Furious Welt',
      type: 'GainsEffect',
      netRegex: { effectId: furiousWeltStack },
      condition: (data) => !data.flamespireBrandHasFlare,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      alertText: (data, _matches, output) => {
        if (data.flamespireBrandStack === data.me)
          return output.stackOnYou();
        return output.stackOnPlayer({ player: data.ShortName(data.flamespireBrandStack) });
      },
      outputStrings: {
        stackOnPlayer: Outputs.stackOnPlayer,
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Stinging Welt',
      type: 'GainsEffect',
      netRegex: { effectId: stingingWeltSpread },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Scalding Signal',
      type: 'StartsUsing',
      netRegex: { id: '7D24', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.outAndProtean(),
      outputStrings: {
        outAndProtean: {
          en: 'Out + Protean',
          de: 'Raus + Himmelsrichtung',
          fr: 'Extérieur + Positions',
          ja: '外側 + 基本散会',
          cn: '外侧 + 分散引导',
          ko: '밖으로 + 기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Scalding Ring',
      type: 'StartsUsing',
      netRegex: { id: '7D25', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.inAndProtean(),
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean',
          de: 'Rein + Himmelsrichtung',
          fr: 'Intérieur + Positions',
          ja: '内側 + 基本散会',
          cn: '内侧 + 分散引导',
          ko: '안으로 + 기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Sweeping Immolation Spread',
      type: 'StartsUsing',
      netRegex: { id: '7D20', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.spreadBehind(),
      outputStrings: {
        spreadBehind: {
          en: 'Spread behind Boss',
          ja: 'ボスの後ろで散会',
        },
      },
    },
    {
      id: 'RubicanteEx Sweeping Immolation Stack',
      type: 'StartsUsing',
      netRegex: { id: '7D21', source: 'Rubicante', capture: false },
      infoText: (_data, _matches, output) => output.stackBehind(),
      outputStrings: {
        stackBehind: {
          en: 'Stack behind Boss',
          ja: 'ボスの後ろで頭割り',
        },
      },
    },
    {
      id: 'RubicanteEx Dualfire Target',
      // These headmarkers come out just before the 72DE self-targeted cast.
      type: 'HeadMarker',
      netRegex: {},
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id !== '00E6')
          return;
        data.dualfireTargets.push(matches.target);
        if (data.me === matches.target)
          return output.tankCleaveOnYou();
      },
      outputStrings: {
        tankCleaveOnYou: Outputs.tankCleaveOnYou,
      },
    },
    {
      id: 'RubicanteEx Dualfire Not You',
      type: 'StartsUsing',
      netRegex: { id: '7D2E', source: 'Rubicante', capture: false },
      infoText: (data, _matches, output) => {
        if (data.dualfireTargets.includes(data.me))
          return;
        if (data.role === 'healer')
          return output.tankBusterCleaves();
        return output.avoidTankCleaves();
      },
      run: (data) => data.dualfireTargets = [],
      outputStrings: {
        tankBusterCleaves: {
          en: 'Tank Buster Cleaves',
        },
        avoidTankCleaves: {
          en: 'Avoid Tank Cleaves',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Claw Numbers',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        return data.me === matches.target &&
          (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      preRun: (data, matches) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        const clawNumberMap = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        };
        data.flamespireClawNumber = clawNumberMap[correctedMatch];
        const clawDelayMap = {
          '004F': 8.3,
          '0050': 10.3,
          '0051': 12.3,
          '0052': 14.3,
          '0053': 16.3,
          '0054': 18.3,
          '0055': 20.3,
          '0056': 22.3,
        };
        data.flamespireClawDelay = clawDelayMap[correctedMatch];
        data.flamespireClawCounter = 0;
      },
      durationSeconds: (data) => {
        return data.flamespireClawDelay;
      },
      alertText: (data, _matches, output) => {
        // A common strategy is to have 7 and 8 grab the first tether
        // and everybody pick up a tether after being hit.
        if (data.flamespireClawNumber !== undefined && data.flamespireClawNumber <= 6)
          return output.num({ num: data.flamespireClawNumber });
        return output.numGetTether({ num: data.flamespireClawNumber });
      },
      outputStrings: {
        num: {
          en: '#${num}',
          de: '#${num}',
          fr: '#${num}',
          ja: '自分: ${num}番',
          cn: '#${num}',
          ko: '${num}번째',
        },
        numGetTether: {
          en: '#${num} (Get Tether)',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Claw Counter',
      type: 'Ability',
      netRegex: { id: '7D29', source: 'Rubicante', targetIndex: '0', capture: false },
      preRun: (data, _matches) => data.flamespireClawCounter++,
      durationSeconds: 1,
      sound: '',
      infoText: (data, _matches, output) => output.text({ num: data.flamespireClawCounter }),
      tts: null,
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}番',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Claw Hit You',
      type: 'Ability',
      netRegex: { id: '7E73', source: 'Rubicante' },
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        if (data.flamespireClawCounter >= 7)
          return false;
        return data.flamespireClawCounter === data.flamespireClawNumber;
      },
      infoText: (_data, _matches, output) => output.getTether(),
      outputStrings: {
        getTether: {
          en: 'Get Tether',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Cardinals',
      type: 'MapEffect',
      netRegex: { location: '04', capture: true },
      suppressSeconds: 15,
      infoText: (_data, matches, output) => {
        const intercardFlags = [
          '02000200',
          '00200020',
          '00020002',
          '00800080',
        ];
        if (intercardFlags.includes(matches.flags))
          return output.intercards();
        return output.cardinals();
      },
      outputStrings: {
        cardinals: {
          en: 'Cardinals',
        },
        intercards: {
          en: 'Intercards',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Spike of Flame/Fourfold Flame/Twinfold Flame': 'Spike/Twin/Four',
        'Scalding Ring/Scalding Signal': 'Scalding Ring/Signal',
        'Partial Immolation/Total Immolation': 'Partial/Total Immolation',
      },
    },
  ],
});
