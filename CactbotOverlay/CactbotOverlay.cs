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
using Tamagawa.EnmityPlugin;

namespace Cactbot {

  public class CactbotOverlay : OverlayBase<CactbotOverlayConfig> {
    // Not thread-safe, as OnLogLineRead may happen at any time.
    private List<string> log_lines_ = new List<string>();
    private System.Timers.Timer update_timer_;
    private JavaScriptSerializer serializer_;
    private FFXIVProcess ffxiv_ = new FFXIVProcess();

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

    public override void Navigate(string url) {
      base.Navigate(url);
      // Reset to defaults so on load the plugin gets notified about any non-defaults
      // consistently.
      this.notify_state_ = new NotifyState();
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
      // Handle startup and shutdown. And do not fire any events until the page has loaded and had a chance to
      // register its event handlers.
      //if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null || Overlay.Renderer.Browser.IsLoading)
      //  return;
    }

    // Events that we want to update as soon as possible.
    private void SendFastRateEvents() {
      // Handle startup and shutdown. And do not fire any events until the page has loaded and had a chance to
      // register its event handlers.
      if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null || Overlay.Renderer.Browser.IsLoading)
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

      // Silently stop sending messages if the ffxiv process isn't around.
      if (!ffxiv_.FindProcess()) {
        return;
      }

      // onCombat{Started,Ended}Event: Fires when entering or leaving combat.
      bool in_combat = FFXIV_ACT_Plugin.ACTWrapper.InCombat;
      if (in_combat != notify_state_.in_combat) {
        notify_state_.in_combat = in_combat;
        if (in_combat) {
          DispatchToJS("onCombatStartedEvent", new JSEvents.CombatStartedEvent());
        } else {
          // TODO: determine if this was a wipe!
          bool wipe = false;
          DispatchToJS("onCombatEndedEvent", new JSEvents.CombatEndedEvent(wipe));
        }
      }

      // onZoneChangedEvent: Fires when the player changes their current zone.
      string zone_name = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone;
      if (!zone_name.Equals(notify_state_.zone_name)) {
        notify_state_.zone_name = zone_name;
        DispatchToJS("onZoneChangedEvent", new JSEvents.ZoneChangedEvent(zone_name));
      }

      // onLogEvent: Fires when new combat log events from FFXIV are available.
      var logs = Interlocked.Exchange(ref log_lines_, new List<string>());
      if (logs.Count > 0) {
        DispatchToJS("onLogEvent", new JSEvents.LogEvent(logs));
      }

      // onSelfChangedEvent: Fires when current player combatant data changes.
      Combatant self = ffxiv_.GetSelfCombatant();
      if (self != notify_state_.self) {
        notify_state_.self = self;
        DispatchToJS("onSelfChangedEvent", new JSEvents.SelfChangedEvent(self));
      }
    }

    // State that is tracked and sent to JS when it changes.
    private class NotifyState {
      public bool in_combat = false;
      public string zone_name = "";
      public Combatant self = new Combatant();
    }

    private NotifyState notify_state_ = new NotifyState();
  }

}  // namespace Cactbot