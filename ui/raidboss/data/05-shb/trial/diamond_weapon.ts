import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const sharedOutputStrings = {
  teleportEast: {
    en: 'Teleport to east platform',
    de: 'Teleport zur östlichen plattform',
    fr: 'Téléportez-vous vers la plateforme est',
    ja: '東の足場へテレポ',
    cn: '传送到右边(东边)平台',
    ko: '동쪽으로 이동',
  },
  teleportWest: {
    en: 'Teleport to west platform',
    de: 'Teleport zur westlichen plattform',
    fr: 'Téléportez-vous vers la plateforme ouest',
    ja: '西の足場へテレポ',
    cn: '传送到左边(西边)平台',
    ko: '서쪽으로 이동',
  },
};

const triggerSet: TriggerSet<Data> = {
  id: 'TheCloudDeck',
  zoneId: ZoneId.TheCloudDeck,
  timelineFile: 'diamond_weapon.txt',
  triggers: [
    {
      id: 'Diamond Diamond Rain',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5FA7', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Diamond Claw Swipe East',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5F9A', capture: false },
      durationSeconds: 10,
      alertText: (_data, _matches, output) => output.teleportWest!(),
      outputStrings: sharedOutputStrings,
    },
    {
      id: 'Diamond Claw Swipe West',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5F9B', capture: false },
      durationSeconds: 10,
      alertText: (_data, _matches, output) => output.teleportEast!(),
      outputStrings: sharedOutputStrings,
    },
    {
      id: 'Diamond Photon Burst',
      type: 'HeadMarker',
      netRegex: { id: '0057' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      // There is no head marker for this mechanic, instead Unknown_5779 creates the indicator
      id: 'Diamond Diamond Flash',
      type: 'Ability',
      netRegex: { source: 'The Diamond Weapon', id: '5779' },
      durationSeconds: 5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Diamond Auri Cyclone',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5FE6', capture: false },
      delaySeconds: 0.5,
      durationSeconds: 6,
      response: Responses.knockback(),
    },
    {
      id: 'Diamond Outrage',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5FD7', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Diamond Auri Doomstead',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5FD8' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Diamond Vertical Cleave',
      type: 'StartsUsing',
      netRegex: { source: 'The Diamond Weapon', id: '5FE5', capture: false },
      durationSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'Diamond Diamond Shrapnel',
      type: 'HeadMarker',
      netRegex: { id: '00C5' },
      condition: Conditions.targetIsYou(),
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Diamond Shrapnel on YOU',
          de: 'Diamantschub auf DIR',
          fr: 'Salve adamantine sur VOUS',
          ja: '自分にダイヤバースト',
          cn: '钻石爆发点名',
          ko: '장판 대상자',
        },
      },
    },
    {
      id: 'Diamond Articulated Bits',
      type: 'Ability',
      netRegex: { source: 'The Diamond Weapon', id: '5FA9', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Bits',
          de: 'Weiche den Satelliten aus',
          fr: 'Évitez les bras',
          ja: 'ビームを避ける',
          cn: '躲避浮游炮激光',
          ko: '비트 피하기',
        },
      },
    },
    {
      id: 'Diamond Adamant Sphere',
      type: 'Ability',
      netRegex: { source: 'The Diamond Weapon', id: '6144', capture: false },
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      // Diamond Weapon starts using this Adamant Purge ~10 seconds before the head markers
      id: 'Diamond Homing Laser',
      type: 'Ability',
      netRegex: { source: 'The Diamond Weapon', id: '5F9C', capture: false },
      delaySeconds: 3,
      durationSeconds: 7,
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Articulated Bit': 'Satellitenarm',
        'The Diamond Weapon': 'Diamant-Waffe',
      },
      'replaceText': {
        '\\(Jump\\)': '(Sprung)',
        'Adamant Purge': 'Diamantpanzer',
        'Adamant Sphere': 'Diamantsphäre',
        'Aetherial Bullet': 'Ätherreigen',
        'Airship\'s Bane': 'Luftschiffschmerz',
        'Articulated Bits': 'Satellitenarme',
        'Auri Arts': 'Aurische Kunst',
        'Auri Cyclone': 'Aurischer Zyklon',
        'Auri Doomstead': 'Aurisches Verderben',
        '(?<!Photon )Burst': 'Explosion',
        'Claw Swipe': 'Klauensturm',
        'Code Chi-Xi-Stigma': 'Code 666',
        'Diamond Flash': 'Diamantblitz',
        'Diamond Rain': 'Dominanz der Diamanten',
        'Diamond Shrapnel': 'Diamantschub',
        'Homing Laser': 'Leitlaser',
        'Outrage': 'Diamantwut',
        'Photon Burst': 'Photonenknall',
        'Vertical Cleave': 'Vertikalspalter',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Articulated Bit': 'bras autonome',
        'The Diamond Weapon': 'Arme Diamant',
      },
      'replaceText': {
        '\\(Jump\\)': '(Saut)',
        'Adamant Purge': 'Armure adaptative',
        'Adamant Sphere': 'Sphère de diamant',
        'Aetherial Bullet': 'Rayon éthéré',
        'Airship\'s Bane': 'Fléau aérien',
        'Articulated Bits': 'Bras autonome',
        'Auri Arts': 'Art martial aoran',
        'Auri Cyclone': 'Tornade aoranne',
        'Auri Doomstead': 'Calamité aoranne',
        '(?<!Photon )Burst': 'Explosion',
        'Claw Swipe': 'Ruée de griffes',
        'Code Chi-Xi-Stigma': 'Code Chi-Xi-Stigma',
        'Diamond Flash': 'Éclair de diamant',
        'Diamond Rain': 'Bombardement adamantin',
        'Diamond Shrapnel': 'Salve adamantine',
        'Homing Laser': 'Laser auto-guidé',
        'Outrage': 'Indignation',
        'Photon Burst': 'Salve photonique',
        'Vertical Cleave': 'Fente verticale',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Articulated Bit': 'アームビット',
        'The Diamond Weapon': 'ダイヤウェポン',
      },
      'replaceText': {
        'Adamant Purge': '装甲展開',
        'Adamant Sphere': 'ダイヤスフィア',
        'Aetherial Bullet': 'エーテルバレット',
        'Airship\'s Bane': 'エアシップベイン',
        'Articulated Bits': 'アームビット',
        'Auri Arts': 'アウリアーツ',
        'Auri Cyclone': 'アウリサイクロン',
        'Auri Doomstead': 'アウリドゥーム',
        '(?<!Photon )Burst': '爆発',
        'Claw Swipe': 'クロースラッシュ',
        'Code Chi-Xi-Stigma': 'コード666',
        'Diamond Flash': 'ダイヤフラッシュ',
        'Diamond Rain': 'ダイヤレイン',
        'Diamond Shrapnel': 'ダイヤバースト',
        'Homing Laser': 'ホーミングレーザー',
        'Outrage': 'アウトレイジ',
        'Photon Burst': 'フォトンバースト',
        'Vertical Cleave': 'バーチカルクリーヴ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Articulated Bit': '飞手浮游炮',
        'The Diamond Weapon': '钻石神兵',
      },
      'replaceText': {
        '\\(Jump\\)': '(跳)',
        '\\(Cleave\\)': '(冲锋)',
        'Adamant Purge': '装甲展开',
        'Adamant Sphere': '钻石球',
        'Aetherial Bullet': '以太炮',
        'Airship\'s Bane': '坠机',
        'Articulated Bits': '飞手浮游炮',
        'Auri Arts': '敖龙技巧',
        'Auri Cyclone': '敖龙旋风',
        'Auri Doomstead': '敖龙厄运',
        '(?<!Photon )Burst': '爆炸',
        'Claw Swipe': '利爪突进',
        'Code Chi-Xi-Stigma': '代号666',
        'Diamond Flash': '钻石闪光',
        'Diamond Rain': '钻石雨',
        'Diamond Shrapnel': '钻石爆发',
        'Homing Laser': '自控导弹',
        'Outrage': '震怒',
        'Photon Burst': '光子爆发',
        'Vertical Cleave': '纵劈',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Articulated Bit': '암 비트',
        'The Diamond Weapon': '다이아몬드 웨폰',
      },
      'replaceText': {
        '\\(Jump\\)': '(점프)',
        '\\(Cleave\\)': '(광역 탱버)',
        'Adamant Purge': '장갑 전개',
        'Adamant Sphere': '다이아몬드 구체',
        'Aetherial Bullet': '에테르 탄환',
        'Airship\'s Bane': '비공정 격파',
        'Articulated Bits': '암 비트',
        'Auri Arts': '아우라의 무예',
        'Auri Cyclone': '아우라의 선풍',
        'Auri Doomstead': '아우라의 파멸',
        '(?<!Photon )Burst': '대폭발',
        'Claw Swipe': '발톱 휘두르기',
        'Code Chi-Xi-Stigma': '코드 666',
        'Diamond Flash': '다이아몬드 섬광',
        'Diamond Rain': '다이아몬드 비',
        'Diamond Shrapnel': '다이아몬드 유산탄',
        'Homing Laser': '추적 레이저',
        'Outrage': '격노',
        'Photon Burst': '광자 폭발',
        'Vertical Cleave': '수직 쪼개기',
      },
    },
  ],
};

export default triggerSet;
