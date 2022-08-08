import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  earthResistDown: { [name: string]: boolean };
  windResistDown: { [name: string]: boolean };
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheLostCityOfAmdaporHard,
  timelineFile: 'the_lost_city_of_amdapor_hard.txt',
  // Temporarily out of combat during Kuribu phases.  @_@;;
  resetWhenOutOfCombat: false,
  initData: () => {
    return {
      earthResistDown: {},
      windResistDown: {},
    };
  },
  triggers: [
    {
      id: 'LostCityHard Gremlin Bad-Mouth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '775', source: 'Ranting Ranks Gremlin' }),
      condition: Conditions.targetIsNotYou(),
      infoText: (data, matches, output) => output.comfort!({ name: data.ShortName(matches.target) }),
      outputStrings: {
        comfort: {
          en: '/comfort ${name}',
          de: '/trösten ${name}',
          ko: '/위로 ${name}',
        },
      },
    },
    {
      id: 'LostCityHard Achamoth Neuro Squama',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15C5', source: 'Achamoth', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to edge; look outside',
          de: 'Geh zum Rand und schau nach draußen',
          ko: '구석에서 바깥 보기',
        },
      },
    },
    {
      id: 'LostCityHard Achamoth Toxic Squama',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0001', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid chasing orb',
          de: 'Weiche dem verfolgenden Orb aus',
          ko: '유도 구슬 피하기',
        },
      },
    },
    {
      id: 'LostCityHard Void Monk Water III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16C7', source: 'Void Monk' }),
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'LostCityHard Void Monk Sucker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16C5', source: 'Void Monk', capture: false }),
      response: Responses.drawIn(),
    },
    {
      id: 'LostCityHard Void Monk Flood',
      type: 'Ability',
      // This is an instant cast followup to Sucker.
      netRegex: NetRegexes.ability({ id: '16C5', source: 'Void Monk', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'LostCityHard Winged Lion Wind Resist Down II Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '41C' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => data.windResistDown[matches.target] = true,
      outputStrings: {
        text: {
          en: 'Avoid Aero',
          de: 'Vermeide Wind',
          ko: '에어로 피하기',
        },
      },
    },
    {
      id: 'LostCityHard Winged Lion Wind Resist Down II Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '41C' }),
      run: (data, matches) => data.windResistDown[matches.target] = false,
    },
    {
      id: 'LostCityHard Winged Lion Earth Resist Down II Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '41D' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => data.earthResistDown[matches.target] = true,
      outputStrings: {
        text: {
          en: 'Avoid Stone',
          de: 'Vermeide Stein',
          ko: '스톤 피하기',
        },
      },
    },
    {
      id: 'LostCityHard Winged Lion Earth Resist Down II Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '41D' }),
      run: (data, matches) => data.earthResistDown[matches.target] = false,
    },
    {
      id: 'LostCityHard Winged Lion Ancient Stone',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '15D2', source: 'Winged Lion', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          pop: {
            en: 'Pop stone orb',
            de: 'Nimm Stein Orb',
            ko: '스톤 구슬 부딪히기',
          },
          avoid: {
            en: 'Avoid stone orb',
            de: 'Vermeide Stein Orb',
            ko: '스톤 구슬 피하기',
          },
        };

        if (data.earthResistDown[data.me])
          return { infoText: output.avoid!() };
        return { alertText: output.pop!() };
      },
    },
    {
      id: 'LostCityHard Winged Lion Ancient Aero',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '15CE', source: 'Winged Lion', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          pop: {
            en: 'Pop aero orb',
            de: 'Nimm Wind Orb',
            ko: '에어로 구슬 부딪히기',
          },
          avoid: {
            en: 'Avoid aero orb',
            de: 'Vermeide Wind Orb',
            ko: '에어로 구슬 피하기',
          },
        };

        if (data.windResistDown[data.me])
          return { infoText: output.avoid!() };
        return { alertText: output.pop!() };
      },
    },
    {
      id: 'LostCityHard Winged Lion Ancient Holy',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '15CA', source: 'Winged Lion', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pop holy orb',
          de: 'Nimm Sanctus Orb',
          ko: '홀리 구슬 잡기',
        },
      },
    },
    {
      id: 'LostCityHard Light Sprite Banish 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680', source: 'Light Sprite' }),
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'LostCityHard Mana Pot Mysterious Light',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16C8', source: 'Mana Pot', capture: false }),
      // These adds tend to do this all at once (or close) so be less noisy.
      suppressSeconds: 5,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'LostCityHard Kuribu Regen',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15DC', source: 'Kuribu', capture: false }),
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move boss out of puddle',
          de: 'Bewege Boss aus der Fläche',
          ko: '보스 장판에서 나오도록 유도하기',
        },
      },
    },
    {
      id: 'LostCityHard Kuribu Cure IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15DF', source: 'Kuribu', capture: false }),
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand in Circle',
          de: 'In einem Kreis stehen',
          ko: '보스 장판 안으로',
        },
      },
    },
    {
      id: 'LostCityHard Kuribu Cure III',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '004A' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Achamoth': 'Achamoth',
        'Dark Wings': 'Dunkle Schwingen',
        'Kuribu': 'Kuribu',
        'Mana Pot': 'Manatopf',
        'Ranting Ranks Gremlin': 'tobend(?:e|er|es|en) Gremlin',
        'The Protectorate': 'Weihestätte',
        'The Tower Of White': 'Weißmagischer Turm',
        'Void Monk': 'Nichtsmönch',
        'Whisper of Existence': 'Trugbild',
        'Winged Lion': 'Schwingenlöwe',
        'light sprite': 'Licht-Exergon',
      },
      'replaceText': {
        '--adds--': '--Adds--',
        'Ancient Aero': 'Antiker Wind',
        'Ancient Holy': 'Sanctus Antiquus',
        'Ancient Libra': 'Antike Analyse',
        'Ancient Stone': 'Antiker Stein',
        'Cure III': 'Vitaga',
        'Cure IV': 'Vitaka',
        'Decoy': 'Lockvogel',
        'Enthrallment': 'Bezauberung',
        'Glory': 'Ruhm',
        'Neuro Squama': 'Neuroschuppen',
        'Psycho Squama': 'Psychoschuppen',
        'Regen': 'Regena',
        'Reverse': 'Umkehrung',
        'Scratch': 'Schramme',
        'Toxic Squama': 'Giftschuppen',
        'Transference': 'Transfer',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Achamoth': 'Achamoth',
        'Dark Wings': 'Ailes sombres',
        'Kuribu': 'Kuribu',
        'Mana Pot': 'pot de mana',
        'Ranting Ranks Gremlin': 'gremlin chahuteur',
        'The Protectorate': 'Protectorat',
        'The Tower Of White': 'Tour des Guérisseurs',
        'Void Monk': 'moine du néant',
        'Whisper of Existence': 'mirage',
        'Winged Lion': 'lion ailé',
        'light sprite': 'élémentaire de lumière',
      },
      'replaceText': {
        'Ancient Aero': 'Vent ancien',
        'Ancient Holy': 'Miracle ancien',
        'Ancient Libra': 'Acuité ancienne',
        'Ancient Stone': 'Terre ancienne',
        'Cure III': 'Méga Soin',
        'Cure IV': 'Giga Soin',
        'Decoy': 'Leurre',
        'Enthrallment': 'Fascination',
        'Glory': 'Gloire',
        'Neuro Squama': 'Photo-écailles',
        'Psycho Squama': 'Psycho-écailles',
        'Regen': 'Récup',
        'Reverse': 'Inversion',
        'Scratch': 'Griffade',
        'Toxic Squama': 'Toxico-écailles',
        'Transference': 'Transfert',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Achamoth': 'アカモート',
        'Dark Wings': '黒風',
        'Kuribu': 'クリブ',
        'Mana Pot': 'マナポット',
        'Ranting Ranks Gremlin': 'グレムリン・ランター',
        'The Protectorate': '守護の聖域',
        'The Tower Of White': '白魔道士の塔',
        'Void Monk': 'ヴォイドモンク',
        'Whisper of Existence': '冒険者の幻影',
        'Winged Lion': 'ウィングドライオン',
        'light sprite': 'ライトスプライト',
      },
      'replaceText': {
        'Ancient Aero': 'エンシェントエアロ',
        'Ancient Holy': 'エンシェントホーリー',
        'Ancient Libra': 'エンシェントライブラ',
        'Ancient Stone': 'エンシェントストーン',
        'Cure III': 'ケアルガ',
        'Cure IV': 'ケアルジャ',
        'Decoy': 'デコイ',
        'Enthrallment': '無我夢中',
        'Glory': 'グローリーブレード',
        'Neuro Squama': '幻惑の鱗粉',
        'Psycho Squama': '魅了の鱗粉',
        'Regen': 'リジェネ',
        'Reverse': 'リバース',
        'Scratch': 'スクラッチ',
        'Toxic Squama': '毒素の鱗粉',
        'Transference': '転移',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Achamoth': '阿卡莫特',
        'Dark Wings': '黑旋风',
        'Kuribu': '基路伯',
        'Mana Pot': '魔力罐',
        'Ranting Ranks Gremlin': '咆哮格雷姆林',
        'The Protectorate': '守护圣域',
        'The Tower Of White': '白魔法师塔',
        'Void Monk': '虚无鬼鱼',
        'Whisper of Existence': '冒险者的幻影',
        'Winged Lion': '双翼飞狮',
        'light sprite': '光元精',
      },
      'replaceText': {
        'Ancient Aero': '古代疾风',
        'Ancient Holy': '古代神圣',
        'Ancient Libra': '古代侦测',
        'Ancient Stone': '古代飞石',
        'Cure III': '愈疗',
        'Cure IV': '圣疗',
        'Decoy': '引诱',
        'Enthrallment': '醉生梦死',
        'Glory': '荣耀之剑',
        'Neuro Squama': '幻惑鳞粉',
        'Psycho Squama': '魅惑鳞粉',
        'Regen': '再生',
        'Reverse': '逆转',
        'Scratch': '抓击',
        'Toxic Squama': '毒素鳞粉',
        'Transference': '转移',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Achamoth': '아카모트',
        'Dark Wings': '흑풍',
        'Kuribu': '쿠리부',
        'Mana Pot': '마나 항아리',
        'Ranting Ranks Gremlin': '떠벌이 그렘린',
        'The Protectorate': '수호의 성역',
        'The Tower Of White': '백마도사의 탑',
        'Void Monk': '보이드 문어',
        'Whisper of Existence': '모험가의 환영',
        'Winged Lion': '날개사자',
        'light sprite': '빛 정령',
      },
      'replaceText': {
        'Ancient Aero': '에인션트 에어로',
        'Ancient Holy': '에인션트 홀리',
        'Ancient Libra': '에인션트 라이브라',
        'Ancient Stone': '에인션트 스톤',
        'Cure III': '케알가',
        'Cure IV': '케알쟈',
        'Decoy': '유인',
        'Enthrallment': '호접몽',
        'Glory': '영광의 검',
        'Neuro Squama': '현혹의 비늘가루',
        'Psycho Squama': '매혹의 비늘가루',
        'Regen': '리제네',
        'Reverse': '역전',
        'Scratch': '생채기',
        'Toxic Squama': '독소 비늘가루',
        'Transference': '전이',
      },
    },
  ],
};

export default triggerSet;
