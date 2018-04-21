[{
  zoneRegex: /Eureka Anemos/,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      regex: /14:2AD5:Void Garm starts using The Dragon's Voice/,
      infoText: {
        en: "Dragon's Voice",
      },
      tts: {
        en: "Dragon's Voice",
      },
    },
    {
      id: 'Euereka Sabotender Stack Marker',
      regex: /14:29EB:Sabotender Corrido starts using 100,000 Needles on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;
        return {
          en: 'Stack on YOU',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: '100k Needle Stack',
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'stack on you',
          };
        }
        return {
          en: 'needle stack',
        };
      },
    },
    {
      id: 'Eureka Poly Swipe',
      regex: /14:2A71:Polyphemus starts using 100-Tonze Swipe/,
      infoText: {
        en: 'Swipe',
      },
      tts: {
        en: 'swipe',
      },
    },
    {
      id: 'Eureka Poly Swing',
      regex: /14:2A6E:Polyphemus starts using 10,000-Tonze Swing/,
      alarmText: {
        en: 'GET OUT',
      },
      tts: {
        en: 'get out',
      },
    },
    {
      id: 'Eureka Poly Eye',
      regex: /14:2A73:Polyphemus starts using Eye Of The Beholder/,
      alertText: {
        en: 'Eye Donut',
      },
      tts: {
        en: 'eye donut',
      },
    },
    {
      id: 'Eureka Poly Glower',
      regex: /14:2A72:Polyphemus starts using Glower/,
      alertText: {
        en: 'Glower Laser',
      },
      tts: {
        en: 'Glower',
      },
    },
    {
      id: 'Eureka Caym Eye',
      regex: /14:2A64:Caym starts using Double Hex Eye/,
      alarmText: {
        en: 'Look Away!',
      },
      tts: {
        en: 'look away',
      },
    },
    {
      id: 'Fafnir Terror',
      regex: /14:29B7:Fafnir starts using Absolute Terror/,
      alarmText: {
        en: 'Look Away!',
      },
      tts: {
        en: 'look away',
      },
    },
    {
      id: 'Eureka Voidscale Ice',
      regex: /14:29C3:Voidscale starts using Ball Of Ice on (\y{Name})/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: {
        en: 'Ice ball on you!',
      },
      tts: {
        en: 'ice ball',
      },
    },
    {
      id: 'Eureka Pazuzu Dread Wind',
      regex: /14:2899:Pazuzu starts using Dread Wind/,
      alarmText: {
        en: 'Get Out',
      },
      tts: {
        en: 'get out',
      },
    },
    {
      id: 'Eureka Pazuzu Camisado',
      regex: /14:289F:Pazuzu starts using Camisado on (\y{Name})/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: {
        en: 'Buster on YOU',
      },
      tts: {
        en: 'buster',
      },
    },
    {
      id: 'Eureka Pazuzu Cloud of Locust',
      regex: /14:2897:Pazuzu starts using Cloud Of Locust/,
      infoText: {
        en: 'Out of melee',
      },
      tts: {
        en: 'out of melee',
      },
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      regex: /14:2896:Pazuzu starts using Plague Of Locusts/,
      alarmText: {
        en: 'Plague Donut',
      },
      tts: {
        en: 'plague donut',
      },
    },
    {
      id: 'Eureka Wraith Count',
      regex: / 19:Shadow Wraith was defeated by/,
      infoText: function(data) {
        data.wraithCount = data.wraithCount || 0;
        data.wraithCount++;
        return 'wraiths: ' + data.wraithCount;
      },
      soundVolume: 0,
    },
    {
      id: 'Eureka Sabo Pop',
      regex: /03:Added new combatant (Sabotender Corrido)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka The Lord Of Anemos Pop',
      regex: /03:Added new combatant (The Lord Of Anemos)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Teles Pop',
      regex: /03:Added new combatant (Teles)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka The Emperor Of Anemos Pop',
      regex: /03:Added new combatant (The Emperor Of Anemos)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Callisto Pop',
      regex: /03:Added new combatant (Callisto)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Number Pop',
      regex: /03:Added new combatant (Number)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Jahannam Pop',
      regex: /03:Added new combatant (Jahannam)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Amemet Pop',
      regex: /03:Added new combatant (Amemet)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Caym Pop',
      regex: /03:Added new combatant (Caym)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Bombadeel Pop',
      regex: /03:Added new combatant (Bombadeel)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Serket Pop',
      regex: /03:Added new combatant (Serket)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Judgmental Julika Pop',
      regex: /03:Added new combatant (Judgmental Julika)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka The White Rider Pop',
      regex: /03:Added new combatant (The White Rider)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Polyphemus Pop',
      regex: /03:Added new combatant (Polyphemus)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Strider Pop',
      regex: /03:Added new combatant (Simurgh's Strider)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka King Hazmat Pop',
      regex: /03:Added new combatant (King Hazmat)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Fafnir Pop',
      regex: /03:Added new combatant (Fafnir)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Amarok Pop',
      regex: /03:Added new combatant (Amarok)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Lamashtu Pop',
      regex: /03:Added new combatant (Lamashtu)\./,
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Pazuzu Pop',
      regex: /03:Added new combatant (Pazuzu)\./,
      preRun: function(data) {
        data.wraithCount = 0;
      },
      suppressSeconds: 1700,
      alertText: function(data, matches) {
        return matches[1];
      },
      sound: 'Pull',
      tts: function(data, matches) {
        return matches[1];
      },
    },
    {
      id: 'Eureka Falling Asleep',
      regex: /00:0039:5 minutes have elapsed since your last activity./,
      alarmText: {
        en: 'WAKE UP',
      },
      tts: {
        en: 'wake up',
      },
    },
  ],
}]