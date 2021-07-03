using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Newtonsoft.Json.Linq;
using CactbotEventSource.loc;

namespace Cactbot {

  // Wrap Process so that Process.Handle can be overridden with a more restricted handle.
  public class LimitedProcess {
    private Process process;

    public LimitedProcess(Process process) {
      this.process = process;
      if (process == null || process.HasExited)
        return;
      Handle = NativeMethods.OpenProcess(NativeMethods.ProcessAccessFlags.VirtualMemoryRead, false, process.Id);
    }
    ~LimitedProcess() {
      if (Handle == IntPtr.Zero)
        return;
      NativeMethods.CloseHandle(Handle);
    }

    public IntPtr Handle { get; } = IntPtr.Zero;

    public bool HasExited {
      get { return process.HasExited; }
    }

    public int Id {
      get { return process.Id; }
    }

    public ProcessModule MainModule {
      get { return process.MainModule; }
    }
  }

  // Exposes the FFXIV game directly. Call FindProcess() regularly to update
  // memory addresses when FFXIV is run or closed.
  public abstract class FFXIVProcess {
    internal ILogger logger_ = null;
    bool showed_dx9_error_ = false;
    private LimitedProcess process_ = null;

    // Filled in by ReadSignatures().
    internal IntPtr player_ptr_addr_ = IntPtr.Zero;
    internal IntPtr job_data_outer_addr_ = IntPtr.Zero;
    internal IntPtr in_combat_addr_ = IntPtr.Zero;
    internal IntPtr bait_addr_ = IntPtr.Zero;

    // Values found in the EntityStruct's type field.
    public enum EntityType : byte {
      None = 0,
      PC = 1,
      Monster = 2,
      NPC = 3,
      Aetherite = 5,
      GatheringNode = 6,
      ClickableObject = 7,
      Minion = 9,
      Mailbox = 12,
    };

    // Values found in the EntityStruct's job field.
    public enum EntityJob : byte {
      None = 0,
      GLA = 1,
      PGL = 2,
      MRD = 3,
      LNC = 4,
      ARC = 5,
      CNJ = 6,
      THM = 7,
      CRP = 8,
      BSM = 9,
      ARM = 10,
      GSM = 11,
      LTW = 12,
      WVR = 13,
      ALC = 14,
      CUL = 15,
      MIN = 16,
      BTN = 17,
      FSH = 18,
      PLD = 19,
      MNK = 20,
      WAR = 21,
      DRG = 22,
      BRD = 23,
      WHM = 24,
      BLM = 25,
      ACN = 26,
      SMN = 27,
      SCH = 28,
      ROG = 29,
      NIN = 30,
      MCH = 31,
      DRK = 32,
      AST = 33,
      SAM = 34,
      RDM = 35,
      BLU = 36,
      GNB = 37,
      DNC = 38,
    };

    static internal bool IsGatherer(EntityJob job) {
      return job == EntityJob.FSH || job == EntityJob.MIN || job == EntityJob.BTN;
    }

    static internal bool IsCrafter(EntityJob job) {
      return job == EntityJob.CRP ||
        job == EntityJob.BSM ||
        job == EntityJob.ARM ||
        job == EntityJob.GSM ||
        job == EntityJob.LTW ||
        job == EntityJob.WVR ||
        job == EntityJob.ALC ||
        job == EntityJob.CUL;
    }

    [Serializable]
    public class EntityData {
      public string name;
      public uint id = 0;
      public EntityType type = EntityType.None;
      public ushort distance = 0;
      public float pos_x = 0;
      public float pos_y = 0;
      public float pos_z = 0;
      public float rotation = 0;
      public int hp = 0;
      public int max_hp = 0;
      public int mp = 0;
      public int max_mp = 0;
      public short gp = 0;
      public short max_gp = 0;
      public short cp = 0;
      public short max_cp = 0;
      public EntityJob job = EntityJob.None;
      public short level = 0;
      public string debug_job;
      public int shield_value = 0;
      public int bait = 0;

