'use strict';

let Options = {
  Debug: false,
  Language: 'en',
  NumLiveListItemsInCombat: 5,
  MinimumTimeForPullMistake: 0.4,
  Triggers: [],
  PlayerNicks: {},
  DisabledTriggers: {},
  IgnoreZones: [
    'PvpSeize',
    'PvpSecure',
    'PvpShatter',
    'EurekaAnemos',
    'EurekaPagos',
    'EurekaPyros',
    'EurekaHydatos',
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
  },
};

let kEarlyPullText = {
  en: 'early pull',
  de: 'zu früh angegriffen',
  // FIXME
  fr: 'early pull',
  ja: 'early pull',
};

let kLatePullText = {
  en: 'late pull',
  de: 'zu spät angegriffen',
  // FIXME
  fr: 'late pull',
  ja: 'late pull',
};

// Internal trigger id for early pull
let kEarlyPullId = 'General Early Pull';

// Character offsets into log lines for the chars of the type.
let kTypeOffset0 = 15;
let kTypeOffset1 = 16;

/*
Log Message Types (hex)
00 = game log
01 = zone change
03 = added combatant
04 = removed combatant
14 = starts casting
15 = single target (damage, skill)
16 = aoe (damage, skills, etc)
17 = cancelled/interrupted
18 = hot/dot tick
19 = was defeated by
1A = gains effect
1B = head marker
1E = loses effect
1F = meditate stacks?!
*/

// Fields for type=15/16 (decimal)
let kFieldType = 0;
let kFieldAttackerId = 1;
let kFieldAttackerName = 2;
let kFieldAbilityId = 3;
let kFieldAbilityName = 4;
let kFieldTargetId = 5;
let kFieldTargetName = 6;
let kFieldFlags = 7;
let kFieldDamage = 8;
// ??
let kFieldTargetCurrentHp = 23;
let kFieldTargetMaxHp = 24;
let kFieldTargetCurrentMp = 25;
let kFieldTargetMaxMp = 26;
let kFieldTargetCurrentTp = 27;
let kFieldTargetMaxTp = 28;
let kFieldTargetX = 29;
let kFieldTargetY = 30;
let kFieldTargetZ = 31;
// ??
let kFieldAttackerX = 38;
let kFieldAttackerY = 39;
let kFieldAttackerZ = 40;

// If kFieldFlags is any of these values, then consider field 9/10 as 7/8.
// It appears a little bit that flags come in pairs of values, but it's unclear
// what these mean.
let kShiftFlagValues = ['3E', '113', '213', '313'];
let kFlagInstantDeath = 'XX'; // FIXME
// miss, damage, block, parry, instant death
let kAttackFlags = ['01', '03', '05', '06', kFlagInstantDeath];

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

  misc low bytes:
    0x08 = mudra(bogus), esuna(no effects?), bane(missed)
    0x09 = bane(target)
    0x0B = aetherflow
    0x0D = purification, invigorate (with tp value in left three chars of next field)
    0x0F = bio, chain strat, emergency tactics, protect, swiftcast, bane(recipient), sprint, fists of fire, mudra
    0x10 = shadow flare, sacred soil
    0x26 = mount (always 126?)
    0x3A = skill with no buffs/damage (e.g. teleport, bahamut's favor, ninja bunny)
    0x3B = huton
    0x33 = summon

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

let gLiveList;
let gMistakeCollector;
let gDamageTracker;

function ShortNamify(name) {
  // TODO: make this unique among the party in case of first name collisions.
  // TODO: probably this should be a general cactbot utility.

  if (name in Options.PlayerNicks)
    return Options.PlayerNicks[name];

  let idx = name.indexOf(' ');
  return idx < 0 ? name : name.substr(0, idx);
}

function DamageFromFields(fields) {
  let field = fields[kFieldDamage];
  let len = field.length;
  if (len <= 4)
    return 0;
  // Get the left two bytes as damage.
  let damage = parseInt(field.substr(0, len - 4), 16);
  // Check for third byte == 0x40.
  if (field[len - 4] == '4') {
    // Wrap in the 4th byte as extra damage.  See notes above.
    let rightDamage = parseInt(field.substr(len - 2, 2), 16);
    damage = damage - rightDamage + (rightDamage << 16);
  }
  return damage;
}

function IsCritDamage(flags) {
  return parseInt(flags, 16) & 0x100;
}

function IsCritHeal(flags) {
  return flags == '10004';
}

function IsDirectHitDamage(flags) {
  return parseInt(flags, 16) & 0x200;
}

function IsPlayerId(id) {
  return id[0] < 4;
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
    let maxItems = this.options.NumLiveListItemsInCombat;
    if (maxItems == 0)
      return;

    let rowDiv;
    if (this.numItems < this.items.length)
      rowDiv = this.items[this.numItems];
    else
      rowDiv = this.MakeRow();

    this.numItems++;

    let iconDiv = document.createElement('div');
    iconDiv.classList.add('mistake-icon');
    iconDiv.classList.add(iconClass);
    rowDiv.appendChild(iconDiv);
    let textDiv = document.createElement('div');
    textDiv.classList.add('mistake-text');
    textDiv.innerHTML = text;
    rowDiv.appendChild(textDiv);
    let timeDiv = document.createElement('div');
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
    let div = document.createElement('div');
    div.classList.add('mistake-row');
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
    let maxItems = this.options.NumLiveListItemsInCombat;
    for (let i = 0; i < this.items.length - maxItems; ++i)
      this.items[i].classList.add('hide');
  }

  Reset() {
    this.container.classList.add('hide');
    this.items = [];
    this.numItems = 0;
    this.container.innerHTML = '';
  }
}

