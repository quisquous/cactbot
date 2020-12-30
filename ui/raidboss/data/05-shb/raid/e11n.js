import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Outputs from '../../../../../resources/outputs.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// EDEN'S PROMISE: ANAMORPHOSIS
// E11 NORMAL

// TODO: Handle Bound of Faith
// TODO: Callouts for the intermission Burnt Strike
// TODO: See whether it's possible to math out the spawn locations for Blasting Zone

// sinsmite = lightning elemental break
// sinsmoke = fire elemental break
// sinsight = light elemental break
// blastburn = burnt strike fire knockback
// burnout = burnt strike lightning out
// shining blade = burnt strike light bait

const tetherIds = ['0002', '0005', '0006'];

const boundOfFaithFireTetherResponse = (data, _, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    stackOnYou: Outputs.stackOnYou,
    stackOnPlayer: Outputs.stackOnPlayer,
    unknownTarget: Outputs.unknownTarget,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alertText: output.stackOnYou() };
  if (targets.length === 0)
    return { alertText: output.stackOnPlayer({ player: output.unknownTarget() }) };
  return { alertText: output.stackOnPlayer({ player: data.ShortName(targets[0]) }) };
};

const boundOfFaithLightningTetherResponse = (data, _, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    onYou: {
      en: 'Lightning on YOU',
      de: 'Blitz auf DIR',
      fr: 'Éclair sur VOUS',
      ja: '自分に感電',
      cn: '雷点名',
      ko: '번개징 대상자',
    },
    tetherInfo: {
      en: 'Lightning on ${player}',
      de: 'Blitz auf ${player}',
      fr: 'Éclair sur ${player}',
      ja: '${player}に感電',
      cn: '雷点${player}',
      ko: '"${player}" 번개징 대상자',
    },
    unknownTarget: Outputs.unknownTarget,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alarmText: output.onYou() };

  const target = targets.length === 1 ? data.ShortName(targets[0]) : output.unknownTarget();
  return { infoText: output.tetherInfo({ player: target }) };
};

const boundOfFaithHolyTetherResponse = (data, _, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    awayFromGroup: Outputs.awayFromGroup,
    awayFromPlayer: Outputs.awayFromPlayer,
    unknownTarget: Outputs.unknownTarget,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alarmText: output.awayFromGroup() };
  if (targets.length === 0)
    return { infoText: output.awayFromPlayer({ player: output.unknownTarget() }) };
  return { infoText: output.awayFromPlayer({ player: data.ShortName(targets[0]) }) };
};


