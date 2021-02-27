import Conditions from '../../../../../resources/conditions.ts';
import NetRegexes from '../../../../../resources/netregexes.ts';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.SohmAlHard,
  timelineFile: 'sohm_al_hard.txt',
  timelineTriggers: [
    {
      id: 'Sohm Al Hard Wild Horn',
      regex: /Wild Horn/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role === 'tank' || data.role === 'healer';
      },
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      // The actual damage is 1C31, but the windup for the damage
      // occurs between 1C30 and 1C31.
      id: 'Sohm Al Hard Inflammable Fumes',
      netRegex: NetRegexes.ability({ id: '1C30', source: 'The Leightonward', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1C30', source: '莱顿瓦德', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1C30', source: 'Hortigolem', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1C30', source: 'Chortocyon', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1C30', source: 'レイトンワード', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '1C30', source: '레이튼워드', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Both the small and large Spore Sacs use Glorious Blaze.
      // However, it's not the same ability.
      id: 'Sohm Al Hard Glorious Blaze',
      netRegex: NetRegexes.startsUsing({ id: '1C32', source: 'Spore Sac', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C32', source: '孢囊', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C32', source: 'Sporensack', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C32', source: 'Sac de spores', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C32', source: 'スポアサック', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C32', source: '포자 주머니', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from large pod',
          de: 'Weg vom großen Pod',
          fr: 'Éloignez-vous des spores',
          ja: 'スポアサックから離れる',
          cn: '远离大孢囊',
          ko: '큰 포자 주머니에게서 떨어지기',
        },
      },
    },
    {
      // The actual effect being checked here is Heavy.
      id: 'Sohm Al Hard Excretion',
      netRegex: NetRegexes.gainsEffect({ effectId: '0E' }),
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: function(data, matches, output) {
        return output.text({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Cleanse ${player}',
          de: 'Reinige ${player}',
          fr: 'Guérison sur ${player}',
          ja: 'エスナ：${player}',
          cn: '康复${player}',
          ko: '"${player}" 에스나',
        },
      },
    },
    {
      // Inflicts Incoming Healing Down.
      // If used while Gowrow is empowered,
      // leaves a tornado at the target location on completion.
      id: 'Sohm Al Hard Ripper Claw',
      netRegex: NetRegexes.startsUsing({ id: '1C37', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C37', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C37', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C37', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C37', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C37', source: '가우로우', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Inflicts Incoming Healing Down.
      // This ability is used only if there is a party member in range behind Gowrow
      // AND if Gowrow is not empowered.
      id: 'Sohm Al Hard Tail Smash',
      netRegex: NetRegexes.startsUsing({ id: '1C35', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C35', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C35', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C35', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C35', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C35', source: '가우로우', capture: false }),
      response: Responses.goFrontOrSides(),
    },
    {
      // Inflicts Incoming Healing Down.
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Tail Swing',
      netRegex: NetRegexes.startsUsing({ id: '1C36', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C36', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C36', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C36', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C36', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C36', source: '가우로우', capture: false }),
      response: Responses.getOut(),
    },
    {
      // Used only if Gowrow is not empowered.
      id: 'Sohm Al Hard Wild Charge',
      netRegex: NetRegexes.startsUsing({ id: '1C39', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C39', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C39', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C39', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C39', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C39', source: '가우로우', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Hot Charge',
      netRegex: NetRegexes.startsUsing({ id: '1C3A', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3A', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3A', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3A', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3A', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C3A', source: '가우로우', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is not empowered.
      id: 'Sohm Al Hard Fireball',
      netRegex: NetRegexes.startsUsing({ id: '1C3B', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3B', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3B', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3B', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3B', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C3B', source: '가우로우', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Lava Flow',
      netRegex: NetRegexes.startsUsing({ id: '1C3C', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3C', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3C', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3C', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3C', source: '高牢怪龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C3C', source: '가우로우', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // This cast is accompanied by a 0017 head marker on the target.
      // We use the cast line for this trigger because the timing is the same.
      id: 'Sohm Al Hard Flying Press',
      netRegex: NetRegexes.startsUsing({ id: '1C3E', source: 'Lava Scorpion' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3E', source: 'Lavaskorpion' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3E', source: 'scorpion de lave' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3E', source: 'ラーヴァ・スコーピオン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3E', source: '熔岩蝎' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C3E', source: '용암 전갈' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop puddle outside',
          de: 'Fläche draußen ablegen',
          fr: 'Déposez la zone au sol à l\'extérieur',
          ja: '外周に置く',
          cn: '人群外放圈圈',
          ko: '용암지대 생성 대상자',
        },
      },
    },
    {
      id: 'Sohm Al Hard Deadly Thrust',
      netRegex: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['Lava Scorpion', 'The Scorpion\'s Tail'] }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['Lavaskorpion', 'Schwanzskorpion'] }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['scorpion de lave', 'queue du scorpion'] }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['ラーヴァ・スコーピオン', 'テイル・スコーピオン'] }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['熔岩蝎', '尖尾蝎'] }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['용암 전갈', '꼬리 전갈'] }),
      condition: function(data, matches) {
        return data.me === matches.target || data.role === 'tank' || data.role === 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Sohm Al Hard Hiss',
      netRegex: NetRegexes.startsUsing({ id: '1C45', source: 'Lava Scorpion', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C45', source: 'Lavaskorpion', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C45', source: 'scorpion de lave', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C45', source: 'ラーヴァ・スコーピオン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C45', source: '熔岩蝎', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1C45', source: '용암 전갈', capture: false }),
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Wound': 'Wunde',
        'The Lava Tube': 'Lavagrotte',
        'The Leightonward': 'Hortigolem',
        'Small Spore Sac': 'klein(?:e|er|es|en) Sporensack',
        'Lava Scorpion': 'Lavaskorpion',
      },
      'replaceText': {
        'Wild Horn': 'Wildes Horn',
        'Spore Sac': 'Sporensack',
        'Realm Shaker': 'Erderschütterer',
        'Molten Silk': 'Geschmolzene Seide',
        'Inflammable Fumes': 'Entzündliches Gas',
        'Hiss': 'Zischen',
        'Glorious Blaze': 'Zündung',
        'Flying Press': 'Flugdruck',
        'Excretion': 'Schleim',
        'Deadly Thrust': 'Tödliche Durchbohrung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Wound': 'La Plaie',
        'The Lava Tube': 'Tunnel de lave',
        'The Leightonward': 'Chortocyon',
        'Small Spore Sac': 'petit sac de spores',
        'Lava Scorpion': 'scorpion de lave',
      },
      'replaceText': {
        '\\(Back\\)': '(Derrière)',
        '\\(Front\\)': '(Devant)',
        '\\(Readies\\)': '(Préparation)',
        '\\(Ring\\)': '(Anneau)',
        'Wild Horn': 'Corne sauvage',
        'Spore Sac': 'Sac de spores',
        'Realm Shaker': 'Secousse tellurique',
        'Molten Silk': 'Soie en fusion',
        'Inflammable Fumes': 'Gaz inflammable',
        'Hiss': 'Sifflet',
        'Glorious Blaze': 'Embrasement',
        'Flying Press': 'Aplatissement',
        'Excretion': 'Mucus',
        'Deadly Thrust': 'Transpercement mortel',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Wound': '霊峰の傷',
        'The Lava Tube': '大溶岩窟',
        'The Leightonward': 'レイトンワード',
        'Small Spore Sac': 'スモール・スポアサック',
        'Lava Scorpion': 'ラーヴァ・スコーピオン',
      },
      'replaceText': {
        '\\(Adds x2\\)': '(2つ 雑魚)',
        '\\(Adds x4\\)': '(4つ 雑魚)',
        '\\(Back\\)': '(後ろ)',
        '\\(Front\\)': '(前)',
        '\\(Readies\\)': '(構え)',
        '\\(Ring\\)': '(輪)',
        'Wild Horn': 'ワイルドホーン',
        'Spore Sac': 'スポアサック',
        'Realm Shaker': 'レルムシェーカー',
        'Molten Silk': 'モルテンシルク',
        'Inflammable Fumes': '可燃性ガス',
        'Hiss': '呼び寄せ',
        'Glorious Blaze': '引火',
        'Flying Press': 'フライングプレス',
        'Excretion': '粘液',
        'Deadly Thrust': 'デッドリースラスト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Wound': '灵伤',
        'The Lava Tube': '大熔岩窟',
        'The Leightonward': '莱顿瓦德',
        'Small Spore Sac': '小型孢囊',
        'Lava Scorpion': '熔岩蝎',
      },
      'replaceText': {
        '\\(Adds x2\\)': '(小怪x2)',
        '\\(Adds x4\\)': '(小怪x4)',
        '\\(Back\\)': '(后)',
        '\\(Front\\)': '(前)',
        '\\(Readies\\)': '(准备)',
        '\\(Ring\\)': '(月环)',
        'Wild Horn': '野性利角',
        'Spore Sac': '孢囊',
        'Realm Shaker': '震撼领域',
        'Molten Silk': '炎丝喷射',
        'Inflammable Fumes': '可燃性气体',
        'Hiss': '呼唤',
        'Glorious Blaze': '引火',
        'Flying Press': '飞跃重压',
        'Excretion': '粘液',
        'Deadly Thrust': '致命尾刺',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Wound': '영봉의 상처',
        'The Lava Tube': '대용암굴',
        'The Leightonward': '레이튼워드',
        'Small Spore Sac': '작은 포자 주머니',
        'Lava Scorpion': '용암 전갈',
      },
      'replaceText': {
        'Wild Horn': '사나운 뿔',
        'Spore Sac': '포자 주머니',
        'Realm Shaker': '파멸 영역',
        'Molten Silk': '용암 분사',
        'Inflammable Fumes': '가연성 가스',
        'Hiss': '불러내기',
        'Glorious Blaze': '불붙이기',
        'Flying Press': '도약 내리찍기',
        'Excretion': '점액',
        'Deadly Thrust': '치명적 일격',
      },
    },
  ],
};
