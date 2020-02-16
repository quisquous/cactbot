using Machina.FFXIV;
using Machina.FFXIV.Headers;

namespace Cactbot {
  class FateWatcherKo : FateWatcher {
    //
    // for FFXIV KO version: 5.01
    //
    // Latest KO version can be found at:
    // https://www.ff14.co.kr/news/notice?category=3
    //
    private const ushort Server_MessageTypeActorControl143 = 323;

    public FateWatcherKo(CactbotEventSource client) : base(client) {
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