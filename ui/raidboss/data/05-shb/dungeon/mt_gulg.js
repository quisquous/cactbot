'use strict';

[{
  zoneRegex: {
    en: /^Mt\. Gulg$/,
    cn: /^伪造天界格鲁格火山$/,
    ko: /^굴그 화산$/,
  },
  timelineFile: 'mt_gulg.txt',
  triggers: [
    {
      id: 'Gulg Punitive Light',
      regex: Regexes.startsUsing({ id: '41AF', source: 'Forgiven Prejudice' }),
      regexDe: Regexes.startsUsing({ id: '41AF', source: 'Geläutert(?:e|er|es|en) Voreingenommenheit' }),
      regexFr: Regexes.startsUsing({ id: '41AF', source: 'Préjugé Pardonné' }),
      regexJa: Regexes.startsUsing({ id: '41AF', source: 'フォーギヴン・プレジュディス' }),
      regexCn: Regexes.startsUsing({ id: '41AF', source: '得到宽恕的偏见' }),
      regexKo: Regexes.startsUsing({ id: '41AF', source: '면죄된 편견' }),
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      response: Responses.interrupt('info'),
    },
    {
      id: 'Gulg Tail Smash',
      regex: Regexes.startsUsing({ id: '41AB', source: 'Forgiven Ambition', capture: false }),
      regexDe: Regexes.startsUsing({ id: '41AB', source: 'Geläutert(?:e|er|es|en) Begierde', capture: false }),
      regexFr: Regexes.startsUsing({ id: '41AB', source: 'Ambition Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '41AB', source: 'フォーギヴン・アンビション', capture: false }),
      regexCn: Regexes.startsUsing({ id: '41AB', source: '得到宽恕的奢望', capture: false }),
      regexKo: Regexes.startsUsing({ id: '41AB', source: '면죄된 야망', capture: false }),
      infoText: {
        en: 'Ambition Tail Smash',
        de: 'Begierde Schweifschlag',
        fr: 'Evitez la queue',
        ko: '꼬리 휘두르기 주의',
        cn: '尾巴横扫',
      },
    },
    {
      id: 'Gulg Rake',
      regex: Regexes.startsUsing({ id: '3CFB', source: 'Forgiven Cruelty' }),
      regexDe: Regexes.startsUsing({ id: '3CFB', source: 'Geläutert(?:e|er|es|en) Grausamkeit' }),
      regexFr: Regexes.startsUsing({ id: '3CFB', source: 'Cruauté Pardonnée' }),
      regexJa: Regexes.startsUsing({ id: '3CFB', source: 'フォーギヴン・クルエルティー' }),
      regexCn: Regexes.startsUsing({ id: '3CFB', source: '得到宽恕的残忍' }),
      regexKo: Regexes.startsUsing({ id: '3CFB', source: '면죄된 잔혹' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Gulg Lumen Infinitum',
      regex: Regexes.startsUsing({ id: '41B2', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '41B2', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '41B2', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '41B2', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '41B2', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '41B2', source: '면죄된 잔혹', capture: false }),
      alertText: {
        en: 'Frontal Laser',
        de: 'Frontaler Laser',
        fr: 'Laser frontal',
        ko: '정면 레이저 공격',
        cn: '面前激光',
      },
    },
    {
      id: 'Gulg Cyclone Wing',
      regex: Regexes.startsUsing({ id: '3CFC', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3CFC', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3CFC', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3CFC', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3CFC', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3CFC', source: '면죄된 잔혹', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Gulg Typhoon Wing 1',
      regex: Regexes.startsUsing({ id: '3D00', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D00', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D00', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D00', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D00', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D00', source: '면죄된 잔혹', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'dodge wind cones',
        de: 'Wind-Fächerflächen ausweichen',
        fr: 'Evitez les cônes de vent',
        ko: '부채꼴 공격 피하기',
        cn: '躲风锥',
      },
    },
    {
      id: 'Gulg Typhoon Wing 2',
      regex: Regexes.startsUsing({ id: '3D0[12]', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D0[12]', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D0[12]', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D0[12]', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D0[12]', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D0[12]', source: '면죄된 잔혹', capture: false }),
      suppressSeconds: 5,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Gulg Sacrament of Penance',
      regex: Regexes.startsUsing({ id: '3D0B', source: 'Forgiven Whimsy', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D0B', source: 'Geläutert(?:e|er|es|en) Gereiztheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D0B', source: 'Caprice Pardonné', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D0B', source: 'フォーギヴン・ウィムズィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D0B', source: '得到宽恕的无常', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D0B', source: '면죄된 변덕', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Gulg Catechism',
      // no target name
      regex: Regexes.startsUsing({ id: '3D09', source: 'Forgiven Whimsy' }),
      regexDe: Regexes.startsUsing({ id: '3D09', source: 'Geläutert(?:e|er|es|en) Gereiztheit' }),
      regexFr: Regexes.startsUsing({ id: '3D09', source: 'Caprice Pardonné' }),
      regexJa: Regexes.startsUsing({ id: '3D09', source: 'フォーギヴン・ウィムズィー' }),
      regexCn: Regexes.startsUsing({ id: '3D09', source: '得到宽恕的无常' }),
      regexKo: Regexes.startsUsing({ id: '3D09', source: '면죄된 변덕' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Gulg Judgment Day',
      regex: Regexes.startsUsing({ id: '3D0F', source: 'Forgiven Whimsy', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D0F', source: 'Geläutert(?:e|er|es|en) Gereiztheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D0F', source: 'Caprice Pardonné', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D0F', source: 'フォーギヴン・ウィムズィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D0F', source: '得到宽恕的无常', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D0F', source: '면죄된 변덕', capture: false }),
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Dans les tours',
        ko: '장판 들어가기',
        cn: '踩塔',
      },
    },
    {
      id: 'Gulg Left Palm',
      regex: Regexes.startsUsing({ id: '3F7A', source: 'Forgiven Revelry', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3F7A', source: 'Geläutert(?:e|er|es|en) Prasserei', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3F7A', source: 'Orgie Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3F7A', source: 'フォーギヴン・レヴェルリー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3F7A', source: '得到宽恕的放纵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3F7A', source: '면죄된 환락', capture: false }),
      response: Responses.goLeft('info'),
    },
    {
      id: 'Gulg Right Palm',
      regex: Regexes.startsUsing({ id: '3F78', source: 'Forgiven Revelry', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3F78', source: 'Geläutert(?:e|er|es|en) Prasserei', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3F78', source: 'Orgie Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3F78', source: 'フォーギヴン・レヴェルリー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3F78', source: '得到宽恕的放纵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3F78', source: '면죄된 환락', capture: false }),
      response: Responses.goRight('info'),
    },
    {
      id: 'Gulg Orison Fortissimo',
      regex: Regexes.startsUsing({ id: '3D14', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D14', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D14', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D14', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D14', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D14', source: '면죄된 외설', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Gulg Sforzando',
      // no target name
      regex: Regexes.startsUsing({ id: '3D12', source: 'Forgiven Obscenity' }),
      regexDe: Regexes.startsUsing({ id: '3D12', source: 'Geläutert(?:e|er|es|en) Unzucht' }),
      regexFr: Regexes.startsUsing({ id: '3D12', source: 'Obscénité Pardonnée' }),
      regexJa: Regexes.startsUsing({ id: '3D12', source: 'フォーギヴン・オブセニティー' }),
      regexCn: Regexes.startsUsing({ id: '3D12', source: '得到宽恕的猥亵' }),
      regexKo: Regexes.startsUsing({ id: '3D12', source: '면죄된 외설' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Gulg Divine Diminuendo',
      regex: Regexes.startsUsing({ id: '3D18', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D18', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D18', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D18', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D18', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D18', source: '면죄된 외설', capture: false }),
      infoText: {
        en: 'max melee range',
        de: 'Maximale Nahkämpfer Entfernung',
        fr: 'Limite de zone CaC',
        ko: '칼끝딜',
        cn: '最远近战距离',
      },
    },
    {
      id: 'Gulg Conviction Marcato',
      regex: Regexes.startsUsing({ id: '3D1A', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D1A', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D1A', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D1A', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D1A', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D1A', source: '면죄된 외설', capture: false }),
      response: Responses.getBehind('info'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Forgiven Obscenity': 'geläuterte Unzucht',
        'Forgiven Cruelty': 'geläuterte Grausamkeit',
        'Forgiven Whimsy': 'geläuterte Gereiztheit',
        'Brightsphere': 'Lichtsphäre',
        'The Winding Flare': 'Strahlenden Stufen',
        'The White Gate': 'Weißen Pforte',
        'The Perished Path': 'Pfad ohne Halt',
      },
      'replaceText': {
        'Lumen Infinitum': 'Lumen Infinitem',
        'Typhoon Wing': 'Taifunschwinge',
        'Cyclone Wing': 'Zyklonschwinge',
        'Perfect Contrition': 'Buße',
        'Divine Diminuendo': 'Dogma diminuendo',
        'Exegesis': 'Strafpredigt',
        'Orison Fortissimo': 'Fürbitte fortissimo',
        'Ringsmith': 'Ring der Beständigkeit',
        'Judged': 'Verurteilung',
        'Sacrament Of Penance': 'Sakrament der Vergebung',
        'Reformation': 'Gegenreformation',
        'Catechism': 'Heiliger Vers',
        'Rite Of The Sacrament': 'Beichte',
        'Judgment Day': 'Gnädiges Urteil',
        'Conviction Marcato': 'Mette marcato',
        'Penance Pianissimo': 'Predigt pianissimo',
        'Feather Marionette': 'Lebendige Feder',
        'Solitaire Ring': 'Solitärring',
        'Gold Chaser': 'Goldene Feder',
        'Sacrament Sforzando': 'Sakrament sforzato',
        'Hurricane Wing': 'Hurrikanschwinge',
        'Rake': 'Prankenhieb',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Forgiven Obscenity': '면죄된 외설',
        'Forgiven Cruelty': '면죄된 잔혹',
        'Forgiven Whimsy': '면죄된 변덕',
        'Brightsphere': '빛의 구체',
        'The Winding Flare': '광망의 계단',
        'The White Gate': '순백의 문',
        'The Perished Path': '무너진 산길',
      },
      'replaceText': {
        'Lumen Infinitum': '무한 섬광',
        'Typhoon Wing': '태풍 날개',
        'Cyclone Wing': '회오리 날개',
        'Perfect Contrition': '참회',
        'Divine Diminuendo': '신성한 디미누엔도',
        'Exegesis': '설교',
        'Orison Fortissimo': '기도의 포르티시모',
        'Ringsmith': '고리 생성',
        'Judged': '단죄',
        'Sacrament Of Penance': '은사의 기적',
        'Reformation': '형태 변화',
        'Catechism': '성구',
        'Rite Of The Sacrament': '고해 의례',
        'Judgment Day': '단죄 의례',
        'Conviction Marcato': '신념의 마르카토',
        'Penance Pianissimo': '속죄의 피아니시모',
        'Feather Marionette': '깃털 꼭두각시',
        'Solitaire Ring': '서약의 고리',
        'Gold Chaser': '금빛 추격',
        'Sacrament Sforzando': '성체의 스포르찬도',
        'Hurricane Wing': '폭풍 날개',
        'Rake': '할퀴기',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Forgiven Obscenity': '得到宽恕的猥亵',
        'Forgiven Cruelty': '得到宽恕的残忍',
        'Forgiven Whimsy': '得到宽恕的无常',
        'Brightsphere': '光明晶球',
        'The Winding Flare': '光芒阶梯',
        'The White Gate': '纯白门',
        'The Perished Path': '破损的山路',
      },
      'replaceText': {
        'Lumen Infinitum': '流明无限',
        'Typhoon Wing': '台风之翼',
        'Cyclone Wing': '旋风之翼',
        'Perfect Contrition': '忏悔',
        'Divine Diminuendo': '渐弱神音',
        'Exegesis': '解经',
        'Orison Fortissimo': '洪声祷告',
        'Ringsmith': '制戒',
        'Judged': '断罪',
        'Sacrament Of Penance': '忏悔圣礼',
        'Reformation': '形态变化',
        'Catechism': '教理问答',
        'Rite Of The Sacrament': '告解礼仪',
        'Judgment Day': '审判日',
        'Conviction Marcato': '坚信',
        'Penance Pianissimo': '轻声忏悔',
        'Feather Marionette': '羽制傀儡',
        'Solitaire Ring': '指环之钻',
        'Gold Chaser': '戒钻相合',
        'Sacrament Sforzando': '圣礼强化',
        'Hurricane Wing': '飓风之翼',
        'Rake': '利爪',
      },
      '~effectNames': {},
    },
  ],
}];
