using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace Cactbot {
  [Serializable]
  public class CactbotEventSourceConfig {
    public event EventHandler WatchFileChangesChanged;

    [JsonIgnore]
    public static string CactbotAssemblyUri {
      get {
        var location = System.Reflection.Assembly.GetExecutingAssembly().Location;
        if (location == "") location = PluginLoader.pluginPath;

        if (location != "") {
          return System.IO.Path.GetDirectoryName(location);
        } else
        {
          return null;
        }
      }
    }

    [JsonIgnore]
    public static string CactbotDllRelativeUserUri {
      get { return CactbotAssemblyUri == null ? null : System.IO.Path.Combine(CactbotAssemblyUri, "../cactbot/user/"); }
    }

    public CactbotEventSourceConfig() {
    }

    public static CactbotEventSourceConfig LoadConfig(IPluginConfig pluginConfig)
    {
      if (!pluginConfig.EventSourceConfigs.ContainsKey("CactbotESConfig"))
      {
        pluginConfig.EventSourceConfigs["CactbotESConfig"] = new CactbotEventSourceConfig();
      }

      return (CactbotEventSourceConfig)pluginConfig.EventSourceConfigs["CactbotESConfig"];
    }
    
    public bool LogUpdatesEnabled = true;

    public double DpsUpdatesPerSecond = 0;

    public Dictionary<string, string> OverlayData = null;
    
    public string RemoteVersionSeen = "0.0";
    
    public string UserConfigFile = "";

    private bool watchFileChanges = false;
    public bool WatchFileChanges {
      get {
        return watchFileChanges;
      }
      set {
        if (watchFileChanges != value) {
          watchFileChanges = value;
          WatchFileChangesChanged?.Invoke(this, new EventArgs());
        }
      }
    }
  }
}
