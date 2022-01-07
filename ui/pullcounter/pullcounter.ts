import { Lang } from '../../resources/languages';
import logDefinitions from '../../resources/netlog_defs';
import NetRegexes from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
import { addOverlayListener, callOverlayHandler } from '../../resources/overlay_plugin_api';
import { LocaleNetRegex } from '../../resources/translations';
import UserConfig from '../../resources/user_config';
import ZoneId from '../../resources/zone_id';
import { BaseOptions } from '../../types/data';
import { EventResponses, Party, SavedConfig } from '../../types/event';
import { CactbotBaseRegExp, TriggerTypes } from '../../types/net_trigger';
import { LocaleObject, ZoneIdType } from '../../types/trigger';

import '../../resources/defaults.css';
import './pullcounter.css';

interface PullCounterOptions extends BaseOptions {
  Language: Lang;
}

const defaultOptions: PullCounterOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  Language: 'en',
};

// NOTE: do not add more fights to this data structure.
// These exist for testing pullcounter and for backwards compatibility
// with pullcounter keys.  None of these were translated in the past,
// and so it's also not worth going back and adding these as there is
// no backwards compatibility issue for other languages.

type Boss = {
  readonly id: string;
  readonly zoneId?: ZoneIdType;
  readonly startRegex?: LocaleObject<CactbotBaseRegExp<TriggerTypes>>;
  readonly countdownStarts?: boolean;
  readonly preventAutoStart?: boolean;
};

const bossFightTriggers: readonly Boss[] = [
  {
    id: 'test',
    zoneId: ZoneId.MiddleLaNoscea,
    startRegex: {
      en: NetRegexes.gameLog({ line: 'You bow courteously to the striking dummy.*?' }),
      de: NetRegexes.gameLog(
        { line: 'Du verbeugst dich hochachtungsvoll vor der Trainingspuppe.*?' },
      ),
      fr: NetRegexes.gameLog({ line: 'Vous vous inclinez devant le mannequin d\'entraînement.*?' }),
      ja: NetRegexes.gameLog({ line: '.*は木人にお辞儀した.*?' }),
      cn: NetRegexes.gameLog({ line: '.*恭敬地对木人行礼.*?' }),
      ko: NetRegexes.gameLog({ line: '.*나무인형에게 공손하게 인사합니다.*?' }),
    },
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
    // 23F4 Dualcast
    startRegex: {
      en: NetRegexes.ability({ source: 'Exdeath', id: '23F4' }),
      de: NetRegexes.ability({ source: 'Exdeath', id: '23F4' }),
      fr: NetRegexes.ability({ source: 'Exdeath', id: '23F4' }),
      ja: NetRegexes.ability({ source: 'エクスデス', id: '23F4' }),
      cn: NetRegexes.ability({ source: '艾克斯迪司', id: '23F4' }),
      ko: NetRegexes.ability({ source: '엑스데스', id: '23F4' }),
    },
    preventAutoStart: true,
  },
  {
    id: 'o4s-neo',
    zoneId: ZoneId.DeltascapeV40Savage,
    // 2417 Almagest
    startRegex: {
      en: NetRegexes.ability({ source: 'Neo Exdeath', id: '2417' }),
      de: NetRegexes.ability({ source: 'Neo Exdeath', id: '2417' }),
      fr: NetRegexes.ability({ source: 'Neo Exdeath', id: '2417' }),
      ja: NetRegexes.ability({ source: 'ネオエクスデス', id: '2417' }),
      cn: NetRegexes.ability({ source: '新生艾克斯迪司', id: '2417' }),
      ko: NetRegexes.ability({ source: '네오 엑스데스', id: '2417' }),
    },
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
    startRegex: {
      en: NetRegexes.startsUsing({ source: 'Kefka', id: '28C2' }),
      de: NetRegexes.startsUsing({ source: 'Kefka', id: '28C2' }),
      fr: NetRegexes.startsUsing({ source: 'Kefka', id: '28C2' }),
      ja: NetRegexes.startsUsing({ source: 'ケフカ', id: '28C2' }),
      cn: NetRegexes.startsUsing({ source: '凯夫卡', id: '28C2' }),
      ko: NetRegexes.startsUsing({ source: '케프카', id: '28C2' }),
    },
    preventAutoStart: true,
  },
  {
    id: 'o8s-god kefka',
    zoneId: ZoneId.SigmascapeV40Savage,
    startRegex: {
      en: NetRegexes.startsUsing({ source: 'Kefka', id: '28EC' }),
      de: NetRegexes.startsUsing({ source: 'Kefka', id: '28EC' }),
      fr: NetRegexes.startsUsing({ source: 'Kefka', id: '28EC' }),
      ja: NetRegexes.startsUsing({ source: 'ケフカ', id: '28EC' }),
      cn: NetRegexes.startsUsing({ source: '凯夫卡', id: '28EC' }),
      ko: NetRegexes.startsUsing({ source: '케프카', id: '28EC' }),
    },
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
    startRegex: {
      en: NetRegexes.ability({ source: 'Omega-M', id: '337D' }),
      de: NetRegexes.ability({ source: 'Omega-M', id: '337D' }),
      fr: NetRegexes.ability({ source: 'Oméga-M', id: '337D' }),
      ja: NetRegexes.ability({ source: 'オメガM', id: '337D' }),
      cn: NetRegexes.ability({ source: '欧米茄M', id: '337D' }),
      ko: NetRegexes.ability({ source: '오메가 M', id: '337D' }),
    },
    preventAutoStart: true,
  },
  {
    id: 'o12s-final',
    zoneId: ZoneId.AlphascapeV40Savage,
    startRegex: {
      en: NetRegexes.ability({ source: 'Omega', id: '336C' }),
      de: NetRegexes.ability({ source: 'Omega', id: '336C' }),
      fr: NetRegexes.ability({ source: 'Oméga', id: '336C' }),
      ja: NetRegexes.ability({ source: 'オメガ', id: '336C' }),
      cn: NetRegexes.ability({ source: '欧米茄', id: '336C' }),
      ko: NetRegexes.ability({ source: '오메가', id: '336C' }),
    },
    preventAutoStart: true,
  },
  {
    id: 'The Southern Bozja Front',
    zoneId: ZoneId.TheBozjanSouthernFront,
    countdownStarts: false,
    preventAutoStart: true,
  },
  {
    id: 'Zadnor',
    zoneId: ZoneId.Zadnor,
    countdownStarts: false,
    preventAutoStart: true,
  },
] as const;

