'use strict';

// Hades Extreme

// TODO: call out direction for safe spot
// TODO: fire/ice tethers (0060|0061)

[{
  zoneRegex: /^The Minstrel's Ballad: Hades's Elegy$/,
  timelineFile: 'hades-ex.txt',
  timelineTriggers: [
    {
      id: 'HadesEx Comet',
      regex: /Comet 1/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Comet Towers',
        fr: 'Tours',
      },
    },
  ],
  triggers: [
    {
      id: 'HadesEx Shadow Spread 1',
      regex: / 14:47A8:Hades starts using Shadow Spread/,
      regexDe: / 14:47A8:Hades starts using Dunkle Schatten/,
      regexFr: / 14:47A8:Hadès starts using Diffusion D'ombre/,
      regexJa: / 14:47A8:ハーデス starts using シャドウスプレッド/,
      alertText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
      },
    },
    {
      id: 'HadesEx Shadow Spread 2',
      regex: / 14:47A8:Hades starts using Shadow Spread/,
      regexDe: / 14:47A8:Hades starts using Dunkle Schatten/,
      regexFr: / 14:47A8:Hadès starts using Diffusion D'ombre/,
      regexJa: / 14:47A8:ハーデス starts using シャドウスプレッド/,
      delaySeconds: 5.5,
      alertText: {
        en: 'Move',
        fr: 'Esquivez',
      },
    },
    {
      id: 'HadesEx Ravenous Assault',
      regex: / 14:47A6:Hades starts using Ravenous Assault on (\y{Name})\./,
      regexDe: / 14:47A6:Hades starts using Fegefeuer Der Helden on (\y{Name})\./,
      regexFr: / 14:47A6:Hadès starts using Assaut Acharné on (\y{Name})\./,
      regexJa: / 14:47A6:ハーデス starts using ラヴェナスアサルト on (\y{Name})\./,
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
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'HadesEx Bad Faith Left 1',
      regex: / 14:47AB:Hades starts using Bad Faith/,
      regexDe: / 14:47AB:Hades starts using Maske Des Grolls/,
      regexFr: / 14:47AB:Hadès starts using Mauvaise Foi/,
      regexJa: / 14:47AB:ハーデス starts using バッドフェイス/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Bad Faith Left 2',
      regex: / 14:47AB:Hades starts using Bad Faith/,
      regexDe: / 14:47AB:Hades starts using Maske Des Grolls/,
      regexFr: / 14:47AB:Hadès starts using Mauvaise Foi/,
      regexJa: / 14:47AB:ハーデス starts using バッドフェイス/,
      delaySeconds: 5,
      infoText: {
        en: 'Then Right',
        de: 'Dann Rechts',
        fr: 'Droite',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Bad Faith Right 1',
      regex: / 14:47AC:Hades starts using Bad Faith/,
      regexDe: / 14:47AC:Hades starts using Maske Des Grolls/,
      regexFr: / 14:47AC:Hadès starts using Mauvaise Foi/,
      regexJa: / 14:47AC:ハーデス starts using バッドフェイス/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
      },
    },
    {
      id: 'HadesEx Bad Faith Right 2',
      regex: / 14:47AC:Hades starts using Bad Faith/,
      regexDe: / 14:47AC:Hades starts using Maske Des Grolls/,
      regexFr: / 14:47AC:Hadès starts using Mauvaise Foi/,
      regexJa: / 14:47AC:ハーデス starts using バッドフェイス/,
      delaySeconds: 5,
      infoText: {
        en: 'Then Left',
        de: 'Dann Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Arcane Control Orbs',
      regex: Regexes.addedCombatant({ name: 'Arcane Globe', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Arkan(?:e|er|es|en) Kugel', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Globe Arcanique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '球体魔法陣', capture: false }),
      durationSeconds: 6,
      suppressSeconds: 2,
      infoText: {
        en: 'Go to Safe Spot',
        de: 'Geh zur sicheren Stelle',
        fr: 'Allez dans la zone sûre',
      },
    },
    {
      id: 'HadesEx Arcane Control Doors',
      regex: Regexes.addedCombatant({ name: 'Arcane Font', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Arkan(?:e|er|es|en) Körper', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Solide Arcanique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '立体魔法陣', capture: false }),
      durationSeconds: 6,
      suppressSeconds: 2,
      infoText: {
        en: 'Hide Behind Door',
        de: 'Hinter der Tür verstecken',
        fr: 'Cachez-vous derrière le mirroir',
      },
    },
    {
      id: 'HadesEx Quake III',
      regex: / 14:47B8:Nabriales's Shade starts using Quake III/,
      regexDe: / 14:47B8:Nabriales' Schatten starts using Seisga/,
      regexFr: / 14:47B8:Spectre De Nabriales starts using Méga Séisme/,
      regexJa: / 14:47B8:ナプリアレスの影 starts using クエイガ/,
      delaySeconds: 25,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Dark II Tether',
      regex: / 23:\y{ObjectId}:Shadow of the Ancients:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      regexDe: / 23:\y{ObjectId}:Schatten Der Alten:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      regexFr: / 23:\y{ObjectId}:Spectre d'Ascien:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      regexJa: / 23:\y{ObjectId}:古代人の影:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Point Tether Out',
        de: 'Verbindung nach draußen richten',
        fr: 'Liens vers l\'extérieur',
      },
    },
    {
      id: 'HadesEx Ancient Water 3',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Healer Stacks',
        de: 'Bei dem Heiler sammeln',
        fr: 'Package sur les heals',
      },
      run: function(data) {
        data.waterDarkMarker = true;
      },
    },
    {
      id: 'HadesEx Ancient Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Spread',
        de: 'Tanks verteilen',
        fr: 'Tanks : dispersion',
      },
      run: function(data) {
        data.waterDarkMarker = true;
      },
    },
    {
      id: 'HadesEx Ancient Water Unmarked',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:(?:0030|0060):/,
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data) {
        if (data.waterDarkMarker)
          return;
        return {
          en: 'Healer Stacks',
          de: 'Bei den Heilern sammeln',
          fr: 'Package sur les heals',
        };
      },
    },
    {
      id: 'HadesEx Shades Too Close',
      regex: / 23:\y{ObjectId}:(?:Igeyorhm's Shade|Lahabrea's Shade):\y{ObjectId}:(?:Igeyorhm's Shade|Lahabrea's Shade):....:....:000E:/,
      regexDe: / 23:\y{ObjectId}:(?:Igeyorhms Schatten|Lahabreas Schatten):\y{Objectid}:(?:Igeyorhms Schatten|Lahabreas Schatten):....:....:000E:/,
      regexFr: / 23:\y{ObjectId}:(?:Spectre d'Igeyorhm|Spectre De Lahabrea):\y{Objectid}:(?:Spectre d'Igeyorhm|Spectre De Lahabrea):....:....:000E:/,
      regexJa: / 23:\y{ObjectId}:(?:イゲオルムの影|ラハブレアの影):\y{Objectid}:(?:イゲオルムの影|ラハブレアの影):....:....:000E:/,
      suppressSeconds: 10,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Move Shades Apart',
        de: 'Schatten auseinander ziehen',
        fr: 'Ecartez les spectres',
      },
    },
    {
      id: 'HadesEx Spheres',
      regex: / 14:47BD:Igeyorhm's Shade starts using Blizzard Sphere/,
      regexDe: / 14:47BD:Igeyorhms Schatten starts using Eissphäre/,
      regexFr: / 14:47BD:Spectre D'igeyorhm starts using Sphère De Glace/,
      regexJa: / 14:47BD:イゲオルムの影 starts using ブリザードスフィア/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data) {
        if (!data.sphereCount)
          return;
        return {
          en: 'tank swap soon',
          de: 'Gleich: Tank swap',
          fr: 'Tank swap bientôt',
        };
      },
      run: function(data) {
        data.sphereCount = (data.sphereCount || 0) + 1;
      },
    },
    {
      id: 'HadesEx Annihilation',
      regex: / 14:47BF:Lahabrea's And Igeyorhm's Shades starts using Annihilation/,
      regexDe: / 14:47BF:Lahabrea Und Igeyorhm starts using Annihilation/,
      regexFr: / 14:47BF:Duo D'Asciens starts using Annihilation/,
      regexJa: / 14:47BF:ラハブレアとイゲオルム starts using アナイアレイション/,
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
      id: 'HadesEx Burning Brand',
      regex: Regexes.gainsEffect({ effect: 'Burning Brand' }),
      regexDe: Regexes.gainsEffect({ effect: 'Brandmal Des Feuers' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marque De Feu' }),
      regexJa: Regexes.gainsEffect({ effect: '火の烙印' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Attack Igeyorhm',
        de: 'Igeyorhm angreifen',
        fr: 'Attaquez Igeyorhm',
      },
      run: function(data) {
        data.brand = 'fire';
      },
    },
    {
      id: 'HadesEx Freezing Brand',
      regex: Regexes.gainsEffect({ effect: 'Freezing Brand' }),
      regexDe: Regexes.gainsEffect({ effect: 'Brandmal Des Eises' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marque De Glace' }),
      regexJa: Regexes.gainsEffect({ effect: '氷の烙印' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Attack Lahabrea',
        de: 'Lahabrea angreifen',
        fr: 'Attaquez Lahabrea',
      },
      run: function(data) {
        data.brand = 'ice';
      },
    },
    {
      id: 'HadesEx Blizzard IV',
      regex: / 14:47C3:Igeyorhm's Shade starts using Blizzard IV on (\y{Name})\./,
      regexDe: / 14:47C3:Igeyorhms Schatten starts using Eiska on (\y{Name})\./,
      regexFr: / 14:47C3:Spectre D'Igeyorhm starts using Giga Glace on (\y{Name})\./,
      regexJa: / 14:47C3:イゲオルムの影 starts using ブリザジャ on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'HadesEx Fire IV',
      regex: / 14:47C2:Lahabrea's Shade starts using Fire IV on (\y{Name})\./,
      regexDe: / 14:47C2:Lahabreas Schatten starts using Feuka on (\y{Name})\./,
      regexFr: / 14:47C2:Spectre De Lahabrea starts using Giga Feu on (\y{Name})\./,
      regexJa: / 14:47C2:ラハブレアの影 starts using ファイジャ on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'HadesEx Healers Blizzard/Fire IV',
      regex: / (?:14:47C3:Igeyorhm's Shade|14:47C2:Lahabrea's Shade)/,
      regexDe: / (?:14:47C3:Igeyorhms Schatten|14:47C2:Lahabreas Schatten)/,
      regexFr: / (?:14:47C3:Spectre d'Igeyorhm|14:47C2:Spectre De Lahabrea)/,
      regexJa: / (?:14:47C3:イゲオルムの影|14:47C2:ラハブレアの影)/,
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Tank Busters',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'HadesEx Doom',
      regex: Regexes.gainsEffect({ effect: 'Doom', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Verhängnis', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Glas', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '死の宣告', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '死亡宣告', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '죽음의 선고', capture: false }),
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal T/H to Full',
        de: 'Heile T/H voll',
        fr: 'T/H full vie',
      },
    },
    {
      id: 'HadesEx Shriek',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek' }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice' }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声' }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎' }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침' }),
      suppressSeconds: 2,
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 2;
      },
      alarmText: {
        en: 'Look Away',
        de: 'Weg schauen',
        fr: 'Regardez vers l\'extérieur',
      },
    },
    {
      id: 'HadesEx Beyond Death',
      regex: Regexes.gainsEffect({ effect: 'Beyond Death' }),
      regexDe: Regexes.gainsEffect({ effect: 'Jenseits Des Jenseits' }),
      regexFr: Regexes.gainsEffect({ effect: 'Outre-Mort' }),
      regexJa: Regexes.gainsEffect({ effect: '死の超越' }),
      regexCn: Regexes.gainsEffect({ effect: '超越死亡' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음 초월' }),
      durationSeconds: 8,
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Get Killed',
        de: 'Stirb',
        fr: 'Mourrez',
      },
    },
    {
      id: 'HadesEx Ancient Circle',
      regex: Regexes.gainsEffect({ effect: 'Ancient Circle' }),
      regexDe: Regexes.gainsEffect({ effect: 'Orbis Antiquus' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cercle Ancien' }),
      regexJa: Regexes.gainsEffect({ effect: 'エンシェントリング' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: {
        en: 'Donut on YOU',
        de: 'Donut auf DIR',
        fr: 'Donut sur VOUS',
      },
    },
    {
      id: 'HadesEx Forked Lightning',
      regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Gabelblitz' }),
      regexFr: Regexes.gainsEffect({ effect: 'Éclair Ramifié' }),
      regexJa: Regexes.gainsEffect({ effect: 'フォークライトニング' }),
      regexCn: Regexes.gainsEffect({ effect: '叉形闪电' }),
      regexKo: Regexes.gainsEffect({ effect: '갈래 번개' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 2;
      },
      alertText: {
        en: 'Stay Out',
        de: 'Draußen stehen',
        fr: 'Restez éloigné',
      },
    },
    {
      id: 'HadesEx Blight',
      regex: / 14:47CC:Ascian Prime's Shade starts using Blight/,
      regexDe: / 14:47CC:Schatten Des Prim-Ascian starts using Pesthauch/,
      regexFr: / 14:47CC:Spectre De Primo-Ascien starts using Supplice/,
      regexJa: / 14:47CC:アシエン・プライムの影 starts using クラウダ/,
      delaySeconds: 12,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
        de: 'AoE + Blutung',
        fr: 'Dégâts de zone + saignement',
      },
    },
    {
      id: 'HadesEx Height Of Chaos',
      regex: / 14:47D1:Ascian Prime's Shade starts using Height Of Chaos on (\y{Name})\./,
      regexDe: / 14:47D1:Schatten Des Prim-Ascian starts using Klimax Des Chaos on (\y{Name})\./,
      regexFr: / 14:47D1:Spectre De Primo-Ascien starts using Apogée Du Chaos on (\y{Name})\./,
      regexJa: / 14:47D1:アシエン・プライムの影 starts using ハイト・オブ・カオス on (\y{Name})\./,
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
        return {
          en: 'Away from ' + data.ShortName(matches[1]),
          fr: 'Eloignez-vous de ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'HadesEx Megiddo Flame',
      regex: / 14:47CD:Ascian Prime's Shade starts using Megiddo Flame/,
      regexDe: / 14:47CD:Schatten Des Prim-Ascian starts using Megiddoflamme/,
      regexFr: / 14:47CD:Spectre De Primo-Ascien starts using Flamme De Megiddo/,
      regexJa: / 14:47CD:アシエン・プライムの影 starts using メギドフレイム/,
      suppressSeconds: 1,
      infoText: {
        en: 'Healer Stacks',
        de: 'Bei den Heilern sammeln',
        fr: 'Package sur les heals',
      },
    },
    {
      id: 'HadesEx Shadow Flare',
      regex: / 14:47D0:Ascian Prime's Shade starts using Shadow Flare/,
      regexDe: / 14:47D0:Schatten Des Prim-Ascian starts using Schattenflamme/,
      regexFr: / 14:47D0:Spectre De Primo-Ascien starts using Éruption Ténébreuse/,
      regexJa: / 14:47D0:アシエン・プライムの影 starts using シャドウフレア/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Captivity',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0078:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Get Out',
        de: 'Raus gehen',
        fr: 'Sortez',
      },
    },
    {
      id: 'HadesEx Aetherial Gaol',
      regex: Regexes.addedCombatant({ name: 'Aetherial Gaol', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Ätherkerker', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Geôle Éthérée', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'エーテリアル・ジェイル', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '以太牢狱', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '에테르 감옥', capture: false }),
      infoText: {
        en: 'Break Aetherial Gaol',
        de: 'Zerstöre Ätherkerker',
        fr: 'Détruisez la Geôle éthérée',
      },
    },
    {
      id: 'HadesEx Dark Flame',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0064:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.flame = true;
      },
      infoText: {
        en: 'Knockback + Stack on YOU',
        de: 'Rückstoß + sammeln beim DIR',
        fr: 'Poussée + package sur VOUS',
      },
    },
    {
      id: 'HadesEx Dark Freeze',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C1:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.freeze = true;
      },
      infoText: {
        en: 'Knockback + Ice on YOU',
        de: 'Rückstoß + Eis auf DIR',
        fr: 'Poussée + Glace sur VOUS',
      },
    },
    {
      id: 'HadesEx Wail Of The Lost',
      regex: / 14:47E1:Hades starts using Wail Of The Lost/,
      regexDe: / 14:47E1:Hades starts using Wehklagen Der Verlorenen/,
      regexFr: / 14:47E1:Hadès starts using Lamentation Des Disparus/,
      regexJa: / 14:47E1:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      infoText: function(data) {
        if (!data.flame && !data.freeze) {
          return {
            en: 'Knockback + Stack With Partner',
            de: 'Rückstoß + sammeln beim Partner',
            fr: 'Poussée + package avec votre partenaire',
          };
        }
      },
    },
    {
      id: 'HadesEx Nether Blast',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.netherBlast = true;
      },
      alertText: {
        en: 'Puddles on YOU',
        de: 'Fläsche auf YOU',
        fr: 'Puddle sur VOUS',
      },
    },
    {
      id: 'HadesEx Bident',
      regex: / 14:47E3:Hades starts using Bident/,
      regexDe: / 14:47E3:Hades starts using Zweizack/,
      regexFr: / 14:47E3:Hadès starts using Bident/,
      regexJa: / 14:47E3:ハーデス starts using バイデント/,
      condition: function(data) {
        return !data.netherBlast;
      },
      infoText: {
        en: 'Healer Stacks',
        de: 'Bei dem Heiler sammeln',
        fr: 'Package sur les heals',
      },
    },
    {
      id: 'HadesEx Shadow Stream',
      regex: / 14:47EA:Hades starts using Shadow Stream/,
      regexDe: / 14:47EA:Hades starts using Schattenstrom/,
      regexFr: / 14:47EA:Hadès starts using Flux De Ténèbres/,
      regexJa: / 14:47EA:ハーデス starts using シャドウストリーム/,
      alertText: {
        en: 'Go Sides',
        de: 'Zu den Seiten gehen',
        fr: 'Allez sur les côtés',
      },
    },
    {
      id: 'HadesEx Polydegmon\'s Purgation',
      regex: / 14:47EB:Hades starts using Polydegmon's Purgation/,
      regexDe: / 14:47EB:Hades starts using Schlag Des Polydegmon/,
      regexFr: / 14:47EB:Hadès starts using Assaut Du Polydegmon/,
      regexJa: / 14:47EB:ハーデス starts using ポリデグモンストライク/,
      alertText: {
        en: 'Front and Center',
        de: 'Vorne und Mitte',
        fr: 'Devant et au centre',
      },
    },
    {
      id: 'HadesEx Dark Current',
      regex: / 14:47F1:Hades starts using Dark Current/,
      regexDe: / 14:47F1:Hades starts using Dunkel-Strom/,
      regexFr: / 14:47F1:Hadès starts using Flux [Ss]ombre/,
      regexJa: / 14:47F1:ハーデス starts using ダークストリーム/,
      durationSeconds: 12,
      suppressSeconds: 10,
      infoText: {
        en: 'Exoflares',
        de: 'Exa-Flares',
        fr: 'Exaflares',
      },
    },
    {
      id: 'HadesEx Gigantomachy',
      regex: / 14:47F3:Hades starts using Gigantomachy/,
      regexDe: / 14:47F3:Hades starts using Gigantomachie/,
      regexFr: / 14:47F3:Hadès starts using Gigantomachie/,
      regexJa: / 14:47F3:ハーデス starts using ギガントマキア/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Quadrastrike 1',
      regex: / 14:47F4:Hades starts using Quadrastrike/,
      regexDe: / 14:47F4:Hades starts using Quadraschlag/,
      regexFr: / 14:47F4:Hadès starts using Frappe Quadruplée/,
      regexJa: / 14:47F4:ハーデス starts using クアドラストライク/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Quadrastrike 2',
      regex: / 14:47F6:Hades starts using Quadrastrike/,
      regexDe: / 14:47F6:Hades starts using Quadraschlag/,
      regexFr: / 14:47F6:Hadès starts using Frappe Quadruplée/,
      regexJa: / 14:47F6:ハーデス starts using クアドラストライク/,
      suppressSeconds: 2,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alarmText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Get Towers',
            de: 'Türme nehmen',
            fr: 'Dans les tours',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'tank busters',
            de: 'Tank buster',
            fr: 'Tank busters',
          };
        }
      },
    },
    { // After tanks take tower damage
      id: 'HadesEx Quadrastrike 3',
      regex: / 15:\y{ObjectId}:Hades:47F6:Quadrastrike:/,
      regexDe: / 15:\y{ObjectId}:Hades:47F6:Quadraschlag:/,
      regexFr: / 15:\y{ObjectId}:Hadès:47F6:Frappe quadruplée:/,
      regexJa: / 15:\y{ObjectId}:ハーデス:47F6:クアドラストライク:/,
      suppressSeconds: 2,
      delaySeconds: 2,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
        de: 'AoE + Blutung',
        fr: 'Dégâts de zone + saignement',
      },
    },
    {
      id: 'HadesEx Enrage Gigantomachy',
      regex: / 14:47F9:Hades starts using Gigantomachy/,
      regexDe: / 14:47F9:Hades starts using Gigantomachie/,
      regexFr: / 14:47F9:Hadès starts using Gigantomachie/,
      regexJa: / 14:47F9:ハーデス starts using ギガントマキア/,
      infoText: {
        en: 'Enrage',
        de: 'Finalangriff',
        fr: 'Enrage',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Arcane Font': 'Arkaner Körper',
        'Arcane Globe': 'Arkane Kugel',
        'Ascian Prime\'s Shade': 'Schatten des Prim-Ascian',
        'Engage!': 'Start!',
        'Hades': 'Hades',
        'Igeyorhm\'s Shade': 'Igeyorhms Schatten',
        'Lahabrea\'s Shade': 'Lahabreas Schatten',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'Lahabrea und Igeyorhm',
        'Nabriales\'s Shade': 'Nabriales\' Schatten',
        'Shadow of the Ancients': 'Schatten der Alten',
      },
      'replaceText': {
        '--sync--': '--sync--',
        '--targetable--': '--anvisierbar--',
        'Again The Abyssal Celebrant': 'Erinnerung an den Abgrund',
        'Again The Majestic': 'Erinnerung an den Erhabenen',
        'Again The Martyr': 'Erinnerung an die Märtyrer',
        'Ancient Circle': 'Orbis Antiquus',
        'Ancient Dark IV': 'Neka der Alten',
        'Ancient Darkness': 'Dunkelung der Alten',
        'Ancient Double': 'Doppelung der Alten',
        'Ancient Eruption': 'Antike Eruption',
        'Ancient Water III': 'Aquaga der Alten',
        'Annihilation': 'Annihilation',
        'Arcane Control': 'Beleben des Kreises',
        'Arcane Utterance': 'Zeichnen des Kreises',
        'Bad Faith': 'Maske des Grolls',
        'Blight': 'Pesthauch',
        'Blizzard IV': 'Eiska',
        'Blizzard Sphere': 'Eissphäre',
        'Broken Faith': 'Maske der Trauer',
        'Captivity': 'Gefangenschaft',
        'Dark Current': 'Dunkel-Strom',
        'Dark Flame': 'Dunkel-Flamme',
        'Dark Freeze': 'Dunkel-Einfrieren',
        'Dark II': 'Negra',
        'Dark Seal': 'Dunkles Siegel',
        'Death Shriek': 'Todesschrei',
        'Fire IV': 'Feuka',
        'Fire Sphere': 'Feuersphäre',
        'Forked Lightning': 'Gabelblitz',
        'Gigantomachy': 'Gigantomachie',
        'Height Of Chaos': 'Klimax des Chaos',
        'Magic Chakram': 'Magisches Chakram',
        'Magic Spear': 'Magischer Speer',
        'Megiddo Flame': 'Megiddoflamme',
        'Nether Blast': 'Schattenausbruch',
        'Purgation': 'Schlag des Polydegmon',
        'Quake III': 'Seisga',
        'Ravenous Assault': 'Fegefeuer der Helden',
        'Shadow Flare': 'Schattenflamme',
        'Shadow Spread': 'Dunkle Schatten',
        'Stream': 'Schattenstrom',
        'Titanomachy': 'Titanomachie',
        'Universal Manipulation': 'Umwertung aller Werte',
        'Wail Of The Lost': 'Wehklagen der Verlorenen',
        '^Comet': 'Komet',
        '^Quadrastrike': 'Quadraschlag',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arcane Font': 'Solide Arcanique',
        'Arcane Globe': 'Globe Arcanique',
        'Ascian Prime\'s Shade': 'Spectre de Primo-Ascien',
        'Engage!': 'À l\'attaque !',
        'Hades': 'Hadès',
        'Igeyorhm\'s Shade': 'Spectre d\'Igeyorhm',
        'Lahabrea\'s Shade': 'Spectre de Lahabrea',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'Duo d\'Asciens',
        'Nabriales\'s Shade': 'Spectre de Nabriales',
        'Shadow of the Ancients': 'Spectre d\'Ascien',
      },
      'replaceText': {
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        'Again The Abyssal Celebrant': 'Mémoire d\'un contemplateur de l\'abysse',
        'Again The Majestic': 'Mémoire d\'un souverain',
        'Again The Martyr': 'Mémoire d\'un martyre',
        'Ancient Circle': 'Cercle ancien',
        'Ancient Dark IV': 'Giga Ténèbres anciennes',
        'Ancient Darkness': 'Ténèbres anciennes',
        'Ancient Double': 'Double ancien',
        'Ancient Eruption': 'Éruption ancienne',
        'Ancient Water III': 'Méga Eau ancienne',
        'Annihilation': 'Annihilation',
        'Arcane Control': 'Activation arcanique',
        'Arcane Utterance': 'Énoncé arcanique',
        'Bad Faith': 'Mauvaise foi',
        'Blight': 'Supplice',
        'Blizzard IV': 'Giga Glace',
        'Blizzard Sphere': 'Sphère de glace',
        'Broken Faith': 'Foi brisée',
        'Captivity': 'Captivité',
        'Dark Current': 'Flux sombre',
        'Dark Flame': 'Flamme ténébreuse',
        'Dark Freeze': 'Gel ténébreux',
        'Dark II': 'Extra Ténèbres',
        'Dark Seal': 'Sceau ténébreux',
        'Death Shriek': 'Hurlement fatal',
        'Fire IV': 'Giga Feu',
        'Fire Sphere': 'Sphère de feu',
        'Forked Lightning': 'Éclair ramifié',
        'Gigantomachy': 'Gigantomachie',
        'Height Of Chaos': 'Apogée du chaos',
        'Magic Chakram': 'Chakram magique',
        'Magic Spear': 'Lance magique',
        'Megiddo Flame': 'Flamme de Megiddo',
        'Nether Blast': 'Détonation infernale',
        'Purgation': 'Assaut du Polydegmon',
        'Quake III': 'Méga Séisme',
        'Ravenous Assault': 'Assaut acharné',
        'Shadow Flare': 'Éruption ténébreuse',
        'Shadow Spread': 'Diffusion d\'ombre',
        'Stream': 'Flux de Ténèbres',
        'Titanomachy': 'Titanomachie',
        'Universal Manipulation': 'Manipulation universelle',
        'Wail Of The Lost': 'Lamentation des disparus',
        '^Comet': 'Comète',
        '^Quadrastrike': 'Frappe quadruplée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arcane Font': '立体魔法陣',
        'Arcane Globe': '球体魔法陣',
        'Ascian Prime\'s Shade': 'アシエン・プライムの影',
        'Engage!': '戦闘開始！',
        'Hades': 'ハーデス',
        'Igeyorhm\'s Shade': 'イゲオルムの影',
        'Lahabrea\'s Shade': 'ラハブレアの影',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'ラハブレアとイゲオルム',
        'Nabriales\'s Shade': 'ナプリアレスの影',
        'Shadow of the Ancients': '古代人の影',
      },
      'replaceText': {
        '--sync--': '--sync--',
        '--targetable--': '--targetable--',
        'Again The Abyssal Celebrant': '深淵の記憶',
        'Again The Majestic': '尊厳王の記憶',
        'Again The Martyr': '殉教者の記憶',
        'Ancient Circle': 'エンシェントリング',
        'Ancient Dark IV': 'エンシェントダージャ',
        'Ancient Darkness': 'エンシェントダーク',
        'Ancient Double': 'エンシェントダブル',
        'Ancient Eruption': 'エンシェントエラプション',
        'Ancient Water III': 'エンシェントウォタガ',
        'Annihilation': 'アナイアレイション',
        'Arcane Control': '魔法陣起動',
        'Arcane Utterance': '魔法陣記述',
        'Bad Faith': 'バッドフェイス',
        'Blight': 'クラウダ',
        'Blizzard IV': 'ブリザジャ',
        'Blizzard Sphere': 'ブリザードスフィア',
        'Broken Faith': 'ブロークンフェイス',
        'Captivity': 'キャプティビティ',
        'Dark Current': 'ダークストリーム',
        'Dark Flame': 'ダークフレイム',
        'Dark Freeze': 'ダークフリーズ',
        'Dark II': 'ダーラ',
        'Dark Seal': 'ダークシール',
        'Death Shriek': 'デスシュリーク',
        'Fire IV': 'ファイジャ',
        'Fire Sphere': 'ファイアスフィア',
        'Forked Lightning': 'フォークライトニング',
        'Gigantomachy': 'ギガントマキア',
        'Height Of Chaos': 'ハイト・オブ・カオス',
        'Magic Chakram': 'マジックチャクラム',
        'Magic Spear': 'マジックスピア',
        'Megiddo Flame': 'メギドフレイム',
        'Nether Blast': 'ネザーブラスト',
        'Purgation': 'ポリデグモンストライク',
        'Quake III': 'クエイガ',
        'Ravenous Assault': 'ラヴェナスアサルト',
        'Shadow Flare': 'シャドウフレア',
        'Shadow Spread': 'シャドウスプレッド',
        'Stream': 'シャドウストリーム',
        'Titanomachy': 'ティタノマキア',
        'Universal Manipulation': '法則改変',
        'Wail Of The Lost': 'ウエイル・オブ・ザ・ロスト',
        '^Comet': 'コメット',
        '^Quadrastrike': 'クアドラストライク',
      },
    },
  ],
}];
