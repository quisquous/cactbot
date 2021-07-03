using Advanced_Combat_Tracker;
using Newtonsoft.Json.Linq;
using RainbowMage.HtmlRenderer;
using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Windows.Forms;
using CactbotEventSource.loc;

namespace Cactbot {

  // TODO: remove this in favor of the rainbowmage ilogger
  public interface ILogger {
    void LogDebug(string format, params object[] args);
    void LogError(string format, params object[] args);
    void LogWarning(string format, params object[] args);
    void LogInfo(string format, params object[] args);
  }


  public class CactbotEventSource : EventSourceBase, ILogger {
    public CactbotEventSourceConfig Config { get; private set; }

    private static int kFastTimerMilli = 16;
    private static int kSlowTimerMilli = 300;
    private static int kUberSlowTimerMilli = 3000;
    private static int kRequiredNETVersionMajor = 4;
    private static int kRequiredNETVersionMinor = 6;

    private SemaphoreSlim log_lines_semaphore_ = new SemaphoreSlim(1);
    // Not thread-safe, as OnLogLineRead may happen at any time. Use |log_lines_semaphore_| to access it.
    private List<string> log_lines_ = new List<string>(40);
    private List<string> import_log_lines_ = new List<string>(40);
    // Used on the fast timer to avoid allocing List every time.
    private List<string> last_log_lines_ = new List<string>(40);
    private List<string> last_import_log_lines_ = new List<string>(40);

    // When true, the update function should reset notify state back to defaults.
    private bool reset_notify_state_ = false;

    private System.Timers.Timer fast_update_timer_;
    // Held while the |fast_update_timer_| is running.
    private FFXIVProcess ffxiv_;
    private WipeDetector wipe_detector_;
    private FateWatcher fate_watcher_;

    private string language_ = null;
    private string pc_locale_ = null;

    public delegate void ForceReloadHandler(JSEvents.ForceReloadEvent e);
    public event ForceReloadHandler OnForceReload;

    public delegate void GameExistsHandler(JSEvents.GameExistsEvent e);
    public event GameExistsHandler OnGameExists;

    public delegate void GameActiveChangedHandler(JSEvents.GameActiveChangedEvent e);
    public event GameActiveChangedHandler OnGameActiveChanged;

    public delegate void ZoneChangedHandler(JSEvents.ZoneChangedEvent e);
    public event ZoneChangedHandler OnZoneChanged;

    public delegate void PlayerChangedHandler(JSEvents.PlayerChangedEvent e);
    public event PlayerChangedHandler OnPlayerChanged;

    public delegate void LogHandler(JSEvents.LogEvent e);
    public event LogHandler OnLogsChanged;

    public delegate void ImportLogHandler(JSEvents.ImportLogEvent e);
    public event ImportLogHandler OnImportLogsChanged;

    public delegate void InCombatChangedHandler(JSEvents.InCombatChangedEvent e);
    public event InCombatChangedHandler OnInCombatChanged;

    public delegate void PlayerDiedHandler(JSEvents.PlayerDiedEvent e);
    public event PlayerDiedHandler OnPlayerDied;

    public delegate void PartyWipeHandler(JSEvents.PartyWipeEvent e);
    public event PartyWipeHandler OnPartyWipe;

    public delegate void FateEventHandler(JSEvents.FateEvent e);
    public event FateEventHandler OnFateEvent;

    public delegate void CEEventHandler(JSEvents.CEEvent e);
    public event CEEventHandler OnCEEvent;

    public void Wipe() {
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.EndCombat(false);
      OnPartyWipe(new JSEvents.PartyWipeEvent());
    }

    public void DoFateEvent(JSEvents.FateEvent e) {
      OnFateEvent(e);
    }

    public void DoCEEvent(JSEvents.CEEvent e) {
      OnCEEvent(e);
    }

