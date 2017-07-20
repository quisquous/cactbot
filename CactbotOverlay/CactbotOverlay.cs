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
    private System.Timers.Timer fast_update_timer_;
    private JavaScriptSerializer serializer_;
    private FFXIVProcess ffxiv_;
    private FightTracker fight_tracker_;
    private WipeDetector wipe_detector_;

    public delegate void GameExistsHandler(JSEvents.GameExistsEvent e);
    public event GameExistsHandler OnGameExists;

    public delegate void GameActiveChangedHandler(JSEvents.GameActiveChangedEvent e);
    public event GameActiveChangedHandler OnGameActiveChanged;

    public delegate void ZoneChangedHandler(JSEvents.ZoneChangedEvent e);
    public event ZoneChangedHandler OnZoneChanged;

    public delegate void PlayerChangedHandler(JSEvents.PlayerChangedEvent e);
    public event PlayerChangedHandler OnPlayerChanged;

    public delegate void TargetChangedHandler(JSEvents.TargetChangedEvent e);
    public event TargetChangedHandler OnTargetChanged;

    public delegate void LogHandler(JSEvents.LogEvent e);
    public event LogHandler OnLogsChanged;

    public delegate void InCombatChangedHandler(JSEvents.InCombatChangedEvent e);
    public event InCombatChangedHandler OnInCombatChanged;

    public delegate void PlayerDiedHandler(JSEvents.PlayerDiedEvent e);
    public event PlayerDiedHandler OnPlayerDied;

    public delegate void PartyWipeHandler(JSEvents.PartyWipeEvent e);
    public event PartyWipeHandler OnPartyWipe;
    public void Wipe() {
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.EndCombat(false);
      OnPartyWipe(new JSEvents.PartyWipeEvent());
    }

    public CactbotOverlay(CactbotOverlayConfig config)
        : base(config, config.Name) {
      ffxiv_ = new FFXIVProcess(this);
      serializer_ = new JavaScriptSerializer();
      fight_tracker_ = new FightTracker(DispatchToJS);
      // TODO: should these be passed to fight tracker?
      OnZoneChanged += fight_tracker_.OnZoneChange;
      OnLogsChanged += fight_tracker_.OnLogsChanged;
      wipe_detector_ = new WipeDetector(this);

      // Our own timer with a higher frequency than OverlayPlugin since we want to see
      // the effect of log messages quickly.
      fast_update_timer_ = new System.Timers.Timer();
      fast_update_timer_.SynchronizingObject = Advanced_Combat_Tracker.ActGlobals.oFormActMain;
      fast_update_timer_.Interval = 16;
      fast_update_timer_.Elapsed += (o, e) => {
        SendFastRateEvents();
      };

      // Incoming events.
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;

      // Outgoing JS events.
      OnGameExists += (e) => DispatchToJS(e);
      OnGameActiveChanged += (e) => DispatchToJS(e);
      OnZoneChanged += (e) => DispatchToJS(e);
      OnLogsChanged += (e) => DispatchToJS(e);
      OnPlayerChanged += (e) => DispatchToJS(e);
      OnTargetChanged += (e) => DispatchToJS(e);
      OnInCombatChanged += (e) => DispatchToJS(e);
      OnPlayerDied += (e) => DispatchToJS(e);
      OnPartyWipe += (e) => DispatchToJS(e);
    }

    public override void Dispose() {
      fast_update_timer_.Stop();
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
    public void DispatchToJS(JSEvent e) {
      StringBuilder sb = new StringBuilder(100);
      sb.Append("document.dispatchEvent(new CustomEvent('");
      sb.Append(e.EventName());
      sb.Append("', { detail: ");
      e.Serialize(sb, serializer_);
      sb.Append(" }));");
      this.Overlay.Renderer.Browser.GetMainFrame().ExecuteJavaScript(sb.ToString(), null, 0);
    }

    // Events that we want to update less often because they aren't are critical.
    private void SendSlowRateEvents() {
      // Handle startup and shutdown. And do not fire any events until the page has loaded and had a chance to
      // register its event handlers.
      if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null || Overlay.Renderer.Browser.IsLoading)
        return;

      bool game_exists = ffxiv_.FindProcess();
      if (game_exists != notify_state_.game_exists) {
        notify_state_.game_exists = game_exists;
        OnGameExists(new JSEvents.GameExistsEvent(game_exists));
        if (!game_exists) {
          // Stop the fast updates timer, save some cpu.
          fast_update_timer_.Stop();
        } else {
          fast_update_timer_.Start();
        }
      }
    }

    // Events that we want to update as soon as possible.
    private void SendFastRateEvents() {
      // Handle startup and shutdown. And do not fire any events until the page has loaded and had a chance to
      // register its event handlers.
      if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null || Overlay.Renderer.Browser.IsLoading)
        return;

      bool game_active = game_active = ffxiv_.IsActive();
      if (game_active != notify_state_.game_active) {
        notify_state_.game_active = game_active;
        OnGameActiveChanged(new JSEvents.GameActiveChangedEvent(game_active));
      }

      // Silently stop sending other messages if the ffxiv process isn't around.
      if (!ffxiv_.HasProcess())
        return;

      // onInCombatChangedEvent: Fires when entering or leaving combat.
      bool in_combat = FFXIV_ACT_Plugin.ACTWrapper.InCombat;
      if (in_combat != notify_state_.in_combat) {
        notify_state_.in_combat = in_combat;
        OnInCombatChanged(new JSEvents.InCombatChangedEvent(in_combat));
      }

      // onZoneChangedEvent: Fires when the player changes their current zone.
      string zone_name = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone;
      if (!zone_name.Equals(notify_state_.zone_name)) {
        notify_state_.zone_name = zone_name;
        OnZoneChanged(new JSEvents.ZoneChangedEvent(zone_name));
      }

      Combatant player = ffxiv_.GetSelfCombatant();

      // onPlayerDiedEvent: Fires when the player dies. All buffs/debuffs are
      // lost.
      bool dead = player != null && player.CurrentHP == 0;
      if (dead != notify_state_.dead) {
        notify_state_.dead = dead;
        if (dead)
          OnPlayerDied(new JSEvents.PlayerDiedEvent());
      }

      // onPlayerChangedEvent: Fires when current player data changes.
      // TODO: Is this always true cuz it's only doing pointer comparison?
      if (player != notify_state_.player) {
        notify_state_.player = player;
        if (player != null) {
          if ((JobEnum)player.Job == JobEnum.RDM) {
            var rdm = ffxiv_.GetRedMage();
            if (rdm != null) {
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.RedMageDetail(rdm.white, rdm.black);
              OnPlayerChanged(e);
            }
          } else {
            // No job-specific data.
            OnPlayerChanged(new JSEvents.PlayerChangedEvent(player));
          }
        }
      }

      // onTargetChangedEvent: Fires when current target or their state changes.
      Combatant target = ffxiv_.GetTargetCombatant();
      // TODO: Is this always true cuz it's only doing pointer comparison?
      if (target != notify_state_.target) {
        notify_state_.target = target;
        if (target != null)
          OnTargetChanged(new JSEvents.TargetChangedEvent(target));
        else
          OnTargetChanged(new JSEvents.TargetChangedEvent(null));
      }

      // onLogEvent: Fires when new combat log events from FFXIV are available. This fires after any
      // more specific events, some of which may involve parsing the logs as well.
      List<string> logs = Interlocked.Exchange(ref log_lines_, new List<string>());
      if (logs.Count > 0)
        OnLogsChanged(new JSEvents.LogEvent(logs));

      fight_tracker_.Tick(DateTime.Now);
    }

    // Tamagawa.EnmityPlugin.Logger implementation.
    public void LogDebug(string format, params object[] args) { this.Log(LogLevel.Debug, format, args); }
    public void LogError(string format, params object[] args) { this.Log(LogLevel.Error, format, args); }
    public void LogWarning(string format, params object[] args) { this.Log(LogLevel.Warning, format, args); }
    public void LogInfo(string format, params object[] args) { this.Log(LogLevel.Info, format, args); }

    // State that is tracked and sent to JS when it changes.
    private class NotifyState {
      public bool game_exists = false;
      public bool game_active = false;
      public bool in_combat = false;
      public bool dead = false;
      public string zone_name = "";
      public Combatant player = null;
      public Combatant target = null;
    }
    private NotifyState notify_state_ = new NotifyState();
  }

}  // namespace Cactbot