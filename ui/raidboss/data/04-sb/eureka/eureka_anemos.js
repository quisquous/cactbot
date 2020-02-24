'use strict';

[{
  zoneRegex: {
    en: /Eureka Anemos/,
    cn: /常风之地/,
  },
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      regex: Regexes.startsUsing({ id: '2AD5', source: 'Void Garm', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2AD5', source: 'Nichts-Garm', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2AD5', source: 'Garm Du Néant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2AD5', source: 'ヴォイドガルム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2AD5', source: '虚无加姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2AD5', source: '보이드 가름', capture: false }),
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
      id: 'Eureka Sabotender Stack Marker',
      regex: Regexes.startsUsing({ id: '29EB', source: 'Sabotender Corrido' }),
      regexDe: Regexes.startsUsing({ id: '29EB', source: 'Sabotender Corrido' }),
      regexFr: Regexes.startsUsing({ id: '29EB', source: 'Pampa Corrido' }),
      regexJa: Regexes.startsUsing({ id: '29EB', source: '賞金首：サボテンダー・コリード' }),
      regexCn: Regexes.startsUsing({ id: '29EB', source: '悬赏魔物：科里多仙人刺' }),
      regexKo: Regexes.startsUsing({ id: '29EB', source: '현상수배: 사보텐더 코리도' }),
      alertText: function(data, matches) {
        if (matches.target != data.me)
          return;

        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
          fr: 'Stack sur VOUS',
          cn: '集合',
        };
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;

        return {
          en: '100k Needle Stack',
          de: '100k Nadeln Stack',
          fr: 'Stack 100k Aiguilles',
          cn: '十万针刺集合',
        };
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
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
      regex: Regexes.startsUsing({ id: '2A71', source: 'Polyphemus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2A71', source: 'Polyphemus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2A71', source: 'Polyphemus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2A71', source: 'ポリュペモス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2A71', source: '波吕斐摩斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2A71', source: '폴리페모스', capture: false }),
      infoText: {
        en: 'Swipe',
        de: 'Hieb',
        fr: 'Fauche',
        cn: '横扫',
      },
    },
    {
      id: 'Eureka Poly Swing',
      regex: Regexes.startsUsing({ id: '2A6E', source: 'Polyphemus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2A6E', source: 'Polyphemus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2A6E', source: 'Polyphemus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2A6E', source: 'ポリュペモス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2A6E', source: '波吕斐摩斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2A6E', source: '폴리페모스', capture: false }),
      alarmText: {
        en: 'GET OUT',
        de: 'RAUS DA',
        fr: 'ELOIGNEZ-VOUS',
        cn: '远离',
      },
    },
    {
      id: 'Eureka Poly Eye',
      regex: Regexes.startsUsing({ id: '2A73', source: 'Polyphemus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2A73', source: 'Polyphemus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2A73', source: 'Polyphemus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2A73', source: 'ポリュペモス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2A73', source: '波吕斐摩斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2A73', source: '폴리페모스', capture: false }),
      alertText: {
        en: 'Eye Donut',
        de: 'Augendonut',
        fr: 'Donut œil',
        cn: '月环',
      },
    },
    {
      id: 'Eureka Poly Glower',
      regex: Regexes.startsUsing({ id: '2A72', source: 'Polyphemus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2A72', source: 'Polyphemus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2A72', source: 'Polyphemus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2A72', source: 'ポリュペモス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2A72', source: '波吕斐摩斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2A72', source: '폴리페모스', capture: false }),
      alertText: {
        en: 'Glower Laser',
        de: 'Blick Laser',
        fr: 'Regard Laser',
        cn: '怒视',
      },
    },
    {
      id: 'Eureka Caym Eye',
      regex: Regexes.startsUsing({ id: '2A64', source: 'Caym', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2A64', source: 'Caym', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2A64', source: 'Caym', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2A64', source: 'カイム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2A64', source: '盖因', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2A64', source: '카임', capture: false }),
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
      id: 'Eureka Fafnir Terror',
      regex: Regexes.startsUsing({ id: '29B7', source: 'Fafnir', capture: false }),
      regexDe: Regexes.startsUsing({ id: '29B7', source: 'Fafnir', capture: false }),
      regexFr: Regexes.startsUsing({ id: '29B7', source: 'Fafnir', capture: false }),
      regexJa: Regexes.startsUsing({ id: '29B7', source: 'ファヴニル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '29B7', source: '法夫纳', capture: false }),
      regexKo: Regexes.startsUsing({ id: '29B7', source: '파프니르', capture: false }),
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
      regex: Regexes.startsUsing({ id: '29C3', source: 'Voidscale' }),
      regexDe: Regexes.startsUsing({ id: '29C3', source: 'Nichtsschuppe' }),
      regexFr: Regexes.startsUsing({ id: '29C3', source: 'Vidécailles' }),
      regexJa: Regexes.startsUsing({ id: '29C3', source: 'ヴォイドスケイル' }),
      regexCn: Regexes.startsUsing({ id: '29C3', source: '虚无鳞龙' }),
      regexKo: Regexes.startsUsing({ id: '29C3', source: '보이드비늘' }),
      condition: function(data, matches) {
        return matches.target == data.me;
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
      regex: Regexes.startsUsing({ id: '2899', source: 'Pazuzu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2899', source: 'Pazuzu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2899', source: 'Pazuzu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2899', source: 'パズズ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2899', source: '帕祖祖', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2899', source: '파주주', capture: false }),
      alarmText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Eloignez-vous',
        cn: '远离',
      },
    },
    {
      id: 'Eureka Pazuzu Camisado',
      regex: Regexes.startsUsing({ id: '289F', source: 'Pazuzu' }),
      regexDe: Regexes.startsUsing({ id: '289F', source: 'Pazuzu' }),
      regexFr: Regexes.startsUsing({ id: '289F', source: 'Pazuzu' }),
      regexJa: Regexes.startsUsing({ id: '289F', source: 'パズズ' }),
      regexCn: Regexes.startsUsing({ id: '289F', source: '帕祖祖' }),
      regexKo: Regexes.startsUsing({ id: '289F', source: '파주주' }),
      condition: function(data, matches) {
        return matches.target == data.me;
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
      regex: Regexes.startsUsing({ id: '2897', source: 'Pazuzu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2897', source: 'Pazuzu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2897', source: 'Pazuzu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2897', source: 'パズズ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2897', source: '帕祖祖', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2897', source: '파주주', capture: false }),
      infoText: {
        en: 'Out of melee',
        de: 'Raus aus Nahkampf',
        fr: 'Eloignez-vous de la mélée',
        cn: '远离近战',
      },
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      regex: Regexes.startsUsing({ id: '2896', source: 'Pazuzu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2896', source: 'Pazuzu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2896', source: 'Pazuzu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2896', source: 'パズズ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2896', source: '帕祖祖', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2896', source: '파주주', capture: false }),
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
      regex: Regexes.wasDefeated({ target: 'Shadow Wraith', capture: false }),
      regexDe: Regexes.wasDefeated({ target: 'Schatten-Geist', capture: false }),
      regexFr: Regexes.wasDefeated({ target: 'Spectre Des Ombres', capture: false }),
      regexJa: Regexes.wasDefeated({ target: 'シャドウ・レイス', capture: false }),
      regexCn: Regexes.wasDefeated({ target: '暗影幽灵', capture: false }),
      regexKo: Regexes.wasDefeated({ target: '그림자 망령', capture: false }),
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
      regex: Regexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'パズズ', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '帕祖祖', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '파주주', capture: false }),
      run: function(data) {
        data.wraithCount = 0;
      },
    },
    {
      id: 'Eureka Falling Asleep',
      regex: Regexes.gameLog({ line: '5 minutes have elapsed since your last activity.', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen.', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes', capture: false }),
      regexCn: Regexes.gameLog({ line: '已经5分钟没有进行任何操作', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
        cn: '醒醒！动一动！！',
      },
    },
  ],
}];
