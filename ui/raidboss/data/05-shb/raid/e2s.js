import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO
// better callouts for cycle
// tank provoke messages when cotank has flare

export default {
  zoneId: ZoneId.EdensGateDescentSavage,
  timelineFile: 'e2s.txt',
  timelineTriggers: [
    {
      id: 'E2S Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Puddles',
          de: 'Flächen nehmen',
          fr: 'Allez dans les zones au sol',
          ja: '踏む',
          cn: '踩圈',
          ko: '바닥 징 밟기',
        },
      },
    },
    {
      id: 'E2S Buddy Circles',
      regex: /Light\/Dark Circles/,
      beforeSeconds: 5,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack With Partner',
          de: 'Mit Partner stacken',
          fr: 'Packez-vous avec votre partenaire',
          ja: '白黒合わせて',
          cn: '黑白配',
          ko: '흑백 파트너랑 모이기',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'E2S Spell In Waiting Gain',
      netRegex: NetRegexes.gainsEffect({ target: 'Voidwalker', effectId: '710', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Nichtswandler', effectId: '710', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'marcheuse du néant', effectId: '710', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ヴォイドウォーカー', effectId: '710', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '虚无行者', effectId: '710', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '보이드워커', effectId: '710', capture: false }),
      run: (data) => {
        data.waiting = true;
      },
    },
    {
      id: 'E2S Spell In Waiting Lose',
      netRegex: NetRegexes.losesEffect({ target: 'Voidwalker', effectId: '710', capture: false }),
      netRegexDe: NetRegexes.losesEffect({ target: 'Nichtswandler', effectId: '710', capture: false }),
      netRegexFr: NetRegexes.losesEffect({ target: 'marcheuse du néant', effectId: '710', capture: false }),
      netRegexJa: NetRegexes.losesEffect({ target: 'ヴォイドウォーカー', effectId: '710', capture: false }),
      netRegexCn: NetRegexes.losesEffect({ target: '虚无行者', effectId: '710', capture: false }),
      netRegexKo: NetRegexes.losesEffect({ target: '보이드워커', effectId: '710', capture: false }),
      run: (data) => {
        data.waiting = false;
      },
    },
    {
      id: 'E2S Entropy',
      netRegex: NetRegexes.startsUsing({ id: '3E6F', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E6F', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E6F', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E6F', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E6F', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E6F', source: '보이드워커', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E2S Quietus',
      netRegex: NetRegexes.startsUsing({ id: '3E71', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E71', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E71', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E71', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E71', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E71', source: '보이드워커', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E2S Shadowflame Tank',
      netRegex: NetRegexes.startsUsing({ id: '3E6[12]', source: 'Voidwalker' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E6[12]', source: 'Nichtswandler' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E6[12]', source: 'Marcheuse Du Néant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E6[12]', source: 'ヴォイドウォーカー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E6[12]', source: '虚无行者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E6[12]', source: '보이드워커' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E2S Shadowflame Healer',
      netRegex: NetRegexes.startsUsing({ id: '3E61', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E61', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E61', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E61', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E61', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E61', source: '보이드워커', capture: false }),
      condition: (data) => data.role === 'healer',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'E2S Doomvoid Cleaver',
      netRegex: NetRegexes.startsUsing({ id: '3E63', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E63', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E63', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E63', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E63', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E63', source: '보이드워커', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Position',
          ja: '散開',
          cn: '分散站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
    {
      id: 'E2S Doomvoid Guillotine',
      netRegex: NetRegexes.startsUsing({ id: '3E4F', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E4F', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E4F', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E4F', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E4F', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E4F', source: '보이드워커', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'E2S Doomvoid Slicer',
      netRegex: NetRegexes.startsUsing({ id: '3E50', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E50', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E50', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E50', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E50', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E50', source: '보이드워커', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E2S Empty Hate',
      netRegex: NetRegexes.startsUsing({ id: '3E59', source: 'The Hand Of Erebos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E59', source: 'Arm Des Erebos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E59', source: 'Bras D\'Érèbe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E59', source: 'エレボスの巨腕', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E59', source: '厄瑞玻斯的巨腕', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E59', source: '에레보스의 팔', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E2S Empty Rage',
      netRegex: NetRegexes.startsUsing({ id: '3E6B', source: 'The Hand Of Erebos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3E6B', source: 'Arm Des Erebos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3E6B', source: 'Bras D\'Érèbe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3E6B', source: 'エレボスの巨腕', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3E6B', source: '厄瑞玻斯的巨腕', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3E6B', source: '에레보스의 팔', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Hand',
          de: 'Weg von der Hand',
          fr: 'Éloignez-vous de la main',
          ja: '手から離れ',
          cn: '远离手',
          ko: '팔에서 멀어지기',
        },
      },
    },
    {
      id: 'E2S Unholy Darkness No Waiting',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => !data.waiting,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E2S Unholy Darkness Collect',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => data.waiting,
      run: (data, matches) => {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'stack';
      },
    },
    {
      id: 'E2S Unholy Darkness Waiting',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data, matches) => data.waiting && data.me === matches.target,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Delayed Stack',
          de: 'Verzögertes stacken',
          fr: 'Package retardé',
          ja: 'スタック(ディレイ)',
          cn: '延迟集合',
          ko: '지연술 쉐어징',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Unholy Darkness',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => !data.hellWind && data.spell[matches.target] === 'stack',
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E2S Dark Fire No Waiting',
      netRegex: NetRegexes.headMarker({ id: '004C' }),
      condition: (data, matches) => !data.waiting && data.me === matches.target,
      response: Responses.spread('alert'),
    },
    {
      id: 'E2S Dark Fire Collect',
      netRegex: NetRegexes.headMarker({ id: '004C' }),
      condition: (data) => data.waiting,
      run: (data, matches) => {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'fire';
      },
    },
    {
      id: 'E2S Dark Fire Waiting',
      netRegex: NetRegexes.headMarker({ id: '004C' }),
      condition: (data, matches) => data.waiting && data.me === matches.target,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Delayed Fire',
          de: 'Verzögertes Feuer',
          fr: 'Feu retardé',
          ja: 'マーカーついた(ディレイ)',
          cn: '延迟火',
          ko: '지연술 파이가',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Fire',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => data.me === matches.target && data.spell[data.me] === 'fire',
      response: Responses.spread('alert'),
    },
    {
      id: 'E2S Shadoweye No Waiting',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      condition: (data) => !data.waiting,
      response: Responses.lookAwayFromTarget(),
    },
    {
      id: 'E2S Shadoweye No Waiting You',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      condition: (data) => !data.waiting,
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Eye on YOU',
          de: 'Auge auf DIR',
          fr: 'Œil de l\'ombre sur VOUS',
          ja: '自分に目',
          cn: '石化眼点名',
          ko: '시선징 대상자',
        },
      },
    },
    {
      id: 'E2S Shadoweye Collect',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      condition: (data) => data.waiting,
      run: (data, matches) => {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'eye';
      },
    },
    {
      id: 'E2S Shadoweye Waiting',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      condition: (data, matches) => data.waiting && data.me === matches.target,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Delayed Shadoweye',
          de: 'Verzögertes Schattenauge',
          fr: 'Œil de l\'ombre retardé',
          ja: 'シャドウアイ(ディレイ)',
          cn: '延迟石化眼',
          ko: '지연술 시선징',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye Me',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => data.spell[matches.target] === 'eye' && matches.target === data.me,
      delaySeconds: 2,
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Eye on YOU',
          de: 'Auge auf DIR',
          fr: 'Œil sur VOUS',
          ja: '自分に目',
          cn: '石化眼点名',
          ko: '시선징 대상자',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye Other',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => data.spell[matches.target] === 'eye' && data.spell[data.me] !== 'eye',
      delaySeconds: 2,
      suppressSeconds: 10,
      // Let's just assume these people are stacked.
      // We could call out both names, but it's probably unnecessary.
      response: Responses.lookAwayFromTarget(),
    },
    {
      id: 'E2S Flare No Waiting',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => !data.waiting && data.me === matches.target,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare',
          de: 'Flare',
          fr: 'Brasier',
          ja: 'フレア捨てて',
          cn: '核爆',
          ko: '플레어',
        },
      },
    },
    {
      id: 'E2S Flare Collect',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data) => data.waiting,
      run: (data, matches) => {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'flare';
      },
    },
    {
      id: 'E2S Flare Waiting',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => data.waiting && data.me === matches.target,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Delayed Flare',
          de: 'Verzögerte Flare',
          fr: 'Brasier retardé',
          ja: 'フレア(ディレイ)',
          cn: '延迟核爆',
          ko: '지연술 플레어',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Flare',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => data.me === matches.target && data.spell[data.me] === 'flare',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare',
          de: 'Flare',
          fr: 'Brasier',
          ja: 'フレア捨てて',
          cn: '核爆',
          ko: '플레어',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Flare Healer',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => {
        if (data.role !== 'healer')
          return;
        return data.spell[matches.target] === 'flare' && data.spell[data.me] !== 'flare';
      },
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare aoes',
          de: 'Flare aoes',
          fr: 'Brasiers AoE',
          ja: 'フレア AoE',
          cn: '核爆AOE',
          ko: '플레어 터짐',
        },
      },
    },
    {
      id: 'E2S Hell Wind No Waiting',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: (data, matches) => !data.waiting && data.me === matches.target,
      // The "no waiting" version comes paired with a stack.
      alarmText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.hellWind = true;
      },
      outputStrings: {
        text: {
          en: 'Hell Wind: Get Out',
          de: 'Höllenwind: Raus gehen',
          fr: 'Vent infernal : À l\'extérieur',
          ja: 'ヘルウィンド: HP1になるよ',
          cn: '地狱之风：远离',
          ko: '홍옥징 대상자',
        },
      },
    },
    {
      id: 'E2S Hell Wind Cleanup',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: (data, matches) => !data.waiting && data.me === matches.target,
      delaySeconds: 15,
      run: (data) => {
        delete data.hellWind;
      },
    },
    {
      id: 'E2S Hell Wind Collect',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: (data) => data.waiting,
      run: (data, matches) => {
        data.spell = data.spell || {};
        data.spell[matches.target] = 'wind';
      },
    },
    {
      id: 'E2S Hell Wind Waiting',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: (data, matches) => data.waiting && data.me === matches.target,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Delayed Hell Wind',
          de: 'Verzögerte Höllenwind',
          fr: 'Vent infernal retardé',
          ja: 'ヘルウィンド(ディレイ)',
          cn: '延迟地狱之风',
          ko: '지연술 홍옥징',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => {
        if (data.role === 'healer')
          return false;
        return data.me === matches.target && data.spell[data.me] === 'wind';
      },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hell Wind: wait for heals',
          de: 'Höllenwind: Warte auf Heilung',
          fr: 'Vent infernal : attendez pour soigner',
          ja: 'ヘルウィンド: HP戻ってから',
          cn: '地狱之风：等奶',
          ko: '힐 받고 들어가기',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind Healer',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      condition: (data, matches) => {
        if (data.role !== 'healer')
          return;
        return data.spell[matches.target] === 'wind';
      },
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Heal Hell Wind Targets',
          de: 'Heile Höllenwind Ziele',
          fr: 'Soignez les cibles de Vent infernal',
          ja: 'HP戻して',
          cn: '奶地狱之风目标',
          ko: '홍옥징 대상자 힐',
        },
      },
    },
    {
      id: 'E2S Countdown Marker Cleanup',
      netRegex: NetRegexes.headMarker({ id: '00B8' }),
      delaySeconds: 10,
      run: (data, matches) => {
        delete data.spell[matches.target];
      },
    },
    {
      // TODO: add callouts for each of these
      id: 'E2S Cycle of Retribution',
      netRegex: NetRegexes.startsUsing({ id: '4659', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4659', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4659', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4659', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4659', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4659', source: '보이드워커', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In, Protean, Sides',
          de: 'Rein, Himmelsrichtungen, Seiten',
          fr: 'Intérieur, Position, Côtés',
          ja: '中 => 散開 => 横',
          cn: '脚下 => 站位 => 两侧',
          ko: '중앙 => 산개 => 측면',
        },
      },
    },
    {
      id: 'E2S Cycle of Chaos',
      netRegex: NetRegexes.startsUsing({ id: '40B9', source: 'Voidwalker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '40B9', source: 'Nichtswandler', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '40B9', source: 'Marcheuse Du Néant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '40B9', source: 'ヴォイドウォーカー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '40B9', source: '虚无行者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '40B9', source: '보이드워커', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sides, In, Protean',
          de: 'Seiten, Rein, Himmelsrichtungen',
          fr: 'Côtés, Intérieur, Position',
          ja: '横 => 中 => 散開',
          cn: '两侧 => 脚下 => 站位',
          ko: '측면 => 중앙 => 산개',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Hand Of Erebos': 'Arm Des Erebos',
        'Voidwalker': 'Nichtswandler',
      },
      'replaceText': {
        'Cleaver/Slicer': 'Schlachter/Sense',
        'Cycle Of ?': '? Chaos',
        'Dark Fire III': 'Dunkel-Feuga',
        'Doomvoid Cleaver': 'Nichtsmarter-Schlachter',
        'Doomvoid Guillotine': 'Nichtsmarter-Fallbeil',
        'Doomvoid Slicer': 'Nichtsmarter-Sense',
        'Empty Hate(?!/)': 'Gähnender Abgrund',
        'Empty Hate/Rage': 'Lockende Leere/Gähnender Abgrund',
        'Empty Rage': 'Lockende Leere',
        'Entropy': 'Entropie',
        'Flare': 'Flare',
        'Guillotine/Cleaver': 'Fallbeil/Schlachter',
        'Hell Wind': 'Höllenwind',
        'Light/Dark Circles': 'Licht/Dunkelheit Kreis',
        'Punishing Ray': 'Strafender Strahl',
        'Quietus': 'Quietus',
        'Shadoweye': 'Schattenauge',
        'Shadowflame': 'Schattenflamme',
        'Slicer/Guillotine': 'Sense/Fallbeil',
        'Spell-In-Waiting': 'Verzögerung',
        'Unholy Darkness': 'Unheiliges Dunkel',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Hand Of Erebos': 'Bras D\'Érèbe',
        'Voidwalker': 'Marcheuse Du Néant',
      },
      'replaceText': {
        '\\?': ' ?',
        'Cleaver/Slicer': 'Couperet/Entaille',
        'Cycle Of ?': 'Multi-taillade',
        'Dark Fire III': 'Méga Feu ténébreux',
        'Doomvoid Cleaver': 'Couperet du néant ravageur',
        'Doomvoid Guillotine': 'Guillotine du néant ravageur',
        'Doomvoid Slicer': 'Entaille du néant ravageur',
        'Empty Hate(?!/)': 'Vaine malice',
        'Empty Hate/Rage': 'Vaine malice/cruauté',
        'Empty Rage': 'Vaine cruauté',
        'Entropy': 'Entropie',
        'Flare': 'Brasier',
        'Guillotine/Cleaver': 'Guillotine/Couperet',
        'Hell Wind': 'Vent infernal',
        'Light/Dark Circles': 'Cercle Lumière/Ténèbres',
        'Punishing Ray': 'Rayon punitif',
        'Quietus': 'Quietus',
        'Shadoweye': 'Œil de l\'ombre',
        'Shadowflame': 'Flamme d\'ombre',
        'Slicer/Guillotine': 'Entaille/Guillotine',
        'Spell-In-Waiting': 'Déphasage incantatoire',
        'Unholy Darkness': 'Miracle sombre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Hand Of Erebos': 'エレボスの巨腕',
        'Voidwalker': 'ヴォイドウォーカー',
      },
      'replaceText': {
        '\\?': ' ?',
        'Cleaver/Slicer': 'クリーバー/スライサー',
        'Cycle Of ?': '？の連続剣',
        'Dark Fire III': 'ダークファイガ',
        'Doomvoid Cleaver': 'ドゥームヴォイド・クリーバー',
        'Doomvoid Guillotine': 'ドゥームヴォイド・ギロチン',
        'Doomvoid Slicer': 'ドゥームヴォイド・スライサー',
        'Empty Hate(?!/)': '虚ろなる悪意',
        'Empty Hate/Rage': '虚ろなる害意/悪意',
        'Empty Rage': '虚ろなる害意',
        'Entropy': 'エントロピー',
        'Flare': 'フレア',
        'Guillotine/Cleaver': 'ギロチン/クリーバー',
        'Hell Wind': 'ヘルウィンド',
        'Light/Dark Circles': '白い/黒いマーカー',
        'Punishing Ray': 'パニッシュレイ',
        'Quietus': 'クワイタス',
        'Shadoweye': 'シャドウアイ',
        'Shadowflame': 'シャドーフレイム',
        'Slicer/Guillotine': 'スライサー/ギロチン',
        'Spell-In-Waiting': 'ディレイスペル',
        'Unholy Darkness': 'ダークホーリー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Hand Of Erebos': '厄瑞玻斯的巨腕',
        'Voidwalker': '虚无行者',
      },
      'replaceText': {
        'Cleaver/Slicer?': '虚无劈/虚无切?',
        'Cycle Of ?': '??连续剑',
        'Dark Fire III': '黑暗爆炎',
        'Doomvoid Cleaver': '末日虚无劈',
        'Doomvoid Guillotine': '末日虚无断',
        'Doomvoid Slicer': '末日虚无切',
        'Empty Hate(?!/)': '空无的恶意',
        'Empty Hate/Rage': '空无的恶意/恶念',
        'Empty Rage': '空无的恶念',
        'Entropy': '熵',
        'Flare': '核爆',
        'Guillotine/Cleaver?': '虚无断/虚无劈?',
        'Hell Wind': '地狱之风',
        'Light/Dark Circles': '黑白圈',
        'Punishing Ray': '惩戒之光',
        'Quietus': '寂灭',
        'Shadoweye': '暗影之眼',
        'Shadowflame': '暗影炎',
        'Slicer/Guillotine': '虚无切/虚无断',
        'Spell-In-Waiting': '延迟咏唱',
        'Unholy Darkness': '黑暗神圣',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Hand Of Erebos': '에레보스의 팔',
        'Voidwalker': '보이드워커',
      },
      'replaceText': {
        'Cleaver/Slicer': '살육/베기',
        'Cycle Of ?': '? 연속검',
        'Dark Fire III': '다크 파이가',
        'Doomvoid Cleaver': '파멸의 보이드 살육',
        'Doomvoid Guillotine': '파멸의 보이드 절단',
        'Doomvoid Slicer': '파멸의 보이드 베기',
        'Empty Hate(?!/)': '공허한 악의',
        'Empty Hate/Rage': '공허한 악의/적의',
        'Empty Rage': '공허한 적의',
        'Entropy': '엔트로피',
        'Flare': '플레어',
        'Guillotine/Cleaver': '절단/살육',
        'Hell Wind': '황천의 바람',
        'Light/Dark Circles': '빛/어둠 징',
        'Punishing Ray': '응징의 빛줄기',
        'Quietus': '종지부',
        'Shadoweye': '그림자 시선',
        'Shadowflame': '그림자 불꽃',
        'Slicer/Guillotine': '베기/절단',
        'Spell-In-Waiting': '지연술',
        'Unholy Darkness': '다크 홀리',
      },
    },
  ],
};
