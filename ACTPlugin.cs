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
            // This needs to happen first.
            settingsTab.Initialize(pluginStatusText);

            CefSettings cefSettings = new CefSettings();
            cefSettings.CachePath = settingsTab.BrowserCacheDir();
            Cef.Initialize(cefSettings);

            browserWindow = new BrowserWindow();
            browserWindow.ShowInTaskbar = false;
            browserWindow.BrowserControl.CreationHandlers += OnBrowserCreated;
            browserWindow.Show();

            pluginScreenSpace.Controls.Add(settingsTab);

            Application.ApplicationExit += OnACTShutdown;
        }

        public void DeInitPlugin()
        {
            browserWindow.Hide();
            settingsTab.Shutdown();
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

        private void OnACTShutdown(object sender, EventArgs args)
        {
            // Cef has to be manually shutdown on this thread, but can only be
            // shutdown once.
            Cef.Shutdown();
        }
    }
}
