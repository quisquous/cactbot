'use strict';

[{
  zoneRegex: /^Eden's Gate: Sepulture$/,
  timelineFile: 'e4n.txt',
  triggers: [
    {
      id: 'E4N Voice of the Land',
      regex: / 14:40F7:Titan starts using Voice of the Land/,
      regexDe: / 14:40F7:Titan starts using Aufschrei der Erde/,
      regexFr: / 14:40F7:Titan starts using Hurlement Tellurique/,
      regexJa: / 14:40F7:タイタン starts using 大地の叫び/,
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
      id: 'E4N Earthen Fury',
      regex: / 14:40F8:Titan starts using Earthen Fury/,
      regexDe: / 14:40F8:Titan starts using Gaias Zorn/,
      regexFr: / 14:40F8:Titan starts using Fureur Tellurique/,
      regexJa: / 14:40F8:タイタン starts using 大地の怒り/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe + dot',
        de: 'AoE + DoT',
        fr: 'Dégâts de zone + dot',
      },
    },
    {
      id: 'E4N Stonecrusher',
      regex: / 14:40F9:Titan starts using Stonecrusher on (\y{Name})/,
      regexDe: / 14:40F9:Titan starts using Felsbrecher on (\y{Name})/,
      regexFr: / 14:40F9:Titan starts using Éruption Tellurique on (\y{Name})/,
      regexJa: / 14:40F9:タイタン starts using ロッククラッシュ on (\y{Name})/,
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
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'E4N Massive Landslide',
      regex: / 14:40FA:Titan starts using Massive Landslide/,
      regexDe: / 14:40FA:Titan starts using Gigantischer Bergsturz/,
      regexFr: / 14:40FA:Titan starts using Glissement Apocalyptique/,
      regexJa: / 14:40FA:タイタン starts using メガ・ランドスライド/,
      alertText: {
        en: 'Stand In Front',
        de: 'Vor ihm stehen',
        fr: 'Se placer devant',
      },
    },
    {
      id: 'E4N Seismic Wave',
      regex: / 14:40F2:massive boulder starts using Crumbling Down/,
      regexDe: / 14:40F2:Riesiger Felsen starts using Felsfall/,
      regexFr: / 14:40F2:Monolithe Géant starts using Chute De Monolithes/,
      regexJa: / 14:40F2:ジャイアントボルダー starts using 岩盤崩落/,
      delaySeconds: 6,
      suppressSeconds: 10,
      infoText: {
        en: 'Hide Behind Boulder',
        de: 'Hinter Felsen verstecken',
        fr: 'Se cacher derrière le rocher',
      },
    },
    {
      id: 'E4N Geocrush',
      regex: / 14:40F6:Titan starts using Geocrush/,
      regexDe: / 14:40F6:Titan starts using Kraterschlag/,
      regexFr: / 14:40F6:Titan starts using Broie-Terre/,
      regexJa: / 14:40F6:タイタン starts using ジオクラッシュ/,
      infoText: {
        en: 'Knockback',
        de: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E4N Fault Zone',
      regex: / 14:4102:Titan starts using Fault Zone/,
      regexDe: / 14:4102:Titan starts using Bruchzone/,
      regexFr: / 14:4102:Titan starts using Faille Tectonique/,
      regexJa: / 14:4102:タイタン starts using フォールトゾーン/,
      alertText: {
        en: 'Stand On Flank',
        de: 'Auf seiner Flanke stehen',
        fr: 'Se placer sur le flanc',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Titan': 'Titan',
        'Bomb Boulder': 'Bomber-Brocken',
        'Massive Boulder': 'Riesiger Felsen',
      },
      'replaceText': {
        'Fault Line': 'Bruchlinie',
        'Earthen Wheels': 'Gaia-Räder',
        'Geocrush': 'Kraterschlag',
        'Earthen Armor': 'Gaia-Panzer',
        'Fault Zone': 'Bruchzone',
        'Bomb Boulders': 'Tumulus',
        'Weight Of The Land': 'Gaias Gewicht',
        'Voice Of The Land': 'Aufschrei der Erde',
        'Leftward Landslide': 'Linker Bergsturz',
        '--untargetable--': '--nich anvisierbar--',
        'Explosion': 'Explosion',
        'Evil Earth': 'Grimm der Erde',
        'Aftershock': 'Nachbeben',
        'Magnitude 5.0': 'Magnitude 5.0',
        '--targetable--': '--anvisierbar--',
        'Seismic Wave': 'Seismische Welle',
        'Crumbling Down': 'Felsfall',
        'Enrage': 'Finalangriff',
        'Rightward Landslide': 'Rechter Bergsturz',
        'Massive Landslide': 'Gigantischer Bergsturz',
        'Earthen Gauntlets': 'Gaia-Armberge',
        'Cobalt Bomb': 'Kobaltbombe',
        'Bury': 'Begraben',
        'Earthen Fury': 'Gaias Zorn',
        'Stonecrusher': 'Felsbrecher',
        'Landslide': 'Bergsturz',
      },
      '~effectNames': {
        'Brink of Death': 'Sterbenselend',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Filthy': 'Dreck',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Titan': 'Titan',
        'Bomb Boulder': 'Bombo Rocher',
      },
      'replaceText': {
        'Fault Line': 'Ligne de faille',
        'Earthen Wheels': 'Pas tellurique',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
        'Geocrush': 'Broie-terre',
        'Earthen Armor': 'Armure tellurique',
        'Fault Zone': 'Faille tectonique',
        'Bomb Boulders': 'Bombo rocher',
        'Weight of the Land': 'Poids de la terre',
        'Voice of the Land': 'Hurlement tellurique',
        'Leftward Landslide': 'Glissement senestre',
        '--untargetable--': '--Impossible à cibler--',
        'Explosion': 'Explosion',
        'Evil Earth': 'Terre maléfique',
        'Aftershock': 'Répercussion',
        'Magnitude 5.0': 'Magnitude 5',
        '--targetable--': '--Ciblable--',
        'Seismic Wave': 'Ondes sismiques',
        'Crumbling Down': 'Chute de monolithes',
        'Enrage': 'Enrage',
        'Rightward Landslide': 'Glissement dextre',
        'Massive Landslide': 'Glissement apocalyptique',
        'Earthen Gauntlets': 'Poing tellurique',
        'Cobalt Bomb': 'Bombo de cobalt',
        'Bury': 'Ensevelissement',
        'Earthen Fury': 'Fureur tellurique',
        'Stonecrusher': 'Éruption tellurique',
        'Landslide': 'Glissement de terrain',
      },
      '~effectNames': {
        'Brink of Death': 'Mourant',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Filthy': 'Embourbement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Titan': 'タイタン',
        'Bomb Boulder': 'ボムボルダー',
      },
      'replaceText': {
        'Fault Line': 'フォールトライン',
        'Earthen Wheels': '大地の車輪',
        'Geocrush': 'ジオクラッシュ',
        'Earthen Armor': '大地の鎧',
        'Fault Zone': 'フォールトゾーン',
        'Bomb Boulders': 'ボムボルダー',
        'Weight of the Land': '大地の重み',
        'Voice of the Land': '大地の叫び',
        'Leftward Landslide': 'レフト・ランドスライド',
        'Explosion': '爆散',
        'Evil Earth': 'イビルアース',
        'Aftershock': '余波',
        'Magnitude 5.0': 'マグニチュード5.0',
        'Seismic Wave': 'サイズミックウェーブ',
        'Crumbling Down': '岩盤崩落',
        'Earthen Fury': '大地の怒り',
        'Rightward Landslide': 'ライト・ランドスライド',
        'Massive Landslide': 'メガ・ランドスライド',
        'Earthen Gauntlets': '大地の手甲',
        'Cobalt Bomb': 'コバルトボム',
        'Bury': '衝撃',
        'Stonecrusher': 'ロッククラッシュ',
        'Landslide': 'ランドスライド',
      },
      '~effectNames': {
        'Dropsy': '水毒',
        'Brink of Death': '衰弱［強］',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Filthy': '汚泥',
      },
    },
  ],
}];