const getLocaleObject = <T>(object: LocaleObject<T>, lang: Lang): T => {
  return object[lang] || object.en;
};

class PullCounter {
  private zoneId?: ZoneIdType;
  private zoneName = '(unknown)';
  private party: Party[] = [];
  private bosses: Boss[] = [];
  private resetRegex = NetRegexes.echo({ line: '.*pullcounter reset.*?' });
  private countdownEngageRegex: RegExp;
  private pullCounts: { [bossId: string]: number } = {};

  private bossStarted = false;
  private countdownBoss?: Boss;

  constructor(private options: PullCounterOptions, private element: HTMLElement) {
    this.party = [];

    this.countdownEngageRegex = LocaleNetRegex.countdownEngage[this.options.ParserLanguage] ||
      LocaleNetRegex.countdownEngage['en'];

    void callOverlayHandler({
      call: 'cactbotLoadData',
      overlay: 'pullcounter',
    }).then((data) => this.SetSaveData(data));

    this.ReloadTriggers();
  }

  OnFightStart(boss: Boss) {
    this.pullCounts[boss.id] = (this.pullCounts[boss.id] ?? 0) + 1;
    this.bossStarted = true;

    this.ShowElementFor(boss.id);
    this.SaveData();
  }

  ShowElementFor(id: string) {
    this.element.innerText = (this.pullCounts[id] ?? 0).toString();
    this.element.classList.remove('wipe');
  }

