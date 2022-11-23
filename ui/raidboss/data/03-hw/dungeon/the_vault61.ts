import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  knightsActive?: boolean;
}

// The Vault
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheVault61,
  timelineFile: 'the_vault61.txt',
  timelineTriggers: [
    {
      id: 'The Vault Heavenly Slash',
      regex: /Heavenly Slash/,
      beforeSeconds: 3.5,
      response: Responses.tankCleave(),
    },
    {
      id: 'The Vault Shining Blade',
      regex: /Shining Blade/,
      beforeSeconds: 3,
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid dashes',
          de: 'Sprint ausweichen',
          fr: 'Évitez les charges',
          ja: 'ブレードを避ける',
          cn: '躲开冲锋',
          ko: '돌진 피하기',
        },
      },
    },
    {
      id: 'The Vault Heavy Swing',
      regex: /Heavy Swing/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      id: 'The Vault Altar Candle',
      regex: /Altar Candle/,
      beforeSeconds: 5,
      condition: (data) => data.role !== 'dps',
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'The Vault Holiest of Holy',
      type: 'StartsUsing',
      netRegex: { id: '101E', source: 'Ser Adelphel', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'The Vault Holy Shield Bash',
      type: 'StartsUsing',
      netRegex: { id: '101F', source: 'Ser Adelphel' },
      condition: (data) => data.role === 'healer',
      alertText: (data, matches, output) => {
        return output.text!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Heal + shield ${player}',
          de: 'Heilung + Schild ${player}',
          fr: 'Soin + bouclier ${player}',
          ja: 'すぐに${player}をヒールする',
          cn: '马上治疗${player}',
          ko: '${player} 강타 대상자',
        },
      },
    },
    {
      id: 'The Vault Execution',
      type: 'HeadMarker',
      netRegex: { id: '0020' },
      response: Responses.awayFrom(),
    },
    {
      id: 'The Vault Black Nebula',
      type: 'StartsUsing',
      netRegex: { id: '1042', source: 'Face Of The Hero' },
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
    {
      id: 'The Vault Faith Unmoving',
      type: 'StartsUsing',
      netRegex: { id: '1027', source: 'Ser Grinnaux', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'The Vault Dimensional Torsion',
      type: 'Tether',
      netRegex: { id: '0001', source: 'Aetherial Tear' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 5,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from rifts',
          de: 'Weg von de Ätherspalten',
          fr: 'Éloignez-vous des déchirures',
          ja: '裂け目から離れる',
          cn: '远离黑圈',
          ko: '균열에서 멀리 떨어지기',
        },
      },
    },
    {
      id: 'The Vault Altar Pyre',
      type: 'StartsUsing',
      netRegex: { id: '1035', source: 'Ser Charibert', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'The Vault Holy Chains',
      type: 'HeadMarker',
      netRegex: { id: '0061' },
      condition: Conditions.targetIsYou(),
      response: Responses.breakChains(),
    },
    {
      // This prevents out-of-combat activation for the March trigger during Charibert's spawn-in.
      id: 'The Vault Knights Activation',
      type: 'HeadMarker',
      netRegex: { id: '0061', capture: false },
      condition: (data) => !data.knightsActive,
      run: (data) => data.knightsActive = true,
    },
    {
      id: 'The Vault Knights March',
      type: 'AddedCombatant',
      netRegex: { name: ['Dawn Knight', 'Dusk Knight'], capture: false },
      condition: (data) => data.knightsActive,
      suppressSeconds: 4,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Evade marching knights',
          de: 'Marschierenden Rittern ausweichen',
          fr: 'Esquivez les chevaliers',
          ja: 'ナイトを避ける',
          cn: '躲开人马',
          ko: '자동기사 피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aetherial Tear': 'Ätherspalt',
        'Dawn Knight': 'Dämmerross',
        'Dusk Knight': 'Morgenross',
        'Face Of The Hero': 'Gesicht des Helden',
        'Ser Adelphel Brightblade': 'Adelphel',
        'Ser Adelphel(?! )': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux the Bull': 'Grinnaux',
        'Ser Grinnaux(?! )': 'Grinnaux',
        'The Chancel': 'Bekenntnis des Glaubens',
        'The Quire': 'Chorempore',
        'The chapter house': 'Himmelsgewölbe',
      },
      'replaceText': {
        'Advent': 'Wiederkunft',
        'Altar Candle': 'Altarkerze',
        'Altar Pyre': 'Scheiterhaufen',
        'Black Knight\'s Tour': 'Schwarzer Rösselsprung',
        'Bloodstain': 'Befleckung',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Dimensional Rip': 'Dimensionsriss',
        'Execution': 'Exekution',
        'Faith Unmoving': 'Fester Glaube',
        'Fast Blade': 'Vortexschnitt',
        'Heavenly Slash': 'Himmelsschlag',
        'Heavensflame': 'Himmlische Flamme',
        'Heavy Swing': 'Schwerer Schwinger',
        'Holiest Of Holy': 'Quell der Heiligkeit',
        'Holy Chain': 'Heilige Kette',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Knights Appear': 'Rosse erscheinen',
        'Overpower': 'Kahlrodung',
        'Retreat(?!ing)': 'Rückzug',
        'Retreating': 'zurückziehen',
        'Rive': 'Spalten',
        'Sacred Flame': 'Heilige Flamme',
        'Shining Blade': 'Glänzende Klinge',
        'Solid Ascension': 'Gipfelstürmer',
        'White Knight\'s Tour': 'Weißer Rösselsprung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aetherial Tear': 'Déchirure dimensionnelle',
        'Dawn Knight': 'Cavalier de l\'aube',
        'Dusk Knight': 'Cavalier du crépuscule',
        'Face Of The Hero': 'Visage du héros',
        'Ser Adelphel Brightblade': 'Sire Adelphel',
        'Ser Adelphel(?! )': 'Sire Adelphel',
        'Ser Charibert': 'Sire Charibert',
        'Ser Grinnaux the Bull': 'Sire Grinnaux',
        'Ser Grinnaux(?! )': 'Sire Grinnaux',
        'The Chancel': 'salle de prière du sanctuaire de l\'Azur',
        'The Quire': 'chœur',
        'The chapter house': 'kiosque du patio',
      },
      'replaceText': {
        'Advent': 'Avènement',
        'Altar Candle': 'Cierge funéraire',
        'Altar Pyre': 'Bûcher funéraire',
        'Black Knight\'s Tour': 'Tour de cavalier noir',
        'Bloodstain': 'Tache de sang',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Dimensional Rip': 'Déchirure dimensionnelle',
        'Execution': 'Exécution',
        'Faith Unmoving': 'Foi immuable',
        'Fast Blade': 'Lame rapide',
        'Heavenly Slash': 'Lacération céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavy Swing': 'Swing céleste',
        'Holiest Of Holy': 'Saint des saints',
        'Holy Chain': 'Chaîne sacrée',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Knights Appear': 'Apparition des chevaliers',
        'Overpower': 'Domination',
        'Retreat(?!ing)': 'Retraite',
        'Retreating': 'Préparation de la retraite',
        'Rive': 'Coupure',
        'Sacred Flame Enrage?': 'Flamme sacrée Enrage ?',
        'Shining Blade': 'Lame brillante',
        'Solid Ascension': 'Ascension solide',
        'White Knight\'s Tour': 'Tour de cavalier blanc',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aetherial Tear': '次元の裂け目',
        'Dawn Knight': 'ドーン・オートナイト',
        'Dusk Knight': 'ダスク・オートナイト',
        'Face Of The Hero': 'フェイス・オブ・ヒーロー',
        'Ser Adelphel Brightblade': '美剣のアデルフェル',
        'Ser Adelphel(?! )': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux the Bull': '戦狂のグリノー',
        'Ser Grinnaux(?! )': '聖騎士グリノー',
        'The Chancel': '氷天宮礼拝堂',
        'The Quire': '聖歌隊席',
        'The chapter house': '庭園の小ホール',
      },
      'replaceText': {
        'Advent': '降臨',
        'Altar Candle': 'アルターキャンドル',
        'Altar Pyre': 'アルターパイヤ',
        'Black Knight\'s Tour': 'ブラックナイトツアー',
        'Bloodstain': 'ブラッドステイン',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Dimensional Rip': 'ディメンションリップ',
        'Execution': 'エクスキューション',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Fast Blade': 'ファストブレード',
        'Heavenly Slash': 'ヘヴンリースラッシュ',
        'Heavensflame': 'へヴンフレイム',
        'Heavy Swing': 'ヘヴンリースイング',
        'Holiest Of Holy': 'ホリエストホーリー',
        'Holy Chain': 'ホーリーチェーン',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Knights Appear': 'ナイト出現',
        'Overpower': 'オーバーパワー',
        'Retreat(?!ing)': '撤退',
        'Retreating': '撤退中',
        'Rive': 'ライブ',
        'Sacred Flame': '聖火燃焼',
        'Shining Blade': 'シャイニングブレード',
        'Solid Ascension': 'ソリッドライズ',
        'White Knight\'s Tour': 'ホワイトナイトツアー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aetherial Tear': '次元裂缝',
        'Dawn Knight': '拂晓骑士',
        'Dusk Knight': '黄昏骑士',
        'Face Of The Hero': '英雄之相',
        'Ser Adelphel Brightblade': '光辉剑 阿代尔斐尔',
        'Ser Adelphel(?! )': '圣骑士阿代尔斐尔',
        'Ser Charibert': '圣骑士沙里贝尔',
        'Ser Grinnaux the Bull': '战争狂 格里诺',
        'Ser Grinnaux(?! )': '圣骑士格里诺',
        'The Chancel': '冰天宫礼拜堂',
        'The Quire': '圣歌队席',
        'The chapter house': '庭园小厅',
      },
      'replaceText': {
        'Advent': '降临',
        'Altar Candle': '圣坛蜡烛',
        'Altar Pyre': '圣坛火葬',
        'Black Knight\'s Tour': '黑骑士之旅',
        'Bloodstain': '染血剑',
        'Dimensional Collapse': '空间破碎',
        'Dimensional Rip': '空间裂痕',
        'Execution': '处刑',
        'Faith Unmoving': '坚定信仰',
        'Fast Blade': '先锋剑',
        'Heavenly Slash': '天斩',
        'Heavensflame': '天火',
        'Heavy Swing': '重挥',
        'Holiest Of Holy': '至圣',
        'Holy Chain': '圣锁',
        'Holy Shield Bash': '圣盾猛击',
        'Hyperdimensional Slash': '多维空间斩',
        'Knights Appear': '骑士出现',
        'Overpower': '超压斧',
        'Retreat': '撤退',
        'Rive': '撕裂斧',
        'Sacred Flame': '圣火燃烧',
        'Shining Blade': '光芒剑',
        'Solid Ascension': '实体升天',
        'White Knight\'s Tour': '白骑士之旅',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aetherial Tear': '차원의 틈새',
        'Dawn Knight': '여명의 자동기사',
        'Dusk Knight': '황혼의 자동기사',
        'Face Of The Hero': '영웅의 형상',
        'Ser Adelphel Brightblade': '미검의 아델펠',
        'Ser Adelphel(?! )': '성기사 아델펠',
        'Ser Charibert': '성기사 샤리베르',
        'Ser Grinnaux the Bull': '전쟁광 그리노',
        'Ser Grinnaux(?! )': '성기사 그리노',
        'The Chancel': '빙천궁 예배당',
        'The Quire': '성가대석',
        'The chapter house': '기사단 강당',
      },
      'replaceText': {
        'Advent': '강림',
        'Altar Candle': '제단의 초',
        'Altar Pyre': '제단의 장작',
        'Black Knight\'s Tour': '흑기사 행진',
        'Bloodstain': '핏자국',
        'Dimensional Collapse': '차원 파괴',
        'Dimensional Rip': '차원 찢기',
        'Execution': '집행',
        'Faith Unmoving': '굳건한 신앙',
        'Fast Blade': '재빠른 검격',
        'Heavenly Slash': '천상의 참격',
        'Heavensflame': '천상의 불꽃',
        'Heavy Swing': '천상의 징벌',
        'Holiest Of Holy': '지고한 신성',
        'Holy Chain': '거룩한 사슬',
        'Holy Shield Bash': '성스러운 방패 강타',
        'Hyperdimensional Slash': '고차원',
        'Knights Appear': '자동 기사 생성',
        'Overpower': '압도',
        'Retreat(?!ing)': '철수',
        'Retreating': '철수 중',
        'Rive': '두 동강 내기',
        'Sacred Flame': '성화 연소',
        'Shining Blade': '찬란한 칼날',
        'Solid Ascension': '불변의 승천',
        'White Knight\'s Tour': '백기사 행진',
      },
    },
  ],
};

export default triggerSet;
