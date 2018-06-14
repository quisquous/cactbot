'use strict';

// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Heavenly Strike',
      regex: / 14:27DA:Byakko starts using Heavenly Strike on (\y{Name})/,
      regexDe: / 14:27DA:Byakko starts using Himmlischer Schlag on (\y{Name})/,
      regexFr: / 14:27DA:Byakko starts using Frappe Céleste on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
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
        }
      },
    },
    {
      id: 'ByaEx Flying Donut',
      regex: / 14:27F4:Byakko starts using Sweep The Leg/,
      regexDe: / 14:27F4:Byakko starts using Vertikalität/,
      regexFr: / 14:27F4:Byakko starts using Verticalité/,
      alertText: function(data, matches) {
        return {
          en: 'Get Inside',
          de: 'Reingehen',
          fr: 'Allez au centre',
        };
      },
      tts: {
        en: 'inside',
        de: 'rein',
        fr: 'centre',
      },
    },
    {
      id: 'ByaEx Sweep The Leg',
      regex: / 14:27DB:Byakko starts using Sweep The Leg/,
      regexDe: / 14:27DB:Byakko starts using Vertikalität/,
      regexFr: / 14:27DB:Byakko starts using Verticalité/,
      alertText: function(data, matches) {
        return {
          en: 'Get Behind',
          de: 'Hinter ihn laufen',
          fr: 'Allez derrière le boss',
        };
      },
      tts: {
        en: 'behind',
        de: 'hinter ihn',
        fr: 'derrière',
      },
    },
    {
      id: 'ByaEx Storm Pulse',
      regex: / 14:27DC:Byakko starts using Storm Pulse/,
      regexDe: / 14:27DC:Byakko starts using Gewitterwelle/,
      regexFr: / 14:27DC:Byakko starts using Pulsion De Tempête/,
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'AOE',
            de: 'AoE',
            fr: 'AoE',
          };
        }
      },
      tts: {
        en: 'aoe',
        de: 'a o e',
        fr: ' a o e',
      },
    },
    {
      id: 'ByaEx Distant Clap',
      regex: / 14:27DD:Byakko starts using Distant Clap on Byakko/,
      regexDe: / 14:27DD:Byakko starts using Donnergrollen on Byakko/,
      regexFr: / 14:27DD:Byakko starts using Tonnerre Lointain on Byakko/,
      alertText: function(data, matches) {
        return {
          en: 'Distant Clap',
          de: 'Donnergrollen',
          fr: 'Tonnerre Lointain',
        };
      },
      tts: {
        en: 'clap',
        de: 'grollen',
        fr: 'tonnerre',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      regexFr: / 14:27E0:Byakko starts using État De Choc on (\y{Name})/,
      condition: function(data, matches) {
        return data.role == 'tank' && matches[1] != data.me;
      },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss abspotten',
        fr: 'Provoquez !',
      },
      tts: {
        en: 'Provoke',
        de: 'abspotten',
        fr: 'provoquez',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      regexFr: / 14:27E0:Byakko starts using État De Choc on (\y{Name})/,
      delaySeconds: 12,
      condition: function(data, matches) {
        return data.role == 'tank' && matches[1] == data.me;
      },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss abspotten',
        fr: 'Provoquez !',
      },
      tts: {
        en: 'Provoke',
        de: 'abspotten',
        fr: 'provoquez',
      },
    },
    {
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      regexFr: / 14:27F9:Hakutei starts using Rugissement Du Tonnerre/,
      run: function(data) {
        data.roarCount = data.roarCount || 0;
        data.roarCount += 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      regexFr: / 14:27F9:Hakutei starts using Rugissement Du Tonnerre/,
      delaySeconds: 14,
      alarmText: function(data) {
        if (data.roarCount != 2)
          return;

        if (data.role == 'tank') {
          return {
            en: 'Tank LB NOW',
            de: 'JETZT Tank LB',
            fr: 'LB Tank maintenant !',
          };
        }
      },
    },
    {
      id: 'ByaEx Bubble',
      regex: /1B:........:(\y{Name}):....:....:0065:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Drop bubble outside',
          de: 'Blase außen ablegen',
          fr: 'Déposez à l\'extérieur',
        };
      },
      tts: {
        en: 'drop outside',
        de: 'außen ablegen',
        fr: 'déposez extérieur',
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      regex: /1A:(\y{Name}) gains the effect of Ominous Wind/,
      regexDe: /1A:(\y{Name}) gains the effect of Unheilvoller Wind/,
      regexFr: /1A:(\y{Name}) gains the effect of Vent Mauvais/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Pink bubble',
          de: 'Pinke Blase',
          fr: 'Bulle violette',
        };
      },
      tts: {
        en: 'bubble',
        de: 'blase',
        fr: 'bulle',
      },
    },
    {
      id: 'ByaEx Puddle Marker',
      regex: /1B:........:(\y{Name}):....:....:0004:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: function(data) {
        return {
          en: 'Puddles on YOU',
          de: 'Pfützen auf DIR',
          fr: 'Mare sur VOUS',
        };
      },
      tts: {
        en: 'puddles',
        de: 'pfützen',
        fr: 'mare',
      },
    },
    {
      id: 'ByaEx G100',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Get away',
          de: 'Weg da',
          fr: 'Eloignez-vous',
        };
      },
      tts: {
        en: 'get away',
        de: 'weck da',
        fr: 'eloignez vous',
      },
    },
    {
      id: 'ByaEx Tiger Add',
      regex: / 00:0044:Twofold is my wrath, twice-cursed my foes!/,
      regexDe: / 00:0044:Stürmt los, meine zwei Gesichter!/,
      regexFr: / 00:0044:Ma colère devient double.*?!/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tiger Add',
            de: 'Tiger Add',
            fr: 'Add Tigre',
          };
        }
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      regexFr: / 14:27E2:Byakko starts using Tout Pour Le Tout/,
      run: function(data) {
        data.stakeCount = data.stakeCount || 0;
        data.stakeCount += 1;
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      regexFr: / 14:27E2:Byakko starts using Tout Pour Le Tout/,
      delaySeconds: 20,
      run: function(data) {
        delete data.stakeCount;
      },
    },
    {
      id: 'ByaEx Highest Stakes',
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      regexFr: / 14:27E2:Byakko starts using Tout Pour Le Tout/,
      infoText: function(data) {
        return {
          en: 'Stack #' + data.stakeCount,
          de: 'Stack #' + data.stakeCount,
          fr: 'Stack #' + data.stakeCount,
        };
      },
    },
  ],
}];
