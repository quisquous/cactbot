// From https://github.com/RainbowMage/OverlayPlugin/blob/96552e5603d520be6116d52b6d685355dd5e7a24/OverlayPlugin.Core/NativeMethods.cs

using System;
using System.Runtime.InteropServices;
using System.Text;

namespace Cactbot {
  public class NativeMethods {
    // ReadProcessMemory
    [DllImport("kernel32.dll")]
    public static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, byte[] lpBuffer, IntPtr nSize, ref IntPtr lpNumberOfBytesRead);

    [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern int GetWindowThreadProcessId(IntPtr handle, out int processId);
  }
}

namespace RainbowMage.OverlayPlugin {
  /// <summary>
  /// ネイティブ関数を提供します。
  /// </summary>
  static class NativeMethods {
    //public struct BlendFunction
    //{
    //    public byte BlendOp;
    //    public byte BlendFlags;
    //    public byte SourceConstantAlpha;
    //    public byte AlphaFormat;
    //}

    public const byte AC_SRC_ALPHA = 1;
    public const byte AC_SRC_OVER = 0;

    //public struct Point
    //{
    //    public int X;
    //    public int Y;
    //}

    //public struct Size
    //{
    //    public int Width;
    //    public int Height;
    //}

    //public struct Rect
    //{
    //    public int Left;
    //    public int Top;
    //    public int Right;
    //    public int Bottom;
    //}

    //[DllImport("user32")]
    //public static extern bool UpdateLayeredWindow(
    //    IntPtr hWnd,
    //    IntPtr hdcDst,
    //    [In] ref Point pptDst,
    //    [In]ref Size pSize,
    //    IntPtr hdcSrc,
    //    [In]ref Point pptSrc,
    //    int crKey,
    //    [In]ref BlendFunction pBlend,
    //    uint dwFlags);

    public const int ULW_ALPHA = 2;

    [DllImport("gdi32")]
    public static extern IntPtr SelectObject(
        IntPtr hdc,
        IntPtr hgdiobj);

    [DllImport("gdi32")]
    public static extern bool DeleteObject(
        IntPtr hObject);

    [DllImport("gdi32")]
    public static extern bool DeleteDC(IntPtr hdc);

    [DllImport("gdi32")]
    public static extern IntPtr CreateCompatibleDC(IntPtr hdc);

    [DllImport("gdi32")]
    public static extern IntPtr CreateCompatibleBitmap(IntPtr hdc, int nWidth, int nHeight);

    [StructLayoutAttribute(LayoutKind.Sequential)]
    public struct BitmapInfo {
      public BitmapInfoHeader bmiHeader;
      [MarshalAsAttribute(UnmanagedType.ByValArray, SizeConst = 1, ArraySubType = UnmanagedType.Struct)]
      public RgbQuad[] bmiColors;
    }

    [StructLayoutAttribute(LayoutKind.Sequential)]
    public struct BitmapInfoHeader {
      public uint biSize;
      public int biWidth;
      public int biHeight;
      public ushort biPlanes;
      public ushort biBitCount;
      public BitmapCompressionMode biCompression;
      public uint biSizeImage;
      public int biXPelsPerMeter;
      public int biYPelsPerMeter;
      public uint biClrUsed;
      public uint biClrImportant;

      public void Init() {
        biSize = (uint)Marshal.SizeOf(this);
      }
    }

    public enum BitmapCompressionMode : uint {
      BI_RGB = 0,
      BI_RLE8 = 1,
      BI_RLE4 = 2,
      BI_BITFIELDS = 3,
      BI_JPEG = 4,
      BI_PNG = 5
    }

    [StructLayoutAttribute(LayoutKind.Sequential)]
    public struct RgbQuad {
      public byte rgbBlue;
      public byte rgbGreen;
      public byte rgbRed;
      public byte rgbReserved;
    }

    [DllImport("gdi32")]
    public static extern IntPtr CreateDIBSection(
        IntPtr hdc,
        [In] ref BitmapInfo pbmi,
        uint iUsage,
        out IntPtr ppvBits,
        IntPtr hSection,
        uint dwOffset);

    public const int DIB_RGB_COLORS = 0x0000;

    [DllImport("user32.dll", EntryPoint = "SetWindowLong", SetLastError = true)]
    public static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

    [DllImport("user32.dll", EntryPoint = "GetWindowLong", SetLastError = true)]
    public static extern int GetWindowLong(IntPtr hWnd, int nIndex);

    public const int GWL_EXSTYLE = -20;
    public const int WS_EX_TRANSPARENT = 0x00000020;
    public const int WS_EX_TOOLWINDOW = 0x00000080;

    [DllImport("kernel32")]
    public static extern void CopyMemory(IntPtr dest, IntPtr src, uint count);


    // For hide from ALT+TAB preview

    [DllImport("user32.dll", EntryPoint = "SetWindowLongPtr", SetLastError = true)]
    public static extern IntPtr SetWindowLongPtr(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

    [DllImport("kernel32.dll", EntryPoint = "SetLastError")]
    public static extern void SetLastError(int dwErrorCode);

    private static int ToIntPtr32(IntPtr intPtr) {
      return unchecked((int)intPtr.ToInt64());
    }

    public static IntPtr SetWindowLongA(IntPtr hWnd, int nIndex, IntPtr dwNewLong) {
      int error = 0;
      IntPtr result = IntPtr.Zero;

      SetLastError(0);

      if (IntPtr.Size == 4) {
        Int32 result32 = SetWindowLong(hWnd, nIndex, ToIntPtr32(dwNewLong));
        error = Marshal.GetLastWin32Error();
        result = new IntPtr(result32);
      } else {
        result = SetWindowLongPtr(hWnd, nIndex, dwNewLong);
        error = Marshal.GetLastWin32Error();
      }

      if ((result == IntPtr.Zero) && (error != 0)) {
        throw new System.ComponentModel.Win32Exception(error);
      }

      return result;
    }

    [DllImport("user32.dll")]
    public static extern IntPtr GetWindow(
        IntPtr hWnd,  // 元ウィンドウのハンドル
        uint uCmd     // 関係
    );

    public const uint GW_HWNDPREV = 0x0003;

    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(
        IntPtr hWnd,             // ウィンドウのハンドル
        IntPtr hWndInsertAfter,  // 配置順序のハンドル
        int X,                   // 横方向の位置
        int Y,                   // 縦方向の位置
        int cx,                  // 幅
        int cy,                  // 高さ
        uint uFlags              // ウィンドウ位置のオプション
    );

    public static readonly IntPtr HWND_TOP = new IntPtr(0);
    public static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);

    public const uint SWP_NOSIZE = 0x0001;
    public const uint SWP_NOMOVE = 0x0002;
    public const uint SWP_NOACTIVATE = 0x0010;

    [DllImport("user32.dll", SetLastError = true)]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern int GetModuleFileName(IntPtr hModule, StringBuilder lpFilename, int nSize);

    [DllImport("user32.dll")]
    public static extern short GetKeyState(int nVirtKey);

    public const int WM_KEYDOWN = 0x0100;
    public const int WM_KEYUP = 0x0101;
    public const int WM_CHAR = 0x0102;
    public const int WM_SYSKEYDOWN = 0x0104;
    public const int WM_SYSKEYUP = 0x0105;
    public const int WM_SYSCHAR = 0x0106;
  }
}
