import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  seenDiamondDust?: boolean;
}

// Shiva Hard
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheAkhAfahAmphitheatreHard,
  damageWarn: {
    // Large white circles.
    'ShivaHm Icicle Impact': '993',
    // Avoidable tank stun.
    'ShivaHm Glacier Bash': '9A1',
  },
  shareWarn: {
    // Knockback tank cleave.
    'ShivaHm Heavenly Strike': '9A0',
    // Hailstorm spread marker.
    'ShivaHm Hailstorm': '998',
  },
  shareFail: {
    // Tankbuster.  This is Shiva Hard mode, not Shiva Extreme.  Please!
    'ShivaHm Icebrand': '996',
  },
  triggers: [
    {
      id: 'ShivaHm Diamond Dust',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '98A' }),
      run: (data) => {
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaHm Deep Freeze',
      type: 'GainsEffect',
      // Shiva also uses ability 9A3 on you, but it has the untranslated name
      // 透明：シヴァ：凍結レクト：ノックバック用. So, use the effect instead for free translation.
      netRegex: NetRegexes.gainsEffect({ effectId: '1E7' }),
      condition: (data) => {
        // The intermission also gets this effect, so only a mistake after that.
        // Unlike extreme, this has the same 20 second duration as the intermission.
        return data.seenDiamondDust;
      },
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
};

export default triggerSet;
