'use strict';

// TODO: do the gobcut and gobstraight really alternate?
// if so, then maybe we could call out which was coming.
// I thought some of them were fixed and don't have enough data.

// TODO: is it worth calling out where to hide for Bomb's Away?
// There's a callout for where to hit the bombs to that everybody
// will see, and it's natural to go away from that.  An extra
// callout seems noisy.

// TODO: is it worth calling out a safe spot for the second boost?
// There's some notes below, but good words for directions are hard.

let bombLocation = (matches) => {
  // x = -15, -5, +5, +15 (east to west)
  // y = -205, -195, -185, -175 (north to south)
  return {
    x: Math.round((parseFloat(matches.x) + 15) / 10),
    y: Math.round((parseFloat(matches.y) + 205) / 10),
  };
};

[{
  zoneRegex: {
    en: /^Alexander - The Fist Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章1\)$/,
  },
  timelineFile: 'a5s.txt',
  timelineTriggers: [
    {
      id: 'A5S Kaltstrahl',
      regex: /Kaltstrahl/,
      // Hopefully you'll figure it out the first time.
      suppressSeconds: 9999,
      response: Responses.tankCleave('info'),
    },
    {
      id: 'A5S Panzerschreck',
      regex: /Panzerschreck/,
      beforeSeconds: 10,
      suppressSeconds: 10,
      response: Responses.aoe(),
    },
    {
      id: 'A5S Gobhook',
      regex: /Gobhook/,
      // Needs more warning than the cast.
      beforeSeconds: 7,
      suppressSeconds: 1,
      response: Responses.getBehind('alert'),
    },
    {
      id: 'A5S Boost',
      regex: /Boost/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      alertText: {
        en: 'Bird Soon (Purple)',
      },
    },
    {
      id: 'A5S Bomb\'s Away Soon',
      regex: /Bomb's Away/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      alertText: {
        en: 'Gorilla Soon (Red)',
      },
    },
    {
      id: 'A5S Debuff Refresh',
      regex: /Disorienting Groan/,
      beforeSeconds: 1,
      suppressSeconds: 1,
      infoText: {
        en: 'refresh debuff in puddle soon',
      },
    },
  ],
  triggers: [
    {
      id: 'A5S Gobcut Stack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackOn('alert'),
    },
    {
      id: 'A5S Concussion',
      netRegex: NetRegexes.gainsEffect({ effectId: '3E4' }),
      response: function(data, matches) {
        if (matches.target === data.me)
          return;
        if (data.role === 'tank')
          return Responses.tankSwap('alarm');
        if (data.job === 'blu')
          return Responses.tankSwap('info');
      },
    },
    {
      id: 'A5S Bomb Direction',
      netRegex: NetRegexes.ability({ source: 'Ratfinx Twinkledinks', id: '1590', capture: false }),
      preRun: function(data) {
        data.bombCount = data.bombCount || 0;
        data.bombCount++;
      },
      // We could give directions here, but "into / opposite spikey" is pretty succinct.
      infoText: function(data) {
        if (data.bombCount == 1) {
          return {
            en: 'Knock Bombs Into Spikey',
          };
        }
        return {
          en: 'Knock Bombs Opposite Spikey',
        };
      },
    },
    {
      id: 'A5S Boost Count',
      netRegex: NetRegexes.ability({ source: 'Ratfinx Twinkledinks', id: '16A6', capture: false }),
      run: function(data) {
        data.boostCount = data.boostCount || 0;
        data.boostCount++;
        data.boostBombs = [];
      },
    },
    {
      id: 'A5S Bomb',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Bomb' }),
      preRun: function(data, matches) {
        data.boostBombs = data.boostBombs || [];
        data.boostBombs.push(bombLocation(matches));
      },
      alertText: function(data) {
        if (data.boostCount == 1) {
          if (data.boostBombs.length != 1)
            return;
          // index 0 = NW, 3 = NE, 12 = SW, 15 = SE
          let index = data.boostBombs[0].x + data.boostBombs[0].y * 4;
          return {
            0: {
              en: 'NW first',
            },
            3: {
              en: 'NE first',
            },
            12: {
              en: 'SW first',
            },
            15: {
              en: 'SE first',
            },
          }[index];
        }

        // Otherwise, we're on the second and final set of boost bombs.
        // TODO: This would be trivial to find the safe spot,
        // buuuuut this is hard to find good words for 16 spots.
        // Do you call it "NNW" or "East of NW But Also Outside" @_@
      },
    },
    {
      id: 'A5S Prey',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Get Away',
      },
    },
    {
      id: 'A5S Prey Healer',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: function(data) {
        return data.role === 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Shield ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A5S Glupgloop',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'GLOOPYGLOOP~',
      },
    },
    {
      id: 'A5S Snake Adds',
      netRegex: NetRegexes.addedCombatant({ name: 'Glassy-Eyed Cobra', capture: false }),
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'A5S Steel Scales',
      netRegex: NetRegexes.startsUsing({ source: 'Glassy-Eyed Cobra', id: '16A2' }),
      condition: function(data) {
        return data.CanStun();
      },
      suppressSeconds: 60,
      response: Responses.stun(),
    },
    {
      id: 'A5S Anti-Coagulant Cleanse',
      netRegex: NetRegexes.gainsEffect({ effectId: '3EC' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      suppressSeconds: 30,
      alertText: {
        en: 'Cleanse (Green)',
      },
    },
    {
      id: 'A5S Gobbledygroper',
      // FIXME: this is a case where the tether is part of the added combatant network data,
      // but isn't exposed as a separate tether line.  Instead, just assume the first auto
      // is going to hit the tethered person, and suppress everything else.
      netRegex: NetRegexes.ability({ source: 'Gobbledygroper', id: '366' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 100,
      alertText: {
        en: 'Break Tether (Blue)',
      },
    },
    {
      id: 'A5S Oogle',
      netRegex: NetRegexes.startsUsing({ source: 'Gobbledygawker', id: '169C', capture: false }),
      // These seem to come within ~2s of each other, so just have one trigger.
      suppressSeconds: 5,
      response: Responses.lookAway('alert'),
    },
  ],
}];