    public CactbotEventSource(RainbowMage.OverlayPlugin.ILogger logger)
        : base(logger) {
      Name = "Cactbot";

      RegisterPresets();

      RegisterEventTypes(new List<string>()
      {
        "onForceReload",
        "onGameExistsEvent",
        "onGameActiveChangedEvent",
        "onLogEvent",
        "onImportLogEvent",
        "onInCombatChangedEvent",
        "onZoneChangedEvent",
        "onFateEvent",
        "onCEEvent",
        "onPlayerDied",
        "onPartyWipe",
        "onPlayerChangedEvent",
        "onUserFileChanged",
      });

      // Broadcast onConfigChanged when a cactbotNotifyConfigChanged message occurs.
      RegisterEventHandler("cactbotReloadOverlays", (msg) => {
        OnForceReload(new JSEvents.ForceReloadEvent());
        return null;
      });
      RegisterEventHandler("cactbotLoadUser", FetchUserFiles);
      RegisterEventHandler("cactbotRequestPlayerUpdate", (msg) => {
        notify_state_.player = null;
        return null;
      });
      RegisterEventHandler("cactbotRequestState", (msg) => {
        reset_notify_state_ = true;
        return null;
      });
      RegisterEventHandler("cactbotSay", (msg) => {
        Advanced_Combat_Tracker.ActGlobals.oFormActMain.TTS(msg["text"].ToString());
        return null;
      });
      RegisterEventHandler("cactbotSaveData", (msg) => {
        Config.OverlayData[msg["overlay"].ToString()] = msg["data"];
        return null;
      });
      RegisterEventHandler("cactbotLoadData", (msg) => {
        if (Config.OverlayData.ContainsKey(msg["overlay"].ToString())) {
          var ret = new JObject();
          ret["data"] = Config.OverlayData[msg["overlay"].ToString()];
          return ret;
        } else {
          return null;
        }
      });
      RegisterEventHandler("cactbotChooseDirectory", (msg) => {
        var ret = new JObject();
        string data = (string)ActGlobals.oFormActMain.Invoke((ChooseDirectoryDelegate)ChooseDirectory);
        if (data != null)
          ret["data"] = data;
        return ret;
      });
    }

    private delegate string ChooseDirectoryDelegate();

    private string ChooseDirectory() {
      FolderBrowserDialog dialog = new FolderBrowserDialog();
      DialogResult result = dialog.ShowDialog(ActGlobals.oFormActMain);
      if (result != DialogResult.OK)
        return null;
      return dialog.SelectedPath;
    }

    public override System.Windows.Forms.Control CreateConfigControl()
    {
      var control = new OverlayControl();
      var initDone = false;

      var configFile = "ui/config/config.html";
      var distFolder = "dist/";
      var dir = new VersionChecker(this).GetCactbotDirectory();
      var url = Path.GetFullPath(Path.Combine(dir, distFolder, configFile));
      // Attempt to use the local webpack override, otherwise fall back to default path
      if (!File.Exists(url))
        url = Path.GetFullPath(Path.Combine(dir, configFile));

      control.VisibleChanged += (o, e) => {
        if (initDone)
          return;
        initDone = true;
        control.Init(url);
        MinimalApi.AttachTo(control.Renderer);
      };
      return control;
    }

    public override void LoadConfig(IPluginConfig config)
    {
      Config = CactbotEventSourceConfig.LoadConfig(config, logger);
      if (Config.OverlayData == null)
        Config.OverlayData = new Dictionary<string, JToken>();
    }

    public override void SaveConfig(IPluginConfig config)
    {
      Config.SaveConfig(config);
    }

