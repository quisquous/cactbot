using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Cactbot {
  [Serializable]
  public class CactbotEventSourceConfig : IEventSourceConfig {
    [XmlIgnore]
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

    [XmlIgnore]
    public static string CactbotDllRelativeUserUri {
      get { return CactbotAssemblyUri == null ? null : System.IO.Path.Combine(CactbotAssemblyUri, "../cactbot/user/"); }
    }

    public CactbotEventSourceConfig()
        : base() {
    }

    public Type SourceType {
      get { return typeof(CactbotEventSource); }
    }
    
    [XmlElement("LogUpdatesEnabled")]
    public bool LogUpdatesEnabled = true;

    [XmlElement("DpsUpdatesPerSecond")]
    public double DpsUpdatesPerSecond = 0;

    public string OverlayData = null;
    
    [XmlElement("RemoteVersionSeen")]
    public string RemoteVersionSeen = "0.0";
    
    [XmlElement("UserConfigFile")]
    public string UserConfigFile = "";
  }
}
