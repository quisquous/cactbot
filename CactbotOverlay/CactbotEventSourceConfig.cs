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

    public CactbotEventSourceConfig() {
    }

    public static CactbotEventSourceConfig LoadConfig(IPluginConfig pluginConfig, RainbowMage.OverlayPlugin.ILogger logger) {
      var result = new CactbotEventSourceConfig();

      if (pluginConfig.EventSourceConfigs.ContainsKey("CactbotESConfig")) {
        var obj = pluginConfig.EventSourceConfigs["CactbotESConfig"];

        // TODO: add try/catch here
        if (obj.TryGetValue("OverlayData", out JToken value)) {
          try {
            result.OverlayData = value.ToObject<Dictionary<string, JToken>>();
          } catch (Exception e) {
            logger.Log(LogLevel.Error, "Failed to load OverlayData setting: {0}", e.ToString());
          }
        }

        if (obj.TryGetValue("RemoteVersionSeen", out value)) {
          result.RemoteVersionSeen = value.ToString();
        }

        if (obj.TryGetValue("UserConfigFile", out value)) {
          result.UserConfigFile = value.ToString();
        }

        if (obj.TryGetValue("WatchFileChanges", out value)) {
          try {
            result.WatchFileChanges = value.ToObject<bool>();
          } catch (Exception e) {
            logger.Log(LogLevel.Error, "Failed to load WatchFileChanges setting: {0}", e.ToString());
          }
        }
      }

      return result;
    }

    public void SaveConfig(IPluginConfig pluginConfig) {
      pluginConfig.EventSourceConfigs["CactbotESConfig"] = JObject.FromObject(this);
    }

    public Dictionary<string, JToken> OverlayData = null;
    
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
