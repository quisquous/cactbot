using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cactbot {
  // TODO: replace these all with just JObjects instead of explicit classes.
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

    public class ForceReloadEvent: JSEvent {
      public string EventName() { return "onForceReload"; }
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
    public class FateEvent : JSEvent {
      public FateEvent(string eventType, int fateID, int progress) {
        this.eventType = eventType;
        this.fateID = fateID;
        this.progress = progress;
      }
      public string EventName() { return "onFateEvent"; }
      public string eventType;
      public int fateID;
      public int progress;
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
        rotation = e.rotation;
        current_world_id = e.current_world_id;
        home_world_id = e.home_world_id;
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
      public float rotation;
      public ushort current_world_id;
      public ushort home_world_id;
      public int bait;

      // One of the FooJobDetails structures, depending on the value of |job|.
      public object jobDetail;
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
          rotation = e.rotation;
          current_world_id = e.current_world_id;
          home_world_id = e.home_world_id;
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
      public float rotation;
      public ushort current_world_id;
      public ushort home_world_id;
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
