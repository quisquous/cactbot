using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Cactbot {

  public class CactbotOverlay : OverlayBase<CactbotOverlayConfig> {
    // Not thread-safe, as OnLogLineRead may happen at any time.
    private List<string> log_lines_ = new List<string>();
    private System.Timers.Timer update_timer_;
    private JavaScriptSerializer serializer_;

    public CactbotOverlay(CactbotOverlayConfig config)
        : base(config, config.Name) {
      serializer_ = new JavaScriptSerializer();

      // Our own timer with a higher frequency than OverlayPlugin since we want to see
      // the effect of log messages quickly.
      update_timer_ = new System.Timers.Timer();
      update_timer_.Interval = 16;
      update_timer_.Elapsed += (o, e) => {
        SendFastRateEvents();
      };
      update_timer_.Start();

      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;
    }

    public override void Dispose() {
      update_timer_.Stop();
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead -= OnLogLineRead;
      base.Dispose();
    }

    private void OnLogLineRead(bool isImport, LogLineEventArgs args) {
      // isImport happens when somebody is importing old encounters and all the log lines are processed.
      // Don't need to send all of these to the overlay.
      if (isImport)
        return;
      log_lines_.Add(args.logLine);
    }

    // This is called by the OverlayPlugin every 1s which is not often enough for us, so we
    // do our own update mechanism as well.
    protected override void Update() {
      SendSlowRateEvents();
    }

    // Sends an event called |event_name| to javascript, with an event.detail that contains
    // the fields and values of the |detail| structure.
    private void DispatchToJS<T>(string event_name, T detail) {
      StringBuilder sb = new StringBuilder(100);
      sb.Append("document.dispatchEvent(new CustomEvent('");
      sb.Append(event_name);
      sb.Append("', { detail: ");
      sb.Append(serializer_.Serialize(detail));
      sb.Append(" }));");
      this.Overlay.Renderer.Browser.GetMainFrame().ExecuteJavaScript(sb.ToString(), null, 0);
    }

    // Events that we want to update less often because they aren't are critical.
    private void SendSlowRateEvents() {
      // Handle startup and shutdown.
      //if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null)
      //  return;
    }

    // Events that we want to update as soon as possible.
    private void SendFastRateEvents() {
      // Handle startup and shutdown.
      if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null)
        return;

      // MESSAGES
      // browser -> overlay
      // cactbot.enterZone(str)
      // cactbot.leaveZone(str)
      // cactbot.wipe
      // cactbot.tick(dataJsonMess)

      // overlay -> broadcast (uhh could just do this in c#, but loading json?)
      // cactbot.rotation.startfight
      // cactbot.rotation.endfight
      // cactbot.rotation.startphase
      // cactbot.rotation.endPhase

      // DATA JSON MESS
      // getPlayer -> combatant (posX, posY, posZ, currentHP)
      // getMobByName -> combatant
      // inCombat (is this necessary??)
      // getCurrentPartyList
      // encounterDPSInfo
      // combatantDPSInfo

      // onLogEvent: Fires when new combat log events from FFXIV are available.
      var logs = Interlocked.Exchange(ref log_lines_, new List<string>());
      if (logs.Count > 0) {
        DispatchToJS("onLogEvent", new JSEvents.LogEvent(logs));
      }

      var deets = new JSEvents.EventDetails() {
        inCombat = FFXIV_ACT_Plugin.ACTWrapper.InCombat,
        currentZone = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone,
      };
      DispatchToJS("onOverlayDataUpdate", deets);
    }
  }

}  // namespace Cactbot