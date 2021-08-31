import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheCuffOfTheSon,
  timelineFile: 'a6n.txt',
  timelineTriggers: [
    {
      id: 'A6N Mind Blast',
      regex: /Mind Blast/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // The busters are often enough and mild enough to be not worth notifying for Feint/Addle.
      id: 'A6N Brute Force',
      regex: /Brute Force/,
      beforeSeconds: 4,
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      response: Responses.miniBuster(),
    },
    {
      id: 'A6N Magicked Mark',
      regex: /Magicked Mark/,
      beforeSeconds: 4,
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'A6N Minefield',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster', id: '170D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster', id: '170D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fracasseur', id: '170D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター', id: '170D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者', id: '170D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자', id: '170D', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.avoidMines!(),
      outputStrings: {
        avoidMines: {
          en: 'Avoid Mines',
          de: 'Mienen vermeiden',
          fr: 'Évitez les mines',
          ja: '地雷を踏まない',
          cn: '躲开地雷',
          ko: '지뢰 피하기',
        },
      },
    },
    {
      id: 'A6N Supercharge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster Mirage', id: '1713', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster-Replikant', id: '1713', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '1713', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '1713', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者幻象', id: '1713', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자의 환영', id: '1713', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dodge Mirage Charge',
          de: 'Superladung ausweichen',
          fr: 'Esquivez la charge de la réplique',
          ja: 'スーパーチャージを避ける',
          cn: '躲开冲锋',
          ko: '환영 돌진 피하기',
        },
      },
    },
    {
      id: 'A6N Low Arithmeticks',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FD' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go High',
          de: 'Geh Hoch',
          fr: 'Allez en haut',
          ja: '高い床に乗る',
          cn: '上高台',
          ko: '높은곳으로',
        },
      },
    },
    {
      id: 'A6N High Arithmeticks',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FE' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Low',
          de: 'Geh Runter',
          fr: 'Allez en bas',
          ja: '低い床に乗る',
          cn: '下低台',
          ko: '낮은곳으로',
        },
      },
    },
    {
      id: 'A6N Bio-arithmeticks',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Swindler', id: '171F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schwindler', id: '171F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arnaqueur', id: '171F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スウィンドラー', id: '171F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '欺诈者', id: '171F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조작자', id: '171F', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'A6N Enumeration',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['0040', '0041', '0042'] }),
      infoText: (data, matches, output) => {
        // 0040 = 2, 0041 = 3, 0042 = 4
        const count = 2 + parseInt(matches.id, 16) - parseInt('0040', 16);
        return output.text!({ player: data.ShortName(matches.target), count: count });
      },
      outputStrings: {
        text: {
          en: '${player}: ${count}',
          de: '${player}: ${count}',
          fr: '${player}: ${count}',
          ja: '${player}: ${count}',
          cn: '${player}生命计算法: ${count}',
          ko: '${player}: ${count}',
        },
      },
    },
    {
      id: 'A6N Super Cyclone',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Vortexer', id: '1728', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Wirbler', id: '1728', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Tourbillonneur', id: '1728', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボルテッカー', id: '1728', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '环旋者', id: '1728', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '교반자', id: '1728', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'A6N Ultra Flash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Vortexer', id: '1722', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Wirbler', id: '1722', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Tourbillonneur', id: '1722', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボルテッカー', id: '1722', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '环旋者', id: '1722', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '교반자', id: '1722', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Ice',
          de: 'Hinter dem Eis verstecken',
          fr: 'Cachez-vous derrière la glace',
          ja: '氷柱の後ろに',
          cn: '躲在冰柱之后',
          ko: '얼음 뒤에 숨기',
        },
      },
    },
    {
      id: 'A6N Ice Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0043' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ice: Freeze Tornado',
          de: 'Eis: Tornado einfrieren',
          fr: 'Glace : Gelez la tornade',
          ja: '氷柱: 竜巻を凍結',
          cn: '冰柱: 冻结龙卷风',
          ko: '얼음: 물기둥 얼리기',
        },
      },
    },
    {
      id: 'A6N Compressed Water Initial',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Water on YOU',
          de: 'Wasser auf DIR',
          fr: 'Eau sur VOUS',
          ja: '自分に水',
          cn: '水点名',
          ko: '물징 대상자',
        },
      },
    },
    {
      id: 'A6N Compressed Water Explode',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Drop Water Soon',
          de: 'Gleich Wasser ablegen',
          fr: 'Déposez l\'eau bientôt',
          ja: '水来るよ',
          cn: '马上水分摊',
          ko: '곧 물징 폭발',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Single Buster/Double Buster/Rocket Drill': 'Buster/Drill',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Blaster(?! Mirage)': 'Blaster',
        'Blaster Mirage': 'Blaster-Replikant',
        'Brawler': 'Blechbrecher',
        'Machinery Bay 67': 'Kampfmaschinen-Baracke 67',
        'Machinery Bay 68': 'Kampfmaschinen-Baracke 68',
        'Machinery Bay 69': 'Kampfmaschinen-Baracke 69',
        'Machinery Bay 70': 'Kampfmaschinen-Baracke 70',
        'Swindler': 'Schwindler',
        'Vortexer': 'Wirbler',
      },
      'replaceText': {
        '--unseal--': '--öffnen--',
        'Attachment': 'Anlegen',
        'Ballistic Missile': 'Ballistische Rakete',
        'Bio-Arithmeticks': 'Biomathematik',
        'Brute Force': 'Brutaler Schlag',
        'Crashing Wave': 'Brechende Welle',
        'Earth Missile': 'Erd-Geschoss',
        'Elemental Jammer': 'Elementarstörer',
        'Enumeration': 'Zählen',
        'Height': 'Nivellierung',
        'Ice Missile': 'Eisgeschoss',
        'Magicked Mark': 'Magiegeschoss',
        'Mind Blast': 'Geiststoß',
        'Mirage': 'Illusion',
        'Super Cyclone': 'Superzyklon',
        'Ultra Flash': 'Ultrablitz',
        'Minefield': 'Minenfeld',
        'Supercharge': 'Superladung',
        'Single Buster': 'Einzelsprenger',
        'Double Buster': 'Doppelsprenger',
        'Rocket Drill': 'Raketenbohrer',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Blaster(?! Mirage)': 'Fracasseur',
        'Blaster Mirage': 'réplique du Fracasseur',
        'Brawler': 'Bagarreur',
        'Machinery Bay 67': 'Hangar d\'armement HA-67',
        'Machinery Bay 68': 'Hangar d\'armement HA-68',
        'Machinery Bay 69': 'Hangar d\'armement HA-69',
        'Machinery Bay 70': 'Hangar d\'armement HA-70',
        'Swindler': 'Arnaqueur',
        'Vortexer': 'Tourbillonneur',
      },
      'replaceText': {
        '--unseal--': '--descellement--',
        'Attachment': 'Extension',
        'Ballistic Missile': 'Missiles balistiques',
        'Bio-Arithmeticks': 'Biomathématiques',
        'Brute Force': 'Force brute',
        'Crashing Wave': 'Vague percutante',
        'Earth Missile': 'Missile de terre',
        'Elemental Jammer': 'Grippage élémentaire',
        'Enumeration': 'Compte',
        'Height': 'Dénivellation',
        'Ice Missile': 'Missile de glace',
        'Magicked Mark': 'Tir magique',
        'Mind Blast': 'Explosion mentale',
        'Mirage': 'Mirage',
        'Super Cyclone': 'Super cyclone',
        'Ultra Flash': 'Ultraflash',
        'Minefield': 'Champ de mines',
        'Supercharge': 'Super charge',
        'Single Buster': 'Pulsoréacteur',
        'Double Buster': 'Double pulsoréacteur',
        'Rocket Drill': 'Roquette-foreuse',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Blaster(?! Mirage)': 'ブラスター',
        'Blaster Mirage': 'ブラスター・ミラージュ',
        'Brawler': 'ブロウラー',
        'Machinery Bay 67': '第67機工兵格納庫',
        'Machinery Bay 68': '第68機工兵格納庫',
        'Machinery Bay 69': '第69機工兵格納庫',
        'Machinery Bay 70': '第70機工兵格納庫',
        'Swindler': 'スウィンドラー',
        'Vortexer': 'ボルテッカー',
      },
      'replaceText': {
        '--unseal--': '--エリア開放--',
        'Attachment': 'アタッチメント',
        'Ballistic Missile': 'ミサイル発射',
        'Bio-Arithmeticks': '生命計算術',
        'Brute Force': 'ブルートパンチ',
        'Crashing Wave': 'クラッシュウェーブ',
        'Earth Missile': 'アースミサイル',
        'Elemental Jammer': 'エレメンタルジャミング',
        'Enumeration': 'カウント',
        'Height': 'ハイト',
        'Ice Missile': 'アイスミサイル',
        'Magicked Mark': 'マジックショット',
        'Mind Blast': 'マインドブラスト',
        'Mirage': 'ミラージュシステム',
        'Super Cyclone': 'スーパーサイクロン',
        'Ultra Flash': 'ウルトラフラッシュ',
        'Minefield': '地雷散布',
        'Supercharge': 'スーパーチャージ',
        'Single Buster': 'バスターアタック',
        'Double Buster': 'ダブルバスターアタック',
        'Rocket Drill': 'ロケットドリル',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Blaster(?! Mirage)': '冲击波',
        'Blaster Mirage': '爆破者幻象',
        'Brawler': '争斗者',
        'Machinery Bay 67': '第67机工兵仓库',
        'Machinery Bay 68': '第68机工兵仓库',
        'Machinery Bay 69': '第69机工兵仓库',
        'Machinery Bay 70': '第70机工兵仓库',
        'Swindler': '欺诈者',
        'Vortexer': '环旋者',
      },
      'replaceText': {
        '--unseal--': '--解除封锁--',
        'Attachment': '配件更换',
        'Ballistic Missile': '导弹发射',
        'Bio-Arithmeticks': '生命计算术',
        'Brute Force': '残暴铁拳',
        'Crashing Wave': '冲击波',
        'Earth Missile': '大地导弹',
        'Elemental Jammer': '元素干扰',
        'Enumeration': '计数',
        'Height': '高度算术',
        'Ice Missile': '寒冰导弹',
        'Magicked Mark': '魔力射击',
        'Mind Blast': '精神冲击',
        'Mirage': '幻影系统',
        'Super Cyclone': '超级气旋',
        'Ultra Flash': '究极闪光',
        'Minefield': '地雷散布',
        'Supercharge': '超突击',
        'Single Buster': '破坏炮击',
        'Double Buster': '双重破坏炮击',
        'Rocket Drill': '火箭飞钻',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Blaster(?! Mirage)': '폭파자',
        'Blaster Mirage': '폭파자의 환영',
        'Brawler': '폭격자',
        'Machinery Bay 67': '제67기공병 격납고',
        'Machinery Bay 68': '제68기공병 격납고',
        'Machinery Bay 69': '제69기공병 격납고',
        'Machinery Bay 70': '제70기공병 격납고',
        'Swindler': '조작자',
        'Vortexer': '교반자',
      },
      'replaceText': {
        '--unseal--': '--봉인 해제--',
        'Attachment': '무기 장착',
        'Ballistic Missile': '미사일 발사',
        'Bio-Arithmeticks': '생명계산술',
        'Brute Force': '폭력적인 주먹',
        'Crashing Wave': '충격의 파도',
        'Earth Missile': '대지 미사일',
        'Elemental Jammer': '원소 간섭',
        'Enumeration': '계산',
        'Height': '고도',
        'Ice Missile': '얼음 미사일',
        'Magicked Mark': '마법 사격',
        'Mind Blast': '정신파괴',
        'Mirage': '환영 시스템',
        'Super Cyclone': '대형 돌개바람',
        'Ultra Flash': '초섬광',
        'Minefield': '지뢰 살포',
        'Supercharge': '강력 돌진',
        'Single Buster': '한손 버스터',
        'Double Buster': '양손 버스터',
        'Rocket Drill': '한손 드릴',
      },
    },
  ],
};

export default triggerSet;
