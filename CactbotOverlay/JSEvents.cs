using System;
using System.Collections.Generic;
using System.Text;
using Tamagawa.EnmityPlugin;

namespace Cactbot {

  // This class defines all the event |details| structures that go to each event type.
  public class JSEvents {
    public struct Point3F {
      public Point3F(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }

      public float x;
      public float y;
      public float z;
    }

    public class LogEvent {
      public LogEvent(List<String> logs) { this.logs = logs; }

      public List<string> logs;
    }

    public class InCombatChangedEvent {
      public InCombatChangedEvent(bool in_combat) { this.inCombat = in_combat; }

      public bool inCombat;
    }

    public class ZoneChangedEvent {
      public ZoneChangedEvent(string name) { this.zoneName = name; }

      public string zoneName;
    }

    public class PlayerChangedEvent {
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
  }
}
