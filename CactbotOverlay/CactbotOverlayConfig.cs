using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Cactbot {
  public struct BossInfo {
    public BossInfo(string id, int pull_count) {
      this.id = id;
      this.pull_count = pull_count;
    }

    [XmlElement("Id")]
    public string id;
    [XmlElement("PullCount")]
    public int pull_count;
  };

  public class CactbotOverlayConfig : OverlayConfigBase {
    public CactbotOverlayConfig(string name)
        : base(name) {
      BossInfoList = new List<BossInfo>();
    }

    private CactbotOverlayConfig() : base(null) {
    }

    public override Type OverlayType {
      get { return typeof(CactbotOverlay); }
    }

    public bool LogUpdatesEnabled = true;
    public double DpsUpdatesPerSecond = 3;

    // Can't use a Dictionary or List<KeyValuePair> because XmlSerializer T_T.
    public List<BossInfo> BossInfoList { get; set; }
  }
}
