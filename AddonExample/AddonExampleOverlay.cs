using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddonExample
{
    public class AddonExampleOverlay : OverlayBase<AddonExampleOverlayConfig>
    {
        public AddonExampleOverlay(AddonExampleOverlayConfig config)
            : base(config, config.Name)
        {
            Navigate("http://www.yahoo.com/");
        }

        protected override void Update()
        {
            
        }
    }
}
