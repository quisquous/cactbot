'use strict';

// Hades Extreme

// TODO: call out direction for safe spot
// TODO: fire/ice tethers (0060|0061)

[{
  zoneRegex: {
    en: /^The Minstrel's Ballad: Hades's Elegy$/,
    cn: /^哈迪斯孤念歼灭战^/,
  },
  timelineFile: 'hades-ex.txt',
  timelineTriggers: [
    {
      id: 'HadesEx Comet',
      regex: /Comet 1/,
      beforeSeconds: 5,
      condition: function (data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Comet Towers',
        fr: 'Tours',
        cn: '踩塔',
      },
    },
  ],
  triggers: [
    {
      id: 'HadesEx Shadow Spread 1',
      regex: Regexes.startsUsing({ id: '47A8', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47A8', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47A8', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47A8', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47A8', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47A8', source: '하데스', capture: false }),
      alertText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
        cn: '散开',
      },
    },
    {
      id: 'HadesEx Shadow Spread 2',
      regex: Regexes.startsUsing({ id: '47A8', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47A8', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47A8', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47A8', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47A8', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47A8', source: '하데스', capture: false }),
      delaySeconds: 5.5,
      alertText: {
        en: 'Move',
        fr: 'Esquivez',
        cn: '移动',
      },
    },
    {
      id: 'HadesEx Ravenous Assault',
      regex: Regexes.startsUsing({ id: '47A6', source: 'Hades' }),
      regexCn: Regexes.startsUsing({ id: '47A6', source: '哈迪斯' }),
      regexDe: Regexes.startsUsing({ id: '47A6', source: 'Hades' }),
      regexFr: Regexes.startsUsing({ id: '47A6', source: 'Hadès' }),
      regexJa: Regexes.startsUsing({ id: '47A6', source: 'ハーデス' }),
      regexKo: Regexes.startsUsing({ id: '47A6', source: '하데스' }),
      alertText: function (data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑点名',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑点 ' + data.ShortName(matches.target),
          };
        }
      },
      infoText: function (data, matches) {
        if (matches.target == data.me || data.role != 'tank')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
          cn: '死刑点 ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'HadesEx Bad Faith Left 1',
      regex: Regexes.startsUsing({ id: '47AB', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47AB', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47AB', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47AB', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47AB', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47AB', source: '하데스', capture: false }),
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Bad Faith Left 2',
      regex: Regexes.startsUsing({ id: '47AB', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47AB', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47AB', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47AB', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47AB', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47AB', source: '하데스', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Then Right',
        de: 'Dann Rechts',
        fr: 'Droite',
        cn: '然后右',
      },
    },
    {
      id: 'HadesEx Bad Faith Right 1',
      regex: Regexes.startsUsing({ id: '47AC', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47AC', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47AC', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47AC', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47AC', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47AC', source: '하데스', capture: false }),
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
      },
    },
    {
      id: 'HadesEx Bad Faith Right 2',
      regex: Regexes.startsUsing({ id: '47AC', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47AC', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47AC', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47AC', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47AC', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47AC', source: '하데스', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Then Left',
        de: 'Dann Links',
        fr: 'Gauche',
        cn: '然后左',
      },
    },
    {
      id: 'HadesEx Arcane Control Orbs',
      regex: Regexes.addedCombatant({ name: 'Arcane Globe', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '球体魔法阵', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Arkan(?:e|er|es|en) Kugel', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Globe Arcanique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '球体魔法陣', capture: false }),
      durationSeconds: 6,
      suppressSeconds: 2,
      infoText: {
        en: 'Go to Safe Spot',
        de: 'Geh zur sicheren Stelle',
        fr: 'Allez dans la zone sûre',
        cn: '前往安全区域',
      },
    },
    {
      id: 'HadesEx Arcane Control Doors',
      regex: Regexes.addedCombatant({ name: 'Arcane Font', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '立体魔法阵', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Arkan(?:e|er|es|en) Körper', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Solide Arcanique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '立体魔法陣', capture: false }),
      durationSeconds: 6,
      suppressSeconds: 2,
      infoText: {
        en: 'Hide Behind Door',
        de: 'Hinter der Tür verstecken',
        fr: 'Cachez-vous derrière le mirroir',
        cn: '镜子后躲避',
      },
    },
    {
      id: 'HadesEx Quake III',
      regex: Regexes.startsUsing({ id: '47B8', source: 'Nabriales\'s Shade', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47B8', source: 'Nabriales\' Schatten', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47B8', source: 'Spectre De Nabriales', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47B8', source: 'ナプリアレスの影', capture: false }),
      delaySeconds: 25,
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'HadesEx Dark II Tether',
      regex: Regexes.tether({ id: '0011', source: 'Shadow Of The Ancients' }),
      regexCn: Regexes.tether({ id: '0011', source: '古代人之影' }),
      regexDe: Regexes.tether({ id: '0011', source: 'Schatten Der Alten' }),
      regexFr: Regexes.tether({ id: '0011', source: 'Spectre D\'Ascien' }),
      regexJa: Regexes.tether({ id: '0011', source: '古代人の影' }),
      regexKo: Regexes.tether({ id: '0011', source: '고대인의 그림자' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Point Tether Out',
        de: 'Verbindung nach draußen richten',
        fr: 'Liens vers l\'extérieur',
        cn: '连线',
      },
    },
    {
      id: 'HadesEx Ancient Water 3',
      regex: Regexes.headMarker({ id: '003E' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Healer Stacks',
        de: 'Bei dem Heiler sammeln',
        fr: 'Package sur les heals',
        cn: '治疗集合',
      },
      run: function (data) {
        data.waterDarkMarker = true;
      },
    },
    {
      id: 'HadesEx Ancient Darkness',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Tank Spread',
        de: 'Tanks verteilen',
        fr: 'Tanks : dispersion',
        cn: '坦克散开',
      },
      run: function (data) {
        data.waterDarkMarker = true;
      },
    },
    {
      id: 'HadesEx Ancient Water Unmarked',
      regex: Regexes.headMarker({ id: ['0030', '0060'], capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function (data) {
        if (data.waterDarkMarker)
          return;
        return {
          en: 'Healer Stacks',
          de: 'Bei den Heilern sammeln',
          fr: 'Package sur les heals',
          cn: '治疗集合',
        };
      },
    },
    {
      id: 'HadesEx Shades Too Close',
      regex: Regexes.tether({ id: '000E', source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'], target: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'], capture: false }),
      regexCn: Regexes.tether({ id: '000E', source: ['以格约姆之影', '拉哈布雷亚之影'], target: ['以格约姆之影', '拉哈布雷亚之影'], capture: false }),
      regexDe: Regexes.tether({ id: '000E', source: ['Igeyorhms Schatten', 'Lahabreas Schatten'], target: ['Igeyorhms Schatten', 'Lahabreas Schatten'], capture: false }),
      regexFr: Regexes.tether({ id: '000E', source: ['Spectre d\'Igeyorhm', 'Spectre De Lahabrea'], target: ['Spectre d\'Igeyorhm', 'Spectre De Lahabrea'], capture: false }),
      regexJa: Regexes.tether({ id: '000E', source: ['イゲオルムの影', 'ラハブレアの影'], target: ['イゲオルムの影', 'ラハブレアの影'], capture: false }),
      suppressSeconds: 10,
      condition: function (data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Move Shades Apart',
        de: 'Schatten auseinander ziehen',
        fr: 'Ecartez les spectres',
        cn: '拉开无影',
      },
    },
    {
      id: 'HadesEx Spheres',
      regex: Regexes.startsUsing({ id: '47BD', source: 'Igeyorhm\'s Shade', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47BD', source: '以格约姆之影', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47BD', source: 'Igeyorhms Schatten', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47BD', source: 'Spectre D\'Igeyorhm', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47BD', source: 'イゲオルムの影', capture: false }),
      condition: function (data) {
        return data.role == 'tank';
      },
      infoText: function (data) {
        if (!data.sphereCount)
          return;
        return {
          en: 'tank swap soon',
          de: 'Gleich: Tank swap',
          fr: 'Tank swap bientôt',
          cn: '坦克即将换T',
        };
      },
      run: function (data) {
        data.sphereCount = (data.sphereCount || 0) + 1;
      },
    },
    {
      id: 'HadesEx Annihilation',
      regex: Regexes.startsUsing({ id: '47BF', source: 'Lahabrea\'s And Igeyorhm\'s Shades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47BF', source: '拉哈布雷亚与以格约姆之影', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47BF', source: 'Lahabrea Und Igeyorhm', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47BF', source: 'Duo D\'Asciens', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47BF', source: 'ラハブレアとイゲオルム', capture: false }),
      condition: function (data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'HadesEx Burning Brand',
      regex: Regexes.gainsEffect({ effect: 'Burning Brand' }),
      regexCn: Regexes.gainsEffect({ effect: '火之烙印' }),
      regexDe: Regexes.gainsEffect({ effect: 'Brandmal Des Feuers' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marque De Feu' }),
      regexJa: Regexes.gainsEffect({ effect: '火の烙印' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Attack Igeyorhm',
        de: 'Igeyorhm angreifen',
        fr: 'Attaquez Igeyorhm',
        cn: '攻击以格约姆',
      },
      run: function (data) {
        data.brand = 'fire';
      },
    },
    {
      id: 'HadesEx Freezing Brand',
      regex: Regexes.gainsEffect({ effect: 'Freezing Brand' }),
      regexCn: Regexes.gainsEffect({ effect: '冰之烙印' }),
      regexDe: Regexes.gainsEffect({ effect: 'Brandmal Des Eises' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marque De Glace' }),
      regexJa: Regexes.gainsEffect({ effect: '氷の烙印' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Attack Lahabrea',
        de: 'Lahabrea angreifen',
        fr: 'Attaquez Lahabrea',
        cn: '攻击拉哈布雷亚',
      },
      run: function (data) {
        data.brand = 'ice';
      },
    },
    {
      id: 'HadesEx Blizzard IV',
      regex: Regexes.startsUsing({ id: '47C3', source: 'Igeyorhm\'s Shade' }),
      regexCn: Regexes.startsUsing({ id: '47C3', source: '以格约姆之影' }),
      regexDe: Regexes.startsUsing({ id: '47C3', source: 'Igeyorhms Schatten' }),
      regexFr: Regexes.startsUsing({ id: '47C3', source: 'Spectre D\'Igeyorhm' }),
      regexJa: Regexes.startsUsing({ id: '47C3', source: 'イゲオルムの影' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        cn: '死刑点名',
      },
    },
    {
      id: 'HadesEx Fire IV',
      regex: Regexes.startsUsing({ id: '47C2', source: 'Lahabrea\'s Shade' }),
      regexCn: Regexes.startsUsing({ id: '47C2', source: '拉哈布雷亚之影' }),
      regexDe: Regexes.startsUsing({ id: '47C2', source: 'Lahabreas Schatten' }),
      regexFr: Regexes.startsUsing({ id: '47C2', source: 'Spectre De Lahabrea' }),
      regexJa: Regexes.startsUsing({ id: '47C2', source: 'ラハブレアの影' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        cn: '死刑点名',
      },
    },
    {
      id: 'HadesEx Healers Blizzard/Fire IV',
      regex: Regexes.startsUsing({ id: ['47C3', '47C2'], source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'], capture: false }),
      regexCn: Regexes.startsUsing({ id: ['47C3', '47C2'], source: ['以格约姆之影', '拉哈布雷亚之影'], capture: false }),
      regexDe: Regexes.startsUsing({ id: ['47C3', '47C2'], source: ['Igeyorhms Schatten', 'Lahabreas Schatten'], capture: false }),
      regexFr: Regexes.startsUsing({ id: ['47C3', '47C2'], source: ['Spectre d\'Igeyorhm', 'Spectre De Lahabrea'], capture: false }),
      regexJa: Regexes.startsUsing({ id: ['47C3', '47C2'], source: ['イゲオルムの影', 'ラハブレアの影'], capture: false }),
      condition: function (data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Tank Busters',
        de: 'Tankbuster',
        fr: 'Tankbuster',
        cn: '坦克死刑',
      },
    },
    {
      id: 'HadesEx Doom',
      regex: Regexes.gainsEffect({ effect: 'Doom', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '死亡宣告', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Verhängnis', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Glas', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '死の宣告', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '죽음의 선고', capture: false }),
      suppressSeconds: 5,
      condition: function (data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal T/H to Full',
        de: 'Heile T/H voll',
        fr: 'T/H full vie',
        cn: '奶满T奶',
      },
    },
    {
      id: 'HadesEx Shriek',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek' }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎' }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice' }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声' }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침' }),
      suppressSeconds: 2,
      delaySeconds: function (data, matches) {
        return parseFloat(matches.duration) - 2;
      },
      alarmText: {
        en: 'Look Away',
        de: 'Weg schauen',
        fr: 'Regardez vers l\'extérieur',
        cn: '背对',
      },
    },
    {
      id: 'HadesEx Beyond Death',
      regex: Regexes.gainsEffect({ effect: 'Beyond Death' }),
      regexCn: Regexes.gainsEffect({ effect: '超越死亡' }),
      regexDe: Regexes.gainsEffect({ effect: 'Jenseits Des Jenseits' }),
      regexFr: Regexes.gainsEffect({ effect: 'Outre-Mort' }),
      regexJa: Regexes.gainsEffect({ effect: '死の超越' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음 초월' }),
      durationSeconds: 8,
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Get Killed',
        de: 'Stirb',
        fr: 'Mourrez',
        cn: '自杀',
      },
    },
    {
      id: 'HadesEx Ancient Circle',
      regex: Regexes.gainsEffect({ effect: 'Ancient Circle' }),
      regexCn: Regexes.gainsEffect({ effect: '古代圆环' }),
      regexDe: Regexes.gainsEffect({ effect: 'Orbis Antiquus' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cercle Ancien' }),
      regexJa: Regexes.gainsEffect({ effect: 'エンシェントリング' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function (data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: {
        en: 'Donut on YOU',
        de: 'Donut auf DIR',
        fr: 'Donut sur VOUS',
        cn: '月环点名',
      },
    },
    {
      id: 'HadesEx Forked Lightning',
      regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
      regexCn: Regexes.gainsEffect({ effect: '叉形闪电' }),
      regexDe: Regexes.gainsEffect({ effect: 'Gabelblitz' }),
      regexFr: Regexes.gainsEffect({ effect: 'Éclair Ramifié' }),
      regexJa: Regexes.gainsEffect({ effect: 'フォークライトニング' }),
      regexKo: Regexes.gainsEffect({ effect: '갈래 번개' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function (data, matches) {
        return parseFloat(matches.duration) - 2;
      },
      alertText: {
        en: 'Stay Out',
        de: 'Draußen stehen',
        fr: 'Restez éloigné',
        cn: '外侧放雷',
      },
    },
    {
      id: 'HadesEx Blight',
      regex: Regexes.startsUsing({ id: '47CC', source: 'Ascian Prime\'s Shade', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47CC', source: '至尊无影之影', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47CC', source: 'Schatten Des Prim-Ascian', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47CC', source: 'Spectre De Primo-Ascien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47CC', source: 'アシエン・プライムの影', capture: false }),
      delaySeconds: 12,
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
        de: 'AoE + Blutung',
        fr: 'Dégâts de zone + saignement',
        cn: 'AOE + 流血',
      },
    },
    {
      id: 'HadesEx Height Of Chaos',
      regex: Regexes.startsUsing({ id: '47D1', source: 'Ascian Prime\'s Shade' }),
      regexCn: Regexes.startsUsing({ id: '47D1', source: '至尊无影之影' }),
      regexDe: Regexes.startsUsing({ id: '47D1', source: 'Schatten Des Prim-Ascian' }),
      regexFr: Regexes.startsUsing({ id: '47D1', source: 'Spectre De Primo-Ascien' }),
      regexJa: Regexes.startsUsing({ id: '47D1', source: 'アシエン・プライムの影' }),
      alertText: function (data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑点名',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑点 ' + data.ShortName(matches.target),
          };
        }
        return {
          en: 'Away from ' + data.ShortName(matches.target),
          fr: 'Eloignez-vous de ' + data.ShortName(matches.target),
          cn: '远离 ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'HadesEx Megiddo Flame',
      regex: Regexes.startsUsing({ id: '47CD', source: 'Ascian Prime\'s Shade', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47CD', source: '至尊无影之影', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47CD', source: 'Schatten Des Prim-Ascian', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47CD', source: 'Spectre De Primo-Ascien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47CD', source: 'アシエン・プライムの影', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Healer Stacks',
        de: 'Bei den Heilern sammeln',
        fr: 'Package sur les heals',
        cn: '治疗集合',
      },
    },
    {
      id: 'HadesEx Shadow Flare',
      regex: Regexes.startsUsing({ id: '47D0', source: 'Ascian Prime\'s Shade', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47D0', source: '至尊无影之影', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47D0', source: 'Schatten Des Prim-Ascian', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47D0', source: 'Spectre De Primo-Ascien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47D0', source: 'アシエン・プライムの影', capture: false }),
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'HadesEx Captivity',
      regex: Regexes.headMarker({ id: '0078' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Get Out',
        de: 'Raus gehen',
        fr: 'Sortez',
        cn: '远离',
      },
    },
    {
      id: 'HadesEx Aetherial Gaol',
      regex: Regexes.addedCombatant({ name: 'Aetherial Gaol', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '以太牢狱', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Ätherkerker', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Geôle Éthérée', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'エーテリアル・ジェイル', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '에테르 감옥', capture: false }),
      infoText: {
        en: 'Break Aetherial Gaol',
        de: 'Zerstöre Ätherkerker',
        fr: 'Détruisez la Geôle éthérée',
        cn: '打破牢狱',
      },
    },
    {
      id: 'HadesEx Dark Flame',
      regex: Regexes.headMarker({ id: '0064' }),
      condition: function (data, matches) {
        return matches.target == data.me;
      },
      run: function (data) {
        data.flame = true;
      },
      infoText: {
        en: 'Knockback + Stack on YOU',
        de: 'Rückstoß + sammeln beim DIR',
        fr: 'Poussée + package sur VOUS',
        cn: '击退 + 集合 点名',
      },
    },
    {
      id: 'HadesEx Dark Freeze',
      regex: Regexes.headMarker({ id: '00C1' }),
      condition: function (data, matches) {
        return matches.target == data.me;
      },
      run: function (data) {
        data.freeze = true;
      },
      infoText: {
        en: 'Knockback + Ice on YOU',
        de: 'Rückstoß + Eis auf DIR',
        fr: 'Poussée + Glace sur VOUS',
        cn: '击退 + 冰 点名',
      },
    },
    {
      id: 'HadesEx Wail Of The Lost',
      regex: Regexes.startsUsing({ id: '47E1', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47E1', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47E1', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47E1', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47E1', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47E1', source: '하데스', capture: false }),
      infoText: function (data) {
        if (!data.flame && !data.freeze) {
          return {
            en: 'Knockback + Stack With Partner',
            de: 'Rückstoß + sammeln beim Partner',
            fr: 'Poussée + package avec votre partenaire',
            cn: '与伙伴 击退 + 集合',
          };
        }
      },
    },
    {
      id: 'HadesEx Nether Blast',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function (data, matches) {
        return data.me == matches.target;
      },
      run: function (data) {
        data.netherBlast = true;
      },
      alertText: {
        en: 'Puddles on YOU',
        de: 'Fläsche auf YOU',
        fr: 'Puddle sur VOUS',
        cn: '水圈点名',
      },
    },
    {
      id: 'HadesEx Bident',
      regex: Regexes.startsUsing({ id: '47E3', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47E3', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47E3', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47E3', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47E3', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47E3', source: '하데스', capture: false }),
      condition: function (data) {
        return !data.netherBlast;
      },
      infoText: {
        en: 'Healer Stacks',
        de: 'Bei dem Heiler sammeln',
        fr: 'Package sur les heals',
        cn: '治疗集合',
      },
    },
    {
      id: 'HadesEx Shadow Stream',
      regex: Regexes.startsUsing({ id: '47EA', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47EA', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47EA', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47EA', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47EA', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47EA', source: '하데스', capture: false }),
      alertText: {
        en: 'Go Sides',
        de: 'Zu den Seiten gehen',
        fr: 'Allez sur les côtés',
        cn: '去两侧',
      },
    },
    {
      id: 'HadesEx Polydegmon\'s Purgation',
      regex: Regexes.startsUsing({ id: '47EB', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47EB', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47EB', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47EB', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47EB', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47EB', source: '하데스', capture: false }),
      alertText: {
        en: 'Front and Center',
        de: 'Vorne und Mitte',
        fr: 'Devant et au centre',
        cn: '中间前方',
      },
    },
    {
      id: 'HadesEx Dark Current',
      regex: Regexes.startsUsing({ id: '47F1', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47F1', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47F1', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47F1', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47F1', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47F1', source: '하데스', capture: false }),
      durationSeconds: 12,
      suppressSeconds: 10,
      infoText: {
        en: 'Exoflares',
        de: 'Exa-Flares',
        fr: 'Exaflares',
        cn: '地火',
      },
    },
    {
      id: 'HadesEx Gigantomachy',
      regex: Regexes.startsUsing({ id: '47F3', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47F3', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47F3', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47F3', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47F3', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47F3', source: '하데스', capture: false }),
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'HadesEx Quadrastrike 1',
      regex: Regexes.startsUsing({ id: '47F4', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47F4', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47F4', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47F4', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47F4', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47F4', source: '하데스', capture: false }),
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'HadesEx Quadrastrike 2',
      regex: Regexes.startsUsing({ id: '47F6', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47F6', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47F6', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47F6', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47F6', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47F6', source: '하데스', capture: false }),
      suppressSeconds: 2,
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alarmText: function (data) {
        if (data.role == 'tank') {
          return {
            en: 'Get Towers',
            de: 'Türme nehmen',
            fr: 'Dans les tours',
            cn: '踩塔',
          };
        }
      },
      infoText: function (data) {
        if (data.role == 'healer') {
          return {
            en: 'tank busters',
            de: 'Tank buster',
            fr: 'Tank busters',
            cn: '坦克死刑',
          };
        }
      },
    },
    { // After tanks take tower damage
      id: 'HadesEx Quadrastrike 3',
      regex: Regexes.ability({ id: '47F6', source: 'Hades', capture: false }),
      regexCn: Regexes.ability({ id: '47F6', source: '哈迪斯', capture: false }),
      regexDe: Regexes.ability({ id: '47F6', source: 'Hades', capture: false }),
      regexFr: Regexes.ability({ id: '47F6', source: 'Hadès', capture: false }),
      regexJa: Regexes.ability({ id: '47F6', source: 'ハーデス', capture: false }),
      regexKo: Regexes.ability({ id: '47F6', source: '하데스', capture: false }),
      suppressSeconds: 2,
      delaySeconds: 2,
      condition: function (data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
        de: 'AoE + Blutung',
        fr: 'Dégâts de zone + saignement',
        cn: 'AOE + 流血',
      },
    },
    {
      id: 'HadesEx Enrage Gigantomachy',
      regex: Regexes.startsUsing({ id: '47F9', source: 'Hades', capture: false }),
      regexCn: Regexes.startsUsing({ id: '47F9', source: '哈迪斯', capture: false }),
      regexDe: Regexes.startsUsing({ id: '47F9', source: 'Hades', capture: false }),
      regexFr: Regexes.startsUsing({ id: '47F9', source: 'Hadès', capture: false }),
      regexJa: Regexes.startsUsing({ id: '47F9', source: 'ハーデス', capture: false }),
      regexKo: Regexes.startsUsing({ id: '47F9', source: '하데스', capture: false }),
      infoText: {
        en: 'Enrage',
        de: 'Finalangriff',
        fr: 'Enrage',
        cn: '狂暴',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Arcane Font': '立体魔法阵',
        'Arcane Globe': '球体魔法阵',
        'Ascian Prime\'s Shade': '至尊无影之影',
        'Engage!': '战斗开始！',
        'Hades': '哈迪斯',
        'Igeyorhm\'s Shade': '以格约姆之影',
        'Lahabrea\'s Shade': '拉哈布雷亚之影',
        'Lahabrea\'s and Igeyorhm\'s Shades': '拉哈布雷亚与以格约姆之影',
        'Nabriales\'s Shade': '那布里亚勒斯之影',
        'Shadow of the Ancients': '古代人之影',
      },
      'replaceText': {
        '--targetable--': '--可选中--',
        'Again The Abyssal Celebrant': '深渊祭司的记忆',
        'Again The Majestic': '尊严王的记忆',
        'Again The Martyr': '殉教者的记忆',
        'Ancient Circle': '古代圆环',
        'Ancient Dark IV': '古代冥暗',
        'Ancient Darkness': '古代黑暗',
        'Ancient Double': '古代双重',
        'Ancient Eruption': '古火喷发',
        'Ancient Water III': '古代狂水',
        'Annihilation': '湮灭',
        'Arcane Control': '魔法阵启动',
        'Arcane Utterance': '魔法阵记述',
        'Bad Faith': '失信',
        'Blight': '毒雾',
        'Blizzard IV': '冰澈柱',
        'Blizzard Sphere': '冰结球',
        'Broken Faith': '背信',
        'Life In Captivity': '囚禁生命',
        'Captivity': '囚禁',
        'Dark Current': '黑暗奔流',
        'Dark Flame': '暗黑之炎',
        'Dark Freeze': '黑暗玄冰',
        'Dark II': '昏暗',
        'Dark Seal': '黑暗咒印',   
        'Death Shriek': '死亡尖叫',
        'Fire IV': '炽炎',
        'Fire Sphere': '火炎球',
        'Forked Lightning': '叉形闪电',
        'Gigantomachy Enrage': '巨人之战 狂暴',
        'Gigantomachy': '巨人之战',
        'Height Of Chaos': '混沌之巅',
        'Magic Chakram/Spear': '魔法轮/矛',
        'Magic Spear/Chakram': '魔法矛/轮',
        'Magic Chakram': '魔法轮',
        'Magic Spear': '魔法矛',
        'Megiddo Flame': '米吉多烈焰',
        'Nether Blast': '幽冥冲击',
        'Purgation': '冥王净化',
        'Quake III': '爆震',
        'Ravenous Assault': '贪婪突袭',
        'Shadow Flare': '暗影核爆',
        'Shadow Spread': '暗影扩散',
        'Stream': '暗影流',
        'Titanomachy Enrage': '诸神之战 狂暴',
        'Titanomachy': '诸神之战',
        'Universal Manipulation': '法则变更',
        'Wail Of The Lost': '逝者的哀嚎',
        'Comet': '彗星',
        'Quadrastrike Tower': '四重强袭 塔',
        'Quadrastrike Bleed': '四重强袭 流血',
        'Quadrastrike': '四重强袭',
      },
    },
  ],
}];
