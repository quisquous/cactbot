import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Regexes from '../../../../../resources/regexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn1,
  timelineFile: 't6.txt',
  triggers: [
    {
      id: 'T6 Thorn Whip Collect',
      netRegex: NetRegexes.tether({ id: '0012' }),
      run: (data, matches) => {
        data.thornMap = data.thornMap || {};
        data.thornMap[matches.source] = data.thornMap[matches.source] || [];
        data.thornMap[matches.source].push(matches.target);
        data.thornMap[matches.target] = data.thornMap[matches.target] || [];
        data.thornMap[matches.target].push(matches.source);
      },
    },
    {
      id: 'T6 Thorn Whip',
      netRegex: NetRegexes.ability({ id: '879', source: 'Rafflesia' }),
      netRegexDe: NetRegexes.ability({ id: '879', source: 'Rafflesia' }),
      netRegexFr: NetRegexes.ability({ id: '879', source: 'Rafflesia' }),
      netRegexJa: NetRegexes.ability({ id: '879', source: 'ラフレシア' }),
      netRegexCn: NetRegexes.ability({ id: '879', source: '大王花' }),
      netRegexKo: NetRegexes.ability({ id: '879', source: '라플레시아' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => {
        const partners = data.thornMap[data.me];
        if (!partners)
          return output.thornsOnYou();

        if (partners.length === 1)
          return output.oneTether({ player: data.ShortName(partners[0]) });

        if (partners.length === 2) {
          return output.twoTethers({
            player1: data.ShortName(partners[0]),
            player2: data.ShortName(partners[1]),
          });
        }

        return output.threeOrMoreTethers({ num: partners.length });
      },
      run: (data) => delete data.thornMap,
      outputStrings: {
        thornsOnYou: {
          en: 'Thorns on YOU',
          de: 'Dornenpeitsche auf DIR',
          fr: 'Ronces sur VOUS',
          ja: '自分にソーンウィップ',
          cn: '荆棘点名',
        },
        oneTether: {
          en: 'Thorns w/ (${player})',
          de: 'Dornenpeitsche mit (${player})',
          fr: 'Ronces avec (${player})',
          ja: '自分と (${player}) にソーンウィップ',
          cn: '荆棘与(${player})',
        },
        twoTethers: {
          en: 'Thorns w/ (${player1}, ${player2})',
          de: 'Dornenpeitsche mit (${player1}, ${player2})',
          fr: 'Ronces avec (${player1}, ${player2})',
          ja: '自分と (${player1}, ${player2}) にソーンウィップ',
          cn: '荆棘与(${player1}, ${player2})',
        },
        threeOrMoreTethers: {
          en: 'Thorns (${num} people)',
          de: 'Dornenpeitsche mit (${num} Personen)',
          fr: 'Ronces (${num} personne)',
          ja: 'ソーンウィップ (${num}人)',
          cn: '荆棘(${num} people)',
        },
      },
    },
    {
      // Honey-Glazed
      id: 'T6 Honey On',
      netRegex: NetRegexes.gainsEffect({ effectId: '1BE' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.honey = true,
    },
    {
      id: 'T6 Honey Off',
      netRegex: NetRegexes.losesEffect({ effectId: '1BE' }),
      condition: Conditions.targetIsYou(),
      run: (data) => delete data.honey,
    },
    {
      id: 'T6 Flower',
      netRegex: NetRegexes.headMarker({ id: '000D' }),
      alarmText: (data, _, output) => {
        if (data.honey)
          return output.getEaten();
      },
      alertText: (data, matches, output) => {
        if (data.honey)
          return;

        if (data.me === matches.target)
          return output.jumpInNewThorns();
      },
      infoText: (data, matches, output) => {
        if (data.honey || data.me === matches.target)
          return;

        return output.avoidDevour();
      },
      outputStrings: {
        avoidDevour: {
          en: 'Avoid Devour',
          de: 'Weiche Verschlingen aus',
          fr: 'Évitez Dévoration',
          ja: '捕食に避け',
          cn: '躲开吞食',
        },
        jumpInNewThorns: {
          en: 'Devour: Jump In New Thorns',
          de: 'Verschlingen: Spring in die neuen Dornen',
          fr: 'Dévoration : Sautez dans les ronces',
          ja: '捕食: 新芽に乗る',
          cn: '去新荆棘',
        },
        getEaten: {
          en: 'Devour: Get Eaten',
          de: 'Verschlingen: Gefressen werden',
          fr: 'Dévoration : Faites-vous manger',
          ja: '捕食: 捕食され',
          cn: '捕食点名',
        },
      },
    },
    {
      id: 'T6 Phase 2',
      regex: Regexes.hasHP({ name: 'Rafflesia', hp: '70', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Rafflesia', hp: '70', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Rafflesia', hp: '70', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ラフレシア', hp: '70', capture: false }),
      regexCn: Regexes.hasHP({ name: '大王花', hp: '70', capture: false }),
      regexKo: Regexes.hasHP({ name: '라플레시아', hp: '70', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T6 Blighted',
      netRegex: NetRegexes.startsUsing({ id: '79D', source: 'Rafflesia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '79D', source: 'Rafflesia', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '79D', source: 'Rafflesia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '79D', source: 'ラフレシア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '79D', source: '大王花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '79D', source: '라플레시아', capture: false }),
      response: Responses.stopEverything(),
    },
    {
      id: 'T6 Phase 3',
      netRegex: NetRegexes.startsUsing({ id: '79E', source: 'Rafflesia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '79E', source: 'Rafflesia', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '79E', source: 'Rafflesia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '79E', source: 'ラフレシア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '79E', source: '大王花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '79E', source: '라플레시아', capture: false }),
      condition: (data) => !data.seenLeafstorm,
      sound: 'Long',
      run: (data) => data.seenLeafstorm = true,
    },
    {
      id: 'T6 Swarm Stack',
      netRegex: NetRegexes.startsUsing({ id: '86C', source: 'Rafflesia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '86C', source: 'Rafflesia', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '86C', source: 'Rafflesia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '86C', source: 'ラフレシア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '86C', source: '大王花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '86C', source: '라플레시아', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack for Acid',
          de: 'Sammeln für Säure-Blubberblase',
          fr: 'Packez-vous pour Pluie acide',
          ja: '集合、アシッドレインを誘導',
          cn: '集合引导酸雨',
        },
      },
    },
    {
      id: 'T6 Swarm',
      netRegex: NetRegexes.ability({ id: '7A0', source: 'Rafflesia' }),
      netRegexDe: NetRegexes.ability({ id: '7A0', source: 'Rafflesia' }),
      netRegexFr: NetRegexes.ability({ id: '7A0', source: 'Rafflesia' }),
      netRegexJa: NetRegexes.ability({ id: '7A0', source: 'ラフレシア' }),
      netRegexCn: NetRegexes.ability({ id: '7A0', source: '大王花' }),
      netRegexKo: NetRegexes.ability({ id: '7A0', source: '라플레시아' }),
      condition: (data, matches) => data.me === matches.target || data.role === 'healer' || data.job === 'BLU',
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.swarmOnYou();
      },
      infoText: (data, matches, output) => {
        if (matches.target !== data.me)
          return output.swarmOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        swarmOn: {
          en: 'Swarm on ${player}',
          de: 'Fähenfurz auf ${player}',
          fr: 'Nuée sur ${player}',
          ja: '${player}にスウォーム',
          cn: '蜂群点${player}',
        },
        swarmOnYou: {
          en: 'Swarm on YOU',
          de: 'Fähenfurz auf DIR',
          fr: 'Nuée sur VOUS',
          ja: '自分にスウォーム',
          cn: '蜂群点名',
        },
      },
    },
    {
      id: 'T6 Rotten Stench',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.shareLaserOnYou();

        return output.shareLaserOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        shareLaserOnYou: {
          en: 'Share Laser (on YOU)',
          de: 'Geteilter Laser (auf DIR)',
          fr: 'Partagez le laser (sur VOUS)',
          ja: '(自分に)頭割りレザー',
          cn: '分摊激光点名',
        },
        shareLaserOn: {
          en: 'Share Laser (on ${player})',
          de: 'Geteilter Laser (auf ${player})',
          fr: 'Partage de laser (sur ${player})',
          ja: '(${player})に頭割りレザー',
          cn: '分摊激光点(on ${player})',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Rafflesia': 'Rafflesia',
        'Scar\'s Edge': 'Narbenrand',
      },
      'replaceText': {
        'Acid Rain': 'Säureregen',
        'Blighted Bouquet': 'Mehltau-Bouquet',
        'Bloody Caress': 'Vampirranke',
        'Briary Growth': 'Wuchernde Dornen',
        'Devour': 'Verschlingen',
        'Floral Trap': 'Saugfalle',
        'Leafstorm': 'Blättersturm',
        'Rotten Stench': 'Fauler Gestank',
        'Spit': 'Hypersekretion',
        'Swarm': 'Fähenfurz',
        'Thorn Whip': 'Dornenpeitsche',
        'Viscid Emission': 'Klebsporen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Rafflesia': 'Rafflesia',
        'Scar\'s Edge': 'l\'Huis de la Marque',
      },
      'replaceText': {
        'Acid Rain': 'Pluie acide',
        'Blighted Bouquet': 'Bouquet mildiousé',
        'Bloody Caress': 'Caresse sanglante',
        'Briary Growth': 'Poussée de tige',
        'Devour': 'Dévoration',
        'Floral Trap': 'Piège floral',
        'Leafstorm': 'Tempête de feuilles',
        'Rotten Stench': 'Pestilence nauséabonde',
        'Spit': 'Crachat',
        'Swarm': 'Nuée',
        'Thorn Whip': 'Fouet de ronces',
        'Viscid Emission': 'Émission visqueuse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Rafflesia': 'ラフレシア',
        'Scar\'s Edge': '傷跡の門戸',
      },
      'replaceText': {
        'Acid Rain': '酸性雨',
        'Blighted Bouquet': 'ブライテッドブーケ',
        'Bloody Caress': 'ブラッディカレス',
        'Briary Growth': 'ブライアリーグロウス',
        'Devour': '捕食',
        'Floral Trap': 'フローラルトラップ',
        'Leafstorm': 'リーフストーム',
        'Rotten Stench': 'ロトンステンチ',
        'Spit': '吐出す',
        'Swarm': 'スウォーム',
        'Thorn Whip': 'ソーンウィップ',
        'Viscid Emission': 'ヴィシドエミッション',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Rafflesia': '大王花',
        'Scar\'s Edge': '破损的门前',
      },
      'replaceText': {
        'Acid Rain': '酸雨',
        'Blighted Bouquet': '凋零的花香',
        'Bloody Caress': '血腥的爱抚',
        'Briary Growth': '荆棘丛生',
        'Devour': '捕食',
        'Floral Trap': '鲜花陷阱',
        'Leafstorm': '绿叶风暴',
        'Rotten Stench': '腐烂恶臭',
        'Spit': '呕吐',
        'Swarm': '招蜂香气',
        'Thorn Whip': '荆棘鞭',
        'Viscid Emission': '胶质排放物',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Rafflesia': '라플레시아',
        'Scar\'s Edge': '상흔의 입구',
      },
      'replaceText': {
        'Acid Rain': '산성비',
        'Blighted Bouquet': '시든 꽃다발',
        'Bloody Caress': '피의 애무',
        'Briary Growth': '자라는 가시나무',
        'Devour': '포식',
        'Floral Trap': '향기의 덫',
        'Leafstorm': '잎사귀 폭풍',
        'Rotten Stench': '썩은 냄새',
        'Spit': '뱉기',
        'Swarm': '벌레 떼',
        'Thorn Whip': '가시채찍',
        'Viscid Emission': '점액 배출',
      },
    },
  ],
};
