'use strict';

[{
  zoneRegex: /[tT]he Qitana Ravel/,
  timelineFile: 'qitana_ravel.txt',
  triggers: [
    {
      id: 'Qitana Stonefist',
      regex: / 14:3C89:Lozatl starts using Stonefist on (\y{Name})/,
      regexDe: / 14:3C89:Lozatl starts using Steinfaust on (\y{Name})/,
      regexFr: / 14:3C89:Lozatl starts using Poing [rR]ocheux on (\y{Name})/,
      regexJa: / 14:3C89:ロツァトル starts using 石の拳 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Qitana Scorn',
      regex: / 14:3C8B:Lozatl starts using Lozatl's Scorn/,
      regexDe: / 14:3C8B:Lozatl starts using Lozatls Hohn/,
      regexFr: / 14:3C8B:Lozatl starts using Injure [dD]e Lozatl/,
      regexJa: / 14:3C8B:ロツァトル starts using ロツァトルの罵声/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Qitana Eerie Pillar',
      regex: / 14:3C8B:Lozatl starts using Lozatl's Scorn/,
      regexDe: / 14:3C8B:Lozatl starts using Lozatls Hohn/,
      regexFr: / 14:3C8B:Lozatl starts using Injure [dD]e Lozatl/,
      regexJa: / 14:3C8B:ロツァトル starts using ロツァトルの罵声/,
      delaySeconds: 5,
      infoText: {
        en: 'Look for pillar',
        de: 'Auf die Pfeiler schauen',
        fr: 'Cherchez les piliers',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: / 14:3C8D:Lozatl starts using Heat Up/,
      regexDe: / 14:3C8D:Lozatl starts using Erhitzung/,
      regexFr: / 14:3C8D:Lozatl starts using Incandescence/,
      regexJa: / 14:3C8D:ロツァトル starts using 赤熱化/,
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on left flank',
        de: 'Auf seiner linken Seite stehen',
        fr: 'Restez sur le flanc gauche',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: / 14:3C8E:Lozatl starts using Heat Up/,
      regexDe: / 14:3C8E:Lozatl starts using Erhitzung/,
      regexFr: / 14:3C8E:Lozatl starts using Incandescence/,
      regexJa: / 14:3C8E:ロツァトル starts using 赤熱化/,
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on right flank',
        de: 'Auf seiner rechten Seite stehen',
        fr: 'Restez sur le flanc droit',
      },
    },
    {
      id: 'Qitana Ripper Fang',
      regex: / 14:3C91:Batsquatch starts using Ripper Fang on (\y{Name})/,
      regexDe: / 14:3C91:Fledersquatch starts using Fetzzahn on (\y{Name})/,
      regexFr: / 14:3C91:Batsquatch starts using Croc [éÉ]ventreur on (\y{Name})/,
      regexJa: / 14:3C91:バッツカッチ starts using リッパーファング on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Qitana Soundwave',
      regex: / 14:3C92:Batsquatch starts using Soundwave/,
      regexDe: / 14:3C92:Fledersquatch starts using Schallwelle/,
      regexFr: / 14:3C92:Batsquatch starts using Onde [sS]onore/,
      regexJa: / 14:3C92:バッツカッチ starts using サウンドウェーブ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Qitana Subsonics',
      regex: / 14:3C93:Batsquatch starts using Subsonics/,
      regexDe: / 14:3C93:Fledersquatch starts using Unterschall/,
      regexFr: / 14:3C93:Batsquatch starts using Attaque [sS]ubsonique/,
      regexJa: / 14:3C93:バッツカッチ starts using サブソニクス/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoes',
        de: 'AoEs',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Qitana Rend',
      regex: / 14:3C99:Eros starts using Rend on (\y{Name})/,
      regexDe: / 14:3C99:Eros starts using Zerreißen on (\y{Name})/,
      regexFr: / 14:3C99:Éros starts using Déchiquètement on (\y{Name})/,
      regexJa: / 14:3C99:エロース starts using 引き裂き on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Qitana Glossolalia',
      regex: / 14:3C9B:Eros starts using Glossolalia/,
      regexDe: / 14:3C9B:Eros starts using Glossolalie/,
      regexFr: / 14:3C9B:Éros starts using Glossolalie/,
      regexJa: / 14:3C9B:エロース starts using グロソラリア/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Qitana Hound Tether',
      regex: / 23:\y{ObjectId}:Eros:\y{ObjectId}:(\y{Name}):....:....:0039:/,
      regexDe: / 23:\y{ObjectId}:Eros:\y{ObjectId}:(\y{Name}):....:....:0039:/,
      regexFr: / 23:\y{ObjectId}:Éros:\y{ObjectId}:(\y{Name}):....:....:0039:/,
      regexJa: / 23:\y{ObjectId}:エロース:\y{ObjectId}:(\y{Name}):....:....:0039:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Run Away From Boss',
        de: 'Renn weg vom Boss',
        fr: 'Courez loin du boss',
      },
    },
    {
      id: 'Qitana Viper Poison',
      regex: / 1B:........:(\y{Name}):....:....:00AB:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Drop Poison Outside',
        de: 'Gift am Rand ablegen',
        fr: 'Posez le poison à l\'extérieur',
      },
    },
    {
      id: 'Qitana Confession of Faith Stack',
      regex: / 1B:........:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack Middle on YOU',
            de: 'In der Mitte auf DIR sammeln',
            fr: 'Package au milieu sur VOUS',
          };
        }
        return {
          en: 'Stack Middle on ' + data.ShortName(matches[1]),
          de: 'In Der Mitte auf ' + data.ShortName(matches[1]) + ' sammeln',
          fr: 'Package au milieu sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Qitana Confession of Faith Spread',
      regex: / 14:3CA1:Eros starts using Confession of Faith/,
      regexDe: / 14:3CA1:Eros starts using Glaubensbekenntnis/,
      regexFr: / 14:3CA1:Éros starts using Confession de foi/,
      regexJa: / 14:3CA1:エロース starts using コンフェッション・オブ・フェイス/,
      alertText: {
        en: 'Spread to Sides',
        de: 'Auf die Seiten verteilen',
        fr: 'Dispersez-vous sur les bords',
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
