using CefSharp.Wpf;
using System.Windows.Controls;

namespace Cactbot
{
    public partial class BrowserControl : UserControl
    {
        public BrowserControl()
        {
            DataContext = this;
            InitializeComponent();
            CreationHandlers = delegate {};
        }

        public delegate void OnBrowserCreation(object sender, IWpfWebBrowser browser);
        public OnBrowserCreation CreationHandlers { get; set; }

        public class BoundObject
        {
            public string MyProperty { get; set; }
        }

        private IWpfWebBrowser webBrowser;
        public IWpfWebBrowser WebBrowser
        {
            get
            {
                return webBrowser;
            }
            set
            {
                if (value != null)
                    value.RegisterJsObject("bound", new BoundObject());

                if (webBrowser == value)
                    return;
                
                webBrowser = value;

                if (webBrowser != null)
                    CreationHandlers(this, webBrowser);
            }
        }
    }
}
