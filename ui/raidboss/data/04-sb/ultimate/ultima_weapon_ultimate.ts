import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  phase?: string;
  titanGaols?: string[];
  titanBury?: NetMatches['AddedCombatant'][];
}

// Ultima Weapon Ultimate
const triggerSet: TriggerSet<Data> = {
  id: 'TheWeaponsRefrainUltimate',
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  timelineFile: 'ultima_weapon_ultimate.txt',
  timelineTriggers: [
    {
      id: 'UWU Diffractive Laser',
      regex: /Diffractive Laser/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'UWU Feather Rain',
      regex: /Feather Rain/,
      beforeSeconds: 3,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move!',
          de: 'Bewegen',
          fr: 'Bougez !',
          ja: 'フェザーレイン',
          cn: '躲羽毛',
          ko: '이동',
        },
      },
    },
  ],
  triggers: [
    // Phases
    {
      id: 'UWU Suppression Phase',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2D4D', capture: false },
      run: (data) => data.phase = 'suppression',
    },
    {
      // Wait after suppression for primal triggers at the end.
      id: 'UWU Finale Phase',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2D4D', capture: false },
      delaySeconds: 74,
      run: (data) => data.phase = 'finale',
    },
    {
      id: 'UWU Garuda Slipstream',
      type: 'StartsUsing',
      netRegex: { id: '2B53', source: 'Garuda', capture: false },
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Slipstream',
          de: 'Wirbelströmung',
          fr: 'Sillage',
          ja: 'スリップストリーム',
          cn: '螺旋气流',
          ko: '반동 기류',
        },
      },
    },
    {
      id: 'UWU Garuda Mistral Song Marker',
      type: 'HeadMarker',
      netRegex: { id: '0010' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mistral on YOU',
          de: 'Mistral-Song',
          fr: 'Mistral sur VOUS',
          ja: 'ミストラルソング',
          cn: '寒风之歌点名',
          ko: '삭풍 징',
        },
      },
    },
    {
      id: 'UWU Garuda Mistral Song Tank',
      type: 'HeadMarker',
      netRegex: { id: '0010', capture: false },
      condition: (data) => data.role === 'tank',
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mistral Song',
          de: 'Mistral-Song',
          fr: 'Chant du mistral',
          ja: 'ミストラルソング',
          cn: '寒风之歌',
          ko: '삭풍 징',
        },
      },
    },
    {
      id: 'UWU Garuda Spiny Plume',
      type: 'AddedCombatant',
      netRegex: { name: 'Spiny Plume', capture: false },
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spiny Plume Add',
          de: 'Dorniger Federsturm',
          fr: 'Add Plume perforante',
          ja: 'スパイニープルーム',
          cn: '刺羽出现',
          ko: '가시돋힌 깃털 등장',
        },
      },
    },
    {
      id: 'UWU Ifrit Fetters',
      type: 'GainsEffect',
      netRegex: { effectId: '179' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 45,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fetters on YOU',
          de: 'Fesseln auf DIR',
          fr: 'Chaînes sur VOUS',
          ja: '自分に炎獄の鎖',
          cn: '火狱之锁点名',
          ko: '사슬 → 나',
        },
      },
    },
    {
      id: 'UWU Searing Wind',
      type: 'StartsUsing',
      netRegex: { id: '2B5B', source: 'Ifrit' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Searing Wind on YOU',
          de: 'Versengen auf DIR',
          fr: 'Carbonisation sur VOUS',
          ja: '自分に灼熱',
          cn: '灼热咆哮点名',
          ko: '작열 → 나',
        },
      },
    },
    {
      id: 'UWU Ifrit Flaming Crush',
      type: 'HeadMarker',
      netRegex: { id: '0075', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack',
          de: 'Stack',
          fr: 'Packez-vous',
          ja: '頭割り',
          cn: '集合',
          ko: '집합',
        },
      },
    },
    {
      id: 'UWU Garuda Woken',
      type: 'GainsEffect',
      netRegex: { target: 'Garuda', effectId: '5F9', capture: false },
      sound: 'Long',
    },
    {
      id: 'UWU Ifrit Woken',
      type: 'GainsEffect',
      netRegex: { target: 'Ifrit', effectId: '5F9', capture: false },
      sound: 'Long',
    },
    {
      id: 'UWU Titan Woken',
      type: 'GainsEffect',
      netRegex: { target: 'Titan', effectId: '5F9', capture: false },
      sound: 'Long',
    },
    {
      id: 'UWU Titan Bury Direction',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1803' },
      condition: (data, matches) => {
        (data.titanBury ??= []).push(matches);
        return data.titanBury.length === 5;
      },
      alertText: (data, _matches, output) => {
        const bombs = (data.titanBury ?? []).map((matches) => {
          return { x: parseFloat(matches.x), y: parseFloat(matches.y) };
        });
        if (bombs.length !== 5) {
          console.error(`Titan Bury: wrong bombs size: ${JSON.stringify(data.titanBury)}`);
          return;
        }
        // 5 bombs drop, and then a 6th later.
        // They all drop on one half of the arena, and then 3 on one half and 2 on the other.
        // e.g. all 5 drop on north half, 3 on west half, 2 on east half.
        const centerX = 100;
        const centerY = 100;
        const numDir = [0, 0, 0, 0]; // north, east, south, west
        for (const bomb of bombs) {
          if (bomb.y < centerY)
            numDir[0]++;
          else
            numDir[2]++;
          if (bomb.x < centerX)
            numDir[3]++;
          else
            numDir[1]++;
        }

        for (let idx = 0; idx < numDir.length; ++idx) {
          if (numDir[idx] !== 5)
            continue;
          // Example: dir is 1 (east), party is west, facing west.
          // We need to check dir 0 (north, aka "right") and dir 2 (south, aka "left").
          const numLeft = numDir[(idx + 1) % 4] ?? -1;
          const numRight = numDir[(idx - 1 + 4) % 4] ?? -1;

          if (numRight === 2 && numLeft === 3)
            return output.right!();
          if (numRight === 3 && numLeft === 2)
            return output.left!();

          console.error(
            `Titan Bury: bad counts: ${
              JSON.stringify(data.titanBury)
            }, ${idx}, ${numLeft}, ${numRight}`,
          );
          return;
        }

        console.error(`Titan Bury: failed to find dir: ${JSON.stringify(data.titanBury)}`);
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'UWU Titan Gaols',
      type: 'Ability',
      netRegex: { id: ['2B6C', '2B6B'], source: ['Garuda', 'Titan'] },
      preRun: (data, matches) => {
        data.titanGaols ??= [];
        data.titanGaols.push(matches.target);
        if (data.titanGaols.length === 3)
          data.titanGaols.sort();
      },
      alertText: (data, _matches, output) => {
        if (data.titanGaols?.length !== 3)
          return;
        const idx = data.titanGaols.indexOf(data.me);
        if (idx < 0)
          return;
        // Just return your number.
        return output.num!({ num: idx + 1 });
      },
      infoText: (data, _matches, output) => {
        if (data.titanGaols?.length !== 3)
          return;
        return output.text!({
          player1: data.ShortName(data.titanGaols[0]),
          player2: data.ShortName(data.titanGaols[1]),
          player3: data.ShortName(data.titanGaols[2]),
        });
      },
      outputStrings: {
        num: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
        text: {
          en: '${player1}, ${player2}, ${player3}',
          de: '${player1}, ${player2}, ${player3}',
          fr: '${player1}, ${player2}, ${player3}',
          ja: '${player1}, ${player2}, ${player3}',
          cn: '${player1}, ${player2}, ${player3}',
          ko: '${player1}, ${player2}, ${player3}',
        },
      },
    },
    {
      // If anybody dies to bombs (WHY) and a rock is on them, then glhf.
      id: 'UWU Titan Bomb Failure',
      type: 'Ability',
      netRegex: { id: '2B6A', source: 'Bomb Boulder' },
      infoText: (data, matches, output) => {
        if (!data.titanGaols)
          return;
        if (!data.titanGaols.includes(matches.target))
          return;
        return output.text!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: '${player} died',
          de: '${player} gestorben',
          fr: '${player} est mort(e)',
          ja: '${player} 死にました',
          cn: '${player} 死亡',
          ko: '${player} 죽음',
        },
      },
    },
    {
      id: 'UWU Gaol Cleanup',
      type: 'Ability',
      netRegex: { id: ['2B6C', '2B6B'], source: ['Garuda', 'Titan'], capture: false },
      delaySeconds: 15,
      run: (data) => delete data.titanGaols,
    },
    {
      id: 'UWU Suppression Gaol',
      type: 'Ability',
      netRegex: { id: '2B6B', source: 'Titan' },
      condition: (data, matches) => data.phase === 'suppression' && data.me === matches.target,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Gaol on YOU',
          de: 'Granitgefängnis',
          fr: 'Geôle sur VOUS',
          ja: 'ジェイル',
          cn: '石牢点名',
          ko: '돌감옥 대상자',
        },
      },
    },
    {
      id: 'UWU Aetherochemical Laser Middle',
      type: 'StartsUsing',
      netRegex: { source: 'The Ultima Weapon', id: '2B84', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Middle Laser',
          de: 'Laser (Mitte)',
          fr: 'Laser (Milieu)',
          ja: 'レーザー (中央)',
          cn: '中间激光',
          ko: '가운데 레이저',
        },
      },
    },
    {
      id: 'UWU Aetherochemical Laser Right',
      type: 'StartsUsing',
      netRegex: { source: 'The Ultima Weapon', id: '2B85', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'North Laser',
          de: 'Laser (Norden)',
          fr: 'Laser (Nord)',
          ja: 'レーザー (北)',
          cn: '右侧激光',
          ko: '북쪽 레이저',
        },
      },
    },
    {
      id: 'UWU Aetherochemical Laser Left',
      type: 'StartsUsing',
      netRegex: { source: 'The Ultima Weapon', id: '2B86', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'East Laser',
          de: 'Laser (Osten)',
          fr: 'Laser (Est)',
          ja: 'レーザー (東)',
          cn: '左侧激光',
          ko: '동쪽 레이저',
        },
      },
    },
    {
      id: 'UWU Garuda Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2CD3', capture: false },
      condition: (data) => data.phase === 'finale',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Garuda',
          de: 'Garuda',
          fr: 'Garuda',
          ja: 'ガルーダ',
          cn: '迦楼罗',
          ko: '가루다',
        },
      },
    },
    {
      id: 'UWU Ifrit Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2CD4', capture: false },
      condition: (data) => data.phase === 'finale',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ifrit',
          de: 'Ifrit',
          fr: 'Ifrit',
          ja: 'イフリート',
          cn: '伊弗利特',
          ko: '이프리트',
        },
      },
    },
    {
      id: 'UWU Titan Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2CD5', capture: false },
      condition: (data) => data.phase === 'finale',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Titan',
          de: 'Titan',
          fr: 'Titan',
          ja: 'タイタン',
          cn: '泰坦',
          ko: '타이탄',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb Boulder': 'Bomber-Brocken',
        'Chirada': 'Chirada',
        'Garuda': 'Garuda',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE':
          'Nun, ihr Würmer! Ihr wollt die Macht des Windes spüren?',
        'Ifrit': 'Ifrit',
        'Lahabrea': 'Lahabrea',
        'Spiny Plume': 'dornig(?:e|er|es|en) Federsturm',
        'Suparna': 'Suparna',
        'The Ultima Weapon': 'Ultima-Waffe',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Aerial Blast': 'Windschlag',
        'Aetheric Boom': 'Ätherknall',
        'Aetherochemical Laser': 'Ätherochemischer Laser',
        '(?<! )Aetheroplasm': 'Ätheroplasma',
        'Apply Viscous': 'Ätheroplasma wirkt',
        'Blight': 'Pesthauch',
        'Bury': 'Begraben',
        'Ceruleum Vent': 'Erdseim-Entlüfter',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Dark IV': 'Neka',
        'Diffractive Laser': 'Diffraktiver Laser',
        'Downburst': 'Fallböe',
        'Earthen Fury': 'Gaias Zorn',
        'Eruption': 'Eruption',
        'Eye Of The Storm': 'Auge des Sturms',
        'Feather Rain': 'Federregen',
        'Flaming Crush': 'Flammenstoß',
        'Freefire': 'Schwerer Beschuss',
        'Friction': 'Windklinge',
        'Geocrush': 'Geo-Stoß',
        'Great Whirlwind': 'Großer Wirbelsturm', // FIXME
        'Hellfire': 'Höllenfeuer',
        'Homing Lasers': 'Leitlaser',
        'Incinerate': 'Einäschern',
        'Infernal Fetters': 'Infernofesseln',
        'Inferno Howl': 'Brennende Wut',
        'Landslide': 'Bergsturz',
        'Mesohigh': 'Meso-Hoch',
        'Mistral Shriek': 'Mistral-Schrei',
        'Mistral Song': 'Mistral-Song',
        'Mountain Buster': 'Bergsprenger',
        'Nail Adds': 'Fessel Adds',
        'Radiant Plume': 'Scheiterhaufen',
        'Rock Buster': 'Steinsprenger',
        'Rock Throw': 'Granitgefängnis',
        'Searing Wind': 'Versengen',
        'Slipstream': 'Wirbelströmung',
        'Summon Random Primal': 'Zufällige Primaebeschwörung',
        'Tank Purge': 'Tankreinigung',
        'Tumult': 'Urerschütterung',
        'Ultima(?!\\w)': 'Ultima',
        'Ultimate Annihilation': 'Ultimative Vernichtung',
        'Ultimate Predation': 'Ultimative Prädation',
        'Ultimate Suppression': 'Ultimative Unterdrückung',
        'Upheaval': 'Urtrauma',
        'Viscous Aetheroplasm': 'Viskoses Ätheroplasma',
        'Vulcan Burst': 'Feuerstoß',
        'Weight Of The Land': 'Gaias Gewicht',
        'Wicked Tornado': 'Tornado der Bosheit',
        'Wicked Wheel': 'Rad der Bosheit',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb Boulder': 'bombo rocher',
        'Chirada': 'Chirada',
        'Garuda': 'Garuda',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': 'Je vais vous écorcher avec mes bourrasques',
        'Ifrit': 'Ifrit',
        'Lahabrea': 'Lahabrea',
        'Spiny Plume': 'plume perforante',
        'Suparna': 'Suparna',
        'The Ultima Weapon': 'Ultima Arma',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Aerial Blast': 'Rafale aérienne',
        'Aetheric Boom': 'Onde d\'éther',
        'Aetherochemical Laser': 'Laser magismologique',
        '(?<! )Aetheroplasm': 'Éthéroplasma',
        'Apply Viscous': 'Debuff Éthéroplasma',
        'Blight': 'Supplice',
        'Bury': 'Impact',
        'Ceruleum Vent': 'Exutoire à Céruleum',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Dark IV': 'Giga Ténèbres',
        'Diffractive Laser': 'Laser diffractif',
        'Downburst': 'Rafale descendante',
        'Earthen Fury': 'Fureur tellurique',
        'Eruption': 'Éruption',
        'Eye Of The Storm': 'Œil du cyclone',
        'Feather Rain': 'Pluie de plumes',
        'Flaming Crush': 'Fracas de flammes',
        'Freefire': 'Tir d\'artillerie lourde',
        'Friction': 'Lame de vent',
        'Geocrush': 'Broie-terre',
        'Great Whirlwind': 'Grand tourbillon',
        'Hellfire': 'Flammes de l\'enfer',
        'Homing Lasers': 'Lasers autoguidés',
        'Incinerate': 'Incinération',
        'Infernal Fetters': 'Chaînes infernales',
        'Inferno Howl': 'Rugissement infernal',
        'Landslide': 'Glissement de terrain',
        'Mesohigh': 'Anticyclone de méso-échelle',
        'Mistral Shriek': 'Cri du mistral',
        'Mistral Song': 'Chant du mistral',
        'Mountain Buster': 'Casse-montagnes',
        'Nail Adds': 'Adds Clou',
        'Radiant Plume': 'Panache radiant',
        'Rock Buster': 'Casse-roc',
        'Rock Throw': 'Jeté de rocs',
        'Searing Wind': 'Carbonisation',
        'Slipstream': 'Sillage',
        'Summon Random Primal': 'Invocation de primordial aléatoire',
        'Tank Purge': 'Vidange de réservoir',
        'Tumult': 'Tumulte',
        'Ultima(?!\\w)': 'Ultima',
        'Ultimate Annihilation': 'Fantasmagorie infernale',
        'Ultimate Predation': 'Fantasmagorie prédatrice',
        'Ultimate Suppression': 'Fantasmagorie bestiale',
        'Upheaval': 'Bouleversement',
        'Viscous Aetheroplasm': 'Éthéroplasma poisseux',
        'Vulcan Burst': 'Explosion volcanique',
        'Weight Of The Land': 'Poids de la terre',
        'Wicked Tornado': 'Tornade meurtrière',
        'Wicked Wheel': 'Roue mauvaise',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Chirada': 'チラーダ',
        'Garuda': 'ガルーダ',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': 'はじめようぞ、虫ケラ…… .わたくしの風でッ！　嵐でッ！　無残に散れッ！',
        'Ifrit': 'イフリート',
        'Lahabrea': 'アシエン・ラハブレア',
        'Spiny Plume': 'スパイニープルーム',
        'Suparna': 'スパルナ',
        'The Ultima Weapon': 'アルテマウェポン',
        'Titan': 'タイタン',
      },
      'replaceText': {
        'Aerial Blast': 'エリアルブラスト',
        'Aetheric Boom': 'エーテル波動',
        'Aetherochemical Laser': '魔科学レーザー',
        '(?<! )Aetheroplasm': 'エーテル爆雷',
        'Apply Viscous': '吸着式エーテル爆雷',
        'Blight': 'クラウダ',
        'Bury': '衝撃',
        'Ceruleum Vent': 'セルレアムベント',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Dark IV': 'ダージャ',
        'Diffractive Laser': '拡散レーザー',
        'Downburst': 'ダウンバースト',
        'Earthen Fury': '大地の怒り',
        'Eruption': 'エラプション',
        'Eye Of The Storm': 'アイ・オブ・ストーム',
        'Feather Rain': 'フェザーレイン',
        'Flaming Crush': 'フレイムクラッシュ',
        'Freefire': '誘爆',
        'Friction': 'ウィンドブレード',
        'Geocrush': 'ジオクラッシュ',
        'Great Whirlwind': '大旋風', // FIXME
        'Hellfire': '地獄の火炎',
        'Homing Lasers': '誘導レーザー',
        'Incinerate': 'インシネレート',
        'Infernal Fetters': '炎獄の鎖',
        'Inferno Howl': '灼熱の咆吼',
        'Landslide': 'ランドスライド',
        'Mesohigh': 'メソハイ',
        'Mistral Shriek': 'ミストラルシュリーク',
        'Mistral Song': 'ミストラルソング',
        'Mountain Buster': 'マウンテンバスター',
        'Nail Adds': '雑魚: 楔',
        'Radiant Plume': '光輝の炎柱',
        'Rock Buster': 'ロックバスター',
        'Rock Throw': 'グラナイト・ジェイル',
        'Searing Wind': '熱風',
        'Slipstream': 'スリップストリーム',
        'Summon Random Primal': 'ランダム蛮神を召喚',
        'Tank Purge': '魔導フレア',
        'Tumult': '激震',
        'Ultima(?!\\w)': 'アルテマ',
        'Ultimate Annihilation': '爆撃の究極幻想',
        'Ultimate Predation': '追撃の究極幻想',
        'Ultimate Suppression': '乱撃の究極幻想',
        'Upheaval': '大激震',
        'Viscous Aetheroplasm': '吸着爆雷起爆',
        'Vulcan Burst': 'バルカンバースト',
        'Weight Of The Land': '大地の重み',
        'Wicked Tornado': 'ウィケッドトルネード',
        'Wicked Wheel': 'ウィケッドホイール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb Boulder': '爆破岩石',
        'Chirada': '妙翅',
        'Garuda': '迦楼罗',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': '哈哈哈哈哈！\\s*你们这些蝼蚁只有被我的狂风吹散的下场！',
        'Ifrit': '伊弗利特',
        'Lahabrea': '拉哈布雷亚',
        'Spiny Plume': '刺羽',
        'Suparna': '美翼',
        'The Ultima Weapon': '究极神兵',
        'Titan': '泰坦',
      },
      'replaceText': {
        'Aerial Blast': '大气爆发',
        'Aetheric Boom': '以太波动',
        'Aetherochemical Laser': '魔科学激光',
        '(?<! )Aetheroplasm': '以太爆雷',
        'Apply Viscous': '吸附式炸弹',
        'Blight': '毒雾',
        'Bury': '塌方',
        'Ceruleum Vent': '青磷放射',
        'Crimson Cyclone': '深红旋风',
        'Dark IV': '冥暗',
        'Diffractive Laser': '扩散射线',
        'Downburst': '下行突风',
        'Earthen Fury': '大地之怒',
        'Eruption': '地火喷发',
        'Eye Of The Storm': '台风眼',
        'Feather Rain': '飞翎雨',
        'Flaming Crush': '烈焰碎击',
        'Freefire': '诱导爆炸',
        'Friction': '烈风刃',
        'Geocrush': '大地粉碎',
        'Great Whirlwind': '大龙卷风',
        'Hellfire': '地狱之火炎',
        'Homing Lasers': '诱导射线',
        'Incinerate': '烈焰焚烧',
        'Infernal Fetters': '火狱之锁',
        'Inferno Howl': '灼热咆哮',
        'Landslide': '地裂',
        'Mesohigh': '中高压',
        'Mistral Shriek': '寒风之啸',
        'Mistral Song': '寒风之歌',
        'Mountain Buster': '山崩',
        'Nail Adds': '火神柱',
        'Radiant Plume': '光辉炎柱',
        'Rock Buster': '碎岩',
        'Rock Throw': '花岗岩牢狱',
        'Searing Wind': '灼热',
        'Slipstream': '螺旋气流',
        'Summon Random Primal': '召唤随机蛮神',
        'Tank Purge': '魔导核爆',
        'Tumult': '怒震',
        'Ultima(?!\\w)': '究极',
        'Ultimate Annihilation': '爆击之究极幻想',
        'Ultimate Predation': '追击之究极幻想',
        'Ultimate Suppression': '乱击之究极幻想',
        'Upheaval': '大怒震',
        'Viscous Aetheroplasm': '引爆吸附式炸弹',
        'Vulcan Burst': '火神爆裂',
        'Weight Of The Land': '大地之重',
        'Wicked Tornado': '邪气龙卷',
        'Wicked Wheel': '邪轮旋风',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Chirada': '치라다',
        'Garuda': '가루다',
        'Heehee HAHA hahaha HEEHEE haha HEEEEEE': '시작하자, 버러지들아',
        'Ifrit': '이프리트',
        'Lahabrea': '아씨엔 라하브레아',
        'Spiny Plume': '가시돋힌 깃털',
        'Suparna': '수파르나',
        'The Ultima Weapon': '알테마 웨폰',
        'Titan': '타이탄',
      },
      'replaceText': {
        'Aerial Blast': '대기 폭발',
        'Aetheric Boom': '에테르 파동',
        'Aetherochemical Laser': '마과학 레이저',
        '(?<! )Aetheroplasm': '에테르 폭뢰',
        'Apply Viscous': '흡착식 에테르 폭뢰',
        'Blight': '독안개',
        'Bury': '충격',
        'Ceruleum Vent': '청린 방출',
        'Crimson Cyclone': '진홍 회오리',
        'Dark IV': '다쟈',
        'Diffractive Laser': '확산 레이저',
        'Downburst': '하강 기류',
        'Earthen Fury': '대지의 분노',
        'Eruption': '용암 분출',
        'Eye Of The Storm': '태풍의 눈',
        'Feather Rain': '깃털비',
        'Flaming Crush': '화염 작열',
        'Freefire': '유폭',
        'Friction': '바람의 칼날',
        'Geocrush': '대지 붕괴',
        'Great Whirlwind': '대선풍',
        'Hellfire': '지옥의 화염',
        'Homing Lasers': '유도 레이저',
        'Incinerate': '소각',
        'Infernal Fetters': '염옥의 사슬',
        'Inferno Howl': '작열의 포효',
        'Landslide': '산사태',
        'Mesohigh': '뇌우고기압',
        'Mistral Shriek': '삭풍의 비명',
        'Mistral Song': '삭풍의 노래',
        'Mountain Buster': '산 쪼개기',
        'Nail Adds': '염옥의 말뚝',
        'Radiant Plume': '광휘의 불기둥',
        'Rock Buster': '바위 쪼개기',
        'Rock Throw': '화강암 감옥',
        'Searing Wind': '열풍',
        'Slipstream': '반동 기류',
        'Summon Random Primal': '무작위 야만신 소환',
        'Tank Purge': '마도 플레어',
        'Tumult': '격진',
        'Ultima(?!\\w)': '알테마',
        'Ultimate Annihilation': '궁극의 폭격 환상',
        'Ultimate Predation': '궁극의 추격 환상',
        'Ultimate Suppression': '궁극의 난격 환상',
        'Upheaval': '대격진',
        'Viscous Aetheroplasm': '흡착 폭뢰 기폭',
        'Vulcan Burst': '폭렬 난사',
        'Weight Of The Land': '대지의 무게',
        'Wicked Tornado': '마녀의 회오리',
        'Wicked Wheel': '마녀의 수레바퀴',
      },
    },
  ],
};

export default triggerSet;
