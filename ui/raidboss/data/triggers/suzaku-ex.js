'use strict';

// Suzaku Extreme
[{
  zoneRegex: /^Hells\' Kier \(Extreme\)$/,
  timelineFile: 'suzaku-ex.txt',
  triggers: [
    {
      id: 'SuzEx Cremate',
      regex: / 14:32D1:Suzaku starts using Cremate on (\y{Name})/,
      regexDe: / 14:32D1:Suzaku starts using Einäschern on (\y{Name})/,
      regexFr: / 14:32D1:Suzaku starts using Crématorium on (\y{Name})/,
      regexJa: / 14:32D1:朱雀 starts using 赤熱撃 on (\y{Name})/,
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
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
          };
        }
      },
    },
    {
      id: 'SuzEx Phantom Flurry',
      regex: / 14:32DC:Suzaku starts using/,
      regexDe: / 14:32DC:Suzaku starts using/,
      regexFr: / 14:32DC:Suzaku starts using/,
      regexJa: / 14:32DC:朱雀 starts using/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'SuzEx Mesmerizing Melody',
      regex: / 14:32DA:Suzaku starts using Mesmerizing Melody/,
      regexDe: / 14:32DA:Suzaku starts using Bezaubernde Melodie/,
      regexFr: / 14:32DA:Suzaku starts using Mélodie Hypnotique/,
      regexJa: / 14:32DA:朱雀 starts using 誘引の旋律/,
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Allez au bord extérieur',
        ja: '誘引',
      },
      tts: {
        ja: '外へ',
      }
    },
    {
      id: 'SuzEx Ruthless Refrain',
      regex: / 14:32DB:Suzaku starts using Ruthless Refrain/,
      regexDe: / 14:32DB:Suzaku starts using Rabiater Refrain/,
      regexFr: / 14:32DB:Suzaku starts using Refrain Impitoyable/,
      regexJa: / 14:32DB:朱雀 starts using 拒絶の旋律/,
      alertText: {
        en: 'Get In',
        de: 'Rein da',
        fr: 'Allez au bord intérieur',
        ja: '拒絶',
      },
      tts: {
        ja: '中へ',
      }
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Song of Durance': 'Lied[p] der Gefangenheit',
        'Song of Fire': 'Lied des Feuerrots',
        'Song of Oblivion': 'Lied der Lüge',
        'Song of Sorrow': 'Lied der Tränen',
        'Suzaku': 'Suzaku',
        'Eastern Pyre': 'Ostflamme',
        'Northern Pyre': 'Nordflamme',
        'Rapturous Echo': 'Klang der Liebe',
        'Scarlet Lady': 'Flammenvogel',
        'Scarlet Plume': 'Flügelfeder',
        'Scarlet Tail Feather': 'Schwanzfeder',
        'Southern Pyre': 'Südflamme',
        'Western Pyre': 'Westflamme',
        '0044.Tenzen': '0044:Tenzen',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Burn': 'Verbrennung',
        'Close-Quarter Crescendo': 'Puppencrescendo',
        'Cremate': 'Einäschern',
        'Enrage': 'Finalangriff',
        'Eternal Flame': 'Ewige Flamme',
        'Fleeting Summer': 'Vergänglicher Sommer',
        'Hotspot': 'Hitzestau',
        'Incandescent Interlude': 'Glühendes Intermezzo',
        'Mesmerizing Melody': 'Bezaubernde Melodie',
        'Pay the Piper': 'Lied des Fängers',
        'Phantom Flurry': 'Phantomhast',
        'Phoenix Down': 'Phönixsturz',
        'Rekindle': 'Wiederaufleben',
        'Rout': 'Kolossgalopp',
        'Ruthless Refrain': 'Rabiater Refrain',
        'Scarlet Fever': 'Feuertod',
        'Scarlet Hymn': 'Zinnoberhymne',
        'Scathing Net': 'Vernichtendes Netz',
        'Screams Of The Damned': 'Schreie der Verdammten',
        'Southron Star': 'Stern des Südens',
        'Well Of Flame': 'Flammenbrunnen',
        'Wing And A Prayer': 'Letztes Gebet',
        'Ruthless/Mesmerizing': 'Rabiater/Bezaubernde',
        'Phantom Half': 'Phantomhast',
      },
      '~effectNames': {
        'Burns': 'Brandwunde',
        'Damage Up': 'Schaden +',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'HP Boost': 'LP-Bonus',
        'Looming Crescendo': 'Puppencrescendo',
        'Paying the Piper': 'Marschbefehl',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Primary Target': 'Angriffsziel',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Song of Durance': 'Poème captif',
        'Song of Fire': 'Poème phosphoré',
        'Song of Oblivion': 'Poème démuni',
        'Song of Sorrow': 'Poème larmoyant',
        'Suzaku': 'Suzaku',
        'Eastern Pyre': 'Flamme orientale',
        'Northern Pyre': 'Flamme boréale',
        'Rapturous Echo': 'Chant d\'amour',
        'Scarlet Lady': 'Oiseau de feu',
        'Scarlet Plume': 'Plume de Suzaku',
        'Scarlet Tail Feather': 'Plume de queue de Suzaku',
        'Southern Pyre': 'Flamme australe',
        'Western Pyre': 'Flamme occidentale',

        // FIXME
        '0044.Tenzen': '0044:Tenzen',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Burn': 'Combustion',
        'Close-Quarter Crescendo': 'Mélopée fantoche',
        'Cremate': 'Crématorium',
        'Enrage': 'Enrage',
        'Eternal Flame': 'Flamme éternelle',
        'Fleeting Summer': 'Ailes vermillon',
        'Hotspot': 'Couleurs',
        'Incandescent Interlude': 'Mélopée incandescente',
        'Mesmerizing Melody': 'Mélodie hypnotique',
        'Pay The Piper': 'Poème fantoche',
        'Phantom Flurry': 'Frénésie spectrale',
        'Phoenix Down': 'Queue de phénix',
        'Rekindle': 'Ravivement',
        'Rout': 'Irruption',
        'Ruthless Refrain': 'Refrain impitoyable',
        'Scarlet Fever': 'Fièvre écarlate',
        'Scarlet Hymn': 'Hymne vermillon',
        'Scathing Net': 'Étoiles des enfers',
        'Screams Of The Damned': 'Cris des damnés',
        'Southron Star': 'Étoile australe',
        'Well Of Flame': 'Puits ardent',
        'Wing And A Prayer': 'Prière de pennes',
        'Ruthless/Mesmerizing': 'Refrain/Mélodie',
        'Phantom Half': 'Frénésie - Moitié de plateau',
      },
      '~effectNames': {
        'Burns': 'Brûlure',
        'Damage Up': 'Bonus De Dégâts',
        'Fire Resistance Down II': 'Résistance Au Feu Réduite+',
        'HP Boost': 'Bonus De PV',
        'Looming Crescendo': 'Mélopée fantoche',
        'Paying The Piper': 'Marche forcée',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Primary Target': 'Cible prioritaire',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Song of Durance': '牢の詩',
        'Song of Fire': '燐の詩',
        'Song of Oblivion': '虚の詩',
        'Song of Sorrow': '涙の詩',
        'Suzaku': '朱雀',
        'Eastern Pyre': '東炎',
        'Northern Pyre': '北炎',
        'Rapturous Echo': '愛の音色',
        'Scarlet Lady': '火焔鳥',
        'Scarlet Plume': '朱雀の羽根',
        'Scarlet Tail Feather': '朱雀の尾羽根',
        'Southern Pyre': '南炎',
        'Western Pyre': '西炎',

        // FIXME
        '0044.Tenzen': '0044:Tenzen',
      },
      'replaceText': {
        'Burn': '燃焼',
        'Close-Quarter Crescendo': '傀儡の調べ',
        'Cremate': '赤熱撃',
        'Eternal Flame': '再生の大火',
        'Fleeting Summer': '翼宿撃',
        'Hotspot': '紅蓮炎',
        'Incandescent Interlude': '灼熱の調べ',
        'Mesmerizing Melody': '誘引の旋律',
        'Pay the Piper': '傀儡詩',
        'Phantom Flurry': '鬼宿脚',
        'Phoenix Down': '再生の羽根',
        'Rekindle': '再生の炎',
        'Rout': '猛進',
        'Ruthless Refrain': '拒絶の旋律',
        'Scarlet Fever': '焼滅天火',
        'Scarlet Hymn': '朱の旋律',
        'Scathing Net': '張宿業火',
        'Screams Of The Damned': '叫喚地獄',
        'Southron Star': '星宿波',
        'Well Of Flame': '井宿焔',
        'Wing And A Prayer': '再生の神通力',
      },
      '~effectNames': {
        'Burns': '火傷',
        'Damage Up': 'ダメージ上昇',
        'Fire Resistance Down II': '火属性耐性低下[強]',
        'HP Boost': '最大ＨＰアップ',
        'Looming Crescendo': '傀儡の調べ',
        'Paying the Piper': '強制移動',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Primary Target': '攻撃目標',
        'Stun': 'スタン',
      },
    },
  ],
}];
