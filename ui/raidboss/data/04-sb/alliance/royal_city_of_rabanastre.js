'use strict';

[{
  zoneRegex: /^The Royal City Of Rabanastre$/,
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: / 14:2633:Mateus, The Corrupt starts using Unbind/,
      regexDe: / 14:2633:Mateus der Peiniger starts using Loseisen/,
      regexFr: / 14:2633:Mateus Le Corrompu starts using Délivrance/,
      regexJa: / 14:2633:背徳の皇帝マティウス starts using 拘束解放/,
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
      regex: Regexes.gainsEffect({ effect: 'Breathless', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Atemnot', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Suffocation', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '呼吸困難', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '呼吸困难', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '호흡곤란', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
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
      regex: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Breathless from/,
      regexDe: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Atemnot from/,
      regexFr: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Suffocation from/,
      regexJa: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of 呼吸困難 from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      regex: / 14:263D:Mateus, The Corrupt starts using Blizzard IV/,
      regexDe: / 14:263D:Mateus der Peiniger starts using Eiska/,
      regexFr: / 14:263D:Mateus Le Corrompu starts using Giga Glace/,
      regexJa: / 14:263D:背徳の皇帝マティウス starts using ブリザジャ/,
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
      regex: / 14:25D7:Hashmal, Bringer Of Order starts using Rock Cutter/,
      regexDe: / 14:25D7:Hashmallim der Einiger starts using Steinfräse/,
      regexFr: / 14:25D7:Hashmal Le Grand Ordonnateur starts using Trancheur Rocheux/,
      regexJa: / 14:25D7:統制者ハシュマリム starts using ロックカッター/,
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
      regex: / 14:25CB:Hashmal, Bringer Of Order starts using Earth Hammer/,
      regexDe: / 14:25CB:Hashmallim der Einiger starts using Erdhammer/,
      regexFr: / 14:25CB:Hashmal Le Grand Ordonnateur starts using Marteau Tellurique/,
      regexJa: / 14:25CB:統制者ハシュマリム starts using 大地のハンマー/,
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
      regex: / 14:25D4:Hashmal, Bringer Of Order starts using Summon/,
      regexDe: / 14:25D4:Hashmallim der Einiger starts using Rufen/,
      regexFr: / 14:25D4:Hashmal Le Grand Ordonnateur starts using Invocation/,
      regexJa: / 14:25D4:統制者ハシュマリム starts using 召喚/,
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
      regex: / 14:D10:Archaeolion starts using The Dragon's Voice/,
      regexDe: / 14:D10:Archaeolöwe starts using Stimme Des Drachen/,
      regexFr: / 14:D10:Archéochimère starts using Voix Du Dragon/,
      regexJa: / 14:D10:アルケオキマイラ starts using 雷電の咆哮/,
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
      regex: / 14:(?:D0F|273B):Archaeolion starts using The Ram's Voice/,
      regexDe: / 14:(?:D0F|273B):Archaeolöwe starts using Stimme Des Widders/,
      regexFr: / 14:(?:D0F|273B):Archéochimère starts using Voix Du Bélier/,
      regexJa: / 14:(?:D0F|273B):アルケオキマイラ starts using 氷結の咆哮/,
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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
      regex: / 14:2676:Rofocale starts using Trample/,
      regexDe: / 14:2676:Rofocale starts using Zertrampeln/,
      regexFr: / 14:2676:Rofocale Le Roi Centaure starts using Fauchage/,
      regexJa: / 14:2676:人馬王ロフォカレ starts using 蹂躙/,
      alertText: {
        en: 'Trample',
        de: 'Zertrampeln',
        fr: 'Fauchage',
      },
    },
    {
      regex: /:Argath Thadalfus:261A:Mask Of Truth:/,
      regexDe: /:Argath Thadalfus:261A:Maske Der Wahrheit:/,
      regexFr: /:Argath Thadalfus:261A:Masque De La Vérité:/,
      run: function(data) {
        data.maskValue = true;
      },
    },
    {
      regex: /:Argath Thadalfus:2619:Mask Of Lies:/,
      regexDe: /:Argath Thadalfus:2619:Maske Der Lüge:/,
      regexFr: /:Argath Thadalfus:2619:Masque Du Mensonge:/,
      run: function(data) {
        data.maskValue = false;
      },
    },
    {
      id: 'Rab Argath Command Scatter',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:007B:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:007C:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
