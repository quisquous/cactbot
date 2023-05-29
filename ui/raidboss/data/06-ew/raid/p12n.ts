import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

const wings = {
  topLeft: '01A5', // 82C2 cast and damage
  topRight: '01A6', // 82C1 cast and damage
  middleLeft: '01A7', // 82C4 damage
  middleRight: '01A8', // 82C3 damage
  bottomLeft: '01B1', // 82C6 damage
  bottomRight: '01B2', // 82C5 damage
} as const;

const wingIds = Object.values(wings);

const wingOutputStrings = {
  // Sure, we could say "left" and "right" here, but folks are going to be mad
  // when the boss is (probably) facing the party during Unnatural Enchainment.
  // Personally, I think it's better to be consistent than to switch the
  // meaning of right and left mid-raid.  To make it more clear what this means,
  // these say "Left Flank" (i.e. the boss's left flank) vs "Left" which could
  // mean your left or the boss's left or that you've left off reading this.
  leftFlank: {
    en: 'Left Flank',
    de: 'Linke Flanke',
  },
  rightFlank: {
    en: 'Right Flank',
    de: 'Rechte Flanke',
  },
} as const;

export interface Data extends RaidbossData {
  superchainCount: number;
  wingCollect: NetMatches['HeadMarker'][];
}

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTwelfthCircle',
  zoneId: ZoneId.AnabaseiosTheTwelfthCircle,
  timelineFile: 'p12n.txt',
  initData: () => {
    return {
      superchainCount: 0,
      wingCollect: [],
    };
  },
  triggers: [
    {
      id: 'P12N On the Soul',
      type: 'StartsUsing',
      netRegex: { id: '82D9', source: 'Athena', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P12N Wing Cleanup',
      type: 'StartsUsing',
      netRegex: { id: ['82C1', '82C2'], source: 'Athena', capture: false },
      run: (data) => data.wingCollect = [],
    },
    {
      id: 'P12N Wing Collect',
      type: 'HeadMarker',
      netRegex: { id: wingIds },
      durationSeconds: 5.5,
      infoText: (data, matches, output) => {
        data.wingCollect.push(matches);
        if (data.wingCollect.length !== 3)
          return;

        const [first, second, third] = data.wingCollect.map((x) => x.id);
        if (first === undefined || second === undefined || third === undefined)
          return;

        const firstStr = first === wings.topLeft ? output.right!() : output.left!();
        const secondStr = second === wings.middleLeft ? output.right!() : output.left!();
        const thirdStr = third === wings.bottomLeft ? output.right!() : output.left!();

        return output.text!({ first: firstStr, second: secondStr, third: thirdStr });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        text: {
          en: '${first} => ${second} => ${third}',
          de: '${first} => ${second} => ${third}',
        },
      },
    },
    {
      id: 'P12N First Wing',
      type: 'HeadMarker',
      netRegex: { id: [wings.topLeft, wings.topRight], capture: false },
      durationSeconds: 7,
      alertText: (data, _matches, output) => {
        const first = data.wingCollect[0]?.id;
        if (first === undefined)
          return;
        if (first === wings.topLeft)
          return output.rightFlank!();
        return output.leftFlank!();
      },
      outputStrings: wingOutputStrings,
    },
    {
      id: 'P12N Second Wing',
      type: 'Ability',
      netRegex: { id: ['82C1', '82C2'], source: 'Athena', capture: false },
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        const second = data.wingCollect[1]?.id;
        if (second === undefined)
          return;
        if (second === wings.middleLeft)
          return output.rightFlank!();
        return output.leftFlank!();
      },
      outputStrings: wingOutputStrings,
    },
    {
      id: 'P12N Third Wing',
      type: 'Ability',
      netRegex: { id: ['82C3', '82C4'], source: 'Athena', capture: false },
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        const third = data.wingCollect[2]?.id;
        if (third === undefined)
          return;
        if (third === wings.bottomLeft)
          return output.rightFlank!();
        return output.leftFlank!();
      },
      outputStrings: wingOutputStrings,
    },
    {
      id: 'P12N Glaukopis',
      type: 'StartsUsing',
      netRegex: { id: '82D5', source: 'Athena' },
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'P12N Superchain Theory',
      type: 'StartsUsing',
      netRegex: { id: '82BC', source: 'Athena', capture: false },
      infoText: (data, _matches, output) => {
        data.superchainCount++;

        // 1, 2, 3, 4, 3, 4, 3, 4, etc
        const count = data.superchainCount > 3
          ? (data.superchainCount - 3) % 2 + 3
          : data.superchainCount;
        return {
          1: output.superchain1!(),
          2: output.superchain2!(),
          3: output.superchain3!(),
          4: output.superchain4!(),
        }[count];
      },
      outputStrings: {
        superchain1: {
          en: 'Follow Donut',
          de: 'Donut folgen',
        },
        superchain2: {
          en: 'Short Donut => Long Donut',
          de: 'Kurzer Donut => Langer Donut',
        },
        superchain3: {
          en: 'Follow Donut (avoid cleave)',
          de: 'Donut folgen (Cleave ausweichen)',
        },
        superchain4: {
          en: 'Avoid Spheres',
          de: 'Spheren vermeiden',
        },
      },
    },
    {
      id: 'P12N Parthenos',
      type: 'StartsUsing',
      netRegex: { id: '82D8', source: 'Athena', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'P12N Unnatural Enchainment',
      type: 'StartsUsing',
      netRegex: { id: '82BF', source: 'Athena', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Chained Platforms',
          de: 'Vermeide angekettete Platformen',
        },
      },
    },
    {
      id: 'P12N Spread',
      // Used for both Palladion during add phase (no cast) and Dialogos (82D7).
      type: 'HeadMarker',
      netRegex: { id: '008B' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P12N Dialogos Stack',
      type: 'StartsUsing',
      netRegex: { id: '82D6', source: 'Athena' },
      response: Responses.stackMarkerOn(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Anthropos': 'Anthropos',
        'Athena': 'Athena',
        'Thymou Idea': 'Thymos',
      },
      'replaceText': {
        '\\(spread\\)': '(Verteilen)',
        '\\(stack\\)': '(Sammeln)',
        'Clear Cut': 'Klarer Schnitt',
        'Dialogos': 'Dialogos',
        'Glaukopis': 'Glaukopis',
        'On the Soul': 'Auf der Seele',
        'Palladion': 'Palladion',
        'Paradeigma': 'Paradigma',
        'Parthenos': 'Parthenos',
        'Ray of Light': 'Lichtstrahl',
        'Sample': 'Vielfraß',
        'Superchain Burst': 'Superkette - Ausbruch',
        'Superchain Coil': 'Superkette - Kreis',
        'Superchain Theory': 'Superkette - Theorie',
        'Theos\'s Ultima': 'Theos Ultima',
        'Trinity of Souls': 'Dreifaltigkeit der Seelen',
        'Ultima Blade': 'Ultima-Klinge',
        'Unnatural Enchainment': 'Seelenfessel',
        'White Flame': 'Weißes Feuer',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'anthropos',
        'Athena': 'Athéna',
        'Thymou Idea': 'thymou idea',
      },
      'replaceText': {
        'Clear Cut': 'Tranchage balayant',
        'Dialogos': 'Dialogos',
        'Glaukopis': 'Glaukopis',
        'On the Soul': 'Sur les âmes',
        'Palladion': 'Palladion',
        'Paradeigma': 'Paradeigma',
        'Parthenos': 'Parthénon',
        'Ray of Light': 'Onde de lumière',
        'Sample': 'Voracité',
        'Superchain Burst': 'Salve des superchaînes',
        'Superchain Coil': 'Cercle des superchaînes',
        'Superchain Theory': 'Théorie des superchaînes',
        'Theos\'s Ultima': 'Ultima de théos',
        'Trinity of Souls': 'Âmes trinité',
        'Ultima Blade': 'Lames Ultima',
        'Unnatural Enchainment': 'Enchaînement d\'âmes',
        'White Flame': 'Feu blanc',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'アンスロポス',
        'Athena': 'アテナ',
        'Thymou Idea': 'テューモス・イデア',
      },
      'replaceText': {
        'Clear Cut': '斬り払い',
        'Dialogos': 'ディアロゴス',
        'Glaukopis': 'グラウコピス',
        'On the Soul': 'オン・ザ・ソウル',
        'Palladion': 'パラディオン',
        'Paradeigma': 'パラデイグマ',
        'Parthenos': 'パルテノン',
        'Ray of Light': '光波',
        'Sample': '貪食',
        'Superchain Burst': 'スーパーチェイン・バースト',
        'Superchain Coil': 'スーパーチェイン・サークル',
        'Superchain Theory': 'スーパーチェイン・セオリー',
        'Theos\'s Ultima': 'テオス・アルテマ',
        'Trinity of Souls': 'トリニティ・ソウル',
        'Ultima Blade': 'アルテマブレイド',
        'Unnatural Enchainment': '魂の鎖',
        'White Flame': '白火',
      },
    },
  ],
};

export default triggerSet;
