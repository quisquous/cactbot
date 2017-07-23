using System;
using System.Collections.Generic;
using System.Text;
using Tamagawa.EnmityPlugin;
using System.Web.Script.Serialization;

namespace Cactbot {
  public interface JSEvent {
    void Serialize(StringBuilder builder, JavaScriptSerializer serializer);
    string EventName();
  };

  // This class defines all the event |details| structures that go to each event type.
  public class JSEvents {
    public abstract class BaseEvent : JSEvent {
      public void Serialize(StringBuilder builder, JavaScriptSerializer serializer) {
        serializer.Serialize(this, builder);
      }
      public abstract string EventName();
    };

    public class Point3F {
      public Point3F(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }

      public float x = 0;
      public float y = 0;
      public float z = 0;
    }

    public class GameExistsEvent : BaseEvent {
      public GameExistsEvent(bool exists) { this.exists = exists; }
      public override string EventName() { return "onGameExistsEvent"; }

      public bool exists;
    }

    public class GameActiveChangedEvent : BaseEvent {
      public GameActiveChangedEvent(bool active) { this.active = active; }
      public override string EventName() { return "onGameActiveChangedEvent"; }

      public bool active;
    }

    public class LogEvent : BaseEvent {
      public LogEvent(List<String> logs) { this.logs = logs; }
      public override string EventName() { return "onLogEvent"; }

      public List<string> logs;
    }

    public class InCombatChangedEvent : BaseEvent {
      public InCombatChangedEvent(bool in_combat) { this.inCombat = in_combat; }
      public override string EventName() { return "onInCombatChangedEvent"; }

      public bool inCombat;
    }

    public class ZoneChangedEvent : BaseEvent {
      public ZoneChangedEvent(string name) { this.zoneName = name; }
      public override string EventName() { return "onZoneChangedEvent"; }

      public string zoneName;
    }

    public class PlayerDiedEvent : BaseEvent {
      public override string EventName() { return "onPlayerDied"; }
    }

    public class PartyWipeEvent : BaseEvent {
      public override string EventName() { return "onPartyWipe"; }
    }

    public class PlayerChangedEvent : BaseEvent {
      public PlayerChangedEvent(Combatant c) {
        job = ((JobEnum)c.Job).ToString();
        level = c.Level;
        name = c.Name;
        currentHP = c.CurrentHP;
        maxHP = c.MaxHP;
        currentMP = c.CurrentMP;
        maxMP = c.MaxMP;
        currentTP = c.CurrentTP;
        maxTP = c.MaxTP;
        pos = new Point3F(c.PosX, c.PosY, c.PosZ);
        jobDetail = null;
      }
      public override string EventName() { return "onPlayerChangedEvent"; }

      public string job;
      public int level;
      public string name;

      public int currentHP;
      public int maxHP;
      public int currentMP;
      public int maxMP;
      public int currentTP;
      public int maxTP;

      public Point3F pos;

      // One of the FooJobDetails structures, depending on the value of |job|.
      public object jobDetail;

      public struct RedMageDetail {
        public RedMageDetail(int white, int black) { whiteMana = white; blackMana = black; }
        public int whiteMana;
        public int blackMana;
      }
    }

    public class TargetChangedEvent : BaseEvent {
      public TargetChangedEvent(Combatant c) {
        if (c != null) {
          id = c.ID;
          level = c.Level;
          name = c.Name;
          currentHP = c.CurrentHP;
          maxHP = c.MaxHP;
          currentMP = c.CurrentMP;
          maxMP = c.MaxMP;
          currentTP = c.CurrentTP;
          maxTP = c.MaxTP;
          pos = new Point3F(c.PosX, c.PosY, c.PosZ);
          distance = c.EffectiveDistance;
        }
      }
      public override string EventName() { return "onTargetChangedEvent"; }

      public uint id = 0;
      public int level = 0;
      public string name = null;

      public int currentHP = 0;
      public int maxHP = 0;
      public int currentMP = 0;
      public int maxMP = 0;
      public int currentTP = 0;
      public int maxTP = 0;

      public Point3F pos;
      public int distance = 0;
    }

    public struct DPSDetail {
      public Dictionary<string, string> Encounter;
      public List<Dictionary<string, string>> Combatant;

      public void Serialize(StringBuilder builder, JavaScriptSerializer serializer) {
        // This capitalization doesn't match other events, but is consistent with what dps overlays expect.  :C
        builder.Append("{'Encounter':");
        serializer.Serialize(this.Encounter, builder);
        // DPS overlays expect a "sorted dictionary" of combatants, with the key of the dictionary being the name.
        // Sorting here appears to be the order of insertion for dictionaries, but C# dicts don't be have like that.
        // So do some custom serialization here to make this appear as overlays expect.
        builder.Append(",'Combatant':(function(x){var d={};for(var i=0;i<x.length; ++i){d[x[i].name]=x[i];}return d;})(");
        serializer.Serialize(this.Combatant, builder);
        builder.Append(")}");
      }
    }

    public class DPSOverlayUpdateEvent : JSEvent {
      public DPSOverlayUpdateEvent(Dictionary<string, string> encounter, List<Dictionary<string, string>> combatant) {
        this.dps.Encounter = encounter;
        this.dps.Combatant = combatant;
      }
      public string EventName() { return "onOverlayDataUpdate"; }
      public void Serialize(StringBuilder builder, JavaScriptSerializer serializer) {
        dps.Serialize(builder, serializer);
      }

      DPSDetail dps;
    }

    public class BossFightStart : BaseEvent {
      public BossFightStart(string name, int pull_count) {
        this.name = name;
        this.pullCount = pull_count;
      }
      public override string EventName() { return "onBossFightStart"; }

      public string name;
      public int pullCount;
    };

    public class BossFightEnd : BaseEvent {
      public override string EventName() { return "onBossFightEnd"; }
    };

    public class FightPhaseStart : JSEvent {
      public FightPhaseStart(string phase_id, Dictionary<string, string> encounter, List<Dictionary<string, string>> combatant) {
        this.name = phase_id;
        this.dps.Encounter = encounter;
        this.dps.Combatant = combatant;
      }
      public string EventName() { return "onFightPhaseStart"; }
      public void Serialize(StringBuilder builder, JavaScriptSerializer serializer) {
        builder.Append("{'name':'");
        builder.Append(this.name);
        builder.Append("','dps':");
        dps.Serialize(builder, serializer);
        builder.Append('}');
      }

      public string name;
      public DPSDetail dps;
    }

    public class FightPhaseEnd : JSEvent {
      public FightPhaseEnd(string phase_id, Dictionary<string, string> encounter, List<Dictionary<string, string>> combatant) {
        this.name = phase_id;
        this.dps.Encounter = encounter;
        this.dps.Combatant = combatant;
      }
      public string EventName() { return "onFightPhaseEnd"; }
      public void Serialize(StringBuilder builder, JavaScriptSerializer serializer) {
        builder.Append("{'name':'");
        builder.Append(this.name);
        builder.Append("','dps':");
        dps.Serialize(builder, serializer);
        builder.Append('}');
      }

      public string name;
      public DPSDetail dps;
    }
  }
}
