import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: does Shishu Onmitsugashira Issen 8662 cleave?
// TODO: does Splitting Cry 841B cleave?
// TODO: taking both Vermilion Aura 840F and Stygian Aura 8410
// TODO: taking two Unnatural Force 8419 stacks
// TODO: standing in outside of Shishio arena
// TODO: better track who didn't take Shishio towers
// TODO: does Gorai Torching Torment cleave?
// TODO: Humble Hammer share damage
// TODO: who missed Gorai towers or was not hit by protean
// TODO: does Lateral Slice cleave
// TODO: 85CE whose adds were too close

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnotherMountRokkon,
  damageWarn: {
    // Trash 1
    'AMR Shishu Raiko Disciples of Levin': '8656', // centered circle
    'AMR Shishu Raiko Master of Levin': '8655', // very large donut
    'AMR Shishu Furutsubaki Bloody Carress': '8657', // front conal
    'AMR Shishu Fuko Scythe Tail': '865A', // centered circle
    'AMR Red Shishu Penghou Tornado': '865B', // targeted circle
    'AMR Shishu Yuki Right Swipe': '8685', // 180 right cleave
    'AMR Shishu Yuki Left Swipe': '8686', // 180 left cleave

    // Shishio
    'AMR Shishio Rokujo Revel': '83FE', // Smokeater line
    'AMR Shishio Raiun Leaping Levin 1': '83FF', // Raiun 1x Smokeater small cloud circles
    'AMR Shishio Raiun Leaping Levin 2': '8400', // Raiun 1x Smokeater medium cloud circles
    'AMR Shishio Raiun Leaping Levin 3': '8401', // Raiun 1x Smokeater large cloud circles
    'AMR Shishio Lightning Bolt': '8403', // initial Cloud to Cloud circles
    'AMR Shishio Cloud to Cloud 1': '8404', // 1x Smokeater small lines
    'AMR Shishio Cloud to Cloud 2': '8405', // 2x Smokeater medium lines
    'AMR Shishio Cloud to Cloud 3': '8406', // 3x Smokeater large lines
    'AMR Shishio Noble Pursuit 1': '8407', // initial charge line
    'AMR Shishio Noble Pursuit 2': '8408', // followup charge line
    'AMR Shishio Levinburst': '8409', // line damage during Noble Pursuit
    'AMR Shishio Devilish Thrall Right Swipe': '840B', // 180 right cleave from adds
    'AMR Shishio Devilish Thrall Left Swipe': '840C', // 180 left cleave from adds
    'AMR Shishio Haunting Thrall Reisho': '840D', // untelegraphed white explosions from Thralls
    'AMR Shishio Thunder Vortex': '8412', // donut
    'AMR Shishio Eye of the Thunder Vortex 1': '8413', // first "out" circle
    'AMR Shishio Eye of the Thunder Vortex 2': '8414', // second "in" donut
    'AMR Shishio Vortex of the Thunder Eye 1': '8415', // first "in" donut
    'AMR Shishio Vortex of the Thunder Eye 2': '8416', // second "out" circle
    'AMR Shishio Slither': '841C', // back conal

    // Trash 2
    'AMR Shishu Yamabiko': '8687', // sprite line aoe
    'AMR Shishu Kotengu Blade of the Tengu': '865F', // Leftward/Rightward/Backward Blows
    'AMR Shishu Onmitsugashira Juji Shuriken': '8664', // untelegraphed front line
    'AMR Shishu Onmitsugashira Juji Shuriken Huton': '867D', // untelegraphed fast front line on all players

    // Gorai
    'AMR Gorai Fire Spread Purple': '850B', // line damage after purple Brazen Ballad
    'AMR Gorai Fire Spread Blue': '850C', // line damage after blue Brazen Ballad
    'AMR Gorai Falling Rock Purple': '850E', // expanded rock damage after purple Brazen Ballad
    'AMR Gorai Falling Rock Blue': '850F', // donutified rock damage after purple Brazen Ballad
    'AMR Gorai Ball of Levin Shock Small': '8522', // small circle from Ball of Levin hit by Humble Hammer
    'AMR Gorai Ball of Levin Shock Big': '8523', // large circle from Ball of Levin
    'AMR Gorai Cloud to Ground 1': '8529', // initial cloud exaflare
    'AMR Gorai Cloud to Ground 2': '852A', // ongoing cloud exaflare
    'AMR Gorai Impure Purgation Second': '8531', // follow-up protean'

    // Moko
    'AMR Moko Triple Kasumi-Giri 1': '85B0', // back red first
    'AMR Moko Triple Kasumi-Giri 2': '85B1', // left red first
    'AMR Moko Triple Kasumi-Giri 3': '85B2', // front red first
    'AMR Moko Triple Kasumi-Giri 4': '85B3', // right red first
    'AMR Moko Triple Kasumi-Giri 5': '85B4', // back red followup
    'AMR Moko Triple Kasumi-Giri 6': '85B5', // left red followup
    'AMR Moko Triple Kasumi-Giri 7': '85B6', // front red followup
    'AMR Moko Triple Kasumi-Giri 8': '85B7', // right red followup
    'AMR Moko Triple Kasumi-Giri 9': '85BA', // back blue first
    'AMR Moko Triple Kasumi-Giri 10': '85BB', // left blue first
    'AMR Moko Triple Kasumi-Giri 11': '85BC', // front blue first
    'AMR Moko Triple Kasumi-Giri 12': '85BD', // right blue first
    'AMR Moko Triple Kasumi-Giri 13': '85BE', // back blue followup
    'AMR Moko Triple Kasumi-Giri 14': '85BF', // left blue followup
    'AMR Moko Triple Kasumi-Giri 15': '85C0', // front blue followup
    'AMR Moko Triple Kasumi-Giri 16': '85C1', // right blue followup
    'AMR Moko Unbound Spirit': '85B8', // red "out" Triple Kasumi-Giri
    'AMR Moko Azure Coil': '85B9', // blue "in" Triple Kasumi-Giri

    'AMR Moko Scarlet Auspice': '85D1', // "get out" before Boundless Scarlet
    'AMR Moko Boundless Scarlet': '85D2', // initial red lines before they grow
    'AMR Moko Explosion': '85D3', // growing red lines
    'AMR Moko Azure Auspice': '85D4', // "get under" donut before Boundless Azure
    'AMR Moko Boundless Azure': '85D5', // initial blue lines before they bounce
    'AMR Moko Upwell 1': '85D6', // blue line first bounce
    'AMR Moko Upwell 2': '85D7', // blue line ongoing bounces

    'AMR Moko Fleeting Iai-Giri 1': '85C4', // back purple
    'AMR Moko Fleeting Iai-Giri 2': '85C5', // left purple
    'AMR Moko Fleeting Iai-Giri 3': '85C6', // right purple

    'AMR Moko Shadow Kasumi-Giri 1': '85CA', // back purple first
    'AMR Moko Shadow Kasumi-giri 2': '86C4', // left purple followup
    'AMR Moko Shadow Kasumi-giri 3': '86C5', // front purple followup
    'AMR Moko Shadow Kasumi-giri 4': '86C6', // right purple followup

    'AMR Moko Oni\'s Claw Clearout 1': '8C21', // hit 1 of large circles
    'AMR Moko Oni\'s Claw Clearout 2': '8C27', // hit 2 of large circles
    'AMR Moko Oni\'s Claw Clearout 3': '85DF', // hit 3 of large circles

    'AMR Moko Ashigaru Kyuhei Iron Rain 1': '85CF', // initial medium circle damage from red Ashigaru Kyuheis
    'AMR Moko Ashigaru Kyuhei Iron Rain 2': '87A7', // followup medium circle damage from red Ashigaru Kyuheis
    'AMR Moko Ashigaru Kyuhei Iron Storm 1': '85D0', // initial big circle damage from blue Ashigaru Kyuhei
    'AMR Moko Ashigaru Kyuhei Iron Storm 2': '87A8', // followup big circle damage from blue Ashigaru Kyuhei
  },
  damageFail: {
    'AMR Shishio Unmitigated Explosion': '8411', // not taking towers
  },
  gainsEffectWarn: {
    // BF9 = 9999s duration, BFA = 15s duration
    'AMR Gorai Burns': 'BF9', // standing in outside square of Gorai
  },
  shareWarn: {
    'AMR Shishu Raiko Barreling Smash': '8653', // line charge
    'AMR Gorai Pointed Purgation': '851F', // protean tether during towers
    'AMR Gorai Impure Purgation': '8530', // initial protean for double hit protean
  },
  shareFail: {
    'AMR Shishio Unnatural Ailment': '8418', // spread during Unnatural Wail
    'AMR Gorai Great Ball of Fire': '8506', // spread damage from Live Candle debuff
    'AMR Gorai Worldy Pursuit': '850D', // cross jumps
    'AMR Moko Vengeful Flame': '85DC', // spreads during Fleeting Iai-giri
    'AMR Moko Accursed Edge': '85DA', // bind on players from Far Edge / Near Edge
  },
  soloFail: {
    'AMR Shishio Unnatural Force': '8419', // pair stack during Unnatural Wail
    'AMR Gorai Greater Ball of Fire': '8505', // pair stack from Live Brazier debuff
    'AMR Gorai Flintlock': '8527', // tank block line share
    'AMR Moko Vengeful Pyre': '85DD', // pair stack during Fleeting Iai-giri
  },
  triggers: [
    {
      id: 'AMR Shishu Kotengu Gaze of the Tengu',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8661', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
  ],
};

export default triggerSet;
