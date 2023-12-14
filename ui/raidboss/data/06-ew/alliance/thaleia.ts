import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Thaliak Rheognosis: is knockback always from east? can we determine where to go?
// TODO: Thaliak Rheognosis Petrine: determine where rocks are somehow and call them
// TODO: Thaliak Tetraktys: use map effect lines to give safe spots for falling walls
// TODO: Thaliak Heiroglyphika: use map effect lines to call safe spots for rotating green squares
// TODO: Llymlaen Dire Straits: use 8CCD/8CCE to call out left => right sort of thing
// TODO: Llymlaen Serpents' Tide: use 8826/887/8828/8829 line 264 cast locations to call safe spots
// TODO: Llymlaen Navigator's Trident knockback: call where to be knocked back to with Serpents' Tide combo
// TODO: Llymlaen Torrential Tridents: use 881B Landing to call where to start and rotation direction
// TODO: Oschon Trek Shot/Swinging Draw: use 264 cast locations to call safe spots
// TODO: Eulogia Love's Light: use map effect lines to call where to start and which way to rotate
// TODO: Eulogia Heiroglyphika: use map effect lines to call safe spots for rotating green squares
// TODO: Eulogia Solar Fans: do they always jump 4 times, so front/back is safe?
// TODO: Eulogia Climbing Shot: should tell you to knockback to red or blue

export type EulogiaForm = 'left' | 'right' | 'inside' | 'unknown';

const eulogiaFormMap: { [count: string]: EulogiaForm } = {
  // first
  '8A0A': 'left',
  '8A0D': 'right',
  '8A10': 'inside',
  // second
  '8A0B': 'left',
  '8A0E': 'right',
  '8A11': 'inside',
  // third
  '8A0C': 'left',
  '8A0F': 'right',
  '8A12': 'inside',
} as const;

