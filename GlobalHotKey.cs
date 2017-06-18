// Based on public domain code:
// https://bloggablea.wordpress.com/2007/05/01/global-hotkeys-with-net/

using System;
using System.Windows.Forms;
using System.ComponentModel;
using System.Runtime.InteropServices;

namespace Cactbot {
  public class GlobalHotKey : IMessageFilter {
    #region Interop

    [DllImport("user32.dll", SetLastError = true)]
    private static extern int RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, Keys vk);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern int UnregisterHotKey(IntPtr hWnd, int id);

    private const uint WM_HOTKEY = 0x312;

    private const uint MOD_ALT = 0x1;
    private const uint MOD_CONTROL = 0x2;
    private const uint MOD_SHIFT = 0x4;
    private const uint MOD_WIN = 0x8;

    private const uint ERROR_HOTKEY_ALREADY_REGISTERED = 1409;

    #endregion

    private static int currentID;
    private const int maximumID = 0xBFFF;

    private Keys keyCode;
    private Keys modifiers;

    private int id;
    private bool registered;
    private Control windowControl;

    public event HandledEventHandler OnPressed;

    public GlobalHotKey(Control windowControl, Keys keyCode, Keys modifiers) {
      this.keyCode = keyCode;
      this.modifiers = modifiers;
      this.windowControl = windowControl;
      this.registered = this.Register();
    }

    ~GlobalHotKey() {
      Unregister();
    }

    private bool Register() {
      if (keyCode == Keys.None)
        return false;

      try {
        // Get an ID for the hotkey and increase current ID
        id = GlobalHotKey.currentID;
        GlobalHotKey.currentID = GlobalHotKey.currentID + 1 % GlobalHotKey.maximumID;

        bool alt = Keys.Alt == (modifiers & Keys.Alt);
        bool control = Keys.Control == (modifiers & Keys.Control);
        bool shift = Keys.Shift == (modifiers & Keys.Shift);

        uint mod = 0;
        mod |= alt ? GlobalHotKey.MOD_ALT : 0;
        mod |= control ? GlobalHotKey.MOD_CONTROL : 0;
        mod |= shift ? GlobalHotKey.MOD_SHIFT : 0;

        if (GlobalHotKey.RegisterHotKey(windowControl.Handle, id, mod, keyCode) == 0) {
          // Is the error that the hotkey is registered?
          if (Marshal.GetLastWin32Error() == ERROR_HOTKEY_ALREADY_REGISTERED)
            return false;
          else
            throw new Win32Exception();
        }
        registered = true;
      } catch (Win32Exception) {
        return false;
      } catch (NotSupportedException) {
        return false;
      }

      Application.AddMessageFilter(this);
      return true;
    }

    public void Unregister() {
      if (!registered)
        return;
      registered = false;

      Application.RemoveMessageFilter(this);

      // It's possible that the control itself has died: in that case, no need to unregister!
      if (!windowControl.IsDisposed) {
        // Clean up after ourselves
        if (GlobalHotKey.UnregisterHotKey(this.windowControl.Handle, id) == 0)
          throw new Win32Exception();
      }
      windowControl = null;
    }

    public bool PreFilterMessage(ref Message message) {
      if (message.Msg != GlobalHotKey.WM_HOTKEY)
        return false;

      if (!this.registered)
        return false;

      if (message.WParam.ToInt32() != id)
        return false;

      if (OnPressed == null)
        return false;

      HandledEventArgs handledEventArgs = new HandledEventArgs(false);
      OnPressed(this, handledEventArgs);

      // Return whether we handled the event or not
      return handledEventArgs.Handled;
    }

  }
}
