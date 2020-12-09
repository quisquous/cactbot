import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: Add N/S E/W callout to Rejuvenating Balm
// TODO: Add Summon

export default {
  zoneId: ZoneId.EdensPromiseUmbraSavage,
  timelineFile: 'e9s.txt',
  triggers: [
    {
      id: 'E9S Ground-Razing Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '5625', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9S The Art Of Darkness Protean',
      netRegex: NetRegexes.startsUsing({ id: ['5B45', '55FB'], source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: (data) => {
        if (data.phase === 'empty')
          return 8;
        return 4;
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Position',
          ja: '散開',
          cn: '散开',
          ko: '위치 산개',
        },
      },
    },
    {
      id: 'E9S The Art Of Darkness Partner Stacks',
      netRegex: NetRegexes.startsUsing({ id: ['5B46', '55FE'], source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: (data) => {
        if (data.phase === 'empty')
          return 8;
        return 4;
      },
      alertText: (data, _, output) => output.text(),
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
    {
      id: 'E9S Zero-Form Devouring Dark',
      netRegex: NetRegexes.startsUsing({ id: '5623', source: 'Cloud Of Darkness' }),
      durationSeconds: 4,
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.tankBusterOnYou();

        if (data.role === 'tank')
          return output.tankSwap();

        if (data.role === 'healer')
          return output.tankBusters({ player: data.ShortName(matches.target) });
      },
      infoText: function(data, _, output) {
        if (data.role !== 'tank' && data.role !== 'healer')
          return output.avoidLaser();
      },
      outputStrings: {
        tankBusterOnYou: {
          en: 'Tank Buster on YOU',
          de: 'Tank buster auf DIR',
          fr: 'Tank buster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '탱버 대상자',
        },
        tankBusters: {
          en: 'Tank Busters',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '死刑',
          ko: '탱버',
        },
        tankSwap: {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'タンクスイッチ',
          cn: '换T！',
          ko: '탱 교대',
        },
        avoidLaser: {
          en: 'Avoid Laser',
          de: 'Laser ausweichen',
          fr: 'Évitez le laser',
          ja: 'アバランチに避け',
          cn: '躲避击退激光',
          ko: '레이저 피하기',
        },
      },
    },
    {
      id: 'E9S Obscure Woods',
      netRegex: NetRegexes.startsUsing({ id: '55EE', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9S Flood Of Obscurity',
      netRegex: NetRegexes.startsUsing({ id: '5907', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Place Bramble',
        },
      },
    },
    {
      id: 'E9S Waste Away',
      netRegex: NetRegexes.startsUsing({ id: '5617', source: 'Cloud Of Darkness', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E9S Rejuvenating Balm',
      netRegex: NetRegexes.startsUsing({ id: '5618', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Tethered Walls',
        },
      },
    },
    {
      id: 'E9S Stygian Break Tether',
      netRegex: NetRegexes.headMarker({ id: '00D4' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 3,
      response: Responses.breakChains(),
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited Out',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 1,
      durationSeconds: 6,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Tethered Wall Then Out',
        },
      },
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited Soaks',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 7,
      alarmText: function(data, _, output) {
        if (data.role === 'tank')
          return output.stayOut();
      },
      alertText: function(data, _, output) {
        if (data.role !== 'tank')
          return output.healerStacks();
      },
      outputStrings: {
        stayOut: {
          en: 'Stay Out',
          de: 'Draußen stehen',
          fr: 'Restez éloigné',
          ja: 'ライトニングを外に安置',
          cn: '外侧放雷',
          ko: '바깥에 있기',
        },
        healerStacks: {
          en: 'Healer Stacks',
          de: 'Bei den Heilern sammeln',
          fr: 'Packages sur les heals',
          ja: 'ヒーラーに集合',
          cn: '治疗集合',
          ko: '힐러 모이기',
        },
      },
    },
    {
      id: 'E9S Anti-Air Phaser Unlimited Sides',
      netRegex: NetRegexes.startsUsing({ id: '561[23]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 11,
      response: Responses.goSides(),
    },
    {
      id: 'E9S The Second Art Of Darkness Right -> Stacks',
      netRegex: NetRegexes.startsUsing({ id: '5601', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Left -> Stacks',
        },
      },
    },
    {
      id: 'E9S The Second Art Of Darkness Left -> Stacks',
      netRegex: NetRegexes.startsUsing({ id: '5602', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Right -> Stacks',
        },
      },
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited Sides',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Tethered Wall Then Sides',
        },
      },
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited Laser',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 8,
      alarmText: function(data, _, output) {
        if (data.role === 'tank')
          return output.tankLaser();
      },
      alertText: function(data, _, output) {
        if (data.role !== 'tank')
          return output.healerStacks();
      },
      outputStrings: {
        tankLaser: {
          en: 'Laser on YOU',
          de: 'Laser auf DIR',
          fr: 'Laser sur VOUS',
          cn: '激光点名',
          ko: '레이저 대상자',
        },
        healerStacks: {
          en: 'Healer Stacks',
          de: 'Bei den Heilern sammeln',
          fr: 'Packages sur les heals',
          ja: 'ヒーラーに集合',
          cn: '治疗集合',
          ko: '힐러 모이기',
        },
      },
    },
    {
      id: 'E9S Wide-Angle Phaser Unlimited Out',
      netRegex: NetRegexes.startsUsing({ id: '560[DE]', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 12,
      response: Responses.getOut(),
    },
    {
      id: 'E9S Empty Plane',
      netRegex: NetRegexes.startsUsing({ id: '55EF', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
      run: (data) => {
        data.phase = 'empty';
      },
    },
    {
      id: 'E9S Flood Of Emptiness',
      netRegex: NetRegexes.startsUsing({ id: '55F0', source: 'Cloud Of Darkness', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tile Positions',
        },
      },
    },
    {
      id: 'E9S Curse Of Darkness',
      netRegex: NetRegexes.gainsEffect({ effectId: '953' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_, matches) => matches.duration - 3,
      alertText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Face Laser Out',
        },
      },
    },
    {
      id: 'E9S Hypercharged Condensation',
      netRegex: NetRegexes.startsUsing({ id: '560C', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'E9S The Art Of Darkness Right',
      netRegex: NetRegexes.startsUsing({ id: '5A95', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 8,
      response: Responses.goLeft(),
    },
    {
      id: 'E9S The Art Of Darkness Left',
      netRegex: NetRegexes.startsUsing({ id: '5A96', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 8,
      response: Responses.goRight(),
    },
    {
      id: 'E9S Full-Perimeter Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '5629', source: 'Cloud Of Darkness', capture: false }),
      // Let Curse of Darkness trigger resolve first
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.getIn(),
    },
    {
      id: 'E9S Deluge Of Darkness',
      netRegex: NetRegexes.startsUsing({ id: '55F1', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.bigAoe('alert'),
      run: (data) => {
        delete data.phase;
      },
    },
    {
      id: 'E9S The Third Art Of Darkness Right -> Protean -> Left',
      netRegex: NetRegexes.startsUsing({ id: '5603', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 18,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Left -> Protean -> Right',
        },
      },
    },
    {
      // TODO: Unconfirmed
      id: 'E9S The Third Art Of Darkness Left -> Protean -> Right',
      netRegex: NetRegexes.startsUsing({ id: '5604', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 18,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Right -> Protean -> Left',
        },
      },
    },
    {
      id: 'E9S Particle Concentration',
      netRegex: NetRegexes.startsUsing({ id: '5620', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Allez dans les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 들어가기',
        },
      },
    },
  ],
  timelineReplace: [],
};
