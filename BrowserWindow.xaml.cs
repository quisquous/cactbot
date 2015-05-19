using System.Windows;
using System.Windows.Interop;

namespace ACTBossTime
{
    public partial class BrowserWindow : Window
    {
        public BrowserWindow()
        {
            InitializeComponent();
        }

        private void Window_Activated(object sender, System.EventArgs e)
        {
            // Terrible hack to fix missing content: http://stackoverflow.com/a/597055
            // This is the source of the delay before the window appears.
            this.Width++;
            this.Width--;

            BrowserControl.Browser.LoadHtml("<html><body><div style='background-color:white; opacity:0.5;width:500px;height:500px;'>Hello world</div></html>", "http://example.com/");
        }
    }
}
