using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddonExample
{
    public class AddonExampleOverlayConfig : OverlayConfigBase
    {
        public AddonExampleOverlayConfig(string name)
            : base(name)
        {

        }

        private AddonExampleOverlayConfig() : base(null)
        {

        }

        public override Type OverlayType
        {
            get { return typeof(AddonExampleOverlay); }
        }
    }
}
