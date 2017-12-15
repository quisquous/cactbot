"use strict";

var Options = {
  NumLiveListItems: 5,
};

// Character offsets into log lines for the chars of the type.
var kTypeOffset0 = 15;
var kTypeOffset1 = 16;

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
var kFieldType = 0;
var kFieldAttackerId = 1;
var kFieldAttackerName = 2;
var kFieldAbilityId = 3;
var kFieldAbilityName = 4;
var kFieldTargetId = 5;
var kFieldTargetName = 6;
var kFieldFlags = 7;
var kFieldDamage = 8;
// ??
var kFieldTargetCurrentHp = 23;
var kFieldTargetMaxHp = 24;
var kFieldTargetCurrentMp = 25;
var kFieldTargetMaxMp = 26;
var kFieldTargetCurrentTp = 27;
var kFieldTargetMaxTp = 28;
var kFieldTargetX = 29;
var kFieldTargetY = 30;
var kFieldTargetZ = 31;
// ??
var kFieldAttackerX = 38;
var kFieldAttackerY = 39;
var kFieldAttackerY = 40;

// if kFieldFlags is any of these values, then consider field 9/10 as 7/8.
var kShiftFlagValues = ['3C', '113', '213', '313'];

/*
Field 7 Flags:
  '0' = no damage at all (missed aoe, repelling shot)

  0x03 = damage
  0x05 = blocked damage
  0x06 = parried damage
  0x32 = instant death

  0x39 = skill with no buffs/damage (e.g. teleport, bahamut's favor, ninja bunny)

  0x100 = crit damage
  0x200 = direct hit damage
  0x300 = crit direct hit damage

  0x00004 = heal
  0x10004 = crit heal

  Special cases:
    * If flags are 3C, shift 9+10 two over to be 7+8.  (why???)
    * Plenary indulgence has flags=113/213/313 for stacks, shift two as well.

Examples:
(1) 18216 damage from Grand Cross Alpha (basic)
  16:40001333:Neo Exdeath:242B:Grand Cross Alpha:1048638C:Tater Tot:750003:4728:1C:80242B:0:0:0:0:0:0:0:0:0:0:0:0:36906:41241:5160:5160:880:1000:0.009226365:-7.81128:-1.192093E-07:16043015:17702272:12000:12000:1000:1000:-0.01531982:-19.02808:0:

(2) 191150 damage from Megaflare (0x400000 flag for x10 damage)
  16:40009492:Nael deus Darnus:26BA:Megaflare:106C1DBA:Okonomi Yaki:750003:404AAB:1C:8026BA:0:0:0:0:0:0:0:0:0:0:0:0:44495:44495:5880:5880:720:1000:5.599976:3.768982:0:108843:5013955:12000:12000:1000:1000:3.555298:1.754761:0:

(3) 22109 damage from Grand Cross Omega (:3C:0: shift, unknown 0x40000 flag)
  16:40001333:Neo Exdeath:242D:Grand Cross Omega:1048638C:Tater Tot:3C:0:750003:4565D:1C:80242D:0:0:0:0:0:0:0:0:0:0:41241:41241:5160:5160:670:1000:-0.3251641:6.526299:1.192093E-07:7560944:17702272:12000:12000:1000:1000:0:19:2.384186E-07:

(4) 15732 crit heal from 3 confession stack Plenary Indulgence (:?13:4C3: shift)
  16:10647D2F:Tako Yaki:1D09:Plenary Indulgence:106DD019:Okonomi Yaki:313:4C3:10004:3D74:0:0:0:0:0:0:0:0:0:0:0:0:7124:40265:14400:9192:1000:1000:-10.78815:11.94781:0:11343:40029:19652:16451:1000:1000:6.336648:7.710004:0:

(5) instant death twister
  16:40004D5D:Twintania:26AB:Twister:10573FDC:Tini Poutini:32:0:1C:8026AB:0:0:0:0:0:0:0:0:0:0:0:0:43985:43985:5760:5760:910:1000:-8.42179:9.49251:-1.192093E-07:57250:57250:0:0:1000:1000:-8.565645:10.20959:0:

(6) zero damage targetless aoe (E0000000 target)
  16:103AAEE4:Potato Chippy:B1:Miasma II:E0000000::0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0::::::::::19400:40287:17649:17633:1000:1000:-0.656189:-3.799561:-5.960464E-08:
*/

var gDamageTracker;
var gMistakeCollector;
var gLiveList;

