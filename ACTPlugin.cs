using Advanced_Combat_Tracker;
using CefSharp;
using CefSharp.Wpf;
using System;
using System.Windows.Forms;

namespace ACTBossTime
{
    public class ACTPlugin : IActPluginV1
    {
        SettingsTab settingsTab = new SettingsTab();
        BrowserWindow browserWindow = new BrowserWindow();
        ZonePoller zonePoller = new ZonePoller(pollTimeInMs: 5000);

        #region IActPluginV1 Members
        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            browserWindow.ReadyHandler += OnBrowserReady;
            browserWindow.Show();

            settingsTab.Initialize(pluginStatusText);
            pluginScreenSpace.Controls.Add(settingsTab);
        }

        public void DeInitPlugin()
        {
            browserWindow.Hide();
            settingsTab.Shutdown();

            // FIXME: This needs to be called from the right thread, so it can't happen automatically.
            // However, calling it here means the plugin can never be reinitialized, oops.
            Cef.Shutdown();
        }
        #endregion

        private void OnBrowserReady(object sender, IWpfWebBrowser browser)
        {
            browser.Load("C:\\Users\\enne\\ACT.BossTime\\html\\binding_test.html");
        }
    }
}
