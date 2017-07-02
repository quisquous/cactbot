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

  public class CactbotOverlay : OverlayBase<CactbotOverlayConfig>, Tamagawa.EnmityPlugin.Logger {
    // Not thread-safe, as OnLogLineRead may happen at any time.
    private List<string> log_lines_ = new List<string>();
    private System.Timers.Timer update_timer_;
    private JavaScriptSerializer serializer_;
    private FFXIVProcess ffxiv_ = new FFXIVProcess();

    public delegate void ZoneChangedHandler(string zone);
    public event ZoneChangedHandler OnZoneChanged;

    public delegate void SelfChangedHandler(Combatant player);
    public event SelfChangedHandler OnSelfChanged;

    public delegate void LogHandler(List<string> logs);
    public event LogHandler OnLogsChanged;

    public delegate void InCombatChangedHandler(bool inCombat);
    public event InCombatChangedHandler OnInCombatChanged;

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

      // Incoming events.
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;

      // Outgoing JS events.
      OnZoneChanged += (zone) => DispatchToJS("onZoneChangedEvent", new JSEvents.ZoneChangedEvent(zone));
      OnLogsChanged += (logs) => DispatchToJS("onLogEvent", new JSEvents.LogEvent(logs));
      OnSelfChanged += (self) => DispatchToJS("onSelfChangedEvent", new JSEvents.SelfChangedEvent(self));
      OnInCombatChanged += (inCombat) => DispatchToJS("onInCombatChangedEvent", new JSEvents.InCombatChangedEvent(inCombat));
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

      if (!ffxiv_.FindProcess(this)) {
        // Silently stop sending messages if the ffxiv process isn't around.
        return;
      }

      // onInCombatChangedEvent: Fires when entering or leaving combat.
      bool in_combat = FFXIV_ACT_Plugin.ACTWrapper.InCombat;
      if (in_combat != notify_state_.in_combat) {
        notify_state_.in_combat = in_combat;
        OnInCombatChanged(in_combat);
      }

      // onZoneChangedEvent: Fires when the player changes their current zone.
      string zone_name = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone;
      if (!zone_name.Equals(notify_state_.zone_name)) {
        notify_state_.zone_name = zone_name;
        OnZoneChanged(zone_name);
      }

      // onLogEvent: Fires when new combat log events from FFXIV are available.
      notify_state_.logs = Interlocked.Exchange(ref log_lines_, new List<string>());
      if (notify_state_.logs.Count > 0) {
        OnLogsChanged(notify_state_.logs);
      }

      // onSelfChangedEvent: Fires when current player combatant data changes.
      Combatant self = ffxiv_.GetSelfCombatant();
      if (self != notify_state_.self) {
        notify_state_.self = self;
        OnSelfChanged(self);
      }
    }

    // Tamagawa.EnmityPlugin.Logger implementation.
    public void LogDebug(string format, params object[] args) { this.Log(LogLevel.Debug, format, args); }
    public void LogError(string format, params object[] args) { this.Log(LogLevel.Error, format, args); }
    public void LogWarning(string format, params object[] args) { this.Log(LogLevel.Warning, format, args); }
    public void LogInfo(string format, params object[] args) { this.Log(LogLevel.Info, format, args); }

    // State that is tracked and sent to JS when it changes.
    private class NotifyState {
      public bool in_combat = false;
      public string zone_name = "";
      public Combatant self = new Combatant();
      public List<string> logs;
    }

    private NotifyState notify_state_ = new NotifyState();
  }

}  // namespace Cactbot