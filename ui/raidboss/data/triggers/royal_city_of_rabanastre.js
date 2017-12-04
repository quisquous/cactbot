[{
  zoneRegex: /^The Royal City Of Rabanastre$/,
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: /:Mateus, The Corrupt starts using Unbind/,
      delaySeconds: 11,
      infoText: 'Kill Aqua Spheres',
      tts: 'adds',
    },
    {
      id: 'Rab Mateus Breathless Gain',
      regex: /:(\y{Name}) gains the effect of Breathless from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        if (data.breathless >= 6)
          return 'Breathless: ' + data.breathless;
      },
      alarmText: function(data) {
        if (data.breathless == 5)
          return 'Get In Bubble';
      },
      tts: function(data) {
        if (data.breathless == 5)
          return 'bubble';
      },
      run: function(data) {
        data.breathless = data.breathless | 0;
        data.breathless++;
      },
    },
    {
      id: 'Rab Mateus Breathless Lose',
      regex: /:(\y{Name}) loses the effect of Breathless from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Hashmal Rock Cutter',
      regex: /:Hashmal, Bringer Of Order starts using Rock Cutter/,
      infoText: 'Tank Cleave',
      tts: 'tank cleave',
    },
    {
      id: 'Rab Hashmal Earth Hammer',
      regex: /:Hashmal, Bringer Of Order starts using Earth Hammer/,
      alertText: 'Move Away',
      tts: 'move away',
    },
    {
      id: 'Rab Hashmal Golems',
      regex: /:Hashmal, Bringer Of Order starts using Summon/,
      delaySeconds: 5,
      infoText: 'Kill Golems',
      tts: 'adds',
    },
    {
      id: 'Rab Trash Dragon Voice',
      regex: /:Archaeolion starts using The Dragon's Voice/,
      alertText: 'Dragon Voice: Move In',
      tts: 'dragon voice',
    },
    {
      id: 'Rab Trash Ram Voice',
      regex: /:Archaeolion starts using The Ram's Voice/,
      alertText: 'Ram Voice: Move Out',
      tts: 'ram voice',
    },
    {
      id: 'Rab Rofocale Chariot',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Move In (Chariot)',
      tts: 'chariot',
    },
    {
      id: 'Rab Rofocale Trample',
      regex: /:Rofocale starts using Trample/,
      alertText: 'Trample',
      tts: 'trample',
    },
    {
      regex: /:Argath Thadalfus:261A:Mask Of Truth:/,
      run: function(data) {
        data.maskValue = true;
      },
    },
    {
      regex: /:Argath Thadalfus:2619:Mask Of Lies:/,
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
          return 'Move';
        return 'Stop';
      },
      tts: function(data) {
        if (data.maskValue)
          return 'Move';
        return 'Stop';
      },
    },
    {
      id: 'Rab Argath Command Turn',
      regex: /1B:........:(\y{Name}):....:....:007C:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: function(data) {
        if (data.maskValue)
          return 'Look Away';
        return 'Look Towards';
      },
      tts: function(data) {
        if (data.maskValue)
          return 'Look Away';
        return 'Look Towards';
      },
    },
  ],
}]
