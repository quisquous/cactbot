import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: Final Punishment stack counts are in the network log, but not in ACT log :C
// e.g. 4 stacks:
//   26|2020-02-08T21:03:07.8080000-08:00|403|Final Punishment|
//   39.95|E0000000||1068E9CB|Potato Chippy|04|19062|||0bd20f2b57d49b17a19caa10e1fb8734
// TODO: chakram safe spots lol?

export default {
  zoneId: ZoneId.AlexanderTheBurdenOfTheSonSavage,
  timelineFile: 'a8s.txt',
  timelineTriggers: [
    {
      id: 'A8S Hydrothermal Missile',
      regex: /Hydrothermal Missile/,
      beforeSeconds: 3,
      response: Responses.tankCleave(),
    },
    {
      id: 'A8S Swindler Add',
      regex: /Swindler/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Swindler Soon',
          de: 'Bald Schwindler',
          fr: 'Arnaqueur bientôt',
          ja: 'まもなくスウィンドラー',
          cn: '欺诈者即将出现',
          ko: '곧 조작자 등장',
        },
      },
    },
    {
      id: 'A8S Vortexer Add',
      regex: /Vortexer/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Vortexer Soon',
          de: 'Bald Vortexer',
          fr: 'Tourbillonneur bientôt',
          ja: 'まもなくボルテッカー',
          cn: '环旋者即将出现',
          ko: '곧 교반자 등장',
        },
      },
    },
    {
      id: 'A8S Flarethrower',
      regex: /Flarethrower/,
      beforeSeconds: 3,
      response: Responses.tankCleave(),
    },
    {
      id: 'A8S Super Jump Soon',
      regex: /Super Jump/,
      beforeSeconds: 8,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Super Jump',
          de: 'Supersprung ködern',
          fr: 'Attirez le Super saut',
          ja: 'スーパージャンプを誘導',
          cn: '引导超级跳',
          ko: '슈퍼 점프',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'A8S Megabeam Onslaughter',
      netRegex: NetRegexes.startsUsing({ source: 'Onslaughter', id: '162E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schlachter', id: '162E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Attaqueur', id: '162E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'オンスローター', id: '162E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '突击者', id: '162E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '맹습자', id: '162E', capture: false }),
      // Insert sound effect from Arthars here.
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Megabeamu~',
          de: 'Megalaser~',
          fr: 'Mégarayon~',
          ja: 'メガビーム～',
          cn: '巨型光束炮~',
          ko: '고출력 광선~',
        },
      },
    },
    {
      id: 'A8S Megabeam Brute Justice',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '1664', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '1664', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '1664', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '1664', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '1664', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '1664', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Megabeamu~!',
          de: 'Megalaser~!',
          fr: 'Mégarayon~ !',
          ja: 'メガビーム～',
          cn: '巨型光束炮~!',
          ko: '고출력 광선~!',
        },
      },
    },
    {
      id: 'A8S Execution',
      netRegex: NetRegexes.ability({ source: 'Onslaughter', id: '1632', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schlachter', id: '1632', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Attaqueur', id: '1632', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'オンスローター', id: '1632', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '突击者', id: '1632', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '맹습자', id: '1632', capture: false }),
      condition: function(data) {
        return data.role === 'dps' || data.job === 'BLU';
      },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Regulators',
          de: 'Dampfregler besiegen',
          fr: 'Tuez les Régulateurs',
          ja: 'スチームジャッジを倒す',
          cn: '击杀小怪',
          ko: '증기 감독 없애기',
        },
      },
    },
    {
      id: 'A8S Perpetual Ray',
      netRegex: NetRegexes.startsUsing({ source: 'Onslaughter', id: '162B' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schlachter', id: '162B' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Attaqueur', id: '162B' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'オンスローター', id: '162B' }),
      netRegexCn: NetRegexes.startsUsing({ source: '突击者', id: '162B' }),
      netRegexKo: NetRegexes.startsUsing({ source: '맹습자', id: '162B' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A8S Blaster Mirage',
      netRegex: NetRegexes.addedCombatant({ name: 'Blaster Mirage', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Blaster-Replikant', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Réplique Du Fracasseur', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ブラスター・ミラージュ', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '爆破者幻象', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '폭파자의 환영', capture: false }),
      suppressSeconds: 99999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mirage',
          de: 'Mirage',
          fr: 'Mirage',
          ja: 'ミラージュ',
          cn: '幻象',
          ko: '환영',
        },
      },
    },
    {
      id: 'A8S Discoid',
      netRegex: NetRegexes.headMarker({ id: '0023' }),
      condition: function(data, matches) {
        // Verdict comes with the same headmarker.
        return data.me === matches.target && !data.seenLinkUp;
      },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orb on YOU',
          de: 'Orb auf DIR',
          fr: 'Orbe sur VOUS',
          ja: '自分に玉',
          cn: '球点名',
          ko: '구슬 대상자',
        },
      },
    },
    {
      id: 'A8S Mind Blast',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster', id: '1639' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster', id: '1639' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fracasseur', id: '1639' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター', id: '1639' }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者', id: '1639' }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자', id: '1639' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'A8S Low Arithmeticks',
      // Note: both high and low use '0025' headmarker
      netRegex: NetRegexes.gainsEffect({ effectId: '3FD' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get High',
          de: 'Geh nach Oben',
          fr: 'Montez',
          ja: '高い床に乗る',
          cn: '上高台',
          ko: '높은곳으로',
        },
      },
    },
    {
      id: 'A8S High Arithmeticks',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FE' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Down',
          de: 'Geh nach Unten',
          fr: 'Descendez',
          ja: '低い床に乗る',
          cn: '下低台',
          ko: '낮은곳으로',
        },
      },
    },
    {
      id: 'A8S Bio-Arithmeticks',
      netRegex: NetRegexes.startsUsing({ source: 'Swindler', id: '164A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schwindler', id: '164A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arnaqueur', id: '164A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スウィンドラー', id: '164A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '欺诈者', id: '164A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조작자', id: '164A', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A8S Super Cyclone',
      netRegex: NetRegexes.startsUsing({ source: 'Vortexer', id: '1657', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Wirbler', id: '1657', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Tourbillonneur', id: '1657', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボルテッカー', id: '1657', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '环旋者', id: '1657', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '교반자', id: '1657', capture: false }),
      response: Responses.knockback('alarm'),
    },
    {
      id: 'A8S Compressed Lightning',
      // Note: also the 0045 headmarker.
      netRegex: NetRegexes.gainsEffect({ effectId: '400' }),
      // TODO: do we need a Responses.effectOn() that uses matches.effect?
      alarmText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.thunderOnYou();
      },
      infoText: function(data, matches, output) {
        if (data.me !== matches.target)
          return output.thunderOn({ player: data.ShortName(matches.target) });
      },
      run: function(data, matches) {
        data.lightning = matches.target;
      },
      outputStrings: {
        thunderOn: {
          en: 'Thunder on ${player}',
          de: 'Blitz auf ${player}',
          fr: 'Foudre sur ${player}',
          ja: '${player}に雷',
          cn: '雷点${player}',
          ko: '"${player}" 번개징',
        },
        thunderOnYou: {
          en: 'Thunder on YOU',
          de: 'Blitz auf DIR',
          fr: 'Foudre sur VOUS',
          ja: '自分に雷',
          cn: '雷点名',
          ko: '번개징 대상자',
        },
      },
    },
    {
      id: 'A8S Compressed Lightning Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '400', capture: false }),
      run: function(data) {
        delete data.lightning;
      },
    },
    {
      id: 'A8S Compressed Lightning Soon',
      netRegex: NetRegexes.gainsEffect({ effectId: '400' }),
      delaySeconds: function(_data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: function(data, _matches, output) {
        if (!data.lightning)
          return;
        return output.text({ player: data.ShortName(data.lightning) });
      },
      outputStrings: {
        text: {
          en: 'Thunder Soon on ${player}',
          de: 'Blitz bald auf ${player}',
          fr: 'Foudre bientôt sur ${player}',
          ja: '${player}に雷頭割り',
          cn: '马上雷分摊${player}',
          ko: '"${player}" 번개징 곧 터짐',
        },
      },
    },
    {
      id: 'A8S Enumeration',
      netRegex: NetRegexes.headMarker({ id: ['0040', '0041', '0042'] }),
      infoText: function(data, matches, output) {
        // 0040 = 2, 0041 = 3, 0042 = 4
        const count = 2 + parseInt(matches.id, 16) - parseInt('0040', 16);
        return output.text({ player: data.ShortName(matches.target), count: count });
      },
      outputStrings: {
        text: {
          en: '${player}: ${count}',
          de: '${player}: ${count}',
          fr: '${player}: ${count}',
          ja: '${player}: ${count}',
          cn: '${player}生命计算法: ${count}',
          ko: '${player}: ${count}',
        },
      },
    },
    {
      id: 'A8S Double Rocket Punch',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '1663' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '1663' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '1663' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '1663' }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '1663' }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '1663' }),
      condition: Conditions.caresAboutPhysical(),
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.sharedTankbusterOnYou();

        if (data.role === 'tank' || data.role === 'healer')
          return output.sharedTankbusterOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        sharedTankbusterOnYou: {
          en: 'Shared Tankbuster on YOU',
          de: 'geteilter Tankbuster auf DIR',
          fr: 'Tank buster à partager sur VOUS',
          ja: '自分にタンクシェア',
          cn: '分摊死刑点名',
          ko: '쉐어 탱버 대상자',
        },
        sharedTankbusterOn: {
          en: 'Shared Tankbuster on ${player}',
          de: 'geteilter Tankbuster on ${player}',
          fr: 'Tank buster à partager sur ${player}',
          ja: '${player} にタンクシェア',
          cn: '分摊死刑点 ${player}',
          ko: '"${player}" 쉐어 탱버',
        },
      },
    },
    {
      id: 'A8S Long Needle Stack Collect',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      run: function(data, matches) {
        data.longNeedleStack = matches.target;
      },
    },
    {
      id: 'A8S Long Needle Prey Collect',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      run: function(data, matches) {
        data.longNeedlePrey = data.longNeedlePrey || [];
        data.longNeedlePrey.push(matches.target);
      },
    },
    {
      id: 'A8S Short Needle',
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '1668', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '1668', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '1668', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '1668', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '1668', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '1668', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A8S Long Needle',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '166A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '166A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '166A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '166A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '166A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '166A', capture: false }),
      condition: function(data) {
        return data.longNeedleStack && data.longNeedlePrey;
      },
      suppressSeconds: 10,
      alarmText: function(data, _matches, output) {
        if (data.longNeedlePrey.includes(data.me))
          return output.preyGetOut();
      },
      alertText: function(data, _matches, output) {
        if (data.longNeedlePrey.includes(data.me))
          return;
        const target = data.longNeedleStack;
        if (target === data.me)
          return output.stackOnYou();

        return output.stackOn({ player: data.ShortName(target) });
      },
      run: function(data) {
        delete data.longNeedleStack;
        delete data.longNeedlePrey;
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stackOn: {
          en: 'Stack on ${player}',
          de: 'Auf ${player} sammeln',
          fr: 'Packez-vous sur ${player}',
          ja: '${player}にスタック',
          cn: '靠近 ${player}集合',
          ko: '"${player}" 쉐어징',
        },
        preyGetOut: {
          en: 'Prey: Get Out',
          de: 'Makiert: Geh raus',
          fr: 'Marquage : À l\'extérieur',
          ja: '赤いマーク: 外へ',
          cn: '红点名离开人群',
          ko: '빨간징: 밖으로',
        },
      },
    },
    {
      id: 'A8S Super Jump',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '1665' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '1665' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '1665' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '1665' }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '1665' }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '1665' }),
      alertText: function(data, matches, output) {
        if (data.me !== matches.target)
          return;
        return output.superJumpOnYou();
      },
      infoText: function(data, matches, output) {
        if (data.me === matches.target)
          return;
        return output.superJumpOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        superJumpOn: {
          en: 'Super Jump on ${player}',
          de: 'Supersprung auf ${player}',
          fr: 'Super saut sur ${player}',
          ja: '${player}にスーパージャンプ',
          cn: '超级跳点${player}',
          ko: '"${player}" 슈퍼 점프',
        },
        superJumpOnYou: {
          en: 'Super Jump on YOU',
          de: 'Supersprung auf DIR',
          fr: 'Super saut sur VOUS',
          ja: '自分にスーパージャンプ',
          cn: '超级跳点名',
          ko: '슈퍼 점프 대상자',
        },
      },
    },
    {
      id: 'A8S Mirage Marker',
      netRegex: NetRegexes.headMarker({ id: '0008' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mirage on YOU',
          de: 'Mirage auf DIR',
          fr: 'Mirage sur VOUS',
          ja: '自分にミラージュ',
          cn: '分身点名',
          ko: '환영 징 대상자',
        },
      },
    },
    {
      id: 'A8S Ice Missile Marker',
      netRegex: NetRegexes.headMarker({ id: '0043' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Ice Missile on YOU',
          de: 'Eis-Rakete auf DIR',
          fr: 'Missile de glace sur VOUS',
          ja: '自分にアイスミサイル',
          cn: '冰点名',
          ko: '얼음 미사일 대상자',
        },
      },
    },
    {
      id: 'A8S Hidden Minefield Intermission',
      // 165E used in both intermission and in final phase
      // 165C only used for intermission
      netRegex: NetRegexes.ability({ source: 'Hidden Mine', id: '165E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Minenfalle', id: '165E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Mine Furtive', id: '165E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ステルス地雷', id: '165E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '隐形地雷', id: '165E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '은폐 지뢰', id: '165E', capture: false }),
      condition: function(data) {
        return !data.seenLinkUp;
      },
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Mines',
          de: 'Mienen nehmen',
          fr: 'Prenez les mines',
          ja: '地雷を踏む',
          cn: '踩雷',
          ko: '지뢰 밟기',
        },
      },
    },
    {
      id: 'A8S Mirage Blinder',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster Mirage', id: '165A' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster-Replikant', id: '165A' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '165A' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '165A' }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者幻象', id: '165A' }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자의 환영', id: '165A' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look Away from Mirage',
          de: 'Von Replikant wegschauen',
          fr: 'Ne regardez pas la Réplique',
          ja: 'ミラージュを見ない',
          cn: '背对幻象',
          ko: '환영 쳐다보지 않기',
        },
      },
    },
    {
      id: 'A8S Mirage Power Tackle',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster Mirage', id: '165B' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster-Replikant', id: '165B' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '165B' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '165B' }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者幻象', id: '165B' }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자의 환영', id: '165B' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look Towards Mirage',
          de: 'Zu Replikant hinschauen',
          fr: 'Regardez la Réplique',
          ja: 'ミラージュを見る',
          cn: '面向幻象',
          ko: '환영 쳐다보기',
        },
      },
    },
    {
      id: 'A8S Link Up',
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '1673', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '1673', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '1673', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '1673', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '1673', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '1673', capture: false }),
      run: function(data) {
        data.seenLinkUp = true;
      },
    },
    {
      id: 'A8S Verdict Min HP',
      netRegex: NetRegexes.gainsEffect({ effectId: '408' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Min HP: Provoke Boss => Late NE Tornado',
          de: 'Min HP: Boss herrausfordern => Später No Tornado',
          fr: 'PV Min : Provocation Boss => Cyclone NE en retard',
          ja: 'HP最小: ボスに挑発 => 北東竜巻',
          cn: '最少HP:挑衅BOSS => 东北龙卷风',
          ko: 'HP 최소: 보스 도발 => 북동쪽 회오리',
        },
      },
    },
    {
      id: 'A8S Verdict Min HP Collect',
      netRegex: NetRegexes.gainsEffect({ effectId: '408' }),
      run: function(data, matches) {
        data.verdictMin = matches.target;
      },
    },
    {
      id: 'A8S Verdict Min HP Tornado',
      netRegex: NetRegexes.gainsEffect({ effectId: '408' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 27,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get NE Tornado',
          de: 'Nimm NO Tornado',
          fr: 'Prenez le Cyclone NE',
          ja: '北東竜巻に',
          cn: '去东北龙卷风',
          ko: '북동쪽 회오리 밟기',
        },
      },
    },
    {
      id: 'A8S Verdict Max HP Collect',
      netRegex: NetRegexes.gainsEffect({ effectId: '407' }),
      run: function(data, matches) {
        data.verdictMax = matches.target;
      },
    },
    {
      id: 'A8S Verdict Max HP',
      netRegex: NetRegexes.gainsEffect({ effectId: '407' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Max HP: Provoke Boss Second',
          de: 'Max HP: Boss als Zweites herrausfordern',
          fr: 'PV Max : Seconde Provocation Boss',
          ja: 'HP最大: 第二のボスを挑発',
          cn: '最多HP:第二个挑衅BOSS',
          ko: 'HP 최대: 두번째로 보스 도발',
        },
      },
    },
    {
      // Final Punishment effect falling off due to auto.
      id: 'A8S Verdict Max HP Provoke',
      netRegex: NetRegexes.losesEffect({ effectId: '403' }),
      condition: function(data, matches) {
        return matches.target === data.verdictMin && data.me === data.verdictMax;
      },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Provoke Boss',
          de: 'Boss herrausfordern',
          fr: 'Provocation Boss',
          ja: 'ボスを挑発',
          cn: '挑衅BOSS',
          ko: '보스 도발',
        },
      },
    },
    {
      id: 'A8S Verdict Max HP Blu Devour',
      netRegex: NetRegexes.gainsEffect({ effectId: '407' }),
      condition: function(data, matches) {
        return data.me === matches.target && data.job === 'BLU';
      },
      delaySeconds: 27,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Use Devour',
          de: 'Benutze Verschlingen',
          fr: 'Utilisez Dévoration',
          ja: '捕食を使う',
          cn: '使用捕食',
          ko: '포식 사용하기',
        },
      },
    },
    {
      id: 'A8S Verdict Penalty 1',
      netRegex: NetRegexes.gainsEffect({ effectId: '409' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      // TODO: we could say who to share north orbs with?
      // TODO: we could also repeat the "share north orbs" after sw orb Explosion.
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Penalty 1: SW orb -> Share 2x North Orbs',
          de: 'Schwächung 1: SW orb -> 2x nördliche Orbs teilen',
          fr: 'Altération 1 : Orbe SO -> Partagez 2x Orbes Nord',
          ja: '1番: 南西にいる玉を喰らう => 北にいる玉と頭割り',
          cn: '1号：吃西南球然后分摊北边双球',
          ko: '약화 1: 남서쪽 구슬 -> 북쪽 구슬 2개',
        },
      },
    },
    {
      id: 'A8S Verdict Penalty 2',
      netRegex: NetRegexes.gainsEffect({ effectId: '40A' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Penalty 2: NW Tornado',
          de: 'Schwächung 2: NW Tornado',
          fr: 'Altérations 2 : Cyclone NO',
          ja: '2番: 北西竜巻',
          cn: '2号：西北龙卷风',
          ko: '약화 2: 북서쪽 회오리',
        },
      },
    },
    {
      id: 'A8S Verdict Penalty 3',
      netRegex: NetRegexes.gainsEffect({ effectId: '40B' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Penalty 3: Get a South Tornado',
          de: 'Schwächung 3: Nimm südlichen Tornado',
          fr: 'Altérations 3 : Prenez le Cyclone Sud',
          ja: '3番: 南竜巻',
          cn: '3号：南边龙卷风',
          ko: '약화 3: 남쪽 회오리 중 하나 밟기',
        },
      },
    },
    {
      id: 'A8S Verdict Penalty 3 Orb',
      netRegex: NetRegexes.gainsEffect({ effectId: '40B' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 28,
      // TODO: we could collect who else has penalty 3 to share the orb with?
      // TODO: we could also say who to share north orb with.
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Share last orb after gavel',
          de: 'Orn mach Prozessende teilen',
          fr: 'Partagez l\'orbe après le procès',
          ja: 'そして最後の玉と頭割り',
          cn: '等待锤子判定后分摊最后球',
          ko: '폐정 이후 구슬 남은거 처리',
        },
      },
    },
    {
      id: 'A8S Verdict Nisi A',
      netRegex: NetRegexes.gainsEffect({ effectId: '40C' }),
      condition: Conditions.targetIsYou(),
      // TODO: we could say east or west here after the regulators spawn?
      // TODO: we could also say who to share north orb with.
      // TODO: we could also repeat the share after the regular dies?
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Blue Regulator -> Share 1x North Orb',
          de: 'Blauer Dampfregler -> 1x nördlichen Orb teilen',
          fr: 'Régulateur bleu -> Partagez 1x Orbe Nord',
          ja: '青いスチームジャッジ => 北の玉と頭割り',
          cn: '蓝色小怪然后北边分摊球',
          ko: '파란색 쫄 -> 북쪽 구슬 하나 처리',
        },
      },
    },
    {
      id: 'A8S Verdict Nisi B',
      netRegex: NetRegexes.gainsEffect({ effectId: '40D' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Red Regulator -> Share 1x North Orb',
          de: 'Roter Dampfregler -> 1x nördlichen Orb teilen',
          fr: 'Régulateur rouge -> Partagez 1x Orbe Nord',
          ja: '赤いスチームジャッジ => 北の玉と頭割り',
          cn: '红色小怪然后北边分摊球',
          ko: '빨간색 쫄 -> 북쪽 구슬 하나 처리',
        },
      },
    },
    {
      id: 'A8S Compressed Water',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      alarmText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.waterOnYou();
      },
      infoText: function(data, matches, output) {
        if (data.me !== matches.target)
          return output.waterOn({ player: data.ShortName(matches.target) });
      },
      run: function(data, matches) {
        data.water = matches.target;
      },
      outputStrings: {
        waterOn: {
          en: 'Water on ${player}',
          de: 'Wasser auf ${player}',
          fr: 'Eau sur ${player}',
          ja: '${player}に水',
          cn: '水点${player}',
          ko: '"${player}" 물징',
        },
        waterOnYou: {
          en: 'Water on YOU',
          de: 'Wasser auf DIR',
          fr: 'Eau sur VOUS',
          ja: '自分に水',
          cn: '水点名',
          ko: '물징 대상자',
        },
      },
    },
    {
      id: 'A8S Compressed Water Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '3FF', capture: false }),
      run: function(data) {
        // rip, valiant mine sac
        delete data.water;
      },
    },
    {
      id: 'A8S Compressed Water Soon',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      delaySeconds: function(_data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: function(data, _matches, output) {
        if (!data.water)
          return;
        return output.text({ player: data.ShortName(data.water) });
      },
      outputStrings: {
        text: {
          en: 'Water Soon on ${player}',
          de: 'Wasser bald auf ${player}',
          fr: 'Eau bientôt sur ${player}',
          ja: 'まもなく、${player}に頭割り',
          cn: '马上水分摊${player}',
          ko: '"${player}" 물징 곧 터짐',
        },
      },
    },
    {
      id: 'A8S Final Punch',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '170C' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '170C' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '170C' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '170C' }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '170C' }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '170C' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A8S Final Beam',
      // id is for Final Apocalypse Ability
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '1716', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '1716', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '1716', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '1716', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '1716', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '1716', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack for Final Beam',
          de: 'Stack für Finaler Megastrahl',
          fr: 'Packez-vous pour Mégarayon final',
          ja: 'ファイナルメガビームに頭割り',
          cn: '集合分摊',
          ko: '최후의 고출력 광선 쉐어',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Blaster Mirage': 'Blaster-Replikant',
        'Blaster(?! Mirage)': 'Blaster',
        'Brawler': 'Blechbrecher',
        'Brute Justice': 'Brutalus',
        'Hidden Mine': 'Minenfalle',
        'Onslaughter': 'Schlachter',
        'Steam Chakram': 'Dampf-Chakram',
        'Steam Regulator B': 'β-Dampfregler',
        'Swindler': 'Schwindler',
        'Vortexer': 'Wirbler',
      },
      'replaceText': {
        '--orbs--': '--kugeln--',
        '--regulator check--': '--dampfregler check--',
        '100-Megatonze Shock': '100-Megatonzen-Schock',
        'Apocalyptic Ray': 'Apokalyptischer Strahl ',
        'Attachment': 'Anlegen',
        'Auxiliary Power': 'Notstrom',
        'Ballistic Missile': 'Ballistische Rakete',
        'Blaster': 'Blaster',
        'Blinder': 'Blendgeschoss',
        'Brawler': 'Blechbrecher',
        'Brute Force': 'Brutaler Schlag',
        'Crashing Thunder': 'Brechende Welle',
        'Discoid': 'Diskoid',
        'Double Buster': 'Doppelsprenger',
        'Double Drill Crush': 'Doppeldrill',
        'Double Rocket Punch': 'Doppelraketenschlag',
        'Drill Drive': 'Bohrschub',
        'Earth Missile': 'Erd-Geschoss',
        'Elemental Jammer': 'Elementarstörer',
        'Enumeration': 'Zählen',
        'Execution': 'Exekutive',
        'Eye of the Chakram': 'Auge des Chakrams',
        'Final Apocalypse': 'Finaler Apokalyptischer Strahl',
        'Final Beam': 'Finaler Megastrahl',
        'Final Punch': 'Endgültiger Doppelraketenschlag',
        'Flarethrower': 'Großflammenwerfer',
        'Gavel': 'Prozessende',
        'Height': 'Nivellierung',
        'Hidden Minefield': 'Getarntes Minenfeld',
        'Hydrothermal Missile': 'Hydrothermales Geschoss',
        'Ice Missile': 'Eisgeschoss',
        'J Kick': 'Gewissenstritt',
        'J Storm': 'Gerechter Sturm',
        'J Wave': 'Gerechte Schockwelle',
        'Justice': 'Großer Richter',
        'Legislation': 'Legislative',
        'Link-Up': 'Zusammenschluss',
        'Long Needle': 'Großes Kaliber',
        'Magicked Mark': 'Magiegeschoss',
        'Mechanic': 'Mechanik',
        'Mega Beam': 'Megastrahl',
        'Mind Blast': 'Geiststoß',
        'Mirage': 'Illusion',
        'Missile Command': 'Raketenkommando',
        'Perpetual Ray': 'Perpetueller Strahl',
        'Power Tackle': 'Niederringen',
        'Rocket Drill': 'Raketenbohrer',
        'Seed of the Sky': 'Samen des Himmels',
        'Short Needle': 'Kleines Kaliber',
        'Single Buster': 'Einzelsprenger',
        'Super Cyclone': 'Superzyklon',
        'Super Jump': 'Supersprung',
        'Supercharge': 'Superladung',
        'Swindler': 'Schwindler',
        'Transform': 'Geballte Rechtsgewalt',
        'Ultra Flash': 'Ultrablitz',
        'Verdict': 'Prozesseröffnung',
        'Vortexer': 'Wirbler',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Blaster Mirage': 'Réplique du Fracasseur',
        'Blaster(?! Mirage)': 'Fracasseur',
        'Brawler': 'Bagarreur',
        'Brute Justice': 'Justicier',
        'Hidden Mine': 'Explosion de mine',
        'Onslaughter': 'Attaqueur',
        'Steam Chakram': 'Chakram de vapeur',
        'Steam Regulator B': 'Régulateur de vapeur β',
        'Swindler': 'Arnaqueur',
        'Vortexer': 'Tourbillonneur',
      },
      'replaceText': {
        '--orbs--': '--orbes--',
        '--regulator check--': '--vérification du régulateur--',
        '100-Megatonze Shock': 'Choc de 100 mégatonz',
        'Apocalyptic Ray': 'Rayon apocalyptique',
        'Attachment': 'Extension',
        'Auxiliary Power': 'Soutien énergétique',
        'Ballistic Missile': 'Missiles balistiques',
        'Blaster \\(north\\)': 'Fracasseur (nord)',
        'Blinder': 'Missile aveuglant',
        'Brawler \\(middle\\)': 'Bagarreur (milieu)',
        'Brawler Mechanic': 'Mécanique du Bagarreur',
        'Brute Force': 'Force brute',
        'Crashing Thunder': 'Éclair percutant',
        'Discoid': 'Discoïde',
        'Double Buster': 'Double pulsoréacteur',
        'Double Drill Crush': 'Écrasement foreuse double',
        'Double Rocket Punch': 'Double coup de roquette',
        'Drill Drive': 'Frappe foreuse',
        'Earth Missile': 'Missile de terre',
        'Elemental Jammer': 'Grippage élémentaire',
        'Enumeration': 'Compte',
        'Execution': 'Exécution',
        'Eye of the Chakram': 'Œil du chakram',
        'Final Apocalypse': 'Rayon apocalyptique final',
        'Final Beam': 'Mégarayon final',
        'Final Punch': 'Double coup de roquette final',
        'Flarethrower': 'Lance-brasiers',
        'Gavel': 'Conclusion de procès',
        'Height': 'Dénivellation',
        'Hidden Minefield': 'Champ de mines caché',
        'Hydrothermal Missile': 'Missile hydrothermique',
        'Ice Missile': 'Missile de glace',
        'J Kick': 'Pied justicier',
        'J Storm': 'Tempête justicière',
        'J Wave': 'Onde de choc justicière',
        'Justice': 'Justicier',
        'Legislation': 'Législation',
        'Link-Up': 'Effort collectif',
        'Long Needle': 'Gros missiles',
        'Magicked Mark': 'Tir magique',
        'Mega Beam': 'Mégarayon',
        'Mind Blast\\?': 'Explosion mentale ?',
        'Mirage': 'Mirage',
        'Missile Command': 'Commande missile',
        'Perpetual Ray': 'Rayon perpétuel',
        'Power Tackle': 'Tacle puissant',
        'Rocket Drill': 'Roquette-foreuse',
        'Seed Of The Sky': 'Graine du ciel',
        'Short Needle': 'Petits missiles',
        'Single Buster': 'Pulsoréacteur',
        'Super Cyclone': 'Super cyclone',
        'Super Jump': 'Super saut',
        'Supercharge': 'Super charge',
        'Swindler \\(east\\)': 'Arnaqueur (est)',
        'Transform': 'Assemblage Justicier',
        'Ultra Flash': 'Ultraflash',
        'Verdict': 'Ouverture de procès',
        'Vortexer \\(south\\)': 'Tourbillonneur (sud)',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Blaster Mirage': 'ブラスター・ミラージュ',
        'Blaster(?! Mirage)': 'ブラスター',
        'Brawler': 'ブロウラー',
        'Brute Justice': 'ブルートジャスティス',
        'Hidden Mine': '地雷爆発',
        'Onslaughter': 'オンスローター',
        'Steam Chakram': 'スチームチャクラム',
        'Steam Regulator B': 'スチームジャッジβ',
        'Swindler': 'スウィンドラー',
        'Vortexer': 'ボルテッカー',
      },
      'replaceText': {
        '--orbs--': '--オーブ--',
        '--regulator check--': '--レギュレーターチェック--',
        '\\(east\\)': '(東)',
        '\\(middle\\)': '(中)',
        '\\(north\\)': '(北)',
        '100-Megatonze Shock': '100メガトンズショック',
        'Apocalyptic Ray': 'アポカリプティクレイ',
        'Attachment': 'アタッチメント',
        'Auxiliary Power': 'エネルギー支援',
        'Ballistic Missile': 'ミサイル発射',
        'Blaster': 'ブラスター',
        'Blinder': 'ブラインダーミサイル',
        'Brawler(?! Mechanic)': 'ブロウラー',
        'Brawler Mechanic': 'ブロウラー ギミック',
        'Brute Force': 'ブルートパンチ',
        'Crashing Thunder': 'クラッシュサンダー',
        'Discoid': 'ディスコイド',
        'Double Buster': 'ダブルバスターアタック',
        'Double Drill Crush': 'ダブルドリルクラッシュ',
        'Double Rocket Punch': 'ダブルロケットパンチ',
        'Drill Drive': 'ドリルドライブ',
        'Earth Missile': 'アースミサイル',
        'Elemental Jammer': 'エレメンタルジャミング',
        'Enumeration': 'カウント',
        'Execution': '執行準備',
        'Eye of the Chakram': 'ビームチャクラム',
        'Final Apocalypse': 'ファイナルアポカリプティクレイ',
        'Final Beam': 'ファイナルメガビーム',
        'Final Punch': 'ファイナルダブルロケットパンチ',
        'Flarethrower': '大火炎放射',
        'Gavel': '最後の審判：結審',
        'Height': 'ハイト',
        'Hidden Minefield': 'ステルス地雷散布',
        'Hydrothermal Missile': '蒸気ミサイル',
        'Ice Missile': 'アイスミサイル',
        'J Kick': 'ジャスティスキック',
        'J Storm': 'ジャスティスストーム',
        'J Wave': 'ジャスティスショックウェーブ',
        'Justice': 'ジャスティス合神',
        'Legislation': '法整備',
        'Link-Up': 'システムリンク',
        'Long Needle': '大型ミサイル',
        'Magicked Mark': 'マジックショット',
        'Mega Beam': 'メガビーム',
        'Mind Blast': 'マインドブラスト',
        'Mirage': 'ミラージュシステム',
        'Missile Command': 'ミサイル全弾発射',
        'Perpetual Ray': 'パーペチュアルレイ',
        'Power Tackle': 'パワータックル',
        'Rocket Drill': 'ロケットドリル',
        'Seed of the Sky': 'シード・オブ・スカイ',
        'Short Needle': '小型ミサイル',
        'Single Buster': 'バスターアタック',
        'Super Cyclone': 'スーパーサイクロン',
        'Super Jump': 'スーパージャンプ',
        'Supercharge': 'スーパーチャージ',
        'Swindler': 'スウィンドラー',
        'Transform': 'ジャスティス合体',
        'Ultra Flash': 'ウルトラフラッシュ',
        'Verdict': '最後の審判：開廷',
        'Vortexer': 'ボルテッカー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Blaster Mirage': '爆破者幻象',
        'Blaster(?! Mirage)': '爆破者',
        'Brawler': '争斗者',
        'Brute Justice': '残暴正义号',
        'Hidden Mine': '地雷爆炸',
        'Onslaughter': '突击者',
        'Steam Chakram': '蒸汽战轮',
        'Steam Regulator B': '蒸汽调整者β',
        'Swindler': '欺诈者',
        'Vortexer': '环旋者',
      },
      'replaceText': {
        '--orbs--': '--球--',
        '--regulator check--': '--调节器检查--',
        '100-Megatonze Shock': '亿万吨震荡',
        'Apocalyptic Ray': '末世宣言',
        'Attachment': '配件更换',
        'Auxiliary Power': '能量支援',
        'Ballistic Missile': '导弹发射',
        'Blaster': '冲击波',
        'Blinder': '混合导弹',
        'Brawler': '争斗者',
        'Brute Force': '残暴铁拳',
        'Crashing Thunder': '冲击雷',
        'Discoid': '圆盘',
        'Double Buster': '双重破坏炮击',
        'Double Drill Crush': '双重飞钻冲击',
        'Double Rocket Punch': '双重火箭飞拳',
        'Drill Drive': '钻头驱动',
        'Earth Missile': '大地导弹',
        'Elemental Jammer': '元素干扰',
        'Enumeration': '计数',
        'Execution': '执行准备',
        'Eye of the Chakram': '激光战轮',
        'Final Apocalypse': '终极末世宣言',
        'Final Beam': '终极巨型光束炮',
        'Final Punch': '终极双重火箭飞拳',
        'Flarethrower': '大火炎放射',
        'Gavel': '终审闭庭',
        'Height': '高度算术',
        'Hidden Minefield': '隐形地雷散布',
        'Hydrothermal Missile': '蒸汽导弹',
        'Ice Missile': '寒冰导弹',
        'J Kick': '正义飞踢',
        'J Storm': '正义风暴',
        'J Wave': '正义震荡波',
        'Justice': '正义合神',
        'Legislation': '法制整顿',
        'Link-Up': '系统连接',
        'Long Needle': '大型导弹',
        'Magicked Mark': '魔力射击',
        'Mechanic': '争斗者变形',
        'Mega Beam': '巨型光束炮',
        'Mind Blast': '精神冲击',
        'Mirage': '幻影系统',
        'Missile Command': '导弹齐发',
        'Perpetual Ray': '永恒射线',
        'Power Tackle': '强力前冲拳',
        'Rocket Drill': '火箭飞钻',
        'Seed of the Sky': '天空之种',
        'Short Needle': '小型导弹',
        'Single Buster': '破坏炮击',
        'Super Cyclone': '超级气旋',
        'Super Jump': '超级跳跃',
        'Supercharge': '超突击',
        'Swindler': '欺诈者',
        'Transform': '正义合体',
        'Ultra Flash': '究极闪光',
        'Verdict': '终审开庭',
        'Vortexer': '环旋者',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Blaster Mirage': '폭파자의 환영',
        'Blaster(?! Mirage)': '폭파자',
        'Brawler': '폭격자',
        'Brute Justice': '포악한 심판자',
        'Hidden Mine': '지뢰 폭발',
        'Onslaughter': '맹습자',
        'Steam Chakram': '증기 차크람',
        'Steam Regulator B': '증기 감독 β',
        'Swindler': '조작자',
        'Vortexer': '교반자',
      },
      'replaceText': {
        '--orbs--': '--구슬--',
        '--regulator check--': '--증기 감옥 확인--',
        '100-Megatonze Shock': '100메가톤즈 충격',
        'Apocalyptic Ray': '파멸 계시',
        'Attachment': '무기 장착',
        'Auxiliary Power': '에너지 지원',
        'Ballistic Missile': '미사일 발사',
        'Blaster \\(north\\)': '폭파자 (북쪽)',
        'Blinder': '섬광 미사일',
        'Brawler \\(middle\\)': '폭격자 (중앙)',
        'Brawler Mechanic': '한손/양손 버스터/드릴',
        'Brute Force': '폭력적인 주먹',
        'Crashing Thunder': '충격의 번개',
        'Discoid': '원반',
        'Double Buster': '양손 버스터',
        'Double Drill Crush': '양손 드릴 분쇄',
        'Double Rocket Punch': '양손 로켓 주먹',
        'Drill Drive': '드릴 구동',
        'Earth Missile': '대지 미사일',
        'Elemental Jammer': '원소 간섭',
        'Enumeration': '계산',
        'Execution': '집행 준비',
        'Eye of the Chakram': '광선 차크람',
        'Final Apocalypse': '최후의 파멸 계시',
        'Final Beam': '최후의 고출력 광선',
        'Final Punch': '최후의 양손 로켓 주먹',
        'Flarethrower': '대화염방사',
        'Gavel': '최후의 심판: 폐정',
        'Height': '고도',
        'Hidden Minefield': '은폐 지뢰 살포',
        'Hydrothermal Missile': '증기 미사일',
        'Ice Missile': '얼음 미사일',
        'J Kick': '정의의 발차기',
        'J Storm': '정의의 폭풍',
        'J Wave': '정의의 충격파',
        'Justice': '정의의 합신',
        'Legislation': '법률 정비',
        'Link-Up': '시스템 연결',
        'Long Needle': '대형 미사일',
        'Magicked Mark': '마법 사격',
        'Mega Beam': '고출력 광선',
        'Mind Blast': '정신파괴',
        'Mirage': '환영 시스템',
        'Missile Command': '미사일 전탄 발사',
        'Perpetual Ray': '영원한 빛줄기',
        'Power Tackle': '강력 들이받기',
        'Rocket Drill': '한손 드릴',
        'Seed of the Sky': '하늘의 원천',
        'Short Needle': '소형 미사일',
        'Single Buster': '한손 버스터',
        'Super Cyclone': '대형 돌개바람',
        'Super Jump': '슈퍼 점프',
        'Supercharge': '강력 돌진',
        'Swindler': '조작자',
        'Transform': '정의의 합체',
        'Ultra Flash': '초섬광',
        'Verdict': '최후의 심판: 개정',
        'Vortexer': '교반자',
      },
    },
  ],
};
