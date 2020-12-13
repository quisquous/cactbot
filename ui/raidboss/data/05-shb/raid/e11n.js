import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
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

const unknownTarget = {
  en: '???',
  de: '???',
  fr: '???',
  ja: '???',
  cn: '???',
  ko: '???',
};

const boundOfFaithFireTetherResponse = (data, _, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    stackOnYou: {
      en: 'Stack on YOU',
      de: 'Auf DIR sammeln',
      fr: 'Package sur VOUS',
      ja: '自分にスタック',
      cn: '集合点名',
      ko: '쉐어징 대상자',
    },
    stackOnTarget: {
      en: 'Stack on ${player}',
      de: 'Auf ${player} sammeln',
      fr: 'Packez-vous sur ${player}',
      ja: '${player}にスタック',
      cn: '靠近 ${player}集合',
      ko: '"${player}" 쉐어징',
    },
    unknownTarget: unknownTarget,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alertText: output.stackOnYou() };
  if (targets.length === 0)
    return { alertText: output.stackOnTarget({ player: output.unknownTarget() }) };
  return { alertText: output.stackOnTarget({ player: data.ShortName(targets[0]) }) };
};

const boundOfFaithLightningTetherResponse = (data, _, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    onYou: {
      en: 'Lightning on YOU',
    },
    tetherInfo: {
      en: 'Lightning on ${player}',
      de: 'Lichtverbindung auf ${player}',
      ko: '"${player}" 번개징 대상자',
    },
    unknownTarget: unknownTarget,
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
    awayFromGroup: {
      en: 'Away from Group',
      de: 'Weg von der Gruppe',
      fr: 'Éloignez-vous du groupe',
      ja: '外へ',
      cn: '远离人群',
      ko: '다른 사람들이랑 떨어지기',
    },
    awayFromTarget: {
      en: 'Away from ${player}',
      de: 'Weg von ${player}',
      fr: 'Éloignez-vous de ${player}',
      ja: '${player}から離れ',
      cn: '远离${player}',
      ko: '"${player}"에서 멀어지기',
    },
    unknownTarget: unknownTarget,
  };

  const targets = Object.keys(data.tethers || {});
  if (targets.includes(data.me))
    return { alarmText: output.awayFromGroup() };
  if (targets.length === 0)
    return { infoText: output.awayFromTarget({ player: output.unknownTarget() }) };
  return { infoText: output.awayFromTarget({ player: data.ShortName(targets[0]) }) };
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
        awayFromGroup: {
          en: 'Away from Group',
          de: 'Weg von der Gruppe',
          fr: 'Éloignez-vous du groupe',
          ja: '外へ',
          cn: '远离人群',
          ko: '다른 사람들이랑 떨어지기',
        },
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
          ko: '직선 장판 + 장판 유도',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Lightning Clone',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image', id: '5645', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abbild[p] des fusionierten Ascians', id: '5645', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'double du Sabreur de destins', id: '5645', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカーの幻影', id: '5645', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Lightning First -> Rotate For Fire',
        },
      },
    },
    {
      id: 'E11N Burnt Strike Fire Clone',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image', id: '5643', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abbild[p] des fusionierten Ascians', id: '5643', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'double du Sabreur de destins', id: '5643', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカーの幻影', id: '5643', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire Knockback After Lightning',
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
          ko: '번개: 빨강으로',
        },
      },
    },
  ],
};
