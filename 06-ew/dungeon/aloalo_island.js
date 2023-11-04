const ArcaneBlightMap = {
  '886F': 'right',
  '8870': 'left',
  '8871': 'back',
  '8872': 'front',
};
Options.Triggers.push({
  id: 'AloaloIsland',
  zoneId: ZoneId.AloaloIsland,
  timelineFile: 'aloalo_island.txt',
  initData: () => {
    return {
      quaArmamentsCount: 0,
      reloadCount: 0,
      reloadFailed: [],
    };
  },
  triggers: [
    // ----------------------------------------- Quaqua
    {
      id: 'Aloalo Quaqua Made Magic',
      type: 'StartsUsing',
      netRegex: { id: '8B94', source: 'Quaqua', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments',
      type: 'StartsUsing',
      netRegex: { id: '8B88', source: 'Quaqua', capture: false },
      infoText: (data, _matches, output) => {
        data.quaArmamentsCount++;
        if (data.quaArmamentsCount === 1)
          return output.first();
        if (data.quaArmamentsCount === 2)
          return output.second();
        if (data.quaArmamentsCount === 3)
          return output.third();
        return output.text();
      },
      outputStrings: {
        first: {
          en: 'Outside of between Orbs',
          de: 'Außen zwichen den Orbs',
          ja: 'ハンマー、玉の間の外側へ',
        },
        second: {
          en: 'Under Orbs',
          de: 'Unter einen Orbs',
          ja: 'ドーナツ、玉の下へ',
        },
        third: {
          en: 'Under Donut Orbs',
          de: 'Unter Donut Orbs',
          ja: 'ドーナツ玉の下へ',
        },
        text: {
          en: 'Under Donut Far From Axe',
          de: 'Unter Donut und weit weg von der Axt',
          ja: '玉に気を付けて',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Action',
      type: 'Ability',
      netRegex: { id: '8B88', source: 'Quaqua', capture: false },
      delaySeconds: 2,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to safe NOW!',
          de: 'Geh zum sicheren Bereich JETZT!',
          ja: '安置へ移動',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Knockback',
      type: 'StartsUsing',
      netRegex: { id: '8B8C', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '3x Knockback',
          de: '3x Rückstoß',
          ja: '3x ノックバック',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Rout',
      type: 'StartsUsing',
      netRegex: { id: '8B90', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '4x Charge',
          de: '4x Ansturm',
          ja: '4x 突進',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Trident',
      type: 'StartsUsing',
      netRegex: { id: '8B9F', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Outside between tridents',
          de: 'Außen zwichen den Dreizack',
          ja: '槍の間の外側へ',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Violet Storm',
      type: 'StartsUsing',
      netRegex: { id: '8B95', source: 'Quaqua', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aloalo Quaqua Howl',
      type: 'StartsUsing',
      netRegex: { id: '8B96', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Adds',
          de: 'Adds',
          ja: 'ざこギミック',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Intervention',
      type: 'StartsUsing',
      netRegex: { id: '8BAE', source: 'Quaqua', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look Away from Rings',
          de: 'Schau von den Ringen weg',
          fr: 'Ne regardez pas l\'anneau',
          ja: '輪から視線回避',
          cn: '视线避开圆环',
          ko: '고리 모양 눈 시선 피하기',
        },
      },
    },
    // ----------------------------------------- Ketuduke
    {
      id: 'Aloalo Ketuduke Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '8AA5', source: 'Ketuduke', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo Ketuduke Encroaching Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8A9F', source: 'Ketuduke', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'Aloalo Ketuduke Receding Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8A9D', source: 'Ketuduke', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Aloalo Ketuduke Roar',
      type: 'StartsUsing',
      netRegex: { id: '8A92', source: 'Ketuduke', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Adds',
          de: 'Adds',
          ja: 'ざこギミック',
        },
      },
    },
    {
      id: 'Aloalo Ketuduke Fluke Typhoon',
      type: 'StartsUsing',
      netRegex: { id: '8A84', source: 'Ketuduke', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bubbles 2 tiles knockback',
          de: 'Blasen 2 Flächen Rückstoß',
          ja: '泡のみ2マスのノックバック',
        },
      },
    },
    {
      id: 'Aloalo Ketuduke Updraft',
      type: 'StartsUsing',
      netRegex: { id: '8D0F', source: 'Ketuduke', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bubbles float',
          de: 'Blasen schweben',
          ja: '泡のみ浮上',
        },
      },
    },
    {
      id: 'Aloalo Ketuduke Hydrobomb',
      type: 'StartsUsing',
      netRegex: { id: '8D0F', source: 'Ketuduke', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bubbles 2 tiles knockback + Puddles',
          de: 'Blasen 2 Flächen Rückstoß + Flächen',
          ja: '泡のみ2マスのノックバック + ゆか',
        },
      },
    },
    {
      id: 'Aloalo Ketuduke Hydrobomb Chasing',
      type: 'Ability',
      netRegex: { id: '8D0F', source: 'Ketuduke', capture: false },
      delaySeconds: 1.5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Chasing AOEs',
          de: 'Weiche den verfolgenden AoEs aus',
          fr: 'Évitez les AoEs',
          ja: 'ついてくるAOE回避',
          cn: '躲避追踪AOE',
          ko: '따라오는 장판 피하기',
        },
      },
    },
    {
      id: 'Aloalo Ketuduke Hydroblast',
      type: 'StartsUsing',
      netRegex: { id: '8AA3', source: 'Ketuduke' },
      response: Responses.tankBuster(),
    },
    // ----------------------------------------- Lala
    {
      id: 'Aloalo Lala Lala Rotation',
      type: 'HeadMarker',
      netRegex: { id: ['01E4', '01E5'], target: 'Lala' },
      run: (data, matches) => data.lalaRotate = matches.id === '01E4' ? 'cw' : 'ccw',
    },
    {
      id: 'Aloalo Lala Player Rotation',
      type: 'HeadMarker',
      netRegex: { id: ['01ED', '01EE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => data.lalaRotate = matches.id === '01ED' ? 'cw' : 'ccw',
    },
    {
      id: 'Aloalo Lala Inferno Theorem',
      type: 'StartsUsing',
      netRegex: { id: '887F', source: 'Lala', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo LaLa Arcane Blight Open',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(ArcaneBlightMap), source: 'Lala' },
      run: (data, matches) => data.lalaArcaneBlight = ArcaneBlightMap[matches.id.toUpperCase()],
    },
    {
      id: 'Aloalo Lala Arcane Blight',
      type: 'StartsUsing',
      netRegex: { id: '8873', source: 'Lala', capture: false },
      delaySeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.lalaArcaneBlight === undefined)
          return output.text();
        if (data.lalaRotate === undefined)
          return output[data.lalaArcaneBlight]();
        if (data.lalaRotate === 'cw') {
          return {
            'front': output.right(),
            'back': output.left(),
            'left': output.front(),
            'right': output.back(),
          }[data.lalaArcaneBlight];
        }
        return {
          'front': output.left(),
          'back': output.right(),
          'left': output.back(),
          'right': output.front(),
        }[data.lalaArcaneBlight];
      },
      run: (data) => {
        delete data.lalaArcaneBlight;
        delete data.lalaRotate;
      },
      outputStrings: {
        text: {
          en: 'Go to safe zone',
          de: 'Geh in den sicheren Bereich',
          ja: '安置へ移動',
        },
        front: Outputs.goFront,
        back: Outputs.getBehind,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Aloalo Lala Analysis Direction',
      type: 'GainsEffect',
      // E8E Front Unseen
      // E8F Back Unseen
      // E90 Right Unseen
      // E91 Left Unseen
      netRegex: { effectId: ['E8E', 'E8F', 'E90', 'E91'], source: 'Lala' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      durationSeconds: 8,
      suppressSeconds: 12,
      alertText: (data, matches, output) => {
        const map = {
          'E8E': 'front',
          'E8F': 'back',
          'E90': 'right',
          'E91': 'left',
        }[matches.effectId];
        if (map === undefined)
          return output.text();
        if (data.lalaRotate === undefined)
          return output[map]();
        if (data.lalaRotate === 'cw')
          return {
            'front': output.left(),
            'back': output.right(),
            'left': output.back(),
            'right': output.front(),
          }[map];
        return {
          'front': output.right(),
          'back': output.left(),
          'left': output.front(),
          'right': output.back(),
        }[map];
      },
      run: (data) => delete data.lalaRotate,
      outputStrings: {
        front: Outputs.lookTowardsBoss,
        back: {
          en: 'Look behind',
          de: 'Schau nach Hinten',
          ja: '後ろ見て',
        },
        left: {
          en: 'Look right',
          de: 'Schau nach Rechts',
          ja: '右見て',
        },
        right: {
          en: 'Look left',
          de: 'Schau nach Links',
          ja: '左見て',
        },
        text: {
          en: 'Point opening at Boss',
          de: 'Zeige Öffnung zum Boss',
          fr: 'Pointez l\'ouverture vers Boss',
          ja: '未解析の方角をボスに向ける',
          cn: '脚下光环缺口对准boss',
          ko: '문양이 빈 쪽을 보스쪽으로 향하게 하기', // FIXME
        },
      },
    },
    {
      id: 'Aloalo Lala Floral Figure',
      type: 'StartsUsing',
      netRegex: { id: '8880', source: 'Lala', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Seed adds => Donut AOEs',
          de: 'Samen Adds => Donut AoEs',
          ja: '種 => ドーナツAOE',
        },
      },
    },
    {
      id: 'Aloalo Lala Faunal Figure',
      type: 'StartsUsing',
      netRegex: { id: '8882', source: 'Lala', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bat adds => Big AOEs',
          de: 'Fledermaus Adds => Große AoEs',
          ja: 'コウモリ => ゆかAOE',
        },
      },
    },
    {
      id: 'Aloalo Lala Constructive Figure',
      type: 'StartsUsing',
      netRegex: { id: '8884', source: 'Lala', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tree adds => Line AOEs',
          de: 'Baum Adds => Linien AoEs',
          ja: '木 => 直線AOE',
        },
      },
    },
    {
      id: 'Aloalo Lala Strategic Strike',
      type: 'StartsUsing',
      netRegex: { id: '887E', source: 'Lala' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aloalo Lala Calculated Trajectory',
      type: 'GainsEffect',
      netRegex: { effectId: 'E8[3-6]' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 3,
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        const map = {
          'E83': 'front',
          'E84': 'back',
          'E85': 'left',
          'E86': 'right',
        }[matches.effectId];
        if (map === undefined)
          return output.text();
        if (data.lalaRotate === undefined)
          return output[map]();
        if (data.lalaRotate === 'cw') {
          return {
            'front': output.right(),
            'back': output.left(),
            'left': output.front(),
            'right': output.back(),
          }[map];
        }
        return {
          'front': output.left(),
          'back': output.right(),
          'left': output.back(),
          'right': output.front(),
        }[map];
      },
      run: (data) => delete data.lalaRotate,
      outputStrings: {
        text: {
          en: 'Mindhack',
          de: 'Geistlenkung',
          fr: 'Piratage mental',
          ja: '強制移動',
          cn: '强制移动',
          ko: '강제이동', // FIXME
        },
        front: {
          en: 'Mindhack: Forward',
          de: 'Geistlenkung: Vorwärts',
          fr: 'Piratage mental : Vers l\'avant',
          ja: '強制移動 : 前',
          cn: '强制移动 : 前',
          ko: '강제이동: 앞',
        },
        back: {
          en: 'Mindhack: Back',
          de: 'Geistlenkung: Rückwärts',
          fr: 'Piratage mental : Vers l\'arrière',
          ja: '強制移動 : 後ろ',
          cn: '强制移动 : 后',
          ko: '강제이동: 뒤',
        },
        left: {
          en: 'Mindhack: Left',
          de: 'Geistlenkung: Links',
          fr: 'Piratage mental : Vers la gauche',
          ja: '強制移動 : 左',
          cn: '强制移动 : 左',
          ko: '강제이동: 왼쪽',
        },
        right: {
          en: 'Mindhack: Right',
          de: 'Geistlenkung: Rechts',
          fr: 'Piratage mental : Vers la droite',
          ja: '強制移動 : 右',
          cn: '强制移动 : 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
    // ----------------------------------------- Statice
    {
      id: 'Aloalo Statice Pop',
      type: 'StartsUsing',
      netRegex: { id: '892F', source: 'Statice', capture: false },
      delaySeconds: 3,
      response: Responses.knockback(),
    },
    {
      id: 'Aloalo Statice 4-tonze Weight',
      type: 'StartsUsing',
      netRegex: { id: '8931', source: 'Statice', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid 4-tons',
          de: 'Weiche 4-Tonnen aus',
          ja: '4トン回避',
        },
      },
    },
    {
      id: 'Aloalo Statice Pinwheel',
      type: 'StartsUsing',
      netRegex: { id: '8933', source: 'Statice', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid fire lines',
          de: 'Weiche Feuer-Linien aus',
          ja: 'ぐるぐる火を回避',
        },
      },
    },
    {
      id: 'Aloalo Statice Trick Reload',
      type: 'StartsUsing',
      netRegex: { id: '892A', source: 'Statice', capture: false },
      run: (data) => {
        data.reloadCount = 0;
        data.reloadFailed = [];
      },
    },
    {
      id: 'Aloalo Statice Locked and Loaded',
      type: 'Ability',
      netRegex: { id: '8925', source: 'Statice', capture: false },
      run: (data) => data.reloadCount++,
    },
    {
      id: 'Aloalo Statice Misload',
      type: 'Ability',
      netRegex: { id: '8926', source: 'Statice', capture: false },
      run: (data) => {
        data.reloadCount++;
        data.reloadFailed.push(data.reloadCount);
      },
    },
    {
      id: 'Aloalo Statice Trigger Happy',
      type: 'StartsUsing',
      netRegex: { id: '892B', source: 'Statice', capture: false },
      infoText: (data, _matches, output) => {
        const safe = data.reloadFailed.join(', ');
        return output.text({ safe: safe });
      },
      outputStrings: {
        text: {
          en: 'Safe: ${safe}',
          de: 'Sicher: ${safe}',
          ja: '安置: ${safe}',
        },
      },
    },
    {
      id: 'Aloalo Statice Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '8929', source: 'Statice', capture: false },
      response: Responses.aoe('alert'),
    },
    // ----------------------------------------- Loquloqui
    {
      id: 'Aloalo Loquloqui Long-lost Light',
      type: 'StartsUsing',
      netRegex: { id: '87BC', source: 'Loquloqui', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'Aloalo Loquloqui O Life, Flourish',
      type: 'StartsUsing',
      netRegex: { id: '893C', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid shimmering adds',
          de: 'Weiche leuchtenden Adds aus',
          ja: '光ってる物に注意',
        },
      },
    },
    {
      id: 'Aloalo Uolosapa Loqua Rush',
      type: 'StartsUsing',
      netRegex: { id: ['87C0', '87C1'], source: 'Uolosapa Loqua', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Birds charge',
          de: 'Vogel ansturm',
          ja: '鳥の突進',
        },
      },
    },
    {
      id: 'Aloalo Repuruba Loqua Turnabout',
      type: 'StartsUsing',
      netRegex: { id: ['87C2', '87C3'], source: 'Repuruba Loqua', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid AOEs',
          de: 'Weiche AoEs aus',
          ja: 'AOE回避',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Protective Will',
      type: 'StartsUsing',
      netRegex: { id: '87BE', source: 'Loquloqui' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aloalo Loquloqui O Petals, Unfurl',
      type: 'StartsUsing',
      netRegex: { id: '87C5', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid tethers',
          de: 'Weiche Verbindungen aus',
          ja: '縮む線を回避',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Land Wave',
      type: 'StartsUsing',
      netRegex: { id: '87BD', source: 'Loquloqui', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aloalo Loquloqui O Isle, Bloom',
      type: 'StartsUsing',
      netRegex: { id: '87C7', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Last bloom => Go to safe',
          de: 'Letzte Blüte => Geh zum sicheren Bereich',
          ja: '最後の花畑 => 安置へ移動',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Sanctuary',
      type: 'StartsUsing',
      netRegex: { id: '87CA', source: 'Loquloqui', capture: false },
      durationSeconds: 4.5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Crush! Go to corner',
          de: 'Crush! Geh in eine Ecke',
          ja: 'クラッシュ！隅へ移動',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Stirring of Spirits',
      type: 'StartsUsing',
      netRegex: { id: '87CB', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '4x Knockback',
          de: '4x Rückstoß',
          ja: '4x ノックバック',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Kairimai Loquloqai': 'Kairimai Loquloqai',
        'Ketuduke': 'Ketuduke',
        'Ketulu Cove': 'Ketulu-Bucht',
        'Lala': 'Lala',
        'Loquloqui': 'Loquloqui',
        'Quaqua': 'Quaqua',
        'Repuruba Loqua': 'Repuruba Loqua',
        'Seasong\'s Rest': 'Ruh der Seesänger',
        'Statice': 'Statice',
        'The Elder Stump': 'Altenstumpf',
        'The Origin Spring': 'Urquell',
        'The Slumbering Canopy': 'Schlafende Krone',
        'The ancient forum': 'Altes Forum',
        'Uolosapa Loqua': 'Uolosapa Loqua',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Kairimai Loquloqai': 'Kairimai Loquloqai',
        'Ketuduke': 'Ketuduke',
        'Ketulu Cove': 'Baie de Ketulu',
        'Lala': 'Lala',
        'Loquloqui': 'Loquloqui',
        'Quaqua': 'Quaqua',
        'Repuruba Loqua': 'repuruba loqua',
        'Seasong\'s Rest': 'Repos du Chant marin',
        'Statice': 'Statice',
        'The Elder Stump': 'Souche du Doyen',
        'The Origin Spring': 'Fontaine de l\'Origine',
        'The Slumbering Canopy': 'Voûte apaisée',
        'The ancient forum': 'Ancienne grand-place',
        'Uolosapa Loqua': 'uolosapa loqua',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Kairimai Loquloqai': '神子の祭壇',
        'Ketuduke': 'ケトゥドゥケ',
        'Ketulu Cove': 'ケトゥルの江湾',
        'Lala': 'ララ',
        'Loquloqui': 'ロクロクイ',
        'Quaqua': 'クアクア',
        'Repuruba Loqua': 'レプルバ・ロクア',
        'Seasong\'s Rest': '鯨の還る地',
        'Statice': 'スターチス',
        'The Elder Stump': '老樹の切り株',
        'The Origin Spring': '大樹の命泉',
        'The Slumbering Canopy': '昏き微睡の間',
        'The ancient forum': '古き広場',
        'Uolosapa Loqua': 'オーロサパ・ロクア',
      },
    },
  ],
});