// Collector:
// * processes mistakes, adds lines to the live list
// * handles timing issues with starting/stopping/early pulls
class MistakeCollector {
  constructor(options, liveList) {
    this.options = options;
    this.lang = this.options.Language || 'en';
    this.liveList = liveList;
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
    this.liveList.Reset();
  }

  GetFormattedTime(time) {
    if (!this.baseTime)
      return '';
    if (!time)
      time = Date.now();
    let totalSeconds = Math.floor((time - this.baseTime) / 1000);
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60);
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
    // occurs), StartCombat has to be responsible for clearing the liveList
    // list.
    let now = Date.now();
    let kMinimumSecondsAfterWipe = 5;
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
    if (this.lang in obj)
      return obj[this.lang];
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
    let blameText = blame ? ShortNamify(blame) + ': ' : '';
    this.liveList.AddLine(type, blameText + text, this.GetFormattedTime(time));
  }

  OnFullMistakeText(type, blame, text, time) {
    if (!text)
      return;
    this.liveList.AddLine(type, text, this.GetFormattedTime(time));
  }

  AddEngage() {
    this.engageTime = Date.now();
    if (!this.firstPuller) {
      this.StartCombat();
      return;
    }
    let seconds = ((Date.now() - this.startTime) / 1000);
    if (this.firstPuller && seconds >= this.options.MinimumTimeForPullMistake) {
      let text = kEarlyPullText[this.lang] + ' (' + seconds.toFixed(1) + 's)';
      if (!this.options.DisabledTriggers[kEarlyPullId])
        this.OnMistakeText('pull', this.firstPuller, text);
    }
  }

  AddDamage(fields, line) {
    if (!this.firstPuller) {
      if (this.options.Debug)
        console.log('Pull: ' + line);
      if (IsPlayerId(fields[kFieldAttackerId]))
        this.firstPuller = fields[kFieldAttackerName];
      else if (IsPlayerId(fields[kFieldTargetId]))
        this.firstPuller = fields[kFieldTargetName];
      else
        this.firstPuller = '???';

      this.StartCombat();
      let seconds = ((Date.now() - this.engageTime) / 1000);
      if (this.engageTime && seconds >= this.options.MinimumTimeForPullMistake) {
        let text = kLatePullText[this.lang] + ' (' + seconds.toFixed(1) + 's)';
        if (!this.options.DisabledTriggers[kEarlyPullId])
          this.OnMistakeText('pull', this.firstPuller, text);
      }
    }
  }

  AddDeath(name, fields) {
    let text;
    if (fields) {
      // Note: ACT just evaluates independently what the hp of everybody
      // is and so may be out of date modulo one hp regen tick with
      // respect to the "current" hp value, e.g. charybdis may appear to do
      // more damage than you have hp, "killing" you.  This is good enough.

      // TODO: record the last N seconds of damage, as often folks are
      // killed by 2+ things (e.g. 3x flares, or 2x Blizzard III).

      // hp string = (damage/hp at time of death)
      let hp = '';
      if (fields[kFieldFlags] == kFlagInstantDeath) {
        // TODO: show something for infinite damage?
      } else if (kFieldTargetCurrentHp in fields) {
        hp = ' (' + DamageFromFields(fields) + '/' + fields[kFieldTargetCurrentHp] + ')';
      }
      text = fields[kFieldAbilityName] + hp;
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
    this.OnFullMistakeText('wipe', null, 'Party Wipe');
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
    let inGameCombat = e.detail.inGameCombat;
    if (this.inGameCombat != inGameCombat) {
      this.inGameCombat = inGameCombat;
      if (inGameCombat)
        this.StartCombat();
      else
        this.StopCombat();

      this.liveList.SetInCombat(this.inGameCombat);
    }

    let inACTCombat = e.detail.inACTCombat;
    if (this.inACTCombat != inACTCombat) {
      this.inACTCombat = inACTCombat;
      if (inACTCombat) {
        // TODO: This message should probably include the timestamp
        // for when combat started.  Starting here is not the right
        // time if this plugin is loaded while ACT is already in combat.
        this.baseTime = Date.now();
        this.liveList.Reset();
      }
    }
  }

  OnZoneChangeEvent(e) {
    this.Reset();
  }
}

