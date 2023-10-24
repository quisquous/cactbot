import Conditions from '../../../../../resources/conditions';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheBindingCoilOfBahamutTurn4',
  zoneId: ZoneId.TheBindingCoilOfBahamutTurn4,
  timelineFile: 't4.txt',
  triggers: [
    {
      id: 'T4 Gravity Thrust',
      type: 'StartsUsing',
      netRegex: { source: 'Spinner-Rook', id: '4D4' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'LOS Thrust',
          de: 'LOS Gravitationsschlag',
          fr: 'LOS Percée gravitationelle',
          ja: 'グラビデカノン',
          cn: '死刑',
          ko: '중력포',
        },
      },
    },
    {
      id: 'T4 Pox',
      type: 'StartsUsing',
      netRegex: { source: 'Spinner-Rook', id: '4D5' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'LOS Pox',
          de: 'LOS Pocken',
          fr: 'LOS Vérole',
          ja: 'ポックス',
          cn: '血量上限降低',
          ko: '두창',
        },
      },
    },
    {
      id: 'T4 Reminder',
      type: 'AddedCombatant',
      netRegex: { name: 'Clockwork Knight', capture: false },
      suppressSeconds: 100000,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Magic on Soldier, Physical on Knights',
          de: 'Magier auf Soldat, Physische auf Ritter',
          fr: 'Magique sur Soldat, Physique sur Chevalier',
          ja: '魔法はソルジャー、物理はナイト',
          cn: '法系打士兵，物理打骑士',
          ko: '병사 마법공격, 기사 물리공격',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Clockwork Bug': 'Uhrwerk-Wanze',
        'Clockwork Dreadnaught': 'Brummonaut',
        'Clockwork Knight': 'Uhrwerk-Ritter',
        'Drive Cylinder': 'Antriebszylinder',
        'Spinner-rook': 'Drehturm',
      },
      'replaceText': {
        'Bug': 'Wanze',
        'Dreadnaught': 'Brummonaut',
        'Emergency Override': 'Not-Übersteuerung',
        'Knight': 'Ritter',
        'Rook': 'Drehturm',
        'Soldier': 'Soldat',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Clockwork Bug': 'Insecte Mécanique',
        'Clockwork Dreadnaught': 'Cuirassé Dreadnaught',
        'Clockwork Knight': 'Chevalier Mécanique',
        'Drive Cylinder': 'Cylindre Propulseur',
        'Spinner-rook': 'Drone-Drille',
      },
      'replaceText': {
        'Bug': 'Insecte',
        'Dreadnaught': 'Cuirassé',
        'Emergency Override': 'Annulation d\'urgence',
        'Knight': 'Chevalier',
        'Rook': 'Drone',
        'Soldier': 'Soldat',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Clockwork Bug': 'アラガンワーク・バグ',
        'Clockwork Dreadnaught': 'ドレッドノート',
        'Clockwork Knight': 'アラガンワーク・ナイト',
        'Drive Cylinder': '稼働隔壁',
        'Spinner-rook': 'ルークスピナー',
      },
      'replaceText': {
        'Bug': 'アラガンワーク・バグ',
        'Dreadnaught': 'ドレッドノート',
        'Emergency Override': 'エマージェンシー・オーバーライド',
        'Knight': 'ナイト',
        'Rook': 'ルーク',
        'Soldier': 'ソルジャー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Clockwork Bug': '亚拉戈发条虫',
        'Clockwork Dreadnaught': '恐慌装甲',
        'Clockwork Knight': '亚拉戈发条骑士',
        'Drive Cylinder': '隔离壁',
        'Spinner-rook': '转盘堡',
      },
      'replaceText': {
        'Bug': '故障虫',
        'Dreadnaught': '恐慌装甲',
        'Emergency Override': '紧急超驰控制',
        'Knight': '亚拉戈发条骑士',
        'Rook': '转盘堡',
        'Soldier': '亚拉戈发条士兵',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Clockwork Bug': '알라그 태엽벌레',
        'Clockwork Dreadnaught': '드레드노트',
        'Clockwork Knight': '알라그 태엽기사',
        'Drive Cylinder': '가동격벽',
        'Spinner-rook': '보루형 회전전차',
      },
      'replaceText': {
        'Bug': '버그',
        'Dreadnaught': '드레드노트',
        'Emergency Override': '긴급 체제 변환',
        'Knight': '기사',
        'Soldier': '병사',
        'Rook': '회전전차',
      },
    },
  ],
};

export default triggerSet;
