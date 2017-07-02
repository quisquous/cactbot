using System;
using System.Diagnostics;
using System.Linq;
using Tamagawa.EnmityPlugin;

namespace Cactbot {

  // Exposes the FFXIV game directly. Call FindProcess() regularly to update
  // memory addresses when FFXIV is run or closed.
  public class FFXIVProcess {
    private Process process_ = null;
    private FFXIVMemory enmity_memory_;

    // A static variable address for red mage mana. White mana is the first
    // byte, and Black mana the second.
    private static long kRedMageManaAddr = 0x7FF6D382ADB0;

    public class RedMageJobData {
      public int white;
      public int black;
    }

    public bool FindProcess(Tamagawa.EnmityPlugin.Logger logger) {
      // Only support the DirectX 11 binary. The DirectX 9 one has different addresses.
      Process found_process = (from x in Process.GetProcessesByName("ffxiv_dx11")
                               where !x.HasExited && x.MainModule != null && x.MainModule.ModuleName == "ffxiv_dx11.exe"
                               select x).FirstOrDefault<Process>();
      if (found_process != null && found_process.HasExited)
        found_process = null;
      bool changed_existance = (process_ == null) != (found_process == null);
      bool changed_pid = process_ != null && found_process != null && process_.Id != found_process.Id;
      if (changed_existance || changed_pid) {
        if (enmity_memory_ != null) {
          enmity_memory_.Dispose();
          enmity_memory_ = null;
        }

        process_ = found_process;
        enmity_memory_ = new FFXIVMemory(logger, process_);
        if (!enmity_memory_.validateProcess()) {
          enmity_memory_.Dispose();
          enmity_memory_ = null;
        }
      }
      return enmity_memory_ != null;
    }

    public Combatant GetSelfCombatant() {
      if (enmity_memory_ == null)
        return null;
      return enmity_memory_.GetSelfCombatant();
    }

    public RedMageJobData GetRedMage() {
      if (enmity_memory_ == null)
        return null;
      int kBufferLen = 2;
      byte[] buffer = new byte[kBufferLen];
      IntPtr bytes_read = IntPtr.Zero;
      bool ok = NativeMethods.ReadProcessMemory(process_.Handle, new IntPtr(kRedMageManaAddr), buffer, new IntPtr(kBufferLen), ref bytes_read);
      if (!ok)
        return null;

      var r = new RedMageJobData();
      r.white = buffer.ElementAt(0);
      r.black = buffer.ElementAt(1);
      return r;
    }
  }

}