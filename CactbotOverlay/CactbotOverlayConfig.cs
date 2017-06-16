using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cactbot
{
    public class CactbotOverlayConfig : OverlayConfigBase
    {
        public CactbotOverlayConfig(string name)
            : base(name)
        {

        }

        private CactbotOverlayConfig() : base(null)
        {

        }

        public override Type OverlayType
        {
            get { return typeof(CactbotOverlay); }
        }
    }
}
