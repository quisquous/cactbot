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
      regex: / 14:3EEF:Innocence starts using Starbirth/,
      regexCn: / 14:3EEF:无瑕灵君 starts using 创星/,
      regexDe: / 14:3EEF:Innozenz starts using Sternengeburt/,
      regexFr: / 14:3EEF:Innocence starts using Accouchement [sS]tellaire/,
      regexJa: / 14:3EEF:イノセンス starts using スターバース/,
      regexKo: / 14:3EEF:이노센스 starts using 별 생성/,
      run: function(data) {
        data.starbirthCount = data.starbirthCount || 0;
        data.starbirthCount++;
        data.starbirthActive = true;
      },
    },
    {
      id: 'InnoEx Reprobation Swords 2',
      regex: / 14:3EDC:Innocence starts using Rightful Reprobation/,
      regexCn: / 14:3EDC:无瑕灵君 starts using 断罪回旋/,
      regexDe: / 14:3EDC:Innozenz starts using Rechtmäßige Verurteilung/,
      regexFr: / 14:3EDC:Innocence starts using Réprobation [lL]égitime/,
      regexJa: / 14:3EDC:イノセンス starts using 断罪の旋回/,
      regexKo: / 14:3EDC:이노센스 starts using 단죄의 선회/,
      // 3 seconds cast time + 7 seconds until next sword.
      delaySeconds: 7,
      infoText: {
        en: 'Swords!',
        de: 'Schwerter!',
        ja: '剣くるよ',
        fr: 'Epées !',
        cn: '剑!',
        ko: '검!',
      },
    },
    {
      id: 'InnoEx Starbirth Warning',
      regex: / 14:3EEF:Innocence starts using Starbirth/,
      regexCn: / 14:3EEF:无瑕灵君 starts using 创星/,
      regexDe: / 14:3EEF:Innozenz starts using Sternengeburt/,
      regexFr: / 14:3EEF:Innocence starts using Accouchement [sS]tellaire/,
      regexJa: / 14:3EEF:イノセンス starts using スターバース/,
      regexKo: / 14:3EEF:이노센스 starts using 별 생성/,
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
            ko: '별 생성: 피하기 + 돌진',
          };
        } else if (data.starbirthCount == 3) {
          return {
            en: 'Starbirth: Explode',
            de: 'Sternengeburt: Explosion',
            ja: 'スターバース: 爆発',
            fr: 'Accouchement Stellaire : Explosion',
            cn: '创星：爆炸',
            ko: '별 생성: 폭발',
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
      regex: / 14:3EEA:Innocence starts using Shadowreaver/,
      regexCn: / 14:3EEA:无瑕灵君 starts using 夺影/,
      regexDe: / 14:3EEA:Innozenz starts using Schattenplünderer/,
      regexFr: / 14:3EEA:Innocence starts using Pilleur/,
      regexJa: / 14:3EEA:イノセンス starts using シャドウリーヴァー/,
      regexKo: / 14:3EEA:이노센스 starts using 그림자 강탈/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '광딜',
      },
    },
    {
      id: 'InnoEx Righteous Bolt',
      regex: / 14:3ECD:Innocence starts using Righteous Bolt on (\y{Name})/,
      regexCn: / 14:3ECD:无瑕灵君 starts using 裁决之雷 on (\y{Name})/,
      regexDe: / 14:3ECD:Innozenz starts using Blitz der Gerechtigkeit on (\y{Name})/,
      regexFr: / 14:3ECD:Innocence starts using Éclair [vV]ertueux on (\y{Name})/,
      regexJa: / 14:3ECD:イノセンス starts using ジャッジボルト on (\y{Name})/,
      regexKo: / 14:3ECD:이노센스 starts using 심판자의 번개 on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
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
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 -> YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
            ko: '탱버 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'InnoEx Holy Sword Healer',
      regex: / 14:3EC9:Forgiven Venery starts using Holy Sword/,
      regexCn: / 14:3EC9:得到宽恕的情欲 starts using 神圣剑/,
      regexDe: / 14:3EC9:Geläuterte Wollust starts using Heiliges Schwert/,
      regexFr: / 14:3EC9:Débauche Pardonnée starts using Épée [sS]acrée/,
      regexJa: / 14:3EC9:フォーギヴン・ヴェナリー starts using ホーリーソード/,
      regexKo: / 14:3EC9:면죄된 정욕 starts using 성스러운 검/,
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
      regex: / 14:3EC9:forgiven venery starts using Holy Sword on (\y{Name})/,
      regexCn: / 14:3EC9:得到宽恕的情欲 starts using 神圣剑 on (\y{Name})/,
      regexDe: / 14:3EC9:Geläuterte Wollust starts using Heiliges Schwert on (\y{Name})/,
      regexFr: / 14:3EC9:Débauche Pardonnée starts using Épée [sS]acrée on (\y{Name})/,
      regexJa: / 14:3EC9:フォーギヴン・ヴェナリー starts using ホーリーソード on (\y{Name})/,
      regexKo: / 14:3EC9:면죄된 정욕 starts using 성스러운 on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
        ko: '탱버 -> YOU',
      },
    },
    {
      id: 'InnoEx Charge',
      regex: / 14:3EEE:Innocence starts using Beatific Vision/,
      regexCn: / 14:3EEE:无瑕灵君 starts using 荣福直观/,
      regexDe: / 14:3EEE:Innozenz starts using Seligmachende Schau/,
      regexFr: / 14:3EEE:Innocence starts using Vision [bB]éatifique/,
      regexJa: / 14:3EEE:イノセンス starts using ビーティフィックビジョン/,
      regexKo: / 14:3EEE:이노센스 starts using 지복직관/,
      alertText: function(data) {
        if (data.starbirthActive) {
          return {
            en: 'Avoid Charge and Orbs',
            de: 'Charge und Orbs ausweichen',
            ja: '玉と突進避けて',
            fr: 'Evitez les charges et orbes',
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
      regex: / 14:3EEF:Innocence starts using Starbirth/,
      regexCn: / 14:3EEF:无瑕灵君 starts using 创星/,
      regexDe: / 14:3EEF:Innozenz starts using Sternengeburt/,
      regexFr: / 14:3EEF:Innocence starts using Accouchement [sS]tellaire/,
      regexJa: / 14:3EEF:イノセンス starts using スターバース/,
      regexKo: / 14:3EEF:이노센스 starts using 별 생성/,
      delaySeconds: 6,
      condition: function(data) {
        return data.starbirthCount == 1;
      },
      alertText: {
        en: 'Get to Safe Corner',
        de: 'Geh in die sichere Ecke',
        ja: '安置へ',
        fr: 'Allez sur le coin sûr',
        cn: '去安全角落',
        ko: '안전한 코너로 이동',
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
      regex: / 14:3F3E:Innocence starts using Light Pillar/,
      regexCn: / 14:3F3E:无瑕灵君 starts using 光明柱/,
      regexDe: / 14:3F3E:Innozenz starts using Lichtsäule/,
      regexFr: / 14:3F3E:Innocence starts using Pilier [dD]e [lL]umière/,
      regexJa: / 14:3F3E:イノセンス starts using ライトピラー/,
      regexKo: / 14:3F3E:이노센스 starts using 빛의 기둥/,
      condition: function(data) {
        return data.lightPillar == 3;
      },
      delaySeconds: 6.5,
      alertText: {
        en: 'Get to Safe Corner',
        de: 'Geh in die sichere Ecke',
        fr: 'Allez sur le coin sûr',
        cn: '去安全角落',
        ko: '안전한 코너로 이동하세요',
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
        ko: '징 대상자 지정됨',
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
            fr: 'Cercle, Evitez orbes',
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
      regex: / 14:3EE[456]:Innocence starts using God Ray/,
      regexCn: / 14:3EE[456]:无瑕灵君 starts using 神光/,
      regexDe: / 14:3EE[456]:Innozenz starts using Göttlicher Strahl/,
      regexFr: / 14:3EE[456]:Innocence starts using Rayon Divin/,
      regexJa: / 14:3EE[456]:イノセンス starts using ゴッドレイ/,
      regexKo: / 14:3EE[456]:이노센스 starts using 신의 광선/,
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
      regex: / 14:3EEA:Innocence starts using Shadowreaver/,
      regexCn: / 14:3EEA:无瑕灵君 starts using 夺影/,
      regexDe: / 14:3EEA:Innozenz starts using Schattenplünderer/,
      regexFr: / 14:3EEA:Innocence starts using Pilleur/,
      regexJa: / 14:3EEA:イノセンス starts using シャドウリーヴァー/,
      regexKo: / 14:3EEA:이노센스 starts using 그림자 광탈/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Starbirth End 2',
      regex: / 14:3EEE:Innocence starts using Beatific Vision/,
      regexCn: / 14:3EEE:无瑕灵君 starts using 荣福直观/,
      regexDe: / 14:3EEE:Innozenz starts using Seligmachende Schau/,
      regexFr: / 14:3EEE:Innocence starts using Vision [bB]éatifique/,
      regexJa: / 14:3EEE:イノセンス starts using ビーティフィックビジョン/,
      regexKo: / 14:3EEE:이노센스 starts using 지복직관/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Soul And Body Left',
      regex: / 14:3ED7:Innocence starts using Soul and Body/,
      regexCn: / 14:3ED7:无瑕灵君 starts using 身心/,
      regexDe: / 14:3ED7:Innozenz starts using Seele und Körper/,
      regexFr: / 14:3ED7:Innocence starts using Âme et corps/,
      regexJa: / 14:3ED7:イノセンス starts using ソウル・アンド・ボディー/,
      regexKo: / 14:3ED7:이노센스 starts using 영혼과 육신/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Left',
        de: 'Links rum rotieren',
        cn: '向左旋转',
        ko: '왼쪽으로 도세요',
      },
    },
    {
      id: 'InnoEx Soul And Body Right',
      regex: / 14:3ED9:Innocence starts using Soul and Body/,
      regexCn: / 14:3ED9:无瑕灵君 starts using 身心/,
      regexDe: / 14:3ED9:Innozenz starts using Seele und Körper/,
      regexFr: / 14:3ED9:Innocence starts using Âme et corps/,
      regexJa: / 14:3ED9:イノセンス starts using ソウル・アンド・ボディー/,
      regexKo: / 14:3ED9:이노센스 starts using 영혼과 육신/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Right',
        de: 'Rechts rum rotieren',
        cn: '向右旋转',
        ko: '오른쪽으로 도세요',
      },
    },
    {
      id: 'InnoEx Rood',
      regex: / 14:3ED3:Innocence starts using Dream [Oo]f [Tt]he Rood/,
      regexCn: / 14:3ED3:无瑕灵君 starts using 十字架之梦/,
      regexDe: / 14:3ED3:Innozenz starts using Traum des Kreuzes/,
      regexFr: / 14:3ED3:Innocence starts using Le Rêve de la Croix/,
      regexJa: / 14:3ED3:イノセンス starts using ドリーム・オブ・ザ・ルード/,
      regexKo: / 14:3ED3:이노센스 starts using 수난의 꿈/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Left',
        de: 'Links rum rotieren',
        cn: '向左旋转',
        ko: '왼쪽으로 도세요',
      },
    },
    {
      id: 'InnoEx Rood',
      regex: / 14:3ED5:Innocence starts using Dream [Oo]f [Tt]he Rood/,
      regexCn: / 14:3ED5:无瑕灵君 starts using 十字架之梦/,
      regexDe: / 14:3ED5:Innozenz starts using Traum des Kreuzes/,
      regexFr: / 14:3ED5:Innocence starts using Le Rêve de la Croix/,
      regexJa: / 14:3ED5:イノセンス starts using ドリーム・オブ・ザ・ルード/,
      regexKo: / 14:3ED5:이노센스 starts using 수난의 꿈/,
      suppressSeconds: 1,
      infoText: {
        en: 'Rotate Right',
        de: 'Rechts rum rotieren',
        cn: '向右旋转',
        ko: '오른쪽으로 도세요',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Innocence': 'Innozenz',
        'Engage!': 'Start!',
        'Nail of Condemnation': 'Nagel des Urteils',
        'Sword of Condemnation': 'Schwert des Urteils',
        'Forgiven Venery': 'Geläuterte Wollust',
        'Forgiven Shame': 'Geläuterte Schande',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Winged Reprobation': 'Schwinge des Urteils',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': 'Sternengeburt',
        'Soul and Body': 'Seele und Körper',
        'Shadowreaver': 'Schattenplünderer',
        'Scold\'s Bridle': 'Schandmal',
        'Rightful Reprobation': 'Rechtmäßige Verurteilung',
        'Righteous Bolt': 'Blitz der Gerechtigkeit',
        'Reprobation': 'Verurteilung',
        'Light Pillar': 'Lichtsäule',
        'Holy Trinity': 'Heilige Dreifaltigkeit',
        'Holy Sword': 'Heiliges Schwert',
        'Guiding Light': 'Leitendes Licht',
        'God Ray': 'Göttlicher Strahl',
        'Flaming Sword': 'Flammenschwert',
        'Explosion': 'Explosion',
        'Enrage': 'Finalangriff',
        'Duel Descent': 'Doppelter Sinkflug',
        'Drop of Light': 'Lichtabfall',
        'Dream of the Rood': 'Traum des Kreuzes',
        'Beatific Vision': 'Seligmachende Schau',
        'Forgiven venery': 'Geläuterte Wollust',
        'Forgiven shame': 'Geläuterte Schande',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        'Drop Of Light': 'Lichtabfall',
        'Winged Rep': 'Schwinge des Urteils',
        'Soul And Body': 'Seele und Körper',
        '--jump--': '--Sprung--',
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
      'replaceSync': {
        'Sword Of Condemnation': 'Épée De Condamnation',
        'Forgiven Venery': 'Débauche Pardonnée',
        'Forgiven Shame': 'Déshonneur Pardonné',
        'Innocence': 'Innocence',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Winged Reprobation': 'Réprobation ailée',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': 'Accouchement stellaire',
        'Soul and Body': 'Âme et corps',
        'Shadowreaver': 'Pilleur d\'ombre',
        'Scold\'s Bridle': 'Bride-bavarde',
        'Rightful Reprobation': 'Réprobation légitime',
        'Righteous Bolt': 'Éclair vertueux',
        'Reprobation': 'Réprobation',
        'Light Pillar': 'Pilier de lumière',
        'Holy Trinity': 'Sainte Trinité',
        'Holy Sword': 'Épée sacrée',
        'Guiding Light': 'Lumière directrice',
        'God Ray': 'Rayon divin',
        'Flaming Sword': 'Épée du feu des cieux',
        'Explosion': 'Explosion',
        'Enrage': 'Enrage',
        'Duel Descent': 'Double plongeon',
        'Drop of Light': 'Goutte de lumière',
        'Dream of the Rood': 'Le Rêve de la Croix',
        'Beatific Vision': 'Vision béatifique',
        'Forgiven venery': 'débauche pardonnée',
        'Forgiven shame': 'déshonneur pardonné',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
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
      'replaceSync': {
        'Schwert des Urteils': '',
        'Innocence': 'イノセンス',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        '断罪': '断罪',
        'attack': '攻撃',
        'Winged Reprobation': '断罪の飛翔',
        'Unknown Ability': 'Unknown Ability',
        'Starbirth': 'スターバース',
        'Soul and Body': 'ソウル・アンド・ボディー',
        'Shadowreaver': 'シャドウリーヴァー',
        'Scold\'s Bridle': 'スコルドブライダル',
        'Rightful Reprobation': '断罪の旋回',
        'Righteous Bolt': 'ジャッジボルト',
        'Reprobation': '断罪',
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
      'replaceSync': {
        'Sword of Condemnation': '断罪之剑',
        'Innocence': '无瑕灵君',
        'Engage!': '战斗开始！',
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
        'Starbirth': '创星',
        'Soul [aA]nd Body': '身心',
        'Shadowreaver': '夺影',
        'Scold\'s Bridle': '毒舌钩',
        'Rightful Reprobation': '断罪回旋',
        'Righteous Bolt': '裁决之雷',
        'Reprobation': '断罪',
        'Light Pillar': '光明柱',
        'Holy Trinity': '圣三一',
        'Holy Sword': '神圣剑',
        'Guiding Light': '指明灯',
        'God Ray': '神光',
        'Flaming Sword': '回转火焰剑',
        'Explosion': '爆炸',
        'Enrage': '狂暴',
        'Duel Descent': '斗争降临',
        'Drop of Light': '落光',
        'Drop Of Light': '落光',
        'Dream of the Rood': '十字架之梦',
        'Beatific Vision': '荣福直观',
        'Forgiven venery': '得到宽恕的情欲',
        'Forgiven shame': '得到宽恕的耻辱',
        '--untargetable--': '--无法选中--',
        '--targetable--': '--可选中--',
        '--jump--': '--BOSS位移--',
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
        'Engage!': '전투 시작!',
        'Nail of Condemnation': '단죄의 말뚝',
        'Sword of Condemnation': '단죄의 검',
        'Forgiven Venery': '면죄된 정욕',
        'Forgiven Shame': '면죄된 수치',
      },
      'replaceText': {
        'attack': '공격',
        'Winged Reprobation': '단죄의 비상',
        'Winged Rep Trident': '단죄의 비상 직선장판',
        'Winged Rep Rotate': '단죄의 비상 회전',
        'Winged Rep Tethers': '단죄의 비상 줄연결',
        'Starbirth': '별 생성',
        'Soul and Body': '영혼과 육신',
        'Shadowreaver': '그림자 강탈',
        'Scold\'s Bridle': '입막음 굴레',
        'Rightful Reprobation': '단죄의 선회',
        'Righteous Bolt': '심판자의 번개',
        'Reprobation': '선회',
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
        'Enrage': '전멸기',
        '--untargetable--': '--타겟 불가능--',
        '--targetable--': '--타겟 가능--',
        '--jump--': '--보스이동--',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '물리 피해량 증가',
        'Lightning Resistance Down II': '번개 저항 저하［강］',
        'Embolden': '격려',
        'Damage Down': '주는 피해량 감소',
      },
    },
  ],
}];
