using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace Cactbot {

  // Exposes the FFXIV game directly. Call FindProcess() regularly to update
  // memory addresses when FFXIV is run or closed.
  public class FFXIVProcess {
    private ILogger logger_ = null;
    private Process process_ = null;
    private IntPtr player_ptr_addr_ = IntPtr.Zero;
    private IntPtr target_ptr_addr_ = IntPtr.Zero;
    private IntPtr focus_ptr_addr_ = IntPtr.Zero;
    private IntPtr rdm_mana_outer_addr_ = IntPtr.Zero;
    private IntPtr warrior_outer_addr_ = IntPtr.Zero;

    // A piece of code that reads the pointer to the list of all entities, that we
    // refer to as the charmap. The pointer is at the end of the signature.
    private static String kCharmapSignature = "488b03488bcbff90a0000000888391000000488d0d";
    private static int kCharmapSignatureOffset = 0;
    // The signature finds a pointer in the executable code which uses RIP addressing.
    private static bool kCharmapSignatureRIP = true;
    // The pointer is to a structure as:
    //
    // CharmapStruct* outer;  // The pointer found from the signature.
    // CharmapStruct {
    //   0x10 bytes...
    //   EntityStruct* player;
    // }
    private static int kCharmapStructOffsetPlayer = 0x10;

    // A piece of code that reads the pointer to the target entity structure.
    // The pointer is the second ???????? in the signature. At address
    // ffxiv_dx11.exe+59AFB9 in August 3, 2017 version.
    private static String kTargetSignature = "483935????????7520483935????????7517";
    private static int kTargetSignatureOffset = -6;
    // The signature finds a pointer in the executable code which uses RIP addressing.
    private static bool kTargetSignatureRIP = true;
    // The pointer is to an entity structure:
    //
    // TargetStruct* outer;  // This pointer found from the signature.
    // TargetStruct {
    //   0x00 bytes in: EntityStruct* target;
    //   ...
    //   0x78 bytes in: EntityStruct* focus;
    // }
    private static int kTargetStructOffsetTarget = 0;
    private static int kTargetStructOffsetFocus = 0x78;

    // Values found in the EntityStruct's type field.
    public enum EntityType {
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
    public enum EntityJob {
      None = 0,
      GLD = 1,
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
    };

    // EntityStruct {
    //   ...
    //   0x30 bytes in: string name;  // 0x44 bytes.
    //   ...
    //   0x74 bytes in: uint32 id;
    //   ...
    //   0x8C bytes in: EntityType type;  // 1 byte.
    //   ...
    //   0x92 bytes in: byte distance;
    //   ...
    //   0xA0 bytes in: float32 pos_x;
    //   0xA4 bytes in: float32 pos_y;
    //   0xA8 bytes in: float32 pos_z;
    //   ...
    //   0x168C bytes in: int32 hp;
    //   0x1690 bytes in: int32 maxhp;
    //   0x1694 bytes in: int32 mp;
    //   0x1698 bytes in: int32 maxmp;
    //   0x169C bytes in: int16 tp;
    //   ...
    //   0x16C2 bytes in: EntityJob job;  // 2 bytes.
    //   0x16C4 bytes in: int16 level;
    //   ...
    //   0x18B4 bytes in: int casting_spell_id;  // 4 bytes (maybe 2?)
    //   ...
    //   0x18E4 bytes in: float32 casting_spell_time_spent;  // 4 bytes
    //   0x18E8 bytes in: float32 casting_spell_length;      // 4 bytes
    // }
    private static int kEntityStructureOffsetName = 0x30;
    private static int kEntityStructureOffsetId = 0x74;
    private static int kEntityStructureOffsetType = 0x8C;
    private static int kEntityStructureOffsetDistance = 0x92;
    private static int kEntityStructureOffsetPos = 0xA0;
    private static int kEntityStructureOffsetHpMp = 0x168C;
    private static int kEntityStructureOffsetTp = 0x169C;
    private static int kEntityStructureOffsetJob = 0x16C2;
    private static int kEntityStructureOffsetLevel = 0x16C4;
    private static int kEntityStructureOffsetCastingId = 0x18B4;
    private static int kEntityStructureOffsetCastingTimeProgress = 0x18E4;

    // A piece of code that reads the white and black mana. At address ffxiv_dx11.exe+3ADB90
    // in July 7, 2017 update. The lines that actually read are:
    //   movzx r8d,byte ptr[rbx+09]  // Black
    //   movzx r8d,byte ptr[rbx+08]  // White
    // The pointer of interest is the first ???????? in the signature.
    private static String kRedMageManaSignature = "48895C2408574883EC20488B1D????????488BFA4885DB746D803D";
    private static int kRedMageManaSignatureOffset = -14;
    // The signature finds a pointer in the executable code which uses RIP addressing.
    private static bool kRedMageManaSignatureRIP = true;
    // The op before the pointer wildcard in the signature reads a pointer-to-a-pointer
    // to the White-Black mana structure. We call it |outer| below:
    //
    // WhiteBlackOuterStruct* outer;  // This pointer found from the signature.
    // WhiteBlackOuterStruct {
    //   WhiteBlackInnerStruct* inner;  // This points to the address after it currently.
    //   WhiteBlackInnerStruct {
    //      0x8 bytes..
    //      byte white_mana;
    //      byte black_mana;
    //   }
    // }
    private static int kRedMageManaDataOuterStructureOffset = 0;
    private static int kRedMageManaDataInnerStructureOffset = 8;

    // ffxiv_dx11.exe+77B600: mov rcx,[???]
    // ffxiv_dx11.exe+77B61B: mov ebx, [rcx+08]
    private static String kWarriorSignature = "488B0D????????4885C974B8488B05";
    // TODO: If need more signature, prepend "B83C020000E9????????"
    // TODO: If need more signature, append "????????3C0374043C1575A90FB659084533C9".
    private static int kWarriorSignatureOffset = -12;
    private static bool kWarriorSignatureRIP = true;
    private static int kWarriorOuterDataStructureOffset = 0;
    private static int kWarriorInnerDataStructureOffset = 8;

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
        target_ptr_addr_ = IntPtr.Zero;
        focus_ptr_addr_ = IntPtr.Zero;
        rdm_mana_outer_addr_ = IntPtr.Zero;
        warrior_outer_addr_ = IntPtr.Zero;
        process_ = found_process;

        if (process_ != null) {
          List<IntPtr> p = SigScan(kCharmapSignature, kCharmapSignatureOffset, kCharmapSignatureRIP);
          if (p.Count != 1) {
            logger_.LogError("Charmap signature found " + p.Count + " matches");
          } else {
            player_ptr_addr_ = IntPtr.Add(p[0], kCharmapStructOffsetPlayer);
          }

          p = SigScan(kTargetSignature, kTargetSignatureOffset, kTargetSignatureRIP);
          if (p.Count != 1) {
            logger_.LogError("Target signature found " + p.Count + " matches");
          } else {
            target_ptr_addr_ = IntPtr.Add(p[0], kTargetStructOffsetTarget);
            focus_ptr_addr_ = IntPtr.Add(p[0], kTargetStructOffsetFocus);
          }

          p = SigScan(kRedMageManaSignature, kRedMageManaSignatureOffset, kRedMageManaSignatureRIP);
          if (p.Count != 1) {
            logger_.LogError("RedMage signature found " + p.Count + " matches");
          } else {
            rdm_mana_outer_addr_ = IntPtr.Add(p[0], kRedMageManaDataOuterStructureOffset);
          }

          p = SigScan(kWarriorSignature, kWarriorSignatureOffset, kWarriorSignatureRIP);
          if (p.Count != 1) {
            logger_.LogError("Warrior signature found " + p.Count + " matches");
          } else {
            warrior_outer_addr_ = IntPtr.Add(p[0], kWarriorOuterDataStructureOffset);
          }
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

    public class EntityData {
      public string name;
      public uint id = 0;
      public EntityType type = EntityType.None;
      public ushort distance = 0;
      public float pos_x = 0;
      public float pos_y = 0;
      public float pos_z = 0;
      public int hp = 0;
      public int max_hp = 0;
      public int mp = 0;
      public int max_mp = 0;
      public short tp = 0;
      public EntityJob job = EntityJob.None;
      public short level = 0;
    }

    private EntityData GetEntityData(IntPtr entity_ptr) {
      var data = new EntityData();

      byte[] name_bytes = Read8(IntPtr.Add(entity_ptr, kEntityStructureOffsetName), 0x44);
      if (name_bytes == null)
        return null;
      int null_pos = name_bytes.Length;
      for (int i = 0; i < name_bytes.Length; ++i) {
        if (name_bytes[i] == '\0') {
          null_pos = i;
          break;
        }
      }
      data.name = System.Text.Encoding.UTF8.GetString(name_bytes, 0, null_pos);

      uint[] id = Read32U(IntPtr.Add(entity_ptr, kEntityStructureOffsetId), 1);
      if (id == null)
        return null;
      data.id = id[0];

      byte[] type = Read8(IntPtr.Add(entity_ptr, kEntityStructureOffsetType), 1);
      if (type == null)
        return null;
      data.type = (EntityType)type[0];

      byte[] distance = Read8(IntPtr.Add(entity_ptr, kEntityStructureOffsetDistance), 1);
      if (distance == null)
        return null;
      data.distance = distance[0];

      float[] pos = ReadSingle(IntPtr.Add(entity_ptr, kEntityStructureOffsetPos), 3);
      if (pos == null)
        return null;
      data.pos_x = pos[0];
      data.pos_y = pos[2];
      data.pos_z = pos[1];

      if (data.type == EntityType.PC || data.type == EntityType.Monster) {
        int[] hpmp = Read32(IntPtr.Add(entity_ptr, kEntityStructureOffsetHpMp), 4);
        if (hpmp == null)
          return null;
        data.hp = hpmp[0];
        data.max_hp = hpmp[1];
        data.mp = hpmp[2];
        data.max_mp = hpmp[3];

        short[] tp = Read16(IntPtr.Add(entity_ptr, kEntityStructureOffsetTp), 1);
        if (tp == null)
          return null;
        data.tp = tp[0];

        short[] job = Read16(IntPtr.Add(entity_ptr, kEntityStructureOffsetJob), 1);
        if (job == null) {
          logger_.LogInfo("job");
          return null;
        }
        data.job = (EntityJob)job[0];

        short[] level = Read16(IntPtr.Add(entity_ptr, kEntityStructureOffsetLevel), 1);
        if (level == null)
          return null;
        data.level = level[0];
      }

      return data;
    }

    public EntityData GetSelfData() {
      if (!HasProcess() || player_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(player_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;
      return GetEntityData(entity_ptr);
    }

    public EntityData GetTargetData() {
      if (!HasProcess() || target_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(target_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;
      return GetEntityData(entity_ptr);
    }

    public class SpellCastingData {
      public int cast_id;
      public float casting_time_progress;
      public float casting_time_length;
    }

    public SpellCastingData GetTargetCastingData() {
      if (!HasProcess() || target_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(target_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;

      IntPtr spell_id_addr = IntPtr.Add(entity_ptr, kEntityStructureOffsetCastingId);
      IntPtr spell_times_addr = IntPtr.Add(entity_ptr, kEntityStructureOffsetCastingTimeProgress);

      Int32[] id = Read32(spell_id_addr, 1);
      if (id == null)
        return null;
      float[] times = ReadSingle(spell_times_addr, 2);
      if (times == null)
        return null;

      var r = new SpellCastingData();
      r.cast_id = id[0];
      r.casting_time_progress = times[0];
      r.casting_time_length = times[1];
      return r;
    }

    public SpellCastingData GetFocusCastingData() {
      if (!HasProcess() || focus_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(focus_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;

      IntPtr spell_id_addr = IntPtr.Add(entity_ptr, kEntityStructureOffsetCastingId);
      IntPtr spell_times_addr = IntPtr.Add(entity_ptr, kEntityStructureOffsetCastingTimeProgress);

      Int32[] id = Read32(spell_id_addr, 1);
      if (id == null)
        return null;
      float[] times = ReadSingle(spell_times_addr, 2);
      if (times == null)
        return null;

      var r = new SpellCastingData();
      r.cast_id = id[0];
      r.casting_time_progress = times[0];
      r.casting_time_length = times[1];
      return r;
    }

    public class RedMageJobData {
      public int white;
      public int black;
    }

    public RedMageJobData GetRedMage() {
      if (!HasProcess() || rdm_mana_outer_addr_ == IntPtr.Zero)
        return null;

      IntPtr rdm_inner_ptr = ReadIntPtr(rdm_mana_outer_addr_);
      if (rdm_inner_ptr == IntPtr.Zero) {
        // The pointer can be null when not logged in.
        return null;
      }

      IntPtr rdm_mana_addr = IntPtr.Add(rdm_inner_ptr, kRedMageManaDataInnerStructureOffset);
      byte[] mana = Read8(rdm_mana_addr, 2);
      if (mana == null)
        return null;

      var r = new RedMageJobData();
      r.white = mana[0];
      r.black = mana[1];
      return r;
    }

    public class WarriorJobData {
      public int beast;
    }

    public WarriorJobData GetWarrior() {
      if (!HasProcess() || warrior_outer_addr_ == IntPtr.Zero)
        return null;

      IntPtr warrior_inner_ptr = ReadIntPtr(warrior_outer_addr_);
      if (warrior_inner_ptr == IntPtr.Zero)
        return null;

      IntPtr beast_addr = IntPtr.Add(warrior_inner_ptr, kWarriorInnerDataStructureOffset);
      byte[] beast = Read8(beast_addr, 1);
      if (beast == null)
        return null;

      var j = new WarriorJobData();
      j.beast = beast[0];
      return j;
    }

    /// Reads |count| bytes at |addr| in the |process_|. Returns null on error.
    private byte[] Read8(IntPtr addr, int count) {
      int buffer_len = 1 * count;
      var buffer = new byte[buffer_len];
      var bytes_read = IntPtr.Zero;
      bool ok = NativeMethods.ReadProcessMemory(process_.Handle, addr, buffer, new IntPtr(buffer_len), ref bytes_read);
      if (!ok || bytes_read.ToInt32() != buffer_len)
        return null;
      return buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 16bit ints. Returns null on error.
    private Int16[] Read16(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 2);
      if (buffer == null)
        return null;
      var out_buffer = new Int16[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToInt16(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 32bit ints. Returns null on error.
    private Int32[] Read32(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 4);
      if (buffer == null)
        return null;
      var out_buffer = new Int32[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToInt32(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 32bit uints. Returns null on error.
    private UInt32[] Read32U(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 4);
      if (buffer == null)
        return null;
      var out_buffer = new UInt32[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToUInt32(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 32bit floats. Returns null on error.
    private float[] ReadSingle(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 4);
      if (buffer == null)
        return null;
      var out_buffer = new float[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToSingle(buffer, 4 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 64bit ints. Returns null on error.
    private Int64[] Read64(IntPtr addr, int count) {
      var buffer = Read8(addr, count * 8);
      if (buffer == null)
        return null;
      var out_buffer = new Int64[count];
      for (int i = 0; i < count; ++i)
        out_buffer[i] = BitConverter.ToInt64(buffer, 8 * i);
      return out_buffer;
    }

    /// Reads |addr| in the |process_| and returns it as a 64bit pointer. Returns 0 on error.
    private IntPtr ReadIntPtr(IntPtr addr) {
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
    private List<IntPtr> SigScan(string pattern, int offset, bool rip_addressing) {
      List<IntPtr> matches_list = new List<IntPtr>();

      if (pattern == null || pattern.Length % 2 != 0) {
        logger_.LogError("Invalid signature pattern: " + pattern);
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