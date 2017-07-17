using System;
using System.Collections.Generic;
using Tamagawa.EnmityPlugin;

namespace Cactbot {
  class WipeDetector {
    public WipeDetector(CactbotOverlay client) {
      this.client_ = client;
      client_.OnPlayerChanged += OnPlayerChanged;
      client_.OnLogsChanged += OnLogsChanged;
    }

    private CactbotOverlay client_;
    private bool player_dead_ = false;
    private string player_name_ = "";
    private DateTime? last_revived_time_;

    public void OnPlayerChanged(JSEvents.PlayerChangedEvent player) {
      player_name_ = player.name;

      // Note: can't use "You were revived" from log, as it doesn't happen for
      // fights that auto-restart when everybody is defeated.
      if (!player_dead_ && player.currentHP == 0) {
        client_.LogInfo("Wipe: player dead");
        player_dead_ = true;
      } else if (player_dead_ && player.currentHP > 0) {
        client_.LogInfo("Wipe: player revived");
        player_dead_ = false;
        last_revived_time_ = DateTime.Now;
      }

      // Heuristic: if a player is revived and a second passes without
      // a weakness message, then it was a wipe.
      if (last_revived_time_.HasValue) {
        if ((DateTime.Now - last_revived_time_.GetValueOrDefault()).TotalSeconds > 1) {
          client_.LogInfo("Wipe: actual wipe");
          client_.Wipe();
        }
      }
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      foreach (var log in e.logs) {
        // TODO: this should support other languages.
        if (log.IndexOf("You suffer the effect of Weakness") != -1) {
          // Players come back to life before weakness is applied.
          if (!player_dead_ && last_revived_time_.HasValue) {
            // This is a raise of some sort, and not a wipe.
            client_.LogInfo("Wipe: raise");
            last_revived_time_ = null;
          }
        } else if (log.IndexOf("cactbot wipe") != -1) {
          // FIXME: only allow echos to do this vs jerks saying this in chat.
          client_.LogInfo("Wipe: test wipe");
          client_.Wipe();
        } else {
          // TODO: Remove debugging info once it's clear whether pulse of life happens before or after
          // player hp becomes non-zero.  If it's before, then a timer will need to be added (similar
          // to the weakness timer.  If after, then this can just clear the weakness timer simply.

          // Lazy regex for :Healer LB3:.*:Player Name:
          int healer_lb3 = Math.Max(
            log.IndexOf(":Pulse Of Life:"),
            Math.Max(log.IndexOf(":Angel Feathers:"),
                     log.IndexOf(":Astral Stasis:")));
          if (healer_lb3 >= 0) {
            if (log.IndexOf(":" + player_name_ + ":") > healer_lb3) {
              client_.LogInfo("Wipe: player hit by lb3");
            } else {
              client_.LogInfo("Wipe: player not hit by lb3");
            }
          }
        }

        // TODO: maybe do something for steps of faith too, where you can
        // return mid-fight and res without weakness.  <_<
      }
    }
  }
}