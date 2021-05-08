import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';
import ContentType from '../../resources/content_type';
import { LocaleNetRegex } from '../../resources/translations';
import NetRegexes from '../../resources/netregexes';
import PartyTracker from '../../resources/party';
import Regexes from '../../resources/regexes';
import UserConfig from '../../resources/user_config';
import Util from '../../resources/util';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';

import './oopsyraidsy_config';

import oopsyFileData from './data/oopsy_manifest.txt';

const Options = {
  Triggers: [],
  PlayerNicks: {},
  DisabledTriggers: {},
  IgnoreContentTypes: [
    ContentType.Pvp,
    ContentType.Eureka,
  ],

  AbilityIdNameMap: {
    '5C6': 'Attack',
    '5C7': 'Attack',
    '5C8': 'Attack',
    '5C9': 'Attack',
    '19E7': 'Attack',
    '1AE2': 'Attack',
    '1AFE': 'Attack',
    '1C97': 'Attack',
    '1CB7': 'Attack',
    '2157': 'Lakshmi Auto',
    '21C5': 'Attack',
    '22EA': 'Attack',
    '23F2': 'Exdeath Auto',
    '249F': 'Attack',
    '24E1': 'Attack',
    '24E2': 'Attack',
    '24E8': 'Attack',
    '25B6': 'Attack',
    '26A7': 'Twin Auto',
    '26B4': 'Nael Auto',
    '26D0': 'Baha Auto',
    '2705': 'Attack',
    '27FC': 'Attack',
    '27FD': 'Attack',
    '27FE': 'Attack',
    '27FF': 'Attack',
    '28C1': 'Attack',
    '2B3E': 'Attack',

    // uwu temp
    '2B51': 'Attack',
    '2B53': 'Slipstream',
    '2B42': 'Mistral Song',
    '2B41': 'Grand Whirlwind',
    '2B50': 'Downburst',
    '2B45': 'Cyclone',
    '2B46': 'Gigaburst',
    '2B4D': 'Feather Rain',
    '2B54': 'Mistral Shriek',
    '2B48': 'Friction',
    '2BB5': 'Super Cyclone',
    '2B47': 'Super Cyclone',
    '2B55': 'Aerial Blast',
    '2B4B': 'Mistral Song',
    '2B52': 'Eye Of The Storm',
    '2B4E': 'Wicked Wheel',
    '2B4F': 'Wicked Tornado',
    '2B5F': 'Crimson Cyclone',
    '2B61': 'Radiant Plume',
    '2B57': 'Vulcan Burst',
    '2B56': 'Incinerate',
    '2B49': 'Mesohigh',
    '1CD': 'Nail Adds',
    '2C19': 'Infernal Fetters',
    '2B5A': 'Eruption',
    '2B5B': 'Inferno Howl',
    '2B5C': 'Searing Wind',
    '2B5E': 'Hellfire',
    '2B5D': 'Flaming Crush',
    '2CFD': 'Geocrush',
    '2B90': 'Earthen Fury',
    '2B58': 'Infernal Surge',
    '2B62': 'Rock Buster',
    '2B63': 'Mountain Buster',
    '2B64': 'Weight Of The Land',
    '2B65': 'Weight Of The Land',
    '2B66': 'Jump',
    '2B67': 'Upheaval',
    '2B68': 'Geocrush',
    '2B69': 'Bury',
    '2B6A': 'Detonation',
    '2B6B': 'Rock Throw',
    '2B6C': 'Rock Throw',
    '2B6D': 'Granite Impact',
    '2B6E': 'Freefire',
    '2B6F': 'Landslide',
    '2B70': 'Landslide',
    '2B71': 'Landslide',
    '2C18': 'Tumult',

    // TEA
    '4978': 'Attack',
    '4979': 'Attack',
  },
};

const kEarlyPullText = {
  en: 'early pull',
  de: 'zu früh angegriffen',
  fr: 'early pull',
  ja: 'タゲ取り早い',
  cn: '抢开',
  ko: '풀링 빠름',
};

const kLatePullText = {
  en: 'late pull',
  de: 'zu spät angegriffen',
  fr: 'late pull',
  ja: 'タゲ取り遅い',
  cn: '晚开',
  ko: '풀링 늦음',
};

const kPartyWipeText = {
  en: 'Party Wipe',
  de: 'Gruppe ausgelöscht',
  fr: 'Party Wipe',
  ja: 'ワイプ',
  cn: '团灭',
  ko: '파티 전멸',
};

const kCopiedMessage = {
  en: 'Copied!',
  de: 'Kopiert!',
  fr: 'Copié !',
  ja: 'コピーした！',
  cn: '已复制！',
  ko: '복사 완료!',
};

// Internal trigger id for early pull
const kEarlyPullId = 'General Early Pull';

// Fields for net log ability lines.
const kFieldFlags = 8;
const kFieldDamage = 9;

// If kFieldFlags is any of these values, then consider field 10/11 as 8/9.
// It appears a little bit that flags come in pairs of values, but it's unclear
// what these mean.
const kShiftFlagValues = ['3E', '113', '213', '313'];
const kFlagInstantDeath = '36'; // Always 36 ?
// miss, damage, block, parry, instant death
const kAttackFlags = ['01', '03', '05', '06', kFlagInstantDeath];

