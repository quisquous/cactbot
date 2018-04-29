using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using RainbowMage.OverlayPlugin;
using System;
using System.Text.RegularExpressions;

namespace Cactbot {

  // This class can determine the current plugin version, as well as the latest version
  // released of the plugin on GitHub. It is inspired by the work of anoyetta in
  // https://github.com/anoyetta/ACT.SpecialSpellTimer/blob/master/ACT.SpecialSpellTimer.Core/UpdateChecker.cs
  class VersionChecker {
    private ILogger logger_ = null;

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
      string html;
      try {
        var web = new System.Net.WebClient();
        System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Ssl3 | System.Net.SecurityProtocolType.Tls | System.Net.SecurityProtocolType.Tls11 | System.Net.SecurityProtocolType.Tls12;
        var page_stream = web.OpenRead(kReleaseUrl);
        var reader = new System.IO.StreamReader(page_stream);
        html = reader.ReadToEnd();
      } catch (Exception e) {
        logger_.LogError("Error fetching most recent github release: " + e.Message + "\n" + e.StackTrace);
        return new Version();
      }

      var pattern = @"<h1(\s.*?)?\sclass=""[^""]*release-title[^""]*"".*?>(?<Header>.*?)</h1>";
      var regex = new Regex(pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
      var match = regex.Match(html);
      if (!match.Success) {
        logger_.LogError("Error parsing most recent github release, no match found. Please report an issue at " + kIssueUrl);
        return new Version();
      }

      string header_string = match.Groups["Header"].Value;

      pattern = @"<a\s.*?>\s*(?<ReleaseTitle>.*?)\s*</a>";
      regex = new Regex(pattern, RegexOptions.IgnoreCase);
      match = regex.Match(header_string);
      if (!match.Success) {
        logger_.LogError("Error parsing most recent github release, no match found. Please report an issue at " + kIssueUrl);
        return new Version();
      }

      string version_string = match.Groups["ReleaseTitle"].Value;

      pattern = @"(?<VersionNumber>(?<Major>[0-9]+)\.(?<Minor>[0-9]+)\.(?<Revision>[0-9+]))";
      regex = new Regex(pattern);
      match = regex.Match(version_string);
      if (!match.Success) {
        logger_.LogError("Error parsing most recent github release, no version number found. Please report an issue at " + kIssueUrl);
        return new Version();
      }

      return new Version(int.Parse(match.Groups["Major"].Value), int.Parse(match.Groups["Minor"].Value), int.Parse(match.Groups["Revision"].Value));
    }
  }

}  // namespace Cactbot
