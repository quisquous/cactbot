'use strict';

// TODO: is it worth adding triggers for gaining/losing shield protocol? effect 8F[0-2]
// TODO: Incongruous Spin timeline trigger?

[{
  zoneId: ZoneId.ThePuppetsBunker,
  timelineFile: 'the_puppets_bunker.txt',
  triggers: [
    {
      id: 'Puppet Aegis Anti-Personnel Laser You',
      netRegex: NetRegexes.headMarker({ id: '00C6' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'Puppet Aegis Anti-Personnel Laser Collect',
      netRegex: NetRegexes.headMarker({ id: '00C6' }),
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
          de: 'Tank buster ausweichen',
          ko: '탱버 피하기',
        };
      },
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'Puppet Aegis Beam Cannons',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '5073', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '813P: Bollwerk', id: '5073', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '813P : Avec Unité Rempart', id: '5073', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '８１３Ｐ：拠点防衛ユニット装備', id: '5073', capture: false }),
      alertText: {
        en: 'Go To Narrow Intersection',
        de: 'Geh zu der nahen Überschneidung',
        ko: '조금 겹친 곳으로 이동',
      },
    },
    {
      id: 'Puppet Aegis Aerial Support Surface Laser',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: (data, matches) => data.me === matches.target && data.phase !== 'superior',
      alarmText: {
        en: 'Chasing Laser: Get Away',
        de: 'Verfolgende Laser: Weg gehen',
        ko: '추격 레이저: 이동',
      },
    },
    {
      id: 'Puppet Aegis Refraction Cannons 1',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '5080', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '813P: Bollwerk', id: '5080', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '813P : Avec Unité Rempart', id: '5080', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '８１３Ｐ：拠点防衛ユニット装備', id: '5080', capture: false }),
      alertText: function(data) {
        return {
          en: 'Get Under Wings',
          de: 'Gehe unter die Flügel',
          ko: '날개 뒤로 이동',
        };
      },
    },
    {
      id: 'Puppet Aegis Refraction Cannons 2',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '507F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '813P: Bollwerk', id: '507F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '813P : Avec Unité Rempart', id: '507F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '８１３Ｐ：拠点防衛ユニット装備', id: '507F', capture: false }),
      alertText: function(data) {
        return {
          en: 'Get Between Wings',
          de: 'Geh Zwischen die Flügel',
          ko: '날개 사이로 이동',
        };
      },
    },
    {
      id: 'Puppet Aegis High-Powered Laser',
      // This is also head marker 003E, but since there's three stacks, just say "stack".
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '508F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '813P: Bollwerk', id: '508F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '813P : Avec Unité Rempart', id: '508F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '８１３Ｐ：拠点防衛ユニット装備', id: '508F', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'Puppet Aegis Life\'s Last Song',
      netRegex: NetRegexes.startsUsing({ source: '813P-Operated Aegis Unit', id: '53B3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '813P: Bollwerk', id: '53B3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '813P : Avec Unité Rempart', id: '53B3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '８１３Ｐ：拠点防衛ユニット装備', id: '53B3', capture: false }),
      // This is more a "if you haven't done this ever or in a while, here's a reminder."
      // Tell it once, but as this repeats nearly continously forever, only say it once.
      suppressSeconds: 9999,
      infoText: {
        en: 'Dodge into ring gap',
        de: 'In die Lücke des Ringes ausweichen',
        ko: '고리 사이로 이동',
      },
    },
    {
      id: 'Puppet Light Volt Array',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5211' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Leicht(?:e|er|es|en) Infanterieeinheit', id: '5211' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Unité Terrestre Légère', id: '5211' }),
      netRegexJa: NetRegexes.startsUsing({ source: '軽陸戦ユニット', id: '5211' }),
      condition: (data) => data.CanSilence(),
      // Multiple of these cast at the same time.
      suppressSeconds: 5,
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'Puppet Spread Headmarker',
      // Used for:
      // Homing Missile (Light Artillery)
      // Mechanical Contusion (The Compound)
      // R012: Laser (Compound 2P)
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread('info'),
    },
    {
      id: 'Puppet Light Maneuver Martial Arm Target',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5213' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Leicht(?:e|er|es|en) Infanterieeinheit', id: '5213' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Unité Terrestre Légère', id: '5213' }),
      netRegexJa: NetRegexes.startsUsing({ source: '軽陸戦ユニット', id: '5213' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'Puppet Light Maneuver Martial Arm Collect',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5213' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Leicht(?:e|er|es|en) Infanterieeinheit', id: '5213' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Unité Terrestre Légère', id: '5213' }),
      netRegexJa: NetRegexes.startsUsing({ source: '軽陸戦ユニット', id: '5213' }),
      run: function(data, matches) {
        data.busterTargets = data.busterTargets || [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'Puppet Light Maneuver Martial Arm Healer',
      netRegex: NetRegexes.startsUsing({ source: 'Light Artillery Unit', id: '5213', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Leicht(?:e|er|es|en) Infanterieeinheit', id: '5213', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Unité Terrestre Légère', id: '5213', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '軽陸戦ユニット', id: '5213', capture: false }),
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
        de: 'Feuer Fläche auf DIR',
        ko: '불 장판 대상자',
      },
    },
    {
      id: 'Puppet Superior High-Powered Laser',
      // Note: no 1B marker for this???
      netRegex: NetRegexes.startsUsing({ id: '4FB4', capture: false }),
      suppressSeconds: 5,
      alertText: {
        en: 'Line Stack (Point Outside)',
        de: 'Auf einer Linie sammeln (nach außen zeigen)',
        ko: '쉐어 레이저 (밖으로 유도)',
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
        de: 'Schwerteransturm ausweichen',
        ko: '돌진 피하기',
      },
    },
    {
      id: 'Puppet Superior Precision Guided Missile You',
      netRegex: NetRegexes.startsUsing({ id: '4FC5' }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'Puppet Superior Precision Guided Missile Collect',
      netRegex: NetRegexes.startsUsing({ id: '4FC5' }),
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
          de: 'Tank buster ausweichen',
          ko: '탱버 피하기',
        };
      },
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'Puppet Superior Sliding Swipe First',
      netRegex: NetRegexes.startsUsing({ id: ['4FA[CD]', '550[DEF]', '5510'] }),
      preRun: function(data, matches) {
        data.swipe = data.swipe || [];
        const kRight = {
          en: 'Right',
          de: 'Rechts',
          fr: 'Droite ',
          ja: '右へ',
          cn: '右',
          ko: '오른쪽',
        };
        const kLeft = {
          en: 'Left',
          de: 'Links',
          fr: 'Gauche',
          ja: '左へ',
          cn: '左',
          ko: '왼쪽',
        };

        data.swipe.push({
          '4FAC': kRight,
          '4FAD': kLeft,
          '550D': kRight,
          '550E': kLeft,
          '550F': kRight,
          '5510': kLeft,
        }[matches.id]);
      },
      durationSeconds: 6,
      alertText: function(data) {
        if (data.swipe.length !== 1)
          return;

        // Call and clear the first swipe so we can not call it a second time below.
        const swipe = data.swipe[0];
        data.swipe[0] = null;
        return swipe;
      },
    },
    {
      id: 'Puppet Superior Sliding Swipe Others',
      netRegex: NetRegexes.ability({ id: ['4FA[CD]', '550[DEF]', '5510'] }),
      alertText: function(data, matches) {
        if (!data.swipe)
          return;

        // The first swipe callout has been cleared to null.
        // Deliberately skip it so that when the first swipe goes off, we call the second.
        let swipe = data.swipe.shift();
        if (!swipe)
          swipe = data.swipe.shift();
        if (!swipe)
          return;
        return swipe;
      },
    },
    {
      id: 'Puppet Heavy Volt Array',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5006', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '5006', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '5006', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '5006', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Puppet Heavy Active Laser Turret Initial',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FED', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '4FED', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '4FED', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '4FED', capture: false }),
      alertText: {
        en: 'Get Outside Upper Laser',
        de: 'Raus aus dem oberen Laser',
        ko: '높은 레이저 쪽 밖으로 이동',
      },
    },
    {
      id: 'Puppet Heavy Active Laser Turret Move',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5086', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '5086', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '5086', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '5086', capture: false }),
      delaySeconds: 5.3,
      suppressSeconds: 5,
      response: Responses.move('info'),
    },
    {
      id: 'Puppet Heavy Unconventional Voltage',
      netRegex: NetRegexes.headMarker({ id: '00AC' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Voltage cleave on YOU',
        de: 'Spannungs-Cleave auf DIR',
        ko: '전압 장판 대상자',
      },
    },
    {
      id: 'Puppet Heavy Revolving Laser',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5000', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '5000', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '5000', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '5000', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Puppet Heavy High-Powered Laser',
      // There's only one starts using, but it targets all the tanks sequentially.
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '5001' }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '5001' }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '5001' }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '5001' }),
      response: function(data, matches) {
        if (data.role === 'tank' || matches.target === data.me) {
          return {
            alertText: {
              en: 'Tank Laser Cleave on YOU',
              de: 'Tank Laser cleave auf DIR',
              ko: '탱커 레이저 대상자',
            },
          };
        }
        return {
          infoText: {
            en: 'Avoid tank laser cleaves',
            de: 'Tank Laser cleave ausweichen',
            ko: '탱커 레이저 피하기',
          },
        };
      },
    },
    {
      id: 'Puppet Heavy Support Pod',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FE9', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '4FE9', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '4FE9', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '4FE9', capture: false }),
      // This is approximately when the pods appear.
      delaySeconds: 6,
      alertText: function(data) {
        data.heavyPodCount = data.heavyPodCount || 0;
        data.heavyPodCount++;
        if (data.heavyPodCount <= 2) {
          // The first two are lasers/hammers in either order.
          // The safe spot in both cases is the same direction.
          return {
            en: 'Get Outside Between Pods',
            de: 'Zwischen den Pods raus gehen',
            ko: '포드 사이로 이동',
          };
        }
        // There's nothing in the log that indicates what the screens do.
        // TODO: could check logs for tether target/source and say shift left/right?
        return {
          en: 'Get Between Lasers (Watch Tethers)',
          de: 'Zwischen Laser gehen (auf die Verbindungen achten)',
          ko: '레이저 사이로 이동 (연결된 모니터 확인)',
        };
      },
    },
    {
      id: 'Puppet Heavy Synthesize Compound',
      netRegex: NetRegexes.startsUsing({ source: '905P-Operated Heavy Artillery Unit', id: '4FEC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '905P: Läufer', id: '4FEC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '905P : Avec Unité Terrestre Lourde', id: '4FEC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '９０５Ｐ：重陸戦ユニット装備', id: '4FEC', capture: false }),
      // TODO: should this say "towers"? or...something else to indicate variable people needed?
      alertText: {
        en: 'Turn Towers Blue',
        de: 'Türme zu Blau ändern',
        ko: '장판이 파랑색이 되도록 들어가기',
      },
    },
    {
      id: 'Puppet Hallway Targeted Laser',
      netRegex: NetRegexes.headMarker({ id: '00A4' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Laser on YOU',
        de: 'Laser auf DIR',
        ko: '레이저 대상자',
      },
    },
    {
      id: 'Puppet Compound Mechanical Laceration',
      netRegex: NetRegexes.startsUsing({ source: 'The Compound', id: '51B8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Puppenklumpen', id: '51B8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Agglomérat De Pantins', id: '51B8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '融合シタ人形タチ', id: '51B8', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: (data) => data.phase = 'compound',
    },
    {
      id: 'Puppet Compound Mechanical Dissection',
      netRegex: NetRegexes.startsUsing({ source: 'The Compound', id: '51B3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Puppenklumpen', id: '51B3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Agglomérat De Pantins', id: '51B3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '融合シタ人形タチ', id: '51B3', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Puppet Compound Mechanical Decapitation',
      netRegex: NetRegexes.startsUsing({ source: 'The Compound', id: '51B4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Puppenklumpen', id: '51B4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Agglomérat De Pantins', id: '51B4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '融合シタ人形タチ', id: '51B4', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Puppet Compound 2P Centrifugal Slice',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '51B8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Fusion', id: '51B8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '2P : Amalgame', id: '51B8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：融合体', id: '51B8', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.aoe(),
      // Cover this phase for the checkpoint as well.
      run: (data) => data.phase = 'compound',
    },
    {
      id: 'Puppet Compound 2P Prime Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: ['541F', '5198'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Fusion', id: ['541F', '5198'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '2P : Amalgame', id: ['541F', '5198'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：融合体', id: ['541F', '5198'], capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade Behind',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: ['5420', '5199'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Fusion', id: ['5420', '5199'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '2P : Amalgame', id: ['5420', '5199'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：融合体', id: ['5420', '5199'], capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Puppet Compound 2P Prime Blade In',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: ['5421', '519A'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Fusion', id: ['5421', '519A'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '2P : Amalgame', id: ['5421', '519A'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：融合体', id: ['5421', '519A'], capture: false }),
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
      id: 'Puppet Compound 2P Three Parts Disdain Knockback',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      condition: (data) => data.phase === 'compound',
      // Knockback prevention is 6 seconds long, and there's ~9.6s between marker and final hit.
      delaySeconds: 3.6,
      response: Responses.knockback('info'),
    },
    {
      id: 'Puppet Compound 2P Four Parts Resolve',
      netRegex: NetRegexes.headMarker({ id: ['004F', '0050', '0051', '0052'] }),
      condition: Conditions.targetIsYou(),
      alertText: function(data, matches) {
        return {
          '004F': {
            en: 'Jump #1 on YOU',
            de: 'Sprung #1 auf DIR',
            ko: '점프 #1 대상자',
          },
          '0050': {
            en: 'Cleave #1 on YOU',
            de: 'Cleave #1 auf DIR',
            ko: '직선공격 #1 대상자',
          },
          '0051': {
            en: 'Jump #2 on YOU',
            de: 'Sprung #2 auf DIR',
            ko: '점프 #2 대상자',
          },
          '0052': {
            en: 'Cleave #2 on YOU',
            de: 'Cleave #2 auf DIR',
            ko: '직선공격 #2 대상자',
          },
        }[matches.id];
      },
    },
    {
      id: 'Puppet Compound 2P Energy Compression',
      netRegex: NetRegexes.startsUsing({ source: 'Compound 2P', id: '51A6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Fusion', id: '51A6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: '2P : Amalgame', id: '51A6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：融合体', id: '51A6', capture: false }),
      delaySeconds: 4,
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
      netRegexDe: NetRegexes.startsUsing({ source: 'Pod: Fusion', id: '541B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Pod : Amalgame', id: '541B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ポッド：融合体', id: '541B', capture: false }),
      suppressSeconds: 2,
      // TODO: maybe this could be smarter and we could tell you where to go??
      infoText: {
        en: 'Avoid Lasers',
        de: 'Laser ausweichen',
        ko: '레이저 피하기',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade Puppet Guaranteed In',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '5421', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Spaltung', id: '5421', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Clone', id: '5421', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：分裂体', id: '5421', capture: false }),
      suppressSeconds: 2,
      // TODO: have only seen this happen for the guaranteed Puppet In at 6250.7 with 4 clones.
      // TODO: can this happen at other times??
      alertText: {
        en: 'Get Under Clone Corner',
        de: 'Unter den Klon in einer Ecke gehen',
        ko: '구석의 분신 아래로 이동',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade Puppet In',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '519A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Spaltung', id: '519A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Clone', id: '519A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：分裂体', id: '519A', capture: false }),
      suppressSeconds: 2,
      // TODO: when I've seen this happen at 6379.4, it's been two clones, that start
      // at corners and then teleport to two cardinals across from each other with fake
      // teleports on the other cardinals.
      // TODO: fix this if these clones can go to corners.
      alertText: {
        en: 'Get Under Cardinal Clone',
        de: 'Unter den Klon in einer der Himmelsrichtungen gehen',
        ko: '분신 아래로 이동',
      },
    },
    {
      id: 'Puppet Puppet 2P Prime Blade Puppet Out Corner',
      netRegex: NetRegexes.startsUsing({ source: 'Puppet 2P', id: '5198', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: '2P: Spaltung', id: '5198', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Clone', id: '5198', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '２Ｐ：分裂体', id: '5198', capture: false }),
      suppressSeconds: 2,
      // Have seen this be either:
      // * 4 clones teleporting around the outside of the arena (corner to corner)
      // * 4 clones teleporting in (to cardinals)
      alertText: {
        en: 'Away From Clones',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '724P-operated superior flight unit \\(A-lpha\\)': '724P: Flugeinheit A-lpha',
        '767P-Operated Superior Flight Unit \\(B-Eta\\)': '767P: Flugeinheit B-eta',
        '772P-Operated Superior Flight Unit \\(C-Hi\\)': '772P: Flugeinheit C-hi',
        '813P-Operated Aegis Unit': '813P: Bollwerk',
        '905P-Operated Heavy Artillery Unit': '905P: Läufer',
        'Compound 2P': '2P: Fusion',
        'Compound Pod': 'Pod: Fusion',
        'Flight Unit': 'Flugeinheit',
        'Light Artillery Unit': 'leicht(?:e|er|es|en) Infanterieeinheit',
        '(?<!Compound )Pod': 'Pod',
        'Puppet 2P': '2P: Spaltung',
        'The Compound': 'Puppenklumpen',
        'The elevated detritus': 'Wrackteil A',
        'The sunken detritus': 'Wrackteil B',
        'The launch deck': 'Abschussdeck',
        'Core Command': 'Kommando-II',
        'The passage': 'Korridor',
      },
      'replaceText': {
        '\\(In': '(Rein',
        'Out\\)': 'Raus)',
        '\\(Behind\\)': '(Hinter)',
        'Aerial Support: Bombardment': 'Luftunterstützung: Bombardement',
        'Aerial Support: Swoop': 'Luftunterstützung: Sturmangriff',
        'Anti-Personnel Missile': 'Abwehrraketen',
        'Apply Shield Protocol': 'Schutzsysteme aktivieren',
        'Authorization: No Restrictions': 'Verstärkung: Entsichern',
        'Centrifugal Slice': 'Spiralklinge',
        'Chemical Burn': 'Chemische Explosion',
        'Chemical Conflagration': 'Chemische Detonation',
        'Compound Pod: R011': 'Pod-Fusion: Programm R011',
        'Compound Pod: R012': 'Pod-Fusion: Programm R012',
        'Energy Bombardment': 'Energiemörser',
        'Energy Compression': 'Energetische Kondensation',
        'Explosion': 'Explosion',
        'Firing Order: Anti-Personnel Laser': 'Feuerbefehl: Antipersonenlaser',
        'Firing Order: High-Powered Laser': 'Feuerbefehl: Hochleistungslaser',
        'Firing Order: Surface Laser': 'Feuerbefehl: Laserschlag',
        'Flight Path': 'Sturmmanöver',
        'Forced Transfer': 'Erzwungener Teleport',
        'Formation: Air Raid': 'Synchronität: Luftschlag',
        'Formation: Sharp Turn': 'Synchronität: Rotationsangriff',
        'Formation: Sliding Swipe': 'Synchronität: Sturmangriff',
        'Four Parts Resolve': 'Vierfache Hiebsequenz',
        '(?<!(Maneuver|Firing Order): )High-Powered Laser': 'Hochleistungslaser',
        'Homing Missile Impact': 'Suchraketeneinschlag',
        'Incendiary Barrage': 'Schwere Brandraketen',
        'Incongruous Spin': 'Laterale Rotation',
        'Initiate Self-Destruct': 'Selbstsprengungsysteme',
        'Lethal Revolution': 'Aureolenschlag',
        'Life\'s Last Song': 'Finale Kantate',
        'Lower Laser': 'Unterlaser',
        'Maneuver: Area Bombardment': 'Offensive: Blindraketen',
        'Maneuver: Beam Cannons': 'Offensive: Konvergenzgeschütze',
        'Maneuver: Collider Cannons': 'Offensive: Rotationsgeschütze',
        'Maneuver: High-Order Explosive Blast': 'Offensive: Explosivsprengköpfe',
        'Maneuver: High-Powered Laser': 'Offensive: Hochleistungslaser',
        'Maneuver: Impact Crusher': 'Offensive: Bodenlanze',
        'Maneuver: Incendiary Bombing': 'Offensive: Brandraketen',
        'Maneuver: Long-Barreled Laser': 'Offensive: Langlauf-Laser',
        'Maneuver: Martial Arm': 'Offensive: Nahkampf-Arm',
        'Maneuver: Missile Command': 'Offensive: Raketenkommando',
        'Maneuver: Precision Guided Missile': 'Offensive: Schwere Lenkrakete',
        'Maneuver: Refraction Cannons': 'Offensive: Coriolisgeschütze',
        'Maneuver: Revolving Laser': 'Offensive: Rotationslaser',
        'Maneuver: Saturation Bombing': 'Feuerbefehl: Omnidirektionalrakete',
        'Maneuver: Unconventional Voltage': 'Offensive: Konvergenzspannung',
        'Maneuver: Volt Array': 'Offensive: Diffusionsspannung',
        'Mechanical Contusion': 'Suchlaser',
        'Mechanical Decapitation': 'Zirkularlaser',
        'Mechanical Dissection': 'Linearlaser',
        'Mechanical Laceration': 'Omnilaser',
        'Operation: Access Self-Consciousness Data': 'Ausführen: Pseudo-21O',
        'Operation: Activate Laser Turret': 'Ausführen: Lasergeschütz',
        'Operation: Activate Suppressive Unit': 'Ausführen: Ringgeschütz',
        'Operation: Pod Program': 'Ausführen: Pod-Programm',
        'Operation: Synthesize Compound': 'Ausführen: Explosive Verbindung',
        'Prime Blade': 'Klingensequenz',
        'R010: Laser': 'R010: Laser',
        'R011: Laser': 'R011: Laser',
        'R012: Laser': 'R012: Laser',
        'R030: Hammer': 'R030: Hammer',
        'Relentless Spiral': 'Partikelspirale',
        'Reproduce': 'Teilung des Selbsts',
        '(?<!Formation: )Sharp Turn': 'Rotationsangriff',
        '(?<!Formation: )Sliding Swipe': 'Sturmangriff',
        'Support: Pod': 'Unterstützung: Pod-Schuss',
        'Surface Missile Impact': 'Raketeneinschlag',
        'Three Parts Disdain': 'Dreifache Hiebsequenz',
        'Three Parts Resolve': 'Dreifache Hiebsequenz - Ende',
        'Upper Laser': 'Hauptlaser',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        '724P-Operated Superior Flight Unit \\(A-Lpha\\)': '724P : avec module de vol renforcé [A-lpha]',
        '767P-Operated Superior Flight Unit \\(B-Eta\\)': '767P : avec module de vol renforcé [B-êta]',
        '772P-Operated Superior Flight Unit \\(C-Hi\\)': '772P : avec module de vol renforcé [C-hi]',
        '813P-Operated Aegis Unit': '813P : avec unité rempart',
        '905P-Operated Heavy Artillery Unit': '905P : avec unité terrestre lourde',
        'Compound 2P': '2P : amalgame',
        'Compound Pod': 'pod : amalgame',
        'Flight Unit': 'module de vol',
        'Light Artillery Unit': 'unité terrestre légère',
        '(?<!Compound )Pod': 'pod',
        'Puppet 2P': 'clone',
        'The Compound': 'agglomérat de pantins',
        'The elevated detritus': 'Plate-forme A',
        'The sunken detritus': 'Plate-forme B',
        'The launch deck': 'Aire de lancement',
        'Core Command': 'Salle de commandement n°2',
        'The passage': 'Couloir',
      },
      'replaceText': {
        'Aerial Support: Bombardment': 'Soutien aérien : pilonnage',
        'Aerial Support: Swoop': 'Soutien aérien : assaut',
        'Anti-Personnel Missile': 'Missile antipersonnel',
        'Apply Shield Protocol': 'Activation du programme défensif',
        'Authorization: No Restrictions': 'Extension : déverrouillage de l\'armement',
        'Centrifugal Slice': 'Brise-machine étendu',
        'Chemical Burn': 'Explosion chimique',
        'Chemical Conflagration': 'Grande explosion chimique',
        'Compound Pod: R011': 'Pods amalgames : R011',
        'Compound Pod: R012': 'Pods amalgames : R012',
        'Energy Bombardment': 'Tirs courbes',
        'Energy Compression': 'Condensation énergétique',
        '(?<!Grande )Explosion': 'Explosion',
        'Firing Order: Anti-Personnel Laser': 'Ordre de tir : lasers antipersonnels',
        'Firing Order: High-Powered Laser': 'Ordre de tir : laser surpuissant',
        'Firing Order: Surface Laser': 'Ordre de tir : lasers terrestres',
        'Flight Path': 'Manœuvre d\'assaut',
        'Forced Transfer': 'Téléportation forcée',
        'Formation: Air Raid': 'Combo : ruée explosive féroce',
        'Formation: Sharp Turn': 'Combo : taillade en triangle',
        'Formation: Sliding Swipe': 'Combo : taillade propulsée',
        'Four Parts Resolve': 'Grand impact tailladant',
        '(?<!(Maneuver|Firing Order): )High-Powered Laser': 'Laser surpuissant',
        'Homing Missile Impact': 'Impact de missile à tête chercheuse',
        'Incendiary Barrage': 'Gros missiles incendiaires',
        'Incongruous Spin': 'Rotation calcinante',
        'Initiate Self-Destruct': 'Autodestruction',
        'Lethal Revolution': 'Taillade circulaire',
        'Life\'s Last Song': 'Ultime Cantate',
        'Lower Laser': 'Laser inférieur',
        'Maneuver: Area Bombardment': 'Attaque : déluge de missiles',
        'Maneuver: Beam Cannons': 'Attaque : canons à particules chargés',
        'Maneuver: Collider Cannons': 'Attaque : canons à particules rotatifs',
        'Maneuver: High-Order Explosive Blast': 'Attaque : ogive déflagrante',
        'Maneuver: High-Powered Laser': 'Attaque : laser surpuissant',
        'Maneuver: Impact Crusher': 'Attaque : marteau-piqueur',
        'Maneuver: Incendiary Bombing': 'Attaque : missiles incendiaires',
        'Maneuver: Long-Barreled Laser': 'Attaque : canon laser long',
        'Maneuver: Martial Arm': 'Attaque : bras de combat',
        'Maneuver: Missile Command': 'Attaque : tirs de missiles en chaîne',
        'Maneuver: Precision Guided Missile': 'Attaque : missiles à tête chercheuse ultraprécise',
        'Maneuver: Refraction Cannons': 'Attaque : canons à particules défléchissants',
        'Maneuver: Revolving Laser': 'Attaque : laser rotatif',
        'Maneuver: Saturation Bombing': 'Attaque : tir de missiles multidirectionnel',
        'Maneuver: Unconventional Voltage': 'Attaque : arcs convergents',
        'Maneuver: Volt Array': 'Attaque : arcs divergents',
        'Mechanical Contusion': 'Rayons fracassants',
        'Mechanical Decapitation': 'Rayons tailladants',
        'Mechanical Dissection': 'Rayons découpants',
        'Mechanical Laceration': 'Rayons multidirectionnels',
        'Operation: Access Self-Consciousness Data': 'Déploiement : données de conscience de 21O',
        'Operation: Activate Laser Turret': 'Déploiement : tourelle laser',
        'Operation: Activate Suppressive Unit': 'Déploiement : unité de tir annulaire',
        'Operation: Pod Program': 'Déploiement : programme de pod',
        'Operation: Synthesize Compound': 'Déploiement : composés explosifs',
        'Prime Blade': 'Brise-machine : coup chargé',
        'R010: Laser': 'R010 : Laser',
        'R011: Laser': 'R011 : Laser',
        'R012: Laser': 'R012 : Laser',
        'R030: Hammer': 'R030 : Marteau',
        'Relentless Spiral': 'Spirale rémanente',
        'Reproduce': 'Clonage',
        '(?<!Formation: )Sharp Turn': 'Taillade en triangle',
        '(?<!Formation: )Sliding Swipe': 'Taillade propulsée',
        'Support: Pod': 'Déploiement : pods',
        'Surface Missile Impact': 'Impact de missile terrestre',
        'Three Parts Disdain': 'Triple impact tailladant',
        'Upper Laser': 'Laser supérieur',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        '724P-Operated Superior Flight Unit \\(A-Lpha\\)': '７２４Ｐ：強化型飛行ユニット［A-lpha］',
        '767P-Operated Superior Flight Unit \\(B-Eta\\)': '７６７Ｐ：強化型飛行ユニット［B-eta］',
        '772P-Operated Superior Flight Unit \\(C-Hi\\)': '７７２Ｐ：強化型飛行ユニット［C-hi］',
        '813P-Operated Aegis Unit': '８１３Ｐ：拠点防衛ユニット装備',
        '905P-Operated Heavy Artillery Unit': '９０５Ｐ：重陸戦ユニット装備',
        'Compound 2P': '２Ｐ：融合体',
        'Compound Pod': 'ポッド：融合体',
        'Flight Unit': '飛行ユニット',
        'Light Artillery Unit': '軽陸戦ユニット',
        '(?<!Compound )Pod': 'ポッド',
        'Puppet 2P': '２Ｐ：分裂体',
        'The Compound': '融合シタ人形タチ',
        'The elevated detritus': '残骸A',
        'The sunken detritus': '残骸B',
        'The launch deck': '射出デッキ',
        'Core Command': '第二司令室',
        'The passage': '通路',
      },
      'replaceText': {
        'Aerial Support: Bombardment': '航空支援：爆撃',
        'Aerial Support: Swoop': '航空支援：突撃',
        'Anti-Personnel Missile': '対人ミサイル',
        'Apply Shield Protocol': '防御プログラム適用',
        'Authorization: No Restrictions': '拡張：武装ロック解除',
        'Centrifugal Slice': '全面斬機',
        'Chemical Burn': '化合物爆発',
        'Chemical Conflagration': '化合物大爆発',
        'Compound Pod: R011': 'ポッド融合体：R011',
        'Compound Pod: R012': 'ポッド融合体：R012',
        'Energy Bombardment': '迫撃エネルギー弾',
        'Energy Compression': 'エネルギー凝縮',
        'Explosion': '爆発',
        'Firing Order: Anti-Personnel Laser': '砲撃命令：対人レーザー',
        'Firing Order: High-Powered Laser': '砲撃命令：高出力レーザー',
        'Firing Order: Surface Laser': '砲撃命令：対地レーザー',
        'Flight Path': '突撃機動',
        'Forced Transfer': '強制転送',
        'Formation: Air Raid': '連携：急襲爆撃',
        'Formation: Sharp Turn': '連携：転回斬撃',
        'Formation: Sliding Swipe': '連携：突進斬撃',
        'Four Parts Resolve': '四連断重撃',
        '(?<!(Maneuver|Firing Order): )High-Powered Laser': '高出力レーザー',
        'Homing Missile Impact': '追尾ミサイル着弾',
        'Incendiary Barrage': '大型焼尽ミサイル',
        'Incongruous Spin': '逆断震回転',
        'Initiate Self-Destruct': '自爆システム起動',
        'Lethal Revolution': '旋回斬撃',
        'Life\'s Last Song': '終焉ノ歌',
        'Lower Laser': '下部レーザー',
        'Maneuver: Area Bombardment': '攻撃：ミサイル乱射',
        'Maneuver: Beam Cannons': '攻撃：収束粒子砲',
        'Maneuver: Collider Cannons': '攻撃：旋回粒子砲',
        'Maneuver: High-Order Explosive Blast': '攻撃：爆風効果弾頭',
        'Maneuver: High-Powered Laser': '攻撃：高出力レーザー',
        'Maneuver: Impact Crusher': '攻撃：地穿潰砕',
        'Maneuver: Incendiary Bombing': '攻撃：焼尽ミサイル',
        'Maneuver: Long-Barreled Laser': '攻撃：長砲身レーザー',
        'Maneuver: Martial Arm': '攻撃：格闘アーム',
        'Maneuver: Missile Command': '攻撃：ミサイル全弾発射',
        'Maneuver: Precision Guided Missile': '攻撃：高性能誘導ミサイル',
        'Maneuver: Refraction Cannons': '攻撃：偏向粒子砲',
        'Maneuver: Revolving Laser': '攻撃：回転レーザー',
        'Maneuver: Saturation Bombing': '攻撃：全方位ミサイル',
        'Maneuver: Unconventional Voltage': '攻撃：収束ヴォルト',
        'Maneuver: Volt Array': '攻撃：拡散ヴォルト',
        'Mechanical Contusion': '砕機光撃',
        'Mechanical Decapitation': '斬機光撃',
        'Mechanical Dissection': '断機光撃',
        'Mechanical Laceration': '制圧光撃',
        'Operation: Access Self-Consciousness Data': 'オペレート：２１Ｏ自我データ',
        'Operation: Activate Laser Turret': 'オペレート：レーザータレット',
        'Operation: Activate Suppressive Unit': 'オペレート：環状銃撃ユニット',
        'Operation: Pod Program': 'オペレート：ポッドプログラム',
        'Operation: Synthesize Compound': 'オペレート：爆発性化合物',
        'Prime Blade': '斬機撃：充填',
        'R010: Laser': 'R010：レーザー',
        'R011: Laser': 'R011：レーザー',
        'R012: Laser': 'R012：レーザー',
        'R030: Hammer': 'R030：ハンマー',
        'Relentless Spiral': '渦状光維奔突',
        'Reproduce': '分体生成',
        '(?<!Formation: )Sharp Turn': '転回斬撃',
        '(?<!Formation: )Sliding Swipe': '突進斬撃',
        'Support: Pod': '支援：ポッド射出',
        'Surface Missile Impact': '対地ミサイル着弾',
        'Three Parts Disdain': '三連衝撃斬',
        'Upper Laser': '上部レーザー',
      },
    },
  ],
}];
