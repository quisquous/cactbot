'use strict';

[{
  zoneRegex: /(Eureka Anemos|常风之地)/,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      regex: /14:2AD5:Void Garm starts using The Dragon's Voice/,
      regexCn: /14:2AD5:虚无加姆 starts using 雷电咆哮/,
      regexDe: /14:2AD5:Nichts-Garm starts using Stimme Des Drachen/,
      regexFr: /14:2AD5:Garm Du Néant starts using Voix Du Dragon/,
      infoText: {
        en: 'Dragon\'s Voice',
        de: 'Stimme Des Drachen',
        fr: 'Voix Du Dragon',
        cn: '雷电咆哮',
      },
      tts: {
        en: 'Dragon\'s Voice',
        de: 'drache',
        fr: 'Voix Du Dragon',
        cn: '雷电咆哮',
      },
    },
    {
      id: 'Euereka Sabotender Stack Marker',
      regex: /14:29EB:Sabotender Corrido starts using 100,000 Needles on (\y{Name})/,
      regexCn: /14:29EB:科里多仙人刺 starts using 十万针刺 on (\y{Name})/,
      regexDe: /14:29EB:Sabotender Corrido starts using 100\.000 Nadeln on (\y{Name})/,
      regexFr: /14:29EB:Pampa Corrido starts using 100 000 Aiguilles on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;

        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
          fr: 'Stack sur VOUS',
          cn: '集合',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;

        return {
          en: '100k Needle Stack',
          de: '100k Nadeln Stack',
          fr: 'Stack 100k Aiguilles',
          cn: '十万针刺集合',
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'stack on you',
            de: 'stek auf dir',
            fr: 'Stack sur vous',
            cn: '集合',
          };
        }
        return {
          en: 'needle stack',
          de: 'nadel stek',
          fr: 'stack aiguille',
          cn: '集合',
        };
      },
    },
    {
      id: 'Eureka Poly Swipe',
      regex: /14:2A71:Polyphemus starts using 100-Tonze Swipe/,
      regexCn: /14:2A71:波吕斐摩斯 starts using 百吨横扫/,
      regexDe: /14:2A71:Polyphemus starts using 100-Tonzen-Hieb/,
      regexFr: /14:2A71:Polyphemus starts using Fauche De 100 Tonz/,
      infoText: {
        en: 'Swipe',
        de: 'Hieb',
        fr: 'Fauche',
        cn: '横扫',
      },
    },
    {
      id: 'Eureka Poly Swing',
      regex: /14:2A6E:Polyphemus starts using 10,000-Tonze Swing/,
      regexCn: /14:2A6E:波吕斐摩斯 starts using 万吨回转/,
      regexDe: /14:2A6E:Polyphemus starts using 10\.000-Tonzen-Schwung/,
      regexFr: /14:2A6E:Polyphemus starts using Swing De 10 000 Tonz/,
      alarmText: {
        en: 'GET OUT',
        de: 'RAUS DA',
        fr: 'ELOIGNEZ-VOUS',
        cn: '远离',
      },
    },
    {
      id: 'Eureka Poly Eye',
      regex: /14:2A73:Polyphemus starts using Eye Of The Beholder/,
      regexCn: /14:2A73:波吕斐摩斯 starts using 深瞳凝视/,
      regexDe: /14:2A73:Polyphemus starts using Auge Des Betrachters/,
      regexFr: /14:2A73:Polyphemus starts using L'œil Du Spectateur on Polyphemus/,
      alertText: {
        en: 'Eye Donut',
        de: 'Augendonut',
        fr: 'Donut œil',
        cn: '月环',
      },
    },
    {
      id: 'Eureka Poly Glower',
      regex: /14:2A72:Polyphemus starts using Glower/,
      regexCn: /14:2A72:波吕斐摩斯 starts using 怒视/,
      regexDe: /14:2A72:Polyphemus starts using Finsterer Blick/,
      regexFr: /14:2A72:Polyphemus starts using Regard Noir/,
      alertText: {
        en: 'Glower Laser',
        de: 'Blick Laser',
        fr: 'Regard Laser',
        cn: '怒视',
      },
    },
    {
      id: 'Eureka Caym Eye',
      regex: /14:2A64:Caym starts using Double Hex Eye/,
      regexCn: /14:2A64:盖因 starts using 大凶眼/,
      regexDe: /14:2A64:Caym starts using Doppeltes Hex-Auge/,
      regexFr: /14:2A64:Caym starts using Double Œil Néfaste/,
      alarmText: {
        en: 'Look Away!',
        de: 'Wegschauen!',
        fr: 'Ne regardez pas',
        cn: '背对！',
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
        fr: 'Ne regardez pas',
        cn: '背对！',
      },
    },
    {
      id: 'Fafnir Terror',
      regex: /14:29B7:Fafnir starts using Absolute Terror/,
      regexCn: /14:29B7:法夫纳 starts using 绝对恐惧/,
      regexDe: /14:29B7:Fafnir starts using Absoluter Terror/,
      regexFr: /14:29B7:Fafnir starts using Terreur Absolue/,
      alarmText: {
        en: 'Look Away!',
        de: 'Wegschauen!',
        fr: 'Ne regardez pas',
        cn: '背对！',
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
        fr: 'Ne regardez pas',
        cn: '背对！',
      },
    },
    {
      id: 'Eureka Voidscale Ice',
      regex: /14:29C3:Voidscale starts using Ball Of Ice on (\y{Name})/,
      regexCn: /14:29C3:虚无鳞龙 starts using (冰球|冻结) on (\y{Name})/,
      regexDe: /14:29C3:Nichtsschuppe starts using Eisball on (\y{Name})/,
      regexFr: /14:29C3:Vidécailles starts using Boule De Glace on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Ice ball on you!',
        de: 'Eisball auf dir!',
        fr: 'Boule de glace sur vous!',
        cn: '点名冰球！',
      },
      tts: {
        en: 'ice ball',
        de: 'eisball',
        fr: 'boule de glace',
        cn: '冰球',
      },
    },
    {
      id: 'Eureka Pazuzu Dread Wind',
      regex: /14:2899:Pazuzu starts using Dread Wind/,
      regexCn: /14:2899:帕祖祖 starts using 恐慌之风/,
      regexDe: /14:2899:Pazuzu starts using Furchtwind/,
      regexFr: /14:2899:Pazuzu starts using Vent D'effroi/,
      alarmText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Eloignez-vous',
        cn: '远离',
      },
    },
    {
      id: 'Eureka Pazuzu Camisado',
      regex: /14:289F:Pazuzu starts using Camisado on (\y{Name})/,
      regexCn: /14:289F:帕祖祖 starts using 夜袭 on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Buster on YOU',
        de: 'Tenkbasta auf DIR',
        fr: 'Tank Buster sur VOUS',
        cn: '死刑减伤',
      },
      tts: {
        en: 'buster',
        de: 'basta',
        fr: 'tankbuster',
        cn: '死刑减伤',
      },
    },
    {
      id: 'Eureka Pazuzu Cloud of Locust',
      regex: /14:2897:Pazuzu starts using Cloud Of Locust/,
      regexCn: /14:2897:帕祖祖 starts using 飞蝗入侵/,
      regexDe: /14:2897:Pazuzu starts using Heuschreckeninvasion/,
      regexFr: /14:2897:Pazuzu starts using Invasion De Sauterelles/,
      infoText: {
        en: 'Out of melee',
        de: 'Raus aus Nahkampf',
        fr: 'Eloignez-vous de la mélée',
        cn: '远离近战',
      },
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      regex: /14:2896:Pazuzu starts using Plague Of Locusts/,
      regexCn: /14:2896:帕祖祖 starts using 飞蝗疫病/,
      regexDe: /14:2896:Pazuzu starts using Heuschreckenplage/,
      regexFr: /14:2896:Pazuzu starts using Nuée De Sauterelles/,
      alarmText: {
        en: 'Plague Donut',
        de: 'Plagen-Donut',
        fr: 'Donut Nuée',
        cn: '月环',
      },
      tts: {
        en: 'plague donut',
        de: 'plagen dohnat',
        fr: 'Donut Nuée',
        cn: '月环',
      },
    },
    {
      id: 'Eureka Wraith Count',
      regex: / 19:Shadow Wraith was defeated by/,
      regexCn: / 19:暗影幽灵 was defeated by/,
      regexDe: / 19:Schatten-Geist was defeated by/,
      regexFr: /(?:Spectre Des Ombres a été vaincu|Vous avez vaincu le spectre des ombres)/,
      infoText: function(data) {
        data.wraithCount = data.wraithCount || 0;
        data.wraithCount++;
        return {
          en: 'wraiths: ' + data.wraithCount,
          de: 'Geister: ' + data.wraithCount,
          fr: 'spectres: ' + data.wraithCount,
          cn: '幽灵击杀: ' + data.wraithCount,
        };
      },
      soundVolume: 0,
    },
    {
      id: 'Eureka Pazuzu Pop',
      regex: /03:\y{ObjectId}:Added new combatant Pazuzu\./,
      regexCn: /03:\y{ObjectId}:Added new combatant 帕祖祖/,
      run: function(data) {
        data.wraithCount = 0;
      },
    },
    {
      id: 'Eureka Falling Asleep',
      regex: /00:0039:5 minutes have elapsed since your last activity./,
      regexCn: /00:0039:已经5分钟没有进行任何操作/,
      regexDe: /00:0039:Seit deiner letzten Aktivität sind 5 Minuten vergangen./,
      regexFr: /00:0039:Votre personnage est inactif depuis 5 minutes/,
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
        cn: '醒醒！动一动！！',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'Void Garm': '虚无加姆',
        'Sabotender Corrido': '科里多仙人刺',
        'Polyphemus': '波吕斐摩斯',
        'Caym': '盖因',
        'Fafnir': '法夫纳',
        'Voidscale': '虚无鳞龙',
        'Pazuzu': '帕祖祖',
        'Shadow Wraith': '暗影幽灵',
      },
      'replaceText': {
        'Plague Of Locusts': '飞蝗疫病',
        'The Dragon\'s Voice': '雷电咆哮',
        '100,000 Needles': '十万针刺',
        '100-Tonze Swipe': '百吨横扫',
        '10,000-Tonze Swing': '万吨回转',
        'Eye Of The Beholder': '深瞳凝视',
        'Glower': '怒视',
        'Double Hex Eye': '大凶眼',
        'Absolute Terror': '绝对恐惧',
        'Ball Of Ice': '冻结',
        'Dread Wind': '恐慌之风',
        'Cloud Of Locust': '飞蝗入侵',
        'Cloud Of Locusts': '飞蝗入侵',
      },
      '~effectNames': {
      },
    },
  ],
}];