export interface Data extends RaidbossData {
  busterTargets: string[];
  soaringMinuet: boolean;
  eulogiaForms: EulogiaForm[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'Thaleia',
  zoneId: ZoneId.Thaleia,
  timelineFile: 'thaleia.txt',
  initData: () => {
    return {
      busterTargets: [],
      soaringMinuet: false,
      eulogiaForms: [],
    };
  },
  timelineTriggers: [
    {
      id: 'Thaleia Thaliak Rheognosis Knockback',
      regex: /^Rheognosis$/,
      beforeSeconds: 5,
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'Thaleia Thaliak Katarraktes',
      type: 'StartsUsing',
      netRegex: { id: '88D1', source: 'Thaliak', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Thaleia Thaliak Thlipsis',
      type: 'StartsUsing',
      netRegex: { id: '88D8', source: 'Thaliak' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Thaleia Thaliak Left Bank',
      type: 'StartsUsing',
      netRegex: { id: '88D2', source: 'Thaliak', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Thaleia Thaliak Right Bank',
      type: 'StartsUsing',
      netRegex: { id: '88D3', source: 'Thaliak', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Thaleia Thaliak Left Bank Hieroglyphika',
      type: 'StartsUsing',
      netRegex: { id: '8C2C', source: 'Thaliak', capture: false },
      delaySeconds: 12,
      response: Responses.goRight(),
    },
    {
      id: 'Thaleia Thaliak Right Bank Hieroglyphika',
      type: 'StartsUsing',
      netRegex: { id: '8C2D', source: 'Thaliak', capture: false },
      delaySeconds: 12,
      response: Responses.goLeft(),
    },
    {
      id: 'Thaleia Thaliak Hydroptosis',
      type: 'StartsUsing',
      netRegex: { id: '88D5', source: 'Thaliak' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Thaleia Thaliak Rhyton',
      type: 'HeadMarker',
      netRegex: { id: '01D7' },
      delaySeconds: (data, matches) => {
        data.busterTargets.push(matches.target);
        return data.busterTargets.length === 3 ? 0 : 0.5;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: Outputs.tankBusterCleaves,
        };

        if (data.busterTargets.length === 0)
          return;
        if (!data.busterTargets.includes(data.me))
          return { infoText: output.tankCleaves!() };
        if (data.role !== 'tank' && data.job !== 'BLU')
          return { alarmText: output.tankCleaveOnYou!() };
        return { alertText: output.tankCleaveOnYou!() };
      },
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'Thaleia Thaliak Rheognosis',
      type: 'StartsUsing',
      netRegex: { id: '88C4', source: 'Thaliak', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Look for knockback position',
          de: 'Nach Rückstoß Position schauen',
          fr: 'Repérez la zone de poussée',
          ja: 'ノックバック位置へ',
          ko: '넉백 위치 찾기',
        },
      },
    },
    {
      id: 'Thaleia Thaliak Rheognosis Petrine',
      type: 'StartsUsing',
      netRegex: { id: '88C5', source: 'Thaliak', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback + Rolling stones',
          de: 'Rückstoß + rollende Steine',
          fr: 'Poussée + Rocher',
          ja: 'ノックバック + 石AOE',
          ko: '넉백 + 돌 피하기',
        },
      },
    },
    {
      id: 'Thaleia Thaliak Hieroglyphika',
      type: 'StartsUsing',
      netRegex: { id: '88CF', source: 'Thaliak', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to rotated safe zone',
          de: 'Geh zum rotierten sicheren Feld',
          fr: 'Allez dans une zone sûre', // FIXME
          ja: '安置へ移動', // FIXME
          ko: '회전한 뒤의 안전 지대로 가기',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Tempest',
      type: 'StartsUsing',
      netRegex: { id: '880B', source: 'Llymlaen', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Llymlaen Seafoam Spiral',
      type: 'StartsUsing',
      netRegex: { id: '880D', source: 'Llymlaen', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'Thaleia Llymlaen Wind Rose',
      type: 'StartsUsing',
      netRegex: { id: '880C', source: 'Llymlaen', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Thaleia Llymlaen Navigator\'s Trident Knockback',
      type: 'StartsUsing',
      netRegex: { id: '8811', source: 'Llymlaen', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback',
          de: 'Rückstoß',
          fr: 'Poussée',
          ja: 'まもなくノックバック',
          ko: '넉백',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Surging Wave',
      type: 'StartsUsing',
      netRegex: { id: '8812', source: 'Llymlaen', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Far knockback',
          de: 'Weiter Rückstoß',
          fr: 'Poussée au loin',
          ja: '遠くノックバック',
          ko: '멀리 넉백',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Left Strait',
      type: 'StartsUsing',
      netRegex: { id: '8851', source: 'Llymlaen', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Thaleia Llymlaen Right Strait',
      type: 'StartsUsing',
      netRegex: { id: '8852', source: 'Llymlaen', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Thaleia Llymlaen Deep Dive',
      type: 'StartsUsing',
      netRegex: { id: ['8819', '8834'], source: 'Llymlaen' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Thaleia Llymlaen Stormwinds',
      type: 'StartsUsing',
      netRegex: { id: '881F', source: 'Llymlaen' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Thaleia Llymlaen Torrential Tridents',
      type: 'StartsUsing',
      netRegex: { id: '881A', source: 'Llymlaen', capture: false },
      durationSeconds: 12,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Last trident => 1st trident',
          de: 'Letzer Dreizack => erster Dreizack',
          fr: 'Dernier trident -> 1er trident',
          ja: '最後の槍 => 1番目の槍へ',
          ko: '마지막 창 => 1번째 창으로',
        },
      },
    },
    {
      id: 'Thaleia Llymlaen Godsbane',
      type: 'StartsUsing',
      netRegex: { id: '8824', source: 'Llymlaen', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Thaleia Oschon Sudden Downpour',
      type: 'StartsUsing',
      netRegex: { id: ['8999', '899A'], source: 'Oschon', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Oschon Trek Shot',
      type: 'StartsUsing',
      netRegex: { id: '898E', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to side of the arrow (Boss doesn\'t move)',
          de: 'Geh seitlich des Pfeils (Boss bewegt sich nicht)',
          fr: 'Allez sur les côtés de la flèche (le boss ne bouge pas)',
          ja: '矢印の横へ (ボスは動かない)',
          ko: '화살표 옆으로 (보스는 움직이지 않음)',
        },
      },
    },
    {
      id: 'Thaleia Oschon Reproduce',
      type: 'StartsUsing',
      netRegex: { id: '8989', source: 'Oschon', capture: false },
      alertText: (data, _matches, output) => {
        if (!data.soaringMinuet)
          return output.one!();
        return output.two!();
      },
      outputStrings: {
        one: {
          en: 'Go to side of the arrow',
          de: 'Geh seitlich des Pfeils',
          fr: 'Allez sur les côtés de la flèche',
          ja: '矢印の横へ',
          ko: '화살표 옆으로',
        },
        two: {
          en: 'Corner between two arrows',
          de: 'Ecke zwichen 2 Pfeilen',
          fr: 'Coin entre les 2 flèches',
          ja: '2つの矢印の隅',
          ko: '두 화살표 사이로',
        },
      },
    },
    {
      id: 'Thaleia Oschon Flinted Foehn',
      type: 'HeadMarker',
      netRegex: { id: '013C' },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.stackMarkerOnYou!();
        return output.stackMarkerOn!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        stackMarkerOn: {
          en: '6x Stack on ${player}',
          de: '6x Sammeln auf ${player}',
          ko: '6x 쉐어: ${player}',
        },
        stackMarkerOnYou: {
          en: '6x Stack on You',
          de: '6x Sammeln auf Dir',
          ko: '6x 쉐어 대상자',
        },
      },
    },
    {
      id: 'Thaleia Oschon Soaring Minuet',
      type: 'StartsUsing',
      netRegex: { id: ['8D0E', '8994'], source: 'Oschon', capture: false },
      response: Responses.getBehind(),
      run: (data) => data.soaringMinuet = true,
    },
    {
      id: 'Thaleia Oschon The Arrow / Eulogia Sunbeam',
      // 0158 = The Arrow (small)
      // 0158 = Eulogia Sunbeam
      // 01F4 = The Arrow (big)
      type: 'HeadMarker',
      netRegex: { id: ['0158', '01F4'] },
      delaySeconds: (data, matches) => {
        data.busterTargets.push(matches.target);
        return data.busterTargets.length === 3 ? 0 : 0.5;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: Outputs.tankBusterCleaves,
        };

        if (data.busterTargets.length === 0)
          return;
        if (!data.busterTargets.includes(data.me))
          return { infoText: output.tankCleaves!() };
        if (data.role !== 'tank' && data.job !== 'BLU')
          return { alarmText: output.tankCleaveOnYou!() };
        return { alertText: output.tankCleaveOnYou!() };
      },
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'Thaleia Oschon Climbing Shot',
      type: 'StartsUsing',
      netRegex: { id: ['8990', '8991', '8992', '8993'], source: 'Oschon', capture: false },
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback to safe corner',
          de: 'Rückstoß in die sichere Ecke',
          fr: 'Poussée vers un coin sûr',
          ja: 'AOEがないどころへ + ノックバック',
          ko: '안전한 구석으로 넉백되기',
        },
      },
    },
    {
      id: 'Thaleia Oschon Lofty Peaks',
      type: 'StartsUsing',
      netRegex: { id: '89A7', source: 'Oschon', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '(second phase)',
          de: 'Oschon zweite Phase',
          fr: 'Oshon : deuxième phase',
          ja: 'すぐ大きくなる',
          ko: '(2페이즈)',
        },
      },
    },
    {
      id: 'Thaleia Oschon Piton Pull NE/SW',
      type: 'StartsUsing',
      netRegex: { id: '89A9', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => {
        return output.text!({ front: output.dirNE!(), back: output.dirSW!() });
      },
      outputStrings: {
        text: {
          en: '${front} / ${back}',
          de: '${front} / ${back}',
          ko: '${front} / ${back}',
        },
        dirNE: Outputs.dirNE,
        dirSW: Outputs.dirSW,
      },
    },
    {
      id: 'Thaleia Oschon Piton Pull NW/SE',
      type: 'StartsUsing',
      netRegex: { id: '89AA', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => {
        return output.text!({ front: output.dirNW!(), back: output.dirSE!() });
      },
      outputStrings: {
        text: {
          en: '${front} / ${back}',
          de: '${front} / ${back}',
          ko: '${front} / ${back}',
        },
        dirNW: Outputs.dirNW,
        dirSE: Outputs.dirSE,
      },
    },
    {
      id: 'Thaleia Oschon Altitude',
      type: 'StartsUsing',
      netRegex: { id: '89AF', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to safe zone',
          de: 'Geh in den sicheren Bereich',
          fr: 'Allez dans une zone sûre',
          ja: '安置で待機',
          ko: '안전지대로',
        },
      },
    },
    {
      id: 'Thaleia Oschon Wandering Shot North',
      type: 'StartsUsing',
      netRegex: { id: '8CF6', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'South (away from orb)',
          de: 'Süden (weg vom Orb)',
          ko: '남쪽 (구슬에서 멀리)',
        },
      },
    },
    {
      id: 'Thaleia Oschon Wandering Shot South',
      type: 'StartsUsing',
      netRegex: { id: '8CF7', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'North (away from orb)',
          de: 'Norden (weg vom Orb)',
          ko: '북쪽 (구슬에서 멀리)',
        },
      },
    },
    {
      id: 'Thaleia Oschon Wandering Volley North',
      type: 'StartsUsing',
      netRegex: { id: '89AC', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback to south safe spot',
          de: 'Rückstoß zum südlichen sicheren Zone',
          ko: '남쪽 안전지대로 넉백되기',
        },
      },
    },
    {
      id: 'Thaleia Oschon Wandering Volley South',
      type: 'StartsUsing',
      netRegex: { id: '89AD', source: 'Oschon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback to north safe spot',
          de: 'Rückstoß zum nördliche sicheren Zone',
          ko: '북쪽 안전지대로 넉백되기',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Dawn of Time',
      type: 'StartsUsing',
      netRegex: { id: '8A03', source: 'Eulogia', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Thaleia Eulogia Forms',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(eulogiaFormMap), source: 'Eulogia' },
      durationSeconds: (data) => data.eulogiaForms.length < 2 ? 4 : 19,
      infoText: (data, matches, output) => {
        const form = eulogiaFormMap[matches.id.toUpperCase()] ?? 'unknown';
        data.eulogiaForms.push(form);
        if (data.eulogiaForms.length === 3) {
          const [form1, form2, form3] = data.eulogiaForms.map((x) => output[x]!());
          data.eulogiaForms = [];
          return output.text!({ form1: form1, form2: form2, form3: form3 });
        }
        return output[form]!();
      },
      outputStrings: {
        text: {
          en: '${form1} => ${form2} => ${form3}',
          de: '${form1} => ${form2} => ${form3}',
          fr: '${form1} => ${form2} => ${form3}',
          ja: '${form1} => ${form2} => ${form3}',
          ko: '${form1} => ${form2} => ${form3}',
        },
        left: Outputs.left,
        right: Outputs.right,
        inside: Outputs.in,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'Thaleia Eulogia the Whorl',
      type: 'StartsUsing',
      netRegex: { id: '8A2F', source: 'Eulogia', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Thaleia Eulogia Love\'s Light',
      type: 'StartsUsing',
      netRegex: { id: '8A30', source: 'Eulogia', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Start from the bright moon',
          de: 'Starte vom hellen Mond',
          fr: 'Commencez depuis la lune pleine',
          ja: '明るい月から',
          ko: '밝은 달부터 시작',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hydrostasis',
      type: 'StartsUsing',
      netRegex: { id: '8A37', source: 'Eulogia', capture: false },
      durationSeconds: 13,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '3 => 1 => 2',
          de: '3 => 1 => 2',
          fr: '3 -> 1 -> 2',
          ja: '3 => 1 => 2',
          ko: '3 => 1 => 2',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hieroglyphika',
      type: 'StartsUsing',
      netRegex: { id: '8A43', source: 'Eulogia', capture: false },
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to rotated safe zone',
          de: 'Geh in den sicheren Bereich',
          fr: 'Allez dans une zone sûre', // FIXME
          ja: '安置へ移動', // FIXME
          ko: '회전한 뒤의 안전 지대로 가기',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hand of the Destroyer Red',
      type: 'StartsUsing',
      netRegex: { id: '8A47', source: 'Eulogia', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Be on blue half',
          de: 'Geh zur blauen Seite',
          fr: 'Placez-vous sur la moitié bleue',
          ja: '青い安置',
          cn: '站蓝色半场',
          ko: '파란색 쪽으로',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Hand of the Destroyer Blue',
      type: 'StartsUsing',
      netRegex: { id: '8A48', source: 'Eulogia', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Be on red half',
          de: 'Geh zur roten Seite',
          fr: 'Placez-vous sur la moitié rouge',
          ja: '赤い安置',
          cn: '站红色半场',
          ko: '빨간색 쪽으로',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Torrential Tridents',
      type: 'StartsUsing',
      netRegex: { id: '8A4E', source: 'Eulogia', capture: false },
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Last trident => 1st trident',
          de: 'Letzer Dreizack => erster Dreizack',
          fr: 'Dernier trident -> 1er trident',
          ja: '最後の槍 => 1番目の槍へ',
          ko: '마지막 창 => 1번째 창으로',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Destructive Bolt',
      type: 'StartsUsing',
      netRegex: { id: '8CFD', source: 'Eulogia' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Thaleia Eulogia Byregot\'s Strike',
      type: 'StartsUsing',
      netRegex: { id: '8A52', source: 'Eulogia', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback (with lightning)',
          de: 'Rückstoß (mit Blitzen)',
          fr: 'Poussée (avec éclair)',
          ja: 'ノックバック (雷)',
          cn: '击退 (带闪电)',
          ko: '넉백 (번개 장판)',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Thousandfold Thrust',
      type: 'HeadMarker',
      netRegex: { id: ['0182', '0183', '0184', '0185'], target: 'Eulogia' },
      alertText: (_data, matches, output) => {
        return {
          '0182': output.back!(),
          '0183': output.front!(),
          '0184': output.left!(),
          '0185': output.right!(),
        }[matches.id];
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Thaleia Eulogia As Above So Below',
      type: 'StartsUsing',
      netRegex: { id: ['8A5B', '8A5C'], source: 'Eulogia' },
      infoText: (_data, matches, output) => {
        if (matches.id === '8A5B')
          return output.red!();
        return output.blue!();
      },
      outputStrings: {
        red: {
          en: 'Blue is safe',
          de: 'Blau ist sicher',
          fr: 'Bleu est sûr',
          ja: '青安置',
          ko: '파랑이 안전',
        },
        blue: {
          en: 'Red is safe',
          de: 'Rot ist sicher',
          fr: 'Rouge est sûr',
          ja: '赤安置',
          ko: '빨강이 안전',
        },
      },
    },
    {
      id: 'Thaleia Eulogia Climbing Shot',
      type: 'StartsUsing',
      netRegex: { id: '8D0B', source: 'Eulogia', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Thaleia Eulogia Soaring Minuet',
      type: 'StartsUsing',
      netRegex: { id: '8A69', source: 'Eulogia', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Thaleia Eulogia Eudaimon Eorzea',
      type: 'StartsUsing',
      netRegex: { id: '8A2C', source: 'Eulogia', capture: false },
      durationSeconds: 18,
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Blueblossoms/Giltblossoms': 'Blue/Giltblossoms',
        'Left Bank/Right Bank': 'Left/Right Bank',
        'Left Strait/Right Strait': 'Left/Right Strait',
        'Right Bank/Left Bank': 'Right/Left Bank',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Eulogia': 'Eulogia',
        'Llymlaen(?!\')': 'Llymlaen',
        'Oschon(?!\')': 'Oschon',
        'Oschon\'s Avatar': 'Oschons Abbild',
        'Perykos': 'Perykos',
        'Thalaos': 'Thalaos',
        'Thaliak(?!\')': 'Thaliak',
      },
      'replaceText': {
        'Altitude': 'Höhenlage',
        'Arrow Trail': 'Pfeilschweif',
        'As Above, So Below': 'Flamme von Leben und Tod',
        'Blueblossoms': 'Blaublüten',
        'Byregot\'s Strike': 'Byregots Schlag',
        'Climbing Shot': 'Aufsteigender Schuss',
        'Dawn of Time': 'Himmlischer Blitz',
        'Deep Dive': 'Tiefes Eintauchen',
        'Denizens of the Deep': 'Bewohner der Tiefe',
        'Destructive Bolt': 'Zerstörerischer Blitzschlag',
        'Dire Straits': 'Beidseitige Säuberung',
        'Downhill': 'Regenguss',
        'Eudaimon Eorzea': 'Eudaimon Eorzea',
        'First Blush': 'Lunarer Schuss',
        'First Form': 'Primärhaltung',
        'Flinted Foehn': 'Föhnpfeil',
        'Full Bright': 'Voller Glanz',
        'Giltblossoms': 'Goldblüten',
        'Godsbane': 'Göttliche Geißel',
        'Great Whirlwind': 'Windhose',
        'Hand of the Destroyer': 'Vernichtungsschlag des Zerstörers',
        'Hard Water': 'Reißendes Wasser',
        'Hieroglyphika': 'Hieroglyphen',
        'Hydroptosis': 'Hydroptose',
        'Hydrostasis': 'Hydrostase',
        'Katarraktes': 'Katarakt',
        'Landing': 'Schnelle Landung',
        'Left Bank': 'Linkes Ufer',
        'Left Strait': 'Linkes Fahrwasser',
        'Lightning Bolt': 'Keraunisches Feld',
        'Lofty Peaks': 'Orogenese',
        'Love\'s Light': 'Licht der Liebe',
        'Maelstrom': 'Mahlstrom',
        'Matron\'s Breath': 'Nophicas Atem',
        'Moving Mountains': 'Tektonisches Beben',
        'Navigator\'s Trident': 'Llymlaens Dreizack',
        'Peak Peril': 'Tektonische Turbulenz',
        'Piton Pull': 'Hakengriff',
        'Quintessence': 'Kriegerischer Übermut',
        'Radiant Finish': 'Letzter Fächertanz',
        'Radiant Rhythm': 'Fächertanz',
        'Reproduce': 'Teilung des Selbsts',
        'Rheognosis(?! Petrine)': 'Rheognose',
        'Rheognosis Petrine': 'Rheognose Petros',
        'Rhyton': 'Rhyton',
        'Right Bank': 'Rechtes Ufer',
        'Right Strait': 'Rechtes Fahrwasser',
        'Seafoam Spiral': 'Kreisförmige Welle',
        'Second Form': 'Sekundärhaltung',
        'Serpents\' Tide': 'Schlangenflut',
        'Shockwave': 'Schockwelle',
        'Soaring Minuet': 'Pfeil des Wanderers',
        'Solar Fans': 'Fächerschneide',
        'Stormwhorl': 'Meerestornado',
        'Stormwinds': 'Meerestornado',
        'Stormy Seas': 'Stürmische See',
        'Sudden Downpour': 'Platzregen',
        'Sunbeam': 'Sonnenstrahl',
        'Surging Wave': 'Wellenstoß',
        'Swinging Draw': 'Schweifender Pfeil',
        'Tempest': 'Schwerer Sturm',
        'Tetraktuos Kosmos': 'Tetraktuos Kosmos',
        'Tetraktys': 'Tetraktuos',
        'The Arrow': 'Oschons Pfeil',
        'The Builder\'s Art': 'Byregots göttliche Macht',
        'The Destroyer\'s Might': 'Rhalghrs göttliche Macht',
        'The Fury\'s Ambition': 'Halones göttliche Macht',
        'The Keeper\'s Gravity': 'Althyks göttliche Macht',
        'The Lover\'s Devotion': 'Menphinas göttliche Macht',
        'The Matron\'s Plenty': 'Nophicas göttliche Macht',
        'The Navigator\'s Command': 'Llymlaens göttliche Macht',
        'The Scholar\'s Wisdom': 'Thaliaks göttliche Macht',
        'The Spinner\'s Cunning': 'Nymeias göttliche Macht',
        'The Traders\' Equity': 'Nald\'thals göttliche Macht',
        'The Wanderer\'s Whimsy': 'Oschons göttliche Macht',
        'The Warden\'s Radiance': 'Azeymas göttliche Macht',
        'The Whorl': 'Göttlicher Schöpfungswirbel',
        'Third Form': 'Tertiärhaltung',
        'Thlipsis': 'Drangsal',
        'Thousandfold Thrust': 'Tausendfacher Stoß',
        'Time and Tide': 'Zeit und Gezeiten',
        'To the Last': 'Endlose Wellen',
        'Torrential Tridents': 'Himmlische Harpunen',
        'Trek Shot': 'Langsamer Pfeil',
        'Wandering Shot': 'Umherschweifender Schuss',
        'Wandering Volley': 'Streifschüsse',
        'Wind Rose': 'Kreisförmiger Wirbel',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Eulogia': 'Eulogie',
        'Llymlaen(?!\')': 'Llymlaen',
        'Oschon(?!\')': 'Oschon',
        'Oschon\'s Avatar': 'double d\'Oschon',
        'Perykos': 'Pérykos',
        'Thalaos': 'Thalaos',
        'Thaliak(?!\')': 'Thaliak',
      },
      'replaceText': {
        'Altitude': 'Altitude',
        'Arrow Trail': 'Traînées de flèches',
        'As Above, So Below': 'Flamme de vie, flamme de mort',
        'Blueblossoms': 'Pétales d\'azur',
        'Byregot\'s Strike': 'Foreuse de Byregot',
        'Climbing Shot': 'Tir ascendant',
        'Dawn of Time': 'Éclair céleste',
        'Deep Dive': 'Noyade abyssale',
        'Denizens of the Deep': 'Appel des serpents marins',
        'Destructive Bolt': 'Foudre destructrice',
        'Dire Straits': 'Éradication totale',
        'Downhill': 'Averse pénétrante',
        'Eudaimon Eorzea': 'Eudémon éorzéen',
        'First Blush': 'Scintillement sélénien',
        'First Form': 'Posture primaire',
        'Flinted Foehn': 'Flèches de foehn',
        'Full Bright': 'Nuit de pleine lune',
        'Giltblossoms': 'Pétales dorés',
        'Godsbane': 'Fléau divin',
        'Great Whirlwind': 'Grand tourbillon',
        'Hand of the Destroyer': 'Main du Destructeur',
        'Hard Water': 'Oppression aqueuse',
        'Hieroglyphika': 'Hiéroglyphe',
        'Hydroptosis': 'Hydroptôse',
        'Hydrostasis': 'Hydrostase',
        'Katarraktes': 'Cataracte',
        'Landing': 'Atterrissage rapide',
        'Left Bank': 'Débordement rive gauche',
        'Left Strait': 'Éradication à bâbord',
        'Lightning Bolt': 'Éclair de foudre',
        'Lofty Peaks': 'Orogenèse',
        'Love\'s Light': 'Brillance de l\'amour',
        'Maelstrom': 'Maelström',
        'Matron\'s Breath': 'Souffle de la Mère',
        'Moving Mountains': 'Secousse tectonique',
        'Navigator\'s Trident': 'Trident de Llymlaen',
        'Peak Peril': 'Turbulence tectonique',
        'Piton Pull': 'Arrachement de pitons',
        'Quintessence': 'Exaltation guerrière',
        'Radiant Finish': 'Final enflammé',
        'Radiant Rhythm': 'Rythme enflammé',
        'Reproduce': 'Clonage',
        'Rheognosis(?! Petrine)': 'Leonosis',
        'Rheognosis Petrine': 'Leonosis petros',
        'Rhyton': 'Rhyton',
        'Right Bank': 'Débordement rive droite',
        'Right Strait': 'Éradication à tribord',
        'Seafoam Spiral': 'Vague circulaire',
        'Second Form': 'Posture secondaire',
        'Serpents\' Tide': 'Ruée serpentine',
        'Shockwave': 'Onde de choc',
        'Soaring Minuet': 'Flèche du menuet',
        'Solar Fans': 'Éventails solaires',
        'Stormwhorl': 'Tornade marine',
        'Stormwinds': 'Brise marine',
        'Stormy Seas': 'Déchaînement marin',
        'Sudden Downpour': 'Déluge dru',
        'Sunbeam': 'Rayon de soleil',
        'Surging Wave': 'Transperce-vague',
        'Swinging Draw': 'Tir oscillant',
        'Tempest': 'Grande tempête',
        'Tetraktuos Kosmos': 'Tetractys cosmos',
        'Tetraktys': 'Tetractys',
        'The Arrow': 'Flèche d\'Oschon',
        'The Builder\'s Art': 'Pouvoir divin de Byregot',
        'The Destroyer\'s Might': 'Pouvoir divin de Rhalgr',
        'The Fury\'s Ambition': 'Pouvoir divin de Halone',
        'The Keeper\'s Gravity': 'Pouvoir divin d\'Althyk',
        'The Lover\'s Devotion': 'Pouvoir divin de Menphina',
        'The Matron\'s Plenty': 'Pouvoir divin de Nophica',
        'The Navigator\'s Command': 'Pouvoir divin de Llymlaen',
        'The Scholar\'s Wisdom': 'Pouvoir divin de Thaliak',
        'The Spinner\'s Cunning': 'Pouvoir divin de Nymeia',
        'The Traders\' Equity': 'Pouvoir divin de Nald\'thal',
        'The Wanderer\'s Whimsy': 'Pouvoir divin d\'Oschon',
        'The Warden\'s Radiance': 'Pouvoir divin d\'Azeyma',
        'The Whorl': 'Vortex génésiaque',
        'Third Form': 'Posture tertiaire',
        'Thlipsis': 'Tribulation',
        'Thousandfold Thrust': 'Transpercement millénaire',
        'Time and Tide': 'Manipulation temporelle',
        'To the Last': 'Vagues infinies',
        'Torrential Tridents': 'Pluie de tridents',
        'Trek Shot': 'Flèches languissantes',
        'Wandering Shot': 'Tir errant',
        'Wandering Volley': 'Tir de barrage errant',
        'Wind Rose': 'Bourrasque circulaire',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Eulogia': 'エウロギア',
        'Llymlaen(?!\')': 'リムレーン',
        'Oschon(?!\')': 'オシュオン',
        'Oschon\'s Avatar': 'オシュオンの分体',
        'Perykos': 'ペリュコス',
        'Thalaos': 'サラオス',
        'Thaliak(?!\')': 'サリャク',
      },
      'replaceText': {
        'Altitude': 'アルティチュード',
        'Arrow Trail': 'アロートレイル',
        'As Above, So Below': '死生択一の炎',
        'Blueblossoms': '青花散',
        'Byregot\'s Strike': 'ビエルゴズ・ストライク',
        'Climbing Shot': 'クライムシュート',
        'Dawn of Time': '星天極光',
        'Deep Dive': '海淵落とし',
        'Denizens of the Deep': '海蛇招来',
        'Destructive Bolt': '壊雷撃',
        'Dire Straits': '両舷掃討',
        'Downhill': 'ダウンヒル',
        'Eudaimon Eorzea': 'エウダイモン・エオルゼア',
        'First Blush': '月閃',
        'First Form': '壱の構え',
        'Flinted Foehn': 'フェーンアロー',
        'Full Bright': '月夜の巡り',
        'Giltblossoms': '黄花散',
        'Godsbane': 'ゴッズベーン',
        'Great Whirlwind': '大旋風',
        'Hand of the Destroyer': '壊神創幻撃',
        'Hard Water': '重水塊',
        'Hieroglyphika': 'ヒエログリュフィカ',
        'Hydroptosis': 'ヒュドルピトシス',
        'Hydrostasis': 'ヒュドルスタシス',
        'Katarraktes': 'カタラクティス',
        'Landing': '落着',
        'Left Bank': '左岸氾濫',
        'Left Strait': '左舷掃討',
        'Lightning Bolt': '落雷',
        'Lofty Peaks': '風天の霊峰',
        'Love\'s Light': '慈愛の月',
        'Maelstrom': 'メイルシュトローム',
        'Matron\'s Breath': '豊穣の息吹',
        'Moving Mountains': '造山振動',
        'Navigator\'s Trident': 'リムレーンズトライデント',
        'Peak Peril': '造山乱流',
        'Piton Pull': 'ハーケンブリング',
        'Quintessence': '武気発揚',
        'Radiant Finish': '焔扇流舞・終炎',
        'Radiant Rhythm': '焔扇流舞',
        'Reproduce': '分体生成',
        'Rheognosis(?! Petrine)': 'レーオノシス',
        'Rheognosis Petrine': 'レーオノシス・ペトゥロス',
        'Rhyton': 'リュトン',
        'Right Bank': '右岸氾濫',
        'Right Strait': '右舷掃討',
        'Seafoam Spiral': '輪の波浪',
        'Second Form': '弐の構え',
        'Serpents\' Tide': '海蛇の進撃',
        'Shockwave': '衝撃波',
        'Soaring Minuet': 'メヌエットアロー',
        'Solar Fans': '紅炎扇刃',
        'Stormwhorl': '時化の渦風',
        'Stormwinds': '時化の潮風',
        'Stormy Seas': '大時化起こし',
        'Sudden Downpour': 'ダウンポール',
        'Sunbeam': '太陽光',
        'Surging Wave': '波穿ち',
        'Swinging Draw': 'スイングアロー',
        'Tempest': '大海嵐',
        'Tetraktuos Kosmos': 'テトラクテュス・コスモス',
        'Tetraktys': 'テトラクテュス',
        'The Arrow': 'オシュオンの矢',
        'The Builder\'s Art': 'ビエルゴの神力',
        'The Destroyer\'s Might': 'ラールガーの神力',
        'The Fury\'s Ambition': 'ハルオーネの神力',
        'The Keeper\'s Gravity': 'アルジクの神力',
        'The Lover\'s Devotion': 'メネフィナの神力',
        'The Matron\'s Plenty': 'ノフィカの神力',
        'The Navigator\'s Command': 'リムレーンの神力',
        'The Scholar\'s Wisdom': 'サリャクの神力',
        'The Spinner\'s Cunning': 'ニメーヤの神力',
        'The Traders\' Equity': 'ナルザルの神力',
        'The Wanderer\'s Whimsy': 'オシュオンの神力',
        'The Warden\'s Radiance': 'アーゼマの神力',
        'The Whorl': '創世の神渦',
        'Third Form': '参の構え',
        'Thlipsis': 'スリプシス',
        'Thousandfold Thrust': 'サウザンスラスト',
        'Time and Tide': '時間操作',
        'To the Last': '千波万波',
        'Torrential Tridents': '銛の雨',
        'Trek Shot': 'トレックアロー',
        'Wandering Shot': 'ワンダリングショット',
        'Wandering Volley': 'ワンダリングバラージ',
        'Wind Rose': '円の旋風',
      },
    },
  ],
};

export default triggerSet;
