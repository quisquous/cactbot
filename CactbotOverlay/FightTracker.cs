using Advanced_Combat_Tracker;
using System;
using System.Collections.Generic;


namespace Cactbot {
  public class FightTracker {
    private DateTime last_update_;
    private DispatchToJS update_func_;
    private const float kUpdateIntervalInSeconds = 1;

    public delegate void DispatchToJS(string event_name, object detail);

    public FightTracker(DispatchToJS updateFunc) {
      update_func_ = updateFunc;
    }

    public void Tick(DateTime time) {
      // TODO: This could just use the slower time for now, but in the future this will watch rotations
      // and log entries.  Because of that, it could send updates more quickly and so it will just stay
      // on the "fast" tick instead.
      if ((time - last_update_).TotalSeconds < kUpdateIntervalInSeconds) {
        return;
      }
      last_update_ = time;
      update_func_("onOverlayDataUpdate", new JSEvents.DPSOverlayUpdateEvent(EncounterDPSInfo(), CombatantDPSInfo()));
    }

    public void OnZoneChange(JSEvents.ZoneChangedEvent e) {
      // TODO
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      // TODO
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

      var combatantList = new List<Dictionary<string, string>>();
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
        combatantList.Add(dict);
      }

      // Sort by encdps descending.  OverlayPlugin has options for different ways to sort, but
      // html can do this itself if it wants something different.  This is what most folks expect.
      const string kSortKey = "encdps";
      combatantList.Sort((x, y) => {
        if (x.ContainsKey(kSortKey) && y.ContainsKey(kSortKey)) {
          double x_value, y_value;
          if (double.TryParse(x[kSortKey], out x_value) && double.TryParse(y[kSortKey], out y_value)) {
            return y_value.CompareTo(x_value);
          }
        }
        return 0;
      });

      return combatantList;
    }
  }
}