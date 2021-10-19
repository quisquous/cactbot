import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.BaelsarsWall,
  timelineFile: 'baelsars_wall.txt',
  timelineTriggers: [
    {
      id: 'Baelsar Magitek Cannon',
      regex: /Magitek Cannon/,
      beforeSeconds: 4,
      response: Responses.tankBuster(),
    },
    {
      id: 'Baelsar Dull Blade',
      regex: /Dull Blade/,
      beforeSeconds: 4,
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'Baelsar Magitek Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CB2', source: 'Magitek Predator' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CB2', source: '魔导猎手' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Baelsar Magitek Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CB3', source: 'Magitek Predator', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CB3', source: '魔导猎手', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Baelsar Needle Burst',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1DC8', source: 'Magitek Vanguard D-1' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1DC8', source: '魔导先锋防卫型' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
    {
      id: 'Baelsar Launcher',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CBC', source: 'Magitek Predator', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CBC', source: '魔导猎手', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Baelsar Dynamic Sensory Jammer',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '46C' }),
      condition: Conditions.targetIsYou(),
      response: Responses.stopEverything(),
    },
    {
      id: 'Baelsar Griffin Beak',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC3', source: 'The Griffin', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CC3', source: '铁面公卿 伊尔伯德', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Baelsar Flash Powder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC4', source: 'The Griffin' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CC4', source: '铁面公卿 伊尔伯德' }),
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'Baelsar Griffin Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC2', source: 'The Griffin' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CC2', source: '铁面公卿 伊尔伯德' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Baelsar Big Boot',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '1CC4' }),
      condition: Conditions.targetIsYou(),
      response: Responses.knockbackOn(),
    },
    {
      id: 'Baelsar Restraint Collar',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC8', source: 'The Griffin' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1CC8', source: '铁面公卿 伊尔伯德' }),
      condition: Conditions.targetIsNotYou(),
      alertText: (data, matches, output) => output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Break chain on ${player}',
          de: 'Kette von ${player} brechen',
          fr: 'Cassez les chaînes de ${player}',
          ja: '${player}の線を取る',
          cn: '截断${player}的线',
          ko: '${player}의 사슬 부수기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'Armored Weapon': '武装重甲',
        'Blade Of The Griffin': '狮鹫之刃',
        'Magitek Bit': '魔导浮游炮',
        'Magitek Predator': '魔导猎手',
        'The Airship Landing': '飞空战舰着陆场',
        '(?<! )The Griffin': '铁面公卿 伊尔伯德',
        'The Magitek Installation': '魔导兵器仓库',
        'Via Praetoria': '天营路',
      },
      'replaceText': {
        '--teleport': '--传送',
        'Assault Cannon': '突击加农炮',
        'Beak Of The Griffin': '狮鹫之喙',
        'Big Boot': '大靴重踹',
        'Claw Of The Griffin': '狮鹫之爪',
        'Corrosion': '溶解',
        'Diffractive Laser': '扩散射线',
        'Distress Beacon': '请求支援',
        'Dull Blade': '钝剑',
        'Dynamic Sensory Jammer': '运动体探知干扰器',
        'Flash Powder': '闪光粉',
        'Gull Dive': '海鸟冲',
        'Launcher': '火箭炮',
        'Lionshead': '狮子首',
        'Magitek Bit': '浮游炮射出',
        'Magitek Cannon': '魔导加农炮',
        'Magitek Claw': '魔导爪',
        'Magitek Missile': '魔导飞弹',
        'Magitek Ray': '魔导激光',
        'Restraint Collar': '锁链',
        'Sanguine Blade': '嗜血刃',
      },
    },
  ],
};

export default triggerSet;
