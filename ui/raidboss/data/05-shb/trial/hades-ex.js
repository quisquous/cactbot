'use strict';

// Hades Extreme

// TODO: arcane font doors
// TODO: arcane utterance orbs
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
      },
    },
  ],
  triggers: [
    {
      id: 'HadesEx Shadow Spread',
      regex: / 14:47A8:Hades starts using Shadow Spread/,
      regexDe: / 14:47A8:Hades starts using Dunkle Schatten/,
      regexFr: / 14:47A8:Hadès starts using Diffusion D'Ombre/,
      regexJa: / 14:47A8:ハーデス starts using シャドウスプレッド/,
      alertText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
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
        fr: 'Gauche',
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
    // TODO: call out direction for safe spot
    {
      id: 'HadesEx Arcane Control Orbs',
      regex: / 03:\y{ObjectId}:Added new combatant Arcane Globe\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Arkane Kugel\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Globe Arcanique\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant 球体魔法陣\./,
      suppressSeconds: 2,
      infoText: {
        en: 'Go to Safe Spot',
        de: 'Geh zur sicheren Stelle',
      },
    },
    {
      id: 'HadesEx Arcane Control Doors',
      regex: / 03:\y{ObjectId}:Added new combatant Arcane Font\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Arkaner Körper\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Solide Arcanique\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant 立体魔法陣\./,
      suppressSeconds: 2,
      infoText: {
        en: 'Hide Behind Door',
        de: 'Hinter der Tür verstecken',
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
      regexFr: / 23:\y{ObjectId}:Spectre D'Ascien:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      regexJa: / 23:\y{ObjectId}:古代人の影:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Point Tether Out',
        de: 'Verbindung nach draußen richten',
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
      },
    },
    {
      id: 'HadesEx Spheres',
      regex: / 14:47BD:Igeyorhm's Shade starts using Blizzard Sphere/,
      regexDe: / 14:47BD:Igeyorhms Schatten starts using Eissphäre/,
      regexFr: / 14:47BD:Spectre D'Igeyorhm starts using Sphère De Glace/,
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
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Burning Brand/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Brandmal Des Feuers/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Marque De Feu/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 火の烙印/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Attack Igeyorhm',
        de: 'Igeyorhm angreifen',
      },
      run: function(data) {
        data.brand = 'fire';
      },
    },
    {
      id: 'HadesEx Freezing Brand',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Freezing Brand/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Brandmal Des Eises/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Marque De Glace/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 氷の烙印/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Attack Lahabrea',
        de: 'Lahabrea angreifen',
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
      suppressSeconds: 5,
      alertText: {
        en: 'Tank Busters',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'HadesEx Doom',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Doom from (?:.*?) for (?:\y{Float}) Seconds\./,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Verhängnis from (?:.*?) for (?:\y{Float}) Seconds\./,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Glas from (?:.*?) for (?:\y{Float}) Seconds\./,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of 死の宣告 from (?:.*?) for (?:\y{Float}) Seconds\./,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal T/H to Full',
        de: 'Heile T/H voll',
      },
    },
    {
      id: 'HadesEx Shriek',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Cursed Shriek from (?:.*?) for (\y{Float}) Seconds\./,
      regexDe: / 1A:\y{ObjectId}:\y{Name} gains the effect of Schrei Der Verwünschung from (?:.*?) for (\y{Float}) Seconds\./,
      regexFr: / 1A:\y{ObjectId}:\y{Name} gains the effect of Cri Du Maléfice from (?:.*?) for (\y{Float}) Seconds\./,
      regexJa: / 1A:\y{ObjectId}:\y{Name} gains the effect of 呪詛の叫声 from (?:.*?) for (\y{Float}) Seconds\./,
      suppressSeconds: 2,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[1]) - 2;
      },
      alarmText: {
        en: 'Look Away',
        de: 'Weg schauen',
      },
    },
    {
      id: 'HadesEx Beyond Death',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Beyond Death from (?:.*?) for (?:\y{Float}) Seconds\./,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Jenseits Des Jenseits from (?:.*?) for (?:\y{Float}) Seconds\./,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Outre-Mort from (?:.*?) for (?:\y{Float}) Seconds\./,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 死の超越 from (?:.*?) for (?:\y{Float}) Seconds\./,
      durationSeconds: 8,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Get Killed',
        de: 'Stirb',
      },
    },
    {
      id: 'HadesEx Ancient Circle',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Ancient Circle from (?:.*?) for (\y{Float}) Seconds\./,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Orbis Antiquus from (?:.*?) for (\y{Float}) Seconds\./,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Cercle Ancien from (?:.*?) for (\y{Float}) Seconds\./,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of エンシェントリング from (?:.*?) for (\y{Float}) Seconds\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 5;
      },
      infoText: {
        en: 'Donut on YOU',
        de: 'Donut auf DIR',
      },
    },
    {
      id: 'HadesEx Forked Lightning',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Forked Lightning from (?:.*?) for (\y{Float}) Seconds\./,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Gabelblitz from (?:.*?) for (\y{Float}) Seconds\./,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Éclair Ramifié from (?:.*?) for (\y{Float}) Seconds\./,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of フォークライトニング from (?:.*?) for (\y{Float}) Seconds\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 2;
      },
      alertText: {
        en: 'Stay Out',
        de: 'Draußen stehen',
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
      },
    },
    {
      id: 'HadesEx Aetherial Gaol',
      regex: / 03:\y{ObjectId}:Added new combatant Aetherial Gaol\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Ätherkerker\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Geôle Éthérée\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant エーテリアル・ジェイル\./,
      infoText: {
        en: 'Break Aetherial Gaol',
        de: 'Zerstöre Ätherkerker',
      },
    },
    {
      id: 'HadesEx Wail Of The Lost',
      regex: / 14:47E1:Hades starts using Wail Of The Lost/,
      regexDe: / 14:47E1:Hades starts using Wehklagen Der Verlorenen/,
      regexFr: / 14:47E1:Hadès starts using Lamentation Des Disparus/,
      regexJa: / 14:47E1:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Knockback + Stack With Healer',
            de: 'Rückstoß + sammeln beim Heiler',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Knockback + Stack on YOU',
            de: 'Rückstoß + sammeln beim DIR',
          };
        }
        return {
          en: 'Knockback + Ice on YOU',
          de: 'Rückstoß + Eis auf DIR',
        };
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
      },
    },
    {
      id: 'HadesEx Dark Current',
      regex: / 14:47F1:Hades starts using Dark Current/,
      regexDe: / 14:47F1:Hades starts using Dunkel-Strom/,
      regexFr: / 14:47F1:Hadès starts using Flux Sombre/,
      regexJa: / 14:47F1:ハーデス starts using ダークストリーム/,
      durationSeconds: 10,
      suppressSeconds: 10,
      infoText: {
        en: 'Exoflares',
        de: 'Exa-Flares',
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
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Dans les tours',
      },
    },
    { // After tanks take tower damage
      id: 'HadesEx Quadrastrike 3',
      regex: / 15:\y{ObjectId}:Hades:47F6:Quadrastrike:/,
      regexDe: / 15:\y{ObjectId}:Hades:47F6:Quadraschlag:/,
      regexFr: / 15:\y{ObjectId}:Hadès:47F6:Frappe quadruplée:/,
      regexJa: / 15:\y{ObjectId}:ハーデス:47F6:クアドラストライク:/,
      delaySeconds: 2,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
        de: 'AoE + Blutung',
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
        'Arcane Font': 'solide arcanique',
        'Arcane Globe': 'globe arcanique',
        'Ascian Prime\'s Shade': 'spectre de Primo-Ascien',
        'Engage!': 'À l\'attaque !',
        'Hades': 'Hadès',
        'Igeyorhm\'s Shade': 'spectre d\'Igeyorhm',
        'Lahabrea\'s Shade': 'spectre de Lahabrea',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'duo d\'Asciens',
        'Nabriales\'s Shade': 'spectre de Nabriales',
        'Shadow of the Ancients': 'spectre d\'Ascien',
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
