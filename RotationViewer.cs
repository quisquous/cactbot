using System.Drawing;
using System.Windows.Forms;

namespace ACTBossTime
{
    public partial class RotationViewer : Form
    {
        private Label label1;
        private Label label2;
      
        public RotationViewer()
        {
            InitializeComponent();

            this.FormBorderStyle = FormBorderStyle.None;
            this.BackColor = Color.White;
            this.TransparencyKey = Color.Magenta;
            this.TopMost = true;
            SetStyle(ControlStyles.SupportsTransparentBackColor, true);
        }

        public void SetContent(string content, string zone)
        {
            label1.Text = content;
            label2.Text = zone;
        }

        private enum WS_EX
        {
            Transparent = 0x20,
            Layered = 0x80000,
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams p = base.CreateParams;
                p.ExStyle |= (int)WS_EX.Transparent | (int)WS_EX.Layered;
                return p;
            }
        }

        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(25, 9);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "label1";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(25, 64);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(35, 13);
            this.label2.TabIndex = 1;
            this.label2.Text = "label2";
            // 
            // RotationViewer
            // 
            this.ClientSize = new System.Drawing.Size(284, 262);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Name = "RotationViewer";
            this.ResumeLayout(false);
            this.PerformLayout();

        }
    }
}