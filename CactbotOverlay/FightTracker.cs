using Advanced_Combat_Tracker;
using System;
using System.Collections.Generic;


namespace Cactbot {
  interface ZoneFightListener {
    void OnLogsChanged(JSEvents.LogEvent e);
    void OnPartyWipe(JSEvents.PartyWipeEvent e);
  }

  public class BossFightPhaseDetails {
    public string boss_id;
    public string seal_string;

    // TODO phases
  };

  public class BossFightListener : ZoneFightListener {
    private FightTracker tracker_;
    private BossFightPhaseDetails current_boss_ = null;
    private List<BossFightPhaseDetails> fight_details_;

    private string kSealLog = " will be sealed off in 15 seconds";
    private string kUnsealLog = " is no longer sealed";
    private string kCountdown = "Engage!";

    public BossFightListener(FightTracker tracker, List<BossFightPhaseDetails> fight_details) {
      tracker_ = tracker;
      fight_details_ = fight_details;
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      foreach (var log in e.logs) {
        if (current_boss_ == null) {
          foreach (var boss in fight_details_) {
            if (boss.seal_string != null && log.IndexOf(boss.seal_string + kSealLog, StringComparison.Ordinal) >= 0) {
              StartFight(boss);
            }
          }
          if (current_boss_ == null && log.IndexOf(kCountdown, StringComparison.Ordinal) >= 0 && fight_details_.Count == 1) {
            StartFight(fight_details_[0]);
          }
        } else {
          foreach (var boss in fight_details_) {
            if (log.IndexOf(boss.seal_string + kUnsealLog, StringComparison.Ordinal) >= 0) {
              EndFight();
            }
          }
        }
      }
    }

    public void OnPartyWipe(JSEvents.PartyWipeEvent e) {
      EndFight();
    }

    private void StartFight(BossFightPhaseDetails boss) {
      if (current_boss_ != null) {
        EndFight();
      }
      current_boss_ = boss;
      tracker_.OnBossFightStart(boss.boss_id);
    }

    private void EndFight() {
      if (current_boss_ == null) {
        return;
      }
      tracker_.OnBossFightEnd();
      current_boss_ = null;
    }
  };

  public class GenericDungeonListener : ZoneFightListener {
    private FightTracker tracker_;

    public GenericDungeonListener(FightTracker tracker) {
      this.tracker_ = tracker;
    }

    // Listen for zone closing log messages and emit phases so that bosses
    // are separate from the rest of the dungeon.  DPS in dungeons, true endgame.
    // e.g.
    // [19:31:18.000] 00:0839:The Quire will be sealed off in 15 seconds!
    // [19:31:33.000] 00:0839:The Quire is sealed off!
    // [19:32:54.000] 00:0839:The Quire is no longer sealed!

    // TODO: Is there enough information in logs to disallow /p triggering this?
    private string kBeginPhaseLog = "will be sealed off in 15 seconds";
    private string kEndPhaseLog = "is no longer sealed";

    private string kTestBeginPhaseLog = "cactbot phase start";
    private string kTestEndPhaseLog = "cactbot phase end";

    // For simplicity, don't bother to track names of zones.  If there's a seal
    // message, the boss starts.  If there's another, the boss ends.  Et voila.
    private string current_boss_ = null;

    // Generate phases with numbers (B1, B2, B3, &c)
    private int boss_idx_ = 0;

    public void OnLogsChanged(JSEvents.LogEvent e) {
      foreach (var log in e.logs) {
        if (log.IndexOf(kBeginPhaseLog, StringComparison.Ordinal) >= 0 || log.IndexOf(kTestBeginPhaseLog, StringComparison.Ordinal) >= 0) {
          if (current_boss_ != null) {
            // Already fighting a boss? This shouldn't happen.
            tracker_.OnPhaseEnd(current_boss_);
          }
          boss_idx_++;
          current_boss_ = "B" + boss_idx_;
          tracker_.OnPhaseStart(current_boss_);
        } else if (log.IndexOf(kEndPhaseLog, StringComparison.Ordinal) >= 0 || log.IndexOf(kTestEndPhaseLog, StringComparison.Ordinal) >= 0) {
          tracker_.OnPhaseEnd(current_boss_);
          current_boss_ = null;
        }
      }
    }

