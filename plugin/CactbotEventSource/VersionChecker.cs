using RainbowMage.OverlayPlugin;
using RainbowMage.OverlayPlugin.Updater;
using System;
using System.IO;
using CactbotEventSource.loc;
using System.Reflection;

namespace Cactbot {

  class VersionChecker {
    private ILogger logger_ = null;

    public const string kRepo = "OverlayPlugin/cactbot";
    public const string kDownloadUrl = "https://github.com/{REPO}/releases/download/v{VERSION}/cactbot-{VERSION}.zip";

    public VersionChecker(ILogger logger) {
      logger_ = logger;
    }

    public Version GetCactbotVersion() {
      return System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
    }

    private Advanced_Combat_Tracker.ActPluginData GetPluginData(string pluginName) {
      foreach (var plugin in Advanced_Combat_Tracker.ActGlobals.oFormActMain.ActPlugins) {
        if (!plugin.cbEnabled.Checked)
          continue;
        if (plugin.pluginFile.Name == pluginName)
          return plugin;
      }
      return null;
    }

    private Advanced_Combat_Tracker.ActPluginData GetCactbotPluginData() {
      return GetPluginData("CactbotOverlay.dll");
    }

    public string GetCactbotPluginLocation() {
      var data = GetCactbotPluginData();
      if (data == null)
        return "";
      return data.pluginFile.FullName;
    }

    public string GetCactbotDirectory() {
      var pluginLocation = GetCactbotPluginLocation();
      if (pluginLocation == "")
        return "";
      var dllDir = Path.GetFullPath(Path.GetDirectoryName(new Uri(pluginLocation).LocalPath));

      // A file likely to only exist from the root of a cactbot directory.
      var checkFile = "ui/raidboss/raidboss.html";

      if (File.Exists(Path.Combine(dllDir, checkFile)))
        return dllDir;

      var buildDir = Path.GetFullPath(Path.Combine(dllDir, "../../../"));
      if (File.Exists(Path.Combine(buildDir, checkFile)))
        return buildDir;

      return "";
    }

    public Version GetOverlayPluginVersion() {
      return System.Reflection.Assembly.GetAssembly(typeof(IOverlay)).GetName().Version;
    }

    public string GetOverlayPluginLocation() {
      var data = GetPluginData("OverlayPlugin.dll");
      if (data == null)
        return "";
      return data.pluginFile.FullName;
    }

    private Advanced_Combat_Tracker.ActPluginData GetFFXIVPluginData() {
        return GetPluginData("FFXIV_ACT_Plugin_Korean.dll") ?? GetPluginData("FFXIV_ACT_Plugin.dll");
    }

    public Version GetFFXIVPluginVersion() {
      var plugin = GetFFXIVPluginData();
      if (plugin == null)
        return new Version();
      return new Version(System.Diagnostics.FileVersionInfo.GetVersionInfo(plugin.pluginFile.FullName).FileVersion);
    }

    public string GetFFXIVPluginLocation() {
      var plugin = GetFFXIVPluginData();
      if (plugin == null)
        return "(unknown)";
      return plugin.pluginFile.FullName;
    }

    public Version GetACTVersion() {
      return System.Reflection.Assembly.GetAssembly(typeof(Advanced_Combat_Tracker.ActGlobals)).GetName().Version;
    }

    public string GetACTLocation() {
      return System.Reflection.Assembly.GetAssembly(typeof(Advanced_Combat_Tracker.ActGlobals)).Location;
    }

    public enum GameRegion {
      International,
      Chinese,
      Korean,
    }

    public GameRegion GetGameRegion() {
      try {
        var mach = Assembly.Load("Machina.FFXIV");
        var opcode_manager_type = mach.GetType("Machina.FFXIV.Headers.Opcodes.OpcodeManager");
        var opcode_manager = opcode_manager_type.GetProperty("Instance").GetValue(null);
        var machina_region = opcode_manager_type.GetProperty("GameRegion").GetValue(opcode_manager).ToString();
        switch (machina_region) {
          case "Chinese":
            return GameRegion.Chinese;
          case "Korean":
            return GameRegion.Korean;
          default:
            return GameRegion.International;
        }
      } catch (Exception e) {
        logger_.Log(LogLevel.Error, Strings.GetGameRegionException, e.Message);
        return GameRegion.International;
      }
    }

    public async void DoUpdateCheck(CactbotEventSourceConfig config) {
      var pluginDirectory = GetCactbotDirectory();
      if (pluginDirectory == "") {
        logger_.Log(LogLevel.Error, Strings.UnableUpdateDueToUnknownDirectoryErrorMessage);
        return;
      }

      if (Directory.Exists(Path.Combine(pluginDirectory, ".git"))) {
        logger_.Log(LogLevel.Info, Strings.IgnoreUpdateDueToDotGitDirectoryMessage);
        return;
      }

      var options = new UpdaterOptions
      {
        project = "cactbot",
        pluginDirectory = pluginDirectory,
        lastCheck = config.LastUpdateCheck,
        currentVersion = GetCactbotVersion(),
        checkInterval = TimeSpan.FromMinutes(5),
        repo = kRepo,
        downloadUrl = kDownloadUrl,
        strippedDirs = 2,
        actPluginId = 78,
      };

      await Updater.RunAutoUpdater(options);
      config.LastUpdateCheck = options.lastCheck;
    }
  }

}  // namespace Cactbot
