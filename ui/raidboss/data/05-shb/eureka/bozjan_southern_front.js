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
  // Albeleo
  albeleo: '1DA',
  // Adrammelech
  adrammelech: '1D8',
};

// 9443: torrid orb (fire)
// 9444: frozen orb (ice)
// 9445: aqueous orb (water)
// 9446: charged orb (thunder)
// 9447: vortical orb (wind)
// 9448: sabulous orb (stone)
const orbNpcNameIdToOutputString = {
  '9443': 'stop',
  '9444': 'move',
  '9445': 'knockback',
  '9446': 'out',
  '9447': 'in',
  '9448': 'rings',
};

const orbOutputStrings = {
  unknown: {
    en: '???',
  },
  knockback: {
    en: 'Knockback',
    de: 'Rückstoß',
    fr: 'Poussée',
    ja: 'ノックバック',
    cn: '击退',
    ko: '넉백',
  },
  stop: {
    en: 'Stop',
    de: 'Stopp',
    fr: 'Stop',
    ja: '動かない',
    cn: '不要动',
    ko: '멈추기',
  },
  // Special case.
  stopOutside: {
    en: 'Stop (Out)',
  },
  move: {
    en: 'Move',
    de: 'Bewegen',
    fr: 'Bougez',
    ja: '動け',
    cn: '动起来',
    ko: '움직이기',
  },
  in: {
    en: 'In',
    de: 'Rein',
    fr: 'Intérieur',
    ja: '中へ',
    cn: '靠近',
    ko: '안으로',
  },
  out: {
    en: 'Out',
    de: 'Raus',
    fr: 'Exterieur',
    ja: '外へ',
    cn: '远离',
    ko: '밖으로',
  },
  rings: {
    en: 'Rings',
  },
};

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (ceId) => (data, matches) => {
  if (ceId && data.ce !== ceId)
    return false;
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
};

