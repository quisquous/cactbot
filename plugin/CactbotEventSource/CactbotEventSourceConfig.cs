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
    public CactbotEventSourceConfig() {
    }

    public static CactbotEventSourceConfig LoadConfig(IPluginConfig pluginConfig, RainbowMage.OverlayPlugin.ILogger logger) {
      var result = new CactbotEventSourceConfig();

      if (pluginConfig.EventSourceConfigs.ContainsKey("CactbotESConfig")) {
        var obj = pluginConfig.EventSourceConfigs["CactbotESConfig"];

        if (obj.TryGetValue("OverlayData", out JToken value)) {
          try {
            result.OverlayData = value.ToObject<Dictionary<string, JToken>>();
          } catch (Exception e) {
            logger.Log(LogLevel.Error, "Failed to load OverlayData setting: {0}", e.ToString());
          }
        }

        if (obj.TryGetValue("LastUpdateCheck", out value)) {
          try {
            result.LastUpdateCheck = value.ToObject<DateTime>();
          } catch (Exception e) {
            logger.Log(LogLevel.Error, "Failed to load LastUpdateCheck setting: {0}", e.ToString());
          }
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
    
    public DateTime LastUpdateCheck;

    [JsonIgnore]
    public string DisplayLanguage {
      get {
        if (!OverlayData.TryGetValue("options", out JToken options))
          return null;
        var general = options["general"];
        if (general == null)
          return null;
        var dir = general["DisplayLanguage"];
        if (dir == null)
          return null;
        return dir.ToString();
      }
    }
    
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

        var developer = general["ShowDeveloperOptions"];
        if (developer == null)
          return false;
        try {
          if (!developer.ToObject<bool>())
            return false;
        } catch {
          return false;
        }

        var reload = general["ReloadOnFileChange"];
        if (reload == null)
          return false;
        try {
          return reload.ToObject<bool>();
        } catch {
          return false;
        }
      }
    }
  }
}
