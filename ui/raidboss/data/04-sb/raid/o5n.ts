import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// O5N - Sigmascape 1.0 Normal
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV10,
  timelineFile: 'o5n.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'O5N Stop Combat',
      type: 'RemovedCombatant',
      netRegex: { name: 'Phantom Train', capture: false },
      run: (data) => data.StopCombat(),
    },
    {
      id: 'O5N Acid Rain',
      type: 'StartsUsing',
      netRegex: { source: 'Phantom Train', id: '28BB', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'O5N Doom Strike',
      type: 'StartsUsing',
      netRegex: { source: 'Phantom Train', id: '28A3' },
      response: Responses.tankBuster(),
    },
    {
      id: 'O5N Head On',
      type: 'StartsUsing',
      netRegex: { id: '28A4', source: 'Phantom Train', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'O5N Diabolic Headlamp',
      type: 'StartsUsing',
      netRegex: { id: '28A6', source: 'Phantom Train', capture: false },
      response: Responses.stackMiddle(),
    },
    {
      id: 'O5N Ghost Tether',
      type: 'Tether',
      netRegex: { id: '0001' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait ghost into light circle',
          de: 'Geist in das Licht ködern',
          fr: 'Attirez le fantôme dans la lumière',
          cn: '诱导幽灵进光圈',
          ko: '유령 빛장판으로 유도',
        },
      },
    },
    {
      id: 'O5N Diabolic Light',
      type: 'HeadMarker',
      netRegex: { id: '0001' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Marker Away',
          de: 'Licht am Rand ablegen',
          fr: 'Déposez la marque au loin',
          ja: '魔界の光', // FIXME
          cn: '远离放置光点名',
          ko: '빛장판 유도',
        },
      },
    },
    {
      id: 'O5N Diabolic Wind',
      type: 'HeadMarker',
      netRegex: { id: '0046' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'O5N Throttle',
      type: 'GainsEffect',
      netRegex: { effectId: '3AA' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Touch ghost',
          de: 'Geist berühren',
          fr: 'Touchez le fantôme',
          cn: '撞幽灵',
          ko: '유령 접촉',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Phantom Train': 'Phantomzug',
        'Wroth Ghost': 'erzürnt(?:e|er|es|en) Geist',
      },
      'replaceText': {
        'Acid Rain': 'Säureregen',
        'Add Wave': 'Add Welle',
        'Crossing Whistle': 'Kreuzend Pfeife',
        'Diabolic Chimney': 'Diabolischer Schlot',
        'Diabolic Headlamp': 'Diabolische Leuchte',
        'Diabolic Light': 'Diabolisches Licht',
        'Diabolic Wind': 'Diabolischer Wind',
        'Doom Strike': 'Vernichtungsschlag',
        'Encumber': 'Wegsperrung',
        'Ghost Beams': 'Geisterstrahlen',
        'Ghosts': 'Geister',
        'Head On': 'Frontalangriff',
        'Saintly Beam': 'Heiligenstrahl',
        'Tether Whistle': 'Verfolger Pfeife',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Phantom Train': 'train fantôme',
        'Wroth Ghost': 'fantôme furieux',
      },
      'replaceText': {
        'Acid Rain': 'Pluie acide',
        'Add Wave': 'Vague d\'adds',
        'Crossing Whistle': 'Sifflet traversée',
        'Diabolic Chimney': 'Cheminée diabolique',
        'Diabolic Headlamp': 'Phare diabolique',
        'Diabolic Light': 'Lueur diabolique',
        'Diabolic Wind': 'Vent diabolique',
        'Doom Strike': 'Frappe létale',
        'Encumber': 'Encombrement',
        'Ghost Beams': 'Faisceaux Sacrés',
        'Ghosts': 'Fantômes',
        'Head On': 'Plein fouet',
        'Saintly Beam': 'Faisceaux sacrés',
        'Tether Whistle': 'Liens sifflet',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Phantom Train': '魔列車',
        'Wroth Ghost': 'ロスゴースト',
      },
      'replaceText': {
        'Acid Rain': '酸性雨',
        'Add Wave': '雑魚いっぱい',
        'Crossing Whistle': '魔界の汽笛: 通路ゴースト',
        'Diabolic Chimney': '魔界の噴煙',
        'Diabolic Headlamp': '魔界の前照灯',
        'Diabolic Light': '魔界の光',
        'Diabolic Wind': '魔界の風',
        'Doom Strike': '魔霊撃',
        'Encumber': '進路妨害',
        'Ghost Beams': 'ゴーストビーム',
        'Ghosts': 'ゴースト',
        'Head On': '追突',
        'Saintly Beam': 'セイントビーム',
        'Tether Whistle': '魔界の汽笛: 線繋ぐゴースト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Phantom Train': '魔列车',
        'Wroth Ghost': '怒灵',
      },
      'replaceText': {
        'Acid Rain': '酸雨',
        'Add Wave': '一波小怪',
        'Crossing Whistle': '交叉汽笛',
        'Diabolic Chimney': '魔界喷烟',
        'Diabolic Headlamp': '魔界前照灯',
        'Diabolic Light': '魔界光',
        'Diabolic Wind': '魔界风',
        'Doom Strike': '魔灵击',
        'Encumber': '挡路',
        'Ghost Beams': '幽灵出现',
        'Ghosts': '幽灵',
        'Head On': '追尾',
        'Saintly Beam': '圣光射线',
        'Tether Whistle': '连线汽笛',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Phantom Train': '마열차',
        'Wroth Ghost': '격노하는 유령',
      },
      'replaceText': {
        'Acid Rain': '산성비',
        'Add Wave': '쫄 등장',
        'Crossing Whistle': '행진 유령',
        'Diabolic Chimney': '마계의 연기',
        'Diabolic Headlamp': '마계의 전조등',
        'Diabolic Light': '마계의 빛',
        'Diabolic Wind': '마계의 바람',
        'Doom Strike': '마령격',
        'Encumber': '진로 방해',
        'Head On': '추돌',
        'Saintly Beam': '성스러운 광선',
        'Ghost Beams': '유령 빛 장판',
        'Ghosts': '유령',
        'Tether Whistle': '선 연결 유령',
      },
    },
  ],
};

export default triggerSet;