      public override bool Equals(object obj) {
        return obj is EntityData o &&
          id == o.id &&
          type == o.type &&
          distance == o.distance &&
          pos_x == o.pos_x &&
          pos_y == o.pos_y &&
          pos_z == o.pos_z &&
          rotation == o.rotation &&
          hp == o.hp &&
          max_hp == o.max_hp &&
          mp == o.mp &&
          max_mp == o.max_mp &&
          gp == o.gp &&
          max_gp == o.max_gp &&
          cp == o.cp &&
          max_cp == o.max_cp &&
          job == o.job &&
          level == o.level &&
          debug_job == o.debug_job &&
          shield_value == o.shield_value &&
          bait == o.bait;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + name.GetHashCode();
        hash = hash * 31 + id.GetHashCode();
        hash = hash * 31 + type.GetHashCode();
        hash = hash * 31 + distance.GetHashCode();
        hash = hash * 31 + pos_x.GetHashCode();
        hash = hash * 31 + pos_y.GetHashCode();
        hash = hash * 31 + pos_z.GetHashCode();
        hash = hash * 31 + rotation.GetHashCode();
        hash = hash * 31 + hp.GetHashCode();
        hash = hash * 31 + max_hp.GetHashCode();
        hash = hash * 31 + mp.GetHashCode();
        hash = hash * 31 + max_mp.GetHashCode();
        hash = hash * 31 + gp.GetHashCode();
        hash = hash * 31 + max_gp.GetHashCode();
        hash = hash * 31 + cp.GetHashCode();
        hash = hash * 31 + max_cp.GetHashCode();
        hash = hash * 31 + job.GetHashCode();
        hash = hash * 31 + level.GetHashCode();
        hash = hash * 31 + shield_value.GetHashCode();
        hash = hash * 31 + debug_job.GetHashCode();
        hash = hash * 31 + bait.GetHashCode();
        return hash;
      }
    };

    // The op before the pointer wildcard in the signature reads a pointer-to-a-pointer
    // to the job-specific data structure. We call it |outer| below:
    //
    // JobDataOuterStruct* outer;  // This pointer found from the signature.
    // JobDataOuterStruct {
    //   JobDataInnerStruct* inner;  // This points to the address after it currently.
    //   JobDataInnerStruct {
    internal static int kJobDataOuterStructOffset = 0;
    internal static int kJobDataInnerStructOffset = 8;
    internal static int kJobDataInnerStructSize = 16 - kJobDataInnerStructOffset;

    internal abstract void ReadSignatures();

    public FFXIVProcess(ILogger logger) { logger_ = logger; }

    public bool HasProcess() {
      // If FindProcess failed, return false. But also return false if
      // FindProcess succeeded but the process has since exited.
      return process_ != null && !process_.HasExited;
    }

    public bool FindProcess() {
      if (HasProcess())
        return true;

      // Only support the DirectX 11 binary. The DirectX 9 one has different addresses.
      Process found_process = (from x in Process.GetProcessesByName("ffxiv_dx11")
                               where !x.HasExited && x.MainModule != null && x.MainModule.ModuleName == "ffxiv_dx11.exe"
                               select x).FirstOrDefault<Process>();
      if (found_process != null && found_process.HasExited)
        found_process = null;
      bool changed_existance = (process_ == null) != (found_process == null);
      bool changed_pid = process_ != null && found_process != null && process_.Id != found_process.Id;
      if (changed_existance || changed_pid) {
        player_ptr_addr_ = IntPtr.Zero;
        job_data_outer_addr_ = IntPtr.Zero;
        process_ = found_process != null ? new LimitedProcess(found_process) : null;

        if (process_ != null) {
          ReadSignatures();
        }
      }

      if (process_ == null && !showed_dx9_error_) {
        int found_32bit = (from x in Process.GetProcessesByName("ffxiv")
                           where !x.HasExited && x.MainModule != null && x.MainModule.ModuleName == "ffxiv.exe"
                           select x).Count();
        if (found_32bit > 0) {
          logger_.LogError(Strings.FoundDX9FFXIVErrorMessage);
          showed_dx9_error_ = true;
        }
      }

      return process_ != null;
    }

