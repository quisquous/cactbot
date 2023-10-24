import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  calledWildSpeed?: boolean;
  calledUseCannon?: boolean;
}
const triggerSet: TriggerSet<Data> = {
  id: 'CastrumAbania6363',
  zoneId: ZoneId.CastrumAbania63,
  timelineFile: 'castrum_abania63.txt',
  triggers: [
    {
      id: 'CastrumAbania63 Magna Roader Fire III',
      type: 'StartsUsing',
      netRegex: { source: 'Magna Roader', id: '1F16', capture: false },
      response: Responses.aoe(),
      run: (data) => data.calledWildSpeed = data.calledUseCannon = false,
    },
    {
      id: 'CastrumAbania63 Magna Roader Wild Speed',
      type: 'StartsUsing',
      netRegex: { source: 'Magna Roader', id: '207E', capture: false },
      // This repeats indefinitely, so only call the first one per Wild Speed phase.
      condition: (data) => !data.calledWildSpeed,
      delaySeconds: 6,
      response: Responses.killAdds(),
      run: (data) => data.calledWildSpeed = true,
    },
    {
      id: 'CastrumAbania63 Magna Roader Mark XLIII Mini Cannon',
      type: 'NameToggle',
      netRegex: { name: 'Mark XLIII Mini Cannon', toggle: '01', capture: false },
      // There's two cannons, so only say something when the first one is targetable.
      condition: (data) => !data.calledUseCannon,
      delaySeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.calledUseCannon = true,
      outputStrings: {
        text: {
          en: 'Fire cannon at boss',
          de: 'Feuere Kanonen auf den Boss',
          fr: 'Tirez le canon sur le boss',
          cn: '用炮射BOSS',
          ko: '보스 파동탄 맞추기',
        },
      },
    },
    {
      id: 'CastrumAbania63 Number XXIV Stab',
      type: 'StartsUsing',
      netRegex: { source: 'Number XXIV', id: '1F1B' },
      response: Responses.tankBuster(),
    },
    {
      id: 'CastrumAbania63 Number XXIV Barrier Shift Fire',
      type: 'StartsUsing',
      netRegex: { source: 'Number XXIV', id: '1F21', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Fire Buff',
          de: 'Nimm Feuer Buff',
          fr: 'Prenez le buff de Feu',
          cn: '去火BUFF',
          ko: '화염 속성 버프 얻기',
        },
      },
    },
    {
      id: 'CastrumAbania63 Number XXIV Barrier Shift Ice',
      type: 'StartsUsing',
      netRegex: { source: 'Number XXIV', id: '1F22', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Ice Buff',
          de: 'Nimm Eis Buff',
          fr: 'Prenez le buff de Glace',
          cn: '去冰BUFF',
          ko: '빙결 속성 버프 얻기',
        },
      },
    },
    {
      id: 'CastrumAbania63 Number XXIV Barrier Shift Lightning',
      type: 'StartsUsing',
      netRegex: { source: 'Number XXIV', id: '1F23', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Lightning Buff',
          de: 'Nimm Blitz Buff',
          fr: 'Prenez le buff d\'Éclair',
          cn: '去雷BUFF',
          ko: '뇌격 속성 버프 얻기',
        },
      },
    },
    {
      id: 'CastrumAbania63 Inferno Ketu Slash',
      type: 'StartsUsing',
      netRegex: { source: 'Inferno', id: ['1F26', '208B', '208C'] },
      response: Responses.tankBuster(),
    },
    {
      id: 'CastrumAbania63 Inferno Adds',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '6270', capture: false },
      response: Responses.killAdds(),
    },
    {
      id: 'CastrumAbania63 Inferno Rahu Ray',
      type: 'HeadMarker',
      netRegex: { id: '004A' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'CastrumAbania63 Inferno Rahu Comet',
      type: 'StartsUsing',
      // Rahu Comet (1F2B) does not do knockback until it has been empowered at least once.
      netRegex: { source: 'Inferno', id: ['2088', '2089'], capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // Knockback comes from the proximity marker, not the boss.
          en: 'Small comet knockback',
          de: 'Kleiner Kometenrückstoß',
          fr: 'Poussée de la petite comète',
          cn: '小彗星击退',
          ko: '작은 혜성 넉백',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Inferno': 'Inferno',
        'Magna Roader': 'Magna Rotula',
        'Mark XLIII Mini Cannon': 'Kleingeschütz Xliii',
        'Number XXIV': 'Nummer XXIV',
        'Project Aegis': 'Projekt Aegis',
        'Terrestrial Weaponry': 'Bodenwaffenentwicklung',
        'The Assessment Grounds': 'Evaluationsgelände',
      },
      'replaceText': {
        '--adds--': '--Adds--',
        'Barrier Shift': 'Barrierewechsel',
        'Gale Cut': 'Sturmschnitt',
        'Ketu & Rahu': 'Ketoh & Rahu',
        'Ketu Cut': 'Ketoh-Schnitt',
        'Ketu Slash': 'Ketoh-Hieb',
        'Magitek Fire II(?!I)': 'Magitek-Feura',
        'Magitek Fire III': 'Magitek-Feuga',
        'Rahu Blaster': 'Rahu-Blaster',
        'Rahu Cut': 'Rahu-Schnitt',
        'Stab': 'Durchstoß',
        'Towers': 'Türme',
        'Wheel': 'Rad',
        'Wild Speed': 'Heißlaufen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Inferno': 'Inferno',
        'Magna Roader': 'magna rouleur magitek',
        'Mark XLIII Mini Cannon': 'Mortier Type Xliii',
        'Number XXIV': 'Numéro XXIV',
        'Project Aegis': 'Projet Aegis',
        'Terrestrial Weaponry': 'Armement terrestre',
        'The Assessment Grounds': 'Terrain d\'évaluation',
      },
      'replaceText': {
        '--adds--': '--adds--',
        'Barrier Shift': 'Change-Barrière',
        'Gale Cut': 'Chute de pointes',
        'Ketu & Rahu': 'Ketu et Rahu',
        'Ketu Cut': 'Dépassement Ketu',
        'Ketu Slash': 'Taillade Ketu',
        'Magitek Fire II(?!I)': 'Extra Feu magitek',
        'Magitek Fire III': 'Méga Feu magitek',
        'Rahu Blaster': 'Canon Rahu',
        'Rahu Cut': 'Dépassement Rahu',
        'Stab': 'Poignardage',
        'Towers': 'Tours',
        'Wheel': 'Roue',
        'Wild Speed': 'Course folle',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Inferno': 'インフェルノ',
        'Magna Roader': '魔導マグナローダー',
        'Mark XLIII Mini Cannon': 'Xliii式小臼砲',
        'Number XXIV': 'ナンバーXXIV',
        'Project Aegis': '強化実験房',
        'Terrestrial Weaponry': '陸戦兵器開発房',
        'The Assessment Grounds': '性能試験場',
      },
      'replaceText': {
        'Barrier Shift': 'バリアチェンジ',
        'Gale Cut': '烈風殺',
        'Ketu & Rahu': 'ケトゥ＆ラフ',
        'Ketu Cut': 'ケトゥ・リミッターカット',
        'Ketu Slash': 'ケトゥ・スラッシュ',
        'Magitek Fire II(?!I)': '魔導ファイラ',
        'Magitek Fire III': '魔導ファイガ',
        'Rahu Blaster': 'ラフ・ブラスター',
        'Rahu Cut': 'ラフ・リミッターカット',
        'Stab': '刺突',
        'Wheel': 'ホイール',
        'Wild Speed': '暴走',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Inferno': '炼狱炎魔',
        'Magna Roader': '魔导机车大魔',
        'Mark XLIII Mini Cannon': '43式小迫击炮',
        'Number XXIV': '024号',
        'Project Aegis': '强化实验室',
        'Terrestrial Weaponry': '陆战兵器开发室',
        'The Assessment Grounds': '性能试验场',
      },
      'replaceText': {
        '--adds--': '--小怪--',
        'Barrier Shift': '护盾转换',
        'Gale Cut': '烈风杀',
        'Ketu & Rahu': '罗睺计都',
        'Ketu Cut': '计都限制器减档',
        'Ketu Slash': '计都挥',
        'Magitek Fire II(?!I)': '魔导烈炎',
        'Magitek Fire III': '魔导爆炎',
        'Rahu Blaster': '罗睺冲击波',
        'Rahu Cut': '罗睺限制器减档',
        'Stab': '突刺',
        'Towers': '塔',
        'Wheel': '车轮',
        'Wild Speed': '猛冲',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Inferno': '인페르노',
        'Magna Roader': '마도 마그나로더',
        'Mark XLIII Mini Cannon': 'Xliii식 소형 박격포',
        'Number XXIV': 'XXIV호',
        'Project Aegis': '강화실험실',
        'Terrestrial Weaponry': '지상 병기 개발실',
        'The Assessment Grounds': '성능 시험장',
      },
      'replaceText': {
        '--adds--': '--쫄--',
        'Barrier Shift': '보호막 변환',
        'Gale Cut': '열풍살',
        'Ketu & Rahu': '케투와 라후',
        'Ketu Cut': '케투 리미터 해제',
        'Ketu Slash': '케투 난도질',
        'Magitek Fire II(?!I)': '마도 파이라',
        'Magitek Fire III': '마도 파이가',
        'Rahu Blaster': '라후 폭파',
        'Rahu Cut': '라후 리미터 해제',
        'Stab': '찌르기',
        'Towers': '기둥',
        'Wheel': '바퀴',
        'Wild Speed': '폭주',
      },
    },
  ],
};

export default triggerSet;