    public override void Start() {
      // Our own timer with a higher frequency than OverlayPlugin since we want to see
      // the effect of log messages quickly.
      fast_update_timer_ = new System.Timers.Timer();
      fast_update_timer_.Elapsed += (o, args) => {
        int timer_interval = kSlowTimerMilli;
        try {
          timer_interval = SendFastRateEvents();
        } catch (Exception e) {
          // SendFastRateEvents holds this semaphore until it exits.
          LogError(Strings.SendFastRateEventsException, e.Message);
          LogError(Strings.Stack, e.StackTrace);
          LogError(Strings.Source, e.Source);
        }
        fast_update_timer_.Interval = timer_interval;
      };
      fast_update_timer_.AutoReset = false;

      FFXIVPlugin plugin_helper = new FFXIVPlugin(this);
      language_ = plugin_helper.GetLocaleString();
      pc_locale_ = System.Globalization.CultureInfo.CurrentUICulture.Name;

      var versions = new VersionChecker(this);
      Version local = versions.GetCactbotVersion();

      Version overlay = versions.GetOverlayPluginVersion();
      Version ffxiv = versions.GetFFXIVPluginVersion();
      Version act = versions.GetACTVersion();

      // Print out version strings and locations to help users debug.
      LogInfo(Strings.CactbotBaseInfo, local.ToString(), versions.GetCactbotPluginLocation(), versions.GetCactbotDirectory());
      LogInfo(Strings.OverlayPluginBaseInfo, overlay.ToString(), versions.GetOverlayPluginLocation());
      LogInfo(Strings.FFXIVPluginBaseInfo, ffxiv.ToString(), versions.GetFFXIVPluginLocation());
      LogInfo(Strings.ACTBaseInfo, act.ToString(), versions.GetACTLocation());
      if (language_ == null) {
        LogInfo(Strings.ParsingPluginLanguage, "(unknown)");
      } else {
        LogInfo(Strings.ParsingPluginLanguage, language_);
      }
      if (pc_locale_ == null) {
        LogInfo(Strings.SystemLocale, "(unknown)");
      } else {
        LogInfo(Strings.SystemLocale, pc_locale_);
      }

      // This will be set explicitly, so if it's not set now, it will be set after reloading ACT.
      // Log this for now as there will likely be a lot of questions, re: user directories.
      if (Config.UserConfigFile != null)
        LogInfo(Strings.CactbotUserDirectory, Config.UserConfigFile);

      // Temporarily target cn if plugin is old v2.0.4.0
      if (language_ == "cn" || ffxiv.ToString() == "2.0.4.0") {
        ffxiv_ = new FFXIVProcessCn(this);
        LogInfo(Strings.Version, "cn");
      } else if (language_ == "ko") {
        ffxiv_ = new FFXIVProcessKo(this);
        LogInfo(Strings.Version, "ko");
      } else {
        ffxiv_ = new FFXIVProcessIntl(this);
        LogInfo(Strings.Version, "intl");
      }
      wipe_detector_ = new WipeDetector(this);
      fate_watcher_ = new FateWatcher(this, language_);

      // Incoming events.
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;

      // Outgoing JS events.
      OnForceReload += (e) => DispatchToJS(e);
      OnGameExists += (e) => DispatchToJS(e);
      OnGameActiveChanged += (e) => DispatchToJS(e);
      OnZoneChanged += (e) => DispatchToJS(e);
      OnLogsChanged += (e) => DispatchToJS(e);
      OnImportLogsChanged += (e) => DispatchToJS(e);
      OnPlayerChanged += (e) => DispatchToJS(e);
      OnInCombatChanged += (e) => DispatchToJS(e);
      OnPlayerDied += (e) => DispatchToJS(e);
      OnPartyWipe += (e) => DispatchToJS(e);
      OnFateEvent += (e) => DispatchToJS(e);
      OnCEEvent += (e) => DispatchToJS(e);

      fast_update_timer_.Interval = kFastTimerMilli;
      fast_update_timer_.Start();
      fate_watcher_.Start();

      string net_version_str = System.Diagnostics.FileVersionInfo.GetVersionInfo(typeof(int).Assembly.Location).ProductVersion;
      string[] net_version = net_version_str.Split('.');
      if (int.Parse(net_version[0]) < kRequiredNETVersionMajor || int.Parse(net_version[1]) < kRequiredNETVersionMinor)
        LogError(Strings.RequireDotNetVersion, net_version_str);

      versions.DoUpdateCheck(Config);
    }

