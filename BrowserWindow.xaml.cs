using CefSharp.Wpf;
using System.Windows;
using System.Windows.Interop;

namespace ACTBossTime
{
    public partial class BrowserWindow : Window
    {
        public BrowserWindow()
        {
            ReadyHandler = delegate {};
            InitializeComponent();
        }

        public delegate void OnBrowserReady(object sender, IWpfWebBrowser browser);
        public OnBrowserReady ReadyHandler { get; set; }

        private void Window_Activated(object sender, System.EventArgs e)
        {
            // Terrible hack to fix missing content: http://stackoverflow.com/a/597055
            // This is the source of the delay before the window appears.
            this.Width++;
            this.Width--;

            ReadyHandler(this, BrowserControl.Browser);
        }
    }
}
