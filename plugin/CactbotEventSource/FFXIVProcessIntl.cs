using System;
using System.Linq;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using CactbotEventSource.loc;

namespace Cactbot {
  public class FFXIVProcessIntl : FFXIVProcess {
    // Last updated for FFXIV 6.0

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
      public Single pos_z;

      [FieldOffset(0xA8)]
      public Single pos_y;

      [FieldOffset(0xB0)]
      public Single rotation;

      [FieldOffset(0x1C4)]
      public CharacterDetails charDetails;

      [FieldOffset(0x19D9)]
      public byte shieldPercentage;
    }

    [StructLayout(LayoutKind.Explicit)]
    public struct CharacterDetails {

      [FieldOffset(0x00)]
      public int hp;

      [FieldOffset(0x04)]
      public int max_hp;

      [FieldOffset(0x08)]
      public short mp;

      [FieldOffset(0x10)]
      public short gp;

      [FieldOffset(0x12)]
      public short max_gp;

      [FieldOffset(0x14)]
      public short cp;

      [FieldOffset(0x16)]
      public short max_cp;

      [FieldOffset(0x1C)]
      public EntityJob job;

      [FieldOffset(0x1D)]
      public byte level;
    }
    public FFXIVProcessIntl(ILogger logger) : base(logger) { }

    // TODO: all of this could be refactored into structures of some sort
    // instead of just being loose variables everywhere.

    // A piece of code that reads the pointer to the list of all entities, that we
    // refer to as the charmap. The pointer is the 4 byte ?????????.
    private static String kCharmapSignature = "48c1ea0381faa9010000????8bc2488d0d";
    private static int kCharmapSignatureOffset = 0;
    // The signature finds a pointer in the executable code which uses RIP addressing.
    private static bool kCharmapSignatureRIP = true;
    // The pointer is to a structure as:
    //
    // CharmapStruct* outer;  // The pointer found from the signature.
    // CharmapStruct {
    //   EntityStruct* player;
    // }
    private static int kCharmapStructOffsetPlayer = 0;

    // In combat boolean.
    // Variable seems to be set in two places:
    // * mov [rax+rcx],bl line (on its own, with a calling function that sets rax(offset) and rcx(base address); the old way)
    // * mov [address],eax line (this signature here)
    private static String kInCombatSignature = "4889742420574883EC200FB60233F68905";
    private static int kInCombatSignatureOffset = 0;
    private static bool kInCombatSignatureRIP = true;

    // Bait integer.
    // Variable is accessed via a cmp eax,[...] line at offset=0.
    private static String kBaitSignature = "4883C4305BC3498BC8E8????????3B05";
    private static int kBaitBaseOffset = 0;
    private static bool kBaitBaseRIP = true;

    // A piece of code that reads the job data.
    // The pointer of interest is the first ???????? in the signature.
    private static String kJobDataSignature = "488B0D????????4885C90F84????????488B05????????3C03";
    private static int kJobDataSignatureOffset = -22;
    // The signature finds a pointer in the executable code which uses RIP addressing.
    private static bool kJobDataSignatureRIP = true;

