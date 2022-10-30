import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  tentacleEffects: NetMatches['MapEffect'][];
}

export type Cardinal = 'N' | 'E' | 'S' | 'W';
export type Intercard = 'NW' | 'NE' | 'SE' | 'SW';
export const tentacleFlags = ['00080004', '00200004', '00800004', '02000004'];

// flags are reused between both tentacles, but the final spot where the tentacle lands
// is different for the cyan & scarlet tentacles
const cyanTentacleLocations: { [flags: string]: Cardinal } = {
  '00080004': 'S',
  '00200004': 'W',
  '00800004': 'N',
  '02000004': 'E',
};
const scarletTentacleLocations: { [flags: string]: Intercard } = {
  '00080004': 'NW',
  '00200004': 'NE',
  '00800004': 'SE',
  '02000004': 'SW',
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlzadaalsLegacy,
  timelineFile: 'alzadaals_legacy.txt',
  initData: () => {
    return {
      tentacleEffects: [],
    };
  },
  triggers: [
    {
      id: 'Alzadaal Big Wave',
      type: 'StartsUsing',
      netRegex: { id: '6F60', source: 'Ambujam', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Tentacle Dig Collect',
      type: 'MapEffect',
      netRegex: { flags: tentacleFlags },
      run: (data, matches) => data.tentacleEffects.push(matches),
    },
    {
      id: 'Alzadaal Tentacle Dig Single',
      type: 'Ability',
      netRegex: { id: '6F55', source: 'Ambujam', capture: false },
      delaySeconds: 2.3,
      infoText: (data, _matches, output) => {
        // only one tentacle (scarlet) for the first use of Tentacle Dig
        if (data.tentacleEffects.length !== 1)
          return output.default!();

        const safeMap: { [key in Intercard]: Intercard } = {
          NW: 'SE',
          NE: 'SW',
          SE: 'NW',
          SW: 'NE',
        };

        const tentacleFlag = data.tentacleEffects[0]?.flags;
        if (tentacleFlag === undefined)
          return output.default!();
        const tentacleLocation = scarletTentacleLocations[tentacleFlag];
        if (tentacleLocation === undefined)
          return output.default!();
        const safeDir = safeMap[tentacleLocation];
        if (safeDir === undefined)
          return output.default!();
        return output.safe!({ dir1: output[safeDir]!() });
      },
      run: (data) => data.tentacleEffects = [],
      outputStrings: {
        NW: Outputs.dirNW,
        NE: Outputs.dirNE,
        SE: Outputs.dirSE,
        SW: Outputs.dirSW,
        safe: {
          en: 'Go ${dir1}',
        },
        default: {
          en: 'Avoid tentacle explosions',
          de: 'Weiche Tentakel-Explosion aus',
          fr: 'Évitez les explostions des tentacules',
          ja: '触手の爆発から離れる',
          cn: '躲避触手爆炸',
          ko: '문어다리가 멈춘 곳 멀리 피하기',
        },
      },
    },
    {
      id: 'Alzadaal Tentacle Dig Multiple',
      type: 'Ability',
      netRegex: { id: '6F59', source: 'Ambujam', capture: false },
      delaySeconds: 2.3,
      infoText: (data, _matches, output) => {
        // both tentacles for 2nd and all subsequent uses of Tentacle Dig
        if (data.tentacleEffects.length !== 2)
          return output.default!();

        // cyan tentacle ends on cardinal, and scarlet tentacle ends on intercard opposite cyan
        // safe wedge runs from the cardinal adjacent to through the unoccupied intercard opposite of the cyan tentacle
        const safeMap: {
          [key in Cardinal]: { [idx: string]: [safecard: Cardinal, safeintercard: Intercard] };
        } = {
          // Cyan location: {possible Scarlet locations: [safe dirs]}
          N: {
            SE: ['W', 'SW'],
            SW: ['E', 'SE'],
          },
          E: {
            NW: ['S', 'SW'],
            SW: ['N', 'NW'],
          },
          S: {
            NW: ['E', 'NE'],
            NE: ['W', 'NW'],
          },
          W: {
            NE: ['S', 'SE'],
            SE: ['N', 'NE'],
          },
        };

        let cyanLoc = undefined;
        let scarletLoc = undefined;
        // location 10 = cyan tentacle path, location 11 = scarlet tentacle path
        for (const tentacle of data.tentacleEffects) {
          if (tentacle.location === '10') {
            if (cyanTentacleLocations[tentacle.flags] !== undefined)
              cyanLoc = cyanTentacleLocations[tentacle.flags];
          } else if (tentacle.location === '11') {
            if (scarletTentacleLocations[tentacle.flags] !== undefined)
              scarletLoc = scarletTentacleLocations[tentacle.flags];
          }
        }
        if (cyanLoc === undefined || scarletLoc === undefined)
          return output.default!();
        const safeArray = safeMap[cyanLoc][scarletLoc];
        if (safeArray === undefined)
          return output.default!();
        const [safe0, safe1]: string[] = safeArray;
        return output.safe!({ dir1: output[safe0]!(), dir2: output[safe1]!() });
      },
      run: (data) => data.tentacleEffects = [],
      outputStrings: {
        N: Outputs.dirN,
        E: Outputs.dirE,
        S: Outputs.dirS,
        W: Outputs.dirW,
        NW: Outputs.dirNW,
        NE: Outputs.dirNE,
        SE: Outputs.dirSE,
        SW: Outputs.dirSW,
        safe: {
          en: 'Go ${dir1} / ${dir2}',
        },
        default: {
          en: 'Avoid tentacle explosions',
          de: 'Weiche Tentakel-Explosion aus',
          fr: 'Évitez les explostions des tentacules',
          ja: '触手の爆発から離れる',
          cn: '躲避触手爆炸',
          ko: '문어다리가 멈춘 곳 멀리 피하기',
        },
      },
    },
    {
      id: 'Alzadaal Fountain',
      type: 'StartsUsing',
      netRegex: { id: '731A', source: 'Ambujam', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dodge 3 to 1',
          de: 'Weiche von 3 auf 1 aus',
          fr: 'Esquivez de 3 vers 1',
          ja: '3から1へ',
          cn: '3穿1躲避',
          ko: '3번째에서 1번째로',
        },
      },
    },
    {
      id: 'Alzadaal Diffusion Ray',
      type: 'StartsUsing',
      netRegex: { id: '6F1E', source: 'Armored Chariot', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Rail Cannon',
      type: 'StartsUsing',
      netRegex: { id: '6F1F', source: 'Armored Chariot' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Alzadaal Articulated Bits',
      type: 'StartsUsing',
      netRegex: { id: '6F19', source: 'Armored Chariot', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid bit lasers',
          de: 'Weiche Drohnen-Laser aus',
          fr: 'Évitez les lasers',
          ja: 'レーザー回避',
          cn: '躲避浮游炮激光',
          ko: '비트가 쏘는 레이저 피하기',
        },
      },
    },
    {
      id: 'Alzadaal Graviton Cannon',
      type: 'StartsUsing',
      netRegex: { id: '7373', source: 'Armored Chariot' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      response: Responses.spread(),
    },
    {
      id: 'Alzadaal Billowing Bolts',
      type: 'StartsUsing',
      netRegex: { id: '6F70', source: 'Kapikulu', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Spin Out',
      type: 'StartsUsing',
      netRegex: { id: '6F63', source: 'Kapikulu', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Steer away from spikes',
          de: 'Weg von den Stacheln lenken',
          fr: 'Ne tournez pas dans les pics',
          ja: 'スパイクのないマスへ移動',
          cn: '躲避针刺',
          ko: '가시 피하기',
        },
      },
    },
    {
      id: 'Alzadaal Power Serge',
      type: 'StartsUsing',
      netRegex: { id: '6F6A', source: 'Kapikulu', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid tethered color',
          de: 'Weiche der verbundenen Farbe aus',
          fr: 'Allez sous la couleur non liée',
          ja: '逆の色へ',
          cn: '躲避连线颜色',
          ko: '보스가 연결한 색의 기둥 피하기',
        },
      },
    },
    {
      id: 'Alzadaal Magnitude Opus',
      type: 'HeadMarker',
      netRegex: { id: '00A1' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Alzadaal Rotary Gale',
      type: 'HeadMarker',
      netRegex: { id: '0060' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Alzadaal Crewel Slice',
      type: 'StartsUsing',
      netRegex: { id: '6F72', source: 'Kapikulu' },
      response: Responses.tankBuster(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceSync': {
        'Corrosive Venom/Toxic Shower': 'Venom/Shower',
        'Corrosive Fountain/Toxic Fountain': 'Fountain',
        'Magnitude Opus/Rotary Gale': 'Opus/Gale',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ambujam': 'Ambujam',
        'Armored Chariot': 'gepanzert(?:e|er|es|en) Chariot',
        'Armored Drudge': 'gepanzert(?:e|er|es|en) Sklave',
        'Kapikulu': 'Kapikulu',
        'Scarlet Tentacle': 'Scharlachtentakel',
        'The Threshold Of Bounty': 'Schwelle zum Reichtum',
        'The Undersea Entrance': 'Versunkene Pforte',
        'Weaver\'S Warding': 'Webers Wehr',
      },
      'replaceText': {
        'Articulated Bits': 'Satellitenarme',
        'Assail': 'Anstürmen',
        'Assault Cannon': 'Sturmkanone',
        'Basting Blade': 'Kaschmirklinge',
        'Big Wave': 'Gigantische Welle',
        'Billowing Bolts': 'Bauschende Ballen',
        'Corrosive Fountain': 'Ätzender Geysir',
        'Corrosive Venom': 'Ätzendes Gift',
        'Crewel Slice': 'Seidenschnitt',
        'Diffusion Ray': 'Diffusionsstrahl',
        'Graviton Cannon': 'Gravitonkanone',
        'Magnitude Opus': 'Magnitude Opus',
        'Mana Explosion': 'Mana-Explosion',
        'Power Serge': 'Vervliesung',
        'Rail Cannon': 'Magnetschienenkanone',
        'Rotary Gale': 'Spinnsturm',
        'Spin Out': 'Spinner',
        'Tentacle Dig': 'Tentakelgraber',
        'Toxin Shower': 'Giftsprüher',
        'Wild Weave': 'Wildes Weben',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ambujam': 'Ambujam',
        'Armored Chariot': 'char cuirassé',
        'Armored Drudge': 'esclave cuirassé',
        'Kapikulu': 'Kapikulu',
        'Scarlet Tentacle': 'tentacule pourpre',
        'The Threshold Of Bounty': 'Chambre de l\'Abondance',
        'The Undersea Entrance': 'Hall dévasté',
        'Weaver\'S Warding': 'Chambre scellée du tisserand',
      },
      'replaceText': {
        'Articulated Bits': 'Main autonome',
        'Assail': 'Ordre de couverture',
        'Assault Cannon': 'Canon d\'assaut',
        'Basting Blade': 'Lame rayonnante',
        'Big Wave': 'Lame de fond',
        'Billowing Bolts': 'Diffraction textile',
        'Corrosive Fountain': 'Jet d\'acide',
        'Corrosive Venom': 'Acidochorie',
        'Crewel Slice': 'Lame dansante',
        'Diffusion Ray': 'Rayon diffuseur',
        'Graviton Cannon': 'Canon gravitationnel',
        'Magnitude Opus': 'Craquement terrestre',
        'Mana Explosion': 'Explosion de mana',
        'Power Serge': 'Étoffes chargées',
        'Rail Cannon': 'Canon électrique',
        'Rotary Gale': 'Bourrasque tranchante',
        'Spin Out': 'Toupie mortelle',
        'Tentacle Dig': 'Tentacule enfoui',
        'Toxin Shower': 'Vénénochorie',
        'Wild Weave': 'Étoffes virevoltantes',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ambujam': 'アムブジャ',
        'Armored Chariot': 'アーマード・チャリオット',
        'Armored Drudge': 'アーマード・スレイヴ',
        'Kapikulu': 'カプクル',
        'Scarlet Tentacle': '紅の触手',
        'The Threshold Of Bounty': '豊穣の間',
        'The Undersea Entrance': '崩れかけた広間',
        'Weaver\'S Warding': '封宝の間',
      },
      'replaceText': {
        'Articulated Bits': 'ハンドビット',
        'Assail': '攻撃指示',
        'Assault Cannon': 'アサルトカノン',
        'Basting Blade': '人形剣閃',
        'Big Wave': 'ビッグウェーブ',
        'Billowing Bolts': '魔布法陣',
        'Corrosive Fountain': '酸液噴出',
        'Corrosive Venom': '酸液散布',
        'Crewel Slice': '人形剣技',
        'Diffusion Ray': 'ディフュージョンレイ',
        'Graviton Cannon': 'グラビトンキャノン',
        'Magnitude Opus': '崩土',
        'Mana Explosion': '魔力爆発',
        'Power Serge': '魔布入精',
        'Rail Cannon': 'レールキャノン',
        'Rotary Gale': '刻風',
        'Spin Out': '四方八方帯回し',
        'Tentacle Dig': '触手潜行',
        'Toxin Shower': '毒液散布',
        'Wild Weave': '魔布散開',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ambujam': '阿卜迦',
        'Armored Chariot': '装甲战车',
        'Armored Drudge': '装甲仆从',
        'Kapikulu': '门奴',
        'Scarlet Tentacle': '猩红触手',
        'The Threshold Of Bounty': '丰饶之间',
        'The Undersea Entrance': '塌陷的大厅',
        'Weaver\'S Warding': '封宝之间',
      },
      'replaceText': {
        'Articulated Bits': '手型浮游炮',
        'Assail': '攻击指示',
        'Assault Cannon': '突击加农炮',
        'Basting Blade': '人偶剑闪',
        'Big Wave': '大水波',
        'Billowing Bolts': '魔布法阵',
        'Corrosive Fountain': '喷出酸液',
        'Corrosive Venom': '泼洒酸液',
        'Crewel Slice': '人偶剑技',
        'Diffusion Ray': '扩散射线',
        'Graviton Cannon': '重力加农炮',
        'Magnitude Opus': '崩土',
        'Mana Explosion': '魔力爆炸',
        'Power Serge': '魔布附魔',
        'Rail Cannon': '轨道炮',
        'Rotary Gale': '刻风',
        'Spin Out': '缠绕抽转',
        'Tentacle Dig': '触手潜行',
        'Toxin Shower': '泼洒毒液',
        'Wild Weave': '魔布散开',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ambujam': '암부잠',
        'Armored Chariot': '무장 전차',
        'Armored Drudge': '무장 노예',
        'Kapikulu': '카프쿨루',
        'Scarlet Tentacle': '붉은 촉수',
        'The Threshold Of Bounty': '풍요의 방',
        'The Undersea Entrance': '무너진 방',
        'Weaver\'S Warding': '봉인된 보물의 방',
      },
      'replaceText': {
        'Articulated Bits': '핸드 비트',
        'Assail': '공격 지시',
        'Assault Cannon': '맹공포',
        'Basting Blade': '인형 대검',
        'Big Wave': '큰 파도',
        'Billowing Bolts': '마법천 법진',
        'Corrosive Fountain': '산액 분출',
        'Corrosive Venom': '산성액 뿌리기',
        'Crewel Slice': '인형 검기',
        'Diffusion Ray': '확산 광선',
        'Graviton Cannon': '중력자포',
        'Magnitude Opus': '붕토',
        'Mana Explosion': '마력 폭발',
        'Power Serge': '마력천 주입',
        'Rail Cannon': '전자기포',
        'Rotary Gale': '각풍',
        'Spin Out': '사방팔방 팽이돌리기',
        'Tentacle Dig': '촉수 잠행',
        'Toxin Shower': '독액 뿌리기',
        'Toxic Fountain': '독액 분출',
        'Wild Weave': '마력천 산개',
      },
    },
  ],
};

export default triggerSet;