class DamageTracker {
  constructor(options, collector) {
    this.options = options;
    this.collector = collector;
    this.triggerSets = null;
    this.inCombat = false;
    this.ignoreZone = false;
    this.timers = [];
    this.generalTriggers = [];
    this.damageTriggers = [];
    this.abilityTriggers = [];
    this.effectTriggers = [];
    this.healTriggers = [];
    this.Reset();
  }

  // TODO: this shouldn't clear timers and triggers
  // TODO: seems like some reloads are causing the /poke test to get undefined
  Reset() {
    this.data = {
      me: this.me,
      job: this.job,
      role: this.role,
      inCombat: this.inCombat,
      ShortName: ShortNamify,
      IsPlayerId: IsPlayerId,

      // Deprecated.
      ParseLocaleFloat: parseFloat,
    };
    this.lastDamage = {};
    this.activeTriggers = {};

    for (let i = 0; i < this.timers.length; ++i)
      window.clearTimeout(this.timers[i]);
    this.timers = [];
  }

  OnLogEvent(e) {
    if (this.ignoreZone)
      return;
    for (let i = 0; i < e.detail.logs.length; ++i) {
      let line = e.detail.logs[i];
      for (let j = 0; j < this.generalTriggers.length; ++j) {
        let trigger = this.generalTriggers[j];
        let matches = line.match(trigger.regex);
        if (matches != null)
          this.OnTrigger(trigger, { line: line }, matches);
      }

      if (line[kTypeOffset0] == '0' && line[kTypeOffset1] == '0') {
        if (line.match(gLang.countdownEngageRegex())) {
          this.collector.AddEngage();
          continue;
        }
        if (line.match(gLang.countdownStartRegex()) || line.match(gLang.countdownCancelRegex())) {
          this.collector.Reset();
          continue;
        }
      }
      // 15 chars in is the type: 15 (single target) / 16 (aoe)
      // See table at the top of this file.
      if (line[kTypeOffset0] != '1')
        continue;
      if (line[kTypeOffset1] == 'A' || line[kTypeOffset1] == 'E')
        this.OnEffectEvent(line);
      if (line[kTypeOffset1] == '5' || line[kTypeOffset1] == '6')
        this.OnAbilityEvent(line.substr(kTypeOffset0).split(':'), line);
      if (line[kTypeOffset1] == '9')
        this.OnDefeated(line);
    }
  }

  OnDefeated(line) {
    // two chars for type + colon
    let offset = kTypeOffset0 + 3;
    let defeatedIdx = line.indexOf(' was defeated');
    if (defeatedIdx == -1) {
      console.error(['OnDefeatedParseError', line]);
      return;
    }
    let name = line.substr(offset, defeatedIdx - offset);
    let fields = this.lastDamage[name];
    delete this.lastDamage[name];
    // Monsters get defeated as well, but they will never
    // have lastDamage marked for them.  It's possible that
    // in a very short fight, a player will never take
    // damage and will not get killed by an ability and
    // so won't get a death notice.
    // TODO: track all players in the instance and support
    // death notices even if there's no ability damage.
    if (fields)
      this.collector.AddDeath(name, fields);
  }