    public bool IsActive() {
      if (!HasProcess())
        return false;
      IntPtr active_hwnd = NativeMethods.GetForegroundWindow();
      int active_process_id;
      NativeMethods.GetWindowThreadProcessId(active_hwnd, out active_process_id);
      return active_process_id == process_.Id;
    }

    internal int GetBait() {
      short[] jorts = Read16(bait_addr_, 1);
      return jorts[0];
    }
    public unsafe abstract EntityData GetEntityDataFromByteArray(byte[] source);

    public bool GetInGameCombat() {
      if (!HasProcess() || in_combat_addr_ == IntPtr.Zero)
        return false;
      var bytes = Read8(in_combat_addr_, 1);
      return bytes[0] != 0;
    }

    internal byte[] GetRawJobSpecificDataBytes() {
      if (!HasProcess() || job_data_outer_addr_ == IntPtr.Zero)
        return null;

      IntPtr job_inner_ptr = ReadIntPtr(job_data_outer_addr_);
      if (job_inner_ptr == IntPtr.Zero) {
        // The pointer can be null when not logged in.
        return null;
      }
      job_inner_ptr = IntPtr.Add(job_inner_ptr, kJobDataInnerStructOffset);
      return Read8(job_inner_ptr, kJobDataInnerStructSize);
    }
    public unsafe abstract JObject GetJobSpecificData(EntityJob job);
    internal abstract EntityData GetEntityData(IntPtr entity_ptr);
    public abstract EntityData GetSelfData();

