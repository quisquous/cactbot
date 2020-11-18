[{
  zoneId: ZoneId.TheGhimlytDark,
  timelineFile: 'ghimlyt_dark.txt',
  timelineTriggers: [
    {
      id: 'Ghimlyt Dark Prometheus Laser',
      regex: /Heat/,
      beforeSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid wall laser',
          de: 'Weiche dem Wand-Laser aus',
          fr: 'Évitez le laser du mur',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Ghimlyt Dark Jarring Blow',
      netRegex: NetRegexes.startsUsing({ id: '376E', source: 'Mark III-B Magitek Colossus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '376E', source: 'Magitek-Stahlriese' }),
      netRegexFr: NetRegexes.startsUsing({ id: '376E', source: 'Colosse Magitek IIIb' }),
      netRegexJa: NetRegexes.startsUsing({ id: '376E', source: '魔導コロッサスIIIb型' }),
      netRegexCn: NetRegexes.startsUsing({ id: '376E', source: '魔导巨兵三型B式' }),
      netRegexKo: NetRegexes.startsUsing({ id: '376E', source: '마도 콜로서스 III-B형' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Wild Fire Beam',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Ghimlyt Dark Ceruleum Vent',
      netRegex: NetRegexes.startsUsing({ id: '3773', source: 'Mark III-B Magitek Colossus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3773', source: 'Magitek-Stahlriese', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3773', source: 'Colosse Magitek IIIb', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3773', source: '魔導コロッサスIIIb型', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3773', source: '魔导巨兵三型B式', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3773', source: '마도 콜로서스 III-B형', capture: false }),

      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Ghimlyt Dark Magitek Ray',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      // 00A7 is the orange clockwise indicator. 00A8 is the blue counterclockwise one.
      id: 'Ghimlyt Dark Magitek Slash',
      netRegex: NetRegexes.headMarker({ id: ['00A7', '00A8'] }),
      infoText: (data, matches, output) => {
        return matches.id === '00A7' ? output.left() : output.right();
      },
      outputStrings: {
        left: {
          en: 'Rotate left',
          de: 'Nach links rotieren',
          fr: 'Rotation vers la gauche',
        },
        right: {
          en: 'Rotate right',
          de: 'Nach rechts rotieren',
          fr: 'Rotation vers la droite',
        },
      },
    },
    {
      id: 'Ghimlyt Dark Nitrospin',
      netRegex: NetRegexes.startsUsing({ id: '3455', source: 'Prometheus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3455', source: 'Prometheus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3455', source: 'Prometheus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3455', source: 'プロメテウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3455', source: '普罗米修斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3455', source: '프로메테우스', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Ghimlyt Dark Cermet Drill',
      netRegex: NetRegexes.startsUsing({ id: '3459', source: 'Prometheus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3459', source: 'Prometheus' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3459', source: 'Prometheus' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3459', source: 'プロメテウス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3459', source: '普罗米修斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3459', source: '프로메테우스' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Freezing Missile',
      netRegex: NetRegexes.startsUsing({ id: '345C', source: 'Prometheus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '345C', source: 'Prometheus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '345C', source: 'Prometheus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '345C', source: 'プロメテウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '345C', source: '普罗米修斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '345C', source: '프로메테우스', capture: false }),
      suppressSeconds: 5,
      response: Responses.goMiddle(),
    },
    {
      id: 'Ghimlyt Dark Artifical Plasma',
      netRegex: NetRegexes.startsUsing({ id: '3727', source: 'Julia Quo Soranus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3727', source: 'Julia Quo Soranus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3727', source: 'Julia Quo Soranus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3727', source: 'ユリア・クォ・ソラノス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3727', source: '茱莉亚・库奥・索拉努斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3727', source: '율리아 쿠오 소라노스', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Ghimlyt Dark Innocence',
      netRegex: NetRegexes.startsUsing({ id: '3729', source: 'Julia Quo Soranus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3729', source: 'Julia Quo Soranus' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3729', source: 'Julia Quo Soranus' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3729', source: 'ユリア・クォ・ソラノス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3729', source: '茱莉亚・库奥・索拉努斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3729', source: '율리아 쿠오 소라노스' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Delta Trance',
      netRegex: NetRegexes.startsUsing({ id: '372A', source: 'Annia Quo Soranus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '372A', source: 'Annia Quo Soranus' }),
      netRegexFr: NetRegexes.startsUsing({ id: '372A', source: 'Annia Quo Soranus' }),
      netRegexJa: NetRegexes.startsUsing({ id: '372A', source: 'アンニア・クォ・ソラノス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '372A', source: '安妮亚・库奥・索拉努斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '372A', source: '안니아 쿠오 소라노스' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      // This head marker is used on players and NPCs, so we have to exclude NPCs explicitly.
      id: 'Ghimlyt Dark Heirsbane',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: (data, matches) => matches.targetId[0] !== '4' && Conditions.caresAboutPhysical()(data, matches),
      response: Responses.tankBuster(),
    },
    {
      id: 'Ghimlyt Dark Order To Bombard',
      netRegex: NetRegexes.ability({ id: '3710', source: 'Annia Quo Soranus', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '3710', source: 'Annia Quo Soranus', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '3710', source: 'Annia Quo Soranus', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '3710', source: 'アンニア・クォ・ソラノス', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '3710', source: '安妮亚・库奥・索拉努斯', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '3710', source: '안니아 쿠오 소라노스', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Ghimlyt Dark Covering Fire',
      netRegex: NetRegexes.headMarker({ id: '0078' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Annia Quo Soranus': 'Annia quo Soranus',
        'Ceruleum Tank': 'Erdseim-Tank',
        'Julia Quo Soranus': 'Julia quo Soranus',
        'Mark III-B Magitek Colossus': 'Magitek-Stahlriese',
        'Prometheus': 'Prometheus',
        'Soranus Duo': 'tödlich(?:e|er|es|en) Schwesternpaar Julia und Annia',
        'The Field Of Dust': 'Feld des Staubs',
        'The Impact Crater': 'Bombenkrater',
        'The Provisional Imperial Landing': 'Provisorischer Landeplatz',
      },
      'replaceText': {
        '\\(windup\\)': '(Vorbereitung)',
        '\\(cast\\)': '(Wirkung)',
        'Aglaia Bite': 'Aglaia-Biss',
        'Angry Salamander': 'Zorniger Salamander',
        'Artificial Boost': 'Magitek-Verstärker',
        'Artificial Plasma': 'Magitek-Plasma',
        'Bombardment': 'Bombardement',
        'Burst': 'Explosion',
        'Ceruleum Vent': 'Erdseim-Entlüfter',
        'Commence Air Strike': 'Abwurfbefehl',
        'Covering Fire': 'Artillerieangriff',
        'Crossbones': 'Totenschädel',
        'Crosshatch': 'Kreuzmanöver',
        'Delta Trance': 'Delta-Trance',
        'Exhaust': 'Exhaustor',
        'Freezing Missile': 'Frostrakete',
        'Heat': 'Hitzestrahl',
        'Heirsbane': 'Erbenbann',
        'Imperial Authority': 'Imperiale Autorität',
        'Innocence': 'Unschuld',
        'Jarring Blow': 'Harter Aufschlag',
        'Magitek Ray': 'Magitek-Laser',
        'Magitek Slash': 'Magitek-Schlag',
        'Missile Impact': 'Raketenangriff',
        'Needle Gun': 'Nadelgewitter',
        'Nitrospin': 'Nitroturbine',
        'Oil Shower': 'Kerosindusche',
        'Order To Bombard': 'Bombardierungsbefehl',
        'Order To Fire': 'Feuerbefehl',
        'Order To Support': 'Artilleriebefehl',
        'Quaternity': 'Verwertung',
        'Roundhouse': 'Rückhandschlag',
        'Stunning Sweep': 'Blitzfeger',
        'The Order': 'Befehl',
        'Tunnel': 'Tauchgang',
        'Unbreakable Cermet Drill': 'Verstärkter Cermet-Bohrer',
        'Wild Fire Beam': 'Diffuser Feuerstrahl',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Annia Quo Soranus': 'Annia quo Soranus',
        'Ceruleum Tank': 'réservoir de céruleum',
        'Julia Quo Soranus': 'Julia quo Soranus',
        'Mark III-B Magitek Colossus': 'colosse magitek IIIB',
        'Prometheus': 'Prometheus',
        'Soranus Duo': 'duo Soranus',
        'The Field Of Dust': 'Champ de poussière',
        'The Impact Crater': 'Gigantesque cratère',
        'The Provisional Imperial Landing': 'Aire d\'atterrissage provisoire',
      },
      'replaceText': {
        '\\(windup\\)': '(Préparation)',
        '\\(cast\\)': '(Lancement)',
        'Aglaia Bite': 'Morsure d\'Aglaia',
        'Angry Salamander': 'Colère de la salamandre',
        'Artificial Boost': 'Amplificateur magitek',
        'Artificial Plasma': 'Plasma magitek',
        'Bombardment': 'Bombardement',
        'Burst': 'Explosion',
        'Ceruleum Vent': 'Exutoire à céruleum',
        'Commence Air Strike': 'Largage de matériel',
        'Covering Fire': 'Tir de couverture',
        'Crossbones': 'Tête de mort',
        'Crosshatch': 'Croisillons',
        'Delta Trance': 'Transe delta',
        'Exhaust': 'Échappement',
        'Freezing Missile': 'Missile cryogène',
        'Heat': 'Rayons infrarouges',
        'Heirsbane': 'Fléau de l\'héritier',
        'Imperial Authority': 'Autorité impériale',
        'Innocence': 'Innocence',
        'Jarring Blow': 'Impact redoutable',
        'Magitek Ray': 'Rayon magitek',
        'Magitek Slash': 'Taillade magitek',
        'Missile Impact': 'Frappe de missile',
        'Needle Gun': 'Pistolet à clous',
        'Nitrospin': 'Nitrotourbillon',
        'Oil Shower': 'Pluie de kérosène',
        'Order To Bombard': 'Ordre de bombardement',
        'Order To Fire': 'Ordre d\'attaquer',
        'Order To Support': 'Demande d\'appui',
        'Quaternity': 'Équarrissage',
        'Roundhouse': 'Crochet',
        'Stunning Sweep': 'Balayette étourdissante',
        'The Order': 'Directive',
        'Tunnel': 'Enfouissement',
        'Unbreakable Cermet Drill': 'Foret en cermet renforcé',
        'Wild Fire Beam': 'Rayon de feu diffusé',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Annia Quo Soranus': 'アンニア・クォ・ソラノス',
        'Ceruleum Tank': '青燐水タンク',
        'Julia Quo Soranus': 'ユリア・クォ・ソラノス',
        'Mark III-B Magitek Colossus': '魔導コロッサスIIIB型',
        'Prometheus': 'プロメテウス',
        'Soranus Duo': 'ユリア＆アンニア ',
        'The Field Of Dust': '薄汚れた広場',
        'The Impact Crater': '巨大爆撃痕',
        'The Provisional Imperial Landing': '帝国軍仮設ランディング',
      },
      'replaceText': {
        '\\(windup\\)': '(発射)',
        '\\(cast\\)': '(着弾)',
        'Aglaia Bite': 'アグライアバイト',
        'Angry Salamander': '炎獣心火撃',
        'Artificial Boost': '魔導ブースター',
        'Artificial Plasma': '魔導プラズマ',
        'Bombardment': '爆撃',
        'Burst': '爆発',
        'Ceruleum Vent': 'セルレアムベント',
        'Commence Air Strike': '投下要請',
        'Covering Fire': '援護射撃',
        'Crossbones': 'クロスボーン',
        'Crosshatch': 'クロスハッチ',
        'Delta Trance': 'デルタトランス',
        'Exhaust': 'エグゾースト',
        'Freezing Missile': '冷凍ミサイル',
        'Heat': '熱線',
        'Heirsbane': 'No.IX',
        'Imperial Authority': 'インペリアルオーソリティ',
        'Innocence': 'イノセンス',
        'Jarring Blow': 'ハードヒット',
        'Magitek Ray': '魔導レーザー',
        'Magitek Slash': 'マジテックスラッシュ',
        'Missile Impact': 'ミサイル攻撃',
        'Needle Gun': 'ニードルガン',
        'Nitrospin': 'ニトロスピン',
        'Oil Shower': 'ケロシンシャワー',
        'Order To Bombard': '爆撃命令',
        'Order To Fire': '攻撃命令',
        'Order To Support': '援護命令',
        'Quaternity': 'クォターニティ',
        'Roundhouse': '無尽旋風斬',
        'Stunning Sweep': '雷光水面蹴',
        'The Order': 'オーダー',
        'Tunnel': '潜航',
        'Unbreakable Cermet Drill': '超硬サーメットドリル',
        'Wild Fire Beam': '拡散ファイアビーム',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Annia Quo Soranus': '安妮亚・库奥・索拉努斯',
        'Ceruleum Tank': '青磷水罐',
        'Julia Quo Soranus': '茱莉亚・库奥・索拉努斯',
        'Mark III-B Magitek Colossus': '魔导巨兵三型B式',
        'Prometheus': '普罗米修斯',
        'Soranus Duo': '茱莉亚&安妮亚',
        'The Field Of Dust': '破乱的广场',
        'The Impact Crater': '大爆炸痕迹',
        'The Provisional Imperial Landing': '帝国临时飞艇坪',
      },
      'replaceText': {
        '\\(windup\\)': '(发射)',
        '\\(cast\\)': '(判定)',
        'Aglaia Bite': '典雅女神枪',
        'Angry Salamander': '炎兽心火击',
        'Artificial Boost': '魔导增幅器',
        'Artificial Plasma': '魔导离子',
        'Bombardment': '轰炸',
        'Burst': '爆炸',
        'Ceruleum Vent': '青磷放射',
        'Commence Air Strike': '请求投放',
        'Covering Fire': '掩护射击',
        'Crossbones': '剔骨十字',
        'Crosshatch': '交叉冲击',
        'Delta Trance': '三角迷失斩',
        'Exhaust': '排气',
        'Freezing Missile': '冷冻导弹',
        'Heat': '射线',
        'Heirsbane': '遗祸',
        'Imperial Authority': '帝国权威',
        'Innocence': '无罪斩',
        'Jarring Blow': '沉重一击',
        'Magitek Ray': '魔导激光',
        'Magitek Slash': '魔导斩',
        'Missile Impact': '导弹攻击',
        'Needle Gun': '飞针枪',
        'Nitrospin': '爆炸回旋',
        'Oil Shower': '黄雨',
        'Order To Bombard': '轰炸命令',
        'Order To Fire': '攻击命令',
        'Order To Support': '掩护命令',
        'Quaternity': '四位一体',
        'Roundhouse': '无尽旋风斩',
        'Stunning Sweep': '雷光水面踢',
        'The Order': '下令',
        'Tunnel': '潜航',
        'Unbreakable Cermet Drill': '超硬陶瓷合金钻头',
        'Wild Fire Beam': '扩散火焰光束',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Annia Quo Soranus': '안니아 쿠오 소라노스',
        'Ceruleum Tank': '청린수 탱크',
        'Julia Quo Soranus': '율리아 쿠오 소라노스',
        'Mark III-B Magitek Colossus': '마도 콜로서스 III-B형',
        'Prometheus': '프로메테우스',
        'Soranus Duo': '율리아와 안니아',
        'The Field Of Dust': '먼지투성이 광장',
        'The Impact Crater': '거대한 폭격 흔적',
        'The Provisional Imperial Landing': '제국군 가설 비행장',
      },
      'replaceText': {
        'Aglaia Bite': '아글라이아 쌍격',
        'Angry Salamander': '맹수화염격',
        'Artificial Boost': '마도 부스터',
        'Artificial Plasma': '마도 플라스마',
        'Bombardment': '폭격',
        'Burst': '폭발',
        'Ceruleum Vent': '청린 방출',
        'Commence Air Strike': '투하 요청',
        'Covering Fire': '지원 사격',
        'Crossbones': '십자베기',
        'Crosshatch': '십자선',
        'Delta Trance': '무아삼각권',
        'Exhaust': '고갈',
        'Freezing Missile': '냉동 미사일',
        'Heat': '열선',
        'Heirsbane': '제IX호',
        'Imperial Authority': '제국의 권위',
        'Innocence': '순수',
        'Jarring Blow': '단단한 공격',
        'Magitek Ray': '마도 레이저',
        'Magitek Slash': '마도 참격',
        'Missile Impact': '미사일 공격',
        'Needle Gun': '바늘총',
        'Nitrospin': '니트로 회전',
        'Oil Shower': '기름 세례',
        'Order To Bombard': '폭격 명령',
        'Order To Fire': '공격 명령',
        'Order To Support': '지원 명령',
        'Quaternity': '사위일체',
        'Roundhouse': '종횡질풍참',
        'Stunning Sweep': '뇌광수면축',
        'The Order': '명령',
        'Tunnel': '잠항',
        'Unbreakable Cermet Drill': '초경도 합금 드릴',
        'Wild Fire Beam': '확산 화염 광선',
      },
    },
  ],
}];
