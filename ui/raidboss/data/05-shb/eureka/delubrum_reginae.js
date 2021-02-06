import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Outputs from '../../../../../resources/outputs.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: warnings for mines after bosses?

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (data, matches) => {
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
};

export default {
  zoneId: ZoneId.DelubrumReginae,
  timelineFile: 'delubrum_reginae.txt',
  triggers: [
    // *** Trinity Seeker ***
    {
      id: 'Delubrum Seeker Verdant Tempest',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AB6', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Seeker Mercy Fourfold',
      // No indication which sword is which, but that's honestly for the best
      // because how would you even describe these directions.  The boss has
      // a full circle targetting circle too to only make it worse.
      // * First Mercy: 5B5D
      // * Second Mercy: 5B5E
      // * Third Mercy: 5B5F
      // * Fourth Mercy: 5B60
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5B5D', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In, Watch Swords',
        },
      },
    },
    {
      id: 'Delubrum Seeker Baleful Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AA1', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Out Behind Barricade',
        },
      },
    },
    {
      id: 'Delubrum Seeker Baleful Blade Knockback',
      // We could call this on Phantom Edge 5AA0, but maybe that's too early?
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AA2', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Knocked Into Barricade',
        },
      },
    },
    {
      // There is no castbar for 5AB7, only this headmarker.
      id: 'Delubrum Seeker Merciful Arc',
      netRegex: NetRegexes.headMarker({ id: '00F3' }),
      condition: tankBusterOnParty,
      // TODO: is this a cleave?
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Seeker Iron Impact',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5ADB', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Stack',
        },
      },
    },
    {
      id: 'Delubrum Seeker Iron Splitter',
      // Note: 5AA3 is used as starts casting for both of these abilities, but the damage
      // comes out with different ability ids.
      // Note: 5A9A is a respositioning ability, but the location data is stale and represents where
      // the boss was, and not where the boss ends up.  This is another case where knowing combatant
      // positioning data on starts casting would be a huge help.
      // TODO: we could call out directions with getCombatants? (The center appears to be 0, 278.)
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AA3', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // FIXME: this could be worded better
          en: 'Opposite Color From Boss',
        },
      },
    },
    {
      id: 'Delubrum Seeker Burning Chains',
      netRegex: NetRegexes.headMarker({ id: '00EE' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Chain on YOU',
        },
      },
    },
    {
      // TODO: the FFXIV parser plugin does not include this as a "gains effect" line.
      id: 'Delubrum Seeker Burning Chains Move',
      netRegex: NetRegexes.headMarker({ id: '00EE' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 4,
      response: Responses.breakChains(),
    },
    {
      id: 'Delubrum Seeker Dead Iron',
      netRegex: NetRegexes.headMarker({ id: '00ED' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker('alert'),
    },
    {
      id: 'Delubrum Seeker Seasons of Mercy',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AAA', capture: false }),
      // 5 second cast time + 2 seconds before flower appears - 1 second for reading time?
      delaySeconds: 6,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far From Purple / Look Away From Orb',
        },
      },
    },
    // *** Dahu ***
    {
      id: 'Delubrum Dahu Shockwave',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: ['5761', '5762'] }),
      // There's a 3s slow windup on the first, then a 1s opposite cast.
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (matches.id === '5761')
          return output.leftThenRight();
        return output.rightThenLeft();
      },
      outputStrings: {
        leftThenRight: {
          en: 'Left, Then Right',
          de: 'Links, dann Rechts',
          fr: 'Gauche, puis droite',
          ja: '左 => 右',
          cn: '左 => 右',
          ko: '왼쪽 => 오른쪽',
        },
        rightThenLeft: {
          en: 'Right, Then Left',
          de: 'Rechts, dann Links',
          fr: 'Droite, puis gauche',
          ja: '右 => 左',
          cn: '右 => 左',
          ko: '오른쪽 => 왼쪽',
        },
      },
    },
    {
      // TODO: is this true if you see a Feral Howl #4 and onward?
      id: 'Delubrum Dahu Feral Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5755', capture: false }),
      alertText: (data, _, output) => {
        if (data.seenFeralHowl)
          return output.knockbackAvoid();
        return output.knockback();
      },
      run: (data) => data.seenFeralHowl = true,
      outputStrings: {
        knockback: Outputs.knockback,
        knockbackAvoid: {
          en: 'Knockback (Avoid Adds)',
        },
      },
    },
    {
      id: 'Delubrum Dahu Hot Charge',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5764', capture: false }),
      // This happens twice in a row
      suppressSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Opposite First Charge',
        },
      },
    },
    {
      // TODO: is this true? I haven't seen this.
      id: 'Delubrum Dahu Ripper Claw',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '575D', capture: false }),
      response: Responses.awayFromFront('alert'),
    },
    // *** Queen's Guard ***
    {
      id: 'Delubrum Guard Secrets Revealed',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '56BE', capture: false }),
      infoText: (data, _, output) => {
        if (data.seenSecretsRevealed)
          return output.followUntethered();
        return output.awayFromTethered();
      },
      outputStrings: {
        awayFromTethered: {
          en: 'Away from tethered adds',
        },
        followUntethered: {
          en: 'Follow untethered adds',
        },
      },
      run: (data) => data.seenSecretsRevealed = true,
    },
    {
      id: 'Delubrum Guard Rapid Sever',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5809' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Guard Blood And Bone',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5808', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Guard Shot In The Dark',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '5811' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Guard Automatic Turret',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '580B', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Avoid Laser Bounces',
      },
    },
    {
      id: 'Delubrum Guard Queen\'s Shot',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5810', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Guard Reversal Of Forces',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '57FF', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand On Small Bomb',
        },
      },
      run: (data) => data.reversalOfForces = true,
    },
    {
      id: 'Delubrum Guard Above Board',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '57FC', capture: false }),
      alertText: (data, _, output) => {
        if (data.reversalOfForces)
          return;
        return output.text();
      },
      run: (data) => delete data.reversalOfForces,
      outputStrings: {
        text: {
          en: 'Stand On Large Bomb',
        },
      },
    },
    {
      id: 'Delubrum Guard Shield Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '57F1', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Delubrum Guard Sword Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '57F0', capture: false }),
      response: Responses.getOut(),
    },
    // *** Bozjan Phantom
    {
      id: 'Delubrum Phantom Weave Miasma',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57A3', capture: false }),
      preRun: (data) => data.weaveMismaCount = (data.weaveMiasmaCount || 0) + 1,
      delaySeconds: 3,
      infoText: (data, _, output) => {
        if (data.weaveMiasmaCount && data.weaveMiasmaCount >= 3)
          return output.weaveWithKnockback();
        return output.weaveNoKnockback();
      },
      outputStrings: {
        weaveNoKnockback: {
          en: 'Go To North Circle',
        },
        weaveWithKnockback: {
          en: 'Get Knocked Back To Circle',
        },
      },
    },
    {
      id: 'Delubrum Phantom Malediction Of Agony',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57AF', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Phantom Undying Hatred',
      // "57AB Summon" is used here to avoid an additional name to translate.
      // "57AC Undying Hatred" is from Stuffy Wraith.
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57AB', capture: false }),
      delaySeconds: 5,
      // This is covered by Weave Miasma after the first "learn how this works" action.
      suppressSeconds: 9999,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Unavoidable Knockback',
      },
    },
    {
      id: 'Delubrum Phantom Excruciation',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '5809' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    // *** Trinity Avowed
    {
      id: 'Delubrum Avowed Wrath Of Bozja',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5975' }),
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'Delubrum Avowed Glory Of Bozja',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5976', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Avowed Freedom Of Bozja',
      // Hot And Cold headmarkers do not show up in log lines.
      // Additionally, the Running Cold -n, Running Hot +n debuffs do not have gains effect lines.
      // Arguably, the Elemental Impact (meteor falling) has different ids depending on orb type,
      // e.g. 5960, 5962, 4F55, 4556, 4F99, 4F9A.
      // So we could give directions here, but probably that's just more confusing.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '597C', capture: false }),
      delaySeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Stand In Opposite Meteor',
      },
    },
    {
      id: 'Delubrum Avowed Shimmering Shot',
      // See comments on Freedom Of Bozja above.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '597F', capture: false }),
      delaySeconds: 3,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Go To Opposite Sword',
      },
    },
    {
      // TODO: There is no gains effect line for gaining an effect.
      // We could use "suffering" and then have personal callouts here.
      // 5B65 = right cleave, heat+2
      // 5B66 = right cleave, cold+2
      // 5B67 = left cleave, heat+2
      // 5B68 = left cleave, cold+2
      // 596D = right cleave, heat+1
      // 596E = right cleave, cold+1
      // 596F = left cleave, heat+1
      // 5970 = left cleave, cold+1
      id: 'Delubrum Avowed Hot And Cold Cleaves',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5BAF', capture: false }),
      delaySeconds: 3,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Be In Opposite Cleave',
      },
    },
    {
      id: 'Delubrum Avowed Unseen Eye',
      // Unseen Eye always happens before Gleaming Arrow starts casting.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5980', capture: false }),
      delaySeconds: 6,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Avoid Outside Add Lines',
      },
    },
    {
      id: 'Delubrum Avowed Fury Of Bozja',
      // Allegiant Arsenal 5987 = staff (out), followed up with Fury of Bozja 5973
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5987', capture: false }),
      response: Responses.getOut('alert'),
    },
    {
      id: 'Delubrum Avowed Flashvane',
      // Allegiant Arsenal 5986 = bow (get behind), followed up by Flashvane 5972
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5986', capture: false }),
      response: Responses.getBehind('alert'),
    },
    {
      id: 'Delubrum Avowed Infernal Slash',
      // Allegiant Arsenal 5985 = sword (get front), followed up by Infernal Slash 5971
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5985', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Get In Front',
      },
    },
    // *** The Queen
    {
      id: 'Delubrum Queen Empyrean Iniquity',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Queen Cleansing Slash',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C5' }),
      condition: tankBusterOnParty,
      // Probably this is where you swap, but maybe that's not something you can
      // count on in an alliance raid, where there might not even be another tank.
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Queen Cleansing Slash Bleed',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C5' }),
      condition: (data) => data.CanCleanse(),
      delaySeconds: 5,
      infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: 'Esuna ${player}',
      },
    },
    {
      id: 'Delubrum Queen Northswain\'s Glow',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C3', capture: false }),
      alertText: (data, _, output) => output.text(),
      // Technically, this is "away from where the moving lines intersect each other"
      // but "away from orbs" also will do the trick here.
      outputStrings: {
        text: 'Away from Orbs',
      },
    },
    {
      id: 'Delubrum Queen Automatic Turret',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '59DE', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Avoid Laser Bounces',
      },
    },
    {
      id: 'Delubrum Queen Reversal Of Forces',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5759D4FF', capture: false }),
      run: (data) => data.reversalOfForces = true,
    },
    {
      // Called during the knockback cast itself, not during the 59C6 Heaven's Wrath
      // where the knockback line appears.  This is mostly because we don't know about
      // reversal at that point.
      id: 'Delubrum Queen Heaven\'s Wrath',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C7', capture: false }),
      alertText: (data, _, output) => {
        if (!data.seenHeavensWrath)
          return output.getKnockedTowardsMiddle();
        if (data.reversalOfForces)
          return output.getKnockedToSmallBomb();
        return output.getKnockedToLargeBomb();
      },
      outputStrings: {
        getKnockedTowardsMiddle: {
          en: 'Get Knocked Towards Middle',
        },
        getKnockedToSmallBomb: {
          en: 'Get Knocked To Small Bomb',
        },
        getKnockedToLargeBomb: {
          en: 'Get Knocked To Large Bomb',
        },
      },
      run: (data) => {
        data.seenHeavensWrath = true;
        delete data.reversalOfForces;
      },
    },
    {
      id: 'Delubrum Queen Judgment Blade Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C2', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Find Charge, Dodge Right',
      },
    },
    {
      id: 'Delubrum Queen Judgment Blade Left',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C1', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: 'Find Charge, Dodge Left',
      },
    },
    {
      id: 'Delubrum Queen Gods Save The Queen',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C9', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Queen Secrets Revealed',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5B8A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from tethered adds',
        },
      },
    },
    {
      id: 'Delubrum Queen Shield Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '59CB', capture: false }),
      response: Responses.getUnder('alarm'),
    },
    {
      id: 'Delubrum Queen Sword Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '59CA', capture: false }),
      response: Responses.getOut('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Right-Sided Shockwave/Left-Sided Shockwave': 'Right/Left-Sided Shockwave',
        'Left-Sided Shockwave/Right-Sided Shockwave': 'Left/Right-Sided Shockwave',
        'Sword Omen/Shield Omen': 'Sword/Shield Omen',
        'Shield Omen/Sword Omen': 'Shield/Sword Omen',
      },
    },
  ],
};
