'use strict';

[{
  zoneId: ZoneId.TheForbiddenLandEurekaHydatos,
  timelineFile: 'eureka_hydatos.txt',
  resetWhenOutOfCombat: false,
  timelineTriggers: [
    {
      id: 'BA Art Geas',
      regex: /Legendary Geas/,
      beforeSeconds: 0,
      response: Responses.stopMoving(),
    },
    {
      id: 'BA Raiden Levinwhorl',
      regex: /Levinwhorl/,
      beforeSeconds: 10,
      alertText: {
        en: 'Shields and Mitigation',
        de: 'Schilde und Abschwächungen',
        fr: 'Boucliers et mitigation',
        ja: 'ダメージ軽減とバリアを',
        cn: '切盾减伤',
      },
    },
    {
      id: 'BA AV Eurekan Potion',
      regex: /Explosive Impulse/,
      beforeSeconds: 10,
      suppressSeconds: 60,
      infoText: {
        en: 'Pop Eurekan Potions',
        de: 'Eureka-Heiltränke benutzen',
        fr: 'Utilisez potion d\'Eurêka',
        ja: 'エウレカ回復薬',
        cn: '磕优雷卡回复药',
      },
    },
    {
      id: 'BA Ozma Black Hole Warning',
      regex: /Black Hole/,
      beforeSeconds: 12,
      infoText: {
        en: 'Black Hole Soon',
        de: 'Schwarzes Loch',
        fr: 'Trou noir bientôt',
        ja: 'まもなくブラックホール',
        cn: '黑洞警告',
      },
    },
  ],
  triggers: [
    {
      id: 'BA Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '5 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经5分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '5분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        ja: '目を覚めて！',
        cn: '醒醒！动一动！！',
        ko: '강제 퇴장 5분 전',
      },
    },
    {
      id: 'BA Saved By Rememberance',
      netRegex: NetRegexes.gameLog({ line: 'The memories of heroes past live on again.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Das Vermächtnis vergangener Helden lebt von Neuem auf.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'L\'égide des héros vaillants vous a ressuscité.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '英傑の加護の効果が発揮され、蘇生された.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '发动了英杰的加护效果，重新苏醒了过来.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '영걸의 가호의 효과가 발휘되어 부활했습니다.*?', capture: false }),
      sound: 'Long',
    },
    {
      id: 'BA Seal',
      netRegex: NetRegexes.message({ line: '.* will be sealed off.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: 'Noch 15 Sekunden, bis sich (?:(?:der|die|das) )?(?:Zugang zu(?:[rm]| den)? )?.* schließt.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: 'Fermeture d(?:e|u|es) $1 dans.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '$1の封鎖まであと', capture: false }),
      netRegexCn: NetRegexes.message({ line: '距$1被封锁还有.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '15초 후에 $1(?:이|가) 봉쇄됩니다.*?', capture: false }),
      run: function(data) {
        data.sealed = true;
      },
    },
    {
      id: 'BA Clear Data',
      netRegex: NetRegexes.message({ line: '.*is no longer sealed.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: '.*öffnet sich (?:wieder|erneut).*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: '.*Ouverture .*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '.*の封鎖が解かれた.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '.*的封锁解除了.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '.*의 봉쇄가 해제되었습니다.*?', capture: false }),
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
      netRegex: NetRegexes.abilityFull({ id: '3956', source: 'Art', target: '[^:]+', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ id: '3956', source: 'Art', target: '[^:]+', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ id: '3956', source: 'Art', target: '[^:]+', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ id: '3956', source: 'アルト', target: '[^:]+', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ id: '3956', source: '亚特', target: '[^:]+', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ id: '3956', source: '아르트', target: '[^:]+', capture: false }),
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'west';
      },
    },
    {
      id: 'BA East Side',
      netRegex: NetRegexes.abilityFull({ id: '3957', source: 'Owain', target: '[^:]+', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ id: '3957', source: 'Owain', target: '[^:]+', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ id: '3957', source: 'Owain', target: '[^:]+', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ id: '3957', source: 'オーウェン', target: '[^:]+', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ id: '3957', source: '欧文', target: '[^:]+', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ id: '3957', source: '오와인', target: '[^:]+', capture: false }),
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'east';
      },
    },
    {
      id: 'BA Art Mythcall',
      netRegex: NetRegexes.startsUsing({ id: '3927', source: 'Art', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3927', source: 'Art', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3927', source: 'Art', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3927', source: 'アルト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3927', source: '亚特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3927', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west';
      },
      run: function(data) {
        data.mythcall = true;
      },
    },
    {
      id: 'BA Art Tankbuster',
      netRegex: NetRegexes.startsUsing({ id: '3934', source: 'Art' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3934', source: 'Art' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3934', source: 'Art' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3934', source: 'アルト' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3934', source: '亚特' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3934', source: '아르트' }),
      condition: function(data) {
        return data.side == 'west';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'BA Art Orb Marker',
      netRegex: NetRegexes.headMarker({ id: '005C' }),
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Orb on YOU',
          de: 'Orb auf DIR',
          fr: 'Orbe sur VOUS',
          ja: '自分に玉',
          cn: '点名',
          ko: '구슬 대상자',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Away From Orb Marker',
          de: 'Weg vom Orb-Marker',
          fr: 'Éloignez-vous du marquage Orbe',
          ja: '玉に離れ',
          cn: '远离点名',
          ko: '구슬 대상자에서 떨어지기',
        };
      },
    },
    {
      id: 'BA Art Piercing Dark Marker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'west' && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'BA Art Legendcarver',
      netRegex: NetRegexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3928', source: 'アルト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3928', source: '亚特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3928', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west';
      },
      response: Responses.getOut(),
    },
    {
      id: 'BA Art Legendspinner',
      netRegex: NetRegexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3929', source: 'アルト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3929', source: '亚特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3929', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west';
      },
      response: Responses.getIn(),
    },
    {
      id: 'BA Art Mythcall Legendcarver',
      netRegex: NetRegexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3928', source: 'Art', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3928', source: 'アルト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3928', source: '亚特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3928', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      response: Responses.getUnder(),
    },
    {
      id: 'BA Art Mythcall Legendspinner',
      netRegex: NetRegexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3929', source: 'Art', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3929', source: 'アルト', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3929', source: '亚特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3929', source: '아르트', capture: false }),
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Spears',
        de: 'Unter einen Speer',
        fr: 'En dessous des lances',
        ja: '妖槍旋',
        cn: '枪脚下',
        ko: '창 아래로',
      },
    },
    {
      id: 'BA Owain Tankbuster',
      netRegex: NetRegexes.startsUsing({ id: '3945', source: 'Owain' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3945', source: 'Owain' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3945', source: 'Owain' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3945', source: 'オーウェン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3945', source: '欧文' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3945', source: '오와인' }),
      condition: function(data) {
        return data.side == 'west';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'BA Owain Piercing Light Marker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'BA Owain Dorito Stack',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      response: Responses.doritoStack(),
    },
    {
      id: 'BA Owain Fire Element',
      netRegex: NetRegexes.dialog({ line: '[^:]*:Munderg, turn flesh to ash.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: '[^:]*:Munderg, entfessele den Flammeneid.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: '[^:]*:Oui... Munderg, sens le feu embraser nos âmes.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '[^:]*:白の妖槍「ムンジャルグ」、燃え上がれ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '[^:]*:红颈妖枪，点燃一切.*?', capture: false }),
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Ice',
        de: 'Geh zum Eis',
        fr: 'Allez à la glace',
        ja: '氷に',
        cn: '冰',
        ko: '얼음',
      },
      infoText: {
        en: 'Switch Magia',
        de: 'Magia-Brett drehen',
        fr: 'Changez de Magia',
        ja: 'マギアボードを切替',
        cn: '切换元素板',
        ko: '마기아 전환',
      },
    },
    {
      id: 'BA Owain Ice Element',
      netRegex: NetRegexes.dialog({ line: '[^:]*:Munderg, turn blood to ice.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: '[^:]*:Munderg, das Eis der Ewigkeit soll sie für Äonen bannen.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: '[^:]*:C\'est bien, Munderg... Glace le sang de mes ennemis.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '[^:]*:白の妖槍「ムンジャルグ」、震え凍れよ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '[^:]*:红颈妖枪，冻结万物.*?', capture: false }),
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Fire',
        de: 'Geh zum Feuer',
        fr: 'Allez au feu',
        ja: '火',
        cn: '火',
        ko: '불',
      },
      infoText: {
        en: 'Switch Magia',
        de: 'Magia-Brett drehen',
        fr: 'Changez de Magia',
        ja: 'マギアボードを切替',
        cn: '切换元素板',
        ko: '마기아 전환',
      },
    },
    {
      id: 'BA Owain Ivory Palm',
      netRegex: NetRegexes.ability({ id: '3941', source: 'Ivory Palm' }),
      netRegexDe: NetRegexes.ability({ id: '3941', source: 'Weiß(?:e|er|es|en) Hand' }),
      netRegexFr: NetRegexes.ability({ id: '3941', source: 'Paume D\'Ivoire' }),
      netRegexJa: NetRegexes.ability({ id: '3941', source: '白き手' }),
      netRegexCn: NetRegexes.ability({ id: '3941', source: '白手' }),
      netRegexKo: NetRegexes.ability({ id: '3941', source: '하얀 손' }),
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches.target;
      },
      response: Responses.doritoStack(),
    },
    {
      id: 'BA Owain Pitfall',
      netRegex: NetRegexes.startsUsing({ id: '394D', source: 'Owain', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '394D', source: 'Owain', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '394D', source: 'Owain', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '394D', source: 'オーウェン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '394D', source: '欧文', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '394D', source: '오와인', capture: false }),
      condition: function(data) {
        return data.side == 'east';
      },
      response: Responses.getOut(),
    },
    {
      id: 'BA Silence Centaur',
      netRegex: NetRegexes.startsUsing({ id: '3BFE', source: 'Arsenal Centaur' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3BFE', source: 'Arsenal-Zentaur' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3BFE', source: 'Centaure De L\'Arsenal' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3BFE', source: 'アーセナル・セントール' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3BFE', source: '兵武半人马' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3BFE', source: '무기고 켄타우로스' }),
      condition: function(data) {
        return data.CanSleep();
      },
      response: Responses.sleep(),
    },
    {
      id: 'BA Raiden Tankbuster',
      netRegex: NetRegexes.startsUsing({ id: '387B', source: 'Raiden' }),
      netRegexDe: NetRegexes.startsUsing({ id: '387B', source: 'Raiden' }),
      netRegexFr: NetRegexes.startsUsing({ id: '387B', source: 'Raiden' }),
      netRegexJa: NetRegexes.startsUsing({ id: '387B', source: 'ライディーン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '387B', source: '莱丁' }),
      netRegexKo: NetRegexes.startsUsing({ id: '387B', source: '라이딘' }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'BA Raiden Lancing Bolt',
      netRegex: NetRegexes.headMarker({ id: '008A' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'BA Raiden Ame',
      netRegex: NetRegexes.startsUsing({ id: '3868', source: 'Raiden', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3868', source: 'Raiden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3868', source: 'Raiden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3868', source: 'ライディーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3868', source: '莱丁', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3868', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.getOut(),
    },
    {
      id: 'BA Raiden Whirling',
      netRegex: NetRegexes.startsUsing({ id: '386A', source: 'Raiden', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '386A', source: 'Raiden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '386A', source: 'Raiden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '386A', source: 'ライディーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '386A', source: '莱丁', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '386A', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.getUnder(),
    },
    {
      id: 'BA Raiden For Honor',
      netRegex: NetRegexes.startsUsing({ id: '387C', source: 'Raiden', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '387C', source: 'Raiden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '387C', source: 'Raiden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '387C', source: 'ライディーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '387C', source: '莱丁', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '387C', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.getOut(),
    },
    {
      id: 'BA Raiden Lateral 1',
      netRegex: NetRegexes.startsUsing({ id: '386C', source: 'Raiden', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '386C', source: 'Raiden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '386C', source: 'Raiden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '386C', source: 'ライディーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '386C', source: '莱丁', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '386C', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.goLeft(),
    },
    {
      id: 'BA Raiden Lateral 2',
      netRegex: NetRegexes.startsUsing({ id: '386B', source: 'Raiden', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '386B', source: 'Raiden', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '386B', source: 'Raiden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '386B', source: 'ライディーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '386B', source: '莱丁', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '386B', source: '라이딘', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.goRight(),
    },
    {
      id: 'BA AV Tankbuster',
      netRegex: NetRegexes.startsUsing({ id: '379A', source: 'Absolute Virtue' }),
      netRegexDe: NetRegexes.startsUsing({ id: '379A', source: 'Absolut(?:e|er|es|en) Tugend' }),
      netRegexFr: NetRegexes.startsUsing({ id: '379A', source: 'Vertu Absolue' }),
      netRegexJa: NetRegexes.startsUsing({ id: '379A', source: 'アブソリュートヴァーチュー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '379A', source: '绝对的美德' }),
      netRegexKo: NetRegexes.startsUsing({ id: '379A', source: '절대미덕' }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'BA AV Eidos Dark Bracelets',
      netRegex: NetRegexes.startsUsing({ id: '3787', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3787', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3787', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3787', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3787', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3787', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Dark Bracelets',
        de: 'Dunkle Armreife',
        fr: 'Bracelets ténèbreux',
        ja: '黒リング',
        cn: '黑光环',
        ko: '어두운 고리',
      },
      run: function(data) {
        data.bracelets = 'dark';
      },
    },
    {
      id: 'BA AV Eidos Light Bracelets',
      netRegex: NetRegexes.startsUsing({ id: '3786', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3786', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3786', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3786', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3786', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3786', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Light Bracelets',
        de: 'Helle Armreife',
        fr: 'Bracelets lumineux',
        ja: '白リング',
        cn: '白光环',
        ko: '빛 고리',
      },
      run: function(data) {
        data.bracelets = 'light';
      },
    },
    {
      id: 'BA AV Eidos Hostile Aspect',
      netRegex: NetRegexes.startsUsing({ id: '378B', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '378B', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '378B', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '378B', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '378B', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '378B', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (!data.seenHostile) {
          if (data.bracelets == 'light') {
            return {
              en: 'Away From Light Circles',
              de: 'Weg von hellen Kreisen',
              fr: 'Éloignez-vous des cercles lumineux',
              ja: '白リングに離れ',
              cn: '远离白圈',
              ko: '밝은 원에서 떨어지기',
            };
          }
          if (data.bracelets == 'dark') {
            return {
              en: 'Away From Dark Circles',
              de: 'Weg von dunklen Kreisen',
              fr: 'Éloignez-vous des cercles ténèbreux',
              ja: '黒リングに離れ',
              cn: '远离黑圈',
              ko: '어두운 원에서 떨어지기',
            };
          }
          return;
        }
        if (data.bracelets == 'light') {
          return {
            en: 'Stand By Dark Circles',
            de: 'Zu den dunklen Kreisen',
            fr: 'Tenez-vous près des cercles ténèbreux',
            ja: '黒リングに近づく',
            cn: '靠近黑圈',
            ko: '어두운 원 옆에 서기',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Stand By Light Circles',
            de: 'zu den hellen Kreisen',
            fr: 'Tenez-vous près des cercles lumineux',
            ja: '白リングに近づく',
            cn: '靠近白圈',
            ko: '밝은 원 옆에 서기',
          };
        }
      },
      run: function(data) {
        data.seenHostile = true;
      },
    },
    {
      id: 'BA AV Eidos Impact Stream',
      netRegex: NetRegexes.startsUsing({ id: '3788', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3788', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3788', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3788', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3788', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3788', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (data.bracelets == 'light') {
          return {
            en: 'Dark',
            de: 'Dunkel',
            fr: 'Ténèbres',
            ja: '黒',
            cn: '黑',
            ko: '어둠',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Light',
            de: 'Hell',
            fr: 'Lumière',
            ja: '白',
            cn: '白',
            ko: '빛',
          };
        }
      },
    },
    {
      // Note: These use 00:3...: lines, without any proper "gains effect" lines.
      // In other words, they need to be the fully translated in game log.
      // There are no "gainsEffect" lines for the clones, only for Absolute Virtue directly.
      // Ideally parser logic could be added for this case, but this is where we are.
      id: 'BA AV Eidos Relative Virtue Astral',
      netRegex: NetRegexes.gameLog({ line: 'Relative Virtue gains the effect of Astral Essence.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Die Relative Tugend erhält den Effekt von.*?Arm der Lichts.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Vertu relative bénéficie de l\'effet.*?Bras de Lumière.*?', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      run: function(data) {
        // RV clones get buffs in the reverse order that they do their attacks in.
        data.clones = data.clones || [];
        data.clones.push('astral');
      },
    },
    {
      // See note above for `BA AV Eidos Relative Virtue Astral`.
      id: 'BA AV Eidos Relative Virtue Umbral',
      netRegex: NetRegexes.gameLog({ line: 'Relative Virtue gains the effect of Umbral Essence.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Die Relative Tugend erhält den Effekt von.*?Arm der Dunkelheit.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Vertu relative bénéficie de l\'effet.*?Bras de Ténèbres.*?', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      run: function(data) {
        // RV clones get buffs in the reverse order that they do their attacks in.
        data.clones = data.clones || [];
        data.clones.push('umbral');
      },
    },
    {
      id: 'BA AV Triple Impact Stream',
      netRegex: NetRegexes.startsUsing({ id: '3797', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3797', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3797', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3797', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3797', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3797', source: '절대미덕', capture: false }),
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
            fr: 'Ténèbres',
            ja: '黒',
            cn: '黑',
            ko: '어둠',
          };
        }
        if (wrists == 'Umbral') {
          return {
            en: 'Light',
            de: 'Hell',
            fr: 'Lumière',
            ja: '白',
            cn: '白',
            ko: '빛',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Turbulent Aether',
      netRegex: NetRegexes.ability({ id: '3790', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '3790', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '3790', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '3790', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '3790', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '3790', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Orbs to Opposite Colors',
        de: 'Kugeln zu umgekehrter Farbe',
        fr: 'Orbes aux couleurs opposées',
        ja: '反対の色に',
        cn: '连线去相反颜色',
        ko: '구슬 반대 색깔로',
      },
    },
    {
      id: 'BA AV Call Wyvern',
      netRegex: NetRegexes.ability({ id: '3798', source: 'Absolute Virtue', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '3798', source: 'Absolut(?:e|er|es|en) Tugend', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '3798', source: 'Vertu Absolue', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '3798', source: 'アブソリュートヴァーチュー', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '3798', source: '绝对的美德', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '3798', source: '절대미덕', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      response: Responses.killAdds(),
    },
    {
      id: 'BA Ozma Sphere Form',
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: ['37B3', '37A5', '379F'], capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: ['37B3', '37A5', '379F'], capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: ['37B3', '37A5', '379F'], capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: ['37B3', '37A5', '379F'], capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: ['37B3', '37A5', '379F'], capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: ['37B3', '37A5', '379F'], capture: false }),
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
          fr: 'Trou noir ' + data.blackHoleCount + ' / 6',
          ja: 'ブラックホール: ' + data.blackHoleCount + ' / 6',
          cn: '黑洞 ' + data.blackHoleCount + ' / 6',
          ko: '블랙홀' + data.blackHoleCount + ' / 6',
        };
      },
      tts: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount,
          de: 'Schwarzes Loch ' + data.blackHoleCount,
          fr: 'Trou noir ' + data.blackHoleCount,
          ja: 'ブラックホール ' + data.blackHoleCount,
          cn: '黑洞 ' + data.blackHoleCount,
          ko: '블랙홀' + data.blackHoleCount,
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
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: '37A4', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: '37A4', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: '37A4', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: '37A4', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: '37A4', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: '37A4', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Off the Platform',
        de: 'Weg von der Fläche',
        fr: 'Hors de la plateforme',
        ja: '回避',
        cn: '远离平台',
        ko: '멀어지기',
      },
    },
    {
      id: 'BA Ozma Pyramid Form 2',
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: '37A4', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: '37A4', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: '37A4', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: '37A4', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: '37A4', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: '37A4', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      delaySeconds: 9,
      infoText: {
        en: 'Spread for Bleed',
        de: 'Blutung verteilen',
        fr: 'Dispersez-vous pour le saignement',
        ja: '散開',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'BA Ozma Star Form',
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: '37B2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: '37B2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: '37B2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: '37B2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: '37B2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: '37B2', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Go Far',
        de: 'Weit weg',
        fr: 'Éloignez-vous',
        ja: '離れ',
        cn: '远离',
        ko: '멀리가기',
      },
    },
    {
      id: 'BA Ozma Star Form 2',
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: '37B2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: '37B2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: '37B2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: '37B2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: '37B2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: '37B2', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      delaySeconds: 9,
      infoText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Stack (if not tanking)',
            de: 'Stack (wenn nicht am tanken)',
            fr: 'Packez-vous (sauf les tanks)',
            ja: '集合 (MTではないなら)',
            cn: '集合（如果没在坦怪）',
            ko: '집합 (탱킹 중인 사람 제외)',
          };
        }
        return {
          en: 'Stack Up',
          de: 'Stacken',
          fr: 'Packez-vous en haut',
          ja: '集合',
          cn: '集合',
          ko: '집합',
        };
      },
    },
    {
      id: 'BA Ozma Cube Form',
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: '379E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: '379E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: '379E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: '379E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: '379E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: '379E', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Close',
        de: 'Nah dran',
        fr: 'Rapprochez-vous',
        ja: '近づいて',
        cn: '靠近',
        ko: '가까이',
      },
    },
    {
      id: 'BA Ozma Cube Form 2',
      netRegex: NetRegexes.ability({ source: 'Proto Ozma', id: '379E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Proto-Yadis', id: '379E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Proto-Ozma', id: '379E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'プロトオズマ', id: '379E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奥兹玛原型', id: '379E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '프로토 오즈마', id: '379E', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      delaySeconds: 9,
      alertText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Offtanks Get Orbs',
            de: 'Offtanks holt Kugeln',
            fr: 'Offtanks, prenez les orbes',
            ja: 'STは玉を処理',
            cn: 'ST撞球',
            ko: '섭탱 구슬 가져가기',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Stack Away From Tank',
            de: 'Weg vom Tank stacken',
            fr: 'Packez-vous loin du tank',
            ja: 'タンクに離れて集合',
            cn: '远离坦克集合',
            ko: '탱커에서 멀어지기',
          };
        }
      },
    },
    {
      id: 'BA Ozma Pyramid Shade',
      netRegex: NetRegexes.ability({ source: ['Ozmashade', 'Shadow'], id: '37A4', capture: false }),
      netRegexDe: NetRegexes.ability({ source: ['Yadis-Schatten', 'Proto-Yadis-Schatten'], id: '37A4', capture: false }),
      netRegexFr: NetRegexes.ability({ source: ['Ombre D\'Ozma', 'Ombre De Proto-Ozma'], id: '37A4', capture: false }),
      netRegexJa: NetRegexes.ability({ source: ['オズマの影', 'プロトオズマの影'], id: '37A4', capture: false }),
      netRegexCn: NetRegexes.ability({ source: ['奥兹玛之影', '奥兹玛原型之影'], id: '37A4', capture: false }),
      netRegexKo: NetRegexes.ability({ source: ['오즈마의 그림자', '프로토 오즈마의 그림자'], id: '37A4', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Off',
        de: 'Weg da',
        fr: 'Descendez',
        ja: '回避',
        cn: '远离平台',
        ko: '멀어지기',
      },
    },
    {
      id: 'BA Ozma Star Shade',
      netRegex: NetRegexes.ability({ source: ['Ozmashade', 'Shadow'], id: '37B2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: ['Yadis-Schatten', 'Proto-Yadis-Schatten'], id: '37B2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: ['Ombre D\'Ozma', 'Ombre De Proto-Ozma'], id: '37B2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: ['オズマの影', 'プロトオズマの影'], id: '37B2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: ['奥兹玛之影', '奥兹玛原型之影'], id: '37B2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: ['오즈마의 그림자', '프로토 오즈마의 그림자'], id: '37B2', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Close',
        de: 'Nah dran',
        fr: 'Rapprochez-vous',
        ja: '近づく',
        cn: '靠近',
        ko: '가까이',
      },
    },
    {
      id: 'BA Ozma Cube Shade',
      netRegex: NetRegexes.ability({ source: ['Ozmashade', 'Shadow'], id: '379E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: ['Yadis-Schatten', 'Proto-Yadis-Schatten'], id: '379E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: ['Ombre D\'Ozma', 'Ombre De Proto-Ozma'], id: '379E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: ['オズマの影', 'プロトオズマの影'], id: '379E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: ['奥兹玛之影', '奥兹玛原型之影'], id: '379E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: ['오즈마의 그림자', '프로토 오즈마의 그림자'], id: '379E', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Go Far',
        de: 'Weit weg',
        fr: 'Éloignez-vous',
        ja: '離れ',
        cn: '远离',
        ko: '멀리',
      },
    },
    {
      id: 'BA Ozma Adds',
      netRegex: NetRegexes.ability({ source: 'Cloudlarker', id: '37B0', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Wolkenlauerer', id: '37B0', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Urolithe De L\'arsenal', id: '37B0', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'クラウドラーカー', id: '37B0', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '翻云狮鹫', id: '37B0', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '구름 잠복자', id: '37B0', capture: false }),
      condition: function(data) {
        return data.sealed;
      },
      delaySeconds: 2,
      suppressSeconds: 1,
      response: Responses.killAdds(),
    },
    {
      id: 'BA Ozma Acceleration Bomb',
      netRegex: NetRegexes.ability({ id: '37AA', source: 'Proto Ozma' }),
      netRegexDe: NetRegexes.ability({ id: '37AA', source: 'Proto-Yadis' }),
      netRegexFr: NetRegexes.ability({ id: '37AA', source: 'Proto-Ozma' }),
      netRegexJa: NetRegexes.ability({ id: '37AA', source: 'プロトオズマ' }),
      netRegexCn: NetRegexes.ability({ id: '37AA', source: '奥兹玛原型' }),
      netRegexKo: NetRegexes.ability({ id: '37AA', source: '프로토 오즈마' }),
      condition: function(data, matches) {
        return data.sealed && data.me == matches.target;
      },
      response: Responses.stopEverything(),
    },
    {
      id: 'BA Ozma Meteor',
      netRegex: NetRegexes.headMarker({ id: '0039' }),
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
        'Proto Ozma(?! containment)': 'Proto-Yadis',
        'Raiden': 'Raiden',
        'Relative Virtue(?! gains)': 'Relative Tugend',
        'Shadow': 'Proto-Yadis-Schatten',
        'Streak Lightning': 'Blitzladung',
        '5 minutes have elapsed since your last activity': 'Seit deiner letzten Aktivität sind 5 Minuten vergangen',
        'The memories of heroes past live on again': 'Das Vermächtnis vergangener Helden lebt von Neuem auf',
        'Munderg, turn flesh to ash': 'Munderg, entfessele den Flammeneid',
        'Munderg, turn blood to ice': 'Munderg, das Eis der Ewigkeit soll sie für Äonen bannen',
        'The Shin-Zantetsuken Containment Unit': 'Shin-Zantetsuken-Quarantäneblock',
        'The Lance of Virtue Containment Unit': 'Lanze der Tugend-Quarantäneblock',
        'The Proto Ozma Containment Unit': 'Proto-Yadis-Quarantäneblock',
        'Relative Virtue gains the effect of Astral Essence': 'Die Relative Tugend erhält den Effekt von.*?Arm der Lichts',
        'Relative Virtue gains the effect of Umbral Essence': 'Die Relative Tugend erhält den Effekt von.*?Arm der Dunkelheit',
      },
      'replaceText': {
        'Acallam Na Senorach': 'Legendärer Lanzenwirbel',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Adds': 'Adds',
        'Ame-no-Sakahoko': 'Himmelsriposte',
        'Auroral Wind': 'Aurorawind',
        'Bitter Barbs': 'Dornige Schuld',
        'Black Hole': 'Schwarzes Loch',
        'Bleed Attack': 'Blutungs-Angriff',
        'Booming Lament': 'Donnerschlag der Trauer',
        'Call Wyvern': 'Wyvernruf',
        'Carver/Spinner': 'Schnitzer/Spinner',
        'Cloud to Ground': 'Sturmkonzentration',
        'Cube Form': 'Würfel Form',
        'Eidos': 'Sarva',
        'Elemental Magicks': 'Elementmagie',
        'Elemental Shift': 'Elementwechsel',
        'Execration': 'Exsekration',
        'Explosive Impulse': 'Explosiver Impuls',
        'Flare Star': 'Flare-Stern',
        'For Honor': 'Hieb der Gefallenen',
        'Holy': 'Sanctus',
        'Hostile Aspect': 'Polarisierte Welle',
        'Impact Stream': 'Durchschlagsstrom',
        'Ivory Palm': 'weiße Hand',
        'Lancing Bolt': 'Donnerlanze',
        'Lateral Zantetsuken': 'Kata-Zantetsuken',
        'Legendary Geas': 'Legendenhieb',
        'Legendary Imbas': 'Legendäre Boshaftigkeit',
        'Legendcarver': 'Legendenschnitzer',
        'Legendspinner': 'Legendenspinner',
        'Levinwhorl': 'Wirbelsturm',
        'Medusa Javelin': 'Medusenspeer',
        'Meteor': 'Meteor',
        'Mourning Star': 'Morgenstern',
        'Mythcall': 'Mythenruf',
        'Orb x5': 'Kugel x5',
        'Ozma Ability': 'Yadis Fähigkeit',
        'Piercing Dark': 'Lanze der Finsternis',
        'Piercing Light': 'Lanze des Lichts',
        'Pitfall': 'Berstender Boden',
        'Pyramid Form': 'Pyramiden Form',
        'Random Form': 'Zufällige Form',
        'Random Shade': 'Zufällige Schatten',
        'Shade Ability': 'Schatten Fähigkeit',
        'Shingan': 'Betäubungsschlag',
        'Shooting Star': 'Sternschnuppe',
        'Soak Attack': 'Angriff absorbieren',
        'Spear Copy': 'Speer kopieren',
        'Spear Shade': 'Speer Schatten',
        'Sphere Form': 'Kugel Form',
        'Spiritcull': 'Kettendämon',
        'Spirits of the Fallen': 'Heroische Seele',
        'Star Form': 'Stern Form',
        'Streak Lightning': 'Blitzladung',
        'Thricecull': 'Dreifachlanze',
        'Thundercall': 'Donnerruf',
        'Turbulent Aether': 'Äthersturm',
        'Ultimate Zantetsuken': 'Goku-Zantetsuken',
        'Whirling Zantetsuken': 'Sen-Zantetsuken',
        'Wyvern Explosion': 'Wyvern Explosion',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Absolute Virtue': 'Vertu absolue',
        'Arsenal Centaur': 'Centaure de l\'Arsenal',
        'Art': 'Art',
        'Ball Lightning': 'Orbe de foudre',
        'Cloudlarker': 'Urolithe de l\'Arsenal',
        'Ivory Palm': 'Paume d\'ivoire',
        'Orlasrach': 'Orlasrach',
        'Owain': 'Owain',
        '(?<! )Ozma(?!\\w)': 'Ozma',
        'Ozmashade': 'Ombre d\'Ozma',
        'Proto Ozma(?! containment)': 'Proto-Ozma',
        'Raiden': 'Raiden',
        'Relative Virtue': 'Vertu relative',
        'Shadow': 'Ombre de Proto-Ozma',
        'Streak Lightning': 'Éclair chargeant',
        'The Lance of Virtue Containment Unit': 'l\'enceinte de confinement de la lance de la vertu',
        'The Proto Ozma Containment Unit': 'l\'enceinte de confinement de Proto-Ozma',
        'The Shin-Zantetsuken Containment Unit': 'l\'enceinte de confinement de Shin-Zantetsuken',
      },
      'replaceText': {
        '\\?': ' ?',
        'Acallam Na Senorach': 'Spirale sépulcrale',
        'Acceleration Bomb': 'Bombe accélératrice',
        'Adds': 'Adds',
        'Ame-no-Sakahoko': 'Ama-no-sakahoko',
        'Astral Essence': 'Bras de Lumière',
        'Auroral Wind': 'Vent d\'aurore',
        'Bitter Barbs': 'Ronce du péché',
        'Black Hole': 'Trou noir',
        'Bleed Attack': 'Attaque saignement',
        'Booming Lament': 'Tonnerre du regret',
        'Call Wyvern': 'Appel de wyverne',
        'Carver/Spinner': 'Taillade/Spirale',
        'Cloud to Ground': 'Attaque fulminante',
        'Cube Form': 'Forme cube',
        'Eidos': 'Sarva',
        'Elemental Magicks': 'Magie élémentaire',
        'Elemental Shift': 'Changement d\'élément',
        'Execration': 'Exécration',
        'Explosion Enrage': 'Explosion Enrage',
        'Explosive Impulse': 'Impulsion explosive',
        'Flare Star': 'Astre flamboyant',
        'For Honor': 'Carnage martial',
        'Holy': 'Miracle',
        'Hostile Aspect': 'Onde polarisée',
        'Impact Stream': 'Courant d\'impact',
        'Ivory Palm': 'Paume d\'ivoire',
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
        'Orb x5': 'Orbe x5',
        'Ozma Ability': 'Aptitude d\'Ozma',
        'Piercing Dark': 'Lance des ténèbres',
        'Piercing Light': 'Lance de lumière',
        'Pitfall': 'Embûche',
        'Pyramid Form': 'Forme pyramide',
        'Random Form': 'Forme aléatoire',
        'Random Shade': 'Ombre aléatoire',
        'Shade Ability': 'Aptitude d\'Ombre',
        'Shingan': 'Impact oculaire',
        'Shooting Star': 'Étoile filante',
        'Soak Attack': 'Absorbez l\'attaque',
        'Spear Copy': 'Copie de lance',
        'Spear Shade': 'Ombre de lance',
        'Sphere Form': 'Forme sphère',
        'Spiritcull': 'Salve magique',
        'Spirits of the Fallen': 'Âme héroïque',
        'Stack': 'Package',
        'Star Form': 'Forme étoile',
        'Streak Lightning': 'Éclair chargeant',
        'Thricecull': 'Triple perforation',
        'Thundercall': 'Drain fulminant',
        'Turbulent Aether': 'Turbulence éthérée',
        'Ultimate Zantetsuken': 'Goku Zantetsuken',
        'Umbral Essence': 'Bras de Ténèbres',
        'Whirling Zantetsuken': 'Sen Zantetsuken',
        'Wyvern Explosion': 'Wyverne Explosion',
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
        'Proto Ozma(?! containment)': 'プロトオズマ',
        'Raiden': 'ライディーン',
        'Relative Virtue': 'レラティブヴァーチュー',
        'Shadow': 'プロトオズマの影',
        'Streak Lightning': 'ストリークライトニング',
        'The Lance of Virtue Containment Unit': 'ランス・オブ・ヴァーチュー封印区',
        'The Proto Ozma Containment Unit': 'プロトオズマ封印区',
        'The Shin-Zantetsuken Containment Unit': '真・斬鉄剣封印区',
      },
      'replaceText': {
        '\\?': ' ?',
        'Acallam Na Senorach': '真妖槍旋',
        'Acceleration Bomb': '加速度爆弾',
        'Adds': '雑魚',
        'Ame-no-Sakahoko': '天逆鉾',
        'Astral Essence': '光の腕',
        'Auroral Wind': 'オーロラルウィンド',
        'Bitter Barbs': '罪の荊棘',
        'Black Hole': 'ブラックホール',
        'Bleed Attack': 'ブリードアタック',
        'Booming Lament': '哀惜の雷鳴',
        'Call Wyvern': 'コールワイバーン',
        'Carver/Spinner': '妖槍振/妖槍旋',
        'Cloud to Ground': '襲雷',
        'Cube Form': '立方体',
        'Eidos': '変異',
        'Elemental Magicks': 'エレメンタルマジック',
        'Elemental Shift': 'エレメントスイッチ',
        'Execration': 'エクセクレイション',
        '(?<! )Explosion': '爆発',
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
        'Orb x5': '玉 x5',
        'Ozma Ability': 'オズマ スキル',
        'Piercing Dark': '闇の槍',
        'Piercing Light': '光の槍',
        'Pitfall': '強襲',
        'Pyramid Form': '角錐形態',
        'Random Form': 'ランダム形態',
        'Random Shade': 'ランダム形',
        'Shade Ability': '幻影 スキル',
        'Shingan': '真眼撃',
        'Shooting Star': 'シューティングスター',
        'Soak Attack': 'アタック',
        'Spear Copy': '剣幻影',
        'Spear Shade': '剣形',
        'Sphere Form': '球形態',
        'Spiritcull': '連装魔',
        'Spirits of the Fallen': '英霊魂',
        'Stack': '集合',
        'Star Form': '星形',
        'Streak Lightning': 'ストリークライトニング',
        'Thricecull': '三連槍',
        'Thundercall': '招雷',
        'Turbulent Aether': 'エーテル乱流',
        'Ultimate Zantetsuken': '極・斬鉄剣',
        'Umbral Essence': '闇の腕',
        'Whirling Zantetsuken': '旋・斬鉄剣',
        'Wyvern Explosion': 'ワイバーン 爆発',
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
        'Proto Ozma(?! Containment)': '奥兹玛原型',
        'Raiden': '莱丁',
        'Relative Virtue': '相对的美德',
        'Shadow': '奥兹玛原型之影',
        'Streak Lightning': '强袭雷光',
        '5 minutes have elapsed since your last activity': '已经5分钟没有进行任何操作',
        'The memories of heroes past live on again': '发动了英杰的加护效果，重新苏醒了过来！',
        'Munderg, turn flesh to ash': '红颈妖枪，点燃一切！',
        'Munderg, turn blood to ice': '红颈妖枪，冻结万物！',
        'The Lance of Virtue Containment Unit': '美德之枪封印区',
        'The Shin-Zantetsuken Containment Unit': '真·斩铁剑封印区',
        'The Proto Ozma Containment Unit': '奥兹玛原型封印区',
      },
      'replaceText': {
        'Acallam Na Senorach': '真妖枪旋',
        'Acceleration Bomb': '加速度炸弹',
        'Adds': '小怪',
        'Ame-no-Sakahoko': '天逆矛',
        'Astral Essence': '光之腕',
        'Auroral Wind': '极光之风',
        'Bitter Barbs': '罪恶荆棘',
        'Black Hole': '黑洞',
        'Bleed Attack': '流血攻击',
        'Booming Lament': '哀痛雷鸣',
        'Call Wyvern': '召唤飞龙',
        'Carver/Spinner': '靠近/远离',
        'Cloud to Ground': '袭雷',
        'Cube Form': '立方体形式',
        'Eidos': '变异',
        'Elemental Magicks': '元素魔法',
        'Elemental Shift': '元素开关',
        'Execration': '缩小射线',
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
        'Orb x5': '球 x5',
        'Ozma Ability': '奥兹玛技能',
        'Piercing Dark': '暗之枪',
        'Piercing Light': '光之枪',
        'Pitfall': '强袭',
        'Pyramid Form': '金字塔形式',
        'Random Form': '随机形式',
        'Random Shade': '随机影子',
        'Shade Ability': '影子技能',
        'Shingan': '真眼击',
        'Shooting Star': '流星',
        'Soak Attack': '被攻击',
        'Spear Copy': '矛复制',
        'Spear Shade': '矛影子',
        'Sphere Form': '球形式',
        'Spiritcull': '连装魔',
        'Spirits of the Fallen': '英灵魂',
        'Stack': '分摊',
        'Star Form': '星星形式',
        'Streak Lightning': '强袭雷光',
        'Thricecull': '三连枪',
        'Thundercall': '招雷',
        'Turbulent Aether': '以太乱流',
        'Ultimate Zantetsuken': '极·斩铁剑',
        'Umbral Essence': '暗之腕',
        'Whirling Zantetsuken': '旋·斩铁剑',
        'Wyvern Explosion': '飞龙爆炸',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
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
        'Proto Ozma(?! Containment)': '프로토 오즈마',
        'Raiden': '라이딘',
        'Relative Virtue': '상대미덕',
        'Shadow': '프로토 오즈마의 그림자',
        'Streak Lightning': '연쇄 번개',
        'The Lance of Virtue Containment Unit': '미덕의 창 봉인 구역',
        'The Shin-Zantetsuken Containment Unit': '진 참철검 봉인 구역',
      },
      'replaceText': {
        'Acallam Na Senorach': '피어너의 창',
        'Acceleration Bomb': '가속도 폭탄',
        'Adds': '쫄',
        'Ame-no-Sakahoko': '아메노사카호코',
        'Astral Essence': '빛의 팔',
        'Auroral Wind': '오로라 바람',
        'Bitter Barbs': '죄의 가시',
        'Black Hole': '블랙홀',
        'Bleed Attack': '출혈 공격',
        'Booming Lament': '애도의 뇌명',
        'Call Wyvern': '와이번 소환',
        'Carver/Spinner': '요창 떨치기/후리기',
        'Cloud to Ground': '습뢰',
        'Cube Form': '네모 모양',
        'Eidos': '변이',
        'Elemental Magicks': '엘리멘탈 마법',
        'Elemental Shift': '엘리멘탈 변환',
        'Execration': '혐오의 저주',
        '(?<! )Explosion': '폭발',
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
        'Orb x5': '구슬 5회',
        'Ozma Ability': '오즈마 능력',
        'Piercing Dark': '어둠의 창',
        'Piercing Light': '빛의 창',
        'Pitfall': '강습',
        'Pyramid Form': '세모 모양',
        'Random Form': '무작위 모양',
        'Random Shade': '무작위 그림자',
        'Shade Ability': '그림자 능력',
        'Shingan': '진안격',
        'Shooting Star': '유성',
        'Soak Attack': '평타 쉐어 공격',
        'Spear Copy': '창 복사',
        'Spear Shade': '창 그림자',
        'Sphere Form': '원 모양',
        'Spiritcull': '마법 연발',
        'Spirits of the Fallen': '영령혼',
        'Stack': '모이기',
        'Star Form': '별 모양',
        'Streak Lightning': '연쇄 번개',
        'Thricecull': '삼연창',
        'Thundercall': '초뢰',
        'Turbulent Aether': '에테르 난류',
        'Ultimate Zantetsuken': '극 참철검',
        'Umbral Essence': '어둠의 팔',
        'Whirling Zantetsuken': '선 참철검',
        'Wyvern Explosion': '와이번 폭발',
      },
    },
  ],
}];