export default {
  zoneId: ZoneId.EdensPromiseAnamorphosis,
  timelineFile: 'e11n.txt',
  triggers: [
    {
      id: 'E11N Burnished Glory',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5650', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5650', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5650', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5650', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E11N Powder Mark',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '564E' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '564E' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '564E' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '564E' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E11N Powder Mark Explosion',
      netRegex: NetRegexes.gainsEffect({ source: 'Fatebreaker', effectId: '993' }),
      netRegexDe: NetRegexes.gainsEffect({ source: 'Fusioniert(?:e|er|es|en) Ascian', effectId: '993' }),
      netRegexFr: NetRegexes.gainsEffect({ source: 'Sabreur De Destins', effectId: '993' }),
      netRegexJa: NetRegexes.gainsEffect({ source: 'フェイトブレイカー', effectId: '993' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 4,
      alertText: (data, _, output) => output.awayFromGroup(),
      outputStrings: {
        awayFromGroup: Outputs.awayFromGroup,
      },
    },
    {
      id: 'E11N Burnt Strike Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '562C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '562C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '562C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '562C', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Knockback',
          de: 'Linien AoE -> Rückstoß',
          fr: 'AoE en ligne -> Poussée',
          ja: '直線AoE -> ノックバック',
          cn: '直线AoE -> 击退',
          ko: '직선 장판 -> 넉백',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '562E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '562E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '562E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '562E', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Out',
          de: 'Linien AoE -> Raus',
          fr: 'AoE en ligne -> Extérieur',
          ja: '直線AoE -> 離れる',
          cn: '直线AoE -> 远离',
          ko: '직선 장판 -> 바깥으로',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5630', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5630', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5630', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5630', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave + Bait',
          de: 'Linien AoE -> Ködern',
          fr: 'AoE en ligne + Attirez',
          ja: '直線AoE -> 誘導',
          cn: '直线AoE+放置点名',
          ko: '직선 장판 + 장판 유도',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Lightning Clone',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image', id: '5645', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abbild des fusionierten Ascians', id: '5645', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'double du Sabreur de destins', id: '5645', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカーの幻影', id: '5645', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Lightning First -> Rotate For Fire',
          de: 'Weiche zuerst Blitz aus -> Rotiere für Feuer',
          fr: 'Évitez l\'éclair d\'abord -> Tournez pour le Feu',
          ja: '雷に避け -> 炎 準備',
          cn: '躲雷 -> 火击退',
          ko: '번개 먼저 피하고 -> 회전해서 화염 피하기',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Fire Clone',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image', id: '5643', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abbild des fusionierten Ascians', id: '5643', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'double du Sabreur de destins', id: '5643', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカーの幻影', id: '5643', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire Knockback After Lightning',
          de: 'Feuer Rückstoß nach Blitz',
          fr: 'Poussée du Feu après l\'Éclair',
          ja: '雷 -> 炎ノックバック',
          cn: '雷 -> 火击退',
          ko: '번개 다음 화염 넉백',
        },
      },
    },
    {
      id: 'E11N Bound Of Faith Tether Collector',
      netRegex: NetRegexes.tether({ id: tetherIds }),
      run: (data, matches) => {
        data.tethers = data.tethers || {};
        data.tethers[matches.target] = matches.sourceId;
      },
    },
    {
      id: 'E11N Bound Of Faith Tether Collector Cleanup',
      netRegex: NetRegexes.tether({ id: tetherIds, capture: false }),
      delaySeconds: 20,
      run: (data) => delete data.tethers,
    },
    {
      id: 'E11N Bound Of Faith Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '4B18', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '4B18', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '4B18', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '4B18', capture: false }),
      response: boundOfFaithFireTetherResponse,
    },
    {
      id: 'E11N Bound Of Faith Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '4B19' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '4B19' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '4B19' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '4B19' }),
      condition: (data, matches) => data.me === matches.target || data.role === 'healer',
      response: boundOfFaithLightningTetherResponse,
    },
    {
      id: 'E11N Bound Of Faith Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '4B1B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '4B1B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '4B1B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '4B1B', capture: false }),
      response: boundOfFaithHolyTetherResponse,
    },
    {
      id: 'E11N Turn of the Heavens Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5639', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5639', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5639', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5639', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
          de: 'Feuer: Geh zu Blau',
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 雷側へ',
          cn: '火：去蓝门一侧',
          ko: '화염: 파랑으로',
        },
      },
    },
    {
      id: 'E11N Turn of the Heavens Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '563A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '563A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '563A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '563A', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 炎側へ',
          cn: '雷：去红门一侧',
          ko: '번개: 빨강으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demi-Gukumatz': 'Demi-Gukumatz',
        'Fatebreaker(?!\'s Image)': 'fusioniert(?:e|er|es|en) Ascian',
        'Fatebreaker\'s Image': 'Abbild des fusionierten Ascians',
        'Halo Of Flame': 'Halo der Flamme',
      },
      'replaceText': {
        'Ageless Serpent': 'Alterslose Schlange',
        'Blastburn': 'Brandstoß',
        'Blasting Zone': 'Erda-Detonation',
        'Brightfire': 'Lichtflamme',
        '(?<!Mortal )Burn Mark': 'Brandmal',
        'Burnished Glory': 'Leuchtende Aureole',
        'Burnout': 'Brandentladung',
        'Burnt Strike': 'Brandschlag',
        'Floating Fetters': 'Schwebende Fesseln',
        'Mortal Burn Mark': 'Brandmal der Sterblichen',
        'Powder Mark': 'Pulvermal',
        'Prismatic Deception': 'Prismatische Unsichtbarkeit',
        'Resounding Crack': 'Gewaltiger Bruch',
        'Shifting Sky': 'Himmelsverschiebung',
        'Shining Blade': 'Leuchtende Klinge',
        'Sinsight': 'Sündenlicht',
        'Sinsmite': 'Sündenblitz',
        'Sinsmoke': 'Sündenflamme',
        'Solemn Charge': 'Wütende Durchbohrung',
        'Turn Of The Heavens': 'Kreislauf der Wiedergeburt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Demi-Gukumatz': 'demi-Gukumatz',
        'Fatebreaker(?!\'s Image)': 'Sabreur de destins',
        'Fatebreaker\'s Image': 'double du Sabreur de destins',
        'Halo Of Flame': 'halo de feu',
      },
      'replaceText': {
        '\\?': ' ?',
        'Ageless Serpent': 'Serpent éternel',
        'Blastburn': 'Explosion brûlante',
        'Blasting Zone': 'Zone de destruction',
        'Brightfire': 'Flammes de Lumière',
        '(?<!Mortal )Burn Mark': 'Marque explosive',
        'Burnished Glory': 'Halo luminescent',
        'Burnout': 'Combustion totale',
        'Burnt Strike': 'Frappe brûlante',
        'Floating Fetters': 'Entraves flottantes',
        'Mortal Burn Mark': 'Marque de conflagration',
        'Powder Mark': 'Marquage fatal',
        'Prismatic Deception': 'Invisibilité prismatique',
        'Resounding Crack': 'Turbulence magique',
        'Shifting Sky': 'Percée céleste ultime',
        'Shining Blade': 'Lame étincelante',
        'Sinsight': 'Lumière du péché',
        'Sinsmite': 'Éclair du péché',
        'Sinsmoke': 'Flammes du péché',
        'Solemn Charge': 'Charge perçante',
        'Turn Of The Heavens': 'Cercles rituels',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Demi-Gukumatz': 'デミグクマッツ',
        'Fatebreaker(?!\'s Image)': 'フェイトブレイカー',
        'Fatebreaker\'s Image': 'フェイトブレイカーの幻影',
        'Halo Of Flame': '焔の光輪',
      },
      'replaceText': {
        'Ageless Serpent': '龍頭龍尾',
        'Blastburn': 'バーンブラスト',
        'Blasting Zone': 'ブラスティングゾーン',
        'Brightfire': '光炎',
        '(?<!Mortal )Burn Mark': '爆印',
        'Burnished Glory': '光焔光背',
        'Burnout': 'バーンアウト',
        'Burnt Strike': 'バーンストライク',
        'Floating Fetters': '浮遊拘束',
        'Mortal Burn Mark': '大爆印',
        'Powder Mark': '爆印刻',
        'Prismatic Deception': 'プリズマチックインビジブル',
        'Resounding Crack': '魔乱流',
        'Shifting Sky': '至天絶技',
        'Shining Blade': 'シャインブレード',
        'Sinsight': 'シンライト',
        'Sinsmite': 'シンボルト',
        'Sinsmoke': 'シンフレイム',
        'Solemn Charge': 'チャージスラスト',
        'Turn Of The Heavens': '転輪召',
      },
    },
  ],
};
