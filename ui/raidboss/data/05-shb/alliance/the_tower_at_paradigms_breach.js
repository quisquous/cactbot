import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO:
//   Assuming Stacking the Deck always puts Knave of Hearts as #1; needs confirmation
//   Assuming one Lunge + Colossal Impact pattern; needs confirmation
//   Hansel and Gretel Bloody Sweep
//   Hansel and Gretel Stronger Together Tethered
//   Hansel & Gretel Passing Lance
//   Hansel & Gretel Breakthrough
//   2P-operated Flight Unit adds
//   Red Girl
//   Meng-Zi / Xun-Zi
//   Better Her Inflorescence Recreate Structure
//   Her Inflorescence Distortion
//   Her Inflorescence Pillar Impact

export default {
  zoneId: ZoneId.TheTowerAtParadigmsBreach,
  timelineFile: 'the_tower_at_paradigms_breach.txt',
  triggers: [
    {
      id: 'Paradigm Knave Roar',
      netRegex: NetRegexes.startsUsing({ id: '5EB5', source: 'Knave Of Hearts', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Knave Colossal Impact Sides',
      netRegex: NetRegexes.startsUsing({ id: '5EA4', source: 'Knave Of Hearts', capture: false }),
      durationSeconds: 5,
      response: Responses.goMiddle(),
    },
    {
      id: 'Paradigm Copied Knave Colossal Impact Sides',
      netRegex: NetRegexes.startsUsing({ id: '5EA4', source: 'Copied Knave', capture: false }),
      // Cast time of 8 seconds, clones start casting 6 seconds into the cast.
      delaySeconds: 2.1,
      durationSeconds: 5,
      response: Responses.goMiddle(),
    },
    {
      id: 'Paradigm Knave Colossal Impact Middle',
      netRegex: NetRegexes.startsUsing({ id: '5EA7', source: 'Knave Of Hearts', capture: false }),
      durationSeconds: 5,
      response: Responses.goSides(),
    },
    {
      id: 'Paradigm Copied Knave Colossal Impact Middle',
      netRegex: NetRegexes.startsUsing({ id: '5EA7', source: 'Copied Knave', capture: false }),
      delaySeconds: 2.1,
      durationSeconds: 5,
      response: Responses.goFrontBack(),
    },
    {
      // Also applies for Red Girl Manipulate Energy
      id: 'Paradigm Knave Magic Artillery Beta You',
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'Paradigm Knave Magic Artillery Beta Collect',
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Paradigm Knave Magic Artillery Beta Not You',
      netRegex: NetRegexes.headMarker({ id: '00DA', capture: false }),
      delaySeconds: 0.5,
      durationSeconds: 4,
      suppressSeconds: 5,
      infoText: function(data, _, output) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer')
          return output.tankBuster();

        return output.avoidTankBuster();
      },
      run: (data) => delete data.busterTargets,
      outputStrings: {
        tankBuster: {
          en: 'Tank Buster',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '坦克死刑',
          ko: '탱버',
        },
        avoidTankBuster: {
          en: 'Avoid tank buster',
          de: 'Tank buster ausweichen',
          fr: 'Évitez le tank buster',
          ja: 'タンクバスターを避ける',
          cn: '远离坦克死刑',
          ko: '탱버 피하기',
        },
      },
    },
    {
      id: 'Paradigm Knave Magic Artillery Alpha Spread',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      response: Responses.spread(),
    },
    {
      id: 'Paradigm Knave Lunge',
      netRegex: NetRegexes.startsUsing({ id: '5EB1', source: 'Knave of Hearts', capture: false }),
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (from boss)',
        },
      },
    },
    {
      id: 'Paradigm Copied Knave Lunge',
      netRegex: NetRegexes.startsUsing({ id: '5EB1', source: 'Copied Knave', capture: false }),
      condition: (data) => !data.cloneLunge,
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (from clone)',
        },
      },
      run: (data) => data.cloneLunge = true,
    },
    {
      id: 'Paradigm Copied Knave Lunge Out of Middle',
      netRegex: NetRegexes.startsUsing({ id: '60C8', source: 'Knave of Hearts', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (from clone) + Out of Middle',
        },
      },
    },
    {
      id: 'Paradigm Gretel Upgraded Shield',
      netRegex: NetRegexes.startsUsing({ id: '5C69', source: 'Gretel', capture: false }),
      durationSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Hansel',
        },
      },
    },
    {
      id: 'Paradigm Hansel Upgraded Shield',
      netRegex: NetRegexes.startsUsing({ id: '5C6B', source: 'Hansel', capture: false }),
      durationSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Gretel',
        },
      },
    },
    {
      id: 'Paradigm Hansel/Gretel Wail',
      netRegex: NetRegexes.startsUsing({ id: '5C7[67]', source: ['Hansel', 'Gretel'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Hansel/Gretel Crippling Blow',
      netRegex: NetRegexes.startsUsing({ id: '5C7[89]', source: ['Hansel', 'Gretel'] }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      response: Responses.tankBuster(),
    },
    {
      id: 'Paradigm Hansel/Gretel Seed Of Magic Alpha',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      response: Responses.spread(),
    },
    {
      id: 'Paradigm Hansel/Gretel Riot Of Magic',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      response: Responses.stackMarker(),
    },
    {
      id: 'Paradigm Red Girl Cruelty',
      netRegex: NetRegexes.startsUsing({ id: '6012', source: 'Red Girl', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Red Sphere Wave: White',
      netRegex: NetRegexes.startsUsing({ id: '618D', source: 'Red Sphere', capture: false }),
      durationSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Switch to white',
        },
      },
    },
    {
      id: 'Paradigm Red Sphere Wave: Black',
      netRegex: NetRegexes.startsUsing({ id: '618E', source: 'Red Sphere', capture: false }),
      durationSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Switch to black',
        },
      },
    },
    {
      id: 'Paradigm Meng-Zi/Xun-Zi Universal Assault',
      netRegex: NetRegexes.startsUsing({ id: '5C06', source: ['Meng-Zi', 'Xun-Zi'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm False Idol Screaming Score',
      netRegex: NetRegexes.startsUsing({ id: '5BDD', source: 'False Idol', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm False Idol Made Magic Left',
      netRegex: NetRegexes.startsUsing({ id: '5BD6', source: 'False Idol', capture: false }),
      durationSeconds: 5,
      response: Responses.goRight(),
    },
    {
      id: 'Paradigm False Idol Made Magic Right',
      netRegex: NetRegexes.startsUsing({ id: '5BD7', source: 'False Idol', capture: false }),
      durationSeconds: 5,
      response: Responses.goLeft(),
    },
    {
      id: 'Paradigm False Idol Darker Note You',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank Buster and Spread',
        },
      },
    },
    {
      id: 'Paradigm False Idol Darker Note Collect',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Paradigm False Idol Darker Note Not You',
      netRegex: NetRegexes.headMarker({ id: '008B', capture: false }),
      delaySeconds: 0.5,
      durationSeconds: 4,
      suppressSeconds: 5,
      infoText: function(data, _, output) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer')
          return output.tankBuster();

        return output.avoidTankBuster();
      },
      run: (data) => delete data.busterTargets,
      outputStrings: {
        tankBuster: {
          en: 'Tank Buster',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '坦克死刑',
          ko: '탱버',
        },
        avoidTankBuster: {
          en: 'Avoid tank buster',
          de: 'Tank buster ausweichen',
          fr: 'Évitez le tank buster',
          ja: 'タンクバスターを避ける',
          cn: '远离坦克死刑',
          ko: '탱버 피하기',
        },
      },
    },
    {
      id: 'Paradigm Her Inflorescence Screaming Score',
      netRegex: NetRegexes.startsUsing({ id: '5BF5', source: 'Her Inflorescence', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Paradigm Her Inflorescence Recreate Structure',
      netRegex: NetRegexes.startsUsing({ id: '5BE1', source: 'Her Inflorescence', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Building Below',
        },
      },
    },
    {
      id: 'Paradigm Her Inflorescence Recreate Signal',
      netRegex: NetRegexes.startsUsing({ id: '5BE3', source: 'Her Inflorescence', capture: false }),
      durationSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go To Red Light',
        },
      },
    },
    {
      id: 'Paradigm Her Inflorescence Heavy Arms Middle',
      netRegex: NetRegexes.startsUsing({ id: '5BED', source: 'Her Inflorescence', capture: false }),
      durationSeconds: 4,
      response: Responses.goSides(),
    },
    {
      id: 'Paradigm Her Inflorescence Heavy Arms Sides',
      netRegex: NetRegexes.startsUsing({ id: '5BEF', source: 'Her Inflorescence', capture: false }),
      durationSeconds: 4,
      response: Responses.goFrontBack(),
    },
  ],
  timelineReplace: [],
};