    public override void Stop() {
      fast_update_timer_.Stop();
      fate_watcher_.Stop();
      Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead -= OnLogLineRead;
    }

    protected override void Update()
    {
        // Nothing to do since this is handled in SendFastRateEvents.
    }

    private void OnLogLineRead(bool isImport, LogLineEventArgs args) {
      log_lines_semaphore_.Wait();
      if (isImport)
        import_log_lines_.Add(args.logLine);
      else
        log_lines_.Add(args.logLine);
      log_lines_semaphore_.Release();
    }

    // Sends an event called |event_name| to javascript, with an event.detail that contains
    // the fields and values of the |detail| structure.
    public void DispatchToJS(JSEvent e) {
      JObject ev = new JObject();
      ev["type"] = e.EventName();
      ev["detail"] = JObject.FromObject(e);
      DispatchEvent(ev);
    }

    public void ClearFateWatcherDictionaries() {
      fate_watcher_.RemoveAndClearCEs();
      fate_watcher_.RemoveAndClearFates();
    }

    // Events that we want to update as soon as possible.  Return next time this should be called.
    private int SendFastRateEvents() {
      if (reset_notify_state_)
        notify_state_ = new NotifyState();
      reset_notify_state_ = false;

      // Loading dance:
      // * OverlayPlugin loads addons and initializes event sources.
      // * OverlayPlugin loads its configuration.
      // * Event sources are told to load their configuration and start (LoadConfig and Start are called).
      // * Overlays are initialised and the browser instances are started. At this points the overlays start loading.
      // * At some point the overlay's JavaScript is executed and OverlayPluginApi is injected. This order isn't
      //   deterministic and depends on what the ACT process is doing at that point in time. During startup the
      //   OverlayPluginApi is usually injected after the overlay is done loading while an overlay that's reloaded or
      //   loaded later on will see the OverlayPluginApi before the page has loaded.
      // * The overlay JavaScript sets up the initial event handlers and calls the cactbotLoadUser handler through
      //   getUserConfigLocation. These actions are queued by the JS implementation in overlay_plugin_api.js until OverlayPluginApi
      //   (or the WebSocket) is available. Once it is, the event subscriptions and handler calls are transmitted.
      // * OverlayPlugin stores the event subscriptions and executes the C# handlers which in this case means
      //   FetchUserFiles is called. That method loads the user files and returns them. The result is now transmitted
      //   back to the overlay that called the handler and the Promise in JS is resolved with the result.
      // * getUserConfigLocation processes the received information and calls the passed callback. This constructs the
      //   overlay specific objects and registers additional event handlers. Finally, the cactbotRequestState handler
      //   is called.
      // * OverlayPlugin processes the new event subscriptions and executes the cactbotRequestState handler.
      // * The next time SendFastRateEvents is called, it resets notify_state_ (since the previous handler set
      //   reset_notify_state_ to true) which causes it to dispatch all state events again. These events are now
      //   dispatched to all subscribed overlays. However, this means that overlays can receive state events multiple
      //   times during startup. If the user has three Cactbot overlays, all of them will call cactbotRequestState and
      //   thus cause this to happen one to three times depending on their timing. This shouldn't cause any issues but
      //   it's a waste of CPU cycles.
      // * Since this only happens during startup, it's probably not worth fixing though. Not sure.

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
      bool in_act_combat = Advanced_Combat_Tracker.ActGlobals.oFormActMain.InCombat;
      bool in_game_combat = ffxiv_.GetInGameCombat();
      if (!notify_state_.in_act_combat.HasValue || in_act_combat != notify_state_.in_act_combat ||
          !notify_state_.in_game_combat.HasValue || in_game_combat != notify_state_.in_game_combat) {
        notify_state_.in_act_combat = in_act_combat;
        notify_state_.in_game_combat = in_game_combat;
        OnInCombatChanged(new JSEvents.InCombatChangedEvent(in_act_combat, in_game_combat));
      }

      // onZoneChangedEvent: Fires when the player changes their current zone.
      string zone_name = Advanced_Combat_Tracker.ActGlobals.oFormActMain.CurrentZone;
      if (notify_state_.zone_name == null || !zone_name.Equals(notify_state_.zone_name)) {
        notify_state_.zone_name = zone_name;
        OnZoneChanged(new JSEvents.ZoneChangedEvent(zone_name));
        ClearFateWatcherDictionaries();
      }

      DateTime now = DateTime.Now;
      // The |player| can be null, such as during a zone change.
      FFXIVProcess.EntityData player = ffxiv_.GetSelfData();

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
        if (!player.Equals(notify_state_.player)) {
          // Clear the FateWatcher dictionaries if we switched characters
          if (notify_state_.player != null && !player.name.Equals(notify_state_.player.name))
            ClearFateWatcherDictionaries();
          notify_state_.player = player;
          send = true;
        }
        var job = ffxiv_.GetJobSpecificData(player.job);
        if (job != null) {
          if (send || !JObject.DeepEquals(job, notify_state_.job_data)) {
            notify_state_.job_data = job;
            var e = new JSEvents.PlayerChangedEvent(player);
            e.jobDetail = job;
            OnPlayerChanged(e);
          }
        } else if (send) {
          // No job-specific data.
          OnPlayerChanged(new JSEvents.PlayerChangedEvent(player));
        }
      }