    /// Reads |count| bytes at |addr| in the |process_|. Returns null on error.
    internal byte[] Read8(IntPtr addr, int count) {
      int buffer_len = 1 * count;
      var buffer = new byte[buffer_len];
      var bytes_read = IntPtr.Zero;
      bool ok = NativeMethods.ReadProcessMemory(process_.Handle, addr, buffer, new IntPtr(buffer_len), ref bytes_read);
      if (!ok || bytes_read.ToInt32() != buffer_len)
        return null;
      return buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 16bit ints. Returns null on error.
    internal Int16[] Read16(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 2);
      if (buffer == null)
        return null;
      var out_buffer = new Int16[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToInt16(buffer, 2 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 32bit ints. Returns null on error.
    internal Int32[] Read32(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 4);
      if (buffer == null)
        return null;
      var out_buffer = new Int32[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToInt32(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 32bit uints. Returns null on error.
    internal UInt32[] Read32U(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 4);
      if (buffer == null)
        return null;
      var out_buffer = new UInt32[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToUInt32(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 32bit floats. Returns null on error.
    internal float[] ReadSingle(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 4);
      if (buffer == null)
        return null;
      var out_buffer = new float[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToSingle(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 64bit ints. Returns null on error.
    internal Int64[] Read64(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 8);
      if (buffer == null)
        return null;
      var out_buffer = new Int64[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToInt64(buffer, 8 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 64bit pointer. Returns 0 on error.
    internal IntPtr ReadIntPtr(IntPtr addr) {
      var buffer = Read8(addr, 8);
      if (buffer == null)
        return IntPtr.Zero;
      return new IntPtr(BitConverter.ToInt64(buffer, 0));
    }

    /// <summary>
    /// Signature scan.
    /// Searches the |process_| memory for a |pattern|, which can include wildcards. When the
    /// pattern is found, it reads a pointer found at |offset| bytes after the end of the
    /// pattern.
    /// If the pattern is found multiple times, the pointer relative to the end of each
    /// instance is returned.
    ///
    /// Heavily based on code from ACT_EnmityPlugin.
    /// </summary>
    /// <param name="pattern">String containing bytes represented in hex to search for, with "??" as a wildcard.</param>
    /// <param name="offset">The offset from the end of the found pattern to read a pointer from the process memory.</param>
    /// <param name="rip_addressing">Uses x64 RIP relative addressing mode</param>
    /// <returns>A list of pointers read relative to the end of strings in the process memory matching the |pattern|.</returns>
    internal List<IntPtr> SigScan(string pattern, int offset, bool rip_addressing) {
      List<IntPtr> matches_list = new List<IntPtr>();

      if (pattern == null || pattern.Length % 2 != 0) {
        logger_.LogError(Strings.InvalidSignaturePatternErrorMessage, pattern);
        return matches_list;
      }

      // Build a byte array from the pattern string. "??" is a wildcard
      // represented as null in the array.
      byte?[] pattern_array = new byte?[pattern.Length / 2];
      for (int i = 0; i < pattern.Length / 2; i++) {
        string text = pattern.Substring(i * 2, 2);
        if (text == "??") {
          pattern_array[i] = null;
        } else {
          pattern_array[i] = new byte?(Convert.ToByte(text, 16));
        }
      }

      // Read this many bytes at a time. This needs to be a 32bit number as BitConverter pulls
      // from a 32bit offset into the array that we read from the process.
      const Int32 kMaxReadSize = 65536;

      int module_memory_size = process_.MainModule.ModuleMemorySize;
      IntPtr process_start_addr = process_.MainModule.BaseAddress;
      IntPtr process_end_addr = IntPtr.Add(process_start_addr, module_memory_size);

      IntPtr read_start_addr = process_start_addr;
      byte[] read_buffer = new byte[kMaxReadSize];
      while (read_start_addr.ToInt64() < process_end_addr.ToInt64()) {
        // Determine how much to read without going off the end of the process.
        Int64 bytes_left = process_end_addr.ToInt64() - read_start_addr.ToInt64();
        IntPtr read_size = (IntPtr)Math.Min(bytes_left, kMaxReadSize);

        IntPtr num_bytes_read = IntPtr.Zero;
        if (NativeMethods.ReadProcessMemory(process_.Handle, read_start_addr, read_buffer, read_size, ref num_bytes_read)) {
          int max_search_offset = num_bytes_read.ToInt32() - pattern_array.Length - Math.Max(0, offset);
          // With RIP we will read a 4byte pointer at the |offset|, else we read an 8byte pointer. Either
          // way we can't find a pattern such that the pointer we want to read is off the end of the buffer.
          if (rip_addressing)
            max_search_offset -= 4;  //  + 1L; ?
          else
            max_search_offset -= 8;

          for (int search_offset = 0; (Int64)search_offset < max_search_offset; ++search_offset) {
            bool found_pattern = true;
            for (int pattern_i = 0; pattern_i < pattern_array.Length; pattern_i++) {
              // Wildcard always matches, otherwise compare to the read_buffer.
              byte? pattern_byte = pattern_array[pattern_i];
              if (pattern_byte.HasValue &&
                  pattern_byte.Value != read_buffer[search_offset + pattern_i]) {
                found_pattern = false;
                break;
              }
            }
            if (found_pattern) {
              IntPtr pointer;
              if (rip_addressing) {
                Int32 rip_ptr_offset = BitConverter.ToInt32(read_buffer, search_offset + pattern_array.Length + offset);
                Int64 pattern_start_game_addr = read_start_addr.ToInt64() + search_offset;
                Int64 pointer_offset_from_pattern_start = pattern_array.Length + offset;
                Int64 rip_ptr_base = pattern_start_game_addr + pointer_offset_from_pattern_start + 4;
                // In RIP addressing, the pointer from the executable is 32bits which we stored as |rip_ptr_offset|. The pointer
                // is then added to the address of the byte following the pointer, making it relative to that address, which we
                // stored as |rip_ptr_base|.
                pointer = new IntPtr((Int64)rip_ptr_offset + rip_ptr_base);
              } else {
                // In normal addressing, the 64bits found with the pattern are the absolute pointer.
                pointer = new IntPtr(BitConverter.ToInt64(read_buffer, search_offset + pattern_array.Length + offset));
              }
              matches_list.Add(pointer);
            }
          }
        }

        // Move to the next contiguous buffer to read.
        // TODO: If the pattern lies across 2 buffers, then it would not be found.
        read_start_addr = IntPtr.Add(read_start_addr, kMaxReadSize);
      }

      return matches_list;
    }
  }
}
