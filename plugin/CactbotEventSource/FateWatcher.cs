using System;
using System.Collections.Generic;
using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin.Common;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using System.Threading;

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
    private struct AC143OPCodes {
      public AC143OPCodes(int add_, int remove_, int update_) { this.add = add_; this.remove = remove_; this.update = update_; }
      public int add;
      public int remove;
      public int update;
    };
    private static readonly AC143OPCodes ac143_v5_2 = new AC143OPCodes(
      0x935,
      0x936,
      0x93E
    );

    private struct CEDirectorOPCodes {
      public CEDirectorOPCodes(int size_, int opcode_) { this.size = size_; this.opcode = opcode_; }
      public int size;
      public int opcode;
    }
    //
    // CE Opcode History
    // Intl
    // v5.35            0x299
    // v5.35h           0x143
    // v5.40            0x3c1
    // v5.40h           0x31b
    // v5.41            0x31B
    // v5.45            0x3e1
    // v5.45h           0x1f5
    // v5.5             0x2e7
    // v5.5h            0x160
    // v5.55            0x1ac
    // v5.55h           0x248
    //
    // CN
    // v5.35            0x144
    // v5.40            0x129
    // v5.41            0x0120
    //
    // KR
    // v5.35            0x0347
    //

    private static readonly CEDirectorOPCodes cedirector_ko = new CEDirectorOPCodes(
      0x30,
      0x0347
    );

    private static readonly CEDirectorOPCodes cedirector_cn = new CEDirectorOPCodes(
      0x30,
      0x0120
    );

    private static readonly CEDirectorOPCodes cedirector_intl = new CEDirectorOPCodes(
      0x30,
      0x248
    );

    private struct ActorControl143{
      public ActorControl143(Type messagetype_, Assembly assembly_) {
        packetType = assembly_.GetType("Machina.FFXIV.Headers.Server_ActorControl143");
        size = Marshal.SizeOf(packetType);
        categoryOffset = GetOffset(packetType, "category");
        param1Offset = GetOffset(packetType, "param1");
        param2Offset = GetOffset(packetType, "param2");
        opCode = GetOpcode(messagetype_, "ActorControl143");
      }
      public Type packetType;
      public int size;
      public int categoryOffset;
      public int param1Offset;
      public int param2Offset;
      public int opCode;
    };

    [Serializable]
    [StructLayout(LayoutKind.Explicit)]
    public struct CEDirectorData {

      [FieldOffset(0x20)]
      public uint popTime;
      [FieldOffset(0x24)]
      public ushort timeRemaining;
      [FieldOffset(0x28)]
      public byte ceKey;
      [FieldOffset(0x29)]
      public byte numPlayers;
      [FieldOffset(0x2A)]
      public byte status;
      [FieldOffset(0x2C)]
      public byte progress;
    };

    private static SemaphoreSlim fateSemaphore;
    private static SemaphoreSlim ceSemaphore;
    private Dictionary<string, AC143OPCodes> ac143opcodes = null;
    private Dictionary<string, CEDirectorOPCodes> cedirectoropcodes = null;

    private Type MessageType = null;
    private Type messageHeader = null;
    public int headerOffset = 0;
    public int messageTypeOffset = 0;
    private ActorControl143 actorControl143;

    // fates<fateID, progress>
    private static Dictionary<int, int> fates;
    private static Dictionary<int, CEDirectorData> ces;

    public FateWatcher(CactbotEventSource client, string language) {
      client_ = client;
      if (language == "ko")
        region_ = "ko";
      else if (language == "cn")
        region_ = "cn";
      else
        region_ = "intl";

      fateSemaphore = new SemaphoreSlim(0, 1);
      ceSemaphore = new SemaphoreSlim(0, 1);
      ac143opcodes = new Dictionary<string, AC143OPCodes>();
      ac143opcodes.Add("ko", ac143_v5_2);
      ac143opcodes.Add("cn", ac143_v5_2);
      ac143opcodes.Add("intl", ac143_v5_2);

      cedirectoropcodes = new Dictionary<string, CEDirectorOPCodes>();
      cedirectoropcodes.Add("ko", cedirector_ko);
      cedirectoropcodes.Add("cn", cedirector_cn);
      cedirectoropcodes.Add("intl", cedirector_intl);

      fates = new Dictionary<int, int>();
      ces = new Dictionary<int, CEDirectorData>();

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

      actorControl143 = new ActorControl143(MessageType, mach);
      headerOffset = GetOffset(actorControl143.packetType, "MessageHeader");
      messageHeader = actorControl143.packetType.GetField("MessageHeader").FieldType;
      messageTypeOffset = headerOffset + GetOffset(messageHeader, "MessageType");
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
    private static int GetOffset(Type type, string property) {
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

    private static object GetEnumValue(Type type, string name) {
      foreach (var value in type.GetEnumValues()) {
        if (value.ToString() == name)
          return Convert.ChangeType(value, Enum.GetUnderlyingType(type));
      }

      throw new Exception($"Enum value {name} not found in {type}!");
    }

    private static ushort GetOpcode(Type type, string name) {
      // FFXIV_ACT_Plugin 2.0.4.14 converted Server_MessageType from enum to struct. Deal with each type appropriately.
      if (type.IsEnum) {
        return (ushort)GetEnumValue(type, name);
      } else {
        var value = type.GetField(name).GetValue(null);
        return (ushort)value.GetType().GetProperty("InternalValue").GetValue(value);
      }
    }

    private unsafe void MessageReceived(string id, long epoch, byte[] message) {
      if (message.Length < actorControl143.size && message.Length < cedirectoropcodes[region_].size)
        return;

      fixed (byte* buffer = message) {
        if (*(ushort*)&buffer[messageTypeOffset] == actorControl143.opCode) {
          ProcessActorControl143(buffer, message);
          return;
        }
        if (cedirectoropcodes.ContainsKey(region_)) {
          if (*(ushort*)&buffer[messageTypeOffset] == cedirectoropcodes[region_].opcode) {
            ProcessCEDirector(buffer, message);
            return;
          }
        }
      }
    }

    public unsafe void ProcessActorControl143(byte* buffer, byte[] message) {
      int a = *(ushort*)&buffer[actorControl143.categoryOffset];

      fateSemaphore.WaitAsync();
      try {
        if (a == ac143opcodes[region_].add) {
          AddFate(*(int*)&buffer[actorControl143.param1Offset]);
        } else if (a == ac143opcodes[region_].remove) {
          RemoveFate(*(int*)&buffer[actorControl143.param1Offset]);
        } else if (a == ac143opcodes[region_].update) {
          int param1 = *(int*)&buffer[actorControl143.param1Offset];
          int param2 = *(int*)&buffer[actorControl143.param2Offset];
          if (!fates.ContainsKey(param1)) {
            AddFate(param1);
          }
          if (fates[param1] != param2) {
            UpdateFate(param1, param2);
          }
        }
      } finally {
        fateSemaphore.Release();
      }
    }

    public unsafe void ProcessCEDirector(byte* buffer, byte[] message) {
      CEDirectorData data = *(CEDirectorData*)&buffer[0];

      ceSemaphore.WaitAsync();
      try {
        if (data.status != 0 && !ces.ContainsKey(data.ceKey)) {
          AddCE(data);
          return;
        } else {

          // Don't update if key is about to be removed
          if (!ces[data.ceKey].Equals(data) &&
            data.status != 0) {
            UpdateCE(data.ceKey, data);
            return;
          }

          // Needs removing
          if (data.status == 0) {
            RemoveCE(data);
            return;
          }
        }
      } finally {
        ceSemaphore.Release();
      }
    }

    private void AddCE(CEDirectorData data) {
      ces.Add(data.ceKey, data);
      client_.DoCEEvent(new JSEvents.CEEvent("add", JObject.FromObject(data)));
    }

    private void RemoveCE(CEDirectorData data) {
      if (ces.ContainsKey(data.ceKey)) {
        client_.DoCEEvent(new JSEvents.CEEvent("remove", JObject.FromObject(data)));
        ces.Remove(data.ceKey);
      }
    }
    private void UpdateCE(byte ceKey, CEDirectorData data) {
      ces[data.ceKey] = data;
      client_.DoCEEvent(new JSEvents.CEEvent("update", JObject.FromObject(data)));
    }

    public void RemoveAndClearCEs() {
      foreach (int ceKey in ces.Keys) {
        client_.DoCEEvent(new JSEvents.CEEvent("remove", JObject.FromObject(ces[ceKey])));
      }
      ces.Clear();
    }

    private void AddFate(int fateID) {
      if (!fates.ContainsKey(fateID)) {
        fates.Add(fateID, 0);
        client_.DoFateEvent(new JSEvents.FateEvent("add", fateID, 0));
      }
    }

    private void RemoveFate(int fateID) {
      if (fates.ContainsKey(fateID)) {
        client_.DoFateEvent(new JSEvents.FateEvent("remove", fateID, fates[fateID]));
        fates.Remove(fateID);
      }
    }

    private void UpdateFate(int fateID, int progress) {
      fates[fateID] = progress;
      client_.DoFateEvent(new JSEvents.FateEvent("update", fateID, progress));
    }

    public void RemoveAndClearFates() {
      foreach (int fateID in fates.Keys) {
        client_.DoFateEvent(new JSEvents.FateEvent("remove", fateID, fates[fateID]));
      }
      fates.Clear();
    }
  }
}
