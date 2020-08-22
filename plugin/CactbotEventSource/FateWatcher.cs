using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin.Common;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;

namespace Cactbot {
  public class FateWatcher {
    private CactbotEventSource client_;
    private string region_;
    private IDataSubscription subscription;

    // Fate start
    // param1: fateID
    // param2: unknown
    //
    // Fate end
    // param1: fateID
    //
    // Fate update
    // param1: fateID
    // param2: progress (0-100)
    private struct OPCodes {
    public OPCodes(int add_, int remove_, int update_) { this.add = add_; this.remove = remove_; this.update = update_; }
      public int add;
      public int remove;
      public int update;
    };
    private OPCodes v5_2 = new OPCodes(
      0x935,
      0x936,
      0x93E
    );

    private Dictionary<string, OPCodes> opcodes = null;

    private Type MessageType = null;
    private Type ActorControl143 = null;
    private int ActorControl143_Size = 0;
    private int Header_Offset = 0;
    private Type msgHeader = null;
    private int MessageType_Offset = 0;
    private int Category_Offset = 0;
    private int Param1_Offset = 0;
    private int Param2_Offset = 0;
    private ushort ActorControl143_Opcode = 0;

    // fates<fateID, progress>
    private static ConcurrentDictionary<int, int> fates;

    public FateWatcher(CactbotEventSource client, string language) {
      client_ = client;
      if (language == "ko")
        region_ = "ko";
      else if (language == "cn")
        region_ = "cn";
      else
        region_ = "intl";

      opcodes = new Dictionary<string, OPCodes>();
      opcodes.Add("ko", v5_2);
      opcodes.Add("cn", v5_2);
      opcodes.Add("intl", v5_2);

      fates = new ConcurrentDictionary<int, int>();

      var FFXIV = ActGlobals.oFormActMain.ActPlugins.FirstOrDefault(x => x.lblPluginTitle.Text == "FFXIV_ACT_Plugin.dll");
      if (FFXIV != null && FFXIV.pluginObj != null) {
        try {
          subscription = (IDataSubscription)FFXIV.pluginObj.GetType().GetProperty("DataSubscription").GetValue(FFXIV.pluginObj);
        } catch (Exception ex) {
          client_.LogError(ex.ToString());
        }
      }

      var mach = Assembly.Load("Machina.FFXIV");
      MessageType = mach.GetType("Machina.FFXIV.Headers.Server_MessageType");
      ActorControl143 = mach.GetType("Machina.FFXIV.Headers.Server_ActorControl143");
      ActorControl143_Size = Marshal.SizeOf(ActorControl143);

      Header_Offset = GetOffset(ActorControl143, "MessageHeader");
      msgHeader = ActorControl143.GetField("MessageHeader").FieldType;

      MessageType_Offset = Header_Offset + GetOffset(msgHeader, "MessageType");

      Category_Offset = GetOffset(ActorControl143, "category");
      Param1_Offset = GetOffset(ActorControl143, "param1");
      Param2_Offset = GetOffset(ActorControl143, "param2");

      ActorControl143_Opcode = GetOpcode("ActorControl143");
    }

    public void Start() {
      if (subscription != null) {
        subscription.NetworkReceived += new NetworkReceivedDelegate(MessageReceived);
      }
    }

    public void Stop() {
      if (subscription != null)
        subscription.NetworkReceived -= new NetworkReceivedDelegate(MessageReceived);
    }

    // GetOffset, GetEnumValue, GetOpcode copied directly from ngld's OverlayPlugin with deep gratitude
    // Source: https://github.com/ngld/OverlayPlugin/blob/8f147d2cd11fa8c9713be2a8c2296a099bfa54ac/OverlayPlugin.Core/NetworkParser.cs
    private int GetOffset(Type type, string property) {
      int offset = 0;

      foreach (var prop in type.GetFields()) {
        var customOffset = prop.GetCustomAttribute<FieldOffsetAttribute>();
        if (customOffset != null) {
          offset = customOffset.Value;
        }

        if (prop.Name == property) {
          break;
        }

        if (prop.FieldType.IsEnum) {
          offset += Marshal.SizeOf(Enum.GetUnderlyingType(prop.FieldType));
        } else {
          offset += Marshal.SizeOf(prop.FieldType);
        }
      }

      return offset;
    }

    private object GetEnumValue(Type type, string name) {
      foreach (var value in type.GetEnumValues()) {
        if (value.ToString() == name)
          return Convert.ChangeType(value, Enum.GetUnderlyingType(type));
      }

      throw new Exception($"Enum value {name} not found in {type}!");
    }

    private ushort GetOpcode(string name) {
      // FFXIV_ACT_Plugin 2.0.4.14 converted Server_MessageType from enum to struct. Deal with each type appropriately.
      if (MessageType.IsEnum) {
        return (ushort)GetEnumValue(MessageType, name);
      } else {
        var value = MessageType.GetField(name).GetValue(null);
        return (ushort)value.GetType().GetProperty("InternalValue").GetValue(value);
      }
    }

    private unsafe void MessageReceived(string id, long epoch, byte[] message) {
      if (message.Length < ActorControl143_Size)
        return;

      fixed (byte* buffer = message) {
        if (*((ushort*)&buffer[MessageType_Offset]) == ActorControl143_Opcode) {
          ProcessMessage(buffer, message);
        }
      }
    }

    public unsafe void ProcessMessage(byte* buffer, byte[] message) {
      int a = *(ushort*)&buffer[Category_Offset];

      if (a == opcodes[region_].add) {
        AddFate(*(int*)&buffer[Param1_Offset]);
      } else if (a == opcodes[region_].remove) {
        RemoveFate(*(int*)&buffer[Param1_Offset]);
      } else if (a == opcodes[region_].update) {
        int param1 = *(int*)&buffer[Param1_Offset];
        int param2 = *(int*)&buffer[Param2_Offset];
        if (!fates.ContainsKey(param1)) {
          AddFate(param1);
        }
        if (fates[param1] != param2) {
          UpdateFate(param1, param2);
        }
      }
    }

    private void AddFate(int fateID) {
      if (!fates.ContainsKey(fateID)) {
        fates.TryAdd(fateID, 0);
        client_.DispatchToJS(new JSEvents.FateEvent("add", fateID, 0));
      }
    }

    private void RemoveFate(int fateID) {
      if (fates.ContainsKey(fateID)) {
        client_.DispatchToJS(new JSEvents.FateEvent("remove", fateID, fates[fateID]));
        fates.TryRemove(fateID, out _);
      }
    }

    private void UpdateFate(int fateID, int progress) {
      fates.AddOrUpdate(fateID, progress, (int id, int prog) => progress);
      client_.DispatchToJS(new JSEvents.FateEvent("update", fateID, progress));
    }

    public void RemoveAndClearFates() {
      foreach (int fateID in fates.Keys) {
        client_.DispatchToJS(new JSEvents.FateEvent("remove", fateID, fates[fateID]));
      }
      fates.Clear();
    }
  }
}
