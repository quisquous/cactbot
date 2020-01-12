'use strict';

// O12N - Alphascape 4.0
[{
  zoneRegex: /^Alphascape \(V4\.0\)$/,
  timelineFile: 'o12n.txt',
  timelineTriggers: [
    {
      id: 'O12N Knockback',
      regex: /Discharger/,
      beforeSeconds: 5,
      alertText: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Poussée',
      },
    },
  ],
  triggers: [
    {
      id: 'O12N Solar Ray',
      regex: Regexes.startsUsing({ id: ['330F', '3310'], source: ['Omega', 'Omega-M'] }),
      regexDe: Regexes.startsUsing({ id: ['330F', '3310'], source: ['Omega', 'Omega-M'] }),
      regexFr: Regexes.startsUsing({ id: ['330F', '3310'], source: ['Oméga', 'Oméga-M'] }),
      regexJa: Regexes.startsUsing({ id: ['330F', '3310'], source: ['オメガ', 'オメガM'] }),
      regexCn: Regexes.startsUsing({ id: ['330F', '3310'], source: ['欧米茄', '欧米茄M'] }),
      regexKo: Regexes.startsUsing({ id: ['330F', '3310'], source: ['오메가', '오메가 M'] }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer';
      },
      suppressSeconds: 1,
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tankbuster',
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O12N Optimized Blade Dance',
      regex: Regexes.startsUsing({ id: ['3321', '3322'], source: ['Omega', 'Omega-M'] }),
      regexDe: Regexes.startsUsing({ id: ['3321', '3322'], source: ['Omega', 'Omega-M'] }),
      regexFr: Regexes.startsUsing({ id: ['3321', '3322'], source: ['Oméga', 'Oméga-M'] }),
      regexJa: Regexes.startsUsing({ id: ['3321', '3322'], source: ['オメガ', 'オメガM'] }),
      regexCn: Regexes.startsUsing({ id: ['3321', '3322'], source: ['欧米茄', '欧米茄M'] }),
      regexKo: Regexes.startsUsing({ id: ['3321', '3322'], source: ['오메가', '오메가 M'] }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer';
      },
      suppressSeconds: 1,
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tankbuster',
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O12N Local Resonance',
      regex: Regexes.gainsEffect({ target: 'Omega', effect: 'Local Resonance', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Omega', effect: 'Resonanzprogramm: Nah', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Oméga', effect: 'Programme De Résonance: Proximité', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'オメガ', effect: 'レゾナンスプログラム：ニアー', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '欧米茄', effect: '共鸣程序：近', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '오메가', effect: '공명 프로그램: 근거리', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Move bosses apart',
        de: 'Bosse auseinander ziehen',
        fr: 'Ecartez les boss',
      },
    },
    {
      id: 'O12N Optimized Meteor',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        fr: 'Météore sur VOUS',
      },
    },
    {
      id: 'O12N Stack Spread Markers',
      regex: Regexes.headMarker({ id: '008B' }),
      alertText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Get Out',
          de: 'Raus da',
          fr: 'Sortez',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Stack',
          de: 'Stacken',
          fr: 'Packez vous',
        };
      },
    },
    {
      id: 'O12N Packet Filter F',
      regex: Regexes.gainsEffect({ effect: 'Packet Filter F' }),
      regexDe: Regexes.gainsEffect({ effect: 'Sicherungssystem W' }),
      regexFr: Regexes.gainsEffect({ effect: 'Programme Protecteur F' }),
      regexJa: Regexes.gainsEffect({ effect: 'ガードプログラムF' }),
      regexCn: Regexes.gainsEffect({ effect: '防护程序F' }),
      regexKo: Regexes.gainsEffect({ effect: '방어 프로그램 F' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Attack Omega-M',
        de: 'Omega-M angreifen',
        fr: 'Attaquez Oméga-M',
      },
    },
    {
      id: 'O12N Packet Filter M',
      regex: Regexes.gainsEffect({ effect: 'Packet Filter M' }),
      regexDe: Regexes.gainsEffect({ effect: 'Sicherungssystem M' }),
      regexFr: Regexes.gainsEffect({ effect: 'Programme Protecteur M' }),
      regexJa: Regexes.gainsEffect({ effect: 'ガードプログラムM' }),
      regexCn: Regexes.gainsEffect({ effect: '防护程序M' }),
      regexKo: Regexes.gainsEffect({ effect: '방어 프로그램 M' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Attack Omega-F',
        de: 'Omega-W angreifen',
        fr: 'Attaquez Oméga-F',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Omega': 'Omega',
        'Omega-F': 'Omega-W',
        'Omega-M': 'Omega-M',
        'Optical Unit': 'Optikmodul',
        'Progress to party combat': 'Initiiere Gruppenkampf',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Beyond Strength': 'Schildkombo G',
        'Cosmo Memory': 'Kosmospeicher',
        'Discharger': 'Entlader',
        'Efficient Bladework': 'Effiziente Klingenführung',
        'Electric Slide': 'Elektrosturz',
        'Enrage': 'Finalangriff',
        'Firewall': 'Sicherungssystem',
        'Floodlight': 'Flutlicht',
        'Ground Zero': 'Explosionszentrum',
        'Laser Shower': 'Laserschauer',
        'Optical Laser': 'Optischer Laser F',
        'Optimized Blade Dance': 'Omega-Schwertertanz',
        'Optimized Blizzard III': 'Omega-Eisga',
        'Optimized Fire III': 'Omega-Feuga',
        'Optimized Meteor': 'Omega-Meteor',
        'Optimized Passage of Arms': 'Optimierter Waffengang',
        'Optimized Sagittarius Arrow': 'Omega-Choral der Pfeile',
        'Program Alpha': 'Alpha-Programm',
        'Resonance': 'Resonanz',
        'Solar Ray': 'Sonnenstrahl',
        'Spotlight': 'Scheinwerfer',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Transformation M',
        'Superliminal Steel': 'Klingenkombo B',
        'Suppression': 'Hilfsprogramm F',
        'Synthetic Blades': 'Synthetische Klinge',
        'Synthetic Shield': 'Synthetischer Schild',
      },
      '~effectNames': {
        'Invincibility': 'Unverwundbar',
        'Local Resonance': 'Resonanzprogramm: Nah',
        'Omega': 'Omega',
        'Packet Filter F': 'Sicherungssystem F',
        'Packet Filter M': 'Sicherungssystem M',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Omega': 'Oméga',
        'Omega-F': 'Oméga-F',
        'Omega-M': 'Oméga-M',
        'Optical Unit': 'Unité optique',
        'Progress to party combat': 'Limites du combat en solitaire atteintes',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Beyond Strength': 'Combo bouclier G',
        'Cosmo Memory': 'Cosmomémoire',
        'Discharger': 'Déchargeur',
        'Efficient Bladework': 'Lame active',
        'Electric Slide': 'Glissement Oméga',
        'Enrage': 'Enrage',
        'Firewall': 'Programme protecteur',
        'Floodlight': 'Projecteur',
        'Ground Zero': 'Ruée féroce',
        'Laser Shower': 'Pluie de lasers',
        'Optical Laser': 'Laser optique F',
        'Optimized Blade Dance': 'Danse de la lame Oméga',
        'Optimized Blizzard III': 'Méga Glace Oméga',
        'Optimized Fire III': 'Méga Feu Oméga',
        'Optimized Meteor': 'Météore Oméga',
        'Optimized Passage of Arms': 'Passe d\'armes Oméga',
        'Optimized Sagittarius Arrow': 'Flèche du sagittaire Oméga',
        'Program Alpha': 'Programme Alpha',
        'Resonance': 'Résonance',
        'Solar Ray': 'Rayon solaire',
        'Spotlight': 'Phare',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Simulation de sujet M',
        'Superliminal Steel': 'Combo lame B',
        'Suppression': 'Programme d\'assistance F',
        'Synthetic Blades': 'Lame optionnelle',
        'Synthetic Shield': 'Bouclier optionnel',
      },
      '~effectNames': {
        'Invincibility': 'Invulnérable',
        'Local Resonance': 'Programme de résonance: proximité',
        'Omega': 'Oméga',
        'Packet Filter F': 'Programme protecteur F',
        'Packet Filter M': 'Programme protecteur M',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Omega': 'オメガ',
        'Omega-F': 'オメガF',
        'Omega-M': 'オメガM',
        'Optical Unit': 'オプチカルユニット',

        // FIXME
        'Progress to party combat': 'Progress to party combat',
      },
      'replaceText': {
        'Beyond Strength': 'シールドコンボG',
        'Cosmo Memory': 'コスモメモリー',
        'Discharger': 'ディスチャージャー',
        'Efficient Bladework': 'ソードアクション',
        'Electric Slide': 'オメガスライド',
        'Firewall': 'ガードプログラム',
        'Floodlight': 'フラッドライト',
        'Ground Zero': '急襲',
        'Laser Shower': 'レーザーシャワー',
        'Optical Laser': 'オプチカルレーザーF',
        'Optimized Blade Dance': 'ブレードダンス・オメガ',
        'Optimized Blizzard III': 'ブリザガ・オメガ',
        'Optimized Fire III': 'ファイラ・オメガ',
        'Optimized Meteor': 'メテオ・オメガ',
        'Optimized Passage of Arms': 'パッセージ・オブ・オメガ',
        'Optimized Sagittarius Arrow': 'サジタリウスアロー・オメガ',
        'Program Alpha': 'プログラム・アルファ',
        'Resonance': 'レゾナンス',
        'Solar Ray': 'ソーラレイ',
        'Spotlight': 'スポットライト',
        'Subject Simulation F': 'トランスフォームF',
        'Subject Simulation M': 'トランスフォームM',
        'Superliminal Steel': 'ブレードコンボB',
        'Suppression': '援護プログラムF',
        'Synthetic Blades': 'ブレードオプション',
        'Synthetic Shield': 'シールドオプション',
      },
      '~effectNames': {
        'Invincibility': '無敵',
        'Local Resonance': 'レゾナンスプログラム：ニアー',
        'Omega': 'オメガ',
        'Packet Filter F': 'ガードプログラムF',
        'Packet Filter M': 'ガードプログラムM',
      },
    },
  ],
}];
