import fs from 'fs';
import path from 'path';
import process from 'process';
import * as url from 'url';

// TODO: throw some warnings if id lines aren't translated
// TODO: consider doing this at runtime instead of via regex

const __filename = url.fileURLToPath(new URL('.', import.meta.url));
const __dirname = path.basename(__filename);
const root = path.join(__dirname, '../');

const scriptName = 'ts-node util/sync_files.ts';

const blockCommentByExtension = {
  '.ts': [
    `// This file was autogenerated from running ${scriptName}.`,
    '// DO NOT EDIT THIS FILE DIRECTLY.',
    '',
  ],
  '.txt': [
    `# This file was autogenerated from running ${scriptName}.`,
    '# DO NOT EDIT THIS FILE DIRECTLY.',
    '',
  ],
};

export type ReplaceDict = { [key: string]: string };

export type ZoneReplace = {
  fileMap: ReplaceDict;
  prefix: ReplaceDict;
  other: ReplaceDict;
  id: ReplaceDict;
};

const zoneReplace: ZoneReplace[] = [
  {
    // Criterion
    fileMap: {
      'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane.ts':
        'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane-savage.ts',
      'ui/oopsyraidsy/data/06-ew/dungeon/another_sildihn_subterrane.ts':
        'ui/oopsyraidsy/data/06-ew/dungeon/another_sildihn_subterrane-savage.ts',
      'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane.txt':
        'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane-savage.txt',
    },
    prefix: { 'ASS': 'ASSS' },
    other: {
      'AnotherSildihnSubterrane': 'AnotherSildihnSubterraneSavage',
      'another_sildihn_subterrane.txt': 'another_sildihn_subterrane-savage.txt',
      '# Another Sil\'dihn Subterrane': '# Another Sil\'dihn Subterrane (Savage)',
    },
    id: {
      '7490': '76BB',
      '7499': '76BC',
      '749C': '76BD',
      '749E': '76BE',
      '74A1': '76BF',
      '74A6': '76C1',
      '74AD': '76C4',
      '74AF': '76C5',
      '74B1': '76C6',
      '74B2': '76C7',
      '74B4': '76C8',
      '74B5': '76C9',
      '74B7': '76CA',
      '74B9': '76CC',
      '74BB': '76CD',
      '7658': '779A',
      '7659': '779B',
      '765A': '779C',
      '765B': '779D',
      '765C': '779E',
      '765D': '779F',
      '765E': '77A0',
      '765F': '77A1',
      '7660': '77A2',
      '7661': '77A3',
      '7662': '77A4',
      '7663': '77A5',
      '7664': '77A6',
      '7666': '77A8',
      '7667': '77A9',
      '7668': '77AA',
      '7669': '77AB',
      '766A': '77AC',
      '766B': '77AD',
      '766C': '77AE',
      '766E': '77B0',
      '766F': '77B1',
      '7670': '77B2',
      '7671': '77B3',
      '7672': '77B4',
      '7673': '77B5',
      '7674': '77B6',
      '7675': '77B7',
      '7676': '77B8',
      '7677': '77B9',
      '7678': '77BA',
      '7679': '77BB',
      '768C': '77BC',
      '768D': '77BE',
      '774F': '7772',
      '7750': '7773',
      '7751': '7774',
      '7752': '7775',
      '7753': '7776',
      '7754': '7777',
      '7755': '7778',
      '7756': '7779',
      '7757': '777A',
      '7758': '777B',
      '7759': '777C',
      '775A': '777D',
      '775D': '7780',
      '775E': '7781',
      '7760': '7783',
      '7761': '7784',
      '7762': '7785',
      '7763': '7786',
      '7764': '7787',
      '7765': '7788',
      '7766': '7789',
      '7767': '778A',
      '7768': '778B',
      '7769': '778C',
      '776A': '778D',
      '776C': '778F',
      '776D': '7790',
      '776E': '7791',
      '776F': '7792',
      '7770': '7793',
      '7771': '7794',
      '77EA': '77EC',
      '7957': '796F',
      '7958': '7970',
      '7959': '7971',
      '795A': '7972',
      '795B': '7973',
      '795C': '7974',
      '795D': '7975',
      '795F': '7977',
      '7960': '7978',
      '7961': '7979',
      '7962': '797A',
      '7963': '797B',
      '7964': '797C',
      '7965': '797D',
      '7966': '797E',
      '7968': '7980',
      '7969': '7981',
      '796A': '7982',
      '796B': '7983',
      '796C': '7984',
      '79E0': '79E1',
      '79F3': '79F4',

      // Unchanged abilities, Criterion.
      '6854': '6854', // unnamed ability before sculptor's passion
      '77AE': '77AE', // sculptor's passion (self-targeted)
      '7491': '7491', // infern brand (self-targeted)
      '74B0': '74B0', // firesteel strike (self-targeted)
    },
  },
  {
    // Sophia
    fileMap: {
      'ui/raidboss/data/03-hw/trial/sophia-ex.ts': 'ui/raidboss/data/06-ew/trial/sophia-un.ts',
      'ui/raidboss/data/03-hw/trial/sophia-ex.txt': 'ui/raidboss/data/06-ew/trial/sophia-un.txt',
      'ui/oopsyraidsy/data/03-hw/trial/sophia-ex.ts':
        'ui/oopsyraidsy/data/06-ew/trial/sophia-un.ts',
    },
    prefix: { 'SophiaEX': 'SophiaUN' },
    other: {
      'ContainmentBayP1T6Extreme': 'ContainmentBayP1T6Unreal',
      'sophia-ex.txt': 'sophia-un.txt',
      '(Extreme)': '(Unreal)',
      ' Extreme': ' Unreal',
    },
    id: {
      '1981': '7D9C', // Scales of Wisdom 1
      '1983': '7D9D', // --Barbelo Separates-- (unnamed, ignored)
      '1984': '7D9E', // --Barbelo Rejoins-- (unnamed, ignored)
      '1988': '7D9F', // Infusion
      '1989': '7DA0', // Unknown (ignored)
      '196E': '7D9B', // Meteor Quasar Snapshot 1
      '19A7': '7DA1', // Meteor Quasar Snapshot 2
      '19A8': '7DA2', // Tilt Quasar Orange (ignored)
      '19A9': '7DA3', // Tilt Quasar Blue (ignored)
      '19AA': '7DA4', // Execute (storage cast)
      '19AB': '7DA5', // Duplicate
      '19AC': '7DA6', // Thunder III
      '19AD': '7DA7', // Execute (Thunder III)
      '19AE': '7DA8', // Aero III
      '19AF': '7DA9', // Execute (Aero III)
      '19B0': '7DAA', // Thunder II
      '19B1': '7DAB', // Execute (Thunder II)
      '19B3': '7DAD', // Dischordant Cleansing 1
      '19B5': '7DAF', // Dischordant Cleansing 2
      '19B6': '7DB0', // Divine Spark
      '19B8': '7DB2', // Gnostic Rant
      '19B9': '7DB3', // Gnostic Spear
      '19BA': '7DB4', // Ring of Pain
      '19BB': '7DB5', // Vertical Kenoma
      '19BC': '7DB6', // Horizontal Kenoma
      '19BD': '7DB7', // Revengeance
      '19BE': '7DB8', // Cloudy Heavens
      '19BF': '7DB9', // Light Dew (Execute)
      '19C0': '7DBA', // Light Dew (Onrush)
      '19C1': '7DBB', // Onrush
      '19C2': '7DBC', // Gnosis
      '19C3': '7DBD', // auto-attack
      '19C4': '7DBE', // Arms of Wisdom
      '19C5': '7DBF', // Cintamani
      '1A4C': '7E46', // Quasar (tilt)
      '1A87': '7E81', // Meteor Quasar Detonate
      '1ABE': '7EB8', // Unknown (ignored)
      '1ABF': '7EB9', // Unknown (ignored)
      '1AE0': '7DC5', // Cintamani Enrage
      '1AE1': '7DC6', // Scales of Wisdom 2
    },
  },
  {
    // Zurvan
    fileMap: {
      'ui/raidboss/data/03-hw/trial/zurvan-ex.ts': 'ui/raidboss/data/06-ew/trial/zurvan-un.ts',
      'ui/raidboss/data/03-hw/trial/zurvan-ex.txt': 'ui/raidboss/data/06-ew/trial/zurvan-un.txt',
      'ui/oopsyraidsy/data/03-hw/trial/zurvan-ex.ts':
        'ui/oopsyraidsy/data/06-ew/trial/zurvan-un.ts',
    },
    prefix: { 'ZurvanEX': 'ZurvanUN' },
    other: {
      'ContainmentBayZ1T9Extreme': 'ContainmentBayZ1T9Unreal',
      'zurvan-ex.txt': 'zurvan-un.txt',
      '(Extreme)': '(Unreal)',
      ' Extreme': ' Unreal',
      'Sarva': 'Eidos',
    },
    id: {
      '1E3F': '857F', // Metal Cutter
      '1C4E': '8557', // Flare Star puddles appear
      '1C4F': '8558', // Flare Star puddles resolve
      '1C50': '8559', // The Purge
      '1C51': '855A', // Sarva/Eidos 1
      '1C52': '855B', // Twin Spirit 1 (ignored)
      '1C53': '855C', // Twin Spirit 2 (ignored)
      '1C54': '855D', // Flaming Halberd
      '1C55': '855E', // Demonic Dive
      '1C56': '855F', // Cool Flame
      '1C57': '8560', // Sarva/Eidos 2
      '1C58': '8561', // Ice And Fire
      '1C59': '8562', // Biting Halberd
      '1C5A': '8563', // Tail End
      '1C5B': '8564', // Ciclicle
      '1C5C': '8565', // Southern Cross Snapshot
      '1C5D': '8566', // Southern Cross Resolve
      '1C5E': '8567', // Untranslated intermission cast
      '1C5F': '8568', // Sarva/Eidos 3
      '1C60': '8569', // Ahura Mazda
      '1C63': '856C', // Meracydian Meteor (ignored)
      '1C64': '856D', // Comet (fire puddles)
      '1C67': '8570', // Infinite Fire
      '1C68': '8571', // Infinite Ice
      '1C6B': '8572', // The South Star (ignored)
      '1C6C': '8573', // The North Star (ignored)
      '1C6D': '8576', // Tyrfing (cast)
      '1C6E': '8577', // Tyrfing (resolve, ignored)
      '1C6F': '8578', // Fire III
      '1C70': '8579', // Metal Cutter
      '1C71': '857A', // The Demon's Claw
      '1C72': '857B', // Wave Cannon (stack)
      '1C73': '857C', // Wave Cannon (avoid)
      '1DC7': '857D', // Broken Seal
      '1E09': '857E', // Soar
      '1E31': '856A', // Hard Thrust (ignored)
      '1E32': '856B', // Berserk (ignored)
      '1E35': '856E', // Meracydian Fire
      '1E36': '856F', // Meracydian Fear
      '1E58': '8591', // Flame Halberd Enrage 1
      '1E59': '8592', // Flame Halberd Enrage 2
      '1E64': '859D', // The South Star (ignored)
      '1E65': '859E', // The North Star (ignored)
    },
  },
  {
    // Criterion
    fileMap: {
      'ui/raidboss/data/06-ew/dungeon/another_mount_rokkon.ts':
        'ui/raidboss/data/06-ew/dungeon/another_mount_rokkon-savage.ts',
      'ui/oopsyraidsy/data/06-ew/dungeon/another_mount_rokkon.ts':
        'ui/oopsyraidsy/data/06-ew/dungeon/another_mount_rokkon-savage.ts',
      'ui/raidboss/data/06-ew/dungeon/another_mount_rokkon.txt':
        'ui/raidboss/data/06-ew/dungeon/another_mount_rokkon-savage.txt',
    },
    prefix: { 'AMR': 'AMRS' },
    other: {
      'AnotherMountRokkon': 'AnotherMountRokkonSavage',
      'another_mount_rokkon.txt': 'another_mount_rokkon-savage.txt',
      '# Another Mount Rokkon': '# Another Mount Rokkon (Savage)',
    },
    // eslint-disable-next-line max-len
    // grep "^# [A-F0-9]\{4\} " ui/raidboss/data/06-ew/dungeon/another_mount_rokkon.txt | sort | sed "s/^..//" | sed "s/^\(....\) \(.*\)$/    '\1': 'TODO', \/\/ \2/"
    id: {
      '7A56': 'TODO', // --sync-- various auto damage (trash 2)
      '7A58': '7A58', // --sync-- various auto damage (trash 1)
      '83F8': 'TODO', // Stormcloud Summons cast and self-targeted ability
      '83F9': 'TODO', // Smokeater cast and self-targeted ability for first inhale
      '83FA': 'TODO', // Smokeater self-targeted ability for optional second and third inhales
      '83FB': 'TODO', // --sync-- ability from Raiun cloud on Shishio after being inhaled
      '83FC': 'TODO', // Rokujo Revel cast and self-targeted ability for first Smokeater line
      '83FD': 'TODO', // Rokujo Revel cast and self-targeted ability for followup Smokeater lines
      '83FE': 'TODO', // Rokujo Revel cast and damage for Smokeater lines
      '83FF': 'TODO', // Leaping Levin cast and damage from Raiun cloud adds for 1x Smokeater small circles
      '8400': 'TODO', // Leaping Levin cast and damage from Raiun cloud adds for 2x Smokeater medium circles
      '8401': 'TODO', // Leaping Levin cast and damage from Raiun cloud adds for 3x Smokeater large circles
      '8402': 'TODO', // Lightning Bolt cast and self-targeted ability
      '8403': 'TODO', // Lightning Bolt cast and damage for initial cloud circles
      '8404': 'TODO', // Cloud to Cloud cast and damage for 1x Smokeater small lines
      '8405': 'TODO', // Cloud to Cloud cast and damage for 2x Smokeater medium lines
      '8406': 'TODO', // Cloud to Cloud cast and damage for 3x Smokeater large lines
      '8407': 'TODO', // Noble Pursuit cast and damage for initial charge
      '8408': 'TODO', // Noble Pursuit damage for followup changes
      '8409': 'TODO', // Levinburst line damage for going through rings during Noble Pursuit
      '840A': 'TODO', // Haunting Cry cast and self-targeted ability to summon Devilish Thrall ghosts
      '840B': 'TODO', // Right Swipe cast and damage for Devilish Thrall cleave during first Unnatural Wail
      '840C': 'TODO', // Left Swipe cast and damage for Devilish Thrall cleave during first Unnatural Wail
      '840D': 'TODO', // Reisho damage from Haunting Thrall untelegraphed aoes
      '840E': 'TODO', // Vengeful Souls self-targeted ability at the same time as Vermillion/Stygian Aura
      '840F': 'TODO', // Vermilion Aura damage from taking a tower at the same time as Stygian Aura
      '8410': 'TODO', // Stygian Aura spread marker damage at the same time as Vermillion Aura
      '8411': 'TODO', // Unmitigated Explosion damage from not taking towers
      '8412': 'TODO', // Thunder Vortex cast and damage for untelegraphed donut
      '8413': 'TODO', // Eye of the Thunder Vortex cast and damage for first "out" circle
      '8414': 'TODO', // Eye of the Thunder Vortex damage for second "in" donut
      '8415': 'TODO', // Vortex of the Thunder Eye cast and damage for first "in" donut
      '8416': 'TODO', // Vortex of the Thunder Eye damage for second "out" circle
      '8417': 'TODO', // Unnatural Wail cast and self-targeted ability
      '8418': 'TODO', // Unnatural Ailment damage for Unnatural Wail "spread"
      '8419': 'TODO', // Unnatural Force damage for Unnatural Wail "stack"
      '841A': 'TODO', // Enkyo cast and damage for raidwide
      '841B': 'TODO', // Splitting Cry cast and damage for tankbuster
      '841C': 'TODO', // Slither fast cast and damage for back conal
      '841D': 'TODO', // --sync-- repositioning ability
      '841E': 'TODO', // Enkyo cast and damage for enrage
      '84D3': 'TODO', // --sync-- repositioning
      '8502': 'TODO', // --sync-- auto damage
      '8503': 'TODO', // Seal of Scurrying Sparks cast and self-targeted ability
      '8504': 'TODO', // Seal of Scurrying Sparks ability on players that gives Live Brazier/Live Candle debuffs
      '8505': 'TODO', // Greater Ball of Fire pair stack damage from Live Brazier debuff
      '8506': 'TODO', // Great Ball of Fire spread damage from Live Candle debuff
      '8507': 'TODO', // --sync-- auto damage
      '8508': 'TODO', // Flame and Sulphur cast and self-targeted summoning rocks and lines
      '8509': 'TODO', // Brazen Ballad cast and self-targeted purple effect that expands everything
      '850A': 'TODO', // Brazen Ballad cast and self-targeted blue effect that donutifies everything
      '850B': 'TODO', // Fire Spread expanded line damage after Brazen Ballad 8509
      '850C': 'TODO', // Fire Spread split line damage after Brazen Ballad 850A
      '850D': 'TODO', // Worldly Pursuit cast and damage from cross jumps
      '850E': 'TODO', // Falling Rock expanded rock damage after Brazen Ballad 8509
      '850F': 'TODO', // Falling Rock donutified rock damage after Brazen Ballad 850A
      '8510': 'TODO', // Flickering Flame cast and ability (summoning blue flames for 8511)
      '8511': 'TODO', // Fire Spread cast and damage for waffle lines during second towers
      '8512': 'TODO', // Rousing Reincarnation cast and self-targeted ability
      '8513': 'TODO', // Rousing Reincarnation ability on player that gives Odder Incarnation and Rodential Rebirth
      '8514': 'TODO', // Malformed Reincarnation cast and self-targeted ability
      '8515': 'TODO', // Malformed Reincarnation ability on player like Rousing Reincarnation, but also gives Odder/Squirrelly Prayer
      '8518': 'TODO', // Malformed Prayer cast and self-targeted ability that starts the tower sequences
      '8519': 'TODO', // Burst orange tower damage
      '851A': 'TODO', // Dramatic Burst missed tower damage (second set? or an orange color?)
      '851B': 'TODO', // Burst blue tower damage
      '851C': 'TODO', // Dramatic Burst missed tower damage (first set? or a blue color?)
      '851D': 'TODO', // Pointed Purgation cast and self-targeted ability before first 851F protean cleave
      '851E': 'TODO', // Pointed Purgation self-targeted ability before 2/3/4 851F protean cleaves
      '851F': 'TODO', // Pointed Purgation damage for protean cleave from tether
      '8520': 'TODO', // Thundercall cast and self-targeted ability that summons Ball of Levin
      '8521': 'TODO', // Shock cast and self-targeted ability by Ball of Levin
      '8522': 'TODO', // Shock small ground circle damage from Ball of Levin hit by Humble Hammer
      '8523': 'TODO', // Shock large ground circle damage from Ball of Levin
      '8524': 'TODO', // Humble Hammer cast and self-targeted ability
      '8525': 'TODO', // Humble Hammer cast and damage headmarker on healer that gives mini debuff
      '8526': 'TODO', // Flintlock self-targeted ability
      '8527': 'TODO', // Flintlock damage for line stack after Humble Hammer
      '8528': 'TODO', // Cloud to Ground cast and self-targeted ability
      '8529': 'TODO', // Cloud to Ground cloud exaflare damage initial hit
      '852A': 'TODO', // Cloud to Ground cloud exaflare damage ongoing hits
      '852B': 'TODO', // Fighting Spirits cast and self-targeted
      '852C': 'TODO', // Fighting Spirits cast and damage for knockback
      '852D': 'TODO', // Worldly Pursuit untargeted ability jump before 850D cross cast and damage
      '852F': 'TODO', // Impure Purgation cast and self-targeted ability
      '8530': 'TODO', // Impure Purgation initial protean damage
      '8531': 'TODO', // Impure Purgation cast and damage for follow-up protean
      '8532': 'TODO', // Torching Torment cast and ability on tank that give burns debuff
      '8533': 'TODO', // Torching Torment cast and damage on tank for tankbuster
      '8534': 'TODO', // Unenlightenment cast and self-targeted ability
      '8535': 'TODO', // Unenlightenment damage for raidwide bleed
      '8536': 'TODO', // Living Hell cast and self-targeted enrage
      '8537': 'TODO', // Living Hell self-targeted ability for follow-up enrage if 8536 failed
      '8538': 'TODO', // Living Hell damage for 8536/8537 enrage abilities
      '8593': 'TODO', // Soldiers of Death cast and self-targeted ability to summon Ashigaru Kyuhei adds
      '8599': 'TODO', // Boundless Scarlet cast and self-targeted ability to summon red lines
      '859D': 'TODO', // Boundless Azure cast and self-targeted ability to summon blue lines
      '85AF': 'TODO', // --sync-- repositioning
      '85B0': 'TODO', // Triple Kasumi-giri long cast and damage for back red first
      '85B1': 'TODO', // Triple Kasumi-giri long cast and damage for left red first
      '85B2': 'TODO', // Triple Kasumi-giri long cast and damage for front red first
      '85B3': 'TODO', // Triple Kasumi-giri long cast and damage for right red first
      '85B4': 'TODO', // Triple Kasumi-giri short cast and damage for back red followup
      '85B5': 'TODO', // Triple Kasumi-giri short cast and damage for left red followup
      '85B6': 'TODO', // Triple Kasumi-giri short cast and damage for front red followup
      '85B7': 'TODO', // Triple Kasumi-giri short cast and damage for right red followup
      '85B8': 'TODO', // Unbound Spirit damage for red "out" Triple Kasumi-giri marker
      '85B9': 'TODO', // Azure Coil damage for blue "in" Triple Kasumi-giri marker
      '85BA': 'TODO', // Triple Kasumi-giri long cast and damage for back blue first
      '85BB': 'TODO', // Triple Kasumi-giri long cast and damage for left blue first
      '85BC': 'TODO', // Triple Kasumi-giri long cast and damage for front blue first
      '85BD': 'TODO', // Triple Kasumi-giri long cast and damage for right blue first
      '85BE': 'TODO', // Triple Kasumi-giri short cast and damage for back blue followup
      '85BF': 'TODO', // Triple Kasumi-giri short cast and damage for left blue followup
      '85C0': 'TODO', // Triple Kasumi-giri short cast and damage for front blue followup
      '85C1': 'TODO', // Triple Kasumi-giri short cast and damage for right blue followup
      '85C2': 'TODO', // Fleeting Iai-giri cast and self-targeted ability for jumping Iai-giri (all types) from boss
      '85C3': 'TODO', // --sync-- boss jump ability for Fleeting Iai-giri
      '85C4': 'TODO', // Fleeting Iai-giri short cast and damage for back purple Iai-giri
      '85C5': 'TODO', // Fleeting Iai-giri short cast and damage for left purple Iai-giri
      '85C6': 'TODO', // Fleeting Iai-giri short cast and damage for right purple Iai-giri
      '85C7': 'TODO', // Shadow-twin cast and self-targeted to summon Moko's Shadow clones
      '85C8': 'TODO', // Double Iai-giri cast and self-targeted ability for Shadow clone (all types)
      '85C9': 'TODO', // --sync-- clone jump ability for Shadow Kasumi-giri
      '85CA': 'TODO', // Shadow Kasumi-giri short cast and damage for Shadow clone back purple first
      '85CE': 'TODO', // Kenki Release cast and raidwide enrage from Shadow clones
      '85CF': 'TODO', // Iron Rain very long initial cast and medium circle damage from red Ashigaru Kyuheis
      '85D0': 'TODO', // Iron Storm very long initial cast and big circle damage from blue Ashigaru Kyuhei
      '85D1': 'TODO', // Scarlet Auspice cast and damage for "get out" before Boundless Scarlet
      '85D2': 'TODO', // Boundless Scarlet cast and damage for initial red lines before they grow
      '85D3': 'TODO', // Explosion cast and damage for growing red lines
      '85D4': 'TODO', // Azure Auspice cast and damage for "get under" donut before Boundless Azure
      '85D5': 'TODO', // Boundless Azure cast and damage for initial blue lines before they bounce
      '85D6': 'TODO', // Upwell cast and damage for blue line first bounce
      '85D7': 'TODO', // Upwell damage for blue line ongoing bounces
      '85D8': 'TODO', // Far Edge cast and self-targeted ability paired with Accursed Edge on farthest players
      '85D9': 'TODO', // Near Edge cast and self-targeted ability paired with Accursed Edge on nearest players
      '85DA': 'TODO', // Accursed Edge damage and bind on players from Far Edge / Near Edge
      '85DB': 'TODO', // Invocation of Vengeance cast and self-targeted ability that gives debuffs during Explosions
      '85DC': 'TODO', // Vengeful Flame spread damage
      '85DD': 'TODO', // Vengeful Pyre stack damage
      '85DE': 'TODO', // Moonless Night cast and raidwide damage to summon Oni's Claw
      '85DF': 'TODO', // Clearout damage from Oni's Claw large circles hit 3
      '85E0': 'TODO', // Kenki Release cast and raidwide damage from boss
      '85E3': 'TODO', // Lateral Slice cast and tankbuster damage
      '8653': '8665', // Barreling Smash cast and damage for line charge
      '8654': '8666', // Howl cast and damage for Shishu Raiko raidwide
      '8655': '8667', // Master of Levin cast and damage for Shishu Raiki "get in" donut
      '8656': '8668', // Disciples of Levin cast and damage for Shishu Raiko "get out" circle
      '8657': '8669', // Bloody Caress cast and damage for Shishu Furutsubaki front conal
      '8658': 'TODO', // Twister cast and damage for Shishu Fuko stack
      '8659': 'TODO', // Crosswind cast and damage for Shishu Fuko knockback
      '865A': 'TODO', // Scythe Tail cast and damage for Shishu Fuko "get out"
      '865B': 'TODO', // Tornado cast and damage for Red Shishu Penghou targeted circle
      '865C': 'TODO', // Backward Blows cast and self-targeted ability for Shishu Kotengu front->back conals
      '865D': 'TODO', // Leftward Blows cast and self-targeted ability for Shishu Kotengu front->left conals
      '865E': 'TODO', // Rightward Blows cast and self-targeted ability for Shishu Kotengu front->right conals
      '865F': 'TODO', // Blade of the Tengu damage from Shishu Kotengu Blows abilities
      '8660': 'TODO', // Wrath of the Tengu cast and damage for Shishu Kotengu raidwide + bleed
      '8661': 'TODO', // Gaze of the Tengu cast and ability for lookaway
      '8662': 'TODO', // Issen cast and damage for Shishu Onmitsugashira tankbuster
      '8663': 'TODO', // Huton cast and self-targeted ability for Shishu Onmitsugashira before multiple shuriken
      '8664': 'TODO', // Juji Shuriken cast and damage for Shishu Onmitsugashira line aoe
      '867D': 'TODO', // Juji Shuriken cast and damage for Shishu Onmitsugashira multiple fast line aoe
      '8685': '8668', // Right Swipe cast and damage for Shishu Yuki right 180 cleave
      '8686': '8669', // Left Swipe cast and damage for Shishu Yuki left 180 cleave
      '8687': 'TODO', // Mountain Breeze cast and damage from Shishu Yamabiko sprite line aoe
      '86C4': 'TODO', // Shadow Kasumi-giri short cast and damage for Shadow clone left purple followup
      '86C5': 'TODO', // Shadow Kasumi-giri short cast and damage for Shadow clone front purple followup
      '86C6': 'TODO', // Shadow Kasumi-giri short cast and damage for Shadow clone right purple followup
      '86DF': 'TODO', // --sync-- auto damage
      '871F': 'TODO', // --sync-- unknown self-targeted ability before Lateral Slice or Soldiers of Death
      '8720': 'TODO', // --sync-- unknown self-targeted ability before Lateral Slice or Soldiers of Death
      '87A7': 'TODO', // Iron Rain short followup cast and medium circle damage from red Ashigaru Kyuheis
      '87A8': 'TODO', // Iron Storm short followup cast and big circle damage from blue Ashigaru Kyuhei
      '8C21': 'TODO', // Clearout cast and damage for Oni's Claw large circles hit 1 (of 3)
      '8C27': 'TODO', // Clearout damage from Oni's Claw large circles hit 2
    },
  },
];

