using System;
using System.Collections.Generic;
using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin.Common;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using System.Threading;
using System.Net.Http;
using Newtonsoft.Json;

namespace Cactbot {
  //Converts uints to hex formatted strings and vice versa
  public sealed class HexStringJsonConverter : JsonConverter
  {
    public override bool CanConvert(Type objectType)
    {
      return typeof(uint).Equals(objectType);
    }

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
      writer.WriteValue($"0x{value:x}");
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
      if (reader.ValueType.FullName == typeof(string).FullName)
      {
        string str = (string)reader.Value;
        if (str == null || !str.StartsWith("0x"))
          throw new JsonSerializationException();
        return Convert.ToUInt32(str.Substring("0x".Length), 16);
      }
      else
        throw new JsonSerializationException();
    }
  }

  public class FateWatcher {
    private CactbotEventSource client_;
    private IDataSubscription subscription;

    private static readonly string remoteOpcodeURL = "https://katttails.github.io/TestRepo/FATEOpcodes.json";

    bool opcodesLoaded = false;
    List<string> errors = new List<string>();
    private Region OpCodes;

    public struct AC143Category {
      [JsonConverter(typeof(HexStringJsonConverter))]
      public uint add;
      [JsonConverter(typeof(HexStringJsonConverter))]
      public uint remove;
      [JsonConverter(typeof(HexStringJsonConverter))]
      public uint update;
    }

    public struct CEOpcode {
      [JsonConverter(typeof(HexStringJsonConverter))]
      public uint opcode;
      public uint size;
    }

    public struct Region {
      public AC143Category ac143category;
      public CEOpcode ce;
    }

    public struct CEOpcodeList {
      public uint version;
      public Region intl;
      public Region cn;
      public Region ko;
    }

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

    //ActorControl143 parameters are read from FFXIV_ACT_Plugin
    private struct ActorControl143 {
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

    private Type MessageType = null;
    private Type messageHeader = null;
    public int headerOffset = 0;
    public int messageTypeOffset = 0;
    private ActorControl143 actorControl143;

    // fates<fateID, progress>
    private static Dictionary<int, int> fates;
    private static Dictionary<int, CEDirectorData> ces;

    private static string GetRemoteOpcodeJSON(string url) {
      string json = null;
      using (HttpClient http = new HttpClient()) {
        var opcodeTask = http.GetStringAsync(url);
        json = opcodeTask.GetAwaiter().GetResult();
      }
      return json;
    }

    public FateWatcher(CactbotEventSource client, CactbotEventSourceConfig Config, string language) {
      client_ = client;
      CEOpcodeList localOpcodeList = new CEOpcodeList();

      if (!Config.DisableAutomaticOpcodeUpdates) {

        CEOpcodeList remoteOpcodeList = new CEOpcodeList();
        string remoteOpcodeJSON = null;

        try {
          // Do update check
          if (Config.UseCustomOpcodeSource && Config.CustomOpcodeSourceUrl != null) {
            remoteOpcodeJSON = GetRemoteOpcodeJSON(Config.CustomOpcodeSourceUrl);

          // Default url
          } else {
            remoteOpcodeJSON = GetRemoteOpcodeJSON(remoteOpcodeURL);
          }
        } catch (HttpRequestException ex) {
          client_.LogError("Error fetching remote opcodes, using local cache (may be outdated).\r\n" +
            "Exception: {0}", ex.Message);

          if (Config.UseCustomOpcodeSource) {
            client_.LogWarning("The custom url may be invalid.\r\n" +
              "Custom URL: {0}", Config.CustomOpcodeSourceUrl);
          }
        };
        remoteOpcodeList = JsonConvert.DeserializeObject<CEOpcodeList>(remoteOpcodeJSON,
          new JsonSerializerSettings {
            Error = delegate (object sender, Newtonsoft.Json.Serialization.ErrorEventArgs args) {
              errors.Add(args.ErrorContext.Error.Message);
              args.ErrorContext.Handled = true;
            }
          });

        // Successfully got remote opcodes
        if (errors.Count == 0) {

          if (Config.OverlayData["options"]["opcodes"] != null) {
            localOpcodeList = JsonConvert.DeserializeObject<CEOpcodeList>(Config.OverlayData["options"]["opcodes"].ToString());
          }
          if (Config.OverlayData["options"]["opcodes"] == null || remoteOpcodeList.version > localOpcodeList.version) {
            // update local storage
            Config.OverlayData["options"]["opcodes"] = JToken.Parse(JsonConvert.SerializeObject(remoteOpcodeList));
          }

        } else {
          client_.LogError("There were errors encountered parsing the remote opcodes, the local cache has not been updated:\r\n" +
            "{0}", String.Join("\n", errors));
        }
        errors.Clear();
        // We finished the update check and updated our local file if necessary
      }

      localOpcodeList = JsonConvert.DeserializeObject<CEOpcodeList>(Config.OverlayData["options"]["opcodes"].ToString(),
          new JsonSerializerSettings {
            Error = delegate (object sender, Newtonsoft.Json.Serialization.ErrorEventArgs args) {
              errors.Add(args.ErrorContext.Error.Message);
              args.ErrorContext.Handled = true;
            }
          });

      if (errors.Count > 0) {
        client_.LogError("There were errors encountered parsing the local opcodes:\r\n" +
          "{0}" +
          "FATE/CE data is unavailable.", String.Join("\n", errors));
        return;
      }

      if (language == "ko")
        OpCodes = localOpcodeList.ko;
      else if (language == "cn")
        OpCodes = localOpcodeList.cn;
      else
        OpCodes = localOpcodeList.intl;

      opcodesLoaded = true;
      client_.LogInfo("Opcode version: {0}", localOpcodeList.version);

      fateSemaphore = new SemaphoreSlim(0, 1);
      ceSemaphore = new SemaphoreSlim(0, 1);

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
      if (subscription != null && opcodesLoaded == true) {
        subscription.NetworkReceived += new NetworkReceivedDelegate(MessageReceived);
      }
    }

    public void Stop() {
      if (subscription != null && opcodesLoaded == true)
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
      if (message.Length < actorControl143.size && message.Length < OpCodes.ce.size)
        return;

      fixed (byte* buffer = message) {
        if (*(ushort*)&buffer[messageTypeOffset] == actorControl143.opCode) {
          ProcessActorControl143(buffer, message);
          return;
        }
        if (*(ushort*)&buffer[messageTypeOffset] == OpCodes.ce.opcode) {
          ProcessCEDirector(buffer, message);
          return;
        }
      }
    }

    public unsafe void ProcessActorControl143(byte* buffer, byte[] message) {
      int a = *(ushort*)&buffer[actorControl143.categoryOffset];

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

      fateSemaphore.WaitAsync();
      try {
        if (a == OpCodes.ac143category.add) {
          AddFate(*(int*)&buffer[actorControl143.param1Offset]);
        } else if (a == OpCodes.ac143category.remove) {
          RemoveFate(*(int*)&buffer[actorControl143.param1Offset]);
        } else if (a == OpCodes.ac143category.update) {
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
      if (ces != null) {
        foreach (int ceKey in ces.Keys) {
          client_.DoCEEvent(new JSEvents.CEEvent("remove", JObject.FromObject(ces[ceKey])));
        }
        ces.Clear();
      }
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
      if (fates != null) {
        foreach (int fateID in fates.Keys) {
          client_.DoFateEvent(new JSEvents.FateEvent("remove", fateID, fates[fateID]));
        }
        fates.Clear();
      }
    }
  }
}
