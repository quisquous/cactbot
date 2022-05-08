import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: is there a way to know if a Tertius Terminus Est sword is X or +?
// 55CD has no heading.
// 55CE has a heading of 45 degrees, but that's too late to know.
// https://jp.finalfantasyxiv.com/lodestone/character/28705669/blog/4618012/

// TODO: handle mechanized maneuver with GetCombatnats?
// TODO: handle divebombs during mechanized maneuver with GetCombatants?

export interface Data extends RaidbossData {
  seenMines?: boolean;
  orbs?: NetMatches['AddedCombatant'][];
  primusPlayers?: string[];
  tertius?: NetMatches['Ability'][];
}

const centerX = 100;
const centerY = 100;

const sharedOutputStrings = {
  sharedTankStack: {
    en: 'Tank stack',
    de: 'Tanks sammeln',
    fr: 'Package tanks',
    ja: 'タンク頭割り',
    cn: '坦克分摊',
    ko: '탱끼리 모이기',
  },
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.CastrumMarinumExtreme,
  timelineFile: 'emerald_weapon-ex.txt',
  timelineTriggers: [
    {
      id: 'EmeraldEx Bit Storm',
      regex: /Bit Storm/,
      beforeSeconds: 4,
      response: Responses.getUnder(),
    },
    {
      id: 'EmeraldEx Photon Ring',
      regex: /Photon Ring/,
      beforeSeconds: 4,
      response: Responses.getOut(),
    },
  ],
  triggers: [
    {
      id: 'EmeraldEx Emerald Shot',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55B0' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55B0' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55B0' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55B0' }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55B0' }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55B0' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'EmeraldEx Optimized Ultima',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['55B1', '5B10'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['55B1', '5B10'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['55B1', '5B10'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['55B1', '5B10'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['55B1', '5B10'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: ['55B1', '5B10'], capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'EmeraldEx Aetheroplasm Production',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55AA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55AA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55AA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55AA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55AA', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55AA', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get orbs',
          de: 'Orbs nehmen',
          fr: 'Prenez les orbes',
          ja: '玉を処理',
          cn: '撞球',
          ko: '구슬 부딪히기',
        },
      },
    },
    {
      id: 'EmeraldEx Aetheroplasm Rotate',
      type: 'AddedCombatant',
      // 9705 = Ceruleum Sphere, 9706 = Nitrosphere
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9706' }),
      condition: (data, matches) => {
        (data.orbs ??= []).push(matches);
        return data.orbs.length === 4;
      },
      alertText: (data, _matches, output) => {
        if (!data.orbs)
          return;
        const isNitro = [false, false, false, false, false, false, false, false];

        for (const orb of data.orbs) {
          const x = parseFloat(orb.x) - centerX;
          const y = parseFloat(orb.y) - centerY;

          // Positions: N = (100, 78), E = (122, 100), S = (100, 122), W = (78, 100)
          // Dirs: N = 0, NE = 1, ..., NW = 7
          const dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
          if (isNitro[dir]) {
            console.error('Aetheroplasm collision');
            return;
          }
          isNitro[dir] = true;
        }

        // Check if west must rotate clockwise to avoid taking two in a row.
        // There are only two patterns here, so it's sufficient to check west.
        if (isNitro[6] === isNitro[7])
          return output.counterclock!();
        return output.clockwise!();
      },
      outputStrings: {
        clockwise: {
          en: 'Rotate Clockwise',
          de: 'Im Uhrzeigersinn rotieren',
          fr: 'Tournez dans le sens horaire',
          cn: '顺时针转',
          ko: '시계방향',
        },
        counterclock: {
          en: 'Rotate Counterclockwise',
          de: 'Gegen den Uhrzeigersinn rotieren',
          fr: 'Tournez dans le sens anti-horaire',
          cn: '逆时针转',
          ko: '반시계방향',
        },
      },
    },
    {
      id: 'EmeraldEx Aire Tam Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['558F', '55D0'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['558F', '55D0'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['558F', '55D0'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['558F', '55D0'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['558F', '55D0'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: ['558F', '55D0'], capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Red Circle',
          de: 'Weg vom roten Kreis',
          fr: 'Éloignez-vous du cercle rouge',
          cn: '远离红圈',
          ko: '빨간 장판에서 멀리 떨어지기',
        },
      },
    },
    {
      id: 'EmeraldEx Magitek Magnetism',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5594', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5594', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5594', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5594', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5594', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '5594', capture: false }),
      delaySeconds: 9,
      durationSeconds: 6,
      alertText: (data, _matches, output) => {
        // Suppress first magnetism call for tanks, who are handling flares.
        if (!data.seenMines && data.role === 'tank')
          return;
        return output.text!();
      },
      run: (data) => data.seenMines = true,
      outputStrings: {
        text: {
          en: 'Get Near Same Polarity Mines',
          de: 'Nahe den Bomben mit gleicher Polarisierung',
          fr: 'Allez vers les mines de même polarité',
          ja: '同じ極性の爆雷に近づく',
          cn: '靠近同级地雷',
          ko: '같은 극성 폭탄쪽으로',
        },
      },
    },
    {
      id: 'EmeraldEx Divide Et Impera P1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5537', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5537', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5537', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5537', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5537', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '5537', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.sharedTankStack!();
        return output.spread!();
      },
      outputStrings: {
        spread: Outputs.spread,
        ...sharedOutputStrings,
      },
    },
    {
      id: 'EmeraldEx Magitek Magnetism Flare',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'EmeraldEx Magitek Magnetism Bait',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Lines Away From Safe Spot',
          de: 'Linien weg vom Safespot ködern',
          fr: 'Orientez les lignes hors de la zone safe',
          ja: '線を安置に被らないように捨てる',
          cn: '诱导直线，不要覆盖安全点',
          ko: '안전지대 밖으로 장판 유도',
        },
      },
    },
    {
      id: 'EmeraldEx Expire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55[D9]1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55[D9]1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55[D9]1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55[D9]1', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55[D9]1', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55[D9]1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'EmeraldEx Divide Et Impera P2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '555B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '555B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '555B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '555B', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '555B', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '555B', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.sharedTankStack!();
        return output.protean!();
      },
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Positions',
          ja: '8方向散開',
          cn: '分散站位',
          ko: '정해진 위치로 산개',
        },
        ...sharedOutputStrings,
      },
    },
    {
      id: 'EmeraldEx Primus Terminus Est',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00F[9ABC]' }),
      condition: (data, matches) => {
        (data.primusPlayers ??= []).push(matches.target);
        return data.me === matches.target;
      },
      alertText: (_data, matches, output) => {
        const id = matches.id.toUpperCase();
        if (id === '00F9')
          return output.text!({ dir: output.south!() });
        if (id === '00FA')
          return output.text!({ dir: output.west!() });
        if (id === '00FB')
          return output.text!({ dir: output.north!() });
        if (id === '00FC')
          return output.text!({ dir: output.east!() });
      },
      outputStrings: {
        text: {
          en: 'Go ${dir}, Aim Across',
          de: 'Geh nach ${dir}, schau Gegenüber',
          fr: 'Allez direction ${dir}, visez en face',
          cn: '去${dir}, 看好对面',
          ko: '${dir}으로 이동, 반대쪽 확인',
        },
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
    },
    {
      id: 'EmeraldEx Primus Terminus Est Dodge',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00F[9ABC]', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (!data.primusPlayers?.includes(data.me))
          return output.text!();
      },
      run: (data) => delete data.primusPlayers,
      outputStrings: {
        text: {
          en: 'Dodge Arrow Lines',
          de: 'Weiche den Pfeillinien aus',
          fr: 'Esquivez les lignes fléchées',
          cn: '避开箭头路径',
          ko: '화살표 방향 피하기',
        },
      },
    },
    {
      id: 'EmeraldEx Tertius Terminus Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55CC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55CC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55CC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55CC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55CC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55CC', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => delete data.tertius,
      outputStrings: {
        text: {
          en: 'Watch for Swords',
          de: 'Schau nach den Schwertern',
          fr: 'Repérez les épées',
          cn: '观察剑',
          ko: '칼 떨어지는 위치 보기',
        },
      },
    },
    {
      id: 'EmeraldEx Tertius Terminus Est',
      // StartsUsing has positions but is inconsistent when entities are newly moved.
      // We provide more time by using logic to predict where the last two
      // swords will drop.
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ source: 'BitBlade', id: '55CD' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Revolverklingen-Arm', id: '55CD' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Pistolame Volante', id: '55CD' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'ガンブレードビット', id: '55CD' }),
      netRegexCn: NetRegexes.abilityFull({ source: '枪刃浮游炮', id: '55CD' }),
      netRegexKo: NetRegexes.abilityFull({ source: '건블레이드 비트', id: '55CD' }),
      durationSeconds: 9,
      alertText: (data, matches, output) => {
        (data.tertius ??= []).push(matches);
        if (data.tertius.length !== 4)
          return;

        const [s0, s1, s2, s3] = data.tertius.map((sword) => {
          const x = parseFloat(sword.x) - centerX;
          const y = parseFloat(sword.y) - centerY;
          if (Math.abs(x) < 10 && Math.abs(y) < 10)
            return output.middle!();
          if (x < 0)
            return y < 0 ? output.dirNW!() : output.dirSW!();
          return y < 0 ? output.dirNE!() : output.dirSE!();
        });

        // We know that the swords will land in all 4 corners plus twice in
        // the center areas. Predict the last two swords by removing the
        // ones we've already gotten.
        const spawns: string[] = [output.dirNE!(), output.dirNW!(), output.dirSE!(), output.dirSW!(), output.middle!(), output.middle!()];

        const [s4, s5] = spawns.filter((x) => ![s0, s1, s2, s3].includes(x));

        if (!s0 || !s1 || !s2 || !s3 || !s4 || !s5)
          throw new UnreachableCode();
        // A pair of swords s0/s1, s2/s3, s4/s5 is either two intercard corners or two middle.
        // The second pair (s2/s3) is never the middle pair of swords.
        // Therefore, if the first two are not the same, they are not the middle
        // and so the first safe is the middle set of swords (s4, s5).
        const firstSafeIsMiddle = s0 !== s1;
        if (firstSafeIsMiddle)
          return output.middleFirst!({ middle: s4, dir1: s0, dir2: s1 });
        return output.middleLast!({ middle: s0, dir1: s4, dir2: s5 });
      },
      outputStrings: {
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
        middle: Outputs.middle,
        middleFirst: {
          en: '${middle} -> ${dir1} / ${dir2}',
          de: '${middle} -> ${dir1} / ${dir2}',
          fr: '${middle} -> ${dir1} / ${dir2}',
          cn: '${middle} -> ${dir1} / ${dir2}',
          ko: '${middle} -> ${dir1} / ${dir2}',
        },
        middleLast: {
          en: '${dir1} / ${dir2} -> ${middle}',
          de: '${dir1} / ${dir2} -> ${middle}',
          fr: '${dir1} / ${dir2} -> ${middle}',
          cn: '${dir1} / ${dir2} -> ${middle}',
          ko: '${dir1} / ${dir2} -> ${middle}',
        },
      },
    },
    {
      id: 'EmeraldEx Sidescathe Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D5', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55D5', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55D5', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'EmeraldEx Sidescathe Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55D4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55D4', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'EmeraldEx Emerald Crusher',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D6', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55D6', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '에메랄드 웨폰', id: '55D6', capture: false }),
      // Don't collide with Tertius Terminus Est alert, and this is important.
      response: Responses.knockback('alarm'),
    },
    {
      id: 'EmeraldEx Secundus Terminus Est Plus',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00FD' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Intercard + Out (Plus)',
          de: 'Interkardinal + Raus (Plus)',
          fr: 'Intercardinal + Extérieur (Plus)',
          cn: '去场边角落 (十字)',
          ko: '대각선 밖으로 (십자)',
        },
      },
    },
    {
      id: 'EmeraldEx Secundus Terminus Est Cross',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00FE' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cardinal + Out (Cross)',
          de: 'Kardinal + Raus (Kreuz)',
          fr: 'Cardinal + Extérieur (Croix)',
          cn: '去场边中点 (X字)',
          ko: '동서남북 밖으로 (X자)',
        },
      },
    },
    {
      id: 'EmeraldEx Magitek Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Reaper Image', id: '55BE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schnitter-Projektion', id: '55BE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Spectre De Faucheuse', id: '55BE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リーパーの幻影', id: '55BE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '魔导死神的幻影', id: '55BE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '리퍼의 환영', id: '55BE', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'EmeraldEx Full Rank',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Black Wolf\'s Image', id: '55C0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Gaius-Projektion', id: '55C0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Spectre De Gaius', id: '55C0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガイウスの幻影', id: '55C0', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '盖乌斯的幻影', id: '55C0', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가이우스의 환영', id: '55C0', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go North; Dodge Soldiers/Divebombs',
          de: 'Geh nach Norden; Achte auf die Lücken zwischen den Soldaten',
          fr: 'Allez au Nord, esquivez les soldats et les bombes plongeantes',
          ja: '飛行部隊と射撃部隊を見覚える', // FIXME
          cn: '去北边；躲避士兵射击/飞机轰炸',
          ko: '북쪽으로 이동, 엑사플레어, 병사 사격 확인',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Emerald Crusher / Aire Tam Storm': 'Crusher / Aire Tam',
        'Aire Tam Storm / Emerald Crusher': 'Aire Tam / Crusher',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'bitblade': 'Revolverklingen-Arm',
        'Black Wolf\'s Image': 'Gaius-Projektion',
        'Imperial Image': 'garleisch(?:e|er|es|en) Soldat',
        'Reaper Image': 'Schnitter-Projektion',
        'The Emerald Weapon': 'Smaragd-Waffe',
      },
      'replaceText': {
        '--cutscene--': '--Zwischensequence--',
        'Aetheroplasm Production': 'Blitzgenerator',
        'Aire Tam Storm': 'Smaragdfeuersturm',
        'Bit Storm': 'Satellitenarme: Zirkelangriff',
        'Divide Et Impera': 'Divide et Impera',
        'Emerald Beam': 'Smaragdstrahl',
        'Emerald Shot': 'Smaragdschuss',
        'Expire': 'Exspirieren',
        'Heirsbane': 'Erbenbann',
        'Legio Phantasmatis': 'Legio Phantasmatis',
        'Magitek Cannon': 'Magitek-Kanone',
        'Magitek Magnetism': 'Magimagnetismus',
        'Optimized Ultima': 'Ultima-System',
        'Photon Ring': 'Photonenkreis',
        'Primus Terminus Est': 'Terminus Est: Unus',
        'Secundus Terminus Est': 'Terminus Est: Duo',
        'Shots Fired': 'Synchron-Salve',
        'Sidescathe': 'Flankenbeschuss',
        'Split': 'Segregation',
        'Tertius Terminus Est': 'Terminus Est: Tres',
        'Mechanized Maneuver': 'Bewegungsmanöver',
        'Bombs Away': 'Bombardierungsbefehl',
        'Emerald Crusher': 'Smaragdspalter',
        'Full Rank': 'Truppenappell',
        'Final Formation': 'Schlachtreihe',
        'Fatal Fire': 'Feuergefecht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'bitblade': 'pistolame volante',
        'Black Wolf\'s Image': 'spectre de Gaius',
        'Imperial Image': 'spectre de soldat impérial',
        'Reaper Image': 'spectre de faucheuse',
        'The Emerald Weapon': 'Arme Émeraude',
      },
      'replaceText': {
        '--cutscene--': '--cinématique--',
        'Aetheroplasm Production': 'Condensation d\'éthéroplasma',
        'Aire Tam Storm(?! /)': 'Aire Tam Storm',
        'Aire Tam Storm / Emerald Crusher': 'Aire Tam / Écraseur',
        'Bit Storm': 'Salve circulaire',
        'Divide Et Impera': 'Divide Et Impera',
        'Emerald Beam': 'Rayon émeraude',
        'Emerald Crusher / Aire Tam Storm': 'Écraseur / Aire Tam',
        'Emerald Shot': 'Tir émeraude',
        'Expire': 'Jet de plasma',
        'Heirsbane': 'Fléau de l\'héritier',
        'Legio Phantasmatis': 'Legio Phantasmatis',
        'Magitek Cannon': 'Canon magitek',
        'Magitek Magnetism': 'Électroaimant magitek',
        'Optimized Ultima': 'Ultima magitek',
        'Photon Ring': 'Cercle photonique',
        'Primus Terminus Est': 'Terminus Est : Unus',
        'Secundus Terminus Est': 'Terminus Est : Duo',
        'Shots Fired': 'Fusillade',
        'Sidescathe': 'Salve latérale',
        'Split': 'Séparation',
        'Tertius Terminus Est': 'Terminus Est : Tres',
        'Mechanized Maneuver': 'Murmuration stratégique',
        'Bombs Away': 'Ordre de bombardement',
        'Full Rank': 'Regroupement de toutes les unités',
        'Final Formation': 'Alignement de toutes les unités',
        'Fatal Fire': 'Attaque groupée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'bitblade': 'ガンブレードビット',
        'Black Wolf\'s Image': 'ガイウスの幻影',
        'Imperial Image': '帝国兵の幻影',
        'Reaper Image': 'リーパーの幻影',
        'The Emerald Weapon': 'エメラルドウェポン',
      },
      'replaceText': {
        '--cutscene--': '--カットシーン--',
        'Aetheroplasm Production': '爆雷生成',
        'Aire Tam Storm': 'エメラルドビッグバン',
        'Bit Storm': 'アームビット：円形射撃',
        'Divide Et Impera': 'ディヴィデ・エト・インペラ',
        'Emerald Beam': 'エメラルドビーム',
        'Emerald Shot': 'エメラルドショット',
        'Expire': '噴射',
        'Heirsbane': 'No.IX',
        'Legio Phantasmatis': 'レギオ・ファンタズマティス',
        'Magitek Cannon': '魔導カノン',
        'Magitek Magnetism': '魔導マグネット',
        'Optimized Ultima': '魔導アルテマ',
        'Photon Ring': 'フォトンサークル',
        'Primus Terminus Est': 'ターミナス・エスト：ウーヌス',
        'Secundus Terminus Est': 'ターミナス・エスト：ドゥオ',
        'Shots Fired': '一斉掃射',
        'Sidescathe': '側面掃射',
        'Split': '分離',
        'Tertius Terminus Est': 'ターミナス・エスト：トレース',
        'Mechanized Maneuver': '機動戦術',
        'Bombs Away': '空爆命令',
        'Emerald Crusher': 'エメラルドクラッシャー',
        'Full Rank': '全軍集結',
        'Final Formation': '全軍整列',
        'Fatal Fire': '全軍攻撃',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'bitblade': '枪刃浮游炮',
        'Black Wolf\'s Image': '盖乌斯的幻影',
        'Imperial Image': '帝国兵的幻影',
        'Reaper Image': '魔导死神的幻影',
        'The Emerald Weapon': '绿宝石神兵',
      },
      'replaceText': {
        '--cutscene--': '--过场动画--',
        'Aetheroplasm Production': '生成炸弹',
        'Aire Tam Storm': '绿宝石大爆炸',
        'Bit Storm': '浮游炮：圆形射击',
        'Divide Et Impera': '分而治之',
        'Emerald Beam': '绿宝石光束',
        'Emerald Shot': '绿宝石射击',
        'Expire': '喷射',
        'Heirsbane': '遗祸',
        'Legio Phantasmatis': '幻影军团',
        'Magitek Cannon': '魔导加农炮',
        'Magitek Magnetism': '魔导磁石',
        'Optimized Ultima': '魔导究极',
        'Photon Ring': '光子环',
        'Primus Terminus Est': '恩惠终结：壹',
        'Secundus Terminus Est': '恩惠终结：贰',
        'Shots Fired': '一齐扫射',
        'Sidescathe': '侧面扫射',
        'Split': '分离',
        'Tertius Terminus Est': '恩惠终结：叁',
        'Mechanized Maneuver': '机动战术',
        'Bombs Away': '轰炸命令',
        'Emerald Crusher': '绿宝石碎击',
        'Full Rank': '全军集合',
        'Final Formation': '全军列队',
        'Fatal Fire': '全军攻击',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'bitblade': '건블레이드 비트',
        'Black Wolf\'s Image': '가이우스의 환영',
        'Imperial Image': '제국 병사의 환영',
        'Reaper Image': '리퍼의 환영',
        'The Emerald Weapon': '에메랄드 웨폰',
      },
      'replaceText': {
        '--cutscene--': '--컷신--',
        'Aetheroplasm Production': '폭뢰 생성',
        'Aire Tam Storm': '에메랄드 대폭발',
        'Bit Storm': '암 비트: 원형 사격',
        'Divide Et Impera': '분할 통치',
        'Emerald Beam': '에메랄드 광선',
        'Emerald Shot': '에메랄드 발사',
        'Expire': '분사',
        'Heirsbane': '제IX호',
        'Legio Phantasmatis': '환영 군단',
        'Magitek Cannon': '마도포',
        'Magitek Magnetism': '마도 자석',
        'Optimized Ultima': '마도 알테마',
        'Photon Ring': '광자 고리',
        'Primus Terminus Est': '파멸의 종착역 I',
        'Secundus Terminus Est': '파멸의 종착역 II',
        'Shots Fired': '일제 소사',
        'Sidescathe': '측면 소사',
        'Split': '분리',
        'Tertius Terminus Est': '파멸의 종착역 III',
        'Mechanized Maneuver': '기동 전술',
        'Bombs Away': '공중 폭격 명령',
        'Emerald Crusher': '에메랄드 분쇄',
        'Full Rank': '전군 집결',
        'Final Formation': '전군 정렬',
        'Fatal Fire': '전군 공격',
      },
    },
  ],
};

export default triggerSet;
