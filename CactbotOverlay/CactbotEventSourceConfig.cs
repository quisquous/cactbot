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
    [JsonIgnore]
    public static string CactbotAssemblyUri {
      get {
        var location = System.Reflection.Assembly.GetExecutingAssembly().Location;
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
  }
}
