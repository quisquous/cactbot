using RainbowMage.OverlayPlugin;
using System;
using System.IO;
using System.Text.RegularExpressions;

namespace Cactbot {

  // This class can determine the current plugin version, as well as the latest version
  // released of the plugin on GitHub. It is inspired by the work of anoyetta in
  // https://github.com/anoyetta/ACT.SpecialSpellTimer/blob/master/ACT.SpecialSpellTimer.Core/UpdateChecker.cs
  class VersionChecker {
    private ILogger logger_ = null;

    public const string kReleaseApiEndpointUrl = @"https://api.github.com/repos/quisquous/cactbot/releases/latest";
    public const string kReleaseUrl = "https://github.com/quisquous/cactbot/releases/latest";
    public const string kIssueUrl = "https://github.com/quisquous/cactbot/issues";

    public VersionChecker(ILogger logger) {
      logger_ = logger;
    }

    public Version GetLocalVersion() {
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

    public Version GetRemoteVersion() {
      try {
        string json;
        using (var web_client = new System.Net.WebClient()) {
          // https://developer.github.com/v3/#user-agent-required
          web_client.Headers.Add("User-Agent", "Cactbot");
          using (var reader = new System.IO.StreamReader(web_client.OpenRead(kReleaseApiEndpointUrl))) {
            json = reader.ReadToEnd();
          }
        }
        dynamic latest_release = new System.Web.Script.Serialization.JavaScriptSerializer().DeserializeObject(json);

        return new Version(latest_release["tag_name"].Replace("v", ""));
      } catch (Exception e) {
        logger_.LogError("Error fetching most recent github release: " + e.Message + "\n" + e.StackTrace);
        return new Version();
      }
    }
  }

}  // namespace Cactbot