    public void OnPartyWipe(JSEvents.PartyWipeEvent e) {}
  }

  public class FightTracker {
    private DateTime last_update_;
    private CactbotOverlay overlay_;
    private int last_encounter_seconds_ = 0;
    private const float kUpdateIntervalInSeconds = 1;
    private ZoneFightListener zone_listener_;

    // zone name => boss fights
    private Dictionary<string, List<BossFightPhaseDetails>> boss_fights_;

    public delegate void DispatchToJS(JSEvent detail);

    public FightTracker(CactbotOverlay overlay) {
      this.overlay_ = overlay;

      overlay_.OnZoneChanged += OnZoneChange;
      overlay_.OnLogsChanged += OnLogsChanged;
      overlay_.OnPartyWipe += OnPartyWipe;

      SetZoneListener(new GenericDungeonListener(this));

      // TODO: serialize this to JSON somewhere and download it at the start of the plugin loading, caching it locally.
      var o1s = new BossFightPhaseDetails { boss_id = "o1s" };
      var o2s = new BossFightPhaseDetails { boss_id = "o2s" };
      var o3s = new BossFightPhaseDetails { boss_id = "o3s" };
      var o4s = new BossFightPhaseDetails { boss_id = "o4s" };

      var test_boss = new BossFightPhaseDetails { boss_id = "savage_test", seal_string = "The Thinger" };

      boss_fights_ = new Dictionary<string, List<BossFightPhaseDetails>>() {
        { "Mist", new List<BossFightPhaseDetails>{ test_boss } },

        { "Deltascape V1.0 (Savage)", new List<BossFightPhaseDetails>{ o1s } },
        { "Deltascape V2.0 (Savage)", new List<BossFightPhaseDetails>{ o2s } },
        { "Deltascape V3.0 (Savage)", new List<BossFightPhaseDetails>{ o3s } },
        { "Deltascape V4.0 (Savage)", new List<BossFightPhaseDetails>{ o4s } },

        { "Unknown Zone (2B7)", new List<BossFightPhaseDetails>{ o1s } },
        { "Unknown Zone (2B8)", new List<BossFightPhaseDetails>{ o2s } },
        { "Unknown Zone (2B9)", new List<BossFightPhaseDetails>{ o3s } },
        { "Unknown Zone (2Ba)", new List<BossFightPhaseDetails>{ o4s } },
      };
    }

    private void SetZoneListener(ZoneFightListener listener) {
      zone_listener_ = listener;
    }

    private bool ShouldSendDpsUpdates() {
      return overlay_.Config.DpsUpdatesPerSecond > 0;
    }

    public void Tick(DateTime time) {
      if (!ShouldSendDpsUpdates()) {
        return;
      }

      if (!FFXIV_ACT_Plugin.ACTWrapper.InCombat) {
        return;
      }

      // TODO: This could just use the slower time for now, but in the future this will watch rotations
      // and log entries.  Because of that, it could send updates more quickly and so it will just stay
      // on the "fast" tick instead.
      if ((time - last_update_).TotalSeconds < overlay_.Config.DpsUpdatesPerSecond) {
        return;
      }

      var encounter = EncounterDPSInfo();
      if (encounter == null) {
        return;
      }
      var combatant = CombatantDPSInfo();
      if (combatant == null) {
        return;
      }
      if (combatant.Count <= 0) {
        return;
      }

      // Note: capitalized fields from ACT are the raw number, but lowercase are formatted.
      const string kTimeKey = "DURATION";
      if (!encounter.ContainsKey(kTimeKey)) {
        return;
      }
      int encounter_seconds;
      if (!Int32.TryParse(encounter[kTimeKey], out encounter_seconds)) {
        return;
      }
      if (encounter_seconds == last_encounter_seconds_ && encounter_seconds > 0) {
        // Deliberately don't do an update when the duration hasn't changed.
        // This is the way that phases and encounter titles don't disappear.
        return;
      }

      const string kTotalDPS = "ENCDPS";
      if (!encounter.ContainsKey(kTotalDPS)) {
        return;
      }
      int encounter_dps;
      if (!Int32.TryParse(encounter[kTotalDPS], out encounter_dps)) {
        return;
      }
      if (encounter_dps <= 0) {
        return;
      }

      last_update_ = time;
      last_encounter_seconds_ = encounter_seconds;

      overlay_.DispatchToJS(new JSEvents.DPSOverlayUpdateEvent(encounter, combatant));
    }

