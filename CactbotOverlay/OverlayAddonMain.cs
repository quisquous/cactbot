using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cactbot {
  public class OverlayAddonMain : IOverlayAddon {
    public string Name {
      get { return "Cactbot"; }
    }

    public string Description {
      get { return "A hodgepodge of bindings"; }
    }

    public Type OverlayType {
      get { return typeof(CactbotOverlay); }
    }

    public Type OverlayConfigType {
      get { return typeof(CactbotOverlayConfig); }
    }

    public Type OverlayConfigControlType {
      get { return typeof(CactbotOverlayConfigPanel); }
    }

    public IOverlay CreateOverlayInstance(IOverlayConfig config) {
      config.MaxFrameRate = 60;  // The maximum allowed by CEF, sadly: http://cefsharp.github.io/api/51.0.0/html/P_CefSharp_BrowserSettings_WindowlessFrameRate.htm
      return new CactbotOverlay((CactbotOverlayConfig)config);
    }

    public IOverlayConfig CreateOverlayConfigInstance(string name) {
      return new CactbotOverlayConfig(name);
    }

    public System.Windows.Forms.Control CreateOverlayConfigControlInstance(IOverlay overlay) {
      return new CactbotOverlayConfigPanel((CactbotOverlay)overlay);
    }

    public void Dispose() {

    }
  }
}
