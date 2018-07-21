using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using System;
using System.Reflection;

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

      try {
        return GetLanguageInternal(ffxiv_plugin);
      } catch (Exception e) {
        logger_.LogError("Error while determining language: {0}", e.ToString());
        return 0;
      }
    }

    private int GetLanguageInternal(IActPluginV1 plugin) {
      // Cannot "just" cast to FFXIV_ACT_Plugin.FFXIV_ACT_Plugin here, because
      // ACT uses LoadFrom which places the assembly into its own loading
      // context.  This means you can't ever cast to these types, because types
      // in the normal DLL assembly loaded via path is a different type than
      // the one in the other context.  So, time for reflection.  And sadness.
      // This is brittle, but hopefully ravahn never changes these signatures.
      // The other alternative is to find and load the XML settings.
      // See also:
      // http://www.hanselman.com/blog/FusionLoaderContextsUnableToCastObjectOfTypeWhateverToTypeWhatever.aspx
      // https://blogs.msdn.microsoft.com/aszego/2009/10/16/avoid-using-assembly-loadfrom/

      FieldInfo fi = plugin.GetType().GetField("Settings", BindingFlags.GetField | BindingFlags.Public | BindingFlags.Instance);
      var settings = fi.GetValue(plugin);

      MethodInfo mi = settings.GetType().GetMethod("GetParseSettings", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Instance);
      var parse_settings = mi.Invoke(settings, new object[] { });

      fi = parse_settings.GetType().GetField("LanguageID", BindingFlags.GetField | BindingFlags.Public | BindingFlags.Instance);
      return (int)fi.GetValue(parse_settings);
    }
  }
}