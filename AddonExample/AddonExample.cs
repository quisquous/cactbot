using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddonExample
{
    public class AddonExample : IOverlayAddon
    {
        public string Name
        {
            get { return "Addon Example"; }
        }

        public string Description
        {
            get { return "Just displays www.yahoo.com."; }
        }

        public Type OverlayType
        {
            get { return typeof(AddonExampleOverlay); }
        }

        public Type OverlayConfigType
        {
            get { return typeof(AddonExampleOverlayConfig); }
        }

        public Type OverlayConfigControlType
        {
            get { return typeof(AddonExampleOverlayConfigPanel); }
        }

        public IOverlay CreateOverlayInstance(IOverlayConfig config)
        {
            return new AddonExampleOverlay((AddonExampleOverlayConfig)config);
        }

        public IOverlayConfig CreateOverlayConfigInstance(string name)
        {
            return new AddonExampleOverlayConfig(name);
        }

        public System.Windows.Forms.Control CreateOverlayConfigControlInstance(IOverlay overlay)
        {
            return new AddonExampleOverlayConfigPanel();
        }

        public void Dispose()
        {
            
        }
    }
}
