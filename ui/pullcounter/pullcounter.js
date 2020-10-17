'use strict';

let Options = {
  Language: 'en',
};

'use strict';

// NOTE: do not add more fights to this data structure.
// These exist for testing pullcounter and for backwards compatibility
// with pullcounter keys.  None of these were translated in the past,
// and so it's also not worth going back and adding these as there is
// no backwards compatibility issue for other languages.

const gBossFightTriggers = [
  {
    id: 'test',
    zoneId: ZoneId.MiddleLaNoscea,
    startRegex: /:You bow courteously to the striking dummy/,
    countdownStarts: true,
    preventAutoStart: true,
  },
  {
    id: 'o1s',
    zoneId: ZoneId.DeltascapeV10Savage,
  },
  {
    id: 'o2s',
    zoneId: ZoneId.DeltascapeV20Savage,
  },
  {
    id: 'o3s',
    zoneId: ZoneId.DeltascapeV30Savage,
  },
  {
    id: 'o4s-exdeath',
    zoneId: ZoneId.DeltascapeV40Savage,
    startRegex: /:Exdeath uses Dualcast/,
    preventAutoStart: true,
  },
  {
    id: 'o4s-neo',
    zoneId: ZoneId.DeltascapeV40Savage,
    startRegex: /:Neo Exdeath uses Almagest/,
    preventAutoStart: true,
  },
  {
    id: 'Unending Coil',
    zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  },
  {
    id: 'Shinryu Ex',
    zoneId: ZoneId.TheMinstrelsBalladShinryusDomain,
  },
  {
    id: 'o5s',
    zoneId: ZoneId.SigmascapeV10Savage,
  },
  {
    id: 'o6s',
    zoneId: ZoneId.SigmascapeV20Savage,
  },
  {
    id: 'o7s',
    zoneId: ZoneId.SigmascapeV30Savage,
  },
  {
    id: 'o8s-kefka',
    zoneId: ZoneId.SigmascapeV40Savage,
    startRegex: / 15:........:Kefka:28C2:/,
    preventAutoStart: true,
  },
  {
    id: 'o8s-god kefka',
    zoneId: ZoneId.SigmascapeV40Savage,
    startRegex: / 15:........:Kefka:28EC:/,
    preventAutoStart: true,
  },
  {
    id: 'Byakko Ex',
    zoneId: ZoneId.TheJadeStoaExtreme,
  },
  {
    id: 'Tsukuyomi Ex',
    zoneId: ZoneId.TheMinstrelsBalladTsukuyomisPain,
  },
  {
    id: 'UwU',
    zoneId: ZoneId.TheWeaponsRefrainUltimate,
  },
  {
    id: 'Suzaku Ex',
    zoneId: ZoneId.HellsKierExtreme,
  },
  {
    id: 'Seiryu Ex',
    zoneId: ZoneId.TheWreathOfSnakesExtreme,
  },
  {
    id: 'o9s',
    zoneId: ZoneId.AlphascapeV10Savage,
  },
  {
    id: 'o10s',
    zoneId: ZoneId.AlphascapeV20Savage,
  },
  {
    id: 'o11s',
    zoneId: ZoneId.AlphascapeV30Savage,
  },
  {
    id: 'o12s-door',
    zoneId: ZoneId.AlphascapeV40Savage,
    startRegex: /:Omega-M:337D:/,
    preventAutoStart: true,
  },
  {
    id: 'o12s-final',
    zoneId: ZoneId.AlphascapeV40Savage,
    startRegex: /:Omega:336C:/,
    preventAutoStart: true,
  },
  {
    zoneId: ZoneId.TheBozjanSouthernFront,
    countdownStarts: false,
    preventAutoStart: true,
  },
];


let gPullCounter;

class PullCounter {
  constructor(element) {
    this.element = element;
    this.zoneName = null;
    this.bossStarted = false;
    this.party = [];
    this.bosses = [];

    this.resetRegex = Regexes.echo({ line: '.*pullcounter reset.*?' });
    this.countdownEngageRegex = LocaleRegex.countdownEngage[Options.ParserLanguage] ||
      LocaleRegex.countdownEngage['en'];

    callOverlayHandler({
      call: 'cactbotLoadData',
      overlay: 'pullcounter',
    }).then((data) => gPullCounter.SetSaveData(data));

    this.ReloadTriggers();
  }

  OnFightStart(boss) {
    this.pullCounts[boss.id] = (this.pullCounts[boss.id] || 0) + 1;
    this.bossStarted = true;

    this.ShowElementFor(boss.id);
    this.SaveData();
  }

