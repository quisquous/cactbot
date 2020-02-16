using Machina.FFXIV;
using Machina.FFXIV.Headers;

namespace Cactbot {
  class FateWatcherIntl : FateWatcher {

    public FateWatcherIntl(CactbotEventSource client) : base(client) {
      monitor = new FFXIVNetworkMonitor {
        MessageReceived = (string connection, long epoch, byte[] message) => MessageReceived(message)
      };
    }
    internal unsafe override void MessageReceived(byte[] message) {
      if (message.Length < sizeof(Server_MessageHeader))
        return;

      fixed (byte* buffer = message) {
        Server_MessageHeader serverMessageHeader = *(Server_MessageHeader*)buffer;
        if (serverMessageHeader.MessageType == Server_MessageType.ActorControl143)
          ProcessMessage(*(Server_ActorControl143*)buffer);

        // Sent upon client logout
        if (serverMessageHeader.MessageType == (Server_MessageType)0x142) {
          RemoveAndClearFates();
        }
      }
    }
  }
}