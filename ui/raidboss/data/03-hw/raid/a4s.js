'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Burden Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章4\)$/,
  },
  zoneId: ZoneId.AlexanderTheBurdenOfTheFatherSavage,
  timelineFile: 'a4s.txt',
  timelineTriggers: [
    {
      id: 'A4S Hydrothermal Missile',
      beforeSeconds: 5,
      suppressSeconds: 5,
      response: Responses.tankCleave('info'),
    },
  ],
  triggers: [
    {
      id: 'A4S Discord Marker',
      netRegex: NetRegexes.headMarker({ id: '00AE' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Orbs on YOU',
            de: 'Orbs auf DIR',
            fr: 'Orbes sur Vous',
            cn: '球点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Orbs on ' + data.ShortName(matches.target),
            de: 'Orbs auf ' + data.ShortName(matches.target),
            fr: 'Orbes sur ' + data.ShortName(matches.target),
            cn: '球点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      // Stun Resistance.
      id: 'A4S Stun Leg',
      netRegex: NetRegexes.losesEffect({ effectId: '27' }),
      condition: function(data) {
        return data.CanStun();
      },
      alertText: function(data, matches) {
        return {
          en: 'Stun ' + matches.target,
          de: 'Unterbreche ' + matches.target,
          fr: 'Stun ' + matches.target,
          cn: '眩晕' + matches.target,
        };
      },
    },
    {
      id: 'A4S Mortal Revolution',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: '13E7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: '13E7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: '13E7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: '13E7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: '13E7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: '13E7', capture: false }),
      response: Responses.aoe('alert'),
    },
    {
      // This is an 0011 tether, but there's not an easy way to know who it is on 100%,
      // as a set of tethers come out from bits and some may be pre-intercepted.
      id: 'A4S Carnage',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F5E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F5E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F5E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F5E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F5E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F5E', capture: false }),
      infoText: {
        en: 'Laser Tethers',
        de: 'Laser Verbindungen',
        fr: 'Liens laser',
        cn: '镭射连线',
      },
    },
    {
      id: 'A4S Judgment Nisi A',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F64' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F64' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F64' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F64' }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F64' }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F64' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Nisi A on YOU',
        de: 'Nisi A auf DIR',
        fr: 'Peine A sur VOUS',
        cn: '蓝BUFF点名',
      },
    },
    {
      id: 'A4S Judgment Nisi B',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F65' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F65' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F65' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F65' }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F65' }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F65' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Nisi B on YOU',
        de: 'Nisi B auf DIR',
        fr: 'Peine B sur VOUS',
        cn: '红BUFF点名',
      },
    },
    {
      id: 'A4S Carnage Zero',
      netRegex: NetRegexes.startsUsing({ source: 'The Manipulator', id: 'F5E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Manipulator', id: 'F5E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Manipulateur', id: 'F5E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'マニピュレーター', id: 'F5E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조종자', id: 'F5E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '操纵者', id: 'F5E', capture: false }),
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
}];
