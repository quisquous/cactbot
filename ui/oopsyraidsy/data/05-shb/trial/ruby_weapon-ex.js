import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// TODO: taking two different High-Powered Homing Lasers (4AD8)
// TODO: could blame the tethered player for White Agony / White Fury failures?

// Ruby Weapon Extreme
export default {
  zoneId: ZoneId.CinderDriftExtreme,
  damageWarn: {
    'RubyEx Ruby Bit Magitek Ray': '4AD2', // line aoes during helicoclaw
    'RubyEx Spike Of Flame 1': '4AD3', // initial explosion during helicoclaw
    'RubyEx Spike Of Flame 2': '4B2F', // followup helicoclaw explosions
    'RubyEx Spike Of Flame 3': '4D04', // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 4': '4D05', // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 5': '4ACD', // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 6': '4ACE', // ravensclaw explosion at ends of lines
    'RubyEx Undermine': '4AD0', // ground aoes under the ravensclaw patches
    'RubyEx Ruby Ray': '4B02', // frontal laser
    'RubyEx Ravensflight 1': '4AD9', // dash around the arena
    'RubyEx Ravensflight 2': '4ADA', // dash around the arena
    'RubyEx Ravensflight 3': '4ADD', // dash around the arena
    'RubyEx Ravensflight 4': '4ADE', // dash around the arena
    'RubyEx Ravensflight 5': '4ADF', // dash around the arena
    'RubyEx Ravensflight 6': '4AE0', // dash around the arena
    'RubyEx Ravensflight 7': '4AE1', // dash around the arena
    'RubyEx Ravensflight 8': '4AE2', // dash around the arena
    'RubyEx Ravensflight 9': '4AE3', // dash around the arena
    'RubyEx Ravensflight 10': '4AE4', // dash around the arena
    'RubyEx Ravensflight 11': '4AE5', // dash around the arena
    'RubyEx Ravensflight 12': '4AE6', // dash around the arena
    'RubyEx Ravensflight 13': '4AE7', // dash around the arena
    'RubyEx Ravensflight 14': '4AE8', // dash around the arena
    'RubyEx Ravensflight 15': '4AE9', // dash around the arena
    'RubyEx Ravensflight 16': '4AEA', // dash around the arena
    'RubyEx Ravensflight 17': '4E6B', // dash around the arena
    'RubyEx Ravensflight 18': '4E6C', // dash around the arena
    'RubyEx Ravensflight 19': '4E6D', // dash around the arena
    'RubyEx Ravensflight 20': '4E6E', // dash around the arena
    'RubyEx Ravensflight 21': '4E6F', // dash around the arena
    'RubyEx Ravensflight 22': '4E70', // dash around the arena
    'RubyEx Cut And Run 1': '4B05', // slow charge across arena after stacks
    'RubyEx Cut And Run 2': '4B06', // slow charge across arena after stacks
    'RubyEx Cut And Run 3': '4B07', // slow charge across arena after stacks
    'RubyEx Cut And Run 4': '4B08', // slow charge across arena after stacks
    'RubyEx Cut And Run 5': '4DOD', // slow charge across arena after stacks
    'RubyEx Meteor Burst': '4AF2', // meteor exploding
    'RubyEx Bradamante': '4E38', // headmarkers with line aoes
    'RubyEx Comet Heavy Impact': '4AF6', // letting a tank comet land
  },
  damageFail: {
    'RubyEx Ruby Sphere Burst': '4ACB', // exploding the red mine
    'RubyEx Lunar Dynamo': '4EB0', // "get in" from Raven's Image
    'RubyEx Iron Chariot': '4EB1', // "get out" from Raven's Image
    'RubyEx Heart In The Machine': '4AFA', // White Agony/Fury skull hitting players
  },
  shareWarn: {
    'RubyEx Homing Lasers': '4AD6', // spread markers during cut and run
    'RubyEx Meteor Stream': '4E68', // spread markers during P2
  },
  gainsEffectFail: {
    'RubyEx Hysteria': '128', // Negative Aura lookaway failure
  },
  triggers: [
    {
      id: 'RubyEx Screech',
      netRegex: NetRegexes.ability({ id: '4AEE' }),
      deathReason: (e, data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked into wall',
            de: 'Rückstoß in die Wand',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '넉백',
          },
        };
      },
    },
  ],
};
