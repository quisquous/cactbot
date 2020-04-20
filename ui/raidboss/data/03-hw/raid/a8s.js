'use strict';

// TODO: Final Punishment stack counts are in the network log, but not in ACT log :C
// e.g. 4 stacks:
//   26|2020-02-08T21:03:07.8080000-08:00|403|Final Punishment|
//   39.95|E0000000||1068E9CB|Potato Chippy|04|19062|||0bd20f2b57d49b17a19caa10e1fb8734
// TODO: chakram safe spots lol?

[{
  zoneRegex: {
    en: /^Alexander - The Burden Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章4\)$/,
  },
  timelineFile: 'a8s.txt',
  timelineTriggers: [
    {
      id: 'A8S Hydrothermal Missile',
      regex: /Hydrothermal Missile/,
      beforeSeconds: 3,
      response: Responses.tankCleave('info'),
    },
    {
      id: 'A8S Swindler Add',
      regex: /Swindler/,
      beforeSeconds: 5,
      infoText: {
        en: 'Swindler Soon',
        de: 'Bald Schwindler',
        cn: '欺诈者即将出现',
      },
    },
    {
      id: 'A8S Vortexer Add',
      regex: /Vortexer/,
      beforeSeconds: 5,
      infoText: {
        en: 'Vortexer Soon',
        de: 'Bald Vortexer',
        cn: '环旋者即将出现',
      },
    },
    {
      id: 'A8S Flarethrower',
      regex: /Flarethrower/,
      beforeSeconds: 3,
      response: Responses.tankCleave('info'),
    },
    {
      id: 'A8S Super Jump Soon',
      regex: /Super Jump/,
      beforeSeconds: 8,
      infoText: {
        en: 'Bait Super Jump',
        de: 'Supersprung ködern',
        cn: '引导超级跳',
      },
    },
  ],
  triggers: [
    {
      id: 'A8S Megabeam Onslaughter',
      regex: Regexes.startsUsing({ source: 'Onslaughter', id: '162E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Schlachter', id: '162E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Attaqueur', id: '162E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'オンスローター', id: '162E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '突击者', id: '162E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '맹습자', id: '162E', capture: false }),
      // Insert sound effect from Arthars here.
      alertText: {
        en: 'Megabeamu~',
        cn: '巨型光束炮~',
      },
    },
    {
      id: 'A8S Megabeam Brute Justice',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '1664', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '1664', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '1664', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '1664', capture: false }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '1664', capture: false }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '1664', capture: false }),
      alertText: {
        en: 'Megabeamu~!',
        cn: '巨型光束炮~!',
      },
    },
    {
      id: 'A8S Execution',
      regex: Regexes.ability({ source: 'Onslaughter', id: '1632', capture: false }),
      regexDe: Regexes.ability({ source: 'Schlachter', id: '1632', capture: false }),
      regexFr: Regexes.ability({ source: 'Attaqueur', id: '1632', capture: false }),
      regexJa: Regexes.ability({ source: 'オンスローター', id: '1632', capture: false }),
      regexCn: Regexes.ability({ source: '突击者', id: '1632', capture: false }),
      regexKo: Regexes.ability({ source: '맹습자', id: '1632', capture: false }),
      condition: function(data) {
        return data.role == 'dps' || data.job == 'blu';
      },
      infoText: {
        en: 'Kill Regulators',
        de: 'Dampfregler besiegen',
        cn: '击杀小怪',
      },
    },
    {
      id: 'A8S Perpetual Ray',
      regex: Regexes.startsUsing({ source: 'Onslaughter', id: '162B' }),
      regexDe: Regexes.startsUsing({ source: 'Schlachter', id: '162B' }),
      regexFr: Regexes.startsUsing({ source: 'Attaqueur', id: '162B' }),
      regexJa: Regexes.startsUsing({ source: 'オンスローター', id: '162B' }),
      regexCn: Regexes.startsUsing({ source: '突击者', id: '162B' }),
      regexKo: Regexes.startsUsing({ source: '맹습자', id: '162B' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A8S Blaster Mirage',
      regex: Regexes.addedCombatant({ name: 'Blaster Mirage', capture: false }),
      infoText: {
        en: 'Mirage',
        de: 'Mirage',
        cn: '分身即',
      },
    },
    {
      id: 'A8S Discoid',
      regex: Regexes.headMarker({ id: '0023' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Orb on YOU',
        de: 'Orb auf DIR',
        cn: '球点名',
      },
    },
    {
      id: 'A8S Mind Blast',
      regex: Regexes.startsUsing({ source: 'Blaster', id: '1639' }),
      regexDe: Regexes.startsUsing({ source: 'Blaster', id: '1639' }),
      regexFr: Regexes.startsUsing({ source: 'Fracasseur', id: '1639' }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター', id: '1639' }),
      regexCn: Regexes.startsUsing({ source: '爆破者', id: '1639' }),
      regexKo: Regexes.startsUsing({ source: '폭파자', id: '1639' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'A8S Low Arithmeticks',
      // Note: both high and low use '0025' headmarker
      regex: Regexes.gainsEffect({ effect: 'Low Arithmeticks' }),
      regexDe: Regexes.gainsEffect({ effect: 'Biomathematik-Ebene 1' }),
      regexFr: Regexes.gainsEffect({ effect: 'Calcul De Dénivelé 1' }),
      regexJa: Regexes.gainsEffect({ effect: '算術：ハイト1' }),
      regexCn: Regexes.gainsEffect({ effect: '算术：高度1' }),
      regexKo: Regexes.gainsEffect({ effect: '산술: 고도 1' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 5,
      suppressSeconds: 5,
      alertText: {
        en: 'Get High',
        de: 'Geh nach Oben',
        cn: '上高台',
      },
    },
    {
      id: 'A8S High Arithmeticks',
      regex: Regexes.gainsEffect({ effect: 'High Arithmeticks' }),
      regexDe: Regexes.gainsEffect({ effect: 'Biomathematik-Ebene 2' }),
      regexFr: Regexes.gainsEffect({ effect: 'Calcul De Dénivelé 2' }),
      regexJa: Regexes.gainsEffect({ effect: '算術：ハイト2' }),
      regexCn: Regexes.gainsEffect({ effect: '算术：高度2' }),
      regexKo: Regexes.gainsEffect({ effect: '산술: 고도 2' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 5,
      suppressSeconds: 5,
      alertText: {
        en: 'Get Down',
        de: 'Geh nach Unten',
        cn: '下低台',
      },
    },
    {
      id: 'A8S Bio-Arithmeticks',
      regex: Regexes.startsUsing({ source: 'Swindler', id: '164A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Schwindler', id: '164A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arnaqueur', id: '164A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'スウィンドラー', id: '164A', capture: false }),
      regexCn: Regexes.startsUsing({ source: '欺诈者', id: '164A', capture: false }),
      regexKo: Regexes.startsUsing({ source: '조작자', id: '164A', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A8S Super Cyclone',
      regex: Regexes.startsUsing({ source: 'Vortexer', id: '1657', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Wirbler', id: '1657', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Tourbillonneur', id: '1657', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ボルテッカー', id: '1657', capture: false }),
      regexCn: Regexes.startsUsing({ source: '环旋者', id: '1657', capture: false }),
      regexKo: Regexes.startsUsing({ source: '교반자', id: '1657', capture: false }),
      response: Responses.knockback('alarm'),
    },
    {
      id: 'A8S Compressed Lightning',
      // Note: also the 0045 headmarker.
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression Électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '雷属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '번개속성 압축' }),
      // TODO: do we need a Responses.effectOn() that uses matches.effect?
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Thunder on YOU',
            de: 'Blitz auf DIR',
            cn: '雷点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Thunder on ' + data.ShortName(matches.target),
            de: 'Blitz auf ' + data.ShortName(matches.target),
            cn: '雷点' + data.ShortName(matches.target),
          };
        }
      },
      run: function(data, matches) {
        data.lightning = matches.target;
      },
    },
    {
      id: 'A8S Compressed Lightning Lose',
      regex: Regexes.losesEffect({ effect: 'Compressed Lightning', capture: false }),
      regexDe: Regexes.losesEffect({ effect: 'Blitzkompression', capture: false }),
      regexFr: Regexes.losesEffect({ effect: 'Compression Électrique', capture: false }),
      regexJa: Regexes.losesEffect({ effect: '雷属性圧縮', capture: false }),
      regexCn: Regexes.losesEffect({ effect: '雷属性压缩', capture: false }),
      regexKo: Regexes.losesEffect({ effect: '번개속성 압축', capture: false }),
      run: function(data) {
        delete data.lightning;
      },
    },
    {
      id: 'A8S Compressed Lightning Soon',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression Électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '雷属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '번개속성 압축' }),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: function(data) {
        if (!data.lightning)
          return;
        return {
          en: 'Thunder Soon on ' + data.ShortName(data.lightning),
          de: 'Blitz bald auf ' + data.ShortName(data.lightning),
          cn: '马上雷分摊' + data.ShortName(data.lightning),
        };
      },
    },
    {
      id: 'A8S Enumeration',
      regex: Regexes.headMarker({ id: ['0040', '0041', '0042'] }),
      infoText: function(data, matches) {
        // 0040 = 2, 0041 = 3, 0042 = 4
        let count = 2 + parseInt(matches.id, 16) - parseInt('0040', 16);
        return {
          en: data.ShortName(matches.target) + ': ' + count,
          de: data.ShortName(matches.target) + ': ' + count,
          cn: data.ShortName(matches.target) + '生命计算法: ' + count,
        };
      },
    },
    {
      id: 'A8S Double Rocket Punch',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '1663' }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '1663' }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '1663' }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '1663' }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '1663' }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '1663' }),
      condition: Conditions.caresAboutPhysical(),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shared Tankbuster on YOU',
            de: 'geteilter Tankbuster auf DIR',
            ja: '自分にタンクシェア',
            fr: 'Tankbuster partagé sur vous',
            ko: '나에게 쉐어 탱크버스터',
            cn: '分摊死刑点名',
          };
        }
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Shared Tankbuster on ' + data.ShortName(matches.target),
            de: 'geteilter Tankbuster on ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + ' にタンクシェア',
            fr: 'Tankbuster partagé sur ' + data.ShortName(matches.target),
            ko: '쉐어 탱크버스터 대상: ' + data.ShortName(matches.target),
            cn: '分摊死刑点 ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A8S Long Needle Stack Collect',
      regex: Regexes.headMarker({ id: '003E' }),
      run: function(data, matches) {
        data.longNeedleStack = matches.target;
      },
    },
    {
      id: 'A8S Long Needle Prey Collect',
      regex: Regexes.headMarker({ id: '001E' }),
      run: function(data, matches) {
        data.longNeedlePrey = data.longNeedlePrey || [];
        data.longNeedlePrey.push(matches.target);
      },
    },
    {
      id: 'A8S Short Needle',
      regex: Regexes.ability({ source: 'Brute Justice', id: '1668', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '1668', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '1668', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '1668', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '1668', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '1668', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A8S Long Needle',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '166A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '166A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '166A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '166A', capture: false }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '166A', capture: false }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '166A', capture: false }),
      condition: function(data) {
        return data.longNeedleStack && data.longNeedlePrey;
      },
      suppressSeconds: 10,
      alarmText: function(data) {
        if (data.longNeedlePrey.includes(data.me)) {
          return {
            en: 'Prey: Get Out',
            de: 'Makiert: Geh raus',
            cn: '红点名离开人群',
          };
        }
      },
      alertText: function(data) {
        if (data.longNeedlePrey.includes(data.me))
          return;
        let target = data.longNeedleStack;
        if (target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(target),
          de: 'Auf ' + data.ShortName(target) + ' sammeln',
          fr: 'Packez-vous sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'にスタック',
          cn: '靠近 ' + data.ShortName(target) + '集合',
          ko: '쉐어징 → ' + data.ShortName(target),
        };
      },
      run: function(data) {
        delete data.longNeedleStack;
        delete data.longNeedlePrey;
      },
    },
    {
      id: 'A8S Super Jump',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '1665' }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '1665' }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '1665' }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '1665' }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '1665' }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '1665' }),
      alertText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Super Jump on YOU',
          de: 'Supersprung auf DIR',
          cn: '超级跳点名',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Super Jump on ' + data.ShortName(matches.target),
          de: 'Supersprung auf ' + data.ShortName(matches.target),
          cn: '超级跳点' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A8S Mirage Marker',
      regex: Regexes.headMarker({ id: '0008' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Mirage on YOU',
        de: 'Mirage auf DIR',
        cn: '分身点名',
      },
    },
    {
      id: 'A8S Ice Missile Marker',
      regex: Regexes.headMarker({ id: '0043' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Ice Missile on YOU',
        de: 'Eis-Rakete auf DIR',
        cn: '冰点名',
      },
    },
    {
      id: 'A8S Hidden Minefield Intermission',
      // 165E used in both intermission and in final phase
      // 165C only used for intermission
      regex: Regexes.ability({ source: 'Hidden Mine', id: '165E', capture: false }),
      regexDe: Regexes.ability({ source: 'Minenfalle', id: '165E', capture: false }),
      regexFr: Regexes.ability({ source: 'Mine Furtive', id: '165E', capture: false }),
      regexJa: Regexes.ability({ source: 'ステルス地雷', id: '165E', capture: false }),
      regexCn: Regexes.ability({ source: '隐形地雷', id: '165E', capture: false }),
      regexKo: Regexes.ability({ source: '은폐 지뢰', id: '165E', capture: false }),
      condition: function(data) {
        return !data.seenLinkUp;
      },
      suppressSeconds: 10,
      infoText: {
        en: 'Get Mines',
        de: 'Mienen nehmen',
        fr: 'Prenez les mines',
        cn: '踩雷',
      },
    },
    {
      id: 'A8S Mirage Blinder',
      regex: Regexes.startsUsing({ source: 'Blaster Mirage', id: '165A' }),
      regexDe: Regexes.startsUsing({ source: 'Blaster-Replikant', id: '165A' }),
      regexFr: Regexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '165A' }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '165A' }),
      regexCn: Regexes.startsUsing({ source: '爆破者幻象', id: '165A' }),
      regexKo: Regexes.startsUsing({ source: '폭파자의 환영', id: '165A' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Look Away from Mirage',
        de: 'Von Replikant wegschauen',
        fr: 'Ne regardez pas la réplique',
        cn: '背对幻象',
      },
    },
    {
      id: 'A8S Mirage Power Tackle',
      regex: Regexes.startsUsing({ source: 'Blaster Mirage', id: '165B' }),
      regexDe: Regexes.startsUsing({ source: 'Blaster-Replikant', id: '165B' }),
      regexFr: Regexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '165B' }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '165B' }),
      regexCn: Regexes.startsUsing({ source: '爆破者幻象', id: '165B' }),
      regexKo: Regexes.startsUsing({ source: '폭파자의 환영', id: '165B' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Look Towards Mirage',
        de: 'Zu Replikant hinschauen',
        fr: 'Regardez la réplique',
        cn: '面向幻象',
      },
    },
    {
      id: 'A8S Link Up',
      regex: Regexes.ability({ source: 'Brute Justice', id: '1673', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '1673', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '1673', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '1673', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '1673', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '1673', capture: false }),
      run: function(data) {
        data.seenLinkUp = true;
      },
    },
    {
      id: 'A8S Verdict Min HP',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Min Hp' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Minimal-Lp' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Plus Bas Pv' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：Hp最小' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：体力最小' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: Hp 최소' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      alertText: {
        en: 'Min HP: Provoke Boss => Late NE Tornado',
        de: 'Min HP: Boss herrausfordern => Später No Tornado',
        cn: '最少HP:挑衅BOSS=>东北龙卷风',
      },
    },
    {
      id: 'A8S Verdict Min HP Collect',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Min Hp' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Minimal-Lp' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Plus Bas Pv' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：Hp最小' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：体力最小' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: Hp 최소' }),
      run: function(data, matches) {
        data.verdictMin = matches.target;
      },
    },
    {
      id: 'A8S Verdict Min HP Tornado',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Min Hp' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Minimal-Lp' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Plus Bas Pv' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：Hp最小' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：体力最小' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: Hp 최소' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 27,
      alarmText: {
        en: 'Get NE Tornado',
        de: 'Nimm NO Tornado',
        cn: '去东北龙卷风',
      },
    },
    {
      id: 'A8S Verdict Max HP Collect',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Max Hp' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Maximal-Lp' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Plus Hauts Pv' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：Hp最大' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：体力最大' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: Hp 최대' }),
      run: function(data, matches) {
        data.verdictMax = matches.target;
      },
    },
    {
      id: 'A8S Verdict Max HP',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Max Hp' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Maximal-Lp' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Plus Hauts Pv' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：Hp最大' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：体力最大' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: Hp 최대' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Max HP: Provoke Boss Second',
        de: 'Max HP: Boss als Zweites herrausfordern',
        cn: '最多HP:第二个挑衅BOSS',
      },
    },
    {
      id: 'A8S Verdict Max HP Provoke',
      regex: Regexes.losesEffect({ effect: 'Final Punishment' }),
      regexDe: Regexes.losesEffect({ effect: 'Letzte Züchtigung' }),
      regexFr: Regexes.losesEffect({ effect: 'Punition Ultime' }),
      regexJa: Regexes.losesEffect({ effect: '最後の体罰' }),
      regexCn: Regexes.losesEffect({ effect: '最终体罚' }),
      regexKo: Regexes.losesEffect({ effect: '최후의 체벌' }),
      condition: function(data, matches) {
        return matches.target == data.verdictMin && data.me == data.verdictMax;
      },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss herrausfordern',
        cn: '挑衅BOSS',
      },
    },
    {
      id: 'A8S Verdict Max HP Blu Devour',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Max Hp' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Maximal-Lp' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Plus Hauts Pv' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：Hp最大' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：体力最大' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: Hp 최대' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.job == 'blu';
      },
      delaySeconds: 27,
      alarmText: {
        en: 'Use Devour',
        de: 'Benutze Verschlingen',
        cn: '使用捕食',
      },
    },
    {
      id: 'A8S Verdict Penalty 1',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty I' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Schwächung 1' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: 1 Altération' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：デバフ1' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：弱化状态1' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 약화 1' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      // TODO: we could say who to share north orbs with?
      // TODO: we could also repeat the "share north orbs" after sw orb Explosion.
      alertText: {
        en: 'Penalty 1: SW orb -> Share 2x North Orbs',
        de: 'Schwächung 1: SW orb -> 2x nördliche Orbs teilen',
        cn: '1号：吃西南球然后分摊北边双球',
      },
    },
    {
      id: 'A8S Verdict Penalty 2',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty II' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Schwächung 2' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: 2 Altérations' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：デバフ2' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：弱化状态2' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 약화 2' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Penalty 2: NW Tornado',
        de: 'Schwächung 2: NW Tornado',
        cn: '2号：西北龙卷风',
      },
    },
    {
      id: 'A8S Verdict Penalty 3',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty III' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Schwächung 3' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: 3 Altérations' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：デバフ3' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：弱化状态3' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 약화 3' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Penalty 3: Get a South Tornado',
        de: 'Schwächung 3: Nimm südlichen Tornado',
        cn: '2号：南边龙卷风',
      },
    },
    {
      id: 'A8S Verdict Penalty 3 Orb',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty III' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Schwächung 3' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: 3 Altérations' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：デバフ3' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：弱化状态3' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 약화 3' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 28,
      // TODO: we could collect who else has penalty 3 to share the orb with?
      // TODO: we could also say who to share north orb with.
      infoText: {
        en: 'Share last orb after gavel',
        de: 'Orn mach Prozessende teilen',
        cn: '等待锤子判定后分摊最后球',
      },
    },
    {
      id: 'A8S Verdict Nisi A',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi A' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Vorläufiges Urteil Α' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Peine Provisoire Α' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：仮判決Α' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：判决Α' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 임시 판결 Α' }),
      condition: Conditions.targetIsYou(),
      // TODO: we could say east or west here after the regulators spawn?
      // TODO: we could also say who to share north orb with.
      // TODO: we could also repeat the share after the regular dies?
      infoText: {
        en: 'Blue Regulator -> Share 1x North Orb',
        de: 'Blauer Dampfregler -> 1x nördlichen Orb teilen',
        cn: '蓝色小怪然后北边分摊球',
      },
    },
    {
      id: 'A8S Verdict Nisi B',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi B' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess Über Vorläufiges Urteil Β' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction: Peine Provisoire Β' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：仮判決Β' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：判决Β' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 임시 판결 Β' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Red Regulator -> Share 1x North Orb',
        de: 'Roter Dampfregler -> 1x nördlichen Orb teilen',
        cn: '红色小怪然后北边分摊球',
      },
    },
    {
      id: 'A8S Compressed Water',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression Aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Water on YOU',
            de: 'Wasser auf DIR',
            cn: '水点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Water on ' + data.ShortName(matches.target),
            de: 'Wasser auf ' + data.ShortName(matches.target),
            cn: '水点'+ data.ShortName(matches.target),
          };
        }
      },
      run: function(data, matches) {
        data.water = matches.target;
      },
    },
    {
      id: 'A8S Compressed Water Lose',
      regex: Regexes.losesEffect({ effect: 'Compressed Water', capture: false }),
      regexDe: Regexes.losesEffect({ effect: 'Wasserkompression', capture: false }),
      regexFr: Regexes.losesEffect({ effect: 'Compression Aqueuse', capture: false }),
      regexJa: Regexes.losesEffect({ effect: '水属性圧縮', capture: false }),
      regexCn: Regexes.losesEffect({ effect: '水属性压缩', capture: false }),
      regexKo: Regexes.losesEffect({ effect: '물속성 압축', capture: false }),
      run: function(data) {
        // rip, valiant mine sac
        delete data.water;
      },
    },
    {
      id: 'A8S Compressed Water Soon',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression Aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: function(data) {
        if (!data.water)
          return;
        return {
          en: 'Water Soon on ' + data.ShortName(data.water),
          de: 'Wasser bald auf ' + data.ShortName(matches.target),
          cn: '马上水分摊' + data.ShortName(data.water),
        };
      },
    },
    {
      id: 'A8S Final Punch',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '170C' }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '170C' }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '170C' }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '170C' }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '170C' }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '170C' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A8S Final Beam',
      // id is for Final Apocalypse Ability
      regex: Regexes.ability({ source: 'Brute Justice', id: '1716', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '1716', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '1716', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '1716', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '1716', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '1716', capture: false }),
      infoText: {
        en: 'Stack for Final Beam',
        de: 'Stack für Finaler Megastrahl',
        cn: '集合分摊',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'Vortexer': '环旋者',
        'Swindler': '欺诈者',
        'Steam Regulator B': '蒸汽调整者β',
        'Steam Regulator A': '蒸汽调整者α',
        'Steam Gasket': '蒸汽垫',
        'Power Plasma Gamma': '强离子体γ',
        'Power Plasma Beta': '强离子体β',
        'Onslaughter': '突击者',
        'J Storm': '正义旋风',
        'Hidden Mine': '隐形地雷',
        'Brute Justice': '残暴正义号',
        'Brawler': '争斗者',
        'Blaster Mirage': '爆破者幻象',
        'Blaster(?! Mirage)': '爆破者',
        'Eye Of The Chakram': '战轮光束',
        'Steam Chakram': '蒸汽战轮',
      },
      'replaceText': {
        'attack': '攻击',
        'Verdict': '终审开庭',
        'Unknown Ability': 'Unknown Ability',
        'Ultra Power Plasma': '究极强离子',
        'Ultra Flash': '究极闪光',
        'Transform': '正义合体',
        'Supercharge': '超突击',
        'Super Jump': '超级跳跃',
        'Super Cyclone': '超级气旋',
        'Single Buster': '破坏炮击',
        'Short Needle': '小型导弹',
        'Self-detonate': '自爆',
        'Seed of the Sky': '天空之种',
        'Rocket Drill': '火箭飞钻',
        'Power Tackle': '强力前冲拳',
        'Power Plasma': '强离子',
        'Perpetual Ray': '永恒射线',
        'Missile Command': '导弹齐发',
        'Mirage': '幻影系统',
        '(?<! )Minefield(?! )': '地雷散布',
        'Mind Blast': '精神冲击',
        'Mega Beam': '巨型光束炮',
        'Magicked Mark': '魔力射击',
        'Long Needle': '大型导弹',
        'Legislation': '法制整顿',
        'Justice': '正义合神',
        'J Kick': '正义飞踢',
        'Ice Missile': '寒冰导弹',
        'Hydrothermal Missile': '蒸汽导弹',
        'Hidden Minefield': '隐形地雷散布',
        'Hidden Mine(?!field)': '地雷爆炸',
        'Height': '高度算术',
        'Gavel': '终审闭庭',
        'Gale Force': '暴风',
        'Flarethrower': '大火炎放射',
        'Final Punch': '终极双重火箭飞拳',
        'Final Beam': '终极巨型光束炮',
        'Final Apocalypse': '终极末世宣言',
        'Eye of the Chakram': '战轮光束',
        'Explosion': '爆炸',
        'Execution': '执行准备',
        'Elemental Jammer': '元素干扰',
        'Earth Missile': '大地导弹',
        'Drill Drive': '钻头驱动',
        'Double Rocket Punch': '双重火箭飞拳',
        'Double Drill Crush': '双重飞钻冲击',
        'Double Buster': '双重破坏炮击',
        'Discoid': '圆盘',
        'Discharge': '枪击',
        'Crashing Wave': '冲击波',
        'Brute Force': '残暴铁拳',
        'Blinder': '混合导弹',
        'Bio-arithmeticks': '生命计算术',
        'Ballistic Missile': '导弹发射',
        'Attachment': '配件更换',
        'Apocalyptic Ray': '末世宣言',
        '100-Megatonze Shock': '亿万吨震荡',
        'Seed Of The Sky': '天空之种',
        'regulator check': '调节器检查',
        'orbs': '球',
        'Blaster': '爆破者（北）',
        'Brawler': '争斗者',
        'Auxiliary Power': '辅助电源',
        'Mechanic': '争斗者变形',
        'Swindler': '欺诈者（东）',
        'Vortexer': '环旋者（南）',
        'Crashing Thunder': '雷死刑',
        'Eye Of The Chakram': '战轮光束',
        'Enumeration': '计数',
        'Link-Up': '升起',
        'J Storm': '正义风暴',
        'J Wave': '正义震荡波',
        'Chakrams Spawn': '飞盘',
        '--targetable\\?--': '--可选中？--',
      },
      '~effectNames': {
        'Prey': '猎物',
        'Magic Damage Up': '魔法伤害提高',
        'Low Arithmeticks': '算术：高度1',
        'High Arithmeticks': '算术：高度2',
        'HP Boost': '体力增加',
        'Final Punishment': '最终体罚',
        'Final Judgment: Penalty III': '终审：弱化状态3',
        'Final Judgment: Penalty II': '终审：弱化状态2',
        'Final Judgment: Penalty I': '终审：弱化状态1',
        'Final Judgment: Min HP': '终审：体力最小',
        'Final Judgment: Max HP': '终审：体力最大',
        'Final Judgment: Decree Nisi B': '终审：判决β',
        'Final Judgment: Decree Nisi A': '终审：判决α',
        'Final Flight': '最终风葬',
        'Final Decree Nisi B': '最终判决β',
        'Final Decree Nisi A': '最终判决α',
        'Direct Attack': '直接攻击',
        'Compressed Water': '水属性压缩',
        'Compressed Lightning': '雷属性压缩',
        'Bind+': '止步＋',
        'Allied Arithmeticks': '算术：己方数',
      },
    },
  ],
}];
