'use strict';

[{
  zoneId: ZoneId.TheSeatOfSacrificeExtreme,
  timelineFile: 'wol-ex.txt',
  triggers: [
    {
      id: 'WOLEx Terror Unleashed',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4F09', capture: false }),
      condition: function(data) {
        return data.role === 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Heal All to Full',
        de: 'Alle vollheilen',
        fr: 'Soignez tout le monde full vie',
        ja: 'HP戻して',
        cn: '奶满全队',
        ko: '전원 체력 풀피로',
      },
    },
    {
      id: 'WOLEx To The Limit',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F3[456]' }),
      run: function(data, matches) {
        data.limitBreaks = {
          en: {
            0: 'role positions',
            1: 'stacks',
            2: 'meteor',
          },
        }[data.displayLang];
        if (matches.id == '4F34')
          data.limitBreak = data.limitBreaks[0];
        if (matches.id == '4F35')
          data.limitBreak = data.limitBreaks[1];
        if (matches.id == '4F36')
          data.limitBreak = data.limitBreaks[2];
      },
    },
    {
      // TODO: Replace with Timeline Trigger for earlier alerting
      id: 'WOLEx Limit Break',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: ['4EFB', '515C', '53CB'], capture: false }),
      alertText: function(data) {
        let msg = data.limitBreak;
        delete data.limitBreak;
        return msg;
      },
    },
    {
      id: 'WOLEx Absolute Stone III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2C', capture: false }),
      infoText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
        cn: '散开',
        ko: '위치 산개',
      },
    },
    {
      id: 'WOLEx Imbued Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF3', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbuedFire = {
          en: 'Stop',
          de: 'Stopp',
          fr: 'Stop',
          ja: '動かない',
          cn: '不要动',
          ko: '멈추기',
        }[data.displayLang];
        data.imbued.push(data.imbuedFire);
      },
    },
    {
      id: 'WOLEx Imbued Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF4', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbuedBlizzard = {
          en: 'Move',
          de: 'Bewegen',
          fr: 'Bougez',
          ja: '動け',
          cn: '动起来',
          ko: '움직이기',
        }[data.displayLang];
        data.imbued.push(data.imbuedBlizzard);
      },
    },
    {
      id: 'WOLEx Imbued Absolute Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF5', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbuedHoly = {
          en: 'Stack',
          de: 'Stacken',
          fr: 'Stack',
          ja: 'スタック',
          cn: '集合',
          ko: '집합',
        }[data.displayLang];
        data.imbued.push(data.imbuedHoly);
      },
    },
    {
      id: 'WOLEx Imbued Absolute Stone III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF6', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbuedStone = {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Position',
          ja: '散開',
          cn: '散开',
          ko: '위치 산개',
        }[data.displayLang];
        data.imbued.push(data.imbuedStone);
      },
    },
    {
      id: 'WOLEx Imbued Coruscance In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4A', capture: false }),
      preRun: function(data) {
        data.imbued = data.imbued || [];
        data.imbuedSwordIn = {
          en: 'In',
          de: 'Rein',
          fr: 'Intérieur',
          ja: '中へ',
          cn: '靠近',
          ko: '안으로',
        }[data.displayLang];
        data.imbued.push(data.imbuedSwordIn);
      },
      alertText: function(data) {
        let msg = data.imbued.join(' + ');
        delete data.imbued;
        return msg;
      },
    },
    {
      id: 'WOLEx Imbued Coruscance Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F49', capture: false }),
      preRun: function(data) {
        data.imbued = data.imbued || [];
        data.imbuedSwordOut = {
          en: 'Out',
          de: 'Raus',
          fr: 'Exterieur',
          ja: '外へ',
          cn: '远离',
          ko: '밖으로',
        }[data.displayLang];
        data.imbued.push(data.imbuedSwordOut);
      },
      alertText: function(data) {
        let msg = data.imbued.join(' + ');
        delete data.imbued;
        return msg;
      },
    },
    {
      id: 'WOLEx The Bitter End',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F0A' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'WOLEx Summon Wyrm',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F41', capture: false }),
      delaySeconds: 6,
      infoText: {
        en: 'Avoid Wyrm Dash',
      },
    },
    {
      id: 'WOLEx Absolute Flash',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      suppressSeconds: 5,
      response: Responses.lookAwayFromTarget(),
    },
    {
      id: 'WOLEx Elddragon Dive',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F0B', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'WOLEx Fatal Cleave / Blade Of Shadow',
      // Either tank buster, but don't be too noisy
      netRegex: NetRegexes.startsUsing({ source: ['Spectral Warrior', 'Spectral Dark Knight'], id: '515[47]', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 2,
      infoText: {
        en: 'Tank Busters',
        de: 'Tankbuster',
        fr: 'Tank buster',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
      },
    },
    {
      id: 'WOLEx Berserk / Deep Darkside',
      // Either silence, but don't be too noisy
      netRegex: NetRegexes.startsUsing({ source: ['Spectral Warrior', 'Spectral Dark Knight'], id: '515[68]', capture: false }),
      condition: (data) => data.CanSilence(),
      suppressSeconds: 2,
      alarmText: {
        en: 'Interrupt',
        de: 'Unterbreche',
        fr: 'Interrompez',
        ja: '沈黙',
        cn: '打断',
        ko: '기술 시전 끊기',
      },
    },
    {
      id: 'WOLEx Adds Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => !data.ultimateSeen && data.me === matches.target,
      alarmText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ja: '自分にフレア',
        cn: '核爆点名',
        ko: '플레어 대상자',
      },
    },
    {
      id: 'WOLEx Spectral Egi Flare Breath',
      netRegex: NetRegexes.tether({ source: 'Spectral Egi', id: '0054' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 4,
      infoText: {
        en: 'Point Tether Out',
        de: 'Verbindung nach draußen richten',
        fr: 'Lien vers l\'extérieur',
        ja: '線を外に引く',
        cn: '连线',
        ko: '선 연결 바깥으로 빼기',
      },
    },
    {
      id: 'WOLEx Ultimate Crossover',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '515[23]', capture: false }),
      run: function(data) {
        data.ultimateSeen = true;
      },
    },
    {
      // TODO: We can call these out earlier based on the move WoL does before Specter of Light
      id: 'WOLEx Spectral Black Mage / White Mage',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Black Mage', id: '4F3D', capture: false }),
      condition: (data) => data.ultimateSeen,
      infoText: {
        en: 'Black Mage + White Mage',
      },
    },
    {
      id: 'WOLEx Summoner / Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Summoner', id: '4F3F', capture: false }),
      condition: (data) => data.ultimateSeen,
      infoText: {
        en: 'Summoner + Warrior',
      },
    },
    {
      id: 'WOLEx Spectral Bard / Dark Knight',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Dark Knight', id: '4F3A', capture: false }),
      condition: (data) => data.ultimateSeen,
      infoText: {
        en: 'Dark Knight + Bard',
      },
    },
    {
      id: 'WOLEx Spectral Ninja',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Ninja', id: '4EFD', capture: false }),
      infoText: {
        en: 'Ninja',
      },
      run: function(data) {
        data.ninja = true;
      },
    },
    {
      // Katon: San and Absolute Holy share markers
      id: 'WOLEx Spectral Ninja Cleanup',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Ninja', id: '4EFD', capture: false }),
      delaySeconds: 30,
      run: function(data) {
        delete data.ninja;
      },
    },
    {
      id: 'WOLEx Suiton: San',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Ninja', id: '4EFD', capture: false }),
      delaySeconds: 7,
      response: Responses.knockback(),
    },
    {
      id: 'WOLEx Katon: San',
      netRegex: NetRegexes.headMarker({ id: '00A1', capture: false }),
      condition: (data) => data.ultimateSeen && data.ninja,
      delaySeconds: 0.5,
      suppressSeconds: 2,
      response: Responses.stack(),
    },
    {
      id: 'WOLEx Perfect Decimation',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Warrior Cleave on YOU',
      },
    },
    {
      id: 'WOLEx Brimstone Earth',
      netRegex: NetRegexes.headMarker({ id: '0067' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Puddle on YOU',
        de: 'Fläche auf DIR',
        fr: 'Zone au sol sur VOUS',
        ja: '自分に水溜り',
        cn: '水球点名',
        ko: '징 대상자',
      },
    },
    {
      id: 'WOLEx Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => data.ultimateSeen && data.me === matches.target,
      alarmText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ja: '自分にフレア',
        cn: '核爆点名',
        ko: '플레어 대상자',
      },
      run: function(data) {
        data.deluge = true;
      },
    },
    {
      id: 'WOLEx Absolute Holy',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      condition: (data) => !data.deluge && !data.ninja,
      response: Responses.stackOn(),
    },
    {
      id: 'WOLEx Coruscant Saber Out',
      // TODO: This once was out + stack ?
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'WOLEx Coruscant Saber In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF2', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'WOLEx Quintuplecast',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EEF', capture: false }),
      run: function(data) {
        data.quintuplecasting = true;
        data.quintuplecasts = [];
      },
    },
    {
      id: 'WOLEx Quintuplecast Resolve',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4EEF', capture: false }),
      alertText: function(data) {
        let msg = data.quintuplecasts.join(' => ');
        delete data.quintuplecasts;
        return msg;
      },
    },
    {
      id: 'WOLEx Quintuplecast Blizzard',
      netRegex: NetRegexes.headMarker({ id: '00E2', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(data.imbuedBlizzard);
      },
    },
    {
      id: 'WOLEx Quintuplecast Holy',
      netRegex: NetRegexes.headMarker({ id: '00DD', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(data.imbuedHoly);
      },
    },
    {
      id: 'WOLEx Quintuplecast Stone',
      netRegex: NetRegexes.headMarker({ id: '00DE', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(data.imbuedStone);
      },
    },
    {
      id: 'WOLEx Quintuplecast Fire',
      netRegex: NetRegexes.headMarker({ id: '00E4', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(data.imbuedFire);
      },
    },
    {
      id: 'WOLEx Quintuplecast Flash',
      netRegex: NetRegexes.headMarker({ id: '00DF' }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data, matches) {
        data.absoluteFlash = {
          en: 'Look Away from ' + data.ShortName(matches.target),
          de: 'Schau weg von ' + data.ShortName(matches.target),
          fr: 'Ne regardez pas ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'を見ない',
          cn: '背对' + name,
          ko: data.ShortName(matches.target) + '에게서 뒤돌기',
        }[data.displayLang];
        data.quintuplecasts.push(data.absoluteFlash);
      },
    },
  ],
}];
