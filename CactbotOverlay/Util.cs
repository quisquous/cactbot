// From https://github.com/RainbowMage/OverlayPlugin/blob/96552e5603d520be6116d52b6d685355dd5e7a24/OverlayPlugin.Core/Util.cs

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace RainbowMage.OverlayPlugin {
  internal static class Util {
    /// <summary>
    /// JSON 用に文字列をエスケープします。
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public static string CreateJsonSafeString(string str) {
      return str
          .Replace("\"", "\\\"")
          .Replace("'", "\\'")
          .Replace("\r", "\\r")
          .Replace("\n", "\\n")
          .Replace("\t", "\\t");
    }

    /// <summary>
    /// 文字列中に含まれる double.NaN.ToString() で出力される文字列を指定した文字列で置換します。
    /// </summary>
    /// <param name="str"></param>
    /// <param name="replace"></param>
    /// <returns></returns>
    public static string ReplaceNaNString(string str, string replace) {
      return str.Replace(double.NaN.ToString(), replace);
    }

    /// <summary>
    /// フォームがスクリーン上にあるかを判定します。
    /// </summary>
    /// <param name="form">判定するウィンドウ。</param>
    /// <returns>スクリーン上にある場合は true、そうでない場合は false。</returns>
    public static bool IsOnScreen(Form form) {
      var screens = Screen.AllScreens;
      foreach (Screen screen in screens) {
        var formRectangle = new Rectangle(form.Left, form.Top, form.Width, form.Height);

        // 少しでもスクリーンと被っていればセーフ
        if (screen.WorkingArea.IntersectsWith(formRectangle)) {
          return true;
        }
      }

      return false;
    }

    /// <summary>
    /// 指定されたフォームを Windows の Alt+Tab の切り替え候補から除外します。
    /// </summary>
    /// <param name="form"></param>
    public static void HidePreview(System.Windows.Forms.Form form) {
      int ex = NativeMethods.GetWindowLong(form.Handle, NativeMethods.GWL_EXSTYLE);
      ex |= NativeMethods.WS_EX_TOOLWINDOW;
      NativeMethods.SetWindowLongA(form.Handle, NativeMethods.GWL_EXSTYLE, (IntPtr)ex);
    }

    /// <summary>
    /// Generates human readable keypress string.
    /// 人間が読めるキー押下文字列を生成します。
    /// </summary>
    /// <param name="modifier"></param>
    /// <param name="key"></param>
    /// <param name="defaultText"></param>
    /// <returns></returns>
    public static string GetHotkeyString(Keys modifier, Keys key, String defaultText = "") {
      StringBuilder sbKeys = new StringBuilder();
      if ((modifier & Keys.Shift) == Keys.Shift) {
        sbKeys.Append("Shift + ");
      }
      if ((modifier & Keys.Control) == Keys.Control) {
        sbKeys.Append("Ctrl + ");
      }
      if ((modifier & Keys.Alt) == Keys.Alt) {
        sbKeys.Append("Alt + ");
      }
      if ((modifier & Keys.LWin) == Keys.LWin || (modifier & Keys.RWin) == Keys.RWin) {
        sbKeys.Append("Win + ");
      }
      sbKeys.Append(Enum.ToObject(typeof(Keys), key).ToString());
      return sbKeys.ToString();
    }



    /// <summary>
    /// Removes stray references to Left/Right shifts, etc and modifications of the actual 
    /// key value caused by bitwise operations.
    /// ビット単位の操作に起因する左/右シフト、などと実際のキー値の変更に浮遊の参照を削除します。
    /// </summary>
    /// <param name="keyCode"></param>
    /// <param name="modifiers"></param>
    /// <returns></returns>
    public static Keys RemoveModifiers(Keys keyCode, Keys modifiers) {
      var key = keyCode;
      var modifierList = new List<Keys>() { Keys.ControlKey, Keys.LControlKey, Keys.Alt, Keys.ShiftKey, Keys.Shift, Keys.LShiftKey, Keys.RShiftKey, Keys.Control, Keys.LWin, Keys.RWin };
      foreach (var mod in modifierList) {
        if (key.HasFlag(mod)) {
          if (key == mod)
            key &= ~mod;
        }
      }
      return key;
    }
  }
}
