using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;

namespace Cactbot {

   // Exposes the FFXIV game directly. Call FindProcess() regularly to update
   // memory addresses when FFXIV is run or closed.
   public class FFXIVProcess {
      private ILogger logger_ = null;
      bool showed_dx9_error_ = false;
      private Process process_ = null;
      private IntPtr player_ptr_addr_ = IntPtr.Zero;
      private IntPtr target_ptr_addr_ = IntPtr.Zero;
      private IntPtr focus_ptr_addr_ = IntPtr.Zero;
      private IntPtr job_data_outer_addr_ = IntPtr.Zero;
      private IntPtr in_combat_addr_ = IntPtr.Zero;
      private IntPtr bait_addr_ = IntPtr.Zero;

      // A piece of code that reads the pointer to the list of all entities, that we
      // refer to as the charmap. The pointer is the first ????????.
      private static String kCharmapSignature = "488B1D????????488BFA33D2488BCF";
      private static int kCharmapSignatureOffset = -12;
      // The signature finds a pointer in the executable code which uses RIP addressing.
      private static bool kCharmapSignatureRIP = true;
      // The pointer is to a structure as:
      //
      // CharmapStruct* outer;  // The pointer found from the signature.
      // CharmapStruct {
      //   EntityStruct* player;
      // }
      private static int kCharmapStructOffsetPlayer = 0;

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

      // In combat boolean.
      // Variable is set at 83FA587D70534883EC204863C2410FB6D8381C08744E (offset=0)
      // via a mov [rax+rcx],bl line.
      // This sig below finds the calling function that sets rax(offset) and rcx(base address).
      private static String kInCombatSignature = "84C07425450FB6C7488D0D";
      private static int kInCombatBaseOffset = 0;
      private static bool kInCombatBaseRIP = true;
      private static int kInCombatOffsetOffset = 5;
      private static bool kInCombatOffsetRIP = false;

      // Bait integer.
      // Variable is accessed via a cmp eax,[...] line at offset=0.
      private static String kBaitSignature = "4883C4305BC3498BC8E8????????3B05";
      private static int kBaitBaseOffset = 0;
      private static bool kBaitBaseRIP = true;

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

      static bool IsGatherer(EntityJob job) {
         return job == EntityJob.FSH || job == EntityJob.MIN || job == EntityJob.BTN;
      }

