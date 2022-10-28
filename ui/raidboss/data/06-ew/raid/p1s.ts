import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Fixup Intemperance callouts
// TODO: Add Aetherflail callouts to Powerful Light/Fire

export interface Data extends RaidbossData {
  companionship?: string;
  loneliness?: string;
  safeColor?: string;
}

const flailDirections = {
  l: Outputs.left,
  r: Outputs.right,
  combo: {
    en: '${first} => ${second}',
    de: '${first} => ${second}',
    fr: '${first} => ${second}',
    ja: '${first} => ${second}',
    cn: '${first} => ${second}',
    ko: '${first} => ${second}',
  },
};

const fireLightOutputStrings = {
  fire: {
    en: 'Stand on fire',
    de: 'Auf der Feuerfläche stehen',
    fr: 'Placez-vous sur le feu',
    ja: '炎の床へ',
    cn: '站在火',
    ko: '빨간 바닥으로',
  },
  light: {
    en: 'Stand on light',
    de: 'Auf der Lichtfläche stehen',
    fr: 'Placez-vous sur la lumière',
    ja: '光の床へ',
    cn: '站在光',
    ko: '흰 바닥으로',
  },
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircleSavage,
  timelineFile: 'p1s.txt',
  timelineTriggers: [
    {
      id: 'P1S Tile Positions',
      regex: /(?:First|Second|Third) Element/,
      beforeSeconds: 3,
      infoText: (_data, _matches, output) => output.positions!(),
      outputStrings: {
        positions: {
          en: 'Tile Positions',
          de: 'Flächen-Positionen',
          fr: 'Positions sur les cases',
          ja: '自分の担当マスへ',
          cn: '上自己的方块',
          ko: '담당 타일로',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P1S Warder\'s Wrath',
      type: 'StartsUsing',
      netRegex: { id: '662A', source: 'Erichthonios', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P1S Shackles of Companionship',
      type: 'GainsEffect',
      netRegex: { effectId: 'AB6' },
      preRun: (data, matches) => data.companionship = matches.target,
      durationSeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.closeShacklesOnYou!();
      },
      outputStrings: {
        closeShacklesOnYou: {
          en: 'Close Shackles on YOU',
          de: 'Nahe Fesseln auf DIR',
          fr: 'Chaînes proches sur VOUS',
          ja: '紫鎖（近い方）',
          cn: '紫锁（近）点名',
          ko: '안쪽 쇠사슬(보라색)',
        },
      },
    },
    {
      id: 'P1S Shackles of Loneliness',
      type: 'GainsEffect',
      netRegex: { effectId: 'AB7' },
      preRun: (data, matches) => data.loneliness = matches.target,
      durationSeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.farShacklesOnYou!();
      },
      outputStrings: {
        farShacklesOnYou: {
          en: 'Far Shackles on YOU',
          de: 'Entfernte Fesseln auf DIR',
          fr: 'Chaînes éloignées sur VOUS',
          ja: '赤鎖（遠い方）',
          cn: '红锁（远）点名',
          ko: '바깥쪽 쇠사슬(빨간색)',
        },
      },
    },
    {
      // Callout the other shackle(s) at info level
      id: 'P1S Aetherial Shackles Callout',
      type: 'GainsEffect',
      netRegex: { effectId: 'AB[67]' },
      condition: (data) => data.companionship !== undefined && data.loneliness !== undefined,
      durationSeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      infoText: (data, _matches, output) => {
        if (data.companionship === data.me)
          return output.farShacklesOn!({ far: data.ShortName(data.loneliness) });
        if (data.loneliness === data.me)
          return output.closeShacklesOn!({ close: data.ShortName(data.companionship) });
        return output.shacklesOn!({
          close: data.ShortName(data.companionship),
          far: data.ShortName(data.loneliness),
        });
      },
      tts: (data, _matches, output) => {
        if (data.companionship === data.me || data.loneliness === data.me)
          return null;
        return output.shacklesOn!({
          close: data.ShortName(data.companionship),
          far: data.ShortName(data.loneliness),
        });
      },
      run: (data) => {
        delete data.companionship;
        delete data.loneliness;
      },
      outputStrings: {
        closeShacklesOn: {
          en: 'Close Shackles on ${close}',
          de: 'Nahe Fesseln auf ${close}',
          fr: 'Chaînes proches sur ${close}',
          ja: '紫鎖（近い方）：${close}',
          cn: '紫锁（近）：${close}',
          ko: '안쪽 쇠사슬: ${close}',
        },
        farShacklesOn: {
          en: 'Far Shackles on ${far}',
          de: 'Entfernte Fesseln auf ${far}',
          fr: 'Chaînes éloignées sur ${far}',
          ja: '赤鎖（遠い方）：${far}',
          cn: '红锁（远）：${far}',
          ko: '바깥쪽 쇠사슬: ${far}',
        },
        shacklesOn: {
          en: 'Close: ${close}, Far: ${far}',
          de: 'Nahe: ${close}, Entfernt: ${far}',
          fr: 'Proches : ${close}, Éloignées : ${far}',
          ja: '紫鎖（近い方）：${close}、赤鎖（遠い方）：${far}',
          cn: '紫锁（近）：${close}、红锁（远）：${far}',
          ko: '안쪽: ${close}, 바깥쪽: ${far}',
        },
      },
    },
    {
      id: 'P1S Shining Cells',
      type: 'StartsUsing',
      netRegex: { id: '6616', source: 'Erichthonios', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P1S Slam Shut',
      type: 'StartsUsing',
      netRegex: { id: '6617', source: 'Erichthonios', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P1S Gaoler\'s Flail Left => Right',
      type: 'StartsUsing',
      netRegex: { id: '65F6', source: 'Erichthonios', capture: false },
      alertText: (_data, _matches, output) =>
        output.combo!({ first: output.l!(), second: output.r!() }),
      outputStrings: flailDirections,
    },
    {
      id: 'P1S Gaoler\'s Flail Right => Left',
      type: 'StartsUsing',
      netRegex: { id: '65F7', source: 'Erichthonios', capture: false },
      alertText: (_data, _matches, output) =>
        output.combo!({ first: output.r!(), second: output.l!() }),
      outputStrings: flailDirections,
    },
    {
      id: 'P1S Gaoler\'s Flail Out => In',
      type: 'StartsUsing',
      netRegex: { id: ['65F8', '65F9'], source: 'Erichthonios', capture: false },
      alertText: (_data, _matches, output) => output.outThenIn!(),
      outputStrings: {
        outThenIn: Outputs.outThenIn,
      },
    },
    {
      id: 'P1S Gaoler\'s Flail In => Out',
      type: 'StartsUsing',
      netRegex: { id: ['65FA', '65FB'], source: 'Erichthonios', capture: false },
      alertText: (_data, _matches, output) => output.inThenOut!(),
      outputStrings: {
        inThenOut: Outputs.inThenOut,
      },
    },
    {
      id: 'P1S Heavy Hand',
      type: 'StartsUsing',
      netRegex: { id: '6629', source: 'Erichthonios' },
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'P1S Pitiless Flail of Grace',
      type: 'StartsUsing',
      netRegex: { id: '660E', source: 'Erichthonios', capture: false },
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Tankbuster+Knockback => Stack',
          de: 'Tankbuster+Rückstoß => Sammeln',
          fr: 'Tank buster + Poussée => Packez-vous',
          ja: 'タンクバスター+ノックバック => 頭割り',
          cn: '坦克死刑+击退 => 分摊',
          ko: '탱버 + 넉백 => 쉐어',
        },
      },
    },
    {
      id: 'P1S Pitiless Flail of Purgation',
      type: 'StartsUsing',
      netRegex: { id: '660F', source: 'Erichthonios', capture: false },
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Tankbuster+Knockback => Flare',
          de: 'Tankbuster+Rückstoß => Flare',
          fr: 'Tank buster + Poussée => Brasier',
          ja: 'タンクバスター+ノックバック => フレア',
          cn: '坦克死刑+击退 => 核爆',
          ko: '탱버 + 넉백 => 플레어',
        },
      },
    },
    {
      id: 'P1S Intemperate Torment Bottom',
      type: 'StartsUsing',
      netRegex: { id: '661F', source: 'Erichthonios', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bottom First',
          de: 'Unten zuerst',
          fr: 'Cube inférieur en premier',
          ja: '下から',
          cn: '底部开始',
          ko: '아래부터',
        },
      },
    },
    {
      id: 'P1S Intemperate Torment Top',
      type: 'StartsUsing',
      netRegex: { id: '6620', source: 'Erichthonios', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Top First',
          de: 'Oben zuerst',
          fr: 'Cube supérieur en premier',
          ja: '上から',
          cn: '顶部开始',
          ko: '위부터',
        },
      },
    },
    // Copy/paste from normal, seems to be the same
    {
      id: 'P1S Hot/Cold Spell',
      type: 'GainsEffect',
      netRegex: { effectId: ['AB3', 'AB4'] },
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        return matches.effectId === 'AB3' ? output.red!() : output.blue!();
      },
      outputStrings: {
        red: {
          en: 'Get hit by red',
          de: 'Von Rot treffen lassen',
          fr: 'Faites-vous toucher par le rouge',
          ja: '炎に当たる',
          cn: '去吃火',
          ko: '빨간색 맞기',
        },
        blue: {
          en: 'Get hit by blue',
          de: 'Von Blau treffen lassen',
          fr: 'Faites-vous toucher par le bleu',
          ja: '氷に当たる',
          cn: '去吃冰',
          ko: '파란색 맞기',
        },
      },
    },
    {
      id: 'P1S Powerful Light/Fire',
      type: 'GainsEffect',
      netRegex: { effectId: '893' },
      preRun: (data, matches) => {
        data.safeColor = matches.count === '14C' ? 'light' : 'fire';
      },
      alertText: (data, _matches, output) => data.safeColor && output[data.safeColor]!(),
      outputStrings: fireLightOutputStrings,
    },
    {
      id: 'P1S Shackles of Time',
      type: 'GainsEffect',
      netRegex: { effectId: 'AB5' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.oppositeParty!();
        return output.oppositePlayer!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        oppositePlayer: {
          en: 'Opposite color of ${player}',
          de: 'Gegenteilige Farbe von ${player}',
          fr: 'Couleur opposée de ${player}',
          ja: '${player}と反対の色へ',
          cn: '${player}的相反颜色',
          ko: '${player}의 반대 색으로',
        },
        oppositeParty: {
          en: 'Opposite color of Party',
          de: 'Gegenteilige Farbe von der Party',
          fr: 'Couleur opposée à l\'équipe',
          ja: '他のメンバーと反対の色へ',
          cn: '其他队友的相反颜色',
          ko: '혼자 반대 색으로',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Companionship 1',
      type: 'GainsEffect',
      netRegex: { effectId: 'B45' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Close (3s)',
          de: 'Nahe (3s)',
          fr: 'Proches (3s)',
          ja: '紫鎖（近い方） (3s)',
          cn: '紫锁 (近) (3秒)',
          ko: '안쪽#1 (3초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Companionship 2',
      type: 'GainsEffect',
      netRegex: { effectId: 'B46' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Close (8s)',
          de: 'Nahe (8s)',
          fr: 'Proches (8s)',
          ja: '紫鎖（近い方） (8s)',
          cn: '紫锁 (近) (8秒)',
          ko: '안쪽#2 (8초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Companionship 3',
      type: 'GainsEffect',
      netRegex: { effectId: 'B47' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Close (13s)',
          de: 'Nahe (13s)',
          fr: 'Proches (13s)',
          ja: '紫鎖（近い方） (13s)',
          cn: '紫锁 (近) (13秒)',
          ko: '안쪽#3 (13초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Companionship 4',
      type: 'GainsEffect',
      netRegex: { effectId: 'B6B' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Close (18s)',
          de: 'Nahe (18s)',
          fr: 'Proches (18s)',
          ja: '紫鎖（近い方） (18s)',
          cn: '紫锁 (近) (18秒)',
          ko: '안쪽#4 (18초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Loneliness 1',
      type: 'GainsEffect',
      netRegex: { effectId: 'B48' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Far (3s)',
          de: 'Entfernt (3s)',
          fr: 'Éloignées (3s)',
          ja: '赤鎖（遠い方） (3s)',
          cn: '红锁 (远) (3秒)',
          ko: '바깥쪽#1 (3초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Loneliness 2',
      type: 'GainsEffect',
      netRegex: { effectId: 'B49' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Far (8s)',
          de: 'Entfernt (8s)',
          fr: 'Éloignées (8s)',
          ja: '赤鎖（遠い方） (8s)',
          cn: '红锁 (远) (8秒)',
          ko: '바깥쪽#2 (8초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Loneliness 3',
      type: 'GainsEffect',
      netRegex: { effectId: 'B4A' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Far (13s)',
          de: 'Entfernt (13s)',
          fr: 'Éloignées (13s)',
          ja: '赤鎖（遠い方） (13s)',
          cn: '红锁 (远) (13秒)',
          ko: '바깥쪽#3 (13초)',
        },
      },
    },
    {
      id: 'P1S Fourfold Shackles of Loneliness 4',
      type: 'GainsEffect',
      netRegex: { effectId: 'B6C' },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Far (18s)',
          de: 'Entfernt (18s)',
          fr: 'Éloignées (18s)',
          ja: '赤鎖（遠い方） (18s)',
          cn: '红锁 (远) (18秒)',
          ko: '바깥쪽#4 (18초)',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Pitiless Flail of Grace/Pitiless Flail of Purgation': 'Flail of Grace/Purgation',
        'True Flare/True Holy': 'True Flare/Holy',
        'Powerful Fire/Powerful Light': 'Powerful Fire/Light',
        'Inevitable Flame/Inevitable Light': 'Inevitable Flame/Light',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Erichthonios': 'Erichthonios',
      },
      'replaceText': {
        'Aetherchain': 'Berstende Ketten',
        'Aetherial Shackles': 'Fluchesketten',
        'Chain Pain': 'Verfluchte Vollstreckung',
        'First Element': 'Erstes Element',
        'Fourfold Shackles': 'Vierfache Fluchesketten',
        'Gaoler\'s Flail(?! [IO])': 'Eiserne Zucht',
        'Gaoler\'s Flail In/Out': 'Eiserne Zucht Rein/Raus',
        'Gaoler\'s Flail Out/In': 'Eiserne Zucht Raus/Rein',
        'Heavy Hand': 'Marter',
        'Inevitable Flame': 'Aspektiertes Feuer',
        'Inevitable Light': 'Aspektiertes Licht',
        'Intemperance': 'Zehrende Elemente',
        'Intemperate Torment': 'Zehrende Vollstreckung',
        'Lethe': 'Schloss und Riegel',
        'Pitiless Flail of Grace': 'Heilige Zucht und Ordnung',
        'Pitiless Flail of Purgation': 'Feurige Zucht und Ordnung',
        'Powerful Fire': 'Entladenes Feuer',
        'Powerful Light': 'Entladenes Licht',
        'Second Element': 'Zweites Element',
        'Shackles of Time': 'Aspektierende Ketten',
        'Shining Cells': 'Ätherzwinger',
        'Slam Shut': 'Freigang',
        'Third Element': 'Drittes Element',
        'True Flare': 'Vollkommenes Flare',
        'True Holy': 'Vollkommenes Sanctus',
        'Warder\'s Wrath': 'Kettenmagie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Erichthonios': 'Érichthonios',
      },
      'replaceText': {
        '\\?': ' ?',
        'Aetherchain': 'Chaînes explosives',
        '(?<!/)Aetherial Shackles': 'Chaîne de malédiction',
        'Chain Pain': 'Exécution maudite',
        'First Element': 'Premier élément',
        'Fourfold Shackles': 'Chaîne de malédiction quadruple',
        'Gaoler\'s Flail(?! [IO])': 'Chaîne punitive',
        'Gaoler\'s Flail In/Out': 'Chaîne intérieur/extérieur',
        'Gaoler\'s Flail Out/In': 'Chaîne extérieur/intérieur',
        'Heavy Hand': 'Chaîne de supplice',
        'Inevitable Flame/Inevitable Light': 'Explosion à retardement',
        'Intemperance': 'Corrosion élémentaire',
        'Intemperate Torment': 'Exécution corrosive',
        'Lethe': 'Descente aux limbes',
        'Pitiless Flail of Grace(?!/)': 'Chaîne transperçante sacrée',
        'Pitiless Flail of Grace/Pitiless Flail of Purgation': 'Chaîne sacrée/infernale',
        'Powerful Fire/Powerful Light': 'Explosion infernale/sacrée',
        'Second Element': 'Deuxième élément',
        'Shackles of Time(?!/)': 'Chaîne à retardement',
        'Shackles of Time/Aetherial Shackles': 'Chaîne à retardement/malédiction',
        'Shining Cells': 'Geôle limbique',
        'Slam Shut': 'Occlusion terminale',
        'Third Element': 'Troisième élément',
        'True Flare/True Holy': 'Brasier/Miracle véritable',
        'Warder\'s Wrath': 'Chaînes torrentielles',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Erichthonios': 'エリクトニオス',
      },
      'replaceText': {
        'Aetherchain': '爆鎖',
        'Aetherial Shackles': '結呪の魔鎖',
        'Chain Pain': '結呪執行',
        'Fourfold Shackles': '結呪の四連魔鎖',
        'Gaoler\'s Flail': '懲罰撃',
        'Heavy Hand': '痛撃',
        'Inevitable Flame': '時限炎爆',
        'Inevitable Light': '時限光爆',
        'Intemperance': '氷火の侵食',
        'Intemperate Torment': '侵食執行',
        'Lethe': '辺獄送り',
        'Pitiless Flail of Grace': '懲罰連撃・聖',
        'Pitiless Flail of Purgation': '懲罰連撃・炎',
        'Powerful Fire': '炎爆',
        'Powerful Light': '光爆',
        'Shackles of Time': '時限の魔鎖',
        'Shining Cells': '光炎監獄',
        'Slam Shut': '監獄閉塞',
        'True Flare': 'トゥルー・フレア',
        'True Holy': 'トゥルー・ホーリー',
        'Warder\'s Wrath': '魔鎖乱流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Erichthonios': '埃里克特翁尼亚斯',
      },
      'replaceText': {
        'Aetherchain': '爆锁',
        'Aetherial Shackles': '结咒魔锁',
        'Chain Pain': '结咒发动',
        'First Element': '第一元素',
        'Fourfold Shackles': '结咒四连魔锁',
        'Gaoler\'s Flail(?! [IO])': '惩罚抽击',
        'Gaoler\'s Flail In/Out': '惩罚抽击 内/外',
        'Gaoler\'s Flail Out/In': '惩罚抽击 外/内',
        'Heavy Hand': '掌掴',
        'Inevitable Flame': '限时炎爆',
        'Inevitable Light': '限时光爆',
        'Intemperance': '冰火侵蚀',
        'Intemperate Torment': '侵蚀发动',
        'Lethe': '边境流刑',
        'Pitiless Flail of Grace': '惩罚连击·圣',
        'Pitiless Flail of Purgation': '惩罚连击·炎',
        'Powerful Fire': '炎爆',
        'Powerful Light': '光爆',
        'Second Element': '第二元素',
        'Shackles of Time': '限时魔锁',
        'Shining Cells': '光炎监狱',
        'Slam Shut': '监狱封闭',
        'Third Element': '第三元素',
        'True Flare': '纯正核爆',
        'True Holy': '纯正神圣',
        'Warder\'s Wrath': '魔锁乱流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Erichthonios': '에리크토니오스',
      },
      'replaceText': {
        'Aetherchain': '폭쇄',
        'Aetherial Shackles': '결박 사슬',
        'Chain Pain': '결박 집행',
        'First Element': '큐브 폭발 #1',
        'Fourfold Shackles': '4연속 결박 사슬',
        'Gaoler\'s Flail(?! [IO])': '징벌격',
        'Gaoler\'s Flail In/Out': '징벌격 안/밖',
        'Gaoler\'s Flail Out/In': '징벌격 밖/안',
        'Heavy Hand': '통격',
        'Inevitable Flame/Inevitable Light': '시한 염폭/광폭',
        'Intemperance': '얼음불 침식',
        'Intemperate Torment': '침식 집행',
        'Lethe': '변옥 수감',
        'Pitiless Flail of Grace(?!/)': '징벌 연격: 신성',
        'Pitiless Flail of Grace/Pitiless Flail of Purgation': '징벌 연격: 신성/화염',
        'Powerful Fire': '염폭',
        'Powerful Light': '광폭',
        'Second Element': '큐브 폭발 #2',
        'Shackles of Time(?!/)': '시한부 사슬',
        'Shackles of Time/Aetherial Shackles': '시한부/결박 사슬',
        'Shining Cells': '광염 감옥',
        'Slam Shut': '감옥 폐쇄',
        'Third Element': '큐브 폭발 #3',
        'True Flare/True Holy': '진 플레어/홀리',
        'Warder\'s Wrath': '사슬난류',
      },
    },
  ],
};

export default triggerSet;
