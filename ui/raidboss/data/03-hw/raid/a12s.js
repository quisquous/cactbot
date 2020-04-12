'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Soul Of The Creator \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(天动之章4\)$/,
  },
  timelineFile: 'a12s.txt',
  timelineTriggers: [
    {
      id: 'A12S Divine Spear',
      regex: /Divine Spear/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'A12S Holy Bleed',
      regex: /Holy Bleed/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    {
      id: 'A12S Punishing Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '19E9' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      // Applies to both holy and blazing scourge.
      id: 'A12S Holy Blazing Scourge You',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: function(data, matches) {
        // Ignore Holy Scourge later in the fight.
        if (data.scourge && data.scourge.length > 2)
          return false;
        return data.me == matches.target;
      },
      alertText: {
        en: 'Scourge on YOU',
        cn: '白光之鞭点名',
      },
    },
    {
      id: 'A12S Blazing Scourge Collect',
      regex: Regexes.headMarker({ id: '001E' }),
      run: function(data, matches) {
        data.scourge = data.scourge || [];
        data.scourge.push(matches.target);
      },
    },
    {
      id: 'A12S Blazing Scourge Report',
      regex: Regexes.headMarker({ id: '001E', capture: false }),
      condition: function(data) {
        // Ignore Holy Scourge later in the fight.
        if (data.scourge && data.scourge.length > 2)
          return false;

        return data.role == 'healer' || data.job == 'blu';
      },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: function(data) {
        // Ignore Holy Scourge later in the fight.
        if (data.scourge && data.scourge.length > 2)
          return false;

        let names = data.scourge.map((x) => data.ShortName(x)).sort();
        if (names.length == 0)
          return;
        return {
          en: 'Scourge: ' + names.join(', '),
          cn: '白光之鞭点:' + names.join(', '),
        };
      },
    },
    {
      id: 'A12S Mega Holy',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '19EE', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A12S Incinerating Heat',
      regex: Regexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'A12S Laser Sacrament',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '19EB', capture: false }),
      infoText: {
        en: 'Lasers',
        cn: '十字圣礼',
      },
    },
    {
      id: 'A12S Radiant Sacrament',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '19ED', capture: false }),
      response: Responses.getUnder('alert'),
    },
    {
      id: 'A12S House Arrest',
      regex: Regexes.tether({ id: '001C' }),
      condition: function(data, matches) {
        return matches.source == data.me || matches.target == data.me;
      },
      infoText: function(data, matches) {
        let partner = matches.source == data.me ? matches.target : matches.source;
        let suffix = ' (' + data.ShortName(partner) + ')';
        return {
          en: 'Close Tethers' + suffix,
          de: 'Nahe Verbindungen' + suffix,
          fr: 'Liens proches' + suffix,
          ja: 'ニアー' + suffix,
          cn: '靠近连线' + suffix,
          ko: '강제접근: 상대와 가까이 붙기' + suffix,
        };
      },
    },
    {
      id: 'A12S Restraining Order',
      regex: Regexes.tether({ id: '001C' }),
      condition: function(data, matches) {
        return matches.source == data.me || matches.target == data.me;
      },
      alertText: function(data, matches) {
        let partner = matches.source == data.me ? matches.target : matches.source;
        let suffix = ' (' + data.ShortName(partner) + ')';
        return {
          en: 'Far Tethers' + suffix,
          de: 'Entfernte Verbindungen' + suffix,
          fr: 'Liens éloignés' + suffix,
          ja: 'ファー' + suffix,
          cn: '远离连线' + suffix,
          ko: '접근금지: 상대와 떨어지기' + suffix,
        };
      },
    },
    {
      id: 'A12S Shared Sentence',
      regex: Regexes.gainsEffect({ effect: 'Shared Sentence' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：集团罪' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kollektivstrafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : Peine Collective' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：集団罰' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 단체형' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Shared Sentence',
        de: 'Urteil Kollektivstrafe',
        ja: '集団罰',
        fr: 'Peine collective',
        ko: '집단형: 오른쪽/함께 맞기',
        cn: '集团罪',
      },
    },
    {
      id: 'A12S Defamation',
      regex: Regexes.gainsEffect({ effect: 'Defamation' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Defamation',
        de: 'Ehrenstrafe',
        ja: '名誉罰',
        ko: '명예형: 보스 밑에서 나 홀로!!!',
        cn: '名誉罪',
      },
    },
    {
      id: 'A12S Judgment Crystal',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Crystal on YOU',
        de: 'Kristall auf DIR',
        ja: '自分に結晶',
        fr: 'Cristal sur VOUS',
        ko: '나에게 수정',
        cn: '结晶点名',
      },
    },
    {
      id: 'A12S Holy Scourge',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '1A0B', capture: false }),
      alertText: function(data) {
        if (data.role == 'tank' || data.role == 'healer' || data.job == 'blu') {
          return {
            en: 'Shared Tankbuster',
            de: 'geteilter Tankbuster',
            ja: 'タンクシェア',
            fr: 'Tankbuster partagé',
            ko: '쉐어 탱크버스터',
            cn: '分摊死刑',
          };
        }
      },
    },
    {
      id: 'A12S Chastening Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '1A0D' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A12S Communion Tether',
      regex: Regexes.tether({ source: 'Alexander', id: '0036' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Puddle Tether on YOU',
        cn: '放圈连线点名',
      },
    },
  ],
   timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'The General\'s Wing': '阿里达乌斯之翼',
        'The General\'s Time': '阿里达乌斯之时',
        'The General\'s Might': '阿里达乌斯之力',
        'Judgment Crystal': '审判结晶',
        'Arrhidaeus\'s Lanner': '阿里达乌斯之速',
        'Alexander Prime': '至尊亚历山大',
        '(?<! )Alexander(?! )': '亚历山大',
        'is no longer sealed': '不再封闭',
      },
      'replaceText': {
        'blazing scourge': '白光之鞭',
        'attack': '攻击',
        'Will of the Creator': '神明意志',
        'Unknown Ability': 'Unknown Ability',
        'Timegate': '时空门',
        'Tetrashatter': '结晶破碎',
        'Temporal Stasis': '时间停止',
        'Smash': '粉碎',
        'Radiant Sacrament': '拜火',
        '(?! )Sacrament': '十字',
        'Punishing Heat': '惩戒射线',
        'Plaint of Surety': '誓约神判',
        'Plaint of Solidarity': '连带神判',
        'Plaint of Obloquy': '污名神判',
        'Mega Holy': '百万神圣',
        'Judgment Crystal': '审判结晶',
        'Incinerating Heat': '净化射线',
        'Inception': '时空潜行',
        'Half Gravity': '小重力', 
        'Gravitational Anomaly': '重力异常',
        'Divine Spear': '圣炎',
        'Divine Judgment': '神圣审判',
        'Chronofoil': '光阴之翼',
        'Almost Holy': '小神圣',
        'Blazing Scourge': '白光之鞭',
        'Arrhidaeus\'s Lanner': '阿里达乌斯之速',
        'The General\'s Wing': '阿里达乌斯之翼',
        'The General\'s Might ': '小怪',
        'The General\'s Time': '小怪',
        'Summon Alexander': '召唤亚历山大',
        'Confession': '灵泉',
        'Holy Bleed': '神圣爆发',
        'timestop': '时停',
        'Void Of Repentance': '忏悔区',
        'Holy Scourge': '圣光之鞭',
        'Chastening Heat': '神罚射线',
        'Communion': '圣餐',
        'timegates': '时空门',
        '(?<! )timegates active(?! )': '时空门激活',
      },
      '~effectNames': {
        'Magic Vulnerability Up': '魔法受伤加重',
      },
    },
  ],
}];
