'use strict';

// Titania Normal Mode
[{
  zoneRegex: /^The Dancing Plague$/,
  timelineFile: 'titania.txt',
  triggers: [
    {
      id: 'Titania Bright Sabbath',
      regex: Regexes.startsUsing({ id: '3D5C', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D5C', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D5C', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D5C', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D5C', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D5C', source: '티타니아', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Titania Phantom Out',
      regex: Regexes.startsUsing({ id: '3D5D', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D5D', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D5D', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D5D', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D5D', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D5D', source: '티타니아', capture: false }),
      alertText: {
        en: 'Out',
        de: 'Raus',
        fr: 'Dehors',
      },
    },
    {
      id: 'Titania Phantom In',
      regex: Regexes.startsUsing({ id: '3D5E', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D5E', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D5E', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D5E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D5E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D5E', source: '티타니아', capture: false }),
      alertText: {
        en: 'In',
        de: 'Rein',
        fr: 'Dedans',
      },
    },
    {
      id: 'Titania Mist Failure',
      regex: Regexes.addedCombatant({ name: 'Spirit Of Dew', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Wasserfee', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Esprit Des Rosées', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '水の精', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '水精', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '물의 정령', capture: false }),
      infoText: {
        en: 'Kill Extra Add',
        de: 'Adds angreifen',
      },
    },
    {
      id: 'Titania Mist',
      regex: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D45', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D45', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D45', source: '티타니아', capture: false }),
      infoText: {
        en: 'Water Positions',
        de: 'Wasser Positionen',
        fr: 'Position pour l\'eau',
      },
    },
    {
      id: 'Titania Flame',
      regex: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D47', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D47', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D47', source: '티타니아', capture: false }),
      delaySeconds: 6,
      alertText: {
        en: 'Stack In Puddles',
        de: 'In einer Fläche sammeln',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Titania Divination',
      regex: Regexes.startsUsing({ id: '3D5B', source: 'Titania' }),
      regexDe: Regexes.startsUsing({ id: '3D5B', source: 'Titania' }),
      regexFr: Regexes.startsUsing({ id: '3D5B', source: 'Titania' }),
      regexJa: Regexes.startsUsing({ id: '3D5B', source: 'ティターニア' }),
      regexCn: Regexes.startsUsing({ id: '3D5B', source: '缇坦妮雅' }),
      regexKo: Regexes.startsUsing({ id: '3D5B', source: '티타니아' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            de: 'Tank Cleave auf DIR',
            fr: 'Tank cleave sur vous',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Tank Cleave on ' + data.ShortName(matches.target),
            fr: 'Tank cleave sur ' + data.ShortName(matches.target),
            de: 'Tank Cleave auf ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'Titania Frost Rune 1',
      regex: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2A', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2A', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2A', source: '티타니아', capture: false }),
      infoText: {
        en: 'Get Middle, Shiva Circles',
        de: 'In die Mitte, Shiva Kreise',
        fr: 'Allez au milieu, comme sur Shiva',
      },
    },
    {
      id: 'Titania Frost Rune 2',
      regex: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2A', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2A', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2A', source: '티타니아', capture: false }),
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
        de: 'Nach drausen rennen',
        fr: 'Courez dehors',
      },
    },
    {
      id: 'Titania Frost Rune 3',
      regex: Regexes.ability({ id: '3D4E', source: 'Titania', capture: false }),
      regexDe: Regexes.ability({ id: '3D4E', source: 'Titania', capture: false }),
      regexFr: Regexes.ability({ id: '3D4E', source: 'Titania', capture: false }),
      regexJa: Regexes.ability({ id: '3D4E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.ability({ id: '3D4E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.ability({ id: '3D4E', source: '티타니아', capture: false }),
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
        de: 'In die Mitte rennen',
        fr: 'Courez dedans',
      },
    },
    {
      id: 'Titania Growth Rune',
      regex: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2E', source: '티타니아', capture: false }),
      infoText: {
        en: 'Avoid Roots',
        de: 'Ranken vermeiden',
        fr: 'Racines',
      },
    },
    {
      id: 'Titania Uplift Markers',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'Titania Peasebomb Markers',
      regex: Regexes.headMarker({ id: '00BD' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'Titania Pucks Breath Markers',
      regex: Regexes.headMarker({ id: '00A1' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Packez-vous sur' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'Titania Knockback',
      regex: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexDe: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexFr: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexJa: Regexes.ability({ id: '3D42', source: 'パック', capture: false }),
      regexCn: Regexes.ability({ id: '3D42', source: '帕克', capture: false }),
      regexKo: Regexes.ability({ id: '3D42', source: '요정의 권속', capture: false }),
      alertText: {
        en: 'Diagonal Knockback Soon',
        de: 'diagonaler Knockback bald',
        fr: 'Poussée en diagonale bientôt',
      },
    },
    {
      id: 'Titania Mini Add Phase',
      regex: Regexes.ability({ id: '3D31', source: 'Titania', capture: false }),
      regexDe: Regexes.ability({ id: '3D31', source: 'Titania', capture: false }),
      regexFr: Regexes.ability({ id: '3D31', source: 'Titania', capture: false }),
      regexJa: Regexes.ability({ id: '3D31', source: 'ティターニア', capture: false }),
      regexCn: Regexes.ability({ id: '3D31', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.ability({ id: '3D31', source: '티타니아', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Group Adds East (on Mustardseed)',
            de: 'Adds im Osten sammeln (bei Senfsamen)',
          };
        }
        return {
          en: 'Kill Mustardseed (East)',
          de: 'Senfsamen angreifen (Osten)',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Spirit of Flame': 'Feuerfee',
        'Peaseblossom': 'Bohnenblüte',
        'Mustardseed': 'Senfsamen',
      },
      'replaceText': {
        'Being Mortal': 'Sterblichkeit',
        'Bright Sabbath': 'Leuchtender Sabbat',
        'Divination Rune': 'Prophezeiungsrune',
        'Flame Hammer': 'Flammenhammer',
        'Flame Rune': 'Flammenrune',
        'Frost Rune(?! )': 'Frostrune',
        'Frost Rune Middle': 'Frostrune Mitte',
        'Gentle Breeze': 'Sanfte Brise',
        'Growth Rune': 'Wachstumsrune',
        'Hard Swipe': 'Harter Hieb',
        'Leafstorm': 'Blättersturm',
        'Love-In-Idleness': 'Liebevoller Müßiggang',
        'Midsummer Night\'s Dream': 'Mittsommernachtstraum',
        'Mist Rune': 'Nebelrune',
        '(?<! )Pease(?!\\w)': 'Bohne',
        'Peasebomb': 'Bohnenbombe',
        'Phantom Rune': 'Phantomrune',
        'Puck\'s Breath': 'Pucks Atem',
        'Puck\'s Caprice': 'Pucks Laune',
        'Puck\'s Rebuke': 'Pucks Tadel',
        'Pummel': 'Deftige Dachtel',
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nicht anvisierbar--',
        'Uplift': 'Feenring',
        'War And Pease': 'Böhnchen und Tönchen',
      },
    },
  ],
}];
