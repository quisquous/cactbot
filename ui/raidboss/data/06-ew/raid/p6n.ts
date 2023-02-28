import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Find some data, any data, in the network logs that will let us call Polyominous Dark.
// and Transmission.

export interface Data extends RaidbossData {
  busterTargets: string[];
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSixthCircle,
  timelineFile: 'p6n.txt',
  initData: () => {
    return {
      busterTargets: [],
    };
  },
  triggers: [
    {
      id: 'P6N Hemitheos Dark IV',
      type: 'StartsUsing',
      netRegex: { id: '784E', source: 'Hegemone', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P6N Choros Ixou Sides',
      type: 'StartsUsing',
      netRegex: { id: '7858', source: 'Hegemone', capture: false },
      response: Responses.goFrontBack(),
    },
    {
      id: 'P6N Choros Ixou Front Back',
      type: 'StartsUsing',
      netRegex: { id: '7857', source: 'Hegemone', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'P6N Synergy Collect',
      type: 'HeadMarker',
      netRegex: { id: '0157' },
      run: (data, matches) => data.busterTargets.push(matches.target),
    },
    {
      id: 'P6N Synergy Call',
      type: 'HeadMarker',
      netRegex: { id: '0157', capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.busterTargets.includes(data.me))
          return output.markerYou!();
        return output.avoid!();
      },
      outputStrings: {
        markerYou: Outputs.tankCleave,
        avoid: Outputs.avoidTankCleave,
      },
    },
    {
      id: 'P6N Synergy Cleanup',
      type: 'HeadMarker',
      netRegex: { id: '0157', capture: false },
      delaySeconds: 5,
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'P6N Glossomorph Initial',
      type: 'GainsEffect',
      netRegex: { effectId: 'CF2' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        if (parseFloat(matches.duration) > 15)
          return output.second!();
        return output.first!();
      },
      outputStrings: {
        first: {
          en: 'Short parasite on YOU',
          de: 'Kurzer Parasit auf DIR',
          fr: 'Parasite court sur VOUS',
          ja: '自分に短い寄生',
          cn: '短寄生点名',
          ko: '짧은 기생 디버프 대상자',
        },
        second: {
          en: 'Long parasite on YOU',
          de: 'Langer Parasit auf DIR',
          fr: 'Parasite long sur VOUS',
          ja: '自分に長い寄生',
          cn: '长寄生点名',
          ko: '긴 기생 디버프 대상자',
        },
      },
    },
    {
      id: 'P6N Glossomorph Call',
      type: 'GainsEffect',
      netRegex: { effectId: 'CF2' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Face outside: Parasite',
          de: 'Nach außen schauen: Parasit',
          fr: 'Regardez vers l\'extérieur : Parasite',
          ja: '外向き：寄生',
          cn: '面向外面: 寄生',
          ko: '바깥 보기: 기생',
        },
      },
    },
    {
      // 00A7 is the orange clockwise indicator. 00A8 is the blue counterclockwise one.
      id: 'P6N Strophe Ixou',
      type: 'HeadMarker',
      netRegex: { id: ['00A7', '00A8'] },
      infoText: (_data, matches, output) =>
        matches.id === '00A7' ? output.left!() : output.right!(),
      outputStrings: {
        left: {
          en: 'Rotate left',
          de: 'Nach links rotieren',
          fr: 'Tournez vers la gauche',
          ja: '左回り',
          cn: '向左转',
          ko: '왼쪽으로 회전',
        },
        right: {
          en: 'Rotate right',
          de: 'Nach rechts rotieren',
          fr: 'Tournez vers la droite',
          ja: '右回り',
          cn: '向右转',
          ko: '오른쪽으로 회전',
        },
      },
    },
    {
      id: 'P6N Dark Ashes',
      type: 'HeadMarker',
      netRegex: { id: '0065' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P6N Aetherial Exchange',
      type: 'Ability',
      netRegex: { id: '784D', source: 'Hegemone', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Be opposite tethered safespot',
          de: 'Sei gegenüber dem verbundenen, sicheren Platz',
          fr: 'Placez vous sur la zone sûre de l\'élément opposé',
          ja: '線が繋がってる安置へ移動',
          cn: '去连线方格对侧安全区',
          ko: '선 연결된 기둥의 안전지대로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hegemone': 'Hegemone',
        'Parasitos': 'Parasit',
      },
      'replaceText': {
        'random': 'Zufällig',
        'sides': 'Seiten',
        'front': 'Vorne',
        'back': 'Hinten',
        'Aetherial Exchange': 'Ätherwechsel',
        'Aetheric Polyominoid': 'Äther-Polyomino',
        'Choros Ixou': 'Choros Ixou',
        'Dark Ashes': 'Dunkle Asche',
        'Hemitheos\'s Dark IV': 'Hemitheisches Nachtka',
        'Polyominoid Sigma': 'Äther-Polyomino Σ',
        'Polyominous Dark IV': 'Neka-Polyomino',
        'Reek Havoc': 'Gasausstoß',
        'Strophe Ixou': 'Strophe Ixou',
        'Synergy': 'Synergie',
        'Transmission': 'Parasitismus',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'Hégémone',
        'Parasitos': 'créature parasite',
      },
      'replaceText': {
        'Aetherial Exchange': 'Changement éthéréen',
        'Aetheric Polyominoid': 'Polyomino éthéré',
        'Choros Ixou': 'Choros Ixou',
        'Dark Ashes': 'Cendres ténébreuses',
        'Hemitheos\'s Dark IV': 'Giga Ténèbres d\'hémithéos',
        'Polyominoid Sigma': 'Polyomino éthéré Σ',
        'Polyominous Dark IV': 'Polyomino Giga Ténèbres',
        'Reek Havoc': 'Exhalaison',
        'Strophe Ixou': 'Strophe Ixou',
        'Synergy': 'Synergie',
        'Transmission': 'Parasitage',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'ヘーゲモネー',
        'Parasitos': '寄生生物',
      },
      'replaceText': {
        'Aetherial Exchange': 'エーテルチェンジ',
        'Aetheric Polyominoid': 'エーテル・ポリオミノ',
        'Choros Ixou': 'ホロス・イクソス',
        'Dark Ashes': 'ダークアッシュ',
        'Hemitheos\'s Dark IV': 'ヘーミテオス・ダージャ',
        'Polyominoid Sigma': 'エーテル・ポリオミノΣ',
        'Polyominous Dark IV': 'ダージャ・ポリオミノ',
        'Reek Havoc': '噴気',
        'Strophe Ixou': 'ストロペー・イクソス',
        'Synergy': 'シュネルギア',
        'Transmission': '寄生',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hegemone': '赫革摩涅',
        'Parasitos': '寄生生物',
      },
      'replaceText': {
        'random': '随机',
        'sides': '两侧',
        'front': '前方',
        'back': '后方',
        'Aetherial Exchange': '以太交换',
        'Aetheric Polyominoid': '以太多连方',
        'Choros Ixou': '寄生之舞',
        'Dark Ashes': '冥灰',
        'Hemitheos\'s Dark IV': '半神冥暗',
        'Polyominoid Sigma': '以太多连方Σ',
        'Polyominous Dark IV': '多连方冥暗',
        'Reek Havoc': '喷气',
        'Strophe Ixou': '寄生之旋',
        'Synergy': '协同',
        'Transmission': '寄生传染',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Hegemone': '헤게모네',
        'Parasitos': '기생생물',
      },
      'replaceText': {
        'random': '랜덤',
        'sides': '옆',
        'front': '앞',
        'back': '뒤',
        'Aetherial Exchange': '에테르 변환',
        'Aetheric Polyominoid': '에테르 폴리오미노',
        'Choros Ixou': '기생체의 춤',
        'Dark Ashes': '어둠의 잿더미',
        'Hemitheos\'s Dark IV': '헤미테오스 다쟈',
        'Polyominoid Sigma': '에테르 폴리오미노Σ',
        'Polyominous Dark IV': '다쟈 폴리오미노',
        'Reek Havoc': '입김',
        'Strophe Ixou': '기생체의 회전',
        'Synergy': '협동 공격',
        'Transmission': '기생',
      },
    },
  ],
};

export default triggerSet;
