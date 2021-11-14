import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// Frontlines: Shatter
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheFieldsOfGloryShatter,
  triggers: [
    {
      id: 'Shatter Big Ice Center',
      type: 'GameLog',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A1 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A1 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A1 e et la glace s\'est fragilisée.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: 'アイスドトームリスA1号基が起動し、氷がもろくなった！.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '冰封的石文A1启动了，冰块变得脆弱了！.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '얼음탑 A1호기가 기동하여 표면이 녹기 시작합니다!.*?', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Big Ice: Center',
          de: 'Grosses Eis: Mitte',
          fr: 'Grosse Glace : Centre',
          ja: '氷: 中央',
          cn: '大冰: 中央',
          ko: '큰 얼음: 중앙',
        },
      },
    },
    {
      id: 'Shatter Big Ice North',
      type: 'GameLog',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A2 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A2 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A2 e et la glace s\'est fragilisée.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: 'アイスドトームリスA2号基が起動し、氷がもろくなった！.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '冰封的石文A2启动了，冰块变得脆弱了！.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '얼음탑 A2호기가 기동하여 표면이 녹기 시작합니다!.*?', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Big Ice: North',
          de: 'Grosses Eis: Norden',
          fr: 'Grosse Glace : Nord',
          ja: '氷: 北',
          cn: '大冰: 北方',
          ko: '큰 얼음: 북쪽',
        },
      },
    },
    {
      id: 'Shatter Big Ice Southeast',
      type: 'GameLog',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A3 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A3 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A3 e et la glace s\'est fragilisée.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: 'アイスドトームリスA3号基が起動し、氷がもろくなった！.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '冰封的石文A3启动了，冰块变得脆弱了！.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '얼음탑 A3호기가 기동하여 표면이 녹기 시작합니다!.*?', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Big Ice: Southeast',
          de: 'Grosses Eis: Süden',
          fr: 'Grosse Glace : Sud-Est',
          ja: '氷: 南東',
          cn: '大冰: 东南',
          ko: '큰 얼음: 남동쪽',
        },
      },
    },
    {
      id: 'Shatter Big Ice Southwest',
      type: 'GameLog',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A4 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A4 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A4 e et la glace s\'est fragilisée.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: 'アイスドトームリスA4号基が起動し、氷がもろくなった！.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '冰封的石文A4启动了，冰块变得脆弱了！.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '얼음탑 A4호기가 기동하여 표면이 녹기 시작합니다!.*?', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Big Ice: Southwest',
          de: 'Grosses Eis: Südwesten',
          fr: 'Grosse Glace : Sud-Ouest',
          ja: '氷: 西南',
          cn: '大冰: 西南',
          ko: '큰 얼음: 남서쪽',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': 'Vereister Echolith A1 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
        'The icebound tomelith A2 activates and begins to emit heat': 'Vereister Echolith A2 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
        'The icebound tomelith A3 activates and begins to emit heat': 'Vereister Echolith A3 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
        'The icebound tomelith A4 activates and begins to emit heat': 'Vereister Echolith A4 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': 'Mémolithe Congelé A1 e et la glace s\'est fragilisée',
        'The icebound tomelith A2 activates and begins to emit heat': 'Mémolithe Congelé A2 e et la glace s\'est fragilisée',
        'The icebound tomelith A3 activates and begins to emit heat': 'Mémolithe Congelé A3 e et la glace s\'est fragilisée',
        'The icebound tomelith A4 activates and begins to emit heat': 'Mémolithe Congelé A4 e et la glace s\'est fragilisée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': 'アイスドトームリスA1号基が起動し、氷がもろくなった！',
        'The icebound tomelith A2 activates and begins to emit heat': 'アイスドトームリスA2号基が起動し、氷がもろくなった！',
        'The icebound tomelith A3 activates and begins to emit heat': 'アイスドトームリスA3号基が起動し、氷がもろくなった！',
        'The icebound tomelith A4 activates and begins to emit heat': 'アイスドトームリスA4号基が起動し、氷がもろくなった！',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': '冰封的石文A1启动了，冰块变得脆弱了！',
        'The icebound tomelith A2 activates and begins to emit heat': '冰封的石文A2启动了，冰块变得脆弱了！',
        'The icebound tomelith A3 activates and begins to emit heat': '冰封的石文A3启动了，冰块变得脆弱了！',
        'The icebound tomelith A4 activates and begins to emit heat': '冰封的石文A4启动了，冰块变得脆弱了！',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': '얼음탑 A1호기가 기동하여 표면이 녹기 시작합니다!',
        'The icebound tomelith A2 activates and begins to emit heat': '얼음탑 A2호기가 기동하여 표면이 녹기 시작합니다!',
        'The icebound tomelith A3 activates and begins to emit heat': '얼음탑 A3호기가 기동하여 표면이 녹기 시작합니다!',
        'The icebound tomelith A4 activates and begins to emit heat': '얼음탑 A4호기가 기동하여 표면이 녹기 시작합니다!',
      },
    },
  ],
};

export default triggerSet;
