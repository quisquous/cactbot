// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Heavenly Strike',
      regex: / 14:27DA:Byakko starts using Heavenly Strike on (\y{Name})/,
      regexDe: / 14:27DA:Byakko starts using Himmelszorn on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me){
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
        if (data.role == 'healer'){
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
        return {
          en: 'buster',
          de: 'basta',
        };
      },
    },
    {
      id: 'ByaEx Flying Donut',
      regex: / 14:27F4:Byakko starts using Sweep The Leg/,
      regexDe: / 14:27F4:Byakko starts using Vertikalität/,
      alertText: function(data, matches) {
        return {
          en: 'Get inside',
          de: 'rein',
        };
      },
      tts: {
        en: 'inside',
        de: 'rein',
      },
    },
    {
      id: 'ByaEx Sweep The Leg',
      regex: / 14:27DB:Byakko starts using Sweep The Leg/,
      regexDe: / 14:27DB:Byakko starts using Vertikalität/,
      alertText: function(data, matches) {
        return {
          en: 'get behind',
          de: 'Hinter ihn!',
        };
      },
      tts: {
        en: 'behind',
        de: 'hinter ihn',
      },
    },
    {
      id: 'ByaEx Storm Pulse',
      regex: / 14:27DC:Byakko starts using Storm Pulse/,
      regexDe: / 14:27DC:Byakko starts using Gewitterwelle/,
      infoText: function(data, matches) {
        if (data.role == 'healer')
          return 'AOE';
      },
      tts: {
        en: 'aoe',
        de: 'a o e',
      },
    },
    {
      id: 'ByaEx Distant Clap',
      regex: / 14:27DD:Byakko starts using Distant Clap on Byakko/,
      regexDe: / 14:27DD:Byakko starts using Donnergrollen on Byakko/,
      alertText: function(data, matches) {
        return {
          en: 'Distant Clap',
          de: 'Donnergrollen',
        };
      },
      tts: {
        en: 'clap',
        de: 'grollen',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      condition: function(data, matches) { return data.role == 'tank' && matches[1] != data.me; },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss Abspotten',
      },
      tts: {
        en: 'provoke',
        de: 'boss abspotten',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      delaySeconds: 12,
      condition: function(data, matches) { return data.role == 'tank' && matches[1] == data.me; },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss Abspotten',
      },
      tts:  {
        en: 'provoke',
        de: 'boss abspotten',
      },
    },
    {
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      run: function(data) {
        data.roarCount = data.roarCount || 0;
        data.roarCount += 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      delaySeconds: 14,
      alarmText: function(data) {
        if (data.roarCount != 2){
          return;
        }
        if (data.role == 'tank'){
          return {
            en: 'Tank LB now!',
            de: 'Tank Limitrausch!',
          };
        }
      },
      tts: function(data) {
        if (data.roarCount != 2){
          return;
        }
        if (data.role == 'tank'){
          return {
            en: 'Tank LB now',
            de: 'Tenk Limitrausch',
          };
        }
      },
    },
    {
      id: 'ByaEx Bubble',
      regex: /1B:........:(\y{Name}):....:....:0065:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return {
          en: 'Drop bubble outside',
          de: 'Blase außen ablegen',
        };
      },
      tts:  {
        en: 'drop outside',
        de: 'außen ablegen',
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      regex: /1A:(\y{Name}) gains the effect of Ominous Wind/,
      regexDe: /1A:(\y{Name}) gains the effect of Unheilvoller Wind/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return {
          en: 'Pink bubble',
          de: 'Pinke Blase',
        };
      },
      tts:  {
        en: 'bubble',
        de: 'blase',
      },
    },
    {
      id: 'ByaEx Puddle Marker',
      regex: /1B:........:(\y{Name}):....:....:0004:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alarmText: function(data) {
        return {
          en: 'Puddles on YOU',
          de: 'Pfützen auf DIR',
        };
      },
      tts:  {
        en: 'puddles',
        de: 'pfützen',
      },
    },
    {
      id: 'ByaEx G100',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return {
          en: 'Get Away',
          de: 'Weg da',
        };
      },
      tts: 'get away',
    },
    {
      id: 'ByaEx Tiger Add',
      regex: / 00:0044:Twofold is my wrath, twice-cursed my foes!/,
      regex: / 00:0044:Stürmt los, meine zwei Gesichter!/,
      infoText: function(data) {
        if (data.role == 'tank')
          return 'Tiger Add';
      },
      tts: 'tiger add',
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      run: function(data) {
        data.stakeCount = data.stakeCount || 0;
        data.stakeCount += 1;
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      delaySeconds: 20,
      run: function(data) {
        delete data.stakeCount;
      },
    },
    {
      id: 'ByaEx Highest Stakes',
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      infoText: function(data) {
        return 'Stack #' + data.stakeCount;
      },
      tts: function(data) {
        return {
          en: 'stack ' + data.stakeCount,
          de: 'stek ' + data.stakeCount,
        };
      },
    },
  ]
}]
