import { targetIsYou } from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  anguish?: string[];
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheHeroesGauntlet,
  timelineFile: 'heroes_gauntlet.txt',
  triggers: [
    {
      id: 'Heroes Gauntlet Spectral Dream',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '4FCB', source: 'Spectral Thief' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4FCB', source: 'Phantom-Dieb' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4FCB', source: 'Voleur Spectral' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4FCB', source: '幻光のシーフ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '4FCB', source: '幻光盗贼' }),
      netRegexKo: NetRegexes.startsUsing({ id: '4FCB', source: '환상빛의 도적' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Heroes Gauntlet Spectral Gust',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Heroes Gauntlet Spectral Whirlwind',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '4FCC', source: 'Spectral Thief', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4FCC', source: 'Phantom-Dieb', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4FCC', source: 'Voleur Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4FCC', source: '幻光のシーフ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4FCC', source: '幻光盗贼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4FCC', source: '환상빛의 도적', capture: false }),
      response: Responses.aoe(),
    },
    {
      // Spectral Thief tethers to the locations where it will attack.
      id: 'Heroes Gauntlet Spectral Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '000C', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from tether marker',
          de: 'Weg von der Verbindung',
          fr: 'Éloignez-vous du marqueur lié',
          ja: '線から離れる',
          cn: '远离连线标志',
          ko: '이어진 표식으로부터 떨어지기',
        },
      },
    },
    {
      id: 'Heroes Gauntlet Spectral White Mage Absolute Protect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '524D', source: 'Spectral White Mage' }),
      netRegexDe: NetRegexes.startsUsing({ id: '524D', source: 'Phantom-Weißmagierin' }),
      netRegexFr: NetRegexes.startsUsing({ id: '524D', source: 'Mage Blanc Spectral' }),
      netRegexJa: NetRegexes.startsUsing({ id: '524D', source: '幻光の白魔道士' }),
      netRegexCn: NetRegexes.startsUsing({ id: '524D', source: '幻光白魔法师' }),
      netRegexKo: NetRegexes.startsUsing({ id: '524D', source: '환상빛의 백마도사' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Heroes Gauntlet Large Zombie Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '004F' }),
      condition: targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Heroes Gauntlet Twisted Touch',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '4F5E', source: 'Spectral Necromancer' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4F5E', source: 'Phantom-Nekromantin' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4F5E', source: 'Nécromancienne Spectrale' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4F5E', source: '幻光のネクロマンサー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '4F5E', source: '幻光亡灵法师' }),
      netRegexKo: NetRegexes.startsUsing({ id: '4F5E', source: '환상빛의 강령술사' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Heroes Gauntlet Chaos Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '4F60', source: 'Spectral Necromancer', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4F60', source: 'Phantom-Nekromantin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4F60', source: 'Nécromancienne Spectrale', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4F60', source: '幻光のネクロマンサー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4F60', source: '幻光亡灵法师', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4F60', source: '환상빛의 강령술사', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Heroes Gauntlet Beastly Fury',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '520C', source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '520C', source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '520C', source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '520C', source: '幻光のバーサーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '520C', source: '幻光狂战士', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '520C', source: '환상빛의 광전사', capture: false }),
      response: Responses.aoe(),
    },
    {
      // Both two and three uses of Slice can happen.
      id: 'Heroes Gauntlet Raging Slice',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['520A', '520B'], source: '幻光のバーサーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['520A', '520B'], source: '幻光狂战士', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['520A', '520B'], source: '환상빛의 광전사', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Heroes Gauntlet Wild Rampage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5206', source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5206', source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5206', source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5206', source: '幻光のバーサーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5206', source: '幻光狂战士', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5206', source: '환상빛의 광전사', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get in a crater',
          de: 'In den Krater gehen',
          fr: 'Allez dans un cratère',
          ja: '穴に入る',
          cn: '进入坑洞',
          ko: '구덩이에 들어가기',
        },
      },
    },
    {
      id: 'Heroes Gauntlet Wild Rage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: '幻光のバーサーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: '幻光狂战士', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: '환상빛의 광전사', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      // The same head marker is used for the initial player stack and the rock stacks.
      // If there's one stack marker, the players stack.
      // Otherwise they stack on the rock they drop.
      id: 'Heroes Gauntlet Wild Anguish Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      run: (data, matches) => {
        data.anguish ??= [];
        data.anguish.push(matches.target);
      },
    },
    {
      id: 'Heroes Gauntlet Wild Anguish Resolve',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      delaySeconds: 1,
      suppressSeconds: 5,
      alertText: (data, matches, output) => {
        if (data.anguish && data.anguish.length > 1)
          return output.stackOnYourRock!();

        if (matches.target === data.me)
          return output.stackOnYou!();

        return output.stackOn!({ player: data.ShortName(matches.target) });
      },
      run: (data) => delete data.anguish,
      outputStrings: {
        stackOnYourRock: {
          en: 'Stack on your rock',
          de: 'Auf deinem Stein sammeln',
          fr: 'Packez-vous avec votre rocher',
          ja: '自分の岩に貼りつく',
          cn: '与自己的石堆重合',
          ko: '돌과 같이 맞기',
        },
        stackOnYou: Outputs.stackOnYou,
        stackOn: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'Heroes Gauntlet Wild Anguish Spread',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '005E' }),
      condition: targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chicken Knife': 'Hühnermesserwurf',
        'Necrobomb': 'Nekrobomber',
        'Rubble': 'Trümmerhaufen',
        'Spectral Berserker': 'Phantom-Berserker',
        'Spectral Necromancer': 'Phantom-Nekromantin',
        'Spectral Thief': 'Phantom-Dieb',
        'Spectral White Mage': 'Phantom-Weißmagierin',
        'The Illuminated Plaza': 'Platz der Erleuchteten',
        'The Mount Argai Mines': 'Minen des Argai',
        'The Summer Ballroom': 'Ballsaal der Grasgrummel',
      },
      'replaceText': {
        'Absolute Dark II': 'Absolutes Negra',
        'Beastly Fury': 'Animalischer Zorn',
        'Chaos Storm': 'Chaossturm',
        'Chicken Knife': 'Hühnermesserwurf',
        'Coward\'s Cunning': 'Feiger Angriff',
        'Dark Deluge': 'Finsterwelle',
        '(?<!Shadow)Dash': 'Sprint',
        'Death Throes': 'Agonales Klammern',
        'Falling Rock': 'Steinschlag',
        'Necroburst': 'Nekro-Explosion',
        'Necromancy': 'Nekromantie',
        'Pain Mire': 'Schmerzmoor',
        'Papercutter': 'Tanzakugiri',
        'Raging Slice': 'Tobsüchtiger Sichelschnitt',
        'Shadowdash': 'Schattenspaltungssprint',
        'Spectral Dream': 'Phantom-Tripple',
        'Spectral Gust': 'Phantom-Böe',
        'Spectral Whirlwind': 'Phantom-Windhose',
        'Twisted Touch': 'Verseuchte Finger',
        'Vacuum Blade': 'Vakuum-Klinge',
        'Wild Anguish': 'Bestialischer Schmerz',
        'Wild Rage': 'Bestialischer Zorn',
        'Wild Rampage': 'Bestialische Raserei',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chicken Knife': 'Lancer de couteau de poltron',
        'Necrobomb': 'bombe nécrotique',
        'Rubble': 'tas de gravats',
        'Spectral Berserker': 'berserker spectral',
        'Spectral Necromancer': 'nécromancienne spectrale',
        'Spectral Thief': 'voleur spectral',
        'The Illuminated Plaza': 'Carré de l\'Aurore',
        'The Mount Argai Mines': 'Mines du mont Argai',
        'The Summer Ballroom': 'Bal des enfeuillés',
        'Spectral White Mage': 'mage blanc spectral',
      },
      'replaceText': {
        'Absolute Dark II': 'Extra Ténèbres absolues',
        'Beastly Fury': 'Bête en furie',
        'Chaos Storm': 'Tempête de chaos',
        'Chicken Knife': 'Lancer de couteau de poltron',
        'Coward\'s Cunning': 'Frappe en traître',
        'Dark Deluge': 'Vague noire',
        '(?<!Shadow)Dash': 'Élan',
        'Death Throes': 'Affres de la mort',
        'Falling Rock': 'Chute de pierre',
        'Necroburst': 'Salve nécrotique',
        'Necromancy': 'Nécromancie',
        'Pain Mire': 'Marécage de souffrance',
        'Papercutter': 'Julienne de chair',
        'Raging Slice': 'Déchiquetage enragé',
        'Shadowdash': 'Élan d\'ombre',
        'Spectral Dream': 'Troïka spectrale',
        'Spectral Gust': 'Bourrasque spectrale',
        'Spectral Whirlwind': 'Grand tourbillon spectral',
        'Twisted Touch': 'Toucher purulent',
        'Vacuum Blade': 'Lame de vide',
        'Wild Anguish': 'Soubresaut bestiale',
        'Wild Rage': 'Colère bestiale',
        'Wild Rampage': 'Rage bestiale',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chicken Knife': 'チキンナイフ投げ',
        'Necrobomb': 'ネクロボム',
        'Rubble': '瓦礫',
        'Spectral Berserker': '幻光のバーサーカー',
        'Spectral Necromancer': '幻光のネクロマンサー',
        'Spectral Thief': '幻光のシーフ',
        'The Illuminated Plaza': '大聖堂前広場',
        'The Mount Argai Mines': 'アルゲ鉱山',
        'The Summer Ballroom': '草人たちの踊り場',
        'Spectral White Mage': '幻光の白魔道士',
      },
      'replaceText': {
        'Absolute Dark II': 'アブソリュートダーラ',
        'Beastly Fury': 'ビーストフューリー',
        'Chaos Storm': 'カオスストーム',
        'Chicken Knife': 'チキンナイフ投げ',
        'Coward\'s Cunning': '臆病者の一撃',
        'Dark Deluge': '黒い波',
        '(?<!Shadow)Dash': 'ダッシュ',
        'Death Throes': '道連れ',
        'Falling Rock': '落石',
        'Necroburst': 'ネクロバースト',
        'Necromancy': 'ネクロマンシー',
        'Pain Mire': 'ペインボグ',
        'Papercutter': '短冊斬り',
        'Raging Slice': 'レイジングスライス',
        'Shadowdash': '分身ダッシュ',
        'Spectral Dream': '幻光三段',
        'Spectral Gust': '幻光旋風',
        'Spectral Whirlwind': '幻光大旋風',
        'Twisted Touch': '穢れた指先',
        'Vacuum Blade': '真空刃',
        'Wild Anguish': '獣魂の痛み',
        'Wild Rage': '獣魂の怒り',
        'Wild Rampage': '獣魂の猛り',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chicken Knife': '投掷弱鸡匕首',
        'Necrobomb': '亡灵爆弹',
        'Rubble': '瓦砾',
        'Spectral Berserker': '幻光狂战士',
        'Spectral Necromancer': '幻光亡灵法师',
        'Spectral Thief': '幻光盗贼',
        'The Illuminated Plaza': '大圣堂前广场',
        'The Mount Argai Mines': '阿尔格矿山',
        'The Summer Ballroom': '草人的舞场',
        'Spectral White Mage': '幻光白魔法师',
      },
      'replaceText': {
        'Absolute Dark II': '绝对昏暗',
        'Beastly Fury': '野兽之怒',
        'Chaos Storm': '混沌风暴',
        'Chicken Knife': '投掷弱鸡匕首',
        'Coward\'s Cunning': '胆小鬼的一击',
        'Dark Deluge': '黑浪',
        '(?<!Shadow)Dash': '冲刺',
        'Death Throes': '死亡引领',
        'Falling Rock': '落石',
        'Necroburst': '亡灵爆发',
        'Necromancy': '亡灵术',
        'Pain Mire': '苦痛酸沼',
        'Papercutter': '残片斩',
        'Raging Slice': '暴怒劈',
        'Shadowdash': '分身冲刺',
        'Spectral Dream': '幻光三段',
        'Spectral Gust': '幻光旋风',
        'Spectral Whirlwind': '幻光大旋风',
        'Twisted Touch': '污秽之指',
        'Vacuum Blade': '真空刃',
        'Wild Anguish': '兽魂的苦痛',
        'Wild Rage': '兽魂的愤怒',
        'Wild Rampage': '兽魂的勇猛',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chicken Knife': '치킨 나이프 던지기',
        'Necrobomb': '사령 폭탄',
        'Rubble': '잔해더미',
        'Spectral Berserker': '환상빛의 광전사',
        'Spectral Necromancer': '환상빛의 강령술사',
        'Spectral Thief': '환상빛의 도적',
        'The Illuminated Plaza': '대성당 앞 광장',
        'The Mount Argai Mines': '아르게 광산',
        'The Summer Ballroom': '풀인간의 무도회장',
        'Spectral White Mage': '환상빛의 백마도사',
      },
      'replaceText': {
        'Absolute Dark II': '앱솔루트 다라',
        'Beastly Fury': '짐승의 격분',
        'Chaos Storm': '혼돈의 폭풍',
        'Chicken Knife': '치킨 나이프 던지기',
        'Coward\'s Cunning': '겁쟁이의 일격',
        '(?<!Shadow)Dash': '달음질',
        'Dark Deluge': '검은 파도',
        'Death Throes': '물귀신 작전',
        'Falling Rock': '낙석',
        'Necroburst': '사령 폭발',
        'Necromancy': '강령술',
        'Pain Mire': '고통의 수렁',
        'Papercutter': '채썰기',
        'Raging Slice': '성난 베기',
        'Shadowdash': '분신 달음질',
        'Spectral Dream': '환광삼단',
        'Spectral Gust': '환광선풍',
        'Spectral Whirlwind': '환광대선풍',
        'Twisted Touch': '추악한 손길',
        'Vacuum Blade': '진공 베기',
        'Wild Anguish': '야수의 고통',
        'Wild Rage': '야수의 분노',
        'Wild Rampage': '야수의 격노',
      },
    },
  ],
};

export default triggerSet;
