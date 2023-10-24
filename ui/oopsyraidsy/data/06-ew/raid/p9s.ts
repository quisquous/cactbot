import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { GetShareMistakeText } from '../../../oopsy_common';

export type Data = OopsyData;

// TODO: taking Aero IV 8153 and then Fire IV 8512 without invulns
// TODO: people missing in 816E demolish stacks
// TODO: standing in tornado circles
// TODO: Beastly Bile 8178 without a comet?
// TODO: hitting a comet/player w/ Thunderbolt 817A (always hits boss, so can't use shareWarn)
// TODO: missing a tower 8181 and causing 8182 damage (i.e. whose limit cut #)
// TODO: something about the Pyremeld 8793/8794 charge damage?
// TODO: better info about whose defamation hit other people (i.e. limit cut # if applicable)
// TODO: better info about whose Firemeld spread hit others (i.e. limit cut #)
// TODO: taking a tower with vuln
// TODO: taking two Pile Pyre / Thunder III (if people are dead)

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheNinthCircleSavage,
  damageWarn: {
    'P9S Blizzard III 1': '8157', // ice donut
    'P9S Blizzard III 2': '8159', // empowered ice donut
    'P9S Uplift': '815E', // walls appearing
    'P9S Archaic Rockbreaker Knockback': '815F', // purple knockback circle
    'P9S Archaic Rockbreaker Fuse': '8161', // small fuse explosions
    'P9S Outside Roundhouse': '8239', // circle
    'P9S Inside Roundhouse': '8238', // donut
    'P9S Swinging Kick 1': '8222', // kick during Front Combination
    'P9S Swinging Kick 2': '8223', // kick during Rear Combination
    'P9S Swinging Kick 5': '8795', // kick during Front Firestrikes
    'P9S Swinging Kick 6': '8796', // kick during Rear Firestrikes
    'P9S Ball of Levin': '817F', // orb explosion creating a tower in Levinstrike
    'P9S Charybdis': '8171', // initial tornado circles
    'P9S Comet Burst': '8174', // circle from comet explosion
  },
  damageFail: {
    'P9S Ecliptic Meteor': '8188', // not LOS-ing meteor
  },
  shareWarn: {
    'P9S Thunder III 1': '815B', // thunder protean
    'P9S Thunder III 2': '815A', // empowered thunder protean
    'P9S Icemeld 1': '8183', // defamation 1
    'P9S Icemeld 2': '8190', // defamation 2
    'P9S Icemeld 3': '8191', // defamation 3
    'P9S Icemeld 4': '8192', // defamation 4
  },
  shareFail: {
    'P9S Firemeld': '8180', // Levinstrike spread damage
  },
  soloFail: {
    'P9S Pile Pyre 1': '8156', // partner stacks
    'P9S Pile Pyre 2': '8158', // empowered partner stacks
    'P9S Archaic Rockbreaker Partner': '8162', // partner stacks after Shockwave
  },
  triggers: [
    {
      id: 'P9S Fire IV / Aero IV Share',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['8152', '8153'] }),
      condition: (data, matches) => !data.IsImmune(matches.targetId),
      mistake: (_data, matches) => {
        const numTargets = parseInt(matches.targetCount);
        if (numTargets === 1 || isNaN(numTargets))
          return;
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: GetShareMistakeText(matches.ability, numTargets),
        };
      },
    },
  ],
};

export default triggerSet;
