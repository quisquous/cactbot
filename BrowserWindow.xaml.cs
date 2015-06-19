using CefSharp.Wpf;
using System;
using System.Windows;
using System.Windows.Interop;
using System.Runtime.InteropServices;

namespace Cactbot
{
    public partial class BrowserWindow : Window
    {
        [DllImport("user32.dll")]
        static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        public BrowserWindow()
        {
            InitializeComponent();
        }

        private bool clickable = true;
        public bool Clickable
        {
            get { return clickable; }
            set
            {
                if (clickable == value)
                    return;

                IntPtr handle = new WindowInteropHelper(this).EnsureHandle();

                clickable = value;

                const int getWindowLongExStyle = -20;
                const int transparent = 0x20;
                const int layered = 0x80000;

                int exStyle = GetWindowLong(handle, getWindowLongExStyle);
                if (clickable)
                    exStyle = exStyle & ~transparent & ~layered;
                else
                    exStyle = exStyle | transparent | layered;
                SetWindowLong(handle, getWindowLongExStyle, exStyle);
            }
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
