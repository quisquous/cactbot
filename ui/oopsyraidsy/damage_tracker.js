import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';
import { LocaleNetRegex } from '../../resources/translations';
import NetRegexes from '../../resources/netregexes';
import PartyTracker from '../../resources/party';
import Regexes from '../../resources/regexes';
import Util from '../../resources/util';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';

import {
  ShortNamify, UnscrambleDamage, IsPlayerId, IsTriggerEnabled,
  kFieldFlags, kFieldDamage, kShiftFlagValues, kFlagInstantDeath, kAttackFlags, playerDamageFields,
} from './oopsy_common';

export class DamageTracker {
  constructor(options, collector, dataFiles) {
    this.options = options;
    this.collector = collector;
    this.dataFiles = dataFiles;
    this.triggerSets = null;
    this.inCombat = false;
    this.ignoreZone = false;
    this.timers = [];
    this.triggers = [];

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
      ShortName: (name) => ShortNamify(name, this.options.PlayerNicks),
      IsPlayerId: IsPlayerId,
      DamageFromMatches: (matches) => UnscrambleDamage(matches.damage),

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
    for (const trigger of this.triggers) {
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
    } else if (type === '21' || type === '22') {
      this.OnAbilityEvent(line, splitLine);
    } else if (type === '25') {
      this.OnDefeated(line);
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
    // This is kind of obnoxious to have to regex match every ability line that's already split.
    // But, it turns it into a usable match object.
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

    // Length 1 or 2.
    let lowByte = matches.flags.substr(-2);
    if (lowByte.length === 1)
      lowByte = '0' + lowByte;

    if (!kAttackFlags.includes(lowByte))
      return;

    // TODO track first puller here, collector doesn't need every damage line
    if (!this.collector.firstPuller)
      this.collector.AddDamage(matches);

    if (IsPlayerId(matches.targetId))
      this.lastDamage[matches.target] = matches;
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

    const delay = 'delaySeconds' in trigger ? ValueOrFunction(trigger.delaySeconds, evt, matches) : 0;

    const suppress = 'suppressSeconds' in trigger ? ValueOrFunction(trigger.suppressSeconds) : 0;
    if (trigger.id && suppress > 0)
      this.triggerSuppress[trigger.id] = triggerTime + (suppress * 1000);

    const f = (function() {
      if ('mistake' in trigger) {
        const m = ValueOrFunction(trigger.mistake, evt, matches);
        if (Array.isArray(m)) {
          for (let i = 0; i < m.length; ++i)
            this.collector.OnMistakeObj(m[i]);
        } else {
          this.collector.OnMistakeObj(m);
        }
      }
      if ('deathReason' in trigger) {
        const ret = ValueOrFunction(trigger.deathReason, evt, matches);
        if (ret) {
          ret.reason = this.collector.Translate(ret.reason);
          this.AddImpliedDeathReason(ret);
        }
      }
      if ('run' in trigger)
        ValueOrFunction(trigger.run, evt, matches);
    }).bind(this);

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
    for (const key in dict) {
      const id = dict[key];
      const trigger = {
        id: key,
        type: 'Ability',
        netRegex: NetRegexes.abilityFull({ id: id, ...playerDamageFields }),
        mistake: (_e, _data, matches) => {
          return { type: type, blame: matches.target, text: matches.ability };
        },
      };
      this.triggers.push(trigger);
    }
  }

  AddGainsEffectTriggers(type, dict) {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger = {
        id: key,
        type: 'GainsEffect',
        netRegex: NetRegexes.gainsEffect({ effectId: id }),
        mistake: function(_e, _data, matches) {
          return { type: type, blame: matches.target, text: matches.effect };
        },
      };
      this.triggers.push(trigger);
    }
  }

  // Helper function for "double tap" shares where multiple players share
  // damage when it should only be on one person, such as a spread mechanic.
  AddShareTriggers(type, dict) {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger = {
        id: key,
        type: 'Ability',
        netRegex: NetRegexes.abilityFull({ type: '22', id: id, ...playerDamageFields }),
        mistake: function(e, data) {
          return { type: type, blame: e.targetName, text: e.abilityName };
        },
      };
      this.triggers.push(trigger);
    }
  }

  AddSoloTriggers(type, dict) {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger = {
        id: key,
        type: 'Ability',
        netRegex: NetRegexes.abilityFull({ type: '21', id: id, ...playerDamageFields }),
        mistake: function(e, data) {
          return {
            type: type,
            blame: e.targetName,
            text: {
              en: `${e.abilityName} (alone)`,
              de: `${e.abilityName} (allein)`,
              fr: `${e.abilityName} (seul(e))`,
              ja: `${e.abilityName} (一人)`,
              cn: `${e.abilityName} (单吃)`,
              ko: `${e.abilityName} (혼자 맞음)`,
            },
          };
        },
      };
      this.triggers.push(trigger);
    }
  }

  ReloadTriggers() {
    this.ProcessDataFiles();

    // Wait for datafiles / jobs / zone events / localization.
    if (!this.triggerSets || !this.me || !this.zoneName)
      return;

    this.Reset();

    this.triggers = [];

    this.ignoreZone = this.options.IgnoreContentTypes.includes(this.contentType) ||
      this.options.IgnoreZoneIds.includes(this.zoneId);
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
      this.AddSoloTriggers('warn', set.soloWarn);
      this.AddSoloTriggers('fail', set.soloFail);

      for (const trigger of set.triggers ?? []) {
        const regex = trigger.netRegex;
        // Some oopsy triggers (e.g. early pull) have only an id.
        if (!regex)
          continue;
        trigger.netRegex = Regexes.parse(Regexes.anyOf(regex));
        this.triggers.push(trigger);
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

    this.triggerSets = this.options.Triggers;
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
