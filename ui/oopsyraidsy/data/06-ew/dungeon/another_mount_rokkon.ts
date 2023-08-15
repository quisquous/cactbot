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
// TODO: who missed Gorai towers or was not hit by protean

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
    'AMR Gorai Impure Purgation Second': '8531', // follow-up protean
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
  },
  soloFail: {
    'AMR Shishio Unnatural Force': '8419', // pair stack during Unnatural Wail
    'AMR Gorai Greater Ball of Fire': '8505', // pair stack from Live Brazier debuff
    'AMR Gorai Flintlock': '8527', // line share
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
