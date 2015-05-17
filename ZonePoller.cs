using FFXIV_ACT_Plugin;
using System.Timers;

namespace ACTBossTime
{
    public class ZonePoller
    {
        public string CurrentZone { get; private set; }
        Timer timer;

        public delegate void OnZoneChange(string zone);
        public OnZoneChange OnZoneChangeHandler { get; set; }

        public ZonePoller(int pollTimeInMs)
        {
            OnZoneChangeHandler = delegate { };
            CheckZone();

            timer = new Timer(pollTimeInMs);
            timer.Elapsed += CheckZone;
            timer.Enabled = true;
        }

        private void CheckZone(object source = null, ElapsedEventArgs e = null)
        {
            string zone = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone;
            if (zone == CurrentZone)
                return;
            CurrentZone = zone;

            OnZoneChangeHandler(zone);
        }
    }
}