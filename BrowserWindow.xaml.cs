using CefSharp.Wpf;
using System.Windows;
using System.Windows.Interop;

namespace Cactbot
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
        }
    }
}
