using System;
using System.Diagnostics;
using System.Linq;

// Exposes the FFXIV game directly. Call FindProcess() regularly to update memory
// addresses when FFXIV is run or closed.
public class FFXIVProcess {
  private int ffxiv_pid_ = 0;

  public bool FindProcess() {
    // Only support the DirectX 11 binary. The DirectX 9 one has different addresses.
    Process process = (from x in Process.GetProcessesByName("ffxiv_dx11")
                       where !x.HasExited && x.MainModule != null && x.MainModule.ModuleName == "ffxiv_dx11.exe"
                       select x).FirstOrDefault<Process>();
    int id = 0;
    if (process != null)
      id = process.Id;
    if (ffxiv_pid_ != id) {
      ffxiv_pid_ = id;
      // TODO: The PID changed, update memory addresses and such.
    }
    return ffxiv_pid_ != 0;
  }
}
