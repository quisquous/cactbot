import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  getFourfold: boolean;
  getTwinfold: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MountOrdealsExtreme,
  timelineFile: 'rubicante-ex.txt',
  initData: () => {
    return {
      getFourfold: false,
      getTwinfold: false,
    };
  },
  triggers: [
    {
      id: 'RubicanteEx Inferno',
      type: 'StartsUsing',
      netRegex: { id: '7D2C', source: 'Rubicante', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'RubicanteEx Shattering Heat',
      type: 'StartsUsing',
      netRegex: { id: '7D2D', source: 'Rubicante' },
      response: Responses.tankBuster(),
    },
    {
      id: 'RubicanteEx Spike of Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D02', source: 'Rubicante' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Fourfold Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D03', source: 'Rubicante', capture: false },
      condition: (data) => !data.getFourfold,
      infoText: (_data, _matches, output) => output.group!(),
      run: (data) => data.getFourfold = true,
      outputStrings: {
        group: Outputs.healerGroups,
      },
    },
    {
      id: 'RubicanteEx Twinfold Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D04', source: 'Rubicante' },
      condition: (data) => !data.getTwinfold,
      infoText: (_data, _matches, output) => output.stack!(),
      run: (data) => data.getTwinfold = true,
      outputStrings: {
        stack: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          fr: 'Package avec votre partenaire',
          ja: '2人頭割り',
          cn: '2人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'RubicanteEx Radial Flagration',
      type: 'StartsUsing',
      netRegex: { id: '7CFE', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.spread!(),
      outputStrings: {
        spread: {
          en: 'Protean',
          de: 'Himmelsrichtung',
          fr: 'Positions',
          ja: '基本散会',
          cn: '分散引导',
          ko: '기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Blazing Rapture',
      type: 'StartsUsing',
      netRegex: { id: '7D06', source: 'Rubicante', capture: false },
      delaySeconds: 6,
      response: Responses.bigAoe(),
    },
    {
      id: 'RubicanteEx Inferno Solo Wing',
      type: 'StartsUsing',
      netRegex: { id: '7D0F', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.protean!(),
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtung',
          fr: 'Positions',
          ja: '基本散会',
          cn: '分散引导',
          ko: '기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Scalding Signal',
      type: 'StartsUsing',
      netRegex: { id: '7D24', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.outAndProtean!(),
      outputStrings: {
        outAndProtean: {
          en: 'Out + Protean',
          de: 'Raus + Himmelsrichtung',
          fr: 'Extérieur + Positions',
          ja: '外側 + 基本散会',
          cn: '外侧 + 分散引导',
          ko: '밖으로 + 기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Scalding Ring',
      type: 'StartsUsing',
      netRegex: { id: '7D25', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.inAndProtean!(),
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean',
          de: 'Rein + Himmelsrichtung',
          fr: 'Intérieur + Positions',
          ja: '内側 + 基本散会',
          cn: '内侧 + 分散引导',
          ko: '안으로 + 기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Sweeping Immolation / Partial',
      type: 'StartsUsing',
      netRegex: { id: '7D20', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.spreadBehind!(),
      outputStrings: {
        spreadBehind: {
          en: 'Spread behind Boss',
          ja: 'ボスの後ろで散会',
        },
      },
    },
    {
      id: 'RubicanteEx Sweeping Immolation / Total',
      type: 'StartsUsing',
      netRegex: { id: '7D21', source: 'Rubicante', capture: false },
      infoText: (_data, _matches, output) => output.stackBehind!(),
      outputStrings: {
        stackBehind: {
          en: 'Stack behind Boss',
          ja: 'ボスの後ろで頭割り',
        },
      },
    },
    {
      id: 'RubicanteEx Dualfire',
      type: 'StartsUsing',
      netRegex: { id: '7D2E', source: 'Rubicante' },
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.tankCleave!();
        return output.noTank!();
      },
      outputStrings: {
        tankCleave: {
          en: 'Dual Tank Cleave',
          ja: 'MT/ST 同時にタンク範囲攻撃',
        },
        noTank: Outputs.avoidTankCleave,
      },
    },
    /*
    {
      id: 'RubicanteEx Flamesent Shattering Heat Tether',
      type: 'Tether',
      netRegex: { id: '0054' },
      condition: (data, matches) => matches.target === data.me && data.role !== 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tether',
        },
      },
    },
    */
    {
      id: 'RubicanteEx Flamesent Tether',
      type: 'Tether',
      netRegex: { id: '00C0' },
      condition: (data, matches) => matches.target === data.me,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Face tether out',
          de: 'Verbindung nach draußen richten',
          fr: 'Lien vers l\'extérieur',
          ja: '線を外へ向ける',
          cn: '离开人群背对连线',
          ko: '본진 바깥으로 유도하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Spike of Flame/Fourfold Flame/Twinfold Flame': 'Frames',
        'Partial Immolation/Total Immolation': 'Partial/Total Immolation',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Rubicante': 'ルビカンテ',
        'Flamesent': '業炎妖',
      },
      'replaceText': {
        'Arcane Revelation': '魔法陣展開',
        'Arch Inferno': '烈風火燕流',
        'Conflagration': '劫火流',
        'Hope Abandon Ye': '煉獄招来',
        'Inferno': '火燕流',
        'Ninth Circle': '魔陣拡張',
        'Ordeal of Purgation': '煉獄の朱炎',
        'Shattering Heat': '炎撃',
      },
    },
  ],
};

export default triggerSet;
