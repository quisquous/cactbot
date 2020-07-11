'use strict';

// TODO: stun call for True Heart sprint ability?

// TODO: can we figure out jails from the location of the tethering gobbie?
// TODO: you can figure out who it is from who the bomb is on, but 8 blu <_<
// Red jail can stay up forever.  The same color can be in different spots.
// Is it possible that for each jail phase, each color is in the same spot?
// One data point:
//   Jail 1: purple(NE), red (NW), green (SE), white (NE)
//   Jail 2: red(NW), green (SW), white (SW), purple (NW)
//   Jail 3: green (NE), purple (SE), red (SW), white (SE)
//   * in this example jail 1 red persisted through jail 1 green/white, but jail 2 red did not.
// Alarums and Lumbertype Magitek get added too late to be useful.

// Timeline:
// Jail 1:
//   Option 1: (bomb on healer)
//     green tether / white prey
//     purple tether / red prey
//   Option 2: (bomb on melee)
//     purple tether / red prey
//     green tether / white prey
// Cat Phase 1
// Jail 2:
//   Option 1: (bomb on healer)
//     red tether / green prey
//     white tether / purple prey
//   Option 2: (bomb on ranged/caster)
//     white tether / purple prey
//     red tether / green prey
// Hammertime
// Cat Phase 2
// Jail 3:
//   Option 1: (2x bombs)
//     green tether / purple prey
//     red tether / white prey
//   Option 2: (sizzlebeam on OT)
//     red tether / white prey
//     green tether / purple prey

[{
  zoneRegex: {
    en: /^Alexander - The Arm Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章3\)$/,
  },
  zoneId: ZoneId.AlexanderTheArmOfTheSonSavage,
  timelineNeedsFixing: true,
  timelineFile: 'a7s.txt',
  triggers: [
    {
      id: 'A7S Phase Counter',
      netRegex: NetRegexes.addedCombatant({ name: 'Shanoa', capture: false }),
      run: function(data) {
        data.phase = data.phase || 0;
        data.phase++;
      },
    },
    {
      id: 'A7S Sizzlebeam',
      netRegex: NetRegexes.headMarker({ id: '0018' }),
      alertText: function(data, matches) {
        if (matches.target === data.me) {
          return {
            en: 'Sizzlebeam on YOU',
            de: 'Gobpartikelstrahl auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target !== data.me) {
          return {
            en: 'Sizzlebeam on ' + data.ShortName(matches.target),
            de: 'Gobpartikelstrahl auf ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A7S Sizzlespark',
      netRegex: NetRegexes.startsUsing({ source: 'Quickthinx Allthoughts', id: '16F8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe('info'),
    },
    {
      id: 'A7S Bomb Tether',
      netRegex: NetRegexes.tether({ source: 'Bomb', id: '001F' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Bomb Spread',
        de: 'Bomben verteilen',
      },
    },
    {
      id: 'A7S Jail Prey',
      netRegex: NetRegexes.headMarker({ id: '0029' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Jail Prey',
        de: 'Gefängnis Markierung',
      },
    },
    {
      id: 'A7S Jail Tether',
      // This does not include the initial tether, unfortunately.
      // This is another case of "added combatant with initial tether".
      netRegex: NetRegexes.tether({ source: 'Boomtype Magitek Gobwalker G-VII', id: '0011' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      infoText: {
        en: 'Jail Tether',
        de: 'Gefängnis Verbindung',
      },
    },
    {
      id: 'A7S Kugelblitz',
      netRegex: NetRegexes.startsUsing({ source: 'Sturm Doll', id: '16FE' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun(),
    },
    {
      id: 'A7S Zoomdoom Clear',
      netRegex: NetRegexes.startsUsing({ source: 'Quickthinx Allthoughts', id: '16F4', capture: false }),
      run: function(data) {
        delete data.grabbed;
        delete data.stickyloom;
      },
    },
    {
      id: 'A7S Gobbie Grab',
      netRegex: NetRegexes.ability({ source: 'Quickthinx Allthoughts', id: '15C0' }),
      run: function(data, matches) {
        data.grabbed = data.grabbed || [];
        data.grabbed.push(matches.target);
      },
    },
    {
      id: 'A7S Stickyloom',
      netRegex: NetRegexes.ability({ source: 'Boomtype Magitek Gobwalker G-VII', id: '16F2' }),
      run: function(data, matches) {
        data.stickyloom = matches.target;
      },
    },
    {
      id: 'A7S Padlock',
      netRegex: NetRegexes.addedCombatant({ name: 'Padlock', capture: false }),
      condition: function(data) {
        if (!data.grabbed)
          return false;
        // If you're not in a jail, kill the padlock.
        return !data.grabbed.includes(data.me) && data.stickyloom !== data.me;
      },
      infoText: {
        en: 'Break Padlock',
        de: 'Schloss zerstören',
      },
    },
    {
      id: 'A7S True Heart',
      netRegex: NetRegexes.ability({ source: 'Shanoa', id: '15EC', capture: false }),
      alertText: {
        en: 'Kill Heart',
        de: 'Herz besiegen',
      },
    },
    {
      id: 'A7S Searing Wind',
      netRegex: NetRegexes.gainsEffect({ effectId: '178' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'Searing Wind on YOU',
        de: 'Versengen auf DIR',
      },
    },
  ],
}];