    public void OnPhaseStart(string phase_id) {
      var encounter = EncounterDPSInfo();
      var combatant = CombatantDPSInfo();
      overlay_.DispatchToJS(new JSEvents.FightPhaseStart(phase_id, encounter, combatant));
    }

    public void OnPhaseEnd(string phase_id) {
      var encounter = EncounterDPSInfo();
      var combatant = CombatantDPSInfo();
      overlay_.DispatchToJS(new JSEvents.FightPhaseEnd(phase_id, encounter, combatant));
    }

    public void OnBossFightStart(string boss_id) {
      int pull_count = overlay_.IncrementAndGetPullCount(boss_id);
      overlay_.DispatchToJS(new JSEvents.BossFightStart(boss_id, pull_count));
    }

    public void OnBossFightEnd() {
      overlay_.DispatchToJS(new JSEvents.BossFightEnd());
    }

    public void OnZoneChange(JSEvents.ZoneChangedEvent e) {
      if (boss_fights_.ContainsKey(e.zoneName)) {
        SetZoneListener(new BossFightListener(this, boss_fights_[e.zoneName]));
      } else {
        SetZoneListener(new GenericDungeonListener(this));
      }
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      if (zone_listener_ != null) {
        zone_listener_.OnLogsChanged(e);
      }
    }

    public void OnPartyWipe(JSEvents.PartyWipeEvent e) {
      if (zone_listener_ != null) {
        zone_listener_.OnPartyWipe(e);
      }
    }

    public void LogInfo(string log) {
      overlay_.LogInfo(log);
    }

    public Dictionary<string, string> EncounterDPSInfo() {
      if (!ShouldSendDpsUpdates())
        return null;

      if (ActGlobals.oFormActMain.ActiveZone.ActiveEncounter == null)
        return null;

      var dict = new Dictionary<string, string>();
      List<CombatantData> allies = ActGlobals.oFormActMain.ActiveZone.ActiveEncounter.GetAllies();
      foreach (var export in EncounterData.ExportVariables) {
        try {
          string value = export.Value.GetExportString(ActGlobals.oFormActMain.ActiveZone.ActiveEncounter, allies, "");
          dict[export.Key] = value;
        } catch (KeyNotFoundException) {
          // This appears to sometimes happen with 10ENCDPS and friends.
        } catch (InvalidOperationException) {
          // TODO: maybe this needs to be locked?
          // "Collection was modified; enumeration operation may not execute"
        } catch (ArgumentException e) {
          // TODO: testing, attempting to ignore an exception inside of GetExportString where
          // an Array.Copy occurs into the allies array but ACT thinks there are more allies than
          // entries in the allies list.
          LogInfo("Argument exception: " + e.ToString());
        }
      }
      return dict;
    }

    public List<Dictionary<string, string>> CombatantDPSInfo() {
      if (!ShouldSendDpsUpdates())
        return null;

      if (ActGlobals.oFormActMain.ActiveZone.ActiveEncounter == null)
        return null;

      var combatant_list = new List<Dictionary<string, string>>();
      List<CombatantData> allies = ActGlobals.oFormActMain.ActiveZone.ActiveEncounter.GetAllies();
      foreach (CombatantData ally in allies) {
        var dict = new Dictionary<string, string>();
        foreach (var export in CombatantData.ExportVariables) {
          // This causes a FormatException.
          if (export.Key == "NAME")
            continue;

          try {
            string value = export.Value.GetExportString(ally, "");
            dict[export.Key] = value;
          } catch (KeyNotFoundException) {
            // This appears to sometimes happen with 10ENCDPS and friends.
          } catch (InvalidOperationException) {
            // TODO: maybe this needs to be locked?
            // "Collection was modified; enumeration operation may not execute"
          }
        }

        if (!dict.ContainsKey("name"))
          continue;
        combatant_list.Add(dict);
      }

      return combatant_list;
    }
  }
}
