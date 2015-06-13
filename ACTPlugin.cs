using Advanced_Combat_Tracker;
using CefSharp;
using CefSharp.Wpf;
using System;
using System.Windows.Forms;

namespace Cactbot
{
    public class ACTPlugin : IActPluginV1
    {
        SettingsTab settingsTab = new SettingsTab();
        BrowserWindow browserWindow;

        #region IActPluginV1 Members
        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            settingsTab.Initialize(pluginStatusText);

            browserWindow = new BrowserWindow();
            browserWindow.ShowInTaskbar = false;
            browserWindow.BrowserControl.CreationHandlers += OnBrowserCreated;
            browserWindow.Show();

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

        private void OnBrowserCreated(object sender, IWpfWebBrowser browser)
        {
            browser.RegisterJsObject("act", new BrowserBindings());
            // FIXME: Make it possible to create more than one window.
            // Tie loading html to the browser window creation and bindings to the
            // browser creation.
            browser.Load(settingsTab.HTMLFile());
            browser.ShowDevTools();
        }
    }
}
