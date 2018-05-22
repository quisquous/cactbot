using System;
using System.Collections.Generic;

namespace Cactbot {
  class WipeDetector {
    // How long to wait for subsequent logs to know if an event was alone
    // or not.
    private const int kLogWaitSeconds = 2;

    public WipeDetector(CactbotOverlay client) {
      this.client_ = client;
      client_.OnPlayerChanged += OnPlayerChanged;
      client_.OnLogsChanged += OnLogsChanged;
    }

    private CactbotOverlay client_;
    private bool player_dead_ = false;
    private string player_name_ = null;
    private string player_name_with_colons_ = null;
    // Filled in later with player name.
    private string[] weakness_strs_ = new string[8];
    private string[] lb3_strs_ = {
      ":Pulse Of Life:",
      ":Pulsation Vitale:",
      ":Lebenspuls:",
      ":生命の鼓動:",
      ":Angel Feathers:",
      ":Plumes D'ange:",
      ":Engelsfedern:",
      ":エンジェルフェザー:",
      ":Astral Stasis:",
      ":Astrale Stasis:",
      ":星天開門:",
      ":Équilibre Astral:",
      ":Flames Of Rebirth:",
      ":Feu Résurrecteur:",
      ":Flammen Der Wiedergeburt:",
      ":転生の炎:",
  };

    private DateTime? last_revived_time_;
    private DateTime? last_lb3_time_;

    private void WipeIt() {
      this.player_dead_ = false;
      this.last_revived_time_ = null;
      client_.Wipe();
    }

    public void OnPlayerChanged(JSEvents.PlayerChangedEvent player) {
      if (player_name_ == null) {
        player_name_ = player.name;
        player_name_with_colons_ = ":" + player.name + ":";
        weakness_strs_[0] = " 1A:" + player_name_ + " gains the effect of Weakness from";
        weakness_strs_[1] = " 1A:" + player_name_ + " gains the effect of Brink Of Death from";
        weakness_strs_[2] = " 1A:" + player_name_ + " gains the effect of Affaiblissement from";
        weakness_strs_[3] = " 1A:" + player_name_ + " gains the effect of Mourant from";
        weakness_strs_[4] = " 1A:" + player_name_ + " gains the effect of Schwäche from";
        weakness_strs_[5] = " 1A:" + player_name_ + " gains the effect of Sterbenselend from";
        weakness_strs_[6] = " 1A:" + player_name_ + " gains the effect of 衰弱 from";
        weakness_strs_[7] = " 1A:" + player_name_ + " gains the effect of 衰弱［強］ from";
      }

      var now = DateTime.Now;

      // Note: can't use "You were revived" from log, as it doesn't happen for
      // fights that auto-restart when everybody is defeated.
      if (!player_dead_ && player.currentHP == 0) {
        player_dead_ = true;
        last_lb3_time_ = null;
      } else if (player_dead_ && player.currentHP > 0) {
        player_dead_ = false;
        last_revived_time_ = now;

        // If an LB3 hit the player recently, then it wasn't a wipe so just
        // forget that they were revived.
        if (last_lb3_time_.HasValue && (now - last_lb3_time_.Value).TotalSeconds <= kLogWaitSeconds) {
          last_revived_time_ = null;
        }
      }

      // Heuristic: if a player is revived and a weakness message doesn't happen
      // soon after, then it was a wipe.
      if (last_revived_time_.HasValue && (now - last_revived_time_.Value).TotalSeconds > kLogWaitSeconds) {
        WipeIt();
      }
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      if (player_name_ == null)
        return;

      foreach (var log in e.logs) {
        if (log.IndexOf("cactbot wipe", StringComparison.Ordinal) != -1) {
          // FIXME: only allow echos to do this vs jerks saying this in chat.
          WipeIt();
        }
        // To avoid 10+ string comparisons per log entry, check player name first.
        int player_index = log.IndexOf(player_name_, StringComparison.Ordinal);
        if (player_index == -1)
          continue;

        // TODO: this should support all languages.
        foreach (var str in weakness_strs_) {
          if (log.IndexOf(str, StringComparison.Ordinal) != -1) {
            // Players come back to life before weakness is applied.
            // Players do gain 9999.00 seconds of Weakness when they die a second time,
            // but this happens even before the defeated message occurs.  So, this next
            // case will only occur when the player has been brought back to life,
            // because we check player_dead.
            if (!player_dead_ && last_revived_time_.HasValue) {
              // This is a raise of some sort, and not a wipe.
              last_revived_time_ = null;
              break;
            }
          }
        }

        // This happens prior to the player's health becoming non-zero, so record when it happens.
        // Lazy regex for :Healer LB3:.*:Player Name:
        int healer_lb3 = -1;
        foreach (var str in lb3_strs_) {
          healer_lb3 = Math.Max(healer_lb3, log.IndexOf(str, StringComparison.Ordinal));
        }
        if (healer_lb3 >= 0) {
          int player_colon_index = log.IndexOf(player_name_with_colons_, StringComparison.Ordinal);
          if (player_colon_index > healer_lb3) {
            last_lb3_time_ = DateTime.Now;
          }
        }

        // TODO: maybe do something for steps of faith too, where you can
        // return mid-fight and res without weakness.  <_<
      }
    }
  }
}