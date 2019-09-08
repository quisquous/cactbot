using RainbowMage.OverlayPlugin;
using System;
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

    public string GetCactbotLocation() {
      return System.Reflection.Assembly.GetExecutingAssembly().Location;
    }

    public Version GetOverlayPluginVersion() {
      return System.Reflection.Assembly.GetAssembly(typeof(IOverlay)).GetName().Version;
    }

    public string GetOverlayPluginLocation() {
      return System.Reflection.Assembly.GetAssembly(typeof(IOverlay)).Location;
    }

    public Version GetFFXIVPluginVersion() {
      return System.Reflection.Assembly.GetAssembly(typeof(FFXIV_ACT_Plugin.FFXIV_ACT_Plugin)).GetName().Version;
    }

    public string GetFFXIVPluginLocation() {
      return System.Reflection.Assembly.GetAssembly(typeof(FFXIV_ACT_Plugin.FFXIV_ACT_Plugin)).Location;
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
