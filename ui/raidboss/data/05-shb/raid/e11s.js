import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: ageless serpent knockback
// TODO: shifting sky tether callouts
// TODO: cycle of faith tether callouts

// Notes:
// sinsmite = lightning elemental break
// sinsmoke = fire elemental break
// sinsight = light elemental break
// blastburn = burnt strike fire knockback
// burnout = burnt strike lightning out
// shining blade = burnt strike light bait
// Fatebreaker's Image Bound Of Faith is 5682 / 567F / ????

const unknownTarget = {
  en: '???',
  de: '???',
  fr: '???',
  ja: '???',
  cn: '???',
  ko: '???',
};

export default {
  zoneId: ZoneId.EdensPromiseAnamorphosisSavage,
  timelineFile: 'e11s.txt',
  triggers: [
    {
      id: 'E11S Elemental Break Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5663', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5663', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5663', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5663', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Partner Stacks',
          de: 'Himmelsrichtung -> Auf Partner sammeln',
          ko: '8산개 -> 파트너 쉐어뎀',
        },
      },
    },
    {
      id: 'E11S Elemental Break Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5666', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5666', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5666', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5666', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Spread',
          de: 'Himmelsrichtung -> Verteilen',
          ko: '8산개 -> 산개',
        },
      },
    },
    {
      id: 'E11S Elemental Break Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5668', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5668', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5668', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5668', capture: false }),

      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Group Stacks',
          de: 'Himmelsrichtung -> In der Gruppe sammeln',
          ko: '8산개 -> 그룹 쉐어뎀',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5652', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5652', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5652', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5652', capture: false }),
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
      id: 'E11S Burnt Strike Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5654', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5654', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5654', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5654', capture: false }),
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
      id: 'E11S Burnt Strike Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5656', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5656', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5656', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5656', capture: false }),
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
      id: 'E11S Bound Of Faith Tether Collector',
      netRegex: NetRegexes.tether({ id: '0011' }),
      run: (data, matches) => {
        data.tethers = data.tethers || {};
        data.tethers[matches.target] = matches.targetId;
      },
    },
    {
      id: 'E11S Bound Of Faith Tether Collector Cleanup',
      netRegex: NetRegexes.tether({ id: '0011', capture: false }),
      delaySeconds: 20,
      run: (data) => delete data.tethers,
    },
    {
      id: 'E11S Bound Of Faith Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5658', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5658', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5658', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5658', capture: false }),
      alertText: (data, _, output) => {
        const targets = Object.keys(data.tethers || {});
        if (targets.includes(data.me))
          return output.stackOnYou();
        if (targets.length === 0)
          return output.stackOnTarget({ player: output.unknownTarget() });
        return output.stackOnTarget({ player: data.ShortName(targets[0]) });
      },
      outputStrings: {
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
      },
    },
    {
      id: 'E11S Bound Of Faith Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '565B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '565B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '565B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '565B', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          onYou: {
            en: 'Lightning Tether on YOU',
            de: 'Lichtverbindung auf DIR',
            ko: '번개징 대상자',
          },
          forTanks: {
            en: 'Lightning on ${player}',
            de: 'Lichtverbindung auf ${player}',
            ko: '"${player}" 번개징 대상자',
          },
          tankCleave: {
            en: 'Tank cleave',
            de: 'Tank Cleave',
            fr: 'Tank cleave',
            ja: '前方範囲攻撃',
            cn: '顺劈',
            ko: '광역 탱버',
          },
          unknownTarget: unknownTarget,
        };

        const targets = Object.keys(data.tethers || {});
        if (targets.includes(data.me))
          return { alarmText: output.onYou() };
        if (data.role !== 'tank')
          return { infoText: output.tankCleave() };
        if (targets.length === 0)
          return { alertText: output.forTanks({ player: output.unknownTarget() }) };
        return { alertText: output.forTanks({ player: data.ShortName(targets[0]) }) };
      },
    },
    {
      id: 'E11S Bound Of Faith Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '565F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '565F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '565F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '565F', capture: false }),
      response: (data, _, output) => {
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
      },
    },
    {
      id: 'E11S Burnished Glory',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '56A4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '56A4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '56A4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '56A4', capture: false }),

      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'E11S Powder Mark',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '56A2' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '56A2' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '56A2' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '56A2' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E11S Powder Mark Explosion',
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
      id: 'E11S Turn of the Heavens Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '566A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '566A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '566A', capture: false }),
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
      id: 'E11S Turn of the Heavens Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '566B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '566B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '566B', capture: false }),
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
    {
      id: 'E11S Resonant Winds',
      netRegex: NetRegexes.startsUsing({ source: 'Demi-Gukumatz', id: '5689', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Demi-Gukumatz', id: '5689', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Demi-Gukumatz', id: '5689', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'デミグクマッツ', id: '5689', capture: false }),
      response: Responses.getIn('info'),
    },
    {
      id: 'E11S Shifting Sky Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5675', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5675', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5675', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5675', capture: false }),

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
      id: 'E11S Shifting Sky Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5676', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5676', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5676', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5676', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          ko: '번개: 빨강으로',
        },
      },
    },
    {
      id: 'E11S Right Of The Heavens Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '566E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '566E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '566E', capture: false }),
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
      id: 'E11S Right Of The Heavens Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '566F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '566F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '566F', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          ko: '화염: 빨강으로',
        },
      },
    },
    {
      id: 'E11S Sundered Sky Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5677', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5677', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5677', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5677', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Knockback To Red -> Go Blue',
          de: 'Feuer: Rückstoß zu Rot -> Geh zu Blau',
          ko: '화염: 빨강으로 넉백 -> 파랑으로 이동',
        },
      },
    },
    {
      id: 'E11S Sundered Sky Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5678', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5678', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5678', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5678', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Knockback To Blue -> Go Red',
          de: 'Blitz: Rückstoß zu Blau -> Geh zu Rot',
          ko: '번개: 파랑으로 넉백 -> 빨강으로 이동',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '568A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '568A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '568A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '568A', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Partner Stacks -> Line Cleave -> Knockback -> Stack',
          de: 'Himmelsrichtung -> Auf Partner sammeln -> Linien AoE -> Rückstoß -> Sammeln',
          ko: '8산개 -> 파트너 쉐어뎀 -> 직선 장판 -> 넉백 -> 모이기',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5692', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5692', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5692', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5692', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Spread -> Line Cleave -> Out -> Tank Cleaves',
          de: 'Himmelsrichtung -> Verteilen -> Linien AoE -> Raus -> Tank AoEs',
          ko: '8산개 -> 산개 -> 직선 장판 -> 밖으로 -> 광역 탱버',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '569A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '569A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '569A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '569A', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Group Stacks -> Line Cleave -> Bait -> Away',
          de: 'Himmelsrichtung -> Sammeln in der Gruppe -> Linien AoE -> Ködern -> Weg',
          ko: '8산개 -> 그룹 쉐어뎀 -> 직선 장판 -> 장판 유도 -> 피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demi-Gukumatz': 'Demi-Gukumatz',
        'Fatebreaker(?!\'s image)': 'fusioniert(?:e|er|es|en) Ascian',
        'Fatebreaker\'s image': 'Abbild des fusionierten Ascians',
        'Halo of Flame': 'Halo der Flamme',
      },
      'replaceText': {
        'Ageless Serpent': 'Alterslose Schlange',
        'Blastburn': 'Brandstoß',
        'Bound Of Faith': 'Sünden-Erdstoß',
        'Bow Shock': 'Schockpatrone',
        'Brightfire': 'Lichtflamme',
        '(?<!Mortal )Burn Mark': 'Brandmal',
        'Burnished Glory': 'Leuchtende Aureole',
        'Burnout': 'Brandentladung',
        'Burnt Strike': 'Brandschlag',
        'Cycle of Faith': 'Mehrfache Vergeltung',
        'Elemental Break': 'Elementarbruch',
        'Mortal Burn Mark': 'Brandmal der Sterblichen',
        'Powder Mark': 'Pulvermal',
        'Prismatic Deception': 'Prismatische Unsichtbarkeit',
        'Resonant Winds': 'Resonante Winde',
        'Resounding Crack': 'Gewaltiger Bruch',
        'Right Of The Heavens': 'Vier Himmel',
        'Shifting Sky': 'Himmelsverschiebung',
        'Shining Blade': 'Leuchtende Klinge',
        'Sinsight': 'Sündenlicht',
        'Sinsmite': 'Sündenblitz',
        'Sinsmoke': 'Sündenflamme',
        'Solemn Charge': 'Wütende Durchbohrung',
        'Sundered Sky': 'Himmelstrennung',
        'Turn Of The Heavens': 'Kreislauf der Wiedergeburt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Demi-Gukumatz': 'demi-Gukumatz',
        'Fatebreaker(?!\'s image)': 'Sabreur de destins',
        'Fatebreaker\'s image': 'double du Sabreur de destins',
        'Halo of Flame': 'halo de feu',
      },
      'replaceText': {
        'Ageless Serpent': 'Serpent éternel',
        'Blastburn': 'Explosion brûlante',
        'Bound Of Faith': 'Percée illuminée',
        'Bow Shock': 'Arc de choc',
        'Brightfire': 'Flammes de Lumière',
        '(?<!Mortal )Burn Mark': 'Marque explosive',
        'Burnished Glory': 'Halo luminescent',
        'Burnout': 'Combustion totale',
        'Burnt Strike': 'Frappe brûlante',
        'Cycle of Faith': 'Multi-taillade magique',
        'Elemental Break': 'Rupture élémentaire',
        'Mortal Burn Mark': 'Marque de conflagration',
        'Powder Mark': 'Marquage fatal',
        'Prismatic Deception': 'Invisibilité prismatique',
        'Resonant Winds': 'Tourbillon magique',
        'Resounding Crack': 'Turbulence magique',
        'Right Of The Heavens': 'Quatre portails',
        'Shifting Sky': 'Percée céleste ultime',
        'Shining Blade': 'Lame étincelante',
        'Sinsight': 'Lumière du péché',
        'Sinsmite': 'Éclair du péché',
        'Sinsmoke': 'Flammes du péché',
        'Solemn Charge': 'Charge perçante',
        'Sundered Sky': 'Percée infernale ultime',
        'Turn Of The Heavens': 'Cercles rituels',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Demi-Gukumatz': 'デミグクマッツ',
        'Fatebreaker(?!\'s image)': 'フェイトブレイカー',
        'Fatebreaker\'s image': 'フェイトブレイカーの幻影',
        'Halo of Flame': '焔の光輪',
      },
      'replaceText': {
        'Ageless Serpent': '龍頭龍尾',
        'Blastburn': 'バーンブラスト',
        'Bound Of Faith': 'シンソイルスラスト',
        'Bow Shock': 'バウショック',
        'Brightfire': '光炎',
        '(?<!Mortal )Burn Mark': '爆印',
        'Burnished Glory': '光焔光背',
        'Burnout': 'バーンアウト',
        'Burnt Strike': 'バーンストライク',
        'Cycle of Faith': '魔装連続剣',
        'Elemental Break': 'エレメンタルブレイク',
        'Mortal Burn Mark': '大爆印',
        'Powder Mark': '爆印刻',
        'Prismatic Deception': 'プリズマチックインビジブル',
        'Resonant Winds': '魔旋風',
        'Resounding Crack': '魔乱流',
        'Right Of The Heavens': '四天召',
        'Shifting Sky': '至天絶技',
        'Shining Blade': 'シャインブレード',
        'Sinsight': 'シンライト',
        'Sinsmite': 'シンボルト',
        'Sinsmoke': 'シンフレイム',
        'Solemn Charge': 'チャージスラスト',
        'Sundered Sky': '堕獄絶技',
        'Turn Of The Heavens': '転輪召',
      },
    },
  ],
};
