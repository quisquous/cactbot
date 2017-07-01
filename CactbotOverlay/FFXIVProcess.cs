using System;
using System.Diagnostics;
using System.Linq;
using Tamagawa.EnmityPlugin;

// Exposes the FFXIV game directly. Call FindProcess() regularly to update memory
// addresses when FFXIV is run or closed.
public class FFXIVProcess {
  private int ffxiv_pid_ = 0;
  private FFXIVMemory enmity_memory_;

  public bool FindProcess(Tamagawa.EnmityPlugin.Logger logger) {
    // Only support the DirectX 11 binary. The DirectX 9 one has different addresses.
    Process process = (from x in Process.GetProcessesByName("ffxiv_dx11")
                       where !x.HasExited && x.MainModule != null && x.MainModule.ModuleName == "ffxiv_dx11.exe"
                       select x).FirstOrDefault<Process>();
    int id = 0;
    if (process != null && !process.HasExited)
      id = process.Id;
    if (ffxiv_pid_ != id) {
      ffxiv_pid_ = id;
      OnProcessChange(logger, process);
    }
    return ffxiv_pid_ != 0;
  }

  public Combatant GetSelfCombatant()
  {
    if (enmity_memory_ == null) {
      return null;
    }
    return enmity_memory_.GetSelfCombatant();
  }

  private void OnProcessChange(Tamagawa.EnmityPlugin.Logger logger, Process process)
  {
    if (process == null) {
      enmity_memory_.Dispose();
      enmity_memory_ = null;
      return;
    }
    enmity_memory_ = new FFXIVMemory(logger, process);
  }
}
