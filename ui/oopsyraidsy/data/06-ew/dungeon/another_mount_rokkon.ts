import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: does Shishu Onmitsugashira Issen 8662 cleave?
// TODO: does Splitting Cry 841B cleave?
// TODO: taking both Vermilion Aura 840F and Stygian Aura 8410
// TODO: taking two Unnatural Force 8419 stacks

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnotherMountRokkon,
  damageWarn: {
    // Trash
    'AMR Shishu Raiko Disciples of Levin': '8656', // centered circle
    'AMR Shishu Raiko Master of Levin': '8655', // very large donut
    'AMR Shishu Furutsubaki Bloody Carress': '8657', // front conal
    'AMR Shishu Fuko Scythe Tail': '865A', // centered circle
    'AMR Red Shishu Penghou Tornado': '865B', // targeted circle
    'AMR Shishu Yuki Right Swipe': '8685', // 180 right cleave
    'AMR Shishu Yuki Left Swipe': '8686', // 180 left cleave
    'AMR Shishu Yamabiko': '8687', // sprite line aoe
    'AMR Shishu Kotengu Blade of the Tengu': '865F', // Leftward/Rightward/Backward Blows
    'AMR Shishu Onmitsugashira Juji Shuriken': '8664', // untelegraphed front line

    // Shishio
    'AMR Shishio Rokujo Revel 1': '83FC', // first Smokeater line
    'AMR Shishio Rokujo Revel 2': '83FD', // second Smokeater line if 2x inhale
    'AMR Shishio Rokujo Revel 3': '83FE', // second/third Smokeater line if 3x inhale
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
  },
  damageFail: {
    'AMR Shishio Unmitigated Explosion': '8411', // not taking towers
  },
  shareWarn: {
    'AMR Shishu Raiko Barreling Smash': '8653', // line charge
  },
  shareFail: {
    'AMR Shishio Unnatural Ailment': '8418', // spread during Unnatural Wail
  },
  soloFail: {
    'AMR Shishio Unnatural Force': '8419', // stack during Unnaturl Wail
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
