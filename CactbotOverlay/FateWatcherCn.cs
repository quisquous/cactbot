using Machina.FFXIV;
using Machina.FFXIV.Headers;

namespace Cactbot {
  class FateWatcherCn : FateWatcher {
    //
    // for FFXIV CN version: 5.01
    //
    // Latest CN version can be found at:
    // http://ff.sdo.com/web8/index.html#/patchnote
    //
    // TODO: Unknown CN opcode
    private const ushort Server_MessageTypeActorControl143 = 227;

    public FateWatcherCn(CactbotEventSource client) : base(client) {
      monitor = new FFXIVNetworkMonitor {
        MessageReceived = (string connection, long epoch, byte[] message) => MessageReceived(message)
      };
    }
    internal unsafe override void MessageReceived(byte[] message) {
      if (message.Length < sizeof(Server_MessageHeader))
        return;

      fixed (byte* buffer = message) {
        Server_MessageHeader serverMessageHeader = *(Server_MessageHeader*)buffer;
        if ((ushort)serverMessageHeader.MessageType == Server_MessageTypeActorControl143)
          ProcessMessage(*(Server_ActorControl143*)buffer);

        // Sent upon client logout
        if (serverMessageHeader.MessageType == (Server_MessageType)0x142) {
          RemoveAndClearFates();
        }
      }
    }
  }
}