      // onLogEvent: Fires when new combat log events from FFXIV are available. This fires after any
      // more specific events, some of which may involve parsing the logs as well.
      List<string> logs;
      List<string> import_logs;
      log_lines_semaphore_.Wait();
      logs = log_lines_;
      log_lines_ = last_log_lines_;
      import_logs = import_log_lines_;
      import_log_lines_ = last_import_log_lines_;
      log_lines_semaphore_.Release();

      if (logs.Count > 0) {
        OnLogsChanged(new JSEvents.LogEvent(logs));
        logs.Clear();
      }
      if (import_logs.Count > 0) {
        OnImportLogsChanged(new JSEvents.ImportLogEvent(import_logs));
        import_logs.Clear();
      }

      last_log_lines_ = logs;
      last_import_log_lines_ = import_logs;

      return game_active ? kFastTimerMilli : kSlowTimerMilli;
    }

    // ILogger implementation.
    public void LogDebug(string format, params object[] args) {
      this.Log(LogLevel.Debug, format, args);
    }
    public void LogError(string format, params object[] args) {
      this.Log(LogLevel.Error, format, args);
    }
    public void LogWarning(string format, params object[] args) {
      this.Log(LogLevel.Warning, format, args);
    }
    public void LogInfo(string format, params object[] args) {
      this.Log(LogLevel.Info, format, args);
    }

    private static string GetRelativePath(string top_dir, string filename) {
      // TODO: .net 5.0 / .net core 2.0 has Path.GetRelativePath.
      // There's also a win api function we could call, but that's a bit gross.
      // However, this is an easy case where filename is known to be rooted in top_dir,
      // so use this hacky solution for now.  Hi, ngld.
      string initial = filename;
      filename = filename.Replace(top_dir, "");
      // top_dir may or may not have a trailing slash, so remove that as well.
      // user_config.js expects filenames to not have a beginning slash.
      while (filename[0] == '\\' || filename[0] == '/')
        filename = filename.Substring(1);
      return filename;
    }

