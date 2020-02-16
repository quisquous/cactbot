using System.Collections.Generic;
using Machina.FFXIV;
using Machina.FFXIV.Headers;

namespace Cactbot {
  public abstract class FateWatcher {
    private CactbotEventSource client_;

    // fates<fateID, progress>
    private Dictionary<int, int> fates;
    internal FFXIVNetworkMonitor monitor = null;

    public FateWatcher(CactbotEventSource client) {
      client_ = client;
      fates = new Dictionary<int, int>();
    }
    public void Start() {
      monitor.Start();
    }

    public void Stop() {
      monitor.Stop();
    }

    internal abstract void MessageReceived(byte[] message);

    public void ProcessMessage(Server_ActorControl143 packetMessage) {

      // Fate Start: 0x74
      // param1: fateID
      // param2: unknown
      if ((int)packetMessage.category == 0x74) {
        AddFate((int)packetMessage.param1);
      }

      // Fate End: 0x79
      // param1: fateID
      if ((int)packetMessage.category == 0x79) {
        RemoveFate((int)packetMessage.param1);
      }

      // Fate Progress: 0x9B
      // param1: fateID
      // param2: progress (0-100)
      if ((int)packetMessage.category == 0x9B) {

        if (!fates.ContainsKey((int)packetMessage.param1)) {
          AddFate((int)packetMessage.param1);
        }
        if (fates[(int)packetMessage.param1] != (int)packetMessage.param2) {
          UpdateFate((int)packetMessage.param1, (int)packetMessage.param2);
        }
      }
    }

    private void AddFate(int fateID) {

      if (!fates.ContainsKey(fateID)) {
        client_.DoFateEvent(new JSEvents.FateEvent("add", fateID, 0));
        fates.Add(fateID, 0);
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

    internal void RemoveAndClearFates() {
      foreach (int fateID in fates.Keys) {
        client_.DoFateEvent(new JSEvents.FateEvent("remove", fateID, fates[fateID]));
      }
      fates.Clear();
    }
  }
}