using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cactbot {
  public interface JSEvent {
    string EventName();
  };

  // This class defines all the event |details| structures that go to each event type.
  public class JSEvents {
    public class Point3F {
      public Point3F(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }

      public float x = 0;
      public float y = 0;
      public float z = 0;
    }

    public class GameExistsEvent : JSEvent {
      public GameExistsEvent(bool exists) { this.exists = exists; }
      public string EventName() { return "onGameExistsEvent"; }

      public bool exists;
    }

    public class GameActiveChangedEvent : JSEvent {
      public GameActiveChangedEvent(bool active) { this.active = active; }
      public string EventName() { return "onGameActiveChangedEvent"; }

      public bool active;
    }

    public class LogEvent : JSEvent {
      public LogEvent(List<String> logs) { this.logs = logs; }
      public string EventName() { return "onLogEvent"; }

      public List<string> logs;
    }

    public class ImportLogEvent : JSEvent {
      public ImportLogEvent(List<String> logs) { this.logs = logs; }
      public string EventName() { return "onImportLogEvent"; }

      public List<string> logs;
    }

    public class InCombatChangedEvent : JSEvent {
      public InCombatChangedEvent(bool in_act_combat, bool in_game_combat) { this.inACTCombat = in_act_combat; this.inGameCombat = in_game_combat; }
      public string EventName() { return "onInCombatChangedEvent"; }

      public bool inACTCombat;
      public bool inGameCombat;
    }

    public class ZoneChangedEvent : JSEvent {
      public ZoneChangedEvent(string name) { this.zoneName = name; }
      public string EventName() { return "onZoneChangedEvent"; }

      public string zoneName;
    }

    public class PlayerDiedEvent : JSEvent {
      public string EventName() { return "onPlayerDied"; }
    }

    public class PartyWipeEvent : JSEvent {
      public string EventName() { return "onPartyWipe"; }
    }

    public class PlayerChangedEvent : JSEvent {
      public PlayerChangedEvent(FFXIVProcess.EntityData e) {
        id = e.id;
        level = e.level;
        name = e.name;
        job = e.job.ToString();
        currentHP = e.hp;
        maxHP = e.max_hp;
        currentMP = e.mp;
        maxMP = e.max_mp;
        maxTP = 1000;
        currentGP = e.gp;
        maxGP = e.max_gp;
        currentCP = e.cp;
        maxCP = e.max_cp;
        pos = new Point3F(e.pos_x, e.pos_y, e.pos_z);
        jobDetail = null;
        bait = e.bait;
        debugJob = e.debug_job;
        currentShield = e.shield_value;
      }
      public string EventName() { return "onPlayerChangedEvent"; }

      public uint id;
      public int level;
      public string name;
      public string job;

      public int currentHP;
      public int maxHP;
      public int currentMP;
      public int maxMP;
      public int currentTP;
      public int maxTP;
      public int currentGP;
      public int maxGP;
      public int currentCP;
      public int maxCP;
      public string debugJob;
      public int currentShield;

      public Point3F pos;
      public int bait;

      // One of the FooJobDetails structures, depending on the value of |job|.
      public object jobDetail;

      public struct RedMageDetail {
        public RedMageDetail(JObject job) {
          whiteMana = (int)job.GetValue("white");
          blackMana = (int)job.GetValue("black"); }
        public int whiteMana;
        public int blackMana;
      }

      public struct WarriorDetail {
        public WarriorDetail(JObject job) {
          beast = (int)job.GetValue("beast");
        }
        public int beast;
      }

      public struct DarkKnightDetail {
        public DarkKnightDetail(JObject job) {
          blood = (int)job.GetValue("blood");
          darksideMilliseconds = (int)job.GetValue("darkside_ms"); }
        public int blood;
        public int darksideMilliseconds;
      }

      public struct PaladinDetail {
        public PaladinDetail(JObject job) {
          oath = (int)job.GetValue("oath");
        }
        public int oath;
      }

      public struct GunbreakerDetail {
        public GunbreakerDetail(JObject job) {
          cartridges = (int)job.GetValue("cartridges");
          continuationMilliseconds = (uint)job.GetValue("continuation_ms");
          continuationState = (int)job.GetValue("continuation_state");
        }
        public int cartridges;
        public uint continuationMilliseconds;
        public int continuationState;
      }

      public struct BardDetail {
        public enum Song : byte {
          None = 0,
          Ballad = 5, // Mage's Ballad.
          Paeon = 10, // Army's Paeon.
          Minuet = 15, // The Wanderer's Minuet.
        }

        public BardDetail(JObject job) {
          //Ending a song decrements song_type rather than resetting to 0
          if (!Enum.IsDefined(typeof(Song), (byte)job.GetValue("song_type")))
            songName = "None";
          else
            songName = ((Song)(byte)job.GetValue("song_type")).ToString();
          songMilliseconds = (uint)job.GetValue("song_ms");
          soulGauge = (int)job.GetValue("soul_gauge");
          songProcs = (int)job.GetValue("song_procs");
        }
        public string songName;
        public uint songMilliseconds;
        public int soulGauge;
        public int songProcs;
      }

      public struct DancerDetail {
        public enum Step : byte {
          None = 0,
          Emboite = 1,
          Entrechat = 2,
          Jete = 3,
          Pirouette = 4,
        }

        public DancerDetail(JObject job) {
          feathers = (int)job.GetValue("feathers");
          steps = new[] { 
            ((Step)(byte)job.GetValue("step1")).ToString(),
            ((Step)(byte)job.GetValue("step2")).ToString(),
            ((Step)(byte)job.GetValue("step3")).ToString(),
            ((Step)(byte)job.GetValue("step4")).ToString(),
          };
          currentStep = (int)job.GetValue("current_step");
        }
        public int feathers;
        public string[] steps;
        public int currentStep;
      }

         public struct NinjaDetail {
        public NinjaDetail(JObject job) {
          hutonMilliseconds = (uint)job.GetValue("huton_ms");
          ninkiAmount = (int)job.GetValue("ninki_amount");
          hutonCount = (int)job.GetValue("huton_count");
        }
        public uint hutonMilliseconds;
        public int ninkiAmount;
        public int hutonCount;
      }

      public struct DragoonDetail {
        public DragoonDetail(JObject job) {
          bloodMilliseconds = 0;
          lifeMilliseconds = 0;
          if ((int)job.GetValue("stance") == 1)
            bloodMilliseconds = (uint)job.GetValue("blood_or_life_ms");
          else if ((int)job.GetValue("stance") == 2)
            lifeMilliseconds = (uint)job.GetValue("blood_or_life_ms");
          eyesAmount = (int)job.GetValue("eyes_amount");
        }
        public uint bloodMilliseconds;
        public uint lifeMilliseconds;
        public int eyesAmount;
      }

      public struct BlackMageDetail {
        public BlackMageDetail(JObject job) {
          nextPolyglotMilliseconds = (uint)job.GetValue("polyglot_time_ms");
          umbralMilliseconds = (uint)job.GetValue("umbral_time_ms");
          umbralStacks = (int)job.GetValue("umbral_stacks");
          umbralHearts = (int)job.GetValue("umbral_hearts_count");
          foulCount = (int)job.GetValue("foul_count");
          enochian = ((byte)job.GetValue("enochian_state") & 0xF) == 1;
        }
        public uint nextPolyglotMilliseconds;
        public uint umbralMilliseconds;
        public int umbralStacks;  // Positive = Fire, Negative = Ice.
        public int umbralHearts;
        public int foulCount;
        public bool enochian;
      }

      public struct WhiteMageDetail {
        public WhiteMageDetail(JObject job) { 
          lilyMilliseconds = (uint)job.GetValue("lilies_ms");
          lilyStacks = (int)job.GetValue("lily_stacks");
          bloodlilyStacks = (int)job.GetValue("bloodlily_stacks");
        }
        public uint lilyMilliseconds;
        public int lilyStacks;
        public int bloodlilyStacks;
      }

      public struct SummonerDetail {
        public SummonerDetail(JObject job) {
          stanceMilliseconds = (uint)job.GetValue("stance_ms");
          bahamutStance = (int)job.GetValue("bahamut_stance");
          bahamutSummoned = (int)job.GetValue("bahamut_summoned");
          aetherflowStacks = ((byte)job.GetValue("stacks") >> 0) & 0x3; // Bottom 2 bits.
          dreadwyrmStacks = ((byte)job.GetValue("stacks") >> 2) & 0x3; // Next 2 bits.
          phoenixReady = ((byte)job.GetValue("stacks") >> 4) & 0x3; // Next 2 bits.
        }
        public uint stanceMilliseconds;  // Time left for current stance/summon.
        public int bahamutStance;  // 5 = Bahamut/Phoenix. Not very useful.
        public int bahamutSummoned;  // Is Bahamut/Phoenix active?
        public int aetherflowStacks; // Stacks to spend on Fester, etc.
        public int dreadwyrmStacks; 
        public int phoenixReady;  // Is Phoenix ready.
      }

      public struct ScholarDetail {
         public ScholarDetail(JObject job) {
           aetherflowStacks = (int)job.GetValue("aetherflow_stacks");
           fairyGauge = (int)job.GetValue("fairy_gauge");
           fairyMilliseconds = (uint)job.GetValue("fairy_ms");
           fairyStatus = (int)job.GetValue("fairy_status");
         }
         public int aetherflowStacks;  // Stacks to spend on Energy Drain, etc.
         public int fairyGauge;
         public uint fairyMilliseconds;  // Time left for Fairy Stance.
         public int fairyStatus;  // Varies depending on which fairy was summoned, during Seraph/Dissipation: 6 - Eos, 7 - Selene, else 0.
      }

      public struct MonkDetail {
        public MonkDetail(JObject job) { 
          lightningMilliseconds = (uint)job.GetValue("greased_lightning_time_ms");
          lightningStacks = (int)job.GetValue("greased_lightning_stacks");
          chakraStacks = (int)job.GetValue("chakra_stacks");
        }
        public uint lightningMilliseconds;
        public int lightningStacks;
        public int chakraStacks;
      }

      public struct MachinistDetail {
        public MachinistDetail(JObject job) {
          overheatMilliseconds = (uint)job.GetValue("overheat_ms");
          batteryMilliseconds = (uint)job.GetValue("battery_ms");
          heat = (int)job.GetValue("heat");
          battery = (int)job.GetValue("battery");
        }
        public uint overheatMilliseconds;
        public uint batteryMilliseconds;
        public int heat;
        public int battery;
      }

      public struct AstrologianDetail {
        public enum Card : byte {
          None = 0,
          Balance = 1,
          Bole = 2,
          Arrow = 3,
          Spear = 4,
          Ewer = 5,
          Spire = 6,
        }

        public enum Arcanum : byte {
          None = 0,
          Solar = 1,      // Balance/Bole
          Lunar = 2,      // Ewer/Arrow
          Celestial = 3,  // Spear/Spire
        }
        public AstrologianDetail(JObject job) { 
          heldCard = ((Card)(int)job.GetValue("held_card")).ToString();
          arcanum1 = ((Arcanum)(int)job.GetValue("arcanum_1")).ToString();
          arcanum2 = ((Arcanum)(int)job.GetValue("arcanum_2")).ToString();
          arcanum3 = ((Arcanum)(int)job.GetValue("arcanum_3")).ToString();
         }
        public String heldCard;
        public String arcanum1;
        public String arcanum2;
        public String arcanum3;
      }

      public struct SamuraiDetail {
        public SamuraiDetail(JObject job) {
          kenki = (int)job.GetValue("kenki");
          setsu = ((byte)job.GetValue("sen_bits") & 0x1) != 0;
          getsu = ((byte)job.GetValue("sen_bits") & 0x2) != 0;
          ka = ((byte)job.GetValue("sen_bits") & 0x4) != 0;
          ;
        }
        public int kenki;
        public bool setsu;
        public bool getsu;
        public bool ka;
      }
    }

    public class TargetCastingEvent : JSEvent {
      public TargetCastingEvent(int id, double progress, double length) {
        castId = id;
        timeProgress = progress;
        castLength = length;
      }
      public string EventName() { return "onTargetCastingEvent"; }

      public int castId = 0;
      public double timeProgress = 0;
      public double castLength = 0;
    }

    public class FocusCastingEvent : JSEvent {
      public FocusCastingEvent(int id, double progress, double length) {
        castId = id;
        timeProgress = progress;
        castLength = length;
      }
      public string EventName() { return "onFocusCastingEvent"; }

      public int castId = 0;
      public double timeProgress = 0;
      public double castLength = 0;
    }

    public abstract class EntityChangedEvent {
      public EntityChangedEvent(FFXIVProcess.EntityData e) {
        if (e != null) {
          id = e.id;
          level = e.level;
          name = e.name;
          job = e.job.ToString();
          currentHP = e.hp;
          maxHP = e.max_hp;
          currentMP = e.mp;
          maxMP = e.max_mp;
          pos = new Point3F(e.pos_x, e.pos_y, e.pos_z);
          distance = e.distance;
        }
      }

      public uint id = 0;
      public int level = 0;
      public string name = null;
      public string job = null;

      public int currentHP = 0;
      public int maxHP = 0;
      public int currentMP = 0;
      public int maxMP = 0;
      public int currentTP = 0;
      public int maxTP = 0;

      public Point3F pos;
      public int distance = 0;
    }

    public class TargetChangedEvent : EntityChangedEvent, JSEvent {
      public TargetChangedEvent(FFXIVProcess.EntityData e) : base(e) { }
      public string EventName() { return "onTargetChangedEvent"; }
    }

    public class FocusChangedEvent : EntityChangedEvent, JSEvent {
      public FocusChangedEvent(FFXIVProcess.EntityData e) : base(e) { }
      public string EventName() { return "onFocusChangedEvent"; }
    }

    public struct DPSDetail {
      public Dictionary<string, string> Encounter;
      [JsonConverter(typeof(CombatantConverter))]
      public List<Dictionary<string, string>> Combatant;

      public class CombatantConverter : JsonConverter {
        public override bool CanConvert(Type t) {
          return (t == typeof(List<Dictionary<string, string>>));
        }
        public override bool CanRead { get { return false; } }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
          // Not used, we only serialize.
          throw new NotImplementedException();
        }
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
          var combatant_list = (List<Dictionary<string, string>>)value;

          // Sort by encdps descending.  OverlayPlugin has options for different ways to sort, but
          // html can do this itself if it wants something different.  This is what most folks expect.
          const string kSortKey = "encdps";
          combatant_list.Sort((x, y) => {
            if (x.ContainsKey(kSortKey) && y.ContainsKey(kSortKey)) {
              double x_value, y_value;
              if (double.TryParse(x[kSortKey], out x_value) && double.TryParse(y[kSortKey], out y_value)) {
                return y_value.CompareTo(x_value);
              }
            }
            return 0;
          });

          // DPS overlays expect a "sorted dictionary" of combatants, so we build the dictionary ourselves in
          // order.
          var o = new JObject();
          foreach (var c in combatant_list)
            o.Add(c["name"], JObject.FromObject(c, serializer));
          o.WriteTo(writer);
        }
      }
    }

    [JsonConverter(typeof(DPSOverlayUpdateEventConverter))]
    public class DPSOverlayUpdateEvent : JSEvent {
      public DPSOverlayUpdateEvent(Dictionary<string, string> encounter, List<Dictionary<string, string>> combatant) {
        this.dps.Encounter = encounter;
        this.dps.Combatant = combatant;
      }
      public string EventName() { return "onOverlayDataUpdate"; }

      public DPSDetail dps;

      // The DPSOverlayUpdateEvent expects the members of DPSDetail to be top level
      // members of the event instead.
      public class DPSOverlayUpdateEventConverter : JsonConverter {
        public override bool CanConvert(Type t) {
          return (t == typeof(DPSOverlayUpdateEvent));
        }
        public override bool CanRead { get { return false; } }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
          // Not used, we only serialize.
          throw new NotImplementedException();
        }
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
          var detail = (DPSOverlayUpdateEvent)value;

          var dps = JObject.FromObject(detail.dps, serializer);

          var o = new JObject();
          o.Add("Encounter", dps["Encounter"]);
          o.Add("Combatant", dps["Combatant"]);
          o.WriteTo(writer);
        }
      }
    }

    public class SendSaveData : JSEvent {
      public SendSaveData(string data) {
        this.data = data;
      }

      public string EventName() { return "onSendSaveData"; }

      public string data;
    }

    public class DataFilesRead : JSEvent {
      public DataFilesRead(Dictionary<string, string> files) {
        this.files = files;
      }

      public string EventName() { return "onDataFilesRead"; }

      public Dictionary<string, string> files;
    }

    public class OnInitializeOverlay : JSEvent {
      public OnInitializeOverlay(string location, Dictionary<string, string> files, string language) {
        this.userLocation = location;
        this.localUserFiles = files;
        this.language = language;
      }

      public string EventName() { return "onInitializeOverlay"; }
      public string userLocation;
      public Dictionary<string, string> localUserFiles;
      public string language;
    }
  }
}
