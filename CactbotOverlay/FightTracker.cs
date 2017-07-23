using Advanced_Combat_Tracker;
using System;
using System.Collections.Generic;


namespace Cactbot {
  interface ZoneFightListener {
    void OnLogsChanged(JSEvents.LogEvent e);
  }

  public class GenericDungeonListener : ZoneFightListener {
    private PhaseController controller_ = null;

    public GenericDungeonListener(PhaseController controller) {
      this.controller_ = controller;
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
            controller_.OnPhaseEnd(current_boss_);
          }
          boss_idx_++;
          current_boss_ = "B" + boss_idx_;
          controller_.OnPhaseStart(current_boss_);
        } else if (log.IndexOf(kEndPhaseLog, StringComparison.Ordinal) >= 0 || log.IndexOf(kTestEndPhaseLog, StringComparison.Ordinal) >= 0) {
          controller_.OnPhaseEnd(current_boss_);
          current_boss_ = null;
        }
      }
    }
  }

  public interface PhaseController {
    void OnPhaseStart(string name);
    void OnPhaseEnd(string name);
  };

  public class FightTracker : PhaseController {
    private DateTime last_update_;
    private DispatchToJS update_func_;
    private int last_encounter_seconds_ = 0;
    private const float kUpdateIntervalInSeconds = 1;
    private ZoneFightListener zone_listener_;

    public delegate void DispatchToJS(JSEvent detail);

    public FightTracker(DispatchToJS updateFunc) {
      update_func_ = updateFunc;
      SetZoneListener(new GenericDungeonListener(this));
    }

    private void SetZoneListener(ZoneFightListener listener) {
      zone_listener_ = listener;
    }

    public void Tick(DateTime time) {
      if (!FFXIV_ACT_Plugin.ACTWrapper.InCombat) {
        return;
      }

      // TODO: This could just use the slower time for now, but in the future this will watch rotations
      // and log entries.  Because of that, it could send updates more quickly and so it will just stay
      // on the "fast" tick instead.
      if ((time - last_update_).TotalSeconds < kUpdateIntervalInSeconds) {
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

      update_func_(new JSEvents.DPSOverlayUpdateEvent(encounter, combatant));
    }

    public void OnPhaseStart(string phase_id) {
      var encounter = EncounterDPSInfo();
      var combatant = CombatantDPSInfo();
      update_func_(new JSEvents.FightPhaseStart(phase_id, encounter, combatant));
    }

    public void OnPhaseEnd(string phase_id) {
      var encounter = EncounterDPSInfo();
      var combatant = CombatantDPSInfo();
      update_func_(new JSEvents.FightPhaseEnd(phase_id, encounter, combatant));
    }

    public void OnZoneChange(JSEvents.ZoneChangedEvent e) {
      // TODO: pick listener based on zone name
      SetZoneListener(new GenericDungeonListener(this));
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      if (zone_listener_ != null) {
        zone_listener_.OnLogsChanged(e);
      }
    }

    public Dictionary<string, string> EncounterDPSInfo() {
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
        }
      }
      return dict;
    }

    public List<Dictionary<string, string>> CombatantDPSInfo() {
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

      // Sort by encdps descending.  OverlayPlugin has options for different ways to sort, but
      // html can do this itself if it wants something different.  This is what most folks expect.
      const string kSortKey = "encdps";
      combatant_list.Sort((x, y) => {
        if (x.ContainsKey(kSortKey) && y.ContainsKey(kSortKey)) {
          double x_value, y_value;
          if (double.TryParse(x[kSortKey], out x_value) && double.TryParse(y[kSortKey], out y_value)) {
            return y_value.CompareTo(x_value);
          }
        }
        return 0;
      });

      return combatant_list;
    }
  }
}