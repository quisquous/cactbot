import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes.js';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: warnings for mines after bosses?

// TODO: headmarkers of course have a random offset here eyeroll

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (data, matches) => {
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
};

export default {
  zoneId: ZoneId.DelubrumReginaeSavage,
  timelineFile: 'delubrum_reginae_savage.txt',
  timelineTriggers: [
    {
      id: 'DelubrumSav Lord Vicious Swipe',
      regex: /Vicious Swipe/,
      // There are different timings in the first and second phase.
      // Consistently use 5 seconds beforehand for both.
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'DelubrumSav Seeker Baleful Swath',
      // This is an early warning on the Verdant Path cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5A98', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5A98', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5A98', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5A98', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'DelubrumSav Seeker Act Of Mercy',
      // This is an early warning on the Verdant Path cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5A97', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5A97', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5A97', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5A97', capture: false }),
      alertText: (data, _, outputs) => outputs.text(),
      outputStrings: {
        text: {
          // "Intercardinals" may confuse people between absolute and relative,
          // so add in the "of boss" just to be extra clear.
          en: 'Go Intercardinal of Boss',
          de: 'Geh in eine Intercardinale Himmelsrichtung vom Boss',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Onslaught Buster',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AD5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AD5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AD5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AD5', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          avoidTankCleave: Outputs.avoidTankCleave,
          sharedTankBuster: {
            en: 'Shared Tank Buster',
            de: 'Geteilter Tank Buster',
          },
        };

        if (data.role === 'tank' || data.role === 'healer')
          return { alertText: output.sharedTankBuster() };
        return { infoText: output.avoidTankCleave() };
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Onslaught Solo',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AD6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AD6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AD6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AD6', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Solo Tank Cleave',
          de: 'Solo Tank Cleave',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5ABE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5ABE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5ABE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5ABE', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Barricade',
          de: 'Hinter den Barrikaden verstecken',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Blade Knockback',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5ABF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5ABF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5ABF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5ABF', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback Into Barricade',
          de: 'Rückstoß in die Barrikaden',
        },
      },
    },
    {
      id: 'DelubrumSav Dahu Shockwave',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: ['5770', '576F'] }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: ['5770', '576F'] }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: ['5770', '576F'] }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: ['5770', '576F'] }),
      // There's a 3s slow windup on the first, then a 1s opposite cast.
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (matches.id === '5770')
          return output.leftThenRight();
        return output.rightThenLeft();
      },
      outputStrings: {
        leftThenRight: {
          en: 'Left, Then Right',
          de: 'Links, dann Rechts',
          fr: 'Gauche, puis droite',
          ja: '左 => 右',
          cn: '左 => 右',
          ko: '왼쪽 => 오른쪽',
        },
        rightThenLeft: {
          en: 'Right, Then Left',
          de: 'Rechts, dann Links',
          fr: 'Droite, puis gauche',
          ja: '右 => 左',
          cn: '右 => 左',
          ko: '오른쪽 => 왼쪽',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Offensive Sword',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '5819', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '5819', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '5819', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '5819', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Take Outside Bombs',
          de: 'Nimm die äußeren Bomben',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Offensive Shield',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '581A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '581A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '581A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '581A', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback Away From Sphere',
          de: 'Rückstoß weg von der Sphere',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Play Sword',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '5816', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '5816', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '5816', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '5816', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out, Avoid Cleaves',
          de: 'Raus, weiche den Cleaves aus',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Play Shield',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '5817', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '5817', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '5817', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '5817', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In, Avoid Cleaves',
          de: 'Rein, weiche den Cleaves aus',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Yellow Tether',
      netRegex: NetRegexes.tether({ source: 'Queen\'s Warrior', target: 'Queen\'s Knight', id: '0088', capture: false }),
      netRegexDe: NetRegexes.tether({ source: 'Kriegerin Der Königin', target: 'Ritter Der Königin', id: '0088', capture: false }),
      netRegexFr: NetRegexes.tether({ source: 'Guerrière De La Reine', target: 'Chevalier De La Reine', id: '0088', capture: false }),
      netRegexJa: NetRegexes.tether({ source: 'クイーンズ・ウォリアー', target: 'クイーンズ・ナイト', id: '0088', capture: false }),
      // Yellow tether between Knight and Warrior gives them a Physical Vulnerability Down debuff.
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spellforge on physical dps',
          de: 'Zauberschmied auf physische DDs',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Purple Tether',
      netRegex: NetRegexes.tether({ source: 'Queen\'s Warrior', target: 'Queen\'s Knight', id: '0089', capture: false }),
      netRegexDe: NetRegexes.tether({ source: 'Kriegerin Der Königin', target: 'Ritter Der Königin', id: '0089', capture: false }),
      netRegexFr: NetRegexes.tether({ source: 'Guerrière De La Reine', target: 'Chevalier De La Reine', id: '0089', capture: false }),
      netRegexJa: NetRegexes.tether({ source: 'クイーンズ・ウォリアー', target: 'クイーンズ・ナイト', id: '0089', capture: false }),
      // Yellow tether between Knight and Warrior gives them a Physical Vulnerability Down debuff.
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Steelsting on magical dps',
          de: 'Stahlstachels auf magische DDs',
        },
      },
    },
    {
      id: 'DelubrumSav Avowed Fury Of Bozja',
      // Allegiant Arsenal 5987 = staff (out), followed up with Fury of Bozja 594C
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5987', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5987', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5987', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5987', capture: false }),
      response: Responses.getOut('alert'),
    },
    {
      id: 'DelubrumSav Avowed Flashvane',
      // Allegiant Arsenal 5986 = bow (get behind), followed up by Flashvane 594B
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5986', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5986', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5986', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5986', capture: false }),
      response: Responses.getBehind('alert'),
    },
    {
      id: 'DelubrumSav Avowed Infernal Slash',
      // Allegiant Arsenal 5985 = sword (get front), followed up by Infernal Slash 594A
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5985', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5985', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5985', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5985', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In Front',
          de: 'Geh vor den Boss',
          ko: '정면에 서기',
        },
      },
    },
    {
      id: 'DelubrumSav Lord Foe Splitter',
      netRegex: NetRegexes.startsUsing({ source: 'Stygimoloch Lord', id: '57D7' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Anführer-Stygimoloch', id: '57D7' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Seigneur Stygimoloch', id: '57D7' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スティギモロク・ロード', id: '57D7' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          cleaveOnYou: Outputs.tankCleaveOnYou,
          cleaveNoTarget: Outputs.tankCleave,
          avoidCleave: Outputs.avoidTankCleave,
          cleaveOn: {
            en: 'Tank Cleave on ${player}',
            de: 'Tank Cleave auf ${player}',
          },
        };
        if (matches.target === data.me)
          return { alarmText: output.cleaveOnYou() };
        if (tankBusterOnParty(data, matches))
          return { alertText: output.cleaveOn({ player: data.ShortName(matches.target) }) };
        return { infoText: output.avoidCleave() };
      },
    },
    {
      id: 'DelubrumSav Lord 1111-Tonze Swing',
      netRegex: NetRegexes.startsUsing({ source: 'Stygimoloch Lord', id: '57D8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Anführer-Stygimoloch', id: '57D8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Seigneur Stygimoloch', id: '57D8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スティギモロク・ロード', id: '57D8', capture: false }),
      response: Responses.getOut(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aetherial Bolt': 'Magiegeschoss',
        'Aetherial Burst': 'Magiebombe',
        'Aetherial Orb': 'Magiekugel',
        'Aetherial Sphere': 'Ätherwind',
        'Aetherial Ward': 'Magiewall',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Avowed Avatar': 'Spaltteil der Eingeschworenen',
        'Ball Of Fire': 'Feuerball',
        'Bozjan Phantom': 'Bozja-Phantom',
        'Crowned Marchosias': 'Marchosias-Leittier',
        'Dahu': 'Dahu',
        'Dahu was defeated by': 'hat Dahu besiegt',
        'Gun Turret': 'Geschützturm',
        'Immolating Flame': 'Flammensturm',
        'Marchosias': 'Marchosias',
        'Pride of the Lion(?!ess)': 'Saal des Löwen',
        'Pride of the Lioness': 'Segen der Löwin',
        'Queen\'s Gunner': 'Schütze der Königin',
        'Queen\'s Knight': 'Ritter der Königin',
        'Queen\'s Soldier': 'Soldat der Königin',
        'Queen\'s Warrior': 'Kriegerin der Königin',
        'Queensheart': 'Saal der Dienerinnen',
        'Seeker Avatar': 'Spaltteil der Sucher',
        'Soldier Avatar': 'Spaltteil des Soldaten',
        'Spark Arrow': 'Feuerpfeil',
        'Spiritual Sphere': 'Seelenwind',
        'Stuffy Wraith': 'muffig(?:e|er|es|en) Schrecken',
        'Stygimoloch Lord': 'Anführer-Stygimoloch',
        'Stygimoloch Monk': 'Stygimoloch',
        'Stygimoloch Warrior': 'Krieger-Stygimoloch',
        'Tempestuous Orb': 'groß(?:e|er|es|en) Eisball',
        'The Hall of Hieromancy': 'Halle des Orakels',
        'The Hall of Supplication': 'Große Gebetshalle',
        'The Path of Divine Clarity': 'Sanktuarium des Lebens',
        'The Queen': 'Kriegsgöttin',
        'The Theater of One': 'Einsame Arena',
        'The Vault of Singing Crystal': 'Ort des Klingenden Kristalls',
        'Trinity Avowed': 'Trinität der Eingeschworenen',
        'Trinity Seeker': 'Trinität der Sucher',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'Neiiin! Wie ist das möglich',
      },
      'replaceText': {
        '--adds--': '--Adds--',
        '--corner--': '--Ecke--',
        '--jump--': '--Sprung--',
        '--knockback--': '--Rückstoß--',
        '--middle--': '--Mitte--',
        '--north--': '--Norden--',
        '1111-Tonze Swing': '1111-Tonzen-Schwung',
        'Above Board': 'Über dem Feld',
        'Act Of Mercy': 'Schneller Stich des Dolches',
        'Allegiant Arsenal': 'Waffenwechsel',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Baleful Blade': 'Stoß der Edelklinge',
        'Baleful Comet': 'Flammenstapel der Edelklinge',
        'Baleful Firestorm': 'Ätherflamme der Edelklinge',
        'Baleful Onslaught': 'Wilder Schlitzer der Edelklinge',
        'Baleful Swathe': 'Schwarzer Wirbel der Edelklinge',
        'Beck And Call To Arms': 'Feuerbefehl',
        'Blade Of Entropy': 'Eisflammenklinge',
        'Blood And Bone': 'Wellenschlag',
        'Bombslinger': 'Bombenabwurf',
        'Boost': 'Kräfte sammeln',
        'Burn': 'Verbrennung',
        'Cleansing Slash': 'Säubernder Schnitt',
        'Coat Of Arms': 'Trotz',
        'Coerce': 'Zwang',
        'Crazed Rampage': 'Gereizter Wutlauf',
        'Creeping Miasma': 'Miasmahauch',
        'Crushing Hoof': 'Tödlicher Druck',
        'Dead Iron': 'Woge der Feuerfaust',
        'Devastating Bolt': 'Heftiger Donner',
        'Devour': 'Verschlingen',
        'Double Gambit': 'Illusionsmagie',
        'Elemental Arrow': 'Element-Pfeil',
        'Elemental Blast': 'Element-Explosion',
        'Elemental Brand': 'Eisflammenfluch',
        'Elemental Impact': 'Einschlag',
        'Empyrean Iniquity': 'Empyreische Interdiktion',
        '(?<!Inescapable )Entrapment': 'Fallenlegen',
        'Excruciation': 'Fürchterlicher Schmerz',
        'Falling Rock': 'Steinschlag',
        'Fateful Words': 'Worte des Verderbens',
        'Feral Howl': 'Wildes Heulen',
        'Fiery Portent': 'Fieberhitze',
        'Firebreathe': 'Lava-Atem',
        'First Mercy': '1. Streich: Viererdolch-Haltung',
        'Flailing Strike': 'Wirbelnder Schlag',
        'Flames Of Bozja': 'Bozianische Flamme',
        'Flashvane': 'Schockpfeile',
        'Focused Tremor': 'Kontrolliertes Beben',
        'Foe Splitter': 'Tobender Teiler',
        'Fool\'s Gambit': 'Bezauberungsmagie',
        'Forceful Strike': 'Kraftvoller Schlag',
        'Fourth Mercy': '4. Streich: Viererdolch-Haltung',
        'Fracture': 'Sprengung',
        'Freedom Of Bozja': 'Bozianische Freiheit',
        'Fury Of Bozja': 'Bozianische Wut',
        'Gleaming Arrow': 'Funkelnder Pfeil',
        'Glory Of Bozja': 'Stolz von Bozja',
        'Gods Save The Queen': 'Wächtergott der Königin',
        'Great Ball Of Fire': 'Feuerball',
        'Gun Turret': 'Geschützturm',
        'Gunnhildr\'s Blades': 'Gunnhildrs Schwert',
        'Head Down': 'Scharrende Hufe',
        'Heaven\'s Wrath': 'Heilige Perforation',
        'Higher Power': 'Elektrische Ladung',
        'Hot And Cold': 'Heiß und kalt',
        'Hot Charge': 'Heiße Rage',
        'Hunter\'s Claw': 'Jägerklaue',
        'Hysteric Assault': 'Hysterischer Ansturm',
        'Ice Spikes': 'Eisstachel',
        'Icy Portent': 'Frostwinde',
        'Inescapable Entrapment': 'Extrem-Fallenlegen',
        'Infernal Slash': 'Yama-Schnitt',
        'Invert Miasma': 'Umgekehrte Miasmakontrolle',
        'Iron Impact': 'Kanon der Feuerfaust',
        'Iron Rose': 'Rose des Hasses der Feuerfaust',
        'Iron Splitter': 'Furor der Feuerfaust',
        'Judgment Blade': 'Klinge des Urteils',
        'Labyrinthine Fate': 'Fluch des Herren des Labyrinths',
        'Leaping Spark': 'Endloser Donner',
        'Left-Sided Shockwave': 'Linke Schockwelle',
        'Lethal Blow': 'Verheerender Schlag',
        'Lingering Miasma': 'Miasmawolke',
        'Lots Cast': 'Magieexplosion',
        'Maelstrom\'s Bolt': 'Heiligenlichter',
        'Malediction of Agony': 'Pochender Fluch',
        'Malediction of Ruin': 'Fluch des Verfalls',
        'Mana Flame': 'Manaflamme',
        'Manifest Avatar': 'Teilung des Selbsts',
        'Manipulate Miasma': 'Miasmakontrolle',
        'Memory of the Labyrinth': 'Edikt des Herren des Labyrinths',
        'Merciful Arc': 'Fächertanz des Dolches',
        'Merciful Blooms': 'Kasha des Dolches',
        'Merciful Breeze': 'Yukikaze des Dolches',
        'Merciful Moon': 'Gekko des Dolches',
        'Mercy Fourfold': 'Viererdolch',
        'Northswain\'s Glow': 'Stella Polaris',
        'Optimal Offensive': 'Beste Attacke',
        'Optimal Play': 'Bestes Manöver',
        'Pawn Off': 'Kranzklinge',
        'Phantom Edge': 'Phantomklingen',
        'Queen\'s Edict': 'Hohes Edikt der Königin',
        'Queen\'s Justice': 'Hoheitliche Strafe',
        'Queen\'s Shot': 'Omnidirektionalschuss',
        'Queen\'s Will': 'Edikt der Königin',
        'Quick March': 'Marschbefehl',
        'Rapid Bolts': 'Kettenblitz',
        'Rapid Sever': 'Radikale Abtrennung',
        'Reading': 'Demontage',
        'Relentless Battery': 'Koordiniertes Manöver',
        'Relentless Play': 'Koordinierter Angriff',
        'Rending Bolt': 'Fallender Donner',
        'Reverberating Roar': 'Einsturzgefahr',
        'Reversal Of Forces': 'Materieinversion',
        'Right-Sided Shockwave': 'Rechte Schockwelle',
        'Rush': 'Stürmen',
        'Seasons Of Mercy': 'Setsugekka des Dolches',
        'Second Mercy': '2. Streich: Viererdolch-Haltung',
        'Secrets Revealed': 'Enthüllte Geheimnisse',
        'Shield Omen': 'Schildhaltung',
        'Shimmering Shot': 'Glitzerpfeil',
        'Shot In The Dark': 'Einhändiger Schuss',
        'Sniper Shot': 'Fangschuss',
        'Spit Flame': 'Flammenspucke',
        'Spiteful Spirit': 'Meditation',
        'Strongpoint Defense': 'Absolutschild',
        'Summon(?! Adds)': 'Beschwörung',
        'Summon Adds': 'Add-Beschwörung',
        'Sun\'s Ire': 'Flammenschlag',
        'Surge of Vigor': 'Eifer',
        'Surging Flames': 'Feuerangriff',
        'Surging Flood': 'Wasserangriff',
        'Swirling Miasma': 'Miasmawirbel',
        'Sword Omen': 'Schwerthaltung',
        'The Ends': 'Kreuzschnitt',
        'The Means': 'Kreuzschlag',
        'Third Mercy': '3. Streich: Viererdolch-Haltung',
        'Thunderous Discharge': 'Blitznetz',
        'Turret\'s Tour': 'Querschlägerhagel',
        'Undying Hatred': 'Über-Psychokinese',
        'Unlucky Lot': 'Magiebombe',
        'Unrelenting Charge': 'Ungestümer Ansturm',
        'Unseen Eye': 'Geist des Blütensturms',
        'Unwavering Apparition': 'Geist des Schlächters',
        'Verdant Path': 'Lehren des Grünen Pfades',
        'Verdant Tempest': 'Zauberwind des Grünen Pfades',
        'Vicious Swipe': 'Frenetischer Feger',
        'Vile Wave': 'Welle der Boshaftigkeit',
        'Weave Miasma': 'Miasmathese',
        'Weight Of Fortune': 'Erdrückende Kraft',
        'Whack': 'Wildes Schlagen',
        'Winds Of Fate': 'Sturm der Gewalt',
        'Winds Of Weight': 'Erdrückender Sturm',
        'Withering Curse': 'Wichtelfluch',
        'Wrath Of Bozja': 'Bozianischer Zorn',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Aetherial Bolt': 'petite bombe',
        'Aetherial Burst': 'énorme bombe',
        'Aetherial Orb': 'amas d\'éther élémentaire',
        'Aetherial Sphere': 'sphère d\'éther',
        'Aetherial Ward': 'Barrière magique',
        'Automatic Turret': 'Auto-tourelle',
        'Avowed Avatar': 'clone de la trinité féale',
        'Ball Of Fire': 'Boule de flammes',
        'Bozjan Phantom': 'fantôme bozjien',
        'Crowned Marchosias': 'marchosias alpha',
        'Dahu': 'dahu',
        'Gun Turret': 'Tourelle dirigée',
        'Immolating Flame': 'grande boule de feu tourbillonnante',
        'Marchosias': 'marchosias',
        'Pride of the Lion(?!ess)': 'Hall du Lion',
        'Pride of the Lioness': 'Bénédiction de la Lionne',
        'Queen\'s Gunner': 'fusilier de la reine',
        'Queen\'s Knight': 'chevalier de la reine',
        'Queen\'s Soldier': 'soldat de la reine',
        'Queen\'s Warrior': 'guerrière de la reine',
        'Queensheart': 'Chambre des prêtresses',
        'Seeker Avatar': 'clone de la trinité soudée',
        'Soldier Avatar': 'double de soldat',
        'Spark Arrow': 'volée de flèches de feu',
        'Spiritual Sphere': 'sphère immatérielle',
        'Stuffy Wraith': 'spectre boursouflé',
        'Stygimoloch Lord': 'seigneur stygimoloch',
        'Stygimoloch Monk': 'stygimoloch',
        'Stygimoloch Warrior': 'guerrier stygimoloch',
        'Tempestuous Orb': 'grande boule de glace',
        'The Hall of Hieromancy': 'Salle des oracles',
        'The Hall of Supplication': 'Grande salle des prières',
        'The Path of Divine Clarity': 'Salle des sages',
        'The Queen': 'Garde-la-Reine',
        'The Theater of One': 'Amphithéâtre en ruines',
        'The Vault of Singing Crystal': 'Chambre des cristaux chantants',
        'Trinity Avowed': 'trinité féale',
        'Trinity Seeker': 'trinité soudée',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'Grrroooargh.... Cette humaine... est forte...',
      },
      'replaceText': {
        '1111-Tonze Swing': 'Swing de 1111 tonz',
        'Above Board': 'Aire de flottement',
        'Act Of Mercy': 'Fendreciel rédempteur',
        'Allegiant Arsenal': 'Changement d\'arme',
        'Automatic Turret': 'Auto-tourelle',
        'Baleful Blade': 'Assaut singulier',
        'Baleful Comet': 'Choc des flammes singulier',
        'Baleful Firestorm': 'Ruée de flammes singulière',
        'Baleful Onslaught': 'Fendoir singulier',
        'Baleful Swathe': 'Flux de noirceur singulier',
        'Beck And Call To Arms': 'Ordre d\'attaquer',
        'Blade Of Entropy': 'Sabre du feu et de la glace',
        'Blood And Bone': 'Onde tranchante',
        'Bombslinger': 'Jet de bombe',
        'Boost': 'Renforcement',
        'Burn': 'Combustion',
        'Cleansing Slash': 'Taillade purifiante',
        'Coat Of Arms': 'Bouclier directionnel',
        'Coerce': 'Ordre irrefusable',
        'Crazed Rampage': 'Tranchage final',
        'Creeping Miasma': 'Coulée miasmatique',
        'Crushing Hoof': 'Saut pesant',
        'Dead Iron': 'Vague des poings de feu',
        'Devastating Bolt': 'Cercle de foudre',
        'Devour': 'Dévoration',
        'Double Gambit': 'Manipulation des ombres',
        'Elemental Brand': 'Malédiction du feu et de la glace',
        'Elemental Impact': 'Impact',
        'Empyrean Iniquity': 'Injustice empyréenne',
        '(?<!Inescapable )Entrapment': 'Pose de pièges',
        'Excruciation': 'Atroce douleur',
        'Falling Rock': 'Chute de pierre',
        'Fateful Words': 'Mots de calamité',
        'Feral Howl': 'Rugissement sauvage',
        'Fiery Portent': 'Rideau de flammes',
        'Firebreathe': 'Souffle de lave',
        'First Mercy': 'Première lame rédemptrice',
        'Flailing Strike': 'Hachage rotatif',
        'Flames Of Bozja': 'Flammes de Bozja',
        'Flashvane': 'Flèches fulgurantes',
        'Focused Tremor': 'Séisme localisé',
        'Foe Splitter': 'Fendoir horizontal',
        'Fool\'s Gambit': 'Manipulation des sens',
        'Forceful Strike': 'Hachage surpuissant',
        'Fourth Mercy': 'Quatrième lame rédemptrice',
        'Fracture': 'Fracture',
        'Freedom Of Bozja': 'Liberté de Bozja',
        'Fury Of Bozja': 'Furie de Bozja',
        'Gleaming Arrow': 'Flèche miroitante',
        'Glory Of Bozja': 'Gloire de Bozja',
        'Gods Save The Queen': 'Que les Dieux gardent la Reine',
        'Great Ball Of Fire': 'Boule de feu tourbillonante',
        'Gun Turret': 'Tourelle dirigée',
        'Gunnhildr\'s Blades': 'Lame de Gunnhildr',
        'Head Down': 'Charge bestiale',
        'Heaven\'s Wrath': 'Ire céleste',
        'Higher Power': 'Charge électrique',
        'Hot And Cold': 'Chaud et froid',
        'Hot Charge': 'Charge brûlante',
        'Hunter\'s Claw': 'Griffes prédatrices',
        'Hysteric Assault': 'Assaut forcené',
        'Ice Spikes': 'Pointes de glace',
        'Icy Portent': 'Rideau de givre',
        'Inescapable Entrapment': 'Parterre de pièges',
        'Infernal Slash': 'Taillade de Yama',
        'Invert Miasma': 'Contrôle des miasmes inversé',
        'Iron Impact': 'Canon d\'ardeur des poings de feu',
        'Iron Rose': 'Canon de pugnacité des poings de feu',
        'Iron Splitter': 'Fracas des poings de feu',
        'Judgment Blade': 'Lame du jugement',
        'Labyrinthine Fate': 'Malédiction du seigneur du dédale',
        'Leaping Spark': 'Éclairs en série',
        'Left-Sided Shockwave': 'Onde de choc gauche',
        'Lethal Blow': 'Charge ultime',
        'Lingering Miasma': 'Nuage miasmatique',
        'Lots Cast': 'Bombe ensorcelée',
        'Maelstrom\'s Bolt': 'Fulmination',
        'Malediction of Agony': 'Malédiction lancinante',
        'Malediction of Ruin': 'Malédiction dévastatrice',
        'Mana Flame': 'Flammes de mana',
        'Manifest Avatar': 'Clonage',
        'Manipulate Miasma': 'Contrôle des miasmes',
        'Memory of the Labyrinth': 'Appel du seigneur du dédale',
        'Merciful Arc': 'Éventail rédempteur',
        'Merciful Blooms': 'Kasha rédempteur',
        'Merciful Breeze': 'Yukikaze rédempteur',
        'Merciful Moon': 'Gekkô rédempteur',
        'Mercy Fourfold': 'Quatuor de lames rédemptrices',
        'Northswain\'s Glow': 'Étoile du Nord',
        'Optimal Offensive': 'Charge de maître d\'armes',
        'Optimal Play': 'Technique de maître d\'armes',
        'Pawn Off': 'Sabre tournoyant',
        'Phantom Edge': 'Épées spectrales',
        'Queen\'s Edict': 'Injonction de Gunnhildr',
        'Queen\'s Justice': 'Châtiment royal',
        'Queen\'s Shot': 'Tir tous azimuts',
        'Queen\'s Will': 'Édit de Gunnhildr',
        'Quick March': 'Ordre de marche',
        'Rapid Bolts': 'Torrent d\'éclairs',
        'Rapid Sever': 'Tranchage rapide',
        'Reading': 'Analyse des faiblesses',
        'Relentless Battery': 'Attaque coordonnée',
        'Relentless Play': 'Ordre d\'attaque coordonnée',
        'Rending Bolt': 'Pluie de foudre',
        'Reverberating Roar': 'Cri disloquant',
        'Reversal Of Forces': 'Inversion des masses',
        'Right-Sided Shockwave': 'Onde de choc droite',
        'Rush': 'Ruée',
        'Seasons Of Mercy': 'Setsugekka rédempteur',
        'Second Mercy': 'Deuxième lame rédemptrice',
        'Secrets Revealed': 'Corporification',
        'Shield Omen': 'Posture du bouclier',
        'Shimmering Shot': 'Flèches scintillantes',
        'Shot In The Dark': 'Tir à une main',
        'Sniper Shot': 'Entre les yeux',
        'Spit Flame': 'Crachat enflammé',
        'Spiteful Spirit': 'Sphère de brutalité',
        'Strongpoint Defense': 'Défense absolue',
        'Summon(?! Adds)': 'Invocation',
        'Sun\'s Ire': 'Ire ardente',
        'Surge of Vigor': 'Zèle',
        'Surging Flames': 'Déferlante de feu',
        'Surging Flood': 'Déferlante d\'eau',
        'Swirling Miasma': 'Anneau miasmatique',
        'Sword Omen': 'Posture de l\'épée',
        'The Ends': 'Croix lacérante',
        'The Means': 'Croix perforante',
        'Third Mercy': 'Troisième lame rédemptrice',
        'Thunderous Discharge': 'Déflagration de foudre',
        'Turret\'s Tour': 'Ricochets frénétiques',
        'Undying Hatred': 'Psychokinèse',
        'Unlucky Lot': 'Déflagration éthérée',
        'Unrelenting Charge': 'Charge frénétique',
        'Unseen Eye': 'Spectres de l\'ouragan de fleurs',
        'Unwavering Apparition': 'Spectres du chevalier implacable',
        'Verdant Path': 'École de la Voie verdoyante',
        'Verdant Tempest': 'Tempête de la Voie verdoyante',
        'Vicious Swipe': 'Vrille tranchante',
        'Vile Wave': 'Vague de malveillance',
        'Weave Miasma': 'Miasmologie',
        'Weight Of Fortune': 'Pesanteur excessive',
        'Whack': 'Tannée',
        'Winds Of Fate': 'Tornade puissante',
        'Winds Of Weight': 'Pesanteur et légèreté',
        'Withering Curse': 'Malédiction de nanisme',
        'Wrath Of Bozja': 'Courroux de Bozja',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Aetherial Bolt': '魔弾',
        'Aetherial Burst': '大魔弾',
        'Aetherial Orb': '魔力塊',
        'Aetherial Sphere': '魔気',
        'Aetherial Ward': '魔法障壁',
        'Automatic Turret': 'オートタレット',
        'Avowed Avatar': 'アヴァウドの分体',
        'Ball Of Fire': '火炎球',
        'Bozjan Phantom': 'ボズヤ・ファントム',
        'Crowned Marchosias': 'アルファ・マルコシアス',
        'Dahu': 'ダウー',
        'Gun Turret': 'ガンタレット',
        'Immolating Flame': '大火焔',
        'Marchosias': 'マルコシアス',
        'Pride of the Lion(?!ess)': '雄獅子の広間',
        'Pride of the Lioness': '雌獅子の加護',
        'Queen\'s Gunner': 'クイーンズ・ガンナー',
        'Queen\'s Knight': 'クイーンズ・ナイト',
        'Queen\'s Soldier': 'クイーンズ・ソルジャー',
        'Queen\'s Warrior': 'クイーンズ・ウォリアー',
        'Queensheart': '巫女たちの広間',
        'Seeker Avatar': 'シーカーの分体',
        'Soldier Avatar': 'ソルジャーの分体',
        'Spark Arrow': 'ファイアアロー',
        'Spiritual Sphere': '霊気',
        'Stuffy Wraith': 'スタフィー・レイス',
        'Stygimoloch Lord': 'スティギモロク・ロード',
        'Stygimoloch Monk': 'スティギモロク',
        'Stygimoloch Warrior': 'スティギモロク・ウォリアー',
        'Tempestuous Orb': '大氷球',
        'The Hall of Hieromancy': '託宣所',
        'The Hall of Supplication': '大祈祷所',
        'The Path of Divine Clarity': '命の至聖所',
        'The Queen': 'セイブ・ザ・クイーン',
        'The Theater of One': '円形劇場跡',
        'The Vault of Singing Crystal': '響き合う水晶の間',
        'Trinity Avowed': 'トリニティ・アヴァウド',
        'Trinity Seeker': 'トリニティ・シーカー',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'グオオオォォ…… 敗レル……ナンテ……',
      },
      'replaceText': {
        '1111-Tonze Swing': '1111トンズ・スイング',
        'Above Board': '浮遊波',
        'Act Of Mercy': '破天鋭刃風',
        'Allegiant Arsenal': 'ウェポンチェンジ',
        'Automatic Turret': 'オートタレット',
        'Baleful Blade': '豪剣強襲撃',
        'Baleful Comet': '豪剣焔襲撃',
        'Baleful Firestorm': '豪剣魔炎旋',
        'Baleful Onslaught': '豪剣激烈斬',
        'Baleful Swathe': '豪剣黒流破',
        'Beck And Call To Arms': '攻撃命令',
        'Blade Of Entropy': '氷炎刃',
        'Blood And Bone': '波動斬',
        'Bombslinger': '爆弾投擲',
        'Boost': 'ためる',
        'Burn': '燃焼',
        'Cleansing Slash': '乱命割殺斬',
        'Coat Of Arms': '偏向防御',
        'Coerce': '強要',
        'Crazed Rampage': 'キリキリ舞い',
        'Creeping Miasma': '瘴気流',
        'Crushing Hoof': '重圧殺',
        'Dead Iron': '熱拳振動波',
        'Devastating Bolt': '激雷',
        'Devour': '捕食',
        'Double Gambit': '幻影術',
        'Elemental Brand': '氷炎の呪印',
        'Elemental Impact': '着弾',
        'Empyrean Iniquity': '天魔鬼神爆',
        '(?<!Inescapable )Entrapment': '掛罠',
        'Excruciation': '激痛',
        'Falling Rock': '落石',
        'Fateful Words': '呪いの言葉',
        'Feral Howl': 'フェラルハウル',
        'Fiery Portent': '熱気術',
        'Firebreathe': 'ラーヴァブレス',
        'First Mercy': '初手：鋭刃四刀の構え',
        'Flailing Strike': '回転乱打',
        'Flames Of Bozja': 'フレイム・オブ・ボズヤ',
        'Flashvane': 'フラッシュアロー',
        'Focused Tremor': '局所地震',
        'Foe Splitter': 'マキ割り',
        'Fool\'s Gambit': '幻惑術',
        'Forceful Strike': '剛力の一撃',
        'Fourth Mercy': '四手：鋭刃四刀の構え',
        'Fracture': '炸裂',
        'Freedom Of Bozja': 'リバティ・オブ・ボズヤ',
        'Fury Of Bozja': 'フューリー・オブ・ボズヤ',
        'Gleaming Arrow': 'グリッターアロー',
        'Glory Of Bozja': 'グローリー・オブ・ボズヤ',
        'Gods Save The Queen': 'ゴッド・セイブ・ザ・クイーン',
        'Great Ball Of Fire': '火球',
        'Gun Turret': 'ガンタレット',
        'Gunnhildr\'s Blades': 'グンヒルドの剣',
        'Head Down': 'ビーストチャージ',
        'Heaven\'s Wrath': '聖光爆裂斬',
        'Higher Power': '雷気充填',
        'Hot And Cold': '氷炎乱流',
        'Hot Charge': 'ホットチャージ',
        'Hunter\'s Claw': 'ハンタークロウ',
        'Hysteric Assault': 'ヒステリックアサルト',
        'Ice Spikes': 'アイススパイク',
        'Icy Portent': '冷気術',
        'Inescapable Entrapment': '掛罠祭り',
        'Infernal Slash': 'ヤーマスラッシュ',
        'Invert Miasma': '反転瘴気操作',
        'Iron Impact': '熱拳烈気砲',
        'Iron Rose': '熱拳闘気砲',
        'Iron Splitter': '熱拳地脈爆',
        'Judgment Blade': '不動無明剣',
        'Labyrinthine Fate': '迷宮王の呪い',
        'Leaping Spark': '連雷',
        'Left-Sided Shockwave': 'レフトサイド・ショックウェーブ',
        'Lethal Blow': '必殺の一撃',
        'Lingering Miasma': '瘴気雲',
        'Lots Cast': '魔爆発',
        'Maelstrom\'s Bolt': '天鼓雷音稲妻斬',
        'Malediction of Agony': '苦悶の呪詛',
        'Malediction of Ruin': '破滅の呪詛',
        'Mana Flame': 'マナフレイム',
        'Manifest Avatar': '分体生成',
        'Manipulate Miasma': '瘴気操作',
        'Memory of the Labyrinth': '迷宮王の大号令',
        'Merciful Arc': '鋭刃舞踏扇',
        'Merciful Blooms': '鋭刃花車',
        'Merciful Breeze': '鋭刃雪風',
        'Merciful Moon': '鋭刃月光',
        'Mercy Fourfold': '鋭刃四刀流',
        'Northswain\'s Glow': '北斗骨砕斬',
        'Optimal Offensive': '武装突撃',
        'Optimal Play': '武装戦技',
        'Pawn Off': '旋回刃',
        'Phantom Edge': '霊幻剣',
        'Queen\'s Edict': '女王の大勅令',
        'Queen\'s Justice': '処罰令',
        'Queen\'s Shot': '全方位射撃',
        'Queen\'s Will': '女王の勅令',
        'Quick March': '行軍命令',
        'Rapid Bolts': '多重雷',
        'Rapid Sever': '滅多斬り',
        'Reading': '解析',
        'Relentless Battery': '連携戦技',
        'Relentless Play': '連携命令',
        'Rending Bolt': '雷鳴落',
        'Reverberating Roar': '崩落誘発',
        'Reversal Of Forces': '質量転換',
        'Right-Sided Shockwave': 'ライトサイド・ショックウェーブ',
        'Rush': '突進',
        'Seasons Of Mercy': '鋭刃雪月花',
        'Second Mercy': '二手：鋭刃四刀の構え',
        'Secrets Revealed': '実体結像',
        'Shield Omen': '盾の型',
        'Shimmering Shot': 'トゥインクルアロー',
        'Shot In The Dark': '片手撃ち',
        'Sniper Shot': '狙撃',
        'Spit Flame': 'フレイムスピット',
        'Spiteful Spirit': '闘気',
        'Strongpoint Defense': '絶対防御',
        'Summon(?! Adds)': '召喚',
        'Sun\'s Ire': '焼討ち',
        'Surge of Vigor': '奮発',
        'Surging Flames': '火攻め',
        'Surging Flood': '水攻め',
        'Swirling Miasma': '瘴気輪',
        'Sword Omen': '剣の型',
        'The Ends': '十字斬',
        'The Means': '十字撃',
        'Third Mercy': '三手：鋭刃四刀の構え',
        'Thunderous Discharge': '雷気発散',
        'Turret\'s Tour': '跳弾乱舞',
        'Undying Hatred': '超ねんりき',
        'Unlucky Lot': '魔爆',
        'Unrelenting Charge': '爆進',
        'Unseen Eye': '花嵐の幻影',
        'Unwavering Apparition': '羅刹の幻影',
        'Verdant Path': '翠流派',
        'Verdant Tempest': '翠流魔風塵',
        'Vicious Swipe': 'キリ揉み',
        'Vile Wave': '悪意の波動',
        'Weave Miasma': '瘴気術',
        'Weight Of Fortune': '過重力',
        'Whack': '乱打',
        'Winds Of Fate': '大烈風',
        'Winds Of Weight': '過重烈風',
        'Withering Curse': 'こびとの呪い',
        'Wrath Of Bozja': 'ラース・オブ・ボズヤ',
      },
    },
  ],
};