  OnAbilityEvent(fields, line) {
    // Shift damage and flags forward for mysterious spurious :3E:0:.
    // Plenary Indulgence also appears to prepend confession stacks.
    // UNKNOWN: Can these two happen at the same time?
    if (kShiftFlagValues.indexOf(fields[kFieldFlags]) >= 0) {
      fields[kFieldFlags] = fields[kFieldFlags + 2];
      fields[kFieldFlags + 1] = fields[kFieldFlags + 3];
    }

    // Clobber ability names here.
    let abilityId = fields[kFieldAbilityId];
    if (abilityId in this.options.AbilityIdNameMap)
      fields[kFieldAbilityName] = this.options.AbilityIdNameMap[abilityId];


    // Lazy initialize event.
    let evt;
    for (let i = 0; i < this.abilityTriggers.length; ++i) {
      let trigger = this.abilityTriggers[i];
      let matches = abilityId.match(trigger.idRegex);
      if (matches == null)
        continue;
      if (!evt)
        evt = this.EventFromFields(fields, line);
      this.OnTrigger(trigger, evt, matches);
    }

    // Length 1 or 2.
    let lowByte = fields[kFieldFlags].substr(-2);

    // Healing?
    if (lowByte == '04' || lowByte == '4') {
      for (let i = 0; i < this.healTriggers.length; ++i) {
        let trigger = this.healTriggers[i];
        let matches = abilityId.match(trigger.idRegex);
        if (matches == null)
          continue;
        if (!evt)
          evt = this.EventFromFields(fields, line);
        this.OnTrigger(trigger, evt, matches);
      }
      return;
    }

    if (kAttackFlags.indexOf(lowByte) == -1)
      return;

    // TODO track first puller here, collector doesn't need every damage line
    if (!this.collector.firstPuller)
      this.collector.AddDamage(fields, line);

    if (IsPlayerId(fields[kFieldTargetId][0]))
      this.lastDamage[fields[kFieldTargetName]] = fields;

    for (let i = 0; i < this.damageTriggers.length; ++i) {
      let trigger = this.damageTriggers[i];
      let matches = abilityId.match(trigger.idRegex);
      if (matches == null)
        continue;
      if (!evt)
        evt = this.EventFromFields(fields, line);
      this.OnTrigger(trigger, evt, matches);
    }
  }

  OnEffectEvent(line) {
    let evt;
    for (let i = 0; i < this.effectTriggers.length; ++i) {
      let trigger = this.effectTriggers[i];
      let matches;
      if (trigger.gainRegex)
        matches = line.match(trigger.gainRegex);
      if (!matches && trigger.loseRegex)
        matches = line.match(trigger.loseRegex);
      if (matches == null)
        continue;
      if (!evt) {
        evt = {
          targetName: matches[1],
          effectName: matches[2],
          attackerName: matches[3],
          gains: !!matches[4],
          durationSeconds: matches[4] ? parseFloat(matches[4]) : undefined,
        };
      }
      this.OnTrigger(trigger, evt, null);
    }
  }

  EventFromFields(fields, line) {
    let evt = {
      line: line,
      type: fields[kFieldType],
      attackerId: fields[kFieldAttackerId],
      attackerName: fields[kFieldAttackerName],
      abilityId: fields[kFieldAbilityId],
      abilityName: fields[kFieldAbilityName],
      targetId: fields[kFieldTargetId],
      targetName: fields[kFieldTargetName],
      flags: fields[kFieldFlags],
      targetCurrentHp: fields[kFieldTargetCurrentHp],
      targetMaxHp: fields[kFieldTargetMaxHp],
      targetCurrentMp: fields[kFieldTargetCurrentMp],
      targetMaxMp: fields[kFieldTargetMaxMp],
      targetCurrentTp: fields[kFieldTargetCurrentTp],
      targetMaxTp: fields[kFieldTargetMaxTp],
      targetX: fields[kFieldTargetX],
      targetY: fields[kFieldTargetY],
      targetZ: fields[kFieldTargetZ],
      attackerX: fields[kFieldAttackerX],
      attackerY: fields[kFieldAttackerY],
      attackerZ: fields[kFieldAttackerZ],
    };
    evt.damage = DamageFromFields(fields);
    let isCrit = IsCritDamage(evt.flags);
    let exclamation = isCrit ? '!' : '';
    // DH on its own doesn't get an exclamation.
    exclamation += isCrit && IsDirectHitDamage(evt.flags) ? '!' : '';
    exclamation += IsCritHeal(evt.flags) ? '!' : '';
    evt.damageStr = evt.damage + exclamation;
    return evt;
  }

