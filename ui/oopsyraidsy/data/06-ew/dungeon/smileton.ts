import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.Smileton,
  damageWarn: {
    'Smileton Smiley Wanderer Empty Beleaguer': '6964', // targeted circle
    'Smileton Smiley Lunatender La Vie en Epines': '695E', // frontal line
    'Smileton Smiley Lunatender Anthine Needles': '695F', // ??
    'Smileton Smiley Panopt Retinal Glare': '696A', // frontal cone
    'Smileton Face Mixed Feelings': '6738', // lines between relatively small faces
    'Smileton Smiley Scraper Headspin': '695D', // centered circle
    'Smileton Smiley Daphnia Acrid Stream': '6960', // targeted circle
    'Smileton Smiley Metalloid Lattice': '6969', // long line aoe
    'Smileton Frameworker Leap Forward': '6746', // jump to large circle
    'Smileton Frameworker Printed Worker Leap Forward': '6747', // jump to large circle
    'Smileton Frameworker Omnidirectional Onslaught': '6749', // alternating pinwheel'
    'Smileton Smiley Dynamite Burst': '696B', // quick centered circle near death
    'Smileton Smiley Regolith Metamorphic Blast': '6967', // large conal
    'Smileton Smiley Regolith Orogenic Storm': '6968', // targeted circle
    'Smileton Smiley Supporter Fire Fighter': '695C', // donut aoe
    'Smileton Smiley Sweeper Sewer Water 1': '6962', // front/back cleave
    'Smileton Smiley Sweeper Sewer Water 2': '6963', // front/back cleave
    'Smileton The Big Cheese Bomb Iron Kiss': '674D', // moving bomb circular explosion
    'Smileton The Big Cheese Excavation Bomb Excavated': '6C32', // mine explosion after Explosive Power
    'Smileton The Big Cheese Right Disassembler': '674F', // right cleave
    'Smileton The Big Cheese Left Disassembler': '6750', // left cleave
  },
  shareWarn: {
    'Smileton Face Temper, Temper': '6740', // spread
    'Smileton The Big Cheese Leveling Missiles': '', // spread
  },
  soloWarn: {
    'Smileton The Big Cheese Electric Arc': '6753', // stack marker
  },
  triggers: [
    {
      id: 'Smileton Face Wrong Face',
      type: 'GainsEffect',
      // ACB = Smiley Face
      // ACC = Frowny Face
      // Taking this multiple times stacks the effect.
      netRegex: NetRegexes.gainsEffect({ effectId: 'AC[BC]', source: 'Face' }),
      condition: (_data, matches) => parseInt(matches.count) > 1,
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: `${matches.effect} x${matches.count}`,
            de: `${matches.effect} x${matches.count}`,
          },
        };
      },
    },
  ],
};

export default triggerSet;