[{
  zoneId: ZoneId.TheBozjanSouthernFront,
  resetWhenOutOfCombat: false,
  timelineFile: 'bozjan_southern_front.txt',
  timeline: [
    (data) => {
      // The MRV missile is the first ability that hits the entire raid, but only the bottom raid.
      // Hopefully you have not died to the one ability before this.  We'll insert one line into
      // the timeline here that will see if the player by name was hit by a bottom raid aoe,
      // and then jump to the correct timeline.  There's no "autos without targets" shenanigans
      // that we can do here, like in BA.
      const regex = Regexes.ability({ id: '51FD', target: data.me });
      const line = `20036.9 "--helldiver--" sync /${regex.source}/ window 100,100 jump 30036.9`;
      return [
        'hideall "--helldiver--"',
        line,
      ];
    },
  ],
  timelineTriggers: [
    {
      id: 'Bozja South Castrum Lyon Winds\' Peak',
      regex: /Winds' Peak/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'Bozja South Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 7 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 7 minutes.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '操作がない状態になってから7分が経過しました。.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经7分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '7분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
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
    {
      id: 'Bozja South Choctober Choco Slash',
      netRegex: NetRegexes.startsUsing({ source: 'Red Comet', id: '506C' }),
      condition: tankBusterOnParty(ceIds.choctober),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Bottom Check',
      // TODO: netRegex could take (data) => {} here so we could do a target: data.me?
      netRegex: NetRegexes.ability({ source: '4th Legion Helldiver', id: '51FD' }),
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.helldiver = true;
      },
    },
    {
      id: 'Bozja South Castrum Helldiver MRV Missile',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51FC', capture: false }),
      condition: (data) => {
        // This won't play the first time, but that seems better than a false positive for the top.
        if (!data.helldiver)
          return false;
        return Conditions.caresAboutAOE()(data);
      },
      response: Responses.aoe(),
    },
    {
      id: 'Bozja South Castrum Helldiver Lateral Dive',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51EA', capture: false }),
      condition: (data) => data.helldiver,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand in dive charge',
        },
      },
    },
    {
      id: 'Bozja South Castrum Helldiver Magitek Missiles',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51FE' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Helldiver Infrared Blast',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51EC', capture: false }),
      condition: (data) => data.helldiver,
      delaySeconds: 6,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Take one tether',
        },
      },
    },
    {
      id: 'Bozja South Castrum Helldiver Joint Attack',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51FE', capture: false }),
      condition: (data) => data.helldiver,
      response: Responses.killAdds(),
    },
    {
      id: 'Bozja South Castrum Brionac Electric Anvil',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51DD' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Brionac False Thunder Left',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51CE', capture: false }),
      condition: (data) => !data.helldiver,
      response: Responses.goLeft(),
    },
    {
      id: 'Bozja South Castrum Brionac False Thunder Right',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51CF', capture: false }),
      condition: (data) => !data.helldiver,
      response: Responses.goRight(),
    },
    {
      id: 'Bozja South Castrum Brionac Anti-Warmachina Weaponry',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51CD', capture: false }),
      condition: (data) => !data.helldiver,
      delaySeconds: 6.5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Magitek Core',
        },
      },
    },
    {
      id: 'Bozja South Castrum Brionac Energy Generation',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51D0', capture: false }),
      condition: (data) => !data.helldiver,
      preRun: (data) => data.energyCount = (data.energyCount || 0) + 1,
      infoText: (data, _, output) => {
        if (data.energyCount === 1)
          return output.getUnderOrb();
        if (data.energyCount === 2)
          return output.goCorner();

        // TODO: triggers for energy generation.
        // It'd be nice to do this, but you barely see #3, let alone #5.
        // #1 is always get under orb
        // #2 is always get to corners
        // #3 has two spawn options (#1 or #2 callout), interorb tethers
        // #4 magentism to/from orb, but orbs don't have tethers
        // #5 magentism to/from orb, interorb tethers
        // https://docs.google.com/document/d/1gSHyYA4Qg_tEz-GK9N7ppAdbXQIL91MoYYWJ651lDMk/edit#
        // Energy generation is 51D0 is spawning orbs
        // Lightsphere is 9437, Darksphere is 9438.
        // Pos: (63,-222,249.4999) (94380000011982).
        // Pos: (80,-229,249.4999) (94380000011982).
        // Pos: (80,-215,249.4999) (94380000011982).
        // Pos: (97,-222,249.4999) (94380000011982).
      },
      outputStrings: {
        getUnderOrb: {
          en: 'Get Under Orb',
        },
        goCorner: {
          en: 'Go To Corner',
        },
      },
    },
    {
      id: 'Bozja South Castrum Albeleo Baleful Gaze',
      netRegex: NetRegexes.startsUsing({ source: 'Albeleo\'s Monstrosity', id: '5404', capture: false }),
      suppressSeconds: 3,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Bozja South Castrum Albeleo Abyssal Cry',
      netRegex: NetRegexes.startsUsing({ source: 'Albeleo\'s Hrodvitnir', id: '5406' }),
      response: Responses.interrupt('alert'),
    },
    {
      id: 'Bozja South Castrum Adrammelech Holy IV',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F96', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Bozja South Castrum Adrammelech Flare',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F95' }),
      // TODO: this is probably magical.
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Adrammelech Meteor',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F92', capture: false }),
      delaySeconds: 4.5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Meteors',
        },
      },
    },
    {
      id: 'Bozja South Castrum Adrammelech Orb Collector',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '944[3-8]' }),
      run: (data, matches) => {
        data.orbs = data.orbs || {};
        data.orbs[matches.id.toUpperCase()] = matches.npcNameId;
      },
    },
    {
      id: 'Bozja South Castrum Adrammelech Curse of the Fiend Orbs',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F7B', capture: false }),
      // Mini-timeline:
      //  0.0: Adrammelech starts using Curse Of The Fiend
      //  3.0: Adrammelech uses Curse Of The Fiend
      //  4.0: orbs appear
      //  6.2: Adrammelech starts using Accursed Becoming
      //  7.1: orb tethers appear
      // 10.1: Adrammelech uses Accursed Becoming
      // 17.3: Adrammelech uses orb ability #1.
      preRun: (data) => data.fiendCount = (data.fiendCount || 0) + 1,
      durationSeconds: (data) => (data.orbs || {}).length === 4 ? 23 : 14,
      suppressSeconds: 20,
      infoText: (data, _, output) => {
        // Let your actor id memes be dreams!
        // Orbs go off from highest actor id to lowest actor id, in pairs of two.
        let sortedOrbs = Object.keys(data.orbs || {}).sort().reverse();
        const orbIdToNameId = data.orbs;
        delete data.orbs;

        if (sortedOrbs.length === 0)
          return output.unknown();

        data.orbOutput = sortedOrbs.map((orbId) => {
          const nameId = orbIdToNameId[orbId];
          const output = orbNpcNameIdToOutputString[nameId];
          return output ? output : 'unknown';
        });

        // If there is a pair of orbs, and they are the same type, then this is the mechanic
        // introduction and only one orb goes off.
        if (data.orbOutput.length === 2) {
          if (data.orbOutput[0] === data.orbOutput[1])
            data.orbOutput = [data.orbOutput[0]];
        }

        // Special case, fire + earth = stop far outside.
        if (data.orbOutput.length >= 2) {
          if (data.orbOutput[0] === 'stop' && data.orbOutput[1] === 'rings')
            data.orbOutput[0] = 'stopOutside';
        }
        if (data.orbOutput.length === 4) {
          if (data.orbOutput[2] === 'stop' && data.orbOutput[3] === 'rings')
            data.orbOutput[2] = 'stopOutside';
        }

        // Don't bother outputting a single one, as it'll come up shortly.
        // This could get confusing saying "knockback" far enough ahead
        // that using knockback prevention would wear off before the mechanic.
        if (data.orbOutput.length > 1)
          return data.orbOutput.map((key) => output[key]()).join(' => ');
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Bozja South Castrum Adrammelech Accursed Becoming Orb 1',
      // This ability happens once per pair of orbs (with the same timings).
      // So use these two triggers to handle the single, pair, and two pairs of orbs cases.
      netRegex: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      // 5 seconds warning.
      delaySeconds: 7.2 - 5,
      durationSeconds: 4.5,
      alertText: (data, _, output) => {
        data.orbOutput = data.orbOutput || [];
        const orb = data.orbOutput.shift();
        if (!orb)
          return;
        return output[orb]();
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Bozja South Castrum Adrammelech Accursed Becoming Orb 2',
      netRegex: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      // 2.5 seconds warning, as it's weird if this shows up way before the first orb.
      delaySeconds: 9 - 2.5,
      alertText: (data, _, output) => {
        data.orbOutput = data.orbOutput || [];
        const orb = data.orbOutput.shift();
        if (!orb)
          return;
        return output[orb]();
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Bozja South Castrum Adrammelech Electric Charge Collector',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9449' }),
      run: (data, matches) => {
        data.warped = data.warped || {};
        data.warped[matches.id.toUpperCase()] = {
          x: matches.x,
          y: matches.y,
        };
      },
    },
    {
      id: 'Bozja South Castrum Adrammelech Shock',
      // This is the first Electric Charge tether.
      netRegex: NetRegexes.tether({ source: 'Adrammelech', target: 'Electric Charge' }),
      alertText: (data, matches, output) => {
        if (!data.warped)
          return output.unknown;

        const loc = data.warped[matches.targetId.toUpperCase()];
        delete data.warped;
        if (!loc)
          return output.unknown();

        const adrammelechCenterX = 73;
        const adrammelechCenterY = -605;

        // North is negative y.
        if (loc.x > adrammelechCenterX) {
          if (loc.y < adrammelechCenterY)
            return output.southWest();
          return output.northWest();
        }
        if (loc.y < adrammelechCenterY)
          return output.southEast();
        return output.northEast();
      },
      outputStrings: {
        unknown: {
          // "Follow Other People ;)"
          en: 'Go ???',
        },
        northEast: {
          en: 'Go northeast',
        },
        southEast: {
          en: 'Go southeast',
        },
        southWest: {
          en: 'Go southwest',
        },
        northWest: {
          en: 'Go northwest',
        },
      },
    },
    {
      id: 'Bozja South Castrum Dawon Molting Plumage',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Bozja South Castrum Dawon Molting Plumage Orbs',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      delaySeconds: 5,
      alertText: (data, _, output) => {
        // Only the first plumage orbs have no wind.
        // If we needed to this dynamically, look for Call Beast (5192) from Lyon before this.
        const text = data.haveSeenMoltingPlumage ? output.orbWithFlutter() : output.justOrb();
        data.haveSeenMoltingPlumage = true;
        return text;
      },
      outputStrings: {
        justOrb: {
          en: 'Get Under Light Orb',
        },
        orbWithFlutter: {
          en: 'Get Under Blown Light Orb',
        },
      },
    },
    {
      id: 'Bozja South Castrum Dawon Scratch',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '517B' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Dawon Swooping Frenzy',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '5175', capture: false }),
      suppressSeconds: 9999,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Follow Boss',
        },
      },
    },
    {
      id: 'Bozja South Castrum Lyon Passage',
      netRegex: NetRegexes.gameLog({ line: 'Lyon the Beast King would do battle at Majesty\'s Place.*?', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lyon Passage Open',
        },
      },
    },
    {
      id: 'Bozja South Castrum Lyon Twin Agonies',
      netRegex: NetRegexes.startsUsing({ source: 'Lyon The Beast King', id: '5174' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Lyon King\'s Notice',
      netRegex: NetRegexes.startsUsing({ source: 'Lyon The Beast King', id: '516E', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Bozja South Castrum Lyon Taste of Blood',
      netRegex: NetRegexes.startsUsing({ source: 'Lyon The Beast King', id: '5173', capture: false }),
      response: Responses.getBehind('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
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
      'missingTranslations': true,
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
      'missingTranslations': true,
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