  AddImpliedDeathReason(obj) {
    if (!obj)
      return;
    let fields = {};
    fields[kFieldTargetName] = obj.name;
    fields[kFieldAbilityName] = obj.reason;
    fields[kFieldFlags] = kFlagInstantDeath;
    fields[kFieldDamage] = 0;
    this.lastDamage[obj.name] = fields;
  }

  OnTrigger(trigger, evt, matches) {
    if (trigger.id && this.options.DisabledTriggers[trigger.id])
      return;

    if ('condition' in trigger) {
      if (!trigger.condition(evt, this.data, matches))
        return;
    }

    let ValueOrFunction = (f, events) => {
      return (typeof(f) == 'function') ? f(events, this.data, matches) : f;
    };

    let collectSeconds = 'collectSeconds' in trigger ? ValueOrFunction(trigger.collectSeconds) : 0;
    let collectMultipleEvents = 'collectSeconds' in trigger;
    if (collectMultipleEvents && trigger in this.activeTriggers) {
      this.activeTriggers[trigger].push(evt);
      return;
    }
    let delay;
    if (collectMultipleEvents)
      delay = collectSeconds || 0;
    else
      delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds, evt) : 0;


    let triggerTime = Date.now();
    let f = (function() {
      let eventOrEvents = collectMultipleEvents ? this.activeTriggers[trigger] : evt;
      delete this.activeTriggers[trigger];
      if ('mistake' in trigger) {
        let m = ValueOrFunction(trigger.mistake, eventOrEvents);
        if (Array.isArray(m)) {
          for (let i = 0; i < m.length; ++i)
            this.collector.OnMistakeObj(m[i]);
        } else {
          this.collector.OnMistakeObj(m);
        }
      }
      if ('deathReason' in trigger) {
        let ret = ValueOrFunction(trigger.deathReason, eventOrEvents);
        ret.reason = this.Translate(ret.reason);
        this.AddImpliedDeathReason(ret);
      }
      if ('run' in trigger)
        ValueOrFunction(trigger.run, eventOrEvents);
    }).bind(this);

    // Even if delay = 0, if collectMultipleEvents is specified,
    // then set this here so that events can be passed as an array for consistency.
    if (collectMultipleEvents)
      this.activeTriggers[trigger] = [evt];

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

  OnZoneChangeEvent(e) {
    this.zoneName = e.detail.zoneName;
    this.ReloadTriggers();
  }

  OnInCombatChangedEvent(e) {
    this.inCombat = e.detail.inGameCombat;
    this.data.inCombat = this.inCombat;
  }

