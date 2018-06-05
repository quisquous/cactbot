// Ultima Weapon Ultimate
[{
  zoneRegex: /^(The Weapon's Refrain \(Ultimate\)|Unknown Zone \(309\))$/,
  timelineFile: 'ultima_weapon_ultimate.txt',
  triggers: [
    {
      id: 'UWU Garuda Slipstream',
      regex: /14:2B53:Garuda starts using (?:Unknown_2B53|Slipstream)/,
      condition: function(data) { return data.role == 'tank'; },
      alertText: {
        en: 'Slipstream',
      },
      tts: {
        en: 'Slipstream',
      },
    },
    {
      id: 'UWU Garuda Mistral Song Marker',
      regex: / 1B:........:(\y{Name}):....:....:0010:0000:0000:0000:/,
      suppressSeconds: 5,
      alertText: {
        en: 'Mistral Song',
      },
      tts: {
        en: 'Mistral Song',
      },
    },
    {
      id: 'UWU Ifrit Fetters',
      regex: /1A:(\y{Name}) gains the effect of Infernal Fetters from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: {
        en: 'Fetters on YOU',
      },
      tts: {
        en: 'Fetters',
      },
    },
    {
      id: 'UWU Searing Wind',
      regex: /1A:(\y{Name}) gains the effect of (?:Unknown_62A|Searing Wind) from/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: {
        en: 'Searing Wind on YOU',
      },
      tts: {
        en: 'Searing Wind',
      },
    },
    // TODO: what's the 0075 marker
  ],
}]
