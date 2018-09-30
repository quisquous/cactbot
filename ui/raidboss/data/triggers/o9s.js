'use strict';

// TODO: add phase tracking
// TODO: add Big Bang "get middle" for fire phase
// TODO: track primordial crust debuff, and call out lat/long differently
// TODO: move timeline triggers for stray flames to "Entropy" debuff tracking.
// TODO: add dynamic fluid vs entropy trigger for hitting your orb partner?
// TODO: stack head marker in fire phase?
// TODO: healer head markers for dropping orbs
// TODO: add headwind/tailwind debuff tracking
// TODO: handle accretion based on phase (everybody gets accretion at the end, not just T/H)

// Entropy: Unknown_640
// Dynamic Fluid: Unknown_641
// Headwind: Unknown_642
// Tailwind: Unknown_643
// Accretion: Unknown_644
// Primordial Crust: Unknown_645

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: /^Alphascape V1.0 \(Savage\)$/,
  timelineFile: 'o9s.txt',
  timelineTriggers: [
    {
      id: 'O9S TH Spread',
      regex: /\(T\/H\) Stray Flames/,
      beforeSeconds: 4,
      alertText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread (Tanks/Healers)',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Hide Middle',
          };
        }
      },
    },
    {
      id: 'O9S DPS Spread',
      regex: /\(DPS\) Stray Flames/,
      beforeSeconds: 4,
      alertText: function(data) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Spread (DPS)',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Hide Middle',
          };
        }
      },
    },
    {
      id: 'O9S ALL Spread',
      regex: /\(All\) Stray Flames/,
      beforeSeconds: 4,
      alertText: {
        en: 'Spread (Everyone)',
      },
    },
  ],
  triggers: [
    {
      id: 'O9S Chaotic Dispersion',
      regex: / 14:3170:Chaos starts using Chaotic Dispersion on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'tank swap',
          };
        }
      },
    },
    {
      id: 'O9S Long Implosion Phase Tracker',
      regex: /14:3172:Chaos starts using Longitudinal Implosion/,
      run: function(data) {
        data.phasePath = (typeof data.phasePath === 'undefined') ? 'fire' : data.phasePath;
        data.currentPhase = 'fire';
      },
    },
    {
      id: 'O9S Longitudinal Implosion',
      regex: /14:3172:Chaos starts using Longitudinal Implosion/,
      infoText: function(data) {
        return {
          en: 'Sides -> Front/Back',
        };
      },
      tts: function(data) {
        return {
          en: 'go to sides',
        };
      },
    },
    {
      id: 'O9S Lat Implosion Phase Tracker ',
      regex: /14:3173:Chaos starts using Latitudinal Implosion/,
      run: function(data) {
        data.phasePath = (typeof data.phasePath === 'undefined') ? 'water' : data.phasePath;
        data.currentPhase = 'water';
      },
    },
    {
      id: 'O9S Latitudinal Implosion',
      regex: /14:3173:Chaos starts using Latitudinal Implosion/,
      infoText: function(data) {
        return {
          en: 'Front/Back -> Sides',
        };
      },
      tts: function(data) {
        return {
          en: 'go to front back',
        };
      },
    },
    {
      id: 'O9S Damning Edict',
      regex: /14:3171:Chaos starts using Damning Edict/,
      infoText: function(data) {
        return {
          en: 'Get Behind',
        };
      },
    },
    {
      id: 'O9S Accretion',
      regex: /:\y{Name} gains the effect of (?:Unknown_644|Accretion)/,
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 10,
      infoText: function(data) {
        return {
          en: 'Heal Tanks and Healers to full',
        };
      },
    },
    {
      id: 'O9S Primordial Crust',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_645|Primordial Crust)/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        return {
          en: 'Die on next mechanic',
        };
      },
    },
    {
      id: 'O9S Orbs Fiendish Phase Tracker',
      regex: /14:317(C|D):Chaos starts using Fiendish Orbs/,
      run: function(data) {
        // Orbs are at end of each phase.
        data.orbCounter = (data.orbCounter || 0) + 1;

        if (data.phasePath === 'fire') {
          switch (data.orbCounter) {
          case 1:
            data.currentPhase = 'wind';
            break;
          case 2:
            data.currentPhase = 'orb';
            break;
          case 3:
            data.currentPhase = 'earth';
            break;
          case 4:
            data.currentPhase = 'enrage';
            break;
          default:
            data.currentPhase = 'error';
          }
        }

        if (data.phasePath === 'water') {
          switch (data.orbCounter) {
          case 1:
            data.currentPhase = 'earth';
            break;
          case 2:
            data.currentPhase = 'orb';
            break;
          case 3:
            data.currentPhase = 'wind';
            break;
          case 4:
            data.currentPhase = 'enrage';
            break;
          default:
            data.currentPhase = 'error';
          }
        }
      },
      alarmText: function(data) {
        return {
          en: 'Orb Tethers',
        };
      },
    },
    {
      id: 'O9S Orbs Fiend Phase Tracking',
      regex: /14:318B:Soul Of Chaos/,
      run: function(data) {
      // Orbs are at end of each phase.
        data.currentPhase = (data.phasePath === 'fire') ? 'water' : 'fire';
      },
    },
    {
      id: 'O9S Orbs Fiend', // Tank Orbs
      regex: /14:317D:Chaos starts using Fiendish Orbs/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: function(data) {
        return {
          en: 'Get Orb',
        };
      },
    },
  ],
}];
