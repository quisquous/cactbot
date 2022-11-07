import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: The second middle/sides laser after Astral Eclipse should be
// called only after the first goes off.

export interface Data extends RaidbossData {
  activeSigils: { x: number; y: number; typeId: string; npcId: string }[];
  activeFrontSigils: { x: number; y: number; typeId: string; npcId: string }[];
  paradeigmaCounter: number;
  seenAdikia: boolean;
  styxCount: number;
  eclipseFlags: string[];
  eclipseExplosionCount: number;
}

const sigil = {
  greenBeam: '67E4',
  redBox: '67E5',
  blueCone: '67E6',
} as const;

const fetchCombatantsById = async (id: string[]) => {
  const decIds = [];
  for (const i of id)
    decIds.push(parseInt(i, 16));
  const callData = await callOverlayHandler({
    call: 'getCombatants',
    ids: decIds,
  });
  return callData.combatants;
};

const eclipseOutputStrings = {
  north: Outputs.north,
  northeast: Outputs.northeast,
  east: Outputs.east,
  southeast: Outputs.southeast,
  south: Outputs.south,
  southwest: Outputs.southwest,
  west: Outputs.west,
  northwest: Outputs.northwest,
  middle: Outputs.middle,
  unknown: Outputs.unknown,
} as const;

// Because there are only six patterns, the third eclipse can be uniquely
// determined by the first two.
const getThirdEclipse = (flag1: string, flag2: string): string | undefined => {
  const finalPattern: { [concatFlags: string]: string } = {
    '00020001,00200010': '00800040',
    '10000800,00800040': '00020001',
    '00020001,10000800': '00200010',
    '10000800,00200010': '00800040',
    '00200010,10000800': '00800040',
    '00200010,00800040': '00020001',
  };
  return finalPattern[`${flag1},${flag2}`];
};