/* eslint-disable max-len */

/*
Field 7 Flags:
  '0' = meditation, aoe with no targets

  damage low bytes:
    0x01 = dodge
    0x03 = damage
    0x05 = blocked damage
    0x06 = parried damage
    0x?? = instant death

  damage modifiers:
    0x100 = crit damage
    0x200 = direct hit damage
    0x300 = crit direct hit damage

  heal modifiers:
    0x00004 = heal
    0x10004 = crit heal

  Special cases:
    * If flags are 3E, shift 9+10 two over to be 7+8.  (why???)
    * Plenary indulgence has flags=113/213/313 for stacks, shift two as well.

  Damage:
    * Left-extend zeroes to 8 chars, e.g. 2934001 => 02934001, or 1000 => 00001000.
    * Should be interpreted as 4 bytes (8 chars).
    * First two bytes are damage.
    * 00004000 mask implies extra damage (and some weird math):
      bytes = ABCD, where C = 0x40.
      total damage = DA(B-D), as three bytes together interpreted as an integer.
      e.g. 424E400F => 0F 42 (4E - 0F = 3F) => 0F423F => 999999
    * 00001000 mask implies 0 damage, e.g. hallowed.

Examples:
(1) 18216 damage from Grand Cross Alpha (basic damage)
  16:40001333:Neo Exdeath:242B:Grand Cross Alpha:1048638C:Tater Tot:750003:47280000:1C:80242B:0:0:0:0:0:0:0:0:0:0:0:0:36906:41241:5160:5160:880:1000:0.009226365:-7.81128:-1.192093E-07:16043015:17702272:12000:12000:1000:1000:-0.01531982:-19.02808:0:

(2) 82538 damage from Hyperdrive (0x4000 extra damage mask)
  15:40024FBA:Kefka:28E8:Hyperdrive:106C1DBA:Okonomi Yaki:750003:426B4001:1C:28E88000:0:0:0:0:0:0:0:0:0:0:0:0:35811:62464:4560:4560:940:1000:-0.1586061:-5.753153:0:30098906:31559062:12000:12000:1000:1000:0.3508911:0.4425049:2.384186E-07:

(3) 22109 damage from Grand Cross Omega (:3E:0: shift, unknown 0x40000 flag)
  16:40001333:Neo Exdeath:242D:Grand Cross Omega:1048638C:Tater Tot:3E:0:750003:565D0000:1C:80242D:0:0:0:0:0:0:0:0:0:0:41241:41241:5160:5160:670:1000:-0.3251641:6.526299:1.192093E-07:7560944:17702272:12000:12000:1000:1000:0:19:2.384186E-07:

(4) 15732 crit heal from 3 confession stack Plenary Indulgence (:?13:4C3: shift)
  16:10647D2F:Tako Yaki:1D09:Plenary Indulgence:106DD019:Okonomi Yaki:313:4C3:10004:3D74:0:0:0:0:0:0:0:0:0:0:0:0:7124:40265:14400:9192:1000:1000:-10.78815:11.94781:0:11343:40029:19652:16451:1000:1000:6.336648:7.710004:0:

(5) instant death twister
  16:40004D5D:Twintania:26AB:Twister:10573FDC:Tini Poutini:33:0:1C:26AB8000:0:0:0:0:0:0:0:0:0:0:0:0:43985:43985:5760:5760:910:1000:-8.42179:9.49251:-1.192093E-07:57250:57250:0:0:1000:1000:-8.565645:10.20959:0:

(6) zero damage targetless aoe (E0000000 target)
  16:103AAEE4:Potato Chippy:B1:Miasma II:E0000000::0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0::::::::::19400:40287:17649:17633:1000:1000:-0.656189:-3.799561:-5.960464E-08:

*/

/* eslint-enable */

function ShortNamify(name) {
  // TODO: make this unique among the party in case of first name collisions.
  // TODO: probably this should be a general cactbot utility.

  if (name in Options.PlayerNicks)
    return Options.PlayerNicks[name];

  const idx = name.indexOf(' ');
  return idx < 0 ? name : name.substr(0, idx);
}

// Turns a scrambled string damage field into an integer.
// Since fields are modified in place right now, this does nothing if called
// again with an integer.  This is kind of a hack, sorry.
function UnscrambleDamage(field) {
  if (typeof field !== 'string')
    return field;
  const len = field.length;
  if (len <= 4)
    return 0;
  // Get the left two bytes as damage.
  let damage = parseInt(field.substr(0, len - 4), 16);
  // Check for third byte == 0x40.
  if (field[len - 4] === '4') {
    // Wrap in the 4th byte as extra damage.  See notes above.
    const rightDamage = parseInt(field.substr(len - 2, 2), 16);
    damage = damage - rightDamage + (rightDamage << 16);
  }
  return damage;
}

function IsPlayerId(id) {
  return id[0] < 4;
}

function IsTriggerEnabled(options, id) {
  if (id in options.DisabledTriggers)
    return false;

  const autoConfig = options.PerTriggerAutoConfig[id];
  if (autoConfig)
    return autoConfig.enabled;

  return true;
}

class OopsyLiveList {
  constructor(options, element) {
    this.options = options;
    this.scroller = element;
    this.container = element.children[0];
    this.Reset();
    this.SetInCombat(false);
  }

