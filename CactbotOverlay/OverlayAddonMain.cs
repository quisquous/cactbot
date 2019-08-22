using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Cactbot {
  public class OverlayAddonMain : IOverlayAddonV2 {
    public string Name {
      get { return "Cactbot"; }
    }

    public string Description {
      get { return "A hodgepodge of bindings"; }
    }

    public void Init()
    {
      Registry.RegisterEventSource<CactbotEventSource>();
    }
  }
}
