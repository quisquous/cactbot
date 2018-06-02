[{
  zoneRegex: /Eureka Anemos/,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      regex: /14:2AD5:Void Garm starts using The Dragon's Voice/,
      regexDe: /14:2AD5:Nichts-Garm starts using Stimme Des Drachen/,
      infoText: {
        en: "Dragon's Voice",
        de: 'Stimme Des Drachen',
      },
      tts: {
        en: "Dragon's Voice",
        de: 'drache',
      },
    },
    {
      id: 'Euereka Sabotender Stack Marker',
      regex: /14:29EB:Sabotender Corrido starts using 100,000 Needles on (\y{Name})/,
      regexDe: /14:29EB:Sabotender Corrido starts using 100\.000 Nadeln on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] != data.me) {
          return;
        }
        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return;
        }
        return {
          en: '100k Needle Stack',
          de: '100k Nadeln Stack'
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'stack on you',
            de: 'stek auf dir',
          };
        }
        return {
          en: 'needle stack',
          de: 'nadel stek',
        };
      },
    },
    {
      id: 'Eureka Poly Swipe',
      regex: /14:2A71:Polyphemus starts using 100-Tonze Swipe/,
      regexDe: /14:2A71:Polyphemus starts using 100-Tonzen-Hieb/,
      infoText: {
        en: 'Swipe',
        de: 'Hieb',
      },
      tts: {
        en: 'swipe',
        de: 'Hieb',
      },
    },
    {
      id: 'Eureka Poly Swing',
      regex: /14:2A6E:Polyphemus starts using 10,000-Tonze Swing/,
      regexDe: /14:2A6E:Polyphemus starts using 10\.000-Tonzen-Schwung/,
      alarmText: {
        en: 'GET OUT',
        de: 'RAUS DA',
      },
      tts: {
        en: 'get out',
        de: 'raus da',
      },
    },
    {
      id: 'Eureka Poly Eye',
      regex: /14:2A73:Polyphemus starts using Eye Of The Beholder/,
      regexDe: /14:2A73:Polyphemus starts using Auge Des Betrachters/,
      alertText: {
        en: 'Eye Donut',
        de: 'Augendonut',
      },
      tts: {
        en: 'eye donut',
        de: 'augen dohnat'
      },
    },
    {
      id: 'Eureka Poly Glower',
      regex: /14:2A72:Polyphemus starts using Glower/,
      regexDe: /14:2A72:Polyphemus starts using Finsterer Blick/,
      alertText: {
        en: 'Glower Laser',
        de: 'Blick Laser',
      },
      tts: {
        en: 'Glower',
        de: 'Blick Lehsa',
      },
    },
    {
      id: 'Eureka Caym Eye',
      regex: /14:2A64:Caym starts using Double Hex Eye/,
      regexDe: /14:2A64:Caym starts using Doppeltes Hex-Auge/,
      alarmText: {
        en: 'Look Away!',
        de: 'Wegschauen!',
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
      },
    },
    {
      id: 'Fafnir Terror',
      regex: /14:29B7:Fafnir starts using Absolute Terror/,
      regexDe: /14:29B7:Fafnir starts using Absoluter Terror/,
      alarmText: {
        en: 'Look Away!',
        de: 'Wegschauen!',
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
      },
    },
    {
      id: 'Eureka Voidscale Ice',
      regex: /14:29C3:Voidscale starts using Ball Of Ice on (\y{Name})/,
      regex: /14:29C3:Nichtsschuppe starts using Eisball on (\y{Name})/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: {
        en: 'Ice ball on you!',
        de: 'Eisball auf dir!',
      },
      tts: {
        en: 'ice ball',
        de: 'eisball',
      },
    },
    {
      id: 'Eureka Pazuzu Dread Wind',
      regex: /14:2899:Pazuzu starts using Dread Wind/,
      regex: /14:2899:Pazuzu starts using Furchtwind/,
      alarmText: {
        en: 'Get Out',
        de: 'Raus da',
      },
      tts: {
        en: 'get out',
        de: 'raus da',
      },
    },
    {
      id: 'Eureka Pazuzu Camisado',
      regex: /14:289F:Pazuzu starts using Camisado on (\y{Name})/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: {
        en: 'Buster on YOU',
        de: 'Tenkbasta auf DIR',
      },
      tts: {
        en: 'buster',
        de: 'basta',
      },
    },
    {
      id: 'Eureka Pazuzu Cloud of Locust',
      regex: /14:2897:Pazuzu starts using Cloud Of Locust/,
      regexDe: /14:2897:Pazuzu starts using Heuschreckeninvasion/,
      infoText: {
        en: 'Out of melee',
        de: 'Raus aus Nahkampf',
      },
      tts: {
        en: 'out of melee',
      },
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      regex: /14:2896:Pazuzu starts using Plague Of Locusts/,
      regexDe: /14:2896:Pazuzu starts using Heuschreckenplage/,
      alarmText: {
        en: 'Plague Donut',
        de: 'Plagen-Donut',
      },
      tts: {
        en: 'plague donut',
        de: 'plagen dohnat',
      },
    },
    {
      id: 'Eureka Wraith Count',
      regex: / 19:Shadow Wraith was defeated by/,
      regex: / 19:Schatten-Geist was defeated by/,
      infoText: function(data) {
        data.wraithCount = data.wraithCount || 0;
        data.wraithCount++;
        return {
          en: 'wraiths: ' + data.wraithCount,
          de: 'Geister: ' + data.wraithCount,
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
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
      },
      tts: {
        en: 'wake up',
        de: 'aufwachen',
      },
    },
  ],
}]
