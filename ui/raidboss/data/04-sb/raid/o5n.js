'use strict';

// O5N - Sigmascape 1.0 Normal
[{
  zoneRegex: /^Sigmascape \(V1\.0\)$/,
  timelineFile: 'o5n.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'O5N Stop Combat',
      regex: Regexes.removingCombatant({ name: 'Phantom Train', capture: false }),
      regexDe: Regexes.removingCombatant({ name: 'Phantomzug', capture: false }),
      regexFr: Regexes.removingCombatant({ name: 'Train Fantôme', capture: false }),
      regexJa: Regexes.removingCombatant({ name: '魔列車', capture: false }),
      regexCn: Regexes.removingCombatant({ name: '魔列车', capture: false }),
      regexKo: Regexes.removingCombatant({ name: '마열차', capture: false }),
      run: function(data) {
        data.StopCombat();
      },
    },

    {
      id: 'O5N Doom Strike',
      regex: Regexes.startsUsing({ source: 'Phantom Train', id: '28A3' }),
      regexDe: Regexes.startsUsing({ source: 'Phantomzug', id: '28A3' }),
      regexFr: Regexes.startsUsing({ source: 'Train Fantôme', id: '28A3' }),
      regexJa: Regexes.startsUsing({ source: '魔列車', id: '28A3' }),
      regexCn: Regexes.startsUsing({ source: '魔列车', id: '28A3' }),
      regexKo: Regexes.startsUsing({ source: '마열차', id: '28A3' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tank Buster auf DIR',
            fr: 'Tank Buster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
            fr: 'Buster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'tenkbasta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O5N Head On',
      regex: Regexes.startsUsing({ id: '28A4', source: 'Phantom Train', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28A4', source: 'Phantomzug', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28A4', source: 'Train Fantôme', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28A4', source: '魔列車', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28A4', source: '魔列车', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28A4', source: '마열차', capture: false }),
      alertText: {
        en: 'Go to back',
        de: 'Nach hinten laufen',
        fr: 'S\'éloigner',
      },
      tts: {
        en: 'run away',
        de: 'ab nach hinten',
        fr: 's\'éloigner',
      },
    },
    {
      id: 'O5N Diabolic Headlamp',
      regex: Regexes.startsUsing({ id: '28A6', source: 'Phantom Train', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28A6', source: 'Phantomzug', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28A6', source: 'Train Fantôme', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28A6', source: '魔列車', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28A6', source: '魔列车', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28A6', source: '마열차', capture: false }),
      alertText: {
        en: 'Stack middle',
        de: 'Stack in der Mitte',
        fr: 'Stack au milieu',
      },
    },
    {
      id: 'O5N Diabolic Light',
      regex: Regexes.headMarker({ id: '0001' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Light',
        de: 'Licht',
        fr: 'Lumière',
      },
    },
    {
      id: 'O5N Diabolic Wind',
      regex: Regexes.headMarker({ id: '0046' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Wind',
        de: 'Wind',
        fr: 'Vent',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Agony': 'Gequälter Geist',
        'Doom Chimney': 'unheilvoll(?:e|er|es|en) Schornstein',
        'Malice': 'Boshaftigkeit',
        'Phantom Train': 'Phantomzug',
        'Putrid Passenger': 'faulig(?:e|er|es|en) Fahrgast',
        'Remorse': 'melancholisch(?:e|er|es|en) Geist',
        'Wroth Ghost': 'erzürnt(?:e|er|es|en) Geist',
      },
      'replaceText': {
        'Acid Rain': 'Säureregen',
        'Add Wave': 'Add Welle',
        'All In The Mind': 'Psychokinese',
        'Crossing Whistle': 'Kreuzend Pfeife',
        'Diabolic Chimney': 'Diabolischer Schlot',
        'Diabolic Headlamp': 'Diabolische Leuchte',
        'Diabolic Light': 'Diabolisches Licht',
        'Diabolic Whistle': 'Diabolische Pfeife',
        'Diabolic Wind': 'Diabolischer Wind',
        'Doom Strike': 'Vernichtungsschlag',
        'Encumber': 'Wegsperrung',
        'Ghost Beams': 'Geisterstrahlen',
        'Ghosts': 'Geister',
        'Head On': 'Frontalangriff',
        'Possess': 'Besessenheit',
        'Saintly Beam': 'Heiligenstrahl',
        'Tether Whistle': 'Verfolger Pfeife',
      },
      '~effectNames': {
        'Connectivity': 'Kopplung',
        'Prey': 'Beute',
        'Stun': 'Betäubung',
        'Throttle': 'Gas geben',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Agony': 'Fantôme Souffrant',
        'Doom Chimney': 'cheminée maléfique',
        'Malice': 'Malveillance',
        'Phantom Train': 'train fantôme',
        'Putrid Passenger': 'passager putride',
        'Remorse': 'fantôme mélancolique',
        'Wroth Ghost': 'fantôme furieux',
      },
      'replaceText': {
        'Acid Rain': 'Pluie acide',
        'Add Wave': 'Vague d\'Adds',
        'All In The Mind': 'Force de volonté',
        'Crossing Whistle': 'Sifflet traversée',
        'Diabolic Chimney': 'Cheminée diabolique',
        'Diabolic Headlamp': 'Phare diabolique',
        'Diabolic Light': 'Lueur diabolique',
        'Diabolic Whistle': 'Sifflet diabolique',
        'Diabolic Wind': 'Vent diabolique',
        'Doom Strike': 'Frappe létale',
        'Encumber': 'Encombrement',
        'Ghost Beams': 'Faisceaux Sacrés',
        'Ghosts': 'Fantômes',
        'Head On': 'Plein fouet',
        'Possess': 'Possession',
        'Saintly Beam': 'Faisceaux sacrés',
        'Tether Whistle': 'Sifflet liens',
      },
      '~effectNames': {
        'Connectivity': 'Attelage',
        'Prey': 'Proie',
        'Stun': 'Étourdissement',
        'Throttle': 'Cadence améliorée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Agony': '苦悶のゴースト',
        'Doom Chimney': '魔煙突',
        'Malice': '怨念',
        'Phantom Train': '魔列車',
        'Putrid Passenger': 'ゾンビー・パッセンジャー',
        'Remorse': '未練のゴースト',
        'Wroth Ghost': 'ロスゴースト',
      },
      'replaceText': {
        'Acid Rain': '酸性雨',
        'Add Wave': 'Add Wave', // FIXME
        'All In The Mind': '念力',
        'Crossing Whistle': 'Crossing Whistle', // FIXME
        'Diabolic Chimney': '魔界の噴煙',
        'Diabolic Headlamp': '魔界の前照灯',
        'Diabolic Light': '魔界の光',
        'Diabolic Whistle': '魔界の汽笛',
        'Diabolic Wind': '魔界の風',
        'Doom Strike': '魔霊撃',
        'Encumber': '進路妨害',
        'Ghost Beams': 'Ghost Beams', // FIXME
        'Ghosts': 'Ghosts', // FIXME
        'Head On': '追突',
        'Possess': '取り憑く',
        'Saintly Beam': 'セイントビーム',
        'Tether Whistle': 'Tether Whistle', // FIXME
      },
      '~effectNames': {
        'Connectivity': '連結',
        'Prey': 'プレイ',
        'Stun': 'スタン',
        'Throttle': 'スロットル',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Agony': '苦闷幽灵',
        'Doom Chimney': '魔烟囱',
        'Malice': '怨念',
        'Phantom Train': '魔列车',
        'Putrid Passenger': '僵尸乘客',
        'Remorse': '留恋幽灵',
        'Wroth Ghost': '怒灵',
      },
      'replaceText': {
        'Acid Rain': '酸雨',
        'Add Wave': 'Add Wave', // FIXME
        'All In The Mind': '念力',
        'Crossing Whistle': 'Crossing Whistle', // FIXME
        'Diabolic Chimney': '魔界喷烟',
        'Diabolic Headlamp': '魔界前照灯',
        'Diabolic Light': '魔界光',
        'Diabolic Whistle': '魔界汽笛',
        'Diabolic Wind': '魔界风',
        'Doom Strike': '魔灵击',
        'Encumber': '挡路',
        'Ghost Beams': 'Ghost Beams', // FIXME
        'Ghosts': 'Ghosts', // FIXME
        'Head On': '追尾',
        'Possess': '附身',
        'Saintly Beam': '圣光射线',
        'Tether Whistle': 'Tether Whistle', // FIXME
      },
      '~effectNames': {
        'Connectivity': '连接',
        'Prey': 'プレイ',
        'Stun': '眩晕',
        'Throttle': '轰油起步',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Agony': '고뇌하는 유령',
        'Doom Chimney': '마열차 굴뚝',
        'Malice': '원한',
        'Phantom Train': '마열차',
        'Putrid Passenger': '좀비 승객',
        'Remorse': '미련이 남은 유령',
        'Wroth Ghost': '격노하는 유령',
      },
      'replaceText': {
        'Acid Rain': '산성비',
        'Add Wave': 'Add Wave', // FIXME
        'All In The Mind': '염력',
        'Crossing Whistle': 'Crossing Whistle', // FIXME
        'Diabolic Chimney': '마계의 연기',
        'Diabolic Headlamp': '마계의 전조등',
        'Diabolic Light': '마계의 빛',
        'Diabolic Whistle': '마계의 경적',
        'Diabolic Wind': '마계의 바람',
        'Doom Strike': '마령격',
        'Encumber': '진로 방해',
        'Ghost Beams': 'Ghost Beams', // FIXME
        'Ghosts': 'Ghosts', // FIXME
        'Head On': '추돌',
        'Possess': '빙의',
        'Saintly Beam': '성스러운 광선',
        'Tether Whistle': 'Tether Whistle', // FIXME
      },
      '~effectNames': {
        'Connectivity': '연결',
        'Prey': 'プレイ',
        'Stun': '기절',
        'Throttle': '고속 주행',
      },
    },
  ],
}];