  AddSimpleTriggers(type, dict) {
    if (!dict)
      return;
    let keys = Object.keys(dict);
    for (let j = 0; j < keys.length; ++j) {
      let key = keys[j];
      let id = dict[key];
      let trigger = {
        id: key,
        damageRegex: id,
        idRegex: Regexes.Parse('^' + id + '$'),
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

    this.ignoreZone = false;
    for (let i = 0; i < Options.IgnoreZones.length; ++i) {
      if (this.zoneName.match(gLang.kZone[Options.IgnoreZones[i]])) {
        this.ignoreZone = true;
        return;
      }
    }

    for (let i = 0; i < this.triggerSets.length; ++i) {
      let set = this.triggerSets[i];
      if (this.zoneName.search(set.zoneRegex) < 0)
        continue;
      this.AddSimpleTriggers('warn', set.damageWarn);
      this.AddSimpleTriggers('fail', set.damageFail);

      if (!set.triggers)
        set.triggers = [];
      for (let j = 0; j < set.triggers.length; ++j) {
        let trigger = set.triggers[j];
        if ('regex' in trigger) {
          trigger.regex = Regexes.Parse(trigger.regex);
          this.generalTriggers.push(trigger);
        }
        if ('damageRegex' in trigger) {
          trigger.idRegex = Regexes.Parse('^' + trigger.damageRegex + '$');
          this.damageTriggers.push(trigger);
        }
        if ('abilityRegex' in trigger) {
          trigger.idRegex = Regexes.Parse('^' + trigger.abilityRegex + '$');
          this.abilityTriggers.push(trigger);
        }
        if ('gainsEffectRegex' in trigger) {
          trigger.gainRegex = gLang.gainsEffectRegex('(' + trigger.gainsEffectRegex + ')', '(\\y{Name})', '(.*?)');
          this.effectTriggers.push(trigger);
        }
        if ('losesEffectRegex' in trigger) {
          trigger.loseRegex = gLang.losesEffectRegex('(' + trigger.losesEffectRegex + ')', '(\\y{Name})', '(.*?)');
          this.effectTriggers.push(trigger);
        }
        if ('healRegex' in trigger) {
          trigger.idRegex = Regexes.Parse('^' + trigger.healRegex + '$');
          this.healTriggers.push(trigger);
        }
      }
    }
  }

  OnPlayerChange(e) {
    if (this.job == e.detail.job && this.me == e.detail.name)
      return;

    this.me = e.detail.name;
    this.job = e.detail.job;
    this.role = Util.jobToRole(this.job);
    this.ReloadTriggers();
  }

  OnDataFilesRead(e) {
    this.dataFiles = e.detail.files;
    this.ReloadTriggers();
  }

  ProcessDataFiles() {
    if (this.triggerSets)
      return;
    if (!gLang)
      return;
    if (!this.me)
      return;

    this.triggerSets = Options.Triggers;
    for (let filename in this.dataFiles) {
      let text = this.dataFiles[filename];
      let json;
      try {
        json = eval(text);
      } catch (exception) {
        console.error('Error parsing JSON from ' + filename + ': ' + exception);
        continue;
      }
      if (typeof json != 'object' || !(json.length >= 0)) {
        console.error('Unexpected JSON from ' + filename + ', expected an array');
        continue;
      }
      for (let i = 0; i < json.length; ++i) {
        if (!('zoneRegex' in json[i])) {
          console.error('Unexpected JSON from ' + filename + ', expected a zoneRegex');
          continue;
        }
        if ('triggers' in json[i]) {
          if (typeof json[i].triggers != 'object' || !(json[i].triggers.length >= 0)) {
            console.error('Unexpected JSON from ' + filename + ', expected triggers to be an array');
            continue;
          }
        }
      }
      Array.prototype.push.apply(this.triggerSets, json);
    }
    this.ReloadTriggers();
  }
}

UserConfig.getUserConfigLocation('oopsyraidsy', function(e) {
  gLiveList = new OopsyLiveList(Options, document.getElementById('livelist'));
  gMistakeCollector = new MistakeCollector(Options, gLiveList);
  gDamageTracker = new DamageTracker(Options, gMistakeCollector);

  addOverlayListener('onLogEvent', function(e) {
    gDamageTracker.OnLogEvent(e);
  });
  addOverlayListener('onPartyWipe', function(e) {
    gDamageTracker.OnPartyWipeEvent(e);
  });
  addOverlayListener('onZoneChangedEvent', function(e) {
    gDamageTracker.OnZoneChangeEvent(e);
    gMistakeCollector.OnZoneChangeEvent(e);
  });
  addOverlayListener('onInCombatChangedEvent', function(e) {
    gDamageTracker.OnInCombatChangedEvent(e);
    gMistakeCollector.OnInCombatChangedEvent(e);
  });

  if (window.callOverlayHandler) {
    callOverlayHandler({
      call: 'cactbotReadDataFiles',
      source: location.href,
    }).then((r) => gDamageTracker.OnDataFilesRead(r));
  } else {
    addOverlayListener('onDataFilesRead', function(e) {
      gDamageTracker.OnDataFilesRead(e);
    });
  }

  addOverlayListener('onPlayerChangedEvent', function(e) {
    gDamageTracker.OnPlayerChange(e);
  });

  callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' });
});
