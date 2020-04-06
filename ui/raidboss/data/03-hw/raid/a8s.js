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
      id: 'A8S Robot Mirage',
      regex: /Mirage Add/,
      beforeSeconds: 5,
      infoText: {
        en: 'Mirage Soon',
        cn: '分身即将出现',
      },
    },
    {
      id: 'A8S Swindler Add',
      regex: /Swindler/,
      beforeSeconds: 5,
      infoText: {
        en: 'Swindler Soon',
        cn: '欺诈者即将出现',
      },
    },
    {
      id: 'A8S Vortexer Add',
      regex: /Vortexer/,
      beforeSeconds: 5,
      infoText: {
        en: 'Vortexer Soon',
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
        cn: '引导超级跳',
      },
    },
  ],
  triggers: [
    {
      id: 'A8S Execution',
      regex: Regexes.ability({ source: 'Onslaughter', id: '1632', capture: false }),
      condition: function(data) {
        return data.role == 'dps' || data.job == 'blu';
      },
      infoText: {
        en: 'Kill Regulators',
        cn: '击杀小怪',
      },
    },
    {
      id: 'A8S Perpetual Ray',
      regex: Regexes.startsUsing({ source: 'Onslaughter', id: '162B' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A8S Discoid',
      regex: Regexes.headMarker({ id: '0023' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Orb on YOU',
        cn: '球点名',
      },
    },
    {
      id: 'A8S Mind Blast',
      regex: Regexes.startsUsing({ source: 'Blaster', id: '1639' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'A8S Low Arithmeticks',
      // Note: both high and low use '0025' headmarker
      regex: Regexes.gainsEffect({ effect: 'Low Arithmeticks' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Get High',
        cn: '上高台',
      },
    },
    {
      id: 'A8S High Arithmeticks',
      regex: Regexes.gainsEffect({ effect: 'High Arithmeticks' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Get Down',
        cn: '下低台',
      },
    },
    {
      id: 'A8S Bio-Arithmeticks',
      regex: Regexes.startsUsing({ source: 'Swindler', id: '164A', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A8S Super Cyclone',
      regex: Regexes.startsUsing({ source: 'Vortexer', id: '1657', capture: false }),
      response: Responses.knockback('alarm'),
    },
    {
      id: 'A8S Compressed Lightning',
      // Note: also the 0045 headmarker.
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      // TODO: do we need a Responses.effectOn() that uses matches.effect?
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Thunder on YOU',
            cn: '雷点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Thunder on ' + data.ShortName(matches.target),
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
      run: function(data) {
        delete data.lightning;
      },
    },
    {
      id: 'A8S Compressed Lightning Soon',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: function(data) {
        if (!data.lightning)
          return;
        return {
          en: 'Thunder Soon on ' + data.ShortName(data.lightning),
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
          cn: data.ShortName(matches.target) + '生命计算法: ' + count,
        };
      },
    },
    {
      id: 'A8S Double Rocket Punch',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '1663' }),
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
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A8S Long Needle',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '166A', capture: false }),
      condition: function(data) {
        return data.longNeedleStack && data.longNeedlePrey;
      },
      suppressSeconds: 10,
      alarmText: function(data) {
        if (data.longNeedlePrey.includes(data.me)) {
          return {
            en: 'Prey: Get Out',
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
      alertText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Super Jump on YOU',
          cn: '超级跳点名',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Super Jump on ' + data.ShortName(matches.target),
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
        cn: '分身点名',
      },
    },
    {
      id: 'A8S Ice Missile Marker',
      regex: Regexes.headMarker({ id: '0043' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Ice Missile on YOU',
        cn: '冰点名',
      },
    },
    {
      id: 'A8S Hidden Minefield Intermission',
      // 165E used in both intermission and in final phase
      // 165C only used for intermission
      regex: Regexes.ability({ source: 'Hidden Mine', id: '165E', capture: false }),
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
        de: 'Von Replikant hinschauen',
        fr: 'Regardez la réplique',
        cn: '面向幻象',
      },
    },
    {
      id: 'A8S Link Up',
      regex: Regexes.ability({ source: 'Brute Justice', id: '1673', capture: false }),
      run: function(data) {
        data.seenLinkUp = true;
      },
    },
    {
      id: 'A8S Verdict Min HP',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Min Hp' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      alertText: {
        en: 'Min HP: Provoke Boss => Late NE Tornado',
        cn: '最少HP:挑衅BOSS=>东北龙卷风',
      },
    },
    {
      id: 'A8S Verdict Min HP Collect',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Min Hp' }),
      run: function(data, matches) {
        data.verdictMin = matches.target;
      },
    },
    {
      id: 'A8S Verdict Min HP Tornado',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Min Hp' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 27,
      alarmText: {
        en: 'Get NE Tornado',
        cn: '去东北龙卷风',
      },
    },
    {
      id: 'A8S Verdict Max HP Collect',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Max Hp' }),
      run: function(data, matches) {
        data.verdictMax = matches.target;
      },
    },
    {
      id: 'A8S Verdict Max HP',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Max Hp' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Max HP: Provoke Boss Second',
        cn: '最多HP:第二个挑衅BOSS',
      },
    },
    {
      id: 'A8S Verdict Max HP Provoke',
      regex: Regexes.losesEffect({ effect: 'Final Punishment' }),
      condition: function(data, matches) {
        return matches.target == data.verdictMin && data.me == data.verdictMax;
      },
      alertText: {
        en: 'Provoke Boss',
        cn: '挑衅BOSS',
      },
    },
    {
      id: 'A8S Verdict Max HP Blu Devour',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Max Hp' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.job == 'blu';
      },
      delaySeconds: 27,
      alarmText: {
        en: 'Use Devour',
        cn: '使用捕食',
      },
    },
    {
      id: 'A8S Verdict Penalty 1',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty I' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      // TODO: we could say who to share north orbs with?
      // TODO: we could also repeat the "share north orbs" after sw orb Explosion.
      alertText: {
        en: 'Penalty 1: SW orb -> Share 2x North Orbs',
        cn: '1号：吃西南球然后分摊北边双球',
      },
    },
    {
      id: 'A8S Verdict Penalty 2',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty II' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Penalty 2: NW Tornado',
        cn: '2号：西北龙卷风',
      },
    },
    {
      id: 'A8S Verdict Penalty 3',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty III' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Penalty 3: Get a South Tornado',
        cn: '2号：南边龙卷风',
      },
    },
    {
      id: 'A8S Verdict Penalty 3 Orb',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Penalty III' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 28,
      // TODO: we could collect who else has penalty 3 to share the orb with?
      // TODO: we could also say who to share north orb with.
      infoText: {
        en: 'Share last orb after gavel',
        cn: '等待锤子判定后分摊最后球',
      },
    },
    {
      id: 'A8S Verdict Nisi A',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi A' }),
      condition: Conditions.targetIsYou(),
      // TODO: we could say east or west here after the regulators spawn?
      // TODO: we could also say who to share north orb with.
      // TODO: we could also repeat the share after the regular dies?
      infoText: {
        en: 'Blue Regulator -> Share 1x North Orb',
        cn: '蓝色小怪然后北边分摊球',
      },
    },
    {
      id: 'A8S Verdict Nisi B',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi B' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Red Regulator -> Share 1x North Orb',
        cn: '红色小怪然后北边分摊球',
      },
    },
    {
      id: 'A8S Compressed Water',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Water on YOU',
            cn: '水点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Water on ' + data.ShortName(matches.target),
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
      run: function(data) {
        // rip, valiant mine sac
        delete data.water;
      },
    },
    {
      id: 'A8S Compressed Water Soon',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      infoText: function(data) {
        if (!data.water)
          return;
        return {
          en: 'Water Soon on ' + data.ShortName(data.water),
          cn: '马上水分摊' + data.ShortName(data.water),
        };
      },
    },
    {
      id: 'A8S Final Punch',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '170C' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A8S Final Beam',
      // id is for Final Apocalypse Ability
      regex: Regexes.ability({ source: 'Brute Justice', id: '1716', capture: false }),
      infoText: {
        en: 'Stack for Final Beam',
        cn: '集合分摊',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'Onslaughter': '突击者',
        'Steam Regulator B': '蒸汽调整者β',
        'Blaster Mirage': '爆破者幻象',
        'Blaster': '爆破者',
        'Brawler': '争斗者',
        'Swindler': '欺诈者',
        'Vortexer': '环旋者',
        'Brute Justice': '残暴正义号',
        'Steam Chakram': '蒸汽战轮',
        'Hidden Mine': '隐形地雷',
      },
      'replaceText': {
        'Hydrothermal Missile': '蒸汽导弹',
        'Seed Of The Sky': '天空之种',
        'Mega Beam': '巨型光束炮',
        'Execution': '执行准备',
        'Perpetual Ray': '永恒射线',
        'Legislation': '审判',
        'Discoid': '圆盘',
        'Blaster (north)': '爆破者(北)',
        'Brawler (middle)': '争斗者(中)',
        'Magicked Mark': '魔力射击', 
        'Brute Force': '残暴铁拳', 
        'Auxiliary Power': '武器特殊技能',
        'Attachment': '配件更换', 
        'Mirage Add': '幻象出现',
        'Mind Blast': '精神冲击',
        'Swindler (east)': '欺诈者(东)', 
        'Height': '高度算术',
        'Vortexer (south)': '环旋者(南)', 
        'Super Cyclone': '超级气旋', 
        'Elemental Jammer': '元素干扰',
        'Ballistic Missile': '导弹发射',
        'Earth Missile': '大地导弹',
        'Crashing Thunder': '冲击雷',
        'Transform': '正义合体',
        'Flarethrower': '大火炎放射',
        'Double Rocket Punch': '双重火箭飞拳',
        'Missile Command': '导弹齐发',
        'Short Needle': '小型导弹',
        'Long Needle': '大型导弹',
        'Super Jump': '苏趴酱噗',
        'Apocalyptic Ray': '末世宣言',
        'J Kick': '正义飞踢',
        '100-Megatonze Shock': '亿万吨震荡',
        'Mirage': '幻象',
        'Supercharge': '超突击',
        'Double Buster': '双重破坏炮击',
        'Eye Of The Chakram': '激光战轮',
        'Ice Missile': '寒冰导弹',
        'Single Buster': '破坏炮击',
        'Hidden Minefield': '隐形雷区',
        'Double Drill Crush': '双重飞钻冲击',
        'Drill Drive': '钻头驱动',
        'Rocket Drill': '火箭飞钻',	
        'Enumeration': '生命计数法',	
        'Ultra Flash': '究极闪光',
        'Justice': '正义合神',
        'Verdict': '终审开庭',
        'Gavel': '终审闭庭',
        'Link-Up': '系统连接',
        'Final Punch': '终极双重火箭飞拳',
        'Final Apocalypse': '终极末世宣言',
        'Final Beam': '终极巨型光束炮',
        'Chakrams Spawn': '战轮出现',
        'Crashing Wave': '冲击波',
        'J Wave': '火龙卷',		
      },
    },
  ],
}];
