'use strict';

// List of events:
// https://github.com/xivapi/ffxiv-datamining/blob/master/csv/DynamicEvent.csv
//
// These ids are (unfortunately) gathered by hand and don't seem to correlate
// to any particular bits of data.  However, there's a game log message when you
// register for a CE and an 0x21 message with this id when you accept and
// teleport in.  This avoids having to translate all of these names and also
// guarantees that the player is actually in the CE for the purpose of
// filtering triggers.
const ceIds = {
  // Kill It with Fire
  kill: '1D4',
  // The Baying of the Hound(s)
  hounds: '1CC',
  // Vigil for the Lost
  vigil: '1D0',
  // Aces High
  aces: '1D2',
  // The Shadow of Death's Hand
  shadow: '1CD',
  // The Final Furlong
  furlong: '1D5',
  // The Hunt for Red Choctober
  choctober: '1CA',
  // Beast of Man
  beast: '1DB',
  // The Fires of War
  fires: '1D6',
  // Patriot Games
  patriot: '1D1',
  // Trampled under Hoof
  trampled: '1CE',
  // And the Flames Went Higher
  flames: '1D3',
  // Metal Fox Chaos
  metal: '1CB',
  // Rise of the Robots'
  robots: '1DF',
  // Where Strode the Behemoth
  behemoth: '1DC',
  // The Battle of Castrum Lacus Litore
  castrum: '1D7',
};

[{
  zoneId: ZoneId.TheBozjanSouthernFront,
  resetWhenOutOfCombat: false,
  timelineFile: 'bozjan_southern_front.txt',
  triggers: [
    {
      id: 'Bozja South Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '5 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经5分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '5분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      response: Responses.wakeUp('alarm'),
    },
    {
      id: 'Bozja South Critical Engagement',
      netRegex: NetRegexes.network6d({ command: '80000014' }),
      run: (data, matches) => {
        // This fires when you win, lose, or teleport out.
        if (matches.data0 === '00') {
          if (data.ce && data.options.Debug)
            console.log(`Stop CE: ${data.ce}`);
          // Stop any active timelines.
          data.StopCombat();
          // Prevent further triggers for any active CEs from firing.
          data.ce = null;
          return;
        }

        data.ce = null;
        const ceId = matches.data0.toUpperCase();
        for (const key in ceIds) {
          if (ceIds[key] === ceId) {
            if (data.options.Debug)
              console.log(`Start CE: ${ceId} (${key})`);
            data.ce = ceId;
            return;
          }
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bladesmeet': 'Hauptplatz der Wachen',
        'Eaglesight': 'Platz des Kämpferischen Adlers',
        'Majesty\'s Auspice': 'Halle des Bestienkönigs',
        'The airship landing': 'Flugplatz',
        'The grand gates': 'Haupttor',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bladesmeet': 'Hall des Lames',
        'Eaglesight': 'Perchoir des Aigles',
        'Majesty\'s Auspice': 'Auditorium',
        'The airship landing': 'Aire d\'atterrissage',
        'The grand gates': 'Porte du castrum',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bladesmeet': '剣たちの大広間',
        'Eaglesight': '荒鷲の広場',
        'Majesty\'s Auspice': '円壇の間',
        'The airship landing': '飛空戦艦発着場',
        'The grand gates': '城門',
      },
    },
  ],
}];
