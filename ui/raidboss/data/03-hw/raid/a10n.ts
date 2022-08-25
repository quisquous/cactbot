import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheBreathOfTheCreator,
  timelineFile: 'a10n.txt',
  timelineTriggers: [
    {
      id: 'A10N Goblin Rush',
      regex: /Goblin Rush/,
      beforeSeconds: 5,
      suppressSeconds: 5, // Ensure syncs don't multi-call
      response: Responses.miniBuster(),
    },
    {
      id: 'A10N Gobsway Rumblerocks',
      regex: /Gobsway Rumblerocks/,
      beforeSeconds: 4,
      suppressSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'A10N Laceration',
      regex: /Laceration/,
      beforeSeconds: 5,
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid side saws',
          de: 'Weiche den Sägen an der Seite aus',
          fr: 'Évitez les scies sur le côté',
          cn: '躲避场边电锯',
        },
      },
    },
  ],
  triggers: [
    // There doesn't seem to be any indication in the logs if a player activates a trap.
    {
      id: 'A10N Frost Laser Trap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB1', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Frost Lasers',
          de: 'Eislaser',
          fr: 'Lasers de glace',
          ja: '罠: 氷',
          cn: '冰晶陷阱',
          ko: '얼음화살 함정',
        },
      },
    },
    {
      id: 'A10N Ceiling Weight Trap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB0', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ceiling Weight',
          de: 'Gewichte von der Decke',
          fr: 'Poids du plafond',
          ja: '罠: 鉄球',
          cn: '铁球陷阱',
          ko: '철퇴 함정',
        },
      },
    },
    {
      id: 'A10N Single Charge In',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1AB8', source: 'Lamebrix Strikebocks', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'A10N Single Charge Out',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1AB9', source: 'Lamebrix Strikebocks', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'A10N Gobrush Rushgob',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Lamebrix Strikebocks', id: '1ACF' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'A10N Critical Wrath',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0019' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A10N Bomb Toss',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'A10N Gobslash Slicetops',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.target!();
        return output.avoid!();
      },
      outputStrings: {
        target: {
          en: 'Get away--Laser on YOU',
          de: 'Geh weg--Laser auf DIR',
          fr: 'Éloignez-vous - Laser sur VOUS',
          cn: '出去--激光点名',
        },
        avoid: {
          en: 'Avoid Prey Laser',
          de: 'Weiche dem Markierungs-Laser aus',
          fr: 'Évitez le laser',
          cn: '躲避追踪激光',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Gobspin Whooshdrops/Gobswipe Conklops': 'Single Charge #1',
        'Gobswipe Conklops/Gobspin Whooshdrops': 'Single Charge #2',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Blizzard Arrow': 'Eisregner',
        'Buzzsaw': 'Rotorsäge',
        'Goblin of Fortune': 'Helfenhand',
        'Gobpress R-VI': 'Gob-Roller VI',
        'Lamebrix Strikebocks': 'Wüterix (?:der|die|das) Söldner',
        'The Excruciationator': 'Multi-Martyrium',
        'Weight of the World': 'Schwere der Erde',
      },
      'replaceText': {
        'Bomb Toss': 'Bombenwurf',
        'Critical Wrath': 'Todsicherer Treffer',
        'Frostbite': 'Abfrieren',
        'Gobbieboom': 'Gobbombe',
        'Goblin Rush': 'Goblin-Rausch',
        'Gobrush Rushgob': 'Indigoblin-Rausch',
        'Gobslash Slicetops': 'Indigo-Vakuumhieb',
        'Gobspin Whooshdrops': 'Nichtgroße Gobwirbel',
        'Gobsway Rumblerocks': 'Riesengroße Schüttern',
        'Gobswipe Conklops': 'Unbremste Wirrschlagen',
        'Illuminati Hand Cannon': 'Indigohandkanone',
        'Impact': 'Impakt',
        'Laceration': 'Zerreißen',
        'Single Charge': 'Einzelaufladung',
        'Steam Roller': 'Dampfwalze',
        'Trap': 'Falle',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Blizzard Arrow': 'flèche de glace',
        'Buzzsaw': 'scie mécanique',
        'Goblin of Fortune': 'gobsoldat de fortune',
        'Gobpress R-VI': 'gobrouleau compresseur G-VI',
        'Lamebrix Strikebocks': 'Lamebrix le Mercenaire',
        'The Excruciationator': 'Plate-forme de torture polyvalente',
        'Weight of the World': 'Poids du monde',
      },
      'replaceText': {
        'Bomb Toss': 'Lancer de bombe',
        'Critical Wrath': 'Décision fatale',
        'Frostbite': 'Gelure',
        'Gobbieboom': 'Bombe gobeline',
        'Goblin Rush': 'Charge gobeline',
        'Gobrush Rushgob': 'Gobcharge gobeline',
        'Gobslash Slicetops': 'Gobtranchant du vide',
        'Gobspin Whooshdrops': 'Gobtoupie coupante',
        'Gobsway Rumblerocks': 'Gobbouleversement',
        'Gobswipe Conklops': 'Gobhachage sauvage',
        'Illuminati Hand Cannon': 'Main-canon indigo',
        'Impact': 'Impact',
        'Laceration': 'Lacération',
        'Single Charge': 'Rechargement simple',
        'Steam Roller': 'Compression',
        'Trap': 'Gobactivation de piège',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Blizzard Arrow': 'ブリザードアロー',
        'Buzzsaw': '回転ノコギリ',
        'Goblin of Fortune': 'マーシナリー・ソルジャー',
        'Gobpress R-VI': 'VI号ゴブリローラー',
        'Lamebrix Strikebocks': '傭兵のレイムプリクス',
        'The Excruciationator': '科学的万能処刑場',
        'Weight of the World': '大陸の重み',
      },
      'replaceText': {
        'Bomb Toss': '爆弾投げ',
        'Critical Wrath': '必中の決意',
        'Frostbite': 'フロストバイト',
        'Gobbieboom': 'ゴブ爆発',
        'Goblin Rush': 'ゴブリンラッシュ',
        'Gobrush Rushgob': 'ゴブ流ゴブリンラッシュ',
        'Gobslash Slicetops': 'ゴブ流真空斬り',
        'Gobspin Whooshdrops': 'ゴブ流回転斬り',
        'Gobsway Rumblerocks': 'ゴブ流大激震',
        'Gobswipe Conklops': 'ゴブ流乱れ斬り',
        'Illuminati Hand Cannon': 'イルミナティ・ハンドカノン',
        'Impact': 'インパクト',
        'Laceration': '斬撃',
        'Single Charge': '単発充填',
        'Steam Roller': 'ローラープレス',
        'Trap': '罠起動',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Blizzard Arrow': '冰箭发射器',
        'Buzzsaw': '旋转链锯',
        'Goblin of Fortune': '佣兵战士',
        'Gobpress R-VI': '6号哥布林压路机',
        'Lamebrix Strikebocks': '佣兵雷姆普里克斯',
        'The Excruciationator': '科学万能处刑场',
        'Weight of the World': '大陆之重',
      },
      'replaceText': {
        'Bomb Toss': '投弹',
        'Critical Wrath': '必中决心',
        'Frostbite': '寒冰箭',
        'Gobbieboom': '哥布爆炸',
        'Goblin Rush': '哥布林冲锋',
        'Gobrush Rushgob': '哥布流哥布林冲锋',
        'Gobslash Slicetops': '哥布流真空斩',
        'Gobspin Whooshdrops': '哥布流回旋斩',
        'Gobsway Rumblerocks': '哥布流大怒震',
        'Gobswipe Conklops': '哥布流乱斩',
        'Illuminati Hand Cannon': '青蓝手炮',
        'Impact': '冲击',
        'Laceration': '斩击',
        'Single Charge': '单发填充',
        'Steam Roller': '蒸汽滚轮',
        'Trap': '启动陷阱',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Blizzard Arrow': '얼음 화살',
        'Buzzsaw': '회전톱',
        'Goblin of Fortune': '용병 전사',
        'Gobpress R-VI': 'VI호 고블린롤러',
        'Lamebrix Strikebocks': '용병 레임브릭스',
        'The Excruciationator': '과학적 만능처형장',
        'Weight of the World': '대륙의 무게',
      },
      'replaceText': {
        'Bomb Toss': '폭탄 던지기',
        'Critical Wrath': '일격필중',
        'Frostbite': '동상',
        'Gobbieboom': '고블린 폭발',
        'Goblin Rush': '고블린 돌진',
        'Gobrush Rushgob': '고브류 고블린 돌진',
        'Gobslash Slicetops': '고브류 진공베기',
        'Gobspin Whooshdrops': '고브류 회전베기',
        'Gobsway Rumblerocks': '고브류 대격진',
        'Gobswipe Conklops': '고브류 연속베기',
        'Illuminati Hand Cannon': '푸른손 화포',
        'Impact': '임팩트',
        'Laceration': '참격',
        'Single Charge': '단발 충전',
        'Steam Roller': '롤러 프레스',
        'Trap': '함정 기동',
      },
    },
  ],
};

export default triggerSet;
