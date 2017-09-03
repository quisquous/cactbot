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
    private IntPtr job_data_outer_addr_ = IntPtr.Zero;

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
    //   0x169E bytes in: int16 gp;
    //   0x16A0 bytes in: int16 maxgp;
    //   0x16A2 bytes in: int16 cp;
    //   0x16A4 bytes in: int16 maxcp;
    //   ...
    //   0x16C2 bytes in: EntityJob job;  // 1 byte.
    //   ...
    //   0x16C4 bytes in: int16 level;
    //   ...
    //   0x18B4 bytes in: int casting_spell_id;  // 4 bytes (maybe 2?)
    //   ...
    //   0x18E4 bytes in: float32 casting_spell_time_spent;  // 4 bytes
    //   0x18E8 bytes in: float32 casting_spell_length;      // 4 bytes
    // }
    private static int kEntityStructureSize = 0x18E8 + 4;
    private static int kEntityStructureSizeName = 0x44;
    private static int kEntityStructureOffsetName = 0x30;
    private static int kEntityStructureOffsetId = 0x74;
    private static int kEntityStructureOffsetType = 0x8C;
    private static int kEntityStructureOffsetDistance = 0x92;
    private static int kEntityStructureOffsetPos = 0xA0;
    private static int kEntityStructureOffsetHpMpTp = 0x168C;
    private static int kEntityStructureOffsetGpCp = 0x169E;
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

    // For reference, the warrior job points to the same structure at this signature.
    // ffxiv_dx11.exe+77B600: mov rcx,[???]
    // ffxiv_dx11.exe+77B61B: mov ebx, [rcx+08]
    // private static String kWarriorSignature = "488B0D????????4885C974B8488B05";
    // TODO: If need more signature, prepend "B83C020000E9????????"
    // TODO: If need more signature, append "????????3C0374043C1575A90FB659084533C9".

    // The op before the pointer wildcard in the signature reads a pointer-to-a-pointer
    // to the job-specific data structure. We call it |outer| below:
    //
    // JobDataOuterStruct* outer;  // This pointer found from the signature.
    // JobDataOuterStruct {
    //   JobDataInnerStruct* inner;  // This points to the address after it currently.
    //   JobDataInnerStruct {
    //      SomeJobSpecificStruct* struct;  // This is a pointer that changes when you change job, and points to a lot of other pointers.
    //      union JobSpecificData {
    //        struct RedMage {
    //          0x8 bytes in: byte white_mana;
    //          0x9 bytes in: byte black_mana;
    //        }
    //        struct Warrior {
    //          0x8 bytes in: byte beast;
    //        }
    //        struct Bard {
    //          0x8 bytes in: uint16 song_ms;  // Number of ms left in current song.
    //          0xA bytes in: byte song_procs_count;
    //          0xB bytes in: byte song_id;  // 5 = ballad, 10 = paeon, 15 = minuet.
    //        }
    //        struct Ninja {
    //          0x8 bytes in: uint32 huton_ms;  // Number of ms left in huton.
    //        }
    //        struct BlackMage {
    //          0x8 bytes in: uint16 polygot_time_ms;  // Number of ms left before polygot proc.
    //          0xA bytes in: uint16 umbral_time_ms;  // Number of ms left in umbral fire/ice.
    //          0xC bytes in: uchar umbral_state;  // Positive = Umbral Fire Stacks, Negative = Umbral Ice Stacks.
    //          0xD bytes in: uchar umbral_hearts_count;
    //          0xE bytes in: uchar enochian_state;  // Bit 0 = Enochian active. Bit 1 = Polygot active.
    //        }
    //        struct SummonerAndScholar {
    //          0x8 bytes in: 4 bytes ???
    //          0xC bytes in: uchar aetherflow_stacks;
    //        }
    //      }
    //   }
    // }
    private static int kJobDataOuterStructOffset = 0;
    private static int kJobDataInnerStructSize = 8 + 7;
    private static int kJobDataInnerStructOffsetJobSpecificData = 8;

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
        job_data_outer_addr_ = IntPtr.Zero;
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
            job_data_outer_addr_ = IntPtr.Add(p[0], kJobDataOuterStructOffset);
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
      public short gp = 0;
      public short max_gp = 0;
      public short cp = 0;
      public short max_cp = 0;
      public EntityJob job = EntityJob.None;
      public short level = 0;

      public override bool Equals(object obj) {
        return obj is EntityData && (EntityData)obj == this;
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
        hash = hash * 31 + hp.GetHashCode();
        hash = hash * 31 + max_hp.GetHashCode();
        hash = hash * 31 + mp.GetHashCode();
        hash = hash * 31 + max_mp.GetHashCode();
        hash = hash * 31 + tp.GetHashCode();
        hash = hash * 31 + gp.GetHashCode();
        hash = hash * 31 + max_gp.GetHashCode();
        hash = hash * 31 + cp.GetHashCode();
        hash = hash * 31 + max_cp.GetHashCode();
        hash = hash * 31 + job.GetHashCode();
        hash = hash * 31 + level.GetHashCode();
        return hash;
      }

      public static bool operator ==(EntityData a, EntityData b) {
        bool a_null = object.ReferenceEquals(a, null);
        bool b_null = object.ReferenceEquals(b, null);
        if (a_null && b_null) return true;
        if (a_null || b_null) return false;
        return
          a.name == b.name &&
          a.id == b.id &&
          a.type == b.type &&
          a.distance == b.distance &&
          a.pos_x == b.pos_x &&
          a.pos_y == b.pos_y &&
          a.pos_z == b.pos_z &&
          a.hp == b.hp &&
          a.max_hp == b.max_hp &&
          a.mp == b.mp &&
          a.max_mp == b.max_mp &&
          a.tp == b.tp &&
          a.gp == b.gp &&
          a.max_gp == b.max_gp &&
          a.cp == b.cp &&
          a.max_cp == b.max_cp &&
          a.job == b.job &&
          a.level == b.level;
      }

      public static bool operator !=(EntityData a, EntityData b) {
        return !(a == b);
      }
    }

    public class SpellCastingData {
      public int casting_id = 0;
      public float casting_time_progress = 0;
      public float casting_time_length = 0;
    }

    private Tuple<EntityData, SpellCastingData> GetEntityData(IntPtr entity_ptr) {
      byte[] bytes = Read8(entity_ptr, kEntityStructureSize);
      if (bytes == null)
        return null;

      EntityData data = new EntityData();
      SpellCastingData casting_data = null;

      int name_length = kEntityStructureSizeName;
      for (int i = 0; i < kEntityStructureSizeName; ++i) {
        if (bytes[kEntityStructureOffsetName + i] == '\0') {
          name_length = i;
          break;
        }
      }
      data.name = System.Text.Encoding.UTF8.GetString(bytes, kEntityStructureOffsetName, name_length);
      data.id = BitConverter.ToUInt32(bytes, kEntityStructureOffsetId);
      data.type = (EntityType)bytes[kEntityStructureOffsetType];
      data.distance = bytes[kEntityStructureOffsetDistance];
      data.pos_x = BitConverter.ToSingle(bytes, kEntityStructureOffsetPos);
      data.pos_z = BitConverter.ToSingle(bytes, kEntityStructureOffsetPos + 4);
      data.pos_y = BitConverter.ToSingle(bytes, kEntityStructureOffsetPos + 8);

      if (data.type == EntityType.PC || data.type == EntityType.Monster) {
        data.hp = BitConverter.ToInt32(bytes, kEntityStructureOffsetHpMpTp);
        data.max_hp = BitConverter.ToInt32(bytes, kEntityStructureOffsetHpMpTp + 4);
        data.mp = BitConverter.ToInt32(bytes, kEntityStructureOffsetHpMpTp + 8);
        data.max_mp = BitConverter.ToInt32(bytes, kEntityStructureOffsetHpMpTp + 12);
        data.tp = BitConverter.ToInt16(bytes, kEntityStructureOffsetHpMpTp + 16);
        data.gp = BitConverter.ToInt16(bytes, kEntityStructureOffsetGpCp);
        data.max_gp = BitConverter.ToInt16(bytes, kEntityStructureOffsetGpCp + 2);
        data.cp = BitConverter.ToInt16(bytes, kEntityStructureOffsetGpCp + 4);
        data.max_cp = BitConverter.ToInt16(bytes, kEntityStructureOffsetGpCp + 6);
        data.job = (EntityJob)bytes[kEntityStructureOffsetJob];
        data.level = BitConverter.ToInt16(bytes, kEntityStructureOffsetLevel);

        casting_data = new SpellCastingData();
        casting_data.casting_id = BitConverter.ToInt32(bytes, kEntityStructureOffsetCastingId);
        casting_data.casting_time_progress = BitConverter.ToSingle(bytes, kEntityStructureOffsetCastingTimeProgress);
        casting_data.casting_time_length = BitConverter.ToSingle(bytes, kEntityStructureOffsetCastingTimeProgress + 4);
      }

      return Tuple.Create(data, casting_data);
    }

    public Tuple<EntityData, SpellCastingData> GetSelfData() {
      if (!HasProcess() || player_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(player_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;
      return GetEntityData(entity_ptr);
    }

    public Tuple<EntityData, SpellCastingData> GetTargetData() {
      if (!HasProcess() || target_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(target_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;
      return GetEntityData(entity_ptr);
    }

    public Tuple<EntityData, SpellCastingData> GetFocusData() {
      if (!HasProcess() || focus_ptr_addr_ == IntPtr.Zero)
        return null;

      IntPtr entity_ptr = ReadIntPtr(focus_ptr_addr_);
      if (entity_ptr == IntPtr.Zero)
        return null;
      return GetEntityData(entity_ptr);
    }

    private byte[] GetJobSpecificData() {
      if (!HasProcess() || job_data_outer_addr_ == IntPtr.Zero)
        return null;

      IntPtr job_inner_ptr = ReadIntPtr(job_data_outer_addr_);
      if (job_inner_ptr == IntPtr.Zero) {
        // The pointer can be null when not logged in.
        return null;
      }

      return Read8(job_inner_ptr, kJobDataInnerStructSize);
    }

    public class RedMageJobData {
      public int white = 0;
      public int black = 0;

      public override bool Equals(object obj) {
        var o = obj as RedMageJobData;
        return o != null &&
          white == o.white &&
          black == o.black;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + white.GetHashCode();
        hash = hash * 31 + black.GetHashCode();
        return hash;
      }
    }

    public RedMageJobData GetRedMage() {
      byte[] bytes = GetJobSpecificData();
      if (bytes == null)
        return null;

      var j = new RedMageJobData();
      j.white = bytes[kJobDataInnerStructOffsetJobSpecificData];
      j.black = bytes[kJobDataInnerStructOffsetJobSpecificData + 1];
      return j;
    }

    public class WarriorJobData {
      public int beast = 0;

      public override bool Equals(object obj) {
        var o = obj as WarriorJobData;
        return o != null &&
          beast == o.beast;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + beast.GetHashCode();
        return hash;
      }
    }

    public WarriorJobData GetWarrior() {
      byte[] bytes = GetJobSpecificData();
      if (bytes == null)
        return null;

      var j = new WarriorJobData();
      j.beast = bytes[kJobDataInnerStructOffsetJobSpecificData];
      return j;
    }

    public class BardJobData {
      public uint song_ms = 0;
      public int song_procs = 0;

      public enum Song {
        None = 0,
        Ballad = 5,  // Mage's Ballad.
        Paeon = 10,  // Army's Paeon.
        Minuet = 15,  // The Wanderer's Minuet.
      }
      public Song song_type = Song.None;

      public override bool Equals(object obj) {
        var o = obj as BardJobData;
        return o != null &&
          song_ms == o.song_ms &&
          song_procs == o.song_procs &&
          song_type == o.song_type;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + song_ms.GetHashCode();
        hash = hash * 31 + song_procs.GetHashCode();
        hash = hash * 31 + song_type.GetHashCode();
        return hash;
      }
    }

    public BardJobData GetBard() {
      byte[] bytes = GetJobSpecificData();
      if (bytes == null)
        return null;

      // Note: When the song time is 0, the other fields are not well defined and may be left
      // in an incorrect state.
      var j = new BardJobData();
      j.song_ms = BitConverter.ToUInt16(bytes, kJobDataInnerStructOffsetJobSpecificData);
      if (j.song_ms == 0) {
        j.song_procs = 0;
        j.song_type = BardJobData.Song.None;
      } else {
        j.song_procs = bytes[kJobDataInnerStructOffsetJobSpecificData + 2];
        j.song_type = (BardJobData.Song)bytes[kJobDataInnerStructOffsetJobSpecificData + 3];
      }
      return j;
    }

    public class NinjaJobData {
      public uint huton_ms = 0;

      public override bool Equals(object obj) {
        var o = obj as NinjaJobData;
        return o != null &&
          huton_ms == o.huton_ms;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + huton_ms.GetHashCode();
        return hash;
      }
    }

    public NinjaJobData GetNinja() {
      byte[] bytes = GetJobSpecificData();
      if (bytes == null)
        return null;

      var j = new NinjaJobData();
      j.huton_ms = BitConverter.ToUInt32(bytes, kJobDataInnerStructOffsetJobSpecificData);
      return j;
    }

    public class BlackMageJobData {
      public uint polygot_time_ms = 0;
      public uint umbral_time_ms = 0;
      public int umbral_stacks = 0;
      public int umbral_hearts = 0;
      public bool enochian_active = false;
      public bool polygot_active = false;

      public override bool Equals(Object obj) {
        var o = obj as BlackMageJobData;
        return o != null &&
          polygot_time_ms == o.polygot_time_ms &&
          umbral_time_ms == o.umbral_time_ms &&
          umbral_stacks == o.umbral_stacks &&
          umbral_hearts == o.umbral_hearts &&
          enochian_active == o.enochian_active &&
          polygot_active == o.polygot_active;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + polygot_time_ms.GetHashCode();
        hash = hash * 31 + umbral_time_ms.GetHashCode();
        hash = hash * 31 + umbral_stacks.GetHashCode();
        hash = hash * 31 + umbral_hearts.GetHashCode();
        hash = hash * 31 + enochian_active.GetHashCode();
        hash = hash * 31 + polygot_active.GetHashCode();
        return hash;
      }
    }

    public BlackMageJobData GetBlackMage() {
      byte[] bytes = GetJobSpecificData();
      if (bytes == null)
        return null;

      var j = new BlackMageJobData();
      j.polygot_time_ms = BitConverter.ToUInt16(bytes, kJobDataInnerStructOffsetJobSpecificData);
      j.umbral_time_ms = BitConverter.ToUInt16(bytes, kJobDataInnerStructOffsetJobSpecificData + 2);
      byte stacks = bytes[kJobDataInnerStructOffsetJobSpecificData + 4];
      if (stacks <= 0x80)
        j.umbral_stacks = stacks;
      else
        j.umbral_stacks = -(0xff + 1 - stacks);
      j.umbral_hearts = bytes[kJobDataInnerStructOffsetJobSpecificData + 5];
      j.enochian_active = (bytes[kJobDataInnerStructOffsetJobSpecificData + 6] & (1 << 0)) != 0;
      j.polygot_active = (bytes[kJobDataInnerStructOffsetJobSpecificData + 6] & (1 << 1)) != 0;
      return j;
    }

    public class SummonerAndScholarJobData {
      public int aetherflow_stacks = 0;

      public override bool Equals(Object obj) {
        var o = obj as SummonerAndScholarJobData;
        return o != null &&
          aetherflow_stacks == o.aetherflow_stacks;
      }

      public override int GetHashCode() {
        int hash = 17;
        hash = hash * 31 + aetherflow_stacks.GetHashCode();
        return hash;
      }
    }

    public SummonerAndScholarJobData GetSummonerAndScholar() {
      byte[] bytes = GetJobSpecificData();
      if (bytes == null)
        return null;

      var j = new SummonerAndScholarJobData();
      j.aetherflow_stacks = bytes[kJobDataInnerStructOffsetJobSpecificData + 4];
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
        out_buffer[i] = BitConverter.ToInt16(buffer, 2 * i);
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