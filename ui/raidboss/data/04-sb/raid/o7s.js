import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// O7S - Sigmascape 3.0 Savage
export default {
  zoneId: ZoneId.SigmascapeV30Savage,
  timelineFile: 'o7s.txt',
  triggers: [
    // State
    {
      id: 'O7S Aether Rot Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '5C3' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.rot = true;
      },
    },
    {
      id: 'O7S Aether Rot Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '5C3' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.rot = false;
      },
    },
    {
      id: 'O7S Dadaluma Simulation',
      netRegex: NetRegexes.gainsEffect({ target: 'Guardian', effectId: '5D3', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Wächter', effectId: '5D3', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'gardien', effectId: '5D3', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ガーディアン', effectId: '5D3', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '守护者', effectId: '5D3', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '가디언', effectId: '5D3', capture: false }),
      condition: function(data) {
        return !data.first || data.seenVirus && !data.second;
      },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'dada';
        else
          data.first = 'dada';
      },
    },
    {
      id: 'O7S Bibliotaph Simulation',
      netRegex: NetRegexes.gainsEffect({ target: 'Guardian', effectId: '5D4', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Wächter', effectId: '5D4', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'gardien', effectId: '5D4', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ガーディアン', effectId: '5D4', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '守护者', effectId: '5D4', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '가디언', effectId: '5D4', capture: false }),
      condition: function(data) {
        return !data.first || data.seenVirus && !data.second;
      },
      run: function(data) {
        if (data.seenVirus)
          data.second = 'biblio';
        else
          data.first = 'biblio';
      },
    },
    {
      id: 'O7S Virus Tracker',
      netRegex: NetRegexes.gainsEffect({ target: 'Guardian', effectId: '5D5', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Wächter', effectId: '5D5', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'gardien', effectId: '5D5', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ガーディアン', effectId: '5D5', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '守护者', effectId: '5D5', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '가디언', effectId: '5D5', capture: false }),
      run: function(data) {
        data.seenVirus = true;
      },
    },
    {
      id: 'O7S Magitek Ray',
      netRegex: NetRegexes.startsUsing({ id: '2788', source: 'Guardian', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2788', source: 'Wächter', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2788', source: 'Gardien', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2788', source: 'ガーディアン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2788', source: '守护者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2788', source: '가디언', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Magitek Ray',
          de: 'Magitek-Laser',
          fr: 'Rayon Magitek',
          ja: '魔導レーザー',
          cn: '直线AOE',
          ko: '마도 레이저',
        },
      },
    },
    {
      id: 'O7S Arm And Hammer',
      netRegex: NetRegexes.startsUsing({ id: '2789', source: 'Guardian' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2789', source: 'Wächter' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2789', source: 'Gardien' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2789', source: 'ガーディアン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2789', source: '守护者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2789', source: '가디언' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O7S Orb Marker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orb Marker',
          de: 'Orb Marker',
          fr: 'Orbe',
          ja: 'マーカー',
          cn: '死刑点名',
          ko: '원자 파동 징',
        },
      },
    },
    {
      id: 'O7S Blue Marker',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      alarmText: function(data, matches, output) {
        if (data.me !== matches.target)
          return;
        return output.blueMarkerOnYou();
      },
      infoText: function(data, matches, output) {
        if (data.me === matches.target)
          return;
        return output.blueMarkerOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        blueMarkerOn: {
          en: 'Blue Marker on ${player}',
          de: 'Aura-Kanone auf ${player}',
          fr: 'Marque Bleue sur ${player}',
          ja: '${player}に青玉',
          cn: '蓝球点名${player}',
          ko: '"${player}" 파란징',
        },
        blueMarkerOnYou: {
          en: 'Blue Marker on YOU',
          de: 'Aura-Kanone auf DIR',
          fr: 'Marque Bleue sur VOUS',
          ja: '自分に青玉',
          cn: '蓝球点名',
          ko: '파란징 대상자',
        },
      },
    },
    {
      id: 'O7S Prey',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      response: Responses.preyOn('info'),
    },
    {
      id: 'O7S Searing Wind',
      netRegex: NetRegexes.gainsEffect({ effectId: '178' }),
      condition: Conditions.targetIsYou(),
      response: Responses.getOut(),
    },
    {
      id: 'O7S Abandonment',
      netRegex: NetRegexes.gainsEffect({ effectId: '58A' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Abandonment: stay middle',
          de: 'Verlassen: Bleib mittig',
          fr: 'Isolement : restez au milieu',
          ja: '孤独: 内側へ',
          cn: '呆在中间',
          ko: '고독감: 중앙에 있기',
        },
      },
    },
    {
      // Aether Rot
      id: 'O7S Rot',
      netRegex: NetRegexes.gainsEffect({ effectId: '5C3' }),
      infoText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.rotOnYou();

        return output.rotOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        rotOnYou: {
          en: 'Rot on you',
          de: 'Fäule auf DIR',
          fr: 'Pourriture sur VOUS',
          ja: '自分にロット',
          cn: '以太病毒点名',
          ko: '에테르 대상자',
        },
        rotOn: {
          en: 'Rot on ${player}',
          de: 'Fäule auf ${player}',
          fr: 'Pourriture sur ${player}',
          ja: '${player}にロット',
          cn: '以太病毒点名${player}',
          ko: '"${player}" 에테르',
        },
      },
    },
    {
      id: 'O7S Stoneskin',
      netRegex: NetRegexes.startsUsing({ id: '2AB5', source: 'Ultros' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2AB5', source: 'Ultros' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2AB5', source: 'Orthros' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2AB5', source: 'オルトロス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2AB5', source: '奥尔特罗斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2AB5', source: '오르트로스' }),
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'O7S Load',
      // Load: 275C
      // Skip: 2773
      // Retrieve: 2774
      // Paste: 2776
      netRegex: NetRegexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'Guardian', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'Wächter', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'Gardien', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: 'ガーディアン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: '守护者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['275C', '2773', '2774', '2776'], source: '가디언', capture: false }),
      alertText: function(data, _, output) {
        data.loadCount = ++data.loadCount || 1;

        if (data.loadCount === 1) {
          // First load is unknown.
          return output.screen();
        } else if (data.loadCount === 2) {
          return data.first === 'biblio' ? output.dada() : output.biblio();
        } else if (data.loadCount === 3) {
          return data.first === 'biblio' ? output.ultros() : output.ships();
        } else if (data.loadCount === 4) {
          return data.first === 'biblio' ? output.ships() : output.ultros();
        } else if (data.loadCount === 5) {
          return output.virus();
        } else if (data.loadCount === 6) {
          return data.first === 'biblio' ? output.ultros() : output.ships();
        } else if (data.loadCount === 7) {
          // This is the post-virus Load/Skip divergence.
          return output.screen();
        } else if (data.loadCount === 8) {
          return data.first === 'biblio' ? output.dada() : output.biblio();
        } else if (data.loadCount === 9) {
          return data.first === 'biblio' ? output.ships() : output.ultros();
        }

        console.error('Unknown load: ' + data.loadCount);
      },
      outputStrings: {
        screen: {
          en: 'Biblio?/Knockback?',
          de: 'Biblio?/Rückstoß?',
          ja: 'ビブリオタフ?/ノックバック?',
          cn: '图书？/击退？',
        },
        biblio: {
          en: 'Biblio: Positions',
          de: 'Biblio: Positionen',
          ja: 'ビブリオタフ: 定めた位置へ',
          cn: '图书：站位',
        },
        dada: {
          en: 'Dada: Knockback',
          de: 'Dada: Rückstoß',
          ja: 'ダダルマー: ノックバック',
          cn: '达达：击退',
        },
        ships: {
          en: 'Ships: Out of Melee',
          de: 'Flieger: Raus aus Nahkampf-Reichweite',
          ja: 'エアフォース: 離れる',
          cn: '飞机：远离近战范围',
        },
        ultros: {
          en: 'Ultros: Ink Spread',
          de: 'Ultros: Tine - Verteilen',
          ja: 'オルトロス: インク 散開',
          cn: '章鱼：墨汁快散开',
        },
        virus: {
          en: 'VIRUS',
          de: 'VIRUS',
          ja: 'ウイルス',
          cn: '病毒',
        },
      },
    },
    {
      id: 'O7S Run',
      netRegex: NetRegexes.startsUsing({ id: '276F', source: 'Guardian', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '276F', source: 'Wächter', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '276F', source: 'Gardien', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '276F', source: 'ガーディアン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '276F', source: '守护者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '276F', source: '가디언', capture: false }),
      infoText: function(data, _, output) {
        data.runCount = ++data.runCount || 1;

        if (data.runCount === 1)
          return output.dada();
        else if (data.runCount === 2)
          return data.first === 'biblio' ? output.ultros() : output.ships();
        else if (data.runCount === 3)
          return data.first === 'biblio' ? output.ships() : output.ultros();
        else if (data.runCount === 4)
          return data.first === 'biblio' ? output.ultros() : output.ships();
        else if (data.runCount === 5)
          return output.biblio();
        else if (data.runCount === 6)
          return data.first === 'biblio' ? output.ships() : output.ultros();
      },
      outputStrings: {
        biblio: {
          en: 'Biblio Add',
          de: 'Biblio Add',
          ja: '雑魚: ビブリオタフ',
          cn: '图书出现',
        },
        dada: {
          en: 'Dada Add',
          de: 'Dada Add',
          ja: '雑魚: ダダルマー',
          cn: '达达出现',
        },
        ships: {
          en: 'Ship Add',
          de: 'Flieger Add',
          ja: '雑魚: エアフォース',
          cn: '飞机出现',
        },
        ultros: {
          en: 'Ultros Add',
          de: 'Ultros Add',
          ja: '雑魚: オルトロス',
          cn: '章鱼出现',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Fire Control System': 'Feuerleitsystem',
        'Guardian': 'Wächter',
        'Ultros': 'Ultros',
        'WEAPON SYSTEMS ONLINE': 'Feuerkontrollsystem aktiviert',
      },
      'replaceText': {
        'Aether Rot': 'Ätherfäule',
        'Arm And Hammer': 'Arm-Hammer',
        'Atomic Ray': 'Atomstrahlung',
        'Aura Cannon': 'Aura-Kanone',
        'Biblio': 'Bibliotaph',
        'Bomb Deployment': 'Bombeneinsatz',
        'Chain Cannon': 'Kettenkanone',
        'Chakra Burst': 'Chakra-Ausbruch',
        'Copy(?! Program)': 'Kopieren',
        'Dada': 'Dadarma',
        'Demon Simulation': 'Dämonensimulation',
        'Diffractive Laser': 'Diffusionslaser',
        'Diffractive Plasma': 'Diffusionsplasma',
        'Ink': 'Tinte',
        'Interrupt Stoneskin': 'Steinhaut unterbrechen',
        'Load': 'Laden',
        'Magitek Ray': 'Magitek-Laser',
        'Magnetism': 'Magnetismus',
        'Main Cannon': 'Hauptkanone',
        'Missile Simulation': 'Raketensimulation',
        'Paste(?! Program)': 'Einfügen',
        'Plane Laser': 'Luftwaffe Add Laser',
        'Prey': 'Beute',
        'Radar': 'Radar',
        'Repel': 'Abstoßung',
        'Retrieve Air Force': 'Luftwaffe Wiederherstellen',
        'Retrieve Ultros': 'Ultros Wiederherstellen',
        'Run(?! Program)': 'Start',
        'Shockwave': 'Schockwelle',
        'Skip(?! Program)': 'Überspringen',
        'Temporary Misdirection': 'Plötzliche Panik',
        'Tentacle(?! )': 'Tentakel',
        'Tentacle Simulation': 'Tentakelsimulation',
        'Viral Weapon': 'Panikvirus',
        '(?<!\\w)Virus': 'Virus',
        'Wallop': 'Tentakelklatsche',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dadaluma': 'Dadaluma',
        'Fire Control System': 'système de contrôle',
        'Guardian': 'gardien',
        'Ultros': 'Orthros',
        'WEAPON SYSTEMS ONLINE': 'Démarrage du système de contrôle... Activation du programme initial... Gardien, au combat',
      },
      'replaceText': {
        'Aether Rot': 'Pourriture éthéréenne',
        'Arm And Hammer': 'Marteau stratégique',
        'Atomic Ray': 'Rayon atomique',
        'Aura Cannon': 'Rayon d\'aura',
        'Biblio': 'Bibliotaphe',
        'Bomb Deployment': 'Déploiement de bombes',
        'Chain Cannon': 'Canon automatique',
        'Chakra Burst': 'Explosion d\'aura',
        'Copy(?! Program)': 'Copie',
        'Dada': 'Dadaluma',
        'Demon Simulation': 'Chargement : démon',
        'Diffractive Laser': 'Laser diffracteur',
        'Diffractive Plasma': 'Plasma diffracteur',
        'Ink': 'Encre',
        'Interrupt Stoneskin': 'Interrompre Cuirasse',
        'Load': 'Chargement',
        'Magitek Ray': 'Rayon magitek',
        'Magnetism': 'Magnétisme',
        'Main Cannon': 'Canon principal',
        'Missile Simulation': 'Chargement : missiles',
        'Paste(?! Program)': 'Collage',
        'Plane Laser': 'Laser force aérienne',
        'Prey': 'Proie',
        'Radar': 'Radar',
        'Repel': 'Répulsion',
        'Retrieve Air Force': 'Programme Précédent Force Aérienne',
        'Retrieve Ultros': 'Programme Précédent Orthros',
        'Run(?! Program)': 'Programme',
        'Shockwave': 'Onde de choc',
        'Skip(?! Program)': 'Saut De Programme',
        'Temporary Misdirection': 'Démence',
        'Tentacle(?! )': 'Tentacule',
        'Tentacle Simulation': 'Chargement : tentacule',
        'Viral Weapon': 'Arme virologique',
        '(?<!\\w)Virus': 'Virus',
        'Wallop': 'Taloche tentaculaire',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bibliotaph Simulation': 'ビブリオタフ・プログラム',
        'Dadaluma Simulation': 'ダダルマー・プログラム',
        'Fire Control System': 'ファイアコントロールシステム',
        'Guardian': 'ガーディアン',
        'Ultros': 'オルトロス',
        'WEAPON SYSTEMS ONLINE': 'ファイアコントロールシステム起動',
      },
      'replaceText': {
        '\\(H\\)': '(ヒラ)',
        'Aether Rot': 'エーテルロット',
        'Air Force': 'エアフォース',
        'Arm And Hammer': 'アームハンマー',
        'Atomic Ray': 'アトミックレイ',
        'Aura Cannon': 'オーラキャノン',
        'Biblio': 'ビブリオタフ',
        'Bomb Deployment': '爆弾設置',
        'Chain Cannon': 'チェーンガン',
        'Chakra Burst': 'チャクラバースト',
        'Copy(?! Program)': 'コピー',
        'Dada': 'ダダルマー',
        'Demon Simulation': 'ローディング：デーモン',
        'Diffractive Laser': '拡散レーザー',
        'Diffractive Plasma': '拡散プラズマ',
        'Ink': '墨',
        'Interrupt Stoneskin': '沈黙: ストーンスキン',
        'Load': 'ローディング',
        'Magitek Ray': '魔導レーザー',
        'Magnetism': '磁力',
        'Main Cannon': 'メインカノン',
        'Missile Simulation': 'ローディング：ミサイル',
        'Paste(?! Program)': 'ペースト',
        'Plane Laser': 'エアフォース レザー',
        'Prey': 'プレイ',
        'Radar': 'レイダー',
        'Repel': '反発',
        'Retrieve': 'リバース',
        'Run(?! Program)': '実体化',
        'Shockwave': '衝撃波',
        'Skip(?! Program)': 'スキップ',
        'Temporary Misdirection': '心神喪失',
        'Tentacle(?! )': 'たこあし',
        'Tentacle Simulation': 'ローディング：たこあし',
        'Ultros': 'オルトロス',
        'Viral Weapon': 'ウィルス兵器',
        '(?<!\\w)Virus': 'ウイルス',
        'Wallop': '叩きつけ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Dadaluma': '达达鲁玛',
        'Fire Control System': '武器火控系统',
        'Guardian': '守护者',
        'Ultros': '奥尔特罗斯',
        'WEAPON SYSTEMS ONLINE': '武器火控系统启动',
      },
      'replaceText': {
        'Aether Rot': '以太病毒',
        'Arm And Hammer': '臂锤',
        'Atomic Ray': '原子射线',
        'Aura Cannon': '斗气炮',
        'Biblio': '永世珍本',
        'Bomb Deployment': '设置炸弹',
        'Chain Cannon': '链式机关炮',
        'Chakra Burst': '脉轮爆发',
        'Copy(?! Program)': '复制',
        'Dada': '达达鲁玛',
        'Demon Simulation': '加载恶魔模拟程序',
        'Diffractive Laser': '扩散射线',
        'Diffractive Plasma': '扩散离子',
        'Ink': '墨汁',
        'Interrupt Stoneskin': '打断石肤',
        'Load': '加载',
        'Magitek Ray': '魔导激光',
        'Magnetism': '磁力',
        'Main Cannon': '主加农炮',
        'Missile Simulation': '加载导弹模拟程序',
        'Paste(?! Program)': '粘贴',
        'Plane Laser': '平面激光',
        'Prey': '猎物',
        'Radar': '雷达',
        'Repel': '相斥',
        'Retrieve Air Force': '接小飞机',
        'Retrieve Ultros': '接奥尔特罗斯',
        'Run(?! Program)': '跑',
        'Shockwave': '冲击波',
        'Skip(?! Program)': '跳跃',
        'Temporary Misdirection': '精神失常',
        'Tentacle(?! )': '腕足',
        'Tentacle Simulation': '加载腕足模拟程序',
        'Viral Weapon': '病毒兵器',
        '(?<!\\w)Virus': '病毒',
        'Wallop': '敲击',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Dadaluma': '다다루마',
        'Fire Control System': '병기 제어 시스템',
        'Guardian': '가디언',
        'Ultros': '오르트로스',
        'WEAPON SYSTEMS ONLINE': '병기 제어 시스템 기동……',
      },
      'replaceText': {
        '\\(H\\)': '(힐러)',
        '\\(DPS\\)': '(딜러)',
        'Aether Rot': '에테르 부패',
        'Air Force': '에어포스',
        'Arm And Hammer': '양팔 내리치기',
        'Atomic Ray': '원자 파동',
        'Aura Cannon': '오라 포격',
        'Biblio': '비블리오',
        'Bomb Deployment': '폭탄 설치',
        'Chain Cannon': '기관총',
        'Chakra Burst': '차크라 폭발',
        'Copy(?! Program)': '복사',
        'Dada': '다다',
        'Demon Simulation': '불러오기: 악마',
        'Diffractive Laser': '확산 레이저',
        'Diffractive Plasma': '확산 플라스마',
        'Ink': '먹물',
        'Interrupt Stoneskin': '스톤스킨 침묵하기',
        'Load': '불러오기',
        'Magitek Ray': '마도 레이저',
        'Magnetism': '자력',
        'Main Cannon': '주포',
        'Missile Simulation': '불러오기: 미사일',
        'Paste(?! Program)': '붙여넣기',
        'Plane Laser': '에어포스 레이저',
        'Prey': '표식',
        'Radar': '레이더',
        'Repel': '반발',
        'Run(?! Program)': '실체화',
        'Shockwave': '충격파',
        'Skip(?! Program)': '건너뛰기',
        'Temporary Misdirection': '심신상실',
        'Tentacle(?! )': '문어발',
        'Tentacle Simulation': '불러오기: 문어발',
        'Retrieve Ultros': '역순 불러오기: 오르트로스',
        'Viral Weapon': '바이러스 병기',
        '(?<!\\w)Virus': '바이러스',
        'Wallop': '매질',
      },
    },
  ],
};
