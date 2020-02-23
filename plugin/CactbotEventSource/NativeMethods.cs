// From https://github.com/RainbowMage/OverlayPlugin/blob/96552e5603d520be6116d52b6d685355dd5e7a24/OverlayPlugin.Core/NativeMethods.cs

using System;
using System.Runtime.InteropServices;

namespace Cactbot {
  public class NativeMethods {
    // ReadProcessMemory
    [DllImport("kernel32.dll")]
    public static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, byte[] lpBuffer, IntPtr nSize, ref IntPtr lpNumberOfBytesRead);

    [DllImport("kernel32.dll")]
    public static extern IntPtr OpenProcess(ProcessAccessFlags processAccess, bool bInheritHandle, int processId);

    [DllImport("kernel32.dll")]
    public static extern int CloseHandle(IntPtr hObject);

    [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern int GetWindowThreadProcessId(IntPtr handle, out int processId);

    [Flags]
    public enum ProcessAccessFlags : uint
    {
        All = 0x1F0FFF,
        Terminate = 0x1,
        CreateThread = 0x2,
        VirtualMemoryOperation = 0x8,
        VirtualMemoryRead = 0x10,
        VirtualMemoryWrite = 0x20,
        DuplicateHandle = 0x40,
        CreateProcess = 0x80,
        SetQuota = 0x100,
        SetInformation = 0x200,
        QueryInformation = 0x400,
        QueryLimitedInformation = 0x1000,
        Synchronize = 0x100000
    }
  }
}