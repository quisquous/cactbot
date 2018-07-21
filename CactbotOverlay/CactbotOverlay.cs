using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using Newtonsoft.Json;
using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace Cactbot {

  public interface ILogger {
    void LogDebug(string format, params object[] args);
    void LogError(string format, params object[] args);
    void LogWarning(string format, params object[] args);
    void LogInfo(string format, params object[] args);
  }


  public class CactbotOverlay : OverlayBase<CactbotOverlayConfig>, ILogger {
    private static int kFastTimerMilli = 16;
    private static int kSlowTimerMilli = 300;
    private static int kUberSlowTimerMilli = 3000;
    private static int kRequiredNETVersionMajor = 4;
    private static int kRequiredNETVersionMinor = 6;

    private SemaphoreSlim log_lines_semaphore_ = new SemaphoreSlim(1);
    // Not thread-safe, as OnLogLineRead may happen at any time. Use |log_lines_semaphore_| to access it.
    private List<string> log_lines_ = new List<string>(40);
    // Used on the fast timer to avoid allocing List every time.
    private List<string> last_log_lines_ = new List<string>(40);

    // When true, the update function should reset notify state back to defaults.
    private bool reset_notify_state_ = false;
    // When true, check for the latest version on the next Navigate. Used to only check once.
    private static bool is_first_overlay_initialized_ = true;
    // Set to true when the constructor is run, to prevent premature navigation before we're able to log.
    private bool init_ = false;

    // Temporarily hold any navigations that occur during construction
    private string deferred_navigate_;

    private StringBuilder dispatch_string_builder_ = new StringBuilder(1000);
    JsonTextWriter dispatch_json_writer_;
    JsonSerializer dispatch_serializer_;
    JsonSerializer message_serializer_;
    private Object dispatch_lock_ = new Object();

    private System.Timers.Timer fast_update_timer_;
    // Held while the |fast_update_timer_| is running.
    private SemaphoreSlim fast_update_timer_semaphore_ = new SemaphoreSlim(1);
    private FFXIVProcess ffxiv_;
    private FightTracker fight_tracker_;
    private WipeDetector wipe_detector_;
    private string language_ = null;
    private System.Threading.SynchronizationContext main_thread_sync_;

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

    public delegate void TargetCastingHandler(JSEvents.TargetCastingEvent e);
    public event TargetCastingHandler OnTargetCasting;

    public delegate void FocusChangedHandler(JSEvents.FocusChangedEvent e);
    public event FocusChangedHandler OnFocusChanged;

    public delegate void FocusCastingHandler(JSEvents.FocusCastingEvent e);
    public event FocusCastingHandler OnFocusCasting;

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

    public delegate void DataFilesReadHandler(JSEvents.DataFilesRead e);
    public event DataFilesReadHandler OnDataFilesRead;

    public CactbotOverlay(CactbotOverlayConfig config)
        : base(config, config.Name) {
      main_thread_sync_ = System.Windows.Forms.WindowsFormsSynchronizationContext.Current;
    }

    void Initialize() {
      ffxiv_ = new FFXIVProcess(this);
      fight_tracker_ = new FightTracker(this);
      wipe_detector_ = new WipeDetector(this);
      dispatch_json_writer_ = new JsonTextWriter(new System.IO.StringWriter(dispatch_string_builder_));
      dispatch_serializer_ = JsonSerializer.CreateDefault();
      message_serializer_ = JsonSerializer.CreateDefault();

      // Our own timer with a higher frequency than OverlayPlugin since we want to see
      // the effect of log messages quickly.
      fast_update_timer_ = new System.Timers.Timer();
      fast_update_timer_.Elapsed += (o, args) => {
        // Hold this while we're in here to prevent the Renderer or Browser from disappearing from under us.
        fast_update_timer_semaphore_.Wait();
        int timer_interval = kSlowTimerMilli;
        try {
          timer_interval = SendFastRateEvents();
        } catch (Exception e) {
          // SendFastRateEvents holds this semaphore until it exits.
          LogError("Exception in SendFastRateEvents: " + e.Message);
          LogError("Stack: " + e.StackTrace);
          LogError("Source: " + e.Source);
        }
        fast_update_timer_semaphore_.Release();
        fast_update_timer_.Interval = timer_interval;
        fast_update_timer_.Start();
      };
      fast_update_timer_.AutoReset = false;

      FFXIVPlugin plugin_helper = new FFXIVPlugin(this);
      language_ = plugin_helper.GetLocaleString();

      // Incoming events.
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;

      // Outgoing JS events.
      OnGameExists += (e) => DispatchToJS(e);
      OnGameActiveChanged += (e) => DispatchToJS(e);
      OnZoneChanged += (e) => DispatchToJS(e);
      if (this.Config.LogUpdatesEnabled) {
        OnLogsChanged += (e) => DispatchToJS(e);
      }
      OnPlayerChanged += (e) => DispatchToJS(e);
      OnTargetChanged += (e) => DispatchToJS(e);
      OnTargetCasting += (e) => DispatchToJS(e);
      OnFocusChanged += (e) => DispatchToJS(e);
      OnFocusCasting += (e) => DispatchToJS(e);
      OnInCombatChanged += (e) => DispatchToJS(e);
      OnPlayerDied += (e) => DispatchToJS(e);
      OnPartyWipe += (e) => DispatchToJS(e);
      OnDataFilesRead += (e) => DispatchToJS(e);

      fast_update_timer_.Interval = kFastTimerMilli;
      fast_update_timer_.Start();

      if (is_first_overlay_initialized_) {
        is_first_overlay_initialized_ = false;

        var versions = new VersionChecker(this);
        Version local = versions.GetLocalVersion();
        Version remote = versions.GetRemoteVersion();

        Version overlay = versions.GetOverlayPluginVersion();
        Version ffxiv = versions.GetFFXIVPluginVersion();
        Version act = versions.GetACTVersion();

        // Print out version strings and locations to help users debug.
        LogInfo("cactbot: {0} {1}", local.ToString(), versions.GetCactbotLocation());
        LogInfo("OverlayPlugin: {0} {1}", overlay.ToString(), versions.GetOverlayPluginLocation());
        LogInfo("FFXIV Plugin: {0} {1}", ffxiv.ToString(), versions.GetFFXIVPluginLocation());
        LogInfo("ACT: {0} {1}", act.ToString(), versions.GetACTLocation());
        if (language_ == null) {
          LogInfo("Language: {0}", "(unknown)");
        } else {
          LogInfo("Language: {0}", language_);
        }

        if (remote.Major == 0 && remote.Minor == 0) {
          var result = System.Windows.Forms.MessageBox.Show(Overlay,
            "Github error while checking Cactbot version. " +
            "Your current version is " + local + ".\n\n" +
            "Manually check for newer version now?",
            "Cactbot Manual Check",
            System.Windows.Forms.MessageBoxButtons.YesNo);
          if (result == System.Windows.Forms.DialogResult.Yes)
            System.Diagnostics.Process.Start(VersionChecker.kReleaseUrl);
        } else if (local < remote) {
          Version remote_seen_before = new Version(Config.RemoteVersionSeen);
          Config.RemoteVersionSeen = remote.ToString();

          string update_message = "There is a new version of Cactbot is available at: \n" +
            VersionChecker.kReleaseUrl + " \n\n" +
            "New version " + remote + " \n" +
            "Current version " + local;
          if (remote == remote_seen_before) {
            LogError(update_message);
          } else {
            var result = System.Windows.Forms.MessageBox.Show(Overlay,
              update_message + "\n\n" +
              "Get it now?",
              "Cactbot update available",
              System.Windows.Forms.MessageBoxButtons.YesNo);
            if (result == System.Windows.Forms.DialogResult.Yes)
              System.Diagnostics.Process.Start(VersionChecker.kReleaseUrl);
          }
          Config.RemoteVersionSeen = remote.ToString();
        }
      }

      string net_version_str = System.Diagnostics.FileVersionInfo.GetVersionInfo(typeof(int).Assembly.Location).ProductVersion;
      string[] net_version = net_version_str.Split('.');
      if (int.Parse(net_version[0]) < kRequiredNETVersionMajor || int.Parse(net_version[1]) < kRequiredNETVersionMinor)
        LogError("Requires .NET 4.6 or above. Using " + net_version_str);

      init_ = true;
      if (deferred_navigate_ != null) {
        this.Navigate(deferred_navigate_);
      }
    }

    public override void Dispose() {
      fast_update_timer_.Stop();
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead -= OnLogLineRead;
      base.Dispose();
    }

    public override void Navigate(string url) {
      if (!init_) {
        deferred_navigate_ = url;
        return;
      }

      // Wait for the fast timer to end before we proceed.
      fast_update_timer_semaphore_.Wait();

      // When we navigate, reset all state so that the newly loaded page can receive all updates.
      reset_notify_state_ = true;

      // We navigate only when the timer isn't running, as the browser window will disappear out
      // from under it. Once the navigation is done, the Browser is gone and we can run the timer
      // again.
      base.Navigate(url);
      fast_update_timer_semaphore_.Release();
    }

    private void OnLogLineRead(bool isImport, LogLineEventArgs args) {
      // isImport happens when somebody is importing old encounters and all the log lines are processed.
      // Don't need to send all of these to the overlay.
      if (isImport)
        return;
      log_lines_semaphore_.Wait();
      log_lines_.Add(args.logLine);
      log_lines_semaphore_.Release();
    }

    // This is called by the OverlayPlugin every 1s which is not often enough for us, so we
    // do our own update mechanism as well.
    protected override void Update() {
      if (ffxiv_ == null)
        Initialize();
      SendSlowRateEvents();
    }

    // Sends an event called |event_name| to javascript, with an event.detail that contains
    // the fields and values of the |detail| structure.
    public void DispatchToJS(JSEvent e) {
      // DispatchToJS can be called from multiple threads (both fast and main).
      // OverlayMessage also calls this, which can be on other threads as well.
      // Could consider adding per-thread builders in TLS to avoid a lock, but maybe overkill.
      lock (this.dispatch_lock_) {
        dispatch_string_builder_.Append("document.dispatchEvent(new CustomEvent('");
        dispatch_string_builder_.Append(e.EventName());
        dispatch_string_builder_.Append("', { detail: ");
        dispatch_serializer_.Serialize(dispatch_json_writer_, e);
        dispatch_string_builder_.Append(" }));");
        this.Overlay.Renderer.ExecuteScript(dispatch_string_builder_.ToString());
        dispatch_string_builder_.Clear();
      }
    }

    // Events that we want to update less often because they aren't are critical.
    private void SendSlowRateEvents() {
      // Handle startup and shutdown. And do not fire any events until the page has loaded and had a chance to
      // register its event handlers.
      //if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null || Overlay.Renderer.Browser.IsLoading)
      //  return;

      // NOTE: This function runs on a different thread that SendFastRateEvents(), so anything it calls needs to be thread-safe!
    }

    // Events that we want to update as soon as possible.  Return next time this should be called.
    private int SendFastRateEvents() {
      // Handle startup and shutdown. And do not fire any events until the page has loaded and had a chance to
      // register its event handlers.
      if (Overlay == null || Overlay.Renderer == null || Overlay.Renderer.Browser == null || Overlay.Renderer.Browser.IsLoading) {
        return kSlowTimerMilli;
      }

      if (reset_notify_state_)
        notify_state_ = new NotifyState();
      reset_notify_state_ = false;

      // Loading dance:
      // * wait for !CefBrowser::IsLoading.
      // * Execute JS in all overlays to wait for DOMContentReady and send back an event.
      // * When this OverlayMessage comes in, send back an onInitializeOverlay message.
      // * Overlays should load options from the provider user data dir in that message.
      // * As DOMContentReady happened, overlays should also construct themselves and attach to the DOM.
      // * Now, messages can be sent freely and everything is initialized.
      if (!notify_state_.added_dom_content_listener) {
        // Send this from C# so that overlays that are using non-cactbot html
        // (e.g. dps overlays) don't have to be modified.
        const string waitForDOMContentReady = @"
          (function() {
            var sendDOMContentLoaded = function() {
              if (!window.OverlayPluginApi) {
                window.setTimeout(sendDOMContentLoaded, 100);
              } else {
                window.OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({'onDOMContentLoaded': true}));
              }
            };
            if (document.readyState == 'loaded' || document.readyState == 'complete') {
              sendDOMContentLoaded();
            } else {
              document.addEventListener('DOMContentLoaded', sendDOMContentLoaded);
            }
          })();
        ";
        this.Overlay.Renderer.ExecuteScript(waitForDOMContentReady);
        notify_state_.added_dom_content_listener = true;
      }

      // This flag set as a result of onDOMContentLoaded overlay message.
      if (!notify_state_.dom_content_loaded) {
        return kSlowTimerMilli;
      }

      if (!notify_state_.sent_data_dir && Config.Url.Length > 0) {
        notify_state_.sent_data_dir = true;

        var url = Config.Url;
        // If file is a remote pointer, load that file explicitly so that the manifest
        // is relative to the pointed to url and not the local file.
        if (url.StartsWith("file:///")) {
          var html = File.ReadAllText(new Uri(url).LocalPath);
          var match = System.Text.RegularExpressions.Regex.Match(html, @"<meta http-equiv=""refresh"" content=""0; url=(.*)?""\/?>");
          if (match.Groups.Count > 1) {
            url = match.Groups[1].Value;
          }
        }

        var web = new System.Net.WebClient();
        web.Encoding = System.Text.Encoding.UTF8;
        System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Ssl3 | System.Net.SecurityProtocolType.Tls | System.Net.SecurityProtocolType.Tls11 | System.Net.SecurityProtocolType.Tls12;

        var data_file_paths = new List<string>();
        try {
          var data_dir_manifest = new Uri(new Uri(url), "data/manifest.txt");
          var manifest_reader = new StringReader(web.DownloadString(data_dir_manifest));
          for (var line = manifest_reader.ReadLine(); line != null; line = manifest_reader.ReadLine()) {
            line = line.Trim();
            if (line.Length > 0)
              data_file_paths.Add(line);
          }
        } catch (System.Net.WebException e) {
          if (e.Status == System.Net.WebExceptionStatus.ProtocolError &&
              e.Response is System.Net.HttpWebResponse &&
              ((System.Net.HttpWebResponse)e.Response).StatusCode == System.Net.HttpStatusCode.NotFound) {
            // Ignore file not found.
          } else if (e.InnerException != null &&
            (e.InnerException is FileNotFoundException || e.InnerException is DirectoryNotFoundException)) {
            // Ignore file not found.
          } else if (e.InnerException != null && e.InnerException.InnerException != null &&
            (e.InnerException.InnerException is FileNotFoundException || e.InnerException.InnerException is DirectoryNotFoundException)) {
            // Ignore file not found.
          } else {
            LogError("Unable to read manifest file: " + e.Message);
          }
        } catch (Exception e) {
          LogError("Unable to read manifest file: " + e.Message);
        }

        if (data_file_paths.Count > 0) {
          var file_data = new Dictionary<string, string>();
          foreach (string data_filename in data_file_paths) {
            try {
              var file_path = new Uri(new Uri(url), "data/" + data_filename);
              file_data[data_filename] = web.DownloadString(file_path);
            } catch (Exception e) {
              LogError("Unable to read data file: " + e.Message);
            }
          }
          OnDataFilesRead(new JSEvents.DataFilesRead(file_data));
        }
      }

      bool game_exists = ffxiv_.FindProcess();
      if (game_exists != notify_state_.game_exists) {
        notify_state_.game_exists = game_exists;
        OnGameExists(new JSEvents.GameExistsEvent(game_exists));
      }

      bool game_active = game_active = ffxiv_.IsActive();
      if (game_active != notify_state_.game_active) {
        notify_state_.game_active = game_active;
        OnGameActiveChanged(new JSEvents.GameActiveChangedEvent(game_active));
      }

      // Silently stop sending other messages if the ffxiv process isn't around.
      if (!game_exists) {
        return kUberSlowTimerMilli;
      }

      // onInCombatChangedEvent: Fires when entering or leaving combat.
      bool in_act_combat = FFXIV_ACT_Plugin.ACTWrapper.InCombat;
      bool in_game_combat = ffxiv_.GetInGameCombat();
      if (!notify_state_.in_act_combat.HasValue || in_act_combat != notify_state_.in_act_combat ||
          !notify_state_.in_game_combat.HasValue || in_game_combat != notify_state_.in_game_combat) {
        notify_state_.in_act_combat = in_act_combat;
        notify_state_.in_game_combat = in_game_combat;
        OnInCombatChanged(new JSEvents.InCombatChangedEvent(in_act_combat, in_game_combat));
      }

      // onZoneChangedEvent: Fires when the player changes their current zone.
      string zone_name = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone;
      if (notify_state_.zone_name == null || !zone_name.Equals(notify_state_.zone_name)) {
        notify_state_.zone_name = zone_name;
        OnZoneChanged(new JSEvents.ZoneChangedEvent(zone_name));
      }

      DateTime now = DateTime.Now;
      // The |player| can be null, such as during a zone change.
      Tuple<FFXIVProcess.EntityData, FFXIVProcess.SpellCastingData> player_data = ffxiv_.GetSelfData();
      var player = player_data != null ? player_data.Item1 : null;
      var player_cast = player_data != null ? player_data.Item2 : null;
      // The |target| can be null when no target is selected.
      Tuple<FFXIVProcess.EntityData, FFXIVProcess.SpellCastingData> target_data = ffxiv_.GetTargetData();
      var target = target_data != null ? target_data.Item1 : null;
      var target_cast = target_data != null ? target_data.Item2 : null;
      // The |focus| can be null when no focus target is selected.
      Tuple<FFXIVProcess.EntityData, FFXIVProcess.SpellCastingData> focus_data = ffxiv_.GetFocusData();
      var focus = focus_data != null ? focus_data.Item1 : null;
      var focus_cast = focus_data != null ? focus_data.Item2 : null;

      // onPlayerDiedEvent: Fires when the player dies. All buffs/debuffs are
      // lost.
      if (player != null) {
        bool dead = player.hp == 0;
        if (dead != notify_state_.dead) {
          notify_state_.dead = dead;
          if (dead)
            OnPlayerDied(new JSEvents.PlayerDiedEvent());
        }
      }

      // onPlayerChangedEvent: Fires when current player data changes.
      if (player != null) {
        bool send = false;
        if (player != notify_state_.player) {
          notify_state_.player = player;
          send = true;
        }

        if (player.job == FFXIVProcess.EntityJob.RDM) {
          var job = ffxiv_.GetRedMage();
          if (job != null) {
            if (send || !job.Equals(notify_state_.rdm)) {
              notify_state_.rdm = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.RedMageDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.WAR) {
          var job = ffxiv_.GetWarrior();
          if (job != null) {
            if (send || !job.Equals(notify_state_.war)) {
              notify_state_.war = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.WarriorDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.DRK) {
          var job = ffxiv_.GetDarkKnight();
          if (job != null) {
            if (send || !job.Equals(notify_state_.drk)) {
              notify_state_.drk = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.DarkKnightDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.PLD) {
          var job = ffxiv_.GetPaladin();
          if (job != null) {
            if (send || !job.Equals(notify_state_.pld)) {
              notify_state_.pld = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.PaladinDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.BRD) {
          var job = ffxiv_.GetBard();
          if (job != null) {
            if (send || !job.Equals(notify_state_.brd)) {
              notify_state_.brd = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.BardDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.NIN) {
          var job = ffxiv_.GetNinja();
          if (job != null) {
            if (send || !job.Equals(notify_state_.nin)) {
              notify_state_.nin = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.NinjaDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.DRG) {
          var job = ffxiv_.GetDragoon();
          if (job != null) {
            if (send || !job.Equals(notify_state_.drg)) {
              notify_state_.drg = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.DragoonDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.BLM || player.job == FFXIVProcess.EntityJob.THM) {
          var job = ffxiv_.GetBlackMage();
          if (job != null) {
            if (send || !job.Equals(notify_state_.blm)) {
              notify_state_.blm = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.BlackMageDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.WHM) {
          var job = ffxiv_.GetWhiteMage();
          if (job != null) {
            if (send || !job.Equals(notify_state_.whm)) {
              notify_state_.whm = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.WhiteMageDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.SMN || player.job == FFXIVProcess.EntityJob.SCH || player.job == FFXIVProcess.EntityJob.ACN) {
          var job = ffxiv_.GetSummonerAndScholar();
          if (job != null) {
            if (send || !job.Equals(notify_state_.smn_sch)) {
              notify_state_.smn_sch = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.SummonerAndScholarDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.MNK || player.job == FFXIVProcess.EntityJob.PGL) {
          var job = ffxiv_.GetMonk();
          if (job != null) {
            if (send || !job.Equals(notify_state_.mnk)) {
              notify_state_.mnk = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.MonkDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.MCH) {
          var job = ffxiv_.GetMachinist();
          if (job != null) {
            if (send || !job.Equals(notify_state_.mch)) {
              notify_state_.mch = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.MachinistDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (player.job == FFXIVProcess.EntityJob.AST) {
          var job = ffxiv_.GetAstrologian();
          if (job != null) {
            if (send || !job.Equals(notify_state_.ast)) {
              notify_state_.ast = job;
              var e = new JSEvents.PlayerChangedEvent(player);
              e.jobDetail = new JSEvents.PlayerChangedEvent.AstrologianDetail(job);
              OnPlayerChanged(e);
            }
          }
        } else if (send) {
          // TODO: SAM everything
          // No job-specific data.
          OnPlayerChanged(new JSEvents.PlayerChangedEvent(player));
        }
      }

      // onTargetChangedEvent: Fires when current target or their state changes.
      if (target != notify_state_.target) {
        notify_state_.target = target;
        if (target != null)
          OnTargetChanged(new JSEvents.TargetChangedEvent(target));
        else
          OnTargetChanged(new JSEvents.TargetChangedEvent(null));
      }

      // onTargetCastingEvent: Fires each tick while the target is casting, and once
      // with null when not casting.
      int target_cast_id = target_cast != null ? target_cast.casting_id : 0;
      if (target_cast_id != 0 || target_cast_id != notify_state_.target_cast_id) {
        notify_state_.target_cast_id = target_cast_id;
        // The game considers things to be casting once progress reaches the end for a while, as the server is
        // resolving lag or something. That breaks our start time tracking, so we just don't consider them to
        // be casting anymore once it reaches the end.
        if (target_cast_id != 0 && target_cast.casting_time_progress < target_cast.casting_time_length) {
          DateTime start = now.AddSeconds(-target_cast.casting_time_progress);
          // If the start is within the timer interval, assume it's the same cast. Since we sample the game
          // at a different rate than it ticks, there will be some jitter in the progress that we see, and this
          // helps avoid it.
          TimeSpan range = new TimeSpan(0, 0, 0, 0, kFastTimerMilli);
          if (start + range < notify_state_.target_cast_start || start - range > notify_state_.target_cast_start)
            notify_state_.target_cast_start = start;
          TimeSpan progress = now - notify_state_.target_cast_start;
          OnTargetCasting(new JSEvents.TargetCastingEvent(target_cast.casting_id, progress.TotalSeconds, target_cast.casting_time_length));
        } else {
          notify_state_.target_cast_start = new DateTime();
          OnTargetCasting(new JSEvents.TargetCastingEvent(0, 0, 0));
        }
      }

      // onFocusChangedEvent: Fires when current focus target or their state changes.
      if (focus != notify_state_.focus) {
        notify_state_.focus = focus;
        if (target != null)
          OnFocusChanged(new JSEvents.FocusChangedEvent(focus));
        else
          OnFocusChanged(new JSEvents.FocusChangedEvent(null));
      }

      // onFocusCastingEvent: Fires each tick while the focus target is casting, and
      // once with null when not casting.
      int focus_cast_id = focus_cast != null ? focus_cast.casting_id : 0;
      if (focus_cast_id != 0 || focus_cast_id != notify_state_.focus_cast_id) {
        notify_state_.focus_cast_id = focus_cast_id;
        // The game considers things to be casting once progress reaches the end for a while, as the server is
        // resolving lag or something. That breaks our start time tracking, so we just don't consider them to
        // be casting anymore once it reaches the end.
        if (focus_cast_id != 0 && focus_cast.casting_time_progress < focus_cast.casting_time_length) {
          DateTime start = now.AddSeconds(-focus_cast.casting_time_progress);
          // If the start is within the timer interval, assume it's the same cast. Since we sample the game
          // at a different rate than it ticks, there will be some jitter in the progress that we see, and this
          // helps avoid it.
          TimeSpan range = new TimeSpan(0, 0, 0, 0, kFastTimerMilli);
          if (start + range < notify_state_.focus_cast_start || start - range > notify_state_.focus_cast_start)
            notify_state_.focus_cast_start = start;
          TimeSpan progress = now - notify_state_.focus_cast_start;
          OnFocusCasting(new JSEvents.FocusCastingEvent(focus_cast.casting_id, progress.TotalSeconds, focus_cast.casting_time_length));
        } else {
          notify_state_.focus_cast_start = new DateTime();
          OnFocusCasting(new JSEvents.FocusCastingEvent(0, 0, 0));
        }
      }

      // onLogEvent: Fires when new combat log events from FFXIV are available. This fires after any
      // more specific events, some of which may involve parsing the logs as well.
      List<string> logs;
      log_lines_semaphore_.Wait();
      logs = log_lines_;
      log_lines_ = last_log_lines_;
      log_lines_semaphore_.Release();
      if (logs.Count > 0) {
        OnLogsChanged(new JSEvents.LogEvent(logs));
        logs.Clear();
      }
      last_log_lines_ = logs;

      fight_tracker_.Tick(DateTime.Now);

      return game_active ? kFastTimerMilli : kSlowTimerMilli;
    }

    // ILogger implementation.
    public void LogDebug(string format, params object[] args) {
      // The Log() method is not threadsafe. Since this is called from Timer threads,
      // it must post the task to the plugin main thread.
      main_thread_sync_.Post(
        (state) => { this.Log(LogLevel.Debug, format, args); },
        null);
    }
    public void LogError(string format, params object[] args) {
      // The Log() method is not threadsafe. Since this is called from Timer threads,
      // it must post the task to the plugin main thread.
      main_thread_sync_.Post(
        (state) => { this.Log(LogLevel.Error, format, args); },
        null);
    }
    public void LogWarning(string format, params object[] args) {
      // The Log() method is not threadsafe. Since this is called from Timer threads,
      // it must post the task to the plugin main thread.
      main_thread_sync_.Post(
        (state) => { this.Log(LogLevel.Warning, format, args); },
        null);
    }
    public void LogInfo(string format, params object[] args) {
      // The Log() method is not threadsafe. Since this is called from Timer threads,
      // it must post the task to the plugin main thread.
      main_thread_sync_.Post(
        (state) => { this.Log(LogLevel.Info, format, args); },
        null);
    }

    private Dictionary<string, string> GetLocalUserFiles(string config_dir) {
      if (config_dir == null || config_dir == "")
        return null;

      // TODO: It's not great to have to load every js and css file in the user dir.
      // But most of the time they'll be short and there won't be many.  JS
      // could attempt to send an overlay name to C# code (and race with the
      // document ready event), but that's probably overkill.
      var user_files = new Dictionary<string, string>();
      string path;
      try {
        path = new Uri(config_dir).LocalPath;
      } catch (UriFormatException) {
        // This can happen e.g. "http://localhost:8000".  Thanks, Uri constructor.  /o\
        return null;
      }

      // It's important to return null here vs an empty dictionary.  null here
      // indicates to attempt to load the user overloads indirectly via the path.
      // This is how remote user directories work.
      try {
        if (!Directory.Exists(path)) {
          return null;
        }
      } catch (Exception e) {
        LogError("Error checking directory: {0}", e.ToString());
        return null;
      }

      try {
        var filenames = Directory.EnumerateFiles(path, "*.js").Concat(
          Directory.EnumerateFiles(path, "*.css"));
        foreach (string filename in filenames) {
          if (filename.Contains("-example."))
            continue;
          user_files[Path.GetFileName(filename)] = File.ReadAllText(filename);
        }
      } catch (Exception e) {
        LogError("User error file exception: {0}", e.ToString());
      }

      return user_files;
    }

    private void GetUserConfigDirAndFiles(out string config_dir, out Dictionary<string, string> local_files) {
      local_files = null;
      config_dir = null;

      if (Config.UserConfigFile != null && Config.UserConfigFile != "") {
        // Explicit user config directory specified.
        config_dir = Config.UserConfigFile;
        local_files = GetLocalUserFiles(config_dir);
      } else {
        if (Config.Url != null && Config.Url != "") {
          // First try a user directory relative to the html.
          try {
            var url_dir = Path.GetDirectoryName(new Uri(Config.Url).LocalPath);
            config_dir = Path.GetFullPath(url_dir + "\\..\\..\\user\\");
            local_files = GetLocalUserFiles(config_dir);
          } catch (Exception e) {
            LogError("Error checking html rel dir: {0}: {1}", Config.Url, e.ToString());
            config_dir = null;
            local_files = null;
          }
        }
        if (local_files == null) {
          // Second try a user directory relative to the dll.
          try {
            config_dir = Path.GetFullPath(CactbotOverlayConfig.CactbotDllRelativeUserUri);
            local_files = GetLocalUserFiles(config_dir);
          } catch (Exception e) {
            LogError("Error checking dll rel dir: {0}: {1}", CactbotOverlayConfig.CactbotDllRelativeUserUri, e.ToString());
            config_dir = null;
            local_files = null;
          }
        }
      }
    }

    // This is an overlayMessage() function call from javascript. We accept a json object of
    // (command, argument) pairs. Commands are:
    // - say: The argument is a string which is read as text-to-speech.
    public override void OverlayMessage(string message) {
      var reader = new JsonTextReader(new StringReader(message));
      var obj = message_serializer_.Deserialize<Dictionary<string, string>>(reader);
      if (obj.ContainsKey("say")) {
        Advanced_Combat_Tracker.ActGlobals.oFormActMain.TTS(obj["say"]);
      } else if (obj.ContainsKey("getSaveData")) {
        DispatchToJS(new JSEvents.SendSaveData(Config.OverlayData));
      } else if (obj.ContainsKey("setSaveData")) {
        Config.OverlayData = obj["setSaveData"];
      } else if (obj.ContainsKey("onDOMContentLoaded")) {
        Dictionary<string, string> local_files;
        string config_dir;
        GetUserConfigDirAndFiles(out config_dir, out local_files);
        DispatchToJS(new JSEvents.OnInitializeOverlay(config_dir, local_files, language_));
        notify_state_.dom_content_loaded = true;
      }
    }

    // State that is tracked and sent to JS when it changes.
    private class NotifyState {
      public bool added_dom_content_listener = false;
      public bool dom_content_loaded = false;
      public bool sent_data_dir = false;
      public bool game_exists = false;
      public bool game_active = false;
      public bool? in_act_combat;
      public bool? in_game_combat;
      public bool dead = false;
      public string zone_name = null;
      public FFXIVProcess.EntityData player = null;
      public FFXIVProcess.RedMageJobData rdm = new FFXIVProcess.RedMageJobData();
      public FFXIVProcess.WarriorJobData war = new FFXIVProcess.WarriorJobData();
      public FFXIVProcess.DarkKnightJobData drk = new FFXIVProcess.DarkKnightJobData();
      public FFXIVProcess.PaladinJobData pld = new FFXIVProcess.PaladinJobData();
      public FFXIVProcess.BardJobData brd = new FFXIVProcess.BardJobData();
      public FFXIVProcess.NinjaJobData nin = new FFXIVProcess.NinjaJobData();
      public FFXIVProcess.BlackMageJobData blm = new FFXIVProcess.BlackMageJobData();
      public FFXIVProcess.WhiteMageJobData whm = new FFXIVProcess.WhiteMageJobData();
      public FFXIVProcess.SummonerAndScholarJobData smn_sch = new FFXIVProcess.SummonerAndScholarJobData();
      public FFXIVProcess.MonkJobData mnk = new FFXIVProcess.MonkJobData();
      public FFXIVProcess.MachinistJobData mch = new FFXIVProcess.MachinistJobData();
      public FFXIVProcess.AstrologianJobData ast = new FFXIVProcess.AstrologianJobData();
      public FFXIVProcess.DragoonJobData drg = new FFXIVProcess.DragoonJobData();
      public FFXIVProcess.EntityData target = null;
      public FFXIVProcess.EntityData focus = null;
      public int target_cast_id = 0;
      public DateTime target_cast_start = new DateTime();
      public int focus_cast_id = 0;
      public DateTime focus_cast_start = new DateTime();
    }
    private NotifyState notify_state_ = new NotifyState();
  }

}  // namespace Cactbot
