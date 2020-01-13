﻿using RainbowMage.OverlayPlugin;

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