  ShowElementFor(id) {
    this.element.innerText = this.pullCounts[id];
    this.element.classList.remove('wipe');
  }

  SaveData() {
    callOverlayHandler({
      call: 'cactbotSaveData',
      overlay: 'pullcounter',
      data: JSON.stringify(this.pullCounts),
    });
  }

  OnLogEvent(e) {
    if (this.bossStarted)
      return;
    for (const log of e.detail.logs) {
      if (log.match(this.resetRegex))
        this.ResetPullCounter();
      if (log.match(this.countdownEngageRegex)) {
        if (this.countdownBoss)
          this.OnFightStart(this.countdownBoss);
        else
          this.AutoStartBossIfNeeded();
        return;
      }
      for (const boss of this.bosses) {
        if (boss.startRegex && log.match(boss.startRegex)) {
          this.OnFightStart(boss);
          return;
        }
      }
    }
  }

  OnChangeZone(e) {
    this.element.innerText = '';
    this.zoneName = e.zoneName;
    this.zoneId = e.zoneID;

    // Network log zone names that start with "the" are lowercase.
    // Adjust this here to match saved pull counts for zones which
    // do not have this property and originally used zone names
    // coming from the ffxiv parser plugin.

    // TODO: add some backwards compatible way to turn zone names into
    // zone ids when we load that zone and a pull count exists?
    // Proper-case zone names to match ACT.
    this.zoneName = this.zoneName.split(' ').map((word) => {
      if (!word || word.length === 0)
        return '';
      return word[0].toUpperCase() + word.substr(1);
    }).join(' ');

    this.ReloadTriggers();
  }

  ResetPullCounter() {
    if (this.bosses.length > 0) {
      for (const boss of this.bosses) {
        const id = boss.id;
        this.pullCounts[id] = 0;
        console.log('resetting pull count of: ' + id);
        this.ShowElementFor(id);
      }
    } else {
      const id = this.zoneName;
      console.log('resetting pull count of: ' + id);
      this.ShowElementFor(id);
    }

    this.SaveData();
  }

  ReloadTriggers() {
    this.bosses = [];
    this.countdownBoss = null;

    if (!this.zoneName || !this.pullCounts)
      return;

    for (const boss of gBossFightTriggers) {
      if (this.zoneId !== boss.zoneId)
        continue;
      this.bosses.push(boss);
      if (boss.countdownStarts) {
        // Only one boss can be started with countdown in a zone.
        if (this.countdownBoss)
          console.error('Countdown boss conflict: ' + boss.id + ', ' + this.countdownBoss.id);
        this.countdownBoss = boss;
      }
    }
  }

  OnInCombatChange(e) {
    if (!e.detail.inGameCombat) {
      this.bossStarted = false;
      return;
    }
    this.AutoStartBossIfNeeded();
  }

  AutoStartBossIfNeeded() {
    // Start an implicit boss fight for this zone in parties of 8 people
    // unless there's a door fight that specifies otherwise.
    if (this.bosses.length > 1)
      return;
    if (this.bossStarted)
      return;
    if (this.party.length != 8)
      return;

    if (this.bosses.length === 1) {
      const boss = this.bosses[0];
      if (boss.preventAutoStart)
        return;
      this.OnFightStart(boss);
      return;
    }

    this.OnFightStart({
      id: this.zoneName,
      countdownStarts: true,
    });
  }

  OnPartyWipe() {
    this.element.classList.add('wipe');
  }

  OnPartyChange(e) {
    this.party = e.party;
  }

  SetSaveData(e) {
    try {
      if (e != null && e.data)
        this.pullCounts = JSON.parse(e.data);
      else
        this.pullCounts = {};
    } catch (err) {
      console.error('onSendSaveData parse error: ' + err.message);
    }
    this.ReloadTriggers();
  }
}

UserConfig.getUserConfigLocation('pullcounter', Options, function() {
  gPullCounter = new PullCounter(document.getElementById('pullcounttext'));

  addOverlayListener('onLogEvent', (e) => gPullCounter.OnLogEvent(e));
  addOverlayListener('ChangeZone', (e) => gPullCounter.OnChangeZone(e));
  addOverlayListener('onInCombatChangedEvent', (e) => gPullCounter.OnInCombatChange(e));
  addOverlayListener('onPartyWipe', () => gPullCounter.OnPartyWipe());
  addOverlayListener('PartyChanged', (e) => gPullCounter.OnPartyChange(e));
});
