'use strict';

// Will redirect calls from `onPlayerChangedEvent` to |func| overriding with
// |playerName| and their job.  Job is important for raidboss.
// It might be nice to do HP, because otherwise the math section of
// Ridorana Lighthouse won't work.
//
// Other parts of the player (such that would help the jobs overlay run)
// are deliberately not included here, because it's impossible to run
// jobs remotely due to gauge data being local and many bits of information
// loaded from memory.

function addPlayerChangedOverrideListener(playerName, func) {
  if (!func)
    return;

  let lastPlayerChangedEvent = null;
  let lastPlayerJob = null;

  const onPlayerChanged = (e) => {
    if (playerName) {
      e.detail.name = playerName;
      if (lastPlayerJob) {
        // Use the non-overridden job if we don't know an overridden one.
        e.detail.job = lastPlayerJob;
      }
    }
    lastPlayerChangedEvent = e;

    func(e);
  };

  window.addOverlayListener('onPlayerChangedEvent', onPlayerChanged);
  window.addOverlayListener('PartyChanged', (e) => {
    const player = e.party.find((p) => p.name === playerName);
    if (!player)
      return;

    const newJob = Util.jobEnumToJob(player.job);
    if (newJob === lastPlayerJob)
      return;

    lastPlayerJob = newJob;
    // This event may come before the first onPlayerChangedEvent.
    if (lastPlayerChangedEvent)
      onPlayerChanged(lastPlayerChangedEvent);
  });
}