function ShortNamify(name) {
  // TODO: make this unique among the party in case of first name collisions.
  // TODO: add options for short nicknames.
  // TODO: probably this should be a general cactbot utility.

  // For now, just first name.
  return name.substr(0, name.indexOf(' '));
}

function DamageFromFields(fields) {
  // Damage field's right two bytes are damage, other bytes are flags.
  // 0x400000 flag = damage value is multiplied by 10 (i.e. big damage ends in zero!)
  // UNKNOWN: 0x[48]0000 is seen sometimes (see example above even) but unclear why.
  var damageWithFlags = parseInt(fields[kFieldDamage], 16);
  return (damageWithFlags & 0xFFFF) * (damageWithFlags & 0x400000 ? 10 : 1);
}

function IsPlayerId(id) {
  return id[0] < 4;
}

class OopsyLiveList {
  constructor(options) {
    this.options = options;
    this.container = document.getElementById('livelist');
    this.Reset();
  }

  AddLine(iconClass, text, time) {
    var maxItems = this.options.NumLiveListItems;
    if (maxItems == 0)
      return;

    this.container.classList.remove('hide');

    var rowDiv;
    if (this.numItems < this.items.length) {
      rowDiv = this.items[this.numItems];
    } else {
      rowDiv = this.MakeRow();
    }
    this.numItems++;

    var iconDiv = document.createElement('div');
    iconDiv.classList.add('mistake-icon');
    iconDiv.classList.add(iconClass);
    rowDiv.appendChild(iconDiv);
    var textDiv = document.createElement('div');
    textDiv.classList.add('mistake-text');
    textDiv.innerHTML = text;
    rowDiv.appendChild(textDiv);
    var timeDiv = document.createElement('div');
    timeDiv.classList.add('mistake-time');
    timeDiv.innerHTML = time;
    rowDiv.appendChild(timeDiv);

    // Hide anything over the limit from the past.
    if (this.numItems > maxItems)
      this.items[this.numItems - maxItems - 1].classList.add('hide');
  }

  MakeRow() {
    var div = document.createElement('div');
    div.classList.add('mistake-row');
    this.items.push(div);
    this.container.appendChild(div);
    return div;
  }

  Reset() {
    this.container.classList.add('hide');
    this.items = [];
    this.numItems = 0;
    this.container.innerHTML = '';
    for (var i = 0; i < this.options.NumLiveListItems; ++i) {
      this.MakeRow();
    }
  }
}

class MistakeCollector {
  constructor(options, liveList) {
    this.options = options;
    this.liveList = liveList;
    this.Reset();
  }

  Reset() {
    this.inCombat = false;
    this.startTime = null;
    this.deaths = [];
    this.firstPuller = null;
    this.seenEngage = false;

  }

  GetFormattedTime() {
    if (!this.startTime)
      return '';
    var totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    var seconds = totalSeconds % 60;
    var minutes = Math.floor(totalSeconds / 60);
    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  StartCombat() {
    if (this.inCombat)
      return;
    this.inCombat = true;
    this.liveList.Reset();
    this.startTime = Date.now();
    this.wipeTime = null;
  }

  AddEngage() {
    this.seenEngage = true;
    if (!this.inCombat) {
      this.StartCombat();
      return;
    }
    var seconds = (Date.now() - this.startTime) / 1000;
    if (this.firstPuller) {
      var text = 'Pull: ' + this.firstPuller + ' (' + seconds.toFixed(1) + ' early)';
      this.liveList.AddLine('pull', text, this.GetFormattedTime());
    }
  }

  AddDamage(fields, line) {
    if (!this.firstPuller) {
      if (IsPlayerId(fields[kFieldAttackerId])) {
        this.firstPuller = fields[kFieldAttackerName];
      } else if (IsPlayerId(fields[kFieldTargetId])) {
        this.firstPuller = fields[kFieldTargetName];
      }
      if (this.seenEngage) {
        var seconds = (Date.now() - this.startTime) / 1000;
        var text = 'Pull: ' + this.firstPuller + ' (' + seconds.toFixed(1) + ' late)';
        this.liveList.AddLine('pull', text, this.GetFormattedTime());
      }
    }
  }

  AddDeath(name, fields) {
     var text = ShortNamify(name);
     if (fields) {
      // (damage/hp at time of death)
      // Note: ACT just evaluates independently what the hp of everybody is and so may be out of
      // date modulo one hp regen tick with respect to the "current" hp value, e.g. charybdis
      // may appear to do more damage than you have hp, "killing" you.  This is good enough.
      var hp = '(' + DamageFromFields(fields) + '/' + fields[kFieldTargetCurrentHp] + ')';
      text += ': ' + fields[kFieldAbilityName] + ' ' + hp;
    }
    this.liveList.AddLine('death', text, this.GetFormattedTime());

    // TODO: some things don't have abilities, e.g. jumping off titan ex.  This will just show
    // the last thing that hit you before you were defated.
  }

  OnPartyWipeEvent(e) {
    // Wipe events usually come after combat ends, however 'cactbot wipe'
    // test messages throw the wipe first and then end.
    // TODO: maybe reorder the test command to behave the same?
    if (this.wipeTime || this.inCombat)
      this.liveList.AddLine('wipe', 'Party Wipe', this.wipeTime ? this.wipeTime : this.GetFormattedTime());
    this.Reset();
  }

  OnInCombatChangedEvent(e) {
    if (!e.detail.inCombat) {
      this.wipeTime = this.GetFormattedTime();
      this.Reset();
    } else {
      this.StartCombat();
    }
  }

  OnZoneChangeEvent(e) {
    this.Reset();
    this.liveList.Reset();
  }
}

class DamageTracker {
  constructor(options, collector) {
    this.options = options;
    this.lastDamage = {};
    this.collector = collector;
  }