    internal override void ReadSignatures() {
      List<IntPtr> p;

      // TODO: for now, support multiple matches on charmap signature.
      // This sig returns two matches that are identical for many, many characters.
      // They both point to the same spot, so verify these have the same value.
      p = SigScan(kCharmapSignature, kCharmapSignatureOffset, kCharmapSignatureRIP);
      if (p.Count == 0) {
        logger_.LogError(Strings.CharmapSignatureFoundMultipleMatchesErrorMessage, p.Count);
      } else {
        IntPtr player_ptr_value = IntPtr.Zero;
        foreach (IntPtr ptr in p) {
          IntPtr addr = IntPtr.Add(ptr, kCharmapStructOffsetPlayer);
          IntPtr value = ReadIntPtr(addr);
          if (player_ptr_value == IntPtr.Zero || player_ptr_value == value) {
            player_ptr_value = value;
            player_ptr_addr_ = addr;
          } else {
            logger_.LogError(Strings.CharmapSignatureConflictingMatchErrorMessage);
          }
        }
      }

      p = SigScan(kJobDataSignature, kJobDataSignatureOffset, kJobDataSignatureRIP);
      if (p.Count != 1) {
        logger_.LogError(Strings.JobSignatureFoundMultipleMatchesErrorMessage, p.Count);
      } else {
        job_data_outer_addr_ = IntPtr.Add(p[0], kJobDataOuterStructOffset);
      }

      p = SigScan(kInCombatSignature, kInCombatSignatureOffset, kInCombatSignatureRIP);
      if (p.Count != 1) {
        logger_.LogError(Strings.InCombatSignatureFoundMultipleMatchesErrorMessage, p.Count);
      } else {
        in_combat_addr_ = p[0];
      }

      p = SigScan(kBaitSignature, kBaitBaseOffset, kBaitBaseRIP);
      if (p.Count != 1) {
        logger_.LogError(Strings.BaitSignatureFoundMultipleMatchesErrorMessage, p.Count);
      } else {
        bait_addr_ = p[0];
      }
    }

    public unsafe override EntityData GetEntityDataFromByteArray(byte[] source) {
      fixed (byte* p = source) {
        EntityMemory mem = *(EntityMemory*)&p[0];

        // dump '\0' string terminators
        var memoryName = System.Text.Encoding.UTF8.GetString(mem.Name, EntityMemory.nameBytes).Split(new[] { '\0' }, 2)[0];

        EntityData entity = new EntityData() {
          name = memoryName,
          id = mem.id,
          type = mem.type,
          distance = mem.distance,
          pos_x = mem.pos_x,
          pos_y = mem.pos_y,
          pos_z = mem.pos_z,
          rotation = mem.rotation,
        };
        if (entity.type == EntityType.PC || entity.type == EntityType.Monster) {
          entity.job = mem.charDetails.job;

          entity.hp = mem.charDetails.hp;
          entity.max_hp = mem.charDetails.max_hp;
          entity.mp = mem.charDetails.mp;
          // This doesn't exist in memory, so just send the right value.
          // As there are other versions that still have it, don't change the event.
          entity.max_mp = 10000;
          entity.shield_value = mem.shieldPercentage * entity.max_hp / 100;

          if (IsGatherer(entity.job)) {
            entity.gp = mem.charDetails.gp;
            entity.max_gp = mem.charDetails.max_gp;
          }
          if (IsCrafter(entity.job)) {
            entity.cp = mem.charDetails.cp;
            entity.max_cp = mem.charDetails.max_cp;
          }

          entity.level = mem.charDetails.level;

          byte[] job_bytes = GetRawJobSpecificDataBytes();
          if (job_bytes != null) {
            for (var i = 0; i < job_bytes.Length; ++i) {
              if (entity.debug_job != "")
                entity.debug_job += " ";
              entity.debug_job += string.Format("{0:x2}", job_bytes[i]);
            }
          }
        }
        return entity;
      }
    }

