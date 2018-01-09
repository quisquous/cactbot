using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Cactbot {
  public class CactbotOverlayConfig : OverlayConfigBase {
    public CactbotOverlayConfig(string name)
        : base(name) {
      // Cactbot only supports visibility toggling with the hotkey.
      // It assumes all overlays are always locked and either are
      // clickthru or not on a more permanent basis.
      GlobalHotkeyType = GlobalHotkeyType.ToggleVisible;
    }

    private CactbotOverlayConfig() : base(null) {
    }

    public override Type OverlayType {
      get { return typeof(CactbotOverlay); }
    }

    public bool LogUpdatesEnabled = true;
    public double DpsUpdatesPerSecond = 3;

    public string OverlayData = null;

    public string RemoteVersionSeen = "0.0";
  }
}
