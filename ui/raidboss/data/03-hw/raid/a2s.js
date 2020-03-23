'use strict';

// TODO: could consider keeping track of the gobbie driver?
// Nothing in the logs for when you get in, other than removing combatanat.
// FDE, FDF, FE0, FE1 are all skills you use when inside.
// 12C0, FE2 are exploding it and getting out.
// There aren't may triggers, so maybe worth just keeping the global callouts
// for bombs and stuns.

[{
  zoneRegex: {
    en: /^Alexander - The Cuff Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章2\)$/,
  },
  timelineFile: 'a2s.txt',
  timelineTriggers: [
    {
      id: 'A2S Breakblock',
      regex: /(?:Brainhurt|Bodyhurt) Breakblock/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      infoText: {
        en: 'Stun Soon',
      },
    },
  ],
  triggers: [
    {
      id: 'A2S Bomb',
      regex: Regexes.addedCombatant({ name: 'Bomb', capture: false }),
      alertText: {
        en: 'Bomb',
      },
    },
    {
      id: 'A2S Prey',
      regex: Regexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      condition: function(data) {
        return data.role == 'healer' || data.job == 'blu';
      },
      suppressSeconds: 10,
      infoText: function(data, matches) {
        return {
          en: 'Keep ' + data.ShortName(matches.target) + ' topped',
        };
      },
    },
    {
      id: 'A2S Prey You',
      regex: Regexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: {
        en: 'Boomcannon on YOU',
      },
    },
    {
      id: 'A2S Soldier Spawn',
      regex: Regexes.addedCombatant({ name: 'Gordian Soldier', capture: false }),
      run: function(data) {
        delete data.bangyzoom;
      },
    },
    {
      id: 'A2S Bangyzoom',
      regex: Regexes.ability({ id: 'FD9', target: 'Gordian Soldier', capture: false }),
      condition: function(data) {
        return !data.bangyzoom;
      },
      infoText: {
        en: 'Stun Soldier',
      },
      run: function(data) {
        data.bangyzoom = true;
      },
    },
  ],
}];