const processFile = (filename: string, zone: ZoneReplace, inputText: string): string => {
  const output = [];
  for (const [extension, comment] of Object.entries(blockCommentByExtension)) {
    if (filename.endsWith(extension)) {
      output.push(...comment);
      break;
    }
  }

  const lines = inputText.split('\r\n');
  const prefixes = Object.entries(zone.prefix);
  const others = Object.entries(zone.other);
  const ids = Object.entries(zone.id);

  for (const inputLine of lines) {
    let line = inputLine;

    // TODO: consider matching: /^\s*id: '/ or /^\s* '/
    for (const [inputId, outputId] of prefixes)
      line = line.replace(` '${inputId} `, ` '${outputId} `);
    for (const [input, output] of others)
      line = line.replace(input, output);
    for (const [inputId, outputId] of ids)
      line = line.replace(`${inputId}`, `${outputId}`);

    output.push(line);
  }

  return output.join('\r\n');
};

const processAllFiles = async (root: string) => {
  for (const zone of zoneReplace) {
    for (const [input, output] of Object.entries(zone.fileMap)) {
      try {
        const inputFile = await fs.promises.readFile(path.join(root, input));
        const outputText = processFile(input, zone, inputFile.toString());
        await fs.promises.writeFile(output, outputText);
      } catch (e) {
        console.error(e);
      }
    }
  }

  process.exit(0);
};

void processAllFiles(root);
