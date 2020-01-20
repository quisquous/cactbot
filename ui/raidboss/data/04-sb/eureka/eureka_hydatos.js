'use strict';

[{
  zoneRegex: {
    en: /Eureka Hydatos/,
    cn: /丰水之地/,
  },
  timelineFile: 'eureka_hydatos.txt',
  resetWhenOutOfCombat: false,
  timelineTriggers: [
    {
      id: 'BA Art Geas',
      regex: /Legendary Geas/,
      regexDe: /Wirbelsturm/,
      regexCn: /妖枪乱击/,
      beforeSeconds: 0,
      infoText: {
        en: 'Stop Moving',
        de: 'Stehenbleiben',
        cn: '停止移动',
      },
    },
    {
      id: 'BA Raiden Levinwhorl',
      regex: /Levinwhorl/,
      regexDe: /Wirbelsturm/,
      regexCn: /涡雷/,
      beforeSeconds: 10,
      alertText: {
        en: 'Shields and Mitigation',
        de: 'Schilde und Abschwächungen',
        cn: '切盾减伤',
      },
    },
    {
      id: 'BA AV Eurekan Potion',
      regex: /Explosive Impulse/,
      regexDe: /Explosiver Impuls/,
      regexCn: /爆炸性冲击/,
      beforeSeconds: 10,
      suppressSeconds: 60,
      infoText: {
        en: 'Pop Eurekan Potions',
        de: 'Eureka-Heiltränke benutzen',
        cn: '磕优雷卡回复药',
      },
    },
    {
      id: 'BA Ozma Black Hole Warning',
      regex: /Black Hole/,
      regexDe: /Schwarzes Loch/,
      regexCn: /黑洞/,
      beforeSeconds: 12,
      infoText: {
        en: 'Black Hole Soon',
        de: 'Schwarzes Loch',
        cn: '黑洞警告',
      },
    },
  ],
  triggers: [
    {
      id: 'Eureka Hydatos Falling Asleep',
      regex: Regexes.gameLog({ line: '5 minutes have elapsed since your last activity.', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen.', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes', capture: false }),
      regexCn: Regexes.gameLog({ line: '已经5分钟没有进行任何操作', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
        cn: '醒醒！动一动！！',
      },
    },
    {
      id: 'Eureka Saved By Rememberance',
      regex: Regexes.gameLog({ line: 'The memories of heroes past live on again', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Das Vermächtnis vergangener Helden lebt von Neuem auf', capture: false }),
      regexCn: Regexes.gameLog({ line: '发动了英杰的加护效果，重新苏醒了过来', capture: false }),
      sound: 'Long',
    },
    {
      id: 'BA Seal',
      regex: Regexes.message({ line: '.*will be sealed off', capture: false }),
      regexDe: Regexes.message({ line: '.*bis sich der Zugang', capture: false }),
      regexCn: Regexes.message({ line: '距.*被封锁还有', capture: false }),
      run: function(data) {
        data.sealed = true;
      },
    },
    {
      id: 'BA Clear Data',
      regex: Regexes.message({ line: '.*is no longer sealed', capture: false }),
      regexDe: Regexes.message({ line: '.*öffnet sich wieder', capture: false }),
      regexCn: Regexes.message({ line: '.*的封锁解除了', capture: false }),
      run: function(data) {
        delete data.side;
        delete data.mythcall;
        delete data.clones;
        delete data.bracelets;
        delete data.sealed;
        delete data.blackHoleCount;
        delete data.seenHostile;
      },
    },
    {
      id: 'BA West Side',
      regex: Regexes.abilityFull({ id: '3956', source: 'Art', target: '[^:]+', capture: false }),
      regexDe: Regexes.abilityFull({ id: '3956', source: 'Art', target: '[^:]+', capture: false }),
      regexFr: Regexes.abilityFull({ id: '3956', source: 'Art', target: '[^:]+', capture: false }),
      regexJa: Regexes.abilityFull({ id: '3956', source: 'アルト', target: '[^:]+', capture: false }),
      regexCn: Regexes.abilityFull({ id: '3956', source: '亚特', target: '[^:]+', capture: false }),
      regexKo: Regexes.abilityFull({ id: '3956', source: '아르트', target: '[^:]+', capture: false }),
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'west';
      },
    },
    {
      id: 'BA East Side',
      regex: Regexes.abilityFull({ id: '3957', source: 'Owain', target: '[^:]+', capture: false }),
      regexDe: Regexes.abilityFull({ id: '3957', source: 'Owain', target: '[^:]+', capture: false }),
      regexFr: Regexes.abilityFull({ id: '3957', source: 'Owain', target: '[^:]+', capture: false }),
      regexJa: Regexes.abilityFull({ id: '3957', source: 'オーウェン', target: '[^:]+', capture: false }),
      regexCn: Regexes.abilityFull({ id: '3957', source: '欧文', target: '[^:]+', capture: false }),
      regexKo: Regexes.abilityFull({ id: '3957', source: '오와인', target: '[^:]+', capture: false }),
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'east';
      },
    },
    {
      id: 'BA Art Mythcall',
      regex: Regexes.startsUsing({ id: '3927', source: 'Art', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3927', source: 'Art', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3927', source: 'Art', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3927', source: 'アルト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3927', source: '亚特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3927', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west';
      },
      run: function(data) {
        data.mythcall = true;
      },
    },
    {
      id: 'BA Art Tankbuster',
      regex: Regexes.startsUsing({ id: '3934', source: 'Art' }),
      regexDe: Regexes.startsUsing({ id: '3934', source: 'Art' }),
      regexFr: Regexes.startsUsing({ id: '3934', source: 'Art' }),
      regexJa: Regexes.startsUsing({ id: '3934', source: 'アルト' }),
      regexCn: Regexes.startsUsing({ id: '3934', source: '亚特' }),
      regexKo: Regexes.startsUsing({ id: '3934', source: '아르트' }),
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑打' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'BA Art Orb Marker',
      regex: Regexes.headMarker({ id: '005C' }),
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Orb on YOU',
          cn: '点名',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Away From Orb Marker',
          de: 'Weg von Orb-Marker',
          cn: '远离点名',
        };
      },
    },
    {
      id: 'BA Art Piercing Dark Marker',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'west' && data.me == matches.target;
      },
      alertText: {
        en: 'Spread Marker',
        de: 'Marker verteilen',
        cn: '点名分散',
      },
    },
    {
      id: 'BA Art Legendcarver',
      regex: Regexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3928', source: 'アルト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3928', source: '亚特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3928', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west';
      },
      infoText: {
        en: 'Out',
        de: 'Raus',
        cn: '远离',
      },
    },
    {
      id: 'BA Art Legendspinner',
      regex: Regexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3929', source: 'アルト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3929', source: '亚特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3929', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west';
      },
      infoText: {
        en: 'In',
        de: 'Rein',
        cn: '靠近',
      },
    },
    {
      id: 'BA Art Mythcall Legendcarver',
      regex: Regexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3928', source: 'アルト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3928', source: '亚特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3928', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Boss',
        de: 'Unter Boss',
        cn: 'Boss脚下',
      },
    },
    {
      id: 'BA Art Mythcall Legendspinner',
      regex: Regexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3929', source: 'アルト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3929', source: '亚特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3929', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Spears',
        de: 'Unter Speere',
        cn: '枪脚下',
      },
    },
    {
      id: 'BA Owain Tankbuster',
      regex: Regexes.startsUsing({ id: '3945', source: 'Owain' }),
      regexDe: Regexes.startsUsing({ id: '3945', source: 'Owain' }),
      regexFr: Regexes.startsUsing({ id: '3945', source: 'Owain' }),
      regexJa: Regexes.startsUsing({ id: '3945', source: 'オーウェン' }),
      regexCn: Regexes.startsUsing({ id: '3945', source: '欧文' }),
      regexKo: Regexes.startsUsing({ id: '3945', source: '오와인' }),
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑打 ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'BA Owain Piercing Light Marker',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      infoText: {
        en: 'Spread Marker',
        de: 'Marker verteilen',
        cn: '点名分散',
      },
    },
    {
      id: 'BA Owain Dorito Stack',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      alarmText: {
        en: 'Dorito Stack',
        de: 'Dorito Stack',
        cn: '点名集合',
      },
    },
    {
      id: 'BA Owain Fire Element',
      regex: Regexes.dialog({ line: '[^:]*:Munderg, turn flesh to ash', capture: false }),
      regexDe: Regexes.dialog({ line: '[^:]*:Munderg, entfessele den Flammeneid', capture: false }),
      regexCn: Regexes.dialog({ line: '[^:]*:红颈妖枪，点燃一切', capture: false }),
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Ice',
        de: 'Geh zum Eis',
        cn: '冰',
      },
      infoText: {
        en: 'Switch Magia',
        de: 'Magia-Brett drehen',
        cn: '切换元素板',
      },
    },
    {
      id: 'BA Owain Ice Element',
      regex: Regexes.dialog({ line: '[^:]*:Munderg, turn blood to ice', capture: false }),
      regexDe: Regexes.dialog({ line: '[^:]*:Munderg, das Eis der Ewigkeit soll sie für Äonen bannen', capture: false }),
      regexCn: Regexes.dialog({ line: '[^:]*:红颈妖枪，冻结万物', capture: false }),
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Fire',
        de: 'Geh zum Feuer',
        cn: '火',
      },
      infoText: {
        en: 'Switch Magia',
        de: 'Magia-Brett drehen',
        cn: '切换元素板',
      },
    },
    {
      id: 'BA Owain Ivory Palm',
      regex: Regexes.ability({ id: '3941', source: 'Ivory Palm' }),
      regexDe: Regexes.ability({ id: '3941', source: 'Weiß(?:e|er|es|en) Hand' }),
      regexFr: Regexes.ability({ id: '3941', source: 'Paume D\'Ivoire' }),
      regexJa: Regexes.ability({ id: '3941', source: '白き手' }),
      regexCn: Regexes.ability({ id: '3941', source: '白手' }),
      regexKo: Regexes.ability({ id: '3941', source: '하얀 손' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      alarmText: {
        en: 'Dorito Stack',
        de: 'Dorito Stack',
        cn: '点名集合',
      },
    },
    {
      id: 'BA Owain Pitfall',
      regex: Regexes.startsUsing({ id: '394D', source: 'Owain', capture: false }),
      regexDe: Regexes.startsUsing({ id: '394D', source: 'Owain', capture: false }),
      regexFr: Regexes.startsUsing({ id: '394D', source: 'Owain', capture: false }),
      regexJa: Regexes.startsUsing({ id: '394D', source: 'オーウェン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '394D', source: '欧文', capture: false }),
      regexKo: Regexes.startsUsing({ id: '394D', source: '오와인', capture: false }),
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get Out To Edges',
        de: 'An den Rand',
        cn: '靠近边',
      },
    },
    {
      id: 'BA Silence Centaur',
      regex: Regexes.startsUsing({ id: '3BFE', source: 'Arsenal Centaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3BFE', source: 'Arsenal-Zentaur', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3BFE', source: 'Centaure De L\'Arsenal', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3BFE', source: 'アーセナル・セントール', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3BFE', source: '兵武半人马', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3BFE', source: '무기고 켄타우로스', capture: false }),
      condition: function(data) {
        return data.CanSleep();
      },
      alertText: {
        en: 'Sleep Centaur',
        de: 'Zentaur einschläfern',
        cn: '沉默人马',
      },
    },
    {
      id: 'BA Raiden Tankbuster',
      regex: Regexes.startsUsing({ id: '387B', source: 'Raiden' }),
      regexDe: Regexes.startsUsing({ id: '387B', source: 'Raiden' }),
      regexFr: Regexes.startsUsing({ id: '387B', source: 'Raiden' }),
      regexJa: Regexes.startsUsing({ id: '387B', source: 'ライディーン' }),
      regexCn: Regexes.startsUsing({ id: '387B', source: '莱丁' }),
      regexKo: Regexes.startsUsing({ id: '387B', source: '라이딘' }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: '死刑打' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'BA Raiden Lancing Bolt',
      regex: Regexes.headMarker({ id: '008A' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      alarmText: {
        en: 'Spread',
        de: 'Verteilen',
        cn: '分散',
      },
    },
    {
      id: 'BA Raiden Ame',
      regex: Regexes.startsUsing({ id: '3868', source: 'Raiden', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3868', source: 'Raiden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3868', source: 'Raiden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3868', source: 'ライディーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3868', source: '莱丁', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3868', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Far Away',
        de: 'Weit weg gehen',
        cn: '远离',
      },
    },
    {
      id: 'BA Raiden Whirling',
      regex: Regexes.startsUsing({ id: '386A', source: 'Raiden', capture: false }),
      regexDe: Regexes.startsUsing({ id: '386A', source: 'Raiden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '386A', source: 'Raiden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '386A', source: 'ライディーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '386A', source: '莱丁', capture: false }),
      regexKo: Regexes.startsUsing({ id: '386A', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Under',
        de: 'Drunter',
        cn: '脚下',
      },
    },
    {
      id: 'BA Raiden For Honor',
      regex: Regexes.startsUsing({ id: '387C', source: 'Raiden', capture: false }),
      regexDe: Regexes.startsUsing({ id: '387C', source: 'Raiden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '387C', source: 'Raiden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '387C', source: 'ライディーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '387C', source: '莱丁', capture: false }),
      regexKo: Regexes.startsUsing({ id: '387C', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        cn: '远离',
      },
    },
    {
      id: 'BA Raiden Lateral 1',
      regex: Regexes.startsUsing({ id: '386C', source: 'Raiden', capture: false }),
      regexDe: Regexes.startsUsing({ id: '386C', source: 'Raiden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '386C', source: 'Raiden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '386C', source: 'ライディーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '386C', source: '莱丁', capture: false }),
      regexKo: Regexes.startsUsing({ id: '386C', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'LEFT',
        de: 'LINKS',
        cn: '左',
      },
    },
    {
      id: 'BA Raiden Lateral 2',
      regex: Regexes.startsUsing({ id: '386B', source: 'Raiden', capture: false }),
      regexDe: Regexes.startsUsing({ id: '386B', source: 'Raiden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '386B', source: 'Raiden', capture: false }),
      regexJa: Regexes.startsUsing({ id: '386B', source: 'ライディーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '386B', source: '莱丁', capture: false }),
      regexKo: Regexes.startsUsing({ id: '386B', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'RIGHT',
        de: 'RECHTS',
        cn: '右',
      },
    },
    {
      id: 'BA AV Tankbuster',
      regex: Regexes.startsUsing({ id: '379A', source: 'Absolute Virtue' }),
      regexDe: Regexes.startsUsing({ id: '379A', source: 'Absolut(?:e|er|es|en) Tugend' }),
      regexFr: Regexes.startsUsing({ id: '379A', source: 'Vertu Absolue' }),
      regexJa: Regexes.startsUsing({ id: '379A', source: 'アブソリュートヴァーチュー' }),
      regexCn: Regexes.startsUsing({ id: '379A', source: '绝对的美德' }),
      regexKo: Regexes.startsUsing({ id: '379A', source: '절대미덕' }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (matches.target != data.me)
          return;
        return {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tankbuster sur VOUS',
          cn: '死刑减伤',
        };
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;
        return {
          en: 'Away from ' + data.ShortName(matches.target),
          de: 'Weg von ' + data.ShortName(matches.target),
          cn: '远离' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'BA AV Eidos Dark Bracelets',
      regex: Regexes.startsUsing({ id: '3787', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3787', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3787', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3787', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3787', source: '绝对的美德', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3787', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Dark Bracelets',
        de: 'Dunkle Armreife',
        cn: '黑光环',
      },
      run: function(data) {
        data.bracelets = 'dark';
      },
    },
    {
      id: 'BA AV Eidos Light Bracelets',
      regex: Regexes.startsUsing({ id: '3786', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3786', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3786', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3786', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3786', source: '绝对的美德', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3786', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Light Bracelets',
        de: 'Helle Armreife',
        cn: '白光环',
      },
      run: function(data) {
        data.bracelets = 'light';
      },
    },
    {
      id: 'BA AV Eidos Hostile Aspect',
      regex: Regexes.startsUsing({ id: '378B', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '378B', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.startsUsing({ id: '378B', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.startsUsing({ id: '378B', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '378B', source: '绝对的美德', capture: false }),
      regexKo: Regexes.startsUsing({ id: '378B', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (!data.seenHostile) {
          if (data.bracelets == 'light') {
            return {
              en: 'Away From Light Circles',
              de: 'Weg von hellen Kreisen',
              cn: '远离白圈',
            };
          }
          if (data.bracelets == 'dark') {
            return {
              en: 'Away From Dark Circles',
              de: 'Weg von dunklen Kreisen',
              cn: '远离黑圈',
            };
          }
          return;
        }
        if (data.bracelets == 'light') {
          return {
            en: 'Stand By Dark Circles',
            de: 'Zu den dunklen Kreisen',
            cn: '靠近黑圈',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Stand By Light Circles',
            de: 'zu den hellen Kreisen',
            cn: '靠近白圈',
          };
        }
      },
      run: function(data) {
        data.seenHostile = true;
      },
    },
    {
      id: 'BA AV Eidos Impact Stream',
      regex: Regexes.startsUsing({ id: '3788', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3788', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3788', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3788', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3788', source: '绝对的美德', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3788', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (data.bracelets == 'light') {
          return {
            en: 'Dark',
            de: 'Dunkel',
            cn: '黑',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Light',
            de: 'Hell',
            cn: '白',
          };
        }
      },
    },
    {
      // Note: These use 00:329e: lines, without any proper "gains effect" lines.
      id: 'BA AV Eidos Relative Virtue Colors',
      regex: Regexes.gameLog({ line: 'Relative Virtue gains the effect of (Astral|Umbral) Essence', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Relative Tugend gains the effect of Arm (des Lichts|der Dunkelheit)', capture: false }),
      regexCn: Regexes.gameLog({ line: '相对的美德 gains the effect of (光|暗)之腕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      run: function(data, matches) {
        // RV clones get buffs in the reverse order that they do their attacks in.
        data.clones = data.clones || [];
        data.clones.push(matches[1]);
      },
    },
    {
      id: 'BA AV Triple Impact Stream',
      regex: Regexes.startsUsing({ id: '3797', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3797', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3797', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3797', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3797', source: '绝对的美德', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3797', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (!data.clones)
          return;
        let wrists = data.clones.pop();
        if (wrists == 'Astral') {
          return {
            en: 'Dark',
            de: 'Dunkel',
            cn: '黑',
          };
        }
        if (wrists == 'Umbral') {
          return {
            en: 'Light',
            de: 'Hell',
            cn: '白',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Turbulent Aether',
      regex: Regexes.ability({ id: '3790', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.ability({ id: '3790', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.ability({ id: '3790', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.ability({ id: '3790', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.ability({ id: '3790', source: '绝对的美德', capture: false }),
      regexKo: Regexes.ability({ id: '3790', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Orbs to Opposite Colors',
        de: 'Kugeln zu umgekehrter Farbe',
        cn: '连线去相反颜色',
      },
    },
    {
      id: 'BA AV Call Wyvern',
      regex: Regexes.ability({ id: '3798', source: 'Absolute Virtue', capture: false }),
      regexDe: Regexes.ability({ id: '3798', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      regexFr: Regexes.ability({ id: '3798', source: 'Vertu Absolue', capture: false }),
      regexJa: Regexes.ability({ id: '3798', source: 'アブソリュートヴァーチュー', capture: false }),
      regexCn: Regexes.ability({ id: '3798', source: '绝对的美德', capture: false }),
      regexKo: Regexes.ability({ id: '3798', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Kill Wyverns, Switch Magia',
        de: 'Wyvern töten, Magia wechseln',
        cn: '杀龙，切换元素板',
      },
    },
    {
      id: 'BA Ozma Sphere Form',
      regex: Regexes.ability({ source: 'Proto Ozma', id: ['37B3', '37A5', '379F'], capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: ['37B3', '37A5', '379F'], capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: ['37B3', '37A5', '379F'], capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: ['37B3', '37A5', '379F'], capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: ['37B3', '37A5', '379F'], capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: ['37B3', '37A5', '379F'], capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      preRun: function(data) {
        data.blackHoleCount = data.blackHoleCount || 0;
        data.blackHoleCount++;
      },
      alarmText: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount + ' / 6',
          cn: '黑洞 ' + data.blackHoleCount + ' / 6',
        };
      },
      tts: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount,
          cn: '黑洞 ' + data.blackHoleCount,
        };
      },
    },
    // FIXME: on all these forms, most of the time they come with double mechanics,
    // so probably need some "Then," text so folks don't leave the first mechanic early.
    // FIXME: random shade mechanic mid ozma form comes with holy/acceleration bomb/knockback
    // so call out something like "get off + holy" or "get knocked in".
    // FIXME: need callouts for knockback, and maybe "holy soon"?
    {
      id: 'BA Ozma Pyramid Form',
      regex: Regexes.ability({ source: 'Proto Ozma', id: '37A4', capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: '37A4', capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: '37A4', capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: '37A4', capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: '37A4', capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: '37A4', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Off the Platform',
        de: 'Weg von der Fläche',
        cn: '远离平台',
      },
    },
    {
      id: 'BA Ozma Pyramid Form 2',
      regex: Regexes.ability({ source: 'Proto Ozma', id: '37A4', capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: '37A4', capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: '37A4', capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: '37A4', capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: '37A4', capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: '37A4', capture: false }),
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Spread for Bleed',
        de: 'Blutung verteilen',
        cn: '分散',
      },
    },
    {
      id: 'BA Ozma Star Form',
      regex: Regexes.ability({ source: 'Proto Ozma', id: '37B2', capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: '37B2', capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: '37B2', capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: '37B2', capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: '37B2', capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: '37B2', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Go Far',
        de: 'Weit weg',
        cn: '远离',
      },
    },
    {
      id: 'BA Ozma Star Form 2',
      regex: Regexes.ability({ source: 'Proto Ozma', id: '37B2', capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: '37B2', capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: '37B2', capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: '37B2', capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: '37B2', capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: '37B2', capture: false }),
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      infoText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Stack (if not tanking)',
            de: 'Stack (wenn nicht am tanken)',
            cn: '集合（如果没在坦怪）',
          };
        }
        return {
          en: 'Stack Up',
          de: 'Stacken',
          cn: '集合',
        };
      },
    },
    {
      id: 'BA Ozma Cube Form',
      regex: Regexes.ability({ source: 'Proto Ozma', id: '379E', capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: '379E', capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: '379E', capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: '379E', capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: '379E', capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: '379E', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Close',
        de: 'Nah dran',
        cn: '靠近',
      },
    },
    {
      id: 'BA Ozma Cube Form 2',
      regex: Regexes.ability({ source: 'Proto Ozma', id: '379E', capture: false }),
      regexDe: Regexes.ability({ source: 'Proto-Yadis', id: '379E', capture: false }),
      regexFr: Regexes.ability({ source: 'Proto-Ozma', id: '379E', capture: false }),
      regexJa: Regexes.ability({ source: 'プロトオズマ', id: '379E', capture: false }),
      regexCn: Regexes.ability({ source: '奥兹玛原型', id: '379E', capture: false }),
      regexKo: Regexes.ability({ source: '프로토 오즈마', id: '379E', capture: false }),
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Offtanks Get Orbs',
            de: 'Offtanks holt Kugeln',
            cn: 'ST撞球',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Stack Away From Tank',
            de: 'Weg vom Tank stacken',
            cn: '远离坦克集合',
          };
        }
      },
    },
    {
      id: 'BA Ozma Pyramid Shade',
      regex: Regexes.ability({ source: ['Ozmashade', 'Shadow'], id: '37A4', capture: false }),
      regexDe: Regexes.ability({ source: ['Yadis-Schatten', 'Proto-Yadis-Schatten'], id: '37A4', capture: false }),
      regexFr: Regexes.ability({ source: ['Ombre D\'Ozma', 'Ombre De Proto-Ozma'], id: '37A4', capture: false }),
      regexJa: Regexes.ability({ source: ['オズマの影', 'プロトオズマの影'], id: '37A4', capture: false }),
      regexCn: Regexes.ability({ source: ['奥兹玛之影', '奥兹玛原型之影'], id: '37A4', capture: false }),
      regexKo: Regexes.ability({ source: ['오즈마의 그림자', '프로토 오즈마의 그림자'], id: '37A4', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Off',
        de: 'Weg da',
        cn: '远离平台',
      },
    },
    {
      id: 'BA Ozma Star Shade',
      regex: Regexes.ability({ source: ['Ozmashade', 'Shadow'], id: '37B2', capture: false }),
      regexDe: Regexes.ability({ source: ['Yadis-Schatten', 'Proto-Yadis-Schatten'], id: '37B2', capture: false }),
      regexFr: Regexes.ability({ source: ['Ombre D\'Ozma', 'Ombre De Proto-Ozma'], id: '37B2', capture: false }),
      regexJa: Regexes.ability({ source: ['オズマの影', 'プロトオズマの影'], id: '37B2', capture: false }),
      regexCn: Regexes.ability({ source: ['奥兹玛之影', '奥兹玛原型之影'], id: '37B2', capture: false }),
      regexKo: Regexes.ability({ source: ['오즈마의 그림자', '프로토 오즈마의 그림자'], id: '37B2', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Close',
        de: 'Nah dran',
        cn: '靠近',
      },
    },
    {
      id: 'BA Ozma Cube Shade',
      regex: Regexes.ability({ source: ['Ozmashade', 'Shadow'], id: '379E', capture: false }),
      regexDe: Regexes.ability({ source: ['Yadis-Schatten', 'Proto-Yadis-Schatten'], id: '379E', capture: false }),
      regexFr: Regexes.ability({ source: ['Ombre D\'Ozma', 'Ombre De Proto-Ozma'], id: '379E', capture: false }),
      regexJa: Regexes.ability({ source: ['オズマの影', 'プロトオズマの影'], id: '379E', capture: false }),
      regexCn: Regexes.ability({ source: ['奥兹玛之影', '奥兹玛原型之影'], id: '379E', capture: false }),
      regexKo: Regexes.ability({ source: ['오즈마의 그림자', '프로토 오즈마의 그림자'], id: '379E', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Go Far',
        de: 'Weit weg',
        cn: '远离',
      },
    },
    {
      id: 'BA Ozma Adds',
      regex: Regexes.ability({ source: 'Cloudlarker', id: '37B0', capture: false }),
      regexDe: Regexes.ability({ source: 'Wolkenlauerer', id: '37B0', capture: false }),
      regexFr: Regexes.ability({ source: 'Rôdeur Des Nuages', id: '37B0', capture: false }),
      regexJa: Regexes.ability({ source: 'クラウドラーカー', id: '37B0', capture: false }),
      regexCn: Regexes.ability({ source: '翻云狮鹫', id: '37B0', capture: false }),
      regexKo: Regexes.ability({ source: '구름 잠복자', id: '37B0', capture: false }),
      delaySeconds: 2,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Kill Adds',
        de: 'Adds töten',
        cn: '杀小怪',
      },
    },
    {
      id: 'BA Ozma Acceleration Bomb',
      regex: Regexes.ability({ id: '37AA', source: 'Proto Ozma' }),
      regexDe: Regexes.ability({ id: '37AA', source: 'Proto-Yadis' }),
      regexFr: Regexes.ability({ id: '37AA', source: 'Proto-Ozma' }),
      regexJa: Regexes.ability({ id: '37AA', source: 'プロトオズマ' }),
      regexCn: Regexes.ability({ id: '37AA', source: '奥兹玛原型' }),
      regexKo: Regexes.ability({ id: '37AA', source: '프로토 오즈마' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      alarmText: {
        en: 'Stop Soon',
        de: 'Bald stoppen',
        cn: '注意停手',
      },
    },
    {
      id: 'BA Ozma Meteor',
      regex: Regexes.headMarker({ id: '0039' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      alarmText: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        cn: '陨石点名',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'The Shin-Zantetsuken Containment Unit will be sealed off': '距真·斩铁剑封印区被封锁还有',
        'The Lance of Virtue Containment Unit will be sealed off': '距美德之枪封印区被封锁还有',
        'The Proto Ozma Containment Unit will be sealed off': '距奥兹玛原型封印区被封锁还有',
        'Art': '亚特',
        'Owain': '欧文',
        'Arsenal Centaur': '兵武半人马',
        'Raiden': '莱丁',
        'Absolute Virtue': '绝对的美德',
        'Relative Virtue': '相对的美德',
        'Proto Ozma': '奥兹玛原型',
        'Orlasrach': '烈焰金枪',
        'Ivory Palm': '白手',
        'Ball Lightning': '雷球',
        'Streak Lightning': '雷枪',
        'Ozmashade': '奥兹玛之影',
        'Ozma': '奥兹玛原型',
        'Shadow': '奥兹玛原型之影',
        'Cloudlarker': '翻云狮鹫',
        'is no longer sealed': '的封锁解除了',
      },
      'replaceText': {
        'Mythcall': '幻枪招来',
        'Thricecull': '三连枪',
        'Legendcarver': '妖枪振',
        'Legendspinner': '妖枪振',
        'Ivory Palm': '白手',
        'Pitfall': '强袭',
        'Shingan': '真眼击',
        'Berserk': '狂暴',
        'Whirling Zantetsuken': '旋·斩铁剑',
        'For Honor': '战死击',
        'Lateral Zantetsuken': '片·斩铁剑',
        'Auroral Wind': '极光之风',
        'Eidos': '变异',
        'Hostile Aspect': '极性波动',
        'Impact Stream': '冲击流',
        //  WEST BRANCH / ART:
        'Astral Essence': '光之腕',
        'Umbral Essence': '暗之腕',
        'Acallam Na Senorach': '真妖枪旋',
        'Carver/Spinner': '妖枪振/妖枪振',
        'Spear Copy': '枪复制',
        'Legendary Geas': '妖枪乱击',
        '--untargetable--': '--不可选中--',
        'Orb x5': '连线 x5',
        '--targetable--': '--可选中--',
        'Piercing Dark': '暗之枪',
        'Spear Shade': '枪形状',
        //  EAST BRANCH / OWAIN:
        'Elemental Shift': '元素开关',
        'Elemental Magicks': '元素魔法',
        'Spiritcull': '连装魔',
        'Legendary Imbas': '妖枪邪念',
        'Piercing Light': '光之枪',
        'Explosion Enrage': '爆炸狂暴',
        //  Raiden:
        'Thundercall': '招雷',
        'Ame-no-Sakahoko': '天逆矛',
        'Spirits of the Fallen': '英灵魂',
        'Lancing Bolt': '雷枪',
        'Streak Lightning': '雷枪',
        'Ultimate Zantetsuken': '极·斩铁剑',
        'Booming Lament': '哀痛雷鸣',
        'Cloud to Ground': '袭雷',
        'Bitter Barbs': '罪恶荆棘',
        'Levinwhorl': '涡雷',
        //  Absolute Virtue:
        'Meteor': '陨石',
        'Medusa Javelin': '美杜莎投枪',
        'Turbulent Aether': '以太乱流',
        'Explosive Impulse': '爆炸性冲击',
        'Call Wyvern': '召唤飞龙',
        'Wyvern Explosion': '飞龙爆炸',
        //  Proto Ozma:
        //   Initial Star Form (no meteor)
        'Star Form': '圣晶石',
        'Mourning Star': '启明星',
        'Soak Attack': '浸泡攻击',
        'Shooting Star': '流星',
        'Sphere Form': '球形',
        'Black Hole': '黑洞',
        'Random Shade': '随机形状',
        'Shade Ability': '影子技能',
        //  fake loop:
        'Random Form': '随机形式',
        'Ozma Ability': '奥兹玛技能',
        'Acceleration Bomb': '加速度炸弹',
        'Bleed Attack': '出血攻击',
        'Stack': '集合',
        'Adds': '小怪',
        'Holy': '神圣',
        //   Pyramid Phase:
        'Pyramid Form': '金字塔',
        'Execration': '缩小射线',
        //   Cube Form:
        'Cube Form': '立方体',
        'Flare Star': '耀星',
      },
      '~effectNames': {
      },
    },
  ],
}];
