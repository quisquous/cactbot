'use strict';

// Ultima Weapon Ultimate
[{
  zoneRegex: /^(The Weapon's Refrain \(Ultimate\)|Unknown Zone \(309\))$/,
  timelineFile: 'ultima_weapon_ultimate.txt',
  timelineTriggers: [
    {
      id: 'UWU Feather Rain',
      regex: /Feather Rain/,
      regexJa: /フェザーレイン/,
      beforeSeconds: 3,
      infoText: {
        en: 'Move!',
        ja: 'フェザーレイン',
      },
    },
  ],
  triggers: [
    // Phases
    {
      // Wait after suppression for primal triggers at the end.
      regex: /:The Ultima Weapon:2D4D:/,
      regexJa: /:アルテマウェポン:2D4D:/,
      delaySeconds: 74,
      run: function(data) {
        data.phase = 'finale';
      },
    },

    {
      id: 'UWU Garuda Slipstream',
      regex: /14:2B53:Garuda starts using (?:Unknown_2B53|Slipstream)/,
      regexJa: /14:2B53:ガルーダ starts using (?:Unknown_2B53|スリップストリーム)/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Slipstream',
        ja: 'スリップストリーム',
      },
      tts: {
        en: 'Slipstream',
        ja: 'スリップストリーム',
      },
    },
    {
      id: 'UWU Garuda Mistral Song Marker',
      regex: / 1B:........:(\y{Name}):....:....:0010:0000:0000:0000:/,
      suppressSeconds: 5,
      infoText: {
        en: 'Mistral Song',
        ja: 'ミストラルソング',
      },
      tts: {
        en: 'Mistral Song',
        ja: 'ミストラルソング',
      },
    },
    {
      id: 'UWU Garuda Spiny Plume',
      regex: / 03:Added new combatant Spiny Plume/,
      regexJa: / 03:Added new combatant スパイニープルーム/,
      condition: function(data, matches) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Spiny Plume Add',
        ja: 'スパイニープルーム',
      },
      tts: {
        en: 'Spiny Plume Add',
        ja: 'スパイニープルーム',
      },
    },
    {
      id: 'UWU Ifrit Fetters',
      regex: /1A:(\y{Name}) gains the effect of Infernal Fetters from/,
      regexJa: /1A:(\y{Name}) gains the effect of 炎獄の鎖 from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      suppressSeconds: 45,
      alertText: {
        en: 'Fetters on YOU',
        ja: '自分に炎獄の鎖',
      },
      tts: {
        en: 'Fetters',
        ja: '炎獄の鎖',
      },
    },
    {
      id: 'UWU Searing Wind',
      regex: / 14:2B5B:Ifrit starts using Inferno Howl on (\y{Name})/,
      regexJa: / 14:2B5B:イフリート starts using 灼熱の咆吼 on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Searing Wind on YOU',
        ja: '自分に灼熱',
      },
      tts: {
        en: 'Searing Wind',
        ja: '灼熱',
      },
    },
    {
      id: 'UWU Ifrit Flaming Crush',
      regex: / 1B:........:(\y{Name}):....:....:0075:0000:0000:0000:/,
      alertText: {
        en: 'Stack',
        ja: '頭割り',
      },
      tts: {
        en: 'Stack',
        ja: '頭割り',
      },
    },
    {
      id: 'UWU Garuda Woken',
      regex: / 1A:Garuda gains the effect of Woken from/,
      regexJa: / 1A:ガルーダ gains the effect of 覚醒 from/,
      sound: 'Long',
    },
    {
      id: 'UWU Ifrit Woken',
      regex: / 1A:Ifrit gains the effect of Woken from/,
      regexJa: / 1A:イフリート gains the effect of 覚醒 from/,
      sound: 'Long',
    },
    {
      id: 'UWU Titan Woken',
      regex: / 1A:Titan gains the effect of Woken from/,
      regexJa: / 1A:タイタン gains the effect of 覚醒 from/,
      sound: 'Long',
    },
    {
      id: 'UWU Titan Gaols',
      regex: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Rock Throw:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:(?:ガルーダ:2B6C|タイタン:2B6B):グラナイト・ジェイル:\y{ObjectId}:(\y{Name}):/,
      preRun: function(data, matches) {
        data.titanGaols = data.titanGaols || [];
        data.titanGaols.push(matches[1]);
        if (data.titanGaols.length == 3)
          data.titanGaols.sort();
      },
      alertText: function(data, matches) {
        if (data.titanGaols.length != 3)
          return;
        let idx = data.titanGaols.indexOf(data.me);
        if (idx < 0)
          return;
        // Just return your number.
        return idx + 1;
      },
      infoText: function(data, matches) {
        if (data.titanGaols.length != 3)
          return;
        // Return all the people in order.
        return data.titanGaols.map(function(n) {
          return data.ShortName(n);
        }).join(', ');
      },
    },
    {
      // If anybody dies to bombs (WHY) and a rock is on them, then glhf.
      id: 'UWU Titan Bomb Failure',
      regex: / 15:\y{ObjectId}:Bomb Boulder:2B6A:Burst:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ボムボルダー:2B6A:爆発:\y{ObjectId}:(\y{Name}):/,
      infoText: function(data, matches) {
        if (!data.titanGaols)
          return;
        if (data.titanGaols.indexOf(matches[1]) < 0)
          return;
        return {
          en: data.ShortName(matches[1]) + ' died',
        };
      },
    },
    {
      // Cleanup
      regex: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Rock Throw:\y{ObjectId}:\y{Name}/,
      regexJa: / 15:\y{ObjectId}:(?:ガルーダ:2B6C|タイタン:2B6B):グラナイト・ジェイル:\y{ObjectId}:\y{Name}:/,
      delaySeconds: 15,
      run: function(data) {
        delete data.titanGaols;
      },
    },
    {
      id: 'UWU Garuda Finale',
      regex: /:The Ultima Weapon:2CD3:/,
      regexJa: /:アルテマウェポン:2CD3:/,
      condition: function(data) {
        return data.phase == 'finale';
      },
      infoText: {
        en: 'Garuda',
        ja: 'ガルーダ',
      },
    },
    {
      id: 'UWU Ifrit Finale',
      regex: /:The Ultima Weapon:2CD4:/,
      regexJa: /:アルテマウェポン:2CD4:/,
      condition: function(data) {
        return data.phase == 'finale';
      },
      infoText: {
        en: 'Ifrit',
        ja: 'イフリート',
      },
    },
    {
      id: 'UWU Titan Finale',
      regex: /:The Ultima Weapon:2CD5:/,
      regexJa: /:アルテマウェポン:2CD5:/,
      condition: function(data) {
        return data.phase == 'finale';
      },
      infoText: {
        en: 'Titan',
        ja: 'タイタン',
      },
    },
  ],
}];
