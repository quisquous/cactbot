import fs from 'fs';
import path from 'path';
import process from 'process';
import * as url from 'url';

// TODO: throw some warnings if id lines aren't translated
// TODO: consider doing this at runtime instead of via regex

const __filename = url.fileURLToPath(new URL('.', import.meta.url));
const __dirname = path.basename(__filename);
const root = path.join(__dirname, '../');

const scriptName = 'npm run sync-files';

export type ReplaceDict = { [key: string]: string };

export type ZoneReplace = {
  fileMap: ReplaceDict;
  prefix: ReplaceDict;
  other: ReplaceDict;
  id: ReplaceDict;
};

const zoneReplace: ZoneReplace[] = [
  {
    // Sildihn Criterion
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
    prefix: {
      'SophiaEX': 'SophiaUN',
      'SophiaEx': 'SophiaUn',
    },
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
    // Mount Rokkon Criterion
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
      '7A56': '7A56', // --sync-- various auto damage (trash 2)
      '7A58': '7A58', // --sync-- various auto damage (trash 1)
      '83F8': '841F', // Stormcloud Summons cast and self-targeted ability
      '83F9': '8420', // Smokeater cast and self-targeted ability for first inhale
      '83FA': '8421', // Smokeater self-targeted ability for optional second and third inhales
      '83FB': '8422', // --sync-- ability from Raiun cloud on Shishio after being inhaled
      '83FC': '8423', // Rokujo Revel cast and self-targeted ability for first Smokeater line
      '83FD': '8424', // Rokujo Revel cast and self-targeted ability for followup Smokeater lines
      '83FE': '8425', // Rokujo Revel cast and damage for Smokeater lines
      '83FF': '8426', // Leaping Levin cast and damage from Raiun cloud adds for 1x Smokeater small circles
      '8400': '8427', // Leaping Levin cast and damage from Raiun cloud adds for 2x Smokeater medium circles
      '8401': '8428', // Leaping Levin cast and damage from Raiun cloud adds for 3x Smokeater large circles
      '8402': '8429', // Lightning Bolt cast and self-targeted ability
      '8403': '842A', // Lightning Bolt cast and damage for initial cloud circles
      '8404': '842B', // Cloud to Cloud cast and damage for 1x Smokeater small lines
      '8405': '824C', // Cloud to Cloud cast and damage for 2x Smokeater medium lines
      '8406': '824D', // Cloud to Cloud cast and damage for 3x Smokeater large lines
      '8407': '842E', // Noble Pursuit cast and damage for initial charge
      '8408': '842F', // Noble Pursuit damage for followup changes
      '8409': '8430', // Levinburst line damage for going through rings during Noble Pursuit
      '840A': '8431', // Haunting Cry cast and self-targeted ability to summon Devilish Thrall ghosts
      '840B': '8432', // Right Swipe cast and damage for Devilish Thrall cleave during first Unnatural Wail
      '840C': '8433', // Left Swipe cast and damage for Devilish Thrall cleave during first Unnatural Wail
      '840D': '8434', // Reisho damage from Haunting Thrall untelegraphed aoes
      '840E': '8435', // Vengeful Souls self-targeted ability at the same time as Vermillion/Stygian Aura
      '840F': '8436', // Vermilion Aura damage from taking a tower at the same time as Stygian Aura
      '8410': '8437', // Stygian Aura spread marker damage at the same time as Vermillion Aura
      '8411': '8438', // Unmitigated Explosion damage from not taking towers
      '8412': '8439', // Thunder Vortex cast and damage for untelegraphed donut
      '8413': '843A', // Eye of the Thunder Vortex cast and damage for first "out" circle
      '8414': '843B', // Eye of the Thunder Vortex damage for second "in" donut
      '8415': '843C', // Vortex of the Thunder Eye cast and damage for first "in" donut
      '8416': '843D', // Vortex of the Thunder Eye damage for second "out" circle
      '8417': '843E', // Unnatural Wail cast and self-targeted ability
      '8418': '843F', // Unnatural Ailment damage for Unnatural Wail "spread"
      '8419': '8440', // Unnatural Force damage for Unnatural Wail "stack"
      '841A': '8441', // Enkyo cast and damage for raidwide
      '841B': '8442', // Splitting Cry cast and damage for tankbuster
      '841C': '8443', // Slither fast cast and damage for back conal
      '841D': '8444', // --sync-- repositioning ability
      '841E': '841E', // Enkyo cast and damage for enrage
      '84D3': '84D3', // --sync-- repositioning
      '8502': '8502', // --sync-- auto damage
      '8503': '8503', // Seal of Scurrying Sparks cast and self-targeted ability
      '8504': '8504', // Seal of Scurrying Sparks ability on players that gives Live Brazier/Live Candle debuffs
      '8505': '8539', // Greater Ball of Fire pair stack damage from Live Brazier debuff
      '8506': '853A', // Great Ball of Fire spread damage from Live Candle debuff
      '8507': '8507', // --sync-- auto damage
      '8508': '8508', // Flame and Sulphur cast and self-targeted summoning rocks and lines
      '8509': '8509', // Brazen Ballad cast and self-targeted purple effect that expands everything
      '850A': '850A', // Brazen Ballad cast and self-targeted blue effect that donutifies everything
      '850B': '853C', // Fire Spread expanded line damage after Brazen Ballad 8509
      '850C': '853D', // Fire Spread split line damage after Brazen Ballad 850A
      '850D': '8550', // Worldly Pursuit cast and damage from cross jumps
      '850E': '853F', // Falling Rock expanded rock damage after Brazen Ballad 8509
      '850F': '8540', // Falling Rock donutified rock damage after Brazen Ballad 850A
      '8510': '8510', // Flickering Flame cast and ability (summoning blue flames for 8511)
      '8511': '8541', // Fire Spread cast and damage for waffle lines during second towers
      '8512': '8512', // Rousing Reincarnation cast and self-targeted ability
      '8513': '8584', // Rousing Reincarnation ability on player that gives Odder Incarnation and Rodential Rebirth
      '8514': '8514', // Malformed Reincarnation cast and self-targeted ability
      '8515': '8585', // Malformed Reincarnation ability on player like Rousing Reincarnation, but also gives Odder/Squirrelly Prayer
      '8518': '8518', // Malformed Prayer cast and self-targeted ability that starts the tower sequences
      '8519': '8544', // Burst orange tower damage
      '851A': '8545', // Dramatic Burst missed tower damage (second set? or an orange color?)
      '851B': '8546', // Burst blue tower damage
      '851C': '8547', // Dramatic Burst missed tower damage (first set? or a blue color?)
      '851D': '851D', // Pointed Purgation cast and self-targeted ability before first 851F protean cleave
      '851E': '851E', // Pointed Purgation self-targeted ability before 2/3/4 851F protean cleaves
      '851F': '8548', // Pointed Purgation damage for protean cleave from tether
      '8520': '8520', // Thundercall cast and self-targeted ability that summons Ball of Levin
      '8521': '8521', // Shock cast and self-targeted ability by Ball of Levin
      '8522': '8549', // Shock small ground circle damage from Ball of Levin hit by Humble Hammer
      '8523': '854A', // Shock large ground circle damage from Ball of Levin
      '8524': '8502', // Humble Hammer cast and self-targeted ability
      '8525': '854B', // Humble Hammer cast and damage headmarker on healer that gives mini debuff
      '8526': '8526', // Flintlock self-targeted ability
      '8527': '854C', // Flintlock damage for line stack after Humble Hammer
      '8528': '8628', // Cloud to Ground cast and self-targeted ability
      '8529': '854D', // Cloud to Ground cloud exaflare damage initial hit
      '852A': '854E', // Cloud to Ground cloud exaflare damage ongoing hits
      '852B': '852B', // Fighting Spirits cast and self-targeted
      '852C': '854F', // Fighting Spirits cast and damage for knockback
      '852D': '853E', // Worldly Pursuit untargeted ability jump before 850D cross cast and damage
      '852F': '852F', // Impure Purgation cast and self-targeted ability
      '8530': '8552', // Impure Purgation initial protean damage
      '8531': '8553', // Impure Purgation cast and damage for follow-up protean
      '8532': '8532', // Torching Torment cast and ability on tank that give burns debuff
      '8533': '8554', // Torching Torment cast and damage on tank for tankbuster
      '8534': '8534', // Unenlightenment cast and self-targeted ability
      '8535': '8555', // Unenlightenment damage for raidwide bleed
      '8536': '8536', // Living Hell cast and self-targeted enrage
      '8537': '8537', // Living Hell self-targeted ability for follow-up enrage if 8536 failed
      '8538': '8538', // Living Hell damage for 8536/8537 enrage abilities
      '8593': '8593', // Soldiers of Death cast and self-targeted ability to summon Ashigaru Kyuhei adds
      '8599': '8599', // Boundless Scarlet cast and self-targeted ability to summon red lines
      '859D': '859D', // Boundless Azure cast and self-targeted ability to summon blue lines
      '85AF': '85AF', // --sync-- repositioning
      '85B0': '85E4', // Triple Kasumi-giri long cast and damage for back red first
      '85B1': '85E5', // Triple Kasumi-giri long cast and damage for left red first
      '85B2': '85E6', // Triple Kasumi-giri long cast and damage for front red first
      '85B3': '85E7', // Triple Kasumi-giri long cast and damage for right red first
      '85B4': '85E8', // Triple Kasumi-giri short cast and damage for back red followup
      '85B5': '85E9', // Triple Kasumi-giri short cast and damage for left red followup
      '85B6': '85EA', // Triple Kasumi-giri short cast and damage for front red followup
      '85B7': '85EB', // Triple Kasumi-giri short cast and damage for right red followup
      '85B8': '85EC', // Unbound Spirit damage for red "out" Triple Kasumi-giri marker
      '85B9': '85ED', // Azure Coil damage for blue "in" Triple Kasumi-giri marker
      '85BA': '85EE', // Triple Kasumi-giri long cast and damage for back blue first
      '85BB': '85EF', // Triple Kasumi-giri long cast and damage for left blue first
      '85BC': '85F0', // Triple Kasumi-giri long cast and damage for front blue first
      '85BD': '85F1', // Triple Kasumi-giri long cast and damage for right blue first
      '85BE': '85F2', // Triple Kasumi-giri short cast and damage for back blue followup
      '85BF': '85F3', // Triple Kasumi-giri short cast and damage for left blue followup
      '85C0': '85F4', // Triple Kasumi-giri short cast and damage for front blue followup
      '85C1': '85F5', // Triple Kasumi-giri short cast and damage for right blue followup
      '85C2': '85C2', // Fleeting Iai-giri cast and self-targeted ability for jumping Iai-giri (all types) from boss
      '85C3': '85C3', // --sync-- boss jump ability for Fleeting Iai-giri
      '85C4': '85F6', // Fleeting Iai-giri short cast and damage for back purple Iai-giri
      '85C5': '85F7', // Fleeting Iai-giri short cast and damage for left purple Iai-giri
      '85C6': '85F8', // Fleeting Iai-giri short cast and damage for right purple Iai-giri
      '85C7': '85C7', // Shadow-twin cast and self-targeted to summon Moko's Shadow clones
      '85C8': '85C8', // Double Iai-giri cast and self-targeted ability for Shadow clone (all types)
      '85C9': '85C9', // --sync-- clone jump ability for Shadow Kasumi-giri
      '85CA': '85F9', // Shadow Kasumi-giri short cast and damage for Shadow clone back purple first
      // TODO: 85CE is an unseen guess; it might be unchanged, or most likely 85E2 or 85FD
      // as these are the only "recent" Kenki Release ability ids that are unknown.
      // However, Kenki Release / Iron Rain / Iron Storm are sequential so is likely correct.
      '85CE': '85FD', // Kenki Release cast and raidwide enrage from Shadow clones
      '85CF': '85FE', // Iron Rain very long initial cast and medium circle damage from red Ashigaru Kyuheis
      '85D0': '85FF', // Iron Storm very long initial cast and big circle damage from blue Ashigaru Kyuhei
      '85D1': '8600', // Scarlet Auspice cast and damage for "get out" before Boundless Scarlet
      '85D2': '8601', // Boundless Scarlet cast and damage for initial red lines before they grow
      '85D3': '8602', // Explosion cast and damage for growing red lines
      '85D4': '8603', // Azure Auspice cast and damage for "get under" donut before Boundless Azure
      '85D5': '8604', // Boundless Azure cast and damage for initial blue lines before they bounce
      '85D6': '8605', // Upwell cast and damage for blue line first bounce
      '85D7': '8606', // Upwell damage for blue line ongoing bounces
      '85D8': '85D8', // Far Edge cast and self-targeted ability paired with Accursed Edge on farthest players
      '85D9': '85D9', // Near Edge cast and self-targeted ability paired with Accursed Edge on nearest players
      '85DA': '8607', // Accursed Edge damage and bind on players from Far Edge / Near Edge
      '85DB': '85BD', // Invocation of Vengeance cast and self-targeted ability that gives debuffs during Explosions
      '85DC': '8608', // Vengeful Flame spread damage
      '85DD': '8609', // Vengeful Pyre stack damage
      '85DE': '860A', // Moonless Night cast and raidwide damage to summon Oni's Claw
      '85DF': '860B', // Clearout damage from Oni's Claw large circles hit 3
      '85E0': '860C', // Kenki Release cast and raidwide damage from boss
      // TODO: 85E1 is an unseen guess; it might be unchanged, or most likely 85E2 or 85FD
      // as these are the only "recent" Kenki Release ability ids that are unknown.
      // See note above about 85CE, so 85E2 is the only other unused ability here.
      '85E1': '85E2', // Kenki Release enrage cast from boss
      '85E3': '860D', // Lateral Slice cast and tankbuster damage
      '8653': '8665', // Barreling Smash cast and damage for line charge
      '8654': '8666', // Howl cast and damage for Shishu Raiko raidwide
      '8655': '8667', // Master of Levin cast and damage for Shishu Raiki "get in" donut
      '8656': '8668', // Disciples of Levin cast and damage for Shishu Raiko "get out" circle
      '8657': '8669', // Bloody Caress cast and damage for Shishu Furutsubaki front conal
      '8658': '866A', // Twister cast and damage for Shishu Fuko stack
      '8659': '866B', // Crosswind cast and damage for Shishu Fuko knockback
      '865A': '866C', // Scythe Tail cast and damage for Shishu Fuko "get out"
      '865B': '866D', // Tornado cast and damage for Red Shishu Penghou targeted circle
      '865C': '866E', // Backward Blows cast and self-targeted ability for Shishu Kotengu front->back conals
      '865D': '866F', // Leftward Blows cast and self-targeted ability for Shishu Kotengu front->left conals
      '865E': '8670', // Rightward Blows cast and self-targeted ability for Shishu Kotengu front->right conals
      '865F': '8671', // Blade of the Tengu damage from Shishu Kotengu Blows abilities
      '8660': '8672', // Wrath of the Tengu cast and damage for Shishu Kotengu raidwide + bleed
      '8661': '8673', // Gaze of the Tengu cast and ability for lookaway
      '8662': '8674', // Issen cast and damage for Shishu Onmitsugashira tankbuster
      '8663': '8675', // Huton cast and self-targeted ability for Shishu Onmitsugashira before multiple shuriken
      '8664': '8676', // Juji Shuriken cast and damage for Shishu Onmitsugashira line aoe
      '867D': '867E', // Juji Shuriken cast and damage for Shishu Onmitsugashira multiple fast line aoe
      '8685': '8688', // Right Swipe cast and damage for Shishu Yuki right 180 cleave
      '8686': '8689', // Left Swipe cast and damage for Shishu Yuki left 180 cleave
      '8687': '868A', // Mountain Breeze cast and damage from Shishu Yamabiko sprite line aoe
      '86C4': '86CC', // Shadow Kasumi-giri short cast and damage for Shadow clone left purple followup
      '86C5': '86CD', // Shadow Kasumi-giri short cast and damage for Shadow clone front purple followup
      '86C6': '86CE', // Shadow Kasumi-giri short cast and damage for Shadow clone right purple followup
      '86DF': '86E0', // --sync-- auto damage
      '871F': '871F', // --sync-- unknown self-targeted ability before Lateral Slice or Soldiers of Death
      '8720': '8720', // --sync-- unknown self-targeted ability before Lateral Slice or Soldiers of Death
      '87A7': '87A9', // Iron Rain short followup cast and medium circle damage from red Ashigaru Kyuheis
      '87A8': '87AA', // Iron Storm short followup cast and big circle damage from blue Ashigaru Kyuhei
      '8C21': '8C22', // Clearout cast and damage for Oni's Claw large circles hit 1 (of 3)
      '8C27': '8C28', // Clearout damage from Oni's Claw large circles hit 2
    },
  },
  {
    // Thordan
    fileMap: {
      'ui/raidboss/data/03-hw/trial/thordan-ex.ts': 'ui/raidboss/data/06-ew/trial/thordan-un.ts',
      'ui/raidboss/data/03-hw/trial/thordan-ex.txt': 'ui/raidboss/data/06-ew/trial/thordan-un.txt',
      'ui/oopsyraidsy/data/03-hw/trial/thordan-ex.ts':
        'ui/oopsyraidsy/data/06-ew/trial/thordan-un.ts',
    },
    prefix: { 'ThordanEX': 'ThordanUN' },
    other: {
      'TheMinstrelsBalladThordansReign': 'TheSingularityReactorUnreal',
      'THE MINSTREL\'S BALLAD: THORDAN\'S REIGN': 'THE SINGULARITY REACTOR (UNREAL)',
      'thordan-ex.txt': 'thordan-un.txt',
    },
    id: {
      '1018': '89B7', // Knights teleporting in
      '1019': '89B8', // Knights teleporting out
      '1059': '89B9',
      '105A': '89BA',
      '105B': '89BB', // Thordan teleporting in
      '147D': '89BC', // attack
      '147E': '89BD', // Ascalon's Might
      '147F': '89BE', // Ascalon's Mercy
      '1480': '89BF', // Ascalon's Mercy
      '1481': '89C0', // Lightning Storm
      '1482': '89C1', // Lightning Storm
      '1483': '89C2', // Meteorain
      '1484': '89C3', // Meteorain
      '1485': '89C4', // Ancient Quaga
      '1486': '89C5', // Ancient Quaga enrage
      '1487': '89C6', // Heavenly Heel
      '1488': '89C7', // The Dragon's Eye
      '1489': '89C8', // The Dragon's Gaze
      '148A': '89C9', // The Dragon's Glory
      '148B': '89CA', // The Dragon's Rage
      '148C': '89CB', // Knights Of The Round
      '148D': '89CC', // Ultimate End
      '148E': '89CD', // Ultimate End
      '148F': '89CE', // The Light Of Ascalon
      '1490': '89CF', // Sacred Cross
      '1491': '89D0', // Sacred Cross
      '1492': '89D1', // Spear Of The Fury
      '1493': '89D2', // Divine Right
      '1494': '89D3', // Heavenly Slash
      '1495': '89D4', // Holiest Of Holy
      '1496': '89D5', // Holy Bladedance
      '1497': '89D6', // Holy Shield Bash
      '1499': '89D8', // Dimensional Collapse
      '149A': '89D9', // Dimensional Collapse
      '149B': '89DA', // Faith Unmoving
      '149C': '89DB', // Conviction
      '149D': '89DC', // Conviction
      '149E': '89DD', // Eternal Conviction
      '149F': '89DE', // Heavy Impact
      '14A0': '89DF', // Heavy Impact
      '14A1': '89E0', // Heavy Impact
      '14A2': '89E1', // Heavy Impact
      '14A3': '89E2', // Heavy Impact
      '14A4': '89E3', // Absolute Conviction
      '14A5': '89E4', // Absolute Conviction
      '14A6': '89E5', // Spiral Thrust
      '14A7': '89E6', // Spiral Pierce
      '14A9': '89E8', // Skyward Leap
      '14AA': '89E9', // Heavensward Leap
      '14AB': '89EA', // Heavensflame
      '14AC': '89EB', // Heavensflame
      '14AD': '89EC', // Holy Chain
      '14AE': '89ED', // Hiemal Storm
      '14AF': '89EE', // Hiemal Storm
      '14B0': '89EF', // Holy Meteor
      '14B1': '89F0', // Pure Of Soul
      '14B2': '89F1', // Pure Of Soul
      '14B3': '89F2', // Comet Impact
      '14B4': '89F3', // Meteor Impact
      '14B5': '89F4', // Comet
    },
  },
  {
    // Aloalo Criterion
    fileMap: {
      'ui/raidboss/data/06-ew/dungeon/another_aloalo_island.ts':
        'ui/raidboss/data/06-ew/dungeon/another_aloalo_island-savage.ts',
      'ui/oopsyraidsy/data/06-ew/dungeon/another_aloalo_island.ts':
        'ui/oopsyraidsy/data/06-ew/dungeon/another_aloalo_island-savage.ts',
      'ui/raidboss/data/06-ew/dungeon/another_aloalo_island.txt':
        'ui/raidboss/data/06-ew/dungeon/another_aloalo_island-savage.txt',
    },
    prefix: { 'AAI': 'AAIS' },
    other: {
      'AnotherAloaloIsland': 'AnotherAloaloIslandSavage',
      'another_aloalo_island.txt': 'another_aloalo_island-savage.txt',
      '# Another Aloalo Island': '# Another Aloalo Island (Savage)',
      '\(\'AAI ': '\(\'AAIS ',
    },
    // eslint-disable-next-line max-len
    // grep "^# [A-F0-9]\{4\} " ui/raidboss/data/06-ew/dungeon/another_aloalo_island.txt | sort | sed "s/^..//" | sed "s/^\(....\) \(.*\)$/    '\1': 'TODO', \/\/ \2/"
    // TODO: missing various enrages (both listed and likely unlisted)
    id: {
      '7A56': '7A56', // --sync-- various auto damage (trash 1)
      '7A58': '7A58', // --sync-- various auto damage (trash 2)
      '8874': '8874', // --sync-- repositioning for Lala
      '8889': '8BE0', // Angular Addition self-targeted ability to give boss III
      '888B': '8BE2', // Arcane Blight self-targeted cast for initial back-safe 270 degree rotating cleave
      '888C': '8BE3', // Arcane Blight self-targeted cast for initial front-safe 270 degree rotating cleave
      '888D': '8BE4', // Arcane Blight self-targeted cast for initial east-safe 270 degree rotating cleave
      '888E': '8BE5', // Arcane Blight self-targeted cast for initial west-safe 270 degree rotating cleave
      '888F': '8BE6', // Arcane Blight cast and damage from 270 degree rotating cleave
      '8890': '8BE7', // Arcane Array self-targeted cast to summon moving blue squares (#1)
      '8891': '8BE8', // Bright Pulse cast and damage for initial blue square
      '8892': '8BE9', // Bright Pulse damage from moving blue square
      '8893': '8BEA', // Inferno Divide orange square cross explosion damage during Spatial Tactics
      '8894': '8BEB', // Radiance damage from Arcane Globe being hit by a blue square (Arcane Array #1, #3)
      '8895': '8BEC', // Analysis self-targeted cast before giving players
      '8898': '8BEF', // Planar Tactics self-targeted cast before Arcane Mines
      '8899': '8BF0', // Arcane Mine self-targeted cast to create 8 Arcane Mine squares
      '889A': '8BF1', // Arcane Mine cast and damage for initial Arcane Mine squares
      '889B': '8BF2', // Arcane Combustion damage from walking over an Arcane Mine
      '889C': '8BF3', // Massive Explosion damage from failing to resolve Subractive Suppressor Alpha
      '889D': '8BF4', // Massive Explosion damage from failing to resolve Subractive Suppressor Beta
      '889E': '8BF5', // Symmetric Surge damage from two person stack that gives magic vuln up
      '889F': '8BF6', // Arcane Array self-targeted cast to summon moving blue squares (#2)
      '88A0': '8BF7', // Spatial Tactics self-targeted cast prior to Arcane Array 2
      '88A1': '8BF8', // Symmetric Surge self-targeted cast before this mechanic
      '88A2': '8BF9', // Arcane Plot self-targeted cast to summon blue squares for Symmetric Surge
      '88A3': '8BFA', // Constructive Figure self-targeted cast that summons Aloalo Golem on edge
      '88A4': '8BFB', // Aero II cast and line damage from Aloalo Golem during Symmetric Surge
      '88A5': '8BFC', // Arcane Point self-targeted cast that gives players 88A6 Powerful Light spreads
      '88A6': '8BFD', // Powerful Light spread damage on players that turn the squares they are on blue
      '88A7': '8BFE', // Explosive Theorem self-targeted cast for very large spreads
      '88A8': '8BFF', // Explosive Theorem cast and damage on players for spreads with Telluric Theorem puddles
      '88A9': '8C00', // Telluric Theorem cast and damage for large puddles from Explosive Theorem
      '88AD': '8C04', // Strategic Strike cast and damage for non-cleaving 3x tankbuster
      '88AE': '8C05', // Inferno Theorem cast and raidwide damage
      '8925': '8925', // Locked and Loaded ability during 894A Trick Reload when a bullet is in the gun
      '8926': '8926', // Misload ability during 894A Trick Reload when a bullet missed the gun oops
      '8927': '8927', // --sync-- repositioning from Statice
      '8947': '8964', // --sync-- auto damage from Statice
      '8948': '8965', // Shocking Abandon cast and tankbuster damage
      '8949': '8966', // Aero IV cast and raidwide damage
      '894A': '8967', // Trick Reload self-targeted cast to load gun with 8925/8926
      '894B': '8968', // Trigger Happy self-targeted cast for limit cut dart board
      '894C': '8969', // Trigger Happy cast and damage for limit cut dart board (filled pie slice)
      '894D': '8927', // Surprise Balloon self-targeted cast
      '894E': '896B', // Pop knockback from Surprise Balloon being popped
      '894F': '896C', // Surprise Needle short cast and ability blue line aoe from needle adds that pop balloons
      '8954': '8971', // Uncommon Ground light damage on people who are not on a dartboard color with Bull's-eye
      '8955': '8972', // Present Box self-targeted cast for bombs/donuts/missiles/hands
      '8956': '8973', // Faerie Ring cast and damage for donut rings during Present Box
      '8957': '8974', // Burst high damage from running into Surprising Missile tethered add
      '8958': '8975', // Death by Claw high damage from running into Surprising Claw tethered add
      '8959': '8976', // Trapshooting self-targeted cast after Trick Reload (some instances are 8D1A)
      '895A': '8977', // Trapshooting stack damage from Trick Reload
      '895B': '8978', // Trapshooting spread damage from Trick Reload
      '895C': '8979', // Ring a Ring o' Explosions self-targeted cast for rotating bombs
      '895D': '897A', // Burst cast and damage from bomb explosion
      '895E': '897B', // Fireworks self-targeted cast
      '895F': '897C', // Fireworks two person stack damage during Present Box / Pinwheeling Dartboard
      '8960': '897D', // Fireworks spread damage during Present Box / Pinwheeling Dartboard
      '8963': '8980', // Beguiling Glitter self-targeted cast to give players Face debuffs
      '8982': '896F', // Fire Spread self-targeted damage for initial rotating fire (from Ball of Fire)
      '8987': '8988', // Trigger Happy cast and zero damage for limit cut dart board (empty pie slice)
      '89F9': '89FB', // Fire Spread ongoing rotating fire damage (from Statice)
      '8A6A': '8A6A', // --sync-- ability on Bomb when rotating
      '8A77': '8A77', // --sync-- Ketuduke repositioning
      '8A82': '8A82', // Riptide ability on players from Angry Seas Airy Bubble when you step in one
      '8A83': '8A83', // Fetters ability on players from Angry Seas Airy Bubble when you step in one after 8A82 Riptide
      '8AA7': '8AA7', // --sync-- auto damage from Ketuduke
      '8AA8': '8AA8', // Spring Crystals cast and ability to summon Spring Crystal adds (all flavors)
      '8AA9': '8AD9', // 衝撃 self-targeted ability from Spring Crystal orbs
      '8AAA': '8ADA', // 衝撃 self-targeted ability from Spring Crystal rupees
      '8AAB': '8ADB', // Saturate cast and damage from Spring Crystal orb circle
      '8AAC': '8ADC', // Saturate cast and damage from Spring Crystal rupee line laser
      '8AAD': '8AAD', // Bubble Net self-targeted cast before Bubbles along with 8AAE during Spring Crystals 1
      '8AAE': '8ADD', // Bubble Net cast and ability on players that adds Bubbles/Fetters debuffs during Spring Crystals 1
      '8AAF': '8AAF', // Fluke Typhoon self-targeted cast before 8AB0 knockback during Spring Crystals 3
      '8AB0': '8AB0', // Fluke Typhoon cast and knockback ability on Spring Crystal and players during Spring Crystals 3
      '8AB1': '8AB1', // Fluke Gale self-targeted cast that adds limit cut winds
      '8AB2': '8AB2', // Fluke Gale cast and ability for limit cut 1 wind
      '8AB3': '8AB3', // Fluke Gale cast and ability for limit cut 2 wind
      '8AB4': '8AB4', // Hydrofall self-targeted cast that adds stack markers
      '8AB5': '8AB5', // Hydrofall self-targeted "stack second" ability before Blowing Bubbles
      '8AB6': '8AB6', // Hydrofall ability on players that adds stack debuffs
      '8AB7': '8ADE', // Hydrofall damage from stack debuffs
      '8AB8': '8AB8', // Hydrobullet self-targeted cast that adds stack markers
      '8AB9': '8AB9', // Hydrobullet ability on players that adds spread debuffs
      '8ABA': '8ADF', // Hydrobullet damage from spread debuffs
      '8ABB': '8ABB', // Strewn Bubbles self-targeted cast before 8ABC Sphere Shatter moving arches
      '8ABC': '8AE0', // Sphere Shatter damage from moving arches
      '8ABD': '8ABD', // Blowing Bubbles self-targeted cast that adds Airy Bubble Adds
      '8ABE': '8ABE', // Riptide ability on players from Blowing Bubbles Airy Bubble when you step in one
      '8ABF': '8ABF', // Fetters ability on players from Blowing Bubbles Airy Bubble when you step in one after 8ABE Riptide
      '8AC0': '8AC0', // Angry Seas self-targeted cast for 8AC1 red line knockback
      '8AC1': '8AE1', // Angry Seas cast and knockback damage from red line
      '8AC2': '8AE2', // Burst tower damage
      '8AC3': '8AE3', // Big Burst tower failure damage
      '8AC4': '8AC4', // Roar self-targeted cast that summons Zaratan adds
      '8AC5': '8AC5', // Bubble Net self-targeted cast before Bubbles along with 8AC6 during Spring Crystals 2
      '8AC6': '8AE4', // Bubble Net cast and ability on players that adds Bubbles/Fetters debuffs during Spring Crystals 2
      '8AC7': '8AC7', // Updraft self-targeted cast to boost adds and players into the air
      '8AC8': '8AC8', // Updraft ability on players for 8AC7 Updraft
      '8AC9': '8AE5', // Hundred Lashings cast and damage for non-bubbled Zaratan 180 cleave (no damage on bubbled players)
      '8ACA': '8ACA', // Hundred Lashings self-targeted cast for bubbled Zaratan adds
      '8ACB': '8AE6', // Hundred Lashings cast and damage for bubbled Zaratan 180 cleave (no damage on non-bubbled players)
      '8ACC': '8AE7', // Receding Twintides cast and damage for initial out during out->in
      '8ACD': '8AE8', // Near Tide fast cast and damage for second out during in->out with 8ACE Encroaching Twintides
      '8ACE': '8AE9', // Encroaching Twintides cast and damage for initial in during in->out
      '8ACF': '8AEA', // Far Tide fast cast and damage for second in during out->in with 8ACC Receding Twintides
      '8AD0': '8AD0', // Hydrobomb self-targeted cast for 8AD1 puddles
      '8AD1': '8AEB', // Hydrobomb cast and damage for 3x puddles duruing 8ABD Blowing Bubbles
      '8AD4': '8AD4', // Tidal Roar self-targeted cast for raidwide aoe
      '8AD5': '8AED', // Tidal Roar damage from 8AD4
      '8AD6': 'TODO', // Tidal Roar cast and enrage damage
      '8BB8': '8BC9', // Tail Screw casted damage from Kiwakin baited circle
      '8BB9': '8BCA', // Bubble Shower casted damage from Snipper front conal
      '8BBA': '8BCB', // Crab Dribble fast casted damage from Snipper back conal after Bubble Shower 8BB9
      '8BBB': '8C4F', // Cross Attack casted damage from Monk tankbuster
      '8BBD': '8C4B', // Hydrocannon casted damage from Ray front line
      '8BBE': '8BCD', // Electric Whorl casted damage from Ray "get in"
      '8BBF': '8BCE', // Expulsion casted damage from Ray "get out"
      '8BC0': '8BCF', // --sync-- damage from Twister tornados
      '8BC1': '8BD4', // Ovation cast and damage from Wood Golem front line aoe
      '8BC5': '8C3A', // Gravity Force cast and stack damage from Islekeeper
      '8C23': 'TODO', // Aero IV cast and enrage damage
      '8C24': 'TODO', // Aero IV post-enrage follow-up damage just in case
      '8C25': 'TODO', // Inferno Theorem cast and enrage damage
      '8C2F': 'TODO', // Ancient Quaga cast and damage for Islekeeper raidwide enrage
      '8C4C': '8BD2', // Ancient Aero III interruptable cast and damage for Wood Golem raidwide
      '8C4D': '8BD3', // Tornado cast and damage from Wood Golem that binds the initial target and heavies all targets
      '8C4E': '8C39', // Ancient Quaga cast and damage for Islekeeper raidwide
      '8C53': '8BC4', // Lead Hook damage from hit 3
      '8C62': '8BC6', // Lead Hook damage from hit 2
      '8C63': '8BC8', // Sharp Strike casted damage from Kiwakin tank buster with a concussion dot
      '8C64': '8BCC', // Water III casted damage from Snipper stack marker
      '8C65': '8BD1', // Hydroshot casted damage from Monk knockback line with a dot
      '8C6D': '8C6D', // Hydrobullet self-targeted "spread second" ability before Blowing Bubbles
      '8C6E': '8BC7', // Lead Hook casted damage from Kiwakin 3x tankbuster
      '8C6F': '8C3C', // Isle Drop cast and damage for Islekeeper front circle
      '8CBC': '8CBF', // Pinwheeling Dartboard self-targeted cast to summon dartboard with rotating fire
      '8CBD': '8CC0', // Dartboard of Dancing Explosives self-targeted cast for colored dartboard
      '8CBE': '8CC1', // Burning Chains damage from not breaking chains
      '8CC2': '8CC3', // Uncommon Ground heavy damage on people who are on the same dartboard color with Bull's-eye
      '8CDE': '8CE0', // Targeted Light self-targeted cast for weak spot boss tether
      '8CDF': '8CE1', // Targeted Light cast and damage on players for 8CDE
      '8D1A': '8D1C', // Trapshooting self-targeted cast after Trick Reload (some instances are 8959)
      '8D1F': '8D20', // Radiance damage from Arcane Globe being hit by a blue square (Arcane Array #2)
      '8D2E': '8D2F', // Angular Addition self-targeted ability to give boss V
    },
  },
];

const processFile = (filename: string, zone: ZoneReplace, inputText: string): string => {
  const output = [];

  const blockCommentByExtension = {
    '.ts': [
      `// This file was autogenerated from running ${scriptName}.`,
      '// DO NOT EDIT THIS FILE DIRECTLY.',
      '// Edit the source file below and then run `npm run sync-files`',
      `// Source: ${filename}`,
      '',
    ],
    '.txt': [
      `# This file was autogenerated from running ${scriptName}.`,
      '# DO NOT EDIT THIS FILE DIRECTLY.',
      '# Edit the source file below and then run `npm run sync-files`',
      `# Source: ${filename}`,
      '',
    ],
  };

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
