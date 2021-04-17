import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO:
//   Assuming Stacking the Deck always puts Knave of Hearts as #1; needs confirmation
//   Assuming one Lunge + Colossal Impact pattern; needs confirmation
//   Hansel and Gretel Bloody Sweep
//   Hansel and Gretel Stronger Together Tethered
//   Hansel & Gretel Passing Lance
//   Hansel & Gretel Breakthrough
//   2P-operated Flight Unit adds
//   Red Girl
//   Meng-Zi / Xun-Zi
//   Better Her Inflorescence Recreate Structure
//   Her Inflorescence Distortion
//   Her Inflorescence Pillar Impact

export default {
  zoneId: ZoneId.TheTowerAtParadigmsBreach,
  timelineFile: 'the_tower_at_paradigms_breach.txt',
  triggers: [
    {
      id: 'Paradigm Knave Roar',
      netRegex: NetRegexes.startsUsing({ id: '5EB5', source: 'Knave Of Hearts', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EB5', source: 'Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EB5', source: 'Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EB5', source: 'ジャック', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Knave Colossal Impact Sides',
      netRegex: NetRegexes.startsUsing({ id: '5EA4', source: 'Knave Of Hearts', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EA4', source: 'Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EA4', source: 'Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EA4', source: 'ジャック', capture: false }),
      durationSeconds: 5,
      response: Responses.goMiddle(),
    },
    {
      id: 'Paradigm Copied Knave Colossal Impact Sides',
      netRegex: NetRegexes.startsUsing({ id: '5EA4', source: 'Copied Knave', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EA4', source: 'Kopiert(?:e|er|es|en) Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EA4', source: 'Réplique De Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EA4', source: '複製サレタジャック', capture: false }),
      // Cast time of 8 seconds, clones start casting 6 seconds into the cast.
      delaySeconds: 2.1,
      durationSeconds: 5,
      response: Responses.goMiddle(),
    },
    {
      id: 'Paradigm Knave Colossal Impact Middle',
      netRegex: NetRegexes.startsUsing({ id: '5EA7', source: 'Knave Of Hearts', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EA7', source: 'Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EA7', source: 'Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EA7', source: 'ジャック', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      tts: {
        en: 'Go East/West Sides',
      },
      outputStrings: {
        text: {
          en: 'Go E/W Sides',
        },
      },
    },
    {
      id: 'Paradigm Copied Knave Colossal Impact Middle',
      netRegex: NetRegexes.startsUsing({ id: '5EA7', source: 'Copied Knave', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EA7', source: 'Kopiert(?:e|er|es|en) Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EA7', source: 'Réplique De Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EA7', source: '複製サレタジャック', capture: false }),
      delaySeconds: 2.1,
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      tts: {
        en: 'Go North/South Sides',
      },
      outputStrings: {
        text: {
          en: 'Go N/S Sides',
        },
      },
    },
    {
      // Also applies for Red Girl Manipulate Energy
      id: 'Paradigm Knave Magic Artillery Beta You',
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'Paradigm Knave Magic Artillery Beta Collect',
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Paradigm Knave Magic Artillery Beta',
      netRegex: NetRegexes.headMarker({ id: '00DA', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data, _, output) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer')
          return output.tankBuster();

        return output.avoidTankBuster();
      },
      run: (data) => delete data.busterTargets,
      outputStrings: {
        tankBuster: {
          en: 'Tank Buster',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '坦克死刑',
          ko: '탱버',
        },
        avoidTankBuster: {
          en: 'Avoid tank buster',
          de: 'Tank buster ausweichen',
          fr: 'Évitez le tank buster',
          ja: 'タンクバスターを避ける',
          cn: '远离坦克死刑',
          ko: '탱버 피하기',
        },
      },
    },
    {
      id: 'Paradigm Knave Magic Artillery Alpha Spread',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Paradigm Knave Lunge',
      netRegex: NetRegexes.startsUsing({ id: '5EB1', source: 'Knave of Hearts', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EB1', source: 'Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EB1', source: 'Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EB1', source: 'ジャック', capture: false }),
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (from boss)',
          de: 'Rückstoß (vom Boss)',
        },
      },
    },
    {
      id: 'Paradigm Copied Knave Lunge',
      netRegex: NetRegexes.startsUsing({ id: '5EB1', source: 'Copied Knave', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5EB1', source: 'Kopiert(?:e|er|es|en) Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5EB1', source: 'Réplique De Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5EB1', source: '複製サレタジャック', capture: false }),
      condition: (data) => !data.cloneLunge,
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (from clone)',
          de: 'Rückstoß (vom Klon)',
        },
      },
      run: (data) => data.cloneLunge = true,
    },
    {
      id: 'Paradigm Copied Knave Lunge Out of Middle',
      netRegex: NetRegexes.startsUsing({ id: '60C8', source: 'Knave of Hearts', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '60C8', source: 'Herzbube', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '60C8', source: 'Jack', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '60C8', source: 'ジャック', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback -> Out of Middle',
          de: 'Rückstoß -> Raus aus der Mitte',
        },
      },
    },
    {
      id: 'Paradigm Gretel Upgraded Shield',
      netRegex: NetRegexes.startsUsing({ id: '5C69', source: 'Gretel', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5C69', source: 'Gretel', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5C69', source: 'Gretel', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5C69', source: 'グレーテル', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Hansel',
          de: 'Hänsel angreifen',
        },
      },
    },
    {
      id: 'Paradigm Hansel Upgraded Shield',
      netRegex: NetRegexes.startsUsing({ id: '5C6B', source: 'Hansel', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5C6B', source: 'Hänsel', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5C6B', source: 'Hansel', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5C6B', source: 'ヘンゼル', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Gretel',
          de: 'Gretel angreifen',
        },
      },
    },
    {
      id: 'Paradigm Hansel/Gretel Wail',
      netRegex: NetRegexes.startsUsing({ id: '5C7[67]', source: ['Hansel', 'Gretel'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5C7[67]', source: ['Hänsel', 'Gretel'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5C7[67]', source: ['Hansel', 'Gretel'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5C7[67]', source: ['ヘンゼル', 'グレーテル'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Hansel/Gretel Crippling Blow',
      netRegex: NetRegexes.startsUsing({ id: '5C7[89]', source: ['Hansel', 'Gretel'] }),
      netRegexDe: NetRegexes.startsUsing({ id: '5C7[89]', source: ['Hänsel', 'Gretel'] }),
      netRegexFr: NetRegexes.startsUsing({ id: '5C7[89]', source: ['Hansel', 'Gretel'] }),
      netRegexJa: NetRegexes.startsUsing({ id: '5C7[89]', source: ['ヘンゼル', 'グレーテル'] }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Paradigm Hansel/Gretel Seed Of Magic Alpha',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Paradigm Hansel/Gretel Riot Of Magic',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.stackMarker(),
    },
    {
      id: 'Paradigm Red Girl Cruelty',
      netRegex: NetRegexes.startsUsing({ id: '6012', source: 'Red Girl', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6012', source: 'Rot(?:e|er|es|en) Mädchen', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6012', source: 'Fille En Rouge', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6012', source: '赤い少女', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Red Sphere Wave: White',
      netRegex: NetRegexes.startsUsing({ id: '618D', source: 'Red Sphere', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '618D', source: 'Rot(?:e|er|es|en) Sphäre', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '618D', source: 'Noyau Orange', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '618D', source: '赤球', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Switch to white',
          de: 'Auf Weiß wechseln',
        },
      },
    },
    {
      id: 'Paradigm Red Sphere Wave: Black',
      netRegex: NetRegexes.startsUsing({ id: '618E', source: 'Red Sphere', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '618E', source: 'Rot(?:e|er|es|en) Sphäre', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '618E', source: 'Noyau Orange', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '618E', source: '赤球', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Switch to black',
          de: 'Auf Schwarz wechseln',
        },
      },
    },
    {
      id: 'Paradigm Meng-Zi/Xun-Zi Universal Assault',
      netRegex: NetRegexes.startsUsing({ id: '5C06', source: ['Meng-Zi', 'Xun-Zi'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5C06', source: ['Meng-Zi', 'Xun-Zi'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5C06', source: ['Meng-Zi', 'Xun-Zi'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5C06', source: ['モウシ', 'ジュンシ'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm False Idol Screaming Score',
      netRegex: NetRegexes.startsUsing({ id: '5BDD', source: 'False Idol', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BDD', source: 'Ihre Abgöttlichkeit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BDD', source: 'Déesse Factice', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BDD', source: '偽造サレタ神', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm False Idol Made Magic Left',
      netRegex: NetRegexes.startsUsing({ id: '5BD6', source: 'False Idol', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BD6', source: 'Ihre Abgöttlichkeit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BD6', source: 'Déesse Factice', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BD6', source: '偽造サレタ神', capture: false }),
      durationSeconds: 5,
      response: Responses.goRight(),
    },
    {
      id: 'Paradigm False Idol Made Magic Right',
      netRegex: NetRegexes.startsUsing({ id: '5BD7', source: 'False Idol', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BD7', source: 'Ihre Abgöttlichkeit', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BD7', source: 'Déesse Factice', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BD7', source: '偽造サレタ神', capture: false }),
      durationSeconds: 5,
      response: Responses.goLeft(),
    },
    {
      id: 'Paradigm False Idol Darker Note You',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'Paradigm False Idol Darker Note Collect',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Paradigm False Idol Darker Note Not You',
      netRegex: NetRegexes.headMarker({ id: '008B', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data, _, output) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer')
          return output.tankBuster();

        return output.avoidTankBuster();
      },
      run: (data) => delete data.busterTargets,
      outputStrings: {
        tankBuster: {
          en: 'Tank Buster',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '坦克死刑',
          ko: '탱버',
        },
        avoidTankBuster: {
          en: 'Avoid tank buster',
          de: 'Tank buster ausweichen',
          fr: 'Évitez le tank buster',
          ja: 'タンクバスターを避ける',
          cn: '远离坦克死刑',
          ko: '탱버 피하기',
        },
      },
    },
    {
      id: 'Paradigm Her Inflorescence Screaming Score',
      netRegex: NetRegexes.startsUsing({ id: '5BF5', source: 'Her Inflorescence', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BF5', source: 'Ihre Infloreszenz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BF5', source: 'Déesse Éclose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BF5', source: '開花シタ神', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Her Inflorescence Recreate Structure',
      netRegex: NetRegexes.startsUsing({ id: '5BE1', source: 'Her Inflorescence', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BE1', source: 'Ihre Infloreszenz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BE1', source: 'Déesse Éclose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BE1', source: '開花シタ神', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Building Below',
          de: 'Gebäude unter einem ausweichen',
        },
      },
    },
    {
      id: 'Paradigm Her Inflorescence Recreate Signal',
      netRegex: NetRegexes.startsUsing({ id: '5BE3', source: 'Her Inflorescence', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BE3', source: 'Ihre Infloreszenz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BE3', source: 'Déesse Éclose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BE3', source: '開花シタ神', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go To Red Light',
          de: 'Geh zum roten Licht',
        },
      },
    },
    {
      id: 'Paradigm Her Inflorescence Heavy Arms Middle',
      netRegex: NetRegexes.startsUsing({ id: '5BED', source: 'Her Inflorescence', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BED', source: 'Ihre Infloreszenz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BED', source: 'Déesse Éclose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BED', source: '開花シタ神', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Paradigm Her Inflorescence Heavy Arms Sides',
      netRegex: NetRegexes.startsUsing({ id: '5BEF', source: 'Her Inflorescence', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5BEF', source: 'Ihre Infloreszenz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5BEF', source: 'Déesse Éclose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5BEF', source: '開花シタ神', capture: false }),
      response: Responses.goFrontBack(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Knave Of Hearts': 'Herzbube',
        'Copied Knave': 'Kopiert(?:e|er|es|en) Herzbube',
        'Gretel': 'Gretel',
        'Hansel': 'Hänsel',
        'Red Girl': 'Rot(?:e|er|es|en) Mädchen',
        'Red Sphere': 'Rot(?:e|er|es|en) Sphäre',
        'Meng-Zi': 'Meng-Zi',
        'Xun-Zi': 'Xun-Zi',
        'False Idol': 'Ihre Abgöttlichkeit',
        'Her Inflorescence': 'Ihre Infloreszenz',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Knave Of Hearts': 'Jack',
        'Copied Knave': 'Réplique De Jack',
        'Gretel': 'Gretel',
        'Hansel': 'Hansel',
        'Red Girl': 'Fille En Rouge',
        'Red Sphere': 'Noyau Orange',
        'Meng-Zi': 'Meng-Zi',
        'Xun-Zi': 'Xun-Zi',
        'False Idol': 'Déesse Factice',
        'Her Inflorescence': 'Déesse Éclose',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Knave Of Hearts': 'ジャック',
        'Copied Knave': '複製サレタジャック',
        'Gretel': 'グレーテル',
        'Hansel': 'ヘンゼル',
        'Red Girl': '赤い少女',
        'Red Sphere': '赤球',
        'Meng-Zi': 'モウシ',
        'Xun-Zi': 'ジュンシ',
        'False Idol': '偽造サレタ神',
        'Her Inflorescence': '開花シタ神',
      },
    },
  ],
};
