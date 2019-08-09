using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Cactbot {
  public class CactbotEventSourceConfig : IEventSourceConfig {
    public static string CactbotAssemblyUri {
      get { return System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location); }
    }
    public static string CactbotDllRelativeUserUri {
      get { return System.IO.Path.Combine(CactbotAssemblyUri, "../cactbot/user/"); }
    }
    public CactbotEventSourceConfig()
        : base() {
    }

    public Type SourceType {
      get { return typeof(CactbotEventSource); }
    }

    public bool LogUpdatesEnabled = true;
    public double DpsUpdatesPerSecond = 0;

    public string OverlayData = null;

    public string RemoteVersionSeen = "0.0";

    public string UserConfigFile = "";
  }
}
