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
      response: Responses.stopMoving(),
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
      id: 'BA Falling Asleep',
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
      id: 'BA Saved By Rememberance',
      regex: Regexes.gameLog({ line: 'The memories of heroes past live on again', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Das Vermächtnis vergangener Helden lebt von Neuem auf', capture: false }),
      regexFr: Regexes.gameLog({ line: 'L\'égide des héros vaillants vous a ressuscitée', capture: false }),
      regexJa: Regexes.gameLog({ line: '英傑の加護の効果が発揮され、蘇生された', capture: false }),
      regexCn: Regexes.gameLog({ line: '发动了英杰的加护效果，重新苏醒了过来', capture: false }),
      regexKo: Regexes.gameLog({ line: '영걸의 가호의 효과가 발휘되어 부활했습니다', capture: false }),
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
      response: Responses.tankBuster(),
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
          de: 'Orb auf DIR',
          cn: '点名',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Away From Orb Marker',
          de: 'Weg vom Orb-Marker',
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
      response: Responses.spread(),
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
      response: Responses.getOut(),
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
      response: Responses.getIn(),
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
      response: Responses.getUnder(),
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
        de: 'Unter einen Speer',
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
      response: Responses.tankBuster(),
    },
    {
      id: 'BA Owain Piercing Light Marker',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'BA Owain Dorito Stack',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      response: Responses.doritoStack(),
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
      response: Responses.doritoStack(),
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
      response: Responses.getOut(),
    },
    {
      id: 'BA Silence Centaur',
      regex: Regexes.startsUsing({ id: '3BFE', source: 'Arsenal Centaur' }),
      regexDe: Regexes.startsUsing({ id: '3BFE', source: 'Arsenal-Zentaur' }),
      regexFr: Regexes.startsUsing({ id: '3BFE', source: 'Centaure De L\'Arsenal' }),
      regexJa: Regexes.startsUsing({ id: '3BFE', source: 'アーセナル・セントール' }),
      regexCn: Regexes.startsUsing({ id: '3BFE', source: '兵武半人马' }),
      regexKo: Regexes.startsUsing({ id: '3BFE', source: '무기고 켄타우로스' }),
      condition: function(data) {
        return data.CanSleep();
      },
      response: Responses.sleep(),
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
      response: Responses.tankBuster(),
    },
    {
      id: 'BA Raiden Lancing Bolt',
      regex: Regexes.headMarker({ id: '008A' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      response: Responses.spread(),
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
      response: Responses.getOut(),
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
      response: Responses.getUnder(),
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
      response: Responses.getOut(),
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
      response: Responses.goLeft(),
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
      response: Responses.goRight(),
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
      response: Responses.tankBuster(),
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
      response: Responses.killAdds(),
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
          de: 'Schwarzes Loch ' + data.blackHoleCount + ' / 6',
          cn: '黑洞 ' + data.blackHoleCount + ' / 6',
        };
      },
      tts: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount,
          de: 'Schwarzes Loch ' + data.blackHoleCount,
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
      response: Responses.killAdds(),
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
      response: Responses.stopEverything(),
    },
    {
      id: 'BA Ozma Meteor',
      regex: Regexes.headMarker({ id: '0039' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      response: Responses.meteorOnYou(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Absolute Virtue': 'Absolut(?:e|er|es|en) Tugend',
        'Arsenal Centaur': 'Arsenal-Zentaur',
        'Art': 'Art',
        'Ball Lightning': 'Elektrosphäre',
        'Cloudlarker': 'Wolkenlauerer',
        'Ivory Palm': 'weiß(?:e|er|es|en) Hand',
        'Orlasrach': 'Orlasrach',
        'Owain': 'Owain',
        '(?<! )Ozma(?!\\w)': 'Yadis',
        'Ozmashade': 'Yadis-Schatten',
        'Proto Ozma': 'Proto-Yadis',
        'Raiden': 'Raiden',
        'Relative Virtue': 'Relativ(?:e|er|es|en) Tugend',
        'Shadow': 'Proto-Yadis-Schatten',
        'Streak Lightning': 'Blitzladung',
        'The Lance of Virtue Containment Unit will be sealed off': 'The Lance of Virtue Containment Unit will be sealed off', // FIXME
        'The Proto Ozma Containment Unit will be sealed off': 'The Proto Ozma Containment Unit will be sealed off', // FIXME
        'The Shin-Zantetsuken Containment Unit will be sealed off': 'The Shin-Zantetsuken Containment Unit will be sealed off', // FIXME
      },
      'replaceText': {
        '--sync--': '--sync--',
        'Acallam Na Senorach': 'Legendärer Lanzenwirbel',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Adds': 'Adds', // FIXME
        'Ame-no-Sakahoko': 'Himmelsriposte',
        'Astral Essence': 'Arm des Lichts',
        'Auroral Wind': 'Aurorawind',
        'Berserk': 'Berserker',
        'Bitter Barbs': 'Dornige Schuld',
        'Black Hole': 'Schwarzes Loch',
        'Bleed Attack': 'Bleed Attack', // FIXME
        'Booming Lament': 'Donnerschlag der Trauer',
        'Call Wyvern': 'Wyvernruf',
        'Carver/Spinner': 'Carver/Spinner', // FIXME
        'Cloud to Ground': 'Sturmkonzentration',
        'Cube Form': 'Cube Form', // FIXME
        'Eidos': 'Sarva',
        'Elemental Magicks': 'Elementmagie',
        'Elemental Shift': 'Elementwechsel',
        'Execration': 'Exsekration',
        'Explosion Enrage': 'Explosion Enrage', // FIXME
        'Explosive Impulse': 'Explosiver Impuls',
        'Flare Star': 'Flare-Stern',
        'For Honor': 'Hieb der Gefallenen',
        'Holy': 'Sanctus',
        'Hostile Aspect': 'Polarisierte Welle',
        'Impact Stream': 'Durchschlagsstrom',
        'Ivory Palm': 'weiß(?:e|er|es|en) Hand',
        'Lancing Bolt': 'Donnerlanze',
        'Lateral Zantetsuken': 'Kata-Zantetsuken',
        'Legendary Geas': 'Legendenhieb',
        'Legendary Imbas': 'Legendäre Boshaftigkeit',
        'Legendcarver': 'Legendenschnitzer',
        'Legendspinner': 'Legendenspinner',
        'Levinwhorl': 'Wirbelsturm',
        'Medusa Javelin': 'Medusenspeer',
        'Meteor': 'Meteo',
        'Mourning Star': 'Morgenstern',
        'Mythcall': 'Mythenruf',
        'Orb x5': 'Orb x5', // FIXME
        'Ozma Ability': 'Ozma Ability', // FIXME
        'Piercing Dark': 'Lanze der Finsternis',
        'Piercing Light': 'Lanze des Lichts',
        'Pitfall': 'Berstender Boden',
        'Pyramid Form': 'Pyramid Form', // FIXME
        'Random Form': 'Random Form', // FIXME
        'Random Shade': 'Random Shade', // FIXME
        'Shade Ability': 'Shade Ability', // FIXME
        'Shingan': 'Betäubungsschlag',
        'Shooting Star': 'Sternschnuppe',
        'Soak Attack': 'Soak Attack', // FIXME
        'Spear Copy': 'Spear Copy', // FIXME
        'Spear Shade': 'Spear Shade', // FIXME
        'Sphere Form': 'Sphere Form', // FIXME
        'Spiritcull': 'Kettendämon',
        'Spirits of the Fallen': 'Heroische Seele',
        'Stack': 'Stack', // FIXME
        'Star Form': 'Star Form', // FIXME
        'Streak Lightning': 'Blitzladung',
        'Thricecull': 'Dreifachlanze',
        'Thundercall': 'Donnerruf',
        'Turbulent Aether': 'Äthersturm',
        'Ultimate Zantetsuken': 'Goku-Zantetsuken',
        'Umbral Essence': 'Arm der Dunkelheit',
        'Whirling Zantetsuken': 'Sen-Zantetsuken',
        'Wyvern Explosion': 'Wyvern Explosion', // FIXME
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Absolute Virtue': 'Vertu absolue',
        'Arsenal Centaur': 'centaure de l\'Arsenal',
        'Art': 'Art',
        'Ball Lightning': 'orbe de foudre',
        'Cloudlarker': 'rôdeur des nuages',
        'Ivory Palm': 'paume d\'ivoire',
        'Orlasrach': 'Orlasrach',
        'Owain': 'Owain',
        '(?<! )Ozma(?!\\w)': 'Ozma',
        'Ozmashade': 'ombre d\'Ozma',
        'Proto Ozma': 'Proto-Ozma',
        'Raiden': 'Raiden',
        'Relative Virtue': 'Vertu relative',
        'Shadow': 'ombre de Proto-Ozma',
        'Streak Lightning': 'Éclair chargeant',
        'The Lance of Virtue Containment Unit will be sealed off': 'The Lance of Virtue Containment Unit will be sealed off', // FIXME
        'The Proto Ozma Containment Unit will be sealed off': 'The Proto Ozma Containment Unit will be sealed off', // FIXME
        'The Shin-Zantetsuken Containment Unit will be sealed off': 'The Shin-Zantetsuken Containment Unit will be sealed off', // FIXME
      },
      'replaceText': {
        '--sync--': '--Synchronisation--',
        'Acallam Na Senorach': 'Spirale sépulcrale',
        'Acceleration Bomb': 'Bombe accélératrice',
        'Adds': 'Adds', // FIXME
        'Ame-no-Sakahoko': 'Ama-no-sakahoko',
        'Astral Essence': 'Bras de Lumière',
        'Auroral Wind': 'Vent d\'aurore',
        'Berserk': 'Furie',
        'Bitter Barbs': 'Ronce du péché',
        'Black Hole': 'Trou noir',
        'Bleed Attack': 'Bleed Attack', // FIXME
        'Booming Lament': 'Tonnerre du regret',
        'Call Wyvern': 'Appel de wyverne',
        'Carver/Spinner': 'Carver/Spinner', // FIXME
        'Cloud to Ground': 'Attaque fulminante',
        'Cube Form': 'Cube Form', // FIXME
        'Eidos': 'Sarva',
        'Elemental Magicks': 'Magie élémentaire',
        'Elemental Shift': 'Changement d\'élément',
        'Execration': 'Exécration',
        'Explosion Enrage': 'Explosion Enrage', // FIXME
        'Explosive Impulse': 'Impulsion explosive',
        'Flare Star': 'Astre flamboyant',
        'For Honor': 'Carnage martial',
        'Holy': 'Miracle',
        'Hostile Aspect': 'Onde polarisée',
        'Impact Stream': 'Courant d\'impact',
        'Ivory Palm': 'paume d\'ivoire',
        'Lancing Bolt': 'Lance fulminante',
        'Lateral Zantetsuken': 'Hen Zantetsuken',
        'Legendary Geas': 'Tuerie spectrale',
        'Legendary Imbas': 'Fiel spectral',
        'Legendcarver': 'Taillade spectrale',
        'Legendspinner': 'Spirale spectrale',
        'Levinwhorl': 'Vortex de foudre',
        'Medusa Javelin': 'Javelot de Méduse',
        'Meteor': 'Météore',
        'Mourning Star': 'Étoile du matin',
        'Mythcall': 'Invitation fantasmagorique',
        'Orb x5': 'Orb x5', // FIXME
        'Ozma Ability': 'Ozma Ability', // FIXME
        'Piercing Dark': 'Lance des ténèbres',
        'Piercing Light': 'Lance de lumière',
        'Pitfall': 'Embûche',
        'Pyramid Form': 'Pyramid Form', // FIXME
        'Random Form': 'Random Form', // FIXME
        'Random Shade': 'Random Shade', // FIXME
        'Shade Ability': 'Shade Ability', // FIXME
        'Shingan': 'Impact oculaire',
        'Shooting Star': 'Étoile filante',
        'Soak Attack': 'Soak Attack', // FIXME
        'Spear Copy': 'Spear Copy', // FIXME
        'Spear Shade': 'Spear Shade', // FIXME
        'Sphere Form': 'Sphere Form', // FIXME
        'Spiritcull': 'Salve magique',
        'Spirits of the Fallen': 'Âme héroïque',
        'Stack': 'Stack', // FIXME
        'Star Form': 'Star Form', // FIXME
        'Streak Lightning': 'Éclair chargeant',
        'Thricecull': 'Triple perforation',
        'Thundercall': 'Drain fulminant',
        'Turbulent Aether': 'Turbulence éthérée',
        'Ultimate Zantetsuken': 'Goku Zantetsuken',
        'Umbral Essence': 'Bras de Ténèbres',
        'Whirling Zantetsuken': 'Sen Zantetsuken',
        'Wyvern Explosion': 'Wyvern Explosion', // FIXME
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Absolute Virtue': 'アブソリュートヴァーチュー',
        'Arsenal Centaur': 'アーセナル・セントール',
        'Art': 'アルト',
        'Ball Lightning': '雷球',
        'Cloudlarker': 'クラウドラーカー',
        'Ivory Palm': '白き手',
        'Orlasrach': 'オールラスラッハ',
        'Owain': 'オーウェン',
        '(?<! )Ozma(?!\\w)': 'オズマ',
        'Ozmashade': 'オズマの影',
        'Proto Ozma': 'プロトオズマ',
        'Raiden': 'ライディーン',
        'Relative Virtue': 'レラティブヴァーチュー',
        'Shadow': 'プロトオズマの影',
        'Streak Lightning': 'ストリークライトニング',
        'The Lance of Virtue Containment Unit will be sealed off': 'The Lance of Virtue Containment Unit will be sealed off', // FIXME
        'The Proto Ozma Containment Unit will be sealed off': 'The Proto Ozma Containment Unit will be sealed off', // FIXME
        'The Shin-Zantetsuken Containment Unit will be sealed off': 'The Shin-Zantetsuken Containment Unit will be sealed off', // FIXME
      },
      'replaceText': {
        '--sync--': '--sync--',
        'Acallam Na Senorach': '真妖槍旋',
        'Acceleration Bomb': '加速度爆弾',
        'Adds': 'Adds', // FIXME
        'Ame-no-Sakahoko': '天逆鉾',
        'Astral Essence': '光の腕',
        'Auroral Wind': 'オーロラルウィンド',
        'Berserk': 'ベルセルク',
        'Bitter Barbs': '罪の荊棘',
        'Black Hole': 'ブラックホール',
        'Bleed Attack': 'Bleed Attack', // FIXME
        'Booming Lament': '哀惜の雷鳴',
        'Call Wyvern': 'コールワイバーン',
        'Carver/Spinner': 'Carver/Spinner', // FIXME
        'Cloud to Ground': '襲雷',
        'Cube Form': 'Cube Form', // FIXME
        'Eidos': '変異',
        'Elemental Magicks': 'エレメンタルマジック',
        'Elemental Shift': 'エレメントスイッチ',
        'Execration': 'エクセクレイション',
        'Explosion Enrage': 'Explosion Enrage', // FIXME
        'Explosive Impulse': 'エクスプロシブインパルス',
        'Flare Star': 'フレアスター',
        'For Honor': '戦死撃',
        'Holy': 'ホーリー',
        'Hostile Aspect': '極性波動',
        'Impact Stream': 'インパクトストリーム',
        'Ivory Palm': '白き手',
        'Lancing Bolt': '雷槍',
        'Lateral Zantetsuken': '片・斬鉄剣',
        'Legendary Geas': '妖槍乱撃',
        'Legendary Imbas': '妖槍邪念',
        'Legendcarver': '妖槍振',
        'Legendspinner': '妖槍旋',
        'Levinwhorl': '渦雷',
        'Medusa Javelin': 'メデューサジャベリン',
        'Meteor': 'メテオ',
        'Mourning Star': 'モーニングスター',
        'Mythcall': '幻槍招来',
        'Orb x5': 'Orb x5', // FIXME
        'Ozma Ability': 'Ozma Ability', // FIXME
        'Piercing Dark': '闇の槍',
        'Piercing Light': '光の槍',
        'Pitfall': '強襲',
        'Pyramid Form': 'Pyramid Form', // FIXME
        'Random Form': 'Random Form', // FIXME
        'Random Shade': 'Random Shade', // FIXME
        'Shade Ability': 'Shade Ability', // FIXME
        'Shingan': '真眼撃',
        'Shooting Star': 'シューティングスター',
        'Soak Attack': 'Soak Attack', // FIXME
        'Spear Copy': 'Spear Copy', // FIXME
        'Spear Shade': 'Spear Shade', // FIXME
        'Sphere Form': 'Sphere Form', // FIXME
        'Spiritcull': '連装魔',
        'Spirits of the Fallen': '英霊魂',
        'Stack': 'Stack', // FIXME
        'Star Form': 'Star Form', // FIXME
        'Streak Lightning': 'ストリークライトニング',
        'Thricecull': '三連槍',
        'Thundercall': '招雷',
        'Turbulent Aether': 'エーテル乱流',
        'Ultimate Zantetsuken': '極・斬鉄剣',
        'Umbral Essence': '闇の腕',
        'Whirling Zantetsuken': '旋・斬鉄剣',
        'Wyvern Explosion': 'Wyvern Explosion', // FIXME
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Absolute Virtue': '绝对的美德',
        'Arsenal Centaur': '兵武半人马',
        'Art': '亚特',
        'Ball Lightning': '闪电球',
        'Cloudlarker': '翻云狮鹫',
        'Ivory Palm': '白手',
        'Orlasrach': '烈焰金枪',
        'Owain': '欧文',
        '(?<! )Ozma(?!\\w)': '奥兹玛',
        'Ozmashade': '奥兹玛之影',
        'Proto Ozma': '奥兹玛原型',
        'Raiden': '莱丁',
        'Relative Virtue': '相对的美德',
        'Shadow': '奥兹玛原型之影',
        'Streak Lightning': '强袭雷光',
        'The Lance of Virtue Containment Unit will be sealed off': 'The Lance of Virtue Containment Unit will be sealed off', // FIXME
        'The Proto Ozma Containment Unit will be sealed off': 'The Proto Ozma Containment Unit will be sealed off', // FIXME
        'The Shin-Zantetsuken Containment Unit will be sealed off': 'The Shin-Zantetsuken Containment Unit will be sealed off', // FIXME
      },
      'replaceText': {
        '--sync--': '--sync--', // FIXME
        'Acallam Na Senorach': '真妖枪旋',
        'Acceleration Bomb': '加速度炸弹',
        'Adds': 'Adds', // FIXME
        'Ame-no-Sakahoko': '天逆矛',
        'Astral Essence': '光之腕',
        'Auroral Wind': '极光之风',
        'Berserk': '狂暴',
        'Bitter Barbs': '罪恶荆棘',
        'Black Hole': '黑洞',
        'Bleed Attack': 'Bleed Attack', // FIXME
        'Booming Lament': '哀痛雷鸣',
        'Call Wyvern': '召唤飞龙',
        'Carver/Spinner': 'Carver/Spinner', // FIXME
        'Cloud to Ground': '袭雷',
        'Cube Form': 'Cube Form', // FIXME
        'Eidos': '变异',
        'Elemental Magicks': '元素魔法',
        'Elemental Shift': '元素开关',
        'Execration': '缩小射线',
        'Explosion Enrage': 'Explosion Enrage', // FIXME
        'Explosive Impulse': '爆炸性冲击',
        'Flare Star': '耀星',
        'For Honor': '战死击',
        'Holy': '神圣',
        'Hostile Aspect': '极性波动',
        'Impact Stream': '冲击流',
        'Ivory Palm': '白手',
        'Lancing Bolt': '雷枪',
        'Lateral Zantetsuken': '片·斩铁剑',
        'Legendary Geas': '妖枪乱击',
        'Legendary Imbas': '妖枪邪念',
        'Legendcarver': '妖枪振',
        'Legendspinner': '妖枪振',
        'Levinwhorl': '涡雷',
        'Medusa Javelin': '美杜莎投枪',
        'Meteor': '陨石',
        'Mourning Star': '启明星',
        'Mythcall': '幻枪招来',
        'Orb x5': 'Orb x5', // FIXME
        'Ozma Ability': 'Ozma Ability', // FIXME
        'Piercing Dark': '暗之枪',
        'Piercing Light': '光之枪',
        'Pitfall': '强袭',
        'Pyramid Form': 'Pyramid Form', // FIXME
        'Random Form': 'Random Form', // FIXME
        'Random Shade': 'Random Shade', // FIXME
        'Shade Ability': 'Shade Ability', // FIXME
        'Shingan': '真眼击',
        'Shooting Star': '流星',
        'Soak Attack': 'Soak Attack', // FIXME
        'Spear Copy': 'Spear Copy', // FIXME
        'Spear Shade': 'Spear Shade', // FIXME
        'Sphere Form': 'Sphere Form', // FIXME
        'Spiritcull': '连装魔',
        'Spirits of the Fallen': '英灵魂',
        'Stack': 'Stack', // FIXME
        'Star Form': 'Star Form', // FIXME
        'Streak Lightning': '强袭雷光',
        'Thricecull': '三连枪',
        'Thundercall': '招雷',
        'Turbulent Aether': '以太乱流',
        'Ultimate Zantetsuken': '极·斩铁剑',
        'Umbral Essence': '暗之腕',
        'Whirling Zantetsuken': '旋·斩铁剑',
        'Wyvern Explosion': 'Wyvern Explosion', // FIXME
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Absolute Virtue': '절대미덕',
        'Arsenal Centaur': '무기고 켄타우로스',
        'Art': '아르트',
        'Ball Lightning': '전기 구체',
        'Cloudlarker': '구름 잠복자',
        'Ivory Palm': '하얀 손',
        'Orlasrach': '오를라스라흐',
        'Owain': '오와인',
        '(?<! )Ozma(?!\\w)': '오즈마',
        'Ozmashade': '오즈마의 그림자',
        'Proto Ozma': '프로토 오즈마',
        'Raiden': '라이딘',
        'Relative Virtue': '상대미덕',
        'Shadow': '프로토 오즈마의 그림자',
        'Streak Lightning': '연쇄 번개',
        'The Lance of Virtue Containment Unit will be sealed off': 'The Lance of Virtue Containment Unit will be sealed off', // FIXME
        'The Proto Ozma Containment Unit will be sealed off': 'The Proto Ozma Containment Unit will be sealed off', // FIXME
        'The Shin-Zantetsuken Containment Unit will be sealed off': 'The Shin-Zantetsuken Containment Unit will be sealed off', // FIXME
      },
      'replaceText': {
        '--sync--': '--sync--', // FIXME
        'Acallam Na Senorach': '피어너의 창',
        'Acceleration Bomb': '가속도 폭탄',
        'Adds': 'Adds', // FIXME
        'Ame-no-Sakahoko': '아메노사카호코',
        'Astral Essence': '빛의 팔',
        'Auroral Wind': '오로라 바람',
        'Berserk': '광포',
        'Bitter Barbs': '죄의 가시',
        'Black Hole': '블랙홀',
        'Bleed Attack': 'Bleed Attack', // FIXME
        'Booming Lament': '애도의 뇌명',
        'Call Wyvern': '와이번 소환',
        'Carver/Spinner': 'Carver/Spinner', // FIXME
        'Cloud to Ground': '습뢰',
        'Cube Form': 'Cube Form', // FIXME
        'Eidos': '변이',
        'Elemental Magicks': '엘리멘탈 마법',
        'Elemental Shift': '엘리멘탈 변환',
        'Execration': '혐오의 저주',
        'Explosion Enrage': 'Explosion Enrage', // FIXME
        'Explosive Impulse': '폭발적 추진력',
        'Flare Star': '타오르는 별',
        'For Honor': '전사격',
        'Holy': '홀리',
        'Hostile Aspect': '극성 파동',
        'Impact Stream': '충격 기류',
        'Ivory Palm': '하얀 손',
        'Lancing Bolt': '뇌창',
        'Lateral Zantetsuken': '편 참철검',
        'Legendary Geas': '요창난격',
        'Legendary Imbas': '요창의 사념',
        'Legendcarver': '요창 떨치기',
        'Legendspinner': '요창 후리기',
        'Levinwhorl': '와뢰',
        'Medusa Javelin': '메두사의 투창',
        'Meteor': '메테오',
        'Mourning Star': '샛별',
        'Mythcall': '환창 소환',
        'Orb x5': 'Orb x5', // FIXME
        'Ozma Ability': 'Ozma Ability', // FIXME
        'Piercing Dark': '어둠의 창',
        'Piercing Light': '빛의 창',
        'Pitfall': '강습',
        'Pyramid Form': 'Pyramid Form', // FIXME
        'Random Form': 'Random Form', // FIXME
        'Random Shade': 'Random Shade', // FIXME
        'Shade Ability': 'Shade Ability', // FIXME
        'Shingan': '진안격',
        'Shooting Star': '유성',
        'Soak Attack': 'Soak Attack', // FIXME
        'Spear Copy': 'Spear Copy', // FIXME
        'Spear Shade': 'Spear Shade', // FIXME
        'Sphere Form': 'Sphere Form', // FIXME
        'Spiritcull': '마법 연발',
        'Spirits of the Fallen': '영령혼',
        'Stack': 'Stack', // FIXME
        'Star Form': 'Star Form', // FIXME
        'Streak Lightning': '연쇄 번개',
        'Thricecull': '삼연창',
        'Thundercall': '초뢰',
        'Turbulent Aether': '에테르 난류',
        'Ultimate Zantetsuken': '극 참철검',
        'Umbral Essence': '어둠의 팔',
        'Whirling Zantetsuken': '선 참철검',
        'Wyvern Explosion': 'Wyvern Explosion', // FIXME
      },
    },
  ],
}];
