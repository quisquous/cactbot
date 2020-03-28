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
      regexFr: /(?:Spirituel|Corporel) Blindage/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      infoText: {
        en: 'Stun Soon',
        fr: 'Stun bientôt',
      },
    },
  ],
  triggers: [
    {
      id: 'A2S Bomb',
      regex: Regexes.addedCombatant({ name: 'Bomb', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Bombe', capture: false }),
      alertText: {
        en: 'Bomb',
        fr: 'Bombe',
      },
    },
    {
      id: 'A2S Prey',
      regex: Regexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      regexFr: Regexes.ability({ source: 'Gobmygale Magitek G-IX', id: '1413' }),
      condition: function(data) {
        return data.role == 'healer' || data.job == 'blu';
      },
      suppressSeconds: 10,
      infoText: function(data, matches) {
        return {
          en: 'Keep ' + data.ShortName(matches.target) + ' topped',
          fr: 'Gardez-le ' + data.ShortName(matches.target) + ' topped',
        };
      },
    },
    {
      id: 'A2S Prey You',
      regex: Regexes.ability({ source: 'Magitek Gobwidow G-IX', id: '1413' }),
      regexFr: Regexes.ability({ source: 'Gobmygale Magitek G-IX', id: '1413' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: {
        en: 'Boomcannon on YOU',
        fr: 'Double cannon sur VOUS',
      },
    },
    {
      id: 'A2S Soldier Spawn',
      regex: Regexes.addedCombatant({ name: 'Gordian Soldier', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Soldat Gordien', capture: false }),
      run: function(data) {
        delete data.bangyzoom;
      },
    },
    {
      id: 'A2S Bangyzoom',
      regex: Regexes.ability({ id: 'FD9', target: 'Gordian Soldier', capture: false }),
      regexFr: Regexes.ability({ id: 'FD9', target: 'Soldat Gordien', capture: false }),
      condition: function(data) {
        return !data.bangyzoom;
      },
      infoText: {
        en: 'Stun Soldier',
        fr: 'Stun sur le soldat',
      },
      run: function(data) {
        data.bangyzoom = true;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'fr',
      'replaceSync': {
        'Added new combatant Boomtype Magitek Gobwalker G-VII': 'Ajout d\'un nouveau combattant Gobblindé magitek G-VII Boumbardier',
        'Added new combatant Giant Bomb': 'Ajout d\'un nouveau combattant Bombe géante',
        'Added new combatant Gordian Hardhelm': 'Ajout d\'un nouveau combattant Casque-dur gordien',
        'Added new combatant Gordian Hardmind': 'Ajout d\'un nouveau combattant Cerveau-dur gordien',
        'Added new combatant Gordian Sniper G-IX': 'Ajout d\'un nouveau combattant Sniper gordien',
        'Added new combatant Jagd Doll': 'Ajout d\'un nouveau combattant Poupée jagd',
        'Added new combatant Magitek Gobwidow G-IX': 'Ajout d\'un nouveau combattant Gobmygale magitek G-IX',
        'Bomb': 'Bombe',
        'Boomtype Magitek Gobwalker G-VII': 'Gobblindé magitek G-VII Boumbardier',
        'Hangar 12 will be sealed off in 15 seconds': 'Fermeture du grand hangar GH-12 dans 15 secondes.',
        'Gordian Hardhelm': 'Casque-dur gordien',
        'Gordian Hardmind': 'Cerveau-dur gordien',
        'Gordian Sniper': 'Sniper gordien',
        'Jagd Doll': 'Poupée jagd',
        'King Gobtank G-IV': 'Gobtank G-IV roi',
        'Magitek Gobwidow G-IX': 'Gobmygale magitek G-IX',
      },
      'replaceText': {
        '(mid)': '(centre)',
        '(NW)': '(NO)',
        '(SW)': '(SO)',
        'Bangyzoom': 'Ordre d\'attaque',
        'Blitzstrahl': 'Blitzstrahl',
        'Bomb': 'Bombe',
        'Boomcannon': 'Double cannon',      
        'Carpet Bomb': 'Tapis de bombes',
        'Explosion': 'Explosion',
        'Hardhelm': 'Casque-dur',
        'Hardmind': 'Cerveau-dur',
        'Giant Bomb': 'Bombe géante',
        'Gobwalker': 'Gobblindé',
        'Gobwidow': 'Gobmygale',
        'Jagd Doll': 'Poupée jagd',
        'Kaltstrahl': 'Kaltstrahl',
        'Massive Explosion Enrage': 'Grosse explosion Enrage',
        'Sniper': 'Sniper',
        'Soldier': 'Soldat',
        'Wave': 'Vague',
}];