    private Dictionary<string, string> GetLocalUserFiles(string config_dir, string overlay_name) {
      // TODO: probably should sanity check overlay_name for no * or ? wildcards as well
      // as GetInvalidPathChars.
      if (String.IsNullOrEmpty(config_dir))
        return null;

      var user_files = new Dictionary<string, string>();
      string top_dir;
      string sub_dir = null;
      try {
        top_dir = new Uri(config_dir).LocalPath;
      } catch (UriFormatException) {
        // This can happen e.g. "http://localhost:8000".  Thanks, Uri constructor.  /o\
        return null;
      }

      // Returning null here means we failed to find anything meaningful (or error), and so try
      // again with a different directory.  In the future when this is in OverlayPlugin, we will
      // probably just abort entirely.
      try {
        if (!Directory.Exists(top_dir)) {
          return null;
        }

        if (overlay_name != null) {
          sub_dir = Path.Combine(top_dir, overlay_name);
          if (!Directory.Exists(sub_dir))
            sub_dir = null;
         }

      } catch (Exception e) {
        LogError(Strings.CheckDirectoryErrorMessage, e.ToString());
        return null;
      }

      // Hack for backwards compat with older js that doesn't provide overlay_name,
      // just in case.  Remove this in any future version and require overlay_name.
      if (overlay_name == null)
        overlay_name = "*";

      try {
        var filenames = Directory.EnumerateFiles(top_dir, $"{overlay_name}.js").Concat(
          Directory.EnumerateFiles(top_dir, $"{overlay_name}.css"));
        if (sub_dir != null) {
          filenames = filenames.Concat(
            Directory.EnumerateFiles(sub_dir, "*.js", SearchOption.AllDirectories)).Concat(
            Directory.EnumerateFiles(sub_dir, "*.css", SearchOption.AllDirectories));
        }
        foreach (string filename in filenames) {
          user_files[GetRelativePath(top_dir, filename)] = File.ReadAllText(filename) +
            $"\n//# sourceURL={filename}";
        }

        var textFilenames = Directory.EnumerateFiles(top_dir, "*.txt");
        if (sub_dir != null) {
          textFilenames = textFilenames.Concat(Directory.EnumerateFiles(sub_dir, "*.txt", SearchOption.AllDirectories));
        }
        foreach (string filename in textFilenames) {
          user_files[GetRelativePath(top_dir, filename)] = File.ReadAllText(filename);
        }
      } catch (Exception e) {
        LogError(Strings.UserErrorFileException, e.ToString());
      }

      return user_files;
    }

    private void GetUserConfigDirAndFiles(string source, string overlay_name, out string config_dir, out Dictionary<string, string> local_files) {
      local_files = null;
      config_dir = null;

      if (Config.UserConfigFile != null && Config.UserConfigFile != "") {
        // Explicit user config directory specified.
        config_dir = Config.UserConfigFile;
        local_files = GetLocalUserFiles(config_dir, overlay_name);
      } else {
        if (source != null && source != "") {
          // First try a user directory relative to the html.
          try {
            // TODO: this is wrong for ui/dps/overlays
            // TODO: maybe replace this with the version checker get cactbot root
            var url_dir = Path.GetDirectoryName(new Uri(source).LocalPath);
            config_dir = Path.GetFullPath(url_dir + "\\..\\..\\user\\");
            local_files = GetLocalUserFiles(config_dir, overlay_name);
          } catch (Exception e) {
            LogError(Strings.CheckingHtmlRelDirErrorMessage, source, e.ToString());
            config_dir = null;
            local_files = null;
          }
        }
        if (local_files == null) {
          // Second try a user directory relative to the dll.
          try {
            config_dir = Path.GetFullPath((new VersionChecker(this)).GetCactbotDirectory() + "\\user");
            local_files = GetLocalUserFiles(config_dir, overlay_name);
          } catch (Exception e) {
            // Accessing CactbotEventSourceConfig.CactbotDllRelativeUserUri can throw an exception so don't.
            LogError(Strings.CheckingDllRelDirErrorMessage, config_dir, e.ToString());
            config_dir = null;
            local_files = null;
          }
        }

        // Set any implicitly discovered cactbot user config dirs as explicit.
        // This will help in the future when there aren't local plugins or html.
        if (config_dir != null)
          Config.UserConfigFile = config_dir;
      }
    }

