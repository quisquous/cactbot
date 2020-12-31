import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Outputs from '../../../../../resources/outputs.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: ageless serpent knockback
// TODO: add tank lightning cleave stuff
// TODO: tether during right of the heavens 2
// TODO: burnt strike callouts during shifting/sundered sky
// TODO: move callout for holy burnt strike bait

// Notes:
// sinsmite = lightning elemental break
// sinsmoke = fire elemental break
// sinsight = light elemental break
// blastburn = burnt strike fire knockback
// burnout = burnt strike lightning out
// shining blade = burnt strike light bait

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
      en: 'Take Lightning To Tanks',
      de: 'Bring Blitz zu den Tanks',
      fr: 'Donnez l\'Éclair au tanks',
      ja: 'タンクに近づく',
      cn: '和T处理雷',
      ko: '번개징 탱커쪽으로',
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
          fr: 'Position -> Packez-vous avec votre partenaire',
          ja: '8方向散開 -> ペア頭割り',
          cn: '八方 -> 分摊',
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
          fr: 'Position -> Dispersez-vous',
          ja: '8方向散開 -> 散開',
          cn: '八方 -> 分散',
          ko: '8산개 -> 산개',
        },
      },
    },
    {
      id: 'E11S Elemental Break Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5668', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5668', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5668', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5668', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Holy Groups',
          de: 'Himmelsrichtung -> Sanctus Gruppen',
          fr: 'Position -> Groupes',
          ja: '8方向散開 -> 光3方向頭割り',
          cn: '八方 -> 光三向分摊',
          ko: '8산개 -> 홀리 그룹 쉐어',
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
          fr: 'AoE en ligne -> Poussée',
          ja: '直線範囲 -> ノックバック',
          cn: '直线 -> 击退',
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
          fr: 'AoE en ligne -> Extérieur',
          ja: '直線範囲 -> 離れる',
          cn: '直线 -> 去外侧',
          ko: '직선 장판 -> 바깥으로',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5656', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5656', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5656', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5656', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave + Bait',
          de: 'Linien AoE -> Ködern',
          fr: 'AoE en ligne + Attirez',
          ja: '直線範囲 -> AoE誘導',
          cn: '直线 -> 放光点名',
          ko: '직선 장판 + 장판 유도',
        },
      },
    },
    {
      id: 'E11S Bound Of Faith Tether Collector',
      netRegex: NetRegexes.tether({ id: '0011' }),
      run: (data, matches) => {
        data.tethers = data.tethers || {};
        data.tethers[matches.target] = matches.sourceId;
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
      response: boundOfFaithFireTetherResponse,
    },
    {
      id: 'E11S Bound Of Faith Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '565B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '565B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '565B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '565B', capture: false }),
      response: boundOfFaithLightningTetherResponse,
    },
    {
      id: 'E11S Bound Of Faith Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '565F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '565F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '565F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '565F', capture: false }),
      response: boundOfFaithHolyTetherResponse,
    },
    {
      id: 'E11S Bound Of Faith Shifting Sky',
      // After Shifting Sky, there's a fire (567F) and lightning (5682) Bound Of Faith from Images.
      // After Sundered Sky, there's a fire (567F) and holy (5BC5) Bound Of Faith from Images.
      // These are the only time these Images appear and cast Bound Of Faith,
      // catch the first via 5682 and the second via 5BC5 and call two tethers with one trigger.
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image', id: '5682' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abbild Des Fusionierten Ascians', id: '5682' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Double Du Sabreur De Destins', id: '5682' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカーの幻影', id: '5682' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          fireTetherOnYou: {
            en: 'Stack With Fire Tether',
            de: 'Auf der Feuer-Verbindung sammeln',
            fr: 'Packez-vous avec le lien de Feu',
            ja: '炎の線を頭割り',
            cn: '和火连线分摊',
            ko: '화염 선 대상자, 쉐어뎀',
          },
          lightningTetherOnYou: {
            en: 'Take Lightning To Tanks',
            de: 'Bring Blitz zum Tank',
            fr: 'Donnez l\'Éclair aux tanks',
            ja: 'タンクに近づく',
            cn: '和T分摊雷',
            ko: '번개 탱커한테 넘기기',
          },
          tetherInfo: {
            en: 'Lightning on ${player1}, Fire on ${player2}',
            de: 'Blitz auf ${player1}, Feuer auf ${player2}',
            fr: 'Éclair sur ${player1}, Feu sur ${player2}',
            ja: '${player1} に雷, ${player2} に炎',
            cn: '雷点${player1}，火点${player2}',
            ko: '"${player1}" 번개, "${player2}" 화염',
          },
        };

        if (!data.tethers)
          return;
        const targets = Object.keys(data.tethers);
        if (targets.length !== 2) {
          console.error(`Unknown Shifting Sky tether targets: ${JSON.stringify(data.tethers)}`);
          return;
        }

        let fireTarget;
        let lightningTarget;
        if (data.tethers[targets[0]] === matches.sourceId) {
          lightningTarget = targets[0];
          fireTarget = targets[1];
        } else if (data.tethers[targets[1]] === matches.sourceId) {
          fireTarget = targets[0];
          lightningTarget = targets[1];
        } else {
          console.error(`Weird Shifting Sky tether targets: ${JSON.stringify(data.tethers)}` +
            `, ${JSON.stringify(matches)}`);
          return;
        }

        const tetherInfo = output.tetherInfo({
          player1: data.ShortName(lightningTarget),
          player2: data.ShortName(fireTarget),
        });
        const response = { infoText: tetherInfo };
        if (lightningTarget === data.me)
          Object.assign(response, { alarmText: output.lightningTetherOnYou() });
        if (fireTarget === data.me)
          Object.assign(response, { alertText: output.fireTetherOnYou() });
        return response;
      },
    },
    {
      id: 'E11S Bound Of Faith Sundered Sky',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image', id: '5BC5' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abbild Des Fusionierten Ascians', id: '5BC5' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Double Du Sabreur De Destins', id: '5BC5' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカーの幻影', id: '5BC5' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          fireTetherOnYou: {
            en: 'Stack With Fire Tether',
            de: 'Auf der Feuer-Verbindung sammeln',
            fr: 'Packez-vous avec le lien de Feu',
            ja: '炎の線を頭割り',
            cn: '和火连线分摊',
            ko: '화염 선 대상자, 쉐어뎀',
          },
          holyTetherOnYou: Outputs.awayFromGroup,
          tetherInfo: {
            en: 'Holy on ${player1}, Fire on ${player2}',
            de: 'Sanctus auf ${player1}, Feuer auf ${player2}',
            fr: 'Sacre sur ${player1}, Feu sur ${player2}',
            ja: '${player1} に光, ${player2} に炎',
            cn: '光点${player1}，火点${player2}',
            ko: '"${player1}" 홀리, "${player2}" 화염',
          },
        };

        if (!data.tethers)
          return;
        const targets = Object.keys(data.tethers);
        if (targets.length !== 2) {
          console.error(`Unknown Sundered Sky tether targets: ${JSON.stringify(data.tethers)}`);
          return;
        }

        let fireTarget;
        let holyTarget;
        if (data.tethers[targets[0]] === matches.sourceId) {
          holyTarget = targets[0];
          fireTarget = targets[1];
        } else if (data.tethers[targets[1]] === matches.sourceId) {
          fireTarget = targets[0];
          holyTarget = targets[1];
        } else {
          console.error(`Weird Sundered Sky tether targets: ${JSON.stringify(data.tethers)}` +
            `, ${JSON.stringify(matches)}`);
          return;
        }

        const tetherInfo = output.tetherInfo({
          player1: data.ShortName(holyTarget),
          player2: data.ShortName(fireTarget),
        });
        const response = { infoText: tetherInfo };
        if (holyTarget === data.me)
          Object.assign(response, { alarmText: output.holyTetherOnYou() });
        if (fireTarget === data.me)
          Object.assign(response, { alertText: output.fireTetherOnYou() });
        return response;
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
        awayFromGroup: Outputs.awayFromGroup,
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
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 安置は青',
          cn: '火：去蓝门',
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
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 安置は赤',
          cn: '雷：去红门',
          ko: '번개: 빨강으로',
        },
      },
    },
    {
      id: 'E11S Shifting Sky Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5675', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5675', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5675', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5675', capture: false }),
      durationSeconds: 17,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
          de: 'Feuer: Geh zu Blau',
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 安置は青',
          cn: '火：去蓝门',
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
      durationSeconds: 17,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 安置は赤',
          cn: '雷：去红门',
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
          fr: 'Feu : Allez sur le Bleu',
          ja: '炎: 安置は青',
          cn: '火：去蓝门',
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
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
          de: 'Blitz: Geh zu Rot',
          fr: 'Éclair : Allez sur le Rouge',
          ja: '雷: 安置は赤',
          cn: '雷：去红门',
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
      durationSeconds: 16,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Knockback To Red -> Go Blue',
          de: 'Feuer: Rückstoß zu Rot -> Geh zu Blau',
          fr: 'Feu : Poussée sur le Rouge -> Allez sur le Bleu',
          ja: '炎: 赤にノックバック -> 青へ',
          cn: '火：向红门击退 -> 去蓝门',
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
      durationSeconds: 16,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Knockback To Blue -> Go Red',
          de: 'Blitz: Rückstoß zu Blau -> Geh zu Rot',
          fr: 'Éclair : Poussée sur le Bleu -> Allez sur le Rouge',
          ja: '雷: 青にノックバック -> 赤へ',
          cn: '雷：向蓝门击退 -> 去红门',
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
          fr: 'Position -> Packez-vous avec votre partenaire -> Aoe en ligne -> Poussée -> Package',
          ja: '8方向散開 -> 2人頭割り -> 直線範囲 -> ノックバック -> 頭割り',
          cn: '八方 -> 分摊 -> 直线 -> 击退 -> 集合',
          ko: '8산개 -> 파트너 쉐어뎀 -> 직선 장판 -> 넉백 -> 모이기',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Fire Tether',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '568A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '568A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '568A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '568A', capture: false }),
      delaySeconds: 16.5,
      response: boundOfFaithFireTetherResponse,
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
          fr: 'Position -> Dispersez-vous -> AoE en ligne -> Extérieur -> Tank cleaves',
          ja: '8方向散開 -> 散開 -> 直線範囲 -> 離れる -> タンクに雷範囲',
          cn: '八方 -> 分散 -> 直线 -> 远离直线 -> T接雷',
          ko: '8산개 -> 산개 -> 직선 장판 -> 밖으로 -> 광역 탱버',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Lightning Tether',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5692', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '5692', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '5692', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '5692', capture: false }),
      delaySeconds: 16.5,
      response: boundOfFaithLightningTetherResponse,
    },
    {
      id: 'E11S Cycle of Faith Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '569A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '569A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '569A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '569A', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Holy Groups -> Line Cleave -> Bait -> Away',
          de: 'Himmelsrichtung -> Sanctus Gruppen -> Linien AoE -> Ködern -> Weg',
          fr: 'Position -> Groupes -> AoE en ligne -> Attirez -> Éloignez-vous',
          ja: '8方向散開 -> 3方向頭割り -> 直線範囲 -> AoE誘導 -> 離れる',
          cn: '八方 -> 光三向分摊 -> 直线 -> 放光点名 -> 离开',
          ko: '8산개 -> 홀리 그룹 쉐어 -> 직선 장판 -> 장판 유도 -> 피하기',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Holy Tether',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '569A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fusioniert(?:e|er|es|en) Ascian', id: '569A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sabreur De Destins', id: '569A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'フェイトブレイカー', id: '569A', capture: false }),
      delaySeconds: 16.5,
      response: boundOfFaithHolyTetherResponse,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demi-Gukumatz': 'Demi-Gukumatz',
        'Fatebreaker\'s image': 'Abbild des fusionierten Ascians',
        'Fatebreaker(?!\'s image)': 'fusioniert(?:e|er|es|en) Ascian',
        'Halo of Flame': 'Halo der Flamme',
      },
      'replaceText': {
        'Ageless Serpent': 'Alterslose Schlange',
        'Blastburn': 'Brandstoß',
        'Blasting Zone': 'Erda-Detonation',
        'Bound Of Faith': 'Sünden-Erdstoß',
        'Bow Shock': 'Schockpatrone',
        'Brightfire': 'Lichtflamme',
        '(?<!Mortal )Burn Mark': 'Brandmal',
        'Burnished Glory': 'Leuchtende Aureole',
        'Burnout': 'Brandentladung',
        'Burnt Strike': 'Brandschlag',
        'Cycle Of Faith': 'Mehrfache Vergeltung',
        'Cycle of Faith': 'Mehrfache Vergeltung',
        'Elemental Break': 'Elementarbruch',
        'Floating Fetters': 'Schwebende Fesseln',
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
        'Fatebreaker\'s image': 'double du Sabreur de destins',
        'Fatebreaker(?!\'s image)': 'Sabreur de destins',
        'Halo of Flame': 'halo de feu',
      },
      'replaceText': {
        '\\?': ' ?',
        'Ageless Serpent': 'Serpent éternel',
        'Blastburn': 'Explosion brûlante',
        'Blasting Zone': 'Zone de destruction',
        'Bound Of Faith': 'Percée illuminée',
        'Bow Shock': 'Arc de choc',
        'Brightfire': 'Flammes de Lumière',
        '(?<!Mortal )Burn Mark': 'Marque explosive',
        'Burnished Glory': 'Halo luminescent',
        'Burnout': 'Combustion totale',
        'Burnt Strike': 'Frappe brûlante',
        'Cycle Of Faith': 'Multi-taillade magique',
        'Cycle of Faith': 'Multi-taillade magique',
        'Elemental Break': 'Rupture élémentaire',
        'Floating Fetters': 'Entraves flottantes',
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
        'Fatebreaker\'s image': 'フェイトブレイカーの幻影',
        'Fatebreaker(?!\'s image)': 'フェイトブレイカー',
        'Halo of Flame': '焔の光輪',
      },
      'replaceText': {
        'Ageless Serpent': '龍頭龍尾',
        'Blastburn': 'バーンブラスト',
        'Blasting Zone': 'ブラスティングゾーン',
        'Bound Of Faith': 'シンソイルスラスト',
        'Bow Shock': 'バウショック',
        'Brightfire': '光炎',
        '(?<!Mortal )Burn Mark': '爆印',
        'Burnished Glory': '光焔光背',
        'Burnout': 'バーンアウト',
        'Burnt Strike': 'バーンストライク',
        'Cycle Of Faith': '魔装連続剣',
        'Cycle of Faith': '魔装連続剣',
        'Elemental Break': 'エレメンタルブレイク',
        'Floating Fetters': '浮遊拘束',
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
