import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  roarCount?: number;
  stakeCount?: number;
}

// Byakko Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheJadeStoaExtreme,
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Heavenly Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27DA', source: 'Byakko' }),
      netRegexDe: NetRegexes.startsUsing({ id: '27DA', source: 'Byakko' }),
      netRegexFr: NetRegexes.startsUsing({ id: '27DA', source: 'Byakko' }),
      netRegexJa: NetRegexes.startsUsing({ id: '27DA', source: '白虎' }),
      netRegexCn: NetRegexes.startsUsing({ id: '27DA', source: '白虎' }),
      netRegexKo: NetRegexes.startsUsing({ id: '27DA', source: '백호' }),
      condition: (data) => data.role === 'healer',
      response: Responses.tankBuster(),
    },
    {
      id: 'ByaEx Flying Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27F4', source: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27F4', source: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27F4', source: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27F4', source: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27F4', source: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27F4', source: '백호', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'ByaEx Sweep The Leg',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27DB', source: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27DB', source: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27DB', source: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27DB', source: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27DB', source: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27DB', source: '백호', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'ByaEx Storm Pulse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27DC', source: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27DC', source: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27DC', source: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27DC', source: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27DC', source: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27DC', source: '백호', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'ByaEx Distant Clap',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27DD', source: 'Byakko', target: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27DD', source: 'Byakko', target: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27DD', source: 'Byakko', target: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27DD', source: '白虎', target: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27DD', source: '白虎', target: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27DD', source: '백호', target: '백호', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Distant Clap',
          de: 'Donnergrollen',
          fr: 'Tonnerre lointain',
          ja: '遠雷',
          cn: '远雷',
          ko: '원뢰',
        },
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      netRegexDe: NetRegexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      netRegexFr: NetRegexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      netRegexJa: NetRegexes.startsUsing({ id: '27E0', source: '白虎' }),
      netRegexCn: NetRegexes.startsUsing({ id: '27E0', source: '白虎' }),
      netRegexKo: NetRegexes.startsUsing({ id: '27E0', source: '백호' }),
      condition: (data, matches) => data.role === 'tank' && matches.target !== data.me,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Provoke Boss',
          de: 'Boss abspotten',
          fr: 'Provoquez le Boss',
          ja: '挑発',
          cn: '挑衅',
          ko: '보스 도발',
        },
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      netRegexDe: NetRegexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      netRegexFr: NetRegexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      netRegexJa: NetRegexes.startsUsing({ id: '27E0', source: '白虎' }),
      netRegexCn: NetRegexes.startsUsing({ id: '27E0', source: '白虎' }),
      netRegexKo: NetRegexes.startsUsing({ id: '27E0', source: '백호' }),
      condition: (data, matches) => data.role === 'tank' && matches.target === data.me,
      delaySeconds: 12,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Provoke Boss',
          de: 'Boss abspotten',
          fr: 'Provoquez le Boss',
          ja: '挑発',
          cn: '挑衅',
          ko: '보스 도발',
        },
      },
    },
    {
      id: 'ByaEx Roar Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27F9', source: '하얀 제왕', capture: false }),
      run: (data) => {
        data.roarCount = (data.roarCount ?? 0) + 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27F9', source: '하얀 제왕', capture: false }),
      delaySeconds: 14,
      alarmText: (data, _matches, output) => {
        if (data.roarCount !== 2)
          return;

        if (data.role === 'tank')
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Tank LB NOW',
          de: 'JETZT Tank LB',
          fr: 'Transcendance Tank maintenant !',
          ja: '今タンクLB',
          cn: '坦克LB',
          ko: '탱리밋',
        },
      },
    },
    {
      id: 'ByaEx Bubble',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0065' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop bubble outside',
          de: 'Blase außen ablegen',
          fr: 'Déposez la bulle à l\'extérieur',
          ja: '外にマーカーを置く',
          cn: '边缘放点名',
          ko: '장판 바깥에 깔기',
        },
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '5C9' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pink bubble',
          de: 'Pinke Blase',
          fr: 'Bulle violette',
          ja: '祟り目',
          cn: '泡泡',
          ko: '핑크 구슬',
        },
      },
    },
    {
      id: 'ByaEx Puddle Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0004' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Puddles on YOU',
          de: 'Pfützen auf DIR',
          fr: 'Zones au sol sur VOUS',
          ja: '自分に床範囲',
          cn: '点名',
          ko: '장판 바깥에 깔기 (3번)',
        },
      },
    },
    {
      id: 'ByaEx G100',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get away',
          de: 'Weg da',
          fr: 'Éloignez-vous',
          ja: '離れる',
          cn: '远离',
          ko: '멀리가기',
        },
      },
    },
    {
      id: 'ByaEx Tiger Add',
      type: 'GameLog',
      netRegex: NetRegexes.dialog({ line: '[^:]*:Twofold is my wrath, twice-cursed my foes!.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: '[^:]*:Stürmt los, meine zwei Gesichter!.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: '[^:]*:Ma colère devient double.*?!.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '[^:]*:駆けろ、我が半身ッ！歯向かう者どもに、牙と爪を突き立ててやれ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '[^:]*:半身分离，助我杀敌！向胆敢抵抗的家伙们露出你的爪牙！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '[^:]*:달려라! 나의 반신이여! 맞서는 자들에게 이빨과 발톱을 찔러넣어라!.*?', capture: false }),
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tiger Add',
          de: 'Tiger Add',
          fr: 'Add Tigre',
          ja: '虎分離',
          cn: '虎分离',
          ko: '호랑이 쫄',
        },
      },
    },
    {
      id: 'ByaEx Stake Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27E2', source: '백호', capture: false }),
      run: (data) => {
        data.stakeCount = (data.stakeCount ?? 0) + 1;
      },
    },
    {
      id: 'ByaEx Stake Counter Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27E2', source: '백호', capture: false }),
      delaySeconds: 20,
      run: (data) => delete data.stakeCount,
    },
    {
      id: 'ByaEx Highest Stakes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '27E2', source: '백호', capture: false }),
      infoText: (data, _matches, output) => output.text!({ num: data.stakeCount }),
      outputStrings: {
        text: {
          en: 'Stack #${num}',
          de: 'Stack #${num}',
          fr: 'Packez-vous #${num}',
          ja: '頭割り #${num}',
          cn: '集合 #${num}',
          ko: '쉐어 #${num}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'All creation trembles before my might!': 'Himmel und Erde, erzittert!',
        'Byakko': 'Byakko',
        'Hakutei': 'Hakutei',
        'There is no turning back!': 'Mein Jagdtrieb ist erwacht!',
        'Twofold is my wrath, twice-cursed my foes!': 'Stürmt los, meine zwei Gesichter!',
      },
      'replaceText': {
        'Distant Clap': 'Donnergrollen',
        'Donut AOE': 'Donut AoE',
        'Fire And Lightning': 'Feuer und Blitz',
        'Hakutei Add': 'Hakutei Add',
        'Heavenly Strike': 'Himmlischer Schlag',
        'Highest Stakes': 'Höchstes Risiko',
        'Hundredfold Havoc': 'Hundertfache Verwüstung',
        'Line AOE': 'Linien AoE',
        'Ominous Wind': 'Unheilvoller Wind',
        'Orb Marker': 'Orb Marker',
        'Puddle Markers': 'Flächen Marker',
        'Roar Of Thunder': 'Brüllen Des Donners',
        'State Of Shock': 'Bannblitze',
        'Storm Pulse': 'Gewitterwelle',
        'Sweep The Leg': 'Vertikalität',
        'TP Orbs': 'TP Orbs',
        'Tiger Cleave': 'Tiger Cleave',
        'Unrelenting Anguish': 'Pandämonium',
        '--leap middle--': '--Sprung in die Mitte--',
        '--leap north--': '--Sprung nach Norden--',
        '--tiger lands--': '--Tiger landet--',
        '--tiger untargetable--': '--Tiger nicht anvisierbar--',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'All creation trembles before my might!': 'Tremblez devant mon pouvoir !',
        'Byakko': 'Byakko',
        'Hakutei': 'Hakutei',
        'There is no turning back!': 'Grrraaaah ! ... Trop tard pour les regrets !',
        'Twofold is my wrath, twice-cursed my foes!': 'Ma colère devient double !',
      },
      'replaceText': {
        '--leap middle--': '--saut au milieu--',
        '--leap north--': '--saut au nord--',
        '--tiger lands--': '--terres du tigre--',
        '--tiger untargetable--': '--tigre non ciblable--',
        'Distant Clap': 'Tonnerre lointain',
        'Donut AOE': 'AoE en donut',
        'Fire And Lightning': 'Feu et foudre',
        'Hakutei Add': 'Add Hakutei',
        'Heavenly Strike': 'Frappe céleste',
        'Highest Stakes': 'Tout pour le tout',
        'Hundredfold Havoc': 'Ravages centuples',
        'Line AOE': 'AoE en ligne',
        'Ominous Wind': 'Vent mauvais',
        'Orb Marker': 'Marqueur orbe',
        'Puddle Markers': 'Marqueurs zone au sol',
        'Roar Of Thunder': 'Rugissement du tonnerre',
        'State Of Shock': 'Foudroiement brutal',
        'Storm Pulse': 'Pulsion de tempête',
        'Sweep The Leg': 'Verticalité',
        'Tiger Cleave': 'Cleave Tigre',
        'TP Orbs': 'TP Orbes',
        'Unrelenting Anguish': 'Douleur continuelle',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'All creation trembles before my might!': '震天動地の力を、見せてやろうッ！',
        'Byakko': '白虎',
        'Hakutei': '白帝',
        'There is no turning back!': 'オオオオオ……この衝動、もはや止められん！',
      },
      'replaceText': {
        '--leap middle--': '--中央に飛ぶ--',
        '--leap north--': '--北に飛ぶ--',
        '--tiger lands--': '--白帝--',
        '--tiger untargetable--': '--白帝タゲ不可--',
        'Distant Clap': '遠雷',
        'Donut AOE': 'ボスと貼りつく',
        'Fire And Lightning': '雷火一閃',
        'Hakutei Add': '雑魚: 白帝',
        'Heavenly Strike': '天雷掌',
        'Highest Stakes': '乾坤一擲',
        'Hundredfold Havoc': '百雷繚乱',
        'Line AOE': '直線AoE',
        'Ominous Wind': '祟り風',
        'Orb Marker': 'Marqueur orbe',
        'Puddle Markers': '祟り目 外に安置',
        'Roar Of Thunder': '雷轟',
        'State Of Shock': '呪縛雷',
        'Storm Pulse': '風雷波動',
        'Sweep The Leg': '旋体脚',
        'Tiger Cleave': '白帝バスター',
        'TP Orbs': '玉',
        'Unrelenting Anguish': '無間地獄',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'All creation trembles before my might!': '世间万物皆因天惊地动而颤抖！',
        'Byakko': '白虎',
        'Hakutei': '白帝',
        'There is no turning back!': '我体内的冲动已无法抑制！',
      },
      'replaceText': {
        'Distant Clap': '远雷',
        'Donut AOE': '月环',
        'Fire And Lightning': '雷火一闪',
        'Hakutei Add': '白帝出现',
        'Heavenly Strike': '天雷掌',
        'Highest Stakes': '乾坤一掷',
        'Hundredfold Havoc': '百雷缭乱',
        'Line AOE': '直线AOE',
        'Ominous Wind': '妖风',
        'Orb Marker': '点名',
        'Puddle Markers': '点名',
        'Roar Of Thunder': '雷轰',
        'State Of Shock': '咒缚雷',
        'Storm Pulse': '风雷波动',
        'Sweep The Leg': '旋体脚',
        'TP Orbs': '撞球',
        'Tiger Cleave': '白帝爪',
        'Unrelenting Anguish': '无间地狱',
        'leap middle': '跳中间',
        'leap north': '跳北',
        'tiger lands': '白帝落地',
        'tiger untargetable': '白帝无法选中',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'All creation trembles before my might!': '천지를 뒤흔드는 힘을 보여주지!',
        'Byakko': '백호',
        'Hakutei': '하얀 제왕',
        'There is no turning back!': '오오오오오…… 이 충동, 더는 억누를 수 없다!',
      },
      'replaceText': {
        'Distant Clap': '원뢰',
        'Donut AOE': '도넛 장판',
        'Fire And Lightning': '뇌화일섬',
        'Add': '쫄',
        'Heavenly Strike': '천뢰장',
        'Highest Stakes': '건곤일척',
        'Hundredfold Havoc': '백뢰요란',
        'Line AOE': '직선 장판',
        'Ominous Wind': '불길한 바람',
        'Orb Marker': '장판 징',
        'Puddle Markers': '장판 징',
        'Roar Of Thunder': '뇌굉',
        'State Of Shock': '주박뢰',
        'Storm Pulse': '풍뢰파동',
        'Sweep The Leg': '돌려차기',
        'TP Orbs': '구슬',
        'Tiger Cleave': '호랑이 범위 탱버',
        'Unrelenting Anguish': '무간지옥',
        'leap middle': '보스 중앙으로 이동',
        'leap north': '보스 북쪽으로 이동',
        'tiger lands': '호랑이 착지',
        'tiger untargetable': '호랑이 타겟 불가',
      },
    },
  ],
};

export default triggerSet;
