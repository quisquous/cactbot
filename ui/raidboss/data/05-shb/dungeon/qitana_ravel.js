'use strict';

[{
  zoneRegex: {
    en: /^[tT]he Qitana Ravel$/,
    ko: /^키타나 신굴$/,
  },
  timelineFile: 'qitana_ravel.txt',
  triggers: [
    {
      id: 'Qitana Stonefist',
      regex: Regexes.startsUsing({ id: '3C89', source: 'Lozatl' }),
      regexDe: Regexes.startsUsing({ id: '3C89', source: 'Lozatl' }),
      regexFr: Regexes.startsUsing({ id: '3C89', source: 'Lozatl' }),
      regexJa: Regexes.startsUsing({ id: '3C89', source: 'ロツァトル' }),
      regexCn: Regexes.startsUsing({ id: '3C89', source: '洛查特尔' }),
      regexKo: Regexes.startsUsing({ id: '3C89', source: '로차틀' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ko: '나에게 탱크버스터',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ko: data.ShortName(matches.target) + '에게 탱크버스터',
          };
        }
      },
    },
    {
      id: 'Qitana Scorn',
      regex: Regexes.startsUsing({ id: '3C8B', source: 'Lozatl', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C8B', source: 'Lozatl', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C8B', source: 'Lozatl', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C8B', source: 'ロツァトル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C8B', source: '洛查特尔', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C8B', source: '로차틀', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ko: '전체 공격',
      },
    },
    {
      id: 'Qitana Eerie Pillar',
      regex: Regexes.startsUsing({ id: '3C8B', source: 'Lozatl', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C8B', source: 'Lozatl', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C8B', source: 'Lozatl', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C8B', source: 'ロツァトル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C8B', source: '洛查特尔', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C8B', source: '로차틀', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Look for pillar',
        de: 'Auf die Pfeiler schauen',
        fr: 'Cherchez les piliers',
        ko: '빛나는 기둥 찾기',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: Regexes.startsUsing({ id: '3C8D', source: 'Lozatl', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C8D', source: 'Lozatl', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C8D', source: 'Lozatl', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C8D', source: 'ロツァトル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C8D', source: '洛查特尔', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C8D', source: '로차틀', capture: false }),
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on left flank',
        de: 'Auf seiner linken Seite stehen',
        fr: 'Restez sur le flanc gauche',
        ko: '왼쪽 측면으로',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: Regexes.startsUsing({ id: '3C8E', source: 'Lozatl', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C8E', source: 'Lozatl', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C8E', source: 'Lozatl', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C8E', source: 'ロツァトル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C8E', source: '洛查特尔', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C8E', source: '로차틀', capture: false }),
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on right flank',
        de: 'Auf seiner rechten Seite stehen',
        fr: 'Restez sur le flanc droit',
        ko: '오른쪽 측면으로',
      },
    },
    {
      id: 'Qitana Ripper Fang',
      regex: Regexes.startsUsing({ id: '3C91', source: 'Batsquatch' }),
      regexDe: Regexes.startsUsing({ id: '3C91', source: 'Fledersquatch' }),
      regexFr: Regexes.startsUsing({ id: '3C91', source: 'Batsquatch' }),
      regexJa: Regexes.startsUsing({ id: '3C91', source: 'バッツカッチ' }),
      regexCn: Regexes.startsUsing({ id: '3C91', source: '大脚野蝠' }),
      regexKo: Regexes.startsUsing({ id: '3C91', source: '배츠콰치' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ko: '나에게 탱크버스터',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ko: data.ShortName(matches.target) + '에게 탱크버스터',
          };
        }
      },
    },
    {
      id: 'Qitana Soundwave',
      regex: Regexes.startsUsing({ id: '3C92', source: 'Batsquatch', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C92', source: 'Fledersquatch', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C92', source: 'Batsquatch', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C92', source: 'バッツカッチ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C92', source: '大脚野蝠', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C92', source: '배츠콰치', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ko: '전체 공격',
      },
    },
    {
      id: 'Qitana Subsonics',
      regex: Regexes.startsUsing({ id: '3C93', source: 'Batsquatch', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C93', source: 'Fledersquatch', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C93', source: 'Batsquatch', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C93', source: 'バッツカッチ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C93', source: '大脚野蝠', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C93', source: '배츠콰치', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoes',
        de: 'AoEs',
        fr: 'Dégâts de zone',
        ko: '연속 전체 공격',
      },
    },
    {
      id: 'Qitana Rend',
      regex: Regexes.startsUsing({ id: '3C99', source: 'Eros' }),
      regexDe: Regexes.startsUsing({ id: '3C99', source: 'Eros' }),
      regexFr: Regexes.startsUsing({ id: '3C99', source: 'Éros' }),
      regexJa: Regexes.startsUsing({ id: '3C99', source: 'エロース' }),
      regexCn: Regexes.startsUsing({ id: '3C99', source: '艾洛斯' }),
      regexKo: Regexes.startsUsing({ id: '3C99', source: '에로스' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ko: '나에게 탱크버스터',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ko: data.ShortName(matches.target) + '에게 탱크버스터',
          };
        }
      },
    },
    {
      id: 'Qitana Glossolalia',
      regex: Regexes.startsUsing({ id: '3C9B', source: 'Eros', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C9B', source: 'Eros', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C9B', source: 'Éros', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C9B', source: 'エロース', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C9B', source: '艾洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C9B', source: '에로스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ko: '전체 공격',
      },
    },
    {
      id: 'Qitana Hound Tether',
      regex: Regexes.tether({ id: '0039', source: 'Eros' }),
      regexDe: Regexes.tether({ id: '0039', source: 'Eros' }),
      regexFr: Regexes.tether({ id: '0039', source: 'Éros' }),
      regexJa: Regexes.tether({ id: '0039', source: 'エロース' }),
      regexCn: Regexes.tether({ id: '0039', source: '艾洛斯' }),
      regexKo: Regexes.tether({ id: '0039', source: '에로스' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Run Away From Boss',
        de: 'Renn weg vom Boss',
        fr: 'Courez loin du boss',
        ko: '보스와 거리 벌리기',
      },
    },
    {
      id: 'Qitana Viper Poison',
      regex: Regexes.headMarker({ id: '00AB' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Drop Poison Outside',
        de: 'Gift am Rand ablegen',
        fr: 'Posez le poison à l\'extérieur',
        ko: '독 장판을 바깥 쪽에 버리기',
      },
    },
    {
      id: 'Qitana Confession of Faith Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack Middle on YOU',
            de: 'In der Mitte auf DIR sammeln',
            fr: 'Package au milieu sur VOUS',
            ko: '보스 정면에서 모이기',
          };
        }
        return {
          en: 'Stack Middle on ' + data.ShortName(matches.target),
          de: 'In Der Mitte auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package au milieu sur ' + data.ShortName(matches.target),
          ko: data.ShortName(matches.target) + '에게 모이기',
        };
      },
    },
    {
      id: 'Qitana Confession of Faith Spread',
      regex: Regexes.startsUsing({ id: '3CA1', source: 'Eros', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3CA1', source: 'Eros', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3CA1', source: 'Éros', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3CA1', source: 'エロース', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3CA1', source: '艾洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3CA1', source: '에로스', capture: false }),
      alertText: {
        en: 'Spread to Sides',
        de: 'Auf die Seiten verteilen',
        fr: 'Dispersez-vous sur les bords',
        ko: '좌우 측면으로 산개',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Batsquatch': 'Fledersquatch',
        'Eros': 'Eros',
        'Lozatl': 'Lozatl',
        'The Divine Threshold': 'Götterpforte',
        'Shadowed Hollow': 'Bildnishalle',
        'The Song of Ox\'Gatorl': 'Altar des Ox\'Gatorl',
      },
      'replaceText': {
        'Confession Of Faith': 'Glaubensbekenntnis',
        'Glossolalia': 'Glossolalie',
        'Heat Up': 'Erhitzung',
        'Heaving Breath': 'Wogender Atem',
        'Hound Out Of Heaven': 'Himmelsangriff',
        'Inhale': 'Einsaugen',
        'Jump': 'Sprung',
        'Lozatl\'s Fury': 'Lozatls Wut',
        'Lozatl\'s Scorn': 'Lozatls Hohn',
        'Rend': 'Zerreißen',
        'Ripper Fang': 'Fetzzahn',
        'Ronkan Light': 'Licht Ronkas/Ronkalicht',
        'Soundwave': 'Schallwelle',
        'Stonefist': 'Steinfaust',
        'Subsonics': 'Unterschall',
        'Sun Toss': 'Projektion',
        'Towerfall': 'Turmsturz',
        'Viper Poison': 'Viperngift',
      },
    },
  ],
}];