  SetInCombat(inCombat) {
    if (this.inCombat === inCombat)
      return;
    this.inCombat = inCombat;
    if (inCombat) {
      this.container.classList.remove('out-of-combat');
      this.HideOldItems();
    } else {
      // TODO: Add an X button to hide/clear the list.
      this.container.classList.add('out-of-combat');
      this.ShowAllItems();
    }
  }

  AddLine(iconClass, text, time) {
    const maxItems = this.options.NumLiveListItemsInCombat;

    let rowDiv;
    if (this.numItems < this.items.length)
      rowDiv = this.items[this.numItems];
    else
      rowDiv = this.MakeRow();

    this.numItems++;

    const iconDiv = document.createElement('div');
    iconDiv.classList.add('mistake-icon');
    iconDiv.classList.add(iconClass);
    rowDiv.appendChild(iconDiv);
    const textDiv = document.createElement('div');
    textDiv.classList.add('mistake-text');
    textDiv.innerHTML = text;
    rowDiv.appendChild(textDiv);
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('mistake-time');
    timeDiv.innerHTML = time;
    rowDiv.appendChild(timeDiv);

    // Hide anything over the limit from the past.
    if (this.inCombat) {
      if (this.numItems > maxItems)
        this.items[this.numItems - maxItems - 1].classList.add('hide');
    }

    // Show and scroll to bottom.
    this.container.classList.remove('hide');
    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  MakeRow() {
    const div = document.createElement('div');
    div.classList.add('mistake-row');

    // click-to-copy function
    div.addEventListener('click', () => {
      const mistakeText = div.childNodes[1].textContent;
      const mistakeTime = div.childNodes[2].textContent;
      const str = mistakeTime ? `[${mistakeTime}] ${mistakeText}` : mistakeText;
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      // copied message
      const msg = document.createElement('div');
      msg.classList.add('copied-msg');
      msg.innerText = kCopiedMessage[this.options.DisplayLanguage] || kCopiedMessage['en'];
      document.body.appendChild(msg);
      setTimeout(() => {
        document.body.removeChild(msg);
      }, 1000);
    });
    this.items.push(div);
    this.container.appendChild(div);
    return div;
  }

  ShowAllItems() {
    for (let i = 0; i < this.items.length; ++i)
      this.items[i].classList.remove('hide');

    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  HideOldItems() {
    const maxItems = this.options.NumLiveListItemsInCombat;
    for (let i = 0; i < this.items.length - maxItems; ++i)
      this.items[i].classList.add('hide');
  }

  Reset() {
    this.container.classList.add('hide');
    this.items = [];
    this.numItems = 0;
    this.container.innerHTML = '';
  }

  StartNewACTCombat() {
    this.Reset();
  }

  OnChangeZone(e) {
    this.Reset();
  }
}

class OopsySummaryList {
  constructor(options, container) {
    this.options = options;
    this.container = container;
    this.container.classList.remove('hide');

    this.pullIdx = 0;
    this.zoneName = null;
    this.currentDiv = null;
  }

  GetTimeStr(d) {
    // ISO-8601 or death.
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('00' + d.getHours()).slice(-2);
    const minutes = ('00' + d.getMinutes()).slice(-2);
    return `${d.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
  }

  StartNewSectionIfNeeded() {
    if (this.currentDiv)
      return;

    const section = document.createElement('div');
    section.classList.add('section');
    this.container.appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('section-header');
    section.appendChild(headerDiv);

    // TODO: It would kind of be nice to sync this with pullcounter,
    // but it's not clear how to connect these two.
    this.pullIdx++;

    const pullDiv = document.createElement('div');
    pullDiv.innerText = `Pull ${this.pullIdx}`;
    headerDiv.appendChild(pullDiv);
    const zoneDiv = document.createElement('div');
    if (this.zoneName)
      zoneDiv.innerText = `(${this.zoneName})`;
    headerDiv.appendChild(zoneDiv);
    const timeDiv = document.createElement('div');
    timeDiv.innerText = this.GetTimeStr(new Date());
    headerDiv.appendChild(timeDiv);

    const rowContainer = document.createElement('div');
    rowContainer.classList.add('section-rows');
    section.appendChild(rowContainer);

    this.currentDiv = rowContainer;
  }

  EndSection() {
    this.currentDiv = null;
  }

  AddLine(iconClass, text, time) {
    this.StartNewSectionIfNeeded();

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('mistake-row');
    this.currentDiv.appendChild(rowDiv);

    // TODO: maybe combine this with OopsyLiveList.
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('mistake-icon');
    iconDiv.classList.add(iconClass);
    rowDiv.appendChild(iconDiv);
    const textDiv = document.createElement('div');
    textDiv.classList.add('mistake-text');
    textDiv.innerHTML = text;
    rowDiv.appendChild(textDiv);
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('mistake-time');
    timeDiv.innerHTML = time;
    rowDiv.appendChild(timeDiv);
  }

  SetInCombat(inCombat) {
    // noop
  }

  StartNewACTCombat() {
    this.EndSection();
    this.StartNewSectionIfNeeded();
  }

  OnChangeZone(e) {
    this.zoneName = e.zoneName;
  }
}

// Collector:
// * processes mistakes, adds lines to the live list
// * handles timing issues with starting/stopping/early pulls
class MistakeCollector {
  constructor(options, listView) {
    this.options = options;
    this.parserLang = this.options.ParserLanguage || 'en';
    this.listView = listView;
    this.baseTime = null;
    this.inACTCombat = false;
    this.inGameCombat = false;
    this.Reset();
  }

  Reset() {
    this.startTime = null;
    this.stopTime = null;
    this.firstPuller = null;
    this.engageTime = null;
  }

  GetFormattedTime(time) {
    if (!this.baseTime)
      return '';
    if (!time)
      time = Date.now();
    const totalSeconds = Math.floor((time - this.baseTime) / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  StartCombat() {
    // Wiping / in combat state / damage are all racy with each other.
    // One potential ordering:
    //   -in combat: false
    //   -wipe
    //   -belated death/damage <-- this damage shouldn't start
    //   -damage (early pull) <-- this damage should
    //   -in combat: true
    // Therefore, suppress "start combat" after wipes within a short
    // period of time.  Gross.
    //
    // Because damage comes before in combat (regardless of where engage
    // occurs), StartCombat has to be responsible for clearing the listView
    // list.
    const now = Date.now();
    const kMinimumSecondsAfterWipe = 5;
    if (this.stopTime && now - this.stopTime < 1000 * kMinimumSecondsAfterWipe)
      return;
    this.startTime = now;
    this.stopTime = null;
  }

  StopCombat() {
    this.startTime = null;
    this.stopTime = Date.now();
    this.firstPuller = null;
    this.engageTime = null;
  }

  Translate(obj) {
    if (obj !== Object(obj))
      return obj;
    if (this.options.DisplayLanguage in obj)
      return obj[this.options.DisplayLanguage];
    return obj['en'];
  }

  OnMistakeObj(m) {
    if (!m)
      return;
    if (m.fullText)
      this.OnFullMistakeText(m.type, m.blame, this.Translate(m.fullText));
    else
      this.OnMistakeText(m.type, m.name || m.blame, this.Translate(m.text));
  }

  OnMistakeText(type, blame, text, time) {
    if (!text)
      return;
    const blameText = blame ? ShortNamify(blame) + ': ' : '';
    this.listView.AddLine(type, blameText + text, this.GetFormattedTime(time));
  }

  OnFullMistakeText(type, blame, text, time) {
    if (!text)
      return;
    this.listView.AddLine(type, text, this.GetFormattedTime(time));
  }

  AddEngage() {
    this.engageTime = Date.now();
    if (!this.firstPuller) {
      this.StartCombat();
      return;
    }
    const seconds = ((Date.now() - this.startTime) / 1000);
    if (this.firstPuller && seconds >= this.options.MinimumTimeForPullMistake) {
      const text = this.Translate(kEarlyPullText) + ' (' + seconds.toFixed(1) + 's)';
      if (IsTriggerEnabled(this.options, kEarlyPullId))
        this.OnMistakeText('pull', this.firstPuller, text);
    }
  }

  AddDamage(matches) {
    if (!this.firstPuller) {
      if (IsPlayerId(matches.sourceId))
        this.firstPuller = matches.source;
      else if (IsPlayerId(matches.targetId))
        this.firstPuller = matches.target;
      else
        this.firstPuller = '???';

      this.StartCombat();
      const seconds = ((Date.now() - this.engageTime) / 1000);
      if (this.engageTime && seconds >= this.options.MinimumTimeForPullMistake) {
        const text = this.Translate(kLatePullText) + ' (' + seconds.toFixed(1) + 's)';
        if (IsTriggerEnabled(this.options, kEarlyPullId))
          this.OnMistakeText('pull', this.firstPuller, text);
      }
    }
  }

  AddDeath(name, matches) {
    let text;
    if (matches) {
      // Note: ACT just evaluates independently what the hp of everybody
      // is and so may be out of date modulo one hp regen tick with
      // respect to the "current" hp value, e.g. charybdis may appear to do
      // more damage than you have hp, "killing" you.  This is good enough.

      // TODO: record the last N seconds of damage, as often folks are
      // killed by 2+ things (e.g. 3x flares, or 2x Blizzard III).

      // hp string = (damage/hp at time of death)
      let hp = '';
      if (matches.flags === kFlagInstantDeath) {
        // TODO: show something for infinite damage?
      } else if ('targetCurrentHp' in matches) {
        hp = ' (' + UnscrambleDamage(matches.damage) + '/' + matches.targetCurrentHp + ')';
      }
      text = matches.ability + hp;
    }
    this.OnMistakeText('death', name, text);

    // TODO: some things don't have abilities, e.g. jumping off titan ex.
    // This will just show the last thing that hit you before you were
    // defeated.  Maybe the unparsed log entries have this??
  }

  OnPartyWipeEvent(e) {
    // TODO: record the time that StopCombat occurs and throw the party
    // wipe then (to make post-wipe deaths more obvious), however this
    // requires making liveList be able to insert items in a sorted
    // manner instead of just being append only.
    this.OnFullMistakeText('wipe', null, this.Translate(kPartyWipeText));
    // Party wipe usually comes a few seconds after everybody dies
    // so this will clobber any late damage.
    this.StopCombat();
  }

  OnInCombatChangedEvent(e) {
    // For usability sake:
    //   - to avoid dungeon trash starting stopping combat and resetting the
    //     list repeatedly, only reset when ACT starts a new encounter.
    //   - for consistency with DPS meters, fflogs, etc, use ACT's encounter
    //     time as the start time, not when game combat becomes true.
    //   - to make it more readable, show/hide old mistakes out of game
    //     combat, and consider early pulls starting game combat early.  This
    //     allows for one long dungeon ACT encounter to have multiple early
    //     or late pulls.
    const inGameCombat = e.detail.inGameCombat;
    if (this.inGameCombat !== inGameCombat) {
      this.inGameCombat = inGameCombat;
      if (inGameCombat)
        this.StartCombat();
      else
        this.StopCombat();

      this.listView.SetInCombat(this.inGameCombat);
    }

    const inACTCombat = e.detail.inACTCombat;
    if (this.inACTCombat !== inACTCombat) {
      this.inACTCombat = inACTCombat;
      if (inACTCombat) {
        // TODO: This message should probably include the timestamp
        // for when combat started.  Starting here is not the right
        // time if this plugin is loaded while ACT is already in combat.
        this.baseTime = Date.now();
        this.listView.StartNewACTCombat();
      }
    }
  }

  OnChangeZone(e) {
    this.Reset();
  }
}

class DamageTracker {
  constructor(options, collector, dataFiles) {
    this.options = options;
    this.collector = collector;
    this.dataFiles = dataFiles;
    this.triggerSets = null;
    this.inCombat = false;
    this.ignoreZone = false;
    this.timers = [];
    this.generalTriggers = [];
    this.damageTriggers = [];
    this.abilityTriggers = [];
    this.effectTriggers = [];
    this.healTriggers = [];
    this.netTriggers = [];

    this.partyTracker = new PartyTracker();
    addOverlayListener('PartyChanged', (e) => {
      this.partyTracker.onPartyChanged(e);
    });

    const lang = this.options.ParserLanguage;
    this.countdownEngageRegex = LocaleNetRegex.countdownEngage[lang] ||
      LocaleNetRegex.countdownEngage['en'];
    this.countdownStartRegex = LocaleNetRegex.countdownStart[lang] ||
      LocaleNetRegex.countdownStart['en'];
    this.countdownCancelRegex = LocaleNetRegex.countdownCancel[lang] ||
      LocaleNetRegex.countdownCancel['en'];
    this.defeatedRegex = NetRegexes.wasDefeated();
    this.abilityFullRegex = NetRegexes.abilityFull();

    this.Reset();
  }

  // TODO: this shouldn't clear timers and triggers
  // TODO: seems like some reloads are causing the /poke test to get undefined
  Reset() {
    this.data = {
      me: this.me,
      job: this.job,
      role: this.role,
      party: this.partyTracker,
      inCombat: this.inCombat,
      ShortName: ShortNamify,
      IsPlayerId: IsPlayerId,

      // Deprecated.
      ParseLocaleFloat: parseFloat,
    };
    this.lastDamage = {};
    // Trigger ID -> { events: [], matches: [] }
    this.activeTriggers = {};
    this.triggerSuppress = {};

    for (let i = 0; i < this.timers.length; ++i)
      window.clearTimeout(this.timers[i]);
    this.timers = [];
  }

  OnNetLog(e) {
    if (this.ignoreZone)
      return;

    const line = e.rawLine;
    for (const trigger of this.netTriggers) {
      const matches = line.match(trigger.netRegex);
      if (matches)
        this.OnTrigger(trigger, { line: line }, matches);
    }

    const splitLine = e.line;
    const type = splitLine[0];

    if (type === '00') {
      if (this.countdownEngageRegex.test(line))
        this.collector.AddEngage();
      if (this.countdownStartRegex.test(line) || this.countdownCancelRegex.test(line))
        this.collector.Reset();
    } else if (type === '26') {
      this.OnEffectEvent(line);
    } else if (type === '21' || type === '22') {
      this.OnAbilityEvent(line, splitLine);
    } else if (type === '25') {
      this.OnDefeated(line);
    }
  }

  OnLogEvent(e) {
    if (this.ignoreZone || this.generalTriggers.length === 0)
      return;
    for (const line of e.detail.logs) {
      for (const trigger of this.generalTriggers) {
        const matches = line.match(trigger.regex);
        if (matches)
          this.OnTrigger(trigger, { line: line }, matches);
      }
    }
  }

  OnDefeated(line) {
    const matches = line.match(this.defeatedRegex);
    if (!matches)
      return;
    const name = matches.groups.target;

    const last = this.lastDamage[name];
    delete this.lastDamage[name];

    // Monsters get defeated as well, but they will never
    // have lastDamage marked for them.  It's possible that
    // in a very short fight, a player will never take
    // damage and will not get killed by an ability and
    // so won't get a death notice.

    // TODO: track all players in the instance and support
    // death notices even if there's no ability damage.
    if (last)
      this.collector.AddDeath(name, last);
  }

  OnAbilityEvent(line, splitLine) {
    const lineMatches = line.match(this.abilityFullRegex);
    if (!lineMatches)
      return;

    const matches = lineMatches.groups;

    // Shift damage and flags forward for mysterious spurious :3E:0:.
    // Plenary Indulgence also appears to prepend confession stacks.
    // UNKNOWN: Can these two happen at the same time?
    if (kShiftFlagValues.includes(splitLine[kFieldFlags])) {
      matches.flags = splitLine[kFieldFlags + 2];
      matches.damage = splitLine[kFieldFlags + 3];
    }

    // Lazy initialize event.
    let evt;

    const abilityId = matches.id;
    for (const trigger of this.abilityTriggers) {
      if (!trigger.idRegex.test(abilityId))
        continue;
      if (!evt)
        evt = this.ProcessMatchesIntoEvent(line, matches);
      this.OnTrigger(trigger, evt, matches);
    }

    // Length 1 or 2.
    let lowByte = matches.flags.substr(-2);
    if (lowByte.length === 1)
      lowByte = '0' + lowByte;

    // Healing?
    if (lowByte === '04') {
      for (const trigger of this.healTriggers) {
        if (!trigger.idRegex.test(abilityId))
          continue;
        if (!evt)
          evt = this.ProcessMatchesIntoEvent(line, matches);
        this.OnTrigger(trigger, evt, matches);
      }
      return;
    }

    if (!kAttackFlags.includes(lowByte))
      return;

    // TODO track first puller here, collector doesn't need every damage line
    if (!this.collector.firstPuller)
      this.collector.AddDamage(matches);

    if (IsPlayerId(matches.targetId))
      this.lastDamage[matches.target] = matches;

    for (const trigger of this.damageTriggers) {
      if (!trigger.idRegex.test(abilityId))
        continue;
      if (!evt)
        evt = this.ProcessMatchesIntoEvent(line, matches);
      this.OnTrigger(trigger, evt, matches);
    }
  }

  OnEffectEvent(line) {
    let evt;
    for (const trigger of this.effectTriggers) {
      let matches;
      let isGainLine;
      if (trigger.gainRegex) {
        matches = line.match(trigger.gainRegex);
        if (matches)
          isGainLine = true;
      }
      if (!matches && trigger.loseRegex) {
        matches = line.match(trigger.loseRegex);
        if (matches)
          isGainLine = false;
      }
      if (!matches)
        continue;

      const g = matches.groups;
      if (!evt) {
        evt = {
          targetName: g.target,
          effectName: g.effect,
          attackerName: g.source,
          gains: isGainLine,
          durationSeconds: g.duration,
        };
      }
      this.OnTrigger(trigger, evt, g);
    }
  }

  // This function does too much, but it's a way to do one-time work if any trigger
  // matches without having to do that work on every single ability line.
  // This should only be called once per matches object as it modifies it.
  ProcessMatchesIntoEvent(line, matches) {
    const abilityId = matches.id;
    if (abilityId in this.options.AbilityIdNameMap)
      matches.ability = this.options.AbilityIdNameMap[abilityId];

    matches.damage = UnscrambleDamage(matches.damage);

    return {
      line: line,
      // Convert from network log decimal id to parsed log hex id for backwards compat.
      type: matches.type === '21' ? '15' : '16',
      attackerId: matches.sourceId,
      attackerName: matches.source,
      abilityId: matches.id,
      abilityName: matches.ability,
      targetId: matches.targetId,
      targetName: matches.target,
      flags: matches.flags,
      damage: matches.damage,
      targetCurrentHp: matches.targetCurrentHp,
      targetMaxHp: matches.targetMaxHp,
      damageStr: matches.damage,
    };
  }

  AddImpliedDeathReason(obj) {
    if (!obj)
      return;
    this.lastDamage[obj.name] = {
      target: obj.name,
      ability: obj.reason,
      flags: kFlagInstantDeath,
      damage: 0,
    };
  }

  OnTrigger(trigger, evt, matches) {
    const triggerTime = Date.now();

    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if (matches && matches.groups)
      matches = matches.groups;

    if (trigger.id) {
      if (!IsTriggerEnabled(this.options, trigger.id))
        return;

      if (trigger.id in this.triggerSuppress) {
        if (this.triggerSuppress[trigger.id] > triggerTime)
          return;
        delete this.triggerSuppress[trigger.id];
      }
    }

    if ('condition' in trigger) {
      if (!trigger.condition(evt, this.data, matches))
        return;
    }

    const ValueOrFunction = (f, events, matches) => {
      return (typeof f === 'function') ? f(events, this.data, matches) : f;
    };

    const collectSeconds = 'collectSeconds' in trigger ? ValueOrFunction(trigger.collectSeconds, matches) : 0;
    const collectMultipleEvents = 'collectSeconds' in trigger;
    if (collectMultipleEvents && trigger.id in this.activeTriggers) {
      this.activeTriggers[trigger.id].events.push(evt);
      this.activeTriggers[trigger.id].matches.push(matches);
      return;
    }
    let delay;
    if (collectMultipleEvents)
      delay = collectSeconds || 0;
    else
      delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds, evt, matches) : 0;

    const suppress = 'suppressSeconds' in trigger ? ValueOrFunction(trigger.suppressSeconds) : 0;
    if (trigger.id && suppress > 0)
      this.triggerSuppress[trigger.id] = triggerTime + (suppress * 1000);

    const f = (function() {
      let eventParam = evt;
      let matchesParam = matches;
      if (collectMultipleEvents) {
        eventParam = this.activeTriggers[trigger.id].events;
        matchesParam = this.activeTriggers[trigger.id].matches;
        delete this.activeTriggers[trigger.id];
      }

      if ('mistake' in trigger) {
        const m = ValueOrFunction(trigger.mistake, eventParam, matchesParam);
        if (Array.isArray(m)) {
          for (let i = 0; i < m.length; ++i)
            this.collector.OnMistakeObj(m[i]);
        } else {
          this.collector.OnMistakeObj(m);
        }
      }
      if ('deathReason' in trigger) {
        const ret = ValueOrFunction(trigger.deathReason, eventParam, matchesParam);
        if (ret) {
          ret.reason = this.collector.Translate(ret.reason);
          this.AddImpliedDeathReason(ret);
        }
      }
      if ('run' in trigger)
        ValueOrFunction(trigger.run, eventParam, matchesParam);
    }).bind(this);

    // Even if delay = 0, if collectMultipleEvents is specified,
    // then set this here so that events can be passed as an array for consistency.
    if (collectMultipleEvents) {
      if (!trigger.id) {
        console.error('Missing trigger id with collectSeconds specified.');
        return;
      }
      this.activeTriggers[trigger.id] = {
        events: [evt],
        matches: [matches],
      };
    }

    if (!delay)
      f();
    else
      this.timers.push(window.setTimeout(f, delay * 1000));
  }

  OnPartyWipeEvent(e) {
    if (this.ignoreZone)
      return;
    this.Reset();
    this.collector.OnPartyWipeEvent(e);
  }

  OnChangeZone(e) {
    this.zoneName = e.zoneName;
    this.zoneId = e.zoneID;

    const zoneInfo = ZoneInfo[this.zoneId];
    this.contentType = zoneInfo ? zoneInfo.contentType : 0;

    this.ReloadTriggers();
  }

  OnInCombatChangedEvent(e) {
    this.inCombat = e.detail.inGameCombat;
    this.data.inCombat = this.inCombat;
  }

  AddSimpleTriggers(type, dict) {
    if (!dict)
      return;
    const keys = Object.keys(dict);
    for (const key of keys) {
      const id = dict[key];
      const trigger = {
        id: key,
        damageRegex: id,
        idRegex: Regexes.parse('^' + id + '$'),
        mistake: function(e, data) {
          if (!IsPlayerId(e.targetId))
            return;
          return { type: type, blame: e.targetName, text: e.abilityName };
        },
      };
      this.damageTriggers.push(trigger);
    }
  }

  AddGainsEffectTriggers(type, dict) {
    if (!dict)
      return;
    const keys = Object.keys(dict);
    for (const key of keys) {
      const id = dict[key];
      const trigger = {
        id: key,
        netRegex: NetRegexes.gainsEffect({ effectId: id }),
        mistake: function(e, data, matches) {
          return { type: type, blame: matches.target, text: matches.effect };
        },
      };
      this.netTriggers.push(trigger);
    }
  }

  // Helper function for "double tap" shares where multiple players share
  // damage when it should only be on one person, such as a spread mechanic.
  AddShareTriggers(type, dict) {
    if (!dict)
      return;
    const keys = Object.keys(dict);
    const condFunc = (e) => e.type !== '15';
    for (const key of keys) {
      const id = dict[key];
      const trigger = {
        id: key,
        damageRegex: id,
        condition: condFunc,
        idRegex: Regexes.parse('^' + id + '$'),
        mistake: function(e, data) {
          return { type: type, blame: e.targetName, text: e.abilityName };
        },
      };
      this.damageTriggers.push(trigger);
    }
  }

  ReloadTriggers() {
    this.ProcessDataFiles();

    // Wait for datafiles / jobs / zone events / localization.
    if (!this.triggerSets || !this.me || !this.zoneName)
      return;

    this.Reset();

    this.generalTriggers = [];
    this.damageTriggers = [];
    this.abilityTriggers = [];
    this.effectTriggers = [];
    this.healTriggers = [];
    this.netTriggers = [];

    this.ignoreZone = Options.IgnoreContentTypes.includes(this.contentType);
    if (this.ignoreZone)
      return;

    for (const set of this.triggerSets) {
      if ('zoneId' in set) {
        if (set.zoneId !== ZoneId.MatchAll && set.zoneId !== this.zoneId && !(typeof set.zoneId === 'object' && set.zoneId.includes(this.zoneId)))
          continue;
      } else if ('zoneRegex' in set) {
        const zoneError = (s) => {
          console.error(s + ': ' + JSON.stringify(set.zoneRegex) + ' in ' + set.filename);
        };

        let zoneRegex = set.zoneRegex;
        if (typeof zoneRegex !== 'object') {
          zoneError('zoneRegex must be translatable object or regexp');
          continue;
        } else if (!(zoneRegex instanceof RegExp)) {
          const parserLang = this.options.ParserLanguage || 'en';
          if (parserLang in zoneRegex) {
            zoneRegex = zoneRegex[parserLang];
          } else if ('en' in zoneRegex) {
            zoneRegex = zoneRegex['en'];
          } else {
            zoneError('unknown zoneRegex language');
            continue;
          }

          if (!(zoneRegex instanceof RegExp)) {
            zoneError('zoneRegex must be regexp');
            continue;
          }
        }

        if (this.zoneName.search(Regexes.parse(zoneRegex)) < 0)
          continue;
      } else {
        return;
      }

      if (this.options.Debug) {
        if (set.filename)
          console.log('Loading ' + set.filename);
        else
          console.log('Loading user triggers for zone');
      }

      this.AddSimpleTriggers('warn', set.damageWarn);
      this.AddSimpleTriggers('fail', set.damageFail);
      this.AddGainsEffectTriggers('warn', set.gainsEffectWarn);
      this.AddGainsEffectTriggers('fail', set.gainsEffectFail);
      this.AddShareTriggers('warn', set.shareWarn);
      this.AddShareTriggers('fail', set.shareFail);

      if (!set.triggers)
        set.triggers = [];
      for (let j = 0; j < set.triggers.length; ++j) {
        const trigger = set.triggers[j];
        if ('regex' in trigger) {
          trigger.regex = Regexes.parse(Regexes.anyOf(trigger.regex));
          this.generalTriggers.push(trigger);
        }
        if ('damageRegex' in trigger) {
          trigger.idRegex = Regexes.parse('^' + Regexes.anyOf(trigger.damageRegex) + '$');
          this.damageTriggers.push(trigger);
        }
        if ('abilityRegex' in trigger) {
          trigger.idRegex = Regexes.parse('^' + Regexes.anyOf(trigger.abilityRegex) + '$');
          this.abilityTriggers.push(trigger);
        }
        if ('gainsEffectRegex' in trigger) {
          trigger.gainRegex = NetRegexes.gainsEffect({ effect: trigger.gainsEffectRegex });
          this.effectTriggers.push(trigger);
        }
        if ('losesEffectRegex' in trigger) {
          trigger.loseRegex = NetRegexes.losesEffect({ effect: trigger.losesEffectRegex });
          this.effectTriggers.push(trigger);
        }
        if ('healRegex' in trigger) {
          trigger.idRegex = Regexes.parse('^' + Regexes.anyOf(trigger.healRegex) + '$');
          this.healTriggers.push(trigger);
        }
        if ('netRegex' in trigger) {
          trigger.netRegex = Regexes.parse(Regexes.anyOf(trigger.netRegex));
          this.netTriggers.push(trigger);
        }
      }
    }
  }

  OnPlayerChange(e) {
    if (this.job === e.detail.job && this.me === e.detail.name)
      return;

    this.me = e.detail.name;
    this.job = e.detail.job;
    this.role = Util.jobToRole(this.job);
    this.ReloadTriggers();
  }

  ProcessDataFiles() {
    // Only run this once.
    if (this.triggerSets)
      return;
    if (!this.me)
      return;

    this.triggerSets = Options.Triggers;
    for (const filename in this.dataFiles) {
      const json = this.dataFiles[filename];
      if (typeof json !== 'object') {
        console.error('Unexpected JSON from ' + filename + ', expected an object');
        continue;
      }
      const hasZoneRegex = 'zoneRegex' in json;
      const hasZoneId = 'zoneId' in json;
      if (!hasZoneRegex && !hasZoneId || hasZoneRegex && hasZoneId) {
        console.error('Unexpected JSON from ' + filename + ', need one of zoneRegex/zoneID');
        continue;
      }

      json.filename = filename;
      if ('triggers' in json) {
        if (typeof json.triggers !== 'object' || !(json.triggers.length >= 0)) {
          console.error('Unexpected JSON from ' + filename + ', expected triggers to be an array');
          continue;
        }
      }
      this.triggerSets.push(json);
    }
    this.ReloadTriggers();
  }
}

UserConfig.getUserConfigLocation('oopsyraidsy', Options, () => {
  let listView;
  let mistakeCollector;

  const summaryElement = document.getElementById('summary');
  const liveListElement = document.getElementById('livelist');

  // Choose the ui based on whether this is the summary view or the live list.
  // They have different elements in the file.
  if (summaryElement) {
    listView = new OopsySummaryList(Options, summaryElement);
    mistakeCollector = new MistakeCollector(Options, listView);
  } else {
    listView = new OopsyLiveList(Options, liveListElement);
    mistakeCollector = new MistakeCollector(Options, listView);
  }

  const damageTracker = new DamageTracker(Options, mistakeCollector, oopsyFileData);

  addOverlayListener('onLogEvent', (e) => damageTracker.OnLogEvent(e));
  addOverlayListener('LogLine', (e) => damageTracker.OnNetLog(e));
  addOverlayListener('onPartyWipe', (e) => damageTracker.OnPartyWipeEvent(e));
  addOverlayListener('onPlayerChangedEvent', (e) => damageTracker.OnPlayerChange(e));
  addOverlayListener('ChangeZone', (e) => {
    damageTracker.OnChangeZone(e);
    mistakeCollector.OnChangeZone(e);
    listView.OnChangeZone(e);
  });
  addOverlayListener('onInCombatChangedEvent', (e) => {
    damageTracker.OnInCombatChangedEvent(e);
    mistakeCollector.OnInCombatChangedEvent(e);
  });

  callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' });
});
