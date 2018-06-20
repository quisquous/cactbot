'use strict';

[{
  zoneRegex: /Eureka Anemos/,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      regex: /14:2AD5:Void Garm starts using The Dragon's Voice/,
      regexDe: /14:2AD5:Nichts-Garm starts using Stimme Des Drachen/,
      regexFr: /14:2AD5:Garm Du Néant starts using Voix Du Dragon/,
      infoText: {
        en: 'Dragon\'s Voice',
        de: 'Stimme Des Drachen',
        fr: 'Voix Du Dragon',
      },
      tts: {
        en: 'Dragon\'s Voice',
        de: 'drache',
        fr: 'Voix Du Dragon',
      },
    },
    {
      id: 'Euereka Sabotender Stack Marker',
      regex: /14:29EB:Sabotender Corrido starts using 100,000 Needles on (\y{Name})/,
      regexDe: /14:29EB:Sabotender Corrido starts using 100\.000 Nadeln on (\y{Name})/,
      regexFr: /14:29EB:Pampa Corrido starts using 100 000 Aiguilles on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;

        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
          fr: 'Stack sur VOUS',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;

        return {
          en: '100k Needle Stack',
          de: '100k Nadeln Stack',
          fr: 'Stack 100k Aiguilles',
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'stack on you',
            de: 'stek auf dir',
            fr: 'Stack sur vous',
          };
        }
        return {
          en: 'needle stack',
          de: 'nadel stek',
          fr: 'stack aiguille',
        };
      },
    },
    {
      id: 'Eureka Poly Swipe',
      regex: /14:2A71:Polyphemus starts using 100-Tonze Swipe/,
      regexDe: /14:2A71:Polyphemus starts using 100-Tonzen-Hieb/,
      regexFr: /14:2A71:Polyphemus starts using Fauche De 100 Tonz/,
      infoText: {
        en: 'Swipe',
        de: 'Hieb',
        fr: 'Fauche',
      },
    },
    {
      id: 'Eureka Poly Swing',
      regex: /14:2A6E:Polyphemus starts using 10,000-Tonze Swing/,
      regexDe: /14:2A6E:Polyphemus starts using 10\.000-Tonzen-Schwung/,
      regexFr: /14:2A6E:Polyphemus starts using Swing De 10 000 Tonz/,
      alarmText: {
        en: 'GET OUT',
        de: 'RAUS DA',
        fr: 'ELOIGNEZ-VOUS',
      },
    },
    {
      id: 'Eureka Poly Eye',
      regex: /14:2A73:Polyphemus starts using Eye Of The Beholder/,
      regexDe: /14:2A73:Polyphemus starts using Auge Des Betrachters/,
      regexFr: /14:2A73:Polyphemus starts using L'œil Du Spectateur on Polyphemus/,
      alertText: {
        en: 'Eye Donut',
        de: 'Augendonut',
        fr: 'Donut œil',
      },
    },
    {
      id: 'Eureka Poly Glower',
      regex: /14:2A72:Polyphemus starts using Glower/,
      regexDe: /14:2A72:Polyphemus starts using Finsterer Blick/,
      regexFr: /14:2A72:Polyphemus starts using Regard Noir/,
      alertText: {
        en: 'Glower Laser',
        de: 'Blick Laser',
        fr: 'Regard Laser',
      },
    },
    {
      id: 'Eureka Caym Eye',
      regex: /14:2A64:Caym starts using Double Hex Eye/,
      regexDe: /14:2A64:Caym starts using Doppeltes Hex-Auge/,
      regexFr: /14:2A64:Caym starts using Double Œil Néfaste/,
      alarmText: {
        en: 'Look Away!',
        de: 'Wegschauen!',
        fr: 'Ne regardez pas',
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
        fr: 'Ne regardez pas',
      },
    },
    {
      id: 'Fafnir Terror',
      regex: /14:29B7:Fafnir starts using Absolute Terror/,
      regexDe: /14:29B7:Fafnir starts using Absoluter Terror/,
      regexFr: /14:29B7:Fafnir starts using Terreur Absolue/,
      alarmText: {
        en: 'Look Away!',
        de: 'Wegschauen!',
        fr: 'Ne regardez pas',
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
        fr: 'Ne regardez pas',
      },
    },
    {
      id: 'Eureka Voidscale Ice',
      regex: /14:29C3:Voidscale starts using Ball Of Ice on (\y{Name})/,
      regexDe: /14:29C3:Nichtsschuppe starts using Eisball on (\y{Name})/,
      regexFr: /14:29C3:Vidécailles starts using Boule De Glace on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Ice ball on you!',
        de: 'Eisball auf dir!',
        fr: 'Boule de glace sur vous!',
      },
      tts: {
        en: 'ice ball',
        de: 'eisball',
        fr: 'boule de glace',
      },
    },
    {
      id: 'Eureka Pazuzu Dread Wind',
      regex: /14:2899:Pazuzu starts using Dread Wind/,
      regexDe: /14:2899:Pazuzu starts using Furchtwind/,
      regexFr: /14:2899:Pazuzu starts using Vent D'effroi/,
      alarmText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Eloignez-vous',
      },
    },
    {
      id: 'Eureka Pazuzu Camisado',
      regex: /14:289F:Pazuzu starts using Camisado on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Buster on YOU',
        de: 'Tenkbasta auf DIR',
        fr: 'Tank Buster sur VOUS',
      },
      tts: {
        en: 'buster',
        de: 'basta',
        fr: 'tankbuster',
      },
    },
    {
      id: 'Eureka Pazuzu Cloud of Locust',
      regex: /14:2897:Pazuzu starts using Cloud Of Locust/,
      regexDe: /14:2897:Pazuzu starts using Heuschreckeninvasion/,
      regexFr: /14:2897:Pazuzu starts using Invasion De Sauterelles/,
      infoText: {
        en: 'Out of melee',
        de: 'Raus aus Nahkampf',
        fr: 'Eloignez-vous de la mélée',
      },
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      regex: /14:2896:Pazuzu starts using Plague Of Locusts/,
      regexDe: /14:2896:Pazuzu starts using Heuschreckenplage/,
      regexFr: /14:2896:Pazuzu starts using Nuée De Sauterelles/,
      alarmText: {
        en: 'Plague Donut',
        de: 'Plagen-Donut',
        fr: 'Donut Nuée',
      },
      tts: {
        en: 'plague donut',
        de: 'plagen dohnat',
        fr: 'Donut Nuée',
      },
    },
    {
      id: 'Eureka Wraith Count',
      regex: / 19:Shadow Wraith was defeated by/,
      regexDe: / 19:Schatten-Geist was defeated by/,
      regexFr: /(Spectre Des Ombres a été vaincu|Vous avez vaincu le spectre des ombres)/,
      infoText: function(data) {
        data.wraithCount = data.wraithCount || 0;
        data.wraithCount++;
        return {
          en: 'wraiths: ' + data.wraithCount,
          de: 'Geister: ' + data.wraithCount,
          fr: 'spectres: ' + data.wraithCount,
        };
      },
      soundVolume: 0,
    },
    {
      id: 'Eureka Pazuzu Pop',
      regex: /03:Added new combatant Pazuzu\./,
      run: function(data) {
        data.wraithCount = 0;
      },
    },
    {
      id: 'Eureka Falling Asleep',
      regex: /00:0039:5 minutes have elapsed since your last activity./,
      regexDe: /00:0039:Seit deiner letzten Aktivität sind 5 Minuten vergangen./,
      regexFr: /00:0039:Votre personnage est inactif depuis 5 minutes/,
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
      },
    },
  ],
}];
