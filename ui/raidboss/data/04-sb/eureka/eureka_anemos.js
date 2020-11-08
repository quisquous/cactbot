'use strict';

[{
  zoneId: ZoneId.TheForbiddenLandEurekaAnemos,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      netRegex: NetRegexes.startsUsing({ id: '2AD5', source: 'Void Garm', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2AD5', source: 'Nichts-Garm', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2AD5', source: 'Garm Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2AD5', source: 'ヴォイドガルム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2AD5', source: '虚无加姆', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2AD5', source: '보이드 가름', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dragon\'s Voice',
          de: 'Stimme Des Drachen',
          fr: 'Voix du dragon',
          ja: '雷電の咆哮',
          cn: '雷电咆哮',
          ko: '뇌전의 포효',
        },
      },
    },
    {
      id: 'Eureka Sabotender Stack Marker',
      netRegex: NetRegexes.startsUsing({ id: '29EB', source: 'Sabotender Corrido' }),
      netRegexDe: NetRegexes.startsUsing({ id: '29EB', source: 'Sabotender Corrido' }),
      netRegexFr: NetRegexes.startsUsing({ id: '29EB', source: 'Pampa Corrido' }),
      netRegexJa: NetRegexes.startsUsing({ id: '29EB', source: '賞金首：サボテンダー・コリード' }),
      netRegexCn: NetRegexes.startsUsing({ id: '29EB', source: '悬赏魔物：科里多仙人刺' }),
      netRegexKo: NetRegexes.startsUsing({ id: '29EB', source: '현상수배: 사보텐더 코리도' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Eureka Poly Swipe',
      netRegex: NetRegexes.startsUsing({ id: '2A71', source: 'Polyphemus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2A71', source: 'Polyphemus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2A71', source: 'Polyphemus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2A71', source: 'ポリュペモス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2A71', source: '波吕斐摩斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2A71', source: '폴리페모스', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Swipe',
          de: 'Hieb',
          fr: 'Fauche',
          ja: 'スワイプ',
          cn: '横扫',
          ko: '휘두르기',
        },
      },
    },
    {
      id: 'Eureka Poly Swing',
      netRegex: NetRegexes.startsUsing({ id: '2A6E', source: 'Polyphemus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2A6E', source: 'Polyphemus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2A6E', source: 'Polyphemus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2A6E', source: 'ポリュペモス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2A6E', source: '波吕斐摩斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2A6E', source: '폴리페모스', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Eureka Poly Eye',
      netRegex: NetRegexes.startsUsing({ id: '2A73', source: 'Polyphemus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2A73', source: 'Polyphemus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2A73', source: 'Polyphemus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2A73', source: 'ポリュペモス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2A73', source: '波吕斐摩斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2A73', source: '폴리페모스', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Eye Donut',
          de: 'Augendonut',
          fr: 'Donut œil',
          ja: 'アイ・オブ・ビホルダー',
          cn: '月环',
          ko: '눈알 도넛 장판',
        },
      },
    },
    {
      id: 'Eureka Poly Glower',
      netRegex: NetRegexes.startsUsing({ id: '2A72', source: 'Polyphemus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2A72', source: 'Polyphemus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2A72', source: 'Polyphemus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2A72', source: 'ポリュペモス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2A72', source: '波吕斐摩斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2A72', source: '폴리페모스', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Glower Laser',
          de: 'Blick Laser',
          fr: 'Regard laser',
          ja: 'グラワー',
          cn: '怒视',
          ko: '광선',
        },
      },
    },
    {
      id: 'Eureka Caym Eye',
      netRegex: NetRegexes.startsUsing({ id: '2A64', source: 'Caym', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2A64', source: 'Caym', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2A64', source: 'Caym', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2A64', source: 'カイム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2A64', source: '盖因', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2A64', source: '카임', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Eureka Fafnir Terror',
      netRegex: NetRegexes.startsUsing({ id: '29B7', source: 'Fafnir', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '29B7', source: 'Fafnir', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '29B7', source: 'Fafnir', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '29B7', source: 'ファヴニル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '29B7', source: '法夫纳', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '29B7', source: '파프니르', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Eureka Voidscale Ice',
      netRegex: NetRegexes.startsUsing({ id: '29C3', source: 'Voidscale' }),
      netRegexDe: NetRegexes.startsUsing({ id: '29C3', source: 'Nichtsschuppe' }),
      netRegexFr: NetRegexes.startsUsing({ id: '29C3', source: 'Vidécailles' }),
      netRegexJa: NetRegexes.startsUsing({ id: '29C3', source: 'ヴォイドスケイル' }),
      netRegexCn: NetRegexes.startsUsing({ id: '29C3', source: '虚无鳞龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '29C3', source: '보이드비늘' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Ice ball on you!',
          de: 'Eisball auf dir!',
          fr: 'Boule de glace sur vous !',
          ja: '自分に氷玉',
          cn: '点名冰球！',
          ko: '얼음 구슬 대상자',
        },
      },
    },
    {
      id: 'Eureka Pazuzu Dread Wind',
      netRegex: NetRegexes.startsUsing({ id: '2899', source: 'Pazuzu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2899', source: 'Pazuzu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2899', source: 'Pazuzu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2899', source: 'パズズ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2899', source: '帕祖祖', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2899', source: '파주주', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Eureka Pazuzu Camisado',
      netRegex: NetRegexes.startsUsing({ id: '289F', source: 'Pazuzu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '289F', source: 'Pazuzu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '289F', source: 'Pazuzu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '289F', source: 'パズズ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '289F', source: '帕祖祖' }),
      netRegexKo: NetRegexes.startsUsing({ id: '289F', source: '파주주' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Eureka Pazuzu Cloud of Locust',
      netRegex: NetRegexes.startsUsing({ id: '2897', source: 'Pazuzu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2897', source: 'Pazuzu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2897', source: 'Pazuzu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2897', source: 'パズズ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2897', source: '帕祖祖', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2897', source: '파주주', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      netRegex: NetRegexes.startsUsing({ id: '2896', source: 'Pazuzu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2896', source: 'Pazuzu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2896', source: 'Pazuzu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2896', source: 'パズズ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2896', source: '帕祖祖', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2896', source: '파주주', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Plague Donut',
          de: 'Plagen-Donut',
          fr: 'Donut Nuée',
          ja: 'ローカストプレイグ',
          cn: '月环',
          ko: '역병 도넛 장판',
        },
      },
    },
    {
      id: 'Eureka Wraith Count',
      netRegex: NetRegexes.wasDefeated({ target: 'Shadow Wraith', capture: false }),
      netRegexDe: NetRegexes.wasDefeated({ target: 'Schatten-Geist', capture: false }),
      netRegexFr: NetRegexes.wasDefeated({ target: 'Spectre Des Ombres', capture: false }),
      netRegexJa: NetRegexes.wasDefeated({ target: 'シャドウ・レイス', capture: false }),
      netRegexCn: NetRegexes.wasDefeated({ target: '暗影幽灵', capture: false }),
      netRegexKo: NetRegexes.wasDefeated({ target: '그림자 망령', capture: false }),
      soundVolume: 0,
      infoText: function(data, _, output) {
        data.wraithCount = data.wraithCount || 0;
        data.wraithCount++;
        return output.text({ num: data.wraithCount });
      },
      outputStrings: {
        text: {
          en: 'wraiths: ${num}',
          de: 'Geister: ${num}',
          fr: 'spectres: ${num}',
          ja: 'レイス: ${num}',
          cn: '幽灵击杀: ${num}',
          ko: '망령: ${num}',
        },
      },
    },
    {
      id: 'Eureka Pazuzu Pop',
      netRegex: NetRegexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'パズズ', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '帕祖祖', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '파주주', capture: false }),
      run: function(data) {
        data.wraithCount = 0;
      },
    },
    {
      id: 'Eureka Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 7 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 7 minutes.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '操作がない状態になってから7分が経過しました。.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经7分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '7분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      response: Responses.wakeUp(),
    },
  ],
}];
