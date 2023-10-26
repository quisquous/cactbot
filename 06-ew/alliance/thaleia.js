const eulogiaFormMap = {
  // first
  '8A0A': 'left',
  '8A0D': 'right',
  '8A10': 'inside',
  // second
  '8A0B': 'left',
  '8A0E': 'right',
  '8A11': 'inside',
  // third
  '8A0C': 'left',
  '8A0F': 'right',
  '8A12': 'inside',
};
Options.Triggers.push({
  id: 'Thaleia',
  zoneId: ZoneId.Thaleia,
  timelineFile: 'thaleia.txt',
  initData: () => {
    return {
      puddle: false,
      soaringMinuet: false,
      eulogiaForms: [],
    };
  },
  triggers: [
    {
      id: 'Thaleia Puddle Target',
      type: 'HeadMarker',
      netRegex: { id: '008B' },
      condition: (data, matches) => data.me === matches.target,
      alertText: (data, _matches, output) => {
        data.puddle = true;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'Puddle on YOU',
          de: 'Fläche auf DIR',
          ja: '自分にAOE',
        },
      },
    },
    {
      id: 'Thaleia Tank Buster Target',
      type: 'HeadMarker',
      netRegex: { id: ['0158', '01F4'] },
      condition: (data, matches) => data.me === matches.target,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: Outputs.tankBusterOnYou,
      },
    },
    {
      id: 'Thaleia Thaliak Katarraktes',
      type: 'StartsUsing',
      netRegex: { id: '88D1', source: 'Thaliak', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Thaliak Thlipsis',
      type: 'StartsUsing',
      netRegex: { id: '88D8', source: 'Thaliak', capture: false },
      response: Responses.getTogether(),
    },
    {
      id: 'Thaleia Thaliak Left Bank',
      type: 'StartsUsing',
      netRegex: { id: '88D2', source: 'Thaliak', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Thaleia Thaliak Right Bank',
      type: 'StartsUsing',
      netRegex: { id: '88D3', source: 'Thaliak', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Thaleia Thaliak Hydroptosis',
      type: 'StartsUsing',
      netRegex: { id: '88D4', source: 'Thaliak', capture: false },
      condition: (data) => !data.puddle,
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.puddle = false,
      outputStrings: {
        text: {
          en: 'Bait puddles',
          de: 'Flächen ködern',
          ja: 'AOE回避',
        },
      },
    },
    {
      id: 'Thaleia Thaliak Rhyton',
      type: 'StartsUsing',
      netRegex: { id: ['88D6', '88D7'], source: 'Thaliak' },
      condition: (data) => data.role === 'tank',
      response: Responses.tankBuster(),
    },
    {
      id: 'Thaleia Thaliak Rheognosis',
      type: 'StartsUsing',
      netRegex: { id: '88C4', source: 'Thaliak', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look for knockback position',
          de: 'Nach Rückstoß Position schauen',
          ja: 'ノックバック位置へ',
        },
      },
    },
    {
      id: 'Thaleia Thaliak Rheognosis Petrine',
      type: 'StartsUsing',
      netRegex: { id: '88C5', source: 'Thaliak', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback + Rolling stones',
          de: 'Rückstoß + rollende Steine',
          ja: 'ノックバック + 石AOE',
        },
      },
    },
    {
      id: 'Thaleia Thaliak Hieroglyphika',
      type: 'StartsUsing',
      netRegex: { id: '88CF', source: 'Thaliak', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to safe zone',
          de: 'Geh zum sichere Feld',
          ja: '安置へ移動',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Tempest',
      type: 'StartsUsing',
      netRegex: { id: '880B', source: 'Llymlaen', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Llymlaen Seafoam Spiral',
      type: 'StartsUsing',
      netRegex: { id: '880D', source: 'Llymlaen', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Thaleia Llymlaen Wind Rose',
      type: 'StartsUsing',
      netRegex: { id: '880C', source: 'Llymlaen', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Thaleia Llymlaen Navigator\'s Trident Knockback',
      type: 'StartsUsing',
      netRegex: { id: '8811', source: 'Llymlaen', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback',
          de: 'Rückstoß',
          ja: 'まもなくノックバック',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Surging Wave',
      type: 'StartsUsing',
      netRegex: { id: '8812', source: 'Llymlaen', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far knockback',
          de: 'Weiter Rückstoß',
          ja: '遠くノックバック',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Left Strait',
      type: 'StartsUsing',
      netRegex: { id: '8851', source: 'Llymlaen', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Thaleia Llymlaen Right Strait',
      type: 'StartsUsing',
      netRegex: { id: '8852', source: 'Llymlaen', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Thaleia Llymlaen Deep Dive',
      type: 'StartsUsing',
      netRegex: { id: ['8819', '8834'], source: 'Llymlaen', capture: false },
      response: Responses.getTogether(),
    },
    {
      id: 'Thaleia Llymlaen Torrential Tridents',
      type: 'StartsUsing',
      netRegex: { id: '881A', source: 'Llymlaen', capture: false },
      durationSeconds: 12,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Last trident => 1st trident',
          de: 'Letzer Dreizack => erster Dreizack',
          ja: '最後の槍 => 1番目の槍へ',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Godsbane',
      type: 'StartsUsing',
      netRegex: { id: '8824', source: 'Llymlaen', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Thaleia Oschon Sudden Downpour',
      type: 'StartsUsing',
      netRegex: { id: ['8999', '899A'], source: 'Oschon', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Oschon Trek Shot',
      type: 'StartsUsing',
      netRegex: { id: '898E', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to side of the arrow (Boss doesn\'t move)',
          de: 'Geh seitlich des Pfeils (Boss bewegt sich nicht)',
          ja: '矢印の横へ (ボスは動かない)',
        },
      },
    },
    {
      id: 'Thaleia Oschon Reproduce',
      type: 'StartsUsing',
      netRegex: { id: '8989', source: 'Oschon', capture: false },
      alertText: (data, _matches, output) => {
        if (!data.soaringMinuet)
          return output.one();
        return output.two();
      },
      outputStrings: {
        one: {
          en: 'Go to side of the arrow',
          de: 'Geh seitlich des Pfeils',
          ja: '矢印の横へ',
        },
        two: {
          en: 'Corner between two arrows',
          de: 'Ecke zwichen 2 Pfeilen',
          ja: '2つの矢印の隅',
        },
      },
    },
    {
      id: 'Thaleia Oschon Flinted Foehn',
      type: 'StartsUsing',
      netRegex: { id: ['89A3', '89A4'], source: 'Oschon', capture: false },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Oschon Soaring Minuet',
      type: 'StartsUsing',
      netRegex: { id: ['8D0E', '8994'], source: 'Oschon', capture: false },
      response: Responses.getBehind(),
      run: (data) => data.soaringMinuet = true,
    },
    {
      id: 'Thaleia Oschon the Arrow',
      type: 'StartsUsing',
      netRegex: { id: ['899B', '899C', '899D', '899E'], source: 'Oschon' },
      suppressSeconds: 10,
      response: Responses.tankBuster(),
    },
    {
      id: 'Thaleia Oschon Climbing Shot',
      type: 'StartsUsing',
      netRegex: { id: ['8990', '8991', '8992', '8993'], source: 'Oschon', capture: false },
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback to safe corner',
          de: 'Rückstoß in die sichere Ecke',
          ja: 'AOEがないどころへ + ノックバック',
        },
      },
    },
    {
      id: 'Thaleia Oschon Lofty Peaks',
      type: 'StartsUsing',
      netRegex: { id: '89A7', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Oschon second phase',
          de: 'Oschon zweite Phase',
          ja: 'すぐ大きくなる',
        },
      },
    },
    {
      id: 'Thaleia Oschon Altitude',
      type: 'StartsUsing',
      netRegex: { id: '89AF', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to safe zone',
          de: 'Geh in den sicheren Bereich',
          ja: '安置で待機',
        },
      },
    },
    {
      id: 'Thaleia Oschon Wandering Shot',
      type: 'StartsUsing',
      netRegex: { id: ['8CF6', '8CF7'], source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far from Orb',
          de: 'Weit weg vom Orb',
          ja: '玉からはなれて',
        },
      },
    },
    {
      id: 'Thaleia Oschon Wandering Volley',
      type: 'StartsUsing',
      netRegex: { id: ['89AC', '89AD'], source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far from Orb + Knockback',
          de: 'Weit weg vom Orb + Rückstoß',
          ja: '玉からはなれて + ノックバック',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Dawn of Time',
      type: 'StartsUsing',
      netRegex: { id: '8A03', source: 'Eulogia', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Eulogia Forms',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(eulogiaFormMap), source: 'Eulogia' },
      durationSeconds: (data) => data.eulogiaForms.length < 2 ? 4 : 19,
      infoText: (data, matches, output) => {
        const form = eulogiaFormMap[matches.id.toUpperCase()] ?? 'unknown';
        data.eulogiaForms.push(form);
        if (data.eulogiaForms.length === 3) {
          const [form1, form2, form3] = data.eulogiaForms.map((x) => output[x]());
          data.eulogiaForms = [];
          return output.text({ form1: form1, form2: form2, form3: form3 });
        }
        return output[form]();
      },
      outputStrings: {
        text: {
          en: '${form1} => ${form2} => ${form3}',
          de: '${form1} => ${form2} => ${form3}',
        },
        left: Outputs.left,
        right: Outputs.right,
        inside: Outputs.in,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'Thaleia Eulogia Sunbeam',
      type: 'StartsUsing',
      netRegex: { id: '8A00', source: 'Eulogia' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Thaleia Eulogia the Whorl',
      type: 'StartsUsing',
      netRegex: { id: '8A2F', source: 'Eulogia', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Thaleia Eulogia Love\'s Light',
      type: 'StartsUsing',
      netRegex: { id: '8A30', source: 'Eulogia', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Start from the bright moon',
          de: 'Starte vom hellen Mond',
          ja: '明るい月から',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hydrostasis',
      type: 'StartsUsing',
      netRegex: { id: '8A37', source: 'Eulogia', capture: false },
      durationSeconds: 13,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '3 => 1 => 2',
          de: '3 => 1 => 2',
          ja: '3 => 1 => 2',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hieroglyphika',
      type: 'StartsUsing',
      netRegex: { id: '8A43', source: 'Eulogia', capture: false },
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to safe zone',
          de: 'Geh in den sicheren Bereich',
          ja: '安置へ移動',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hand of the Destroyer Red',
      type: 'StartsUsing',
      netRegex: { id: '8A47', source: 'Eulogia', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Be on blue half',
          de: 'Geh zur blauen Seite',
          fr: 'Placez-vous sur la moitié bleue',
          ja: '青い安置',
          cn: '站蓝色半场',
          ko: '파란색 쪽으로',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hand of the Destroyer Blue',
      type: 'StartsUsing',
      netRegex: { id: '8A48', source: 'Eulogia', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Be on red half',
          de: 'Geh zur roten Seite',
          fr: 'Placez-vous sur la moitié rouge',
          ja: '赤い安置',
          cn: '站红色半场',
          ko: '빨간색 쪽으로',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Torrential Tridents',
      type: 'StartsUsing',
      netRegex: { id: '8A4E', source: 'Eulogia', capture: false },
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Last trident => 1st trident',
          de: 'Letzer Dreizack => erster Dreizack',
          ja: '最後の槍 => 1番目の槍へ',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Destructive Bolt',
      type: 'StartsUsing',
      netRegex: { id: '8CEC', source: 'Eulogia', capture: false },
      response: Responses.getTogether(),
    },
    {
      id: 'Thaleia Eulogia Byregot\'s Strike',
      type: 'StartsUsing',
      netRegex: { id: '8A52', source: 'Eulogia', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (with lightning)',
          de: 'Rückstoß (mit Blitzen)',
          fr: 'Poussée (avec éclair)',
          ja: 'ノックバック (雷)',
          cn: '击退 (带闪电)',
          ko: '넉백 (번개 장판)',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Thousandfold Thrust',
      type: 'HeadMarker',
      netRegex: { id: ['0182', '0183', '0184', '0185'], target: 'Eulogia' },
      alertText: (_data, matches, output) => {
        return {
          '0182': output.back(),
          '0183': output.front(),
          '0184': output.left(),
          '0185': output.right(),
        }[matches.id];
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Thaleia Eulogia As Above So Below',
      type: 'StartsUsing',
      netRegex: { id: ['8A5B', '8A5C'], source: 'Eulogia' },
      infoText: (_data, matches, output) => {
        if (matches.id === '8A5B')
          return output.red();
        return output.blue();
      },
      outputStrings: {
        red: {
          en: 'Blue is safe',
          de: 'Blau ist sicher',
          ja: '青安置',
        },
        blue: {
          en: 'Red is safe',
          de: 'Rot ist sicher',
          ja: '赤安置',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Climbing Shot',
      type: 'StartsUsing',
      netRegex: { id: '8D0B', source: 'Eulogia', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback to safe corner',
          de: 'Rückstoß in die sichere Ecke',
          ja: '安置へノックバック',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Soaring Minuet',
      type: 'StartsUsing',
      netRegex: { id: '8A69', source: 'Eulogia', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Thaleia Eulogia Eudaimon Eorzea',
      type: 'StartsUsing',
      netRegex: { id: '8A2C', source: 'Eulogia', capture: false },
      durationSeconds: 18,
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Eulogia': 'Eulogia',
        'Llymlaen(?!\')': 'Llymlaen',
        'Oschon(?!\')': 'Oschon',
        'Thaliak(?!\')': 'Thaliak',
        'The Briny Deep': 'Auge des Meeres',
        'The River Of Knowledge': 'Fluss der Weisheit',
        'The Stairway To The Seventh': 'Aufgang zum Firmament',
        'The Twelve\'s Embrace': 'Himmlische Sphäre des Segens',
        'The Way of the Wise': 'Kanal des Wissens',
        'The Windward Pass': 'Pfad des Windes',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Eulogia': 'Eulogie',
        'Llymlaen(?!\')': 'Llymlaen',
        'Oschon(?!\')': 'Oschon',
        'Thaliak(?!\')': 'Thaliak',
        'The Briny Deep': 'Œil de l\'océan',
        'The River Of Knowledge': 'Rivière du savoir',
        'The Stairway To The Seventh': 'Marches du firmament',
        'The Twelve\'s Embrace': 'Sphère céleste de la bénédiction',
        'The Way of the Wise': 'Canaux de la connaissance',
        'The Windward Pass': 'Voie des vents',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Eulogia': 'エウロギア',
        'Llymlaen(?!\')': 'リムレーン',
        'Oschon(?!\')': 'オシュオン',
        'Thaliak(?!\')': 'サリャク',
        'The Briny Deep': '大洋の虚',
        'The River Of Knowledge': '知恵の河',
        'The Stairway To The Seventh': '六天座の階',
        'The Twelve\'s Embrace': '祝福の天球',
        'The Way of the Wise': '導きの水廊',
        'The Windward Pass': '風の通り道',
      },
    },
  ],
});
