import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheBurdenOfTheFatherSavage,
  timelineFile: 'a4s.txt',
  timelineTriggers: [
    {
      id: 'A4S Hydrothermal Missile',
      regex: /Hydrothermal Missile/,
      beforeSeconds: 5,
      suppressSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'A4S Discord Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00AE' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.orbsOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.orbsOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        orbsOn: {
          en: 'Orbs on ${player}',
          de: 'Orbs auf ${player}',
          fr: 'Orbes sur ${player}',
          ja: '${player}に玉',
          cn: '球点${player}',
          ko: '"${player}" 구슬',
        },
        orbsOnYou: {
          en: 'Orbs on YOU',
          de: 'Orbs auf DIR',
          fr: 'Orbes sur VOUS',
          ja: '自分に玉',
          cn: '球点名',
          ko: '구슬 대상자',
        },
      },
    },
    {
      // Stun Resistance.
      id: 'A4S Stun Leg',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '27' }),
      condition: (data) => data.CanStun(),
      alertText: (_data, matches, output) => output.text!({ name: matches.target }),
      outputStrings: {
        text: {
          en: 'Stun ${name}',
          de: 'Unterbreche ${name}',
          fr: 'Stun ${name}',
          ja: 'スタン: ${name}',
          cn: '眩晕${name}',
          ko: '${name}기절 시키기',
        },
      },
    },
    {
      id: 'A4S Mortal Revolution',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: '13E7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: '13E7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: '13E7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: '13E7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: '13E7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: '13E7', capture: false }),
      response: Responses.aoe('alert'),
    },
    {
      // This is an 0011 tether, but there's not an easy way to know who it is on 100%,
      // as a set of tethers come out from bits and some may be pre-intercepted.
      id: 'A4S Carnage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F5E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F5E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F5E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F5E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F5E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F5E', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Laser Tethers',
          de: 'Laser Verbindungen',
          fr: 'Liens laser',
          ja: 'レーザー線',
          cn: '镭射连线',
          ko: '레이저 선',
        },
      },
    },
    {
      id: 'A4S Judgment Nisi A',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F64' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F64' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F64' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F64' }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F64' }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F64' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Nisi A on YOU',
          de: 'Nisi A auf DIR',
          fr: 'Peine A sur VOUS',
          ja: '自分に仮判決α',
          cn: '蓝BUFF点名',
          ko: '임시 판결 A 대상자',
        },
      },
    },
    {
      id: 'A4S Judgment Nisi B',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F65' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F65' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F65' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F65' }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F65' }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F65' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Nisi B on YOU',
          de: 'Nisi B auf DIR',
          fr: 'Peine B sur VOUS',
          ja: '自分に仮判決β',
          cn: '红BUFF点名',
          ko: '임시 판결 B 대상자',
        },
      },
    },
    {
      id: 'A4S Carnage Zero',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F5E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F5E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F5E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F5E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F5E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F5E', capture: false }),
      response: Responses.spread('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Manipulator': 'Manipulator',
      },
      'replaceText': {
        'Carnage(?! Zero)': 'Carnage',
        'Carnage Zero': 'Carnage Zero',
        'Discoid': 'Diskoid',
        'Emergency Quarantine': 'Notquarantäne',
        'Hydrothermal Missile': 'Hydrothermales Geschoss',
        'Jagd Doll': 'Jagdpuppe',
        'Judgment Nisi': 'Vorläufige Vollstreckung',
        'Mortal Revolution': 'Rechte Retribution',
        'Perpetual Ray': 'Perpetueller Strahl',
        'Royal Pentacle': 'Penta-Kaustik',
        'Seed Of The Sky': 'Samen des Himmels',
        'Straf Doll': 'Strafpuppe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Manipulator': 'Manipulateur',
      },
      'replaceText': {
        'Carnage(?! Zero)': 'Carnage',
        'Carnage Zero': 'Carnage Zéro',
        'Discoid': 'Discoïde',
        'Emergency Quarantine': 'Quarantaine d\'urgence',
        'Hydrothermal Missile': 'Missile hydrothermique',
        'Jagd Doll': 'Poupée jagd',
        'Judgment Nisi': 'Jugement conditionnel',
        'Mortal Revolution': 'Révolution mortelle',
        'Perpetual Ray': 'Rayon perpétuel',
        'Royal Pentacle': 'Pentacle royal',
        'Seed Of The Sky': 'Graine du ciel',
        'Straf Doll': 'Poupée straf',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Manipulator': 'マニピュレーター',
      },
      'replaceText': {
        'Carnage(?! Zero)': 'カーネイジ',
        'Carnage Zero': 'カーネイジ・ゼロ',
        'Discoid': 'ディスコイド',
        'Emergency Quarantine': '緊急隔離',
        'Hydrothermal Missile': '蒸気ミサイル',
        'Jagd Doll': 'ヤークトドール',
        'Judgment Nisi': 'ジャッジメントナイサイ',
        'Mortal Revolution': 'モータルレボリューション',
        'Perpetual Ray': 'パーペチュアルレイ',
        'Royal Pentacle': 'スチームジャッジ',
        'Seed Of The Sky': 'シード・オブ・スカイ',
        'Straf Doll': 'ストラッフドール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Manipulator': '操纵者',
      },
      'replaceText': {
        'Carnage(?! Zero)': '灭绝',
        'Carnage Zero': '零式灭绝',
        'Discoid': '圆盘',
        'Emergency Quarantine': '紧急隔离',
        'Hydrothermal Missile': '蒸汽导弹',
        'Jagd Doll': '狩猎人偶',
        'Judgment Nisi': '非最终审判',
        'Mortal Revolution': '致命进化',
        'Perpetual Ray': '永恒射线',
        'Royal Pentacle': '蒸汽审判',
        'Seed Of The Sky': '天空之种',
        'Straf Doll': '惩罚人偶',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Manipulator': '조종자',
      },
      'replaceText': {
        'Carnage(?! Zero)': '대학살',
        'Carnage Zero': '대학살의 근원',
        'Discoid': '원반',
        'Emergency Quarantine': '긴급 격리',
        'Hydrothermal Missile': '증기 미사일',
        'Jagd Doll': '인형 수렵병',
        'Judgment Nisi': '임시처분',
        'Mortal Revolution': '필멸의 격변',
        'Perpetual Ray': '영원한 빛줄기',
        'Royal Pentacle': '증기 심판',
        'Seed Of The Sky': '하늘의 원천',
        'Straf Doll': '인형 기총병',
      },
    },
  ],
};

export default triggerSet;