const eclipseOutput = (idx: number, flags?: string): keyof typeof eclipseOutputStrings => {
  // Astral Eclipse reference: https://twitter.com/xiv_stats/status/1469852444116996096

  // pattern 1: W, mid, NE  (00020001, 00200010, 00800040)
  // pattern 2: NW, W, N    (10000800, 00800040, 00020001)
  // pattern 3: W, N, mid   (00020001, 10000800, 00200010)
  // pattern 4: NW, mid, NE (10000800, 00200010, 00800040)
  // pattern 5: NW, N, NE   (00200010, 10000800, 00800040)
  // pattern 6: NW, W, N    (00200010, 00800040, 00020001)

  // Note: it's likely that these flags are a bit pattern of the two holes, so we could
  // solve this in some general sense, but you'd also have to rotate them all based
  // on perspective etc etc.  Since there's only six patterns, we'll hardcode.

  if (flags === undefined)
    return 'unknown';

  if (idx === 0) {
    return flags === '00020001' ? 'west' : 'northwest';
  } else if (idx === 1) {
    if (flags === '00200010')
      return 'middle';
    else if (flags === '10000800')
      return 'north';
    return 'west';
  } else if (idx === 2) {
    if (flags === '00200010')
      return 'middle';
    else if (flags === '00020001')
      return 'north';
    return 'northeast';
  }

  return 'unknown';
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  timelineFile: 'zodiark-ex.txt',
  initData: () => ({
    activeSigils: [],
    activeFrontSigils: [],
    paradeigmaCounter: 0,
    seenAdikia: false,
    styxCount: 6,
    eclipseFlags: [],
    eclipseExplosionCount: 0,
  }),
  triggers: [
    {
      id: 'ZodiarkEx Ania',
      type: 'StartsUsing',
      netRegex: { id: '6B63', source: 'Zodiark' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'ZodiarkEx Kokytos',
      type: 'StartsUsing',
      netRegex: { id: '6C60', source: 'Zodiark', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'ZodiarkEx Paradeigma',
      type: 'Ability',
      netRegex: { id: '67BF', source: 'Zodiark', capture: false },
      alertText: (data, _matches, output) => {
        ++data.paradeigmaCounter;
        if (data.paradeigmaCounter === 1)
          return output.underQuetz!();
      },
      outputStrings: {
        underQuetz: {
          en: 'Under NW Quetzalcoatl',
          de: 'Unter NW Quetzalcoatl',
          ja: '北東の鳥の下',
          cn: '站在左上 (西北) 鸟',
          ko: '북동쪽 새 밑으로', // This is northeast. Because Korean folks go there.
        },
      },
    },
    {
      id: 'ZodiarkEx Styx',
      type: 'StartsUsing',
      netRegex: { id: '67F3', source: 'Zodiark', capture: false },
      alertText: (data, _matches, output) => output.text!({ num: data.styxCount }),
      run: (data) => data.styxCount = Math.min(data.styxCount + 1, 9),
      outputStrings: {
        text: {
          en: 'Stack x${num}',
          de: 'Sammeln x${num}',
          ja: '頭割り x${num}',
          cn: '${num}次分摊',
          ko: '쉐어 ${num}번',
        },
      },
    },
    {
      id: 'ZodiarkEx Arcane Sigil End',
      type: 'Ability',
      netRegex: { id: [sigil.greenBeam, sigil.redBox, sigil.blueCone], source: 'Arcane Sigil' },
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activeSigils.length; ++i) {
          const sig = data.activeSigils[i];
          if (sig?.npcId === matches.sourceId)
            data.activeSigils.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Blue Cone Tether',
      type: 'Tether',
      netRegex: { id: '00A4', source: 'Zodiark' },
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsById([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID)
            data.activeSigils.push({
              x: actor.PosX,
              y: actor.PosY,
              typeId: sigil.blueCone,
              npcId: actor.ID.toString(16).toUpperCase(),
            });
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Blue Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.westCone!();

        if (target.x > 100)
          return output.eastCone!();

        if (target.y < 100)
          return output.northCone!();
        return output.southCone!();
      },
      outputStrings: {
        northCone: {
          en: 'North Cone',
          de: 'Nördliche Kegel-AoE',
          ja: '北のさんかく',
          cn: '上 (北) 扇形',
          ko: '북쪽 삼각형',
        },
        eastCone: {
          en: 'East Cone',
          de: 'Östliche Kegel-AoE',
          ja: '東のさんかく',
          cn: '右 (东) 扇形',
          ko: '동쪽 삼각형',
        },
        westCone: {
          en: 'West Cone',
          de: 'Westliche Kegel-AoE',
          ja: '西のさんかく',
          cn: '左 (西) 扇形',
          ko: '서쪽 삼각형',
        },
        southCone: {
          en: 'South Cone',
          de: 'Südliche Kegel-AoE',
          ja: '南のさんかく',
          cn: '下 (南) 扇形',
          ko: '남쪽 삼각형',
        },
      },
    },
    {
      id: 'ZodiarkEx Red Box Tether',
      type: 'Tether',
      netRegex: { id: '00AB', source: 'Zodiark' },
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsById([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID)
            data.activeSigils.push({
              x: actor.PosX,
              y: actor.PosY,
              typeId: sigil.redBox,
              npcId: actor.ID.toString(16).toUpperCase(),
            });
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Red Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.east!();

        if (target.x > 100)
          return output.west!();

        if (target.y < 100)
          return output.south!();
        return output.north!();
      },
      outputStrings: {
        north: Outputs.north,
        west: Outputs.west,
        south: Outputs.south,
        east: Outputs.east,
      },
    },
    {
      id: 'ZodiarkEx Roiling Darkness Spawn',
      type: 'AddedCombatant',
      netRegex: { name: 'Roiling Darkness', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: Outputs.killAdds.en + '(back first)',
          de: Outputs.killAdds.de + '(hinten zuerst)',
          ja: Outputs.killAdds.ja + '(下の雑魚から)',
          cn: Outputs.killAdds.cn + '(先打后方的)',
          ko: Outputs.killAdds.ko + '(아래쪽 먼저)',
        },
      },
    },
    {
      id: 'ZodiarkEx Arcane Sigil Start',
      type: 'StartsUsing',
      netRegex: { id: [sigil.greenBeam, sigil.redBox, sigil.blueCone], source: 'Arcane Sigil' },
      run: (data, matches, _output) => {
        if (parseFloat(matches.y) < 100)
          data.activeFrontSigils.push({
            x: parseFloat(matches.x),
            y: parseFloat(matches.y),
            typeId: matches.id,
            npcId: matches.sourceId,
          });
      },
    },
    {
      id: 'ZodiarkEx Arcane Sigil',
      type: 'StartsUsing',
      netRegex: {
        id: [sigil.greenBeam, sigil.redBox, sigil.blueCone],
        source: 'Arcane Sigil',
        capture: false,
      },
      delaySeconds: 0.2,
      suppressSeconds: 0.5,
      alertText: (data, _matches, output) => {
        const activeFrontSigils = data.activeFrontSigils;
        data.activeFrontSigils = [];
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === sigil.greenBeam)
          return output.sides!();
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === sigil.redBox)
          return output.south!();
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === sigil.blueCone)
          return output.north!();
        if (
          activeFrontSigils.length === 2 && activeFrontSigils[0]?.typeId === sigil.greenBeam &&
          activeFrontSigils[1]?.typeId === sigil.greenBeam
        )
          return output.middle!();
        if (activeFrontSigils.length === 3) {
          for (const sig of activeFrontSigils) {
            // Find the middle sigil
            if (sig.x > 90 && sig.x < 110) {
              if (sig.typeId === sigil.greenBeam)
                return output.frontsides!();
              if (sig.typeId === sigil.redBox)
                return output.backmiddle!();
              if (sig.typeId === sigil.blueCone)
                return output.frontmiddle!();
            }
          }
        }
      },
      outputStrings: {
        south: Outputs.south,
        north: Outputs.north,
        frontsides: {
          en: 'front sides',
          de: 'Vorne Seiten',
          ja: '前の横側',
          cn: '前方两边',
          ko: '앞쪽 양옆',
        },
        backmiddle: {
          en: 'back middle',
          de: 'Hinten Mitte',
          ja: '後ろの真ん中',
          cn: '后方中间',
          ko: '뒤쪽 중앙',
        },
        frontmiddle: {
          en: 'front middle',
          de: 'Vorne Mitte',
          cn: '前方中间',
          ko: '앞쪽 중앙',
        },
        sides: {
          // Specify "for laser" to disambiguate with the astral eclipse going on at the same time.
          // Similarly, there's a algodon knockback call too.
          en: 'sides (for laser)',
          de: 'Seiten (für die Laser)',
          ja: '横側 (レーザー回避)',
          cn: '两边 (躲避激光)',
          ko: '양옆 (레이저 피하기)',
        },
        middle: {
          en: 'middle (for laser)',
          de: 'Mitte (für die Laser)',
          ja: '真ん中 (レーザー回避)',
          cn: '中间 (躲避激光)',
          ko: '중앙 (레이저 피하기)',
        },
      },
    },
    {
      // 67EC is leaning left, 67ED is leaning right
      id: 'ZodiarkEx Algedon',
      type: 'StartsUsing',
      netRegex: { id: ['67EC', '67ED'], source: 'Zodiark' },
      alertText: (_data, matches, output) => {
        if (matches.id === '67EC') {
          // NE/SW
          return output.combo!({ first: output.northeast!(), second: output.southwest!() });
        }
        if (matches.id === '67ED') {
          // NW/SE
          return output.combo!({ first: output.northwest!(), second: output.southeast!() });
        }
      },
      outputStrings: {
        northeast: Outputs.dirNE,
        northwest: Outputs.dirNW,
        southeast: Outputs.dirSE,
        southwest: Outputs.dirSW,
        combo: {
          en: 'Go ${first} / ${second} (knockback)',
          de: 'Geh ${first} / ${second} (Rückstoß)',
          ja: '${first} / ${second} (ノックバック)',
          cn: '去 ${first} / ${second} (击退)',
          ko: '${first} / ${second} (넉백)',
        },
      },
    },
    {
      id: 'ZodiarkEx Adikia',
      type: 'StartsUsing',
      netRegex: { id: '63A9', source: 'Zodiark', capture: false },
      alertText: (data, _matches, output) => {
        return data.seenAdikia ? output.adikia2!() : output.adikia1!();
      },
      run: (data) => data.seenAdikia = true,
      outputStrings: {
        adikia1: {
          en: 'Double fists (look for pythons)',
          de: 'Doppel-Fäuste (halt Ausschau nach den Pythons)',
          ja: 'ダブルフィスト (ヘビー確認)',
          cn: '双拳 (找蛇)',
          ko: '양 옆 큰 원형 장판 (뱀 위치 확인)',
        },
        adikia2: {
          en: 'Double fists',
          de: 'Doppel-Fäuste',
          ja: 'ダブルフィスト',
          cn: '双拳',
          ko: '양 옆 큰 원형 장판',
        },
      },
    },
    {
      id: 'ZodiarkEx Phobos',
      type: 'StartsUsing',
      netRegex: { id: '67F0', source: 'Zodiark', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heavy DoT',
          de: 'Starker DoT',
          ja: '痛いDOT',
          cn: '超痛流血AOE',
          ko: '아픈 도트딜',
        },
      },
    },
    {
      id: 'ZodiarkEx Astral Eclipse Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '67C3', source: 'Zodiark', capture: false },
      run: (data) => {
        data.eclipseFlags = [];
        data.eclipseExplosionCount = 0;
      },
    },
    {
      id: 'ZodiarkEx Astral Eclipse Collect',
      type: 'MapEffect',
      // Note: there are more lines with these during the explosions, so ignore them.
      // It's unclear what the flags are doing for those lines.
      netRegex: { location: '0[678]' },
      run: (data, matches) => {
        if (data.eclipseFlags.length === 0) {
          data.eclipseFlags.push(matches.flags);
        } else if (data.eclipseFlags.length === 1) {
          const second = matches.flags;
          data.eclipseFlags.push(second);

          const first = data.eclipseFlags[0];
          if (first === undefined)
            return;
          // The third mark can be uniquely determined by the first two, so just call it.
          const third = getThirdEclipse(first, second);
          if (third !== undefined)
            data.eclipseFlags.push(third);
        }
      },
    },
    {
      id: 'ZodiarkEx Astral Eclipse Initial',
      type: 'MapEffect',
      netRegex: { location: '0[678]', capture: false },
      suppressSeconds: 30,
      alertText: (data, _matches, output) => {
        return output[eclipseOutput(0, data.eclipseFlags[0])]!();
      },
      outputStrings: eclipseOutputStrings,
    },
    {
      id: 'ZodiarkEx Astral Eclipse Instructions',
      type: 'MapEffect',
      netRegex: { location: '0[678]', capture: false },
      condition: (data) => data.eclipseFlags.length === 3,
      durationSeconds: 19,
      suppressSeconds: 30,
      infoText: (data, _matches, output) => {
        const dir1 = output[eclipseOutput(0, data.eclipseFlags[0])]!();
        const dir2 = output[eclipseOutput(1, data.eclipseFlags[1])]!();
        const dir3 = output[eclipseOutput(2, data.eclipseFlags[2])]!();
        return output.combo!({ dir1: dir1, dir2: dir2, dir3: dir3 });
      },
      outputStrings: {
        combo: {
          en: '${dir1} > ${dir2} > ${dir3}',
        },
        ...eclipseOutputStrings,
      },
    },
    {
      id: 'ZodiarkEx Astral Eclipse Step',
      type: 'Ability',
      netRegex: { id: '67E7', source: 'Zodiark', capture: false },
      suppressSeconds: 2,
      alertText: (data, _matches, output) => {
        data.eclipseExplosionCount++;
        if (data.eclipseExplosionCount >= 3)
          return;
        const flags = data.eclipseFlags[data.eclipseExplosionCount];
        return output[eclipseOutput(data.eclipseExplosionCount, flags)]!();
      },
      outputStrings: eclipseOutputStrings,
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Esoteric Dyad/Esoteric Sect': 'Esoteric Dyad/Sect',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Arcane Sigil': 'Geheimzeichen',
        'Behemoth': 'Behemoth',
        'Quetzalcoatl': 'Quetzalcoatl',
        'Roiling Darkness': 'Strom der Dunkelheit',
        'Zodiark': 'Zodiark',
        'python': 'Python',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Apomnemoneumata': 'Apomnemoneumata',
        'Astral Eclipse': 'Astraleklipse',
        'Astral Flow': 'Lichtstrom',
        'Esoteric Dyad': 'Esoterische Dyade',
        'Esoteric Pattern': 'Esoteric Muster',
        '(?<!Triple )Esoteric Ray': 'Esoterischer Strahl',
        'Esoteric Sect': 'Esoterische Sekte',
        'Esoterikos': 'Esoterikos',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Infernal Stream': 'Infernostrom',
        'Infernal Torrent': 'Infernaler Strom',
        'Keraunos Eidolon': 'Keraunos',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlegethon',
        'Phobos': 'Phobos',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Esoterischer Dreierstrahl',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arcane Sigil': 'emblème secret',
        'Behemoth': 'béhémoth',
        'Quetzalcoatl': 'Quetzalcóatl',
        'Roiling Darkness': 'orbe des Ténèbres',
        'Zodiark': 'Zordiarche',
        'python': 'Python',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Apomnemoneumata': 'Apomnemoneumata',
        'Astral Eclipse': 'Éclipse astrale',
        'Astral Flow': 'Flux astral',
        'Esoteric Dyad(?!/)': 'Dyade ésotérique',
        'Esoteric Dyad/Esoteric Sect': 'Dyade/Cabale ésotérique',
        '(?<!Triple )Esoteric Ray': 'Rayon ésotérique',
        '(?<!/)Esoteric Sect': 'Cabale ésotérique',
        'Esoteric Pattern': 'Schéma ésotérique',
        'Esoterikos': 'Esoterikos',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Infernal Stream': 'Courant infernal',
        'Infernal Torrent': 'Torrent infernal',
        'Keraunos Eidolon': 'Keraunos',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlégéthon',
        'Phobos': 'Phobos',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Rayon ésotérique triple',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arcane Sigil': '秘紋',
        'Behemoth': 'ベヒーモス',
        'Quetzalcoatl': 'ケツァクウァトル',
        'Roiling Darkness': '闇の奔流',
        'Zodiark': 'ゾディアーク',
        'python': 'ピュトン',
      },
      'replaceText': {
        'Adikia': 'アディキア',
        'Algedon': 'アルゲドン',
        'Ania': 'アニア',
        'Apomnemoneumata': 'アポムネーモネウマタ',
        'Astral Eclipse': 'アストラルエクリプス',
        'Astral Flow': 'アストラルフロウ',
        'Esoteric Dyad': 'エソテリックダイアド',
        'Esoteric Pattern': '秘紋図形',
        '(?<!Triple )Esoteric Ray': 'エソテリックレイ',
        'Esoteric Sect': 'エソテリックセクト',
        'Esoterikos': 'エソーテリコス',
        '(?<!Trimorphos )Exoterikos': 'エクソーテリコス',
        'Explosion': '爆発',
        'Infernal Stream': 'インフェルノストリーム',
        'Infernal Torrent': 'インフェルノトレント',
        'Keraunos Eidolon': 'ケラノウス・エイドロン',
        'Kokytos': 'コキュートス',
        'Meteoros Eidolon': 'メテオロス・エイドロン',
        'Opheos Eidolon': 'オフェオス・エイドロン',
        'Paradeigma': 'パラデイグマ',
        'Phlegethon': 'プレゲトン',
        'Phobos': 'フォボス',
        'Styx': 'ステュクス',
        'Trimorphos Exoterikos': 'トライ・エクソーテリコス',
        'Triple Esoteric Ray': 'トライ・エソテリックレイ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Arcane Sigil': '秘纹',
        'Behemoth': '贝希摩斯',
        'Quetzalcoatl': '克察尔科亚特尔',
        'Roiling Darkness': '黑暗奔流',
        'Zodiark': '佐迪亚克',
        'python': '大蟒',
      },
      'replaceText': {
        'Adikia': '不义',
        'Algedon': '痛苦',
        'Ania': '悲伤',
        'Apomnemoneumata': '悼念',
        'Astral Eclipse': '星蚀',
        'Astral Flow': '星极超流',
        'Esoteric Dyad': '神秘二分',
        'Esoteric Pattern': '秘纹图案',
        '(?<!Triple )Esoteric Ray': '神秘光线',
        'Esoteric Sect': '神秘切割',
        'Esoterikos': '内纹',
        '(?<!Trimorphos )Exoterikos': '外纹',
        'Explosion': '爆炸',
        'Infernal Stream': '狱火奔流',
        'Infernal Torrent': '狱火洪流',
        'Keraunos Eidolon': '雷霆幻影',
        'Kokytos': '悲痛',
        'Meteoros Eidolon': '陨石幻影',
        'Opheos Eidolon': '巨蛇幻影',
        'Paradeigma': '范式',
        'Phlegethon': '冥火',
        'Phobos': '恐惧',
        'Styx': '仇恨',
        'Trimorphos Exoterikos': '三重外纹',
        'Triple Esoteric Ray': '三重神秘光线',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Arcane Sigil': '비문',
        'Behemoth': '베히모스',
        'Quetzalcoatl': '케찰코아틀',
        'Roiling Darkness': '어둠의 급류',
        'Zodiark': '조디아크',
        'python': '퓌톤',
      },
      'replaceText': {
        'Adikia': '불의',
        'Algedon': '아픔',
        'Ania': '핍박',
        'Apomnemoneumata': '기억들',
        'Astral Eclipse': '별들의 식',
        'Astral Flow': '천상의 흐름',
        'Esoteric Dyad(?!/)': '내밀한 양면',
        'Esoteric Dyad/Esoteric Sect': '내밀한 양면/종파',
        '(?<!/)Esoteric Sect': '내밀한 종파',
        'Esoteric Pattern': '내밀한 양면/종파/광선',
        'Esoterikos': '에소테리코스',
        'Explosion': '폭산',
        'Infernal Stream': '지옥불 흐름',
        'Infernal Torrent': '지옥불 급류',
        'Keraunos Eidolon': '허깨비 낙뢰',
        'Kokytos': '코퀴토스',
        'Meteoros Eidolon': '허깨비 운석',
        'Opheos Eidolon': '허깨비 뱀',
        'Paradeigma': '시범',
        'Phlegethon': '플레게톤',
        'Phobos': '포보스',
        'Styx': '스틱스',
        'Trimorphos Exoterikos': '삼중 엑소테리코스',
        'Triple Esoteric Ray': '내밀한 삼중 광선',
        '(?<!Triple )Esoteric Ray': '내밀한 광선',
        '(?<!Trimorphos )Exoterikos': '엑소테리코스',
      },
    },
  ],
};

export default triggerSet;
