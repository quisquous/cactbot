using Advanced_Combat_Tracker;
using System;
using CactbotEventSource.loc;
using System.Diagnostics;

namespace Cactbot {
  public class FFXIVPlugin {
    private ILogger logger_;
    private IActPluginV1 ffxiv_plugin_;

    public FFXIVPlugin(ILogger logger) {
      logger_ = logger;

      foreach (var plugin in ActGlobals.oFormActMain.ActPlugins) {
        // Skip disabled and unloaded plugins.
        if (plugin.pluginObj == null)
          continue;
        var file = plugin.pluginFile.Name;
        if (file == "FFXIV_ACT_Plugin.dll") {
          if (ffxiv_plugin_ != null) {
            logger_.LogWarning(Strings.MultiplePluginsLoadedErrorMessage);
          }
          ffxiv_plugin_ = plugin.pluginObj;
        }
      }
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
        case 5:
          return "cn";
        case 6:
          return "ko";
        default:
          return null;
      }
    }

    public int GetLanguageId() {
      if (ffxiv_plugin_ == null) {
        logger_.LogError(Strings.NoFFXIVACTPluginFoundErrorMessage);
        return 0;
      }

      try {
        // Cannot "just" cast to FFXIV_ACT_Plugin.FFXIV_ACT_Plugin here, because
        // ACT uses LoadFrom which places the assembly into its own loading
        // context.  Use dynamic here to make this choice at runtime.
        dynamic plugin_derived = ffxiv_plugin_;
        return (int)plugin_derived.DataRepository.GetSelectedLanguageID();
      } catch (Exception e) {
        logger_.LogError(Strings.DeterminingLanguageErrorMessage, e.ToString());
        return 0;
      }
    }

    public void RegisterProcessChangedHandler(Action<Process> handler) {
      logger_.LogInfo("PIDDEBUG: RegisterProcessChangedHander");
      var del = new FFXIV_ACT_Plugin.Common.ProcessChangedDelegate(handler);
      try {
        // See note in GetLanguageId.
        dynamic plugin_derived = ffxiv_plugin_;
        plugin_derived.DataSubscription.ProcessChanged += del;
      } catch (Exception e) {
        logger_.LogInfo("PIDDEBUG: RegisterProcessChangedHander Exception: {0}", e.ToString());
        logger_.LogError(Strings.RegisteringProcessErrorMessage, e.ToString());
      }
    }

    public Process GetCurrentProcess() {
      if (ffxiv_plugin_ == null) {
        logger_.LogInfo("PIDDEBUG: GetCurrentProcess: no plugin");
        return null;
      }

      try {
        dynamic plugin_derived = ffxiv_plugin_;
        var process = plugin_derived.DataRepository.GetCurrentFFXIVProcess();
        logger_.LogInfo("PIDDEBUG: GetCurrentProcess: process_: {0}", process != null ? process.Id.ToString() : "(null)");
        return process;
      } catch (Exception e) {
        logger_.LogInfo("PIDDEBUG: GetCurrentProcessErrorMessage Exception: {0}", e.ToString());
        logger_.LogError(Strings.GetCurrentProcessErrorMessage, e.ToString());
        return null;
      }
    }
  }
}