  OnLogEvent(e) {
    for (var i = 0; i < e.detail.logs.length; ++i) {
      var line = e.detail.logs[i];
      if (line[kTypeOffset0] == '0' && line.indexOf('00:0039:Engage!') > 0) {
        this.collector.AddEngage();
        continue;
      }
      // 15 chars in is the type: 15 (single target) / 16 (aoe)
      if (line[kTypeOffset0] != '1')
        continue;
      if (line[kTypeOffset1] == '5' || line[kTypeOffset1] == '6')
        this.OnAbilityEvent(line.substr(kTypeOffset0).split(':'), line);
      if (line[kTypeOffset1] == '9')
        this.OnDefeated(line);
    }
  }

  OnDefeated(line) {
    // two chars for type + colon
    var offset = kTypeOffset0 + 3;
    var defeatedIdx = line.indexOf(' was defeated');
    if (defeatedIdx == -1) {
      console.error(['OnDefeatedParseError', line]);
      return;
    }
    var name = line.substr(offset, defeatedIdx - offset);
    var fields = this.lastDamage[name];
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
    // Shift damage and flags forward for mysterious spurious :3C:0:.
    // Plenary Indulgence also appears to prepend confession stacks.
    // UNKNOWN: Can these two happen at the same time?
    if (fields[kFieldFlags] in kShiftFlagValues) {
      fields[kFieldFlags] = fields[kFieldFlags + 2];
      fields[kFieldFlags + 1] = fields[kFieldFlags + 3];
    }

    var lowByte = fields[kFieldFlags].substr(-2);
    // miss, damage, block, parry, instant death
    if (lowByte != '0' && lowByte != '03' && lowByte != '05' && lowByte != '06' && lowByte != '32')
      return;

    this.collector.AddDamage(fields, line);

    // Mobs (and pets) have ids starting at '40000000'.  Players start at '10000000'.
    // Only care about damage to players here.
    // TODO: names aren't unique, should use ids instead.
    if (IsPlayerId(fields[kFieldTargetId][0]))
      this.lastDamage[fields[kFieldTargetName]] = fields;
  }

  OnPartyWipeEvent(e) {
    this.lastDamage = {};
  }

  OnZoneChangeEvent(e) {
    this.lastDamage = {};
  }
}

window.setTimeout(function() {
  if (gDamageTracker)
    return;

  gLiveList = new OopsyLiveList(Options);
  gMistakeCollector = new MistakeCollector(Options, gLiveList);
  gDamageTracker = new DamageTracker(Options, gMistakeCollector);
}, 0);

document.addEventListener("onLogEvent", function(e) {
  gDamageTracker.OnLogEvent(e);
});
document.addEventListener("onPartyWipe", function(e) {
  gDamageTracker.OnPartyWipeEvent(e);
  gMistakeCollector.OnPartyWipeEvent(e);
});
document.addEventListener("onZoneChangedEvent", function(e) {
  gDamageTracker.OnZoneChangeEvent(e);
  gMistakeCollector.OnZoneChangeEvent(e);
});
document.addEventListener("onInCombatChangedEvent", function (e) {
  gMistakeCollector.OnInCombatChangedEvent(e);
});