    internal override EntityData GetEntityData(IntPtr entity_ptr) {
      if (entity_ptr == IntPtr.Zero)
        return null;
      byte[] source = Read8(entity_ptr, EntityMemory.Size);
      return GetEntityDataFromByteArray(source);
    }
    public override EntityData GetSelfData() {
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

    public unsafe override JObject GetJobSpecificData(EntityJob job) {
      if (!HasProcess() || job_data_outer_addr_ == IntPtr.Zero)
        return null;

      IntPtr job_inner_ptr = ReadIntPtr(job_data_outer_addr_);
      if (job_inner_ptr == IntPtr.Zero) {
        // The pointer can be null when not logged in.
        return null;
      }
      job_inner_ptr = IntPtr.Add(job_inner_ptr, kJobDataInnerStructOffset);

      fixed (byte* p = Read8(job_inner_ptr, kJobDataInnerStructSize)) {
        if (p == null) {
          return null;
        } else {
          switch (job) {
            case EntityJob.RDM:
                return JObject.FromObject(*(RedMageJobMemory*)&p[0]);
            case EntityJob.WAR:
                return JObject.FromObject(*(WarriorJobMemory*)&p[0]);
            case EntityJob.DRK:
                return JObject.FromObject(*(DarkKnightJobMemory*)&p[0]);
            case EntityJob.PLD:
                return JObject.FromObject(*(PaladinJobMemory*)&p[0]);
            case EntityJob.GNB:
                return JObject.FromObject(*(GunbreakerJobMemory*)&p[0]);
            case EntityJob.BRD:
                return JObject.FromObject(*(BardJobMemory*)&p[0]);
            case EntityJob.DNC:
                return JObject.FromObject(*(DancerJobMemory*)&p[0]);
            case EntityJob.DRG:
                return JObject.FromObject(*(DragoonJobMemory*)&p[0]);
            case EntityJob.NIN:
                return JObject.FromObject(*(NinjaJobMemory*)&p[0]);
            case EntityJob.THM:
                return JObject.FromObject(*(ThaumaturgeJobMemory*)&p[0]);
            case EntityJob.BLM:
                return JObject.FromObject(*(BlackMageJobMemory*)&p[0]);
            case EntityJob.WHM:
                return JObject.FromObject(*(WhiteMageJobMemory*)&p[0]);
            case EntityJob.ACN:
                return JObject.FromObject(*(ArcanistJobMemory*)&p[0]);
            case EntityJob.SMN:
                return JObject.FromObject(*(SummonerJobMemory*)&p[0]);
            case EntityJob.SCH:
                return JObject.FromObject(*(ScholarJobMemory*)&p[0]);
            case EntityJob.MNK:
                return JObject.FromObject(*(MonkJobMemory*)&p[0]);
            case EntityJob.MCH:
                return JObject.FromObject(*(MachinistJobMemory*)&p[0]);
            case EntityJob.AST:
                return JObject.FromObject(*(AstrologianJobMemory*)&p[0]);
            case EntityJob.SAM:
                return JObject.FromObject(*(SamuraiJobMemory*)&p[0]);
            case EntityJob.SGE:
                return JObject.FromObject(*(SageJobMemory*)&p[0]);
            case EntityJob.RPR:
                return JObject.FromObject(*(ReaperJobMemory*)&p[0]);
          }
          return null;
        }
      }
    }

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct RedMageJobMemory {
      [FieldOffset(0x00)]
      public byte whiteMana;

      [FieldOffset(0x01)]
      public byte blackMana;

      [FieldOffset(0x02)]
      public byte manaStacks;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct WarriorJobMemory {
      [FieldOffset(0x00)]
      public byte beast;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct DarkKnightJobMemory {
      [FieldOffset(0x00)]
      public byte blood;

      [FieldOffset(0x02)]
      public ushort darksideMilliseconds;

      [FieldOffset(0x04)]
      public byte darkArts;

      [FieldOffset(0x06)]
      public ushort livingShadowMilliseconds;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct PaladinJobMemory {
      [FieldOffset(0x00)]
      public byte oath;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct GunbreakerJobMemory {
      [FieldOffset(0x00)]
      public byte cartridges;

      [FieldOffset(0x02)]
      private ushort continuationMilliseconds; // Is 15000 if and only if continuationState is not zero.

      [FieldOffset(0x04)]
      public byte continuationState;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct BardJobMemory {
      [Flags]
      private enum SongFlags : byte {
        None = 0,
        Ballad = 1, // Mage's Ballad.
        Paeon = 1 << 1, // Army's Paeon.
        Minuet = 1 | 1 << 1, // The Wanderer's Minuet.
        BalladLastPlayed =  1 << 2,
        PaeonLastPlayed = 1 << 3,
        MinuetLastPlayed = 1 << 2 | 1 << 3,
        BalladCoda = 1 << 4,
        PaeonCoda = 1 << 5,
        MinuetCoda = 1 << 6,
      }

      [FieldOffset(0x00)]
      public ushort songMilliseconds;

      [FieldOffset(0x04)]
      public byte songProcs;

      [FieldOffset(0x05)]
      public byte soulGauge;

      [NonSerialized]
      [FieldOffset(0x06)]
      private SongFlags songFlags;

      public String songName {
        get {
          if (songFlags.HasFlag(SongFlags.Minuet))
            return "Minuet";
          if (songFlags.HasFlag(SongFlags.Ballad))
            return "Ballad";
          if (songFlags.HasFlag(SongFlags.Paeon))
            return "Paeon";
          return "None";
        }
      }

      public String lastPlayed {
        get {
          if (songFlags.HasFlag(SongFlags.MinuetLastPlayed))
            return "Minuet";
          if (songFlags.HasFlag(SongFlags.BalladLastPlayed))
            return "Ballad";
          if (songFlags.HasFlag(SongFlags.PaeonLastPlayed))
            return "Paeon";
          return "None";
        }
      }

      public String[] coda {
        get {
          return new[] {
            this.songFlags.HasFlag(SongFlags.BalladCoda) ? "Ballad" : "None",
            this.songFlags.HasFlag(SongFlags.PaeonCoda) ? "Paeon" : "None",
            this.songFlags.HasFlag(SongFlags.MinuetCoda) ? "Minuet" : "None",
          };
        }
      }
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct DancerJobMemory {
      private enum Step : byte {
        None = 0,
        Emboite = 1,
        Entrechat = 2,
        Jete = 3,
        Pirouette = 4,
      }

      [FieldOffset(0x00)]
      public byte feathers;

      [FieldOffset(0x01)]
      public byte esprit;

      [NonSerialized]
      [FieldOffset(0x02)]
      private Step step1;  // Order of steps in current Standard Step/Technical Step combo.

      [NonSerialized]
      [FieldOffset(0x03)]
      private Step step2;

      [NonSerialized]
      [FieldOffset(0x04)]
      private Step step3;

      [NonSerialized]
      [FieldOffset(0x05)]
      private Step step4;

      [FieldOffset(0x06)]
      public byte currentStep; // Number of steps executed in current Standard Step/Technical Step combo.

      public string[] steps {
        get {
          Step[] _steps = { step1, step2, step3, step4 };
          return _steps.Select(s => s.ToString()).Where(s => s != "None").ToArray();
        }
      }
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct DragoonJobMemory {
      [NonSerialized]
      [FieldOffset(0x00)]
      private ushort blood_or_life_ms;

      [NonSerialized]
      [FieldOffset(0x02)]
      private byte stance; // 0 = None, 1 = Blood, 2 = Life

      [FieldOffset(0x03)]
      public byte eyesAmount;

      public uint bloodMilliseconds {
        get {
          if (stance == 1)
            return blood_or_life_ms;
          else
            return 0;
        }
      }
      public uint lifeMilliseconds {
        get {
          if (stance == 2)
            return blood_or_life_ms;
          else
            return 0;
        }
      }

      [FieldOffset(0x04)]
      public byte firstmindsFocus;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct NinjaJobMemory {
      [FieldOffset(0x00)]
      public uint hutonMilliseconds;

      [FieldOffset(0x04)]
      public byte ninkiAmount;

      [FieldOffset(0x05)]
      private byte hutonCount; // Why though?
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct ThaumaturgeJobMemory {
      [FieldOffset(0x02)]
      public ushort umbralMilliseconds; // Number of ms left in umbral fire/ice.

      [FieldOffset(0x04)]
      public sbyte umbralStacks; // Positive = Umbral Fire Stacks, Negative = Umbral Ice Stacks.
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct BlackMageJobMemory {
      [Flags]
      public enum EnochianFlags : byte {
        None = 0,
        Enochian = 1,
        Paradox = 2,
      }
      [FieldOffset(0x00)]
      public ushort nextPolyglotMilliseconds; // Number of ms left before polyglot proc.

      [FieldOffset(0x02)]
      public ushort umbralMilliseconds; // Number of ms left in umbral fire/ice.

      [FieldOffset(0x04)]
      public sbyte umbralStacks; // Positive = Umbral Fire Stacks, Negative = Umbral Ice Stacks.

      [FieldOffset(0x05)]
      public byte umbralHearts;

      [FieldOffset(0x06)]
      public byte polyglot;

      [NonSerialized]
      [FieldOffset(0x07)]
      private EnochianFlags enochian_state;

      public bool enochian {
        get {
          return enochian_state.HasFlag(EnochianFlags.Enochian);
        }
      }

      public bool paradox {
        get {
          return enochian_state.HasFlag(EnochianFlags.Paradox);
        }
      }
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct WhiteMageJobMemory {
      [FieldOffset(0x02)]
      public ushort lilyMilliseconds; // Number of ms left before lily gain.

      [FieldOffset(0x04)]
      public byte lilyStacks;

      [FieldOffset(0x05)]
      public byte bloodlilyStacks;
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct ArcanistJobMemory {
      [FieldOffset(0x04)]
      public byte aetherflowStacks;
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct SummonerJobMemory {
      [FieldOffset(0x00)]
      public ushort tranceMilliseconds;

      [FieldOffset(0x02)]
      public ushort attunementMilliseconds;

      [FieldOffset(0x06)]
      public byte attunement;

      [NonSerialized]
      [FieldOffset(0x07)]
      private byte stance;

      public string[] usableArcanum {
        get {
          var arcanums = new List<string>();
          if ((stance & 0x20) != 0)
            arcanums.Add("Ruby"); // Fire/Ifrit
          if ((stance & 0x40) != 0)
            arcanums.Add("Topaz"); // Earth/Titan
          if ((stance & 0x80) != 0)
            arcanums.Add("Emerald"); // Wind/Garuda

          return arcanums.ToArray();
        }
      }

      public string activePrimal {
        get {
          if ((stance & 0xC) == 0x4)
            return "Ifrit";
          else if ((stance & 0xC) == 0x8)
            return "Titan";
          else if ((stance & 0xC) == 0xC)
            return "Garuda";
          else
            return null;
        }
      }

      public String nextSummoned {
        get {
          if ((stance & 0x10) == 0)
            return "Bahamut";
          else
            return "Phoenix";
        }
      }

      public int aetherflowStacks {
        get {
          return stance & 0x3;
        }
      }
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct ScholarJobMemory {
      [FieldOffset(0x02)]
      public byte aetherflowStacks;

      [FieldOffset(0x03)]
      public byte fairyGauge;

      [FieldOffset(0x04)]
      public ushort fairyMilliseconds; // Seraph time left ms.

      [FieldOffset(0x06)]
      public byte fairyStatus; // Varies depending on which fairy was summoned, during Seraph/Dissipation: 6 - Eos, 7 - Selene, else 0.
    };


    [StructLayout(LayoutKind.Explicit)]
    public struct MonkJobMemory {
      public enum Beast : byte {
        None = 0,
        Coeurl = 1,
        Opo = 2,
        Raptor = 3,
      }

      [FieldOffset(0x00)]
      public byte chakraStacks;

      [NonSerialized]
      [FieldOffset(0x01)]
      private Beast beastChakra1;

      [NonSerialized]
      [FieldOffset(0x02)]
      private Beast beastChakra2;

      [NonSerialized]
      [FieldOffset(0x03)]
      private Beast beastChakra3;

      [NonSerialized]
      [FieldOffset(0x04)]
      private byte Nadi;

      public string[] beastChakra {
        get {
          Beast[] _beasts = { beastChakra1, beastChakra2, beastChakra3 };
          return _beasts.Select(a => a.ToString()).Where(a => a != "None").ToArray();
        }
      }

      public bool solarNadi {
        get {
          if ((Nadi & 0x4) == 0x4)
            return true;
          else
            return false;
        }
      }

      public bool lunarNadi {
        get {
          if ((Nadi & 0x2) == 0x2)
            return true;
          else
            return false;
        }
      }
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct MachinistJobMemory {
      [FieldOffset(0x00)]
      public ushort overheatMilliseconds;

      [FieldOffset(0x02)]
      public ushort batteryMilliseconds;

      [FieldOffset(0x04)]
      public byte heat;

      [FieldOffset(0x05)]
      public byte battery;

      [FieldOffset(0x06)]
      public byte lastBatteryAmount;

      [NonSerialized]
      [FieldOffset(0x07)]
      private byte chargeTimerState;

      public bool overheatActive {
        get {
          return (chargeTimerState & 0x1) == 1;
        }
      }

      public bool robotActive {
        get {
          return (chargeTimerState & 0x2) == 1;
        }
      }
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct AstrologianJobMemory {
      public enum Card : byte {
        None = 0,
        Balance = 1,
        Bole = 2,
        Arrow = 3,
        Spear = 4,
        Ewer = 5,
        Spire = 6,
        Lord = 0x70,
        Lady = 0x80,
      }

      public enum Arcanum : byte {
        None = 0,
        Solar = 1,
        Lunar = 2,
        Celestial = 3,
      }

      [NonSerialized]
      [FieldOffset(0x04)]
      private byte _heldCard;

      [NonSerialized]
      [FieldOffset(0x05)]
      private Arcanum arcanum_1;

      [NonSerialized]
      [FieldOffset(0x06)]
      private Arcanum arcanum_2;

      [NonSerialized]
      [FieldOffset(0x07)]
      private Arcanum arcanum_3;

      public string heldCard {
        get {
          return ((Card)(_heldCard & 0xF)).ToString();
        }
      }

      public string crownCard {
        get {
          return ((Card)(_heldCard & 0xF0)).ToString();
        }
      }

      public string[] arcanums {
        get {
          Arcanum[] _arcanums = { arcanum_1, arcanum_2, arcanum_3 };
          return _arcanums.Select(a => a.ToString()).Where(a => a != "None").ToArray();
        }
      }
    };

    [StructLayout(LayoutKind.Explicit)]
    public struct SamuraiJobMemory {
      [FieldOffset(0x03)]
      public byte kenki;

      [FieldOffset(0x04)]
      public byte meditationStacks;

      [NonSerialized]
      [FieldOffset(0x05)]
      private byte sen_bits;

      public bool setsu {
        get {
          return (sen_bits & 0x1) != 0;
        }
      }

      public bool getsu {
        get {
          return (sen_bits & 0x2) != 0;
        }
      }

      public bool ka {
        get {
          return (sen_bits & 0x4) != 0;
        }
      }
    }

    [StructLayout(LayoutKind.Explicit)]
    public struct SageJobMemory {
      [FieldOffset(0x00)]
      public ushort addersgallMilliseconds; // the addersgall gauge elapsed in milliseconds, from 0 to 19999.

      [FieldOffset(0x02)]
      public byte addersgall;

      [FieldOffset(0x03)]
      public byte addersting;

      [FieldOffset(0x04)]
      public byte eukrasia;
    }

    [StructLayout(LayoutKind.Explicit)]
    public struct ReaperJobMemory {
      [FieldOffset(0x00)]
      public byte soul;

      [FieldOffset(0x01)]
      public byte shroud;

      [FieldOffset(0x02)]
      public ushort enshroudMilliseconds;

      [FieldOffset(0x04)]
      public byte lemureShroud;

      [FieldOffset(0x05)]
      public byte voidShroud;
    }
  }
}
