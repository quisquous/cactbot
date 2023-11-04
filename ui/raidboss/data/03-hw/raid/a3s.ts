import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  ferroTether?: { [name: string]: string };
  ferroMarker?: { [name: string]: string };
}

const triggerSet: TriggerSet<Data> = {
  id: 'AlexanderTheArmOfTheFatherSavage',
  zoneId: ZoneId.AlexanderTheArmOfTheFatherSavage,
  timelineFile: 'a3s.txt',
  timelineTriggers: [
    {
      id: 'A3S Wash Away',
      regex: /Wash Away/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'A3S Splash',
      regex: /Splash/,
      beforeSeconds: 5,
      response: Responses.aoe(),
    },
    {
      // Note: there's nothing in the log for when the hand turns into an
      // open palm or a fist, so this just warns when to move and not
      // where to go based on time.
      id: 'A3S Hand of Stuff',
      regex: /Hand of Prayer\/Parting/,
      beforeSeconds: 5,
      condition: (data) => data.role === 'tank' || data.job === 'BLU',
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move Bosses',
          de: 'Bosse bewegen',
          fr: 'Déplacez les boss',
          ja: 'ボス動かして',
          cn: '移动Boss',
          ko: '보스 이동 주차',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'A3S Sluice',
      type: 'HeadMarker',
      netRegex: { id: '001A' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sluice on YOU',
          de: 'Schleusenöffnung auf DIR',
          fr: 'Éclusage sur Vous',
          ja: '自分にスルース',
          cn: '蓝点名',
          ko: '봇물 대상자',
        },
      },
    },
    {
      id: 'A3S Digititis Tank',
      type: 'HeadMarker',
      netRegex: { id: '0025' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Debuff',
          de: 'Tank Debuff',
          fr: 'Debuff vulnérabilité',
          ja: 'タンクデバフ',
          cn: '坦克 Debuff',
          ko: '탱커 디버프',
        },
      },
    },
    {
      id: 'A3S Digititis Healer',
      type: 'HeadMarker',
      netRegex: { id: '0022' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Healer Debuff',
          de: 'Heiler Debuff',
          fr: 'Debuff soins',
          ja: 'ヒーラーデバフ',
          cn: '奶妈 Debuff',
          ko: '힐러 디버프',
        },
      },
    },
    {
      id: 'A3S Digititis Damage',
      type: 'HeadMarker',
      netRegex: { id: '0024' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Damage Debuff',
          de: 'DD Debuff',
          fr: 'Debuff dégats',
          ja: 'DPSデバフ',
          cn: 'DPS Debuff',
          ko: '딜러 디버프',
        },
      },
    },
    {
      id: 'A3S Equal Concentration',
      type: 'Ability',
      netRegex: { source: ['Liquid Limb', 'Living Liquid'], id: 'F09', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Burn Higher HP Hand',
          de: 'Fokusiere Hand mit mehr HP',
          fr: 'Focus sur la main aux PV les plus élevés',
          ja: 'HPが高い手を討つ',
          cn: '转火血多手',
          ko: 'HP 더 많은 손에 집중',
        },
      },
    },
    {
      id: 'A3S Drainage You',
      type: 'Tether',
      netRegex: { id: '0005', target: 'Living Liquid' },
      condition: (data, matches) => matches.source === data.me,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drainage on YOU',
          de: 'Entwässerung auf DIR',
          fr: 'Drainage sur VOUS',
          ja: '自分にドレナージ',
          cn: '连线点名',
          ko: '하수로 대상자',
        },
      },
    },
    {
      id: 'A3S Drainage Tank',
      type: 'Tether',
      netRegex: { id: '0005', target: 'Living Liquid', capture: false },
      condition: (data) => data.role === 'tank',
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get drainage tether',
          de: 'Hole die Entwässerungs-Verbindung',
          fr: 'Prenez un lien de drainage',
          ja: '線を取る',
          cn: '接线',
          ko: '하수로 선 가져오기',
        },
      },
    },
    {
      id: 'A3S Ferrofluid Tether',
      type: 'Tether',
      netRegex: { id: '0026' },
      run: (data, matches) => {
        data.ferroTether ??= {};
        data.ferroTether[matches.source] = matches.target;
        data.ferroTether[matches.target] = matches.source;
      },
    },
    {
      id: 'A3S Ferrofluid Signs',
      type: 'HeadMarker',
      netRegex: { id: ['0030', '0031'] },
      run: (data, matches) => {
        data.ferroMarker ??= {};
        data.ferroMarker[matches.target] = matches.id;
      },
    },
    {
      // From logs, it appears that tethers, then headmarkers, then starts casting occurs.
      id: 'A3S Ferrofluid',
      type: 'StartsUsing',
      netRegex: { source: 'Living Liquid', id: 'F01' },
      alertText: (data, matches, output) => {
        data.ferroTether ??= {};
        data.ferroMarker ??= {};
        const partner = data.ferroTether[data.me];
        const marker1 = data.ferroMarker[data.me];
        const marker2 = data.ferroMarker[partner ?? ''];

        if (partner === undefined || marker1 === undefined || marker2 === undefined)
          return `${matches.ability} (???)`;

        if (marker1 === marker2)
          return output.repel!({ player: data.party.member(partner) });
        return output.attract!({ player: data.party.member(partner) });
      },
      outputStrings: {
        repel: {
          en: 'Repel: close to ${player}',
          de: 'Abstoß: nahe bei ${player}',
          fr: 'Répulsion : Rapprochez-vous de ${player}',
          ja: '同じ極: ${player}に近づく',
          cn: '同极：靠近${player}',
          ko: '반발: ${player}와 가까이 붙기',
        },
        attract: {
          en: 'Attract: away from ${player}',
          de: 'Anziehung: weg von ${player}',
          fr: 'Attraction : Éloignez-vous de ${player}',
          ja: '異なる極: ${player}から離れる',
          cn: '异极：远离${player}',
          ko: '자력: ${player}와 떨어지기',
        },
      },
    },
    {
      id: 'A3S Cascade',
      type: 'StartsUsing',
      netRegex: { source: 'Living Liquid', id: 'EFE', capture: false },
      response: Responses.aoe(),
    },
    {
      // aka Liquid Gaol
      id: 'A3S Throttle',
      type: 'Ability',
      netRegex: { source: 'Liquid Rage', id: 'F1A' },
      condition: (data) => data.CanCleanse(),
      alertText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Throttle on ${player}',
          de: 'Vollgas auf ${player}',
          fr: 'Geôle liquide sur ${player}',
          ja: '${player}に窒息',
          cn: '窒息点${player}',
          ko: '"${player}" 액체 감옥',
        },
      },
    },
    {
      id: 'A3S Fluid Claw',
      type: 'HeadMarker',
      netRegex: { id: '0010' },
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.clawOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.clawOn!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        clawOn: {
          en: 'Claw on ${player}',
          de: 'Klaue auf ${player}',
          fr: 'Griffe sur ${player}',
          ja: '${player}にフルイドクロー',
          cn: '抓奶手点${player}',
          ko: '"${player}" 액체 발톱',
        },
        clawOnYou: {
          en: 'Claw on YOU',
          de: 'Klaue auf DIR',
          fr: 'Griffe sur VOUS',
          ja: '自分にフルイドクロー',
          cn: '抓奶手点名',
          ko: '액체 발톱 대상자',
        },
      },
    },
    {
      // aka Pressurize
      id: 'A3S Embolus',
      type: 'Ability',
      netRegex: { source: 'Living Liquid', id: 'F1B', capture: false },
      condition: (data) => data.role === 'tank' || data.job === 'BLU',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Embolus: Move Boss',
          de: 'Pfropfen: Boss bewegen',
          fr: 'Caillot : Déplacez le boss',
          ja: 'エンボラス: ボスを引いて離れる',
          cn: '水球出现：拉走BOSS',
          ko: '물구슬: 보스 주차 옮기기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Condensate Demineralizer \\.9': 'Kondensatoranlage 9',
        'Hydrate Core': 'Hydratkern',
        'Liquid Limb': 'belebt(?:e|er|es|en) Hand',
        'Liquid Rage': 'levitiert(?:e|er|es|en) Rage',
        'Living Liquid': 'belebt(?:e|er|es|en) Wasser',
      },
      'replaceText': {
        'Cascade': 'Kaskade',
        'Digititis': 'Digititis',
        'Drainage': 'Entwässerung',
        'Embolus': 'Pfropfen',
        'Equal Concentration': 'Isotonie',
        'Ferrofluid': 'Ferrofluid',
        'Fluid Claw': 'Amorphe Klaue',
        'Fluid Strike': 'Flüssiger Schlag',
        'Fluid Swing': 'Flüssiger Schwung',
        'Gear Lubricant': 'Getriebeschmiermittel',
        'Hand Of Pain': 'Qualhand',
        'Hand Of Prayer/Parting': 'Betende/Scheidende Hand',
        'Hydromorph': 'Hydromorphose',
        'Magnetism': 'Magnetismus',
        'Piston Lubricant': 'Kolbenschmiermittel',
        'Protean Wave': 'Proteische Welle',
        'Repel': 'Repulsion',
        'Sluice': 'Schleusenöffnung',
        'Splash': 'Schwall',
        'Throttle': 'Erstickung',
        'Wash Away': 'Wegspülen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Condensate Demineralizer \\.9': 'grand condensateur GC-9',
        'Hydrate Core': 'Noyau d\'hydrate',
        'Liquid Limb': 'Membre liquide',
        'Liquid Rage': 'Furie liquide',
        'Living Liquid': 'Liquide vivant',
      },
      'replaceText': {
        'Cascade': 'Cascade',
        'Digititis': 'Phalangette',
        'Drainage': 'Drainage',
        'Embolus': 'Caillot',
        'Equal Concentration': 'Nivellement aqueux',
        'Ferrofluid': 'Ferrofluide',
        'Fluid Claw': 'Griffe fluide',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gear Lubricant': 'Lubrifiant d\'engrenage',
        'Hand Of Pain': 'Main de douleur',
        'Hand Of Prayer/Parting': 'Main de prière/séparation',
        'Hydromorph': 'Hydromorphe',
        'Magnetism/Repel': 'Magnétisme/Répulsion',
        'Piston Lubricant': 'Lubrifiant de piston',
        'Protean Wave': 'Vague inconstante',
        'Sluice': 'Éclusage',
        'Splash': 'Éclaboussement',
        'Throttle': 'Geôle liquide',
        'Wash Away': 'Lessivage',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Condensate Demineralizer \\.9': '第9大型復水器',
        'Hydrate Core': 'ハイドレードコア',
        'Liquid Limb': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Living Liquid': 'リビングリキッド',
      },
      'replaceText': {
        'Cascade': 'カスケード',
        'Digititis': 'ゆびさき',
        'Drainage': 'ドレナージ',
        'Embolus': 'エンボラス',
        'Equal Concentration': '水量均等化',
        'Ferrofluid': 'マグネット',
        'Fluid Claw': 'フルイドクロー',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Gear Lubricant': 'ギアオイル',
        'Hand Of Pain': 'ハンド・オブ・ペイン',
        'Hand Of Prayer': 'ハンド・オブ・プレイヤー',
        'Hydromorph': 'ハイドロモーフ',
        'Magnetism': '磁力',
        'Piston Lubricant': 'ピストンオイル',
        'Protean Wave': 'プロティアンウェイブ',
        'Repel': '反発',
        'Sluice': 'スルース',
        'Splash': 'スプラッシュ',
        'Throttle': '窒息',
        'Wash Away': 'ウォッシュアウェイ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Condensate Demineralizer \\.9': '第9大型冷凝器',
        'Hydrate Core': '水合核心',
        'Liquid Limb': '活水之手',
        'Liquid Rage': '活水之怒',
        'Living Liquid': '有生命活水',
      },
      'replaceText': {
        'Cascade': '倾泻',
        'Digititis': '指尖',
        'Drainage': '排水',
        'Embolus': '栓塞',
        'Equal Concentration': '水量均等化',
        'Ferrofluid': '磁石',
        'Fluid Claw': '流体之爪',
        'Fluid Strike': '流体强袭',
        'Fluid Swing': '流体摆动',
        'Gear Lubricant': '齿轮润滑剂',
        'Hand Of Pain': '苦痛之手',
        'Hand Of Prayer': '祈祷之手',
        'Hydromorph': '水态转换',
        'Magnetism': '磁力',
        'Piston Lubricant': '活塞润滑剂',
        'Protean Wave': '万变水波',
        'Repel': '相斥',
        'Sluice': '冲洗',
        'Splash': '溅开',
        'Throttle': '窒息',
        'Wash Away': '冲净',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Condensate Demineralizer \\.9': '제9대형복수기',
        'Hydrate Core': '액화 핵',
        'Liquid Limb': '액체 손',
        'Liquid Rage': '분노한 액체',
        'Living Liquid': '살아있는 액체',
      },
      'replaceText': {
        'Cascade': '폭포수',
        'Digititis': '지목',
        'Drainage': '하수로',
        'Embolus': '응고체',
        'Equal Concentration': '수량 균등화',
        'Ferrofluid': '자석',
        'Fluid Claw': '액체 발톱',
        'Fluid Strike': '유체 강타',
        'Fluid Swing': '유체 타격',
        'Gear Lubricant': '기어 윤활유',
        'Hand Of Pain': '고통의 손길',
        'Hand Of Prayer/Parting': '기도/작별의 손길',
        'Hydromorph': '액상 변이',
        'Magnetism': '자력',
        'Piston Lubricant': '피스톤 윤활유',
        'Protean Wave': '변화의 물결',
        'Repel': '반발',
        'Sluice': '봇물',
        'Splash': '물장구',
        'Throttle': '질식',
        'Wash Away': '싹쓸이',
      },
    },
  ],
};

export default triggerSet;
