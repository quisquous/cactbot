'use strict';

// O5S - Sigmascape 1.0 Savage
// localization:
//   de: done
//   fr: missing replaceText, triggers
//   ja: missing replaceText, triggers
[{
  zoneRegex: /^Sigmascape V1\.0 \(Savage\)$/,
  timelineFile: 'o5s.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'O5S Stop Combat',
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
      id: 'O5S Doom Strike',
      regex: Regexes.startsUsing({ id: '28B1', source: 'Phantom Train' }),
      regexDe: Regexes.startsUsing({ id: '28B1', source: 'Phantomzug' }),
      regexFr: Regexes.startsUsing({ id: '28B1', source: 'Train Fantôme' }),
      regexJa: Regexes.startsUsing({ id: '28B1', source: '魔列車' }),
      regexCn: Regexes.startsUsing({ id: '28B1', source: '魔列车' }),
      regexKo: Regexes.startsUsing({ id: '28B1', source: '마열차' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tank Buster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ko: '탱버 → 나',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Buster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ko: '탱버 → ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ko: '탱버',
            ja: 'バスター',
          };
        }
      },
    },
    {
      id: 'O5S Head On',
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
        ko: '뒤로 이동',
        ja: '後ろへ',
      },
      tts: {
        en: 'run away',
        de: 'ab nach hinten',
        fr: 'S\'éloigner',
        ko: '뒤로 이동',
        ja: '後ろへ',
      },
    },
    {
      id: 'O5S Diabolic Headlamp',
      regex: Regexes.startsUsing({ id: '28B2', source: 'Phantom Train', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28B2', source: 'Phantomzug', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28B2', source: 'Train Fantôme', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28B2', source: '魔列車', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28B2', source: '魔列车', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28B2', source: '마열차', capture: false }),
      alertText: {
        en: 'Stack middle',
        de: 'Stack in der Mitte',
        fr: 'Stack au milieu',
        ko: '중앙으로 모이기',
        ja: '中央でスタック',
      },
    },
    {
      id: 'O5S Diabolic Light',
      regex: Regexes.headMarker({ id: '0001' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Light',
        de: 'Licht',
        fr: 'Lumière',
        ko: '빛장판',
        ja: 'ライト',
      },
    },
    {
      id: 'O5S Diabolic Wind',
      regex: Regexes.headMarker({ id: '0046' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Wind',
        de: 'Wind',
        fr: 'Vent',
        ko: '초록징',
        ja: '風',
      },
    },
    {
      id: 'O5S Remorse',
      regex: Regexes.addedCombatant({ name: 'Remorse', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Melancholisch(?:e|er|es|en) Geist', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Fantôme Mélancolique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '未練のゴースト', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '留恋幽灵', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '미련이 남은 유령', capture: false }),
      infoText: {
        en: 'Knockback Ghost',
        de: 'Rückstoß Geist',
        fr: 'Fantôme soufflant',
        ko: 'Fantôme soufflant',
        ja: 'ノックバックゴースト',
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
        ' Ghosts': ' Geister',
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
        'Ghosts spawn': 'Geister erscheinen',
        'Head On': 'Frontalangriff',
        'Knockback Whistle': 'Rückstoß Pfeife',
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
        ' Ghosts': ' Fantômes',
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
        'Ghosts spawn': 'Pop des Fantômes',
        'Head On': 'Plein fouet',
        'Knockback Whistle': 'Knockback Whistle', // FIXME
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
        ' Ghosts': ' Ghosts', // FIXME
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
        'Ghosts spawn': 'Ghosts spawn', // FIXME
        'Head On': '追突',
        'Knockback Whistle': 'Knockback Whistle', // FIXME
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
        ' Ghosts': ' Ghosts', // FIXME
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
        'Ghosts spawn': 'Ghosts spawn', // FIXME
        'Head On': '追尾',
        'Knockback Whistle': 'Knockback Whistle', // FIXME
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
        ' Ghosts': ' Ghosts', // FIXME
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
        'Ghosts spawn': 'Ghosts spawn', // FIXME
        'Head On': '추돌',
        'Knockback Whistle': 'Knockback Whistle', // FIXME
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
