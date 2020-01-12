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
      }

      return result;
    }

    public void SaveConfig(IPluginConfig pluginConfig) {
      pluginConfig.EventSourceConfigs["CactbotESConfig"] = JObject.FromObject(this);
    }

    public void OnUpdateConfig() {
      var currentValue = WatchFileChanges;
      if (watchFileChanges != currentValue)
        WatchFileChangesChanged?.Invoke(this, new EventArgs());
        watchFileChanges = currentValue;
    }

    public Dictionary<string, JToken> OverlayData = null;
    
    public string RemoteVersionSeen = "0.0";
    
    [JsonIgnore]
    public string UserConfigFile {
      get {
        if (!OverlayData.TryGetValue("options", out JToken options))
          return null;
        var general = options["general"];
        if (general == null)
          return null;
        var dir = general["CactbotUserDirectory"];
        if (dir == null)
          return null;
        return dir.ToString();
      }
    }

    [JsonIgnore]
    private bool watchFileChanges = false;
    [JsonIgnore]
    public bool WatchFileChanges {
      get {
        if (!OverlayData.TryGetValue("options", out JToken options))
          return false;
        var general = options["general"];
        if (general == null)
          return false;
        var dir = general["ReloadOnFileChange"];
        if (dir == null)
          return false;
        try {
          return dir.ToObject<bool>();
        } catch {
          return false;
        }
      }
    }
  }
}
