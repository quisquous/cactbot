'use strict';

// TODO: is it worth adding triggers for gaining/losing shield protocol? effect 8F[0-2]

[{
  zoneId: ZoneId.ThePuppetsBunker,
  timelineFile: 'the_puppets_bunker.txt',
  triggers: [
    {
      id: 'Puppet Aegis Anti-Personnel Laser',
      netRegex: NetRegexes.headMarker({ id: '00C6' }),
      condition: Conditions.targetIsYou(),
      // TODO: do we need a second "away from tank" trigger if you don't have a marker?
      // We don't do this in Copied Factory for this same 00C6, but we could?
      response: Responses.tankBuster('info'),
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
      // TODO: should this be more along the lines of an imperative, like GTFO?
      alarmText: {
        en: '10x Sky Laser on YOU',
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
      id: 'Puppet Superior Precision Guided Missile',
      netRegex: NetRegexes.startsUsing({ id: '4CF5', capture: false }),
      suppressSeconds: 5,
      alertText: function(data) {
        // This gets casted by all the planes, so harder to collect.
        // Not worth saying "on you" or meticulously telling the healer who their tank is.
        if (data.role === 'tank' || data.role === 'healer') {
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
          en: 'Avoid tank cleave',
          de: 'Tank Cleave ausweichen',
          fr: 'Évitez le tank cleave',
          ja: '前方範囲攻撃を避け',
          ko: '광역 탱버 피하기',
          cn: '远离顺劈',
        };
      },
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
      id: 'Puppet Heavy Active Laser Turret',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FED', capture: false }),
      // TODO: how to even describe this.  Could have a second callout when lower disppears?
      alertText: {
        en: 'Upper Laser Outside -> Lower',
      },
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
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: (data, matches) => data.me === matches.target && data.phase === 'compound',
      response: Responses.spread('info'),
    },
    {
      id: 'Puppet Compound 2P Centrifugal Slice',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '51B8', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.aoe(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '541F', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade Behind',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '5420', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade In',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '5421', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Puppet Compound 2P R012: Laser',
      netRegex: NetRegexes.headMarker({ id: '00DA' }),
      condition: Conditions.targetIsYou(),
      // TODO: do we need a second "away from tank" trigger if you don't have a marker?
      response: Responses.tankBuster('info'),
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
      infoText: {
        en: 'Avoid Lasers',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade In Corners',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '5421', capture: false }),
      suppressSeconds: 2,
      infoText: {
        en: 'Get Under Corner',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade In Cardinals',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '519A', capture: false }),
      suppressSeconds: 2,
      infoText: {
        en: 'Get Under Cardinal',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade Out Middle',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '5498', capture: false }),
      suppressSeconds: 2,
      response: Responses.goMiddle(),
    },
  ],
}];
