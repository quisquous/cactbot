using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cactbot
{
    public class CactbotOverlay : OverlayBase<CactbotOverlayConfig>
    {
        public CactbotOverlay(CactbotOverlayConfig config)
            : base(config, config.Name)
        {

        }

        protected override void Update()
        {
            
        }
    }
}
