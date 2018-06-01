[{
  zoneRegex: /^The Royal City Of Rabanastre$/,
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: /:Mateus, The Corrupt starts using Unbind/,
      regexDe: /:Mateus der Peiniger starts using Loseisen/,
      delaySeconds: 11,
      infoText: {
        en: 'Kill Aqua Spheres',
        de: 'Wasserkugeln zerstören',
      },
      tts: {
        en: 'adds',
        de: 'etz',
      },
    },
    {
      id: 'Rab Mateus Breathless Gain',
      regex: /:(\y{Name}) gains the effect of Breathless from/,
      regexDe: /:(\y{Name}) gains the effect of Atemnot from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        if (data.breathless >= 7) {
          return {
            en: 'Breathless: ' + (data.breathless + 1),
            de: 'Atemnot: ' + (data.breathless + 1),
          };
        }
      },
      alarmText: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'Get In Bubble',
            de: 'Geh in die Blase',
          };
        }
      },
      tts: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'bubble',
            de: 'blase',
          };
        }
      },
      run: function(data) {
        data.breathless = data.breathless | 0;
        data.breathless++;
      },
    },
    {
      id: 'Rab Mateus Breathless Lose',
      regex: /:(\y{Name}) loses the effect of Breathless from/,
      regexDe: /:(\y{Name}) loses the effect of Atemnot from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      regex: /:Mateus, The Corrupt starts using Blizzard IV/,
      regexDe: /:Mateus der Peiniger starts using Eiska/,
      alertText: {
        en: 'Move To Safe Spot',
        de: 'Zur sicheren Zone',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
      },
    },
    {
      id: 'Rab Hashmal Rock Cutter',
      regex: /:Hashmal, Bringer Of Order starts using Rock Cutter/,
      regexDe: /:Hashmallim der Einiger starts using Steinfräse/,
      infoText: {
        en: 'Tank Cleave',
        de: 'Tank Cleave',
      },
      tts: {
        en: 'tank cleave',
        de: 'tenk klief',
      },
    },
    {
      id: 'Rab Hashmal Earth Hammer',
      regex: /:Hashmal, Bringer Of Order starts using Earth Hammer/,
      regexDe: /:Hashmallim der Einiger starts using Erdhammer/,
      alertText: {
        en: 'Move Away',
        de: 'Weg da',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
      },
    },
    {
      id: 'Rab Hashmal Golems',
      regex: /:Hashmal, Bringer Of Order starts using Summon/,
      regexDe: /:Hashmallim der Einiger starts using Beschwörung/,
      delaySeconds: 5,
      infoText: {
        en: 'Kill Golems',
        de: 'Golems töten',
      },
      tts: {
        en: 'adds',
        de: 'etz',
      },
    },
    {
      id: 'Rab Trash Dragon Voice',
      regex: /:Archaeolion starts using The Dragon's Voice/,
      regexDe: /:Archaeolöwe starts using Stimme Des Drachen/,
      alertText: {
        en: 'Dragon Voice: Move In'
        de: 'Stimme Des Drachen: Rein',
      },
      tts: {
        en: 'dragon voice',
        de: 'Stimme des Drachen',
      },
    },
    {
      id: 'Rab Trash Ram Voice',
      regex: /:Archaeolion starts using The Ram's Voice/,
      regexDe: /:Archaeolöwe starts using Stimme Des Widders/,
      alertText: {
        en: 'Ram Voice: Move Out'
        de: 'Stimme Des Widders: Raus',
      },
      tts: {
        en: 'rams voice',
        de: 'Stimme des Widders',
      },
    },
    {
      id: 'Rab Rofocale Chariot',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: {
        en: 'Move In (Chariot)',
        de: 'Raus da (Streitwagen)',
      },
      tts: {
        en: 'chariot',
        de: 'Streitwagen',
      },
    },
    {
      id: 'Rab Rofocale Trample',
      regex: /:Rofocale starts using Trample/,
      regexDe: /:Rofocale starts using Zertrampeln/,
      alertText: {
        en: 'Trample',
        de: 'Zertrampeln',
      },
      tts: {
        en: 'trample',
        de: 'zertrampeln',
      },
    },
    {
      regex: /:Argath Thadalfus:261A:Mask Of Truth:/,
      regexDe: /:Argath Thadalfus:261A:Maske Der Wahrheit:/,
      run: function(data) {
        data.maskValue = true;
      },
    },
    {
      regex: /:Argath Thadalfus:2619:Mask Of Lies:/,
      regexDe: /:Argath Thadalfus:2619:Maske Der Lüge:/,
      run: function(data) {
        data.maskValue = false;
      },
    },
    {
      id: 'Rab Argath Command Scatter',
      regex: /1B:........:(\y{Name}):....:....:007B:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        if (data.maskValue)
          return {
            en: 'Move',
            de: 'Bewegen',
          };
        return {
          en: 'Stop',
          de: 'Stopp',
        };
      },
      tts: function(data) {
        if (data.maskValue)
          return {
            en: 'Move',
            de: 'Bewegen',
          };
        return {
          en: 'Stop',
          de: 'Stopp',
        };
      },
    },
    {
      id: 'Rab Argath Command Turn',
      regex: /1B:........:(\y{Name}):....:....:007C:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        if (data.maskValue)
          return {
            en: 'Look Away',
            de: 'Wegschauen',
          };
        return {
          en: 'Look Towards',
          de: 'Anschauen',
        };
      },
      tts: function(data) {
        if (data.maskValue)
        return {
          en: 'Look Away',
          de: 'Wegschauen',
        };
      return {
        en: 'Look Towards',
        de: 'anschauen',
      }
    },
  ],
}]
