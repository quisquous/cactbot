import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import Util from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn2,
  timelineFile: 't7.txt',
  initData: () => {
    return {
      monitoringHP: false,
      hpThresholds: [0.79, 0.59, 0.34],
      currentPhase: 0,
    };
  },
  triggers: [
    {
      id: 'T7 Meluseine Phase Change Watcher',
      type: 'Ability',
      // On Tail Slap.
      netRegex: NetRegexes.ability({ id: '7A8', source: 'Melusine' }),
      condition: (data) => !data.monitoringHP && data.hpThresholds[data.currentPhase] !== undefined,
      preRun: (data) => data.monitoringHP = true,
      promise: (data, matches) =>
        Util.watchCombatant({
          ids: [parseInt(matches.sourceId, 16)],
        }, (ret) => {
          return ret.combatants.some((c) => {
            const currentHPCheck = data.hpThresholds[data.currentPhase] ?? -1;
            return c.CurrentHP / c.MaxHP <= currentHPCheck;
          });
        }),
      sound: 'Long',
      run: (data) => {
        data.currentPhase++;
        data.monitoringHP = false;
      },
    },
    {
      id: 'T7 Ram',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '860', source: 'Proto-Chimera', capture: false }),
      // TODO: is this silenceable in 5.0?
      condition: (data) => data.CanStun() || data.CanSilence(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Silence Ram\'s Voice',
          de: 'Verstumme Stimme des Widders',
          fr: 'Interrompez Voix du bélier',
          ja: '沈黙: 氷結の咆哮',
          cn: '沉默寒冰咆哮',
          ko: '빙결의 포효 침묵시키기',
        },
      },
    },
    {
      id: 'T7 Dragon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '861', source: 'Proto-Chimera', capture: false }),
      // TODO: is this silenceable in 5.0?
      condition: (data) => data.CanStun() || data.CanSilence(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Silence Dragon\'s Voice',
          de: 'Verstumme Stimme des Drachens',
          fr: 'Interrompez Voix du dragon',
          ja: '沈黙: 雷電の咆哮',
          cn: '沉默雷电咆哮',
          ko: '뇌전의 포효 침묵시키기',
        },
      },
    },
    {
      id: 'T7 Tail Slap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7A8', source: 'Melusine' }),
      condition: (data, matches) => data.me === matches.target && data.job === 'BLU',
      delaySeconds: 6,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tail Slap in 10',
          de: 'Schweifklapser in 10',
          fr: 'Gifle caudale dans 10s',
          ja: 'まもなくテールスラップ',
          cn: '10秒内死刑',
          ko: '10초 안에 꼬리치기',
        },
      },
    },
    {
      id: 'T7 Renaud',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Renaud', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Renaud Add',
          de: 'Renaud Add',
          fr: 'Add Renaud',
          ja: '雑魚：ルノー',
          cn: '雷诺出现',
          ko: '르노 쫄',
        },
      },
    },
    {
      id: 'T7 Cursed Voice',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C3' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Voice Soon',
          de: 'Stimme Der Verwünschung bald',
          fr: 'Voix du maléfice bientôt',
          ja: 'まもなく呪詛の声',
          cn: '诅咒之声即将判定',
          ko: '곧 저주의 목소리',
        },
      },
    },
    {
      id: 'T7 Cursed Shriek',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C4' }),
      durationSeconds: 3,
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.shriekOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.shriekOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        shriekOn: {
          en: 'Shriek on ${player}',
          de: 'Schrei Der Verwünschung auf ${player}',
          fr: 'Cri du maléfice sur ${player}',
          ja: '${player}に呪詛の叫声',
          cn: '诅咒之嚎点${player}',
          ko: '"${player}" 저주의 외침 대상',
        },
        shriekOnYou: {
          en: 'Shriek on YOU',
          de: 'Schrei Der Verwünschung auf DIR',
          fr: 'Cri du maléfice sur VOUS',
          ja: '自分に呪詛の叫声',
          cn: '诅咒之嚎点名',
          ko: '저주의 외침 대상자',
        },
      },
    },
    {
      id: 'T7 Cursed Shriek Reminder',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C4' }),
      delaySeconds: 7,
      durationSeconds: 3,
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.shriekSoon!();

        return output.dodgeShriek!();
      },
      outputStrings: {
        shriekSoon: {
          en: 'Shriek Soon',
          de: 'Schrei Der Verwünschung bald',
          fr: 'Cri du maléfice bientôt',
          ja: 'まもなく呪詛の叫声',
          cn: '诅咒之嚎即将判定',
          ko: '곧 저주의 외침 발동',
        },
        dodgeShriek: {
          en: 'Dodge Shriek',
          de: 'Schrei Der Verwünschung ausweichen',
          fr: 'Esquivez le cri maudit',
          ja: '呪詛の叫声を避ける',
          cn: '躲避诅咒之嚎',
          ko: '저주의 외침 피하기',
        },
      },
    },
    {
      id: 'T7 Petrifaction 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7BB', source: 'Lamia Prosector', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'T7 Petrifaction 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7B1', source: 'Melusine', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'T7 Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7B2', source: 'Melusine', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Venomous Tail',
          de: 'Venomschweif',
          fr: 'Queue venimeuse',
          ja: 'ベノモステール',
          cn: '猛毒之尾',
          ko: '맹독 꼬리',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bioweapon Storage': 'Biowaffen-Magazin',
        'Lamia Prosector': 'Lamia-Prosektorin',
        'Melusine': 'Melusine',
        'Proto-Chimera': 'Proto-Chimära',
        'Renaud': 'Renaud',
      },
      'replaceText': {
        'Circle Blade': 'Kreisklinge',
        'Circle Of Flames': 'Feuerkreis',
        'Cursed Shriek': 'Schrei der Verwünschung',
        'Cursed Voice': 'Stimme der Verwünschung',
        'Deathdancer': 'Todestänzerin',
        'Frenzy': 'Verve',
        'Petrifaction': 'Versteinerung',
        'Red Lotus Blade': 'Rote Lotosklinge',
        'Sacrifice': 'Aufopferung',
        'Tail Slap': 'Schweifklapser',
        'Venomous Tail': 'Venomschweif',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bioweapon Storage': 'l\'entrepôt d\'armes biologiques',
        'Lamia Prosector': 'Lamia Dissectrice',
        'Melusine': 'Mélusine',
        'Proto-Chimera': 'Protochimère',
        'Renaud': 'Renaud',
      },
      'replaceText': {
        'Circle Blade': 'Lame circulaire',
        'Circle Of Flames': 'Cercle de flammes',
        'Cursed Shriek': 'Cri maudit',
        'Cursed Voice': 'Voix maudite',
        'Deathdancer Add': 'Add Danseuse de mort',
        'Frenzy': 'Frénésie',
        'Petrifaction': 'Pétrification',
        'Red Lotus Blade': 'Lame lotus rouge',
        'Sacrifice': 'Sacrifice',
        'Tail Slap': 'Gifle caudale',
        'Venomous Tail': 'Queue venimeuse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bioweapon Storage': '生体管理区',
        'Lamia Prosector': 'ラミア・プロセクター',
        'Melusine': 'メリュジーヌ',
        'Proto-Chimera': 'プロトキマイラ',
        'Renaud': 'ルノー',
      },
      'replaceText': {
        '(.*) Adds?': '雑魚: $1',
        'Circle Blade': 'サークルブレード',
        'Circle Of Flames': 'サークル・オブ・フレイム',
        'Cursed Shriek': '呪詛の叫声',
        'Cursed Voice': '呪詛の声',
        'Deathdancer': 'デスダンサー',
        'Frenzy': '熱狂',
        'Petrifaction': 'ペトリファクション',
        'Red Lotus Blade': 'レッドロータス',
        'Sacrifice': 'サクリファイス',
        'Tail Slap': 'テールスラップ',
        'Venomous Tail': 'ベノモステール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bioweapon Storage': '生体管理区',
        'Lamia Prosector': '拉米亚解剖女王',
        'Melusine': '美瑠姬奴',
        'Proto-Chimera': '原型奇美拉',
        'Renaud': '雷诺',
      },
      'replaceText': {
        'Circle Blade': '回旋斩',
        'Circle Of Flames': '地层断裂',
        'Cursed Shriek': '诅咒之嚎',
        'Cursed Voice': '诅咒之声',
        'Deathdancer': '死亡舞师',
        'Frenzy': '狂热',
        'Petrifaction': '石化',
        'Red Lotus Blade': '红莲',
        'Sacrifice': '献祭',
        'Tail Slap': '尾部猛击',
        'Venomous Tail': '猛毒之尾',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bioweapon Storage': '생체 관리 구역',
        'Lamia Prosector': '라미아 시체해부자',
        'Melusine': '멜뤼진',
        'Proto-Chimera': '프로토 키마이라',
        'Renaud': '르노',
      },
      'replaceText': {
        'Circle Blade': '회전 베기',
        'Circle Of Flames': '화염의 원',
        'Cursed Shriek': '저주의 외침',
        'Cursed Voice': '저주의 목소리',
        'Deathdancer': '죽음무용수',
        'Frenzy': '열광',
        'Petrifaction': '석화',
        'Red Lotus Blade': '홍련의 칼날',
        'Sacrifice': '희생',
        'Tail Slap': '꼬리치기',
        'Venomous Tail': '맹독 꼬리',
      },
    },
  ],
});
