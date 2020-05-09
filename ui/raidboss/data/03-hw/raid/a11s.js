'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Heart Of The Creator \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(天动之章3\)$/,
  },
  timelineFile: 'a11s.txt',
  timelineTriggers: [
    {
      id: 'A11S Blastoff',
      regex: /Blastoff/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'A11S Left Laser Sword',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A7A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A7A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A7A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A7A', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A7A', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A7A', capture: false }),
      // Sorry tanks.
      // We could figure out who is tanking and then do the opposite,
      // but probably that could get confusing too?
      // It seems better to just be consistent here and have tanks be smarter.
      response: Responses.goRight(),
    },
    {
      id: 'A11S Right Laser Sword',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A79', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A79', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A79', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A79', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A79', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A79', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'A11S Optical Sight Clock',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A6C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A6C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A6C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A6C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A6C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A6C', capture: false }),
      infoText: {
        en: 'Clock',
        de: 'Uhr',
        cn: '九连环',
      },
    },
    {
      id: 'A11S Optical Sight Out',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A6D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A6D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A6D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A6D', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A6D', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A6D', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'A11S Optical Sight Bait',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A6E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A6E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A6E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A6E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A6E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A6E', capture: false }),
      infoText: {
        en: 'Bait Optical Sight',
        de: 'Köder Visier',
        cn: '诱导AOE',
      },
    },
    {
      id: 'A11S Super Hawk Blaster',
      regex: Regexes.headMarker({ id: '005A' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A11S Whirlwind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A84', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A84', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A84', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A84', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A84', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A84', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A11S Spin Crusher',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A85', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A85', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A85', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A85', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A85', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A85', capture: false }),
      response: Responses.awayFromFront('info'),
    },
    {
      id: 'A11S EDD Add',
      regex: Regexes.addedCombatant({ name: 'E\\.D\\.D\\.', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'E\\.D\\.D\\.-Mecha', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'E\\.D\\.D\\.', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'イーディーディー', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '护航机甲', capture: false }),
      regexKo: Regexes.addedCombatant({ name: 'E\\.D\\.D\\.', capture: false }),
      infoText: {
        en: 'Kill Add',
        de: 'Add besiegen',
        cn: '击杀小怪',
      },
    },
    {
      id: 'A11S Armored Pauldron Add',
      regex: Regexes.addedCombatant({ name: 'Armored Pauldron', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Schulterplatte', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Protection D\'Épaule', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ショルダーアーマー', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '肩部装甲', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '견갑부', capture: false }),
      infoText: {
        en: 'Break Pauldron',
        de: 'Schulterplatte zerstören',
        cn: '击破护盾',
      },
    },
    {
      id: 'A11S GA-100',
      // Note: 0057 headmarker, but starts using occurs 3 seconds earlier.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A77' }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A77' }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A77' }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A77' }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A77' }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A77' }),
      // TODO: maybe we need a Responses.abilityOn()
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'GA-100 on YOU',
          de: 'GA-100 auf DIR',
          cn: 'GA-100点名',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'GA-100 on ' + data.ShortName(matches.target),
          de: 'GA-100 on ' + data.ShortName(matches.target),
          cn: 'GA-100点' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A11S Limit Cut Collect',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      run: function(data, matches) {
        let limitCutNumber = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[matches.id];
        data.limitCutMap = data.limitCutMap || {};
        data.limitCutMap[limitCutNumber] = matches.target;

        if (matches.target == data.me) {
          data.limitCutNumber = limitCutNumber;

          // Time between headmarker and mechanic.
          data.limitCutDelay = {
            '004F': 8.8,
            '0050': 9.3,
            '0051': 11.0,
            '0052': 11.5,
            '0053': 13.2,
            '0054': 13.7,
            '0055': 15.5,
            '0056': 16.0,
          }[matches.id];
        }
      },
    },
    {
      id: 'A11S Limit Cut Number',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: function(data) {
        return data.limitCutDelay;
      },
      infoText: function(data) {
        return data.limitCutNumber;
      },
    },
    {
      id: 'A11S Limit Cut Mechanic',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: function(data) {
        return data.limitCutDelay - 5;
      },
      alertText: function(data) {
        if (data.limitCutNumber % 2 == 1) {
          // Odds
          return {
            en: 'Knockback Cleave; Face Outside',
            de: 'Rückstoß Cleave; nach Außen schauen',
            ja: 'ノックバック ソード; 外向く',
            fr: 'Poussée Cleave; Regarde à l\'extérieur',
            ko: '넉백 소드; 바깥쪽 바라보기',
            cn: '击退顺劈; 面向外侧',
          };
        }

        // Evens
        let partner = data.limitCutMap[data.limitCutNumber - 1];
        if (!partner) {
          // In case something goes awry?
          return {
            en: 'Knockback Charge',
            de: 'Rückstoß Charge',
            ja: 'ノックバック チャージ',
            fr: 'Poussée Charge',
            ko: '넉백 차지',
            cn: '击退冲锋',
          };
        }

        return {
          en: 'Face ' + data.ShortName(partner),
          de: 'Schaue zu ' + data.ShortName(partner),
          cn: '面向' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'A11S Limit Cut Cleanup',
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '1A80', capture: false }),
      regexDe: Regexes.ability({ source: 'Chaser-Mecha', id: '1A80', capture: false }),
      regexFr: Regexes.ability({ source: 'Croiseur-Chasseur', id: '1A80', capture: false }),
      regexJa: Regexes.ability({ source: 'クルーズチェイサー', id: '1A80', capture: false }),
      regexCn: Regexes.ability({ source: '巡航驱逐者', id: '1A80', capture: false }),
      regexKo: Regexes.ability({ source: '순항추격기', id: '1A80', capture: false }),
      delaySeconds: 30,
      run: function(data) {
        delete data.limitCutDelay;
        delete data.limitCutNumber;
        delete data.limitCutMap;
      },
    },
    {
      id: 'A11S Laser X Sword',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A7F' }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A7F' }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A7F' }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A7F' }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A7F' }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A7F' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shared Tankbuster on YOU',
            de: 'Geteilter Tankbuster auf DIR',
            cn: '分摊死刑点名',
          };
        }

        if (data.role == 'tank' || data.role == 'healer' || data.job == 'blu') {
          return {
            en: 'Shared Tankbuster on' + data.ShortName(matches.target),
            de: 'Geteilter Tankbuster auf' + data.ShortName(matches.target),
            cn: '分摊死刑点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A11S Propeller Wind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A7F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A7F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A7F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A7F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A7F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A7F', capture: false }),
      alertText: {
        en: 'Hide Behind Tower',
        de: 'Hinter dem Tower verstecken',
        cn: '躲在塔后',
      },
    },
    {
      id: 'A11S Plasma Shield',
      regex: Regexes.addedCombatant({ name: 'Plasma Shield', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Plasmaschild', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Bouclier Plasma', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'プラズマシールド', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '等离子护盾', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '플라스마 방어막', capture: false }),
      alertText: {
        en: 'Break Shield From Front',
        de: 'Schild von vorne zerstören',
        cn: '正面击破护盾',
      },
    },
    {
      id: 'A11S Plasma Shield Shattered',
      regex: Regexes.gameLog({ line: 'The plasma shield is shattered.*?', capture: false }),

      response: Responses.spread('info'),
    },
    {
      id: 'A11S Blassty Charge',
      // The single post-shield charge.  Not "super" blassty charge during limit cut.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A83' }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '1A83' }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-Chasseur', id: '1A83' }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '1A83' }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '1A83' }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '1A83' }),
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Charge on YOU',
          de: 'Ansturm auf DIR',
          cn: '冲锋点名',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Charge on ' + data.ShortName(matches.target),
          de: 'Ansturm auf ' + data.ShortName(matches.target),
          cn: '冲锋点' + data.ShortName(matches.target),
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Armored Pauldron': 'Schulterplatte',
        'Claster': 'Claster-Mecha',
        'Cruise Chaser': 'Chaser-Mecha',
        'E\\.D\\.D\\.': 'E.D.D.-Mecha',
        'Multifield': 'Schichtfeld',
        'Plasma Shield': 'Plasmaschild',
      },
      'replaceText': {
        '\\(bait\\)': '(Ködern)',
        '\\(clock\\/out\\)': '(im Uhrzeiger/raus)',
        '\\(dps\\)': '(DD)',
        '\\(healer\\)': '(Heiler)',
        '\\(numbers\\)': '(Zahlen)',
        '\\(offtank\\)': '(Off-Tank)',
        '\\(orbs\\)': '(Kugeln)',
        '\\(shield\\)': '(Schild)',
        '--invincible--': '--unverwundbar--',
        'Assault Cannon': 'Sturmkanone',
        'Blassty Blaster': 'Blassty-Blaster',
        'Blastoff': 'Absprengen',
        'Charge': 'Sturm',
        'E\\.D\\.D\\. Add': 'E.D.D. Add',
        'E\\.D\\.D\\. Armored Pauldron': 'E.D.D. Armored Pauldron', // FIXME
        'Eternal Darkness': 'Ewiges Dunkel',
        'GA-100': 'GA-100',
        'Hawk Blaster': 'Jagdfalke',
        'Lapis Lazuli': 'Lapislazuli',
        'Limit Cut': 'Grenzwertüberschreitung',
        'Markers': 'Markierungen',
        'Multifield': 'Schichtfeld',
        'Optical Sight': 'Visier',
        'Perfect Landing': 'Perfekte Landung',
        'Photon': 'Photon',
        'Plasma Shield': 'Plasmaschild',
        'Plasmasphere': 'Plasmasphäre',
        'Propeller Wind': 'Luftschraube',
        'Spin Crusher': 'Rotorbrecher',
        'Sword': 'Schwert',
        'Transform': 'Geballte Rechtsgewalt',
        'Whirlwind': 'Wirbelwind',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Armored Pauldron': 'protection d\'épaule',
        'Claster': 'éclateur',
        'Cruise Chaser': 'Croiseur-chasseur',
        'E\\.D\\.D\\.': 'E.D.D.',
        'Multifield': 'champ multistrate',
        'Plasma Shield': 'bouclier plasma',
      },
      'replaceText': {
        'Assault Cannon': 'Canon d\'assaut',
        'Blassty Blaster': 'Canon Blassty',
        'Blastoff': 'Lancement',
        'Charge': 'Charge',
        'E\\.D\\.D\\. Armored Pauldron': 'E.D.D. Armored Pauldron', // FIXME
        'Eternal Darkness': 'Ténèbres éternelles',
        'GA-100': 'GA-100',
        'Hawk Blaster': 'Canon faucon',
        'Lapis Lazuli': 'lapis-lazuli',
        'Limit Cut': 'Dépassement de limites',
        'Multifield': 'champ multistrate',
        'Optical Sight': 'Visée optique',
        'Perfect Landing': 'Atterrissage parfait',
        'Photon': 'Photon',
        'Plasma Shield': 'bouclier plasma',
        'Plasmasphere': 'sphère de plasma',
        'Propeller Wind': 'Vent turbine',
        'Spin Crusher': 'Écrasement tournoyant',
        'Transform': 'Assemblage justicier',
        'Whirlwind': 'Tornade',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Armored Pauldron': 'ショルダーアーマー',
        'Claster': 'クラスター',
        'Cruise Chaser': 'クルーズチェイサー',
        'E\\.D\\.D\\.': 'イーディーディー',
        'Multifield': '積層科学フィールド',
        'Plasma Shield': 'プラズマシールド',
      },
      'replaceText': {
        'Assault Cannon': 'アサルトカノン',
        'Blassty Blaster': 'ブラスティ・ブラスター',
        'Blastoff': 'ブラストオフ',
        'Charge': 'チャージ',
        'E\\.D\\.D\\. Armored Pauldron': 'E.D.D. Armored Pauldron', // FIXME
        'Eternal Darkness': '暗黒の運命',
        'GA-100': 'GA-100',
        'Hawk Blaster': 'ホークブラスター',
        'Lapis Lazuli': 'ラピスラズリ',
        'Limit Cut': 'リミッターカット',
        'Multifield': '積層科学フィールド',
        'Optical Sight': '照準',
        'Perfect Landing': '着陸',
        'Photon': 'フォトン',
        'Plasma Shield': 'プラズマシールド',
        'Plasmasphere': 'プラズマスフィア',
        'Propeller Wind': 'プロペラウィンド',
        'Spin Crusher': 'スピンクラッシャー',
        'Transform': 'ジャスティス合体',
        'Whirlwind': '竜巻',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Armored Pauldron': '肩部装甲',
        'Claster': '舰载浮游炮',
        'Cruise Chaser': '巡航驱逐者',
        'E\\.D\\.D\\.': '护航机甲',
        'Multifield': '层积科学结界',
        'Plasma Shield': '等离子护盾',
      },
      'replaceText': {
        'Assault Cannon': '突击加农炮',
        'Blassty Blaster': '摧毁者破坏炮',
        'Blastoff': '准备升空',
        'Charge': '刺冲',
        'E\\.D\\.D\\. Armored Pauldron': 'E.D.D. Armored Pauldron', // FIXME
        'Eternal Darkness': '黑暗命运',
        'GA-100': '百式聚能炮',
        'Hawk Blaster': '鹰式破坏炮',
        'Lapis Lazuli': '天青石',
        'Limit Cut': '限制器减档',
        'Multifield': '层积科学结界',
        'Optical Sight': '制导',
        'Perfect Landing': '着陆',
        'Photon': '光子炮',
        'Plasma Shield': '等离子护盾',
        'Plasmasphere': '等离子球',
        'Propeller Wind': '螺旋桨强风',
        'Spin Crusher': '回旋碎踢',
        'Transform': '正义合体',
        'Whirlwind': '水龙卷',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Armored Pauldron': '견갑부',
        'Claster': '클래스터',
        'Cruise Chaser': '순항추격기',
        'E\\.D\\.D\\.': 'E.D.D.',
        'Multifield': '적층과학 필드',
        'Plasma Shield': '플라스마 방어막',
      },
      'replaceText': {
        'Assault Cannon': '맹공포',
        'Blassty Blaster': '블래스티 블래스터',
        'Blastoff': '발진',
        'Charge': '돌격',
        'E\\.D\\.D\\. Armored Pauldron': 'E.D.D. Armored Pauldron', // FIXME
        'Eternal Darkness': '암흑의 운명',
        'GA-100': 'GA-100',
        'Hawk Blaster': '호크 블래스터',
        'Lapis Lazuli': '청금석',
        'Limit Cut': '리미터 해제',
        'Multifield': '적층과학 필드',
        'Optical Sight': '조준',
        'Perfect Landing': '착륙',
        'Photon': '광자',
        'Plasma Shield': '플라스마 방어막',
        'Plasmasphere': '플라스마 구체',
        'Propeller Wind': '추진 돌풍',
        'Spin Crusher': '회전 분쇄',
        'Transform': '정의의 합체',
        'Whirlwind': '회오리바람',
      },
    },
  ],
}];