  SaveData() {
    void callOverlayHandler({
      call: 'cactbotSaveData',
      overlay: 'pullcounter',
      data: JSON.stringify(this.pullCounts),
    });
  }

  OnNetLog(e: EventResponses['LogLine']): void {
    const log = e.rawLine;
    if (this.bossStarted)
      return;
    for (const boss of this.bosses) {
      if (
        boss.startRegex && getLocaleObject(boss.startRegex, this.options.ParserLanguage).test(log)
      ) {
        this.OnFightStart(boss);
        return;
      }
    }
    if (e.line[0] !== logDefinitions.GameLog.type)
      return;
    if (this.resetRegex.test(log))
      this.ResetPullCounter();
    if (this.countdownEngageRegex.test(log)) {
      if (this.countdownBoss)
        this.OnFightStart(this.countdownBoss);
      else
        this.AutoStartBossIfNeeded();
      return;
    }
  }

  OnChangeZone(e: EventResponses['ChangeZone']) {
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
      const firstChar = word[0];
      if (firstChar === undefined)
        return '';
      return firstChar.toUpperCase() + word.substr(1);
    }).join(' ');

    this.ReloadTriggers();
  }

  ResetPullCounter() {
    if (this.bosses.length > 0) {
      for (const boss of this.bosses) {
        const id = boss.id;
        this.pullCounts[id] = 0;
        console.log(`resetting pull count of: ${id}`);
        this.ShowElementFor(id);
      }
    } else {
      const id = this.zoneName;
      console.log(`resetting pull count of: ${id}`);
      this.ShowElementFor(id);
    }

    this.SaveData();
  }

  ReloadTriggers() {
    this.bosses = [];
    this.countdownBoss = undefined;

    if (!this.zoneId || !this.pullCounts)
      return;

    for (const boss of bossFightTriggers) {
      if (this.zoneId !== boss.zoneId)
        continue;
      this.bosses.push(boss);
      if (boss.countdownStarts) {
        // Only one boss can be started with countdown in a zone.
        if (this.countdownBoss)
          console.error(`Countdown boss conflict: ${boss.id}, ${this.countdownBoss.id}`);
        this.countdownBoss = boss;
      }
    }
  }

  OnInCombatChange(e: EventResponses['onInCombatChangedEvent']) {
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
    if (this.party.length !== 8)
      return;

    const firstBoss = this.bosses[0];
    if (firstBoss) {
      if (firstBoss.preventAutoStart)
        return;
      this.OnFightStart(firstBoss);
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

  OnPartyChange(e: EventResponses['PartyChanged']) {
    this.party = e.party;
  }

  SetSaveData(e?: SavedConfig) {
    if (!e || !e.data) {
      this.pullCounts = {};
      this.ReloadTriggers();
      return;
    }

    try {
      if (typeof e.data !== 'string')
        throw new Error(e.data.toString());

      const parsed: unknown = JSON.parse(e.data);
      if (!parsed || typeof parsed !== 'object')
        throw new Error(e.data);

      for (const [id, count] of Object.entries(parsed ?? {})) {
        if (typeof count !== 'number')
          throw new Error(e.data);
        this.pullCounts[id] = count;
      }
    } catch (err) {
      console.error(`onSendSaveData parse error`);
      console.error(err);
    }
    this.ReloadTriggers();
  }
}

UserConfig.getUserConfigLocation('pullcounter', defaultOptions, () => {
  const options = { ...defaultOptions };

  const element = document.getElementById('pullcounttext');
  if (!element)
    throw new UnreachableCode();

  const pullcounter = new PullCounter(options, element);

  addOverlayListener('LogLine', (e) => pullcounter.OnNetLog(e));
  addOverlayListener('ChangeZone', (e) => pullcounter.OnChangeZone(e));
  addOverlayListener('onInCombatChangedEvent', (e) => pullcounter.OnInCombatChange(e));
  addOverlayListener('onPartyWipe', () => pullcounter.OnPartyWipe());
  addOverlayListener('PartyChanged', (e) => pullcounter.OnPartyChange(e));
});