      static bool IsCrafter(EntityJob job) {
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

      // EntityStruct {
      //   ...
      //   0x30 bytes in: string name;  // 0x44 bytes.
      //   ...
      //   0x74 bytes in: uint32 id;
      //   ...
      //   0x8C bytes in: EntityType type;  // 1 byte.
      //   ...
      //   0xA0 bytes in: float32 pos_x;
      //   0xA4 bytes in: float32 pos_z;
      //   0xA8 bytes in: float32 pos_y;
      //   ...
      //   0x18B8 bytes in:
      //     0x000 bytes in: int32 hp;
      //     0x004 bytes in: int32 maxhp;
      //     0x008 bytes in: int32 mp;
      //     0x00C bytes in: int32 maxmp;
      //     0x012 bytes in: int16 gp;
      //     0x014 bytes in: int16 maxgp;
      //     0x016 bytes in: int16 cp;
      //     0x018 bytes in: int16 maxcp;
      //     ...
      //     0x03C bytes in: EntityJob job;  // 1 byte.
      //     ...
      //     0x03E bytes in: int8 level;
      // }

      [StructLayout(LayoutKind.Explicit)]
      public unsafe struct EntityMemory {
         public static int Size => Marshal.SizeOf(typeof(EntityMemory));

         // Unknown size, but this is the bytes up to the next field.
         public const int nameBytes = 68;

         [FieldOffset(0x30)]
         public fixed byte Name[nameBytes];

         [FieldOffset(0x74)]
         public uint id;

         [FieldOffset(0x8C)]
         public EntityType type;

         [FieldOffset(0x92)]
         public ushort distance;

         [FieldOffset(0xA0)]
         public Single pos_x;

         [FieldOffset(0xA4)]
         public Single pos_y;

         [FieldOffset(0xA8)]
         public Single pos_z;

         [FieldOffset(0x18B8)]
         public CharacterDetails charDetails;

      }

      [StructLayout(LayoutKind.Explicit)]
      public struct CharacterDetails {

         [FieldOffset(0x00)]
         public int hp;

         [FieldOffset(0x04)]
         public int max_hp;

         [FieldOffset(0x08)]
         public int mp;

         [FieldOffset(0x0C)]
         public int max_mp;

         [FieldOffset(0x12)]
         public short gp;

         [FieldOffset(0x14)]
         public short max_gp;

         [FieldOffset(0x16)]
         public short cp;

         [FieldOffset(0x18)]
         public short max_cp;

         [FieldOffset(0x3C)]
         public EntityJob job;

         [FieldOffset(0x3E)]
         public short level;

         [FieldOffset(0x5F)]
         public short shieldPercentage;
      }

      // A piece of code that reads the job data.
      // The pointer of interest is the first ???????? in the signature.
      private static String kJobDataSignature = "488B0D????????4885C90F84????????488B05????????3C03";
      private static int kJobDataSignatureOffset = -22;
      // The signature finds a pointer in the executable code which uses RIP addressing.
      private static bool kJobDataSignatureRIP = true;

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
      //        struct DarkKnight {
      //          0x8 bytes in: byte blood;
      //          0xA bytes in: uint16 darkside_ms;
      //        }
      //        struct Paladin {
      //          0x8 bytes in: byte oath;
      //        }
      //
      //        struct Gunbreaker { //TODO
      //          0x8 bytes in: byte cartridges;
      //          0xA bytes in: uint16 unknown; // Notes: Jumps to 15000 (ms?) after using Gnashing Fang, doesn't decrease.
      //          0xC bytes in: byte continuation_state; // ? Seems to follow Continuation procs.
      //        }
      //       
      //        struct Bard { 
      //          0x8 bytes in: uint16 song_ms;  // Number of ms left in current song.
      //          0xA bytes in: byte song_procs_count;
      //          0xB bytes in: byte soul_gauge;
      //          0xC bytes in: byte song_id;  // 5 = ballad, 10 = paeon, 15 = minuet.
      //        }
      //        struct Dragoon { // needs testing
      //          0x8 bytes in: uint16 blood_or_life_ms;  // Number of ms left in Blood/Life of the Dragon.
      //          0xA bytes in: uchar stance;  // 0 = None, 1 = Blood, 2 = Life
      //          0xB bytes in: uchar eyes_amount;
      //        }
      //        struct Ninja {
      //          0x8 bytes in: uint16 huton_ms;  // Number of ms left in huton.
      //          0xD bytes in: uchar ninki_amount;
      //        }
      //        struct BlackMage {
      //          0x8 bytes in: uint16 polygot_time_ms;  // Number of ms left before polygot proc.
      //          0xA bytes in: uint16 umbral_time_ms;  // Number of ms left in umbral fire/ice.
      //          0xC bytes in: uchar umbral_state;  // Positive = Umbral Fire Stacks, Negative = Umbral Ice Stacks.
      //          0xD bytes in: uchar umbral_hearts_count;
      //          0xE bytes in: uchar foul_count;
      //          0xF bytes in: uchar enochian_state;  // Bit 0 = Enochian active. Bit 1 = Polygot active.
      //        }
      //        struct WhiteMage {
      //          0xA bytes in: uint16 lilies_ms; // Number of ms left before lily gain.
      //          0xC bytes in: byte lily_stacks;
      //          0xD bytes in: byte bloodlily_stacks;
      //        }
      //        struct Summoner { // needs testing
      //          0x8 bytes in: uint16 stance_ms;  // Dreadwyrm or Bahamut/Phoenix time left in ms.
      //          0xA bytes in: byte bahamut_stance;  // 5 if Bahamut/Phoenix summoned, else 0.
      //          0xB bytes in: byte bahamut_summonned; // 1 if Bahamut/Phoenix summoned, else 0.
      //          0xC bytes in: uchar stacks;  // Bits 3-4: Dreadwyrm. Bit 5: Phoenix ready.
      //        }
      //        struct Scholar { // needs testing
      //          0xA bytes in: uchar aetherflow_stacks;
      //          0xB bytes in: uchar fairy_gauge;
      //          0xC bytes in: uint16 fairy_ms; // Seraph time left ms.
      //          0xE bytes in: uchar fairy_status; // 7 if Seraph is summoned or 6 if dissipation is active, else 0.
      //        }
      //        struct Monk {
      //          0x8 bytes in: uint16 greased_lightning_time_ms;
      //          0xA bytes in: uchar greased_lightning_stacks;
      //          0xB bytes in: uchar chakra_stacks;
      //        }
      //        struct Machinist {
      //          0x8 bytes in: uint16 overheat_ms;
      //          0xA bytes in: uint16 battery_ms;
      //          0XC bytes in: uchar heat;
      //          0xD bytes in: uchar battery;
      //        }
      //        struct Astrologian { 
      //          0xC bytes in: byte held_card; // 1 - Balance, 2 - Bole, 3 - Arrow, 4 - Spear, 5 - Ewer, 6 - Spire, else 0.
      //          0xD bytes in: byte arcanum_1  // Arcanum of first played card.  1 - Solar    - (Balance/Bole).
      //          0xE bytes in: byte arcanum_2  // Arcanum of second played card. 2 - Lunar    - (Ewer/Arrow).
      //          0xF bytes in: byte arcanum_3  // Arcanum of third played card.  3 - Celstial - (Spear/Spire).
      //        }
      //        struct Samurai {
      //          0xA bytes in: byte kenki;
      //          0xB bytes in: byte sen_bits; // 0x1 setsu, 0x2 getsu, 0x4 ka.
      //        }
      private static int kJobDataOuterStructOffset = 0;
      private static int kJobDataInnerStructSize = 8 + 8;
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

               p = SigScan(kJobDataSignature, kJobDataSignatureOffset, kJobDataSignatureRIP);
               if (p.Count != 1) {
                  logger_.LogError("Job signature found " + p.Count + " matches");
               } else {
                  job_data_outer_addr_ = IntPtr.Add(p[0], kJobDataOuterStructOffset);
               }

               p = SigScan(kInCombatSignature, kInCombatBaseOffset, kInCombatBaseRIP);
               if (p.Count != 1) {
                  logger_.LogError("In combat signature found " + p.Count + " matches");
               } else {
                  var baseAddress = p[0];
                  p = SigScan(kInCombatSignature, kInCombatOffsetOffset, kInCombatOffsetRIP);
                  if (p.Count != 1) {
                     logger_.LogError("In combat offset signature found " + p.Count + " matches");
                  } else {
                     // Abuse sigscan here to return 64-bit "pointer" which we will mask into the 32-bit immediate integer we need.
                     // TODO: maybe sigscan should be able to return different types?
                     int offset = (int)(((UInt64)p[0]) & 0xFFFFFFFF);
                     in_combat_addr_ = IntPtr.Add(baseAddress, offset);
                  }
               }

               p = SigScan(kBaitSignature, kBaitBaseOffset, kBaitBaseRIP);
               if (p.Count != 1) {
                  logger_.LogError("Bait signature found " + p.Count + " matches");
               } else {
                  bait_addr_ = p[0];
               }
            }
         }

