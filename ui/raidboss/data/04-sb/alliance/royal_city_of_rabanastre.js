'use strict';

[{
  zoneRegex: /^The Royal City Of Rabanastre$/,
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: Regexes.startsUsing({ id: '2633', source: 'Mateus, The Corrupt', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2633', source: 'Mateus (?:der|die|das) Peiniger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2633', source: 'Mateus Le Corrompu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2633', source: '背徳の皇帝マティウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2633', source: '背德皇帝马提乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2633', source: '배덕의 황제 마티우스', capture: false }),
      delaySeconds: 11,
      infoText: {
        en: 'Kill Aqua Spheres',
        de: 'Wasserkugeln zerstören',
        fr: 'Détruire les bulles d\'eau',
      },
      tts: {
        en: 'adds',
        de: 'etz',
        fr: 'adds',
      },
    },
    {
      id: 'Rab Mateus Breathless Gain',
      regex: Regexes.gainsEffect({ effect: 'Breathless' }),
      regexDe: Regexes.gainsEffect({ effect: 'Atemnot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Suffocation' }),
      regexJa: Regexes.gainsEffect({ effect: '呼吸困難' }),
      regexCn: Regexes.gainsEffect({ effect: '呼吸困难' }),
      regexKo: Regexes.gainsEffect({ effect: '호흡곤란' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.breathless >= 7) {
          return {
            en: 'Breathless: ' + (data.breathless + 1),
            de: 'Atemnot: ' + (data.breathless + 1),
            fr: 'Suffocation :' + (data.breathless + 1),
          };
        }
      },
      alarmText: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'Get In Bubble',
            de: 'Geh in die Blase',
            fr: 'Allez dans une bulle',
          };
        }
      },
      tts: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'bubble',
            de: 'blase',
            fr: 'bulle',
          };
        }
      },
      run: function(data) {
        data.breathless = data.breathless | 0;
        data.breathless++;
      },
    },
    {
      id: 'Rab Mateus Breathless Lose',
      regex: Regexes.losesEffect({ effect: 'Breathless' }),
      regexDe: Regexes.losesEffect({ effect: 'Atemnot' }),
      regexFr: Regexes.losesEffect({ effect: 'Suffocation' }),
      regexJa: Regexes.losesEffect({ effect: '呼吸困難' }),
      regexCn: Regexes.losesEffect({ effect: '呼吸困难' }),
      regexKo: Regexes.losesEffect({ effect: '호흡곤란' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      regex: Regexes.startsUsing({ id: '263D', source: 'Mateus, The Corrupt', capture: false }),
      regexDe: Regexes.startsUsing({ id: '263D', source: 'Mateus (?:der|die|das) Peiniger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '263D', source: 'Mateus Le Corrompu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '263D', source: '背徳の皇帝マティウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '263D', source: '背德皇帝马提乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '263D', source: '배덕의 황제 마티우스', capture: false }),
      alertText: {
        en: 'Move To Safe Spot',
        de: 'Zur sicheren Zone',
        fr: 'Allez en zone sûre',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
        fr: 'Zone sure',
      },
    },
    {
      id: 'Rab Hashmal Rock Cutter',
      regex: Regexes.startsUsing({ id: '25D7', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25D7', source: 'Hashmallim (?:der|die|das) Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25D7', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25D7', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25D7', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25D7', source: '통제자 하쉬말림', capture: false }),
      infoText: {
        en: 'Tank Cleave',
        de: 'Tank Cleave',
        fr: 'Tank Cleave',
      },
      tts: {
        en: 'tank cleave',
        de: 'tenk klief',
        fr: 'tank clive',
      },
    },
    {
      id: 'Rab Hashmal Earth Hammer',
      regex: Regexes.startsUsing({ id: '25CB', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25CB', source: 'Hashmallim (?:der|die|das) Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25CB', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25CB', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25CB', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25CB', source: '통제자 하쉬말림', capture: false }),
      alertText: {
        en: 'Move Away',
        de: 'Weg da',
        fr: 'Eloignez-vous',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
        fr: 'Eloignez vous',
      },
    },
    {
      id: 'Rab Hashmal Golems',
      regex: Regexes.startsUsing({ id: '25D4', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25D4', source: 'Hashmallim (?:der|die|das) Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25D4', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25D4', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25D4', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25D4', source: '통제자 하쉬말림', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Kill Golems',
        de: 'Golems töten',
        fr: 'Détruisez les golems',
      },
      tts: {
        en: 'adds',
        de: 'etz',
        fr: 'adds',
      },
    },
    {
      id: 'Rab Trash Dragon Voice',
      regex: Regexes.startsUsing({ id: 'D10', source: 'Archaeolion', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'D10', source: 'Archaeolöwe', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'D10', source: 'Archéochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'D10', source: 'アルケオキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'D10', source: '古奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'D10', source: '원시 키마이라', capture: false }),
      alertText: {
        en: 'Dragon Voice: Move In',
        de: 'Stimme Des Drachen: Rein',
        fr: 'Voix Du Dragon : Packez-vous',
      },
      tts: {
        en: 'dragon voice',
        de: 'Stimme des Drachen',
        fr: 'Voix Du Dragon',
      },
    },
    {
      id: 'Rab Trash Ram Voice',
      regex: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archaeolion', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archaeolöwe', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archéochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'アルケオキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['D0F', '273B'], source: '古奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['D0F', '273B'], source: '원시 키마이라', capture: false }),
      alertText: {
        en: 'Ram Voice: Move Out',
        de: 'Stimme Des Widders: Raus',
        fr: 'Voix Du Bélier : Eloignez-vous',
      },
      tts: {
        en: 'rams voice',
        de: 'Stimme des Widders',
        fr: 'Voix Du Bélier',
      },
    },
    {
      id: 'Rab Rofocale Chariot',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Move In (Chariot)',
        de: 'Raus da (Streitwagen)',
        fr: 'Allez dedans (Chariot)',
      },
      tts: {
        en: 'chariot',
        de: 'Streitwagen',
        fr: 'chariot',
      },
    },
    {
      id: 'Rab Rofocale Trample',
      regex: Regexes.startsUsing({ id: '2676', source: 'Rofocale', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2676', source: 'Rofocale', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2676', source: 'Rofocale Le Roi Centaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2676', source: '人馬王ロフォカレ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2676', source: '人马王洛弗卡勒', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2676', source: '인마왕 로포칼레', capture: false }),
      alertText: {
        en: 'Trample',
        de: 'Zertrampeln',
        fr: 'Fauchage',
      },
    },
    {
      regex: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexDe: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexFr: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexJa: Regexes.ability({ source: '冷血剣アルガス', id: '261A', capture: false }),
      regexCn: Regexes.ability({ source: '冷血剑阿加斯', id: '261A', capture: false }),
      regexKo: Regexes.ability({ source: '냉혈검 아르가스', id: '261A', capture: false }),
      run: function(data) {
        data.maskValue = true;
      },
    },
    {
      regex: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexDe: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexFr: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexJa: Regexes.ability({ source: '冷血剣アルガス', id: '2619', capture: false }),
      regexCn: Regexes.ability({ source: '冷血剑阿加斯', id: '2619', capture: false }),
      regexKo: Regexes.ability({ source: '냉혈검 아르가스', id: '2619', capture: false }),
      run: function(data) {
        data.maskValue = false;
      },
    },
    {
      id: 'Rab Argath Command Scatter',
      regex: Regexes.headMarker({ id: '007B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.maskValue) {
          return {
            en: 'Move',
            de: 'Bewegen',
            fr: 'Bougez',
          };
        }
        return {
          en: 'Stop',
          de: 'Stopp',
          fr: 'Stop',
        };
      },
    },
    {
      id: 'Rab Argath Command Turn',
      regex: Regexes.headMarker({ id: '007C' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.maskValue) {
          return {
            en: 'Look Away',
            de: 'Wegschauen',
            fr: 'Regardez ailleurs',
          };
        }
        return {
          en: 'Look Towards',
          de: 'Anschauen',
          fr: 'Regardez le boss',
        };
      },
    },
  ],
}];
