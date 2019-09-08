using Advanced_Combat_Tracker;
using System;

namespace Cactbot {
  public class FFXIVPlugin {
    private ILogger logger_;

    public FFXIVPlugin(ILogger logger) {
      logger_ = logger;
    }

    public string GetLocaleString() {
      switch (GetLanguageId()) {
        case 1:
          return "en";
        case 2:
          return "fr";
        case 3:
          return "de";
        case 4:
          return "ja";
        default:
          return null;
      }
    }

    public int GetLanguageId() {
      IActPluginV1 ffxiv_plugin = null;
      foreach (var plugin in ActGlobals.oFormActMain.ActPlugins) {
        var file = plugin.pluginFile.Name;
        if (file == "FFXIV_ACT_Plugin.dll") {
          if (ffxiv_plugin != null) {
            logger_.LogWarning("Multiple FFXIV_ACT_Plugin.dll plugins loaded");
          }
          ffxiv_plugin = plugin.pluginObj;
        }
      }

      if (ffxiv_plugin == null) {
        logger_.LogError("No FFXIV_ACT_Plugin.dll found? Can't set language automatically.");
        return 0;
      }

      // Cannot "just" cast to FFXIV_ACT_Plugin.FFXIV_ACT_Plugin here, because
      // ACT uses LoadFrom which places the assembly into its own loading
      // context.  Use dynamic here to make this choice at runtime.

      // ffxiv plugin 1.x path
      try {
        dynamic plugin_derived = ffxiv_plugin;
        return (int)plugin_derived.Settings.GetParseSettings().LanguageID;
      } catch (Exception) {
      }

      // ffxiv plugin 2.x path
      try {
        // Cannot "just" cast to FFXIV_ACT_Plugin.FFXIV_ACT_Plugin here, because
        // ACT uses LoadFrom which places the assembly into its own loading
        // context.  Use dynamic here to make this choice at runtime.
        dynamic plugin_derived = ffxiv_plugin;
        return (int)plugin_derived.DataRepository.GetSelectedLanguageID();
      } catch (Exception e) {
        logger_.LogError("Error while determining language: {0}", e.ToString());
        return 0;
      }
    }
  }
}