         if (process_ == null && !showed_dx9_error_) {
            int found_32bit = (from x in Process.GetProcessesByName("ffxiv")
                               where !x.HasExited && x.MainModule != null && x.MainModule.ModuleName == "ffxiv.exe"
                               select x).Count();
            if (found_32bit > 0) {
               logger_.LogError("Found DirectX9 FFXIV process. Requires DirectX11.");
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

      private int GetBait() {
         short[] jorts = Read16(bait_addr_, 1);
         return jorts[0];
      }

      public unsafe EntityData GetEntityDataFromByteArray(byte[] source) {
         fixed (byte* p = source) {
            EntityMemory mem = *(EntityMemory*)&p[0];

            EntityData entity = new EntityData() {
               //dump '\0' string terminators
               name = System.Text.Encoding.UTF8.GetString(mem.Name, EntityMemory.nameBytes).Split(new[] { '\0' }, 2)[0],
               id = mem.id,
               type = mem.type,
               distance = mem.distance,
               pos_x = mem.pos_x,
               pos_y = mem.pos_y,
               pos_z = mem.pos_z,
            };
            if (entity.type == EntityType.PC || entity.type == EntityType.Monster) {
               entity.job = mem.charDetails.job;

               entity.hp = mem.charDetails.hp;
               entity.max_hp = mem.charDetails.max_hp;
               entity.mp = mem.charDetails.mp;
               entity.max_mp = mem.charDetails.max_mp;
               entity.shield_value = mem.charDetails.shieldPercentage * entity.max_hp / 100;

               if (IsGatherer(entity.job)) {
                  entity.gp = mem.charDetails.gp;
                  entity.max_gp = mem.charDetails.max_gp;
               }
               if (IsCrafter(entity.job)) {
                  entity.cp = mem.charDetails.cp;
                  entity.max_cp = mem.charDetails.max_cp;
               }

               entity.level = mem.charDetails.level;

               byte[] job_bytes = GetJobSpecificData();
               if (job_bytes != null) {
                  // Start at 8 to skip past the initial pointer.
                  for (var i = 8; i < job_bytes.Length; ++i) {
                     if (entity.debug_job != "")
                        entity.debug_job += " ";
                     entity.debug_job += string.Format("{0:x2}", job_bytes[i]);
                  }
               }
            }
            return entity;
         }
      }

      private EntityData GetEntityData(IntPtr entity_ptr) {
         if (entity_ptr == IntPtr.Zero)
            return null;
         byte[] source = Read8(entity_ptr, EntityMemory.Size);
         return GetEntityDataFromByteArray(source);

      }
      public EntityData GetSelfData() {
         if (!HasProcess() || player_ptr_addr_ == IntPtr.Zero)
            return null;

         IntPtr entity_ptr = ReadIntPtr(player_ptr_addr_);
         if (entity_ptr == IntPtr.Zero)
            return null;
         var data = GetEntityData(entity_ptr);
         if (data.job == EntityJob.FSH)
            data.bait = GetBait();
         return data;
      }

      public EntityData GetTargetData() {
         if (!HasProcess() || target_ptr_addr_ == IntPtr.Zero)
            return null;

         IntPtr entity_ptr = ReadIntPtr(target_ptr_addr_);
         if (entity_ptr == IntPtr.Zero)
            return null;
         return GetEntityData(entity_ptr);
      }

      public EntityData GetFocusData() {
         if (!HasProcess() || focus_ptr_addr_ == IntPtr.Zero)
            return null;

         IntPtr entity_ptr = ReadIntPtr(focus_ptr_addr_);
         if (entity_ptr == IntPtr.Zero)
            return null;
         return GetEntityData(entity_ptr);
      }

      public bool GetInGameCombat() {
         if (!HasProcess() || in_combat_addr_ == IntPtr.Zero)
            return false;
         var bytes = Read8(in_combat_addr_, 1);
         return bytes[0] != 0;
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

      [StructLayout(LayoutKind.Explicit)]
      public struct RedMageJobMemory {
         [FieldOffset(0x08)]
         public byte white;
         [FieldOffset(0x09)]
         public byte black;
      };

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

      public unsafe RedMageJobData GetRedMage() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               RedMageJobMemory mem = *(RedMageJobMemory*)&p[0];
               RedMageJobData j = new RedMageJobData() {
                  white = mem.white,
                  black = mem.black,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct WarriorJobMemory {
         [FieldOffset(0x08)]
         public byte beast;
      };

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

      public unsafe WarriorJobData GetWarrior() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               WarriorJobMemory mem = *(WarriorJobMemory*)&p[0];
               WarriorJobData j = new WarriorJobData() {
                  beast = mem.beast,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct DarkKnightJobMemory {
         [FieldOffset(0x08)]
         public byte blood;
         [FieldOffset(0x0A)]
         public ushort darkside_ms;
      };

      public class DarkKnightJobData {
         public int blood = 0;
         public int darkside_ms = 0;

         public override bool Equals(object obj) {
            var o = obj as DarkKnightJobData;
            return o != null &&
              blood == o.blood &&
              darkside_ms == o.darkside_ms;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + blood.GetHashCode();
            hash = hash * 31 + darkside_ms.GetHashCode();
            return hash;
         }
      }

      public unsafe DarkKnightJobData GetDarkKnight() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               DarkKnightJobMemory mem = *(DarkKnightJobMemory*)&p[0];
               DarkKnightJobData j = new DarkKnightJobData() {
                  blood = mem.blood,
                  darkside_ms = mem.darkside_ms,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct PaladinJobMemory {
         [FieldOffset(0x08)]
         public byte oath;
      };

      public class PaladinJobData {
         public int oath = 0;

         public override bool Equals(object obj) {
            var o = obj as PaladinJobData;
            return o != null &&
              oath == o.oath;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + oath.GetHashCode();
            return hash;
         }
      }

      public unsafe PaladinJobData GetPaladin() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               PaladinJobMemory mem = *(PaladinJobMemory*)&p[0];
               PaladinJobData j = new PaladinJobData() {
                  oath = mem.oath,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct GunbreakerJobMemory {
         [FieldOffset(0x08)]
         public byte cartridges;

         [FieldOffset(0x0A)]
         public ushort continuation_ms;

         [FieldOffset(0x0C)]
         public byte continuation_state;
      };

      [StructLayout(LayoutKind.Explicit)]
      public struct BardJobMemory {
         [FieldOffset(0x08)]
         public ushort song_ms;

         [FieldOffset(0x0A)]
         public byte song_procs;

         [FieldOffset(0x0B)]
         public byte soul_gauge;

         [FieldOffset(0x0C)]
         public byte song_type;
      };

      public class BardJobData {
         public uint song_ms = 0;
         public int song_procs = 0;
         public int soul_gauge = 0;

         public enum Song : byte {
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
              soul_gauge == o.soul_gauge &&
              song_type == o.song_type;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + song_ms.GetHashCode();
            hash = hash * 31 + song_procs.GetHashCode();
            hash = hash * 31 + soul_gauge.GetHashCode();
            hash = hash * 31 + song_type.GetHashCode();
            return hash;
         }
      }

      public unsafe BardJobData GetBard() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               BardJobMemory mem = *(BardJobMemory*)&p[0];
               BardJobData j = new BardJobData() {
                  song_ms = mem.song_ms,
                  song_procs = mem.song_procs,
                  soul_gauge = mem.soul_gauge,
                  song_type = (BardJobData.Song)mem.song_type,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct DragoonJobMemory {
         [FieldOffset(0x08)]
         public ushort blood_or_life_ms;

         [FieldOffset(0x0A)]
         public byte stance;

         [FieldOffset(0x0B)]
         public byte eyes_amount;
      };

      public class DragoonJobData {
         public uint blood_ms = 0;
         public uint life_ms = 0;
         public uint eyes_amount = 0;

         public override bool Equals(object obj) {
            var o = obj as DragoonJobData;
            return o != null &&
              blood_ms == o.blood_ms &&
              life_ms == o.life_ms &&
              eyes_amount == o.eyes_amount;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + blood_ms.GetHashCode();
            hash = hash * 31 + life_ms.GetHashCode();
            hash = hash * 31 + eyes_amount.GetHashCode();
            return hash;
         }
      }

      public unsafe DragoonJobData GetDragoon() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               DragoonJobMemory mem = *(DragoonJobMemory*)&p[0];
               DragoonJobData j = new DragoonJobData();
               if (mem.stance == 1) {
                  j.blood_ms = mem.blood_or_life_ms;
               } else if (mem.stance == 2) {
                  j.life_ms = mem.blood_or_life_ms;
               }
               j.eyes_amount = mem.eyes_amount;
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct NinjaJobMemory {
         [FieldOffset(0x08)]
         public ushort huton_ms;

         [FieldOffset(0x0A)]
         public byte ninki_amount;
      };

      public class NinjaJobData {
         public uint huton_ms = 0;
         public uint ninki_amount = 0;

         public override bool Equals(object obj) {
            var o = obj as NinjaJobData;
            return o != null &&
              huton_ms == o.huton_ms &&
              ninki_amount == o.ninki_amount;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + huton_ms.GetHashCode();
            hash = hash * 31 + ninki_amount.GetHashCode();
            return hash;
         }
      }

      public unsafe NinjaJobData GetNinja() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               NinjaJobMemory mem = *(NinjaJobMemory*)&p[0];
               NinjaJobData j = new NinjaJobData() {
                  huton_ms = mem.huton_ms,
                  ninki_amount = mem.ninki_amount,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct BlackMageJobMemory {
         [FieldOffset(0x08)]
         public ushort polyglot_time_ms;

         [FieldOffset(0x0A)]
         public ushort umbral_time_ms;

         [FieldOffset(0x0C)]
         public ushort umbral_state;

         [FieldOffset(0x0D)]
         public byte umbral_hearts_count;

         [FieldOffset(0x0E)]
         public byte foul_count;

         [FieldOffset(0x0F)]
         public byte enochian_state;
      };

      public class BlackMageJobData {
         public uint polygot_time_ms = 0;
         public uint umbral_time_ms = 0;
         public int umbral_stacks = 0;
         public int umbral_hearts = 0;
         public int foul_count = 0;
         public bool enochian_active = false;

         public override bool Equals(Object obj) {
            var o = obj as BlackMageJobData;
            return o != null &&
              polygot_time_ms == o.polygot_time_ms &&
              umbral_time_ms == o.umbral_time_ms &&
              umbral_stacks == o.umbral_stacks &&
              umbral_hearts == o.umbral_hearts &&
              foul_count == o.foul_count &&
              enochian_active == o.enochian_active;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + polygot_time_ms.GetHashCode();
            hash = hash * 31 + umbral_time_ms.GetHashCode();
            hash = hash * 31 + umbral_stacks.GetHashCode();
            hash = hash * 31 + umbral_hearts.GetHashCode();
            hash = hash * 31 + foul_count.GetHashCode();
            hash = hash * 31 + enochian_active.GetHashCode();
            return hash;
         }
      }

      public unsafe BlackMageJobData GetBlackMage() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               BlackMageJobMemory mem = *(BlackMageJobMemory*)&p[0];
               BlackMageJobData j = new BlackMageJobData() {
                  umbral_stacks = mem.umbral_state,
                  umbral_hearts = mem.umbral_hearts_count,
                  foul_count = mem.foul_count,
                  enochian_active = (mem.enochian_state & 0xF) == 1,
               };
               // Note: When the umbral stacks is 0, the timer may still run though it isn't relevant.
               if (j.umbral_stacks != 0)
                  j.umbral_time_ms = mem.umbral_time_ms;
               if (j.enochian_active)
                  j.polygot_time_ms = mem.polyglot_time_ms;
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct WhiteMageJobMemory {
         [FieldOffset(0x0A)]
         public ushort lilies_ms;

         [FieldOffset(0x0C)]
         public byte lily_stacks;

         [FieldOffset(0x0D)]  
         public byte bloodlily_stacks;
      };

      public class WhiteMageJobData {
         public uint lilies_ms = 0;
         public int lily_stacks = 0;
         public int bloodlily_stacks = 0;

         public override bool Equals(Object obj) {
            var o = obj as WhiteMageJobData;
            return o != null &&
              lilies_ms == o.lilies_ms &&
              lily_stacks == o.lily_stacks &&
              bloodlily_stacks == o.bloodlily_stacks;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + lilies_ms.GetHashCode();
            hash = hash * 31 + lily_stacks.GetHashCode();
            hash = hash * 31 + bloodlily_stacks.GetHashCode();
            return hash;
         }
      }

      public unsafe WhiteMageJobData GetWhiteMage() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               WhiteMageJobMemory mem = *(WhiteMageJobMemory*)&p[0];
               WhiteMageJobData j = new WhiteMageJobData() {
                  lilies_ms = mem.lilies_ms,
                  lily_stacks = mem.lily_stacks,
                  bloodlily_stacks = mem.bloodlily_stacks,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct SummonerJobMemory {
         [FieldOffset(0x08)]
         public ushort stance_ms;

         [FieldOffset(0x0A)]
         public byte bahamut_stance;

         [FieldOffset(0x0B)]
         public byte bahamut_summoned;

         [FieldOffset(0x0C)]
         public byte stacks;
      };

      public class SummonerJobData {
         public uint stance_ms = 0;
         public int bahamut_stance = 0;
         public int bahamut_summoned = 0;
         public int aetherflow_stacks = 0;
         public int dreadwyrm_stacks = 0;
         public int phoenix_ready = 0;

         public override bool Equals(Object obj) {
            var o = obj as SummonerJobData;
            return o != null &&
              stance_ms == o.stance_ms &&
              bahamut_stance == o.bahamut_stance &&
              bahamut_summoned == o.bahamut_summoned &&
              dreadwyrm_stacks == o.dreadwyrm_stacks &&
              phoenix_ready == o.phoenix_ready;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + stance_ms.GetHashCode();
            hash = hash * 31 + bahamut_stance.GetHashCode();
            hash = hash * 31 + bahamut_summoned.GetHashCode();
            hash = hash * 31 + dreadwyrm_stacks.GetHashCode();
            hash = hash * 31 + phoenix_ready.GetHashCode();
            return hash;
         }
      }

      public unsafe SummonerJobData GetSummoner() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               SummonerJobMemory mem = *(SummonerJobMemory*)&p[0];
               SummonerJobData j = new SummonerJobData() {
                  stance_ms = mem.stance_ms,
                  bahamut_stance = mem.bahamut_stance,
                  bahamut_summoned = mem.bahamut_summoned,
               };
               j.aetherflow_stacks = (mem.stacks >> 0) & 0x3;  // Bottom 2 bits.
               j.dreadwyrm_stacks = (mem.stacks >> 2) & 0x3; // Next 2 bits.
               j.phoenix_ready = (mem.stacks >> 4) & 0x3; // Next 2 bits.
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct ScholarJobMemory {
         [FieldOffset(0x0A)]
         public byte aetherflow_stacks;

         [FieldOffset(0x0B)]
         public byte fairy_gauge;

         [FieldOffset(0x0C)]
         public ushort fairy_ms;

         [FieldOffset(0x0E)]
         public byte fairy_status;
      };

      public class ScholarJobData {
         public int aetherflow_stacks = 0;
         public int fairy_gauge = 0;
         public uint fairy_ms = 0;
         public int fairy_status = 0;

         public override bool Equals(Object obj) {
            var o = obj as ScholarJobData;
            return o != null &&
              aetherflow_stacks == o.aetherflow_stacks &&
              fairy_gauge == o.fairy_gauge &&
              fairy_ms == o.fairy_ms &&
              fairy_status == o.fairy_status;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + aetherflow_stacks.GetHashCode();
            hash = hash * 31 + fairy_gauge.GetHashCode();
            hash = hash * 31 + fairy_ms.GetHashCode();
            hash = hash * 31 + fairy_status.GetHashCode();
            return hash;
         }
      }

      public unsafe ScholarJobData GetScholar() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               ScholarJobMemory mem = *(ScholarJobMemory*)&p[0];
               ScholarJobData j = new ScholarJobData() {
                  aetherflow_stacks = mem.aetherflow_stacks,
                  fairy_gauge = mem.fairy_gauge,
                  fairy_ms = mem.fairy_ms,
                  fairy_status = mem.fairy_status,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct MonkJobMemory {
         [FieldOffset(0x08)]
         public ushort greased_lightning_time_ms;

         [FieldOffset(0x0A)]
         public byte greased_lightning_stacks;

         [FieldOffset(0x0B)]
         public byte chakra_stacks;
      };

      public class MonkJobData {
         public uint lightning_ms = 0;
         public int lightning_stacks = 0;
         public int chakra_stacks = 0;

         public override bool Equals(object obj) {
            var o = obj as MonkJobData;
            return o != null &&
              lightning_ms == o.lightning_ms &&
              lightning_stacks == o.lightning_stacks &&
              chakra_stacks == o.chakra_stacks;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + lightning_ms.GetHashCode();
            hash = hash * 31 + lightning_stacks.GetHashCode();
            hash = hash * 31 + chakra_stacks.GetHashCode();
            return hash;
         }
      }

      public unsafe MonkJobData GetMonk() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               MonkJobMemory mem = *(MonkJobMemory*)&p[0];
               MonkJobData j = new MonkJobData() {
                  lightning_ms = mem.greased_lightning_time_ms,
                  lightning_stacks = mem.greased_lightning_stacks,
                  chakra_stacks = mem.chakra_stacks,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct MachinistJobMemory {
         [FieldOffset(0x08)]
         public ushort overheat_ms;

         [FieldOffset(0x0A)]
         public ushort battery_ms;

         [FieldOffset(0x0C)]
         public byte heat;

         [FieldOffset(0x0D)]
         public byte battery;
      };

      public class MachinistJobData {
         public int heat = 0;
         public uint overheat_ms = 0;
         public int battery = 0;
         public uint battery_ms = 0;

         public override bool Equals(object obj) {
            var o = obj as MachinistJobData;
            return o != null &&
              heat != o.heat &&
              overheat_ms != o.overheat_ms &&
              battery != o.battery_ms &&
              battery_ms != o.battery_ms;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + heat.GetHashCode();
            hash = hash * 31 + overheat_ms.GetHashCode();
            hash = hash * 31 + battery.GetHashCode();
            hash = hash * 31 + battery_ms.GetHashCode();
            return hash;
         }
      }

      public unsafe MachinistJobData GetMachinist() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               MachinistJobMemory mem = *(MachinistJobMemory*)&p[0];
               MachinistJobData j = new MachinistJobData() {
                  heat = mem.heat,
                  overheat_ms = mem.overheat_ms,
                  battery = mem.battery,
                  battery_ms = mem.battery_ms,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct AstrologianJobMemory {
         [FieldOffset(0x0C)]
         public byte held_card;

         [FieldOffset(0x0D)]
         public byte arcanum_1;

         [FieldOffset(0x0E)]
         public byte arcanum_2;

         [FieldOffset(0x0F)]
         public byte arcanum_3;
      };

      public class AstrologianJobData {
         public int held_card = 0;
         public int arcanum_1 = 0;
         public int arcanum_2 = 0;
         public int arcanum_3 = 0;

         public override bool Equals(object obj) {
            var o = obj as AstrologianJobData;
            return o != null &&
              held_card != o.held_card &&
              arcanum_1 != o.arcanum_1 &&
              arcanum_2 != o.arcanum_2 &&
              arcanum_3 != o.arcanum_3;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + held_card.GetHashCode();
            hash = hash * 31 + arcanum_1.GetHashCode();
            hash = hash * 31 + arcanum_2.GetHashCode();
            hash = hash * 31 + arcanum_3.GetHashCode();
            return hash;
         }
      }

      public unsafe AstrologianJobData GetAstrologian() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               AstrologianJobMemory mem = *(AstrologianJobMemory*)&p[0];
               AstrologianJobData j = new AstrologianJobData() {
                  held_card = mem.held_card,
                  arcanum_1 = mem.arcanum_1,
                  arcanum_2 = mem.arcanum_2,
                  arcanum_3 = mem.arcanum_3,
               };
               return j;
            }
         }
      }

      [StructLayout(LayoutKind.Explicit)]
      public struct SamuraiJobMemory {
         [FieldOffset(0x0C)]
         public byte kenki;

         [FieldOffset(0x0D)]
         public byte sen_bits;
      };

      public class SamuraiJobData {
         public int kenki = 0;
         public bool setsu = false;
         public bool getsu = false;
         public bool ka = false;

         public override bool Equals(object obj) {
            var o = obj as SamuraiJobData;
            return o != null &&
              kenki != o.kenki &&
              setsu != o.setsu &&
              getsu != o.getsu &&
              ka != o.ka;
         }

         public override int GetHashCode() {
            int hash = 17;
            hash = hash * 31 + kenki.GetHashCode();
            hash = hash * 31 + setsu.GetHashCode();
            hash = hash * 31 + getsu.GetHashCode();
            hash = hash * 31 + ka.GetHashCode();
            return hash;
         }
      }

      public unsafe SamuraiJobData GetSamurai() {
         fixed (byte* p = GetJobSpecificData()) {
            if (p == null)
               return null;
            else {
               SamuraiJobMemory mem = *(SamuraiJobMemory*)&p[0];
               SamuraiJobData j = new SamuraiJobData() {
                  kenki = mem.kenki,
               };
               j.setsu = (mem.sen_bits & 0x1) != 0;
               j.getsu = (mem.sen_bits & 0x2) != 0;
               j.ka = (mem.sen_bits & 0x4) != 0;
               return j;
            }
         }
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