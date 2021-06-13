import Util from '../../../../../resources/util';
import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: Fix headmarkers for groups running multiple of the same job ?

// Note: there's no headmarker ability line for cleaving shadows.

const directions = {
  north: Outputs.north,
  south: Outputs.south,
  east: Outputs.east,
  west: Outputs.west,
};

export default {
  zoneId: ZoneId.EdensPromiseLitanySavage,
  timelineFile: 'e10s.txt',
  triggers: [
    {
      id: 'E10S Deepshadow Nova',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '573E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '573E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '573E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '573E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '573E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '573E', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E10S Implosion Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F0', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56F0', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56F0', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shadow Side',
          de: 'Schatten Seite',
          fr: 'Allez du côté de l\'ombre',
          ja: '影と同じ側へ',
          cn: '影子同侧',
          ko: '그림자 쪽으로',
        },
      },
    },
    {
      id: 'E10S Implosion Tail',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F3', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56F3', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56F3', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Opposite Shadow',
          de: 'Gegenüber des Schattens',
          fr: 'Allez du côté opposé à l\'ombre',
          ja: '影の反対側へ',
          cn: '影子异侧',
          ko: '그림자 반대쪽으로',
        },
      },
    },
    {
      id: 'E10S Throne Of Shadow',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5717', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5717', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5717', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5717', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5717', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5717', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E10S Giga Slash Shadow Single Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56EA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56EA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56EA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56EA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56EA', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56EA', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Left of Shadow',
          de: 'Geh links vom Schatten',
          fr: 'Allez à gauche de l\'ombre',
          ja: '影の左へ',
          cn: '影子左侧',
          ko: '그림자 왼쪽으로',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Single Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56ED', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56ED', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56ED', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56ED', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56ED', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56ED', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Right of Shadow',
          de: 'Geh rechts vom Schatten',
          fr: 'Allez à droite de l\'ombre',
          ja: '影の右へ',
          cn: '影子右侧',
          ko: '그림자 오른쪽으로',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Quadruple Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56F4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56F4', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Left of Shadows',
          de: 'Geh links vom Schatten',
          fr: 'Allez à gauche des ombres',
          ja: '影の左へ',
          cn: '影子左侧',
          ko: '그림자 왼쪽',
        },
      },
    },
    {
      id: 'E10S Giga Slash Shadow Quadruple Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56F8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56F8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56F8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56F8', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56F8', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56F8', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Right of Shadows',
          de: 'Geh rechts vom Schatten',
          fr: 'Allez à droite des ombres',
          ja: '影の右へ',
          cn: '影子右侧',
          ko: '그림자 오른쪽',
        },
      },
    },
    {
      id: 'E10S Umbra Smash',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BAA' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5BAA' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5BAA' }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5BAA' }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5BAA' }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5BAA' }),
      condition: Conditions.caresAboutPhysical(),
      // Although this is a swap, use `tankBuster` here to give the off tank a warning and a chance
      // to shield the main tank.  The offtank swap is delayed into the swap trigger below.
      response: Responses.tankBuster(),
      run: (data, matches) => data.umbraTarget = matches.target,
    },
    {
      id: 'E10S Umbra Smash Offtank Swap',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BAA' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5BAA' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5BAA' }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5BAA' }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5BAA' }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5BAA' }),
      condition: (data, matches) => data.role === 'tank' && matches.target !== data.me,
      // This is a four hit tankbuster with a wind-up castbar.
      // If you provoke in between the four hits, you can end up taking a hit, so the offtank
      // needs to wait until all four hits have been applied (or something roughly there).
      // Therefore, need a delay that is a good balance of "warning ahead of time" and
      // "not so soon that the offtank steals the 4th hit".  For reference:
      //   * 3rd hit = 7.3 seconds after cast starts
      //   * 4th hit = 8.9 seconds after cast starts
      // TODO: verify that the 4th hit is locked in with this delay (or if it could be shorter)
      delaySeconds: 8.5,
      response: Responses.tankBusterSwap('alert', 'alert'),
      run: (data, matches) => data.umbraTarget = matches.target,
    },
    {
      id: 'E10S Darkness Unleashed',
      // Cast on self, with no player target.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B0E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B0E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B0E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5B0E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5B0E', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.me === data.umbraTarget)
          return output.avoidStack();
        return output.stack();
      },
      outputStrings: {
        avoidStack: {
          en: 'Avoid Stack!',
          de: 'Nicht Sammeln!',
          fr: 'Ne vous packez pas !',
          ja: '重ならない！',
          cn: '不要重合!',
          ko: '공격 피하기',
        },
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'E10S Shadow\'s Edge',
      // Cast on self, with no player target.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0C' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B0C' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B0C' }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B0C' }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5B0C' }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5B0C' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'E10S Giga Slash Shadow Drop Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B2D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B2D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B2D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B2D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5B2D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5B2D', capture: false }),
      durationSeconds: (data) => data.gigaSlashCleaveDebuffDuration,
      alertText: (data, _matches, output) => {
        let ret = '';
        switch (data.gigaSlashCleaveDebuffId) {
        case '973':
          ret = output.west();
          break;
        case '974':
          ret = output.east();
          break;
        case '975':
          ret = output.north();
          break;
        case '976':
          ret = output.south();
          break;
        }

        delete data.gigaSlashCleaveDebuffId;
        delete data.gigaSlashCleaveDebuffDuration;
        if (!ret)
          return;

        return output.dropShadow({ dir: ret });
      },
      infoText: (_data, _matches, output) => output.leftCleave(),
      outputStrings: {
        dropShadow: {
          en: 'Drop Shadow ${dir}',
          de: 'Schatten im ${dir} ablegen',
          fr: 'Déposez l\'ombre du côté ${dir}',
          ja: '${dir}へ、影を捨てる',
          cn: '${dir}放影子',
          ko: '${dir}에 그림자 놓기',
        },
        leftCleave: {
          en: 'Left Cleave',
          de: 'Linker Cleave',
          fr: 'Cleave gauche',
          ja: '左半面へ攻撃',
          cn: '左侧顺劈',
          ko: '왼쪽 공격',
        },
        ...directions,
      },
    },
    {
      id: 'E10S Giga Slash Shadow Drop Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B2C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5B2C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5B2C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5B2C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5B2C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5B2C', capture: false }),
      durationSeconds: (data) => data.gigaSlashCleaveDebuffDuration,
      alertText: (data, _matches, output) => {
        let ret = '';
        switch (data.gigaSlashCleaveDebuffId) {
        case '973':
          ret = output.east();
          break;
        case '974':
          ret = output.west();
          break;
        case '975':
          ret = output.south();
          break;
        case '976':
          ret = output.north();
          break;
        }

        delete data.gigaSlashCleaveDebuffId;
        delete data.gigaSlashCleaveDebuffDuration;
        if (!ret)
          return;

        return output.dropShadow({ dir: ret });
      },
      infoText: (_data, _matches, output) => output.rightCleave(),
      outputStrings: {
        dropShadow: {
          en: 'Drop Shadow ${dir}',
          de: 'Schatten im ${dir} ablegen',
          fr: 'Déposez l\'ombre du côté ${dir}',
          ja: '${dir}へ、影を捨てる',
          cn: '${dir}放影子',
          ko: '${dir}에 그림자 놓기',
        },
        rightCleave: {
          en: 'Right Cleave',
          de: 'Rechter Cleave',
          fr: 'Cleave droit',
          ja: '右半面へ攻撃',
          cn: '右侧顺劈',
          ko: '오른쪽 공격',
        },
        ...directions,
      },
    },
    {
      id: 'E10S Shadow Servant Cleave Drop',
      netRegex: NetRegexes.gainsEffect({ effectId: '97[3456]' }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.gigaSlashCleaveDebuffId = matches.effectId;
        data.gigaSlashCleaveDebuffDuration = parseFloat(matches.duration);
      },
    },
    {
      id: 'E10S Shadow Servant Get In',
      netRegex: NetRegexes.gainsEffect({ effectId: '9D6', capture: false }),
      // The effect lasts two seconds, use the difference of the two
      // instead of telling the bound people to get in instantly.
      delaySeconds: 1,
      suppressSeconds: 1,
      response: Responses.getIn(),
    },
    {
      id: 'E10S Shadow Cleave',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5718', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5718', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5718', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5718', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5718', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5718', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.clones = true,
      outputStrings: {
        text: {
          en: 'Drop Shadow Out',
          de: 'Schatten draußen ablegen',
          fr: 'Déposez l\'ombre à l\'extérieur',
          ja: '影を外周に捨てる',
          cn: '影子放到外圈',
          ko: '바깥쪽에 그림자 떨어뜨리기',
        },
      },
    },
    {
      // This checks your shadow's job against your job, since your shadow has
      // the same job as you. If there's multiple of one job, or a shadow has
      // a job of 0 (player died), then return '?' for the affected players.
      id: 'E10S Shadow Of A Hero',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Shadow Of A Hero' }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: 'Schatten Eines Helden' }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: 'Ombre De Héros' }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: '英雄の影' }),
      netRegexCn: NetRegexes.addedCombatantFull({ name: '英雄之影' }),
      netRegexKo: NetRegexes.addedCombatantFull({ name: '영웅의 그림자' }),
      condition: (data) => data.clones,
      run: (data, matches) => {
        data.myClone = data.myClone || [];
        const clonesJob = parseInt(matches.job, 16);
        if (clonesJob === Util.jobToJobEnum(data.job))
          data.myClone.push(matches.id.toUpperCase());
      },
    },
    {
      id: 'E10S Shadow Of A Hero Head Marker Map',
      netRegex: NetRegexes.headMarker({ target: 'Shadow Of A Hero' }),
      netRegexDe: NetRegexes.headMarker({ target: 'Schatten Eines Helden' }),
      netRegexFr: NetRegexes.headMarker({ target: 'Ombre De Héros' }),
      netRegexJa: NetRegexes.headMarker({ target: '英雄の影' }),
      netRegexCn: NetRegexes.headMarker({ target: '英雄之影' }),
      netRegexKo: NetRegexes.headMarker({ target: '영웅의 그림자' }),
      condition: (data) => !data.shadowMarkerMap,
      suppressSeconds: 1,
      run: (data, matches) => {
        data.shadowMarkerMap = {};
        const idPivot = parseInt(matches.id, 16);
        for (let i = 0; i < 3; ++i) {
          const hexPivot = (idPivot + i).toString(16).toUpperCase().padStart(4, '0');
          data.shadowMarkerMap[hexPivot] = i + 1;
        }
      },
    },
    {
      id: 'E10S Shadow Of A Hero Head Marker',
      netRegex: NetRegexes.headMarker({ target: 'Shadow Of A Hero' }),
      netRegexDe: NetRegexes.headMarker({ target: 'Schatten Eines Helden' }),
      netRegexFr: NetRegexes.headMarker({ target: 'Ombre De Héros' }),
      netRegexJa: NetRegexes.headMarker({ target: '英雄の影' }),
      netRegexCn: NetRegexes.headMarker({ target: '英雄之影' }),
      netRegexKo: NetRegexes.headMarker({ target: '영웅의 그림자' }),
      condition: (data) => !data.headMarkerTriggered,
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        if (!data.myClone || data.myClone.length !== 1) {
          data.headMarkerTriggered = true;
          return output.unknown();
        }
        if (matches.targetId === data.myClone[0]) {
          data.headMarkerTriggered = true;
          return output[data.shadowMarkerMap[matches.id]]();
        }
      },
      outputStrings: {
        '1': Outputs.num1,
        '2': Outputs.num2,
        '3': Outputs.num3,
        'unknown': Outputs.unknown,
      },
    },
    {
      id: 'E10S Dualspell 1',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '573A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '573A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '573A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '573A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '573A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '573A', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '1 out, 2+3 in',
          de: '1 raus, 2+3 rein',
          fr: '1 extérieur, 2+3 intérieur',
          ja: '1番入らない、2/3番入る',
          cn: '麻将1出，2+3进',
          ko: '1 바깥, 2+3 안쪽',
        },
      },
    },
    {
      id: 'E10S Dualspell 2',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '573A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schattenkönig', id: '573A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Roi De L\'Ombre', id: '573A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '影の王', id: '573A', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '影之王', id: '573A', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '그림자의 왕', id: '573A', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '2 out, 1+3 in',
          de: '2 raus, 1+3 rein',
          fr: '2 extérieur, 1+3 intérieur',
          ja: '2番入らない、1/3番入る',
          cn: '麻将2出，1+3进',
          ko: '2 바깥, 1+3 안쪽',
        },
      },
    },
    {
      id: 'E10S Dualspell 3',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '573A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schattenkönig', id: '573A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Roi De L\'Ombre', id: '573A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '影の王', id: '573A', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '影之王', id: '573A', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '그림자의 왕', id: '573A', capture: false }),
      delaySeconds: 3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '3 out, 1+2 in',
          de: '3 raus, 1+2 rein',
          fr: '3 extérieur, 1+2 intérieur',
          ja: '3番入らない、1/2番入る',
          cn: '麻将3出，1+2进',
          ko: '3 바깥, 1+2 안쪽',
        },
      },
    },
    {
      id: 'E10S Shadowkeeper 1',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5720', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5720', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5720', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5720', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5720', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5720', capture: false }),
      suppressSeconds: 99999,
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => delete data.clones,
      outputStrings: {
        text: {
          en: 'Drop Shadow Out',
          de: 'Schatten draußen ablegen',
          fr: 'Déposez l\'ombre à l\'extérieur',
          ja: '影を外周に捨てる',
          cn: '影子放到外圈',
          ko: '바깥쪽에 그림자 떨어뜨리기',
        },
      },
    },
    {
      id: 'E10S Swath of Silence',
      netRegex: NetRegexes.startsUsing({ source: 'Shadow Of A Hero', id: '5BBF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schatten Eines Helden', id: '5BBF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ombre De Héros', id: '5BBF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '英雄の影', id: '5BBF', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '英雄之影', id: '5BBF', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '영웅의 그림자', id: '5BBF', capture: false }),
      suppressSeconds: 3,
      response: Responses.moveAway(),
    },
    {
      id: 'E10S Distant Scream',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5716', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5716', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5716', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5716', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5716', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5716', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E10S Umbral Orbs',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5731', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5731', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5731', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5731', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5731', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5731', capture: false }),
      // TODO: maybe 4?
      delaySeconds: 3.5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orbs',
          de: 'Orbs',
          fr: 'Orbes',
          ja: '玉',
          cn: '球',
          ko: '구슬',
        },
      },
    },
    {
      id: 'E10S Shadow Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5739', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5739', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5739', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5739', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5739', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5739', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Watch Tethered Dog',
          de: 'Achte auf den verbundenen Hund',
          fr: 'Regardez le chien lié',
          ja: '線で繋がった分身を注視',
          cn: '找连线的狗',
          ko: '연결된 쫄 지켜보기',
        },
      },
    },
    {
      id: 'E10S Fade To Shadow',
      // Fade To Shadow starts well before the Cloak of Shadows, so use that instead for initial.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '572B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '572B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '572B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '572B', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '572B', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '572B', capture: false }),
      delaySeconds: 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this could be better if we knew where the shadow was
          // TODO: this also happens twice, with tethers
          en: 'Be On Squiggles',
          de: 'Sei auf den geschwungenen Linien',
          fr: 'Allez sur l\'ombre tordue',
          ja: '曲線上待機',
          cn: '站到连线为曲线的一侧',
          ko: '구불구불한 선 쪽으로',
        },
      },
    },
    {
      id: 'E10S Cloak Of Shadows',
      // 5B13/5B14 Cloak Of Shadows both start casting at the same time but go off separately.
      // So, use the initial 5B13 hit to time the move away trigger.
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '5B13', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schattenkönig', id: '5B13', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Roi De L\'Ombre', id: '5B13', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '影の王', id: '5B13', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '影之王', id: '5B13', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '그림자의 왕', id: '5B13', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Squiggles',
          de: 'Weg von den geschwungenen Linien',
          fr: 'Éloignez-vous de l\'ombre tordue',
          ja: '安置へ',
          cn: '远离连线为曲线的一侧',
          ko: '곧은 선 쪽으로',
        },
      },
    },
    {
      // TODO: I saw once a 5700 then 5702 for the second implosion at 452.7
      // TODO: are the double implosions always the same??
      id: 'E10S Quadruple Implosion Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '56FC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '56FC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '56FC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '56FC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '56FC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '56FC', capture: false }),
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shadow Side',
          de: 'Schatten Seite',
          fr: 'Allez du côté de l\'ombre',
          ja: '影と同じ側へ',
          cn: '影子同侧',
          ko: '그림자 쪽으로',
        },
      },
    },
    {
      id: 'E10S Quadruple Implosion Tail',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5700', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5700', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5700', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5700', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5700', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5700', capture: false }),
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Opposite Shadow',
          de: 'Gegenüber des Schattens',
          fr: 'Allez du côté opposé à l\'ombre',
          ja: '影の反対側へ',
          cn: '影子异侧',
          ko: '그림자 반대쪽',
        },
      },
    },
    {
      id: 'E10S Voidgate',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5734', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5734', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5734', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5734', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5734', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5734', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleaves with towers',
          de: 'Cleaves mit Türmen',
          fr: 'Cleaves avec Tours',
          ja: '従僕 + 塔',
          cn: '影子+塔',
          ko: '기둥이랑 그림자 유도 동시에',
        },
      },
    },
    {
      id: 'E10S Voidgate Second Tower',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5734', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5734', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5734', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5734', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5734', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5734', capture: false }),
      delaySeconds: 23.3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Towers first, then cleaves',
          de: 'Zuerst Türme, dann cleaves',
          fr: 'Tours en premier puis cleaves',
          ja: 'まずは塔、そして従僕',
          cn: '先塔后影子',
          ko: '기둥 먼저, 그다음 그림자 유도',
        },
      },
    },
    {
      id: 'E10S Pitch Bog',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5721', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5721', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5721', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5721', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5721', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5721', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.seenPitchBog)
          return output.secondPitchBog();
        return output.firstPitchBog();
      },
      run: (data) => data.seenPitchBog = true,
      outputStrings: {
        firstPitchBog: {
          en: 'Puddles outside',
          de: 'Flächen nach draußen',
          fr: 'Zones au sol à l\'extérieur',
          ja: '外周に捨てる',
          cn: '点名放到外圈',
          ko: '장판 바깥쪽에 깔기',
        },
        secondPitchBog: {
          en: 'Final Puddle Positions',
          de: 'Flächen interkardinal ablegen',
          fr: 'Zones au sol en intercardinal',
          ja: '最後のスワンプ',
          cn: '最后一次点名放到外圈',
          ko: '각자 장판 위치로',
        },
      },
    },
    {
      id: 'E10S Shackled Apart',
      netRegex: NetRegexes.tether({ id: '0082' }),
      condition: (data, matches) => matches.source === data.me || matches.target === data.me,
      alertText: (data, matches, output) => {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.text({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: Outputs.farTethersWithPlayer,
      },
    },
    {
      id: 'E10S Shackled Together',
      netRegex: NetRegexes.tether({ id: '0081' }),
      condition: (data, matches) => matches.source === data.me || matches.target === data.me,
      alertText: (data, matches, output) => {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.text({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: Outputs.closeTethersWithPlayer,
      },
    },
    {
      // TODO: this mechanic needs a lot more love
      id: 'E10S Voidgate Amplifier',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BCF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schattenkönig', id: '5BCF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Roi De L\'Ombre', id: '5BCF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '影の王', id: '5BCF', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '影之王', id: '5BCF', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '그림자의 왕', id: '5BCF', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pick up Puddles',
          de: 'Fläche nehmen',
          fr: 'Prenez les zones au sol',
          ja: 'スワンプを踏む',
          cn: '踩放下的沼泽',
          ko: '장판 밟아서 그림자 선 가져오기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Shadowkeeper': 'Schattenkönig',
        'Shadow Of A Hero': 'Schatten eines Helden',
        'Shadefire': 'Schattenfeuer',
      },
      'replaceText': {
        'Deepshadow Nova': 'Dunkelschatten-Nova',
        'Implosion': 'Implosion',
        'Throne Of Shadow': 'Schattenthron',
        'Giga Slash': 'Giga-Schlag',
        'Umbra Smash': 'Schattenschlag',
        'Darkness Unleashed': 'Schattenentfesselung',
        'Shadow\'s Edge': 'Schattenhieb',
        'Shadow Cleave': 'Schattenpein',
        'Dualspell': 'Doppelzauber',
        'Blighting Blitz': 'Vernichtungsaktion',
        'Shadowkeeper': 'Schattenkönig',
        'Swath Of Silence': 'Schwade der Stille',
        'Shadow Servant': 'Schattendiener',
        'Distant Scream': 'Ferner Schrei',
        'Umbral Orbs': 'Schattenkugel',
        'Flameshadow': 'Schattenflamme',
        'Spawn Shadow': 'Schattenerscheinung',
        'Shadow Warrior': 'Schattenkrieger',
        'Fade To Shadow': 'Schattenimmersion',
        'Cloak Of Shadows': 'Mantel des Schattens',
        'Voidgate(?! Amplifier)': 'Nichtsportal',
        'Void Pulse': 'Nichtspulsieren',
        'Pitch Bog': 'Schattensumpf',
        'Shackled Apart': 'Kettenbruch',
        'Voidgate Amplifier': 'Verstärktes Nichtsportal',
        'Shadowy Eruption': 'Schatteneruption',
        'Shackled Together': 'Schattenfesseln',
        'Doom Arc': 'Verhängnisvoller Bogen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Shadowkeeper': 'Ordre royal',
        'Shadow Of A Hero': 'ombre de héros',
        'Shadefire': 'Feu ombral',
      },
      'replaceText': {
        'Deepshadow Nova': 'Nova de la pleine-ombre',
        'Implosion': 'Implosion',
        'Throne Of Shadow': 'Trône de l\'Ombre',
        'Giga Slash': 'Taillade tournoyante',
        'Umbra Smash': 'Fracas ombral',
        'Darkness Unleashed': 'Déchaînement ombral',
        'Shadow\'s Edge': 'Taillade ombrale',
        'Shadow Cleave': 'Fendoir ombral',
        'Dualspell': 'Double sort',
        'Blighting Blitz': 'Frappe putréfiante',
        'Shadowkeeper': 'Ordre royal',
        'Swath Of Silence': 'Fauchage silencieux',
        'Shadow Servant': 'Serviteur de l\'Ombre',
        'Distant Scream': 'Hurlement de l\'Ombre',
        'Umbral Orbs': 'Orbe ombrale',
        'Flameshadow': 'Flamme ombrale',
        'Spawn Shadow': 'Ombres croissantes',
        'Shadow Warrior': 'Ombre du roi',
        'Fade To Shadow': 'Immersion abyssale',
        'Cloak Of Shadows': 'Cape de l\'Ombre',
        'Voidgate(?! Amplifier)': 'Porte du néant',
        'Void Pulse': 'Pulsation du néant',
        'Pitch Bog': 'Marais ombral',
        'Shackled Apart': 'Chaînes de rupture',
        'Voidgate Amplifier': 'Porte du néant amplifiée',
        'Shadowy Eruption': 'Éruption ombrale',
        'Shackled Together': 'Chaînes d\'union',
        'Doom Arc': 'Arc fatal',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Shadowkeeper': '影の王',
        'Shadow Of A Hero': '英雄の影',
        'Shadefire': 'シャドウファイア',
      },
      'replaceText': {
        'Deepshadow Nova': 'ディープシャドウノヴァ',
        'Implosion': 'インプロージョン',
        'Throne Of Shadow': '影の王権',
        'Giga Slash': 'ギガスラッシュ',
        'Umbra Smash': 'アンブラスマッシュ',
        'Darkness Unleashed': 'シャドウアンリーシュ',
        'Shadow\'s Edge': 'シャドウスラッシュ',
        'Shadow Cleave': 'シャドウクリーヴ',
        'Dualspell': 'ダブルスペル',
        'Blighting Blitz': 'ブライティングブリッツ',
        'Shadowkeeper': '影の王命',
        'Swath Of Silence': 'サイレントスアス',
        'Shadow Servant': '影の従僕',
        'Distant Scream': '影の遠吠え',
        'Umbral Orbs': 'アンブラルオーブ',
        'Flameshadow': 'シャドウフレイム',
        'Spawn Shadow': 'スポーンシャドウ',
        'Shadow Warrior': '影武者',
        'Fade To Shadow': '影潜り',
        'Cloak Of Shadows': 'クローク・オブ・シャドウ',
        'Voidgate(?! Amplifier)': 'ヴォイドゲート',
        'Void Pulse': 'ヴォイドパルセーション',
        'Pitch Bog': 'シャドウスワンプ',
        'Shackled Apart': '離別の鎖',
        'Voidgate Amplifier': 'ヴォイドゲート・アンプリファイア',
        'Shadowy Eruption': 'シャドウエラプション',
        'Shackled Together': '束縛の鎖',
        'Doom Arc': 'ドゥームアーク',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Shadowkeeper': '影之王',
        'Shadow Of A Hero': '英雄之影',
        'Shadefire': '影火炎',
      },
      'replaceText': {
        'Deepshadow Nova': '深影新星',
        'Implosion': '向心聚爆',
        'Throne Of Shadow': '影之王权',
        'Giga Slash': '十亿斩击',
        'Umbra Smash': '本影爆碎',
        'Darkness Unleashed': '释影',
        'Shadow\'s Edge': '影之斩击',
        'Shadow Cleave': '影裂',
        'Dualspell': '双重咏唱',
        'Blighting Blitz': '凋零闪击',
        'Shadowkeeper': '影之王命',
        'Swath Of Silence': '寂静斩痕',
        'Shadow Servant': '影仆从',
        'Distant Scream': '影之狂吠',
        'Umbral Orbs': '本影球',
        'Flameshadow': '影烈火',
        'Spawn Shadow': '影之增殖',
        'Shadow Warrior': '影武者',
        'Fade To Shadow': '潜影',
        'Cloak Of Shadows': '影之披风',
        'Voidgate(?! Amplifier)': '虚无之门',
        'Void Pulse': '虚无悸动',
        'Pitch Bog': '影之沼泽',
        'Shackled Apart': '离别之锁',
        'Voidgate Amplifier': '扩大虚无之门',
        'Shadowy Eruption': '影之喷发',
        'Shackled Together': '束缚之锁',
        'Doom Arc': '毁灭之弧',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Shadowkeeper': '그림자의 왕',
        'Shadow Of A Hero': '영웅의 그림자',
        'Shadefire': '그림자 불씨',
      },
      'replaceText': {
        'Deepshadow Nova': '암영 신성',
        'Implosion': '내파',
        'Throne Of Shadow': '그림자의 왕권',
        'Giga Slash': '기가 슬래시',
        'Umbra Smash': '그림자 타격',
        'Darkness Unleashed': '그림자 촉발',
        'Shadow\'s Edge': '그림자 참격',
        'Shadow Cleave': '그림자 가르기',
        'Dualspell': '이중 시전',
        'Blighting Blitz': '황폐화 맹공',
        'Shadowkeeper': '그림자의 왕명',
        'Swath Of Silence': '침묵의 낫',
        'Shadow Servant': '그림자 하인',
        'Distant Scream': '그림자의 울부짖음',
        'Umbral Orbs': '그림자 구슬',
        'Flameshadow': '그림자 불꽃',
        'Spawn Shadow': '그림자 생성',
        'Shadow Warrior': '그림자 무사',
        'Fade To Shadow': '그림자 잠행',
        'Cloak Of Shadows': '그림자 외투',
        'Voidgate(?! Amplifier)': '보이드의 문',
        'Void Pulse': '보이드의 고동',
        'Pitch Bog': '그림자 늪',
        'Shackled Apart': '이별의 사슬',
        'Voidgate Amplifier': '확대된 보이드의 문',
        'Shadowy Eruption': '그림자 분출',
        'Shackled Together': '속박의 사슬',
        'Doom Arc': '멸망의 궤도',
      },
    },
  ],
};
