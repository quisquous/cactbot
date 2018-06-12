'use strict';

[{
  zoneRegex: /^The Royal City Of Rabanastre$/,
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: /:Mateus, The Corrupt starts using Unbind/,
      regexDe: /:Mateus der Peiniger starts using Loseisen/,
      regexFr: /:Mateus Le Corrompu starts using Délivrance/,
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
      regex: /:(\y{Name}) gains the effect of Breathless from/,
      regexDe: /:(\y{Name}) gains the effect of Atemnot from/,
      regexFr: /:(\y{Name}) gains the effect of Suffocation from/,
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
      regex: /:(\y{Name}) loses the effect of Breathless from/,
      regexDe: /:(\y{Name}) loses the effect of Atemnot from/,
      regexFr: /:(\y{Name}) loses the effect of Suffocation from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      regex: /:Mateus, The Corrupt starts using Blizzard IV/,
      regexDe: /:Mateus der Peiniger starts using Eiska/,
      regexFr: /:Mateus Le Corrompu starts using Giga Glace/,
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
      regex: /:Hashmal, Bringer Of Order starts using Rock Cutter/,
      regexDe: /:Hashmallim der Einiger starts using Steinfräse/,
      regexFr: /:Hashmal Le Grand Ordonnateur starts using Trancheur Rocheux/,
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
      regex: /:Hashmal, Bringer Of Order starts using Earth Hammer/,
      regexDe: /:Hashmallim der Einiger starts using Erdhammer/,
      regexFr: /:Hashmal Le Grand Ordonnateur starts using Marteau Tellurique/,
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
      regex: /:Hashmal, Bringer Of Order starts using Summon/,
      regexDe: /:Hashmallim der Einiger starts using Beschwörung/,
      regexFr: /:Hashmal Le Grand Ordonnateur starts using Invocation/,
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
      regex: /:Archaeolion starts using The Dragon's Voice/,
      regexDe: /:Archaeolöwe starts using Stimme Des Drachen/,
      regexFr: /:Archéochimère starts using Voix Du Dragon/,
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
      regex: /:Archaeolion starts using The Ram's Voice/,
      regexDe: /:Archaeolöwe starts using Stimme Des Widders/,
      regexFr: /:Archéochimère starts using Voix Du Bélier/,
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
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
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
      regex: /:Rofocale starts using Trample/,
      regexDe: /:Rofocale starts using Zertrampeln/,
      regexFr: /:Rofocale starts using Fauchage/,
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
      regex: /1B:........:(\y{Name}):....:....:007B:0000:0000:0000:/,
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
      regex: /1B:........:(\y{Name}):....:....:007C:0000:0000:0000:/,
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