    private JObject FetchUserFiles(JObject msg) {
      Dictionary<string, string> user_files;
      var overlay_name = msg.ContainsKey("overlayName") ? msg["overlayName"].ToString() : null;
      GetUserConfigDirAndFiles(msg["source"].ToString(), overlay_name, out string config_dir, out user_files);

      var result = new JObject();
      result["userLocation"] = config_dir;
      result["localUserFiles"] = user_files == null ? null : JObject.FromObject(user_files);

      result["parserLanguage"] = language_;
      result["systemLocale"] = pc_locale_;
      result["displayLanguage"] = Config.DisplayLanguage;
      // For backwards compatibility:
      result["language"] = language_;

      var response = new JObject();
      response["detail"] = result;
      return response;
    }

    struct OverlayPreset : IOverlayPreset {
      public string Name { get; set; }
      public string Type { get { return "MiniParse"; } }
      public string Url { get; set; }
      public int[] Size { get; set; }
      public bool Locked { get; set; }
      public List<string> Supports { get { return new List<string>{"modern"}; } }
    }

    private void RegisterPreset(string dirName, int width, int height, string nameOverride = null, string fileOverride = null) {
      var path = new VersionChecker(this).GetCactbotDirectory();
      string lc = dirName.ToLowerInvariant();
      var name = nameOverride != null ? nameOverride : dirName;
      var filename = (fileOverride != null ? fileOverride : dirName).ToLowerInvariant() + ".html";
      var uri = new System.Uri(Path.Combine(path, "ui", lc, filename));

      Registry.RegisterOverlayPreset(new OverlayPreset{
        Name = $"Cactbot {name}",
        Url = uri.AbsoluteUri,
        Size = new int[] { width, height },
        Locked = false,
      });
    }

    private void RegisterDpsPreset(string name, string file, int width, int height) {
      var path = new VersionChecker(this).GetCactbotDirectory();
      string lc = name.ToLowerInvariant();
      var uri = new System.Uri(Path.Combine(path, "ui", "dps", lc, $"{file}.html"));
      Registry.RegisterOverlayPreset(new OverlayPreset{
        Name = $"Cactbot DPS {name}",
        Url = uri.AbsoluteUri,
        Size = new int[] { width, height },
        Locked = false,
      });
    }

    private void RegisterExternalPreset(string name, string url, int width, int height)
    {
        Registry.RegisterOverlayPreset(new OverlayPreset
        {
            Name = $"{name}",
            Url = url,
            Size = new int[] { width, height },
            Locked = false,
        });
    }

    private void RegisterPresets() {
      RegisterPreset("Raidboss", width:1100, height:300, Strings.PresetRaidbossCombined, "raidboss");
      RegisterPreset("Raidboss", width:1100, height:300, Strings.PresetRaidbossAlertOnly, "raidboss_alerts_only");
      RegisterPreset("Raidboss", width:320, height:220, Strings.PresetRaidbossTimelineOnly, "raidboss_timeline_only");
      RegisterPreset("Jobs", width:600, height:300, Strings.PresetJobs);
      RegisterPreset("Eureka", width:400, height:400, Strings.PresetEureka);
      RegisterPreset("Fisher", width:500, height:500, Strings.PresetFisher);
      RegisterPreset("OopsyRaidsy", width:400, height:400, Strings.PresetOopsyRaidsy);
      RegisterPreset("PullCounter", width:200, height:200, Strings.PresetPullCounter);
      RegisterPreset("Radar", width:300, height:400, Strings.PresetRadar);
      RegisterPreset("Test", width:300, height:300, Strings.PresetTest);
      // FIXME: these should be consistently named.
      RegisterDpsPreset(Strings.PresetXephero, "xephero-cactbot", width:600, height:400);
      RegisterDpsPreset(Strings.PresetRdmty, "dps", width:600, height:400);
      // External Overlays using Cactbot Plugin
      RegisterExternalPreset(Strings.PresetZeffUI, "https://zeffuro.github.io/ZeffUI/", width: 800, height: 600);
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
      public JObject job_data = new JObject();
      public FFXIVProcess.EntityData player = null;
    }
    private NotifyState notify_state_ = new NotifyState();
  }

}  // namespace Cactbot
