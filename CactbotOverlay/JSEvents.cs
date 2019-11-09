﻿using System;
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
        public RedMageDetail(FFXIVProcess.RedMageJobData d) { whiteMana = d.white; blackMana = d.black; }
        public int whiteMana;
        public int blackMana;
      }

      public struct WarriorDetail {
        public WarriorDetail(FFXIVProcess.WarriorJobData d) { beast = d.beast; }
        public int beast;
      }

      public struct DarkKnightDetail {
        public DarkKnightDetail(FFXIVProcess.DarkKnightJobData d) { blood = d.blood; darksideMilliseconds = d.darkside_ms; }
        public int blood;
        public int darksideMilliseconds;
      }

      public struct PaladinDetail {
        public PaladinDetail(FFXIVProcess.PaladinJobData d) { oath = d.oath; }
        public int oath;
      }

      public struct BardDetail {
        public BardDetail(FFXIVProcess.BardJobData d) {
          songName = d.song_type == FFXIVProcess.BardJobData.Song.None ? "" : d.song_type.ToString();
          songMilliseconds = d.song_ms;
          soulGauge = d.soul_gauge;
          songProcs = d.song_procs;
        }
        public string songName;
        public uint songMilliseconds;
        public int soulGauge;
        public int songProcs;
      }

      public struct NinjaDetail {
        public NinjaDetail(FFXIVProcess.NinjaJobData d) { hutonMilliseconds = d.huton_ms; ninkiAmount = d.ninki_amount; }
        public uint hutonMilliseconds;
        public uint ninkiAmount;
      }

      public struct DragoonDetail {
        public DragoonDetail(FFXIVProcess.DragoonJobData d) {
          bloodMilliseconds = d.blood_ms;
          lifeMilliseconds = d.life_ms;
          eyesAmount = d.eyes_amount;
        }
        public uint bloodMilliseconds;
        public uint lifeMilliseconds;
        public uint eyesAmount;
      }

      public struct BlackMageDetail {
        public BlackMageDetail(FFXIVProcess.BlackMageJobData d) {
          umbralStacks = d.umbral_stacks;
          umbralMilliseconds = d.umbral_time_ms;
          umbralHearts = d.umbral_hearts;
          foulCount = d.foul_count;
          enochian = d.enochian_active;
          nextPolygotMilliseconds = d.polygot_time_ms;
        }
        public int umbralStacks;  // Positive = Fire, Negative = Ice.
        public uint umbralMilliseconds;
        public int umbralHearts;
        public int foulCount;
        public bool enochian;
        public uint nextPolygotMilliseconds;
      }

      public struct WhiteMageDetail {
        public WhiteMageDetail(FFXIVProcess.WhiteMageJobData d) { 
          lilyMilliseconds = d.lilies_ms;
          lily_stacks = d.lily_stacks;
          bloodlily_stacks = d.bloodlily_stacks;
        }
        public uint lilyMilliseconds;
        public int lily_stacks;
        public int bloodlily_stacks;
      }

      public struct SummonerDetail {
        public SummonerDetail(FFXIVProcess.SummonerJobData d) {
          stanceMilliseconds = d.stance_ms;
          bahamutStance = d.bahamut_stance;
          bahamutSummoned = d.bahamut_summoned;
          aetherflowStacks = d.aetherflow_stacks;
          dreadwyrmStacks = d.dreadwyrm_stacks;
          phoenixReady = d.phoenix_ready;
        }
        public uint stanceMilliseconds;  // Time left for current stance/summon.
        public int bahamutStance;  // 5 = Bahamut/Phoenix. Not very useful.
        public int bahamutSummoned;  // Is Bahamut/Phoenix active?
        public int aetherflowStacks; // Stacks to spend on Fester, etc.
        public int dreadwyrmStacks; 
        public int phoenixReady;  // Is Phoenix ready.
      }

      public struct ScholarDetail {
         public ScholarDetail(FFXIVProcess.ScholarJobData d) {
          aetherflowStacks = d.aetherflow_stacks;
          fairyGauge = d.fairy_gauge;
          fairyMilliseconds = d.fairy_ms;
          fairyStatus = d.fairy_status;
         }
         public int aetherflowStacks;  // Stacks to spend on Energy Drain, etc.
         public int fairyGauge;
         public uint fairyMilliseconds;  // Time left for Fairy Stance.
         public int fairyStatus; // 7 - Seraph, 6 - Dissipation.
      }

         public struct MonkDetail {
        public MonkDetail(FFXIVProcess.MonkJobData d) { lightningMilliseconds = d.lightning_ms; lightningStacks = d.lightning_stacks; chakraStacks = d.chakra_stacks; }
        public uint lightningMilliseconds;
        public int lightningStacks;
        public int chakraStacks;
      }

      public struct MachinistDetail {
        public MachinistDetail(FFXIVProcess.MachinistJobData d) { heat = d.heat; overheatMilliseconds = d.overheat_ms; battery = d.battery; batteryMilliseconds = d.battery_ms; }
        public int heat;
        public uint overheatMilliseconds;
        public int battery;
        public uint batteryMilliseconds;
      }

      public struct AstrologianDetail {
        public AstrologianDetail(FFXIVProcess.AstrologianJobData d) { 
          heldCard = d.held_card;
          arcanum_1 = d.arcanum_1;
          arcanum_2 = d.arcanum_2;
          arcanum_3 = d.arcanum_3;
         }
        public int heldCard;
        public int arcanum_1;
        public int arcanum_2;
        public int arcanum_3;
      }

      public struct SamuraiDetail {
        public SamuraiDetail(FFXIVProcess.SamuraiJobData d) { kenki = d.kenki; setsu = d.setsu; getsu = d.getsu; ka = d.ka; }
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
