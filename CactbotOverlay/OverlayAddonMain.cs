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

    public Type EventSourceType {
      get { return typeof(CactbotEventSource); }
    }

    public Type EventSourceConfigType {
      get { return typeof(CactbotEventSourceConfig); }
    }

    public Type EventSourceControlType {
      get { return typeof(CactbotEventSourceConfigPanel); }
    }

    public Type OverlayType => null;
    public Type OverlayConfigType => null;
    public Type OverlayConfigControlType => null;

    public IEventSource CreateEventSourceInstance(IEventSourceConfig config) {
      return new CactbotEventSource((CactbotEventSourceConfig)config);
    }

    public IEventSourceConfig CreateEventSourceConfigInstance() {
      return new CactbotEventSourceConfig();
    }

    public Control CreateEventSourceControlInstance(IEventSource source) {
      return new CactbotEventSourceConfigPanel((CactbotEventSource)source);
    }

    public void Dispose() {

    }

    public IOverlay CreateOverlayInstance(IOverlayConfig config)
    {
      return null;
    }

    public IOverlayConfig CreateOverlayConfigInstance(string name)
    {
      return null;
    }

    public Control CreateOverlayConfigControlInstance(IOverlay overlay)
    {
        return null;
    }
  }
}
