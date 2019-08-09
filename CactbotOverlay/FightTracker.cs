using Advanced_Combat_Tracker;
using System;
using System.Collections.Generic;


namespace Cactbot {
  public class FightTracker {
    private DateTime last_update_;
    private CactbotEventSource overlay_;
    private int last_encounter_seconds_ = 0;
    private const float kUpdateIntervalInSeconds = 1;

    public delegate void DispatchToJS(JSEvent detail);

    public FightTracker(CactbotEventSource overlay) {
      this.overlay_ = overlay;
    }

    private bool ShouldSendDpsUpdates() {
      return overlay_.Config.DpsUpdatesPerSecond > 0;
    }

    public void Tick(DateTime time) {
      if (!ShouldSendDpsUpdates()) {
        return;
      }

      if (!Advanced_Combat_Tracker.ActGlobals.oFormActMain.InCombat) {
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
