import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  ashenEyeDirections?: number[];
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheThirdCircle,
  timelineFile: 'p3n.txt',
  triggers: [
    {
      id: 'P3N Experimental Fireplume Rotating',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6698', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6698', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6698', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6698', source: 'フェネクス', capture: false }),
      infoText: (_data, _matches, output) => output.startMiddle!(),
      outputStrings: {
        startMiddle: {
          en: 'Start Middle',
          de: 'Starte mittig',
          fr: 'Commencez au milieu',
          ko: '가운데에 있다가 밖으로',
        },
      },
    },
    {
      id: 'P3N Experimental Fireplume Out',
      type: 'StartsUsing',
      // This is Experimental Fireplume (6696) into Fireplume (6697), which is an 11s warning.
      netRegex: NetRegexes.startsUsing({ id: '6696', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6696', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6696', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6696', source: 'フェネクス', capture: false }),
      durationSeconds: 8,
      infoText: (_data, _matches, output) => output.outOfMiddle!(),
      outputStrings: {
        outOfMiddle: {
          en: 'Out Of Middle Soon',
          de: 'Bald raus aus der Mitte',
          fr: 'Sortez du milieu bientôt',
          ja: '横へ', // FIXME
          cn: '远离中间', // FIXME
          ko: '맵 바깥쪽으로',
        },
      },
    },
    {
      id: 'P3N Scorched Exaltation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B8', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66B8', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66B8', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66B8', source: 'フェネクス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P3N Heat of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B2', source: 'Phoinix' }),
      netRegexDe: NetRegexes.startsUsing({ id: '66B2', source: 'Phoinix' }),
      netRegexFr: NetRegexes.startsUsing({ id: '66B2', source: 'Protophénix' }),
      netRegexJa: NetRegexes.startsUsing({ id: '66B2', source: 'フェネクス' }),
      suppressSeconds: 1,
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'P3N Darkened Fire Aoe',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '010[C-F]' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Stand on Darkened Fire',
          de: 'Auf einer Schwarzen Lohe stehen',
          fr: 'Placez-vous sur la flamme sombre',
          cn: '站在黑色火焰',
          ko: '불꽃 위에 서기',
        },
      },
    },
    {
      id: 'P3N Right Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B4', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66B4', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66B4', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66B4', source: 'フェネクス', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P3N Left Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B5', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66B5', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66B5', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66B5', source: 'フェネクス', capture: false }),
      response: Responses.goRight(),
    },
    {
      // Could check the log line's x y coordinate to determine from where to where it charges, npc at charge target casts 66AF?
      id: 'P3N Trail of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66AD', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66AD', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66AD', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66AD', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => {
        return output.avoidCharge!();
      },
      outputStrings: {
        avoidCharge: {
          en: 'Avoid Charge',
          de: 'Charge ausweichen',
          fr: 'Évitez les charges',
          ja: '突進避けて',
          cn: '躲避冲锋',
          ko: '돌진 피하기',
        },
      },
    },
    {
      id: 'P3N Sunbird Spawn',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Sunbird', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Spross Des Phoinix', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Oiselet Étincelant', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '陽炎鳥', capture: false }),
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.tank!();
        return output.text!();
      },
      outputStrings: {
        tank: {
          en: 'Pull add circles apart',
          de: 'Zieh die Kreise der Adds auseinander',
          fr: 'Attaquez les adds séparément',
          cn: '拉小怪分开',
          ko: '원 끼리 겹치지 않게 하기',
        },
        text: Outputs.killAdds,
      },
    },
    {
      id: 'P3N Dead Rebirth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66A9', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '66A9', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '66A9', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '66A9', source: 'フェネクス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P3N Ashen Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66AB', source: 'Sparkfledged' }),
      netRegexDe: NetRegexes.startsUsing({ id: '66AB', source: 'Saat Des Phoinix' }),
      netRegexFr: NetRegexes.startsUsing({ id: '66AB', source: 'Oiselet De Feu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '66AB', source: '火霊鳥' }),
      alertText: (data, matches, output) => {
        if (!data.ashenEyeDirections)
          data.ashenEyeDirections = [];
        // Convert radians into 4 quarters N = 0, E = 1, S = 2, W = 3
        const heading = Math.round(2 - 2 * parseFloat(matches.heading) / Math.PI) % 4;
        data.ashenEyeDirections.push(heading);
        if (data.ashenEyeDirections.length === 2) {
          let safeSpot = '';
          let first = '';
          const dir1 = data.ashenEyeDirections[0];
          const dir2 = data.ashenEyeDirections[1];
          switch (dir1) {
            case 0:
              safeSpot = output.n!();
              break;
            case 1:
              safeSpot = output.e!();
              break;
            case 2:
              safeSpot = output.s!();
              break;
            case 3:
              safeSpot = output.w!();
              break;
          }
          switch (dir2) {
            case 0:
              first = output.s!();
              break;
            case 1:
              first = output.w!();
              break;
            case 2:
              first = output.n!();
              break;
            case 3:
              first = output.e!();
              break;
          }
          return output.combo!({ first: first, second: safeSpot });
        } else if (data.ashenEyeDirections.length > 3) {
          data.ashenEyeDirections = [];
        }
      },
      outputStrings: {
        n: Outputs.north,
        e: Outputs.east,
        w: Outputs.west,
        s: Outputs.south,
        combo: {
          en: '${first} => ${second}',
          de: '${first} => ${second}',
          fr: '${first} => ${second}',
          ja: '${first} => ${second}',
          cn: '${first} => ${second}',
          ko: '${first} => ${second}',
        },
      },
    },
    {
      id: 'P3N Devouring Brand',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '669E', source: 'Phoinix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '669E', source: 'Phoinix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '669E', source: 'Protophénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '669E', source: 'フェネクス', capture: false }),
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Split Intercardinals',
          de: 'Interkardinal aufteilen',
          fr: 'Dispersez-vous en intercardinal',
          cn: '分割场地',
          ko: '대각선 쪽으로 나눠 자리잡기',
        },
      },
    },
    {
      id: 'P3N Spread Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Left Cinderwing/Right Cinderwing': 'Left/Right Cinderwing',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Phoinix': 'Phoinix',
        'Sparkfledged': 'Saat des Phoinix',
        'Sunbird': 'Spross Des Phoinix',
      },
      'replaceText': {
        '--fire expands--': '--Feuer breitet sich aus--',
        '--giant fireplume\\?--': '--riesige Feuerfieder?--',
        'Ashen Eye': 'Aschener Blick',
        'Blazing Rain': 'Flammender Regen',
        'Brightened Fire': 'Lichte Lohe',
        '(?<!\\w )Charplume': 'Aschenfieder',
        'Darkened Fire': 'Schwarze Lohe',
        'Dead Rebirth': 'Melaphoinix',
        'Devouring Brand': 'Kreuzbrand',
        'Experimental Charplume': 'Experimentelle Schwarzfieder',
        'Experimental Fireplume': 'Experimentelle Feuerfieder',
        'Flames of Undeath': 'Totenflamme',
        'Flare of Condemnation': 'Limbische Flamme',
        'Fledgling Flight': 'Flüggewerden',
        'Heat of Condemnation': 'Limbisches Lodern',
        'Joint Pyre': 'Gemeinschaft des Feuers',
        'Left Cinderwing': 'Linke Aschenschwinge',
        'Right Cinderwing': 'Rechte Aschenschwinge',
        'Scorched Exaltation': 'Aschenlohe',
        'Searing Breeze': 'Sengender Hauch',
        'Trail of Condemnation': 'Limbischer Odem',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Phoinix': 'protophénix',
        'Sparkfledged': 'oiselet de feu',
        'Sunbird': 'Spross Des Phoinix',
      },
      'replaceText': {
        '--fire expands--': '--élargissement du feu--',
        '--giant fireplume\\?--': '--immolation de feu géant ?--',
        'Ashen Eye': 'Œil sombre',
        'Blazing Rain': 'Pluie brûlante',
        'Brightened Fire': 'Flamme de lumière',
        '(?<!\\w )Charplume': 'Immolation de feu sombre',
        'Darkened Fire': 'Flamme sombre',
        'Dead Rebirth': 'Phénix noir',
        'Devouring Brand': 'Croix enflammée',
        'Experimental Charplume': 'Synthèse de mana : immolation de feu sombre',
        'Experimental Fireplume': 'Synthèse de mana : immolation de feu',
        'Flames of Undeath': 'Feu réincarné',
        'Flare of Condemnation': 'Souffle infernal',
        'Fledgling Flight': 'Nuée ailée',
        'Heat of Condemnation': 'Bourrasque infernale',
        'Joint Pyre': 'Combustion résonnante',
        'Left Cinderwing/Right Cinderwing': 'Incinération senestre/dextre',
        'Scorched Exaltation': 'Flamme calcinante',
        'Searing Breeze': 'Jet incandescent',
        'Trail of Condemnation': 'Embrasement infernal',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Phoinix': 'フェネクス',
        'Sparkfledged': '火霊鳥',
        'Sunbird': '陽炎鳥',
      },
      'replaceText': {
        'Ashen Eye': '闇の瞳',
        'Blazing Rain': '炎の雨',
        'Brightened Fire': '光の炎',
        '(?<!\\w )Charplume': '闇の劫火天焦',
        'Darkened Fire': '闇の炎',
        'Dead Rebirth': '黒き不死鳥',
        'Devouring Brand': '十字走火',
        'Experimental Charplume': '魔力錬成：闇の劫火天焦',
        'Experimental Fireplume': '魔力錬成：劫火天焦',
        'Flames of Undeath': '反魂の炎',
        'Flare of Condemnation': '獄炎の火撃',
        'Fledgling Flight': '群鳥飛翔',
        'Heat of Condemnation': '獄炎の炎撃',
        'Joint Pyre': '共燃',
        'Left Cinderwing': '左翼焼却',
        'Right Cinderwing': '右翼焼却',
        'Scorched Exaltation': '灰燼の炎',
        'Searing Breeze': '熱噴射',
        'Trail of Condemnation': '獄炎の焔',
      },
    },
  ],
};

export default triggerSet;
