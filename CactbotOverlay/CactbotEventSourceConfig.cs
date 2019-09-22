using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
          return Path.GetDirectoryName(location);
        } else
        {
          return null;
        }
      }
    }

    [JsonIgnore]
    public static string CactbotDllRelativeUserUri {
      get { return CactbotAssemblyUri == null ? null : Path.Combine(CactbotAssemblyUri, "../cactbot/user/"); }
    }

    public CactbotEventSourceConfig() {
    }

    public static CactbotEventSourceConfig LoadConfig(IPluginConfig pluginConfig) {
      var result = new CactbotEventSourceConfig();

      if (pluginConfig.EventSourceConfigs.ContainsKey("CactbotESConfig")) {
        var obj = pluginConfig.EventSourceConfigs["CactbotESConfig"];

        if (obj.TryGetValue("LogUpdatesEnabled", out JToken value)) {
          result.LogUpdatesEnabled = value.ToObject<bool>();
        }

        if (obj.TryGetValue("DpsUpdatesPerSecond", out value)) {
          result.DpsUpdatesPerSecond = value.ToObject<double>();
        }

        if (obj.TryGetValue("OverlayData", out value)) {
          result.OverlayData = value.ToObject<Dictionary<string, string>>();
        }

        if (obj.TryGetValue("RemoteVersionSeen", out value)) {
          result.RemoteVersionSeen = value.ToString();
        }

        if (obj.TryGetValue("UserConfigFile", out value)) {
          result.UserConfigFile = value.ToString();
        }

        if (obj.TryGetValue("WatchFileChanges", out value)) {
          result.WatchFileChanges = value.ToObject<bool>();
        }
      }

      return result;
    }

    public void SaveConfig(IPluginConfig pluginConfig) {
      pluginConfig.EventSourceConfigs["CactbotESConfig"] = JObject.FromObject(this);
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
