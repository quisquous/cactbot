'use strict';

// Innocence Extreme
[{
  zoneRegex: {
    en: /^The Crown Of The Immaculate \(Extreme\)$/,
    cn: /^无瑕灵君歼殛战$/,
    ko: /^극 이노센스 토벌전$/,
  },
  timelineFile: 'innocence-ex.txt',
  triggers: [
    {
      id: 'InnoEx Starbirth Count',
      regex: Regexes.startsUsing({ id: '3EEF', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEF', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEF', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEF', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEF', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEF', source: '이노센스', capture: false }),
      run: function(data) {
        data.starbirthCount = data.starbirthCount || 0;
        data.starbirthCount++;
        data.starbirthActive = true;
      },
    },
    {
      id: 'InnoEx Reprobation Swords 2',
      regex: Regexes.startsUsing({ id: '3EDC', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EDC', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EDC', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EDC', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EDC', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EDC', source: '이노센스', capture: false }),
      // 3 seconds cast time + 7 seconds until next sword.
      delaySeconds: 7,
      infoText: {
        en: 'Swords!',
        de: 'Schwerter!',
        ja: '剣くるよ',
        fr: 'Epées !',
        cn: '剑!',
        ko: '검 돌아옴!',
      },
    },
    {
      id: 'InnoEx Starbirth Warning',
      regex: Regexes.startsUsing({ id: '3EEF', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEF', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEF', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEF', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEF', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEF', source: '이노센스', capture: false }),
      infoText: function(data) {
        if (data.starbirthCount == 1) {
          return {
            en: 'Starbirth: Corner',
            de: 'Sternengeburt: Ecken',
            ja: 'スターバース: 角へ',
            fr: 'Accouchement Stellaire : Coin',
            cn: '创星：角落躲避',
            ko: '별생성: 구석으로',
          };
        } else if (data.starbirthCount == 2 || data.starbirthCount == 5) {
          return {
            en: 'Starbirth: Avoid + Charge',
            de: 'Sternengeburt: Ausweichen + Charge',
            ja: 'スターバース: 玉のない隅へ',
            fr: 'Accouchement Stellaire : Evitez + Charge',
            cn: '创星：躲避 + 冲锋',
            ko: '별 생성: 별 피해서 징 맞기 + 돌진',
          };
        } else if (data.starbirthCount == 3) {
          return {
            en: 'Starbirth: Explode',
            de: 'Sternengeburt: Explosion',
            ja: 'スターバース: 爆発',
            fr: 'Accouchement Stellaire : Explosion',
            cn: '创星：爆炸',
            ko: '별 생성: 별 터뜨리기',
          };
        } else if (data.starbirthCount == 4) {
          return {
            en: 'Starbirth: Charge',
            de: 'Sternengeburt: Charge',
            ja: 'スターバース: 突進',
            fr: 'Accouchement Stellaire : Charge',
            cn: '创星：冲锋',
            ko: '별 생성: 돌진',
          };
        } else if (data.starbirthCount == 6) {
          return {
            en: 'Starbirth: Enrage',
            de: 'Sternengeburt: Finalangriff',
            ja: 'スターバース: 時間切れ',
            fr: 'Accouchement Stellaire : Enrage',
            cn: '创星：狂暴',
            ko: '별 생성: 전멸기',
          };
        }
        // No text for the second enrage one.
      },
    },
    {
      id: 'InnoEx Shadowreaver',
      regex: Regexes.startsUsing({ id: '3EEA', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEA', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEA', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEA', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEA', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEA', source: '이노센스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'InnoEx Righteous Bolt',
      regex: Regexes.startsUsing({ id: '3ECD', source: 'Innocence' }),
      regexDe: Regexes.startsUsing({ id: '3ECD', source: 'Innozenz' }),
      regexFr: Regexes.startsUsing({ id: '3ECD', source: 'Innocence' }),
      regexJa: Regexes.startsUsing({ id: '3ECD', source: 'イノセンス' }),
      regexCn: Regexes.startsUsing({ id: '3ECD', source: '无瑕灵君' }),
      regexKo: Regexes.startsUsing({ id: '3ECD', source: '이노센스' }),
      alarmText: function(data, matches) {
        if (matches.target == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'スイッチ',
          cn: '换T！',
          ko: '탱 교대!',
        };
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '나에게 탱버',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches.target),
            ko: '탱버 -> ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'InnoEx Holy Sword Healer',
      regex: Regexes.startsUsing({ id: '3EC9', source: 'Forgiven Venery', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EC9', source: 'Geläutert(?:e|er|es|en) Wollust', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EC9', source: 'Débauche Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EC9', source: 'フォーギヴン・ヴェナリー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EC9', source: '得到宽恕的情欲', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EC9', source: '면죄된 정욕', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      infoText: {
        en: 'Tank Busters',
        de: 'Tank Buster',
        ja: 'タンクバスター',
        fr: 'Tankbusters',
        cn: '死刑',
        ko: '탱버',
      },
    },
    {
      id: 'InnoEx Holy Sword Me',
      regex: Regexes.startsUsing({ id: '3EC9', source: 'Forgiven Venery' }),
      regexDe: Regexes.startsUsing({ id: '3EC9', source: 'Geläutert(?:e|er|es|en) Wollust' }),
      regexFr: Regexes.startsUsing({ id: '3EC9', source: 'Débauche Pardonnée' }),
      regexJa: Regexes.startsUsing({ id: '3EC9', source: 'フォーギヴン・ヴェナリー' }),
      regexCn: Regexes.startsUsing({ id: '3EC9', source: '得到宽恕的情欲' }),
      regexKo: Regexes.startsUsing({ id: '3EC9', source: '면죄된 정욕' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'InnoEx Charge',
      regex: Regexes.startsUsing({ id: '3EEE', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEE', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEE', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEE', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEE', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEE', source: '이노센스', capture: false }),
      alertText: function(data) {
        if (data.starbirthActive) {
          return {
            en: 'Avoid Charge and Orbs',
            de: 'Charge und Orbs ausweichen',
            ja: '玉と突進避けて',
            fr: 'Evitez les charges et les orbes',
            cn: '躲避冲锋与晶石',
            ko: '돌진이랑 구슬 폭발을 피하세요',
          };
        }
        return {
          en: 'Avoid Charge',
          de: 'Charge ausweichen',
          ja: '突進避けて',
          fr: 'Evitez les charges',
          cn: '躲避冲锋',
          ko: '돌진을 피하세요',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Avoid',
      regex: Regexes.startsUsing({ id: '3EEF', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEF', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEF', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEF', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEF', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEF', source: '이노센스', capture: false }),
      condition: function(data) {
        return data.starbirthCount == 1;
      },
      delaySeconds: 6,
      alertText: {
        en: 'Get to Safe Corner',
        de: 'Geh in die sichere Ecke',
        ja: '安置へ',
        fr: 'Allez sur le coin sûr',
        cn: '去安全角落',
        ko: '안전한 구석으로 이동',
      },
    },
    {
      id: 'InnoEx Adds',
      regex: Regexes.ability({ id: '42B0', source: 'Innocence', capture: false }),
      regexDe: Regexes.ability({ id: '42B0', source: 'Innozenz', capture: false }),
      regexFr: Regexes.ability({ id: '42B0', source: 'Innocence', capture: false }),
      regexJa: Regexes.ability({ id: '42B0', source: 'イノセンス', capture: false }),
      regexCn: Regexes.ability({ id: '42B0', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.ability({ id: '42B0', source: '이노센스', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Grab East/West Venery Adds',
        de: 'Nehme östliches/westliches Wollust Add',
        ja: '雑魚のタゲ取って',
        fr: 'Attrapez les adds en Est/Ouest',
        cn: '接小怪仇恨',
        ko: '동/서 쫄 잡으세요',
      },
    },
    {
      id: 'InnoEx Light Pillar',
      regex: Regexes.ability({ id: '38FC', source: 'Innocence' }),
      regexDe: Regexes.ability({ id: '38FC', source: 'Innozenz' }),
      regexFr: Regexes.ability({ id: '38FC', source: 'Innocence' }),
      regexJa: Regexes.ability({ id: '38FC', source: 'イノセンス' }),
      regexCn: Regexes.ability({ id: '38FC', source: '无瑕灵君' }),
      regexKo: Regexes.ability({ id: '38FC', source: '이노센스' }),
      preRun: function(data) {
        data.lightPillar = data.lightPillar || 0;
        data.lightPillar++;
      },
      alarmText: function(data, matches) {
        if (matches.target != data.me)
          return;

        if (data.lightPillar == 3) {
          return {
            en: 'Aim Line At Back Orb',
            de: 'Ziehle mit der Linie auf den entferntesten Orb',
            ja: '後ろの玉に当てて',
            fr: 'Visez l\'orbe arrière avec la ligne',
            cn: '分摊瞄准后方晶石',
            ko: '멀리 있는 구슬 하나 맞추세요',
          };
        }
        return {
          en: 'Avoid Orbs With Line',
          de: 'Ziehle nicht auf einen Orb',
          ja: '玉に当てるな',
          fr: 'Evitez l\'orbe avec la ligne',
          cn: '躲开晶石与直线',
          ko: '쉐어징이 구슬에 맞지 않게 하세요',
        };
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;
        return {
          en: 'Line Stack',
          de: 'Sammeln in einer Linie',
          ja: 'シェア',
          fr: 'Packez-vous en ligne',
          cn: '直线分摊',
          ko: '쉐어징 모이세요',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Explode',
      regex: Regexes.startsUsing({ id: '3F3E', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3F3E', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3F3E', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3F3E', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3F3E', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3F3E', source: '이노센스', capture: false }),
      condition: function(data) {
        return data.lightPillar == 3;
      },
      delaySeconds: 6.5,
      alertText: {
        en: 'Get to Safe Corner',
        de: 'Geh in die sichere Ecke',
        fr: 'Allez sur le coin sûr',
        cn: '去安全角落',
        ko: '안전한 구석으로 이동하세요',
      },
    },
    {
      id: 'InnoEx Winged Reprobation Tether',
      regex: Regexes.headMarker({ id: '00AC' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Tether on YOU',
        de: 'Verbindung auf DIR',
        fr: 'Lien sur VOUS',
        ja: '線ついた',
        cn: '连线点名',
        ko: '선 대상자 지정됨',
      },
    },
    {
      id: 'InnoEx Winged Drop Of Light',
      regex: Regexes.headMarker({ id: '008A' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: function(data) {
        if (data.starbirthActive) {
          return {
            en: 'Circle, Avoid Orbs',
            de: 'Kreis, vermeide Orbs',
            fr: 'Cercle, Evitez les orbes',
            ja: 'オーブに当てないで',
            cn: '圆圈点名，远离晶石',
            ko: '원형 징, 구슬 피하세요',
          };
        }
        return {
          en: 'Circle on YOU',
          de: 'Kreis auf DIR',
          fr: 'Cercle sur vous',
          ja: 'サークルついた',
          cn: '圆圈点名',
          ko: '원형 징 대상자 지정됨',
        };
      },
    },
    {
      id: 'InnoEx God Ray',
      regex: Regexes.startsUsing({ id: '3EE[456]', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EE[456]', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EE[456]', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EE[456]', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EE[456]', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EE[456]', source: '이노센스', capture: false }),
      suppressSeconds: 15,
      infoText: {
        en: 'Avoid Swords then Ray',
        de: 'Weiche den Schwertern aus, danach Strahl',
        fr: 'Evitez l\'épée puis le rayon',
        ja: '剣避けてからピザカット',
        cn: '躲避剑与激光',
        ko: '칼 먼저 피하고 장판 피하세요',
      },
    },
    {
      id: 'InnoEx Starbirth End 1',
      regex: Regexes.startsUsing({ id: '3EEA', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEA', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEA', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEA', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEA', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEA', source: '이노센스', capture: false }),
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Starbirth End 2',
      regex: Regexes.startsUsing({ id: '3EEE', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3EEE', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3EEE', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3EEE', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3EEE', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3EEE', source: '이노센스', capture: false }),
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Soul And Body Left',
      regex: Regexes.startsUsing({ id: '3ED7', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3ED7', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3ED7', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3ED7', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3ED7', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3ED7', source: '이노센스', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Left',
        de: 'Links rum rotieren',
        fr: 'Tournez à gauche',
        cn: '向左旋转',
        ko: '왼쪽으로 도세요',
      },
    },
    {
      id: 'InnoEx Soul And Body Right',
      regex: Regexes.startsUsing({ id: '3ED9', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3ED9', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3ED9', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3ED9', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3ED9', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3ED9', source: '이노센스', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Right',
        de: 'Rechts rum rotieren',
        fr: 'Tournez à droite',
        cn: '向右旋转',
        ko: '오른쪽으로 도세요',
      },
    },
    {
      id: 'InnoEx Rood Left',
      regex: Regexes.startsUsing({ id: '3ED3', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3ED3', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3ED3', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3ED3', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3ED3', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3ED3', source: '이노센스', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Left',
        de: 'Links rum rotieren',
        fr: 'Tournez à gauche',
        cn: '向左旋转',
        ko: '왼쪽으로 도세요',
      },
    },
    {
      id: 'InnoEx Rood Right',
      regex: Regexes.startsUsing({ id: '3ED5', source: 'Innocence', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3ED5', source: 'Innozenz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3ED5', source: 'Innocence', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3ED5', source: 'イノセンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3ED5', source: '无瑕灵君', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3ED5', source: '이노센스', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Right',
        de: 'Rechts rum rotieren',
        fr: 'Tournez à droite',
        cn: '向右旋转',
        ko: '오른쪽으로 도세요',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Innocence': 'Innozenz',
        'Nail of Condemnation': 'Nagel des Urteils',
        'Sword of Condemnation': 'Schwert des Urteils',
        'Forgiven Venery': 'Geläuterte Wollust',
        'Forgiven Shame': 'Geläuterte Schande',
      },
      'replaceText': {
        'Winged Reprobation': 'Schwinge des Urteils',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth(?! )': 'Sternengeburt',
        'Soul and Body': 'Seele und Körper',
        'Shadowreaver': 'Schattenplünderer',
        'Scold\'s Bridle': 'Schandmal',
        'Rightful Reprobation': 'Rechtmäßige Verurteilung',
        'Righteous Bolt': 'Blitz der Gerechtigkeit',
        '(?<! )Reprobation': 'Verurteilung',
        'Light Pillar': 'Lichtsäule',
        'Holy Trinity': 'Heilige Dreifaltigkeit',
        'Holy Sword': 'Heiliges Schwert',
        'Guiding Light': 'Leitendes Licht',
        'God Ray': 'Göttlicher Strahl',
        'Flaming Sword': 'Flammenschwert',
        'Explosion': 'Explosion',
        'Duel Descent': 'Doppelter Sinkflug',
        'Drop of Light': 'Lichtabfall',
        'Dream of the Rood': 'Traum des Kreuzes',
        'Beatific Vision': 'Seligmachende Schau',
        'Forgiven venery': 'Geläuterte Wollust',
        'Forgiven shame': 'Geläuterte Schande',
        'Drop Of Light': 'Lichtabfall',
        'Winged Rep': 'Schwinge des Urteils',
        'Soul And Body': 'Seele und Körper',
        'Starbirth Corner': 'Sternengeburt Ecke',
        'Starbirth Explode': 'Sternengeburt Explosion',
        'Starbirth Charge': 'Sternengeburt Charge',
        'Starbirth Avoid': 'vermeide Sternengeburt',
        'Starbirth Final': 'Finale Sternengeburt',
      },
      '~effectNames': {
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Embolden': 'Ermutigen',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Sword Of Condemnation': 'Épée De Condamnation',
        'Forgiven Venery': 'Débauche Pardonnée',
        'Forgiven Shame': 'Déshonneur Pardonné',
        'Innocence': 'Innocence',
      },
      'replaceText': {
        'Winged Reprobation': 'Réprobation ailée',
        'Winged Rep Trident': 'Trident ailée',
        'Winged Rep Tethers': 'Liens ailée',
        'Winged Rep Rotate': 'Rotation ailée',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth(?! )': 'Accouchement stellaire',
        'Soul and Body': 'Âme et corps',
        'Shadowreaver': 'Pilleur d\'ombre',
        'Scold\'s Bridle': 'Bride-bavarde',
        'Rightful Reprobation': 'Réprobation légitime',
        'Righteous Bolt': 'Éclair vertueux',
        '(?<! )Reprobation': 'Réprobation',
        'Light Pillar': 'Pilier de lumière',
        'Holy Trinity': 'Sainte Trinité',
        'Holy Sword': 'Épée sacrée',
        'Guiding Light': 'Lumière directrice',
        'God Ray': 'Rayon divin',
        'Flaming Sword': 'Épée du feu des cieux',
        'Explosion': 'Explosion',
        'Duel Descent': 'Double plongeon',
        'Drop of Light': 'Goutte de lumière',
        'Dream of the Rood': 'Le Rêve de la Croix',
        'Beatific Vision': 'Vision béatifique',
        'Forgiven venery': 'débauche pardonnée',
        'Forgiven shame': 'déshonneur pardonné',
      },
      '~effectNames': {
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Lightning Resistance Down II': 'Résistance à La Foudre Réduite+',
        'Embolden': 'Enhardissement',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'イノセンス',
      },
      'replaceText': {
        '断罪': '断罪',
        'Winged Reprobation': '断罪の飛翔',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth(?! )': 'スターバース',
        'Soul and Body': 'ソウル・アンド・ボディー',
        'Shadowreaver': 'シャドウリーヴァー',
        'Scold\'s Bridle': 'スコルドブライダル',
        'Rightful Reprobation': '断罪の旋回',
        'Righteous Bolt': 'ジャッジボルト',
        '(?<! )Reprobation': '断罪',
        'Light Pillar': 'ライトピラー',
        'Holy Trinity': 'ホーリートリニティー',
        'Holy Sword': 'ホーリーソード',
        'Guiding Light': 'ガイディングライト',
        'God Ray': 'ゴッドレイ',
        'Flaming Sword': '回転せし炎の剣',
        'Explosion': '爆散',
        'Duel Descent': 'デュアルディセント',
        'Drop of Light': 'ドロップ・オブ・ライト',
        'Dream of the Rood': 'ドリーム・オブ・ザ・ルード',
        'Beatific Vision': 'ビーティフィックビジョン',
        'Forgiven venery': 'フォーギヴン・ヴェナリー',
        'Forgiven shame': 'フォーギヴン・シェイム',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Embolden': 'エンボルデン',
        'Damage Down': 'ダメージ低下',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Sword of Condemnation': '断罪之剑',
        'Innocence': '无瑕灵君',
        'Nail of Condemnation': '断罪之桩',
        'Forgiven Shame': '得到宽恕的耻辱',
        'Forgiven Venery': '得到宽恕的情欲',
      },
      'replaceText': {
        'Winged Rep Trident': '扇形断罪飞翔',
        'Winged Rep Rotate': '风车断罪飞翔',
        'Winged Rep Tethers': '连线断罪飞翔',
        'Winged Reprobation': '断罪飞翔',
        'Starbirth Avoid': '创星躲避',
        'Starbirth Explode': '创星爆炸',
        'Starbirth(?! )': '创星',
        'Soul [aA]nd Body': '身心',
        'Shadowreaver': '夺影',
        'Scold\'s Bridle': '毒舌钩',
        'Rightful Reprobation': '断罪回旋',
        'Righteous Bolt': '裁决之雷',
        '(?<! )Reprobation': '断罪',
        'Light Pillar': '光明柱',
        'Holy Trinity': '圣三一',
        'Holy Sword': '神圣剑',
        'Guiding Light': '指明灯',
        'God Ray': '神光',
        'Flaming Sword': '回转火焰剑',
        'Explosion': '爆炸',
        'Duel Descent': '斗争降临',
        'Drop of Light': '落光',
        'Drop Of Light': '落光',
        'Dream of the Rood': '十字架之梦',
        'Beatific Vision': '荣福直观',
        'Forgiven venery': '得到宽恕的情欲',
        'Forgiven shame': '得到宽恕的耻辱',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '物理受伤加重',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Embolden': '鼓励',
        'Damage Down': '伤害降低',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Innocence': '이노센스',
        'Nail of Condemnation': '단죄의 말뚝',
        'Sword of Condemnation': '단죄의 검',
        'Forgiven Venery': '면죄된 정욕',
        'Forgiven Shame': '면죄된 수치',
      },
      'replaceText': {
        'Winged Reprobation': '단죄의 비상',
        'Winged Rep Trident': '단죄의 비상 직선장판',
        'Winged Rep Rotate': '단죄의 비상 회전',
        'Winged Rep Tethers': '단죄의 비상 줄연결',
        'Starbirth': '별 생성',
        'Soul And Body': '영혼과 육신',
        'Shadowreaver': '그림자 강탈',
        'Scold\'s Bridle': '입막음 굴레',
        'Rightful Reprobation': '단죄의 선회',
        'Righteous Bolt': '심판자의 번개',
        '(?<! )Reprobation': '선회',
        'Light Pillar': '빛의 기둥',
        'Holy Trinity': '성 삼위일체',
        'Holy Sword': '성스러운 검',
        'Guiding Light': '인도하는 빛',
        'God Ray': '신의 광선',
        'Flaming Sword': '회전 화염검',
        'Explosion': '폭발',
        'Duel Descent': '이단 낙하',
        'Drop of Light': '빛내림',
        'Dream of the Rood': '수난의 꿈',
        'Beatific Vision': '지복직관',
        'Forgiven venery': '면죄된 정욕',
        'Forgiven shame': '면죄된 수치',
        ' Avoid': ' (피하기)',
        ' Explode': ' (터뜨리기)',
        ' Charge': ' (돌진)',
        ' Final': ' (마지막)',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Lightning Resistance Down II': '번개속성 저항 감소[강]',
        'Embolden': '성원',
        'Damage Down': '주는 피해량 감소',
      },
    },
  ],
}];
