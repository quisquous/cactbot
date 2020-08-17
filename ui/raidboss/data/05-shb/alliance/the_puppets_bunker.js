'use strict';

// TODO: is it worth adding triggers for gaining/losing shield protocol? effect 8F[0-2]

[{
  zoneId: ZoneId.ThePuppetsBunker,
  timelineFile: 'the_puppets_bunker.txt',
  triggers: [
    {
      id: 'Puppet Aegis Anti-Personnel Laser You',
      netRegex: NetRegexes.headMarker({ id: '00C6' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Puppet Aegis Anti-Personnel Laser Not You',
      netRegex: NetRegexes.headMarker({ id: '00C6', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
            cn: '坦克死刑',
            ko: '탱버',
          };
        }
        return {
          en: 'Avoid tank buster',
        };
      },
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'Puppet Aegis Beam Cannons',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '5073', capture: false }),
      alertText: function(data) {
        data.beamCannonCount = data.beamCannonCount || 0;
        data.beamCannonCount++;

        // TODO: 507[789A] is probably a rotation ability sync, so we could give better directions?
        if (data.beamCannonCount <= 2) {
          return {
            en: 'Go To Intersection',
          };
        }
        return {
          en: 'Go To Narrow Intersection',
        };
      },
    },
    {
      id: 'Puppet Aegis Aerial Support Surface Laser',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: (data, matches) => data.me === matches.target && data.phase !== 'superior',
      alarmText: {
        en: 'Chasing Laser: Get Away',
      },
    },
    {
      id: 'Puppet Aegis Refraction Cannons 1',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '5080', capture: false }),
      alertText: function(data) {
        return {
          en: 'Get Under Wings',
        };
      },
    },
    {
      id: 'Puppet Aegis Refraction Cannons 2',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '507F', capture: false }),
      alertText: function(data) {
        return {
          en: 'Get Between Wings',
        };
      },
    },
    {
      id: 'Puppet Aegis High-Powered Laser',
      // This is also head marker 003E, but since there's three stacks, just say "stack".
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '508F', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'Puppet Aegis Life\'s Last Song',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '53B3', capture: false }),
      // This is more a "if you haven't done this ever or in a while, here's a reminder."
      // Tell it once, but as this repeats nearly continously forever, only say it once.
      suppressSeconds: 9999,
      infoText: {
        en: 'Dodge into ring gap',
      },
    },
    {
      id: 'Puppet Light Volt Array',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5211' }),
      condition: (data) => data.CanSilence(),
      // Multiple of these cast at the same time.
      suppressSeconds: 5,
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'Puppet Light Homing Missile',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: (data, matches) => data.me === matches.target && data.phase !== 'compound',
      alertText: {
        en: 'Fire Puddle on YOU',
      },
    },
    {
      id: 'Puppet Light Maneuver Martial Arm',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5213' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Puppet Light Maneuver Martial Arm Not You',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5213', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
            cn: '坦克死刑',
            ko: '탱버',
          };
        }

        // Note: this doesn't cleave, so don't say anything about avoiding it.
      },
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'Puppet Superior Shield Protocol',
      netRegex: NetRegexes.startsUsing({ id: '4FA[678]', capture: false }),
      run: (data) => data.phase = 'superior',
    },
    {
      id: 'Puppet Superior Missile Command',
      netRegex: NetRegexes.startsUsing({ id: '4FBD', capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      // This is for Maneuver: Incendiary Bombing and Maneuver: Area Bombardment.
      id: 'Puppet Superior Incendiary Bombing',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: (data, matches) => data.me === matches.target && data.phase === 'superior',
      alertText: {
        en: 'Fire Puddle on YOU',
      },
    },
    {
      id: 'Puppet Superior High-Powered Laser',
      // Note: no 1B marker for this???
      netRegex: NetRegexes.startsUsing({ id: '4FB4', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Line Stack (Point Outside)',
      },
    },
    {
      // TODO: we could theoretically get combatants here when sharp turn starts casting.
      // Sharp Turn ability ids differentiate left/right.  We could use effect ids to know group.
      // But how would you communicate where to stand? "behind and slightly/very right"?
      id: 'Puppet Superior Sharp Turn',
      netRegex: NetRegexes.startsUsing({ id: '4FAB', capture: false }),
      delaySeconds: 3,
      suppressSeconds: 5,
      alertText: {
        en: 'Dodge Sword Charges',
      },
    },
    {
      id: 'Puppet Superior Precision Guided Missile You',
      netRegex: NetRegexes.startsUsing({ id: '4FC5' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Puppet Superior Precision Guided Missile Not You',
      netRegex: NetRegexes.startsUsing({ id: '4FC5', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
            cn: '坦克死刑',
            ko: '탱버',
          };
        }
        return {
          en: 'Avoid tank buster',
        };
      },
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'Puppet Superior Sliding Swipe First',
      netRegex: NetRegexes.startsUsing({ id: ['4FA[CD]', '550[DEF]', '5510'] }),
      preRun: function(data) {
        data.swipe = data.swipe || [];
        data.swipe.push({
          '4FAC': Responses.goRight(),
          '4FAD': Responses.goLeft(),
          '550D': Responses.goRight(),
          '550E': Responses.goLeft(),
          '550F': Responses.goRight(),
          '5510': Responses.goLeft(),
        });
      },
      durationSeconds: 6,
      response: function(data, matches) {
        if (data.swipe.length !== 1)
          return;

        // Call and clear the first swipe so we can not call it a second time below.
        const swipe = data.swipe[0];
        data.swipe[0] = null;
        return swipe(data, matches);
      },
    },
    {
      id: 'Puppet Superior Sliding Swipe Others',
      netRegex: NetRegexes.ability({ id: ['4FA[CD]', '550[DEF]', '5510'] }),
      response: function(data, matches) {
        if (!data.swipe)
          return;

        // The first swipe callout has been cleared to null.
        // Deliberately skip it so that when the first swipe goes off, we call the second.
        let swipe = data.swipe.pop();
        if (!swipe)
          swipe = data.swipe.pop();
        if (!swipe)
          return;
        return swipe(data, matches);
      },
    },
    {
      id: 'Puppet Heavy Volt Array',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5006', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Puppet Heavy Active Laser Turret Initial',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FED', capture: false }),
      alertText: {
        en: 'Get Outside Upper Laser',
      },
    },
    {
      id: 'Puppet Heavy Active Laser Turret Move',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FED', capture: false }),
      delaySeconds: 5.3,
      response: Responses.move('info'),
    },
    {
      id: 'Puppet Heavy Unconventional Voltage',
      netRegex: NetRegexes.headMarker({ id: '00AC' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Voltage cleave on YOU',
      },
    },
    {
      id: 'Puppet Heavy Revolving Laser',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5000', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Puppet Heavy High-Powered Laser',
      // There's only one starts using, but it targets all the tanks sequentially.
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5001' }),
      response: function(data, matches) {
        if (data.role === 'tank' || matches.target === data.me) {
          return {
            alertText: {
              en: 'Tank Laser Cleave on YOU',
            },
          };
        }
        return {
          infoText: {
            en: 'Avoid tank laser cleaves',
          },
        };
      },
    },
    {
      id: 'Puppet Heavy Support Pod',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FE9', capture: false }),
      alertText: function(data) {
        data.heavyPodCount = data.heavyPodCount || 0;
        data.heavyPodCount++;
        if (data.heavyPodCount <= 2) {
          // The first two are lasers/hammers in either order.
          // The safe spot in both cases is the same direction.
          return {
            en: 'Get Outside Between Pods',
          };
        }
        // There's nothing in the log that indicates what the screens do.
        // TODO: could check logs for tether target/source and say shift left/right?
        return {
          en: 'Get Between Lasers (Watch Tethers)',
        };
      },
    },
    {
      id: 'Puppet Heavy Synthesize Compound',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FEC', capture: false }),
      // TODO: should this say "towers"? or...something else to indicate variable people needed?
      alertText: {
        en: 'Turn Towers Blue',
      },
    },
    {
      id: 'Puppet Hallway Targeted Laser',
      netRegex: NetRegexes.headMarker({ id: '00A4' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Laser on YOU',
      },
    },
    {
      id: 'Puppet Compound Mechanical Laceration',
      netRegex: NetRegexes.startsUsing({ source: 'The Compound', id: '51B8', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: (data) => data.phase = 'compound',
    },
    {
      id: 'Puppet Compound Mechanical Dissection',
      netRegex: NetRegexes.startsUsing({ source: 'The Compound', id: '51B3', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Puppet Compound Mechanical Decapitation',
      netRegex: NetRegexes.startsUsing({ source: 'The Compound', id: '51B4', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Puppet Compound Mechanical Contusion',
      // This is also used for Compound 2P R012: Laser for non-tanks.  It's a spread there too.
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: (data, matches) => data.me === matches.target && data.phase === 'compound',
      response: Responses.spread('info'),
    },
    {
      id: 'Puppet Compound 2P Centrifugal Slice',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '51B8', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.aoe(),
      // Cover this phase for the checkpoint as well.
      run: (data) => data.phase = 'compound',
    },
    {
      id: 'Puppet Compound 2P Prime Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: ['541F', '5198'], capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade Behind',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '5420', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade In',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: ['5421', '519A'], capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Puppet Compound 2P R012: Laser You',
      // R012: Laser also puts out 008B headmarkers on non-tanks.
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Puppet Compound 2P R012: Laser Not You',
      netRegex: NetRegexes.headMarker({ id: '00DA', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText: function(data) {
        if (!data.busterTargets)
          return;
        if (data.busterTargets.includes(data.me))
          return;

        if (data.role === 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
            cn: '坦克死刑',
            ko: '탱버',
          };
        }

        // Note: do not call out "avoid tank" here because there's a lot of markers going out.
      },
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'Puppet Compound 2P Three Parts Disdain',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => data.phase === 'compound',
      response: Responses.stackOn(),
    },
    {
      id: 'Puppet Compound 2P Four Parts Resolve',
      netRegex: NetRegexes.headMarker({ id: ['004F', '0050', '0051', '0052'] }),
      condition: Conditions.targetIsYou(),
      alertText: function(data, matches) {
        return {
          '004F': {
            en: 'Jump #1 on YOU',
          },
          '0050': {
            en: 'Cleave #1 on YOU',
          },
          '0051': {
            en: 'Jump #2 on YOU',
          },
          '0052': {
            en: 'Cleave #2 on YOU',
          },
        }[matches.id];
      },
    },
    {
      id: 'Puppet Compound 2P Energy Compression',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '51A1', capture: false }),
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Prenez les tours',
        ja: '塔を踏む',
        ko: '장판 들어가기',
        cn: '踩塔',
      },
    },
    {
      id: 'Puppet Compound Pod R011: Laser',
      netRegex: NetRegexes.startsUsing({ source: 'Compound Pod', id: '541B', capture: false }),
      suppressSeconds: 2,
      // TODO: maybe this could be smarter and we could tell you where to go??
      infoText: {
        en: 'Avoid Lasers',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade Puppet In',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '519A', capture: false }),
      suppressSeconds: 2,
      alertText: {
        en: 'Get Under Corner',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade Puppet Out',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '5198', capture: false }),
      suppressSeconds: 2,
      response: Responses.goMiddle('alert'),
    },
  ],
}];
