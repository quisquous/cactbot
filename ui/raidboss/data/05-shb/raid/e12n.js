import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: Tether mechanic callouts. Each tether type is used for one primal,
// so we could just do a collect > analyze > call system based on which tethers are seen.
// TODO: Handle the EarthShaker bait --> beam intercept mechanic during the intermission.
// TODO: Math the spawn position of the Titanic Bomb Boulders to call the safe direction like E4s.
// TODO: Fix the Rapturous Reach trigger so it doesn't double call during the intermission.


export default {
  zoneId: ZoneId.EdensPromiseEternity,
  timelineFile: 'e12n.txt',
  triggers: [
    {
      id: 'E12N Maleficium',
      netRegex: NetRegexes.startsUsing({ id: '5872', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5872', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5872', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5872', source: 'プロミス・オブ・エデン', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12N Formless Judgment',
      netRegex: NetRegexes.startsUsing({ id: '5873', source: 'Eden\'s Promise' }),
      netRegexDe: NetRegexes.startsUsing({ id: '5873', source: 'Edens Verheißung' }),
      netRegexFr: NetRegexes.startsUsing({ id: '5873', source: 'Promesse D\'Éden' }),
      netRegexJa: NetRegexes.startsUsing({ id: '5873', source: 'プロミス・オブ・エデン' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'E12N Boulders Impact',
      netRegex: NetRegexes.ability({ id: '586E', source: 'Titanic Bomb Boulder', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '586E', source: 'Mega-Bomber-Brocken', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '586E', source: 'Méga Bombo Rocher', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '586E', source: 'メガ・ボムボルダー', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Between small bombs',
          de: 'Zwischen 2 kleinen Bomben stehen',
        },
      },
    },
    {
      id: 'E12N Boulders Explosion',
      netRegex: NetRegexes.ability({ id: '586F', source: 'Titanic Bomb Boulder', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '586F', source: 'Mega-Bomber-Brocken', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '586F', source: 'Méga Bombo Rocher', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '586F', source: 'メガ・ボムボルダー', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to last explosions',
          de: 'Zur letzten Explosion bewegen',
        },
      },
    },
    {
      id: 'E12N Rapturous Reach',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E12N Diamond Dust Spread',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5864', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5864', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5864', source: 'プロミス・オブ・エデン', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'E12N Diamond Dust Stop',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5864', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5864', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5864', source: 'プロミス・オブ・エデン', capture: false }),
      delaySeconds: 1, // Avoiding collision with the spread call
      response: Responses.stopMoving('info'),
    },
    {
      id: 'E12N Frigid Stone',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<!Titanic )Bomb Boulder': 'Bomber-Brocken',
        'Chiseled Sculpture': 'Abbild eines Mannes',
        'Eden\'s Promise': 'Edens Verheißung',
        'Titanic Bomb Boulder': 'Mega-Bomber-Brocken',
      },
      'replaceText': {
        'Cast': 'Auswerfen',
        'Classical Sculpture': 'Klassische Skulptur',
        'Conflag Strike': 'Feuersbrunst',
        'Diamond Dust': 'Diamantenstaub',
        'Earth Shaker': 'Erdstoß',
        'Earthen Fury': 'Gaias Zorn',
        'Eternal Oblivion': 'Ewiges Vergessen',
        'Explosion': 'Explosion',
        'Ferostorm': 'Angststurm',
        'Formless Judgment': 'Formloses Urteil',
        'Frigid Stone': 'Eisstein',
        'Ice Floe': 'Eisfluss',
        'Impact': 'Impakt',
        'Initialize Recall': 'Rückholung initialisieren',
        'Judgment Jolt': 'Blitz des Urteils',
        'Junction Shiva': 'Verbindung: Shiva',
        'Junction Titan': 'Verbindung: Titan',
        'Laser Eye': 'Laserauge',
        'Maleficium': 'Maleficium',
        'Obliteration': 'Auslöschung',
        'Palm Of Temperance': 'Hand der Mäßigung',
        'Paradise Lost': 'Verlorenes Paradies',
        'Rapturous Reach': 'Stürmischer Griff',
        'Release': 'Freilassen',
        'Stock': 'Sammeln',
        'Temporary Current': 'Unstete Gezeiten',
        'Under The Weight': 'Wucht der Erde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<!Titanic )Bomb Boulder': 'bombo rocher',
        'Chiseled Sculpture': 'création masculine',
        'Eden\'s Promise': 'Promesse d\'Éden',
        'Titanic Bomb Boulder': 'méga bombo rocher',
      },
      'replaceText': {
        'Cast': 'Lancer',
        'Classical Sculpture': 'Serviteur colossal',
        'Conflag Strike': 'Ekpurosis',
        'Diamond Dust': 'Poussière de diamant',
        'Earth Shaker': 'Secousse',
        'Earthen Fury': 'Fureur tellurique',
        'Eternal Oblivion': 'Oubli éternel',
        'Explosion': 'Explosion',
        'Ferostorm': 'Tempête déchaînée',
        'Formless Judgment': 'Onde du châtiment',
        'Frigid Stone': 'Rocher de glace',
        'Ice Floe': 'Flux glacé',
        'Impact': 'Impact',
        'Initialize Recall': 'Remembrances',
        'Judgment Jolt': 'Front orageux du jugement',
        'Junction Shiva': 'Associer : Shiva',
        'Junction Titan': 'Associer : Titan',
        'Laser Eye': 'Faisceau maser',
        'Maleficium': 'Maleficium',
        'Obliteration': 'Oblitération',
        'Palm Of Temperance': 'Paume de tempérance',
        'Paradise Lost': 'Paradis perdu',
        'Rapturous Reach': 'Main voluptueuse',
        'Release': 'Relâcher',
        'Stock': 'Stocker',
        'Temporary Current': 'Courant évanescent',
        'Under The Weight': 'Pression tellurique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '(?<!Titanic )Bomb Boulder': 'ボムボルダー',
        'Chiseled Sculpture': '創られた男',
        'Eden\'s Promise': 'プロミス・オブ・エデン',
        'Titanic Bomb Boulder': 'メガ・ボムボルダー',
      },
      'replaceText': {
        'Cast': 'はなつ',
        'Classical Sculpture': '巨兵創出',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Diamond Dust': 'ダイアモンドダスト',
        'Earth Shaker': 'アースシェイカー',
        'Earthen Fury': '大地の怒り',
        'Eternal Oblivion': '永遠の忘却',
        'Explosion': '爆発',
        'Ferostorm': 'フィアスストーム',
        'Formless Judgment': '天罰の波動',
        'Frigid Stone': 'アイスストーン',
        'Ice Floe': 'アイスフロー',
        'Impact': 'インパクト',
        'Initialize Recall': '記憶想起',
        'Judgment Jolt': '裁きの界雷',
        'Junction Shiva': 'ジャンクション：シヴァ',
        'Junction Titan': 'ジャンクション：タイタン',
        'Laser Eye': 'メーザーアイ',
        'Maleficium': 'マレフィキウム',
        'Obliteration': 'オブリタレーション',
        'Palm Of Temperance': '拒絶の手',
        'Paradise Lost': 'パラダイスロスト',
        'Rapturous Reach': '悦楽の手',
        'Release': 'リリース',
        'Stock': 'ストック',
        'Temporary Current': 'テンポラリーカレント',
        'Under The Weight': '大地の重圧',
      },
    },
  ],
};
